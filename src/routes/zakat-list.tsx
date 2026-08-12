import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartHandshake,
  ChevronRight,
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Info,
  Settings,
  ArrowRight,
  UserCheck,
  FileText,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/zakat-list")({
  head: () => ({
    meta: [
      { title: "Zakat List — CRIPTON" },
      { name: "description", content: "Track and manage Zakat distribution through employees." },
    ],
  }),
  component: ZakatManagementPage,
});

interface ZakatRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  amount: number;
  recipientName: string;
  recipientDetails: string;
  asnafCategory: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  distributionDeadline: string;
  assignedDate: string;
  agencyStatus: "Assigned" | "Acknowledged" | "Distributed" | "Verified";
  proofDetails?: {
    receiptRef: string;
    witnessName: string;
    witnessPhone: string;
    notes: string;
    submittedAt: string;
  };
}

const defaultZakatRecords: ZakatRecord[] = [
  {
    id: "ZK-2026-01",
    employeeName: "Tahmid Afsar Shapno",
    employeeId: "2023043910",
    amount: 15000,
    recipientName: "Abdul Rahim",
    recipientDetails:
      "Disabled head of family, needs financial aid for household food and basic amenities",
    asnafCategory: "Al-Fuqara",
    distributionDeadline: "2026-07-10",
    assignedDate: "2026-06-15",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-99812-ZK",
      witnessName: "Maulana Kashem",
      witnessPhone: "01712-345678",
      notes:
        "Cash handed over directly in presence of the local mosque imam. Recipient expressed immense gratitude.",
      submittedAt: "2026-06-18",
    },
  },
  {
    id: "ZK-2026-02",
    employeeName: "Sohanur Rahman Sohan",
    employeeId: "2023046001",
    amount: 25000,
    recipientName: "Ayesha Begum",
    recipientDetails:
      "Widowed mother of three struggling to pay school admission fees and house rent",
    asnafCategory: "Al-Masakin",
    distributionDeadline: "2026-07-15",
    assignedDate: "2026-06-18",
    agencyStatus: "Distributed",
    proofDetails: {
      receiptRef: "REC-44321-ZK",
      witnessName: "Siddique Ullah (Neighbor)",
      witnessPhone: "01819-876543",
      notes:
        "Funds delivered to clear school dues. School receipt copy attached and verified with the principal.",
      submittedAt: "2026-06-20",
    },
  },
  {
    id: "ZK-2026-03",
    employeeName: "Hanif Uddin",
    employeeId: "2024049326",
    amount: 30000,
    recipientName: "Jamil Mia",
    recipientDetails:
      "Shop owner who lost his livelihood due to accidental fire and owes massive vendor debt",
    asnafCategory: "Al-Gharimin",
    distributionDeadline: "2026-07-20",
    assignedDate: "2026-06-21",
    agencyStatus: "Acknowledged",
  },
  {
    id: "ZK-2026-04",
    employeeName: "Easin Mia",
    employeeId: "2023043021",
    amount: 10000,
    recipientName: "Sajid Hasan",
    recipientDetails:
      "Stranded university student who lost his wallet and laptop during inter-city travel",
    asnafCategory: "Ibnus-Sabil",
    distributionDeadline: "2026-07-05",
    assignedDate: "2026-06-22",
    agencyStatus: "Assigned",
  },
];

