import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Scissors,
  Layers,
  FileText,
  Wind,
  Briefcase,
  BarChart2,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  ArrowLeft,
  Settings,
  Activity
} from "lucide-react";
import { toast } from "sonner";

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

export default function MerchandisingLayout({
  children,
  activePath,
  breadcrumbs,
  title
}: MerchandisingLayoutProps) {
  const navigate = useNavigate();
  
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Sidebar expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    masterSettings: false,
    capacity: false,
    sample: false,
    orders: true, // Expand orders by default
    sourcing: false,
    services: false,
    reports: false,
  });

  useEffect(() => {
    // Detect system theme or match document class
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

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
      [section]: !prev[section]
    }));
  };

  const handleMockClick = (name: string) => {
    toast.info(`Workflow Workspace: ${name}`, {
      description: "This garments merchandising workspace is configured under the master database layout."
    });
  };

interface SubCategoryItem {
  label: string;
  to?: string;
}

interface MenuCategory {
  key: string;
  label: string;
  icon: any;
  to?: string;
  subitems?: SubCategoryItem[];
}

  // Structured menu items matching Bangladesh garments merchandising stages
  const menuCategories: MenuCategory[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/merchandising-dashboard",
    },
    {
      key: "masterSettings",
      label: "Master Settings",
      icon: Settings,
      subitems: [
        { label: "Company & Buyer Setup", to: "/merchandising-master-settings" },
        { label: "Material Library (Yarn/Fabric)", to: "/merchandising-master-settings" },
        { label: "Specifications & Parameters", to: "/merchandising-master-settings" },
        { label: "Process & Loss Setup", to: "/merchandising-master-settings" },
        { label: "Financial Config", to: "/merchandising-master-settings" },
      ],
    },
    {
      key: "capacity",
      label: "Capacity Planning",
      icon: Activity,
      subitems: [
        { label: "Monthly Capacity Booking", to: "/merchandising-capacity-planning" },
        { label: "Capacity Approvals", to: "/merchandising-capacity-planning" },
      ],
    },
    {
      key: "sample",
      label: "Sample & Development",
      icon: Scissors,
      subitems: [
        { label: "Sample Requisition", to: "/merchandising-sample-tracker" },
        { label: "Sample Tracker List", to: "/merchandising-sample-tracker" },
        { label: "Buyer Feedback & PP Approval", to: "/merchandising-sample-tracker" },
      ],
    },
    {
      key: "orders",
      label: "Orders & Costing",
      icon: Layers,
      subitems: [
        { label: "Order Master Ledger", to: "/merchandising-order-list" },
        { label: "Unified Order Entry", to: "/merchandising-order-profile" },
      ],
    },
    {
      key: "sourcing",
      label: "Sourcing & Bookings",
      icon: Wind,
      subitems: [
        { label: "Auto Yarn Booking", to: "/merchandising-material-bookings" },
        { label: "Fabric Booking", to: "/merchandising-material-bookings" },
        { label: "Trims & Accessories WO", to: "/merchandising-material-bookings" },
      ],
    },
    {
      key: "services",
      label: "Service Work Orders",
      icon: Briefcase,
      subitems: [
        { label: "Dyeing Work Orders", to: "/merchandising-work-orders" },
        { label: "Washing & Printing WO", to: "/merchandising-work-orders" },
        { label: "AOP & Embroidery WO", to: "/merchandising-work-orders" },
      ],
    },
    {
      key: "tna",
      label: "TNA Calendar",
      icon: FileText,
      subitems: [
        { label: "TNA Follow-Up Calendar", to: "/merchandising-tna-calendar" },
        { label: "Milestone Tracking Board", to: "/merchandising-tna-calendar" },
      ],
    },
    {
      key: "reports",
      label: "Reports & Analytics",
      icon: TrendingUp,
      subitems: [
        { label: "Daily Order Status Report", to: "/merchandising-reports" },
        { label: "Buyer Share & Shipment", to: "/merchandising-reports" },
        { label: "Material Stock Ledger", to: "/merchandising-reports" },
      ],
    },
  ];

  return (
    <div className={`min-h-screen flex bg-background text-foreground transition-all duration-355 font-sans ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* ─────────── CUSTOM SIDEBAR ─────────── */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-10 shadow-lg select-none">
        
        {/* Brand / Logo */}
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
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 font-extrabold text-primary-foreground shadow-[0_4px_12px_rgba(20,184,166,0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
                M
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
            <div className="text-[8px] uppercase tracking-[0.12em] font-bold text-teal-600 dark:text-teal-400">
              MERCHANDISING
            </div>
          </div>
        </Link>
        
        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-none">
          <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
            Workspace
          </div>

          {menuCategories.map((cat) => {
            const Icon = cat.icon;
            if (cat.to) {
              const isActive = activePath === cat.key;
              return (
                <Link
                  key={cat.key}
                  to={cat.to}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>{cat.label}</span>
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" />
                  )}
                </Link>
              );
            }

            const isExpanded = expandedSections[cat.key];
            return (
              <div key={cat.key} className="space-y-1">
                <button
                  onClick={() => toggleSection(cat.key)}
                  className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground transition-all duration-200"
                >
                  <Icon className="size-3.5 text-sidebar-foreground/60" />
                  <span>{cat.label}</span>
                  <ChevronDown
                    size={13}
                    className={`ml-auto transition-transform duration-200 text-sidebar-foreground/40 ${
                      isExpanded ? "rotate-180 text-teal-500" : ""
                    }`}
                  />
                </button>
                {isExpanded && cat.subitems && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-sidebar-border/40 ml-4.5">
                    {cat.subitems.map((sub, sIdx) => {
                      if (sub.to) {
                        const isSubActive =
                          (sub.to === "/merchandising-order-list" && activePath === "order-list") ||
                          (sub.to === "/merchandising-order-profile" && activePath === "order-profile") ||
                          (sub.to === "/merchandising-master-settings" && activePath === "masterSettings") ||
                          (sub.to === "/merchandising-capacity-planning" && activePath === "capacity") ||
                          (sub.to === "/merchandising-sample-tracker" && activePath === "sample") ||
                          (sub.to === "/merchandising-material-bookings" && activePath === "sourcing") ||
                          (sub.to === "/merchandising-work-orders" && activePath === "services") ||
                          (sub.to === "/merchandising-tna-calendar" && activePath === "tna") ||
                          (sub.to === "/merchandising-reports" && activePath === "reports");
                        return (
                          <Link
                            key={sIdx}
                            to={sub.to}
                            className={`block w-full text-left text-[11px] font-semibold py-1.5 px-2 rounded-md transition ${
                              isSubActive
                                ? "text-teal-500 dark:text-teal-400 bg-sidebar-accent/30 font-extrabold"
                                : "text-sidebar-foreground/65 hover:text-teal-555 hover:bg-sidebar-accent/15"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      }
                      return (
                        <button
                          key={sIdx}
                          onClick={() => handleMockClick(sub.label)}
                          className="block w-full text-left text-[11px] font-semibold py-1.5 px-2 rounded-md text-sidebar-foreground/50 hover:text-teal-555 hover:bg-sidebar-accent/15 transition cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>


        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-sidebar-border/30 text-[10px] text-sidebar-foreground/60 font-semibold space-y-1">
          <div>Logged in as Admin</div>
          <div className="text-sidebar-foreground/40">PSKC - Composite Fac.</div>
        </div>
      </aside>

      {/* ─────────── MAIN LAYOUT CONTAINER ─────────── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden relative z-10">
        
        {/* Custom Header / Topbar */}
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
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {/* Notification Badge */}
            <div className="relative cursor-pointer hover:opacity-85 transition-opacity">
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[9px] font-extrabold text-white animate-pulse">
                1
              </span>
              <Bell size={18} className="text-slate-600 dark:text-slate-400" />
            </div>

            {/* Profile pill matching screenshot */}
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

        {/* Layout main children content */}
        <div className="flex-1 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
