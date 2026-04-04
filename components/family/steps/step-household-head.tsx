import { Button } from "@/components/ui/button";
import { familyMemberSchema } from "@/lib/validator/family";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { ResidentFormFields, useResidentForm } from "../resident-form-fields";

interface StepHouseholdHeadFormProps {
  initialData?: Partial<familyMemberSchema>;
  onNext?: (values: familyMemberSchema) => void;
  onPrevious?: () => void;
}

export function StepHouseholdHead({
  initialData,
  onNext,
  onPrevious,
}: StepHouseholdHeadFormProps) {
  const form = useResidentForm({
    initialData: {
      ...initialData,
      relationship: "headOfFamily",
      isHeadOfFamily: true,
    } as familyMemberSchema,
    onSubmit: async (values) => {
      onNext?.(values);
    },
  });

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
        <h2 className="text-3xl font-black tracking-tight">
          Jefatura de Hogar
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg font-light">
          Identifique y registre los datos de la persona que representa el
          núcleo familiar.
        </p>
      </div>

      <ResidentFormFields form={form} isHeadOfFamily />

      <div className="flex justify-between pt-8 border-t border-border/40">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => onPrevious?.()}
        >
          <ChevronLeft />
          Anterior
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || isSubmitting}
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
