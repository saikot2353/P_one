import React, { useState, useRef } from "react";
import {
  Printer,
  X,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  Calendar,
  Clock,
  Download,
  User,
  ShieldCheck,
  Check
} from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export interface LoanPrintData {
  id: number;
  empId: string;
  empName: string;
  section: string;
  designation: string;
  unit: string;
  grade?: string;
  basicSalary?: number;
  grossSalary?: number;
  areaName: string;
  joinDate: string;
  expLoanAmount: number;
  appLoanAmt: number;
  installments: number;
  installmentAmt: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  applicationDate: string;
  approvalFlow?: {
    stage: string;
    status: "Approved" | "Pending" | "Rejected" | "Skipped";
    date: string;
    officer: string;
    comments?: string;
  }[];
}

/** Helper to calculate job duration like '14 Days 08 Months 08 Years' */
export function calculateJobDuration(joinDateStr: string, asOfDate: Date = new Date()): string {
  if (!joinDateStr) return "14 Days 08 Months 08 Years";
  let joinDate: Date;
  if (joinDateStr.includes("/")) {
    const parts = joinDateStr.split("/");
    const d = parseInt(parts[0], 10) || 1;
    const m = (parseInt(parts[1], 10) || 1) - 1;
    const y = parseInt(parts[2], 10) || 2020;
    joinDate = new Date(y, m, d);
  } else {
    joinDate = new Date(joinDateStr);
  }

  if (isNaN(joinDate.getTime())) return "14 Days 08 Months 08 Years";

  let years = asOfDate.getFullYear() - joinDate.getFullYear();
  let months = asOfDate.getMonth() - joinDate.getMonth();
  let days = asOfDate.getDate() - joinDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");
  return `${pad(days)} Days ${pad(months)} Months ${pad(years)} Years`;
}

/** Helper to calculate deduction start and end months */
export function getDeductMonths(appDateStr: string, installments: number) {
  let date = new Date(appDateStr || new Date());
  if (isNaN(date.getTime())) date = new Date();

  // Start deduction: 1 month after application
  const startDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const qty = Math.max(1, installments || 1);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + qty - 1, 1);

  const formatMonth = (d: Date) => {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).replace(" ", "-");
  };

  return {
    startMonth: formatMonth(startDate),
    endMonth: formatMonth(endDate)
  };
}

/** Pakiza Apparels Vector Brand Logo */
export function PakizaBrandLogo({ className = "h-11" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={pakizaLogo}
        alt="Pakiza Logo"
        className="h-10 w-auto object-contain hidden sm:block"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
        }}
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 140 32" className="h-6 w-auto" fill="none">
            <path
              d="M 4 24 C 16 6, 42 2, 80 4 C 108 5, 126 12, 136 20 C 122 15, 102 10, 78 10 C 38 10, 16 16, 4 24 Z"
              fill="#2563eb"
            />
            <text x="12" y="23" fill="#0f172a" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
              PAKIZA
            </text>
          </svg>
        </div>
        <span className="text-[8.5px] font-black tracking-[0.25em] text-[#1e3a8a] uppercase -mt-1 pl-3 font-sans">
          APPARELS LTD
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE LOAN APPLICATION PRINT MODAL (MODERNIZED EXECUTIVE DESIGN)
// ─────────────────────────────────────────────────────────────────────────────

interface SingleLoanPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanPrintData | null;
}

