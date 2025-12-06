/**
 * Portal Menu Your Practice Tab
 * 
 * Customize practice-specific menu items.
 * Add/remove quick access items for your specific workflow.
 */

'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PortalMenuCustomization, PracticeItem } from '@/stores/portal/menuCustomization.store'

export interface YourPracticeTabProps {
    customization: PortalMenuCustomization
    onChange: (items: PracticeItem[]) => void
}

export function YourPracticeTab({ customization, onChange }: YourPracticeTabProps) {
    const items = customization.practiceItems || []
    const [newLabel, setNewLabel] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleAddItem = useCallback(() => {
        setError(null)

        if (!newLabel.trim()) {
            setError('Label is required')
            return
        }

        if (!newUrl.trim()) {
            setError('URL is required')
            return
        }

        // Validate URL format
        try {
            new URL(newUrl.startsWith('http') ? newUrl : `https://${newUrl}`)
        } catch {
            setError('Please enter a valid URL')
            return
        }

        const newItem: PracticeItem = {
            id: `practice-${Date.now()}`,
            label: newLabel.trim(),
            url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
            order: items.length,
        }

        onChange([...items, newItem])
        setNewLabel('')
        setNewUrl('')
    }, [newLabel, newUrl, items, onChange])

    const handleRemoveItem = useCallback((id: string) => {
        const updated = items.filter(item => item.id !== id)
        onChange(updated)
    }, [items, onChange])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddItem()
        }
    }

    return (
        <div className="space-y-6">
            {/* Existing Items */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Your Practice Links
                </h4>

                {items.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center">
                        No practice links added yet. Add your first one below.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-lg',
                                    'bg-gray-800 border border-gray-700',
                                    'hover:border-gray-600 transition-colors'
                                )}
                            >
                                <GripVertical className="h-4 w-4 text-gray-500 flex-shrink-0 cursor-grab" />

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <ExternalLink className="h-3 w-3" />
                                        {item.url}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className={cn(
                                        'p-1.5 rounded-md transition-colors',
                                        'text-gray-500 hover:text-red-400 hover:bg-red-500/10',
                                        'focus-visible:outline-none focus-visible:ring-2',
                                        'focus-visible:ring-red-500'
                                    )}
                                    aria-label={`Remove ${item.label}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add New Item */}
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Add New Link
                </h4>

                <div className="space-y-2">
                    <Input
                        placeholder="Label (e.g., Client Portal)"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            'bg-gray-800 border-gray-700',
                            'text-white placeholder:text-gray-500',
                            'focus:border-blue-500'
                        )}
                    />
                    <Input
                        placeholder="URL (e.g., https://example.com)"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            'bg-gray-800 border-gray-700',
                            'text-white placeholder:text-gray-500',
                            'focus:border-blue-500'
                        )}
                    />

                    {error && (
                        <p className="text-xs text-red-400">{error}</p>
                    )}

                    <Button
                        onClick={handleAddItem}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default YourPracticeTab
