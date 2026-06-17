import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, Q as Cpu, S as Search, ax as FileSpreadsheet, P as Printer, ay as FileDown, a5 as Check, X, E as Eye } from "../_libs/lucide-react.mjs";
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
const defaultApprovalRecords = [{
  id: "2024053060",
  name: "Md. Mahfujul Haque",
  oldEmpType: "Office Executive",
  newEmpType: "Office Executive",
  department: "Core Development",
  oldDesignation: "Manager",
  newDesignation: "Manager",
  joiningDate: "10/12/2024",
  shift: "General Shift",
  status: "Working",
  oldGrade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 52800,
  newBasic: 52800,
  basicDiff: 0,
  oldGross: 88e3,
  newGross: 88e3,
  grossDiff: 0,
  approveStatus: "Pending"
}, {
  id: "2024053062",
  name: "Mohammad Mayhedi Hasan",
  oldEmpType: "Office Executive",
  newEmpType: "Office Executive",
  department: "Core Development",
  oldDesignation: "Deputy Manager",
  newDesignation: "Deputy Manager",
  joiningDate: "10/12/2024",
  shift: "General Shift",
  status: "Working",
  oldGrade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 44400,
  newBasic: 44400,
  basicDiff: 0,
  oldGross: 74e3,
  newGross: 74e3,
  grossDiff: 0,
  approveStatus: "Pending"
}];
function ApproveIncrementGadgetPage() {
  const [year, setYear] = reactExports.useState("2025");
  const [month, setMonth] = reactExports.useState("Dec");
  const [approveStatus, setApproveStatus] = reactExports.useState("Pending");
  const [empType, setEmpType] = reactExports.useState("ALL");
  const [section, setSection] = reactExports.useState("ALL");
  const [unit, setUnit] = reactExports.useState("ALL");
  const [line, setLine] = reactExports.useState("ALL");
  const [designation, setDesignation] = reactExports.useState("ALL");
  const [grade, setGrade] = reactExports.useState("ALL");
  const [status, setStatus] = reactExports.useState("Working");
  const [empIdInput, setEmpIdInput] = reactExports.useState("");
  const [joiningYear, setJoiningYear] = reactExports.useState("2023");
  const [joiningMonth, setJoiningMonth] = reactExports.useState("Dec");
  const [records, setRecords] = reactExports.useState([]);
  const [selectedIds, setSelectedIds] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const mapped = parsed.map((item) => ({
            id: item.empId,
            name: item.empName,
            oldEmpType: "Office Executive",
            newEmpType: "Office Executive",
            department: item.department,
            oldDesignation: item.section,
            // section was stored as designation in queue list
            newDesignation: item.designation,
            joiningDate: item.joiningDate,
            shift: "General Shift",
            status: "Working",
            oldGrade: "None",
            newGrade: "None",
            unit: "PSL",
            oldBasic: item.prevGross * 0.6,
            newBasic: item.grossAfterInc * 0.6,
            basicDiff: (item.grossAfterInc - item.prevGross) * 0.6,
            oldGross: item.prevGross,
            newGross: item.grossAfterInc,
            grossDiff: item.grossAfterInc - item.prevGross,
            approveStatus: item.hrApproveStatus === "Approved" ? "Approved" : "Pending"
          }));
          setRecords(mapped);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRecords(defaultApprovalRecords);
  }, []);
  const filteredRecords = reactExports.useMemo(() => {
    return records.filter((row) => {
      if (approveStatus !== "ALL" && row.approveStatus !== approveStatus) return false;
      if (empType !== "ALL" && row.oldEmpType !== empType) return false;
      if (status !== "ALL" && row.status !== status) return false;
      if (empIdInput.trim()) {
        const qids = empIdInput.split(",").map((id) => id.trim().toLowerCase());
        if (!qids.some((qid) => row.id.toLowerCase().includes(qid))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return row.name.toLowerCase().includes(q) || row.id.includes(q) || row.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [records, approveStatus, empType, status, empIdInput, searchQuery]);
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };
  const handleToggleRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((e) => e !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      alert("No records selected for approval.");
      return;
    }
    const updated = records.map((r) => {
      if (selectedIds.includes(r.id)) {
        return {
          ...r,
          approveStatus: "Approved"
        };
      }
      return r;
    });
    setRecords(updated);
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item) => {
          if (selectedIds.includes(item.empId)) {
            return {
              ...item,
              hrApproveStatus: "Approved",
              mdApproveStatus: "Approved"
            };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }
    setSelectedIds([]);
    alert(`Successfully approved increment files for ${selectedIds.length} employees.`);
  };
  const handleUndoSelected = () => {
    if (selectedIds.length === 0) {
      alert("No records selected for undo.");
      return;
    }
    const updated = records.map((r) => {
      if (selectedIds.includes(r.id)) {
        return {
          ...r,
          approveStatus: "Pending"
        };
      }
      return r;
    });
    setRecords(updated);
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item) => {
          if (selectedIds.includes(item.empId)) {
            return {
              ...item,
              hrApproveStatus: "Pending",
              mdApproveStatus: "Pending"
            };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }
    setSelectedIds([]);
    alert(`Successfully rolled back increment statuses to Pending.`);
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Approve Increment Gadget" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "size-5.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Approve Increment Gadget Workspace" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Year (Gadget)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: year, onChange: (e) => setYear(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Month (Gadget)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: month, onChange: (e) => setMonth(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Jan", children: "Jan" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Approve Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: approveStatus, onChange: (e) => setApproveStatus(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Employee Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empType, onChange: (e) => setEmpType(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Executive", children: "Office Executive" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: section, onChange: (e) => setSection(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: unit, onChange: (e) => setUnit(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: line, onChange: (e) => setLine(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: designation, onChange: (e) => setDesignation(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: grade, onChange: (e) => setGrade(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Working", children: "Working" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "EmpId (Comma Separated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: empIdInput, onChange: (e) => setEmpIdInput(e.target.value), placeholder: "Input Comma As Separator", className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground outline-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Joining Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: joiningYear, onChange: (e) => setJoiningYear(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2023", children: "2023" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex items-end justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Joining Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: joiningMonth, onChange: (e) => setJoiningMonth(e.target.value), className: "w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Search queries recompiled."), className: "h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search" })
              ] })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Quick Search...", className: "h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filteredRecords.length > 0 && selectedIds.length === filteredRecords.length, onChange: handleSelectAll, className: "rounded border-border/40 text-primary focus:ring-primary/20 size-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Old EmpType" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "New EmpType" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Old Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-primary", children: "New Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Joining Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Shift" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Old Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center text-primary", children: "New Grade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Old Basic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-primary", children: "New Basic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-bold", children: "Basic Diff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Old Gross" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-primary", children: "New Gross" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-bold", children: "Gross Diff" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20", children: [
              filteredRecords.map((row, idx) => {
                const isChecked = selectedIds.includes(row.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isChecked, onChange: () => handleToggleRow(row.id), className: "rounded border-border/40 text-primary focus:ring-primary/20 size-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold text-muted-foreground/60", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-black text-foreground", children: row.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-extrabold text-foreground", children: row.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-semibold", children: row.oldEmpType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-primary font-semibold", children: row.newEmpType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-semibold", children: row.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground/80", children: row.oldDesignation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-primary font-extrabold", children: row.newDesignation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground", children: row.joiningDate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-bold text-muted-foreground/80", children: row.shift }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15", children: row.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground", children: row.oldGrade }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono font-bold text-primary", children: row.newGrade }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center font-mono text-muted-foreground", children: row.unit }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-muted-foreground", children: [
                    "৳",
                    row.oldBasic.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-bold text-primary", children: [
                    "৳",
                    row.newBasic.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono font-black text-foreground", children: row.basicDiff > 0 ? `+৳${row.basicDiff.toFixed(2)}` : "৳0.00" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-muted-foreground", children: [
                    "৳",
                    row.oldGross.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-bold text-primary", children: [
                    "৳",
                    row.newGross.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono font-black text-foreground", children: row.grossDiff > 0 ? `+৳${row.grossDiff.toFixed(2)}` : "৳0.00" })
                ] }, row.id);
              }),
              filteredRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 21, className: "text-center py-10 font-bold text-muted-foreground text-xs", children: "No pending increments available for authorization." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleApproveSelected, className: "h-8 pl-2 pr-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-emerald-500/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Approve Selected" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUndoSelected, className: "h-8 pl-2 pr-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-amber-500/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Undo Selected" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Generating printable PDF dossier ledger..."), className: "h-8 pl-2 pr-3.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-slate-600/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "p-0.5 bg-white/10 rounded-md text-white shadow-3xs flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View(PDF)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-muted-foreground", children: [
              "Showing 1 to ",
              filteredRecords.length,
              " of ",
              filteredRecords.length,
              " entries (Selected: ",
              selectedIds.length,
              ")"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ApproveIncrementGadgetPage as component
};
