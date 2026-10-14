import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  FolderTree,
  Factory,
  MapPin,
  Users,
  UserCheck,
  Award,
  BookUser,
  Handshake,
  Briefcase,
  Truck,
  UserPlus,
  ShoppingBag,
  Navigation,
  Package,
  PackageSearch,
  Layers,
  BadgeCheck,
  Palette,
  Scale,
  Warehouse,
  Cpu,
  Boxes,
  Banknote,
  Landmark,
  Coins,
  CalendarClock,
  CreditCard,
  Percent,
  Calculator,
  TrendingUp,
  Target,
  FolderKanban,
  Scissors,
  FileCheck,
  Ship,
  Anchor,
  SlidersHorizontal,
  FileText,
  CalendarDays,
  HelpCircle,
  Tag,
  Hash,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  X,
  Split,
  Clock4,
  Paintbrush,
  CalendarRange,
  Workflow,
  FileSpreadsheet,
  FileBadge,
  ShieldCheck,
} from "lucide-react";

export interface NavSubItem {
  label: string;
  to: string;
  search?: Record<string, any>;
  icon: any;
  description?: string;
  tabKey?: string;
}

export interface NavGroupItem {
  label: string;
  icon: any;
  count?: number;
  subitems: NavSubItem[];
}

export const orgMasterNavGroups: NavGroupItem[] = [
  {
    label: "Organization & Structure",
    icon: Building2,
    count: 5,
    subitems: [
      {
        label: "Company Management",
        to: "/organization-master-setup",
        search: { tab: "company-management" },
        tabKey: "company-management",
        icon: Building2,
        description:
          "Manage company profiles, legal entities, registration details, business info & settings.",
      },
      {
        label: "Organization Structure Management",
        to: "/organization-master-setup",
        search: { tab: "org-structure" },
        tabKey: "org-structure",
        icon: FolderTree,
        description:
          "Maintain business units, divisions, departments, sections, teams & hierarchy.",
      },
      {
        label: "Branch & Factory Management",
        to: "/organization-master-setup",
        search: { tab: "branch-factory" },
        tabKey: "branch-factory",
        icon: Factory,
        description: "Manage head offices, branch offices, factories, plants & operational sites.",
      },
      {
        label: "Production Floor & Line Management",
        to: "/organization-master-setup",
        search: { tab: "floor-line-management" },
        tabKey: "floor-line-management",
        icon: Split,
        description:
          "Manage production floors, sewing lines, cutting tables, finishing sections, line capacities & line supervisors.",
      },
      {
        label: "Location Management",
        to: "/organization-master-setup",
        search: { tab: "location-management" },
        tabKey: "location-management",
        icon: MapPin,
        description: "Maintain countries, divisions, districts, cities, addresses & geography.",
      },
    ],
  },
  {
    label: "People & Contacts",
    icon: Users,
    count: 4,
    subitems: [
      {
        label: "Employee Management",
        to: "/organization-master-setup",
        search: { tab: "employee-management" },
        tabKey: "employee-management",
        icon: UserCheck,
        description: "Maintain common employee directory required across HR, Payroll & Operations.",
      },
      {
        label: "Designation & Position Management",
        to: "/organization-master-setup",
        search: { tab: "designation-position" },
        tabKey: "designation-position",
        icon: Award,
        description:
          "Manage designations, job positions, grades, levels & organizational reporting.",
      },
      {
        label: "Shift & Work Schedule Management",
        to: "/organization-master-setup",
        search: { tab: "shift-schedule" },
        tabKey: "shift-schedule",
        icon: Clock4,
        description:
          "Define factory shifts, general shifts, roster rotations, Ramzan timing, grace periods & overtime cutoff rules.",
      },
      {
        label: "Contact Management",
        to: "/organization-master-setup",
        search: { tab: "contact-management" },
        tabKey: "contact-management",
        icon: BookUser,
        description:
          "Maintain contact persons, designations, phones & emails for business partners.",
      },
    ],
  },
  {
    label: "Business Partner Management",
    icon: Handshake,
    count: 5,
    subitems: [
      {
        label: "Business Partner Management",
        to: "/organization-master-setup",
        search: { tab: "business-partners" },
        tabKey: "business-partners",
        icon: Briefcase,
        description:
          "Manage external entities: agents, distributors, dealers, contractors & consultants.",
      },
      {
        label: "Supplier Management",
        to: "/organization-master-setup",
        search: { tab: "supplier-management" },
        tabKey: "supplier-management",
        icon: Truck,
        description:
          "Supplier & vendor profiles, contact details, registrations & classifications.",
      },
      {
        label: "Customer Management",
        to: "/organization-master-setup",
        search: { tab: "customer-management" },
        tabKey: "customer-management",
        icon: UserPlus,
        description: "Customer profiles, contact info, billing/shipping addresses & categories.",
      },
      {
        label: "Buyer Management",
        to: "/organization-master-setup",
        search: { tab: "buyer-management" },
        tabKey: "buyer-management",
        icon: ShoppingBag,
        description: "Buyer profiles, buying houses, buyer contacts & merchandising details.",
      },
      {
        label: "Transporter & Logistics Management",
        to: "/organization-master-setup",
        search: { tab: "transporter-logistics" },
        tabKey: "transporter-logistics",
        icon: Navigation,
        description: "Freight forwarders, shipping agents, C&F partners & logistics providers.",
      },
    ],
  },
  {
    label: "Product & Item Management",
    icon: Package,
    count: 6,
    subitems: [
      {
        label: "Item Management",
        to: "/organization-master-setup",
        search: { tab: "item-management" },
        tabKey: "item-management",
        icon: PackageSearch,
        description: "Centralized item master: codes, names, specs, types & inventory tracking.",
      },
      {
        label: "Item Category Management",
        to: "/organization-master-setup",
        search: { tab: "item-categories" },
        tabKey: "item-categories",
        icon: Layers,
        description: "Item categories, subcategories, product groups & families.",
      },
      {
        label: "Brand & Manufacturer Management",
        to: "/organization-master-setup",
        search: { tab: "brand-manufacturer" },
        tabKey: "brand-manufacturer",
        icon: BadgeCheck,
        description: "Product brands, brand owners, manufacturers & identification.",
      },
      {
        label: "Product Variant Management",
        to: "/organization-master-setup",
        search: { tab: "product-variants" },
        tabKey: "product-variants",
        icon: Palette,
        description: "Variations such as size, color, model, dimensions & attributes.",
      },
      {
        label: "Color Library & Size Matrix Management",
        to: "/organization-master-setup",
        search: { tab: "color-size-matrix" },
        tabKey: "color-size-matrix",
        icon: Paintbrush,
        description:
          "Standardized Pantone TCX/TPX shade library, color codes, size range breakdowns & dimension matrices.",
      },
      {
        label: "Unit of Measurement Management",
        to: "/organization-master-setup",
        search: { tab: "uom-management" },
        tabKey: "uom-management",
        icon: Scale,
        description: "Units of measurement (pcs, kg, mtr, yds, ltr) & conversion rules.",
      },
    ],
  },
  {
    label: "Warehouse & Asset References",
    icon: Warehouse,
    count: 3,
    subitems: [
      {
        label: "Warehouse & Store Management",
        to: "/organization-master-setup",
        search: { tab: "warehouse-store" },
        tabKey: "warehouse-store",
        icon: Warehouse,
        description: "Warehouse, factory store, stockroom & storage location master.",
      },
      {
        label: "Machine & Equipment Management",
        to: "/organization-master-setup",
        search: { tab: "machine-equipment" },
        tabKey: "machine-equipment",
        icon: Cpu,
        description: "Machine identification, serials, plant location & reference data.",
      },
      {
        label: "Asset Category Management",
        to: "/organization-master-setup",
        search: { tab: "asset-categories" },
        tabKey: "asset-categories",
        icon: Boxes,
        description: "Fixed asset categories, depreciation classes & classifications.",
      },
    ],
  },
  {
    label: "Finance & Payment References",
    icon: Banknote,
    count: 8,
    subitems: [
      {
        label: "Fiscal Year & Financial Period Management",
        to: "/organization-master-setup",
        search: { tab: "fiscal-year-period" },
        tabKey: "fiscal-year-period",
        icon: CalendarRange,
        description:
          "Manage financial years, statutory tax years, fiscal quarters, monthly closing periods & accounting lock dates.",
      },
      {
        label: "Bank & Bank Branch Management",
        to: "/organization-master-setup",
        search: { tab: "bank-branch" },
        tabKey: "bank-branch",
        icon: Landmark,
        description: "Bank & branch info for payments, payroll disbursement & accounts.",
      },
      {
        label: "Currency & Exchange Rate Management",
        to: "/organization-master-setup",
        search: { tab: "currency-exchange" },
        tabKey: "currency-exchange",
        icon: Coins,
        description: "Currencies, exchange rates, validity dates & international financial terms.",
      },
      {
        label: "Payment Terms Management",
        to: "/organization-master-setup",
        search: { tab: "payment-terms" },
        tabKey: "payment-terms",
        icon: CalendarClock,
        description: "Payment conditions, credit periods, due-date rules & settlement terms.",
      },
      {
        label: "Payment Method Management",
        to: "/organization-master-setup",
        search: { tab: "payment-methods" },
        tabKey: "payment-methods",
        icon: CreditCard,
        description: "Payment channels: cash, bank transfer, cheque, digital wallets.",
      },
      {
        label: "Tax & VAT Configuration",
        to: "/organization-master-setup",
        search: { tab: "tax-vat" },
        tabKey: "tax-vat",
        icon: Percent,
        description: "Tax types, VAT codes, withholding tax rates & applicability rules.",
      },
      {
        label: "Cost Center Management",
        to: "/organization-master-setup",
        search: { tab: "cost-centers" },
        tabKey: "cost-centers",
        icon: Calculator,
        description: "Departmental, plant & project cost centers for expense tracking.",
      },
      {
        label: "Profit Center Management",
        to: "/organization-master-setup",
        search: { tab: "profit-centers" },
        tabKey: "profit-centers",
        icon: TrendingUp,
        description: "Revenue & profit centers for business unit performance evaluation.",
      },
    ],
  },
  {
    label: "Project & Business Operations",
    icon: Target,
    count: 4,
    subitems: [
      {
        label: "Project & Order Management",
        to: "/organization-master-setup",
        search: { tab: "project-order" },
        tabKey: "project-order",
        icon: FolderKanban,
        description: "Common project & order master references across ERP modules.",
      },
      {
        label: "Buyer Style & Season Management",
        to: "/organization-master-setup",
        search: { tab: "style-season" },
        tabKey: "style-season",
        icon: Scissors,
        description: "Garment styles, seasons, fashion collections & development references.",
      },
      {
        label: "Process & Operation Master",
        to: "/organization-master-setup",
        search: { tab: "process-operations" },
        tabKey: "process-operations",
        icon: Workflow,
        description:
          "Define standard garment production processes, routing steps, operation bulletins & SMV/SAM benchmarks.",
      },
      {
        label: "Contract & Terms Management",
        to: "/organization-master-setup",
        search: { tab: "contract-terms" },
        tabKey: "contract-terms",
        icon: FileCheck,
        description: "Standard contract types, agreements & reusable business terms.",
      },
    ],
  },
  {
    label: "Commercial & Logistics References",
    icon: Ship,
    count: 3,
    subitems: [
      {
        label: "Shipping & Trade Reference Management",
        to: "/organization-master-setup",
        search: { tab: "shipping-trade" },
        tabKey: "shipping-trade",
        icon: Anchor,
        description: "Shipping methods, ports, customs stations, classifications & Incoterms.",
      },
      {
        label: "HS Code & Customs Tariff Management",
        to: "/organization-master-setup",
        search: { tab: "hscode-customs-tariff" },
        tabKey: "hscode-customs-tariff",
        icon: FileSpreadsheet,
        description:
          "Harmonized System (HS) codes, customs tariff classes, duty rates (CD, RD, SD, VAT, AIT) & import/export regulations.",
      },
      {
        label: "Bond, License & Quota Management",
        to: "/organization-master-setup",
        search: { tab: "bond-license-quota" },
        tabKey: "bond-license-quota",
        icon: FileBadge,
        description:
          "Bonded warehouse license registers, BGMEA/BKMEA numbers, ERC/IRC certificates, UD authority & export quotas.",
      },
    ],
  },
  {
    label: "Common Reference & Configuration",
    icon: SlidersHorizontal,
    count: 7,
    subitems: [
      {
        label: "Approval Matrix & Delegation of Authority (DoA)",
        to: "/organization-master-setup",
        search: { tab: "approval-matrix-doa" },
        tabKey: "approval-matrix-doa",
        icon: ShieldCheck,
        description:
          "Delegation of authority rules, approval limit thresholds, hierarchical signing tiers & multi-level workflow controls.",
      },
      {
        label: "Compliance & Audit Certification Management",
        to: "/organization-master-setup",
        search: { tab: "compliance-certifications" },
        tabKey: "compliance-certifications",
        icon: BadgeCheck,
        description:
          "Factory social and technical compliance standards (BSCI, WRAP, SEDEX, OEKO-TEX, GOTS, ISO) & audit validity.",
      },
      {
        label: "Document Type Management",
        to: "/organization-master-setup",
        search: { tab: "document-types" },
        tabKey: "document-types",
        icon: FileText,
        description: "Standard document types & classifications across HR, Accounts & Operations.",
      },
      {
        label: "Calendar & Holiday Management",
        to: "/organization-master-setup",
        search: { tab: "calendar-holidays" },
        tabKey: "calendar-holidays",
        icon: CalendarDays,
        description: "Working calendars, weekly holidays, public holidays & production schedules.",
      },
      {
        label: "Reason Code Management",
        to: "/organization-master-setup",
        search: { tab: "reason-codes" },
        tabKey: "reason-codes",
        icon: HelpCircle,
        description: "Standard reason codes for cancellations, adjustments & returns.",
      },
      {
        label: "Common Classification Management",
        to: "/organization-master-setup",
        search: { tab: "common-classifications" },
        tabKey: "common-classifications",
        icon: Tag,
        description: "Universal classifications, categories & multi-module reference values.",
      },
      {
        label: "Document Numbering Management",
        to: "/organization-master-setup",
        search: { tab: "document-numbering" },
        tabKey: "document-numbering",
        icon: Hash,
        description: "Prefixes, numbering masks, sequences & centralized document rules.",
      },
    ],
  },
];

