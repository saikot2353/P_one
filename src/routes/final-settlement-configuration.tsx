import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Settings,
  CalendarClock,
  Save,
  Plus,
  Trash2,
  FileText,
  Edit,
  X
} from "lucide-react";

export const Route = createFileRoute("/final-settlement-configuration")({
  head: () => ({
    meta: [
      { title: "Final Settlement Configuration — CRIPTON HRIS" },
      { name: "description", content: "Configure final settlement rules, types, and service periods." },
    ],
  }),
  component: FinalSettlementConfigPage,
});

const TABS = [
  { id: "notice", label: "Notice Deduction", icon: FileText },
  { id: "type", label: "Final Settlement Type", icon: Settings },
  { id: "service", label: "Service Period Setup", icon: CalendarClock },
];

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type SettlementTypePolicy = {
  id: string;
  name: string;
  legalReference: string;           // e.g. "Section 27, BLA 2006"
  description: string;              // Plain-language description
  noticePeriodDays: number;         // Notice period in days (employer gives to worker, or worker gives)
  noticePaidByEmployer: boolean;    // Employer pays wages in lieu of notice (Termination)
  noticeDeductedFromEmployee: boolean; // Worker must pay wages in lieu if notice not served (Resignation)
  // Compensation (from base wages per year of service, or gratuity - whichever is higher)
  compensationDaysPerYear_3yrs: number;       // Days per year for 3+ years service
  compensationDaysPerYear_5yrs: number;       // Days per year for 5+ years service
  compensationDaysPerYear_below10yrs: number; // Days per year for <10 years service
  compensationDaysPerYear_above10yrs: number; // Days per year for >=10 years service (gratuity also uses this)
  minServiceMonthsForCompensation: number;    // Min months before compensation is applicable
  isCompensationApplicable: boolean;          // Is any compensation applicable at all?
  // Leave
  earnedLeaveEncashable: boolean;             // Encash unused annual leave (Section 11)
  // Gratuity
  isGratuityApplicable: boolean;              // Gratuity eligibility (Section 2(10))
  minServiceMonthsForGratuity: number;        // Minimum service for gratuity (6 months = 1 year under 14)
  // Provident Fund
  isProvidentFundPayable: boolean;            // Section 29 — PF always payable regardless of reason
  // Special flags
  isMisconductBased: boolean;                 // True for Dismissal, Removal (impacts eligibility)
  isDeathCase: boolean;                       // For Death in Service special handling
};

export type NoticePeriodPolicy = {
  id: string;
  employeeType: string;
  paymentBasis: string;
  noticeDaysRequired: number;
  legalReference: string;
  description: string;
};

