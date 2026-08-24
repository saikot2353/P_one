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
  Coffee,
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
    manager?: string;
  }
> = {
  "2026081190": {
    name: "kamal",
    type: "Permanent",
    subDept: "Business Innovation",
    jobTitle: "Junior Officer",
    unit: "ICT",
    shift: "Placeholder Shift",
    shiftStartDate: "2026-08-13",
    defaultHoliday: "Friday",
    manager: "Manager",
  },
  "2023043910": {
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    subDept: "Business Innovation",
    jobTitle: "Asst. Manager",
    unit: "PSL",
    shift: "General Shift",
    shiftStartDate: "01/08/2023",
    defaultHoliday: "Friday",
    manager: "Manager",
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
    manager: "Manager",
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
    manager: "Manager",
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
    } else if (empId === "2026081190") {
      // Kamal is absent as per the target image layout
      logs.push({
        empId,
        empName: emp.name,
        date: dateStr,
        outDate: "N/A",
        inTime: "-",
        outTime: "-",
        overtime: "0.00",
        shift: emp.shift,
        status: "Absent",
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

const formatDateLabel = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatDateRangeDisplay = (startStr: string, endStr: string) => {
  const format = (str: string) => {
    if (!str) return "";
    const [y, m, d] = str.split("-");
    if (!y || !m || !d) return str;
    return `${d}/${m}/${y}`;
  };
  return `${format(startStr)} to ${format(endStr)}`;
};

interface MultiSearchableSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

function MultiSearchableSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  className = "",
}: MultiSearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleToggle = (val: string) => {
    if (selectedValues.includes(val)) {
      if (selectedValues.length > 1) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        alert("At least one employee must be selected!");
      }
    } else {
      onChange([...selectedValues, val]);
    }
  };

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
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder}
        </span>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className={`w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${
                      isSelected
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

function EmployeeJobCardPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-24");

  const [selectedCompany, setSelectedCompany] = useState("Pakiza Head Office");
  const [selectedArea, setSelectedArea] = useState("Head Office");
  const [selectedType, setSelectedType] = useState("Actual");

  // Primary active employee (drives the metadata card)
  const [activeEmpId, setActiveEmpId] = useState("2026081190");

  // Multi-employee ID input (allows selecting multiple IDs for the fetch)
  const [multiEmpIds, setMultiEmpIds] = useState<string[]>(["2026081190"]);

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
      { value: "Pakiza Head Office", label: "Pakiza Head Office" },
      { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
      { value: "Pakiza Group", label: "Pakiza Group" },
    ],
    [],
  );

  const areaOptions = useMemo(
    () => [
      { value: "Head Office", label: "Head Office" },
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
  const summary = useMemo(() => {
    let totalWorking = 0;
    let present = 0;
    let absent = 0;
    let holiday = 0;
    let leave = 0;
    let overtime = 0.0;

    renderedLogs.forEach((log) => {
      const status = log.status;
      if (status === "Holiday") {
        holiday++;
      } else if (status === "CL" || status === "Leave") {
        leave++;
        totalWorking++;
      } else if (status === "Absent") {
        absent++;
        totalWorking++;
      } else {
        present++;
        totalWorking++;
        overtime += parseFloat(log.overtime) || 0;
      }
    });

    return {
      totalWorking,
      present,
      absent,
      holiday,
      leave,
      overtime: overtime.toFixed(2),
    };
  }, [renderedLogs]);

  const lateCount = useMemo(() => {
    return renderedLogs.filter(log => log.status === "Late" || log.status === "Late & Early").length;
  }, [renderedLogs]);

  const earlyLeaveCount = useMemo(() => {
    return renderedLogs.filter(log => log.status === "Early Leave" || log.status === "Late & Early").length;
  }, [renderedLogs]);

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
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-5 print:hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-2">
                <Search className="size-3.5" /> Scope & Parameters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4">
              {/* Row 1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Company
                </label>
                <SearchableSelect
                  options={companyOptions}
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Area Name
                </label>
                <SearchableSelect
                  options={areaOptions}
                  value={selectedArea}
                  onChange={setSelectedArea}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Start Date
                </label>
                <div className="relative w-full h-10 rounded-xl bg-muted border border-border/40 flex items-center justify-between px-3.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted/80 transition duration-150">
                  <span>{formatDateLabel(startDate)}</span>
                  <Calendar className="size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  End Date
                </label>
                <div className="relative w-full h-10 rounded-xl bg-muted border border-border/40 flex items-center justify-between px-3.5 text-xs font-bold text-foreground cursor-pointer hover:bg-muted/80 transition duration-150">
                  <span>{formatDateLabel(endDate)}</span>
                  <Calendar className="size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Single Employee
                </label>
                <button
                  type="button"
                  disabled
                  className="w-full h-10 px-3.5 rounded-xl bg-muted/50 border border-border/20 text-xs font-semibold text-muted-foreground/60 flex items-center justify-between text-left cursor-not-allowed"
                >
                  <span className="truncate font-bold">
                    {multiEmpIds.length > 0 ? "Disabled (Multiple selected)" : "Select Employee..."}
                  </span>
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide block">
                  Employee ID (Multi)
                </label>
                <MultiSearchableSelect
                  options={employeeOptions}
                  selectedValues={multiEmpIds}
                  onChange={(vals) => {
                    setMultiEmpIds(vals);
                    if (vals.length > 0) setActiveEmpId(vals[0]);
                  }}
                  placeholder="Select Employees"
                />
              </div>

              {/* Column 3 bottom row: Action controls inline */}
              <div className="flex items-end gap-3 pb-0.5 md:col-span-2">
                {/* Runtime evaluation toggle */}
                <div className="flex items-center gap-2 bg-muted/30 dark:bg-slate-900/10 px-3 h-10 rounded-xl border border-border/40">
                  <span className="text-[10px] font-bold text-muted-foreground">Runtime Evaluation</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isRuntimeCal}
                      onChange={(e) => setIsRuntimeCal(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Fetch Button (Blue square icon button) */}
                <button
                  onClick={handleGetLogs}
                  className="h-10 w-10 shrink-0 bg-[#0066cc] hover:bg-[#0055bb] text-white flex items-center justify-center rounded-xl shadow-xs transition duration-150 cursor-pointer"
                  title="Fetch Job Card"
                >
                  <Search className="size-4" />
                </button>

                {/* Reset Button (White circular arrow icon button) */}
                <button
                  onClick={() => {
                    setStartDate("2026-08-01");
                    setEndDate("2026-08-24");
                    setSelectedCompany("Pakiza Head Office");
                    setSelectedArea("Head Office");
                    setMultiEmpIds(["2026081190"]);
                    setActiveEmpId("2026081190");
                    setIsRuntimeCal(false);
                    setRenderedLogs(generateAttendanceData("2026081190", "2026-08-01", "2026-08-24"));
                  }}
                  className="h-10 w-10 shrink-0 bg-white hover:bg-muted border border-border text-foreground flex items-center justify-center rounded-xl shadow-3xs transition duration-150 cursor-pointer"
                  title="Reset Filter"
                >
                  <RefreshCw className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Cyan/Blue Gradient separator line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full my-2"></div>

          {/* Employee Profile Summary Card */}
          {activeEmpId && employeeDb[activeEmpId] && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-extrabold shadow-xs uppercase">
                  {employeeDb[activeEmpId].name.slice(0, 2)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-foreground uppercase">{employeeDb[activeEmpId].name}</h3>
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-md text-[10px] font-bold">
                      {employeeDb[activeEmpId].jobTitle}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>ID: <strong className="text-foreground/80">{activeEmpId}</strong></span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground/85">
                      <User className="size-3 text-muted-foreground/60" /> {employeeDb[activeEmpId].manager || "Manager"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Card Period Badge */}
              <div className="flex items-center gap-3 px-4 py-2 border border-border/60 bg-muted/20 dark:bg-slate-900/10 rounded-xl">
                <FileSpreadsheet className="size-4.5 text-blue-500" />
                <div className="text-left">
                  <div className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">JOB CARD PERIOD</div>
                  <div className="text-[10.5px] font-black text-foreground">
                    {formatDateRangeDisplay(startDate, endDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stat Cards Grid */}
          {activeEmpId && employeeDb[activeEmpId] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Department/Unit */}
              <div className="p-4 bg-card rounded-2xl border border-border/80 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                  <Building className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">DEPARTMENT / UNIT</span>
                  <strong className="text-[11.5px] text-foreground block mt-0.5">{employeeDb[activeEmpId].unit}</strong>
                  <span className="text-[10px] text-muted-foreground block">{employeeDb[activeEmpId].subDept}</span>
                </div>
              </div>

              {/* Card 2: Shift Name */}
              <div className="p-4 bg-card rounded-2xl border border-border/80 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30">
                  <Clock className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">SHIFT NAME</span>
                  <strong className="text-[11.5px] text-foreground block mt-0.5">{employeeDb[activeEmpId].shift}</strong>
                  <span className="text-[10px] text-muted-foreground block">Since {employeeDb[activeEmpId].shiftStartDate}</span>
                </div>
              </div>

              {/* Card 3: Break & Holiday */}
              <div className="p-4 bg-card rounded-2xl border border-border/80 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30">
                  <Coffee className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">BREAK & HOLIDAY</span>
                  <strong className="text-[11.5px] text-foreground block mt-0.5">Break: 1 Hour</strong>
                  <span className="text-[10px] text-muted-foreground block">Holiday: {employeeDb[activeEmpId].defaultHoliday}</span>
                </div>
              </div>

              {/* Card 4: Joining Date */}
              <div className="p-4 bg-card rounded-2xl border border-border/80 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                  <Calendar className="size-4.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">JOINING DATE</span>
                  <strong className="text-[11.5px] text-foreground block mt-0.5">{employeeDb[activeEmpId].shiftStartDate}</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">Verified Employee</span>
                </div>
              </div>
            </div>
          )}

          {/* Spreadsheet Datagrid Card */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            {/* Utilities Toolbar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/35 pb-4 print:hidden">
              {/* Text Query Filter */}
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Name, Date.."
                  className="w-full h-9 pl-9.5 pr-4 rounded-xl bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs font-bold transition duration-200"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 select-none self-end sm:self-auto">
                <button className="h-9 px-4 rounded-xl border border-emerald-200 dark:border-emerald-900/35 bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-black text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-9 px-4 rounded-xl border border-blue-200 dark:border-blue-900/35 bg-blue-50/30 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20 font-black text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-9 px-4 rounded-xl border border-rose-200 dark:border-rose-900/35 bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* High-Fidelity Spreadsheet Data Table */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[55vh] print:max-h-none print:border-none font-sans">
              <table className="w-full min-w-[950px] border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#475569] dark:text-slate-400 font-extrabold border-b border-border/50 select-none whitespace-nowrap text-[10.5px]">
                    <th className="px-4 py-3 text-center w-12 border-r border-border/30">
                      SL
                    </th>
                    <th className="px-4 py-3 w-28 border-r border-border/30">
                      EMPLOYEE ID
                    </th>
                    <th className="px-4 py-3 w-36 border-r border-border/30">
                      EMPLOYEE NAME
                    </th>
                    <th className="px-4 py-3 text-center w-28 border-r border-border/30">
                      ATN DATE
                    </th>
                    <th className="px-4 py-3 text-center w-28 border-r border-border/30">
                      OUT DATE
                    </th>
                    <th className="px-4 py-3 text-center w-24 border-r border-border/30">
                      IN TIME
                    </th>
                    <th className="px-4 py-3 text-center w-24 border-r border-border/30">
                      OUT TIME
                    </th>
                    <th className="px-4 py-3 text-right w-24 border-r border-border/30">
                      OVER TIME
                    </th>
                    <th className="px-4 py-3 w-32 border-r border-border/30">
                      DUTY SHIFT
                    </th>
                    <th className="px-4 py-3 text-center w-24">STATUS</th>
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

                    // Assign colors according to status value
                    let statusBadgeClass = "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide border";
                    if (activeStatus === "Present") {
                      statusBadgeClass += " bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/35";
                    } else if (activeStatus === "Absent") {
                      statusBadgeClass += " bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/35";
                    } else if (activeStatus === "Holiday") {
                      statusBadgeClass += " bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800";
                    } else {
                      statusBadgeClass += " bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/35";
                    }

                    return (
                      <tr
                        key={`${row.empId}-${row.date}`}
                        className="group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-100 whitespace-nowrap font-semibold text-foreground/80"
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20">
                          {slNo}
                        </td>
                        <td className="px-4 py-2.5 font-bold font-mono text-foreground border-r border-border/20">
                          {row.empId}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-foreground border-r border-border/20">
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
                {/* PDF/Excel batch download buttons */}
                <div className="flex items-center gap-1.5 font-black text-[10px]">
                  <button className="h-8.5 px-4 bg-[#72b043] hover:bg-[#629c36] text-white rounded-lg transition uppercase tracking-wider cursor-pointer">
                    VIEW(PDF)
                  </button>
                  <button className="h-8.5 px-4 bg-[#72b043] hover:bg-[#629c36] text-white rounded-lg transition uppercase tracking-wider cursor-pointer">
                    EXCEL
                  </button>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary Panel */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Attendance Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 rounded-lg text-[10px] font-extrabold">
                  Late: {lateCount}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-lg text-[10px] font-extrabold">
                  Early Leave: {earlyLeaveCount}
                </span>
              </div>
            </div>

            {/* Summary Grid Block */}
            <div className="grid grid-cols-2 md:grid-cols-6 border border-border/60 rounded-xl overflow-hidden divide-x divide-y md:divide-y-0 divide-border/60 text-center font-sans">
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Working Day</div>
                <div className="text-base font-black text-foreground">{summary.totalWorking}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Present Day</div>
                <div className="text-base font-black text-foreground">{summary.present}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Absent Day</div>
                <div className="text-base font-black text-foreground">{summary.absent}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Holiday</div>
                <div className="text-base font-black text-foreground">{summary.holiday}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Leave day</div>
                <div className="text-base font-black text-foreground">{summary.leave}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Over Time</div>
              <div className="text-base font-black text-foreground">{summary.overtime}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
