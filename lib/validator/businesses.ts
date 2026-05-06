import { z } from "zod";
import { businessCategoryEnum } from "../db/schema";

export const businessFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(150, "El nombre debe tener menos de 150 caracteres."),
  slug: z.string(),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .optional()
    .or(z.literal("")),
  category: z.enum(businessCategoryEnum.enumValues),
  ownerId: z.string().min(1, "Debe seleccionar un propietario."),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  schedule: z.string().optional().or(z.literal("")),
  isLegalEntity: z.boolean(),
  rif: z.string().optional().or(z.literal("")),
  isPublished: z.boolean(),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
