"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { addNoteAction, addLinkAction } from "./actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddResourceDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("note");

  async function handleAddNote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addNoteAction(projectId, formData.get("title") as string, formData.get("content") as string);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Note added"); setOpen(false); }
  }

  async function handleAddLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addLinkAction(projectId, formData.get("title") as string, formData.get("url") as string, formData.get("description") as string);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Link added"); setOpen(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors bg-transparent border-none p-0 cursor-pointer">
        <Plus className="h-4 w-4" />
        Add Resource
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="note">Note</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="note">
            <form onSubmit={handleAddNote} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" required autoFocus />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea name="content" required className="min-h-[100px] resize-none" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">Add Note</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="link">
            <form onSubmit={handleAddLink} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input name="url" type="url" required placeholder="https://" autoFocus />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input name="description" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">Add Link</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="file">
            <div className="py-8 text-center text-sm text-zinc-500 border rounded-md border-dashed mt-4">
              File upload MVP not fully implemented. <br /> (Use drag & drop or simple file inputs here in prod)
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
