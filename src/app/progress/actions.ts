"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProgressAction(content: string, projectId?: string) {
  if (!content) return { error: "Content is required" };

  const item = await prisma.progressItem.create({
    data: {
      content,
      projectId: projectId || null,
      completed: true,
      completedAt: new Date(),
    }
  });

  revalidatePath("/");
  revalidatePath("/progress");
  return { item };
}
