import { z } from 'zod'

// Base schema for common fields
export const baseEntitySchema = {
  id: z.string().uuid(),
  addedBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deleted: z.boolean(),
  deletedAt: z.string().nullable(),
}

// Schema for phone numbers (E.164 format)
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

// Schema for email addresses with common TLDs
export const emailSchema = z.string()
  .email()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)

// Schema for dates in ISO format
export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

// Schema for datetime in ISO format
export const dateTimeSchema = z.string()
  .datetime({ offset: true })

// Schema for country codes (ISO 3166-1 alpha-2)
export const countryCodeSchema = z.string()
  .length(2)
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code')

// Schema for filtering
export const filterableSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'nin']),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(z.union([z.string(), z.number()])),
  ]),
})

// Schema for sorting
export const sortableSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
})

// Schema for money amounts
export const moneySchema = z.number()
  .multipleOf(0.01)
  .nonnegative()

// Schema for percentages
export const percentageSchema = z.number()
  .min(0)
  .max(100)

// Schema for URLs
export const urlSchema = z.string()
  .url()
  .startsWith('https://', { message: 'Only HTTPS URLs are allowed' })

// Transform helpers
export const transforms = {
  normalizeString: (value: string) => value.trim().toLowerCase(),
  normalizePhone: (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits.startsWith('1') ? `+${digits}` : `+1${digits}`
  },
  normalizeDate: (value: string | Date) => new Date(value).toISOString(),
  normalizeBoolean: (value: unknown) => {
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(value.toLowerCase())
    }
    return Boolean(value)
  },
  normalizeMoney: (value: number) => Number(value.toFixed(2)),
}

// Validation helpers
export const validators = {
  isUUID: (value: string) => {
    const uuidRegex = /^[a-zA-Z0-9]{21}$/
    return uuidRegex.test(value)
  },
  isISODate: (value: string) => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
    return isoDateRegex.test(value)
  },
  isE164Phone: (value: string) => {
    const e164Regex = /^\+[1-9]\d{1,14}$/
    return e164Regex.test(value)
  },
}
