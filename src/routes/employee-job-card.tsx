import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  X,
  SlidersHorizontal,
  Check,
  Plus,
  Trash2,
  Calendar,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  User,
  Building,
  MapPin,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/employee-job-card")({
  head: () => ({
    meta: [
      { title: "Employee Job Card — CRIPTON" },
      {
        name: "description",
        content:
          "Comprehensive employee job card registry displaying punch timelines, attendance states, and overtime hours.",
      },
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

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.value.toLowerCase().includes(search.toLowerCase()),
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
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
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
              filteredOptions.map((option) => {
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
const employeeDb: Record<
  string,
  {
    name: string;
    type: string;
    subDept: string;
    jobTitle: string;
    unit: string;
    shift: string;
    shiftStartDate: string;
    defaultHoliday: string;
  }
> = {
  "2023043910": {
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    subDept: "Business Innovation",
    jobTitle: "Asst. Manager",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "01/08/2023",
    defaultHoliday: "Friday",
  },
  "2016001055": {
    name: "Md. Zahidul Islam",
    type: "Permanent",
    subDept: "Management",
    jobTitle: "Chief Operating Officer",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "15/03/2016",
    defaultHoliday: "Friday",
  },
  "2022035599": {
    name: "Dipon Saha",
    type: "Permanent",
    subDept: "Core Development (HR)",
    jobTitle: "Manager",
    unit: "PTVL",
    shift: "Exe-Ptvl Shift",
    shiftStartDate: "10/05/2022",
    defaultHoliday: "Friday",
  },
};

// Generates daily attendance log for an employee for a given date range
const generateAttendanceData = (empId: string, startDateStr: string, endDateStr: string) => {
  const emp = employeeDb[empId] || {
    name: "Unknown Employee",
    type: "N/A",
    subDept: "N/A",
    jobTitle: "N/A",
    unit: "N/A",
    shift: "General Shift",
    shiftStartDate: "N/A",
    defaultHoliday: "Friday",
  };

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const logs = [];

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return [];

  let current = new Date(start);
  let index = 1;

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const dateStr = `${day}/${month}/${year}`;
    const isHoliday = current.getDay() === 5; // Friday (Friday = 5)

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
        status: "Holiday",
      });
    } else if (index % 12 === 0) {
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
        status: "CL",
      });
    } else {
      // Regular Present days
      // Generate realistic dynamic punch times
      const inHr = 8 + (index % 3 === 0 ? 2 : 0) + (index % 5 === 0 ? 1 : 0);
      const inMin = Math.floor(20 + ((index * 7) % 39));
      const inSec = Math.floor(10 + ((index * 13) % 49));
      const inTimeStr = `${String(inHr).padStart(2, "0")}:${String(inMin).padStart(2, "0")}:${String(inSec).padStart(2, "0")}`;

      // Simulate early leaves on days divisible by 7
      const isEarlyDay = index % 7 === 0;
      const outHr = isEarlyDay ? 17 : 18 + (index % 4 === 0 ? 1 : 0) + (index % 6 === 0 ? 2 : 0);
      const outMin = isEarlyDay
        ? Math.floor(10 + ((index * 9) % 30))
        : Math.floor(10 + ((index * 9) % 45));
      const outSec = Math.floor(10 + ((index * 17) % 49));
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
        status: "Present",
      });
    }

    current.setDate(current.getDate() + 1);
    index++;
  }

  return logs;
};

function EmployeeJobCardPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const [selectedCompany, setSelectedCompany] = useState("Pakiza Software Limited");
  const [selectedArea, setSelectedArea] = useState("PSL-Operation");
  const [selectedType, setSelectedType] = useState("Actual");

  // Primary active employee (drives the metadata card)
  const [activeEmpId, setActiveEmpId] = useState("2023043910");

  // Multi-employee ID input (allows selecting multiple IDs for the fetch)
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

  const companyOptions = useMemo(
    () => [
      { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
      { value: "Pakiza Group", label: "Pakiza Group" },
    ],
    [],
  );

  const areaOptions = useMemo(
    () => [
      { value: "PSL-Operation", label: "PSL-Operation" },
      { value: "PSL-Head Office", label: "PSL-Head Office" },
      { value: "PSL-Factory", label: "PSL-Factory" },
    ],
    [],
  );

  const typeOptions = useMemo(
    () => [
      { value: "Actual", label: "Actual" },
      { value: "Standard", label: "Standard" },
    ],
    [],
  );

  const employeeOptions = useMemo(() => {
    return Object.keys(employeeDb).map((id) => ({
      value: id,
      label: `${id} - ${employeeDb[id].name}`,
    }));
  }, []);

  const addEmployeeOptions = useMemo(() => {
    return Object.keys(employeeDb)
      .filter((id) => !multiEmpIds.includes(id))
      .map((id) => ({
        value: id,
        label: `${id} - ${employeeDb[id].name}`,
      }));
  }, [multiEmpIds]);

  // Inline time punch edit handler
  const handleTimeChange = (
    empId: string,
    date: string,
    field: "inTime" | "outTime",
    value: string,
  ) => {
    setRenderedLogs((prev) =>
      prev.map((row) => {
        if (row.empId === empId && row.date === date) {
          return { ...row, [field]: value };
        }
        return row;
      }),
    );
  };


  // Retrieve initial logs on mount
  useEffect(() => {
    handleGetLogs();
  }, []);

  const handleGetLogs = () => {
    const allLogs: any[] = [];
    multiEmpIds.forEach((empId) => {
      allLogs.push(...generateAttendanceData(empId, startDate, endDate));
    });
    setRenderedLogs(allLogs);
    setCurrentPage(1);
  };

  // Add employee ID to multi-select
  const handleAddEmployee = (id: string) => {
    const cleanId = id.trim();
    if (cleanId && !multiEmpIds.includes(cleanId)) {
      setMultiEmpIds((prev) => [...prev, cleanId]);
    }
  };

  // Remove employee ID from multi-select
  const handleRemoveEmployee = (id: string) => {
    if (multiEmpIds.length > 1) {
      setMultiEmpIds((prev) => prev.filter((item) => item !== id));
      if (activeEmpId === id) {
        const remaining = multiEmpIds.filter((item) => item !== id);
        setActiveEmpId(remaining[0]);
      }
    } else {
      alert("At least one employee must be selected!");
    }
  };

  // Filtered rows matching query
  const filteredRows = useMemo(() => {
    return renderedLogs.filter((row) => {
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

        <div className="p-4 md:p-6 space-y-2">
          {/* Breadcrumbs and Title */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Employee Job Card</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <Fingerprint className="size-5 text-primary animate-pulse" />
                </div>
                <span>Employee Job Card</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shadow-xs">
                Active Selection: {multiEmpIds.length} Emps / {startDate} to {endDate}
              </span>
            </div>
          </div>

          {/* Top Panel: Criteria Selection */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-sm space-y-5 print:hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-2">
                <Search className="size-3.5" /> Scope & Parameters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Row 1: Period & Organization */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Company
                </label>
                <SearchableSelect
                  options={companyOptions}
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Area Name
                </label>
                <SearchableSelect
                  options={areaOptions}
                  value={selectedArea}
                  onChange={setSelectedArea}
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5] text-foreground hover:bg-muted/80 transition duration-150 cursor-pointer"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5] text-foreground hover:bg-muted/80 transition duration-150 cursor-pointer"
                />
              </div>

              {/* Row 2: Employee Selection & Action */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Single Employee
                </label>
                <SearchableSelect
                  options={employeeOptions}
                  value={activeEmpId}
                  onChange={(val) => {
                    setActiveEmpId(val);
                    handleAddEmployee(val); // Auto-add to multi-select
                  }}
                  placeholder="Search by ID or Name"
                />
              </div>

              <div className="md:col-span-9 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block flex items-center gap-2">
                  Employee Id (Multi)
                  <span className="bg-primary/10 text-primary text-[8.5px] px-1.5 py-0.5 rounded-sm">Combines fetch results</span>
                </label>
                <div className="min-h-10 p-1.5 bg-muted/20 dark:bg-slate-900/10 rounded-xl border border-border/40 flex flex-wrap gap-1.5 items-center">
                  {multiEmpIds.map((id) => (
                    <span
                      key={id}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10.5px] font-extrabold transition-all duration-150 ${id === activeEmpId ? 'bg-primary text-white shadow-sm' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15'}`}
                    >
                      <span>
                        {id} ({employeeDb[id]?.name || "N/A"})
                      </span>
                      <button
                        onClick={() => handleRemoveEmployee(id)}
                        className={`font-bold ml-0.5 transition cursor-pointer ${id === activeEmpId ? 'hover:text-white/70' : 'hover:text-rose-500'}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  <div className="relative inline-block w-40">
                    <SearchableSelect
                      options={addEmployeeOptions}
                      value=""
                      onChange={(val) => {
                        if (val) handleAddEmployee(val);
                      }}
                      placeholder="+ Add Employee"
                      className="!h-7 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">
                  Type
                </label>
                <SearchableSelect
                  options={typeOptions}
                  value={selectedType}
                  onChange={setSelectedType}
                />
              </div>

              <div className="md:col-span-7 p-3 bg-primary/[0.02] dark:bg-primary/[0.01] border border-primary/20 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4 className="text-[11px] font-extrabold text-primary tracking-wide">
                      Runtime Evaluation
                    </h4>
                    <p className="text-[9px] text-muted-foreground">
                      Dynamically evaluate punch logs
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none ml-4">
                    <input
                      type="checkbox"
                      checked={isRuntimeCal}
                      onChange={(e) => setIsRuntimeCal(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {isRuntimeCal && (
                  <div className="flex-1 flex gap-2 border-l border-primary/10 pl-4">
                    <div className="space-y-0.5 w-1/2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">
                        Shift In
                      </span>
                      <input
                        type="text"
                        value={shiftInThreshold}
                        onChange={(e) => setShiftInThreshold(e.target.value)}
                        placeholder="09:00"
                        className="w-full h-8 px-2 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono"
                      />
                    </div>
                    <div className="space-y-0.5 w-1/2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">
                        Shift Out
                      </span>
                      <input
                        type="text"
                        value={shiftOutThreshold}
                        onChange={(e) => setShiftOutThreshold(e.target.value)}
                        placeholder="18:00"
                        className="w-full h-8 px-2 rounded-lg bg-card border border-border/40 text-xs font-bold outline-none focus:border-primary text-primary font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex items-end justify-end">
                <button
                  onClick={handleGetLogs}
                  className="w-full h-10 bg-primary hover:bg-primary-glow text-white font-black text-xs rounded-xl shadow-md shadow-primary/10 hover:shadow-primary/20 transition duration-150 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Fingerprint className="size-4" />
                  <span>Fetch</span>
                </button>
              </div>
            </div>


          </div>


          {/* Spreadsheet Datagrid Card */}
          <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs space-y-3">
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
                    <th className="px-4 py-3 font-extrabold text-center w-12 border-r border-border/30">
                      SL
                    </th>
                    <th className="px-4 py-3 font-extrabold w-28 border-r border-border/30">
                      Employee ID
                    </th>
                    <th className="px-4 py-3 font-extrabold w-36 border-r border-border/30">
                      Employee Name
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">
                      Atn Date
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">
                      Out Date
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">
                      In Time
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">
                      Out Time
                    </th>
                    <th className="px-4 py-3 font-extrabold text-right w-24 border-r border-border/30">
                      Over Time
                    </th>
                    <th className="px-4 py-3 font-extrabold w-32 border-r border-border/30">
                      Duty Shift
                    </th>
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
                      statusBadgeClass =
                        "text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20";
                    } else if (activeStatus === "Early Leave") {
                      statusBadgeClass =
                        "text-purple-600 dark:text-purple-400 font-extrabold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20";
                    } else if (activeStatus === "Late & Early") {
                      statusBadgeClass =
                        "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse";
                    }

                    return (
                      <tr
                        key={`${row.empId}-${row.date}`}
                        className="group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-100 whitespace-nowrap"
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20">
                          {slNo}
                        </td>
                        <td className="px-4 py-2.5 font-bold font-mono text-foreground border-r border-border/20">
                          {row.empId}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-foreground/80 border-r border-border/20">
                          {row.empName}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center font-bold text-foreground/80 border-r border-border/20">
                          {row.date}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center text-muted-foreground border-r border-border/20">
                          {row.outDate || ""}
                        </td>

                        {/* Dynamic In Time Input Cell */}
                        <td className="px-4 py-2 text-center text-primary font-bold border-r border-border/20">
                          {isRuntimeCal && row.status === "Present" ? (
                            <input
                              type="text"
                              value={row.inTime}
                              onChange={(e) =>
                                handleTimeChange(row.empId, row.date, "inTime", e.target.value)
                              }
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
                              onChange={(e) =>
                                handleTimeChange(row.empId, row.date, "outTime", e.target.value)
                              }
                              className="w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition"
                            />
                          ) : (
                            row.outTime || ""
                          )}
                        </td>

                        <td className="px-4 py-2.5 font-mono text-right font-bold text-foreground/85 border-r border-border/20">
                          {row.overtime}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground border-r border-border/20">
                          {row.shift}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={statusBadgeClass}>{activeStatus}</span>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={20}
                        className="px-4 py-16 text-center text-muted-foreground font-semibold"
                      >
                        No attendance job card data found for selected boundaries. Click GET to load
                        records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Stats & Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 print:hidden">
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRows.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredRows.length)} of {filteredRows.length}{" "}
                entries
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
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
