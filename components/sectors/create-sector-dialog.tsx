"use client";

import { createSectorAction } from "@/actions/sectors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sectorFormSchema } from "@/lib/validator/sector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectorForm } from "./sector-form";

export function CreateSectorDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createSectorAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Sector creado correctamente");
    },
    onError: (error) => {
      toast.error("Error al crear el sector: " + error.message);
    },
  });

  const onSubmit = async (values: sectorFormSchema) => {
    const res = await mutateAsync(values);
    if (res.success) {
      setIsOpen(false);
      return { success: true };
    } else {
      toast.error(res.error || "Ocurrió un error");
      return { success: false };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Sector
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Sector</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo sector.
          </DialogDescription>
        </DialogHeader>
        <SectorForm onSubmit={onSubmit} resetAfterSubmit />
      </DialogContent>
    </Dialog>
  );
}
