import { getBusinessBySlugAction } from "@/actions/businesses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const categoryLabels: Record<string, string> = {
  food: "Alimentos y Bebidas",
  services: "Servicios Generales",
  commerce: "Comercio y Ventas",
  crafts: "Artesanía y Manualidades",
  health: "Salud y Bienestar",
  education: "Educación y Formación",
  technology: "Tecnología",
  beauty: "Belleza y Cuidado Personal",
  other: "Otro",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: business } = await getBusinessBySlugAction(params.slug);

  if (!business) return { title: "Emprendimiento no encontrado" };

  return {
    title: `${business.name} | SIGECOM`,
    description:
      business.description || "Detalles del emprendimiento comunitario",
  };
}

export default async function PublicBusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: business, success } = await getBusinessBySlugAction(slug);

  if (!success || !business || !business.isPublished) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-20">
      {/* Hero Header */}
      <header className="relative w-full min-h-[50vh] md:min-h-[65vh] flex items-end">
        {business.coverImage ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={business.coverImage}
              alt={business.name}
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
            <Link href="/businesses">
              <ArrowLeft />
              Volver al directorio
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
              {categoryLabels[business.category] ?? business.category}
            </Badge>
            {business.isLegalEntity && (
              <Badge className="bg-amber-500/20 text-amber-200 border-none backdrop-blur-sm">
                <Building2 className="w-3 h-3 mr-1" />
                Negocio Jurídico
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            {business.name}
          </h1>

          {business.description && (
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl font-light leading-relaxed">
              {business.description}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        {/* Owner section */}
        {business.owner && (
          <div className="flex items-center justify-between py-6 border-b border-border/50 mb-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold">
                  {business.owner.firstName} {business.owner.lastName}
                </p>
                <p className="text-muted-foreground">Propietario/a</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact & Details */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Información de contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {business.phone && (
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Teléfono
                  </p>
                  <p className="font-semibold">{business.phone}</p>
                </div>
              </div>
            )}

            {business.email && (
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Correo electrónico
                  </p>
                  <p className="font-semibold break-all">{business.email}</p>
                </div>
              </div>
            )}

            {business.address && (
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Dirección
                  </p>
                  <p className="font-semibold">{business.address}</p>
                </div>
              </div>
            )}

            {business.isLegalEntity && business.rif && (
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    RIF
                  </p>
                  <p className="font-semibold">{business.rif}</p>
                </div>
              </div>
            )}
          </div>

          {business.schedule && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Horario de atención
              </h2>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium whitespace-pre-line leading-relaxed">
                    {business.schedule}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-24 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            Fin de la ficha
          </p>
          <Button variant="secondary" asChild className="rounded-full">
            <Link href="/businesses">Ver más emprendimientos</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
