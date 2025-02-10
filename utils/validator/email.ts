import { z } from 'zod'

const emailRegexPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailSchema = z
  .string()
  .regex(emailRegexPattern, 'Invalid email format')
  // .email('Invalid email address')
  .min(1, 'Email is required')
  .max(254, 'Email must be less than 254 characters')
  .transform((email) => email.toLowerCase())

export const validateEmail = (
  email: string,
): {
  isValid: boolean
  value?: string
  error?: string
} => {
  try {
    const validatedEmail = emailSchema.parse(email)
    return {
      isValid: true,
      value: validatedEmail, // This will be lowercase
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0].message,
      }
    }
    return {
      isValid: false,
      error: 'An unexpected error occurred during validation',
    }
  }
}
