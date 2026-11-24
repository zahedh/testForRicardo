'use client';

import {consoleLog} from '@smarty-app/analytics';
import {Config} from '@smarty-app/core';
import {Api as DxApi} from '@smarty-app/dx-api';
import pick from 'lodash/pick';

const COMPONENT = 'DxApiWrapper';

export class DxApiWrapper extends DxApi<unknown> {
  /**
   * Sends requests through `Config.fetch` if set (e.g. the mock API), or the
   * global `fetch`, logging each one.
   */
  constructor() {
    super({
      baseUrl: Config.apiBaseUrl,
      customFetch: (async (
        ...fetchParams: Parameters<typeof fetch>
      ): Promise<Awaited<ReturnType<typeof fetch>>> => {
        const [url, options] = fetchParams;
        consoleLog(
          COMPONENT,
          `DX API Request: ${url}`,
          pick(options, 'method'),
        );
        const fetchFn = Config.fetch ?? fetch;
        return fetchFn(...fetchParams);
      }) as typeof fetch,
    });
  }
}

/**
 * Create an API instance.
 *
 * @returns An {@link DxApi} instance.
 */
export function createDxApi(): DxApiWrapper {
  return new DxApiWrapper();
}

/**
 * Get a DxApiWrapper instance.
 *
 * @returns A DxApiWrapper instance.
 */
export function useDxApi(): DxApiWrapper {
  return createDxApi();
}
