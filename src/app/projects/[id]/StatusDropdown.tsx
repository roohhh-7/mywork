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

export function getStatusColor(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "not started") return "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900";
  if (s === "in progress") return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800";
  if (s === "complete") return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800";
  return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800";
}

interface StatusDropdownProps {
  currentStatus: string;
  updateAction: (status: string) => Promise<{ error?: string }>;
}

export function StatusDropdown({ currentStatus, updateAction }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customStatus, setCustomStatus] = useState("");
  const [statuses, setStatuses] = useState(() => {
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
    const res = await updateAction(status);
    setLoading(false);
    if (res?.error) {
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
            className={cn("h-6 px-2.5 text-[11px] font-medium rounded-full shadow-none", getStatusColor(currentStatus || "Not Started"))}
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
