import { startOfMonth, endOfMonth, format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const TIMEZONES = {
  INDIA: 'Asia/Kolkata',
  USA: 'America/New_York'
} as const;

type Timezone = (typeof TIMEZONES)[keyof typeof TIMEZONES];

/**
 * Converts a Date object from one timezone to another.
 * This function effectively shifts the internal UTC timestamp
 * so that when the resulting Date object is interpreted in the `toTimeZone`,
 * it represents the correct local time.
 *
 * @param date The input Date object.
 * @param toTimeZone The target timezone for conversion.
 * @param fromTimeZone The timezone to interpret the input date in. If not provided,
 *                     the input date is assumed to be in UTC or local system time.
 * @returns A new Date object representing the converted time.
 */
export function convertTimeZone(date: Date, toTimeZone: Timezone, fromTimeZone?: Timezone, returnIsoString?: false): Date;
export function convertTimeZone(date: Date, toTimeZone: Timezone, fromTimeZone?: Timezone, returnIsoString?: true): string;
export function convertTimeZone(date: Date, toTimeZone: Timezone, fromTimeZone?: Timezone, returnIsoString: boolean = false): Date | string {
  let dateInUtc: Date;

  if (fromTimeZone) {
    // If an explicit fromTimeZone is given, first convert the date to UTC based on that timezone.
    dateInUtc = fromZonedTime(date, fromTimeZone);
  } else {
    // If no fromTimeZone is given, assume the input date is already representing a UTC time
    // or is a local date that needs to be treated as UTC before conversion.
    // For simplicity, we'll treat the input Date's UTC value as the reference.
    dateInUtc = date;
  }
  const convertedDate = toZonedTime(dateInUtc, toTimeZone);
  return returnIsoString ? toIsoString(convertedDate, toTimeZone) : convertedDate;
}

/**
 * Returns the start date of the month for a given date.
 * @param date The input Date object. Defaults to current date if not provided.
 * @returns A new Date object representing the first day of the month.
 */
export function getMonthStartDate(date?: Date, returnIsoString?: false): Date;
export function getMonthStartDate(date: Date | undefined, returnIsoString?: true): string;
export function getMonthStartDate(date: Date = new Date(), returnIsoString: boolean = false): Date | string {
  const startDate = startOfMonth(date);
  return returnIsoString ? toIsoString(startDate, TIMEZONES.INDIA) : startDate;
}

/**
 * Returns the end date of the month for a given date.
 * @param date The input Date object. Defaults to current date if not provided.
 * @returns A new Date object representing the last day of the month.
 */
export function getMonthEndDate(date?: Date, returnIsoString?: false): Date;
export function getMonthEndDate(date: Date | undefined, returnIsoString?: true): string;
export function getMonthEndDate(date: Date = new Date(), returnIsoString: boolean = false): Date | string {
  const endDate = endOfMonth(date);
  return returnIsoString ? toIsoString(endDate, TIMEZONES.INDIA) : endDate;
}

/**
 * Returns an object containing the start and end dates of the month for a given date.
 * @param date The input Date object. Defaults to current date if not provided.
 * @returns An object with 'startDate' and 'endDate' properties.
 */
// Overload signatures
export function getMonthDateRange(date?: Date, returnIsoString?: false): { startDate: Date; endDate: Date };
export function getMonthDateRange(date: Date | undefined, returnIsoString?: true): { startDate: string; endDate: string };
// Implementation signature
export function getMonthDateRange(date: Date = new Date(), returnIsoString: boolean = false): { startDate: Date | string; endDate: Date | string } {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  if (returnIsoString) {
    return {
      startDate: toIsoString(startDate, TIMEZONES.INDIA),
      endDate: toIsoString(endDate, TIMEZONES.INDIA)
    };
  }
  return {
    startDate,
    endDate
  };
}

/**
 * Converts a Date object to a specified timezone and returns a new Date object.
 * This function is similar to `convertTimeZone` but is named to directly address
 * the "Convert and Get Date by Timezone" requirement, ensuring clarity.
 * It assumes the input `date` is either in UTC or the system's local timezone
 * and adjusts it to reflect the time in the `targetTimeZone`.
 *
 * @param date The input Date object.
 * @param targetTimeZone The timezone to convert the date to.
 * @returns A new Date object adjusted to the target timezone.
 */
export function convertAndGetDateByTimezone(date: Date, targetTimeZone: Timezone, returnIsoString?: false): Date;
export function convertAndGetDateByTimezone(date: Date, targetTimeZone: Timezone, returnIsoString?: true): string;
export function convertAndGetDateByTimezone(date: Date, targetTimeZone: Timezone, returnIsoString: boolean = false): Date | string {
  const convertedDate = toZonedTime(date, targetTimeZone);
  return returnIsoString ? toIsoString(convertedDate, targetTimeZone) : convertedDate;
}

/**
 * Converts a Date object to its ISO 8601 string representation.
 * @param date The input Date object.
 * @returns A string in ISO 8601 format (e.g., "2023-10-27T10:00:00.000Z").
 */
export function toIsoString(date: Date, timezone?: Timezone): string {
  if (timezone) {
    return toLocalizedIsoString(date, timezone);
  }
  return date.toISOString();
}

/**
 * Converts a Date object to its ISO 8601 string representation, localized to a specific timezone.
 * @param date The input Date object.
 * @param timezone The target timezone for localization.
 * @returns A string in ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ss.SSS"), localized to the given timezone.
 */
export function toLocalizedIsoString(date: Date, timezone: Timezone): string {
  const zonedDate = toZonedTime(date, timezone);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS");
}
