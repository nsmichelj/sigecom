"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddResidentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddResidentLinkDialog({
  open,
  onOpenChange,
}: AddResidentLinkDialogProps) {
  const router = useRouter();

  const handleSelection = (url: string) => {
    onOpenChange(false);
    router.push(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-25 p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/40">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <UserPlus className="size-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Agregar Habitante
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Categorice el registro para continuar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground px-2">
            Para mantener el orden del censo, los habitantes deben estar
            vinculados a una familia. ¿Desea registrar una familia completamente
            nueva o agregar el habitante a una ya existente?
          </p>

          <div className="grid gap-3">
            <button
              onClick={() => handleSelection("/dashboard/family/create")}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 transition-all text-left group"
            >
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <Users className="size-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Nueva Familia
                </h4>
                <p className="text-xs text-muted-foreground">
                  Inicia el proceso de censo para un nuevo hogar completo.
                </p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleSelection("/dashboard/family")}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 transition-all text-left group"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Users className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  Familia Existente
                </h4>
                <p className="text-xs text-muted-foreground">
                  Busca una familia registrada para añadir un nuevo integrante.
                </p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 bg-muted/30 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-semibold"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
