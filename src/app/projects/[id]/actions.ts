"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addNoteAction(projectId: string, title: string, content: string, color?: string) {
  if (!title || !content) return { error: "Title and content are required" };
  const note = await prisma.note.create({
    data: { projectId, title, content, color: color || null }
  });
  revalidatePath(`/projects/${projectId}`);
  return { note, error: undefined };
}

export async function addLinkAction(projectId: string, title: string, url: string, description?: string, color?: string) {
  if (!title || !url) return { error: "Title and URL are required" };
  const link = await prisma.link.create({
    data: { projectId, title, url, description: description || null, color: color || null }
  });
  revalidatePath(`/projects/${projectId}`);
  return { link, error: undefined };
}

export async function addFileAction(projectId: string, name: string, fileDataUrl: string, fileSize: number, fileType: string) {
  if (!name || !fileDataUrl) return { error: "File data is required" };
  
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
  return { file, error: undefined };
}

export async function updateNoteStatus(projectId: string, noteId: string, status: string) {
  await prisma.note.update({
    where: { id: noteId },
    data: { status }
  });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateLinkStatus(projectId: string, linkId: string, status: string) {
  await prisma.link.update({
    where: { id: linkId },
    data: { status }
  });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateFileStatus(projectId: string, fileId: string, status: string) {
  await prisma.file.update({
    where: { id: fileId },
    data: { status }
  });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}
