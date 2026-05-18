import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search, FileDown, Printer, FileText, ChevronRight, UserPlus, Eye, Edit3, X, SlidersHorizontal,
  ChevronDown, MapPin, Phone, Mail, Calendar, User, Heart, Briefcase, DollarSign, EyeOff, LayoutGrid, Check,
  TrendingUp, ArrowUpRight, FileSignature, ShieldCheck, CreditCard, UserCheck, UserCog, Clock, CalendarRange,
  CalendarHeart, Power, FileClock, Sparkles, AlertCircle, RefreshCw
} from "lucide-react";

export const Route = createFileRoute("/personnel-list")({
  head: () => ({
    meta: [
      { title: "Personnel List — CRIPTON HRIS" },
      { name: "description", content: "Professional personnel database, advanced column configurations, custom search filters, and slide-over profile sheets." },
    ],
  }),
  component: PersonnelListPage,
});

// Full employee mock dataset matching your exact search text output!
const employeesData = [
  {
    id: "2023043910",
    offcId: "—",
    name: "Tahmid Afsar Shapno",
    type: "Permanent",
    dept: "Business Innovation",
    sect: "Project Resource & Strategy",
    title: "Asst. Manager",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "01/08/2023",
    joinDate: "01/08/2023",
    holiday: "—",
    blood: "AB (+ve)",
    basic: "91200.00",
    gross: "152000.00",
    email: "tahmid.bd@pakizasoftware.com",
    phone: "—",
    officeMob: "01750021154",
    personalContact: "—",
    gender: "Male",
    dob: "12/07/1999",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Permanent",
    confirmDate: "01/11/2023",
    village: "Bhola",
    acStatus: "Active"
  },
  {
    id: "2023046001",
    offcId: "—",
    name: "Sohanur Rahman Sohan",
    type: "Office Executive",
    dept: "HR, Admin and Compliance",
    sect: "Admin",
    title: "Executive",
    joinDate: "01/11/2023",
    holiday: "—",
    blood: "A (+ve)",
    basic: "16200.00",
    gross: "27000.00",
    email: "sohan.admin@pakizatvl.com",
    phone: "6615",
    officeMob: "01321-175928",
    personalContact: "—",
    gender: "Male",
    dob: "12/02/1998",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Permanent",
    confirmDate: "—",
    village: "Village # Bishnopur",
    acStatus: "Active"
  },
  {
    id: "2023043021",
    offcId: "—",
    name: "Easin Mia",
    type: "Office Executive",
    dept: "HR, Admin and Compliance",
    sect: "Admin",
    title: "Receptionist",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "Exe-Ptvl",
    shiftStart: "01/05/2023",
    joinDate: "01/02/2023",
    holiday: "—",
    blood: "A (-ve)",
    basic: "11400.00",
    gross: "19000.00",
    email: "easin.admin@pakizatvl.com",
    phone: "—",
    officeMob: "1324726766",
    personalContact: "—",
    gender: "Male",
    dob: "16/07/1997",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Permanent",
    confirmDate: "—",
    village: "Chandidar",
    acStatus: "Active"
  },
  {
    id: "2026059411",
    offcId: "—",
    name: "Jannatul Maowa",
    type: "Office Executive",
    dept: "HR, Admin and Compliance",
    sect: "Admin",
    title: "Jr. Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "10/05/2026",
    joinDate: "10/05/2026",
    holiday: "—",
    blood: "O (+ve)",
    basic: "12000.00",
    gross: "20000.00",
    email: "maowa.admin@pakizasoftware.com",
    phone: "—",
    officeMob: "1777735383",
    personalContact: "—",
    gender: "Female",
    dob: "15/07/2001",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "10/08/2026",
    village: "Hawlader Bari, Vill# Voroshakathi",
    acStatus: "Active"
  },
  {
    id: "2024049326",
    offcId: "—",
    name: "Hanif Uddin",
    type: "Office Executive",
    dept: "Business Innovation",
    sect: "APPS Team",
    title: "Sr. Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General-Exec",
    shiftStart: "01/06/2024",
    joinDate: "01/06/2024",
    holiday: "—",
    blood: "A (+ve)",
    basic: "30000.00",
    gross: "50000.00",
    email: "hanif.inno@pakizasoftware.com",
    phone: "—",
    officeMob: "01963978074",
    personalContact: "—",
    gender: "Male",
    dob: "15/03/1992",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "01/09/2024",
    village: "Village # Londoha",
    acStatus: "Active"
  },
  {
    id: "2026058726",
    offcId: "—",
    name: "Parvej Mahmud",
    type: "Office Executive",
    dept: "Business Innovation",
    sect: "APPS Team",
    title: "Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "22/02/2026",
    joinDate: "22/02/2026",
    holiday: "—",
    blood: "O (+ve)",
    basic: "24000.00",
    gross: "40000.00",
    email: "parvej.inno@pakizasoftware.com",
    phone: "—",
    officeMob: "01521205808",
    personalContact: "—",
    gender: "Male",
    dob: "06/07/1999",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "22/05/2026",
    village: "H# 1227",
    acStatus: "Active"
  },
  {
    id: "2023045044",
    offcId: "—",
    name: "Sultan Ahmed",
    type: "Office Executive",
    dept: "Implementation & Business Analysis",
    sect: "Business Analysis",
    title: "Manager",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "01/10/2023",
    joinDate: "01/10/2023",
    holiday: "—",
    blood: "O (+ve)",
    basic: "48600.00",
    gross: "81000.00",
    email: "sultan.ba@pakizasoftware.com",
    phone: "—",
    officeMob: "1329726651",
    personalContact: "—",
    gender: "Male",
    dob: "03/11/1992",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Permanent",
    confirmDate: "—",
    village: "House :12, Bhangnahati",
    acStatus: "Active"
  },
  {
    id: "2026058686",
    offcId: "—",
    name: "Md. Abdur Rahaman",
    type: "Office Executive",
    dept: "Business Innovation",
    sect: "Business Innovation",
    title: "Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "15/02/2026",
    joinDate: "15/02/2026",
    holiday: "—",
    blood: "O (+ve)",
    basic: "30000.00",
    gross: "50000.00",
    email: "rahaman.inno@pakizasoftware.com",
    phone: "—",
    officeMob: "01531959653",
    personalContact: "—",
    gender: "Male",
    dob: "16/12/1997",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "15/05/2026",
    village: "Vill# Chachahar Moddhopara",
    acStatus: "Active"
  },
  {
    id: "2025058109",
    offcId: "—",
    name: "Mohammad Methoun Ahmed",
    type: "Office Executive",
    dept: "Business Automation",
    sect: "Core Development",
    title: "Sr. Manager",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "15/12/2025",
    joinDate: "22/12/2025",
    holiday: "—",
    blood: "B (+ve)",
    basic: "78000.00",
    gross: "130000.00",
    email: "methoun.ba@pakizasoftware.com",
    phone: "—",
    officeMob: "1713060442",
    personalContact: "—",
    gender: "Male",
    dob: "12/04/1993",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "22/06/2026",
    village: "Village # Vewamara",
    acStatus: "Active"
  },
  {
    id: "2026058685",
    offcId: "—",
    name: "Md Johirul Islam",
    type: "Office Executive",
    dept: "Business Automation",
    sect: "Core Development",
    title: "Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    shift: "General Shift",
    shiftStart: "15/02/2026",
    joinDate: "15/02/2026",
    holiday: "—",
    blood: "O (+ve)",
    basic: "24000.00",
    gross: "40000.00",
    email: "johirul.ba@pakizasoftware.com",
    phone: "—",
    officeMob: "01712345678",
    personalContact: "—",
    gender: "Male",
    dob: "01/01/1996",
    otStatus: "N/A",
    otRate: "0",
    status: "Working",
    empStatus: "Probation",
    confirmDate: "15/05/2026",
    village: "Dhaka",
    acStatus: "Active"
  }
];

