"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProjectAction } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectCardMenuProps {
  projectId: string;
  projectName: string;
  redirectOnDelete?: boolean;
  variant?: "card" | "header";
}

export function ProjectCardMenu({
  projectId,
  projectName,
  redirectOnDelete = false,
  variant = "card",
}: ProjectCardMenuProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        `Are you sure you want to delete "${projectName}"? This will permanently delete the project and all its notes, links, and files.`
      )
    ) {
      return;
    }

    setLoading(true);
    const res = await deleteProjectAction(projectId);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Project deleted");
      if (redirectOnDelete) {
        router.push("/projects");
      } else {
        router.refresh();
      }
    }
  }

  const triggerClass =
    variant === "header"
      ? "h-8 w-8 text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded-md transition-colors"
      : "h-6 w-6 text-zinc-400 hover:text-zinc-900 rounded-md opacity-60 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity";

  return (
    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              className={triggerClass}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40 border-zinc-200 shadow-sm rounded-lg">
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={loading}
            className="text-xs cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
