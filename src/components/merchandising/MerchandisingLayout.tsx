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

export default function MerchandisingLayout({
  children,
  activePath,
  breadcrumbs,
  title,
}: MerchandisingLayoutProps) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const getInitialExpanded = (ap: string): Record<string, boolean> => ({
    masterSettings: ap === "masterSettings" || ap === "merchandising-master-settings",
    "order-management": ap === "order-list" || ap === "order-profile" || ap === "merchandising-order-list" || ap === "merchandising-order-profile",
    capacity: ap === "capacity-planning" || ap === "merchandising-capacity-planning",
  });

  const getInitialSubGroups = (searchTab: string): Record<string, boolean> => {
    const mapping: Record<string, string> = {
      "company-wise-merc-setting": "company",
      "costing-configuration-cpm": "company",
      "payment-terms": "company",
      "buying-house": "partners",
      "buyer-name": "partners",
      "buyer-wise-brand": "partners",
      "buying-agent": "partners",
      "supplier": "partners",
      "item-department": "product",
      "gmt-item-name": "product",
      "body-part": "product",
      "season": "season",
      "sample-type": "product",
      "size-group": "product",
      "uom": "product",
      "fabric-gsm": "fabric",
      "fabric-nature": "fabric",
      "fabric-construction": "fabric",
      "fabric-yarn-composotion": "fabric",
      "dyeing": "fabric",
      "finishing": "fabric",
      "shade-range": "fabric",
      "yarn-brand": "yarn",
      "yarn-type": "yarn",
      "yarn-count": "yarn",
      "yarn-po-type": "yarn",
      "yarn-po-settings": "yarn",
      "gmt-fabric-color-name": "color",
      "fabric-print-color-type": "color",
      "print-emb-wash-special-type": "color",
      "aop-process": "color",
      "additional-cost-entry": "costing",
      "rmg-process-loss": "costing",
      "quality-label": "quality",
    };
    return searchTab && mapping[searchTab] ? { [mapping[searchTab]]: true } : {};
  };

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => getInitialExpanded(activePath)
  );

  const initialSearchTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") || "" : "";
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>(
    () => getInitialSubGroups(initialSearchTab)
  );

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    setExpandedSections(getInitialExpanded(activePath));
    const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") || "" : "";
    setExpandedSubGroups(prev => ({ ...prev, ...getInitialSubGroups(currentTab) }));
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
      key: "masterSettings",
      label: "Merchandising Settings",
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
            { label: "Buyer", to: "/merchandising-master-settings", search: { tab: "buyer-name" } },
            { label: "Buyer Brand", to: "/merchandising-master-settings", search: { tab: "buyer-wise-brand" } },
            { label: "Buying Agent", to: "/merchandising-master-settings", search: { tab: "buying-agent" } },
            { label: "Supplier", to: "/merchandising-master-settings", search: { tab: "supplier" } },
          ]
        },
        {
          key: "product",
          label: "Product Masters",
          items: [
            { label: "Item Department", to: "/merchandising-master-settings", search: { tab: "item-department" } },
            { label: "Garment Item", to: "/merchandising-master-settings", search: { tab: "gmt-item-name" } },
            { label: "Body Part", to: "/merchandising-master-settings", search: { tab: "body-part" } },
            { label: "Season", to: "/merchandising-master-settings", search: { tab: "season" } },
            { label: "Sample Type", to: "/merchandising-master-settings", search: { tab: "sample-type" } },
            { label: "Size Group", to: "/merchandising-master-settings", search: { tab: "size-group" } },
            { label: "UOM", to: "/merchandising-master-settings", search: { tab: "uom" } },
          ]
        },
        {
          key: "fabric",
          label: "Fabric Masters",
          items: [
            { label: "Fabric GSM", to: "/merchandising-master-settings", search: { tab: "fabric-gsm" } },
            { label: "Fabric Nature", to: "/merchandising-master-settings", search: { tab: "fabric-nature" } },
            { label: "Fabric Construction", to: "/merchandising-master-settings", search: { tab: "fabric-construction" } },
            { label: "Fabric Composition", to: "/merchandising-master-settings", search: { tab: "fabric-yarn-composotion" } },
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
        { label: "Monthly Capacity", to: "/merchandising-capacity-planning", subActiveKey: "capacity-planning", search: { tab: "monthly" } },
        { label: "Capacity Allocation", to: "/merchandising-capacity-planning", subActiveKey: "capacity-planning", search: { tab: "allocation" } },
        { label: "Capacity Distribution", to: "/merchandising-capacity-planning", subActiveKey: "capacity-planning", search: { tab: "distribution" } },
        { label: "Sales Target Entry", to: "/merchandising-capacity-planning", subActiveKey: "capacity-planning", search: { tab: "sales" } },
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
              const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : "";
              const isActive = cat.search?.tab
                ? (currentTab === cat.search.tab && (activePath === cat.key || activePath === "inquiry" || activePath === "sourcing"))
                : (activePath === cat.key && !currentTab);

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
                  const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : "";
                  return (item.search?.tab === currentTab);
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
                          const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : "";
                          return (item.search?.tab === currentTab);
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
                                  const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : "";
                                  const isSubActive = sub.search?.tab === currentTab;
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
                (s) => s.subActiveKey === activePath
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
                        const currentTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : "";
                        const isSubActive = sub.subActiveKey === activePath && (!sub.search?.tab || sub.search.tab === currentTab);
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
