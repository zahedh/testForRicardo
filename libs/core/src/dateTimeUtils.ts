import moment from 'moment';

/**
 * Converts seconds to HH:MM:SS format string.
 *
 * @param seconds - The duration in seconds.
 * @returns A string in HH:MM:SS format.
 */
export function formatSecondsToHHMMSS(seconds: number): string {
  return moment.utc(seconds * 1000).format('HH:mm:ss');
}

/**
 * Formats raw user input into the "DD/MM/YYYY" pattern.
 *
 * Non-digit characters are stripped, the input is capped at 8 digits
 * (DDMMYYYY) and slash separators are inserted after the day and month.
 *
 * @param text - The raw text entered by the user.
 * @returns the text formatted as "DD/MM/YYYY".
 */
export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export enum DateInputError {
  INVALID_DAY = 'INVALID_DAY',
  INVALID_MONTH = 'INVALID_MONTH',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_YEAR = 'INVALID_YEAR',
}

/**
 * Validates a "DD/MM/YYYY" value and returns an error code when the day, month
 * or year fall outside valid bounds.
 *
 * Validation is progressive: the day and month are checked as soon as they are
 * complete, and once all 8 digits are present `moment` performs a strict parse
 * that also rejects impossible dates (e.g. "31/02/2024"). Future dates and
 * years before 1900 are rejected as `INVALID_YEAR`.
 *
 * @param value - The formatted date value from the field.
 * @returns A DateInputError when invalid, or undefined when the value is valid
 *          or still incomplete.
 */
export function getDateInputError(value: string): DateInputError | undefined {
  const MIN_DATE_YEAR = 1900;

  const digits = value.replace(/\D/g, '');

  if (digits.length >= 2) {
    const day = Number(digits.slice(0, 2));
    if (day < 1 || day > 31) {
      return DateInputError.INVALID_DAY;
    }
  }

  if (digits.length >= 4) {
    const month = Number(digits.slice(2, 4));
    if (month < 1 || month > 12) {
      return DateInputError.INVALID_MONTH;
    }
  }

  if (digits.length === 8) {
    const parsed = moment(value, 'DD/MM/YYYY', true);
    if (!parsed.isValid()) {
      return DateInputError.INVALID_DATE;
    }
    if (parsed.year() < MIN_DATE_YEAR || parsed.isAfter(moment(), 'day')) {
      return DateInputError.INVALID_YEAR;
    }
  }

  return undefined;
}
