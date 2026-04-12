"use client";

import { deleteResidentAction, getResidentsAction } from "@/actions/residents";
import { EditMemberDialog } from "@/components/family/edit-member-dialog";
import { MemberDetailDialog } from "@/components/family/member-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Loader,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function ResidentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteResidentAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Habitante eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el habitante");
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["residents"],
    queryFn: async () => {
      const result = await getResidentsAction();
      if (!result.success) throw new Error(result.error);
      return result.data || [];
    },
  });

  const filteredResidents = useMemo(() => {
    if (!data) return [];
    return data.filter((r: any) => {
      const search = debouncedSearchTerm.toLowerCase();
      return (
        r.cedula.toLowerCase().includes(search) ||
        r.firstName.toLowerCase().includes(search) ||
        r.lastName.toLowerCase().includes(search)
      );
    });
  }, [data, debouncedSearchTerm]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center flex-col gap-3">
        <Loader className="size-10 animate-spin text-primary" />
        <span className="text-muted-foreground animate-pulse font-medium">
          Cargando habitantes...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive p-8 text-center bg-destructive/5 rounded-xl border border-destructive/20">
        <p className="font-bold text-lg mb-1">¡Ups! Algo salió mal</p>
        <p className="text-sm">Error al cargar la lista de habitantes.</p>
      </div>
    );
  }

  const handleAction = (resident: any, action: "view" | "edit") => {
    // Construct a dummy familyMember object since Dialogs expect it
    const primaryMembership = resident.familyMemberships?.[0];
    const memberObj = {
      id: primaryMembership?.id,
      relationship: primaryMembership?.relationship || "No asignado",
      isHeadOfFamily: primaryMembership?.isHeadOfFamily || false,
      resident: {
        ...resident,
        dateOfBirth: new Date(resident.dateOfBirth), // Ensure it's a Date object
      },
    };
    setSelectedResident(memberObj);
    if (action === "view") setViewDialogOpen(true);
    if (action === "edit") setEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative group max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Buscar por cédula o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-card/50 border-border/50 focus:ring-primary/20 transition-all rounded-xl"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Familia / Hogar</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 px-4">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <User className="size-8 opacity-20" />
                    <p className="font-medium">No se encontraron habitantes.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredResidents.map((r: any) => {
                const membership = r.familyMemberships?.[0];
                const houseInfo = membership?.family?.house
                  ? `${membership.family.house.sector.name} - Casa #${membership.family.house.number}`
                  : "Sin asignar";

                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground leading-none mb-1">
                          {r.firstName} {r.lastName}
                        </span>
                        {membership?.isHeadOfFamily && (
                          <Badge
                            variant="outline"
                            className="w-fit text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
                          >
                            Jefe de Familia
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>V-{r.cedula}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{r.phone}</span>
                        <span className="text-xs text-muted-foreground opacity-70">
                          {r.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{houseInfo}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10"
                          >
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-1.5 rounded-xl shadow-xl border-border/50"
                        >
                          <DropdownMenuLabel className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                            Gestión
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleAction(r, "view")}
                          >
                            <Eye />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(r, "edit")}
                          >
                            <Pencil />
                            Editar Información
                          </DropdownMenuItem>
                          {membership?.family?.id && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/family/${membership.family.id}`}
                              >
                                <Users />
                                Ver Familia
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => {
                              if (
                                confirm(
                                  "¿Está seguro de que desea eliminar este habitante? Esta acción no se puede deshacer.",
                                )
                              ) {
                                deleteMutation.mutate(r.id);
                              }
                            }}
                          >
                            <Trash2 />
                            Eliminar Habitante
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

      {selectedResident && (
        <>
          <MemberDetailDialog
            member={selectedResident}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <EditMemberDialog
            initialData={selectedResident}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
        </>
      )}
    </div>
  );
}
