"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function fetchOgImage(url: string) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
    if (!res.ok) return null;
    const html = await res.text();
    const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
    if (ogMatch && ogMatch[1]) return ogMatch[1].startsWith('http') ? ogMatch[1] : new URL(ogMatch[1], url).toString();
    const twMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
    if (twMatch && twMatch[1]) return twMatch[1].startsWith('http') ? twMatch[1] : new URL(twMatch[1], url).toString();
  } catch (e) {
    console.error("Failed to fetch og:image", e);
  }
  return null;
}

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
  const imageUrl = await fetchOgImage(url);
  const link = await prisma.link.create({
    data: { projectId, title, url, description: description || null, color: color || null, imageUrl }
  });
  revalidatePath(`/projects/${projectId}`);
  return { link, error: undefined };
}

export async function addFileAction(projectId: string, name: string, fileDataUrl: string, fileSize: number, fileType: string) {
  if (!name || !fileDataUrl) return { error: "File data is required" };
  const file = await prisma.file.create({
    data: { projectId, name, fileSize, fileType, storagePath: fileDataUrl }
  });
  revalidatePath(`/projects/${projectId}`);
  return { file, error: undefined };
}

export async function updateNoteStatus(projectId: string, noteId: string, status: string) {
  await prisma.note.update({ where: { id: noteId }, data: { status } });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateLinkStatus(projectId: string, linkId: string, status: string) {
  await prisma.link.update({ where: { id: linkId }, data: { status } });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateFileStatus(projectId: string, fileId: string, status: string) {
  await prisma.file.update({ where: { id: fileId }, data: { status } });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateNoteAction(projectId: string, id: string, data: { content?: string }) {
  await prisma.note.update({ where: { id }, data });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function updateLinkContentAction(projectId: string, id: string, data: { url?: string; description?: string }) {
  let imageUrl = undefined;
  if (data.url) {
    imageUrl = await fetchOgImage(data.url) || null;
  }
  await prisma.link.update({ where: { id }, data: { ...data, ...(imageUrl !== undefined && { imageUrl }) } });
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function deleteNoteAction(projectId: string, id: string) {
  await prisma.note.delete({ where: { id }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function deleteLinkAction(projectId: string, id: string) {
  await prisma.link.delete({ where: { id }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function deleteFileAction(projectId: string, id: string) {
  await prisma.file.delete({ where: { id }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function archiveNoteAction(projectId: string, id: string, isArchived: boolean) {
  await prisma.note.update({ where: { id }, data: { isArchived }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function archiveLinkAction(projectId: string, id: string, isArchived: boolean) {
  await prisma.link.update({ where: { id }, data: { isArchived }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function archiveFileAction(projectId: string, id: string, isArchived: boolean) {
  await prisma.file.update({ where: { id }, data: { isArchived }});
  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}
