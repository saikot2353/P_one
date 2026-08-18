import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar as CalendarIcon,
  FileText,
  Clock,
  UserCheck,
  Briefcase,
  Wallet,
  Building2,
  ChevronDown,
  ArrowRight,
  Download,
  MoreHorizontal,
  FileCheck2,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { LoanApprovalViewModal, LoanApprovalModalData } from "@/components/modals/LoanApprovalViewModal";


export const Route = createFileRoute("/all-approvals")({
  component: AllApprovalsPage,
});

type ModuleType =
  | "Leave"
  | "Advance"
  | "Increment"
  | "Overtime"
  | "Budget"
  | "Personnel"
  | "Loan"
  | "Attendance";
type StatusType = "Pending" | "Approved" | "Rejected";

interface ApprovalRequest {
  id: string;
  module: ModuleType;
  reqNo: string;
  employee: {
    name: string;
    id: string;
    designation: string;
    department: string;
  };
  details: string;
  amount?: number;
  date: string;
  status: StatusType;
}

const mockApprovals: ApprovalRequest[] = [
  // Advance Approvals (from approve-advance.tsx)
  {
    id: "ADV-1001",
    module: "Advance",
    reqNo: "ADV-1001",
    employee: {
      name: "Khairul Bashar Masum",
      id: "2022041203",
      designation: "Asst. Manager",
      department: "HR Team",
    },
    details: "Salary Advance - For personal emergency",
    amount: 3500,
    date: "2026-04-10",
    status: "Pending",
  },
  {
    id: "ADV-1002",
    module: "Advance",
    reqNo: "ADV-1002",
    employee: {
      name: "Easin Mia",
      id: "2023043021",
      designation: "Receptionist",
      department: "Admin",
    },
    details: "General Advance - Medical expense",
    amount: 10000,
    date: "2026-04-12",
    status: "Pending",
  },
  {
    id: "ADV-1003",
    module: "Advance",
    reqNo: "ADV-1003",
    employee: {
      name: "Sohanur Rahman Sohan",
      id: "2023046001",
      designation: "Executive",
      department: "Admin",
    },
    details: "Salary Advance - Advance for festival",
    amount: 5000,
    date: "2026-04-15",
    status: "Pending",
  },
  {
    id: "ADV-1004",
    module: "Advance",
    reqNo: "ADV-1004",
    employee: { name: "Javed Mia", id: "2019013884", designation: "Helper", department: "Admin" },
    details: "General Advance - House shifting",
    amount: 2000,
    date: "2026-04-01",
    status: "Approved",
  },

  // Leave Approvals (from leave-approve.tsx)
  {
    id: "LV-001",
    module: "Leave",
    reqNo: "LV-2047508",
    employee: {
      name: "Mst. Jahanara Khatun",
      id: "2047508",
      designation: "Asst. Operator",
      department: "Sewing",
    },
    details: "ML (21/06/2026 to 18/10/2026)",
    date: "2026-06-20",
    status: "Approved",
  },
  {
    id: "LV-002",
    module: "Leave",
    reqNo: "LV-2400015",
    employee: {
      name: "Mst. Mukta Khatun",
      id: "2400015",
      designation: "Operator",
      department: "Sewing",
    },
    details: "ML (16/06/2026 to 13/10/2026)",
    date: "2026-06-15",
    status: "Approved",
  },
  {
    id: "LV-003",
    module: "Leave",
    reqNo: "LV-3302786",
    employee: {
      name: "Md. Shantona Khatun",
      id: "3302786",
      designation: "Asst. Operator",
      department: "Sewing",
    },
    details: "ML (11/06/2026 to 08/10/2026)",
    date: "2026-06-10",
    status: "Approved",
  },
  {
    id: "LV-004",
    module: "Leave",
    reqNo: "LV-8020064",
    employee: {
      name: "Amina Khatun",
      id: "8020064",
      designation: "Jr. Needle Man",
      department: "Store",
    },
    details: "ML (06/06/2026 to 03/10/2026)",
    date: "2026-06-05",
    status: "Pending",
  },

  // Other modules
  {
    id: "3",
    module: "Increment",
    reqNo: "I-2026-008",
    employee: {
      name: "Kaikobad Howlader",
      id: "2021022804",
      designation: "Security Guard",
      department: "Admin",
    },
    details: "Annual Performance Increment",
    amount: 2000,
    date: "2026-05-22",
    status: "Pending",
  },
  {
    id: "5",
    module: "Budget",
    reqNo: "B-2026-005",
    employee: {
      name: "Parvej Mahmud",
      id: "202606587",
      designation: "Manager",
      department: "Business Innovation",
    },
    details: "Q3 Software Subscriptions",
    amount: 45000,
    date: "2026-05-24",
    status: "Pending",
  },
  {
    id: "6",
    module: "Personnel",
    reqNo: "P-2026-019",
    employee: {
      name: "Md. Sakil",
      id: "2022040132",
      designation: "Operator",
      department: "Sewing",
    },
    details: "Designation Change to Sr. Operator",
    date: "2026-05-25",
    status: "Rejected",
  },
  {
    id: "7",
    module: "Loan",
    reqNo: "LN-2026-002",
    employee: {
      name: "Hasib Rahman",
      id: "1029384",
      designation: "Accountant",
      department: "Finance",
    },
    details: "Personal Loan (12 EMIs)",
    amount: 100000,
    date: "2026-05-26",
    status: "Pending",
  },
  {
    id: "9",
    module: "Loan",
    reqNo: "2026079299",
    employee: {
      name: "Mr X",
      id: "2026079299",
      designation: "Placeholder Designation",
      department: "12312",
    },
    details: "ddddddddddvc cxv xsxvs",
    amount: 1000,
    date: "2026-07-25",
    status: "Pending",
  },
  {
    id: "8",
    module: "Attendance",
    reqNo: "AT-2026-088",
    employee: {
      name: "Most. Fote Khatun",
      id: "33028814",
      designation: "Asst. Operator",
      department: "Sewing",
    },
    details: "Manual In-Punch at 09:15 AM",
    date: "2026-05-27",
    status: "Pending",
  },
];

