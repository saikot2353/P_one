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
  Search,
  FileCheck,
  BarChart3,
} from "lucide-react";
import { ModuleLauncher } from "../dashboard/ModuleLauncher";

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

interface MenuSubGroup {
  key: string;
  label: string;
  items: SubCategoryItem[];
}

interface MenuCategory {
  key: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  search?: Record<string, string>;
  subitems?: SubCategoryItem[];
  subGroups?: MenuSubGroup[];
}

// ── Definitive BD RMG ERP Menu Structure ──────────────────────────────────────
const menuCategories: MenuCategory[] = [
  {
    key: "masterSettings",
    label: "MM Settings",
    icon: Settings,
    subGroups: [
      {
        key: "company",
        label: "Company Configuration",
        items: [
          { label: "Company Wise MERC Setting", to: "/merchandising-master-settings", search: { tab: "company-wise-merc-setting" } },
          { label: "Costing Configuration (CPM)", to: "/merchandising-master-settings", search: { tab: "costing-configuration-cpm" } },
          { label: "Payment Terms", to: "/merchandising-master-settings", search: { tab: "payment-terms" } },
        ]
      },
      {
        key: "partners",
        label: "Business Partners",
        items: [
          { label: "Buying House", to: "/merchandising-master-settings", search: { tab: "buying-house" } },
          { label: "Buyer Name", to: "/merchandising-master-settings", search: { tab: "buyer-name" } },
          { label: "Buyer Wise Brand", to: "/merchandising-master-settings", search: { tab: "buyer-wise-brand" } },
          { label: "Buying Agent", to: "/merchandising-master-settings", search: { tab: "buying-agent" } },
          { label: "Supplier", to: "/merchandising-master-settings", search: { tab: "supplier" } },
        ]
      },
      {
        key: "product",
        label: "Product & Garments",
        items: [
          { label: "Item Department", to: "/merchandising-master-settings", search: { tab: "item-department" } },
          { label: "GMT Item Name", to: "/merchandising-master-settings", search: { tab: "gmt-item-name" } },
          { label: "Body Part", to: "/merchandising-master-settings", search: { tab: "body-part" } },
          { label: "Season", to: "/merchandising-master-settings", search: { tab: "season" } },
          { label: "Sample Type", to: "/merchandising-master-settings", search: { tab: "sample-type" } },
          { label: "Size Group", to: "/merchandising-master-settings", search: { tab: "size-group" } },
          { label: "UoM", to: "/merchandising-master-settings", search: { tab: "uom" } },
        ]
      },
      {
        key: "fabric",
        label: "Fabric Masters",
        items: [
          { label: "Fabric GSM", to: "/merchandising-master-settings", search: { tab: "fabric-gsm" } },
          { label: "Fabric Nature", to: "/merchandising-master-settings", search: { tab: "fabric-nature" } },
          { label: "Fabric Construction", to: "/merchandising-master-settings", search: { tab: "fabric-construction" } },
          { label: "Fabric/Yarn Composition", to: "/merchandising-master-settings", search: { tab: "fabric-yarn-composotion" } },
          { label: "Dyeing", to: "/merchandising-master-settings", search: { tab: "dyeing" } },
          { label: "Finishing", to: "/merchandising-master-settings", search: { tab: "finishing" } },
          { label: "Shade Range", to: "/merchandising-master-settings", search: { tab: "shade-range" } },
        ]
      },
      {
        key: "yarn",
        label: "Yarn Masters",
        items: [
          { label: "Yarn Brand", to: "/merchandising-master-settings", search: { tab: "yarn-brand" } },
          { label: "Yarn Type", to: "/merchandising-master-settings", search: { tab: "yarn-type" } },
          { label: "Yarn Count", to: "/merchandising-master-settings", search: { tab: "yarn-count" } },
          { label: "Yarn PO Type", to: "/merchandising-master-settings", search: { tab: "yarn-po-type" } },
          { label: "Yarn PO Settings", to: "/merchandising-master-settings", search: { tab: "yarn-po-settings" } },
        ]
      },
      {
        key: "color",
        label: "Color & Processing",
        items: [
          { label: "Garment & Fabric Color", to: "/merchandising-master-settings", search: { tab: "gmt-fabric-color-name" } },
          { label: "Print/Color Type", to: "/merchandising-master-settings", search: { tab: "fabric-print-color-type" } },
          { label: "Print/Embroidery/Wash Type", to: "/merchandising-master-settings", search: { tab: "print-emb-wash-special-type" } },
          { label: "AOP Process", to: "/merchandising-master-settings", search: { tab: "aop-process" } },
        ]
      },
      {
        key: "costing",
        label: "Costing",
        items: [
          { label: "Additional Cost", to: "/merchandising-master-settings", search: { tab: "additional-cost-entry" } },
          { label: "Process Loss", to: "/merchandising-master-settings", search: { tab: "rmg-process-loss" } },
        ]
      },
      {
        key: "quality",
        label: "Quality",
        items: [
          { label: "Quality Label", to: "/merchandising-master-settings", search: { tab: "quality-label" } },
        ]
      }
    ]
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/merchandising-dashboard",
  },
  {
    key: "capacity",
    label: "Capacity",
    icon: Activity,
    subitems: [
      { label: "Monthly Capacity", to: "/merchandising-monthly-capacity", subActiveKey: "monthly-capacity" },
      { label: "Capacity Allocation", to: "/merchandising-capacity-allocation", subActiveKey: "capacity-allocation" },
      { label: "Capacity Distribution", to: "/merchandising-capacity-distribution", subActiveKey: "capacity-distribution" },
      { label: "Sales Target Entry", to: "/merchandising-sales-target-entry", subActiveKey: "sales-target-entry" },
    ],
  },
  {
    key: "inquiry",
    label: "Inquiry",
    icon: Search,
    to: "/merchandising-inquiry",
    search: { tab: "register" },
  },
  {
    key: "quotation",
    label: "Quotation",
    icon: FileText,
    to: "/merchandising-inquiry",
    search: { tab: "status" },
  },
  {
    key: "po-management",
    label: "PO Management",
    icon: Briefcase,
    to: "/merchandising-order-profile",
  },
  {
    key: "pre-costing",
    label: "Pre Costing",
    icon: TrendingUp,
    to: "/merchandising-inquiry",
    search: { tab: "costing" },
  },
  {
    key: "order-management",
    label: "Order Management",
    icon: Layers,
    subitems: [
      { label: "Order List", to: "/merchandising-order-list", subActiveKey: "order-list" },
      { label: "Cad Consumption Update", to: "/merchandising-order-profile", subActiveKey: "order-profile", search: { tab: "cad" } },
      { label: "Order Profile", to: "/merchandising-order-profile", subActiveKey: "order-profile" },
      { label: "Edit Order All Part", to: "/merchandising-order-profile", subActiveKey: "order-profile", search: { action: "edit" } },
      { label: "PO Ship Date Update", to: "/merchandising-order-profile", subActiveKey: "order-profile", search: { tab: "ship" } },
    ],
  },
  {
    key: "yarn-booking",
    label: "Yarn Booking",
    icon: Wind,
    to: "/merchandising-material-bookings",
    search: { tab: "yarnCalc" },
  },
  {
    key: "fabric-booking",
    label: "Fabric Booking",
    icon: Scissors,
    to: "/merchandising-material-bookings",
    search: { tab: "fabric" },
  },
  {
    key: "workorder",
    label: "Workorder",
    icon: FileCheck,
    subitems: [
      { label: "Dyed Yarn WO", to: "/merchandising-work-orders", subActiveKey: "dyed-yarn-wo", search: { tab: "dyed-yarn" } },
      { label: "Trims WO", to: "/merchandising-work-orders", subActiveKey: "trims-wo", search: { tab: "trims" } },
      { label: "Wash WO", to: "/merchandising-work-orders", subActiveKey: "wash-wo", search: { tab: "wash" } },
      { label: "AOP WO", to: "/merchandising-work-orders", subActiveKey: "aop-wo", search: { tab: "aop" } },
      { label: "Print WO", to: "/merchandising-work-orders", subActiveKey: "print-wo", search: { tab: "print" } },
      { label: "Emb WO", to: "/merchandising-work-orders", subActiveKey: "emb-wo", search: { tab: "emb" } },
      { label: "Sweater Service WO", to: "/merchandising-work-orders", subActiveKey: "sweater-service-wo", search: { tab: "sweater-service" } },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: BarChart3,
    subitems: [
      { label: "Sample Report", to: "/merchandising-reports", subActiveKey: "sample-report", search: { tab: "sample-report" } },
      { label: "Sample Details", to: "/merchandising-reports", subActiveKey: "sample-details", search: { tab: "sample-details" } },
      { label: "Running Sample List", to: "/merchandising-reports", subActiveKey: "running-sample-list", search: { tab: "running-sample-list" } },
      { label: "Sample Report Summary", to: "/merchandising-reports", subActiveKey: "sample-report-summary", search: { tab: "sample-report-summary" } },
      { label: "Capacity & Booking", to: "/merchandising-reports", subActiveKey: "capacity-booking", search: { tab: "capacity-booking" } },
      { label: "Projected and Confirmed Order", to: "/merchandising-reports", subActiveKey: "projected-confirmed-order", search: { tab: "projected-confirmed-order" } },
      { label: "Order Summary", to: "/merchandising-reports", subActiveKey: "order-summary", search: { tab: "order-summary" } },
      { label: "Order Details List", to: "/merchandising-reports", subActiveKey: "order-details-list", search: { tab: "order-details-list" } },
      { label: "Order List- Team Basis", to: "/merchandising-reports", subActiveKey: "order-list-team-basis", search: { tab: "order-list-team-basis" } },
      { label: "Style Wise Order List", to: "/merchandising-reports", subActiveKey: "style-wise-order-list", search: { tab: "style-wise-order-list" } },
      { label: "PO Wise Order Status", to: "/merchandising-reports", subActiveKey: "po-wise-order-status", search: { tab: "po-wise-order-status" } },
      { label: "Date Wise Shipment Report", to: "/merchandising-reports", subActiveKey: "date-wise-shipment-report", search: { tab: "date-wise-shipment-report" } },
      { label: "Order Wise Shipment Status", to: "/merchandising-reports", subActiveKey: "order-wise-shipment-status", search: { tab: "order-wise-shipment-status" } },
      { label: "Buyer Wise Monthly Shipment", to: "/merchandising-reports", subActiveKey: "buyer-wise-monthly-shipment", search: { tab: "buyer-wise-monthly-shipment" } },
      { label: "Monthly Shipment Summary", to: "/merchandising-reports", subActiveKey: "monthly-shipment-summary", search: { tab: "monthly-shipment-summary" } },
      { label: "PO Wise Shipment Status", to: "/merchandising-reports", subActiveKey: "po-wise-shipment-status", search: { tab: "po-wise-shipment-status" } },
      { label: "Order Budget Status", to: "/merchandising-reports", subActiveKey: "order-budget-status", search: { tab: "order-budget-status" } },
      { label: "Order Material Booking Status", to: "/merchandising-reports", subActiveKey: "order-material-booking-status", search: { tab: "order-material-booking-status" } },
      { label: "Yarn Booking Status", to: "/merchandising-reports", subActiveKey: "yarn-booking-status", search: { tab: "yarn-booking-status" } },
      { label: "Fabric Booking Status", to: "/merchandising-reports", subActiveKey: "fabric-booking-status", search: { tab: "fabric-booking-status" } },
      { label: "Work Order Booking Status", to: "/merchandising-reports", subActiveKey: "work-order-booking-status", search: { tab: "work-order-booking-status" } },
      { label: "Order Master Report", to: "/merchandising-reports", subActiveKey: "order-master-report", search: { tab: "order-master-report" } },
      { label: "Order Pre. Vs Post Costing", to: "/merchandising-reports", subActiveKey: "order-pre-post-costing", search: { tab: "order-pre-post-costing" } },
      { label: "Order TNA Status", to: "/merchandising-reports", subActiveKey: "order-tna-status", search: { tab: "order-tna-status" } },
    ],
  },
];

export default function MerchandisingLayout({
  children,
  activePath,
  breadcrumbs,
  title,
}: MerchandisingLayoutProps) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const currentPathname = typeof window !== "undefined" ? window.location.pathname : "";
  const currentTabParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") || "" : "";

  const getInitialExpanded = (pathname: string, tab: string): Record<string, boolean> => {
    const expanded: Record<string, boolean> = {
      masterSettings: false,
      "order-management": false,
      capacity: false,
      workorder: false,
      reports: false,
    };
    
    menuCategories.forEach(cat => {
      if (cat.subitems) {
        const hasActive = cat.subitems.some(sub => {
          return sub.to === pathname && (!sub.search?.tab || sub.search.tab === tab);
        });
        if (hasActive) {
          expanded[cat.key] = true;
        }
      }
      if (cat.subGroups) {
        const hasActive = cat.subGroups.some(g => 
          g.items.some(item => item.to === pathname && (!item.search?.tab || item.search.tab === tab))
        );
        if (hasActive) {
          expanded[cat.key] = true;
        }
      }
    });
    return expanded;
  };

  const getInitialSubGroups = (pathname: string, tab: string): Record<string, boolean> => {
    const expanded: Record<string, boolean> = {};
    menuCategories.forEach(cat => {
      if (cat.subGroups) {
        cat.subGroups.forEach(g => {
          const hasActive = g.items.some(item => item.to === pathname && (!item.search?.tab || item.search.tab === tab));
          if (hasActive) {
            expanded[g.key] = true;
          }
        });
      }
    });
    return expanded;
  };

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => getInitialExpanded(currentPathname, currentTabParam)
  );

  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>(
    () => getInitialSubGroups(currentPathname, currentTabParam)
  );

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    setExpandedSections(getInitialExpanded(currentPathname, currentTabParam));
    setExpandedSubGroups(getInitialSubGroups(currentPathname, currentTabParam));
  }, [activePath, currentPathname, currentTabParam]);

  // Save sidebar scroll position on scroll
  const handleSidebarScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem("merchandising_sidebar_scroll", String(e.currentTarget.scrollTop));
  };

  // Restore scroll position or scroll active item into view
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedScroll = sessionStorage.getItem("merchandising_sidebar_scroll");
      if (savedScroll) {
        const navEl = document.getElementById("merchandising-sidebar-nav");
        if (navEl) {
          navEl.scrollTop = Number(savedScroll);
        }
      } else {
        // Fallback: Scroll the active item into view
        const activeLink = document.querySelector(".bg-teal-500\\/10, .text-teal-600");
        if (activeLink) {
          activeLink.scrollIntoView({ block: "nearest", behavior: "auto" });
        }
      }
    }, 120); // Delay slightly to allow the layout transitions to finish rendering
    return () => clearTimeout(timer);
  }, [currentPathname, currentTabParam]);

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
        <nav id="merchandising-sidebar-nav" onScroll={handleSidebarScroll} className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
            Workspace
          </div>

          {menuCategories.map((cat) => {
            const Icon = cat.icon;

            // ── FLAT DIRECT LINK ─────────────────────────────────────────────
            if (cat.to && !cat.subitems) {
              const isActive = cat.to === currentPathname && (!cat.search?.tab || cat.search.tab === currentTabParam);

              return (
                <Link
                  key={cat.key}
                  to={cat.to}
                  search={cat.search as any}
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

            // ── ACCORDION GROUP WITH SUBGROUPS ───────────────────────────────
            if (cat.subGroups) {
              const isExpanded = expandedSections[cat.key];
              // check if any item in any subGroup is active
              const isParentActive = cat.subGroups.some(
                (g) => g.items.some((item) => {
                  return item.to === currentPathname && (!item.search?.tab || item.search.tab === currentTabParam);
                })
              );

              return (
                <div key={cat.key}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(cat.key)}
                    className={`w-full group flex items-center text-left gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 cursor-pointer ${
                      isParentActive
                        ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-extrabold"
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

                  {/* Sub-Groups Accordions (CSS max-height animation) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-[2500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 py-1 space-y-1.5 border-l border-teal-500/25 ml-[22px] mt-0.5 mb-1">
                      {cat.subGroups.map((group) => {
                        const isSubGroupExpanded = expandedSubGroups[group.key];
                        const isGroupActive = group.items.some((item) => {
                          return item.to === currentPathname && (!item.search?.tab || item.search.tab === currentTabParam);
                        });

                        return (
                          <div key={group.key} className="space-y-0.5">
                            {/* Sub-group Header */}
                            <button
                              onClick={() => {
                                setExpandedSubGroups(prev => ({
                                  ...prev,
                                  [group.key]: !prev[group.key]
                                }));
                              }}
                              className={`w-full text-left text-[11px] font-bold py-1 px-2 rounded-md transition-all duration-150 flex items-center justify-between cursor-pointer ${
                                isGroupActive
                                  ? "text-teal-600 dark:text-teal-400 font-extrabold"
                                  : "text-sidebar-foreground/75 hover:text-teal-500 hover:bg-sidebar-accent/10"
                              }`}
                            >
                              <span>{group.label}</span>
                              <ChevronDown
                                size={11}
                                className={`transition-transform duration-200 ${
                                  isSubGroupExpanded ? "rotate-180 text-teal-500" : "text-sidebar-foreground/40"
                                }`}
                              />
                            </button>

                            {/* Sub-group Items */}
                            {isSubGroupExpanded && (
                              <div className="pl-2.5 py-0.5 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-2">
                                {group.items.map((sub, sIdx) => {
                                  const isSubActive = sub.to === currentPathname && (!sub.search?.tab || sub.search.tab === currentTabParam);
                                  return (
                                    <Link
                                      key={sIdx}
                                      to={sub.to}
                                      search={sub.search as any}
                                      className={`block w-full text-left text-[10.5px] font-medium py-1 px-2 rounded transition-all duration-155 ${
                                        isSubActive
                                          ? "text-teal-500 dark:text-teal-400 bg-teal-500/10 font-bold"
                                          : "text-sidebar-foreground/60 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-sidebar-accent/15"
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
                  </div>
                </div>
              );
            }

            // ── ACCORDION GROUP ──────────────────────────────────────────────
            if (cat.subitems) {
              const isExpanded = expandedSections[cat.key];
              const isParentActive = cat.subitems.some(
                (s) => s.to === currentPathname && (!s.search?.tab || s.search.tab === currentTabParam)
              );

              return (
                <div key={cat.key}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(cat.key)}
                    className={`w-full group flex items-center text-left gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 cursor-pointer ${
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
                      isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-teal-500/25 ml-[22px] mt-0.5 mb-1 max-h-[500px] overflow-y-auto scrollbar-none">
                      {cat.subitems.map((sub, sIdx) => {
                        const isSubActive = sub.to === currentPathname && (!sub.search?.tab || sub.search.tab === currentTabParam);
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
            <ModuleLauncher />
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