export type ServicePeriodPolicy = {
  id: string;
  benefitType: string;
  minServiceMonthsRequired: number;
  legalReference: string;
  description: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Default Policies (Bangladesh Labour Act, 2006 — as amended by Act XXX of 2013)
// ─────────────────────────────────────────────────────────────────────────────

const defaultSettlementPolicies: SettlementTypePolicy[] = [
  {
    id: "1",
    name: "Resignation",
    legalReference: "Section 27, BLA 2006",
    description: "Worker voluntarily resigns. Must give 60-day notice (permanent/monthly). Compensation payable only after 5 years of service.",
    noticePeriodDays: 60,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: true,
    compensationDaysPerYear_3yrs: 0,          // 3+ years: not eligible for resignation comp
    compensationDaysPerYear_5yrs: 14,        // 5+ years: 14 days/year (Section 27(4)(a))
    compensationDaysPerYear_below10yrs: 14,  // 5–<10 years: 14 days/year
    compensationDaysPerYear_above10yrs: 30,  // ≥10 years: 30 days/year
    minServiceMonthsForCompensation: 60,     // 5 years minimum (Section 27(4)(a))
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "2",
    name: "Termination by Employer",
    legalReference: "Section 26, BLA 2006",
    description: "Employer terminates a permanent worker. Must give 120-day notice (monthly rated) or pay in lieu. Compensation: 30 days' wages per year.",
    noticePeriodDays: 120,
    noticePaidByEmployer: true,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,
    compensationDaysPerYear_above10yrs: 45,  // Gratuity rate for >10 yrs (Section 2(10))
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "3",
    name: "Retrenchment",
    legalReference: "Section 20, BLA 2006",
    description: "Employer retrenches on grounds of redundancy. Must give 1-month notice or pay in lieu. 30 days' wages per completed year or gratuity.",
    noticePeriodDays: 30,
    noticePaidByEmployer: true,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,
    compensationDaysPerYear_above10yrs: 45,
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "4",
    name: "Discharge",
    legalReference: "Section 22, BLA 2006",
    description: "Worker discharged for physical/mental incapacity or continued ill-health (certified by a registered medical practitioner). 30 days' wages per year or gratuity.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,
    compensationDaysPerYear_above10yrs: 45,
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "5",
    name: "Dismissal (Misconduct)",
    legalReference: "Section 23(1)(b) & 23(3), BLA 2006",
    description: "Worker dismissed for misconduct after proper enquiry. Compensation is 15 days/year UNLESS dismissed for theft, fraud, arson or riot (Section 23(4)(b) & (g)) — in which case NO compensation.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 15,
    compensationDaysPerYear_5yrs: 15,
    compensationDaysPerYear_below10yrs: 15,  // Section 23(3) — 15 days/year
    compensationDaysPerYear_above10yrs: 15,  // No higher tier for misconduct
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,          // HR can toggle this off for serious offences
    earnedLeaveEncashable: true,             // Other lawful dues still paid (Section 23(3) proviso)
    isGratuityApplicable: false,             // No gratuity for dismissed
    minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true,            // Section 29 — PF always payable
    isMisconductBased: true,
    isDeathCase: false,
  },
  {
    id: "6",
    name: "Removal (Minor Punishment)",
    legalReference: "Section 23(2)(a), BLA 2006",
    description: "Worker removed as a lighter punishment for misconduct (instead of dismissal). Compensation: 15 days/year under Section 23(3). Other dues remain payable.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 15,
    compensationDaysPerYear_5yrs: 15,
    compensationDaysPerYear_below10yrs: 15,
    compensationDaysPerYear_above10yrs: 15,
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: false,
    minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true,
    isMisconductBased: true,
    isDeathCase: false,
  },
  {
    id: "7",
    name: "Retirement (Age-Based)",
    legalReference: "Section 28, BLA 2006",
    description: "Worker retires upon reaching 60 years of age (Section 28(1)). Entitled to full dues as per Section 26(4) or applicable service rules — i.e., 30 days/year (or 45 if gratuity is higher).",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,
    compensationDaysPerYear_above10yrs: 45,
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "8",
    name: "Voluntary Retirement (25 Yrs Service)",
    legalReference: "Section 2(1), BLA 2006",
    description: "Worker voluntarily retires after completing 25 years of continuous service. Deemed 'retirement' under Section 2(1) and entitled to full retirement benefits as per Section 28(3).",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,
    compensationDaysPerYear_above10yrs: 45,
    minServiceMonthsForCompensation: 300,    // 25 years = 300 months
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "9",
    name: "Death in Service",
    legalReference: "Section 19, BLA 2006 (Amended 2013)",
    description: "Worker dies during service (must have 2+ years of continuous service). Compensation: 30 days/year (or 45 days/year if death occurred at the workplace or due to a work accident). Paid to nominee or legal dependent. Plus retirement benefit that would have been due.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,  // Standard: 30 days/year (Section 19)
    compensationDaysPerYear_above10yrs: 45,  // On-site/accident death: 45 days/year (Section 19)
    minServiceMonthsForCompensation: 24,     // 2 years minimum (Section 19)
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: true,
  },
  {
    id: "10",
    name: "Absconding / Abandonment",
    legalReference: "Section 27(3A), BLA 2006 (Amended 2013)",
    description: "Worker absent >10 days without notice/permission. Employer issues show-cause, gives 10+7 days to respond. If no response, worker is 'released from service' from the date of absence — treated as resignation without notice pay/compensation.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 0,
    compensationDaysPerYear_5yrs: 0,
    compensationDaysPerYear_below10yrs: 0,   // No compensation for abandonment
    compensationDaysPerYear_above10yrs: 0,
    minServiceMonthsForCompensation: 0,
    isCompensationApplicable: false,
    earnedLeaveEncashable: true,             // Other lawful dues still payable
    isGratuityApplicable: false,
    minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true,            // PF always payable (Section 29)
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "11",
    name: "Contract Expiry",
    legalReference: "Section 4(5), BLA 2006",
    description: "Temporary worker's fixed-term contract expires. If not renewed, no notice or termination compensation is required (as the work itself is temporary in nature). Earned leave and PF dues are still payable.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 0,
    compensationDaysPerYear_5yrs: 0,
    compensationDaysPerYear_below10yrs: 0,
    compensationDaysPerYear_above10yrs: 0,
    minServiceMonthsForCompensation: 0,
    isCompensationApplicable: false,
    earnedLeaveEncashable: true,
    isGratuityApplicable: false,
    minServiceMonthsForGratuity: 0,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
  {
    id: "12",
    name: "Mutual Separation",
    legalReference: "As per mutual agreement / Company Policy",
    description: "Employment ends by mutual agreement between employer and worker. Terms are typically negotiated; at minimum all statutory dues (gratuity, PF, leave encashment) must be paid.",
    noticePeriodDays: 0,
    noticePaidByEmployer: false,
    noticeDeductedFromEmployee: false,
    compensationDaysPerYear_3yrs: 30,
    compensationDaysPerYear_5yrs: 30,
    compensationDaysPerYear_below10yrs: 30,  // At minimum as per agreement
    compensationDaysPerYear_above10yrs: 45,
    minServiceMonthsForCompensation: 12,
    isCompensationApplicable: true,
    earnedLeaveEncashable: true,
    isGratuityApplicable: true,
    minServiceMonthsForGratuity: 6,
    isProvidentFundPayable: true,
    isMisconductBased: false,
    isDeathCase: false,
  },
];

const defaultNoticePolicies: NoticePeriodPolicy[] = [
  { id: "n1", employeeType: "Permanent", paymentBasis: "Monthly Rated", noticeDaysRequired: 120, legalReference: "Section 26(1)(a), BLA 2006", description: "Employer must give 120 days written notice to terminate a permanent monthly-rated worker." },
  { id: "n2", employeeType: "Permanent", paymentBasis: "Other (Non-Monthly)", noticeDaysRequired: 60, legalReference: "Section 26(1)(b), BLA 2006", description: "Employer must give 60 days notice for other permanent workers." },
  { id: "n3", employeeType: "Temporary", paymentBasis: "Monthly Rated", noticeDaysRequired: 30, legalReference: "Section 26(2)(a), BLA 2006", description: "Employer terminates temporary monthly-rated worker: 30 days notice." },
  { id: "n4", employeeType: "Temporary", paymentBasis: "Other (Non-Monthly)", noticeDaysRequired: 14, legalReference: "Section 26(2)(b), BLA 2006", description: "Employer terminates other temporary workers: 14 days notice." },
  { id: "n5", employeeType: "Permanent (Resignation)", paymentBasis: "Any", noticeDaysRequired: 60, legalReference: "Section 27(1), BLA 2006", description: "Permanent worker resigning must give 60 days notice." },
  { id: "n6", employeeType: "Temporary (Resignation)", paymentBasis: "Monthly Rated", noticeDaysRequired: 30, legalReference: "Section 27(2)(a), BLA 2006", description: "Temporary monthly-rated worker resigning must give 30 days notice." },
  { id: "n7", employeeType: "Temporary (Resignation)", paymentBasis: "Other (Non-Monthly)", noticeDaysRequired: 14, legalReference: "Section 27(2)(b), BLA 2006", description: "Other temporary workers resigning must give 14 days notice." },
  { id: "n8", employeeType: "Retrenchment", paymentBasis: "Any", noticeDaysRequired: 30, legalReference: "Section 20(2)(a), BLA 2006", description: "Workers with ≥1 year service being retrenched: 1 month notice or pay in lieu." },
];

const defaultServicePolicies: ServicePeriodPolicy[] = [
  { id: "s1", benefitType: "Gratuity (Standard)", minServiceMonthsRequired: 6, legalReference: "Section 2(10), BLA 2006 (Amended 2013)", description: "30 days wages/year for service ≤10 years; 45 days wages/year for >10 years. Must complete at least 6 months (treated as 1 full year under Section 14)." },
  { id: "s2", benefitType: "Compensation — Termination / Retrenchment / Discharge", minServiceMonthsRequired: 12, legalReference: "Sections 20, 22, 26, BLA 2006", description: "Worker must have at least 1 year of continuous service to be eligible for compensation upon termination, retrenchment, or discharge." },
  { id: "s3", benefitType: "Compensation — Resignation (5–10 Years)", minServiceMonthsRequired: 60, legalReference: "Section 27(4)(a), BLA 2006", description: "For resignation: 14 days wages/year for 5 to <10 years continuous service." },
  { id: "s4", benefitType: "Compensation — Resignation (10+ Years)", minServiceMonthsRequired: 120, legalReference: "Section 27(4)(b), BLA 2006", description: "For resignation: 30 days wages/year for 10 or more years continuous service." },
  { id: "s5", benefitType: "Compensation — Dismissal / Removal (Misconduct)", minServiceMonthsRequired: 12, legalReference: "Section 23(3), BLA 2006 (Amended 2013)", description: "Worker dismissed/removed for misconduct gets 15 days wages/year if service ≥1 year. No compensation for theft, fraud, arson or riot (Section 23(4)(b) & (g))." },
  { id: "s6", benefitType: "Compensation — Death in Service", minServiceMonthsRequired: 24, legalReference: "Section 19, BLA 2006 (Amended 2013)", description: "Death compensation requires at least 2 years continuous service. Rate: 30 days/year (off-premises) or 45 days/year (on-site/accident)." },
  { id: "s7", benefitType: "Provident Fund (Employer Contribution)", minServiceMonthsRequired: 12, legalReference: "Section 29, BLA 2006", description: "Worker cannot be deprived of PF (including employer contribution) on any ground of separation — per Section 29, this is unconditional." },
  { id: "s8", benefitType: "Earned Leave Encashment", minServiceMonthsRequired: 12, legalReference: "Section 11, BLA 2006", description: "Any unused annual leave must be encashed upon separation regardless of the type — termination, resignation, retrenchment, discharge, retirement, dismissal." },
  { id: "s9", benefitType: "Lay-off Compensation", minServiceMonthsRequired: 12, legalReference: "Section 16, BLA 2006", description: "Laid-off workers with ≥1 year service get half of basic wages + dearness allowance per lay-off day. Max 45 days/calendar year without further agreement." },
];


function FinalSettlementConfigPage() {
  const [activeTab, setActiveTab] = useState("notice");
  const [isMounted, setIsMounted] = useState(false);

  // Settlement Types State
  const [settlementTypes, setSettlementTypes] = useState<SettlementTypePolicy[]>(defaultSettlementPolicies);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<SettlementTypePolicy | null>(null);

  // Notice Policies State
  const [noticePolicies, setNoticePolicies] = useState<NoticePeriodPolicy[]>(defaultNoticePolicies);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticePeriodPolicy | null>(null);

  // Service Period Policies State
  const [servicePolicies, setServicePolicies] = useState<ServicePeriodPolicy[]>(defaultServicePolicies);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePeriodPolicy | null>(null);

  useEffect(() => {
    const storedTypes = localStorage.getItem("fs_settlement_types_v3");
    if (storedTypes) {
      setSettlementTypes(JSON.parse(storedTypes));
    } else {
      localStorage.setItem("fs_settlement_types_v3", JSON.stringify(defaultSettlementPolicies));
    }

    const storedNotice = localStorage.getItem("fs_notice_policies");
    if (storedNotice) {
      setNoticePolicies(JSON.parse(storedNotice));
    } else {
      localStorage.setItem("fs_notice_policies", JSON.stringify(defaultNoticePolicies));
    }

    const storedService = localStorage.getItem("fs_service_policies");
    if (storedService) {
      setServicePolicies(JSON.parse(storedService));
    } else {
      localStorage.setItem("fs_service_policies", JSON.stringify(defaultServicePolicies));
    }

    setIsMounted(true);
  }, []);

  const handleSaveTypePolicy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingType) return;
    if (!editingType.name.trim()) return alert("Name is required.");

    const updated = editingType.id 
      ? settlementTypes.map(t => t.id === editingType.id ? editingType : t)
      : [...settlementTypes, { ...editingType, id: Date.now().toString() }];
    
    setSettlementTypes(updated);
    localStorage.setItem("fs_settlement_types_v3", JSON.stringify(updated));
    setIsTypeModalOpen(false);
    setEditingType(null);
  };

  const handleDeleteType = (id: string) => {
    const updated = settlementTypes.filter((t) => t.id !== id);
    setSettlementTypes(updated);
    localStorage.setItem("fs_settlement_types_v3", JSON.stringify(updated));
  };

  const handleSaveNoticePolicy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNotice) return;
    if (!editingNotice.employeeType.trim()) return alert("Employee Type is required.");

    const updated = editingNotice.id 
      ? noticePolicies.map(t => t.id === editingNotice.id ? editingNotice : t)
      : [...noticePolicies, { ...editingNotice, id: Date.now().toString() }];
    
    setNoticePolicies(updated);
    localStorage.setItem("fs_notice_policies", JSON.stringify(updated));
    setIsNoticeModalOpen(false);
    setEditingNotice(null);
  };

  const handleDeleteNotice = (id: string) => {
    const updated = noticePolicies.filter((t) => t.id !== id);
    setNoticePolicies(updated);
    localStorage.setItem("fs_notice_policies", JSON.stringify(updated));
  };

  const handleSaveServicePolicy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;
    if (!editingService.benefitType.trim()) return alert("Benefit Type is required.");

    const updated = editingService.id 
      ? servicePolicies.map(t => t.id === editingService.id ? editingService : t)
      : [...servicePolicies, { ...editingService, id: Date.now().toString() }];
    
    setServicePolicies(updated);
    localStorage.setItem("fs_service_policies", JSON.stringify(updated));
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    const updated = servicePolicies.filter((t) => t.id !== id);
    setServicePolicies(updated);
    localStorage.setItem("fs_service_policies", JSON.stringify(updated));
  };

  const inputClass = "w-full h-10 px-3.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-semibold transition-all outline-none";
  const labelClass = "text-xs font-bold text-muted-foreground uppercase mb-1 block";

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-muted/10 w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Breadcrumb & Header */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="size-3.5" />
                  <span>Payroll</span>
                  <ChevronRight className="size-3.5" />
                  <span>Final Settlement</span>
                  <ChevronRight className="size-3.5" />
                  <span className="text-primary font-bold">Configuration</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Settings className="size-6 text-primary" />
                  Final Settlement Configuration
                </h1>
              </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 pb-5 border-b border-border/40 mb-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Notice Deduction */}
            {activeTab === "notice" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Notice Period Policies</h3>
                    <p className="text-sm text-muted-foreground">Configure notice periods based on employment types and payment basis.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingNotice({ id: "", employeeType: "Permanent", paymentBasis: "Monthly Rated", noticeDaysRequired: 30, legalReference: "", description: "" });
                      setIsNoticeModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="size-4" />
                    Add Policy
                  </Button>
                </div>

                <div className="overflow-x-auto border border-border/50 rounded-xl bg-muted/5 shadow-inner">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80">
                        <th className="px-5 py-3.5">Employee Type</th>
                        <th className="px-5 py-3.5">Payment Basis</th>
                        <th className="px-5 py-3.5 text-center">Notice Required</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 bg-card">
                      {noticePolicies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-foreground block">{policy.employeeType}</span>
                            {policy.legalReference && <span className="text-[10px] text-primary font-semibold mt-0.5 block">{policy.legalReference}</span>}
                            {policy.description && <span className="text-[11px] text-muted-foreground mt-1 block max-w-md whitespace-normal leading-relaxed" title={policy.description}>{policy.description}</span>}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-xs font-medium text-foreground bg-muted border border-border/60 px-2 py-1 rounded-md">{policy.paymentBasis}</span>
                          </td>
                          <td className="px-5 py-4 text-center font-mono font-semibold text-foreground text-sm whitespace-nowrap">
                            {policy.noticeDaysRequired} Days
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => { setEditingNotice({ ...policy }); setIsNoticeModalOpen(true); }}
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-blue-500/20"
                                title="Edit"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNotice(policy.id)}
                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Final Settlement Type */}
            {activeTab === "type" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Final Settlement Types & Policies</h3>
                    <p className="text-sm text-muted-foreground">Manage dynamic settlement policies based on Bangladesh Labour Act standards.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingType({ id: "", name: "", legalReference: "", description: "", noticePeriodDays: 0, noticePaidByEmployer: false, noticeDeductedFromEmployee: false, compensationDaysPerYear_3yrs: 30, compensationDaysPerYear_5yrs: 30, compensationDaysPerYear_below10yrs: 30, compensationDaysPerYear_above10yrs: 45, minServiceMonthsForCompensation: 12, isCompensationApplicable: true, earnedLeaveEncashable: true, isGratuityApplicable: true, minServiceMonthsForGratuity: 6, isProvidentFundPayable: true, isMisconductBased: false, isDeathCase: false });
                      setIsTypeModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="size-4" />
                    Add Policy
                  </Button>
                </div>

                <div className="overflow-x-auto border border-border/50 rounded-xl bg-muted/5 shadow-inner">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80">
                        <th className="px-5 py-3.5">Settlement Type</th>
                        <th className="px-5 py-3.5 text-center">Notice (Days)</th>
                        <th className="px-5 py-3.5 text-center">Comp. Rate</th>
                        <th className="px-5 py-3.5">Benefits / Flags</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 bg-card">
                      {settlementTypes.map((type) => (
                        <tr key={type.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-foreground block">{type.name}</span>
                            <span className="text-[10px] text-primary font-semibold mt-0.5 block">{type.legalReference}</span>
                            <span className="text-[11px] text-muted-foreground mt-1 block max-w-md whitespace-normal leading-relaxed" title={type.description}>{type.description}</span>
                          </td>
                          <td className="px-5 py-4 text-center font-mono font-semibold text-foreground text-sm whitespace-nowrap">
                            {type.noticePeriodDays} Days
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            {type.isCompensationApplicable ? (
                              <div className="flex flex-col gap-1 items-center font-semibold text-[9px]">
                                <span className="bg-muted border border-border/60 px-2 py-0.5 rounded text-foreground block w-full text-center">3yr+: <strong>{type.compensationDaysPerYear_3yrs ?? 0}d</strong></span>
                                <span className="bg-muted border border-border/60 px-2 py-0.5 rounded text-foreground block w-full text-center">5yr+: <strong>{type.compensationDaysPerYear_5yrs ?? 0}d</strong></span>
                                <span className="bg-muted border border-border/60 px-2 py-0.5 rounded text-foreground block w-full text-center">&lt;10yr: <strong>{type.compensationDaysPerYear_below10yrs ?? 0}d</strong></span>
                                <span className="bg-muted border border-border/60 px-2 py-0.5 rounded text-foreground block w-full text-center">&ge;10yr: <strong>{type.compensationDaysPerYear_above10yrs ?? 0}d</strong></span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground border border-border/40">N/A</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                              {type.noticePaidByEmployer && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm">Notice Pay</span>}
                              {type.noticeDeductedFromEmployee && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm">Notice Ded.</span>}
                              {type.earnedLeaveEncashable && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">EL Encash</span>}
                              {type.isGratuityApplicable && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-violet-500/10 text-violet-600 border border-violet-500/20 shadow-sm">Gratuity</span>}
                              {type.isProvidentFundPayable && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 shadow-sm">PF</span>}
                              {type.isMisconductBased && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-sm">Misconduct</span>}
                              {type.isDeathCase && <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-500/10 text-slate-600 border border-slate-500/20 shadow-sm">Death</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => { setEditingType({ ...type }); setIsTypeModalOpen(true); }}
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-blue-500/20"
                                title="Edit"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteType(type.id)}
                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Service Period Setup */}
            {activeTab === "service" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/30 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Service Period Requirements</h3>
                    <p className="text-sm text-muted-foreground">Configure minimum service durations required for different types of benefits.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingService({ id: "", benefitType: "Gratuity", minServiceMonthsRequired: 6, legalReference: "", description: "" });
                      setIsServiceModalOpen(true);
                    }}
                    className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="size-4" />
                    Add Policy
                  </Button>
                </div>

                <div className="overflow-x-auto border border-border/50 rounded-xl bg-muted/5 shadow-inner">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80">
                        <th className="px-5 py-3.5">Benefit Type</th>
                        <th className="px-5 py-3.5 text-center">Min. Service Required</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 bg-card">
                      {servicePolicies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-foreground block">{policy.benefitType}</span>
                            {policy.legalReference && <span className="text-[10px] text-primary font-semibold mt-0.5 block">{policy.legalReference}</span>}
                            {policy.description && <span className="text-[11px] text-muted-foreground mt-1 block max-w-lg whitespace-normal leading-relaxed" title={policy.description}>{policy.description}</span>}
                          </td>
                          <td className="px-5 py-4 text-center font-mono font-semibold text-foreground text-sm whitespace-nowrap">
                            {policy.minServiceMonthsRequired} Months 
                            <span className="text-[10px] text-violet-600 block font-bold mt-1">
                              ({policy.minServiceMonthsRequired >= 12
                                ? `${(policy.minServiceMonthsRequired / 12).toFixed(1).replace(/\.0$/, "")} Year(s)`
                                : `${policy.minServiceMonthsRequired} Month(s)`})
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => { setEditingService({ ...policy }); setIsServiceModalOpen(true); }}
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-blue-500/20"
                                title="Edit"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(policy.id)}
                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>


        {/* MODAL: Add / Edit Settlement Type Policy */}
        {isTypeModalOpen && editingType && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setIsTypeModalOpen(false); setEditingType(null); } }}
          >
            <div className="bg-card w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl rounded-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Sticky Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-card to-card">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-tight">
                        {editingType.id ? "Edit Settlement Policy" : "New Settlement Policy"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">Bangladesh Labour Act, 2006</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsTypeModalOpen(false); setEditingType(null); }}
                  className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <form onSubmit={handleSaveTypePolicy} className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 p-7 space-y-6">

                  {/* ── Section 1: Basic Info ───────────────────────────── */}
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/30 border-b border-border/40">
                      <div className="size-1.5 rounded-full bg-primary"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Basic Information</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className={labelClass}>Policy Name <span className="text-rose-500">*</span></label>
                        <input
                          required type="text"
                          value={editingType.name}
                          onChange={(e) => setEditingType({...editingType, name: e.target.value})}
                          className={inputClass}
                          placeholder="e.g. Resignation, Termination by Employer"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Legal Reference (BLA Section)</label>
                        <input
                          type="text"
                          value={editingType.legalReference}
                          onChange={(e) => setEditingType({...editingType, legalReference: e.target.value})}
                          className={inputClass}
                          placeholder="e.g. Section 27, BLA 2006"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Notice Period (Days)</label>
                        <input
                          type="number" min={0}
                          value={editingType.noticePeriodDays}
                          onChange={(e) => setEditingType({...editingType, noticePeriodDays: Number(e.target.value)})}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className={labelClass}>Description / Notes</label>
                        <textarea
                          rows={2}
                          value={editingType.description}
                          onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                          placeholder="Brief description of this settlement type and applicable conditions..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Section 2: Compensation & Gratuity ─────────────── */}
                  <div className="rounded-xl border border-blue-500/20 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-blue-500/5 border-b border-blue-500/15">
                      <div className="size-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600/80">Compensation &amp; Gratuity</span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Comp. Days/Year</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">Service 3+ years</label>
                          <input
                            type="number" min={0}
                            value={editingType.compensationDaysPerYear_3yrs}
                            onChange={(e) => setEditingType({...editingType, compensationDaysPerYear_3yrs: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Comp. Days/Year</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">Service 5+ years</label>
                          <input
                            type="number" min={0}
                            value={editingType.compensationDaysPerYear_5yrs}
                            onChange={(e) => setEditingType({...editingType, compensationDaysPerYear_5yrs: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Comp. Days/Year</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">Service &lt; 10 years</label>
                          <input
                            type="number" min={0}
                            value={editingType.compensationDaysPerYear_below10yrs}
                            onChange={(e) => setEditingType({...editingType, compensationDaysPerYear_below10yrs: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Comp. Days/Year</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">Service ≥ 10 years</label>
                          <input
                            type="number" min={0}
                            value={editingType.compensationDaysPerYear_above10yrs}
                            onChange={(e) => setEditingType({...editingType, compensationDaysPerYear_above10yrs: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Min. Service for Comp.</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">In months</label>
                          <input
                            type="number" min={0}
                            value={editingType.minServiceMonthsForCompensation}
                            onChange={(e) => setEditingType({...editingType, minServiceMonthsForCompensation: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <label className={labelClass}>Min. Service for Gratuity</label>
                          <label className="text-[10px] text-muted-foreground block -mt-1">In months</label>
                          <input
                            type="number" min={0}
                            value={editingType.minServiceMonthsForGratuity}
                            onChange={(e) => setEditingType({...editingType, minServiceMonthsForGratuity: Number(e.target.value)})}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Section 3: Notice Rules ─────────────────────────── */}
                  <div className="rounded-xl border border-amber-500/20 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-amber-500/5 border-b border-amber-500/15">
                      <div className="size-1.5 rounded-full bg-amber-500"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600/80">Notice Period Rules</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${editingType.noticePaidByEmployer ? 'border-blue-500/40 bg-blue-500/5' : 'border-border/60 hover:bg-muted/20'}`}>
                        <input
                          type="checkbox"
                          checked={editingType.noticePaidByEmployer}
                          onChange={(e) => setEditingType({...editingType, noticePaidByEmployer: e.target.checked})}
                          className="mt-0.5 accent-primary size-4 flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm font-bold block text-foreground">Notice Pay by Employer</span>
                          <span className="text-[11px] text-muted-foreground leading-relaxed">Employer pays wages in lieu of serving the notice period (e.g. Termination, Retrenchment).</span>
                        </div>
                      </label>
                      <label className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${editingType.noticeDeductedFromEmployee ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/60 hover:bg-muted/20'}`}>
                        <input
                          type="checkbox"
                          checked={editingType.noticeDeductedFromEmployee}
                          onChange={(e) => setEditingType({...editingType, noticeDeductedFromEmployee: e.target.checked})}
                          className="mt-0.5 accent-primary size-4 flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm font-bold block text-foreground">Notice Deduction from Worker</span>
                          <span className="text-[11px] text-muted-foreground leading-relaxed">Deduct wages from worker's final payment if notice period was not served (e.g. Resignation).</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* ── Section 4: Eligibility & Benefits ──────────────── */}
                  <div className="rounded-xl border border-emerald-500/20 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-emerald-500/5 border-b border-emerald-500/15">
                      <div className="size-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600/80">Eligibility &amp; Benefits</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {([
                        { key: "isCompensationApplicable", label: "Compensation", desc: "Service-based monetary compensation applies.", color: "blue" },
                        { key: "earnedLeaveEncashable", label: "EL Encashment", desc: "Unused earned leave encashed (Section 11).", color: "emerald" },
                        { key: "isGratuityApplicable", label: "Gratuity", desc: "Section 2(10): 30/45 days per year.", color: "violet" },
                        { key: "isProvidentFundPayable", label: "Provident Fund", desc: "Section 29: PF always payable.", color: "cyan" },
                        { key: "isMisconductBased", label: "Misconduct-Based", desc: "Reduced/no gratuity for misconduct cases.", color: "rose" },
                        { key: "isDeathCase", label: "Death in Service", desc: "Section 19: Paid to nominee/dependent.", color: "gray" },
                      ] as const).map(({ key, label, desc, color }) => {
                        const checked = editingType[key] as boolean;
                        const colorMap: Record<string, string> = {
                          blue: checked ? "border-blue-500/40 bg-blue-500/5" : "border-border/50 hover:bg-muted/20",
                          emerald: checked ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/50 hover:bg-muted/20",
                          violet: checked ? "border-violet-500/40 bg-violet-500/5" : "border-border/50 hover:bg-muted/20",
                          cyan: checked ? "border-cyan-500/40 bg-cyan-500/5" : "border-border/50 hover:bg-muted/20",
                          rose: checked ? "border-rose-500/40 bg-rose-500/5" : "border-border/50 hover:bg-muted/20",
                          gray: checked ? "border-gray-500/40 bg-gray-500/5" : "border-border/50 hover:bg-muted/20",
                        };
                        const dotMap: Record<string, string> = {
                          blue: "bg-blue-500", emerald: "bg-emerald-500", violet: "bg-violet-500",
                          cyan: "bg-cyan-500", rose: "bg-rose-500", gray: "bg-gray-500",
                        };
                        return (
                          <label key={key} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${colorMap[color]}`}>
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={`size-4 rounded flex items-center justify-center border-2 transition-all ${checked ? `${dotMap[color].replace('bg-', 'border-')} ${dotMap[color].replace('bg-', 'bg-')}` : 'border-border'}`}>
                                {checked && <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <input type="checkbox" checked={checked} onChange={(e) => setEditingType({ ...editingType, [key]: e.target.checked })} className="sr-only" />
                            </div>
                            <div>
                              <span className="text-sm font-bold block text-foreground leading-tight">{label}</span>
                              <span className="text-[10px] text-muted-foreground leading-relaxed">{desc}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Sticky Footer */}
                <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
                  <p className="text-[11px] text-muted-foreground">
                    {editingType.id ? "Editing existing policy" : "All fields marked * are required"}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setIsTypeModalOpen(false); setEditingType(null); }}
                      className="cursor-pointer h-9 px-5"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer h-9 px-6 font-semibold"
                    >
                      <Save className="size-4 mr-2" />
                      Save Policy
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* MODAL: Add / Edit Notice Policy */}
        {isNoticeModalOpen && editingNotice && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setIsNoticeModalOpen(false); setEditingNotice(null); } }}
          >
            <div className="bg-card w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-b border-border/50 bg-gradient-to-r from-amber-500/5 via-card to-card">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileText className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      {editingNotice.id ? "Edit Notice Period Policy" : "New Notice Period Policy"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Sections 26 & 27 — Bangladesh Labour Act, 2006</p>
                  </div>
                </div>
                <button onClick={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }} className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNoticePolicy} className="flex-1 overflow-y-auto flex flex-col">
                <div className="p-7 space-y-6 flex-1">

                  {/* Main Fields */}
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/30 border-b border-border/40">
                      <div className="size-1.5 rounded-full bg-amber-500"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Policy Configuration</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className={labelClass}>Employee Type <span className="text-rose-500">*</span></label>
                        <select required value={editingNotice.employeeType} onChange={(e) => setEditingNotice({...editingNotice, employeeType: e.target.value})} className={inputClass}>
                          <optgroup label="Employer-Initiated Termination">
                            <option value="Permanent">Permanent (Termination by Employer)</option>
                            <option value="Temporary">Temporary (Termination by Employer)</option>
                            <option value="Retrenchment">Retrenchment</option>
                          </optgroup>
                          <optgroup label="Employee-Initiated Resignation">
                            <option value="Permanent (Resignation)">Permanent (Resignation)</option>
                            <option value="Temporary (Resignation)">Temporary (Resignation)</option>
                          </optgroup>
                          <optgroup label="Other">
                            <option value="Probation">Probation</option>
                            <option value="Casual">Casual</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Payment Basis <span className="text-rose-500">*</span></label>
                        <select required value={editingNotice.paymentBasis} onChange={(e) => setEditingNotice({...editingNotice, paymentBasis: e.target.value})} className={inputClass}>
                          <option value="Any">Any / Not Specified</option>
                          <option value="Monthly Rated">Monthly Rated (Fixed monthly salary)</option>
                          <option value="Other (Non-Monthly)">Other (Non-Monthly / Piece-rate / Daily)</option>
                          <option value="Daily Rated">Daily Rated</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Notice Required (Days) <span className="text-rose-500">*</span></label>
                        <div className="flex gap-2">
                          <input required type="number" min={0} value={editingNotice.noticeDaysRequired} onChange={(e) => setEditingNotice({...editingNotice, noticeDaysRequired: Number(e.target.value)})} className={`${inputClass} flex-1`} />
                          <div className="flex gap-1">
                            {[14, 30, 60, 120].map(d => (
                              <button key={d} type="button" onClick={() => setEditingNotice({...editingNotice, noticeDaysRequired: d})}
                                className={`px-2.5 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${editingNotice.noticeDaysRequired === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 hover:bg-muted'}`}>
                                {d}d
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Legal Reference (BLA Section)</label>
                        <input type="text" value={editingNotice.legalReference} onChange={(e) => setEditingNotice({...editingNotice, legalReference: e.target.value})} className={inputClass} placeholder="e.g. Section 26(1)(a), BLA 2006" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className={labelClass}>Description / Notes</label>
                        <textarea rows={2} value={editingNotice.description} onChange={(e) => setEditingNotice({...editingNotice, description: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all outline-none resize-none" placeholder="Describe when and how this notice policy applies..." />
                      </div>
                    </div>
                  </div>

                  {/* Preview pill */}
                  {editingNotice.employeeType && editingNotice.noticeDaysRequired > 0 && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-foreground/5 border border-border/50">
                      <div className="size-7 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <FileText className="size-3.5 text-amber-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">{editingNotice.employeeType}</span>
                        {" "} workers on <span className="font-bold text-foreground">{editingNotice.paymentBasis}</span> basis must serve{" "}
                        <span className="font-bold text-amber-600">{editingNotice.noticeDaysRequired} days</span> notice.
                        {editingNotice.legalReference && <span className="text-primary/70 ml-1">({editingNotice.legalReference})</span>}
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-t border-border/50 bg-card/80">
                  <p className="text-[11px] text-muted-foreground">{editingNotice.id ? "Editing existing policy" : "Fields marked * are required"}</p>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }} className="cursor-pointer h-9 px-5">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer h-9 px-6 font-semibold"><Save className="size-4 mr-2" />Save Policy</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Add / Edit Service Period Policy */}
        {isServiceModalOpen && editingService && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setIsServiceModalOpen(false); setEditingService(null); } }}
          >
            <div className="bg-card w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-b border-border/50 bg-gradient-to-r from-violet-500/5 via-card to-card">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <CalendarClock className="size-4 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      {editingService.id ? "Edit Service Period Policy" : "New Service Period Policy"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Minimum eligibility requirements — Bangladesh Labour Act, 2006</p>
                  </div>
                </div>
                <button onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }} className="size-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors cursor-pointer">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveServicePolicy} className="flex-1 overflow-y-auto flex flex-col">
                <div className="p-7 space-y-6 flex-1">

                  {/* Main Fields */}
                  <div className="rounded-xl border border-border/60 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/30 border-b border-border/40">
                      <div className="size-1.5 rounded-full bg-violet-500"></div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Policy Configuration</span>
                    </div>
                    <div className="p-5 space-y-5">
                      <div className="space-y-1.5">
                        <label className={labelClass}>Benefit Type <span className="text-rose-500">*</span></label>
                        <input required type="text" placeholder="e.g. Gratuity, Compensation — Termination" value={editingService.benefitType} onChange={(e) => setEditingService({...editingService, benefitType: e.target.value})} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className={labelClass}>Minimum Service Required (Months) <span className="text-rose-500">*</span></label>
                          <div className="flex gap-2">
                            <input required type="number" min={0} value={editingService.minServiceMonthsRequired} onChange={(e) => setEditingService({...editingService, minServiceMonthsRequired: Number(e.target.value)})} className={`${inputClass} flex-1`} />
                            <div className="flex gap-1">
                              {[6, 12, 24, 60, 120].map(m => (
                                <button key={m} type="button" onClick={() => setEditingService({...editingService, minServiceMonthsRequired: m})}
                                  className={`px-2 h-10 rounded-lg border text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${editingService.minServiceMonthsRequired === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 hover:bg-muted'}`}>
                                  {m >= 12 ? `${m/12}yr` : `${m}mo`}
                                </button>
                              ))}
                            </div>
                          </div>
                          {editingService.minServiceMonthsRequired > 0 && (
                            <p className="text-[11px] text-violet-600 font-medium">
                              = {editingService.minServiceMonthsRequired >= 12
                                ? `${(editingService.minServiceMonthsRequired / 12).toFixed(1).replace(/\.0$/, "")} year(s)`
                                : `${editingService.minServiceMonthsRequired} month(s)`}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>Legal Reference (BLA Section)</label>
                          <input type="text" value={editingService.legalReference} onChange={(e) => setEditingService({...editingService, legalReference: e.target.value})} className={inputClass} placeholder="e.g. Section 2(10), BLA 2006" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Description / Notes</label>
                        <textarea rows={2} value={editingService.description} onChange={(e) => setEditingService({...editingService, description: e.target.value})} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all outline-none resize-none" placeholder="Explain conditions, rate calculations, or eligibility rules..." />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  {editingService.benefitType && editingService.minServiceMonthsRequired > 0 && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-foreground/5 border border-border/50">
                      <div className="size-7 rounded-full bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                        <CalendarClock className="size-3.5 text-violet-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">{editingService.benefitType}</span>
                        {" "} requires minimum{" "}
                        <span className="font-bold text-violet-600">
                          {editingService.minServiceMonthsRequired >= 12
                            ? `${(editingService.minServiceMonthsRequired / 12).toFixed(1).replace(/\.0$/, "")} year(s)`
                            : `${editingService.minServiceMonthsRequired} month(s)`}
                        </span>
                        {" "} of continuous service.
                        {editingService.legalReference && <span className="text-primary/70 ml-1">({editingService.legalReference})</span>}
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-t border-border/50 bg-card/80">
                  <p className="text-[11px] text-muted-foreground">{editingService.id ? "Editing existing policy" : "Fields marked * are required"}</p>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }} className="cursor-pointer h-9 px-5">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer h-9 px-6 font-semibold"><Save className="size-4 mr-2" />Save Policy</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

