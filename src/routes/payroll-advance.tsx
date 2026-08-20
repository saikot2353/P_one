import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import {
  ChevronRight,
  Banknote,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  FileText,
  Trash2,
  Edit,
  MoreHorizontal,
  FileSpreadsheet,
  CircleDollarSign, Clock, UserCheck, MessageSquare, AlertCircle, X, Building2, Briefcase, CalendarDays, MapPin, Eye, CheckCircle2, XCircle, Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { SearchableSelect } from "@/components/ui/searchable-select";


const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-10 5 10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/></svg>
);

export const Route = createFileRoute("/payroll-advance")({
  head: () => ({
    meta: [
      { title: "Advance Management — CRIPTON" },
      { name: "description", content: "Manage advance requisitions and lists in a unified view." },
    ],
  }),
  component: PayrollAdvancePage,
});

// Dummy Employee Details for the Searchable Dropdown
const employeeOptions = [
  {
    value: "2021028542",
    label: "2021028542 - Zakir Hossain",
    company: "Pakiza Software Limited",
    type: "Office Executive",
    department: "Implementation & Support (HR)",
    designation: "Executive",
    basic: "15,000.00",
    gross: "25,000.00",
  },
  {
    value: "2022041203",
    label: "2022041203 - Khairul Bashar Masum",
    company: "Pakiza Software Limited",
    type: "Office Executive",
    department: "HR Team",
    designation: "Asst. Manager",
    basic: "22,500.00",
    gross: "35,000.00",
  },
  {
    value: "2023043910",
    label: "2023043910 - Tahmid Afsar",
    company: "Pakiza Software Limited",
    type: "Office Executive",
    department: "Project Resource & Strategy",
    designation: "Asst. Manager",
    basic: "28,000.00",
    gross: "45,000.00",
  },
  {
    value: "2023046001",
    label: "2023046001 - Sohanur Rahman Schan",
    company: "Pakiza Software Limited",
    type: "Office Executive",
    department: "Admin",
    designation: "Executive",
    basic: "18,000.00",
    gross: "30,000.00",
  },
];

// Dummy Data based on the user's screenshots
const advanceData = [
  {
    id: "PSL-RQ-ADV-391911",
    empId: "2021028542",
    empName: "Zakir Hossain",
    employeeName: "Zakir Hossain",
    employeeId: "2021028542",
    designation: "Executive",
    type: "Office Executive",
    dept: "Implementation & Support (HR)",
    department: "Implementation & Support (HR)",
    section: "Project Resource & Strategy",
    joiningDate: "15 Mar 2025",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "April",
    year: "2026",
    amount: 15000.0,
    advanceAmount: 15000.0,
    basicSalary: 12000.0,
    grossSalary: 20000.0,
    status: "Approved",
    remarks: "Salary Advance.",
    remark: "Requesting salary advance due to family medical emergency.",
    applicationDate: "14 Jul 2026",
    submittedTime: "09:18 AM",
    revision: "00",
    history: [
      { month: "March", year: "2026", advance: 5000.0, status: "Approved", remark: "Medical checkup" },
      { month: "May", year: "2026", advance: 3000.0, status: "Approved", remark: "Festival helper" }
    ],
    approvalSteps: [
      { role: "MANAGER", name: "Tahmid Afsar", title: "Deputy Manager", department: "Business Innovation", status: "Approved", timestamp: "09:18 AM · 14 Jul 2026" },
      { role: "HOD", name: "Md. Zahidul Islam", title: "COO", department: "Operations", status: "Approved", timestamp: "10:30 AM · 14 Jul 2026" },
      { role: "HEAD OF HR", name: "Rajeabul Hasan Rajon", title: "Head of HR", department: "Human Resources", status: "Pending", timestamp: "Pending" }
    ],
    comments: [
      { id: 1, authorName: "Tahmid Afsar", authorRole: "Manager", initials: "TA", comment: "Created requisition", timestamp: "14 Jul 2026 · 09:18 AM" }
    ]
  },
  {
    id: "PSL-RQ-ADV-391912",
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    employeeName: "Khairul Bashar Masum",
    employeeId: "2022041203",
    designation: "Asst. Manager",
    type: "Office Executive",
    dept: "HR Team",
    department: "HR Team",
    section: "Human Resources",
    joiningDate: "10 Jan 2024",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "February",
    year: "2026",
    amount: 5500.0,
    advanceAmount: 5500.0,
    basicSalary: 22500.0,
    grossSalary: 35000.0,
    status: "Approved",
    remarks: "Salary Advance.",
    remark: "Personal reasons.",
    applicationDate: "05 Feb 2026",
    submittedTime: "11:20 AM",
    revision: "00",
    history: [],
    approvalSteps: [],
    comments: []
  },
  {
    id: "PSL-RQ-ADV-391913",
    empId: "2022041203",
    empName: "Khairul Bashar Masum",
    employeeName: "Khairul Bashar Masum",
    employeeId: "2022041203",
    designation: "Asst. Manager",
    type: "Office Executive",
    dept: "HR Team",
    department: "HR Team",
    section: "Human Resources",
    joiningDate: "10 Jan 2024",
    businessUnit: "Pakiza Software Limited",
    location: "PSL-Operation",
    company: "Pakiza Software Limited",
    month: "April",
    year: "2026",
    amount: 3500.0,
    advanceAmount: 3500.0,
    basicSalary: 22500.0,
    grossSalary: 35000.0,
    status: "Pending",
    remarks: "Salary Advance",
    remark: "Emergency.",
    applicationDate: "10 Apr 2026",
    submittedTime: "10:15 AM",
    revision: "00",
    history: [],
    approvalSteps: [],
    comments: []
  }
];

