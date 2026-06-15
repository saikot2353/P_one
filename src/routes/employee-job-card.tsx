import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint, Search, FileSpreadsheet, Printer, FileDown, X, SlidersHorizontal, Check, Plus,
  Trash2, Calendar, Clock, RefreshCw, ChevronDown, ChevronRight, ChevronLeft, User, Building, MapPin, Briefcase
} from "lucide-react";

export const Route = createFileRoute("/employee-job-card")({
  head: () => ({
    meta: [
      { title: "Employee Job Card — CRIPTON" },
      { name: "description", content: "Comprehensive employee job card registry displaying punch timelines, attendance states, and overtime hours." },
    ],
  }),
  component: EmployeeJobCardPage,
});

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchableSelect({ options, value, onChange, placeholder = "Select option...", className = "" }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold flex items-center justify-between text-left focus:border-[#1e88e5] hover:bg-muted/80 transition duration-150 cursor-pointer"
      >
        <span className="truncate text-foreground font-bold">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-card border border-border rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-border/30 relative">
            <Search className="size-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-8 pl-8 pr-3 bg-muted/60 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded-lg outline-none text-xs font-bold transition font-sans"
            />
          </div>

          <div className="max-h-48 overflow-y-auto p-1 divide-y divide-border/10 font-sans text-xs">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${isSelected
                        ? "bg-[#1e88e5]/10 text-[#1e88e5]"
                        : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"
                      }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="size-3 text-[#1e88e5]" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-center text-muted-foreground text-[11px] font-medium">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock database for available employees & their metadata
const employeeDb: Record<string, {
  name: string;
  type: string;
  subDept: string;
  jobTitle: string;
  unit: string;
  shift: string;
  shiftStartDate: string;
  defaultHoliday: string;
}> = {
  "2023043910": {
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    subDept: "Business Innovation",
    jobTitle: "Asst. Manager",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "01/08/2023",
    defaultHoliday: "Friday"
  },
  "2016001055": {
    name: "Md. Zahidul Islam",
    type: "Permanent",
    subDept: "Management",
    jobTitle: "Chief Operating Officer",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "15/03/2016",
    defaultHoliday: "Friday"
  },
  "2022035599": {
    name: "Dipon Saha",
    type: "Permanent",
    subDept: "Core Development (HR)",
    jobTitle: "Manager",
    unit: "PTVL",
    shift: "Exe-Ptvl Shift",
    shiftStartDate: "10/05/2022",
    defaultHoliday: "Friday"
  }
};

// Generates daily attendance log for an employee for a given month/year
const generateAttendanceData = (empId: string, month: string, year: number) => {
  const emp = employeeDb[empId] || {
    name: "Unknown Employee",
    type: "N/A",
    subDept: "N/A",
    jobTitle: "N/A",
    unit: "N/A",
    shift: "General Shift",
    shiftStartDate: "N/A",
    defaultHoliday: "Friday"
  };

  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const logs = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${String(day).padStart(2, "0")}/${String(monthIndex + 1).padStart(2, "0")}/${year}`;
    const dateObj = new Date(year, monthIndex, day);
    const isHoliday = dateObj.getDay() === 5; // Friday (Friday = 5)

    if (isHoliday) {
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: "",
        inTime: "",
        outTime: "",
        overtime: "0.00",
        shift: emp.shift,
        status: "Holiday"
      });
    } else if (day === 21 || day === 22) {
      // Casual Leave preset
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: "N/A",
        inTime: "N/A",
        outTime: "N/A",
        overtime: "0.00",
        shift: emp.shift,
        status: "CL"
      });
    } else {
      // Regular Present days
      // Generate realistic dynamic punch times
      const inHr = 8 + (day % 3 === 0 ? 2 : 0) + (day % 5 === 0 ? 1 : 0);
      const inMin = Math.floor(20 + (day * 7) % 39);
      const inSec = Math.floor(10 + (day * 13) % 49);
      const inTimeStr = `${String(inHr).padStart(2, "0")}:${String(inMin).padStart(2, "0")}:${String(inSec).padStart(2, "0")}`;

      // Simulate early leaves on days divisible by 7
      const isEarlyDay = day % 7 === 0;
      const outHr = isEarlyDay ? 17 : (18 + (day % 4 === 0 ? 1 : 0) + (day % 6 === 0 ? 2 : 0));
      const outMin = isEarlyDay ? Math.floor(10 + (day * 9) % 30) : Math.floor(10 + (day * 9) % 45);
      const outSec = Math.floor(10 + (day * 17) % 49);
      const outTimeStr = `${String(outHr).padStart(2, "0")}:${String(outMin).padStart(2, "0")}:${String(outSec).padStart(2, "0")}`;

      // Overtime calculation: if out time past 18:00
      let ot = "0.00";
      if (!isEarlyDay && outHr >= 19) {
        ot = `${outHr - 18}.00`;
      }

      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: dateStr,
        inTime: inTimeStr,
        outTime: outTimeStr,
        overtime: ot,
        shift: emp.shift,
        status: "Present"
      });
    }
  }

  return logs;
};

function EmployeeJobCardPage() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["Jan"]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedCompany, setSelectedCompany] = useState("Pakiza Software Limited");
  const [selectedArea, setSelectedArea] = useState("PSL-Head Office");
  const [selectedType, setSelectedType] = useState("Actual");

  // Multi-employee ID input (allows selecting multiple comma-separated IDs)
  const [activeEmpId, setActiveEmpId] = useState("2023043910");
  const [multiEmpIds, setMultiEmpIds] = useState<string[]>(["2023043910"]);

  // Runtime Calculation States
  const [isRuntimeCal, setIsRuntimeCal] = useState(false);
  const [shiftInThreshold, setShiftInThreshold] = useState("09:00");
  const [shiftOutThreshold, setShiftOutThreshold] = useState("18:00");

  // Data retrieved on clicking GET
  const [renderedLogs, setRenderedLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 31;

  const yearOptions = useMemo(() => [
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" }
  ], []);

  const companyOptions = useMemo(() => [
    { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
    { value: "Pakiza Group", label: "Pakiza Group" }
  ], []);

  const areaOptions = useMemo(() => [
    { value: "PSL-Head Office", label: "PSL-Head Office" },
    { value: "PSL-Factory Operations", label: "PSL-Factory Operations" }
  ], []);

  const typeOptions = useMemo(() => [
    { value: "Actual", label: "Actual" },
    { value: "Standard", label: "Standard" }
  ], []);

  const employeeOptions = useMemo(() => {
    return Object.keys(employeeDb).map(id => ({
      value: id,
      label: `${id} - ${employeeDb[id].name}`
    }));
  }, []);

  const addEmployeeOptions = useMemo(() => {
    return Object.keys(employeeDb)
      .filter(id => !multiEmpIds.includes(id))
      .map(id => ({
        value: id,
        label: `${id} - ${employeeDb[id].name}`
      }));
  }, [multiEmpIds]);

  // Inline time punch edit handler
  const handleTimeChange = (empId: string, date: string, field: 'inTime' | 'outTime', value: string) => {
    setRenderedLogs(prev => prev.map(row => {
      if (row.empId === empId && row.date === date) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Auto-fill metadata for display based on active primary ID
  const activeEmpMetadata = useMemo(() => {
    return employeeDb[activeEmpId] || {
      name: "N/A",
      type: "N/A",
      subDept: "N/A",
      jobTitle: "N/A",
      unit: "N/A",
      shift: "N/A",
      shiftStartDate: "N/A",
      defaultHoliday: "N/A"
    };
  }, [activeEmpId]);

  // Retrieve initial logs on mount
  useEffect(() => {
    handleGetLogs();
  }, []);

  const handleGetLogs = () => {
    // Generate full list by combining all selected employees and months
    const allLogs: any[] = [];
    multiEmpIds.forEach(empId => {
      selectedMonths.forEach(m => {
        allLogs.push(...generateAttendanceData(empId, m, selectedYear));
      });
    });
    setRenderedLogs(allLogs);
    setCurrentPage(1);
  };

  // Add employee ID to multi-select
  const handleAddEmployee = (id: string) => {
    const cleanId = id.trim();
    if (cleanId && !multiEmpIds.includes(cleanId)) {
      setMultiEmpIds(prev => [...prev, cleanId]);
    }
  };

  // Remove employee ID from multi-select
  const handleRemoveEmployee = (id: string) => {
    if (multiEmpIds.length > 1) {
      setMultiEmpIds(prev => prev.filter(item => item !== id));
      if (activeEmpId === id) {
        const remaining = multiEmpIds.filter(item => item !== id);
        setActiveEmpId(remaining[0]);
      }
    } else {
      alert("At least one employee must be selected!");
    }
  };

  // Checkbox toggle for multiple months
  const toggleMonth = (m: string) => {
    setSelectedMonths(prev => {
      if (prev.includes(m)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(item => item !== m);
      } else {
        return [...prev, m];
      }
    });
  };

  // Filtered rows matching query
  const filteredRows = useMemo(() => {
    return renderedLogs.filter(row => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        row.empId.includes(q) ||
        row.empName.toLowerCase().includes(q) ||
        row.date.includes(q) ||
        row.status.toLowerCase().includes(q)
      );
    });
  }, [renderedLogs, searchQuery]);

  // Statistics calculation for high-fidelity summary meters
  const stats = useMemo(() => {
    let present = 0;
    let holidays = 0;
    let leaves = 0;
    let totalOt = 0;
    let lateCount = 0;
    let earlyLeaveCount = 0;

    filteredRows.forEach(r => {
      // Calculate active status under runtime calculation rules
      let activeStatus = r.status;
      if (isRuntimeCal && r.status === "Present") {
        const thresholdIn = shiftInThreshold + ":00";
        const thresholdOut = shiftOutThreshold + ":00";
        const inTime = r.inTime;
        const outTime = r.outTime;

        if (inTime && outTime && inTime !== "N/A" && outTime !== "N/A") {
          const isLate = inTime > thresholdIn;
          const isEarly = outTime < thresholdOut;
          if (isLate && isEarly) {
            activeStatus = "Late & Early";
          } else if (isLate) {
            activeStatus = "Late";
          } else if (isEarly) {
            activeStatus = "Early Leave";
          }
        }
      }

      if (activeStatus === "Present") present++;
      if (activeStatus === "Holiday") holidays++;
      if (activeStatus === "CL") leaves++;
      if (activeStatus === "Late") {
        lateCount++;
        present++;
      }
      if (activeStatus === "Early Leave") {
        earlyLeaveCount++;
        present++;
      }
      if (activeStatus === "Late & Early") {
        lateCount++;
        earlyLeaveCount++;
        present++;
      }
      totalOt += parseFloat(r.overtime || "0");
    });

    return { present, holidays, leaves, totalOt: totalOt.toFixed(2), lateCount, earlyLeaveCount };
  }, [filteredRows, isRuntimeCal, shiftInThreshold, shiftOutThreshold]);

  // Paginated Rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;

  // Print utility handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Breadcrumbs and Title */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Employee Job Card</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Fingerprint className="size-5.5 text-primary animate-pulse" />
                <span>Employee Job Card</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                Selected: {multiEmpIds.length} Emps / {selectedMonths.length} Months
              </span>
            </div>
          </div>


          {/* Top Panel: Criteria Selection */}
          <div className="bg-card rounded-lg border border-border/85 p-6 shadow-sm space-y-6 print:hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Job Card Configuration</span>
              <span className="text-[9px] font-bold text-muted-foreground/50">Filter Boundary</span>
            </div>

            {/* Grid Container for Layout Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Left Wing: Scope & Active Employees (col-span-3) */}
              <div className="lg:col-span-3 space-y-5">
                {/* 1. Period Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Select Months (Multi)</label>
                  <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/50 dark:bg-slate-900/40 rounded-xl border border-border/40">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => {
                      const isSelected = selectedMonths.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => toggleMonth(m)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-150 ${isSelected ? "bg-[#1e88e5] text-white shadow-sm" : "hover:bg-card text-muted-foreground"}`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Unified Company & Region Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Year</label>
                    <SearchableSelect
                      options={yearOptions}
                      value={selectedYear.toString()}
                      onChange={(val) => setSelectedYear(parseInt(val))}
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Company</label>
                    <SearchableSelect
                      options={companyOptions}
                      value={selectedCompany}
                      onChange={setSelectedCompany}
                    />
                  </div>

                  {/* Area Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Area Name</label>
                    <SearchableSelect
                      options={areaOptions}
                      value={selectedArea}
                      onChange={setSelectedArea}
                    />
                  </div>
                </div>

                {/* 3. Active Multi Selected Employees tags display */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Selected Employees (Multi)</label>
                  <div className="min-h-12 p-2 bg-muted/30 dark:bg-slate-900/30 rounded-xl border border-border/40 flex flex-wrap gap-2 items-center">
                    {multiEmpIds.map(id => (
                      <span key={id} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 hover:bg-primary/15">
                        <span>{id} ({employeeDb[id]?.name || "N/A"})</span>
                        <button
                          onClick={() => handleRemoveEmployee(id)}
                          className="hover:text-red-500 font-bold ml-1 transition"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    <div className="relative inline-block w-44">
                      <SearchableSelect
                        options={addEmployeeOptions}
                        value=""
                        onChange={(val) => {
                          if (val) handleAddEmployee(val);
                        }}
                        placeholder="+ Add Employee"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Wing: Primary Selection & Runtime Engine (col-span-2) */}
              <div className="lg:col-span-2 flex flex-col justify-between gap-5">

                {/* 1. Core Selection block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Type dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type</label>
                    <SearchableSelect
                      options={typeOptions}
                      value={selectedType}
                      onChange={setSelectedType}
                    />
                  </div>

                  {/* Primary Employee ID Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Primary Employee</label>
                    <SearchableSelect
                      options={employeeOptions}
                      value={activeEmpId}
                      onChange={(val) => {
                        setActiveEmpId(val);
                        handleAddEmployee(val);
                      }}
                    />
                  </div>
                </div>

                {/* 2. Runtime Calculation Subcard */}
                <div className="p-4 bg-primary/[0.02] dark:bg-primary/[0.01] border border-[#1e88e5]/20 rounded-lg flex-1 flex flex-col justify-center space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-primary tracking-wide">Runtime Evaluation</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Dynamically evaluate punch logs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isRuntimeCal}
                        onChange={(e) => setIsRuntimeCal(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#1e88e5]"></div>
                    </label>
                  </div>

                  {isRuntimeCal && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1e88e5]/10">
                      {/* Shift In Threshold */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Shift In Time</span>
                        <input
                          type="text"
                          value={shiftInThreshold}
                          onChange={(e) => setShiftInThreshold(e.target.value)}
                          placeholder="e.g. 09:00"
                          className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono"
                        />
                      </div>

                      {/* Shift Out Threshold */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Shift Out Time</span>
                        <input
                          type="text"
                          value={shiftOutThreshold}
                          onChange={(e) => setShiftOutThreshold(e.target.value)}
                          placeholder="e.g. 18:00"
                          className="w-full h-8 px-2.5 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Metadata Summary Card based on primary ID */}
            <div className="p-5 bg-muted/40 dark:bg-[#0c111e]/25 border border-border/40 rounded-lg grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 text-xs font-semibold relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1e88e5]"></div>

              <div className="pl-2">
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Name</span>
                <span className="text-foreground font-black text-xs block truncate">{activeEmpMetadata.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Employee Type</span>
                <span className="text-foreground font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-border/40 inline-block">{activeEmpMetadata.type}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Sub Department</span>
                <span className="text-foreground font-semibold block truncate">{activeEmpMetadata.subDept}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Job Title</span>
                <span className="text-foreground font-semibold block truncate">{activeEmpMetadata.jobTitle}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Unit</span>
                <span className="text-[#1e88e5] font-black bg-[#1e88e5]/5 dark:bg-[#1e88e5]/10 border border-[#1e88e5]/20 px-2.5 py-0.5 rounded-md inline-block">{activeEmpMetadata.unit}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Shift</span>
                <span className="text-foreground font-semibold block truncate">{activeEmpMetadata.shift}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Shift Start Date</span>
                <span className="text-foreground font-semibold font-mono bg-muted px-2 py-0.5 rounded-md border border-border/40 inline-block">{activeEmpMetadata.shiftStartDate}</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5">Default Holiday</span>
                <span className="text-rose-500 font-extrabold bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20 inline-block">{activeEmpMetadata.defaultHoliday}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-2 border-t border-border/30">
              <button
                onClick={handleGetLogs}
                className="h-10 px-10 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-primary/20 transition duration-150 uppercase tracking-widest flex items-center gap-2"
              >
                <Fingerprint className="size-4" />
                <span>Fetch Attendance</span>
              </button>
            </div>
          </div>

          {/* Summary Stats Cards Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 print:hidden">
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center font-black text-xs">P</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Present Days</span>
                <span className="text-sm font-black text-foreground">{stats.present}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 grid place-items-center font-black text-xs">L</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Leaves Taken</span>
                <span className="text-sm font-black text-foreground">{stats.leaves}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-slate-500/10 text-slate-500 grid place-items-center font-black text-xs">H</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Weekly Holidays</span>
                <span className="text-sm font-black text-foreground">{stats.holidays}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-[#1e88e5]/10 text-[#1e88e5] grid place-items-center font-black text-xs">OT</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Overtime Hours</span>
                <span className="text-sm font-black text-foreground">{stats.totalOt} hrs</span>
              </div>
            </div>

            {/* Late Entries Count */}
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-rose-500/10 text-rose-500 grid place-items-center font-black text-xs">LT</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Late Entries</span>
                <span className="text-sm font-black text-foreground">
                  {isRuntimeCal ? stats.lateCount : "—"}
                </span>
              </div>
            </div>

            {/* Early Leaves Count */}
            <div className="bg-card rounded-lg border border-border/80 p-4 shadow-xs flex items-center gap-3">
              <div className="size-9 rounded-lg bg-purple-500/10 text-purple-500 grid place-items-center font-black text-xs">EL</div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">Early Leaves</span>
                <span className="text-sm font-black text-foreground">
                  {isRuntimeCal ? stats.earlyLeaveCount : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Spreadsheet Datagrid Card */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">

            {/* Utilities Toolbar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden">
              <div className="flex items-center gap-1.5 select-none">
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Text Query Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Search:</span>
                <div className="relative w-56 sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, Name, Date..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* High-Fidelity Spreadsheet Data Table */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[55vh] print:max-h-none print:border-none">
              <table className="w-full min-w-[950px] xl:min-w-0 border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    {/* Columns headers matching Pakiza structure */}
                    <th className="px-4 py-3 font-extrabold text-center w-12 border-r border-border/30">SL</th>
                    <th className="px-4 py-3 font-extrabold w-28 border-r border-border/30">Employee ID</th>
                    <th className="px-4 py-3 font-extrabold w-36 border-r border-border/30">Employee Name</th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Atn Date</th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">Out Date</th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">In Time</th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">Out Time</th>
                    <th className="px-4 py-3 font-extrabold text-right w-24 border-r border-border/30">Over Time</th>
                    <th className="px-4 py-3 font-extrabold w-32 border-r border-border/30">Duty Shift</th>
                    <th className="px-4 py-3 font-extrabold text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {paginatedRows.map((row, idx) => {
                    const slNo = (currentPage - 1) * itemsPerPage + idx + 1;

                    // Dynamic Runtime Calculations status check
                    let activeStatus = row.status;
                    if (isRuntimeCal && row.status === "Present") {
                      const thresholdIn = shiftInThreshold + ":00";
                      const thresholdOut = shiftOutThreshold + ":00";
                      const inTime = row.inTime;
                      const outTime = row.outTime;

                      if (inTime && outTime && inTime !== "N/A" && outTime !== "N/A") {
                        const isLate = inTime > thresholdIn;
                        const isEarly = outTime < thresholdOut;
                        if (isLate && isEarly) {
                          activeStatus = "Late & Early";
                        } else if (isLate) {
                          activeStatus = "Late";
                        } else if (isEarly) {
                          activeStatus = "Early Leave";
                        }
                      }
                    }

                    // Assign beautiful colors according to status value
                    let statusBadgeClass = "text-foreground font-semibold";
                    if (activeStatus === "Present") {
                      statusBadgeClass = "text-emerald-600 dark:text-emerald-400 font-extrabold";
                    } else if (activeStatus === "Holiday") {
                      statusBadgeClass = "text-slate-400 dark:text-slate-500 font-semibold";
                    } else if (activeStatus === "CL") {
                      statusBadgeClass = "text-amber-500 dark:text-amber-400 font-extrabold";
                    } else if (activeStatus === "Late") {
                      statusBadgeClass = "text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20";
                    } else if (activeStatus === "Early Leave") {
                      statusBadgeClass = "text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20";
                    } else if (activeStatus === "Late & Early") {
                      statusBadgeClass = "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse";
                    }

                    return (
                      <tr
                        key={`${row.empId}-${row.date}`}
                        className="group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-100 whitespace-nowrap"
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20">{slNo}</td>
                        <td className="px-4 py-2.5 font-bold font-mono text-foreground border-r border-border/20">{row.empId}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground/80 border-r border-border/20">{row.empName}</td>
                        <td className="px-4 py-2.5 font-mono text-center font-bold text-foreground/80 border-r border-border/20">{row.date}</td>
                        <td className="px-4 py-2.5 font-mono text-center text-muted-foreground border-r border-border/20">{row.outDate || ""}</td>

                        {/* Dynamic In Time Input Cell */}
                        <td className="px-4 py-2 text-center text-primary font-bold border-r border-border/20">
                          {isRuntimeCal && row.status === "Present" ? (
                            <input
                              type="text"
                              value={row.inTime}
                              onChange={(e) => handleTimeChange(row.empId, row.date, 'inTime', e.target.value)}
                              className="w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition"
                            />
                          ) : (
                            row.inTime || ""
                          )}
                        </td>

                        {/* Dynamic Out Time Input Cell */}
                        <td className="px-4 py-2 text-center text-primary font-bold border-r border-border/20">
                          {isRuntimeCal && row.status === "Present" ? (
                            <input
                              type="text"
                              value={row.outTime}
                              onChange={(e) => handleTimeChange(row.empId, row.date, 'outTime', e.target.value)}
                              className="w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition"
                            />
                          ) : (
                            row.outTime || ""
                          )}
                        </td>

                        <td className="px-4 py-2.5 font-mono text-right font-bold text-foreground/85 border-r border-border/20">{row.overtime}</td>
                        <td className="px-4 py-2.5 text-muted-foreground border-r border-border/20">{row.shift}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={statusBadgeClass}>
                            {activeStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedRows.length === 0 && (
                    <tr>
                      <td colSpan={20} className="px-4 py-16 text-center text-muted-foreground font-semibold">
                        No attendance job card data found for selected boundaries. Click GET to load records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Stats & Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 print:hidden">
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRows.length)} to {Math.min(currentPage * itemsPerPage, filteredRows.length)} of {filteredRows.length} entries
              </span>

              <div className="flex items-center gap-4">
                {/* PDF/Excel batch download buttons exactly matching Pakiza style! */}
                <div className="flex items-center gap-1.5">
                  <button className="h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg transition uppercase tracking-wider">
                    VIEW(PDF)
                  </button>
                  <button className="h-8 px-4 bg-[#72b043] hover:bg-[#629c36] text-white font-extrabold text-[10px] rounded-lg transition uppercase tracking-wider">
                    EXCEL
                  </button>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
