'use client'

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

export type FormValue = string | boolean | number | File | FileList | null
export type FormData = Record<string, FormValue>

interface FormError {
  error: unknown
  message: string
  field?: string
}

interface UseFormProps<T extends FormData> {
  initialData: T
  onInit?: () => Promise<void> | void
  onSubmit: (data: T, event: FormEvent) => Promise<void>
  onError?: (error: FormError) => void
  validate?: (data: T) => Promise<FormError[]> | FormError[]
  resetOnSubmit?: boolean
}

interface UseFormReturn<T extends FormData> {
  formData: T
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
  handleSubmit: (event: FormEvent) => Promise<void>
  setFormData: (data: T | ((prev: T) => T)) => void
  reset: () => void
  isSubmitting: boolean
  errors: FormError[]
  setFieldValue: (name: keyof T, value: FormValue) => void
  isDirty: boolean
}

export function useForm<T extends FormData>({
  initialData,
  onInit,
  onSubmit,
  onError,
  validate,
  resetOnSubmit = false,
}: UseFormProps<T>): UseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormError[]>([])
  const [isDirty, setIsDirty] = useState(false)

  // Memoize the reset function
  const reset = useCallback(() => {
    setFormData(initialData)
    setErrors([])
    setIsDirty(false)
  }, [initialData])

  // Handle initialization
  useEffect(() => {
    const initForm = async () => {
      if (onInit) {
        try {
          await onInit()
        } catch (error) {
          const formError: FormError = {
            error,
            message: 'Failed to initialize form',
          }
          setErrors([formError])
          onError?.(formError)
        }
      }
    }

    initForm()
  }, [onInit, onError])

  const setFieldValue = useCallback((name: keyof T, value: FormValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsDirty(true)
  }, [])

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = event.target
      let finalValue: FormValue = value

      if (type === 'checkbox') {
        finalValue = (event.target as HTMLInputElement).checked
      } else if (type === 'number' || type === 'range') {
        finalValue = value === '' ? '' : Number(value)
      } else if (type === 'file') {
        const fileInput = event.target as HTMLInputElement
        finalValue = fileInput.multiple
          ? fileInput.files
          : (fileInput.files?.[0] ?? null)
      }

      setFieldValue(name as keyof T, finalValue)
    },
    [setFieldValue],
  )

  const validateForm = async (): Promise<FormError[]> => {
    if (!validate) return []

    try {
      const validationErrors = await validate(formData)
      return Array.isArray(validationErrors) ? validationErrors : []
    } catch (error) {
      return [
        {
          error,
          message: 'Validation failed unexpectedly',
        },
      ]
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      // Run validation if provided
      const validationErrors = await validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        for (const error of validationErrors) {
          onError?.(error)
        }
        return
      }

      await onSubmit(formData, event)

      if (resetOnSubmit) {
        reset()
      }
    } catch (error) {
      const formError: FormError = {
        error,
        message:
          error instanceof Error ? error.message : 'Form submission failed',
      }
      setErrors([formError])
      onError?.(formError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    setFormData,
    reset,
    isSubmitting,
    errors,
    setFieldValue,
    isDirty,
  }
}
