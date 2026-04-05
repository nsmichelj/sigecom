"use server";

import db from "@/lib/db";
import { residents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
