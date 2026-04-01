"use client";

import {
  deleteSectorAction,
  getSectorsAction,
  updateSectorAction,
} from "@/actions/sectors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sectorFormSchema } from "@/lib/validator/sector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectorForm } from "./sector-form";

export function SectorsTable() {
  const queryClient = useQueryClient();
  const [editingSector, setEditingSector] = useState<sectorFormSchema | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const result = await getSectorsAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSectorAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Sector eliminado");
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSectorAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Sector actualizado correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 relative w-full flex justify-center items-center flex-col gap-2">
        <Loader className="size-10 animate-spin text-primary" />
        <span className="text-primary">Cargando sectores...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive p-4">Error al cargar sectores</div>;
  }

  const sectors = data || [];

  const handleEditSubmit = async (values: sectorFormSchema) => {
    const res = await updateMutation.mutateAsync(values);
    if (res.success) {
      setIsEditOpen(false);
      return { success: true };
    } else {
      toast.error(res.error || "Ocurrió un error");
      return { success: false };
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Sector</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No hay sectores registrados.
                </TableCell>
              </TableRow>
            ) : (
              sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell>
                    {sector.createdAt
                      ? new Date(sector.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => {
                          setEditingSector({
                            id: sector.id,
                            name: sector.name,
                          });
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          deleteMutation.mutate(sector.id);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sector</DialogTitle>
            <DialogDescription>
              Completa el formulario para editar el sector.
            </DialogDescription>
          </DialogHeader>
          <SectorForm
            initialData={editingSector || undefined}
            onSubmit={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
