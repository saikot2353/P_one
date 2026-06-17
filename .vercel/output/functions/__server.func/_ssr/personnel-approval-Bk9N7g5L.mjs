import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { C as ChevronRight, aA as UserCheck, aH as ArrowRightLeft, S as Search, E as Eye, a5 as Check, X, b as CircleCheck, c as CircleX, d as FileText, N as ShieldAlert, ah as Award } from "../_libs/lucide-react.mjs";
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
const initialCandidates = [{
  id: "APP-20261109",
  name: "Tahmid Afsar Shapno",
  jobTitle: "Office Executive",
  department: "Business Innovation",
  joiningDate: "01/08/2023",
  grossSalary: 152e3,
  email: "tahmid.bd@pakizasoftware.com",
  phone: "01750021154",
  status: "Pending Approval"
}, {
  id: "APP-20260481",
  name: "Fahim Faisal",
  jobTitle: "Software Engineer",
  department: "Business Innovation",
  joiningDate: "15/05/2026",
  grossSalary: 85e3,
  email: "fahim@pakizasoftware.com",
  phone: "01827394852",
  status: "Pending Approval"
}, {
  id: "APP-20260273",
  name: "Nusrat Jahan",
  jobTitle: "HR Officer",
  department: "Operations & HR",
  joiningDate: "01/06/2026",
  grossSalary: 45e3,
  email: "nusrat@pakizasoftware.com",
  phone: "01928374650",
  status: "Draft/Review"
}];
const initialEmployees = [{
  empId: "2023043910",
  name: "Tahmid Afsar Shapno",
  jobTitle: "Asst. Manager",
  department: "Business Innovation",
  joiningDate: "01/08/2023",
  defaultHoliday: "Friday",
  bloodGroup: "AB (+ve)",
  basic: 91200,
  gross: 152e3,
  email: "tahmid.bd@pakizasoftware.com",
  phone: "01750021154",
  gender: "Male",
  dob: "12/07/1999",
  otStatus: "N/A",
  otRate: 0,
  workingStatus: "Working",
  employmentStatus: "Probation",
  perVil: "Bhola",
  acStatus: "Active",
  conversionStatus: "Pending"
}, {
  empId: "2024091802",
  name: "Md. Anik Islam",
  jobTitle: "Business Analyst",
  department: "Business Innovation",
  joiningDate: "01/06/2024",
  defaultHoliday: "Friday",
  bloodGroup: "O (+ve)",
  basic: 47400,
  gross: 79e3,
  email: "anik@pakizasoftware.com",
  phone: "01711223344",
  gender: "Male",
  dob: "25/08/1998",
  otStatus: "Active",
  otRate: 150,
  workingStatus: "Working",
  employmentStatus: "Permanent",
  confirmationDate: "01/09/2024",
  perVil: "Dhaka",
  acStatus: "Active",
  conversionStatus: "Approved"
}, {
  empId: "2025110293",
  name: "Riazul Islam",
  jobTitle: "HR Officer",
  department: "Operations & HR",
  joiningDate: "01/11/2025",
  defaultHoliday: "Friday",
  bloodGroup: "A (+ve)",
  basic: 27e3,
  gross: 45e3,
  email: "riazul@pakizasoftware.com",
  phone: "01899887766",
  gender: "Male",
  dob: "14/02/1996",
  otStatus: "N/A",
  otRate: 0,
  workingStatus: "Working",
  employmentStatus: "Probation",
  perVil: "Barishal",
  acStatus: "Active",
  conversionStatus: "Pending"
}];
function PersonnelApprovalPage() {
  const [activeTab, setActiveTab] = reactExports.useState("approval");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("pending");
  const [candidates, setCandidates] = reactExports.useState(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = reactExports.useState(null);
  const [candidateDetailsModal, setCandidateDetailsModal] = reactExports.useState(null);
  const [rejectCandidateModal, setRejectCandidateModal] = reactExports.useState(null);
  const [generatedEmpId, setGeneratedEmpId] = reactExports.useState("");
  const [joiningStatus, setJoiningStatus] = reactExports.useState("Probation");
  const [candidateRejectReason, setCandidateRejectReason] = reactExports.useState("Documents Incomplete");
  const [employees, setEmployees] = reactExports.useState(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = reactExports.useState(null);
  const [selectedApproveEmp, setSelectedApproveEmp] = reactExports.useState(null);
  const [selectedRejectEmp, setSelectedRejectEmp] = reactExports.useState(null);
  const [confirmDate, setConfirmDate] = reactExports.useState("01/11/2023");
  const [newEmploymentType, setNewEmploymentType] = reactExports.useState("Permanent");
  const [newWorkingStatus, setNewWorkingStatus] = reactExports.useState("Working");
  const [empStatusRejectReason, setEmpStatusRejectReason] = reactExports.useState("Performance threshold unmet");
  const stats = reactExports.useMemo(() => {
    const pendingApp = candidates.filter((c) => c.status !== "Approved" && c.status !== "Rejected").length;
    const pendingConversion = employees.filter((e) => e.conversionStatus === "Pending").length;
    return {
      pendingApp,
      pendingConversion
    };
  }, [candidates, employees]);
  const filteredCandidates = reactExports.useMemo(() => {
    return candidates.filter((c) => {
      if (filterStatus === "pending") {
        if (c.status !== "Pending Approval" && c.status !== "Draft/Review") return false;
      } else {
        if (c.status !== "Approved" && c.status !== "Rejected") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [candidates, searchQuery, filterStatus]);
  const filteredEmployees = reactExports.useMemo(() => {
    return employees.filter((e) => {
      if (filterStatus === "pending") {
        if (e.conversionStatus !== "Pending") return false;
      } else {
        if (e.conversionStatus !== "Approved" && e.conversionStatus !== "Rejected") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q);
      }
      return true;
    });
  }, [employees, searchQuery, filterStatus]);
  const handleOpenApproveModal = (candidate) => {
    setSelectedCandidate(candidate);
    setGeneratedEmpId(candidate.name.includes("Shapno") ? "2023043910" : `2026${String(Math.floor(1e3 + Math.random() * 9e3))}`);
    setJoiningStatus(candidate.name.includes("Shapno") ? "Permanent" : "Probation");
  };
  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    if (!generatedEmpId.trim()) {
      alert("Please specify a valid generated Employee ID!");
      return;
    }
    setCandidates((prev) => prev.map((c) => c.id === selectedCandidate.id ? {
      ...c,
      status: "Approved",
      approvedEmpId: generatedEmpId
    } : c));
    const newEmp = {
      empId: generatedEmpId,
      name: selectedCandidate.name,
      jobTitle: selectedCandidate.jobTitle,
      department: selectedCandidate.department,
      joiningDate: selectedCandidate.joiningDate,
      defaultHoliday: "Friday",
      bloodGroup: selectedCandidate.name.includes("Shapno") ? "AB (+ve)" : "O (+ve)",
      basic: selectedCandidate.grossSalary * 0.6,
      gross: selectedCandidate.grossSalary,
      email: selectedCandidate.email,
      phone: selectedCandidate.phone,
      gender: "Male",
      dob: "12/07/1999",
      otStatus: "N/A",
      otRate: 0,
      workingStatus: "Working",
      employmentStatus: joiningStatus,
      perVil: "Bhola",
      acStatus: "Active",
      conversionStatus: "Approved"
    };
    setEmployees((prev) => [newEmp, ...prev]);
    alert(`Candidate ${selectedCandidate.name} has been approved successfully! Assigned Employee ID: ${generatedEmpId}.`);
    setSelectedCandidate(null);
  };
  const handleConfirmRejectCandidate = (e) => {
    e.preventDefault();
    if (!rejectCandidateModal) return;
    setCandidates((prev) => prev.map((c) => c.id === rejectCandidateModal.id ? {
      ...c,
      status: "Rejected",
      rejectionReason: candidateRejectReason
    } : c));
    alert(`Candidate ${rejectCandidateModal.name} joining application has been Rejected. Reason: ${candidateRejectReason}.`);
    setRejectCandidateModal(null);
  };
  const handleOpenApproveConversion = (emp) => {
    setSelectedApproveEmp(emp);
    if (emp.name.includes("Shapno")) {
      setConfirmDate("01/11/2023");
    } else {
      setConfirmDate("17/05/2026");
    }
  };
  const handleConfirmConversion = (e) => {
    e.preventDefault();
    if (!selectedApproveEmp) return;
    setEmployees((prev) => prev.map((e2) => {
      if (e2.empId === selectedApproveEmp.empId) {
        return {
          ...e2,
          employmentStatus: "Permanent",
          confirmationDate: confirmDate,
          conversionStatus: "Approved"
        };
      }
      return e2;
    }));
    alert(`Conversion to Permanent type approved for employee ${selectedApproveEmp.name}. Effective Confirmation Date: ${confirmDate}.`);
    setSelectedApproveEmp(null);
  };
  const handleConfirmDeclineConversion = (e) => {
    e.preventDefault();
    if (!selectedRejectEmp) return;
    setEmployees((prev) => prev.map((e2) => {
      if (e2.empId === selectedRejectEmp.empId) {
        return {
          ...e2,
          conversionStatus: "Rejected",
          conversionNotes: empStatusRejectReason
        };
      }
      return e2;
    }));
    alert(`Conversion request for ${selectedRejectEmp.name} declined. Reason: ${empStatusRejectReason}. Employee will remain in probationary state.`);
    setSelectedRejectEmp(null);
  };
  const handleOpenStatusModal = (emp) => {
    setSelectedEmployee(emp);
    setNewEmploymentType(emp.employmentStatus);
    setNewWorkingStatus(emp.workingStatus);
  };
  const handleConfirmStatusChange = (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setEmployees((prev) => prev.map((e2) => {
      if (e2.empId === selectedEmployee.empId) {
        return {
          ...e2,
          employmentStatus: newEmploymentType,
          workingStatus: newWorkingStatus,
          confirmationDate: newEmploymentType === "Permanent" ? confirmDate : void 0
        };
      }
      return e2;
    }));
    alert(`Employment status manually updated for ${selectedEmployee.name}.`);
    setSelectedEmployee(null);
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/75", children: "Personnel Info" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Approval Portal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-5.5 text-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Personnel Approval Portal" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/15 px-3 py-1.5 rounded-full select-none", children: "HR Approvals & Type Conversions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-border/50 gap-8 select-none print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveTab("approval");
            setSearchQuery("");
            setFilterStatus("pending");
          }, className: `pb-4 text-xs font-black uppercase tracking-widest cursor-pointer relative transition duration-150 flex items-center gap-2.5 ${activeTab === "approval" ? "text-primary font-black" : "text-muted-foreground/70 hover:text-foreground font-extrabold"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Employee Approval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-all ${activeTab === "approval" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground/80"}`, children: stats.pendingApp }),
            activeTab === "approval" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-200" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setActiveTab("status");
            setSearchQuery("");
            setFilterStatus("pending");
          }, className: `pb-4 text-xs font-black uppercase tracking-widest cursor-pointer relative transition duration-150 flex items-center gap-2.5 ${activeTab === "status" ? "text-primary font-black" : "text-muted-foreground/70 hover:text-foreground font-extrabold"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Change Employment Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-all ${activeTab === "status" ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground/80"}`, children: stats.pendingConversion }),
            activeTab === "status" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-200" })
          ] })
        ] }),
        activeTab === "approval" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] font-black text-foreground uppercase tracking-widest block", children: "Awaiting Hires" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted/80 p-0.5 rounded-lg border border-border/40 select-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("pending"), className: `px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "pending" ? "bg-card text-primary shadow-xs border border-border/40" : "text-muted-foreground hover:text-foreground"}`, children: [
                  "Pending (",
                  candidates.filter((c) => c.status !== "Approved" && c.status !== "Rejected").length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("approved"), className: `px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "approved" ? "bg-card text-primary shadow-xs border border-border/40" : "text-muted-foreground hover:text-foreground"}`, children: [
                  "Approved (",
                  candidates.filter((c) => c.status === "Approved" || c.status === "Rejected").length,
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search applicant name, role...", className: "w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-32 border-r border-border/30", children: "Applicant ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 border-r border-border/30", children: "Candidate Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-40 border-r border-border/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-40 border-r border-border/30", children: "Proposed Job Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Joining Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-right w-32 border-r border-border/30", children: "Base Gross Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-[250px]", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30 font-sans text-xs", children: [
              filteredCandidates.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-bold text-foreground/70 border-r border-border/20", children: row.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-black text-foreground border-r border-border/20", children: row.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-bold text-foreground/80 border-r border-border/20", children: row.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-muted-foreground border-r border-border/20", children: row.jobTitle }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-center text-muted-foreground border-r border-border/20", children: row.joiningDate }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-right font-black text-primary border-r border-border/20", children: [
                  row.grossSalary.toLocaleString("en-US", {
                    minimumFractionDigits: 2
                  }),
                  " BDT"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9px] ${row.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : row.status === "Rejected" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : row.status === "Draft/Review" ? "bg-slate-500/10 text-slate-500 border border-slate-500/20" : "bg-blue-500/10 text-[#1e88e5] border border-[#1e88e5]/20 animate-pulse"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.status }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-center flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCandidateDetailsModal(row), className: "h-7 px-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-primary/5", title: "View Credentials", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Details" })
                  ] }),
                  row.status !== "Approved" && row.status !== "Rejected" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleOpenApproveModal(row), className: "h-7 px-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-emerald-500/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Approve" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRejectCandidateModal(row), className: "h-7 px-2.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-rose-500/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reject" })
                    ] })
                  ] }) : row.status === "Approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                    " Hired (ID: ",
                    row.approvedEmpId,
                    ")"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-rose-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
                    " Rejected"
                  ] })
                ] })
              ] }, row.id)),
              filteredCandidates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-16 text-center text-muted-foreground font-semibold", children: "No candidates found matching filter constraints." }) })
            ] })
          ] }) })
        ] }),
        activeTab === "status" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] font-black text-foreground uppercase tracking-widest block", children: "Conversions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted/80 p-0.5 rounded-lg border border-border/40 select-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("pending"), className: `px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "pending" ? "bg-card text-primary shadow-xs border border-border/40" : "text-muted-foreground hover:text-foreground"}`, children: [
                  "Pending (",
                  employees.filter((e) => e.conversionStatus === "Pending").length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterStatus("approved"), className: `px-3 py-1.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition duration-150 cursor-pointer ${filterStatus === "approved" ? "bg-card text-primary shadow-xs border border-border/40" : "text-muted-foreground hover:text-foreground"}`, children: [
                  "Approved (",
                  employees.filter((e) => e.conversionStatus === "Approved" || e.conversionStatus === "Rejected").length,
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search employee ID, name, role...", className: "w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs transition duration-200" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-border/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11px] text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-28 border-r border-border/30", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-48 border-r border-border/30", children: "Employee Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-40 border-r border-border/30", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold w-40 border-r border-border/30", children: "Job Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-32 border-r border-border/30", children: "Current Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Confirmation Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-28 border-r border-border/30", children: "Working Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-extrabold text-center w-[250px]", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/30 font-sans text-xs", children: [
              filteredEmployees.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-bold text-foreground border-r border-border/20", children: row.empId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-black text-foreground border-r border-border/20", children: row.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-bold text-foreground/80 border-r border-border/20", children: row.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-muted-foreground border-r border-border/20", children: row.jobTitle }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center font-bold px-2 py-0.5 rounded text-[9.5px] ${row.employmentStatus === "Permanent" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25" : "bg-amber-500/10 text-amber-600 border border-amber-500/25 font-extrabold animate-pulse"}`, children: row.employmentStatus }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-center text-foreground/70 border-r border-border/20", children: row.confirmationDate || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 italic", children: "Awaiting" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[9px] ${row.workingStatus === "Working" ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15" : "bg-rose-500/5 text-rose-500 border border-rose-500/15"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.workingStatus }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-center flex items-center justify-center gap-2", children: [
                  row.conversionStatus === "Pending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleOpenApproveConversion(row), className: "h-7 px-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-emerald-500/5", title: "Approve Promotion to Permanent Status", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Approve" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedRejectEmp(row), className: "h-7 px-2.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-rose-500/5", title: "Decline Conversion Request", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reject" })
                    ] })
                  ] }) : row.conversionStatus === "Approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                    " Confirmed Permanent"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-rose-500 font-extrabold flex items-center gap-1 select-none shrink-0 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20", title: `Reason: ${row.conversionNotes}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
                    " Conversion Declined"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleOpenStatusModal(row), className: "h-7 px-2 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 border border-slate-500/15 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-150 shrink-0 select-none cursor-pointer shadow-2xs shadow-slate-500/5", title: "Admin Override Manual Status Changes", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "size-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Edit" })
                  ] })
                ] })
              ] }, row.empId)),
              filteredEmployees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-16 text-center text-muted-foreground font-semibold", children: "No records found matching filter constraints." }) })
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    candidateDetailsModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-lg rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCandidateDetailsModal(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Verify Applicant Credentials" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/30 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Candidate Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-foreground", children: candidateDetailsModal.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Applicant ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-muted-foreground", children: candidateDetailsModal.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Proposed Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: candidateDetailsModal.jobTitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: candidateDetailsModal.department })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Contact Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: candidateDetailsModal.phone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-extrabold text-muted-foreground uppercase block", children: "Contact Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: candidateDetailsModal.email })
          ] })
        ] }),
        candidateDetailsModal.rejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-rose-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold block text-[10px] uppercase", children: "Rejection Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-xs block mt-0.5", children: candidateDetailsModal.rejectionReason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#1e88e5]/5 border border-[#1e88e5]/20 p-4 rounded-xl flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-primary uppercase block", children: "Appraised Base Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-black font-mono text-[#1e88e5]", children: [
              candidateDetailsModal.grossSalary.toLocaleString("en-US", {
                minimumFractionDigits: 2
              }),
              " BDT"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
            "Joining Date: ",
            candidateDetailsModal.joiningDate
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCandidateDetailsModal(null), className: "h-9 px-5 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Verification OK" }) })
      ] })
    ] }) }),
    selectedCandidate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCandidate(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Confirm Hiring & Employee ID" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirmApproval, className: "space-y-4 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-3 rounded-xl border border-border/40 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-black text-muted-foreground uppercase block", children: "Verifying Candidate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black text-foreground", children: [
            selectedCandidate.name,
            " — ",
            selectedCandidate.jobTitle
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Assign System Employee ID *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: generatedEmpId, onChange: (e) => setGeneratedEmpId(e.target.value), placeholder: "e.g. 2023043910", className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] text-muted-foreground block opacity-75 font-medium leading-tight", children: "Auto-populated based on corporate system registry structure. Specify exactly if needed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Hiring Appointment Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: joiningStatus, onChange: (e) => setJoiningStatus(e.target.value), className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Probation", children: "Probationary Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Permanent", children: "Permanent Status Activation" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedCandidate(null), className: "h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Confirm Hire & Activate" })
        ] })
      ] })
    ] }) }),
    rejectCandidateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRejectCandidateModal(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-rose-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5 text-rose-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Decline Joining Application" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirmRejectCandidate, className: "space-y-4 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-500/5 p-3 rounded-xl border border-rose-500/20 space-y-1 text-rose-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-black uppercase block text-rose-600", children: "Applicant Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black block", children: [
            rejectCandidateModal.name,
            " — ",
            rejectCandidateModal.jobTitle
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Specify Reason for Rejection *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: candidateRejectReason, onChange: (e) => setCandidateRejectReason(e.target.value), className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Documents Incomplete", children: "Verification Documents Incomplete" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Failed Baseline Review", children: "Failed Background / Reference checks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Failed Screening Panel", children: "Failed Final technical board reviews" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Budget Constraint", children: "Budget / Allocation scale constraints" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRejectCandidateModal(null), className: "h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Confirm Reject" })
        ] })
      ] })
    ] }) }),
    selectedApproveEmp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedApproveEmp(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-emerald-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5 text-emerald-600 animate-bounce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Confirm Status Conversion" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirmConversion, className: "space-y-4 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-800 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-black uppercase block text-emerald-600", children: "Promoting Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black block", children: [
            selectedApproveEmp.name,
            " (",
            selectedApproveEmp.empId,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] block font-bold leading-tight mt-0.5", children: [
            "Proposed status: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline font-black", children: "PERMANENT TYPE" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Confirmation Effective Date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: confirmDate, onChange: (e) => setConfirmDate(e.target.value), placeholder: "DD/MM/YYYY", className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] text-muted-foreground block opacity-75 font-medium leading-tight", children: "For Shapno, this confirms permanent status effective: 01/11/2023." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedApproveEmp(null), className: "h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Confirm Promotion" })
        ] })
      ] })
    ] }) }),
    selectedRejectEmp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedRejectEmp(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-rose-600 flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5 text-rose-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Decline Conversion Request" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirmDeclineConversion, className: "space-y-4 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/20 text-rose-800 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-black uppercase block text-rose-600", children: "Employee Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black block", children: [
            selectedRejectEmp.name,
            " (",
            selectedRejectEmp.empId,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] block font-bold leading-tight mt-0.5", children: "Conversion category request to permanent type will be declined." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Decline Justification Notes *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: empStatusRejectReason, onChange: (e) => setEmpStatusRejectReason(e.target.value), className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Performance threshold unmet", children: "KPI performance score criteria below threshold (75 points)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Audit discrepancy", children: "Internal HR compliance audit discrepancy pending resolution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Probation period extended", children: "Extend standard probationary period by 3 additional months" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedRejectEmp(null), className: "h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider", children: "Confirm Decline" })
        ] })
      ] })
    ] }) }),
    selectedEmployee && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card w-full max-w-md rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedEmployee(null), className: "absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "size-5 text-[#1e88e5]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Admin Override Manual Status Changer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConfirmStatusChange, className: "space-y-4 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 p-3.5 rounded-xl border border-border/40 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-black text-[#1e88e5] uppercase block", children: "Selected Employee Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black text-foreground block", children: [
            selectedEmployee.name,
            " (",
            selectedEmployee.empId,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground block font-bold leading-tight mt-0.5", children: [
            selectedEmployee.jobTitle,
            " — ",
            selectedEmployee.department
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employment Status Type *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newEmploymentType, onChange: (e) => setNewEmploymentType(e.target.value), className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Probation", children: "Probationary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Permanent", children: "Permanent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Contractual", children: "Contractual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Temporary", children: "Temporary" })
          ] })
        ] }),
        newEmploymentType === "Permanent" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Employment Confirmation Date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: confirmDate, onChange: (e) => setConfirmDate(e.target.value), placeholder: "DD/MM/YYYY", className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold outline-none focus:border-primary focus:bg-card transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Working Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newWorkingStatus, onChange: (e) => setNewWorkingStatus(e.target.value), className: "w-full h-10 px-3.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Working", children: "Working / Active Duty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Suspended", children: "Suspended" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Terminated", children: "Terminated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resigned", children: "Resigned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "On Leave", children: "On Leave" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-3 border-t border-border/30 mt-5 font-sans", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedEmployee(null), className: "h-9.5 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "h-9.5 px-6 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg transition uppercase tracking-wider shadow-sm", children: "Save Override Changes" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PersonnelApprovalPage as component
};
