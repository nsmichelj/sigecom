"use client";

import { deleteFamilyAction, getFamiliesAction } from "@/actions/family";
import { AddMemberDialog } from "@/components/family/add-member-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const housingStatusMap: Record<string, string> = {
  owned: "Propia",
  rented: "Alquilada",
  shared: "Compartida / Arrimados",
  custody: "Al cuidado / Comodato",
};

export function FamiliesTable() {
  const queryClient = useQueryClient();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["families"],
    queryFn: async () => {
      const result = await getFamiliesAction();
      if (!result.success) throw new Error(result.error);
      return result.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFamilyAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Familia eliminada");
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar la familia");
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 relative w-full flex justify-center items-center flex-col gap-2">
        <Loader className="size-10 animate-spin text-primary" />
        <span className="text-primary">Cargando familias...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive p-4">Error al cargar las familias</div>
    );
  }

  const families = data || [];

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jefe de Familia</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Vivienda</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-center">Integrantes</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {families.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No hay familias registradas.
                </TableCell>
              </TableRow>
            ) : (
              families.map((f) => {
                const head = f.members.find((m) => m.isHeadOfFamily);
                const headName = head
                  ? `${head.resident.firstName} ${head.resident.lastName}`
                  : "Sin Jefe Asignado";
                const cedula = head ? `C.I: ${head.resident.cedula}` : "";
                const houseInfo =
                  f.house && f.house.sector
                    ? `${f.house.sector.name} - Casa #${f.house.number}`
                    : "Casa no asignada";
                const phone = head ? head.resident.phone : "N/A";

                return (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="font-medium text-primary">{headName}</div>
                      <div className="text-sm text-muted-foreground">
                        {cedula}
                      </div>
                    </TableCell>
                    <TableCell>{phone}</TableCell>
                    <TableCell>{houseInfo}</TableCell>
                    <TableCell>
                      {housingStatusMap[f.housingStatus] || f.housingStatus}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {f.members.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/family/${f.id}`}>
                              <Eye />
                              Ver Detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedFamilyId(f.id)}
                          >
                            <Plus />
                            Agregar Miembro
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => {
                              deleteMutation.mutate(f.id);
                            }}
                          >
                            <Trash2 />
                            Eliminar Familia
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedFamilyId && (
        <AddMemberDialog
          familyId={selectedFamilyId}
          open={!!selectedFamilyId}
          onOpenChange={(op) => {
            if (!op) setSelectedFamilyId(null);
          }}
        />
      )}
    </>
  );
}
