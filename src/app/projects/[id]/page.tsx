import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, FileText, Link as LinkIcon, File } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineNoteForm, InlineLinkForm, InlineFileForm } from "./InlineForms";
import { StatusDropdown } from "./StatusDropdown";
import { StatusFilter } from "./StatusFilter";
import { 
  updateNoteStatus, updateLinkStatus, updateFileStatus,
  deleteNoteAction, deleteLinkAction, deleteFileAction,
  archiveNoteAction, archiveLinkAction, archiveFileAction,
  updateNoteAction, updateLinkContentAction 
} from "./actions";
import { ResourceOptionsMenu } from "./ResourceOptionsMenu";
import { NoteCard } from "./NoteCard";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ status?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;

  const whereFilter: any = { isArchived: false };
  if (statusFilter && statusFilter !== 'All') {
    whereFilter.status = statusFilter;
  }

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
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/projects" className="flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Projects
        </Link>
      </div>

      <header className="relative pb-6 border-b border-border">
        {project.color && (
          <div className="absolute -left-8 top-1 bottom-1 w-1 rounded-r-md" style={{ backgroundColor: project.color }} />
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="mt-2 text-muted-foreground max-w-3xl">{project.description}</p>
        )}
      </header>

      {/* Tabs Layout */}
      <div className="pt-2">
        <Tabs defaultValue="notes" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-border">
            <TabsList className="bg-transparent h-auto p-0 space-x-6 justify-start rounded-none">
              <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-1 pb-2.5 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-1 pb-2.5 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors">
                <LinkIcon className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-1 pb-2.5 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors">
                <File className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>
            
            <div className="pb-2 sm:pb-0">
              <StatusFilter />
            </div>
          </div>

          <TabsContent value="notes" className="mt-0 outline-none w-full space-y-6">
            <div className="max-w-md">
              <InlineNoteForm projectId={project.id} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.notes.map(note => (
                <NoteCard key={note.id} note={note} projectId={project.id} />
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
                    className="block bg-card border border-border rounded-lg p-4 shadow-sm hover:border-border/80 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      {link.imageUrl && (
                        <div className="w-12 h-12 shrink-0 rounded bg-muted overflow-hidden border border-border/50 hidden sm:block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={link.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <a href={safeHref} target="_blank" rel="noreferrer" className="font-medium text-[14px] text-foreground line-clamp-1 break-all mb-1 hover:underline inline-block">
                          {(() => {
                            try {
                              return new URL(safeHref).hostname;
                            } catch (e) {
                              return link.url;
                            }
                          })()}
                        </a>
                      {link.description && (
                        <p className="text-[13px] text-muted-foreground line-clamp-2">{link.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <StatusDropdown currentStatus={link.status} updateAction={updateLinkStatus.bind(null, project.id, link.id)} />
                      <ResourceOptionsMenu 
                        id={link.id} projectId={project.id} type="link" isArchived={link.isArchived} url={link.url} description={link.description || ""}
                        deleteAction={deleteLinkAction} archiveAction={archiveLinkAction} editLinkAction={updateLinkContentAction}
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground/70 font-medium">
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
                <div key={file.id} className="bg-card border border-border rounded-lg p-4 shadow-sm flex items-center justify-between hover:border-border/80 transition-all">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[14px] text-foreground truncate">{file.name}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground/70 font-medium flex items-center gap-2">
                      <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>&middot;</span>
                      <span>{formatDistanceToNow(file.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                      <StatusDropdown currentStatus={file.status} updateAction={updateFileStatus.bind(null, project.id, file.id)} />
                      <ResourceOptionsMenu 
                        id={file.id} projectId={project.id} type="file" isArchived={file.isArchived}
                        deleteAction={deleteFileAction} archiveAction={archiveFileAction}
                      />
                    </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
