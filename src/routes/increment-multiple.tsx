import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Check,
  X,
  Layers,
  Settings,
  Plus,
  ChevronDown,
  User,
  Cpu,
  Eye,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  ListFilter,
  DollarSign,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/increment-multiple")({
  head: () => ({
    meta: [
      { title: "Increment (Multi) — CRIPTON" },
      { name: "description", content: "Bulk processing and department-wide increment adjustments." }
    ],
  }),
  component: IncrementMultiPage,
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
}

const mockEmployeesList: EmployeeRecord[] = [
  { id: "2022035599", offId: "OFF-101", name: "Tahmid Afsar Shapno", type: "Staff", department: "Garment (Unit-2)", section: "Core Development", designation: "HR Director", unit: "Unit-01", line: "Line-01", grade: "Grade-1", joiningDate: "2022-05-07", prevBasic: 120000, prevGross: 201600, status: "Working" },
  { id: "2021032646", offId: "OFF-102", name: "Sadiqul Islam", type: "Staff", department: "Garment (Unit-2)", section: "Core Sales", designation: "Deputy Manager", unit: "Unit-01", line: "Line-01", grade: "Grade-2", joiningDate: "2021-03-20", prevBasic: 65000, prevGross: 104500, status: "Working" },
  { id: "2023051028", offId: "OFF-103", name: "Dipon Saha", type: "Staff", department: "Dyeing", section: "Production", designation: "Manager", unit: "Unit-02", line: "Line-02", grade: "Grade-1", joiningDate: "2023-04-12", prevBasic: 80000, prevGross: 129600, status: "Working" },
  { id: "2022091485", offId: "OFF-104", name: "Tanzila Rahman", type: "Staff", department: "Knitting", section: "Technical", designation: "Senior Software Engineer", unit: "Unit-01", line: "Line-03", grade: "Grade-2", joiningDate: "2022-09-14", prevBasic: 50000, prevGross: 85000, status: "Working" },
  { id: "2024010502", offId: "WRK-501", name: "Md. Karim Uddin", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Senior Operator", unit: "Unit-01", line: "Line-02", grade: "Grade-3", joiningDate: "2024-01-05", prevBasic: 15000, prevGross: 26000, status: "Working" },
  { id: "2024010503", offId: "WRK-502", name: "Md. Jamil Hossain", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Operator", unit: "Unit-01", line: "Line-02", grade: "Grade-4", joiningDate: "2024-01-10", prevBasic: 12000, prevGross: 21000, status: "Working" },
  { id: "2024031508", offId: "WRK-503", name: "Rina Begum", type: "Worker", department: "Garment (Unit-2)", section: "Sewing Section", designation: "Helper", unit: "Unit-01", line: "Line-02", grade: "Grade-5", joiningDate: "2024-03-15", prevBasic: 9500, prevGross: 16500, status: "Working" },
  { id: "2025021811", offId: "WRK-504", name: "Fatema Khatun", type: "Worker", department: "Garment (Unit-2)", section: "Finishing Section", designation: "Ironer", unit: "Unit-02", line: "Line-03", grade: "Grade-4", joiningDate: "2025-02-18", prevBasic: 11000, prevGross: 19500, status: "Working" },
];

const allEmployeeTypes = ["Worker", "Staff", "Operator", "Helper", "Admin"];
const allDepartments = ["ALL", "Garment (Unit-2)", "Dyeing", "Knitting", "HR", "Sales"];
const allSections = ["ALL", "Core Development", "Core Sales", "Production", "Sewing Section", "Finishing Section"];
const allDesignations = ["ALL", "HR Director", "Deputy Manager", "Manager", "Senior Software Engineer", "Senior Operator", "Operator", "Helper", "Ironer"];
const allGrades = ["ALL", "Grade-1", "Grade-2", "Grade-3", "Grade-4", "Grade-5"];
const allUnits = ["ALL", "Unit-01", "Unit-02"];
const allLines = ["ALL", "Line-01", "Line-02", "Line-03"];
const allStatuses = ["ALL", "Working", "Suspended", "On Leave", "Left"];

interface CalculatedRecord extends EmployeeRecord {
  sl: number;
  newDesignation: string;
  newGrade: string;
  incEffectDate: string;
  incGross: number;
  newGross: number;
  newBasic: number;
  isArrear: string;
  netPay: number;
}

function IncrementMultiPage() {
  const router = useRouter();

  // --- QUERY FILTER CONSOLE STATES ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Worker"]);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [dept, setDept] = useState("Garment (Unit-2)");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [option, setOption] = useState("Joining Date Wise");
  const [joinDateFrom, setJoinDateFrom] = useState("2025-08-31");
  const [empId, setEmpId] = useState("");
  const [radioType, setRadioType] = useState<"System" | "Office">("System");

  // --- SEARCH MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuery, setModalQuery] = useState("");

  // --- INCREMENT RULES STATES ---
  const [effYear, setEffYear] = useState("2026");
  const [effMonth, setEffMonth] = useState("Aug");
  const [incDate, setIncDate] = useState("2026-08-01");
  const [incType, setIncType] = useState("General");
  const [incBy, setIncBy] = useState<"Basic" | "Gross">("Basic");
  const [calBy, setCalBy] = useState<"Percentage" | "Fixed">("Percentage");
  const [incVal, setIncVal] = useState<number>(9);
  const [newDesignationOption, setNewDesignationOption] = useState("ALL");
  const [newGradeOption, setNewGradeOption] = useState("ALL");
  const [arrearOption, setArrearOption] = useState("No");

  // --- DATA LISTS & GRID ---
  const [searchedEmployees, setSearchedEmployees] = useState<EmployeeRecord[]>([]);
  const [calculatedData, setCalculatedData] = useState<CalculatedRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Column Visibility Config
  const [colsVisible, setColsVisible] = useState({
    sl: true,
    empId: true,
    empIdOff: true,
    name: true,
    type: true,
    department: true,
    section: true,
    designation: true,
    unit: true,
    line: true,
    grade: true,
    newDesignation: true,
    newGrade: true,
    joiningDate: true,
    incEffectDate: true,
    prevBasic: true,
    prevGross: true,
    incGross: true,
    newGross: true,
    newBasic: true,
    arrear: true,
    netPay: true,
  });
  const [colDropdownOpen, setColDropdownOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- QUERY FILTER LOGIC ---
  const handleQuerySearch = () => {
    const results = mockEmployeesList.filter((emp) => {
      // Filter by multi-select Employee Types
      if (selectedTypes.length > 0 && !selectedTypes.includes(emp.type)) return false;
      // Filter by Department
      if (dept !== "ALL" && emp.department !== dept) return false;
      // Filter by Section
      if (section !== "ALL" && emp.section !== section) return false;
      // Filter by Designation
      if (designation !== "ALL" && emp.designation !== designation) return false;
      // Filter by Grade
      if (grade !== "ALL" && emp.grade !== grade) return false;
      // Filter by Line
      if (line !== "ALL" && emp.line !== line) return false;
      // Filter by Unit
      if (unit !== "ALL" && emp.unit !== unit) return false;
      // Filter by Status
      if (status !== "ALL" && emp.status !== status) return false;
      // Filter by specific Employee ID (System or Office)
      if (empId.trim()) {
        const queryId = empId.trim().toLowerCase();
        if (radioType === "System") {
          if (emp.id.toLowerCase() !== queryId) return false;
        } else {
          if (emp.offId.toLowerCase() !== queryId) return false;
        }
      }
      return true;
    });

    setSearchedEmployees(results);
    setCalculatedData([]);
    setSelectedIds([]);
    showToast(`Query successful: found ${results.length} matching employees.`);
  };

  // Run initial query search on mount
  useEffect(() => {
    handleQuerySearch();
  }, []);

  // --- GET INC DATA CALCULATIONS ---
  const handleCalculateIncrements = () => {
    if (searchedEmployees.length === 0) {
      alert("Please perform a search query first to load employees.");
      return;
    }

    const calculated = searchedEmployees.map((emp, index) => {
      let incrementAmount = 0;
      const baseSalary = incBy === "Basic" ? emp.prevBasic : emp.prevGross;

      if (calBy === "Percentage") {
        incrementAmount = Math.round(baseSalary * (incVal / 100));
      } else {
        incrementAmount = incVal;
      }

      const prevGross = emp.prevGross;
      const newGross = prevGross + incrementAmount;
      // Calculate new basic proportionally or flat addition
      const prevBasic = emp.prevBasic;
      const newBasic = prevBasic + (incBy === "Basic" ? incrementAmount : Math.round(incrementAmount * (prevBasic / prevGross)));

      return {
        ...emp,
        sl: index + 1,
        newDesignation: newDesignationOption === "ALL" ? emp.designation : newDesignationOption,
        newGrade: newGradeOption === "ALL" ? emp.grade : newGradeOption,
        incEffectDate: incDate,
        incGross: incrementAmount,
        newGross: newGross,
        newBasic: newBasic,
        isArrear: arrearOption,
        netPay: newGross,
      };
    });

    setCalculatedData(calculated);
    // Select all by default
    setSelectedIds(calculated.map((c) => c.id));
    showToast(`Appraisal increment logic mapped successfully for ${calculated.length} employees.`);
  };

  // --- ROW CHECKBOX HANDLERS ---
  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAllRows = () => {
    if (selectedIds.length === calculatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(calculatedData.map((c) => c.id));
    }
  };

  // --- MODAL EMPLOYEE SEARCH SELECTION ---
  const modalFilteredList = useMemo(() => {
    if (!modalQuery.trim()) return mockEmployeesList;
    const query = modalQuery.toLowerCase();
    return mockEmployeesList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query) ||
        emp.offId.toLowerCase().includes(query),
    );
  }, [modalQuery]);

  const selectEmployeeFromModal = (emp: EmployeeRecord) => {
    if (radioType === "System") {
      setEmpId(emp.id);
    } else {
      setEmpId(emp.offId);
    }
    setIsModalOpen(false);
    setModalQuery("");
  };

  // --- EXPORTS & ACTIONS ---
  const handlePdfExport = () => {
    if (calculatedData.length === 0) {
      alert("No data available to export.");
      return;
    }
    window.print();
  };

  const handleExcelExport = () => {
    if (calculatedData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = [
      "SL", "Emp ID", "Emp ID (Off)", "Employee Name", "Type", "Department", "Section",
      "Designation", "Unit", "Line", "Grade", "New Designation", "New Grade", "Joining Date",
      "Prev Gross", "Prev Basic", "Inc Gross", "New Gross", "New Basic", "Arrear", "Net Pay"
    ];
    const rows = calculatedData.map((row) => [
      row.sl.toString(),
      row.id,
      row.offId,
      row.name,
      row.type,
      row.department,
      row.section,
      row.designation,
      row.unit,
      row.line,
      row.grade,
      row.newDesignation,
      row.newGrade,
      row.joiningDate,
      row.prevGross.toString(),
      row.prevBasic.toString(),
      row.incGross.toString(),
      row.newGross.toString(),
      row.newBasic.toString(),
      row.isArrear,
      row.netPay.toString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `increment_multi_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitBatch = () => {
    const selectedRecords = calculatedData.filter((c) => selectedIds.includes(c.id));
    if (selectedRecords.length === 0) {
      alert("Please select at least one employee row from the table to submit.");
      return;
    }

    // Save proposal objects to local storage for approvals console
    const existingStr = localStorage.getItem("custom_increment_queue_records");
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    const newSubmissions = selectedRecords.map((rec) => ({
      empId: rec.id,
      name: rec.name,
      department: rec.department,
      designation: rec.designation,
      newDesignation: rec.newDesignation,
      prevGross: rec.prevGross,
      newGross: rec.newGross,
      incAmount: rec.incGross,
      calBy: calBy,
      rateValue: incVal,
      type: incType,
      effectDate: rec.incEffectDate,
      status: "Pending",
      level: "HR",
    }));

    localStorage.setItem("custom_increment_queue_records", JSON.stringify([...existing, ...newSubmissions]));
    showToast(`Batch processing submitted successfully for ${selectedRecords.length} employees to the Approvals Console!`);
    
    // Clear selection
    setSelectedIds([]);
  };

  // --- FILTER ON SPREADSHEET TABLE ---
  const finalCalculatedRows = useMemo(() => {
    if (!tableSearch.trim()) return calculatedData;
    const query = tableSearch.toLowerCase();
    return calculatedData.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query) ||
        row.designation.toLowerCase().includes(query),
    );
  }, [calculatedData, tableSearch]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Evaluation</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Increment (Multi)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Increment (Multi) Workspace
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-5 font-semibold">
                Bulk processing and department-wide increment adjustments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-card border border-border/75 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Total Found
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  {searchedEmployees.length}
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-primary">
                  Calculated
                </div>
                <div className="text-sm font-extrabold text-primary mt-0.5">
                  {calculatedData.length}
                </div>
              </div>
            </div>
          </div>

          {/* Toast Alert */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="size-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-semibold">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white transition">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* 1. QUERY FILTER CONSOLE CARD */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden font-sans">
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <ListFilter className="size-4.5 text-primary" />
              <span>Query & Parametric Filter Console</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Employee Type Multi-Select */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Employee Type
                </label>
                <div className="relative">
                  <div
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                    className="w-full min-h-[40px] px-3.5 py-1.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground flex items-center justify-between gap-2 cursor-pointer transition focus-within:border-primary focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/10 outline-none"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedTypes.length === 0 ? (
                        <span className="text-muted-foreground/60">ALL Types</span>
                      ) : (
                        selectedTypes.map((type) => (
                          <span
                            key={type}
                            className="bg-card border border-border/50 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTypes((prev) => prev.filter((t) => t !== type));
                            }}
                          >
                            {type} <X className="size-2.5 hover:text-rose-500 transition" />
                          </span>
                        ))
                      )}
                    </div>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </div>
                  {typeDropdownOpen && (
                    <div className="absolute top-[105%] left-0 w-full bg-card border border-border/80 rounded-xl shadow-xl z-30 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                      {allEmployeeTypes.map((type) => {
                        const selected = selectedTypes.includes(type);
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedTypes((prev) =>
                                selected ? prev.filter((t) => t !== type) : [...prev, type],
                              );
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              selected ? "bg-primary/15 text-primary" : "hover:bg-muted text-foreground/80"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                      {selectedTypes.length > 0 && (
                        <button
                          onClick={() => setSelectedTypes([])}
                          className="w-full px-3 py-1.5 rounded-lg text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 text-center transition"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Department
                </label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allSections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allLines.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Option (Criteria Selection) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Option
                </label>
                <select
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Joining Date Wise">Joining Date Wise</option>
                  <option value="Confirmation Date Wise">Confirmation Date Wise</option>
                </select>
              </div>

              {/* Join Date From */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Join Date From
                </label>
                <input
                  type="date"
                  value={joinDateFrom}
                  onChange={(e) => setJoinDateFrom(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                />
              </div>

              {/* Employee ID (Click triggers search modal) */}
              <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    placeholder="Click to search & select ID..."
                    onClick={() => setIsModalOpen(true)}
                    readOnly
                    className="w-full h-10 pl-3.5 pr-10 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground cursor-pointer focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition cursor-pointer"
                  >
                    <Search className="size-4" />
                  </button>
                  {empId && (
                    <button
                      onClick={() => setEmpId("")}
                      className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Radios (System/Office) and Query Button */}
              <div className="sm:col-span-2 lg:col-span-2 flex flex-row items-center gap-4 pt-5">
                <div className="flex items-center gap-4 bg-muted border border-border/20 rounded-xl px-4 py-2">
                  <label className="flex items-center gap-1.5 text-xs text-foreground/80 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="radioType"
                      checked={radioType === "System"}
                      onChange={() => setRadioType("System")}
                      className="accent-primary cursor-pointer size-3.5"
                    />
                    System
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground/80 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="radioType"
                      checked={radioType === "Office"}
                      onChange={() => setRadioType("Office")}
                      className="accent-primary cursor-pointer size-3.5"
                    />
                    Office
                  </label>
                </div>

                <button
                  onClick={handleQuerySearch}
                  className="flex-1 h-10 bg-primary hover:bg-primary-glow text-primary-foreground text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="size-3.5" /> Search
                </button>
              </div>
            </div>
          </div>

          {/* 2. INCREMENT INFORMATION RULES CONSOLE */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden font-sans">
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-success/10 via-success/45 to-success/10" />
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="size-4.5 text-success" />
              <span>Increment Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Effective Year */}
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
                </select>
              </div>

              {/* Effective Month */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Effective Month <span className="text-rose-500">*</span>
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

              {/* Increment Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                />
              </div>

              {/* Increment Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={incType}
                  onChange={(e) => setIncType(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Special Adjustment">Special Adjustment</option>
                </select>
              </div>

              {/* Increment By */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Increment By <span className="text-rose-500">*</span>
                </label>
                <select
                  value={incBy}
                  onChange={(e) => setIncBy(e.target.value as "Basic" | "Gross")}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Basic">Basic</option>
                  <option value="Gross">Gross</option>
                </select>
              </div>

              {/* Cal By (Percentage or Fixed) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Cal By <span className="text-rose-500">*</span>
                </label>
                <select
                  value={calBy}
                  onChange={(e) => setCalBy(e.target.value as "Percentage" | "Fixed")}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                </select>
              </div>

              {/* Increment value (Amount or Percentage based on Cal By selection) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block text-ellipsis overflow-hidden whitespace-nowrap">
                  {calBy === "Percentage" ? "Increment(%)" : "Increment(Amount)"} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={incVal}
                  onChange={(e) => setIncVal(Number(e.target.value))}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                  disabled={searchedEmployees.length === 0}
                />
              </div>

              {/* New Designation */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Designation(New)
                </label>
                <select
                  value={newDesignationOption}
                  onChange={(e) => setNewDesignationOption(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Grade */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Grade(New)
                </label>
                <select
                  value={newGradeOption}
                  onChange={(e) => setNewGradeOption(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  {allGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arrear */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Arrear <span className="text-rose-500">*</span>
                </label>
                <select
                  value={arrearOption}
                  onChange={(e) => setArrearOption(e.target.value)}
                  className="w-full h-10 px-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200 cursor-pointer"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Calculate trigger button */}
              <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                <button
                  onClick={handleCalculateIncrements}
                  className="w-full h-10 bg-success hover:bg-success-glow text-white text-xs font-extrabold rounded-xl shadow-xs transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="size-3.5 animate-pulse" /> Get Inc Data
                </button>
              </div>
            </div>
          </div>

          {/* 3. DATAGRID CONSOLE SHEET */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-5 space-y-4 font-sans">
            {/* Sheet Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Column Visibility Toggler */}
                <div className="relative">
                  <button
                    onClick={() => setColDropdownOpen(!colDropdownOpen)}
                    className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="size-3.5 text-muted-foreground" />
                    <span>Visibility</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </button>
                  {colDropdownOpen && (
                    <div className="absolute top-[105%] left-0 w-52 bg-card border border-border/80 rounded-xl shadow-xl z-20 p-2 max-h-64 overflow-y-auto space-y-0.5 animate-in fade-in duration-100">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase px-2 py-1 border-b border-border/50 mb-1">
                        Show/Hide Columns
                      </div>
                      {Object.keys(colsVisible).map((key) => {
                        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                        const visible = (colsVisible as any)[key];
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted text-xs font-semibold text-foreground/80 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={visible}
                              onChange={() =>
                                setColsVisible((prev: any) => ({ ...prev, [key]: !prev[key] }))
                              }
                              className="accent-primary rounded"
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Print/PDF Action */}
                <button
                  onClick={handlePdfExport}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5 text-muted-foreground" />
                  <span>PDF</span>
                </button>

                {/* Excel/CSV Action */}
                <button
                  onClick={handleExcelExport}
                  className="h-9 px-4 border border-border/30 rounded-xl text-xs font-bold bg-muted hover:bg-muted/70 text-foreground transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-muted-foreground" />
                  <span>Excel</span>
                </button>
              </div>

              {/* Table search filter */}
              <div className="w-full sm:w-64 relative">
                <input
                  type="text"
                  placeholder="Search in table..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full h-9 pl-8.5 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Datagrid Table Scroll Container */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          calculatedData.length > 0 && selectedIds.length === calculatedData.length
                        }
                        onChange={toggleAllRows}
                        className="accent-primary cursor-pointer rounded"
                      />
                    </th>
                    {colsVisible.sl && <th className="p-3 w-12 text-center">SL</th>}
                    {colsVisible.empId && <th className="p-3">Emp Id</th>}
                    {colsVisible.empIdOff && <th className="p-3">Emp Id(Off)</th>}
                    {colsVisible.name && <th className="p-3">Employee Name</th>}
                    {colsVisible.type && <th className="p-3">Emp. Type</th>}
                    {colsVisible.department && <th className="p-3">Department</th>}
                    {colsVisible.section && <th className="p-3">Section</th>}
                    {colsVisible.designation && <th className="p-3">Designation</th>}
                    {colsVisible.unit && <th className="p-3">Unit</th>}
                    {colsVisible.line && <th className="p-3">Line</th>}
                    {colsVisible.grade && <th className="p-3">Grade</th>}
                    {colsVisible.newDesignation && <th className="p-3">New Designation</th>}
                    {colsVisible.newGrade && <th className="p-3">New Grade</th>}
                    {colsVisible.joiningDate && <th className="p-3">Joining Date</th>}
                    {colsVisible.incEffectDate && <th className="p-3">Inc Effect Date</th>}
                    {colsVisible.prevBasic && <th className="p-3 text-right">Prev. Basic</th>}
                    {colsVisible.prevGross && <th className="p-3 text-right">Prev. Gross</th>}
                    {colsVisible.incGross && <th className="p-3 text-right">Inc. Gross</th>}
                    {colsVisible.newGross && <th className="p-3 text-right">New Gross</th>}
                    {colsVisible.newBasic && <th className="p-3 text-right">New Basic</th>}
                    {colsVisible.arrear && <th className="p-3 text-center">Arrear</th>}
                    {colsVisible.netPay && <th className="p-3 text-right">Net Pay</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground font-semibold">
                  {finalCalculatedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={23}
                        className="p-12 text-center text-muted-foreground/60 font-medium"
                      >
                        <AlertCircle className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    finalCalculatedRows.map((row) => {
                      const selected = selectedIds.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-muted/30 transition duration-150 ${
                            selected ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleRow(row.id)}
                              className="accent-primary cursor-pointer rounded"
                            />
                          </td>
                          {colsVisible.sl && <td className="p-3 text-center">{row.sl}</td>}
                          {colsVisible.empId && (
                            <td className="p-3 font-mono text-[11px] font-bold text-foreground">
                              {row.id}
                            </td>
                          )}
                          {colsVisible.empIdOff && (
                            <td className="p-3 font-mono text-[11px] text-muted-foreground">
                              {row.offId}
                            </td>
                          )}
                          {colsVisible.name && <td className="p-3 text-foreground">{row.name}</td>}
                          {colsVisible.type && (
                            <td className="p-3">
                              <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground font-bold">
                                {row.type}
                              </span>
                            </td>
                          )}
                          {colsVisible.department && <td className="p-3">{row.department}</td>}
                          {colsVisible.section && <td className="p-3">{row.section}</td>}
                          {colsVisible.designation && <td className="p-3">{row.designation}</td>}
                          {colsVisible.unit && <td className="p-3">{row.unit}</td>}
                          {colsVisible.line && <td className="p-3">{row.line}</td>}
                          {colsVisible.grade && <td className="p-3">{row.grade}</td>}
                          {colsVisible.newDesignation && (
                            <td className="p-3 text-primary font-bold">{row.newDesignation}</td>
                          )}
                          {colsVisible.newGrade && (
                            <td className="p-3 text-primary font-bold">{row.newGrade}</td>
                          )}
                          {colsVisible.joiningDate && <td className="p-3">{row.joiningDate}</td>}
                          {colsVisible.incEffectDate && <td className="p-3">{row.incEffectDate}</td>}
                          {colsVisible.prevBasic && (
                            <td className="p-3 text-right font-mono">
                              ৳{row.prevBasic.toLocaleString()}
                            </td>
                          )}
                          {colsVisible.prevGross && (
                            <td className="p-3 text-right font-mono">
                              ৳{row.prevGross.toLocaleString()}
                            </td>
                          )}
                          {colsVisible.incGross && (
                            <td className="p-3 text-right font-mono text-success">
                              +৳{row.incGross.toLocaleString()}
                            </td>
                          )}
                          {colsVisible.newGross && (
                            <td className="p-3 text-right font-mono text-primary font-bold">
                              ৳{row.newGross.toLocaleString()}
                            </td>
                          )}
                          {colsVisible.newBasic && (
                            <td className="p-3 text-right font-mono">
                              ৳{row.newBasic.toLocaleString()}
                            </td>
                          )}
                          {colsVisible.arrear && (
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  row.isArrear === "Yes"
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {row.isArrear}
                              </span>
                            </td>
                          )}
                          {colsVisible.netPay && (
                            <td className="p-3 text-right font-mono text-foreground font-black">
                              ৳{row.netPay.toLocaleString()}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Grid footer controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
              <div className="text-xs text-muted-foreground font-semibold">
                Showing {finalCalculatedRows.length > 0 ? "1" : "0"} to {finalCalculatedRows.length} of {finalCalculatedRows.length} entries
                {selectedIds.length > 0 && (
                  <span className="text-primary font-extrabold ml-1">
                    ({selectedIds.length} rows selected)
                  </span>
                )}
              </div>

              <button
                onClick={handleSubmitBatch}
                className="w-full sm:w-auto h-10 px-8 bg-success hover:bg-success-glow text-white text-xs font-extrabold rounded-xl shadow-xs hover:opacity-95 transition uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="size-3.5" /> Submit proposals
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- EMPLOYEE SEARCH DIALOG MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <User className="size-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Select Employee ID</h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalQuery("");
                }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Employee Name, System ID, or Office ID..."
                value={modalQuery}
                onChange={(e) => setModalQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3.5 bg-muted border border-border/30 rounded-xl text-xs font-semibold text-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>

            {/* Scrollable list */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
              {modalFilteredList.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground/60 font-semibold">
                  No matching employees found.
                </div>
              ) : (
                modalFilteredList.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => selectEmployeeFromModal(emp)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/30 hover:border-primary/45 hover:bg-primary/5 transition text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-foreground group-hover:text-primary transition">
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                        {emp.designation} • {emp.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] font-black text-foreground">
                        {radioType === "System" ? emp.id : emp.offId}
                      </div>
                      <div className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">
                        {radioType === "System" ? "System ID" : "Office ID"}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalQuery("");
                }}
                className="h-9 px-5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
