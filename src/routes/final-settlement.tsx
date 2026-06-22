import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, FileText, Plus, Trash2, X, ChevronDown,
  Calculator, RefreshCw, Send, Edit, Eye, Printer
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/final-settlement")({
  head: () => ({
    meta: [
      { title: "Final Settlement — CRIPTON" },
      { name: "description", content: "Process and manage employee final settlements." },
    ],
  }),
  component: FinalSettlementPage,
});

interface SettlementRecord {
  id: string; empId: string; name: string; department: string;
  designation: string; joinDate: string; resignDate: string;
  settleDate: string; settleType: string; settleAmt: number;
}
interface DynamicRow { for: string; amount: string; }

const mockData: SettlementRecord[] = [
  { id: "1", empId: "2022041203", name: "Khairul Bashar Masum", department: "Implementation & Business Analysis", designation: "Assistant Manager", joinDate: "01/12/2022", resignDate: "28/05/2026", settleDate: "15/06/2026", settleType: "Resigned", settleAmt: 103147.00 },
  { id: "2", empId: "2023044865", name: "Md. Nizam Uddin Shamrat", department: "Business Innovation", designation: "Asst. Manager", joinDate: "17/09/2023", resignDate: "17/03/2026", settleDate: "", settleType: "Resigned", settleAmt: -18179.00 },
];

const settlementTypes = ["Resigned", "Retired", "Terminated", "Contract End", "Death", "Absconding"];
const elYears = ["2022", "2023", "2024", "2025", "2026"];
const elMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Reusable small components ────────────────────────────────────────────────

function Select({ value, onChange, children, className = "" }: any) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange}
        className={`w-full text-xs border border-border bg-background rounded px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 ${className}`}>
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-2 size-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function Input({ value, onChange, placeholder = "", type = "text", readOnly = false, className = "" }: any) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      className={`w-full text-xs border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40 ${readOnly ? "bg-muted/40 text-foreground" : "bg-background"} ${className}`} />
  );
}

// Left side: label + colon + readonly value
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center min-h-[28px] border-b border-border/30 last:border-0">
      <span className="text-[11px] text-muted-foreground w-32 shrink-0 pr-2">{label}</span>
      <span className="text-[11px] text-muted-foreground mr-2">:</span>
      <span className="text-[11px] font-medium text-foreground">{value || ""}</span>
    </div>
  );
}

// Right side: two-column calculation row
function CalcRow({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 border-b border-border/25 last:border-0">
      <div className="py-1.5">{left}</div>
      <div className="py-1.5 border-l border-border/25 pl-3">{right}</div>
    </div>
  );
}

