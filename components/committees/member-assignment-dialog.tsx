"use client";

import { assignMemberAction } from "@/actions/committees";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memberAssignmentSchema } from "@/lib/validator/committees";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResidentSelector } from "./resident-selector";

interface MemberAssignmentDialogProps {
  committeeId: string;
}

export function MemberAssignmentDialog({
  committeeId,
}: MemberAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: memberAssignmentSchema) => {
      const result = await assignMemberAction({
        ...values,
        role: values.role as "main" | "substitute",
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Miembro asignado correctamente");
      queryClient.invalidateQueries({ queryKey: ["committee", committeeId] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      committeeId: committeeId,
      residentId: "",
      role: "substitute",
    } as memberAssignmentSchema,
    validators: {
      onChange: memberAssignmentSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus />
          Asignar Miembro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Asignar Nuevo Miembro</DialogTitle>
          <DialogDescription>
            Selecciona un habitante y el rol que desempeñará en este comité.
            Recuerda que solo puede haber un miembro Principal.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 mt-4"
        >
          <FieldGroup>
            <form.Field
              name="residentId"
              children={(field) => (
                <div className="space-y-2">
                  <Label>Habitante</Label>
                  <ResidentSelector
                    selectedId={field.state.value}
                    onSelect={(id) => field.handleChange(id)}
                  />
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              )}
            />

            <form.Field
              name="role"
              children={(field) => (
                <div className="space-y-2">
                  <Label>Rol en el Comité</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">
                        Principal (Responsable)
                      </SelectItem>
                      <SelectItem value="substitute">Suplente</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Asignando..." : "Asignar al Comité"}
                  </Button>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
