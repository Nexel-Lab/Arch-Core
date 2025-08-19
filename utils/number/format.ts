/**
 * Format numbers into a compact, human-readable string with suffixes.
 * Example: 1200 → "1.2K", 2500000 → "2.5M"
 */
export function formatNumberCompact(num: number, digits = 1): string {
  if (!Number.isFinite(num)) return '0'

  const units = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' }, // changed to B instead of G (for billion)
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
    { value: 1, symbol: '' },
  ]

  const item = units.find((u) => num >= u.value)
  if (!item) return '0'

  const formatted = (num / item.value).toFixed(digits)

  // Remove unnecessary trailing zeros
  return formatted.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + item.symbol
}

/**
 * Format file size in human-readable form.
 * Example: 1024 → "1 KB", 1048576 → "1 MB"
 */
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  if (!Number.isFinite(bytes)) return 'N/A'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / k ** i).toFixed(dm))

  return `${value} ${sizes[i]}`
}

/**
 * Format percentage with proper sign and decimal places
 */
export function formatPercentage(percentage: number, decimals = 2): string {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(decimals)}%`
}

/**
 * Format currency with proper locale and currency symbol
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (_error) {
    // Fallback for unsupported currencies
    return `${currency} ${amount.toFixed(2)}`
  }
}