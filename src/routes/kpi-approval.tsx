import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Clock,
  ArrowLeft,
  History,
  TrendingUp,
  X,
  FileText,
  ShieldCheck,
  Building,
  UserCheck,
  Check,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/kpi-approval")({
  head: () => ({
    meta: [
      { title: "KPI Approval — CRIPTON HRIS" },
      {
        name: "description",
        content: "HRD Final Evaluation & Multi-Layer Approval workflow dashboard.",
      },
    ],
  }),
  component: KpiApprovalPage,
});

export interface CriteriaItem {
  id: string;
  name: string;
  hodPoint: string;
  hodNote: string;
  hrPoint: string;
  hrNote: string;
}

export type ApprovalStage = "HRD" | "PlantHead" | "MD" | "Completed";

export interface KpiApprovalRecord {
  empId: string;
  name: string;
  company: string;
  location: string;
  designation: string;
  department: string;
  joiningDate: string;
  existingGross: number;
  incAmount: number;
  newGross: number;
  effectYear: string;
  effectMonth: string;
  givePromotion: string;
  notes: string;
  photoUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  currentStage: ApprovalStage;
  hodIncAmount: number;
  hodNewSalary: number;
  hodPromotion: string;
  hodDesignation: string;
  hodFeedback: string;
  hodStartEndDate: string;
  hrIncAmount: number;
  hrNewSalary: number;
  hrPromotion: string;
  hrDesignation: string;
  hrFeedback: string;
  hrStartEndDate: string;
  plantHeadNotes?: string;
  mdNotes?: string;
  criteria: CriteriaItem[];
}

