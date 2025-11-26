/**
 * Activity Tab Component
 * Recent activity feed with timeline view (~110 lines)
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle, Filter } from 'lucide-react'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ActivityItem {
    id: string
    type: 'task' | 'booking' | 'invoice' | 'document' | 'compliance' | 'system'
    title: string
    description: string
    timestamp: string
    user?: { name: string }
    metadata?: Record<string, any>
}

const activityIcons = {
    task: '✓',
    booking: '📅',
    invoice: '💰',
    document: '📄',
    compliance: '⚖️',
    system: '⚙️',
}

const activityColors = {
    task: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    booking: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    invoice: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    document: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    compliance: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    system: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function ActivityTab() {
    const { data, isLoading, error } = useSWR<{
        success: boolean; data: {
            activities: ActivityItem[]
            total: number
        }
    }>('/api/portal/activity', fetcher, {
        refreshInterval: 60000, // Refresh every minute
    })

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load activity feed</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const activities = data?.data?.activities || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
                    <p className="text-gray-600 dark:text-gray-400">Recent updates and system events</p>
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            {/* Activity Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activities.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No recent activity
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="flex gap-4 relative">
                                    {/* Timeline line */}
                                    {index < activities.length - 1 && (
                                        <div className="absolute left-5 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        'h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 relative z-10',
                                        activityColors[activity.type]
                                    )}>
                                        {activityIcons[activity.type]}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-6">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                    </span>
                                                    {activity.user && (
                                                        <>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {activity.user.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {activity.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
