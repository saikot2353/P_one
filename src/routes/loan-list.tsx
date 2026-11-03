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
  Calendar,
  Building2,
  RotateCcw,
  Layers,
  MapPin,
  Briefcase,
  User,
  ShieldCheck,
  CheckCircle2
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

/** Helper to compute accurate loan repayment balance */
export function calculateLoanBalance(loan: {
  status: string;
  approvalStatus?: string;
  approvedAmount: number;
  installmentTerm: number;
  paidMonths?: number;
  monthlyRate: number;
  remainingBalance?: number;
}) {
  const isApproved =
    loan.approvalStatus === "Approved" ||
    loan.status === "Approved" ||
    loan.status === "Fully Paid" ||
    loan.status === "Active";

  if (!isApproved || loan.status === "Rejected" || loan.status === "Closed") {
    return {
      paidMonths: 0,
      totalPaid: 0,
      remainingBalance: 0,
      displayPaidMonths: "-",
      displayRemaining: "-",
    };
  }

  if (loan.status === "Pending") {
    return {
      paidMonths: 0,
      totalPaid: 0,
      remainingBalance: 0,
      displayPaidMonths: "-",
      displayRemaining: "-",
    };
  }

  if (loan.status === "Fully Paid") {
    const term = loan.installmentTerm || 1;
    return {
      paidMonths: term,
      totalPaid: loan.approvedAmount,
      remainingBalance: 0,
      displayPaidMonths: `${term} / ${term} mo`,
      displayRemaining: "৳0",
    };
  }

  // Active Approved Loan Calculation
  const approvedAmt = loan.approvedAmount || 0;
  const term = loan.installmentTerm || 1;
  const monthly = loan.monthlyRate || (term > 0 ? Math.round(approvedAmt / term) : 0);
  const paidMonths = typeof loan.paidMonths === "number" ? loan.paidMonths : 0;
  
  // Total repaid so far
  const totalPaid = Math.min(approvedAmt, paidMonths * monthly);
  
  // Outstanding remaining balance = Approved Amount - Total Paid
  const remaining = typeof loan.remainingBalance === "number" && loan.remainingBalance >= 0
    ? loan.remainingBalance
    : Math.max(0, approvedAmt - totalPaid);

  return {
    paidMonths,
    totalPaid,
    remainingBalance: remaining,
    displayPaidMonths: `${paidMonths} / ${term} mo`,
    displayRemaining: `৳${remaining.toLocaleString()}`,
  };
}

