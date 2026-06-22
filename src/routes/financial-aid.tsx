import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Banknote, ChevronRight, Plus, Search, Printer, X, Trash2,
  CheckCircle2, Clock, AlertCircle, Settings, Download, Eye
} from "lucide-react";

export const Route = createFileRoute("/financial-aid")({
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
  }
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [viewDetailsRecord, setViewDetailsRecord] = useState<AidRecord | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newTenure, setNewTenure] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newReason, setNewReason] = useState("");

  const [empSearchInput, setEmpSearchInput] = useState("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [prevZakat, setPrevZakat] = useState(0);
  const [prevAid, setPrevAid] = useState(0);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");

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
      { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Business Innovation", sect: "Project Resource & Strategy", title: "Asst. Manager", joinDate: "01/08/2023", gross: "152000.00" },
      { id: "2023046001", name: "Sohanur Rahman Sohan", dept: "HR, Admin and Compliance", sect: "Admin", title: "Executive", joinDate: "01/11/2023", gross: "27000.00" },
      { id: "2023043021", name: "Easin Mia", dept: "HR, Admin and Compliance", sect: "Admin", title: "Receptionist", joinDate: "01/02/2023", gross: "19000.00" },
      { id: "2026059411", name: "Jannatul Maowa", dept: "HR, Admin and Compliance", sect: "Admin", title: "Jr. Executive", joinDate: "10/05/2026", gross: "20000.00" }
    ];
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return [];
    const q = empSearchInput.toLowerCase();
    return employeesList.filter(
      emp => emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q)
    );
  }, [employeesList, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return employeesList.find(emp => emp.id === newEmpId) || null;
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
    let totalApproved = 0;
    records.forEach(r => {
      if (r.status === "Approved") {
        totalApproved += r.amount;
      }
    });

    const remainingBudget = budgetPool - totalApproved;

    return {
      budgetPool,
      totalApproved,
      remainingBudget,
      pendingApprovalCount: records.filter(r => r.status === "Pending").length
    };
  }, [records, budgetPool]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
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
    return records.some(r => r.employeeId === newEmpId && r.status === "Pending");
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
      if (!confirm(`Warning: Request amount (৳${amountNum.toLocaleString()}) exceeds available remaining Financial Aid budget pool (৳${stats.remainingBudget.toLocaleString()}). Do you still want to log this request?`)) {
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
      status: "Pending"
    };

    setRecords(prev => [newRecord, ...prev]);
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
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected", e: React.MouseEvent) => {
    e.stopPropagation();
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = ["ID", "Employee Name", "Employee ID", "Tenure (Months)", "Amount", "Reason", "Date", "Status"];
    const rows = filteredRecords.map(r => [
      r.id, r.employeeName, r.employeeId, r.tenureMonths, r.amount, `"${r.reason.replace(/"/g, '""')}"`, r.requestDate, r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `financial_aid_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Welfare & Support</span>
                <ChevronRight className="size-2.5" />
                <span className="text-blue-600 font-semibold">Financial Aid</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Banknote className="size-5.5 text-blue-600" />
                <span>Financial Aid Tracking Center</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Manage and distribute corporate financial grants seamlessly.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTempBudgetInput(budgetPool.toString());
                  setIsBudgetModalOpen(true);
                }}
                className="h-9 px-4 bg-muted hover:bg-muted/80 text-foreground border border-border/80 font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition uppercase tracking-wider"
              >
                <Settings className="size-3.5 text-muted-foreground" />
                <span>Configure Pool</span>
              </button>
              <button
                onClick={() => {
                  setNewEmpName("");
                  setNewEmpId("");
                  setEmpSearchInput("");
                  setPrevZakat(0);
                  setPrevAid(0);
                  setNewTenure("");
                  setIsModalOpen(true);
                }}
                className="h-9 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
              >
                <Plus className="size-4" />
                <span>Record Aid Request</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
            <div className="p-5 rounded-xl border bg-card text-[#1e88e5] bg-[#1e88e5]/5 border-[#1e88e5]/10 shadow-xs space-y-1 transition duration-200">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Allocated Budget Pool</span>
              <div className="text-2xl font-black">৳ {budgetPool.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Total set welfare fund</div>
            </div>
            <div className="p-5 rounded-xl border bg-card text-emerald-600 bg-emerald-500/5 border-emerald-500/10 shadow-xs space-y-1 transition duration-200">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Total Distributed</span>
              <div className="text-2xl font-black">৳ {stats.totalApproved.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Net grants provided</div>
            </div>
            <div className={`p-5 rounded-xl border bg-card shadow-xs space-y-1 transition duration-200 ${
              stats.remainingBudget < 100000 
                ? "text-rose-600 bg-rose-500/5 border-rose-500/20" 
                : "text-indigo-600 bg-indigo-500/5 border-indigo-500/10"
            }`}>
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Remaining Available</span>
              <div className="text-2xl font-black">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Available for new grants</div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            <div className="p-5 flex flex-col gap-4 border-b border-border/40 bg-muted/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 px-4 rounded-lg bg-background border border-border/60 text-xs font-semibold outline-none focus:border-blue-500 shadow-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Pending">Pending Request</option>
                    <option value="Approved">Approved & Granted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, ID, or reason..."
                      className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border border-border/60 text-xs font-semibold outline-none focus:border-blue-500 transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 print:hidden shrink-0">
                  <button onClick={handleExportCSV} className="h-9 px-4 rounded-lg border border-border/60 bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition shadow-sm text-emerald-600">
                    <Download className="size-3.5" /> Export CSV
                  </button>
                  <button onClick={handlePrint} className="h-9 px-4 rounded-lg border border-border/60 bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition shadow-sm text-blue-600">
                    <Printer className="size-3.5" /> Print Report
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Date:</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-blue-500" title="From Date" />
                  <span className="text-muted-foreground">-</span>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-blue-500" title="To Date" />
                </div>
                <div className="flex items-center gap-2 pl-4 border-l border-border/40">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Amount:</label>
                  <input type="number" placeholder="Min" value={minAmount} onChange={e => setMinAmount(e.target.value)} className="w-20 h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-blue-500" />
                  <span className="text-muted-foreground">-</span>
                  <input type="number" placeholder="Max" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} className="w-20 h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-blue-500" />
                </div>
                {(dateFrom || dateTo || minAmount || maxAmount) && (
                  <button onClick={() => { setDateFrom(""); setDateTo(""); setMinAmount(""); setMaxAmount(""); }} className="text-[10px] text-rose-500 font-bold hover:underline ml-2">Clear Filters</button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap text-[11px]">
                    <th className="px-5 py-3 border-r border-border/30">ID</th>
                    <th className="px-5 py-3 border-r border-border/30">Candidate Employee</th>
                    <th className="px-5 py-3 border-r border-border/30">Support Reason</th>
                    <th className="px-5 py-3 text-right border-r border-border/30">Amount</th>
                    <th className="px-5 py-3 text-center border-r border-border/30">Date Filed</th>
                    <th className="px-5 py-3 text-center border-r border-border/30">Status</th>
                    <th className="px-5 py-3 text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-sans text-xs">
                  {filteredRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75">
                      <td className="px-5 py-3 font-mono font-bold text-foreground/70 border-r border-border/20">{row.id}</td>
                      <td className="px-5 py-3 border-r border-border/20">
                        <div className="font-black text-foreground">{row.employeeName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {row.employeeId} • Tenure: {row.tenureMonths}m
                        </div>
                      </td>
                      <td className="px-5 py-3 border-r border-border/20">
                        <div className="text-xs text-foreground font-medium truncate max-w-[280px]" title={row.reason}>
                          {row.reason}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-black text-blue-600 border-r border-border/20">
                        ৳ {row.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-center font-mono text-muted-foreground border-r border-border/20">
                        {row.requestDate}
                      </td>
                      <td className="px-5 py-3 text-center border-r border-border/20">
                        {row.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-500/20">
                            <Clock className="size-3" /> Pending
                          </span>
                        )}
                        {row.status === "Approved" && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="size-3" /> Approved
                          </span>
                        )}
                        {row.status === "Rejected" && (
                          <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-rose-500/20">
                            <AlertCircle className="size-3" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewDetailsRecord(row)}
                            className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </button>
                          {row.status === "Pending" && (
                            <>
                              <button 
                                onClick={(e) => handleUpdateStatus(row.id, "Approved", e)}
                                className="p-1.5 hover:bg-emerald-500/10 text-emerald-600 rounded transition"
                                title="Approve"
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                              <button 
                                onClick={(e) => handleUpdateStatus(row.id, "Rejected", e)}
                                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded transition"
                                title="Reject"
                              >
                                <X className="size-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => handleDelete(row.id, e)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded transition"
                            title="Delete record"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm font-medium">
                        No financial aid requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Record Aid Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-3xl rounded-lg border border-border/80 shadow-2xl p-6 relative overflow-visible animate-in zoom-in-95 duration-200 text-xs">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition">
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-3.5">
              <Banknote className="size-5 text-blue-600" /> 
              <span>Grant Financial Aid</span>
            </h3>

            <form onSubmit={handleRecordRequest} className="space-y-5 font-medium overflow-visible">
              
              {/* Searchable dropdown container */}
              <div className="relative overflow-visible">
                <label className="text-[9px] font-extrabold text-muted-foreground uppercase block mb-1">
                  Search Candidate Employee (Name or ID) *
                </label>
                <div className="relative">
                  <Search className="size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Type employee ID or Name to search..."
                    value={empSearchInput}
                    onChange={e => {
                      setEmpSearchInput(e.target.value);
                      setIsEmpDropdownOpen(true);
                      if (!e.target.value) {
                        setNewEmpId("");
                        setNewEmpName("");
                        setNewTenure("");
                        setPrevZakat(0);
                        setPrevAid(0);
                      }
                    }}
                    onFocus={() => setIsEmpDropdownOpen(true)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-blue-500 focus:bg-card focus:ring-1 focus:ring-blue-500/20 outline-none text-xs transition duration-200"
                  />
                  {empSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmpSearchInput("");
                        setNewEmpId("");
                        setNewEmpName("");
                        setNewTenure("");
                        setPrevZakat(0);
                        setPrevAid(0);
                        setIsEmpDropdownOpen(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {isEmpDropdownOpen && filteredEmployeesForDropdown.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-lg shadow-xl z-50 divide-y divide-border/30">
                    {filteredEmployeesForDropdown.map(emp => {
                      const totals = getPreviousHelpTotals(emp.id);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setNewEmpId(emp.id);
                            setNewEmpName(emp.name);
                            setEmpSearchInput(`${emp.name} (${emp.id})`);
                            setPrevZakat(totals.totalZakat);
                            setPrevAid(totals.totalAid);
                            const tenure = calculateTenure(emp.joinDate);
                            setNewTenure(tenure.toString());
                            setIsEmpDropdownOpen(false);
                          }}
                          className="p-2 hover:bg-muted/50 cursor-pointer text-left space-y-0.5 transition"
                        >
                          <div className="flex justify-between font-bold text-foreground text-xs">
                            <span>{emp.name}</span>
                            <span className="font-mono text-muted-foreground text-[10px]">{emp.id}</span>
                          </div>
                          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                            <span>{emp.title} • {emp.dept}</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              Zakat: ৳{totals.totalZakat.toLocaleString()} | Aid: ৳{totals.totalAid.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selection Summary details */}
              {newEmpId && selectedEmpDetails && (
                <div className="grid grid-cols-2 gap-4 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 font-semibold animate-in fade-in duration-200">
                  <div>
                    <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Candidate Name</span>
                    <span className="text-xs font-black text-foreground">{newEmpName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Verified Emp ID</span>
                    <span className="text-xs font-mono font-bold text-foreground">{newEmpId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Role</span>
                    <span className="text-xs font-bold text-foreground">{selectedEmpDetails.title} • {selectedEmpDetails.dept}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Join Date</span>
                    <span className="text-xs font-mono font-bold text-foreground">{selectedEmpDetails.joinDate}</span>
                  </div>
                  <div className="col-span-2 flex justify-between border-t border-blue-500/20 pt-2 mt-1">
                    <div>
                      <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Previous Zakat Total</span>
                      <span className="text-xs font-bold text-blue-600">৳{prevZakat.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-blue-600/70 uppercase block">Previous Aid Total</span>
                      <span className="text-xs font-bold text-blue-600">৳{prevAid.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    readOnly
                    value={newTenure}
                    onChange={e => setNewTenure(e.target.value)}
                    placeholder="Auto-calculated"
                    className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/40 font-bold text-foreground select-none pointer-events-none text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">Eligibility Checklist</label>
                  <div className="flex flex-col gap-1.5 pt-1.5">
                    {newTenure ? (
                      isTenureEligible ? (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 animate-in slide-in-from-top-1">
                          <CheckCircle2 className="size-3.5" /> Tenure requirement met (≥ 6 months)
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1.5 animate-in slide-in-from-top-1">
                          <AlertCircle className="size-3.5" /> Tenure insufficient (Minimum 6 months)
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60 italic">Pending selection...</span>
                    )}

                    {newEmpId && hasExistingActiveRequest && (
                      <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1.5 animate-in slide-in-from-top-1">
                        <AlertCircle className="size-3.5" /> Employee has active pending requests
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">Reason / Justification *</label>
                  <textarea
                    required
                    value={newReason}
                    onChange={e => setNewReason(e.target.value)}
                    placeholder="Describe the employee's situation for audit compliance..."
                    className="w-full h-24 p-3 rounded-lg bg-card outline-none focus:border-blue-500 border border-border/40 resize-none transition text-xs shadow-sm"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">Grant Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="e.g. 20000"
                    className="w-full h-11 px-3 rounded-lg bg-card outline-none focus:border-blue-500 border border-border/40 font-black text-blue-600 shadow-sm transition text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/30">
                <button type="button" onClick={() => setIsModalOpen(false)} className="h-9 px-4 rounded-lg hover:bg-muted font-bold text-xs transition">Cancel</button>
                <button type="submit" className="h-9 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition shadow-sm">Grant Aid</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Configure Budget */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-2xl p-6 border border-border relative">
            <button onClick={() => setIsBudgetModalOpen(false)} className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition">
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-5 flex items-center gap-2">
              <Settings className="size-5 text-blue-600" /> Configure Fund Pool
            </h3>

            <form onSubmit={handleUpdateBudget} className="space-y-5 text-sm">
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Allocated Corporate Welfare Fund (৳) *</label>
                <input
                  type="number"
                  required
                  value={tempBudgetInput}
                  onChange={e => setTempBudgetInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background outline-none focus:border-blue-500 border border-border/60 font-black text-xl shadow-sm transition text-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="h-10 px-4 rounded-xl hover:bg-muted font-bold transition">Cancel</button>
                <button type="submit" className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-md">Save Pool</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: View Request Details */}
      {viewDetailsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl p-6 border border-border relative">
            <button onClick={() => setViewDetailsRecord(null)} className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition">
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-5 flex items-center gap-2 border-b border-border/40 pb-3.5">
              <Eye className="size-5 text-blue-600" /> Request Details: {viewDetailsRecord.id}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border/40 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Candidate</span>
                  <span className="font-bold text-foreground">{viewDetailsRecord.employeeName}</span>
                  <div className="text-muted-foreground font-mono">{viewDetailsRecord.employeeId}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Tenure</span>
                  <span className="font-bold text-foreground">{viewDetailsRecord.tenureMonths} months</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Requested Amount</span>
                  <span className="font-black text-blue-600 text-sm">৳ {viewDetailsRecord.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Date Filed</span>
                  <span className="font-mono text-foreground">{viewDetailsRecord.requestDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Full Support Reason / Justification</span>
                <div className="bg-background p-4 rounded-lg border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewDetailsRecord.reason}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40 gap-2">
                <button onClick={() => setViewDetailsRecord(null)} className="h-9 px-6 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg transition text-xs">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialAidPage;
