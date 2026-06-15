import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as Route, e as employeesData, S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { r as rawIncrementRecords } from "./increment-history-data-DfeZd3zT.mjs";
import { aI as ArrowLeft, C as ChevronRight, ay as FileDown, an as UserCog, h as CalendarRange, U as User, aE as DollarSign, aU as GraduationCap, q as Users, V as ShieldCheck, al as TrendingUp, a5 as Check, az as FilePenLine, d as FileText, t as Briefcase, a7 as Laptop, b4 as PhoneCall, a_ as BookOpen, ah as Award, b7 as History, aD as FileClock } from "../_libs/lucide-react.mjs";
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
function EmployeeDetailPage() {
  const {
    id
  } = Route.useParams();
  const [employees, setEmployees] = reactExports.useState(() => {
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
            return merged;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return employeesData;
  });
  const selectedEmp = reactExports.useMemo(() => {
    return employees.find((e) => e.id === id) || employees[0];
  }, [id, employees]);
  const incRecord = reactExports.useMemo(() => {
    return rawIncrementRecords.find((r) => r.empId === selectedEmp.id);
  }, [selectedEmp.id]);
  const careerTimeline = reactExports.useMemo(() => {
    const timeline = [];
    timeline.push({
      id: selectedEmp.id,
      title: selectedEmp.title,
      dept: selectedEmp.dept,
      status: selectedEmp.status || "Working",
      joinDate: selectedEmp.joinDate,
      resignDate: selectedEmp.resignDate || "Active",
      isCurrent: true
    });
    let refId = selectedEmp.rejoinRef;
    let visited = /* @__PURE__ */ new Set([selectedEmp.id]);
    while (refId) {
      if (visited.has(refId)) break;
      visited.add(refId);
      const prevEmp = employees.find((e) => e.id === refId);
      if (prevEmp) {
        timeline.push({
          id: prevEmp.id,
          title: prevEmp.title,
          dept: prevEmp.dept,
          status: prevEmp.status || "Resigned",
          joinDate: prevEmp.joinDate,
          resignDate: prevEmp.resignDate || "—",
          isCurrent: false
        });
        refId = prevEmp.rejoinRef;
      } else {
        timeline.push({
          id: refId,
          title: "Previous Position",
          dept: selectedEmp.dept,
          status: "Resigned",
          joinDate: "—",
          resignDate: selectedEmp.joinDate,
          isCurrent: false
        });
        break;
      }
    }
    let forwardEmp = employees.find((e) => e.rejoinRef === selectedEmp.id);
    while (forwardEmp) {
      if (visited.has(forwardEmp.id)) break;
      visited.add(forwardEmp.id);
      timeline.unshift({
        id: forwardEmp.id,
        title: forwardEmp.title,
        dept: forwardEmp.dept,
        status: forwardEmp.status || "Working",
        joinDate: forwardEmp.joinDate,
        resignDate: forwardEmp.resignDate || "Active",
        isCurrent: false
      });
      forwardEmp = employees.find((e) => e.rejoinRef === forwardEmp.id);
    }
    return timeline;
  }, [selectedEmp, employees]);
  const TABS = [{
    id: "personal",
    label: "Personal & Identity",
    icon: User
  }, {
    id: "financial",
    label: "Financial & Employment",
    icon: DollarSign
  }, {
    id: "qualification",
    label: "Qualification & Experience",
    icon: GraduationCap
  }, {
    id: "family",
    label: "Family & Dependents",
    icon: Users
  }, {
    id: "docs",
    label: "Verification & Docs",
    icon: ShieldCheck
  }, {
    id: "increment",
    label: "Increment History",
    icon: TrendingUp
  }];
  const [activeTab, setActiveTab] = reactExports.useState("personal");
  const grossNum = parseFloat(selectedEmp.gross) || 3e4;
  const basicVal = (grossNum * 0.6).toFixed(2);
  const houseRentVal = (grossNum * 0.25).toFixed(2);
  const medicalVal = (grossNum * 0.08).toFixed(2);
  (grossNum * 0.04).toFixed(2);
  (grossNum * 0.03).toFixed(2);
  const pfVal = (grossNum * 0.6 * 0.1).toFixed(2);
  const nameBngVal = selectedEmp.name === "Tahmid Afsar Shapno" ? "তাহমিদ আফসার স্বপন" : selectedEmp.name === "Sohanur Rahman Sohan" ? "সোহানুর রহমান সোহান" : selectedEmp.name === "Easin Mia" ? "ইয়াসিন মিয়া" : selectedEmp.name === "Jannatul Maowa" ? "জান্নাতুল মাওয়া" : selectedEmp.name + " (বাংলা)";
  const fatherNameEng = "Mohammad Abdur Rahman";
  const motherNameEng = "Sultana Begum";
  selectedEmp.gender === "Female" ? "Mohammad Karim" : "—";
  selectedEmp.gender === "Female" ? "Abdur Rahman" : "Fatema Begum";
  `COMP-${selectedEmp.id.slice(0, 4)}-992`;
  `RFID-${selectedEmp.id.slice(6)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6 overflow-y-auto h-full scrollbar-thin pb-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/personnel-list", className: "hover:text-primary transition-colors flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3" }),
                " Personnel List"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Digital File" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xl shadow-sm", children: selectedEmp.name.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2", children: [
                  selectedEmp.name,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-extrabold uppercase tracking-widest border px-2 py-0.5 rounded ${selectedEmp.acStatus === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`, children: selectedEmp.acStatus || "Active" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground", children: [
                  selectedEmp.title,
                  " — ",
                  selectedEmp.dept
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-9.5 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold shadow-xs transition duration-200 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-3.5 text-primary" }),
              " Download PDF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-9.5 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-3.5" }),
              " Edit Profile"
            ] })
          ] })
        ] }),
        (selectedEmp.rejoinRef || selectedEmp.rejoinedTo || careerTimeline.length > 1) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "size-5 shrink-0" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-indigo-600 dark:text-indigo-400", children: "Rejoined Employee Dossier Link" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                "This profile is connected to multiple career periods. Viewing: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground font-mono", children: [
                  "ID: ",
                  selectedEmp.id
                ] }),
                " (",
                selectedEmp.joinDate,
                " to ",
                selectedEmp.status === "Working" ? "Present" : selectedEmp.resignDate || "—",
                ")."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: careerTimeline.map((period, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/employee-detail/$id", params: {
            id: period.id
          }, className: `text-[10px] px-2.5 py-1 rounded-lg border transition duration-150 ${period.id === selectedEmp.id ? "bg-indigo-500 border-indigo-500 text-white font-medium" : "bg-card border-border/80 hover:bg-muted text-foreground"}`, children: [
            "Period ",
            careerTimeline.length - idx,
            ": ",
            period.id
          ] }, period.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-x-auto scrollbar-none border-b border-border/40 p-1.5 gap-1 bg-muted/10", children: TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${isSelected ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" : "text-muted-foreground/80 hover:bg-muted hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabIcon, { className: `size-4 shrink-0 ${isSelected ? "animate-pulse" : ""}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label })
            ] }, tab.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 md:p-6 min-h-[500px]", children: [
            activeTab === "personal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Primary & Demographic Dossier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Name (English)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold", children: selectedEmp.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Name (Bengali)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: nameBngVal })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Date of Birth" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.dob })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Gender" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.gender })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Religion" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "Islam" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Blood Group" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-rose-500", children: selectedEmp.blood })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Marital Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "Single" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Education Level" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "Bachelor of Science (B.Sc)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5", children: "Corporate Placement & Mapping" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Emp ID (System)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold text-foreground", children: selectedEmp.id })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Emp ID (Company)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.offcId || "—" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Joining Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.joinDate })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Confirmation Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.confirmDate || "—" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Department" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold", children: selectedEmp.dept })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Designation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold", children: selectedEmp.title })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Employee Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.type })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Working Area" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "PSL-Operation" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Section" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.sect })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Job Nature" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "ALL" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Unit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.unit })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Line" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.line })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Grade" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold font-mono text-indigo-500", children: selectedEmp.grade })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Shift" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.shift })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Employment Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-emerald-600", children: selectedEmp.empStatus })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Probation Period" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "N/A" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Default Holiday" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: selectedEmp.holiday })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Set Manager" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold truncate", children: "Mamunoor Rashid (DGM)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Recruitment Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "New" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "RC Notes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold truncate", children: "Hired via Campus Drive" })
                  ] })
                ] })
              ] }),
              careerTimeline.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5", children: "Re-employment & Connected Career Timeline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-4 text-xs", children: careerTimeline.map((period, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -left-[31px] top-0.5 size-4.5 rounded-full border-2 flex items-center justify-center ${period.id === selectedEmp.id ? "bg-indigo-500 border-indigo-500 text-white animate-pulse" : "bg-card border-indigo-500/30 text-indigo-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] leading-none font-medium", children: careerTimeline.length - idx }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                          "ID: ",
                          period.id
                        ] }),
                        period.id === selectedEmp.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] bg-indigo-500/15 text-indigo-600 border border-indigo-500/35 px-1 rounded-sm uppercase tracking-wide leading-none font-medium", children: "Currently Viewing" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8px] px-1 rounded-sm uppercase tracking-wide leading-none font-medium ${period.status === "Working" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`, children: period.status })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                        period.title,
                        " — ",
                        period.dept
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground font-mono", children: [
                        "Joined: ",
                        period.joinDate
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground font-mono", children: [
                        "Left: ",
                        period.resignDate
                      ] })
                    ] }),
                    period.id !== selectedEmp.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employee-detail/$id", params: {
                      id: period.id
                    }, className: "text-[10px] text-indigo-500 hover:text-indigo-600 font-medium hover:underline transition self-start sm:self-center", children: "Switch Profile →" })
                  ] })
                ] }, period.id)) }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5", children: "Legal Identification Credentials" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "National ID (NID)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "1928374659201" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Birth Reg No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "Not Provided" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Passport No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "Not Provided" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Driving License No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "Not Provided" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Prof. Membership No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "IEB-92812" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Parental & Kinship Context" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Father Name (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: fatherNameEng })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Father Name (Bengali)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "মোহাম্মদ আবদুর রহমান" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Mother Name (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: motherNameEng })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase font-sans", children: "Mother Name (Bengali)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "সুলতানা বেগম" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 sm:col-span-2 pt-2 border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-muted-foreground/80 italic", children: "Spouse information fields are hidden because Marital Status is set to Single." }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-amber-500 border-b border-border/20 pb-1.5", children: "Residential Address Directory" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-extrabold uppercase text-amber-600 border-b border-amber-500/20 pb-1", children: "Present Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Division" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Dhaka" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "District" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Dhaka" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Upazila" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Mirpur" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Post Office" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Mirpur-12" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Village/House (Eng)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Vill # Dhopapara" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Village/House (Bng)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "গ্রাম # ধোপাপাড়া" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Road" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Road # 12" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Country" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Bangladesh" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-amber-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Mailing Dispatch Preview" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium italic mt-1 text-foreground/80", children: "Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-4 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-extrabold uppercase text-foreground/80 border-b border-border/20 pb-1", children: "Permanent Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Division" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Dhaka" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "District" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Dhaka" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Upazila" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Mirpur" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Post Office" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Mirpur-12" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Village/House (Eng)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Vill # Dhopapara" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Village/House (Bng)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "গ্রাম # ধোপাপাড়া" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Road" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Road # 12" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Country" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Bangladesh" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Legal Dossier Dispatch Preview" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium italic mt-1 text-foreground/80", children: "Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Contact & Reachability Channels" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-4 bg-muted/5 border border-border/40 rounded-xl p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Office Email" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary truncate", children: selectedEmp.email || "employee@pakizasoftware.com" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Office Mobile" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold font-mono", children: selectedEmp.officeMob || "017500XXXXX" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Office Extension" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold font-mono", children: "102" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Personal Email" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-primary truncate", children: "personal@gmail.com" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Personal Contact No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold font-mono", children: selectedEmp.phone !== "—" ? selectedEmp.phone : selectedEmp.personalContact || "017130XXXXX" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Document & Image Upload Center" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-6" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "Employee Portrait" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground", children: "Premium front portrait" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-6" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "Authorized Signature" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground", children: "Clean white sheet" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-6" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "National ID Card" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground", children: "Both sides JPG/PDF" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-6" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "Degree Certificate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground", children: "Academic graduation" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-rose-500 border-b border-border/20 pb-1.5", children: "Emergency Contact & Reachability" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Contact Person" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-foreground", children: "Mohammad Abdur Rahman" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Relationship" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Father" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Primary Mobile No" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "+880 1750-021154" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Alternative Contact" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "01911-223344" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Email Address" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: "parent@gmail.com" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-rose-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Detailed Address" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium italic mt-1 text-foreground/80", children: "Vill # Dhopapara, Road # 12, Mirpur, Dhaka, Bangladesh" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5", children: "Professional & Corporate References" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-4 h-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-extrabold uppercase text-indigo-600 border-b border-indigo-500/20 pb-1", children: "Primary Reference" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Referee Name" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Dr. Selim Reza" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Contact Number" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "01711-223344" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Designation & Org" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Professor, University of Dhaka" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2 border-t border-indigo-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-extrabold uppercase text-indigo-600 border-b border-indigo-500/20 pb-1", children: "Secondary Reference" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Referee Name" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Ahmed Kabir" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Contact Number" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "01822-334455" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Designation & Org" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Director, Tech Ltd" })
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            activeTab === "financial" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5", children: "Compensation Structure & Financials (Base Salary & Standard Splits)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 font-mono text-xs pr-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-emerald-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold uppercase tracking-wider text-[10px]", children: "Gross Salary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-emerald-600 dark:text-emerald-400 text-sm", children: [
                        "৳",
                        grossNum.toLocaleString("en-IN")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Basic Salary (60%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                        "৳",
                        parseFloat(basicVal).toLocaleString("en-IN")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "House Rent (25%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                        "৳",
                        parseFloat(houseRentVal).toLocaleString("en-IN")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Medical (8%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                        "৳",
                        parseFloat(medicalVal).toLocaleString("en-IN")
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 font-mono text-xs md:pl-4 md:border-l border-emerald-500/20 pt-2 md:pt-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-transparent md:border-emerald-500/20 hidden md:flex", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent font-sans font-bold uppercase tracking-wider text-[10px]", children: "-" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent font-black text-sm", children: "-" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Conveyance (4%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                        "৳",
                        (grossNum * 0.04).toLocaleString("en-IN")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Food (3%)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                        "৳",
                        (grossNum * 0.03).toLocaleString("en-IN")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-1 mt-1 border-t border-emerald-500/10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-sans font-bold", children: "Provident Fund (10% of Basic)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-emerald-600", children: [
                        "৳",
                        parseFloat(pfVal).toLocaleString("en-IN")
                      ] })
                    ] })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-amber-500 border-b border-border/20 pb-1.5", children: "Supplementary Allowances & Taxes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2 text-xs font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Special Allowance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "৳5,000" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Mobile Allowance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "৳1,000" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Internet Allowance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "৳1,500" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-sans font-bold", children: "Utility Allowance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "৳2,000" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-amber-500/20 text-rose-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-bold", children: "Tax Deduction" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "৳0" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-rose-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-bold", children: "Gratuity Contribution" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "৳0" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-3 mt-1 border-t border-amber-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-extrabold text-foreground uppercase text-[10px]", children: "Total Allowance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-foreground", children: "৳9,500" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-extrabold text-emerald-600 uppercase text-[10px]", children: "Est. Net Payable" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-emerald-600", children: [
                        "৳",
                        (grossNum + 9500).toLocaleString("en-IN")
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5", children: "Disbursement Routing & Bank Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-3 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Payment Mode" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-indigo-600", children: "Bank Transfer" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Bank Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Dutch-Bangla Bank Limited" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 col-span-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Account Number" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono text-sm tracking-widest bg-indigo-500/10 px-3 py-2 rounded border border-indigo-500/20 w-fit", children: "102.120.99827" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Branch Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Mirpur Circle-10" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Routing Number" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "090261987" })
                    ] })
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Corporate Job Description & Charter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/5 border border-border/40 rounded-xl p-4 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-3" }),
                        " Key Roles & Responsibilities"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold leading-relaxed", children: "Senior Software Engineer responsible for building high-scale payroll and HR modules using modern web technologies." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2 border-t border-border/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3" }),
                        " KPIs / Deliverables"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold leading-relaxed", children: "Fullstack web app development, Git source code management, DB schema optimization." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2 border-t border-border/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
                        " Reporting Structure"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-semibold space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/80", children: "Primary:" }),
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: "Tahmid Afsar Shapno" }),
                          " (Head Of Department)"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/80", children: "Alternate:" }),
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Chief Operations Officer" })
                        ] })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-slate-500 border-b border-border/20 pb-1.5", children: "Corporate Equipment & Asset Assignment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-500/5 border border-slate-500/20 rounded-xl p-4 space-y-4 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "size-3" }),
                          " Laptop Brand/Model"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: 'Apple MacBook Pro 16"' })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Asset Tag" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20", children: "COMP-2026-089" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3" }),
                          " Mobile Asset Model"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "iPhone 15" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Asset ID" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono text-slate-600 bg-slate-500/10 px-2 py-0.5 rounded w-fit border border-slate-500/20", children: "MOB-2026-112" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 col-span-2 pt-2 border-t border-slate-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3" }),
                          " Access Card Tag ID"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20", children: "AC-559021" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 text-right", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Issuance Date" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "19/05/2026" })
                      ] })
                    ] }) })
                  ] }) })
                ] })
              ] })
            ] }),
            activeTab === "qualification" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-5 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-indigo-500/20 pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-indigo-600 tracking-wider", children: "I. Academic Portfolio" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Certified academic credentials and structured training programs." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-indigo-500" }),
                      " Academic Qualifications"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Degree / Exam Title" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Institution Name" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Passing Year" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Result / CGPA" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Attachment" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-indigo-500 font-bold", children: "Bachelor of Science (B.Sc)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "IIT University of Dhaka" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "2022" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "3.85" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                          " Verified"
                        ] }) })
                      ] }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-3.5 text-indigo-500" }),
                      " Professional Training Programs"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Training Title" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Institution / Provider" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Duration" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Completion Date" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-indigo-500 font-bold", children: "Advanced System Architecture" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "Coursera / Pakiza Software" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "12 Weeks" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-right", children: "10/03/2024" })
                      ] }) })
                    ] }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/10 rounded-lg p-5 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-primary/20 pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-primary tracking-wider", children: "II. Professional Career & Job History" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Prior industrial background, designations, and verified certificates." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5 text-primary" }),
                      " Career History"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Organization / Company" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Designation" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "From Date" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "To Date" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Reason for Leaving" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Attachment" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold", children: "Pakiza Software Limited" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-primary", children: "Software Engineer" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "01/01/2023" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "28/02/2025" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "Career Growth" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                          " NOC"
                        ] }) })
                      ] }) })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase text-foreground/80 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5 text-primary" }),
                      " Professional Certifications & Credentials"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Certificate Title" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Issuing Authority / Organization" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Credential ID" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Issue Date" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-primary font-bold", children: "AWS Certified Solutions Architect" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: "Amazon Web Services" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-slate-500", children: "AWS-102938" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-right", children: "15/06/2024" })
                      ] }) })
                    ] }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/5 border border-amber-500/10 rounded-lg p-5 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-amber-500/20 pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-amber-600 tracking-wider", children: "III. Committee Commitments & Involvements" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Internal panels, audit commissions, and technical leadership roles." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-xl overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Committee / Group Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Role Played" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Duration" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Key Deliverable / Remarks" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-extrabold text-foreground", children: "HRIS Standardization Committee" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-amber-600 font-bold", children: "Technical Lead" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "6 Months" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right text-muted-foreground font-medium", children: "Led database migration and performance optimizations" })
                  ] }) })
                ] }) }) })
              ] })
            ] }),
            activeTab === "family" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5", children: "Nominee Declaration Dossier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-black text-foreground", children: "Fatema Begum" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-emerald-600 uppercase", children: "Mother" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black font-mono", children: "100% SHARE" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs pt-3 border-t border-emerald-500/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Nominee NID / Birth Reg" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "1952093847120" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Nominee Contact No" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold font-mono", children: "+880 1711-002233" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 col-span-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Permanent Address" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground/80", children: "Vill # Dhopapara, Road # 12, Mirpur, Dhaka" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-rose-500 border-b border-border/20 pb-1.5", children: "Emergency Contact" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2 h-full flex flex-col justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-extrabold text-foreground", children: "Mohammad Abdur Rahman" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Father" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-muted-foreground pt-1", children: "+880 1750-021154" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Family Dependents Registry" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Dependent Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Relationship" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Date of Birth" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "NID / Birth Cert No" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold text-foreground", children: "Anisur Rahman" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-primary", children: "Child (Son/Daughter)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono", children: "12/08/1965" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-right", children: "1928374650" })
                  ] }) })
                ] })
              ] })
            ] }),
            activeTab === "docs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5", children: "Official Auditor Background Verification" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-black text-emerald-600 uppercase tracking-wide", children: "Verified & Cleared" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Background Check Status" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold font-mono", children: "19/05/2026" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Verification Date" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/20 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Audited / Verified By" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground", children: "HR Compliance Team" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground uppercase", children: "Auditor Notes & Findings" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-muted-foreground/80 leading-relaxed italic", children: '"All background verification checks cleared successfully, including academic credential validation and police clearance."' })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Supporting Documents & PDF Annexes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs border border-border/40 rounded-lg overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[9px] uppercase font-bold text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Document Title" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Document Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Attached File Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Status" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/20 font-semibold bg-card", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold text-foreground", children: "Police Clearance Certificate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-indigo-500", children: "PDF Document" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-muted-foreground", children: "police_clearance_shapno.pdf" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                        " Secure"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold text-foreground", children: "National ID Card (Both Sides)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-indigo-500", children: "JPG Image" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-muted-foreground", children: "nid_scan_front_back.jpg" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                        " Secure"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-bold text-foreground", children: "B.Sc Academic Certificate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-indigo-500", children: "PDF Document" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-muted-foreground", children: "bsc_certificate_dhaka_uni.pdf" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                        " Secure"
                      ] }) })
                    ] })
                  ] })
                ] })
              ] }),
              careerTimeline.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 border-b border-border/20 pb-1.5", children: "Connected Documents from Previous Employment Periods" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/40 rounded-lg overflow-hidden bg-card divide-y divide-border/20", children: careerTimeline.filter((period) => period.id !== selectedEmp.id).map((period) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/5 transition", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileClock, { className: "size-4 shrink-0" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-foreground", children: [
                        "Archive Dossier for ID: ",
                        period.id
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-muted-foreground uppercase font-mono mt-0.5", children: [
                        "Joined: ",
                        period.joinDate,
                        " | Left: ",
                        period.resignDate
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 self-end sm:self-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wide leading-none font-medium", children: "3 Files Attached" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employee-detail/$id", params: {
                      id: period.id
                    }, className: "text-[10px] text-indigo-500 hover:text-indigo-600 font-medium hover:underline flex items-center gap-1", children: "Open Dossier →" })
                  ] })
                ] }, period.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-primary border-b border-border/20 pb-1.5", children: "Visual Identity Vault" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "Portrait Scan" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/50 bg-card rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-8" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold", children: "Signature" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      " Uploaded"
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            activeTab === "increment" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 border-b border-border/20 pb-1.5", children: "Financial & Increment Timeline" }),
              !incRecord ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center bg-muted/10 rounded-xl border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-8 mx-auto text-muted-foreground/40 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "No increment history found for this employee." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-3 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase text-muted-foreground mb-1", children: "Joining Salary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black font-mono", children: [
                      "৳",
                      incRecord.salaryJoining.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase text-emerald-600 mb-1", children: "Current Gross" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black font-mono text-emerald-600", children: [
                      "৳",
                      incRecord.salaryGross.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl p-3 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase text-primary mb-1", children: "Total Inc." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black font-mono text-primary", children: [
                      "৳",
                      (incRecord.salaryGross - incRecord.salaryJoining).toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-black uppercase text-amber-600 mb-1", children: "Promotions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-black font-mono text-amber-600", children: incRecord.total.includes("(P)") ? "Yes" : "0" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: (() => {
                  const timelineData = [{
                    year: "2014",
                    inc: incRecord.inc2014
                  }, {
                    year: "2015",
                    inc: incRecord.inc2015
                  }, {
                    year: "2016",
                    inc: incRecord.inc2016
                  }, {
                    year: "2017",
                    inc: incRecord.inc2017
                  }, {
                    year: "2018",
                    inc: incRecord.inc2018
                  }, {
                    year: "2019",
                    inc: incRecord.inc2019
                  }, {
                    year: "2020",
                    inc: incRecord.inc2020
                  }, {
                    year: "2021",
                    inc: incRecord.inc2021
                  }, {
                    year: "2022",
                    inc: incRecord.inc2022
                  }, {
                    year: "2023",
                    inc: incRecord.inc2023
                  }, {
                    year: "2024",
                    inc: incRecord.inc2024
                  }, {
                    year: "2025",
                    inc: incRecord.inc2025
                  }].filter((y) => y.inc && y.inc !== "0" && y.inc.trim() !== "").map((item, index, arr) => {
                    const isPromo = item.inc.includes("(P)");
                    const val = parseFloat(item.inc.replace("(P)", "").replace(/,/g, "")) || 0;
                    let rGross = incRecord.salaryJoining;
                    for (let i = 0; i <= index; i++) rGross += parseFloat(arr[i].inc.replace("(P)", "").replace(/,/g, "")) || 0;
                    return {
                      ...item,
                      isPromo,
                      val,
                      rGross
                    };
                  }).reverse();
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border-l-2 border-border/40 ml-4 space-y-8 pb-4", children: [
                    timelineData.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-[9px] top-1.5 size-4 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 bg-background rounded-full" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-4 shadow-sm relative -top-1.5 hover:border-emerald-500/30 transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-sm text-foreground", children: [
                              "Increment ",
                              item.year
                            ] }),
                            item.isPromo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider", children: "Promoted" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-emerald-600 font-mono font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded", children: [
                            "+৳",
                            item.val.toLocaleString("en-IN")
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs pt-3 border-t border-border/40", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold uppercase text-[10px] tracking-wider", children: "Running Gross Salary" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-black text-primary text-sm", children: [
                            "৳",
                            item.rGross.toLocaleString("en-IN")
                          ] })
                        ] })
                      ] })
                    ] }, item.year)),
                    (!incRecord.total || incRecord.total.startsWith("0")) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-6 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground italic", children: "No increments received yet." }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -left-[9px] top-1.5 size-4 rounded-full bg-primary ring-4 ring-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 bg-background rounded-full" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/40 rounded-xl p-4 relative -top-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm text-primary mb-3", children: "Joined Company" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs pt-3 border-t border-border/40", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold uppercase text-[10px] tracking-wider", children: "Joining Salary" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-black text-foreground text-sm", children: [
                            "৳",
                            incRecord.salaryJoining.toLocaleString("en-IN")
                          ] })
                        ] })
                      ] })
                    ] })
                  ] });
                })() })
              ] })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  EmployeeDetailPage as component
};
