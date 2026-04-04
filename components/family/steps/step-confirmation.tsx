import { createFamilyAction } from "@/actions/family";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { housingStatusEnum, relationshipEnum } from "@/lib/db/schema";
import { familyFormSchema } from "@/lib/validator/family";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  Home,
  Loader2,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface StepConfirmationProps {
  formValues: familyFormSchema;
  onNext: () => void;
  onPrevious: () => void;
}

export type Relationship = (typeof relationshipEnum.enumValues)[number];
export type HousingStatus = (typeof housingStatusEnum.enumValues)[number];

const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: "headOfFamily", label: "Jefe de Familia" },
  { value: "spouse", label: "Cónyuge" },
  { value: "child", label: "Hijo/a" },
  { value: "parent", label: "Padre/Madre" },
  { value: "sibling", label: "Hermano/a" },
  { value: "other", label: "Otro" },
];

const housingStatusOptions: Record<HousingStatus, string> = {
  owned: "Propia",
  rented: "Alquilada",
  shared: "Arrimado / Compartida",
  custody: "Al cuidado / Comodato",
};

export function StepConfirmation({
  formValues,
  onPrevious,
  onNext,
}: StepConfirmationProps) {
  const queryClient = useQueryClient();

  const createFamilyMutation = useMutation({
    mutationFn: async () => {
      const result = await createFamilyAction(formValues);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Familia registrada", {
        description:
          "El núcleo familiar se ha guardado exitosamente en el sistema.",
      });
      queryClient.invalidateQueries({ queryKey: ["families"] });
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear la familia");
    },
  });

  const handleSubmit = () => {
    createFamilyMutation.mutate();
  };

  const getRelationshipLabel = (relationship: Relationship) => {
    return (
      relationshipOptions.find((o) => o.value === relationship)?.label ||
      "Desconocido"
    );
  };

  const allMembers = [formValues.headOfFamily, ...formValues.members].filter(
    (m) => m && m.resident?.firstName,
  );

  return (
    <div className="space-y-10">
      <div className="space-y-2 mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black tracking-tight">
          Confirmación y Envío
        </h2>
        <p className="text-muted-foreground text-lg font-light mt-1">
          Verifique el resumen de información antes de procesar el registro en
          el sistema.
        </p>
      </div>

      <div className="bg-background/40 border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-inner backdrop-blur-xl space-y-12">
        {/* Residence Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Home className="size-6 text-primary" />
            <h3 className="text-lg font-bold tracking-widest uppercase text-foreground">
              Datos de Vivienda
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Estatus
              </p>
              <p className="text-lg font-medium">
                {housingStatusOptions[
                  formValues.residence.housingStatus as HousingStatus
                ] || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Nº Casa
              </p>
              <p className="text-lg font-medium">
                {formValues.residence.number}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Sector
              </p>
              <p
                className="text-lg font-medium truncate"
                title={formValues.residence.sectorName}
              >
                {formValues.residence.sectorName || "No asignado"}
              </p>
            </div>
          </div>
        </div>

        {/* Member Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <Users className="size-6 text-primary" />
              <h3 className="text-lg font-bold tracking-widest uppercase text-foreground">
                Núcleo Familiar
              </h3>
            </div>
            <Badge
              variant="secondary"
              className="px-3 bg-primary/10 text-primary font-bold text-sm"
            >
              {allMembers.length} Integrantes
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {allMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 p-4 rounded-2xl bg-background/60 border border-border/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {member.isHeadOfFamily && (
                      <Star className="size-4 text-amber-500 fill-amber-500" />
                    )}
                    <h4 className="font-bold text-base truncate max-w-50">
                      {member.resident.firstName} {member.resident.lastName}
                    </h4>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground"
                  >
                    {getRelationshipLabel(member.relationship as Relationship)}
                  </Badge>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  C.I: {member.resident.cedula}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center sm:pt-8 border-t border-border/40 gap-4 mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPrevious?.()}
        >
          <ChevronLeft />
          Anterior
        </Button>

        <Button
          type="button"
          disabled={createFamilyMutation.isPending}
          onClick={handleSubmit}
        >
          {createFamilyMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Registrando Familia...
            </>
          ) : (
            <>
              Confirmar y Registrar
              <CheckCircle2 />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
