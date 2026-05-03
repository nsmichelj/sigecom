"use server";
import { auth } from "@/lib/auth";
import { r2 } from "@/lib/r2";
import { generateFileKey } from "@/lib/r2/client";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";

export async function createPresignedUploadUrl({
  filename,
  contentType = "application/octet-stream",
  expiresIn = 60,
  ...options
}: Omit<PutObjectCommandInput, "Key" | "Bucket"> & {
  expiresIn?: number;
  filename: string;
  contentType?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const objectKey = generateFileKey({
    originalFilename: filename,
  });

  const baseUrl = process.env.R2_PUBLIC_ENDPOINT;
  const publicFileUrl = baseUrl ? `${baseUrl}/${objectKey}` : null;

  const command = new PutObjectCommand({
    ...options,
    Bucket: process.env.R2_BUCKET!,
    Key: objectKey,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn });
  return {
    success: true,
    data: {
      signedUrl,
      objectKey,
      publicFileUrl,
    },
  };
}
