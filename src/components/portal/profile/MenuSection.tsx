/**
 * Portal Menu Section Component
 * 
 * Reusable section wrapper for dropdown menu items.
 * Provides visual grouping with headers and separators.
 */

'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MenuSectionProps {
    title?: string
    children: ReactNode
    className?: string
    showSeparator?: boolean
}

export function MenuSection({
    title,
    children,
    className,
    showSeparator = true,
}: MenuSectionProps) {
    return (
        <>
            {title && (
                <div className={cn('px-3 pt-3 pb-1', className)}>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {title}
                    </span>
                </div>
            )}

            <div className={cn('px-1 pb-1', !title && 'pt-1')}>
                {children}
            </div>

            {showSeparator && (
                <div className="border-t border-gray-700/50 my-1" />
            )}
        </>
    )
}

export default MenuSection
