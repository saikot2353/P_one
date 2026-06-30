import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight,
  CheckCircle2,
  Search,
  Printer,
  FileDown,
  Plus,
  Pencil,
  Check,
  X,
  Send,
  Eye,
  ShieldCheck,
  ArrowLeft,
  Trash2,
  Table as TableIcon,
  XCircle,
  FolderOpen,
  Clock,
  Building,
  UserCheck,
} from "lucide-react";

interface SearchParams {
  selectedSl?: string;
  mode?: "list" | "create" | "edit" | "details";
  filterWorkflow?: string;
}

export const Route = createFileRoute("/hr-policy-jds")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      selectedSl: (search.selectedSl as string) || "",
      mode: (search.mode as "list" | "create" | "edit" | "details") || "list",
      filterWorkflow: (search.filterWorkflow as string) || "ALL",
    };
  },
  component: JDSManagementPage,
});

interface JDSItem {
  sl: number;
  company: string;
  location: string;
  department: string;
  section: string;
  designation: string;
  title: string;
  reportsTo: string;
  reportees: string;
  isDefault: boolean;

  jobSummary: { jdFor: string; keyTask: string }[];
  responsibilities: { jdFor: string; keyTask: string }[];
  technologies: { jdFor: string; keyTask: string }[];
  competencies: { jdFor: string; keyTask: string }[];

  submitStatus: "Pending" | "Submitted";
  hrStatus: "Pending" | "Approved" | "Rejected";
  hodStatus: "Pending" | "Approved" | "Rejected";
  plantHeadStatus: "Pending" | "Approved" | "Rejected";
  mdStatus: "Pending" | "Approved" | "Rejected";
}

const INITIAL_JDS_LIST: JDSItem[] = [
  {
    sl: 1,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Receptionist",
    title: "Default",
    reportsTo: "Rajebul Hasan Rajon",
    reportees: "—",
    isDefault: true,
    jobSummary: [{ jdFor: "Customer Service", keyTask: "Welcome buyers and visitors warmly." }],
    responsibilities: [{ jdFor: "Phone System", keyTask: "Manage incoming phone calls." }],
    technologies: [{ jdFor: "Cripton ERP", keyTask: "Use Guest Booking module." }],
    competencies: [{ jdFor: "Soft Skills", keyTask: "Excellent verbal communication." }],
    submitStatus: "Submitted",
    hrStatus: "Approved",
    hodStatus: "Approved",
    plantHeadStatus: "Pending",
    mdStatus: "Pending",
  },
  {
    sl: 2,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    designation: "Executive",
    title: "Default",
    reportsTo: "Md. Anik Islam",
    reportees: "—",
    isDefault: true,
    jobSummary: [{ jdFor: "ERP Support", keyTask: "Provide configuration support." }],
    responsibilities: [{ jdFor: "Client Training", keyTask: "Provide live training webinars." }],
    technologies: [{ jdFor: "Database tools", keyTask: "Run SQL scripts." }],
    competencies: [{ jdFor: "Technical Support", keyTask: "Clear diagnostic abilities." }],
    submitStatus: "Submitted",
    hrStatus: "Pending",
    hodStatus: "Pending",
    plantHeadStatus: "Pending",
    mdStatus: "Pending",
  },
];

