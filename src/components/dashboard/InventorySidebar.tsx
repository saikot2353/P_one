import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Blocks,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  LifeBuoy,
  LogOut,
  File,
  Wrench,
  Download,
  Upload,
  PackageOpen,
  RotateCcw,
  Undo2,
  ShieldCheck,
  ArrowLeftRight,
  SlidersHorizontal,
  FileX2,
  BarChart3,
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
  { label: "Dashboard", to: "/inv-dashboard", icon: LayoutDashboard },
  {
    label: "Inventory Master Data",
    icon: Settings,
    subitems: [
      {
        label: "Warehouse/Store",
        to: "/inventory-configuration",
        search: { tab: "warehouse-store" },
      },
      {
        label: "Location/Batch Setup",
        to: "/inventory-configuration",
        search: { tab: "store-location" },
      },
      {
        label: "Item Group",
        to: "/inventory-configuration",
        search: { tab: "item-group" },
      },
      {
        label: "Item Creation",
        to: "/inventory-configuration",
        search: { tab: "item-sub-group" },
      },
      {
        label: "Item Category",
        to: "/inventory-configuration",
        search: { tab: "item-category" },
      },
      {
        label: "Brand",
        to: "/inventory-configuration",
        search: { tab: "brand" },
      },
      {
        label: "Origin",
        to: "/inventory-configuration",
        search: { tab: "origin" },
      },
      {
        label: "Unit of Measurement",
        to: "/inventory-configuration",
        search: { tab: "uom" },
      },
    ],
  },
  {
    label: "Material Request",
    icon: FileText,
    subitems: [
      {
        label: "Request Register",
        to: "/inv-material-requisition-list",
      },
      {
        label: "New Request",
        to: "/inv-material-requisition",
      },
      {
        label: "Request Approval",
        to: "/inv-material-requisition-approval-list",
      },
    ],
  },
  {
    label: "Material Issuance",
    icon: PackageOpen,
    subitems: [
      {
        label: "Issue Register",
        to: "/inv-issue-list",
      },
      {
        label: "New Issue",
        to: "/inv-issue-regular",
      },
    ],
  },
  {
    label: "Material Receiving",
    icon: Package,
    subitems: [
      {
        label: "Receipt Register",
        to: "/procurement-material-receive-list",
      },
      {
        label: "New Receipt",
        to: "/inv-receive-mrr",
      },
      {
        label: "Direct Receipt Register",
        to: "/inv-direct-mrr-list",
      },
      {
        label: "New Direct Receipt",
        to: "/inv-receive-direct",
      },
    ],
  },
  {
    label: "Supplier Returns",
    icon: Undo2,
    subitems: [
      {
        label: "Return Register",
        to: "/inv-supplier-return-list",
      },
      {
        label: "New Supplier Return",
        to: "/inv-issue-mrr-return",
      },
    ],
  },
  {
    label: "Store Returns",
    icon: RotateCcw,
    subitems: [
      {
        label: "Return Register",
        to: "/inv-return-to-store-list",
      },
      {
        label: "New Return",
        to: "/inv-issue-return",
      },
      {
        label: "Return Receiving Register",
        to: "/inv-store-return-receive-list",
      },
      {
        label: "New Return Receipt",
        to: "/inv-store-return-receive",
      },
    ],
  },
  {
    label: "Stock Transfers",
    icon: ArrowLeftRight,
    subitems: [
      {
        label: "Requisition Register",
        to: "/inv-transfer-requisition-list",
      },
      {
        label: "New Requisition",
        to: "/inv-transfer-requisition",
      },
      {
        label: "Requisition Approval",
        to: "/inv-transfer-requisition-approval",
      },
      {
        label: "Transfer Issue Register",
        to: "/inv-transfer-issue-list",
      },
      {
        label: "New Transfer Issue",
        to: "/inv-intercompany-transfer",
      },
      {
        label: "Transfer Receiving Register",
        to: "/inv-intercompany-receive-list",
      },
      {
        label: "New Transfer Receipt",
        to: "/inv-intercompany-receive",
      },
    ],
  },
  {
    label: "Stock Adjustments",
    icon: SlidersHorizontal,
    subitems: [
      {
        label: "Adjustment Register",
        to: "/inv-stock-adjustment-list",
      },
      {
        label: "New Adjustment",
        to: "/inv-stock-adjustment",
      },
    ],
  },
  {
    label: "Stock Write-Offs",
    icon: FileX2,
    subitems: [
      {
        label: "Write-Off Register",
        to: "/inv-stock-writeoff-list",
      },
      {
        label: "New Write-Off",
        to: "/inv-stock-writeoff",
      },
      {
        label: "Write-Off Approval",
        to: "/inv-stock-writeoff-approval-list",
      },
    ],
  },
  {
    label: "Opening Stock",
    icon: Package,
    subitems: [
      {
        label: "Opening Stock Register",
        to: "/inv-opening-stock-list",
      },
      {
        label: "New Opening Stock",
        to: "/inv-yarn-opening-stock",
      },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    subitems: [
      {
        label: "Stock Balance Register",
        to: "/inv-report-stock-balance",
      },
      {
        label: "Item Stock Register",
        to: "/inv-report-item-stock",
      },
      {
        label: "Item Transaction Ledger",
        to: "/inv-report-transaction-ledger",
      },
      {
        label: "Batch Stock Register",
        to: "/inv-report-batch-stock",
      },
      {
        label: "Location Stock Register",
        to: "/inv-report-location-stock",
      },
      {
        label: "Item Receipt Register",
        to: "/inv-report-receipt-register",
      },
      {
        label: "Item Issue Register",
        to: "/inv-report-issue-register",
      },
      {
        label: "Stock Transfer Register",
        to: "/inv-report-stock-transfer",
      },
      {
        label: "Stock Write-Off Register",
        to: "/inv-report-stock-writeoff",
      },
      {
        label: "Stock Valuation Register",
        to: "/inv-report-stock-valuation",
      },
      {
        label: "Month-wise Material Receive",
        to: "/inv-report-monthly-receive",
      },
      {
        label: "Month-wise Material Issue",
        to: "/inv-report-monthly-issue",
      },
      {
        label: "Month-wise Supplier Return",
        to: "/inv-report-monthly-supplier-return",
      },
    ],
  },
];

export function InventorySidebar() {
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
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some(
          (sub) =>
            sub.to === currentPath ||
            (sub.subitems && sub.subitems.some((n) => n.to === currentPath))
        );
        if (isChildActive) {
          setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [currentPath]);

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
    <aside className="hidden lg:flex w-80 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
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
            Inventory
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

          const isPlaceholder = item.label !== "Dashboard";

          if (!item.subitems) {
            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  search={item.search}
                  onClick={(e) => {
                    if (isPlaceholder) {
                      e.preventDefault();
                      toast.info(
                        `${item.label} module will be available in future releases. Inventory Control Center is currently active.`,
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
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-sidebar-primary" />
                  <span className="truncate" title={item.label}>{item.label}</span>
                  {isPlaceholder ? (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Soon
                    </span>
                  ) : isParentActive ? (
                    <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" />
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
                <span className="flex-1 truncate" title={item.label}>{item.label}</span>
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
                            <span className="truncate" title={sub.label}>{sub.label}</span>
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
                            "overflow-hidden transition-all duration-300 space-y-0.5 pl-4.5",
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
                                <span className="truncate" title={nested.label}>{nested.label}</span>
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
                      <span className="truncate" title={sub.label}>{sub.label}</span>
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