function ZakatManagementPage() {
  // Persistence states
  const [records, setRecords] = useState<ZakatRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_records");
      return saved ? JSON.parse(saved) : defaultZakatRecords;
    }
    return defaultZakatRecords;
  });

  const [budgetPools, setBudgetPools] = useState<{year: number, amount: number}[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_budgets");
      return saved ? JSON.parse(saved) : [{ year: new Date().getFullYear(), amount: 800000 }];
    }
    return [{ year: new Date().getFullYear(), amount: 800000 }];
  });

  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem("cripton_zakat_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("cripton_zakat_budgets", JSON.stringify(budgetPools));
  }, [budgetPools]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedAsnaf, setSelectedAsnaf] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Selection for Detail Drawer/Workflow
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Modal State - Assign Zakat
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientDetails, setNewRecipientDetails] = useState("");
  const [newAsnaf, setNewAsnaf] = useState<ZakatRecord["asnafCategory"]>("Al-Fuqara");
  const [newDeadline, setNewDeadline] = useState("");

  // Searchable Employee Dropdown states
  const [empSearchInput, setEmpSearchInput] = useState("");
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [prevZakat, setPrevZakat] = useState(0);
  const [prevAid, setPrevAid] = useState(0);

  // Modal State - Submit Proof
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReceiptRef, setProofReceiptRef] = useState("");
  const [proofWitnessName, setProofWitnessName] = useState("");
  const [proofWitnessPhone, setProofWitnessPhone] = useState("");
  const [proofNotes, setProofNotes] = useState("");

  // Standard employee list (loaded from localstorage or static fallback)
  const employeesList = useMemo(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "2023043910",
        name: "Tahmid Afsar Shapno",
        dept: "Business Innovation",
        sect: "Project Resource & Strategy",
        title: "Asst. Manager",
        joinDate: "01/08/2023",
        gross: "152000.00",
      },
      {
        id: "2023046001",
        name: "Sohanur Rahman Sohan",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Executive",
        joinDate: "01/11/2023",
        gross: "27000.00",
      },
      {
        id: "2023043021",
        name: "Easin Mia",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Receptionist",
        joinDate: "01/02/2023",
        gross: "19000.00",
      },
      {
        id: "2026059411",
        name: "Jannatul Maowa",
        dept: "HR, Admin and Compliance",
        sect: "Admin",
        title: "Jr. Executive",
        joinDate: "10/05/2026",
        gross: "20000.00",
      },
      {
        id: "2024049326",
        name: "Hanif Uddin",
        dept: "Business Innovation",
        sect: "APPS Team",
        title: "Sr. Executive",
        joinDate: "01/06/2024",
        gross: "50000.00",
      },
      {
        id: "2026058726",
        name: "Parvej Mahmud",
        dept: "Business Innovation",
        sect: "APPS Team",
        title: "Executive",
        joinDate: "22/02/2026",
        gross: "40000.00",
      },
      {
        id: "2023045044",
        name: "Sultan Ahmed",
        dept: "Implementation & Business Analysis",
        sect: "Business Analysis",
        title: "Manager",
        joinDate: "01/10/2023",
        gross: "81000.00",
      },
      {
        id: "2026058686",
        name: "Md. Abdur Rahaman",
        dept: "Business Innovation",
        sect: "Business Innovation",
        title: "Executive",
        joinDate: "15/02/2026",
        gross: "50000.00",
      },
      {
        id: "2025058109",
        name: "Mohammad Methoun Ahmed",
        dept: "Business Automation",
        sect: "Core Development",
        title: "Sr. Manager",
        joinDate: "22/12/2025",
        gross: "130000.00",
      },
      {
        id: "2026058685",
        name: "Md Johirul Islam",
        dept: "Business Automation",
        sect: "Core Development",
        title: "Executive",
        joinDate: "15/02/2026",
        gross: "40000.00",
      },
    ];
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return [];
    const q = empSearchInput.toLowerCase();
    return employeesList.filter(
      (emp) => emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q),
    );
  }, [employeesList, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return employeesList.find((emp) => emp.id === newEmpId) || null;
  }, [employeesList, newEmpId]);

  // Compute help totals historically
  const getPreviousHelpTotals = (empId: string) => {
    let totalZakat = 0;
    let totalAid = 0;

    if (typeof window !== "undefined") {
      const savedZakat = localStorage.getItem("cripton_zakat_records");
      if (savedZakat) {
        try {
          const parsed = JSON.parse(savedZakat);
          if (Array.isArray(parsed)) {
            totalZakat = parsed
              .filter((r: any) => r.employeeId === empId && r.agencyStatus === "Verified")
              .reduce((sum, r) => sum + r.amount, 0);
          }
        } catch (e) {}
      }

      const savedAid = localStorage.getItem("cripton_financial_aid");
      if (savedAid) {
        try {
          const parsed = JSON.parse(savedAid);
          if (Array.isArray(parsed)) {
            totalAid = parsed
              .filter((r: any) => r.employeeId === empId && r.status === "Approved")
              .reduce((sum, r) => sum + r.amount, 0);
          }
        } catch (e) {}
      }
    }
    return { totalZakat, totalAid };
  };

  // Calculate Metrics
  const stats = useMemo(() => {
    let totalAssigned = 0;
    let totalDistributed = 0;

    // Filter by selected year
    const yearRecords = records.filter(r => r.assignedDate.startsWith(selectedBudgetYear.toString()));

    yearRecords.forEach((r) => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }
    });

    const currentBudget = budgetPools.find(b => b.year === selectedBudgetYear)?.amount || 0;
    const remainingBudget = currentBudget - totalAssigned;
    return {
      currentBudget,
      totalAssigned,
      totalDistributed,
      remainingBudget,
      pendingDisbursementCount: yearRecords.filter((r) => r.agencyStatus !== "Verified").length,
      totalRecords: yearRecords.length,
    };
  }, [records, budgetPools, selectedBudgetYear]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedStatus !== "ALL" && r.agencyStatus !== selectedStatus) return false;
      if (selectedAsnaf !== "ALL" && r.asnafCategory !== selectedAsnaf) return false;
      if (dateFrom && r.assignedDate < dateFrom) return false;
      if (dateTo && r.assignedDate > dateTo) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.recipientName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedStatus, selectedAsnaf, searchQuery, dateFrom, dateTo]);

  const activeRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  // Handlers
  const handleAssignZakat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpId || !newAmount || !newRecipientName || !newDeadline) {
      alert("Please fill in all required fields (make sure to select an employee).");
      return;
    }

    const amountNum = parseFloat(newAmount);
    if (amountNum > stats.remainingBudget) {
      if (
        !confirm(
          `Warning: The requested Zakat amount (৳${amountNum.toLocaleString()}) exceeds the remaining Zakat budget pool (৳${stats.remainingBudget.toLocaleString()}). Do you still wish to proceed?`,
        )
      ) {
        return;
      }
    }

    const today = new Date().toISOString().split("T")[0];
    const newRecord: ZakatRecord = {
      id: `ZK-2026-${String(records.length + 1).padStart(2, "0")}`,
      employeeName: newEmpName,
      employeeId: newEmpId,
      amount: amountNum,
      recipientName: newRecipientName,
      recipientDetails: newRecipientDetails,
      asnafCategory: newAsnaf,
      distributionDeadline: newDeadline,
      assignedDate: today,
      agencyStatus: "Assigned",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsAssignModalOpen(false);

    // Reset Form
    setNewEmpName("");
    setNewEmpId("");
    setEmpSearchInput("");
    setPrevZakat(0);
    setPrevAid(0);
    setNewAmount("");
    setNewRecipientName("");
    setNewRecipientDetails("");
    setNewAsnaf("Al-Fuqara");
    setNewDeadline("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this Zakat assignment record? This will release the allocated budget amount back to the pool.",
      )
    ) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecordId === id) setSelectedRecordId(null);
    }
  };

  const handleUpdateAgencyStatus = (id: string, nextStatus: ZakatRecord["agencyStatus"]) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, agencyStatus: nextStatus };
        }
        return r;
      }),
    );
  };

  const handleOpenProofModal = () => {
    setProofReceiptRef("");
    setProofWitnessName("");
    setProofWitnessPhone("");
    setProofNotes("");
    setIsProofModalOpen(true);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofReceiptRef || !proofWitnessName) {
      alert("Receipt reference and witness name are required for validation.");
      return;
    }

    if (!selectedRecordId) return;

    const today = new Date().toISOString().split("T")[0];
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === selectedRecordId) {
          return {
            ...r,
            agencyStatus: "Distributed",
            proofDetails: {
              receiptRef: proofReceiptRef,
              witnessName: proofWitnessName,
              witnessPhone: proofWitnessPhone,
              notes: proofNotes,
              submittedAt: today,
            },
          };
        }
        return r;
      }),
    );

    setIsProofModalOpen(false);
  };

  const handleVerifyProof = (id: string, approve: boolean) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            agencyStatus: approve ? "Verified" : "Acknowledged",
            // Keep proof details but update status
            proofDetails: approve ? r.proofDetails : undefined,
          };
        }
        return r;
      }),
    );
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "ID",
      "Agent Employee",
      "Agent ID",
      "Recipient Name",
      "Asnaf Category",
      "Amount",
      "Assigned Date",
      "Deadline",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.employeeName,
      r.employeeId,
      `"${r.recipientName.replace(/"/g, '""')}"`,
      r.asnafCategory,
      r.amount,
      r.assignedDate,
      r.distributionDeadline,
      r.agencyStatus,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `zakat_management_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-5 xl:p-6 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-1.5 print:hidden">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span>Welfare & Support</span>
              <ChevronRight className="size-2.5" />
              <span className="text-emerald-600">Zakat Management</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
              <HeartHandshake className="size-5 text-emerald-600" />
              <span>Zakat Management Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Oversee corporate Zakat allocations assigned to employees to distribute to verified external recipients in need.
            </p>
          </div>

          <div className="flex items-center justify-between print:hidden">
            <select
              value={selectedBudgetYear}
              onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))}
              className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500 transition-colors shadow-sm"
            >
              {budgetPools.map(b => (
                <option key={b.year} value={b.year}>{b.year}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setNewEmpName("");
                setNewEmpId("");
                setEmpSearchInput("");
                setPrevZakat(0);
                setPrevAid(0);
                setIsAssignModalOpen(true);
              }}
              className="h-8 px-4 bg-[#4361EE] hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-widest"
            >
              <Plus className="size-3.5" />
              <span>Assign Zakat Case</span>
            </button>
          </div>

          {/* Stats / Budget Pool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:hidden">
            <div className="p-4 rounded-xl bg-[#F0FDF4] text-emerald-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                {selectedBudgetYear} Budget Pool
              </span>
              <div className="text-xl font-black text-emerald-600">৳ {stats.currentBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-emerald-600">Total set corporate Zakat pool</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF6FF] text-blue-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Assigned & Active
              </span>
              <div className="text-xl font-black text-blue-600">৳ {stats.totalAssigned.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-blue-500">{stats.totalRecords} Active cases registered</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EEF2FF] text-indigo-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Distributed / Confirmed
              </span>
              <div className="text-xl font-black text-indigo-600">৳ {stats.totalDistributed.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-indigo-500">Funds delivered to recipients</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF7ED] text-orange-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Remaining Balance
              </span>
              <div className="text-xl font-black text-orange-600">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-orange-500">Available for new assignments</div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 px-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">All Agency Statuses</option>
                  <option value="Assigned">Assigned (Funds Dispatched)</option>
                  <option value="Acknowledged">Acknowledged by Employee</option>
                  <option value="Distributed">Distributed (Awaiting HR Verification)</option>
                  <option value="Verified">Verified & Completed</option>
                </select>
                <select
                  value={selectedAsnaf}
                  onChange={(e) => setSelectedAsnaf(e.target.value)}
                  className="h-8 px-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">All Asnaf Categories</option>
                  <option value="Al-Fuqara">Al-Fuqara (The Poor)</option>
                  <option value="Al-Masakin">Al-Masakin (The Needy)</option>
                  <option value="Al-Gharimin">Al-Gharimin (In Debt)</option>
                  <option value="Fi Sabilillah">Fi Sabilillah (Cause of Allah)</option>
                  <option value="Ibnus-Sabil">Ibnus-Sabil (Wayfarer)</option>
                </select>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee, recipient, or ID..."
                    className="w-full h-8 pl-8 pr-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium outline-none focus:bg-white focus:border-blue-500 transition-colors text-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 print:hidden">
                <button
                  onClick={handleExportCSV}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-emerald-600 shadow-sm"
                >
                  <Download className="size-3" /> Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-blue-600 shadow-sm"
                >
                  <Printer className="size-3" /> Print
                </button>
              </div>
            </div>

            {/* Assigned Date Filters */}
            <div className="flex flex-wrap gap-3 items-center pt-2 pb-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Assigned Date:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-[9px] text-red-500 font-bold hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center w-12">SL</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Agent Employee</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Recipient & Category</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-right">Amount</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Deadline</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((row, index) => {
                    const isSelected = row.id === selectedRecordId;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedRecordId(row.id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                          isSelected
                            ? "bg-slate-50"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.employeeName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            EMP-{row.employeeId.slice(-3)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.recipientName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.asnafCategory}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 text-[11px] text-right">
                          ৳ {row.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 text-center">
                          {row.distributionDeadline}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-center">
                          {row.agencyStatus === "Assigned" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-700 bg-blue-100">
                              Dispatched
                            </span>
                          )}
                          {row.agencyStatus === "Acknowledged" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-indigo-700 bg-indigo-100">
                              Acknowledged
                            </span>
                          )}
                          {row.agencyStatus === "Distributed" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-700 bg-amber-100">
                              Pending HR
                            </span>
                          )}
                          {row.agencyStatus === "Verified" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-green-700 bg-green-100">
                              Verified
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-center print:hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                            <button
                              onClick={(e) => handleDelete(row.id, e)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="size-3" />
                            </button>
                            {row.agencyStatus !== "Verified" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAgencyStatus(
                                    row.id,
                                    row.agencyStatus === "Distributed"
                                      ? "Verified"
                                      : "Distributed",
                                  );
                                }}
                                className="p-1 text-[#4361EE] hover:bg-blue-50 rounded transition-colors"
                                title={
                                  row.agencyStatus === "Distributed"
                                    ? "Verify Distribution"
                                    : "Mark as Distributed"
                                }
                              >
                                <Settings className="size-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-medium text-[11px]">
                        No matching Zakat distribution cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Assign Zakat */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[20px] shadow-2xl border border-slate-200 flex flex-col overflow-visible">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-[20px]">
              <div className="flex items-center gap-3">
                <div className="bg-[#0B1527] text-white size-9 rounded-full flex items-center justify-center">
                  <HeartHandshake className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Assign Zakat Handover Case</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAssignZakat} className="flex flex-col overflow-visible">
              <div className="p-6 space-y-5 bg-white overflow-visible">
                <div className="relative overflow-visible">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Search Assignee Employee (Name or ID) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Type employee ID or Name to search..."
                      value={empSearchInput}
                      onChange={(e) => {
                        setEmpSearchInput(e.target.value);
                        setIsEmpDropdownOpen(true);
                        if (!e.target.value) {
                          setNewEmpId("");
                          setNewEmpName("");
                          setPrevZakat(0);
                          setPrevAid(0);
                        }
                      }}
                      onFocus={() => setIsEmpDropdownOpen(true)}
                      className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                    />
                  {empSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmpSearchInput("");
                        setNewEmpId("");
                        setNewEmpName("");
                        setPrevZakat(0);
                        setPrevAid(0);
                        setIsEmpDropdownOpen(false);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:bg-background rounded transition"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {isEmpDropdownOpen && filteredEmployeesForDropdown.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                    {filteredEmployeesForDropdown.map((emp) => {
                      const totals = getPreviousHelpTotals(emp.id);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setNewEmpId(emp.id);
                            setNewEmpName(emp.name);
                            setEmpSearchInput(`${emp.name} (${emp.id})`);
                            setPrevZakat(totals.totalZakat);
                            setPrevAid(totals.totalAid);
                            setIsEmpDropdownOpen(false);
                          }}
                          className="p-3 cursor-pointer hover:bg-slate-50 transition flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-800">
                              {emp.name} <span className="text-slate-500">({emp.id})</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {emp.dept} &middot; {emp.title}
                            </div>
                          </div>
                          {(totals.totalZakat > 0 || totals.totalAid > 0) && (
                            <div className="text-right text-[9px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                               Zakat: ৳{totals.totalZakat.toLocaleString()} | Aid: ৳{totals.totalAid.toLocaleString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selection Summary details */}
              {newEmpId && selectedEmpDetails && (
                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between font-black text-xs uppercase tracking-wider">
                    <span className="text-foreground">Agent Employee Verified Details</span>
                    <span className="text-emerald-600 font-mono">{newEmpId}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Name: <span className="font-bold text-foreground">{newEmpName}</span>
                    <br />
                    Role:{" "}
                    <span className="font-bold text-foreground">
                      {selectedEmpDetails.title}
                    </span> •{" "}
                    <span className="font-semibold text-foreground">{selectedEmpDetails.dept}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex justify-between border-t border-border/20 pt-2 mt-2">
                    <span>Previous Zakat: ৳{prevZakat.toLocaleString()}</span>
                    <span>Previous Aid: ৳{prevAid.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                  Recipient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="e.g. Ayesha Begum"
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                  Recipient Details & Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={newRecipientDetails}
                  onChange={(e) => setNewRecipientDetails(e.target.value)}
                  placeholder="Provide a detailed explanation of the beneficiary's situation..."
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-800"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Asnaf Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAsnaf}
                    onChange={(e) => setNewAsnaf(e.target.value as any)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800 bg-white"
                  >
                    <option value="Al-Fuqara">Al-Fuqara (The Poor)</option>
                    <option value="Al-Masakin">Al-Masakin (The Needy)</option>
                    <option value="Al-Gharimin">Al-Gharimin (Those in Debt)</option>
                    <option value="Fi Sabilillah">Fi Sabilillah (In the cause of Allah)</option>
                    <option value="Ibnus-Sabil">Ibnus-Sabil (The Wayfarer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-[20px]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-bold text-sm text-white bg-[#2563EB] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Submit Handover Proof */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[20px] shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-[20px]">
              <div className="flex items-center gap-3">
                <div className="bg-[#0B1527] text-white size-9 rounded-full flex items-center justify-center">
                  <FileText className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Submit Handover Proof</h3>
              </div>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="flex flex-col">
              <div className="p-6 space-y-5 bg-white">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Receipt/Voucher Reference ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={proofReceiptRef}
                    onChange={(e) => setProofReceiptRef(e.target.value)}
                    placeholder="e.g. REC-55234-ZK"
                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                      Witness Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={proofWitnessName}
                      onChange={(e) => setProofWitnessName(e.target.value)}
                      placeholder="e.g. Maulana Ibrahim"
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                      Witness Contact Phone
                    </label>
                    <input
                      type="text"
                      value={proofWitnessPhone}
                      onChange={(e) => setProofWitnessPhone(e.target.value)}
                      placeholder="e.g. 01700-000000"
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex gap-1 mb-2">
                    Verification Remarks / Handover Context
                  </label>
                  <textarea
                    value={proofNotes}
                    onChange={(e) => setProofNotes(e.target.value)}
                    placeholder="Provide context regarding the distribution meeting (e.g. location, witness details)..."
                    className="w-full h-24 p-4 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-800"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-[20px]">
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-bold text-sm text-white bg-[#2563EB] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
