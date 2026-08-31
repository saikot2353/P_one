import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Clock,
  Search,
  Check,
  X,
  Layers,
  UserCheck,
  Calendar,
  Users,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/pending-approvals")({
  head: () => ({
    meta: [
      { title: "All Pending Approval List — Requisition Tracker | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "View all pending requisitions and track their current stage and pending approver.",
      },
    ],
  }),
  component: PendingApprovalsPage,
});

export interface ApprovalStep {
  stepNumber: number;
  roleName: string;
  approverName: string;
  approverDesignation: string;
  status: "APPROVED" | "PENDING" | "WAITING";
  actionDate?: string;
  comments?: string;
}

export interface PendingRequisitionItem {
  id: string;
  title: string;
  category: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  submissionDate: string;
  summaryDetails: string;
  currentStage: number; // e.g., 2
  totalStages: number; // e.g., 3 -> "2/3"
  pendingApprover: {
    name: string;
    designation: string;
    department: string;
  };
  steps: ApprovalStep[];
}

const mockRequisitionsList: PendingRequisitionItem[] = [
  {
    id: "REQ-LV-2026-0892",
    category: "Leave",
    title: "Annual Leave Application (5 Days)",
    employeeName: "Md. Sadmanur Islam Shishir",
    employeeId: "2024051510",
    department: "Business Innovation",
    designation: "Jr. Executive",
    submissionDate: "2026-08-28",
    summaryDetails: "Family emergency leave requirement for medical treatment.",
    currentStage: 2,
    totalStages: 3,
    pendingApprover: {
      name: "Jahangir Alam",
      designation: "Head of HR & Admin",
      department: "Human Resources",
    },
    steps: [
      {
        stepNumber: 1,
        roleName: "Department Head (HOD)",
        approverName: "Md. Anik Islam",
        approverDesignation: "Deputy Manager (BI)",
        status: "APPROVED",
        actionDate: "2026-08-28 02:15 PM",
        comments: "Recommended for approval.",
      },
      {
        stepNumber: 2,
        roleName: "Head of HR",
        approverName: "Jahangir Alam",
        approverDesignation: "Head of HR & Admin",
        status: "PENDING",
      },
      {
        stepNumber: 3,
        roleName: "Managing Director",
        approverName: "Pakiza Board Director",
        approverDesignation: "Director",
        status: "WAITING",
      },
    ],
  },
  {
    id: "REQ-MP-2026-014",
    category: "Manpower Budget",
    title: "Senior Full Stack Engineer Requisition",
    employeeName: "Al Riyad Karim",
    employeeId: "2025053125",
    department: "Software Engineering",
    designation: "Sr. Executive",
    submissionDate: "2026-08-25",
    summaryDetails: "Replacement position for web platform expansion. Approved in Q3 budget.",
    currentStage: 3,
    totalStages: 5,
    pendingApprover: {
      name: "Sayed Ahmed",
      designation: "Chief Financial Officer (CFO)",
      department: "Finance & Accounts",
    },
    steps: [
      {
        stepNumber: 1,
        roleName: "Section Lead",
        approverName: "Md. Sadmanur Islam Shishir",
        approverDesignation: "Tech Lead",
        status: "APPROVED",
        actionDate: "2026-08-25 11:00 AM",
      },
      {
        stepNumber: 2,
        roleName: "Department Head (HOD)",
        approverName: "Md. Abdur Rahaman",
        approverDesignation: "Executive HOD",
        status: "APPROVED",
        actionDate: "2026-08-26 10:30 AM",
      },
      {
        stepNumber: 3,
        roleName: "Chief Financial Officer (CFO)",
        approverName: "Sayed Ahmed",
        approverDesignation: "Chief Financial Officer (CFO)",
        status: "PENDING",
      },
      {
        stepNumber: 4,
        roleName: "HR Director",
        approverName: "Jahangir Alam",
        approverDesignation: "Head of HR",
        status: "WAITING",
      },
      {
        stepNumber: 5,
        roleName: "Managing Director",
        approverName: "Board Director",
        approverDesignation: "Managing Director",
        status: "WAITING",
      },
    ],
  },
  {
    id: "REQ-OT-2026-0412",
    category: "Overtime",
    title: "Weekend Production Overtime Batch (12 Staff)",
    employeeName: "Md. Piyash Hasan",
    employeeId: "2026059573",
    department: "Factory Operations",
    designation: "Executive",
    submissionDate: "2026-08-29",
    summaryDetails: "Weekend overtime authorization for shipment deadline dispatch.",
    currentStage: 1,
    totalStages: 2,
    pendingApprover: {
      name: "Md. Abdur Rahaman",
      designation: "Factory Manager (HOD)",
      department: "Factory Operations",
    },
    steps: [
      {
        stepNumber: 1,
        roleName: "Department Head (HOD)",
        approverName: "Md. Abdur Rahaman",
        approverDesignation: "Factory Manager (HOD)",
        status: "PENDING",
      },
      {
        stepNumber: 2,
        roleName: "HR Compliance Manager",
        approverName: "Jahangir Alam",
        approverDesignation: "Head of HR & Admin",
        status: "WAITING",
      },
    ],
  },
  {
    id: "REQ-ADV-2026-0098",
    category: "Advance & Loan",
    title: "Festival Advance Salary Application",
    employeeName: "Md. Anik Islam",
    employeeId: "2023044078",
    department: "Business Innovation",
    designation: "Deputy Manager",
    submissionDate: "2026-08-27",
    summaryDetails: "Advance salary against September 2026 payroll for festival expenses.",
    currentStage: 2,
    totalStages: 4,
    pendingApprover: {
      name: "Jahangir Alam",
      designation: "Head of HR & Admin",
      department: "Human Resources",
    },
    steps: [
      {
        stepNumber: 1,
        roleName: "Supervisor / Line Manager",
        approverName: "Md. Abdur Rahaman",
        approverDesignation: "Executive HOD",
        status: "APPROVED",
        actionDate: "2026-08-27 05:00 PM",
      },
      {
        stepNumber: 2,
        roleName: "Payroll & HR Manager",
        approverName: "Jahangir Alam",
        approverDesignation: "Head of HR & Admin",
        status: "PENDING",
      },
      {
        stepNumber: 3,
        roleName: "Internal Audit",
        approverName: "Audit Officer",
        approverDesignation: "Sr. Auditor",
        status: "WAITING",
      },
      {
        stepNumber: 4,
        roleName: "Accounts Disbursement",
        approverName: "Finance Team",
        approverDesignation: "Sr. Accountant",
        status: "WAITING",
      },
    ],
  },
  {
    id: "REQ-EQ-2026-0034",
    category: "Equipment",
    title: "MacBook Pro M3 Hardware Requisition",
    employeeName: "Al Riyad Karim",
    employeeId: "2025053125",
    department: "Business Innovation",
    designation: "Sr. Executive",
    submissionDate: "2026-08-24",
    summaryDetails: "Development machine upgrade required for mobile app builds.",
    currentStage: 3,
    totalStages: 3,
    pendingApprover: {
      name: "Sayed Ahmed",
      designation: "Chief Financial Officer (CFO)",
      department: "Finance & Accounts",
    },
    steps: [
      {
        stepNumber: 1,
        roleName: "IT Manager",
        approverName: "Md. Sadmanur Islam Shishir",
        approverDesignation: "IT Lead",
        status: "APPROVED",
        actionDate: "2026-08-24 03:20 PM",
      },
      {
        stepNumber: 2,
        roleName: "HR Manager",
        approverName: "Jahangir Alam",
        approverDesignation: "Head of HR & Admin",
        status: "APPROVED",
        actionDate: "2026-08-25 09:10 AM",
      },
      {
        stepNumber: 3,
        roleName: "CFO Approval",
        approverName: "Sayed Ahmed",
        approverDesignation: "Chief Financial Officer (CFO)",
        status: "PENDING",
      },
    ],
  },
];

