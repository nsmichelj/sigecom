"use client";

import { createNewsAction } from "@/actions/news";
import { NewsForm } from "@/components/news/news-form";
import { NewsFormValues } from "@/lib/validator/news";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CreateNewsClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: NewsFormValues) => {
      const result = await createNewsAction(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Noticia creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear la noticia");
    },
  });

  const handleSubmit = async (values: NewsFormValues) => {
    const result = await mutation.mutateAsync(values);
    return {
      success: result.success,
    };
  };

  return <NewsForm onSubmit={handleSubmit} resetAfterSubmit />;
}
