"use client";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sectorFormSchema } from "@/lib/validator/sector";
import { useForm } from "@tanstack/react-form";

interface SectorFormProps {
  initialData?: Partial<sectorFormSchema>;
  onSubmit?: (values: sectorFormSchema) => Promise<{ success: boolean }>;
  resetAfterSubmit?: boolean;
}

export function SectorForm({
  initialData,
  onSubmit,
  resetAfterSubmit,
}: SectorFormProps) {
  const form = useForm({
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name ?? "",
    } as sectorFormSchema,
    validators: {
      onSubmit: sectorFormSchema,
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
      className="space-y-4"
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Nombre del Sector</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ej. Sector 1"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </div>
          );
        }}
      />

      <div className="flex justify-end gap-2 pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Sector"}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
