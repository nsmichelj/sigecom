"use client";

import { deleteNewsAction, getNewsAction } from "@/actions/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Edit,
  Eye,
  FileText,
  ImageIcon,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export function NewsList() {
  const queryClient = useQueryClient();
  const {
    data: news,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data: news, success } = await getNewsAction();
      if (!success || !news) {
        throw new Error("Error al obtener las noticias");
      }
      return news;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteNewsAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Noticia eliminada");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar la noticia");
    },
  });

  if (isLoading) {
    return <Skeleton className="w-full h-100" />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
        Hubo un error al cargar las noticias.
      </div>
    );
  }

  if (news?.length === 0) {
    return (
      <div className="p-12 text-center bg-muted/50 rounded-lg border border-dashed flex flex-col items-center gap-3">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">No hay noticias</h3>
          <p className="text-sm text-muted-foreground">
            Aún no has creado ninguna noticia para la comunidad.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/dashboard/news/create">Crear primera noticia</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Portada</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-4 h-4 opacity-50" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {item.title}
                <div className="text-xs text-muted-foreground truncate max-w-62 mt-1">
                  /{item.slug}
                </div>
              </TableCell>
              <TableCell>
                {item.isPublished ? (
                  <Badge
                    variant="default"
                    className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  >
                    Publicado
                  </Badge>
                ) : (
                  <Badge variant="secondary">Borrador</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(item.createdAt), "dd MMM yyyy", {
                    locale: es,
                  })}
                </div>
                {item.publishedAt && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Pub:{" "}
                    {format(new Date(item.publishedAt), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/news/${item.id}`}>
                        <Eye />
                        Ver detalle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/news/${item.id}/edit`}>
                        <Edit />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      onClick={() => {
                        deleteMutation.mutate(item.id);
                      }}
                    >
                      <Trash2 />
                      Eliminar Noticia
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
