/**
 * Portal Menu Customization Modal
 * 
 * Main modal component for managing portal menu customization.
 * Composed of modular tab components for maintainability.
 */

'use client'

import { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MenuCustomizationTabs, type TabId } from './MenuCustomizationTabs'
import { usePortalMenuCustomizationStore } from '@/stores/portal/menuCustomization.store'

// Lazy load tabs for performance
const SectionsTab = lazy(() => import('./tabs/SectionsTab'))
const BookmarksTab = lazy(() => import('./tabs/BookmarksTab'))
const YourPracticeTab = lazy(() => import('./tabs/YourPracticeTab'))

export interface PortalMenuCustomizationModalProps {
    isOpen: boolean
    onClose: () => void
}

function TabSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3" />
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-12 bg-gray-800 rounded" />
        </div>
    )
}

export function PortalMenuCustomizationModal({
    isOpen,
    onClose,
}: PortalMenuCustomizationModalProps) {
    const [selectedTab, setSelectedTab] = useState<TabId>('sections')

    // Store
    const {
        customization,
        draftCustomization,
        isLoading,
        isSaving,
        isDirty,
        initialize,
        initializeDraft,
        updateDraftSections,
        updateDraftBookmarks,
        updateDraftPracticeItems,
        save,
        reset,
        clearDraft,
    } = usePortalMenuCustomizationStore()

    // Initialize on mount
    useEffect(() => {
        initialize()
    }, [initialize])

    // Initialize draft when modal opens
    useEffect(() => {
        if (isOpen && customization) {
            initializeDraft(customization)
        }
    }, [isOpen, customization, initializeDraft])

    // Handle backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }, [onClose])

    // Handle escape key
    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = originalOverflow
            }
        }
    }, [isOpen])

    // Handle cancel
    const handleCancel = useCallback(() => {
        clearDraft()
        onClose()
    }, [clearDraft, onClose])

    // Handle save
    const handleSave = useCallback(async () => {
        const success = await save()
        if (success) {
            toast.success('Menu customization saved')
            onClose()
        } else {
            toast.error('Failed to save menu customization')
        }
    }, [save, onClose])

    // Handle reset
    const handleReset = useCallback(async () => {
        const confirmed = window.confirm(
            'Reset menu to defaults? This cannot be undone.'
        )
        if (!confirmed) return

        const success = await reset()
        if (success) {
            toast.success('Menu reset to defaults')
            onClose()
        } else {
            toast.error('Failed to reset menu')
        }
    }, [reset, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className={cn(
                    'w-full max-w-2xl max-h-[85vh]',
                    'bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl',
                    'flex flex-col overflow-hidden',
                    'animate-in fade-in zoom-in-95 duration-200'
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-700/50">
                    <div>
                        <h2 id="modal-title" className="text-lg font-semibold text-white">
                            Customize your menu
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Reorder sections, add bookmarks, and personalize your sidebar.
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className={cn(
                            'p-2 rounded-lg transition-colors',
                            'text-gray-400 hover:text-white hover:bg-gray-800',
                            'focus-visible:outline-none focus-visible:ring-2',
                            'focus-visible:ring-blue-500'
                        )}
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <MenuCustomizationTabs
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <TabSkeleton />
                    ) : draftCustomization ? (
                        <Suspense fallback={<TabSkeleton />}>
                            {selectedTab === 'sections' && (
                                <SectionsTab
                                    customization={draftCustomization}
                                    onChange={updateDraftSections}
                                />
                            )}
                            {selectedTab === 'bookmarks' && (
                                <BookmarksTab
                                    customization={draftCustomization}
                                    onChange={updateDraftBookmarks}
                                />
                            )}
                            {selectedTab === 'practice' && (
                                <YourPracticeTab
                                    customization={draftCustomization}
                                    onChange={updateDraftPracticeItems}
                                />
                            )}
                        </Suspense>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Failed to load customization
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-white"
                    >
                        Reset to Defaults
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !isDirty}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortalMenuCustomizationModal
