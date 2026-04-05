import z from "zod";
import { residentFormSchema } from "./resident";

import { housingStatusEnum } from "@/lib/db/schema";

export const residenceFormSchema = z.object({
  id: z.string().optional(),
  number: z.number().min(0, "Número inválido"),
  sectorId: z.string("Sector requerido").min(1, "Sector requerido"),
  sectorName: z.string().optional(),
  housingStatus: z.enum(housingStatusEnum.enumValues, "Seleccione estatus"),
});

export const familyMemberSchema = z.object({
  id: z.string().optional(),
  resident: residentFormSchema,
  relationship: z.string().min(1, "Relación es requerida"),
  isHeadOfFamily: z.boolean(),
});

export const familyFormSchema = z.object({
  residence: residenceFormSchema,
  headOfFamily: familyMemberSchema,
  members: z.array(familyMemberSchema).default([]),
});

export type residenceFormSchema = z.infer<typeof residenceFormSchema>;
export type familyMemberSchema = z.infer<typeof familyMemberSchema>;
export type familyFormSchema = z.infer<typeof familyFormSchema>;

export const familyWizardSchema = z
  .object({
    houseId: z.string("Seleccione una casa").optional(),
    isNewHouse: z.boolean().default(false),
    newHouse: z
      .object({
        number: z.coerce.number().min(1, "Número inválido"),
        sectorId: z.string("Sector requerido"),
      })
      .optional(),
    housingStatus: z.enum(
      ["owned", "rented", "shared", "custody"],
      "Seleccione estatus",
    ),
    headOfFamily: familyMemberSchema,
    members: z.array(familyMemberSchema).default([]),
  })
  .refine(
    (data) => {
      if (data.isNewHouse) {
        return !!data.newHouse?.sectorId && !!data.newHouse?.number;
      } else {
        return !!data.houseId;
      }
    },
    {
      message:
        "Debe seleccionar una casa existente o completar los datos de la nueva casa",
      path: ["houseId"],
    },
  );

export type familyWizardSchemaType = z.infer<typeof familyWizardSchema>;

export const addFamilyMemberActionSchema = z.object({
  familyId: z.string("Familia inválida"),
  member: familyMemberSchema,
});
export type addFamilyMemberActionSchemaType = z.infer<
  typeof addFamilyMemberActionSchema
>;
