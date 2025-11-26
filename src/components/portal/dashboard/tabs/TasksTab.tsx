/**
 * Tasks Tab Component
 * Task management view with stats and task list (~120 lines)
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckSquare, Clock, AlertCircle, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import StatCard from '../cards/StatCard'
import ListCard from '../cards/ListCard'
import ExportButton from '@/components/portal/export/ExportButton'
import HelpTooltip from '@/components/portal/help/HelpTooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueAt?: string
  assignee?: { name: string }
  completionPercentage?: number
}

export default function TasksTab() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')

  const { data, isLoading, error } = useSWR<{
    success: boolean; data: {
      tasks: Task[]
      stats: {
        total: number
        active: number
        completed: number
        overdue: number
      }
    }
  }>('/api/portal/tasks', fetcher)

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load tasks</span>
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

  const stats = data?.data?.stats || { total: 0, active: 0, completed: 0, overdue: 0 }
  const tasks = data?.data?.tasks || []

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return ['OPEN', 'IN_PROGRESS'].includes(task.status)
    if (filter === 'completed') return task.status === 'DONE'
    return true
  })

  const taskListItems = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    subtitle: task.assignee?.name || 'Unassigned',
    badge: {
      label: task.priority,
      variant: task.priority === 'HIGH' ? ('destructive' as const) : ('secondary' as const)
    },
    href: `/portal/tasks/${task.id}`,
    metadata: task.dueAt ? `Due ${formatDistanceToNow(new Date(task.dueAt), { addSuffix: true })}` : undefined
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
          <HelpTooltip content="Manage your work items, assign team members, and track task completion progress" />
        </div>
        <div className="flex items-center gap-2">
          <ExportButton dataType="tasks" filters={{ status: filter !== 'all' ? filter : undefined }} />
          <Button onClick={() => router.push('/portal/tasks/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          color="text-blue-600"
          onClick={() => setFilter('all')}
        />
        <StatCard
          title="Active"
          value={stats.active}
          subtitle="In progress"
          icon={Clock}
          color="text-orange-600"
          onClick={() => setFilter('active')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Done"
          icon={CheckSquare}
          color="text-green-600"
          onClick={() => setFilter('completed')}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Need attention"
          icon={AlertCircle}
          color="text-red-600"
        />
      </div>

      {/* Task List */}
      <ListCard
        title={`${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks`}
        icon={CheckSquare}
        items={taskListItems}
        emptyMessage={`No ${filter} tasks`}
        viewAllHref="/portal/tasks"
        maxItems={10}
      />
    </div>
  )
}
