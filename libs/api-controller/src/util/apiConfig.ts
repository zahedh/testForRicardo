import {Environment, queryClient, setApiLibEnv} from '@smarty-app/api';
import {QueryClient} from '@tanstack/react-query';

/**
 * Set the environment.
 *
 * @param environment - The {@link Environment} to use.
 */
export function setApiEnv(environment: Environment): void {
  setApiLibEnv(environment);
}

/**
 * Accessing API query client.
 *
 * @returns a {@link QueryClient} object.
 */
export function getQueryClient(): QueryClient {
  return queryClient;
}

/**
 * Clears the cache of the API query client.
 * This function cancels any ongoing queries and clears all cached data.
 *
 * @returns A promise that resolves once the cache has been cleared.
 */
export async function clearQueryClientCache(): Promise<void> {
  const queryClient = getQueryClient();
  try {
    await queryClient.cancelQueries();
  } finally {
    queryClient.clear();
  }
}
