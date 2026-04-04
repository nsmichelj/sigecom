import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { FamiliesTable } from "@/components/family/family-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Gestión de Familias",
};

export default function FamiliesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Familias</DashboardTitle>
          <DashboardDescription>
            Administra los grupos familiares registrados en el sistema.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button asChild>
            <Link href="/dashboard/family/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Nueva Familia
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative">
        <FamiliesTable />
      </div>
    </div>
  );
}
