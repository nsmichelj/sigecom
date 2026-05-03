"use client";

import { updateNewsAction } from "@/actions/news";
import { NewsForm } from "@/components/news/news-form";
import { NewsFormValues } from "@/lib/validator/news";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditNewsClientProps {
  initialData: Partial<NewsFormValues>;
}

export function EditNewsClient({ initialData }: EditNewsClientProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: NewsFormValues) => {
      const result = await updateNewsAction(initialData.id!, values);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Noticia actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news", initialData.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar la noticia");
    },
  });

  const handleSubmit = async (values: NewsFormValues) => {
    const result = await mutation.mutateAsync(values);
    return {
      success: result.success,
    };
  };

  return (
    <NewsForm
      onSubmit={handleSubmit}
      initialData={initialData}
      resetAfterSubmit={false}
    />
  );
}
