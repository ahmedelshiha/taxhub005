"use client";

import { useState, useCallback } from "react";
import { BusinessCard } from "./BusinessCard";
import { BusinessActionModal } from "./BusinessActionModal";

interface Business {
    id: string;
    name: string;
    country: string;
    legalForm?: string | null;
    status: string;
    createdAt: string | Date;
    userRole?: string;
    licensesCount?: number;
    registrationsCount?: number;
}

interface BusinessListProps {
    businesses: Business[];
    onUpdate?: () => void;
}

export function BusinessList({ businesses, onUpdate }: BusinessListProps) {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        businessId: string | null;
        businessName: string | null;
        action: 'ARCHIVE' | 'DELETE' | null;
    }>({
        isOpen: false,
        businessId: null,
        businessName: null,
        action: null,
    });

    const handleAction = useCallback((id: string, name: string, action: 'ARCHIVE' | 'DELETE') => {
        setModalState({
            isOpen: true,
            businessId: id,
            businessName: name,
            action,
        });
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalState({
            isOpen: false,
            businessId: null,
            businessName: null,
            action: null,
        });
    }, []);

    const handleSuccess = useCallback(() => {
        onUpdate?.();
    }, [onUpdate]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                    <BusinessCard
                        key={business.id}
                        business={business}
                        onAction={handleAction}
                    />
                ))}
            </div>

            <BusinessActionModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                businessId={modalState.businessId}
                businessName={modalState.businessName}
                action={modalState.action}
                onSuccess={handleSuccess}
            />
        </>
    );
}
