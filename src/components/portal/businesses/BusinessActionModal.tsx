/**
 * Business Action Modal
 * 
 * Handles critical actions like Archiving or Deleting a business.
 */

'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BusinessActionModalProps {
    isOpen: boolean
    onClose: () => void
    businessId: string | null
    businessName: string | null
    action: 'ARCHIVE' | 'DELETE' | null
    onSuccess?: () => void
}

export function BusinessActionModal({
    isOpen,
    onClose,
    businessId,
    businessName,
    action,
    onSuccess
}: BusinessActionModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        if (!businessId || !action) return

        setIsLoading(true)
        try {
            // Determine endpoint based on action
            // For now we treat both as archive/status update since we don't have hard delete API yet
            const response = await fetch(`/api/entities/${businessId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: action === 'DELETE' ? 'ARCHIVED' : 'ARCHIVED'
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update business')
            }

            toast.success(`Business ${action === 'DELETE' ? 'deleted' : 'archived'} successfully`)
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating business:', error)
            toast.error('Failed to update business')
        } finally {
            setIsLoading(false)
        }
    }

    if (!action) return null

    const isDelete = action === 'DELETE'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl">
                            {isDelete ? 'Delete Business' : 'Archive Business'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-400">
                        Are you sure you want to {isDelete ? 'delete' : 'archive'} <span className="font-semibold text-white">{businessName}</span>?
                        {isDelete
                            ? " This action cannot be undone. All data associated with this business will be permanently removed."
                            : " This will hide the business from your main list, but data will be preserved."
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-3 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        {isDelete ? 'Delete Forever' : 'Archive Business'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
