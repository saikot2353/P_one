import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  ChevronRight, ClipboardCheck, Search,
  Play, FileText, Printer, FileDown, CheckCircle, XCircle, Users, Activity, Banknote, CalendarDays
} from "lucide-react";

export const Route = createFileRoute("/check-approve-salary")({
  component: CheckApproveSalaryPage,
  head: () => ({
    meta: [
      { title: "Salary Process Validation — CRIPTON" },
      { name: "description", content: "Review, validate, verify, and approve salaries." },
    ],
  }),
});

interface SalaryRecord {
  id: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  employeeType: string;
  totalPay: number;
  bankPay: number;
  cashPay: number;
  status: "Pending" | "Checked" | "Approved" | "Rejected";
  feedback?: string;
  comments?: string;
}

const initialMockData: SalaryRecord[] = [
  { id: "SAL-1001", empId: "EMP-2000", name: "Rajibul Hasan", department: "IT", designation: "Software Engineer", employeeType: "Permanent", totalPay: 65000, bankPay: 65000, cashPay: 0, status: "Pending" },
  { id: "SAL-1002", empId: "EMP-2001", name: "Arifur Rahman", department: "Operations", designation: "Manager", employeeType: "Permanent", totalPay: 85000, bankPay: 80000, cashPay: 5000, status: "Pending" },
  { id: "SAL-1003", empId: "EMP-2002", name: "Sumon Ali", department: "HR", designation: "Executive", employeeType: "Permanent", totalPay: 45000, bankPay: 45000, cashPay: 0, status: "Checked" },
  { id: "SAL-1004", empId: "EMP-2003", name: "Kamrul Islam", department: "Finance", designation: "Accountant", employeeType: "Permanent", totalPay: 55000, bankPay: 55000, cashPay: 0, status: "Pending" },
  { id: "SAL-1005", empId: "EMP-2004", name: "Rubel Hossain", department: "Marketing", designation: "Officer", employeeType: "Contractual", totalPay: 35000, bankPay: 30000, cashPay: 5000, status: "Approved" },
];

