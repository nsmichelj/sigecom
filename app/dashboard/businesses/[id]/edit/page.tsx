import { getBusinessByIdAction } from "@/actions/businesses";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { EditBusinessClient } from "@/components/businesses/edit-business-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Editar Emprendimiento | SIGECOM",
};

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: business, success } = await getBusinessByIdAction(id);

  if (!success || !business) {
    redirect("/dashboard/businesses");
  }

  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Editar Emprendimiento</DashboardTitle>
          <DashboardDescription>
            Modifica los detalles de &quot;{business.name}&quot;.
          </DashboardDescription>
        </DashboardHeaderContent>
        <DashboardHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/dashboard/businesses">
              <ArrowLeft />
              Volver a Emprendimientos
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <Card>
        <CardContent>
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Detalles</h2>
            <p className="text-muted-foreground max-w-xl text-lg font-light">
              Edita el emprendimiento seleccionado.
            </p>
          </div>
          <EditBusinessClient
            initialData={{
              ...business,
              description: business.description ?? "",
              coverImage: business.coverImage ?? "",
              phone: business.phone ?? "",
              email: business.email ?? "",
              address: business.address ?? "",
              schedule: business.schedule ?? "",
              rif: business.rif ?? "",
              ownerId: business.ownerId ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
