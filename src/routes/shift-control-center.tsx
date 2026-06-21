import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Clock, ChevronRight, ListFilter, Check, FileSpreadsheet, Printer, FileDown, 
  AlertCircle, Search, SlidersHorizontal, Trash2, RefreshCw, Sparkles, Calendar,
  UserCheck, Users, X, Info
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/shift-control-center")({
  head: () => ({
    meta: [
      { title: "Shift Control Center — CRIPTON" },
      { name: "description", content: "Simplified, practical Shift and Duty Roster management workspace." },
    ],
  }),
  component: ShiftControlCenterPage,
});

// Premium Mock Data matching user’s system style
interface Employee {
  id: string;
  name: string;
  dept: string;
  designation: string;
  unit: string;
  line: string;
  type: string;
  currentShift: string;
}

interface RosterLog {
  id: string;
  empId: string;
  name: string;
  dept: string;
  baseShift: string;
  assignedShift: string;
  startDate: string;
  endDate: string;
  type: "Permanent" | "Temporary";
}

const initialEmployees: Employee[] = [
  { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Core Development (HR)", designation: "Asst. Manager", unit: "PSL", line: "N/A", type: "Staff", currentShift: "General Shift" },
  { id: "2022035599", name: "Dipon Saha", dept: "Core Development (HR)", designation: "Manager", unit: "PSL", line: "N/A", type: "Staff", currentShift: "Exe-Ptvl" },
  { id: "2025057309", name: "Bani Amin Jwel", dept: "Core Development (HR)", designation: "Sr. Manager", unit: "PSL", line: "N/A", type: "Staff", currentShift: "General Shift" },
  { id: "2025053125", name: "Al Riyad Karim", dept: "WEB-Team", designation: "Sr. Executive", unit: "PSL", line: "N/A", type: "Staff", currentShift: "General Shift" },
  { id: "2021028542", name: "Zakir Hossain", dept: "Implementation & Support (HR)", designation: "Executive", unit: "PSL", line: "N/A", type: "Staff", currentShift: "Exe-Ptvl" },
  { id: "2024052336", name: "Md. Badal Mia", dept: "Admin", designation: "Driver", unit: "PSL", line: "N/A", type: "Staff", currentShift: "General-Transport" },
  { id: "2026059284", name: "Istiak Ahmed", dept: "Admin", designation: "Office Boy", unit: "PSL", line: "N/A", type: "Staff", currentShift: "General Shift" },
  { id: "2022040132", name: "Md. Sakil", dept: "Admin", designation: "Asst. Cook", unit: "PTVL", line: "N/A", type: "Worker", currentShift: "General Shift" }
];

const initialLedger: RosterLog[] = [
  { id: "LOG-101", empId: "2023043910", name: "Tahmid Afsar Shapno", dept: "Core Development (HR)", baseShift: "General Shift", assignedShift: "Night Shift", startDate: "2026-06-15", endDate: "2026-06-20", type: "Temporary" },
  { id: "LOG-102", empId: "2022035599", name: "Dipon Saha", dept: "Core Development (HR)", baseShift: "Exe-Ptvl", assignedShift: "Morning Shift", startDate: "2026-06-01", endDate: "2026-06-10", type: "Temporary" },
  { id: "LOG-103", empId: "2021028542", name: "Zakir Hossain", dept: "Implementation & Support (HR)", baseShift: "Exe-Ptvl", assignedShift: "General Shift", startDate: "2026-06-10", endDate: "—", type: "Permanent" }
];

const availableShifts = [
  "General Shift",
  "Morning Shift",
  "Day Shift",
  "Night Shift",
  "Evening Shift",
  "Exe-Ptvl",
  "General-Transport"
];

function ShiftControlCenterPage() {
  const [viewMode, setViewMode] = useState<"WORKSPACE" | "HISTORY">("WORKSPACE");
  
  // Data States
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [ledger, setLedger] = useState<RosterLog[]>(initialLedger);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterShift, setFilterShift] = useState("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced Filters
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  // Assignment Console Form States
  const [assignmentType, setAssignmentType] = useState<"Permanent" | "Temporary">("Permanent");
  const [targetShift, setTargetShift] = useState("General Shift");
  const [startDate, setStartDate] = useState("2026-06-22");
  const [endDate, setEndDate] = useState("2026-06-28");

  // Ledger Filter States
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerStartDate, setLedgerStartDate] = useState("");
  const [ledgerEndDate, setLedgerEndDate] = useState("");

  // Get departments list dynamically
  const departments = useMemo(() => {
    const depts = new Set(employees.map(e => e.dept));
    return ["ALL", ...Array.from(depts)];
  }, [employees]);

  // Workspace Employee Filter
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.includes(searchQuery);
      const matchesDept = filterDept === "ALL" || emp.dept === filterDept;
      const matchesShift = filterShift === "ALL" || emp.currentShift === filterShift;
      const matchesUnit = filterUnit === "ALL" || emp.unit === filterUnit;
      const matchesType = filterType === "ALL" || emp.type === filterType;
      return matchesSearch && matchesDept && matchesShift && matchesUnit && matchesType;
    });
  }, [employees, searchQuery, filterDept, filterShift, filterUnit, filterType]);

  // History Ledger Filter
  const filteredLedger = useMemo(() => {
    return ledger.filter(log => {
      const matchesSearch = log.name.toLowerCase().includes(ledgerSearch.toLowerCase()) || log.empId.includes(ledgerSearch) || log.dept.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchesStart = !ledgerStartDate || log.startDate >= ledgerStartDate;
      const matchesEnd = !ledgerEndDate || log.endDate <= ledgerEndDate;
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [ledger, ledgerSearch, ledgerStartDate, ledgerEndDate]);

  // Table selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Assign shifts trigger
  const handleAssignShiftSubmit = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee from the list first!");
      return;
    }

    const selectedEmployees = employees.filter(e => selectedIds.has(e.id));
    
    // 1. Update current shift of selected employees if permanent
    if (assignmentType === "Permanent") {
      setEmployees(prev => prev.map(emp => {
        if (selectedIds.has(emp.id)) {
          return { ...emp, currentShift: targetShift };
        }
        return emp;
      }));
    }

    // 2. Add to history ledger log entries
    const newLogs: RosterLog[] = selectedEmployees.map((emp, index) => ({
      id: `LOG-${Date.now()}-${index}`,
      empId: emp.id,
      name: emp.name,
      dept: emp.dept,
      baseShift: emp.currentShift,
      assignedShift: targetShift,
      startDate: startDate,
      endDate: assignmentType === "Temporary" ? endDate : "—",
      type: assignmentType
    }));

    setLedger(prev => [ ...newLogs, ...prev ]);
    
    // Clear selection & toast success
    setSelectedIds(new Set());
    toast.success(
      `Successfully assigned ${targetShift} (${assignmentType}) to ${selectedEmployees.length} employee(s)!`,
      {
        description: `Effective starting ${startDate}${assignmentType === "Temporary" ? ` until ${endDate}` : ""}.`
      }
    );
  };

  // Remove Roster entry
  const handleDeleteLedgerEntry = (id: string, name: string) => {
    setLedger(prev => prev.filter(log => log.id !== id));
    toast.success(`Removed shift assignment for ${name}.`);
  };

  // Export placeholders
  const handleExportExcel = () => toast.success("Exporting history ledger to Excel...");
  const handleExportPDF = () => toast.success("Generating history PDF report...");
  const handleExportPrint = () => toast.success("Preparing ledger report for printing...");

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Dashboard Sticky Header */}
          <div className="bg-card border-b border-border/60 p-4 md:px-6 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manage Shift</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Control Center</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Clock className="size-5.5" />
                </div>
                <span>Shift Control Center</span>
              </h1>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center bg-muted p-1 rounded-xl border border-border/40 select-none">
              <button
                onClick={() => setViewMode("WORKSPACE")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-250 ${
                  viewMode === "WORKSPACE"
                    ? "bg-card text-primary shadow-xs border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCheck className="size-3.5" />
                Workspace
              </button>
              <button
                onClick={() => setViewMode("HISTORY")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-250 ${
                  viewMode === "HISTORY"
                    ? "bg-card text-emerald-600 shadow-xs border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="size-3.5" />
                History Ledger
              </button>
            </div>
          </div>

          {/* MAIN PAGE BODY */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/10">
            {viewMode === "WORKSPACE" ? (
              
              /* ==================== WORKSPACE (ASSIGN SHIFTS) ==================== */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT PANEL: Employee Filter and List (7 or 8 columns) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  
                  {/* Top Filters bar */}
                  <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-3xs flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Search box */}
                      <div className="relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="text"
                          placeholder="Search ID, name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-muted-foreground/60"
                        />
                      </div>

                      {/* Department Filter */}
                      <div>
                        <select
                          value={filterDept}
                          onChange={(e) => setFilterDept(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="ALL">All Departments</option>
                          {departments.filter(d => d !== "ALL").map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      {/* Current Shift Filter */}
                      <div className="flex gap-2">
                        <select
                          value={filterShift}
                          onChange={(e) => setFilterShift(e.target.value)}
                          className="flex-1 h-10 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="ALL">All Current Shifts</option>
                          {availableShifts.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        
                        {/* Advanced toggle button */}
                        <button
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          className={`h-10 px-3.5 rounded-xl border flex items-center justify-center transition-all ${
                            showAdvancedFilters
                              ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900 shadow-xs"
                              : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          title="Advanced Filters"
                        >
                          <SlidersHorizontal className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Advanced Collapsible Filter Area */}
                    {showAdvancedFilters && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/30 animate-in fade-in slide-in-from-top-1">
                        <div>
                          <label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider mb-1 block">Unit</label>
                          <select
                            value={filterUnit}
                            onChange={(e) => setFilterUnit(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-muted/30 border border-border/50 text-xs font-semibold focus:outline-none"
                          >
                            <option value="ALL">All Units</option>
                            <option value="PSL">PSL</option>
                            <option value="PTVL">PTVL</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider mb-1 block">Employee Type</label>
                          <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-muted/30 border border-border/50 text-xs font-semibold focus:outline-none"
                          >
                            <option value="ALL">All Employee Types</option>
                            <option value="Staff">Staff</option>
                            <option value="Worker">Worker</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Employees Table Grid */}
                  <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-wider text-foreground">
                          Matching Employees ({filteredEmployees.length})
                        </span>
                      </div>
                      
                      {selectedIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                          <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/10 flex items-center gap-1">
                            <Sparkles className="size-3" /> {selectedIds.size} selected
                          </span>
                          <button
                            onClick={handleClearSelection}
                            className="text-[10px] font-extrabold text-muted-foreground hover:text-rose-500 uppercase flex items-center gap-0.5 border border-border/40 hover:border-rose-200 px-2 py-1 rounded-lg transition"
                          >
                            <X className="size-3" /> Clear
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[11px] text-left min-w-[650px]">
                        <thead>
                          <tr className="bg-muted/10 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[9.5px] font-extrabold">
                            <th className="px-4 py-3 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={filteredEmployees.length > 0 && selectedIds.size === filteredEmployees.length}
                                onChange={handleSelectAll}
                                className="accent-primary size-4 rounded cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-3">Employee Details</th>
                            <th className="px-4 py-3">Department & Designation</th>
                            <th className="px-4 py-3">Current Active Shift</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {filteredEmployees.map((emp) => {
                            const isSelected = selectedIds.has(emp.id);
                            return (
                              <tr
                                key={emp.id}
                                className={`hover:bg-muted/30 transition cursor-pointer ${
                                  isSelected ? "bg-primary/5 hover:bg-primary/5" : ""
                                }`}
                                onClick={() => handleSelectRow(emp.id)}
                              >
                                <td className="px-4 py-3 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleSelectRow(emp.id)}
                                    className="accent-primary size-4 rounded cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shadow-3xs transition-colors border ${
                                      isSelected 
                                        ? "bg-primary text-white border-primary" 
                                        : "bg-muted text-muted-foreground border-border/40"
                                    }`}>
                                      {emp.name.charAt(0)}
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="font-extrabold text-foreground">{emp.name}</div>
                                      <div className="font-mono text-[9px] font-black text-muted-foreground">{emp.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 space-y-0.5">
                                  <div className="font-bold text-slate-700 dark:text-slate-300">{emp.dept}</div>
                                  <div className="text-[10px] text-muted-foreground/75 font-semibold">{emp.designation}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border shadow-3xs ${
                                    emp.currentShift.includes("General")
                                      ? "bg-blue-50/70 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/30"
                                      : emp.currentShift.includes("Night")
                                      ? "bg-purple-50/70 text-purple-700 border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/30"
                                      : emp.currentShift.includes("Exe")
                                      ? "bg-amber-50/70 text-amber-700 border-amber-200 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/30"
                                      : "bg-emerald-50/70 text-emerald-700 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/30"
                                  }`}>
                                    {emp.currentShift}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredEmployees.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-10 text-center">
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                  <AlertCircle className="size-7 text-muted-foreground/60" />
                                  <span className="font-bold text-xs">No employees found matching the filters.</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: Sticky Assignment Console (4 columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
                  
                  <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-foreground">
                        Assignment Console
                      </span>
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                        Mass Update
                      </span>
                    </div>

                    <div className="p-5 space-y-5">
                      
                      {/* Step 1: Selected Targets Summary */}
                      <div className="space-y-2">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wide">
                          Step 1: Target Employees ({selectedIds.size})
                        </label>
                        
                        {selectedIds.size === 0 ? (
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-700 dark:text-amber-400">
                            <Info className="size-4 shrink-0 mt-0.5" />
                            <div className="text-[10px] font-semibold leading-relaxed">
                              Select employees using the checkboxes in the list to enable scheduling actions.
                            </div>
                          </div>
                        ) : (
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 max-h-[110px] overflow-y-auto space-y-1">
                            <div className="flex flex-wrap gap-1.5">
                              {employees.filter(e => selectedIds.has(e.id)).map(emp => (
                                <span 
                                  key={emp.id} 
                                  className="inline-flex items-center gap-1 bg-card border border-border/60 rounded-lg px-2 py-0.5 text-[9px] font-extrabold text-foreground"
                                >
                                  {emp.name.split(" ")[0]}
                                  <button onClick={() => handleSelectRow(emp.id)} className="text-muted-foreground hover:text-rose-500 transition">
                                    <X className="size-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Step 2: Roster Type Switcher */}
                      <div className="space-y-2">
                        <label className="text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wide">
                          Step 2: Roster Settings
                        </label>
                        <div className="grid grid-cols-2 bg-muted p-1 rounded-xl border border-border/40 select-none">
                          <button
                            onClick={() => setAssignmentType("Permanent")}
                            className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${
                              assignmentType === "Permanent"
                                ? "bg-card text-foreground shadow-2xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Permanent (Base)
                          </button>
                          <button
                            onClick={() => setAssignmentType("Temporary")}
                            className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${
                              assignmentType === "Temporary"
                                ? "bg-card text-foreground shadow-2xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Temporary (Duty)
                          </button>
                        </div>
                      </div>

                      {/* Step 3: Shift Select and Dates */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9.5px] font-black uppercase text-rose-500 tracking-wide">Select New Shift *</label>
                          <select
                            value={targetShift}
                            onChange={(e) => setTargetShift(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl bg-muted/30 border border-primary/20 text-xs font-bold text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {availableShifts.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[9.5px] font-black uppercase text-rose-500 tracking-wide">Start Date *</label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/60 text-xs font-bold outline-none cursor-pointer focus:border-primary transition"
                            />
                          </div>

                          {assignmentType === "Temporary" ? (
                            <div className="space-y-1.5 animate-in zoom-in-95 duration-150">
                              <label className="text-[9.5px] font-black uppercase text-rose-500 tracking-wide">End Date *</label>
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/60 text-xs font-bold outline-none cursor-pointer focus:border-primary transition"
                              />
                            </div>
                          ) : (
                            <div className="bg-muted/10 border border-dashed border-border/60 rounded-xl flex items-center justify-center p-2 text-center text-muted-foreground/60 text-[9px] font-bold leading-normal">
                              End Date omitted for Permanent shift migration.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submit Action */}
                      <button
                        onClick={handleAssignShiftSubmit}
                        disabled={selectedIds.size === 0}
                        className={`w-full h-11 text-xs font-black uppercase tracking-widest rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-sm ${
                          selectedIds.size === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed border border-border/40"
                            : assignmentType === "Permanent"
                            ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        <Check className="size-4" />
                        Apply Assignment ({selectedIds.size})
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            ) : (
              
              /* ==================== HISTORY LEDGER VIEW ==================== */
              <div className="space-y-4 animate-in fade-in duration-200">
                
                {/* Advanced Ledger Filters bar */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-3xs">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    
                    <div>
                      <label className="text-[9.5px] font-black uppercase text-muted-foreground/80 tracking-wider mb-1.5 block">Search Employee / Dept</label>
                      <div className="relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="text"
                          placeholder="Search name, ID, department..."
                          value={ledgerSearch}
                          onChange={(e) => setLedgerSearch(e.target.value)}
                          className="w-full h-9.5 pl-9 pr-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9.5px] font-black uppercase text-muted-foreground/80 tracking-wider mb-1.5 block">Start From Date</label>
                      <input
                        type="date"
                        value={ledgerStartDate}
                        onChange={(e) => setLedgerStartDate(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9.5px] font-black uppercase text-muted-foreground/80 tracking-wider mb-1.5 block">End Until Date</label>
                      <input
                        type="date"
                        value={ledgerEndDate}
                        onChange={(e) => setLedgerEndDate(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setLedgerSearch("");
                          setLedgerStartDate("");
                          setLedgerEndDate("");
                        }}
                        className="flex-1 h-9.5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-black text-xs uppercase tracking-wider transition"
                      >
                        Reset Filter
                      </button>
                    </div>

                  </div>
                </div>

                {/* Ledger Table Toolbar */}
                <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleExportExcel}
                        className="h-8 px-3 rounded-lg border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"
                      >
                        <FileSpreadsheet className="size-3.5 text-emerald-500" /> EXCEL
                      </button>
                      <button
                        onClick={handleExportPrint}
                        className="h-8 px-3 rounded-lg border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"
                      >
                        <Printer className="size-3.5 text-blue-500" /> PRINT
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="h-8 px-3 rounded-lg border border-border/70 hover:bg-muted font-bold text-[10px] text-foreground flex items-center gap-1.5 transition"
                      >
                        <FileDown className="size-3.5 text-rose-500" /> PDF
                      </button>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      Total Entries: {filteredLedger.length}
                    </span>
                  </div>

                  {/* Data list */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[11px] text-left min-w-[850px]">
                      <thead>
                        <tr className="bg-sky-500/5 text-sky-900 dark:text-sky-200 border-b border-border/50 uppercase tracking-wider text-[9.5px] font-extrabold">
                          <th className="px-4 py-3 w-10">#</th>
                          <th className="px-4 py-3">Employee</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3">Assignment Type</th>
                          <th className="px-4 py-3">Previous Shift</th>
                          <th className="px-4 py-3">Assigned Shift</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3">End Date</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {filteredLedger.map((log, i) => (
                          <tr key={log.id} className="hover:bg-muted/40 transition">
                            <td className="px-4 py-3 font-bold text-muted-foreground">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-extrabold text-foreground">{log.name}</div>
                              <div className="font-mono text-[9px] font-bold text-muted-foreground">{log.empId}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-bold">{log.dept}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                log.type === "Permanent"
                                  ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30"
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{log.baseShift}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-extrabold">
                                {log.assignedShift}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold">{log.startDate}</td>
                            <td className="px-4 py-3 font-mono font-semibold">{log.endDate}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteLedgerEntry(log.id, log.name)}
                                className="p-1.5 rounded-lg border border-border/50 hover:bg-rose-500/10 hover:border-rose-300 text-muted-foreground hover:text-rose-500 transition"
                                title="Cancel Roster"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredLedger.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-10 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <AlertCircle className="size-7 text-muted-foreground/60" />
                                <span className="font-bold text-xs">No records found matching filters.</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}
