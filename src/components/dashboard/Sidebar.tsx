import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  SlidersHorizontal,
  UserRound,
  Clock,
  Coins,
  Users,
  RefreshCw,
  FileText,
  BarChart3,
  ClipboardCheck,
  CalendarDays,
  CalendarX,
  ShieldAlert,
  Fingerprint,
  Timer,
  CreditCard,
  Cpu,
  ShieldCheck,
  Lightbulb,
  Settings,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  File,
  Briefcase,
  UserPlus,
  LogOut,
  HeartHandshake,
  Banknote,
  CheckCircle,
  Blocks,
  ArrowLeft,
  MessageSquare,
  BookUser,
} from "lucide-react";

export interface NestedItem {
  label: string;
  to: string;
  search?: Record<string, any>;
  count?: number;
}

export interface SubItem {
  label: string;
  to?: string;
  search?: Record<string, any>;
  subitems?: NestedItem[];
  count?: number;
}

export interface NavItem {
  label: string;
  to?: string;
  icon: any;
  active?: boolean;
  subitems?: SubItem[];
  search?: Record<string, any>;
  count?: number;
  activeRoutes?: string[];
}

export const nav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Messenger", to: "/messenger", icon: MessageSquare },
  { label: "Phonebook", to: "/phonebook", icon: BookUser },
  {
    label: "SSP",
    icon: Briefcase,
    subitems: [
      { label: "New Requisition", to: "/ssp-new-requisition" },
      { label: "My Requisition", to: "/ssp-my-requisition" },
      { label: "Attendance", to: "/ssp-attendance" },
    ],
  },
  {
    label: "Configure",
    icon: SlidersHorizontal,
    subitems: [
      { label: "Structure Setup", to: "/configure-structure" },
      { label: "Company Setup", to: "/company-setup" },
      { label: "Personnel File Configure", to: "/configure-personnel" },
      { label: "Job & Employee Setup", to: "/configure-employment" },
      { label: "Shift & Time Rules", to: "/configure-time" },
      { label: "Allowances & Bonuses", to: "/configure-compensation" },
      { label: "Tax & Compliance Setup", to: "/configure-tax" },
      { label: "Payroll Configuration", to: "/payroll-configure" },
      { label: "Education & Training", to: "/configure-education" },
      { label: "Leave & Policies", to: "/configure-policies" },
      { label: "Letter Setup", to: "/configure-letter" },
    ],
  },
  {
    label: "Approvals",
    icon: CheckCircle,
    count: 38,
    subitems: [
      { label: "All Approvals", to: "/all-approvals" },
      {
        label: "HR Approvals",
        count: 24,
        subitems: [
          { label: "SSP Approval", to: "/ssp-approval", count: 5 },
          { label: "Personnel Approval", to: "/personnel-approval", count: 2 },
          { label: "Manual Attendance", to: "/pending-manual-attendance", count: 7 },
          {
            label: "JD Approvals",
            to: "/hr-policy",
            search: { mode: "list", filterWorkflow: "HR" },
            count: 1,
          },
          { label: "Increment Gadget", to: "/approve-increment-gadget", count: 3 },
          { label: "Increment (HR)", to: "/approve-increment-hr", count: 2 },
          { label: "Final Increment", to: "/final-approve-increment", count: 1 },
          { label: "Budget Requisitions", to: "/budget-requisition-approvals" },
          {
            label: "Transfer Approvals",
            to: "/transfer-control-center",
            search: { tab: "approve" },
            count: 2,
          },
          { label: "Overtime Requisitions", to: "/approve-overtime", count: 1 },
        ],
      },
      {
        label: "Payroll Approval",
        count: 14,
        subitems: [
          { label: "Advance Requisitions", to: "/approve-advance", count: 3 },
          { label: "Loan Applications", to: "/loan-approval", count: 5 },
          { label: "Salary Sheets", to: "/check-approve-salary", count: 6 },
        ],
      },
    ],
  },
  {
    label: "Personnel Info",
    icon: UserRound,
    subitems: [
      { label: "Personnel List", to: "/personnel-list" },
      { label: "ID Card Setup", to: "/id-card-setup" },
    ],
  },
  {
    label: "Attendance",
    icon: Fingerprint,
    subitems: [
      { label: "Manual Attendance", to: "/manual-attendance" },
      { label: "Employee Job Card", to: "/employee-job-card" },
      { label: "Allowance Process", to: "/" },
      { label: "Allowance Requisition", to: "/" },
    ],
  },
  {
    label: "Roster",
    icon: CalendarDays,
    subitems: [
      { label: "Create Roster", to: "/create-roster" },
      { label: "Company Holiday", to: "/company-holiday" },
    ],
  },
  {
    label: "Leave",
    to: "/leave",
    icon: CalendarX,
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
    ],
  },
  {
    label: "Evaluation",
    icon: ClipboardCheck,
    subitems: [
      { label: "Increment List", to: "/increment-list" },
      { label: "Summary", to: "/increment-summary" },
      { label: "History", to: "/increment-history" },
    ],
  },
  {
    label: "e-Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "Application Queue", to: "/recruitment-basic-list" },
      // { label: "Settings", to: "/recruitment-settings" },
      // { label: "Approved List", to: "/recruitment-assessment-list" },
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
    to: "/shift-control-center",
  },
  {
    label: "Manpower Budget",
    icon: Coins,
    subitems: [
      { label: "Dashboard & Statement", to: "/budget-statement" },
      { label: "Budget Planning Hub", to: "/budget-planning" },
      { label: "My Requisitions", to: "/budget-my-requisitions" },
      { label: "Overtime Control", to: "/budget-overtime" },
    ],
  },
  {
    label: "Transfer",
    icon: RefreshCw,
    subitems: [
      { label: "Transfer History", to: "/transfer-control-center", search: { tab: "history" } },
      { label: "Print Transfer Letter", to: "/transfer-control-center", search: { tab: "print" } },
    ],
  },
  {
    label: "HR Policy",
    to: "/hr-policy",
    icon: FileText,
  },
  {
    label: "JD List",
    to: "/jd-list",
    icon: Briefcase,
  },
  {
    label: "User Management",
    icon: Users,
    subitems: [
      { label: "User List", to: "/user-management" },
      { label: "Permission Management", to: "/permission-management" },
    ],
  },

  {
    label: "Welfare & Support",
    icon: HeartHandshake,
    subitems: [
      {
        label: "Zakat Management",
        subitems: [
          { label: "Budget Configuration", to: "/zakat-budget-configuration" },
          { label: "Zakat List", to: "/zakat-list" },
        ]
      },
      {
        label: "Financial Aid",
        subitems: [
          { label: "Budget Configuration", to: "/financial-aid-budget-configuration" },
          { label: "Financial Aid List", to: "/financial-aid-list" },
        ]
      },
    ],
  },
  {
    label: "Disciplinary Action",
    icon: ShieldAlert,
    subitems: [
      { label: "Case Files", to: "/" },
      { label: "Warning Letters", to: "/" },
      { label: "Show Cause Notices", to: "/" },
    ],
  },
  {
    label: "Manage Overtime",
    icon: Timer,
    subitems: [{ label: "OT Tracking & Submissions", to: "/manage-overtime" }],
  },
  {
    label: "Manage Allowance",
    icon: CreditCard,
    subitems: [
      { label: "Allowance Setup", to: "/" },
      { label: "Employee Allowance", to: "/" },
      { label: "Tax Exemption Rules", to: "/" },
    ],
  },
  {
    label: "Payroll",
    icon: Banknote,
    subitems: [
      {
        label: "Advance",
        subitems: [
          { label: "Advance Req & List", to: "/payroll-advance" },
          { label: "Incentive Allowance", to: "/incentive-allowance" },
        ],
      },
      {
        label: "Loan",
        subitems: [{ label: "Loan Management", to: "/loan-application" }],
      },
      { label: "Deductions", to: "/payroll-deductions" },
      {
        label: "Salary Process",
        subitems: [
          { label: "Monthly Salary Process", to: "/monthly-salary-process" },
          { label: "Advance Salary Process", to: "/advance-salary-process" },
          { label: "Yearly Bonus Process", to: "/yearly-bonus-process" },
        ],
      },
      {
        label: "Benefits",
        subitems: [
          { label: "Master Data", to: "/payroll-benefits-master-data" },
          { label: "Common Benefits", to: "/payroll-benefits-common" },
          { label: "Monthly Benefits", to: "/payroll-benefits-monthly" },
        ],
      },
      {
        label: "Final Settlement",
        subitems: [{ label: "Execute Final Settlement", to: "/payroll-final-settlement-execute" }],
      },
      { label: "Payroll Configuration", to: "/payroll-configure" },
      {
        label: "Reports",
        subitems: [
          { label: "Monthly Salary Details", to: "#" },
          { label: "Monthly Left Salary Sheet", to: "#" },
          { label: "Employee Salary History", to: "#" },
          { label: "Monthly Advance Salary Sheet", to: "#" },
          { label: "Summary Salary Sheet", to: "#" },
          { label: "Employee Tax", to: "#" },
          { label: "Yearly Bonus Report", to: "#" },
          { label: "Bonus Summary Report", to: "#" },
          { label: "Bonus Summary Report(Unit Wise)", to: "#" },
          { label: "Holiday Summary Sheet", to: "#" },
          { label: "Earn Leave Pay Report", to: "#" },
          { label: "Allowance Payment", to: "#" },
          { label: "Final Settlement", to: "#" },
        ],
      },
    ],
  },
  {
    label: "Processes",
    icon: Cpu,
    subitems: [
      { label: "Payroll Processing", to: "/" },
      { label: "End of Month Close", to: "/" },
      { label: "Year End Process", to: "/" },
    ],
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    subitems: [
      { label: "Statutory Compliance", to: "/" },
      { label: "Tax Reports", to: "/" },
      { label: "Audit Logs", to: "/" },
    ],
  },
  {
    label: "Idea Share",
    icon: Lightbulb,
    subitems: [
      { label: "Idea Board", to: "/" },
      { label: "Innovation Submissions", to: "/" },
    ],
  },
  {
    label: "Event",
    icon: CalendarDays,
    subitems: [
      { label: "Upcoming Events", to: "/" },
      { label: "Holiday Celebrations", to: "/" },
      { label: "Team Building", to: "/" },
    ],
  },
];

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const scrollRef = useRef<HTMLElement>(null);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some((sub) => {
          if (sub.to && sub.to !== "/" && sub.to === currentPath) return true;
          if (
            sub.subitems &&
            sub.subitems.some((nested) => nested.to !== "/" && nested.to === currentPath)
          )
            return true;
          return false;
        });
        if (isChildActive) {
          initial[item.label] = true;
        }
        item.subitems.forEach((sub) => {
          if (
            sub.subitems &&
            sub.subitems.some((nested) => nested.to !== "/" && nested.to === currentPath)
          ) {
            initial[sub.label] = true;
          }
        });
      }
    });
    return initial;
  });

  const isMounted = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("sidebar_menus");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOpenMenus((prev) => ({ ...parsed, ...prev }));
        } catch (e) {}
      }
    }
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("sidebar_menus", JSON.stringify(openMenus));
    }
  }, [openMenus]);

  useEffect(() => {
    if (typeof window !== "undefined" && scrollRef.current) {
      const savedScroll = sessionStorage.getItem("sidebar_scroll");
      if (savedScroll) {
        scrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    sessionStorage.setItem("sidebar_scroll", e.currentTarget.scrollTop.toString());
  };

  const toggleMenu = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const filteredNav = nav;

  if (typeof window !== "undefined" && window.location.search.includes("embed=true")) {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
      <Link
        to="/module-selection"
        className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80 group transition-all duration-300 hover:bg-sidebar-accent/30 cursor-pointer relative z-50"
      >
        {/* Beautiful Hover Tooltip */}
        <div className="absolute left-[70px] top-[80%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <LayoutDashboard className="size-3" />
            Switch to Another Module
          </div>
        </div>

        {/* 3D Flip Logo */}
        <div className="relative size-8.5 rounded-xl text-sm tracking-tight [perspective:1000px]">
          <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front: Logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
              C
            </div>
            {/* Back: Back Button */}
            <div className="absolute inset-0 bg-sidebar-primary text-primary-foreground flex items-center justify-center rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md border-2 border-primary/20">
              <ArrowLeft className="size-4.5" />
            </div>
          </div>
        </div>
        
        <div className="leading-tight">
          <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground group-hover:text-primary transition-colors duration-300">
            CRIPTON
          </div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-sidebar-primary">
            HRIS
          </div>
        </div>
      </Link>
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none"
      >
        <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
          Workspace
        </div>
        {filteredNav.map((item) => {
          const Icon = item.icon;

          // Determine parent active state dynamically
          const isParentActive =
            item.to === currentPath ||
            (item.activeRoutes && item.activeRoutes.some((r) => r === currentPath)) ||
            (item.subitems &&
              item.subitems.some((sub) => {
                if (sub.to && sub.to !== "/" && sub.to === currentPath) return true;
                if (
                  sub.subitems &&
                  sub.subitems.some((nested) => nested.to !== "/" && nested.to === currentPath)
                )
                  return true;
                return false;
              }));

          if (!item.subitems) {
            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  search={item.search}
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
            <div
              key={item.label}
              className="space-y-0.5 border-b border-sidebar-border/30 last:border-0 pb-1"
            >
              <button
                onClick={(e) => toggleMenu(item.label, e)}
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
                    isParentActive ? "text-success font-black" : "text-sidebar-foreground/60",
                  ].join(" ")}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md mr-1 leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                    {item.count}
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" />
                ) : (
                  <ChevronRight className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300" />
                )}
              </button>
              <div
                className={[
                  "overflow-hidden transition-all duration-300 space-y-0.5 pl-3.5 bg-sidebar-accent/25 rounded-xl",
                  isOpen ? "max-h-[600px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0",
                ].join(" ")}
              >
                {item.subitems.map((sub) => {
                  if (sub.subitems) {
                    const isSubOpen = openMenus[sub.label];
                    const isSubActive = sub.subitems.some(
                      (nested) => nested.to !== "/" && nested.to === currentPath,
                    );
                    return (
                      <div key={sub.label} className="space-y-0.5">
                        <button
                          onClick={(e) => toggleMenu(sub.label, e)}
                          className={[
                            "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                            isSubActive
                              ? "text-sidebar-foreground font-bold"
                              : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            <File
                              className={[
                                "size-3 shrink-0",
                                isSubActive
                                  ? "text-primary font-black"
                                  : "text-sidebar-foreground/45",
                              ].join(" ")}
                            />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.count !== undefined && sub.count > 0 && (
                            <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                              {sub.count}
                            </span>
                          )}
                          {isSubOpen ? (
                            <ChevronDown className="size-3 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" />
                          ) : (
                            <ChevronRight className="size-3 text-sidebar-foreground/45 transition-transform duration-300" />
                          )}
                        </button>
                        <div
                          className={[
                            "overflow-hidden transition-all duration-300 space-y-0.5 pl-6",
                            isSubOpen
                              ? "max-h-[300px] opacity-100 py-0.5 mt-0.5"
                              : "max-h-0 opacity-0",
                          ].join(" ")}
                        >
                          {sub.subitems.map((nested) => {
                            const isNestedActive = nested.to !== "/" && nested.to === currentPath;
                            return (
                              <Link
                                key={nested.label}
                                to={nested.to}
                                className={[
                                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-medium transition-all duration-150",
                                  isNestedActive
                                    ? "bg-primary/10 text-primary font-bold shadow-2xs"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    isNestedActive ? "bg-primary" : "bg-sidebar-foreground/20",
                                  ].join(" ")}
                                />
                                <span className="truncate">{nested.label}</span>
                                {nested.count !== undefined && nested.count > 0 && (
                                  <span className="ml-auto bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                                    {nested.count}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  const searchParams = routerState.location.search as Record<string, any>;
                  const isSubActive =
                    sub.to &&
                    sub.to !== "/" &&
                    sub.to === currentPath &&
                    (!sub.search ||
                      Object.keys(sub.search).every(
                        (key) => sub.search?.[key] === searchParams[key],
                      ));
                  return (
                    <Link
                      key={sub.label}
                      to={sub.to || "/"}
                      search={sub.search}
                      className={[
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                        isSubActive
                          ? "bg-primary/10 text-primary font-bold shadow-2xs"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      ].join(" ")}
                    >
                      <File
                        className={[
                          "size-3 shrink-0",
                          isSubActive ? "text-primary font-black" : "text-sidebar-foreground/45",
                        ].join(" ")}
                      />
                      <span className="truncate">{sub.label}</span>
                      {sub.count !== undefined && sub.count > 0 && (
                        <span className="ml-auto bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                          {sub.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border/60 space-y-1 bg-sidebar-accent/15">
        <Link
          to="/configure-structure"
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
        >
          <Settings className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />{" "}
          Settings
        </Link>
        <Link
          to="/"
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
        >
          <LifeBuoy className="size-3.5 transition-transform duration-300 group-hover:scale-110" />{" "}
          Help & Support
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("cripton_logged_in_strict");
              window.location.href = "/login";
            }
          }}
          className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all text-left"
        >
          <LogOut className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 text-rose-500" />
          <span className="text-rose-500/90 group-hover:text-rose-500 transition-colors">
            Log Out
          </span>
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
              <div className="text-[11px] font-bold text-sidebar-foreground truncate">
                Tahmid Afsar Shapno
              </div>
              <div className="text-[9px] text-sidebar-foreground/60 truncate font-semibold">
                HR Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
