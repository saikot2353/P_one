import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  UserCheck, ShieldAlert, Award, ChevronRight, Plus, Search, Check, X,
  Briefcase, Building, User, Calendar, FileText, CheckCircle2, AlertTriangle, ArrowRightLeft, Eye, XCircle
} from "lucide-react";

export const Route = createFileRoute("/personnel-approval")({
  head: () => ({
    meta: [
      { title: "Personnel Approvals — CRIPTON" },
      { name: "description", content: "Approve new employee joinings and execute employment status conversions." },
    ],
  }),
  component: PersonnelApprovalPage,
});

// Candidate for Joining Approval (Tab 1)
interface PendingCandidate {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  grossSalary: number;
  email: string;
  phone: string;
  status: "Pending Approval" | "Draft/Review" | "Approved" | "Rejected";
  approvedEmpId?: string;
  rejectionReason?: string;
}

const initialCandidates: PendingCandidate[] = [
  {
    id: "APP-20261109",
    name: "Tahmid Afsar Shapno",
    jobTitle: "Office Executive",
    department: "Business Innovation",
    joiningDate: "01/08/2023",
    grossSalary: 152000.00,
    email: "tahmid.bd@pakizasoftware.com",
    phone: "01750021154",
    status: "Pending Approval"
  },
  {
    id: "APP-20260481",
    name: "Fahim Faisal",
    jobTitle: "Software Engineer",
    department: "Business Innovation",
    joiningDate: "15/05/2026",
    grossSalary: 85000.00,
    email: "fahim@pakizasoftware.com",
    phone: "01827394852",
    status: "Pending Approval"
  },
  {
    id: "APP-20260273",
    name: "Nusrat Jahan",
    jobTitle: "HR Officer",
    department: "Operations & HR",
    joiningDate: "01/06/2026",
    grossSalary: 45000.00,
    email: "nusrat@pakizasoftware.com",
    phone: "01928374650",
    status: "Draft/Review"
  }
];

// Employee for Status Transition (Tab 2)
interface EmployeeStatusRecord {
  empId: string;
  name: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  defaultHoliday: string;
  bloodGroup: string;
  basic: number;
  gross: number;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  otStatus: string;
  otRate: number;
  workingStatus: "Working" | "Suspended" | "Terminated" | "Resigned" | "On Leave";
  employmentStatus: "Probation" | "Permanent" | "Contractual" | "Temporary";
  confirmationDate?: string;
  perVil: string;
  acStatus: "Active" | "Inactive";
  conversionStatus: "Pending" | "Approved" | "Rejected";
  conversionNotes?: string;
}

const initialEmployees: EmployeeStatusRecord[] = [
  {
    empId: "2023043910",
    name: "Tahmid Afsar Shapno",
    jobTitle: "Asst. Manager",
    department: "Business Innovation",
    joiningDate: "01/08/2023",
    defaultHoliday: "Friday",
    bloodGroup: "AB (+ve)",
    basic: 91200.00,
    gross: 152000.00,
    email: "tahmid.bd@pakizasoftware.com",
    phone: "01750021154",
    gender: "Male",
    dob: "12/07/1999",
    otStatus: "N/A",
    otRate: 0,
    workingStatus: "Working",
    employmentStatus: "Probation",
    perVil: "Bhola",
    acStatus: "Active",
    conversionStatus: "Pending"
  },
  {
    empId: "2024091802",
    name: "Md. Anik Islam",
    jobTitle: "Business Analyst",
    department: "Business Innovation",
    joiningDate: "01/06/2024",
    defaultHoliday: "Friday",
    bloodGroup: "O (+ve)",
    basic: 47400.00,
    gross: 79000.00,
    email: "anik@pakizasoftware.com",
    phone: "01711223344",
    gender: "Male",
    dob: "25/08/1998",
    otStatus: "Active",
    otRate: 150,
    workingStatus: "Working",
    employmentStatus: "Permanent",
    confirmationDate: "01/09/2024",
    perVil: "Dhaka",
    acStatus: "Active",
    conversionStatus: "Approved"
  },
  {
    empId: "2025110293",
    name: "Riazul Islam",
    jobTitle: "HR Officer",
    department: "Operations & HR",
    joiningDate: "01/11/2025",
    defaultHoliday: "Friday",
    bloodGroup: "A (+ve)",
    basic: 27000.00,
    gross: 45000.00,
    email: "riazul@pakizasoftware.com",
    phone: "01899887766",
    gender: "Male",
    dob: "14/02/1996",
    otStatus: "N/A",
    otRate: 0,
    workingStatus: "Working",
    employmentStatus: "Probation",
    perVil: "Barishal",
    acStatus: "Active",
    conversionStatus: "Pending"
  }
];

