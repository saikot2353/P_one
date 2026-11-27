import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Calendar,
  Building2,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
  ArrowRight
} from 'lucide-react';
import {
  getStoredStockLoanReturns,
  StockLoanReturn,
  resetStockLoanSettlementDemoData
} from '../lib/inventory-stock-loan-data';

export const Route = createFileRoute('/inv-loan-return-list')({
  component: LoanReturnListPage,
});

export default function LoanReturnListPage() {
  const navigate = useNavigate();
  const [returns, setReturns] = useState<StockLoanReturn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected return for quick view modal
  const [selectedReturn, setSelectedReturn] = useState<StockLoanReturn | null>(null);

  const loadData = () => {
    const list = getStoredStockLoanReturns();
    setReturns(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered returns
  const filteredReturns = useMemo(() => {
    return returns.filter(ret => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ret.returnId.toLowerCase().includes(q);
        const matchIssue = ret.loanIssueId.toLowerCase().includes(q);
        const matchBorrower = ret.borrowerName.toLowerCase().includes(q);
        const matchStore = ret.receivingStore.toLowerCase().includes(q);
        if (!matchId && !matchIssue && !matchBorrower && !matchStore) return false;
      }
      // Store
      if (storeFilter !== 'ALL' && ret.receivingStore !== storeFilter) return false;
      // Status
      if (statusFilter !== 'ALL' && ret.status !== statusFilter) return false;
      // Date range
      if (startDate && ret.returnDate < startDate) return false;
      if (endDate && ret.returnDate > endDate) return false;

      return true;
    });
  }, [returns, searchQuery, storeFilter, statusFilter, startDate, endDate]);

  // Aggregate stats
  const totalCount = filteredReturns.length;
  const totalQuantity = filteredReturns.reduce((sum, r) => sum + (r.totalReturnQty ?? r.totalReturnQuantity ?? 0), 0);
  const totalValue = filteredReturns.reduce((sum, r) => sum + (r.acceptedReturnValue ?? r.totalReturnValue ?? 0), 0);
  const confirmedCount = filteredReturns.filter(r => r.status === 'Confirmed').length;

  const storesList = useMemo(() => {
    const s = new Set<string>();
    returns.forEach(r => s.add(r.receivingStore));
    return Array.from(s);
  }, [returns]);

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
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Hybrid Loan Settlement
              </span>
              <span className="text-xs text-gray-500">Method 1: Physical Item Return</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Loan Return Register</h1>
            <p className="text-sm text-gray-500">
              Audit log of all physical item returns accepted into inventory stores against issued stock loans.
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
            onClick={() => navigate({ to: '/inv-loan-return' })}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Loan Return
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Returns
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2 font-mono">{totalCount}</div>
          <span className="text-xs text-gray-500 mt-1 block">{confirmedCount} confirmed receipts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Return Qty
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2 font-mono">
            {totalQuantity.toLocaleString()}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Physical units returned</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Return Value
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Valued at frozen issue cost</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Settlement Inward
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">
            {confirmedCount} Batches
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Restocked to warehouse inventory</span>
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
              placeholder="Search Return ID, Loan Issue, Borrower, Store..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={storeFilter}
            onChange={e => setStoreFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="ALL">All Receiving Stores</option>
            {storesList.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
          {(searchQuery || storeFilter !== 'ALL' || statusFilter !== 'ALL' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStoreFilter('ALL');
                setStatusFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="text-purple-600 hover:text-purple-800 text-xs font-medium ml-1"
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
                <th className="py-3 px-3">Return ID</th>
                <th className="py-3 px-3">Loan Issue ID</th>
                <th className="py-3 px-3">Return Date</th>
                <th className="py-3 px-3">Borrower & Dept</th>
                <th className="py-3 px-3">Receiving Store</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Return Qty</th>
                <th className="py-3 px-3 text-right">Return Value ($)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    <RotateCcw className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600">No loan returns found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search filters or record a new return.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret, idx) => (
                  <tr key={ret.returnId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-purple-700">
                      {ret.returnId}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate({ to: '/inv-loan-settlement-list' })}>
                        {ret.loanIssueId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{ret.returnDate}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">{ret.borrowerName}</div>
                      <div className="text-[11px] text-gray-500">{ret.department}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{ret.receivingStore}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono font-medium">
                        {ret.items.length}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900">
                      {(ret.totalReturnQty ?? ret.totalReturnQuantity ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                      ${(ret.acceptedReturnValue ?? ret.totalReturnValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          ret.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ret.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            navigate({
                              to: '/inv-loan-return',
                              search: { returnId: ret.returnId, mode: 'view' },
                            })
                          }
                          title="View / Edit Return"
                          className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedReturn(ret)}
                          title="Quick View Return Voucher"
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

      {/* QUICK VIEW MODAL */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-base font-bold">Physical Return Details: {selectedReturn.returnId}</h3>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-white hover:text-gray-200 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Return ID:</span>
                  <span className="font-bold font-mono text-gray-900">{selectedReturn.returnId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Return Date:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.returnDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Loan Issue ID:</span>
                  <span className="font-bold font-mono text-gray-900">{selectedReturn.loanIssueId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Receiving Store:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.receivingStore}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Borrower:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.borrowerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Department:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.department}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Received By:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.receivedBy}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Challan Ref:</span>
                  <span className="font-bold text-gray-900">{selectedReturn.returnChallanNo || 'N/A'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Item Code & Name</th>
                      <th className="py-2 px-3 text-center">Condition</th>
                      <th className="py-2 px-3 text-right">Return Qty</th>
                      <th className="py-2 px-3 text-right">Frozen Rate</th>
                      <th className="py-2 px-3 text-right">Return Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedReturn.items.map(item => (
                      <tr key={item.itemCode}>
                        <td className="py-2 px-3">
                          <span className="font-mono font-medium text-gray-800">{item.itemCode}</span>
                          <span className="text-gray-500 ml-2">{item.itemName}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              item.condition === 'Good'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {item.condition}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold">
                          {(item.returnQty ?? item.returnQuantity ?? 0)} {item.uom}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-gray-600">
                          ${item.issueAvgCostRate.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                          ${(item.returnValue ?? item.totalReturnValue ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 text-gray-800">
                        Total
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-900">
                        {selectedReturn.totalReturnQty ?? selectedReturn.totalReturnQuantity ?? 0}
                      </td>
                      <td></td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-sm">
                        ${(selectedReturn.acceptedReturnValue ?? selectedReturn.totalReturnValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Details
              </button>
              <button
                onClick={() => setSelectedReturn(null)}
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
