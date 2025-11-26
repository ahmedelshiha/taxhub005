/**
 * Portal Entities API
 * Returns list of entities accessible to the current user
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

        // Fetch entities for this tenant
        const entities = await prisma.entity.findMany({
            where: {
                tenantId,
                // Only show active entities
                OR: [
                    { status: 'ACTIVE' },
                    { status: 'VERIFIED' },
                ],
            },
            select: {
                id: true,
                name: true,
                status: true,
                taxId: true,
                country: true,
            },
            orderBy: {
                name: 'asc',
            },
        })

        return NextResponse.json({
            success: true,
            data: {
                entities,
                total: entities.length,
            },
        })
    } catch (error) {
        console.error('Portal entities API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch entities',
                data: {
                    entities: [],
                    total: 0,
                },
            },
            { status: 500 }
        )
    }
}
