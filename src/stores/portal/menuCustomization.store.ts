/**
 * Portal Menu Customization Store (Zustand)
 * 
 * Manages user menu customization state for the portal.
 * Handles sections, bookmarks, and practice items with API persistence.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Type definitions
export interface MenuSectionConfig {
    id: string
    label: string
    visible: boolean
    order: number
}

export interface BookmarkItem {
    id: string
    label: string
    href: string
    order: number
}

export interface PracticeItem {
    id: string
    label: string
    url: string
    order: number
}

export interface PortalMenuCustomization {
    sections: MenuSectionConfig[]
    bookmarks: BookmarkItem[]
    practiceItems: PracticeItem[]
}

interface PortalMenuCustomizationState {
    // State
    customization: PortalMenuCustomization | null
    draftCustomization: PortalMenuCustomization | null
    isLoading: boolean
    isSaving: boolean
    isDirty: boolean
    error: string | null

    // Actions
    initialize: () => Promise<void>
    initializeDraft: (customization: PortalMenuCustomization) => void
    updateDraftSections: (sections: MenuSectionConfig[]) => void
    updateDraftBookmarks: (bookmarks: BookmarkItem[]) => void
    updateDraftPracticeItems: (items: PracticeItem[]) => void
    save: () => Promise<boolean>
    reset: () => Promise<boolean>
    clearDraft: () => void
}

const DEFAULT_CUSTOMIZATION: PortalMenuCustomization = {
    sections: [
        { id: 'overview', label: 'Overview', visible: true, order: 0 },
        { id: 'compliance', label: 'Compliance', visible: true, order: 1 },
        { id: 'financials', label: 'Financials', visible: true, order: 2 },
        { id: 'operations', label: 'Operations', visible: true, order: 3 },
        { id: 'support', label: 'Support', visible: true, order: 4 },
    ],
    bookmarks: [],
    practiceItems: [],
}

export const usePortalMenuCustomizationStore = create<PortalMenuCustomizationState>()(
    devtools(
        (set, get) => ({
            // Initial state
            customization: null,
            draftCustomization: null,
            isLoading: false,
            isSaving: false,
            isDirty: false,
            error: null,

            /**
             * Initialize customization from server
             */
            initialize: async () => {
                const { customization, isLoading } = get()
                if (customization || isLoading) return

                set({ isLoading: true, error: null })

                try {
                    const response = await fetch('/api/portal/menu-customization')

                    if (!response.ok) {
                        throw new Error('Failed to load menu customization')
                    }

                    const data = await response.json()
                    const loadedCustomization = data.data || DEFAULT_CUSTOMIZATION

                    set({
                        customization: loadedCustomization,
                        isLoading: false,
                    })
                } catch (error) {
                    console.error('Failed to load menu customization:', error)
                    set({
                        customization: DEFAULT_CUSTOMIZATION,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to load',
                    })
                }
            },

            /**
             * Initialize draft from current customization
             */
            initializeDraft: (customization) => {
                set({
                    draftCustomization: JSON.parse(JSON.stringify(customization)),
                    isDirty: false,
                })
            },

            /**
             * Update draft sections
             */
            updateDraftSections: (sections) => {
                const { draftCustomization } = get()
                if (!draftCustomization) return

                set({
                    draftCustomization: { ...draftCustomization, sections },
                    isDirty: true,
                })
            },

            /**
             * Update draft bookmarks
             */
            updateDraftBookmarks: (bookmarks) => {
                const { draftCustomization } = get()
                if (!draftCustomization) return

                set({
                    draftCustomization: { ...draftCustomization, bookmarks },
                    isDirty: true,
                })
            },

            /**
             * Update draft practice items
             */
            updateDraftPracticeItems: (practiceItems) => {
                const { draftCustomization } = get()
                if (!draftCustomization) return

                set({
                    draftCustomization: { ...draftCustomization, practiceItems },
                    isDirty: true,
                })
            },

            /**
             * Save draft to server
             */
            save: async () => {
                const { draftCustomization } = get()
                if (!draftCustomization) return false

                set({ isSaving: true, error: null })

                try {
                    const response = await fetch('/api/portal/menu-customization', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(draftCustomization),
                    })

                    if (!response.ok) {
                        throw new Error('Failed to save menu customization')
                    }

                    set({
                        customization: JSON.parse(JSON.stringify(draftCustomization)),
                        isSaving: false,
                        isDirty: false,
                    })

                    return true
                } catch (error) {
                    console.error('Failed to save menu customization:', error)
                    set({
                        isSaving: false,
                        error: error instanceof Error ? error.message : 'Failed to save',
                    })
                    return false
                }
            },

            /**
             * Reset to defaults
             */
            reset: async () => {
                set({ isSaving: true, error: null })

                try {
                    const response = await fetch('/api/portal/menu-customization', {
                        method: 'DELETE',
                    })

                    if (!response.ok) {
                        throw new Error('Failed to reset menu customization')
                    }

                    set({
                        customization: DEFAULT_CUSTOMIZATION,
                        draftCustomization: JSON.parse(JSON.stringify(DEFAULT_CUSTOMIZATION)),
                        isSaving: false,
                        isDirty: false,
                    })

                    return true
                } catch (error) {
                    console.error('Failed to reset menu customization:', error)
                    set({
                        isSaving: false,
                        error: error instanceof Error ? error.message : 'Failed to reset',
                    })
                    return false
                }
            },

            /**
             * Clear draft state
             */
            clearDraft: () => {
                set({
                    draftCustomization: null,
                    isDirty: false,
                    error: null,
                })
            },
        }),
        { name: 'portal-menu-customization' }
    )
)

export default usePortalMenuCustomizationStore
