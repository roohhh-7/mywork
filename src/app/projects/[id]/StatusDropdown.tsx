"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const DEFAULT_STATUSES = ["Not Started", "In Progress", "Complete"];

interface StatusDropdownProps {
  id: string;
  projectId: string;
  currentStatus: string;
  type: "note" | "link" | "file";
  updateAction: (projectId: string, id: string, status: string) => Promise<{ error?: string }>;
}

export function StatusDropdown({ id, projectId, currentStatus, type, updateAction }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customStatus, setCustomStatus] = useState("");
  const [statuses, setStatuses] = useState(() => {
    // Include the current status if it's not in the defaults
    if (currentStatus && !DEFAULT_STATUSES.includes(currentStatus)) {
      return [...DEFAULT_STATUSES, currentStatus];
    }
    return DEFAULT_STATUSES;
  });

  async function handleSelect(status: string) {
    if (status === currentStatus) {
      setOpen(false);
      return;
    }
    setLoading(true);
    const res = await updateAction(projectId, id, status);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      setOpen(false);
    }
  }

  async function handleAddCustom() {
    if (!customStatus.trim()) return;
    const newStatus = customStatus.trim();
    if (!statuses.includes(newStatus)) {
      setStatuses([...statuses, newStatus]);
    }
    await handleSelect(newStatus);
    setCustomStatus("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-6 px-2 text-[11px] font-medium rounded-full bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-none"
            disabled={loading}
            onClick={(e) => {
              // Prevent link clicks if inside an anchor tag
              e.preventDefault();
            }}
          />
        }
      >
        {currentStatus || "Not Started"}
        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2 shadow-sm border-zinc-200" align="start"
        onClick={(e) => e.preventDefault()} // Prevent link clicks
      >
        <div className="space-y-1 mb-2">
          {statuses.map((status) => (
            <div
              key={status}
              onClick={() => handleSelect(status)}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-zinc-100 transition-colors",
                currentStatus === status ? "font-medium text-zinc-900 bg-zinc-50" : "text-zinc-700"
              )}
            >
              <Check
                className={cn(
                  "mr-2 h-3 w-3",
                  currentStatus === status ? "opacity-100" : "opacity-0"
                )}
              />
              {status}
            </div>
          ))}
        </div>
        <div className="flex items-center border-t pt-2 mt-2">
          <Input
            className="h-7 text-xs shadow-none border-zinc-200 rounded-sm focus-visible:ring-1 focus-visible:ring-zinc-900"
            placeholder="Custom status..."
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 ml-1 shrink-0" 
            onClick={handleAddCustom}
            disabled={!customStatus.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
