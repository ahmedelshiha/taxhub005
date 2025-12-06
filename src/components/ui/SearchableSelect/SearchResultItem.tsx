export interface SearchResultItemProps<T> {
    item: T
    isSelected: boolean
    isFocused: boolean
    onSelect: (item: T) => void
    renderItem: (item: T, highlight: (text: string) => string) => React.ReactNode
    highlightMatches: (text: string) => string
}

/**
 * Single result item in the dropdown
 * Sub-component of SearchableSelect
 */
export function SearchResultItem<T>({
    item,
    isSelected,
    isFocused,
    onSelect,
    renderItem,
    highlightMatches
}: SearchResultItemProps<T>) {
    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className={`
        w-full px-3 py-2.5 text-left text-gray-100
        transition-colors
        ${isFocused ? 'bg-blue-600/20' : ''}
        ${isSelected ? 'bg-blue-600/30 font-medium' : ''}
        ${!isFocused && !isSelected ? 'hover:bg-gray-800' : ''}
      `}
            role="option"
            aria-selected={isSelected}
        >
            {renderItem(item, highlightMatches)}
        </button>
    )
}
