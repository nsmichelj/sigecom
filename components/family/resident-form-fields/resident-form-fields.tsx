"use client";

import { checkResidentCedulaAction } from "@/actions/residents";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { familyMemberSchema } from "@/lib/validator/family";
import { useForm } from "@tanstack/react-form";
import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Loader,
  User,
} from "lucide-react";
import {
  civilStatusOptions,
  educationLevelOptions,
  genderOptions,
  relationshipOptions,
} from "./const";
import { CivilStatus, EducationLevel, Gender } from "./types";

interface UseResidentFormOptions {
  initialData?: familyMemberSchema;
  onSubmit?: (values: familyMemberSchema) => Promise<void>;
}

export function useResidentForm(opts?: UseResidentFormOptions) {
  return useForm({
    defaultValues:
      opts?.initialData ??
      ({
        resident: {
          firstName: "",
          lastName: "",
          cedula: "",
          dateOfBirth: new Date(),
          gender: "male",
          educationLevel: "none",
          civilStatus: "single",
          isWorking: false,
          occupation: "",
          serialCarnet: "",
          codeCarnet: "",
          email: "",
          phone: "",
          hasDisability: false,
          isPregnant: false,
          isStudying: false,
        },
        relationship: "",
        isHeadOfFamily: false,
      } as familyMemberSchema),
    validators: {
      onSubmit: familyMemberSchema,
    },
    onSubmit: async ({ value }) => {
      await opts?.onSubmit?.(value);
    },
  });
}

export type ResidentForm = ReturnType<typeof useResidentForm>;

interface ResidentFormFieldsProps {
  form: ResidentForm;
  isHeadOfFamily?: boolean;
}

export function ResidentFormFields({
  form,
  isHeadOfFamily = false,
}: ResidentFormFieldsProps) {
  return (
    <FieldGroup>
      {!isHeadOfFamily && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <form.Field name="relationship">
            {(field) => (
              <Field>
                <Label>Parentesco con el jefe de hogar</Label>
                <Select
                  value={field.state.value || ""}
                  onValueChange={(e) => field.handleChange(e as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {relationshipOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </div>
      )}

      <FieldSet>
        <FieldLegend>Identidad</FieldLegend>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form.Field name="resident.firstName">
              {(field) => (
                <Field>
                  <Label>Nombres</Label>
                  <Input
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.lastName">
              {(field: any) => (
                <Field>
                  <Label>Apellidos</Label>
                  <Input
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="resident.cedula"
              asyncDebounceMs={500}
              validators={{
                onChangeAsync: async ({ value }) => {
                  if (!value || value.length < 5) return undefined;
                  const { error, data } =
                    await checkResidentCedulaAction(value);
                  return error ? { message: error } : undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <Label>Documento de Identidad (Cédula)</Label>
                  <InputGroup>
                    <InputGroupInput
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="V12345678"
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                    />
                    {field.state.meta.isValidating && (
                      <InputGroupAddon align="inline-end">
                        <Loader className="size-5 animate-spin text-primary" />
                      </InputGroupAddon>
                    )}
                  </InputGroup>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.dateOfBirth">
              {(field) => {
                const val = field.state.value;
                let strVal = "";
                if (val instanceof Date && !isNaN(val.getTime())) {
                  strVal = val.toISOString().split("T")[0];
                } else if (typeof val === "string") {
                  strVal = val;
                }
                return (
                  <Field>
                    <Label>Fecha de Nacimiento</Label>
                    <Input
                      type="date"
                      value={strVal}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(new Date(e.target.value))
                      }
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="resident.codeCarnet"
              asyncDebounceMs={500}
              validators={
                {
                  // onChangeAsync: async ({ value }) => {
                  //   // if (!value || value.length < 5) return undefined;
                  //   // const { error, data } =
                  //   //   await checkResidentCarnetAction(value);
                  //   // return error ? { message: error } : undefined;
                  // },
                }
              }
            >
              {(field) => (
                <Field>
                  <Label>Código del Carnet de la Patria</Label>
                  <InputGroup>
                    <InputGroupInput
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                    />
                    {field.state.meta.isValidating && (
                      <InputGroupAddon align="inline-end">
                        <Loader className="size-5 animate-spin text-primary" />
                      </InputGroupAddon>
                    )}
                  </InputGroup>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="resident.serialCarnet"
              asyncDebounceMs={500}
              validators={
                {
                  // onChangeAsync: async ({ value }) => {
                  //   // if (!value || value.length < 5) return undefined;
                  //   // const { error, data } =
                  //   //   await checkResidentCarnetAction(value);
                  //   // return error ? { message: error } : undefined;
                  // },
                }
              }
            >
              {(field) => (
                <Field>
                  <Label>Serial del Carnet de la Patria</Label>
                  <InputGroup>
                    <InputGroupInput
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                    />
                    {field.state.meta.isValidating && (
                      <InputGroupAddon align="inline-end">
                        <Loader className="size-5 animate-spin text-primary" />
                      </InputGroupAddon>
                    )}
                  </InputGroup>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Perfil Demográfico</FieldLegend>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form.Field name="resident.gender">
              {(field) => (
                <Field>
                  <Label>Género</Label>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(e) => field.handleChange(e as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {genderOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.civilStatus">
              {(field) => (
                <Field>
                  <Label>Estado Civil</Label>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(e) => field.handleChange(e as CivilStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {civilStatusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.educationLevel">
              {(field) => (
                <Field>
                  <Label>Nivel de Instrucción</Label>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(e) =>
                      field.handleChange(e as EducationLevel)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su educación..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {educationLevelOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.phone">
              {(field) => (
                <Field>
                  <Label>Teléfono (Opcional)</Label>
                  <Input
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. +58 412 1234567"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="resident.email">
              {(field) => (
                <Field>
                  <Label>Correo (Opcional)</Label>
                  <Input
                    type="email"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                name: "resident.isWorking",
                label: "Trabaja",
                icon: Briefcase,
              },
              {
                name: "resident.isStudying",
                label: "Estudia",
                icon: GraduationCap,
              },
              {
                name: "resident.hasDisability",
                label: "Discapacidad",
                icon: HeartPulse,
              },
              {
                name: "resident.isPregnant",
                label: "Gestante",
                icon: User,
              },
            ].map((prop) => (
              <form.Field name={prop.name as any} key={prop.name}>
                {(field) => {
                  const isChecked = !!field.state.value;
                  const Icon = prop.icon;
                  return (
                    <div
                      onClick={() => field.handleChange(!isChecked)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center gap-2",
                        isChecked
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border/60 bg-background/30 text-muted-foreground hover:bg-background/80 hover:border-border",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-6 transition-transform",
                          isChecked && "scale-110",
                        )}
                      />
                      <span className="text-xs font-semibold tracking-wide uppercase">
                        {prop.label}
                      </span>
                    </div>
                  );
                }}
              </form.Field>
            ))}
          </div>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
