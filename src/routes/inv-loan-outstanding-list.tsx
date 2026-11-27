import React, { useState, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import {
  AlertCircle,
  Search,
  Filter,
  Eye,
  RotateCcw,
  DollarSign,
  Calendar,
  Building2,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  FileText
} from 'lucide-react';
import {
  getHybridLoanSettlementList,
  LoanSettlementSummary
} from '../lib/inventory-stock-loan-data';

export const Route = createFileRoute('/inv-loan-outstanding-list')({
  component: LoanOutstandingListPage,
});

export default function LoanOutstandingListPage() {
  const navigate = useNavigate();
  const [settlements, setSettlements] = useState<LoanSettlementSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [agingFilter, setAgingFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const loadData = () => {
    const list = getHybridLoanSettlementList();
    setSettlements(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate days elapsed from issue date
  const getDaysElapsed = (issueDateStr: string): number => {
    try {
      const issueDate = new Date(issueDateStr);
      const today = new Date();
      const diffTime = today.getTime() - issueDate.getTime();
      return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  };

  const getAgingCategory = (days: number): 'Normal' | 'Moderate' | 'Critical' => {
    if (days > 60) return 'Critical';
    if (days > 30) return 'Moderate';
    return 'Normal';
  };

  // Filter only items with outstanding balance > 0 (by default), or matched by filter
  const outstandingLoans = useMemo(() => {
    return settlements
      .filter(s => s.outstandingBalance > 0)
      .map(s => {
        const days = getDaysElapsed(s.issueDate);
        return {
          ...s,
          daysElapsed: days,
          agingCategory: getAgingCategory(days),
        };
      })
      .filter(s => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = s.loanIssueId.toLowerCase().includes(q);
          const matchBorrower = s.borrowerName.toLowerCase().includes(q);
          const matchDept = (s.department || '').toLowerCase().includes(q);
          const matchStore = (s.store || s.issuingStore || '').toLowerCase().includes(q);
          if (!matchId && !matchBorrower && !matchDept && !matchStore) return false;
        }

        if (agingFilter !== 'ALL' && s.agingCategory !== agingFilter) return false;
        if (departmentFilter !== 'ALL' && s.department !== departmentFilter) return false;

        return true;
      });
  }, [settlements, searchQuery, agingFilter, departmentFilter]);

  // Aggregate metrics
  const totalOutstandingCount = outstandingLoans.length;
  const totalOutstandingAmount = outstandingLoans.reduce((sum, s) => sum + s.outstandingBalance, 0);
  const criticalCount = outstandingLoans.filter(s => s.agingCategory === 'Critical').length;
  const criticalAmount = outstandingLoans
    .filter(s => s.agingCategory === 'Critical')
    .reduce((sum, s) => sum + s.outstandingBalance, 0);

  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    settlements.forEach(s => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set);
  }, [settlements]);

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
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Loan Aging & Financial Exposure
              </span>
              <span className="text-xs text-gray-500">Unsettled Balances Monitor</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Loan Outstanding Register</h1>
            <p className="text-sm text-gray-500">
              Track pending and overdue stock loans requiring physical item returns or monetary cash recoveries.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/inv-loan-settlement-list' })}
            className="px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Settlement Master
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-return' })}
            className="px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Item Return
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-recovery' })}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            Monetary Recovery
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unsettled Loans
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2 font-mono">
            {totalOutstandingCount}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Loans with balance &gt; $0</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-amber-300 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider">
              Total Outstanding Balance
            </span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">
            ${totalOutstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-amber-800 font-medium mt-1 block">Total financial liability</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
              Critical (&gt;60 Days)
            </span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700 mt-2 font-mono">{criticalCount} Loans</div>
          <span className="text-xs text-red-600 font-medium mt-1 block">
            ${criticalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} exposure
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recovery Options
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-800 mt-2">Physical or Cash</div>
          <span className="text-xs text-gray-500 mt-1 block">Independent hybrid settlement</span>
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
              placeholder="Search Outstanding Loan ID, Borrower, Dept, Store..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <select
            value={agingFilter}
            onChange={e => setAgingFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="ALL">All Aging Categories</option>
            <option value="Normal">Normal (&le; 30 Days)</option>
            <option value="Moderate">Moderate (31 – 60 Days)</option>
            <option value="Critical">Critical (&gt; 60 Days)</option>
          </select>

          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departmentsList.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {(searchQuery || agingFilter !== 'ALL' || departmentFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setAgingFilter('ALL');
              setDepartmentFilter('ALL');
            }}
            className="text-amber-700 hover:text-amber-900 text-xs font-medium ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Outstanding Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3">Loan Issue ID</th>
                <th className="py-3 px-3">Borrower & Dept</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3 text-center">Aging / Days</th>
                <th className="py-3 px-3 text-right">Original Value ($)</th>
                <th className="py-3 px-3 text-right text-purple-700">Physical Return ($)</th>
                <th className="py-3 px-3 text-right text-emerald-700">Monetary Recovery ($)</th>
                <th className="py-3 px-3 text-right font-bold text-amber-700">Outstanding Balance ($)</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-3 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {outstandingLoans.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    <ShieldAlert className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600">No outstanding loans matching filter</p>
                    <p className="text-xs text-gray-400 mt-1">
                      All loan obligations in this selection are fully cleared!
                    </p>
                  </td>
                </tr>
              ) : (
                outstandingLoans.map((loan, idx) => (
                  <tr key={loan.loanIssueId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                      {loan.loanIssueId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">{loan.borrowerName}</div>
                      <div className="text-[11px] text-gray-500">{loan.department || 'Production'}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{loan.issueDate}</td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      <span className="flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {loan.daysElapsed} days
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-gray-700">
                      ${loan.originalLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-purple-700">
                      ${loan.totalPhysicalReturnValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700">
                      ${loan.totalMonetaryRecovery.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-700 text-sm">
                      ${loan.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          loan.agingCategory === 'Critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : loan.agingCategory === 'Moderate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {loan.agingCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            navigate({
                              to: '/inv-loan-return',
                              search: { loanIssueId: loan.loanIssueId },
                            })
                          }
                          title="Record Physical Return"
                          className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[11px] font-medium flex items-center gap-1 border border-purple-200"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Return
                        </button>
                        <button
                          onClick={() =>
                            navigate({
                              to: '/inv-loan-recovery',
                              search: { loanIssueId: loan.loanIssueId },
                            })
                          }
                          title="Record Monetary Recovery"
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-medium flex items-center gap-1 border border-emerald-200"
                        >
                          <DollarSign className="w-3 h-3" />
                          Recover
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
          </div>
        </main>
      </div>
    </div>
  );
}
