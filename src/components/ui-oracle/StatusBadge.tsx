/**
 * StatusBadge Component
/**
 * StatusBadge Component
 * Status indicator badge
 */

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'danger'
    | 'info'
    | 'pending'
    | 'neutral'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface StatusBadgeProps {
    status?: string
    children?: React.ReactNode
    variant?: StatusVariant
    size?: BadgeSize
    className?: string
}

const variantStyles: Record<StatusVariant, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
}

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
}

export function StatusBadge({
    status,
    children,
    variant = 'default',
    size = 'md',
    className
}: StatusBadgeProps) {
    return (
        <Badge
            className={cn(
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            variant="outline"
        >
            {children || status}
        </Badge>
    )
}
