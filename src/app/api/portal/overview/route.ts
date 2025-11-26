/**
 * Portal Overview API
 * Returns dashboard overview statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSessionOrBypass } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getSessionOrBypass()
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = (session.user as any).id
        const tenantId = (session.user as any).tenantId

        // Calculate date ranges
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        // Fetch stats in parallel
        const [
            // Tasks
            totalTasks,
            pendingTasks,
            lastMonthTasks,

            // Bookings
            upcomingBookings,
            thisWeekBookings,
            lastMonthBookings,

            // Invoices
            outstandingInvoices,
            overdueInvoices,
            totalInvoices,

            // Compliance
            pendingCompliance,
            dueSoonCompliance,
            lastMonthCompliance,
        ] = await Promise.all([
            // Tasks
            prisma.task.count({ where: { tenantId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
            prisma.task.count({ where: { tenantId, status: 'OPEN' } }),
            prisma.task.count({ where: { tenantId, createdAt: { gte: lastMonth } } }),

            // Bookings
            prisma.booking.count({
                where: { tenantId, scheduledAt: { gte: now }, status: 'CONFIRMED' }
            }),
            prisma.booking.count({
                where: {
                    tenantId,
                    scheduledAt: { gte: now, lte: nextWeek },
                    status: 'CONFIRMED'
                }
            }),
            prisma.booking.count({ where: { tenantId, createdAt: { gte: lastMonth } } }),

            //Invoices - outstanding (UNPAID), note: assuming VOID is similar to overdue
            prisma.invoice.count({ where: { tenantId, status: 'UNPAID' } }),
            prisma.invoice.count({ where: { tenantId, status: 'VOID' } }), // Using VOID as overdue equivalent
            prisma.invoice.count({ where: { tenantId } }),

            // Compliance - query FilingPeriod instead
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'UPCOMING'
                }
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'UPCOMING',
                    dueAt: { gte: now, lte: nextWeek }
                }
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    createdAt: { gte: lastMonth }
                }
            }),
        ])

        // Calculate trends (simple month-over-month comparison)
        const tasksTrend = lastMonthTasks > 0 ? ((totalTasks - lastMonthTasks) / lastMonthTasks) * 100 : 0
        const bookingsTrend = lastMonthBookings > 0 ? ((upcomingBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0
        const complianceTrend = lastMonthCompliance > 0 ? ((pendingCompliance - lastMonthCompliance) / lastMonthCompliance) * 100 : 0

        const stats = {
            tasks: {
                total: totalTasks,
                pending: pendingTasks,
                trend: Number(tasksTrend.toFixed(1)),
            },
            bookings: {
                upcoming: upcomingBookings,
                thisWeek: thisWeekBookings,
                trend: Number(bookingsTrend.toFixed(1)),
            },
            invoices: {
                outstanding: outstandingInvoices,
                overdue: overdueInvoices,
                total: totalInvoices,
            },
            compliance: {
                pending: pendingCompliance,
                due: dueSoonCompliance,
                trend: Number(complianceTrend.toFixed(1)),
            },
        }

        return NextResponse.json({
            success: true,
            data: stats,
        })
    } catch (error) {
        console.error('Portal overview API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch overview data'
            },
            { status: 500 }
        )
    }
}
