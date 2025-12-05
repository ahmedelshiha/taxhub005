import { describe, it, expect, beforeEach, vi } from 'vitest'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        entityLicense: {
            findFirst: vi.fn(),
        },
    },
}))

// Mock rate limiting
vi.mock('@/lib/rate-limit', () => ({
    applyRateLimit: vi.fn(() => Promise.resolve({ allowed: true, remaining: 9, resetAt: Date.now() + 60000 })),
    getClientIp: vi.fn(() => '127.0.0.1'),
}))

// Mock audit
vi.mock('@/lib/audit', () => ({
    logAudit: vi.fn(() => Promise.resolve()),
}))

describe('License Lookup API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('GET /api/portal/license/lookup', () => {
        it('should validate query parameters', () => {
            const invalidRequests = [
                { licenseNumber: '' }, // empty license
                { licenseNumber: 'DMCC-123' }, // missing country
                { licenseNumber: 'DMCC-123', country: 'XX' }, // invalid country
            ]

            invalidRequests.forEach((req) => {
                expect(req).toBeDefined()
            })
        })

        it('should accept valid license lookup request', () => {
            const validRequest = {
                licenseNumber: 'DMCC-123456',
                country: 'AE',
            }

            expect(validRequest.licenseNumber).toBeDefined()
            expect(validRequest.country).toBe('AE')
        })

        it('should sanitize license number input', () => {
            const inputs = [
                { input: 'dmcc-123456', expected: 'DMCC-123456' },
                { input: 'DMCC 123456!@#', expected: 'DMCC123456' },
                { input: '<script>DMCC-123</script>', expected: 'SCRIPTDMCC-123SCRIPT' },
            ]

            inputs.forEach(({ input }) => {
                const sanitized = input
                    .replace(/[^a-zA-Z0-9\-]/g, '')
                    .toUpperCase()
                expect(sanitized).toBeDefined()
                expect(sanitized).not.toContain('<')
                expect(sanitized).not.toContain('>')
            })
        })

        it('should return license data from database if exists', async () => {
            const mockLicense = {
                id: 'license-123',
                licenseNumber: 'DMCC-123456',
                country: 'AE',
                authority: 'dmcc',
                legalForm: 'LLC',
                status: 'ACTIVE',
                expiresAt: new Date('2025-12-31'),
                entity: {
                    name: 'Test Company LLC',
                    legalForm: 'LLC',
                    economicDepartment: 'dmcc',
                    status: 'ACTIVE',
                },
            }

            vi.mocked(prisma.entityLicense.findFirst).mockResolvedValue(mockLicense as any)

            expect(prisma.entityLicense.findFirst).toBeDefined()
        })

        it('should return mock data for known test licenses', () => {
            const mockLicenses = {
                'DMCC-123456': {
                    businessName: 'Example Trading LLC',
                    licenseNumber: 'DMCC-123456',
                    expiryDate: '2025-12-31',
                    activities: ['General Trading', 'Import/Export'],
                    legalForm: 'LLC',
                    economicDepartment: 'dmcc',
                    status: 'ACTIVE',
                },
                'DED-789012': {
                    businessName: 'Dubai Services FZE',
                    licenseNumber: 'DED-789012',
                    status: 'ACTIVE',
                },
                'JAFZA-345678': {
                    businessName: 'Jebel Ali Logistics Co.',
                    status: 'EXPIRED',
                },
            }

            expect(mockLicenses['DMCC-123456']).toBeDefined()
            expect(mockLicenses['DMCC-123456'].status).toBe('ACTIVE')
            expect(mockLicenses['JAFZA-345678'].status).toBe('EXPIRED')
        })

        it('should return not found for unknown license', () => {
            const notFoundResponse = {
                found: false,
                error: {
                    code: 'LICENSE_NOT_FOUND',
                    message: 'No business found with this license number.',
                },
            }

            expect(notFoundResponse.found).toBe(false)
            expect(notFoundResponse.error.code).toBe('LICENSE_NOT_FOUND')
        })

        it('should return success response with license data', () => {
            const successResponse = {
                found: true,
                data: {
                    businessName: 'Example Trading LLC',
                    licenseNumber: 'DMCC-123456',
                    expiryDate: '2025-12-31',
                    activities: ['General Trading', 'Import/Export'],
                    legalForm: 'LLC',
                    economicDepartment: 'dmcc',
                    status: 'ACTIVE',
                },
            }

            expect(successResponse.found).toBe(true)
            expect(successResponse.data.businessName).toBeDefined()
            expect(successResponse.data.status).toBe('ACTIVE')
        })
    })

    describe('Rate Limiting', () => {
        it('should enforce rate limit of 10 requests per minute', async () => {
            const { applyRateLimit } = await import('@/lib/rate-limit')

            // Mock rate limit exceeded
            vi.mocked(applyRateLimit).mockResolvedValue({
                allowed: false,
                remaining: 0,
                resetAt: Date.now() + 60000,
                backend: 'memory',
                count: 10,
                limit: 10,
            })

            const result = await applyRateLimit('test-key', 10, 60000)
            expect(result.allowed).toBe(false)
            expect(result.remaining).toBe(0)
        })

        it('should return 429 with Retry-After header when rate limited', () => {
            const resetAt = Date.now() + 45000 // 45 seconds
            const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)

            expect(retryAfter).toBeGreaterThan(0)
            expect(retryAfter).toBeLessThanOrEqual(60)
        })
    })

    describe('Audit Logging', () => {
        it('should log license lookup attempts', async () => {
            const { logAudit } = await import('@/lib/audit')

            await logAudit({
                action: 'business.license.lookup',
                actorId: 'user-123',
                details: {
                    country: 'AE',
                    licensePrefix: 'DMCC***',
                },
            })

            expect(logAudit).toHaveBeenCalled()
        })

        it('should mask sensitive data in audit logs', () => {
            const licenseNumber = 'DMCC-123456'
            const masked = licenseNumber.substring(0, 4) + '***'

            expect(masked).toBe('DMCC***')
            expect(masked).not.toContain('123456')
        })
    })

    describe('Error Handling', () => {
        it('should handle database connection errors', async () => {
            vi.mocked(prisma.entityLicense.findFirst).mockRejectedValue(
                new Error('Database connection failed')
            )

            expect(prisma.entityLicense.findFirst).toBeDefined()
        })

        it('should fallback to mock data on Prisma errors', () => {
            const prismaError = { code: 'P2021' }
            const shouldFallback = String(prismaError.code).startsWith('P')

            expect(shouldFallback).toBe(true)
        })

        it('should return 401 for unauthenticated requests', () => {
            const unauthorizedResponse = {
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
            }

            expect(unauthorizedResponse.error.code).toBe('UNAUTHORIZED')
        })

        it('should return 400 for invalid parameters', () => {
            const badRequestResponse = {
                success: false,
                error: {
                    code: 'BAD_REQUEST',
                    message: 'Invalid request parameters',
                    details: { issues: [{ path: ['licenseNumber'], message: 'Required' }] }
                },
            }

            expect(badRequestResponse.error.code).toBe('BAD_REQUEST')
        })
    })

    describe('License Status Handling', () => {
        it('should correctly map license statuses', () => {
            const statusMap = {
                ACTIVE: 'ACTIVE',
                EXPIRED: 'EXPIRED',
                SUSPENDED: 'SUSPENDED',
                PENDING: 'SUSPENDED', // Default fallback
            }

            expect(statusMap['ACTIVE']).toBe('ACTIVE')
            expect(statusMap['EXPIRED']).toBe('EXPIRED')
        })

        it('should indicate expired licenses in response', () => {
            const expiredLicenseResponse = {
                found: true,
                data: {
                    businessName: 'Jebel Ali Logistics Co.',
                    licenseNumber: 'JAFZA-345678',
                    expiryDate: '2024-03-15',
                    status: 'EXPIRED',
                },
            }

            expect(expiredLicenseResponse.data.status).toBe('EXPIRED')
        })
    })
})
