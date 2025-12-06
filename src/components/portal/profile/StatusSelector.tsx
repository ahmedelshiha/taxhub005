/**
 * Portal Status Selector Component
 * 
 * Online/Away/Busy status dropdown with persistence.
 * Uses useUserStatus hook for state management.
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserStatus } from '@/hooks/useUserStatus'

export interface StatusSelectorProps {
    className?: string
}

const STATUSES = [
    { id: 'online', label: 'Online', color: 'bg-green-500' },
    { id: 'away', label: 'Away', color: 'bg-amber-400' },
    { id: 'busy', label: 'Busy', color: 'bg-red-500' },
] as const

type StatusId = typeof STATUSES[number]['id']

export function StatusSelector({ className }: StatusSelectorProps) {
    const { status, setStatus } = useUserStatus()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentStatus = STATUSES.find(s => s.id === status) || STATUSES[0]

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close on Escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const handleSelect = (statusId: StatusId) => {
        setStatus(statusId)
        setIsOpen(false)
    }

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center justify-between gap-3 w-full',
                    'px-3 py-2 rounded-lg transition-colors',
                    'bg-gray-800 hover:bg-gray-700',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-blue-500'
                )}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-2">
                    <span className={cn('h-2.5 w-2.5 rounded-full', currentStatus.color)} />
                    <span className="text-sm text-white">{currentStatus.label}</span>
                </div>
                <ChevronDown className={cn(
                    'h-4 w-4 text-gray-400 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        'absolute top-full left-0 right-0 mt-1 z-50',
                        'bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
                        'py-1 animate-in fade-in slide-in-from-top-2 duration-150'
                    )}
                    role="listbox"
                >
                    {STATUSES.map(({ id, label, color }) => {
                        const isSelected = id === status
                        return (
                            <button
                                key={id}
                                onClick={() => handleSelect(id)}
                                className={cn(
                                    'flex items-center justify-between gap-2 w-full',
                                    'px-3 py-2 text-sm text-left transition-colors',
                                    isSelected
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                )}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={cn('h-2.5 w-2.5 rounded-full', color)} />
                                    <span>{label}</span>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default StatusSelector
