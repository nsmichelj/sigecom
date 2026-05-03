import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { NewsList } from "@/components/news/news-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gestión de Noticias | SIGECOM",
  description: "Administra las noticias y anuncios de la comunidad.",
};

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Noticias de la Comunidad</DashboardTitle>
          <DashboardDescription>
            Crea, edita y publica noticias o anuncios importantes para todos los
            habitantes de Las Colinas.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button asChild>
            <Link href="/dashboard/news/create">
              <Plus />
              Nueva Noticia
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <NewsList />
    </div>
  );
}
