"use client";

import { DashboardDescription } from "@/components/dashboard/panel/dashboard-description";
import {
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
} from "@/components/dashboard/panel/dashboard-header";
import { DashboardTitle } from "@/components/dashboard/panel/dashboard-title";
import { AddResidentLinkDialog } from "@/components/residents/add-resident-link-dialog";
import { ResidentsTable } from "@/components/residents/residents-table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function ResidentsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Gestión de Habitantes</DashboardTitle>
          <DashboardDescription>
            Consulte y administre la información de todos los habitantes
            registrados en la comunidad.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button onClick={() => setAddDialogOpen(true)}>
            <UserPlus />
            Agregar Habitante
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative">
        <ResidentsTable />
      </div>

      <AddResidentLinkDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  );
}
