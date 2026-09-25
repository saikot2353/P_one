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
} from "lucide-react";
import { EARN_LEAVE_PAY_DATA, type EarnLeaveRecord } from "./-earn-leave-pay-data";

export const Route = createFileRoute("/earn-leave-pay-report")({
  head: () => ({
    meta: [
      { title: "Earn Leave Pay Report — CRIPTON HRIS" },
      { name: "description", content: "Annual earned leave encashment and payment disbursement report." },
    ],
  }),
  component: EarnLeavePayReportPage,
});

export function EarnLeavePayReportPage() {
  const [year, setYear] = useState("2022");
  const [duration, setDuration] = useState("Full Year");
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [bankName, setBankName] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [outputMode, setOutputMode] = useState("System");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Extract unique departments, sections, and designations for filters
  const departmentOptions = useMemo(() => {
    const deps = Array.from(new Set(EARN_LEAVE_PAY_DATA.map((d) => d.department))).sort();
    return [{ value: "All Departments", label: "All Departments" }, ...deps.map((d) => ({ value: d, label: d }))];
  }, []);

  const sectionOptions = useMemo(() => {
    const secs = Array.from(new Set(EARN_LEAVE_PAY_DATA.map((d) => d.section))).sort();
    return [{ value: "ALL", label: "ALL" }, ...secs.map((s) => ({ value: s, label: s }))];
  }, []);

  const jobTitleOptions = useMemo(() => {
    const desigs = Array.from(new Set(EARN_LEAVE_PAY_DATA.map((d) => d.designation))).sort();
    return [{ value: "ALL", label: "ALL" }, ...desigs.map((j) => ({ value: j, label: j }))];
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return EARN_LEAVE_PAY_DATA.filter((item) => {
      // Department filter
      if (department !== "All Departments" && item.department !== department) return false;

      // Section filter
      if (section !== "ALL" && item.section !== section) return false;

      // Designation filter
      if (jobTitle !== "ALL" && item.designation !== jobTitle) return false;

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

      // Live search filter across name, ID, designation, department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.empName.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.empIdOff.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.bankName.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [department, section, jobTitle, empIdInput, searchQuery]);

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
        acc.gross += curr.gross;
        acc.presentDay += curr.presentDay;
        acc.earnDay += curr.earnDay;
        acc.earnDayCF += curr.earnDayCF;
        acc.totalEarnDay += curr.totalEarnDay;
        acc.totalAmt += curr.totalAmt;
        acc.payDay += curr.payDay;
        acc.netPay += curr.netPay;
        return acc;
      },
      {
        gross: 0,
        presentDay: 0,
        earnDay: 0,
        earnDayCF: 0,
        totalEarnDay: 0,
        totalAmt: 0,
        payDay: 0,
        netPay: 0,
      }
    );
  }, [filteredData]);

  const formatCurrency = (val: number, decimals: number = 2) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Emp Id(Off)",
      "Emp Name",
      "Department",
      "Section",
      "Designation",
      "Join Date",
      "Gross",
      "Present Day",
      "Earn Day",
      "Earn Day(CF)",
      "Total Earn Day",
      "Per Day Amt",
      "Total Amt",
      "Pay(%)",
      "Pay Day",
      "Net Pay",
      "Signature",
      "Bank Name",
      "Acc. No",
      "Acc. Is Active",
    ];

    const rows = filteredData.map((r, idx) => [
      idx + 1,
      r.empId,
      r.empIdOff,
      r.empName,
      r.department,
      r.section,
      r.designation,
      r.joinDate,
      r.gross.toFixed(2),
      r.presentDay,
      r.earnDay.toFixed(2),
      r.earnDayCF.toFixed(2),
      r.totalEarnDay.toFixed(2),
      r.perDayAmt.toFixed(2),
      r.totalAmt.toFixed(2),
      r.payPercent,
      r.payDay.toFixed(2),
      r.netPay.toFixed(2),
      r.signature,
      r.bankName,
      r.accNo,
      r.accIsActive,
    ]);

    // Total row
    rows.push([
      "Total",
      "Grand Total",
      "",
      "",
      "",
      "",
      "",
      "",
      totals.gross.toFixed(2),
      totals.presentDay,
      totals.earnDay.toFixed(2),
      totals.earnDayCF.toFixed(2),
      totals.totalEarnDay.toFixed(2),
      "",
      totals.totalAmt.toFixed(2),
      "",
      totals.payDay.toFixed(2),
      totals.netPay.toFixed(2),
      "",
      "",
      "",
      "",
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
    link.setAttribute("download", `earn_leave_pay_report_${year}.csv`);
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
            <span className="text-foreground font-semibold">Earn Leave Pay Report</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Calculator className="size-6" />
                </div>
                Earn Leave Pay Report
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Annual earned leave encashment breakdown, per day rate, and payment disbursement statement for {year}.
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

          {/* Filter Bar (Exact Match with Reference Screenshot 1 Layout & Controls) */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4 border-l-4 border-l-primary">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Year</label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[
                    { value: "2026", label: "2026" },
                    { value: "2025", label: "2025" },
                    { value: "2024", label: "2024" },
                    { value: "2022", label: "2022" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Duration</label>
                <SearchableSelect
                  value={duration}
                  onChange={setDuration}
                  options={[
                    { value: "Full Year", label: "Full Year" },
                    { value: "Half Year", label: "Half Year" },
                    { value: "Q1", label: "Q1" },
                    { value: "Q2", label: "Q2" },
                    { value: "Q3", label: "Q3" },
                    { value: "Q4", label: "Q4" },
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
                  options={[
                    { value: "Office Executive", label: "Office Executive" },
                    { value: "Worker", label: "Worker" },
                    { value: "Staff", label: "Staff" },
                    { value: "ALL", label: "All Employee Types" },
                  ]}
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
                <label className="text-xs font-semibold text-foreground/80 block">Sub Department</label>
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

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Job Title</label>
                <SearchableSelect
                  value={jobTitle}
                  onChange={(val) => {
                    setJobTitle(val);
                    setCurrentPage(1);
                  }}
                  options={jobTitleOptions}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Employee Id</label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => {
                    setEmpIdInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Use Comma As Separator"
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Bank Name</label>
                <SearchableSelect
                  value={bankName}
                  onChange={setBankName}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Dutch-Bangla Bank Ltd.", label: "Dutch-Bangla Bank Ltd." },
                    { value: "BRAC Bank", label: "BRAC Bank" },
                    { value: "Islami Bank", label: "Islami Bank" },
                    { value: "City Bank", label: "City Bank" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Status</label>
                <SearchableSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "Working", label: "Working" },
                    { value: "Resigned", label: "Resigned" },
                    { value: "ALL", label: "ALL" },
                  ]}
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

            {/* Action Search Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentPage(1)}
                className="h-10 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
              >
                <Search className="size-4" />
                SEARCH
              </button>
            </div>
          </div>

          {/* Export Toolbar & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
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

            <div className="relative w-full sm:w-72 flex items-center justify-end">
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
                  placeholder="Search name, ID, bank..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[750px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-sky-200/90 dark:bg-sky-950/80 backdrop-blur-sm text-sky-950 dark:text-sky-200 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 border-b border-sky-300 dark:border-sky-800 shadow-sm">
                  <tr>
                    <th className="px-3 py-3 w-12 text-center border-r border-sky-300/60 dark:border-sky-800/60">
                      SL
                    </th>
                    <th className="px-4 py-3 font-semibold">Emp ID</th>
                    <th className="px-4 py-3 font-semibold">Emp Id(Off)</th>
                    <th className="px-4 py-3 font-semibold">Emp Name</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Section</th>
                    <th className="px-4 py-3 font-semibold">Designation</th>
                    <th className="px-4 py-3 font-semibold text-center">Join Date</th>
                    <th className="px-4 py-3 text-right font-semibold">Gross</th>
                    <th className="px-3 py-3 text-right font-semibold">Present Day</th>
                    <th className="px-3 py-3 text-right font-semibold">Earn Day</th>
                    <th className="px-3 py-3 text-right font-semibold">Earn Day(CF)</th>
                    <th className="px-3 py-3 text-right font-semibold">Total Earn Day</th>
                    <th className="px-4 py-3 text-right font-semibold">Per Day Amt</th>
                    <th className="px-4 py-3 text-right font-semibold">Total Amt</th>
                    <th className="px-3 py-3 text-center font-semibold">Pay(%)</th>
                    <th className="px-3 py-3 text-right font-semibold">Pay Day</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground bg-primary/5">Net Pay</th>
                    <th className="px-4 py-3 text-center font-semibold">Signature</th>
                    <th className="px-4 py-3 font-semibold">Bank Name</th>
                    <th className="px-4 py-3 font-semibold font-mono">Acc. No</th>
                    <th className="px-3 py-3 text-center font-semibold">Acc. Is Active</th>
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
                        <td className="px-4 py-2.5 font-bold text-foreground group-hover:text-primary transition-colors">
                          {row.empName}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{row.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.section}</td>
                        <td className="px-4 py-2.5">{row.designation}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-muted-foreground">{row.joinDate}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.gross)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{row.presentDay}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(row.earnDay)}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.earnDayCF)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold">{formatCurrency(row.totalEarnDay)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.perDayAmt)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-semibold">{formatCurrency(row.totalAmt)}</td>
                        <td className="px-3 py-2.5 text-center font-mono">{row.payPercent}%</td>
                        <td className="px-3 py-2.5 text-right font-mono">{formatCurrency(row.payDay)}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-600 bg-emerald-500/5 font-mono">
                          ৳ {formatCurrency(row.netPay, 0)}
                        </td>
                        <td className="px-4 py-2.5 text-center text-muted-foreground">—</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.bankName}</td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{row.accNo || "—"}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.accIsActive === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {row.accIsActive || "Active"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={22} className="px-4 py-12 text-center text-muted-foreground font-medium">
                        No earn leave records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer Grand Totals */}
                <tfoot className="bg-sky-200/90 dark:bg-sky-950/90 font-bold border-t-2 border-sky-300 dark:border-sky-800 text-xs sticky bottom-0 z-10 shadow-md">
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-right uppercase tracking-wider text-muted-foreground">
                      Grand Total ({filteredData.length} Employees):
                    </td>
                    <td className="px-4 py-3 text-right font-mono">৳ {formatCurrency(totals.gross)}</td>
                    <td className="px-3 py-3 text-right font-mono">{totals.presentDay}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totals.earnDay)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totals.earnDayCF)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totals.totalEarnDay)}</td>
                    <td className="px-4 py-3 text-right font-mono">—</td>
                    <td className="px-4 py-3 text-right font-mono">৳ {formatCurrency(totals.totalAmt)}</td>
                    <td className="px-3 py-3 text-center font-mono">—</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totals.payDay)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400 font-mono text-sm bg-emerald-500/10">
                      ৳ {formatCurrency(totals.netPay, 0)}
                    </td>
                    <td colSpan={4} className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pagination Bar */}
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
