import { getNewsByIdAction } from "@/actions/news";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { EditNewsClient } from "@/components/news/edit-news-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Editar Noticia",
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: news, success } = await getNewsByIdAction(id);

  if (!success || !news) {
    redirect("/dashboard/news");
  }

  return (
    <div className="space-y-8">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Editar Noticia</DashboardTitle>
          <DashboardDescription>
            Modifica los detalles de la noticia "{news.title}".
          </DashboardDescription>
        </DashboardHeaderContent>
        <DashboardHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/dashboard/news">
              <ArrowLeft />
              Volver a Noticias
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <Card>
        <CardContent>
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Detalles</h2>
            <p className="text-muted-foreground max-w-xl text-lg font-light">
              Edita la noticia seleccionada.
            </p>
          </div>
          <EditNewsClient
            initialData={{
              ...news,
              excerpt: news.excerpt ?? "",
              coverImage: news.coverImage ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
