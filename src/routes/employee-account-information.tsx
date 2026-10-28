import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  ChevronDown,
  X,
  AlertCircle,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee-account-information")({
  head: () => ({
    meta: [
      { title: "Employee Account Information — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage employee bank account information, disbursement modes, and bulk bank account allocations.",
      },
    ],
  }),
  component: EmployeeAccountInformationPage,
});

export interface EmployeeAccountRecord {
  id: string;
  sl: number;
  empId: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  bankName: string;
  accountNo: string;
  bankPayment: number;
  cashPayment: number;
  taxAmount: number;
  company?: string;
  areaName?: string;
  employeeType?: string;
  unit?: string;
  line?: string;
  status?: string;
}

const INITIAL_EMPLOYEES: EmployeeAccountRecord[] = [
  {
    id: "emp-1",
    sl: 1,
    empId: "2026062078",
    name: "MD. HASANUR RAHMAN",
    designation: "Asst. Manager",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "171.108.0834108",
    bankPayment: 38000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-2",
    sl: 2,
    empId: "2026062057",
    name: "Masud Rana",
    designation: "Driver",
    department: "HR, Admin and Compliance",
    section: "Admin",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "171.108.0838572",
    bankPayment: 0,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-3",
    sl: 3,
    empId: "2026062074",
    name: "Ruhul Amin",
    designation: "Manager",
    department: "Implementation & Business Analysis",
    section: "Business Analysis",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "107.108.0818854",
    bankPayment: 55000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-4",
    sl: 4,
    empId: "2026062068",
    name: "SALMAN RAHMAN",
    designation: "Executive",
    department: "Implementation & Business Analysis",
    section: "",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "276.158.0418621",
    bankPayment: 30000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-5",
    sl: 5,
    empId: "2026061937",
    name: "Md. Jahidul Islam",
    designation: "Executive",
    department: "Implementation & Business Analysis",
    section: "HR Team (Implementation)",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "171.103.0834094",
    bankPayment: 35000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-6",
    sl: 6,
    empId: "2021023079",
    name: "Md. Monjur Alam",
    designation: "Driver",
    department: "HR, Admin and Compliance",
    section: "Admin",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0195130",
    bankPayment: 0,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-7",
    sl: 7,
    empId: "2025054710",
    name: "Raihan Jami Khan",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0457353",
    bankPayment: 25000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-8",
    sl: 8,
    empId: "2025057068",
    name: "Riazul Islam",
    designation: "Asst. Manager",
    department: "Implementation & Business Analysis",
    section: "Accounts & Vat",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0675004",
    bankPayment: 36400,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-9",
    sl: 9,
    empId: "2023043974",
    name: "Md. Anwar Hossain",
    designation: "Asst. Manager",
    department: "Core Development",
    section: "Merchandising-Purchase-MCD",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0262112",
    bankPayment: 37128,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-10",
    sl: 10,
    empId: "2026059284",
    name: "Istiak Ahmed",
    designation: "Office Boy",
    department: "HR, Admin and Compliance",
    section: "Admin",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.103.0199946",
    bankPayment: 12000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-11",
    sl: 11,
    empId: "2024049166",
    name: "Md Maimoon Hossain Shomoy",
    designation: "Sr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0271342",
    bankPayment: 32760,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-12",
    sl: 12,
    empId: "2026059573",
    name: "Md. Piyash Hasan",
    designation: "Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "125.105.52631",
    bankPayment: 26000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-13",
    sl: 13,
    empId: "2023046001",
    name: "Sohanur Rahman Sohan",
    designation: "Executive",
    department: "HR, Admin and Compliance",
    section: "Admin",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0262908",
    bankPayment: 27000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-14",
    sl: 14,
    empId: "2026060310",
    name: "Md. Shahid Hasan",
    designation: "Sr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "300.105.0001762",
    bankPayment: 31200,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-15",
    sl: 15,
    empId: "2026059418",
    name: "Md Robayet Hasan Yeasin",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0798441",
    bankPayment: 30000,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-16",
    sl: 16,
    empId: "2023043910",
    name: "Tahmid Afsar Shapno",
    designation: "Asst. Manager",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    bankName: "Dutch Bangla Bank Limited",
    accountNo: "171.108.0991201",
    bankPayment: 91200,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
  {
    id: "emp-17",
    sl: 17,
    empId: "2025054609",
    name: "Md Mahir Shahriyar",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    bankName: "Dutch-Bangla Bank Ltd.",
    accountNo: "171.108.0554210",
    bankPayment: 28500,
    cashPayment: 0,
    taxAmount: 0,
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
  },
];

const AVAILABLE_BANKS = [
  "Dutch Bangla Bank Limited",
  "Dutch-Bangla Bank Ltd.",
  "BRAC Bank PLC",
  "Islami Bank Bangladesh Ltd.",
  "The City Bank Limited",
  "Eastern Bank Limited",
  "Mutual Trust Bank",
  "Prime Bank Limited",
  "Southeast Bank Limited",
  "Standard Chartered Bank",
  "Sonali Bank PLC",
  "Janata Bank Limited",
];

function EmployeeAccountInformationPage() {
  // Main Data State
  const [employees, setEmployees] = useState<EmployeeAccountRecord[]>(INITIAL_EMPLOYEES);

  // Top Filter States (matching screenshot)
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [areaName, setAreaName] = useState("PSL -Operation");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [employmentStatus, setEmploymentStatus] = useState("Working");
  const [employeeIdSearch, setEmployeeIdSearch] = useState("");

  // Table Search State
  const [tableSearch, setTableSearch] = useState("");


  // Handle Search button click
  const handleTopSearch = () => {
    toast.success(`Search executed successfully! Showing matching employee records.`);
  };

  // Handle Reset button click
  const handleTopReset = () => {
    setCompany("Pakiza Software Limited");
    setAreaName("PSL -Operation");
    setEmployeeType("ALL");
    setDepartment("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setEmploymentStatus("Working");
    setEmployeeIdSearch("");
    setTableSearch("");
    toast.info("Filter criteria reset to default.");
  };

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((item) => {
      // 1. Company
      if (company !== "ALL" && item.company && item.company !== company) return false;
      // 2. Area Name
      if (areaName !== "ALL" && item.areaName && item.areaName !== areaName) return false;
      // 3. Employee Type
      if (employeeType !== "ALL" && item.employeeType && item.employeeType !== employeeType)
        return false;
      // 4. Department
      if (department !== "ALL" && item.department !== department) return false;
      // 5. Section
      if (section !== "ALL" && item.section !== section) return false;
      // 6. Designation
      if (designation !== "ALL" && item.designation !== designation) return false;
      // 7. Unit
      if (unit !== "ALL" && item.unit && item.unit !== unit) return false;
      // 8. Line
      if (line !== "ALL" && item.line && item.line !== line) return false;
      // 9. Employment Status
      if (employmentStatus !== "ALL" && item.status && item.status !== employmentStatus)
        return false;

      // 10. Employee ID search (comma-separated support)
      if (employeeIdSearch.trim() !== "") {
        const ids = employeeIdSearch
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0) {
          const match = ids.some((searchId) => item.empId.toLowerCase().includes(searchId));
          if (!match) return false;
        }
      }

      // 11. Quick table search
      if (tableSearch.trim() !== "") {
        const query = tableSearch.toLowerCase().trim();
        const matchesQuery =
          item.empId.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.bankName.toLowerCase().includes(query) ||
          item.accountNo.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [
    employees,
    company,
    areaName,
    employeeType,
    department,
    section,
    designation,
    unit,
    line,
    employmentStatus,
    employeeIdSearch,
    tableSearch,
  ]);



  // Export to Excel / CSV
  const handleExportExcel = () => {
    if (filteredEmployees.length === 0) {
      toast.error("No employee account records available to export.");
      return;
    }

    const headers = [
      "SL",
      "EMP ID",
      "NAME",
      "DESIGNATION",
      "DEPARTMENT",
      "SECTION",
      "BANK NAME",
      "ACCOUNT NO",
      "BANK PAYMENT",
      "CASH PAYMENT",
      "TAX AMOUNT",
    ];

    const csvRows = filteredEmployees.map((emp, index) => [
      index + 1,
      `"${emp.empId}"`,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.designation.replace(/"/g, '""')}"`,
      `"${emp.department.replace(/"/g, '""')}"`,
      `"${emp.section.replace(/"/g, '""')}"`,
      `"${emp.bankName.replace(/"/g, '""')}"`,
      `"${emp.accountNo}"`,
      emp.bankPayment,
      emp.cashPayment,
      emp.taxAmount,
    ]);

    const csvContent = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Employee_Account_Information_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Excel CSV report generated and downloaded successfully!");
  };



  return (
    <div className="flex h-screen bg-[#f4f6fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-w-[1780px] mx-auto w-full">
          {/* Breadcrumb Navigation - Exact match to image: Home > Personnel Info > Employee Account Information */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/personnel-list" className="hover:text-blue-600 transition-colors">
              Personnel Info
            </Link>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Employee Account Information
            </span>
          </div>

          {/* Top Filter Card - Exact replica of the screenshot layout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Row 1: Company, Area Name, Employee Type, Department, Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              {/* 1. COMPANY */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  COMPANY
                </label>
                <div className="relative">
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                    <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                    <option value="Pakiza Apparels Ltd">Pakiza Apparels Ltd</option>
                    <option value="Pakiza Spinning Mills">Pakiza Spinning Mills</option>
                    <option value="ALL">All Companies</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. AREA NAME */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  AREA NAME
                </label>
                <div className="relative">
                  <select
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="PSL -Operation">PSL -Operation</option>
                    <option value="Head Office">Head Office</option>
                    <option value="Factory Unit 1">Factory Unit 1</option>
                    <option value="Factory Unit 2">Factory Unit 2</option>
                    <option value="ALL">All Areas</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 3. EMPLOYEE TYPE */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  EMPLOYEE TYPE
                </label>
                <div className="relative">
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Employee Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contractual">Contractual</option>
                    <option value="Probationary">Probationary</option>
                    <option value="Trainee">Trainee</option>
                    <option value="Casual">Casual</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 4. DEPARTMENT */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  DEPARTMENT
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Department</option>
                    <option value="Implementation & Business Analysis">
                      Implementation & Business Analysis
                    </option>
                    <option value="HR, Admin and Compliance">HR, Admin and Compliance</option>
                    <option value="Business Innovation">Business Innovation</option>
                    <option value="Core Development">Core Development</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 5. SECTION */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  SECTION
                </label>
                <div className="relative">
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Section</option>
                    <option value="ERP Team">ERP Team</option>
                    <option value="Admin">Admin</option>
                    <option value="Business Analysis">Business Analysis</option>
                    <option value="HR Team (Implementation)">HR Team (Implementation)</option>
                    <option value="WEB-Team">WEB-Team</option>
                    <option value="Accounts & Vat">Accounts & Vat</option>
                    <option value="Merchandising-Purchase-MCD">Merchandising-Purchase-MCD</option>
                    <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Designation, Unit, Line, Employment Status, Employee ID Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              {/* 6. DESIGNATION */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  DESIGNATION
                </label>
                <div className="relative">
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Designation</option>
                    <option value="Manager">Manager</option>
                    <option value="Asst. Manager">Asst. Manager</option>
                    <option value="Sr. Executive">Sr. Executive</option>
                    <option value="Executive">Executive</option>
                    <option value="Jr. Executive">Jr. Executive</option>
                    <option value="Officer">Officer</option>
                    <option value="Driver">Driver</option>
                    <option value="Office Boy">Office Boy</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 7. UNIT */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  UNIT
                </label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Unit</option>
                    <option value="PSL Unit-1">PSL Unit-1</option>
                    <option value="PSL Unit-2">PSL Unit-2</option>
                    <option value="PKG Unit">PKG Unit</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 8. LINE */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  LINE
                </label>
                <div className="relative">
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Select Line</option>
                    <option value="Line-01">Line-01</option>
                    <option value="Line-02">Line-02</option>
                    <option value="Line-03">Line-03</option>
                    <option value="N/A">N/A</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 9. EMPLOYMENT STATUS */}
              <div className="space-y-1">
                <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300 block">
                  EMPLOYMENT STATUS
                </label>
                <div className="relative">
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="Working">Working</option>
                    <option value="Probation">Probation</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="ALL">All Status</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 10. EMPLOYEE ID SEARCH */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300">
                    EMPLOYEE ID SEARCH
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium italic">
                    use comma as separator
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={employeeIdSearch}
                    onChange={(e) => setEmployeeIdSearch(e.target.value)}
                    placeholder="Enter Employee ID.."
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Search Button & Reset Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTopSearch}
                className="h-9 px-6 bg-[#1e60f2] hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Search className="size-3.5 stroke-[2.5]" />
                <span>SEARCH</span>
              </button>

              <button
                type="button"
                onClick={handleTopReset}
                title="Reset Filters"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Action & Search Bar (Exact matches screenshot + requested "Add Bulk Employee Account" button) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:px-4 sm:py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Quick search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search by ID, name, bank, account.."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
              />
              {tableSearch && (
                <button
                  onClick={() => setTableSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              {/* Excel Button - Exact style from image */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="h-9 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>EXCEL</span>
              </button>
            </div>
          </div>

          {/* Table Container - Exact column match to screenshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850/60 text-slate-700 dark:text-slate-300 font-bold text-[11px] tracking-wider uppercase">
                    <th className="py-3 px-3.5 text-center w-12 font-bold">SL</th>
                    <th className="py-3 px-3.5 font-bold">EMP ID</th>
                    <th className="py-3 px-3.5 font-bold">NAME</th>
                    <th className="py-3 px-3.5 font-bold">DESIGNATION</th>
                    <th className="py-3 px-3.5 font-bold">DEPARTMENT</th>
                    <th className="py-3 px-3.5 font-bold">SECTION</th>
                    <th className="py-3 px-3.5 font-bold">BANK NAME</th>
                    <th className="py-3 px-3.5 font-bold">ACCOUNT NO</th>
                    <th className="py-3 px-3.5 text-right font-bold">BANK PAYMENT</th>
                    <th className="py-3 px-3.5 text-right font-bold">CASH PAYMENT</th>
                    <th className="py-3 px-3.5 text-right font-bold">TAX AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <AlertCircle className="size-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">
                          No employee account records found
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Try adjusting your search criteria or reset filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp, idx) => (
                      <tr
                        key={emp.id || emp.empId}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-2.5 px-3.5 text-center text-slate-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {emp.empId}
                        </td>
                        <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-white">
                          {emp.name}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                          {emp.designation}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                          {emp.department}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                          {emp.section || "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          {emp.bankName}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-800 dark:text-slate-200">
                          {emp.accountNo || "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {emp.bankPayment.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-slate-600 dark:text-slate-400">
                          {emp.cashPayment.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-slate-600 dark:text-slate-400">
                          {emp.taxAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary & Count */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredEmployees.length}</span> of{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">{employees.length}</span> total employee records
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div>
                  Total Bank Disbursed:{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{filteredEmployees.reduce((acc, curr) => acc + curr.bankPayment, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

