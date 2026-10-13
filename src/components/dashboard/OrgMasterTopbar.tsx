import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Search,
  MessagesSquare,
  Sun,
  Moon,
  RefreshCw,
  User,
  Globe,
  Fingerprint,
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
  X,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { ModuleLauncher } from "./ModuleLauncher";

export interface MasterSearchItem {
  label: string;
  parent: string;
  tabKey: string;
  description: string;
  icon: any;
}

export const masterSearchableItems: MasterSearchItem[] = [
  // 1. Organization & Structure
  {
    label: "Company Management",
    parent: "Organization & Structure",
    tabKey: "company-management",
    description:
      "Manage company profiles, legal entities, registration details, business info & settings.",
    icon: Building2,
  },
  {
    label: "Organization Structure Management",
    parent: "Organization & Structure",
    tabKey: "org-structure",
    description: "Maintain business units, divisions, departments, sections, teams & hierarchy.",
    icon: FolderTree,
  },
  {
    label: "Branch & Factory Management",
    parent: "Organization & Structure",
    tabKey: "branch-factory",
    description: "Manage head offices, branch offices, factories, plants & operational sites.",
    icon: Factory,
  },
  {
    label: "Location Management",
    parent: "Organization & Structure",
    tabKey: "location-management",
    description: "Maintain countries, divisions, districts, cities, addresses & geography.",
    icon: MapPin,
  },

  // 2. People & Contacts
  {
    label: "Employee Management",
    parent: "People & Contacts",
    tabKey: "employee-management",
    description: "Maintain common employee directory required across HR, Payroll & Operations.",
    icon: UserCheck,
  },
  {
    label: "Designation & Position Management",
    parent: "People & Contacts",
    tabKey: "designation-position",
    description: "Manage designations, job positions, grades, levels & organizational reporting.",
    icon: Award,
  },
  {
    label: "Contact Management",
    parent: "People & Contacts",
    tabKey: "contact-management",
    description: "Maintain contact persons, designations, phones & emails for business partners.",
    icon: BookUser,
  },

  // 3. Business Partner Management
  {
    label: "Business Partner Management",
    parent: "Business Partner Management",
    tabKey: "business-partners",
    description:
      "Manage external entities: agents, distributors, dealers, contractors & consultants.",
    icon: Briefcase,
  },
  {
    label: "Supplier Management",
    parent: "Business Partner Management",
    tabKey: "supplier-management",
    description: "Supplier & vendor profiles, contact details, registrations & classifications.",
    icon: Truck,
  },
  {
    label: "Customer Management",
    parent: "Business Partner Management",
    tabKey: "customer-management",
    description: "Customer profiles, contact info, billing/shipping addresses & categories.",
    icon: UserPlus,
  },
  {
    label: "Buyer Management",
    parent: "Business Partner Management",
    tabKey: "buyer-management",
    description: "Buyer profiles, buying houses, buyer contacts & merchandising details.",
    icon: ShoppingBag,
  },
  {
    label: "Transporter & Logistics Management",
    parent: "Business Partner Management",
    tabKey: "transporter-logistics",
    description: "Freight forwarders, shipping agents, C&F partners & logistics providers.",
    icon: Navigation,
  },

  // 4. Product & Item Management
  {
    label: "Item Management",
    parent: "Product & Item Management",
    tabKey: "item-management",
    description: "Centralized item master: codes, names, specs, types & inventory tracking.",
    icon: PackageSearch,
  },
  {
    label: "Item Category Management",
    parent: "Product & Item Management",
    tabKey: "item-categories",
    description: "Item categories, subcategories, product groups & families.",
    icon: Layers,
  },
  {
    label: "Brand & Manufacturer Management",
    parent: "Product & Item Management",
    tabKey: "brand-manufacturer",
    description: "Product brands, brand owners, manufacturers & identification.",
    icon: BadgeCheck,
  },
  {
    label: "Product Variant Management",
    parent: "Product & Item Management",
    tabKey: "product-variants",
    description: "Variations such as size, color, model, dimensions & attributes.",
    icon: Palette,
  },
  {
    label: "Unit of Measurement Management",
    parent: "Product & Item Management",
    tabKey: "uom-management",
    description: "Units of measurement (pcs, kg, mtr, yds, ltr) & conversion rules.",
    icon: Scale,
  },

  // 5. Warehouse & Asset References
  {
    label: "Warehouse & Store Management",
    parent: "Warehouse & Asset References",
    tabKey: "warehouse-store",
    description: "Warehouse, factory store, stockroom & storage location master.",
    icon: Warehouse,
  },
  {
    label: "Machine & Equipment Management",
    parent: "Warehouse & Asset References",
    tabKey: "machine-equipment",
    description: "Machine identification, serials, plant location & reference data.",
    icon: Cpu,
  },
  {
    label: "Asset Category Management",
    parent: "Warehouse & Asset References",
    tabKey: "asset-categories",
    description: "Fixed asset categories, depreciation classes & classifications.",
    icon: Boxes,
  },

  // 6. Finance & Payment References
  {
    label: "Bank & Bank Branch Management",
    parent: "Finance & Payment References",
    tabKey: "bank-branch",
    description: "Bank & branch info for payments, payroll disbursement & accounts.",
    icon: Landmark,
  },
  {
    label: "Currency & Exchange Rate Management",
    parent: "Finance & Payment References",
    tabKey: "currency-exchange",
    description: "Currencies, exchange rates, validity dates & international financial terms.",
    icon: Coins,
  },
  {
    label: "Payment Terms Management",
    parent: "Finance & Payment References",
    tabKey: "payment-terms",
    description: "Payment conditions, credit periods, due-date rules & settlement terms.",
    icon: CalendarClock,
  },
  {
    label: "Payment Method Management",
    parent: "Finance & Payment References",
    tabKey: "payment-methods",
    description: "Payment channels: cash, bank transfer, cheque, digital wallets.",
    icon: CreditCard,
  },
  {
    label: "Tax & VAT Configuration",
    parent: "Finance & Payment References",
    tabKey: "tax-vat",
    description: "Tax types, VAT codes, withholding tax rates & applicability rules.",
    icon: Percent,
  },
  {
    label: "Cost Center Management",
    parent: "Finance & Payment References",
    tabKey: "cost-centers",
    description: "Departmental, plant & project cost centers for expense tracking.",
    icon: Calculator,
  },
  {
    label: "Profit Center Management",
    parent: "Finance & Payment References",
    tabKey: "profit-centers",
    description: "Revenue & profit centers for business unit performance evaluation.",
    icon: TrendingUp,
  },

  // 7. Project & Business Operations
  {
    label: "Project & Order Management",
    parent: "Project & Business Operations",
    tabKey: "project-order",
    description: "Common project & order master references across ERP modules.",
    icon: FolderKanban,
  },
  {
    label: "Buyer Style & Season Management",
    parent: "Project & Business Operations",
    tabKey: "style-season",
    description: "Garment styles, seasons, fashion collections & development references.",
    icon: Scissors,
  },
  {
    label: "Contract & Terms Management",
    parent: "Project & Business Operations",
    tabKey: "contract-terms",
    description: "Standard contract types, agreements & reusable business terms.",
    icon: FileCheck,
  },

  // 8. Commercial & Logistics References
  {
    label: "Shipping & Trade Reference Management",
    parent: "Commercial & Logistics References",
    tabKey: "shipping-trade",
    description: "Shipping methods, ports, customs stations, classifications & Incoterms.",
    icon: Anchor,
  },

  // 9. Common Reference & Configuration
  {
    label: "Document Type Management",
    parent: "Common Reference & Configuration",
    tabKey: "document-types",
    description: "Standard document types & classifications across HR, Accounts & Operations.",
    icon: FileText,
  },
  {
    label: "Calendar & Holiday Management",
    parent: "Common Reference & Configuration",
    tabKey: "calendar-holidays",
    description: "Working calendars, weekly holidays, public holidays & production schedules.",
    icon: CalendarDays,
  },
  {
    label: "Reason Code Management",
    parent: "Common Reference & Configuration",
    tabKey: "reason-codes",
    description: "Standard reason codes for cancellations, adjustments & returns.",
    icon: HelpCircle,
  },
  {
    label: "Common Classification Management",
    parent: "Common Reference & Configuration",
    tabKey: "common-classifications",
    description: "Universal classifications, categories & multi-module reference values.",
    icon: Tag,
  },
  {
    label: "Document Numbering Management",
    parent: "Common Reference & Configuration",
    tabKey: "document-numbering",
    description: "Configurable prefixes, formats, digit lengths & automatic sequence rules.",
    icon: Hash,
  },
];

