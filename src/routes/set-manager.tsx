import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  X,
  User,
  Plus,
  ChevronDown,
  Settings,
  CheckCircle2,
  ListFilter,
  AlertCircle,
  Building,
  Save,
  UserPlus,
  Check,
  Calendar,
  Users,
  History,
  Clock
} from "lucide-react";

export const Route = createFileRoute("/set-manager")({
  head: () => ({
    meta: [
      { title: "Set Manager — CRIPTON" },
      { name: "description", content: "Bulk assign reporting managers to employees." }
    ],
  }),
  component: SetManagerPage,
});

interface EmployeeRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  currentManagerId?: string;
  currentManagerName?: string;
  assignedDate?: string;
}

interface ManagerHistoryRecord {
  id: string;
  empId: string;
  managerId: string;
  managerName: string;
  designation: string;
  assignedDate: string;
  status: "Active" | "Inactive";
  remarks?: string;
}

const mockEmployeesList: EmployeeRecord[] = [
  { id: "2022035599", name: "Tahmid Afsar Shapno", designation: "HR Director", department: "HR", currentManagerId: "—", currentManagerName: "—", assignedDate: "—" },
  { id: "2021032646", name: "Sadiqul Islam", designation: "Deputy Manager", department: "Sales", currentManagerId: "2022035599", currentManagerName: "Tahmid Afsar Shapno", assignedDate: "2024-01-15" },
  { id: "2023051028", name: "Dipon Saha", designation: "Manager", department: "Dyeing", currentManagerId: "2022035599", currentManagerName: "Tahmid Afsar Shapno", assignedDate: "2025-05-10" },
  { id: "2023046001", name: "Sohanur Rahman Sohan", designation: "Executive", department: "HR", currentManagerId: "2022035599", currentManagerName: "Tahmid Afsar Shapno", assignedDate: "2024-11-01" },
  { id: "2024010502", name: "Md. Karim Uddin", designation: "Senior Operator", department: "Garment (Unit-2)", currentManagerId: "2021032646", currentManagerName: "Sadiqul Islam", assignedDate: "2025-02-18" },
  { id: "2024010503", name: "Md. Jamil Hossain", designation: "Operator", department: "Garment (Unit-2)", currentManagerId: "2021032646", currentManagerName: "Sadiqul Islam", assignedDate: "2025-02-18" },
  { id: "2024031508", name: "Rina Begum", designation: "Helper", department: "Garment (Unit-2)", currentManagerId: "2024010502", currentManagerName: "Md. Karim Uddin", assignedDate: "2025-10-01" },
  { id: "2025021811", name: "Fatema Khatun", designation: "Ironer", department: "Garment (Unit-2)", currentManagerId: "2024010502", currentManagerName: "Md. Karim Uddin", assignedDate: "2025-10-01" },
  { id: "2023021944", name: "Kamal Uddin", designation: "Lead Engineer", department: "IT", currentManagerId: "2022035599", currentManagerName: "Tahmid Afsar Shapno", assignedDate: "2023-08-01" },
  { id: "2022041289", name: "Rahim Ali", designation: "Finance Head", department: "Finance", currentManagerId: "2022035599", currentManagerName: "Tahmid Afsar Shapno", assignedDate: "2022-04-12" },
];

const allDepartments = ["Garment (Unit-2)", "Dyeing", "Knitting", "HR", "Sales", "IT", "Finance"];
const allDesignations = ["HR Director", "Deputy Manager", "Manager", "Senior Operator", "Operator", "Helper", "Ironer", "Lead Engineer", "Finance Head", "Executive"];

// Managers eligible to be assigned
const eligibleManagersList = [
  { id: "2022035599", name: "Tahmid Afsar Shapno", designation: "HR Director" },
  { id: "2021032646", name: "Sadiqul Islam", designation: "Deputy Manager" },
  { id: "2023051028", name: "Dipon Saha", designation: "Manager" },
  { id: "2024010502", name: "Md. Karim Uddin", designation: "Senior Operator" },
  { id: "2022041289", name: "Rahim Ali", designation: "Finance Head" },
];

