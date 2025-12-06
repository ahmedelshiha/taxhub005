/**
 * Portal Menu Item Component
 * 
 * Reusable menu item with icon, label, and optional keyboard shortcut.
 * Supports both link and button variants.
 */

'use client'

import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface MenuItemProps {
    href?: string
    label: string
    icon?: LucideIcon
    shortcut?: string
    external?: boolean
    onClick?: () => void
    variant?: 'default' | 'danger'
    disabled?: boolean
}

export function MenuItem({
    href,
    label,
    icon: Icon,
    shortcut,
    external = false,
    onClick,
    variant = 'default',
    disabled = false,
}: MenuItemProps) {
    const baseClasses = cn(
        'flex items-center justify-between gap-3 w-full',
        'px-3 py-2.5 text-sm rounded-md',
        'transition-all duration-150 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-gray-800',
        'group',
        disabled && 'opacity-50 cursor-not-allowed',
        variant === 'danger'
            ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    )

    const content = (
        <>
            <div className="flex items-center gap-3">
                {Icon && (
                    <Icon className={cn(
                        'h-4 w-4 flex-shrink-0 transition-transform duration-150',
                        'group-hover:scale-110'
                    )} />
                )}
                <span>{label}</span>
            </div>

            {shortcut && (
                <span className={cn(
                    'text-xs font-mono px-1.5 py-0.5 rounded',
                    'bg-gray-700/50 text-gray-400',
                    'opacity-75 group-hover:opacity-100 transition-opacity'
                )}>
                    {shortcut}
                </span>
            )}
        </>
    )

    if (onClick) {
        return (
            <button
                type="button"
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                className={baseClasses}
                role="menuitem"
            >
                {content}
            </button>
        )
    }

    if (href) {
        if (external) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClasses}
                    role="menuitem"
                >
                    {content}
                </a>
            )
        }

        return (
            <Link href={href} className={baseClasses} role="menuitem">
                {content}
            </Link>
        )
    }

    return null
}

export default MenuItem
