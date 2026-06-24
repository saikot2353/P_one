import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight, Cpu, CheckCircle2, XCircle, FileSpreadsheet, Printer, FileDown, Search, Eye,
  Table as TableIcon, FolderOpen, Clock, Activity, Undo2
} from "lucide-react";

export const Route = createFileRoute("/final-approve-increment")({
  head: () => ({
    meta: [
      { title: "Final Approve Increment — CRIPTON" },
      { name: "description", content: "Final salary increment approvals and corporate wage governance dashboard." }
    ],
  }),
  component: FinalApproveIncrementPage,
});

interface MasterRecord {
  sl: number;
  empId: string;
  name: string;
  designation: string;
  grade: string;
  joiningDate: string;
  salary: number;
  jobDuration: string;
  lastInc: number;
  lastIncDate: string;
  proposeInc: number;
  proposeProm: string;
  tillAfterSalary: number;
  remarks: string;
  status: "Pending" | "Approved";
}

const initial42Records: MasterRecord[] = [
  { sl: 1, empId: "2024053060", name: "Md. Mahfujul Haque", designation: "Manager", grade: "None", joiningDate: "10/12/2024", salary: 88000.00, jobDuration: "1 year 1 month 22 days", lastInc: 0, lastIncDate: "", proposeInc: 8000, proposeProm: "Manager", tillAfterSalary: 88000, remarks: "", status: "Approved" },
  { sl: 2, empId: "2024053062", name: "Mohammad Mayhedi Hasan", designation: "Deputy Manager", grade: "None", joiningDate: "10/12/2024", salary: 74000.00, jobDuration: "1 year 1 month 22 days", lastInc: 0, lastIncDate: "", proposeInc: 4000, proposeProm: "Deputy Manager", tillAfterSalary: 74000, remarks: "", status: "Approved" },
  { sl: 3, empId: "2025053377", name: "Md. Maruf Hossen", designation: "Asst. Manager", grade: "None", joiningDate: "05/01/2025", salary: 58000.00, jobDuration: "1 year 0 month 27 days", lastInc: 0, lastIncDate: "", proposeInc: 3000, proposeProm: "Asst. Manager", tillAfterSalary: 58000, remarks: "", status: "Approved" },
  { sl: 4, empId: "2025053673", name: "Md Jahid Hasan Polok", designation: "Sr. Executive", grade: "None", joiningDate: "20/01/2025", salary: 46000.00, jobDuration: "1 year 0 month 12 days", lastInc: 0, lastIncDate: "", proposeInc: 6000, proposeProm: "Sr. Executive", tillAfterSalary: 46000, remarks: "", status: "Approved" },
  { sl: 5, empId: "2025054315", name: "Md. Shahinur Alahi Khan", designation: "Asst. Manager", grade: "None", joiningDate: "16/02/2025", salary: 53000.00, jobDuration: "0 year 11 month 16 days", lastInc: 0, lastIncDate: "", proposeInc: 3000, proposeProm: "Asst. Manager", tillAfterSalary: 53000, remarks: "", status: "Approved" },
  { sl: 6, empId: "2025054548", name: "Md Rahat Hossain", designation: "Asst. Manager", grade: "None", joiningDate: "06/03/2025", salary: 67000.00, jobDuration: "0 year 10 month 26 days", lastInc: 0, lastIncDate: "", proposeInc: 2000, proposeProm: "Asst. Manager", tillAfterSalary: 67000, remarks: "", status: "Approved" },
  { sl: 7, empId: "2025055045", name: "Md. Mahfuzur Rahman", designation: "Jr. Executive", grade: "None", joiningDate: "03/05/2025", salary: 22000.00, jobDuration: "0 year 8 month 29 days", lastInc: 0, lastIncDate: "", proposeInc: 4000, proposeProm: "Jr. Executive", tillAfterSalary: 22000, remarks: "", status: "Approved" },
  { sl: 8, empId: "2025055747", name: "Sabbir Hossen Babu", designation: "Office Boy", grade: "None", joiningDate: "13/07/2025", salary: 11500.00, jobDuration: "0 year 6 month 19 days", lastInc: 0, lastIncDate: "", proposeInc: 1500, proposeProm: "Office Boy", tillAfterSalary: 11500, remarks: "", status: "Approved" },
  { sl: 9, empId: "2025056473", name: "Hasnain", designation: "Cleaner", grade: "None", joiningDate: "20/08/2025", salary: 12000.00, jobDuration: "0 year 5 month 12 days", lastInc: 0, lastIncDate: "", proposeInc: 1000, proposeProm: "Cleaner", tillAfterSalary: 12000, remarks: "", status: "Approved" },
  { sl: 10, empId: "2025056560", name: "Md. Rafsan Kabir", designation: "Jr. Executive", grade: "None", joiningDate: "01/09/2025", salary: 20000.00, jobDuration: "0 year 4 month 0 days", lastInc: 0, lastIncDate: "", proposeInc: 5000, proposeProm: "Jr. Executive", tillAfterSalary: 20000, remarks: "", status: "Approved" },
  { sl: 11, empId: "2025057437", name: "Towhidur Rahman", designation: "Executive", grade: "None", joiningDate: "18/10/2025", salary: 27000.00, jobDuration: "0 year 3 month 14 days", lastInc: 0, lastIncDate: "", proposeInc: 2000, proposeProm: "Executive", tillAfterSalary: 27000, remarks: "", status: "Approved" },
  { sl: 12, empId: "2025054609", name: "Md Mahir Shahriyar", designation: "Jr. Executive", grade: "None", joiningDate: "15/03/2025", salary: 33000.00, jobDuration: "0 year 10 month 17 days", lastInc: 3000, lastIncDate: "01/06/2025", proposeInc: 5000, proposeProm: "Jr. Executive", tillAfterSalary: 33000, remarks: "", status: "Approved" },
  { sl: 13, empId: "2025054707", name: "Allama Bakhtiyar Nafis", designation: "Jr. Executive", grade: "None", joiningDate: "16/04/2025", salary: 25000.00, jobDuration: "0 year 9 month 16 days", lastInc: 4000, lastIncDate: "01/07/2025", proposeInc: 6000, proposeProm: "Jr. Executive", tillAfterSalary: 25000, remarks: "", status: "Approved" },
  { sl: 14, empId: "2025054710", name: "Raihan Jami Khan", designation: "Jr. Executive", grade: "None", joiningDate: "16/04/2025", salary: 25000.00, jobDuration: "0 year 9 month 16 days", lastInc: 4000, lastIncDate: "01/07/2025", proposeInc: 6000, proposeProm: "Jr. Executive", tillAfterSalary: 25000, remarks: "", status: "Approved" },
  { sl: 15, empId: "2025053380", name: "Miraz Uddin", designation: "Jr. Executive", grade: "None", joiningDate: "06/01/2025", salary: 24000.00, jobDuration: "1 year 0 month 26 days", lastInc: 1000, lastIncDate: "01/05/2025", proposeInc: 3000, proposeProm: "Jr. Executive", tillAfterSalary: 24000, remarks: "", status: "Approved" },
  { sl: 16, empId: "2025053125", name: "Al Riyad Karim", designation: "Sr. Executive", grade: "None", joiningDate: "12/01/2025", salary: 46000.00, jobDuration: "1 year 0 month 20 days", lastInc: 3000, lastIncDate: "01/05/2025", proposeInc: 8000, proposeProm: "Sr. Executive", tillAfterSalary: 46000, remarks: "", status: "Approved" },
  { sl: 17, empId: "2023046543", name: "Md. Abdulla- Al- Mamun", designation: "Asst. Manager", grade: "None", joiningDate: "02/12/2023", salary: 60000.00, jobDuration: "2 year 1 month 30 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 5000, proposeProm: "Asst. Manager", tillAfterSalary: 60000, remarks: "", status: "Approved" },
  { sl: 18, empId: "2023046544", name: "Mazharul Haque", designation: "Deputy Manager", grade: "None", joiningDate: "02/12/2023", salary: 68000.00, jobDuration: "2 year 1 month 30 days", lastInc: 6000, lastIncDate: "01/01/2025", proposeInc: 10000, proposeProm: "Deputy Manager", tillAfterSalary: 68000, remarks: "", status: "Approved" },
  { sl: 19, empId: "2023044012", name: "Tanver Rahman Shaon", designation: "Asst. Manager", grade: "None", joiningDate: "01/01/2025", salary: 46000.00, jobDuration: "1 year 0 month 0 days", lastInc: 3000, lastIncDate: "01/04/2025", proposeInc: 3000, proposeProm: "Asst. Manager", tillAfterSalary: 46000, remarks: "", status: "Approved" },
  { sl: 20, empId: "2023044017", name: "Md. Rejaul Karim", designation: "Deputy Manager", grade: "None", joiningDate: "13/08/2023", salary: 63000.00, jobDuration: "2 year 5 month 19 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 8000, proposeProm: "Deputy Manager", tillAfterSalary: 63000, remarks: "", status: "Approved" },
  { sl: 21, empId: "2024049166", name: "MD Maimoon Hossain Shomoy", designation: "Sr. Executive", grade: "", joiningDate: "18/05/2024", salary: 43000.00, jobDuration: "1 year 8 month 14 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 8000, proposeProm: "Sr. Executive", tillAfterSalary: 43000, remarks: "", status: "Approved" },
  { sl: 22, empId: "2024049326", name: "Hanif Uddin", designation: "Sr. Executive", grade: "None", joiningDate: "01/06/2024", salary: 50000.00, jobDuration: "1 year 7 month 0 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 10000, proposeProm: "Sr. Executive", tillAfterSalary: 50000, remarks: "", status: "Approved" },
  { sl: 23, empId: "2024051508", name: "Pabitra Khasnabish Druba", designation: "Sr. Executive", grade: "", joiningDate: "01/09/2024", salary: 43000.00, jobDuration: "1 year 4 month 0 days", lastInc: 2000, lastIncDate: "01/01/2025", proposeInc: 6000, proposeProm: "Sr. Executive", tillAfterSalary: 43000, remarks: "", status: "Approved" },
  { sl: 24, empId: "2024051509", name: "Irfan Hossain", designation: "Jr. Executive", grade: "", joiningDate: "01/09/2024", salary: 26000.00, jobDuration: "1 year 4 month 0 days", lastInc: 3000, lastIncDate: "01/01/2025", proposeInc: 3000, proposeProm: "Jr. Executive", tillAfterSalary: 26000, remarks: "", status: "Approved" },
  { sl: 25, empId: "2024051510", name: "Md. Sadmanur Islam Shishir", designation: "Jr. Executive", grade: "", joiningDate: "01/09/2024", salary: 27000.00, jobDuration: "1 year 4 month 0 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 7000, proposeProm: "Jr. Executive", tillAfterSalary: 27000, remarks: "", status: "Approved" },
  { sl: 26, empId: "2024052333", name: "Mohammad Rahatul Islam", designation: "Sr. Executive", grade: "None", joiningDate: "01/10/2024", salary: 48000.00, jobDuration: "1 year 3 month 0 days", lastInc: 5000, lastIncDate: "01/01/2025", proposeInc: 8000, proposeProm: "Sr. Executive", tillAfterSalary: 48000, remarks: "", status: "Approved" },
  { sl: 27, empId: "2024052336", name: "Md. Badal Mia", designation: "Driver", grade: "None", joiningDate: "01/10/2024", salary: 20700.00, jobDuration: "1 year 3 month 0 days", lastInc: 500, lastIncDate: "01/01/2025", proposeInc: 1200, proposeProm: "Driver", tillAfterSalary: 20700, remarks: "", status: "Approved" },
  { sl: 28, empId: "2024052410", name: "Dipan Kumar Kundu", designation: "Sr. Executive", grade: "None", joiningDate: "15/10/2024", salary: 41000.00, jobDuration: "1 year 3 month 17 days", lastInc: 3000, lastIncDate: "01/02/2025", proposeInc: 8000, proposeProm: "Sr. Executive", tillAfterSalary: 41000, remarks: "", status: "Approved" },
  { sl: 29, empId: "2023044078", name: "Md. Anik Islam", designation: "Deputy Manager", grade: "None", joiningDate: "16/08/2023", salary: 79000.00, jobDuration: "2 year 5 month 16 days", lastInc: 7000, lastIncDate: "01/01/2025", proposeInc: 12000, proposeProm: "Deputy Manager", tillAfterSalary: 79000, remarks: "", status: "Approved" },
  { sl: 30, empId: "2023045146", name: "Asif Hossain", designation: "Driver", grade: "None", joiningDate: "04/10/2023", salary: 21200.00, jobDuration: "2 year 3 month 28 days", lastInc: 1500, lastIncDate: "01/01/2025", proposeInc: 1200, proposeProm: "Driver", tillAfterSalary: 21200, remarks: "", status: "Approved" },
  { sl: 31, empId: "2023046001", name: "Sohanur Rahman Sohan", designation: "Executive", grade: "None", joiningDate: "01/11/2023", salary: 27000.00, jobDuration: "2 year 2 month 0 days", lastInc: 4500, lastIncDate: "01/01/2025", proposeInc: 5000, proposeProm: "Executive", tillAfterSalary: 27000, remarks: "", status: "Approved" },
  { sl: 32, empId: "2024046961", name: "Sumaya Siddika", designation: "Deputy Manager", grade: "None", joiningDate: "03/01/2024", salary: 66000.00, jobDuration: "2 year 0 month 29 days", lastInc: 4000, lastIncDate: "01/01/2025", proposeInc: 10000, proposeProm: "Deputy Manager", tillAfterSalary: 66000, remarks: "", status: "Approved" },
  { sl: 33, empId: "2022040132", name: "Md. Sakil", designation: "Asst. Cook", grade: "None", joiningDate: "29/10/2022", salary: 13900.00, jobDuration: "3 year 3 month 3 days", lastInc: 1200, lastIncDate: "01/01/2025", proposeInc: 1500, proposeProm: "Asst. Cook", tillAfterSalary: 13900, remarks: "", status: "Approved" },
  { sl: 34, empId: "2022041203", name: "Khairul Bashar Masum", designation: "Asst. Manager", grade: "None", joiningDate: "01/12/2022", salary: 46500.00, jobDuration: "3 year 1 month 0 days", lastInc: 2500, lastIncDate: "01/01/2025", proposeInc: 1000, proposeProm: "Asst. Manager", tillAfterSalary: 46500, remarks: "", status: "Approved" },
  { sl: 35, empId: "2023043021", name: "Easin Mia", designation: "Receptionist", grade: "None", joiningDate: "01/02/2023", salary: 19000.00, jobDuration: "2 year 11 month 0 days", lastInc: 2000, lastIncDate: "01/01/2025", proposeInc: 2500, proposeProm: "Receptionist", tillAfterSalary: 19000, remarks: "", status: "Approved" },
  { sl: 36, empId: "2023043577", name: "Md. Mostakim Shah", designation: "Office Boy", grade: "None", joiningDate: "02/05/2023", salary: 14700.00, jobDuration: "2 year 8 month 30 days", lastInc: 2000, lastIncDate: "01/01/2025", proposeInc: 1500, proposeProm: "Office Boy", tillAfterSalary: 14700, remarks: "", status: "Approved" },
  { sl: 37, empId: "2021023079", name: "Md. Monjur Alam", designation: "Driver", grade: "None", joiningDate: "01/02/2023", salary: 21900.00, jobDuration: "2 year 11 month 0 days", lastInc: 1500, lastIncDate: "01/01/2025", proposeInc: 1200, proposeProm: "Driver", tillAfterSalary: 21900, remarks: "", status: "Approved" },
  { sl: 38, empId: "2022035599", name: "Dipon Saha", designation: "Manager", grade: "None", joiningDate: "07/05/2022", salary: 67000.00, jobDuration: "3 year 8 month 25 days", lastInc: 6000, lastIncDate: "01/01/2025", proposeInc: 8000, proposeProm: "Manager", tillAfterSalary: 67000, remarks: "", status: "Approved" },
  { sl: 39, empId: "2021028542", name: "Zakir Hossain", designation: "Executive", grade: "None", joiningDate: "09/10/2021", salary: 31500.00, jobDuration: "4 year 3 month 23 days", lastInc: 2500, lastIncDate: "01/01/2025", proposeInc: 3000, proposeProm: "Executive", tillAfterSalary: 31500, remarks: "", status: "Approved" },
  { sl: 40, empId: "2021032646", name: "Sadiqul Islam", designation: "Deputy Manager", grade: "None", joiningDate: "22/12/2021", salary: 59000.00, jobDuration: "4 year 1 month 10 days", lastInc: 3000, lastIncDate: "01/01/2025", proposeInc: 3000, proposeProm: "Deputy Manager", tillAfterSalary: 59000, remarks: "", status: "Approved" },
  { sl: 41, empId: "2021022804", name: "Kaikobad Howlader", designation: "Security Guard", grade: "None", joiningDate: "12/01/2021", salary: 15700.00, jobDuration: "5 year 0 month 20 days", lastInc: 1000, lastIncDate: "01/01/2025", proposeInc: 1200, proposeProm: "Security Guard", tillAfterSalary: 15700, remarks: "", status: "Approved" },
  { sl: 42, empId: "2019013884", name: "Javed Mia", designation: "Helper (Cook)", grade: "None", joiningDate: "12/01/2019", salary: 21200.00, jobDuration: "7 year 0 month 20 days", lastInc: 1000, lastIncDate: "01/01/2025", proposeInc: 1500, proposeProm: "Helper (Cook)", tillAfterSalary: 21200, remarks: "", status: "Approved" }
];

function FinalApproveIncrementPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [approveStatus, setApproveStatus] = useState("Approved");
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [gender, setGender] = useState("ALL");

  const [records, setRecords] = useState<MasterRecord[]>(initial42Records);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter(row => {
      if (approveStatus !== "ALL" && row.status !== approveStatus) return false;
      if (subDept !== "ALL" && row.designation !== subDept) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return row.name.toLowerCase().includes(q) || row.empId.includes(q) || row.designation.toLowerCase().includes(q);
      }
      return true;
    });
  }, [records, approveStatus, subDept, searchQuery]);

  // KPI Stats
  const totalCount = records.length;
  const pendingCount = records.filter(r => r.status === "Pending").length;
  const approvedCount = records.filter(r => r.status === "Approved").length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredRecords.map(r => r.empId)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setRecords(prev => prev.map(row => {
      if (selectedIds.has(row.empId)) {
        return { ...row, status: "Approved" as const };
      }
      return row;
    }));
    setSelectedIds(new Set());
    toast.success(`Successfully approved ${selectedIds.size} increments from Executive Board.`);
  };

  const handleBulkUndo = () => {
    if (selectedIds.size === 0) return;
    setRecords(prev => prev.map(row => {
      if (selectedIds.has(row.empId)) {
        return { ...row, status: "Pending" as const };
      }
      return row;
    }));
    setSelectedIds(new Set());
    toast.success(`Successfully reverted ${selectedIds.size} increment statuses to Pending.`);
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          
          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">HR Approvals</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Final Endorsement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Approve Increment (Final)
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-600/5 border border-purple-600/15 px-3 py-1.5 rounded-full select-none">
                MD / Executive Review Stage
              </span>
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Files</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{totalCount} Queued</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Approved</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{approvedCount} Authorized</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{pendingCount} Awaiting</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Cycle</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{month} {year}</h3>
              </div>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-3.5 gap-y-2.5">
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Year</label>
                <SearchableSelect value={year} onChange={setYear} options={[{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Month</label>
                <SearchableSelect value={month} onChange={setMonth} options={[{ value: "Jan", label: "Jan" }, { value: "Dec", label: "Dec" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company</label>
                <SearchableSelect value={company} onChange={setCompany} options={[{ value: "Pakiza Software Limited", label: "Pakiza Software Limited" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Area</label>
                <SearchableSelect value={area} onChange={setArea} options={[{ value: "PSL-Operation", label: "PSL-Operation" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Emp Type</label>
                <SearchableSelect value={empType} onChange={setEmpType} options={[{ value: "ALL", label: "ALL" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sub Dept</label>
                <SearchableSelect value={subDept} onChange={setSubDept} options={[{ value: "ALL", label: "ALL" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Title</label>
                <SearchableSelect value={jobTitle} onChange={setJobTitle} options={[{ value: "ALL", label: "ALL" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Unit</label>
                <SearchableSelect value={unit} onChange={setUnit} options={[{ value: "ALL", label: "ALL" }]} className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                {(["ALL", "Pending", "Approved"] as const).map(filter => {
                  const isActive = approveStatus === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setApproveStatus(filter)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Quick Search ID, Name..."
                  className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar & Data Table */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <TableIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> EXCEL
                </button>
                <button onClick={() => window.print()} className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
                </button>
                <button onClick={() => toast.success("Exporting PDF...")} className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <FileDown className="size-3.5 text-rose-500" /> PDF
                </button>
              </div>
            </div>

            {/* Bulk Action Bar - Sticky */}
            {selectedIds.size > 0 && (
              <div className="p-3 bg-purple-600/5 border-b border-purple-600/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-700 dark:text-purple-400 hover:bg-purple-600/20">
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">files ready for final MD authorization</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleBulkUndo} className="h-7.5 px-3 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer">
                    <Undo2 className="size-3.5" /> Undo Selected
                  </button>
                  <button onClick={handleBulkApprove} className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm">
                    <CheckCircle2 className="size-3.5" /> Final Approve
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[1400px] border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-600" 
                        onChange={handleSelectAll}
                        checked={selectedIds.size === filteredRecords.length && filteredRecords.length > 0}
                      />
                    </th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[60px]">#</th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[100px]">Emp ID</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[160px]">Name</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[140px]">Designation</th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[80px]">Grade</th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">Joining</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Salary</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[140px]">Job Duration</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Last Inc.</th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">Last Inc Date</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-purple-600 uppercase tracking-widest text-right">Propose Inc</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-purple-600 uppercase tracking-widest">Propose Prom</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-purple-600 uppercase tracking-widest text-right">After Inc Salary</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest text-right">Old CPF</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest text-right">New CPF</th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.has(row.empId);
                    return (
                      <tr key={row.empId} className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isChecked ? 'bg-purple-600/5 dark:bg-purple-600/10' : ''}`}>
                        <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-600" 
                            checked={isChecked}
                            onChange={() => handleSelectRow(row.empId)}
                          />
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-slate-400">{row.sl}</td>
                        <td className="px-3 py-2 font-mono text-slate-600 dark:text-slate-400">{row.empId}</td>
                        <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100">{row.name}</td>
                        <td className="px-4 py-2 text-[11px] text-slate-500">{row.designation}</td>
                        <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-500">{row.grade}</td>
                        <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-500">{row.joiningDate}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">৳{row.salary.toFixed(2)}</td>
                        <td className="px-4 py-2 text-[11px] text-slate-500">{row.jobDuration}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">{row.lastInc > 0 ? `৳${row.lastInc.toLocaleString()}` : "0"}</td>
                        <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-500">{row.lastIncDate || "—"}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-purple-600">৳{row.proposeInc.toLocaleString()}</td>
                        <td className="px-4 py-2 text-[11px] font-extrabold text-purple-600">{row.proposeProm}</td>
                        <td className="px-4 py-2 text-right font-mono font-black text-slate-800 dark:text-slate-200">৳{row.tillAfterSalary.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">৳{(row.salary * 0.6 * 0.1).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500">৳{(row.tillAfterSalary * 0.6 * 0.1).toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${row.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={17} className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold">
                        No pending increments available for final authorization.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>Showing 1 to {filteredRecords.length} entries</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Previous</button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">1</button>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