function PayrollAdvancePage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [approvalComment, setApprovalComment] = useState("");

  const selectedEmployee = employeeOptions.find((emp) => emp.value === selectedEmpId) || null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Approved</Badge>
        );
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full">

      {/* -------------------- DETAIL APPROVAL VIEW MODAL -------------------- */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative space-y-5">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs shrink-0 border border-blue-100/50">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">Salary Advance Requisition</h1>
                    {getStatusBadge(selectedReq.status)}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <p className="text-[11px] text-slate-500 font-semibold tracking-tight">
                      # Application No: <span className="text-slate-700">{selectedReq.id}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">
                      # Revision: <span className="text-slate-600">{selectedReq.revision}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right metadata / Close Button */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right border-r pr-4 border-slate-200 hidden sm:block">
                  <span className="text-[9px] text-slate-400 block font-bold tracking-wider uppercase">APPLICATION DATE</span>
                  <span className="text-xs font-extrabold text-slate-700 block">{selectedReq.applicationDate}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Submitted {selectedReq.submittedTime}</span>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shrink-0 shadow-3xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REQUEST FOR Card Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-sm shadow-blue-500/20 shrink-0">
                    {selectedReq.employeeName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">REQUEST FOR</span>
                    <h2 className="text-sm font-extrabold text-slate-800 truncate">{selectedReq.employeeName}</h2>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Employee ID · {selectedReq.employeeId}</p>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DESIGNATION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DEPARTMENT</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <LayersIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SECTION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.section || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DATE OF JOINING</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.joiningDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">BUSINESS UNIT</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.businessUnit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">LOCATION</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedReq.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requisition Items section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Salary Advance Details</h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold select-none text-[10px]">
                      <th className="py-3 px-4 w-12 text-center uppercase tracking-wider">SL</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Advance Month/Year</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Basic Salary</th>
                      <th className="py-3 px-4 uppercase tracking-wider">Gross Salary</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-right">Requested Advance</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-center">Ratio to Basic</th>
                      <th className="py-3 px-4 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 font-semibold text-slate-700 transition-colors">
                      <td className="py-4 px-4 text-center text-slate-400">1</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{selectedReq.month} {selectedReq.year}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">SALARY ADVANCE</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.basicSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 font-mono text-slate-600">BDT {selectedReq.grossSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-blue-600">BDT {selectedReq.advanceAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-150">
                          {selectedReq.basicSalary ? ((selectedReq.advanceAmount / selectedReq.basicSalary) * 100).toFixed(1) : 0}% of Basic
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(selectedReq.status)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/30 text-xs">
                      <td colSpan={7} className="py-3 px-5 text-slate-600 leading-relaxed">
                        <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] mr-2">Employee Remark:</span>
                        <span className="italic">"{selectedReq.remark}"</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Salary Advance History Section */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Salary Advance History</h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold select-none text-[10px]">
                      <th className="py-2.5 px-4 uppercase tracking-wider">Month</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider">Year</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider text-right">Advance</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider text-center">Status</th>
                      <th className="py-2.5 px-4 uppercase tracking-wider">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedReq.history || selectedReq.history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold bg-white">
                          No data available!
                        </td>
                      </tr>
                    ) : (
                      selectedReq.history.map((hist: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white font-semibold text-slate-700 transition-colors">
                          <td className="py-3 px-4 text-slate-900">{hist.month}</td>
                          <td className="py-3 px-4 text-slate-600">{hist.year}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-800">BDT {hist.advance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(hist.status)}
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic font-medium">{hist.remark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approval Workflow & Signatures */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Approval Workflow & Signatures</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedReq.approvalSteps?.map((step: any, idx: number) => (
                  <div key={idx} className="relative p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">{step.role}</span>
                      {step.status === 'Approved' ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[9px] font-extrabold tracking-wider uppercase">Approved</span>
                        </div>
                      ) : step.status === 'Rejected' ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                          <XCircle className="w-3 h-3" />
                          <span className="text-[9px] font-extrabold tracking-wider uppercase">Rejected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                          <Clock className="w-3 h-3" />
                          <span className="text-[9px] font-extrabold tracking-wider uppercase">Pending</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100/50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-200/50">
                        {step.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-800 truncate">{step.name}</h4>
                        <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{step.title}</p>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{step.department}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                        <CalendarDays className="w-3 h-3" />
                        <span>{step.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & Approval Notes */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Comments & Approval Notes</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Left: Comment History */}
                <div className="space-y-4">
                  {selectedReq.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3.5 group">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-sm border border-emerald-500/20 z-10 relative">
                          {comment.initials}
                        </div>
                        <div className="absolute top-8 bottom-[-16px] left-1/2 -translate-x-1/2 w-px bg-slate-200 group-last:hidden" />
                      </div>
                      <div className="flex-1 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-slate-800">{comment.authorName}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{comment.authorRole}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold bg-white px-2 py-1 rounded-md border border-slate-100 shadow-3xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedReq.comments || selectedReq.comments.length === 0) && (
                     <div className="text-center py-6 text-xs text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       No comments added yet.
                     </div>
                  )}
                </div>

                {/* Right: Action Panel */}
                {selectedReq.status === 'Pending' && (
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Review & Action Panel</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Add Comment / Note</label>
                        <textarea
                          value={approvalComment}
                          onChange={(e) => setApprovalComment(e.target.value)}
                          placeholder="Type your approval note or rejection explanation here..."
                          className="w-full p-3.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder:text-slate-300 transition-all resize-none shadow-3xs"
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            const newReq = {...selectedReq, status: 'Approved'};
                            setSelectedReq(newReq);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            const newReq = {...selectedReq, status: 'Rejected'};
                            setSelectedReq(newReq);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
          </div>
        </div>
      )}

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Advance Management</span>
          </div>

          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <Banknote className="size-5" />
                </div>
                Advance Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Unified view for managing advance requisitions and historical lists.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Printer className="size-4" /> Print
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <FileText className="size-4" /> PDF
              </Button>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" /> New Requisition
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl">
                  <DialogHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Banknote className="size-5" />
                      </div>
                      <div>
                        <DialogTitle className="text-lg font-bold text-slate-800">New Advance Requisition</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 mt-1">
                          Create a new salary or general advance request for an employee.
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
                      {/* Left Column - Readonly Info */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label
                            htmlFor="req-empid"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            EmpId
                          </Label>
                          <SearchableSelect
                            options={employeeOptions}
                            value={selectedEmpId}
                            onChange={setSelectedEmpId}
                            placeholder="Search Emp ID..."
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Company
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.company || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Employee Type
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.type || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Department
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.department || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Designation
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.designation || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Basic Salary
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.basic || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Gross Salary
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmployee?.gross || ""}
                            placeholder="-"
                            className="h-8 text-xs bg-muted/40 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Right Column - Inputs */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label
                            htmlFor="req-month"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Month
                          </Label>
                          <Select defaultValue="06">
                            <SelectTrigger id="req-month" className="h-8 text-xs">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label
                            htmlFor="req-year"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Year
                          </Label>
                          <Select defaultValue="2026">
                            <SelectTrigger id="req-year" className="h-8 text-xs">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                          <Label
                            htmlFor="req-amount"
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Advance Amount
                          </Label>
                          <Input
                            id="req-amount"
                            type="number"
                            placeholder="0.00"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                          <Label
                            htmlFor="req-remarks"
                            className="text-xs font-medium text-muted-foreground pt-2"
                          >
                            Remark
                          </Label>
                          <textarea
                            id="req-remarks"
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        {/* Buttons moved to footer */}
                      </div>
                    </div>

                    {/* History Table */}
                    <div className="space-y-3 mt-6 border-t border-border/60 pt-6">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b-2 border-primary/20 pb-1 w-max">
                        Salary Advance History
                      </h3>
                      <div className="border border-border/60 rounded-md overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead className="text-xs font-bold text-primary">
                                Month
                              </TableHead>
                              <TableHead className="text-xs font-bold text-primary">Year</TableHead>
                              <TableHead className="text-xs font-bold text-primary">
                                Advance
                              </TableHead>
                              <TableHead className="text-xs font-bold text-primary">
                                Status
                              </TableHead>
                              <TableHead className="text-xs font-bold text-primary">
                                Remark
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-transparent">
                              <TableCell
                                colSpan={5}
                                className="text-center text-xs text-muted-foreground font-medium py-8 bg-muted/10"
                              >
                                No data available!
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="px-6 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <Button
                      variant="ghost"
                      className="text-slate-600 font-medium px-4 hover:bg-slate-100"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm px-6"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Smart Filter Panel */}
          <div className="bg-card border border-border/60 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Employee Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input placeholder="Search by ID or Name..." className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Month</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Year</label>
                <Select defaultValue="2026">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Company</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="pakiza">Pakiza Software Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Employee Type</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="office-exec">Office Executive</SelectItem>
                      <SelectItem value="office-staff">Office Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="hr">HR Team</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="default" className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="px-3" title="Reset Filters">
                    Reset
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-center -mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground h-7"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="size-3 mr-1.5" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
              </Button>
            </div>
          </div>

          {/* Unified Data Table */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">SL</TableHead>
                    <TableHead>Emp ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advanceData.map((row, idx) => (
                    <TableRow key={row.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium text-primary">{row.empId}</TableCell>
                      <TableCell>
                        <div className="font-medium">{row.empName}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">
                          {row.type} • {row.company}
                        </div>
                      </TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {row.month}/{row.year}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(row.status)}</TableCell>
                      <TableCell
                        className="text-muted-foreground text-sm max-w-[200px] truncate"
                        title={row.remarks}
                      >
                        {row.remarks}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-70 hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedReq(row)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-muted/20">
              <div>Showing 1 to 10 of 20 entries</div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
