import { randomUUID } from "crypto";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function uploadFile({
  file,
  presignedUrl,
  onProgress,
}: {
  file: File;
  presignedUrl: string;
  onProgress?: (progress: UploadProgress) => void;
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress?.(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve("Successfully Upload");
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export function generateFileKey({
  originalFilename,
  prefix = "",
}: {
  originalFilename: string;
  prefix?: string;
}): string {
  const timestamp = Date.now();
  const extension = originalFilename.split(".").pop();

  return `${prefix}${timestamp}-${randomUUID()}.${extension}`;
}

export function getUrl(fileKey: string) {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_ENDPOINT}/${fileKey}`;
}
