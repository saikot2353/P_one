import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, X, am as Layers, U as User, o as SlidersVertical, aQ as ListFilter, S as Search, ax as FileSpreadsheet, P as Printer, b as CircleCheck, ae as Sparkles, Y as ChevronDown, af as Send, al as TrendingUp, aK as CircleAlert } from "../_libs/lucide-react.mjs";
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
const mockEmployees = [{
  id: "2022035599",
  name: "Tahmid Afsar Shapno",
  designation: "HR Director",
  department: "Core Development (HR)",
  currentSalary: 201600
}, {
  id: "2021032646",
  name: "Sadiqul Islam",
  designation: "Deputy Manager",
  department: "Core Sales",
  currentSalary: 104500
}, {
  id: "2023051028",
  name: "Dipon Saha",
  designation: "Manager",
  department: "Core Development (HR)",
  currentSalary: 129600
}, {
  id: "2022091485",
  name: "Tanzila Rahman",
  designation: "Senior Software Engineer",
  department: "Tech Core",
  currentSalary: 126500
}, {
  id: "2024018847",
  name: "Fahim Ahmed",
  designation: "UI/UX Designer",
  department: "Creative Design",
  currentSalary: 71500
}, {
  id: "2022119932",
  name: "Nabil Chowdhury",
  designation: "Sales Lead",
  department: "Core Sales",
  currentSalary: 90950
}];
const initialGadgetEmployees = [{
  id: "2021028542",
  name: "Zakir Hossain",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Implementation & Support (HR)",
  designation: "Executive",
  newDesignation: "Executive",
  joiningDate: "09/10/2021",
  shift: "Exe-Ptvl",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 18900,
  newBasic: 18900,
  basicDiff: 0,
  oldGross: 31500,
  newGross: 31500,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2021032646",
  name: "Sadiqul Islam",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Core Sales",
  designation: "Deputy Manager",
  newDesignation: "Deputy Manager",
  joiningDate: "22/12/2021",
  shift: "Exe-Ptvl",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 35400,
  newBasic: 35400,
  basicDiff: 0,
  oldGross: 59e3,
  newGross: 59e3,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2022035599",
  name: "Dipon Saha",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Core Development (HR)",
  designation: "Manager",
  newDesignation: "Manager",
  joiningDate: "07/05/2022",
  shift: "Exe-Ptvl",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 40200,
  newBasic: 40200,
  basicDiff: 0,
  oldGross: 67e3,
  newGross: 67e3,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2022041203",
  name: "Khairul Bashar Masum",
  type: "Office Executive",
  newType: "Office Executive",
  department: "HR Team",
  designation: "Asst. Manager",
  newDesignation: "Asst. Manager",
  joiningDate: "01/12/2022",
  shift: "Exe-Ptvl",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 27900,
  newBasic: 27900,
  basicDiff: 0,
  oldGross: 46500,
  newGross: 46500,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2023043021",
  name: "Easin Mia",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Admin",
  designation: "Receptionist",
  newDesignation: "Receptionist",
  joiningDate: "01/02/2023",
  shift: "Exe-Ptvl",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 11400,
  newBasic: 11400,
  basicDiff: 0,
  oldGross: 19e3,
  newGross: 19e3,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2023043909",
  name: "Md. Ashanur Kabir",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Digital Marketing",
  designation: "Manager",
  newDesignation: "Manager",
  joiningDate: "01/08/2023",
  shift: "General Shift",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 43800,
  newBasic: 43800,
  basicDiff: 0,
  oldGross: 73e3,
  newGross: 73e3,
  grossDiff: 0,
  incrementGross: 0
}, {
  id: "2023043910",
  name: "Tahmid Afsar",
  type: "Office Executive",
  newType: "Office Executive",
  department: "Project Resource & Strategy",
  designation: "Asst. Manager",
  newDesignation: "Asst. Manager",
  joiningDate: "01/08/2023",
  shift: "General Shift",
  status: "Working",
  grade: "None",
  newGrade: "None",
  unit: "PSL",
  oldBasic: 31200,
  newBasic: 31200,
  basicDiff: 0,
  oldGross: 52e3,
  newGross: 52e3,
  grossDiff: 0,
  incrementGross: 0
}];
function IncrementConfiguratorPage() {
  useRouter();
  const [activeTab, setActiveTab] = reactExports.useState("batch");
  const [toastMessage, setToastMessage] = reactExports.useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4e3);
  };
  const [basicRatio, setBasicRatio] = reactExports.useState(60);
  const [houseRentRatio, setHouseRentRatio] = reactExports.useState(50);
  const [medicalAllowance, setMedicalAllowance] = reactExports.useState(500);
  const [arrearThreshold, setArrearThreshold] = reactExports.useState(30);
  const [selectedEmpId, setSelectedEmpId] = reactExports.useState(mockEmployees[0].id);
  const [percent, setPercent] = reactExports.useState(10);
  const [amount, setAmount] = reactExports.useState(20160);
  const [remarks, setRemarks] = reactExports.useState("Outstanding performance appraisal clearance.");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const activeEmp = reactExports.useMemo(() => {
    return mockEmployees.find((e) => e.id === selectedEmpId) || mockEmployees[0];
  }, [selectedEmpId]);
  reactExports.useEffect(() => {
    const preselected = localStorage.getItem("preselected_increment_empid");
    if (preselected) {
      setSelectedEmpId(preselected);
      localStorage.removeItem("preselected_increment_empid");
      setActiveTab("single");
      showToast(`Appraisal dossier for employee loaded successfully.`);
    }
  }, []);
  reactExports.useEffect(() => {
    const computed = Math.round(activeEmp.currentSalary * percent / 100);
    setAmount(computed);
  }, [percent, selectedEmpId, activeEmp]);
  const handlePercentChange = (val) => {
    setPercent(val);
  };
  const handleAmountChange = (val) => {
    setAmount(val);
    if (activeEmp.currentSalary > 0) {
      const calculatedPercent = val / activeEmp.currentSalary * 100;
      setPercent(parseFloat(calculatedPercent.toFixed(1)));
    }
  };
  const handleSingleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Increment proposal of ৳${amount.toLocaleString()} submitted successfully for ${activeEmp.name}!`);
      const newRec = {
        action: "edit",
        id: (Math.random() * 100).toString(),
        empId: activeEmp.id,
        empName: activeEmp.name,
        department: activeEmp.department,
        section: "General Operations",
        designation: activeEmp.designation,
        joiningDate: "12/10/2023",
        prevGross: activeEmp.currentSalary.toFixed(2),
        lastIncDate: "—",
        lastIncAmount: "—",
        grossAfterInc: (activeEmp.currentSalary + amount).toFixed(2),
        year: "2025",
        month: "Dec",
        status: "Working",
        approved: false,
        hrEndorsed: false
      };
      const existing = localStorage.getItem("custom_increment_queue_records");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRec);
      localStorage.setItem("custom_increment_queue_records", JSON.stringify(list));
    }, 1200);
  };
  const [gadgetEmployees, setGadgetEmployees] = reactExports.useState(initialGadgetEmployees);
  const [selectedIds, setSelectedIds] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [gadgetYear, setGadgetYear] = reactExports.useState("2025");
  const [gadgetMonth, setGadgetMonth] = reactExports.useState("Dec");
  const [gadgetMode, setGadgetMode] = reactExports.useState("Regular");
  const [gadgetEmpType, setGadgetEmpType] = reactExports.useState("Office Executive");
  const [gadgetSection, setGadgetSection] = reactExports.useState("ALL");
  const [gadgetUnit, setGadgetUnit] = reactExports.useState("ALL");
  const [gadgetDesignation, setGadgetDesignation] = reactExports.useState("ALL");
  const [gadgetGrade, setGadgetGrade] = reactExports.useState("ALL");
  const [gadgetStatus, setGadgetStatus] = reactExports.useState("Working");
  const [gadgetJoiningYear, setGadgetJoiningYear] = reactExports.useState("2023");
  const [gadgetJoiningMonth, setGadgetJoiningMonth] = reactExports.useState("Dec");
  const handleInlineIncrementChange = (id, val) => {
    setGadgetEmployees((prev) => prev.map((emp) => {
      if (emp.id === id) {
        const newGross = emp.oldGross + val;
        const newBasic = Math.round(newGross * basicRatio / 100);
        return {
          ...emp,
          incrementGross: val,
          newGross,
          grossDiff: val,
          newBasic,
          basicDiff: newBasic - emp.oldBasic
        };
      }
      return emp;
    }));
  };
  const handleInlineSelectChange = (id, field, val) => {
    setGadgetEmployees((prev) => prev.map((emp) => {
      if (emp.id === id) {
        return {
          ...emp,
          [field]: val
        };
      }
      return emp;
    }));
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(gadgetEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectRow = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const handleBatchSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      showToast("Please check at least one employee row to process!");
      return;
    }
    const processed = gadgetEmployees.filter((emp) => selectedIds.includes(emp.id));
    const existing = localStorage.getItem("custom_increment_queue_records");
    const list = existing ? JSON.parse(existing) : [];
    processed.forEach((emp) => {
      const newRec = {
        action: "edit",
        id: emp.id,
        empId: emp.id,
        empName: emp.name,
        department: emp.department,
        section: gadgetSection === "ALL" ? "General Support" : gadgetSection,
        designation: emp.newDesignation,
        joiningDate: emp.joiningDate,
        prevGross: emp.oldGross.toFixed(2),
        lastIncDate: "01/01/2025",
        lastIncAmount: emp.incrementGross.toFixed(2),
        grossAfterInc: emp.newGross.toFixed(2),
        year: gadgetYear,
        month: gadgetMonth,
        status: emp.status,
        approved: false,
        hrEndorsed: false
      };
      const existingIdx = list.findIndex((x) => x.empId === emp.id);
      if (existingIdx > -1) {
        list[existingIdx] = newRec;
      } else {
        list.unshift(newRec);
      }
    });
    localStorage.setItem("custom_increment_queue_records", JSON.stringify(list));
    showToast(`Batch processing submitted successfully for ${processed.length} employees to the Approvals Console!`);
    setSelectedIds([]);
  };
  const handleSaveRules = (e) => {
    e.preventDefault();
    showToast("Statutory scales and allocation ratios updated successfully.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "Evaluation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Salary Increment Configurator" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-extrabold tracking-tight text-foreground", children: "Increment Configurator Workspace" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/70 rounded-xl px-3.5 py-1.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80", children: "Calculations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-extrabold text-foreground mt-0.5", children: "Automated" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-1.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-primary", children: "System Base" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-extrabold text-primary mt-0.5", children: "Gross Adjusted" })
            ] })
          ] })
        ] }),
        toastMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white border border-primary/30 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2 rounded-full bg-primary animate-ping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: toastMessage }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setToastMessage(null), className: "text-slate-400 hover:text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-1.5 shadow-2xs flex gap-1 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("batch"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "batch" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎛️ Increment Gadget Console" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("single"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "single" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👤 Single Propose" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("rules"), className: `flex-1 sm:flex-none h-10 px-6 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "rules" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/75 hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "size-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚙️ Ratios Allocation Rules" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
          activeTab === "batch" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary/10 via-primary/45 to-primary/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-foreground mb-4 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListFilter, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gadget Query & Parametric Filter Console" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Year (Gadget)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetYear, onChange: (e) => setGadgetYear(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", children: "2025" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", children: "2026" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Month (Gadget)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetMonth, onChange: (e) => setGadgetMonth(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Jan", children: "Jan" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "May", children: "May" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Gadget Mode" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetMode, onChange: (e) => setGadgetMode(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Regular", children: "Regular" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Special", children: "Special Mode" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Employee Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetEmpType, onChange: (e) => setGadgetEmpType(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Executive", children: "Office Executive" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Factory worker", children: "Factory staff" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Section" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetSection, onChange: (e) => setGadgetSection(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HR", children: "HR Team" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Creative", children: "Creative" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetUnit, onChange: (e) => setGadgetUnit(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PSL", children: "PSL Unit" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Designation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetDesignation, onChange: (e) => setGadgetDesignation(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Manager", children: "Manager" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Executive", children: "Executive" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Grade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetGrade, onChange: (e) => setGadgetGrade(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "ALL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "None", children: "None" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetStatus, onChange: (e) => setGadgetStatus(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Working", children: "Working" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Terminated", children: "Terminated" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Joining Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetJoiningYear, onChange: (e) => setGadgetJoiningYear(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2023", children: "2023" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2022", children: "2022" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase text-muted-foreground", children: "Joining Month" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gadgetJoiningMonth, onChange: (e) => setGadgetJoiningMonth(e.target.value), className: "w-full h-8.5 px-2.5 rounded-xl bg-muted border border-border/40 text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dec", children: "Dec" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Jan", children: "Jan" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => showToast("Search parameters locked. Showing matching ledger accounts."), className: "w-full h-8.5 bg-primary hover:opacity-95 text-primary-foreground font-extrabold text-[10px] rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5" }),
                  " Search Gadget"
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary", children: [
                    selectedIds.length,
                    " Checked"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-foreground", children: "Interactive Compensation Ledger Sheet" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Excel export initiated."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-extrabold text-muted-foreground transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-3.5" }),
                    " Excel"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => alert("Print document ready."), className: "h-8 px-3 rounded-lg border border-border/40 bg-card hover:bg-muted text-xs font-extrabold text-muted-foreground transition flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }),
                    " Print"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-xs whitespace-nowrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedIds.length === gadgetEmployees.length, onChange: handleSelectAll, className: "rounded border-border text-primary focus:ring-primary/20 size-4 cursor-pointer" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-3 text-center", children: "#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Emp ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Employee Type (New)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Department" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Designation (New)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Joining Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Shift" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Grade (New)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3", children: "Unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Old Basic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-primary", children: "New Basic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-primary", children: "Basic Diff" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Old Gross" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-emerald-600", children: "New Gross" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-emerald-600", children: "Gross Diff" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center bg-primary/5 border-x border-primary/20", children: "Increment Gross" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: gadgetEmployees.map((emp, index) => {
                  const isChecked = selectedIds.includes(emp.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `transition ${isChecked ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "hover:bg-muted/40"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isChecked, onChange: () => handleSelectRow(emp.id), className: "rounded border-border text-primary focus:ring-primary/20 size-4 cursor-pointer" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-center font-mono font-bold text-muted-foreground/60", children: index + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-black text-foreground", children: emp.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold text-foreground", children: emp.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: emp.newType, onChange: (e) => handleInlineSelectChange(emp.id, "newType", e.target.value), className: "h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Executive", children: "Office Executive" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Factory Worker", children: "Factory Worker" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-semibold", children: emp.department }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: emp.newDesignation, onChange: (e) => handleInlineSelectChange(emp.id, "newDesignation", e.target.value), className: "h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Executive", children: "Executive" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Deputy Manager", children: "Deputy Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Manager", children: "Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Asst. Manager", children: "Asst. Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Receptionist", children: "Receptionist" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Sr. Manager", children: "Sr. Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Sr. Executive", children: "Sr. Executive" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "QA Engineer", children: "QA Engineer" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-semibold text-muted-foreground/80", children: emp.joiningDate }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-semibold text-muted-foreground", children: emp.shift }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: emp.newGrade, onChange: (e) => handleInlineSelectChange(emp.id, "newGrade", e.target.value), className: "h-7 px-2 rounded-lg bg-muted border border-border/40 text-[10px] font-bold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "None", children: "None" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Grade-1", children: "Grade-1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Grade-2", children: "Grade-2" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-mono font-bold text-muted-foreground", children: emp.unit }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-semibold", children: [
                      "৳",
                      emp.oldBasic.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-black text-primary", children: [
                      "৳",
                      emp.newBasic.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-bold text-primary", children: [
                      "+৳",
                      emp.basicDiff.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-semibold", children: [
                      "৳",
                      emp.oldGross.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-black text-emerald-600", children: [
                      "৳",
                      emp.newGross.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono font-bold text-emerald-600", children: [
                      "+৳",
                      emp.grossDiff.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-center bg-primary/5 border-x border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "500", value: emp.incrementGross, onChange: (e) => handleInlineIncrementChange(emp.id, parseInt(e.target.value) || 0), className: "w-24 h-7 px-2.5 rounded-lg bg-card border border-primary/30 outline-none focus:border-primary text-center font-mono font-black text-xs text-primary" }) })
                  ] }, emp.id);
                }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBatchSubmit, disabled: selectedIds.length === 0, className: "h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:opacity-95 transition uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                " Submit Batch Gadget Increments"
              ] }) })
            ] })
          ] }),
          activeTab === "single" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSingleSubmit, className: "lg:col-span-7 bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Configure Single Appraised Adjustment" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground uppercase font-black", children: "Select Employee *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedEmpId, onChange: (e) => setSelectedEmpId(e.target.value), className: "w-full h-10 pl-3.5 pr-8 rounded-xl bg-muted border border-border/40 text-xs font-bold appearance-none cursor-pointer", disabled: isSubmitting, children: mockEmployees.map((emp) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: emp.id, children: [
                    emp.name,
                    " (",
                    emp.designation,
                    " — ",
                    emp.department,
                    ")"
                  ] }, emp.id)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground uppercase font-black", children: "Increment Percent (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.1", min: "0.1", max: "100", value: percent, onChange: (e) => handlePercentChange(parseFloat(e.target.value) || 0), className: "w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 outline-none focus:border-primary transition text-xs font-mono font-black text-foreground", disabled: isSubmitting })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground uppercase font-black", children: "Increment Amount (৳)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "1", value: amount, onChange: (e) => handleAmountChange(parseInt(e.target.value) || 0), className: "w-full h-10 px-3.5 rounded-xl bg-muted border border-border/40 outline-none focus:border-primary transition text-xs font-mono font-black text-foreground", disabled: isSubmitting })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground uppercase font-black", children: "Performance Justification *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, required: true, value: remarks, onChange: (e) => setRemarks(e.target.value), placeholder: "Add justifications note...", className: "w-full p-3.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none", disabled: isSubmitting })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: isSubmitting, className: "h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:shadow-sm hover:opacity-95 transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" }),
                " Submit Proposal"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs relative overflow-hidden bg-gradient-to-b from-card to-green-500/[0.01]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ledger Growth Summary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-3 rounded-xl border border-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground", children: "Current Gross" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black text-foreground font-mono mt-0.5", children: [
                      "৳",
                      activeEmp.currentSalary.toLocaleString("en-IN")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold uppercase tracking-wider text-emerald-600", children: "Adjustment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black text-emerald-600 font-mono mt-0.5", children: [
                      "+৳",
                      amount.toLocaleString("en-IN")
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/40 rounded-xl border border-border/40 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold uppercase tracking-wider text-primary", children: "New Gross" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base font-black text-primary font-mono mt-0.5", children: [
                      "৳",
                      (activeEmp.currentSalary + amount).toLocaleString("en-IN")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground", children: "Growth" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-black text-emerald-600 mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15", children: [
                      "+",
                      percent.toFixed(1),
                      "%"
                    ] })
                  ] })
                ] })
              ] })
            ] }) })
          ] }),
          activeTab === "rules" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveRules, className: "bg-card rounded-lg border border-border/80 p-6 shadow-xs space-y-6 animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "size-4.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Statutory Wage Allocation Rules" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-muted-foreground", children: "Basic Salary Ratio (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: basicRatio, onChange: (e) => setBasicRatio(parseInt(e.target.value) || 0), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-muted-foreground", children: "House Rent Allocation (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: houseRentRatio, onChange: (e) => setHouseRentRatio(parseInt(e.target.value) || 0), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-muted-foreground", children: "Medical standard flat (৳)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: medicalAllowance, onChange: (e) => setMedicalAllowance(parseInt(e.target.value) || 0), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-muted-foreground", children: "Arrear calculation threshold (days)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: arrearThreshold, onChange: (e) => setArrearThreshold(parseInt(e.target.value) || 0), className: "w-full h-10 px-3 rounded-xl bg-muted border border-border/40 text-xs font-bold font-mono" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground font-semibold leading-relaxed", children: "Scaling rules are applied instantly by the live calculation engine when proposing new salary packages. Changing ratios will not affect historical records, but will apply to all pending increment queues." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-10 px-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-extrabold text-xs rounded-xl shadow-xs hover:opacity-95 transition uppercase tracking-wider", children: "Save Allocations Rules" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  IncrementConfiguratorPage as component
};
