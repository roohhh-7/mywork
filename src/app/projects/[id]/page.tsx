import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, FileText, Link as LinkIcon, File } from "lucide-react";
import { InlineNoteForm, InlineLinkForm, InlineFileForm } from "./InlineForms";

export const dynamic = "force-dynamic";

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      notes: { orderBy: { updatedAt: "desc" } },
      links: { orderBy: { createdAt: "desc" } },
      files: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!project) return notFound();

  return (
    <div className="space-y-10">
      <div className="flex items-center text-sm text-zinc-500">
        <Link href="/projects" className="flex items-center hover:text-zinc-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Projects
        </Link>
      </div>

      <header className="relative pb-6 border-b border-zinc-100">
        {project.color && (
          <div className="absolute -left-8 top-1 bottom-1 w-1 rounded-r-md" style={{ backgroundColor: project.color }} />
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="mt-2 text-zinc-600 max-w-3xl">{project.description}</p>
        )}
      </header>

      {/* Grid Layout for the 3 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* NOTES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-zinc-900 border-b pb-2">
            <FileText className="h-4 w-4" />
            Notes
          </div>
          <InlineNoteForm projectId={project.id} />
          
          <div className="space-y-3 mt-6">
            {project.notes.map(note => (
              <div key={note.id} className="bg-zinc-50/50 border border-zinc-100 rounded-lg p-4 shadow-sm hover:border-zinc-300 transition-colors">
                <p className="text-sm text-zinc-700 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-3 text-[10px] text-zinc-400 uppercase tracking-wider">
                  {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LINKS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-zinc-900 border-b pb-2">
            <LinkIcon className="h-4 w-4" />
            Links
          </div>
          <InlineLinkForm projectId={project.id} />
          
          <div className="space-y-3 mt-6">
            {project.links.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="block bg-zinc-50/50 border border-zinc-100 rounded-lg p-4 shadow-sm hover:border-zinc-300 transition-colors">
                <div className="font-medium text-sm text-zinc-900 line-clamp-1 break-all">{new URL(link.url).hostname}</div>
                {link.description && (
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{link.description}</p>
                )}
                <div className="mt-3 text-[10px] text-zinc-400 uppercase tracking-wider">
                  {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FILES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-medium text-zinc-900 border-b pb-2">
            <File className="h-4 w-4" />
            Files
          </div>
          <InlineFileForm projectId={project.id} />
          
          <div className="space-y-3 mt-6">
            {project.files.map(file => (
              <div key={file.id} className="bg-zinc-50/50 border border-zinc-100 rounded-lg p-4 shadow-sm flex items-center justify-between hover:border-zinc-300 transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-sm text-zinc-900 truncate">{file.name}</div>
                  <div className="mt-1 text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>&middot;</span>
                    <span>{formatDistanceToNow(file.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
