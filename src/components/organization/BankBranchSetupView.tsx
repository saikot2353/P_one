import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Landmark,
  Building2,
  GitBranch,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Globe,
  MapPin,
  ExternalLink,
  Layers,
} from "lucide-react";

export type BankBranchTabType = "branches" | "banks";

export interface BankAccount {
  id: string;
  coaAccountId?: string;
  accountsType: string;
  accountsNumber: string;
  accountsName: string;
}

export interface BankBranch {
  id: string;
  bankId: string;
  bankName: string;
  bankAlias: string;
  branchName: string;
  address: string;
  routingNo: string;
  swiftCode: string;
  accounts: BankAccount[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Bank {
  id: string;
  name: string;
  alias: string;
  createdAt?: string;
}

export interface BankBranchSetupViewProps {
  initialTab?: BankBranchTabType;
  embedded?: boolean;
  onTabChange?: (tab: BankBranchTabType) => void;
  onBackToOverview?: () => void;
}

const DEFAULT_BANKS: Bank[] = [
  { id: "bank-dbbl", name: "Dutch Bangla Bank Ltd.", alias: "DBBL", createdAt: "2026-09-01T00:00:00Z" },
  { id: "bank-mtb", name: "Mutual Trust Bank Ltd.", alias: "MTB", createdAt: "2026-09-01T00:00:00Z" },
  { id: "bank-brac", name: "BRAC Bank Ltd.", alias: "BRAC", createdAt: "2026-09-01T00:00:00Z" },
  { id: "bank-ebl", name: "Eastern Bank Ltd.", alias: "EBL", createdAt: "2026-09-02T00:00:00Z" },
  { id: "bank-ibbl", name: "Islami Bank Bangladesh Ltd.", alias: "IBBL", createdAt: "2026-09-02T00:00:00Z" },
  { id: "bank-scb", name: "Standard Chartered Bank", alias: "SCB", createdAt: "2026-09-03T00:00:00Z" },
  { id: "bank-city", name: "The City Bank Ltd.", alias: "CBL", createdAt: "2026-09-03T00:00:00Z" },
  { id: "bank-prime", name: "Prime Bank Ltd.", alias: "PBL", createdAt: "2026-09-04T00:00:00Z" },
  { id: "bank-ucb", name: "United Commercial Bank Ltd.", alias: "UCB", createdAt: "2026-09-04T00:00:00Z" },
];

const DEFAULT_BRANCHES: BankBranch[] = [
  {
    id: "br-1",
    bankId: "bank-dbbl",
    bankName: "Dutch Bangla Bank Ltd.",
    bankAlias: "DBBL",
    branchName: "Shatmoshjid Road Branch",
    address: "House 42, Road 9/A, Dhanmondi, Dhaka",
    routingNo: "090271891",
    swiftCode: "DBBLBDDH",
    accounts: [
      { id: "acc-1", coaAccountId: "acc-01", accountsType: "CD", accountsNumber: "100001122", accountsName: "DBBL Principal CD A/C" },
      { id: "acc-2", coaAccountId: "acc-02", accountsType: "SND", accountsNumber: "100001123", accountsName: "DBBL Short Term Deposit" },
    ],
    createdAt: "2026-09-05T00:00:00Z",
  },
  {
    id: "br-2",
    bankId: "bank-mtb",
    bankName: "Mutual Trust Bank Ltd.",
    bankAlias: "MTB",
    branchName: "Principal Branch",
    address: "MTB Centre, 26 Dilkusha C/A, Motijheel, Dhaka",
    routingNo: "145260193",
    swiftCode: "MTBLBDDH",
    accounts: [
      { id: "acc-3", coaAccountId: "acc-03", accountsType: "CD", accountsNumber: "200004455", accountsName: "MTB Operational Cash at Bank" },
    ],
    createdAt: "2026-09-08T00:00:00Z",
  },
  {
    id: "br-3",
    bankId: "bank-scb",
    bankName: "Standard Chartered Bank",
    bankAlias: "SCB",
    branchName: "Gulshan 2 Branch",
    address: "67 Gulshan Avenue, Dhaka",
    routingNo: "215260882",
    swiftCode: "SCBLBDDH",
    accounts: [
      { id: "acc-4", coaAccountId: "acc-04", accountsType: "FC", accountsNumber: "01889920101", accountsName: "SCB USD Export Retention Quota" },
    ],
    createdAt: "2026-09-10T00:00:00Z",
  },
  {
    id: "br-4",
    bankId: "bank-brac",
    bankName: "BRAC Bank Ltd.",
    bankAlias: "BRAC",
    branchName: "Gulshan 1 Branch",
    address: "1 Gulshan Avenue, Dhaka",
    routingNo: "060261120",
    swiftCode: "BRAKBDDH",
    accounts: [
      { id: "acc-5", coaAccountId: "acc-05", accountsType: "CD", accountsNumber: "15012099384", accountsName: "BRAC Corporate Current A/C" },
    ],
    createdAt: "2026-09-12T00:00:00Z",
  },
  {
    id: "br-5",
    bankId: "bank-ebl",
    bankName: "Eastern Bank Ltd.",
    bankAlias: "EBL",
    branchName: "Principal Branch, Dilkusha",
    address: "10 Dilkusha C/A, Dhaka",
    routingNo: "095261440",
    swiftCode: "EBLBBDDH",
    accounts: [
      { id: "acc-6", coaAccountId: "acc-06", accountsType: "CD", accountsNumber: "10110488291", accountsName: "EBL Factory Cash at Bank" },
    ],
    createdAt: "2026-09-14T00:00:00Z",
  },
  {
    id: "br-6",
    bankId: "bank-city",
    bankName: "The City Bank Ltd.",
    bankAlias: "CBL",
    branchName: "Dhanmondi Branch",
    address: "Road 2, Dhanmondi, Dhaka",
    routingNo: "225270119",
    swiftCode: "CIBLBDDH",
    accounts: [
      { id: "acc-7", coaAccountId: "acc-07", accountsType: "CD", accountsNumber: "11029384710", accountsName: "City Bank Tax & Utility A/C" },
    ],
    createdAt: "2026-09-15T00:00:00Z",
  },
  {
    id: "br-7",
    bankId: "bank-prime",
    bankName: "Prime Bank Ltd.",
    bankAlias: "PBL",
    branchName: "Motijheel Branch",
    address: "119-120 Motijheel C/A, Dhaka",
    routingNo: "175271822",
    swiftCode: "PRMRBDDH",
    accounts: [
      { id: "acc-8", coaAccountId: "acc-08", accountsType: "CD", accountsNumber: "21192837401", accountsName: "Prime Bank Import Margin A/C" },
    ],
    createdAt: "2026-09-16T00:00:00Z",
  },
  {
    id: "br-8",
    bankId: "bank-ucb",
    bankName: "United Commercial Bank Ltd.",
    bankAlias: "UCB",
    branchName: "Corporate Branch, Bulus Centre",
    address: "Plot CWS(A)-1, Road 34, Gulshan Avenue, Dhaka",
    routingNo: "245260191",
    swiftCode: "UCBLBDDH",
    accounts: [
      { id: "acc-9", coaAccountId: "acc-09", accountsType: "CD", accountsNumber: "09511010002", accountsName: "UCB Corporate Operational CD" },
    ],
    createdAt: "2026-09-18T00:00:00Z",
  },
];

export function BankBranchSetupView({
  initialTab = "branches",
  embedded = false,
  onTabChange,
  onBackToOverview,
}: BankBranchSetupViewProps) {
  const [activeTab, setActiveTab] = useState<BankBranchTabType>(initialTab);

  useEffect(() => {
    if (initialTab && ["branches", "banks"].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSwitch = (tab: BankBranchTabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // State: Banks from localStorage
  const [banks, setBanks] = useState<Bank[]>(() => {
    try {
      const stored = localStorage.getItem("accounts:banks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored banks", e);
    }
    return DEFAULT_BANKS;
  });

  // State: Branches from localStorage
  const [branches, setBranches] = useState<BankBranch[]>(() => {
    try {
      const stored = localStorage.getItem("accounts:branches");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored branches", e);
    }
    return DEFAULT_BRANCHES;
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("accounts:banks", JSON.stringify(banks));
    } catch (e) {
      console.error("Failed to save banks", e);
    }
  }, [banks]);

  useEffect(() => {
    try {
      localStorage.setItem("accounts:branches", JSON.stringify(branches));
    } catch (e) {
      console.error("Failed to save branches", e);
    }
  }, [branches]);

  // Branch count per bank ID
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    branches.forEach((br) => {
      counts[br.bankId] = (counts[br.bankId] || 0) + 1;
    });
    return counts;
  }, [branches]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBankFilter, setSelectedBankFilter] = useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtered Branches
  const filteredBranches = useMemo(() => {
    return branches.filter((br) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        br.branchName.toLowerCase().includes(q) ||
        br.bankName.toLowerCase().includes(q) ||
        br.bankAlias.toLowerCase().includes(q) ||
        (br.address && br.address.toLowerCase().includes(q)) ||
        (br.routingNo && br.routingNo.includes(q)) ||
        (br.swiftCode && br.swiftCode.toLowerCase().includes(q));

      const matchBank = selectedBankFilter === "all" || br.bankId === selectedBankFilter;
      const hasAccounts = (br.accounts?.length || 0) > 0;
      const matchAccounts =
        accountStatusFilter === "all"
          ? true
          : accountStatusFilter === "with-accounts"
            ? hasAccounts
            : !hasAccounts;

      return matchSearch && matchBank && matchAccounts;
    });
  }, [branches, searchQuery, selectedBankFilter, accountStatusFilter]);

  // Filtered Banks
  const filteredBanks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return banks.filter(
      (b) => !q || b.name.toLowerCase().includes(q) || b.alias.toLowerCase().includes(q)
    );
  }, [banks, searchQuery]);

