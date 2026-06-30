import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Sparkles,
  User,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Layers,
  Users,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ListFilter,
  AlertCircle,
  Send,
  X,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/increment")({
  head: () => ({
    meta: [
      { title: "Salary Increment Configurator — CRIPTON" },
      {
        name: "description",
        content:
          "Consolidated enterprise configurator for salary scale adjustments, bulk processes, and single increment workflow proposals.",
      },
    ],
  }),
  component: IncrementConfiguratorPage,
});

interface SimpleEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  currentSalary: number;
}

interface GadgetEmployee {
  id: string;
  name: string;
  type: string;
  newType: string;
  department: string;
  designation: string;
  newDesignation: string;
  joiningDate: string;
  shift: string;
  status: string;
  grade: string;
  newGrade: string;
  unit: string;
  oldBasic: number;
  newBasic: number;
  basicDiff: number;
  oldGross: number;
  newGross: number;
  grossDiff: number;
  incrementGross: number;
}

const mockEmployees: SimpleEmployee[] = [
  {
    id: "2022035599",
    name: "Tahmid Afsar Shapno",
    designation: "HR Director",
    department: "Core Development (HR)",
    currentSalary: 201600,
  },
  {
    id: "2021032646",
    name: "Sadiqul Islam",
    designation: "Deputy Manager",
    department: "Core Sales",
    currentSalary: 104500,
  },
  {
    id: "2023051028",
    name: "Dipon Saha",
    designation: "Manager",
    department: "Core Development (HR)",
    currentSalary: 129600,
  },
  {
    id: "2022091485",
    name: "Tanzila Rahman",
    designation: "Senior Software Engineer",
    department: "Tech Core",
    currentSalary: 126500,
  },
  {
    id: "2024018847",
    name: "Fahim Ahmed",
    designation: "UI/UX Designer",
    department: "Creative Design",
    currentSalary: 71500,
  },
  {
    id: "2022119932",
    name: "Nabil Chowdhury",
    designation: "Sales Lead",
    department: "Core Sales",
    currentSalary: 90950,
  },
];

