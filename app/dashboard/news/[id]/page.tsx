import { getNewsByIdAction } from "@/actions/news";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewsViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: news, success } = await getNewsByIdAction(id);

  if (!success || !news) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardHeader className="flex items-center justify-between">
        <DashboardHeaderContent>
          <DashboardTitle>Detalles de la noticia</DashboardTitle>
          <DashboardDescription>
            Revisa la información de la noticia
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

      <div className="bg-card rounded-2xl overflow-hidden border shadow-sm">
        {news.coverImage ? (
          <div className="relative w-full h-75 md:h-100 bg-muted">
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-linear-to-r from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Sin imagen de portada
            </span>
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="pb-8">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/news/${news.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Noticia
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {news.isPublished ? (
              <Badge
                variant="default"
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Publicado
              </Badge>
            ) : (
              <Badge variant="secondary">Borrador</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Creado el{" "}
              {format(new Date(news.createdAt), "dd 'de' MMMM, yyyy", {
                locale: es,
              })}
            </span>
            {news.publishedAt && (
              <span className="text-sm text-muted-foreground border-l pl-3 ml-1">
                Publicado el{" "}
                {format(new Date(news.publishedAt), "dd 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {news.title}
          </h1>

          {news.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4 py-1 italic">
              {news.excerpt}
            </p>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl">
            <div
              dangerouslySetInnerHTML={{
                __html: news.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
