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
  const [title, setTitle] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    setLoading(true);
    // Content can be empty string for now, user will open it to edit
    const res = await addNoteAction(projectId, title.trim(), "");
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added"); setTitle(""); }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        </div>
        <Input 
          placeholder="New note..." 
          className="w-full pl-10 bg-zinc-900/50 border-zinc-800 text-sm h-11 text-zinc-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-700 shadow-none"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          disabled={loading}
        />
      </div>
      <Button size="sm" onClick={handleAdd} disabled={!title.trim() || loading} className="bg-red-500 text-white hover:bg-red-600 font-medium h-11 px-6 rounded-xl shadow-none whitespace-nowrap">
        Create <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Button>
    </div>
  );
}

export function InlineLinkForm({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  async function handleAdd() {
    let finalUrl = url.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }
    
    setLoading(true);
    const res = await addLinkAction(projectId, caption.trim() || finalUrl, finalUrl, caption);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added"); setUrl(""); setCaption(""); }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-lg shadow-sm">
      <Input 
        placeholder="https://..." 
        value={url}
        onChange={e => setUrl(e.target.value)}
        disabled={loading}
        className="bg-background border-border h-9 text-foreground placeholder:text-muted-foreground"
      />
      <Input 
        placeholder="Caption or note about this link..." 
        value={caption}
        onChange={e => setCaption(e.target.value)}
        disabled={loading}
        className="bg-background border-border h-9 text-foreground placeholder:text-muted-foreground"
      />
      <div className="flex justify-end mt-1">
        <Button size="sm" onClick={handleAdd} disabled={!url.trim() || loading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans h-8 px-3 text-xs shadow-none">Add Link</Button>
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
        className="w-full py-6 border border-dashed border-border/80 bg-muted/30 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-border hover:bg-muted/50 transition-colors shadow-sm"
      >
        <Upload className="h-5 w-5 mb-2 text-muted-foreground/70" />
        <span className="text-sm font-medium">{loading ? "Uploading..." : "Click to upload file"}</span>
      </button>
    </div>
  );
}
