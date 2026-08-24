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
  Sliders,
  CheckCircle2,
  ChevronDown,
  X,
  Search,
  Send,
  Building,
  ArrowUpRight,
  ListFilter
} from "lucide-react";

export const Route = createFileRoute("/increment")({
  head: () => ({
    meta: [
      { title: "Salary Increment Configurator — CRIPTON" },
      {
        name: "description",
        content: "Consolidated enterprise configurator for single salary increment workflow proposals."
      }
    ],
  }),
  component: IncrementConfiguratorPage,
});

interface EmployeeRecord {
  id: string;
  offId: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  grade: string;
  joiningDate: string;
  prevBasic: number;
  prevGross: number;
  status: string;
  shift: string;
}

const mockEmployeesList: EmployeeRecord[] = [
  { id: "2022035599", offId: "OFF-101", name: "Tahmid Afsar Shapno", type: "Staff", department: "Garment (Unit-2)", section: "Core Development", designation: "HR Director", unit: "Unit-01", line: "Line-01", grade: "Grade-1", joiningDate: "2022-05-07", prevBasic: 120000, prevGross: 201600, status: "Working", shift: "Day-Shift" },
  { id: "2021032646", offId: "OFF-102", name: "Sadiqul Islam", type: "Staff", department: "Garment (Unit-2)", section: "Core Sales", designation: "Deputy Manager", unit: "Unit-01", line: "Line-01", grade: "Grade-2", joiningDate: "2021-03-20", prevBasic: 65000, prevGross: 104500, status: "Working", shift: "Day-Shift" },
  { id: "2023051028", offId: "OFF-103", name: "Dipon Saha", type: "Staff", department: "Dyeing", section: "Production", designation: "Manager", unit: "Unit-02", line: "Line-02", grade: "Grade-1", joiningDate: "2023-04-12", prevBasic: 80000, prevGross: 129600, status: "Working", shift: "Night-Shift" },
  { id: "2022091485", offId: "OFF-104", name: "Tanzila Rahman", type: "Staff", department: "Knitting", section: "Technical", designation: "Senior Software Engineer", unit: "Unit-01", line: "Line-03", grade: "Grade-2", joiningDate: "2022-09-14", prevBasic: 50000, prevGross: 85000, status: "Working", shift: "Day-Shift" },
  { id: "2024010502", offId: "WRK-501", name: "Md. Karim Uddin", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Senior Operator", unit: "Unit-01", line: "Line-02", grade: "Grade-3", joiningDate: "2024-01-05", prevBasic: 15000, prevGross: 26000, status: "Working", shift: "Day-Shift" },
  { id: "2024010503", offId: "WRK-502", name: "Md. Jamil Hossain", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Operator", unit: "Unit-01", line: "Line-02", grade: "Grade-4", joiningDate: "2024-01-10", prevBasic: 12000, prevGross: 21000, status: "Working", shift: "Night-Shift" },
  { id: "2024031508", offId: "WRK-503", name: "Rina Begum", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Helper", unit: "Unit-01", line: "Line-02", grade: "Grade-5", joiningDate: "2024-03-15", prevBasic: 9500, prevGross: 16500, status: "Working", shift: "Day-Shift" },
  { id: "2025021811", offId: "WRK-504", name: "Fatema Khatun", type: "Worker", department: "Garment (Unit-2)", section: "Finishing Section", designation: "Ironer", unit: "Unit-02", line: "Line-03", grade: "Grade-4", joiningDate: "2025-02-18", prevBasic: 11000, prevGross: 19500, status: "Working", shift: "Day-Shift" },
];

function IncrementConfiguratorPage() {
  const router = useRouter();

  // --- TOP PANEL: EMPLOYEE SEARCH STATES ---
  const [selectedIdInput, setSelectedIdInput] = useState(mockEmployeesList[4].id);
  const [activeEmp, setActiveEmp] = useState<EmployeeRecord | null>(mockEmployeesList[4]);

  // --- BOTTOM PANEL: INCREMENT VALUES STATES ---
  const [effYear, setEffYear] = useState("2026");
  const [effMonth, setEffMonth] = useState("Aug");
  const [incDate, setIncDate] = useState("2026-08-01");
  const [incType, setIncType] = useState("General");
  const [incBy, setIncBy] = useState<"Basic" | "Gross">("Gross");
  const [calBy, setCalBy] = useState<"Fixed" | "Percentage">("Fixed");
  const [isArrear, setIsArrear] = useState(false);
  
  const [incrementVal, setIncrementVal] = useState<number>(1350);
  
  const [promType, setPromType] = useState("ALL");
  const [promJobTitle, setPromJobTitle] = useState("ALL");
  const [newGrade, setNewGrade] = useState("");
  const [remarks, setRemarks] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Click Show button to fetch details
  const handleShowEmployee = () => {
    const found = mockEmployeesList.find(e => e.id === selectedIdInput);
    if (found) {
      setActiveEmp(found);
      showToast(`Employee record loaded: ${found.name}`);
    } else {
      alert("Employee ID not found.");
    }
  };

  // Perform dynamic calculations based on the inputs
  const calculations = useMemo(() => {
    if (!activeEmp) {
      return {
        incAmount: 0,
        newGross: 0,
        newBasic: 0,
        houseRent: 0,
        medical: 0,
        conveyance: 0,
        food: 0
      };
    }

    const prevGross = activeEmp.prevGross;
    const prevBasic = activeEmp.prevBasic;
    let incAmount = 0;

    const baseSalary = incBy === "Basic" ? prevBasic : prevGross;
    if (calBy === "Percentage") {
      incAmount = Math.round(baseSalary * (incrementVal / 100));
    } else {
      incAmount = incrementVal;
    }

    const newGross = prevGross + incAmount;
    
    // Proportional basic split or basic increase based on increment type
    let newBasic = prevBasic;
    if (incBy === "Basic") {
      newBasic = prevBasic + incAmount;
    } else {
      // split proportional (60% split matching statutory ratios)
      newBasic = prevBasic + Math.round(incAmount * 0.6);
    }

    // Allowances calculations
    // House Rent: 50% of Basic
    const houseRent = Math.round(newBasic * 0.5);
    // Medical: Flat standard
    const medical = 1500;
    // Conveyance: e.g. 10% of Basic
    const conveyance = Math.round(newBasic * 0.1);
    // Food: Flat standard
    const food = 2000;

    return {
      incAmount,
      newGross,
      newBasic,
      houseRent,
      medical,
      conveyance,
      food
    };
  }, [activeEmp, incBy, calBy, incrementVal]);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) {
      alert("Please select and load an employee first.");
      return;
    }

    // Save proposed item directly to queue local storage
    const newRec = {
      action: "edit",
      id: `inc-${Date.now()}`,
      empId: activeEmp.id,
      empName: activeEmp.name,
      department: activeEmp.department,
      section: activeEmp.section,
      designation: activeEmp.designation,
      joiningDate: activeEmp.joiningDate,
      prevGross: activeEmp.prevGross.toFixed(2),
      lastIncDate: "—",
      lastIncAmount: "—",
      grossAfterInc: calculations.newGross.toFixed(2),
      year: effYear,
      month: effMonth,
      status: activeEmp.status,
      approved: false,
      hrEndorsed: false
    };

    const existing = localStorage.getItem("custom_increment_queue_records");
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newRec);
    localStorage.setItem("custom_increment_queue_records", JSON.stringify(list));

    showToast(`Increment proposal of ৳${calculations.incAmount.toLocaleString()} submitted successfully for ${activeEmp.name}!`);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Page Header (Consolidated to one line) */}
          <div className="flex items-center justify-between gap-4 print:hidden py-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors text-muted-foreground">
                Home
              </Link>
              <ChevronRight className="size-2.5 text-muted-foreground/60" />
              <span className="hover:text-primary transition-colors text-muted-foreground">Evaluation</span>
              <ChevronRight className="size-2.5 text-muted-foreground/60" />
              <span className="text-foreground font-black">Increment (Single)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                Calculations: Live
              </span>
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

          {/* 1. EMPLOYEE SEARCH & DETAILS PANEL */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden space-y-4">
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <User className="size-4.5 text-primary" />
              <span>Employee Information Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Employee ID Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Employee Id
                </label>
                <select
                  value={selectedIdInput}
                  onChange={(e) => setSelectedIdInput(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="">--Select ID--</option>
                  {mockEmployeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} ({emp.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.name : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Sub Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Sub Department
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.section : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Job Title
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.designation : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Unit
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.unit : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Shift */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Shift
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.shift : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Grade
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.grade : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Line */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Line
                </label>
                <input
                  type="text"
                  value={activeEmp ? activeEmp.line : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Basic Salary */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Basic Salary
                </label>
                <input
                  type="text"
                  value={activeEmp ? `৳${activeEmp.prevBasic.toLocaleString()}` : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* Gross Salary */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Gross Salary
                </label>
                <input
                  type="text"
                  value={activeEmp ? `৳${activeEmp.prevGross.toLocaleString()}` : ""}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-semibold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Top card action trigger */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleShowEmployee}
                className="h-10 px-6 bg-primary hover:bg-primary-glow text-primary-foreground text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                SHOW
              </button>
            </div>
          </div>

          {/* 2. INCREMENT DETAILS CONFIGURATION PANEL (Unified 6-column Grid) */}
          <form
            onSubmit={handleSubmitProposal}
            className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden space-y-5"
          >
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-success/10 via-success/45 to-success/10" />
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="size-4.5 text-success" />
              <span>Increment Configuration Rules</span>
            </h3>

            {/* Unified 6-column Grid Row Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* --- Row 1 Fields --- */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Effective Year
                </label>
                <select
                  value={effYear}
                  onChange={(e) => setEffYear(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Effective Month
                </label>
                <select
                  value={effMonth}
                  onChange={(e) => setEffMonth(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Jan">Jan</option>
                  <option value="Feb">Feb</option>
                  <option value="Mar">Mar</option>
                  <option value="Apr">Apr</option>
                  <option value="May">May</option>
                  <option value="Jun">Jun</option>
                  <option value="Jul">Jul</option>
                  <option value="Aug">Aug</option>
                  <option value="Sep">Sep</option>
                  <option value="Oct">Oct</option>
                  <option value="Nov">Nov</option>
                  <option value="Dec">Dec</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment Date
                </label>
                <input
                  type="date"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment Type
                </label>
                <select
                  value={incType}
                  onChange={(e) => setIncType(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Special">Special</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Promotion">Promotion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment By
                </label>
                <select
                  value={incBy}
                  onChange={(e) => setIncBy(e.target.value as "Basic" | "Gross")}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Gross">Gross</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Cal By
                </label>
                <select
                  value={calBy}
                  onChange={(e) => setCalBy(e.target.value as "Fixed" | "Percentage")}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              {/* --- Row 2 Fields --- */}
              {/* Combine Arrear Checkbox + Increment input in Column 1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment
                </label>
                <div className="flex items-center gap-2.5 h-10">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer select-none whitespace-nowrap bg-muted border border-border/30 px-3 h-full rounded-xl hover:bg-muted/75 transition">
                    <input
                      type="checkbox"
                      checked={isArrear}
                      onChange={(e) => setIsArrear(e.target.checked)}
                      className="rounded border-border/40 text-primary focus:ring-primary/20 size-4 cursor-pointer"
                    />
                    <span>Arrear</span>
                  </label>
                  <input
                    type="number"
                    value={incrementVal}
                    onChange={(e) => setIncrementVal(parseInt(e.target.value) || 0)}
                    className="w-full h-full px-3 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  IncBasic Salary
                </label>
                <input
                  type="text"
                  value={`৳${calculations.newBasic.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  IncGross Salary
                </label>
                <input
                  type="text"
                  value={`৳${calculations.newGross.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Inc Amount
                </label>
                <input
                  type="text"
                  value={`৳${calculations.incAmount.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  House Rent
                </label>
                <input
                  type="text"
                  value={`৳${calculations.houseRent.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Medical
                </label>
                <input
                  type="text"
                  value={`৳${calculations.medical.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              {/* --- Row 3 Fields --- */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Convance
                </label>
                <input
                  type="text"
                  value={`৳${calculations.conveyance.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Food
                </label>
                <input
                  type="text"
                  value={`৳${calculations.food.toLocaleString()}`}
                  readOnly
                  className="w-full h-10 px-3.5 bg-muted/60 border border-border/30 rounded-xl text-xs font-mono font-bold text-foreground/80 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Prom Type
                </label>
                <select
                  value={promType}
                  onChange={(e) => setPromType(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              {/* Prom Job Title (Spans 2 columns: matches 4th and 5th vertical columns) */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Prom Job Title
                </label>
                <select
                  value={promJobTitle}
                  onChange={(e) => setPromJobTitle(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="HR Director">HR Director</option>
                  <option value="Deputy Manager">Deputy Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="Asst. Manager">Asst. Manager</option>
                  <option value="Senior Operator">Senior Operator</option>
                  <option value="Operator">Operator</option>
                  <option value="Helper">Helper</option>
                  <option value="Ironer">Ironer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  New Grade
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="">--Select--</option>
                  <option value="Grade-1">Grade-1</option>
                  <option value="Grade-2">Grade-2</option>
                  <option value="Grade-3">Grade-3</option>
                  <option value="Grade-4">Grade-4</option>
                  <option value="Grade-5">Grade-5</option>
                </select>
              </div>

              {/* --- Row 4: Remarks (Spans all 6 columns) --- */}
              <div className="space-y-1.5 lg:col-span-6">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter appraisal context, review remarks, or comments..."
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Bottom card submit trigger (Consistent with Multi page buttons) */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="h-10 px-8 bg-primary hover:bg-primary-glow text-primary-foreground text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="size-3.5" /> SUBMIT
              </button>
            </div>
          </form>

          {/* Thin Spacer Footer (Matches screenshot border spacer) */}
          <div className="bg-card border border-border/80 rounded-2xl h-14 shadow-xs flex items-center px-6 text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-wider select-none relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <span>Ready for Proposal Submissions</span>
          </div>
        </div>
      </main>
    </div>
  );
}
