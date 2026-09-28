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
    <div className="flex h-full w-64 flex-col border-r border-border bg-muted/30">
      <div className="flex h-14 items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold tracking-tight text-foreground">mywork</span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <button 
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            document.dispatchEvent(event);
          }}
          className="flex w-full items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Quick Add
          <span className="ml-auto text-xs text-primary-foreground/70">⌘K</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex items-center justify-between">
        <Link
          href="/settings"
          className={cn(
            "flex-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
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
