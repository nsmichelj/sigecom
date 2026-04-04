"use client";

import { getSectorsAction } from "@/actions/sectors";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { residenceFormSchema } from "@/lib/validator/family";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Home,
  Key,
  Loader,
  ShieldCheck,
  Users,
} from "lucide-react";
import { HousingStatus } from "../resident-form-fields";

const housingStatusOptions: {
  value: HousingStatus;
  label: string;
  icon: any;
  description: string;
}[] = [
  {
    value: "owned",
    label: "Propia",
    icon: Home,
    description: "La vivienda es propiedad familiar",
  },
  {
    value: "rented",
    label: "Alquilada",
    icon: Key,
    description: "Arrendada a un tercero",
  },
  {
    value: "shared",
    label: "Arrimado / Compartida",
    icon: Users,
    description: "Comparte espacio con otra familia",
  },
  {
    value: "custody",
    label: "Al cuidado / Comodato",
    icon: ShieldCheck,
    description: "Bajo cuidado temporal",
  },
];

interface SectorFormProps {
  initialData?: Partial<residenceFormSchema>;
  onNext?: (values: residenceFormSchema) => void;
}

export function StepResidenceForm({ initialData, onNext }: SectorFormProps) {
  const form = useForm({
    defaultValues: {
      id: initialData?.id,
      number: initialData?.number ?? ("" as any as number),
      sectorId: initialData?.sectorId ?? "",
      housingStatus: initialData?.housingStatus ?? "owned",
    } as residenceFormSchema,
    validators: {
      onSubmit: residenceFormSchema,
    },
    onSubmit: ({ value }) => {
      onNext?.(value);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const result = await getSectorsAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const sectors = data || [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-10"
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Datos de la Vivienda
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg font-light">
          Indique la ubicación exacta e información sobre el estatus de la
          residencia para localizar a la familia correctamente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="sectorId">
          {(field) => (
            <Field>
              <Label>Sector Comunitario</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value);
                  form.setFieldValue(
                    "sectorName",
                    sectors.find((s) => s.id === value)?.name ?? "",
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el sector..." />
                </SelectTrigger>

                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      <span className="flex items-center gap-2">
                        <Loader className="size-4 animate-spin text-primary" />{" "}
                        Cargando...
                      </span>
                    </SelectItem>
                  ) : isError ? (
                    <SelectItem value="error" disabled>
                      Error al cargar sectores
                    </SelectItem>
                  ) : sectors.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No hay sectores registrados
                    </SelectItem>
                  ) : (
                    sectors.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="number">
          {(field) => (
            <Field>
              <Label>Número de Casa</Label>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === ""
                        ? ("" as any)
                        : Number(e.target.value),
                    )
                  }
                  min={0}
                />
                <InputGroupAddon align="inline-start">
                  <span className="text-muted-foreground font-medium">Nº</span>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </div>

      <Field>
        <Label>Estatus de la Vivienda</Label>
        <form.Field name="housingStatus">
          {(field) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {housingStatusOptions.map((option) => {
                const isSelected = field.state.value === option.value;
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    onClick={() => field.handleChange(option.value)}
                    className={cn(
                      "relative flex flex-col p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ease-in-out group",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                        : "border-border/60 bg-background/30 hover:border-border hover:bg-background/80",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <span
                        className={cn(
                          "font-semibold transition-colors",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-auto">
                      {option.description}
                    </p>

                    <div
                      className={cn(
                        "absolute top-4 right-4 size-2.5 rounded-full transition-transform duration-300",
                        isSelected
                          ? "bg-primary scale-100"
                          : "bg-transparent scale-0",
                      )}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </form.Field>
      </Field>

      <div className="flex justify-end pt-8 border-t border-border/40">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              variant="default"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Siguiente paso
                  <ChevronRight />
                </>
              )}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
