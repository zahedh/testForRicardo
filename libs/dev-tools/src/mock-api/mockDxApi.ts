import {consoleLog} from '@smarty-app/analytics';
import {Config} from '@smarty-app/core';
import {EditSubscriber, Payment, Subscriber} from '@smarty-app/dx-api';

import {
  applySubscriberEdit,
  createMockPayments,
  createNewMockPayment,
  MOCK_SUBSCRIBER,
} from './mockData';

const COMPONENT = 'mockDxApi';

/**
 * Which situation the mock API acts out, to try each state of the screens.
 *
 * - `default`: everything succeeds.
 * - `empty`: the subscriber has no payments.
 * - `error`: the first request for payment history fails; retrying succeeds.
 * - `next-page-error`: the first request for each later page of payment
 *   history fails; retrying succeeds.
 */
export type MockApiScenario = 'default' | 'empty' | 'error' | 'next-page-error';

const SCENARIOS: ReadonlyArray<MockApiScenario> = [
  'default',
  'empty',
  'error',
  'next-page-error',
];

/** Long enough to see loading states, short enough not to get in the way. */
const MOCK_LATENCY_MS = 1000;

/**
 * @param value - A scenario name, e.g. from an environment variable.
 * @returns The matching scenario, or `default` if it isn't one.
 */
export function parseMockApiScenario(value?: string): MockApiScenario {
  return SCENARIOS.find((scenario) => scenario === value) ?? 'default';
}

/**
 * @param status - The HTTP status.
 * @param body - The JSON body, if any.
 * @returns A response like the real API's.
 */
function jsonResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  });
}

/**
 * @param detail - What went wrong.
 * @returns A 500 response with a problem detail body.
 */
function serverError(detail: string): Response {
  return jsonResponse(500, {
    status: 500,
    title: 'Internal Server Error',
    detail,
  });
}

/**
 * Waits like a network request would, and rejects if the request is aborted.
 *
 * @param signal - The request's abort signal.
 */
function simulateLatency(signal?: AbortSignal | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const abortError = (): Error =>
      Object.assign(new Error('The request was aborted.'), {
        name: 'AbortError',
      });

    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, MOCK_LATENCY_MS);

    /** Stops waiting when the request is aborted. */
    function onAbort(): void {
      clearTimeout(timer);
      reject(abortError());
    }

    signal?.addEventListener('abort', onAbort);
  });
}

/**
 * Creates a `fetch` replacement that answers the DX API endpoints the app uses
 * from in-memory data. Data lives as long as the app does, so an email change
 * shows up on the account screen, and is reset on reload.
 *
 * Each pull-to-refresh adds a new payment at the top of the list, so a refresh
 * is visible.
 *
 * @param scenario - The situation to act out {@link MockApiScenario}.
 * @returns A function with the same signature as `fetch`.
 */
export function createMockDxApiFetch(
  scenario: MockApiScenario = 'default',
): typeof fetch {
  let subscriber: Subscriber = {...MOCK_SUBSCRIBER};
  const payments: Payment[] = scenario === 'empty' ? [] : createMockPayments();
  let firstPageRequests = 0;
  const failedPages = new Set<number>();

  /**
   * @param url - The request URL.
   * @returns The page of payment history the request asks for.
   */
  function getPaymentPage(url: URL): Response {
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    if (page === 0) {
      firstPageRequests++;
      if (scenario === 'error' && firstPageRequests === 1) {
        return serverError('Mock: payment history failed to load.');
      }
      if (firstPageRequests > 1 && scenario !== 'empty') {
        payments.unshift(createNewMockPayment(firstPageRequests));
      }
    } else if (scenario === 'next-page-error' && !failedPages.has(page)) {
      failedPages.add(page);
      return serverError(`Mock: page ${page} failed to load.`);
    }

    return jsonResponse(200, payments.slice(page * size, (page + 1) * size));
  }

  return (async (input, init) => {
    const rawUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const url = new URL(rawUrl, 'http://mock.invalid');
    const method = (init?.method ?? 'GET').toUpperCase();

    consoleLog(COMPONENT, `${method} ${url.pathname}${url.search}`);
    await simulateLatency(init?.signal);

    const path = url.pathname.replace(/\/+$/, '');
    if (path.endsWith('/subscriber/payment') && method === 'GET') {
      return getPaymentPage(url);
    }
    if (path.endsWith('/subscriber')) {
      if (method === 'GET') {
        return jsonResponse(200, subscriber);
      }
      if (method === 'PUT') {
        const edit = JSON.parse(String(init?.body ?? '{}')) as EditSubscriber;
        subscriber = applySubscriberEdit(subscriber, edit);
        return jsonResponse(200, subscriber);
      }
    }

    return jsonResponse(404, {
      status: 404,
      title: 'Not Found',
      detail: `Mock: no handler for ${method} ${url.pathname}`,
    });
  }) as typeof fetch;
}

/**
 * Sends every DX API request to the mock API instead of the network.
 *
 * @param scenario - The situation to act out {@link MockApiScenario}.
 */
export function enableMockDxApi(scenario: MockApiScenario = 'default'): void {
  consoleLog(COMPONENT, `Mock DX API enabled (scenario: ${scenario})`);
  Config.setFetch(createMockDxApiFetch(scenario));
}