function PersonnelApprovalPage() {
  const [activeTab, setActiveTab] = useState<"approval" | "status">("approval");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"pending" | "approved">("pending");

  // Tab 1 (Employee Approval) state
  const [candidates, setCandidates] = useState<PendingCandidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<PendingCandidate | null>(null);
  const [candidateDetailsModal, setCandidateDetailsModal] = useState<PendingCandidate | null>(null);
  const [rejectCandidateModal, setRejectCandidateModal] = useState<PendingCandidate | null>(null);

  // Tab 1 Form states
  const [generatedEmpId, setGeneratedEmpId] = useState("");
  const [joiningStatus, setJoiningStatus] = useState<"Probation" | "Permanent">("Probation");
  const [candidateRejectReason, setCandidateRejectReason] = useState("Documents Incomplete");

  // Tab 2 (Change Employment Status) state
  const [employees, setEmployees] = useState<EmployeeStatusRecord[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeStatusRecord | null>(null);
  const [selectedApproveEmp, setSelectedApproveEmp] = useState<EmployeeStatusRecord | null>(null);
  const [selectedRejectEmp, setSelectedRejectEmp] = useState<EmployeeStatusRecord | null>(null);

  // Tab 2 Form states
  const [confirmDate, setConfirmDate] = useState("01/11/2023");
  const [newEmploymentType, setNewEmploymentType] = useState<"Probation" | "Permanent" | "Contractual">("Permanent");
  const [newWorkingStatus, setNewWorkingStatus] = useState<"Working" | "Suspended" | "Terminated" | "Resigned">("Working");
  const [empStatusRejectReason, setEmpStatusRejectReason] = useState("Performance threshold unmet");

  // Statistics calculation for dynamic tab counters
  const stats = useMemo(() => {
    const pendingApp = candidates.filter(c => c.status !== "Approved" && c.status !== "Rejected").length;
    const pendingConversion = employees.filter(e => e.conversionStatus === "Pending").length;
    return { pendingApp, pendingConversion };
  }, [candidates, employees]);

  // Filter lists
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // 1. Pending vs Approved/Rejected filter toggle
      if (filterStatus === "pending") {
        if (c.status !== "Pending Approval" && c.status !== "Draft/Review") return false;
      } else {
        if (c.status !== "Approved" && c.status !== "Rejected") return false;
      }

      // 2. Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.jobTitle.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [candidates, searchQuery, filterStatus]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      // 1. Pending vs Approved/Rejected status transition filter
      if (filterStatus === "pending") {
        if (e.conversionStatus !== "Pending") return false;
      } else {
        if (e.conversionStatus !== "Approved" && e.conversionStatus !== "Rejected") return false;
      }

      // 2. Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.jobTitle.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.empId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [employees, searchQuery, filterStatus]);

  // Trigger candidate approval modal
  const handleOpenApproveModal = (candidate: PendingCandidate) => {
    setSelectedCandidate(candidate);
    setGeneratedEmpId(candidate.name.includes("Shapno") ? "2023043910" : `2026${String(Math.floor(1000 + Math.random() * 9000))}`);
    setJoiningStatus(candidate.name.includes("Shapno") ? "Permanent" : "Probation");
  };

  // Confirm candidates approval
  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    if (!generatedEmpId.trim()) {
      alert("Please specify a valid generated Employee ID!");
      return;
    }

    setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, status: "Approved", approvedEmpId: generatedEmpId } : c));

    const newEmp: EmployeeStatusRecord = {
      empId: generatedEmpId,
      name: selectedCandidate.name,
      jobTitle: selectedCandidate.jobTitle,
      department: selectedCandidate.department,
      joiningDate: selectedCandidate.joiningDate,
      defaultHoliday: "Friday",
      bloodGroup: selectedCandidate.name.includes("Shapno") ? "AB (+ve)" : "O (+ve)",
      basic: selectedCandidate.grossSalary * 0.6,
      gross: selectedCandidate.grossSalary,
      email: selectedCandidate.email,
      phone: selectedCandidate.phone,
      gender: "Male",
      dob: "12/07/1999",
      otStatus: "N/A",
      otRate: 0,
      workingStatus: "Working",
      employmentStatus: joiningStatus as any,
      perVil: "Bhola",
      acStatus: "Active",
      conversionStatus: "Approved"
    };

    setEmployees(prev => [newEmp, ...prev]);
    alert(`Candidate ${selectedCandidate.name} has been approved successfully! Assigned Employee ID: ${generatedEmpId}.`);
    setSelectedCandidate(null);
  };

  // Decline/Reject Candidate
  const handleConfirmRejectCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectCandidateModal) return;

    setCandidates(prev => prev.map(c => c.id === rejectCandidateModal.id ? { ...c, status: "Rejected", rejectionReason: candidateRejectReason } : c));
    alert(`Candidate ${rejectCandidateModal.name} joining application has been Rejected. Reason: ${candidateRejectReason}.`);
    setRejectCandidateModal(null);
  };

  // Tab 2: Approve Employment Conversion Request
  const handleOpenApproveConversion = (emp: EmployeeStatusRecord) => {
    setSelectedApproveEmp(emp);
    if (emp.name.includes("Shapno")) {
      setConfirmDate("01/11/2023");
    } else {
      setConfirmDate("17/05/2026");
    }
  };

  const handleConfirmConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproveEmp) return;

    setEmployees(prev => prev.map(e => {
      if (e.empId === selectedApproveEmp.empId) {
        return {
          ...e,
          employmentStatus: "Permanent",
          confirmationDate: confirmDate,
          conversionStatus: "Approved"
        };
      }
      return e;
    }));

    alert(`Conversion to Permanent type approved for employee ${selectedApproveEmp.name}. Effective Confirmation Date: ${confirmDate}.`);
    setSelectedApproveEmp(null);
  };

  // Tab 2: Decline/Reject Employment Conversion Request
  const handleConfirmDeclineConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectEmp) return;

    setEmployees(prev => prev.map(e => {
      if (e.empId === selectedRejectEmp.empId) {
        return {
          ...e,
          conversionStatus: "Rejected",
          conversionNotes: empStatusRejectReason
        };
      }
      return e;
    }));

    alert(`Conversion request for ${selectedRejectEmp.name} declined. Reason: ${empStatusRejectReason}. Employee will remain in probationary state.`);
    setSelectedRejectEmp(null);
  };

  // Admin Override Modal Trigger
  const handleOpenStatusModal = (emp: EmployeeStatusRecord) => {
    setSelectedEmployee(emp);
    setNewEmploymentType(emp.employmentStatus as any);
    setNewWorkingStatus(emp.workingStatus as any);
  };

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setEmployees(prev => prev.map(e => {
      if (e.empId === selectedEmployee.empId) {
        return {
          ...e,
          employmentStatus: newEmploymentType as any,
          workingStatus: newWorkingStatus as any,
          confirmationDate: newEmploymentType === "Permanent" ? confirmDate : undefined
        };
      }
      return e;
    }));

    alert(`Employment status manually updated for ${selectedEmployee.name}.`);
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">

          {/* Breadcrumb Header Title */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Personnel Info</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Approval Portal</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <UserCheck className="size-5.5 text-primary animate-pulse" />
                <span>Personnel Approval Portal</span>
              </h1>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/15 px-3 py-1.5 rounded-full select-none">
              HR Approvals & Type Conversions
            </span>
          </div>

          {/* Professional Corporate Tab Headers with counts */}
          <div className="flex border-b border-border/50 gap-8 select-none print:hidden">
            <button
              onClick={() => {
                setActiveTab("approval");
                setSearchQuery("");
                setFilterStatus("pending");
              }}
              className={`pb-4 text-xs font-black uppercase tracking-widest cursor-pointer relative transition duration-150 flex items-center gap-2.5 ${activeTab === "approval"
                  ? "text-primary font-black"
                  : "text-muted-foreground/70 hover:text-foreground font-extrabold"
                }`}
            >
              <UserCheck className="size-4" />
              <span>Employee Approval</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-all ${activeTab === "approval"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground/80"
                }`}>
                {stats.pendingApp}
              </span>
              {activeTab === "approval" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-200" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("status");
                setSearchQuery("");
                setFilterStatus("pending");
              }}
              className={`pb-4 text-xs font-black uppercase tracking-widest cursor-pointer relative transition duration-150 flex items-center gap-2.5 ${activeTab === "status"
                  ? "text-primary font-black"
                  : "text-muted-foreground/70 hover:text-foreground font-extrabold"
                }`}
            >
              <ArrowRightLeft className="size-4" />
              <span>Change Employment Status</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-all ${activeTab === "status"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground/80"
                }`}>
                {stats.pendingConversion}
              </span>
              {activeTab === "status" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-200" />
              )}
            </button>
          </div>

          {/* Tab 1 Content: Employee Approval List */}
          {activeTab === "approval" && (
            <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">

              {/* Header and Search & Status Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-[10.5px] font-black text-foreground uppercase tracking-widest block">
                    Awaiting Hires
                  </span>

                  {/* Status Toggle (Pending / Approved) */}
                  <div className="flex items-center gap-1 bg-muted/80 p-0.5 rounded-lg border border-border/40 select-none">
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "pending"
                          ? "bg-card text-primary shadow-xs border border-border/40"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Pending ({candidates.filter(c => c.status !== "Approved" && c.status !== "Rejected").length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("approved")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "approved"
                          ? "bg-card text-primary shadow-xs border border-border/40"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Approved ({candidates.filter(c => c.status === "Approved" || c.status === "Rejected").length})
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applicant name, role..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-border/50 rounded-xl">
                <table className="w-full border-collapse text-[11px] text-left">
                  <thead>
                    <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                      <th className="px-4 py-3 font-extrabold w-32 border-r border-border/30">Applicant ID</th>
                      <th className="px-4 py-3 font-extrabold w-48 border-r border-border/30">Candidate Name</th>
                      <th className="px-4 py-3 font-extrabold w-40 border-r border-border/30">Department</th>
                      <th className="px-4 py-3 font-extrabold w-40 border-r border-border/30">Proposed Job Title</th>
                      <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Joining Date</th>
                      <th className="px-4 py-3 font-extrabold text-right w-32 border-r border-border/30">Base Gross Salary</th>
                      <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Status</th>
                      <th className="px-4 py-3 font-extrabold text-center w-[250px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-sans text-xs">
                    {filteredCandidates.map((row) => (
                      <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75">
                        <td className="px-4 py-3 font-mono font-bold text-foreground/70 border-r border-border/20">{row.id}</td>
                        <td className="px-4 py-3 font-black text-foreground border-r border-border/20">{row.name}</td>
                        <td className="px-4 py-3 font-bold text-foreground/80 border-r border-border/20">{row.department}</td>
                        <td className="px-4 py-3 font-semibold text-muted-foreground border-r border-border/20">{row.jobTitle}</td>
                        <td className="px-4 py-3 font-mono text-center text-muted-foreground border-r border-border/20">{row.joiningDate}</td>
                        <td className="px-4 py-3 font-mono text-right font-black text-primary border-r border-border/20">
                          {row.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT
                        </td>
                        <td className="px-4 py-3 text-center border-r border-border/20">
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9px] ${row.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : row.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                : row.status === "Draft/Review"
                                  ? "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                  : "bg-blue-500/10 text-[#1e88e5] border border-[#1e88e5]/20 animate-pulse"
                            }`}>
                            <span>{row.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => setCandidateDetailsModal(row)}
                            className="h-7 px-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-primary/5"
                            title="View Credentials"
                          >
                            <Eye className="size-3" />
                            <span>Details</span>
                          </button>

                          {row.status !== "Approved" && row.status !== "Rejected" ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenApproveModal(row)}
                                className="h-7 px-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-emerald-500/5"
                              >
                                <Check className="size-3" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => setRejectCandidateModal(row)}
                                className="h-7 px-2.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-rose-500/5"
                              >
                                <X className="size-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : row.status === "Approved" ? (
                            <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Hired (ID: {row.approvedEmpId})
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20">
                              <XCircle className="size-3" /> Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredCandidates.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground font-semibold">
                          No candidates found matching filter constraints.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Tab 2 Content: Change Employment Status */}
          {activeTab === "status" && (
            <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">

              {/* Header and Search & Status Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-[10.5px] font-black text-foreground uppercase tracking-widest block">
                    Conversions
                  </span>

                  {/* Status Toggle (Pending / Approved) */}
                  <div className="flex items-center gap-1 bg-muted/80 p-0.5 rounded-lg border border-border/40 select-none">
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "pending"
                          ? "bg-card text-primary shadow-xs border border-border/40"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Pending ({employees.filter(e => e.conversionStatus === "Pending").length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("approved")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "approved"
                          ? "bg-card text-primary shadow-xs border border-border/40"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Approved ({employees.filter(e => e.conversionStatus === "Approved" || e.conversionStatus === "Rejected").length})
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee ID, name, role..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-border/50 rounded-xl">
                <table className="w-full border-collapse text-[11px] text-left">
                  <thead>
                    <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                      <th className="px-4 py-3 font-extrabold w-28 border-r border-border/30">Emp ID</th>
                      <th className="px-4 py-3 font-extrabold w-48 border-r border-border/30">Employee Name</th>
                      <th className="px-4 py-3 font-extrabold w-40 border-r border-border/30">Department</th>
                      <th className="px-4 py-3 font-extrabold w-40 border-r border-border/30">Job Title</th>
                      <th className="px-4 py-3 font-extrabold text-center w-32 border-r border-border/30">Current Type</th>
                      <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Confirmation Date</th>
                      <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Working Status</th>
                      <th className="px-4 py-3 font-extrabold text-center w-[250px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-sans text-xs">
                    {filteredEmployees.map((row) => (
                      <tr key={row.empId} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75">
                        <td className="px-4 py-3 font-mono font-bold text-foreground border-r border-border/20">{row.empId}</td>
                        <td className="px-4 py-3 font-black text-foreground border-r border-border/20">{row.name}</td>
                        <td className="px-4 py-3 font-bold text-foreground/80 border-r border-border/20">{row.department}</td>
                        <td className="px-4 py-3 font-semibold text-muted-foreground border-r border-border/20">{row.jobTitle}</td>
                        <td className="px-4 py-3 text-center border-r border-border/20">
                          <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded text-[9.5px] ${row.employmentStatus === "Permanent"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/25 font-extrabold animate-pulse"
                            }`}>
                            {row.employmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-center text-foreground/70 border-r border-border/20">
                          {row.confirmationDate || <span className="text-muted-foreground/40 italic">Awaiting</span>}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-border/20">
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9px] ${row.workingStatus === "Working"
                              ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15"
                              : "bg-rose-500/5 text-rose-500 border border-rose-500/15"
                            }`}>
                            <span>{row.workingStatus}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center flex items-center justify-center gap-2">

                          {row.conversionStatus === "Pending" ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenApproveConversion(row)}
                                className="h-7 px-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-emerald-500/5"
                                title="Approve Promotion to Permanent Status"
                              >
                                <Check className="size-3" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => setSelectedRejectEmp(row)}
                                className="h-7 px-2.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-rose-500/5"
                                title="Decline Conversion Request"
                              >
                                <X className="size-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : row.conversionStatus === "Approved" ? (
                            <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Confirmed Permanent
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20" title={`Reason: ${row.conversionNotes}`}>
                              <XCircle className="size-3" /> Conversion Declined
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenStatusModal(row)}
                            className="h-7 px-2 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/15 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-slate-500/5"
                            title="Admin Override Manual Status Changes"
                          >
                            <ArrowRightLeft className="size-3" />
                            <span>Edit</span>
                          </button>

                        </td>
                      </tr>
                    ))}

                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground font-semibold">
                          No records found matching filter constraints.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Tab 1 Modal: Candidate Details Verification */}
      {candidateDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setCandidateDetailsModal(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <FileText className="size-5 text-primary" />
              <span>Verify Applicant Credentials</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/30 font-semibold">
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Candidate Name</span>
                  <span className="text-xs font-black text-foreground">{candidateDetailsModal.name}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Applicant ID</span>
                  <span className="text-xs font-mono font-bold text-muted-foreground">{candidateDetailsModal.id}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Proposed Role</span>
                  <span className="text-xs font-bold text-foreground">{candidateDetailsModal.jobTitle}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Department</span>
                  <span className="text-xs font-bold text-foreground">{candidateDetailsModal.department}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Contact Phone</span>
                  <span className="text-xs font-bold text-foreground">{candidateDetailsModal.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Contact Email</span>
                  <span className="text-xs font-bold text-foreground">{candidateDetailsModal.email}</span>
                </div>
              </div>

              {candidateDetailsModal.rejectionReason && (
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-rose-500">
                  <span className="font-extrabold block text-[10px] uppercase">Rejection Reason</span>
                  <span className="font-semibold text-xs block mt-0.5">{candidateDetailsModal.rejectionReason}</span>
                </div>
              )}

              <div className="bg-[#1e88e5]/5 border border-[#1e88e5]/20 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase block">Appraised Base Salary</span>
                  <span className="text-sm font-black font-mono text-[#1e88e5]">
                    {candidateDetailsModal.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })} BDT
                  </span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Joining Date: {candidateDetailsModal.joiningDate}</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5">
                <button
                  onClick={() => setCandidateDetailsModal(null)}
                  className="h-9 px-5 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Verification OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1 Modal: Candidate Approval Form */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <UserCheck className="size-5 text-primary" />
              <span>Confirm Hiring & Employee ID</span>
            </h3>

            <form onSubmit={handleConfirmApproval} className="space-y-4 font-semibold">
              <div className="bg-muted/40 p-3 rounded-xl border border-border/40 space-y-1">
                <span className="text-[9.5px] font-black text-muted-foreground uppercase block">Verifying Candidate</span>
                <span className="text-xs font-black text-foreground">{selectedCandidate.name} — {selectedCandidate.jobTitle}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Assign System Employee ID *</label>
                <input
                  type="text"
                  required
                  value={generatedEmpId}
                  onChange={(e) => setGeneratedEmpId(e.target.value)}
                  placeholder="e.g. 2023043910"
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition"
                />
                <span className="text-[9.5px] text-muted-foreground block opacity-75 font-medium leading-tight">
                  Auto-populated based on corporate system registry structure. Specify exactly if needed.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Hiring Appointment Category</label>
                <select
                  value={joiningStatus}
                  onChange={(e) => setJoiningStatus(e.target.value as any)}
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none"
                >
                  <option value="Probation">Probationary Period</option>
                  <option value="Permanent">Permanent Status Activation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Confirm Hire & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 1 Modal: Candidate Rejection Dialog Form */}
      {rejectCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setRejectCandidateModal(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-rose-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <ShieldAlert className="size-5 text-rose-600" />
              <span>Decline Joining Application</span>
            </h3>

            <form onSubmit={handleConfirmRejectCandidate} className="space-y-4 font-semibold">
              <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/20 space-y-1 text-rose-700">
                <span className="text-[9.5px] font-black uppercase block text-rose-600">Applicant Details</span>
                <span className="text-xs font-black block">{rejectCandidateModal.name} — {rejectCandidateModal.jobTitle}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Specify Reason for Rejection *</label>
                <select
                  value={candidateRejectReason}
                  onChange={(e) => setCandidateRejectReason(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none"
                >
                  <option value="Documents Incomplete">Verification Documents Incomplete</option>
                  <option value="Failed Baseline Review">Failed Background / Reference checks</option>
                  <option value="Failed Screening Panel">Failed Final technical board reviews</option>
                  <option value="Budget Constraint">Budget / Allocation scale constraints</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setRejectCandidateModal(null)}
                  className="h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2 Modal: Approve Conversion Request to Permanent Type */}
      {selectedApproveEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setSelectedApproveEmp(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-emerald-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <Award className="size-5 text-emerald-600 animate-bounce" />
              <span>Confirm Status Conversion</span>
            </h3>

            <form onSubmit={handleConfirmConversion} className="space-y-4 font-semibold">
              <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-800 space-y-1">
                <span className="text-[9.5px] font-black uppercase block text-emerald-600">Promoting Employee</span>
                <span className="text-xs font-black block">{selectedApproveEmp.name} ({selectedApproveEmp.empId})</span>
                <span className="text-[10px] block font-bold leading-tight mt-0.5">
                  Proposed status: <span className="underline font-black">PERMANENT TYPE</span>
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Confirmation Effective Date *</label>
                <input
                  type="text"
                  required
                  value={confirmDate}
                  onChange={(e) => setConfirmDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition"
                />
                <span className="text-[9.5px] text-muted-foreground block opacity-75 font-medium leading-tight">
                  For Shapno, this confirms permanent status effective: 01/11/2023.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedApproveEmp(null)}
                  className="h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Confirm Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2 Modal: Decline Conversion Request to Permanent Type */}
      {selectedRejectEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setSelectedRejectEmp(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-rose-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <ShieldAlert className="size-5 text-rose-600" />
              <span>Decline Conversion Request</span>
            </h3>

            <form onSubmit={handleConfirmDeclineConversion} className="space-y-4 font-semibold">
              <div className="bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/20 text-rose-800 space-y-1">
                <span className="text-[9.5px] font-black uppercase block text-rose-600">Employee Details</span>
                <span className="text-xs font-black block">{selectedRejectEmp.name} ({selectedRejectEmp.empId})</span>
                <span className="text-[10px] block font-bold leading-tight mt-0.5">
                  Conversion category request to permanent type will be declined.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Decline Justification Notes *</label>
                <select
                  value={empStatusRejectReason}
                  onChange={(e) => setEmpStatusRejectReason(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none"
                >
                  <option value="Performance threshold unmet">KPI performance score criteria below threshold (75 points)</option>
                  <option value="Audit discrepancy">Internal HR compliance audit discrepancy pending resolution</option>
                  <option value="Probation period extended">Extend standard probationary period by 3 additional months</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedRejectEmp(null)}
                  className="h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2 Modal: Admin Override Manual Status Changer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <ArrowRightLeft className="size-5 text-[#1e88e5]" />
              <span>Admin Override Manual Status Changer</span>
            </h3>

            <form onSubmit={handleConfirmStatusChange} className="space-y-4 font-semibold">
              <div className="bg-muted/40 p-3.5 rounded-xl border border-border/40 space-y-1">
                <span className="text-[9.5px] font-black text-[#1e88e5] uppercase block">Selected Employee Info</span>
                <span className="text-xs font-black text-foreground block">{selectedEmployee.name} ({selectedEmployee.empId})</span>
                <span className="text-[10px] text-muted-foreground block font-bold leading-tight mt-0.5">
                  {selectedEmployee.jobTitle} — {selectedEmployee.department}
                </span>
              </div>

              {/* Status Change inputs */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Employment Status Type *</label>
                <select
                  value={newEmploymentType}
                  onChange={(e) => setNewEmploymentType(e.target.value as any)}
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none"
                >
                  <option value="Probation">Probationary</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              {newEmploymentType === "Permanent" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Employment Confirmation Date *</label>
                  <input
                    type="text"
                    required
                    value={confirmDate}
                    onChange={(e) => setConfirmDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Working Status</label>
                <select
                  value={newWorkingStatus}
                  onChange={(e) => setNewWorkingStatus(e.target.value as any)}
                  className="w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none"
                >
                  <option value="Working">Working / Active Duty</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Resigned">Resigned</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans">
                <button
                  type="button"
                  onClick={() => setSelectedEmployee(null)}
                  className="h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9.5 px-6 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg transition uppercase tracking-wider shadow-sm"
                >
                  Save Override Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