const initialGadgetEmployees: GadgetEmployee[] = [
  {
    id: "2021028542",
    name: "Zakir Hossain",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Implementation & Support (HR)",
    designation: "Executive",
    newDesignation: "Executive",
    joiningDate: "09/10/2021",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 18900.0,
    newBasic: 18900.0,
    basicDiff: 0.0,
    oldGross: 31500.0,
    newGross: 31500.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2021032646",
    name: "Sadiqul Islam",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Core Sales",
    designation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "22/12/2021",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 35400.0,
    newBasic: 35400.0,
    basicDiff: 0.0,
    oldGross: 59000.0,
    newGross: 59000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2022035599",
    name: "Dipon Saha",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Core Development (HR)",
    designation: "Manager",
    newDesignation: "Manager",
    joiningDate: "07/05/2022",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 40200.0,
    newBasic: 40200.0,
    basicDiff: 0.0,
    oldGross: 67000.0,
    newGross: 67000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2022041203",
    name: "Khairul Bashar Masum",
    type: "Office Executive",
    newType: "Office Executive",
    department: "HR Team",
    designation: "Asst. Manager",
    newDesignation: "Asst. Manager",
    joiningDate: "01/12/2022",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 27900.0,
    newBasic: 27900.0,
    basicDiff: 0.0,
    oldGross: 46500.0,
    newGross: 46500.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023043021",
    name: "Easin Mia",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Admin",
    designation: "Receptionist",
    newDesignation: "Receptionist",
    joiningDate: "01/02/2023",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 11400.0,
    newBasic: 11400.0,
    basicDiff: 0.0,
    oldGross: 19000.0,
    newGross: 19000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023043909",
    name: "Md. Ashanur Kabir",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Digital Marketing",
    designation: "Manager",
    newDesignation: "Manager",
    joiningDate: "01/08/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 43800.0,
    newBasic: 43800.0,
    basicDiff: 0.0,
    oldGross: 73000.0,
    newGross: 73000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023043910",
    name: "Tahmid Afsar",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Project Resource & Strategy",
    designation: "Asst. Manager",
    newDesignation: "Asst. Manager",
    joiningDate: "01/08/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 31200.0,
    newBasic: 31200.0,
    basicDiff: 0.0,
    oldGross: 52000.0,
    newGross: 52000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
];

function IncrementConfiguratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"single" | "batch" | "rules">("batch");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- STATUTORY SCALE RULES STATE ---
  const [basicRatio, setBasicRatio] = useState<number>(60);
  const [houseRentRatio, setHouseRentRatio] = useState<number>(50);
  const [medicalAllowance, setMedicalAllowance] = useState<number>(500);
  const [arrearThreshold, setArrearThreshold] = useState<number>(30);

  // --- SINGLE PROPOSAL STATE ---
  const [selectedEmpId, setSelectedEmpId] = useState(mockEmployees[0].id);
  const [percent, setPercent] = useState<number>(10.0);
  const [amount, setAmount] = useState<number>(20160);
  const [remarks, setRemarks] = useState("Outstanding performance appraisal clearance.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeEmp = useMemo(() => {
    return mockEmployees.find((e) => e.id === selectedEmpId) || mockEmployees[0];
  }, [selectedEmpId]);

  // Load pre-selected employee from local storage if redirected from Increment Process
  useEffect(() => {
    const preselected = localStorage.getItem("preselected_increment_empid");
    if (preselected) {
      setSelectedEmpId(preselected);
      localStorage.removeItem("preselected_increment_empid");
      setActiveTab("single");
      showToast(`Appraisal dossier for employee loaded successfully.`);
    }
  }, []);

  useEffect(() => {
    const computed = Math.round((activeEmp.currentSalary * percent) / 100);
    setAmount(computed);
  }, [percent, selectedEmpId, activeEmp]);

  const handlePercentChange = (val: number) => {
    setPercent(val);
  };

  const handleAmountChange = (val: number) => {
    setAmount(val);
    if (activeEmp.currentSalary > 0) {
      const calculatedPercent = (val / activeEmp.currentSalary) * 100;
      setPercent(parseFloat(calculatedPercent.toFixed(1)));
    }
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        `Increment proposal of ৳${amount.toLocaleString()} submitted successfully for ${activeEmp.name}!`,
      );

      // Save proposed item directly to queue local storage
      const newRec = {
        action: "edit",
        id: (Math.random() * 100).toString(),
        empId: activeEmp.id,
        empName: activeEmp.name,
        department: activeEmp.department,
        section: "General Operations",
        designation: activeEmp.designation,
        joiningDate: "12/10/2023",
        prevGross: activeEmp.currentSalary.toFixed(2),
        lastIncDate: "—",
        lastIncAmount: "—",
        grossAfterInc: (activeEmp.currentSalary + amount).toFixed(2),
        year: "2025",
        month: "Dec",
        status: "Working",
        approved: false,
        hrEndorsed: false,
      };
      const existing = localStorage.getItem("custom_increment_queue_records");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRec);
      localStorage.setItem("custom_increment_queue_records", JSON.stringify(list));
    }, 1200);
  };

  // --- BATCH GADGET PROCESSOR STATE ---
  const [gadgetEmployees, setGadgetEmployees] = useState<GadgetEmployee[]>(initialGadgetEmployees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters parameters
  const [gadgetYear, setGadgetYear] = useState("2025");
  const [gadgetMonth, setGadgetMonth] = useState("Dec");
  const [gadgetMode, setGadgetMode] = useState("Regular");
  const [gadgetEmpType, setGadgetEmpType] = useState("Office Executive");
  const [gadgetSection, setGadgetSection] = useState("ALL");
  const [gadgetUnit, setGadgetUnit] = useState("ALL");
  const [gadgetDesignation, setGadgetDesignation] = useState("ALL");
  const [gadgetGrade, setGadgetGrade] = useState("ALL");
  const [gadgetStatus, setGadgetStatus] = useState("Working");
  const [gadgetJoiningYear, setGadgetJoiningYear] = useState("2023");
  const [gadgetJoiningMonth, setGadgetJoiningMonth] = useState("Dec");

  // Dynamic calculations when Increment Gross changes
  const handleInlineIncrementChange = (id: string, val: number) => {
    setGadgetEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const newGross = emp.oldGross + val;
          // Basic split computed based on scale param rule (default 60%)
          const newBasic = Math.round((newGross * basicRatio) / 100);
          return {
            ...emp,
            incrementGross: val,
            newGross,
            grossDiff: val,
            newBasic,
            basicDiff: newBasic - emp.oldBasic,
          };
        }
        return emp;
      }),
    );
  };

  const handleInlineSelectChange = (
    id: string,
    field: "newType" | "newDesignation" | "newGrade",
    val: string,
  ) => {
    setGadgetEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            [field]: val,
          };
        }
        return emp;
      }),
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(gadgetEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      showToast("Please check at least one employee row to process!");
      return;
    }

    const processed = gadgetEmployees.filter((emp) => selectedIds.includes(emp.id));

    // Save to custom queue records in local storage
    const existing = localStorage.getItem("custom_increment_queue_records");
    const list = existing ? JSON.parse(existing) : [];

    processed.forEach((emp) => {
      const newRec = {
        action: "edit",
        id: emp.id,
        empId: emp.id,
        empName: emp.name,
        department: emp.department,
        section: gadgetSection === "ALL" ? "General Support" : gadgetSection,
        designation: emp.newDesignation,
        joiningDate: emp.joiningDate,
        prevGross: emp.oldGross.toFixed(2),
        lastIncDate: "01/01/2025",
        lastIncAmount: emp.incrementGross.toFixed(2),
        grossAfterInc: emp.newGross.toFixed(2),
        year: gadgetYear,
        month: gadgetMonth,
        status: emp.status,
        approved: false,
        hrEndorsed: false,
      };

      // Prevent duplicates in queue
      const existingIdx = list.findIndex((x: any) => x.empId === emp.id);
      if (existingIdx > -1) {
        list[existingIdx] = newRec;
      } else {
        list.unshift(newRec);
      }
    });

    localStorage.setItem("custom_increment_queue_records", JSON.stringify(list));
    showToast(
      `Batch processing submitted successfully for ${processed.length} employees to the Approvals Console!`,
    );
    setSelectedIds([]);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Statutory scales and allocation ratios updated successfully.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Breadcrumb and Page Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Evaluation</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Salary Increment Configurator</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Increment Configurator Workspace
                </h1>
              </div>
            </div>

            {/* Quick stats indicators */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Calculations
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">Automated</div>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-primary">
                  System Base
                </div>
                <div className="text-sm font-extrabold text-primary mt-0.5">Gross Adjusted</div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="size-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-semibold">{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Tab Selection Hub */}
          <div className="bg-card rounded-lg border border-border/80 p-1.5 shadow-2xs flex gap-1 print:hidden">
            <button
              onClick={() => setActiveTab("batch")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "batch" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <Layers className="size-3.5" />
              <span>🎛️ Increment Gadget Console</span>
            </button>
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "single" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <User className="size-3.5" />
              <span>👤 Single Propose</span>
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "rules" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`}
            >
              <Sliders className="size-3.5" />
              <span>⚙️ Ratios Allocation Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* TAB 1: INCREMENT GADGET BATCH PROCESSING */}
            {activeTab === "batch" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 11 Filters Configuration Grid (Matched Legacy Screenshot) */}
                <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-1.5">
                    <ListFilter className="size-4.5 text-primary" />
                    <span>Gadget Query & Parametric Filter Console</span>
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Year (Gadget)
                      </label>
                      <select
                        value={gadgetYear}
                        onChange={(e) => setGadgetYear(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Month (Gadget)
                      </label>
                      <select
                        value={gadgetMonth}
                        onChange={(e) => setGadgetMonth(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="Dec">Dec</option>
                        <option value="Jan">Jan</option>
                        <option value="May">May</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Gadget Mode
                      </label>
                      <select
                        value={gadgetMode}
                        onChange={(e) => setGadgetMode(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Special">Special Mode</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Employee Type
                      </label>
                      <select
                        value={gadgetEmpType}
                        onChange={(e) => setGadgetEmpType(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="Office Executive">Office Executive</option>
                        <option value="Factory worker">Factory staff</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Section
                      </label>
                      <select
                        value={gadgetSection}
                        onChange={(e) => setGadgetSection(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="ALL">ALL</option>
                        <option value="HR">HR Team</option>
                        <option value="Creative">Creative</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Unit
                      </label>
                      <select
                        value={gadgetUnit}
                        onChange={(e) => setGadgetUnit(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="ALL">ALL</option>
                        <option value="PSL">PSL Unit</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Designation
                      </label>
                      <select
                        value={gadgetDesignation}
                        onChange={(e) => setGadgetDesignation(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Manager">Manager</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Grade
                      </label>
                      <select
                        value={gadgetGrade}
                        onChange={(e) => setGadgetGrade(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="ALL">ALL</option>
                        <option value="None">None</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Status
                      </label>
                      <select
                        value={gadgetStatus}
                        onChange={(e) => setGadgetStatus(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="Working">Working</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Joining Year
                      </label>
                      <select
                        value={gadgetJoiningYear}
                        onChange={(e) => setGadgetJoiningYear(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-muted-foreground">
                        Joining Month
                      </label>
                      <select
                        value={gadgetJoiningMonth}
                        onChange={(e) => setGadgetJoiningMonth(e.target.value)}
                        className="w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold"
                      >
                        <option value="Dec">Dec</option>
                        <option value="Jan">Jan</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 flex items-end">
                      <button
                        onClick={() =>
                          showToast("Search parameters locked. Showing matching ledger accounts.")
                        }
                        className="w-full h-8.5 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-[10px] rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        <Search className="size-3.5" /> Search Gadget
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Datagrid Container */}
                <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary">
                        {selectedIds.length} Checked
                      </span>
                      <h3 className="text-xs font-black uppercase text-foreground">
                        Interactive Compensation Ledger Sheet
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => alert("Excel export initiated.")}
                        className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-extrabold text-muted-foreground transition flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="size-3.5" /> Excel
                      </button>
                      <button
                        onClick={() => alert("Print document ready.")}
                        className="h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-extrabold text-muted-foreground transition flex items-center gap-1.5"
                      >
                        <Printer className="size-3.5" /> Print
                      </button>
                    </div>
                  </div>

                  {/* Wide Interactive Table Scroll view */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                          <th className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.length === gadgetEmployees.length}
                              onChange={handleSelectAll}
                              className="rounded border-border text-primary focus:ring-primary/20 size-4 cursor-pointer"
                            />
                          </th>
                          <th className="px-2 py-3 text-center">#</th>
                          <th className="px-3 py-3">Emp ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Employee Type (New)</th>
                          <th className="px-4 py-3">Department</th>
                          <th className="px-4 py-3">Designation (New)</th>
                          <th className="px-4 py-3">Joining Date</th>
                          <th className="px-3 py-3">Shift</th>
                          <th className="px-3 py-3">Grade (New)</th>
                          <th className="px-3 py-3">Unit</th>
                          <th className="px-4 py-3 text-right">Old Basic</th>
                          <th className="px-4 py-3 text-right text-primary">New Basic</th>
                          <th className="px-4 py-3 text-right text-primary">Basic Diff</th>
                          <th className="px-4 py-3 text-right">Old Gross</th>
                          <th className="px-4 py-3 text-right text-emerald-600">New Gross</th>
                          <th className="px-4 py-3 text-right text-emerald-600">Gross Diff</th>
                          <th className="px-4 py-3 text-center bg-primary/5 border-x border-primary/20">
                            Increment Gross
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {gadgetEmployees.map((emp, index) => {
                          const isChecked = selectedIds.includes(emp.id);
                          return (
                            <tr
                              key={emp.id}
                              className={`transition ${isChecked ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "hover:bg-muted/40"}`}
                            >
                              <td className="px-3 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleSelectRow(emp.id)}
                                  className="rounded border-border text-primary focus:ring-primary/20 size-4 cursor-pointer"
                                />
                              </td>
                              <td className="px-2 py-3 text-center font-mono font-bold text-muted-foreground/60">
                                {index + 1}
                              </td>
                              <td className="px-3 py-3 font-mono font-black text-foreground">
                                {emp.id}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-extrabold text-foreground">{emp.name}</div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={emp.newType}
                                  onChange={(e) =>
                                    handleInlineSelectChange(emp.id, "newType", e.target.value)
                                  }
                                  className="h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold"
                                >
                                  <option value="Office Executive">Office Executive</option>
                                  <option value="Factory Worker">Factory Worker</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-semibold">
                                {emp.department}
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={emp.newDesignation}
                                  onChange={(e) =>
                                    handleInlineSelectChange(
                                      emp.id,
                                      "newDesignation",
                                      e.target.value,
                                    )
                                  }
                                  className="h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold"
                                >
                                  <option value="Executive">Executive</option>
                                  <option value="Deputy Manager">Deputy Manager</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Asst. Manager">Asst. Manager</option>
                                  <option value="Receptionist">Receptionist</option>
                                  <option value="Sr. Manager">Sr. Manager</option>
                                  <option value="Sr. Executive">Sr. Executive</option>
                                  <option value="QA Engineer">QA Engineer</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 font-mono font-semibold text-muted-foreground/80">
                                {emp.joiningDate}
                              </td>
                              <td className="px-3 py-3 font-mono font-semibold text-muted-foreground">
                                {emp.shift}
                              </td>
                              <td className="px-3 py-3">
                                <select
                                  value={emp.newGrade}
                                  onChange={(e) =>
                                    handleInlineSelectChange(emp.id, "newGrade", e.target.value)
                                  }
                                  className="h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold"
                                >
                                  <option value="None">None</option>
                                  <option value="Grade-1">Grade-1</option>
                                  <option value="Grade-2">Grade-2</option>
                                </select>
                              </td>
                              <td className="px-3 py-3 font-mono font-bold text-muted-foreground">
                                {emp.unit}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-semibold">
                                ৳{emp.oldBasic.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-black text-primary">
                                ৳{emp.newBasic.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-primary">
                                +৳{emp.basicDiff.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-semibold">
                                ৳{emp.oldGross.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-black text-emerald-600">
                                ৳{emp.newGross.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                                +৳{emp.grossDiff.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-center bg-primary/5 border-x border-primary/20">
                                <input
                                  type="number"
                                  min="0"
                                  step="500"
                                  value={emp.incrementGross}
                                  onChange={(e) =>
                                    handleInlineIncrementChange(
                                      emp.id,
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-24 h-7 px-2.5 rounded-lg bg-card border border-primary/30 outline-none focus:border-primary text-center font-mono font-black text-xs text-primary"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-border/20">
                    <button
                      onClick={handleBatchSubmit}
                      disabled={selectedIds.length === 0}
                      className="h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:opacity-95 transition uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" /> Submit Batch Gadget Increments
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SINGLE PROPOSAL */}
            {activeTab === "single" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
                {/* Proposal Setup Form */}
                <form
                  onSubmit={handleSingleSubmit}
                  className="lg:col-span-7 bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-6"
                >
                  <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Sparkles className="size-4.5 text-primary" />
                    <span>Configure Single Appraised Adjustment</span>
                  </h3>

                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase font-black">
                      Select Employee *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedEmpId}
                        onChange={(e) => setSelectedEmpId(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl bg-muted border border-border/40 text-xs font-bold appearance-none cursor-pointer"
                        disabled={isSubmitting}
                      >
                        {mockEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.designation} — {emp.department})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted-foreground uppercase font-black">
                        Increment Percent (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="100"
                        value={percent}
                        onChange={(e) => handlePercentChange(parseFloat(e.target.value) || 0)}
                        className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 outline-none focus:border-primary transition text-xs font-mono font-black text-foreground"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-muted-foreground uppercase font-black">
                        Increment Amount (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                        className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 outline-none focus:border-primary transition text-xs font-mono font-black text-foreground"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase font-black">
                      Performance Justification *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add justifications note..."
                      className="w-full p-3.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex justify-end pt-3 border-t border-border/30">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" /> Submit Proposal
                    </button>
                  </div>
                </form>

                {/* Ledger Outlay Visualizer Card */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs relative overflow-hidden bg-gradient-to-b from-card to-green-500/[0.01]">
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500" />

                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-1.5">
                      <TrendingUp className="size-4 animate-pulse" />
                      <span>Ledger Growth Summary</span>
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            Current Gross
                          </span>
                          <div className="text-sm font-black text-foreground font-mono mt-0.5">
                            ৳{activeEmp.currentSalary.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
                            Adjustment
                          </span>
                          <div className="text-sm font-black text-emerald-600 font-mono mt-0.5">
                            +৳{amount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/40 rounded-xl border border-border/40 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary">
                            New Gross
                          </span>
                          <div className="text-base font-black text-primary font-mono mt-0.5">
                            ৳{(activeEmp.currentSalary + amount).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            Growth
                          </span>
                          <div className="text-xs font-black text-emerald-600 mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                            +{percent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SCALE RULES & PARAMETERS */}
            {activeTab === "rules" && (
              <form
                onSubmit={handleSaveRules}
                className="bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-6 animate-in fade-in duration-200"
              >
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sliders className="size-4.5 text-primary" />
                  <span>Statutory Wage Allocation Rules</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">
                      Basic Salary Ratio (%)
                    </label>
                    <input
                      type="number"
                      value={basicRatio}
                      onChange={(e) => setBasicRatio(parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">
                      House Rent Allocation (%)
                    </label>
                    <input
                      type="number"
                      value={houseRentRatio}
                      onChange={(e) => setHouseRentRatio(parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">
                      Medical standard flat (৳)
                    </label>
                    <input
                      type="number"
                      value={medicalAllowance}
                      onChange={(e) => setMedicalAllowance(parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">
                      Arrear calculation threshold (days)
                    </label>
                    <input
                      type="number"
                      value={arrearThreshold}
                      onChange={(e) => setArrearThreshold(parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-2.5">
                  <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-muted-foreground font-semibold leading-relaxed">
                    Scaling rules are applied instantly by the live calculation engine when
                    proposing new salary packages. Changing ratios will not affect historical
                    records, but will apply to all pending increment queues.
                  </p>
                </div>

                <div className="flex justify-end pt-3 border-t border-border/30">
                  <button
                    type="submit"
                    className="h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:opacity-95 transition uppercase tracking-wider"
                  >
                    Save Allocations Rules
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
