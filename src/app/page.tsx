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
        <h2 className="text-lg font-medium mb-4 text-foreground">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <div className="rounded-lg border border-border border-dashed p-8 text-center text-muted-foreground text-sm">
            No active projects yet. <Link href="/projects" className="text-foreground font-medium underline">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map(project => {
              const resourcesCount = project._count.notes + project._count.links + project._count.files;
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-5 transition-all hover:border-zinc-700/50 relative overflow-hidden">
                    {project.color && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-red-500" style={{ backgroundColor: project.color }} />
                    )}
                    <h3 className="font-bold text-zinc-100">{project.name}</h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-zinc-400 line-clamp-1">{project.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
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
          <h2 className="text-lg font-medium text-foreground">Recent Progress</h2>
          <Link href="/progress" className="text-sm text-muted-foreground hover:text-foreground">View all</Link>
        </div>
        <div className="space-y-3">
          {recentProgress.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recent progress. Add something you accomplished!</div>
          ) : (
            recentProgress.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox checked={item.completed} className="mt-1" />
                <span className={`text-sm ${item.completed ? "text-muted-foreground/70 line-through" : "text-foreground/90"}`}>
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
