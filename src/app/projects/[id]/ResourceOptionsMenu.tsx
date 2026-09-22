"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, Archive, ArchiveRestore } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ResourceOptionsMenuProps {
  id: string;
  projectId: string;
  type: "note" | "link" | "file";
  isArchived: boolean;
  content?: string;
  url?: string;
  description?: string;
  deleteAction: (projectId: string, id: string) => Promise<{ error?: string }>;
  archiveAction: (projectId: string, id: string, isArchived: boolean) => Promise<{ error?: string }>;
  editNoteAction?: (projectId: string, id: string, data: { content?: string }) => Promise<{ error?: string }>;
  editLinkAction?: (projectId: string, id: string, data: { url?: string; description?: string }) => Promise<{ error?: string }>;
}

export function ResourceOptionsMenu({
  id,
  projectId,
  type,
  isArchived,
  content = "",
  url = "",
  description = "",
  deleteAction,
  archiveAction,
  editNoteAction,
  editLinkAction
}: ResourceOptionsMenuProps) {
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  // Edit states
  const [editContent, setEditContent] = useState(content);
  const [editUrl, setEditUrl] = useState(url);
  const [editDescription, setEditDescription] = useState(description);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this?")) return;
    setLoading(true);
    const res = await deleteAction(projectId, id);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Deleted successfully");
  }

  async function handleArchive() {
    setLoading(true);
    const res = await archiveAction(projectId, id, !isArchived);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success(isArchived ? "Unarchived successfully" : "Archived successfully");
  }

  async function handleEdit() {
    setLoading(true);
    let res: { error?: string } = {};
    if (type === "note" && editNoteAction) {
      res = await editNoteAction(projectId, id, { content: editContent });
    } else if (type === "link" && editLinkAction) {
      let finalUrl = editUrl.trim();
      if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }
      res = await editLinkAction(projectId, id, { url: finalUrl, description: editDescription });
    }
    setLoading(false);
    
    if (res.error) toast.error(res.error);
    else {
      toast.success("Saved successfully");
      setEditOpen(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-900 rounded-md">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40 border-zinc-200 shadow-sm rounded-lg">
          {(type === "note" || type === "link") && (
            <DropdownMenuItem onClick={() => setEditOpen(true)} className="text-xs cursor-pointer">
              <Edit className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleArchive} className="text-xs cursor-pointer">
            {isArchived ? (
              <><ArchiveRestore className="h-3.5 w-3.5 mr-2" /> Unarchive</>
            ) : (
              <><Archive className="h-3.5 w-3.5 mr-2" /> Archive</>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-xs cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit {type === "note" ? "Note" : "Link"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {type === "note" && (
              <Textarea 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[120px] resize-none text-sm"
              />
            )}
            
            {type === "link" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">URL</label>
                  <Input 
                    value={editUrl} 
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">Caption</label>
                  <Input 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)} className="h-8 text-xs font-medium">Cancel</Button>
            <Button size="sm" onClick={handleEdit} disabled={loading} className="h-8 text-xs font-medium bg-zinc-900 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
