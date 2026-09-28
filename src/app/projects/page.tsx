import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { NewProjectButton } from "./NewProjectButton";

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
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700/50 relative overflow-hidden h-full flex flex-col">
                {project.color && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-red-500" style={{ backgroundColor: project.color }} />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-zinc-100 leading-tight">{project.name}</h3>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-full border border-zinc-800">
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-zinc-400 flex-1">{project.description}</p>
                )}
                <div className="mt-6 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                  <span>{resourcesCount} resources</span>
                  <span>&middot;</span>
                  <span>Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
