import { getPublishedNewsAction } from "@/actions/news";
import { Container } from "@/components/container";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Newspaper } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Noticias de la Comunidad | SIGECOM",
  description:
    "Mantente al día con las últimas noticias y anuncios de nuestra comunidad.",
};

export default async function PublicNewsPage() {
  const { data: news, success } = await getPublishedNewsAction();

  if (!success || !news) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">
          Error al cargar las noticias.
        </p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
          <Newspaper className="w-10 h-10 text-primary/40" />
        </div>
        <h1 className="text-3xl font-light tracking-tight mb-2 text-center">
          Sin noticias publicadas
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          Aún no hay anuncios o noticias disponibles para la comunidad. Vuelve
          pronto.
        </p>
      </div>
    );
  }

  const [featured, ...restNews] = news;

  return (
    <Container className="min-h-screen">
      <div className="w-full py-12 md:py-20">
        <header className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Novedades.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Descubre las últimas historias, anuncios y actualizaciones de
            nuestra comunidad, seleccionadas para ti.
          </p>
        </header>

        {featured && (
          <section className="mb-20 md:mb-32">
            <Link
              href={`/news/${featured.slug}`}
              className="group block relative rounded-3xl overflow-hidden bg-muted"
            >
              <div className="aspect-[16/9] md:aspect-[21/9] relative w-full overflow-hidden">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                  <div className="flex items-center gap-4 text-sm font-medium tracking-wider uppercase mb-4 text-white/80">
                    <span>
                      {featured.publishedAt &&
                        format(new Date(featured.publishedAt), "dd MMMM yyyy", {
                          locale: es,
                        })}
                    </span>
                    <span className="w-8 h-[1px] bg-white/50" />
                    <span>Destacado</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:underline decoration-2 underline-offset-4">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl line-clamp-2 md:line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {restNews.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {restNews.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex flex-col h-full"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-muted">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-muted-foreground mb-3">
                      {item.publishedAt &&
                        format(new Date(item.publishedAt), "dd MMM yyyy", {
                          locale: es,
                        })}
                    </span>

                    <h3 className="text-2xl font-semibold leading-snug mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {item.excerpt && (
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                      Leer artículo
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
