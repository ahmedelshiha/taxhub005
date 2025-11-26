/**
 * Compliance Tab Component
 * Compliance tracking with deadlines and obligations (~130 lines)
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Clock, CheckCircle, Calendar, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import StatCard from '../cards/StatCard'
import ListCard from '../cards/ListCard'
import ExportButton from '@/components/portal/export/ExportButton'
import HelpTooltip from '@/components/portal/help/HelpTooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { format, formatDistanceToNow } from 'date-fns'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ComplianceItem {
    id: string
    title: string
    type: string
    dueDate: string
    status: string
    entity?: { name: string }
    filingPeriod?: { startDate: string; endDate: string }
}

export default function ComplianceTab() {
    const router = useRouter()

    const { data, isLoading, error } = useSWR<{
        success: boolean; data: {
            items: ComplianceItem[]
            stats: {
                total: number
                pending: number
                dueSoon: number
                overdue: number
                completed: number
            }
        }
    }>('/api/portal/compliance', fetcher)

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load compliance data</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-12 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    const stats = data?.data?.stats || { total: 0, pending: 0, dueSoon: 0, overdue: 0, completed: 0 }
    const items = data?.data?.items || []

    // Separate items by urgency
    const overdueItems = items.filter(item => item.status === 'OVERDUE')
    const dueSoonItems = items.filter(item => {
        if (item.status !== 'PENDING') return false
        const daysUntil = Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysUntil <= 30 && daysUntil > 0
    })

    const complianceListItems = [...overdueItems, ...dueSoonItems].slice(0, 10).map(item => {
        const isOverdue = item.status === 'OVERDUE'
        return {
            id: item.id,
            title: item.title,
            subtitle: item.entity?.name || 'No entity',
            badge: {
                label: isOverdue ? 'Overdue' : 'Due Soon',
                variant: isOverdue ? ('destructive' as const) : ('outline' as const)
            },
            href: `/portal/compliance/${item.id}`,
            metadata: `Due ${format(new Date(item.dueDate), 'MMM dd, yyyy')}`
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance</h2>
                    <HelpTooltip content="Track tax obligations, filing deadlines, and regulatory compliance requirements" />
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton dataType="compliance" />
                    <Button onClick={() => router.push('/portal/compliance')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Obligations"
                    value={stats.total}
                    icon={AlertCircle}
                    color="text-blue-600"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    subtitle="Awaiting action"
                    icon={Clock}
                    color="text-orange-600"
                />
                <StatCard
                    title="Due Soon"
                    value={stats.dueSoon}
                    subtitle="Next 30 days"
                    icon={AlertCircle}
                    color="text-yellow-600"
                />
                <StatCard
                    title="Overdue"
                    value={stats.overdue}
                    subtitle="Needs attention"
                    icon={AlertCircle}
                    color="text-red-600"
                />
            </div>

            {/* Urgent Items */}
            <ListCard
                title="Urgent Compliance Items"
                icon={AlertCircle}
                items={complianceListItems}
                emptyMessage="All compliance items are up to date!"
                viewAllHref="/portal/compliance"
                maxItems={10}
            />

            {/* Info Card */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                                Stay Compliant
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Set up automatic reminders and notifications to never miss a deadline. Visit the compliance center for full details.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
