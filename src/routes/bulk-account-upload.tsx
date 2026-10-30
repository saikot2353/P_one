import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Building2,
  CreditCard,
  AlertCircle,
  ChevronDown,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/bulk-account-upload")({
  head: () => ({
    meta: [
      { title: "Bulk Account Upload — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Bulk upload employee bank accounts, configure disbursement modes, and manage mass payroll allocations.",
      },
    ],
  }),
  component: BulkAccountUploadPage,
});

export interface BulkAccountRow {
  id: string;
  sl: number;
  empId: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  company: string;
  areaName: string;
  employeeType: string;
  unit: string;
  line: string;
  status: string;
  bankName: string;
  accountNo: string;
  paymentMode: "Bank" | "Cash" | "Both";
  bankPayment: number;
  cashPayment: number;
  taxAmount: number;
  selected: boolean;
  isModified?: boolean;
}

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

const INITIAL_BULK_EMPLOYEES: BulkAccountRow[] = [
  {
    id: "emp-1",
    sl: 1,
    empId: "2026062078",
    name: "MD. HASANUR RAHMAN",
    designation: "Asst. Manager",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 38000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-2",
    sl: 2,
    empId: "2026062057",
    name: "Masud Rana",
    designation: "Driver",
    department: "HR, Admin and Compliance",
    section: "Admin",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Cash",
    bankPayment: 0,
    cashPayment: 18500,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-3",
    sl: 3,
    empId: "2026062074",
    name: "Ruhul Amin",
    designation: "Manager",
    department: "Implementation & Business Analysis",
    section: "Business Analysis",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 55000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-4",
    sl: 4,
    empId: "2026062068",
    name: "SALMAN RAHMAN",
    designation: "Executive",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 30000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-5",
    sl: 5,
    empId: "2026061937",
    name: "Md. Jahidul Islam",
    designation: "Executive",
    department: "Implementation & Business Analysis",
    section: "HR Team (Implementation)",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 35000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-6",
    sl: 6,
    empId: "2021023079",
    name: "Md. Monjur Alam",
    designation: "Driver",
    department: "HR, Admin and Compliance",
    section: "Admin",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Cash",
    bankPayment: 0,
    cashPayment: 17000,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-7",
    sl: 7,
    empId: "2025054710",
    name: "Raihan Jami Khan",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 25000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-8",
    sl: 8,
    empId: "2025057068",
    name: "Riazul Islam",
    designation: "Asst. Manager",
    department: "Implementation & Business Analysis",
    section: "Accounts & Vat",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 36400,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-9",
    sl: 9,
    empId: "2023043974",
    name: "Md. Anwar Hossain",
    designation: "Asst. Manager",
    department: "Core Development",
    section: "Merchandising-Purchase-MCD",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 37128,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-10",
    sl: 10,
    empId: "2026059284",
    name: "Istiak Ahmed",
    designation: "Office Boy",
    department: "HR, Admin and Compliance",
    section: "Admin",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Cash",
    bankPayment: 0,
    cashPayment: 12000,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-11",
    sl: 11,
    empId: "2024049166",
    name: "Md Maimoon Hossain Shomoy",
    designation: "Sr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 32760,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-12",
    sl: 12,
    empId: "2026059573",
    name: "Md. Piyash Hasan",
    designation: "Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 26000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-13",
    sl: 13,
    empId: "2023046001",
    name: "Sohanur Rahman Sohan",
    designation: "Executive",
    department: "HR, Admin and Compliance",
    section: "Admin",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 27000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-14",
    sl: 14,
    empId: "2026060310",
    name: "Md. Shahid Hasan",
    designation: "Sr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 31200,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-15",
    sl: 15,
    empId: "2026059418",
    name: "Md Robayet Hasan Yeasin",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 30000,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-16",
    sl: 16,
    empId: "2023043910",
    name: "Tahmid Afsar Shapno",
    designation: "Asst. Manager",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 91200,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
  {
    id: "emp-17",
    sl: 17,
    empId: "2025054609",
    name: "Md Mahir Shahriyar",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    company: "Pakiza Software Limited",
    areaName: "PSL -Operation",
    employeeType: "Permanent",
    unit: "PSL Unit-1",
    line: "N/A",
    status: "Working",
    bankName: "",
    accountNo: "",
    paymentMode: "Bank",
    bankPayment: 28500,
    cashPayment: 0,
    taxAmount: 0,
    selected: false,
  },
];

function BulkAccountUploadPage() {
  const [data, setData] = useState<BulkAccountRow[]>(INITIAL_BULK_EMPLOYEES);

  // Top Filter States (Exact match to standard project layout)
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

  // Table Search
  const [tableSearch, setTableSearch] = useState("");

  // Handle Search click
  const handleTopSearch = () => {
    toast.success("Filters applied! Displaying matching personnel records.");
  };

  // Handle Reset click
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
    toast.info("Filter parameters reset to default.");
  };

  // Filtered employees list based on top filters & search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
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
    data,
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

  // Checkbox helpers
  const selectedCount = useMemo(() => data.filter((r) => r.selected).length, [data]);
  const configuredCount = useMemo(
    () => data.filter((r) => r.accountNo && r.accountNo.trim() !== "").length,
    [data]
  );
  const missingCount = useMemo(
    () => data.filter((r) => !r.accountNo || r.accountNo.trim() === "").length,
    [data]
  );

  const allFilteredSelected =
    filteredData.length > 0 && filteredData.every((r) => r.selected);
  const someFilteredSelected =
    filteredData.some((r) => r.selected) && !allFilteredSelected;

  const handleToggleSelectAll = (checked: boolean) => {
    const visibleIds = new Set(filteredData.map((d) => d.id));
    setData((prev) =>
      prev.map((row) => (visibleIds.has(row.id) ? { ...row, selected: checked } : row))
    );
  };

  const handleToggleRowSelect = (id: string) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row))
    );
  };

  // Row field modifications
  const handleRowChange = <K extends keyof BulkAccountRow>(
    id: string,
    field: K,
    value: BulkAccountRow[K]
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              isModified: true,
            }
          : row
      )
    );
  };



  // Export current list to CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
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
    ];

    const csvRows = filteredData.map((emp, idx) => [
      idx + 1,
      `"${emp.empId}"`,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.designation.replace(/"/g, '""')}"`,
      `"${emp.department.replace(/"/g, '""')}"`,
      `"${emp.section.replace(/"/g, '""')}"`,
      `"${emp.bankName.replace(/"/g, '""')}"`,
      `"${emp.accountNo}"`,
    ]);

    const csvContent = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bulk_Account_Upload_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported accounts data to CSV successfully!");
  };

  // Save all modified or selected records
  const handleSaveAll = () => {
    const modifiedCount = data.filter((r) => r.isModified || r.selected).length;
    setData((prev) => prev.map((r) => ({ ...r, isModified: false })));
    toast.success(`Successfully saved bank accounts for ${modifiedCount || data.length} personnel!`);
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-w-[1780px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
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
              Bulk Account Upload
            </span>
          </div>



          {/* Top Filter Card - Conforms strictly to enterprise UI */}
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

          {/* Action & Search Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:px-4 sm:py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Quick search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search by ID, name, bank, account.."
                className="w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
              />
              {tableSearch && (
                <button
                  onClick={() => setTableSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="h-9 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>EXCEL</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850/60 text-slate-700 dark:text-slate-300 font-bold text-[11px] tracking-wider uppercase">
                    {/* Checkbox */}
                    <th className="py-3 px-3 text-center w-10">
                      <label className="inline-flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = someFilteredSelected;
                          }}
                          onChange={(e) => handleToggleSelectAll(e.target.checked)}
                          className="size-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </label>
                    </th>
                    <th className="py-3 px-3 text-center w-12 font-bold">SL</th>
                    <th className="py-3 px-3.5 font-bold">EMP ID</th>
                    <th className="py-3 px-3.5 font-bold min-w-[200px]">NAME & DETAILS</th>
                    <th className="py-3 px-3.5 font-bold min-w-[220px]">Bank Name</th>
                    <th className="py-3 px-3.5 font-bold min-w-[220px]">ACCOUNT NUMBER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-400">
                        <AlertCircle className="size-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">
                          No employee account records found
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Try adjusting filter criteria or clear search queries.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((emp, idx) => (
                      <tr
                        key={emp.id}
                        className={`transition-colors ${
                          emp.selected
                            ? "bg-blue-50/50 dark:bg-blue-950/20"
                            : emp.isModified
                              ? "bg-amber-50/40 dark:bg-amber-950/15"
                              : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emp.selected}
                              onChange={() => handleToggleRowSelect(emp.id)}
                              className="size-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* SL */}
                        <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                          {idx + 1}
                        </td>

                        {/* EMP ID */}
                        <td className="py-2.5 px-3.5">
                          <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                            {emp.empId}
                          </span>
                        </td>

                        {/* NAME & DETAILS */}
                        <td className="py-2.5 px-3.5">
                          <div className="font-bold text-slate-900 dark:text-white leading-tight">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="truncate max-w-[120px] font-medium">{emp.designation}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="truncate max-w-[130px] text-slate-400">{emp.department}</span>
                          </div>
                        </td>

                        {/* BANK NAME (Direct editable select) */}
                        <td className="py-2 px-3.5">
                          <div className="relative">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                            <select
                              value={emp.bankName}
                              onChange={(e) => handleRowChange(emp.id, "bankName", e.target.value)}
                              className="w-full h-8 pl-8 pr-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                              <option value="">Select Bank Name</option>
                              {AVAILABLE_BANKS.map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                          </div>
                        </td>

                        {/* ACCOUNT NO (Direct editable input) */}
                        <td className="py-2 px-3.5">
                          <div className="relative">
                            <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              value={emp.accountNo}
                              onChange={(e) => handleRowChange(emp.id, "accountNo", e.target.value)}
                              placeholder="Enter account no..."
                              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary & Count */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredData.length}</span> of{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{data.length}</span> records
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>
                  Configured: <span className="font-bold text-emerald-600 dark:text-emerald-400">{configuredCount}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>
                  Missing: <span className="font-bold text-amber-600 dark:text-amber-400">{missingCount}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Save className="size-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
