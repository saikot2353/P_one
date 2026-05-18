import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Cpu, Search, FileSpreadsheet, Printer, FileDown, Check, X, Eye
} from "lucide-react";

export const Route = createFileRoute("/final-approve-increment")({
  head: () => ({
    meta: [
      { title: "Approve Increment — CRIPTON" },
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
  // Top Parametric filter states matching Screenshot 1
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Table filtering logic
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

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.empId));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(e => e !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      alert("Please select employee records first.");
      return;
    }
    setRecords(prev => prev.map(row => {
      if (selectedIds.includes(row.empId)) {
        return { ...row, status: "Approved" as const };
      }
      return row;
    }));
    setSelectedIds([]);
    alert("Selected increments approved successfully.");
  };

  const handleUndoSelected = () => {
    if (selectedIds.length === 0) {
      alert("Please select employee records first.");
      return;
    }
    setRecords(prev => prev.map(row => {
      if (selectedIds.includes(row.empId)) {
        return { ...row, status: "Pending" as const };
      }
      return row;
    }));
    setSelectedIds([]);
    alert("Selected increments rolled back to Pending status.");
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
                <span className="text-primary font-black">Approve Increment</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Cpu className="size-5.5 text-primary" />
                <span>Approve Increment Console</span>
              </h1>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Year</label>
                <select value={year} onChange={e => setYear(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Jan">Jan</option>
                  <option value="Dec">Dec</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Approve Status</label>
                <select value={approveStatus} onChange={e => setApproveStatus(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Company</label>
                <select value={company} onChange={e => setCompany(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Area</label>
                <select value={area} onChange={e => setArea(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Sub Department</label>
                <select value={subDept} onChange={e => setSubDept(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Job Title</label>
                <select value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
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
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                    <option value="ALL">ALL</option>
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
                    <th className="px-3 py-3 font-mono font-black">Emp ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-3 py-3 text-center">Grade</th>
                    <th className="px-3 py-3 text-center">Joining Date</th>
                    <th className="px-4 py-3 text-right">Salary</th>
                    <th className="px-4 py-3">Job Duration</th>
                    <th className="px-4 py-3 text-right">Last Increment</th>
                    <th className="px-3 py-3 text-center">Last Inc Date</th>
                    <th className="px-4 py-3 text-right text-primary">Propose Increment</th>
                    <th className="px-4 py-3 text-primary">Propose Promotion</th>
                    <th className="px-4 py-3 text-right text-primary">Till after Increment Salary</th>
                    <th className="px-4 py-3 text-right text-emerald-600">Old CPF</th>
                    <th className="px-4 py-3 text-right text-emerald-600">New CPF</th>
                    <th className="px-4 py-3">Remarks</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.includes(row.empId);
                    return (
                      <tr 
                        key={row.empId} 
                        className={`hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRow(row.empId)}
                            className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                          />
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/75 font-semibold">{row.sl}</td>
                        <td className="px-3 py-3 font-mono font-semibold text-foreground">{row.empId}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.designation}</td>
                        <td className="px-3 py-3 text-center font-medium text-muted-foreground/80">{row.grade}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">{row.joiningDate}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">৳{row.salary.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground/90 font-medium">{row.jobDuration}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/80">
                          {row.lastInc > 0 ? `৳${row.lastInc.toLocaleString()}` : "0"}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">{row.lastIncDate || "—"}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-primary">৳{row.proposeInc.toLocaleString()}</td>
                        <td className="px-4 py-3 text-primary font-semibold">{row.proposeProm}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-primary">৳{row.tillAfterSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/80">৳{(row.salary * 0.6 * 0.1).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">৳{(row.tillAfterSalary * 0.6 * 0.1).toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground/60 italic">{row.remarks || "—"}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" : "bg-amber-500/10 text-amber-600 border border-amber-500/15"}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              
              {/* Action buttons matching screenshot 1 bottom left */}
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
                  onClick={() => alert("Generating MD printable executive board PDF...")}
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