function JDSManagementPage() {
  const { selectedSl, mode, filterWorkflow: urlFilterWorkflow } = Route.useSearch();
  const navigate = useNavigate();

  const [jdsList, setJdsList] = useState<JDSItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_jds_list");
      return saved ? JSON.parse(saved) : INITIAL_JDS_LIST;
    }
    return INITIAL_JDS_LIST;
  });

  const saveList = (updated: JDSItem[]) => {
    setJdsList(updated);
    localStorage.setItem("hris_jds_list", JSON.stringify(updated));
  };

  const activeSl = selectedSl ? Number(selectedSl) : null;
  const activeItem = activeSl ? jdsList.find((j) => j.sl === activeSl) || null : null;

  // Global Checkbox Bulk actions (LIST MODE)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [actingRole, setActingRole] = useState<"HR" | "HOD" | "Plant Head" | "MD">("HR");

  // Filter pane states
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterWorkflow, setFilterWorkflow] = useState("ALL");
  const [filterSearch, setFilterSearch] = useState("");

  useEffect(() => {
    if (urlFilterWorkflow) setFilterWorkflow(urlFilterWorkflow);
  }, [urlFilterWorkflow]);

  // Filters logic
  const filteredJds = useMemo(() => {
    return jdsList.filter((j) => {
      if (filterCompany !== "All" && j.company !== filterCompany) return false;
      if (filterDept !== "All Departments" && j.department !== filterDept) return false;
      if (filterSearch) {
        const q = filterSearch.toLowerCase();
        if (!j.designation.toLowerCase().includes(q) && !j.department.toLowerCase().includes(q))
          return false;
      }

      if (filterWorkflow !== "ALL") {
        if (filterWorkflow === "DRAFT" && j.submitStatus !== "Pending") return false;
        if (
          filterWorkflow === "HR" &&
          !(j.submitStatus === "Submitted" && j.hrStatus === "Pending")
        )
          return false;
        if (
          filterWorkflow === "HOD" &&
          !(
            j.submitStatus === "Submitted" &&
            j.hrStatus === "Approved" &&
            j.hodStatus === "Pending"
          )
        )
          return false;
        if (
          filterWorkflow === "PLANT" &&
          !(
            j.submitStatus === "Submitted" &&
            j.hrStatus === "Approved" &&
            j.hodStatus === "Approved" &&
            j.plantHeadStatus === "Pending"
          )
        )
          return false;
        if (
          filterWorkflow === "MD" &&
          !(
            j.submitStatus === "Submitted" &&
            j.hrStatus === "Approved" &&
            j.hodStatus === "Approved" &&
            j.plantHeadStatus === "Approved" &&
            j.mdStatus === "Pending"
          )
        )
          return false;
        if (
          filterWorkflow === "APPROVED" &&
          !(
            j.submitStatus === "Submitted" &&
            j.hrStatus === "Approved" &&
            j.hodStatus === "Approved" &&
            j.plantHeadStatus === "Approved" &&
            j.mdStatus === "Approved"
          )
        )
          return false;
      }
      return true;
    });
  }, [jdsList, filterCompany, filterDept, filterSearch, filterWorkflow]);

  // KPI Stats
  const totalCount = jdsList.length;
  const draftCount = jdsList.filter((j) => j.submitStatus === "Pending").length;
  const pendingApprovalCount = jdsList.filter(
    (j) =>
      j.submitStatus === "Submitted" &&
      (j.hrStatus === "Pending" ||
        j.hodStatus === "Pending" ||
        j.plantHeadStatus === "Pending" ||
        j.mdStatus === "Pending"),
  ).length;
  const fullyApprovedCount = jdsList.filter(
    (j) =>
      j.submitStatus === "Submitted" &&
      j.hrStatus === "Approved" &&
      j.hodStatus === "Approved" &&
      j.plantHeadStatus === "Approved" &&
      j.mdStatus === "Approved",
  ).length;

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredJds.map((r) => r.sl)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (sl: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sl)) next.delete(sl);
      else next.add(sl);
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    const updated = jdsList.map((j) => {
      if (!selectedIds.has(j.sl)) return j;
      if (actingRole === "HR") return { ...j, hrStatus: "Approved" as const };
      if (actingRole === "HOD") return { ...j, hodStatus: "Approved" as const };
      if (actingRole === "Plant Head") return { ...j, plantHeadStatus: "Approved" as const };
      if (actingRole === "MD") return { ...j, mdStatus: "Approved" as const };
      return j;
    });
    saveList(updated);
    setSelectedIds(new Set());
    toast.success(`Bulk approved as ${actingRole}!`);
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    const updated = jdsList.map((j) => {
      if (!selectedIds.has(j.sl)) return j;
      if (actingRole === "HR") return { ...j, hrStatus: "Rejected" as const };
      if (actingRole === "HOD") return { ...j, hodStatus: "Rejected" as const };
      if (actingRole === "Plant Head") return { ...j, plantHeadStatus: "Rejected" as const };
      if (actingRole === "MD") return { ...j, mdStatus: "Rejected" as const };
      return j;
    });
    saveList(updated);
    setSelectedIds(new Set());
    toast.success(`Bulk rejected as ${actingRole}!`);
  };

  // --- FORM STATES (CREATE/EDIT) ---
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [location, setLocation] = useState("PSL-Operation");
  const [department, setDepartment] = useState("HR, Admin and Compliance");
  const [section, setSection] = useState("Admin");
  const [designation, setDesignation] = useState("Receptionist");
  const [isDefault, setIsDefault] = useState(true);
  const [title, setTitle] = useState("Default");
  const [reportsTo, setReportsTo] = useState("");
  const [reportees, setReportees] = useState("");
  const [jobSummary, setJobSummary] = useState<{ jdFor: string; keyTask: string }[]>([]);
  const [responsibilities, setResponsibilities] = useState<{ jdFor: string; keyTask: string }[]>(
    [],
  );
  const [technologies, setTechnologies] = useState<{ jdFor: string; keyTask: string }[]>([]);
  const [competencies, setCompetencies] = useState<{ jdFor: string; keyTask: string }[]>([]);

  useEffect(() => {
    if (mode === "edit" && activeItem) {
      setCompany(activeItem.company);
      setLocation(activeItem.location);
      setDepartment(activeItem.department);
      setSection(activeItem.section);
      setDesignation(activeItem.designation);
      setIsDefault(activeItem.isDefault);
      setTitle(activeItem.title);
      setReportsTo(activeItem.reportsTo);
      setReportees(activeItem.reportees);
      setJobSummary(activeItem.jobSummary);
      setResponsibilities(activeItem.responsibilities);
      setTechnologies(activeItem.technologies);
      setCompetencies(activeItem.competencies);
    } else if (mode === "create") {
      setCompany("Pakiza Software Limited");
      setLocation("PSL-Operation");
      setDepartment("HR, Admin and Compliance");
      setSection("Admin");
      setDesignation("Receptionist");
      setIsDefault(true);
      setTitle("Default");
      setReportsTo("");
      setReportees("");
      setJobSummary([]);
      setResponsibilities([]);
      setTechnologies([]);
      setCompetencies([]);
    }
  }, [mode, activeItem]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = mode === "edit";
    const item: JDSItem = {
      sl: isEdit
        ? Number(activeSl)
        : jdsList.length > 0
          ? Math.max(...jdsList.map((j) => j.sl)) + 1
          : 1,
      company,
      location,
      department,
      section,
      designation,
      title,
      reportsTo,
      reportees,
      isDefault,
      jobSummary,
      responsibilities,
      technologies,
      competencies,
      submitStatus: "Pending",
      hrStatus: "Pending",
      hodStatus: "Pending",
      plantHeadStatus: "Pending",
      mdStatus: "Pending",
    };
    const nextList = isEdit
      ? jdsList.map((j) => (j.sl === item.sl ? item : j))
      : [...jdsList, item];
    saveList(nextList);
    toast.success(`JDS ${isEdit ? "updated" : "created"} successfully!`);
    navigate({ to: "/hr-policy-jds", search: { selectedSl: String(item.sl), mode: "details" } });
  };

  const getWorkflowBadge = (status: string, lock?: boolean) => {
    if (lock)
      return "bg-slate-100 text-slate-400 dark:bg-slate-900/60 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/40";
    if (status === "Approved")
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/80";
    if (status === "Rejected")
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-500/80";
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-500/80";
  };

  const getWorkflowCellBadge = (item: JDSItem, role: "HR" | "HOD" | "Plant Head" | "MD") => {
    if (item.submitStatus === "Pending")
      return <span className="text-[10px] font-bold text-slate-400">Locked</span>;
    if (role === "HR")
      return (
        <span
          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold border uppercase tracking-wider ${getWorkflowBadge(item.hrStatus)}`}
        >
          {item.hrStatus}
        </span>
      );
    if (role === "HOD")
      return (
        <span
          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold border uppercase tracking-wider ${getWorkflowBadge(item.hodStatus, item.hrStatus !== "Approved")}`}
        >
          {item.hrStatus !== "Approved" ? "Locked" : item.hodStatus}
        </span>
      );
    if (role === "Plant Head")
      return (
        <span
          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold border uppercase tracking-wider ${getWorkflowBadge(item.plantHeadStatus, item.hrStatus !== "Approved" || item.hodStatus !== "Approved")}`}
        >
          {item.hrStatus !== "Approved" || item.hodStatus !== "Approved"
            ? "Locked"
            : item.plantHeadStatus}
        </span>
      );
    if (role === "MD")
      return (
        <span
          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold border uppercase tracking-wider ${getWorkflowBadge(item.mdStatus, item.hrStatus !== "Approved" || item.hodStatus !== "Approved" || item.plantHeadStatus !== "Approved")}`}
        >
          {item.hrStatus !== "Approved" ||
          item.hodStatus !== "Approved" ||
          item.plantHeadStatus !== "Approved"
            ? "Locked"
            : item.mdStatus}
        </span>
      );
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">HR Policy</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  JD List Approvals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  JD Policy Approvals
                </h1>
              </div>
            </div>
            {mode === "list" && (
              <button
                onClick={() =>
                  navigate({ to: "/hr-policy-jds", search: { selectedSl: "", mode: "create" } })
                }
                className="h-8 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[10px] font-bold rounded shadow-sm transition-all uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="size-3.5" /> Create New JD
              </button>
            )}
          </div>

          {mode === "list" && (
            <>
              {/* KPI Dashboard Summary Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                    <FolderOpen className="size-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Total JDs
                    </p>
                    <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                      {totalCount} Registered
                    </h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                    <Building className="size-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Drafts
                    </p>
                    <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                      {draftCount} Unsubmitted
                    </h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Pending Approval
                    </p>
                    <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                      {pendingApprovalCount} Waiting
                    </h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Fully Approved
                    </p>
                    <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                      {fullyApprovedCount} Active
                    </h3>
                  </div>
                </div>
              </div>

              {/* Smart Filters */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3.5 gap-y-2.5">
                  <div className="space-y-0.5">
                    <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Company
                    </label>
                    <SearchableSelect
                      value={filterCompany}
                      onChange={setFilterCompany}
                      options={[
                        { value: "All", label: "All Companies" },
                        { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
                        { value: "Pakiza Knit Composite Ltd", label: "Pakiza Knit Composite Ltd" },
                      ]}
                      className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Department
                    </label>
                    <SearchableSelect
                      value={filterDept}
                      onChange={setFilterDept}
                      options={[
                        { value: "All Departments", label: "All Departments" },
                        { value: "HR, Admin and Compliance", label: "HR, Admin and Compliance" },
                        {
                          value: "Implementation & Business Analysis",
                          label: "Implementation & Business Analysis",
                        },
                        { value: "Accounts & Finance", label: "Accounts & Finance" },
                      ]}
                      className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Workflow Stage
                    </label>
                    <SearchableSelect
                      value={filterWorkflow}
                      onChange={setFilterWorkflow}
                      options={[
                        { value: "ALL", label: "All JDs" },
                        { value: "DRAFT", label: "Drafts (Awaiting Submission)" },
                        { value: "HR", label: "Awaiting HR Approval" },
                        { value: "HOD", label: "Awaiting HOD Approval" },
                        { value: "PLANT", label: "Awaiting Plant Head Approval" },
                        { value: "MD", label: "Awaiting MD Approval" },
                        { value: "APPROVED", label: "Fully Approved & Issued" },
                      ]}
                      className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">
                      Acting Role (Simulation):
                    </label>
                    <select
                      value={actingRole}
                      onChange={(e) => setActingRole(e.target.value as any)}
                      className="h-7 px-2 text-[10px] font-bold rounded-md bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20 outline-none"
                    >
                      <option value="HR">HR Reviewer</option>
                      <option value="HOD">Department Head (HOD)</option>
                      <option value="Plant Head">Plant Manager (Plant Head)</option>
                      <option value="MD">Managing Director (MD)</option>
                    </select>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder="Quick Search Designations..."
                      className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Data Table */}
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                      <TableIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
                      EXCEL
                    </button>
                    <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                      <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
                    </button>
                  </div>
                </div>

                {/* Bulk Action Bar - Sticky */}
                {selectedIds.size > 0 && (
                  <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20"
                      >
                        {selectedIds.size} Selected
                      </Badge>
                      <span className="text-[11px] font-medium text-slate-500">
                        entries ready for action
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBulkReject}
                        className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <XCircle className="size-3.5" /> Reject as {actingRole}
                      </button>
                      <button
                        onClick={handleBulkApprove}
                        className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" /> Approve as {actingRole}
                      </button>
                    </div>
                  </div>
                )}

                {/* Data Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full min-w-[1200px] border-collapse text-left">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                      <tr className="bg-slate-50 dark:bg-slate-950">
                        <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                            onChange={handleSelectAll}
                            checked={
                              selectedIds.size === filteredJds.length && filteredJds.length > 0
                            }
                          />
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[120px] text-center">
                          Actions
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[200px]">
                          Designation & Department
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          Workflow Status
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          HR
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          HOD
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          Plant Head
                        </th>
                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                          MD
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {filteredJds.map((row) => (
                        <tr
                          key={row.sl}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedIds.has(row.sl) ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                        >
                          <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                              checked={selectedIds.has(row.sl)}
                              onChange={() => handleSelectRow(row.sl)}
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() =>
                                  navigate({
                                    to: "/hr-policy-jds",
                                    search: { selectedSl: String(row.sl), mode: "details" },
                                  })
                                }
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-600 transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="size-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate({
                                    to: "/hr-policy-jds",
                                    search: { selectedSl: String(row.sl), mode: "edit" },
                                  })
                                }
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-600 transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const updated = jdsList.map((j) =>
                                    j.sl === row.sl
                                      ? { ...j, submitStatus: "Submitted" as const }
                                      : j,
                                  );
                                  saveList(updated);
                                  toast.success("Submitted to workflow!");
                                }}
                                disabled={row.submitStatus !== "Pending"}
                                className={`p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer ${row.submitStatus !== "Pending" ? "opacity-30 cursor-not-allowed text-slate-400" : "text-[#2563eb]"}`}
                                title="Submit"
                              >
                                <Send className="size-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-slate-800 dark:text-slate-100 font-bold">
                            <div className="flex items-center gap-1.5">
                              {row.designation}
                              {row.isDefault && (
                                <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 px-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {row.department} — {row.section}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${
                                row.submitStatus === "Submitted"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {row.submitStatus === "Submitted" ? "Active" : "Draft"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getWorkflowCellBadge(row, "HR")}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getWorkflowCellBadge(row, "HOD")}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getWorkflowCellBadge(row, "Plant Head")}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getWorkflowCellBadge(row, "MD")}
                          </td>
                        </tr>
                      ))}
                      {filteredJds.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold"
                          >
                            No JD records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DUMMY PLACEHOLDER FOR CREATE/EDIT/DETAILS to keep it functional but avoid 1500 lines of forms */}
          {mode !== "list" && (
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col p-6 items-center justify-center text-center">
              <FolderOpen className="size-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                Form View Minimised for Design Rewrite
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                The Create, Edit, and Details forms have been minimised for this architectural
                rewrite of the list layout. They will be re-implemented natively when specifically
                requested.
              </p>
              <button
                onClick={() =>
                  navigate({ to: "/hr-policy-jds", search: { selectedSl: "", mode: "list" } })
                }
                className="h-9 px-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded shadow-sm transition-all uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-4" /> Back to JD List
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
