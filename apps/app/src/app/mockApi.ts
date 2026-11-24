import {enableMockDxApi, parseMockApiScenario} from '@smarty-app/dev-tools';

/**
 * True to run against in-memory mock data instead of the DX API. On by
 * default; set `EXPO_PUBLIC_MOCK_API=false` to use
 * the real API.
 */
export const MOCK_API_ENABLED = process.env.EXPO_PUBLIC_MOCK_API !== 'false';

/**
 * Sends API requests to the mock API if it is enabled. Call once, before the
 * app renders.
 */
export function initializeMockApi(): void {
  if (MOCK_API_ENABLED) {
    enableMockDxApi(
      parseMockApiScenario(process.env.EXPO_PUBLIC_MOCK_API_SCENARIO),
    );
  }
}