const INITIAL_LOANS: LoanRecord[] = [
  {
    id: "LN-000002",
    reqNo: "LN-000002",
    applicationDate: "01/09/2026",
    submittedTime: "5:37 PM",
    approvalStatus: "Approved",
    status: "Active",
    company: "Pakiza Software Limited",
    area: "PSL -Operation",
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
    paidMonths: 3,
    monthlyRate: 10000,
    remainingBalance: 120000, // 150,000 - (3 * 10,000) = 120,000
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
    approvalStatus: "Approved",
    status: "Active",
    company: "Pakiza Knit Composite Ltd.",
    area: "Knit Dyeing",
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
    paidMonths: 4,
    monthlyRate: 5000,
    remainingBalance: 30000, // 50,000 - (4 * 5,000) = 30,000
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
    approvalStatus: "Approved",
    status: "Active",
    company: "Pakiza Software Limited",
    area: "PSL -Operation",
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
    paidMonths: 2,
    monthlyRate: 10000,
    remainingBalance: 60000, // 80,000 - (2 * 10,000) = 60,000
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
    approvalStatus: "Approved",
    status: "Active",
    company: "Pakiza Apparels Ltd.",
    area: "Factory Unit-1",
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
    paidMonths: 3,
    monthlyRate: 10000,
    remainingBalance: 70000, // 100,000 - (3 * 10,000) = 70,000
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
    id: "LN-000008",
    reqNo: "LN-000008",
    applicationDate: "05/01/2026",
    submittedTime: "11:30 AM",
    approvalStatus: "Approved",
    status: "Fully Paid",
    company: "Pakiza Software Limited",
    area: "PSL -Operation",
    empId: "2019012384",
    empName: "Nazmul Huda",
    designation: "Senior Executive",
    department: "Store & Inventory",
    section: "Central Warehouse",
    operationalDivision: "PSL -Operation",
    joinDate: "14/05/2019",
    basicSalary: 36000,
    grossSalary: 56000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 60000,
    approvedAmount: 60000,
    installmentTerm: 6,
    paidMonths: 6,
    monthlyRate: 10000,
    remainingBalance: 0,
    reason: "Personal Emergency Expense Loan.",
    submitter: {
      name: "Nazmul Huda",
      empId: "2019012384",
      designation: "Senior Executive",
      department: "Store & Inventory",
      time: "11:30 AM",
      date: "05/01/2026",
    },
  },
  {
    id: "LN-000009",
    reqNo: "LN-000009",
    applicationDate: "10/02/2026",
    submittedTime: "02:15 PM",
    approvalStatus: "Approved",
    status: "Fully Paid",
    company: "Pakiza Apparels Ltd.",
    area: "Factory Unit-1",
    empId: "2017009412",
    empName: "Rashedul Islam",
    designation: "Assistant Manager",
    department: "Production",
    section: "Cutting Department",
    operationalDivision: "Factory Unit-1",
    joinDate: "10/02/2017",
    basicSalary: 40000,
    grossSalary: 62000,
    documents: "",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    requestedAmount: 100000,
    approvedAmount: 100000,
    installmentTerm: 10,
    paidMonths: 10,
    monthlyRate: 10000,
    remainingBalance: 0,
    reason: "Family Medical & Surgical Expenses.",
    submitter: {
      name: "Rashedul Islam",
      empId: "2017009412",
      designation: "Assistant Manager",
      department: "Production",
      time: "02:15 PM",
      date: "10/02/2026",
    },
  },
  {
    id: "LN-000005",
    reqNo: "LN-000005",
    applicationDate: "05/09/2026",
    submittedTime: "04:10 PM",
    approvalStatus: "Pending",
    status: "Pending",
    company: "Pakiza Corporate HQ",
    area: "Corporate HQ",
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
    paidMonths: 0,
    monthlyRate: 10000,
    remainingBalance: 0,
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
    approvalStatus: "Pending",
    status: "Pending",
    company: "Pakiza Knit Composite Ltd.",
    area: "Knit Dyeing",
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
    paidMonths: 0,
    monthlyRate: 5000,
    remainingBalance: 0,
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
    approvalStatus: "Rejected",
    status: "Closed",
    company: "Pakiza Textiles Ltd.",
    area: "Factory Unit-2",
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
    paidMonths: 0,
    monthlyRate: 5000,
    remainingBalance: 0,
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

function parseDateStrToDate(dStr: string): Date | null {
  if (!dStr) return null;
  const parts = dStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }
  return new Date(dStr);
}

function LoanListPage() {
  const [loans] = useState<LoanRecord[]>(INITIAL_LOANS);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Print Modals
  const [isSinglePrintOpen, setIsSinglePrintOpen] = useState(false);
  const [selectedPrintLoan, setSelectedPrintLoan] = useState<LoanPrintData | null>(null);
  const [isAllLoansPrintOpen, setIsAllLoansPrintOpen] = useState(false);

  // Exact 10 Filters State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [designationFilter, setDesignationFilter] = useState("ALL");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dynamic unique options for dropdowns
  const companies = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.company).filter(Boolean))).sort();
  }, [loans]);

  const areas = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.area || l.operationalDivision).filter(Boolean))).sort();
  }, [loans]);

  const departments = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.department).filter(Boolean))).sort();
  }, [loans]);

  const sections = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.section).filter(Boolean))).sort();
  }, [loans]);

  const designations = useMemo(() => {
    return Array.from(new Set(loans.map((l) => l.designation).filter(Boolean))).sort();
  }, [loans]);

  // Filtered loans list according to all 10 criteria
  const filteredLoans = useMemo(() => {
    return loans.filter((item) => {
      // 1. From Date (Application Date)
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        const itemDate = parseDateStrToDate(item.applicationDate);
        if (itemDate && itemDate < from) return false;
      }

      // 2. To Date (Application Date)
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        const itemDate = parseDateStrToDate(item.applicationDate);
        if (itemDate && itemDate > to) return false;
      }

      // 3. Employee ID (Partial or Exact match)
      if (empIdFilter.trim()) {
        const q = empIdFilter.toLowerCase().trim();
        const matchesEmpId = item.empId.toLowerCase().includes(q);
        const matchesName = item.empName.toLowerCase().includes(q);
        if (!matchesEmpId && !matchesName) return false;
      }

      // 4. Company
      if (companyFilter !== "ALL" && item.company !== companyFilter) return false;

      // 5. Area
      const itemArea = item.area || item.operationalDivision;
      if (areaFilter !== "ALL" && itemArea !== areaFilter) return false;

      // 6. Department
      if (departmentFilter !== "ALL" && item.department !== departmentFilter) return false;

      // 7. Section
      if (sectionFilter !== "ALL" && item.section !== sectionFilter) return false;

      // 8. Designation
      if (designationFilter !== "ALL" && item.designation !== designationFilter) return false;

      // 9. Approval Status
      const itemAppStatus = item.approvalStatus || (item.status === "Approved" || item.status === "Fully Paid" ? "Approved" : item.status);
      if (approvalStatusFilter !== "ALL" && itemAppStatus !== approvalStatusFilter) return false;

      // 10. Status (Active, Fully Paid, Closed, etc.)
      if (statusFilter !== "ALL") {
        if (statusFilter === "Active" && item.status !== "Active" && item.status !== "Approved") return false;
        if (statusFilter === "Fully Paid" && item.status !== "Fully Paid") return false;
        if (statusFilter === "Closed" && item.status !== "Closed" && item.status !== "Rejected") return false;
        if (statusFilter === "Pending" && item.status !== "Pending") return false;
      }

      return true;
    });
  }, [
    loans,
    fromDate,
    toDate,
    empIdFilter,
    companyFilter,
    areaFilter,
    departmentFilter,
    sectionFilter,
    designationFilter,
    approvalStatusFilter,
    statusFilter,
  ]);

  const handleOpenDetails = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleOpenPrint = (loan: LoanRecord) => {
    const calc = calculateLoanBalance(loan);
    const printData: LoanPrintData = {
      id: typeof loan.id === "number" ? loan.id : 101,
      empId: loan.empId,
      empName: loan.empName,
      section: loan.section,
      designation: loan.designation,
      unit: loan.operationalDivision,
      basicSalary: loan.basicSalary,
      grossSalary: loan.grossSalary,
      areaName: loan.area || loan.operationalDivision,
      joinDate: loan.joinDate,
      expLoanAmount: loan.requestedAmount,
      appLoanAmt: loan.approvedAmount,
      installments: loan.installmentTerm,
      installmentAmt: loan.monthlyRate,
      reason: loan.reason,
      status: loan.status === "Fully Paid" ? "Approved" : (loan.approvalStatus || (loan.status as any)),
      applicationDate: loan.applicationDate,
    };
    setSelectedPrintLoan(printData);
    setIsSinglePrintOpen(true);
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setEmpIdFilter("");
    setCompanyFilter("ALL");
    setAreaFilter("ALL");
    setDepartmentFilter("ALL");
    setSectionFilter("ALL");
    setDesignationFilter("ALL");
    setApprovalStatusFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleExportCSV = () => {
    const headers = [
      "Sl",
      "Employee ID",
      "Employee Name",
      "Company",
      "Area",
      "Designation",
      "Department",
      "Section",
      "Requested Amount",
      "Approved Amount",
      "Installment Term",
      "Paid Months",
      "Monthly Rate",
      "Remaining Balance",
      "Approval Status",
      "Status",
      "Application Date",
    ];

    const rows = filteredLoans.map((l, index) => {
      const calc = calculateLoanBalance(l);
      return [
        index + 1,
        `"${l.empId}"`,
        `"${l.empName}"`,
        `"${l.company || ""}"`,
        `"${l.area || l.operationalDivision}"`,
        `"${l.designation}"`,
        `"${l.department}"`,
        `"${l.section}"`,
        l.requestedAmount,
        l.approvedAmount,
        `"${l.installmentTerm} Months"`,
        `"${calc.paidMonths} Months"`,
        l.monthlyRate,
        calc.remainingBalance,
        l.approvalStatus || (l.status === "Approved" || l.status === "Fully Paid" ? "Approved" : l.status),
        l.status,
        l.applicationDate,
      ];
    });

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
        <div className="p-4 md:p-6 space-y-5 w-full max-w-[1750px] mx-auto">
          
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

          {/* Clean Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Loan List
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comprehensive directory of employee loan applications, terms, and repayment parameters.
              </p>
            </div>
          </div>

          {/* ── 10 EXACT FILTER CONTROLS ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-blue-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Filter Records
                </h2>
              </div>
              
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset all filter fields"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Responsive 5-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              
              {/* 1. From Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="size-3 text-blue-600" />
                  <span>From Date</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 2. To Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="size-3 text-blue-600" />
                  <span>To Date</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 3. Employee ID */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <User className="size-3 text-slate-400" />
                  <span>Employee ID</span>
                </label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={empIdFilter}
                    onChange={(e) => setEmpIdFilter(e.target.value)}
                    className="w-full h-9 pl-8 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 4. Company */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" />
                  <span>Company</span>
                </label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer truncate"
                >
                  <option value="ALL">All Companies</option>
                  {companies.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Area */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="size-3 text-slate-400" />
                  <span>Area</span>
                </label>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer truncate"
                >
                  <option value="ALL">All Areas</option>
                  {areas.map((ar) => (
                    <option key={ar} value={ar}>
                      {ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Department */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" />
                  <span>Department</span>
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer truncate"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Section */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Layers className="size-3 text-slate-400" />
                  <span>Section</span>
                </label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer truncate"
                >
                  <option value="ALL">All Sections</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Designation */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Briefcase className="size-3 text-slate-400" />
                  <span>Designation</span>
                </label>
                <select
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer truncate"
                >
                  <option value="ALL">All Designations</option>
                  {designations.map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Approval Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-slate-400" />
                  <span>Approval Status</span>
                </label>
                <select
                  value={approvalStatusFilter}
                  onChange={(e) => setApprovalStatusFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Approval Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* 10. Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-slate-400" />
                  <span>Status</span>
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="Active">Active / Running</option>
                  <option value="Fully Paid">Fully Paid</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Closed">Closed</option>
                </select>
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

            {/* ── Table with all columns ── */}
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
                      Company
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
                      Area
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
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-center text-blue-600 dark:text-blue-400">
                      PAID MONTHS
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-right">
                      MONTHLY RATE
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-right text-rose-600 dark:text-rose-400">
                      REMAINING BALANCE
                    </th>
                    <th className="px-4 py-3.5 border-r border-slate-100 dark:border-slate-800/80 text-center">
                      Approval Status
                    </th>
                    <th className="px-4 py-3.5 text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="px-4 py-16 text-center text-slate-400 text-sm font-semibold">
                        No loan records match selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((row, index) => {
                      const appStatus =
                        row.approvalStatus ||
                        (row.status === "Approved" || row.status === "Fully Paid" ? "Approved" : row.status);
                      
                      // Accurate, dynamic loan balance calculation
                      const calc = calculateLoanBalance(row);

                      return (
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

                          {/* Company */}
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                            {row.company || "Pakiza Software Limited"}
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

                          {/* Area */}
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                            {row.area || row.operationalDivision}
                          </td>

                          {/* REQUESTED AMOUNT */}
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                            ৳{row.requestedAmount.toLocaleString()}
                          </td>

                          {/* APPROVED AMOUNT */}
                          <td className="px-4 py-3 text-right font-mono font-extrabold text-blue-600 dark:text-blue-400 border-r border-slate-100 dark:border-slate-800">
                            {appStatus === "Approved" ? `৳${row.approvedAmount.toLocaleString()}` : "৳0"}
                          </td>

                          {/* INSTALLMENT TERM */}
                          <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {row.installmentTerm} Months
                          </td>

                          {/* PAID MONTHS */}
                          <td className="px-4 py-3 text-center font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                            {appStatus === "Approved" ? (
                              <span className="inline-flex items-center gap-1 font-bold">
                                <span className="text-blue-600 dark:text-blue-400">{calc.paidMonths}</span>
                                <span className="text-slate-400 font-normal">/ {row.installmentTerm} mo</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          {/* MONTHLY RATE */}
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                            ৳{row.monthlyRate.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                          </td>

                          {/* REMAINING BALANCE (CALCULATED: APPROVED AMOUNT - TOTAL REPAID) */}
                          <td className="px-4 py-3 text-right font-mono font-extrabold border-r border-slate-100 dark:border-slate-800">
                            {appStatus === "Approved" ? (
                              calc.remainingBalance === 0 || row.status === "Fully Paid" ? (
                                <span className="text-emerald-600 dark:text-emerald-400">৳0</span>
                              ) : (
                                <span className="text-rose-600 dark:text-rose-400">
                                  ৳{calc.remainingBalance.toLocaleString()}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 font-sans font-normal">-</span>
                            )}
                          </td>

                          {/* Approval Status */}
                          <td className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-800">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                appStatus === "Approved"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400"
                                  : appStatus === "Rejected"
                                  ? "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400"
                                  : "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400"
                              }`}
                            >
                              {appStatus}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                                row.status === "Fully Paid"
                                  ? "bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/20 dark:text-teal-400"
                                  : row.status === "Active" || row.status === "Approved"
                                  ? "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400"
                                  : row.status === "Closed" || row.status === "Rejected"
                                  ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                  : "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/40 text-xs font-bold text-slate-400">
              <div>
                Showing 1 to {filteredLoans.length} of {loans.length} records
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

        {/* ── MODAL: LOAN APPLICATION DETAILS ── */}
        <LoanApplicationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          loan={selectedLoan}
          onPrintPdf={(loan) => {
            handleOpenPrint(loan);
          }}
        />

        {/* ── SINGLE LOAN PRINT MODAL ── */}
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
            areaName: l.area || l.operationalDivision,
            joinDate: l.joinDate,
            expLoanAmount: l.requestedAmount,
            appLoanAmt: l.approvedAmount,
            installments: l.installmentTerm,
            installmentAmt: l.monthlyRate,
            reason: l.reason,
            status: l.status === "Fully Paid" ? "Approved" : (l.approvalStatus || (l.status as any)),
            applicationDate: l.applicationDate,
          }))}
        />
      </main>
    </div>
  );
}
export default LoanListPage;
