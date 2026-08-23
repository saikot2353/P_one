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
  UserCheck,
  History,
  Clock
} from "lucide-react";

export const Route = createFileRoute("/set-hod")({
  head: () => ({
    meta: [
      { title: "Set HOD — CRIPTON" },
      { name: "description", content: "Assign Head of Department (HOD) department wise." }
    ],
  }),
  component: SetHodPage,
});

interface EmployeeRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
}

interface HODRecord {
  id: string;
  department: string;
  empId: string;
  empName: string;
  designation: string;
  assignedDate: string;
  status: "Active" | "Inactive";
  remarks?: string;
}

const mockEmployeesList: EmployeeRecord[] = [
  { id: "2022035599", name: "Tahmid Afsar Shapno", designation: "HR Director", department: "HR" },
  { id: "2021032646", name: "Sadiqul Islam", designation: "Deputy Manager", department: "Sales" },
  { id: "2023051028", name: "Dipon Saha", designation: "Manager", department: "Dyeing" },
  { id: "2023046001", name: "Sohanur Rahman Sohan", designation: "Executive", department: "HR" },
  { id: "2024010502", name: "Md. Karim Uddin", designation: "Senior Operator", department: "Garment (Unit-2)" },
  { id: "2024010503", name: "Md. Jamil Hossain", designation: "Operator", department: "Garment (Unit-2)" },
  { id: "2024031508", name: "Rina Begum", designation: "Helper", department: "Garment (Unit-2)" },
  { id: "2025021811", name: "Fatema Khatun", designation: "Ironer", department: "Garment (Unit-2)" },
  { id: "2023021944", name: "Kamal Uddin", designation: "Lead Engineer", department: "IT" },
  { id: "2022041289", name: "Rahim Ali", designation: "Finance Head", department: "Finance" },
];

const allDepartments = ["Garment (Unit-2)", "Dyeing", "Knitting", "HR", "Sales", "IT", "Finance"];

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

