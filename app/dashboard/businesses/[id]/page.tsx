import { getBusinessByIdAction } from "@/actions/businesses";
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
import {
  ArrowLeft,
  Building2,
  Clock,
  Edit,
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

export default async function BusinessViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: business, success } = await getBusinessByIdAction(id);

  if (!success || !business) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardHeader className="flex items-center justify-between">
        <DashboardHeaderContent>
          <DashboardTitle>Detalles del emprendimiento</DashboardTitle>
          <DashboardDescription>
            Revisa la información del emprendimiento
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

      <div className="bg-card rounded-2xl overflow-hidden border shadow-sm">
        {business.coverImage ? (
          <div className="relative w-full h-75 md:h-100 bg-muted">
            <Image
              src={business.coverImage}
              alt={business.name}
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
              <Link href={`/dashboard/businesses/${business.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Emprendimiento
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {business.isPublished ? (
              <Badge
                variant="default"
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Publicado
              </Badge>
            ) : (
              <Badge variant="secondary">Borrador</Badge>
            )}
            <Badge variant="outline">
              {categoryLabels[business.category] ?? business.category}
            </Badge>
            {business.isLegalEntity && (
              <Badge variant="outline" className="border-amber-500/50 text-amber-600">
                <Building2 className="w-3 h-3 mr-1" />
                Jurídico
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Registrado el{" "}
              {format(new Date(business.createdAt), "dd 'de' MMMM, yyyy", {
                locale: es,
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {business.name}
          </h1>

          {business.description && (
            <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4 py-1">
              {business.description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {business.owner && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Propietario
                  </p>
                  <p className="font-medium">
                    {business.owner.firstName} {business.owner.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    C.I. {business.owner.cedula}
                  </p>
                </div>
              </div>
            )}

            {business.phone && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="font-medium">{business.phone}</p>
                </div>
              </div>
            )}

            {business.email && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Correo
                  </p>
                  <p className="font-medium">{business.email}</p>
                </div>
              </div>
            )}

            {business.address && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </p>
                  <p className="font-medium">{business.address}</p>
                </div>
              </div>
            )}

            {business.schedule && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Horario
                  </p>
                  <p className="font-medium whitespace-pre-line">
                    {business.schedule}
                  </p>
                </div>
              </div>
            )}

            {business.isLegalEntity && business.rif && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Building2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    RIF
                  </p>
                  <p className="font-medium">{business.rif}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
