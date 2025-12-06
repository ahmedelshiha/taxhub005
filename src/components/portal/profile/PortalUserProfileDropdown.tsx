/**
 * Portal User Profile Dropdown
 * 
 * Premium dark-themed user profile dropdown menu.
 * Features: theme toggle, status selector, quick links, sign out.
 * 
 * Composed of modular subcomponents for maintainability.
 */

'use client'

import { useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ChevronDown, Home, Building2, FileText, Settings, LogOut, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useUserStatus } from '@/hooks/useUserStatus'

import { Avatar } from './Avatar'
import { UserInfo } from './UserInfo'
import { ThemeSelector } from './ThemeSelector'
import { StatusSelector } from './StatusSelector'
import { MenuSection } from './MenuSection'
import { MenuItem } from './MenuItem'

export interface PortalUserProfileDropdownProps {
    className?: string
    onOpenMenuCustomization?: () => void
}

export function PortalUserProfileDropdown({
    className,
    onOpenMenuCustomization,
}: PortalUserProfileDropdownProps) {
    const { data: session } = useSession()
    const { status: userStatus } = useUserStatus()

    const name = session?.user?.name || 'User'
    const email = session?.user?.email || undefined
    const image = (session?.user as any)?.image as string | undefined
    const role = (session?.user as any)?.role as string | undefined

    const handleSignOut = useCallback(() => {
        const confirmed = window.confirm('Are you sure you want to sign out?')
        if (confirmed) {
            signOut({ callbackUrl: '/login' })
        }
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        'flex items-center gap-2 px-2 py-1.5 h-auto',
                        'hover:bg-gray-800 rounded-lg transition-colors',
                        className
                    )}
                    aria-label="Open user menu"
                >
                    <Avatar
                        name={name}
                        src={image}
                        size="sm"
                        showStatus
                        status={userStatus}
                    />
                    <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-white">{name}</div>
                        <div className="text-xs text-gray-400">{role || 'Client'}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className={cn(
                    'w-80 p-0',
                    'bg-gray-900 border border-gray-700/50',
                    'shadow-2xl shadow-black/50',
                    'backdrop-blur-sm'
                )}
            >
                {/* Profile Header */}
                <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <Avatar
                            name={name}
                            src={image}
                            size="lg"
                            showStatus
                            status={userStatus}
                        />
                        <UserInfo
                            name={name}
                            email={email}
                            role={role || 'Client Portal'}
                            variant="full"
                        />
                    </div>
                </div>

                {/* Preferences Section */}
                <MenuSection title="Preferences">
                    <div className="px-2 space-y-2">
                        <ThemeSelector showLabels className="justify-between" />
                        <StatusSelector />
                    </div>
                </MenuSection>

                {/* Quick Actions Section */}
                <MenuSection title="Quick Actions">
                    <MenuItem
                        href="/portal"
                        label="Dashboard"
                        icon={Home}
                    />
                    <MenuItem
                        href="/portal/businesses"
                        label="My Businesses"
                        icon={Building2}
                    />
                    <MenuItem
                        href="/portal/documents"
                        label="Documents"
                        icon={FileText}
                    />
                    <MenuItem
                        href="/portal/settings"
                        label="Settings"
                        icon={Settings}
                    />
                    {onOpenMenuCustomization && (
                        <MenuItem
                            label="Customize Menu"
                            icon={Palette}
                            onClick={onOpenMenuCustomization}
                        />
                    )}
                </MenuSection>

                {/* Sign Out */}
                <div className="p-1">
                    <MenuItem
                        label="Sign Out"
                        icon={LogOut}
                        shortcut="⌘Q"
                        onClick={handleSignOut}
                        variant="danger"
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PortalUserProfileDropdown