// Helper to calculate duration in years, months, days
function calculateDuration(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = endStr === "Present" ? new Date() : new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "—";

  let diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) diffMs = 0;
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "1 Day";
  
  const years = Math.floor(diffDays / 365);
  const remainingDays = diffDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} Yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} Mo${months > 1 ? "s" : ""}`);
  if (days > 0 && years === 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);

  return parts.join(" ") || "1 Day";
}

function SetManagerPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(mockEmployeesList);

  // Manager Assignment Registry Database
  const [managerHistory, setManagerHistory] = useState<ManagerHistoryRecord[]>([
    { id: "mh-1", empId: "2021032646", managerId: "2022035599", managerName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2024-01-15", status: "Active", remarks: "Initial reporting manager" },
    { id: "mh-2", empId: "2023051028", managerId: "2022035599", managerName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2025-05-10", status: "Active", remarks: "Reporting to Director" },
    { id: "mh-3", empId: "2023046001", managerId: "2021032646", managerName: "Sadiqul Islam", designation: "Deputy Manager", assignedDate: "2023-01-01", status: "Inactive", remarks: "Reporting during probation" },
    { id: "mh-4", empId: "2023046001", managerId: "2022035599", managerName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2024-11-01", status: "Active", remarks: "Confirmed, moved to Director line" },
    { id: "mh-5", empId: "2024010502", managerId: "2021032646", managerName: "Sadiqul Islam", designation: "Deputy Manager", assignedDate: "2025-02-18", status: "Active", remarks: "Shift coordination supervisor line" },
    { id: "mh-6", empId: "2024010503", managerId: "2021032646", managerName: "Sadiqul Islam", designation: "Deputy Manager", assignedDate: "2025-02-18", status: "Active" },
    { id: "mh-7", empId: "2024031508", managerId: "2024010502", managerName: "Md. Karim Uddin", designation: "Senior Operator", assignedDate: "2025-10-01", status: "Active", remarks: "Operator reporting group" },
    { id: "mh-8", empId: "2025021811", managerId: "2024010502", managerName: "Md. Karim Uddin", designation: "Senior Operator", assignedDate: "2025-10-01", status: "Active" },
    { id: "mh-9", empId: "2023021944", managerId: "2022035599", managerName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2023-08-01", status: "Active", remarks: "Sysadmin reporting line" },
    { id: "mh-10", empId: "2022041289", managerId: "2022035599", managerName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2022-04-12", status: "Active", remarks: "Finance reporting line" }
  ]);
  
  // Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [historyModalEmpId, setHistoryModalEmpId] = useState<string | null>(null);

  const [filterDept, setFilterDept] = useState("Garment (Unit-2)");
  const [modalSearchText, setModalSearchText] = useState("");
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);

  // Assign Target Manager Form States
  const [targetManagerId, setTargetManagerId] = useState("");
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);

  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState("");

  const [searchText, setSearchText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered eligible managers for the searchable select dropdown
  const filteredEligibleManagers = useMemo(() => {
    if (!managerSearchQuery.trim()) return eligibleManagersList;
    const q = managerSearchQuery.toLowerCase();
    
    // Check if query is an exact match for the selected manager
    const selectedManager = eligibleManagersList.find(m => m.id === targetManagerId);
    if (selectedManager && (`${selectedManager.name} (${selectedManager.designation})`).toLowerCase() === q) {
      return eligibleManagersList;
    }

    return eligibleManagersList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q)
    );
  }, [managerSearchQuery, targetManagerId]);

  // Filtered employees listing inside the bulk assign modal (filters + search queries applied)
  const filteredCandidatesInModal = useMemo(() => {
    return employees.filter((emp) => {
      if (filterDept !== "ALL" && emp.department !== filterDept) return false;
      if (modalSearchText.trim()) {
        const q = modalSearchText.toLowerCase();
        return emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [employees, filterDept, modalSearchText]);

  // Master employees list search filter
  const filteredMasterEmployees = useMemo(() => {
    if (!searchText.trim()) return employees;
    const query = searchText.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        (emp.currentManagerName && emp.currentManagerName.toLowerCase().includes(query))
    );
  }, [employees, searchText]);

  // Open modal reset states
  const handleOpenBulkModal = () => {
    setIsBulkModalOpen(true);
    setSelectedEmpIds([]);
    setTargetManagerId("");
    setManagerSearchQuery("");
    setModalSearchText("");
    setRemarks("");
  };

  // Toggle selection for single employee row inside modal
  const toggleSelectEmployee = (id: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all visible employees inside the modal checklist
  const toggleSelectAllVisible = () => {
    if (selectedEmpIds.length === filteredCandidatesInModal.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredCandidatesInModal.map((emp) => emp.id));
    }
  };

  // Apply Manager Assignment in Bulk
  const handleApplyBulkAssignment = () => {
    if (selectedEmpIds.length === 0) {
      alert("Please check at least one employee from the list to assign a manager.");
      return;
    }
    if (!targetManagerId) {
      alert("Please select a manager to assign.");
      return;
    }

    const managerObj = eligibleManagersList.find((m) => m.id === targetManagerId);
    if (!managerObj) return;

    // Update current directories list
    setEmployees((prev) =>
      prev.map((emp) => {
        if (selectedEmpIds.includes(emp.id)) {
          return {
            ...emp,
            currentManagerId: managerObj.id,
            currentManagerName: managerObj.name,
            assignedDate: effectiveDate,
          };
        }
        return emp;
      })
    );

    // Save into history database
    const newRecords: ManagerHistoryRecord[] = selectedEmpIds.map((empId) => {
      // Deactivate previous active manager in history log
      setManagerHistory((prevLog) =>
        prevLog.map((log) => {
          if (log.empId === empId && log.status === "Active") {
            return { ...log, status: "Inactive" as const };
          }
          return log;
        })
      );

      return {
        id: `mh-${Date.now()}-${empId}`,
        empId: empId,
        managerId: managerObj.id,
        managerName: managerObj.name,
        designation: managerObj.designation,
        assignedDate: effectiveDate,
        status: "Active",
        remarks: remarks.trim() || undefined,
      };
    });

    setManagerHistory((prevLog) => [...newRecords, ...prevLog]);

    setIsBulkModalOpen(false);
    showToast(`Bulk manager assignment completed successfully for ${selectedEmpIds.length} employees.`);
  };

  // Resolve dynamic duration logs for manager history modal of selected employee
  const calculatedManagerHistory = useMemo(() => {
    if (!historyModalEmpId) return [];

    // Filter and sort chronologically ascending
    const empHistory = managerHistory
      .filter((h) => h.empId === historyModalEmpId)
      .sort((a, b) => new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime());

    return empHistory.map((record, index) => {
      let endDateStr = "Present";
      
      if (index < empHistory.length - 1) {
        endDateStr = empHistory[index + 1].assignedDate;
      } else if (record.status === "Inactive") {
        endDateStr = "Ended";
      }

      const duration = endDateStr === "Ended" 
        ? "—" 
        : calculateDuration(record.assignedDate, endDateStr);

      return {
        ...record,
        endDate: endDateStr,
        duration: duration,
      };
    }).reverse(); // Show latest first
  }, [managerHistory, historyModalEmpId]);

  // Employee details matching current history modal trigger
  const historyEmployeeDetails = useMemo(() => {
    return employees.find((emp) => emp.id === historyModalEmpId);
  }, [employees, historyModalEmpId]);

  const handlePdfExport = () => {
    window.print();
  };

  const handleExcelExport = () => {
    const headers = ["SL", "Employee ID", "Employee Name", "Department", "Designation", "Assigned Manager", "Manager ID", "Assigned Date"];
    const rows = filteredMasterEmployees.map((row, index) => [
      (index + 1).toString(),
      row.id,
      row.name,
      row.department,
      row.designation,
      row.currentManagerName || "—",
      row.currentManagerId || "—",
      row.assignedDate || "—"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Employee_managers_registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans font-semibold">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Personnel Info</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Set Manager</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Bulk Manager Assignment
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-5 font-semibold">
                View employee reporting structures and assign managers in bulk
              </p>
            </div>
            
            <button
              onClick={handleOpenBulkModal}
              className="h-10 px-5 bg-primary hover:bg-primary-glow text-primary-foreground text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="size-4" /> Assign Manager (Bulk)
            </button>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="size-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-semibold">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white transition">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* MASTER MANAGER DIRECTORY SHEET */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Users className="size-4.5 text-primary" />
                <span>Employee Manager Directory Registry</span>
              </h3>

              {/* Table Toolbar */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <button
                  onClick={handlePdfExport}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5 text-muted-foreground" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExcelExport}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-muted-foreground" />
                  <span>Excel</span>
                </button>
                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    placeholder="Search employee or manager..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full h-9 pl-8.5 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Scrollable table data sheet */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-12 text-center">SL</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Assigned Manager</th>
                    <th className="p-3">Manager ID</th>
                    <th className="p-3">Assigned Date</th>
                    <th className="p-3 w-28 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {filteredMasterEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-muted-foreground/60 font-medium">
                        <AlertCircle className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                        No employees found matching directory search queries
                      </td>
                    </tr>
                  ) : (
                    filteredMasterEmployees.map((emp, index) => (
                      <tr key={emp.id} className="hover:bg-muted/30 transition duration-150">
                        <td className="p-3 text-center">{index + 1}</td>
                        <td className="p-3 font-mono font-bold text-foreground text-[11px]">{emp.id}</td>
                        <td className="p-3 text-foreground">{emp.name}</td>
                        <td className="p-3">{emp.department}</td>
                        <td className="p-3">{emp.designation}</td>
                        <td className="p-3">
                          {emp.currentManagerName && emp.currentManagerName !== "—" ? (
                            <div className="flex items-center gap-2">
                              <div className="size-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-extrabold">
                                {emp.currentManagerName!.split(" ").map(n => n[0]).slice(0,2).join("")}
                              </div>
                              <span className="font-bold text-foreground">{emp.currentManagerName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 font-normal">—</span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{emp.currentManagerId}</td>
                        <td className="p-3">{emp.assignedDate}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setHistoryModalEmpId(emp.id)}
                            className="h-7.5 px-3 bg-muted hover:bg-muted/70 text-foreground text-[10px] font-bold rounded-lg transition uppercase flex items-center justify-center gap-1 cursor-pointer mx-auto"
                          >
                            <History className="size-3.5 text-muted-foreground" /> History
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-muted-foreground font-semibold pt-1">
              Showing 1 to {filteredMasterEmployees.length} of {filteredMasterEmployees.length} employee entries
            </div>
          </div>
        </div>
      </main>

      {/* --- BULK ASSIGNMENT CONSOLE OVERLAY MODAL (LARGER SCREEN: MAX-W-[1350px] AND h-[85vh]) --- */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200 font-sans">
          <div className="bg-card border border-border/80 w-full max-w-[1350px] h-[85vh] mx-4 rounded-2xl p-8 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Bulk Manager Assignment Console</h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
              {/* Left Column: Filter panel & Table list */}
              <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
                <div className="grid grid-cols-2 gap-4 bg-muted/30 border border-border/20 p-3.5 rounded-xl flex-shrink-0">
                  {/* Filter Department */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">
                      Filter Department
                    </label>
                    <select
                      value={filterDept}
                      onChange={(e) => {
                        setFilterDept(e.target.value);
                        setSelectedEmpIds([]);
                      }}
                      className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                    >
                      <option value="ALL">All Departments</option>
                      {allDepartments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Candidate Employee */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">
                      Search Employee
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search name or ID..."
                        value={modalSearchText}
                        onChange={(e) => setModalSearchText(e.target.value)}
                        className="h-9 pl-8 pr-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                      />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Checklist Table - Automatically expands to fill height */}
                <div className="overflow-x-auto border border-border/60 rounded-xl bg-card flex-1 min-h-0 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10">
                        <th className="p-3 w-10 text-center bg-muted">
                          <input
                            type="checkbox"
                            checked={
                              filteredCandidatesInModal.length > 0 &&
                              selectedEmpIds.length === filteredCandidatesInModal.length
                            }
                            onChange={toggleSelectAllVisible}
                            className="accent-primary cursor-pointer rounded"
                          />
                        </th>
                        <th className="p-3 bg-muted">Employee Name (ID)</th>
                        <th className="p-3 bg-muted">Department</th>
                        <th className="p-3 bg-muted">Designation</th>
                        <th className="p-3 bg-muted">Current Manager</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                      {filteredCandidatesInModal.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-muted-foreground/60 font-medium">
                            No employees found matching search/filter criteria
                          </td>
                        </tr>
                      ) : (
                        filteredCandidatesInModal.map((emp) => {
                          const checked = selectedEmpIds.includes(emp.id);
                          return (
                            <tr
                              key={emp.id}
                              className={`hover:bg-muted/30 transition duration-150 cursor-pointer ${
                                checked ? "bg-primary/5" : ""
                              }`}
                              onClick={() => toggleSelectEmployee(emp.id)}
                            >
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleSelectEmployee(emp.id)}
                                  className="accent-primary cursor-pointer rounded"
                                />
                              </td>
                              <td className="p-3">
                                <span className="font-extrabold text-foreground block">{emp.name}</span>
                                <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">{emp.id}</span>
                              </td>
                              <td className="p-3">{emp.department}</td>
                              <td className="p-3">{emp.designation}</td>
                              <td className="p-3 text-muted-foreground">{emp.currentManagerName}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-muted-foreground font-bold flex-shrink-0">
                  {selectedEmpIds.length} of {filteredCandidatesInModal.length} employees checked for assignment
                </div>
              </div>

              {/* Right Column: Configuration form */}
              <div className="lg:col-span-4 bg-muted/25 border border-border/35 p-5 rounded-xl space-y-5 h-full overflow-y-auto flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 pb-2 border-b border-border/30">
                    <Settings className="size-4 text-primary" />
                    <span>Configure Assignment</span>
                  </div>

                  {/* Searchable Target Manager Select */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">
                      Select Target Manager <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type to search manager..."
                        value={managerSearchQuery}
                        onFocus={() => setIsManagerDropdownOpen(true)}
                        onBlur={() => {
                          setTimeout(() => setIsManagerDropdownOpen(false), 200);
                        }}
                        onChange={(e) => {
                          setManagerSearchQuery(e.target.value);
                          setIsManagerDropdownOpen(true);
                          if (!e.target.value) {
                            setTargetManagerId("");
                          }
                        }}
                        className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                      />
                      <ChevronDown 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground cursor-pointer"
                        onClick={() => setIsManagerDropdownOpen(!isManagerDropdownOpen)}
                      />
                    </div>

                    {/* Searchable Dropdown menu */}
                    {isManagerDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-lg shadow-xl divide-y divide-border/40">
                        {filteredEligibleManagers.length === 0 ? (
                          <div className="p-3 text-xs text-muted-foreground italic">No managers found</div>
                        ) : (
                          filteredEligibleManagers.map((m) => (
                            <div
                              key={m.id}
                              onMouseDown={() => {
                                setTargetManagerId(m.id);
                                setManagerSearchQuery(`${m.name} (${m.designation})`);
                                setIsManagerDropdownOpen(false);
                              }}
                              className={`p-2.5 text-xs font-semibold cursor-pointer hover:bg-muted/50 transition flex items-center justify-between ${
                                targetManagerId === m.id ? "text-primary bg-primary/5" : "text-foreground"
                              }`}
                            >
                              <div>
                                <div className="font-extrabold">{m.name}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{m.designation} • ID: {m.id}</div>
                              </div>
                              {targetManagerId === m.id && <Check className="size-3.5 text-primary" />}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Effective Assignment Date */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">
                      Effective Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                    />
                  </div>

                  {/* Remarks/Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold text-muted-foreground uppercase block">
                      Remarks / Directives
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Assigned as reporting line"
                      className="h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/20">
                  <button
                    onClick={handleApplyBulkAssignment}
                    className="w-full h-10 bg-success hover:bg-success-glow text-white text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" /> Apply Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MANAGER ASSIGNMENT TIMELINE HISTORY MODAL (LARGER SCREEN: MAX-W-5XL) --- */}
      {historyModalEmpId && historyEmployeeDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-5xl mx-4 rounded-2xl p-8 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">
                  Manager Assignment History: {historyEmployeeDetails.name} ({historyEmployeeDetails.id})
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalEmpId(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card max-h-80 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-12 text-center">SL</th>
                    <th className="p-3">Manager Name</th>
                    <th className="p-3">Manager ID</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3 flex items-center gap-1"><Clock className="size-3 text-muted-foreground" /> Duration</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {calculatedManagerHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground/60 font-medium">
                        No manager reporting history logs found for this employee.
                      </td>
                    </tr>
                  ) : (
                    calculatedManagerHistory.map((row, index) => {
                      const isActive = row.status === "Active";
                      return (
                        <tr key={row.id} className="hover:bg-muted/30 transition duration-150">
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3 text-foreground font-bold">{row.managerName}</td>
                          <td className="p-3 font-mono text-[11px] text-muted-foreground">{row.managerId}</td>
                          <td className="p-3 text-muted-foreground">{row.designation}</td>
                          <td className="p-3 font-semibold">{row.assignedDate}</td>
                          <td className="p-3 text-muted-foreground">{row.endDate}</td>
                          <td className="p-3 text-primary font-black">{row.duration}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                isActive
                                  ? "bg-success/15 text-success"
                                  : "bg-muted text-muted-foreground/75"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
              <button
                onClick={() => setHistoryModalEmpId(null)}
                className="h-9 px-5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
