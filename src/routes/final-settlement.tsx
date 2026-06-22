import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, FileText, Plus, Trash2, X, ChevronDown,
  User, Building2, Calendar, Calculator, RefreshCw, Send,
  CheckCircle2, AlertCircle
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
  id: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  joinDate: string;
  resignDate: string;
  settleDate: string;
  settleType: string;
  settleAmt: number;
}

interface CompensationRow { for: string; amount: string; }
interface DeductionRow { for: string; amount: string; }

const mockData: SettlementRecord[] = [
  {
    id: "1",
    empId: "2023044865",
    name: "Md. Nizam Uddin Shamrat",
    department: "Business Innovation",
    designation: "Asst. Manager",
    joinDate: "17/09/2023",
    resignDate: "17/03/2026",
    settleDate: "",
    settleType: "Resigned",
    settleAmt: -18179.00,
  },
  {
    id: "2",
    empId: "2023044865",
    name: "Md. Nizam Uddin Shamrat",
    department: "Business Innovation",
    designation: "Asst. Manager",
    joinDate: "17/09/2023",
    resignDate: "17/03/2026",
    settleDate: "",
    settleType: "Resigned",
    settleAmt: 54277.00,
  },
];

const settlementTypes = ["Resigned", "Retired", "Terminated", "Contract End", "Death", "Absconding"];
const paymentTypes = ["Bank", "Cash", "Cheque"];
const elYearOptions = ["2023", "2024", "2025", "2026"];
const elMonthOptions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function SectionHeader({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="flex items-center gap-2.5 py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
      <Icon className="size-4 text-primary" />
      <h3 className="text-sm font-bold text-primary tracking-tight">{title}</h3>
    </div>
  );
}

function FieldRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground w-40 shrink-0">{label}</span>
      <span className="text-xs text-muted-foreground mx-1">:</span>
      {children ?? <span className="text-xs font-semibold text-foreground">{value || "—"}</span>}
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 px-4 border-b border-border/30 last:border-0 ${bold ? "bg-muted/30" : ""}`}>
      <span className={`text-xs ${bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-xs font-mono ${bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>{value || "—"}</span>
    </div>
  );
}

