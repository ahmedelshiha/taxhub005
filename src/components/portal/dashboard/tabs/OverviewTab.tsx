/**
 * Overview Tab Component
 * Main dashboard overview with key metrics and recent activity
 * ~100 lines, follows modular architecture pattern
 */
/**
 * Overview Tab Component
 * Main dashboard overview with key metrics and recent activity
 * ~100 lines, follows modular architecture pattern
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useSWR from 'swr'
import {
    CheckSquare,
    Calendar,
    DollarSign,
    AlertCircle,
} from 'lucide-react'
import StatCard from '../cards/StatCard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface DashboardStats {
    tasks: { total: number; pending: number; trend: number }
    bookings: { upcoming: number; thisWeek: number; trend: number }
    invoices: { outstanding: number; overdue: number; total: number }
    compliance: { pending: number; due: number; trend: number }
}

export default function OverviewTab() {
    const { data, isLoading, error } = useSWR<{ success: boolean; data: DashboardStats }>(
        '/api/portal/overview',
        fetcher,
        { refreshInterval: 300000 } // 5 min
    )

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load overview data</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-12 w-16 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const stats = data?.data

    const statCards = [
        {
            title: 'Active Tasks',
            value: stats?.tasks.total || 0,
            subtitle: `${stats?.tasks.pending || 0} pending`,
            icon: CheckSquare,
            trend: stats?.tasks.trend || 0,
            color: 'text-blue-600'
        },
        {
            title: 'Upcoming Bookings',
            value: stats?.bookings.upcoming || 0,
            subtitle: `${stats?.bookings.thisWeek || 0} this week`,
            icon: Calendar,
            trend: stats?.bookings.trend || 0,
            color: 'text-green-600'
        },
        {
            title: 'Outstanding Invoices',
            value: stats?.invoices.outstanding || 0,
            subtitle: `${stats?.invoices.overdue || 0} overdue`,
            icon: DollarSign,
            trend: stats?.invoices.total ? ((stats.invoices.outstanding / stats.invoices.total) * 100 - 100) : 0,
            color: 'text-orange-600'
        },
        {
            title: 'Compliance Items',
            value: stats?.compliance.pending || 0,
            subtitle: `${stats?.compliance.due || 0} due soon`,
            icon: AlertCircle,
            trend: stats?.compliance.trend || 0,
            color: 'text-red-600'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        trend={stat.trend}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* Additional sections can be added here */}
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to TaxHub Portal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your professional dashboard for managing compliance, financials, and business operations.
                        Use the sidebar to navigate to different sections, or switch tabs above for detailed views.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
