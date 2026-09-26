import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  FileDown,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hr-report-sim-requisition")({
  head: () => ({
    meta: [
      { title: "SIM Requisition Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View, analyze, and export SIM card requisitions, approved limits, and implementation status.",
      },
    ],
  }),
  component: SimRequisitionReportPage,
});

export interface SimRequisitionRecord {
  id: string;
  empId: string;
  name: string;
  cardNo: string;
  organization: string;
  department: string;
  designation: string;
  phone: string;
  issueStatus: "Implemented" | "Pending" | "Rejected";
  reqStatus: "Approved" | "Pending" | "Rejected";
  simNo: string;
  appLimit: number;
  requestFor: "New" | "Limit" | "Replacement" | "Cancellation";
  justification: string;
}

const SAMPLE_SIM_REQS: SimRequisitionRecord[] = [
  {
    id: "1",
    empId: "2014001017",
    name: "Md. Jamshed Alam",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Management",
    designation: "GM Operation",
    phone: "3120",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01787650914",
    appLimit: 300,
    requestFor: "New",
    justification: "Sir, Md. Jamshed Alam,Sir GM, Fabrics Dept. temporary using 01787650914 SIM for official use purpose.",
  },
  {
    id: "2",
    empId: "2014001111",
    name: "Md.Saeid Maruf",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Production Planning",
    designation: "AGM",
    phone: "311",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641322",
    appLimit: 800,
    requestFor: "Limit",
    justification: "As our overall capacity increased, we have increased our communication accordingly. Currently provided bill is not enough to communicate that's why need to increase my mobile bill.",
  },
  {
    id: "3",
    empId: "2014001111",
    name: "Md.Saeid Maruf",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Production Planning",
    designation: "AGM",
    phone: "311",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641322",
    appLimit: 1000,
    requestFor: "Limit",
    justification: "Limit is not fulfill the current requirement",
  },
  {
    id: "4",
    empId: "2014001182",
    name: "Md. Shamim",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Office Admin",
    designation: "Officer",
    phone: "null",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01777735396",
    appLimit: 500,
    requestFor: "Limit",
    justification: "official use purpose",
  },
  {
    id: "5",
    empId: "2015001027",
    name: "Md. Shafiul Alam",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "HR,Admin & Compliance",
    designation: "General Manager",
    phone: "1105",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "017777735406",
    appLimit: 0,
    requestFor: "Limit",
    justification: "For official Purpose",
  },
  {
    id: "6",
    empId: "2015001084",
    name: "Uddipan Madhu",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Marketing & Merchandising",
    designation: "Assistant Merchandiser",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01787650926",
    appLimit: 500,
    requestFor: "Limit",
    justification: "Office communication purpose.",
  },
  {
    id: "7",
    empId: "2015003129",
    name: "Md. Moylal",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Cutting",
    designation: "Officer",
    phone: "N/A",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "1324726749",
    appLimit: 200,
    requestFor: "New",
    justification: "Sir, Need SIM for official use purpose.",
  },
  {
    id: "8",
    empId: "2015003130",
    name: "Abdur Rashid",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Sample",
    designation: "Officer",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641355",
    appLimit: 200,
    requestFor: "New",
    justification: "Official Use purpose",
  },
  {
    id: "9",
    empId: "2015003488",
    name: "Md. Komol Hossain",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Human Resources",
    designation: "Assistant Manager",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641304",
    appLimit: 400,
    requestFor: "Limit",
    justification: "For Official Purpose",
  },
  {
    id: "10",
    empId: "2015003488",
    name: "Md. Komol Hossain",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Human Resources",
    designation: "Assistant Manager",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641304",
    appLimit: 500,
    requestFor: "Limit",
    justification: "Scope of work increased",
  },
  {
    id: "11",
    empId: "2015003497",
    name: "Md. Jahangir Alam",
    cardNo: "00000",
    organization: "Pakiza Knit Composite Ltd",
    department: "Chemical Store",
    designation: "Asst. Manager",
    phone: "N/A",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01787650936",
    appLimit: 400,
    requestFor: "Limit",
    justification: "For Official Purpose",
  },
  {
    id: "12",
    empId: "2015003509",
    name: "Md. Abedin Al Muzahid",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "General Store (MCD)",
    designation: "Deputy Manager",
    phone: "N/A",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01321175906",
    appLimit: 400,
    requestFor: "Limit",
    justification: "For Official Purpose",
  },
  {
    id: "13",
    empId: "2015003636",
    name: "Md. Labib Ahmed Badhon",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Dyeing Lab",
    designation: "Sr. Officer",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "1335121645",
    appLimit: 300,
    requestFor: "New",
    justification: "Contacting clients and internal teams",
  },
  {
    id: "14",
    empId: "2015004009",
    name: "Md. Arefin Islam",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Dyeing planning and Batch",
    designation: "Sr. Officer",
    phone: "null",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01787650941",
    appLimit: 500,
    requestFor: "Limit",
    justification: "For Official Purpose",
  },
  {
    id: "15",
    empId: "2015004955",
    name: "Md. Monirul Islam",
    cardNo: "null",
    organization: "Pakiza Knit Composite Ltd",
    department: "Maintenance Utility & Textile",
    designation: "Deputy Manager",
    phone: "n",
    issueStatus: "Implemented",
    reqStatus: "Approved",
    simNo: "01709641351",
    appLimit: 500,
    requestFor: "Limit",
    justification: "My official communication",
  },
];

