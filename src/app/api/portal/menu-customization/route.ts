/**
 * Portal Menu Customization API Route
 * 
 * GET - Fetch user's menu customization
 * PUT - Save menu customization
 * DELETE - Reset to defaults
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSessionOrBypass } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const menuSectionSchema = z.object({
    id: z.string(),
    label: z.string(),
    visible: z.boolean(),
    order: z.number(),
})

const bookmarkSchema = z.object({
    id: z.string(),
    label: z.string(),
    href: z.string(),
    order: z.number(),
})

const practiceItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    url: z.string().url(),
    order: z.number(),
})

const customizationSchema = z.object({
    sections: z.array(menuSectionSchema),
    bookmarks: z.array(bookmarkSchema),
    practiceItems: z.array(practiceItemSchema),
})

// Default configuration
const DEFAULT_CUSTOMIZATION = {
    sections: [
        { id: 'overview', label: 'Overview', visible: true, order: 0 },
        { id: 'compliance', label: 'Compliance', visible: true, order: 1 },
        { id: 'financials', label: 'Financials', visible: true, order: 2 },
        { id: 'operations', label: 'Operations', visible: true, order: 3 },
        { id: 'support', label: 'Support', visible: true, order: 4 },
    ],
    bookmarks: [],
    practiceItems: [],
}

/**
 * GET /api/portal/menu-customization
 * Fetch user's menu customization
 */
export async function GET() {
    try {
        const session = await getSessionOrBypass()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = (session.user as any).id

        const record = await prisma.menuCustomization.findUnique({
            where: { userId },
        })

        if (!record) {
            return NextResponse.json({
                success: true,
                data: DEFAULT_CUSTOMIZATION,
            })
        }

        // Build customization from DB fields
        const sectionOrder = Array.isArray(record.sectionOrder) ? record.sectionOrder : []
        const hiddenItems = Array.isArray(record.hiddenItems) ? record.hiddenItems : []

        // Reconstruct sections from sectionOrder and hiddenItems
        const sections = DEFAULT_CUSTOMIZATION.sections.map((defaultSection, index) => {
            const orderIndex = sectionOrder.findIndex((id: any) => id === defaultSection.id)
            return {
                ...defaultSection,
                order: orderIndex >= 0 ? orderIndex : index,
                visible: !hiddenItems.includes(defaultSection.id as never),
            }
        }).sort((a, b) => a.order - b.order)

        const customization = {
            sections,
            bookmarks: Array.isArray(record.bookmarks) ? record.bookmarks : [],
            practiceItems: Array.isArray(record.practiceItems) ? record.practiceItems : [],
        }

        return NextResponse.json({
            success: true,
            data: customization,
        })
    } catch (error) {
        console.error('Error fetching portal menu customization:', error)
        return NextResponse.json(
            { error: 'Failed to fetch menu customization' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/portal/menu-customization
 * Save menu customization
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getSessionOrBypass()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = (session.user as any).id
        const body = await request.json()

        // Validate input
        const validation = customizationSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid customization data', details: validation.error.issues },
                { status: 400 }
            )
        }

        const { sections, bookmarks, practiceItems } = validation.data

        // Extract sectionOrder and hiddenItems from sections array
        const sectionOrder = sections.sort((a, b) => a.order - b.order).map(s => s.id)
        const hiddenItems = sections.filter(s => !s.visible).map(s => s.id)

        // Upsert customization
        await prisma.menuCustomization.upsert({
            where: { userId },
            update: {
                sectionOrder,
                hiddenItems,
                bookmarks,
                practiceItems,
                updatedAt: new Date(),
            },
            create: {
                userId,
                sectionOrder,
                hiddenItems,
                bookmarks,
                practiceItems,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Menu customization saved',
        })
    } catch (error) {
        console.error('Error saving portal menu customization:', error)
        return NextResponse.json(
            { error: 'Failed to save menu customization' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/portal/menu-customization
 * Reset to defaults
 */
export async function DELETE() {
    try {
        const session = await getSessionOrBypass()
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = (session.user as any).id

        await prisma.menuCustomization.deleteMany({
            where: { userId },
        })

        return NextResponse.json({
            success: true,
            message: 'Menu customization reset to defaults',
        })
    } catch (error) {
        console.error('Error resetting portal menu customization:', error)
        return NextResponse.json(
            { error: 'Failed to reset menu customization' },
            { status: 500 }
        )
    }
}
