'use client'

import { useRef, useState } from 'react'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'
import { useSearch } from './useSearch'

export interface SearchableSelectProps<T> {
    items: T[]
    value: T | null
    onChange: (item: T | null) => void
    searchKeys: (keyof T)[]
    renderItem: (item: T, highlight: (text: string) => string) => React.ReactNode
    renderSelected?: (item: T) => React.ReactNode
    placeholder?: string
    emptyMessage?: string
    disabled?: boolean
    className?: string
}

/**
 * Searchable dropdown select component
 * 
 * Features:
 * - Filter-as-you-type with 300ms debounce
 * - Keyboard navigation (arrows, enter, escape)
 * - Highlight matching text
 * - Mobile responsive
 * - Accessible (ARIA)
 * 
 * @example
 * ```tsx
 * <SearchableSelect
 *   items={departments}
 *   value={selectedDept}
 *   onChange={setSelectedDept}
 *   searchKeys={['name', 'shortName']}
 *   renderItem={(dept) => dept.name}
 *   placeholder="Search departments..."
 * />
 * ```
 */
export function SearchableSelect<T>({
    items,
    value,
    onChange,
    searchKeys,
    renderItem,
    renderSelected,
    placeholder = 'Search...',
    emptyMessage,
    disabled = false,
    className = ''
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { query, setQuery, filteredItems, clearQuery, highlightMatches } = useSearch({
        items,
        searchKeys
    })

    const handleSelect = (item: T) => {
        onChange(item)
        setIsOpen(false)
        clearQuery()
    }

    const handleClear = () => {
        clearQuery()
        onChange(null)
    }

    const handleToggle = () => {
        if (disabled) return
        setIsOpen(!isOpen)
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }

    return (
        <div className={`relative ${className}`}>
            {/* Selected value display */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
          w-full px-4 py-2.5 text-left
          border rounded-lg
          bg-gray-800
          border-gray-700
          hover:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-gray-100
          transition-colors
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {value && renderSelected ? renderSelected(value) :
                    value ? renderItem(value, () => '') :
                        <span className="text-gray-500">{placeholder}</span>}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="
          absolute z-50 w-full mt-1
          bg-gray-900
          border border-gray-700
          rounded-lg shadow-xl
        ">
                    <div className="p-2">
                        <SearchInput
                            ref={inputRef}
                            value={query}
                            onValueChange={setQuery}
                            onClear={clearQuery}
                            placeholder={placeholder}
                        />
                    </div>

                    <SearchResults
                        items={filteredItems}
                        selectedItem={value}
                        onSelect={handleSelect}
                        renderItem={renderItem}
                        highlightMatches={highlightMatches}
                        query={query}
                        emptyMessage={emptyMessage}
                    />
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    )
}
