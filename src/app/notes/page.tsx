import { prisma } from "@/lib/prisma";
import { GlobalNoteCard } from "./GlobalNoteCard";
import { AddGlobalNoteForm } from "./AddGlobalNoteForm";
import { StatusFilter } from "@/app/projects/[id]/StatusFilter";

export const dynamic = "force-dynamic";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;

  const whereFilter: any = { isArchived: false, projectId: null }; // Only fetch global notes
  if (statusFilter && statusFilter !== 'All') {
    whereFilter.status = statusFilter;
  }

  const notes = await prisma.note.findMany({
    where: whereFilter,
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Notes</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Jot down your thoughts, ideas, and snippets.</p>
        </div>
        <StatusFilter />
      </header>

      <div className="mt-0 outline-none w-full space-y-6">
        <div className="max-w-md">
          <AddGlobalNoteForm />
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-12 border border-dashed dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400">
            No notes found. Create your first note above!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.map(note => (
              <GlobalNoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
