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
  Eye,
  X,
} from "lucide-react";
import {
  FINAL_SETTLEMENT_REPORT_DATA,
  type FinalSettlementReportRecord,
} from "./-final-settlement-report-data";

export const Route = createFileRoute("/final-settlement-report")({
  head: () => ({
    meta: [
      { title: "Final Settlement Report — CRIPTON HRIS" },
      { name: "description", content: "Final Settlement Report for separated employees." },
    ],
  }),
  component: FinalSettlementReportPage,
});

export function FinalSettlementReportPage() {
  // Filter States
  const [resignDateFrom, setResignDateFrom] = useState("2026-08-01");
  const [resignDateTo, setResignDateTo] = useState("2026-08-31");
  const [settleType, setSettleType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // View modal state
  const [viewingRecord, setViewingRecord] = useState<FinalSettlementReportRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Settle Type dropdown options
  const settleTypeOptions = [
    { value: "ALL", label: "Select..." },
    { value: "Lefty", label: "Lefty" },
    { value: "Resigned", label: "Resigned" },
    { value: "Dismissed", label: "Dismissed" },
  ];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return FINAL_SETTLEMENT_REPORT_DATA.filter((item) => {
      // Settle Type filter
      if (settleType !== "ALL" && item.resignStatus !== settleType) return false;

      // Live search filter across name, ID, designation, department, etc.
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.jobTitle.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q) ||
          item.bankName.toLowerCase().includes(q) ||
          item.resignStatus.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [settleType, searchQuery]);

  // Checkbox select handlers
  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedRows[item.empId]);

  const handleSelectAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    if (checked) {
      filteredData.forEach((item) => {
        updated[item.empId] = true;
      });
    }
    setSelectedRows(updated);
  };

  const handleSelectRow = (empId: string, checked: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [empId]: checked,
    }));
  };

  // Grand Totals
  const grandTotals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.gross += curr.gross || 0;
        acc.basic += curr.basic || 0;
        acc.absentDeduction += curr.absentDeduction || 0;
        acc.wagelyAdvance += curr.wagelyAdvance || 0;
        acc.paySalary += curr.paySalary || 0;
        acc.otAmount += curr.otAmount || 0;
        acc.netSalary += curr.netSalary || 0;
        acc.elAmt += curr.elAmt || 0;
        acc.serviceBenefit += curr.serviceBenefit || 0;
        acc.grandTotal += curr.grandTotal || 0;
        acc.noticeShortageDeduction += curr.noticeShortageDeduction || 0;
        acc.netPayment += curr.netPayment || 0;
        return acc;
      },
      {
        gross: 0,
        basic: 0,
        absentDeduction: 0,
        wagelyAdvance: 0,
        paySalary: 0,
        otAmount: 0,
        netSalary: 0,
        elAmt: 0,
        serviceBenefit: 0,
        grandTotal: 0,
        noticeShortageDeduction: 0,
        netPayment: 0,
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
      "EmpId",
      "Employee Name",
      "Emp Type",
      "Department",
      "Section",
      "Job Title",
      "Grade",
      "Unit",
      "Line",
      "DOJ",
      "Resign Status",
      "Last Working Day",
      "Resign Date/Action Date",
      "Release Date",
      "Service Length",
      "Payable Years (SB)",
      "Payable Days Per Year (SB)",
      "Gross",
      "Basic",
      "Pay Days",
      "P",
      "A",
      "L",
      "H",
      "Absent Deduction",
      "PF (Deduct)",
      "Tax",
      "Advance",
      "Loan",
      "Lunch Deduction",
      "Others Deduction",
      "Rev# Stamp",
      "Wagely Advance",
      "Pay Salary",
      "OT Hour",
      "OT Amount",
      "Att# Bonus",
      "Behaviour Bonus",
      "Holiday Allow#",
      "Gen# Allow#",
      "Cov# Allow",
      "Incentive Allow#",
      "Others Allow",
      "Arrear",
      "Net Salary",
      "Tiffin & Night Bill",
      "Total Present Days",
      "EL Days",
      "EL Amt",
      "Service Benefit",
      "PF (P)",
      "CPF",
      "PF (Total)",
      "Grand Total",
      "Notice Shortage Days",
      "Notice Shortage Deduction",
      "Compensation Amt",
      "Compensation Remarks",
      "Net Payment",
      "Personal Contact No",
      "Bank Name",
      "A/C No",
      "Remarks",
    ];

    const rows = filteredData.map((d, index) => [
      index + 1,
      `"${d.empId}"`,
      `"${d.name}"`,
      `"${d.empType}"`,
      `"${d.department}"`,
      `"${d.section}"`,
      `"${d.jobTitle}"`,
      `"${d.grade}"`,
      `"${d.unit}"`,
      `"${d.line}"`,
      `"${d.doj}"`,
      `"${d.resignStatus}"`,
      `"${d.lastWorkingDay}"`,
      `"${d.resignDate}"`,
      `"${d.releaseDate}"`,
      `"${d.serviceLength}"`,
      d.payableYearsSB,
      d.payableDaysPerYearSB,
      d.gross,
      d.basic,
      d.payDays,
      d.p,
      d.a,
      d.l,
      d.h,
      d.absentDeduction,
      d.pfDeduct,
      d.tax,
      d.advance,
      d.loan,
      d.lunchDeduction,
      d.othersDeduction,
      d.revStamp,
      d.wagelyAdvance,
      d.paySalary,
      d.otHour,
      d.otAmount,
      d.attnBonus,
      d.behaviourBonus,
      d.holidayAllow,
      d.genAllow,
      d.covAllow,
      d.incentiveAllow,
      d.othersAllow,
      d.arrear,
      d.netSalary,
      d.tiffinNightBill,
      d.totalPresentDays,
      d.elDays,
      d.elAmt,
      d.serviceBenefit,
      d.pfP,
      d.cpf,
      d.pfTotal,
      d.grandTotal,
      d.noticeShortageDays,
      d.noticeShortageDeduction,
      d.compensationAmt,
      `"${d.compensationRemarks}"`,
      d.netPayment,
      `"${d.personalContactNo}"`,
      `"${d.bankName}"`,
      `"${d.acNo}"`,
      `"${d.remarks}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Final_Settlement_Report_${resignDateFrom}_to_${resignDateTo}.csv`);
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
                <span className="text-foreground">Final Settlement Report</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Calculator className="size-5 text-sky-600" />
                Final Settlement Report
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                {filteredData.length} Records Found
              </span>
            </div>
          </div>

          {/* Filter Card matching reference screenshot */}
          <div className="bg-card rounded-xl border border-border/80 shadow-sm p-4 print:hidden space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Resign Date From</label>
                <input
                  type="date"
                  value={resignDateFrom}
                  onChange={(e) => setResignDateFrom(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Resign Date To</label>
                <input
                  type="date"
                  value={resignDateTo}
                  onChange={(e) => setResignDateTo(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-xs focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground/75 block">Settle Type</label>
                <SearchableSelect
                  value={settleType}
                  onChange={(val) => {
                    setSettleType(val);
                    setCurrentPage(1);
                  }}
                  options={settleTypeOptions}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="h-8 px-6 rounded-md bg-[#3097d1] hover:bg-[#2884b8] text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wide cursor-pointer flex items-center gap-1.5"
                >
                  SEARCH
                </button>
              </div>
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
                  className="w-48 sm:w-64 h-8 pl-8 pr-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Report Data Table Container */}
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-h-[calc(100vh-320px)] min-h-[400px]">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#bce0fd] dark:bg-sky-950/80 text-sky-950 dark:text-sky-100 sticky top-0 z-10 select-none shadow-2xs font-semibold">
                  <tr className="border-b border-sky-300 dark:border-sky-800 divide-x divide-sky-300/70 dark:divide-sky-800/70">
                    <th className="px-2 py-2 text-center w-8">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="size-3.5 accent-sky-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-2 py-2 text-center w-8 print:hidden">
                      <Printer className="size-3.5 text-amber-600 inline" />
                    </th>
                    <th className="px-2.5 py-2 text-center w-10">SL</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">EmpId</th>
                    <th className="px-3 py-2 min-w-[150px] whitespace-nowrap">Employee Name</th>
                    <th className="px-2.5 py-2 min-w-[100px] whitespace-nowrap">Emp Type</th>
                    <th className="px-2.5 py-2 min-w-[140px] whitespace-nowrap">Department</th>
                    <th className="px-2.5 py-2 min-w-[120px] whitespace-nowrap">Section</th>
                    <th className="px-2.5 py-2 min-w-[130px] whitespace-nowrap">Job Title</th>
                    <th className="px-2 py-2 min-w-[50px] text-center whitespace-nowrap">Grade</th>
                    <th className="px-2 py-2 min-w-[65px] text-center whitespace-nowrap">Unit</th>
                    <th className="px-2 py-2 min-w-[50px] text-center whitespace-nowrap">Line</th>
                    <th className="px-2.5 py-2 min-w-[85px] whitespace-nowrap">DOJ</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">Resign Status</th>
                    <th className="px-2.5 py-2 min-w-[105px] whitespace-nowrap">Last Working Day</th>
                    <th className="px-2.5 py-2 min-w-[125px] whitespace-nowrap">Resign Date/Action Date</th>
                    <th className="px-2.5 py-2 min-w-[90px] whitespace-nowrap">Release Date</th>
                    <th className="px-3 py-2 min-w-[160px] whitespace-nowrap">Service Length</th>
                    <th className="px-2 text-center min-w-[110px] whitespace-nowrap">Payable Years (SB)</th>
                    <th className="px-2 text-center min-w-[130px] whitespace-nowrap">Payable Days Per Year (SB)</th>
                    <th className="px-2.5 py-2 text-right min-w-[80px] whitespace-nowrap">Gross</th>
                    <th className="px-2.5 py-2 text-right min-w-[80px] whitespace-nowrap">Basic</th>
                    <th className="px-2 text-center min-w-[60px] whitespace-nowrap">Pay Days</th>
                    <th className="px-1 text-center min-w-[30px]">P</th>
                    <th className="px-1 text-center min-w-[30px]">A</th>
                    <th className="px-1 text-center min-w-[30px]">L</th>
                    <th className="px-1 text-center min-w-[30px]">H</th>
                    <th className="px-2.5 py-2 text-right min-w-[90px] whitespace-nowrap">Absent Deduction</th>
                    <th className="px-2 text-right min-w-[70px] whitespace-nowrap">PF (Deduct)</th>
                    <th className="px-2 text-right min-w-[60px]">Tax</th>
                    <th className="px-2 text-right min-w-[60px]">Advance</th>
                    <th className="px-2 text-right min-w-[60px]">Loan</th>
                    <th className="px-2 text-right min-w-[80px] whitespace-nowrap">Lunch Deduction</th>
                    <th className="px-2 text-right min-w-[85px] whitespace-nowrap">Others Deduction</th>
                    <th className="px-2 text-right min-w-[70px] whitespace-nowrap">Rev# Stamp</th>
                    <th className="px-2.5 py-2 text-right min-w-[90px] whitespace-nowrap">Wagely Advance</th>
                    <th className="px-2.5 py-2 text-right min-w-[85px] whitespace-nowrap">Pay Salary</th>
                    <th className="px-2 text-center min-w-[60px]">OT Hour</th>
                    <th className="px-2.5 py-2 text-right min-w-[75px] whitespace-nowrap">OT Amount</th>
                    <th className="px-2 text-right min-w-[70px]">Att# Bonus</th>
                    <th className="px-2 text-right min-w-[85px] whitespace-nowrap">Behaviour Bonus</th>
                    <th className="px-2 text-right min-w-[80px] whitespace-nowrap">Holiday Allow#</th>
                    <th className="px-2 text-right min-w-[75px] whitespace-nowrap">Gen# Allow#</th>
                    <th className="px-2 text-right min-w-[70px] whitespace-nowrap">Cov# Allow</th>
                    <th className="px-2 text-right min-w-[85px] whitespace-nowrap">Incentive Allow#</th>
                    <th className="px-2 text-right min-w-[75px] whitespace-nowrap">Others Allow</th>
                    <th className="px-2 text-right min-w-[60px]">Arrear</th>
                    <th className="px-2.5 py-2 text-right min-w-[85px] whitespace-nowrap">Net Salary</th>
                    <th className="px-2 text-right min-w-[95px] whitespace-nowrap">Tiffin & Night Bill</th>
                    <th className="px-2 text-center min-w-[95px] whitespace-nowrap">Total Present Days</th>
                    <th className="px-2 text-center min-w-[60px]">EL Days</th>
                    <th className="px-2.5 py-2 text-right min-w-[80px] whitespace-nowrap">EL Amt</th>
                    <th className="px-2.5 py-2 text-right min-w-[95px] whitespace-nowrap">Service Benefit</th>
                    <th className="px-2 text-right min-w-[60px]">PF (P)</th>
                    <th className="px-2 text-right min-w-[60px]">CPF</th>
                    <th className="px-2 text-right min-w-[70px]">PF (Total)</th>
                    <th className="px-2.5 py-2 text-right min-w-[95px] whitespace-nowrap">Grand Total</th>
                    <th className="px-2 text-center min-w-[110px] whitespace-nowrap">Notice Shortage Days</th>
                    <th className="px-2.5 py-2 text-right min-w-[130px] whitespace-nowrap">Notice Shortage Deduct</th>
                    <th className="px-2.5 py-2 text-right min-w-[95px] whitespace-nowrap">Compensation Amt</th>
                    <th className="px-2.5 py-2 min-w-[120px] whitespace-nowrap">Compensation Remarks</th>
                    <th className="px-2.5 py-2 text-right min-w-[95px] whitespace-nowrap">Net Payment</th>
                    <th className="px-2.5 py-2 min-w-[110px] whitespace-nowrap">Personal Contact No</th>
                    <th className="px-3 py-2 min-w-[150px] whitespace-nowrap">Bank Name</th>
                    <th className="px-2.5 py-2 min-w-[80px] whitespace-nowrap">A/C No</th>
                    <th className="px-2.5 py-2 min-w-[80px]">Remarks</th>
                    <th className="px-2.5 py-2 min-w-[80px]">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground/90">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, idx) => {
                      const absoluteIndex = (currentPage - 1) * pageSize + idx + 1;
                      const isSelected = !!selectedRows[row.empId];
                      return (
                        <tr
                          key={row.sl + "-" + row.empId + "-" + idx}
                          className={`hover:bg-sky-50/60 dark:hover:bg-slate-800/50 transition-colors divide-x divide-border/40 ${
                            isSelected ? "bg-sky-50 dark:bg-sky-950/30" : ""
                          }`}
                        >
                          <td className="px-2 py-1.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectRow(row.empId, e.target.checked)}
                              className="size-3.5 accent-sky-600 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center print:hidden">
                            <button
                              onClick={() => setViewingRecord(row)}
                              className="text-amber-600 hover:text-amber-700 transition-colors cursor-pointer p-0.5 rounded hover:bg-amber-100/50"
                              title="View Final Settlement Sheet"
                            >
                              <Printer className="size-3.5 inline" />
                            </button>
                          </td>
                          <td className="px-2.5 py-1.5 text-center text-muted-foreground font-mono">
                            {absoluteIndex}
                          </td>
                          <td className="px-2.5 py-1.5 font-mono font-medium text-foreground">
                            {row.empId}
                          </td>
                          <td 
                            onClick={() => setViewingRecord(row)}
                            className="px-3 py-1.5 font-semibold text-foreground whitespace-nowrap hover:text-sky-600 hover:underline cursor-pointer"
                          >
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
                            {row.jobTitle}
                          </td>
                          <td className="px-2 py-1.5 text-center font-mono font-medium text-foreground/80">
                            {row.grade}
                          </td>
                          <td className="px-2 py-1.5 text-center text-muted-foreground whitespace-nowrap">
                            {row.unit}
                          </td>
                          <td className="px-2 py-1.5 text-center text-muted-foreground whitespace-nowrap">
                            {row.line}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-muted-foreground">
                            {row.doj}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-medium text-rose-600 dark:text-rose-400">
                            {row.resignStatus}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-muted-foreground">
                            {row.lastWorkingDay}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-muted-foreground">
                            {row.resignDate}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap font-mono text-muted-foreground">
                            {row.releaseDate}
                          </td>
                          <td className="px-3 py-1.5 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                            {row.serviceLength}
                          </td>
                          <td className="px-2 text-center font-mono">{row.payableYearsSB}</td>
                          <td className="px-2 text-center font-mono">{row.payableDaysPerYearSB.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-foreground">
                            {row.gross.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-foreground/90">
                            {row.basic.toLocaleString()}
                          </td>
                          <td className="px-2 text-center font-mono font-medium">{row.payDays}</td>
                          <td className="px-1 text-center font-mono text-emerald-600">{row.p}</td>
                          <td className="px-1 text-center font-mono text-rose-600">{row.a}</td>
                          <td className="px-1 text-center font-mono text-amber-600">{row.l}</td>
                          <td className="px-1 text-center font-mono text-blue-600">{row.h}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-rose-600">
                            {row.absentDeduction > 0 ? row.absentDeduction.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-2 text-right font-mono">{row.pfDeduct.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.tax.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.advance.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.loan.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.lunchDeduction.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.othersDeduction.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.revStamp.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-amber-700 dark:text-amber-300">
                            {row.wagelyAdvance > 0 ? row.wagelyAdvance.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-sky-700 dark:text-sky-300">
                            {row.paySalary.toLocaleString()}
                          </td>
                          <td className="px-2 text-center font-mono">{row.otHour.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                            {row.otAmount.toLocaleString()}
                          </td>
                          <td className="px-2 text-right font-mono">{row.attnBonus.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.behaviourBonus.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.holidayAllow.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.genAllow.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.covAllow.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.incentiveAllow.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.othersAllow.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono font-medium">{row.arrear.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-bold text-sky-800 dark:text-sky-200">
                            {row.netSalary.toLocaleString()}
                          </td>
                          <td className="px-2 text-right font-mono">{row.tiffinNightBill.toFixed(2)}</td>
                          <td className="px-2 text-center font-mono">{row.totalPresentDays}</td>
                          <td className="px-2 text-center font-mono">{row.elDays.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-purple-700 dark:text-purple-300">
                            {row.elAmt.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                            {row.serviceBenefit.toLocaleString()}
                          </td>
                          <td className="px-2 text-right font-mono">{row.pfP.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.cpf.toFixed(2)}</td>
                          <td className="px-2 text-right font-mono">{row.pfTotal.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                            {row.grandTotal.toLocaleString()}
                          </td>
                          <td className="px-2 text-center font-mono">{row.noticeShortageDays}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-rose-700 dark:text-rose-300 font-semibold">
                            {row.noticeShortageDeduction.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono">{row.compensationAmt.toFixed(2)}</td>
                          <td className="px-2.5 py-1.5 font-mono text-xs">{row.compensationRemarks || "-"}</td>
                          <td className="px-2.5 py-1.5 text-right font-mono font-extrabold text-emerald-700 dark:text-emerald-300 text-xs bg-emerald-100/60 dark:bg-emerald-950/40">
                            {row.netPayment.toLocaleString()}
                          </td>
                          <td className="px-2.5 py-1.5 font-mono text-foreground/80">{row.personalContactNo || "-"}</td>
                          <td className="px-3 py-1.5 whitespace-nowrap text-foreground/80">{row.bankName || "-"}</td>
                          <td className="px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{row.acNo || "-"}</td>
                          <td className="px-2.5 py-1.5 text-muted-foreground">{row.remarks || "-"}</td>
                          <td className="px-2.5 py-1.5 text-muted-foreground">{row.signature || "-"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={67} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No settlement records matched your search criteria.</p>
                          <button
                            onClick={() => {
                              setSettleType("ALL");
                              setSearchQuery("");
                            }}
                            className="text-xs text-sky-600 underline hover:text-sky-700 cursor-pointer"
                          >
                            Reset Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Grand Total Footer */}
                {filteredData.length > 0 && (
                  <tfoot className="bg-[#aed8fa] dark:bg-sky-950 text-sky-950 dark:text-sky-100 font-bold sticky bottom-0 border-t-2 border-sky-400 dark:border-sky-700 divide-x divide-sky-300 dark:divide-sky-800 shadow-lg">
                    <tr>
                      <td colSpan={20} className="px-3 py-2 text-right uppercase tracking-wider text-xs">
                        Total ({filteredData.length} Persons):
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.gross.toLocaleString()}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.basic.toLocaleString()}
                      </td>
                      <td colSpan={5} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-rose-800 dark:text-rose-200">
                        {grandTotals.absentDeduction.toFixed(2)}
                      </td>
                      <td colSpan={7} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.wagelyAdvance.toFixed(2)}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.paySalary.toLocaleString()}
                      </td>
                      <td className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-emerald-800 dark:text-emerald-200">
                        {grandTotals.otAmount.toLocaleString()}
                      </td>
                      <td colSpan={9} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs">
                        {grandTotals.netSalary.toLocaleString()}
                      </td>
                      <td colSpan={3} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-purple-900 dark:text-purple-200">
                        {grandTotals.elAmt.toLocaleString()}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-indigo-900 dark:text-indigo-200">
                        {grandTotals.serviceBenefit.toLocaleString()}
                      </td>
                      <td colSpan={3} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-emerald-900 dark:text-emerald-100">
                        {grandTotals.grandTotal.toLocaleString()}
                      </td>
                      <td className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs text-rose-900 dark:text-rose-200">
                        {grandTotals.noticeShortageDeduction.toLocaleString()}
                      </td>
                      <td colSpan={2} className="px-1 text-center text-xs">-</td>
                      <td className="px-2.5 py-2 text-right font-mono text-xs font-extrabold text-emerald-900 dark:text-emerald-100">
                        {grandTotals.netPayment.toLocaleString()}
                      </td>
                      <td colSpan={5} className="px-2.5 py-2"></td>
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

        {/* ─── FINAL SETTLEMENT SHEET MODAL VIEW ───────────────────────────────── */}
        {viewingRecord && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Control Header */}
              <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Calculator className="size-4 text-sky-600" />
                  <span>Final Settlement Statement Preview</span>
                  <span className="text-muted-foreground font-normal">({viewingRecord.empId})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="h-8 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    onClick={() => setViewingRecord(null)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Printable Final Settlement Sheet Content */}
              <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans">
                {/* Printable Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Pakiza Software Limited
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                    </p>
                    <h3 className="text-base font-extrabold text-blue-600 uppercase tracking-wide mt-3">
                      FINAL SETTLEMENT SHEET
                    </h3>
                  </div>

                  {/* Photo Frame & Print Overlay */}
                  <div className="relative group shrink-0">
                    <div className="w-[85px] h-[105px] border-2 border-slate-300 rounded overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center">
                      <div className="text-center p-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">PHOTO</span>
                        <span className="text-[10px] font-semibold text-slate-600 block mt-1">{viewingRecord.name.split(' ')[0]}</span>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="absolute -top-2 -right-2 p-1.5 bg-slate-900 text-white rounded-full shadow-md hover:bg-sky-600 transition-colors print:hidden cursor-pointer"
                      title="Print Statement"
                    >
                      <Printer className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Top Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 text-[11px]">
                  {/* Left: Employee Info */}
                  <div>
                    <h4 className="font-bold text-[#4caf50] border-b border-slate-200 pb-1 mb-2 text-xs">
                      Employee Info
                    </h4>
                    <div className="space-y-1.5 text-slate-700">
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Employee ID</span>
                        <span className="w-3">:</span>
                        <span className="font-semibold text-slate-900 flex-1">{viewingRecord.empId}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Employee Name</span>
                        <span className="w-3">:</span>
                        <span className="font-bold text-slate-900 flex-1">{viewingRecord.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Joining Date</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.doj}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Designation</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.jobTitle}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Department</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.department}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Line</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.line}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Grade</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">Grade-{viewingRecord.grade}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Gross Salary</span>
                        <span className="w-3">:</span>
                        <span className="font-semibold text-slate-900 flex-1">{viewingRecord.gross.toFixed(2)}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Basic Salary</span>
                        <span className="w-3">:</span>
                        <span className="font-semibold text-slate-900 flex-1">{viewingRecord.basic.toFixed(2)}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Tenure of work</span>
                        <span className="w-3">:</span>
                        <span className="font-bold text-slate-900 flex-1">{viewingRecord.serviceLength}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Day Shortage</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.noticeShortageDays} Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Settlement Info */}
                  <div>
                    <h4 className="font-bold text-[#4caf50] border-b border-slate-200 pb-1 mb-2 text-xs">
                      Settlement Info
                    </h4>
                    <div className="space-y-1.5 text-slate-700">
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Code</span>
                        <span className="w-3">:</span>
                        <span className="font-mono flex-1">9348</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Settlement Type</span>
                        <span className="w-3">:</span>
                        <span className="font-semibold text-slate-900 flex-1">{viewingRecord.resignStatus}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Settlement Date</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.releaseDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Resign Apply Date</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.resignDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Resign Date</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.resignDate}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Last Working Date</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">{viewingRecord.lastWorkingDay}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Notice Period</span>
                        <span className="w-3">:</span>
                        <span className="flex-1">60 Days</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 font-medium text-slate-500">Comments</span>
                        <span className="w-3">:</span>
                        <span className="flex-1 text-slate-800">Verified by HR. Cleared all assets.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-[11px]">
                  {/* Left Column: Payment Info */}
                  <div>
                    <h4 className="font-bold text-[#4caf50] mb-2 text-xs">Payment Info</h4>
                    <div className="border border-slate-300 rounded overflow-hidden">
                      {/* Earning Sectors Header */}
                      <div className="bg-slate-100 px-3 py-1.5 font-bold italic border-b border-slate-300 text-slate-800">
                        Earning Sectors
                      </div>
                      <div className="px-3 py-2 space-y-1.5 text-slate-700">
                        <div className="flex">
                          <span className="flex-1">Salary (Up to {viewingRecord.lastWorkingDay})</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono font-medium">{viewingRecord.paySalary.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Attendance Bonus</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.attnBonus.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">EID Bonus</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">0.00</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Earn Leave ({viewingRecord.elDays.toFixed(2)} Days)</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.elAmt.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Over Time ({viewingRecord.otHour.toFixed(0)} Hours)</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.otAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Provident Fund (PF + CPF)</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.pfTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Night & Tiffin Bill</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.tiffinNightBill.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Other Payment</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.othersAllow.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Total Earning Bar */}
                      <div className="flex bg-slate-100 px-3 py-1.5 font-bold border-t border-b border-slate-300">
                        <span className="flex-1 text-right pr-4 text-slate-800">Total Earning</span>
                        <span className="w-12 text-slate-600">: Tk.</span>
                        <span className="w-24 text-right font-mono font-bold text-slate-900">
                          {viewingRecord.grandTotal.toFixed(0)}
                        </span>
                      </div>

                      {/* Deduction Sectors Header */}
                      <div className="bg-slate-100 px-3 py-1.5 font-bold italic border-b border-slate-300 text-slate-800">
                        Deduction Sectors
                      </div>
                      <div className="px-3 py-2 space-y-1.5 text-slate-700">
                        <div className="flex">
                          <span className="flex-1">Tenure of Notice ({viewingRecord.noticeShortageDays} Days)</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.noticeShortageDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Absent ({viewingRecord.a} Days)</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.absentDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Other Payment</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.othersDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Advance Payment</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.wagelyAdvance.toFixed(2)}</span>
                        </div>
                        <div className="flex">
                          <span className="flex-1">Revenue Stamp</span>
                          <span className="w-12 text-slate-500">: Tk.</span>
                          <span className="w-24 text-right font-mono">{viewingRecord.revStamp.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Net Payable Highlight */}
                      <div className="flex bg-[#f9cbbd] text-[#c0431b] px-3 py-2.5 font-extrabold text-xs border-t border-slate-300">
                        <span className="flex-1 text-right pr-4 uppercase tracking-wider">Net Payable</span>
                        <span className="w-12">: Tk.</span>
                        <span className="w-24 text-right font-mono text-sm">
                          {viewingRecord.netPayment.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details Breakdowns */}
                  <div className="space-y-5">
                    {/* Earn Leave Details */}
                    <div>
                      <h4 className="font-bold text-slate-500 italic mb-1.5 text-[11px]">
                        Earn Leave Details
                      </h4>
                      <div className="border border-slate-200 rounded overflow-hidden">
                        <table className="w-full text-[11px]">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                              <th className="text-left p-2">Type</th>
                              <th className="text-right p-2">Days</th>
                              <th className="text-right p-2">Rate</th>
                              <th className="text-right p-2">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-2 font-medium">EL Balance</td>
                              <td className="p-2 text-right font-mono">{viewingRecord.elDays.toFixed(2)}</td>
                              <td className="p-2 text-right font-mono">
                                {(viewingRecord.elDays > 0 ? viewingRecord.elAmt / viewingRecord.elDays : 0).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-mono font-semibold">{viewingRecord.elAmt.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="bg-slate-100 px-3 py-1.5 text-right font-bold border-t border-slate-200 text-slate-800">
                          Total Tk. {viewingRecord.elAmt.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Service Benefit Details */}
                    <div>
                      <h4 className="font-bold text-slate-500 italic mb-1.5 text-[11px]">
                        Service Benefit Details
                      </h4>
                      <div className="border border-slate-200 rounded overflow-hidden">
                        <table className="w-full text-[11px]">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                              <th className="text-left p-2">Service Period</th>
                              <th className="text-right p-2">Payable Days Per Year(SB)</th>
                              <th className="text-right p-2">Service Benefit (Total)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-2 font-medium">{viewingRecord.serviceLength}</td>
                              <td className="p-2 text-right font-mono">{viewingRecord.payableDaysPerYearSB.toFixed(0)}</td>
                              <td className="p-2 text-right font-mono font-semibold">{viewingRecord.serviceBenefit.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="bg-slate-100 px-3 py-1.5 text-right font-bold border-t border-slate-200 text-slate-800">
                          Total Tk. {viewingRecord.serviceBenefit.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Compensation Details */}
                    <div>
                      <h4 className="font-bold text-slate-500 italic mb-1.5 text-[11px]">
                        Compensation Details
                      </h4>
                      <div className="border border-slate-200 rounded overflow-hidden">
                        <table className="w-full text-[11px]">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                              <th className="text-left p-2">Compensation Remarks</th>
                              <th className="text-right p-2">Compensation Amt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-2 text-slate-600">{viewingRecord.compensationRemarks || "N/A"}</td>
                              <td className="p-2 text-right font-mono font-semibold">{viewingRecord.compensationAmt.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="bg-slate-100 px-3 py-1.5 text-right font-bold border-t border-slate-200 text-slate-800">
                          Total Tk. {viewingRecord.compensationAmt.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
