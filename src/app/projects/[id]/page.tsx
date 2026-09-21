import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectResourceList } from "./ProjectResourceList";
import { AddResourceDialog } from "./AddResourceDialog";

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

  const allResources = [
    ...project.notes.map(n => ({ ...n, type: "note" as const })),
    ...project.links.map(l => ({ ...l, type: "link" as const })),
    ...project.files.map(f => ({ ...f, type: "file" as const }))
  ].sort((a, b) => {
    const dateA = a.type === 'note' ? a.updatedAt : a.createdAt;
    const dateB = b.type === 'note' ? b.updatedAt : b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-zinc-500 mb-4">
        <Link href="/projects" className="flex items-center hover:text-zinc-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Projects
        </Link>
      </div>

      <header className="relative">
        {project.color && (
          <div className="absolute -left-8 top-1 bottom-1 w-1 rounded-r-md" style={{ backgroundColor: project.color }} />
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="mt-2 text-zinc-600 max-w-3xl">{project.description}</p>
        )}
        <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
          <span className="font-medium uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-full text-xs">
            {project.status}
          </span>
          <span>&middot;</span>
          <span>Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
        </div>
      </header>

      <div className="pt-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between border-b pb-2 mb-6">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 pb-2 font-medium text-zinc-500">
                All
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 pb-2 font-medium text-zinc-500">
                Notes
              </TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 pb-2 font-medium text-zinc-500">
                Links
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 pb-2 font-medium text-zinc-500">
                Files
              </TabsTrigger>
            </TabsList>
            
            <AddResourceDialog projectId={project.id} />
          </div>

          <TabsContent value="all" className="mt-0 outline-none">
            <ProjectResourceList resources={allResources} />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0 outline-none">
            <ProjectResourceList resources={project.notes.map(n => ({ ...n, type: "note" as const }))} />
          </TabsContent>
          
          <TabsContent value="links" className="mt-0 outline-none">
            <ProjectResourceList resources={project.links.map(l => ({ ...l, type: "link" as const }))} />
          </TabsContent>
          
          <TabsContent value="files" className="mt-0 outline-none">
            <ProjectResourceList resources={project.files.map(f => ({ ...f, type: "file" as const }))} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
