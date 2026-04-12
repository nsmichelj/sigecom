"use client";

import {
  Activity,
  Baby,
  Briefcase,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  HeartPulse,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { familyMemberSchema } from "@/lib/validator/family";
import {
  civilStatusOptions,
  educationLevelOptions,
  genderOptions,
  relationshipOptions,
} from "./resident-form-fields/const";

interface MemberDetailDialogProps {
  member: familyMemberSchema;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetailDialog({
  member,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  const { resident } = member;

  // Helper to calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-VE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getLabel = (
    options: { value: string; label: string }[],
    value: string,
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const age = calculateAge(new Date(resident.dateOfBirth));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>Detalles del miembro</DialogTitle>
        <DialogDescription>
          Información detallada del miembro de la familia
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background shadow-2xl">
        <div className="relative h-28 bg-linear-to-r from-primary/10 via-primary/5 to-background border-b border-border/40">
          <div className="absolute -bottom-9 left-8 p-1 bg-background rounded-2xl shadow-xl ring-4 ring-background">
            <div className="size-18 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="size-10 text-primary" />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-background/80 backdrop-blur-sm shadow-sm gap-2"
            >
              <FileSpreadsheet className="size-4 text-emerald-600" />
              <span>Excel</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/80 backdrop-blur-sm shadow-sm gap-2"
            >
              <FileText className="size-4 text-red-600" />
              <span>PDF</span>
            </Button>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {resident.firstName} {resident.lastName}
              </h2>
              {member.isHeadOfFamily && (
                <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 uppercase tracking-wider text-[10px]">
                  Jefe de Familia
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground font-medium text-sm">
              <span className="flex items-center gap-1.5">
                <CreditCard className="size-4 opacity-70" />
                V-{resident.cedula}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-border self-center" />
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 opacity-70" />
                {age} años
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-border self-center" />
              <span className="flex items-center gap-1.5">
                <Users className="size-4 opacity-70" />
                {getLabel(relationshipOptions as any, member.relationship)}
              </span>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                Información Personal
              </h3>
              <div className="grid gap-4">
                <DataRow
                  icon={<Calendar className="size-4" />}
                  label="Fecha de Nacimiento"
                  value={formatDate(new Date(resident.dateOfBirth))}
                />
                <DataRow
                  icon={<Activity className="size-4" />}
                  label="Género"
                  value={getLabel(genderOptions as any, resident.gender)}
                />
                <DataRow
                  icon={<HeartPulse className="size-4" />}
                  label="Estado Civil"
                  value={getLabel(
                    civilStatusOptions as any,
                    resident.civilStatus,
                  )}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                Contacto
              </h3>
              <div className="grid gap-4">
                <DataRow
                  icon={<Phone className="size-4" />}
                  label="Teléfono"
                  value={resident.phone || "No especificado"}
                />
                <DataRow
                  icon={<Mail className="size-4" />}
                  label="Correo"
                  value={resident.email || "No especificado"}
                />
              </div>
            </div>

            {/* Socio-Education Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                Estatus Socio-Educativo
              </h3>
              <div className="grid gap-4">
                <DataRow
                  icon={<GraduationCap className="size-4" />}
                  label="Educación"
                  value={getLabel(
                    educationLevelOptions as any,
                    resident.educationLevel,
                  )}
                />
                <DataRow
                  icon={<Briefcase className="size-4" />}
                  label="Ocupación"
                  value={
                    resident.occupation ||
                    (resident.isWorking ? "Trabajador" : "No trabaja")
                  }
                />
                <div className="flex gap-2 pt-1">
                  {resident.isStudying && (
                    <Badge
                      variant="outline"
                      className="bg-sky-500/5 text-sky-600 border-sky-500/20"
                    >
                      Estudiante
                    </Badge>
                  )}
                  {resident.isWorking && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                    >
                      Empleado
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Health & Others */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                Salud y Vulnerabilidad
              </h3>
              <div className="grid gap-4">
                <div className="space-y-3">
                  <ConditionBadge
                    condition={resident.hasDisability}
                    label="Posee Discapacidad"
                    icon={<Activity className="size-3" />}
                    variant="destructive"
                  />
                  <ConditionBadge
                    condition={resident.isPregnant}
                    label="Embarazo en curso"
                    icon={<Baby className="size-3" />}
                    variant="warning"
                  />
                </div>

                {resident.serialCarnet && (
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/40 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Carnet de la Patria
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-mono">
                        Serial: {resident.serialCarnet}
                      </p>
                      <p className="text-xs font-mono">
                        Código: {resident.codeCarnet}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 flex justify-end items-center border-t border-border/40">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-primary opacity-60">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground/90">{value}</p>
      </div>
    </div>
  );
}

function ConditionBadge({
  condition,
  label,
  icon,
  variant = "default",
}: {
  condition: boolean;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "warning" | "success";
}) {
  if (!condition) return null;

  const styles = {
    default: "bg-primary/5 text-primary border-primary/10",
    destructive: "bg-red-500/5 text-red-600 border-red-500/10",
    warning: "bg-amber-500/5 text-amber-600 border-amber-500/10",
    success: "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${styles[variant]}`}
    >
      {icon}
      {label}
    </div>
  );
}