const moduleConfig: Record<ModuleType, { icon: React.ElementType; color: string; bg: string }> = {
  Leave: {
    icon: CalendarIcon,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  Advance: {
    icon: Wallet,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  Increment: {
    icon: FileCheck2,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  Overtime: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  Budget: {
    icon: Building2,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
  Personnel: {
    icon: UserCheck,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
  },
  Loan: {
    icon: Briefcase,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  Attendance: {
    icon: FileText,
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
  },
};

function AllApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleType | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<StatusType | "All">("All");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedLoanData, setSelectedLoanData] = useState<LoanApprovalModalData | null>(null);

  const handleOpenDetailsModal = (item: ApprovalRequest) => {
    setSelectedLoanData({
      id: item.reqNo || item.id,
      moduleName: item.module,
      reqNo: item.reqNo || item.id,
      applicationDate: format(new Date(item.date), "dd MMM yyyy"),
      submittedTime: "09:18 AM",
      status: item.status,
      employee: {
        name: item.employee.name,
        id: item.employee.id,
        designation: item.employee.designation,
        department: item.employee.department,
        section: "Project Resource & Strategy",
        division: "Placeholder Unit",
        location: "PSL-Operation",
        joiningDate: "2026-07-25T00:00:00Z",
        basicSalary: 0,
        grossSalary: 0,
      },
      terms: {
        requestedAmount: item.amount || 1000,
        approvedAmount: item.status === "Approved" ? (item.amount || 1000) : 0,
        installmentTermMonths: 4,
        monthlyRate: Math.round((item.amount || 1000) / 4),
        reason: item.details,
      },
      timeline: [
        {
          stage: "STAGE 1: HR, ADMIN AND COMPLIANCE",
          roleLabel: "STAGE 1",
          approverName: "Rajebul Hasan Rajon",
          approverDesignation: "HR, Admin and Compliance",
          status: "pending",
          date: "2026-08-12T06:58:49.285855+00:00",
        },
        {
          stage: "STAGE 2: 12312",
          roleLabel: "STAGE 2",
          approverName: item.employee.name,
          approverDesignation: "Department Head",
          status: "approved",
          date: "2026-08-18T03:57:57.3663+00:00",
        },
        {
          stage: "STAGE 3: ABC",
          roleLabel: "STAGE 3",
          approverName: "Md. Sadmanur Islam Shishir",
          approverDesignation: "Approval Authority",
          status: "pending",
          date: "2026-08-12T06:58:49.285855+00:00",
        },
      ],
    });
    setIsLoanModalOpen(true);
  };

  const filteredData = useMemo(() => {
    return mockApprovals.filter((item) => {
      const matchesSearch =
        item.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = selectedModule === "All" || item.module === selectedModule;
      const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [searchTerm, selectedModule, selectedStatus]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredData.map((d) => d.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkAction = (action: "Approve" | "Reject") => {
    toast.success(`Successfully ${action.toLowerCase()}d ${selectedItems.size} requests.`);
    setSelectedItems(new Set());
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-[#0B1120] text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="size-6 text-[#2563eb]" />
                Central Approvals
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Manage all cross-departmental requests from a single unified inbox.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
                <Download className="size-4" /> Export
              </button>
            </div>
          </div>

          {/* Master Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col lg:flex-row gap-4 items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID, Name or Req No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value as ModuleType | "All")}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#2563eb]/20 cursor-pointer flex-1 sm:flex-none appearance-none pr-10 relative"
                style={{
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`,
                  backgroundPosition: "right 12px center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="All">All Modules</option>
                {Object.keys(moduleConfig).map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>

              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                {["Pending", "Approved", "Rejected", "All"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status as StatusType | "All")}
                    className={`px-4 h-8 rounded-lg text-xs font-bold transition-all ${selectedStatus === status ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 w-full lg:w-auto justify-end">
                <span className="text-sm font-bold text-slate-500 mr-2">
                  {selectedItems.size} selected
                </span>
                <button
                  onClick={() => handleBulkAction("Reject")}
                  className="h-10 px-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-rose-200 dark:border-rose-500/20"
                >
                  <XCircle className="size-4" /> Reject All
                </button>
                <button
                  onClick={() => handleBulkAction("Approve")}
                  className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                  <CheckCircle2 className="size-4" /> Approve All
                </button>
              </div>
            )}
          </div>

          {/* Unified Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200 fill-mode-both">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <th className="px-5 py-4 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedItems.size === filteredData.length && filteredData.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="size-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Request Info
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Requestor
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Details
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const ModIcon = moduleConfig[item.module].icon;
                      return (
                        <tr
                          key={item.id}
                          className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${selectedItems.has(item.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={() => handleSelect(item.id)}
                                className="size-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-10 rounded-xl flex items-center justify-center ${moduleConfig[item.module].bg}`}
                              >
                                <ModIcon className={`size-5 ${moduleConfig[item.module].color}`} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  {item.reqNo}
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                                  {item.module} Request
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {item.employee.name}
                              </div>
                              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                                {item.employee.id} • {item.employee.designation}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-[300px] truncate">
                              <div
                                className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate"
                                title={item.details}
                              >
                                {item.details}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-2">
                                <span>Applied: {format(new Date(item.date), "dd MMM yyyy")}</span>
                                {item.amount && (
                                  <>
                                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                      BDT {item.amount.toLocaleString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {item.status === "Pending" && (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-bold"
                              >
                                Pending Review
                              </Badge>
                            )}
                            {item.status === "Approved" && (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-bold"
                              >
                                Approved
                              </Badge>
                            )}
                            {item.status === "Rejected" && (
                              <Badge
                                variant="outline"
                                className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 font-bold"
                              >
                                Rejected
                              </Badge>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toast.success("Request approved")}
                                className="size-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                              <button
                                onClick={() => toast.success("Request rejected")}
                                className="size-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center transition-colors"
                                title="Reject"
                              >
                                <XCircle className="size-4" />
                              </button>
                              <button
                                onClick={() => handleOpenDetailsModal(item)}
                                className="h-8 px-3 rounded-lg bg-[#2563eb]/10 hover:bg-[#2563eb]/20 text-[#2563eb] dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors"
                                title="View Details"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                          <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <Filter className="size-8 text-slate-400 dark:text-slate-500" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                            No requests found
                          </h3>
                          <p className="text-sm">Try adjusting your filters or search terms.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Dummy */}
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredData.length} of {mockApprovals.length} requests
              </span>
              <div className="flex gap-1">
                <button className="px-3 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                  Prev
                </button>
                <button className="px-3 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Next
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Loan Approval View Modal */}
      <LoanApprovalViewModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        data={selectedLoanData}
      />
    </div>
  );
}