// All headers config that users can toggle visibility for!
const defaultColumns = {
  empIdOffc: false,
  employeeType: true,
  dept: true,
  section: true,
  jobTitle: true,
  unit: true,
  line: false,
  grade: false,
  shift: true,
  shiftStart: false,
  joinDate: true,
  blood: true,
  basic: true,
  gross: true,
  email: true,
  officeMob: true,
  gender: true,
  dob: false,
  empStatus: true,
  village: true,
  acStatus: true,
};

function PersonnelListPage() {
  const [employees, setEmployees] = useState(employeesData);
  const [selectedEmp, setSelectedEmp] = useState<typeof employeesData[0] | null>(null);

  // Selection & Action Hub States
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [activeDocGenerating, setActiveDocGenerating] = useState<string | null>(null);
  const [bulkActionMessage, setBulkActionMessage] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [systemOffice, setSystemOffice] = useState<"system" | "office">("system");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [sectFilter, setSectFilter] = useState("ALL");
  const [empTypeFilter, setEmpTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("Working");
  const [empStatusFilter, setEmpStatusFilter] = useState("ALL");
  const [designationFilter, setDesignationFilter] = useState("ALL");

  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [visibleCols, setVisibleCols] = useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = useState(false);

  // Dynamic values extracted from dataset to populate dropdowns beautifully
  const departmentsList = useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map(e => e.dept)))], []);
  const sectionsList = useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map(e => e.sect)))], []);
  const designationsList = useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map(e => e.title)))], []);
  const empTypesList = useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map(e => e.type)))], []);

  // Real-time interactive search and multi-filtering logic!
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      // 1. Text Search Bar (Filters across Name, ID, Email, Role)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          e.name.toLowerCase().includes(q) ||
          e.id.includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Commma-separated Employee ID list
      if (empIdFilter.trim() !== "") {
        const ids = empIdFilter.split(",").map(id => id.trim()).filter(id => id.length > 0);
        if (ids.length > 0 && !ids.includes(e.id)) return false;
      }

      // 3. Dropdown filters
      if (deptFilter !== "ALL" && e.dept !== deptFilter) return false;
      if (sectFilter !== "ALL" && e.sect !== sectFilter) return false;
      if (empTypeFilter !== "ALL" && e.type !== empTypeFilter) return false;
      if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
      if (empStatusFilter !== "ALL" && e.empStatus !== empStatusFilter) return false;
      if (designationFilter !== "ALL" && e.title !== designationFilter) return false;

      return true;
    });
  }, [employees, searchQuery, empIdFilter, deptFilter, sectFilter, empTypeFilter, statusFilter, empStatusFilter, designationFilter]);

  // Reset all filters easily
  const resetFilters = () => {
    setSearchQuery("");
    setEmpIdFilter("");
    setDeptFilter("ALL");
    setSectFilter("ALL");
    setEmpTypeFilter("ALL");
    setStatusFilter("Working");
    setEmpStatusFilter("ALL");
    setDesignationFilter("ALL");
    setSelectedEmpIds([]);
  };

  const toggleSelectAll = () => {
    if (filteredEmployees.length === 0) return;
    if (selectedEmpIds.length === filteredEmployees.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(filteredEmployees.map(e => e.id));
    }
  };

  const toggleSelectEmp = (id: string) => {
    setSelectedEmpIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Triggers print visual loading states beautifully!
  const triggerDocGeneration = (docName: string) => {
    setActiveDocGenerating(docName);
    setTimeout(() => {
      setActiveDocGenerating(null);
      const targetNames = selectedEmpIds.map(id => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.name : id;
      }).join(", ");
      
      setBulkActionMessage(`Generated ${docName} successfully for: ${targetNames.length > 55 ? targetNames.substring(0, 52) + "..." : targetNames}`);
      setTimeout(() => setBulkActionMessage(null), 4500);
    }, 1200);
  };

  const triggerBulkAction = (actionName: string) => {
    const targetNames = selectedEmpIds.map(id => {
      const emp = employees.find(e => e.id === id);
      return emp ? emp.name : id;
    }).join(", ");
    
    setBulkActionMessage(`Bulk action [${actionName}] applied successfully to: ${targetNames.length > 55 ? targetNames.substring(0, 52) + "..." : targetNames}`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  const toggleColumn = (key: keyof typeof defaultColumns) => {
    setVisibleCols(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Close column selector when clicking outside
  useEffect(() => {
    if (!isColSelectorOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".col-selector-container")) {
        setIsColSelectorOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isColSelectorOpen]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />
        
        {/* Main Content Area */}
        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          
          {/* Breadcrumb and Page Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Personnel List</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">Personnel List</h1>
              </div>
            </div>
            
            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs hover:shadow-xs transition duration-200">
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">Total Employees</div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">{employees.length}</div>
              </div>
              <div className="bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border border-[oklch(0.62_0.16_155/0.2)] rounded-xl px-3.5 py-1.5 shadow-2xs">
                <div className="text-[9px] font-bold uppercase tracking-wider text-success/90">Working</div>
                <div className="text-sm font-extrabold text-success mt-0.5">{employees.filter(e => e.status === "Working").length}</div>
              </div>
              <button 
                onClick={() => window.open("/add-employee", "_blank")}
                className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <UserPlus className="size-4" /> Add Employee
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Section */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <button 
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                className="flex items-center gap-2 text-xs font-bold text-foreground/90 hover:text-primary transition-colors"
              >
                <SlidersHorizontal className="size-4 text-primary" />
                <span>Advanced Search Filters</span>
                <ChevronDown className={`size-3.5 text-muted-foreground/60 transition-transform duration-300 ${isFilterCollapsed ? "-rotate-90" : ""}`} />
              </button>
              {(!isFilterCollapsed && (empIdFilter || deptFilter !== "ALL" || sectFilter !== "ALL" || empTypeFilter !== "ALL" || statusFilter !== "ALL" || empStatusFilter !== "ALL" || designationFilter !== "ALL")) && (
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-destructive hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${isFilterCollapsed ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100 p-5"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
                
                {/* Employee ID search list */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75 flex items-center justify-between">
                    <span>Employee ID</span>
                    <span className="text-[9px] text-primary/80 lowercase tracking-normal font-semibold">use comma as separator</span>
                  </label>
                  <input
                    type="text"
                    value={empIdFilter}
                    onChange={(e) => setEmpIdFilter(e.target.value)}
                    placeholder="e.g. 2025057068, 2023046001"
                    className="w-full h-9.5 px-3 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all duration-200"
                  />
                </div>

                {/* ID Type Segment Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">ID Type Scope</label>
                  <div className="flex p-1 rounded-xl bg-muted border border-border/40 h-9.5">
                    <button
                      onClick={() => setSystemOffice("system")}
                      className={`flex-1 text-[10px] font-bold rounded-lg transition-all ${systemOffice === "system" ? "bg-card text-primary shadow-2xs font-extrabold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      System ID
                    </button>
                    <button
                      onClick={() => setSystemOffice("office")}
                      className={`flex-1 text-[10px] font-bold rounded-lg transition-all ${systemOffice === "office" ? "bg-card text-primary shadow-2xs font-extrabold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Office ID
                    </button>
                  </div>
                </div>

                {/* Employee Type select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Employee Type</label>
                  <div className="relative">
                    <select
                      value={empTypeFilter}
                      onChange={(e) => setEmpTypeFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      {empTypesList.map(type => <option key={type} value={type}>{type === "ALL" ? "All Types" : type}</option>)}
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

                {/* Department select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Department</label>
                  <div className="relative">
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      {departmentsList.map(dept => <option key={dept} value={dept}>{dept === "ALL" ? "All Departments" : dept}</option>)}
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

                {/* Section select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Section</label>
                  <div className="relative">
                    <select
                      value={sectFilter}
                      onChange={(e) => setSectFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      {sectionsList.map(sect => <option key={sect} value={sect}>{sect === "ALL" ? "All Sections" : sect}</option>)}
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

                {/* Designation select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Designation</label>
                  <div className="relative">
                    <select
                      value={designationFilter}
                      onChange={(e) => setDesignationFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      {designationsList.map(des => <option key={des} value={des}>{des === "ALL" ? "All Designations" : des}</option>)}
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

                {/* Working Status select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Working Status</label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="Working">Working</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

                {/* Employment Status select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Employment Status</label>
                  <div className="relative">
                    <select
                      value={empStatusFilter}
                      onChange={(e) => setEmpStatusFilter(e.target.value)}
                      className="w-full h-9.5 pl-3 pr-8 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all appearance-none font-semibold text-foreground/80 cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Probation">Probation</option>
                      <option value="Permanent">Permanent</option>
                    </select>
                    <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bulk Actions Notification Toast */}
          {bulkActionMessage && (
            <div className="fixed top-6 right-6 z-[60] max-w-md bg-[#0f172a] dark:bg-card border border-primary/45 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="size-4 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse">HRIS Operations Hub</div>
                <p className="text-xs text-white dark:text-foreground font-bold mt-0.5 leading-snug">{bulkActionMessage}</p>
              </div>
              <button onClick={() => setBulkActionMessage(null)} className="text-slate-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Personnel Operations & Document Hub */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 via-primary to-indigo-500" />
            
            {selectedEmpIds.length === 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-card">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground">Personnel Operations & Document Center</h3>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">Generate statutory letters, print certificates, and manage employee profiles in bulk.</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs">
                  <AlertCircle className="size-4 text-amber-500 shrink-0 animate-bounce" />
                  <span>Select employees below to unlock document printing & status updates</span>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Active Selection Header */}
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary">
                      {selectedEmpIds.length} Selected
                    </span>
                    <h3 className="text-xs font-extrabold text-foreground tracking-tight">Active Operations & Print Console</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedEmpIds([])}
                    className="text-[10px] font-extrabold text-muted-foreground hover:text-primary transition"
                  >
                    Clear Selection
                  </button>
                </div>

                {/* Operations Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  
                  {/* Left Console: Documents Grid */}
                  <div className="xl:col-span-8 space-y-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                      <FileSignature className="size-3.5 text-primary" />
                      <span>Document Generation & Printing Hub</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Column A: Letters & Agreements */}
                      <div className="space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5">
                        <div className="text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5">
                          <FileSignature className="size-3.5 text-indigo-500" />
                          <span>Letters & Agreements</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            "Offer Letter",
                            "Joining Letter",
                            "Appointment Letter",
                            "Resignation Letter",
                            "Confirmation Letter",
                            "Experience Certificate",
                            "NOC Letter",
                            "Salary Certificate"
                          ].map(doc => (
                            <button
                              key={doc}
                              disabled={activeDocGenerating !== null}
                              onClick={() => triggerDocGeneration(doc)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50"
                            >
                              {activeDocGenerating === doc ? (
                                <RefreshCw className="size-3.5 animate-spin text-primary" />
                              ) : (
                                <FileSignature className="size-3.5 text-indigo-500" />
                              )}
                              <span className="truncate">{doc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Column B: Forms & Service Book */}
                      <div className="space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5">
                        <div className="text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5">
                          <ShieldCheck className="size-3.5 text-emerald-500" />
                          <span>Statutory & Forms</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            "Nominee Form",
                            "Age Verification",
                            "Application Form",
                            "Service Book",
                            "Emp Check List",
                            "Performance Appraisal",
                            "BI Verification",
                            "Police Verification"
                          ].map(doc => (
                            <button
                              key={doc}
                              disabled={activeDocGenerating !== null}
                              onClick={() => triggerDocGeneration(doc)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50"
                            >
                              {activeDocGenerating === doc ? (
                                <RefreshCw className="size-3.5 animate-spin text-primary" />
                              ) : (
                                <ShieldCheck className="size-3.5 text-emerald-500" />
                              )}
                              <span className="truncate">{doc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Column C: Identity & Clearance */}
                      <div className="space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5">
                        <div className="text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5">
                          <CreditCard className="size-3.5 text-amber-500" />
                          <span>Identity & Clearance</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            "ID Card",
                            "Employee Info",
                            "Sticker Format",
                            "Clearance Doc",
                            "Personal Resume",
                            "Report Set",
                            "Zero Abuse EXE",
                            "Service CoC"
                          ].map(doc => (
                            <button
                              key={doc}
                              disabled={activeDocGenerating !== null}
                              onClick={() => triggerDocGeneration(doc)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50"
                            >
                              {activeDocGenerating === doc ? (
                                <RefreshCw className="size-3.5 animate-spin text-primary" />
                              ) : (
                                <CreditCard className="size-3.5 text-amber-500" />
                              )}
                              <span className="truncate">{doc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Console: Bulk Operations */}
                  <div className="xl:col-span-4 space-y-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                      <UserCog className="size-3.5 text-primary" />
                      <span>Personnel Operations Center</span>
                    </div>

                    <div className="bg-muted/15 border border-border/20 rounded-xl p-3.5 h-[calc(100%-1.75rem)] flex flex-col justify-between gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Make Permanent", icon: UserCheck, color: "hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
                          { name: "Status Update", icon: UserCog, color: "hover:bg-indigo-500/10 hover:border-indigo-500/30 text-indigo-600 dark:text-indigo-400" },
                          { name: "OT Status Update", icon: Clock, color: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-600 dark:text-amber-400" },
                          { name: "Shift Rotation", icon: CalendarRange, color: "hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-600 dark:text-rose-400" },
                          { name: "Set Holiday", icon: CalendarHeart, color: "hover:bg-cyan-500/10 hover:border-cyan-500/30 text-cyan-600 dark:text-cyan-400" },
                          { name: "Set A/C IsActive", icon: Power, color: "hover:bg-purple-500/10 hover:border-purple-500/30 text-purple-600 dark:text-purple-400" },
                          { name: "ID Card IssueDate", icon: FileClock, color: "hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400" },
                          { name: "Revenue Mapping", icon: DollarSign, color: "hover:bg-teal-500/10 hover:border-teal-500/30 text-teal-600 dark:text-teal-400" }
                        ].map(op => {
                          const IconComponent = op.icon;
                          return (
                            <button
                              key={op.name}
                              onClick={() => triggerBulkAction(op.name)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs ${op.color}`}
                            >
                              <IconComponent className="size-4.5" />
                              <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-none">{op.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-[10px] text-muted-foreground/80 leading-relaxed">
                        💡 <span className="font-extrabold text-foreground">Bulk operations</span> applied here will simultaneously update the corporate records for all {selectedEmpIds.length} checked personnel.
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Data Grid Card Container */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            
            {/* Toolbar Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40">
              
              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <FileDown className="size-3.5 text-emerald-500" />
                  <span>Excel</span>
                </button>
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Toolbar Right: Search Bar & Column Configuration Toggle */}
              <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                <div className="relative flex-1 md:w-64 lg:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, ID, designaton..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                {/* Column Configuration Selector */}
                <div className="relative col-selector-container">
                  <button 
                    onClick={() => setIsColSelectorOpen(!isColSelectorOpen)}
                    className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200"
                  >
                    <LayoutGrid className="size-3.5 text-primary" />
                    <span>Columns</span>
                    <ChevronDown className="size-3 text-muted-foreground/60" />
                  </button>
                  
                  {isColSelectorOpen && (
                    <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-card border border-border/80 shadow-lg p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/30">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Show Columns</span>
                        <button 
                          onClick={() => setVisibleCols(defaultColumns)}
                          className="text-[9px] font-bold text-primary hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {Object.keys(defaultColumns).map((colKey) => (
                          <button
                            key={colKey}
                            onClick={() => toggleColumn(colKey as keyof typeof defaultColumns)}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-muted transition duration-150"
                          >
                            <div className={`size-4 rounded-md border flex items-center justify-center transition-all ${visibleCols[colKey as keyof typeof defaultColumns] ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                              {visibleCols[colKey as keyof typeof defaultColumns] && <Check className="size-2.5 stroke-[3.5]" />}
                            </div>
                            <span className="font-medium text-foreground/80 capitalize">
                              {colKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY DATAGRID TABLE CONTAINER WITH STICKY FIXED LEFT SIDE COLUMNS */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                    {/* Fixed Actions and Checkbox Column */}
                    <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px]">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={filteredEmployees.length > 0 && selectedEmpIds.length === filteredEmployees.length}
                          onChange={toggleSelectAll}
                          className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer" 
                        />
                        <span>∇</span>
                      </div>
                    </th>
                    {/* Fixed Sticky Header for ID and Name */}
                    <th className="sticky left-[110px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]">Emp ID</th>
                    <th className="sticky left-[210px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px]">Name</th>
                    
                    {/* Standard Configurable headers */}
                    {visibleCols.empIdOffc && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Emp ID(Offc)</th>}
                    {visibleCols.employeeType && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Employee Type</th>}
                    {visibleCols.dept && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Department</th>}
                    {visibleCols.section && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Section</th>}
                    {visibleCols.jobTitle && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Job Title</th>}
                    {visibleCols.unit && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Unit</th>}
                    {visibleCols.line && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Line</th>}
                    {visibleCols.grade && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Grade</th>}
                    {visibleCols.shift && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Shift</th>}
                    {visibleCols.shiftStart && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Shift Start</th>}
                    {visibleCols.joinDate && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Joining Date</th>}
                    {visibleCols.blood && <th className="px-5 py-4 font-bold text-center bg-[#f1f5f9] dark:bg-[#0f172a]">Blood Group</th>}
                    {visibleCols.basic && <th className="px-5 py-4 font-bold text-right bg-[#f1f5f9] dark:bg-[#0f172a]">Basic</th>}
                    {visibleCols.gross && <th className="px-5 py-4 font-bold text-right bg-[#f1f5f9] dark:bg-[#0f172a]">Gross</th>}
                    {visibleCols.email && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Email</th>}
                    {visibleCols.officeMob && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Office Mobile</th>}
                    {visibleCols.gender && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Gender</th>}
                    {visibleCols.dob && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Date of Birth</th>}
                    {visibleCols.empStatus && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Employment Status</th>}
                    {visibleCols.village && <th className="px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]">Per.Village</th>}
                    {visibleCols.acStatus && <th className="px-5 py-4 font-bold text-center bg-[#f1f5f9] dark:bg-[#0f172a]">A/C Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {filteredEmployees.map((e, index) => {
                    const isSelected = selectedEmp?.id === e.id;
                    // Define fully solid background classes to prevent text bleed-through when scrolling horizontally
                    const stickyCellBgClass = isSelected
                      ? "bg-[#f1f5f9] dark:bg-[#1e293b] group-hover:bg-[#e2e8f0] dark:group-hover:bg-[#334155]"
                      : "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";
                    
                    return (
                      <tr 
                        key={e.id}
                        onClick={() => setSelectedEmp(e)}
                        className={`group transition-all cursor-pointer ${isSelected ? "bg-[#f1f5f9] dark:bg-[#1e293b]" : "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"}`}
                      >
                        {/* Sticky left Action & Checkbox Column cell */}
                        <td className={`sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[110px] min-w-[110px] max-w-[110px] transition-all`} onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center gap-1.5 justify-center">
                            <input 
                              type="checkbox" 
                              checked={selectedEmpIds.includes(e.id)}
                              onChange={() => toggleSelectEmp(e.id)}
                              className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer" 
                            />
                            <button 
                              className="size-6 bg-amber-500 text-white rounded hover:bg-amber-600 transition flex items-center justify-center shadow-2xs"
                              onClick={() => setSelectedEmp(e)}
                              title="Quick Sheet"
                            >
                              <FileText className="size-3" />
                            </button>
                            <button 
                              className="size-6 border border-border hover:bg-muted text-muted-foreground hover:text-primary rounded transition flex items-center justify-center"
                              onClick={() => setSelectedEmp(e)}
                              title="View File"
                            >
                              <Eye className="size-3" />
                            </button>
                            <button 
                              className="size-6 border border-border hover:bg-muted text-muted-foreground hover:text-primary rounded transition flex items-center justify-center"
                              title="Edit Info"
                            >
                              <Edit3 className="size-3" />
                            </button>
                          </div>
                        </td>

                        {/* Sticky left Emp ID & Name cells */}
                        <td className={`sticky left-[110px] ${stickyCellBgClass} px-3 py-3.5 font-bold text-primary border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all`}>
                          {e.id}
                        </td>
                        <td className={`sticky left-[210px] ${stickyCellBgClass} px-3 py-3.5 font-semibold text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px] transition-all`}>
                        <div className="flex items-center gap-2">
                          <div className="size-6.5 rounded-lg bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center shadow-2xs">
                            {e.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                          </div>
                          <span className="truncate max-w-[120px]">{e.name}</span>
                        </div>
                      </td>

                      {/* Configurable Cells */}
                      {visibleCols.empIdOffc && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.offcId}</td>}
                      {visibleCols.employeeType && <td className="px-5 py-3.5 text-foreground/85 font-medium">{e.type}</td>}
                      {visibleCols.dept && <td className="px-5 py-3.5 text-foreground/80 font-medium">{e.dept}</td>}
                      {visibleCols.section && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.sect}</td>}
                      {visibleCols.jobTitle && <td className="px-5 py-3.5 font-semibold text-foreground">{e.title}</td>}
                      {visibleCols.unit && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.unit}</td>}
                      {visibleCols.line && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.line}</td>}
                      {visibleCols.grade && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.grade}</td>}
                      {visibleCols.shift && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.shift}</td>}
                      {visibleCols.shiftStart && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.shiftStart}</td>}
                      {visibleCols.joinDate && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.joinDate}</td>}
                      
                      {visibleCols.blood && (
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                            {e.blood}
                          </span>
                        </td>
                      )}
                      
                      {visibleCols.basic && (
                        <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground/90">
                          ৳{parseFloat(e.basic).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      {visibleCols.gross && (
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">
                          ৳{parseFloat(e.gross).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      )}
                      
                      {visibleCols.email && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.email}</td>}
                      {visibleCols.officeMob && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium font-mono">{e.officeMob}</td>}
                      {visibleCols.gender && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.gender}</td>}
                      {visibleCols.dob && <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.dob}</td>}
                      
                      {visibleCols.empStatus && (
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${e.empStatus === "Permanent" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                            <span className={`size-1.5 rounded-full ${e.empStatus === "Permanent" ? "bg-success" : "bg-warning animate-pulse"}`} />
                            {e.empStatus}
                          </span>
                        </td>
                      )}

                      {visibleCols.village && <td className="px-5 py-3.5 text-muted-foreground/80 font-medium truncate max-w-[150px]" title={e.village}>{e.village}</td>}
                      
                      {visibleCols.acStatus && (
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                            <span className="size-1 rounded-full bg-emerald-500 animate-ping" />
                            {e.acStatus}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={30} className="px-5 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <EyeOff className="size-8 text-muted-foreground/45" />
                          <span className="font-semibold text-xs">No employees match the specified search parameters.</span>
                          <button onClick={resetFilters} className="text-[10px] font-bold text-primary hover:underline mt-1">Clear Filters</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Footer Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-border/40 bg-muted/15">
              <span className="text-[11px] font-semibold text-muted-foreground/80">
                Showing {filteredEmployees.length > 0 ? 1 : 0} to {filteredEmployees.length} of {employees.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition" disabled>Previous</button>
                <button className="h-8 w-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs">1</button>
                <button className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition" disabled>Next</button>
              </div>
            </div>

          </div>
        </div>

        {/* HIGH-FIDELITY DIGITAL FILE MODAL FOR THE SELECTED EMPLOYEE */}
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              {/* Header card banner */}
              <div className="relative p-6 border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition duration-150 animate-in spin-in-90 duration-200"
                >
                  <X className="size-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-lg shadow-sm">
                    {selectedEmp.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                      {selectedEmp.name}
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground/80 font-semibold">{selectedEmp.title}</p>
                  </div>
                </div>
              </div>

              {/* RENDER COMPONENT HERE */}
              <EmployeeDetailTabs selectedEmp={selectedEmp} />

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border/40 bg-muted/5">
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="h-10 px-5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition duration-200"
                >
                  Close Folder
                </button>
                <button className="h-10 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all">
                  Edit Digital File
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
