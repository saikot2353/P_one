import { Bell, Search, Plus, MessagesSquare } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 px-6 flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-display font-semibold tracking-tight">Good morning, Ariana 👋</h1>
        <p className="text-xs text-muted-foreground">Here's what's happening across your organization today.</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search employees, payroll, requests..."
            className="w-80 pl-9 pr-3 h-10 rounded-lg bg-muted border border-transparent focus:border-ring focus:bg-card outline-none text-sm transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground">⌘K</kbd>
        </div>
        <button className="relative size-10 grid place-items-center rounded-lg hover:bg-muted text-foreground">
          <MessagesSquare className="size-[18px]" />
        </button>
        <button className="relative size-10 grid place-items-center rounded-lg hover:bg-muted text-foreground">
          <Bell className="size-[18px]" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>
        <button className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-sm font-medium shadow-[var(--shadow-elegant)] hover:opacity-95 transition">
          <Plus className="size-4" /> New Employee
        </button>
      </div>
    </header>
  );
}
