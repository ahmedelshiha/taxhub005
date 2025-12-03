/**
 * Business Approvals Page - Server Component
 * Entry point for admin business approval management
 */

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import BusinessApprovalsClientPage from "@/components/admin/approvals/BusinessApprovalsClientPage";

export const metadata = {
    title: "Business Approvals | Admin Dashboard",
    description: "Review and manage pending business submissions",
};

export default function BusinessApprovalsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            }
        >
            <BusinessApprovalsClientPage />
        </Suspense>
    );
}
