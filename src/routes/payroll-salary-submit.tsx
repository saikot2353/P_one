import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  Filter,
  CheckCircle2,
  Send,
  Download,
  Users,
  Banknote,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/payroll-salary-submit")({
  head: () => ({
    meta: [
      { title: "Salary Submit — CRIPTON HRIS" },
      {
        name: "description",
        content: "Monthly Salary Submission and Bulk Review Module.",
      },
    ],
  }),
  component: SalarySubmitPage,
});

export interface SalarySubmitRecord {
  sl: number;
  empId: string;
  empIdOff: string;
  name: string;
  empType: string;
  department: string;
  designation: string;
  totalPay: number;
  bankPay: number;
  cashPay: number;
  feedback: string;
  reviewComments: string;
  status: "Draft" | "Submitted";
}

const initialSalaryData: SalarySubmitRecord[] = [
  { sl: 1, empId: "2025058109", empIdOff: "", name: "Mohammad Methoun Ahmed", empType: "Office Executive", department: "Business Automation", designation: "Sr. Manager", totalPay: 128333, bankPay: 49583, cashPay: 78750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 2, empId: "2026058685", empIdOff: "", name: "Md Johirul Islam", empType: "Office Executive", department: "Business Automation", designation: "Executive", totalPay: 32750, bankPay: 30000, cashPay: 2750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 3, empId: "2022035599", empIdOff: "", name: "Dipon Saha", empType: "Office Executive", department: "Business Automation (HR)", designation: "Manager", totalPay: 67000, bankPay: 35545, cashPay: 31455, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 4, empId: "2024052333", empIdOff: "", name: "Mohammad Rahatul Islam", empType: "Office Executive", department: "Business Automation (HR)", designation: "Sr. Executive", totalPay: 45790, bankPay: 38220, cashPay: 7570, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 5, empId: "2024052410", empIdOff: "", name: "Dipan Kumar Kundu", empType: "Office Executive", department: "Business Automation (HR)", designation: "Sr. Executive", totalPay: 39750, bankPay: 32760, cashPay: 6990, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 6, empId: "2025057067", empIdOff: "", name: "Sunit Corneleous Sarker", empType: "Office Executive", department: "Business Automation (HR)", designation: "Executive", totalPay: 33050, bankPay: 30000, cashPay: 3050, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 7, empId: "2021028542", empIdOff: "", name: "Zakir Hossain", empType: "Office Executive", department: "Business Automation (HR)", designation: "Executive", totalPay: 28250, bankPay: 28250, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 8, empId: "2023044017", empIdOff: "", name: "Md. Rejaul Karim", empType: "Office Executive", department: "Business Automation (HR)", designation: "Deputy Manager", totalPay: 61750, bankPay: 40132, cashPay: 21618, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 9, empId: "2025055045", empIdOff: "", name: "Md. Mahfuzur Rahman", empType: "Office Executive", department: "Business Automation (HR)", designation: "Jr. Executive", totalPay: 20310, bankPay: 20310, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 10, empId: "2023044012", empIdOff: "", name: "Tanver Rahman Shaon", empType: "Office Executive", department: "Business Development", designation: "Deputy Manager", totalPay: 48333, bankPay: 45583, cashPay: 2750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 11, empId: "2025053377", empIdOff: "", name: "Md. Maruf Hossen", empType: "Office Executive", department: "Business Development", designation: "Asst. Manager", totalPay: 56750, bankPay: 38220, cashPay: 18530, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 12, empId: "2025053380", empIdOff: "", name: "Miraz Uddin", empType: "Office Executive", department: "Business Development", designation: "Jr. Executive", totalPay: 22750, bankPay: 22750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 13, empId: "2025054315", empIdOff: "", name: "Md. Shahinur Alahi Khan", empType: "Office Executive", department: "Business Development", designation: "Asst. Manager", totalPay: 58750, bankPay: 32760, cashPay: 25990, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 14, empId: "2023043909", empIdOff: "", name: "Md. Ashanur Kabir", empType: "Office Executive", department: "Business Development", designation: "Manager", totalPay: 75550, bankPay: 40132, cashPay: 35418, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 15, empId: "2024049326", empIdOff: "", name: "Hanif Uddin", empType: "Office Executive", department: "Business Innovation", designation: "Sr. Executive", totalPay: 37750, bankPay: 37750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 16, empId: "2026058726", empIdOff: "", name: "Parvej Mahmud", empType: "Office Executive", department: "Business Innovation", designation: "Executive", totalPay: 42850, bankPay: 31200, cashPay: 11650, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 17, empId: "2023043910", empIdOff: "", name: "Tahmid Afsar", empType: "Office Executive", department: "Business Innovation", designation: "Deputy Manager", totalPay: 61493, bankPay: 51583, cashPay: 9910, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 18, empId: "2025054609", empIdOff: "", name: "Md Mahir Shahriyar", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 31750, bankPay: 26000, cashPay: 5750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 19, empId: "2024049166", empIdOff: "", name: "MD Maimoon Hossain Shomoy", empType: "Office Executive", department: "Business Innovation", designation: "Sr. Executive", totalPay: 41750, bankPay: 32760, cashPay: 8990, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 20, empId: "2024051510", empIdOff: "", name: "Md. Sadmanur Islam Shishir", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 25750, bankPay: 25750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 21, empId: "2023044078", empIdOff: "", name: "Md. Anik Islam", empType: "Office Executive", department: "Business Innovation", designation: "Deputy Manager", totalPay: 72750, bankPay: 40132, cashPay: 32618, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 22, empId: "2025053125", empIdOff: "", name: "Al Riyad Karim", empType: "Office Executive", department: "Business Innovation", designation: "Sr. Executive", totalPay: 44750, bankPay: 36400, cashPay: 8350, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 23, empId: "2025054707", empIdOff: "", name: "Allama Bakhtiyar Nafis", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 23750, bankPay: 23750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 24, empId: "2025054710", empIdOff: "", name: "Raihan Jami Khan", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 23750, bankPay: 23750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 25, empId: "2026059418", empIdOff: "", name: "Md Robayet Hasan Yeasin", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 28750, bankPay: 28750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 26, empId: "2026059427", empIdOff: "", name: "Mir Md Moshiu Islam", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 23750, bankPay: 23750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 27, empId: "2026059573", empIdOff: "", name: "Md. Piyash Hasan", empType: "Office Executive", department: "Business Innovation", designation: "Executive", totalPay: 38750, bankPay: 26000, cashPay: 12750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 28, empId: "2026060310", empIdOff: "", name: "Md. Shahid Hasan", empType: "Office Executive", department: "Business Innovation", designation: "Sr. Executive", totalPay: 44750, bankPay: 31200, cashPay: 13550, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 29, empId: "2026060987", empIdOff: "", name: "Shahadath Hossain Tamim", empType: "Office Executive", department: "Business Innovation", designation: "Asst. Manager", totalPay: 103333, bankPay: 49583, cashPay: 53750, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 30, empId: "2026061086", empIdOff: "", name: "Md. Akash Sheikh", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 18750, bankPay: 18750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 31, empId: "2026061551", empIdOff: "", name: "Muksitul Islam", empType: "Office Executive", department: "Business Innovation", designation: "Jr. Executive", totalPay: 9052, bankPay: 9052, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 32, empId: "2024053060", empIdOff: "", name: "Md. Mahfujul Haque", empType: "Office Executive", department: "Core Development", designation: "Manager", totalPay: 86333, bankPay: 45083, cashPay: 41250, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 33, empId: "2024053062", empIdOff: "", name: "Mohammad Mayhedi Hasan", empType: "Office Executive", department: "Core Development", designation: "Deputy Manager", totalPay: 71270, bankPay: 38220, cashPay: 33050, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 34, empId: "2025053673", empIdOff: "", name: "Md Jahid Hasan Polok", empType: "Office Executive", department: "Core Development", designation: "Sr. Executive", totalPay: 44750, bankPay: 38220, cashPay: 6530, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 35, empId: "2025054614", empIdOff: "", name: "Md. Rana Miah", empType: "Office Executive", department: "Core Development", designation: "Sr. Executive", totalPay: 56750, bankPay: 32760, cashPay: 23990, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 36, empId: "2023043974", empIdOff: "", name: "Md. Anwar Hossain", empType: "Office Executive", department: "Core Development", designation: "Asst. Manager", totalPay: 50750, bankPay: 37128, cashPay: 13622, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 37, empId: "2024051507", empIdOff: "", name: "S.M Rakib Rahman Tuhin", empType: "Office Executive", department: "Core Development", designation: "Asst. Manager", totalPay: 67350, bankPay: 32760, cashPay: 34590, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 38, empId: "2024052335", empIdOff: "", name: "Md. Al Amin", empType: "Office Executive", department: "Core Development", designation: "Sr. Executive", totalPay: 48730, bankPay: 36400, cashPay: 12330, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 39, empId: "2025056560", empIdOff: "", name: "Md. Rafsan Kabir", empType: "Office Executive", department: "Core Development", designation: "Jr. Executive", totalPay: 18350, bankPay: 18350, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 40, empId: "2024046961", empIdOff: "", name: "Sumaya Siddika", empType: "Office Executive", department: "Core Development", designation: "Deputy Manager", totalPay: 66000, bankPay: 34398, cashPay: 31602, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 41, empId: "2025054548", empIdOff: "", name: "Md Rahat Hossain", empType: "Office Executive", department: "Database Administrator (DBA)", designation: "Asst. Manager", totalPay: 63070, bankPay: 38220, cashPay: 24850, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 42, empId: "2023046001", empIdOff: "", name: "Sohanur Rahman Sohan", empType: "Office Executive", department: "HR, Admin and Compliance", designation: "Executive", totalPay: 25750, bankPay: 25750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 43, empId: "2023043021", empIdOff: "", name: "Easin Mia", empType: "Office Executive", department: "HR, Admin and Compliance", designation: "Receptionist", totalPay: 17750, bankPay: 17750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 44, empId: "2026059411", empIdOff: "", name: "Jannatul Maowa", empType: "Office Executive", department: "HR, Admin and Compliance", designation: "Jr. Executive", totalPay: 18750, bankPay: 18750, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 45, empId: "2025057068", empIdOff: "", name: "Riazul Islam", empType: "Office Executive", department: "Implementation & Business Analysis", designation: "Asst. Manager", totalPay: 48750, bankPay: 36400, cashPay: 12350, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 46, empId: "2023045044", empIdOff: "", name: "Sultan Ahmed", empType: "Office Executive", department: "Implementation & Business Analysis", designation: "Sr. Manager", totalPay: 89272, bankPay: 73778, cashPay: 15494, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 47, empId: "2024051509", empIdOff: "", name: "Irfan Hossain", empType: "Office Executive", department: "Implementation & Business Analysis", designation: "Jr. Executive", totalPay: 26000, bankPay: 26000, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 48, empId: "2024051508", empIdOff: "", name: "Pabitra Khasnabish Druba", empType: "Office Executive", department: "Implementation & Business Analysis", designation: "Sr. Executive", totalPay: 50000, bankPay: 32760, cashPay: 17240, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 49, empId: "2023046544", empIdOff: "", name: "Mazharul Haque", empType: "Office Executive", department: "Implementation & Business Analysis", designation: "Deputy Manager", totalPay: 66750, bankPay: 40132, cashPay: 26618, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 50, empId: "2019013884", empIdOff: "2019013884", name: "Javed Mia", empType: "Office Staff", department: "HR, Admin and Compliance", designation: "Helper (Cook)", totalPay: 21200, bankPay: 21200, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 51, empId: "2025055747", empIdOff: "", name: "Sabbir Hossen Babu", empType: "Office Staff", department: "HR, Admin and Compliance", designation: "Office Boy", totalPay: 11500, bankPay: 11500, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 52, empId: "2025056473", empIdOff: "", name: "Hasnain", empType: "Office Staff", department: "HR, Admin and Compliance", designation: "Cleaner", totalPay: 12000, bankPay: 12000, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 53, empId: "2026059284", empIdOff: "", name: "Istiak Ahmed", empType: "Office Staff", department: "HR, Admin and Compliance", designation: "Office Boy", totalPay: 12000, bankPay: 12000, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 54, empId: "2022040132", empIdOff: "", name: "Md. Sakil", empType: "Office Staff", department: "HR, Admin and Compliance", designation: "Asst. Cook", totalPay: 13900, bankPay: 13900, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 55, empId: "2021022804", empIdOff: "", name: "Kaikobad Howlader", empType: "Worker", department: "HR, Admin and Compliance", designation: "Security Guard", totalPay: 15900, bankPay: 15900, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 56, empId: "2021023079", empIdOff: "", name: "Md. Monjur Alam", empType: "Worker", department: "HR, Admin and Compliance", designation: "Driver", totalPay: 25460, bankPay: 25460, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
  { sl: 57, empId: "2023045146", empIdOff: "", name: "Asif Hossain", empType: "Worker", department: "HR, Admin and Compliance", designation: "Driver", totalPay: 18590, bankPay: 18590, cashPay: 0, feedback: "", reviewComments: "", status: "Draft" },
];

function SalarySubmitPage() {
  // Top Filter State
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Aug");
  const [empTypeFilter, setEmpTypeFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  // Data Loading State (User clicks LOAD DATA / SEARCH to load)
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<SalarySubmitRecord[]>([]);

  // Selection & Table Search State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState("");
  const [viewingRecord, setViewingRecord] = useState<SalarySubmitRecord | null>(null);

  // Handle Load Data (SEARCH button click)
  const handleLoadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRecords(initialSalaryData);
      setIsLoaded(true);
      setIsLoading(false);
      setSelectedIds([]);
      toast.success(`Successfully loaded ${initialSalaryData.length} salary records for ${selectedMonth} ${selectedYear}!`);

      if (searchEmpId.trim()) {
        const query = searchEmpId.trim().toLowerCase();
        const found = initialSalaryData.find(
          (r) =>
            (idType === "System" && r.empId.toLowerCase().includes(query)) ||
            (idType === "Office" && r.empIdOff.toLowerCase().includes(query))
        );
        if (found) {
          setViewingRecord(found);
          toast.info(`Showing Attendance & Job Card details for ${found.name} (${found.empId})`);
        }
      }
    }, 300);
  };

  // Filtered Records based on Top Bar & Table Search
  const filteredRecords = useMemo(() => {
    if (!isLoaded) return [];
    return records.filter((r) => {
      if (empTypeFilter !== "ALL" && r.empType !== empTypeFilter) return false;
      if (deptFilter !== "ALL" && r.department !== deptFilter) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchEmpId.trim()) {
        const queryId = searchEmpId.trim().toLowerCase();
        if (idType === "System" && !r.empId.toLowerCase().includes(queryId)) return false;
        if (idType === "Office" && !r.empIdOff.toLowerCase().includes(queryId)) return false;
      }
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [isLoaded, records, empTypeFilter, deptFilter, statusFilter, searchEmpId, idType, tableSearch]);

  // Select All Checkbox
  const isAllSelected = useMemo(() => {
    if (filteredRecords.length === 0) return false;
    return filteredRecords.every((r) => selectedIds.includes(r.empId));
  }, [filteredRecords, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = filteredRecords.map((r) => r.empId);
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      const currentIds = filteredRecords.map((r) => r.empId);
      const newSet = new Set([...selectedIds, ...currentIds]);
      setSelectedIds(Array.from(newSet));
    }
  };

  const handleToggleSelectRow = (empId: string) => {
    setSelectedIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  // Feedback & Review Comments Update
  const handleUpdateRecordField = (empId: string, field: "feedback" | "reviewComments", value: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.empId === empId ? { ...r, [field]: value } : r))
    );
  };

  // Bulk Submit Selected Action
  const handleSubmitSelected = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one employee record to submit!");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.includes(r.empId) ? { ...r, status: "Submitted" } : r))
    );
    toast.success(`Successfully submitted ${selectedIds.length} salary records for ${selectedMonth} ${selectedYear}!`);
    setSelectedIds([]);
  };

  // Export CSV Action
  const handleExport = () => {
    if (filteredRecords.length === 0) {
      toast.error("No records available to export!");
      return;
    }
    const headers = [
      "SL",
      "Emp Id",
      "Emp ID(Off)",
      "Name",
      "Employee Type",
      "Department",
      "Designation",
      "Total Pay",
      "Bank Pay",
      "Cash Pay",
      "Feedback",
      "Review Comments",
      "Status",
    ];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      `"${r.empId}"`,
      `"${r.empIdOff}"`,
      `"${r.name}"`,
      `"${r.empType}"`,
      `"${r.department}"`,
      `"${r.designation}"`,
      r.totalPay,
      r.bankPay,
      r.cashPay,
      `"${r.feedback || ""}"`,
      `"${r.reviewComments || ""}"`,
      `"${r.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Salary_Submit_${selectedMonth}_${selectedYear}_${statusFilter}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredRecords.length} records (${statusFilter} filter) to CSV!`);
  };

  // Metrics
  const totalPaySum = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.totalPay, 0), [filteredRecords]);
  const bankPaySum = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.bankPay, 0), [filteredRecords]);
  const cashPaySum = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.cashPay, 0), [filteredRecords]);
  const submittedCount = useMemo(() => filteredRecords.filter((r) => r.status === "Submitted").length, [filteredRecords]);

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1650px] mx-auto w-full">
          {/* Header & Breadcrumb - Crisp Enterprise Design */}
          <div className="bg-white rounded-md border border-slate-300/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Payroll</span>
                <ChevronRight className="size-3" />
                <span className="text-blue-600 font-bold">Salary Submit</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
                <Banknote className="size-5 text-blue-600" />
                <span>Monthly Salary Submission & Review</span>
              </h1>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3">
              {isLoaded && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md border border-emerald-300 text-xs font-bold font-mono">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Submitted: {submittedCount} / {filteredRecords.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Filter Bar (Load Data Controls) - Clean & Compact */}
          <div className="bg-white rounded-md border border-slate-300/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Filter className="size-3.5 text-blue-600" />
                <span>Payroll Search & Selection Parameters</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Select criteria and click Search / Load Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Year */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Aug">August (Aug)</option>
                  <option value="Jul">July (Jul)</option>
                  <option value="Jun">June (Jun)</option>
                  <option value="Sep">September (Sep)</option>
                </select>
              </div>

              {/* Employee Type */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Employee Type
                </label>
                <select
                  value={empTypeFilter}
                  onChange={(e) => setEmpTypeFilter(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">ALL Employee Types</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Business Automation">Business Automation</option>
                  <option value="Business Automation (HR)">Business Automation (HR)</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Core Development">Core Development</option>
                  <option value="Database Administrator (DBA)">Database Administrator (DBA)</option>
                  <option value="HR, Admin and Compliance">HR, Admin and Compliance</option>
                  <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Section
                </label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">ALL Sections</option>
                  <option value="Software">Software</option>
                  <option value="Operations">Operations</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ALL">ALL Statuses</option>
                  <option value="Submitted">Submitted Only</option>
                  <option value="Draft">Not Submitted (Draft)</option>
                </select>
              </div>
            </div>

            {/* Employee ID Search & System / Office Radio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-60">
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Employee ID Search
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Employee ID..."
                    value={searchEmpId}
                    onChange={(e) => setSearchEmpId(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "System"}
                      onChange={() => setIdType("System")}
                      className="accent-blue-600"
                    />
                    System ID
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "Office"}
                      onChange={() => setIdType("Office")}
                      className="accent-blue-600"
                    />
                    Office ID
                  </label>
                </div>
              </div>

              {/* SEARCH / LOAD DATA Button */}
              <div className="pt-2 sm:pt-0">
                <button
                  onClick={handleLoadData}
                  disabled={isLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{isLoading ? "LOADING DATA..." : "SEARCH / LOAD DATA"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Salary Data Container */}
          {!isLoaded ? (
            /* Initial Prompt State */
            <div className="bg-white rounded-md border border-slate-300 p-10 text-center space-y-3 shadow-2xs">
              <div className="size-12 rounded-md bg-blue-50 text-blue-600 grid place-items-center mx-auto border border-blue-200">
                <Banknote className="size-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">No Salary Data Loaded Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Select your desired Year, Month, Department, and click <strong className="text-blue-600">"SEARCH / LOAD DATA"</strong> to view and submit monthly salary records.
                </p>
              </div>
              <button
                onClick={handleLoadData}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition cursor-pointer inline-flex items-center gap-2"
              >
                <Search className="size-3.5" />
                <span>Load Salary Data (Aug 2026)</span>
              </button>
            </div>
          ) : (
            /* Loaded Salary Data Table Container */
            <div className="space-y-3">
              {/* Summary Metrics Bar - Clean Enterprise Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-md border border-slate-300/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Loaded Staff</span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">{filteredRecords.length}</span>
                  </div>
                  <Users className="size-6 text-blue-600/80" />
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-300/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pay Sum</span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">৳{totalPaySum.toLocaleString()}</span>
                  </div>
                  <Banknote className="size-6 text-emerald-600/80" />
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-300/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bank Pay</span>
                    <span className="text-lg font-extrabold text-emerald-700 font-mono">৳{bankPaySum.toLocaleString()}</span>
                  </div>
                  <DollarSign className="size-6 text-emerald-600/80" />
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-300/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cash Pay</span>
                    <span className="text-lg font-extrabold text-amber-700 font-mono">৳{cashPaySum.toLocaleString()}</span>
                  </div>
                  <DollarSign className="size-6 text-amber-600/80" />
                </div>
              </div>

              {/* Table Action Header & Search */}
              <div className="bg-white rounded-md border border-slate-300/90 p-4 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Bulk Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleSubmitSelected}
                      disabled={selectedIds.length === 0}
                      className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="size-3.5" />
                      <span>SUBMIT SELECTED ({selectedIds.length})</span>
                    </button>

                    <button
                      onClick={handleExport}
                      className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      <span>EXPORT ({filteredRecords.length})</span>
                    </button>
                  </div>

                  {/* Right: Table Search */}
                  <div className="relative min-w-60">
                    <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter by name, ID, designation..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Salary Records Table - High Density Crisp Enterprise Table */}
                <div className="overflow-x-auto border border-slate-300 rounded-md">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase tracking-wider text-[10.5px]">
                        <th className="py-2.5 px-2.5 text-center w-9 border-r border-slate-200">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleToggleSelectAll}
                            className="size-3.5 accent-emerald-600 rounded-xs cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-2 text-center w-10 border-r border-slate-200">SL</th>
                        <th className="py-2.5 px-2.5 min-w-36 border-r border-slate-200">Feedback</th>
                        <th className="py-2.5 px-2.5 min-w-44 border-r border-slate-200">Review Comments</th>
                        <th className="py-2.5 px-2.5 border-r border-slate-200">Emp Id</th>
                        <th className="py-2.5 px-2.5 border-r border-slate-200">Emp ID(Off)</th>
                        <th className="py-2.5 px-2.5 min-w-44 border-r border-slate-200">Name</th>
                        <th className="py-2.5 px-2.5 border-r border-slate-200">Employee Type</th>
                        <th className="py-2.5 px-2.5 min-w-40 border-r border-slate-200">Department</th>
                        <th className="py-2.5 px-2.5 min-w-36 border-r border-slate-200">Designation</th>
                        <th className="py-2.5 px-2.5 text-right border-r border-slate-200">Total Pay</th>
                        <th className="py-2.5 px-2.5 text-right border-r border-slate-200">Bank Pay</th>
                        <th className="py-2.5 px-2.5 text-right border-r border-slate-200">Cash Pay</th>
                        <th className="py-2.5 px-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {filteredRecords.map((r, index) => {
                        const isSelected = selectedIds.includes(r.empId);
                        return (
                          <tr
                            key={r.empId}
                            className={`transition-colors ${
                              isSelected ? "bg-emerald-50/80" : "hover:bg-slate-50"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2 px-2.5 text-center border-r border-slate-200">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectRow(r.empId)}
                                className="size-3.5 accent-emerald-600 rounded-xs cursor-pointer"
                              />
                            </td>

                            {/* SL */}
                            <td className="py-2 px-2 text-center font-bold text-slate-500 font-mono border-r border-slate-200 text-[11px]">
                              {index + 1}
                            </td>

                            {/* Feedback Input with Magnifying Icon Button */}
                            <td className="py-1.5 px-2.5 border-r border-slate-200">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="Feedback..."
                                  value={r.feedback}
                                  onChange={(e) => handleUpdateRecordField(r.empId, "feedback", e.target.value)}
                                  className="w-full h-7 px-2 bg-white border border-slate-300 rounded-sm text-[11px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                                <button
                                  onClick={() => setViewingRecord(r)}
                                  title="View Record Details"
                                  className="size-7 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white grid place-items-center transition cursor-pointer shrink-0"
                                >
                                  <Search className="size-3" />
                                </button>
                              </div>
                            </td>

                            {/* Review Comments Input */}
                            <td className="py-1.5 px-2.5 border-r border-slate-200">
                              <input
                                type="text"
                                placeholder="Add comments..."
                                value={r.reviewComments}
                                onChange={(e) => handleUpdateRecordField(r.empId, "reviewComments", e.target.value)}
                                className="w-full h-7 px-2 bg-white border border-slate-300 rounded-sm text-[11px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                              />
                            </td>

                            {/* Emp Id */}
                            <td className="py-2 px-2.5 font-mono font-bold text-slate-800 border-r border-slate-200 text-[11px]">
                              {r.empId}
                            </td>

                            {/* Emp ID (Off) */}
                            <td className="py-2 px-2.5 font-mono text-slate-500 border-r border-slate-200 text-[11px]">
                              {r.empIdOff || "—"}
                            </td>

                            {/* Name */}
                            <td className="py-2 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-xs">
                              {r.name}
                            </td>

                            {/* Employee Type */}
                            <td className="py-2 px-2.5 border-r border-slate-200">
                              <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {r.empType}
                              </span>
                            </td>

                            {/* Department */}
                            <td className="py-2 px-2.5 text-slate-700 font-medium border-r border-slate-200 text-xs">
                              {r.department}
                            </td>

                            {/* Designation */}
                            <td className="py-2 px-2.5 text-slate-800 font-semibold border-r border-slate-200 text-xs">
                              {r.designation}
                            </td>

                            {/* Total Pay */}
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 border-r border-slate-200 text-xs">
                              {r.totalPay.toLocaleString()}
                            </td>

                            {/* Bank Pay */}
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-700 border-r border-slate-200 text-xs">
                              {r.bankPay.toLocaleString()}
                            </td>

                            {/* Cash Pay */}
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-amber-700 border-r border-slate-200 text-xs">
                              {r.cashPay.toLocaleString()}
                            </td>

                            {/* Status */}
                            <td className="py-2 px-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-xs text-[10px] font-extrabold ${
                                  r.status === "Submitted"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-600 border border-slate-300"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan={14} className="py-8 text-center text-xs font-bold text-slate-400">
                            No salary records match your active search filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employee Attendance Details Modal - Clean, Spacious & Uncluttered */}
        {viewingRecord && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden font-sans">
              {/* Clean Modal Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-blue-600 text-white grid place-items-center font-bold shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>Employee Attendance Log — {selectedMonth} {selectedYear}</span>
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {viewingRecord.name} • Emp ID: <span className="font-mono font-bold text-emerald-400">{viewingRecord.empId}</span> {viewingRecord.empIdOff ? `(Off: ${viewingRecord.empIdOff})` : ""} • {viewingRecord.designation} ({viewingRecord.department})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="size-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white grid place-items-center text-sm font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Simple Horizontal Attendance Summary Bar */}
              <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs font-semibold">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 font-bold">
                    Present: 24 Days
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-md border border-amber-300 font-bold">
                    Late: 2 Days
                  </span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-md border border-rose-300 font-bold">
                    Absent: 0 Days
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md border border-blue-300 font-bold">
                    Leave: 2 Days
                  </span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md border border-slate-300 font-bold">
                    Weekend: 5 Days
                  </span>
                </div>
                <div className="font-mono text-slate-600 font-bold text-xs">
                  Total Month Days: <span className="text-slate-900 font-extrabold">31 Days</span>
                </div>
              </div>

              {/* Spacious Scrollable Daily Attendance Table */}
              <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b-2 border-slate-300 uppercase tracking-wider text-[11px] sticky top-0 shadow-2xs">
                      <th className="py-2.5 px-3 border-r border-slate-200">Date</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Day</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">In Time</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Out Time</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Shift</th>
                      <th className="py-2.5 px-3 text-right border-r border-slate-200">Work Hours</th>
                      <th className="py-2.5 px-3 text-right border-r border-slate-200">OT Hours</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">Status</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {[
                      { date: "01/08/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "02/08/2026", day: "Sunday", in: "09:00 AM", out: "06:15 PM", shift: "General", work: "8.25", ot: "0.25", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "03/08/2026", day: "Monday", in: "09:14 AM", out: "06:30 PM", shift: "General", work: "8.25", ot: "0.25", status: "Late", statusColor: "bg-amber-100 text-amber-900 border-amber-300", remarks: "Late by 14 mins" },
                      { date: "04/08/2026", day: "Tuesday", in: "08:55 AM", out: "08:30 PM", shift: "General", work: "10.50", ot: "2.50", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "2.5 hrs Overtime" },
                      { date: "05/08/2026", day: "Wednesday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Casual Leave", statusColor: "bg-blue-100 text-blue-800 border-blue-300", remarks: "Leave Approved" },
                      { date: "06/08/2026", day: "Thursday", in: "09:02 AM", out: "06:05 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "07/08/2026", day: "Friday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "08/08/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "09/08/2026", day: "Sunday", in: "08:59 AM", out: "06:10 PM", shift: "General", work: "8.15", ot: "0.15", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "10/08/2026", day: "Monday", in: "09:00 AM", out: "07:00 PM", shift: "General", work: "9.00", ot: "1.00", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "1.0 hr Overtime" },
                      { date: "11/08/2026", day: "Tuesday", in: "09:10 AM", out: "06:00 PM", shift: "General", work: "7.83", ot: "0.0", status: "Late", statusColor: "bg-amber-100 text-amber-900 border-amber-300", remarks: "Late by 10 mins" },
                      { date: "12/08/2026", day: "Wednesday", in: "08:56 AM", out: "06:15 PM", shift: "General", work: "8.30", ot: "0.30", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "13/08/2026", day: "Thursday", in: "09:01 AM", out: "06:00 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "14/08/2026", day: "Friday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "15/08/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Holiday", statusColor: "bg-purple-100 text-purple-800 border-purple-300", remarks: "National Mourning Day" },
                      { date: "16/08/2026", day: "Sunday", in: "08:58 AM", out: "06:20 PM", shift: "General", work: "8.35", ot: "0.35", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "17/08/2026", day: "Monday", in: "09:00 AM", out: "06:05 PM", shift: "General", work: "8.08", ot: "0.08", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "18/08/2026", day: "Tuesday", in: "09:03 AM", out: "06:00 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "19/08/2026", day: "Wednesday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Sick Leave", statusColor: "bg-blue-100 text-blue-800 border-blue-300", remarks: "Medical Leave Approved" },
                      { date: "20/08/2026", day: "Thursday", in: "08:57 AM", out: "06:30 PM", shift: "General", work: "8.55", ot: "0.55", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "21/08/2026", day: "Friday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "22/08/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "23/08/2026", day: "Sunday", in: "09:00 AM", out: "06:15 PM", shift: "General", work: "8.25", ot: "0.25", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "24/08/2026", day: "Monday", in: "08:52 AM", out: "07:30 PM", shift: "General", work: "9.63", ot: "1.50", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "1.5 hrs Overtime" },
                      { date: "25/08/2026", day: "Tuesday", in: "08:58 AM", out: "06:00 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "26/08/2026", day: "Wednesday", in: "09:00 AM", out: "06:10 PM", shift: "General", work: "8.16", ot: "0.16", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "27/08/2026", day: "Thursday", in: "08:55 AM", out: "06:00 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "28/08/2026", day: "Friday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "29/08/2026", day: "Saturday", in: "—", out: "—", shift: "General", work: "0.0", ot: "0.0", status: "Weekend", statusColor: "bg-slate-100 text-slate-600 border-slate-300", remarks: "Weekly Off" },
                      { date: "30/08/2026", day: "Sunday", in: "08:59 AM", out: "06:15 PM", shift: "General", work: "8.25", ot: "0.25", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                      { date: "31/08/2026", day: "Monday", in: "09:00 AM", out: "06:00 PM", shift: "General", work: "8.0", ot: "0.0", status: "Present", statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300", remarks: "On Time" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-slate-800 border-r border-slate-200">
                          {row.date}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-600 border-r border-slate-200">
                          {row.day}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-700 border-r border-slate-200">
                          {row.in}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-700 border-r border-slate-200">
                          {row.out}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-200">
                          {row.shift}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                          {row.work} hrs
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 border-r border-slate-200">
                          {row.ot} hrs
                        </td>
                        <td className="py-2 px-3 text-center border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded-xs text-[10.5px] font-extrabold border ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-medium">
                          {row.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Clean Footer Bar */}
              <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Showing complete daily punch log for <strong className="text-slate-900">{viewingRecord.name}</strong> ({selectedMonth} {selectedYear})
                </span>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow-xs transition cursor-pointer"
                >
                  Close Attendance View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
