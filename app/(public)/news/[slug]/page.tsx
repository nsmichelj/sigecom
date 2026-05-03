import { getNewsBySlugAction } from "@/actions/news";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: news } = await getNewsBySlugAction(params.slug);

  if (!news) return { title: "Noticia no encontrada" };

  return {
    title: `${news.title} | SIGECOM`,
    description: news.excerpt || "Detalles de la noticia",
  };
}

export default async function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: news, success } = await getNewsBySlugAction(slug);

  if (!success || !news || !news.isPublished) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-20">
      {/* Hero Header */}
      <header className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-end">
        {news.coverImage ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/90" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-slate-950" />
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 pt-32">
          <Button
            variant="ghost"
            asChild
            className="mb-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Link href="/news">
              <ArrowLeft />
              Volver a noticias
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium tracking-wider uppercase mb-6 text-primary-foreground/80">
            {news.publishedAt && (
              <time dateTime={news.publishedAt.toISOString()}>
                {format(new Date(news.publishedAt), "d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </time>
            )}
            <span className="w-6 h-px bg-primary-foreground/50" />
            <span>Las Colinas</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            {news.title}
          </h1>

          {news.excerpt && (
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl font-light leading-relaxed">
              {news.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        {/* Share / Actions bar */}
        <div className="flex items-center justify-between py-6 border-b border-border/50 mb-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              SC
            </div>
            <div className="text-sm">
              <p className="font-semibold">SIGECOM</p>
              <p className="text-muted-foreground">Comunicación Oficial</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>

        {/* Main Content Body */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:tracking-tight">
          <div
            dangerouslySetInnerHTML={{
              __html: news.content.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        {/* Footer actions */}
        <div className="mt-24 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            Fin del artículo
          </p>
          <Button variant="secondary" asChild className="rounded-full">
            <Link href="/news">Leer más noticias</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
