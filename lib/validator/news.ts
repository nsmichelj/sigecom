import { z } from "zod";

export const newsFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(100, "El título debe tener menos de 100 caracteres."),
  slug: z.string(),
  content: z
    .string()
    .min(10, "El contenido debe tener al menos 10 caracteres."),
  excerpt: z
    .string()
    .min(10, "El extracto debe tener al menos 10 caracteres.")
    .max(200, "El extracto debe tener menos de 200 caracteres."),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;
