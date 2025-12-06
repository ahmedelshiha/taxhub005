/**
 * Portal Profile Avatar Component
 * 
 * Dark-themed avatar with gradient background and status indicator.
 * Optimized for portal's forced dark mode.
 */

'use client'

import { cn } from '@/lib/utils'

export interface AvatarProps {
    name: string
    src?: string | null
    size?: 'sm' | 'md' | 'lg'
    showStatus?: boolean
    status?: 'online' | 'away' | 'busy' | 'offline'
    className?: string
}

const SIZE_CLASSES = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
}

const STATUS_INDICATOR_CLASSES = {
    sm: 'h-2 w-2 ring-1',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
}

const STATUS_COLORS = {
    online: 'bg-green-500',
    away: 'bg-amber-400',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
}

/**
 * Get initials from name (max 2 characters)
 */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

/**
 * Generate consistent gradient based on name
 */
function getGradient(name: string): string {
    const gradients = [
        'from-blue-600 to-blue-400',
        'from-purple-600 to-purple-400',
        'from-emerald-600 to-emerald-400',
        'from-orange-600 to-orange-400',
        'from-pink-600 to-pink-400',
        'from-cyan-600 to-cyan-400',
    ]
    const index = name.charCodeAt(0) % gradients.length
    return gradients[index]
}

export function Avatar({
    name,
    src,
    size = 'md',
    showStatus = false,
    status = 'online',
    className,
}: AvatarProps) {
    const initials = getInitials(name)
    const gradient = getGradient(name)

    return (
        <div className={cn('relative flex-shrink-0', className)}>
            <div
                className={cn(
                    'rounded-full flex items-center justify-center font-medium',
                    'ring-2 ring-gray-700/50 transition-all duration-200',
                    SIZE_CLASSES[size],
                    src ? 'bg-gray-800' : `bg-gradient-to-br ${gradient}`
                )}
            >
                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className="h-full w-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-white font-semibold">{initials}</span>
                )}
            </div>

            {showStatus && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full ring-gray-900',
                        STATUS_INDICATOR_CLASSES[size],
                        STATUS_COLORS[status]
                    )}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    )
}

export default Avatar
