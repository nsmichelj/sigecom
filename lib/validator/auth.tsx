import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, "El correo electrónico es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type loginFormSchema = z.infer<typeof loginFormSchema>;
