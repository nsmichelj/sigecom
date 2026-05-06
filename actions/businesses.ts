"use server";

import db from "@/lib/db";
import { businesses } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBusinessesAction() {
  try {
    const data = await db.query.businesses.findMany({
      orderBy: [desc(businesses.createdAt)],
      with: {
        owner: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return { success: false, error: "Error al obtener los emprendimientos." };
  }
}

export async function getPublishedBusinessesAction() {
  try {
    const data = await db.query.businesses.findMany({
      where: eq(businesses.isPublished, true),
      orderBy: [desc(businesses.createdAt)],
      with: {
        owner: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching published businesses:", error);
    return {
      success: false,
      error: "Error al obtener los emprendimientos publicados.",
    };
  }
}

export async function getBusinessByIdAction(id: string) {
  try {
    const data = await db.query.businesses.findFirst({
      where: eq(businesses.id, id),
      with: {
        owner: true,
      },
    });

    if (!data)
      return { success: false, error: "Emprendimiento no encontrado." };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching business:", error);
    return {
      success: false,
      error: "Error al obtener el detalle del emprendimiento.",
    };
  }
}

export async function getBusinessBySlugAction(slug: string) {
  try {
    const data = await db.query.businesses.findFirst({
      where: eq(businesses.slug, slug),
      with: {
        owner: true,
      },
    });

    if (!data)
      return { success: false, error: "Emprendimiento no encontrado." };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching business by slug:", error);
    return {
      success: false,
      error: "Error al obtener el detalle del emprendimiento.",
    };
  }
}

export async function createBusinessAction(values: any) {
  try {
    const slug = slugify(values.name, true);
    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name: values.name,
        slug,
        description: values.description,
        category: values.category,
        ownerId: values.ownerId || null,
        phone: values.phone,
        email: values.email,
        address: values.address,
        coverImage: values.coverImage,
        schedule: values.schedule,
        isLegalEntity: values.isLegalEntity ?? false,
        rif: values.isLegalEntity ? values.rif : null,
        isPublished: values.isPublished ?? false,
      })
      .returning();

    revalidatePath("/dashboard/businesses");
    revalidatePath("/businesses");
    return { success: true, data: newBusiness };
  } catch (error) {
    console.error("Error creating business:", error);
    return { success: false, error: "Error al crear el emprendimiento." };
  }
}

export async function updateBusinessAction(id: string, values: any) {
  try {
    const currentBusiness = await db.query.businesses.findFirst({
      where: eq(businesses.id, id),
      columns: { name: true },
    });

    let slug = undefined;
    if (
      currentBusiness?.name?.toLowerCase() !== values.name?.toLowerCase()
    ) {
      slug = slugify(values.name, true);
    }

    const [updatedBusiness] = await db
      .update(businesses)
      .set({
        name: values.name,
        ...(slug && { slug }),
        description: values.description,
        category: values.category,
        ownerId: values.ownerId || null,
        phone: values.phone,
        email: values.email,
        address: values.address,
        coverImage: values.coverImage,
        schedule: values.schedule,
        isLegalEntity: values.isLegalEntity ?? false,
        rif: values.isLegalEntity ? values.rif : null,
        isPublished: values.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, id))
      .returning();

    revalidatePath("/dashboard/businesses");
    revalidatePath(`/dashboard/businesses/${id}`);
    revalidatePath("/businesses");
    revalidatePath(`/businesses/${updatedBusiness.slug}`);

    return { success: true, data: updatedBusiness };
  } catch (error) {
    console.error("Error updating business:", error);
    return {
      success: false,
      error: "Error al actualizar el emprendimiento.",
    };
  }
}

export async function deleteBusinessAction(id: string) {
  try {
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.id, id),
      columns: { slug: true },
    });

    await db.delete(businesses).where(eq(businesses.id, id));

    revalidatePath("/dashboard/businesses");
    revalidatePath("/businesses");
    if (business?.slug) {
      revalidatePath(`/businesses/${business.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    return {
      success: false,
      error: "Error al eliminar el emprendimiento.",
    };
  }
}
