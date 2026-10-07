import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileText,
  Eye,
  Edit2,
  X,
  Bell,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/absent-counseling")({
  head: () => ({
    meta: [
      { title: "Absent Counseling — CRIPTON HRIS" },
      { name: "description", content: "Absent counseling management" },
    ],
  }),
  component: AbsentCounselingPage,
});

interface AbsentRecord {
  id: string;
  empId: string;
  empIdOff: string;
  name: string;
  empType: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  totalAbsent: string;
  totalAbsentMonthly: string;
  totalAbsentYearly: string;
  lastPresentDate: string;
  absentReason: string;
  reportingBoss: string;
  hrRemarks: string;
  actionRemarks: string;
  verificationPhoneNo: string;
}

const initialData: AbsentRecord[] = [
  {
    id: "1",
    empId: "2025055855",
    empIdOff: "",
    name: "Champa",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Helper",
    unit: "Unit-05",
    line: "05",
    date: "15/09/2026",
    inTime: "07:53:08",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "2",
    totalAbsentMonthly: "2",
    totalAbsentYearly: "4",
    lastPresentDate: "12/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  },
  {
    id: "2",
    empId: "2024049362",
    empIdOff: "",
    name: "Dwip Chandra Das",
    empType: "Worker",
    department: "RMG Operations",
    section: "Cutting",
    designation: "Operator",
    unit: "N/A",
    line: "N/A",
    date: "15/09/2026",
    inTime: "07:56:03",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "1",
    totalAbsentMonthly: "3",
    totalAbsentYearly: "3",
    lastPresentDate: "13/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  },
  {
    id: "3",
    empId: "2022038859",
    empIdOff: "",
    name: "Happy Akter",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator",
    unit: "Unit-05",
    line: "08",
    date: "15/09/2026",
    inTime: "07:58:36",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "7",
    totalAbsentMonthly: "7",
    totalAbsentYearly: "7",
    lastPresentDate: "06/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  },
  {
    id: "4",
    empId: "2024053146",
    empIdOff: "",
    name: "Md Abu Kalam",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator",
    unit: "Unit-08",
    line: "60",
    date: "15/09/2026",
    inTime: "07:47:49",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "2",
    totalAbsentMonthly: "2",
    totalAbsentYearly: "2",
    lastPresentDate: "12/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  },
  {
    id: "5",
    empId: "2024053029",
    empIdOff: "",
    name: "Md Ibrahim Khalil",
    empType: "Worker",
    department: "RMG Operations",
    section: "Cutting",
    designation: "Operator",
    unit: "N/A",
    line: "N/A",
    date: "15/09/2026",
    inTime: "07:47:25",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "2",
    totalAbsentMonthly: "2",
    totalAbsentYearly: "2",
    lastPresentDate: "12/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  },
  {
    id: "6",
    empId: "2026059603",
    empIdOff: "",
    name: "Md. Akidul Islam",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    designation: "Helper",
    unit: "Unit-08",
    line: "N/A",
    date: "15/09/2026",
    inTime: "07:57:32",
    outDate: "15/09/2026",
    outTime: "",
    totalAbsent: "2",
    totalAbsentMonthly: "2",
    totalAbsentYearly: "4",
    lastPresentDate: "12/09/2026",
    absentReason: "",
    reportingBoss: "",
    hrRemarks: "",
    actionRemarks: "Not Taken",
    verificationPhoneNo: "",
  }
];

function AbsentCounselingPage() {
  const [records, setRecords] = useState<AbsentRecord[]>(initialData);
  const [tableSearch, setTableSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AbsentRecord | null>(null);

  // Filter States
  const [filterDate, setFilterDate] = useState("2026-09-15");
  const [filterEmpType, setFilterEmpType] = useState("Worker");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterSystemOffice, setFilterSystemOffice] = useState("System");

  const filteredRecords = useMemo(() => {
    if (!tableSearch.trim()) return records;
    const q = tableSearch.toLowerCase();
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.empId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }, [records, tableSearch]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateRecordField = (id: string, field: keyof AbsentRecord, value: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const openActionModal = (record: AbsentRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Breadcrumb and Page Header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-indigo-500 transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Counseling</span>
                <ChevronRight className="size-3" />
                <span className="text-indigo-500 font-extrabold">Absent Counseling</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="size-6 text-indigo-500" />
                <span>Absent Counseling</span>
              </h1>
            </div>
          </div>

          {/* Multi-parameter Query Search Filter Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success("Search applied"); }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold"
            >
              {/* Row 1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Employee Type</label>
                <select
                  value={filterEmpType}
                  onChange={(e) => setFilterEmpType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Worker">Worker</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Department</label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option>All Departments</option>
                  <option>RMG Operations</option>
                  <option>Finishing Department</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Section</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Designation</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Unit</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Line</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Shift</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>

              {/* Row 3 */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Job Nature</label>
                <select className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer">
                  <option>ALL</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase">Employee Id (Multi with comma)</label>
                <input
                  type="text"
                  placeholder="use comma as separator"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition font-mono placeholder:italic"
                />
              </div>
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="sysOff"
                    value="System"
                    checked={filterSystemOffice === "System"}
                    onChange={() => setFilterSystemOffice("System")}
                    className="text-indigo-500 focus:ring-indigo-500 size-4 cursor-pointer"
                  />
                  System
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="sysOff"
                    value="Office"
                    checked={filterSystemOffice === "Office"}
                    onChange={() => setFilterSystemOffice("Office")}
                    className="text-indigo-500 focus:ring-indigo-500 size-4 cursor-pointer"
                  />
                  Office
                </label>
              </div>

              {/* Reporting Boss & Search Button */}
              <div className="space-y-1.5 sm:col-span-2 md:col-span-3 lg:col-span-4 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div className="w-full sm:w-1/3 space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase">Reporting Boss</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition"
                      />
                      <button type="button" className="p-2.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-10 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider whitespace-nowrap mt-4 sm:mt-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Table Actions Toolbar */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                    <FileSpreadsheet className="size-3.5 text-emerald-500" />
                    <span>EXCEL</span>
                  </button>
                  <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                    <Printer className="size-3.5 text-blue-500" />
                    <span>PRINT</span>
                  </button>
                  <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                    <FileText className="size-3.5 text-rose-500" />
                    <span>PDF</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search records..."
                    className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30">
                      <input
                        type="checkbox"
                        checked={filteredRecords.length > 0 && selectedIds.size === filteredRecords.length}
                        onChange={handleSelectAll}
                        className="rounded border-slate-350 text-indigo-500 focus:ring-indigo-500 size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">SL</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Action</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp ID</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">EmpId (off.)</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Name</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp Type</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Department</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Section</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Designation</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Unit</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Line</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Date</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">In Time</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Out Date</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Out Time</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Total Absent</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Total Absent Monthly</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Total Absent Yearly</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Last Present Date</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 min-w-[140px]">Absent Reason</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 min-w-[140px]">Reporting Boss</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 min-w-[140px]">Hr Remarks</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 min-w-[120px]">Action Remarks</th>
                    <th className="px-3 py-3 min-w-[140px]">Verification Phone No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRecords.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">
                      <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleSelectRow(row.id)}
                          className="rounded border-slate-350 text-indigo-500 focus:ring-indigo-500 size-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50 text-center">{idx + 1}</td>
                      <td className="px-3 py-3 border-r border-slate-100 dark:border-slate-800/50 text-center">
                        <button
                          onClick={() => openActionModal(row)}
                          className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-1.5 rounded-lg transition-colors"
                          title="View Action Details"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.empId}</td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.empIdOff}</td>
                      <td className="px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.name}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.empType}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.department}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.section}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.designation}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.unit}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.line}</td>
                      <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.date}</td>
                      <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.inTime}</td>
                      <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.outDate}</td>
                      <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.outTime}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50 text-center font-bold">{row.totalAbsent}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50 text-center font-bold">{row.totalAbsentMonthly}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50 text-center font-bold">{row.totalAbsentYearly}</td>
                      <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50 text-center">{row.lastPresentDate}</td>
                      
                      {/* Inline Edit Fields */}
                      <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-800/50">
                        <input
                          type="text"
                          value={row.absentReason}
                          onChange={(e) => updateRecordField(row.id, "absentReason", e.target.value)}
                          className="w-full h-8 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10.5px] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-800/50">
                        <input
                          type="text"
                          value={row.reportingBoss}
                          onChange={(e) => updateRecordField(row.id, "reportingBoss", e.target.value)}
                          className="w-full h-8 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10.5px] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-800/50">
                        <input
                          type="text"
                          value={row.hrRemarks}
                          onChange={(e) => updateRecordField(row.id, "hrRemarks", e.target.value)}
                          className="w-full h-8 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10.5px] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </td>
                      <td className="px-2 py-2 border-r border-slate-100 dark:border-slate-800/50">
                        <select
                          value={row.actionRemarks}
                          onChange={(e) => updateRecordField(row.id, "actionRemarks", e.target.value)}
                          className="w-full h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10.5px] outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <option value="Not Taken">Not Taken</option>
                          <option value="Taken">Taken</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={row.verificationPhoneNo}
                          onChange={(e) => updateRecordField(row.id, "verificationPhoneNo", e.target.value)}
                          className="w-full h-8 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10.5px] outline-none focus:border-indigo-500 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={25} className="px-4 py-12 text-center text-slate-400 font-bold">
                        No records found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} of {filteredRecords.length} entries
              </span>
              <div className="flex items-center gap-1.5 select-none text-[10.5px] font-bold">
                <button className="px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button className="size-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black">
                  1
                </button>
                <button className="px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Action Details Modal */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-5xl overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    View Action Details
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Counselling history for the selected employee
                  </p>
                </div>
              </div>
              <button
                onClick={closeActionModal}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6">
              {/* User Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Name:</span> <span className="text-slate-600 dark:text-slate-400">{selectedRecord.name}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Department:</span> <span className="text-slate-600 dark:text-slate-400">{selectedRecord.department}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Designation:</span> <span className="text-slate-600 dark:text-slate-400">{selectedRecord.designation}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-300">Unit:</span> <span className="text-slate-600 dark:text-slate-400">{selectedRecord.unit}</span>
                </div>
              </div>

              {/* History Section */}
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3">
                  Counselling History :-
                </h3>
                
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-[#2c3e50] dark:bg-slate-800 text-white font-bold">
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Counsel Date</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Emp ID</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Action Taken By</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Reason For Absent</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Reporting Person</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">Verification Phone</th>
                        <th className="px-4 py-3 border-r border-slate-600 dark:border-slate-700">HR Remarks</th>
                        <th className="px-4 py-3">HR Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-medium bg-white dark:bg-[#1e293b]">
                          No history found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
              <button
                onClick={closeActionModal}
                className="h-9 px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg transition-colors shadow-sm"
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
