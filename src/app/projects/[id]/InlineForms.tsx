"use client";

import { useState, useRef } from "react";
import { addNoteAction, addLinkAction, addFileAction } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

export function InlineNoteForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  async function handleAdd() {
    if (!content.trim()) return;
    setLoading(true);
    const res = await addNoteAction(projectId, "Note", content);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added"); setContent(""); }
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea 
        placeholder="Write a note..." 
        className="min-h-[80px] resize-none bg-white border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-zinc-900 shadow-sm"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleAdd();
          }
        }}
        disabled={loading}
      />
      <div className="flex justify-end mt-1">
        <Button size="sm" onClick={handleAdd} disabled={!content.trim() || loading} className="bg-zinc-900 text-white font-sans h-8 px-3 text-xs shadow-none">Add Note</Button>
      </div>
    </div>
  );
}

export function InlineLinkForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  async function handleAdd() {
    if (!url.trim()) return;
    setLoading(true);
    const res = await addLinkAction(projectId, caption.trim() || url, url, caption);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added"); setUrl(""); setCaption(""); }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-zinc-200 rounded-lg shadow-sm">
      <Input 
        placeholder="https://..." 
        value={url}
        onChange={e => setUrl(e.target.value)}
        disabled={loading}
        className="bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-900 h-9"
      />
      <Input 
        placeholder="Caption or note about this link..." 
        value={caption}
        onChange={e => setCaption(e.target.value)}
        disabled={loading}
        className="bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-900 h-9"
      />
      <div className="flex justify-end mt-1">
        <Button size="sm" onClick={handleAdd} disabled={!url.trim() || loading} className="bg-zinc-900 text-white font-sans h-8 px-3 text-xs shadow-none">Add Link</Button>
      </div>
    </div>
  );
}

export function InlineFileForm({ projectId }: { projectId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    // Dummy implementation for MVP - in a real app, upload to Vercel Blob or S3
    const res = await addFileAction(projectId, file.name, "uploaded-file-path-dummy", file.size, file.type);
    setLoading(false);
    
    if (res.error) toast.error(res.error);
    else toast.success("File uploaded");
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="w-full py-6 border border-dashed border-zinc-300 bg-zinc-50/50 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50 transition-colors shadow-sm"
      >
        <Upload className="h-5 w-5 mb-2 text-zinc-400" />
        <span className="text-sm font-medium">{loading ? "Uploading..." : "Click to upload file"}</span>
      </button>
    </div>
  );
}
