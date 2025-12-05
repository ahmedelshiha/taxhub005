'use client'

/**
 * SetupModal with i18n Support
 * 
 * Wraps the SetupModal with I18nProvider for multi-language support.
 * Also applies RTL styles when Arabic is selected.
 */

import { SetupModal as BaseSetupModal, type SetupModalProps } from './SetupModal'
import { I18nProvider, useI18n } from '../hooks/useI18n'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

/**
 * RTL-aware wrapper for the modal
 */
function RTLWrapper({ children }: { children: React.ReactNode }) {
    const { direction, isRTL } = useI18n()

    return (
        <div
            dir={direction}
            className={isRTL ? 'font-arabic' : ''}
            style={{ direction }}
        >
            {children}
        </div>
    )
}

/**
 * SetupModal with full i18n support
 */
export function SetupModalI18n(props: SetupModalProps) {
    return (
        <I18nProvider>
            <RTLWrapper>
                <BaseSetupModal {...props} />
            </RTLWrapper>
        </I18nProvider>
    )
}

export { LanguageSwitcher }
export default SetupModalI18n