export function SingleLoanPrintModal({ isOpen, onClose, loan }: SingleLoanPrintModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !loan) return null;

  const jobDuration = calculateJobDuration(loan.joinDate);
  const deductMonths = getDeductMonths(loan.applicationDate, loan.installments);
  const now = new Date();
  const printTimestamp = now.toLocaleTimeString("en-US", { hour12: true });

  const expLoan = Number(loan.expLoanAmount) || 0;
  const appLoan = loan.status === "Approved" ? Number(loan.appLoanAmt || loan.expLoanAmount) : Number(loan.appLoanAmt) || Number(loan.expLoanAmount);
  const expInstallments = Number(loan.installments) || 1;
  const expInstallmentAmt = Number(loan.installmentAmt) || (expInstallments ? Math.round(expLoan / expInstallments) : 0);
  const appInstallmentAmt = loan.status === "Approved" ? expInstallmentAmt : 0;

  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Loan_Application_${loan.empId}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              font-size: 11px;
              line-height: 1.35;
            }
            .page-container {
              width: 100%;
              max-width: 190mm;
              margin: 0 auto;
            }
            .table-custom {
              width: 100%;
              border-collapse: collapse;
              margin-top: 14px;
            }
            .table-custom th, .table-custom td {
              border: 1px solid #1e293b;
              padding: 6px 4px;
              text-align: center;
              font-size: 10px;
            }
            .table-custom th {
              background-color: #f1f5f9 !important;
              font-weight: 700;
              color: #0f172a;
            }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
            .text-center { text-align: center !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .uppercase { text-transform: uppercase; }
            .signatures-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-top: 60px;
              text-align: center;
            }
            .sig-line {
              border-top: 1.5px solid #0f172a;
              margin-top: 6px;
              padding-top: 4px;
              font-size: 10px;
              font-weight: 700;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              font-size: 9.5px;
              color: #475569;
              border-top: 1px solid #cbd5e1;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden border border-slate-300">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                Loan Application Print Preview
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  EMP: {loan.empId}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">High-fidelity corporate A4 layout ready for physical printing and PDF archiving</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 10))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="size-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300 font-bold">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print Form</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview Container */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-200/80">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-150"
          >
            {/* Printable Paper (210mm x 297mm styled A4 Sheet) */}
            <div
              ref={printAreaRef}
              className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[12mm_15mm] shadow-xl border border-slate-300 rounded-sm font-sans flex flex-col justify-between"
            >
              <div>
                {/* 1. Header (Logo & Company Title Matching User Reference) */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <PakizaBrandLogo className="h-12" />

                  <div className="text-center flex-1 pr-12">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                      Pakiza Apparels Limited
                    </h1>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi
                    </p>
                    <div className="mt-2.5">
                      <span className="inline-block px-5 py-1 text-xs font-black uppercase tracking-widest text-slate-900 border border-slate-800 rounded-sm bg-slate-50 shadow-2xs">
                        Loan Application
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Employee Details Card (Modern Two-Column Executive Layout) */}
                <div className="mt-5 border border-slate-300/80 rounded-lg p-4 bg-slate-50/50 shadow-2xs">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[11px]">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Id</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">{loan.empId}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Name</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">{loan.empName}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Type</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-semibold text-slate-800">
                          {loan.grade || "Office Executive"}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Joining Date</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">{loan.joinDate || "01/02/2018"}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Job Duration</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-semibold text-slate-800">{jobDuration}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Company</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">Pakiza Apparels Limited</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Area Name</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">{loan.areaName || "PAL-Fabric Dyeing"}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Department</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">{loan.section || "Inventory Management"}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Designation</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">{loan.designation || "Manager"}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Unit</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">{loan.unit || "Knit Dyeing"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 9-Column Financial Schedule Table (Updated Modern Layout) */}
                <div className="mt-5 overflow-hidden border border-slate-800 rounded-sm">
                  <table className="w-full text-center border-collapse text-[10.5px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-800">
                        <th className="py-2.5 px-2 border-r border-slate-800 w-10">SL</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Exp. Loan Amount</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Exp.Installment (Qty)</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Exp.Installment Amount</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">App. Loan Amount</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">App.Installment (Qty)</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">App.Installment Amount</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Start Deduct Month</th>
                        <th className="py-2.5 px-2">End Deduct Month</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-white font-medium text-slate-800">
                      <tr>
                        <td className="py-3 px-2 border-r border-slate-800 font-bold text-slate-900">1</td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono font-bold text-slate-900">
                          {expLoan.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {expInstallments}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {expInstallmentAmt.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono font-bold text-slate-900">
                          {appLoan.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {expInstallments}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {appInstallmentAmt.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-semibold">
                          {deductMonths.startMonth}
                        </td>
                        <td className="py-3 px-2 font-semibold">
                          {deductMonths.endMonth}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. Reason Section */}
                <div className="mt-5 border border-slate-300 rounded-lg p-3.5 bg-slate-50/40 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 shrink-0">Reason :</span>
                    <div className="text-slate-800 leading-relaxed font-normal">
                      <span className="font-semibold text-slate-900">Dear Sir,</span>
                      <p className="mt-0.5 text-slate-700">
                        {loan.reason || "This loan is required for family emergency & medical treatment purposes."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Approval Signatures (4 Columns with Official Stamps) */}
                <div className="mt-14 pt-2">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {/* 1. Prepared By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="font-bold text-slate-900">
                          {loan.approvalFlow?.[0]?.officer && loan.approvalFlow[0].officer !== "-"
                            ? loan.approvalFlow[0].officer
                            : "Khondokar Momenur Rahman"}
                        </span>
                        <span className="text-[9.5px] text-slate-600">Sr. Manager</span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          Prepared By
                        </span>
                      </div>
                    </div>

                    {/* 2. HOD Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          Approved
                        </span>
                        <span className="font-bold text-slate-900">Khondokar Momenur Rahman</span>
                        <span className="text-[9.5px] text-slate-600">Sr. Manager</span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          HOD Approved By
                        </span>
                      </div>
                    </div>

                    {/* 3. HR Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          Approved
                        </span>
                        <span className="font-bold text-slate-900">Md. Shafiul Alam</span>
                        <span className="text-[9.5px] text-slate-600">General Manager</span>
                        <span className="text-[8.5px] font-mono text-slate-500">
                          {loan.approvalFlow?.[1]?.date && loan.approvalFlow[1].date !== "-"
                            ? `${loan.approvalFlow[1].date} 04:03 PM`
                            : "01/09/2026 4:03:04 PM"}
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          HR Approved By
                        </span>
                      </div>
                    </div>

                    {/* 4. Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          Approved
                        </span>
                        <span className="font-bold text-slate-900">Rakibul Islam Khan</span>
                        <span className="text-[9.5px] text-slate-600">Managing Director</span>
                        <span className="text-[8.5px] font-mono text-slate-500">
                          {loan.status === "Approved" ? "03/10/2026 11:22:16 AM" : "Pending Signature"}
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          Approved By
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Footer (Date Time and Page Number) */}
              <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9.5px] text-slate-500 font-mono mt-10">
                <div>
                  <span className="font-bold text-slate-700">Print Date & Time :</span> {printTimestamp}
                </div>
                <div>
                  <span className="font-bold text-slate-700">Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL LOAN LIST PDF PRINT MODAL (SL, EMPLOYEES NAME, LOAN DATE, AMOUNT, REMARKS)
// ─────────────────────────────────────────────────────────────────────────────

interface AllLoansPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  loans: LoanPrintData[];
}

export function AllLoansPrintModal({ isOpen, onClose, loans }: AllLoansPrintModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalAmount = loans.reduce((acc, l) => {
    const amt = l.status === "Approved" ? Number(l.appLoanAmt || l.expLoanAmount) : Number(l.expLoanAmount);
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  const approvedCount = loans.filter((l) => l.status === "Approved").length;
  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const rejectedCount = loans.filter((l) => l.status === "Rejected").length;

  const now = new Date();
  const printDateStr = now.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  const printTimestamp = now.toLocaleTimeString("en-US", { hour12: true });

  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>All_Loan_Summary_List</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              font-size: 11px;
              line-height: 1.3;
            }
            .page-container {
              width: 100%;
              max-width: 195mm;
              margin: 0 auto;
            }
            .table-report {
              width: 100%;
              border-collapse: collapse;
              margin-top: 14px;
            }
            .table-report th, .table-report td {
              border: 1px solid #1e293b;
              padding: 6px 8px;
              font-size: 10px;
            }
            .table-report th {
              background-color: #f1f5f9 !important;
              font-weight: 700;
              color: #0f172a;
              text-transform: uppercase;
              font-size: 9.5px;
            }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
            .text-center { text-align: center !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            .font-bold { font-weight: 700; }
            .uppercase { text-transform: uppercase; }
            .signatures-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-top: 50px;
              text-align: center;
            }
            .sig-line {
              border-top: 1.5px solid #0f172a;
              padding-top: 4px;
              font-size: 10px;
              font-weight: 700;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              font-size: 9px;
              color: #475569;
              border-top: 1px solid #cbd5e1;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 400);
  };

  const handleDownloadCSV = () => {
    if (loans.length === 0) return;
    const headers = ["SL", "Loan Date", "Employee Name", "Loan ID", "Amount (BDT)", "Remarks"];
    const rows = loans.map((l, idx) => {
      const amt = l.status === "Approved" ? Number(l.appLoanAmt || l.expLoanAmount) : Number(l.expLoanAmount);
      return [
        idx + 1,
        l.applicationDate,
        `"${l.empName.replace(/"/g, '""')}"`,
        `"LN-${String(l.id).padStart(4, "0")}"`,
        amt,
        `"${(l.reason || "").replace(/"/g, '""')} [${l.status}]"`
      ];
    });
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `All_Loans_List_${now.toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden border border-slate-300">
        {/* Top Control Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                All Loans List PDF Print Design
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {loans.length} Records
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Formal printable statement containing SL, Employees Name, Loan Date, Amount, Remarks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 10))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="size-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300 font-bold">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-200/80">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-150"
          >
            {/* Printable Paper A4 Document */}
            <div
              ref={printAreaRef}
              className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[12mm_14mm] shadow-xl border border-slate-300 rounded-sm font-sans flex flex-col justify-between"
            >
              <div>
                {/* 1. Header with Pakiza Logo and Address */}
                <div className="flex items-start justify-between pb-3.5 border-b-2 border-slate-900">
                  <PakizaBrandLogo className="h-11" />

                  <div className="text-center flex-1 pr-10">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                      Pakiza Apparels Limited
                    </h1>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-100 border border-slate-700 rounded-xs">
                        All Loans Register & Disbursement Statement
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Metadata / Filter Summary Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between text-[10.5px] bg-slate-50 border border-slate-300 rounded px-3 py-2">
                  <div className="flex items-center gap-4 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">Report Date: </span>
                      <span>{printDateStr}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Total Records: </span>
                      <span className="font-mono font-bold text-blue-700">{loans.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Approved: {approvedCount}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      Pending: {pendingCount}
                    </span>
                    {rejectedCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                        Rejected: {rejectedCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Main Required Table: SL, LOAN DATE, EMPLOYEE NAME, LOAN ID, AMOUNT, REMARKS */}
                <div className="mt-4 overflow-hidden border border-slate-900 rounded-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 border-r border-slate-900 text-center w-12">SL</th>
                        <th className="py-2.5 px-3 border-r border-slate-900 text-center w-28">Loan Date</th>
                        <th className="py-2.5 px-3 border-r border-slate-900">Employee Name</th>
                        <th className="py-2.5 px-3 border-r border-slate-900 text-center w-24">Loan ID</th>
                        <th className="py-2.5 px-3 border-r border-slate-900 text-right w-32">Amount (৳)</th>
                        <th className="py-2.5 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 bg-white">
                      {loans.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                            No loan applications available to print.
                          </td>
                        </tr>
                      ) : (
                        loans.map((row, index) => {
                          const amt =
                            row.status === "Approved"
                              ? Number(row.appLoanAmt || row.expLoanAmount)
                              : Number(row.expLoanAmount);

                          return (
                            <tr key={row.id} className={index % 2 === 1 ? "bg-slate-50/60" : "bg-white"}>
                              {/* 1. SL */}
                              <td className="py-2.5 px-3 text-center border-r border-slate-300 font-bold text-slate-700">
                                {index + 1}
                              </td>

                              {/* 2. LOAN DATE */}
                              <td className="py-2.5 px-3 text-center border-r border-slate-300 font-mono text-slate-700 font-medium">
                                {row.applicationDate}
                              </td>

                              {/* 3. EMPLOYEE NAME */}
                              <td className="py-2.5 px-3 border-r border-slate-300">
                                <div className="font-bold text-slate-900">{row.empName}</div>
                                <div className="text-[9.5px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono font-semibold text-slate-700">ID: {row.empId}</span>
                                  <span>•</span>
                                  <span>{row.designation}</span>
                                  {row.section && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-[130px]">{row.section}</span>
                                    </>
                                  )}
                                </div>
                              </td>

                              {/* 4. LOAN ID */}
                              <td className="py-2.5 px-3 text-center border-r border-slate-300 font-mono font-bold text-slate-800">
                                LN-{String(row.id).padStart(4, "0")}
                              </td>

                              {/* 5. AMOUNT */}
                              <td className="py-2.5 px-3 text-right border-r border-slate-300 font-mono font-bold text-slate-900">
                                ৳{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* 6. REMARKS */}
                              <td className="py-2.5 px-3 text-slate-700">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                                    row.status === "Approved"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                      : row.status === "Rejected"
                                      ? "bg-rose-50 text-rose-700 border-rose-300"
                                      : "bg-amber-50 text-amber-700 border-amber-300"
                                  }`}>
                                    {row.status}
                                  </span>
                                  <span className="truncate max-w-[200px] text-[10px]" title={row.reason}>
                                    {row.reason || "Personal Loan Application"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}

                      {/* Summary Row */}
                      {loans.length > 0 && (
                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-900">
                          <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-[10px] border-r border-slate-900">
                            Grand Total ({loans.length} Applications) :
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-xs border-r border-slate-900 text-blue-900">
                            ৳{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-[10px] text-slate-600 font-normal">
                            All values in BDT currency. Verified records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 4. Four Executive Signatures */}
                <div className="mt-16 pt-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-8" />
                      <div className="w-full border-t-[1.5px] border-slate-900 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          Prepared By
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-8" />
                      <div className="w-full border-t-[1.5px] border-slate-900 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          Verified (Accounts)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-8" />
                      <div className="w-full border-t-[1.5px] border-slate-900 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          HR Operations
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-8" />
                      <div className="w-full border-t-[1.5px] border-slate-900 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          Authorized Signatory
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Document Footer */}
              <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono mt-8">
                <div>
                  <span className="font-bold text-slate-700">Print Date & Time :</span> {printTimestamp}
                </div>
                <div>
                  <span className="font-bold text-slate-700">Pakiza Apparels ERP — Confidential</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
