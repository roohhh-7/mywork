import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NewProjectButton } from "./NewProjectButton";
import { ProjectCardMenu } from "./ProjectCardMenu";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { notes: true, links: true, files: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <NewProjectButton />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => {
          const resourcesCount = project._count.notes + project._count.links + project._count.files;
          return (
            <div
              key={project.id}
              className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 relative overflow-hidden h-full flex flex-col"
            >
              {project.color && (
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.color }} />
              )}

              <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">Open {project.name}</span>
              </Link>

              <div className="flex items-start justify-between mb-2 relative z-10 pointer-events-none">
                <h3 className="font-semibold text-zinc-900 leading-tight pr-2">{project.name}</h3>
                <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {project.status}
                  </span>
                  <ProjectCardMenu projectId={project.id} projectName={project.name} />
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-zinc-500 flex-1 relative z-10 pointer-events-none">{project.description}</p>
              )}

              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400 relative z-10 pointer-events-none">
                <span>{resourcesCount} resources</span>
                <span>&middot;</span>
                <span>Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
