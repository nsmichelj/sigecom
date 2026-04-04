import {
  CivilStatus,
  EducationLevel,
  Gender,
  HousingStatus,
  Relationship,
} from "./types";

export const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: "spouse", label: "Cónyuge" },
  { value: "child", label: "Hijo/a" },
  { value: "parent", label: "Padre/Madre" },
  { value: "sibling", label: "Hermano/a" },
  { value: "other", label: "Otro" },
];

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
];

export const educationLevelOptions: { value: EducationLevel; label: string }[] =
  [
    { value: "none", label: "Sin Instrucción" },
    { value: "primary", label: "Primaria" },
    { value: "secondary", label: "Secundaria" },
    { value: "technical", label: "Técnica" },
    { value: "university", label: "Universitaria" },
    { value: "postgraduate", label: "Postgrado" },
  ];

export const civilStatusOptions: { value: CivilStatus; label: string }[] = [
  { value: "single", label: "Soltero/a" },
  { value: "married", label: "Casado/a" },
  { value: "divorced", label: "Divorciado/a" },
  { value: "widowed", label: "Viudo/a" },
];

export const housingStatusOptions: Record<HousingStatus, string> = {
  owned: "Propia",
  rented: "Alquilada",
  shared: "Arrimado / Compartida",
  custody: "Al cuidado / Comodato",
};
