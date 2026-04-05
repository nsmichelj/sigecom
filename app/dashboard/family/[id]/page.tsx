import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { FamilyDetailClient } from "@/components/family/family-detail-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Detalles de Familia",
};

export default function FamilyDetailPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <div className="flex flex-col gap-1">
            <DashboardTitle>Detalle del Núcleo Familiar</DashboardTitle>
            <DashboardDescription>
              Información detallada de la familia y sus miembros.
            </DashboardDescription>
          </div>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard/family">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative mt-2">
        <FamilyDetailClient />
      </div>
    </div>
  );
}
