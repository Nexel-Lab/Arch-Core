/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JwtConfig } from '../functions/jwtService'
import JwtService from '../functions/jwtService'

export default function useJwt(jwtOverrideConfig?: Partial<JwtConfig>) {
  const jwt = new JwtService(jwtOverrideConfig)

  return jwt
}
