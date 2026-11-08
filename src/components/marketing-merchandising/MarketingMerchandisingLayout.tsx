import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Settings,
  Database,
  FileSpreadsheet,
  Calculator,
  ShoppingCart,
  Layers,
  Scissors,
  Package,
  FileCheck,
  TrendingDown,
  Lock,
  FileText,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  BookmarkCheck,
  Target,
} from "lucide-react";
import { ModuleLauncher } from "../dashboard/ModuleLauncher";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface MMNavSubItem {
  label: string;
  to: string;
  badge?: string;
  subitems?: { label: string; to: string }[];
}

interface MMNavGroup {
  key: string;
  title: string;
  icon: React.ElementType;
  to?: string;
  badge?: string;
  subitems?: MMNavSubItem[];
  hidden?: boolean;
}

interface MarketingMerchandisingLayoutProps {
  children: React.ReactNode;
  activePath: string;
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const navGroups: MMNavGroup[] = [
  {
    key: "dashboard",
    title: "Command Center",
    icon: LayoutDashboard,
    to: "/mm-dashboard",
  },
  {
    key: "policy",
    title: "Company Policy & Configuration",
    icon: Settings,
    to: "/mm-policy-config",
  },
  {
    key: "merchandisingMasterData",
    title: "Merchandising Master Data",
    icon: Database,
    to: "/mm-master-fabric-composition",
    subitems: [
      { label: "Fabric Composition", to: "/mm-master-fabric-composition" },
      { label: "Fabric Type", to: "/mm-master-fabric-type" },
      { label: "Spinning Type", to: "/mm-master-spinning-type" },
      { label: "Yarn Count", to: "/mm-master-yarn-count" },
      { label: "Dyeing Rate", to: "/mm-master-dyeing-rate" },
      { label: "Knitting Process Rate", to: "/mm-master-knitting-rate" },
      { label: "Yarn Rate", to: "/mm-master-yarn-rate" },
    ],
  },
  {
    key: "marketingPlanning",
    title: "Marketing Planning & Performance",
    icon: Target,
    to: "/mm-marketing-target-planning",
    subitems: [
      { label: "Marketing Target Planning", to: "/mm-marketing-target-planning" },
      { label: "Target vs Achievement Report", to: "/mm-target-vs-achievement-report" },
    ],
  },
  {
    key: "quotation",
    title: "Buyer Quotation",
    icon: FileSpreadsheet,
    to: "/mm-buyer-quotation",
    subitems: [
      { label: "Quotation Register", to: "/mm-buyer-quotation" },
      { label: "New Quotation (Woven/Knit)", to: "/mm-buyer-quotation?tab=create" },
    ],
  },
  {
    key: "preCosting",
    title: "Style Pre-Costing",
    icon: Calculator,
    to: "/mm-pre-costing",
    subitems: [
      { label: "Pre-Costing Register", to: "/mm-pre-costing" },
      { label: "Pre Costing Entry", to: "/mm-pre-costing?tab=create" },
      { label: "Pre Costing Register (Knit)", to: "/mm-pre-costing-knit" },
      { label: "Pre Costing Entry (Knit)", to: "/mm-pre-costing-knit?tab=create" },
      { label: "Amendment & Comparison", to: "/mm-pre-costing?tab=compare" },
      { label: "Fabric Consumption (CAD)", to: "/mm-fabric-consumption-cad" },
      { label: "Fabric Consumption Register (Mer)", to: "/mm-fabric-consumption-register" },
      { label: "Fabric Consumption Register (CAD)", to: "/mm-fabric-consumption-cad-register" },
    ],
  },
  {
    key: "orders",
    title: "Confirm Order Entry",
    icon: ShoppingCart,
    to: "/mm-order-entry",
    subitems: [
      { label: "Confirm Order", to: "/mm-order-entry" },
      { label: "Fabric Estimation Register", to: "/mm-fabric-estimation-register" },
      { label: "Accessories Estimation Register", to: "/mm-accessories-estimation-register" },
    ],
  },
  {
    key: "productionFile",
    title: "Production File Management",
    icon: FileCheck,
    to: "/mm-production-file",
    subitems: [
      { label: "Production File", to: "/mm-production-file" },
      { label: "Production File Register", to: "/mm-production-file-register" },
      { label: "Production File Approval", to: "/mm-production-file-approval" },
    ],
  },
  {
    key: "bookingInfo",
    title: "Booking Information",
    icon: BookmarkCheck,
    to: "/mm-fabric-booking-approval",
    subitems: [
      { label: "Fabric Booking Approval", to: "/mm-fabric-booking-approval" },
      { label: "Accessories Booking Approval", to: "/mm-accessories-booking-approval" },
      { label: "Fabric Booking Register", to: "/mm-fabric-booking-register" },
      { label: "Accessories Booking Register", to: "/mm-accessories-booking-register" },
      { label: "Manual Booking Registes (Acc)", to: "/mm-manual-booking-register" },
    ],
  },
  {
    key: "bom",
    title: "BOM Management",
    icon: Layers,
    to: "/mm-bom",
    badge: "Linked",
    hidden: true,
    subitems: [
      { label: "Order BOM List", to: "/mm-bom" },
      { label: "Pre-Cost Item Mapping", to: "/mm-bom?tab=mapping" },
      { label: "Unmatched Items Workflow", to: "/mm-bom?tab=unmatched" },
    ],
  },
  {
    key: "fabric",
    title: "Fabric Estimation & Booking",
    icon: Scissors,
    to: "/mm-fabric-booking",
    hidden: true,
    subitems: [
      { label: "Fabric Bookings Register", to: "/mm-fabric-booking" },
      { label: "New Fabric Booking", to: "/mm-fabric-booking?tab=create" },
      { label: "Fabric Color Breakdown", to: "/mm-fabric-booking?tab=color-breakdown" },
    ],
  },
  {
    key: "accessories",
    title: "Accessories Estimation & Booking",
    icon: Package,
    to: "/mm-accessories-estimation",
    hidden: true,
    subitems: [
      { label: "Accessories Estimation (GR_1308)", to: "/mm-accessories-estimation" },
      { label: "Accessories Booking Register", to: "/mm-accessories-booking" },
      { label: "New Accessories Booking", to: "/mm-accessories-booking?tab=create" },
      { label: "Size-wise Specification", to: "/mm-accessories-booking?tab=spec" },
    ],
  },
  {
    key: "approvalQueue",
    title: "Booking Approval Queue",
    icon: ShieldCheck,
    to: "/mm-booking-approval-queue",
    badge: "Queue",
    hidden: true,
    subitems: [
      { label: "Pending Booking Approvals", to: "/mm-booking-approval-queue" },
      { label: "Budget & Saving Exceptions", to: "/mm-booking-approval-queue?tab=exceptions" },
    ],
  },
  {
    key: "pi",
    title: "PI / Proforma Invoice",
    icon: FileCheck,
    to: "/mm-pi",
    subitems: [
      { label: "PI Register", to: "/mm-pi" },
      { label: "Create PI from Approved Bookings", to: "/mm-proforma-invoice-create" },
      { label: "PI Verification Approval", to: "/mm-pi-verification-approval" },
    ],
  },
  {
    key: "orderClosure",
    title: "Order Closure Control",
    icon: Lock,
    to: "/mm-order-closure",
    subitems: [
      { label: "Active Orders Status", to: "/mm-order-closure" },
      { label: "Closed Orders & Reopening Log", to: "/mm-order-closure?tab=history" },
    ],
  },
  {
    key: "reports",
    title: "Registers & Audit Trail",
    icon: ClipboardList,
    to: "/mm-reports",
    hidden: true,
  },
];

const MM_SIDEBAR_STORAGE_KEY = "cripton_mm_sidebar_open_groups_v1";

// In-memory module cache to preserve user interaction state across route transitions within the MM module
let mmSidebarOpenGroupsCache: Record<string, boolean> = {};

const getInitialOpenGroups = (): Record<string, boolean> => {
  // If cache is present in memory during current module session
  if (Object.keys(mmSidebarOpenGroupsCache).length > 0) {
    return { ...mmSidebarOpenGroupsCache };
  }
  try {
    const saved = sessionStorage.getItem(MM_SIDEBAR_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        mmSidebarOpenGroupsCache = parsed;
        return { ...parsed };
      }
    }
  } catch {
    // fallback
  }
  // All expandable menu groups collapsed by default
  return {};
};

