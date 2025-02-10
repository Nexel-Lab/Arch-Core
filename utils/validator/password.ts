import { z } from 'zod'

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 100,
  specialChars: '#?!@$%^&*_-',
  specialCharsExtended: '!@#$%^&*()_+=-[]{}|;:\'",.<>?/`',
} as const

const passwordSchema = z
  .string()
  .min(
    PASSWORD_REQUIREMENTS.minLength,
    'Password must be at least 8 characters long',
  )
  .max(
    PASSWORD_REQUIREMENTS.maxLength,
    'Password must not exceed 100 characters',
  )
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    new RegExp(
      `[${PASSWORD_REQUIREMENTS.specialCharsExtended.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}]`,
    ),
    'Password must contain at least one special character (#?!@$%^&*_-)',
  )
  .regex(/^\S*$/, 'Password must not contain spaces')

const validatePassword = (
  password: string,
): {
  isValid: boolean
  requirements: {
    minLength: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    specialChar: boolean
    noSpace: boolean
  }
  error?: string
} => {
  const requirements = {
    minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: new RegExp(
      `[${PASSWORD_REQUIREMENTS.specialCharsExtended.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}]`,
    ).test(password),
    noSpace: !/\s/.test(password),
  }

  try {
    passwordSchema.parse(password)

    return {
      isValid: true,
      requirements,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        requirements,
        error: error.errors[0].message,
      }
    }
    return {
      isValid: false,
      requirements,
      error: 'An unexpected error occurred during validation',
    }
  }
}

const isPasswordValid = (
  password: string,
): {
  isValid: boolean
  error?: string
} => {
  try {
    passwordSchema.parse(password)
    return { isValid: true }
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

export {
  passwordSchema,
  validatePassword,
  isPasswordValid,
  PASSWORD_REQUIREMENTS,
}
