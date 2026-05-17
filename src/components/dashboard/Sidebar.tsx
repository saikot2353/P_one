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
    <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-4 py-4 flex items-center gap-2 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-bold text-primary-foreground shadow-lg text-sm">
          C
        </div>
        <div className="leading-tight">
          <div className="font-bold tracking-tight text-[13px]">CRIPTON</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-sidebar-primary">HRIS</div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[9px] uppercase tracking-wider text-sidebar-foreground/50">Workspace</div>
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={[
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              ].join(" ")}
            >
              <Icon className="size-3.5" />
              <span>{item.label}</span>
              {item.active && <span className="ml-auto size-1 rounded-full bg-sidebar-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        <Link to="/" className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
          <Settings className="size-3.5" /> Settings
        </Link>
        <Link to="/" className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
          <LifeBuoy className="size-3.5" /> Help & Support
        </Link>
        <div className="mt-2 mx-1 p-2.5 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-[10px] font-semibold text-primary-foreground">AR</div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium truncate">Ariana Reed</div>
              <div className="text-[9px] text-sidebar-foreground/60 truncate">HR Director</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
