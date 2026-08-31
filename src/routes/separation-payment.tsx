import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Coins,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  Search,
  Calculator,
  Eye,
  X,
  CreditCard,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/separation-payment")({
  head: () => ({
    meta: [
      { title: "Separation Payment & Settlement — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Calculate and disburse final separation payment settlements, gratuity, earned leave encashment, and loan deductions.",
      },
    ],
  }),
  component: SeparationPaymentPage,
});

export interface SeparationPaymentRecord {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  lastWorkingDate: string;
  unpaidSalaryDays: number;
  unpaidSalaryAmount: number;
  elEncashmentDays: number;
  elEncashmentAmount: number;
  gratuityAmount: number;
  pfBalance: number;
  loanDeduction: number;
  otherDeductions: number;
  netPayableAmount: number;
  disbursementStatus: "Pending Clearance" | "Approved for Disbursement" | "Disbursed / Paid";
  paymentMethod: "Bank Transfer" | "Cheque" | "Cash";
}

const initialPaymentRecords: SeparationPaymentRecord[] = [
  {
    id: "SEP-PAY-012",
    empId: "2021051280",
    empName: "Farhana Akter",
    department: "Human Resource & Admin",
    designation: "HR Officer",
    lastWorkingDate: "15/09/2026",
    unpaidSalaryDays: 15,
    unpaidSalaryAmount: 19000,
    elEncashmentDays: 12,
    elEncashmentAmount: 15200,
    gratuityAmount: 95000,
    pfBalance: 48000,
    loanDeduction: 0,
    otherDeductions: 0,
    netPayableAmount: 177200,
    disbursementStatus: "Approved for Disbursement",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "SEP-PAY-009",
    empId: "2022019943",
    empName: "Sharmin Sultana",
    department: "RMG Operations",
    designation: "Senior Operator",
    lastWorkingDate: "01/08/2026",
    unpaidSalaryDays: 0,
    unpaidSalaryAmount: 0,
    elEncashmentDays: 8,
    elEncashmentAmount: 8000,
    gratuityAmount: 52000,
    pfBalance: 31000,
    loanDeduction: 5000,
    otherDeductions: 0,
    netPayableAmount: 86000,
    disbursementStatus: "Disbursed / Paid",
    paymentMethod: "Bank Transfer",
  },
];

function SeparationPaymentPage() {
  const [records, setRecords] = useState<SeparationPaymentRecord[]>(initialPaymentRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<SeparationPaymentRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
      );
    });
  }, [records, searchTerm]);

  const handleDisbursePayment = (id: string, empName: string) => {
    setRecords(
      records.map((r) => {
        if (r.id === id) {
          return { ...r, disbursementStatus: "Disbursed / Paid" };
        }
        return r;
      })
    );
    setToastMsg(`Separation payment for ${empName} marked as Disbursed / Paid.`);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Payment Settlement
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 px-3 py-1 rounded-full">
            <Coins size={14} /> Settlement Disbursement Module
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-medium">Search Settlement Record:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Emp ID, Name, Dept..."
                className="h-8 px-2.5 w-64 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3">Payment ID</th>
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3 text-right">Unpaid Salary</th>
                    <th className="py-3 px-3 text-right">EL Encashment</th>
                    <th className="py-3 px-3 text-right">Gratuity</th>
                    <th className="py-3 px-3 text-right">PF Balance</th>
                    <th className="py-3 px-3 text-right text-rose-600">Deductions</th>
                    <th className="py-3 px-3 text-right font-black text-blue-900">Net Payable</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{r.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{r.empName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {r.empId} • {r.department}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono">৳{r.unpaidSalaryAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono">৳{r.elEncashmentAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono">৳{r.gratuityAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono">৳{r.pfBalance.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono text-rose-600">-৳{(r.loanDeduction + r.otherDeductions).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-black text-rose-700 text-sm">
                        ৳{r.netPayableAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.disbursementStatus === "Disbursed / Paid"
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {r.disbursementStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(r)}
                            title="View Voucher"
                            className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                          >
                            <Eye size={14} />
                          </button>
                          {r.disbursementStatus !== "Disbursed / Paid" && (
                            <button
                              type="button"
                              onClick={() => handleDisbursePayment(r.id, r.empName)}
                              className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                            >
                              Disburse
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Voucher Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 w-full max-w-xl p-6 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Separation Final Settlement Payment Voucher ({selectedRecord.id})
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="px-3 py-1 bg-blue-600 text-white font-bold rounded flex items-center gap-1">
                  <Printer size={13} /> Print
                </button>
                <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border">
                <div><span className="font-bold">Employee:</span> {selectedRecord.empName} ({selectedRecord.empId})</div>
                <div><span className="font-bold">Department:</span> {selectedRecord.department}</div>
                <div><span className="font-bold">Last Working Date:</span> {selectedRecord.lastWorkingDate}</div>
                <div><span className="font-bold">Payment Method:</span> {selectedRecord.paymentMethod}</div>
              </div>

              <div className="border rounded divide-y text-xs">
                <div className="p-2 flex justify-between"><span>Unpaid Salary ({selectedRecord.unpaidSalaryDays} days):</span><span className="font-mono font-bold">৳{selectedRecord.unpaidSalaryAmount.toLocaleString()}</span></div>
                <div className="p-2 flex justify-between"><span>Earned Leave Encashment ({selectedRecord.elEncashmentDays} days):</span><span className="font-mono font-bold">৳{selectedRecord.elEncashmentAmount.toLocaleString()}</span></div>
                <div className="p-2 flex justify-between"><span>Gratuity Benefit:</span><span className="font-mono font-bold">৳{selectedRecord.gratuityAmount.toLocaleString()}</span></div>
                <div className="p-2 flex justify-between"><span>Provident Fund (PF) Total:</span><span className="font-mono font-bold">৳{selectedRecord.pfBalance.toLocaleString()}</span></div>
                <div className="p-2 flex justify-between text-rose-600"><span>Less Loan &amp; Outstanding Deductions:</span><span className="font-mono font-bold">-৳{(selectedRecord.loanDeduction + selectedRecord.otherDeductions).toLocaleString()}</span></div>
                <div className="p-2.5 bg-blue-50 font-extrabold flex justify-between text-sm text-blue-900"><span>NET SETTLEMENT PAYABLE:</span><span className="font-mono text-rose-700">৳{selectedRecord.netPayableAmount.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={() => setSelectedRecord(null)} className="px-4 py-1.5 bg-slate-700 text-white font-bold rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
