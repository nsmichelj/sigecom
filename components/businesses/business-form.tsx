"use client";

import { CoverUpload } from "@/components/cover-upload";
import { ResidentSelector } from "@/components/committees/resident-selector";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { businessCategoryEnum } from "@/lib/db/schema";
import {
  BusinessFormValues,
  businessFormSchema,
} from "@/lib/validator/businesses";
import { useForm } from "@tanstack/react-form";

const categoryLabels: Record<string, string> = {
  food: "Alimentos y Bebidas",
  services: "Servicios Generales",
  commerce: "Comercio y Ventas",
  crafts: "Artesanía y Manualidades",
  health: "Salud y Bienestar",
  education: "Educación y Formación",
  technology: "Tecnología",
  beauty: "Belleza y Cuidado Personal",
  other: "Otro",
};

interface BusinessFormProps {
  initialData?: Partial<BusinessFormValues>;
  onSubmit?: (
    values: BusinessFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
  resetAfterSubmit?: boolean;
}

export function BusinessForm({
  initialData,
  onSubmit,
  resetAfterSubmit,
}: BusinessFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "other",
      ownerId: initialData?.ownerId ?? "",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
      address: initialData?.address ?? "",
      coverImage: initialData?.coverImage ?? "",
      schedule: initialData?.schedule ?? "",
      isLegalEntity: initialData?.isLegalEntity ?? false,
      rif: initialData?.rif ?? "",
      isPublished: initialData?.isPublished ?? true,
    } as BusinessFormValues,
    validators: {
      onChange: businessFormSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await onSubmit?.(value);
      if (result?.success && resetAfterSubmit) {
        form.reset();
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Información General</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="name"
                children={(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Nombre del emprendimiento</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej. Panadería La Esquina"
                    />
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />

              <form.Field
                name="category"
                children={(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Categoría</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as (typeof businessCategoryEnum.enumValues)[number],
                        )
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategoryEnum.enumValues.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {categoryLabels[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />
            </div>

            <form.Field
              name="description"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Descripción</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe el emprendimiento, qué productos o servicios ofrece..."
                    className="min-h-32 resize-y"
                  />
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

            <form.Field
              name="ownerId"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Propietario</Label>
                  <ResidentSelector
                    selectedId={field.state.value}
                    onSelect={(residentId) => field.handleChange(residentId)}
                  />
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Identidad del Negocio</FieldLegend>
          <FieldGroup>
            <form.Field
              name="coverImage"
              children={(field) => (
                <Field>
                  <Label>Imagen de Portada</Label>
                  <CoverUpload
                    initialImage={field.state.value}
                    onFileChange={(url) => field.handleChange(url ?? "")}
                    title="Subir Portada"
                  />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <form.Field
                name="isLegalEntity"
                children={(field) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                    <div className="space-y-0.5">
                      <Label htmlFor={field.name} className="text-base font-medium">
                        Negocio Jurídico
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        ¿Es una entidad jurídica registrada?
                      </p>
                    </div>
                    <Switch
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </Field>
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.isLegalEntity}
                children={(isLegalEntity) =>
                  isLegalEntity ? (
                    <form.Field
                      name="rif"
                      children={(field) => (
                        <Field>
                          <Label htmlFor={field.name}>RIF</Label>
                          <Input
                            id={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="J-12345678-9"
                          />
                          {field.state.meta.errors && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )}
                    />
                  ) : (
                    <div className="hidden md:block"></div>
                  )
                }
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Contacto y Ubicación</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field
                name="phone"
                children={(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Teléfono</Label>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0412-1234567"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="email"
                children={(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Correo electrónico</Label>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="contacto@ejemplo.com"
                    />
                  </Field>
                )}
              />
            </div>

            <form.Field
              name="address"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Dirección o referencia</Label>
                  <Input
                    id={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Calle principal, frente a la plaza..."
                  />
                </Field>
              )}
            />

            <form.Field
              name="schedule"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Horario de atención</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Lunes a Viernes: 8:00 AM - 5:00 PM&#10;Sábados: 8:00 AM - 12:00 PM"
                    className="h-24 resize-none"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <div className="pt-4">
          <form.Field
            name="isPublished"
            children={(field) => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                <div className="space-y-0.5">
                  <Label htmlFor={field.name} className="text-base font-medium">
                    Publicar Emprendimiento
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Hacer visible este emprendimiento para toda la comunidad
                  </p>
                </div>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-8 border-t border-border/40">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" size="lg" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Emprendimiento"}
              </Button>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
