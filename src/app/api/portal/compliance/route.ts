/**
 * Portal Compliance API
 * Returns compliance obligations and statistics for ComplianceTab
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

        const now = new Date()
        const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        // Fetch compliance items (FilingPeriods) and stats
        const [items, totalCount, upcomingCount, dueSoonCount, missedCount, completedCount] = await Promise.all([
            prisma.filingPeriod.findMany({
                where: {
                    obligation: { entity: { tenantId } },
                    OR: [
                        { status: 'MISSED' },
                        {
                            status: 'UPCOMING',
                            dueAt: { lte: next30Days },
                        },
                    ],
                },
                take: 20,
                orderBy: [
                    { dueAt: 'asc' },
                ],
                include: {
                    obligation: {
                        include: {
                            entity: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.filingPeriod.count({
                where: { obligation: { entity: { tenantId } } },
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'UPCOMING',
                },
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'UPCOMING',
                    dueAt: {
                        gte: now,
                        lte: next30Days,
                    },
                },
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'MISSED',
                },
            }),
            prisma.filingPeriod.count({
                where: {
                    obligation: { entity: { tenantId } },
                    status: 'FILED',
                },
            }),
        ])

        // Transform items to match expected format
        const transformedItems = items.map(item => ({
            id: item.id,
            title: `${item.obligation.type} - ${item.obligation.country}`,
            type: item.obligation.type,
            dueDate: item.dueAt.toISOString(),
            status: item.status === 'MISSED' ? 'OVERDUE' : 'PENDING',
            entity: item.obligation.entity,
            filingPeriod: {
                startDate: item.periodStart.toISOString(),
                endDate: item.periodEnd.toISOString(),
            },
        }))

        return NextResponse.json({
            success: true,
            data: {
                items: transformedItems,
                stats: {
                    total: totalCount,
                    pending: upcomingCount,
                    dueSoon: dueSoonCount,
                    overdue: missedCount,
                    completed: completedCount,
                },
            },
        })
    } catch (error) {
        console.error('Portal compliance API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch compliance data',
                data: {
                    items: [],
                    stats: {
                        total: 0,
                        pending: 0,
                        dueSoon: 0,
                        overdue: 0,
                        completed: 0,
                    },
                },
            },
            { status: 500 }
        )
    }
}
