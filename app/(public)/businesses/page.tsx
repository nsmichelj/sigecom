import { BusinessesPublicClient } from "@/components/businesses/businesses-public-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emprendimientos y Negocios | SIGECOM",
  description:
    "Descubre los emprendimientos y negocios comunitarios de Las Colinas. Apoya lo local.",
};

export default function PublicBusinessesPage() {
  return <BusinessesPublicClient />;
}
