"use client";

import {
  getCommitteeByIdAction,
  removeMemberAction,
  updateMemberRoleAction,
} from "@/actions/committees";
import { MemberAssignmentDialog } from "@/components/committees/member-assignment-dialog";
import { DashboardDescription } from "@/components/dashboard/panel/dashboard-description";
import {
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
} from "@/components/dashboard/panel/dashboard-header";
import { DashboardTitle } from "@/components/dashboard/panel/dashboard-title";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  MoreVertical,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommitteeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: committee, isLoading } = useQuery({
    queryKey: ["committee", id],
    queryFn: async () => {
      const res = await getCommitteeByIdAction(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await removeMemberAction(memberId);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      toast.success("Miembro removido");
      queryClient.invalidateQueries({ queryKey: ["committee", id] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "main" | "substitute";
    }) => {
      const res = await updateMemberRoleAction(memberId, role);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      toast.success("Rol actualizado");
      queryClient.invalidateQueries({ queryKey: ["committee", id] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Comité no encontrado</h2>
        <Button
          variant="link"
          onClick={() => router.push("/dashboard/committees")}
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  const members = committee.members || [];
  const mainMember = members.find((m: any) => m.role === "main");
  const substituteMembers = members.filter((m: any) => m.role === "substitute");

  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Detalles del Comité</DashboardTitle>
          <DashboardDescription>
            Información y miembros del comité seleccionado.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/dashboard/committees">
              <ArrowLeft />
              Volver
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="relative rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="p-8 sm:p-10 relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-muted/60 px-3 py-1 rounded-full border border-border/40">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Comité
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90">
              {committee.name}
            </h2>
          </div>

          <div className="shrink-0 flex items-center justify-center bg-background rounded-2xl p-6 border border-border/60 shadow-sm min-w-40">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">
                {committee.members.length}
              </div>
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Miembros
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="size-5 text-primary" />
                Miembro Principal
              </CardTitle>
              <CardDescription>
                El miembro principal es el representante legal del comité.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mainMember ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-2xl border border-primary/5">
                    <div className="bg-primary/10 p-4 rounded-full mb-3 ring-4 ring-primary/5 ring-offset-2 ring-offset-white">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div className="font-bold text-lg">
                      {mainMember.resident.firstName}{" "}
                      {mainMember.resident.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      C.I: {mainMember.resident.cedula}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Unido el:</span>
                      <span className="font-medium">
                        {format(
                          new Date(mainMember.joinedAt),
                          "d 'de' MMMM 'de' yyyy",
                          {
                            locale: es,
                          },
                        )}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        removeMemberMutation.mutate(mainMember.id);
                      }}
                    >
                      <Trash2 />
                      Remover Responsabilidad
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center italic text-muted-foreground">
                  <p>No hay un responsable asignado actualmente.</p>
                  <div className="mt-4">
                    <MemberAssignmentDialog committeeId={id} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-bold">
                  Listado de Miembros
                </CardTitle>
                <CardDescription>
                  Miembros suplentes y colaboradores registrados.
                </CardDescription>
              </div>
              <MemberAssignmentDialog committeeId={id} />
            </CardHeader>
            <CardContent>
              {substituteMembers.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/80">
                  <User className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">
                    No hay miembros suplentes asignados.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {substituteMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-full group-hover:bg-primary/5 transition-colors">
                          <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {member.resident.firstName}{" "}
                            {member.resident.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            C.I: {member.resident.cedula}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl p-1"
                        >
                          <DropdownMenuItem
                            className="rounded-lg cursor-pointer"
                            onClick={() =>
                              updateRoleMutation.mutate({
                                memberId: member.id,
                                role: "main",
                              })
                            }
                          >
                            <UserCheck className="text-primary" />
                            Hacer Principal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive rounded-lg cursor-pointer"
                            onClick={() => {
                              removeMemberMutation.mutate(member.id);
                            }}
                          >
                            <Trash2 />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
