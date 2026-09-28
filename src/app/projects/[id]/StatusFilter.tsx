"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FILTER_OPTIONS = ["All", "Not Started", "In Progress", "Complete"];

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus: string = searchParams.get("status") || "All";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground font-medium">Filter:</span>
      <Select 
        value={currentStatus} 
        onValueChange={(value: string | null) => {
          const params = new URLSearchParams(searchParams.toString());
          if (!value || value === "All") {
            params.delete("status");
          } else {
            params.set("status", value);
          }
          router.push(`?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 shadow-none rounded-full px-4 hover:bg-zinc-800 transition-colors">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="shadow-sm border-border">
          {FILTER_OPTIONS.map(opt => (
            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
          ))}
          {/* If the current status is a custom one not in the default list, show it */}
          {!FILTER_OPTIONS.includes(currentStatus) && currentStatus && (
            <SelectItem value={currentStatus} className="text-xs">{currentStatus}</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
