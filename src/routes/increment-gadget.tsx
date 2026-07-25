import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { EvaluationTabNav } from "@/components/evaluation/EvaluationTabNav";
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

export const Route = createFileRoute("/increment-gadget")({
  head: () => ({
    meta: [
      { title: "Increment Gadget — CRIPTON" },
      {
        name: "description",
        content: "Parametric wage matrix appraisal configurator with active live ratios.",
      },
    ],
  }),
  component: IncrementGadgetPage,
});

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

const initialGadgetEmployees: GadgetEmployee[] = [
  {
    id: "2019013884",
    name: "Javed Mia",
    type: "Office Staff",
    newType: "Office Staff",
    department: "Admin",
    designation: "Helper (Cook)",
    newDesignation: "Helper (Cook)",
    joiningDate: "12/01/2019",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "N/A",
    oldBasic: 12720.0,
    newBasic: 12720.0,
    basicDiff: 0.0,
    oldGross: 21200.0,
    newGross: 21200.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2021022804",
    name: "Kaikobad Howlader",
    type: "Worker",
    newType: "Worker",
    department: "Admin",
    designation: "Security Guard",
    newDesignation: "Security Guard",
    joiningDate: "12/01/2021",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "N/A",
    oldBasic: 8833.33,
    newBasic: 8833.33,
    basicDiff: 0.0,
    oldGross: 15700.0,
    newGross: 15700.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2021023079",
    name: "Md. Monjur Alam",
    type: "Worker",
    newType: "Worker",
    department: "Admin",
    designation: "Driver",
    newDesignation: "Driver",
    joiningDate: "01/02/2023",
    shift: "General-Transport",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "N/A",
    oldBasic: 12966.67,
    newBasic: 12966.67,
    basicDiff: 0.0,
    oldGross: 21900.0,
    newGross: 21900.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
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
    id: "2022040132",
    name: "Md. Sakil",
    type: "Office Staff",
    newType: "Office Staff",
    department: "Admin",
    designation: "Asst. Cook",
    newDesignation: "Asst. Cook",
    joiningDate: "29/10/2022",
    shift: "Exe-Ptvl",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PTVL",
    oldBasic: 8340.0,
    newBasic: 8340.0,
    basicDiff: 0.0,
    oldGross: 13900.0,
    newGross: 13900.0,
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
  {
    id: "2023043974",
    name: "Md. Anwar Hossain",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Merchandising-Purchase-MCD",
    designation: "Asst. Manager",
    newDesignation: "Asst. Manager",
    joiningDate: "09/08/2023",
    shift: "General Shift",
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
    id: "2023044012",
    name: "Tanver Rahman Shaon",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Core Sales",
    designation: "Asst. Manager",
    newDesignation: "Asst. Manager",
    joiningDate: "01/01/2025",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 27600.0,
    newBasic: 27600.0,
    basicDiff: 0.0,
    oldGross: 46000.0,
    newGross: 46000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023044017",
    name: "Md. Rejaul Karim",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Implementation & Support (HR)",
    designation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "13/08/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 37800.0,
    newBasic: 37800.0,
    basicDiff: 0.0,
    oldGross: 63000.0,
    newGross: 63000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023044078",
    name: "Md. Anik Islam",
    type: "Office Executive",
    newType: "Office Executive",
    department: "WEB-Team",
    designation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "16/08/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 47400.0,
    newBasic: 47400.0,
    basicDiff: 0.0,
    oldGross: 79000.0,
    newGross: 79000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023045044",
    name: "Sultan Ahmed",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Business Analysis",
    designation: "Manager",
    newDesignation: "Manager",
    joiningDate: "01/10/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 48600.0,
    newBasic: 48600.0,
    basicDiff: 0.0,
    oldGross: 81000.0,
    newGross: 81000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023045146",
    name: "Asif Hossain",
    type: "Worker",
    newType: "Worker",
    department: "Admin",
    designation: "Driver",
    newDesignation: "Driver",
    joiningDate: "04/10/2023",
    shift: "General-Transport",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 12500.0,
    newBasic: 12500.0,
    basicDiff: 0.0,
    oldGross: 21200.0,
    newGross: 21200.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023046001",
    name: "Sohanur Rahman Sohan",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Admin",
    designation: "Executive",
    newDesignation: "Executive",
    joiningDate: "01/11/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "N/A",
    oldBasic: 16200.0,
    newBasic: 16200.0,
    basicDiff: 0.0,
    oldGross: 27000.0,
    newGross: 27000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023046543",
    name: "Md. Abdulla- Al- Mamun",
    type: "Office Executive",
    newType: "Office Executive",
    department: "ERP Team",
    designation: "Asst. Manager",
    newDesignation: "Asst. Manager",
    joiningDate: "02/12/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 36000.0,
    newBasic: 36000.0,
    basicDiff: 0.0,
    oldGross: 60000.0,
    newGross: 60000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2023046544",
    name: "Mazharul Haque",
    type: "Office Executive",
    newType: "Office Executive",
    department: "ERP Team",
    designation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "02/12/2023",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 40800.0,
    newBasic: 40800.0,
    basicDiff: 0.0,
    oldGross: 68000.0,
    newGross: 68000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
  {
    id: "2024046961",
    name: "Sumaya Siddika",
    type: "Office Executive",
    newType: "Office Executive",
    department: "Textile Team",
    designation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "03/01/2024",
    shift: "General Shift",
    status: "Working",
    grade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 39600.0,
    newBasic: 39600.0,
    basicDiff: 0.0,
    oldGross: 66000.0,
    newGross: 66000.0,
    grossDiff: 0.0,
    incrementGross: 0,
  },
];

function IncrementGadgetPage() {
  const router = useRouter();

  // Top level Gadget filters state
  const [year, setYear] = useState("2023");
  const [month, setMonth] = useState("Dec");
  const [gadgetMode, setGadgetMode] = useState("Regular");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [joiningYear, setJoiningYear] = useState("2023");
  const [joiningMonth, setJoiningMonth] = useState("Dec");

  // Roster Local States
  const [roster, setRoster] = useState<GadgetEmployee[]>(initialGadgetEmployees);
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Batch Configuration controllers (Row 2 Filters)
  const [batchGrade, setBatchGrade] = useState("ALL");
  const [batchBasic, setBatchBasic] = useState("");
  const [batchGross, setBatchGross] = useState("");
  const [batchIncGross, setBatchIncGross] = useState("");
  const [batchDesignation, setBatchDesignation] = useState("ALL"); // Bangladesh Labor Act Statutory Configs
  const [bllRatio, setBllRatio] = useState("60");
  const [contributePF, setContributePF] = useState(true);
  const [pfRate, setPfRate] = useState(10);
  const [batchEmpType, setBatchEmpType] = useState("ALL");

  // Sync Preselected IDs from Propose page on Mount
  useEffect(() => {
    const preselected = localStorage.getItem("gadget_preselected_empids");
    if (preselected) {
      try {
        const ids = JSON.parse(preselected);
        setSelectedEmpIds(ids);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Compute calculated metrics
  const calculatedRoster = useMemo(() => {
    return roster.map((emp) => {
      const isSelected = selectedEmpIds.includes(emp.id);
      let incrementVal = emp.incrementGross;

      // Apply batch configurations if row is checked
      if (isSelected) {
        if (batchIncGross.trim() && !isNaN(parseFloat(batchIncGross))) {
          incrementVal = parseFloat(batchIncGross);
        } else if (batchGross.trim() && !isNaN(parseFloat(batchGross))) {
          incrementVal = Math.max(0, parseFloat(batchGross) - emp.oldGross);
        }
      }

      const calculatedGross = emp.oldGross + incrementVal;
      // dynamic basic split ratio based on BLL rules (e.g. 50% for RMG, 60% standard)
      const ratio = parseFloat(bllRatio) / 100;
      const calculatedBasic = parseFloat((calculatedGross * ratio).toFixed(2));
      const basicDifference = parseFloat((calculatedBasic - emp.oldBasic).toFixed(2));
      const grossDifference = incrementVal;

      return {
        ...emp,
        incrementGross: incrementVal,
        newGross: calculatedGross,
        newBasic: calculatedBasic,
        basicDiff: basicDifference,
        grossDiff: grossDifference,
        newGrade: isSelected && batchGrade !== "ALL" ? batchGrade : emp.newGrade,
        newDesignation:
          isSelected && batchDesignation !== "ALL" ? batchDesignation : emp.newDesignation,
        newType: isSelected && batchEmpType !== "ALL" ? batchEmpType : emp.newType,
      };
    });
  }, [
    roster,
    selectedEmpIds,
    batchGrade,
    batchBasic,
    batchGross,
    batchIncGross,
    batchDesignation,
    batchEmpType,
    bllRatio,
  ]);

  // Table filter criteria
  const filteredRoster = useMemo(() => {
    return calculatedRoster.filter((emp) => {
      // empType filter
      if (empType !== "ALL" && emp.type !== empType) return false;
      // designation filter
      if (designation !== "ALL" && emp.designation !== designation) return false;
      // status filter
      if (status !== "ALL" && emp.status !== status) return false;

      // EmpId comma separator
      if (empIdFilter.trim()) {
        const qids = empIdFilter.split(",").map((id) => id.trim().toLowerCase());
        if (!qids.some((qid) => emp.id.toLowerCase().includes(qid))) return false;
      }

      // Query Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.id.includes(q) ||
          emp.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [calculatedRoster, empType, designation, status, empIdFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedEmpIds.length === filteredRoster.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredRoster.map((e) => e.id));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedEmpIds.includes(id)) {
      setSelectedEmpIds((prev) => prev.filter((e) => e !== id));
    } else {
      setSelectedEmpIds((prev) => [...prev, id]);
    }
  };

  const handleCellIncrementChange = (id: string, value: string) => {
    const val = value.trim() === "" ? 0 : parseFloat(value);
    if (!isNaN(val)) {
      setRoster((prev) =>
        prev.map((emp) => {
          if (emp.id === id) {
            return {
              ...emp,
              incrementGross: val,
            };
          }
          return emp;
        }),
      );
    }
  };

  // Submit batch configurations directly to the dynamic approval pipeline
  const handleSubmitBatch = () => {
    if (selectedEmpIds.length === 0) {
      alert("No employee rows are checked for submittal.");
      return;
    }

    const submissions = calculatedRoster.filter((e) => selectedEmpIds.includes(e.id));

    // Save custom proposals inside localStorage custom queue list
    const existingSaved = localStorage.getItem("custom_increment_queue_records");
    let currentQueue = [];
    if (existingSaved) {
      try {
        currentQueue = JSON.parse(existingSaved);
      } catch (e) {
        console.error(e);
      }
    }

    // Convert into QueueRecord format
    const formattedQueueRecords = submissions.map((sub) => ({
      sl: currentQueue.length + 1,
      empId: sub.id,
      empName: sub.name,
      department: sub.department,
      section: sub.designation,
      designation: sub.newDesignation || sub.designation,
      joiningDate: sub.joiningDate,
      prevGross: sub.oldGross,
      lastIncDate: "01/01/2026",
      lastIncAmount: sub.incrementGross,
      grossAfterInc: sub.newGross,
      // Approval audit marks
      hrApproveStatus: "Pending",
      mdApproveStatus: "Pending",
    }));

    // Deduplicate: remove if same empId already exists in queue, then merge
    const filteredOldQueue = currentQueue.filter(
      (old: any) => !formattedQueueRecords.some((n) => n.empId === old.empId),
    );
    const merged = [...filteredOldQueue, ...formattedQueueRecords];
    localStorage.setItem("custom_increment_queue_records", JSON.stringify(merged));

    // Clear proposal selections
    localStorage.removeItem("gadget_preselected_empids");
    setSelectedEmpIds([]);
    alert(
      `Batch of ${submissions.length} increments successfully submitted to Approvals pipeline.`,
    );
    router.navigate({ to: "/approve-increment-gadget" });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Card */}
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Evaluation</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Increment Configurator</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Layers className="size-5.5 text-primary" />
                <span>Increment Configurator</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Configure parametric wage matrix and appraisal rules</p>
            </div>
          </div>

          {/* Evaluation Module Tab Nav */}
          <EvaluationTabNav />

          {/* GADGET CONTROLS PANEL 1: Top parameters */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Year (Gadget)
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="2023">2023</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Month (Gadget)
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Dec">Dec</option>
                  <option value="Jan">Jan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Gadget Mode
                </label>
                <select
                  value={gadgetMode}
                  onChange={(e) => setGadgetMode(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Regular">Regular</option>
                  <option value="Special">Special</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Employee Type
                </label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Manager">Manager</option>
                  <option value="Deputy Manager">Deputy Manager</option>
                  <option value="Asst. Manager">Asst. Manager</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Working">Working</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  EmpId (Comma Separated)
                </label>
                <input
                  type="text"
                  value={empIdFilter}
                  onChange={(e) => setEmpIdFilter(e.target.value)}
                  placeholder="Input Comma As Separator"
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Joining Year
                </label>
                <select
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                    Joining Month
                  </label>
                  <select
                    value={joiningMonth}
                    onChange={(e) => setJoiningMonth(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                  >
                    <option value="Dec">Dec</option>
                    <option value="Jan">Jan</option>
                  </select>
                </div>
                <button
                  onClick={() => alert("Roster Queries Loaded.")}
                  className="h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* BANGLADESH LABOR ACT STATUTORY CONSOLE CARD */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-border/20 pb-2">
              <Sparkles className="size-4 animate-pulse text-emerald-500" />
              <span>Bangladesh Labor Act 2006 — Statutory Compliance Parameters</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Split Ratio Option */}
              <div className="space-y-1.5 p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/15">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-wide block">
                  Basic Salary split ratio
                </label>
                <select
                  value={bllRatio}
                  onChange={(e) => setBllRatio(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-card border border-emerald-500/20 text-xs font-extrabold text-emerald-700 outline-none"
                >
                  <option value="60">60% of Gross (Commercial Executive Standard)</option>
                  <option value="50">50% of Gross (RMG Factory Worker Standard)</option>
                </select>
                <p className="text-[9px] text-emerald-600/75 leading-tight">
                  Commercial/IT firms standard basic is 60% of gross salary. RMG manufacturing
                  relies on a 50% split.
                </p>
              </div>

              {/* CPF Options */}
              <div className="space-y-2 p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/15 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cpf-toggle"
                    checked={contributePF}
                    onChange={(e) => setContributePF(e.target.checked)}
                    className="rounded border-emerald-500/20 text-emerald-600 focus:ring-emerald-500/20 size-4 cursor-pointer"
                  />
                  <label
                    htmlFor="cpf-toggle"
                    className="text-[10px] font-black text-emerald-800 uppercase tracking-wide cursor-pointer select-none"
                  >
                    Contributory Provident Fund (CPF)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase">
                    Contribution Rate:
                  </span>
                  <input
                    type="number"
                    value={pfRate}
                    disabled={!contributePF}
                    onChange={(e) => setPfRate(Number(e.target.value))}
                    className="w-16 h-7 px-2 rounded bg-card border border-emerald-500/20 text-xs font-mono font-bold text-emerald-700 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-[10px] font-bold text-emerald-600">% of Basic</span>
                </div>
              </div>

              {/* Quick Legal Footnote */}
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border/20 flex items-center">
                <p className="text-[10px] font-semibold text-muted-foreground leading-normal">
                  <span className="font-extrabold text-foreground uppercase block text-[8px] tracking-wide mb-0.5">
                    BLL Chapter XVII Reference:
                  </span>
                  Section 2(49) and Chapter XVII mandate equal contributions from employees and
                  employers for CPF. Any increment to Basic Salary automatically adjusts the CPF
                  allocation.
                </p>
              </div>
            </div>
          </div>

          {/* GADGET CONTROLS PANEL 2: Batch Config Values (Row 2 Filters) */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-border/20 pb-2">
              <Sliders className="size-4" />
              <span>Batch Configurations (Applies to Checked Roster Rows)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Grade(New)
                </label>
                <select
                  value={batchGrade}
                  onChange={(e) => setBatchGrade(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase font-mono">
                  Basic(New)
                </label>
                <input
                  type="text"
                  value={batchBasic}
                  disabled
                  placeholder="60% Auto split"
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/30 text-xs font-semibold text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase font-mono">
                  Gross(New)
                </label>
                <input
                  type="text"
                  value={batchGross}
                  onChange={(e) => setBatchGross(e.target.value)}
                  placeholder="Set Target Gross..."
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-primary uppercase tracking-wider font-extrabold">
                  Increment Gross
                </label>
                <input
                  type="text"
                  value={batchIncGross}
                  onChange={(e) => setBatchIncGross(e.target.value)}
                  placeholder="Increment Gross Value..."
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-extrabold text-foreground outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Designation(New)
                </label>
                <select
                  value={batchDesignation}
                  onChange={(e) => setBatchDesignation(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Manager">Manager</option>
                  <option value="Deputy Manager">Deputy Manager</option>
                  <option value="Asst. Manager">Asst. Manager</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  EmployeeType(New)
                </label>
                <select
                  value={batchEmpType}
                  onChange={(e) => setBatchEmpType(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE ROSTER DATAGRID */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Excel Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => alert("PDF Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                  Search:
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Standard Multi-Column Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredRoster.length > 0 &&
                          selectedEmpIds.length === filteredRoster.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                      />
                    </th>
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3">Emp ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-primary">New Type</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3 text-primary">New Designation</th>
                    <th className="px-3 py-3 text-center">Joining Date</th>
                    <th className="px-3 py-3 text-center">Shift</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-3 py-3 text-center">Grade</th>
                    <th className="px-3 py-3 text-center text-primary">New Grade</th>
                    <th className="px-3 py-3 text-center">Unit</th>
                    <th className="px-4 py-3 text-right">Old Basic</th>
                    <th className="px-4 py-3 text-right text-primary">New Basic</th>
                    <th className="px-4 py-3 text-right font-bold">Basic Diff</th>
                    <th className="px-4 py-3 text-right">Old Gross</th>
                    <th className="px-4 py-3 text-right text-primary">New Gross</th>
                    <th className="px-4 py-3 text-right font-bold">Gross Diff</th>
                    <th className="px-4 py-3 text-right text-emerald-600">Old CPF</th>
                    <th className="px-4 py-3 text-right text-emerald-600">New CPF</th>
                    <th className="px-4 py-3 text-right text-emerald-600 font-bold">CPF Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRoster.map((row, idx) => {
                    const isChecked = selectedEmpIds.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRow(row.id)}
                            className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                          />
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/75 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-3 font-mono font-semibold text-foreground">
                          {row.id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground/90 font-medium">
                          {row.type}
                        </td>
                        <td className="px-4 py-3 text-primary font-semibold">{row.newType}</td>
                        <td className="px-4 py-3 text-muted-foreground/90 font-medium">
                          {row.department}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground/80">{row.designation}</td>
                        <td className="px-4 py-3 text-primary font-semibold">
                          {row.newDesignation}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">
                          {row.joiningDate}
                        </td>
                        <td className="px-3 py-3 text-center font-medium text-muted-foreground/80">
                          {row.shift}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">
                          {row.grade}
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-semibold text-primary">
                          {row.newGrade}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">
                          {row.unit}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/90">
                          ৳{row.oldBasic.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-primary">
                          ৳{row.newBasic.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                          {row.basicDiff > 0 ? `+৳${row.basicDiff.toFixed(2)}` : "৳0.00"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/90">
                          ৳{row.oldGross.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-primary">
                          ৳{row.newGross.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                          {row.grossDiff > 0 ? `+৳${row.grossDiff.toFixed(2)}` : "৳0.00"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/80">
                          ৳{(row.oldBasic * (pfRate / 100)).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                          ৳{(row.newBasic * (pfRate / 100)).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                          {row.basicDiff > 0
                            ? `+৳${((row.newBasic - row.oldBasic) * (pfRate / 100)).toFixed(2)}`
                            : "৳0.00"}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRoster.length === 0 && (
                    <tr>
                      <td
                        colSpan={21}
                        className="text-center py-10 font-bold text-muted-foreground text-xs"
                      >
                        No employees loaded inside search scope.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing 1 to {filteredRoster.length} of {filteredRoster.length} entries (Selected:{" "}
                {selectedEmpIds.length})
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmitBatch}
                  className="h-10 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
