"use client";

import { createPresignedUploadUrl } from "@/actions/r2";
import { uploadFile } from "@/lib/r2/client";
import { cn } from "@/lib/utils";
import { CloudUpload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface Props {
  initialImage?: string;
  onFileChange?: (imageUrl?: string) => void;
  title?: string;
  className?: string;
}

export function CoverUpload({ initialImage, onFileChange, title = "" }: Props) {
  const [image, setImage] = useState<string | undefined>(initialImage);
  const [isUploading, setIsUploading] = useState(false);

  const cleanupPreview = (url?: string) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setIsUploading(true);
      setImage(previewUrl);

      try {
        const { data, error } = await createPresignedUploadUrl({
          filename: file.name,
          contentType: file.type,
          ACL: "public-read",
        });

        if (error) {
          throw new Error(error);
        }

        if (data) {
          await uploadFile({
            file: file,
            presignedUrl: data.signedUrl,
          });

          onFileChange?.(data.publicFileUrl ?? "");
        }
      } catch {
        toast.error("No se pudo subir la imagen. Inténtalo de nuevo.");
        setImage(initialImage);
      } finally {
        setIsUploading(false);
        cleanupPreview(previewUrl);
      }
    },
    [onFileChange, initialImage],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: false,
      maxSize: MAX_FILE_SIZE_BYTES,
      onDrop,
      disabled: isUploading,
    });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    cleanupPreview(image);
    setImage(undefined);
    onFileChange?.("");
  };

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  return (
    <div className="relative flex flex-col gap-4 w-full">
      <div
        {...getRootProps()}
        className={cn(
          "aspect-21/9 border-dashed border-border rounded-lg transition-colors cursor-pointer",
          "hover:bg-muted/50 flex flex-col items-center justify-center gap-2",
          isDragActive && "border-primary bg-primary/5",
          isDragReject && "border-destructive",
          image ? "border-none" : "border-2",
        )}
      >
        <input {...getInputProps()} className="sr-only" />
        <div className="relative w-full h-full flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              fill
              sizes="100vw"
              alt="Preview"
              className={cn(
                "h-full w-full object-cover transition-opacity rounded-md",
                isUploading ? "opacity-40" : "opacity-100",
              )}
            />
          ) : (
            <div className="space-y-4 flex items-center justify-center flex-col">
              <div className="bg-muted text-foreground p-3 rounded-full">
                <CloudUpload className="size-6" />
              </div>
              <div className="space-y-1 flex items-center justify-center flex-col">
                <Label>{title}</Label>
                <span className="text-sm text-muted-foreground">
                  Suelte el archivos aquí o haga clic para buscarlo
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG o WEBP • Máx {MAX_FILE_SIZE_MB} MB
                </span>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
      {image && !isUploading && (
        <Button
          className="absolute top-2 right-2 rounded-full size-5"
          variant="destructive"
          size="icon"
          type="button"
          onClick={handleRemove}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
