import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QuickAdd } from "../QuickAdd";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          {children}
        </div>
      </main>
      <QuickAdd />
      <Toaster />
    </div>
  );
}
