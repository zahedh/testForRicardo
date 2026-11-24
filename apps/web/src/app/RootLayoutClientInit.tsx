'use client';

import {setApiEnv} from '@smarty-app/api-controller';

import {initializeMockApi} from '@/app/mockApi';

setApiEnv({
  timeout: 20000,
});

initializeMockApi();

/**
 * Component that performs initializations within RootLayoutClient.
 *
 * @returns null - This component doesn't render anything
 */
export function RootLayoutClientInit(): null {
  return null;
}
