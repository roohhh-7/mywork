"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGlobalNoteAction(title: string, content: string) {
  if (!title || !content) return { error: "Title and content are required" };
  const note = await prisma.note.create({
    data: { title, content } // projectId is null
  });
  revalidatePath("/notes");
  return { note, error: undefined };
}

export async function updateGlobalNoteAction(id: string, data: { title?: string, content?: string }) {
  await prisma.note.update({ where: { id }, data });
  revalidatePath("/notes");
  return { error: undefined };
}

export async function updateGlobalNoteStatus(id: string, status: string) {
  await prisma.note.update({ where: { id }, data: { status } });
  revalidatePath("/notes");
  return { error: undefined };
}

export async function deleteGlobalNoteAction(id: string) {
  await prisma.note.delete({ where: { id }});
  revalidatePath("/notes");
  return { error: undefined };
}

export async function archiveGlobalNoteAction(id: string, isArchived: boolean) {
  await prisma.note.update({ where: { id }, data: { isArchived }});
  revalidatePath("/notes");
  return { error: undefined };
}
