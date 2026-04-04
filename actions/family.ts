"use server";

import db from "@/lib/db";
import { family, familyMembers, houses, residents } from "@/lib/db/schema";
import { familyFormSchema } from "@/lib/validator/family";
import { desc, eq } from "drizzle-orm";

export async function getFamiliesAction() {
  try {
    const data = await db.query.family.findMany({
      orderBy: [desc(family.createdAt)],
      with: {
        house: {
          with: {
            sector: true,
          },
        },
        members: {
          with: {
            resident: true,
          },
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching families:", error);
    return { success: false, error: "Error al obtener las familias." };
  }
}

export async function getHousesOptionAction() {
  try {
    const data = await db.query.houses.findMany({
      with: {
        sector: true,
      },
      orderBy: [desc(houses.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching houses:", error);
    return { success: false, error: "Error al obtener casas." };
  }
}

export async function createFamilyAction(formData: familyFormSchema) {
  try {
    const familyData = await db.transaction(async (tx) => {
      const [house] = await tx
        .insert(houses)
        .values({
          number: formData.residence.number,
          sectorId: formData.residence.sectorId,
        })
        .onConflictDoNothing()
        .returning({
          id: houses.id,
        });

      // 2. Insert Family
      const [newFamily] = await tx
        .insert(family)
        .values({
          houseId: house.id,
          housingStatus: formData.residence.housingStatus,
        })
        .returning();

      // 3. Process Residents: Helper function
      const processResident = async (memberData: any, isHead: boolean) => {
        const rData = memberData.resident;
        let residentId;

        // Verify cedula
        const existingResident = await tx.query.residents.findFirst({
          where: eq(residents.cedula, rData.cedula),
        });

        const residentValues: any = {
          ...rData,
          email: rData.email || "",
        };

        if (existingResident) {
          // Verify if already in family
          const existingMembership = await tx.query.familyMembers.findFirst({
            where: eq(familyMembers.residentId, existingResident.id),
          });
          if (existingMembership) {
            tx.rollback();
            throw new Error(
              `El residente con cédula ${rData.cedula} ya pertenece a una familia.`,
            );
          }
          // Update existing
          await tx
            .update(residents)
            .set(residentValues)
            .where(eq(residents.id, existingResident.id));
          residentId = existingResident.id;
        } else {
          const [inserted] = await tx
            .insert(residents)
            .values(residentValues)
            .returning();
          residentId = inserted.id;
        }

        // Insert membership
        await tx.insert(familyMembers).values({
          familyId: newFamily.id,
          residentId: residentId,
          relationship: memberData.relationship,
          isHeadOfFamily: isHead,
        });
      };

      // 4. Head of Family
      await processResident(formData.headOfFamily, true);

      // 5. Other members
      if (formData.members && formData.members.length > 0) {
        for (const member of formData.members) {
          await processResident(member, false);
        }
      }

      return newFamily;
    });

    return { success: true, data: familyData };
  } catch (error: any) {
    console.error("Error creating family:", error);
    return {
      success: false,
      error: error.message || "Error al crear la familia.",
    };
  }
}

export async function deleteFamilyAction(id: string) {
  try {
    await db.delete(family).where(eq(family.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting family:", error);
    return { success: false, error: "Error al eliminar la familia." };
  }
}

export async function addFamilyMemberAction(
  data: import("@/lib/validator/family").addFamilyMemberActionSchemaType,
) {
  try {
    const memData = await db.transaction(async (tx) => {
      const rData = data.member.resident;
      let residentId;

      // Verify cedula
      const existingResident = await tx.query.residents.findFirst({
        where: eq(residents.cedula, rData.cedula),
      });

      const residentValues: any = {
        ...rData,
        email: rData.email || "",
      };

      if (existingResident) {
        // Verify if already in family
        const existingMembership = await tx.query.familyMembers.findFirst({
          where: eq(familyMembers.residentId, existingResident.id),
        });
        if (existingMembership) {
          tx.rollback();
          throw new Error(
            `El residente con cédula ${rData.cedula} ya pertenece a una familia.`,
          );
        }
        // Update existing
        await tx
          .update(residents)
          .set(residentValues)
          .where(eq(residents.id, existingResident.id));
        residentId = existingResident.id;
      } else {
        const [inserted] = await tx
          .insert(residents)
          .values(residentValues)
          .returning();
        residentId = inserted.id;
      }

      // Insert membership
      const [newMembership] = await tx
        .insert(familyMembers)
        .values({
          familyId: data.familyId,
          residentId: residentId,
          relationship: data.member.relationship,
          isHeadOfFamily: data.member.isHeadOfFamily,
        })
        .returning();

      return newMembership;
    });

    return { success: true, data: memData };
  } catch (error: any) {
    console.error("Error adding family member:", error);
    return {
      success: false,
      error: error.message || "Error al agregar el miembro a la familia.",
    };
  }
}
