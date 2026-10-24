import React, { useState, useRef } from "react";
import {
  Printer,
  X,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
} from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";
import type { SimApprovalModalData } from "./SimApprovalViewModal";

interface SingleSimPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SimApprovalModalData | null;
  approvedLimit?: number | string;
  assignedSimNumber?: string;
}

/** Helper to calculate job duration in days/months/years */
function calculateJobDuration(joinDateStr?: string, asOfDate: Date = new Date()): string {
  if (!joinDateStr) return "14 Days 08 Months 08 Years";
  let joinDate: Date;
  if (joinDateStr.includes("/")) {
    const parts = joinDateStr.split("/");
    const d = parseInt(parts[0], 10) || 1;
    const m = (parseInt(parts[1], 10) || 1) - 1;
    const y = parseInt(parts[2], 10) || 2026;
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

export function SingleSimPrintModal({
  isOpen,
  onClose,
  data,
  approvedLimit,
  assignedSimNumber,
}: SingleSimPrintModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const now = new Date();
  const printTimestamp = now.toLocaleTimeString("en-US", { hour12: true });

  const finalApprovedLimit =
    approvedLimit !== undefined && approvedLimit !== ""
      ? Number(approvedLimit)
      : data.simDetails.expectedLimit || 1000;

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
          <title>SIM_Application_${data.employee.id}_${data.reqNo}</title>
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
              margin-top: 40px;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden border border-slate-300">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                SIM Requisition Application Print Preview
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  EMP: {data.employee.id}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Official Pakiza Apparels corporate A4 sheet ready for physical printing and PDF export
              </p>
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
              <span className="px-2 font-mono text-[11px] text-slate-300 min-w-[45px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded transition-colors ml-0.5 border-l border-slate-700"
                title="Reset Zoom"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>

            {/* Print Trigger Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print Form</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors ml-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Zoomable Printable Container */}
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
                  <div className="flex items-center gap-2.5">
                    <img
                      src={pakizaLogo}
                      alt="Pakiza Logo"
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-black tracking-wide text-slate-900 font-sans">
                        PAKIZA
                      </span>
                      <span className="text-[8.5px] font-black tracking-[0.25em] text-[#1e3a8a] uppercase -mt-0.5">
                        SOFTWARE
                      </span>
                      <span className="text-[6.5px] text-slate-400 tracking-tight italic">
                        Together | Intelligence | Automation
                      </span>
                    </div>
                  </div>

                  <div className="text-center flex-1 pr-12">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                      Pakiza Apparels Limited
                    </h1>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi
                    </p>
                    <div className="mt-2.5">
                      <span className="inline-block px-5 py-1 text-xs font-black uppercase tracking-widest text-slate-900 border border-slate-800 rounded-sm bg-slate-50 shadow-2xs">
                        SIM REQUISITION APPLICATION
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Employee Details Card (Two-Column Executive Layout matching Reference) */}
                <div className="mt-5 border border-slate-300/80 rounded-lg p-4 bg-slate-50/50 shadow-2xs">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-[11px]">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Id</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {data.employee.id}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Name</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">{data.employee.name}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Employee Type</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-semibold text-slate-800">Office Executive</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Joining Date</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">
                          {data.employee.joiningDate || "03/10/2026"}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Job Duration</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-semibold text-slate-800">
                          {calculateJobDuration(data.employee.joiningDate || "03/10/2026")}
                        </span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Company</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">
                          {data.employee.businessUnit || "Pakiza Apparels Limited"}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Area Name</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">
                          {data.employee.location || "PAL-Fabric Dyeing"}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Department</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">
                          {data.employee.department}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Designation</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-bold text-slate-900">
                          {data.employee.designation}
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="w-28 font-bold text-slate-700">Unit</span>
                        <span className="px-2 font-bold text-slate-400">:</span>
                        <span className="font-medium text-slate-800">
                          {data.employee.section || "Knit Dyeing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Main SIM Requisition Table (9 Columns explicitly requested by User) */}
                {/* Columns: SL | Request For | Justification | Sim Number | Existing Limit | Expected Limit | Approved Limit | Documents | Issue Status */}
                <div className="mt-5 overflow-hidden border border-slate-800 rounded-sm">
                  <table className="w-full text-center border-collapse text-[10.5px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-800">
                        <th className="py-2.5 px-2 border-r border-slate-800 w-10">SL</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Request For</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Justification</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Sim Number</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Existing Limit</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Expected Limit</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Approved Limit</th>
                        <th className="py-2.5 px-2 border-r border-slate-800">Documents</th>
                        <th className="py-2.5 px-2">Issue Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-white font-medium text-slate-800">
                      <tr>
                        <td className="py-3 px-2 border-r border-slate-800 font-bold text-slate-900">
                          1
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-semibold text-slate-900">
                          {data.requestType}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 italic text-slate-700">
                          "{data.simDetails.justification || "Office use"}"
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {assignedSimNumber || data.simDetails.simNumber || "—"}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {data.simDetails.existingLimit
                            ? data.simDetails.existingLimit.toLocaleString()
                            : "1000"}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono">
                          {data.simDetails.expectedLimit
                            ? data.simDetails.expectedLimit.toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 font-mono font-bold text-slate-900">
                          {finalApprovedLimit ? finalApprovedLimit.toLocaleString() : "1000"}
                        </td>
                        <td className="py-3 px-2 border-r border-slate-800 text-slate-600">
                          {data.simDetails.attachmentName || "—"}
                        </td>
                        <td className="py-3 px-2 font-bold text-emerald-700">
                          {data.status === "Approved" ? "Issued" : "Pending"}
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
                        {data.simDetails.justification ||
                          "Dear Sir, This SIM is required for office communication and business operation purpose."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Approval Signatures (4 Columns matching Image 2) */}
                <div className="mt-14 pt-2">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {/* 1. Prepared By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="font-bold text-slate-900">
                          {data.employee.requisitionBy || data.employee.name}
                        </span>
                        <span className="text-[9.5px] text-slate-600">
                          {data.employee.designation}
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          PREPARED BY
                        </span>
                      </div>
                    </div>

                    {/* 2. HOD Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          APPROVED
                        </span>
                        <span className="font-bold text-slate-900">Mohammad Tareq Safa</span>
                        <span className="text-[9.5px] text-slate-600">AGM (MIS)</span>
                        <span className="text-[8.5px] font-mono text-slate-500">
                          2026-10-16 12:17 AM
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          HOD APPROVED BY
                        </span>
                      </div>
                    </div>

                    {/* 3. HR Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          APPROVED
                        </span>
                        <span className="font-bold text-slate-900">Rajebul Hasan Rajon</span>
                        <span className="text-[9.5px] text-slate-600">
                          Deputy Manager (HR)
                        </span>
                        <span className="text-[8.5px] font-mono text-slate-500">
                          2026-10-16 12:18 AM
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          HR APPROVED BY
                        </span>
                      </div>
                    </div>

                    {/* 4. Approved By */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="min-h-[40px] flex flex-col justify-end text-[10.5px]">
                        <span className="text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase mb-0.5">
                          APPROVED
                        </span>
                        <span className="font-bold text-slate-900">Rakibul Islam Khan</span>
                        <span className="text-[9.5px] text-slate-600">Managing Director</span>
                        <span className="text-[8.5px] font-mono text-slate-500">
                          2026-10-16 12:19 AM
                        </span>
                      </div>
                      <div className="w-full border-t-[1.5px] border-slate-800 mt-2 pt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                          APPROVED BY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Footer matching Image 2 */}
              <div className="footer-row flex items-center justify-between mt-12 pt-2 border-t border-slate-300 text-[9.5px] text-slate-600 font-mono">
                <span>Print Date & Time : {printTimestamp}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
