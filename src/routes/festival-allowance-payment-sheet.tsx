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
  Gift,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { FESTIVAL_ALLOWANCE_DATA, type FestivalAllowanceRecord } from "./-festival-allowance-data";

export const Route = createFileRoute("/festival-allowance-payment-sheet")({
  head: () => ({
    meta: [
      { title: "Festival Allowance Payment Sheet — CRIPTON HRIS" },
      { name: "description", content: "Festival allowance calculation, bonus disbursement, and net payment statement." },
    ],
  }),
  component: FestivalAllowancePaymentSheetPage,
});

export function FestivalAllowancePaymentSheetPage() {
  const [fromDate, setFromDate] = useState("2026-09-25");
  const [toDate, setToDate] = useState("2026-09-25");
  const [empIdInput, setEmpIdInput] = useState("");
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [designation, setDesignation] = useState("ALL");
  const [lineFilter, setLineFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Extract unique departments & designations for filters
  const departmentOptions = useMemo(() => {
    const deps = Array.from(new Set(FESTIVAL_ALLOWANCE_DATA.map((d) => d.department))).sort();
    return [{ value: "All Departments", label: "All Departments" }, ...deps.map((d) => ({ value: d, label: d }))];
  }, []);

  const designationOptions = useMemo(() => {
    const desigs = Array.from(new Set(FESTIVAL_ALLOWANCE_DATA.map((d) => d.designation))).sort();
    return [{ value: "ALL", label: "ALL" }, ...desigs.map((j) => ({ value: j, label: j }))];
  }, []);

  const lineOptions = useMemo(() => {
    const lines = Array.from(new Set(FESTIVAL_ALLOWANCE_DATA.map((d) => d.line))).sort();
    return [{ value: "ALL", label: "ALL" }, ...lines.map((l) => ({ value: l, label: l }))];
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return FESTIVAL_ALLOWANCE_DATA.filter((item) => {
      // Employee Type filter
      if (empType !== "ALL" && item.empType !== empType) return false;

      // Department filter
      if (department !== "All Departments" && item.department !== department) return false;

      // Designation filter
      if (designation !== "ALL" && item.designation !== designation) return false;

      // Line filter
      if (lineFilter !== "ALL" && item.line !== lineFilter) return false;

      // Comma-separated ID filter
      if (empIdInput.trim()) {
        const ids = empIdInput
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0) {
          const matchId = ids.some((id) => item.empId.toLowerCase().includes(id));
          if (!matchId) return false;
        }
      }

      // Live search filter across name, ID, designation, department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [empType, department, designation, lineFilter, empIdInput, searchQuery]);

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
        acc.grossSalary += curr.grossSalary;
        acc.basicSalary += curr.basicSalary;
        acc.daysCount += curr.daysCount;
        acc.payableAmount += curr.payableAmount;
        acc.extraDaysOtHour += curr.extraDaysOtHour;
        acc.totalExtraOtAmt += curr.totalExtraOtAmt;
        acc.lunchBill += curr.lunchBill;
        acc.netPayableAmt += curr.netPayableAmt;
        return acc;
      },
      {
        grossSalary: 0,
        basicSalary: 0,
        daysCount: 0,
        payableAmount: 0,
        extraDaysOtHour: 0,
        totalExtraOtAmt: 0,
        lunchBill: 0,
        netPayableAmt: 0,
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
      "Name",
      "Emp Type",
      "Designation",
      "Department",
      "Section",
      "Unit",
      "Line",
      "Date of Joining",
      "Gross Salary",
      "Basic Salary",
      "Days Count",
      "Per Day Rate",
      "Payable Amount",
      "Days Count/ OT Hour",
      "Day/OT Rate",
      "Total Extra/OT Amt",
      "Lunch Bill",
      "Net Payable Amt",
    ];

    const rows = filteredData.map((r, idx) => [
      idx + 1,
      r.empId,
      r.name,
      r.empType,
      r.designation,
      r.department,
      r.section,
      r.unit,
      r.line,
      r.joinDate,
      r.grossSalary.toFixed(2),
      r.basicSalary.toFixed(2),
      r.daysCount,
      r.perDayRate.toFixed(2),
      r.payableAmount.toFixed(2),
      r.extraDaysOtHour.toFixed(2),
      r.dayOtRate.toFixed(2),
      r.totalExtraOtAmt.toFixed(2),
      r.lunchBill.toFixed(2),
      r.netPayableAmt.toFixed(2),
    ]);

    // Add Total row
    rows.push([
      "Total",
      "Grand Total",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      totals.grossSalary.toFixed(2),
      totals.basicSalary.toFixed(2),
      totals.daysCount,
      "",
      totals.payableAmount.toFixed(2),
      totals.extraDaysOtHour.toFixed(2),
      "",
      totals.totalExtraOtAmt.toFixed(2),
      totals.lunchBill.toFixed(2),
      totals.netPayableAmt.toFixed(2),
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
    link.setAttribute("download", `festival_allowance_payment_sheet_${fromDate}_${toDate}.csv`);
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
            <span className="text-foreground font-semibold">Festival Allowance Payment Sheet</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Gift className="size-6" />
                </div>
                Festival Allowance Payment Sheet
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Festival allowance calculation, bonus disbursement, and net payment statement.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
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
                  placeholder="use comma as separator"
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
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
                <label className="text-xs font-semibold text-foreground/80 block">Designation</label>
                <SearchableSelect
                  value={designation}
                  onChange={(val) => {
                    setDesignation(val);
                    setCurrentPage(1);
                  }}
                  options={designationOptions}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Line</label>
                <SearchableSelect
                  value={lineFilter}
                  onChange={(val) => {
                    setLineFilter(val);
                    setCurrentPage(1);
                  }}
                  options={lineOptions}
                />
              </div>
            </div>

            {/* Action SHOW Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentPage(1)}
                className="h-9 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
              >
                SHOW
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
                  placeholder="Search name, ID, dept..."
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
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Emp Type</th>
                    <th className="px-4 py-3 font-semibold">Designation</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Section</th>
                    <th className="px-3 py-3 text-center font-semibold">Unit</th>
                    <th className="px-3 py-3 text-center font-semibold">Line</th>
                    <th className="px-4 py-3 text-center font-semibold">Date of Joining</th>
                    <th className="px-4 py-3 text-right font-semibold">Gross Salary</th>
                    <th className="px-4 py-3 text-right font-semibold">Basic Salary</th>
                    <th className="px-3 py-3 text-right font-semibold">Days Count</th>
                    <th className="px-3 py-3 text-right font-semibold">Per Day Rate</th>
                    <th className="px-4 py-3 text-right font-semibold">Payable Amount</th>
                    <th className="px-3 py-3 text-right font-semibold">Days Count/ OT Hour</th>
                    <th className="px-3 py-3 text-right font-semibold">Day/OT Rate</th>
                    <th className="px-3 py-3 text-right font-semibold">Total Extra/OT Amt</th>
                    <th className="px-3 py-3 text-right font-semibold">Lunch Bill</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground bg-primary/5">Net Payable Amt</th>
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
                        <td className="px-4 py-2.5 font-bold text-foreground group-hover:text-primary transition-colors">
                          {row.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            {row.empType}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{row.designation}</td>
                        <td className="px-4 py-2.5 font-medium">{row.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.section}</td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">{row.unit}</td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">{row.line}</td>
                        <td className="px-4 py-2.5 text-center font-mono text-muted-foreground">{row.joinDate}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.grossSalary)}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.basicSalary)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{row.daysCount}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.perDayRate)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-semibold">
                          {formatCurrency(row.payableAmount)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {row.extraDaysOtHour}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.dayOtRate)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.totalExtraOtAmt)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(row.lunchBill)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground bg-primary/5 font-mono">
                          ৳ {formatCurrency(row.netPayableAmt, 0)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={20} className="px-4 py-12 text-center text-muted-foreground font-medium">
                        No festival allowance records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer Grand Totals */}
                <tfoot className="bg-sky-200/90 dark:bg-sky-950/90 font-bold border-t-2 border-sky-300 dark:border-sky-800 text-xs sticky bottom-0 z-10 shadow-md">
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-right uppercase tracking-wider text-muted-foreground">
                      Grand Total ({filteredData.length} Employees):
                    </td>
                    <td className="px-4 py-3 text-right font-mono">৳ {formatCurrency(totals.grossSalary)}</td>
                    <td className="px-4 py-3 text-right font-mono">৳ {formatCurrency(totals.basicSalary)}</td>
                    <td className="px-3 py-3 text-right font-mono">{totals.daysCount}</td>
                    <td className="px-3 py-3 text-right font-mono">—</td>
                    <td className="px-4 py-3 text-right font-mono">৳ {formatCurrency(totals.payableAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono">{totals.extraDaysOtHour}</td>
                    <td className="px-3 py-3 text-right font-mono">—</td>
                    <td className="px-3 py-3 text-right font-mono">৳ {formatCurrency(totals.totalExtraOtAmt)}</td>
                    <td className="px-3 py-3 text-right font-mono">৳ {formatCurrency(totals.lunchBill)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-mono text-sm bg-primary/10">
                      ৳ {formatCurrency(totals.netPayableAmt, 0)}
                    </td>
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
                onClick={() => window.print()}
                className="h-9 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-1.5"
              >
                <FileDown className="size-3.5" />
                PDF
              </button>
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
