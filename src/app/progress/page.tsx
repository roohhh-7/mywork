import { prisma } from "@/lib/prisma";
import { formatDistanceToNow, format, isToday } from "date-fns";
import { Plus } from "lucide-react";
import { AddProgressForm } from "./AddProgressForm";
import { StatusDropdown } from "@/app/projects/[id]/StatusDropdown";
import { updateProgressStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const items = await prisma.progressItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true }
  });

  // Group by date
  const grouped = items.reduce((acc, item) => {
    const dateStr = format(item.createdAt, "yyyy-MM-dd");
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Progress</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Track what you&apos;ve accomplished.</p>
      </header>

      <AddProgressForm />

      <div className="space-y-12 mt-8">
        {sortedDates.length === 0 && (
          <div className="py-12 text-center border dark:border-zinc-800 rounded-lg border-dashed text-zinc-500 dark:text-zinc-400 text-sm">
            No progress items yet.
          </div>
        )}
        
        {sortedDates.map(dateStr => {
          const isDateToday = isToday(new Date(dateStr));
          return (
            <div key={dateStr} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {isDateToday ? "Today" : format(new Date(dateStr), "MMMM d, yyyy")}
              </h2>
              <div className="space-y-3 pl-1">
                {grouped[dateStr].map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-4 group bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.08] rounded-lg p-4 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.04] transition-all">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <span className={`text-[14px] ${item.completed ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100 font-medium"}`}>
                        {item.content}
                      </span>
                      {item.project && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 w-fit">
                          Project: {item.project.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <StatusDropdown currentStatus={item.status} updateAction={updateProgressStatus.bind(null, item.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
