import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Printer,
  FileDown,
  AlertCircle,
  Search,
  Trash2,
  Calendar,
  FileText,
  UserCheck,
  Users,
  Copy,
  Send,
  Award,
  FileCheck2,
  Info,
  Plus,
  FolderOpen,
  Activity,
  Undo2,
  X,
} from "lucide-react";

interface SearchParams {
  tab?: string;
}

export const Route = createFileRoute("/transfer-control-center")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab: (search.tab as string) || "history",
    };
  },
  head: () => ({
    meta: [
      { title: "Transfer Control Center — CRIPTON" },
      {
        name: "description",
        content: "Corporate employee transfer, posting, and letter dispatch system.",
      },
    ],
  }),
  component: TransferControlCenterPage,
});

// Employee Mock Data
interface Employee {
  id: string;
  name: string;
  company: string;
  area: string;
  dept: string;
  designation: string;
  employeeType: string;
  grade: string;
  unit: string;
  line: string;
  shift: string;
}

const mockEmployees: Employee[] = [
  {
    id: "2023046001",
    name: "Sohanur Rahman Sohan",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "HR & Admin",
    designation: "Jr. Executive",
    employeeType: "Office Executive",
    grade: "None",
    unit: "N/A",
    line: "0",
    shift: "General Shift",
  },
  {
    id: "2022040132",
    name: "Md. Sakil",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Admin",
    designation: "Asst. Cook",
    employeeType: "Office Staff",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "Exe-Ptvl",
  },
  {
    id: "2021022804",
    name: "Kaikobad Howlader",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Admin",
    designation: "Security Guard",
    employeeType: "Worker",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "Exe-Ptvl",
  },
  {
    id: "2019013884",
    name: "Javed Mia",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Admin",
    designation: "Helper (Cook)",
    employeeType: "Office Staff",
    grade: "None",
    unit: "N/A",
    line: "N/A",
    shift: "Exe-Ptvl",
  },
  {
    id: "2023044501",
    name: "Anik Saha",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Business Development (BA)",
    designation: "Sr. Executive",
    employeeType: "Office Executive",
    grade: "None",
    unit: "N/A",
    line: "N/A",
    shift: "General-Exec",
  },
  {
    id: "2023043021",
    name: "Easin Mia",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Admin",
    designation: "Receptionist",
    employeeType: "Office Executive",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "Exe-Ptvl",
  },
  {
    id: "2023043577",
    name: "Md. Mostakim Shah",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Admin",
    designation: "Office Boy",
    employeeType: "Office Staff",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "Exe-Ptvl",
  },
  {
    id: "2023043921",
    name: "Ariful Hasan",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Business Development (BA)",
    designation: "Jr. Executive",
    employeeType: "Office Executive",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "General Shift",
  },
  {
    id: "2023043019",
    name: "Shafin Mukhlesy",
    company: "Pakiza Software Limited",
    area: "PSL-Operation",
    dept: "Business Automation",
    designation: "Executive",
    employeeType: "Office Executive",
    grade: "None",
    unit: "PTVL",
    line: "N/A",
    shift: "General Shift",
  },
];

