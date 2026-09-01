import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  ChevronRight,
  Calendar,
  FileCheck,
  FileSpreadsheet,
  Printer,
  FileText,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import { ERPBonusRecord } from "./payroll-bonus-submit";

export const Route = createFileRoute("/payroll-check-bonus-accounts")({
  head: () => ({
    meta: [
      { title: "Check Bonus (Accounts) — CRIPTON HRIS" },
      {
        name: "description",
        content: "Accounts Bonus Verification and Disbursement Module.",
      },
    ],
  }),
  component: CheckBonusAccountsPage,
});

const erpBonusData: ERPBonusRecord[] = [
  { sl: 1, empId: "2026058685", empIdOff: "", name: "Md Johirul Islam", joinDate: "15/02/2026", basic: 18000, gross: 30000, defaultPct: 25, reqPct: 25.00, bonusAmount: 4500, bankBonus: 4500.00, miscBonus: 0.00, notes: "", empType: "Office Executive", department: "Business Automation", section: "Core Development", designation: "Executive", unit: "PSL", line: "N/A", accountNo: "171.103.0756536", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 2, empId: "2025058109", empIdOff: "", name: "Mohammad Methoun Ahmed", joinDate: "22/12/2025", basic: 78000, gross: 130000, defaultPct: 25, reqPct: 25.00, bonusAmount: 19500, bankBonus: 6000.00, miscBonus: 13500.00, notes: "", empType: "Office Executive", department: "Business Automation", section: "Core Development", designation: "Sr. Manager", unit: "PSL", line: "N/A", accountNo: "171.103.0271428", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 3, empId: "2025057067", empIdOff: "", name: "Sunit Corneleous Sarker", joinDate: "01/10/2025", basic: 18000, gross: 30000, defaultPct: 25, reqPct: 50.00, bonusAmount: 9000, bankBonus: 8400.00, miscBonus: 600.00, notes: "Special Bonus", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Executive", unit: "PSL", line: "N/A", accountNo: "171.103.0675015", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 4, empId: "2022035599", empIdOff: "", name: "Dipon Saha", joinDate: "07/05/2022", basic: 40200, gross: 67000, defaultPct: 100, reqPct: 100.00, bonusAmount: 40200, bankBonus: 20507.00, miscBonus: 19693.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Manager", unit: "PSL", line: "N/A", accountNo: "105.105.30780", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Reviewed" },
  { sl: 5, empId: "2024052333", empIdOff: "", name: "Mohammad Rahatul Islam", joinDate: "01/10/2024", basic: 28800, gross: 48000, defaultPct: 100, reqPct: 100.00, bonusAmount: 28800, bankBonus: 22050.00, miscBonus: 6750.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Sr. Executive", unit: "PSL", line: "N/A", accountNo: "171.103.0276840", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 6, empId: "2024052410", empIdOff: "", name: "Dipan Kumar Kundu", joinDate: "15/10/2024", basic: 24600, gross: 41000, defaultPct: 100, reqPct: 100.00, bonusAmount: 24600, bankBonus: 18900.00, miscBonus: 5700.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Sr. Executive", unit: "PSL", line: "N/A", accountNo: "157.105.0001891", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Reviewed" },
  { sl: 7, empId: "2025057309", empIdOff: "", name: "Bani Amin Jwel", joinDate: "12/10/2025", basic: 63000, gross: 105000, defaultPct: 25, reqPct: 50.00, bonusAmount: 31500, bankBonus: 21167.00, miscBonus: 10333.00, notes: "Special Bonus", empType: "Office Executive", department: "Business Automation (HR)", section: "Core Development (HR)", designation: "Sr. Manager", unit: "PSL", line: "N/A", accountNo: "N/A", bankName: "N/A", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 8, empId: "2023044017", empIdOff: "", name: "Md. Rejaul Karim", joinDate: "13/08/2023", basic: 37800, gross: 63000, defaultPct: 100, reqPct: 100.00, bonusAmount: 37800, bankBonus: 23153.00, miscBonus: 14647.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Implementation & Support (HR)", designation: "Deputy Manager", unit: "PSL", line: "N/A", accountNo: "171.103.0257009", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
  { sl: 9, empId: "2021028542", empIdOff: "", name: "Zakir Hossain", joinDate: "09/10/2021", basic: 18900, gross: 31500, defaultPct: 100, reqPct: 100.00, bonusAmount: 18900, bankBonus: 16350.00, miscBonus: 2550.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Implementation & Support (HR)", designation: "Executive", unit: "PSL", line: "N/A", accountNo: "171.103.0200220", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Submitted" },
  { sl: 10, empId: "2025055045", empIdOff: "", name: "Md. Mahfuzur Rahman", joinDate: "03/05/2025", basic: 13200, gross: 22000, defaultPct: 50, reqPct: 50.00, bonusAmount: 6600, bankBonus: 5400.00, miscBonus: 1200.00, notes: "", empType: "Office Executive", department: "Business Automation (HR)", section: "Implementation & Support (HR)", designation: "Jr. Executive", unit: "PSL", line: "N/A", accountNo: "171.103.0497618", bankName: "Dutch-Bangla Bank Ltd.", feedback: "", reviewComments: "", status: "Pending" },
];

function CheckBonusAccountsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Mar");
  const [empTypeFilter, setEmpTypeFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<ERPBonusRecord[]>(erpBonusData);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState("");
  const [viewingRecord, setViewingRecord] = useState<ERPBonusRecord | null>(null);

  const handleLoadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRecords(erpBonusData);
      setIsLoaded(true);
      setIsLoading(false);
      setSelectedIds([]);
      toast.success(`Loaded ${erpBonusData.length} Accounts bonus records for ${selectedMonth} ${selectedYear}!`);

      if (searchEmpId.trim()) {
        const query = searchEmpId.trim().toLowerCase();
        const found = erpBonusData.find(
          (r) =>
            (idType === "System" && r.empId.toLowerCase().includes(query)) ||
            (idType === "Office" && r.empIdOff.toLowerCase().includes(query))
        );
        if (found) {
          setViewingRecord(found);
          toast.info(`Showing Attendance details for ${found.name} (${found.empId})`);
        }
      }
    }, 300);
  };

  const filteredRecords = useMemo(() => {
    if (!isLoaded) return [];
    return records.filter((r) => {
      if (empTypeFilter !== "ALL" && r.empType !== empTypeFilter) return false;
      if (deptFilter !== "All Departments" && r.department !== deptFilter) return false;
      if (sectionFilter !== "ALL" && r.section !== sectionFilter) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchEmpId.trim()) {
        const queryId = searchEmpId.trim().toLowerCase();
        if (idType === "System" && !r.empId.toLowerCase().includes(queryId)) return false;
        if (idType === "Office" && !r.empIdOff.toLowerCase().includes(queryId)) return false;
      }
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.accountNo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [isLoaded, records, empTypeFilter, deptFilter, sectionFilter, statusFilter, searchEmpId, idType, tableSearch]);

  const isAllSelected = useMemo(() => {
    if (filteredRecords.length === 0) return false;
    return filteredRecords.every((r) => selectedIds.includes(r.empId));
  }, [filteredRecords, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = filteredRecords.map((r) => r.empId);
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      const currentIds = filteredRecords.map((r) => r.empId);
      const newSet = new Set([...selectedIds, ...currentIds]);
      setSelectedIds(Array.from(newSet));
    }
  };

  const handleToggleSelectRow = (empId: string) => {
    setSelectedIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleUpdateRecordField = (empId: string, field: "feedback", value: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.empId === empId ? { ...r, [field]: value } : r))
    );
  };

  const handleBulkSubmitSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to Submit!");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.includes(r.empId) ? { ...r, status: "Submitted" } : r))
    );
    toast.success(`Successfully SUBMITTED ${selectedIds.length} Accounts bonus records!`);
    setSelectedIds([]);
  };

  const handleBulkReviewSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to Review!");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.includes(r.empId) ? { ...r, status: "Reviewed" } : r))
    );
    toast.success(`Marked ${selectedIds.length} Accounts bonus records as REVIEWED!`);
    setSelectedIds([]);
  };

  const handleExport = (type: "excel" | "pdf" | "print") => {
    if (filteredRecords.length === 0) {
      toast.error("No records available to export!");
      return;
    }
    if (type === "print") {
      window.print();
      return;
    }
    const headers = [
      "SL", "Emp Id", "Emp Id(Off)", "Name", "Join Date", "Basic", "Gross", "Default(%)", "Req(%)",
      "Bonus Amount", "Bank Bonus", "Misc. Bonus", "Notes", "Employee Type", "Department", "Section",
      "Designation", "Unit", "Line", "Account No", "Bank Name", "Feedback", "Status"
    ];
    const rows = filteredRecords.map((r, i) => [
      i + 1, `"${r.empId}"`, `"${r.empIdOff}"`, `"${r.name}"`, `"${r.joinDate}"`, r.basic, r.gross,
      r.defaultPct, r.reqPct.toFixed(2), r.bonusAmount, r.bankBonus.toFixed(2), r.miscBonus.toFixed(2),
      `"${r.notes}"`, `"${r.empType}"`, `"${r.department}"`, `"${r.section}"`, `"${r.designation}"`,
      `"${r.unit}"`, `"${r.line}"`, `"${r.accountNo}"`, `"${r.bankName}"`, `"${r.feedback}"`, `"${r.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Check_Bonus_Accounts_${selectedMonth}_${selectedYear}.${type === "excel" ? "csv" : "txt"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredRecords.length} records (${type.toUpperCase()})!`);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1700px] mx-auto w-full">
          {/* Top Breadcrumb & Page Header */}
          <div className="bg-white rounded-md border border-slate-300/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Payroll</span>
                <ChevronRight className="size-3" />
                <span>Salary Process</span>
                <ChevronRight className="size-3" />
                <span>Bonus Submission</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 font-bold">Check Bonus Accounts</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
                <Landmark className="size-5 text-blue-600" />
                <span>Check Bonus (Accounts) — Accounts Bonus Verification & Disbursement</span>
              </h1>
            </div>
          </div>

          {/* Top Filter Card matching pakiza ERP screenshot */}
          <div className="bg-white rounded-md border border-slate-300/90 p-4 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Year</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Month</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                  <option value="Mar">Mar</option>
                  <option value="Apr">Apr</option>
                  <option value="May">May</option>
                  <option value="Jun">Jun</option>
                  <option value="Jul">Jul</option>
                  <option value="Aug">Aug</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Employee Type</label>
                <select value={empTypeFilter} onChange={(e) => setEmpTypeFilter(e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Department</label>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                  <option value="All Departments">All Departments</option>
                  <option value="Business Automation">Business Automation</option>
                  <option value="Business Automation (HR)">Business Automation (HR)</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Core Development">Core Development</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Section</label>
                <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                  <option value="ALL">ALL</option>
                  <option value="Core Development">Core Development</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                  <option value="Implementation & Support (HR)">Implementation & Support (HR)</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="APPS Team">APPS Team</option>
                  <option value="WEB-Team">WEB-Team</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Submitted">Submitted</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">EmpId</label>
                  <input type="text" placeholder="Employee ID" value={searchEmpId} onChange={(e) => setSearchEmpId(e.target.value)} className="w-56 h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="radio" name="idType" checked={idType === "System"} onChange={() => setIdType("System")} className="accent-blue-600" /> System
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="radio" name="idType" checked={idType === "Office"} onChange={() => setIdType("Office")} className="accent-blue-600" /> Office
                  </label>
                </div>
              </div>

              <div className="pt-4 sm:pt-0">
                <button onClick={handleLoadData} disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider">
                  <Search className="size-3.5" />
                  <span>SEARCH</span>
                </button>
              </div>
            </div>
          </div>

          {/* Export Action Bar & Search Input matching Screenshot */}
          <div className="bg-white rounded-md border border-slate-300/90 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => handleExport("excel")} className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer">
                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                <span>EXCEL</span>
              </button>
              <button onClick={() => handleExport("print")} className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer">
                <Printer className="size-3.5 text-blue-600" />
                <span>PRINT</span>
              </button>
              <button onClick={() => handleExport("pdf")} className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer">
                <FileText className="size-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Search:</span>
              <input type="text" value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} className="w-56 h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            </div>
          </div>

          {/* Main ERP Bonus Data Table */}
          <div className="bg-white rounded-md border border-slate-300/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs border-collapse font-sans whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-200/90 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                    <th className="py-2.5 px-2 text-center w-8 border-r border-slate-300">
                      <input type="checkbox" checked={isAllSelected} onChange={handleToggleSelectAll} className="size-3.5 accent-blue-600 rounded-xs cursor-pointer" />
                    </th>
                    <th className="py-2.5 px-3 min-w-32 border-r border-slate-300">Feedback</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Emp Id</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Emp Id(Off)</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Name</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Join Date</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300">Basic</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300">Gross</th>
                    <th className="py-2.5 px-3 text-center border-r border-slate-300">Default(%)</th>
                    <th className="py-2.5 px-3 text-center border-r border-slate-300">Req(%)</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300">Bonus Amount</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300">Bank Bonus</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300">Misc. Bonus</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Notes</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Employee Type</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Department</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Section</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Designation</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Unit</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Line</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Account No</th>
                    <th className="py-2.5 px-3">Bank Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  {filteredRecords.map((r) => {
                    const isSelected = selectedIds.includes(r.empId);
                    return (
                      <tr key={r.empId} className={`transition-colors ${isSelected ? "bg-blue-50/80" : "hover:bg-slate-50"}`}>
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <input type="checkbox" checked={isSelected} onChange={() => handleToggleSelectRow(r.empId)} className="size-3.5 accent-blue-600 rounded-xs cursor-pointer" />
                        </td>
                        <td className="py-1.5 px-2.5 border-r border-slate-200">
                          <div className="flex items-center gap-1">
                            <input type="text" value={r.feedback} onChange={(e) => handleUpdateRecordField(r.empId, "feedback", e.target.value)} className="w-full h-7 px-2 bg-white border border-slate-300 rounded-sm text-[11px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
                            <button onClick={() => setViewingRecord(r)} title="View Attendance Log" className="size-7 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white grid place-items-center transition cursor-pointer shrink-0">
                              <Search className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-200 text-xs">{r.empId}</td>
                        <td className="py-2 px-3 font-mono text-slate-500 border-r border-slate-200 text-xs">{r.empIdOff || "—"}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200 text-xs">{r.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-600 border-r border-slate-200 text-xs">{r.joinDate}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 border-r border-slate-200 text-xs">{r.basic.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 border-r border-slate-200 text-xs">{r.gross.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-700 border-r border-slate-200 text-xs">{r.defaultPct}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-800 border-r border-slate-200 text-xs">{r.reqPct.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 border-r border-slate-200 text-xs">{r.bonusAmount.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 border-r border-slate-200 text-xs">{r.bankBonus.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-amber-700 border-r border-slate-200 text-xs">{r.miscBonus.toFixed(2)}</td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200 text-xs">{r.notes || "—"}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.empType}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.department}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.section}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.designation}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.unit}</td>
                        <td className="py-2 px-3 border-r border-slate-200 text-xs">{r.line}</td>
                        <td className="py-2 px-3 font-mono text-slate-800 border-r border-slate-200 text-xs">{r.accountNo}</td>
                        <td className="py-2 px-3 text-slate-700 text-xs">{r.bankName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Footer Bar with Submit & Review Buttons matching ERP */}
            <div className="bg-slate-100 p-3 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>

              <div className="flex items-center gap-3">
                <button onClick={handleBulkSubmitSelected} disabled={selectedIds.length === 0} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  Submit ({selectedIds.length})
                </button>
                <button onClick={handleBulkReviewSelected} disabled={selectedIds.length === 0} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  Review ({selectedIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Details Log Modal */}
        {viewingRecord && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden font-sans">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-blue-600 text-white grid place-items-center font-bold shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Employee Attendance Log — {selectedMonth} {selectedYear}</h3>
                    <p className="text-xs text-slate-300 font-medium">{viewingRecord.name} • Emp ID: <span className="font-mono font-bold text-emerald-400">{viewingRecord.empId}</span> • {viewingRecord.designation} ({viewingRecord.department})</p>
                  </div>
                </div>
                <button onClick={() => setViewingRecord(null)} className="size-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white grid place-items-center text-sm font-bold transition cursor-pointer">✕</button>
              </div>

              <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs font-semibold">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 font-bold">Present: 24 Days</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-md border border-amber-300 font-bold">Late: 2 Days</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-md border border-rose-300 font-bold">Absent: 0 Days</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md border border-blue-300 font-bold">Leave: 2 Days</span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md border border-slate-300 font-bold">Weekend: 5 Days</span>
                </div>
                <div className="font-mono text-slate-600 font-bold text-xs">Total Month Days: <span className="text-slate-900 font-extrabold">31 Days</span></div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b-2 border-slate-300 uppercase tracking-wider text-[11px] sticky top-0 shadow-2xs">
                      <th className="py-2.5 px-3 border-r border-slate-200">Date</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Day</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">In Time</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Out Time</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Shift</th>
                      <th className="py-2.5 px-3 text-right border-r border-slate-200">Work Hours</th>
                      <th className="py-2.5 px-3 text-right border-r border-slate-200">OT Hours</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Status</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {[
                      { date: "01/03/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "02/03/2026", day: "Sunday", in: "09:00 AM", out: "06:15 PM", shift: "General", work: "8.25", ot: "0.25", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "03/03/2026", day: "Monday", in: "09:14 AM", out: "06:30 PM", shift: "General", work: "8.25", ot: "0.25", status: "Late", statusColor: "bg-amber-100 text-amber-900 border-amber-300", remarks: "Late by 14 mins" },
                      { date: "04/03/2026", day: "Tuesday", in: "08:55 AM", out: "08:30 PM", shift: "General", work: "10.50", ot: "2.50", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "2.5 hrs Overtime" },
                      { date: "05/03/2026", day: "Wednesday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Casual Leave", statusColor: "bg-blue-100 text-blue-800 border-blue-300", remarks: "Leave Approved" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-slate-800 border-r border-slate-200">{row.date}</td>
                        <td className="py-2 px-3 font-medium text-slate-600 border-r border-slate-200">{row.day}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-700 border-r border-slate-200">{row.in}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-700 border-r border-slate-200">{row.out}</td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200">{row.shift}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">{row.work} hrs</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 border-r border-slate-200">{row.ot} hrs</td>
                        <td className="py-2 px-3 text-center border-r border-slate-200"><span className={`px-2 py-0.5 rounded-xs text-[10.5px] font-extrabold border ${row.statusColor}`}>{row.status}</span></td>
                        <td className="py-2 px-3 text-slate-500 font-medium">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">Showing daily punch log for <strong className="text-slate-900">{viewingRecord.name}</strong></span>
                <button onClick={() => setViewingRecord(null)} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow-xs transition cursor-pointer">Close Attendance View</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
