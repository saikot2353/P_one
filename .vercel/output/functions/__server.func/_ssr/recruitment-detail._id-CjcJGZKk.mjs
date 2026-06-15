import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as Route$1, S as Sidebar, T as Topbar } from "./router-RDWYDEFA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { aI as ArrowLeft, I as Info, aL as Phone, aV as Heart, aU as GraduationCap, t as Briefcase, at as MapPin, c as CircleX, b as CircleCheck } from "../_libs/lucide-react.mjs";
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
function SectionHeader({
  icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 border-b border-border/20 pb-3 mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase text-foreground/80 tracking-wider", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: subtitle })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  const map = {
    "Pending": "bg-purple-100 text-purple-800 border-purple-200",
    "Approved": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Rejected": "bg-rose-100 text-rose-800 border-rose-200"
  };
  let displayStatus = "Pending";
  if (status && status.includes("Approved")) {
    displayStatus = "Approved";
  } else if (status && status.includes("Rejected")) {
    displayStatus = "Rejected";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${map[displayStatus] || "bg-slate-50 text-slate-200 border-slate-200"}`, children: displayStatus });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border/10 text-xs hover:bg-muted/10 px-1.5 rounded transition-colors duration-150", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-right truncate max-w-[65%]", children: value || "—" })
  ] });
}
function RecruitmentDetailPage() {
  const router = useRouter();
  const {
    id
  } = Route$1.useParams();
  const [candidate, setCandidate] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((c) => c.empIdTemp === id);
        if (found) {
          setCandidate(found);
        }
      }
    }
  }, [id]);
  const handleApprove = () => {
    if (!candidate) return;
    const syncedKey = "recruitment_synced_employees";
    const savedSynced = localStorage.getItem(syncedKey);
    const parsedSynced = savedSynced ? JSON.parse(savedSynced) : [];
    const newEmployeeRecord = {
      id: candidate.empIdTemp,
      offcId: "—",
      name: candidate.nameEng,
      type: "Worker",
      dept: candidate.department || "RMG Operation",
      sect: "Sewing",
      title: candidate.designation || "Operator",
      unit: "Unit-6",
      line: "52",
      grade: "None",
      shift: "General Shift",
      shiftStart: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB"),
      joinDate: candidate.doj || (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB"),
      holiday: "—",
      blood: "—",
      basic: "9000.00",
      gross: "15000.00",
      email: candidate.personalEmail || "",
      phone: "—",
      officeMob: candidate.personalContact,
      personalContact: "—",
      gender: "Male",
      dob: candidate.dob ? new Date(candidate.dob).toLocaleDateString("en-GB") : "—",
      otStatus: "N/A",
      otRate: "0",
      status: "Working",
      empStatus: "Probation",
      confirmDate: "—",
      village: candidate.presentAddress || "—",
      acStatus: "Active"
    };
    localStorage.setItem(syncedKey, JSON.stringify([...parsedSynced, newEmployeeRecord]));
    const savedCandidates = localStorage.getItem("recruitment_candidates");
    if (savedCandidates) {
      const parsedCandidates = JSON.parse(savedCandidates);
      const updated = parsedCandidates.map((c) => {
        if (c.empIdTemp === id) {
          return {
            ...c,
            assessStatus: "HR Approved"
          };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    }
    toast.success(`Candidate ${id} approved successfully and moved to the Personnel database.`);
    router.navigate({
      to: "/recruitment-basic-list"
    });
  };
  const handleReject = () => {
    if (!candidate) return;
    const savedCandidates = localStorage.getItem("recruitment_candidates");
    if (savedCandidates) {
      const parsedCandidates = JSON.parse(savedCandidates);
      const updated = parsedCandidates.map((c) => {
        if (c.empIdTemp === id) {
          return {
            ...c,
            assessStatus: "HR Rejected"
          };
        }
        return c;
      });
      localStorage.setItem("recruitment_candidates", JSON.stringify(updated));
    }
    toast.error(`Candidate ${id} has been rejected.`);
    router.navigate({
      to: "/recruitment-basic-list"
    });
  };
  if (!candidate) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-semibold", children: "Loading applicant dossier..." })
        ] }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-4 overflow-y-auto h-full pb-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-3xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: candidate.photo || `https://images.unsplash.com/photo-${candidate.empIdTemp === "PAL000002" || candidate.empIdTemp === "PAL000004" || candidate.empIdTemp === "PAL000006" || candidate.empIdTemp === "PAL000008" || candidate.empIdTemp === "PAL000010" || candidate.empIdTemp === "PAL000012" || candidate.empIdTemp === "PAL000014" ? "1494790108377-be9c29b29330" : "1535713875002-d1d0cf377fde"}?auto=format&fit=crop&w=120&h=120&q=80`, alt: candidate.nameEng, className: "size-11 rounded-full border border-border/60 object-cover shadow-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2", children: [
                candidate.nameEng,
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: candidate.assessStatus })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground", children: [
                "ID: ",
                candidate.empIdTemp,
                " — ",
                candidate.designation
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/recruitment-basic-list", className: "h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-[11px] font-bold shadow-3xs flex items-center gap-1.5 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
            " Back to Queue"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" }), title: "Personal & Identity Dossier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Candidate Name (ENG)", value: candidate.nameEng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Candidate Name (BNG)", value: candidate.nameBng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Date of Birth (DOB)", value: candidate.dob }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Religion", value: candidate.religion }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Marital Status", value: candidate.maritalStatus }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "National ID (NID)", value: candidate.nidNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Birth Registration No", value: candidate.birthReg }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Father Name (ENG)", value: candidate.fatherNameEng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Father Name (BNG)", value: candidate.fatherNameBng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Mother Name (ENG)", value: candidate.motherNameEng }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Mother Name (BNG)", value: candidate.motherNameBng })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }), title: "Contact & Reachability Channels" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Personal Contact No", value: candidate.personalContact }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Personal Email Address", value: candidate.personalEmail }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Emergency Contact No", value: candidate.emergencyContact }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Emergency Contact Name", value: candidate.contactPerson }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Relationship", value: candidate.relationship })
              ] })
            ] }),
            candidate.nominee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" }), title: "Nominee Declaration Dossier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Nominee Full Name", value: candidate.nominee.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Relationship", value: candidate.nominee.relation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Nominee NID / Birth Reg", value: candidate.nominee.nidReg }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Nominee Contact Number", value: candidate.nominee.contact })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4" }), title: "Academic Qualifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/30 rounded-lg overflow-hidden mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs bg-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 bg-muted/20 text-[9px] uppercase font-bold text-muted-foreground/75", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5", children: "Exam Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5", children: "Institution" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5 text-center", children: "Year" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5 text-right", children: "Result" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/25", children: candidate.academics && candidate.academics.length > 0 ? candidate.academics.map((ac, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold text-foreground", children: ac.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-semibold text-muted-foreground", children: ac.institution }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center font-mono", children: ac.year }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-bold text-primary", children: ac.result })
                ] }, ac.id || idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "text-center py-3 italic text-muted-foreground", children: "No academic profiles declared." }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4" }), title: "Prior Job Experience Timeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/30 rounded-lg overflow-hidden mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs bg-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 bg-muted/20 text-[9px] uppercase font-bold text-muted-foreground/75", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5", children: "Company Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5", children: "Designation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5 text-center", children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-1.5 text-right", children: "Leaving Reason" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/25", children: candidate.experiences && candidate.experiences.length > 0 ? candidate.experiences.map((exp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-bold text-foreground", children: exp.company }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-semibold text-muted-foreground", children: exp.designation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-center font-mono whitespace-nowrap text-[10px]", children: [
                    exp.from,
                    " to ",
                    exp.to
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium text-muted-foreground italic truncate max-w-[150px]", children: exp.reason })
                ] }, exp.id || idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "text-center py-3 italic text-muted-foreground", children: "No experience history declared." }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border/60 p-4 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }), title: "Registered Address Coordinates" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-lg p-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold uppercase text-primary mb-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                    " Present Address"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 leading-normal font-medium", children: candidate.presentAddress || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-lg p-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold uppercase text-primary mb-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                    " Permanent Address"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 leading-normal font-medium", children: candidate.permanentAddress || "—" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 lg:left-64 right-0 bg-background/90 backdrop-blur-md border-t border-border/60 p-3 flex items-center justify-center z-30 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full px-4 md:px-6 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleReject, className: "flex-1 flex items-center justify-center gap-1.5 h-9 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-lg text-xs transition active:scale-[0.99]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }),
            " Reject Applicant"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleApprove, className: "flex-1 flex items-center justify-center gap-1.5 h-9 bg-primary text-primary-foreground hover:opacity-95 font-bold rounded-lg text-xs shadow-sm transition active:scale-[0.99]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
            " Approve & Onboard"
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  RecruitmentDetailPage as component
};
