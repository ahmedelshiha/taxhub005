/**
 * Portal Menu Bookmarks Tab
 * 
 * Search and bookmark portal pages.
 * Allows quick access to frequently used pages.
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, Bookmark, Check, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import type { PortalMenuCustomization, BookmarkItem } from '@/stores/portal/menuCustomization.store'

export interface BookmarksTabProps {
    customization: PortalMenuCustomization
    onChange: (bookmarks: BookmarkItem[]) => void
}

// Available pages to bookmark
const AVAILABLE_PAGES = [
    { id: 'dashboard', label: 'Dashboard', href: '/portal', category: 'Overview' },
    { id: 'analytics', label: 'Analytics', href: '/portal/analytics', category: 'Overview' },
    { id: 'kyc', label: 'KYC Center', href: '/portal/kyc', category: 'Compliance' },
    { id: 'documents', label: 'Documents', href: '/portal/documents', category: 'Compliance' },
    { id: 'compliance', label: 'Compliance', href: '/portal/compliance', category: 'Compliance' },
    { id: 'invoicing', label: 'Invoicing', href: '/portal/invoicing', category: 'Financials' },
    { id: 'bills', label: 'Bills', href: '/portal/bills', category: 'Financials' },
    { id: 'expenses', label: 'Expenses', href: '/portal/expenses', category: 'Financials' },
    { id: 'tasks', label: 'Tasks', href: '/portal/tasks', category: 'Operations' },
    { id: 'bookings', label: 'Bookings', href: '/portal/bookings', category: 'Operations' },
    { id: 'service-requests', label: 'Service Requests', href: '/portal/service-requests', category: 'Operations' },
    { id: 'messages', label: 'Messages', href: '/portal/messages', category: 'Support' },
    { id: 'help', label: 'Help Center', href: '/portal/help', category: 'Support' },
    { id: 'settings', label: 'Settings', href: '/portal/settings', category: 'Support' },
]

export function BookmarksTab({ customization, onChange }: BookmarksTabProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const bookmarks = customization.bookmarks || []

    const bookmarkedIds = useMemo(() =>
        new Set(bookmarks.map(b => b.id)),
        [bookmarks]
    )

    const filteredPages = useMemo(() => {
        if (!searchQuery.trim()) return AVAILABLE_PAGES
        const query = searchQuery.toLowerCase()
        return AVAILABLE_PAGES.filter(
            page => page.label.toLowerCase().includes(query) ||
                page.category.toLowerCase().includes(query)
        )
    }, [searchQuery])

    const groupedPages = useMemo(() => {
        const groups: Record<string, typeof AVAILABLE_PAGES> = {}
        filteredPages.forEach(page => {
            if (!groups[page.category]) {
                groups[page.category] = []
            }
            groups[page.category].push(page)
        })
        return groups
    }, [filteredPages])

    const handleToggleBookmark = useCallback((page: typeof AVAILABLE_PAGES[0]) => {
        if (bookmarkedIds.has(page.id)) {
            // Remove bookmark
            const updated = bookmarks.filter(b => b.id !== page.id)
            onChange(updated)
        } else {
            // Add bookmark
            const newBookmark: BookmarkItem = {
                id: page.id,
                label: page.label,
                href: page.href,
                order: bookmarks.length,
            }
            onChange([...bookmarks, newBookmark])
        }
    }, [bookmarks, bookmarkedIds, onChange])

    const handleRemoveBookmark = useCallback((id: string) => {
        const updated = bookmarks.filter(b => b.id !== id)
        onChange(updated)
    }, [bookmarks, onChange])

    return (
        <div className="space-y-4">
            {/* Current Bookmarks */}
            {bookmarks.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Your Bookmarks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {bookmarks.map(bookmark => (
                            <div
                                key={bookmark.id}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-1.5 rounded-full',
                                    'bg-blue-500/20 border border-blue-500/30',
                                    'text-sm text-blue-400'
                                )}
                            >
                                <Star className="h-3 w-3" />
                                <span>{bookmark.label}</span>
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.id)}
                                    className="hover:text-white transition-colors"
                                    aria-label={`Remove ${bookmark.label} bookmark`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search pages to bookmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                        'pl-10 bg-gray-800 border-gray-700',
                        'text-white placeholder:text-gray-500',
                        'focus:border-blue-500 focus:ring-blue-500/20'
                    )}
                />
            </div>

            {/* Available Pages */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(groupedPages).map(([category, pages]) => (
                    <div key={category}>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {category}
                        </h4>
                        <div className="space-y-1">
                            {pages.map(page => {
                                const isBookmarked = bookmarkedIds.has(page.id)
                                return (
                                    <button
                                        key={page.id}
                                        onClick={() => handleToggleBookmark(page)}
                                        className={cn(
                                            'flex items-center justify-between w-full',
                                            'px-3 py-2 rounded-md transition-colors',
                                            'focus-visible:outline-none focus-visible:ring-2',
                                            'focus-visible:ring-blue-500',
                                            isBookmarked
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        )}
                                    >
                                        <span className="text-sm">{page.label}</span>
                                        {isBookmarked ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Bookmark className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookmarksTab
