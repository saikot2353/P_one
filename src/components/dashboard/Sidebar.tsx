import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, SlidersHorizontal, UserRound, Clock, Coins,
  Users, RefreshCw, FileText, BarChart3, ClipboardCheck,
  CalendarDays, CalendarX, ShieldAlert, Fingerprint, Timer,
  CreditCard, Cpu, ShieldCheck, Lightbulb, Settings,
  LifeBuoy, ChevronDown, ChevronRight, File, Briefcase, UserPlus,
  LogOut
} from "lucide-react";

interface SubItem {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  to?: string;
  icon: any;
  active?: boolean;
  subitems?: SubItem[];
}

const nav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  {
    label: "SSP",
    icon: Briefcase,
    subitems: [
      { label: "New Requisition", to: "/ssp-new-requisition" },
      { label: "My Requisition", to: "/ssp-my-requisition" },
      { label: "Approval", to: "/ssp-approval" },
      { label: "Attendance", to: "/ssp-attendance" },
    ]
  },
  {
    label: "Configure",
    icon: SlidersHorizontal,
    subitems: [
      { label: "Structure Setup", to: "/configure-structure" },
      { label: "Job & Employee Setup", to: "/configure-employment" },
      { label: "Shift & Time Rules", to: "/configure-time" },
      { label: "Allowances & Bonuses", to: "/configure-compensation" },
      { label: "Education & Training", to: "/configure-education" },
      { label: "Leave & Policies", to: "/configure-policies" }
    ]
  },
  {
    label: "Personnel Info",
    icon: UserRound,
    active: true,
    subitems: [
      { label: "Personnel List", to: "/personnel-list" },
      { label: "Approval", to: "/personnel-approval" },
    ]
  },
  {
    label: "Attendance",
    icon: Fingerprint,
    subitems: [
      { label: "Manual Attendance", to: "/manual-attendance" },
      { label: "Manual Attendance Approval", to: "/pending-manual-attendance" },
      { label: "Employee Job Card", to: "/employee-job-card" },
      { label: "Allowance Process", to: "/" },
      { label: "Allowance Requisition", to: "/" },
    ]
  },
  {
    label: "Roster",
    icon: CalendarDays,
    subitems: [
      { label: "Create Roster", to: "/create-roster" },
      { label: "Company Holiday", to: "/company-holiday" },
    ]
  },
  {
    label: "Leave",
    to: "/leave",
    icon: CalendarX
  },
  {
    label: "KPI Performance",
    icon: BarChart3,
    subitems: [
      { label: "Dashboard", to: "/kpi-dashboard" },
      { label: "Cycles", to: "/kpi-cycles" },
      { label: "Criteria Setup", to: "/kpi-task-name" },
      { label: "Grade Bands", to: "/kpi-setting" },
      { label: "My Self-Assessment", to: "/kpi-self-assessment" },
      { label: "360° Peer Review", to: "/kpi-peer-review" },
      { label: "Assessment Workflow", to: "/kpi-assessment-workflow" },
      { label: "KPI Reports", to: "/kpi-report" },
    ]
  },
  {
    label: "Evaluation",
    icon: ClipboardCheck,
    subitems: [
      { label: "Increment Configurator", to: "/increment-gadget" },
      { label: "Evaluation Propose", to: "/evaluation-propose" },
      { label: "Propose Increment", to: "/propose-increment" },
      { label: "Increment Summary", to: "/increment-summary" },
      { label: "Approve Increment Gadget", to: "/approve-increment-gadget" },
      { label: "Increment Queue List", to: "/increment-queuelist" },
      { label: "Approve Increment (HR)", to: "/approve-increment-hr" },
      { label: "Approve Increment", to: "/final-approve-increment" },
      { label: "Increment List", to: "/increment-list" },
      { label: "Increment History", to: "/increment-history" },
    ]
  },
  {
    label: "e-Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "e-Recruitment Form", to: "/e-recruitment-form" },
      { label: "List", to: "/recruitment-basic-list" },
      { label: "Approved List", to: "/recruitment-assessment-list" },
    ],
  },
  {
    label: "IE Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "Organization Setting", to: "/recruitment-basic-setup" },
      { label: "Basic Entry Form", to: "/recruitment-basic-entry" },
      { label: "Basic Info List", to: "/recruitment-basic-info-list" },
      { label: "IE Configuration", to: "/recruitment-configuration" },
      { label: "IE Assessment", to: "/recruitment-ie-list" },
      { label: "HR Assessment", to: "/recruitment-hr-list" },
      { label: "Assessment List", to: "/recruitment-assessment-list" },
    ],
  },
  {
    label: "Manage Shift",
    icon: Clock,
    active: true,
    subitems: [
      { label: "Shift Schedule", to: "/" },
      { label: "Shift Rotation", to: "/" },
      { label: "Shift Roster", to: "/" },
      { label: "Late Policy", to: "/" },
    ]
  },
  {
    label: "Manpower Budget",
    icon: Coins,
    subitems: [
      { label: "Dashboard & Statement", to: "/budget-statement" },
      { label: "Budget Planning Hub", to: "/budget-planning" },
      { label: "My Requisitions", to: "/budget-my-requisitions" },
      { label: "Requisition Approvals", to: "/budget-requisition-approvals" },
      { label: "Overtime Control", to: "/budget-overtime" },
    ]
  },
  {
    label: "Transfer",
    icon: RefreshCw,
    subitems: [
      { label: "Branch Transfer", to: "/" },
      { label: "Department Transfer", to: "/" },
      { label: "Transfer History", to: "/" },
    ]
  },
  {
    label: "HR Policy",
    icon: FileText,
    subitems: [
      { label: "Company Rules", to: "/" },
      { label: "Benefits Policy", to: "/" },
      { label: "Conduct Policy", to: "/" },
    ]
  },

  {
    label: "Disciplinary Action",
    icon: ShieldAlert,
    subitems: [
      { label: "Case Files", to: "/" },
      { label: "Warning Letters", to: "/" },
      { label: "Show Cause Notices", to: "/" },
    ]
  },
  {
    label: "Manage Overtime",
    icon: Timer,
    subitems: [
      { label: "Overtime Requests", to: "/" },
      { label: "OT Calculations", to: "/" },
      { label: "OT Approvals", to: "/" },
    ]
  },
  {
    label: "Manage Allowance",
    icon: CreditCard,
    subitems: [
      { label: "Allowance Setup", to: "/" },
      { label: "Employee Allowance", to: "/" },
      { label: "Tax Exemption Rules", to: "/" },
    ]
  },
  {
    label: "Processes",
    icon: Cpu,
    subitems: [
      { label: "Payroll Processing", to: "/" },
      { label: "End of Month Close", to: "/" },
      { label: "Year End Process", to: "/" },
    ]
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    subitems: [
      { label: "Statutory Compliance", to: "/" },
      { label: "Tax Reports", to: "/" },
      { label: "Audit Logs", to: "/" },
    ]
  },
  {
    label: "Idea Share",
    icon: Lightbulb,
    subitems: [
      { label: "Idea Board", to: "/" },
      { label: "Innovation Submissions", to: "/" },
    ]
  },
  {
    label: "Event",
    icon: CalendarDays,
    subitems: [
      { label: "Upcoming Events", to: "/" },
      { label: "Holiday Celebrations", to: "/" },
      { label: "Team Building", to: "/" },
    ]
  }
];

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    nav.forEach(item => {
      if (item.subitems && item.subitems.some(sub => sub.to !== "/" && sub.to === currentPath)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
      <div className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80">
        <div className="size-8.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] text-sm tracking-tight transition-transform duration-300 hover:rotate-6">
          C
        </div>
        <div className="leading-tight">
          <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground">CRIPTON</div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-sidebar-primary">HRIS</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">Workspace</div>
        {nav.map((item) => {
          const Icon = item.icon;

          // Determine parent active state dynamically: active if its route is active OR any of its subitems is active
          const isParentActive = item.to === currentPath || (item.subitems && item.subitems.some(sub => sub.to !== "/" && sub.to === currentPath));

          if (!item.subitems) {
            return (
              <div key={item.label} className="border-b border-sidebar-border/30 last:border-0 pb-1">
                <Link
                  to={item.to || "/"}
                  className={[
                    "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                    isParentActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-sidebar-primary" />
                  <span>{item.label}</span>
                  {isParentActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" />
                  )}
                </Link>
              </div>
            );
          }

          const isOpen = openMenus[item.label];
          return (
            <div key={item.label} className="space-y-0.5 border-b border-sidebar-border/30 last:border-0 pb-1">
              <button
                onClick={() => toggleMenu(item.label)}
                className={[
                  "w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-left transition-all duration-200 font-semibold",
                  isParentActive
                    ? "bg-sidebar-accent/30 text-sidebar-accent-foreground font-bold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-3.5 transition-colors duration-300 group-hover:scale-110 group-hover:text-sidebar-primary",
                    isParentActive ? "text-success font-black" : "text-sidebar-foreground/60"
                  ].join(" ")}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isOpen ? (
                  <ChevronDown className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" />
                ) : (
                  <ChevronRight className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300" />
                )}
              </button>
              <div
                className={[
                  "overflow-hidden transition-all duration-300 space-y-0.5 pl-3.5 bg-sidebar-accent/25 rounded-xl",
                  isOpen ? "max-h-[600px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0"
                ].join(" ")}
              >
                {item.subitems.map((sub) => {
                  const isSubActive = sub.to !== "/" && sub.to === currentPath;
                  return (
                    <Link
                      key={sub.label}
                      to={sub.to}
                      className={[
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                        isSubActive
                          ? "bg-primary/10 text-primary font-bold shadow-2xs"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      ].join(" ")}
                    >
                      <File className={["size-3 shrink-0", isSubActive ? "text-primary font-black" : "text-sidebar-foreground/45"].join(" ")} />
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border/60 space-y-1 bg-sidebar-accent/15">
        <Link to="/configure-structure" className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all">
          <Settings className="size-3.5 transition-transform duration-300 group-hover:rotate-45" /> Settings
        </Link>
        <Link to="/" className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all">
          <LifeBuoy className="size-3.5 transition-transform duration-300 group-hover:scale-110" /> Help & Support
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("cripton_logged_in");
              window.location.href = "/login";
            }
          }}
          className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all text-left"
        >
          <LogOut className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 text-rose-500" />
          <span className="text-rose-500/90 group-hover:text-rose-500 transition-colors">Log Out</span>
        </button>
        <div className="mt-3 mx-1 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border hover:border-sidebar-border/80 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-[10px] font-bold text-primary-foreground shadow-sm">
                TAS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success border-2 border-sidebar shadow-[0_0_6px_var(--success)]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-sidebar-foreground truncate">Tahmid Afsar Shapno</div>
              <div className="text-[9px] text-sidebar-foreground/60 truncate font-semibold">HR Director</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