function FinalSettlementPage() {
  const [view, setView] = useState<"list" | "create">("list");
  const [records] = useState<SettlementRecord[]>(mockData);

  // Create form state
  const [paymentType, setPaymentType] = useState("Bank");
  const [noticeDeduction, setNoticeDeduction] = useState(true);
  const [noticeDays, setNoticeDays] = useState("30");
  const [employeeId, setEmployeeId] = useState("");
  const [settlementType, setSettlementType] = useState("");
  const [applyDate, setApplyDate] = useState("");
  const [actionDate, setActionDate] = useState("");

  // Employee info (auto-filled)
  const [empInfo] = useState({
    company: "Pakiza Software Limited",
    name: "Md. Nizam Uddin Shamrat",
    designation: "Asst. Manager",
    department: "Business Innovation",
    section: "Core Dev",
    unit: "PSL",
    joiningDate: "17/09/2023",
    employeeType: "Permanent",
    bankAccount: "01923401782",
    basicSalary: "25000",
    houseRent: "12500",
    medical: "2500",
    transport: "2000",
    foodAllowance: "1500",
    grossSalary: "43500",
  });

  // Salary Info
  const [salaryFromDate, setSalaryFromDate] = useState("");
  const [salaryToDate, setSalaryToDate] = useState("");
  const salaryRows = [
    { empId: "2023044865", name: "Md. Nizam Uddin Shamrat", month: "03", year: "2026", wd: "17", present: "15", holiday: "2", leave: "0", absent: "0", ot: "0", otAmt: "0", payBasic: "14167", houseRent: "7083", medical: "1417", transport: "1133", food: "850", total: "24650" }
  ];

  // Compensation
  const [compensations, setCompensations] = useState<CompensationRow[]>([{ for: "", amount: "" }]);
  const addCompensation = () => setCompensations(p => [...p, { for: "", amount: "" }]);
  const removeCompensation = (i: number) => setCompensations(p => p.filter((_, idx) => idx !== i));

  // Earn Leave
  const [elFromYear, setElFromYear] = useState("");
  const [elFromMonth, setElFromMonth] = useState("");
  const [elToYear, setElToYear] = useState("");
  const [elToMonth, setElToMonth] = useState("");

  // Service Benefit
  const [tenureWork] = useState("2 Year, 6 Month, 0 Day");
  const [serviceDays] = useState("913");
  const [servicePayAmt] = useState("");

  // Deductions
  const [deductions, setDeductions] = useState<DeductionRow[]>([{ for: "", amount: "" }]);
  const addDeduction = () => setDeductions(p => [...p, { for: "", amount: "" }]);
  const removeDeduction = (i: number) => setDeductions(p => p.filter((_, idx) => idx !== i));

  // Calculated summary state
  const [calculated, setCalculated] = useState(false);
  const [summary] = useState({
    totalPayable: "24650",
    noticeDays: "0",
    advance: "0",
    mobileBill: "0",
    revenueStamp: "20",
    grandTotal: "24630",
    netPayable: "24630",
  });

  const handleCalculate = () => {
    if (!employeeId) { toast.error("Please enter an Employee ID first."); return; }
    if (!settlementType) { toast.error("Please select a Settlement Type."); return; }
    setCalculated(true);
    toast.success("Settlement calculated successfully.");
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

        <div className="p-4 md:p-6 space-y-5 w-full">
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
          <div className="bg-card border border-border/60 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <FileText className="size-5" />
                </div>
                Final Settlement
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Process employee final settlements including salary, earned leave, service benefits, and deductions.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              {view === "create" ? (
                <button
                  onClick={() => setView("list")}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                >
                  <X className="size-4" />
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Plus className="size-4" />
                  New Settlement
                </button>
              )}
            </div>
          </div>

          {/* ─── LIST VIEW ─── */}
          {view === "list" && (
            <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Settlement Records</span>
                <span className="text-xs text-muted-foreground">{records.length} records found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground w-10"></th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Emp ID</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Name</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Department</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Designation</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Join Date</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Resign Date</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Settle Date</th>
                      <th className="px-3 py-3 text-left font-semibold text-muted-foreground">Settle Type</th>
                      <th className="px-3 py-3 text-right font-semibold text-muted-foreground">Settle Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(row => (
                      <tr key={row.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors group">
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toast.error("Confirm delete?")}
                            className="text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                        <td className="px-3 py-3 font-mono text-foreground">{row.empId}</td>
                        <td className="px-3 py-3 font-medium text-foreground">{row.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">{row.department}</td>
                        <td className="px-3 py-3 text-muted-foreground">{row.designation}</td>
                        <td className="px-3 py-3 text-muted-foreground">{row.joinDate}</td>
                        <td className="px-3 py-3 text-muted-foreground">{row.resignDate}</td>
                        <td className="px-3 py-3 text-muted-foreground">{row.settleDate || "—"}</td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            {row.settleType}
                          </span>
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-semibold ${row.settleAmt < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                          {row.settleAmt.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CREATE FORM ─── */}
          {view === "create" && (
            <div className="space-y-5">

              {/* Top Controls: Payment Type + Notice Deduction */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <SectionHeader title="Payment & Notice Configuration" icon={Calculator} />
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Payment Type <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select
                        value={paymentType}
                        onChange={e => setPaymentType(e.target.value)}
                        className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                      >
                        {paymentTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Notice Deduction</label>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={noticeDeduction}
                          onChange={e => setNoticeDeduction(e.target.checked)}
                          className="rounded border-border accent-primary"
                        />
                        <span className="text-xs font-medium text-foreground">Apply Notice Deduction</span>
                      </label>
                    </div>
                  </div>
                  {noticeDeduction && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Notice Period (Days)</label>
                      <div className="relative">
                        <select
                          value={noticeDays}
                          onChange={e => setNoticeDays(e.target.value)}
                          className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                        >
                          {["15", "30", "45", "60", "90"].map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Employee Header Fields */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <SectionHeader title="Employee Info" icon={User} />
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Employee ID <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={e => setEmployeeId(e.target.value)}
                      placeholder="e.g. 2023044865"
                      className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Settlement Type <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select
                        value={settlementType}
                        onChange={e => setSettlementType(e.target.value)}
                        className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                      >
                        <option value="">Select...</option>
                        {settlementTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Apply Date <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      value={applyDate}
                      onChange={e => setApplyDate(e.target.value)}
                      className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Action Date <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      value={actionDate}
                      onChange={e => setActionDate(e.target.value)}
                      className="w-full text-xs font-medium border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Employee Basic Info — auto-filled read only */}
                {employeeId && (
                  <div className="px-4 pb-4">
                    <div className="bg-muted/30 rounded-lg border border-border/50 p-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-2">Basic Info</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 px-3">
                        <div>
                          <FieldRow label="Company" value={empInfo.company} />
                          <FieldRow label="Emp Name" value={empInfo.name} />
                          <FieldRow label="Designation" value={empInfo.designation} />
                          <FieldRow label="Department" value={empInfo.department} />
                          <FieldRow label="Section" value={empInfo.section} />
                          <FieldRow label="Unit" value={empInfo.unit} />
                          <FieldRow label="Joining Date" value={empInfo.joiningDate} />
                          <FieldRow label="Employee Type" value={empInfo.employeeType} />
                          <FieldRow label="Bank Account" value={empInfo.bankAccount} />
                        </div>
                        <div>
                          <FieldRow label="Basic Salary" value={`৳ ${empInfo.basicSalary}`} />
                          <FieldRow label="House Rent" value={`৳ ${empInfo.houseRent}`} />
                          <FieldRow label="Medical" value={`৳ ${empInfo.medical}`} />
                          <FieldRow label="Transport Allowance" value={`৳ ${empInfo.transport}`} />
                          <FieldRow label="Food Allowance" value={`৳ ${empInfo.foodAllowance}`} />
                          <FieldRow label="Gross Salary" value={`৳ ${empInfo.grossSalary}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Salary Info */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <div className="flex items-center justify-between py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary">Salary Info</h3>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Include</span>
                  </label>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-end gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">From Date <span className="text-rose-500">*</span></label>
                      <input type="date" value={salaryFromDate} onChange={e => setSalaryFromDate(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">To Date <span className="text-rose-500">*</span></label>
                      <input type="date" value={salaryToDate} onChange={e => setSalaryToDate(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                      <RefreshCw className="size-3.5" /> Generate
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                          {["Emp Id", "Name", "Month", "Year", "WD", "Present", "Holiday", "Leave", "Absent", "OT", "OT Amt", "Pay Basic", "House Rent", "Medical", "Transport", "Food", "Total Amount"].map(h => (
                            <th key={h} className="px-2 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {employeeId ? salaryRows.map((r, i) => (
                          <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                            <td className="px-2 py-2 font-mono">{r.empId}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{r.name}</td>
                            <td className="px-2 py-2">{r.month}</td>
                            <td className="px-2 py-2">{r.year}</td>
                            <td className="px-2 py-2">{r.wd}</td>
                            <td className="px-2 py-2">{r.present}</td>
                            <td className="px-2 py-2">{r.holiday}</td>
                            <td className="px-2 py-2">{r.leave}</td>
                            <td className="px-2 py-2">{r.absent}</td>
                            <td className="px-2 py-2">{r.ot}</td>
                            <td className="px-2 py-2">{r.otAmt}</td>
                            <td className="px-2 py-2">{r.payBasic}</td>
                            <td className="px-2 py-2">{r.houseRent}</td>
                            <td className="px-2 py-2">{r.medical}</td>
                            <td className="px-2 py-2">{r.transport}</td>
                            <td className="px-2 py-2">{r.food}</td>
                            <td className="px-2 py-2 font-semibold">{r.total}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={17} className="px-3 py-6 text-center text-xs text-muted-foreground">
                              Enter an Employee ID and click Generate to load salary data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Compensation Info */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <div className="flex items-center justify-between py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary">Compensation Info</h3>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Include</span>
                  </label>
                </div>
                <div className="p-4 space-y-2">
                  {compensations.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Compensation For"
                        value={row.for}
                        onChange={e => setCompensations(p => p.map((r, idx) => idx === i ? { ...r, for: e.target.value } : r))}
                        className="flex-1 text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={row.amount}
                        onChange={e => setCompensations(p => p.map((r, idx) => idx === i ? { ...r, amount: e.target.value } : r))}
                        className="w-36 text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                      />
                      {i === compensations.length - 1 ? (
                        <button onClick={addCompensation} className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                          <Plus className="size-4" />
                        </button>
                      ) : (
                        <button onClick={() => removeCompensation(i)} className="p-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Earn Leave Info */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <div className="flex items-center justify-between py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary">Earn Leave Info</h3>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Include</span>
                  </label>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-end gap-3 flex-wrap">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">EL Year From</label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <select value={elFromYear} onChange={e => setElFromYear(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40">
                            <option value="">Year...</option>
                            {elYearOptions.map(y => <option key={y}>{y}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 size-3 text-muted-foreground pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select value={elFromMonth} onChange={e => setElFromMonth(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40">
                            <option value="">Month...</option>
                            {elMonthOptions.map(m => <option key={m}>{m}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 size-3 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">EL Year To</label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <select value={elToYear} onChange={e => setElToYear(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40">
                            <option value="">Year...</option>
                            {elYearOptions.map(y => <option key={y}>{y}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 size-3 text-muted-foreground pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select value={elToMonth} onChange={e => setElToMonth(e.target.value)} className="text-xs border border-border bg-background rounded-md px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40">
                            <option value="">Month...</option>
                            {elMonthOptions.map(m => <option key={m}>{m}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 size-3 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                      <RefreshCw className="size-3.5" /> Generate
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-muted/30 rounded-lg border border-border/50 px-4 py-2">
                    <FieldRow label="Annual Leave Days" value={employeeId ? "18" : ""} />
                    <FieldRow label="Pay Amount" value={employeeId ? "৳ 15,000" : ""} />
                  </div>
                </div>
              </div>

              {/* Service Benefit Info */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <div className="flex items-center justify-between py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary">Service Benefit Info</h3>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Include</span>
                  </label>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-36">Tenure of work</span>
                    <span className="text-xs text-muted-foreground">:</span>
                    <span className="text-xs font-semibold text-foreground">{employeeId ? tenureWork : "—"}</span>
                    <button className="ml-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                      <RefreshCw className="size-3.5" /> Generate
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-muted/30 rounded-lg border border-border/50 px-4 py-2">
                    <FieldRow label="Service Days" value={employeeId ? serviceDays : ""} />
                    <FieldRow label="Pay Amount" value={employeeId ? `৳ ${servicePayAmt || "12,500"}` : ""} />
                  </div>
                </div>
              </div>

              {/* Deduction Info */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm">
                <div className="flex items-center justify-between py-3 px-4 bg-primary/5 border-b border-border/60 rounded-t-lg">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-primary">Deduction Info</h3>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border accent-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Include</span>
                  </label>
                </div>
                <div className="p-4 space-y-2">
                  {deductions.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Deduction For"
                        value={row.for}
                        onChange={e => setDeductions(p => p.map((r, idx) => idx === i ? { ...r, for: e.target.value } : r))}
                        className="flex-1 text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={row.amount}
                        onChange={e => setDeductions(p => p.map((r, idx) => idx === i ? { ...r, amount: e.target.value } : r))}
                        className="w-36 text-xs border border-border bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                      />
                      {i === deductions.length - 1 ? (
                        <button onClick={addDeduction} className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                          <Plus className="size-4" />
                        </button>
                      ) : (
                        <button onClick={() => removeDeduction(i)} className="p-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Pane + Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* Left spacer */}
                <div className="flex-1" />

                {/* Right: Summary Card */}
                <div className="w-full lg:w-96 bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden shrink-0">
                  <div className="flex items-center gap-2.5 py-3 px-4 bg-muted/20 border-b border-border/60">
                    <Calculator className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Settlement Summary</h3>
                  </div>
                  {calculated ? (
                    <>
                      <SummaryRow label="Total Payable" value={`৳ ${summary.totalPayable}`} />
                      <SummaryRow label="Notice Pay-0 Days" value={summary.noticeDays} />
                      <SummaryRow label="Advance" value={`৳ ${summary.advance}`} />
                      <SummaryRow label="Mobile Bill" value={`৳ ${summary.mobileBill}`} />
                      <SummaryRow label="Revenue Stamp" value={`৳ ${summary.revenueStamp}`} />
                      <SummaryRow label="Grand Total" value={`৳ ${summary.grandTotal}`} bold />
                      <SummaryRow label="Net Payable" value={`৳ ${summary.netPayable}`} bold />
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Calculator className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Click <strong>Calculate</strong> to compute the settlement summary.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-card border border-border/60 rounded-lg shadow-sm p-4 flex items-center justify-between gap-3">
                <button
                  onClick={handleCalculate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                >
                  <Calculator className="size-4" />
                  Calculate
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!calculated}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="size-4" />
                  Submit
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
