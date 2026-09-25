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
  Eye,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SALARY_SUMMARY_DATA, type SalarySummaryRecord } from "./-summary-salary-data";

export const Route = createFileRoute("/summary-salary-sheet")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Summary — CRIPTON HRIS" },
      { name: "description", content: "Department and particular wise monthly salary summary report." },
    ],
  }),
  component: SummarySalarySheetPage,
});

export function SummarySalarySheetPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Feb");
  const [option, setOption] = useState("With Holiday amount");
  const [department, setDepartment] = useState("All Departments");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Extract non-Total records
  const baseData = useMemo(() => {
    return SALARY_SUMMARY_DATA.filter((item) => item.particular !== "Total");
  }, []);

  // Department / Particular options for filter
  const departmentOptions = useMemo(() => {
    const deps = Array.from(new Set(baseData.map((d) => d.particular))).sort();
    return [{ value: "All Departments", label: "All Departments" }, ...deps.map((d) => ({ value: d, label: d }))];
  }, [baseData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return baseData.filter((item) => {
      // Particular / Department filter
      if (department !== "All Departments" && item.particular !== department) return false;

      // Staff / Worker Type filter
      if (typeFilter !== "ALL" && item.type.toLowerCase() !== typeFilter.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.particular.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.sl.toString().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [baseData, department, typeFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Grand Totals calculation across all numerical columns
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.person += curr.person;
        acc.totalGross += curr.totalGross;
        acc.totalBasic += curr.totalBasic;
        acc.paySalary += curr.paySalary;
        acc.otHour += curr.otHour;
        acc.otAmount += curr.otAmount;
        acc.attnBonus += curr.attnBonus;
        acc.behaviorBonus += curr.behaviorBonus;
        acc.allowanceArrear += curr.allowanceArrear;
        acc.tiffin += curr.tiffin;
        acc.nightAllowance += curr.nightAllowance;
        acc.adjustAmount += curr.adjustAmount;
        acc.wagelyAdvance += curr.wagelyAdvance;
        acc.loanAdvance += curr.loanAdvance;
        acc.tax += curr.tax;
        acc.stamp += curr.stamp;
        acc.payableAmount += curr.payableAmount;
        acc.cashPay += curr.cashPay;
        acc.bankPay += curr.bankPay;
        return acc;
      },
      {
        person: 0,
        totalGross: 0,
        totalBasic: 0,
        paySalary: 0,
        otHour: 0,
        otAmount: 0,
        attnBonus: 0,
        behaviorBonus: 0,
        allowanceArrear: 0,
        tiffin: 0,
        nightAllowance: 0,
        adjustAmount: 0,
        wagelyAdvance: 0,
        loanAdvance: 0,
        tax: 0,
        stamp: 0,
        payableAmount: 0,
        cashPay: 0,
        bankPay: 0,
      }
    );
  }, [filteredData]);

  const formatNum = (val: number, decimals: number = 2) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Particular",
      "Type",
      "Person",
      "Total Gross",
      "Total Basic",
      "Pay Salary",
      "OT Hour",
      "OT Amount",
      "Attn Bonus",
      "Behavior Bonus",
      "Allowance+Arrear",
      "Tiffin",
      "Night Allowance",
      "Adjust Amount",
      "Wagely Advance",
      "Loan+Advance",
      "Tax",
      "Stamp",
      "Payable Amount",
      "Cash Pay",
      "Bank Pay",
    ];

    const rows = filteredData.map((r, idx) => [
      idx + 1,
      r.particular,
      r.type,
      r.person,
      r.totalGross.toFixed(2),
      r.totalBasic.toFixed(2),
      r.paySalary.toFixed(2),
      r.otHour.toFixed(2),
      r.otAmount,
      r.attnBonus.toFixed(2),
      r.behaviorBonus.toFixed(2),
      r.allowanceArrear.toFixed(2),
      r.tiffin.toFixed(2),
      r.nightAllowance.toFixed(2),
      r.adjustAmount.toFixed(2),
      r.wagelyAdvance.toFixed(2),
      r.loanAdvance.toFixed(2),
      r.tax.toFixed(2),
      r.stamp.toFixed(2),
      r.payableAmount,
      r.cashPay.toFixed(2),
      r.bankPay.toFixed(2),
    ]);

    // Add Total row
    rows.push([
      "Total",
      "Grand Total",
      "",
      totals.person,
      totals.totalGross.toFixed(2),
      totals.totalBasic.toFixed(2),
      totals.paySalary.toFixed(2),
      totals.otHour.toFixed(2),
      totals.otAmount,
      totals.attnBonus.toFixed(2),
      totals.behaviorBonus.toFixed(2),
      totals.allowanceArrear.toFixed(2),
      totals.tiffin.toFixed(2),
      totals.nightAllowance.toFixed(2),
      totals.adjustAmount.toFixed(2),
      totals.wagelyAdvance.toFixed(2),
      totals.loanAdvance.toFixed(2),
      totals.tax.toFixed(2),
      totals.stamp.toFixed(2),
      totals.payableAmount,
      totals.cashPay.toFixed(2),
      totals.bankPay.toFixed(2),
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
    link.setAttribute("download", `monthly_salary_summary_${year}_${month}.csv`);
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
            <span className="text-foreground font-semibold">Monthly Salary Summary</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <FileText className="size-6" />
                </div>
                Monthly Salary Summary
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Department and particular wise monthly salary, gross, basic, OT, and payment summary for {month} {year}.
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

          {/* Filter Bar (Matching Reference Screenshot Layout & Controls) */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4 border-l-4 border-l-primary">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
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
                <label className="text-xs font-semibold text-foreground/80 block">
                  Month <span className="text-rose-500">*</span>
                </label>
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
                <label className="text-xs font-semibold text-foreground/80 block">
                  Option <span className="text-rose-500">*</span>
                </label>
                <SearchableSelect
                  value={option}
                  onChange={setOption}
                  options={[
                    { value: "With Holiday amount", label: "With Holiday amount" },
                    { value: "Without Holiday amount", label: "Without Holiday amount" },
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

              <div>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Search className="size-4" />
                  SEARCH
                </button>
              </div>
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
                  placeholder="Search particular..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[750px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-sky-100/90 dark:bg-sky-950/60 backdrop-blur-sm text-sky-950 dark:text-sky-200 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 border-b border-sky-200 dark:border-sky-800/60 shadow-sm">
                  <tr>
                    <th className="px-3 py-3 w-12 text-center border-r border-sky-200/60 dark:border-sky-800/40">SL</th>
                    <th className="px-4 py-3 font-semibold">Particular</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 text-right font-semibold">Person</th>
                    <th className="px-4 py-3 text-right font-semibold">Total Gross</th>
                    <th className="px-4 py-3 text-right font-semibold">Total Basic</th>
                    <th className="px-4 py-3 text-right font-semibold">Pay Salary</th>
                    <th className="px-3 py-3 text-right font-semibold">OT Hour</th>
                    <th className="px-3 py-3 text-right font-semibold">OT Amount</th>
                    <th className="px-3 py-3 text-right font-semibold">Attn Bonus</th>
                    <th className="px-3 py-3 text-right font-semibold">Behavior Bonus</th>
                    <th className="px-3 py-3 text-right font-semibold">Allowance+Arrear</th>
                    <th className="px-3 py-3 text-right font-semibold">Tiffin</th>
                    <th className="px-3 py-3 text-right font-semibold">Night Allowance</th>
                    <th className="px-3 py-3 text-right font-semibold">Adjust Amount</th>
                    <th className="px-3 py-3 text-right font-semibold">Wagely Advance</th>
                    <th className="px-3 py-3 text-right font-semibold">Loan+Advance</th>
                    <th className="px-3 py-3 text-right font-semibold">Tax</th>
                    <th className="px-3 py-3 text-right font-semibold">Stamp</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground bg-primary/5">Payable Amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-amber-600 bg-amber-500/5">Cash Pay</th>
                    <th className="px-4 py-3 text-right font-semibold text-emerald-600 bg-emerald-500/5">Bank Pay</th>
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
                        <td className="px-4 py-2.5 font-bold text-foreground group-hover:text-primary transition-colors">
                          {row.particular}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.type === "Staff"
                                ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            }`}
                          >
                            {row.type || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold font-mono">{row.person}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatNum(row.totalGross)}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatNum(row.totalBasic)}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{formatNum(row.paySalary)}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.otHour)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">{row.otAmount}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.attnBonus)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.behaviorBonus)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.allowanceArrear)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.tiffin)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.nightAllowance)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.adjustAmount)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.wagelyAdvance)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.loanAdvance)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">{formatNum(row.tax)}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                          {formatNum(row.stamp)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-foreground bg-primary/5 font-mono">
                          {formatNum(row.payableAmount, 0)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-amber-600 bg-amber-500/5 font-mono">
                          {formatNum(row.cashPay)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-600 bg-emerald-500/5 font-mono">
                          {formatNum(row.bankPay)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={22} className="px-4 py-12 text-center text-muted-foreground font-medium">
                        No summary records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer Grand Totals */}
                <tfoot className="bg-sky-100/90 dark:bg-sky-950/80 font-bold border-t-2 border-sky-300 dark:border-sky-800 text-xs sticky bottom-0 z-10 shadow-md">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right uppercase tracking-wider text-muted-foreground">
                      Grand Total ({filteredData.length} Items):
                    </td>
                    <td className="px-3 py-3 text-right font-mono">{totals.person}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNum(totals.totalGross)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNum(totals.totalBasic)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNum(totals.paySalary)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.otHour)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.otAmount, 0)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.attnBonus)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.behaviorBonus)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.allowanceArrear)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.tiffin)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.nightAllowance)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.adjustAmount)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.wagelyAdvance)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.loanAdvance)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.tax)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatNum(totals.stamp)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-mono text-xs bg-primary/10">
                      {formatNum(totals.payableAmount, 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs bg-amber-500/10">
                      {formatNum(totals.cashPay)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-mono text-xs bg-emerald-500/10">
                      {formatNum(totals.bankPay)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom Bar (Matching Reference Screenshot) */}
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

            {/* Bottom VIEW Action Button (Matching Reference Screenshot) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="h-9 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase shadow-sm transition-all tracking-wider flex items-center gap-2"
              >
                <Eye className="size-4" />
                VIEW
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
