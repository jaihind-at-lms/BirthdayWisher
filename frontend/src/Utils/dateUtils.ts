/**
 * Date and time utilities.
 */

/** Returns a random `Date` between 2012-01-01 and today. Useful for generating test data. */
export const randomDate = (): Date => {
  const start = new Date(2012, 0, 1).getTime()
  const end = new Date().getTime()
  return new Date(start + (end - start))
}

/**
 * Formats a duration in seconds as `MM:SS`.
 * @example formatTime(90) // '01:30'
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds - minutes * 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

/**
 * Returns true if `targetDate` is at least 7 days from now.
 * Used to determine whether a deadline is still safely in the future.
 */
export const isEndDateAfterTwoDays = (targetDate: string): boolean => {
  const parsedTargetDate = new Date(targetDate)
  const sevenDaysLater = new Date()
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
  return parsedTargetDate >= sevenDaysLater
}

/** Returns yesterday's date. Useful as a `maxDate` prop on date pickers. */
export const pastDate = (): Date => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d
}

/**
 * Generates an array of year objects spanning `pastYears` before and
 * `futureYears` after the current year. Suitable for year-picker dropdowns.
 *
 * @example generateYears(50, 5) // [{ id: 1974, name: '1974' }, ..., { id: 2029, name: '2029' }]
 */
import dayjs from 'dayjs'

export function formatBirthday(dateStr: string | null): string {
  if (!dateStr) return '-'
  const d = dayjs(dateStr)
  if (!d.isValid()) return dateStr
  return d.format('DD-MMMM')
}

export const generateYears = (
  pastYears = 50,
  futureYears = 5
): { id: number; name: string }[] => {
  const currentYear = new Date().getFullYear()
  const years: { id: number; name: string }[] = []
  for (
    let year = currentYear - pastYears;
    year <= currentYear + futureYears;
    year += 1
  ) {
    years.push({ id: year, name: String(year) })
  }
  return years
}
