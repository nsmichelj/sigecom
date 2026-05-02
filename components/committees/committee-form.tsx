"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { committeeFormSchema } from "@/lib/validator/committees";
import { useForm } from "@tanstack/react-form";

interface CommitteeFormProps {
  initialData?: Partial<committeeFormSchema>;
  onSubmit?: (
    values: committeeFormSchema,
  ) => Promise<{ success: boolean; error?: string }>;
  resetAfterSubmit?: boolean;
}

export function CommitteeForm({
  initialData,
  onSubmit,
  resetAfterSubmit = false,
}: CommitteeFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      isActive: initialData?.isActive ?? true,
    } as committeeFormSchema,
    validators: {
      onChange: committeeFormSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await onSubmit?.(value);
      if (resetAfterSubmit && result?.success) {
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
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => (
            <Field>
              <Label htmlFor={field.name}>Nombre del Comité</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ej. Comité de Finanzas"
              />
              {field.state.meta.errors && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        />

        <form.Field
          name="description"
          children={(field) => (
            <Field>
              <Label htmlFor={field.name}>Descripción</Label>
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Indique el propósito de este comité..."
              />
              {field.state.meta.errors && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        />

        <form.Field
          name="isActive"
          children={(field) => (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 group transition-colors hover:border-primary/30">
              <div className="space-y-0.5">
                <Label htmlFor={field.name} className="cursor-pointer">
                  Comité Activo
                </Label>
                <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                  Permitir la asignación de miembros y operaciones.
                </p>
              </div>
              <Switch
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
            </div>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Comité"}
              </Button>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