interface OrgMasterSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function OrgMasterSidebar({ isMobileOpen = false, onCloseMobile }: OrgMasterSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentTab =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tab") || ""
      : "";

  const scrollRef = useRef<HTMLElement>(null);
  const isTransitioning = useRef(false);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      "Organization & Structure": true, // Default open first group
    };

    orgMasterNavGroups.forEach((group) => {
      const hasActiveChild = group.subitems.some((sub) => {
        if (sub.tabKey && currentTab && sub.tabKey === currentTab) return true;
        return sub.to === currentPath && !sub.search?.tab;
      });
      if (hasActiveChild) {
        initial[group.label] = true;
      }
    });

    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("org_master_sidebar_menus");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...parsed, ...initial };
        } catch (e) {}
      }
    }
    return initial;
  });

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("org_master_sidebar_menus", JSON.stringify(openMenus));
    }
  }, [openMenus]);

  useEffect(() => {
    if (typeof window !== "undefined" && scrollRef.current) {
      const savedScroll = sessionStorage.getItem("org_master_sidebar_scroll");
      if (savedScroll) {
        const targetScroll = parseInt(savedScroll, 10);
        scrollRef.current.scrollTop = targetScroll;
        const timer = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = targetScroll;
          }
        }, 60);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (isTransitioning.current) return;
    sessionStorage.setItem("org_master_sidebar_scroll", e.currentTarget.scrollTop.toString());
  };

  const handleNavClick = () => {
    isTransitioning.current = true;
    setTimeout(() => {
      isTransitioning.current = false;
    }, 400);
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

  const isDashboardActive = currentPath === "/organization-master-setup" && !currentTab;

  const sidebarContent = (
    <>
      {/* Brand Header with 3D Flip Logo */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-sidebar-border/80">
        <Link
          to="/module-selection"
          className="flex items-center gap-3 group transition-all duration-300 hover:opacity-90 cursor-pointer relative z-50 flex-1 min-w-0"
        >
          {/* Hover Tooltip */}
          <div className="absolute left-[70px] top-[80%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <LayoutDashboard className="size-3" />
              Switch to Another Module
            </div>
          </div>

          {/* 3D Flip Logo */}
          <div className="relative size-9 rounded-xl text-sm tracking-tight [perspective:1000px] shrink-0">
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

          <div className="leading-tight min-w-0">
            <div className="font-black tracking-tight text-[13.5px] text-sidebar-foreground group-hover:text-primary transition-colors duration-300 truncate">
              CRIPTON
            </div>
            <div className="text-[9.5px] uppercase tracking-[0.22em] font-extrabold text-sidebar-primary truncate">
              ORG MASTER
            </div>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground"
            title="Close Sidebar"
          >
            <X className="size-4.5" />
          </button>
        )}
      </div>

      {/* Nav Scroll Area */}
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={handleNavClick}
        className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto scrollbar-none"
      >
        <div className="px-2.5 pb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-sidebar-foreground/50">
          Enterprise Master Workspace
        </div>

        {/* Master Dashboard Link */}
        <div className="border-b border-sidebar-border/30 pb-2 mb-2">
          <Link
            to="/organization-master-setup"
            onClick={() => onCloseMobile?.()}
            className={[
              "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-200",
              isDashboardActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs font-bold"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            ].join(" ")}
          >
            <LayoutDashboard className="size-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-sidebar-primary shrink-0" />
            <span className="truncate flex-1">Master Overview Hub</span>
            {isDashboardActive && (
              <span className="size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" />
            )}
          </Link>
        </div>

        {/* 9 Organized Sections with 45 Submenus */}
        {orgMasterNavGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = openMenus[group.label];

          // Check if any sub-item in this group is active
          const isGroupActive = group.subitems.some((sub) => {
            if (sub.tabKey && currentTab && sub.tabKey === currentTab) return true;
            return sub.to === currentPath && !sub.search?.tab && !currentTab;
          });

          return (
            <div
              key={group.label}
              className="space-y-0.5 border-b border-sidebar-border/30 last:border-0 pb-1.5"
            >
              <button
                onClick={(e) => toggleMenu(group.label, e)}
                className={[
                  "w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12.5px] text-left transition-all duration-200 font-semibold",
                  isGroupActive
                    ? "bg-sidebar-accent/40 text-sidebar-accent-foreground font-bold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <GroupIcon
                  className={[
                    "size-4 transition-colors duration-300 group-hover:scale-110 group-hover:text-sidebar-primary shrink-0",
                    isGroupActive ? "text-primary font-black" : "text-sidebar-foreground/60",
                  ].join(" ")}
                />
                <span className="flex-1 truncate">{group.label}</span>
                {isOpen ? (
                  <ChevronDown className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180 shrink-0" />
                ) : (
                  <ChevronRight className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 shrink-0" />
                )}
              </button>

              {/* Sub-menu drawer */}
              <div
                className={[
                  "overflow-hidden transition-all duration-300 space-y-0.5 pl-3 bg-sidebar-accent/25 rounded-xl",
                  isOpen ? "max-h-[800px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0",
                ].join(" ")}
              >
                {group.subitems.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive =
                    sub.tabKey && currentTab
                      ? sub.tabKey === currentTab
                      : sub.to === currentPath && !sub.search?.tab && !currentTab;

                  return (
                    <Link
                      key={sub.label}
                      to={sub.to}
                      search={sub.search}
                      onClick={() => onCloseMobile?.()}
                      className={[
                        "group/sub flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all duration-200",
                        isSubActive
                          ? "bg-sidebar-primary/10 text-sidebar-primary font-bold shadow-2xs"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground font-medium",
                      ].join(" ")}
                    >
                      <SubIcon className="size-3.5 shrink-0 text-sidebar-foreground/55 group-hover/sub:text-sidebar-primary transition-colors" />
                      <span className="truncate flex-1">{sub.label}</span>
                      {isSubActive && (
                        <span className="size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-sidebar-border/80 text-[10.5px] text-sidebar-foreground/50 flex items-center justify-between">
        <span className="font-semibold">Org Master Setup</span>
        <span className="font-mono">v1.0.0</span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop & Laptop Sidebar: Balanced width (w-76 md:w-[320px] lg:w-[330px]) */}
      <aside className="hidden md:flex w-76 md:w-[320px] lg:w-[330px] h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 select-none shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible on < md when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[310px] max-w-[85vw] h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl z-10 select-none animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
