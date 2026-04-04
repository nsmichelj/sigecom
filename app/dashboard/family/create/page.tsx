import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderActions,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";
import { FamilyStepperForm } from "@/components/family/steps/family-stepper-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Crear Nueva Familia",
};

export default function CreateFamilyPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Registrar Nueva Familia</DashboardTitle>
          <DashboardDescription>
            Completa el formulario para incorporar un nuevo grupo familiar al
            sistema.
          </DashboardDescription>
        </DashboardHeaderContent>

        <DashboardHeaderActions>
          <Button asChild variant="secondary">
            <Link href="/dashboard/family">
              <ChevronLeft />
              Cancelar
            </Link>
          </Button>
        </DashboardHeaderActions>
      </DashboardHeader>

      <div className="w-full relative">
        <FamilyStepperForm />
      </div>
    </div>
  );
}
