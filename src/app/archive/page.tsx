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
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Archive</h1>
        <p className="text-muted-foreground mt-2">Archived projects and resources.</p>
      </header>

      {isEmpty ? (
        <div className="py-12 text-center border border-border rounded-lg border-dashed text-muted-foreground text-sm">
          No items in archive.
        </div>
      ) : (
        <div className="space-y-8">
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-foreground">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="border border-border rounded-xl p-4 flex items-center justify-between bg-muted/30 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <FolderKanban className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">Archived {formatDistanceToNow(p.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-foreground">Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(n => (
                  <div key={n.id} className="border border-border rounded-xl p-4 flex items-center justify-between bg-muted/30 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.project ? n.project.name : 'Global'} &middot; Archived {formatDistanceToNow(n.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {links.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-foreground">Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map(l => (
                  <div key={l.id} className="border border-border rounded-xl p-4 flex items-center justify-between bg-muted/30 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{l.title}</div>
                        <div className="text-xs text-muted-foreground">{l.project.name} &middot; Archived {formatDistanceToNow(l.updatedAt, { addSuffix: true })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {files.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-4 text-foreground">Files</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map(f => (
                  <div key={f.id} className="border border-border rounded-xl p-4 flex items-center justify-between bg-muted/30 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{f.project.name} &middot; Archived {formatDistanceToNow(f.createdAt, { addSuffix: true })}</div>
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
