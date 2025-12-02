/**
 * Portal Dashboard Layout
 * Simplified, zero-loop architecture
 * CSS-first responsive design with minimal state
 */

'use client'

import { useState } from 'react'
import PortalSidebar from './PortalSidebar'
import PortalHeader from './PortalHeader'
import PortalFooter from './PortalFooter'
import { Breadcrumbs } from '../Breadcrumbs'
import { cn } from '@/lib/utils'
import { OfflineIndicator } from '../OfflineIndicator'

interface PortalDashboardLayoutProps {
    children: React.ReactNode
    className?: string
}

export default function PortalDashboardLayout({
    children,
    className
}: PortalDashboardLayoutProps) {
    // Simple mobile menu state - no complex effects or subscriptions
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
            {/* Skip to main content link for accessibility */}
            <a
                href="#portal-main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:px-3 focus:py-2 focus:z-[60] rounded"
                onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('portal-main-content')?.focus()
                }}
            >
                Skip to main content
            </a>

            {/* Sidebar - CSS handles responsive behavior */}
            <PortalSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Main content area - CSS handles margin on desktop */}
            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* Header */}
                <PortalHeader onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

                {/* Breadcrumbs */}
                <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <Breadcrumbs />
                    </div>
                </div>

                {/* Scrollable content */}
                <main
                    id="portal-main-content"
                    tabIndex={-1}
                    className="flex-1 focus:outline-none"
                    role="main"
                    aria-label="Portal content"
                >
                    {children}
                </main>

                {/* Footer */}
                <PortalFooter />
            </div>

            <OfflineIndicator />
        </div>
    )
}
