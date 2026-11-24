import {SmartyDate} from '../model/smartyDate';
import {Currency} from '../model/smartyPrice';

/**
 * Converts a date string to a Date object or undefined if the date string is not valid
 *
 * @param date - The date string to convert
 * @returns A Date object or undefined if the date string is not valid
 */
export function dateOrUndefined(
  date: string | undefined | null,
): Date | undefined {
  if (
    date !== undefined &&
    date !== null &&
    date !== '' &&
    !isNaN(Date.parse(date))
  ) {
    return new Date(date);
  } else {
    return undefined;
  }
}

/**
 * Converts a date string to a SmartyDate object
 *
 * @param dateString - The date string to convert
 * @returns A SmartyDate object
 */
export function mapDateStringToSmartyDate(dateString?: string): SmartyDate {
  const date = dateOrUndefined(dateString);

  return new SmartyDate(date);
}

/**
 * Converts a SmartyDate object to an ISO date-time string
 *
 * @param date - The SmartyDate to convert
 * @returns An ISO date-time string, or undefined if the date is absent
 */
export function mapSmartyDateToIsoString(
  date?: SmartyDate,
): string | undefined {
  return date?.date?.toISOString();
}

/**
 * Maps a Currency DTO from the API to a Currency type used in the app. If the currency is missing or unrecognized, it defaults to 'GBP'.
 *
 * @param dto - The Currency DTO to map
 * @returns A Currency type
 */
export function mapCurrencyDtoToCurrency(dto?: string): Currency {
  const currencyLower = dto?.toLowerCase() ?? '';
  switch (currencyLower) {
    case 'gbp':
      return 'GBP';
    case 'eur':
      return 'EUR';
    case 'usd':
      return 'USD';
    default:
      return 'GBP';
  }
}
