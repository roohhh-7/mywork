"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FolderKanban, 
  CheckCircle, 
  Archive, 
  Settings,
  Plus,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Progress", href: "/progress", icon: CheckCircle },
  { name: "Archive", href: "/archive", icon: Archive },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-[#0a0a0a]">
      <div className="flex h-14 items-center px-6 py-6 pb-2">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold tracking-tight text-white">mywork</span>
        </Link>
      </div>

      <div className="px-4 py-4">
        <button 
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            document.dispatchEvent(event);
          }}
          className="flex w-full items-center gap-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 px-3 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Quick Add
          <span className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">⌘K</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-red-500/[0.08] text-zinc-100"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-red-500" />
              )}
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex items-center justify-between px-3">
        <Link
          href="/settings"
          className={cn(
            "flex-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-red-500/[0.08] text-zinc-100"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
}
