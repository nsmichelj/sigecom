"use client";

import { addFamilyMemberAction } from "@/actions/family";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ResidentFormFields, useResidentForm } from "./resident-form-fields";

export function AddMemberDialog({
  familyId,
  open,
  onOpenChange,
}: {
  familyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addFamilyMemberAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Miembro agregado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["families"] });
        onOpenChange(false);
      } else {
        toast.error(res.error || "Ocurrió un error al agregar miembro");
      }
    },
    onError: (err: any) => toast.error(err.message),
  });

  const form = useResidentForm({
    initialData: {
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
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync({
        familyId,
        member: values,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Miembro a Familia</DialogTitle>
          <DialogDescription>
            Rellene los datos de la nueva persona. Si la cédula ya está
            registrada y no pertenece a otra familia, sus datos se cargarán
            automáticamente.
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
          <ResidentFormFields form={form} />

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
                    "Añadir Miembro"
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
