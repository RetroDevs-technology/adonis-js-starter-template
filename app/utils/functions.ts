import { DateTime, Interval } from 'luxon'
import env from '#start/env'

export function generateId() {
  return crypto.randomUUID()
}

export async function runInProdOnly(fn: () => Promise<void> | void, rationale = '') {
  if (env.get('NODE_ENV') === 'production') {
    await fn()
  } else {
    console.log(`Skipping ${rationale} because NODE_ENV is not production`)
  }
}

export async function runInDevOnly(fn: () => Promise<void> | void, rationale = '') {
  if (env.get('NODE_ENV') === 'development') {
    console.log('🧰 ~ runInDevOnly ~ development:')
    await fn()
    console.log('🧰 ~ runInDevOnly ~ complete:')
  } else {
    console.log(`Skipping ${rationale} because NODE_ENV is not development`)
  }
}

export async function runIfTrue(
  condition: boolean,
  fn: () => Promise<void> | void,
  rationale = '',
) {
  if (condition) {
    await fn()
  } else {
    console.log(`Skipping ${rationale} because condition is false`)
  }
}

export async function runIfFalse(
  condition: boolean,
  fn: () => Promise<void> | void,
  rationale = '',
) {
  if (!condition) {
    await fn()
  } else {
    console.log(`Skipping ${rationale} because condition is true`)
  }
}

export function generateOTP(length = 6): string {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString()
  }
  return otp
}

export function daysRemaining(startDate: string, endDate: string) {
  const start = DateTime.fromISO(startDate).set({ hour: 0, minute: 0 }).startOf('day')
  const end = DateTime.fromISO(endDate).set({ hour: 0, minute: 0 }).endOf('day')
  const interval = Interval.fromDateTimes(start, end)
  const duration = interval.toDuration(['years', 'months', 'days'])

  const parts: string[] = []
  const years = Math.floor(duration.years)
  const months = Math.floor(duration.months)
  const days = Math.floor(duration.days) // Rounding days to the nearest integer

  // Build output based on non-zero values

  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`)
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`)

  return parts.join(', ')
}

export function getDateRange(startDate?: string, endDate?: string): [string, string] {
  const now = DateTime.now()
  return startDate && endDate ? [startDate, endDate] : ['1970-01-01', now.toISODate()!]
}
