import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Search,
  FileDown,
  Printer,
  FileText,
  ChevronRight,
  Filter,
  Calculator,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import { YEARLY_BONUS_DATA, type YearlyBonusRecord } from "./-yearly-bonus-data";

export const Route = createFileRoute("/yearly-bonus-report")({
  head: () => ({
    meta: [
      { title: "Yearly Bonus Report — CRIPTON HRIS" },
      { name: "description", content: "Yearly Bonus Report for employee festival and annual bonuses." },
    ],
  }),
  component: YearlyBonusReportPage,
});

export function YearlyBonusReportPage() {
  // Filter States
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Mar");
  const [bonusFor, setBonusFor] = useState("Eid-Ul-Fitr");
  const [payOption, setPayOption] = useState("ALL");
  const [bankName, setBankName] = useState("ALL");
  
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");

  const [unit, setUnit] = useState("ALL");
  const [shift, setShift] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");

  const [outputMode, setOutputMode] = useState("System");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Dynamic filter options extracted from dataset
  const bankOptions = useMemo(() => {
    const banks = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.bankName).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...banks.map((b) => ({ value: b, label: b }))];
  }, []);

  const empTypeOptions = useMemo(() => {
    const types = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.empType).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...types.map((t) => ({ value: t, label: t }))];
  }, []);

  const departmentOptions = useMemo(() => {
    const deps = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.department).filter(Boolean))).sort();
    return [{ value: "All Departments", label: "All Departments" }, ...deps.map((d) => ({ value: d, label: d }))];
  }, []);

  const sectionOptions = useMemo(() => {
    const secs = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.section).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...secs.map((s) => ({ value: s, label: s }))];
  }, []);

  const unitOptions = useMemo(() => {
    const units = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.unit).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...units.map((u) => ({ value: u, label: u }))];
  }, []);

  const lineOptions = useMemo(() => {
    const lines = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.line).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...lines.map((l) => ({ value: l, label: l }))];
  }, []);

  const shiftOptions = useMemo(() => {
    const shifts = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.shift).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...shifts.map((s) => ({ value: s, label: s }))];
  }, []);

  const bonusForOptions = useMemo(() => {
    const list = Array.from(new Set(YEARLY_BONUS_DATA.map((d) => d.bonusFor).filter(Boolean))).sort();
    return [{ value: "ALL", label: "ALL" }, ...list.map((bf) => ({ value: bf, label: bf }))];
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return YEARLY_BONUS_DATA.filter((item) => {
      // Bonus For
      if (bonusFor !== "ALL" && item.bonusFor !== bonusFor) return false;

      // Bank Name
      if (bankName !== "ALL" && item.bankName !== bankName) return false;

      // Employee Type
      if (empType !== "ALL" && item.empType !== empType) return false;

      // Department filter
      if (department !== "All Departments" && item.department !== department) return false;

      // Section filter
      if (section !== "ALL" && item.section !== section) return false;

      // Unit filter
      if (unit !== "ALL" && item.unit !== unit) return false;

      // Shift filter
      if (shift !== "ALL" && item.shift !== shift) return false;

      // Line filter
      if (line !== "ALL" && item.line !== line) return false;

      // Comma-separated ID filter
      if (empIdInput.trim()) {
        const ids = empIdInput
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0) {
          const matchId = ids.some(
            (id) => item.empId.toLowerCase().includes(id) || item.empIdOff.toLowerCase().includes(id)
          );
          if (!matchId) return false;
        }
      }

      // Live search filter across name, ID, designation, department, etc.
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.empIdOff.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.bankName.toLowerCase().includes(q) ||
          item.accountNo.toLowerCase().includes(q) ||
          item.mobile.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [bonusFor, bankName, empType, department, section, unit, shift, line, empIdInput, searchQuery]);

  // Grand Totals
  const grandTotals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.gross += curr.gross || 0;
        acc.basic += curr.basic || 0;
        acc.bonusAmount += curr.bonusAmount || 0;
        acc.bankBonus += curr.bankBonus || 0;
        acc.miscBonus += curr.miscBonus || 0;
        acc.bankSetAmt += curr.bankSetAmt || 0;
        return acc;
      },
      {
        gross: 0,
        basic: 0,
        bonusAmount: 0,
        bankBonus: 0,
        miscBonus: 0,
        bankSetAmt: 0,
      }
    );
  }, [filteredData]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export Handlers
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "ID",
      "Emp ID(Off)",
      "Name",
      "Employee Type",
      "Department",
      "Section",
      "Designation",
      "Unit",
      "Line",
      "Shift",
      "Join Date",
      "Mobile",
      "Gross",
      "Basic",
      "Bonus (%)",
      "Bonus Amount",
      "Bank Bonus",
      "Misc. Bonus",
      "Bank Set Amt",
      "Account No",
      "Bank Name",
      "Bonus For",
    ];

    const rows = filteredData.map((d, index) => [
      index + 1,
      `"${d.empId}"`,
      `"${d.empIdOff}"`,
      `"${d.name}"`,
      `"${d.empType}"`,
      `"${d.department}"`,
      `"${d.section}"`,
      `"${d.designation}"`,
      `"${d.unit}"`,
      `"${d.line}"`,
      `"${d.shift}"`,
      `"${d.joinDate}"`,
      `"${d.mobile}"`,
      d.gross,
      d.basic,
      `"${d.bonusPercent}"`,
      d.bonusAmount,
      d.bankBonus,
      d.miscBonus,
      d.bankSetAmt,
      `"${d.accountNo}"`,
      `"${d.bankName}"`,
      `"${d.bonusFor}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Yearly_Bonus_Report_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 print:p-0 print:bg-white">
          {/* Breadcrumb Navigation & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <Link to="/payroll-reports" className="hover:text-primary transition-colors">
                  Payroll Reports
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground">Yearly Bonus Report</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calculator className="size-5 text-emerald-600" />
                Yearly Bonus Report
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {filteredData.length} Records Found
              </span>
            </div>
          </div>

          {/* Filter Card matching exact reference screenshot */}
          <div className="bg-card rounded-xl border border-border/80 shadow-sm p-4 print:hidden space-y-3">
            {/* Row 1: Year, Month, Bonus For, Pay Option, Bank Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Year</label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[
                    { value: "2026", label: "2026" },
                    { value: "2025", label: "2025" },
                    { value: "2024", label: "2024" },
                    { value: "2023", label: "2023" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Month</label>
                <SearchableSelect
                  value={month}
                  onChange={setMonth}
                  options={[
                    { value: "Mar", label: "Mar" },
                    { value: "Jan", label: "Jan" },
                    { value: "Feb", label: "Feb" },
                    { value: "Apr", label: "Apr" },
                    { value: "May", label: "May" },
                    { value: "Jun", label: "Jun" },
                    { value: "Jul", label: "Jul" },
                    { value: "Aug", label: "Aug" },
                    { value: "Sep", label: "Sep" },
                    { value: "Oct", label: "Oct" },
                    { value: "Nov", label: "Nov" },
                    { value: "Dec", label: "Dec" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Bonus For</label>
                <SearchableSelect
                  value={bonusFor}
                  onChange={(val) => {
                    setBonusFor(val);
                    setCurrentPage(1);
                  }}
                  options={bonusForOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Pay Option</label>
                <SearchableSelect
                  value={payOption}
                  onChange={setPayOption}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Bank", label: "Bank" },
                    { value: "Cash", label: "Cash" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Bank Name</label>
                <SearchableSelect
                  value={bankName}
                  onChange={(val) => {
                    setBankName(val);
                    setCurrentPage(1);
                  }}
                  options={bankOptions}
                />
              </div>
            </div>

            {/* Row 2: Employee Type, Department, Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Employee Type</label>
                <SearchableSelect
                  value={empType}
                  onChange={(val) => {
                    setEmpType(val);
                    setCurrentPage(1);
                  }}
                  options={empTypeOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={(val) => {
                    setDepartment(val);
                    setCurrentPage(1);
                  }}
                  options={departmentOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Section</label>
                <SearchableSelect
                  value={section}
                  onChange={(val) => {
                    setSection(val);
                    setCurrentPage(1);
                  }}
                  options={sectionOptions}
                />
              </div>
            </div>

            {/* Row 3: Unit, Shift, Line, Status, Employee Id */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Unit</label>
                <SearchableSelect
                  value={unit}
                  onChange={(val) => {
                    setUnit(val);
                    setCurrentPage(1);
                  }}
                  options={unitOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Shift</label>
                <SearchableSelect
                  value={shift}
                  onChange={(val) => {
                    setShift(val);
                    setCurrentPage(1);
                  }}
                  options={shiftOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Line</label>
                <SearchableSelect
                  value={line}
                  onChange={(val) => {
                    setLine(val);
                    setCurrentPage(1);
                  }}
                  options={lineOptions}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Status</label>
                <SearchableSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Active", label: "Active" },
                    { value: "Resigned", label: "Resigned" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Employee Id</label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => {
                    setEmpIdInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="use comma as separator"
                  className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-[11px] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Radio Buttons & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-foreground/80">
                  <input
                    type="radio"
                    name="outputMode"
                    value="System"
                    checked={outputMode === "System"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-emerald-600"
                  />
                  <span>System</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-foreground/80">
                  <input
                    type="radio"
                    name="outputMode"
                    value="Office"
                    checked={outputMode === "Office"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-emerald-600"
                  />
                  <span>Office</span>
                </label>
              </div>

              <button
                onClick={() => setCurrentPage(1)}
                className="h-8 px-4 rounded-lg bg-[#5cb85c] hover:bg-[#4ea44e] text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
              >
                GET BONUS DATA
              </button>
            </div>
          </div>

          {/* Action Toolbar & Search matching reference screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="h-8 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="size-3.5 text-emerald-600" />
                <span>EXCEL</span>
              </button>
              <button
                onClick={handlePrint}
                className="h-8 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="size-3.5 text-blue-600" />
                <span>PRINT</span>
              </button>
              <button
                onClick={handlePrint}
                className="h-8 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="size-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Search:</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-48 sm:w-64 h-8 pl-8 pr-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                />
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Report Data Table Container */}
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-h-[calc(100vh-340px)] min-h-[400px]">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#d9e2ec] dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 z-10 select-none shadow-2xs font-semibold">
                  <tr className="border-b border-slate-300 dark:border-slate-700 divide-x divide-slate-300/70 dark:divide-slate-700/70">
                    <th className="px-2.5 py-2 text-center w-10">SL</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">ID</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">Emp ID(Off)</th>
                    <th className="px-3 py-2 min-w-[160px] whitespace-nowrap">Name</th>
                    <th className="px-2.5 py-2 min-w-[120px] whitespace-nowrap">Employee Type</th>
                    <th className="px-2.5 py-2 min-w-[140px] whitespace-nowrap">Department</th>
                    <th className="px-2.5 py-2 min-w-[140px] whitespace-nowrap">Section</th>
                    <th className="px-2.5 py-2 min-w-[130px] whitespace-nowrap">Designation</th>
                    <th className="px-2 py-2 min-w-[65px] text-center whitespace-nowrap">Unit</th>
                    <th className="px-2 py-2 min-w-[65px] text-center whitespace-nowrap">Line</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">Shift</th>
                    <th className="px-2.5 py-2 min-w-[85px] whitespace-nowrap">Join Date</th>
                    <th className="px-2.5 py-2 min-w-[100px] whitespace-nowrap">Mobile</th>
                    <th className="px-2.5 py-2 text-right min-w-[80px] whitespace-nowrap">Gross</th>
                    <th className="px-2.5 py-2 text-right min-w-[80px] whitespace-nowrap">Basic</th>
                    <th className="px-2.5 py-2 text-center min-w-[80px] whitespace-nowrap">Bonous(%)</th>
                    <th className="px-2.5 py-2 text-right min-w-[95px] whitespace-nowrap">Bonous Amount</th>
                    <th className="px-2.5 py-2 text-right min-w-[90px] whitespace-nowrap">Bank Bonus</th>
                    <th className="px-2.5 py-2 text-right min-w-[90px] whitespace-nowrap">Misc. Bonus</th>
                    <th className="px-2.5 py-2 text-right min-w-[90px] whitespace-nowrap">Bank Set Amt</th>
                    <th className="px-2.5 py-2 min-w-[120px] whitespace-nowrap">Account No</th>
                    <th className="px-3 py-2 min-w-[140px] whitespace-nowrap">Bank Name</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">Bonus For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground/90">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, idx) => {
                      const absoluteIndex = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={row.sl + "-" + row.empId + "-" + idx}
                          className="hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors divide-x divide-border/40"
                        >
                          <td className="px-2.5 py-1.5 text-center text-muted-foreground font-mono">
                            {absoluteIndex}
                          </td>
                          <td className="px-2.5 py-1.5 font-mono font-medium text-foreground">
                            {row.empId}
                          </td>
                          <td className="px-2.5 py-1.5 font-mono text-muted-foreground">
                            {row.empIdOff || "-"}
                          </td>
                          <td className="px-3 py-1.5 font-semibold text-foreground whitespace-nowrap">
                            {row.name}
                          </td>
                          <td className="px-2.5 py-1.5 text-foreground/80 whitespace-nowrap">
                            {row.empType}
                          </td>
                          <td className="px-2.5 py-1.5 text-foreground/80 whitespace-nowrap">
                            {row.department}
                          </td>
                          <td className="px-2.5 py-1.5 text-foreground/80 whitespace-nowrap">
                            {row.section}
                          </td>
                          <td className="px-2.5 py-1.5 text-foreground/80 whitespace-nowrap">
                            {row.designation}
                          </td>
                          <td className="px-2 py-1.5 text-center text-muted-foreground whitespace-nowrap">
                            {row.unit}
                          </td>
                          <td className="px-2 py-1.5 text-center text-muted-foreground whitespace-nowrap">
                            {row.line}
                          </td>
                          <td className="px-2.5 py-1.5 text-foreground/80 whitespace-nowrap">
                            {row.shift}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-muted-foreground">
                            {row.joinDate}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-foreground/80">
                            {row.mobile || "-"}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-foreground">
                            {row.gross.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-foreground/90">
                            {row.basic.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-center font-mono font-medium text-emerald-600 dark:text-emerald-400">
                            {row.bonusPercent}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
                            {row.bonusAmount.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-blue-700 dark:text-blue-300">
                            {row.bankBonus > 0 ? row.bankBonus.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-purple-700 dark:text-purple-300">
                            {row.miscBonus > 0 ? row.miscBonus.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                            {row.bankSetAmt.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {row.accountNo || "-"}
                          </td>
                          <td className="px-3 py-1.5 whitespace-nowrap text-foreground/80">
                            {row.bankName || "-"}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-medium text-emerald-700 dark:text-emerald-400">
                            {row.bonusFor}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={23} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No bonus records matched your filters.</p>
                          <button
                            onClick={() => {
                              setBonusFor("ALL");
                              setBankName("ALL");
                              setEmpType("ALL");
                              setDepartment("All Departments");
                              setSection("ALL");
                              setUnit("ALL");
                              setShift("ALL");
                              setLine("ALL");
                              setEmpIdInput("");
                              setSearchQuery("");
                            }}
                            className="text-xs text-primary underline hover:text-primary/80 cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Grand Total Footer */}
                {filteredData.length > 0 && (
                  <tfoot className="bg-[#cdd7e1] dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold sticky bottom-0 border-t-2 border-slate-400 dark:border-slate-600 divide-x divide-slate-300 dark:divide-slate-700 shadow-lg">
                    <tr>
                      <td colSpan={13} className="px-3 py-2 text-right uppercase tracking-wider text-xs">
                        Total ({filteredData.length} Persons):
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.gross.toLocaleString()}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.basic.toLocaleString()}
                      </td>
                      <td className="px-2.5 py-2 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-emerald-800 dark:text-emerald-200">
                        {grandTotals.bonusAmount.toLocaleString()}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-blue-800 dark:text-blue-200">
                        {grandTotals.bankBonus.toFixed(2)}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-purple-800 dark:text-purple-200">
                        {grandTotals.miscBonus.toFixed(2)}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.bankSetAmt.toLocaleString()}
                      </td>
                      <td colSpan={3} className="px-2.5 py-2"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination & Summary Footer */}
            <div className="px-4 py-3 bg-muted/30 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Showing</span>
                <span className="font-semibold text-foreground">
                  {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span>
                <span>to</span>
                <span className="font-semibold text-foreground">
                  {Math.min(currentPage * pageSize, filteredData.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredData.length}</span>
                <span>entries</span>

                <span className="mx-2 text-border">|</span>

                <div className="flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 px-2 rounded border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </select>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="First Page"
                >
                  <ChevronsLeft className="size-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <span className="px-3 py-1 font-semibold text-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Last Page"
                >
                  <ChevronsRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
