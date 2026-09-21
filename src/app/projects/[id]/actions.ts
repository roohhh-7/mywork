"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addNoteAction(projectId: string, title: string, content: string, color?: string) {
  if (!title || !content) return { error: "Title and content are required" };
  const note = await prisma.note.create({
    data: { projectId, title, content, color: color || null }
  });
  revalidatePath(`/projects/${projectId}`);
  return { note };
}

export async function addLinkAction(projectId: string, title: string, url: string, description?: string, color?: string) {
  if (!title || !url) return { error: "Title and URL are required" };
  const link = await prisma.link.create({
    data: { projectId, title, url, description: description || null, color: color || null }
  });
  revalidatePath(`/projects/${projectId}`);
  return { link };
}

export async function addFileAction(projectId: string, name: string, fileDataUrl: string, fileSize: number, fileType: string) {
  // In a real app we'd upload this to Supabase Storage or S3
  // Here we just simulate storing it by storing the Data URL (bad for DB size in prod, fine for this quick MVP logic demonstration).
  // Ideally we'd save to public/uploads
  
  const file = await prisma.file.create({
    data: {
      projectId,
      name,
      fileSize,
      fileType,
      storagePath: fileDataUrl, // storing tiny string for now
    }
  });
  revalidatePath(`/projects/${projectId}`);
  return { file };
}
