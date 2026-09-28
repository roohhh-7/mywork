"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProject(formData);
    
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Project created");
      setOpen(false);
      if (res.project) {
        router.push(`/projects/${res.project.id}`);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 bg-zinc-900 text-white hover:bg-zinc-800 h-9 px-4">
        <Plus className="h-4 w-4" />
        Create Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input id="name" name="name" placeholder="e.g. Intent Terminal" required autoFocus />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea id="description" name="description" placeholder="Short description..." className="resize-none" rows={3} />
          </div>
          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium">Accent Color (optional)</label>
            <div className="flex gap-2">
              {["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#71717a"].map(c => (
                <label key={c} className="cursor-pointer relative">
                  <input type="radio" name="color" value={c} className="peer sr-only" />
                  <div className="w-6 h-6 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-zinc-900" style={{ backgroundColor: c }} />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
