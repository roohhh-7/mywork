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
  return { item, error: undefined };
}

export async function updateProgressStatus(id: string, status: string) {
  await prisma.progressItem.update({
    where: { id },
    data: { 
      status,
      // If they set it to Complete, we might want to also check the 'completed' checkbox, but let's keep them independent or sync them.
      completed: status === "Complete",
      completedAt: status === "Complete" ? new Date() : null
    }
  });
  revalidatePath("/progress");
  return { error: undefined };
}
