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
    const res = await addGlobalNoteAction(title.trim(), "");
    setLoading(false);
    if (res.error) toast.error(res.error);
    else { toast.success("Added Note"); setTitle(""); }
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
