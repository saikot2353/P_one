import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { 
  ChevronRight, 
  Paperclip, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  FileText, 
  Search,
  CheckSquare,
  Square,
  CalendarDays,
  Briefcase,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-leave-requisition")({
  component: LeaveRequisitionPage,
});

const inputClass =
  "w-full h-10 px-3.5 text-[13px] font-bold text-foreground bg-muted/40 dark:bg-slate-900/40 border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/45";

const labelClass = "block text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={labelClass}>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const DUMMY_EMPLOYEES = [
  { id: "emp1", name: "Md. Anik Islam", designation: "Deputy Manager", department: "HR & Admin", type: "Permanent" },
  { id: "emp2", name: "Rajebul Hasan Rajon", designation: "Deputy Manager", department: "Production", type: "Permanent" },
  { id: "emp3", name: "Md. Zahidul Islam", designation: "COO", department: "HR & Admin", type: "Permanent" },
  { id: "emp4", name: "Sanjida Akter", designation: "Senior Officer", department: "HR & Admin", type: "Permanent" },
  { id: "emp5", name: "Abu Bakar Siddik", designation: "Operator", department: "Production", type: "Permanent" },
  { id: "emp6", name: "Mst. Kulsum Begum", designation: "Helper", department: "Production", type: "Probation" },
  { id: "emp7", name: "Kazi Nurul Huda", designation: "Supervisor", department: "Production", type: "Permanent" },
  { id: "emp8", name: "Tariqul Islam", designation: "IT Support Specialist", department: "HR & Admin", type: "Probation" }
];