function PendingApprovalsPage() {
  const [requisitions] = useState<PendingRequisitionItem[]>(mockRequisitionsList);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReqModal, setSelectedReqModal] = useState<PendingRequisitionItem | null>(null);

  const filteredItems = useMemo(() => {
    return requisitions.filter((item) => {
      const matchCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeId.includes(q) ||
        item.pendingApprover.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [requisitions, selectedCategory, searchTerm]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Approvals</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              All Pending Approval List
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            {filteredItems.length} Requisitions Pending
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Header Title */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              All Pending Approval List
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track all pending requisitions, their current approval stage, and who is currently assigned.
            </p>
          </div>

          {/* Simple Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-slate-500 font-medium">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-medium text-xs outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="ALL">All Requisitions</option>
                  <option value="Leave">Leave</option>
                  <option value="Manpower Budget">Manpower Budget</option>
                  <option value="Overtime">Overtime</option>
                  <option value="Allowance">Allowance</option>
                  <option value="Advance & Loan">Advance &amp; Loan</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search title, employee, approver..."
                  className="h-8 pl-8 pr-2.5 w-64 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:border-blue-500 transition-colors"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            <div className="text-slate-400 font-medium text-[11px]">
              Showing {filteredItems.length} items
            </div>
          </div>

          {/* CLEAN MINIMAL REQUISITIONS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200/80 dark:border-slate-700">
                    <th className="py-3 px-4">Requisition</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4 text-center">Stage</th>
                    <th className="py-3 px-4">Pending To</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        No pending requisitions found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-medium border border-blue-100">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.id} • {item.submissionDate}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                            {item.employeeName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.designation} ({item.department})
                          </div>
                        </td>

                        {/* STAGE BADGE (e.g., Stage 2/3, Stage 3/5) */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 inline-block">
                            Stage {item.currentStage}/{item.totalStages}
                          </span>
                        </td>

                        {/* PENDING TO */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-amber-800 dark:text-amber-300 text-xs">
                            {item.pendingApprover.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.pendingApprover.designation}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReqModal(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          >
                            View Details
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
      </div>

      {/* APPROVAL DETAILS MODAL */}
      {selectedReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg flex flex-col overflow-hidden animate-fadeIn my-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  {selectedReqModal.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedReqModal.id} • Initiated by {selectedReqModal.employeeName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReqModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase block">Currently Pending Approver:</span>
                  <span className="font-semibold text-xs">{selectedReqModal.pendingApprover.name} ({selectedReqModal.pendingApprover.designation})</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-200/70 text-amber-900 font-semibold text-xs">
                  Stage {selectedReqModal.currentStage}/{selectedReqModal.totalStages}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Approval Stages Overview:</span>
                <div className="space-y-2">
                  {selectedReqModal.steps.map((step) => (
                    <div key={step.stepNumber} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                          Step {step.stepNumber}: {step.roleName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {step.approverName} ({step.approverDesignation})
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          step.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : step.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReqModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-300 transition-colors"
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
