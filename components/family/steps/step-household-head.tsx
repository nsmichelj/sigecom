import { checkResidentCedulaAction } from "@/actions/residents";
import { Button } from "@/components/ui/button";
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
import {
  civilStatusEnum,
  educationLevelEnum,
  genderEnum,
  relationshipEnum,
} from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { familyMemberSchema } from "@/lib/validator/family";
import { useForm } from "@tanstack/react-form";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Loader,
  User,
} from "lucide-react";

interface StepHouseholdHeadFormProps {
  initialData?: Partial<familyMemberSchema>;
  onNext?: (values: familyMemberSchema) => void;
  onPrevious?: () => void;
}

export type Relationship = (typeof relationshipEnum.enumValues)[number];
export type Gender = (typeof genderEnum.enumValues)[number];
export type EducationLevel = (typeof educationLevelEnum.enumValues)[number];
export type CivilStatus = (typeof civilStatusEnum.enumValues)[number];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
];

const educationLevelOptions: { value: EducationLevel; label: string }[] = [
  { value: "none", label: "Sin Instrucción" },
  { value: "primary", label: "Primaria" },
  { value: "secondary", label: "Secundaria" },
  { value: "technical", label: "Técnica" },
  { value: "university", label: "Universitaria" },
  { value: "postgraduate", label: "Postgrado" },
];

const civilStatusOptions: { value: CivilStatus; label: string }[] = [
  { value: "single", label: "Soltero/a" },
  { value: "married", label: "Casado/a" },
  { value: "divorced", label: "Divorciado/a" },
  { value: "widowed", label: "Viudo/a" },
];

export function StepHouseholdHead({
  initialData,
  onNext,
  onPrevious,
}: StepHouseholdHeadFormProps) {
  const form = useForm({
    defaultValues: {
      ...initialData,
      relationship: "headOfFamily",
      isHeadOfFamily: true,
    } as familyMemberSchema,
    validators: {
      onSubmit: familyMemberSchema,
    },
    onSubmit: async ({ value }) => {
      onNext?.(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-10"
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-black tracking-tight">
          Jefatura de Hogar
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg font-light">
          Identifique y registre los datos de la persona que representa el
          núcleo familiar.
        </p>
      </div>

      <FieldGroup>
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
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
                      onValueChange={(e) =>
                        field.handleChange(e as CivilStatus)
                      }
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

      <div className="flex justify-between pt-8 border-t border-border/40">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => onPrevious?.()}
        >
          <ChevronLeft />
          Anterior
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Siguiente paso
                  <ChevronRight />
                </>
              )}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
