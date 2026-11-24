/**
 * Checks if a string is a valid email address.
 *
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
}
