import { z } from 'zod'

const usernameRegex = /^[A-Za-z0-9_-]*$/

export const usernameValidationSchema = z
  .string()
  .regex(
    usernameRegex,
    'The "username" field can only contain letters, numbers, underscores, and hyphens.',
  )

export const validateUsername = (
  username: string,
): {
  isValid: boolean
  error?: string
} => {
  try {
    usernameValidationSchema.parse(username)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.message,
      }
    }
    return {
      isValid: false,
      error: 'An unexpected error occurred during validation',
    }
  }
}

export function isValidUsername(username: string): boolean {
  return usernameRegex.test(username)
}
