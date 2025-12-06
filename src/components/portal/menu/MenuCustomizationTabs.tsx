/**
 * Portal Menu Customization Tabs
 * 
 * Tab navigation for menu customization modal.
 * Three tabs: Sections, Bookmarks, Your Practice
 */

'use client'

import { Layout, Bookmark, Sliders } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'sections' | 'bookmarks' | 'practice'

export interface MenuCustomizationTabsProps {
    selectedTab: TabId
    onTabChange: (tab: TabId) => void
}

const TABS = [
    {
        id: 'sections' as const,
        label: 'Sections',
        icon: Layout,
        description: 'Reorder and hide menu sections',
    },
    {
        id: 'bookmarks' as const,
        label: 'Bookmarks',
        icon: Bookmark,
        description: 'Bookmark your favorite pages',
    },
    {
        id: 'practice' as const,
        label: 'Your Practice',
        icon: Sliders,
        description: 'Customize practice items',
    },
]

export function MenuCustomizationTabs({
    selectedTab,
    onTabChange,
}: MenuCustomizationTabsProps) {
    return (
        <div className="border-b border-gray-700/50">
            <div className="flex overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon }) => {
                    const isSelected = selectedTab === id

                    return (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3',
                                'text-sm font-medium whitespace-nowrap',
                                'border-b-2 transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2',
                                'focus-visible:ring-blue-500 focus-visible:ring-inset',
                                isSelected
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                            )}
                            role="tab"
                            aria-selected={isSelected}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default MenuCustomizationTabs
