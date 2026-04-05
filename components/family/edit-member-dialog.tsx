"use client";

import { updateFamilyMemberAction } from "@/actions/family";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { familyMemberSchema } from "@/lib/validator/family";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ResidentFormFields,
  useResidentForm,
} from "./resident-form-fields/resident-form-fields";

export function EditMemberDialog({
  initialData,
  open,
  onOpenChange,
}: {
  initialData: familyMemberSchema;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: familyMemberSchema) => {
      return updateFamilyMemberAction(data.resident.id || "", data);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Información actualizada exitosamente");
        // Refetch families or the single family query
        queryClient.invalidateQueries({ queryKey: ["families"] });
        queryClient.invalidateQueries({ queryKey: ["family"] });
        onOpenChange(false);
      } else {
        toast.error(
          res.error || "Ocurrió un error al actualizar la información",
        );
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const form = useResidentForm({
    initialData,
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Miembro de Familia</DialogTitle>
          <DialogDescription>
            Modifique los datos del residente. Tenga en cuenta que el rol de
            "Jefe de familia" no puede ser editado desde aquí.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 pt-4"
        >
          <ResidentFormFields
            form={form}
            isHeadOfFamily={initialData.isHeadOfFamily}
          />

          <div className="flex justify-end pt-8 border-t border-border/40 gap-4 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
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
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