function LeaveRequisitionPage() {
  const [requestMode, setRequestMode] = useState<"single" | "group">("single");
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leaveCategory, setLeaveCategory] = useState("Full Day Leave");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [responsible, setResponsible] = useState("");
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState("");
  const [fileName, setFileName] = useState("");

  // Group Leave States
  const [groupSearch, setGroupSearch] = useState("");
  const [groupDept, setGroupDept] = useState("All");
  const [groupType, setGroupType] = useState("All");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const leaveTypeOptions = [
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Earned Leave", label: "Earned Leave" },
  ];

  const categoryOptions = [
    { value: "Full Day Leave", label: "Full Day Leave" },
    { value: "Half Day Leave", label: "Half Day Leave" },
  ];

  const employeeOptions = DUMMY_EMPLOYEES.map(emp => ({
    value: emp.id,
    label: `${emp.name} (${emp.designation})`
  }));

  const totalDays = useMemo(() => {
    if (!dateFrom || !dateTo) return null;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to.getTime() - from.getTime();
    if (diff < 0) return null;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return leaveCategory === "Half Day Leave" ? 0.5 : days;
  }, [dateFrom, dateTo, leaveCategory]);

  const balances = [
    { type: "Casual Leave", assigned: 10, enjoyed: 3, balance: 7, fill: "from-blue-500 to-indigo-600", text: "text-blue-500" },
    { type: "Sick Leave", assigned: 14, enjoyed: 2, balance: 12, fill: "from-emerald-400 to-teal-500", text: "text-emerald-500" },
    { type: "Earned Leave", assigned: 18, enjoyed: 0, balance: 18, fill: "from-amber-400 to-orange-500", text: "text-amber-500" },
  ];

  // Filters group employees list
  const filteredEmployees = useMemo(() => {
    return DUMMY_EMPLOYEES.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(groupSearch.toLowerCase()) || 
                          emp.designation.toLowerCase().includes(groupSearch.toLowerCase());
      const matchDept = groupDept === "All" || emp.department === groupDept;
      const matchType = groupType === "All" || emp.type === groupType;
      return matchSearch && matchDept && matchType;
    });
  }, [groupSearch, groupDept, groupType]);

  const handleToggleSelectAll = () => {
    const visibleIds = filteredEmployees.map(e => e.id);
    const allSelected = visibleIds.every(id => selectedEmployees.includes(id));
    if (allSelected) {
      // Deselect all visible
      setSelectedEmployees(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Select all visible
      setSelectedEmployees(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateFrom || !dateTo) {
      toast.error("Please select leave dates");
      return;
    }
    if (!purpose) {
      toast.error("Please enter purpose/reason for leave");
      return;
    }

    if (requestMode === "single") {
      if (onBehalf && !onBehalfEmp) {
        toast.error("Please select an employee for behalf application");
        return;
      }
      const targetEmpName = onBehalf 
        ? DUMMY_EMPLOYEES.find(e => e.id === onBehalfEmp)?.name || "on behalf employee"
        : "Myself";
      toast.success(`Leave request successfully submitted for ${targetEmpName}!`);
    } else {
      if (selectedEmployees.length === 0) {
        toast.error("Please select at least one employee for group leave request");
        return;
      }
      toast.success(`Group Leave request successfully submitted for ${selectedEmployees.length} employees!`);
    }

    // Reset Form
    setDateFrom("");
    setDateTo("");
    setPurpose("");
    setAddress("");
    setContact("");
    setResponsible("");
    setFileName("");
    setOnBehalf(false);
    setOnBehalfEmp("");
    setSelectedEmployees([]);
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-[#f8fafc] dark:bg-[#090d16]">

          {/* Breadcrumb & Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">SSP</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">New Requisition</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-extrabold">Leave Requisition</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground/80 bg-card border border-border/80 rounded-xl px-3 py-1.5 shadow-2xs">
                Active Session
              </span>
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 font-black uppercase tracking-wider">
                {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5 ml-1">
              <AlertCircle className="size-3.5 text-primary" /> Application Scope
            </span>
            <div className="bg-card border border-border p-1 rounded-2xl flex items-center gap-1.5 w-fit shadow-sm bg-card/60 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setRequestMode("single")}
                className={`h-9 px-6 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 relative whitespace-nowrap ${
                  requestMode === "single"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-3.5 shrink-0" />
                Single Employee
              </button>
              <button
                type="button"
                onClick={() => setRequestMode("group")}
                className={`h-9 px-6 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 relative whitespace-nowrap ${
                  requestMode === "group"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/20 scale-[1.02]"
                    : "hover:bg-muted text-muted-foreground hover:text-rose-500"
                }`}
              >
                <Users className="size-3.5 shrink-0" />
                Group Requisition
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <form onSubmit={handleSubmit} className="flex-1 flex gap-4 min-h-0 overflow-hidden">

            {/* ── LEFT: Form Card ───────────────────────────── */}
            <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden relative transition-all duration-300">
              <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${requestMode === "group" ? "from-rose-500 via-pink-500" : "from-primary via-indigo-500"} to-transparent`} />

              {/* Card Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={`size-7 rounded-xl flex items-center justify-center ${
                    requestMode === "group" ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                  }`}>
                    {requestMode === "group" ? <Users className="size-4" /> : <User className="size-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      {requestMode === "group" ? "Group Leave Application Form" : "Single Leave Application Form"}
                    </span>
                    <p className="text-[9.5px] text-muted-foreground font-semibold mt-0.5">Fill out parameters to register the requisition</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* Section 1: Leave Configurations */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/60 space-y-4">
                  <h3 className="text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-3 rounded-full ${requestMode === "group" ? "bg-rose-500" : "bg-primary"}`} />
                    Leave Parameters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Leave Type" required>
                      <div className="relative flex items-center">
                        <FileSpreadsheet className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                        <SearchableSelect
                          value={leaveType}
                          onChange={setLeaveType}
                          options={leaveTypeOptions}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </Field>

                    <Field label="Leave Category" required>
                      <div className="relative flex items-center">
                        <Briefcase className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                        <SearchableSelect
                          value={leaveCategory}
                          onChange={setLeaveCategory}
                          options={categoryOptions}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </Field>

                    <Field label="Duration From" required>
                      <div className="relative flex items-center">
                        <CalendarDays className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={e => setDateFrom(e.target.value)}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Duration To" required>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-1 flex items-center">
                          <CalendarDays className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                          <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className={`${inputClass} pl-10`}
                            required
                          />
                        </div>
                        {totalDays !== null && (
                          <span className={`shrink-0 text-[11px] font-black px-4 py-2.5 rounded-xl whitespace-nowrap animate-in zoom-in-95 duration-200 border ${
                            requestMode === "group" 
                              ? "text-rose-500 bg-rose-500/10 border-rose-500/20" 
                              : "text-primary bg-primary/10 border-primary/20"
                          }`}>
                            {totalDays} {totalDays === 1 ? "Day" : "Days"}
                          </span>
                        )}
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Section 2: Group Employee Selector (ONLY FOR GROUP MODE) */}
                {requestMode === "group" && (
                  <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/60 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-3 rounded-full bg-rose-500" />
                        Target Employees Selection
                      </h3>
                      <span className="text-[9px] font-black px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
                        {selectedEmployees.length} Selected
                      </span>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-card border border-border/60 rounded-xl">
                      <div className="relative">
                        <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search employee..."
                          value={groupSearch}
                          onChange={e => setGroupSearch(e.target.value)}
                          className="w-full h-8.5 pl-8 pr-3 text-[11px] font-bold bg-muted/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/40"
                        />
                      </div>
                      <select
                        value={groupDept}
                        onChange={e => setGroupDept(e.target.value)}
                        className="h-8.5 px-3 text-[11px] font-bold bg-muted/25 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/40 cursor-pointer"
                      >
                        <option value="All">All Departments</option>
                        <option value="HR & Admin">HR & Admin</option>
                        <option value="Production">Production</option>
                      </select>
                      <select
                        value={groupType}
                        onChange={e => setGroupType(e.target.value)}
                        className="h-8.5 px-3 text-[11px] font-bold bg-muted/25 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/40 cursor-pointer"
                      >
                        <option value="All">All Types</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Probation">Probation</option>
                      </select>
                    </div>

                    {/* Selection Checklist */}
                    <div className="border border-border/70 rounded-xl overflow-hidden bg-card">
                      <div className="grid grid-cols-[50px_1fr_120px_100px] items-center px-4 py-2.5 border-b border-border/60 bg-muted/20 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                        <button
                          type="button"
                          onClick={handleToggleSelectAll}
                          className="hover:text-rose-500 transition-colors flex items-center justify-start"
                        >
                          {filteredEmployees.length > 0 && filteredEmployees.every(e => selectedEmployees.includes(e.id)) ? (
                            <CheckSquare className="size-4.5 text-rose-500" />
                          ) : (
                            <Square className="size-4.5" />
                          )}
                        </button>
                        <span>Employee Details</span>
                        <span>Department</span>
                        <span>Type</span>
                      </div>
                      <div className="divide-y divide-border/30 max-h-[220px] overflow-y-auto">
                        {filteredEmployees.length === 0 ? (
                          <div className="p-10 text-center text-muted-foreground text-[11.5px] font-bold flex flex-col items-center justify-center gap-2">
                            <AlertCircle className="size-6 text-muted-foreground/60" />
                            <span>No employees match your search criteria.</span>
                          </div>
                        ) : (
                          filteredEmployees.map(emp => {
                            const isChecked = selectedEmployees.includes(emp.id);
                            return (
                              <div
                                key={emp.id}
                                onClick={() => handleToggleEmployee(emp.id)}
                                className={`grid grid-cols-[50px_1fr_120px_100px] items-center px-4 py-3 text-[12px] cursor-pointer hover:bg-muted/10 transition-all duration-200 border-b border-border/30 last:border-b-0 ${
                                  isChecked ? "bg-rose-500/[0.03] dark:bg-rose-500/[0.02]" : ""
                                }`}
                              >
                                <div onClick={e => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleEmployee(emp.id)}
                                    className="rounded border-border text-rose-500 focus:ring-rose-500/20 size-4 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`size-8 rounded-lg flex items-center justify-center font-black text-[10.5px] border shrink-0 text-white ${
                                    isChecked 
                                      ? "bg-gradient-to-br from-rose-500 to-pink-500 border-rose-400" 
                                      : "bg-gradient-to-br from-slate-400 to-slate-500 border-slate-350 dark:from-slate-700 dark:to-slate-800 dark:border-slate-650"
                                  }`}>
                                    {emp.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-extrabold text-foreground/90 truncate">{emp.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-bold tracking-wide truncate">{emp.designation}</span>
                                  </div>
                                </div>
                                <span className="font-semibold text-muted-foreground truncate">{emp.department}</span>
                                <span className={`text-[9px] font-black uppercase tracking-wider w-fit px-2.5 py-0.5 rounded-lg border ${
                                  emp.type === "Permanent"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                }`}>
                                  {emp.type}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Requisition Details */}
                <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/60 space-y-4">
                  <h3 className="text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-3 rounded-full ${requestMode === "group" ? "bg-rose-500" : "bg-primary"}`} />
                    Logistics & References
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Purpose / Reason" required>
                      <div className="relative flex items-center">
                        <FileText className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={purpose}
                          onChange={e => setPurpose(e.target.value)}
                          placeholder="e.g. Medical treatment / Family reason"
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Address during Leave" required>
                      <div className="relative flex items-center">
                        <MapPin className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="e.g. 42 Mirpur Road, Dhaka"
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Contact Number" required>
                      <div className="relative flex items-center">
                        <Phone className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={contact}
                          onChange={e => setContact(e.target.value)}
                          placeholder="e.g. +8801XXXXXXXXX"
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Responsible Employee">
                      <div className="relative flex items-center">
                        <User className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                        <SearchableSelect
                          value={responsible}
                          onChange={setResponsible}
                          options={employeeOptions}
                          placeholder="Select duty delegate..."
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </Field>

                    {/* Attachment - full width */}
                    <div className="col-span-1 md:col-span-2">
                      <label className={labelClass}>Attachment References (e.g. Medical Reports)</label>
                      <label className="flex items-center gap-3.5 h-11 w-full px-4 bg-muted/20 border border-dashed border-border/80 rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/40 hover:shadow-2xs transition-all group">
                        <Paperclip className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <span className="text-[12px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                          {fileName || "Drag or click to attach files  —  PDF, JPG, PNG (Max 5MB)"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={e => setFileName(e.target.files?.[0]?.name || "")}
                        />
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card Footer: Submit */}
              <div className="px-6 py-4.5 border-t border-border bg-muted/10 flex items-center justify-between shrink-0">
                <p className="text-[10px] text-muted-foreground/80 font-semibold uppercase tracking-wider">
                  Fields with <span className="text-rose-500 font-bold">*</span> are required
                </p>
                <button 
                  type="submit" 
                  className={`h-11 px-8 text-white text-[12px] font-black rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2 uppercase tracking-widest ${
                    requestMode === "group" 
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/25" 
                      : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-700 shadow-primary/25"
                  }`}
                >
                  <CheckCircle2 className="size-4.5 animate-pulse" />
                  {requestMode === "group" ? "Submit Group Request" : "Submit Request"}
                </button>
              </div>
            </div>

            {/* ── RIGHT: Balance + On Behalf / Selected Summary ────────────────── */}
            <div className="w-[340px] flex flex-col gap-4 shrink-0 overflow-y-auto">

              {/* Leave Balance Card */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${requestMode === "group" ? "from-rose-500 to-pink-500" : "from-emerald-400 to-teal-500"} to-transparent`} />

                <div className="px-4 py-4 border-b border-border bg-muted/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-4 rounded-full ${requestMode === "group" ? "bg-rose-500" : "bg-emerald-500"}`} />
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      {requestMode === "group" ? "Group Leave Rules" : "My Leave Balance"}
                    </span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-widest">
                    CY 2026
                  </span>
                </div>

                {requestMode === "single" ? (
                  <div className="p-4 space-y-3.5">
                    {balances.map(b => {
                      const pct = Math.round((b.enjoyed / b.assigned) * 100);
                      return (
                        <div key={b.type} className="p-4 rounded-xl bg-gradient-to-br from-card to-muted/20 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xs relative overflow-hidden group">
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[12px] font-black text-foreground/90 uppercase tracking-wide">{b.type}</span>
                            <span className={`text-[11px] font-extrabold ${b.text} bg-muted/65 px-2.5 py-0.5 rounded-lg border border-border/40`}>
                              {b.balance} left
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted border border-border/40 overflow-hidden mb-2.5">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${b.fill} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <span>Assigned: <b className="text-foreground">{b.assigned}</b></span>
                            <span>Enjoyed: <b className="text-foreground">{b.enjoyed}</b></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-5 space-y-4">
                    <div className="p-4 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                        <AlertCircle className="size-4" /> Group Rule Policy
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                        Applying for group leave processes the requests concurrently. Please ensure:
                      </p>
                      <ul className="text-[9.5px] text-muted-foreground/80 list-disc pl-4 space-y-2 font-bold uppercase tracking-wider">
                        <li>Each selected employee has sufficient leave balance.</li>
                        <li>Requests belong to the same audit logs & dates.</li>
                        <li>Duty delegate is aware of the workload assignment.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Mode: On Behalf Card / Group Mode: Selected Employees Panel */}
              {requestMode === "single" ? (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-5 space-y-4 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-rose-500 to-pink-500 to-transparent" />
                  
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <span className="text-[12px] font-black uppercase tracking-wider text-foreground group-hover:text-rose-500 transition-colors">Apply on Behalf</span>
                      <p className="text-[9.5px] text-muted-foreground font-semibold mt-0.5">Submit request for another employee</p>
                    </div>
                    <div className="relative shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={onBehalf}
                        onChange={e => setOnBehalf(e.target.checked)}
                      />
                      <div className="w-9 h-5 rounded-full bg-muted border border-border peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
                    </div>
                  </label>

                  <div className={`overflow-hidden transition-all duration-350 ease-out ${onBehalf ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <label className={labelClass}>Select Employee</label>
                    <div className="relative flex items-center">
                      <User className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                      <SearchableSelect
                        value={onBehalfEmp}
                        onChange={setOnBehalfEmp}
                        options={employeeOptions}
                        placeholder="Search employee..."
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-5 space-y-4 relative overflow-hidden flex-1 flex flex-col min-h-0">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-rose-500 to-pink-500 to-transparent" />
                  
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <span className="text-[12px] font-black uppercase tracking-wider text-foreground">Selected Team</span>
                      <p className="text-[9.5px] text-muted-foreground font-semibold mt-0.5">Quick review list for group action</p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      {selectedEmployees.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-border/30 pr-1 mt-2 space-y-1">
                    {selectedEmployees.length === 0 ? (
                      <div className="py-12 text-center text-[11px] text-muted-foreground font-semibold flex flex-col items-center gap-3">
                        <div className="size-10 rounded-2xl bg-muted/65 flex items-center justify-center border border-border/50 text-muted-foreground">
                          <Users className="size-5" />
                        </div>
                        <span>No team members selected. Use the checklist on the left.</span>
                      </div>
                    ) : (
                      selectedEmployees.map(id => {
                        const emp = DUMMY_EMPLOYEES.find(e => e.id === id);
                        if (!emp) return null;
                        return (
                          <div key={emp.id} className="py-2 flex items-center justify-between group hover:bg-muted/5 px-2 rounded-xl transition">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="size-7.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-[10px] text-rose-600 shrink-0">
                                {emp.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[11.5px] font-extrabold text-foreground/90 truncate">{emp.name}</span>
                                <span className="text-[9px] text-muted-foreground font-bold tracking-wide truncate">{emp.designation}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleEmployee(emp.id)}
                              className="text-[9px] text-rose-500 hover:text-white font-black uppercase tracking-wider hover:bg-rose-500 px-2 py-1 rounded-lg shrink-0 transition border border-transparent hover:border-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
