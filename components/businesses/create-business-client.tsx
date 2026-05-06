"use client";

import { createBusinessAction } from "@/actions/businesses";
import { BusinessForm } from "@/components/businesses/business-form";
import { BusinessFormValues } from "@/lib/validator/businesses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CreateBusinessClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: BusinessFormValues) => {
      const result = await createBusinessAction(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Emprendimiento creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el emprendimiento");
    },
  });

  const handleSubmit = async (values: BusinessFormValues) => {
    const result = await mutation.mutateAsync(values);
    return {
      success: result.success,
    };
  };

  return <BusinessForm onSubmit={handleSubmit} resetAfterSubmit />;
}
