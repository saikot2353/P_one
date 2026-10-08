import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Settings,
  FileText,
  ShoppingCart,
  CreditCard,
  Banknote,
  ShieldCheck,
  BarChart3,
  Blocks,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  LifeBuoy,
  LogOut,
  File,
  ClipboardCheck,
  Wallet,
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
  activeRoutes?: string[];
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
  { label: "Dashboard", to: "/procurement-dashboard", icon: LayoutDashboard },
  {
    label: "Procurement Master Data",
    icon: Settings,
    subitems: [
      {
        label: "Vendor Category",
        to: "/procurement-master-data",
        search: { tab: "vendor-category" },
      },
      {
        label: "Supplier/Vendor",
        to: "/procurement-master-data",
        search: { tab: "supplier-vendor" },
      },
      {
        label: "Payment Terms",
        to: "/procurement-master-data",
        search: { tab: "payment-terms" },
      },
      {
        label: "Currency",
        to: "/procurement-master-data",
        search: { tab: "currency" },
      },
      {
        label: "Approval Authority",
        to: "/procurement-master-data",
        search: { tab: "approval-authority" },
      },
      {
        label: "Document Configuration",
        to: "/procurement-master-data",
        search: { tab: "document-type-number-series" },
      },
    ],
  },
  {
    label: "Procurement Budget",
    icon: Wallet,
    subitems: [
      {
        label: "Budget Requisition",
        to: "/procurement-master-data",
        search: { tab: "budget" },
      },
      {
        label: "Budget Approval",
        to: "/procurement-master-data",
        search: { tab: "budget-approval" },
      },
    ],
  },
  {
    label: "Requisition Management",
    icon: FileText,
    subitems: [
      {
        label: "Purchase Requisition Register",
        to: "/procurement-purchase-requisition",
      },
      {
        label: "Purchase Requisition Approval",
        to: "/procurement-pr-approval",
      },
      {
        label: "Monthly Budget Requisition",
        to: "/procurement-monthly-budget-requisition",
      },
      {
        label: "Monthly Budget Requisition Approval",
        to: "/procurement-monthly-budget-approval",
      },
    ],
  },
  {
    label: "Quotation Evaluation",
    icon: ClipboardCheck,
    subitems: [
      {
        label: "Comparative Statement",
        to: "/procurement-comparative-statement",
      },
      {
        label: "Comparative Statement Approval",
        to: "/procurement-cs-approval",
      },
    ],
  },
  {
    label: "Order Management",
    icon: ShoppingCart,
    subitems: [
      {
        label: "Purchase Order/Work Order",
        to: "/procurement-po-list",
        activeRoutes: ["/procurement-po-new"],
      },
      {
        label: "Purchase Order/Work Order Approval",
        to: "/procurement-po-work-order-approval",
      },
    ],
  },
  {
    label: "Billing Management",
    icon: CreditCard,
    subitems: [
      {
        label: "Bill Register",
        to: "/procurement-billing-supplier-bill-list",
      },
      {
        label: "New Supplier Bill",
        to: "/procurement-billing-supplier-bill",
      },
      {
        label: "Bill Approval List",
        to: "/procurement-billing-supplier-bill-approval-list",
      },
      {
        label: "Bill Approval",
        to: "/procurement-billing-supplier-bill-approval",
      },
    ],
  },
  { label: "Payment", to: "/procurement-dashboard", icon: Banknote, count: 0 },
  {
    label: "Reports",
    icon: BarChart3,
    subitems: [
      {
        label: "Item-wise Purchase Report",
        to: "/procurement-reports-monthly-purchase",
      },
      {
        label: "Month-wise Supplier Bill Report",
        to: "/procurement-reports-monthly-supplier-bill",
      },
    ],
  },
];

