import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { e as employeesData, S as Sidebar, T as Topbar, a as SearchableSelect } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, D as UserPlus, u as SlidersHorizontal, Y as ChevronDown, ae as Sparkles, X, I as Info, az as FilePenLine, K as RefreshCw, V as ShieldCheck, O as CreditCard, an as UserCog, aA as UserCheck, a as Clock, h as CalendarRange, aB as CalendarHeart, aC as Power, aD as FileClock, aE as DollarSign, ay as FileDown, P as Printer, d as FileText, S as Search, aF as LayoutGrid, a5 as Check, E as Eye, aG as EyeOff } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
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
  acStatus: true
};
function PersonnelListPage() {
  const [employees, setEmployees] = reactExports.useState([]);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const synced = localStorage.getItem("recruitment_synced_employees");
      if (synced) {
        try {
          const parsed = JSON.parse(synced);
          if (parsed && parsed.length > 0) {
            const merged = [...parsed];
            employeesData.forEach((d) => {
              if (!merged.some((m) => m.id === d.id)) {
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
  const [resignModalEmp, setResignModalEmp] = reactExports.useState(null);
  const [resignStatus, setResignStatus] = reactExports.useState("Resigned");
  const [resignDate, setResignDate] = reactExports.useState("");
  const [resignRemarks, setResignRemarks] = reactExports.useState("");
  const [rejoinModalEmp, setRejoinModalEmp] = reactExports.useState(null);
  const [newEmpId, setNewEmpId] = reactExports.useState("");
  const [newJoinDate, setNewJoinDate] = reactExports.useState("");
  const [newDesignation, setNewDesignation] = reactExports.useState("");
  const [newDept, setNewDept] = reactExports.useState("");
  const [newSect, setNewSect] = reactExports.useState("");
  const [newEmpType, setNewEmpType] = reactExports.useState("");
  const [newGrade, setNewGrade] = reactExports.useState("");
  const [newShift, setNewShift] = reactExports.useState("");
  const [newBasic, setNewBasic] = reactExports.useState("");
  const [newGross, setNewGross] = reactExports.useState("");
  const [rejoinRemarks, setRejoinRemarks] = reactExports.useState("");
  const handleResignSubmit = () => {
    if (!resignModalEmp) return;
    const updated = employees.map((emp) => {
      if (emp.id === resignModalEmp.id) {
        return {
          ...emp,
          status: resignStatus,
          acStatus: "Inactive",
          resignDate: resignDate || (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB"),
          resignRemarks
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
    if (employees.some((emp) => emp.id === newEmpId)) {
      alert("Employee ID already exists!");
      return;
    }
    const newEmp = {
      ...rejoinModalEmp,
      id: newEmpId,
      joinDate: newJoinDate || (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB"),
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
      rejoinRemarks,
      confirmDate: "",
      holiday: "—",
      rejoinedTo: void 0
      // clear rejoin pointer for the active record
    };
    const updated = employees.map((emp) => {
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
  const [selectedEmpIds, setSelectedEmpIds] = reactExports.useState([]);
  const [activeDocGenerating, setActiveDocGenerating] = reactExports.useState(null);
  const [bulkActionMessage, setBulkActionMessage] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [empIdFilter, setEmpIdFilter] = reactExports.useState("");
  const [systemOffice, setSystemOffice] = reactExports.useState("system");
  const [deptFilter, setDeptFilter] = reactExports.useState("ALL");
  const [sectFilter, setSectFilter] = reactExports.useState("ALL");
  const [empTypeFilter, setEmpTypeFilter] = reactExports.useState("ALL");
  const [statusFilter, setStatusFilter] = reactExports.useState("Working");
  const [empStatusFilter, setEmpStatusFilter] = reactExports.useState("ALL");
  const [designationFilter, setDesignationFilter] = reactExports.useState("ALL");
  const [isFilterCollapsed, setIsFilterCollapsed] = reactExports.useState(false);
  const [visibleCols, setVisibleCols] = reactExports.useState(defaultColumns);
  const [isColSelectorOpen, setIsColSelectorOpen] = reactExports.useState(false);
  const departmentsList = reactExports.useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map((e) => e.dept)))], []);
  const sectionsList = reactExports.useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map((e) => e.sect)))], []);
  const designationsList = reactExports.useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map((e) => e.title)))], []);
  const empTypesList = reactExports.useMemo(() => ["ALL", ...Array.from(new Set(employeesData.map((e) => e.type)))], []);
  const filteredEmployees = reactExports.useMemo(() => {
    return employees.filter((e) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesQuery = e.name.toLowerCase().includes(q) || e.id.includes(q) || e.email.toLowerCase().includes(q) || e.title.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (empIdFilter.trim() !== "") {
        const ids = empIdFilter.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
        if (ids.length > 0 && !ids.includes(e.id)) return false;
      }
      if (deptFilter !== "ALL" && e.dept !== deptFilter) return false;
      if (sectFilter !== "ALL" && e.sect !== sectFilter) return false;
      if (empTypeFilter !== "ALL" && e.type !== empTypeFilter) return false;
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
      setSelectedEmpIds(filteredEmployees.map((e) => e.id));
    }
  };
  const toggleSelectEmp = (id) => {
    setSelectedEmpIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };
  const triggerDocGeneration = (docName) => {
    setActiveDocGenerating(docName);
    setTimeout(() => {
      setActiveDocGenerating(null);
      const targetNames = selectedEmpIds.map((id) => {
        const emp = employees.find((e) => e.id === id);
        return emp ? emp.name : id;
      }).join(", ");
      setBulkActionMessage(`Generated ${docName} successfully for: ${targetNames.length > 55 ? targetNames.substring(0, 52) + "..." : targetNames}`);
      setTimeout(() => setBulkActionMessage(null), 4500);
    }, 1200);
  };
  const triggerBulkAction = (actionName) => {
    const targetNames = selectedEmpIds.map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? emp.name : id;
    }).join(", ");
    setBulkActionMessage(`Bulk action [${actionName}] applied successfully to: ${targetNames.length > 55 ? targetNames.substring(0, 52) + "..." : targetNames}`);
    setTimeout(() => setBulkActionMessage(null), 4500);
  };
  const toggleColumn = (key) => {
    setVisibleCols((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  reactExports.useEffect(() => {
    if (!isColSelectorOpen) return;
    const handleOutsideClick = (e) => {
      const target = e.target;
      if (!target.closest(".col-selector-container")) {
        setIsColSelectorOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isColSelectorOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "Human Resource" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Personnel List" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-extrabold tracking-tight text-foreground", children: "Personnel List" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/70 rounded-lg px-3.5 py-2 shadow-2xs hover:shadow-xs transition duration-200 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85", children: "Total Employees:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold text-foreground", children: employees.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border border-[oklch(0.62_0.16_155/0.2)] rounded-lg px-3.5 py-2 shadow-2xs flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-success/95", children: "Working:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold text-success", children: employees.filter((e) => e.status === "Working").length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.open("/add-employee", "_blank"), className: "h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }),
              " Add Employee"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsFilterCollapsed(!isFilterCollapsed), className: "flex items-center gap-2.5 text-xs font-semibold text-foreground/90 hover:text-primary transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "size-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Advanced Search Filters" }),
              (() => {
                const activeCount = [empIdFilter !== "", deptFilter !== "ALL", sectFilter !== "ALL", empTypeFilter !== "ALL", statusFilter !== "Working", empStatusFilter !== "ALL", designationFilter !== "ALL"].filter(Boolean).length;
                return activeCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary text-primary-foreground", children: [
                  activeCount,
                  " active"
                ] }) : null;
              })(),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-3.5 text-muted-foreground/60 transition-transform duration-300 ${isFilterCollapsed ? "-rotate-90" : ""}` })
            ] }),
            !isFilterCollapsed && (empIdFilter || deptFilter !== "ALL" || sectFilter !== "ALL" || empTypeFilter !== "ALL" || statusFilter !== "Working" || empStatusFilter !== "ALL" || designationFilter !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetFilters, className: "text-[10px] font-medium text-rose-500 hover:text-rose-600 hover:underline", children: "Clear All Filters" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `transition-all duration-300 overflow-hidden ${isFilterCollapsed ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100 p-5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-primary/80 lowercase tracking-normal font-semibold", children: "use comma as separator" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdFilter, onChange: (e) => setEmpIdFilter(e.target.value), placeholder: "e.g. 2025057068, 2023046001", className: "w-full h-9.5 px-3 rounded-xl bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition-all duration-200" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "ID Type Scope" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex p-1 rounded-xl bg-muted border border-border/40 h-9.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSystemOffice("system"), className: `flex-1 text-[10px] font-bold rounded-lg transition-all ${systemOffice === "system" ? "bg-card text-primary shadow-2xs font-extrabold" : "text-muted-foreground hover:text-foreground"}`, children: "System ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSystemOffice("office"), className: `flex-1 text-[10px] font-bold rounded-lg transition-all ${systemOffice === "office" ? "bg-card text-primary shadow-2xs font-extrabold" : "text-muted-foreground hover:text-foreground"}`, children: "Office ID" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: empTypeFilter, onChange: setEmpTypeFilter, options: empTypesList.map((type) => ({
                value: type,
                label: type === "ALL" ? "All Types" : type
              })), placeholder: "Select type..." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: deptFilter, onChange: setDeptFilter, options: departmentsList.map((dept) => ({
                value: dept,
                label: dept === "ALL" ? "All Departments" : dept
              })), placeholder: "Select department..." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: sectFilter, onChange: setSectFilter, options: sectionsList.map((sect) => ({
                value: sect,
                label: sect === "ALL" ? "All Sections" : sect
              })), placeholder: "Select section..." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: designationFilter, onChange: setDesignationFilter, options: designationsList.map((des) => ({
                value: des,
                label: des === "ALL" ? "All Designations" : des
              })), placeholder: "Select designation..." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Working Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: statusFilter, onChange: setStatusFilter, options: [{
                value: "ALL",
                label: "All Status"
              }, {
                value: "Working",
                label: "Working"
              }, {
                value: "On Leave",
                label: "On Leave"
              }, {
                value: "Resigned",
                label: "Resigned"
              }, {
                value: "Terminated",
                label: "Terminated"
              }], placeholder: "Select status..." }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Employment Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchableSelect, { value: empStatusFilter, onChange: setEmpStatusFilter, options: [{
                value: "ALL",
                label: "All Statuses"
              }, {
                value: "Probation",
                label: "Probation"
              }, {
                value: "Permanent",
                label: "Permanent"
              }], placeholder: "Select status..." }) })
            ] })
          ] }) })
        ] }),
        bulkActionMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-6 right-6 z-[60] max-w-md bg-[#0f172a] dark:bg-card border border-primary/45 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse", children: "HRIS Operations Hub" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white dark:text-foreground font-bold mt-0.5 leading-snug", children: bulkActionMessage })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBulkActionMessage(null), className: "text-slate-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 via-primary to-indigo-500" }),
          selectedEmpIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-card via-muted/5 to-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Personnel Operations & Document Center" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 mt-0.5 font-normal", children: "Generate statutory letters, print certificates, and manage employee profiles in bulk." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-normal shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 text-indigo-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Select employees in the table below to activate bulk tools & printing" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 pb-3 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary", children: [
                  selectedEmpIds.length,
                  " Selected"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-extrabold text-foreground tracking-tight", children: "Active Operations & Print Console" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedEmpIds([]), className: "text-[10px] font-extrabold text-muted-foreground hover:text-primary transition", children: "Clear Selection" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-8 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Document Generation & Printing Hub" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-3.5 text-indigo-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Letters & Agreements" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ["Offer Letter", "Joining Letter", "Appointment Letter", "Resignation Letter", "Confirmation Letter", "Experience Certificate", "NOC Letter", "Salary Certificate"].map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: activeDocGenerating !== null, onClick: () => triggerDocGeneration(doc), className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50", children: [
                      activeDocGenerating === doc ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-3.5 text-indigo-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: doc })
                    ] }, doc)) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5 text-emerald-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statutory & Forms" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ["Nominee Form", "Age Verification", "Application Form", "Service Book", "Emp Check List", "Performance Appraisal", "BI Verification", "Police Verification"].map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: activeDocGenerating !== null, onClick: () => triggerDocGeneration(doc), className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50", children: [
                      activeDocGenerating === doc ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5 text-emerald-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: doc })
                    ] }, doc)) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 bg-muted/15 border border-border/20 rounded-xl p-3.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-extrabold text-foreground/90 uppercase tracking-wider pb-1.5 border-b border-border/30 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-3.5 text-amber-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Identity & Clearance" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ["ID Card", "Employee Info", "Sticker Format", "Clearance Doc", "Personal Resume", "Report Set", "Zero Abuse EXE", "Service CoC"].map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: activeDocGenerating !== null, onClick: () => triggerDocGeneration(doc), className: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 text-left text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-150 disabled:opacity-50", children: [
                      activeDocGenerating === doc ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-3.5 text-amber-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: doc })
                    ] }, doc)) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-4 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Personnel Operations Center" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/15 border border-border/20 rounded-xl p-3.5 h-[calc(100%-1.75rem)] flex flex-col justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
                    name: "Make Permanent",
                    icon: UserCheck,
                    color: "hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  }, {
                    name: "Status Update",
                    icon: UserCog,
                    color: "hover:bg-indigo-500/10 hover:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                  }, {
                    name: "OT Status Update",
                    icon: Clock,
                    color: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-600 dark:text-amber-400"
                  }, {
                    name: "Shift Rotation",
                    icon: CalendarRange,
                    color: "hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-600 dark:text-rose-400"
                  }, {
                    name: "Set Holiday",
                    icon: CalendarHeart,
                    color: "hover:bg-cyan-500/10 hover:border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                  }, {
                    name: "Set A/C IsActive",
                    icon: Power,
                    color: "hover:bg-purple-500/10 hover:border-purple-500/30 text-purple-600 dark:text-purple-400"
                  }, {
                    name: "ID Card IssueDate",
                    icon: FileClock,
                    color: "hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400"
                  }, {
                    name: "Revenue Mapping",
                    icon: DollarSign,
                    color: "hover:bg-teal-500/10 hover:border-teal-500/30 text-teal-600 dark:text-teal-400"
                  }].map((op) => {
                    const IconComponent = op.icon;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerBulkAction(op.name), className: `flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card text-center gap-1.5 transition-all hover:scale-102 hover:shadow-2xs ${op.color}`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "size-4.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-tight whitespace-nowrap leading-none", children: op.name })
                    ] }, op.name);
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/10 rounded-xl p-3 text-[10px] text-muted-foreground/80 leading-relaxed", children: [
                    "💡 ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-foreground", children: "Bulk operations" }),
                    " applied here will simultaneously update the corporate records for all ",
                    selectedEmpIds.length,
                    " checked personnel."
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Excel" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Print" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto w-full md:w-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 md:w-64 lg:w-72", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search name, ID, designaton...", className: "w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative col-selector-container", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsColSelectorOpen(!isColSelectorOpen), className: "h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-bold text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition duration-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Columns" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-muted-foreground/60" })
                ] }),
                isColSelectorOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-1.5 w-56 rounded-xl bg-card border border-border/80 shadow-lg p-3 z-30 animate-in fade-in slide-in-from-top-1 duration-150", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-2 mb-2 border-b border-border/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Show Columns" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVisibleCols(defaultColumns), className: "text-[9px] font-bold text-primary hover:underline", children: "Reset" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-56 overflow-y-auto pr-1", children: Object.keys(defaultColumns).map((colKey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleColumn(colKey), className: "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-muted transition duration-150", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-4 rounded-md border flex items-center justify-center transition-all ${visibleCols[colKey] ? "bg-primary border-primary text-primary-foreground" : "border-border"}`, children: visibleCols[colKey] && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-2.5 stroke-[3.5]" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/80 capitalize", children: colKey.replace(/([A-Z])/g, " $1").toLowerCase() })
                  ] }, colKey)) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] px-2 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[130px] min-w-[130px] max-w-[130px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filteredEmployees.length > 0 && selectedEmpIds.length === filteredEmployees.length, onChange: toggleSelectAll, className: "rounded border-border text-primary focus:ring-primary/20 cursor-pointer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "∇" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[130px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/30 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px]", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-[230px] bg-[#f1f5f9] dark:bg-[#0f172a] px-3 py-4 font-bold border-r border-border/40 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px]", children: "Name" }),
              visibleCols.empIdOffc && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Emp ID(Offc)" }),
              visibleCols.employeeType && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Employee Type" }),
              visibleCols.dept && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Department" }),
              visibleCols.section && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Section" }),
              visibleCols.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Job Title" }),
              visibleCols.unit && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Unit" }),
              visibleCols.line && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Line" }),
              visibleCols.grade && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Grade" }),
              visibleCols.shift && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Shift" }),
              visibleCols.shiftStart && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Shift Start" }),
              visibleCols.joinDate && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Joining Date" }),
              visibleCols.blood && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold text-center bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Blood Group" }),
              visibleCols.basic && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold text-right bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Basic" }),
              visibleCols.gross && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold text-right bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Gross" }),
              visibleCols.email && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Email" }),
              visibleCols.officeMob && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Office Mobile" }),
              visibleCols.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Gender" }),
              visibleCols.dob && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Date of Birth" }),
              visibleCols.empStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Employment Status" }),
              visibleCols.village && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold bg-[#f1f5f9] dark:bg-[#0f172a]", children: "Per.Village" }),
              visibleCols.acStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-4 font-bold text-center bg-[#f1f5f9] dark:bg-[#0f172a]", children: "A/C Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/45", children: [
              filteredEmployees.map((e, index) => {
                const stickyCellBgClass = "bg-card group-hover:bg-[#f8fafc] dark:group-hover:bg-[#1e293b]";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => navigate({
                  to: "/employee-detail/$id",
                  params: {
                    id: e.id
                  }
                }), className: `group transition-all cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-0 ${stickyCellBgClass} px-2 py-2 border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[130px] min-w-[130px] max-w-[130px] transition-all`, onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedEmpIds.includes(e.id), onChange: () => toggleSelectEmp(e.id), className: "rounded border-border text-primary focus:ring-primary/20 cursor-pointer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition flex items-center justify-center shadow-3xs", onClick: () => navigate({
                      to: "/employee-detail/$id",
                      params: {
                        id: e.id
                      }
                    }), title: "Quick Sheet", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition flex items-center justify-center shadow-3xs", onClick: () => navigate({
                      to: "/employee-detail/$id",
                      params: {
                        id: e.id
                      }
                    }), title: "View File", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }) }),
                    !e.status || e.status === "Working" || e.status === "On Leave" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition flex items-center justify-center shadow-3xs", onClick: () => {
                      setResignModalEmp(e);
                      setResignStatus("Resigned");
                      setResignRemarks("");
                      setResignDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
                    }, title: "Resign / Terminate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "size-3" }) }) : !e.rejoinedTo ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center shadow-3xs", onClick: () => {
                      setRejoinModalEmp(e);
                      setNewEmpId(e.id + "R");
                      setNewJoinDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
                      setNewDesignation(e.title || "");
                      setNewDept(e.dept || "");
                      setNewSect(e.sect || "");
                      setNewEmpType(e.type || "Permanent");
                      setNewGrade(e.grade || "None");
                      setNewShift(e.shift || "General Shift");
                      setNewBasic(e.basic || "0.00");
                      setNewGross(e.gross || "0.00");
                      setRejoinRemarks("");
                    }, title: "Rejoin Employee", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-3" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-6 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 cursor-not-allowed flex items-center justify-center shadow-3xs", title: `Rejoined as ID: ${e.rejoinedTo}`, disabled: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3" }) })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[130px] ${stickyCellBgClass} px-3 py-3.5 font-medium text-primary border-r border-border/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] w-[100px] min-w-[100px] max-w-[100px] transition-all`, children: e.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `sticky left-[230px] ${stickyCellBgClass} px-3 py-3.5 font-medium text-foreground border-r border-border/40 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-[180px] min-w-[180px] max-w-[180px] transition-all`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6.5 rounded-lg bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center shadow-2xs animate-pulse", children: e.name.split(" ").map((s) => s[0]).slice(0, 2).join("") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px] font-medium text-foreground", children: e.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5 flex-wrap", children: [
                        e.status && e.status !== "Working" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8px] px-1.5 py-0.5 rounded leading-none ${e.status === "Resigned" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : e.status === "Terminated" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"}`, children: e.status }),
                        e.rejoinedTo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] px-1.5 py-0.5 rounded leading-none bg-purple-500/10 text-purple-500 border border-purple-500/20", title: `Rejoined as ID: ${e.rejoinedTo}`, children: "Rejoined" }),
                        e.rejoinRef && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] px-1.5 py-0.5 rounded leading-none bg-indigo-500/10 text-indigo-500 border border-indigo-500/20", title: `Rejoined from ID: ${e.rejoinRef}`, children: "Rejoined Emp" })
                      ] })
                    ] })
                  ] }) }),
                  visibleCols.empIdOffc && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.offcId }),
                  visibleCols.employeeType && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground/85 font-medium", children: e.type }),
                  visibleCols.dept && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground/80 font-medium", children: e.dept }),
                  visibleCols.section && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: e.sect }),
                  visibleCols.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-semibold text-foreground", children: e.title }),
                  visibleCols.unit && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.unit }),
                  visibleCols.line && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.line }),
                  visibleCols.grade && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.grade }),
                  visibleCols.shift && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: e.shift }),
                  visibleCols.shiftStart && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.shiftStart }),
                  visibleCols.joinDate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium", children: e.joinDate }),
                  visibleCols.blood && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30", children: e.blood }) }),
                  visibleCols.basic && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-mono font-semibold text-foreground/90", children: [
                    "৳",
                    parseFloat(e.basic).toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })
                  ] }),
                  visibleCols.gross && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-right font-mono font-bold text-primary", children: [
                    "৳",
                    parseFloat(e.gross).toLocaleString("en-IN", {
                      minimumFractionDigits: 2
                    })
                  ] }),
                  visibleCols.email && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: e.email }),
                  visibleCols.officeMob && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium font-mono", children: e.officeMob }),
                  visibleCols.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: e.gender }),
                  visibleCols.dob && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/90 font-medium", children: e.dob }),
                  visibleCols.empStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${e.empStatus === "Permanent" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${e.empStatus === "Permanent" ? "bg-success" : "bg-warning animate-pulse"}` }),
                    e.empStatus
                  ] }) }),
                  visibleCols.village && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground/80 font-medium truncate max-w-[150px]", title: e.village, children: e.village }),
                  visibleCols.acStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1 rounded-full bg-emerald-500 animate-ping" }),
                    e.acStatus
                  ] }) })
                ] }, e.id);
              }),
              filteredEmployees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 30, className: "px-5 py-12 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-8 text-muted-foreground/45" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-xs", children: "No employees match the specified search parameters." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetFilters, className: "text-[10px] font-bold text-primary hover:underline mt-1", children: "Clear Filters" })
              ] }) }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-border/40 bg-muted/15", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-muted-foreground/80", children: [
              "Showing ",
              filteredEmployees.length > 0 ? 1 : 0,
              " to ",
              filteredEmployees.length,
              " of ",
              employees.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition", disabled: true, children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition", disabled: true, children: "Next" })
            ] })
          ] })
        ] })
      ] }),
      resignModalEmp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md border border-border rounded-lg shadow-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Resign / Terminate Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResignModalEmp(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "You are updating the status of ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: resignModalEmp.name }),
          " (ID: ",
          resignModalEmp.id,
          ")."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Action Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: resignStatus, onChange: (e) => setResignStatus(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resigned", children: "Resigned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Terminated", children: "Terminated" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Effective Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: resignDate, onChange: (e) => setResignDate(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Remarks / Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: resignRemarks, onChange: (e) => setResignRemarks(e.target.value), placeholder: "Enter reason or notes...", rows: 3, className: "w-full p-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 resize-none" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResignModalEmp(null), className: "h-8.5 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleResignSubmit, className: "h-8.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition duration-200", children: "Confirm Action" })
        ] })
      ] }) }),
      rejoinModalEmp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-lg border border-border rounded-lg shadow-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Rejoin / Re-employ Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRejoinModalEmp(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10", children: [
          "Rejoining will create a ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "new employment profile" }),
          " with a new Employee ID for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: rejoinModalEmp.name }),
          ". The old files, documents, and history will be connected automatically."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "New Employee ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newEmpId, onChange: (e) => setNewEmpId(e.target.value), placeholder: "e.g. 202610291", className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "New Joining Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: newJoinDate, onChange: (e) => setNewJoinDate(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Designation / Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newDesignation, onChange: (e) => setNewDesignation(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newDept, onChange: (e) => setNewDept(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newSect, onChange: (e) => setNewSect(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Employee Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newEmpType, onChange: (e) => setNewEmpType(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Permanent", children: "Permanent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Probation", children: "Probation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Contractual", children: "Contractual" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Grade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newGrade, onChange: (e) => setNewGrade(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Shift" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newShift, onChange: (e) => setNewShift(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Basic Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newBasic, onChange: (e) => setNewBasic(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 font-mono" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Gross Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newGross, onChange: (e) => setNewGross(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 font-mono" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Rejoin Notes / Remarks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: rejoinRemarks, onChange: (e) => setRejoinRemarks(e.target.value), placeholder: "Enter any additional notes...", rows: 2, className: "w-full p-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200 resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRejoinModalEmp(null), className: "h-8.5 px-4 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRejoinSubmit, className: "h-8.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition duration-200", children: "Confirm Rejoin" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  PersonnelListPage as component
};
