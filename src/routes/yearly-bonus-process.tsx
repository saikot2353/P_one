import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Calculator,
  CheckCircle2,
  Search,
  Play,
  FileText,
  Printer,
  FileDown,
  Send,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  Settings2,
  Users,
  Check,
  RefreshCw,
  Building2,
  DollarSign,
  Info,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/yearly-bonus-process")({
  head: () => ({
    meta: [
      { title: "Yearly Bonus Process — CRIPTON" },
      { name: "description", content: "Process, adjust and submit yearly festival bonuses." },
    ],
  }),
  component: YearlyBonusProcessPage,
});

export interface FestivalBonusRule {
  id: string;
  minTenureMonths: number;
  maxTenureMonths: number;
  bonusType: "basic-percent" | "gross-percent" | "flat";
  bonusValue: number;
}

export interface BonusProcessRecord {
  id: number;
  empId: string;
  empIdOff: string;
  name: string;
  joinDate: string;
  basic: number;
  gross: number;
  defaultPct: number; // Def(%)
  reqPct: number;     // Req(%) - editable in table row
  netPay: number;     // Net Pay - editable in table row
  notes: string;      // Notes - editable in table row
  empType: string;
  department: string;
  section: string;
  designation: string;
  tenureMonths: number;
  status: "Pending" | "Submitted";
}