interface TransferLog {
  id: string;
  empId: string;
  name: string;
  transferDate: string;
  oldCompany: string;
  oldArea: string;
  oldDept: string;
  oldDesignation: string;
  oldEmployeeType: string;
  oldGrade: string;
  oldUnit: string;
  oldLine: string;
  oldShift: string;
  newCompany: string;
  newArea: string;
  newDept: string;
  newDesignation: string;
  newEmployeeType: string;
  newGrade: string;
  newUnit: string;
  newLine: string;
  newShift: string;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

const mockTransferLogs: TransferLog[] = [
  {
    id: "TR-101",
    empId: "2023046001",
    name: "Sohanur Rahman Sohan",
    transferDate: "2026-06-22",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "HR & Admin",
    oldDesignation: "Jr. Executive",
    oldEmployeeType: "Office Executive",
    oldGrade: "None",
    oldUnit: "N/A",
    oldLine: "0",
    oldShift: "General Shift",
    newCompany: "Pakiza Technovation Limited",
    newArea: "PSL-Operation",
    newDept: "HR & Admin",
    newDesignation: "Jr. Executive",
    newEmployeeType: "Office Executive",
    newGrade: "None",
    newUnit: "N/A",
    newLine: "0",
    newShift: "General Shift",
    status: "Pending",
    reason: "Group Shared Services restructuring",
  },
  {
    id: "TR-102",
    empId: "2023046001",
    name: "Sohanur Rahman Sohan",
    transferDate: "2026-05-04",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "HR & Admin",
    oldDesignation: "Jr. Executive",
    oldEmployeeType: "Office Executive",
    oldGrade: "None",
    oldUnit: "N/A",
    oldLine: "N/A",
    oldShift: "General Shift",
    newCompany: "Pakiza Technovation Limited",
    newArea: "PSL-Operation",
    newDept: "HR & Admin",
    newDesignation: "Jr. Executive",
    newEmployeeType: "Office Executive",
    newGrade: "None",
    newUnit: "N/A",
    newLine: "N/A",
    newShift: "General Shift",
    status: "Approved",
    reason: "Promoted to Technovation Team",
  },
  {
    id: "TR-103",
    empId: "2022040132",
    name: "Md. Sakil",
    transferDate: "2026-03-24",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "Admin",
    oldDesignation: "Asst. Cook",
    oldEmployeeType: "Office Staff",
    oldGrade: "None",
    oldUnit: "PTVL",
    oldLine: "N/A",
    oldShift: "Exe-Ptvl",
    newCompany: "Pakiza Software Limited",
    newArea: "PSL-Operation",
    newDept: "Admin",
    newDesignation: "Asst. Cook",
    newEmployeeType: "Office Staff",
    newGrade: "None",
    newUnit: "PTVL",
    newLine: "N/A",
    newShift: "Exe-Ptvl",
    status: "Approved",
    reason: "General relocation order",
  },
  {
    id: "TR-104",
    empId: "2021022804",
    name: "Kaikobad Howlader",
    transferDate: "2025-10-24",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "Admin",
    oldDesignation: "Security Guard",
    oldEmployeeType: "Worker",
    oldGrade: "None",
    oldUnit: "PTVL",
    oldLine: "N/A",
    oldShift: "Exe-Ptvl",
    newCompany: "Pakiza Software Limited",
    newArea: "PSL-Operation",
    newDept: "Admin",
    newDesignation: "Security Guard",
    newEmployeeType: "Worker",
    newGrade: "None",
    newUnit: "PTVL",
    newLine: "N/A",
    newShift: "Exe-Ptvl",
    status: "Approved",
    reason: "Security division shift rotation",
  },
  {
    id: "TR-105",
    empId: "2019013884",
    name: "Javed Mia",
    transferDate: "2025-07-10",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "Admin",
    oldDesignation: "Helper (Cook)",
    oldEmployeeType: "Office Staff",
    oldGrade: "None",
    oldUnit: "N/A",
    oldLine: "N/A",
    oldShift: "Exe-Ptvl",
    newCompany: "Pakiza Software Limited",
    newArea: "PSL-Operation",
    newDept: "Admin",
    newDesignation: "Helper (Cook)",
    newEmployeeType: "Office Staff",
    newGrade: "None",
    newUnit: "N/A",
    newLine: "N/A",
    newShift: "Exe-Ptvl",
    status: "Approved",
    reason: "Annual roster adjustment",
  },
  {
    id: "TR-106",
    empId: "2023044501",
    name: "Anik Saha",
    transferDate: "2026-06-04",
    oldCompany: "Pakiza Software Limited",
    oldArea: "PSL-Operation",
    oldDept: "Business Development (BA)",
    oldDesignation: "Sr. Executive",
    oldEmployeeType: "Office Executive",
    oldGrade: "None",
    oldUnit: "N/A",
    oldLine: "N/A",
    oldShift: "General-Exec",
    newCompany: "Pakiza Software Limited",
    newArea: "PTVL-Operation",
    newDept: "Business Development (BA)",
    newDesignation: "Sr. Executive",
    newEmployeeType: "Office Executive",
    newGrade: "None",
    newUnit: "N/A",
    newLine: "N/A",
    newShift: "General-Exec",
    status: "Approved",
    reason: "BD strategic alignment",
  },
  {
    id: "TR-107",
    empId: "2023044501",
    name: "Anik Saha",
    transferDate: "2026-06-04",
    oldCompany: "Pakiza Technovation Limited",
    oldArea: "PTVL-Operation",
    oldDept: "Business Development (BA)",
    oldDesignation: "Sr. Executive",
    oldEmployeeType: "Office Executive",
    oldGrade: "None",
    oldUnit: "N/A",
    oldLine: "N/A",
    oldShift: "General-Exec",
    newCompany: "Pakiza Software Limited",
    newArea: "PTVL-Operation",
    newDept: "Business Development (BA)",
    newDesignation: "Sr. Executive",
    newEmployeeType: "Office Executive",
    newGrade: "None",
    newUnit: "N/A",
    newLine: "N/A",
    newShift: "General-Exec",
    status: "Rejected",
    reason: "MD vetoed due to active project dependencies",
  },
];

const availableCompanies = [
  "Pakiza Software Limited",
  "Pakiza Knit Composite Ltd",
  "Pakiza Technovation Limited",
  "Pakiza Group",
];
const availableAreas = ["PSL-Operation", "PTVL-Operation", "Dhaka HQ"];
const availableDept = [
  "HR & Admin",
  "Admin",
  "Business Development (BA)",
  "Business Automation",
  "Finance & Accounts",
];
const availableDesignations = [
  "Jr. Executive",
  "Executive",
  "Sr. Executive",
  "Asst. Manager",
  "Manager",
  "Sr. Manager",
  "Asst. Cook",
  "Helper (Cook)",
  "Security Guard",
  "Receptionist",
  "Office Boy",
  "Driver",
];
const availableEmpTypes = ["Office Executive", "Office Staff", "Worker", "Management"];
const availableGrades = ["None", "Grade A", "Grade B", "Grade C", "Grade D"];
const availableUnits = ["N/A", "PSL", "PTVL", "HQ"];
const availableLines = ["N/A", "0", "1", "2", "3", "5"];
const availableShifts = [
  "General Shift",
  "Morning Shift",
  "Day Shift",
  "Night Shift",
  "Evening Shift",
  "Exe-Ptvl",
  "General-Transport",
];

function TransferControlCenterPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/transfer-control-center" });
  const currentTab = search.tab || "history";

