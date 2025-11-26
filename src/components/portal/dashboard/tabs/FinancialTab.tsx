/**
 * Financial Tab Component  
 * Financial overview with invoices, expenses, and revenue (~130 lines)
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Receipt, CreditCard, TrendingUp, Plus, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import StatCard from '../cards/StatCard'
import ListCard from '../cards/ListCard'
import ExportButton from '@/components/portal/export/ExportButton'
import HelpTooltip from '@/components/portal/help/HelpTooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Invoice {
    id: string
    number: string
    client?: { name: string }
    amount: number
    status: string
    dueDate: string
}

export default function FinancialTab() {
    const router = useRouter()

    const { data, isLoading, error } = useSWR<{
        success: boolean; data: {
            invoices: Invoice[]
            stats: {
                totalRevenue: number
                outstandingInvoices: number
                overdueInvoices: number
                paidThisMonth: number
                expenses: number
                netIncome: number
                revenueTrend: number
            }
        }
    }>('/api/portal/financial', fetcher)

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load financial data</span>
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

    const stats = data?.data?.stats || {
        totalRevenue: 0,
        outstandingInvoices: 0,
        overdueInvoices: 0,
        paidThisMonth: 0,
        expenses: 0,
        netIncome: 0,
        revenueTrend: 0
    }

    const invoices = data?.data?.invoices || []

    const invoiceListItems = invoices.map(invoice => ({
        id: invoice.id,
        title: `Invoice ${invoice.number}`,
        subtitle: invoice.client?.name || 'No client',
        badge: {
            label: invoice.status === 'OVERDUE' ? 'Overdue' : invoice.status === 'PAID' ? 'Paid' : 'Pending',
            variant: invoice.status === 'OVERDUE'
                ? ('destructive' as const)
                : invoice.status === 'PAID'
                    ? ('default' as const)
                    : ('secondary' as const)
        },
        href: `/portal/invoicing/${invoice.id}`,
        metadata: `$${invoice.amount.toLocaleString()} • Due ${formatDistanceToNow(new Date(invoice.dueDate), { addSuffix: true })}`
    }))

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
                    <HelpTooltip content="Track revenue, expenses, invoices, and overall financial health of your business" />
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton dataType="financial" />
                    <Button onClick={() => router.push('/portal/invoicing/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    color="text-green-600"
                    trend={stats.revenueTrend}
                />
                <StatCard
                    title="Outstanding"
                    value={stats.outstandingInvoices}
                    subtitle="Invoices pending"
                    icon={Receipt}
                    color="text-orange-600"
                />
                <StatCard
                    title="Overdue"
                    value={stats.overdueInvoices}
                    subtitle="Needs follow-up"
                    icon={AlertCircle}
                    color="text-red-600"
                />
                <StatCard
                    title="Net Income"
                    value={formatCurrency(stats.netIncome)}
                    subtitle="After expenses"
                    icon={TrendingUp}
                    color="text-blue-600"
                />
            </div>

            {/* Invoices */}
            <ListCard
                title="Recent Invoices"
                icon={Receipt}
                items={invoiceListItems}
                emptyMessage="No invoices found"
                viewAllHref="/portal/invoicing"
                maxItems={10}
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-2"
                    onClick={() => router.push('/portal/invoicing')}
                >
                    <Receipt className="h-6 w-6 text-blue-600" />
                    <span>Manage Invoices</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-2"
                    onClick={() => router.push('/portal/expenses')}
                >
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <span>Track Expenses</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-2"
                    onClick={() => router.push('/portal/analytics')}
                >
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <span>View Reports</span>
                </Button>
            </div>
        </div>
    )
}