const defaultApprovalList: KpiApprovalRecord[] = [
  {
    empId: "2022120145",
    name: "Khairul Bashar Masum",
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    designation: "Asst. Manager",
    department: "HR Team",
    joiningDate: "01/12/2022",
    existingGross: 46500.0,
    incAmount: 1000.0,
    newGross: 46500.0,
    effectYear: "2026",
    effectMonth: "Jan",
    givePromotion: "Incremented",
    notes: "",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg",
    status: "Pending",
    currentStage: "HRD",
    hodIncAmount: 4500.0,
    hodNewSalary: 50000.0,
    hodPromotion: "Incremented",
    hodDesignation: "-",
    hodFeedback: "-",
    hodStartEndDate: "-",
    hrIncAmount: 1000.0,
    hrNewSalary: 46500.0,
    hrPromotion: "Incremented",
    hrDesignation: "-",
    hrFeedback: "-",
    hrStartEndDate: "-",
    criteria: [
      { id: "c1", name: "Dependability", hodPoint: "3.00", hodNote: "", hrPoint: "2.00", hrNote: "" },
      { id: "c2", name: "Loyalty of company", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c3", name: "Independent Action", hodPoint: "2.00", hodNote: "", hrPoint: "2.00", hrNote: "" },
      { id: "c4", name: "Decision Making/ Problem Solving", hodPoint: "2.00", hodNote: "", hrPoint: "2.00", hrNote: "" },
      { id: "c5", name: "Knowledge of law & SOP", hodPoint: "3.00", hodNote: "", hrPoint: "1.00", hrNote: "" },
      { id: "c6", name: "Teamwork", hodPoint: "3.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c7", name: "Verbal & Written Communication", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c8", name: "Leadership", hodPoint: "3.00", hodNote: "", hrPoint: "2.00", hrNote: "" },
    ],
  },
  {
    empId: "2024053060",
    name: "Md. Mahfujul Haque",
    company: "Pakiza Software Limited",
    location: "PSL-Core Dev",
    designation: "Manager",
    department: "Software Development",
    joiningDate: "10/12/2024",
    existingGross: 88000.0,
    incAmount: 8000.0,
    newGross: 96000.0,
    effectYear: "2026",
    effectMonth: "Jan",
    givePromotion: "Promoted",
    notes: "High contribution to core architecture",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg",
    status: "Pending",
    currentStage: "PlantHead",
    hodIncAmount: 8000.0,
    hodNewSalary: 96000.0,
    hodPromotion: "Promoted",
    hodDesignation: "Sr. Manager",
    hodFeedback: "Exceptional leadership",
    hodStartEndDate: "-",
    hrIncAmount: 8000.0,
    hrNewSalary: 96000.0,
    hrPromotion: "Promoted",
    hrDesignation: "Sr. Manager",
    hrFeedback: "Approved by HR head",
    hrStartEndDate: "-",
    criteria: [
      { id: "c1", name: "Dependability", hodPoint: "4.00", hodNote: "Very reliable", hrPoint: "4.00", hrNote: "" },
      { id: "c2", name: "Loyalty of company", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c3", name: "Independent Action", hodPoint: "4.00", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c4", name: "Decision Making/ Problem Solving", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c5", name: "Knowledge of law & SOP", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c6", name: "Teamwork", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c7", name: "Verbal & Written Communication", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c8", name: "Leadership", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
    ],
  },
  {
    empId: "2024053062",
    name: "Mohammad Mayhedi Hasan",
    company: "Pakiza Software Limited",
    location: "PSL-Core Dev",
    designation: "Deputy Manager",
    department: "Software Development",
    joiningDate: "10/12/2024",
    existingGross: 74000.0,
    incAmount: 4000.0,
    newGross: 78000.0,
    effectYear: "2026",
    effectMonth: "Jan",
    givePromotion: "Incremented",
    notes: "",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg",
    status: "Pending",
    currentStage: "MD",
    hodIncAmount: 5000.0,
    hodNewSalary: 79000.0,
    hodPromotion: "Incremented",
    hodDesignation: "-",
    hodFeedback: "Good progress",
    hodStartEndDate: "-",
    hrIncAmount: 4000.0,
    hrNewSalary: 78000.0,
    hrPromotion: "Incremented",
    hrDesignation: "-",
    hrFeedback: "-",
    hrStartEndDate: "-",
    criteria: [
      { id: "c1", name: "Dependability", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c2", name: "Loyalty of company", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c3", name: "Independent Action", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
      { id: "c4", name: "Decision Making/ Problem Solving", hodPoint: "3.50", hodNote: "", hrPoint: "3.00", hrNote: "" },
      { id: "c5", name: "Knowledge of law & SOP", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
      { id: "c6", name: "Teamwork", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c7", name: "Verbal & Written Communication", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c8", name: "Leadership", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
    ],
  },
  {
    empId: "2025053673",
    name: "Md Jahid Hasan Polok",
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    designation: "Sr. Executive",
    department: "HR Team",
    joiningDate: "20/01/2025",
    existingGross: 46000.0,
    incAmount: 3000.0,
    newGross: 49000.0,
    effectYear: "2026",
    effectMonth: "Jan",
    givePromotion: "Incremented",
    notes: "",
    photoUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg",
    status: "Pending",
    currentStage: "HRD",
    hodIncAmount: 4000.0,
    hodNewSalary: 50000.0,
    hodPromotion: "Incremented",
    hodDesignation: "-",
    hodFeedback: "Punctual & diligent",
    hodStartEndDate: "-",
    hrIncAmount: 3000.0,
    hrNewSalary: 49000.0,
    hrPromotion: "Incremented",
    hrDesignation: "-",
    hrFeedback: "-",
    hrStartEndDate: "-",
    criteria: [
      { id: "c1", name: "Dependability", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c2", name: "Loyalty of company", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c3", name: "Independent Action", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
      { id: "c4", name: "Decision Making/ Problem Solving", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
      { id: "c5", name: "Knowledge of law & SOP", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c6", name: "Teamwork", hodPoint: "4.00", hodNote: "", hrPoint: "4.00", hrNote: "" },
      { id: "c7", name: "Verbal & Written Communication", hodPoint: "3.50", hodNote: "", hrPoint: "3.50", hrNote: "" },
      { id: "c8", name: "Leadership", hodPoint: "3.00", hodNote: "", hrPoint: "3.00", hrNote: "" },
    ],
  },
];

function KpiApprovalPage() {
  const [records, setRecords] = useState<KpiApprovalRecord[]>(defaultApprovalList);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Active record for evaluation detail view
  const activeRecord = useMemo(() => {
    return records.find((r) => r.empId === selectedEmpId) || null;
  }, [records, selectedEmpId]);

  // Form states for currently evaluated record
  const [formState, setFormState] = useState<KpiApprovalRecord | null>(null);

  // Active simulation role for evaluation view ("HRD" | "PlantHead" | "MD")
  const [activeRole, setActiveRole] = useState<ApprovalStage>("HRD");

  const handleSelectRecord = (record: KpiApprovalRecord) => {
    setSelectedEmpId(record.empId);
    setFormState(JSON.parse(JSON.stringify(record)));
    setActiveRole(record.currentStage === "Completed" ? "MD" : record.currentStage);
  };

  const handleFormChange = (field: keyof KpiApprovalRecord, value: any) => {
    if (!formState) return;
    setFormState((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      if (field === "incAmount" || field === "existingGross") {
        const gross = Number(field === "existingGross" ? value : prev.existingGross) || 0;
        updated.newGross = gross;
      }
      return updated;
    });
  };

  const handleCriteriaChange = (criteriaId: string, field: "hrPoint" | "hrNote", val: string) => {
    if (!formState || activeRole !== "HRD") return; // View only for PlantHead or MD!
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        criteria: prev.criteria.map((c) => (c.id === criteriaId ? { ...c, [field]: val } : c)),
      };
    });
  };

  const handleApprove = () => {
    if (!formState) return;

    let nextStage: ApprovalStage = formState.currentStage;
    let nextStatus: "Pending" | "Approved" | "Rejected" = "Pending";
    let message = "";

    if (activeRole === "HRD") {
      nextStage = "PlantHead";
      message = `HRD Evaluation for ${formState.name} approved & passed to Plant Head!`;
    } else if (activeRole === "PlantHead") {
      nextStage = "MD";
      message = `Plant Head approval recorded for ${formState.name} & forwarded to MD!`;
    } else if (activeRole === "MD") {
      nextStage = "Completed";
      nextStatus = "Approved";
      message = `Final MD Approval completed for ${formState.name}! Increment finalized.`;
    }

    const updatedRecord: KpiApprovalRecord = {
      ...formState,
      currentStage: nextStage,
      status: nextStatus,
    };

    setRecords((prev) => prev.map((r) => (r.empId === formState.empId ? updatedRecord : r)));
    toast.success(message);
    setSelectedEmpId(null);
  };

  const handleReject = () => {
    if (!formState) return;
    setRecords((prev) =>
      prev.map((r) => (r.empId === formState.empId ? { ...formState, status: "Rejected" } : r))
    );
    toast.error(`KPI Evaluation for ${formState.name} rejected by ${activeRole}.`);
    setSelectedEmpId(null);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (stageFilter !== "ALL" && r.currentStage !== stageFilter) return false;
      if (departmentFilter !== "ALL" && r.department !== departmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, statusFilter, stageFilter, departmentFilter, searchQuery]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight size={13} />
                <span>Approvals</span>
                <ChevronRight size={13} />
                <span>HR Approvals</span>
                <ChevronRight size={13} />
                <span className="font-medium text-slate-800">KPI Approval</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-600" />
                KPI Approval & Multi-Layer Evaluation Workflow
              </h1>
            </div>

            {selectedEmpId && (
              <button
                onClick={() => setSelectedEmpId(null)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
              >
                <ArrowLeft size={15} />
                Back to Pending List
              </button>
            )}
          </div>

          {!selectedEmpId ? (
            /* ─────────────────────────────────────────────────────────────
               LIST VIEW OF PENDING APPROVALS
            ───────────────────────────────────────────────────────────── */
            <div className="space-y-5">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending HRD</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {records.filter((r) => r.currentStage === "HRD" && r.status === "Pending").length}
                    </p>
                  </div>
                  <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                    <Clock size={22} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Plant Head</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {records.filter((r) => r.currentStage === "PlantHead").length}
                    </p>
                  </div>
                  <div className="size-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                    <Building size={22} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending MD Approval</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {records.filter((r) => r.currentStage === "MD").length}
                    </p>
                  </div>
                  <div className="size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <ShieldCheck size={22} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Approved</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {records.filter((r) => r.status === "Approved").length}
                    </p>
                  </div>
                  <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 size={22} />
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Employee Name, ID, Department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div className="w-40">
                    <SearchableSelect
                      options={[
                        { value: "ALL", label: "Stage: All Stages" },
                        { value: "HRD", label: "Stage: HRD Evaluation" },
                        { value: "PlantHead", label: "Stage: Plant Head" },
                        { value: "MD", label: "Stage: MD Approval" },
                        { value: "Completed", label: "Stage: Completed" },
                      ]}
                      value={stageFilter}
                      onChange={setStageFilter}
                      placeholder="Filter Stage"
                    />
                  </div>

                  <div className="w-40">
                    <SearchableSelect
                      options={[
                        { value: "Pending", label: "Status: Pending" },
                        { value: "Approved", label: "Status: Approved" },
                        { value: "Rejected", label: "Status: Rejected" },
                        { value: "ALL", label: "Status: All" },
                      ]}
                      value={statusFilter}
                      onChange={setStatusFilter}
                      placeholder="Filter Status"
                    />
                  </div>

                  <div className="w-48">
                    <SearchableSelect
                      options={[
                        { value: "ALL", label: "Dept: All Departments" },
                        { value: "HR Team", label: "HR Team" },
                        { value: "Software Development", label: "Software Development" },
                      ]}
                      value={departmentFilter}
                      onChange={setDepartmentFilter}
                      placeholder="Filter Department"
                    />
                  </div>
                </div>
              </div>

              {/* Pending Approvals Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <FileText size={16} className="text-emerald-600" />
                    Pending KPI Approval Requests ({filteredRecords.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                        <th className="py-3 px-4">SL</th>
                        <th className="py-3 px-4">Employee Info</th>
                        <th className="py-3 px-4">Current Gross</th>
                        <th className="py-3 px-4">HOD Rec. Inc</th>
                        <th className="py-3 px-4">Proposed Inc</th>
                        <th className="py-3 px-4">Approval Stage</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            No matching pending KPI approval records found.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((item, idx) => (
                          <tr key={item.empId} className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.photoUrl}
                                  alt={item.name}
                                  className="size-9 rounded-full object-cover border border-slate-300 shadow-xs shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                                  <p className="text-[11px] text-slate-500 font-mono">
                                    ID: {item.empId} • {item.designation} ({item.department})
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                              ৳{item.existingGross.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                              ৳{item.hodIncAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-blue-700 font-semibold">
                              ৳{item.incAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4">
                              {item.currentStage === "HRD" && (
                                <Badge className="bg-amber-50 text-amber-800 border-amber-300 font-semibold text-[10px]">
                                  Stage 1: HRD Evaluation
                                </Badge>
                              )}
                              {item.currentStage === "PlantHead" && (
                                <Badge className="bg-purple-50 text-purple-800 border-purple-300 font-semibold text-[10px]">
                                  Stage 2: Plant Head
                                </Badge>
                              )}
                              {item.currentStage === "MD" && (
                                <Badge className="bg-blue-50 text-blue-800 border-blue-300 font-semibold text-[10px]">
                                  Stage 3: MD Final Approval
                                </Badge>
                              )}
                              {item.currentStage === "Completed" && (
                                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold text-[10px]">
                                  Finalized
                                </Badge>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {item.status === "Pending" && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-semibold text-[10px]">
                                  Pending
                                </Badge>
                              )}
                              {item.status === "Approved" && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold text-[10px]">
                                  Approved
                                </Badge>
                              )}
                              {item.status === "Rejected" && (
                                <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-semibold text-[10px]">
                                  Rejected
                                </Badge>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleSelectRecord(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-xs"
                              >
                                <Eye size={14} />
                                Evaluate / View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               SCREENSHOT EVALUATION VIEW WITH MULTI-LAYER APPROVAL LOGIC
            ───────────────────────────────────────────────────────────── */
            formState && (
              <div className="space-y-4">
                {/* Stage Progress Stepper Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approval Layer:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveRole("HRD")}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          activeRole === "HRD"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        1. HRD Evaluation
                      </button>
                      <ChevronRight size={14} className="text-slate-400" />
                      <button
                        onClick={() => setActiveRole("PlantHead")}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          activeRole === "PlantHead"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        2. Plant Head Approval
                      </button>
                      <ChevronRight size={14} className="text-slate-400" />
                      <button
                        onClick={() => setActiveRole("MD")}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          activeRole === "MD"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        3. MD Final Approval
                      </button>
                    </div>
                  </div>

                  {activeRole !== "HRD" && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold">
                      <Lock size={13} className="text-purple-600" />
                      <span>{activeRole === "PlantHead" ? "Plant Head" : "MD"} Mode: Only Top Form is editable; rest is View-Only.</span>
                    </div>
                  )}
                </div>

                {/* Top Title Banner */}
                <div className="bg-white p-4 rounded-t-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-800">
                    {activeRole === "HRD" && `HRD Final Evaluation For - ${formState.name}`}
                    {activeRole === "PlantHead" && `Plant Head Evaluation & Approval For - ${formState.name}`}
                    {activeRole === "MD" && `Managing Director (MD) Final Approval For - ${formState.name}`}
                  </h2>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs rounded shadow-xs transition-colors"
                  >
                    View Increment History
                  </button>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                   FORM CONTROLS BAR (THIS PART IS ALWAYS ACTIVE / EDITABLE FOR HRD, PLANT HEAD & MD!)
                ───────────────────────────────────────────────────────────── */}
                <div className="bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Existing Gross */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Existing Gross
                      </label>
                      <input
                        type="text"
                        value={formState.existingGross.toFixed(2)}
                        onChange={(e) =>
                          handleFormChange("existingGross", parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Notes</span>
                    </div>

                    {/* Inc Amount * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Inc Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.incAmount.toFixed(2)}
                        onChange={(e) =>
                          handleFormChange("incAmount", parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* New Gross */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        New Gross
                      </label>
                      <input
                        type="text"
                        value={formState.newGross.toFixed(2)}
                        onChange={(e) =>
                          handleFormChange("newGross", parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Effect Year * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Effect Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formState.effectYear}
                        onChange={(e) => handleFormChange("effectYear", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    {/* Effect Month * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Effect Month <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formState.effectMonth}
                        onChange={(e) => handleFormChange("effectMonth", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        <option value="Jan">Jan</option>
                        <option value="Feb">Feb</option>
                        <option value="Mar">Mar</option>
                        <option value="Apr">Apr</option>
                        <option value="May">May</option>
                        <option value="Jun">Jun</option>
                        <option value="Jul">Jul</option>
                        <option value="Aug">Aug</option>
                        <option value="Sep">Sep</option>
                        <option value="Oct">Oct</option>
                        <option value="Nov">Nov</option>
                        <option value="Dec">Dec</option>
                      </select>
                    </div>

                    {/* Give Promotion * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Give Promotion <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formState.givePromotion}
                        onChange={(e) => handleFormChange("givePromotion", e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        <option value="Incremented">Incremented</option>
                        <option value="Promoted">Promoted</option>
                        <option value="No Change">No Change</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & Approve/Reject Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[200px] max-w-xl">
                      <input
                        type="text"
                        placeholder={`Add ${activeRole} notes...`}
                        value={formState.notes}
                        onChange={(e) => handleFormChange("notes", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleApprove}
                        className="px-6 py-2 bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-bold text-xs uppercase tracking-wide rounded shadow-xs transition-colors"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={handleReject}
                        className="px-6 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-wide rounded shadow-xs transition-colors"
                      >
                        REJECT
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                   TWO COLUMN CONTENT:
                   WHEN activeRole === "PlantHead" OR "MD", REST IS VIEW-ONLY!
                ───────────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN (HOD Assessment & Evaluation Tables) */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* HOD Assessment Card */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#3b82f6]">HOD Assesment</h3>
                        {activeRole !== "HRD" && (
                          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            View Only
                          </span>
                        )}
                      </div>

                      {/* Criteria Table with Light Pink Header */}
                      <div className="overflow-x-auto border border-slate-200 rounded-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#fce7f3] text-slate-700 border-b border-slate-300 font-semibold">
                              <th className="py-2.5 px-3">Criteria Name</th>
                              <th className="py-2.5 px-3 w-24">Point(HOD)</th>
                              <th className="py-2.5 px-3">Note(HOD)</th>
                              <th className="py-2.5 px-3 w-24">Point(HR)</th>
                              <th className="py-2.5 px-3">Note(HR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700">
                            {formState.criteria.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                                <td className="py-2.5 px-3 font-mono">{item.hodPoint}</td>
                                <td className="py-2.5 px-3 text-slate-500">{item.hodNote}</td>
                                <td className="py-2.5 px-3 font-mono">
                                  {activeRole === "HRD" ? (
                                    <input
                                      type="text"
                                      value={item.hrPoint}
                                      onChange={(e) => handleCriteriaChange(item.id, "hrPoint", e.target.value)}
                                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded font-mono text-xs focus:border-blue-500 outline-none"
                                    />
                                  ) : (
                                    <span className="font-semibold text-slate-800">{item.hrPoint}</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500">
                                  {activeRole === "HRD" ? (
                                    <input
                                      type="text"
                                      value={item.hrNote}
                                      placeholder="Note"
                                      onChange={(e) => handleCriteriaChange(item.id, "hrNote", e.target.value)}
                                      className="w-full px-1.5 py-0.5 border border-slate-300 rounded text-xs focus:border-blue-500 outline-none"
                                    />
                                  ) : (
                                    <span>{item.hrNote || "-"}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* HOD Evaluation Section (View Only) */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#84cc16]">HOD Evaluation</h3>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          View Only
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Inc. Amounnt</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {formState.hodIncAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">New Salary</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {formState.hodNewSalary.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Promotion</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-semibold text-slate-800">{formState.hodPromotion}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Designation</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hodDesignation}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Feedback</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hodFeedback}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Promotion Start-End Date</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hodStartEndDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* HR Evaluation Section (View Only when Plant Head / MD) */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#84cc16]">HR Evaluation</h3>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          View Only
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Inc. Amounnt</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {formState.hrIncAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">New Salary</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {formState.hrNewSalary.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Promotion</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-semibold text-slate-800">{formState.hrPromotion}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Designation</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hrDesignation}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Feedback</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hrFeedback}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-48 font-medium text-slate-700">Promotion Start-End Date</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-600">{formState.hrStartEndDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (Employee Info Sidebar Card - View Only) */}
                  <div className="lg:col-span-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h3 className="text-sm font-semibold text-[#84cc16]">Employee Info</h3>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          View Only
                        </span>
                      </div>

                      <div className="flex items-start gap-4 text-xs">
                        <span className="w-16 font-medium text-slate-700">Photo</span>
                        <span className="font-bold text-slate-400">:</span>
                        <div className="flex-1">
                          <img
                            src={formState.photoUrl}
                            alt={formState.name}
                            className="w-44 h-52 object-cover rounded border border-slate-200 shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Company</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-medium text-slate-800">{formState.company}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Location</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-800">{formState.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Name</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-bold text-slate-900">{formState.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Designation</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-800">{formState.designation}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Department</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="text-slate-800">{formState.department}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Joining</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono text-slate-800">{formState.joiningDate}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 font-medium text-slate-700">Salary</span>
                          <span className="w-4 text-center font-bold text-slate-400">:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {formState.existingGross.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Increment History Modal */}
          {showHistoryModal && formState && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <History className="size-4 text-blue-600" />
                    Salary & Increment History — {formState.name} ({formState.empId})
                  </h3>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs">
                    <div>
                      <span className="text-slate-500 block">Joining Date</span>
                      <span className="font-bold text-slate-800">{formState.joiningDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Joining Gross</span>
                      <span className="font-bold text-slate-800">৳38,000.00</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Current Gross</span>
                      <span className="font-bold text-emerald-700">৳{formState.existingGross.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                          <th className="py-2.5 px-3">Effective Date</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Old Gross</th>
                          <th className="py-2.5 px-3">Inc Amount</th>
                          <th className="py-2.5 px-3">New Gross</th>
                          <th className="py-2.5 px-3">Promoted To</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        <tr>
                          <td className="py-2.5 px-3 font-mono">01/01/2025</td>
                          <td className="py-2.5 px-3 font-medium text-emerald-600">Annual Increment</td>
                          <td className="py-2.5 px-3 font-mono">৳42,000.00</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">+৳4,500.00</td>
                          <td className="py-2.5 px-3 font-mono font-bold">৳46,500.00</td>
                          <td className="py-2.5 px-3 text-slate-500">Asst. Manager</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono">01/01/2024</td>
                          <td className="py-2.5 px-3 font-medium text-blue-600">Performance Increment</td>
                          <td className="py-2.5 px-3 font-mono">৳38,000.00</td>
                          <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">+৳4,000.00</td>
                          <td className="py-2.5 px-3 font-mono font-bold">৳42,000.00</td>
                          <td className="py-2.5 px-3 text-slate-500">Sr. Officer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    to="/increment-history"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Open Full History Register →
                  </Link>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
