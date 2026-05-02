"use client";

import { deleteProjectAction, getProjectByIdAction } from "@/actions/projects";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { EvidenceGallery } from "@/components/projects/EvidenceGallery";
import { MovementList } from "@/components/projects/MovementList";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CreditCard,
  DollarSign,
  Image as ImageIcon,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await getProjectByIdAction(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteProjectAction(id);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      toast.success("Proyecto eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/dashboard/projects");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el proyecto");
    },
  });

  if (isLoading || !project) {
    return (
      <div className="p-10 space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Detalles del Proyecto</DashboardTitle>
          <DashboardDescription>
            Información general, movimientos financieros y evidencias del
            proyecto.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft />
              Volver a proyectos
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-border/50 bg-muted">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              className="w-full h-full object-cover"
              alt={project.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Briefcase size={64} className="text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="absolute top-6 right-8 flex items-center gap-2 z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-xl border-border/50 hover:bg-primary/20 hover:text-primary transition-all duration-300"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-destructive/10 text-destructive border-destructive/20 backdrop-blur-xl hover:bg-destructive hover:text-white transition-all duration-300"
              onClick={() => deleteMutation.mutate(project.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 space-y-2">
            <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 rounded-full px-3 py-1 backdrop-blur-md">
              {project.status.toUpperCase()}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground leading-none">
              {project.name}
            </h1>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="border-b border-border/40 overflow-x-auto">
            <TabsList className="bg-transparent border-none gap-8 p-0 h-14">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold tracking-widest uppercase text-xs transition-all"
              >
                <Info className="mr-2 size-4" /> Resumen
              </TabsTrigger>
              <TabsTrigger
                value="movements"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold tracking-widest uppercase text-xs transition-all"
              >
                <CreditCard className="mr-2 size-4" /> Finanzas
              </TabsTrigger>
              <TabsTrigger
                value="evidence"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold tracking-widest uppercase text-xs transition-all"
              >
                <ImageIcon className="mr-2 size-4" /> Evidencias
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="py-2">
            <TabsContent
              value="overview"
              className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Presupuesto Inicial
                  </div>
                  <div className="text-3xl font-black flex items-center">
                    <DollarSign size={24} className="text-primary mr-1" />
                    {Number(project.budget).toLocaleString()}
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Fecha de Inicio
                  </div>
                  <div className="text-3xl font-black flex items-center">
                    <Calendar size={24} className="text-primary mr-1" />
                    {new Date(project.createdAt || "").toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-2xl tracking-tight uppercase flex items-center gap-2">
                  Descripción del Proyecto
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xl">
                  {project.description ||
                    "No se ha proporcionado una descripción detallada para este proyecto."}
                </p>
              </div>

              <div className="space-y-4 p-8 bg-muted/30 rounded-[2rem] border border-border/50">
                <div className="flex justify-between items-end">
                  <h3 className="font-black text-xl tracking-tight uppercase">
                    Ejecución del Gasto
                  </h3>
                  <span className="text-primary font-black text-2xl">
                    {(() => {
                      const totalEgresos = project.movements
                        .filter((m: any) => m.type === "egreso")
                        .reduce(
                          (acc: number, m: any) => acc + Number(m.amount),
                          0,
                        );
                      const progress =
                        Math.min(
                          (totalEgresos / Number(project.budget)) * 100,
                          100,
                        ) || 0;
                      return Math.round(progress);
                    })()}
                    %
                  </span>
                </div>
                <Progress
                  value={(() => {
                    const totalEgresos = project.movements
                      .filter((m: any) => m.type === "egreso")
                      .reduce(
                        (acc: number, m: any) => acc + Number(m.amount),
                        0,
                      );
                    return (
                      Math.min(
                        (totalEgresos / Number(project.budget)) * 100,
                        100,
                      ) || 0
                    );
                  })()}
                  className="h-4 rounded-full"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="movements"
              className="m-0 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <MovementList
                projectId={project.id}
                movements={project.movements}
              />
            </TabsContent>

            <TabsContent
              value="evidence"
              className="m-0 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <EvidenceGallery
                projectId={project.id}
                evidences={project.evidences}
              />
            </TabsContent>
          </div>
        </Tabs>

        <EditProjectDialog
          initialData={project}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      </div>
    </>
  );
}
