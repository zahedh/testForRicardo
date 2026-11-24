import moment, {Moment} from 'moment';

export enum DateFormat {
  IsoInt = 'YYYY-MM-DD',
  ShortDate = 'DD/MM/YYYY',
  ShortDateAndYear = 'DD/MM/YY',
  IsoDateTime = 'YYYY-MM-DDTHH:MM:SS',
  IsoDateTimeUtc = 'YYYY-MM-DDTHH:MM:SSZ',
  DayMonth = 'Do MMMM',
  ShortDayMonth = 'ddd Do MMM',
  ShortDayMonthNoOrdinal = 'ddd D MMM',
  DayShortMonth = 'D MMM',
  DayShortMonthYear = 'D MMM YYYY',
  OrdinalDayShortMonth = 'Do MMM',
}

export class SmartyDate {
  date?: Date;

  /**
   * Creates a new SmartyDate object
   *
   * @param date - The date to store in the object
   */
  constructor(date: Date | undefined) {
    this.date = date;
  }

  /**
   * Returns the formatted date
   *
   * @param dateFormat - The format to use when formatting the date
   * @returns The formatted date
   */
  public formatDate(dateFormat: string = DateFormat.ShortDate): string {
    // Reject 'do' (lowercase) in format string, only allow 'Do' (Moment.js standard)
    if (dateFormat.includes('do')) {
      throw new Error(
        "Invalid date format: use 'Do' (uppercase D) for day-of-month ordinals with moment.js, not 'do'.",
      );
    }
    // Note that getTime() is required here, otherwise some unit tests will fail.
    return this.date ? moment(this.date.getTime()).format(dateFormat) : '';
  }

  /**
   * Returns the formatted date in a long format.
   *
   * @param showYear Whether or not to show the year.
   * @returns The formatted date
   */
  public formatDateLong(showYear = false): string {
    return this.formatDate(showYear ? 'dddd Do MMM YYYY' : 'dddd Do MMMM');
  }

  /**
   * @returns The date as a Moment object
   */
  public dateAsMoment(): Moment {
    return moment(new Date(this.date ? this.date : Date.now()).getTime());
  }

  /**
   * Calculates the number of months until the date stored in this SmartyDate object.
   *
   * @returns The number of months until the date, or zero if the date is in the past or not defined.
   */
  public monthsUntil(): number {
    const now = moment();
    const date = this.dateAsMoment();
    const months = date.diff(now, 'months');
    return months > 0 ? months : 0;
  }
}

/**
 * Creates a {@link SmartyDate} from a Date that's been stored (which will actually be a string).
 *
 * @param smartyDate A {@link SmartyDate}.
 * @returns A {@link SmartyDate}, or undefined.
 */
export function initSmartyDateDomainModelOrUndefined(
  smartyDate: SmartyDate | undefined | null,
): SmartyDate | undefined {
  if (smartyDate) {
    return initSmartyDateDomainModel(smartyDate);
  }
  return undefined;
}

/**
 * Creates a {@link SmartyDate} from a SmartyDate object, handling string serialization from Zustand.
 *
 * @param smartyDate A {@link SmartyDate} object that may have a date stored as a string.
 * @returns A {@link SmartyDate} with the date properly initialized.
 */
export function initSmartyDateDomainModel(smartyDate: SmartyDate): SmartyDate {
  const date = smartyDate.date;
  if (date === null || date === undefined) {
    return new SmartyDate(undefined);
  } else if (date && typeof date === 'string') {
    // This is the expected case, as Zustand will serialize/deserialize Date as a string:
    return new SmartyDate(new Date(date as string));
  } else {
    return smartyDate;
  }
}
