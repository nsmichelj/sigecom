"use server";

import db from "@/lib/db";
import { committeeMembers, committees, residents } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCommitteesAction() {
  try {
    const data = await db.query.committees.findMany({
      orderBy: [desc(committees.createdAt)],
      with: {
        members: {
          with: {
            resident: true,
          },
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching committees:", error);
    return { success: false, error: "Error al obtener los comités." };
  }
}

export async function getCommitteeByIdAction(id: string) {
  try {
    const data = await db.query.committees.findFirst({
      where: eq(committees.id, id),
      with: {
        members: {
          with: {
            resident: true,
          },
          orderBy: [desc(committeeMembers.joinedAt)],
        },
      },
    });

    if (!data) return { success: false, error: "Comité no encontrado." };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching committee:", error);
    return {
      success: false,
      error: "Error al obtener el detalle del comité.",
    };
  }
}

export async function createCommitteeAction(values: any) {
  try {
    const [newCommittee] = await db
      .insert(committees)
      .values({
        name: values.name,
        description: values.description,
        isActive: values.isActive ?? true,
      })
      .returning();

    revalidatePath("/dashboard/committees");
    return { success: true, data: newCommittee };
  } catch (error) {
    console.error("Error creating committee:", error);
    return { success: false, error: "Error al crear el comité." };
  }
}

export async function updateCommitteeAction(id: string, values: any) {
  try {
    const [updatedCommittee] = await db
      .update(committees)
      .set({
        name: values.name,
        description: values.description,
        isActive: values.isActive,
      })
      .where(eq(committees.id, id))
      .returning();

    revalidatePath("/dashboard/committees");
    revalidatePath(`/dashboard/committees/${id}`);
    return { success: true, data: updatedCommittee };
  } catch (error) {
    console.error("Error updating committee:", error);
    return { success: false, error: "Error al actualizar el comité." };
  }
}

export async function deleteCommitteeAction(id: string) {
  try {
    await db.delete(committees).where(eq(committees.id, id));
    revalidatePath("/dashboard/committees");
    return { success: true };
  } catch (error) {
    console.error("Error deleting committee:", error);
    return { success: false, error: "Error al eliminar el comité." };
  }
}

export async function assignMemberAction(values: {
  committeeId: string;
  residentId: string;
  role: "main" | "substitute";
}) {
  try {
    // Check if resident is already in the committee
    const existingMember = await db.query.committeeMembers.findFirst({
      where: and(
        eq(committeeMembers.committeeId, values.committeeId),
        eq(committeeMembers.residentId, values.residentId)
      ),
    });

    if (existingMember) {
      return { success: false, error: "El habitante ya es miembro de este comité." };
    }

    // Constraint check: Only one "main" member
    if (values.role === "main") {
      const mainMember = await db.query.committeeMembers.findFirst({
        where: and(
          eq(committeeMembers.committeeId, values.committeeId),
          eq(committeeMembers.role, "main")
        ),
      });

      if (mainMember) {
        return {
          success: false,
          error: "Este comité ya tiene un miembro principal asignado.",
        };
      }
    }

    const [newMember] = await db
      .insert(committeeMembers)
      .values({
        committeeId: values.committeeId,
        residentId: values.residentId,
        role: values.role,
      })
      .returning();

    revalidatePath(`/dashboard/committees/${values.committeeId}`);
    return { success: true, data: newMember };
  } catch (error) {
    console.error("Error assigning member:", error);
    return { success: false, error: "Error al asignar el miembro." };
  }
}

export async function updateMemberRoleAction(
  memberId: string,
  newRole: "main" | "substitute"
) {
  try {
    const member = await db.query.committeeMembers.findFirst({
      where: eq(committeeMembers.id, memberId),
    });

    if (!member) return { success: false, error: "Miembro no encontrado." };

    // If changing to "main", check if another main exists
    if (newRole === "main" && member.role !== "main") {
      const mainMember = await db.query.committeeMembers.findFirst({
        where: and(
          eq(committeeMembers.committeeId, member.committeeId),
          eq(committeeMembers.role, "main")
        ),
      });

      if (mainMember) {
        return {
          success: false,
          error: "Este comité ya tiene un miembro principal asignado.",
        };
      }
    }

    const [updatedMember] = await db
      .update(committeeMembers)
      .set({ role: newRole })
      .where(eq(committeeMembers.id, memberId))
      .returning();

    revalidatePath(`/dashboard/committees/${member.committeeId}`);
    return { success: true, data: updatedMember };
  } catch (error) {
    console.error("Error updating member role:", error);
    return { success: false, error: "Error al actualizar el rol del miembro." };
  }
}

export async function removeMemberAction(memberId: string) {
  try {
    const [deletedMember] = await db
      .delete(committeeMembers)
      .where(eq(committeeMembers.id, memberId))
      .returning();

    if (deletedMember) {
      revalidatePath(`/dashboard/committees/${deletedMember.committeeId}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return { success: false, error: "Error al eliminar el miembro." };
  }
}
