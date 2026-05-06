"use client";

import { updateBusinessAction } from "@/actions/businesses";
import { BusinessForm } from "@/components/businesses/business-form";
import { BusinessFormValues } from "@/lib/validator/businesses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditBusinessClientProps {
  initialData: Partial<BusinessFormValues>;
}

export function EditBusinessClient({ initialData }: EditBusinessClientProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: BusinessFormValues) => {
      const result = await updateBusinessAction(initialData.id!, values);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Emprendimiento actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["businesses", initialData.id],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el emprendimiento");
    },
  });

  const handleSubmit = async (values: BusinessFormValues) => {
    const result = await mutation.mutateAsync(values);
    return {
      success: result.success,
    };
  };

  return (
    <BusinessForm
      onSubmit={handleSubmit}
      initialData={initialData}
      resetAfterSubmit={false}
    />
  );
}
