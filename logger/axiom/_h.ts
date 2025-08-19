export type TSeverityLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE'

export enum LOG_LEVEL {
  INFO = 'INFO',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
}
export type TLogLevel = `${LOG_LEVEL}`

export interface ILogMeta {
  /**
   * Scope name (uppercase)
   * e.g. 'AUTH', 'DB', 'API', 'UI', 'SYSTEM'
   */
  scope: string
  /**
   * High-level component name (PascalCase)
   * e.g. 'AuthService', 'UserManager', 'PaymentGateway', 'Scheduler'
   */
  component: string

  /**
   * Operation name or sub-method (camelCase)
   * e.g. 'login', 'refreshToken', 'createOrder', 'sendEmail', 'connectDb', 'parseRequest'
   */
  operation: string

  /**
   * Optional contextual ID or identifier
   * e.g. 'userId=123abc'
   */
  contextId?: string

  /**
   * Description of the log message
   * e.g. 'User logged in successfully'
   */
  description: string

  /**
   * Optional transaction ID
   */
  txid?: string
}
