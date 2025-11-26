/**
 * Portal Layout
 * Applies PortalDashboardLayout to all /portal/* routes
 */

import PortalDashboardLayout from '@/components/portal/layout/PortalDashboardLayout'

export default function PortalAppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <PortalDashboardLayout>{children}</PortalDashboardLayout>
}
