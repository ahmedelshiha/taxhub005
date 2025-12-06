import { InputHTMLAttributes, forwardRef } from 'react'
import { Search, X } from 'lucide-react'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    value: string
    onValueChange: (value: string) => void
    onClear: () => void
    isSearching?: boolean
    showClearButton?: boolean
}

/**
 * Search input field with clear button
 * Sub-component of SearchableSelect
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onValueChange, onClear, isSearching, showClearButton = true, className = '', ...props }, ref) => {
        return (
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                />
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className={`
            w-full pl-9 pr-9 py-2.5 
            border border-gray-700 rounded-lg
            bg-gray-800 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
            ${className}
          `}
                    {...props}
                />
                {showClearButton && value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600
              dark:hover:text-gray-300
              transition-colors
            "
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }
)

SearchInput.displayName = 'SearchInput'
