'use client'

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'

export type TFormValue = string | boolean | number | File | FileList | null
export type TFormData = Record<string, TFormValue>

interface IFormError {
  error: unknown
  message: string
  field?: string
}

interface IUseFormProps<T extends TFormData> {
  initialData: T
  onInit?: () => Promise<void> | void
  onSubmit: (data: T, event: FormEvent) => Promise<void>
  onError?: (error: IFormError) => void
  validate?: (data: T) => Promise<IFormError[]> | IFormError[]
  resetOnSubmit?: boolean
}

interface IUseFormReturn<T extends TFormData> {
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
  errors: IFormError[]
  setFieldValue: (name: keyof T, value: TFormValue) => void
  isDirty: boolean
}

export function useForm<T extends TFormData>({
  initialData,
  onInit,
  onSubmit,
  onError,
  validate,
  resetOnSubmit = false,
}: IUseFormProps<T>): IUseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<IFormError[]>([])
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
          const formError: IFormError = {
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

  const setFieldValue = useCallback((name: keyof T, value: TFormValue) => {
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
      let finalValue: TFormValue = value

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

  const validateForm = async (): Promise<IFormError[]> => {
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
      const formError: IFormError = {
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
