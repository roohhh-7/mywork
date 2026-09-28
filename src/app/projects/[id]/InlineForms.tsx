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
    <div className="flex flex-col sm:flex-row gap-2">
      <Input 
        placeholder="New note headline..." 
        className="flex-1 bg-card border-border text-sm shadow-sm h-9 text-foreground placeholder:text-muted-foreground"
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
      <Button size="sm" onClick={handleAdd} disabled={!title.trim() || loading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans h-9 px-4 text-xs shadow-none whitespace-nowrap">
        Create Note
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
