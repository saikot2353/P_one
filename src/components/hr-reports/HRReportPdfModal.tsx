import React, { useRef } from "react";
import { X, Printer, FileDown } from "lucide-react";
import clientLogo from "@/components/dashboard/client_logo.png";
import { toast } from "sonner";

export interface ColumnDef<T> {
  header: string;
  accessor: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export interface HRReportPdfModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  companyName?: string;
  dateRange?: string;
  columns: ColumnDef<T>[];
  data: T[];
  totalRow?: React.ReactNode;
}

export function HRReportPdfModal<T>({
  isOpen,
  onClose,
  reportTitle,
  companyName = "Pakiza Knit Composite Ltd",
  dateRange,
  columns,
  data,
  totalRow,
}: HRReportPdfModalProps<T>) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Could not open print window. Please allow popups.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} — ${companyName}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              color: #000;
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
            }
            .header-container {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
              position: relative;
            }
            .logo-img {
              height: 48px;
              object-fit: contain;
            }
            .title-section {
              text-align: center;
              flex: 1;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
              color: #000;
              letter-spacing: -0.2px;
            }
            .report-title {
              font-size: 14px;
              font-weight: bold;
              text-decoration: underline;
              margin: 3px 0 2px 0;
              color: #000;
            }
            .date-range {
              font-size: 11px;
              font-weight: normal;
              color: #222;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
              font-size: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
              color: #000;
              word-break: break-word;
            }
            th {
              font-weight: bold;
              background-color: #f3f4f6;
              text-align: center;
            }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            tfoot tr td {
              font-weight: bold;
              background-color: #e5e7eb;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Control Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              PDF Print & Document Preview
            </span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              — Official Standard Formatting
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Printer className="size-4" />
              <span>PRINT / SAVE PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileDown className="size-4" />
              <span>DOWNLOAD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Document Container */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950">
          {/* Official Printable Report Document Card */}
          <div
            ref={printRef}
            className="bg-white text-slate-900 border border-slate-300 rounded-lg p-6 shadow-md max-w-full mx-auto"
          >
            {/* Document Header */}
            <div className="header-container flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              {/* Left Logo */}
              <div className="w-1/4">
                <img
                  src={clientLogo}
                  alt="Pakiza Knit Composite Ltd Logo"
                  className="h-12 object-contain logo-img"
                />
              </div>

              {/* Center Company Title & Report Heading */}
              <div className="w-2/4 text-center title-section">
                <h2 className="company-name text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {companyName}
                </h2>
                <h3 className="report-title text-sm font-bold text-slate-900 underline mt-1">
                  {reportTitle}
                </h3>
                {dateRange && (
                  <p className="date-range text-xs text-slate-700 font-medium mt-0.5">
                    {dateRange}
                  </p>
                )}
              </div>

              {/* Right Spacer for Balance */}
              <div className="w-1/4 text-right text-[10px] text-slate-500 font-mono">
                Printed: {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>

            {/* Document Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse border border-slate-900">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        style={{ width: col.width }}
                        className={`border border-slate-900 p-1.5 font-bold ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        {columns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            className={`border border-slate-900 p-1.5 text-slate-900 ${
                              col.align === "center"
                                ? "text-center"
                                : col.align === "right"
                                ? "text-right"
                                : "text-left"
                            } ${col.className || ""}`}
                          >
                            {col.accessor(item, index)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="border border-slate-900 p-4 text-center text-slate-500"
                      >
                        No records available for PDF report.
                      </td>
                    </tr>
                  )}
                </tbody>
                {totalRow && (
                  <tfoot>
                    {totalRow}
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
