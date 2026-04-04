import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { CreateSectorDialog } from "@/components/sectors/create-sector-dialog";
import { SectorsTable } from "@/components/sectors/sectors-table";

export const metadata = {
  title: "Gestión de Sectores",
};

export default function SectorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Sectores</DashboardTitle>
          <DashboardDescription>
            Administra los sectores registrados en el sistema.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <CreateSectorDialog />
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative">
        <SectorsTable />
      </div>
    </div>
  );
}
