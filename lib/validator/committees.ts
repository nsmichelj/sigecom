import { z } from "zod";
import { committeeRoleEnum } from "../db/schema";

export const committeeFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export const memberAssignmentSchema = z.object({
  committeeId: z.string().min(1, "ID de comité requerido"),
  residentId: z.string().min(1, "Debe seleccionar un habitante"),
  role: z.enum(committeeRoleEnum.enumValues),
});

export type committeeFormSchema = z.infer<typeof committeeFormSchema>;
export type memberAssignmentSchema = z.infer<typeof memberAssignmentSchema>;
