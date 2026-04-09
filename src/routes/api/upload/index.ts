import { type RequestHandler } from "@builder.io/qwik-city";
import { validateSession } from "~/lib/auth";
import { put } from "@vercel/blob";

export const onPost: RequestHandler = async (event) => {
  // 1. Check authentication
  const session = validateSession(event);
  if (!session) {
    event.status(401);
    event.json(401, { error: "No autorizado" });
    return;
  }

  try {
    const formData = await event.request.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      event.status(400);
      event.json(400, { error: "No se proporcionó ningún archivo" });
      return;
    }

    // 2. Validate file type
    if (!file.type.startsWith("image/")) {
      event.status(400);
      event.json(400, { error: "El archivo debe ser una imagen" });
      return;
    }

    // 3. Generate unique filename (keep original extension)
    const ext = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `hero-${Date.now()}.${ext}`;

    // 4. Save file using Vercel Blob
    const token = event.env.get("BLOB_READ_WRITE_TOKEN") || process.env.BLOB_READ_WRITE_TOKEN;
    const blob = await put(`uploads/${uniqueFilename}`, file, {
      access: "public",
      ...(token ? { token } : {}),
    });

    // 5. Return public URL
    const publicUrl = blob.url;
    event.json(200, { url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    event.status(500);
    event.json(500, { error: "Error al procesar la imagen" });
  }
};
