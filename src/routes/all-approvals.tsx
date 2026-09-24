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
  CircleDollarSign,
  MessageSquare,
  AlertCircle,
  X,
  BuildingIcon,
  LayersIcon,
  CalendarDays,
  MapPin,
  Check,
  Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { LoanApprovalViewModal, LoanApprovalModalData } from "@/components/modals/LoanApprovalViewModal";
import { SimApprovalViewModal, SimApprovalModalData } from "@/components/modals/SimApprovalViewModal";


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
  | "Attendance"
  | "SIM";
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
  simData?: SimApprovalModalData;
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

  // SIM Requisitions (New SIM, SIM Balance Limit, SIM Replacement)
  {
    id: "SIM-2026-001",
    module: "SIM",
    reqNo: "SIM-2026-001",
    employee: {
      name: "Mahmudul Hasan",
      id: "2024091001",
      designation: "Senior Software Engineer",
      department: "IT & Software",
    },
    details: "New SIM Requisition - Grameenphone Corporate Postpaid (BDT 1,000/mo)",
    amount: 1000,
    date: "2026-09-20",
    status: "Pending",
    simData: {
      id: "SIM-2026-001",
      reqNo: "SIM-2026-001",
      applicationDate: "20 Sep 2026",
      submittedTime: "10:15 AM",
      status: "Pending",
      requestType: "New SIM",
      employee: {
        name: "Mahmudul Hasan",
        id: "2024091001",
        designation: "Senior Software Engineer",
        department: "IT & Software",
        section: "Software Engineering & Solutions",
        location: "Head Office, Dhaka",
        joiningDate: "01 Feb 2024",
        businessUnit: "Pakiza Software Limited",
      },
      simDetails: {
        operator: "Grameenphone",
        packageType: "Corporate Postpaid Premier 1000",
        expectedLimit: 1000,
        justification: "Required for daily client coordination, system production incident alerts, and 24/7 on-call engineering support.",
        onBehalf: false,
      },
    },
  },
  {
    id: "SIM-2026-002",
    module: "SIM",
    reqNo: "SIM-2026-002",
    employee: {
      name: "Nusrat Jahan Tanha",
      id: "2023051512",
      designation: "Key Account Manager",
      department: "Sales & Business Development",
    },
    details: "SIM Balance Limit Enhancement - 01711-987654 (BDT 1,200 → BDT 2,500)",
    amount: 2500,
    date: "2026-09-22",
    status: "Pending",
    simData: {
      id: "SIM-2026-002",
      reqNo: "SIM-2026-002",
      applicationDate: "22 Sep 2026",
      submittedTime: "11:45 AM",
      status: "Pending",
      requestType: "SIM Balance Limit",
      employee: {
        name: "Nusrat Jahan Tanha",
        id: "2023051512",
        designation: "Key Account Manager",
        department: "Sales & Business Development",
        section: "Sales, Business Development & CRM",
        location: "Head Office, Dhaka",
        joiningDate: "15 May 2023",
        businessUnit: "Pakiza Software Limited",
      },
      simDetails: {
        simNumber: "01711-987654",
        operator: "Grameenphone",
        existingLimit: 1200,
        expectedLimit: 2500,
        justification: "Monthly limit cap reached due to increased international business calls and extensive data usage during field client visits.",
        onBehalf: false,
      },
    },
  },
  {
    id: "SIM-2026-003",
    module: "SIM",
    reqNo: "SIM-2026-003",
    employee: {
      name: "Tariqul Islam",
      id: "2021084490",
      designation: "Assistant Logistics Manager",
      department: "Supply Chain & Procurement",
    },
    details: "SIM Replacement - 01844-556677 (Lost Physical SIM Replacement to USIM 5G)",
    amount: 200,
    date: "2026-09-23",
    status: "Pending",
    simData: {
      id: "SIM-2026-003",
      reqNo: "SIM-2026-003",
      applicationDate: "23 Sep 2026",
      submittedTime: "03:30 PM",
      status: "Pending",
      requestType: "SIM Replacement",
      employee: {
        name: "Tariqul Islam",
        id: "2021084490",
        designation: "Assistant Logistics Manager",
        department: "Supply Chain & Procurement",
        section: "Supply Chain & Procurement",
        location: "Factory Operations, Savar",
        joiningDate: "10 Aug 2021",
        businessUnit: "Pakiza Knit Group",
      },
      simDetails: {
        simNumber: "01844-556677",
        operator: "Robi Axiata",
        replacementReason: "Physical SIM Card Lost / Damaged during field dispatch",
        replacementCharge: 200,
        justification: "Physical SIM card damaged during field survey at factory site. Urgent replacement needed for logistics tracking.",
        onBehalf: true,
        onBehalfPerson: "Rafiqul Islam (Senior Logistics Officer)",
        section: "Supply Chain & Procurement",
        attachmentName: "GD_Copy_SIM_Loss.pdf",
        attachmentSize: "1.4 MB",
      },
    },
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
  SIM: {
    icon: Smartphone,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-500/10",
  },
};

function AllApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleType | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<StatusType | "All">("All");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedLoanData, setSelectedLoanData] = useState<LoanApprovalModalData | null>(null);

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [selectedSimData, setSelectedSimData] = useState<SimApprovalModalData | null>(null);

  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [approvalComment, setApprovalComment] = useState("");

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


  const handleOpenDetailsModal = (item: ApprovalRequest) => {
    if (item.module === "SIM") {
      if (item.simData) {
        setSelectedSimData(item.simData);
      } else {
        setSelectedSimData({
          id: item.id,
          reqNo: item.reqNo,
          applicationDate: format(new Date(item.date), "dd MMM yyyy"),
          submittedTime: "10:00 AM",
          status: item.status,
          requestType: "New SIM",
          employee: {
            name: item.employee.name,
            id: item.employee.id,
            designation: item.employee.designation,
            department: item.employee.department,
          },
          simDetails: {
            operator: "Grameenphone",
            justification: item.details,
          },
        });
      }
      setIsSimModalOpen(true);
      return;
    }
    if (item.module === "Advance") {
      setSelectedReq({
        ...item,
        employeeName: item.employee.name,
        employeeId: item.employee.id,
        designation: item.employee.designation,
        department: item.employee.department,
        joiningDate: "15 Mar 2025",
        businessUnit: "Pakiza Software Limited",
        location: "PSL-Operation",
        month: "April",
        year: "2026",
        basicSalary: 25000,
        grossSalary: 40000,
        advanceAmount: item.amount,
        remark: item.details,
        applicationDate: item.date,
        submittedTime: "09:18 AM",
        revision: "00",
        history: [],
        approvalSteps: [],
        comments: []
      });
      return;
    }
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
      {/* Loan Approval View Modal */}
      <LoanApprovalViewModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        data={selectedLoanData}
      />
      {/* SIM Requisition Approval View Modal */}
      <SimApprovalViewModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        data={selectedSimData}
        onStatusChange={(id, newStatus, updatedDetails) => {
          if (selectedSimData && selectedSimData.id === id) {
            const updatedSimData = {
              ...selectedSimData,
              status: newStatus,
              simDetails: {
                ...selectedSimData.simDetails,
                ...updatedDetails,
              },
            };
            setSelectedSimData(updatedSimData);

            const itemIdx = mockApprovals.findIndex((m) => m.id === id);
            if (itemIdx !== -1) {
              mockApprovals[itemIdx].status = newStatus;
              if (updatedDetails?.simNumber) {
                mockApprovals[itemIdx].details = `[${selectedSimData.requestType}] Assigned SIM: ${updatedDetails.simNumber}`;
              }
              if (updatedDetails?.expectedLimit) {
                mockApprovals[itemIdx].amount = updatedDetails.expectedLimit;
              }
            }
          }
        }}
      />
    </div>
  );
}
