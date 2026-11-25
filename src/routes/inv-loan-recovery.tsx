import React, { useState, useEffect, useId, useMemo } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import {
  DollarSign,
  ArrowLeft,
  Save,
  CheckCircle2,
  Printer,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Receipt,
  Eye,
  Info
} from 'lucide-react';
import {
  getStoredStockLoanIssues,
  getStoredStockLoanRecoveries,
  saveStockLoanRecovery,
  calculateLoanSettlementSummary,
  StockLoanIssue,
  StockLoanRecovery,
  StockLoanRecoveryPaymentMethod,
  LoanSettlementSummary
} from '../lib/inventory-stock-loan-data';

export const Route = createFileRoute('/inv-loan-recovery')({
  component: LoanRecoveryPage,
  validateSearch: (search: Record<string, unknown>): {
    recoveryId?: string;
    loanIssueId?: string;
    mode?: string;
  } => ({
    recoveryId: typeof search.recoveryId === 'string' ? search.recoveryId : undefined,
    loanIssueId: typeof search.loanIssueId === 'string' ? search.loanIssueId : undefined,
    mode: typeof search.mode === 'string' ? search.mode : undefined,
  }),
});

export default function LoanRecoveryPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/inv-loan-recovery' });
  const isViewOnly = search.mode === 'view';

  // Master loan issues list
  const [allLoanIssues, setAllLoanIssues] = useState<StockLoanIssue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(search.loanIssueId || '');
  const [selectedIssue, setSelectedIssue] = useState<StockLoanIssue | null>(null);
  const [settlementSummary, setSettlementSummary] = useState<LoanSettlementSummary | null>(null);

  // Recovery Form State
  const [recoveryId, setRecoveryId] = useState<string>('');
  const [recoveryDate, setRecoveryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<StockLoanRecoveryPaymentMethod>('Cash');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [bankAccountNo, setBankAccountNo] = useState<string>('');
  const [chequeNo, setChequeNo] = useState<string>('');
  const [chequeDate, setChequeDate] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [receivedBy, setReceivedBy] = useState<string>('Md. Shahadat Hossain (Accountant)');
  const [remarks, setRemarks] = useState<string>('');
  const [status, setStatus] = useState<'Draft' | 'Confirmed'>('Confirmed');

  // Preview receipt modal
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [activeReceiptData, setActiveReceiptData] = useState<StockLoanRecovery | null>(null);

  // Error & notification states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load issues and determine default recovery ID
  useEffect(() => {
    const issues = getStoredStockLoanIssues();
    setAllLoanIssues(issues);

    if (search.recoveryId) {
      // Editing or viewing an existing recovery record
      const allRecs = getStoredStockLoanRecoveries();
      const existing = allRecs.find(r => r.recoveryId === search.recoveryId);
      if (existing) {
        setRecoveryId(existing.recoveryId);
        setRecoveryDate(existing.recoveryDate);
        setSelectedIssueId(existing.loanIssueId);
        setReceiveAmount(existing.receiveAmount);
        setPaymentMethod(existing.paymentMethod);
        setPaymentRef(existing.paymentReference || '');
        setBankName(existing.bankName || '');
        setBankAccountNo(existing.bankAccountNo || '');
        setChequeNo(existing.chequeNo || '');
        setChequeDate(existing.chequeDate || '');
        setTransactionRef(existing.transactionReference || '');
        setReceivedBy(existing.receivedBy);
        setRemarks(existing.remarks || '');
        setStatus(existing.status);

        const parentIssue = issues.find(i => i.loanIssueId === existing.loanIssueId);
        if (parentIssue) {
          setSelectedIssue(parentIssue);
          const summ = calculateLoanSettlementSummary(parentIssue.loanIssueId);
          setSettlementSummary(summ);
        }
        return;
      }
    }

    // Auto-generate a new recovery ID
    const year = new Date().getFullYear();
    const allRecs = getStoredStockLoanRecoveries();
    const count = allRecs.length + 1;
    const generatedId = `LREC-${year}-${String(count).padStart(5, '0')}`;
    setRecoveryId(generatedId);

    // If pre-selected loanIssueId in URL query
    if (search.loanIssueId) {
      const match = issues.find(i => i.loanIssueId === search.loanIssueId);
      if (match) {
        setSelectedIssueId(match.loanIssueId);
        setSelectedIssue(match);
        const summ = calculateLoanSettlementSummary(match.loanIssueId);
        setSettlementSummary(summ);
        // Pre-fill amount with remaining outstanding if desirable, or default 0
        setReceiveAmount(summ ? summ.outstandingBalance : match.outstandingBalance || 0);
      }
    }
  }, [search.recoveryId, search.loanIssueId]);

  // Handle changing Loan Issue selection
  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!issueId) {
      setSelectedIssue(null);
      setSettlementSummary(null);
      setReceiveAmount(0);
      return;
    }

    const issue = allLoanIssues.find(i => i.loanIssueId === issueId);
    if (issue) {
      setSelectedIssue(issue);
      const summ = calculateLoanSettlementSummary(issue.loanIssueId);
      setSettlementSummary(summ);
      const maxBalance = summ ? summ.outstandingBalance : (issue.outstandingBalance || 0);
      setReceiveAmount(maxBalance > 0 ? maxBalance : 0);
    }
  };

  // Outstanding calculations
  const outstandingBefore = settlementSummary ? settlementSummary.outstandingBalance : (selectedIssue?.outstandingBalance || 0);
  const outstandingAfter = Math.max(0, outstandingBefore - (Number(receiveAmount) || 0));
  const isFullySettled = outstandingAfter === 0 && (Number(receiveAmount) > 0 || outstandingBefore === 0);

  // Validation
  const isValidAmount = receiveAmount > 0 && receiveAmount <= outstandingBefore;

  // Handle Submit / Save
  const handleSaveRecovery = (actionStatus: 'Draft' | 'Confirmed') => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedIssue) {
      setErrorMsg('Please select a valid Loan Issue reference with an outstanding balance.');
      return;
    }

    if (receiveAmount <= 0) {
      setErrorMsg('Receive Amount must be greater than 0.');
      return;
    }

    if (receiveAmount > outstandingBefore) {
      setErrorMsg(
        `Receive Amount ($${receiveAmount.toFixed(2)}) cannot exceed the outstanding loan balance ($${outstandingBefore.toFixed(2)}).`
      );
      return;
    }

    if (!receivedBy.trim()) {
      setErrorMsg('Payment Received By name/staff is mandatory.');
      return;
    }

    if ((paymentMethod === 'Bank' || paymentMethod === 'Cheque') && !bankName.trim()) {
      setErrorMsg(`Bank Name is required when payment method is ${paymentMethod}.`);
      return;
    }

    const recoveryRecord: StockLoanRecovery = {
      id: `lrec-${Date.now()}`,
      recoveryId: recoveryId || `LREC-${new Date().getFullYear()}-00001`,
      recoveryDate,
      loanIssueId: selectedIssue.loanIssueId,
      loanIssueDate: selectedIssue.issueDate || selectedIssue.loanDate || '',
      borrowerName: selectedIssue.borrowerName || selectedIssue.requestedBy || 'Borrower',
      department: selectedIssue.department || 'Production',
      issuingCompany: selectedIssue.fromCompany || '',
      receivingCompany: selectedIssue.toCompany || '',
      originalLoanValue: settlementSummary?.originalLoanValue || selectedIssue.totalLoanValue || 0,
      outstandingBeforeRecovery: outstandingBefore,
      receiveAmount: Number(receiveAmount),
      outstandingAfterRecovery: outstandingAfter,
      paymentMethod,
      paymentReference: paymentRef.trim() || undefined,
      bankName: bankName.trim() || undefined,
      bankAccountNo: bankAccountNo.trim() || undefined,
      chequeNo: chequeNo.trim() || undefined,
      chequeDate: chequeDate || undefined,
      transactionReference: transactionRef.trim() || undefined,
      receiveDate: recoveryDate,
      receivedBy: receivedBy.trim(),
      remarks: remarks.trim() || undefined,
      status: actionStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStockLoanRecovery(recoveryRecord);
    setActiveReceiptData(recoveryRecord);

    if (actionStatus === 'Confirmed') {
      setSuccessMsg(
        `Money Recovery ${recoveryRecord.recoveryId} confirmed successfully! Loan Issue ${selectedIssue.loanIssueId} updated.`
      );
      setShowReceiptModal(true);
    } else {
      setSuccessMsg(`Draft recovery ${recoveryRecord.recoveryId} saved successfully.`);
    }

    // Refresh settlement summary
    const updatedSummary = calculateLoanSettlementSummary(selectedIssue.loanIssueId);
    setSettlementSummary(updatedSummary);
    setAllLoanIssues(getStoredStockLoanIssues());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/inv-loan-recovery-list' })}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Back to Recovery Register"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Hybrid Loan Settlement
              </span>
              <span className="text-xs text-gray-500">Method 2: Monetary Recovery</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-emerald-600" />
              {isViewOnly ? 'View Monetary Recovery' : 'New Loan Recovery (Cash/Bank)'}
            </h1>
            <p className="text-sm text-gray-500">
              Record monetary payments from borrowers against issued stock loans without altering inventory stock.
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate({ to: '/inv-loan-recovery-list' })}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            Recovery Register
          </button>
          <button
            onClick={() => navigate({ to: '/inv-loan-settlement-list' })}
            className="px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Settlement Register
          </button>
          {!isViewOnly && (
            <>
              <button
                onClick={() => handleSaveRecovery('Draft')}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-gray-500" />
                Save Draft
              </button>
              <button
                onClick={() => handleSaveRecovery('Confirmed')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Money Receipt
              </button>
            </>
          )}
          {isViewOnly && (
            <button
              onClick={() => {
                if (recoveryId) {
                  const allRecs = getStoredStockLoanRecoveries();
                  const found = allRecs.find(r => r.recoveryId === recoveryId);
                  if (found) {
                    setActiveReceiptData(found);
                    setShowReceiptModal(true);
                  }
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-semibold">Validation Error:</span> {errorMsg}
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <span className="font-semibold">Success:</span> {successMsg}
          </div>
        </div>
      )}

      {/* Settlement Principle Note */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Monetary Recovery Rule (Section 1.2):</span>{' '}
          Monetary recovery records cash/bank receipts from the borrower when physical return is not feasible or chosen.
          This transaction directly reduces the financial <strong>Outstanding Loan Balance</strong> of the loan issue
          without generating any store stock inward or altering warehouse item quantities.
        </div>
      </div>

      {/* SECTION 1: HEADER & LOAN SELECTION */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
          <FileText className="w-5 h-5 text-gray-500" />
          Recovery Identification & Loan Reference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Recovery ID</label>
            <input
              type="text"
              readOnly
              value={recoveryId}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 select-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Recovery Date</label>
            <input
              type="date"
              disabled={isViewOnly}
              value={recoveryDate}
              onChange={e => setRecoveryDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Select Loan Issue Reference <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                disabled={isViewOnly}
                value={selectedIssueId}
                onChange={e => handleSelectIssue(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              >
                <option value="">-- Select Loan Issue with Outstanding Balance --</option>
                {allLoanIssues.map(issue => {
                  const bal = issue.outstandingBalance ?? issue.totalLoanValue ?? 0;
                  return (
                    <option key={issue.loanIssueId} value={issue.loanIssueId}>
                      {issue.loanIssueId} — {issue.borrowerName || issue.requestedBy || 'Borrower'} ({issue.department || 'Prod'}) — Bal: ${bal.toLocaleString(undefined, { minimumFractionDigits: 2 })} [{issue.settlementStatus || 'Unsettled'}]
                    </option>
                  );
                })}
              </select>
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Read-only Borrower & Loan context if selected */}
        {selectedIssue && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Borrower / Partner:</span>
              <span className="font-semibold text-gray-800 text-sm">
                {selectedIssue.borrowerName || selectedIssue.requestedBy || 'Borrower'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Department / Unit:</span>
              <span className="font-semibold text-gray-800 text-sm">
                {selectedIssue.department || 'Production'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Issuing Company:</span>
              <span className="font-semibold text-gray-800 text-sm">{selectedIssue.fromCompany || selectedIssue.toCompany}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Issue Date & Ref:</span>
              <span className="font-semibold text-gray-800 text-sm">
                {selectedIssue.issueDate} ({selectedIssue.loanType || 'Inter-Company'})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: LIVE SETTLEMENT SUMMARY CARDS */}
      {selectedIssue && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
              1. Original Loan Value
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-mono">
                ${(settlementSummary?.originalLoanValue || selectedIssue.totalLoanValue || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                Baseline
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Based on issue-time cost snapshot</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
              2. Total Physical Return
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-purple-700 font-mono">
                ${(settlementSummary?.totalPhysicalReturnValue || selectedIssue.totalPhysicalReturnValue || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">
                Inward Credit
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {settlementSummary?.returnTransactionsCount || 0} physical return batch(es)
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
              3. Prior Monetary Recovery
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-700 font-mono">
                ${(settlementSummary?.totalMonetaryRecovery || selectedIssue.totalMonetaryRecovery || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Cash/Bank
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {settlementSummary?.recoveryTransactionsCount || 0} previous payment(s)
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-amber-300 bg-amber-50/20 shadow-sm">
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider block">
              4. Current Outstanding
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-700 font-mono">
                ${outstandingBefore.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  outstandingBefore <= 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {outstandingBefore <= 0 ? 'Settled' : 'Unpaid'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Max acceptable monetary recovery</p>
          </div>
        </div>
      )}

      {/* SECTION 3: RECOVERY PAYMENT ENTRY & IMPACT PREVIEW */}
      {selectedIssue && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Input Form (2 Cols) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 border-b pb-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Recovery Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Current Receive Amount ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={outstandingBefore}
                    disabled={isViewOnly}
                    value={receiveAmount || ''}
                    onChange={e => setReceiveAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg text-lg font-bold font-mono focus:ring-2 focus:outline-none ${
                      receiveAmount > outstandingBefore
                        ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-400'
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className="text-gray-500">
                    Max: ${outstandingBefore.toFixed(2)}
                  </span>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => setReceiveAmount(outstandingBefore)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Pay Full Balance
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isViewOnly}
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as StockLoanRecoveryPaymentMethod)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Cash">Cash Receipt</option>
                  <option value="Bank">Bank Deposit / EFT / RTGS</option>
                  <option value="Cheque">Cheque Payment</option>
                  <option value="Other">Other / Adjustment</option>
                </select>
              </div>

              {/* Conditional Bank Details */}
              {(paymentMethod === 'Bank' || paymentMethod === 'Cheque') && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isViewOnly}
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. Eastern Bank Ltd., Dhaka"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {paymentMethod === 'Cheque' ? 'Cheque No & Date' : 'Account Number'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={isViewOnly}
                        value={paymentMethod === 'Cheque' ? chequeNo : bankAccountNo}
                        onChange={e =>
                          paymentMethod === 'Cheque'
                            ? setChequeNo(e.target.value)
                            : setBankAccountNo(e.target.value)
                        }
                        placeholder={paymentMethod === 'Cheque' ? 'Cheque #' : 'A/C #'}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {paymentMethod === 'Cheque' && (
                        <input
                          type="date"
                          disabled={isViewOnly}
                          value={chequeDate}
                          onChange={e => setChequeDate(e.target.value)}
                          className="w-36 bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Reference / Money Receipt #
                </label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  placeholder="e.g. MR-2026-8812"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Transaction Reference / Challan #
                </label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="e.g. TXN-998811"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Payment Received By (Staff / Official) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={receivedBy}
                  onChange={e => setReceivedBy(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Remarks / Settlement Justification
                </label>
                <textarea
                  rows={2}
                  disabled={isViewOnly}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Specify payment details, agreement terms, or monetary recovery reason..."
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Settlement Impact Preview (1 Col) */}
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Settlement Impact Preview
                </h3>
                <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                  Live
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Balance Before:</span>
                  <span className="font-mono font-medium">
                    ${outstandingBefore.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-100/60 p-2 rounded-lg">
                  <span>(-) Current Payment:</span>
                  <span className="font-mono">
                    -${(Number(receiveAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Remaining Balance:</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      outstandingAfter === 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    ${outstandingAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">Resulting Loan Status:</span>
                  {isFullySettled ? (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-2.5 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Fully Settled</div>
                        <div className="text-[11px] text-emerald-700">
                          Loan issue is 100% cleared through hybrid settlement.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-300 text-amber-800 p-2.5 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Partially Settled</div>
                        <div className="text-[11px] text-amber-700">
                          ${outstandingAfter.toFixed(2)} remains outstanding on this loan.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action button inside preview */}
            {!isViewOnly && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={!isValidAmount}
                  onClick={() => handleSaveRecovery('Confirmed')}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold shadow transition-all flex items-center justify-center gap-2 ${
                    isValidAmount
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Post Recovery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRINTABLE MONEY RECEIPT MODAL */}
      {showReceiptModal && activeReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                <h3 className="text-lg font-bold">Money Receipt Voucher</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-white hover:text-gray-200 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Receipt Voucher Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-gray-800 printable-voucher">
              {/* Company Branding */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">
                  {activeReceiptData.issuingCompany}
                </h2>
                <p className="text-xs text-gray-500">Corporate Inventory & Materials Division</p>
                <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Stock Loan Monetary Recovery Receipt
                </div>
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Receipt No:</span>
                  <span className="font-bold font-mono text-sm text-gray-900">
                    {activeReceiptData.recoveryId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Date of Payment:</span>
                  <span className="font-bold text-sm text-gray-900">
                    {activeReceiptData.recoveryDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Loan Issue Reference:</span>
                  <span className="font-bold font-mono text-gray-900">
                    {activeReceiptData.loanIssueId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Borrower / Party:</span>
                  <span className="font-bold text-gray-900">
                    {activeReceiptData.borrowerName} ({activeReceiptData.department})
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Payment Instrument</th>
                      <th className="py-2.5 px-3 text-right">Received Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">
                          Stock Loan Cash/Bank Settlement
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Against Loan Issue {activeReceiptData.loanIssueId}
                        </div>
                        {activeReceiptData.paymentReference && (
                          <div className="text-[11px] text-gray-500">
                            MR / Ref: {activeReceiptData.paymentReference}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {activeReceiptData.paymentMethod}
                        </span>
                        {activeReceiptData.bankName && (
                          <div className="text-[11px] text-gray-600 mt-1">
                            {activeReceiptData.bankName}
                            {activeReceiptData.chequeNo && ` (Chq #${activeReceiptData.chequeNo})`}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-base text-emerald-700">
                        ${activeReceiptData.receiveAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Settlement Balances */}
              <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1.5 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Loan Value:</span>
                  <span className="font-mono">
                    ${activeReceiptData.originalLoanValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outstanding Before Payment:</span>
                  <span className="font-mono">
                    ${activeReceiptData.outstandingBeforeRecovery.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1.5 text-gray-900">
                  <span>Balance After Payment:</span>
                  <span
                    className={`font-mono ${
                      activeReceiptData.outstandingAfterRecovery === 0
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    ${activeReceiptData.outstandingAfterRecovery.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-gray-600">
                <div>
                  <div className="border-t border-gray-400 w-44 mx-auto pt-1 font-semibold">
                    {activeReceiptData.receivedBy}
                  </div>
                  <span className="text-[11px] text-gray-500">Received By / Accounts Officer</span>
                </div>
                <div>
                  <div className="border-t border-gray-400 w-44 mx-auto pt-1 font-semibold">
                    {activeReceiptData.borrowerName}
                  </div>
                  <span className="text-[11px] text-gray-500">Borrower / Depositor Signature</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print Voucher
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
