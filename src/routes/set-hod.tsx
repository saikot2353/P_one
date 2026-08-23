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
  Cpu,
  Eye,
  Settings,
  CheckCircle2,
  ListFilter,
  DollarSign,
  AlertCircle,
  Briefcase,
  Calendar,
  Save,
  CheckCircle,
  FileText,
  UserCheck,
  Building,
  History,
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export const Route = createFileRoute("/set-hod")({
  head: () => ({
    meta: [
      { title: "Set HOD — CRIPTON" },
      { name: "description", content: "Bulk assign Head of Department (HOD) department wise." }
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

function SetHodPage() {
  const [selectedDept, setSelectedDept] = useState("Garment (Unit-2)");
  const [searchedDept, setSearchedDept] = useState("Garment (Unit-2)");

  // HOD Assignment state
  const [hodHistory, setHodHistory] = useState<HODRecord[]>([
    { id: "hod-1", department: "HR", empId: "2022035599", empName: "Tahmid Afsar Shapno", designation: "HR Director", assignedDate: "2024-01-01", status: "Active", remarks: "Initial assignment" },
    { id: "hod-2", department: "Sales", empId: "2021032646", empName: "Sadiqul Islam", designation: "Deputy Manager", assignedDate: "2023-06-15", status: "Active", remarks: "Assigned by Board" },
    { id: "hod-3", department: "Dyeing", empId: "2023051028", empName: "Dipon Saha", designation: "Manager", assignedDate: "2025-05-10", status: "Active", remarks: "Department restructuring" },
    { id: "hod-4", department: "Garment (Unit-2)", empId: "2024010502", empName: "Md. Karim Uddin", designation: "Senior Operator", assignedDate: "2025-10-01", status: "Inactive", remarks: "Promoted elsewhere" },
    { id: "hod-5", department: "Garment (Unit-2)", empId: "2023046001", empName: "Sohanur Rahman Sohan", designation: "Executive", assignedDate: "2026-02-01", status: "Active", remarks: "Assigned after Karim" },
  ]);

  // Form Fields
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [assignDate, setAssignDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignStatus, setAssignStatus] = useState<"Active" | "Inactive">("Active");
  const [remarks, setRemarks] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Candidates for selected department
  const eligibleCandidates = useMemo(() => {
    return mockEmployeesList.filter((emp) => emp.department === searchedDept);
  }, [searchedDept]);

  // Current Active HOD of searched department
  const currentHOD = useMemo(() => {
    return hodHistory.find((hod) => hod.department === searchedDept && hod.status === "Active");
  }, [hodHistory, searchedDept]);

  // Trigger search department HOD status
  const handleSearchDept = () => {
    setSearchedDept(selectedDept);
    setSelectedEmpId("");
    setRemarks("");
    showToast(`Loaded Head of Department configurations for ${selectedDept}`);
  };

  // Submit new assignment
  const handleAssignHOD = () => {
    if (!selectedEmpId) {
      alert("Please select a candidate employee to set as HOD.");
      return;
    }

    const employeeObj = mockEmployeesList.find((e) => e.id === selectedEmpId);
    if (!employeeObj) return;

    // If active HOD exists and we are assigning a new HOD as Active:
    // Deactivate previous HOD automatically to ensure single HOD per department
    let updatedHistory = [...hodHistory];
    if (assignStatus === "Active") {
      updatedHistory = updatedHistory.map((hod) => {
        if (hod.department === searchedDept && hod.status === "Active") {
          return { ...hod, status: "Inactive" as const };
        }
        return hod;
      });
    }

    const newHODRecord: HODRecord = {
      id: `hod-${Date.now()}`,
      department: searchedDept,
      empId: selectedEmpId,
      empName: employeeObj.name,
      designation: employeeObj.designation,
      assignedDate: assignDate,
      status: assignStatus,
      remarks: remarks.trim() || undefined,
    };

    setHodHistory([newHODRecord, ...updatedHistory]);
    setSelectedEmpId("");
    setRemarks("");
    showToast(`HOD assigned successfully: ${employeeObj.name} is now HOD of ${searchedDept}`);
  };

  // Toggle HOD status manually
  const toggleHODStatus = (id: string) => {
    const record = hodHistory.find((r) => r.id === id);
    if (!record) return;

    const currentStatus = record.status;
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // If making it Active, ensure no other HOD is active in that department
    let updated = [...hodHistory];
    if (nextStatus === "Active") {
      updated = updated.map((hod) => {
        if (hod.department === record.department && hod.status === "Active") {
          return { ...hod, status: "Inactive" as const };
        }
        return hod;
      });
    }

    setHodHistory(
      updated.map((hod) => (hod.id === id ? { ...hod, status: nextStatus } : hod))
    );
    showToast(`Toggled HOD status for ${record.empName} to ${nextStatus}`);
  };

  // Delete registry entry
  const handleDeleteHOD = (id: string) => {
    if (confirm("Are you sure you want to delete this HOD assignment record?")) {
      setHodHistory(hodHistory.filter((hod) => hod.id !== id));
      showToast("HOD assignment record removed successfully.");
    }
  };

  // Table filtering
  const filteredHistory = useMemo(() => {
    if (!tableSearch.trim()) return hodHistory;
    const query = tableSearch.toLowerCase();
    return hodHistory.filter(
      (hod) =>
        hod.empName.toLowerCase().includes(query) ||
        hod.empId.toLowerCase().includes(query) ||
        hod.department.toLowerCase().includes(query) ||
        hod.designation.toLowerCase().includes(query)
    );
  }, [hodHistory, tableSearch]);

  const handlePdfExport = () => {
    window.print();
  };

  const handleExcelExport = () => {
    const headers = ["SL", "Department", "HOD Name", "Employee ID", "Designation", "Assigned Date", "Status", "Remarks"];
    const rows = filteredHistory.map((row, index) => [
      (index + 1).toString(),
      row.department,
      row.empName,
      row.empId,
      row.designation,
      row.assignedDate,
      row.status,
      row.remarks || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HOD_assignment_logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                Bulk assign and configuration management of HODs department-wise
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs">
              <div className="text-[9px] font-bold uppercase tracking-wider text-primary">
                Active Assignments
              </div>
              <div className="text-sm font-extrabold text-primary mt-0.5">
                {hodHistory.filter((h) => h.status === "Active").length}
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

          {/* 1. DEPARTMENT SELECTOR CONSOLE */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden font-sans">
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <ListFilter className="size-4.5 text-primary" />
              <span>Department Selection Console</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-end gap-4 max-w-xl">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Select Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearchDept}
                className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary-glow text-primary-foreground text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Search className="size-3.5" /> Load HOD
              </button>
            </div>
          </div>

          {/* 2. DUAL COLUMN DETAILS & ASSIGNMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
            {/* Left Column: Current HOD Card */}
            <div className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden h-full min-h-[295px] flex flex-col justify-between">
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-amber-500/10 via-amber-500/45 to-amber-500/10" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <UserCheck className="size-4.5 text-amber-500" />
                  <span>Current Head of Department</span>
                </h3>

                {currentHOD ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/30 border border-border/20 rounded-xl">
                      <div className="size-12 bg-primary/15 border border-primary/20 text-primary flex items-center justify-center text-sm font-extrabold rounded-full">
                        {currentHOD.empName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-foreground">{currentHOD.empName}</div>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          ID: <span className="font-mono">{currentHOD.empId}</span> • {currentHOD.designation}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="bg-muted/15 border border-border/10 p-2.5 rounded-lg">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Department</div>
                        <div className="font-semibold text-foreground mt-0.5">{currentHOD.department}</div>
                      </div>
                      <div className="bg-muted/15 border border-border/10 p-2.5 rounded-lg">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Date</div>
                        <div className="font-semibold text-foreground mt-0.5">{currentHOD.assignedDate}</div>
                      </div>
                    </div>

                    {currentHOD.remarks && (
                      <div className="bg-muted/20 border border-border/10 p-3 rounded-lg text-xs">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Remarks</div>
                        <div className="text-foreground/80 mt-0.5 italic">"{currentHOD.remarks}"</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/60">
                    <AlertCircle className="size-8 text-muted-foreground/30 mb-2" />
                    <div className="text-xs font-extrabold uppercase tracking-wide">No Active HOD assigned</div>
                    <div className="text-[10px] mt-1 font-medium">Use the form on the right to assign a new HOD.</div>
                  </div>
                )}
              </div>

              {currentHOD && (
                <div className="pt-4 border-t border-border/30 mt-4 flex justify-end">
                  <button
                    onClick={() => toggleHODStatus(currentHOD.id)}
                    className="h-8.5 px-4 bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 text-[10px] font-extrabold rounded-lg transition uppercase flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Deactivate HOD
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Assign New HOD Form */}
            <div className="lg:col-span-7 bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-success/10 via-success/45 to-success/10" />
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                <Plus className="size-4.5 text-success" />
                <span>Assign New Head of Department ({searchedDept})</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Employee Candidate */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Select Candidate <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                    >
                      <option value="">-- Choose Candidate --</option>
                      {eligibleCandidates.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assign Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={assignStatus}
                      onChange={(e) => setAssignStatus(e.target.value as "Active" | "Inactive")}
                      className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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

                  {/* Empty Spacer */}
                  <div className="hidden sm:block" />

                  {/* Remarks Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Remarks / Directives
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Set as HOD for project coordination"
                      className="w-full min-h-[80px] p-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAssignHOD}
                    className="w-full sm:w-auto h-10 px-8 bg-success hover:bg-success-glow text-white text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="size-3.5" /> Assign HOD
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ASSIGNMENT HISTORY REGISTER LOG */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-5 space-y-4 font-sans">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <History className="size-4.5 text-primary" />
              <span>HOD Assignment Registry & History Log</span>
            </h3>

            {/* Registry Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
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
              </div>

              {/* Table search filter */}
              <div className="w-full sm:w-64 relative">
                <input
                  type="text"
                  placeholder="Search log history..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full h-9 pl-8.5 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Scroll table */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-12 text-center">SL</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">HOD Name</th>
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Assigned Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Remarks</th>
                    <th className="p-3 w-24 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="p-10 text-center text-muted-foreground/60 font-medium"
                      >
                        <AlertCircle className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                        No HOD records found
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((row, index) => {
                      const isActive = row.status === "Active";
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/30 transition duration-150"
                        >
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3">{row.department}</td>
                          <td className="p-3 text-foreground">{row.empName}</td>
                          <td className="p-3 font-mono text-[11px] font-bold text-foreground">
                            {row.empId}
                          </td>
                          <td className="p-3">{row.designation}</td>
                          <td className="p-3">{row.assignedDate}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                isActive
                                  ? "bg-success/15 text-success"
                                  : "bg-muted text-muted-foreground/70"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="p-3 max-w-[200px] truncate text-muted-foreground">
                            {row.remarks || "—"}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleHODStatus(row.id)}
                                title={isActive ? "Deactivate" : "Activate"}
                                className={`p-1 rounded hover:bg-muted transition cursor-pointer ${
                                  isActive ? "text-success hover:text-rose-500" : "text-muted-foreground hover:text-success"
                                }`}
                              >
                                {isActive ? (
                                  <ToggleRight className="size-5" />
                                ) : (
                                  <ToggleLeft className="size-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteHOD(row.id)}
                                title="Delete Record"
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                              >
                                <Trash2 className="size-4.5" />
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

            {/* Registry summary */}
            <div className="text-xs text-muted-foreground font-semibold pt-1">
              Showing 1 to {filteredHistory.length} of {filteredHistory.length} HOD history logs
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
