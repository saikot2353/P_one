import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  RotateCcw,
  DollarSign,
  Package,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Boxes,
  Plus,
  ArrowRight,
  ExternalLink,
  Receipt
} from 'lucide-react';
import {
  getHybridLoanSettlementList,
  LoanSettlementSummary,
  resetStockLoanSettlementDemoData
} from '../lib/inventory-stock-loan-data';

export const Route = createFileRoute('/inv-loan-settlement-list')({
  component: LoanSettlementListPage,
});

export default function LoanSettlementListPage() {
  const navigate = useNavigate();
  const [settlements, setSettlements] = useState<LoanSettlementSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Breakdown modal
  const [selectedSummary, setSelectedSummary] = useState<LoanSettlementSummary | null>(null);

  const loadData = () => {
    const list = getHybridLoanSettlementList();
    setSettlements(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered settlements
  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = s.loanIssueId.toLowerCase().includes(q);
        const matchBorrower = s.borrowerName.toLowerCase().includes(q);
        const matchDept = (s.department || '').toLowerCase().includes(q);
        const matchStore = (s.store || s.issuingStore || '').toLowerCase().includes(q);
        if (!matchId && !matchBorrower && !matchDept && !matchStore) return false;
      }

      if (statusFilter !== 'ALL' && s.settlementStatus !== statusFilter) return false;
      if (departmentFilter !== 'ALL' && s.department !== departmentFilter) return false;

      return true;
    });
  }, [settlements, searchQuery, statusFilter, departmentFilter]);

  // Aggregated totals
  const totalLoanIssues = filteredSettlements.length;
  const totalOriginalValue = filteredSettlements.reduce((sum, s) => sum + s.originalLoanValue, 0);
  const totalPhysicalReturned = filteredSettlements.reduce((sum, s) => sum + s.totalPhysicalReturnValue, 0);
  const totalMonetaryRecovered = filteredSettlements.reduce((sum, s) => sum + s.totalMonetaryRecovery, 0);
  const totalOutstanding = filteredSettlements.reduce((sum, s) => sum + s.outstandingBalance, 0);

  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    settlements.forEach(s => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set);
  }, [settlements]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Hybrid Loan Settlement Master
              </span>
              <span className="text-xs text-gray-500">CriptonHRIS Inventory</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Loan Settlement Register</h1>
            <p className="text-sm text-gray-500">
              Consolidated reconciliation of all stock loans across physical item returns and monetary cash/bank recoveries.
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate({ to: '/inv-loan-return' })}
            className="px-4 py-2 border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            + New Return
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-recovery' })}
            className="px-4 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            + New Recovery
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-outstanding-list' })}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
          >
            Outstanding Monitor
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
            Total Loan Issues
          </span>
          <div className="text-2xl font-bold text-gray-900 mt-1 font-mono">{totalLoanIssues}</div>
          <span className="text-xs text-gray-500 mt-1 block">Active loan portfolio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
            Original Loan Value
          </span>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono">
            ${totalOriginalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Snapshot at issue time</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
            Physical Returned
          </span>
          <div className="text-2xl font-bold text-purple-700 mt-1 font-mono">
            ${totalPhysicalReturned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Warehouse inward credit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
            Monetary Recovered
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            ${totalMonetaryRecovered.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Cash / bank receipts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-amber-300 bg-amber-50/20 shadow-sm">
          <span className="text-xs font-medium text-amber-800 uppercase tracking-wider block">
            Total Outstanding
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-amber-800 font-medium mt-1 block">Unrecovered balance</span>
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
              placeholder="Search Loan Issue ID, Borrower, Department, Store..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Settlement Statuses</option>
            <option value="Settled">Fully Settled</option>
            <option value="Partially Settled">Partially Settled</option>
            <option value="Unsettled">Unsettled (0% Cleared)</option>
          </select>

          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departmentsList.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {(searchQuery || statusFilter !== 'ALL' || departmentFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setDepartmentFilter('ALL');
            }}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Master Settlement Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3">Loan Issue ID</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Borrower & Dept</th>
                <th className="py-3 px-3">Store</th>
                <th className="py-3 px-3 text-right">Original Value ($)</th>
                <th className="py-3 px-3 text-right text-purple-700">Physical Return ($)</th>
                <th className="py-3 px-3 text-right text-emerald-700">Monetary Recovery ($)</th>
                <th className="py-3 px-3 text-right font-bold text-amber-700">Outstanding ($)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    <ShieldCheck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600">No settlement records found</p>
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((s, idx) => (
                  <tr key={s.loanIssueId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                      {s.loanIssueId}
                    </td>
                    <td className="py-3 px-3 text-gray-600">{s.issueDate}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">{s.borrowerName}</div>
                      <div className="text-[11px] text-gray-500">{s.department || 'Production'}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{s.store}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-gray-800">
                      ${s.originalLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-purple-700">
                      ${s.totalPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700">
                      ${s.totalMonetaryRecovery.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-700 text-sm">
                      ${s.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          s.settlementStatus === 'Fully Settled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.settlementStatus === 'Partially Settled'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {s.settlementStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSummary(s)}
                          title="View Hybrid Reconciliation Breakdown"
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Breakdown
                        </button>
                        {s.outstandingBalance > 0 && (
                          <>
                            <button
                              onClick={() =>
                                navigate({
                                  to: '/inv-loan-return',
                                  search: { loanIssueId: s.loanIssueId },
                                })
                              }
                              title="Return Items"
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate({
                                  to: '/inv-loan-recovery',
                                  search: { loanIssueId: s.loanIssueId },
                                })
                              }
                              title="Collect Monetary Recovery"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED HYBRID BREAKDOWN MODAL */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-base font-bold">
                  Hybrid Loan Settlement Breakdown: {selectedSummary.loanIssueId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSummary(null)}
                className="text-white hover:text-gray-200 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Borrower / Partner:</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedSummary.borrowerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedSummary.department || 'Production'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Issue Date & Store:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedSummary.issueDate} ({selectedSummary.store})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Settlement Status:</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-semibold text-xs mt-0.5 ${
                      selectedSummary.settlementStatus === 'Fully Settled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedSummary.settlementStatus}
                  </span>
                </div>
              </div>

              {/* Settlement Equation Bar */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 text-center">
                <span className="text-xs font-semibold text-blue-900 block mb-2">
                  Reconciliation Equation (Section 1.3)
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-xs">
                    <span className="text-[10px] text-gray-500 block font-sans">Original Loan Value</span>
                    <span className="font-bold text-gray-900">${selectedSummary.originalLoanValue.toFixed(2)}</span>
                  </div>
                  <span className="text-gray-500 font-bold text-base">-</span>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-300 shadow-xs">
                    <span className="text-[10px] text-purple-700 block font-sans">Physical Return Value</span>
                    <span className="font-bold text-purple-700">${selectedSummary.totalPhysicalReturnValue.toFixed(2)}</span>
                  </div>
                  <span className="text-gray-500 font-bold text-base">-</span>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-xs">
                    <span className="text-[10px] text-emerald-700 block font-sans">Monetary Recovery</span>
                    <span className="font-bold text-emerald-700">${selectedSummary.totalMonetaryRecovery.toFixed(2)}</span>
                  </div>
                  <span className="text-gray-500 font-bold text-base">=</span>
                  <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-amber-400 shadow-xs">
                    <span className="text-[10px] text-amber-800 block font-sans font-bold">Outstanding Balance</span>
                    <span className="font-bold text-amber-700 text-base">${selectedSummary.outstandingBalance.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* SECTION A: PHYSICAL RETURN AUDIT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <RotateCcw className="w-4 h-4 text-purple-600" />
                    Method 1: Physical Item Returns ({selectedSummary.returnTransactions?.length || 0} Batches)
                  </h4>
                  <span className="text-purple-700 font-semibold font-mono">
                    Total: ${selectedSummary.totalPhysicalReturnValue.toFixed(2)}
                  </span>
                </div>
                {!selectedSummary.returnTransactions || selectedSummary.returnTransactions.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-center border">
                    No physical item returns recorded yet against this loan.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-purple-50/70 text-purple-900 font-semibold">
                        <tr>
                          <th className="py-2 px-3">Return ID</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Store</th>
                          <th className="py-2 px-3 text-right">Items / Qty</th>
                          <th className="py-2 px-3 text-right">Credited Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedSummary.returnTransactions.map((ret: any) => (
                          <tr key={ret.returnId}>
                            <td className="py-2 px-3 font-mono font-semibold text-purple-700">
                              {ret.returnId}
                            </td>
                            <td className="py-2 px-3 text-gray-600">{ret.returnDate}</td>
                            <td className="py-2 px-3">{ret.receivingStore}</td>
                            <td className="py-2 px-3 text-right font-mono">
                              {ret.items?.length || 0} items ({ret.totalReturnQty ?? ret.totalReturnQuantity ?? 0} units)
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-purple-700">
                              ${(ret.acceptedReturnValue ?? ret.totalReturnValue ?? 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION B: MONETARY RECOVERY AUDIT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Method 2: Monetary Cash/Bank Recoveries ({selectedSummary.recoveryTransactions?.length || 0} Transactions)
                  </h4>
                  <span className="text-emerald-700 font-semibold font-mono">
                    Total: ${selectedSummary.totalMonetaryRecovery.toFixed(2)}
                  </span>
                </div>
                {!selectedSummary.recoveryTransactions || selectedSummary.recoveryTransactions.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-center border">
                    No monetary recovery payments recorded yet against this loan.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-emerald-50/70 text-emerald-900 font-semibold">
                        <tr>
                          <th className="py-2 px-3">Recovery ID</th>
                          <th className="py-2 px-3">Payment Date</th>
                          <th className="py-2 px-3">Method</th>
                          <th className="py-2 px-3">Reference / Bank</th>
                          <th className="py-2 px-3 text-right">Received Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedSummary.recoveryTransactions.map((rec: any) => (
                          <tr key={rec.recoveryId}>
                            <td className="py-2 px-3 font-mono font-semibold text-emerald-700">
                              {rec.recoveryId}
                            </td>
                            <td className="py-2 px-3 text-gray-600">{rec.recoveryDate}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {rec.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-600">
                              {rec.paymentReference || rec.bankName || 'Cash Desk'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                              ${rec.receiveAmount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Loan Issue: <span className="font-mono font-bold">{selectedSummary.loanIssueId}</span>
              </div>
              <div className="flex gap-2">
                {selectedSummary.outstandingBalance > 0 && (
                  <>
                    <button
                      onClick={() => {
                        const id = selectedSummary.loanIssueId;
                        setSelectedSummary(null);
                        navigate({ to: '/inv-loan-return', search: { loanIssueId: id } });
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Add Return
                    </button>
                    <button
                      onClick={() => {
                        const id = selectedSummary.loanIssueId;
                        setSelectedSummary(null);
                        navigate({ to: '/inv-loan-recovery', search: { loanIssueId: id } });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Add Recovery
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedSummary(null)}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
