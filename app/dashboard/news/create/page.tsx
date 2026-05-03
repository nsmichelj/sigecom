import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { CreateNewsClient } from "@/components/news/create-news-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Crear Noticia",
};

export default function CreateNewsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeader className="flex-1 border-none pb-0">
          <DashboardHeaderContent>
            <DashboardTitle>Crear Noticia</DashboardTitle>
            <DashboardDescription>
              Redacta una nueva noticia o anuncio para publicarlo en la
              comunidad.
            </DashboardDescription>
          </DashboardHeaderContent>
        </DashboardHeader>
        <DashboardHeaderActions>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/news">
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
              Datos de la Noticia
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg font-light">
              Redacta una nueva noticia o anuncio para publicarlo en la
              comunidad.
            </p>
          </div>
          <CreateNewsClient />
        </CardContent>
      </Card>
    </div>
  );
}
