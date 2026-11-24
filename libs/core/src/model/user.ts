import {SmartyDate} from './smartyDate';

export interface User {
  title: string;
  firstNames: string;
  surname: string;
  email: string;
  contactPhoneNumber: string;
  dateOfBirth: SmartyDate;
}

/**
 * Formats a user's full name.
 *
 * @param user The user whose name to format.
 * @returns The full name, or undefined if the user has no name.
 */
export function formatUserName(user: User): string | undefined {
  return `${user.firstNames} ${user.surname}`.trim() || undefined;
}
