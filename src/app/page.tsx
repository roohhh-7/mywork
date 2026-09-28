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
        <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-100">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <div className="rounded-lg border dark:border-zinc-800 border-dashed p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No active projects yet. <Link href="/projects" className="text-zinc-900 dark:text-zinc-100 font-medium underline">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map(project => {
              const resourcesCount = project._count.notes + project._count.links + project._count.files;
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-5 shadow-sm dark:shadow-none transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.04] relative overflow-hidden">
                    {project.color && (
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.color }} />
                    )}
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{project.name}</h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{project.description}</p>
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
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Recent Progress</h2>
          <Link href="/progress" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">View all</Link>
        </div>
        <div className="space-y-3">
          {recentProgress.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">No recent progress. Add something you accomplished!</div>
          ) : (
            recentProgress.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                <Checkbox checked={item.completed} className="mt-1" />
                <span className={`text-sm ${item.completed ? "text-zinc-400 line-through" : "text-zinc-800 dark:text-zinc-200"}`}>
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
