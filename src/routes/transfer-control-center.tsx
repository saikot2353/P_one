import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  RefreshCw, ChevronRight, Check, X, FileSpreadsheet, Printer, FileDown,
  AlertCircle, Search, SlidersHorizontal, Trash2, Calendar, FileText,
  UserCheck, Users, Copy, Sparkles, Send, Award, FileCheck2, ZoomIn, Info,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface SearchParams {
  tab?: string;
}

export const Route = createFileRoute("/transfer-control-center")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab: (search.tab as string) || "history", // Defaults to history ledger
    };
  },
  head: () => ({
    meta: [
      { title: "Transfer Control Center — CRIPTON" },
      { name: "description", content: "Corporate employee transfer, posting, and letter dispatch system." },
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
  { id: "2023046001", name: "Sohanur Rahman Sohan", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "HR & Admin", designation: "Jr. Executive", employeeType: "Office Executive", grade: "None", unit: "N/A", line: "0", shift: "General Shift" },
  { id: "2022040132", name: "Md. Sakil", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Admin", designation: "Asst. Cook", employeeType: "Office Staff", grade: "None", unit: "PTVL", line: "N/A", shift: "Exe-Ptvl" },
  { id: "2021022804", name: "Kaikobad Howlader", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Admin", designation: "Security Guard", employeeType: "Worker", grade: "None", unit: "PTVL", line: "N/A", shift: "Exe-Ptvl" },
  { id: "2019013884", name: "Javed Mia", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Admin", designation: "Helper (Cook)", employeeType: "Office Staff", grade: "None", unit: "N/A", line: "N/A", shift: "Exe-Ptvl" },
  { id: "2023044501", name: "Anik Saha", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Business Development (BA)", designation: "Sr. Executive", employeeType: "Office Executive", grade: "None", unit: "N/A", line: "N/A", shift: "General-Exec" },
  { id: "2023043021", name: "Easin Mia", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Admin", designation: "Receptionist", employeeType: "Office Executive", grade: "None", unit: "PTVL", line: "N/A", shift: "Exe-Ptvl" },
  { id: "2023043577", name: "Md. Mostakim Shah", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Admin", designation: "Office Boy", employeeType: "Office Staff", grade: "None", unit: "PTVL", line: "N/A", shift: "Exe-Ptvl" },
  { id: "2023043921", name: "Ariful Hasan", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Business Development (BA)", designation: "Jr. Executive", employeeType: "Office Executive", grade: "None", unit: "PTVL", line: "N/A", shift: "General Shift" },
  { id: "2023043019", name: "Shafin Mukhlesy", company: "Pakiza Software Limited", area: "PSL-Operation", dept: "Business Automation", designation: "Executive", employeeType: "Office Executive", grade: "None", unit: "PTVL", line: "N/A", shift: "General Shift" }
];

// Transfer Log Interface
interface TransferLog {
  id: string;
  empId: string;
  name: string;
  transferDate: string;
  
  // Old values
  oldCompany: string;
  oldArea: string;
  oldDept: string;
  oldDesignation: string;
  oldEmployeeType: string;
  oldGrade: string;
  oldUnit: string;
  oldLine: string;
  oldShift: string;

  // New values
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
    reason: "Group Shared Services restructuring"
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
    reason: "Promoted to Technovation Team"
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
    reason: "General relocation order"
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
    reason: "Security division shift rotation"
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
    reason: "Annual roster adjustment"
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
    reason: "BD strategic alignment"
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
    reason: "MD vetoed due to active project dependencies"
  }
];

const availableCompanies = [
  "Pakiza Software Limited",
  "Pakiza Knit Composite Ltd",
  "Pakiza Technovation Limited",
  "Pakiza Group"
];

const availableAreas = ["PSL-Operation", "PTVL-Operation", "Dhaka HQ"];
const availableDept = ["HR & Admin", "Admin", "Business Development (BA)", "Business Automation", "Finance & Accounts"];
const availableDesignations = ["Jr. Executive", "Executive", "Sr. Executive", "Asst. Manager", "Manager", "Sr. Manager", "Asst. Cook", "Helper (Cook)", "Security Guard", "Receptionist", "Office Boy", "Driver"];
const availableEmpTypes = ["Office Executive", "Office Staff", "Worker", "Management"];
const availableGrades = ["None", "Grade A", "Grade B", "Grade C", "Grade D"];
const availableUnits = ["N/A", "PSL", "PTVL", "HQ"];
const availableLines = ["N/A", "0", "1", "2", "3", "5"];
const availableShifts = ["General Shift", "Morning Shift", "Day Shift", "Night Shift", "Evening Shift", "Exe-Ptvl", "General-Transport"];

function TransferControlCenterPage() {
  const search: SearchParams = Route.useSearch();
  const currentTab = search.tab || "history"; // Defaults to history ledger

  // State Databases
  const [employees] = useState<Employee[]>(mockEmployees);
  const [logs, setLogs] = useState<TransferLog[]>(mockTransferLogs);

  // New Transfer Modal state
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);

  // Auto-complete employee search states
  const [empSearchQuery, setEmpSearchQuery] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // New Transfer form state values
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

  // Approvals view checkbox selected logs
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());

  // History / Approvals filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterArea, setFilterArea] = useState("ALL");
  const [filterDeptVal, setFilterDeptVal] = useState("ALL");
  const [filterStatusVal, setFilterStatusVal] = useState("ALL");
  const [filterGeneralSearch, setFilterGeneralSearch] = useState("");

  // Letter Canvas preview modal states
  const [selectedLetterLog, setSelectedLetterLog] = useState<TransferLog | null>(null);
  const [letterSubject, setLetterSubject] = useState("Letter of Posting and Transfer");
  const [letterRefNo, setLetterRefNo] = useState("");
  const [letterBody, setLetterBody] = useState("");
  const [letterSignatory, setLetterSignatory] = useState("Group HR Director");

  // Filtering list for Autocomplete
  const autocompleteResults = useMemo(() => {
    if (!empSearchQuery.trim()) return [];
    return employees.filter(
      e => e.name.toLowerCase().includes(empSearchQuery.toLowerCase()) || e.id.includes(empSearchQuery)
    ).slice(0, 5);
  }, [employees, empSearchQuery]);

  // Load employee and prefill form defaults
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmp(emp);
    setEmpSearchQuery(`${emp.name} (${emp.id})`);
    setShowAutocomplete(false);

    // Default target profile values prefilled to match current
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

  // Helper utility to sync/copy fields
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

  // Submit transfer request handler
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
      reason: transferReason || "Operational transfer request"
    };

    setLogs(prev => [newLogEntry, ...prev]);
    toast.success(`Transfer request staged successfully for ${selectedEmp.name}!`, {
      description: "Proposed transaction is now pending HR/MD verification."
    });

    // Reset Workspace & Close Modal
    setSelectedEmp(null);
    setEmpSearchQuery("");
    setTransferReason("");
    setIsNewTransferOpen(false);
  };

  // Filter logs for History and Approvals
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.name.toLowerCase().includes(filterGeneralSearch.toLowerCase()) || log.empId.includes(filterGeneralSearch) || log.oldDept.toLowerCase().includes(filterGeneralSearch.toLowerCase());
      const matchesStart = !filterStartDate || log.transferDate >= filterStartDate;
      const matchesEnd = !filterEndDate || log.transferDate <= filterEndDate;
      const matchesArea = filterArea === "ALL" || log.newArea === filterArea || log.oldArea === filterArea;
      const matchesDept = filterDeptVal === "ALL" || log.newDept === filterDeptVal || log.oldDept === filterDeptVal;
      const matchesStatus = filterStatusVal === "ALL" || log.status === filterStatusVal;

      return matchesSearch && matchesStart && matchesEnd && matchesArea && matchesDept && matchesStatus;
    });
  }, [logs, filterGeneralSearch, filterStartDate, filterEndDate, filterArea, filterDeptVal, filterStatusVal]);

  // Bulk checks select handlers
  const handleSelectAllLogs = () => {
    const pendingLogs = filteredLogs.filter(l => l.status === "Pending");
    if (selectedLogIds.size === pendingLogs.length) {
      setSelectedLogIds(new Set());
    } else {
      setSelectedLogIds(new Set(pendingLogs.map(l => l.id)));
    }
  };

  const handleSelectLog = (id: string) => {
    const next = new Set(selectedLogIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedLogIds(next);
  };

  // Process approval action
  const handleProcessApprovals = (status: "Approved" | "Rejected") => {
    if (selectedLogIds.size === 0) {
      toast.error("Please check the boxes for pending requests you want to process first.");
      return;
    }

    setLogs(prev => prev.map(log => {
      if (selectedLogIds.has(log.id)) {
        return { ...log, status };
      }
      return log;
    }));

    toast.success(`Successfully ${status.toLowerCase()} ${selectedLogIds.size} transfer requests!`);
    setSelectedLogIds(new Set());
  };

  // Letter generator dispatch
  const handleViewLetter = (log: TransferLog) => {
    setSelectedLetterLog(log);
    setLetterRefNo(`PGL/HR/${log.transferDate.replace(/-/g, "")}/${log.empId}`);
    setLetterSubject("Office Order: Posting and Transfer");
    setLetterBody(
      `In the interest of the company's operational goals, you are hereby transferred from your current placement as ${log.oldDesignation} in the ${log.oldDept} department at ${log.oldCompany} to the new position outlined below. All other conditions of your appointment contract remain unchanged.`
    );
  };

  // Printing logic
  const handleTriggerPrint = () => {
    window.print();
  };

  // Revert/Delete log handler
  const handleDeleteLogEntry = (id: string, name: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    toast.success(`Removed transfer record for ${name}.`);
  };

  // Export placeholders
  const handleExcelExport = () => toast.success("Exporting filtered logs to Excel Sheet...");
  const handlePDFExport = () => toast.success("Generating complete PDF reports...");
  const handlePrintExport = () => toast.success("Opening system printing window...");

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative h-screen overflow-hidden print:bg-white print:text-black">
        
        {/* App Topbar (hidden during browser printing) */}
        <div className="print:hidden">
          <Topbar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Row (hidden during printing) */}
          <div className="bg-card border-b border-border/60 p-4 md:px-6 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-xs print:hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Transfer Control</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <RefreshCw className="size-5.5" />
                </div>
                <span>Transfer Control Center</span>
              </h1>
            </div>

            {/* Top Right Action Button */}
            <button
              onClick={() => setIsNewTransferOpen(true)}
              className="h-10 px-5 bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="size-4" /> New Transfer
            </button>
          </div>

          {/* MAIN PAGE CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/10 print:p-0 print:bg-white">
            
            {/* ============================== TAB 1: HISTORY LEDGER (DEFAULT) ============================== */}
            {currentTab === "history" && (
              <div className="space-y-6 print:hidden animate-in fade-in duration-200">
                
                {/* Statistics strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Total Transfer Logs", val: logs.length, color: "text-primary" },
                    { label: "Approved Postings", val: logs.filter(l => l.status === "Approved").length, color: "text-emerald-600" },
                    { label: "Pending Reviews", val: logs.filter(l => l.status === "Pending").length, color: "text-amber-600" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-card rounded-2xl border border-border/80 p-5 flex items-center justify-between shadow-3xs">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                      <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Ledger Advanced Filters with Create Action */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-3xs flex flex-col gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">Search logs</label>
                      <input
                        type="text"
                        placeholder="Emp ID, name, dept..."
                        value={filterGeneralSearch}
                        onChange={(e) => setFilterGeneralSearch(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-[10.5px] font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">Start date</label>
                      <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-[10.5px] font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">End date</label>
                      <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-[10.5px] font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">Status</label>
                      <select
                        value={filterStatusVal}
                        onChange={(e) => setFilterStatusVal(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-[10.5px] font-bold cursor-pointer"
                      >
                        <option value="ALL">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFilterGeneralSearch("");
                          setFilterStartDate("");
                          setFilterEndDate("");
                          setFilterStatusVal("ALL");
                        }}
                        className="flex-1 h-9 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground font-black text-[10px] uppercase tracking-wider transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logs Spreadsheet card */}
                <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                  
                  {/* Toolbar */}
                  <div className="p-3.5 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={handleExcelExport} className="h-8 px-3 rounded border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"><FileSpreadsheet className="size-3.5 text-emerald-500"/> EXCEL</button>
                      <button onClick={handlePrintExport} className="h-8 px-3 rounded border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"><Printer className="size-3.5 text-blue-500"/> PRINT</button>
                      <button onClick={handlePDFExport} className="h-8 px-3 rounded border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"><FileDown className="size-3.5 text-rose-500"/> PDF</button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-muted-foreground bg-card border border-border/40 px-3 py-1 rounded-full">
                        Ledger Rows: {filteredLogs.length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[10.5px] text-left min-w-[1100px]">
                      <thead>
                        <tr className="bg-muted/10 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[9px] font-black">
                          <th className="px-4 py-3 w-10">#</th>
                          <th className="px-4 py-3">Employee</th>
                          <th className="px-4 py-3">Transfer Date</th>
                          <th className="px-4 py-3">Old Company</th>
                          <th className="px-4 py-3">New Company</th>
                          <th className="px-4 py-3">Department Posting</th>
                          <th className="px-4 py-3">Designation Posting</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {filteredLogs.map((log, index) => (
                          <tr key={log.id} className="hover:bg-muted/30 transition">
                            <td className="px-4 py-3 font-bold text-muted-foreground">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-extrabold text-foreground">{log.name}</div>
                              <div className="font-mono text-[9px] text-muted-foreground">{log.empId}</div>
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-foreground">{log.transferDate}</td>
                            <td className="px-4 py-3 text-muted-foreground">{log.oldCompany}</td>
                            <td className="px-4 py-3 text-foreground font-bold">{log.newCompany}</td>
                            <td className="px-4 py-3 space-y-0.5">
                              <div className="text-[10px] font-bold text-foreground">{log.newDept}</div>
                              <div className="text-[9.5px] text-muted-foreground line-through">{log.oldDept}</div>
                            </td>
                            <td className="px-4 py-3 space-y-0.5">
                              <div className="text-[10px] font-bold text-foreground">{log.newDesignation}</div>
                              <div className="text-[9.5px] text-muted-foreground line-through">{log.oldDesignation}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                                log.status === "Approved"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : log.status === "Rejected"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteLogEntry(log.id, log.name)}
                                className="p-1 rounded border border-border/50 hover:bg-rose-500/10 hover:border-rose-300 text-muted-foreground hover:text-rose-500 transition"
                                title="Revert Record"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {filteredLogs.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-10 text-center">
                              <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                                <AlertCircle className="size-7 text-muted-foreground/50" />
                                <span className="font-bold text-xs">No transfer logs matched your criteria.</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ============================== TAB 2: APPROVE QUEUE ============================== */}
            {currentTab === "approve" && (
              <div className="space-y-6 print:hidden animate-in fade-in duration-200">
                
                {/* Approvals filter strip */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Search name, ID..."
                      value={filterGeneralSearch}
                      onChange={(e) => setFilterGeneralSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/30 border border-border/60 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <select
                      value={filterDeptVal}
                      onChange={(e) => setFilterDeptVal(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted/30 border border-border/60 text-xs font-semibold"
                    >
                      <option value="ALL">All Departments</option>
                      {availableDept.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterArea}
                      onChange={(e) => setFilterArea(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-muted/30 border border-border/60 text-xs font-semibold"
                    >
                      <option value="ALL">All Areas</option>
                      {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProcessApprovals("Approved")}
                      disabled={selectedLogIds.size === 0}
                      className="flex-1 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wide transition shadow-sm disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <Check className="size-3.5" /> Approve ({selectedLogIds.size})
                    </button>
                    <button
                      onClick={() => handleProcessApprovals("Rejected")}
                      disabled={selectedLogIds.size === 0}
                      className="flex-1 h-9 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-wide transition shadow-sm disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <X className="size-3.5" /> Reject
                    </button>
                  </div>
                </div>

                {/* Queue list table */}
                <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      Pending Authorization Queue ({filteredLogs.filter(l => l.status === "Pending").length})
                    </span>
                    {selectedLogIds.size > 0 && (
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
                        {selectedLogIds.size} queued
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[11px] text-left min-w-[1000px]">
                      <thead>
                        <tr className="bg-muted/10 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[9px] font-black">
                          <th className="px-4 py-3 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredLogs.filter(l => l.status === "Pending").length > 0 &&
                                selectedLogIds.size === filteredLogs.filter(l => l.status === "Pending").length
                              }
                              onChange={handleSelectAllLogs}
                              className="accent-primary size-4 rounded cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-3">Employee Details</th>
                          <th className="px-4 py-3">Proposed Changes (Diff)</th>
                          <th className="px-4 py-3">Old Posting Coordinates</th>
                          <th className="px-4 py-3">Effective Date</th>
                          <th className="px-4 py-3">Transfer Reason</th>
                          <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {filteredLogs.filter(l => l.status === "Pending").map(log => (
                          <tr key={log.id} className="hover:bg-muted/30 transition">
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedLogIds.has(log.id)}
                                onChange={() => handleSelectLog(log.id)}
                                className="accent-primary size-4 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-extrabold text-foreground">{log.name}</div>
                              <div className="font-mono text-[9px] text-muted-foreground">{log.empId}</div>
                            </td>
                            <td className="px-4 py-3 space-y-1 max-w-[280px]">
                              {log.oldCompany !== log.newCompany && (
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Company: </span>
                                  <span className="font-semibold line-through text-rose-500">{log.oldCompany.split(" ")[1] || log.oldCompany}</span>
                                  <span className="mx-1 text-muted-foreground">➔</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newCompany.split(" ")[1] || log.newCompany}</span>
                                </div>
                              )}
                              {log.oldDept !== log.newDept && (
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Dept: </span>
                                  <span className="font-semibold line-through text-rose-500">{log.oldDept}</span>
                                  <span className="mx-1 text-muted-foreground">➔</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newDept}</span>
                                </div>
                              )}
                              {log.oldDesignation !== log.newDesignation && (
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Title: </span>
                                  <span className="font-semibold line-through text-rose-500">{log.oldDesignation}</span>
                                  <span className="mx-1 text-muted-foreground">➔</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newDesignation}</span>
                                </div>
                              )}
                              {log.oldArea !== log.newArea && (
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Area: </span>
                                  <span className="font-semibold line-through text-rose-500">{log.oldArea}</span>
                                  <span className="mx-1 text-muted-foreground">➔</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newArea}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground space-y-0.5">
                              <div>{log.oldCompany}</div>
                              <div className="text-[10px] font-semibold">{log.oldDept} | {log.oldDesignation}</div>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-foreground">{log.transferDate}</td>
                            <td className="px-4 py-3 text-muted-foreground/80 max-w-[200px] truncate" title={log.reason}>
                              {log.reason}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))}

                        {filteredLogs.filter(l => l.status === "Pending").length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-10 text-center">
                              <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                                <FileCheck2 className="size-7 text-emerald-500" />
                                <span className="font-bold text-xs">Authorization complete. No pending requests found.</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ============================== TAB 3: PRINT LETTER ============================== */}
            {currentTab === "print" && (
              <div className="space-y-6 print:hidden animate-in fade-in duration-200">
                
                {/* Info strip */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-3xs flex items-center gap-3">
                  <Info className="size-4.5 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground leading-normal">
                    This workspace shows approved transfers. Click the <strong>Generate Letter</strong> action button to render an official A4 template, edit paragraphs, and print the hardcopy.
                  </span>
                </div>

                {/* Table list */}
                <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[10.5px] text-left min-w-[900px]">
                      <thead>
                        <tr className="bg-muted/10 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[9px] font-black">
                          <th className="px-4 py-3 w-10">#</th>
                          <th className="px-4 py-3">Employee Name</th>
                          <th className="px-4 py-3">Emp ID</th>
                          <th className="px-4 py-3">Transfer Date</th>
                          <th className="px-4 py-3">From Company / Dept</th>
                          <th className="px-4 py-3">To Company / Dept</th>
                          <th className="px-4 py-3">Posting Title</th>
                          <th className="px-4 py-3 text-center">Dispatch Letter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {logs.filter(l => l.status === "Approved").map((log, index) => (
                          <tr key={log.id} className="hover:bg-muted/30 transition">
                            <td className="px-4 py-3 font-bold text-muted-foreground">{index + 1}</td>
                            <td className="px-4 py-3 font-extrabold text-foreground">{log.name}</td>
                            <td className="px-4 py-3 font-mono font-bold text-primary">{log.empId}</td>
                            <td className="px-4 py-3 font-mono font-semibold">{log.transferDate}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <div>{log.oldCompany.split(" ")[0]}</div>
                              <div className="text-[9.5px] font-semibold">{log.oldDept}</div>
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground">
                              <div>{log.newCompany.split(" ")[0]}</div>
                              <div className="text-[9.5px] text-primary">{log.newDept}</div>
                            </td>
                            <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                              {log.newDesignation}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleViewLetter(log)}
                                className="h-8 px-3 rounded-lg border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wide flex items-center justify-center gap-1.5 mx-auto transition"
                              >
                                <FileText className="size-3.5" /> Generate Letter
                              </button>
                            </td>
                          </tr>
                        ))}

                        {logs.filter(l => l.status === "Approved").length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-10 text-center">
                              <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                                <AlertCircle className="size-7 text-muted-foreground/50" />
                                <span className="font-bold text-xs">No approved transfers ready for letter dispatching.</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ============================== NEW TRANSFER MODAL OVERLAY ============================== */}
            {isNewTransferOpen && (
              <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 md:p-6 animate-in fade-in duration-200">
                <div className="bg-card w-full max-w-5xl max-h-[90vh] rounded-2xl border border-border/80 shadow-2xl flex flex-col overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="px-5 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="size-4.5 text-primary animate-spin-slow" />
                      <span className="text-xs font-black uppercase tracking-wider text-foreground">
                        Initiate Employee Transfer
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsNewTransferOpen(false);
                        setSelectedEmp(null);
                        setEmpSearchQuery("");
                        setTransferReason("");
                      }}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="size-4.5" />
                    </button>
                  </div>

                  {/* Modal Content Form */}
                  <form onSubmit={handleNewTransferSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    
                    {/* Employee Autocomplete search */}
                    <div className="bg-card rounded-xl border border-border/80 p-4 shadow-3xs relative">
                      <label className="text-[10px] font-black uppercase text-rose-500 tracking-wider mb-2 block">
                        Find Employee to Transfer *
                      </label>
                      <div className="relative">
                        <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="text"
                          placeholder="Search Employee ID or Name (e.g. Sohan, Sakil...)"
                          value={empSearchQuery}
                          onChange={(e) => {
                            setEmpSearchQuery(e.target.value);
                            setShowAutocomplete(true);
                            if (!e.target.value) setSelectedEmp(null);
                          }}
                          className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/40 border border-border/60 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />

                        {/* Autocomplete list dropdown */}
                        {showAutocomplete && autocompleteResults.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-card rounded-xl border border-border/80 shadow-md z-35 max-h-48 overflow-y-auto divide-y divide-border/40">
                            {autocompleteResults.map(emp => (
                              <button
                                key={emp.id}
                                type="button"
                                onClick={() => handleSelectEmployee(emp)}
                                className="w-full px-4 py-2.5 text-left hover:bg-muted/40 transition flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="size-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                    {emp.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-foreground">{emp.name}</div>
                                    <div className="text-[9px] font-mono text-muted-foreground">{emp.id}</div>
                                  </div>
                                </div>
                                <span className="text-[9px] font-extrabold uppercase text-muted-foreground/80 bg-muted px-2 py-0.5 rounded">
                                  {emp.dept}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Side-by-Side Comparison Profile grids */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      
                      {/* Current profile (left) */}
                      <div className="bg-card rounded-xl border border-border/80 shadow-3xs flex flex-col">
                        <div className="p-3 border-b border-border/40 bg-muted/10 flex items-center gap-2">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="text-[10.5px] font-black uppercase tracking-wider text-muted-foreground">
                            Current Assignment Profile
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-center">
                          {!selectedEmp ? (
                            <div className="text-center py-10 space-y-1.5 text-muted-foreground/75">
                              <AlertCircle className="size-7 mx-auto text-muted-foreground/30" />
                              <div className="text-xs font-bold">No Employee Selected</div>
                              <p className="text-[9.5px] max-w-[280px] mx-auto text-muted-foreground/50 leading-relaxed">
                                Search and select a worker from the query box above to preview their active HR coordinates.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                              {[
                                { label: "Emp Name & ID", value: `${selectedEmp.name} (${selectedEmp.id})` },
                                { label: "Company", value: selectedEmp.company },
                                { label: "Area / Placement", value: selectedEmp.area },
                                { label: "Employee Type", value: selectedEmp.employeeType },
                                { label: "Sub Department", value: selectedEmp.dept },
                                { label: "Designation / Job Title", value: selectedEmp.designation },
                                { label: "Unit", value: selectedEmp.unit },
                                { label: "Shift", value: selectedEmp.shift },
                                { label: "Grade", value: selectedEmp.grade },
                                { label: "Line", value: selectedEmp.line }
                              ].map((field, i) => (
                                <div key={i} className="space-y-0.5 bg-muted/20 border border-border/30 rounded-lg p-2.5">
                                  <label className="text-[8.5px] font-extrabold uppercase tracking-wide text-muted-foreground">{field.label}</label>
                                  <div className="font-extrabold text-foreground truncate">{field.value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Proposed profile (right) */}
                      <div className="bg-card rounded-xl border border-border/80 shadow-3xs flex flex-col">
                        <div className="p-3 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="size-3.5 text-primary" />
                            <span className="text-[10.5px] font-black uppercase tracking-wider text-foreground">
                              Proposed New Posting
                            </span>
                          </div>
                          
                          {selectedEmp && (
                            <button
                              type="button"
                              onClick={handleCopyProfile}
                              className="h-6.5 px-2 rounded-lg border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-[9px] font-black uppercase tracking-wider text-primary flex items-center gap-1 transition"
                            >
                              <Copy className="size-3" /> Sync Current
                            </button>
                          )}
                        </div>

                        <div className="p-4 space-y-3">
                          {!selectedEmp ? (
                            <div className="text-center py-10 space-y-1.5 text-muted-foreground/75">
                              <AlertCircle className="size-7 mx-auto text-muted-foreground/30" />
                              <div className="text-xs font-bold">Proposal Locked</div>
                              <p className="text-[9.5px] max-w-[280px] mx-auto text-muted-foreground/50 leading-relaxed">
                                Selection required to enable target mapping values.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                              
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Transfer Date *</label>
                                <input
                                  type="date"
                                  value={transferDate}
                                  onChange={(e) => setTransferDate(e.target.value)}
                                  className="w-full h-8.5 px-3 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold outline-none"
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Target Company *</label>
                                <select
                                  value={newCompany}
                                  onChange={(e) => setNewCompany(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Target Area *</label>
                                <select
                                  value={newArea}
                                  onChange={(e) => setNewArea(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Employee Type *</label>
                                <select
                                  value={newEmpType}
                                  onChange={(e) => setNewEmpType(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableEmpTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Sub Department *</label>
                                <select
                                  value={newDept}
                                  onChange={(e) => setNewDept(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableDept.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Job Title / Designation *</label>
                                <select
                                  value={newDesignation}
                                  onChange={(e) => setNewDesignation(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableDesignations.map(ds => <option key={ds} value={ds}>{ds}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wide text-muted-foreground">Grade</label>
                                <select
                                  value={newGrade}
                                  onChange={(e) => setNewGrade(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wide text-muted-foreground">Unit</label>
                                <select
                                  value={newUnit}
                                  onChange={(e) => setNewUnit(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wide text-muted-foreground">Line</label>
                                <select
                                  value={newLine}
                                  onChange={(e) => setNewLine(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableLines.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wide text-muted-foreground">Shift</label>
                                <select
                                  value={newShift}
                                  onChange={(e) => setNewShift(e.target.value)}
                                  className="w-full h-8.5 px-2 rounded-lg bg-muted/30 border border-border/60 text-xs font-bold cursor-pointer"
                                >
                                  {availableShifts.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Bottom reason and actions */}
                    {selectedEmp && (
                      <div className="bg-card rounded-xl border border-border/80 p-4 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in slide-in-from-bottom-1">
                        <div className="space-y-1 flex-1 max-w-lg">
                          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-wide">
                            Reason for Transfer Proposal
                          </label>
                          <textarea
                            rows={1.5}
                            value={transferReason}
                            onChange={(e) => setTransferReason(e.target.value)}
                            placeholder="e.g. Promotion, performance-based relocation..."
                            className="w-full p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs font-semibold focus:outline-none focus:border-primary placeholder:font-normal"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewTransferOpen(false);
                              setSelectedEmp(null);
                              setEmpSearchQuery("");
                              setTransferReason("");
                            }}
                            className="h-10 px-5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-black text-xs uppercase tracking-wider transition"
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

            {/* ============================== INTERACTIVE LETTER PREVIEW OVERLAY / CANVAS ============================== */}
            {selectedLetterLog && (
              <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 md:p-6 print:relative print:inset-auto print:bg-white print:p-0 print:z-auto">
                <div className="bg-card w-full max-w-5xl h-[85vh] rounded-2xl border border-border/80 shadow-2xl flex flex-col overflow-hidden print:w-full print:h-auto print:rounded-none print:border-none print:shadow-none print:overflow-visible">
                  
                  {/* Modal Header */}
                  <div className="px-5 py-4 border-b border-border/40 bg-muted/10 flex items-center justify-between shrink-0 print:hidden">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4.5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-wider text-foreground">
                        Corporate Transfer Order Draft
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedLetterLog(null)}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="size-4.5" />
                    </button>
                  </div>

                  {/* Modal Content body (Side-by-side: Editor on left, Preview on right) */}
                  <div className="flex-1 flex overflow-hidden p-5 gap-5 print:p-0 print:block">
                    
                    {/* Left: Interactive Template Editor Fields (Width 40%) */}
                    <div className="w-[38%] overflow-y-auto space-y-4 pr-2 border-r border-border/40 print:hidden">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block mb-1">
                        Template Customizer
                      </span>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase">Reference No</label>
                        <input
                          type="text"
                          value={letterRefNo}
                          onChange={(e) => setLetterRefNo(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-semibold outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase">Subject Line</label>
                        <input
                          type="text"
                          value={letterSubject}
                          onChange={(e) => setLetterSubject(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-semibold outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase">Letter Body Text</label>
                        <textarea
                          rows={6}
                          value={letterBody}
                          onChange={(e) => setLetterBody(e.target.value)}
                          className="w-full p-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-semibold outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase">Authorized Signatory</label>
                        <input
                          type="text"
                          value={letterSignatory}
                          onChange={(e) => setLetterSignatory(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-semibold outline-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleTriggerPrint}
                          className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Printer className="size-4" /> Trigger System Print
                        </button>
                      </div>
                    </div>

                    {/* Right: Live A4 Printable Preview Page Canvas (Width 62%) */}
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 overflow-y-auto rounded-xl flex justify-center border border-border/40 print:p-0 print:bg-white print:border-none print:w-full">
                      
                      {/* Document Sheet */}
                      <div className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-12 relative shadow-md print:shadow-none print:p-4 print:w-full print:min-h-0 print:bg-white leading-relaxed">
                        
                        {/* Company Letterhead */}
                        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">PAKIZA GROUP</h2>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Human Resources & Compliance Division</p>
                            <p className="text-[8px] text-slate-400 mt-0.5">Pakiza Tower, Dhaka HQ, Bangladesh</p>
                          </div>
                          
                          <div className="border-l border-slate-300 pl-4 text-right">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-800">Office Order</span>
                          </div>
                        </div>

                        {/* Date and Ref No */}
                        <div className="flex justify-between text-[10px] text-slate-600 font-bold mb-6">
                          <div>Ref: <span className="font-mono text-slate-900 font-bold">{letterRefNo}</span></div>
                          <div>Date: <span className="text-slate-900">{selectedLetterLog.transferDate}</span></div>
                        </div>

                        {/* Recipient Details */}
                        <div className="text-[10px] text-slate-800 space-y-1 mb-6">
                          <div className="font-bold text-slate-500">To,</div>
                          <div className="text-xs font-black text-slate-900">{selectedLetterLog.name}</div>
                          <div>Employee ID: <span className="font-mono font-bold">{selectedLetterLog.empId}</span></div>
                          <div>Current Designation: <span className="font-semibold">{selectedLetterLog.oldDesignation}</span></div>
                          <div>Current Placement: <span className="font-semibold">{selectedLetterLog.oldDept}</span></div>
                        </div>

                        {/* Subject */}
                        <div className="text-[11px] font-black uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-4 text-slate-900">
                          Subject: {letterSubject}
                        </div>

                        {/* Salutation */}
                        <div className="text-[10.5px] text-slate-800 font-semibold mb-3">
                          Dear {selectedLetterLog.name.split(" ")[0] || "Employee"},
                        </div>

                        {/* Body Text */}
                        <p className="text-[10.5px] text-slate-700 leading-relaxed mb-6 font-medium whitespace-pre-line">
                          {letterBody}
                        </p>

                        {/* Comparative Posting Details Table */}
                        <div className="mb-8">
                          <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2">New Posting Structure Details:</div>
                          <table className="w-full border-collapse border border-slate-300 text-[10px] font-semibold text-left">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-black">
                                <th className="px-3 py-2 border-r border-slate-300">Attribute Field</th>
                                <th className="px-3 py-2 border-r border-slate-300">Previous Placement</th>
                                <th className="px-3 py-2">Proposed Placement</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-800">
                              <tr>
                                <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">Company Name</td>
                                <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">{selectedLetterLog.oldCompany}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{selectedLetterLog.newCompany}</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">Placement Area</td>
                                <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">{selectedLetterLog.oldArea}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{selectedLetterLog.newArea}</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">Department</td>
                                <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">{selectedLetterLog.oldDept}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{selectedLetterLog.newDept}</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">Designation / Title</td>
                                <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">{selectedLetterLog.oldDesignation}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{selectedLetterLog.newDesignation}</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 border-r border-slate-300 font-bold bg-slate-50/50">Shift Code</td>
                                <td className="px-3 py-1.5 border-r border-slate-300 text-slate-500 line-through">{selectedLetterLog.oldShift}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{selectedLetterLog.newShift}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Signoff */}
                        <div className="text-[10px] text-slate-700 leading-normal mb-12">
                          Please report to your new station on the morning of <span className="font-bold text-slate-900">{selectedLetterLog.transferDate}</span>. We wish you continued success in your new assignment.
                        </div>

                        {/* Signatures block */}
                        <div className="mt-16 flex justify-between text-[10px] font-bold text-slate-800">
                          <div className="space-y-6">
                            <div className="border-t border-slate-400 pt-1.5 w-36 text-center">Prepared By (HR Officer)</div>
                          </div>
                          <div className="space-y-6 text-right">
                            <div className="font-bold text-slate-900">{letterSignatory}</div>
                            <div className="border-t border-slate-400 pt-1.5 w-44 text-center">Authorized Signature</div>
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
      </main>
    </div>
  );
}
