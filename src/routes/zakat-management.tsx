import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartHandshake, ChevronRight, Plus, Search, FileSpreadsheet, Printer, X, Trash2,
  CheckCircle2, Clock, ShieldCheck, AlertCircle, Info, Settings, ArrowRight, UserCheck, FileText
} from "lucide-react";

export const Route = createFileRoute("/zakat-management")({
  head: () => ({
    meta: [
      { title: "Zakat Management — CRIPTON" },
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
    recipientDetails: "Disabled head of family, needs financial aid for household food and basic amenities",
    asnafCategory: "Al-Fuqara",
    distributionDeadline: "2026-07-10",
    assignedDate: "2026-06-15",
    agencyStatus: "Verified",
    proofDetails: {
      receiptRef: "REC-99812-ZK",
      witnessName: "Maulana Kashem",
      witnessPhone: "01712-345678",
      notes: "Cash handed over directly in presence of the local mosque imam. Recipient expressed immense gratitude.",
      submittedAt: "2026-06-18"
    }
  },
  {
    id: "ZK-2026-02",
    employeeName: "Sohanur Rahman Sohan",
    employeeId: "2023046001",
    amount: 25000,
    recipientName: "Ayesha Begum",
    recipientDetails: "Widowed mother of three struggling to pay school admission fees and house rent",
    asnafCategory: "Al-Masakin",
    distributionDeadline: "2026-07-15",
    assignedDate: "2026-06-18",
    agencyStatus: "Distributed",
    proofDetails: {
      receiptRef: "REC-44321-ZK",
      witnessName: "Siddique Ullah (Neighbor)",
      witnessPhone: "01819-876543",
      notes: "Funds delivered to clear school dues. School receipt copy attached and verified with the principal.",
      submittedAt: "2026-06-20"
    }
  },
  {
    id: "ZK-2026-03",
    employeeName: "Hanif Uddin",
    employeeId: "2024049326",
    amount: 30000,
    recipientName: "Jamil Mia",
    recipientDetails: "Shop owner who lost his livelihood due to accidental fire and owes massive vendor debt",
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
    recipientDetails: "Stranded university student who lost his wallet and laptop during inter-city travel",
    asnafCategory: "Ibnus-Sabil",
    distributionDeadline: "2026-07-05",
    assignedDate: "2026-06-22",
    agencyStatus: "Assigned",
  }
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

  const [budgetPool, setBudgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_zakat_budget");
      return saved ? parseFloat(saved) : 800000;
    }
    return 800000;
  });

  useEffect(() => {
    localStorage.setItem("cripton_zakat_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("cripton_zakat_budget", budgetPool.toString());
  }, [budgetPool]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedAsnaf, setSelectedAsnaf] = useState("ALL");

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

  // Modal State - Manage Budget
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");

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
      { id: "2023043910", name: "Tahmid Afsar Shapno", dept: "Business Innovation", sect: "Project Resource & Strategy", title: "Asst. Manager", joinDate: "01/08/2023", gross: "152000.00" },
      { id: "2023046001", name: "Sohanur Rahman Sohan", dept: "HR, Admin and Compliance", sect: "Admin", title: "Executive", joinDate: "01/11/2023", gross: "27000.00" },
      { id: "2023043021", name: "Easin Mia", dept: "HR, Admin and Compliance", sect: "Admin", title: "Receptionist", joinDate: "01/02/2023", gross: "19000.00" },
      { id: "2026059411", name: "Jannatul Maowa", dept: "HR, Admin and Compliance", sect: "Admin", title: "Jr. Executive", joinDate: "10/05/2026", gross: "20000.00" },
      { id: "2024049326", name: "Hanif Uddin", dept: "Business Innovation", sect: "APPS Team", title: "Sr. Executive", joinDate: "01/06/2024", gross: "50000.00" },
      { id: "2026058726", name: "Parvej Mahmud", dept: "Business Innovation", sect: "APPS Team", title: "Executive", joinDate: "22/02/2026", gross: "40000.00" },
      { id: "2023045044", name: "Sultan Ahmed", dept: "Implementation & Business Analysis", sect: "Business Analysis", title: "Manager", joinDate: "01/10/2023", gross: "81000.00" },
      { id: "2026058686", name: "Md. Abdur Rahaman", dept: "Business Innovation", sect: "Business Innovation", title: "Executive", joinDate: "15/02/2026", gross: "50000.00" },
      { id: "2025058109", name: "Mohammad Methoun Ahmed", dept: "Business Automation", sect: "Core Development", title: "Sr. Manager", joinDate: "22/12/2025", gross: "130000.00" },
      { id: "2026058685", name: "Md Johirul Islam", dept: "Business Automation", sect: "Core Development", title: "Executive", joinDate: "15/02/2026", gross: "40000.00" }
    ];
  }, []);

  const filteredEmployeesForDropdown = useMemo(() => {
    if (!empSearchInput.trim()) return [];
    const q = empSearchInput.toLowerCase();
    return employeesList.filter(
      emp => emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q)
    );
  }, [employeesList, empSearchInput]);

  const selectedEmpDetails = useMemo(() => {
    return employeesList.find(emp => emp.id === newEmpId) || null;
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
    let totalAssigned = 0; // Cumulative funds assigned
    let totalDistributed = 0; // Funds verified or distributed

    records.forEach(r => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }
    });

    const remainingBudget = budgetPool - totalAssigned;
    return {
      totalAssigned,
      totalDistributed,
      remainingBudget,
      pendingDisbursementCount: records.filter(r => r.agencyStatus !== "Verified").length,
      totalRecords: records.length
    };
  }, [records, budgetPool]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (selectedStatus !== "ALL" && r.agencyStatus !== selectedStatus) return false;
      if (selectedAsnaf !== "ALL" && r.asnafCategory !== selectedAsnaf) return false;
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
  }, [records, selectedStatus, selectedAsnaf, searchQuery]);

  const activeRecord = useMemo(() => {
    return records.find(r => r.id === selectedRecordId) || null;
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
      if (!confirm(`Warning: The requested Zakat amount (৳${amountNum.toLocaleString()}) exceeds the remaining Zakat budget pool (৳${stats.remainingBudget.toLocaleString()}). Do you still wish to proceed?`)) {
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
      agencyStatus: "Assigned"
    };

    setRecords(prev => [newRecord, ...prev]);
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

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid budget amount.");
      return;
    }
    setBudgetPool(val);
    setIsBudgetModalOpen(false);
    setTempBudgetInput("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this Zakat assignment record? This will release the allocated budget amount back to the pool.")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      if (selectedRecordId === id) setSelectedRecordId(null);
    }
  };

  const handleUpdateAgencyStatus = (id: string, nextStatus: ZakatRecord["agencyStatus"]) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, agencyStatus: nextStatus };
      }
      return r;
    }));
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
    setRecords(prev => prev.map(r => {
      if (r.id === selectedRecordId) {
        return {
          ...r,
          agencyStatus: "Distributed",
          proofDetails: {
            receiptRef: proofReceiptRef,
            witnessName: proofWitnessName,
            witnessPhone: proofWitnessPhone,
            notes: proofNotes,
            submittedAt: today
          }
        };
      }
      return r;
    }));

    setIsProofModalOpen(false);
  };

  const handleVerifyProof = (id: string, approve: boolean) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          agencyStatus: approve ? "Verified" : "Acknowledged",
          // Keep proof details but update status
          proofDetails: approve ? r.proofDetails : undefined
        };
      }
      return r;
    }));
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Welfare & Support</span>
                <ChevronRight className="size-2.5" />
                <span className="text-emerald-600 font-semibold">Zakat Management</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <HeartHandshake className="size-5.5 text-emerald-600" />
                <span>Zakat Management Tracker</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Oversee corporate Zakat allocations assigned to employees to distribute to verified external recipients in need.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTempBudgetInput(budgetPool.toString());
                  setIsBudgetModalOpen(true);
                }}
                className="h-9 px-4 bg-muted hover:bg-muted/80 text-foreground border border-border/80 font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition uppercase tracking-wider"
              >
                <Settings className="size-3.5 text-muted-foreground" />
                <span>Configure Budget</span>
              </button>
              <button
                onClick={() => {
                  setNewEmpName("");
                  setNewEmpId("");
                  setEmpSearchInput("");
                  setPrevZakat(0);
                  setPrevAid(0);
                  setIsAssignModalOpen(true);
                }}
                className="h-9 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
              >
                <Plus className="size-4" />
                <span>Assign Zakat Case</span>
              </button>
            </div>
          </div>

          {/* Stats / Budget Pool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
            <div className="p-4 rounded-lg border bg-card text-emerald-600 bg-emerald-500/5 border-emerald-500/10 shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">Allocated Budget Pool</span>
              <div className="text-xl font-black">৳ {budgetPool.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold">Total set corporate Zakat pool</div>
            </div>
            <div className="p-4 rounded-lg border bg-card text-blue-600 bg-blue-500/5 border-blue-500/10 shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">Assigned & Active</span>
              <div className="text-xl font-black">৳ {stats.totalAssigned.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold">{stats.totalRecords} Active cases registered</div>
            </div>
            <div className="p-4 rounded-lg border bg-card text-indigo-600 bg-indigo-500/5 border-indigo-500/10 shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">Distributed / Confirmed</span>
              <div className="text-xl font-black">৳ {stats.totalDistributed.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold">Funds delivered to recipients</div>
            </div>
            <div className={`p-4 rounded-lg border bg-card shadow-xs space-y-1 transition duration-200 hover:scale-[1.01] ${
              stats.remainingBudget < 50000 
                ? "text-rose-600 bg-rose-500/5 border-rose-500/20" 
                : "text-amber-600 bg-amber-500/5 border-amber-500/10"
            }`}>
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">Remaining Balance</span>
              <div className="text-xl font-black">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold">Available for new assignments</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Table Container */}
            <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-emerald-500"
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
                    className="h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Asnaf Categories</option>
                    <option value="Al-Fuqara">Al-Fuqara (The Poor)</option>
                    <option value="Al-Masakin">Al-Masakin (The Needy)</option>
                    <option value="Al-Gharimin">Al-Gharimin (In Debt)</option>
                    <option value="Fi Sabilillah">Fi Sabilillah (Cause of Allah)</option>
                    <option value="Ibnus-Sabil">Ibnus-Sabil (Wayfarer)</option>
                  </select>

                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employee, recipient, or ID..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:bg-card focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 print:hidden shrink-0">
                  <button onClick={handlePrint} className="h-9 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition">
                    <Printer className="size-3.5 text-blue-500" /> Print
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-border/50 rounded-xl">
                <table className="w-full border-collapse text-[11px] text-left">
                  <thead>
                    <tr className="bg-muted/40 text-foreground font-bold border-b border-border/50 whitespace-nowrap">
                      <th className="px-4 py-3 border-r border-border/30">ID</th>
                      <th className="px-4 py-3 border-r border-border/30">Agent Employee</th>
                      <th className="px-4 py-3 border-r border-border/30">Recipient & Category</th>
                      <th className="px-4 py-3 text-right border-r border-border/30">Amount</th>
                      <th className="px-4 py-3 text-center border-r border-border/30">Deadline</th>
                      <th className="px-4 py-3 text-center border-r border-border/30">Workflow Stage</th>
                      <th className="px-4 py-3 text-center print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredRecords.map((row) => {
                      const isSelected = row.id === selectedRecordId;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedRecordId(row.id)}
                          className={`cursor-pointer transition duration-75 ${
                            isSelected
                              ? "bg-emerald-500/5 hover:bg-emerald-500/10 border-l-2 border-l-emerald-600"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono font-bold border-r border-border/20">{row.id}</td>
                          <td className="px-4 py-3 border-r border-border/20">
                            <div className="font-bold text-foreground">{row.employeeName}</div>
                            <div className="text-[9px] text-muted-foreground font-mono">{row.employeeId}</div>
                          </td>
                          <td className="px-4 py-3 border-r border-border/20">
                            <div className="font-bold text-foreground">{row.recipientName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex px-1.5 py-0.25 rounded text-[8.5px] font-bold bg-muted text-muted-foreground border border-border/50">
                                {row.asnafCategory}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600 border-r border-border/20">৳ {row.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center font-mono border-r border-border/20">{row.distributionDeadline}</td>
                          <td className="px-4 py-3 text-center border-r border-border/20">
                            {row.agencyStatus === "Assigned" && (
                              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded text-[9.5px] font-bold border border-amber-500/20">
                                <Clock className="size-3" /> Dispatched
                              </span>
                            )}
                            {row.agencyStatus === "Acknowledged" && (
                              <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded text-[9.5px] font-bold border border-blue-500/20">
                                <Clock className="size-3" /> Acknowledged
                              </span>
                            )}
                            {row.agencyStatus === "Distributed" && (
                              <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded text-[9.5px] font-bold border border-indigo-500/20">
                                <FileText className="size-3" /> Proof Filed
                              </span>
                            )}
                            {row.agencyStatus === "Verified" && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded text-[9.5px] font-bold border border-emerald-500/20">
                                <ShieldCheck className="size-3" /> Verified
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center print:hidden" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleDelete(row.id, e)}
                              className="p-1 hover:bg-rose-500/10 text-rose-500 rounded transition"
                              title="Delete record"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No Zakat assignments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow panel removed as per user request */}
          </div>
        </div>
      </main>

      {/* MODAL: Assign Zakat */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 border border-border relative overflow-visible">
            <button type="button" onClick={() => setIsAssignModalOpen(false)} className="absolute right-5 top-5 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition">
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2.5 border-b border-border/50 pb-4">
              <HeartHandshake className="size-5.5 text-emerald-600" /> Assign Zakat Handover Case
            </h3>

            <form onSubmit={handleAssignZakat} className="space-y-5 text-sm font-medium overflow-visible">
              
              {/* Searchable dropdown container */}
              <div className="relative overflow-visible">
                <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1.5">
                  Search Assignee Employee (Name or ID) *
                </label>
                <div className="relative">
                  <Search className="size-4 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Type employee ID or Name to search..."
                    value={empSearchInput}
                    onChange={e => {
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
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted outline-none focus:border-emerald-500 border border-border/50 font-semibold shadow-sm transition"
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
                  <div className="absolute left-0 right-0 mt-2 max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50 divide-y divide-border/30">
                    {filteredEmployeesForDropdown.map(emp => {
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
                          className="p-3 hover:bg-muted/60 cursor-pointer text-left space-y-1 transition"
                        >
                          <div className="flex justify-between font-bold text-foreground">
                            <span>{emp.name}</span>
                            <span className="font-mono text-muted-foreground text-xs">{emp.id}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                            <span>{emp.title} • {emp.dept}</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Zakat: ৳{totals.totalZakat.toLocaleString()} | Aid: ৳{totals.totalAid.toLocaleString()}
                            </span>
                          </div>
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
                    Name: <span className="font-bold text-foreground">{newEmpName}</span><br/>
                    Role: <span className="font-bold text-foreground">{selectedEmpDetails.title}</span> • <span className="font-semibold text-foreground">{selectedEmpDetails.dept}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex justify-between border-t border-border/20 pt-2 mt-2">
                    <span>Previous Zakat: ৳{prevZakat.toLocaleString()}</span>
                    <span>Previous Aid: ৳{prevAid.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Target Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={newRecipientName}
                  onChange={e => setNewRecipientName(e.target.value)}
                  placeholder="e.g. Ayesha Begum"
                  className="w-full h-11 px-4 rounded-xl bg-background outline-none focus:border-emerald-500 border border-border/60 font-semibold shadow-sm transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Recipient Background / Justification *</label>
                <textarea
                  required
                  value={newRecipientDetails}
                  onChange={e => setNewRecipientDetails(e.target.value)}
                  placeholder="Elaborate recipient's situation for audit compliance..."
                  className="w-full h-24 p-4 rounded-xl bg-background outline-none focus:border-emerald-500 border border-border/60 resize-none shadow-sm transition"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Asnaf Category</label>
                  <select
                    value={newAsnaf}
                    onChange={e => setNewAsnaf(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl bg-background outline-none focus:border-emerald-500 border border-border/60 font-semibold text-foreground shadow-sm transition"
                  >
                    <option value="Al-Fuqara">Al-Fuqara</option>
                    <option value="Al-Masakin">Al-Masakin</option>
                    <option value="Al-Gharimin">Al-Gharimin</option>
                    <option value="Fi Sabilillah">Fi Sabilillah</option>
                    <option value="Ibnus-Sabil">Ibnus-Sabil</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full h-11 px-4 rounded-xl bg-background outline-none focus:border-emerald-500 border border-border/60 font-black text-emerald-600 shadow-sm transition text-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-background outline-none focus:border-emerald-500 border border-border/60 font-semibold shadow-sm transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="h-10 px-5 rounded-xl hover:bg-muted font-bold transition">Cancel</button>
                <button type="submit" className="h-10 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-md shadow-emerald-500/20">Assign & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Configure Budget */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-lg shadow-2xl p-6 border border-border relative">
            <button onClick={() => setIsBudgetModalOpen(false)} className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
              <Settings className="size-5 text-emerald-600" /> Configure Zakat Budget Pool
            </h3>

            <form onSubmit={handleUpdateBudget} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Total Allocated Corporate Zakat Pool (৳) *</label>
                <input
                  type="number"
                  required
                  value={tempBudgetInput}
                  onChange={e => setTempBudgetInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-muted outline-none focus:border-emerald-500 border border-border/50 font-black text-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="h-9 px-4 rounded-lg hover:bg-muted font-bold transition">Cancel</button>
                <button type="submit" className="h-9 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition">Save Pool</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Submit Handover Proof */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg shadow-2xl p-6 border border-border relative">
            <button onClick={() => setIsProofModalOpen(false)} className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
            <h3 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-5 text-indigo-600" /> Submit Handover Proof Documentation
            </h3>

            <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Receipt/Voucher Reference ID *</label>
                <input
                  type="text"
                  required
                  value={proofReceiptRef}
                  onChange={e => setProofReceiptRef(e.target.value)}
                  placeholder="e.g. REC-55234-ZK"
                  className="w-full h-9 px-3 rounded-lg bg-muted outline-none focus:border-indigo-500 border border-border/50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase text-[10px]">Witness Full Name *</label>
                  <input
                    type="text"
                    required
                    value={proofWitnessName}
                    onChange={e => setProofWitnessName(e.target.value)}
                    placeholder="e.g. Maulana Ibrahim"
                    className="w-full h-9 px-3 rounded-lg bg-muted outline-none focus:border-indigo-500 border border-border/50 font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase text-[10px]">Witness Contact Phone</label>
                  <input
                    type="text"
                    value={proofWitnessPhone}
                    onChange={e => setProofWitnessPhone(e.target.value)}
                    placeholder="e.g. 01700-000000"
                    className="w-full h-9 px-3 rounded-lg bg-muted outline-none focus:border-indigo-500 border border-border/50 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Verification Remarks / Handover Context</label>
                <textarea
                  value={proofNotes}
                  onChange={e => setProofNotes(e.target.value)}
                  placeholder="Provide context regarding the distribution meeting (e.g. location, witness details)..."
                  className="w-full h-20 p-3 rounded-lg bg-muted outline-none focus:border-indigo-500 border border-border/50 resize-none font-semibold"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsProofModalOpen(false)} className="h-9 px-4 rounded-lg hover:bg-muted font-bold transition">Cancel</button>
                <button type="submit" className="h-9 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition">Submit for HR Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
