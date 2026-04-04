"use client";

import { checkResidentCedulaAction } from "@/actions/residents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Loader2,
  Pencil,
  Trash2,
  User,
  UserPlus,
  Users2,
} from "lucide-react";
import { useState } from "react";

interface StepMembersFormProps {
  initialData?: familyMemberSchema[];
  onSubmit?: (values: familyMemberSchema[]) => void;
  onNext?: (values: familyMemberSchema[]) => void;
  onPrevious?: () => void;
}

export type Relationship = (typeof relationshipEnum.enumValues)[number];

const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: "spouse", label: "Cónyuge" },
  { value: "child", label: "Hijo/a" },
  { value: "parent", label: "Padre/Madre" },
  { value: "sibling", label: "Hermano/a" },
  { value: "other", label: "Otro" },
];

export type Gender = (typeof genderEnum.enumValues)[number];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
];

export type EducationLevel = (typeof educationLevelEnum.enumValues)[number];

const educationLevelOptions: { value: EducationLevel; label: string }[] = [
  { value: "none", label: "Sin Instrucción" },
  { value: "primary", label: "Primaria" },
  { value: "secondary", label: "Secundaria" },
  { value: "technical", label: "Técnica" },
  { value: "university", label: "Universitaria" },
  { value: "postgraduate", label: "Postgrado" },
];

export type CivilStatus = (typeof civilStatusEnum.enumValues)[number];

const civilStatusOptions: { value: CivilStatus; label: string }[] = [
  { value: "single", label: "Soltero/a" },
  { value: "married", label: "Casado/a" },
  { value: "divorced", label: "Divorciado/a" },
  { value: "widowed", label: "Viudo/a" },
];

function MemberCard({
  member,
  index,
  onEdit,
  onRemove,
}: {
  member: familyMemberSchema;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  const getRelationshipLabel = (relationship: Relationship) => {
    return relationshipOptions.find((option) => option.value === relationship)
      ?.label;
  };

  return (
    <div className="relative overflow-hidden bg-background/40 hover:bg-background/80 border-2 border-border/50 rounded-2xl p-5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {member.resident.firstName} {member.resident.lastName}
            </h3>
            <Badge
              variant="secondary"
              className="px-3 bg-primary/10 text-primary uppercase font-bold text-[10px] tracking-wider"
            >
              {getRelationshipLabel(member.relationship as Relationship)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <span>C.I: {member.resident.cedula}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="capitalize">
              {
                genderOptions.find((g) => g.value === member.resident.gender)
                  ?.label
              }
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-10 bg-background/50 backdrop-blur"
            onClick={() => onEdit(index)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-10 bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white backdrop-blur"
            onClick={() => onRemove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StepMembersForm({
  initialData,
  onNext,
  onPrevious,
  onSubmit,
}: StepMembersFormProps) {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [members, setMembers] = useState<familyMemberSchema[]>(
    initialData ?? [],
  );

  const form = useForm({
    defaultValues: {
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
    } as familyMemberSchema,
    validators: {
      onSubmit: familyMemberSchema,
    },
    onSubmit: async ({ value }) => {
      let newMembersList = [...members];
      if (editingIndex !== null) {
        newMembersList[editingIndex] = value;
      } else {
        newMembersList = [...members, value];
      }
      setMembers(newMembersList);
      onSubmit?.(newMembersList);
      form.reset();
      setEditingIndex(null);
      setOpen(false);
    },
  });

  console.log(form.getAllErrors());

  return (
    <div className="space-y-10">
      <div className="space-y-2 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Composición Familiar
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg font-light mt-1">
            Integre al grupo familiar registrando a cada persona y su
            parentesco.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border border-border">
          <Users2 className="size-5 text-muted-foreground" />
          <span className="font-bold text-lg">{members.length}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Miembros
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 lg:p-20 border-2 border-dashed border-border/60 rounded-3xl bg-background/20 backdrop-blur-sm text-center">
            <Users2 className="size-16 text-muted-foreground/30 mb-4" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">
              No hay miembros adicionales registrados
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              El jefe de hogar ya está registrado. Añada aquí al resto de los
              integrantes de la familia.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setEditingIndex(null);
                form.reset();
                setOpen(true);
              }}
            >
              <UserPlus className="size-5" />
              Añadir Primer Integrante
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member, index) => (
              <MemberCard
                key={index}
                member={member}
                index={index}
                onEdit={(index) => {
                  form.setFieldValue("resident", member.resident);
                  form.setFieldValue("relationship", member.relationship);
                  form.setFieldValue("isHeadOfFamily", member.isHeadOfFamily);
                  setEditingIndex(index);
                  setOpen(true);
                }}
                onRemove={(index) => {
                  const newMembers = members.filter((_, i) => i !== index);
                  setMembers(newMembers);
                  onSubmit?.(newMembers);
                }}
              />
            ))}

            <Button
              variant="outline"
              onClick={() => {
                setEditingIndex(null);
                form.reset();
                setOpen(true);
              }}
              className="w-full h-16 py-6 border-2 border-dashed border-primary/40 hover:border-primary/80 bg-primary/5 hover:bg-primary/10 rounded-2xl text-primary font-semibold text-base transition-all duration-300"
            >
              <UserPlus className="size-5 mr-3" />
              Ingresar Otro Integrante
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-8 border-t border-border/40 mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPrevious?.()}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <Button onClick={() => onNext?.(members ?? [])}>
          Siguiente paso
          <ChevronRight />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full sm:max-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <div>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingIndex !== null
                ? "Actualizar Datos del Integrante"
                : "Nuevo Integrante"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-base font-light">
              Complete el formulario. Los datos requeridos fortalecerán el
              perfil demográfico.
            </DialogDescription>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                            onValueChange={(e) =>
                              field.handleChange(e as Gender)
                            }
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

            <div className="flex justify-end pt-8 border-t border-border/40 gap-4 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Guardando...
                      </>
                    ) : editingIndex !== null ? (
                      "Actualizar Miembro"
                    ) : (
                      "Añadir Miembro"
                    )}
                  </Button>
                )}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
