import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Cpu, Check, X, FileSpreadsheet, Printer, FileDown, Search, Eye
} from "lucide-react";

export const Route = createFileRoute("/approve-increment-gadget")({
  head: () => ({
    meta: [{ title: "Approve Increment Gadget — CRIPTON" }],
  }),
  component: ApproveIncrementGadgetPage,
});

interface ApprovalRecord {
  id: string;
  name: string;
  oldEmpType: string;
  newEmpType: string;
  department: string;
  oldDesignation: string;
  newDesignation: string;
  joiningDate: string;
  shift: string;
  status: string;
  oldGrade: string;
  newGrade: string;
  unit: string;
  oldBasic: number;
  newBasic: number;
  basicDiff: number;
  oldGross: number;
  newGross: number;
  grossDiff: number;
  approveStatus: "Pending" | "Approved";
}

const defaultApprovalRecords: ApprovalRecord[] = [
  { id: "2024053060", name: "Md. Mahfujul Haque", oldEmpType: "Office Executive", newEmpType: "Office Executive", department: "Core Development", oldDesignation: "Manager", newDesignation: "Manager", joiningDate: "10/12/2024", shift: "General Shift", status: "Working", oldGrade: "None", newGrade: "None", unit: "PSL", oldBasic: 52800.00, newBasic: 52800.00, basicDiff: 0.00, oldGross: 88000.00, newGross: 88000.00, grossDiff: 0.00, approveStatus: "Pending" },
  { id: "2024053062", name: "Mohammad Mayhedi Hasan", oldEmpType: "Office Executive", newEmpType: "Office Executive", department: "Core Development", oldDesignation: "Deputy Manager", newDesignation: "Deputy Manager", joiningDate: "10/12/2024", shift: "General Shift", status: "Working", oldGrade: "None", newGrade: "None", unit: "PSL", oldBasic: 44400.00, newBasic: 44400.00, basicDiff: 0.00, oldGross: 74000.00, newGross: 74000.00, grossDiff: 0.00, approveStatus: "Pending" }
];

