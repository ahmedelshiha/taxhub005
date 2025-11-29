/**
 * EmptyState Component
 * Display when no data is available
 */

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
            {Icon && (
                <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                    <Icon className="h-8 w-8 text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-4">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}
