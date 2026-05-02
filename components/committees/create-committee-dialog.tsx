"use client";

import { createCommitteeAction } from "@/actions/committees";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { committeeFormSchema } from "@/lib/validator/committees";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CommitteeForm } from "./committee-form";

export function CreateCommitteeDialog() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: committeeFormSchema) => {
      const result = await createCommitteeAction(values);

      if (!result.success) {
        throw new Error(result.error || "Error al procesar el comité");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Comité creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["committees"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = async (values: committeeFormSchema) => {
    await mutation.mutateAsync(values);
    return { success: true };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nuevo Comité
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Nuevo Comité</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo comité en la comunidad.
          </DialogDescription>
        </DialogHeader>

        <CommitteeForm onSubmit={handleFormSubmit} resetAfterSubmit />
      </DialogContent>
    </Dialog>
  );
}
