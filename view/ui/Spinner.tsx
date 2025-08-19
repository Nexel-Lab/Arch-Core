import { cn } from '#core/utils/styles'

export const Spinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'aspect-square animate-spin rounded-full border-2 border-foreground/40 border-t-foreground',
      className,
    )}
  />
)
