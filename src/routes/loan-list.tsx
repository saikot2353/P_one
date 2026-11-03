import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Search,
  FileDown,
  Printer,
  FileText,
  Filter,
  Eye,
  Plus,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Building2,
  ArrowUpDown,
  RotateCcw
} from "lucide-react";
import {
  LoanApplicationDetailsModal,
  LoanRecord
} from "@/components/payroll/LoanApplicationDetailsModal";
import {
  SingleLoanPrintModal,
  AllLoansPrintModal,
  LoanPrintData
} from "@/components/payroll/LoanPrintModals";

export const Route = createFileRoute("/loan-list")({
  head: () => ({
    meta: [
      { title: "Loan List — CRIPTON HRIS" },
      { name: "description", content: "Comprehensive employee loan list, repayment terms, and application details." },
    ],
  }),
  component: LoanListPage,
});

const INITIAL_LOANS: LoanRecord[] = [
  {
    id: "LN-000002",
    reqNo: "LN-000002",
    applicationDate: "01/09/2026",
    submittedTime: "5:37 PM",
    status: "Approved",
    empId: "2024049326",
    empName: "Hanif Uddin",
    designation: "Sr. Executive",
    department: "Business Innovation",
    section: "APPS Team",
    operationalDivision: "PSL -Operation",
    joinDate: "01/06/2024",
    basicSalary: 30000,
    grossSalary: 50000,
    documents: "",
    avatarUrl: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg",
    requestedAmount: 150000,
    approvedAmount: 150000,
    installmentTerm: 15,
    monthlyRate: 10000,
    reason: "Marige",
    submitter: {
      name: "Md. Anik Islam",
      empId: "2023044078",
      designation: "Sr. Executive",
      department: "Business Innovation",
      time: "05:37 PM",
      date: "01/09/2026",
    },
    comments: [
      {
        author: "Md. Anik Islam",
        role: "Initiator",
        timestamp: "01/09/2026 05:37 PM",
        text: "Recommended for sanction as per special policy considerations.",
      },
      {
        author: "Management Board",
        role: "Approver",
        timestamp: "02/09/2026 11:20 AM",
        text: "Approved in full with 15-month amortization term starting from August 2026.",
      },
    ],
  },
  {
    id: "LN-000001",
    reqNo: "LN-000001",
    applicationDate: "15/08/2026",
    submittedTime: "10:15 AM",
    status: "Approved",
    empId: "2018010173",
    empName: "Md. Golam Mowdud",
    designation: "Manager",
    department: "Supply Chain",
    section: "Inventory Management",
    operationalDivision: "Knit Dyeing",
    joinDate: "01/02/2018",
    basicSalary: 42000,
    grossSalary: 65000,
    documents: "Medical_Report.pdf",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 50000,
    approvedAmount: 50000,
    installmentTerm: 10,
    monthlyRate: 5000,
    reason: "Dear Sir, This loan is required for his wife's Cesarean (Baby Delivery) Surgery purpose.",
    submitter: {
      name: "Md. Golam Mowdud",
      empId: "2018010173",
      designation: "Manager",
      department: "Supply Chain",
      time: "10:15 AM",
      date: "15/08/2026",
    },
  },
  {
    id: "LN-000003",
    reqNo: "LN-000003",
    applicationDate: "20/08/2026",
    submittedTime: "02:45 PM",
    status: "Approved",
    empId: "2021028341",
    empName: "Tanvir Ahmed",
    designation: "Assistant Manager",
    department: "Human Resources",
    section: "Recruitment & Talent",
    operationalDivision: "PSL -Operation",
    joinDate: "15/03/2021",
    basicSalary: 38000,
    grossSalary: 58000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 80000,
    approvedAmount: 80000,
    installmentTerm: 8,
    monthlyRate: 10000,
    reason: "Residential House Renovation and Maintenance Expenses.",
    submitter: {
      name: "Tanvir Ahmed",
      empId: "2021028341",
      designation: "Assistant Manager",
      department: "Human Resources",
      time: "02:45 PM",
      date: "20/08/2026",
    },
  },
  {
    id: "LN-000004",
    reqNo: "LN-000004",
    applicationDate: "28/08/2026",
    submittedTime: "11:00 AM",
    status: "Approved",
    empId: "2022039124",
    empName: "Farhana Akter",
    designation: "Senior Merchandiser",
    department: "Merchandising",
    section: "Woven Division",
    operationalDivision: "Factory Unit-1",
    joinDate: "10/11/2022",
    basicSalary: 35000,
    grossSalary: 55000,
    documents: "Admission_Invoice.pdf",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 120000,
    approvedAmount: 100000,
    installmentTerm: 10,
    monthlyRate: 10000,
    reason: "Child Higher Education University Admission & Semester Fee.",
    submitter: {
      name: "Farhana Akter",
      empId: "2022039124",
      designation: "Senior Merchandiser",
      department: "Merchandising",
      time: "11:00 AM",
      date: "28/08/2026",
    },
  },
  {
    id: "LN-000005",
    reqNo: "LN-000005",
    applicationDate: "05/09/2026",
    submittedTime: "04:10 PM",
    status: "Pending",
    empId: "2023041920",
    empName: "Mahbubur Rahman",
    designation: "Executive",
    department: "Accounts & Finance",
    section: "Treasury & Audit",
    operationalDivision: "Corporate HQ",
    joinDate: "01/01/2023",
    basicSalary: 28000,
    grossSalary: 45000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 60000,
    approvedAmount: 0,
    installmentTerm: 6,
    monthlyRate: 10000,
    reason: "Emergency Medical Treatment for Mother in Dhaka.",
    submitter: {
      name: "Mahbubur Rahman",
      empId: "2023041920",
      designation: "Executive",
      department: "Accounts & Finance",
      time: "04:10 PM",
      date: "05/09/2026",
    },
  },
  {
    id: "LN-000006",
    reqNo: "LN-000006",
    applicationDate: "10/09/2026",
    submittedTime: "09:30 AM",
    status: "Pending",
    empId: "2020015523",
    empName: "Kamrul Islam",
    designation: "Maintenance Engineer",
    department: "Engineering & Utility",
    section: "Electrical Maintenance",
    operationalDivision: "Knit Dyeing",
    joinDate: "12/07/2020",
    basicSalary: 32000,
    grossSalary: 52000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 45000,
    approvedAmount: 0,
    installmentTerm: 9,
    monthlyRate: 5000,
    reason: "Emergency Home Repair & Roof Waterproofing.",
    submitter: {
      name: "Kamrul Islam",
      empId: "2020015523",
      designation: "Maintenance Engineer",
      department: "Engineering & Utility",
      time: "09:30 AM",
      date: "10/09/2026",
    },
  },
  {
    id: "LN-000007",
    reqNo: "LN-000007",
    applicationDate: "12/09/2026",
    submittedTime: "03:15 PM",
    status: "Rejected",
    empId: "2024050119",
    empName: "Sabbir Hossain",
    designation: "Junior Officer",
    department: "Logistics",
    section: "Warehouse Dispatch",
    operationalDivision: "Factory Unit-2",
    joinDate: "15/07/2024",
    basicSalary: 22000,
    grossSalary: 35000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 40000,
    approvedAmount: 0,
    installmentTerm: 8,
    monthlyRate: 5000,
    reason: "Motorcycle Purchase Down Payment.",
    submitter: {
      name: "Sabbir Hossain",
      empId: "2024050119",
      designation: "Junior Officer",
      department: "Logistics",
      time: "03:15 PM",
      date: "12/09/2026",
    },
  },
];

