import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Timer, ChevronRight, Search, Printer, Download, Clock,
  CheckCircle2, AlertCircle, PlayCircle, Send, CheckSquare, Settings,
  Wand2, Trash2
} from "lucide-react";

export const Route = createFileRoute("/manage-overtime")({
  head: () => ({
    meta: [
      { title: "Manage Overtime — CRIPTON" },
      { name: "description", content: "Submit and track overtime requisitions." },
    ],
  }),
  component: ManageOvertimePage,
});

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
  calculatedOt: number;
  reqOtInput: string;
  reqMotInput: string;
  reasonInput: string;
}

interface SubmittedOTRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  otDate: string;
  calculatedOt: number;
  reqOt: number;
  reqMot: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

function ManageOvertimePage() {
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");

  // Mock Attendance Data for the selected Date
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDept, setSelectedDept] = useState("ALL");

  const initialAttendance: AttendanceRecord[] = [
    { id: "ATT-101", employeeId: "2021023079", employeeName: "Md. Monjur Alam", department: "Admin", designation: "Driver", inDate: attendanceDate, inTime: "08:56:51", outDate: attendanceDate, outTime: "10:15:11", calculatedOt: 0, reqOtInput: "", reqMotInput: "", reasonInput: "" },
    { id: "ATT-102", employeeId: "2023045146", employeeName: "Asif Hossain", department: "Admin", designation: "Driver", inDate: attendanceDate, inTime: "09:47:19", outDate: attendanceDate, outTime: "22:00:00", calculatedOt: 4.5, reqOtInput: "", reqMotInput: "", reasonInput: "" },
    { id: "ATT-103", employeeId: "2023043910", employeeName: "Tahmid Afsar Shapno", department: "Business Innovation", designation: "Asst. Manager", inDate: attendanceDate, inTime: "09:00:00", outDate: attendanceDate, outTime: "20:30:00", calculatedOt: 2.5, reqOtInput: "", reqMotInput: "", reasonInput: "" },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);
  const [selectedAttendanceIds, setSelectedAttendanceIds] = useState<Set<string>>(new Set());

  // Handle Input Changes for OT/MOT/Reason
  const handleOtChange = (id: string, field: "reqOtInput" | "reqMotInput" | "reasonInput", value: string) => {
    setAttendanceRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    // Automatically select the row if they type something
    if (value.trim() !== "") {
      setSelectedAttendanceIds(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
    }
  };

  // Submit OT Records
  const [submittedRecords, setSubmittedRecords] = useState<SubmittedOTRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_submitted_ot");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cripton_submitted_ot", JSON.stringify(submittedRecords));
  }, [submittedRecords]);

  // Budget
  const [budgetPool, setBudgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_ot_budget");
      return saved ? parseFloat(saved) : 50000;
    }
    return 50000;
  });

  useEffect(() => {
    localStorage.setItem("cripton_ot_budget", budgetPool.toString());
  }, [budgetPool]);

  const stats = useMemo(() => {
    let approvedHours = 0;
    let pendingHours = 0;
    submittedRecords.forEach(r => {
      const totalOt = r.reqOt + r.reqMot;
      if (r.status === "Approved") approvedHours += totalOt;
      if (r.status === "Pending") pendingHours += totalOt;
    });

    const approvedCost = approvedHours * 150; // mock rate
    const remainingBudget = budgetPool - approvedCost;

    return {
      budgetPool,
      approvedHours,
      approvedCost,
      pendingHours,
      remainingBudget,
    };
  }, [submittedRecords, budgetPool]);

  const handleSubmitOT = () => {
    if (selectedAttendanceIds.size === 0) {
      alert("Please select at least one attendance record to submit.");
      return;
    }

    const newSubmissions: SubmittedOTRecord[] = [];
    
    selectedAttendanceIds.forEach(id => {
      const record = attendanceRecords.find(r => r.id === id);
      if (record) {
        const reqOt = parseFloat(record.reqOtInput) || 0;
        const reqMot = parseFloat(record.reqMotInput) || 0;

        if (reqOt === 0 && reqMot === 0) return; // Ignore if no OT requested
        if ((reqOt + reqMot) > 4 && !record.reasonInput.trim()) {
           alert(`Error: Reason is mandatory for ${record.employeeName} because total OT exceeds 4 hours!`);
           throw new Error("Missing Reason for High OT");
        }

        newSubmissions.push({
          id: `OT-REQ-${Math.floor(Math.random() * 10000)}`,
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          department: record.department,
          designation: record.designation,
          otDate: record.inDate,
          calculatedOt: record.calculatedOt,
          reqOt: reqOt,
          reqMot: reqMot,
          reason: record.reasonInput || "General Workload",
          status: "Pending",
          submittedAt: new Date().toISOString()
        });
      }
    });

    if (newSubmissions.length === 0) {
      alert("Please enter a valid Requested OT or MOT for the selected records.");
      return;
    }

    setSubmittedRecords(prev => [...newSubmissions, ...prev]);
    
    // Clear inputs and selection
    setAttendanceRecords(prev => prev.map(r => selectedAttendanceIds.has(r.id) ? { ...r, reqOtInput: "", reqMotInput: "", reasonInput: "" } : r));
    setSelectedAttendanceIds(new Set());
    
    alert(`Successfully submitted ${newSubmissions.length} OT requests!`);
    setActiveTab("history");
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAttendanceIds(new Set(attendanceRecords.map(r => r.id)));
    } else {
      setSelectedAttendanceIds(new Set());
    }
  };

  const handleAutoFillSysOT = () => {
    if (selectedAttendanceIds.size === 0) {
      alert("Please select records to auto-fill.");
      return;
    }
    setAttendanceRecords(prev => prev.map(r => {
      if (selectedAttendanceIds.has(r.id) && r.calculatedOt > 0) {
        return { ...r, reqOtInput: r.calculatedOt.toString() };
      }
      return r;
    }));
  };

  const handleCancelRequest = (id: string) => {
    if (confirm("Are you sure you want to cancel this pending OT request?")) {
      setSubmittedRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedAttendanceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manage Overtime</span>
                <ChevronRight className="size-2.5" />
                <span className="text-blue-600 font-semibold">OT Tracking & Submissions</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Timer className="size-5.5 text-blue-600" />
                <span>Overtime Tracking & Submissions</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Pull daily attendance records, input manual OT adjustments, and submit requisitions for approval.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="inline-flex items-center gap-1 p-1.5 bg-muted/50 rounded-xl border border-border/50 print:hidden">
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "submit" 
                  ? "bg-card text-blue-600 shadow-sm border border-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <PlayCircle className="size-4" /> Submit OT Request
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "history" 
                  ? "bg-card text-blue-600 shadow-sm border border-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="size-4" /> My Submitted Requests
                {stats.pendingHours > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 transition-colors ${activeTab === "history" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" : "bg-amber-500/20 text-amber-600"}`}>
                    {submittedRecords.filter(r => r.status === "Pending").length}
                  </span>
                )}
              </div>
            </button>
          </div>

          {activeTab === "submit" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Submission Filters & Budget Dashboard */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Search / Filters Panel */}
                <div className="xl:col-span-2 bg-card rounded-xl border border-border/80 shadow-xs p-5">
                  <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
                    <Search className="size-4 text-blue-500" /> Load Attendance Data
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase mb-1.5 block">Attendance Date *</label>
                      <input 
                        type="date" 
                        value={attendanceDate}
                        onChange={e => setAttendanceDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-blue-500 transition shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase mb-1.5 block">Department *</label>
                      <select 
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-muted border border-border/60 text-xs font-semibold outline-none focus:border-blue-500 transition shadow-sm"
                      >
                        <option value="ALL">All Departments</option>
                        <option value="Admin">Admin</option>
                        <option value="Business Innovation">Business Innovation</option>
                        <option value="Business Automation">Business Automation</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button className="h-9 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition uppercase tracking-wider">
                        Load Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Budget Tracker Widget */}
                <div className="bg-[#1e88e5]/5 border border-[#1e88e5]/20 rounded-xl p-5 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Timer className="size-24" />
                  </div>
                  <h3 className="text-[10px] font-black tracking-wider uppercase opacity-75 text-[#1e88e5] mb-3">OT Cost Overview</h3>
                  
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div>
                      <div className="text-[10px] opacity-70 font-semibold mb-0.5">Budget Pool</div>
                      <div className="text-lg font-black text-foreground">৳ {stats.budgetPool.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] opacity-70 font-semibold mb-0.5">Approved Cost</div>
                      <div className="text-lg font-black text-emerald-600">৳ {stats.approvedCost.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-[#1e88e5]/10">
                      <div className="text-[10px] opacity-70 font-semibold mb-0.5">Balance Remaining</div>
                      <div className={`text-2xl font-black ${stats.remainingBudget < 10000 ? 'text-rose-600' : 'text-[#1e88e5]'}`}>
                        ৳ {stats.remainingBudget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 bg-muted/10">
                  <h2 className="text-sm font-black text-foreground">
                    Attendance List: {attendanceDate}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleAutoFillSysOT}
                      disabled={selectedAttendanceIds.size === 0}
                      className="h-9 px-4 bg-background border border-border/60 hover:bg-muted disabled:opacity-50 text-foreground font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition"
                    >
                      <Wand2 className="size-3.5 text-blue-500" />
                      Auto-Fill Sys OT
                    </button>
                    <button 
                      onClick={() => {
                        try { handleSubmitOT(); } catch(e) {}
                      }}
                      disabled={selectedAttendanceIds.size === 0}
                      className="h-9 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
                    >
                      <Send className="size-3.5" />
                      Submit Selected ({selectedAttendanceIds.size})
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap text-[11px]">
                        <th className="px-4 py-3 border-r border-border/30 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-border/60"
                            checked={attendanceRecords.length > 0 && selectedAttendanceIds.size === attendanceRecords.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 border-r border-border/30">Employee Details</th>
                        <th className="px-4 py-3 text-center border-r border-border/30">In Date/Time</th>
                        <th className="px-4 py-3 text-center border-r border-border/30">Out Date/Time</th>
                        <th className="px-4 py-3 text-center border-r border-border/30">Sys. OT</th>
                        <th className="px-4 py-3 text-center border-r border-border/30 w-24">Req. OT</th>
                        <th className="px-4 py-3 text-center border-r border-border/30 w-24">Req. MOT</th>
                        <th className="px-4 py-3 w-40">Justification / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans text-xs">
                      {attendanceRecords.map((row) => {
                        const isSelected = selectedAttendanceIds.has(row.id);
                        return (
                          <tr 
                            key={row.id} 
                            className={`transition duration-75 ${isSelected ? "bg-emerald-500/5" : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30"}`}
                          >
                            <td className="px-4 py-3 text-center border-r border-border/20">
                              <input 
                                type="checkbox" 
                                className="rounded border-border/60"
                                checked={isSelected}
                                onChange={() => toggleSelectRow(row.id)}
                              />
                            </td>
                            <td className="px-4 py-3 border-r border-border/20">
                              <div className="font-black text-foreground">{row.employeeName}</div>
                              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                {row.employeeId} • {row.department} • {row.designation}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-mono border-r border-border/20">
                              <div className="text-foreground">{row.inDate}</div>
                              <div className="text-xs text-muted-foreground">{row.inTime}</div>
                            </td>
                            <td className="px-4 py-3 text-center font-mono border-r border-border/20">
                              <div className="text-foreground">{row.outDate}</div>
                              <div className="text-xs text-muted-foreground">{row.outTime}</div>
                            </td>
                            <td className="px-4 py-3 text-center font-black text-emerald-600 border-r border-border/20 text-sm">
                              {row.calculatedOt > 0 ? row.calculatedOt : "-"}
                            </td>
                            <td className="px-2 py-2 border-r border-border/20">
                              <input 
                                type="number" 
                                value={row.reqOtInput}
                                onChange={e => handleOtChange(row.id, "reqOtInput", e.target.value)}
                                className={`w-full h-8 px-2 rounded-md bg-background border text-xs font-bold outline-none shadow-sm text-center transition ${parseFloat(row.reqOtInput) > 4 ? "border-rose-500 text-rose-600 bg-rose-500/5 focus:border-rose-600" : "border-border/60 focus:border-blue-500"}`}
                                placeholder={row.calculatedOt > 0 ? row.calculatedOt.toString() : "0"}
                              />
                            </td>
                            <td className="px-2 py-2 border-r border-border/20">
                              <input 
                                type="number" 
                                value={row.reqMotInput}
                                onChange={e => handleOtChange(row.id, "reqMotInput", e.target.value)}
                                className={`w-full h-8 px-2 rounded-md bg-background border text-xs font-bold outline-none shadow-sm text-center transition ${parseFloat(row.reqMotInput) > 4 ? "border-rose-500 text-rose-600 bg-rose-500/5 focus:border-rose-600" : "border-border/60 focus:border-blue-500"}`}
                                placeholder="0"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input 
                                type="text" 
                                value={row.reasonInput}
                                onChange={e => handleOtChange(row.id, "reasonInput", e.target.value)}
                                className="w-full h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-blue-500 shadow-sm"
                                placeholder="e.g. Server Issue"
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {attendanceRecords.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground font-medium">
                            No attendance records found for the selected date and department.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 bg-muted/10">
                  <h2 className="text-sm font-black text-foreground">
                    My Submitted OT Requests
                  </h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => window.print()} className="h-9 px-4 rounded-lg border border-border/60 bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition shadow-sm text-blue-600">
                      <Printer className="size-3.5" /> Print
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap text-[11px]">
                        <th className="px-5 py-3 border-r border-border/30">Req ID</th>
                        <th className="px-5 py-3 border-r border-border/30">Employee Details</th>
                        <th className="px-5 py-3 text-center border-r border-border/30">OT Date</th>
                        <th className="px-5 py-3 text-center border-r border-border/30">Requested Hours</th>
                        <th className="px-5 py-3 text-center border-r border-border/30">Submitted At</th>
                        <th className="px-5 py-3 text-center border-r border-border/30">Status</th>
                        <th className="px-5 py-3 text-center print:hidden">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans text-xs">
                      {submittedRecords.map((row) => (
                        <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75">
                          <td className="px-5 py-3 font-mono font-bold text-foreground/70 border-r border-border/20">{row.id}</td>
                          <td className="px-5 py-3 border-r border-border/20">
                            <div className="font-black text-foreground">{row.employeeName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {row.employeeId} • {row.department}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center font-mono border-r border-border/20">
                            {row.otDate}
                          </td>
                          <td className="px-5 py-3 text-center border-r border-border/20">
                            <div className="font-black text-foreground text-sm">{row.reqOt + row.reqMot} hrs</div>
                            <div className="text-[9px] text-muted-foreground font-mono">
                              (OT: {row.reqOt} | MOT: {row.reqMot})
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center font-mono text-muted-foreground border-r border-border/20">
                            {new Date(row.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-center border-r border-border/20">
                            {row.status === "Pending" && (
                              <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-500/20">
                                <Clock className="size-3" /> Pending
                              </span>
                            )}
                            {row.status === "Approved" && (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-500/20">
                                <CheckCircle2 className="size-3" /> Approved
                              </span>
                            )}
                            {row.status === "Rejected" && (
                              <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-rose-500/20">
                                <AlertCircle className="size-3" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-center print:hidden">
                            {row.status === "Pending" ? (
                              <button
                                onClick={() => handleCancelRequest(row.id)}
                                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded transition"
                                title="Cancel Request"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            ) : (
                              <span className="text-muted-foreground/50">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {submittedRecords.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground font-medium">
                            You have not submitted any overtime requests yet.
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
      </main>
    </div>
  );
}

export default ManageOvertimePage;
