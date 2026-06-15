import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChevronRight, Settings2, Hash, CheckSquare, Timer, Users, Info, Save, RotateCcw, Building2, Sliders } from "lucide-react";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-basic-setup")({
  component: RecruitmentBasicSetup,
});

function RecruitmentBasicSetup() {
  const [basicFormApplicable, setBasicFormApplicable] = useState("Yes");
  const [assessmentApplicable, setAssessmentApplicable] = useState("Yes");
  const [allowance, setAllowance] = useState("15");
  const [tempIdBasedOn, setTempIdBasedOn] = useState("Organization Short Name");
  const [tempIdDigit, setTempIdDigit] = useState("00000");
  const [tempIdStartingDigit, setTempIdStartingDigit] = useState("1");
  const [empType, setEmpType] = useState<string[]>(["Worker"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { initializeRecruitmentMockData(); }, []);

  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isTempIdVisible = basicFormApplicable === "Yes";

  const handleToggleEmpType = (type: string) => {
    if (empType.includes(type)) {
      setEmpType(empType.filter(t => t !== type));
    } else {
      setEmpType([...empType, type]);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">

          {/* Page Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>IE Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Organization Setting</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Building2 className="size-5.5 text-primary animate-pulse" />
                Organization Recruitment Configuration
              </h1>
            </div>
            {saved && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-2 text-sm font-bold animate-pulse">
                <CheckSquare className="size-4" /> Settings updated successfully!
              </div>
            )}
          </div>

          {/* Grid Layout for configuration groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Panel 1: Applicability & Operations Rules */}
            <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                <Sliders className="size-4 text-primary" />
                <h2 className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest">Workflow Applicability</h2>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Rule A: Basic Form is Applicable */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-foreground uppercase tracking-wider">Basic Form Applicability</label>
                    <span className="text-[10px] text-muted-foreground">Controls mandatory fields</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Yes", "No"].map(v => (
                      <button
                        key={v}
                        onClick={() => setBasicFormApplicable(v)}
                        className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all duration-200
                          ${basicFormApplicable === v
                            ? "bg-primary/10 border-primary text-primary shadow-2xs"
                            : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
                      >
                        <span className={`size-3 rounded-full border flex items-center justify-center ${basicFormApplicable === v ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                          {basicFormApplicable === v && <span className="size-1 bg-background rounded-full" />}
                        </span>
                        {v} Form
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rule B: Assessment is Applicable */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-foreground uppercase tracking-wider">Assessment Requirements</label>
                    <span className="text-[10px] text-muted-foreground">IE & HR evaluation steps</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Yes", "No"].map(v => (
                      <button
                        key={v}
                        onClick={() => setAssessmentApplicable(v)}
                        className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all duration-200
                          ${assessmentApplicable === v
                            ? v === "No"
                              ? "bg-amber-500/10 border-amber-500/35 text-amber-600 dark:text-amber-400 shadow-2xs"
                              : "bg-primary/10 border-primary text-primary shadow-2xs"
                            : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
                      >
                        <span className={`size-3 rounded-full border flex items-center justify-center ${assessmentApplicable === v ? "border-current bg-current" : "border-muted-foreground/30"}`}>
                          {assessmentApplicable === v && <span className="size-1 bg-card rounded-full" />}
                        </span>
                        {v === "No" ? "Skip Assessment" : "Perform Assessment"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rule C: Cycle Time Allowance */}
                <div className="space-y-2.5 pt-2 border-t border-border/40">
                  <label className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="size-4 text-primary" /> Cycle Time Allowance (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={allowance}
                      onChange={e => setAllowance(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm font-bold text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Target Employee Types & Temp ID */}
            <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                <Users className="size-4 text-primary" />
                <h2 className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest">Scope & Temp ID Config</h2>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Employee Types selection (modern checkbox pills) */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-foreground uppercase tracking-wider">Applicable Employee Types</label>
                  <div className="flex flex-wrap gap-2.5">
                    {["Worker", "Staff", "Executive"].map(type => {
                      const isSelected = empType.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleToggleEmpType(type)}
                          className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200
                            ${isSelected
                              ? "bg-primary/10 border-primary text-primary shadow-2xs"
                              : "border-border/80 hover:border-primary/50 bg-background text-muted-foreground hover:text-foreground"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-primary rounded cursor-pointer size-3.5"
                          />
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Temp ID Configuration */}
                <div className={`space-y-4 pt-4 border-t border-border/40 transition-all duration-300 ${isTempIdVisible ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <div className="flex items-center gap-2">
                    <Hash className="size-4 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Temp ID Generation Rules</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Base Prefix Field</label>
                    <select
                      value={tempIdBasedOn}
                      onChange={e => setTempIdBasedOn(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                    >
                      <option value="Dept-Code">Department Code prefix</option>
                      <option value="Short Name">Short Name prefix</option>
                      <option value="Organization Short Name">Organization Short Name (PAL)</option>
                      <option value="None">No Prefix (Numbers Only)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Zero Padding Pattern</label>
                      <input
                        type="text"
                        value={tempIdDigit}
                        onChange={e => setTempIdDigit(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="e.g. 00000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Starting Digit</label>
                      <input
                        type="number"
                        value={tempIdStartingDigit}
                        onChange={e => setTempIdStartingDigit(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Live Formula Preview Box */}
                  <div className="flex items-center gap-3 bg-muted/20 rounded-xl p-4 border border-border/50">
                    <Info className="size-4 text-primary shrink-0 animate-bounce" />
                    <div className="text-[11px] text-muted-foreground">
                      Real-time Generated Temp ID: <strong className="font-mono text-foreground font-black text-xs ml-1 bg-background px-2 py-0.5 border border-border/50 rounded-md">
                        {tempIdBasedOn === "None" ? "" : (tempIdBasedOn === "Organization Short Name" ? "PAL" : tempIdBasedOn.slice(0, 3).toUpperCase())}
                        {tempIdStartingDigit.padStart(tempIdDigit.length, "0")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Form Action Controls Footer */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground font-semibold">
              Changes applied here will affect the recruitment module and basic registration forms.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBasicFormApplicable("Yes");
                  setAssessmentApplicable("Yes");
                  setAllowance("15");
                  setTempIdBasedOn("Organization Short Name");
                  setTempIdDigit("00000");
                  setTempIdStartingDigit("1");
                  setEmpType(["Worker"]);
                }}
                className="h-10 px-4.5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="size-3.5" /> Restore Default Settings
              </button>
              <button
                onClick={handleSubmit}
                className="h-10 px-8 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md hover:shadow-lg hover:bg-primary/95 transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <Save className="size-4" /> Save Configuration
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default RecruitmentBasicSetup;