function ApproveIncrementGadgetPage() {
  // Top Filters matching screenshot 3
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("Dec");
  const [approveStatus, setApproveStatus] = useState("Pending");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [empIdInput, setEmpIdInput] = useState("");
  const [joiningYear, setJoiningYear] = useState("2023");
  const [joiningMonth, setJoiningMonth] = useState("Dec");

  // Roster States
  const [records, setRecords] = useState<ApprovalRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load custom submissions from localStorage, falling back to defaults if empty
  useEffect(() => {
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const mapped: ApprovalRecord[] = parsed.map((item: any) => ({
            id: item.empId,
            name: item.empName,
            oldEmpType: "Office Executive",
            newEmpType: "Office Executive",
            department: item.department,
            oldDesignation: item.section, // section was stored as designation in queue list
            newDesignation: item.designation,
            joiningDate: item.joiningDate,
            shift: "General Shift",
            status: "Working",
            oldGrade: "None",
            newGrade: "None",
            unit: "PSL",
            oldBasic: item.prevGross * 0.6,
            newBasic: item.grossAfterInc * 0.6,
            basicDiff: (item.grossAfterInc - item.prevGross) * 0.6,
            oldGross: item.prevGross,
            newGross: item.grossAfterInc,
            grossDiff: item.grossAfterInc - item.prevGross,
            approveStatus: item.hrApproveStatus === "Approved" ? "Approved" : "Pending"
          }));
          setRecords(mapped);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRecords(defaultApprovalRecords);
  }, []);

  // Filter roster dynamically
  const filteredRecords = useMemo(() => {
    return records.filter(row => {
      // ApproveStatus filter
      if (approveStatus !== "ALL" && row.approveStatus !== approveStatus) return false;
      // EmpType filter
      if (empType !== "ALL" && row.oldEmpType !== empType) return false;
      // Status filter
      if (status !== "ALL" && row.status !== status) return false;
      
      // EmpId comma separator
      if (empIdInput.trim()) {
        const qids = empIdInput.split(",").map(id => id.trim().toLowerCase());
        if (!qids.some(qid => row.id.toLowerCase().includes(qid))) return false;
      }

      // Quick query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return row.name.toLowerCase().includes(q) || row.id.includes(q) || row.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [records, approveStatus, empType, status, empIdInput, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(e => e !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Actions
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      alert("No records selected for approval.");
      return;
    }

    const updated = records.map(r => {
      if (selectedIds.includes(r.id)) {
        return { ...r, approveStatus: "Approved" as const };
      }
      return r;
    });
    setRecords(updated);

    // Save back to localStorage
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item: any) => {
          if (selectedIds.includes(item.empId)) {
            return { ...item, hrApproveStatus: "Approved", mdApproveStatus: "Approved" };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedIds([]);
    alert(`Successfully approved increment files for ${selectedIds.length} employees.`);
  };

  const handleUndoSelected = () => {
    if (selectedIds.length === 0) {
      alert("No records selected for undo.");
      return;
    }

    const updated = records.map(r => {
      if (selectedIds.includes(r.id)) {
        return { ...r, approveStatus: "Pending" as const };
      }
      return r;
    });
    setRecords(updated);

    // Save back to localStorage
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item: any) => {
          if (selectedIds.includes(item.empId)) {
            return { ...item, hrApproveStatus: "Pending", mdApproveStatus: "Pending" };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedIds([]);
    alert(`Successfully rolled back increment statuses to Pending.`);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumbs */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Human Resource</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Approve Increment Gadget</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Cpu className="size-5.5 text-primary" />
                <span>Approve Increment Gadget Workspace</span>
              </h1>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Year (Gadget)</label>
                <select value={year} onChange={e => setYear(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Month (Gadget)</label>
                <select value={month} onChange={e => setMonth(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Dec">Dec</option>
                  <option value="Jan">Jan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Approve Status</label>
                <select value={approveStatus} onChange={e => setApproveStatus(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Section</label>
                <select value={section} onChange={e => setSection(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Line</label>
                <select value={line} onChange={e => setLine(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Designation</label>
                <select value={designation} onChange={e => setDesignation(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Grade</label>
                <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Working">Working</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">EmpId (Comma Separated)</label>
                <input 
                  type="text" 
                  value={empIdInput}
                  onChange={e => setEmpIdInput(e.target.value)}
                  placeholder="Input Comma As Separator"
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Joining Year</label>
                <select value={joiningYear} onChange={e => setJoiningYear(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Joining Month</label>
                  <select value={joiningMonth} onChange={e => setJoiningMonth(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                    <option value="Dec">Dec</option>
                  </select>
                </div>
                <button onClick={() => alert("Search queries recompiled.")} className="h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center justify-center gap-1">
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE ROSTER DATAGRID */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            
            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Excel Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button onClick={() => window.print()} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button onClick={() => alert("PDF Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">Search:</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Standard Multi-Column Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-3 py-3 text-center">
                      <input 
                        type="checkbox"
                        checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length}
                        onChange={handleSelectAll}
                        className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                      />
                    </th>
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3">Emp ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Old EmpType</th>
                    <th className="px-4 py-3">New EmpType</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Old Designation</th>
                    <th className="px-4 py-3 text-primary">New Designation</th>
                    <th className="px-3 py-3 text-center">Joining Date</th>
                    <th className="px-3 py-3 text-center">Shift</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-3 py-3 text-center">Old Grade</th>
                    <th className="px-3 py-3 text-center text-primary">New Grade</th>
                    <th className="px-3 py-3 text-center">Unit</th>
                    <th className="px-4 py-3 text-right">Old Basic</th>
                    <th className="px-4 py-3 text-right text-primary">New Basic</th>
                    <th className="px-4 py-3 text-right font-bold">Basic Diff</th>
                    <th className="px-4 py-3 text-right">Old Gross</th>
                    <th className="px-4 py-3 text-right text-primary">New Gross</th>
                    <th className="px-4 py-3 text-right font-bold">Gross Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row, idx) => {
                    const isChecked = selectedIds.includes(row.id);
                    return (
                      <tr 
                        key={row.id} 
                        className={`hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRow(row.id)}
                            className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                          />
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">{idx + 1}</td>
                        <td className="px-3 py-3 font-mono font-black text-foreground">{row.id}</td>
                        <td className="px-4 py-3 font-extrabold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground font-semibold">{row.oldEmpType}</td>
                        <td className="px-4 py-3 text-primary font-semibold">{row.newEmpType}</td>
                        <td className="px-4 py-3 text-muted-foreground font-semibold">{row.department}</td>
                        <td className="px-4 py-3 text-muted-foreground/80">{row.oldDesignation}</td>
                        <td className="px-4 py-3 text-primary font-extrabold">{row.newDesignation}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.joiningDate}</td>
                        <td className="px-3 py-3 text-center font-bold text-muted-foreground/80">{row.shift}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.oldGrade}</td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-primary">{row.newGrade}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.unit}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">৳{row.oldBasic.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-primary">৳{row.newBasic.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-foreground">
                          {row.basicDiff > 0 ? `+৳${row.basicDiff.toFixed(2)}` : "৳0.00"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">৳{row.oldGross.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-primary">৳{row.newGross.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-foreground">
                          {row.grossDiff > 0 ? `+৳${row.grossDiff.toFixed(2)}` : "৳0.00"}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={21} className="text-center py-10 font-bold text-muted-foreground text-xs">
                        No pending increments available for authorization.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              
              {/* Action buttons matching screenshot 3 bottom left */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleApproveSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-emerald-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <Check className="size-3" />
                  </span>
                  <span>Approve Selected</span>
                </button>
                <button 
                  onClick={handleUndoSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-amber-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <X className="size-3" />
                  </span>
                  <span>Undo Selected</span>
                </button>
                <button 
                  onClick={() => alert("Generating printable PDF dossier ledger...")}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-slate-600/30"
                >
                  <span className="p-0.5 bg-white/10 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <Eye className="size-3" />
                  </span>
                  <span>View(PDF)</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries (Selected: {selectedIds.length})
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
