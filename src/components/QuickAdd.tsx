"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileText, Link, File, CheckCircle, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden sm:max-w-[500px]">
          <DialogTitle className="sr-only">Quick Add</DialogTitle>
          <Command className="flex w-full flex-col bg-white">
            <Command.Input 
              placeholder="What do you want to add?" 
              className="w-full border-none px-4 py-4 outline-none text-sm"
              autoFocus
            />
            <Command.List className="max-h-[300px] overflow-y-auto p-2 border-t">
              <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                No results found.
              </Command.Empty>

              <Command.Group heading="Create New" className="text-xs font-medium text-zinc-500 p-2">
                <Command.Item 
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 aria-selected:bg-zinc-100 cursor-pointer mt-1"
                  onSelect={() => {
                    setOpen(false);
                    // trigger note creation (could use query param or another dialog)
                  }}
                >
                  <FileText className="h-4 w-4 text-zinc-400" />
                  Note
                </Command.Item>
                <Command.Item 
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 aria-selected:bg-zinc-100 cursor-pointer mt-1"
                  onSelect={() => setOpen(false)}
                >
                  <Link className="h-4 w-4 text-zinc-400" />
                  Link
                </Command.Item>
                <Command.Item 
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 aria-selected:bg-zinc-100 cursor-pointer mt-1"
                  onSelect={() => setOpen(false)}
                >
                  <File className="h-4 w-4 text-zinc-400" />
                  File
                </Command.Item>
                <Command.Item 
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 aria-selected:bg-zinc-100 cursor-pointer mt-1"
                  onSelect={() => {
                    setOpen(false);
                    router.push("/progress");
                  }}
                >
                  <CheckCircle className="h-4 w-4 text-zinc-400" />
                  Progress
                </Command.Item>
                <Command.Item 
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 aria-selected:bg-zinc-100 cursor-pointer mt-1"
                  onSelect={() => {
                    setOpen(false);
                    router.push("/projects");
                  }}
                >
                  <FolderKanban className="h-4 w-4 text-zinc-400" />
                  Project
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
