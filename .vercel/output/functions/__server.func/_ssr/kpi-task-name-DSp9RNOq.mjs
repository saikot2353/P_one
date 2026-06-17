import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, y as ChartColumn, i as Plus, ax as FileSpreadsheet, P as Printer, ay as FileDown, S as Search, aM as Pen, ap as Trash2, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/tslib.mjs";
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
const initialTasks = [{
  id: "KPI-001",
  department: "All Departments",
  criteriaName: "Decision Making/ Problem Solving",
  criteriaDetail: "Measures effectiveness in understanding problems and making timely practical decisions, best suited for the business.",
  status: "Active"
}, {
  id: "KPI-002",
  department: "All Departments",
  criteriaName: "Independent Action",
  criteriaDetail: "Takes initiative, solves problems independently, makes decisions without needing step-by-step guidance, seeks solutions instead of waiting for instructions, accepts responsibility for actions taken.",
  status: "Active"
}, {
  id: "KPI-003",
  department: "All Departments",
  criteriaName: "Leadership",
  criteriaDetail: "Influence, guide, and support others toward achieving goals — whether in a formal leadership role or through informal influence.",
  status: "Active"
}, {
  id: "KPI-004",
  department: "All Departments",
  criteriaName: "Dependability",
  criteriaDetail: "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, is consistent and reliable in their duties, is accountable for their actions and mistakes.",
  status: "Active"
}, {
  id: "KPI-005",
  department: "All Departments",
  criteriaName: "Teamwork",
  criteriaDetail: "The ability to inspire subordinates & others with collaboration effort to achieve a common goal / complete a task.",
  status: "Active"
}, {
  id: "KPI-006",
  department: "All Departments",
  criteriaName: "Verbal & Written Communication",
  criteriaDetail: "The ability to communicate effectively & efficiently within the organization & out of organization.",
  status: "Active"
}, {
  id: "KPI-007",
  department: "All Departments",
  criteriaName: "Knowledge of law & SOP",
  criteriaDetail: "KPI evaluates how well an employee understands and applies relevant legal regulations, industry standards, and internal procedures in their daily work.",
  status: "Active"
}, {
  id: "KPI-008",
  department: "All Departments",
  criteriaName: "Loyalty of company",
  criteriaDetail: "KPI measures how committed an employee is to the organization's mission, values, and long-term success.",
  status: "Active"
}];
function KpiTaskNamePage() {
  const [tasks, setTasks] = reactExports.useState(initialTasks);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [editTask, setEditTask] = reactExports.useState(null);
  const [dept, setDept] = reactExports.useState("All Departments");
  const [name, setName] = reactExports.useState("");
  const [detail, setDetail] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("Active");
  const filteredTasks = reactExports.useMemo(() => {
    return tasks.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.criteriaName.toLowerCase().includes(q) || t.criteriaDetail.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tasks, searchQuery]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !detail.trim()) {
      alert("Please fill in all fields!");
      return;
    }
    if (editTask) {
      setTasks((prev) => prev.map((t) => t.id === editTask.id ? {
        ...t,
        department: dept,
        criteriaName: name,
        criteriaDetail: detail,
        status
      } : t));
    } else {
      const newTask = {
        id: `KPI-${String(tasks.length + 1).padStart(3, "0")}`,
        department: dept,
        criteriaName: name,
        criteriaDetail: detail,
        status
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setEditTask(null);
    setName("");
    setDetail("");
    setDept("All Departments");
    setStatus("Active");
  };
  const handleEdit = (task) => {
    setEditTask(task);
    setName(task.criteriaName);
    setDetail(task.criteriaDetail);
    setDept(task.department);
    setStatus(task.status);
    setIsModalOpen(true);
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this KPI criteria from the registry?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "KPI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Task Name" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "KPI Task Name Setup" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setEditTask(null);
            setName("");
            setDetail("");
            setDept("All Departments");
            setStatus("Active");
            setIsModalOpen(true);
          }, className: "h-9 px-5 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add KPI Criteria" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden", children: [{
          label: "TOTAL CRITERIA",
          val: `${tasks.length} KPIs`,
          desc: "Active performance metrics",
          color: "text-primary bg-primary/5 border-primary/10"
        }, {
          label: "ALL DEPARTMENTS",
          val: "Shared",
          desc: "Applicable company-wide",
          color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
        }, {
          label: "ACTIVE CRITERIA",
          val: `${tasks.filter((t) => t.status === "Active").length} Metrics`,
          desc: "Live in evaluation workflows",
          color: "text-blue-500 bg-blue-500/5 border-blue-500/10"
        }].map((st, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 rounded-lg border bg-card ${st.color} shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black tracking-wider uppercase opacity-75", children: st.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black", children: st.val }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-60 font-semibold", children: st.desc })
        ] }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EXCEL" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PRINT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: "Search:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-56 sm:w-64", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search KPI name, details...", className: "w-full h-8 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-24 border-r border-border/30", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 border-r border-border/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-64 border-r border-border/30", children: "Criteria Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold border-r border-border/30", children: "Criteria Detail" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30 font-sans text-xs", children: [
              filteredTasks.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3.5 border-r border-border/20 text-center print:hidden flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleEdit(row), className: "p-1 hover:bg-primary/10 text-amber-500 rounded transition", title: "Edit Criteria", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(row.id), className: "p-1 hover:bg-rose-500/10 text-rose-500 rounded transition", title: "Delete Criteria", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9.5px] ${row.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.status }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 font-bold text-foreground/80 border-r border-border/20", children: row.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 font-black text-foreground border-r border-border/20", children: row.criteriaName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-muted-foreground leading-relaxed border-r border-border/20", children: row.criteriaDetail })
              ] }, row.id)),
              filteredTasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-16 text-center text-muted-foreground font-semibold", children: "No performance criteria found matching query parameters." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Showing 1 to ",
              filteredTasks.length,
              " of ",
              filteredTasks.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 rounded bg-muted hover:bg-muted/80", children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 rounded bg-primary text-white", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 rounded bg-muted hover:bg-muted/80", children: "Next" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsModalOpen(false), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: editTask ? "Edit Performance KPI" : "Create KPI Criteria" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Target Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: dept, onChange: (e) => setDept(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All Departments", children: "All Departments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Business Innovation", children: "Business Innovation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Project Resource & Strategy", children: "Project Resource & Strategy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Finance & Accounts", children: "Finance & Accounts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Operations & HR", children: "Operations & HR" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inactive", children: "Inactive" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Criteria Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Technical Problem Solving", className: "w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Criteria Detail *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, value: detail, onChange: (e) => setDetail(e.target.value), placeholder: "Comprehensive description of how performance in this criteria is graded...", className: "w-full h-24 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "h-9 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: editTask ? "Save Changes" : "Save Criteria" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  KpiTaskNamePage as component
};
