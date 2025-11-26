/**
 * Entity Switcher Component
 * Allows switching between user's entities with dropdown
 */

'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Check, Building2, ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { usePortalSelectedEntity, usePortalLayoutActions } from '@/stores/portal/layout.store'
import { cn } from '@/lib/utils'

interface Entity {
    id: string
    name: string
    type: string
    status: string
    taxId?: string | null
    country: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EntitySwitcher() {
    const selectedEntityId = usePortalSelectedEntity()
    const { setSelectedEntity } = usePortalLayoutActions()
    const [isOpen, setIsOpen] = useState(false)

    const { data, error, isLoading } = useSWR<{
        success: boolean
        data: { entities: Entity[]; total: number }
    }>('/api/portal/entities', fetcher)

    const entities = data?.data?.entities || []
    const currentEntity = selectedEntityId
        ? entities.find(e => e.id === selectedEntityId)
        : entities[0] // Default to first entity

    const handleEntitySwitch = async (entityId: string) => {
        setSelectedEntity(entityId)
        setIsOpen(false)

        // Refresh all portal data for new entity
        await Promise.all([
            mutate('/api/portal/overview'),
            mutate('/api/portal/tasks'),
            mutate('/api/portal/compliance'),
            mutate('/api/portal/financial'),
            mutate('/api/portal/activity'),
            mutate('/api/portal/counts'),
        ])
    }

    if (isLoading) {
        return (
            <Button variant="ghost" size="sm" disabled className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden md:inline">Loading...</span>
            </Button>
        )
    }

    if (error || !entities.length) {
        return null // Don't show if no entities
    }

    // If only one entity, show it without dropdown
    if (entities.length === 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="hidden md:inline font-medium">{entities[0].name}</span>
            </div>
        )
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden md:inline font-medium">
                        {currentEntity?.name || 'Select Entity'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>Switch Entity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {entities.map((entity) => (
                    <DropdownMenuItem
                        key={entity.id}
                        onClick={() => handleEntitySwitch(entity.id)}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{entity.name}</span>
                                    {entity.id === currentEntity?.id && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize">{entity.type.toLowerCase()}</span>
                                    {entity.taxId && (
                                        <>
                                            <span>•</span>
                                            <span>{entity.taxId}</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-xs",
                                        entity.status === 'VERIFIED'
                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    )}>
                                        {entity.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
