"use client";

import { getPublishedBusinessesAction } from "@/actions/businesses";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  ImageIcon,
  MapPin,
  Phone,
  Search,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categoryLabels: Record<string, string> = {
  food: "Alimentos y Bebidas",
  services: "Servicios Generales",
  commerce: "Comercio y Ventas",
  crafts: "Artesanía",
  health: "Salud y Bienestar",
  education: "Educación",
  technology: "Tecnología",
  beauty: "Belleza",
  other: "Otro",
};

const allCategories = [
  "all",
  "food",
  "services",
  "commerce",
  "crafts",
  "health",
  "education",
  "technology",
  "beauty",
  "other",
] as const;

export function BusinessesPublicClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    data: businesses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["published-businesses"],
    queryFn: async () => {
      const { data, success } = await getPublishedBusinessesAction();
      if (!success || !data) {
        throw new Error("Error al obtener los emprendimientos");
      }
      return data;
    },
  });

  const filtered = businesses?.filter((b) => {
    const matchesSearch =
      search.trim() === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">
          Error al cargar los emprendimientos.
        </p>
      </div>
    );
  }

  return (
    <Container className="min-h-screen">
      <div className="w-full py-12 md:py-20">
        <header className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Directorio.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Conoce los emprendimientos y negocios de nuestra comunidad. Apoya lo
            local, descubre productos y servicios cerca de ti.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar emprendimientos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "all" ? "Todos" : categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-muted animate-pulse h-80"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered?.length === 0 && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center px-4">
            <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Store className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-3xl font-light tracking-tight mb-2 text-center">
              {search || selectedCategory !== "all"
                ? "Sin resultados"
                : "Sin emprendimientos publicados"}
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              {search || selectedCategory !== "all"
                ? "Intenta con otro término de búsqueda o categoría."
                : "Aún no hay emprendimientos o negocios registrados. Vuelve pronto."}
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filtered.map((item, i) => (
              <Link
                key={item.id}
                href={`/businesses/${item.slug}`}
                className="group flex flex-col h-full"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-muted">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-none shadow-sm">
                      {categoryLabels[item.category] ?? item.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-muted-foreground line-clamp-2 mb-4 text-sm flex-1">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-1.5 mb-4">
                    {item.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.phone}</span>
                      </div>
                    )}
                    {item.isLegalEntity && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Negocio Jurídico</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                    Ver detalles
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
