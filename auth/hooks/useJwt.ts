/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IJwtConfig } from '../functions/jwtService'
import JwtService from '../functions/jwtService'

export default function useJwt(jwtOverrideConfig?: Partial<IJwtConfig>) {
  const jwt = new JwtService(jwtOverrideConfig)

  return jwt
}
