"use client";

import { DashboardDescription } from "@/components/dashboard/panel/dashboard-description";
import { DashboardHeader } from "@/components/dashboard/panel/dashboard-header";
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <DashboardTitle>Gestión de Habitantes</DashboardTitle>
            <DashboardDescription>
              Consulte y administre la información de todos los habitantes
              registrados en la comunidad.
            </DashboardDescription>
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold group"
          >
            <UserPlus className="mr-2 size-5 group-hover:scale-110 transition-transform" />
            Agregar Habitante
          </Button>
        </div>
      </DashboardHeader>

      <div className="mt-8">
        <ResidentsTable />
      </div>

      <AddResidentLinkDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  );
}