function SetHodPage() {
  // Current active HODs map by department
  const [hodHistory, setHodHistory] = useState<HODRecord[]>([
    { id: "hod-1", department: "HR", empId: "2022035599", empName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2024-01-01", status: "Active", remarks: "Initial assignment" },
    { id: "hod-2", department: "Sales", empId: "2021032646", empName: "Sadiqul Islam", designation: "Deputy Manager", assignedDate: "2023-06-15", status: "Active", remarks: "Assigned by Board" },
    { id: "hod-3", department: "Dyeing", empId: "2023051028", empName: "Dipon Saha", designation: "Manager", assignedDate: "2025-05-10", status: "Active", remarks: "Department restructuring" },
    { id: "hod-4", department: "Garment (Unit-2)", empId: "2024010502", empName: "Md. Karim Uddin", designation: "Senior Operator", assignedDate: "2025-10-01", status: "Inactive", remarks: "Promoted elsewhere" },
    { id: "hod-5", department: "Garment (Unit-2)", empId: "2023046001", empName: "Sohanur Rahman Sohan", designation: "Executive", assignedDate: "2026-02-01", status: "Active", remarks: "Assigned after Karim" },
  ]);

  // Modal configuration states
  const [modalDept, setModalDept] = useState<string | null>(null);
  const [historyModalDept, setHistoryModalDept] = useState<string | null>(null);

  // Form Fields
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [assignDate, setAssignDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState("");
  const [searchText, setSearchText] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to resolve current Active HOD details for any department
  const resolveActiveHOD = (deptName: string) => {
    return hodHistory.find((hod) => hod.department === deptName && hod.status === "Active");
  };

  // Open modal config
  const openSetHODModal = (dept: string) => {
    setModalDept(dept);
    const existing = resolveActiveHOD(dept);
    if (existing) {
      setSelectedEmpId(existing.empId);
      setAssignDate(existing.assignedDate);
      setRemarks(existing.remarks || "");
    } else {
      setSelectedEmpId("");
      setAssignDate(new Date().toISOString().slice(0, 10));
      setRemarks("");
    }
  };

  // Save new HOD configuration
  const handleSaveHOD = () => {
    if (!modalDept) return;
    if (!selectedEmpId) {
      alert("Please select a candidate employee to set as HOD.");
      return;
    }

    const employeeObj = mockEmployeesList.find((e) => e.id === selectedEmpId);
    if (!employeeObj) return;

    // Deactivate previous active HOD
    const updatedHistory = hodHistory.map((hod) => {
      if (hod.department === modalDept && hod.status === "Active") {
        return { ...hod, status: "Inactive" as const };
      }
      return hod;
    });

    const newHODRecord: HODRecord = {
      id: `hod-${Date.now()}`,
      department: modalDept,
      empId: selectedEmpId,
      empName: employeeObj.name,
      designation: employeeObj.designation,
      assignedDate: assignDate,
      status: "Active",
      remarks: remarks.trim() || undefined,
    };

    setHodHistory([newHODRecord, ...updatedHistory]);
    setModalDept(null);
    showToast(`HOD updated successfully for department: ${modalDept}`);
  };

  // Candidates for currently active modal department
  const eligibleCandidates = useMemo(() => {
    if (!modalDept) return [];
    return mockEmployeesList.filter((emp) => emp.department === modalDept);
  }, [modalDept]);

  // Master departments filter search
  const filteredDepartments = useMemo(() => {
    if (!searchText.trim()) return allDepartments;
    const query = searchText.toLowerCase();
    return allDepartments.filter((deptName) => {
      const activeHOD = resolveActiveHOD(deptName);
      return (
        deptName.toLowerCase().includes(query) ||
        (activeHOD && activeHOD.empName.toLowerCase().includes(query)) ||
        (activeHOD && activeHOD.empId.toLowerCase().includes(query))
      );
    });
  }, [searchText, hodHistory]);

  // History timeline with duration calculations for selected department
  const calculatedDeptHistory = useMemo(() => {
    if (!historyModalDept) return [];

    // Filter and sort chronologically ascending
    const deptHistory = hodHistory
      .filter((h) => h.department === historyModalDept)
      .sort((a, b) => new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime());

    return deptHistory.map((record, index) => {
      let endDateStr = "Present";
      
      if (index < deptHistory.length - 1) {
        endDateStr = deptHistory[index + 1].assignedDate;
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
  }, [hodHistory, historyModalDept]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Personnel Info</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Set HOD</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Set Head of Department (HOD)
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-5 font-semibold">
                Quickly assign Head of Departments and audit term durations department-wise
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs">
              <div className="text-[9px] font-bold uppercase tracking-wider text-primary">
                Total Departments
              </div>
              <div className="text-sm font-extrabold text-primary mt-0.5">
                {allDepartments.length}
              </div>
            </div>
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

          {/* MASTER DEPARTMENTS MASTER PANEL */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                <Building className="size-4.5 text-primary" />
                <span>Department List & HOD Status</span>
              </h3>

              {/* Table search filter */}
              <div className="w-full sm:w-64 relative">
                <input
                  type="text"
                  placeholder="Search department or HOD..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full h-9 pl-8.5 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Grid Scroll Table */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-12 text-center">SL</th>
                    <th className="p-3">Department Name</th>
                    <th className="p-3">Current Active HOD</th>
                    <th className="p-3">HOD Employee ID</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Assigned Date</th>
                    <th className="p-3 w-28 text-center">Status</th>
                    <th className="p-3 w-56 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {filteredDepartments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-10 text-center text-muted-foreground/60 font-medium"
                      >
                        <AlertCircle className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                        No departments matched your query
                      </td>
                    </tr>
                  ) : (
                    filteredDepartments.map((deptName, index) => {
                      const activeHOD = resolveActiveHOD(deptName);
                      return (
                        <tr
                          key={deptName}
                          className="hover:bg-muted/30 transition duration-150 cursor-pointer"
                          onClick={() => openSetHODModal(deptName)}
                        >
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3 font-extrabold text-foreground">{deptName}</td>
                          <td className="p-3">
                            {activeHOD ? (
                              <div className="flex items-center gap-2">
                                <div className="size-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-extrabold">
                                  {activeHOD.empName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                </div>
                                <span className="font-bold">{activeHOD.empName}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50 font-normal">Not Assigned</span>
                            )}
                          </td>
                          <td className="p-3 font-mono">
                            {activeHOD ? activeHOD.empId : "—"}
                          </td>
                          <td className="p-3">
                            {activeHOD ? activeHOD.designation : "—"}
                          </td>
                          <td className="p-3">
                            {activeHOD ? activeHOD.assignedDate : "—"}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                activeHOD
                                  ? "bg-success/15 text-success"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {activeHOD ? "Active" : "Unassigned"}
                            </span>
                          </td>
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openSetHODModal(deptName)}
                                className="h-7.5 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-extrabold rounded-lg transition uppercase flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Settings className="size-3.5" /> Set HOD
                              </button>
                              <button
                                onClick={() => setHistoryModalDept(deptName)}
                                className="h-7.5 px-3 bg-muted hover:bg-muted/70 text-foreground text-[10px] font-bold rounded-lg transition uppercase flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <History className="size-3.5 text-muted-foreground" /> History
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* --- LIGHTWEIGHT ASSIGN HOD MODAL OVERLAY --- */}
      {modalDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Set HOD: {modalDept}</h3>
              </div>
              <button
                onClick={() => setModalDept(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Current Active HOD Alert Banner */}
            {resolveActiveHOD(modalDept) ? (
              <div className="p-3 bg-muted/40 border border-border/30 rounded-xl text-xs text-foreground flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-success animate-pulse" />
                <div>
                  <span className="font-extrabold text-muted-foreground">Current Active HOD: </span>
                  <span className="font-bold text-foreground">{resolveActiveHOD(modalDept)!.empName}</span> ({resolveActiveHOD(modalDept)!.designation})
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/5 border border-amber-500/25 rounded-xl text-xs text-amber-600 dark:text-amber-500 flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <span className="font-extrabold">Current Status: </span>
                  <span>No active HOD assigned.</span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Select Candidate dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Select HOD Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="">-- Select Candidate --</option>
                  {eligibleCandidates.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Effective Assignment Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Effective Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                />
              </div>

              {/* Remarks/Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Appointed during Board Meeting"
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
              <button
                onClick={() => setModalDept(null)}
                className="h-9 px-5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHOD}
                className="h-9 px-5 bg-success hover:bg-success-glow text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="size-3.5" /> Save HOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TIMELINE HISTORY DIALOG MODAL --- */}
      {historyModalDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-2xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">HOD Assignment History: {historyModalDept}</h3>
              </div>
              <button
                onClick={() => setHistoryModalDept(null)}
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
                    <th className="p-3">HOD Name</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">End Date</th>
                    <th className="p-3 flex items-center gap-1"><Clock className="size-3 text-muted-foreground" /> Duration</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {calculatedDeptHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground/60 font-medium">
                        No HOD history logs found for {historyModalDept}
                      </td>
                    </tr>
                  ) : (
                    calculatedDeptHistory.map((row, index) => {
                      const isActive = row.status === "Active";
                      return (
                        <tr key={row.id} className="hover:bg-muted/30 transition duration-150">
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3 text-foreground font-bold">{row.empName}</td>
                          <td className="p-3 font-mono text-[11px] text-muted-foreground">{row.empId}</td>
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
                onClick={() => setHistoryModalDept(null)}
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
