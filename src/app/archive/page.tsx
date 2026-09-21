import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FolderKanban, FileText, Link as LinkIcon, File } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const [projects, notes, links, files] = await Promise.all([
    prisma.project.findMany({ where: { status: "Archived" }, orderBy: { updatedAt: "desc" } }),
    prisma.note.findMany({ where: { isArchived: true }, include: { project: true }, orderBy: { updatedAt: "desc" } }),
    prisma.link.findMany({ where: { isArchived: true }, include: { project: true }, orderBy: { updatedAt: "desc" } }),
    prisma.file.findMany({ where: { isArchived: true }, include: { project: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const isEmpty = projects.length === 0 && notes.length === 0 && links.length === 0 && files.length === 0;

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Archive</h1>
        <p className="text-zinc-500 mt-2">Archived projects and resources.</p>
      </header>

      {isEmpty ? (
        <div className="py-12 text-center border rounded-lg border-dashed text-zinc-500 text-sm">
          No items in archive.
        </div>
      ) : (
        <div className="space-y-8">
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-zinc-900">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="border rounded-xl p-4 flex items-center justify-between bg-zinc-50 opacity-75">
                    <div className="flex items-center gap-3">
                      <FolderKanban className="h-5 w-5 text-zinc-400" />
                      <div>
                        <div className="font-medium text-zinc-900">{p.name}</div>
                        <div className="text-xs text-zinc-500">Archived {formatDistanceToNow(p.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-zinc-900">Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(n => (
                  <div key={n.id} className="border rounded-xl p-4 flex items-center justify-between bg-zinc-50 opacity-75">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-zinc-400" />
                      <div>
                        <div className="font-medium text-zinc-900">{n.title}</div>
                        <div className="text-xs text-zinc-500">{n.project.name} &middot; Archived {formatDistanceToNow(n.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {links.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-zinc-900">Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map(l => (
                  <div key={l.id} className="border rounded-xl p-4 flex items-center justify-between bg-zinc-50 opacity-75">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-zinc-400" />
                      <div>
                        <div className="font-medium text-zinc-900">{l.title}</div>
                        <div className="text-xs text-zinc-500">{l.project.name} &middot; Archived {formatDistanceToNow(l.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {files.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-zinc-900">Files</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map(f => (
                  <div key={f.id} className="border rounded-xl p-4 flex items-center justify-between bg-zinc-50 opacity-75">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-zinc-400" />
                      <div>
                        <div className="font-medium text-zinc-900">{f.name}</div>
                        <div className="text-xs text-zinc-500">{f.project.name} &middot; Archived {formatDistanceToNow(f.createdAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
