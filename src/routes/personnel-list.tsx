import { Fragment, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmployeeDetailTabs } from "@/components/dashboard/employee-detail-tabs";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Search, FileDown, Printer, FileText, ChevronRight, UserPlus, Eye, Edit3, X, SlidersHorizontal,
  ChevronDown, MapPin, Phone, Mail, Calendar, User, Heart, Briefcase, DollarSign, EyeOff, LayoutGrid, Check,
  TrendingUp, ArrowUpRight, FileSignature, ShieldCheck, CreditCard, UserCheck, UserCog, Clock, CalendarRange,
  CalendarHeart, Power, FileClock, Sparkles, AlertCircle, RefreshCw, Info, ArrowUp, ArrowDown, Save, Star,
  Trash2, RotateCcw
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
export const employeesData = [
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

type ColumnKey = keyof typeof defaultColumns;

type ColumnTemplate = {
  id: string;
  name: string;
  isActive: boolean;
  isDefault?: boolean;
  columns: Record<ColumnKey, boolean>;
  order: ColumnKey[];
};

const columnStorageKey = "personnel_list_column_templates_v1";
const defaultColumnOrder = Object.keys(defaultColumns) as ColumnKey[];

const createDefaultColumnTemplate = (): ColumnTemplate => ({
  id: "default",
  name: "Default Columns",
  isActive: true,
  isDefault: true,
  columns: { ...defaultColumns },
  order: [...defaultColumnOrder],
});

const getColumnLabel = (key: ColumnKey) => {
  const labels: Record<ColumnKey, string> = {
    empIdOffc: "Emp ID (Offc)",
    employeeType: "Employee Type",
    dept: "Department",
    section: "Section",
    jobTitle: "Job Title",
    unit: "Unit",
    line: "Line",
    grade: "Grade",
    shift: "Shift",
    shiftStart: "Shift Start",
    joinDate: "Joining Date",
    blood: "Blood Group",
    basic: "Basic",
    gross: "Gross",
    email: "Email",
    officeMob: "Office Mobile",
    gender: "Gender",
    dob: "Date of Birth",
    empStatus: "Employment Status",
    village: "Per. Village",
    acStatus: "A/C Status",
  };

  return labels[key];
};

const normalizeColumnOrder = (order?: ColumnKey[]) => {
  const validKeys = new Set(defaultColumnOrder);
  const cleaned = (order || []).filter((key): key is ColumnKey => validKeys.has(key));
  return [...cleaned, ...defaultColumnOrder.filter(key => !cleaned.includes(key))];
};

const normalizeColumnVisibility = (columns?: Partial<Record<ColumnKey, boolean>>) => ({
  ...defaultColumns,
  ...(columns || {}),
});

const columnRenderers: Record<ColumnKey, (employee: any) => ReactNode> = {
  empIdOffc: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.offcId}</td>,
  employeeType: (e) => <td className="px-5 py-3.5 text-foreground/85 font-medium">{e.type}</td>,
  dept: (e) => <td className="px-5 py-3.5 text-foreground/80 font-medium">{e.dept}</td>,
  section: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.sect}</td>,
  jobTitle: (e) => <td className="px-5 py-3.5 font-semibold text-foreground">{e.title}</td>,
  unit: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.unit}</td>,
  line: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.line}</td>,
  grade: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.grade}</td>,
  shift: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.shift}</td>,
  shiftStart: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.shiftStart}</td>,
  joinDate: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{e.joinDate}</td>,
  blood: (e) => (
    <td className="px-5 py-3.5 text-center">
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
        {e.blood}
      </span>
    </td>
  ),
  basic: (e) => (
    <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground/90">
      ৳{parseFloat(e.basic).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
    </td>
  ),
  gross: (e) => (
    <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">
      ৳{parseFloat(e.gross).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
    </td>
  ),
  email: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.email}</td>,
  officeMob: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium font-mono">{e.officeMob}</td>,
  gender: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.gender}</td>,
  dob: (e) => <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{e.dob}</td>,
  empStatus: (e) => (
    <td className="px-5 py-3.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${e.empStatus === "Permanent" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
        <span className={`size-1.5 rounded-full ${e.empStatus === "Permanent" ? "bg-success" : "bg-warning animate-pulse"}`} />
        {e.empStatus}
      </span>
    </td>
  ),
  village: (e) => <td className="px-5 py-3.5 text-muted-foreground/80 font-medium truncate max-w-[150px]" title={e.village}>{e.village}</td>,
  acStatus: (e) => (
    <td className="px-5 py-3.5 text-center">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
        <span className="size-1 rounded-full bg-emerald-500 animate-ping" />
        {e.acStatus}
      </span>
    </td>
  ),
};

