import {
  civilStatusEnum,
  educationLevelEnum,
  genderEnum,
  housingStatusEnum,
  relationshipEnum,
} from "@/lib/db/schema";

export type CivilStatus = (typeof civilStatusEnum.enumValues)[number];
export type EducationLevel = (typeof educationLevelEnum.enumValues)[number];
export type Gender = (typeof genderEnum.enumValues)[number];
export type Relationship = (typeof relationshipEnum.enumValues)[number];
export type HousingStatus = (typeof housingStatusEnum.enumValues)[number];
