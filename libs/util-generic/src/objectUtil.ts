/**
 * @param condition - The condition to assert.
 * @param message - The message to include in the error if the assertion fails.
 *
 * @throws {Error} If the condition is falsy.
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Safely parses a JSON object from a string.
 *
 * @param input - The input string.
 *
 * @returns The parsed object, or undefined if parsing fails.
 */
export function safeJsonObject(
  input: string,
): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore
  }

  return undefined;
}
