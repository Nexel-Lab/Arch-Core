'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo, useState } from 'react'

interface Helpers {
  goToNextStep: () => void
  goToPrevStep: () => void
  reset: () => void
  canGoToNextStep: boolean
  canGoToPrevStep: boolean
  setStep: Dispatch<SetStateAction<number>>
}

function useStep(maxStep: number): [number, Helpers] {
  const [currentStep, setCurrentStep] = useState(1)

  const canGoToNextStep = useMemo(
    () => currentStep < maxStep,
    [currentStep, maxStep],
  )
  const canGoToPrevStep = useMemo(() => currentStep > 1, [currentStep])

  const setStep = useCallback(
    (step: SetStateAction<number>) => {
      // Allow value to be a function so we have the same API as useState
      setCurrentStep((prevStep) => {
        const newStep =
          typeof step === 'function'
            ? (step as (prevStep: number) => number)(prevStep)
            : step
        if (newStep >= 1 && newStep <= maxStep) {
          return newStep
        }
        throw new Error('Step not valid')
      })
    },
    [maxStep],
  )

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + 1)
    }
  }, [canGoToNextStep])

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - 1)
    }
  }, [canGoToPrevStep])

  const reset = useCallback(() => {
    setCurrentStep(1)
  }, [])

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ]
}

export { useStep }
