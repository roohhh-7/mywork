import { formatDistanceToNow } from "date-fns";
import { FileText, Link as LinkIcon, File } from "lucide-react";

type Resource = 
  | { type: "note"; id: string; title: string; content: string; color: string | null; tags: string | null; updatedAt: Date }
  | { type: "link"; id: string; title: string; url: string; description: string | null; color: string | null; tags: string | null; createdAt: Date }
  | { type: "file"; id: string; name: string; fileSize: number; description: string | null; color: string | null; tags: string | null; createdAt: Date };

export function ProjectResourceList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg border-dashed text-zinc-500 text-sm">
        No resources found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map(res => {
        if (res.type === "note") {
          return (
            <div key={`note-${res.id}`} className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col h-48">
              {res.color && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: res.color }} />}
              <div className="flex items-start gap-2 mb-2">
                <FileText className="h-4 w-4 mt-0.5 text-zinc-400" />
                <h3 className="font-semibold text-zinc-900 line-clamp-1">{res.title}</h3>
              </div>
              <p className="text-sm text-zinc-500 flex-1 line-clamp-4 whitespace-pre-wrap">{res.content}</p>
              <div className="mt-4 pt-3 border-t text-xs text-zinc-400 flex items-center justify-between">
                <span>Note</span>
                <span>{formatDistanceToNow(res.updatedAt, { addSuffix: true })}</span>
              </div>
            </div>
          );
        }

        if (res.type === "link") {
          return (
            <a key={`link-${res.id}`} href={res.url} target="_blank" rel="noreferrer" className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col h-48">
              {res.color && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: res.color }} />}
              <div className="flex items-start gap-2 mb-2">
                <LinkIcon className="h-4 w-4 mt-0.5 text-zinc-400" />
                <h3 className="font-semibold text-zinc-900 line-clamp-1">{res.title}</h3>
              </div>
              <div className="text-xs text-blue-600 mb-2 truncate">{new URL(res.url).hostname}</div>
              {res.description && (
                <p className="text-sm text-zinc-500 flex-1 line-clamp-3">{res.description}</p>
              )}
              <div className="mt-auto pt-3 border-t text-xs text-zinc-400 flex items-center justify-between">
                <span>Link</span>
                <span>{formatDistanceToNow(res.createdAt, { addSuffix: true })}</span>
              </div>
            </a>
          );
        }

        if (res.type === "file") {
          return (
            <div key={`file-${res.id}`} className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden flex flex-col h-48">
              {res.color && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: res.color }} />}
              <div className="flex items-start gap-2 mb-2">
                <File className="h-4 w-4 mt-0.5 text-zinc-400" />
                <h3 className="font-semibold text-zinc-900 line-clamp-1">{res.name}</h3>
              </div>
              <p className="text-sm text-zinc-500 flex-1 line-clamp-2">{res.description}</p>
              <div className="mt-auto pt-3 border-t text-xs text-zinc-400 flex items-center justify-between">
                <span>File · {(res.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                <span>{formatDistanceToNow(res.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
