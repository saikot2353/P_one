import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  Filter,
  Coins,
  ShieldCheck,
  CalendarDays,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/maternity-payment-report")({
  head: () => ({
    meta: [
      { title: "Maternity Payment Report — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Comprehensive maternity leave benefit payment statement report across departments, sections, and disbursement phases.",
      },
    ],
  }),
  component: MaternityPaymentReportPage,
});

export interface MaternityReportRecord {
  sl: number;
  empId: string;
  empName: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  grade: string;
  unit: string;
  line: string;
  joiningDate: string;
  firstMlPaymentDate: string;
  firstPaymentAmount: number;
  secondMlPaymentDate: string;
  secondPaymentAmount: number;
}

const initialMaternityReportRecords: MaternityReportRecord[] = [
  {
    sl: 1,
    empId: "2016005394",
    empName: "Mrs. Nasima Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Printing",
    designation: "Jr. Layer Man",
    grade: "A3",
    unit: "N/A",
    line: "N/A",
    joiningDate: "20/11/2016",
    firstMlPaymentDate: "01/01/2026",
    firstPaymentAmount: 35000,
    secondMlPaymentDate: "20/04/2026",
    secondPaymentAmount: 35000,
  },
  {
    sl: 2,
    empId: "2018012283",
    empName: "Mrs. Ranu Khatun",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-05",
    line: "02",
    joiningDate: "01/09/2018",
    firstMlPaymentDate: "15/08/2025",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "10/12/2025",
    secondPaymentAmount: 36088,
  },
  {
    sl: 3,
    empId: "2019016180",
    empName: "Mst. Tania Begum",
    empType: "Worker",
    department: "Quality Assurance Department",
    section: "Sewing Quality",
    designation: "Sr. Quality Inspector",
    grade: "A1",
    unit: "Unit-06",
    line: "N/A",
    joiningDate: "01/10/2019",
    firstMlPaymentDate: "10/05/2025",
    firstPaymentAmount: 34595,
    secondMlPaymentDate: "01/09/2025",
    secondPaymentAmount: 34595,
  },
  {
    sl: 4,
    empId: "2019016529",
    empName: "Mst. Anfa Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-05",
    line: "17",
    joiningDate: "15/10/2019",
    firstMlPaymentDate: "02/02/2026",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "25/05/2026",
    secondPaymentAmount: 36088,
  },
  {
    sl: 5,
    empId: "2019017405",
    empName: "Mst. Emali Khatun",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-05",
    line: "16",
    joiningDate: "10/12/2019",
    firstMlPaymentDate: "12/03/2026",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "05/07/2026",
    secondPaymentAmount: 36088,
  },
  {
    sl: 6,
    empId: "2020017714",
    empName: "Mst. Shampa Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Operator (Sewing)",
    grade: "A2",
    unit: "Unit-05",
    line: "24",
    joiningDate: "01/01/2020",
    firstMlPaymentDate: "14/01/2026",
    firstPaymentAmount: 33034,
    secondMlPaymentDate: "10/04/2026",
    secondPaymentAmount: 33034,
  },
  {
    sl: 7,
    empId: "2020017803",
    empName: "Mohua Khatun",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Operator (Sewing)",
    grade: "A2",
    unit: "Unit-05",
    line: "18",
    joiningDate: "07/01/2020",
    firstMlPaymentDate: "05/09/2025",
    firstPaymentAmount: 35393,
    secondMlPaymentDate: "01/01/2026",
    secondPaymentAmount: 35393,
  },
  {
    sl: 8,
    empId: "2020019356",
    empName: "Mrs. Jasmin",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-05",
    line: "02",
    joiningDate: "12/08/2020",
    firstMlPaymentDate: "08/01/2025",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "24/04/2025",
    secondPaymentAmount: 36088,
  },
  {
    sl: 9,
    empId: "2020019938",
    empName: "Mst. Kona Akter",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-06",
    line: "31",
    joiningDate: "08/09/2020",
    firstMlPaymentDate: "02/05/2025",
    firstPaymentAmount: 33575,
    secondMlPaymentDate: "20/08/2025",
    secondPaymentAmount: 33575,
  },
  {
    sl: 10,
    empId: "2020020668",
    empName: "Mst. Laily Khatun",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-06",
    line: "35",
    joiningDate: "13/10/2020",
    firstMlPaymentDate: "11/11/2025",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "05/03/2026",
    secondPaymentAmount: 36088,
  },
  {
    sl: 11,
    empId: "2020021669",
    empName: "Josna Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-05",
    line: "04",
    joiningDate: "01/12/2020",
    firstMlPaymentDate: "24/01/2026",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "20/05/2026",
    secondPaymentAmount: 36088,
  },
  {
    sl: 12,
    empId: "2020021685",
    empName: "Mrs. Aklima",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    grade: "A3",
    unit: "Unit-06",
    line: "29",
    joiningDate: "02/12/2020",
    firstMlPaymentDate: "04/01/2026",
    firstPaymentAmount: 36088,
    secondMlPaymentDate: "30/04/2026",
    secondPaymentAmount: 36088,
  },
  {
    sl: 13,
    empId: "2020021853",
    empName: "Rikta Begum",
    empType: "Worker",
    department: "Admin and Compliance",
    section: "House Keeping",
    designation: "Cleaner",
    grade: "B4",
    unit: "Unit-08",
    line: "N/A",
    joiningDate: "03/12/2020",
    firstMlPaymentDate: "08/10/2025",
    firstPaymentAmount: 31138,
    secondMlPaymentDate: "01/02/2026",
    secondPaymentAmount: 31138,
  },
  {
    sl: 14,
    empId: "2021022920",
    empName: "Mrs. Nurmina",
    empType: "Worker",
    department: "RMG Operations",
    section: "Printing",
    designation: "Helper",
    grade: "A4",
    unit: "N/A",
    line: "N/A",
    joiningDate: "18/01/2021",
    firstMlPaymentDate: "01/10/2025",
    firstPaymentAmount: 30003,
    secondMlPaymentDate: "20/01/2026",
    secondPaymentAmount: 30003,
  },
  {
    sl: 15,
    empId: "2021023108",
    empName: "Mst. Nurjahan Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Operator (Sewing)",
    grade: "A2",
    unit: "Unit-05",
    line: "09",
    joiningDate: "01/02/2021",
    firstMlPaymentDate: "02/09/2025",
    firstPaymentAmount: 33249,
    secondMlPaymentDate: "31/12/2025",
    secondPaymentAmount: 33249,
  },
  {
    sl: 16,
    empId: "2021023791",
    empName: "Mst. Rashida Khatun",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Helper",
    grade: "A4",
    unit: "Unit-05",
    line: "05",
    joiningDate: "11/03/2021",
    firstMlPaymentDate: "07/08/2024",
    firstPaymentAmount: 29088,
    secondMlPaymentDate: "15/12/2024",
    secondPaymentAmount: 29088,
  },
  {
    sl: 17,
    empId: "2021023990",
    empName: "Rajiya Akter",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Folding Man",
    grade: "A2",
    unit: "Unit-05",
    line: "N/A",
    joiningDate: "03/04/2021",
    firstMlPaymentDate: "15/06/2025",
    firstPaymentAmount: 34595,
    secondMlPaymentDate: "01/10/2025",
    secondPaymentAmount: 34595,
  },
  {
    sl: 18,
    empId: "2021024240",
    empName: "Mst. Sriti Akter",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Helper",
    grade: "A4",
    unit: "Unit-06",
    line: "34",
    joiningDate: "20/04/2021",
    firstMlPaymentDate: "04/09/2025",
    firstPaymentAmount: 33210,
    secondMlPaymentDate: "22/12/2025",
    secondPaymentAmount: 33210,
  },
  {
    sl: 19,
    empId: "2021026107",
    empName: "Mrs. Laily Khatun",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Poly Man",
    grade: "A2",
    unit: "Unit-08",
    line: "N/A",
    joiningDate: "04/08/2021",
    firstMlPaymentDate: "18/02/2026",
    firstPaymentAmount: 34595,
    secondMlPaymentDate: "10/06/2026",
    secondPaymentAmount: 34595,
  },
  {
    sl: 20,
    empId: "2021026595",
    empName: "Tania Akter Sanjida",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Folding Man",
    grade: "A2",
    unit: "Unit-05",
    line: "N/A",
    joiningDate: "14/08/2021",
    firstMlPaymentDate: "01/11/2025",
    firstPaymentAmount: 34595,
    secondMlPaymentDate: "20/02/2026",
    secondPaymentAmount: 34595,
  },
];