const getColumnHeaderClass = (key: ColumnKey) => {
  const alignClass = key === "blood" || key === "acStatus"
    ? "text-center"
    : key === "basic" || key === "gross"
      ? "text-right"
      : "";

  return `px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a] ${alignClass}`;
};

function PersonnelListPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (parsed && parsed.length > 0) {
            const merged = [...parsed];
            employeesData.forEach(d => {
              if (!merged.some(m => m.id === d.id)) {
                merged.push(d);
              }
            });
            setEmployees(merged);
            localStorage.setItem("recruitment_synced_employees", JSON.stringify(merged));
          } else {
            localStorage.setItem("recruitment_synced_employees", JSON.stringify(employeesData));
            setEmployees(employeesData);
          }
        } catch (e) {
          console.error(e);
          setEmployees(employeesData);
        }
      } else {
        localStorage.setItem("recruitment_synced_employees", JSON.stringify(employeesData));
        setEmployees(employeesData);
      }
    }
  }, []);

  // Rejoin & Resign/Terminate States
  const [resignModalEmp, setResignModalEmp] = useState<any | null>(null);
  const [resignStatus, setResignStatus] = useState<"Resigned" | "Terminated">("Resigned");
  const [resignDate, setResignDate] = useState("");
  const [resignRemarks, setResignRemarks] = useState("");

  const [rejoinModalEmp, setRejoinModalEmp] = useState<any | null>(null);
  const [newEmpId, setNewEmpId] = useState("");
  const [newJoinDate, setNewJoinDate] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newSect, setNewSect] = useState("");
  const [newEmpType, setNewEmpType] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newShift, setNewShift] = useState("");
  const [newBasic, setNewBasic] = useState("");
  const [newGross, setNewGross] = useState("");
  const [rejoinRemarks, setRejoinRemarks] = useState("");

  const handleResignSubmit = () => {
    if (!resignModalEmp) return;
    const updated = employees.map(emp => {
      if (emp.id === resignModalEmp.id) {
        return {
          ...emp,
          status: resignStatus,
          acStatus: "Inactive",
          resignDate: resignDate || new Date().toLocaleDateString('en-GB'),
          resignRemarks: resignRemarks
        };
      }
      return emp;
    });
    setEmployees(updated);
    localStorage.setItem("recruitment_synced_employees", JSON.stringify(updated));
    setResignModalEmp(null);
    setResignRemarks("");
    setResignDate("");

    setBulkActionMessage(`${resignModalEmp.name} has been successfully marked as ${resignStatus.toLowerCase()}.`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  const handleRejoinSubmit = () => {
    if (!rejoinModalEmp) return;
    if (employees.some(emp => emp.id === newEmpId)) {
      alert("Employee ID already exists!");
      return;
    }

    const newEmp = {
      ...rejoinModalEmp,
      id: newEmpId,
      joinDate: newJoinDate || new Date().toLocaleDateString('en-GB'),
      status: "Working",
      acStatus: "Active",
      title: newDesignation,
      dept: newDept,
      sect: newSect,
      type: newEmpType,
      empStatus: newEmpType === "Permanent" ? "Permanent" : "Probation",
      grade: newGrade,
      shift: newShift,
      basic: newBasic,
      gross: newGross,
      rejoinRef: rejoinModalEmp.id,
      rejoinRemarks: rejoinRemarks,
      confirmDate: "",
      holiday: "—",
      rejoinedTo: undefined // clear rejoin pointer for the active record
    };

    const updated = employees.map(emp => {
      if (emp.id === rejoinModalEmp.id) {
        return {
          ...emp,
          rejoinedTo: newEmpId
        };
      }
      return emp;
    });

    updated.unshift(newEmp);

    setEmployees(updated);
    localStorage.setItem("recruitment_synced_employees", JSON.stringify(updated));
    setRejoinModalEmp(null);
    setRejoinRemarks("");

    setBulkActionMessage(`${rejoinModalEmp.name} has rejoined successfully with new Employee ID: ${newEmpId}.`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };


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
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({ ...defaultColumns });
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>([...defaultColumnOrder]);
  const [draftVisibleCols, setDraftVisibleCols] = useState<Record<ColumnKey, boolean>>({ ...defaultColumns });
  const [draftColumnOrder, setDraftColumnOrder] = useState<ColumnKey[]>([...defaultColumnOrder]);
  const [columnTemplates, setColumnTemplates] = useState<ColumnTemplate[]>([createDefaultColumnTemplate()]);
  const [templateName, setTemplateName] = useState("");
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

      // Bypass default 'Working' status filter when actively searching by name/ID
      if (searchQuery.trim() === "" && empIdFilter.trim() === "") {
        if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
      } else {
        if (statusFilter !== "ALL" && statusFilter !== "Working" && e.status !== statusFilter) return false;
      }

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fallback = [createDefaultColumnTemplate()];

    try {
      const savedTemplates = localStorage.getItem(columnStorageKey);
      const parsedTemplates = savedTemplates ? JSON.parse(savedTemplates) : [];
      const storedTemplates = Array.isArray(parsedTemplates) ? parsedTemplates : [];
      const customTemplates = storedTemplates
        .filter((template: any) => template?.id !== "default")
        .map((template: any) => ({
          id: String(template.id || `template-${Date.now()}`),
          name: String(template.name || "Saved Template"),
          isActive: Boolean(template.isActive),
          columns: normalizeColumnVisibility(template.columns),
          order: normalizeColumnOrder(template.order),
        }));
      const savedDefault = storedTemplates.find((template: any) => template?.id === "default");
      const templates = [
        {
          ...createDefaultColumnTemplate(),
          isActive: savedDefault?.isActive ?? !customTemplates.some((template: ColumnTemplate) => template.isActive),
        },
        ...customTemplates,
      ];
      const normalizedTemplates = templates.some(template => template.isActive)
        ? templates.map((template, index) => ({ ...template, isActive: template.isActive && templates.findIndex(item => item.isActive) === index }))
        : fallback;
      const activeTemplate = normalizedTemplates.find(template => template.isActive) || normalizedTemplates[0];

      setColumnTemplates(normalizedTemplates);
      setVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
      setColumnOrder(normalizeColumnOrder(activeTemplate.order));
      setDraftVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
      setDraftColumnOrder(normalizeColumnOrder(activeTemplate.order));
    } catch (error) {
      console.error(error);
      setColumnTemplates(fallback);
      localStorage.setItem(columnStorageKey, JSON.stringify(fallback));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(columnStorageKey, JSON.stringify(columnTemplates));
  }, [columnTemplates]);

  const openColumnModal = () => {
    setDraftVisibleCols({ ...visibleCols });
    setDraftColumnOrder([...columnOrder]);
    setIsColSelectorOpen(true);
  };

  const toggleDraftColumn = (key: ColumnKey) => {
    setDraftVisibleCols(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const moveDraftColumn = (key: ColumnKey, direction: "up" | "down") => {
    setDraftColumnOrder(prev => {
      const currentIndex = prev.indexOf(key);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
      return next;
    });
  };

  const updateDraftSerial = (key: ColumnKey, value: string) => {
    const serial = Number(value);
    if (!Number.isFinite(serial)) return;

    setDraftColumnOrder(prev => {
      const currentIndex = prev.indexOf(key);
      const nextIndex = Math.min(Math.max(serial - 1, 0), prev.length - 1);
      if (currentIndex < 0 || currentIndex === nextIndex) return prev;

      const next = [...prev];
      next.splice(currentIndex, 1);
      next.splice(nextIndex, 0, key);
      return next;
    });
  };

  const applyColumnConfig = (templates = columnTemplates) => {
    const columns = normalizeColumnVisibility(draftVisibleCols);
    const order = normalizeColumnOrder(draftColumnOrder);

    setVisibleCols(columns);
    setColumnOrder(order);
    setDraftVisibleCols(columns);
    setDraftColumnOrder(order);
    setColumnTemplates(templates.map(template => template.isActive && !template.isDefault ? { ...template, columns, order } : template));
    setBulkActionMessage("Column arrangement applied successfully.");
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  const activateColumnTemplate = (templateId: string) => {
    const targetTemplate = columnTemplates.find(template => template.id === templateId);
    if (!targetTemplate) return;

    const columns = normalizeColumnVisibility(targetTemplate.columns);
    const order = normalizeColumnOrder(targetTemplate.order);
    const updatedTemplates = columnTemplates.map(template => ({
      ...template,
      isActive: template.id === templateId,
    }));

    setColumnTemplates(updatedTemplates);
    setVisibleCols(columns);
    setColumnOrder(order);
    setDraftVisibleCols(columns);
    setDraftColumnOrder(order);
    setBulkActionMessage(`${targetTemplate.name} template activated.`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  const deactivateColumnTemplate = (templateId: string) => {
    const targetTemplate = columnTemplates.find(template => template.id === templateId);
    const defaultTemplate = createDefaultColumnTemplate();
    if (!targetTemplate || targetTemplate.isDefault) return;

    const updatedTemplates = columnTemplates.map(template => ({
      ...template,
      isActive: template.id === defaultTemplate.id,
    }));

    setColumnTemplates(updatedTemplates);
    setVisibleCols({ ...defaultTemplate.columns });
    setColumnOrder([...defaultTemplate.order]);
    setDraftVisibleCols({ ...defaultTemplate.columns });
    setDraftColumnOrder([...defaultTemplate.order]);
    setBulkActionMessage(`${targetTemplate.name} template deactivated. Default columns restored.`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  const saveColumnTemplate = () => {
    const name = templateName.trim();
    if (!name) {
      setBulkActionMessage("Enter a template name before saving.");
      setTimeout(() => setBulkActionMessage(null), 4500);
      return;
    }

    const columns = normalizeColumnVisibility(draftVisibleCols);
    const order = normalizeColumnOrder(draftColumnOrder);
    const newTemplate: ColumnTemplate = {
      id: `template-${Date.now()}`,
      name,
      isActive: true,
      columns,
      order,
    };
    const updatedTemplates = columnTemplates.map(template => ({ ...template, isActive: false })).concat(newTemplate);

    setTemplateName("");
    setColumnTemplates(updatedTemplates);
    applyColumnConfig(updatedTemplates);
  };

  const resetDraftColumns = () => {
    setDraftVisibleCols({ ...defaultColumns });
    setDraftColumnOrder([...defaultColumnOrder]);
  };

  const deleteColumnTemplate = (templateId: string) => {
    const targetTemplate = columnTemplates.find(template => template.id === templateId);
    if (!targetTemplate || targetTemplate.isDefault) return;

    const remainingTemplates = columnTemplates.filter(template => template.id !== templateId);
    const updatedTemplates = targetTemplate.isActive
      ? remainingTemplates.map((template, index) => ({ ...template, isActive: index === 0 }))
      : remainingTemplates;
    const activeTemplate = updatedTemplates.find(template => template.isActive) || createDefaultColumnTemplate();

    setColumnTemplates(updatedTemplates);
    setVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
    setColumnOrder(normalizeColumnOrder(activeTemplate.order));
    setDraftVisibleCols(normalizeColumnVisibility(activeTemplate.columns));
    setDraftColumnOrder(normalizeColumnOrder(activeTemplate.order));
    setBulkActionMessage(`${targetTemplate.name} template deleted.`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        {/* Main Content Area */}
        <div className="p-4 md:p-6 xl:p-8 space-y-2">

          {/* Breadcrumb and Page Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <div className="bg-card border border-border/70 rounded-lg px-3.5 py-2 shadow-2xs hover:shadow-xs transition duration-200 flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85">Total Employees:</div>
                <div className="text-xs font-extrabold text-foreground">{employees.length}</div>
              </div>
              <div className="bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border border-[oklch(0.62_0.16_155/0.2)] rounded-lg px-3.5 py-2 shadow-2xs flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-success/95">Working:</div>
                <div className="text-xs font-extrabold text-success">{employees.filter(e => e.status === "Working").length}</div>
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
          <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" />
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/10">
              <button
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                className="flex items-center gap-2.5 text-xs font-semibold text-foreground/90 hover:text-primary transition-colors"
              >
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-2xs">
                  <SlidersHorizontal className="size-3.5 text-primary" />
                </div>
                <span>Advanced Search Filters</span>
                {(() => {
                  const activeCount = [
                    empIdFilter !== "",
                    deptFilter !== "ALL",
                    sectFilter !== "ALL",
                    empTypeFilter !== "ALL",
                    statusFilter !== "Working",
                    empStatusFilter !== "ALL",
                    designationFilter !== "ALL"
                  ].filter(Boolean).length;

                  return activeCount > 0 ? (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary text-primary-foreground">
                      {activeCount} active
                    </span>
                  ) : null;
                })()}
                <ChevronDown className={`size-3.5 text-muted-foreground/60 transition-transform duration-300 ${isFilterCollapsed ? "-rotate-90" : ""}`} />
              </button>
              {(!isFilterCollapsed && (empIdFilter || deptFilter !== "ALL" || sectFilter !== "ALL" || empTypeFilter !== "ALL" || statusFilter !== "Working" || empStatusFilter !== "ALL" || designationFilter !== "ALL")) && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-medium text-rose-500 hover:text-rose-600 hover:underline"
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
                    <SearchableSelect
                      value={empTypeFilter}
                      onChange={setEmpTypeFilter}
                      options={empTypesList.map(type => ({ value: type, label: type === "ALL" ? "All Types" : type }))}
                      placeholder="Select type..."
                    />
                  </div>
                </div>

                {/* Department select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Department</label>
                  <div className="relative">
                    <SearchableSelect
                      value={deptFilter}
                      onChange={setDeptFilter}
                      options={departmentsList.map(dept => ({ value: dept, label: dept === "ALL" ? "All Departments" : dept }))}
                      placeholder="Select department..."
                    />
                  </div>
                </div>

                {/* Section select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Section</label>
                  <div className="relative">
                    <SearchableSelect
                      value={sectFilter}
                      onChange={setSectFilter}
                      options={sectionsList.map(sect => ({ value: sect, label: sect === "ALL" ? "All Sections" : sect }))}
                      placeholder="Select section..."
                    />
                  </div>
                </div>

                {/* Designation select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Designation</label>
                  <div className="relative">
                    <SearchableSelect
                      value={designationFilter}
                      onChange={setDesignationFilter}
                      options={designationsList.map(des => ({ value: des, label: des === "ALL" ? "All Designations" : des }))}
                      placeholder="Select designation..."
                    />
                  </div>
                </div>

                {/* Working Status select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Working Status</label>
                  <div className="relative">
                    <SearchableSelect
                      value={statusFilter}
                      onChange={setStatusFilter}
                      options={[
                        { value: "ALL", label: "All Status" },
                        { value: "Working", label: "Working" },
                        { value: "On Leave", label: "On Leave" },
                        { value: "Resigned", label: "Resigned" },
                        { value: "Terminated", label: "Terminated" }
                      ]}
                      placeholder="Select status..."
                    />
                  </div>
                </div>

                {/* Employment Status select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Employment Status</label>
                  <div className="relative">
                    <SearchableSelect
                      value={empStatusFilter}
                      onChange={setEmpStatusFilter}
                      options={[
                        { value: "ALL", label: "All Statuses" },
                        { value: "Probation", label: "Probation" },
                        { value: "Permanent", label: "Permanent" }
                      ]}
                      placeholder="Select status..."
                    />
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
          <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 via-primary to-indigo-500" />

            {selectedEmpIds.length === 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-card via-muted/5 to-card">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Personnel Operations & Document Center</h3>
                    <p className="text-xs text-muted-foreground/80 mt-0.5 font-normal">Generate statutory letters, print certificates, and manage employee profiles in bulk.</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-normal shadow-3xs">
                  <Info className="size-3.5 text-indigo-500 shrink-0" />
                  <span>Select employees in the table below to activate bulk tools & printing</span>
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
          <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">

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
                <div className="relative">
                  <button
                    onClick={openColumnModal}
                    className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200"
                  >
                    <LayoutGrid className="size-3.5 text-primary" />
                    <span>Columns</span>
                    <ChevronDown className="size-3 text-muted-foreground/60" />
                  </button>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY DATAGRID TABLE CONTAINER WITH STICKY FIXED LEFT SIDE COLUMNS */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                    {/* Fixed Actions and Checkbox Column */}
                    <th className="sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[130px] min-w-[130px] max-w-[130px]">
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
                    <th className="sticky left-[130px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]">Emp ID</th>
                    <th className="sticky left-[230px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px]">Name</th>

                    {/* Standard Configurable headers */}
                    {columnOrder.filter(key => visibleCols[key]).map(key => (
                      <th key={key} className={getColumnHeaderClass(key)}>{getColumnLabel(key)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {filteredEmployees.map((e, index) => {
                    const stickyCellBgClass = "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";

                    return (
                      <tr
                        key={e.id}
                        onClick={() => navigate({ to: '/employee-detail/$id', params: { id: e.id } })}
                        className={`group transition-all cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]`}
                      >
                        {/* Sticky left Action & Checkbox Column cell */}
                        <td className={`sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[130px] min-w-[130px] max-w-[130px] transition-all`} onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center gap-1.5 justify-center">
                            <input
                              type="checkbox"
                              checked={selectedEmpIds.includes(e.id)}
                              onChange={() => toggleSelectEmp(e.id)}
                              className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                            />
                            <button
                              className="size-6 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              onClick={() => navigate({ to: '/employee-detail/$id', params: { id: e.id } })}
                              title="Quick Sheet"
                            >
                              <FileText className="size-3" />
                            </button>
                            <button
                              className="size-6 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              onClick={() => navigate({ to: '/employee-detail/$id', params: { id: e.id } })}
                              title="View File"
                            >
                              <Eye className="size-3" />
                            </button>

                            {(!e.status || e.status === "Working" || e.status === "On Leave") ? (
                              <button
                                className="size-6 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                                onClick={() => {
                                  setResignModalEmp(e);
                                  setResignStatus("Resigned");
                                  setResignRemarks("");
                                  setResignDate(new Date().toISOString().split('T')[0]);
                                }}
                                title="Resign / Terminate"
                              >
                                <Power className="size-3" />
                              </button>
                            ) : !e.rejoinedTo ? (
                              <button
                                className="size-6 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                                onClick={() => {
                                  setRejoinModalEmp(e);
                                  setNewEmpId(e.id + "R");
                                  setNewJoinDate(new Date().toISOString().split('T')[0]);
                                  setNewDesignation(e.title || "");
                                  setNewDept(e.dept || "");
                                  setNewSect(e.sect || "");
                                  setNewEmpType(e.type || "Permanent");
                                  setNewGrade(e.grade || "None");
                                  setNewShift(e.shift || "General Shift");
                                  setNewBasic(e.basic || "0.00");
                                  setNewGross(e.gross || "0.00");
                                  setRejoinRemarks("");
                                }}
                                title="Rejoin Employee"
                              >
                                <UserPlus className="size-3" />
                              </button>
                            ) : (
                              <button
                                className="size-6 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 cursor-not-allowed flex items-center justify-center shadow-3xs"
                                title={`Rejoined as ID: ${e.rejoinedTo}`}
                                disabled
                              >
                                <UserCheck className="size-3" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Sticky left Emp ID & Name cells */}
                        <td className={`sticky left-[130px] ${stickyCellBgClass} px-3 py-3.5 font-medium text-primary border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all`}>
                          {e.id}
                        </td>
                        <td className={`sticky left-[230px] ${stickyCellBgClass} px-3 py-3.5 font-medium text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px] transition-all`}>
                          <div className="flex items-center gap-2">
                            <div className="size-6.5 rounded-lg bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center shadow-2xs animate-pulse">
                              {e.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate max-w-[120px] font-medium text-foreground">{e.name}</span>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                {e.status && e.status !== "Working" && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded leading-none ${e.status === "Resigned" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                      e.status === "Terminated" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                        "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                    }`}>
                                    {e.status}
                                  </span>
                                )}
                                {e.rejoinedTo && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded leading-none bg-purple-500/10 text-purple-500 border border-purple-500/20" title={`Rejoined as ID: ${e.rejoinedTo}`}>
                                    Rejoined
                                  </span>
                                )}
                                {e.rejoinRef && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded leading-none bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" title={`Rejoined from ID: ${e.rejoinRef}`}>
                                    Rejoined Emp
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Configurable Cells */}
                        {columnOrder.filter(key => visibleCols[key]).map(key => (
                          <Fragment key={key}>{columnRenderers[key](e)}</Fragment>
                        ))}
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

        {/* Column Arrangement Modal */}
        {isColSelectorOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsColSelectorOpen(false);
            }}
          >
            <div className="bg-card w-full max-w-5xl border border-border rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border/40 bg-muted/15">
                <div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Column Arrangement</h3>
                  </div>
                  <p className="text-xs text-muted-foreground/75 mt-1">Set show/hide status, change serial order, and save reusable templates.</p>
                </div>
                <button onClick={() => setIsColSelectorOpen(false)} className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center">
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] min-h-0 overflow-hidden">
                <div className="border-b lg:border-b-0 lg:border-r border-border/40 p-4 space-y-4 overflow-y-auto">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Templates</span>
                      <span className="text-[10px] font-bold text-primary">{columnTemplates.length} saved</span>
                    </div>

                    <div className="space-y-2">
                      {columnTemplates.map(template => {
                        const visibleCount = Object.values(template.columns).filter(Boolean).length;

                        return (
                          <div
                            key={template.id}
                            className={`rounded-xl border p-3 transition ${template.isActive ? "border-primary/45 bg-primary/5" : "border-border/60 bg-muted/15"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  {template.isDefault && <Star className="size-3.5 text-amber-500 fill-amber-500/20" />}
                                  <span className="text-xs font-extrabold text-foreground truncate">{template.name}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground/75 mt-1">
                                  {visibleCount} visible, {defaultColumnOrder.length - visibleCount} hidden
                                </div>
                              </div>
                              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${template.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                                {template.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => template.isActive && !template.isDefault ? deactivateColumnTemplate(template.id) : activateColumnTemplate(template.id)}
                                disabled={template.isActive && template.isDefault}
                                className="h-7 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-[10px] font-bold text-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              >
                                {template.isActive && !template.isDefault ? "Deactivate" : "Activate"}
                              </button>
                              {!template.isDefault && (
                                <button
                                  onClick={() => deleteColumnTemplate(template.id)}
                                  className="h-7 px-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-[10px] font-bold transition flex items-center gap-1"
                                >
                                  <Trash2 className="size-3" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">Save Current As Template</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(event) => setTemplateName(event.target.value)}
                        placeholder="Template name"
                        className="w-full h-8.5 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                      />
                      <button
                        onClick={saveColumnTemplate}
                        className="h-8.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs hover:opacity-95 transition flex items-center gap-1.5"
                      >
                        <Save className="size-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex flex-col">
                  <div className="grid grid-cols-[72px_1fr_104px_92px] gap-3 px-4 py-3 border-b border-border/40 bg-muted/25 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75">
                    <span>Serial</span>
                    <span>Column Name</span>
                    <span>Show / Hide</span>
                    <span className="text-right">Move</span>
                  </div>

                  <div className="overflow-y-auto p-4 space-y-2">
                    {draftColumnOrder.map((key, index) => (
                      <div key={key} className="grid grid-cols-[72px_1fr_104px_92px] gap-3 items-center rounded-xl border border-border/50 bg-card hover:bg-muted/20 p-2.5 transition">
                        <input
                          type="number"
                          min={1}
                          max={draftColumnOrder.length}
                          value={index + 1}
                          onChange={(event) => updateDraftSerial(key, event.target.value)}
                          className="h-8 w-16 px-2 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs font-bold text-center"
                        />

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{getColumnLabel(key)}</div>
                          <div className="text-[10px] text-muted-foreground/70">Configurable personnel field</div>
                        </div>

                        <button
                          onClick={() => toggleDraftColumn(key)}
                          className={`h-8 px-2.5 rounded-lg border text-[10px] font-extrabold transition flex items-center justify-center gap-1.5 ${draftVisibleCols[key] ? "bg-primary/10 border-primary/25 text-primary" : "bg-muted/30 border-border/50 text-muted-foreground"}`}
                        >
                          <span className={`size-4 rounded-md border flex items-center justify-center ${draftVisibleCols[key] ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"}`}>
                            {draftVisibleCols[key] && <Check className="size-2.5 stroke-[3.5]" />}
                          </span>
                          {draftVisibleCols[key] ? "Show" : "Hide"}
                        </button>

                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => moveDraftColumn(key, "up")}
                            disabled={index === 0}
                            className="size-8 rounded-lg border border-border/60 bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition flex items-center justify-center"
                            title="Move up"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            onClick={() => moveDraftColumn(key, "down")}
                            disabled={index === draftColumnOrder.length - 1}
                            className="size-8 rounded-lg border border-border/60 bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition flex items-center justify-center"
                            title="Move down"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-border/40 bg-muted/15">
                    <button
                      onClick={resetDraftColumns}
                      className="h-8.5 px-4 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-bold text-foreground/80 transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="size-3.5 text-primary" />
                      Reset Default
                    </button>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsColSelectorOpen(false)}
                        className="h-8.5 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          applyColumnConfig();
                          setIsColSelectorOpen(false);
                        }}
                        className="h-8.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-95 transition duration-200"
                      >
                        Apply Arrangement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resign / Terminate Modal */}
        {resignModalEmp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md border border-border rounded-lg shadow-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">Resign / Terminate Employee</h3>
                <button onClick={() => setResignModalEmp(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                You are updating the status of <span className="font-semibold text-foreground">{resignModalEmp.name}</span> (ID: {resignModalEmp.id}).
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Type</label>
                  <select
                    value={resignStatus}
                    onChange={(e) => setResignStatus(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  >
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Effective Date</label>
                  <input
                    type="date"
                    value={resignDate}
                    onChange={(e) => setResignDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Remarks / Reason</label>
                  <textarea
                    value={resignRemarks}
                    onChange={(e) => setResignRemarks(e.target.value)}
                    placeholder="Enter reason or notes..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  onClick={() => setResignModalEmp(null)}
                  className="h-8.5 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResignSubmit}
                  className="h-8.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition duration-200"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejoin Modal */}
        {rejoinModalEmp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg border border-border rounded-lg shadow-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">Rejoin / Re-employ Employee</h3>
                <button onClick={() => setRejoinModalEmp(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>

              <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                Rejoining will create a <span className="font-semibold text-foreground">new employment profile</span> with a new Employee ID for <span className="font-semibold text-foreground">{rejoinModalEmp.name}</span>. The old files, documents, and history will be connected automatically.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Employee ID</label>
                  <input
                    type="text"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    placeholder="e.g. 202610291"
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Joining Date</label>
                  <input
                    type="date"
                    value={newJoinDate}
                    onChange={(e) => setNewJoinDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Designation / Title</label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Section</label>
                  <input
                    type="text"
                    value={newSect}
                    onChange={(e) => setNewSect(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Employee Type</label>
                  <select
                    value={newEmpType}
                    onChange={(e) => setNewEmpType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Probation">Probation</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Grade</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Shift</label>
                  <input
                    type="text"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Basic Salary</label>
                  <input
                    type="text"
                    value={newBasic}
                    onChange={(e) => setNewBasic(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gross Salary</label>
                  <input
                    type="text"
                    value={newGross}
                    onChange={(e) => setNewGross(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rejoin Notes / Remarks</label>
                <textarea
                  value={rejoinRemarks}
                  onChange={(e) => setRejoinRemarks(e.target.value)}
                  placeholder="Enter any additional notes..."
                  rows={2}
                  className="w-full p-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  onClick={() => setRejoinModalEmp(null)}
                  className="h-8.5 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejoinSubmit}
                  className="h-8.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition duration-200"
                >
                  Confirm Rejoin
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
