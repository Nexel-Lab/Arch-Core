import useJwt from '../hooks/useJwt'

export const isUserLoggedIn = () => {
  return (
    localStorage.getItem('userData') &&
    // biome-ignore lint/correctness/useHookAtTopLevel: <no explanation>
    localStorage.getItem(useJwt({}).jwtConfig.storageTokenKeyName)
  )
}

export const getUserData = () => {
  const userData = localStorage.getItem('userData')
  if (userData) JSON.parse(userData)
}

export const getHomeRouteForLoggedInUser = (userRole: string) => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return { name: 'access-control' }
  return { name: 'auth-login' }
}