function CheckApproveSalaryPage() {
  const [mainTab, setMainTab] = useState<"check" | "approve">("check");
  const [subTab, setSubTab] = useState<"monthly" | "advance" | "bonus">("monthly");
  
  const [records, setRecords] = useState<SalaryRecord[]>(initialMockData);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Search/Filters (Basic inline)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (mainTab === "check" && r.status === "Approved") return false;
      if (mainTab === "approve" && r.status === "Pending") return false;
      
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, mainTab, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    let pendingCount = 0;
    let checkedCount = 0;
    let approvedCount = 0;
    let totalAmount = 0;

    records.forEach(r => {
      totalAmount += r.totalPay;
      if (r.status === "Pending") pendingCount++;
      if (r.status === "Checked") checkedCount++;
      if (r.status === "Approved") approvedCount++;
    });

    return { totalRecords: records.length, pendingCount, checkedCount, approvedCount, totalAmount };
  }, [records]);

  const handleFetchData = () => {
    setIsDataLoaded(true);
    setIsFilterModalOpen(false);
    setSelectedIds(new Set());
    toast.success("Data fetched based on selected filters.");
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const actionable = filteredRecords.filter(r => 
        (mainTab === "check" && r.status === "Pending") || 
        (mainTab === "approve" && r.status === "Checked")
      );
      setSelectedIds(new Set(actionable.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action: "Checked" | "Approved" | "Rejected") => {
    if (selectedIds.size === 0) return;
    
    if (action === "Rejected") {
      const reason = window.prompt("Reason for rejection:");
      if (!reason) return;
    } else {
      if (!confirm(`Are you sure you want to mark ${selectedIds.size} records as ${action}?`)) return;
    }

    setRecords(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: action } : r));
    setSelectedIds(new Set());
    toast.success(`Successfully marked ${selectedIds.size} records as ${action}.`);
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = ["Emp ID", "Name", "Dept", "Desig", "Type", "Total Pay", "Bank Pay", "Cash Pay", "Status"];
    const rows = filteredRecords.map(r => [
      r.empId, r.name, r.department, r.designation, r.employeeType, r.totalPay, r.bankPay, r.cashPay, r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `salary_process_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">Payroll</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Check & Approve</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${mainTab === 'check' ? 'bg-[#2563eb]/10 text-[#2563eb]' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  {mainTab === 'check' ? <ClipboardCheck className="size-4" /> : <CheckCircle className="size-4" />}
                </div>
                <span>Salary Process Validation</span>
              </h1>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
              <button 
                onClick={() => { setMainTab('check'); setSelectedIds(new Set()); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${mainTab === 'check' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700'}`}
              >
                <ClipboardCheck className="size-3.5" />
                CHECK MODE
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] ${mainTab === 'check' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {stats.pendingCount}
                </span>
              </button>
              <button 
                onClick={() => { setMainTab('approve'); setSelectedIds(new Set()); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${mainTab === 'approve' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700'}`}
              >
                <CheckCircle className="size-3.5" />
                APPROVE MODE
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] ${mainTab === 'approve' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {stats.checkedCount}
                </span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0 print:hidden">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Records</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{stats.totalRecords} Employees</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#1e88e5]/20 bg-[#1e88e5]/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[#1e88e5] shrink-0 border border-[#1e88e5]/20">
                <Banknote className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#1e88e5]/70 uppercase tracking-wider">Total Amount</p>
                <h3 className="text-sm font-extrabold text-[#1e88e5] mt-0.5">৳ {stats.totalAmount.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-amber-500/10 bg-amber-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-wider">Pending Check</p>
                <h3 className="text-sm font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">{stats.pendingCount} Records</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">Approved</p>
                <h3 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">{stats.approvedCount} Records</h3>
              </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 print:hidden space-y-3">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                <button 
                  onClick={() => { setSubTab("monthly"); setSelectedIds(new Set()); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${subTab === 'monthly' ? 'bg-[#2563eb]/10 text-[#2563eb]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Monthly Salary
                </button>
                <button 
                  onClick={() => { setSubTab("advance"); setSelectedIds(new Set()); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${subTab === 'advance' ? 'bg-[#2563eb]/10 text-[#2563eb]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Advance Salary
                </button>
                <button 
                  onClick={() => { setSubTab("bonus"); setSelectedIds(new Set()); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${subTab === 'bonus' ? 'bg-[#2563eb]/10 text-[#2563eb]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Yearly Bonus
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-48">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Name or ID..."
                    className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb] transition"
                  />
                </div>
                
                <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                  <DialogTrigger asChild>
                    <button className="h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm">
                      <Play className="size-3.5 fill-current" /> Advanced Filter
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Advanced Search & Filters</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Year</label>
                        <select className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                          <option>2026</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Month</label>
                        <select className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                          <option>May</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Status</label>
                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                          <option value="ALL">All Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Checked">Checked</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Company</label>
                        <select className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">
                          <option>Pakiza Software Limited</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <button onClick={handleFetchData} className="h-9 px-4 rounded-md bg-emerald-600 text-white font-semibold text-sm">Apply Filters</button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <button onClick={handleExportCSV} className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-emerald-600">
                  <FileDown className="size-3.5" /> Export
                </button>
                <button onClick={() => window.print()} className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-[#2563eb]">
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>
          </div>

          {/* Main Table Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {selectedIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20">
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">records ready for action</span>
                </div>
                <div className="flex items-center gap-2">
                  {mainTab === "check" ? (
                    <>
                      <button onClick={() => handleBulkAction("Rejected")} className="h-7.5 px-3 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                        <XCircle className="size-3.5" /> Reject Selected
                      </button>
                      <button onClick={() => handleBulkAction("Checked")} className="h-7.5 px-3 bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm">
                        <ClipboardCheck className="size-3.5" /> Check Selected
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleBulkAction("Rejected")} className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                        <XCircle className="size-3.5" /> Reject Selected
                      </button>
                      <button onClick={() => handleBulkAction("Approved")} className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm">
                        <CheckCircle className="size-3.5" /> Approve Selected
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">
              {!isDataLoaded ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900">
                  <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                    <Search className="size-5" />
                  </div>
                  <p className="text-sm font-medium">Click <span className="font-bold text-slate-600 dark:text-slate-300">ADVANCED FILTER</span> to fetch data</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-10">
                    <tr>
                      <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                          onChange={handleSelectAll}
                          checked={selectedIds.size > 0 && selectedIds.size === filteredRecords.filter(r => (mainTab === "check" && r.status === "Pending") || (mainTab === "approve" && r.status === "Checked")).length}
                        />
                      </th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 w-[80px]">Emp ID</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">Employee Name</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">Department</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right border-r border-slate-200 dark:border-slate-800 w-[120px]">Total Pay</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right border-r border-slate-200 dark:border-slate-800 w-[120px]">Bank Pay</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right border-r border-slate-200 dark:border-slate-800 w-[120px]">Cash Pay</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">Status</th>
                      <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-[180px]">Feedback / Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {filteredRecords.map((row) => {
                      const isChecked = selectedIds.has(row.id);
                      const isSelectable = (mainTab === "check" && row.status === "Pending") || (mainTab === "approve" && row.status === "Checked");
                      
                      return (
                        <tr key={row.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isChecked ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10' : ''}`}>
                          <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                            {isSelectable && (
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                                checked={isChecked}
                                onChange={() => handleSelectOne(row.id)}
                              />
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">{row.empId}</td>
                          <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                            <div className="font-bold text-slate-800 dark:text-slate-100">{row.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {row.designation} • {row.employeeType}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                            {row.department}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600 border-r border-slate-200 dark:border-slate-800">
                            {row.totalPay.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#2563eb] border-r border-slate-200 dark:border-slate-800">
                            {row.bankPay.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-rose-500 border-r border-slate-200 dark:border-slate-800">
                            {row.cashPay.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                            {row.status === "Pending" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                <Activity className="size-3" /> Pending
                              </span>
                            )}
                            {row.status === "Checked" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/20">
                                <ClipboardCheck className="size-3" /> Checked
                              </span>
                            )}
                            {row.status === "Approved" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                <CheckCircle className="size-3" /> Approved
                              </span>
                            )}
                            {row.status === "Rejected" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                                <XCircle className="size-3" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              className="w-full h-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 text-[11px] font-normal outline-none focus:border-[#2563eb]" 
                              placeholder="Add feedback..."
                              disabled={!isSelectable}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-slate-500 font-medium">
                          No records found matching the current criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {isDataLoaded && (
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 print:hidden">
                <div>Showing {filteredRecords.length} records</div>
                <div className="flex items-center gap-1.5">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>Previous</button>
                  <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">1</button>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
