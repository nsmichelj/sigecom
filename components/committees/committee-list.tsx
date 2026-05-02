"use client";

import {
  deleteCommitteeAction,
  getCommitteesAction,
} from "@/actions/committees";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, ShieldCheck, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EditCommitteeDialog } from "./edit-committee-dialog";

export function CommitteeList() {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["committees"],
    queryFn: async () => {
      const res = await getCommitteesAction();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteCommitteeAction(id);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      toast.success("Comité eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["committees"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el comité");
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center text-center py-10">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <ShieldCheck className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            No hay comités aún
          </CardTitle>
          <CardDescription className="max-w-xs mb-6">
            Comienza creando el primer comité para organizar la gestión
            comunitaria.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((committee) => {
          const mainMember = committee.members?.find(
            (m: any) => m.role === "main",
          );
          const memberCount = committee.members?.length || 0;

          return (
            <Card
              key={committee.id}
              className="group hover:border-primary/50 transition-all duration-300 overflow-hidden relative"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={committee.isActive ? "default" : "secondary"}
                    className="capitalize font-medium tracking-wide"
                  >
                    {committee.isActive ? "Activo" : "Inactivo"}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCommittee(committee);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          deleteMutation.mutate(committee.id);
                        }}
                      >
                        <Trash2 />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {committee.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-10 text-sm italic">
                  {committee.description || "Sin descripción proporcionada."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users />
                    <span>{memberCount} Miembros asignados</span>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                      Responsable Principal
                    </span>
                    <div className="text-sm font-medium">
                      {mainMember
                        ? `${mainMember.resident.firstName} ${mainMember.resident.lastName}`
                        : "No asignado"}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-2 hover:text-primary-foreground hover:bg-primary transition-all"
                  asChild
                >
                  <Link href={`/dashboard/committees/${committee.id}`}>
                    Gestionar Miembros
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditCommitteeDialog
        committeeData={selectedCommittee}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
