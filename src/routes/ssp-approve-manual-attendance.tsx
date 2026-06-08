import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ChevronRight, Search, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/ssp-approve-manual-attendance")({
  component: ApproveManualAttendancePage,
});

export default function ApproveManualAttendancePage() {
  const [department, setDepartment] = useState("All Departments");
  const [search, setSearch] = useState("");

  const deptOptions = [
    { value: "All Departments", label: "All Departments" },
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Sales", label: "Sales" },
  ];

  const pendingRequests = [
    { id: 1, name: "Tahmid Afsar", empId: "2023043910", date: "08/06/2026", in: "09:00 AM", out: "06:00 PM", reason: "Forgot to Punch", dept: "IT" },
    { id: 2, name: "Md. Anik Islam", empId: "2022011200", date: "07/06/2026", in: "08:50 AM", out: "06:15 PM", reason: "Machine Not Working", dept: "HR" },
    { id: 3, name: "Zahidul Islam", empId: "2018090011", date: "07/06/2026", in: "10:00 AM", out: "07:00 PM", reason: "Official Duty Outside", dept: "Sales" },
  ];

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3 bg-slate-50/50 dark:bg-slate-950/20">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground dark:text-slate-300">SSP</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground dark:text-slate-300 font-semibold">Approve Manual Attendance</span>
          </div>

          <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden">
            
            {/* Filter Bar */}
            <div className="p-4 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-4 shrink-0">
              <div className="w-64">
                <SearchableSelect
                  value={department}
                  onChange={setDepartment}
                  options={deptOptions}
                  className="h-9 px-3 text-[12px] font-medium bg-white dark:bg-slate-900 border border-border/70 dark:border-slate-800 rounded-2xl focus:border-primary/60 text-foreground"
                />
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Employee..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-[12px] font-medium bg-white dark:bg-slate-900 border border-border/70 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all text-foreground"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50/50 dark:bg-slate-950/25 text-muted-foreground border-b border-border/50 sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">In Time</th>
                    <th className="px-5 py-3 font-semibold">Out Time</th>
                    <th className="px-5 py-3 font-semibold">Reason</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-foreground bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/40">
                  {pendingRequests.map(req => (
                    <tr key={req.id} className="border-b border-border/30 dark:border-slate-800/40 hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{req.name}</div>
                        <div className="text-[10px] text-muted-foreground">{req.empId} · {req.dept}</div>
                      </td>
                      <td className="px-5 py-3 font-medium">{req.date}</td>
                      <td className="px-5 py-3 text-muted-foreground">{req.in}</td>
                      <td className="px-5 py-3 text-muted-foreground">{req.out}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-xl text-[10px] font-bold">
                          {req.reason}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-colors cursor-pointer" title="Reject">
                            <XCircle className="size-4.5" />
                          </button>
                          <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl transition-colors cursor-pointer" title="Approve">
                            <CheckCircle2 className="size-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
