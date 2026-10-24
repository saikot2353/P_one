import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  ClipboardList,
  Search,
  FileText,
  Printer,
  FileDown,
  FileEdit,
  Banknote,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  User,
  Wallet,
  ArrowRight,
  UserCheck,
  MapPin,
  TrendingDown,
  Info
} from "lucide-react";
import {
  SingleLoanPrintModal,
  AllLoansPrintModal
} from "@/components/payroll/LoanPrintModals";

export const Route = createFileRoute("/loan-application")({
  head: () => ({
    meta: [
      { title: "Loan Application Workspace — CRIPTON" },
      { name: "description", content: "Apply for company advances, view active balances, and track approvals." },
    ],
  }),
  component: LoanApplicationPage,
});

interface LoanApplication {
  id: number;
  empId: string;
  empName: string;
  section: string;
  designation: string;
  unit: string;
  grade: string;
  basicSalary: number;
  grossSalary: number;
  areaName: string;
  joinDate: string;
  expLoanAmount: number;
  appLoanAmt: number;
  installments: number;
  installmentAmt: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  applicationDate: string;
  approvalFlow: {
    stage: string;
    status: "Approved" | "Pending" | "Rejected" | "Skipped";
    date: string;
    officer: string;
    comments?: string;
  }[];
}

const DEFAULT_LOANS: LoanApplication[] = [
  {
    id: 101,
    empId: "2018010173",
    empName: "Md. Golam Mowdud",
    section: "Inventory Management",
    designation: "Manager",
    unit: "Knit Dyeing",
    grade: "Office Executive",
    basicSalary: 42000,
    grossSalary: 65000,
    areaName: "PAL-Fabric Dyeing",
    joinDate: "01/02/2018",
    expLoanAmount: 50000,
    appLoanAmt: 50000,
    installments: 10,
    installmentAmt: 5000,
    reason: "Dear Sir, This loan is required for his wife's Cesarean (Baby Delivery) Surgery purpose.",
    status: "Approved",
    applicationDate: "2026-08-15",
    approvalFlow: [
      { stage: "Prepared By", status: "Approved", date: "2026-08-15", officer: "Khondokar Momenur Rahman" },
      { stage: "HOD Approved By", status: "Approved", date: "2026-08-16", officer: "Khondokar Momenur Rahman" },
      { stage: "HR Operations", status: "Approved", date: "2026-09-01", officer: "Md. Shafiul Alam" },
      { stage: "Approved By", status: "Approved", date: "2026-10-03", officer: "Rakibul Islam Khan" }
    ]
  },
  {
    id: 1,
    empId: "2023043910",
    empName: "Tahmid Afsar",
    section: "Software Development",
    designation: "Software Engineer",
    unit: "IT Division",
    grade: "Grade 3",
    basicSalary: 45000,
    grossSalary: 75000,
    areaName: "PSL-Operation",
    joinDate: "01/08/2023",
    expLoanAmount: 70000,
    appLoanAmt: 70000,
    installments: 10,
    installmentAmt: 7000,
    reason: "Medical treatment expenses for family member",
    status: "Approved",
    applicationDate: "2026-05-12",
    approvalFlow: [
      { stage: "Line Manager", status: "Approved", date: "2026-05-13", officer: "Ahsan Habib" },
      { stage: "HR Operations", status: "Approved", date: "2026-05-14", officer: "Jannatul Maowa" },
      { stage: "Finance Review", status: "Approved", date: "2026-05-15", officer: "Riazul Islam" }
    ]
  },
  {
    id: 2,
    empId: "2023046001",
    empName: "Sohanur Rahman Sohan",
    section: "Accounts & VAT",
    designation: "Executive",
    unit: "Finance Division",
    grade: "Grade 4",
    basicSalary: 30000,
    grossSalary: 50000,
    areaName: "PSL-Operation",
    joinDate: "15/02/2023",
    expLoanAmount: 86400,
    appLoanAmt: 0,
    installments: 12,
    installmentAmt: 7200,
    reason: "Home construction repair emergency",
    status: "Pending",
    applicationDate: "2026-07-18",
    approvalFlow: [
      { stage: "Line Manager", status: "Approved", date: "2026-07-19", officer: "Sajid Hasan" },
      { stage: "HR Operations", status: "Pending", date: "-", officer: "Jannatul Maowa" },
      { stage: "Finance Review", status: "Pending", date: "-", officer: "Riazul Islam" }
    ]
  },
  {
    id: 3,
    empId: "2024049326",
    empName: "Hanif Uddin",
    section: "Apps Infrastructure",
    designation: "Sr. Executive",
    unit: "IT Division",
    grade: "Grade 2",
    basicSalary: 36000,
    grossSalary: 60000,
    areaName: "PSL-Operation",
    joinDate: "10/11/2024",
    expLoanAmount: 50000,
    appLoanAmt: 0,
    installments: 8,
    installmentAmt: 6250,
    reason: "Educational admission fee submission",
    status: "Rejected",
    applicationDate: "2026-06-01",
    approvalFlow: [
      { stage: "Line Manager", status: "Rejected", date: "2026-06-03", officer: "Ahsan Habib", comments: "Outstanding advance exists" },
      { stage: "HR Operations", status: "Skipped", date: "-", officer: "-" },
      { stage: "Finance Review", status: "Skipped", date: "-", officer: "-" }
    ]
  }
];

