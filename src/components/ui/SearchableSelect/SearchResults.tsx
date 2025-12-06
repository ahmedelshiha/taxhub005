import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchResultItem } from './SearchResultItem'
import { EmptyState } from './EmptyState'

export interface SearchResultsProps<T> {
    items: T[]
    selectedItem: T | null
    onSelect: (item: T) => void
    renderItem: (item: T, highlight: (text: string) => string) => React.ReactNode
    highlightMatches: (text: string) => string
    query: string
    maxHeight?: string
    emptyMessage?: string
}

/**
 * Results list with keyboard navigation
 * Sub-component of SearchableSelect
 */
export function SearchResults<T>({
    items,
    selectedItem,
    onSelect,
    renderItem,
    highlightMatches,
    query,
    maxHeight = '300px',
    emptyMessage
}: SearchResultsProps<T>) {
    const [focusedIndex, setFocusedIndex] = useState(0)
    const listRef = useRef<HTMLDivElement>(null)

    // Reset focused index when items change
    useEffect(() => {
        setFocusedIndex(0)
    }, [items])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setFocusedIndex(prev => Math.min(prev + 1, items.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setFocusedIndex(prev => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                if (items[focusedIndex]) {
                    onSelect(items[focusedIndex])
                }
                break
        }
    }, [items, focusedIndex, onSelect])

    if (items.length === 0) {
        return <EmptyState query={query} message={emptyMessage} />
    }

    return (
        <div
            ref={listRef}
            role="listbox"
            onKeyDown={handleKeyDown}
            className="overflow-y-auto border-t border-gray-700"
            style={{ maxHeight }}
        >
            {items.map((item, index) => (
                <SearchResultItem
                    key={index}
                    item={item}
                    isSelected={item === selectedItem}
                    isFocused={index === focusedIndex}
                    onSelect={onSelect}
                    renderItem={renderItem}
                    highlightMatches={highlightMatches}
                />
            ))}
        </div>
    )
}
