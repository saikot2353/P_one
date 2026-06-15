import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, Cpu } from "lucide-react";

export const Route = createFileRoute("/increment-report")({
  head: () => ({
    meta: [{ title: "Increment Report — CRIPTON" }],
  }),
  component: () => <PlaceholderPage title="Increment Report" />,
});

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-3" />
              <span>Evaluation</span>
              <ChevronRight className="size-3" />
              <span className="text-primary font-extrabold">{title}</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Cpu className="size-5.5 text-primary animate-pulse" />
              <span>{title} Workspace</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">Analytical reports and dynamic performance curves.</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm text-center py-24 space-y-4">
            <div className="size-16 rounded-lg bg-primary/10 text-primary grid place-items-center mx-auto animate-bounce">
              <Cpu className="size-8" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">{title} Pipeline Active</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
              This module is scheduled for full visual dataset mounting in the next release wave. Please check the active <Link to="/increment-history" className="text-primary font-bold hover:underline">Increment History</Link> logs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
