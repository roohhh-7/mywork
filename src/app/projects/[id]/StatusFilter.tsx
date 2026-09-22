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
      <span className="text-sm text-zinc-500 font-medium">Filter:</span>
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
        <SelectTrigger className="w-[140px] h-8 text-xs bg-transparent border-zinc-200 shadow-none focus:ring-1 focus:ring-zinc-900">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="shadow-sm border-zinc-200">
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
