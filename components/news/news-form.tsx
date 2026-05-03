"use client";

import { CoverUpload } from "@/components/cover-upload";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NewsFormValues, newsFormSchema } from "@/lib/validator/news";
import { useForm } from "@tanstack/react-form";

interface NewsFormProps {
  initialData?: Partial<NewsFormValues>;
  onSubmit?: (
    values: NewsFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
  resetAfterSubmit?: boolean;
}

export function NewsForm({
  initialData,
  onSubmit,
  resetAfterSubmit,
}: NewsFormProps) {
  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      content: initialData?.content ?? "",
      excerpt: initialData?.excerpt ?? "",
      coverImage: initialData?.coverImage ?? "",
      isPublished: initialData?.isPublished ?? true,
    } as NewsFormValues,
    validators: {
      onChange: newsFormSchema,
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <form.Field
              name="title"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Título de la noticia</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. Jornada de Vacunación Comunitaria"
                  />
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

            <form.Field
              name="excerpt"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Resumen</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Breve resumen de la noticia..."
                    className="h-24 resize-none"
                  />
                </Field>
              )}
            />

            <form.Field
              name="content"
              children={(field) => (
                <Field>
                  <Label htmlFor={field.name}>Contenido Principal</Label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escribe el cuerpo de la noticia aquí..."
                    className="min-h-100 resize-y"
                  />
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />

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
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="p-5 bg-muted/30 border rounded-xl space-y-6">
              <h3 className="font-semibold text-lg border-b pb-2">
                Configuración
              </h3>

              <form.Field
                name="isPublished"
                children={(field) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={field.name}
                        className="text-base font-medium"
                      >
                        Publicar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Hacer visible para todos
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
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-8 border-t border-border/40">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Noticia"}
              </Button>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
