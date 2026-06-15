import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { C as ChevronRight, ae as Sparkles, S as Search, ax as FileSpreadsheet, P as Printer, ay as FileDown, a5 as Check } from "../_libs/lucide-react.mjs";
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
const mockRecords = [{
  sl: 1,
  empId: "2022035599",
  name: "Dipon Saha",
  designation: "Manager",
  department: "Business Automation (HR)",
  section: "Core Development (HR)",
  joiningDate: "07/05/2022",
  currentSalary: 67e3,
  tenureY: 3,
  tenureM: 7,
  tenureD: 25,
  basicSalary: 40200,
  houseRent: 20100,
  lastIncDate: "01/01/2025",
  lastIncAmount: 6e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Manager"
}, {
  sl: 2,
  empId: "2023044017",
  name: "Md. Rejaul Karim",
  designation: "Deputy Manager",
  department: "Business Automation (HR)",
  section: "Implementation & Support (HR)",
  joiningDate: "13/08/2023",
  currentSalary: 63e3,
  tenureY: 2,
  tenureM: 4,
  tenureD: 19,
  basicSalary: 37800,
  houseRent: 18900,
  lastIncDate: "01/01/2025",
  lastIncAmount: 5e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Deputy Manager"
}, {
  sl: 3,
  empId: "2021028542",
  name: "Zakir Hossain",
  designation: "Officer",
  department: "Business Automation (HR)",
  section: "Implementation & Support (HR)",
  joiningDate: "09/10/2021",
  currentSalary: 31500,
  tenureY: 4,
  tenureM: 2,
  tenureD: 23,
  basicSalary: 18900,
  houseRent: 9450,
  lastIncDate: "01/01/2025",
  lastIncAmount: 2500,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Officer"
}, {
  sl: 4,
  empId: "2024052333",
  name: "Mohammad Rahatul Islam",
  designation: "Sr. Officer",
  department: "Business Automation (HR)",
  section: "Core Development (HR)",
  joiningDate: "01/10/2024",
  currentSalary: 48e3,
  tenureY: 1,
  tenureM: 3,
  tenureD: 0,
  basicSalary: 28800,
  houseRent: 14400,
  lastIncDate: "01/01/2025",
  lastIncAmount: 5e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 5,
  empId: "2024052410",
  name: "Dipan Kumar Kundu",
  designation: "Sr. Officer",
  department: "Business Automation (HR)",
  section: "Core Development (HR)",
  joiningDate: "15/10/2024",
  currentSalary: 41e3,
  tenureY: 1,
  tenureM: 2,
  tenureD: 17,
  basicSalary: 24600,
  houseRent: 12300,
  lastIncDate: "01/02/2025",
  lastIncAmount: 3e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 6,
  empId: "2025053380",
  name: "Miraz Uddin",
  designation: "Jr. Executive",
  department: "Business Development",
  section: "Core Sales",
  joiningDate: "06/01/2025",
  currentSalary: 24e3,
  tenureY: 0,
  tenureM: 11,
  tenureD: 26,
  basicSalary: 14400,
  houseRent: 7200,
  lastIncDate: "01/05/2025",
  lastIncAmount: 1e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Jr. Executive"
}, {
  sl: 7,
  empId: "2021032646",
  name: "Sadiqul Islam",
  designation: "Deputy Manager",
  department: "Business Development",
  section: "Core Sales",
  joiningDate: "22/12/2021",
  currentSalary: 59e3,
  tenureY: 4,
  tenureM: 0,
  tenureD: 10,
  basicSalary: 35400,
  houseRent: 17700,
  lastIncDate: "01/01/2025",
  lastIncAmount: 3e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Deputy Manager"
}, {
  sl: 8,
  empId: "2023043909",
  name: "Md. Ashanur Kabir",
  designation: "Manager",
  department: "Business Development",
  section: "Digital Marketing",
  joiningDate: "01/08/2023",
  currentSalary: 73e3,
  tenureY: 2,
  tenureM: 5,
  tenureD: 0,
  basicSalary: 43800,
  houseRent: 21900,
  lastIncDate: "01/07/2025",
  lastIncAmount: 7e3,
  lastPromDate: "01/07/2025",
  lastPromDesignation: "Manager"
}, {
  sl: 9,
  empId: "2023044012",
  name: "Tanver Rahman Shaon",
  designation: "Assistant Manager",
  department: "Business Development",
  section: "Core Sales",
  joiningDate: "01/01/2025",
  currentSalary: 46e3,
  tenureY: 1,
  tenureM: 0,
  tenureD: 0,
  basicSalary: 27600,
  houseRent: 13800,
  lastIncDate: "01/04/2025",
  lastIncAmount: 3e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Assistant Manager"
}, {
  sl: 10,
  empId: "2023043910",
  name: "Tahmid Afsar",
  designation: "Assistant Manager",
  department: "Business Innovation",
  section: "Project Resource & Strategy",
  joiningDate: "01/08/2023",
  currentSalary: 52e3,
  tenureY: 2,
  tenureM: 5,
  tenureD: 0,
  basicSalary: 31200,
  houseRent: 15600,
  lastIncDate: "01/07/2025",
  lastIncAmount: 12e3,
  lastPromDate: "01/07/2025",
  lastPromDesignation: "Assistant Manager"
}, {
  sl: 11,
  empId: "2023044078",
  name: "Md. Anik Islam",
  designation: "Deputy Manager",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "16/08/2023",
  currentSalary: 79e3,
  tenureY: 2,
  tenureM: 4,
  tenureD: 16,
  basicSalary: 47400,
  houseRent: 23700,
  lastIncDate: "01/01/2025",
  lastIncAmount: 7e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Deputy Manager"
}, {
  sl: 12,
  empId: "2025054710",
  name: "Raihan Jami Khan",
  designation: "Jr. Executive",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "16/04/2025",
  currentSalary: 25e3,
  tenureY: 0,
  tenureM: 8,
  tenureD: 16,
  basicSalary: 15e3,
  houseRent: 7500,
  lastIncDate: "01/07/2025",
  lastIncAmount: 4e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Jr. Executive"
}, {
  sl: 13,
  empId: "2024051510",
  name: "Md. Sadmanur Islam Shishir",
  designation: "Jr. Executive",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "01/09/2024",
  currentSalary: 27e3,
  tenureY: 1,
  tenureM: 4,
  tenureD: 0,
  basicSalary: 16200,
  houseRent: 8100,
  lastIncDate: "01/01/2025",
  lastIncAmount: 5e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Jr. Executive"
}, {
  sl: 14,
  empId: "2025054707",
  name: "Allama Bakhtiyar Nafis",
  designation: "Jr. Executive",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "16/04/2025",
  currentSalary: 25e3,
  tenureY: 0,
  tenureM: 8,
  tenureD: 16,
  basicSalary: 15e3,
  houseRent: 7500,
  lastIncDate: "01/07/2025",
  lastIncAmount: 4e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Jr. Executive"
}, {
  sl: 15,
  empId: "2025054609",
  name: "Md Mahir Shahriyar",
  designation: "Jr. Executive",
  department: "Business Innovation",
  section: "Project Resource & Strategy",
  joiningDate: "15/03/2025",
  currentSalary: 33e3,
  tenureY: 0,
  tenureM: 9,
  tenureD: 17,
  basicSalary: 19800,
  houseRent: 9900,
  lastIncDate: "01/06/2025",
  lastIncAmount: 3e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Jr. Executive"
}, {
  sl: 16,
  empId: "2024049166",
  name: "MD Maimoon Hossain Shomoy",
  designation: "Sr. Officer",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "18/05/2024",
  currentSalary: 43e3,
  tenureY: 1,
  tenureM: 7,
  tenureD: 14,
  basicSalary: 25800,
  houseRent: 12900,
  lastIncDate: "01/01/2025",
  lastIncAmount: 5e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 17,
  empId: "2025053125",
  name: "Al Riyad Karim",
  designation: "Sr. Officer",
  department: "Business Innovation",
  section: "WEB-Team",
  joiningDate: "12/01/2025",
  currentSalary: 46e3,
  tenureY: 0,
  tenureM: 11,
  tenureD: 20,
  basicSalary: 27600,
  houseRent: 13800,
  lastIncDate: "01/05/2025",
  lastIncAmount: 3e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 18,
  empId: "2024049326",
  name: "Hanif Uddin",
  designation: "Sr. Officer",
  department: "Business Innovation",
  section: "APPS Team",
  joiningDate: "01/06/2024",
  currentSalary: 5e4,
  tenureY: 1,
  tenureM: 7,
  tenureD: 0,
  basicSalary: 3e4,
  houseRent: 15e3,
  lastIncDate: "01/01/2025",
  lastIncAmount: 5e3,
  lastPromDate: "01/01/2026",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 19,
  empId: "2024052335",
  name: "Md. Al Amin",
  designation: "Sr. Officer",
  department: "Core Development",
  section: "RMG-Production-IE & Planning",
  joiningDate: "01/10/2024",
  currentSalary: 43e3,
  tenureY: 1,
  tenureM: 3,
  tenureD: 0,
  basicSalary: 25800,
  houseRent: 12900,
  lastIncDate: "01/07/2025",
  lastIncAmount: 8e3,
  lastPromDate: "01/07/2025",
  lastPromDesignation: "Sr. Officer"
}, {
  sl: 20,
  empId: "2024051507",
  name: "S.M Rakib Rahman Tuhin",
  designation: "Assistant Manager",
  department: "Core Development",
  section: "RMG-Production-IE & Planning",
  joiningDate: "01/09/2024",
  currentSalary: 57e3,
  tenureY: 1,
  tenureM: 4,
  tenureD: 0,
  basicSalary: 34200,
  houseRent: 17100,
  lastIncDate: "01/07/2025",
  lastIncAmount: 12e3,
  lastPromDate: "01/07/2025",
  lastPromDesignation: "Assistant Manager"
}];
function EvaluationProposePage() {
  const router = useRouter();
  const [year, setYear] = reactExports.useState("2026");
  const [month, setMonth] = reactExports.useState("Jan");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [department, setDepartment] = reactExports.useState("All Departments");
  const [section, setSection] = reactExports.useState("ALL");
  const [empIdInput, setEmpIdInput] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [appliedFilters, setAppliedFilters] = reactExports.useState({
    year: "2026",
    month: "Jan",
    empType: "ALL",
    department: "All Departments",
    section: "ALL",
    empIdInput: ""
  });
  const [selectedIds, setSelectedIds] = reactExports.useState([]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      month,
      empType,
      department,
      section,
      empIdInput
    });
  };
  const filteredRecords = reactExports.useMemo(() => {
    return mockRecords.filter((row) => {
      if (appliedFilters.department !== "All Departments" && row.department !== appliedFilters.department) {
        return false;
      }
      if (appliedFilters.section !== "ALL" && row.section !== appliedFilters.section) {
        return false;
      }
      if (appliedFilters.empIdInput.trim()) {
        const queryIds = appliedFilters.empIdInput.split(",").map((id) => id.trim().toLowerCase());
        if (!queryIds.some((qid) => row.empId.toLowerCase().includes(qid))) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = row.name.toLowerCase().includes(query) || row.empId.toLowerCase().includes(query) || row.designation.toLowerCase().includes(query);
        if (!matchText) return false;
      }
      return true;
    });
  }, [appliedFilters, searchQuery]);
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.empId));
    }
  };
  const handleToggleSelectRow = (empId) => {
    if (selectedIds.includes(empId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== empId));
    } else {
      setSelectedIds((prev) => [...prev, empId]);
    }
  };
  const handleSubmitAppraisal = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one employee row to initiate the increment configuration.");
      return;
    }
    localStorage.setItem("gadget_preselected_empids", JSON.stringify(selectedIds));
    router.navigate({
      to: "/increment-gadget"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Human Resource" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Evaluation Propose" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Evaluation Propose Workspace" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: year, onChange: (e) => setYear(e.target.value), className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", children: "2024" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: month, onChange: (e) => setMonth(e.target.value), className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Jan", children: "Jan" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Feb", children: "Feb" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Executive", children: "Office Executive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Staff", children: "Office Staff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Worker", children: "Worker" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All Departments", children: "All Departments" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Business Automation (HR)", children: "Business Automation (HR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Business Development", children: "Business Development" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Business Innovation", children: "Business Innovation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Development", children: "Core Development" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Development (HR)", children: "Core Development (HR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Implementation & Support (HR)", children: "Implementation & Support (HR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Core Sales", children: "Core Sales" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Digital Marketing", children: "Digital Marketing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Project Resource & Strategy", children: "Project Resource & Strategy" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "WEB-Team", children: "WEB-Team" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 w-full sm:w-80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[9.5px] font-black text-muted-foreground uppercase flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee Id (Comma Separator)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-glow font-semibold lowercase italic", children: "use comma as separator" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdInput, onChange: (e) => setEmpIdInput(e.target.value), placeholder: "use comma as separator", className: "w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "h-9.5 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 self-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Excel Export Complete."), className: "h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Excel" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Print" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("PDF Export Complete."), className: "h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap", children: "Search:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Query names or IDs...", className: "h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filteredRecords.length > 0 && selectedIds.length === filteredRecords.length, onChange: handleToggleSelectAll, className: "rounded border-border/40 text-primary focus:ring-primary/20 size-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "SL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "EmpID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Joining Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Current Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center", children: "Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center", children: "Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Basic Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "House Rent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "BLL Sec 111" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Last Inc Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Last Inc Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Last Prom Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Last Prom. Designation" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
              filteredRecords.map((row) => {
                const isChecked = selectedIds.includes(row.empId);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isChecked, onChange: () => handleToggleSelectRow(row.empId), className: "rounded border-border/40 text-primary focus:ring-primary/20 size-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground/75 font-semibold", children: row.sl }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-semibold text-foreground", children: row.empId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: row.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: row.designation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/90 font-medium", children: row.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/80", children: row.section }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground/80", children: row.joiningDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-semibold text-foreground", children: [
                    "৳",
                    row.currentSalary.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center font-mono text-muted-foreground/90", children: row.tenureY }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center font-mono text-muted-foreground/90", children: row.tenureM }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center font-mono text-muted-foreground/90", children: row.tenureD }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-muted-foreground/95 font-medium", children: [
                    "৳",
                    row.basicSalary.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-muted-foreground/95 font-medium", children: [
                    "৳",
                    row.houseRent.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: row.tenureY >= 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase", title: "Entitled to annual increment under Section 111 of BLL", children: "Entitled" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/15 uppercase", title: "Discretionary increment (under 1 year of service)", children: "Discretionary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground/80", children: row.lastIncDate || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-muted-foreground/80", children: [
                    "৳",
                    row.lastIncAmount.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground/80", children: row.lastPromDate || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/75 font-semibold", children: row.lastPromDesignation || "—" })
                ] }, row.empId);
              }),
              filteredRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 18, className: "text-center py-10 font-bold text-muted-foreground text-xs", children: "No appraisal proposals found matching the query." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-muted-foreground", children: [
              "Showing 1 to ",
              filteredRecords.length,
              " of ",
              filteredRecords.length,
              " entries (Selected: ",
              selectedIds.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSubmitAppraisal, className: "h-10 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Submit" })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  EvaluationProposePage as component
};
