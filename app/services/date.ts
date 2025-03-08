import { DateTime, Interval } from 'luxon'

type InitialPeriod =
  | 'this week'
  | 'this month'
  | 'next week'
  | 'next month'
  | 'last month'
  | 'this year'

export default class DateService {
  static now = DateTime.local().setLocale('en-GB')
  // private startDate!: DateTime
  // private endDate!: DateTime
  // private preferredFormat!: DateTime
  static startOfMonth = DateTime.local().startOf('month')
  static endOfMonth = DateTime.local().endOf('month')

  static hasDateExpired(date: DateTime): boolean {
    if (DateService.now.toMillis() > date.toMillis()) {
      return true
    }
    return false
  }

  static getDaysDueText(daysDue: number): string {
    if (daysDue === 0) {
      return 'today'
    }
    if (daysDue === 1) {
      return 'tomorrow'
    }
    if (daysDue === 7) {
      return 'in a week'
    }
    return `in ${daysDue} days`
  }

  static formatDate(date: DateTime | string | Date, isLong = false): string {
    const formatIsLong = isLong
      ? DateTime.DATETIME_MED_WITH_WEEKDAY
      : DateTime.DATE_MED_WITH_WEEKDAY

    if (typeof date === 'string') {
      return DateTime.fromISO(date).toLocaleString(formatIsLong)
    }

    if (date instanceof Date) {
      return DateTime.fromJSDate(date).toLocaleString(formatIsLong)
    }

    return date.toLocaleString(formatIsLong)
  }

  static getInitialDateFromPeriod(initial: InitialPeriod): Interval {
    switch (initial) {
      case 'this week':
        return Interval.fromDateTimes(
          DateService.now.startOf('week'),
          DateService.now.endOf('week')
        )
      case 'this month':
        return Interval.fromDateTimes(
          DateService.now.startOf('month'),
          DateService.now.endOf('month')
        )
      case 'next week':
        return Interval.fromDateTimes(
          DateService.now.plus({ weeks: 1 }).startOf('week'),
          DateService.now.plus({ weeks: 1 }).endOf('week')
        )
      case 'next month':
        return Interval.fromDateTimes(
          DateService.now.plus({ months: 1 }).startOf('month'),
          DateService.now.plus({ months: 1 }).endOf('month')
        )
      case 'last month':
        return Interval.fromDateTimes(
          DateService.now.minus({ months: 1 }).startOf('month'),
          DateService.now.minus({ months: 1 }).endOf('month')
        )
      case 'this year':
        return Interval.fromDateTimes(
          DateService.now.startOf('year'),
          DateService.now.endOf('year')
        )
      default:
        throw new Error('Invalid initial period provided')
    }
  }
}
