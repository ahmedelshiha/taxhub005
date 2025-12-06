/**
 * Portal Menu Sections Tab
 * 
 * Drag-and-drop section reordering with visibility toggles.
 * Uses optimistic updates for smooth UX.
 */

'use client'

import { useState, useCallback } from 'react'
import { GripVertical, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortalMenuCustomization, MenuSectionConfig } from '@/stores/portal/menuCustomization.store'

export interface SectionsTabProps {
    customization: PortalMenuCustomization
    onChange: (sections: MenuSectionConfig[]) => void
}

const DEFAULT_SECTIONS: MenuSectionConfig[] = [
    { id: 'overview', label: 'Overview', visible: true, order: 0 },
    { id: 'compliance', label: 'Compliance', visible: true, order: 1 },
    { id: 'financials', label: 'Financials', visible: true, order: 2 },
    { id: 'operations', label: 'Operations', visible: true, order: 3 },
    { id: 'support', label: 'Support', visible: true, order: 4 },
]

export function SectionsTab({ customization, onChange }: SectionsTabProps) {
    const sections = customization.sections?.length
        ? customization.sections
        : DEFAULT_SECTIONS

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const handleToggleVisibility = useCallback((sectionId: string) => {
        const updated = sections.map(s =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s
        )
        onChange(updated)
    }, [sections, onChange])

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            const updated = [...sections]
            const [removed] = updated.splice(draggedIndex, 1)
            updated.splice(dragOverIndex, 0, removed)

            // Update order values
            const reordered = updated.map((s, i) => ({ ...s, order: i }))
            onChange(reordered)
        }

        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-400">
                Drag to reorder sections. Toggle visibility to show/hide sections in the sidebar.
            </div>

            <div className="space-y-2">
                {sections.map((section, index) => {
                    const isDragging = draggedIndex === index
                    const isDragOver = dragOverIndex === index && draggedIndex !== index

                    return (
                        <div
                            key={section.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-lg',
                                'bg-gray-800 border transition-all duration-200',
                                'cursor-grab active:cursor-grabbing',
                                isDragging && 'opacity-50 border-blue-500',
                                isDragOver && 'border-blue-400 bg-blue-500/10',
                                !isDragging && !isDragOver && 'border-gray-700 hover:border-gray-600'
                            )}
                        >
                            <GripVertical className="h-4 w-4 text-gray-500 flex-shrink-0" />

                            <span className={cn(
                                'flex-1 text-sm font-medium',
                                section.visible ? 'text-white' : 'text-gray-500'
                            )}>
                                {section.label}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleToggleVisibility(section.id)}
                                className={cn(
                                    'p-1.5 rounded-md transition-colors',
                                    'focus-visible:outline-none focus-visible:ring-2',
                                    'focus-visible:ring-blue-500',
                                    section.visible
                                        ? 'text-blue-400 hover:bg-blue-500/20'
                                        : 'text-gray-500 hover:bg-gray-700'
                                )}
                                aria-label={section.visible ? 'Hide section' : 'Show section'}
                            >
                                {section.visible ? (
                                    <Eye className="h-4 w-4" />
                                ) : (
                                    <EyeOff className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SectionsTab
