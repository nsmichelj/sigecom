import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { CreateBusinessClient } from "@/components/businesses/create-business-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Registrar Emprendimiento | SIGECOM",
};

export default function CreateBusinessPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeader className="flex-1 border-none pb-0">
          <DashboardHeaderContent>
            <DashboardTitle>Registrar Emprendimiento</DashboardTitle>
            <DashboardDescription>
              Registra un nuevo emprendimiento o negocio comunitario.
            </DashboardDescription>
          </DashboardHeaderContent>
        </DashboardHeader>
        <DashboardHeaderActions>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/businesses">
              <ArrowLeft />
              Cancelar
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <Card>
        <CardContent>
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Datos del Emprendimiento
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg font-light">
              Completa la información del emprendimiento o negocio comunitario
              que deseas registrar.
            </p>
          </div>
          <CreateBusinessClient />
        </CardContent>
      </Card>
    </div>
  );
}
