import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Receipt,
  ArrowRight
} from 'lucide-react';
import {
  getStoredStockLoanRecoveries,
  StockLoanRecovery,
  StockLoanRecoveryPaymentMethod
} from '../lib/inventory-stock-loan-data';

export const Route = createFileRoute('/inv-loan-recovery-list')({
  component: LoanRecoveryListPage,
});

export default function LoanRecoveryListPage() {
  const navigate = useNavigate();
  const [recoveries, setRecoveries] = useState<StockLoanRecovery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected recovery for quick receipt modal
  const [selectedRecovery, setSelectedRecovery] = useState<StockLoanRecovery | null>(null);

  const loadData = () => {
    const list = getStoredStockLoanRecoveries();
    setRecoveries(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered list
  const filteredRecoveries = useMemo(() => {
    return recoveries.filter(rec => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = rec.recoveryId.toLowerCase().includes(q);
        const matchIssue = rec.loanIssueId.toLowerCase().includes(q);
        const matchBorrower = rec.borrowerName.toLowerCase().includes(q);
        const matchRef = (rec.paymentReference || '').toLowerCase().includes(q);
        const matchBank = (rec.bankName || '').toLowerCase().includes(q);
        if (!matchId && !matchIssue && !matchBorrower && !matchRef && !matchBank) return false;
      }

      if (methodFilter !== 'ALL' && rec.paymentMethod !== methodFilter) return false;
      if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;
      if (startDate && rec.recoveryDate < startDate) return false;
      if (endDate && rec.recoveryDate > endDate) return false;

      return true;
    });
  }, [recoveries, searchQuery, methodFilter, statusFilter, startDate, endDate]);

  // Aggregate stats
  const totalCount = filteredRecoveries.length;
  const totalAmount = filteredRecoveries.reduce((sum, r) => sum + r.receiveAmount, 0);
  const cashAmount = filteredRecoveries
    .filter(r => r.paymentMethod === 'Cash')
    .reduce((sum, r) => sum + r.receiveAmount, 0);
  const bankAmount = filteredRecoveries
    .filter(r => r.paymentMethod === 'Bank' || r.paymentMethod === 'Cheque')
    .reduce((sum, r) => sum + r.receiveAmount, 0);

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900 overflow-hidden">
      <InventorySidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <InventoryTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          <div className="w-full max-w-[1550px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Hybrid Loan Settlement
              </span>
              <span className="text-xs text-gray-500">Method 2: Monetary Recovery</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Loan Recovery Register</h1>
            <p className="text-sm text-gray-500">
              Audit log of cash and bank recovery receipts collected from borrowers to financially settle stock loans.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/inv-loan-settlement-list' })}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            Settlement Summary
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-recovery' })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Loan Recovery
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Receipts
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2 font-mono">{totalCount}</div>
          <span className="text-xs text-gray-500 mt-1 block">Monetary payments posted</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Recovered
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Cumulative financial recovery</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cash Collections
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2 font-mono">
            ${cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Direct cash receipts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bank & Cheques
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">
            ${bankAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Electronic & cheque payments</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Recovery ID, Loan Issue, Borrower, Ref, Bank..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank Deposit / EFT</option>
            <option value="Cheque">Cheque</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700"
            title="From Date"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700"
            title="To Date"
          />
          {(searchQuery || methodFilter !== 'ALL' || statusFilter !== 'ALL' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMethodFilter('ALL');
                setStatusFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="text-emerald-600 hover:text-emerald-800 text-xs font-medium ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3">Recovery ID</th>
                <th className="py-3 px-3">Loan Issue ID</th>
                <th className="py-3 px-3">Recovery Date</th>
                <th className="py-3 px-3">Borrower & Dept</th>
                <th className="py-3 px-3 text-right">Orig Loan Value ($)</th>
                <th className="py-3 px-3 text-right font-bold text-emerald-800">Receive Amount ($)</th>
                <th className="py-3 px-3 text-right">Remaining Bal ($)</th>
                <th className="py-3 px-3 text-center">Method</th>
                <th className="py-3 px-3">Reference / Bank</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecoveries.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400">
                    <DollarSign className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600">No monetary recoveries found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Adjust your filters or record a new loan recovery.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecoveries.map((rec, idx) => (
                  <tr key={rec.recoveryId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      {rec.recoveryId}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      <span
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate({ to: '/inv-loan-settlement-list' })}
                      >
                        {rec.loanIssueId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{rec.recoveryDate}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">{rec.borrowerName}</div>
                      <div className="text-[11px] text-gray-500">{rec.department}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-gray-600">
                      ${rec.originalLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 text-sm">
                      ${rec.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      <span className={rec.outstandingAfterRecovery === 0 ? 'text-emerald-600' : 'text-amber-600'}>
                        ${rec.outstandingAfterRecovery.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rec.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {rec.paymentReference && (
                        <div className="font-mono text-gray-800">{rec.paymentReference}</div>
                      )}
                      {rec.bankName && (
                        <div className="text-[11px] text-gray-500">
                          {rec.bankName} {rec.chequeNo && `(Chq #${rec.chequeNo})`}
                        </div>
                      )}
                      {!rec.paymentReference && !rec.bankName && (
                        <span className="text-gray-400">Direct Cash</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          rec.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            navigate({
                              to: '/inv-loan-recovery',
                              search: { recoveryId: rec.recoveryId, mode: 'view' },
                            })
                          }
                          title="View / Edit Recovery"
                          className="p-1 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedRecovery(rec)}
                          title="Quick View Money Voucher"
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK VIEW MONEY VOUCHER MODAL */}
      {selectedRecovery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <h3 className="text-base font-bold">Money Voucher: {selectedRecovery.recoveryId}</h3>
              </div>
              <button
                onClick={() => setSelectedRecovery(null)}
                className="text-white hover:text-gray-200 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="text-center pb-2 border-b">
                <h2 className="text-base font-bold text-gray-900 uppercase">
                  {selectedRecovery.issuingCompany}
                </h2>
                <p className="text-[11px] text-gray-500">Stock Loan Monetary Recovery Voucher</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Voucher ID:</span>
                  <span className="font-bold font-mono text-gray-900">{selectedRecovery.recoveryId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Payment Date:</span>
                  <span className="font-bold text-gray-900">{selectedRecovery.recoveryDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Loan Issue Ref:</span>
                  <span className="font-bold font-mono text-gray-900">{selectedRecovery.loanIssueId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Borrower / Party:</span>
                  <span className="font-bold text-gray-900">{selectedRecovery.borrowerName}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-emerald-900">{selectedRecovery.paymentMethod}</span>
                </div>
                {selectedRecovery.bankName && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bank & Branch:</span>
                    <span className="font-medium text-gray-900">{selectedRecovery.bankName}</span>
                  </div>
                )}
                {selectedRecovery.chequeNo && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cheque No & Date:</span>
                    <span className="font-mono text-gray-900">
                      #{selectedRecovery.chequeNo} ({selectedRecovery.chequeDate || 'N/A'})
                    </span>
                  </div>
                )}
                {selectedRecovery.paymentReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Reference:</span>
                    <span className="font-mono text-gray-900">{selectedRecovery.paymentReference}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200 text-sm font-bold text-emerald-950">
                  <span>Received Amount:</span>
                  <span className="text-base text-emerald-700 font-mono">
                    ${selectedRecovery.receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Outstanding Prior to Payment:</span>
                  <span className="font-mono">${selectedRecovery.outstandingBeforeRecovery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Outstanding After Payment:</span>
                  <span className={`font-mono ${selectedRecovery.outstandingAfterRecovery === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    ${selectedRecovery.outstandingAfterRecovery.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-6 text-center text-xs text-gray-600">
                <div>
                  <div className="border-t border-gray-400 w-36 mx-auto pt-1 font-medium">
                    {selectedRecovery.receivedBy}
                  </div>
                  <span className="text-[10px] text-gray-500">Received By / Accounts</span>
                </div>
                <div>
                  <div className="border-t border-gray-400 w-36 mx-auto pt-1 font-medium">
                    {selectedRecovery.borrowerName}
                  </div>
                  <span className="text-[10px] text-gray-500">Depositor Signature</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Voucher
              </button>
              <button
                onClick={() => setSelectedRecovery(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}
