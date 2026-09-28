"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ResourceOptionsMenu } from "./ResourceOptionsMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { updateNoteAction, deleteNoteAction, archiveNoteAction } from "./actions";

interface Note {
  id: string;
  projectId: string | null;
  title: string;
  content: string;
  status: string;
  isArchived: boolean;
  updatedAt: Date;
}

export function NoteCard({ note, projectId }: { note: Note, projectId: string }) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  async function handleSave() {
    setLoading(true);
    const res = await updateNoteAction(projectId, note.id, { title, content });
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
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer aspect-square flex flex-col group relative"
      >
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px] mb-2 line-clamp-2 leading-snug pr-6">{note.title}</h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed break-words overflow-hidden text-ellipsis line-clamp-[6] opacity-80">
            {previewText || "Empty note..."}
          </p>
          {/* fade out bottom of text */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between z-10" onClick={e => e.stopPropagation()}>
          <span className="text-[12px] text-zinc-400 font-medium">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ResourceOptionsMenu 
              id={note.id} projectId={projectId} type="note" isArchived={note.isArchived} content={note.content} title={note.title}
              deleteAction={deleteNoteAction} archiveAction={archiveNoteAction}
            />
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0 bg-zinc-50/50 dark:bg-zinc-900/50">
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <DialogTitle className="sr-only">Edit Note</DialogTitle>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="text-xl font-bold h-12 shadow-none border-transparent focus-visible:ring-0 bg-transparent px-2 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 dark:text-zinc-100"
              placeholder="Note title..."
            />
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden p-4 md:p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <DialogFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)} className="h-8 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={loading} className="h-8 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