// Master company employee pool matching ERP production data
const initialMasterEmployees = [
  { id: 1, empId: "2025058109", empIdOff: "", name: "Mohammad Methoun Ahmed", joinDate: "22/12/2025", basic: 78000, gross: 130000, empType: "Office Executive", department: "Business Automation", section: "Core Development", designation: "Sr. Manager", notes: "" },
  { id: 2, empId: "2024053060", empIdOff: "", name: "Md. Mahfujul Haque", joinDate: "10/12/2024", basic: 52800, gross: 88000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Manager", notes: "" },
  { id: 3, empId: "2024053062", empIdOff: "", name: "Mohammad Mayhedi Hasan", joinDate: "10/12/2024", basic: 44400, gross: 74000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Deputy Manager", notes: "" },
  { id: 4, empId: "2025056560", empIdOff: "", name: "Md. Rafsan Kabir", joinDate: "01/09/2025", basic: 12000, gross: 20000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Executive", notes: "" },
  { id: 5, empId: "2026058685", empIdOff: "", name: "Md Johirul Islam", joinDate: "15/02/2026", basic: 20400, gross: 34000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Executive", notes: "" },
  { id: 6, empId: "2024046961", empIdOff: "", name: "Sumaya Siddika", joinDate: "03/01/2024", basic: 39600, gross: 66000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Sr. Executive", notes: "" },
  { id: 7, empId: "2025053673", empIdOff: "", name: "Md Jahid Hasan Polok", joinDate: "20/01/2025", basic: 27600, gross: 46000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Executive", notes: "" },
  { id: 8, empId: "2025054614", empIdOff: "", name: "Md. Rana Miah", joinDate: "07/04/2025", basic: 34800, gross: 58000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Executive", notes: "" },
  { id: 9, empId: "2024052335", empIdOff: "", name: "Md. Al Amin", joinDate: "01/10/2024", basic: 30600, gross: 51000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Executive", notes: "" },
  { id: 10, empId: "2023043974", empIdOff: "", name: "Md. Anwar Hossain", joinDate: "09/08/2023", basic: 49200, gross: 82000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Deputy Manager", notes: "" },
  { id: 11, empId: "2024051507", empIdOff: "", name: "S.M Rakib Rahman Tuhin", joinDate: "01/09/2024", basic: 42000, gross: 70000, empType: "Office Executive", department: "Core Development", section: "General ERP", designation: "Sr. Executive", notes: "" },
  { id: 12, empId: "2023044012", empIdOff: "", name: "Tanver Rahman Shaon", joinDate: "01/01/2025", basic: 30000, gross: 50000, empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Deputy Manager", notes: "" },
  { id: 13, empId: "2025053380", empIdOff: "", name: "Miraz Uddin", joinDate: "06/01/2025", basic: 14400, gross: 24000, empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Jr. Executive", notes: "" },
  { id: 14, empId: "2025053377", empIdOff: "", name: "Md. Maruf Hossen", joinDate: "05/01/2025", basic: 34800, gross: 58000, empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Asst. Manager", notes: "" },
  { id: 15, empId: "2025054315", empIdOff: "", name: "Md. Shahinur Alahi Khan", joinDate: "16/02/2025", basic: 36000, gross: 60000, empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Asst. Manager", notes: "" },
  { id: 16, empId: "2021032646", empIdOff: "", name: "Sadiqul Islam", joinDate: "22/12/2021", basic: 35400, gross: 59000, empType: "Office Executive", department: "Business Development", section: "Core Sales", designation: "Deputy Manager", notes: "" },
  { id: 17, empId: "2023043909", empIdOff: "", name: "Md. Ashanur Kabir", joinDate: "01/08/2023", basic: 43800, gross: 73000, empType: "Office Executive", department: "Business Development", section: "Digital Marketing", designation: "Manager", notes: "" },
  { id: 18, empId: "2023044865", empIdOff: "", name: "Md. Nizam Uddin Shamrat", joinDate: "17/09/2023", basic: 34200, gross: 57000, empType: "Office Executive", department: "Business Innovation", section: "APPS Team", designation: "Asst. Manager", notes: "" },
  { id: 19, empId: "2026058726", empIdOff: "", name: "Parvej Mahmud", joinDate: "22/02/2026", basic: 24000, gross: 40000, empType: "Office Executive", department: "Business Innovation", section: "APPS Team", designation: "Executive", notes: "" },
  { id: 20, empId: "2024049326", empIdOff: "", name: "Hanif Uddin", joinDate: "01/06/2024", basic: 30000, gross: 50000, empType: "Office Executive", department: "Business Innovation", section: "APPS Team", designation: "Sr. Executive", notes: "" },
  { id: 21, empId: "2026058686", empIdOff: "", name: "Md. Abdur Rahaman", joinDate: "15/02/2026", basic: 30000, gross: 50000, empType: "Office Executive", department: "Business Innovation", section: "Business Innovation", designation: "Executive", notes: "" },
  { id: 22, empId: "2023043910", empIdOff: "", name: "Tahmid Afsar", joinDate: "01/08/2023", basic: 31200, gross: 52000, empType: "Office Executive", department: "Business Innovation", section: "Project Resource & Strategy", designation: "Deputy Manager", notes: "" },
  { id: 23, empId: "2025054609", empIdOff: "", name: "Md Mahir Shahriyar", joinDate: "15/03/2025", basic: 19800, gross: 33000, empType: "Office Executive", department: "Business Innovation", section: "Project Resource & Strategy", designation: "Jr. Executive", notes: "" },
  { id: 24, empId: "2023044078", empIdOff: "", name: "Md. Anik Islam", joinDate: "16/08/2023", basic: 47400, gross: 79000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Deputy Manager", notes: "" },
  { id: 25, empId: "2024051510", empIdOff: "", name: "Md. Sadmanur Islam Shishir", joinDate: "01/09/2024", basic: 16200, gross: 27000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Jr. Executive", notes: "" },
  { id: 26, empId: "2025054707", empIdOff: "", name: "Allama Bakhtiyar Nafis", joinDate: "16/04/2025", basic: 15000, gross: 25000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Jr. Executive", notes: "Special Bonus" },
  { id: 27, empId: "2025054710", empIdOff: "", name: "Raihan Jami Khan", joinDate: "16/04/2025", basic: 15000, gross: 25000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Jr. Executive", notes: "Special Bonus" },
  { id: 28, empId: "2024049166", empIdOff: "", name: "MD Maimoon Hossain Shomoy", joinDate: "18/05/2024", basic: 25800, gross: 43000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Sr. Executive", notes: "" },
  { id: 29, empId: "2025053125", empIdOff: "", name: "Al Riyad Karim", joinDate: "12/01/2025", basic: 27600, gross: 46000, empType: "Office Executive", department: "Business Innovation", section: "WEB-Team", designation: "Sr. Executive", notes: "" },
  { id: 30, empId: "2022035599", empIdOff: "", name: "Dipon Saha", joinDate: "07/05/2022", basic: 40200, gross: 67000, empType: "Office Executive", department: "Business Automation", section: "Core Development", designation: "Manager", notes: "" }
];

function parseDateHelper(dateStr: string): Date {
  if (!dateStr) return new Date();
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }
  return new Date(dateStr);
}

function calculateTenureMonths(joinDateStr: string, effectiveDateStr: string): number {
  const join = parseDateHelper(joinDateStr);
  const eff = parseDateHelper(effectiveDateStr);
  if (isNaN(join.getTime()) || isNaN(eff.getTime())) return 0;
  const diffYears = eff.getFullYear() - join.getFullYear();
  const diffMonths = eff.getMonth() - join.getMonth();
  const months = diffYears * 12 + diffMonths;
  return months >= 0 ? months : 0;
}

function YearlyBonusProcessPage() {
  const [activeTab, setActiveTab] = useState("processing");
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isProcessingAnimation, setIsProcessingAnimation] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [tableSearch, setTableSearch] = useState("");

  // Process & Filter Parameters
  const [effectiveDate, setEffectiveDate] = useState("2026-10-11");
  const [bonusFestival, setBonusFestival] = useState("Eid-ul-Fitr");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  // Modal Advanced Parameters
  const [calculationBasis, setCalculationBasis] = useState<"Basic" | "Gross">("Basic");
  const [autoSyncReqPct, setAutoSyncReqPct] = useState(true);
  const [includeProbationary, setIncludeProbationary] = useState(true);

  // Loaded bonus rules
  const [bonusRules, setBonusRules] = useState<FestivalBonusRule[]>([
    { id: "1", minTenureMonths: 0, maxTenureMonths: 3, bonusType: "flat", bonusValue: 1000 },
    { id: "2", minTenureMonths: 3, maxTenureMonths: 6, bonusType: "basic-percent", bonusValue: 50 },
    { id: "3", minTenureMonths: 6, maxTenureMonths: 12, bonusType: "basic-percent", bonusValue: 80 },
    { id: "4", minTenureMonths: 12, maxTenureMonths: 999, bonusType: "basic-percent", bonusValue: 100 }
  ]);

  // Master records list with editable reqPct, netPay, and notes
  const [records, setRecords] = useState<BonusProcessRecord[]>(() => {
    return initialMasterEmployees.map((emp) => {
      const tenure = calculateTenureMonths(emp.joinDate, "2026-10-11");
      let defPct = 100;
      if (tenure < 3) defPct = 25;
      else if (tenure < 6) defPct = 50;
      else if (tenure < 12) defPct = 80;
      else defPct = 100;

      const netPay = Math.round(emp.basic * (defPct / 100));

      return {
        ...emp,
        tenureMonths: tenure,
        defaultPct: defPct,
        reqPct: defPct,
        netPay: netPay,
        notes: emp.notes || "",
        status: "Pending" as const
      };
    });
  });

  useEffect(() => {
    const storedRules = localStorage.getItem("payroll_bonus_rules");
    if (storedRules) {
      try {
        const parsed = JSON.parse(storedRules);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBonusRules(parsed);
        }
      } catch (e) {
        console.error("Failed to parse bonus rules", e);
      }
    }
  }, []);

  // Calculate default percentage for a tenure based on active rules
  const getRuleDefPct = (tenure: number): { pct: number; isFlat: boolean; flatValue: number } => {
    const matched = bonusRules.find((r) => tenure >= r.minTenureMonths && tenure < r.maxTenureMonths);
    if (matched) {
      if (matched.bonusType === "flat") {
        return { pct: 100, isFlat: true, flatValue: matched.bonusValue };
      }
      return { pct: matched.bonusValue, isFlat: false, flatValue: 0 };
    }
    if (tenure < 3) return { pct: 25, isFlat: false, flatValue: 0 };
    if (tenure < 6) return { pct: 50, isFlat: false, flatValue: 0 };
    if (tenure < 12) return { pct: 80, isFlat: false, flatValue: 0 };
    return { pct: 100, isFlat: false, flatValue: 0 };
  };

  // Run or re-run process calculation
  const handleExecuteProcess = () => {
    setIsProcessingAnimation(true);

    setTimeout(() => {
      const updated = initialMasterEmployees.map((emp) => {
        const tenure = calculateTenureMonths(emp.joinDate, effectiveDate);
        const { pct, isFlat, flatValue } = getRuleDefPct(tenure);
        const baseAmount = calculationBasis === "Basic" ? emp.basic : emp.gross;
        const netPay = isFlat ? flatValue : Math.round(baseAmount * (pct / 100));

        return {
          ...emp,
          tenureMonths: tenure,
          defaultPct: pct,
          reqPct: autoSyncReqPct ? pct : pct,
          netPay: netPay,
          notes: emp.notes || (isFlat ? "Flat Payout" : ""),
          status: "Pending" as const
        };
      });

      setRecords(updated);
      setIsDataLoaded(true);
      setIsProcessingAnimation(false);
      setIsProcessModalOpen(false);
      setSelectedRowIds([]);

      toast.success(
        `Successfully processed festival bonus (${bonusFestival}) for ${updated.length} employees!`
      );
    }, 500);
  };

  // Inline row edit handlers: Req%, Net Pay, Notes
  const handleUpdateReqPct = (id: number, newReqPct: number) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const validReq = isNaN(newReqPct) ? 0 : Math.max(0, newReqPct);
          const baseAmount = calculationBasis === "Basic" ? r.basic : r.gross;
          const calculatedNetPay = Math.round(baseAmount * (validReq / 100));
          return {
            ...r,
            reqPct: validReq,
            netPay: calculatedNetPay
          };
        }
        return r;
      })
    );
  };

  const handleUpdateNetPay = (id: number, newNetPay: number) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const validNet = isNaN(newNetPay) ? 0 : Math.max(0, newNetPay);
          return {
            ...r,
            netPay: validNet
          };
        }
        return r;
      })
    );
  };

  const handleUpdateNotes = (id: number, notesValue: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes: notesValue } : r))
    );
  };

  // Filtered rows for current view
  const filteredRecords = useMemo(() => {
    if (!isDataLoaded) return [];
    return records.filter((r) => {
      // Tab status filter
      if (activeTab === "processing" && r.status !== "Pending") return false;
      if (activeTab === "submitted" && r.status !== "Submitted") return false;

      // Dropdown filters
      if (employeeType !== "ALL" && r.empType !== employeeType) return false;
      if (department !== "All Departments" && r.department !== department) return false;
      if (section !== "ALL" && r.section !== section) return false;

      // EmpId search from top bar
      if (searchEmpId.trim()) {
        const qId = searchEmpId.trim().toLowerCase();
        if (idType === "System" && !r.empId.toLowerCase().includes(qId)) return false;
        if (idType === "Office" && !r.empIdOff.toLowerCase().includes(qId)) return false;
      }

      // Quick table search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    isDataLoaded,
    records,
    activeTab,
    employeeType,
    department,
    section,
    searchEmpId,
    idType,
    tableSearch
  ]);

  // Bulk selection handling
  const isAllSelected = useMemo(() => {
    if (filteredRecords.length === 0) return false;
    return filteredRecords.every((r) => selectedRowIds.includes(r.id));
  }, [filteredRecords, selectedRowIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const curIds = filteredRecords.map((r) => r.id);
      setSelectedRowIds((prev) => prev.filter((id) => !curIds.includes(id)));
    } else {
      const curIds = filteredRecords.map((r) => r.id);
      setSelectedRowIds((prev) => Array.from(new Set([...prev, ...curIds])));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit to approval
  const handleSubmitSelected = () => {
    if (selectedRowIds.length === 0) {
      toast.error("Please select at least one employee record to submit!");
      return;
    }

    setRecords((prev) =>
      prev.map((r) => (selectedRowIds.includes(r.id) ? { ...r, status: "Submitted" } : r))
    );

    toast.success(
      `Successfully submitted festival bonus for ${selectedRowIds.length} employees to approval!`
    );
    setSelectedRowIds([]);
    setActiveTab("submitted");
  };

  // Delete selected records
  const handleDeleteSelected = () => {
    if (selectedRowIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to remove ${selectedRowIds.length} employees from this bonus cycle?`
      )
    ) {
      setRecords((prev) => prev.filter((r) => !selectedRowIds.includes(r.id)));
      setSelectedRowIds([]);
      toast.info("Selected records removed from processing.");
    }
  };

  // Bulk quick set Req%
  const handleBulkSetReq = (targetPct: number) => {
    if (selectedRowIds.length === 0) {
      toast.error("Select employees first to bulk apply Req %");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => {
        if (selectedRowIds.includes(r.id)) {
          const baseAmount = calculationBasis === "Basic" ? r.basic : r.gross;
          return {
            ...r,
            reqPct: targetPct,
            netPay: Math.round(baseAmount * (targetPct / 100))
          };
        }
        return r;
      })
    );
    toast.success(`Set Req % to ${targetPct}% for ${selectedRowIds.length} selected employees!`);
  };

  // Export handlers
  const handleExport = (type: "excel" | "print" | "pdf") => {
    if (filteredRecords.length === 0) {
      toast.error("No records available to export!");
      return;
    }

    if (type === "print") {
      window.print();
      return;
    }

    const headers = [
      "SL",
      "Emp ID",
      "Emp ID(Off)",
      "Name",
      "Gross",
      "Basic",
      "Join Date",
      "Def(%)",
      "Req(%)",
      "Net Pay",
      "Notes",
      "Type",
      "Department",
      "Section",
      "Designation",
      "Status"
    ];

    const rows = filteredRecords.map((r, i) => [
      i + 1,
      `"${r.empId}"`,
      `"${r.empIdOff}"`,
      `"${r.name}"`,
      r.gross,
      r.basic,
      `"${r.joinDate}"`,
      r.defaultPct,
      r.reqPct,
      r.netPay,
      `"${r.notes}"`,
      `"${r.empType}"`,
      `"${r.department}"`,
      `"${r.section}"`,
      `"${r.designation}"`,
      `"${r.status}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Yearly_Bonus_${bonusFestival}_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredRecords.length} records (${type.toUpperCase()})`);
  };

  // Summaries
  const totalGross = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.gross, 0), [filteredRecords]);
  const totalBasic = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.basic, 0), [filteredRecords]);
  const totalNetPay = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.netPay, 0), [filteredRecords]);

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-[1750px] mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Payroll</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Bonus Operations</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Yearly Bonus Process</span>
          </div>

          {/* Top Filter & Processing Action Bar matching ERP Layout */}
          <div className="bg-white rounded-lg border border-slate-300/90 p-4 shadow-xs space-y-3">
            {/* Row 1: Year, Month, Bonus For, Effective Date, Employee Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Bonus For
                </label>
                <select
                  value={bonusFestival}
                  onChange={(e) => setBonusFestival(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="Eid-ul-Fitr">Eid-ul-Fitr</option>
                  <option value="Eid-ul-Adha">Eid-ul-Adha</option>
                  <option value="Durga Puja">Durga Puja</option>
                  <option value="Christmas">Christmas</option>
                  <option value="Annual Festival Bonus">Annual Festival Bonus</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>
            </div>

            {/* Row 2: Department, Section, EmpId, Radio, Search Button & Professional Process Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3.5 items-end pt-1">
              <div className="lg:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Business Automation">Business Automation</option>
                  <option value="Core Development">Core Development</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Business Innovation">Business Innovation</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
                >
                  <option value="ALL">ALL</option>
                  <option value="Core Development">Core Development</option>
                  <option value="General ERP">General ERP</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="APPS Team">APPS Team</option>
                  <option value="WEB-Team">WEB-Team</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                    EmpId
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-700">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="id_type_switch"
                        checked={idType === "System"}
                        onChange={() => setIdType("System")}
                        className="accent-blue-600 cursor-pointer"
                      />{" "}
                      System
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="id_type_switch"
                        checked={idType === "Office"}
                        onChange={() => setIdType("Office")}
                        className="accent-blue-600 cursor-pointer"
                      />{" "}
                      Office
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                />
              </div>

              <div className="lg:col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info(`Applied filter: ${filteredRecords.length} records matching criteria.`)}
                  className="flex-1 h-9 bg-[#0ea5e9] hover:bg-[#0284c7] active:scale-98 text-white font-bold text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <Search className="size-3.5" />
                  <span>SEARCH</span>
                </button>

                {/* Highly Professional Process Dialog */}
                <Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs rounded-md shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Sparkles className="size-3.5" />
                      <span>PROCESS</span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[850px] p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
                    {/* Modal Header */}
                    <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-xl shadow-inner">
                          <Calculator className="size-6 text-blue-300" />
                        </div>
                        <div>
                          <DialogTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Yearly Festival Bonus Processing Engine
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                              v2.4 Engine
                            </span>
                          </DialogTitle>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Configure festival parameters, tenure cut-off criteria, and calculation basis before running payroll calculations.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Form Body */}
                    <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/50 flex-1">
                      {/* Section 1: Festival & Period Configuration */}
                      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Festival & Cycle Parameters
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Effective Date defines tenure calculation
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Bonus Festival
                            </label>
                            <select
                              value={bonusFestival}
                              onChange={(e) => setBonusFestival(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              <option value="Eid-ul-Fitr">Eid-ul-Fitr</option>
                              <option value="Eid-ul-Adha">Eid-ul-Adha</option>
                              <option value="Durga Puja">Durga Puja</option>
                              <option value="Christmas">Christmas</option>
                              <option value="Annual Festival Bonus">Annual Festival Bonus</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Effective Cut-off Date
                            </label>
                            <input
                              type="date"
                              value={effectiveDate}
                              onChange={(e) => setEffectiveDate(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Disbursement Year
                            </label>
                            <select
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Disbursement Month
                            </label>
                            <select
                              value={month}
                              onChange={(e) => setMonth(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                                (m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Calculation Engine & Policy Slab Rules */}
                      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="size-4 text-indigo-600" />
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Calculation Rules & Basis
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <ShieldCheck className="size-3.5" />
                            Policy Rules Synced
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">
                              Calculation Salary Basis
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setCalculationBasis("Basic")}
                                className={`h-9 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  calculationBasis === "Basic"
                                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {calculationBasis === "Basic" && <Check className="size-3.5" />}
                                Basic Salary
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalculationBasis("Gross")}
                                className={`h-9 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  calculationBasis === "Gross"
                                    ? "bg-blue-50 border-blue-600 text-blue-700 shadow-xs"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {calculationBasis === "Gross" && <Check className="size-3.5" />}
                                Gross Salary
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">
                              Auto-Sync Req % with Def %
                            </label>
                            <div
                              onClick={() => setAutoSyncReqPct(!autoSyncReqPct)}
                              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <span className="text-xs font-semibold text-slate-700">
                                {autoSyncReqPct ? "Enabled (Default)" : "Disabled (Custom)"}
                              </span>
                              <input
                                type="checkbox"
                                checked={autoSyncReqPct}
                                onChange={() => {}}
                                className="accent-blue-600 size-4 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">
                              Include Probationary Staff
                            </label>
                            <div
                              onClick={() => setIncludeProbationary(!includeProbationary)}
                              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <span className="text-xs font-semibold text-slate-700">
                                {includeProbationary ? "Yes (Apply Slab)" : "No (Exclude)"}
                              </span>
                              <input
                                type="checkbox"
                                checked={includeProbationary}
                                onChange={() => {}}
                                className="accent-blue-600 size-4 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tenure Policy Slab Reference Matrix */}
                        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                          <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                            <Info className="size-3.5 text-blue-600" />
                            Active Tenure Slab Matrix (Configured via HR Bonus Policy):
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <div className="text-[10px] text-slate-500 font-bold uppercase">0 - 3 Months</div>
                              <div className="font-extrabold text-slate-800 mt-0.5">৳ 1,000 / 25%</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <div className="text-[10px] text-slate-500 font-bold uppercase">3 - 6 Months</div>
                              <div className="font-extrabold text-blue-700 mt-0.5">50% {calculationBasis}</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <div className="text-[10px] text-slate-500 font-bold uppercase">6 - 12 Months</div>
                              <div className="font-extrabold text-indigo-700 mt-0.5">80% {calculationBasis}</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <div className="text-[10px] text-slate-500 font-bold uppercase">&ge; 12 Months</div>
                              <div className="font-extrabold text-emerald-700 mt-0.5">100% {calculationBasis}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Scope & Department Filtering */}
                      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Target Population & Organizational Scope
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Estimated: ~{records.length} Employees
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Target Department
                            </label>
                            <select
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              <option value="All Departments">All Departments</option>
                              <option value="Business Automation">Business Automation</option>
                              <option value="Core Development">Core Development</option>
                              <option value="Business Development">Business Development</option>
                              <option value="Business Innovation">Business Innovation</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Target Section
                            </label>
                            <select
                              value={section}
                              onChange={(e) => setSection(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              <option value="ALL">ALL</option>
                              <option value="Core Development">Core Development</option>
                              <option value="General ERP">General ERP</option>
                              <option value="Core Sales">Core Sales</option>
                              <option value="APPS Team">APPS Team</option>
                              <option value="WEB-Team">WEB-Team</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Employee Type
                            </label>
                            <select
                              value={employeeType}
                              onChange={(e) => setEmployeeType(e.target.value)}
                              className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            >
                              <option value="ALL">ALL</option>
                              <option value="Office Executive">Office Executive</option>
                              <option value="Office Staff">Office Staff</option>
                              <option value="Worker">Worker</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="size-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        Ready to calculate for {month} {year}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Button
                          variant="outline"
                          onClick={() => setIsProcessModalOpen(false)}
                          className="h-9 px-4 text-xs font-bold text-slate-600 border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </Button>

                        <button
                          type="button"
                          disabled={isProcessingAnimation}
                          onClick={handleExecuteProcess}
                          className="h-9 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
                        >
                          {isProcessingAnimation ? (
                            <>
                              <RefreshCw className="size-3.5 animate-spin" />
                              <span>Processing Calculations...</span>
                            </>
                          ) : (
                            <>
                              <Play className="size-3.5 fill-current" />
                              <span>EXECUTE BONUS CALCULATION</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Action Ribbon & Quick Table Search matching Screenshot */}
          <div className="bg-white rounded-lg border border-slate-300/90 p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport("excel")}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <FileDown className="size-3.5 text-emerald-600" />
                <span>EXCEL</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("print")}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Printer className="size-3.5 text-blue-600" />
                <span>PRINT</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <FileText className="size-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Search:
                </span>
                <input
                  type="text"
                  placeholder="Filter by name, ID, dept..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-64 h-8 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Main Processing Table Card */}
          <div className="bg-white rounded-lg border border-slate-300/90 shadow-xs overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Header */}
              <div className="px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
                <TabsList className="bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/70">
                  <TabsTrigger
                    value="processing"
                    className="text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs rounded-md"
                  >
                    Processing Details ({records.filter((r) => r.status === "Pending").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="submitted"
                    className="text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs rounded-md"
                  >
                    Submitted List ({records.filter((r) => r.status === "Submitted").length})
                  </TabsTrigger>
                </TabsList>

                {activeTab === "processing" && selectedRowIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {selectedRowIds.length} Selected
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBulkSetReq(100)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                    >
                      Set Req(%) 100%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkSetReq(50)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                    >
                      Set Req(%) 50%
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitSelected}
                      className="px-3.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="size-3" />
                      Submit Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Notice Banner */}
              <div className="bg-blue-50/80 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 shrink-0" />
                  <span>
                    {activeTab === "processing"
                      ? "Req%, Net Pay, and Notes can be edited directly in the table cells below. Editing Req% automatically recalculates Net Pay based on basic salary."
                      : "The following bonus records have been finalized and submitted for approval review."}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                  Festival: {bonusFestival} ({month} {year})
                </div>
              </div>

              {/* Table Body Content */}
              <TabsContent value="processing" className="m-0 border-0 outline-none">
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-200/90 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                        <th className="py-2.5 px-2 text-center w-9 border-r border-slate-300 sticky left-0 bg-slate-200 z-10">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleToggleSelectAll}
                            className="size-3.5 accent-blue-600 rounded cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-2.5 text-center w-10 border-r border-slate-300">#</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Emp ID</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Emp ID(Off)</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 min-w-[170px]">Name</th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300">Gross</th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300">Basic</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Join Date</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Def(%)</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300 bg-blue-50/60 text-blue-900 min-w-[95px]">
                          Req(%) *
                        </th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300 bg-emerald-50/60 text-emerald-900 min-w-[120px]">
                          Net Pay (৳) *
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-300 min-w-[180px]">Notes *</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Type</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Department</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Section</th>
                        <th className="py-2.5 px-3">Designation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={16} className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="size-8 opacity-30" />
                              <p className="text-sm font-semibold">No bonus records found matching your filters.</p>
                              <p className="text-xs text-slate-400">Click PROCESS or clear filters to view employee calculations.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((row, idx) => {
                          const isSelected = selectedRowIds.includes(row.id);
                          return (
                            <tr
                              key={row.id}
                              className={`transition-colors ${
                                isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="py-2 px-2 text-center border-r border-slate-200 sticky left-0 bg-white/95 backdrop-blur z-10">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectRow(row.id)}
                                  className="size-3.5 accent-blue-600 rounded cursor-pointer"
                                />
                              </td>
                              <td className="py-2 px-2.5 text-center text-slate-500 font-bold border-r border-slate-200 text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">
                                {row.empId}
                              </td>
                              <td className="py-2 px-3 text-slate-400 border-r border-slate-200">
                                {row.empIdOff || "—"}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                                {row.name}
                              </td>
                              <td className="py-2 px-3 text-right font-semibold text-slate-700 border-r border-slate-200">
                                {row.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-right font-semibold text-slate-700 border-r border-slate-200">
                                {row.basic.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-center text-slate-600 border-r border-slate-200 text-[11px]">
                                {row.joinDate}
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                                {row.defaultPct}%
                              </td>

                              {/* Editable Req(%) input in table */}
                              <td className="py-1.5 px-2 text-center border-r border-slate-200 bg-blue-50/20">
                                <input
                                  type="number"
                                  min={0}
                                  max={200}
                                  value={row.reqPct}
                                  onChange={(e) => handleUpdateReqPct(row.id, parseFloat(e.target.value))}
                                  className="w-16 h-7 text-center font-bold text-blue-700 bg-white border border-blue-300 rounded shadow-2xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                                  title="Edit Req% (auto-updates Net Pay)"
                                />
                              </td>

                              {/* Editable Net Pay input in table */}
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 bg-emerald-50/20">
                                <input
                                  type="number"
                                  min={0}
                                  value={row.netPay}
                                  onChange={(e) => handleUpdateNetPay(row.id, parseFloat(e.target.value))}
                                  className="w-24 h-7 text-right font-bold text-emerald-700 bg-white border border-emerald-300 rounded px-2 shadow-2xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xs"
                                  title="Edit Net Pay amount directly"
                                />
                              </td>

                              {/* Editable Notes input in table */}
                              <td className="py-1.5 px-2 border-r border-slate-200">
                                <input
                                  type="text"
                                  placeholder="Add notes..."
                                  value={row.notes}
                                  onChange={(e) => handleUpdateNotes(row.id, e.target.value)}
                                  className="w-full h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs placeholder:text-slate-300"
                                />
                              </td>

                              <td className="py-2 px-3 text-slate-600 border-r border-slate-200 text-[11px]">
                                {row.empType}
                              </td>
                              <td className="py-2 px-3 text-slate-700 border-r border-slate-200">
                                {row.department}
                              </td>
                              <td className="py-2 px-3 text-slate-600 border-r border-slate-200">
                                {row.section}
                              </td>
                              <td className="py-2 px-3 text-slate-600">
                                {row.designation}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Processing Bottom Toolbar */}
                {filteredRecords.length > 0 && (
                  <div className="p-3.5 bg-slate-50 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-slate-600 font-semibold">
                      <span>
                        Showing <strong className="text-slate-900">{filteredRecords.length}</strong> records
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>
                        Total Basic: <strong className="text-slate-900">৳{totalBasic.toLocaleString()}</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>
                        Total Gross: <strong className="text-slate-900">৳{totalGross.toLocaleString()}</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Total Net Pay: ৳{totalNetPay.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={selectedRowIds.length === 0}
                        onClick={handleDeleteSelected}
                        className="text-rose-600 hover:bg-rose-50 border-slate-300 h-8 text-xs font-bold"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        DELETE ({selectedRowIds.length})
                      </Button>

                      <button
                        type="button"
                        disabled={selectedRowIds.length === 0}
                        onClick={handleSubmitSelected}
                        className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        <Send className="size-3.5" />
                        <span>SUBMIT TO APPROVAL ({selectedRowIds.length})</span>
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Submitted List */}
              <TabsContent value="submitted" className="m-0 border-0 outline-none">
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs border-collapse font-sans whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-200/90 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Status</th>
                        <th className="py-2.5 px-2.5 text-center w-10 border-r border-slate-300">#</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Emp ID</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Emp ID(Off)</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 min-w-[170px]">Name</th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300">Gross</th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300">Basic</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Join Date</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Def(%)</th>
                        <th className="py-2.5 px-3 text-center border-r border-slate-300">Req(%)</th>
                        <th className="py-2.5 px-3 text-right border-r border-slate-300 font-bold text-emerald-700">
                          Net Pay (৳)
                        </th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Notes</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Type</th>
                        <th className="py-2.5 px-3 border-r border-slate-300">Department</th>
                        <th className="py-2.5 px-3">Section</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={15} className="py-12 text-center text-slate-400">
                            No submitted records found. Submit processed bonus records to see them here.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((row, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 text-center border-r border-slate-200">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="size-3 text-emerald-600" />
                                Submitted
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-center text-slate-500 font-bold border-r border-slate-200 text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">
                              {row.empId}
                            </td>
                            <td className="py-2 px-3 text-slate-400 border-r border-slate-200">
                              {row.empIdOff || "—"}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                              {row.name}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-slate-700 border-r border-slate-200">
                              {row.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-slate-700 border-r border-slate-200">
                              {row.basic.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center text-slate-600 border-r border-slate-200 text-[11px]">
                              {row.joinDate}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                              {row.defaultPct}%
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-blue-700 border-r border-slate-200">
                              {row.reqPct}%
                            </td>
                            <td className="py-2 px-3 text-right font-extrabold text-emerald-700 border-r border-slate-200">
                              {row.netPay.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-slate-600 border-r border-slate-200">
                              {row.notes || "—"}
                            </td>
                            <td className="py-2 px-3 text-slate-600 border-r border-slate-200 text-[11px]">
                              {row.empType}
                            </td>
                            <td className="py-2 px-3 text-slate-700 border-r border-slate-200">
                              {row.department}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {row.section}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
