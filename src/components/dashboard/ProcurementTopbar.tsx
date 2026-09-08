import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Search,
  MessagesSquare,
  Sun,
  Moon,
  CornerDownLeft,
  Settings,
  FileText,
  ShoppingCart,
  CreditCard,
  Banknote,
  ShieldCheck,
  BarChart3,
  Blocks,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { ModuleLauncher } from "./ModuleLauncher";

interface SearchMenuLink {
  label: string;
  parent: string;
  to: string;
  search?: Record<string, any>;
  description?: string;
}

const searchableMenus: SearchMenuLink[] = [
  { label: "Dashboard Overview", parent: "Home", to: "/procurement-dashboard", description: "Procurement Command Center dashboard overview" },
  
  // Configuration
  { label: "Currency Rate", parent: "Configuration", to: "/procurement-config-currency-rate", description: "Manage global currency rates and exchanges" },
  { label: "Terms and Condition", parent: "Configuration", to: "/procurement-config-terms", description: "Configure system terms and conditions templates" },
  { label: "Bank Info", parent: "Configuration", to: "/procurement-config-bank-info", description: "Configure local and international bank details" },
  { label: "Bank Accounts", parent: "Configuration", to: "/procurement-config-bank-accounts", description: "Manage company bank account configurations" },
  
  // Proforma Invoice
  { label: "Create PI", parent: "Proforma Invoice", to: "/procurement-pi-create", description: "Generate new Proforma Invoice drafts" },
  { label: "PI List", parent: "Proforma Invoice", to: "/procurement-pi-list", description: "List of generated and active Proforma Invoices" },
  { label: "Edit DC Price", parent: "Proforma Invoice", to: "/procurement-pi-edit-dc-price", description: "Update direct cost price values on PI" },
  { label: "Approve DC Price", parent: "Proforma Invoice", to: "/procurement-pi-approve-dc-price", description: "Review and approve pending direct cost prices" },
  { label: "PI Delete Request", parent: "Proforma Invoice", to: "/procurement-pi-delete-request", description: "Manage deletion requests for Proforma Invoices" },
  
  // Purchase Order
  { label: "Requisition Wise PO", parent: "Purchase Order", to: "/procurement-po-requisition-wise", description: "Generate purchase orders directly from requisitions" },
  { label: "New Purchase Order", parent: "Purchase Order", to: "/procurement-po-new", description: "Draft a new custom purchase order" },
  { label: "Purchase Order List", parent: "Purchase Order", to: "/procurement-po-list", description: "Directory of all drafted, sent, and active POs" },
  { label: "Work Order Approval", parent: "Purchase Order", to: "/procurement-po-work-order-approval", description: "Approve pending supplier work orders" },
  
  // Billing
  { label: "Prepare Bill", parent: "Billing", to: "/procurement-billing-prepare", description: "Generate bills from supplier records and receipts" },
  { label: "Purchase List", parent: "Billing", to: "/procurement-billing-purchase-list", description: "Record of items purchased for billing audits" },
  { label: "VAT and Tax Register", parent: "Billing", to: "/procurement-billing-vat-tax-register", description: "View compliance logs for VAT and taxes" },
  { label: "Loan List", parent: "Billing", to: "/procurement-billing-loan-list", description: "Track active procurement loans and payables" },
  { label: "Edit Bill Rate", parent: "Billing", to: "/procurement-billing-edit-rate", description: "Modify billing rates on existing supplier invoices" },
  { label: "Approve Bill Rate", parent: "Billing", to: "/procurement-billing-approve-rate", description: "Approve rates and clear bill sheets for payout" },
  { label: "Supplier Bill Record", parent: "Billing", to: "/procurement-billing-supplier-record", description: "Detailed invoice history per supplier" },
  { label: "Supplier Bill Record List", parent: "Billing", to: "/procurement-billing-supplier-record-list", description: "Registry of all supplier bill files" },
  { label: "Prepare Bill V2", parent: "Billing", to: "/procurement-billing-prepare-v2", description: "Alternative preparation layout for complex batch bills" },
  { label: "VAT Tax Entry", parent: "Billing", to: "/procurement-billing-vat-tax-entry", description: "Insert VAT and tax deductions for transactions" },
  
  // Payment
  { label: "Bill Payment", parent: "Payment", to: "/procurement-payment-bill", description: "Clear bills and process payments to bank/cash" },
  { label: "Payment List", parent: "Payment", to: "/procurement-payment-list", description: "Registry of transaction payouts and receipts" },
  
  // Audit
  { label: "MRR Audit", parent: "Audit", to: "/procurement-audit-mrr", description: "Audit Material Receive Reports against invoices" },
  { label: "Update Landed Cost", parent: "Audit", to: "/procurement-audit-landed-cost", description: "Calculate and insert final landed costs for inventory" },
  { label: "Bill Audit", parent: "Audit", to: "/procurement-audit-bill", description: "Run system audits on supplier invoice records" },
  
  // Reports
  { label: "Purchase Price", parent: "Reports", to: "/procurement-reports-purchase-price", description: "Analytical report of historical purchase price indexes" },
  { label: "Payment Statement", parent: "Reports", to: "/procurement-reports-payment-statement", description: "Export statements of total payouts per supplier" },
  { label: "Yarn Booking & PI Status", parent: "Reports", to: "/procurement-reports-yarn-booking-pi", description: "Overview of booking statuses against PIs" },
  { label: "DNC Rate", parent: "Reports", to: "/procurement-reports-dnc-rate", description: "Direct Net Cost variance rate reports" },
  { label: "Combined PO Statement", parent: "Reports", to: "/procurement-reports-combined-po-statement", description: "Combined purchase orders statement report sheet" },
  
  // Comparison Sheet
  { label: "Supplier Items", parent: "Comparison Sheet", to: "/procurement-cs-supplier-items", description: "List of items mapping suppliers and rates" },
  { label: "Create CS Batch", parent: "Comparison Sheet", to: "/procurement-cs-create-batch", description: "Formulate a new Comparison Sheet batch for comparison" },
  { label: "CS Batch List", parent: "Comparison Sheet", to: "/procurement-cs-batch-list", description: "Registry of drafted and approved comparison sheets" },
  { label: "Supplier Price", parent: "Comparison Sheet", to: "/procurement-cs-supplier-price", description: "Verify price quotes and list variations" },
  { label: "Create Workorder", parent: "Comparison Sheet", to: "/procurement-cs-create-workorder", description: "Approve the winner and auto-generate the workorder" },
];

