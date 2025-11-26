/**
 * Portal Dashboard Layout
 * Main layout wrapper for portal pages with sidebar navigation
 * Adapts AdminDashboardLayout pattern for client portal
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import PortalSidebar from './PortalSidebar'
import PortalHeader from './PortalHeader'
import PortalFooter from './PortalFooter'
import { useResponsive } from '@/hooks/admin/useResponsive'
import {
    usePortalSidebarCollapsed,
    usePortalLayoutActions
} from '@/stores/portal/layout.store'
import { cn } from '@/lib/utils'

interface PortalDashboardLayoutProps {
    children: React.ReactNode
    className?: string
}

export default function PortalDashboardLayout({
    children,
    className
}: PortalDashboardLayoutProps) {
    const pathname = usePathname()
    const responsive = useResponsive()

    // State from Zustand store
    const collapsed = usePortalSidebarCollapsed()
    const { setSidebarCollapsed } = usePortalLayoutActions()

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Client-side hydration flag
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Auto-collapse sidebar on mobile
    useEffect(() => {
        if (responsive.isMobile || responsive.isTablet) {
            setSidebarCollapsed(true)
        }
    }, [responsive.isMobile, responsive.isTablet, setSidebarCollapsed])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const handleMenuToggle = useCallback(() => {
        if (responsive.isMobile) {
            setMobileMenuOpen(!mobileMenuOpen)
        } else {
            setSidebarCollapsed(!collapsed)
        }
    }, [responsive.isMobile, mobileMenuOpen, collapsed, setSidebarCollapsed])

    const handleMobileMenuClose = useCallback(() => {
        setMobileMenuOpen(false)
    }, [])

    // Calculate content margin based on sidebar state
    const contentMargin = responsive.isMobile
        ? 'ml-0'
        : collapsed
            ? 'ml-16'
            : 'ml-64'

    // Loading skeleton during SSR
    if (!isClient) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
                <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="animate-pulse p-4 space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" />
                    <div className="p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4" />
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
                    </div>
                </div>
            </div>
        )
    }

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

            {/* Sidebar */}
            <PortalSidebar
                isMobile={responsive.isMobile}
                isOpen={mobileMenuOpen}
                onClose={handleMobileMenuClose}
            />

            {/* Main content area */}
            <div
                className={cn(
                    'min-h-screen flex flex-col transition-all duration-300',
                    contentMargin
                )}
            >
                {/* Header */}
                <PortalHeader
                    onMenuToggle={handleMenuToggle}
                    isMobile={responsive.isMobile}
                />

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
        </div>
    )
}