// Right side individual field
function CalcField({ label, value, onChange, readOnly = false }: { label: string; value?: string; onChange?: any; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-28 shrink-0">{label}</span>
      {onChange ? (
        <Input value={value} onChange={onChange} readOnly={readOnly}
          className="flex-1 h-6 py-0.5 text-[11px] font-mono" />
      ) : (
        <span className="text-[11px] font-bold text-foreground font-mono">{value || ""}</span>
      )}
    </div>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-border/60">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded border border-border/40 overflow-hidden bg-card/50">
      <div className="bg-muted/30 px-3 py-1.5 border-b border-border/40">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}

function SectionToggle({ label = "Include" }: { label?: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" defaultChecked className="accent-primary size-3" />
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </label>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

function FinalSettlementPage() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [records] = useState<SettlementRecord[]>(mockData);

  // ── Core fields ──
  const [mode, setMode] = useState("With Salary");
  const [employeeId, setEmployeeId] = useState("");
  const [empLoaded, setEmpLoaded] = useState(false);

  // Settlement Info
  const [settlementType, setSettlementType] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [resignApplyDate, setResignApplyDate] = useState("");
  const [resignDate, setResignDate] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [deductionType, setDeductionType] = useState<"yes" | "no">("no");

  // Calculation fields (editable)
  const [noticePeriod, setNoticePeriod] = useState(""); const [noticeShortage, setNoticeShortage] = useState("");
  const [workingDays, setWorkingDays] = useState("");   const [present, setPresent] = useState("");
  const [leave, setLeave] = useState("");               const [holiday, setHoliday] = useState("");
  const [absentDays, setAbsentDays] = useState("");     const [absentDeduction, setAbsentDeduction] = useState("");
  const [pfDeduction, setPfDeduction] = useState("");   const [taxDeduction, setTaxDeduction] = useState("");
  const [advanceDeduction, setAdvanceDeduction] = useState(""); const [loanDeduction, setLoanDeduction] = useState("");
  const [lunchDeduction, setLunchDeduction] = useState(""); const [othersDeduction, setOthersDeduction] = useState("");
  const [revStamp, setRevStamp] = useState("");         const [paySalary, setPaySalary] = useState("");
  const [wagelyAdvance, setWagelyAdvance] = useState(""); const [otRate, setOtRate] = useState("");
  const [otPayment, setOtPayment] = useState("");       const [otHour, setOtHour] = useState("");
  const [behaviourAllowance, setBehaviourAllowance] = useState(""); const [holidayAllowance, setHolidayAllowance] = useState("");
  const [generalAllowance, setGeneralAllowance] = useState(""); const [conveyanceAllowance, setConveyanceAllowance] = useState("");
  const [incentiveAllowance, setIncentiveAllowance] = useState(""); const [otherAllowance, setOtherAllowance] = useState("");
  const [arrear, setArrear] = useState("");             const [attendanceBonus, setAttendanceBonus] = useState("");
  const [netSalary, setNetSalary] = useState("");       const [tiffinNightBill, setTiffinNightBill] = useState("");

  // EL Year
  const [elFrom, setElFrom] = useState(""); const [elFromMonth, setElFromMonth] = useState("");
  const [elTo, setElTo] = useState("");     const [elToMonth, setElToMonth] = useState("");
  const [elBalanceDays, setElBalanceDays] = useState(""); const [elPayment, setElPayment] = useState("");
  const [clBalanceDays, setClBalanceDays] = useState(""); const [clPayment, setClPayment] = useState("");
  const [serviceBenefitYear, setServiceBenefitYear] = useState(""); const [payableDaysPerYear, setPayableDaysPerYear] = useState("");
  const [serviceBenefitTotal, setServiceBenefitTotal] = useState("");
  const [pfAmount, setPfAmount] = useState(""); const [cpfAmount, setCpfAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [compensationAmt, setCompensationAmt] = useState(""); const [compensationRemarks, setCompensationRemarks] = useState("");
  const [netPayment, setNetPayment] = useState("");
  const [comments, setComments] = useState("");

  // Dynamic rows
  const [compensations, setCompensations] = useState<DynamicRow[]>([{ for: "", amount: "" }]);
  const [deductions, setDeductions] = useState<DynamicRow[]>([{ for: "", amount: "" }]);

  // Salary table
  const [salaryFromDate, setSalaryFromDate] = useState("");
  const [salaryToDate, setSalaryToDate] = useState("");

  // Employee info (demo - would be fetched by ID)
  const emp = {
    company: "Pakiza Software Limited (PSL-Operation)", name: "Khairul Bashar Masum",
    joiningDate: "01/12/2022", designation: "Assistant Manager",
    department: "Implementation & Business Analysis", line: "N/A", grade: "None",
    grossSalary: "46500.00", basicSalary: "27900.00",
    tenure: "03 Year, 05 Month, 28 Day", dayShortage: "0 Days",
  };

  const [calculated, setCalculated] = useState(false);

  const loadDemoData = (id: string) => {
    setMode("With Salary");
    setEmployeeId(id);
    setEmpLoaded(true);
    setSettlementType("Resigned");
    setSettlementDate("2026-06-15");
    setResignApplyDate("2026-04-28");
    setResignDate("2026-05-28");
    setLastWorkingDate("2026-05-25");
    setDeductionType("no");
    setNoticePeriod("30"); setNoticeShortage("5");
    setWorkingDays("25"); setPresent("23"); setLeave("2"); setHoliday("0");
    setAbsentDays("2"); setAbsentDeduction("1860.00");
    setPfDeduction("2000.00"); setTaxDeduction("500.00");
    setAdvanceDeduction("1000.00"); setLoanDeduction("500.00");
    setLunchDeduction("1200.00"); setOthersDeduction("0.00");
    setRevStamp("10.00"); setPaySalary("25000.00");
    setWagelyAdvance("0.00"); setOtRate("150.00"); setOtPayment("1500.00"); setOtHour("10");
    setBehaviourAllowance("500.00"); setHolidayAllowance("0.00"); setGeneralAllowance("1000.00");
    setConveyanceAllowance("2000.00"); setIncentiveAllowance("1500.00"); setOtherAllowance("0.00");
    setArrear("0.00"); setAttendanceBonus("1000.00"); setNetSalary("25500.00"); setTiffinNightBill("300.00");
    setElFrom("2022"); setElTo("2026"); setElBalanceDays("50.72"); setElPayment("78617.00");
    setClBalanceDays("5"); setClPayment("5000.00");
    setServiceBenefitYear("3"); setPayableDaysPerYear("7.00"); setServiceBenefitTotal("19530.00");
    setPfAmount("35000.00"); setCpfAmount("35000.00"); setGrandTotal("98147.00");
    setCompensationAmt("5000.00"); setCompensationRemarks("Good performance bonus");
    setNetPayment("103147.00");
    setComments("Verified by HR. Cleared all assets.");
    setCalculated(true);
  }

  const handleLoadEmployee = () => {
    if (!employeeId.trim()) { toast.error("Please enter Employee ID"); return; }
    loadDemoData(employeeId);
    toast.success("Employee loaded with demo data successfully.");
  };

  const handleEdit = (row: SettlementRecord) => {
    loadDemoData(row.empId);
    setView("create");
  };

  const handleCalculate = () => {
    if (!empLoaded) { toast.error("Please load an employee first."); return; }
    if (!settlementType) { toast.error("Please select Settlement Type."); return; }
    setNetPayment("103147.00");
    setCalculated(true);
    toast.success("Calculation complete.");
  };

  const handleSubmit = () => {
    if (!calculated) { toast.error("Please run Calculation before submitting."); return; }
    toast.success("Final Settlement submitted for approval.");
    setView("list");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-5 space-y-4 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span>Benefits</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Final Settlement</span>
          </div>

          {/* Page Header */}
          <div className="bg-card border border-border/60 rounded-lg p-4 shadow-sm flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded border border-primary/20 text-primary">
                <FileText className="size-4" />
              </div>
              Final Settlement
            </h1>
            <div className="flex items-center gap-2">
              {view === "create" ? (
                <button onClick={() => { setView("list"); setEmpLoaded(false); setEmployeeId(""); setCalculated(false); }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors">
                  <X className="size-3.5" /> Back to List
                </button>
              ) : (
                <button onClick={() => setView("create")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Plus className="size-3.5" /> New Settlement
                </button>
              )}
            </div>
          </div>

          {/* ─── LIST VIEW ─────────────────────────────────────────────────── */}
          {view === "list" && (
            <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Settlement Records</span>
                <span className="text-[11px] text-muted-foreground">{records.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      {["", "Emp ID", "Name", "Department", "Designation", "Join Date", "Resign Date", "Settle Date", "Settle Type", "Settle Amt"].map(h => (
                        <th key={h} className={`px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap ${h === "Settle Amt" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(row => (
                      <tr key={row.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors group">
                        <td className="px-3 py-2.5 w-16">
                          <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { loadDemoData(row.empId); setView("detail"); }}
                              className="text-muted-foreground hover:text-emerald-500 transition-colors">
                              <Eye className="size-3.5" />
                            </button>
                            <button onClick={() => handleEdit(row)}
                              className="text-muted-foreground hover:text-blue-500 transition-colors">
                              <Edit className="size-3.5" />
                            </button>
                            <button onClick={() => toast.error("Delete confirmation needed.")}
                              className="text-muted-foreground hover:text-rose-500 transition-colors">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-foreground">{row.empId}</td>
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.department}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.designation}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.joinDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.resignDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.settleDate || "—"}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">{row.settleType}</span>
                        </td>
                        <td className={`px-3 py-2.5 text-right font-mono font-semibold ${row.settleAmt < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                          {row.settleAmt.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CREATE FORM ────────────────────────────────────────────────── */}
          {view === "create" && (
            <div className="space-y-4">

              {/* ── Row 1: Employee ID Lookup ── */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Mode</label>
                    <Select value={mode} onChange={(e: any) => setMode(e.target.value)}>
                      <option>With Salary</option>
                      <option>Without Salary</option>
                    </Select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-muted-foreground">Employee ID <span className="text-rose-500">*</span></label>
                    <div className="flex gap-2">
                      <Input value={employeeId} onChange={(e: any) => setEmployeeId(e.target.value)} placeholder="e.g. 2022041203" />
                      <button onClick={handleLoadEmployee}
                        className="shrink-0 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:bg-primary/90 transition-colors shadow-sm">
                        Load
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Main Form Stack ── */}
              <div className="space-y-4">

                {/* ══ TOP PANEL: Employee Info ══ */}
                <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/20 border-b border-border/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Employee Info</span>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0.5">
                    <InfoRow label="Company" value={empLoaded ? emp.company : ""} />
                    <InfoRow label="Emp Name" value={empLoaded ? emp.name : ""} />
                    <InfoRow label="Joining Date" value={empLoaded ? emp.joiningDate : ""} />
                    <InfoRow label="Designation" value={empLoaded ? emp.designation : ""} />
                    <InfoRow label="Department" value={empLoaded ? emp.department : ""} />
                    <InfoRow label="Line" value={empLoaded ? emp.line : ""} />
                    <InfoRow label="Grade" value={empLoaded ? emp.grade : ""} />
                    <InfoRow label="Gross Salary" value={empLoaded ? `৳ ${emp.grossSalary}` : ""} />
                    <InfoRow label="Basic Salary" value={empLoaded ? `৳ ${emp.basicSalary}` : ""} />
                    <InfoRow label="Tenure of work" value={empLoaded ? emp.tenure : ""} />
                    <InfoRow label="Day Shortage" value={empLoaded ? emp.dayShortage : ""} />
                  </div>
                  {/* Net Payable bar */}
                  <div className={`mx-4 mb-4 mt-2 rounded px-4 py-3 flex items-center justify-between text-xs font-bold border ${calculated ? "bg-[#ffece6] border-[#ffcbb9] text-[#d64817] dark:text-[#ffb197] shadow-sm" : "bg-muted/40 border-border/40 text-muted-foreground"}`}>
                    <span>Net Payable</span>
                    <span className="font-mono text-sm">Tk. {calculated ? netPayment : "0.00"}</span>
                  </div>
                </div>

                {/* ══ RIGHT PANEL: Settlement Info ══ */}
                <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/20 border-b border-border/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Settlement Info</span>
                  </div>
                  <div className="p-4">

                    <SubSection title="1. General Details">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">Settlement Type <span className="text-rose-500">*</span></label>
                          <Select value={settlementType} onChange={(e: any) => setSettlementType(e.target.value)}>
                            <option value="">Select...</option>
                            {settlementTypes.map(t => <option key={t}>{t}</option>)}
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">Settlement Date <span className="text-rose-500">*</span></label>
                          <Input type="date" value={settlementDate} onChange={(e: any) => setSettlementDate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">Resign Apply Date <span className="text-rose-500">*</span></label>
                          <Input type="date" value={resignApplyDate} onChange={(e: any) => setResignApplyDate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">Resign Date <span className="text-rose-500">*</span></label>
                          <Input type="date" value={resignDate} onChange={(e: any) => setResignDate(e.target.value)} />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-semibold text-muted-foreground">Last Working Date (Pre) <span className="text-rose-500">*</span></label>
                          <Input type="date" value={lastWorkingDate} onChange={(e: any) => setLastWorkingDate(e.target.value)} />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 py-1.5 border-t border-border/25 mt-2 pt-3">
                        <span className="text-[11px] text-muted-foreground w-28 shrink-0">Deduction Type</span>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="dedType" checked={deductionType === "yes"} onChange={() => setDeductionType("yes")} className="accent-primary size-3" />
                          <span className="text-[11px]">Yes</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name="dedType" checked={deductionType === "no"} onChange={() => setDeductionType("no")} className="accent-primary size-3" />
                          <span className="text-[11px]">No</span>
                        </label>
                      </div>
                    </SubSection>

                    <SubSection title="2. Attendance & Notice">
                      <CalcRow left={<CalcField label="Notice Period (Day)" value={noticePeriod} onChange={(e: any) => setNoticePeriod(e.target.value)} />} right={<CalcField label="Notice Shortage Ded." value={noticeShortage} onChange={(e: any) => setNoticeShortage(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Working Days" value={workingDays} onChange={(e: any) => setWorkingDays(e.target.value)} />} right={<CalcField label="Present" value={present} onChange={(e: any) => setPresent(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Leave" value={leave} onChange={(e: any) => setLeave(e.target.value)} />} right={<CalcField label="Holiday" value={holiday} onChange={(e: any) => setHoliday(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Absent Days" value={absentDays} onChange={(e: any) => setAbsentDays(e.target.value)} />} right={<CalcField label="Absent Deduction" value={absentDeduction} onChange={(e: any) => setAbsentDeduction(e.target.value)} />} />
                    </SubSection>

                    <SubSection title="3. Deductions">
                      <CalcRow left={<CalcField label="PF Deduction" value={pfDeduction} onChange={(e: any) => setPfDeduction(e.target.value)} />} right={<CalcField label="Tax Deduction" value={taxDeduction} onChange={(e: any) => setTaxDeduction(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Advance Deduction" value={advanceDeduction} onChange={(e: any) => setAdvanceDeduction(e.target.value)} />} right={<CalcField label="Loan Deduction" value={loanDeduction} onChange={(e: any) => setLoanDeduction(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Lunch Deduction" value={lunchDeduction} onChange={(e: any) => setLunchDeduction(e.target.value)} />} right={<CalcField label="Others Deduction" value={othersDeduction} onChange={(e: any) => setOthersDeduction(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Rev. Stamp" value={revStamp} onChange={(e: any) => setRevStamp(e.target.value)} />} right={<CalcField label="Wagely Advance" value={wagelyAdvance} onChange={(e: any) => setWagelyAdvance(e.target.value)} />} />
                    </SubSection>

                    <SubSection title="4. Allowances & Extras">
                      <CalcRow left={<CalcField label="Behaviour Allow." value={behaviourAllowance} onChange={(e: any) => setBehaviourAllowance(e.target.value)} />} right={<CalcField label="Holiday Allowance" value={holidayAllowance} onChange={(e: any) => setHolidayAllowance(e.target.value)} />} />
                      <CalcRow left={<CalcField label="General Allowance" value={generalAllowance} onChange={(e: any) => setGeneralAllowance(e.target.value)} />} right={<CalcField label="Conveyance Allow." value={conveyanceAllowance} onChange={(e: any) => setConveyanceAllowance(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Incentive Allowance" value={incentiveAllowance} onChange={(e: any) => setIncentiveAllowance(e.target.value)} />} right={<CalcField label="Other Allowance" value={otherAllowance} onChange={(e: any) => setOtherAllowance(e.target.value)} />} />
                      <CalcRow left={<CalcField label="OT Rate" value={otRate} onChange={(e: any) => setOtRate(e.target.value)} />} right={<CalcField label="OT Hour" value={otHour} onChange={(e: any) => setOtHour(e.target.value)} />} />
                      <CalcRow left={<CalcField label="OT Payment" value={otPayment} onChange={(e: any) => setOtPayment(e.target.value)} />} right={<CalcField label="Arrear" value={arrear} onChange={(e: any) => setArrear(e.target.value)} />} />
                      <CalcRow left={<CalcField label="Attendance Bonus" value={attendanceBonus} onChange={(e: any) => setAttendanceBonus(e.target.value)} />} right={<CalcField label="Tiffin & Night Bill" value={tiffinNightBill} onChange={(e: any) => setTiffinNightBill(e.target.value)} />} />
                    </SubSection>

                    <SubSection title="5. Base Salaries">
                      <div className="grid grid-cols-2 gap-x-3 bg-primary/5 rounded border border-primary/20 p-2">
                         <CalcField label="Pay Salary" value={paySalary} readOnly />
                         <CalcField label="Net Salary" value={calculated ? netSalary : ""} readOnly />
                      </div>
                    </SubSection>

                    <SubSection title="6. Leave & Service Benefits">
                      <div className="pb-2 border-b border-border/25 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-muted-foreground w-16 shrink-0">EL Year</span>
                          <span className="text-[10px] text-muted-foreground">From</span>
                          <div className="flex gap-1">
                            <Select value={elFrom} onChange={(e: any) => setElFrom(e.target.value)} className="w-16 text-[11px]"><option value="">Yr</option>{elYears.map(y => <option key={y}>{y}</option>)}</Select>
                            <Select value={elFromMonth} onChange={(e: any) => setElFromMonth(e.target.value)} className="w-16 text-[11px]"><option value="">Mon</option>{elMonths.map(m => <option key={m}>{m}</option>)}</Select>
                          </div>
                          <span className="text-[10px] text-muted-foreground ml-2">To</span>
                          <div className="flex gap-1">
                            <Select value={elTo} onChange={(e: any) => setElTo(e.target.value)} className="w-16 text-[11px]"><option value="">Yr</option>{elYears.map(y => <option key={y}>{y}</option>)}</Select>
                            <Select value={elToMonth} onChange={(e: any) => setElToMonth(e.target.value)} className="w-16 text-[11px]"><option value="">Mon</option>{elMonths.map(m => <option key={m}>{m}</option>)}</Select>
                          </div>
                        </div>
                      </div>
                      <CalcRow left={<CalcField label="EL Balance Days" value={elBalanceDays} onChange={(e: any) => setElBalanceDays(e.target.value)} />} right={<CalcField label="EL Payment" value={elPayment} readOnly />} />
                      <CalcRow left={<CalcField label="CL Balance Days" value={clBalanceDays} onChange={(e: any) => setClBalanceDays(e.target.value)} />} right={<CalcField label="CL Payment" value={clPayment} readOnly />} />
                      <CalcRow left={<CalcField label="Service Ben. Year" value={serviceBenefitYear} onChange={(e: any) => setServiceBenefitYear(e.target.value)} />} right={<CalcField label="Payable Days (SB)" value={payableDaysPerYear} onChange={(e: any) => setPayableDaysPerYear(e.target.value)} />} />
                      <div className="py-1.5 mt-1 border-t border-border/25">
                        <CalcField label="Service Benefit (Total)" value={serviceBenefitTotal} readOnly />
                      </div>
                    </SubSection>

                    <SubSection title="7. Final Adjustments & Totals">
                      <CalcRow left={<CalcField label="PF Amount" value={pfAmount} onChange={(e: any) => setPfAmount(e.target.value)} />} right={<CalcField label="CPF Amount" value={cpfAmount} onChange={(e: any) => setCpfAmount(e.target.value)} />} />
                      <div className="py-2 border-b border-border/25">
                        <CalcField label="Grand Total" value={calculated ? grandTotal : ""} readOnly />
                      </div>
                      <CalcRow left={<CalcField label="Compensation Amt" value={compensationAmt} onChange={(e: any) => setCompensationAmt(e.target.value)} />} right={<CalcField label="Comp. Remarks" value={compensationRemarks} onChange={(e: any) => setCompensationRemarks(e.target.value)} />} />
                      <div className="py-2 mt-1 bg-amber-500/10 rounded border border-amber-500/20 px-2">
                        <CalcField label="Net Payment" value={calculated ? netPayment : ""} readOnly />
                      </div>
                      <div className="pt-3">
                        <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Final Comments</label>
                        <textarea value={comments} onChange={e => setComments(e.target.value)} rows={2} placeholder="Add any finalizing notes here..."
                          className="w-full text-[11px] border border-border bg-background rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none" />
                      </div>
                    </SubSection>

                  </div>
                </div>
              </div>

              {/* ── Salary Info Section ── */}
              {mode === "With Salary" && (
                <SectionCard title="Salary Info" action={<SectionToggle />}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground">From Date <span className="text-rose-500">*</span></label>
                        <Input type="date" value={salaryFromDate} onChange={(e: any) => setSalaryFromDate(e.target.value)} className="w-36" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground">To Date <span className="text-rose-500">*</span></label>
                        <Input type="date" value={salaryToDate} onChange={(e: any) => setSalaryToDate(e.target.value)} className="w-36" />
                      </div>
                      <button className="mt-5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm">
                        <RefreshCw className="size-3" /> Generate
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded border border-border/50">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/50">
                            {["Emp Id", "Name", "Month", "Year", "WD", "Present", "Holiday", "Leave", "Absent", "OT", "OT Amt", "Pay Basic", "House Rent", "Medical", "Transport", "Food", "Total Amt"].map(h => (
                              <th key={h} className="px-2 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {empLoaded ? (
                            <tr className="border-b border-border/30 hover:bg-muted/20">
                              <td className="px-2 py-2 font-mono">2022041203</td>
                              <td className="px-2 py-2 whitespace-nowrap">Khairul Bashar Masum</td>
                              <td className="px-2 py-2">05</td><td className="px-2 py-2">2026</td>
                              <td className="px-2 py-2">25</td><td className="px-2 py-2">23</td>
                              <td className="px-2 py-2">0</td><td className="px-2 py-2">2</td>
                              <td className="px-2 py-2">0</td><td className="px-2 py-2">10</td>
                              <td className="px-2 py-2">1500</td><td className="px-2 py-2">27,900</td>
                              <td className="px-2 py-2">13,950</td><td className="px-2 py-2">2,790</td>
                              <td className="px-2 py-2">1,860</td><td className="px-2 py-2">0</td>
                              <td className="px-2 py-2 font-semibold">48,000</td>
                            </tr>
                          ) : (
                            <tr><td colSpan={17} className="px-3 py-5 text-center text-[11px] text-muted-foreground">Load an employee and click Generate.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* ── Compensation + Deduction side by side ── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <SectionCard title="Additional Compensation" action={<SectionToggle />}>
                  <div className="space-y-2">
                    {compensations.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={row.for} onChange={(e: any) => setCompensations(p => p.map((r, idx) => idx === i ? { ...r, for: e.target.value } : r))} placeholder="Compensation For" className="flex-1" />
                        <Input value={row.amount} onChange={(e: any) => setCompensations(p => p.map((r, idx) => idx === i ? { ...r, amount: e.target.value } : r))} placeholder="Amount" type="number" className="w-28 font-mono" />
                        {i === compensations.length - 1 ? (
                          <button onClick={() => setCompensations(p => [...p, { for: "", amount: "" }])} className="p-1.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"><Plus className="size-3.5" /></button>
                        ) : (
                          <button onClick={() => setCompensations(p => p.filter((_, idx) => idx !== i))} className="p-1.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"><X className="size-3.5" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Additional Deduction" action={<SectionToggle />}>
                  <div className="space-y-2">
                    {deductions.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={row.for} onChange={(e: any) => setDeductions(p => p.map((r, idx) => idx === i ? { ...r, for: e.target.value } : r))} placeholder="Deduction For" className="flex-1" />
                        <Input value={row.amount} onChange={(e: any) => setDeductions(p => p.map((r, idx) => idx === i ? { ...r, amount: e.target.value } : r))} placeholder="Amount" type="number" className="w-28 font-mono" />
                        {i === deductions.length - 1 ? (
                          <button onClick={() => setDeductions(p => [...p, { for: "", amount: "" }])} className="p-1.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"><Plus className="size-3.5" /></button>
                        ) : (
                          <button onClick={() => setDeductions(p => p.filter((_, idx) => idx !== i))} className="p-1.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"><X className="size-3.5" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* ── Bottom Action Bar ── */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm p-4 flex items-center justify-between sticky bottom-4 z-10">
                <button onClick={handleCalculate}
                  className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-bold rounded transition-colors shadow-sm uppercase tracking-wide">
                  Calculation
                </button>
                <button onClick={handleSubmit} disabled={!calculated}
                  className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-[11px] font-bold rounded transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wide">
                  Update
                </button>
              </div>

            </div>
          )}

          {/* ─── DETAIL / PRINT VIEW ────────────────────────────────────────── */}
          {view === "detail" && (
            <div className="bg-white text-black border border-border/60 rounded-lg shadow-sm p-8 max-w-5xl mx-auto w-full relative">
              <button onClick={() => window.print()} className="absolute top-4 right-4 p-2 bg-muted/20 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded transition-colors print:hidden">
                <Printer className="size-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold">{emp.company.replace(" (PSL-Operation)", "")}</h2>
                <p className="text-[11px] text-gray-600 mt-0.5">Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                <h3 className="text-lg font-bold text-blue-600 mt-2">Final Settlement</h3>
              </div>

              {/* Top Info Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-8 text-[11px]">
                {/* Employee Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">Employee Info</h4>
                  <div className="space-y-1.5">
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Employee ID</span><span className="w-4">:</span><span className="flex-1">{employeeId}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Employee Name</span><span className="w-4">:</span><span className="flex-1">{emp.name}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Joining Date</span><span className="w-4">:</span><span className="flex-1">{emp.joiningDate}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Designation</span><span className="w-4">:</span><span className="flex-1">{emp.designation}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Department</span><span className="w-4">:</span><span className="flex-1">{emp.department}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Line</span><span className="w-4">:</span><span className="flex-1">{emp.line}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Grade</span><span className="w-4">:</span><span className="flex-1">{emp.grade}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Gross Salary</span><span className="w-4">:</span><span className="flex-1">{emp.grossSalary}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Basic Salary</span><span className="w-4">:</span><span className="flex-1">{emp.basicSalary}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Tenure of work</span><span className="w-4">:</span><span className="flex-1 font-bold">{emp.tenure}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Day Shortage</span><span className="w-4">:</span><span className="flex-1">{emp.dayShortage}</span></div>
                  </div>
                </div>

                {/* Settlement Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">Settlement Info</h4>
                  <div className="space-y-1.5">
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Code</span><span className="w-4">:</span><span className="flex-1">9348</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Settlement Type</span><span className="w-4">:</span><span className="flex-1">{settlementType}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Settlement Date</span><span className="w-4">:</span><span className="flex-1">{settlementDate}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Resign Apply Date</span><span className="w-4">:</span><span className="flex-1">{resignApplyDate}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Resign Date</span><span className="w-4">:</span><span className="flex-1">{resignDate}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Last Working Date</span><span className="w-4">:</span><span className="flex-1">{lastWorkingDate}</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Notice Period</span><span className="w-4">:</span><span className="flex-1">{noticePeriod} Days</span></div>
                    <div className="flex"><span className="w-1/3 font-semibold text-gray-600">Comments</span><span className="w-4">:</span><span className="flex-1">{comments}</span></div>
                  </div>
                </div>
              </div>

              {/* Bottom Area Grid */}
              <div className="grid grid-cols-2 gap-x-12 items-start text-[10px]">
                {/* Left Column: Payment Info (Earnings + Deductions) */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 text-[11px]">Payment Info</h4>
                  <div className="border border-gray-300">
                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-gray-300">Earning Sectors</div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex"><span className="flex-1 text-gray-600">Salary (Up to {lastWorkingDate})</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{paySalary}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Attendance Bonus</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{attendanceBonus}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">EID Bonus</span><span className="w-16">: Tk.</span><span className="w-20 text-right">0.00</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Earn Leave ({elBalanceDays} Days)</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{elPayment}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Over Time ({otHour} Hours)</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{otPayment}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Provident Fund (PF + CPF)</span><span className="w-16">: Tk.</span><span className="w-20 text-right">0.00</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Night & Tiffin Bill</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{tiffinNightBill}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Other Payment</span><span className="w-16">: Tk.</span><span className="w-20 text-right">0.00</span></div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Earning</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{(parseFloat(paySalary) || 0) + (parseFloat(attendanceBonus) || 0) + (parseFloat(elPayment) || 0) + (parseFloat(otPayment) || 0) + (parseFloat(tiffinNightBill) || 0)}</span>
                    </div>

                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-t border-gray-300">Deduction Sectors</div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex"><span className="flex-1 text-gray-600">Tenure of Notice ({noticeShortage} Days)</span><span className="w-16">: Tk.</span><span className="w-20 text-right">0.00</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Absent ({absentDays} Days)</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{absentDeduction}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Other Payment</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{othersDeduction}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Advance Payment</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{advanceDeduction}</span></div>
                      <div className="flex"><span className="flex-1 text-gray-600">Revenue Stamp</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{revStamp}</span></div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Deduction</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{(parseFloat(absentDeduction) || 0) + (parseFloat(othersDeduction) || 0) + (parseFloat(advanceDeduction) || 0) + (parseFloat(revStamp) || 0)}</span>
                    </div>

                    <div className="flex bg-[#f9cbbd] text-[#c0431b] p-3 font-bold mt-1 text-[11px]">
                      <span className="flex-1 text-right pr-4">Net Payable</span><span className="w-16">: Tk.</span><span className="w-20 text-right">{netPayment}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Other Details */}
                <div className="space-y-6 pt-6">
                  {/* Earn Leave */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">Earn Leave Details</h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr><th className="text-left pb-1 font-semibold text-gray-600">Type</th><th className="text-right pb-1 font-semibold text-gray-600">Days</th><th className="text-right pb-1 font-semibold text-gray-600">Rate</th><th className="text-right pb-1 font-semibold text-gray-600">Total</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">EL Balance</td><td className="text-right pt-2">{elBalanceDays}</td><td className="text-right pt-2">{((parseFloat(elPayment)||0)/(parseFloat(elBalanceDays)||1)).toFixed(2)}</td><td className="text-right pt-2">{elPayment}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">Total Tk. {elPayment}</div>
                  </div>

                  {/* Service Benefit */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">Service Benefit Details</h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr><th className="text-left pb-1 font-semibold text-gray-600">Service Benefit Year</th><th className="text-right pb-1 font-semibold text-gray-600">Payable Days Per Year(SB)</th><th className="text-right pb-1 font-semibold text-gray-600">Service Benefit (Total)</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">{serviceBenefitYear}</td><td className="text-right pt-2">{payableDaysPerYear}</td><td className="text-right pt-2">{serviceBenefitTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">Total Tk. {serviceBenefitTotal}</div>
                  </div>

                  {/* Compensation Details */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">Compensation Details</h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr><th className="text-left pb-1 font-semibold text-gray-600">Compensation Remarks</th><th className="text-right pb-1 font-semibold text-gray-600">Compensation Amt</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">{compensationRemarks || "N/A"}</td><td className="text-right pt-2">{compensationAmt}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">Total Tk. {compensationAmt}</div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