function getCategoryIcon(parent: string) {
  switch (parent) {
    case "Home":
      return LayoutDashboard;
    case "Configuration":
      return Settings;
    case "Proforma Invoice":
      return FileText;
    case "Purchase Order":
      return ShoppingCart;
    case "Billing":
      return CreditCard;
    case "Payment":
      return Banknote;
    case "Audit":
      return ShieldCheck;
    case "Reports":
      return BarChart3;
    case "Comparison Sheet":
      return Blocks;
    default:
      return LayoutDashboard;
  }
}

export function ProcurementTopbar() {
  if (typeof window !== "undefined" && window.location.search.includes("embed=true")) {
    return null;
  }

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const inputEl = document.getElementById("procurement-search-input");
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

  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return searchableMenus.slice(0, 5);
    }
    return searchableMenus.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.parent.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
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
        window.location.href = selected.to;
      }
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".procurement-search-container")) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <header className="h-14 px-5 flex items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 shadow-2xs">
      <div>
        <h1 className="text-sm font-bold tracking-tight text-foreground">{greeting}, Shapno 👋</h1>
        <p className="text-[11px] text-muted-foreground/90 font-medium font-sans">
          Procurement Operations Center & Active Supplier Ledger control.
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        {/* Search menu */}
        <div className="relative hidden md:block procurement-search-container">
          <div className="relative group">
            <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              id="procurement-search-input"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search procurement modules (e.g. Terms, PI...)"
              className="w-76 focus:w-88 pl-10 pr-14 h-9.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 focus:border-amber-500/80 focus:bg-card focus:ring-4 focus:ring-amber-500/10 outline-none text-xs transition-all duration-300 font-sans font-bold"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-2xs select-none pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {isSearchOpen && (
            <div className="absolute right-0 top-11.5 w-[390px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-500 animate-pulse">⚡</span>
                  <span>
                    {searchQuery
                      ? `Matching Menus (${filteredResults.length})`
                      : "Quick Access Menus"}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[8.5px] font-bold lowercase tracking-normal">
                  esc to close
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredResults.map((item, idx) => {
                  const isFocused = idx === focusedIndex;
                  const CategoryIcon = getCategoryIcon(item.parent);

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      search={item.search}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className={[
                        "flex items-start gap-3 p-2 rounded-lg transition-all duration-150 text-left border border-transparent",
                        isFocused
                          ? "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
                          : "hover:bg-muted text-foreground/80",
                      ].join(" ")}
                    >
                      <div className="size-7 rounded bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
                        <CategoryIcon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">
                            {item.label}
                          </span>
                          <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            {item.parent}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action icons */}
        <button
          onClick={toggleTheme}
          className="size-9 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground grid place-items-center transition-colors cursor-pointer"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <button className="size-9 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground grid place-items-center transition-colors relative cursor-pointer">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
        </button>

        <button className="size-9 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground grid place-items-center transition-colors cursor-pointer">
          <MessagesSquare className="size-4" />
        </button>

        <div className="h-5 w-[1px] bg-border/60" />

        <ModuleLauncher />
      </div>
    </header>
  );
}