export function MarketingMerchandisingLayout({
  children,
  activePath,
  breadcrumbs,
  title,
  subtitle,
  actions,
}: MarketingMerchandisingLayoutProps) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpenGroups);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    "Merchandising Master Data": true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("cripton_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("cripton_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const nextState = { ...prev, [key]: !prev[key] };
      mmSidebarOpenGroupsCache = nextState;
      try {
        sessionStorage.setItem(MM_SIDEBAR_STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  };

  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-900"} flex flex-col`}>
      {/* ── TOPBAR ───────────────────────────────────────────────────────── */}
      <header className={`h-14 border-b sticky top-0 z-50 px-4 flex items-center justify-between transition-colors ${
        theme === "dark" ? "bg-slate-900/95 border-slate-800 backdrop-blur" : "bg-white/95 border-slate-200 shadow-sm backdrop-blur"
      }`}>
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <Link
            to="/module-selection"
            onClick={() => {
              mmSidebarOpenGroupsCache = {};
              try {
                sessionStorage.removeItem(MM_SIDEBAR_STORAGE_KEY);
              } catch {
                // ignore
              }
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-all border border-emerald-200 dark:border-emerald-800"
            title="Back to Module Selection"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modules</span>
          </Link>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 font-bold text-sm">
              MM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Marketing & Merchandising
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                  New Module
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Enterprise RMG End-to-End Workflow Engine (Woven & Knit)
              </p>
            </div>
          </div>
        </div>

        {/* Global Search and Tools */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Style, PO, Pre-Cost ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-all ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 focus:border-teal-500 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 focus:border-teal-600 text-slate-900 placeholder-slate-400 focus:bg-white"
              }`}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Module Launcher Popover */}
          <ModuleLauncher />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              RI
            </div>
            <div className="hidden lg:block text-left leading-none">
              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Rashidul Islam
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Head of Merchandising
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside
          className={`w-64 lg:w-72 border-r shrink-0 flex flex-col justify-between overflow-y-auto transition-colors select-none ${
            theme === "dark" ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="py-3 px-3 space-y-1">
            <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Navigation Menu</span>
              <span className="text-[10px] font-normal lowercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </div>

            {navGroups
              .filter((group) => !group.hidden)
              .map((group) => {
              const Icon = group.icon;
              const hasSub = Boolean(group.subitems && group.subitems.length > 0);
              const hasActiveChild = Boolean(
                group.subitems &&
                  group.subitems.some(
                    (sub) =>
                      activePath.startsWith(sub.to.split("?")[0]) ||
                      Boolean(
                        sub.subitems &&
                          sub.subitems.some((nested) =>
                            activePath.startsWith(nested.to.split("?")[0])
                          )
                      )
                  )
              );
              const isGroupOpen = openGroups[group.key] ?? hasActiveChild;
              const isActive = activePath.startsWith(group.to || "###") || hasActiveChild;

              return (
                <div key={group.key} className="space-y-0.5">
                  <div className="flex items-center w-full min-w-0">
                    <Link
                      to={group.to}
                      onClick={() => {
                        if (hasSub) {
                          toggleGroup(group.key);
                        }
                      }}
                      title={group.title}
                      className={`flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-bold"
                          : theme === "dark"
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400"
                          }`}
                        />
                        <span className="truncate">{group.title}</span>
                      </div>
                      {group.badge && (
                        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {group.badge}
                          </span>
                        </div>
                      )}
                    </Link>

                    {hasSub && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleGroup(group.key);
                        }}
                        className={`p-1.5 ml-0.5 shrink-0 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300`}
                        title={isGroupOpen ? "Collapse Submenu" : "Expand Submenu"}
                      >
                        {isGroupOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {hasSub && isGroupOpen && (
                    <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 py-0.5 space-y-0.5">
                      {group.subitems!.map((sub, sIdx) => {
                        const hasNested = Boolean(sub.subitems && sub.subitems.length > 0);
                        if (hasNested) {
                          const isNestedActive = sub.subitems!.some((nested) =>
                            activePath.startsWith(nested.to.split("?")[0])
                          );
                          const isSubmenuOpen = openSubmenus[sub.label] ?? isNestedActive;

                          return (
                            <div key={sIdx} className="space-y-0.5 pt-1">
                              <button
                                type="button"
                                onClick={() => toggleSubmenu(sub.label)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                  isNestedActive
                                    ? "text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/50"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                              >
                                <span className="truncate">{sub.label}</span>
                                {isSubmenuOpen ? (
                                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                                )}
                              </button>

                              {isSubmenuOpen && (
                                <div className="ml-3 pl-2.5 border-l border-teal-200/60 dark:border-teal-800/60 space-y-0.5 py-0.5">
                                  {sub.subitems!.map((nested, nIdx) => {
                                    const isChildActive = activePath === nested.to;
                                    return (
                                      <Link
                                        key={nIdx}
                                        to={nested.to}
                                        className={`block px-2 py-1 rounded-md text-[10.5px] transition-colors ${
                                          isChildActive
                                            ? "bg-teal-600 text-white font-bold shadow-xs"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                                        }`}
                                      >
                                        {nested.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        const isSubActive = activePath === sub.to;
                        return (
                          <Link
                            key={sIdx}
                            to={sub.to}
                            className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                              isSubActive
                                ? "bg-teal-50 text-teal-700 font-bold dark:bg-teal-950/70 dark:text-teal-300"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick System Status Card in Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="p-2.5 rounded-lg border border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-950/30">
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-900 dark:text-teal-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Module Health
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">100% OK</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                All 15 company policies active. Old Merchandising isolated and protected.
              </p>
            </div>
          </div>
        </aside>

        {/* ── CONTENT AREA ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Breadcrumb & Title Bar */}
          <div className={`px-6 py-4 border-b shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div>
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Link to="/mm-dashboard" className="hover:text-teal-600 transition-colors">
                  Marketing & Merchandising
                </Link>
                {breadcrumbs.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    {bc.to ? (
                      <Link to={bc.to} className="hover:text-teal-600 transition-colors">
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Title & Subtitle */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h1>
                {subtitle && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    — {subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Page Actions */}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {/* Page Body */}
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default MarketingMerchandisingLayout;
