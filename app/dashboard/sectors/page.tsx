import { DashboardHeader, DashboardTitle } from "@/components/dashboard/panel";
import { CreateSectorDialog } from "@/components/sectors/create-sector-dialog";
import { SectorsTable } from "@/components/sectors/sectors-table";

export const metadata = {
  title: "Gestión de Sectores",
};

export default function SectorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <DashboardHeader>
        <DashboardTitle>Sectores</DashboardTitle>
        <CreateSectorDialog />
      </DashboardHeader>

      <SectorsTable />
    </div>
  );
}
