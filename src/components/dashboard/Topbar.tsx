import { Bell, Search, Plus, MessagesSquare } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 px-4 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div>
        <h1 className="text-sm font-semibold tracking-tight">Good morning, Ariana 👋</h1>
        <p className="text-[11px] text-muted-foreground">Here's what's happening across your organization today.</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search employees, payroll, requests..."
            className="w-72 pl-9 pr-3 h-9 rounded-lg bg-muted border border-transparent focus:border-ring focus:bg-card outline-none text-xs transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">⌘K</kbd>
        </div>
        <button className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground">
          <MessagesSquare className="size-4" />
        </button>
        <button className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <button className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-medium shadow-[var(--shadow-elegant)] hover:opacity-95 transition">
          <Plus className="size-3.5" /> New Employee
        </button>
      </div>
    </header>
  );
}
