import { NextRequest } from "next/server";
import { withTenantContext } from "@/lib/api-wrapper";
import { requireTenantContext } from "@/lib/tenant-utils";
import { respond } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { entityAccessService } from "@/services/entities/entity-access.service";

/**
 * GET /api/portal/businesses
 * Fetch businesses that the authenticated user has access to
 */
export const GET = withTenantContext(
  async (request: NextRequest, { params }: any) => {
    try {
      const { userId, tenantId } = requireTenantContext();

      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const country = searchParams.get("country");

      // Get all entities the user has access to
      const userEntities = await entityAccessService.getUserEntities(
        userId as string,
        tenantId as string
      );

      // Extract entity IDs and create role map
      const entityIds = userEntities.map((ue) => ue.entityId);
      const roleMap = new Map(userEntities.map((ue) => [ue.entityId, ue.role]));

      // Build query filter
      const where: any = {
        id: { in: entityIds },
        tenantId: tenantId as string,
      };

      if (status) {
        where.status = status;
      }

      if (country) {
        where.country = country;
      }

      // Fetch entities with details
      const entities = await prisma.entity.findMany({
        where,
        include: {
          licenses: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          registrations: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Format response
      const businesses = entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        country: entity.country,
        legalForm: entity.legalForm,
        status: entity.status,
        createdAt: entity.createdAt,
        userRole: roleMap.get(entity.id) || "MEMBER",
        licensesCount: entity.licenses.length,
        registrationsCount: entity.registrations.length,
      }));

      return respond.ok({
        businesses,
        total: businesses.length,
      });
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return respond.serverError();
    }
  },
  { requireAuth: true }
);