  const [employees] = useState<Employee[]>(mockEmployees);
  const [logs, setLogs] = useState<TransferLog[]>(mockTransferLogs);

  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [transferDate, setTransferDate] = useState("2026-06-21");
  const [transferReason, setTransferReason] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newEmpType, setNewEmpType] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newShift, setNewShift] = useState("");

  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterArea, setFilterArea] = useState("ALL");
  const [filterDeptVal, setFilterDeptVal] = useState("ALL");
  const [filterStatusVal, setFilterStatusVal] = useState("ALL");
  const [filterGeneralSearch, setFilterGeneralSearch] = useState("");

  const [selectedLetterLog, setSelectedLetterLog] = useState<TransferLog | null>(null);
  const [letterSubject, setLetterSubject] = useState("Letter of Posting and Transfer");
  const [letterRefNo, setLetterRefNo] = useState("");
  const [letterBody, setLetterBody] = useState("");
  const [letterSignatory, setLetterSignatory] = useState("Group HR Director");

  const autocompleteResults = useMemo(() => {
    if (!empSearchQuery.trim()) return [];
    return employees
      .filter(
        (e) =>
          e.name.toLowerCase().includes(empSearchQuery.toLowerCase()) ||
          e.id.includes(empSearchQuery),
      )
      .slice(0, 5);
  }, [employees, empSearchQuery]);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmp(emp);
    setEmpSearchQuery(`${emp.name} (${emp.id})`);
    setShowAutocomplete(false);
    setNewCompany(emp.company);
    setNewArea(emp.area);
    setNewDept(emp.dept);
    setNewDesignation(emp.designation);
    setNewEmpType(emp.employeeType);
    setNewGrade(emp.grade);
    setNewUnit(emp.unit);
    setNewLine(emp.line);
    setNewShift(emp.shift);
  };

  const handleCopyProfile = () => {
    if (!selectedEmp) return;
    setNewCompany(selectedEmp.company);
    setNewArea(selectedEmp.area);
    setNewDept(selectedEmp.dept);
    setNewDesignation(selectedEmp.designation);
    setNewEmpType(selectedEmp.employeeType);
    setNewGrade(selectedEmp.grade);
    setNewUnit(selectedEmp.unit);
    setNewLine(selectedEmp.line);
    setNewShift(selectedEmp.shift);
    toast.success("Current profile configuration copied to proposal form!");
  };

  const handleNewTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) {
      toast.error("Please search and select an employee first!");
      return;
    }
    const newLogEntry: TransferLog = {
      id: `TR-${Date.now()}`,
      empId: selectedEmp.id,
      name: selectedEmp.name,
      transferDate: transferDate,
      oldCompany: selectedEmp.company,
      oldArea: selectedEmp.area,
      oldDept: selectedEmp.dept,
      oldDesignation: selectedEmp.designation,
      oldEmployeeType: selectedEmp.employeeType,
      oldGrade: selectedEmp.grade,
      oldUnit: selectedEmp.unit,
      oldLine: selectedEmp.line,
      oldShift: selectedEmp.shift,
      newCompany,
      newArea,
      newDept,
      newDesignation,
      newEmployeeType: newEmpType,
      newGrade,
      newUnit,
      newLine,
      newShift,
      status: "Pending",
      reason: transferReason || "Operational transfer request",
    };
    setLogs((prev) => [newLogEntry, ...prev]);
    toast.success(`Transfer request staged successfully for ${selectedEmp.name}!`);
    setSelectedEmp(null);
    setEmpSearchQuery("");
    setTransferReason("");
    setIsNewTransferOpen(false);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.name.toLowerCase().includes(filterGeneralSearch.toLowerCase()) ||
        log.empId.includes(filterGeneralSearch) ||
        log.oldDept.toLowerCase().includes(filterGeneralSearch.toLowerCase());
      const matchesStart = !filterStartDate || log.transferDate >= filterStartDate;
      const matchesEnd = !filterEndDate || log.transferDate <= filterEndDate;
      const matchesArea =
        filterArea === "ALL" || log.newArea === filterArea || log.oldArea === filterArea;
      const matchesDept =
        filterDeptVal === "ALL" || log.newDept === filterDeptVal || log.oldDept === filterDeptVal;
      const matchesStatus = filterStatusVal === "ALL" || log.status === filterStatusVal;
      return (
        matchesSearch && matchesStart && matchesEnd && matchesArea && matchesDept && matchesStatus
      );
    });
  }, [
    logs,
    filterGeneralSearch,
    filterStartDate,
    filterEndDate,
    filterArea,
    filterDeptVal,
    filterStatusVal,
  ]);

  const handleSelectAllLogs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list =
      currentTab === "approve" ? filteredLogs.filter((l) => l.status === "Pending") : filteredLogs;
    if (e.target.checked) setSelectedLogIds(new Set(list.map((l) => l.id)));
    else setSelectedLogIds(new Set());
  };

  const handleSelectLog = (id: string) => {
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleProcessApprovals = (status: "Approved" | "Rejected") => {
    if (selectedLogIds.size === 0) return;
    setLogs((prev) =>
      prev.map((log) => {
        if (selectedLogIds.has(log.id)) {
          return { ...log, status };
        }
        return log;
      }),
    );
    toast.success(`Successfully ${status.toLowerCase()} ${selectedLogIds.size} transfer requests!`);
    setSelectedLogIds(new Set());
  };

  const handleViewLetter = (log: TransferLog) => {
    setSelectedLetterLog(log);
    setLetterRefNo(`PGL/HR/${log.transferDate.replace(/-/g, "")}/${log.empId}`);
    setLetterSubject("Office Order: Posting and Transfer");
    setLetterBody(
      `In the interest of the company's operational goals, you are hereby transferred from your current placement as ${log.oldDesignation} in the ${log.oldDept} department at ${log.oldCompany} to the new position outlined below. All other conditions of your appointment contract remain unchanged.`,
    );
  };

  const handleTriggerPrint = () => window.print();

  const handleDeleteLogEntry = (id: string, name: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    toast.success(`Removed transfer record for ${name}.`);
  };

  const switchTab = (tab: string) => {
    navigate({ search: { tab } });
    setSelectedLogIds(new Set());
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden print:bg-white print:text-black">
        <div className="print:hidden">
          <Topbar />
        </div>

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10 print:p-0 print:bg-white">
          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">HR Approvals</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  Transfer Control Center
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Transfer Control Center
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewTransferOpen(true)}
                className="h-8.5 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="size-3.5" /> New Transfer
              </button>
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-3 gap-3 shrink-0 print:hidden">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Transfer Logs
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {logs.length} Recorded
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Approved Postings
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {logs.filter((l) => l.status === "Approved").length} Processed
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Pending Reviews
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {logs.filter((l) => l.status === "Pending").length} Awaiting
                </h3>
              </div>
            </div>
          </div>

          {/* Smart Filters (Tabs & Search) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 print:hidden space-y-3">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                {(["history", "approve", "print"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => switchTab(tab)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                      currentTab === tab
                        ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab === "history"
                      ? "History Ledger"
                      : tab === "approve"
                        ? "Approve Queue"
                        : "Letter Dispatch"}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={filterGeneralSearch}
                  onChange={(e) => setFilterGeneralSearch(e.target.value)}
                  placeholder="Search name, ID, dept..."
                  className="w-full h-8 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Extended Filters based on tab */}
            {currentTab !== "print" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-3.5 gap-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                {currentTab === "history" && (
                  <>
                    <div className="space-y-0.5">
                      <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold px-2"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold px-2"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Status
                      </label>
                      <SearchableSelect
                        value={filterStatusVal}
                        onChange={setFilterStatusVal}
                        options={[
                          { value: "ALL", label: "ALL" },
                          { value: "Pending", label: "Pending" },
                          { value: "Approved", label: "Approved" },
                          { value: "Rejected", label: "Rejected" },
                        ]}
                        className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-0.5">
                  <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Department
                  </label>
                  <SearchableSelect
                    value={filterDeptVal}
                    onChange={setFilterDeptVal}
                    options={[
                      { value: "ALL", label: "ALL" },
                      ...availableDept.map((d) => ({ value: d, label: d })),
                    ]}
                    className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Area
                  </label>
                  <SearchableSelect
                    value={filterArea}
                    onChange={setFilterArea}
                    options={[
                      { value: "ALL", label: "ALL" },
                      ...availableAreas.map((a) => ({ value: a, label: a })),
                    ]}
                    className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar & Data Table */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0 print:border-none print:shadow-none">
            {/* Bulk Action Bar - Sticky */}
            {currentTab === "approve" && selectedLogIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20"
                  >
                    {selectedLogIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">
                    transfers ready for authorization
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleProcessApprovals("Rejected")}
                    className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <XCircle className="size-3.5" /> Reject Selected
                  </button>
                  <button
                    onClick={() => handleProcessApprovals("Approved")}
                    className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="size-3.5" /> Approve Selected
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-auto print:overflow-visible">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 print:static">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    {currentTab === "approve" && (
                      <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                          onChange={handleSelectAllLogs}
                          checked={
                            selectedLogIds.size ===
                              filteredLogs.filter((l) => l.status === "Pending").length &&
                            selectedLogIds.size > 0
                          }
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[60px] text-center">
                      #
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[200px]">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[140px]">
                      Transfer Date
                    </th>
                    {currentTab === "print" ? (
                      <>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          From
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          To
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          Posting Title
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[150px]">
                          Action
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          Changes (Diff)
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          Old Posting
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[150px]">
                          Reason
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          Status
                        </th>
                        {currentTab === "history" && (
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                            Action
                          </th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {(() => {
                    let displayLogs = filteredLogs;
                    if (currentTab === "approve")
                      displayLogs = filteredLogs.filter((l) => l.status === "Pending");
                    if (currentTab === "print")
                      displayLogs = logs.filter((l) => l.status === "Approved");

                    return displayLogs.map((log, index) => {
                      const isChecked = selectedLogIds.has(log.id);
                      let statusBadge =
                        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
                      if (log.status === "Approved")
                        statusBadge =
                          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
                      if (log.status === "Rejected")
                        statusBadge =
                          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";

                      return (
                        <tr
                          key={log.id}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isChecked ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                        >
                          {currentTab === "approve" && (
                            <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                                checked={isChecked}
                                onChange={() => handleSelectLog(log.id)}
                              />
                            </td>
                          )}
                          <td className="px-4 py-3 text-center font-mono text-slate-400">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-800 dark:text-slate-100 block">
                              {log.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono mt-0.5">
                              {log.empId}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                            {log.transferDate}
                          </td>

                          {currentTab === "print" ? (
                            <>
                              <td className="px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400">
                                <div>{log.oldCompany.split(" ")[0]}</div>
                                <div className="text-[9.5px]">{log.oldDept}</div>
                              </td>
                              <td className="px-4 py-3 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                <div>{log.newCompany.split(" ")[0]}</div>
                                <div className="text-[9.5px] text-[#2563eb]">{log.newDept}</div>
                              </td>
                              <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                                {log.newDesignation}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleViewLetter(log)}
                                  className="h-7.5 px-3 rounded-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 bg-[#2563eb]/5 hover:bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-black uppercase tracking-wide flex items-center justify-center gap-1.5 mx-auto transition"
                                >
                                  <FileText className="size-3.5" /> Letter
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 space-y-1">
                                {log.oldCompany !== log.newCompany && (
                                  <div className="text-[10px]">
                                    <span className="text-slate-500 line-through mr-1">
                                      {log.oldCompany.split(" ")[1] || log.oldCompany}
                                    </span>
                                    ➔
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                                      {log.newCompany.split(" ")[1] || log.newCompany}
                                    </span>
                                  </div>
                                )}
                                {log.oldDept !== log.newDept && (
                                  <div className="text-[10px]">
                                    <span className="text-slate-500 line-through mr-1">
                                      {log.oldDept}
                                    </span>
                                    ➔
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                                      {log.newDept}
                                    </span>
                                  </div>
                                )}
                                {log.oldDesignation !== log.newDesignation && (
                                  <div className="text-[10px]">
                                    <span className="text-slate-500 line-through mr-1">
                                      {log.oldDesignation}
                                    </span>
                                    ➔
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                                      {log.newDesignation}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-500 space-y-0.5 text-[11px]">
                                <div>{log.oldCompany}</div>
                                <div className="text-[9.5px]">
                                  {log.oldDept} | {log.oldDesignation}
                                </div>
                              </td>
                              <td
                                className="px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-[150px] truncate"
                                title={log.reason}
                              >
                                {log.reason}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${statusBadge}`}
                                >
                                  {log.status}
                                </span>
                              </td>
                              {currentTab === "history" && (
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => handleDeleteLogEntry(log.id, log.name)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 print:hidden">
              <div>Showing filtered entries</div>
              <div className="flex items-center gap-1.5">
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors"
                  disabled
                >
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* NEW TRANSFER MODAL */}
      {isNewTransferOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <RefreshCw className="size-4.5 text-[#2563eb] animate-spin-slow" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Initiate Employee Transfer
                </span>
              </div>
              <button
                onClick={() => setIsNewTransferOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <form
              onSubmit={handleNewTransferSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-5"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative">
                <label className="text-[10px] font-black uppercase text-rose-500 tracking-wider mb-2 block">
                  Find Employee to Transfer *
                </label>
                <div className="relative">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Employee ID or Name"
                    value={empSearchQuery}
                    onChange={(e) => {
                      setEmpSearchQuery(e.target.value);
                      setShowAutocomplete(true);
                      if (!e.target.value) setSelectedEmp(null);
                    }}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                  />
                  {showAutocomplete && autocompleteResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg z-35 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {autocompleteResults.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => handleSelectEmployee(emp)}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-7 rounded-full bg-[#2563eb]/10 text-[#2563eb] font-bold text-xs flex items-center justify-center">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {emp.name}
                              </div>
                              <div className="text-[9px] font-mono text-slate-500">{emp.id}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {emp.dept}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-2">
                    <Users className="size-3.5 text-slate-500" />
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500">
                      Current Assignment Profile
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    {!selectedEmp ? (
                      <div className="text-center py-10 space-y-1.5 text-slate-400">
                        <AlertCircle className="size-7 mx-auto opacity-50" />
                        <div className="text-xs font-bold">No Employee Selected</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        {[
                          {
                            label: "Emp Name & ID",
                            value: `${selectedEmp.name} (${selectedEmp.id})`,
                          },
                          { label: "Company", value: selectedEmp.company },
                          { label: "Area / Placement", value: selectedEmp.area },
                          { label: "Employee Type", value: selectedEmp.employeeType },
                          { label: "Sub Department", value: selectedEmp.dept },
                          { label: "Designation / Job Title", value: selectedEmp.designation },
                          { label: "Unit", value: selectedEmp.unit },
                          { label: "Shift", value: selectedEmp.shift },
                          { label: "Grade", value: selectedEmp.grade },
                          { label: "Line", value: selectedEmp.line },
                        ].map((field, i) => (
                          <div
                            key={i}
                            className="space-y-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg p-2.5"
                          >
                            <label className="text-[8.5px] font-extrabold uppercase tracking-wide text-slate-500">
                              {field.label}
                            </label>
                            <div className="font-extrabold text-slate-800 dark:text-slate-200 truncate">
                              {field.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="size-3.5 text-[#2563eb]" />
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Proposed New Posting
                      </span>
                    </div>
                    {selectedEmp && (
                      <button
                        type="button"
                        onClick={handleCopyProfile}
                        className="h-6.5 px-2 rounded-lg border border-[#2563eb]/20 hover:border-[#2563eb]/40 bg-[#2563eb]/5 hover:bg-[#2563eb]/10 text-[9px] font-black uppercase tracking-wider text-[#2563eb] flex items-center gap-1 transition"
                      >
                        <Copy className="size-3" /> Sync Current
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {!selectedEmp ? (
                      <div className="text-center py-10 space-y-1.5 text-slate-400">
                        <AlertCircle className="size-7 mx-auto opacity-50" />
                        <div className="text-xs font-bold">Proposal Locked</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Transfer Date *
                          </label>
                          <input
                            type="date"
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            className="w-full h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Target Company *
                          </label>
                          <select
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableCompanies.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Target Area *
                          </label>
                          <select
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableAreas.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Employee Type *
                          </label>
                          <select
                            value={newEmpType}
                            onChange={(e) => setNewEmpType(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableEmpTypes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Sub Department *
                          </label>
                          <select
                            value={newDept}
                            onChange={(e) => setNewDept(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableDept.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">
                            Job Title / Designation *
                          </label>
                          <select
                            value={newDesignation}
                            onChange={(e) => setNewDesignation(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableDesignations.map((ds) => (
                              <option key={ds} value={ds}>
                                {ds}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wide text-slate-500">
                            Grade
                          </label>
                          <select
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableGrades.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wide text-slate-500">
                            Unit
                          </label>
                          <select
                            value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableUnits.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wide text-slate-500">
                            Line
                          </label>
                          <select
                            value={newLine}
                            onChange={(e) => setNewLine(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableLines.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wide text-slate-500">
                            Shift
                          </label>
                          <select
                            value={newShift}
                            onChange={(e) => setNewShift(e.target.value)}
                            className="w-full h-8.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer text-slate-800 dark:text-slate-200"
                          >
                            {availableShifts.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEmp && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in slide-in-from-bottom-1">
                  <div className="space-y-1 flex-1 max-w-lg">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wide">
                      Reason for Transfer Proposal
                    </label>
                    <textarea
                      rows={1.5}
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      placeholder="e.g. Promotion, performance-based relocation..."
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-[#2563eb] placeholder:font-normal text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNewTransferOpen(false)}
                      className="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 font-black text-xs uppercase tracking-wider transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-xs font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <Send className="size-3.5" /> Submit Proposal
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* LETTER PREVIEW MODAL */}
      {selectedLetterLog && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 md:p-6 print:relative print:inset-auto print:bg-white print:p-0 print:z-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden print:w-full print:h-auto print:rounded-none print:border-none print:shadow-none print:overflow-visible">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="size-4.5 text-[#2563eb]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Corporate Transfer Order Draft
                </span>
              </div>
              <button
                onClick={() => setSelectedLetterLog(null)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <div className="flex-1 flex overflow-hidden p-5 gap-5 print:p-0 print:block">
              <div className="w-[38%] overflow-y-auto space-y-4 pr-2 border-r border-slate-200 dark:border-slate-800 print:hidden">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block mb-1">
                  Template Customizer
                </span>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">
                    Reference No
                  </label>
                  <input
                    type="text"
                    value={letterRefNo}
                    onChange={(e) => setLetterRefNo(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={letterSubject}
                    onChange={(e) => setLetterSubject(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">
                    Letter Body Text
                  </label>
                  <textarea
                    rows={6}
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none resize-none leading-relaxed text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-500 uppercase">
                    Authorized Signatory
                  </label>
                  <input
                    type="text"
                    value={letterSignatory}
                    onChange={(e) => setLetterSignatory(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleTriggerPrint}
                    className="w-full h-10 bg-[#2563eb] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Printer className="size-4" /> Trigger System Print
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 overflow-y-auto rounded-xl flex justify-center border border-slate-200 dark:border-slate-800 print:p-0 print:bg-white print:border-none print:w-full">
                <div className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-12 relative shadow-md print:shadow-none print:p-4 print:w-full print:min-h-0 print:bg-white leading-relaxed">
                  <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                        PAKIZA GROUP
                      </h2>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        Human Resources & Compliance Division
                      </p>
                      <p className="text-[8px] text-slate-400 mt-0.5">
                        Pakiza Tower, Dhaka HQ, Bangladesh
                      </p>
                    </div>
                    <div className="border-l border-slate-300 pl-4 text-right">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-800">
                        Office Order
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold mb-6">
                    <div>
                      Ref: <span className="font-mono text-slate-900 font-bold">{letterRefNo}</span>
                    </div>
                    <div>
                      Date: <span className="text-slate-900">{selectedLetterLog.transferDate}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-800 space-y-1 mb-6">
                    <div className="font-bold text-slate-500">To,</div>
                    <div className="text-xs font-black text-slate-900">
                      {selectedLetterLog.name}
                    </div>
                    <div>
                      Employee ID:{" "}
                      <span className="font-mono font-bold">{selectedLetterLog.empId}</span>
                    </div>
                    <div>
                      Current Designation:{" "}
                      <span className="font-semibold">{selectedLetterLog.oldDesignation}</span>
                    </div>
                    <div>
                      Current Placement:{" "}
                      <span className="font-semibold">{selectedLetterLog.oldDept}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-4 text-slate-900">
                    Subject: {letterSubject}
                  </div>
                  <div className="text-[10.5px] text-slate-800 font-semibold mb-3">
                    Dear {selectedLetterLog.name.split(" ")[0] || "Employee"},
                  </div>
                  <p className="text-[10.5px] text-slate-700 leading-relaxed mb-6 font-medium whitespace-pre-line">
                    {letterBody}
                  </p>
                  <div className="mb-8">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2">
                      New Posting Structure Details:
                    </div>
                    <table className="w-full border-collapse border border-slate-300 text-[10px] font-semibold text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-black">
                          <th className="px-3 py-2 border-r border-slate-300">Attribute Field</th>
                          <th className="px-3 py-2 border-r border-slate-300">
                            Previous Placement
                          </th>
                          <th className="px-3 py-2">Proposed Placement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr>
                          <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">
                            Company Name
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">
                            {selectedLetterLog.oldCompany}
                          </td>
                          <td className="px-3 py-1.5 font-bold text-slate-900">
                            {selectedLetterLog.newCompany}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">
                            Placement Area
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">
                            {selectedLetterLog.oldArea}
                          </td>
                          <td className="px-3 py-1.5 font-bold text-slate-900">
                            {selectedLetterLog.newArea}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">
                            Department
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">
                            {selectedLetterLog.oldDept}
                          </td>
                          <td className="px-3 py-1.5 font-bold text-slate-900">
                            {selectedLetterLog.newDept}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">
                            Designation / Title
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">
                            {selectedLetterLog.oldDesignation}
                          </td>
                          <td className="px-3 py-1.5 font-bold text-slate-900">
                            {selectedLetterLog.newDesignation}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">
                            Shift Code
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">
                            {selectedLetterLog.oldShift}
                          </td>
                          <td className="px-3 py-1.5 font-bold text-slate-900">
                            {selectedLetterLog.newShift}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[10px] text-slate-700 leading-normal mb-12">
                    Please report to your new station on the morning of{" "}
                    <span className="font-bold text-slate-900">
                      {selectedLetterLog.transferDate}
                    </span>
                    . We wish you continued success in your new assignment.
                  </div>
                  <div className="mt-16 flex justify-between text-[10px] font-bold text-slate-800">
                    <div className="space-y-6">
                      <div className="border-t border-slate-400 pt-1.5 w-36 text-center">
                        Prepared By (HR Officer)
                      </div>
                    </div>
                    <div className="space-y-6 text-right">
                      <div className="font-bold text-slate-900">{letterSignatory}</div>
                      <div className="border-t border-slate-400 pt-1.5 w-44 text-center">
                        Authorized Signature
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
  );
}
