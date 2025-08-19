import { AxiomJSTransport, ConsoleTransport, Logger } from '@axiomhq/logging'
import { createAxiomRouteHandler, nextJsFormatters } from '@axiomhq/nextjs'
import { AXIOM_DATASET } from '@config/logger'
import { uuidv7 } from 'uuidv7'
import type { ILogMeta, TLogLevel } from '../_h'
import { axiomClient } from '../init'

export const logger = new Logger({
  transports: [
    new AxiomJSTransport({
      axiom: axiomClient,
      dataset: AXIOM_DATASET,
    }),
    new ConsoleTransport({ prettyPrint: true }),
  ],
  formatters: nextJsFormatters,
})

/**
 * Logs a structured and contextual message with consistent formatting.
 *
 * Format:
 * `[SCOPE] Component/operation: contextId -> description`
 *
 * @param level - Log level (e.g., 'INFO', 'ERROR', 'DEBUG')
 * @param metadata - Structured metadata for the log entry (scope, component, operation, contextId, description)
 * @param args - Optional additional arguments to include in the structured log
 *
 * @returns The return value from the underlying logger function
 *
 * @example
 * ```ts
 * log('INFO', {
 *   scope: 'AUTH',
 *   component: 'AuthService',
 *   operation: 'login',
 *   contextId: 'userId=abc123',
 *   description: 'User logged in successfully'
 * });
 * ```
 */

export const log = (
  level: TLogLevel,
  metadata: ILogMeta,
  args?: Record<string | symbol, any> | undefined,
) => {
  const txid = metadata.txid ?? uuidv7()
  const message = metadata.contextId
    ? `${metadata.contextId} -> ${metadata.description}`
    : metadata.description
  return logger[level.toLowerCase() as 'info' | 'warn' | 'error' | 'debug'](
    `[${metadata.scope}] ${metadata.component}/${metadata.operation}: ${message}`,
    {
      txid,
      scope: metadata.scope,
      component: metadata.component,
      operation: metadata.operation,
      contextId: metadata.contextId,
      description: metadata.description,
      ...args,
    },
  )
}

export const withAxiom = createAxiomRouteHandler(logger)
