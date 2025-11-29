/**
 * PageLayout Component
 * Standard page layout wrapper
 */

import { cn } from '@/lib/utils'

export interface PageLayoutProps {
    children: React.ReactNode
    className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
    return (
        <div className={cn('space-y-6', className)}>
            {children}
        </div>
    )
}
