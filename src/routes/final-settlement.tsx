import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileText,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Calculator,
  RefreshCw,
  Send,
  Edit,
  Eye,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import type { SettlementTypePolicy } from "./final-settlement-configuration";

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
interface DynamicRow {
  for: string;
  amount: string;
}

const mockData: SettlementRecord[] = [
  {
    id: "1",
    empId: "2022041203",
    name: "Khairul Bashar Masum",
    department: "Implementation & Business Analysis",
    designation: "Assistant Manager",
    joinDate: "01/12/2022",
    resignDate: "28/05/2026",
    settleDate: "15/06/2026",
    settleType: "Resigned",
    settleAmt: 103147.0,
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
    settleAmt: -18179.0,
  },
];

// Dynamic types are loaded from configuration
const elYears = ["2022", "2023", "2024", "2025", "2026"];
const elMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Reusable small components ────────────────────────────────────────────────

function Select({ value, onChange, children, className = "" }: any) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`w-full text-xs border border-border bg-background rounded px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-2 size-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
  readOnly = false,
  className = "",
}: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full text-xs border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/40 ${readOnly ? "bg-muted/40 text-foreground" : "bg-background"} ${className}`}
    />
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
function CalcField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value?: string;
  onChange?: any;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-28 shrink-0">{label}</span>
      {onChange ? (
        <Input
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className="flex-1 h-6 py-0.5 text-[11px] font-mono"
        />
      ) : (
        <span className="text-[11px] font-bold text-foreground font-mono">{value || ""}</span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
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
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
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

  // Dynamic Policies
  const [settlementPolicies, setSettlementPolicies] = useState<SettlementTypePolicy[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("fs_settlement_types_v3");
    if (stored) {
      setSettlementPolicies(JSON.parse(stored));
    }
  }, []);

  // Settlement Info
  const [settlementType, setSettlementType] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [resignApplyDate, setResignApplyDate] = useState("");
  const [resignDate, setResignDate] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [deductionType, setDeductionType] = useState<"yes" | "no">("no");

  // Calculation fields (editable)
  const [noticePeriod, setNoticePeriod] = useState("");
  const [noticeShortage, setNoticeShortage] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [present, setPresent] = useState("");
  const [leave, setLeave] = useState("");
  const [holiday, setHoliday] = useState("");
  const [absentDays, setAbsentDays] = useState("");
  const [absentDeduction, setAbsentDeduction] = useState("");
  const [pfDeduction, setPfDeduction] = useState("");
  const [taxDeduction, setTaxDeduction] = useState("");
  const [advanceDeduction, setAdvanceDeduction] = useState("");
  const [loanDeduction, setLoanDeduction] = useState("");
  const [lunchDeduction, setLunchDeduction] = useState("");
  const [othersDeduction, setOthersDeduction] = useState("");
  const [revStamp, setRevStamp] = useState("");
  const [paySalary, setPaySalary] = useState("");
  const [wagelyAdvance, setWagelyAdvance] = useState("");
  const [otRate, setOtRate] = useState("");
  const [otPayment, setOtPayment] = useState("");
  const [otHour, setOtHour] = useState("");
  const [behaviourAllowance, setBehaviourAllowance] = useState("");
  const [holidayAllowance, setHolidayAllowance] = useState("");
  const [generalAllowance, setGeneralAllowance] = useState("");
  const [conveyanceAllowance, setConveyanceAllowance] = useState("");
  const [incentiveAllowance, setIncentiveAllowance] = useState("");
  const [otherAllowance, setOtherAllowance] = useState("");
  const [arrear, setArrear] = useState("");
  const [attendanceBonus, setAttendanceBonus] = useState("");
  const [netSalary, setNetSalary] = useState("");
  const [tiffinNightBill, setTiffinNightBill] = useState("");

  // EL Year
  const [elFrom, setElFrom] = useState("");
  const [elFromMonth, setElFromMonth] = useState("");
  const [elTo, setElTo] = useState("");
  const [elToMonth, setElToMonth] = useState("");
  const [elBalanceDays, setElBalanceDays] = useState("");
  const [elPayment, setElPayment] = useState("");
  const [clBalanceDays, setClBalanceDays] = useState("");
  const [clPayment, setClPayment] = useState("");
  const [serviceBenefitYear, setServiceBenefitYear] = useState("");
  const [payableDaysPerYear, setPayableDaysPerYear] = useState("");
  const [serviceBenefitTotal, setServiceBenefitTotal] = useState("");
  const [pfAmount, setPfAmount] = useState("");
  const [cpfAmount, setCpfAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [compensationAmt, setCompensationAmt] = useState("");
  const [compensationRemarks, setCompensationRemarks] = useState("");
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
    company: "Pakiza Software Limited (PSL-Operation)",
    name: "Khairul Bashar Masum",
    joiningDate: "01/12/2022",
    designation: "Assistant Manager",
    department: "Implementation & Business Analysis",
    line: "N/A",
    grade: "None",
    grossSalary: "46500.00",
    basicSalary: "27900.00",
    tenure: "03 Year, 05 Month, 28 Day",
    dayShortage: "0 Days",
  };

  const [calculated, setCalculated] = useState(false);

  const loadDemoData = (id: string) => {
    setMode("With Salary");
    setEmployeeId(id);
    setEmpLoaded(true);
    setSettlementType("Resignation");
    setSettlementDate("2026-06-15");
    setResignApplyDate("2026-04-28");
    setResignDate("2026-05-28");
    setLastWorkingDate("2026-05-25");
    setDeductionType("no");
    setNoticePeriod("30");
    setNoticeShortage("5");
    setWorkingDays("25");
    setPresent("23");
    setLeave("2");
    setHoliday("0");
    setAbsentDays("2");
    setAbsentDeduction("1860.00");
    setPfDeduction("2000.00");
    setTaxDeduction("500.00");
    setAdvanceDeduction("1000.00");
    setLoanDeduction("500.00");
    setLunchDeduction("1200.00");
    setOthersDeduction("0.00");
    setRevStamp("10.00");
    setPaySalary("25000.00");
    setWagelyAdvance("0.00");
    setOtRate("150.00");
    setOtPayment("1500.00");
    setOtHour("10");
    setBehaviourAllowance("500.00");
    setHolidayAllowance("0.00");
    setGeneralAllowance("1000.00");
    setConveyanceAllowance("2000.00");
    setIncentiveAllowance("1500.00");
    setOtherAllowance("0.00");
    setArrear("0.00");
    setAttendanceBonus("1000.00");
    setNetSalary("25500.00");
    setTiffinNightBill("300.00");
    setElFrom("2022");
    setElTo("2026");
    setElBalanceDays("50.72");
    setElPayment("78617.00");
    setClBalanceDays("5");
    setClPayment("5000.00");
    setServiceBenefitYear("3");
    setPayableDaysPerYear("7.00");
    setServiceBenefitTotal("19530.00");
    setPfAmount("35000.00");
    setCpfAmount("35000.00");
    setGrandTotal("104807.00");
    setCompensationAmt("5000.00");
    setCompensationRemarks("Good performance bonus");
    setNetPayment("104807.00");
    setComments("Verified by HR. Cleared all assets.");
    setCompensations([
      { for: "Special Performance Bonus", amount: "5000.00" },
      { for: "Sales Commission", amount: "1500.00" },
      { for: "Unused Sick Leave Encashment", amount: "3250.00" },
      { for: "Project Completion Reward", amount: "10000.00" },
      { for: "Overtime Adjustment", amount: "850.00" },
      { for: "", amount: "" },
    ]);
    setDeductions([
      { for: "Unadjusted Loan", amount: "2000.00" },
      { for: "Lost ID Card Penalty", amount: "500.00" },
      { for: "Advance Salary Adjustment", amount: "5000.00" },
      { for: "Notice Period Shortage", amount: "3500.00" },
      { for: "Damaged Equipment", amount: "1200.00" },
      { for: "", amount: "" },
    ]);
    setCalculated(true);
  };

  const handleLoadEmployee = () => {
    if (!employeeId.trim()) {
      toast.error("Please enter Employee ID");
      return;
    }
    loadDemoData(employeeId);
    toast.success("Employee loaded with demo data successfully.");
  };

  const handleEdit = (row: SettlementRecord) => {
    loadDemoData(row.empId);
    setView("create");
  };

  const handleCalculate = () => {
    if (!empLoaded) {
      toast.error("Please load an employee first.");
      return;
    }
    if (!settlementType) {
      toast.error("Please select Settlement Type.");
      return;
    }
    
    // Find selected policy
    const policy = settlementPolicies.find(p => p.name === settlementType);
    if (!policy) {
      toast.error("Invalid settlement type policy.");
      return;
    }

    // DEMO LOGIC: Dynamic effect based on settlement type policy
    let calculatedGrandTotal = 104807.00;
    
    // Notice — deduction from employee (resignation: didn't serve notice)
    if (policy.noticeDeductedFromEmployee) {
      setNoticePeriod(policy.noticePeriodDays.toString());
      setNoticeShortage("5"); // Mock shortage days
      setDeductions((prev) => {
        const filtered = prev.filter(d => d.for && !d.for.toLowerCase().includes("notice"));
        return [...filtered, { for: "Notice Period Shortage", amount: "3500.00" }, { for: "", amount: "" }];
      });
      calculatedGrandTotal -= 3500;
    } else {
      setNoticePeriod("0");
      setNoticeShortage("0");
      setDeductions((prev) => prev.filter(d => d.for && !d.for.toLowerCase().includes("notice")));
    }

    // Notice — paid by employer (termination/retrenchment: notice pay in lieu)
    if (policy.noticePaidByEmployer) {
      setCompensations((prev) => {
        const filtered = prev.filter(c => c.for && !c.for.toLowerCase().includes("notice"));
        return [...filtered, { for: "Notice Pay (In Lieu)", amount: "27900.00" }, { for: "", amount: "" }];
      });
      calculatedGrandTotal += 27900;
    } else {
      setCompensations((prev) => prev.filter(c => c.for && !c.for.toLowerCase().includes("notice")));
    }

    // Service Benefit / Compensation — two-tier based on service length
    if (policy.isCompensationApplicable) {
      // Demo: assume 3 years service, daily rate = 930 (basic 27900/30)
      const DEMO_SERVICE_YEARS = 3;
      const DEMO_DAILY_RATE = 930;
      // Use correct tier
      const compDays = DEMO_SERVICE_YEARS >= 10
        ? policy.compensationDaysPerYear_above10yrs
        : policy.compensationDaysPerYear_below10yrs;
      const benefitAmt = DEMO_SERVICE_YEARS * compDays * DEMO_DAILY_RATE;
      setPayableDaysPerYear(compDays.toString());
      setServiceBenefitTotal(benefitAmt.toFixed(2));
      calculatedGrandTotal += (benefitAmt - 19530); // offset initial mock
    } else {
      setPayableDaysPerYear("0");
      setServiceBenefitTotal("0.00");
      calculatedGrandTotal -= 19530;
    }

    setGrandTotal(calculatedGrandTotal.toFixed(2));
    setNetPayment(calculatedGrandTotal.toFixed(2));
    setCalculated(true);
    toast.success("Calculation complete for " + settlementType + ".");
  };

  const handleSubmit = () => {
    if (!calculated) {
      toast.error("Please run Calculation before submitting.");
      return;
    }
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
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
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
                <button
                  onClick={() => {
                    setView("list");
                    setEmpLoaded(false);
                    setEmployeeId("");
                    setCalculated(false);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors"
                >
                  <X className="size-3.5" /> Back to List
                </button>
              ) : (
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
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
                      {[
                        "",
                        "Emp ID",
                        "Name",
                        "Department",
                        "Designation",
                        "Join Date",
                        "Resign Date",
                        "Settle Date",
                        "Settle Type",
                        "Settle Amt",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap ${h === "Settle Amt" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border/40 hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-3 py-2.5 w-16">
                          <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => {
                                loadDemoData(row.empId);
                                setView("detail");
                              }}
                              className="text-muted-foreground hover:text-emerald-500 transition-colors"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleEdit(row)}
                              className="text-muted-foreground hover:text-blue-500 transition-colors"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => toast.error("Delete confirmation needed.")}
                              className="text-muted-foreground hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-foreground">{row.empId}</td>
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.department}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.designation}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.joinDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.resignDate}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {row.settleDate || "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            {row.settleType}
                          </span>
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-mono font-semibold ${row.settleAmt < 0 ? "text-rose-500" : "text-emerald-600"}`}
                        >
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
            <div className="bg-card border border-border/60 shadow-sm rounded flex flex-col relative min-h-[calc(100vh-140px)] w-full overflow-hidden">
              <div className="p-6 flex-1 space-y-4">
                {/* ── Configuration & Records ── */}
                <div className="border border-border/60 rounded p-5 mb-4 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-5 text-[11px] font-bold text-primary">
                    <span className="uppercase tracking-wider border-b-2 border-primary/30 pb-0.5">
                      Configuration & Records
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">
                        Payment Type <span className="text-rose-500">*</span>
                      </label>
                      <Select>
                        <option>Bank</option>
                        <option>Cash</option>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground cursor-pointer">
                        <input type="checkbox" className="accent-primary size-3" defaultChecked />{" "}
                        Notice Deduction
                      </label>
                      <Select>
                        <option>30</option>
                        <option>60</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#3b82f6]">
                        Employee ID
                      </label>
                      <Input
                        value={employeeId}
                        onChange={(e: any) => setEmployeeId(e.target.value)}
                        placeholder="e.g. 2023043910"
                        className="font-bold border-[#3b82f6]/30 focus:ring-[#3b82f6]/40"
                      />
                      <button
                        onClick={handleLoadEmployee}
                        className="mt-1.5 text-[9px] bg-[#3b82f6] hover:bg-[#2563eb] transition-colors text-white px-2.5 py-0.5 rounded font-bold tracking-wider uppercase shadow-sm"
                      >
                        Load Employee
                      </button>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-semibold text-muted-foreground">
                        Settlement Type <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        value={settlementType}
                        onChange={(e: any) => setSettlementType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {settlementPolicies.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">
                        Apply Date <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={resignApplyDate}
                        onChange={(e: any) => setResignApplyDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground">
                        Action Date <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={settlementDate}
                        onChange={(e: any) => setSettlementDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Employee Information ── */}
                <div className="border border-border/60 rounded p-5 mb-6 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-5 text-[11px] font-bold text-[#84cc16]">
                    <span className="uppercase tracking-wider border-b-2 border-[#84cc16]/30 pb-0.5">
                      Employee Information
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0.5 pt-1">
                    <div className="space-y-1.5 border-r border-border/30 pr-6">
                      <InfoRow
                        label="Company"
                        value={empLoaded ? "Pakiza Software Limited(PSL-Operation)" : ""}
                      />
                      <InfoRow label="Emp Name" value={empLoaded ? "Tahmid Afsar" : ""} />
                      <InfoRow label="Designation" value={empLoaded ? "Asst. Manager" : ""} />
                      <InfoRow label="Department" value={empLoaded ? "Business Innovation" : ""} />
                      <InfoRow
                        label="Section"
                        value={empLoaded ? "Project Resource & Strategy" : ""}
                      />
                      <InfoRow label="Unit" value={empLoaded ? "PSL" : ""} />
                      <InfoRow label="Joining Date" value={empLoaded ? "01/08/2023" : ""} />
                      <InfoRow label="Employee Type" value={empLoaded ? "Office Executive" : ""} />
                      <InfoRow label="Bank Account" value={empLoaded ? "171.103.0256059" : ""} />
                    </div>
                    <div className="space-y-1.5 pl-6">
                      <InfoRow label="Basic Salary" value={empLoaded ? "31200.00" : ""} />
                      <InfoRow label="House Rent" value={empLoaded ? "15600.00" : ""} />
                      <InfoRow label="Medical" value={empLoaded ? "3120.00" : ""} />
                      <InfoRow label="Transport Allowance" value={empLoaded ? "2080.00" : ""} />
                      <InfoRow label="Food Allowance" value={empLoaded ? "0.00" : ""} />
                      <div className="pt-2 mt-2 border-t border-border/50">
                        <InfoRow label="Gross Salary" value={empLoaded ? "52000.00" : ""} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Sections ── */}

                {/* Salary Info */}
                <div className="border border-border/60 rounded p-4 mb-4 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-[#3b82f6]">
                    <input type="checkbox" className="accent-[#3b82f6] size-3" defaultChecked />{" "}
                    Salary Info
                  </div>
                  <div className="flex gap-4 items-end mb-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground block">
                        From Date <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={salaryFromDate}
                        onChange={(e: any) => setSalaryFromDate(e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground block">
                        To Date <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={salaryToDate}
                        onChange={(e: any) => setSalaryToDate(e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-colors tracking-wider">
                      Generate
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded border border-border/50">
                    <table className="w-full text-[10px] text-center whitespace-nowrap">
                      <thead className="bg-muted/20 border-b border-border/50 text-muted-foreground">
                        <tr>
                          <th className="p-2 font-medium border-r border-border/50">#</th>
                          <th className="p-2 font-medium border-r border-border/50 text-left">
                            Emp Id
                          </th>
                          <th className="p-2 font-medium border-r border-border/50 text-left">
                            Name
                          </th>
                          <th className="p-2 font-medium border-r border-border/50">Month</th>
                          <th className="p-2 font-medium border-r border-border/50">Year</th>
                          <th className="p-2 font-medium border-r border-border/50">W/D</th>
                          <th className="p-2 font-medium border-r border-border/50">Present</th>
                          <th className="p-2 font-medium border-r border-border/50">Holiday</th>
                          <th className="p-2 font-medium border-r border-border/50">Leave</th>
                          <th className="p-2 font-medium border-r border-border/50">Absent</th>
                          <th className="p-2 font-medium border-r border-border/50">OT</th>
                          <th className="p-2 font-medium border-r border-border/50">OT Amt</th>
                          <th className="p-2 font-medium border-r border-border/50">Pay Basic</th>
                          <th className="p-2 font-medium border-r border-border/50">House Rent</th>
                          <th className="p-2 font-medium border-r border-border/50">Medical</th>
                          <th className="p-2 font-medium border-r border-border/50">Transport</th>
                          <th className="p-2 font-medium border-r border-border/50">Food</th>
                          <th className="p-2 font-medium border-r border-border/50">Adv Amount</th>
                          <th className="p-2 font-medium border-r border-border/50">Abs Amount</th>
                          <th className="p-2 font-medium border-r border-border/50">Tax Amount</th>
                          <th className="p-2 font-medium">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {empLoaded ? (
                          <tr className="border-b border-border/30 hover:bg-muted/10">
                            <td className="p-2 border-r border-border/50">1</td>
                            <td className="p-2 border-r border-border/50 text-left">2023043910</td>
                            <td className="p-2 border-r border-border/50 text-left">
                              Tahmid Afsar
                            </td>
                            <td className="p-2 border-r border-border/50">06</td>
                            <td className="p-2 border-r border-border/50">2026</td>
                            <td className="p-2 border-r border-border/50">14</td>
                            <td className="p-2 border-r border-border/50">14</td>
                            <td className="p-2 border-r border-border/50">8</td>
                            <td className="p-2 border-r border-border/50">0</td>
                            <td className="p-2 border-r border-border/50">0</td>
                            <td className="p-2 border-r border-border/50">0.00</td>
                            <td className="p-2 border-r border-border/50">0</td>
                            <td className="p-2 border-r border-border/50">22880.00</td>
                            <td className="p-2 border-r border-border/50">11440.00</td>
                            <td className="p-2 border-r border-border/50">2288.00</td>
                            <td className="p-2 border-r border-border/50">1525.33</td>
                            <td className="p-2 border-r border-border/50">0.00</td>
                            <td className="p-2 border-r border-border/50">0</td>
                            <td className="p-2 border-r border-border/50">0</td>
                            <td className="p-2 border-r border-border/50">0.00</td>
                            <td className="p-2 font-semibold">52000</td>
                          </tr>
                        ) : (
                          <tr>
                            <td
                              colSpan={21}
                              className="p-4 text-center text-muted-foreground italic"
                            >
                              No data generated.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compensation Info */}
                <div className="border border-border/60 rounded p-4 mb-4 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-[#84cc16]">
                    <input type="checkbox" className="accent-[#84cc16] size-3" defaultChecked />{" "}
                    Compensation Info
                  </div>
                  <div className="overflow-x-auto rounded border border-border/50">
                    <table className="w-full text-[10px]">
                      <thead className="bg-[#f2f9f2] border-b border-border/50 text-[#84cc16]">
                        <tr>
                          <th className="p-2 font-medium border-r border-border/50 w-12 text-center">
                            #
                          </th>
                          <th className="p-2 font-medium border-r border-border/50 text-left">
                            Compensation For
                          </th>
                          <th className="p-2 font-medium border-r border-border/50 text-right w-32">
                            Amount
                          </th>
                          <th className="p-2 font-medium w-12 text-center text-muted-foreground/50">
                            <Plus className="size-3.5 mx-auto" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {compensations.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border/30 last:border-0 hover:bg-muted/10"
                          >
                            <td className="p-2 border-r border-border/50 text-center text-muted-foreground">
                              {i + 1}
                            </td>
                            <td className="p-0 border-r border-border/50">
                              <Input
                                value={row.for}
                                onChange={(e: any) =>
                                  setCompensations((p) =>
                                    p.map((r, idx) =>
                                      idx === i ? { ...r, for: e.target.value } : r,
                                    ),
                                  )
                                }
                                placeholder="Compensation For"
                                className="border-0 shadow-none h-8 text-[10px] rounded-none focus:ring-0"
                              />
                            </td>
                            <td className="p-0 border-r border-border/50">
                              <Input
                                value={row.amount}
                                onChange={(e: any) =>
                                  setCompensations((p) =>
                                    p.map((r, idx) =>
                                      idx === i ? { ...r, amount: e.target.value } : r,
                                    ),
                                  )
                                }
                                placeholder="Amount"
                                type="number"
                                className="border-0 shadow-none h-8 text-[10px] text-right font-mono rounded-none focus:ring-0"
                              />
                            </td>
                            <td className="p-1 text-center">
                              {i === compensations.length - 1 ? (
                                <button
                                  onClick={() =>
                                    setCompensations((p) => [...p, { for: "", amount: "" }])
                                  }
                                  className="p-1 rounded text-muted-foreground border border-border/50 hover:bg-muted/40 transition-colors mx-auto block"
                                >
                                  <Plus className="size-3" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setCompensations((p) => p.filter((_, idx) => idx !== i))
                                  }
                                  className="p-1 rounded text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-colors mx-auto block"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Earn Leave Info */}
                <div className="border border-border/60 rounded p-4 mb-4 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-[#3b82f6]">
                    <input type="checkbox" className="accent-[#3b82f6] size-3" defaultChecked />{" "}
                    Earn Leave Info
                  </div>
                  <div className="flex gap-4 items-end mb-6">
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">
                        EL Year:
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]">From</span>
                        <Select className="w-20">
                          <option>2023</option>
                        </Select>
                        <span className="text-[10px]">To</span>
                        <Select className="w-20">
                          <option>2026</option>
                        </Select>
                      </div>
                    </div>
                    <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-colors tracking-wider">
                      Generate
                    </button>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3 text-[11px] font-bold">
                    <div className="flex-1 flex justify-between pr-20">
                      <span>Annual Leave Days</span>
                      <span>:</span>
                    </div>
                    <div className="w-24 text-right">{empLoaded ? elBalanceDays : ""}</div>
                    <div className="flex-1 flex justify-between pl-20 pr-20">
                      <span>Pay Amount</span>
                      <span>:</span>
                    </div>
                    <div className="w-24 text-right">{empLoaded ? elPayment : ""}</div>
                  </div>
                </div>

                {/* Service Benefit Info */}
                <div className="border border-border/60 rounded p-4 mb-4 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-[#3b82f6]">
                    <input type="checkbox" className="accent-[#3b82f6] size-3" defaultChecked />{" "}
                    Service Benefit Info
                  </div>
                  <div className="flex items-center gap-16 mb-4">
                    <div className="flex-1 flex justify-between font-bold text-[11px] pr-20">
                      <span>Tenure of work</span>
                      <span>: {empLoaded ? "0 Year, 0 Month, 0 Day" : ""}</span>
                    </div>
                    <div className="flex-1">
                      <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-colors tracking-wider">
                        Generate
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3 text-[11px] font-bold">
                    <div className="flex-1 flex justify-between pr-20">
                      <span>Service Days</span>
                      <span>:</span>
                    </div>
                    <div className="w-24 text-right">{empLoaded ? "1080" : ""}</div>
                    <div className="flex-1 flex justify-between pl-20 pr-20">
                      <span>Pay Amount</span>
                      <span>:</span>
                    </div>
                    <div className="w-24 text-right">{empLoaded ? serviceBenefitTotal : ""}</div>
                  </div>
                </div>

                {/* Deduction Info */}
                <div className="border border-border/60 rounded p-4 mb-6 bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-rose-500">
                    <input type="checkbox" className="accent-rose-500 size-3" defaultChecked />{" "}
                    Deduction Info
                  </div>
                  <div className="overflow-x-auto rounded border border-border/50">
                    <table className="w-full text-[10px]">
                      <thead className="bg-rose-50 border-b border-border/50 text-rose-600">
                        <tr>
                          <th className="p-2 font-medium border-r border-border/50 w-12 text-center">
                            #
                          </th>
                          <th className="p-2 font-medium border-r border-border/50 text-left">
                            Deduction For
                          </th>
                          <th className="p-2 font-medium border-r border-border/50 text-right w-32">
                            Amount
                          </th>
                          <th className="p-2 font-medium w-12 text-center text-rose-600/50">
                            <Plus className="size-3.5 mx-auto" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {deductions.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border/30 last:border-0 hover:bg-muted/10"
                          >
                            <td className="p-2 border-r border-border/50 text-center text-muted-foreground">
                              {i + 1}
                            </td>
                            <td className="p-0 border-r border-border/50">
                              <Input
                                value={row.for}
                                onChange={(e: any) =>
                                  setDeductions((p) =>
                                    p.map((r, idx) =>
                                      idx === i ? { ...r, for: e.target.value } : r,
                                    ),
                                  )
                                }
                                placeholder="Deduction For"
                                className="border-0 shadow-none h-8 text-[10px] rounded-none focus:ring-0"
                              />
                            </td>
                            <td className="p-0 border-r border-border/50">
                              <Input
                                value={row.amount}
                                onChange={(e: any) =>
                                  setDeductions((p) =>
                                    p.map((r, idx) =>
                                      idx === i ? { ...r, amount: e.target.value } : r,
                                    ),
                                  )
                                }
                                placeholder="Amount"
                                type="number"
                                className="border-0 shadow-none h-8 text-[10px] text-right font-mono rounded-none focus:ring-0"
                              />
                            </td>
                            <td className="p-1 text-center">
                              {i === deductions.length - 1 ? (
                                <button
                                  onClick={() =>
                                    setDeductions((p) => [...p, { for: "", amount: "" }])
                                  }
                                  className="p-1 rounded text-muted-foreground border border-border/50 hover:bg-muted/40 transition-colors mx-auto block"
                                >
                                  <Plus className="size-3" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setDeductions((p) => p.filter((_, idx) => idx !== i))
                                  }
                                  className="p-1 rounded text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 transition-colors mx-auto block"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Summary & Actions ── */}
                <div className="flex justify-end mb-6">
                  <div className="w-full md:w-[45%] border border-border/50 rounded p-4 space-y-2.5 font-bold text-[11px] bg-card shadow-sm">
                    <div className="flex justify-between">
                      <span>Total Payable</span>
                      <span>: {empLoaded ? "109317.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Notice Pay-D Days</span>
                      <span>: {empLoaded ? "3000.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance</span>
                      <span>: {empLoaded ? "1000.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile Bill</span>
                      <span>: {empLoaded ? "500.00" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Stamp</span>
                      <span>: {empLoaded ? "10.00" : ""}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2.5 mt-2.5">
                      <span>Grand Total</span>
                      <span>: {empLoaded ? grandTotal : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NetPayable</span>
                      <span>: {empLoaded ? netPayment : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50/80 border-t border-border/50 p-4 rounded-b flex items-center justify-between">
                <button
                  onClick={handleCalculate}
                  className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-bold rounded transition-colors shadow-sm tracking-wide"
                >
                  CALCULATION
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-400 border border-gray-200 text-[11px] font-bold rounded cursor-not-allowed tracking-wide"
                  disabled
                >
                  SUBMIT
                </button>
              </div>
            </div>
          )}

          {/* ─── DETAIL / PRINT VIEW ────────────────────────────────────────── */}
          {view === "detail" && (
            <div className="bg-white text-black border border-border/60 rounded-lg shadow-sm p-8 max-w-5xl mx-auto w-full relative">
              <button
                onClick={() => window.print()}
                className="absolute top-4 right-4 p-2 bg-muted/20 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded transition-colors print:hidden"
              >
                <Printer className="size-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold">{emp.company.replace(" (PSL-Operation)", "")}</h2>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205
                </p>
                <h3 className="text-lg font-bold text-blue-600 mt-2">Final Settlement</h3>
              </div>

              {/* Top Info Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-8 text-[11px]">
                {/* Employee Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">
                    Employee Info
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Employee ID</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{employeeId}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Employee Name</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Joining Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.joiningDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Designation</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.designation}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Department</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.department}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Line</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.line}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Grade</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.grade}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Gross Salary</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.grossSalary}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Basic Salary</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.basicSalary}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Tenure of work</span>
                      <span className="w-4">:</span>
                      <span className="flex-1 font-bold">{emp.tenure}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Day Shortage</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{emp.dayShortage}</span>
                    </div>
                  </div>
                </div>

                {/* Settlement Info */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 border-b border-gray-300 pb-1">
                    Settlement Info
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Code</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">9348</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Settlement Type</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{settlementType}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Settlement Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{settlementDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Resign Apply Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{resignApplyDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Resign Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{resignDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Last Working Date</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{lastWorkingDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Notice Period</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{noticePeriod} Days</span>
                    </div>
                    <div className="flex">
                      <span className="w-1/3 font-semibold text-gray-600">Comments</span>
                      <span className="w-4">:</span>
                      <span className="flex-1">{comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Area Grid */}
              <div className="grid grid-cols-2 gap-x-12 items-start text-[10px]">
                {/* Left Column: Payment Info (Earnings + Deductions) */}
                <div>
                  <h4 className="font-bold text-[#4caf50] mb-2 text-[11px]">Payment Info</h4>
                  <div className="border border-gray-300">
                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-gray-300">
                      Earning Sectors
                    </div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Salary (Up to {lastWorkingDate})
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{paySalary}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Attendance Bonus</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{attendanceBonus}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">EID Bonus</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Earn Leave ({elBalanceDays} Days)
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{elPayment}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Over Time ({otHour} Hours)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{otPayment}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Provident Fund (PF + CPF)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Night & Tiffin Bill</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{tiffinNightBill}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Other Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Earning</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">
                        {(parseFloat(paySalary) || 0) +
                          (parseFloat(attendanceBonus) || 0) +
                          (parseFloat(elPayment) || 0) +
                          (parseFloat(otPayment) || 0) +
                          (parseFloat(tiffinNightBill) || 0)}
                      </span>
                    </div>

                    <div className="bg-gray-100 px-3 py-1.5 italic font-bold border-b border-t border-gray-300">
                      Deduction Sectors
                    </div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex">
                        <span className="flex-1 text-gray-600">
                          Tenure of Notice ({noticeShortage} Days)
                        </span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">0.00</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Absent ({absentDays} Days)</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{absentDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Other Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{othersDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Advance Payment</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{advanceDeduction}</span>
                      </div>
                      <div className="flex">
                        <span className="flex-1 text-gray-600">Revenue Stamp</span>
                        <span className="w-16">: Tk.</span>
                        <span className="w-20 text-right">{revStamp}</span>
                      </div>
                    </div>
                    <div className="flex bg-gray-100 p-2 font-bold mt-1">
                      <span className="flex-1 text-right pr-4">Total Deduction</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">
                        {(parseFloat(absentDeduction) || 0) +
                          (parseFloat(othersDeduction) || 0) +
                          (parseFloat(advanceDeduction) || 0) +
                          (parseFloat(revStamp) || 0)}
                      </span>
                    </div>

                    <div className="flex bg-[#f9cbbd] text-[#c0431b] p-3 font-bold mt-1 text-[11px]">
                      <span className="flex-1 text-right pr-4">Net Payable</span>
                      <span className="w-16">: Tk.</span>
                      <span className="w-20 text-right">{netPayment}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Other Details */}
                <div className="space-y-6 pt-6">
                  {/* Earn Leave */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Earn Leave Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">Type</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Days</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Rate</th>
                          <th className="text-right pb-1 font-semibold text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">EL Balance</td>
                          <td className="text-right pt-2">{elBalanceDays}</td>
                          <td className="text-right pt-2">
                            {(
                              (parseFloat(elPayment) || 0) / (parseFloat(elBalanceDays) || 1)
                            ).toFixed(2)}
                          </td>
                          <td className="text-right pt-2">{elPayment}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {elPayment}
                    </div>
                  </div>

                  {/* Service Benefit */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Service Benefit Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">
                            Service Benefit Year
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Payable Days Per Year(SB)
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Service Benefit (Total)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">{serviceBenefitYear}</td>
                          <td className="text-right pt-2">{payableDaysPerYear}</td>
                          <td className="text-right pt-2">{serviceBenefitTotal}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {serviceBenefitTotal}
                    </div>
                  </div>

                  {/* Compensation Details */}
                  <div>
                    <h4 className="font-bold text-gray-500 italic mb-2 text-[10px]">
                      Compensation Details
                    </h4>
                    <table className="w-full">
                      <thead className="border-b border-gray-300">
                        <tr>
                          <th className="text-left pb-1 font-semibold text-gray-600">
                            Compensation Remarks
                          </th>
                          <th className="text-right pb-1 font-semibold text-gray-600">
                            Compensation Amt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pt-2">{compensationRemarks || "N/A"}</td>
                          <td className="text-right pt-2">{compensationAmt}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="bg-gray-100 px-3 py-1.5 text-right font-bold mt-2">
                      Total Tk. {compensationAmt}
                    </div>
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
