"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { updateGlobalNoteAction, updateGlobalNoteStatus, deleteGlobalNoteAction, archiveGlobalNoteAction } from "./actions";

// Reusable components
import { StatusDropdown } from "@/app/projects/[id]/StatusDropdown";
import { ResourceOptionsMenu } from "@/app/projects/[id]/ResourceOptionsMenu";

interface Note {
  id: string;
  projectId: string | null;
  title: string;
  content: string;
  status: string;
  isArchived: boolean;
  updatedAt: Date;
}

export function GlobalNoteCard({ note }: { note: Note }) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  async function handleSave() {
    setLoading(true);
    const res = await updateGlobalNoteAction(note.id, { title, content });
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Note saved");
      setEditOpen(false);
    }
  }

  // Strip HTML tags for the preview safely
  const previewText = content.replace(/<[^>]*>?/gm, ' ').trim();

  return (
    <>
      <div 
        onClick={() => setEditOpen(true)}
        className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:border-zinc-300 transition-colors cursor-pointer aspect-square flex flex-col group relative"
      >
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <h3 className="font-semibold text-zinc-900 text-[15px] mb-2 line-clamp-2 leading-snug pr-6">{note.title}</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed break-words overflow-hidden text-ellipsis line-clamp-[6] opacity-80">
            {previewText || "Empty note..."}
          </p>
          {/* fade out bottom of text */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between z-10" onClick={e => e.stopPropagation()}>
          <StatusDropdown 
            currentStatus={note.status} 
            updateAction={(status) => updateGlobalNoteStatus(note.id, status)} 
          />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ResourceOptionsMenu 
              id={note.id} 
              projectId="global" // dummy since we map actions manually
              type="note" 
              isArchived={note.isArchived} 
              content={note.content} 
              title={note.title}
              deleteAction={() => deleteGlobalNoteAction(note.id)} 
              archiveAction={(pid, id, isArchived) => archiveGlobalNoteAction(note.id, isArchived)}
            />
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0 bg-zinc-50/50">
          <DialogHeader className="p-4 border-b border-zinc-200 bg-white">
            <DialogTitle className="sr-only">Edit Note</DialogTitle>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="text-xl font-bold h-12 shadow-none border-transparent focus-visible:ring-0 bg-transparent px-2 placeholder:text-zinc-300"
              placeholder="Note title..."
            />
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden p-4 md:p-6 bg-zinc-50/50">
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <DialogFooter className="p-4 border-t border-zinc-200 bg-white">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)} className="h-8">Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={loading} className="h-8 bg-zinc-900">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
