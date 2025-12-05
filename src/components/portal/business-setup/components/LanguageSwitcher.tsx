'use client'

import { useI18n, type Language } from '../hooks/useI18n'

interface LanguageSwitcherProps {
    className?: string
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

/**
 * Compact language switcher for modal header
 */
export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const { language, setLanguage } = useI18n()

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {LANGUAGES.map(({ code, flag }) => (
                <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`
            w-8 h-8 rounded-md flex items-center justify-center
            text-lg transition-all
            ${language === code
                            ? 'bg-blue-600 ring-2 ring-blue-400'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }
          `}
                    title={code === 'en' ? 'English' : 'العربية'}
                    aria-label={`Switch to ${code === 'en' ? 'English' : 'Arabic'}`}
                >
                    {flag}
                </button>
            ))}
        </div>
    )
}

/**
 * Dropdown language selector
 */
export function LanguageDropdown({ className = '' }: LanguageSwitcherProps) {
    const { language, setLanguage } = useI18n()
    const currentLang = LANGUAGES.find(l => l.code === language)

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={`
        px-3 py-1.5 rounded-lg
        bg-gray-800 border border-gray-700
        text-sm text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500
        cursor-pointer
        ${className}
      `}
            aria-label="Select language"
        >
            {LANGUAGES.map(({ code, label, flag }) => (
                <option key={code} value={code}>
                    {flag} {label}
                </option>
            ))}
        </select>
    )
}

export default LanguageSwitcher