  const totalPages =
    activeTab === "branches"
      ? Math.max(1, Math.ceil(filteredBranches.length / pageSize))
      : Math.max(1, Math.ceil(filteredBanks.length / pageSize));

  const paginatedBranches = filteredBranches.slice((page - 1) * pageSize, page * pageSize);
  const paginatedBanks = filteredBanks.slice((page - 1) * pageSize, page * pageSize);

  // Modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BankBranch | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "bank" | "branch";
    item: any;
  } | null>(null);

  // Handlers: Bank operations
  const handleOpenNewBank = () => {
    setEditingBank(null);
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (bank: Bank) => {
    setEditingBank(bank);
    setIsBankModalOpen(true);
  };

  const handleSaveBank = (data: { name: string; alias: string }) => {
    const name = data.name.trim();
    const alias = data.alias.trim().toUpperCase();

    if (editingBank) {
      setBanks((prev) =>
        prev.map((b) => (b.id === editingBank.id ? { ...b, name, alias } : b))
      );
      // Update branches referencing this bank
      setBranches((prev) =>
        prev.map((br) =>
          br.bankId === editingBank.id
            ? { ...br, bankName: name, bankAlias: alias }
            : br
        )
      );
      toast.success(`Bank "${name}" updated successfully.`);
    } else {
      if (banks.some((b) => b.name.toLowerCase() === name.toLowerCase() || b.alias === alias)) {
        toast.error(`Bank "${name}" or alias "${alias}" already exists!`);
        return;
      }
      const newBank: Bank = {
        id: `bank-${Date.now().toString(36)}`,
        name,
        alias,
        createdAt: new Date().toISOString(),
      };
      setBanks((prev) => [...prev, newBank]);
      toast.success(`Bank "${name}" registered successfully.`);
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBankConfirm = (bank: Bank) => {
    if (branchCounts[bank.id] > 0) {
      toast.error(`Cannot delete bank "${bank.name}" because ${branchCounts[bank.id]} branches are linked to it.`);
      return;
    }
    setDeleteTarget({ type: "bank", item: bank });
  };

  // Handlers: Branch operations
  const handleOpenNewBranch = () => {
    setEditingBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (branch: BankBranch) => {
    setEditingBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = (formData: Omit<BankBranch, "id">) => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((br) =>
          br.id === editingBranch.id
            ? { ...br, ...formData, updatedAt: new Date().toISOString() }
            : br
        )
      );
      toast.success(`Branch "${formData.branchName}" updated successfully.`);
    } else {
      const newBranch: BankBranch = {
        ...formData,
        id: `br-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBranches((prev) => [newBranch, ...prev]);
      toast.success(`Branch "${formData.branchName}" registered successfully.`);
    }
    setIsBranchModalOpen(false);
  };

  const handleDuplicateBranch = (branch: BankBranch) => {
    const copyName = `${branch.branchName} (Copy)`;
    const newBranch: BankBranch = {
      ...branch,
      id: `br-${Date.now().toString(36)}`,
      branchName: copyName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBranches((prev) => [newBranch, ...prev]);
    toast.success(`Duplicated "${branch.branchName}" as "${copyName}".`);
  };

  const handleDeleteBranchConfirm = (branch: BankBranch) => {
    setDeleteTarget({ type: "branch", item: branch });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "bank") {
      setBanks((prev) => prev.filter((b) => b.id !== deleteTarget.item.id));
      toast.success(`Bank "${deleteTarget.item.name}" deleted.`);
    } else {
      setBranches((prev) => prev.filter((br) => br.id !== deleteTarget.item.id));
      toast.success(`Branch "${deleteTarget.item.branchName}" deleted.`);
    }
    setDeleteTarget(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = "";
    if (activeTab === "branches") {
      const headers = ["Bank Name", "Alias", "Branch Name", "Address", "Routing No", "SWIFT Code", "Accounts Count"];
      const rows = filteredBranches.map((br) => [
        `"${br.bankName}"`,
        `"${br.bankAlias}"`,
        `"${br.branchName}"`,
        `"${br.address || ""}"`,
        `"${br.routingNo || ""}"`,
        `"${br.swiftCode || ""}"`,
        br.accounts?.length || 0,
      ]);
      csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    } else {
      const headers = ["Bank Name", "Alias Code", "Linked Branches"];
      const rows = filteredBanks.map((b) => [
        `"${b.name}"`,
        `"${b.alias}"`,
        branchCounts[b.id] || 0,
      ]);
      csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${activeTab} data to CSV.`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-2xs">
            <Landmark className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Bank Setup</h1>
              {embedded && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  Master Data
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage bank masters, branch identities, and linked Chart of Accounts heads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {embedded && onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Overview</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            title="Export CSV"
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {activeTab === "banks" ? (
            <button
              type="button"
              onClick={handleOpenNewBank}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Bank</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNewBranch}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Branch</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Styled Tab Pills matching /banks */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border w-fit">
          <button
            type="button"
            onClick={() => {
              handleTabSwitch("branches");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "branches"
                ? "bg-card text-foreground shadow-2xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="size-3.5 text-indigo-500" />
            <span>Branches</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              {branches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleTabSwitch("banks");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "banks"
                ? "bg-card text-foreground shadow-2xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3.5 text-indigo-500" />
            <span>Banks</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              {banks.length}
            </span>
          </button>
        </div>

        {/* Filter and Search controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={
                activeTab === "branches"
                  ? "Search branch, bank, address, or routing..."
                  : "Search bank name or alias..."
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {activeTab === "branches" && (
            <>
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedBankFilter}
                  onChange={(e) => {
                    setSelectedBankFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer font-medium"
                >
                  <option value="all">All Banks</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.alias})
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={accountStatusFilter}
                onChange={(e) => {
                  setAccountStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer font-medium"
              >
                <option value="all">All Accounts Status</option>
                <option value="with-accounts">Has Accounts</option>
                <option value="no-accounts">No Accounts</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Tab 1: Branches Table (Exact replica of VWe) */}
      {activeTab === "branches" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bank</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Routing No.</th>
                <th className="py-3 px-4">SWIFT / BIC</th>
                <th className="py-3 px-4 text-center">Accounts</th>
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedBranches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <GitBranch className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold">No branches found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {searchQuery || selectedBankFilter !== "all" || accountStatusFilter !== "all"
                        ? "No branches match your active search or filter criteria."
                        : 'No branches registered yet. Click "New Branch" to register your first branch.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBranches.map((branch) => {
                  const accountsCount = branch.accounts?.length || 0;
                  return (
                    <tr
                      key={branch.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenEditBranch(branch)}
                    >
                      {/* Bank Name & Alias */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold text-foreground group-hover:text-indigo-600 transition-colors">
                            {branch.bankName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {branch.bankAlias}
                          </span>
                        </div>
                      </td>

                      {/* Branch Name */}
                      <td className="py-3 px-4 align-top font-semibold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                          <span>{branch.branchName}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 align-top text-muted-foreground max-w-xs truncate">
                        {branch.address || <span className="text-muted-foreground/50 italic">—</span>}
                      </td>

                      {/* Routing No */}
                      <td className="py-3 px-4 align-top font-mono text-muted-foreground">
                        {branch.routingNo || <span className="text-muted-foreground/50 italic">—</span>}
                      </td>

                      {/* SWIFT */}
                      <td className="py-3 px-4 align-top font-mono text-muted-foreground">
                        {branch.swiftCode ? (
                          <span className="px-1.5 py-0.5 rounded text-[10.5px] bg-slate-100 dark:bg-slate-800 text-foreground font-semibold">
                            {branch.swiftCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 italic">—</span>
                        )}
                      </td>

                      {/* Accounts */}
                      <td className="py-3 px-4 align-top text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            accountsCount > 0
                              ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                          }`}
                        >
                          {accountsCount}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 align-top text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditBranch(branch)}
                            title="Edit Branch"
                            className="p-1.5 rounded-lg border border-border/60 hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Edit2 className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateBranch(branch)}
                            title="Duplicate Branch"
                            className="p-1.5 rounded-lg border border-border/60 hover:border-sky-400/50 hover:bg-sky-50 dark:hover:bg-sky-950/30 text-muted-foreground hover:text-sky-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Copy className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBranchConfirm(branch)}
                            title="Delete Branch"
                            className="p-1.5 rounded-lg border border-border/60 hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="px-4 py-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filteredBranches.length === 0 ? 0 : (page - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(page * pageSize, filteredBranches.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{filteredBranches.length}</strong> branches
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Banks Table (Exact replica of UWe) */}
      {activeTab === "banks" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bank Name</th>
                <th className="py-3 px-4">Alias Code</th>
                <th className="py-3 px-4 text-center">Branches</th>
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedBanks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    <Building2 className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold">No banks found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {searchQuery
                        ? "No banks match your active search keyword."
                        : 'No banks registered yet. Click "New Bank" to register your first bank master.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBanks.map((bank) => {
                  const count = branchCounts[bank.id] || 0;
                  return (
                    <tr key={bank.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group">
                      {/* Name */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Building2 className="size-3.5" />
                          </div>
                          <span className="font-semibold text-foreground text-xs">{bank.name}</span>
                        </div>
                      </td>

                      {/* Alias */}
                      <td className="py-3 px-4 align-middle">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {bank.alias}
                        </span>
                      </td>

                      {/* Branch Count */}
                      <td className="py-3 px-4 align-middle text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            count > 0
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                          }`}
                        >
                          {count} {count === 1 ? "branch" : "branches"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditBank(bank)}
                            title="Edit Bank"
                            className="p-1.5 rounded-lg border border-border/60 hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-muted-foreground hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Edit2 className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBankConfirm(bank)}
                            title="Delete Bank"
                            className="p-1.5 rounded-lg border border-border/60 hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filteredBanks.length === 0 ? 0 : (page - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(page * pageSize, filteredBanks.length)}
                </strong>{" "}
                of <strong className="text-foreground">{filteredBanks.length}</strong> banks
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: New / Edit Bank (Exact replica of dQ) */}
      <BankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSubmit={handleSaveBank}
        initialBank={editingBank}
      />

      {/* Modal: New / Edit Branch */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSubmit={handleSaveBranch}
        initialBranch={editingBranch}
        banks={banks}
        onOpenNewBank={handleOpenNewBank}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title={deleteTarget.type === "branch" ? "Delete Branch" : "Delete Bank"}
          message={
            deleteTarget.type === "branch"
              ? `Are you sure you want to delete the branch "${deleteTarget.item.branchName}"?`
              : `Are you sure you want to delete bank "${deleteTarget.item.name}"? This action cannot be undone.`
          }
        />
      )}
    </div>
  );
}

// Bank Modal Component (Exact replication of dQ)
interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; alias: string }) => void;
  initialBank: Bank | null;
}

function BankModal({ isOpen, onClose, onSubmit, initialBank }: BankModalProps) {
  const [name, setName] = useState(initialBank?.name || "");
  const [alias, setAlias] = useState(initialBank?.alias || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBank) {
      setName(initialBank.name);
      setAlias(initialBank.alias);
    } else {
      setName("");
      setAlias("");
    }
    setError(null);
  }, [initialBank, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError("Bank name is required (minimum 3 characters).");
      return;
    }
    if (!alias.trim() || alias.trim().length < 2) {
      setError("Bank alias is required (minimum 2 characters).");
      return;
    }
    onSubmit({ name: name.trim(), alias: alias.trim().toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Landmark className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {initialBank ? "Edit Bank" : "New Bank"}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {initialBank ? "Update bank entity in the Bank master" : "Register bank entity to the Bank master"}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-foreground block">
              Bank Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Dutch Bangla Bank Ltd."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground block">
                Alias (Short Code) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">e.g. DBBL</span>
            </div>
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. DBBL"
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value.toUpperCase());
                setError(null);
              }}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              {initialBank ? "Save Changes" : "Save Bank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Branch Modal Component
interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BankBranch, "id">) => void;
  initialBranch: BankBranch | null;
  banks: Bank[];
  onOpenNewBank: () => void;
}

function BranchModal({
  isOpen,
  onClose,
  onSubmit,
  initialBranch,
  banks,
  onOpenNewBank,
}: BranchModalProps) {
  const [bankId, setBankId] = useState(initialBranch?.bankId || "");
  const [branchName, setBranchName] = useState(initialBranch?.branchName || "");
  const [address, setAddress] = useState(initialBranch?.address || "");
  const [routingNo, setRoutingNo] = useState(initialBranch?.routingNo || "");
  const [swiftCode, setSwiftCode] = useState(initialBranch?.swiftCode || "");
  const [accounts, setAccounts] = useState<BankAccount[]>(initialBranch?.accounts || []);

  const [newAccType, setNewAccType] = useState("CD");
  const [newAccNum, setNewAccNum] = useState("");
  const [newAccName, setNewAccName] = useState("");

  useEffect(() => {
    if (initialBranch) {
      setBankId(initialBranch.bankId);
      setBranchName(initialBranch.branchName);
      setAddress(initialBranch.address || "");
      setRoutingNo(initialBranch.routingNo || "");
      setSwiftCode(initialBranch.swiftCode || "");
      setAccounts(initialBranch.accounts || []);
    } else {
      setBankId(banks[0]?.id || "");
      setBranchName("");
      setAddress("");
      setRoutingNo("");
      setSwiftCode("");
      setAccounts([]);
    }
    setNewAccType("CD");
    setNewAccNum("");
    setNewAccName("");
  }, [initialBranch, isOpen, banks]);

  if (!isOpen) return null;

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNum.trim() || !newAccName.trim()) {
      toast.error("Please enter account number and account name.");
      return;
    }
    const acc: BankAccount = {
      id: `acc-${Date.now().toString(36)}`,
      accountsType: newAccType,
      accountsNumber: newAccNum.trim(),
      accountsName: newAccName.trim(),
    };
    setAccounts((prev) => [...prev, acc]);
    setNewAccNum("");
    setNewAccName("");
    toast.success(`Linked account ${acc.accountsName}`);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBank = banks.find((b) => b.id === bankId);
    if (!selectedBank) {
      toast.error("Please select a valid bank.");
      return;
    }
    if (!branchName.trim()) {
      toast.error("Branch name is required.");
      return;
    }

    onSubmit({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      bankAlias: selectedBank.alias,
      branchName: branchName.trim(),
      address: address.trim(),
      routingNo: routingNo.trim(),
      swiftCode: swiftCode.trim().toUpperCase(),
      accounts,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GitBranch className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {initialBranch ? "Edit Branch" : "New Branch"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Register branch identity details and manage linked bank accounts
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenNewBank}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                + Register New Bank
              </button>
            </div>
            <select
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.alias})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Branch Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shatmoshjid Road Branch"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Address</label>
            <input
              type="text"
              placeholder="e.g. House 42, Road 9/A, Dhanmondi, Dhaka"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Routing No & SWIFT Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Routing No.</label>
              <input
                type="text"
                placeholder="e.g. 090271891"
                value={routingNo}
                onChange={(e) => setRoutingNo(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-mono font-medium text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">SWIFT / BIC Code</label>
              <input
                type="text"
                placeholder="e.g. DBBLBDDH"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Linked Bank Accounts */}
          <div className="pt-2 border-t border-border/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Linked Accounts ({accounts.length})</label>
              <span className="text-[10px] text-muted-foreground">Corporate / Factory accounts</span>
            </div>

            {/* List of existing linked accounts */}
            {accounts.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {acc.accountsType}
                      </span>
                      <span className="font-semibold text-foreground">{acc.accountsName}</span>
                      <span className="font-mono text-muted-foreground text-[11px]">({acc.accountsNumber})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(acc.id)}
                      className="text-muted-foreground hover:text-rose-600 p-1 cursor-pointer"
                      title="Unlink Account"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/70 italic">No bank accounts linked to this branch yet.</p>
            )}

            {/* Quick Add Account row */}
            <div className="p-2.5 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-2">
              <span className="text-[11px] font-bold text-foreground block">+ Add Account Link</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none"
                >
                  <option value="CD">Current (CD)</option>
                  <option value="SND">Short Deposit (SND)</option>
                  <option value="FC">Foreign Curr (FC)</option>
                  <option value="Savings">Savings (SB)</option>
                </select>
                <input
                  type="text"
                  placeholder="A/C Number"
                  value={newAccNum}
                  onChange={(e) => setNewAccNum(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-mono font-medium text-foreground outline-none"
                />
                <input
                  type="text"
                  placeholder="Account Title"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
            >
              {initialBranch ? "Save Changes" : "Register Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component (Exact replica of uQ)
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
