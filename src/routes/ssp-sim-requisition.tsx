import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  ChevronRight,
  Smartphone,
  CheckCircle2,
  Paperclip,
  UploadCloud,
  FileText,
  X,
  UserCheck,
  Building2,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Signal,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-sim-requisition")({
  head: () => ({
    meta: [
      { title: "SIM Requisition Application — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Official Self-Service Portal to request corporate mobile SIM allocations, package upgrades, replacements, and data limit enhancements.",
      },
    ],
  }),
  component: SimRequisitionPage,
});

const inputClass =
  "w-full h-10 px-3.5 text-[13px] font-semibold text-slate-800 dark:text-slate-100 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-300/80 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 hover:border-slate-400 transition-all placeholder:text-slate-400";

const labelClass =
  "block text-[10.5px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5";

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelClass}>
          {label}
          {required && <span className="text-rose-500 ml-0.5 font-black">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const REQUEST_FOR_OPTIONS = [
  { value: "New SIM", label: "New SIM" },
  { value: "SIM Balance Limit", label: "SIM Balance Limit" },
  { value: "SIM Replacement", label: "SIM Replacement" },
];

const SECTION_OPTIONS = [
  { value: "Software Engineering & Solutions", label: "Software Engineering & Solutions" },
  { value: "IT Operations & Infrastructure", label: "IT Operations & Infrastructure" },
  { value: "Human Resources & Administration", label: "Human Resources & Administration" },
  { value: "Finance, Tax & Accounts", label: "Finance, Tax & Accounts" },
  { value: "Supply Chain & Procurement", label: "Supply Chain & Procurement" },
  { value: "Production & Quality Assurance", label: "Production & Quality Assurance" },
  { value: "Sales, Business Development & CRM", label: "Sales, Business Development & CRM" },
  { value: "Security, Facilities & Transport", label: "Security, Facilities & Transport" },
  { value: "Apparel Merchandising & Design", label: "Apparel Merchandising & Design" },
];

export interface SimRequisitionData {
  id: string;
  reqNum: string;
  reqDate: string;
  status: "Pending" | "Approved" | "Rejected";
  requestFor: string;
  simNumber?: string;
  existingLimit?: string;
  expectedLimit?: string;
  operator: string;
  justification: string;
  attachmentName?: string;
  attachmentSize?: string;
  onBehalf: boolean;
  section?: string;
  requisitionFor?: string;
  requesterName: string;
  requesterId: string;
  department: string;
  createdAt: string;
}

function SimRequisitionPage() {
  const navigate = useNavigate();

  // Primary form states
  const [requestFor, setRequestFor] = useState("New SIM");
  const [simNumber, setSimNumber] = useState("");
  const [existingLimit, setExistingLimit] = useState("");
  const [expectedLimit, setExpectedLimit] = useState("");
  const [justification, setJustification] = useState("");
  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);

  // On behalf states
  const [onBehalf, setOnBehalf] = useState(false);
  const [section, setSection] = useState("");
  const [requisitionFor, setRequisitionFor] = useState("");

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick file attachment mock handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;
      setAttachment({
        name: file.name,
        size: sizeStr,
      });
      toast.success(`Attached "${file.name}" (${sizeStr})`);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    toast.info("Attachment removed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestFor) {
      toast.error("Please select 'Request For' option.");
      return;
    }

    if (requestFor === "SIM Balance Limit") {
      if (!simNumber.trim()) {
        toast.error("Please enter the SIM Number.");
        return;
      }
      if (!existingLimit.trim()) {
        toast.error("Please enter the Existing Limit.");
        return;
      }
      if (!expectedLimit.trim()) {
        toast.error("Please enter the Expected Limit.");
        return;
      }
    }

    if (requestFor === "SIM Replacement") {
      if (!simNumber.trim()) {
        toast.error("Please enter the SIM Number.");
        return;
      }
    }

    if (!justification.trim()) {
      toast.error("Please provide a Justification for the SIM requisition.");
      return;
    }

    if (onBehalf) {
      if (!section) {
        toast.error("Please select a Section for On Behalf application.");
        return;
      }
      if (!requisitionFor.trim()) {
        toast.error("Please enter or select who this Requisition is For.");
        return;
      }
    }

    setIsSubmitting(true);

    // Generate unique requisition number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 10);
    const reqNumber = `SIM/2026/${randomSuffix}`;

    const newSimReq: SimRequisitionData = {
      id: reqNumber,
      reqNum: reqNumber,
      reqDate: formattedDate,
      status: "Pending",
      requestFor,
      simNumber: simNumber.trim() || undefined,
      existingLimit: existingLimit.trim() || undefined,
      expectedLimit: expectedLimit.trim() || undefined,
      operator: "",
      justification: justification.trim(),
      attachmentName: attachment?.name,
      attachmentSize: attachment?.size,
      onBehalf,
      section: onBehalf ? section : undefined,
      requisitionFor: onBehalf ? requisitionFor.trim() : "Tahmid Afsar (Self)",
      requesterName: "Tahmid Afsar",
      requesterId: "2023043910",
      department: onBehalf ? section || "Business Innovation" : "Business Innovation",
      createdAt: dateNow.toISOString(),
    };

    try {
      // 1. Save to SIM specific store
      const storedSimsRaw = localStorage.getItem("cripton_sim_requisitions");
      const storedSims: SimRequisitionData[] = storedSimsRaw ? JSON.parse(storedSimsRaw) : [];
      storedSims.unshift(newSimReq);
      localStorage.setItem("cripton_sim_requisitions", JSON.stringify(storedSims));

      // 2. Save to general My Requisitions unified store
      const unifiedRow = {
        id: newSimReq.reqNum,
        reqNum: newSimReq.reqNum,
        date: newSimReq.reqDate,
        status: "Pending" as const,
        doc: `SIM Requisition — ${newSimReq.requestFor}`,
        note: onBehalf
          ? `[On Behalf: ${newSimReq.requisitionFor}] ${newSimReq.justification}`
          : newSimReq.justification,
        type: "SIM",
        simData: newSimReq,
      };

      const storedUnifiedRaw = localStorage.getItem("cripton_my_requisitions_custom");
      const storedUnified = storedUnifiedRaw ? JSON.parse(storedUnifiedRaw) : [];
      storedUnified.unshift(unifiedRow);
      localStorage.setItem("cripton_my_requisitions_custom", JSON.stringify(storedUnified));

      toast.success(`SIM Requisition #${newSimReq.reqNum} submitted successfully!`);

      setTimeout(() => {
        setIsSubmitting(false);
        navigate({
          to: "/ssp-my-requisition",
        });
      }, 500);
    } catch (err) {
      console.error("Failed to save requisition:", err);
      toast.error("Failed to record requisition. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
          {/* Breadcrumb & Header Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">
                  SSP
                </Link>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">
                  New Requisition
                </Link>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  SIM Requisition
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-xs">
                  <Smartphone className="size-5" />
                </div>
                <span>SIM & Cellular Requisition</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ssp-my-requisition"
                className="h-9 px-4 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Clock className="size-3.5" />
                <span>My Requisitions</span>
              </Link>
              <div className="text-[10.5px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5">
                <Signal className="size-3.5" />
                <span>Corporate Cellular Portal</span>
              </div>
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6">
            {/* Form Column (8 cols) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 bg-card border border-border/80 rounded-2xl shadow-xs p-5 md:p-6 space-y-6 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                      Requisition Application Form
                    </h2>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Fields marked with <span className="text-rose-500">*</span> are mandatory
                  </span>
                </div>

                {/* Row 1: Request For */}
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Request For" required hint="Select specific cellular action">
                    <SearchableSelect
                      value={requestFor}
                      onChange={(val) => {
                        setRequestFor(val);
                        setSimNumber("");
                        setExistingLimit("");
                        setExpectedLimit("");
                      }}
                      options={REQUEST_FOR_OPTIONS}
                      placeholder="Select request category..."
                      className={inputClass}
                    />
                  </Field>
                </div>

                {/* Conditional Fields: SIM Balance Limit */}
                {requestFor === "SIM Balance Limit" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Field label="SIM Number" required hint="e.g. 01711000000">
                      <input
                        type="text"
                        value={simNumber}
                        onChange={(e) => setSimNumber(e.target.value)}
                        placeholder="Enter SIM Number"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Existing Limit" required hint="Current monthly limit">
                      <input
                        type="text"
                        value={existingLimit}
                        onChange={(e) => setExistingLimit(e.target.value)}
                        placeholder="e.g. 400 Taka"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Expected Limit" required hint="Requested monthly limit">
                      <input
                        type="text"
                        value={expectedLimit}
                        onChange={(e) => setExpectedLimit(e.target.value)}
                        placeholder="e.g. 800 Taka"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                )}

                {/* Conditional Fields: SIM Replacement */}
                {requestFor === "SIM Replacement" && (
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Field label="SIM Number" required hint="Number of faulty/lost SIM">
                      <input
                        type="text"
                        value={simNumber}
                        onChange={(e) => setSimNumber(e.target.value)}
                        placeholder="Enter SIM Number to replace"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                )}

                {/* Justification Textarea */}
                <Field label="Justification" required hint="Explain operational necessity">
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Provide a detailed explanation of why this corporate SIM requisition is required for official duties..."
                    className={`${inputClass} h-28 py-3 resize-none leading-relaxed`}
                  />
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1 px-1">
                    <span>Be descriptive to avoid approval delays.</span>
                    <span>{justification.length} characters</span>
                  </div>
                </Field>

                {/* Attachment Field */}
                <Field
                  label="Attachment (Optional / Supporting Docs)"
                  hint="PDF, JPG, PNG or DOCX up to 10MB"
                >
                  {!attachment ? (
                    <label className="border-2 border-dashed border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer group bg-muted/10">
                      <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <UploadCloud className="size-6" />
                      </div>
                      <span className="text-xs font-bold text-foreground mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Click to upload or drag & drop documents
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        Approval memos, FIR / lost police GD, bill copies, or department authorizations
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {attachment.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {attachment.size} &bull; Ready to submit
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1.5 hover:bg-rose-500/20 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </Field>

                {/* On Behalf Toggle & Conditional Fields */}
                <div className="border border-border/80 rounded-xl p-4 bg-muted/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={onBehalf}
                          onChange={(e) => setOnBehalf(e.target.checked)}
                        />
                        <div className="w-10 h-5.5 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-emerald-600 transition-all" />
                        <div className="absolute top-0.75 left-0.75 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                          On Behalf Application
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          Submit this SIM requisition on behalf of a team member or colleague
                        </span>
                      </div>
                    </label>

                    {onBehalf && (
                      <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 border-emerald-500/25">
                        Active Mode
                      </span>
                    )}
                  </div>

                  {/* 2 Fields: Section dropdown & Requisition For field input field */}
                  {onBehalf && (
                    <div className="pt-3 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Field label="Section" required hint="Beneficiary Section / Department">
                        <SearchableSelect
                          value={section}
                          onChange={setSection}
                          options={SECTION_OPTIONS}
                          placeholder="Select employee section..."
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Requisition For" required hint="Employee Name / ID / Designation">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={requisitionFor}
                            onChange={(e) => setRequisitionFor(e.target.value)}
                            placeholder="e.g. Md. Anik Islam (EMP-20230412)"
                            className={inputClass}
                          />
                        </div>
                      </Field>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                  <span>Subject to Departmental HOD and IT Administration approval</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestFor("New SIM");
                      setSimNumber("");
                      setExistingLimit("");
                      setExpectedLimit("");
                      setJustification("");
                      setAttachment(null);
                      setOnBehalf(false);
                      setSection("");
                      setRequisitionFor("");
                    }}
                    className="h-10 px-4 rounded-xl border border-border/80 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex-1 sm:flex-none cursor-pointer"
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Requisition"}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Sidebar Information / Live Preview Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Live Preview Card */}
              <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                <div className="border-b border-border/50 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-emerald-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-foreground">
                      Requisition Summary
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    Draft Preview
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-muted/30 p-3 rounded-xl space-y-2 border border-border/40">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-[10.5px]">Request Category:</span>
                      <span className="font-bold text-foreground text-right max-w-[160px] truncate">
                        {requestFor}
                      </span>
                    </div>

                    {simNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-[10.5px]">SIM Number:</span>
                        <span className="font-bold text-foreground font-mono">
                          {simNumber}
                        </span>
                      </div>
                    )}

                    {existingLimit && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-[10.5px]">Existing Limit:</span>
                        <span className="font-bold text-foreground font-mono">
                          {existingLimit}
                        </span>
                      </div>
                    )}

                    {expectedLimit && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-[10.5px]">Expected Limit:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {expectedLimit}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-[10.5px]">Beneficiary Mode:</span>
                      <span className="font-bold text-foreground">
                        {onBehalf ? "On Behalf" : "Direct Self"}
                      </span>
                    </div>
                    {onBehalf && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground text-[10.5px]">Target Section:</span>
                          <span className="font-bold text-foreground text-right max-w-[150px] truncate">
                            {section || "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground text-[10.5px]">Requisition For:</span>
                          <span className="font-bold text-foreground text-right max-w-[150px] truncate">
                            {requisitionFor || "Not specified"}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-[10.5px]">Attached File:</span>
                      <span className="font-medium text-foreground text-right max-w-[150px] truncate">
                        {attachment ? attachment.name : "None"}
                      </span>
                    </div>
                  </div>

                  {justification && (
                    <div className="bg-muted/20 p-3 rounded-xl border border-border/40 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Justification Preview:
                      </span>
                      <p className="text-[11px] text-foreground/80 line-clamp-3 italic leading-relaxed">
                        "{justification}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
