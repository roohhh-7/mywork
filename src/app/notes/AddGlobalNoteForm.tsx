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
