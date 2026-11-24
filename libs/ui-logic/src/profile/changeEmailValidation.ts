import {isValidEmailAddress} from '@smarty-app/util-generic';

export interface ChangeEmailValidation {
  /** Whether the new email passes all validation checks and can be submitted. */
  isEmailValid: boolean;
  /** Whether the new email is non-empty but fails email format validation. */
  showInvalidEmail: boolean;
  /** Whether the new email is non-empty but matches the current email. */
  showSameEmail: boolean;
}

/**
 * Validates a candidate new email address against format rules and the current email.
 *
 * @param newEmail - The candidate new email address entered by the user.
 * @param currentEmail - The user's existing email address.
 * @returns Validation flags for the change-email form.
 */
export function validateChangeEmail(
  newEmail: string,
  currentEmail?: string,
): ChangeEmailValidation {
  if (currentEmail === undefined) {
    return {
      isEmailValid: false,
      showInvalidEmail: false,
      showSameEmail: false,
    };
  }
  const trimmed = newEmail.trim();
  const hasInput = trimmed.length > 0;

  const showInvalidEmail = hasInput && !isValidEmailAddress(newEmail);
  const showSameEmail =
    hasInput && trimmed.toLowerCase() === currentEmail.trim().toLowerCase();
  const isEmailValid = hasInput && !showInvalidEmail && !showSameEmail;

  return {
    isEmailValid,
    showInvalidEmail,
    showSameEmail,
  };
}
