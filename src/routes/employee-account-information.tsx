import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Plus,
  ChevronRight,
  X,
  Check,
  Building2,
  CreditCard,
  UserCheck,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Hash,
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

  // Bulk Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<
    Array<{
      empId: string;
      name: string;
      bankName: string;
      accountNo: string;
      selected: boolean;
      designation: string;
      department: string;
    }>
  >([]);
  const [bulkModalSearch, setBulkModalSearch] = useState("");
  const [bulkModalTab, setBulkModalTab] = useState<"all" | "selected" | "empty">("all");
  const [globalBankToApply, setGlobalBankToApply] = useState("Dutch Bangla Bank Limited");


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

  // Open Bulk Modal
  const handleOpenBulkModal = () => {
    // Populate bulk rows based on the current employee list
    const rows = employees.map((emp) => ({
      empId: emp.empId,
      name: emp.name,
      bankName: emp.bankName || "Dutch Bangla Bank Limited",
      accountNo: emp.accountNo || "",
      selected: false,
      designation: emp.designation,
      department: emp.department,
    }));
    setBulkRows(rows);
    setBulkModalSearch("");
    setIsBulkModalOpen(true);
  };

  // Bulk Modal Toggle All
  const handleToggleSelectAllBulk = (checked: boolean) => {
    setBulkRows((prev) =>
      prev.map((row) => {
        // Only select those currently visible in modal search
        if (bulkModalSearch.trim() === "") {
          return { ...row, selected: checked };
        }
        const match =
          row.name.toLowerCase().includes(bulkModalSearch.toLowerCase()) ||
          row.empId.toLowerCase().includes(bulkModalSearch.toLowerCase());
        return match ? { ...row, selected: checked } : row;
      })
    );
  };

  // Bulk Modal Toggle Single Row
  const handleToggleRowSelect = (empId: string) => {
    setBulkRows((prev) =>
      prev.map((row) => (row.empId === empId ? { ...row, selected: !row.selected } : row))
    );
  };

  // Bulk Modal Change Row Bank Name
  const handleRowBankChange = (empId: string, bankName: string) => {
    setBulkRows((prev) =>
      prev.map((row) => (row.empId === empId ? { ...row, bankName } : row))
    );
  };

  // Bulk Modal Change Row Account No
  const handleRowAccountChange = (empId: string, accountNo: string) => {
    setBulkRows((prev) =>
      prev.map((row) => (row.empId === empId ? { ...row, accountNo } : row))
    );
  };

  // Bulk Apply Bank to Selected
  const handleApplyBankToSelected = () => {
    const selectedCount = bulkRows.filter((r) => r.selected).length;
    if (selectedCount === 0) {
      toast.error("Please select at least one employee row to apply bank name.");
      return;
    }
    setBulkRows((prev) =>
      prev.map((r) => (r.selected ? { ...r, bankName: globalBankToApply } : r))
    );
    toast.success(`Applied "${globalBankToApply}" to ${selectedCount} selected employees!`);
  };

  // Save Bulk Modal
  const handleSaveBulk = () => {
    // Find all modified or selected rows
    const selectedRows = bulkRows.filter((r) => r.selected);
    const updatedMap = new Map<string, { bankName: string; accountNo: string }>();

    // If rows are selected, update only selected; if none selected but edited, check changes
    if (selectedRows.length > 0) {
      selectedRows.forEach((r) => {
        updatedMap.set(r.empId, { bankName: r.bankName, accountNo: r.accountNo });
      });
    } else {
      // If nothing selected, update any row that changed account or bank
      bulkRows.forEach((r) => {
        updatedMap.set(r.empId, { bankName: r.bankName, accountNo: r.accountNo });
      });
    }

    setEmployees((prev) =>
      prev.map((emp) => {
        const update = updatedMap.get(emp.empId);
        if (update) {
          return {
            ...emp,
            bankName: update.bankName,
            accountNo: update.accountNo,
          };
        }
        return emp;
      })
    );

    const count = selectedRows.length > 0 ? selectedRows.length : updatedMap.size;
    toast.success(`Successfully saved bank accounts for ${count} employee(s)!`);
    setIsBulkModalOpen(false);
  };

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

  // Counts for modal tabs
  const bulkSelectedCount = useMemo(() => bulkRows.filter((r) => r.selected).length, [bulkRows]);
  const bulkMissingAccountCount = useMemo(
    () => bulkRows.filter((r) => !r.accountNo || r.accountNo.trim() === "").length,
    [bulkRows]
  );

  // Filtered rows inside modal
  const filteredBulkRows = useMemo(() => {
    return bulkRows.filter((r) => {
      // Tab filter
      if (bulkModalTab === "selected" && !r.selected) return false;
      if (bulkModalTab === "empty" && r.accountNo && r.accountNo.trim() !== "") return false;

      // Search filter
      if (!bulkModalSearch.trim()) return true;
      const q = bulkModalSearch.toLowerCase().trim();
      return (
        r.name.toLowerCase().includes(q) ||
        r.empId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q) ||
        r.bankName.toLowerCase().includes(q) ||
        r.accountNo.toLowerCase().includes(q)
      );
    });
  }, [bulkRows, bulkModalSearch, bulkModalTab]);

  const allFilteredSelected =
    filteredBulkRows.length > 0 && filteredBulkRows.every((r) => r.selected);
  const someFilteredSelected =
    filteredBulkRows.some((r) => r.selected) && !allFilteredSelected;
  const selectedBulkCount = bulkSelectedCount;

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
              {/* Requested "Add Bulk Employee Account" button */}
              <button
                type="button"
                onClick={handleOpenBulkModal}
                className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add Bulk Employee Account</span>
              </button>

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

      {/* Modal: Add Bulk Employee Account (Clean, Ultra-Modern Redesign) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Add Bulk Employee Account
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {bulkRows.length} Employees
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quickly assign or update bank partner and account numbers for multiple personnel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Modal Sub-Header Toolbar: Search, Filters & Quick Assign */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/40 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
              {/* Left: Search & Segmented Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative min-w-[220px] max-w-xs flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={bulkModalSearch}
                    onChange={(e) => setBulkModalSearch(e.target.value)}
                    placeholder="Search name, ID, or designation..."
                    className="w-full h-8.5 pl-8 pr-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                  {bulkModalSearch && (
                    <button
                      onClick={() => setBulkModalSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setBulkModalTab("all")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      bulkModalTab === "all"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                        : "hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    All ({bulkRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkModalTab("selected")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      bulkModalTab === "selected"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                        : "hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    Selected ({bulkSelectedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkModalTab("empty")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      bulkModalTab === "empty"
                        ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                        : "hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    Missing Account ({bulkMissingAccountCount})
                  </button>
                </div>
              </div>

              {/* Right: Quick Bank Fill Container */}
              <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-2 whitespace-nowrap">
                  Set Bank:
                </span>
                <select
                  value={globalBankToApply}
                  onChange={(e) => setGlobalBankToApply(e.target.value)}
                  className="h-7.5 px-2.5 rounded-lg border-0 bg-transparent text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleApplyBankToSelected}
                  className={`h-7.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    selectedBulkCount > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  <span>
                    {selectedBulkCount > 0
                      ? `Apply to ${selectedBulkCount} Selected`
                      : "Apply to Selected"}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[#f8fafc]/95 dark:bg-slate-850/95 backdrop-blur-xs z-10 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {/* Bulk Select Checkbox */}
                    <th className="py-3 px-4 text-center w-12">
                      <label className="inline-flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = someFilteredSelected;
                          }}
                          onChange={(e) => handleToggleSelectAllBulk(e.target.checked)}
                          className="size-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </label>
                    </th>
                    {/* SL */}
                    <th className="py-3 px-3 text-center w-12 text-slate-400">SL</th>
                    {/* Employee Name */}
                    <th className="py-3 px-4">EMPLOYEE NAME & DETAILS</th>
                    {/* Bank Name */}
                    <th className="py-3 px-4 w-72">BANK NAME</th>
                    {/* Account No */}
                    <th className="py-3 px-4 w-60">ACCOUNT NO.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {filteredBulkRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center text-slate-400">
                        <AlertCircle className="size-7 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                          No matching employees found
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Try adjusting your search query or switch back to the "All" tab.
                        </p>
                        {(bulkModalSearch || bulkModalTab !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setBulkModalSearch("");
                              setBulkModalTab("all");
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          >
                            Reset Modal Filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredBulkRows.map((row, idx) => (
                      <tr
                        key={row.empId}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                          row.selected
                            ? "bg-blue-50/40 dark:bg-blue-950/20"
                            : ""
                        }`}
                      >
                        {/* Bulk Select Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.selected}
                              onChange={() => handleToggleRowSelect(row.empId)}
                              className="size-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* SL */}
                        <td className="py-3 px-3 text-center text-slate-400 font-semibold text-xs">
                          {idx + 1}
                        </td>

                        {/* Employee Name */}
                        <td className="py-3 px-4">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white leading-tight">
                              {row.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                                {row.empId}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="truncate max-w-[130px] font-medium">{row.designation}</span>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="truncate max-w-[150px] text-slate-400">{row.department}</span>
                            </div>
                          </div>
                        </td>

                        {/* Bank Name */}
                        <td className="py-3 px-4">
                          <div className="relative">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                            <select
                              value={row.bankName}
                              onChange={(e) => handleRowBankChange(row.empId, e.target.value)}
                              className="w-full h-8.5 pl-8 pr-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                              {AVAILABLE_BANKS.map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
                          </div>
                        </td>

                        {/* Account No */}
                        <td className="py-3 px-4">
                          <div className="relative">
                            <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              value={row.accountNo}
                              onChange={(e) => handleRowAccountChange(row.empId, e.target.value)}
                              placeholder="Account number..."
                              className="w-full h-8.5 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Left: Selection summary & mass toggle shortcuts */}
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <span className={`size-2 rounded-full ${selectedBulkCount > 0 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`} />
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedBulkCount}</span> of {bulkRows.length} selected
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <div className="flex items-center gap-2 font-medium">
                  <button
                    type="button"
                    onClick={() => handleToggleSelectAllBulk(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={() => handleToggleSelectAllBulk(false)}
                    className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBulk}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="size-4 stroke-[2.5]" />
                  <span>
                    {selectedBulkCount > 0
                      ? `Save ${selectedBulkCount} Accounts`
                      : "Save Accounts"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

