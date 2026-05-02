import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectList } from "@/components/projects/project-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Proyectos | SIGECOM",
  description:
    "Administra los proyectos de la comunidad, presupuestos y evidencias.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Proyectos Comunitarios</DashboardTitle>
          <DashboardDescription>
            Supervisa el desarrollo, ejecución presupuestaria y respaldo visual
            de cada iniciativa en Las Colinas.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <CreateProjectDialog />
        </DashboardHeaderActions>
      </DashboardHeader>

      <div>
        <ProjectList />
      </div>
    </div>
  );
}
