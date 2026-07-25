import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Scissors,
  Layers,
  FileText,
  Wind,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  ArrowLeft,
  Settings,
  Activity,
  Calendar,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface MerchandisingLayoutProps {
  children: React.ReactNode;
  activePath: string;
  breadcrumbs: BreadcrumbItem[];
  title: string;
}

interface SubCategoryItem {
  label: string;
  to: string;
  subActiveKey?: string;
  search?: Record<string, string>;
}

interface MenuCategory {
  key: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  subitems?: SubCategoryItem[];
}

export default function MerchandisingLayout({
  children,
  activePath,
  breadcrumbs,
  title,
}: MerchandisingLayoutProps) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const getInitialExpanded = (ap: string): Record<string, boolean> => ({
    masterSettings: ap === "masterSettings",
    orders: ap === "order-list" || ap === "order-profile" || ap === "inquiry",
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => getInitialExpanded(activePath)
  );

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    setExpandedSections(getInitialExpanded(activePath));
  }, [activePath]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ── Definitive BD RMG ERP Menu Structure ──────────────────────────────────────
  const menuCategories: MenuCategory[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/merchandising-dashboard",
    },
    {
      // ACCORDION: 5 sub-items, each opens a specific tab on the Master Settings page
      key: "masterSettings",
      label: "Master Settings",
      icon: Settings,
      subitems: [
        {
          label: "Company & Buyer Setup",
          to: "/merchandising-master-settings",
          subActiveKey: "masterSettings",
          search: { tab: "buyers" },
        },
        {
          label: "Material Library (Yarn/Fabric)",
          to: "/merchandising-master-settings",
          subActiveKey: "masterSettings",
          search: { tab: "fabrics" },
        },
        {
          label: "Specifications & Parameters",
          to: "/merchandising-master-settings",
          subActiveKey: "masterSettings",
          search: { tab: "specs" },
        },
        {
          label: "Process & Loss Setup %",
          to: "/merchandising-master-settings",
          subActiveKey: "masterSettings",
          search: { tab: "loss" },
        },
        {
          label: "Financial Config & Trims",
          to: "/merchandising-master-settings",
          subActiveKey: "masterSettings",
          search: { tab: "financial" },
        },
      ],
    },
    {
      // ACCORDION: Inquiry → PO Register → Order Entry (correct BD garments lifecycle)
      key: "orders",
      label: "Orders & Costing",
      icon: Layers,
      subitems: [
        {
          label: "Buyer Inquiry & Quotation",
          to: "/merchandising-inquiry",
          subActiveKey: "inquiry",
        },
        {
          label: "Purchase Order (PO) Register",
          to: "/merchandising-order-list",
          subActiveKey: "order-list",
        },
        {
          label: "Order Entry & Costing (KDS)",
          to: "/merchandising-order-profile",
          subActiveKey: "order-profile",
        },
      ],
    },
    // ── FLAT DIRECT LINKS ──────────────────────────────────────────────────────
    {
      key: "sample",
      label: "Sample & Development",
      icon: Scissors,
      to: "/merchandising-sample-tracker",
    },
    {
      key: "sourcing",
      label: "Material Booking",
      icon: Wind,
      to: "/merchandising-material-bookings",
    },
    {
      key: "services",
      label: "Service Work Orders",
      icon: Briefcase,
      to: "/merchandising-work-orders",
    },
    {
      key: "tna",
      label: "TNA Critical Path",
      icon: Calendar,
      to: "/merchandising-tna-calendar",
    },
    {
      key: "capacity",
      label: "Capacity Planning",
      icon: Activity,
      to: "/merchandising-capacity-planning",
    },
    {
      key: "reports",
      label: "Reports & Analytics",
      icon: TrendingUp,
      to: "/merchandising-reports",
    },
  ];

  return (
    <div
      className={`min-h-screen flex bg-background text-foreground transition-all duration-355 font-sans ${
        theme === "dark"
          ? "dark bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ─────────── SIDEBAR ─────────── */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-10 shadow-lg select-none">

        {/* Brand / Logo */}
        <Link
          to="/module-selection"
          className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80 group transition-all duration-300 hover:bg-sidebar-accent/30 cursor-pointer relative z-50"
        >
          <div className="absolute left-[70px] top-[80%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <LayoutDashboard className="size-3" />
              Switch to Another Module
            </div>
          </div>

          <div className="relative size-8.5 rounded-xl text-sm tracking-tight [perspective:1000px]">
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 font-extrabold text-primary-foreground shadow-[0_4px_12px_rgba(20,184,166,0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
                M
              </div>
              <div className="absolute inset-0 bg-sidebar-primary text-primary-foreground flex items-center justify-center rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md border-2 border-primary/20">
                <ArrowLeft className="size-4.5" />
              </div>
            </div>
          </div>

          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground group-hover:text-primary transition-colors duration-300">
              CRIPTON
            </div>
            <div className="text-[8px] uppercase tracking-[0.12em] font-bold text-teal-600 dark:text-teal-400">
              MERCHANDISING
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
            Workspace
          </div>

          {menuCategories.map((cat) => {
            const Icon = cat.icon;

            // ── FLAT DIRECT LINK ─────────────────────────────────────────────
            if (cat.to && !cat.subitems) {
              const isActive = activePath === cat.key;
              return (
                <Link
                  key={cat.key}
                  to={cat.to}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon
                    className={`size-3.5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "text-teal-500" : ""
                    }`}
                  />
                  <span>{cat.label}</span>
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.7)] animate-pulse" />
                  )}
                </Link>
              );
            }

            // ── ACCORDION GROUP ──────────────────────────────────────────────
            if (cat.subitems) {
              const isExpanded = expandedSections[cat.key];
              const isParentActive = cat.subitems.some(
                (s) => s.subActiveKey === activePath
              );

              return (
                <div key={cat.key}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(cat.key)}
                    className={`w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 cursor-pointer ${
                      isParentActive
                        ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon
                      className={`size-3.5 ${
                        isParentActive
                          ? "text-teal-500"
                          : "text-sidebar-foreground/60 group-hover:scale-110 transition-transform duration-300"
                      }`}
                    />
                    <span>{cat.label}</span>
                    <ChevronDown
                      size={13}
                      className={`ml-auto transition-transform duration-250 ${
                        isExpanded ? "rotate-180 text-teal-500" : "text-sidebar-foreground/40"
                      }`}
                    />
                  </button>

                  {/* Sub-Items (CSS max-height animation) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-teal-500/25 ml-[22px] mt-0.5 mb-1">
                      {cat.subitems.map((sub, sIdx) => {
                        const isSubActive = sub.subActiveKey === activePath;
                        return (
                          <Link
                            key={sIdx}
                            to={sub.to}
                            search={sub.search as any}
                            className={`block w-full text-left text-[11px] font-semibold py-1.5 px-2.5 rounded-md transition-all duration-150 ${
                              isSubActive
                                ? "text-teal-500 dark:text-teal-400 bg-teal-500/10 font-extrabold"
                                : "text-sidebar-foreground/60 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-sidebar-accent/20"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border/30 text-[10px] text-sidebar-foreground/60 font-semibold space-y-1">
          <div>Logged in as Admin</div>
          <div className="text-sidebar-foreground/40">PSKC - Composite Fac.</div>
        </div>
      </aside>

      {/* ─────────── MAIN LAYOUT ─────────── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden relative z-10">
        {/* Topbar */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-lg sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: "/module-selection" })}
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span>Home</span>
                <ChevronRight size={12} />
                <span>Merchandising</span>
                {breadcrumbs.map((bc, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight size={12} />
                    {bc.to ? (
                      <Link to={bc.to} className="hover:text-teal-500 transition-colors">
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="text-teal-500 dark:text-teal-400">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-lg lg:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} />
              )}
            </button>

            <div className="relative cursor-pointer hover:opacity-85 transition-opacity">
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[9px] font-extrabold text-white animate-pulse">
                1
              </span>
              <Bell size={18} className="text-slate-600 dark:text-slate-400" />
            </div>

            <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="leading-tight hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Admin</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
                  Pole Star Knit Composite Ltd.
                </p>
              </div>
              <div className="size-8.5 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md shadow-teal-500/25">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 relative">{children}</div>
      </main>
    </div>
  );
}
