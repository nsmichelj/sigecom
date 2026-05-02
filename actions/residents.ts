"use server";

import db from "@/lib/db";
import { residents } from "@/lib/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";

export async function checkResidentCedulaAction(
  cedula: string,
  currentResidentId?: string,
) {
  if (!cedula) return { success: false, error: "Cédula no proporcionada." };

  try {
    const resident = await db.query.residents.findFirst({
      where: eq(residents.cedula, cedula),
      with: {
        familyMemberships: {
          with: {
            family: true,
          },
        },
      },
    });

    if (!resident) {
      return { success: true, status: "not_found" };
    }

    if (currentResidentId && resident.id === currentResidentId) {
      return { success: true, data: resident };
    }

    if (resident.familyMemberships && resident.familyMemberships.length > 0) {
      // The resident is already part of a family
      return {
        success: false,
        error: "El residente ya pertenece a una familia.",
      };
    }

    // Resident exists but is not currently linked to any family
    // We can return the resident data to pre-fill the form
    return {
      success: true,
      data: resident,
    };
  } catch (error) {
    console.error("Error checking resident cedula:", error);
    return { success: false, error: "Error al verificar la cédula." };
  }
}

export async function getResidentsAction() {
  try {
    const data = await db.query.residents.findMany({
      orderBy: [desc(residents.createdAt)],
      with: {
        familyMemberships: {
          with: {
            family: {
              with: {
                house: {
                  with: {
                    sector: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching residents:", error);
    return { success: false, error: "Error al obtener los residentes." };
  }
}

export async function deleteResidentAction(id: string) {
  try {
    const resident = await db.query.residents.findFirst({
      where: eq(residents.id, id),
      with: {
        familyMemberships: true,
      },
    });

    if (!resident) {
      return { success: false, error: "Residente no encontrado." };
    }

    // Check if they are a head of family in any membership
    const isHead = resident.familyMemberships.some((m) => m.isHeadOfFamily);
    if (isHead) {
      return {
        success: false,
        error:
          "No se puede eliminar a un Jefe de Familia directamente. Traspase la responsabilidad primero o elimine la familia por completo.",
      };
    }

    await db.delete(residents).where(eq(residents.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting resident:", error);
    return { success: false, error: "Error al eliminar el residente." };
  }
}

export async function searchResidentsAction(query: string) {
  try {
    const data = await db.query.residents.findMany({
      where: or(
        ilike(residents.firstName, `%${query}%`),
        ilike(residents.lastName, `%${query}%`),
        ilike(residents.cedula, `%${query}%`),
      ),
      orderBy: [desc(residents.createdAt)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error searching residents:", error);
    return { success: false, error: "Error al buscar los residentes." };
  }
}
