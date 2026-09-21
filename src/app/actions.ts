"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  
  if (!name) return { error: "Name is required" };

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      color: color || null,
      status: "Active",
    }
  });

  revalidatePath("/");
  revalidatePath("/projects");
  return { project };
}
