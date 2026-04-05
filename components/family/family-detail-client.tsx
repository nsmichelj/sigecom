"use client";

import { Home, MapPin, Pencil, Trash2, Users } from "lucide-react";

import {
  getFamilyByIdAction,
  removeFamilyMemberAction,
} from "@/actions/family";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { familyMemberSchema } from "@/lib/validator/family";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { AddMemberDialog } from "./add-member-dialog";
import { EditMemberDialog } from "./edit-member-dialog";
import {
  genderOptions,
  Relationship,
  relationshipOptions,
} from "./resident-form-fields";

const housingStatusMap: Record<string, string> = {
  owned: "Propia",
  rented: "Alquiler",
  shared: "Compartida",
  custody: "Comodato / Al cuidado",
};

const relationshipMap: Record<string, string> = {
  headOfFamily: "Jefe de Familia",
  spouse: "Cónyuge",
  child: "Hijo/a",
  parent: "Padre/Madre",
  sibling: "Hermano/a",
  other: "Otro",
};
const renderBadge = (
  condition: boolean,
  icon: React.ReactNode,
  label: string,
  variant: "default" | "secondary" | "destructive" | "outline" = "secondary",
) => {
  if (!condition) return null;
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {icon}
      {label}
    </Badge>
  );
};

function MemberCard({
  familyMember,
  isHead = false,
  familyId,
}: {
  familyMember: familyMemberSchema;
  isHead?: boolean;
  familyId: string;
}) {
  const [open, setOpen] = useState(false);
  const { resident } = familyMember;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await removeFamilyMemberAction(familyMember.id || "");
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Miembro eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["family", familyId] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar miembro");
    },
  });

  const getRelationshipLabel = (relationship: Relationship) => {
    return relationshipOptions.find((option) => option.value === relationship)
      ?.label;
  };

  return (
    <>
      <Card className={isHead ? "border-primary/30" : ""}>
        <CardContent className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {resident.firstName} {resident.lastName}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium flex-wrap">
              <span>C.I: {resident.cedula}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="capitalize">
                {genderOptions.find((g) => g.value === resident.gender)?.label}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              {!familyMember.isHeadOfFamily && (
                <Badge
                  variant="secondary"
                  className="px-3 bg-primary/10 text-primary uppercase font-bold text-[10px] tracking-wider"
                >
                  {getRelationshipLabel(
                    familyMember.relationship as Relationship,
                  )}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-10 bg-background/50 backdrop-blur disabled:opacity-50"
              onClick={() => setOpen(true)}
              disabled={deleteMutation.isPending}
            >
              <Pencil />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-10 bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white backdrop-blur disabled:opacity-50"
              onClick={() => {
                deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending || isHead}
            >
              <Trash2 />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditMemberDialog
        initialData={familyMember}
        open={!!open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function FamilyDetailClient() {
  const params = useParams();
  const familyId = params.id as string;
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const {
    data: familyResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["family", familyId],
    queryFn: () => getFamilyByIdAction(familyId),
    enabled: !!familyId,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border/50 shadow-sm">
        <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium tracking-tight text-foreground/80">
          Cargando detalles...
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Obteniendo información de la familia
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20 shadow-sm text-center">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Trash2 className="size-6 text-destructive" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-destructive">
          Error al cargar la familia
        </h3>
      </div>
    );
  }

  if (!familyResponse?.data) {
    return notFound();
  }

  const family = familyResponse.data;
  const head = family.members.find((m) => m.isHeadOfFamily);
  const others = family.members.filter((m) => !m.isHeadOfFamily);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
        {/* Header / Context Section */}
        <div className="relative rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div className="p-8 sm:p-10 relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-muted/60 px-3 py-1 rounded-full border border-border/40">
                <Home className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Información de Vivienda
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90">
                Familia {head ? head.resident.lastName : "Sin Jefe"}
              </h2>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 lg:gap-8 text-muted-foreground mt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground/80">
                      Sector {family.house?.sector?.name || "N/A"}
                    </p>
                    <p className="text-sm">Casa #{family.house?.number}</p>
                  </div>
                </div>

                <div className="hidden sm:block md:hidden lg:block w-px h-10 bg-border/60"></div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground/80">
                      {housingStatusMap[family.housingStatus] ||
                        family.housingStatus}
                    </p>
                    <p className="text-sm">Estatus de Vivienda</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center bg-background rounded-2xl p-6 border border-border/60 shadow-sm min-w-40">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-1">
                  {family.members.length}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Integrantes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold tracking-tight">
                Núcleo Familiar
              </h3>
              <div className="h-px bg-border w-24 sm:w-auto sm:flex-1 ml-4 shadow-sm" />
            </div>
            <Button
              className="rounded-full shadow-sm"
              onClick={() => setAddMemberOpen(true)}
            >
              Agregar Miembro
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {head && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2">
                  Jefe de Familia
                </p>
                <MemberCard
                  familyMember={head as familyMemberSchema}
                  isHead={true}
                  familyId={familyId}
                />
              </div>
            )}

            {others.length > 0 && (
              <div className="space-y-4 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2 mt-4 lg:mt-0">
                  Otros Miembros
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {others.map((member) => (
                    <MemberCard
                      key={member.id}
                      familyMember={member as familyMemberSchema}
                      familyId={familyId}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {addMemberOpen && (
        <AddMemberDialog
          familyId={familyId}
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
        />
      )}
    </>
  );
}
