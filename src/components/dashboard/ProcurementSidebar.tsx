import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
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
  { label: "Dashboard", to: "/procurement-dashboard", icon: LayoutDashboard },
  {
    label: "Configuration",
    icon: Settings,
    subitems: [
      { label: "Currency Rate", to: "/procurement-config-currency-rate" },
      { label: "Terms and Condition", to: "/procurement-config-terms" },
      { label: "Purchase Option", to: "/procurement-config-purchase-option" },
      { label: "Supplier Opening", to: "/procurement-config-supplier-opening" },
      { label: "L/C Booking", to: "/procurement-config-lc-booking" },
      { label: "L/C Booking List", to: "/procurement-config-lc-booking-list" },
      { label: "Bank Information", to: "/procurement-config-bank-info" },
      { label: "Bank Accounts", to: "/procurement-config-bank-accounts" },
      { label: "Supplier Name", to: "/procurement-config-supplier-name" },
    ]
  },
  {
    label: "Proforma Invoice",
    icon: FileText,
    subitems: [
      { label: "Create PI", to: "/procurement-pi-create" },
      { label: "PI List", to: "/procurement-pi-list" },
      { label: "Edit DC Price", to: "/procurement-pi-edit-dc-price" },
      { label: "Approve DC Price", to: "/procurement-pi-approve-dc-price" },
      { label: "PI Delete Request", to: "/procurement-pi-delete-request" },
    ]
  },
  {
    label: "Purchase Order",
    icon: ShoppingCart,
    subitems: [
      { label: "Requisition Wise PO", to: "/procurement-po-requisition-wise" },
      { label: "New Purchase Order", to: "/procurement-po-new" },
      { label: "Purchase Order List", to: "/procurement-po-list" },
      { label: "Work Order Approval", to: "/procurement-po-work-order-approval" },
    ]
  },
  {
    label: "Billing",
    icon: CreditCard,
    subitems: [
      { label: "Prepare Bill", to: "/procurement-billing-prepare" },
      { label: "Purchase List", to: "/procurement-billing-purchase-list" },
      { label: "VAT and Tax Register", to: "/procurement-billing-vat-tax-register" },
      { label: "Loan List", to: "/procurement-billing-loan-list" },
      { label: "Edit Bill Rate", to: "/procurement-billing-edit-rate" },
      { label: "Approve Bill Rate", to: "/procurement-billing-approve-rate" },
      { label: "Supplier Bill Record", to: "/procurement-billing-supplier-record" },
      { label: "Supplier Bill Record List", to: "/procurement-billing-supplier-record-list" },
      { label: "Prepare Bill V2", to: "/procurement-billing-prepare-v2" },
      { label: "VAT Tax Entry", to: "/procurement-billing-vat-tax-entry" },
    ]
  },
  {
    label: "Payment",
    icon: Banknote,
    subitems: [
      { label: "Bill Payment", to: "/procurement-payment-bill" },
      { label: "Payment List", to: "/procurement-payment-list" },
    ]
  },
  {
    label: "Audit",
    icon: ShieldCheck,
    subitems: [
      { label: "MRR Audit", to: "/procurement-audit-mrr" },
      { label: "Update Landed Cost", to: "/procurement-audit-landed-cost" },
      { label: "Bill Audit", to: "/procurement-audit-bill" },
    ]
  },
  {
    label: "Reports",
    icon: BarChart3,
    subitems: [
      { label: "Purchase Price", to: "/procurement-reports-purchase-price" },
      { label: "Payment Statement", to: "/procurement-reports-payment-statement" },
      { label: "Yarn Booking & PI Status", to: "/procurement-reports-yarn-booking-pi" },
      { label: "DNC Rate", to: "/procurement-reports-dnc-rate" },
      { label: "Combined PO Statement", to: "/procurement-reports-combined-po" },
    ]
  },
  {
    label: "Comparison Sheet",
    icon: Blocks,
    subitems: [
      { label: "Supplier Items", to: "/procurement-cs-supplier-items" },
      { label: "Create CS Batch", to: "/procurement-cs-create-batch" },
      { label: "CS Batch List", to: "/procurement-cs-batch-list" },
      { label: "Supplier Price", to: "/procurement-cs-supplier-price" },
      { label: "Create Workorder", to: "/procurement-cs-create-workorder" },
    ]
  }
];

export function ProcurementSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const scrollRef = useRef<HTMLElement>(null);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some((sub) => {
          return sub.to === currentPath;
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
            (item.to === currentPath) ||
            (item.subitems &&
              item.subitems.some((sub) => sub.to === currentPath));

          if (!item.subitems) {
            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  className={[
                    "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                    isParentActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-500" />
                  <span>{item.label}</span>
                  {isParentActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
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
                  isOpen ? "max-h-[600px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0",
                ].join(" ")}
              >
                {item.subitems.map((sub) => {
                  const isSubActive = sub.to === currentPath;
                  return (
                    <Link
                      key={sub.label}
                      to={sub.to || "/"}
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
