/**
 * ActionHeader Component
 * Page header with title, description, and action buttons
 */

import { cn } from '@/lib/utils'

export interface ActionHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
    className?: string
}

export function ActionHeader({ title, description, actions, className }: ActionHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}
