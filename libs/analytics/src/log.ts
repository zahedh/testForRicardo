/* eslint-disable no-console */
import {isDevelopment} from '@smarty-app/util-generic';
import {toString} from 'lodash';

/**
 * Logs an error.
 * Currently this just logs to console, but in the future this will go to DataDog or similar.
 *
 * @param componentName - The name of the component that is logging the error.
 * @param message - The message to log.
 * @param error - The error to log - usually the error itself, wrapped in an object.
 */
export function errorLog(
  componentName: string,
  message: string,
  error?: unknown,
): void {
  let errorMessage: string;
  if (!error) {
    errorMessage = '';
  } else if (error instanceof TypeError) {
    errorMessage = error.message;
  } else {
    errorMessage = toString(error);
  }
  if (isDevelopment) {
    console.log(
      `errorLog: ${componentName} <${message}> ${errorMessage}`,
      error,
    );
  }
}

/**
 * Currently this just logs to console, but in the future this will go to DataDog or similar.
 *
 * @param componentName - The name of the component that is logging the error.
 * @param message - The message to log.
 * @param data - Additional data to log.
 */
export function trackingLog(
  componentName: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  if (isDevelopment) {
    console.log(`trackingLog: ${componentName} <${message}>`, data);
  }
}

/**
 * Logs an error to the console.
 *
 * @param componentName - The name of the component that logged the error.
 * @param message - The error message.
 * @param data - Additional data to log.
 */
export function consoleLog(
  componentName: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  if (isDevelopment) {
    console.log(`consoleLog: ${componentName} <${message}>`, data);
  }
}