function LoanListPage() {
  const [loans] = useState<LoanRecord[]>(INITIAL_LOANS);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Print Modals
  const [isSinglePrintOpen, setIsSinglePrintOpen] = useState(false);
  const [selectedPrintLoan, setSelectedPrintLoan] = useState<LoanPrintData | null>(null);
  const [isAllLoansPrintOpen, setIsAllLoansPrintOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  // Unique lists for dropdowns
  const departments = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.department))).sort();
  }, [loans]);

  const sections = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.section))).sort();
  }, [loans]);

  // Filtered loans list
  const filteredLoans = useMemo(() => {
    return loans.filter((item) => {
      if (departmentFilter !== "ALL" && item.department !== departmentFilter) return false;
      if (sectionFilter !== "ALL" && item.section !== sectionFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEmpId = item.empId.toLowerCase().includes(q);
        const matchesName = item.empName.toLowerCase().includes(q);
        const matchesReqNo = item.reqNo.toLowerCase().includes(q);
        const matchesDesignation = item.designation.toLowerCase().includes(q);
        const matchesDivision = item.operationalDivision.toLowerCase().includes(q);
        if (!matchesEmpId && !matchesName && !matchesReqNo && !matchesDesignation && !matchesDivision) {
          return false;
        }
      }

      return true;
    });
  }, [loans, departmentFilter, sectionFilter, statusFilter, searchQuery]);

  // Statistics
  const totalApplications = loans.length;
  const totalApprovedAmount = useMemo(() => {
    return loans.filter((l) => l.status === "Approved").reduce((sum, l) => sum + l.approvedAmount, 0);
  }, [loans]);
  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const totalMonthlyRecoveries = useMemo(() => {
    return loans.filter((l) => l.status === "Approved").reduce((sum, l) => sum + l.monthlyRate, 0);
  }, [loans]);

  const handleOpenDetails = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleOpenPrint = (loan: LoanRecord) => {
    const printData: LoanPrintData = {
      id: typeof loan.id === "number" ? loan.id : 101,
      empId: loan.empId,
      empName: loan.empName,
      section: loan.section,
      designation: loan.designation,
      unit: loan.operationalDivision,
      basicSalary: loan.basicSalary,
      grossSalary: loan.grossSalary,
      areaName: loan.operationalDivision,
      joinDate: loan.joinDate,
      expLoanAmount: loan.requestedAmount,
      appLoanAmt: loan.approvedAmount,
      installments: loan.installmentTerm,
      installmentAmt: loan.monthlyRate,
      reason: loan.reason,
      status: loan.status,
      applicationDate: loan.applicationDate,
    };
    setSelectedPrintLoan(printData);
    setIsSinglePrintOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "Sl",
      "Employee ID",
      "Employee Name",
      "Designation",
      "Department",
      "Section",
      "Operational Division",
      "Requested Amount",
      "Approved Amount",
      "Installment Term",
      "Monthly Rate",
      "Status",
      "Application Date",
    ];

    const rows = filteredLoans.map((l, index) => [
      index + 1,
      `"${l.empId}"`,
      `"${l.empName}"`,
      `"${l.designation}"`,
      `"${l.department}"`,
      `"${l.section}"`,
      `"${l.operationalDivision}"`,
      l.requestedAmount,
      l.approvedAmount,
      `"${l.installmentTerm} Months"`,
      l.monthlyRate,
      l.status,
      l.applicationDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loan_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1700px] mx-auto">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <Link to="/loan-application" className="hover:text-blue-600 transition-colors">
              Loan Application
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-700 dark:text-slate-300 font-bold">Loan List</span>
          </div>

          {/* Top Banner Card */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                  <Coins className="size-3.5" />
                  Payroll & Loan Management
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Employee Loan List
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Directory of employee company loan applications, approved sanction amounts, repayment tenures, monthly deduction rates, and detailed amortization profiles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link to="/loan-application">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 text-xs cursor-pointer"
                  >
                    <Plus className="size-4" />
                    APPLY FOR LOAN
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-10 px-4 rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer"
                  title="Print All Loans Register"
                >
                  <Printer className="size-4 text-blue-600" />
                  <span>Print Loan Register</span>
                </Button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Total Applications
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {totalApplications}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  All active & historical loans
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Total Approved Sanctions
                </span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-1 block">
                  ৳{totalApprovedAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600/80 mt-1 block">
                  Disbursed company capital
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/40">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Pending Approvals
                </span>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono mt-1 block">
                  {pendingCount}
                </span>
                <span className="text-[10px] text-amber-600/80 mt-1 block">
                  Awaiting HOD / HR approval
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/40">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Monthly Recovery Rate
                </span>
                <span className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono mt-1 block">
                  ৳{totalMonthlyRecoveries.toLocaleString()}
                </span>
                <span className="text-[10px] text-blue-600/80 mt-1 block">
                  Active monthly deductions
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="size-4 text-blue-600" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Filter & Search Records
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Search by Employee ID / Name</label>
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ID, name, req no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Section</label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Sections</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Approval Status</label>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setDepartmentFilter("ALL");
                      setSectionFilter("ALL");
                      setStatusFilter("ALL");
                    }}
                    className="h-10 px-3 rounded-xl border-slate-200 text-slate-500 hover:text-slate-800"
                    title="Reset all filters"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[480px]">
            {/* Table Action Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-1 w-fit shadow-2xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportCSV}
                  className="h-8 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export to Excel CSV"
                >
                  <FileDown className="size-4 text-emerald-600" />
                  EXCEL
                </Button>
                <div className="w-px bg-slate-200 dark:bg-slate-700 my-1.5" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-8 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Print Summary Sheet"
                >
                  <Printer className="size-4 text-blue-600" />
                  PRINT
                </Button>
                <div className="w-px bg-slate-200 dark:bg-slate-700 my-1.5" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-8 px-4 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export PDF Document"
                >
                  <FileText className="size-4 text-rose-600" />
                  PDF
                </Button>
              </div>

              <div className="text-xs font-bold text-slate-400">
                Showing <span className="text-blue-600 font-extrabold">{filteredLoans.length}</span> of {loans.length} loan records
              </div>
            </div>

            {/* ── Table with exact required columns ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                <thead className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-center w-12">
                      Sl
                    </th>
                    <th className="px-3.5 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-center w-24">
                      Actions
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Employee ID
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Employee Name
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Designation
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Department
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Section
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80">
                      Operational Division
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-right">
                      REQUESTED AMOUNT
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-right">
                      APPROVED AMOUNT
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-center">
                      INSTALLMENT TERM
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-right">
                      MONTHLY RATE
                    </th>
                    <th className="px-4 py-3.5 text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-16 text-center text-slate-400 text-sm font-semibold">
                        No loan records match selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((row, index) => (
                      <tr
                        key={row.id}
                        onClick={() => handleOpenDetails(row)}
                        className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group"
                      >
                        {/* Sl */}
                        <td className="px-3.5 py-3 text-slate-400 text-center border-r border-slate-100 dark:border-slate-800 font-bold">
                          {index + 1}
                        </td>

                        {/* Actions */}
                        <td
                          className="px-3.5 py-3 text-center border-r border-slate-100 dark:border-slate-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(row)}
                              className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer shadow-2xs"
                              title="View Loan Application Details (Modal)"
                            >
                              <Eye className="size-3.5" strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenPrint(row)}
                              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                              title="Print Official Loan Application Form"
                            >
                              <Printer className="size-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>

                        {/* Employee ID */}
                        <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                          {row.empId}
                        </td>

                        {/* Employee Name */}
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800 group-hover:text-blue-600 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                            <span>{row.empName}</span>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                          {row.designation}
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                          {row.department}
                        </td>

                        {/* Section */}
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                          {row.section}
                        </td>

                        {/* Operational Division */}
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                          {row.operationalDivision}
                        </td>

                        {/* REQUESTED AMOUNT */}
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                          ৳{row.requestedAmount.toLocaleString()}
                        </td>

                        {/* APPROVED AMOUNT */}
                        <td className="px-4 py-3 text-right font-mono font-extrabold text-blue-600 dark:text-blue-400 border-r border-slate-100 dark:border-slate-800">
                          {row.status === "Approved" ? `৳${row.approvedAmount.toLocaleString()}` : "৳0"}
                        </td>

                        {/* INSTALLMENT TERM */}
                        <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                          {row.installmentTerm} Months
                        </td>

                        {/* MONTHLY RATE */}
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                          ৳{row.monthlyRate.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                              row.status === "Approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : row.status === "Rejected"
                                ? "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400"
                                : "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/40 text-xs font-bold text-slate-400">
              <div>
                Showing 1 to {filteredLoans.length} of {filteredLoans.length} records
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs font-bold bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODAL: LOAN APPLICATION DETAILS (Exact match to Screenshots 2 & 3) ── */}
        <LoanApplicationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          loan={selectedLoan}
          onPrintPdf={(loan) => {
            handleOpenPrint(loan);
          }}
        />

        {/* ── SINGLE LOAN PRINT MODAL (PAKIZA OFFICIAL A4 FORMAT) ── */}
        <SingleLoanPrintModal
          isOpen={isSinglePrintOpen}
          onClose={() => setIsSinglePrintOpen(false)}
          loan={selectedPrintLoan}
        />

        {/* ── ALL LOANS LIST PDF PRINT MODAL ── */}
        <AllLoansPrintModal
          isOpen={isAllLoansPrintOpen}
          onClose={() => setIsAllLoansPrintOpen(false)}
          loans={loans.map((l) => ({
            id: typeof l.id === "number" ? l.id : 101,
            empId: l.empId,
            empName: l.empName,
            section: l.section,
            designation: l.designation,
            unit: l.operationalDivision,
            basicSalary: l.basicSalary,
            grossSalary: l.grossSalary,
            areaName: l.operationalDivision,
            joinDate: l.joinDate,
            expLoanAmount: l.requestedAmount,
            appLoanAmt: l.approvedAmount,
            installments: l.installmentTerm,
            installmentAmt: l.monthlyRate,
            reason: l.reason,
            status: l.status,
            applicationDate: l.applicationDate,
          }))}
        />
      </main>
    </div>
  );
}
export default LoanListPage;