const DEPARTMENTS = [
  "-- All Department --",
  "Accessories Store (Material Control Department)",
  "Accounts & Finance (Accounts & Finance)",
  "Admin (HR, Admin and Compliance)",
  "Admin and Compliance (Admin and Compliance)",
  "Chemical Store (Material Control Department)",
  "Cutting (RMG Operations)",
  "Dyeing Finishing (Fabrics Department)",
  "Dyeing Lab (Fabrics Department)",
  "Dyeing planning and Batch (Fabrics Department)",
  "Finishing (Finishing Department)",
  "General Store (Material Control Department)",
  "Human Resources (Human Resources)",
  "ICT (Information and Communication Technology)",
  "Knitting (Fabrics Department)",
  "Maintenance Utility & Textile (Maintenance )",
  "Management (Management)",
  "Marketing & Merchandising (Marketing and Merchandising)",
  "Production Planning (Production Planning)",
  "Sample (Sample)",
  "Security (Admin and Compliance)",
  "Sewing (RMG Operations)",
  "Welfare (Admin and Compliance)",
  "Yarn Store (Material Control Department)",
];

function SimRequisitionReportPage() {
  const [selectedDept, setSelectedDept] = useState("-- All Department --");
  const [tableSearch, setTableSearch] = useState("");

  const filteredData = useMemo(() => {
    return SAMPLE_SIM_REQS.filter((item) => {
      if (
        selectedDept !== "-- All Department --" &&
        !item.department.toLowerCase().includes(selectedDept.toLowerCase().split("(")[0].trim())
      ) {
        return false;
      }

      if (tableSearch.trim()) {
        const query = tableSearch.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchEmpId = item.empId.toLowerCase().includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchSim = item.simNo.toLowerCase().includes(query);
        const matchJust = item.justification.toLowerCase().includes(query);
        if (!matchName && !matchEmpId && !matchDept && !matchSim && !matchJust) return false;
      }

      return true;
    });
  }, [selectedDept, tableSearch]);

  // Total Approved Limit sum
  const totalLimitSum = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.appLimit, 0);
  }, [filteredData]);

  const handleReset = () => {
    setSelectedDept("-- All Department --");
    setTableSearch("");
    toast.info("Filters reset to default.");
  };

  const handleExportExcel = () => {
    const headers = [
      "Emp Id",
      "Name",
      "Card No",
      "Organization",
      "Department",
      "Designation",
      "Phone",
      "Issue Status",
      "Req. Status",
      "Sim No.",
      "App Limit",
      "Request For",
      "Justification",
    ];

    const rows = filteredData.map((r) => [
      r.empId,
      r.name,
      r.cardNo,
      r.organization,
      r.department,
      r.designation,
      r.phone,
      r.issueStatus,
      r.reqStatus,
      r.simNo,
      r.appLimit.toString(),
      r.requestFor,
      r.justification,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SIM_Requisition_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV export downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 md:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>HR</span>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              SIM Requisition Report
            </span>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-pink-50 dark:bg-pink-950/60 border border-pink-100 dark:border-pink-900/50 rounded-xl text-pink-600 dark:text-pink-400 shrink-0 mt-0.5">
                <Smartphone className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  SIM Requisition & Allowance Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track official company SIM card issues, approved monthly bill limits, justifications, and requisition status.
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4" />
                <span>EXCEL</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Printer className="size-4" />
                <span>PRINT</span>
              </button>
              <button
                onClick={() => toast.success("PDF summary generated!")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileText className="size-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Requisitions</span>
                <Users className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {filteredData.length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Implemented & Approved</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {filteredData.filter((d) => d.issueStatus === "Implemented").length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">New SIM Requests</span>
                <Smartphone className="size-4 text-sky-500" />
              </div>
              <div className="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">
                {filteredData.filter((d) => d.requestFor === "New").length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Approved Bill Limit (৳)</span>
                <DollarSign className="size-4 text-purple-500" />
              </div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                ৳{totalLimitSum.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Department Filter Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                <Search className="size-4" />
                <span>Filter Requisitions by Department</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filter</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5 text-xs">
              <div className="flex-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-slate-800 dark:text-slate-200"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => toast.success(`Filtered for ${selectedDept}`)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Search className="size-3.5" />
                <span>SEARCH</span>
              </button>
            </div>
          </div>

          {/* Data Table Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Table Search Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Showing SIM requisition records:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold uppercase">
                  {selectedDept}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search Name, Emp ID, SIM No..."
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            {/* Table with Light Pink Header */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#fde2e4] dark:bg-pink-950/80 text-pink-950 dark:text-pink-200 uppercase tracking-wider font-bold border-b border-pink-200 dark:border-pink-900">
                  <tr>
                    <th className="p-3">Emp Id</th>
                    <th className="p-3">Name</th>
                    <th className="p-3 text-center">Card No</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3 text-center">Phone</th>
                    <th className="p-3 text-center">Issue Status</th>
                    <th className="p-3 text-center">Req. Status</th>
                    <th className="p-3 font-mono">Sim No.</th>
                    <th className="p-3 text-right">App Limit</th>
                    <th className="p-3 text-center">Request For</th>
                    <th className="p-3 max-w-[280px]">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.empId}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400">
                          {row.cardNo}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {row.organization}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {row.designation}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {row.phone}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {row.issueStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {row.reqStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.simNo}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-purple-600 dark:text-purple-400">
                          ৳{row.appLimit}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              row.requestFor === "New"
                                ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {row.requestFor}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[280px]" title={row.justification}>
                          {row.justification}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No SIM requisition records found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Footer Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing 1 to {filteredData.length} of {filteredData.length} entries
                </span>
                <button
                  onClick={() => toast.success("Downloading SIM Requisition PDF Report...")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <FileDown className="size-3.5" />
                  <span>VIEW(PDF)</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold">
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg bg-pink-600 text-white font-bold">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