interface OrgMasterTopbarProps {
  onSelectTab?: (key: string) => void;
  onToggleMobileSidebar?: () => void;
}

export function OrgMasterTopbar({ onSelectTab, onToggleMobileSidebar }: OrgMasterTopbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const inputEl = document.getElementById("org-master-search-input");
        inputEl?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter list matching current input query
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return masterSearchableItems.slice(0, 8);
    }
    return masterSearchableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.parent.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tabKey.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[focusedIndex];
      if (selected) {
        setIsSearchOpen(false);
        setSearchQuery("");
        if (onSelectTab) {
          onSelectTab(selected.tabKey);
        } else {
          window.location.href = `/organization-master-setup?tab=${selected.tabKey}`;
        }
      }
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".org-master-search-container")) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  // Time based greeting
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <header className="h-14 px-3 sm:px-5 flex items-center gap-2.5 sm:gap-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 shadow-2xs">
      {onToggleMobileSidebar && (
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground shrink-0"
          title="Open Sidebar"
        >
          <Menu className="size-5" />
        </button>
      )}

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold tracking-tight text-foreground">
            {greeting}, Shapno 👋
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
            <Building2 className="size-3" />
            Org Master Setup
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground/90 font-medium font-sans truncate max-w-[280px] sm:max-w-none">
          Centralized enterprise structures, master entities & global configurations.
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Interactive Global Master Search Container */}
        <div className="relative hidden md:block org-master-search-container">
          <div className="relative group">
            <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              id="org-master-search-input"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search 36 master setups (e.g. Company, Tax, Bank...)"
              className="w-80 focus:w-96 pl-10 pr-14 h-9.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 focus:border-sky-500 focus:bg-card focus:ring-4 focus:ring-sky-500/10 outline-none text-xs transition-all duration-300 font-sans font-bold"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-2xs select-none pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Search Result Popover List */}
          {isSearchOpen && (
            <div className="absolute right-0 top-11.5 w-[420px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="text-sky-500">🏢</span>
                  <span>
                    {searchQuery
                      ? `Matching Master Menus (${filteredResults.length})`
                      : "36 Master Setup Menus"}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[8.5px] font-bold lowercase tracking-normal">
                  esc to close
                </span>
              </div>

              <div className="max-h-84 overflow-y-auto p-2 space-y-1">
                {filteredResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No master setup matched "{searchQuery}"
                  </div>
                ) : (
                  filteredResults.map((item, idx) => {
                    const isFocused = idx === focusedIndex;
                    const IconComp = item.icon;

                    return (
                      <Link
                        key={item.tabKey}
                        to="/organization-master-setup"
                        search={{ tab: item.tabKey }}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          if (onSelectTab) onSelectTab(item.tabKey);
                        }}
                        className={`w-full group text-left flex items-start gap-3 p-2.5 rounded-xl transition duration-150 border ${
                          isFocused
                            ? "bg-sky-50/80 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 shadow-xs"
                            : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <div
                          className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isFocused
                              ? "bg-sky-500 text-white shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <IconComp className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-foreground truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded shrink-0">
                              {item.parent}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Module Launcher Dropdown */}
        <ModuleLauncher />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="size-4.5 text-amber-400" />
          ) : (
            <Moon className="size-4.5 text-slate-600" />
          )}
        </button>

        {/* Sync Status Button */}
        <button
          onClick={() => {
            alert("All 36 Organization Master categories are synchronized across modules.");
          }}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200"
          title="Verify Global Master Sync"
        >
          <RefreshCw className="size-4.5 text-sky-600 hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Messages / Quick Help */}
        <button
          onClick={() => {
            alert(
              "Organization Master Setup provides centralized data structures accessible by HRIS, Merchandising, Accounts, Inventory, and Procurement.",
            );
          }}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200"
          title="Module Information"
        >
          <MessagesSquare className="size-4.5" />
        </button>

        {/* Master Notifications Bell */}
        <div className="relative flex items-center mr-1" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200"
            title="Master Entity Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1 left-1.5 px-1 py-0.2 text-[8px] font-extrabold bg-sky-600 text-white rounded shadow-2xs min-w-[12px] text-center">
              3
            </span>
          </button>

          {isNotifOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-[360px] z-50 rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background: "var(--l-dropdown-bg, rgba(255,255,255,0.98))",
                borderColor: "var(--l-dropdown-border, rgba(100,116,139,0.12))",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between bg-sky-50/60 dark:bg-sky-950/20">
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 text-sky-600" />
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    Master Entity Updates
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full">
                    3
                  </span>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="divide-y divide-border/60 max-h-[320px] overflow-y-auto">
                <div className="p-3.5 flex items-start gap-3 hover:bg-muted/40 transition-colors">
                  <div className="size-8 rounded-xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center shrink-0 mt-0.5 text-sky-600">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Company Registry Synchronized
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      4 legal entities validated and synced with Accounts & HRIS.
                    </p>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                      Today, 10:30 AM
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3 hover:bg-muted/40 transition-colors">
                  <div className="size-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 mt-0.5 text-indigo-600">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Item Categories Indexed</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Inventory & Procurement item family hierarchy updated.
                    </p>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                      Yesterday, 04:15 PM
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3 hover:bg-muted/40 transition-colors">
                  <div className="size-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                    <Percent className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">VAT & Tax Rules Verified</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Withholding and deduction brackets matched with fiscal year.
                    </p>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                      Oct 11, 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Block */}
        <div className="relative pl-3.5 border-l border-border/60">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity text-left cursor-pointer focus:outline-none"
          >
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-foreground">Tahmid Afsar</div>
              <div className="text-[9px] font-bold text-muted-foreground/85 mt-0.5">
                Pakiza Software Limited (PSL-Operation)
              </div>
            </div>
            <div className="size-9 rounded-full overflow-hidden border border-border/80 shadow-2xs flex-shrink-0 bg-muted">
              <img
                src="https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
                alt="Tahmid Afsar"
                className="size-full object-cover"
              />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border z-50 p-1.5 focus:outline-none"
                style={{
                  background: "var(--l-dropdown-bg, rgba(255, 255, 255, 0.95))",
                  borderColor: "var(--l-dropdown-border, rgba(100, 116, 139, 0.12))",
                  boxShadow: "var(--l-dropdown-shadow, 0 10px 30px rgba(0,0,0,0.08))",
                  color: "var(--l-text, #1e293b)",
                  animation: "dropdownOpen 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                <div className="px-3 py-2 border-b border-border/60 mb-1">
                  <p className="text-xs font-extrabold">Tahmid Afsar</p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    tahmid@pakizasoftware.com
                  </p>
                </div>

                <Link
                  to="/my-profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors text-left"
                >
                  <User className="size-4 text-primary" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    alert("Region configuration settings are currently locked.");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors text-left"
                >
                  <Globe className="size-4 text-muted-foreground" />
                  <span>Change Region</span>
                </button>

                <Link
                  to="/enroll-fingerprint"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors text-left"
                >
                  <Fingerprint className="size-4 text-primary" />
                  <span>Enroll Fingerprint</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