// Mock database of employees to fetch details during loan setup
const LOOKUP_EMPLOYEES = [
  { empId: "2018010173", name: "Md. Golam Mowdud", section: "Inventory Management", designation: "Manager", unit: "Knit Dyeing", grade: "Office Executive", line: "Line-C", basicSalary: 42000, grossSalary: 65000, joiningDate: "01/02/2018", areaName: "PAL-Fabric Dyeing" },
  { empId: "2023043910", name: "Tahmid Afsar", section: "Software Development", designation: "Software Engineer", unit: "IT Division", grade: "Grade 3", line: "Line-A", basicSalary: 45000, grossSalary: 75000, joiningDate: "01/08/2023", areaName: "PSL-Operation" },
  { empId: "2023046001", name: "Sohanur Rahman Sohan", section: "Accounts & VAT", designation: "Executive", unit: "Finance Division", grade: "Grade 4", line: "Line-B", basicSalary: 30000, grossSalary: 50000, joiningDate: "15/02/2023", areaName: "PSL-Operation" },
  { empId: "2024049326", name: "Hanif Uddin", section: "Apps Infrastructure", designation: "Sr. Executive", unit: "IT Division", grade: "Grade 2", line: "N/A", basicSalary: 36000, grossSalary: 60000, joiningDate: "10/11/2024", areaName: "PSL-Operation" },
  { empId: "2023043021", name: "Easin Mia", section: "Admin Support", designation: "Receptionist", unit: "Admin Division", grade: "Grade 5", line: "N/A", basicSalary: 15000, grossSalary: 25000, joiningDate: "05/04/2023", areaName: "PSL-Operation" }
];

function LoanApplicationPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loans, setLoans] = useState<LoanApplication[]>(DEFAULT_LOANS);

  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [viewingLoan, setViewingLoan] = useState<LoanApplication | null>(null);

  // Print Modals State
  const [selectedPrintLoan, setSelectedPrintLoan] = useState<LoanApplication | null>(null);
  const [isSinglePrintOpen, setIsSinglePrintOpen] = useState(false);
  const [isAllLoansPrintOpen, setIsAllLoansPrintOpen] = useState(false);

  // Form State
  const [empIdInput, setEmpIdInput] = useState("");
  const [empDetails, setEmpDetails] = useState<any>(null);
  
  // Application details
  const [expectedAmount, setExpectedAmount] = useState("");
  const [installments, setInstallments] = useState("12");
  const [loanReason, setLoanReason] = useState("");

  // Filters State
  const [filterEmpId, setFilterEmpId] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab control in Loan View dialog: "summary" | "amortization"
  const [viewDialogTab, setViewDialogTab] = useState<"summary" | "amortization">("summary");

  // Load persistence layers safely
  useEffect(() => {
    const stored = localStorage.getItem("payroll_loan_applications");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasImageLoan = parsed.some((p: any) => p.empId === "2018010173");
          if (!hasImageLoan) {
            setLoans([...DEFAULT_LOANS.slice(0, 1), ...parsed]);
          } else {
            setLoans(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load loan applications from localStorage", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("payroll_loan_applications", JSON.stringify(loans));
    }
  }, [loans, isMounted]);

  // Support direct URL query triggers e.g. /loan-application?print=single or ?print=all
  useEffect(() => {
    if (typeof window !== "undefined" && isMounted && loans.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const printParam = params.get("print") || params.get("view");
      if (printParam === "single" || printParam === "application" || printParam === "form") {
        const found = loans.find(l => l.empId === "2018010173") || loans[0];
        setSelectedPrintLoan(found);
        setIsSinglePrintOpen(true);
      } else if (printParam === "all" || printParam === "list" || printParam === "pdf") {
        setIsAllLoansPrintOpen(true);
      }
    }
  }, [isMounted, loans]);

  // Export CSV handler for Excel
  const handleExportExcel = () => {
    if (filteredLoans.length === 0) {
      alert("No loan records to export.");
      return;
    }
    const headers = ["SL", "Loan Date", "Employee Name", "Loan ID", "Amount", "Remarks"];
    const rows = filteredLoans.map((l, idx) => [
      idx + 1,
      l.applicationDate,
      `"${l.empName.replace(/"/g, '""')}"`,
      `"LN-${String(l.id).padStart(4, "0")}"`,
      l.status === "Approved" ? l.appLoanAmt : l.expLoanAmount,
      `"${(l.reason || "").replace(/"/g, '""')} [${l.status}]"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `All_Loans_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived calculation
  const calculatedInstallmentAmt = useMemo(() => {
    const amt = Number(expectedAmount) || 0;
    const months = Number(installments) || 1;
    return Math.round(amt / months);
  }, [expectedAmount, installments]);

  const handleFetchData = () => {
    setIsDataLoaded(true);
  };

  const handleSearchEmployee = () => {
    const found = LOOKUP_EMPLOYEES.find(e => e.empId.trim() === empIdInput.trim());
    if (found) {
      setEmpDetails(found);
    } else {
      alert("Employee ID not found. Try searching: 2023043910, 2023046001 or 2024049326");
      setEmpDetails(null);
    }
  };

  const handleSubmitApplication = () => {
    if (!empDetails) return;
    if (!expectedAmount || Number(expectedAmount) <= 0) {
      alert("Please enter a valid loan amount.");
      return;
    }

    const newLoan: LoanApplication = {
      id: Date.now(),
      empId: empDetails.empId,
      empName: empDetails.name,
      section: empDetails.section,
      designation: empDetails.designation,
      unit: empDetails.unit,
      grade: empDetails.grade,
      basicSalary: empDetails.basicSalary,
      grossSalary: empDetails.grossSalary,
      areaName: empDetails.areaName,
      joinDate: empDetails.joiningDate,
      expLoanAmount: Number(expectedAmount),
      appLoanAmt: 0,
      installments: Number(installments),
      installmentAmt: calculatedInstallmentAmt,
      reason: loanReason || "Personal application",
      status: "Pending",
      applicationDate: new Date().toISOString().split("T")[0],
      approvalFlow: [
        { stage: "Line Manager", status: "Approved", date: new Date().toISOString().split("T")[0], officer: "Supervisor Admin" },
        { stage: "HR Operations", status: "Pending", date: "-", officer: "Jannatul Maowa" },
        { stage: "Finance Review", status: "Pending", date: "-", officer: "Riazul Islam" }
      ]
    };

    setLoans([newLoan, ...loans]);
    setIsApplyModalOpen(false);
    
    // reset form fields
    setEmpDetails(null);
    setEmpIdInput("");
    setExpectedAmount("");
    setInstallments("12");
    setLoanReason("");
  };

  // Perform filtering
  const filteredLoans = loans.filter((l) => {
    const matchesSearch = 
      l.empName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.empId.includes(searchQuery);
    
    const matchesFilterId = filterEmpId.trim() === "" || l.empId.includes(filterEmpId.trim());
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus;

    return matchesSearch && matchesFilterId && matchesStatus;
  });

  // Calculate monthly amortization list for details preview
  const generateAmortizationList = (loan: LoanApplication) => {
    const result = [];
    let remaining = loan.status === "Approved" ? loan.appLoanAmt : loan.expLoanAmount;
    const step = loan.installmentAmt;
    const startDate = new Date(loan.applicationDate);

    for (let i = 1; i <= loan.installments; i++) {
      startDate.setMonth(startDate.getMonth() + 1);
      const repaymentPeriod = startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const currentPay = Math.min(step, remaining);
      remaining -= currentPay;
      result.push({
        installmentNo: i,
        period: repaymentPeriod,
        payment: currentPay,
        balance: Math.max(0, remaining)
      });
    }
    return result;
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-5 md:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-300" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="text-slate-600">Loan Applications</span>
          </div>

          {/* Header Card with Gradient */}
          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-rose-50/30 rounded-full blur-2xl -z-10 translate-y-1/2" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  <Wallet className="size-3.5" />
                  Loan & Advances
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                  Loan Application Directory
                </h1>
                <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
                  Submit company loan applications, track real-time approval pipelines (Line Manager, HR, and Finance Reviews), and preview monthly amortization schedules.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Direct Single Loan Print Preview Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    const sample = loans.find(l => l.empId === "2018010173") || loans[0];
                    setSelectedPrintLoan(sample);
                    setIsSinglePrintOpen(true);
                  }}
                  className="h-11 px-4 rounded-xl border-emerald-200 text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  title="Preview Single Loan Application Print Layout (Pakiza Apparels)"
                >
                  <Printer className="size-4 text-emerald-600" />
                  <span>Loan Application Print</span>
                </Button>

                {/* Direct All Loans PDF Print Preview Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-11 px-4 rounded-xl border-rose-200 text-rose-800 bg-rose-50/70 hover:bg-rose-100 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  title="Preview All Loans List PDF Print Layout (SL, Name, Date, Amount, Remarks)"
                >
                  <FileText className="size-4 text-rose-600" />
                  <span>All Loans PDF Print</span>
                </Button>

                {/* Apply Loan Modal Button */}
                <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                  <Button
                    onClick={() => {
                      setEmpDetails(null);
                      setEmpIdInput("");
                      setExpectedAmount("");
                      setInstallments("12");
                      setLoanReason("");
                      setIsApplyModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs"
                  >
                    <Plus className="size-4" />
                    APPLY FOR LOAN
                  </Button>

                  <DialogContent className="sm:max-w-3xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-xs">
                          <FileEdit className="size-5" />
                        </div>
                        <div>
                          <DialogTitle className="text-lg font-extrabold text-slate-800">
                            Apply for Company Loan
                          </DialogTitle>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">Verify employee records and fill out loan repayment parameters.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-5 max-h-[65vh] overflow-y-auto bg-slate-50/40 space-y-6">
                      {/* Lookup Section */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Employee Lookup</span>
                        <div className="flex items-end gap-3 max-w-md">
                          <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-bold text-slate-500 block">Employee ID <span className="text-rose-500">*</span></label>
                            <input
                              type="text"
                              value={empIdInput}
                              onChange={(e) => setEmpIdInput(e.target.value)}
                              placeholder="e.g. 2023043910"
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300 font-semibold"
                            />
                          </div>
                          <Button
                            onClick={handleSearchEmployee}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-10 px-5 rounded-xl cursor-pointer"
                          >
                            Fetch Profile
                          </Button>
                        </div>
                      </div>

                      {/* Employee Details Profile Cards */}
                      {empDetails && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Employee Profile</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[
                              { label: "Name", value: empDetails.name },
                              { label: "Designation", value: empDetails.designation },
                              { label: "Department", value: empDetails.section },
                              { label: "Joining Date", value: empDetails.joiningDate },
                              { label: "Grade", value: empDetails.grade },
                              { label: "Area", value: empDetails.areaName },
                              { label: "Basic Salary", value: `৳${empDetails.basicSalary.toLocaleString()}` },
                              { label: "Gross Salary", value: `৳${empDetails.grossSalary.toLocaleString()}` },
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{item.label}</span>
                                <div className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-2.5 truncate">
                                  {item.value || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Loan Repay Specifications */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Repayment parameters</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 block">Requested Amount (৳)</label>
                            <input
                              type="number"
                              disabled={!empDetails}
                              placeholder="e.g. 60000"
                              value={expectedAmount}
                              onChange={(e) => setExpectedAmount(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 font-extrabold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-55 disabled:bg-slate-50 font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 block">Repayment Term (Months)</label>
                            <select
                              disabled={!empDetails}
                              value={installments}
                              onChange={(e) => setInstallments(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer disabled:opacity-55 disabled:bg-slate-50 font-sans"
                            >
                              <option value="3">3 Months</option>
                              <option value="6">6 Months</option>
                              <option value="8">8 Months</option>
                              <option value="10">10 Months</option>
                              <option value="12">12 Months</option>
                              <option value="18">18 Months</option>
                              <option value="24">24 Months</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 block">Monthly Repay Rate</label>
                            <div className="h-10 flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-extrabold text-blue-600 font-mono">
                              ৳{calculatedInstallmentAmt.toLocaleString()}
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                            <label className="text-xs font-bold text-slate-500 block">Purpose of Loan</label>
                            <textarea
                              disabled={!empDetails}
                              placeholder="Describe the application reason..."
                              rows={2.5}
                              value={loanReason}
                              onChange={(e) => setLoanReason(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all resize-none disabled:opacity-55 disabled:bg-slate-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-2.5">
                      <Button
                        variant="ghost"
                        className="text-slate-600 font-bold px-4 rounded-xl hover:bg-slate-100 h-10 select-none text-xs cursor-pointer"
                        onClick={() => setIsApplyModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!empDetails}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md h-10 px-6 rounded-xl flex items-center gap-2 select-none text-xs cursor-pointer disabled:opacity-50"
                        onClick={handleSubmitApplication}
                      >
                        Submit Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Inline Search Filters */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="space-y-1.5 w-full md:w-64">
                  <label className="text-xs font-bold text-slate-500 block">Employee ID</label>
                  <input
                    type="text"
                    placeholder="Search by ID..."
                    value={filterEmpId}
                    onChange={(e) => setFilterEmpId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5 w-full md:w-48">
                  <label className="text-xs font-bold text-slate-500 block">Status Filter</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all cursor-pointer font-sans"
                  >
                    <option value="ALL">All Applications</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <Button
                  variant="default"
                  className="h-10 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 shadow-xs w-full md:w-auto cursor-pointer"
                  onClick={handleFetchData}
                >
                  <Search className="size-4 mr-2" />
                  SEARCH HISTORY
                </Button>
              </div>
            </div>
          </div>

          {/* Main Interface Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {/* Action buttons bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex bg-slate-100/80 border border-slate-200/50 rounded-xl p-1 w-fit shadow-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportExcel}
                  className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export Filtered Loans to Excel CSV"
                >
                  <FileDown className="size-4 text-emerald-600" />
                  EXCEL
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Print All Loans Summary List"
                >
                  <Printer className="size-4 text-blue-600" />
                  PRINT
                </Button>
                <div className="w-px bg-slate-200 my-1.5" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAllLoansPrintOpen(true)}
                  className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Export All Loans List as PDF"
                >
                  <FileText className="size-4 text-rose-600" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-450"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 p-0 overflow-auto bg-white">
              {!isDataLoaded ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200 shadow-xs text-slate-400">
                    <Search className="size-5" />
                  </div>
                  <p className="text-xs font-bold">
                    Click <span className="text-blue-600 font-extrabold">SEARCH HISTORY</span> to fetch entries.
                  </p>
                </div>
              ) : (
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 bg-slate-50/50 border-b border-slate-200/80">
                        <tr>
                          <th className="px-4 py-3.5 border-r border-slate-100 text-center w-12">Sl</th>
                          <th className="px-4 py-3.5 border-r border-slate-100 text-center w-24">Actions</th>
                          <th className="px-4 py-3.5 border-r border-slate-100">Emp Id</th>
                          <th className="px-4 py-3.5 border-r border-slate-100">Employee Name</th>
                          <th className="px-4 py-3.5 border-r border-slate-100">Area Name</th>
                          <th className="px-4 py-3.5 border-r border-slate-100">Join Date</th>
                          <th className="px-4 py-3.5 border-r border-slate-100 text-right">Requested Amt</th>
                          <th className="px-4 py-3.5 border-r border-slate-100 text-right">Approved Amt</th>
                          <th className="px-4 py-3.5 border-r border-slate-100 text-center">Approved Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredLoans.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-4 py-16 text-center text-slate-400 text-sm font-semibold">
                              No loan records match selected filters.
                            </td>
                          </tr>
                        ) : (
                          filteredLoans.map((row, index) => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-4 py-3 text-slate-400 text-center border-r border-slate-100 font-bold">{index + 1}</td>
                              <td className="px-4 py-3 text-center border-r border-slate-100">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setViewingLoan(row);
                                      setViewDialogTab("summary");
                                    }}
                                    className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer shadow-xs"
                                    title="View Loan Details"
                                  >
                                    <Search className="size-3.5" strokeWidth={2.5} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedPrintLoan(row);
                                      setIsSinglePrintOpen(true);
                                    }}
                                    className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
                                    title="Print Loan Application Form (Pakiza Format)"
                                  >
                                    <Printer className="size-3.5" strokeWidth={2.5} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-700 border-r border-slate-100">{row.empId}</td>
                              <td className="px-4 py-3 font-bold text-slate-800 border-r border-slate-100 group-hover:text-blue-600 transition-colors">{row.empName}</td>
                              <td className="px-4 py-3 text-slate-600 border-r border-slate-100">{row.areaName}</td>
                              <td className="px-4 py-3 text-slate-600 border-r border-slate-100">{row.joinDate}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 border-r border-slate-100">
                                ৳{row.expLoanAmount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 border-r border-slate-100">
                                {row.status === "Approved" ? `৳${row.appLoanAmt.toLocaleString()}` : "৳0"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                                  row.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                                    : row.status === "Rejected"
                                    ? "bg-rose-50 text-rose-600 border-rose-200/50"
                                    : "bg-amber-50 text-amber-600 border-amber-200/50"
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 text-xs font-bold text-slate-400">
                    <div>
                      Showing 1 to {filteredLoans.length} of {filteredLoans.length} entries
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold text-slate-400 bg-white border-slate-200 hover:bg-slate-50 rounded-xl" disabled>Previous</Button>
                      <Button variant="default" size="sm" className="h-9 w-9 p-0 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">1</Button>
                      <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold text-slate-400 bg-white border-slate-200 hover:bg-slate-50 rounded-xl" disabled>Next</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS VIEW DIALOG */}
        <Dialog open={viewingLoan !== null} onOpenChange={(open) => {
          if (!open) setViewingLoan(null);
        }}>
          {viewingLoan && (
            <DialogContent className="sm:max-w-4xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-xs">
                    <ClipboardList className="size-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-extrabold text-slate-800">
                      Loan details — ID: {viewingLoan.empId}
                    </DialogTitle>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Verify employee information, approval flow timelines, and repayment projections.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-full border uppercase ${
                    viewingLoan.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                      : viewingLoan.status === "Rejected"
                      ? "bg-rose-50 text-rose-600 border-rose-200/50"
                      : "bg-amber-50 text-amber-600 border-amber-200/50"
                  }`}>
                    {viewingLoan.status}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs Bar inside dialog */}
              <div className="px-6 pt-4 bg-white border-b border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewDialogTab("summary")}
                  className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 select-none cursor-pointer ${
                    viewDialogTab === "summary"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <User className="size-4" />
                  1. Loan Summary & Flow
                </button>
                <button
                  type="button"
                  onClick={() => setViewDialogTab("amortization")}
                  className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 select-none cursor-pointer ${
                    viewDialogTab === "amortization"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Calendar className="size-4" />
                  2. Amortization Schedule
                </button>
              </div>

              {/* Scrollable dialog content */}
              <div className="px-6 py-5 max-h-[60vh] overflow-y-auto bg-slate-50/40">
                {viewDialogTab === "summary" ? (
                  <div className="space-y-6">
                    {/* Grid of Profile Metadata */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Employee Information</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Employee Name", value: viewingLoan.empName },
                          { label: "ID Code", value: viewingLoan.empId },
                          { label: "Designation", value: viewingLoan.designation },
                          { label: "Department", value: viewingLoan.section },
                          { label: "Operational Division", value: viewingLoan.unit },
                          { label: "Joining Date", value: viewingLoan.joinDate },
                          { label: "Basic salary", value: `৳${viewingLoan.basicSalary.toLocaleString()}` },
                          { label: "Gross salary", value: `৳${viewingLoan.grossSalary.toLocaleString()}` }
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{item.label}</span>
                            <div className="text-xs font-bold text-slate-700 truncate">{item.value || "-"}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Terms stats */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Loan terms & Repayments</span>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Requested Amount</span>
                          <span className="text-base font-extrabold text-slate-800 font-mono mt-1 block">৳{viewingLoan.expLoanAmount.toLocaleString()}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100/30 text-center">
                          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Approved Amount</span>
                          <span className="text-base font-extrabold text-blue-600 font-mono mt-1 block">
                            {viewingLoan.status === "Approved" ? `৳${viewingLoan.appLoanAmt.toLocaleString()}` : "৳0"}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Installment Term</span>
                          <span className="text-base font-extrabold text-slate-800 mt-1 block">{viewingLoan.installments} Months</span>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-100/30 text-center">
                          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block">Monthly Rate</span>
                          <span className="text-base font-extrabold text-indigo-600 font-mono mt-1 block">৳{viewingLoan.installmentAmt.toLocaleString()}/mo</span>
                        </div>
                      </div>

                      <div className="space-y-1 bg-slate-50/40 p-4 rounded-xl border border-slate-150">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loan Application Reason</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{viewingLoan.reason}"</p>
                      </div>
                    </div>

                    {/* Timeline Tracker flow */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Approval Flow Timeline</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {viewingLoan.approvalFlow.map((stage, idx) => (
                          <div key={idx} className="relative flex items-start gap-3.5 bg-slate-50/40 p-4 rounded-xl border border-slate-200/40">
                            <div className="mt-0.5 shrink-0">
                              {stage.status === "Approved" ? (
                                <div className="p-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                                  <CheckCircle2 className="size-4" />
                                </div>
                              ) : stage.status === "Rejected" ? (
                                <div className="p-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600">
                                  <XCircle className="size-4" />
                                </div>
                              ) : stage.status === "Skipped" ? (
                                <div className="p-1 rounded-full bg-slate-100 border border-slate-200 text-slate-400">
                                  <AlertCircle className="size-4" />
                                </div>
                              ) : (
                                <div className="p-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                                  <Clock className="size-4" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Stage {idx + 1}: {stage.stage}</span>
                              <span className="text-xs font-bold text-slate-700 block">{stage.officer || "System Auditor"}</span>
                              <span className="text-[10px] text-slate-400 block">Status: {stage.status} • {stage.date}</span>
                              {stage.comments && (
                                <p className="text-[10px] text-rose-600 font-semibold mt-1">Note: {stage.comments}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Amortization Projection schedule */
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs space-y-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Repayment Projections</span>
                      <p className="text-xs text-slate-500">Estimates of monthly deductions from employee base salary starting from application period.</p>
                      
                      <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-100/50 p-3 rounded-xl text-blue-800 text-xs font-semibold mt-2.5">
                        <Info className="size-4 shrink-0 text-blue-600" />
                        <span>Calculations assume zero percent company interest. Installments are deducted automatically during monthly process execution.</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="text-[10px] font-bold tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100 uppercase">
                          <tr>
                            <th className="px-4 py-3 text-center w-16">Installment</th>
                            <th className="px-4 py-3">Scheduled Period</th>
                            <th className="px-4 py-3 text-right">Repayment Amount</th>
                            <th className="px-4 py-3 text-right pr-6">Remaining Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {generateAmortizationList(viewingLoan).map((row) => (
                            <tr key={row.installmentNo} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-bold text-slate-400 text-center">{row.installmentNo}</td>
                              <td className="px-4 py-3 font-semibold text-slate-700">{row.period}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-blue-600">৳{row.payment.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right pr-6 font-mono font-bold text-slate-700">৳{row.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <Button
                  variant="outline"
                  className="h-10 px-5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setSelectedPrintLoan(viewingLoan);
                    setIsSinglePrintOpen(true);
                  }}
                  title="Print Official Pakiza Loan Application Form"
                >
                  <Printer className="size-4 text-blue-600" />
                  Print Loan Application Form
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl text-xs cursor-pointer"
                  onClick={() => setViewingLoan(null)}
                >
                  Close View
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* ── SINGLE LOAN APPLICATION PRINT MODAL (PAKIZA OFFICIAL A4 FORMAT) ── */}
        <SingleLoanPrintModal
          isOpen={isSinglePrintOpen}
          onClose={() => setIsSinglePrintOpen(false)}
          loan={selectedPrintLoan}
        />

        {/* ── ALL LOANS LIST PDF PRINT MODAL (SL, EMPLOYEES NAME, LOAN DATE, AMOUNT, REMARKS) ── */}
        <AllLoansPrintModal
          isOpen={isAllLoansPrintOpen}
          onClose={() => setIsAllLoansPrintOpen(false)}
          loans={filteredLoans}
        />
      </main>
    </div>
  );
}
