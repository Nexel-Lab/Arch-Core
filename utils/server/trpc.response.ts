type TResponse = {
  fail: (
    message: string,
    error?: unknown,
  ) => {
    success: false
    message: string
    error?: string
  }
  success: <T>(
    message: string,
    data: T,
  ) => {
    success: true
    message: string
    data: T
  }
}

const trpcResponse: TResponse = {
  fail: (message: string, error?: unknown) => {
    let errorMessage = ''
    if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      if (process.env.NODE_ENV !== 'production') console.log(error)
      errorMessage = error.message
    }

    return {
      success: false,
      message,
      error: errorMessage,
    }
  },
  success: <T>(message: string, resData: T) => ({
    success: true,
    message,
    data: resData,
  }),
}

export { trpcResponse }
