/**
 * Portal Profile User Info Component
 * 
 * Displays user name, email, and role badge.
 * Dark theme optimized.
 */

'use client'

import { cn } from '@/lib/utils'

export interface UserInfoProps {
    name: string
    email?: string
    role?: string
    variant?: 'compact' | 'full'
    className?: string
}

export function UserInfo({
    name,
    email,
    role,
    variant = 'full',
    className,
}: UserInfoProps) {
    return (
        <div className={cn('min-w-0 flex-1', className)}>
            <p className="text-sm font-semibold text-white truncate">
                {name}
            </p>

            {variant === 'full' && email && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                    {email}
                </p>
            )}

            {role && (
                <span className={cn(
                    'inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1',
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                )}>
                    {role}
                </span>
            )}
        </div>
    )
}

export default UserInfo
