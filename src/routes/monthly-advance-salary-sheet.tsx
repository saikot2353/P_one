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
  Users,
  Banknote,
  Building2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ADVANCE_SALARY_DATA, type AdvanceSalaryRecord } from "./-monthly-advance-data";

export const Route = createFileRoute("/monthly-advance-salary-sheet")({
  head: () => ({
    meta: [
      { title: "Monthly Advance Salary Sheet — CRIPTON HRIS" },
      { name: "description", content: "Monthly Advance and Partial Salary Disbursement Statement" },
    ],
  }),
  component: MonthlyAdvanceSalarySheetPage,
});

export function MonthlyAdvanceSalarySheetPage() {
  const [mode, setMode] = useState("Percentage Wise");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Mar");
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [bankName, setBankName] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [outputMode, setOutputMode] = useState("System");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Extract unique departments & sections for filter options
  const departmentOptions = useMemo(() => {
    const deps = Array.from(new Set(ADVANCE_SALARY_DATA.map((d) => d.department))).filter(Boolean).sort();
    return [{ value: "All Departments", label: "All Departments" }, ...deps.map((d) => ({ value: d, label: d }))];
  }, []);

  const sectionOptions = useMemo(() => {
    const secs = Array.from(new Set(ADVANCE_SALARY_DATA.map((d) => d.section))).filter(Boolean).sort();
    return [{ value: "ALL", label: "ALL" }, ...secs.map((s) => ({ value: s, label: s }))];
  }, []);

  const empTypeOptions = useMemo(() => {
    const types = Array.from(new Set(ADVANCE_SALARY_DATA.map((d) => d.empType))).filter(Boolean).sort();
    return [{ value: "ALL", label: "All Employee Types" }, ...types.map((t) => ({ value: t, label: t }))];
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return ADVANCE_SALARY_DATA.filter((item) => {
      // Filter by Employee Type
      if (empType !== "ALL" && item.empType !== empType) return false;

      // Filter by Department
      if (department !== "All Departments" && item.department !== department) return false;

      // Filter by Section
      if (section !== "ALL" && item.section !== section) return false;

      // Filter by Comma Separated Employee IDs
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

      // Live search filter across name, ID, designation, department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.empIdOff.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.salaryType.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [empType, department, section, empIdInput, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Grand Totals calculation
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.totalPay += curr.totalPay;
        acc.bankPay += curr.bankPay;
        acc.cashPay += curr.cashPay;
        return acc;
      },
      { totalPay: 0, bankPay: 0, cashPay: 0 }
    );
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-BD");
  };

  // CSV Export handler
  const handleExportCSV = (exportType: "all" | "bank" | "cash" = "all") => {
    let exportRecords = filteredData;
    let filename = `monthly_advance_salary_${year}_${month}.csv`;

    if (exportType === "bank") {
      exportRecords = filteredData.filter((r) => r.bankPay > 0);
      filename = `bank_payment_exec_${year}_${month}.csv`;
    } else if (exportType === "cash") {
      exportRecords = filteredData.filter((r) => r.cashPay > 0);
      filename = `cash_payment_exec_${year}_${month}.csv`;
    }

    const headers = [
      "SL",
      "Emp Id",
      "Emp ID(Off)",
      "Salary Type",
      "Name",
      "Join Date",
      "Employee Type",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "Total Pay",
      "Bank Pay",
      "Cash Pay",
    ];

    const rows = exportRecords.map((r, idx) => [
      idx + 1,
      r.empId,
      r.empIdOff,
      r.salaryType,
      r.name,
      r.joinDate,
      r.empType,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.totalPay,
      r.bankPay,
      r.cashPay,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link to="/payroll-reports" className="hover:text-foreground transition-colors">
              Payroll Reports
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Monthly Advance Salary Sheet</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <FileText className="size-6" />
                </div>
                Monthly Advance Salary Sheet
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly partial salary, advance payment breakdown, bank & cash disbursement statement for {month} {year}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Printer className="size-4 text-muted-foreground" />
                Print Statement
              </button>
            </div>
          </div>

          {/* Filter & Search Parameters Card (Matches Reference Screenshot Layout & Styling) */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                <Filter className="size-4 text-primary" />
                Filter & Search Parameters
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing {filteredData.length} records
              </span>
            </div>

            {/* Row 1 Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Mode</label>
                <SearchableSelect
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: "Percentage Wise", label: "Percentage Wise" },
                    { value: "Partial Salary", label: "Partial Salary" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Year</label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[
                    { value: "2026", label: "2026" },
                    { value: "2025", label: "2025" },
                    { value: "2024", label: "2024" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Month</label>
                <SearchableSelect
                  value={month}
                  onChange={setMonth}
                  options={[
                    { value: "Jan", label: "Jan" },
                    { value: "Feb", label: "Feb" },
                    { value: "Mar", label: "Mar" },
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Employee Type</label>
                <SearchableSelect
                  value={empType}
                  onChange={(val) => {
                    setEmpType(val);
                    setCurrentPage(1);
                  }}
                  options={empTypeOptions}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={(val) => {
                    setDepartment(val);
                    setCurrentPage(1);
                  }}
                  options={departmentOptions}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Section</label>
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

            {/* Row 2 Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Unit</label>
                <SearchableSelect
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Unit-1", label: "Unit-1" },
                    { value: "Unit-2", label: "Unit-2" },
                    { value: "RMG Unit", label: "RMG Unit" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Line</label>
                <SearchableSelect
                  value={line}
                  onChange={setLine}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Line-1", label: "Line-1" },
                    { value: "Line-2", label: "Line-2" },
                    { value: "Line-3", label: "Line-3" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Bank Name</label>
                <SearchableSelect
                  value={bankName}
                  onChange={setBankName}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Dutch-Bangla Bank", label: "Dutch-Bangla Bank" },
                    { value: "BRAC Bank", label: "BRAC Bank" },
                    { value: "Islami Bank", label: "Islami Bank" },
                    { value: "City Bank", label: "City Bank" },
                    { value: "Eastern Bank", label: "Eastern Bank" },
                  ]}
                />
              </div>

              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-semibold text-foreground/80 block flex items-center justify-between">
                  <span>Employee Id</span>
                  <span className="text-[10px] text-blue-500 font-normal">use comma as separator</span>
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => {
                    setEmpIdInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="use comma as separator"
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex items-center gap-6 pb-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="outputMode"
                    value="System"
                    checked={outputMode === "System"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-primary"
                  />
                  <span>System</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                  <input
                    type="radio"
                    name="outputMode"
                    value="Office"
                    checked={outputMode === "Office"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-primary"
                  />
                  <span>Office</span>
                </label>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentPage(1)}
                className="h-9 px-5 rounded-xl bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
              >
                Get Salary Data
              </button>
            </div>
          </div>

          {/* Export Toolbar & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleExportCSV("all")}
                className="h-9 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <FileText className="size-4 text-emerald-600" />
                EXCEL
              </button>
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Printer className="size-4 text-muted-foreground" />
                PRINT
              </button>
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <FileDown className="size-4 text-rose-500" />
                PDF
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="text-xs font-semibold text-muted-foreground mr-2">Search:</span>
              <div className="inline-block w-full sm:w-60 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by ID, Name, Dept..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[750px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-muted/90 backdrop-blur-sm text-muted-foreground uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 border-b border-border/60 shadow-sm">
                  <tr>
                    <th className="px-3 py-3 w-12 text-center border-r border-border/40">SL</th>
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Emp Id(Off)</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Section</th>
                    <th className="px-4 py-3 font-semibold">Designation</th>
                    <th className="px-4 py-3 font-semibold text-center">Unit</th>
                    <th className="px-4 py-3 font-semibold text-center">Line</th>
                    <th className="px-4 py-3 font-semibold text-center">Join Date</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground bg-primary/5">Total Pay</th>
                    <th className="px-4 py-3 text-right font-bold text-emerald-600 bg-emerald-500/5">Bank Pay</th>
                    <th className="px-4 py-3 text-right font-bold text-amber-600 bg-amber-500/5">Cash Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-[11px]">
                  {paginatedData.map((row, index) => {
                    const globalIdx = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={index} className="hover:bg-muted/40 transition-colors group">
                        <td className="px-3 py-2.5 text-center border-r border-border/30 font-semibold text-muted-foreground">
                          {globalIdx}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-foreground font-mono">{row.empId}</td>
                        <td className="px-4 py-2.5 text-muted-foreground font-mono">{row.empIdOff || "—"}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground group-hover:text-primary transition-colors">
                          {row.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {row.salaryType}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium">{row.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.section}</td>
                        <td className="px-4 py-2.5">{row.designation}</td>
                        <td className="px-4 py-2.5 text-center text-muted-foreground">{row.unit}</td>
                        <td className="px-4 py-2.5 text-center text-muted-foreground">{row.line}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-muted-foreground">{row.joinDate}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground bg-primary/5 font-mono">
                          ৳ {formatCurrency(row.totalPay)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-600 bg-emerald-500/5 font-mono">
                          ৳ {formatCurrency(row.bankPay)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-amber-600 bg-amber-500/5 font-mono">
                          ৳ {formatCurrency(row.cashPay)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={14} className="px-4 py-12 text-center text-muted-foreground font-medium">
                        No advance salary records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer Grand Totals */}
                <tfoot className="bg-muted/90 font-bold border-t-2 border-border text-xs sticky bottom-0 z-10 shadow-md">
                  <tr>
                    <td colSpan={11} className="px-4 py-3 text-right uppercase tracking-wider text-muted-foreground">
                      Grand Total ({filteredData.length} Employees):
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-mono text-xs bg-primary/10">
                      ৳ {formatCurrency(totals.totalPay)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-mono text-xs bg-emerald-500/10">
                      ৳ {formatCurrency(totals.bankPay)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs bg-amber-500/10">
                      ৳ {formatCurrency(totals.cashPay)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pagination & Bottom Export Toolbar (Exact Match with Reference Screenshot 2) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span>
                Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronsLeft className="size-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronsRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Bottom Action Export Buttons (Matching Reference Screenshot 2) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <Printer className="size-3.5" />
                PRINT
              </button>
              <button
                onClick={() => handleExportCSV("bank")}
                className="h-9 px-4 rounded-xl bg-[#0275d8] hover:bg-[#025aa5] text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                EXPORT BANK PAYMENT (EXEC)
              </button>
              <button
                onClick={() => handleExportCSV("cash")}
                className="h-9 px-4 rounded-xl bg-[#0275d8] hover:bg-[#025aa5] text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                EXPORT CASH PAYMENT (EXEC)
              </button>
              <button
                onClick={() => handleExportCSV("cash")}
                className="h-9 px-4 rounded-xl bg-[#0275d8] hover:bg-[#025aa5] text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                EXPORT CASH (EXEC)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
