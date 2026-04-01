import z from "zod";

export const sectorFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type sectorFormSchema = z.infer<typeof sectorFormSchema>;
