"use client";

import { useState } from "react";
import { addGlobalNoteAction } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddGlobalNoteForm() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    setLoading(true);
    // Content can be empty string for now, user will open it to edit
    const res = await addGlobalNoteAction(title.trim(), "<p>Start typing...</p>");
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added Note"); setTitle(""); }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input 
        placeholder="New note headline..." 
        className="flex-1 bg-white border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-zinc-900 shadow-sm h-9"
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
      <Button size="sm" onClick={handleAdd} disabled={!title.trim() || loading} className="bg-zinc-900 text-white font-sans h-9 px-4 text-xs shadow-none whitespace-nowrap">
        Create Note
      </Button>
    </div>
  );
}
