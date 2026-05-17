import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, FileBarChart2,
  Briefcase, Settings, LifeBuoy, GraduationCap, ClipboardList, Building2,
} from "lucide-react";

const nav = [
  { label: "Overview", to: "/", icon: LayoutDashboard, active: true },
  { label: "Employees", to: "/", icon: Users },
  { label: "Attendance", to: "/", icon: CalendarCheck },
  { label: "Payroll", to: "/", icon: Wallet },
  { label: "Recruitment", to: "/", icon: Briefcase },
  { label: "Performance", to: "/", icon: FileBarChart2 },
  { label: "Training", to: "/", icon: GraduationCap },
  { label: "Leave & Requests", to: "/", icon: ClipboardList },
  { label: "Departments", to: "/", icon: Building2 },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-display font-bold text-primary-foreground shadow-lg">
          C
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold tracking-tight text-base">CRIPTON</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-primary">HRIS</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Workspace</div>
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              ].join(" ")}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
              {item.active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-0.5">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
          <Settings className="size-4" /> Settings
        </Link>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
          <LifeBuoy className="size-4" /> Help & Support
        </Link>
        <div className="mt-3 mx-1 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-xs font-semibold text-primary-foreground">AR</div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">Ariana Reed</div>
              <div className="text-[10px] text-sidebar-foreground/60 truncate">HR Director</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
