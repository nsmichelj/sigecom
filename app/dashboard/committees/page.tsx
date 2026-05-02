import { CommitteeList } from "@/components/committees/committee-list";
import { CreateCommitteeDialog } from "@/components/committees/create-committee-dialog";
import { DashboardDescription } from "@/components/dashboard/panel/dashboard-description";
import {
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
} from "@/components/dashboard/panel/dashboard-header";
import { DashboardTitle } from "@/components/dashboard/panel/dashboard-title";

export default function CommitteesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Gestión de Comités</DashboardTitle>
          <DashboardDescription>
            Administre los comités de la comunidad y sus responsabilidades.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <CreateCommitteeDialog />
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative">
        <CommitteeList />
      </div>
    </div>
  );
}
