import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  Smartphone,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  DepartmentBillItem,
  SEED_DEPARTMENT_WISE_DATA,
  COMPANIES_LIST,
  DEPARTMENTS_LIST,
  BILLING_YEARS,
  BILLING_MONTHS,
  loadMobileBillingRecords,
  MobileBillRecord,
} from "./-mobile-billing-data";

export const Route = createFileRoute("/mobile-billing-department")({
  head: () => ({
    meta: [
      { title: "Department Wise Mobile Billing Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Department-wise mobile billing statement, limits, GP bill and total payment breakdown.",
      },
    ],
  }),
  component: DepartmentWiseBillingPage,
});

export function DepartmentWiseBillingPage() {
  // Searchable single-select filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("October");

  // Searchable multi-select filters
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // UI state
  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<string, boolean>>({});

  // Options for searchable selects
  const yearOptions = useMemo(
    () => BILLING_YEARS.map((y) => ({ value: String(y), label: String(y) })),
    []
  );

  const monthOptions = useMemo(
    () => BILLING_MONTHS.map((m) => ({ value: m, label: m })),
    []
  );

  const companyOptions = useMemo(
    () => COMPANIES_LIST.map((c) => ({ value: c.code, label: c.code })),
    []
  );

  const departmentOptions = useMemo(
    () => DEPARTMENTS_LIST.map((d) => ({ value: d, label: d })),
    []
  );

  // Format currency helpers
  const fmt = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Billing month calculation (e.g. October 2026 bill corresponds to September-2026 usage)
  const billingMonthText = useMemo(() => {
    const monthIdx = BILLING_MONTHS.indexOf(selectedMonth);
    const prevMonthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
    const prevYear = monthIdx === 0 ? selectedYear - 1 : selectedYear;
    const prevMonthName = BILLING_MONTHS[prevMonthIdx];
    return `${prevMonthName}-${prevYear}`;
  }, [selectedMonth, selectedYear]);

  // Aggregate data: Check if user has entered custom bills for this month in localStorage
  const rawItems = useMemo(() => {
    const stored = loadMobileBillingRecords();
    const monthRecords = stored.filter(
      (r) =>
        r.year === selectedYear &&
        (r.month === selectedMonth || r.billCycle === `${selectedMonth}-${selectedYear}`)
    );

    if (selectedYear === 2026 && selectedMonth === "October" && monthRecords.length === 0) {
      return SEED_DEPARTMENT_WISE_DATA;
    }

    if (monthRecords.length > 0) {
      // Group employee bills into department summaries
      const deptMap: Record<string, DepartmentBillItem> = {};
      monthRecords.forEach((r) => {
        const key = `${r.companyCode}_${r.location}_${r.department}`;
        if (!deptMap[key]) {
          deptMap[key] = {
            id: key,
            companyCode: r.companyCode,
            companyName: r.companyName,
            location: r.location,
            deptCode: r.department.split(".")[0] || "",
            deptName: r.department,
            limit: 0,
            gpBill: 0,
            totalPayment: 0,
          };
        }
        deptMap[key].limit += r.limit;
        deptMap[key].gpBill += r.actualBill;
        deptMap[key].totalPayment += r.totalPayment;
      });
      return Object.values(deptMap);
    }

    return SEED_DEPARTMENT_WISE_DATA;
  }, [selectedYear, selectedMonth]);

  // Apply filters
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      // Company multi-select filter
      if (selectedCompanies.length > 0) {
        const matches = selectedCompanies.some(
          (c) => item.companyCode === c || item.companyCode.includes(c)
        );
        if (!matches) return false;
      }

      // Department multi-select filter
      if (selectedDepartments.length > 0) {
        if (!selectedDepartments.includes(item.deptName)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.companyCode.toLowerCase().includes(q) ||
          item.companyName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.deptName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [rawItems, selectedCompanies, selectedDepartments, searchQuery]);

  // Hierarchical Grouping: Company -> Location -> Departments
  interface LocationGroup {
    location: string;
    items: DepartmentBillItem[];
    subtotalLimit: number;
    subtotalGpBill: number;
    subtotalTotalPayment: number;
  }

  interface CompanyGroup {
    companyCode: string;
    companyName: string;
    locations: LocationGroup[];
    companyTotalLimit: number;
    companyTotalGpBill: number;
    companyTotalPayment: number;
  }

  const groupedData = useMemo(() => {
    const compMap = new Map<
      string,
      { companyName: string; locMap: Map<string, DepartmentBillItem[]> }
    >();

    filteredItems.forEach((item) => {
      if (!compMap.has(item.companyCode)) {
        compMap.set(item.companyCode, {
          companyName: item.companyName,
          locMap: new Map<string, DepartmentBillItem[]>(),
        });
      }
      const c = compMap.get(item.companyCode)!;
      if (!c.locMap.has(item.location)) {
        c.locMap.set(item.location, []);
      }
      c.locMap.get(item.location)!.push(item);
    });

    const result: CompanyGroup[] = [];

    compMap.forEach((cVal, companyCode) => {
      let companyTotalLimit = 0;
      let companyTotalGpBill = 0;
      let companyTotalPayment = 0;
      const locations: LocationGroup[] = [];

      cVal.locMap.forEach((items, location) => {
        const subtotalLimit = items.reduce((sum, i) => sum + i.limit, 0);
        const subtotalGpBill = items.reduce((sum, i) => sum + i.gpBill, 0);
        const subtotalTotalPayment = items.reduce((sum, i) => sum + i.totalPayment, 0);

        companyTotalLimit += subtotalLimit;
        companyTotalGpBill += subtotalGpBill;
        companyTotalPayment += subtotalTotalPayment;

        locations.push({
          location,
          items,
          subtotalLimit,
          subtotalGpBill,
          subtotalTotalPayment,
        });
      });

      result.push({
        companyCode,
        companyName: cVal.companyName,
        locations,
        companyTotalLimit,
        companyTotalGpBill,
        companyTotalPayment,
      });
    });

    return result;
  }, [filteredItems]);

  // Grand Totals
  const grandTotals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => ({
        limit: acc.limit + item.limit,
        gpBill: acc.gpBill + item.gpBill,
        totalPayment: acc.totalPayment + item.totalPayment,
      }),
      { limit: 0, gpBill: 0, totalPayment: 0 }
    );
  }, [filteredItems]);

  const handleResetFilters = () => {
    setSelectedYear(2026);
    setSelectedMonth("October");
    setSelectedCompanies([]);
    setSelectedDepartments([]);
    setSearchQuery("");
    toast.info("Filters reset to default.");
  };

  const handleToggleCompany = (code: string) => {
    setCollapsedCompanies((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleExpandAll = () => setCollapsedCompanies({});
  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    groupedData.forEach((g) => {
      allCollapsed[g.companyCode] = true;
    });
    setCollapsedCompanies(allCollapsed);
  };

  // Export CSV
  const handleExportCSV = () => {
    const lines: string[] = [];
    lines.push(`PAKIZA KNIT GROUP`);
    lines.push(`Mobile Bill - ${selectedMonth}-${selectedYear}`);
    lines.push(`Billing Month: ${billingMonthText}`);
    lines.push(`Generated: ${new Date().toLocaleDateString("en-GB")}`);
    lines.push(``);
    lines.push(`"Row Labels","Limit","GP Bill","Total Payment"`);

    groupedData.forEach((cg) => {
      lines.push(`"${cg.companyCode}","","",""`);
      cg.locations.forEach((lg) => {
        lines.push(`"  ${lg.location}","","",""`);
        lg.items.forEach((item) => {
          lines.push(
            `"    ${item.deptName}","${item.limit.toFixed(2)}","${item.gpBill.toFixed(2)}","${item.totalPayment.toFixed(2)}"`
          );
        });
        lines.push(
          `"  ${lg.location} Total","${lg.subtotalLimit.toFixed(2)}","${lg.subtotalGpBill.toFixed(2)}","${lg.subtotalTotalPayment.toFixed(2)}"`
        );
      });
      lines.push(
        `"${cg.companyCode} Total","${cg.companyTotalLimit.toFixed(2)}","${cg.companyTotalGpBill.toFixed(2)}","${cg.companyTotalPayment.toFixed(2)}"`
      );
    });

    lines.push(
      `"Grand Total","${grandTotals.limit.toFixed(2)}","${grandTotals.gpBill.toFixed(2)}","${grandTotals.totalPayment.toFixed(2)}"`
    );

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Department_Wise_Mobile_Bill_${selectedMonth}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Department wise billing exported to CSV!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans print:bg-white print:h-auto print:overflow-visible">
      {/* Sidebar - hidden on print */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:block">
        {/* Topbar - hidden on print */}
        <div className="print:hidden">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full print:p-0 print:m-0 print:max-w-none print:overflow-visible">
          {/* Breadcrumb Navigation - hidden on print */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="hover:text-primary transition-colors">Mobile Billing</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Department Wise Billing
            </span>
          </div>

          {/* Page Header Card - hidden on print */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Smartphone className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Department Wise Mobile Billing</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
                    Corporate Statement
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hierarchical company & location department breakdown of mobile limits, GP bills, and total payments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExpandAll}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Collapse All
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          {/* Filter Bar with Searchable Dropdowns & Multi-Select Company/Department */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Filter className="size-3.5 text-blue-600" />
                <span>Filters (Searchable & Multi-Select)</span>
                {(selectedCompanies.length > 0 || selectedDepartments.length > 0) && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">
                    {selectedCompanies.length > 0 && `${selectedCompanies.length} companies`}
                    {selectedCompanies.length > 0 && selectedDepartments.length > 0 && ", "}
                    {selectedDepartments.length > 0 && `${selectedDepartments.length} depts`}
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 items-end">
              {/* Year Filter - Searchable */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <SearchableSelect
                  options={yearOptions}
                  value={String(selectedYear)}
                  onChange={(val) => setSelectedYear(Number(val))}
                  placeholder="Select Year..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Month Filter - Searchable */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Month
                </label>
                <SearchableSelect
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(val) => setSelectedMonth(val)}
                  placeholder="Select Month..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Company Filter - Searchable Multi-Select */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Company (Multi-Select)
                </label>
                <MultiSelect
                  options={companyOptions}
                  selected={selectedCompanies}
                  onChange={setSelectedCompanies}
                  placeholder="All Companies..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Department Filter - Searchable Multi-Select */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Department (Multi-Select)
                </label>
                <MultiSelect
                  options={departmentOptions}
                  selected={selectedDepartments}
                  onChange={setSelectedDepartments}
                  placeholder="All Departments..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Search box */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Search
                </label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search unit, dept..."
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 h-10 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AUTHENTIC PRINT & VIEW SHEET (Matching Screenshot Exactly) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-10 max-w-[1200px] mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
            {/* Header matching user's screenshot */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white">
                PAKIZA KNIT GROUP
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                House No: 97, Road No: 11/A, Dhanmondi R/A, Dhaka-1209.
              </p>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-2 underline underline-offset-4 decoration-slate-400">
                Mobile Bill-{selectedMonth}-{selectedYear}
              </h3>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                Billing Month: {billingMonthText}
              </p>
              <div className="text-right text-[11px] text-slate-500 font-medium mt-1">
                Date: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, "-")}
              </div>
            </div>

            {/* Hierarchical Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-400 dark:border-slate-700">
                <thead>
                  <tr className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-400 dark:border-slate-700">
                    <th className="py-2.5 px-3 text-left border-r border-slate-400 dark:border-slate-700 w-1/2">
                      Row Labels
                    </th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-400 dark:border-slate-700 w-1/6">
                      Limit
                    </th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-400 dark:border-slate-700 w-1/6">
                      GP Bill
                    </th>
                    <th className="py-2.5 px-3 text-right w-1/6">
                      Total Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No billing records found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    groupedData.map((company) => {
                      const isCollapsed = !!collapsedCompanies[company.companyCode];

                      return (
                        <div key={company.companyCode} className="contents">
                          {/* Company Main Header Row */}
                          <tr
                            onClick={() => handleToggleCompany(company.companyCode)}
                            className="bg-slate-100/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors font-bold text-slate-900 dark:text-white cursor-pointer select-none border-b border-slate-300 dark:border-slate-700"
                          >
                            <td className="py-2 px-3 border-r border-slate-300 dark:border-slate-700 flex items-center justify-between">
                              <span className="font-extrabold">{company.companyCode}</span>
                              <ChevronDown
                                className={`size-3.5 text-slate-400 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                              />
                            </td>
                            <td className="py-2 px-3 text-right border-r border-slate-300 dark:border-slate-700"></td>
                            <td className="py-2 px-3 text-right border-r border-slate-300 dark:border-slate-700"></td>
                            <td className="py-2 px-3 text-right"></td>
                          </tr>

                          {!isCollapsed &&
                            company.locations.map((loc) => (
                              <div key={loc.location} className="contents">
                                {/* Location Row */}
                                <tr className="bg-slate-50/50 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                                  <td className="py-1.5 px-6 border-r border-slate-300 dark:border-slate-700 italic">
                                    {loc.location}
                                  </td>
                                  <td className="py-1.5 px-3 border-r border-slate-300 dark:border-slate-700"></td>
                                  <td className="py-1.5 px-3 border-r border-slate-300 dark:border-slate-700"></td>
                                  <td className="py-1.5 px-3"></td>
                                </tr>

                                {/* Department Rows */}
                                {loc.items.map((dept) => (
                                  <tr
                                    key={dept.id}
                                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                  >
                                    <td className="py-1 px-10 border-r border-slate-300 dark:border-slate-700">
                                      {dept.deptName}
                                    </td>
                                    <td className="py-1 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700">
                                      {fmt(dept.limit)}
                                    </td>
                                    <td className="py-1 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700">
                                      {fmt(dept.gpBill)}
                                    </td>
                                    <td className="py-1 px-3 text-right font-mono font-medium">
                                      {fmt(dept.totalPayment)}
                                    </td>
                                  </tr>
                                ))}

                                {/* Location Subtotal Row */}
                                <tr className="bg-slate-100/90 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white border-b border-slate-400 dark:border-slate-600">
                                  <td className="py-1.5 px-6 border-r border-slate-400 dark:border-slate-700">
                                    {loc.location} Total
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-mono border-r border-slate-400 dark:border-slate-700">
                                    {fmt(loc.subtotalLimit)}
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-mono border-r border-slate-400 dark:border-slate-700">
                                    {fmt(loc.subtotalGpBill)}
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-mono">
                                    {fmt(loc.subtotalTotalPayment)}
                                  </td>
                                </tr>
                              </div>
                            ))}

                          {/* Company Subtotal Row */}
                          <tr className="bg-slate-200/90 dark:bg-slate-800 font-black text-slate-950 dark:text-white border-b-2 border-slate-500 dark:border-slate-600">
                            <td className="py-2 px-3 border-r border-slate-400 dark:border-slate-600">
                              {company.companyCode} Total
                            </td>
                            <td className="py-2 px-3 text-right font-mono border-r border-slate-400 dark:border-slate-600">
                              {fmt(company.companyTotalLimit)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono border-r border-slate-400 dark:border-slate-600">
                              {fmt(company.companyTotalGpBill)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {fmt(company.companyTotalPayment)}
                            </td>
                          </tr>
                        </div>
                      );
                    })
                  )}

                  {/* GRAND TOTAL ROW - Highlighted exactly like screenshot in light blue #d9e1f2 */}
                  <tr className="bg-[#d9e1f2] dark:bg-blue-950 text-slate-950 dark:text-blue-100 font-black text-[13px] border-t-2 border-slate-600">
                    <td className="py-3 px-3 border-r border-slate-500 dark:border-slate-700">
                      Grand Total
                    </td>
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-500 dark:border-slate-700">
                      {fmt(grandTotals.limit)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono border-r border-slate-500 dark:border-slate-700">
                      {fmt(grandTotals.gpBill)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {fmt(grandTotals.totalPayment)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print Signature Footer */}
            <div className="hidden print:grid grid-cols-4 gap-6 pt-16 mt-12 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-1 font-semibold">Prepared By</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Verified By (HR)</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Accounts Checked</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Approved By (GM/Director)</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