export function ProcurementSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentTab = (routerState.location.search as any)?.tab;
  const effectiveTab =
    currentTab || (currentPath === "/procurement-master-data" ? "vendor-category" : undefined);
  const scrollRef = useRef<HTMLElement>(null);

  const isSubItemActive = (sub: SubItem) => {
    const isPathMatch =
      sub.to === currentPath ||
      (sub.activeRoutes && sub.activeRoutes.includes(currentPath));
    if (!isPathMatch) return false;
    if (sub.search?.tab) {
      return effectiveTab === sub.search.tab;
    }
    return true;
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const searchTab = (routerState.location.search as any)?.tab;
    const effTab =
      searchTab || (currentPath === "/procurement-master-data" ? "vendor-category" : undefined);
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some((sub) => {
          const isPathMatch =
            sub.to === currentPath ||
            (sub.activeRoutes && sub.activeRoutes.includes(currentPath));
          if (!isPathMatch) return false;
          if (sub.search?.tab) {
            return effTab === sub.search.tab;
          }
          return true;
        });
        if (isChildActive) {
          initial[item.label] = true;
        }
      }
    });
    return initial;
  });

  const isMounted = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("procurement_sidebar_menus");
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
      sessionStorage.setItem("procurement_sidebar_menus", JSON.stringify(openMenus));
    }
  }, [openMenus]);

  useEffect(() => {
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some((sub) => isSubItemActive(sub));
        if (isChildActive) {
          setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [currentPath, effectiveTab]);

  useEffect(() => {
    if (typeof window !== "undefined" && scrollRef.current) {
      const savedScroll = sessionStorage.getItem("procurement_sidebar_scroll");
      if (savedScroll) {
        scrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    sessionStorage.setItem("procurement_sidebar_scroll", e.currentTarget.scrollTop.toString());
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

  if (typeof window !== "undefined" && window.location.search.includes("embed=true")) {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
      <Link
        to="/module-selection"
        className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80 group transition-all duration-300 hover:bg-sidebar-accent/30 cursor-pointer relative z-50"
      >
        {/* Switch Module Tooltip */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 font-extrabold text-white shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
              C
            </div>
            {/* Back: Back Button */}
            <div className="absolute inset-0 bg-sidebar-primary text-primary-foreground flex items-center justify-center rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md border-2 border-primary/20">
              <ArrowLeft className="size-4.5" />
            </div>
          </div>
        </div>

        <div className="leading-tight">
          <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground group-hover:text-amber-500 transition-colors duration-300">
            CRIPTON
          </div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-amber-500">
            Procurement
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
        {nav.map((item) => {
          const Icon = item.icon;

          // Determine parent active state dynamically
          const isParentActive =
            item.to === currentPath ||
            (item.subitems && item.subitems.some((sub) => isSubItemActive(sub)));

          const isPlaceholder = item.label !== "Dashboard";

          if (!item.subitems) {
            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  onClick={(e) => {
                    if (isPlaceholder) {
                      e.preventDefault();
                      toast.info(
                        `${item.label} module will be available in future releases. Master Data Management is currently active.`,
                      );
                    }
                  }}
                  className={[
                    "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                    isParentActive && !isPlaceholder
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-500" />
                  <span>{item.label}</span>
                  {isPlaceholder ? (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Soon
                    </span>
                  ) : isParentActive ? (
                    <span className="ml-auto size-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                  ) : null}
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
                  "w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-left transition-all duration-200 font-semibold cursor-pointer",
                  isParentActive
                    ? "bg-sidebar-accent/30 text-sidebar-accent-foreground font-bold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-3.5 transition-colors duration-300 group-hover:scale-110 group-hover:text-amber-500",
                    isParentActive ? "text-amber-500 font-black" : "text-sidebar-foreground/60",
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
                  isOpen ? "max-h-[850px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0",
                ].join(" ")}
              >
                {item.subitems.map((sub) => {
                  const isSubActive = isSubItemActive(sub);

                  return (
                    <Link
                      key={sub.label}
                      to={sub.to || "/"}
                      search={sub.search as any}
                      className={[
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                        isSubActive
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold shadow-2xs"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      ].join(" ")}
                    >
                      <File
                        className={[
                          "size-3 shrink-0",
                          isSubActive ? "text-amber-500 font-black" : "text-sidebar-foreground/45",
                        ].join(" ")}
                      />
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
        <Link
          to="/procurement-config-currency-rate"
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
        >
          <Settings className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />{" "}
          Settings
        </Link>
        <Link
          to="/procurement-dashboard"
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
          className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all text-left cursor-pointer"
        >
          <LogOut className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 text-rose-500" />
          <span className="text-rose-500/90 group-hover:text-rose-500 transition-colors">
            Log Out
          </span>
        </button>
        <div className="mt-3 mx-1 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border hover:border-sidebar-border/80 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="size-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 grid place-items-center text-[10px] font-bold text-white shadow-sm">
                TAS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success border-2 border-sidebar shadow-[0_0_6px_var(--success)]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-sidebar-foreground truncate">
                Tahmid Afsar Shapno
              </div>
              <div className="text-[9px] text-sidebar-foreground/60 truncate font-semibold">
                Procurement Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
