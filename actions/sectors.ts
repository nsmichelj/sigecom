"use server";

import db from "@/lib/db";
import { sectors } from "@/lib/db/schema";
import { sectorFormSchema } from "@/lib/validator/sector";
import { desc, eq } from "drizzle-orm";

export async function getSectorsAction() {
  try {
    const data = await db.query.sectors.findMany({
      orderBy: [desc(sectors.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return { success: false, error: "Error al obtener los sectores." };
  }
}

export async function createSectorAction(formData: sectorFormSchema) {
  try {
    const existingSector = await db.query.sectors.findFirst({
      where: eq(sectors.name, formData.name),
    });
    if (existingSector) {
      return { success: false, error: "El sector ya existe." };
    }

    const [newSector] = await db.insert(sectors).values(formData).returning();
    return { success: true, data: newSector };
  } catch (error) {
    console.error("Error creating sector:", error);
    return { success: false, error: "Error al crear el sector." };
  }
}

export async function updateSectorAction(formData: sectorFormSchema) {
  try {
    if (!formData.id) {
      return { success: false, error: "ID del sector no proporcionado." };
    }

    const existingSector = await db.query.sectors.findFirst({
      where: eq(sectors.id, formData.id),
    });
    if (existingSector) {
      return { success: false, error: "El sector ya existe." };
    }

    const [updated] = await db
      .update(sectors)
      .set(formData)
      .where(eq(sectors.id, formData.id))
      .returning();
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating sector:", error);
    return { success: false, error: "Error al actualizar el sector." };
  }
}

export async function deleteSectorAction(id: string) {
  try {
    await db.delete(sectors).where(eq(sectors.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting sector:", error);
    return { success: false, error: "Error al eliminar el sector." };
  }
}
