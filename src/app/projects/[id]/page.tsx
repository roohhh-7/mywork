import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, FileText, Link as LinkIcon, File } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineNoteForm, InlineLinkForm, InlineFileForm } from "./InlineForms";
import { StatusDropdown } from "./StatusDropdown";
import { StatusFilter } from "./StatusFilter";
import { updateNoteStatus, updateLinkStatus, updateFileStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ status?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;

  const whereFilter = statusFilter && statusFilter !== 'All' ? { status: statusFilter } : {};

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: {
      notes: { where: whereFilter, orderBy: { updatedAt: "desc" } },
      links: { where: whereFilter, orderBy: { createdAt: "desc" } },
      files: { where: whereFilter, orderBy: { createdAt: "desc" } }
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

      {/* Tabs Layout */}
      <div className="pt-2">
        <Tabs defaultValue="notes" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-zinc-200">
            <TabsList className="bg-transparent h-auto p-0 space-x-6 justify-start rounded-none">
              <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-1 pb-2.5 font-medium text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-1 pb-2.5 font-medium text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
                <LinkIcon className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-1 pb-2.5 font-medium text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
                <File className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>
            
            <div className="pb-2 sm:pb-0">
              <StatusFilter />
            </div>
          </div>

          <TabsContent value="notes" className="mt-0 outline-none max-w-3xl space-y-6">
            <InlineNoteForm projectId={project.id} />
            <div className="space-y-3">
              {project.notes.map(note => (
                <div key={note.id} className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:border-zinc-300 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-[14px] text-zinc-800 whitespace-pre-wrap leading-relaxed flex-1">{note.content}</p>
                    <StatusDropdown currentStatus={note.status} updateAction={updateNoteStatus.bind(null, project.id, note.id)} />
                  </div>
                  <div className="mt-3 text-[11px] text-zinc-400 font-medium">
                    {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-0 outline-none max-w-3xl space-y-6">
            <InlineLinkForm projectId={project.id} />
            <div className="space-y-3">
              {project.links.map(link => {
                const safeHref = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                return (
                  <div 
                    key={link.id} 
                    className="block bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <a href={safeHref} target="_blank" rel="noreferrer" className="font-medium text-[14px] text-zinc-900 line-clamp-1 break-all mb-1 hover:underline inline-block">
                          {(() => {
                            try {
                              return new URL(safeHref).hostname;
                            } catch (e) {
                              return link.url;
                            }
                          })()}
                        </a>
                      {link.description && (
                        <p className="text-[13px] text-zinc-600 line-clamp-2">{link.description}</p>
                      )}
                    </div>
                    <div>
                      <StatusDropdown currentStatus={link.status} updateAction={updateLinkStatus.bind(null, project.id, link.id)} />
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-zinc-400 font-medium">
                    {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                  </div>
                </div>
              );
            })}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-0 outline-none max-w-3xl space-y-6">
            <InlineFileForm projectId={project.id} />
            <div className="space-y-3">
              {project.files.map(file => (
                <div key={file.id} className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex items-center justify-between hover:border-zinc-300 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[14px] text-zinc-900 truncate">{file.name}</div>
                    <div className="mt-1 text-[11px] text-zinc-400 font-medium flex items-center gap-2">
                      <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>&middot;</span>
                      <span>{formatDistanceToNow(file.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                  <StatusDropdown currentStatus={file.status} updateAction={updateFileStatus.bind(null, project.id, file.id)} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
