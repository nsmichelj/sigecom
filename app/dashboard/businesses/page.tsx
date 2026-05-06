import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { BusinessesList } from "@/components/businesses/businesses-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gestión de Emprendimientos | SIGECOM",
  description:
    "Administra los emprendimientos y negocios comunitarios registrados.",
};

export default function BusinessesPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Emprendimientos y Negocios</DashboardTitle>
          <DashboardDescription>
            Registra, edita y publica los emprendimientos y negocios
            comunitarios de Las Colinas.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button asChild>
            <Link href="/dashboard/businesses/create">
              <Plus />
              Nuevo Emprendimiento
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <BusinessesList />
    </div>
  );
}
