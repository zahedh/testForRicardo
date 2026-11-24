interface AppConfig {
  apiBaseUrl: string;
}

export const Config = {
  apiBaseUrl: '',

  /**
   * Replaces the network for API requests, e.g. with a mock API in
   * development. Undefined to use the global `fetch`.
   */
  fetch: undefined as typeof fetch | undefined,

  initialize(config: AppConfig) {
    this.apiBaseUrl = config.apiBaseUrl;
  },

  /**
   * @param fetchFn - The function API requests are sent through, or undefined
   * to use the global `fetch`.
   */
  setFetch(fetchFn: typeof fetch | undefined) {
    this.fetch = fetchFn;
  },
};
