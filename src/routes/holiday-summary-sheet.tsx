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
  CalendarDays,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { HOLIDAY_SUMMARY_DATA, type HolidaySummaryRecord } from "./-holiday-summary-data";

export const Route = createFileRoute("/holiday-summary-sheet")({
  head: () => ({
    meta: [
      { title: "Holiday Summary Sheet — CRIPTON HRIS" },
      { name: "description", content: "Line and department wise holiday overtime disbursement summary." },
    ],
  }),
  component: HolidaySummarySheetPage,
});

export function HolidaySummarySheetPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Mar");
  const [department, setDepartment] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [lineFilter, setLineFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Extract non-Total records
  const baseData = useMemo(() => {
    return HOLIDAY_SUMMARY_DATA.filter((item) => item.line !== "Total");
  }, []);

  // Line / Department options for filter
  const lineOptions = useMemo(() => {
    const lines = Array.from(new Set(baseData.map((d) => d.line))).sort();
    return [{ value: "ALL", label: "ALL" }, ...lines.map((l) => ({ value: l, label: l }))];
  }, [baseData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return baseData.filter((item) => {
      // Line / Department filter
      if (department !== "ALL" && department !== "All Departments" && item.line !== department) return false;
      if (lineFilter !== "ALL" && item.line !== lineFilter) return false;

      // Live search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.line.toLowerCase().includes(q) ||
          item.sl.toString().includes(q) ||
          item.person.toString().includes(q) ||
          item.amount.toString().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [baseData, department, lineFilter, searchQuery]);

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
        acc.person += curr.person;
        acc.otHours += curr.otHours;
        acc.amount += curr.amount;
        return acc;
      },
      { person: 0, otHours: 0, amount: 0 }
    );
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["SL", "Line", "Person", "OT Hours", "Amount"];
    const rows = filteredData.map((r, idx) => [
      idx + 1,
      r.line,
      r.person,
      r.otHours.toFixed(2),
      r.amount.toFixed(2),
    ]);

    // Add Total row
    rows.push(["Total", "Grand Total", totals.person, totals.otHours.toFixed(2), totals.amount.toFixed(2)]);

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
    link.setAttribute("download", `holiday_summary_sheet_${year}_${month}.csv`);
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
            <span className="text-foreground font-semibold">Holiday Summary Sheet</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <CalendarDays className="size-6" />
                </div>
                Holiday Summary Sheet
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Line and department wise holiday overtime disbursement and summary statement for {month} {year}.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-end">
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
                <label className="text-xs font-semibold text-foreground/80 block">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={(val) => {
                    setDepartment(val);
                    setCurrentPage(1);
                  }}
                  options={lineOptions}
                />
              </div>

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
                  value={lineFilter}
                  onChange={(val) => {
                    setLineFilter(val);
                    setCurrentPage(1);
                  }}
                  options={lineOptions}
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
                  placeholder="Search line / department..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Table (Exact Match with Reference Screenshot Header Color & Alignment) */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[750px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-sky-200/90 dark:bg-sky-950/80 backdrop-blur-sm text-sky-950 dark:text-sky-200 uppercase font-bold text-[11px] tracking-wider sticky top-0 z-10 border-b border-sky-300 dark:border-sky-800 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 w-16 text-center border-r border-sky-300/60 dark:border-sky-800/60">
                      SL
                    </th>
                    <th className="px-6 py-3 font-semibold">Line</th>
                    <th className="px-6 py-3 text-right font-semibold">Person</th>
                    <th className="px-6 py-3 text-right font-semibold">OT Hours</th>
                    <th className="px-6 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-[12px]">
                  {paginatedData.map((row, index) => {
                    const globalIdx = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={index} className="hover:bg-muted/40 transition-colors group">
                        <td className="px-4 py-3 text-center border-r border-border/30 font-semibold text-muted-foreground">
                          {globalIdx}
                        </td>
                        <td className="px-6 py-3 font-bold text-foreground group-hover:text-primary transition-colors">
                          {row.line}
                        </td>
                        <td className="px-6 py-3 text-right font-semibold font-mono">{row.person}</td>
                        <td className="px-6 py-3 text-right font-semibold font-mono text-muted-foreground">
                          {row.otHours}
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-foreground font-mono">
                          ৳ {formatCurrency(row.amount)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground font-medium">
                        No holiday summary records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer Grand Totals */}
                <tfoot className="bg-sky-200/90 dark:bg-sky-950/90 font-bold border-t-2 border-sky-300 dark:border-sky-800 text-xs sticky bottom-0 z-10 shadow-md">
                  <tr>
                    <td colSpan={2} className="px-6 py-3.5 text-right uppercase tracking-wider text-muted-foreground">
                      Grand Total ({filteredData.length} Lines):
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-xs">{totals.person}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-xs">{totals.otHours}</td>
                    <td className="px-6 py-3.5 text-right text-emerald-700 dark:text-emerald-400 font-mono text-sm bg-emerald-500/10">
                      ৳ {formatCurrency(totals.amount)}
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
