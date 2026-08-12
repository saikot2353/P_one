import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Banknote,
  ChevronRight,
  Plus,
  Search,
  Printer,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Settings,
  Download,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/financial-aid-list")({
  head: () => ({
    meta: [
      { title: "Financial Aid — CRIPTON" },
      { name: "description", content: "Track financial assistance provided to employees." },
    ],
  }),
  component: FinancialAidPage,
});

interface AidRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  tenureMonths: number;
  amount: number;
  reason: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const defaultAidRecords: AidRecord[] = [
  {
    id: "FA-2026-01",
    employeeName: "Shakil Ahmed",
    employeeId: "2023043021",
    tenureMonths: 18,
    amount: 30000,
    reason: "Medical emergency - Hospitalization fees",
    requestDate: "2026-06-10",
    status: "Approved",
  },
  {
    id: "FA-2026-02",
    employeeName: "Salma Khatun",
    employeeId: "2023046001",
    tenureMonths: 24,
    amount: 15000,
    reason: "House repair costs due to flash flooding damages",
    requestDate: "2026-06-15",
    status: "Pending",
  },
];

function FinancialAidPage() {
  const [records, setRecords] = useState<AidRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid");
      return saved ? JSON.parse(saved) : defaultAidRecords;
    }
    return defaultAidRecords;
  });

  const [budgetPool, setBudgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budget");
      return saved ? parseFloat(saved) : 1500000;
    }
    return 1500000;
  });

  useEffect(() => {
    localStorage.setItem("cripton_financial_aid", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("cripton_financial_aid_budget", budgetPool.toString());
  }, [budgetPool]);


  const [budgetPools, setBudgetPools] = useState<{ year: number; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budgets");
      return saved ? JSON.parse(saved) : [{ year: new Date().getFullYear(), amount: 1500000 }];
    }
    return [{ year: new Date().getFullYear(), amount: 1500000 }];
  });

  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(new Date().getFullYear());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [viewDetailsRecord, setViewDetailsRecord] = useState<AidRecord | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newTenure, setNewTenure] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newReason, setNewReason] = useState("");

  const [empSearchInput, setEmpSearchInput] = useState("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [prevZakat, setPrevZakat] = useState(0);
  const [prevAid, setPrevAid] = useState(0);


  const employeesList = useMemo(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "2023043910",
        name: "Tahmid Afsar Shapno",
        dept: "Business Innovation",
        sect: "Project Resource & Strategy",
        title: "Asst. Manager",
        joinDate: "01/08/2023",
        gross: "152000.00",
      },
      {
        id: "2023046001",
        name: "Sohanur Rahman Sohan",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Executive",
        joinDate: "01/11/2023",
        gross: "27000.00",
      },
      {
        id: "2023043021",
        name: "Easin Mia",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Receptionist",
        joinDate: "01/02/2023",
        gross: "19000.00",
      },
      {
        id: "2026059411",
        name: "Jannatul Maowa",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Jr. Executive",
        joinDate: "10/05/2026",
        gross: "20000.00",
      },
    ];
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return [];
    const q = empSearchInput.toLowerCase();
    return employeesList.filter(
      (emp) => emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q),
    );
  }, [employeesList, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return employeesList.find((emp) => emp.id === newEmpId) || null;
  }, [employeesList, newEmpId]);

  const getPreviousHelpTotals = (empId: string) => {
    let totalZakat = 0;
    let totalAid = 0;
    if (typeof window !== "undefined") {
      const savedZakat = localStorage.getItem("cripton_zakat_records");
      if (savedZakat) {
        try {
          const parsed = JSON.parse(savedZakat);
          if (Array.isArray(parsed)) {
            totalZakat = parsed
              .filter((r: any) => r.employeeId === empId && r.agencyStatus === "Verified")
              .reduce((sum, r) => sum + r.amount, 0);
          }
        } catch (e) {}
      }
      const savedAid = localStorage.getItem("cripton_financial_aid");
      if (savedAid) {
        try {
          const parsed = JSON.parse(savedAid);
          if (Array.isArray(parsed)) {
            totalAid = parsed
              .filter((r: any) => r.employeeId === empId && r.status === "Approved")
              .reduce((sum, r) => sum + r.amount, 0);
          }
        } catch (e) {}
      }
    }
    return { totalZakat, totalAid };
  };

  const calculateTenure = (joinDateStr: string): number => {
    if (!joinDateStr || joinDateStr === "—") return 0;
    const parts = joinDateStr.split("/");
    if (parts.length !== 3) return 0;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);

    const joinDate = new Date(year, month, day);
    const currentDate = new Date(2026, 5, 22);

    const diffYears = currentDate.getFullYear() - joinDate.getFullYear();
    const diffMonths = currentDate.getMonth() - joinDate.getMonth();

    let totalMonths = diffYears * 12 + diffMonths;
    if (currentDate.getDate() < joinDate.getDate()) {
      totalMonths -= 1;
    }
    return Math.max(0, totalMonths);
  };


  const stats = useMemo(() => {
    const yearRecords = records.filter(r => r.requestDate.startsWith(selectedBudgetYear.toString()));
    
    let totalApproved = 0;
    yearRecords.forEach((r) => {
      if (r.status === "Approved") {
        totalApproved += r.amount;
      }
    });

    const activePool = budgetPools.find(b => b.year === selectedBudgetYear);
    const currentBudget = activePool ? activePool.amount : 0;
    const remainingBudget = currentBudget - totalApproved;

    return {
      currentBudget,
      totalApproved,
      remainingBudget,
      pendingApprovalCount: yearRecords.filter((r) => r.status === "Pending").length,
    };
  }, [records, budgetPools, selectedBudgetYear]);


  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (dateFrom && r.requestDate < dateFrom) return false;
      if (dateTo && r.requestDate > dateTo) return false;
      if (minAmount && r.amount < parseFloat(minAmount)) return false;
      if (maxAmount && r.amount > parseFloat(maxAmount)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedStatus, searchQuery, dateFrom, dateTo, minAmount, maxAmount]);

  const isTenureEligible = useMemo(() => {
    if (!newTenure) return true;
    const tenureNum = parseInt(newTenure);
    return tenureNum >= 6;
  }, [newTenure]);

  const hasExistingActiveRequest = useMemo(() => {
    if (!newEmpId) return false;
    return records.some((r) => r.employeeId === newEmpId && r.status === "Pending");
  }, [newEmpId, records]);

  const handleRecordRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpId || !newAmount || !newReason || !newTenure) {
      alert("Please fill in all required fields (make sure to select an employee).");
      return;
    }

    const amountNum = parseFloat(newAmount);
    const tenureNum = parseInt(newTenure);

    if (amountNum > stats.remainingBudget) {
      if (
        !confirm(
          `Warning: Request amount (৳${amountNum.toLocaleString()}) exceeds available remaining Financial Aid budget pool (৳${stats.remainingBudget.toLocaleString()}). Do you still want to log this request?`,
        )
      ) {
        return;
      }
    }

    const today = new Date().toISOString().split("T")[0];

    const newRecord: AidRecord = {
      id: `FA-2026-${String(records.length + 1).padStart(2, "0")}`,
      employeeName: newEmpName,
      employeeId: newEmpId,
      tenureMonths: tenureNum,
      amount: amountNum,
      reason: newReason,
      requestDate: today,
      status: "Pending",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsModalOpen(false);

    setNewEmpName("");
    setNewEmpId("");
    setEmpSearchInput("");
    setPrevZakat(0);
    setPrevAid(0);
    setNewTenure("");
    setNewAmount("");
    setNewReason("");
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput);
    if (isNaN(val) || val < 0) {
      alert("Invalid budget pool input.");
      return;
    }
    setBudgetPool(val);
    setIsBudgetModalOpen(false);
    setTempBudgetInput("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this financial aid application record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: "Approved" | "Rejected",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "ID",
      "Employee Name",
      "Employee ID",
      "Tenure (Months)",
      "Amount",
      "Reason",
      "Date",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.employeeName,
      r.employeeId,
      r.tenureMonths,
      r.amount,
      `"${r.reason.replace(/"/g, '""')}"`,
      r.requestDate,
      r.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `financial_aid_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-5 xl:p-6 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-1.5 print:hidden">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span>Welfare & Support</span>
              <ChevronRight className="size-2.5" />
              <span className="text-blue-600">Financial Aid</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
              <Banknote className="size-5 text-blue-600" />
              <span>Financial Aid Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Track and manage internal financial assistance and emergency loans provided to employees.
            </p>
          </div>

          <div className="flex items-center justify-between print:hidden">
            <select
              value={selectedBudgetYear}
              onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))}
              className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500 transition-colors shadow-sm"
            >
              {budgetPools.map(b => (
                <option key={b.year} value={b.year}>{b.year}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setNewEmpName("");
                setNewEmpId("");
                setEmpSearchInput("");
                setNewTenure("");
                setNewAmount("");
                setNewReason("");
                setPrevZakat(0);
                setPrevAid(0);
                setIsModalOpen(true);
              }}
              className="h-8 px-4 bg-[#4361EE] hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-widest"
            >
              <Plus className="size-3.5" />
              <span>New Aid Request</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:hidden">
            <div className="p-4 rounded-xl bg-[#F0FDF4] text-emerald-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Welfare Budget Pool
              </span>
              <div className="text-xl font-black text-emerald-600">৳ {stats.currentBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-emerald-600">Total corporate fund set</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF6FF] text-blue-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Total Disbursed
              </span>
              <div className="text-xl font-black text-blue-600">৳ {stats.totalApproved.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-blue-500">Approved funds</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF7ED] text-orange-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Remaining Funds
              </span>
              <div className="text-xl font-black text-orange-600">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-orange-500">Available to allocate</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FEF2F2] text-rose-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Pending Requests
              </span>
              <div className="text-xl font-black text-rose-600">{stats.pendingApprovalCount}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-rose-500">Awaiting HR review</div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 px-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee or ID..."
                    className="w-full h-8 pl-8 pr-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium outline-none focus:bg-white focus:border-blue-500 transition-colors text-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 print:hidden">
                <button
                  onClick={handleExportCSV}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-emerald-600 shadow-sm"
                >
                  <Download className="size-3" /> Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-blue-600 shadow-sm"
                >
                  <Printer className="size-3" /> Print
                </button>
              </div>
            </div>

            {/* Assigned Date & Amount Filters */}
            <div className="flex flex-wrap gap-3 items-center pt-2 pb-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Date Range:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Amount:
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="h-7 w-20 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="h-7 w-20 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              {(dateFrom || dateTo || minAmount || maxAmount) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setMinAmount("");
                    setMaxAmount("");
                  }}
                  className="text-[9px] text-red-500 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center w-12">SL</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Employee</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Tenure</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-right">Amount (৳)</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Reason / Date</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((row, index) => {
                    return (
                      <tr
                        key={row.id}
                        className="transition-colors duration-150 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.employeeName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.employeeId}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500">
                          {row.tenureMonths} Months
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 text-[11px] text-right">
                          ৳ {row.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700 text-[10px] line-clamp-1 max-w-[200px]" title={row.reason}>
                            {row.reason}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.requestDate}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-center">
                          {row.status === "Pending" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-700 bg-amber-100">
                              Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-100">
                              Approved
                            </span>
                          )}
                          {row.status === "Rejected" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-rose-700 bg-rose-100">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            {row.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => handleUpdateStatus(row.id, "Approved", e)}
                                  className="p-1 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleUpdateStatus(row.id, "Rejected", e)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                  title="Reject"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setViewDetailsRecord(row)}
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                              title="View full details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.id, e);
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-medium text-[11px]">
                        No matching financial aid cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/* MODAL: View Request Details */}
      {viewDetailsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl p-6 border border-border relative">
            <button
              onClick={() => setViewDetailsRecord(null)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-3.5">
              <Eye className="size-5 text-blue-600" /> Request Details: {viewDetailsRecord.id}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border/40 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    Candidate
                  </span>
                  <span className="font-bold text-foreground">
                    {viewDetailsRecord.employeeName}
                  </span>
                  <div className="text-muted-foreground font-mono">
                    {viewDetailsRecord.employeeId}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    Tenure
                  </span>
                  <span className="font-bold text-foreground">
                    {viewDetailsRecord.tenureMonths} months
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    Requested Amount
                  </span>
                  <span className="font-black text-blue-600 text-sm">
                    ৳ {viewDetailsRecord.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    Date Filed
                  </span>
                  <span className="font-mono text-foreground">{viewDetailsRecord.requestDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Full Support Reason / Justification
                </span>
                <div className="bg-background p-4 rounded-lg border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewDetailsRecord.reason}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40 gap-2">
                <button
                  onClick={() => setViewDetailsRecord(null)}
                  className="h-9 px-6 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
