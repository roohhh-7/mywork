"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addProgressAction } from "./actions";
import { toast } from "sonner";

export function AddProgressForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    const res = await addProgressAction(content);
    setLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      setContent("");
      toast.success("Added progress");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 relative">
      <div className="absolute left-3 text-zinc-400">
        <Plus className="h-5 w-5" />
      </div>
      <Input 
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What did you accomplish?"
        className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-900"
        disabled={loading}
      />
      <Button type="submit" disabled={!content.trim() || loading} className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800">
        Add
      </Button>
    </form>
  );
}
