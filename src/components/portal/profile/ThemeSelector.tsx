/**
 * Portal Theme Selector Component
 * 
 * Light/Dark/System theme toggle with icon buttons.
 * Styled for dark theme portal.
 */

'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ThemeSelectorProps {
    showLabels?: boolean
    className?: string
}

const THEMES = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
] as const

export function ThemeSelector({ showLabels = false, className }: ThemeSelectorProps) {
    const { theme, setTheme } = useTheme()

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {showLabels && (
                <span className="text-sm text-gray-400 mr-2">Theme</span>
            )}

            <div className="flex items-center bg-gray-800 rounded-lg p-1 gap-1">
                {THEMES.map(({ id, icon: Icon, label }) => {
                    const isActive = theme === id

                    return (
                        <button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={cn(
                                'p-2 rounded-md transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2',
                                'focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                                'focus-visible:ring-offset-gray-800',
                                isActive
                                    ? 'bg-gray-700 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            )}
                            aria-label={`${label} theme`}
                            aria-pressed={isActive}
                            title={label}
                        >
                            <Icon className="h-4 w-4" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ThemeSelector
