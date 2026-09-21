import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Link as LinkIcon, File } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activeProjects = await prisma.project.findMany({
    where: { status: "Active" },
    orderBy: { updatedAt: "desc" },
    take: 6,
    include: {
      _count: {
        select: { notes: true, links: true, files: true }
      }
    }
  });

  const recentProgress = await prisma.progressItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
      </header>

      {/* Active Projects */}
      <section>
        <h2 className="text-lg font-medium mb-4 text-zinc-900">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-zinc-500 text-sm">
            No active projects yet. <Link href="/projects" className="text-zinc-900 font-medium underline">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map(project => {
              const resourcesCount = project._count.notes + project._count.links + project._count.files;
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 relative overflow-hidden">
                    {project.color && (
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.color }} />
                    )}
                    <h3 className="font-semibold text-zinc-900">{project.name}</h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{project.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                      <span>{resourcesCount} resources</span>
                      <span>&middot;</span>
                      <span>Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Progress */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-zinc-900">Recent Progress</h2>
          <Link href="/progress" className="text-sm text-zinc-500 hover:text-zinc-900">View all</Link>
        </div>
        <div className="space-y-3">
          {recentProgress.length === 0 ? (
            <div className="text-sm text-zinc-500">No recent progress. Add something you accomplished!</div>
          ) : (
            recentProgress.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <Checkbox checked={item.completed} className="mt-1" />
                <span className={`text-sm ${item.completed ? "text-zinc-400 line-through" : "text-zinc-800"}`}>
                  {item.content}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
