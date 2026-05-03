"use server";

import db from "@/lib/db";
import { news } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNewsAction() {
  try {
    const data = await db.query.news.findMany({
      orderBy: [desc(news.createdAt)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { success: false, error: "Error al obtener las noticias." };
  }
}

export async function getPublishedNewsAction() {
  try {
    const data = await db.query.news.findMany({
      where: eq(news.isPublished, true),
      orderBy: [desc(news.publishedAt)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching published news:", error);
    return {
      success: false,
      error: "Error al obtener las noticias publicadas.",
    };
  }
}

export async function getNewsByIdAction(id: string) {
  try {
    const data = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!data) return { success: false, error: "Noticia no encontrada." };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      success: false,
      error: "Error al obtener el detalle de la noticia.",
    };
  }
}

export async function getNewsBySlugAction(slug: string) {
  try {
    const data = await db.query.news.findFirst({
      where: eq(news.slug, slug),
    });

    if (!data) return { success: false, error: "Noticia no encontrada." };

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return {
      success: false,
      error: "Error al obtener el detalle de la noticia.",
    };
  }
}

export async function createNewsAction(values: any) {
  try {
    const slug = slugify(values.title, true);
    const [newNews] = await db
      .insert(news)
      .values({
        title: values.title,
        slug,
        content: values.content,
        excerpt: values.excerpt,
        coverImage: values.coverImage,
        isPublished: values.isPublished ?? false,
        publishedAt: values.isPublished ? new Date() : null,
      })
      .returning();

    revalidatePath("/dashboard/news");
    revalidatePath("/news");
    return { success: true, data: newNews };
  } catch (error) {
    console.error("Error creating news:", error);
    return { success: false, error: "Error al crear la noticia." };
  }
}

export async function updateNewsAction(id: string, values: any) {
  try {
    // Determine if we are publishing for the first time
    const currentNews = await db.query.news.findFirst({
      where: eq(news.id, id),
      columns: { isPublished: true, publishedAt: true, title: true },
    });

    let publishedAt = currentNews?.publishedAt;
    if (values.isPublished && !currentNews?.isPublished) {
      publishedAt = new Date();
    } else if (!values.isPublished) {
      publishedAt = null;
    }

    if (currentNews?.title?.toLowerCase() !== values.title?.toLowerCase()) {
      values.slug = slugify(values.title, true);
    }

    const [updatedNews] = await db
      .update(news)
      .set({
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt,
        coverImage: values.coverImage,
        isPublished: values.isPublished,
        publishedAt: publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(news.id, id))
      .returning();

    revalidatePath("/dashboard/news");
    revalidatePath(`/dashboard/news/${id}`);
    revalidatePath("/news");
    revalidatePath(`/news/${updatedNews.slug}`);

    return { success: true, data: updatedNews };
  } catch (error) {
    console.error("Error updating news:", error);
    return { success: false, error: "Error al actualizar la noticia." };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    const newsItem = await db.query.news.findFirst({
      where: eq(news.id, id),
      columns: { slug: true },
    });

    await db.delete(news).where(eq(news.id, id));

    revalidatePath("/dashboard/news");
    revalidatePath("/news");
    if (newsItem?.slug) {
      revalidatePath(`/news/${newsItem.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting news:", error);
    return { success: false, error: "Error al eliminar la noticia." };
  }
}
