import z from "zod";
import { civilStatusEnum, educationLevelEnum, genderEnum } from "../db/schema";

export const residentFormSchema = z.object({
  firstName: z.string().min(3, "Nombre inválido, mínimo 3 caracteres"),
  lastName: z.string().min(3, "Apellido inválido, mínimo 3 caracteres"),
  cedula: z.string().regex(/^[0-9]{6,10}$/, "Cédula inválida"),

  dateOfBirth: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Fecha de nacimiento requerida"
        : "Fecha inválida",
  }),
  gender: z.enum(genderEnum.enumValues, "Género es requerido"),
  educationLevel: z.enum(
    educationLevelEnum.enumValues,
    "Nivel de educación es requerido",
  ),
  civilStatus: z.enum(civilStatusEnum.enumValues, "Estado civil es requerido"),
  serialCarnet: z.string().optional(),
  codeCarnet: z.string().optional(),
  isWorking: z.boolean(),
  occupation: z.string().optional(),
  email: z.email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  hasDisability: z.boolean(),
  isPregnant: z.boolean(),
  isStudying: z.boolean(),
});

export type residentFormSchema = z.infer<typeof residentFormSchema>;