function MaternityPaymentReportPage() {
  // Filter States (matching screenshot)
  const [dateFrom, setDateFrom] = useState("2025-08-01");
  const [dateTo, setDateTo] = useState("2026-08-31");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Dataset
  const [records] = useState<MaternityReportRecord[]>(initialMaternityReportRecords);

  // Filtered dataset logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDept = selectedDept === "All Departments" || r.department === selectedDept;
      const matchSec = selectedSection === "ALL" || r.section === selectedSection;
      const matchEmpId = !empIdInput.trim() || r.empId.includes(empIdInput.trim());

      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        r.empId.toLowerCase().includes(query) ||
        r.empName.toLowerCase().includes(query) ||
        r.department.toLowerCase().includes(query) ||
        r.section.toLowerCase().includes(query) ||
        r.designation.toLowerCase().includes(query);

      return matchDept && matchSec && matchEmpId && matchSearch;
    });
  }, [records, selectedDept, selectedSection, empIdInput, searchTerm]);

  // Metrics calculation
  const totalFirstPayment = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.firstPaymentAmount || 0), 0);
  }, [filteredRecords]);

  const totalSecondPayment = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.secondPaymentAmount || 0), 0);
  }, [filteredRecords]);

  const grandTotalBenefit = useMemo(() => {
    return totalFirstPayment + totalSecondPayment;
  }, [totalFirstPayment, totalSecondPayment]);

  // Export Excel CSV
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp Id",
      "Employee Name",
      "Employee Type",
      "Department",
      "Section",
      "Designation",
      "Grade",
      "Unit",
      "Line",
      "Joining Date",
      "1st ML Payment Date",
      "1st Payment Amount",
      "2nd ML Payment Date",
      "2nd Payment Amount",
    ];

    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      r.empId,
      r.empName,
      r.empType,
      r.department,
      r.section,
      r.designation,
      r.grade,
      r.unit,
      r.line,
      r.joiningDate,
      r.firstMlPaymentDate,
      r.firstPaymentAmount,
      r.secondMlPaymentDate,
      r.secondPaymentAmount,
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
    link.href = url;
    link.download = `Maternity_Payment_Report_${dateFrom}_${dateTo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Breadcrumb Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Leave</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Maternity Payment Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={14} /> Statement Report (81 Total Entries)
            </span>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Top Filter Bar Card (Exact match of reference screenshot header) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs items-end">
              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="RMG Operations">RMG Operations</option>
                  <option value="Finishing Department">Finishing Department</option>
                  <option value="Quality Assurance Department">Quality Assurance Department</option>
                  <option value="Admin and Compliance">Admin and Compliance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="ALL">ALL</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Printing">Printing</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Sewing Quality">Sewing Quality</option>
                  <option value="House Keeping">House Keeping</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">EmpId</label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="e.g. 2016005394"
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="h-8 px-6 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
              >
                <Search size={13} />
                SEARCH
              </button>
            </div>

            {/* Action Bar (EXCEL, PRINT, PDF, Search Box) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  EXCEL
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-600" />
                  PRINT
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileDown size={14} className="text-rose-600" />
                  PDF
                </button>
              </div>

              {/* Real-time search box */}
              <div className="flex items-center gap-2 text-xs">
                <label className="text-slate-500 font-medium">Search:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in report table..."
                  className="h-8 px-2.5 w-64 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Coins size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Total 1st Installments</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  ৳{totalFirstPayment.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <Coins size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Total 2nd Installments</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  ৳{totalSecondPayment.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Coins size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Grand Total Disbursed</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{grandTotalBenefit.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Users size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Beneficiaries</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {filteredRecords.length} Staff Members
                </div>
              </div>
            </div>
          </div>

          {/* Main Report Table (Exact layout of reference screenshot) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1600px]">
                <thead>
                  <tr className="bg-[#bce0fd] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-slate-300 dark:border-slate-700 font-bold">
                    <th className="py-2.5 px-3 text-center w-12">SL</th>
                    <th className="py-2.5 px-3">Emp Id</th>
                    <th className="py-2.5 px-3">Employee Name</th>
                    <th className="py-2.5 px-3">Employee Type</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Line</th>
                    <th className="py-2.5 px-3">Joining Date</th>
                    <th className="py-2.5 px-3 text-blue-900 dark:text-blue-300">1st ML Payment Date</th>
                    <th className="py-2.5 px-3 text-right text-blue-900 dark:text-blue-300">1st Payment Amount</th>
                    <th className="py-2.5 px-3 text-rose-900 dark:text-rose-300">2nd ML Payment Date</th>
                    <th className="py-2.5 px-3 text-right text-rose-900 dark:text-rose-300">2nd Payment Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((r, idx) => (
                    <tr
                      key={r.empId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {r.empId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {r.empName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.empType}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.department}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.section}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.designation}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-600 dark:text-slate-400">
                        {r.grade}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.unit}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.line}</td>
                      <td className="py-2.5 px-3">{r.joiningDate}</td>
                      <td className="py-2.5 px-3 font-medium text-blue-700 dark:text-blue-400">
                        {r.firstMlPaymentDate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-800 dark:text-blue-300">
                        {r.firstPaymentAmount ? r.firstPaymentAmount.toLocaleString() : ""}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-rose-700 dark:text-rose-400">
                        {r.secondMlPaymentDate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-800 dark:text-rose-300">
                        {r.secondPaymentAmount ? r.secondPaymentAmount.toLocaleString() : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Matching screenshot footer) */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
              <div>Showing 1 to 20 of 81 entries</div>
              <div className="flex items-center gap-1 font-medium">
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  Previous
                </button>
                <button className="px-2.5 py-1 rounded border border-blue-500 bg-blue-500 text-white font-bold">
                  1
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  2
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  3
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  4
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  5
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
