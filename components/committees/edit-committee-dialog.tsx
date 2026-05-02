"use client";

import { updateCommitteeAction } from "@/actions/committees";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { committeeFormSchema } from "@/lib/validator/committees";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CommitteeForm } from "./committee-form";

interface EditCommitteeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  committeeData: Partial<committeeFormSchema>;
}

export function EditCommitteeDialog({
  open,
  onOpenChange,
  committeeData,
}: EditCommitteeDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: committeeFormSchema) => {
      const result = await updateCommitteeAction(committeeData.id!, values);

      if (!result.success) {
        throw new Error(result.error || "Error al procesar el comité");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Comité actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["committees"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Editar Comité</DialogTitle>
          <DialogDescription>
            Modifica los detalles del comité seleccionado.
          </DialogDescription>
        </DialogHeader>

        <CommitteeForm
          initialData={committeeData}
          onSubmit={async (values) => {
            await mutation.mutateAsync(values);
            return { success: true };
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
