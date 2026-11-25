// src/lib/inventory-stock-loan-data.ts
// Unified Stock Loan Module Data Layer
// LocalStorage Keys: cripton_stock_loan_*
// Completely isolated from Stock Transfers

import { getStoredData, setStoredData, DEFAULT_ITEMS } from "./procurement-master-data";
import { INITIAL_STOCK_BALANCE_DATA } from "./reports-mock-data";

// ---------------------------------------------------------------------------
// 1. Stock Loan Requisition
// ---------------------------------------------------------------------------
export type LoanType = "Inter-Company" | "Intra-Company";

export type LoanReasonType =
  | "Stock Replenishment"
  | "Stock Balancing"
  | "Business Requirement"
  | "Emergency Requirement"
  | "Other";

export type LoanRequisitionStatus =
  | "Draft"
  | "Approval Pending"
  | "Approved"
  | "Returned for Correction"
  | "Rejected"
  | "Partially Issued"
  | "Fully Issued";

export interface LoanRequisitionItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  requiredQty: number;
  approvedQty?: number;
  issuedQty?: number;
  receivedQty?: number;
  availableStock?: number;
  estimatedUnitPrice: number;
  totalEstimatedValue: number;
  remarks?: string;
}

export interface StockLoanRequisition {
  id: string;
  requisitionNumber: string; // LR-2026-0001
  requisitionDate: string;
  loanType: LoanType;
  requisitioningCompany: string;
  requisitioningStore: string;
  requestedFromCompany: string;
  requestedFromStore: string;
  requestedBy: string;
  remarks?: string;
  totalItems: number;
  totalRequiredQty: number;
  totalEstimatedValue: number;
  status: LoanRequisitionStatus;
  approvedBy?: string;
  approvalDate?: string;
  approvalRemarks?: string;
  returnedRemarks?: string;
  rejectedRemarks?: string;
  items: LoanRequisitionItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 2. Stock Loan Issue
// ---------------------------------------------------------------------------
export type LoanIssueStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Dispatched"
  | "Received"
  | "Cancelled";

export interface LoanIssueBatchAllocation {
  batchNumber: string;
  quantity: number;
}

export interface LoanIssueLocationAllocation {
  locationName: string;
  quantity: number;
}

export interface StockLoanIssueItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  availableStock: number;
  lrRequisitionQty?: number;
  loanQty: number;
  unitPrice: number;
  totalValue: number;
  // Valuation Snapshot (Issue-time Inventory Average Cost / Weighted Average Cost)
  issueAvgCostRate?: number;
  totalLoanValue?: number;
  hasValidValuation?: boolean;
  valuationSource?: string;
  valuationSnapshotDate?: string;
  batchAllocations?: LoanIssueBatchAllocation[];
  locationAllocations?: LoanIssueLocationAllocation[];
  remarks?: string;
}

export interface StockLoanIssue {
  id: string;
  loanIssueId: string; // LI-2026-0001
  loanId?: string; // alias
  issueDate: string;
  loanDate?: string; // alias for issueDate
  loanType: LoanType;
  loanReason?: string;
  reasonDetails?: string;
  taggedRequisitionNumber?: string;
  taggedRequisitionId?: string;
  loanRequisitionNumber?: string; // alias
  loanRequisitionId?: string; // alias
  borrowerName?: string; // Borrower / Employee
  department?: string; // Department
  fromCompany: string;
  fromStore: string;
  toCompany: string;
  toStore: string;
  status: LoanIssueStatus;
  issuedBy: string;
  requestedBy?: string; // alias
  dispatchDate?: string;
  transportMethod?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverContact?: string;
  remarks?: string;
  totalItems: number;
  totalLoanQty: number;
  totalValue: number;
  totalLoanValue?: number; // alias
  // Hybrid Loan Settlement Summary Fields
  totalPhysicalReturnValue?: number;
  totalMonetaryRecovery?: number;
  outstandingBalance?: number;
  settlementStatus?: "Pending" | "Partially Settled" | "Fully Settled" | "Pending Inspection";
  items: StockLoanIssueItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 3. Stock Loan Receipt
// ---------------------------------------------------------------------------
export type LoanReceiveStatus = "Pending Receive" | "Partially Received" | "Fully Received";

export interface StockLoanReceiptItem {
  id: string;
  loanItemId: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  dispatchedQty: number;
  receivedQty: number;
  acceptedQty: number;
  shortageDamagedQty: number;
  unitPrice: number;
  batchAllocations?: LoanIssueBatchAllocation[];
  locationAllocations?: LoanIssueLocationAllocation[];
  remarks?: string;
}

export interface StockLoanReceipt {
  id: string;
  receiveId: string; // LRX-2026-0001
  receiveDate: string;
  loanIssueId: string;
  loanIssueReferenceId: string;
  loanReferenceId?: string; // alias
  loanId?: string; // alias
  issueDate: string;
  loanDate?: string; // alias
  dispatchDate: string;
  fromCompany: string;
  fromStore: string;
  toCompany: string;
  toStore: string;
  receivedBy: string;
  remarks?: string;
  totalItems: number;
  totalDispatchedQty: number;
  totalReceivedQty: number;
  totalAcceptedQty: number;
  totalShortageDamagedQty: number;
  totalVarianceQty?: number; // alias
  status: LoanReceiveStatus;
  items: StockLoanReceiptItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 4. Loan Issue Against Receive
// ---------------------------------------------------------------------------
export interface LoanIssueAgainstReceiveItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  receivedQty: number;
  availableReceivedQty: number;
  issueQty: number;
  unitPrice: number;
  totalValue: number;
  receiptNumber: string;
  batchAllocations?: LoanIssueBatchAllocation[];
  locationAllocations?: LoanIssueLocationAllocation[];
  remarks?: string;
}

export interface LoanIssueAgainstReceive {
  id: string;
  issueNo: string; // LIAR-2026-0001
  issueDate: string;
  loanRequisitionId: string;
  loanRequisitionNumber: string;
  selectedReceiptNumbers: string[];
  issuingCompany: string;
  issuingStore: string;
  receivingCompany: string;
  receivingStore: string;
  status: "Draft" | "Approved" | "Dispatched" | "Completed";
  issuedBy: string;
  remarks?: string;
  totalItems: number;
  totalIssueQty: number;
  totalValue: number;
  items: LoanIssueAgainstReceiveItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 5. Loan Receive Against Issue
// ---------------------------------------------------------------------------
export interface LoanReceiveAgainstIssueItem {
  id: string;
  issueItemId: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  issuedQty: number;
  previouslyReceivedQty: number;
  currentReceiveQty: number;
  remainingQty: number;
  acceptedQty: number;
  rejectedQty: number;
  damageShortQty?: number;
  unitPrice: number;
  batchAllocations?: LoanIssueBatchAllocation[];
  locationAllocations?: LoanIssueLocationAllocation[];
  remarks?: string;
}

export interface LoanReceiveAgainstIssue {
  id: string;
  receiveNo: string; // LRAI-2026-0001
  receiveDate: string;
  loanIssueNo: string;
  loanIssueId: string;
  issuingCompany: string;
  issuingStore: string;
  receivingCompany: string;
  receivingStore: string;
  status: "Pending" | "Partially Received" | "Complete";
  receivedBy: string;
  remarks?: string;
  totalItems: number;
  totalIssuedQty: number;
  totalReceivedQty: number;
  items: LoanReceiveAgainstIssueItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// SEED DATA
// ---------------------------------------------------------------------------
export const SEED_LOAN_REQUISITIONS: StockLoanRequisition[] = [
  {
    id: "slr-seed-001",
    requisitionNumber: "LR-2026-0001",
    requisitionDate: "2026-10-18",
    loanType: "Inter-Company",
    requisitioningCompany: "Pakiza Knit Composite Ltd.",
    requisitioningStore: "Dyeing Chemical Store",
    requestedFromCompany: "Pakiza Apparels Ltd.",
    requestedFromStore: "Finishing Store - Norshingdi",
    requestedBy: "Md. Aminul Islam (Store Officer)",
    remarks: "Urgent production stock loan for reactive dye chemicals.",
    totalItems: 2,
    totalRequiredQty: 150,
    totalEstimatedValue: 185000,
    status: "Approved",
    approvedBy: "Engr. Farhan Tanvir (GM Operations)",
    approvalDate: "2026-10-19",
    items: [
      {
        id: "lri-001",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        requiredQty: 100,
        availableStock: 350,
        estimatedUnitPrice: 1250,
        totalEstimatedValue: 125000,
        remarks: "Immediate batch run",
      },
      {
        id: "lri-002",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        requiredQty: 50,
        availableStock: 200,
        estimatedUnitPrice: 1200,
        totalEstimatedValue: 60000,
        remarks: "Color fixation auxiliary",
      },
    ],
    createdAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-19T14:30:00Z",
  },
  {
    id: "slr-seed-002",
    requisitionNumber: "LR-2026-0002",
    requisitionDate: "2026-10-24",
    loanType: "Inter-Company",
    requisitioningCompany: "Pakiza Apparels Ltd.",
    requisitioningStore: "Accessories Store",
    requestedFromCompany: "Pakiza Knit Composite Ltd.",
    requestedFromStore: "Central Accessories Hub",
    requestedBy: "Nusrat Jahan (Materials Planner)",
    remarks: "Loan for export garment sewing thread shortage.",
    totalItems: 1,
    totalRequiredQty: 400,
    totalEstimatedValue: 88000,
    status: "Approval Pending",
    items: [
      {
        id: "lri-003",
        sl: 1,
        itemCode: "ITM-THR-001",
        itemName: "Sewing Thread 100% Spun Polyester 40/2",
        specification: "Ticket 120, Shade Black 001",
        brand: "Coats",
        origin: "UK",
        uom: "Cone",
        requiredQty: 400,
        availableStock: 1200,
        estimatedUnitPrice: 220,
        totalEstimatedValue: 88000,
        remarks: "Style #H&M-Autumn-26",
      },
    ],
    createdAt: "2026-10-24T09:15:00Z",
    updatedAt: "2026-10-24T09:15:00Z",
  },
];

export const SEED_LOAN_ISSUES: StockLoanIssue[] = [
  {
    id: "sli-seed-001",
    loanIssueId: "LI-2026-0001",
    issueDate: "2026-10-20",
    loanType: "Inter-Company",
    taggedRequisitionNumber: "LR-2026-0001",
    taggedRequisitionId: "slr-seed-001",
    fromCompany: "Pakiza Apparels Ltd.",
    fromStore: "Finishing Store - Norshingdi",
    toCompany: "Pakiza Knit Composite Ltd.",
    toStore: "Dyeing Chemical Store",
    status: "Dispatched",
    issuedBy: "Kazi Moniruzzaman",
    dispatchDate: "2026-10-20",
    transportMethod: "Company Covered Van",
    vehicleNumber: "DHK-METRO-TA-14-9988",
    driverName: "Md. Alal Uddin",
    driverContact: "+880 1711-223344",
    remarks: "Loan issued against approved LR-2026-0001. Return scheduled in 30 days.",
    totalItems: 2,
    totalLoanQty: 150,
    totalValue: 185000,
    items: [
      {
        id: "li-row-1",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        availableStock: 350,
        lrRequisitionQty: 100,
        loanQty: 100,
        unitPrice: 1250,
        totalValue: 125000,
        batchAllocations: [{ batchNumber: "BAT-CHM-2601", quantity: 100 }],
        locationAllocations: [{ locationName: "Rack C-02", quantity: 100 }],
        remarks: "Sealed drums",
      },
      {
        id: "li-row-2",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        availableStock: 200,
        lrRequisitionQty: 50,
        loanQty: 50,
        unitPrice: 1200,
        totalValue: 60000,
        batchAllocations: [{ batchNumber: "BAT-CHM-2602", quantity: 50 }],
        locationAllocations: [{ locationName: "Bin D-01", quantity: 50 }],
        remarks: "Dry storage verified",
      },
    ],
    createdAt: "2026-10-20T11:00:00Z",
    updatedAt: "2026-10-20T11:00:00Z",
  },
];

export const SEED_LOAN_RECEIPTS: StockLoanReceipt[] = [
  {
    id: "slr-rcpt-001",
    receiveId: "LRX-2026-0001",
    receiveDate: "2026-10-21",
    loanIssueId: "LI-2026-0001",
    loanIssueReferenceId: "sli-seed-001",
    issueDate: "2026-10-20",
    dispatchDate: "2026-10-20",
    fromCompany: "Pakiza Apparels Ltd.",
    fromStore: "Finishing Store - Norshingdi",
    toCompany: "Pakiza Knit Composite Ltd.",
    toStore: "Dyeing Chemical Store",
    receivedBy: "Md. Aminul Islam",
    remarks: "Received in sound condition. Stock loan credited into Dyeing Chemical Store.",
    totalItems: 2,
    totalDispatchedQty: 150,
    totalReceivedQty: 150,
    totalAcceptedQty: 150,
    totalShortageDamagedQty: 0,
    status: "Fully Received",
    items: [
      {
        id: "rcpt-row-1",
        loanItemId: "li-row-1",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        dispatchedQty: 100,
        receivedQty: 100,
        acceptedQty: 100,
        shortageDamagedQty: 0,
        unitPrice: 1250,
        locationAllocations: [{ locationName: "Dye Store Bay 1", quantity: 100 }],
      },
      {
        id: "rcpt-row-2",
        loanItemId: "li-row-2",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        dispatchedQty: 50,
        receivedQty: 50,
        acceptedQty: 50,
        shortageDamagedQty: 0,
        unitPrice: 1200,
        locationAllocations: [{ locationName: "Dry Chem Rack 4", quantity: 50 }],
      },
    ],
    createdAt: "2026-10-21T15:20:00Z",
    updatedAt: "2026-10-21T15:20:00Z",
  },
];

export const SEED_LOAN_ISSUE_AGAINST_RECEIVE: LoanIssueAgainstReceive[] = [
  {
    id: "liar-seed-001",
    issueNo: "LIAR-2026-0001",
    issueDate: "2026-10-25",
    loanRequisitionId: "slr-seed-001",
    loanRequisitionNumber: "LR-2026-0001",
    selectedReceiptNumbers: ["LRX-2026-0001"],
    issuingCompany: "Pakiza Knit Composite Ltd.",
    issuingStore: "Dyeing Chemical Store",
    receivingCompany: "Pakiza Apparels Ltd.",
    receivingStore: "Finishing Store - Norshingdi",
    status: "Completed",
    issuedBy: "Md. Aminul Islam",
    remarks: "Return repayment issue against loan receive #LRX-2026-0001.",
    totalItems: 2,
    totalIssueQty: 150,
    totalValue: 185000,
    items: [
      {
        id: "liar-it-1",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        receivedQty: 100,
        availableReceivedQty: 100,
        issueQty: 100,
        unitPrice: 1250,
        totalValue: 125000,
        receiptNumber: "LRX-2026-0001",
        batchAllocations: [{ batchNumber: "BAT-CHM-2601", quantity: 100 }],
        locationAllocations: [{ locationName: "Dye Store Bay 1", quantity: 100 }],
      },
      {
        id: "liar-it-2",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        receivedQty: 50,
        availableReceivedQty: 50,
        issueQty: 50,
        unitPrice: 1200,
        totalValue: 60000,
        receiptNumber: "LRX-2026-0001",
        batchAllocations: [{ batchNumber: "BAT-CHM-2602", quantity: 50 }],
        locationAllocations: [{ locationName: "Dry Chem Rack 4", quantity: 50 }],
      },
    ],
    createdAt: "2026-10-25T11:00:00Z",
    updatedAt: "2026-10-25T11:00:00Z",
  },
];

export const SEED_LOAN_RECEIVE_AGAINST_ISSUE: LoanReceiveAgainstIssue[] = [
  {
    id: "lrai-seed-001",
    receiveNo: "LRAI-2026-0001",
    receiveDate: "2026-10-26",
    loanIssueNo: "LIAR-2026-0001",
    loanIssueId: "liar-seed-001",
    issuingCompany: "Pakiza Knit Composite Ltd.",
    issuingStore: "Dyeing Chemical Store",
    receivingCompany: "Pakiza Apparels Ltd.",
    receivingStore: "Finishing Store - Norshingdi",
    status: "Complete",
    receivedBy: "Kazi Moniruzzaman",
    remarks: "Full repayment received and acknowledged.",
    totalItems: 2,
    totalIssuedQty: 150,
    totalReceivedQty: 150,
    items: [
      {
        id: "lrai-it-1",
        issueItemId: "liar-it-1",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        issuedQty: 100,
        previouslyReceivedQty: 0,
        currentReceiveQty: 100,
        remainingQty: 0,
        acceptedQty: 100,
        rejectedQty: 0,
        unitPrice: 1250,
        locationAllocations: [{ locationName: "Rack C-02", quantity: 100 }],
      },
      {
        id: "lrai-it-2",
        issueItemId: "liar-it-2",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        issuedQty: 50,
        previouslyReceivedQty: 0,
        currentReceiveQty: 50,
        remainingQty: 0,
        acceptedQty: 50,
        rejectedQty: 0,
        unitPrice: 1200,
        locationAllocations: [{ locationName: "Bin D-01", quantity: 50 }],
      },
    ],
    createdAt: "2026-10-26T14:30:00Z",
    updatedAt: "2026-10-26T14:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// STORAGE HELPER METHODS
// ---------------------------------------------------------------------------
export function getStoredLoanRequisitions(): StockLoanRequisition[] {
  return getStoredData("cripton_stock_loan_requisitions", SEED_LOAN_REQUISITIONS);
}

export function saveStoredLoanRequisitions(data: StockLoanRequisition[]): void {
  setStoredData("cripton_stock_loan_requisitions", data);
}

export function saveLoanRequisition(req: StockLoanRequisition): void {
  const current = getStoredLoanRequisitions();
  const idx = current.findIndex((r) => r.id === req.id);
  if (idx >= 0) {
    current[idx] = { ...req, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...req, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveStoredLoanRequisitions(current);
}

export function getStoredLoanIssues(): StockLoanIssue[] {
  return getStoredData("cripton_stock_loan_issues", SEED_LOAN_ISSUES);
}

export function saveStoredLoanIssues(data: StockLoanIssue[]): void {
  setStoredData("cripton_stock_loan_issues", data);
}

export function saveLoanIssue(issue: StockLoanIssue): void {
  const current = getStoredLoanIssues();
  const idx = current.findIndex((i) => i.id === issue.id);
  if (idx >= 0) {
    current[idx] = { ...issue, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...issue, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveStoredLoanIssues(current);
}

export function getStoredLoanReceipts(): StockLoanReceipt[] {
  return getStoredData("cripton_stock_loan_receipts", SEED_LOAN_RECEIPTS);
}

export function saveStoredLoanReceipts(data: StockLoanReceipt[]): void {
  setStoredData("cripton_stock_loan_receipts", data);
}

export function saveLoanReceipt(receipt: StockLoanReceipt): void {
  const current = getStoredLoanReceipts();
  const idx = current.findIndex((r) => r.id === receipt.id);
  if (idx >= 0) {
    current[idx] = { ...receipt, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...receipt, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveStoredLoanReceipts(current);
}

export function getStoredLoanIssueAgainstReceive(): LoanIssueAgainstReceive[] {
  return getStoredData("cripton_stock_loan_issue_against_receive", SEED_LOAN_ISSUE_AGAINST_RECEIVE);
}

export function saveStoredLoanIssueAgainstReceive(data: LoanIssueAgainstReceive[]): void {
  setStoredData("cripton_stock_loan_issue_against_receive", data);
}

export function getStoredLoanReceiveAgainstIssue(): LoanReceiveAgainstIssue[] {
  return getStoredData("cripton_stock_loan_receive_against_issue", SEED_LOAN_RECEIVE_AGAINST_ISSUE);
}

export function saveStoredLoanReceiveAgainstIssue(data: LoanReceiveAgainstIssue[]): void {
  setStoredData("cripton_stock_loan_receive_against_issue", data);
}

// Aliases matching standard component imports
export const getStoredStockLoanRequisitions = getStoredLoanRequisitions;
export const saveStoredStockLoanRequisitions = saveStoredLoanRequisitions;
export const saveStockLoanRequisition = saveLoanRequisition;

export const getStoredStockLoanIssues = getStoredLoanIssues;
export const saveStoredStockLoanIssues = saveStoredLoanIssues;
export const saveStockLoanIssue = saveLoanIssue;

export const getStoredStockLoanReceipts = getStoredLoanReceipts;
export const saveStoredStockLoanReceipts = saveStoredLoanReceipts;
export const saveStockLoanReceipt = saveLoanReceipt;

export interface MasterCompany {
  id: string;
  code: string;
  name: string;
  address?: string;
  status?: string;
}

export const MASTER_COMPANIES: MasterCompany[] = [
  {
    id: "comp-1",
    code: "PKCL",
    name: "Pakiza Knit Composite Ltd.",
    address: "Gorat, Ashulia, Savar, Dhaka",
    status: "Active",
  },
  {
    id: "comp-2",
    code: "PAL",
    name: "Pakiza Apparels Ltd.",
    address: "Norshingdi, Dhaka",
    status: "Active",
  },
  {
    id: "comp-3",
    code: "PDPL",
    name: "Pakiza Dyeing & Printing Ltd.",
    address: "Savar, Dhaka",
    status: "Active",
  },
  {
    id: "comp-4",
    code: "PSML",
    name: "Pakiza Spinning Mills Ltd.",
    address: "Narayanganj, Dhaka",
    status: "Active",
  },
  {
    id: "comp-5",
    code: "PTML",
    name: "Pakiza Textile Mills Ltd.",
    address: "Gazipur, Dhaka",
    status: "Active",
  },
];

// ===========================================================================
// 6. HYBRID LOAN SETTLEMENT: PHYSICAL RETURN & MONETARY RECOVERY
// ===========================================================================

export type StockLoanReturnCondition = "Good" | "Damaged" | "Non-Usable";

export interface StockLoanReturnItem {
  id: string;
  loanItemId?: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  originalIssuedQty: number;
  previouslyReturnedQty: number;
  remainingIssuedQty: number; // originalIssuedQty - previouslyReturnedQty
  issueAvgCostRate: number; // Frozen issue-time rate snapshot
  returnQty: number; // Entered physical return quantity
  returnQuantity?: number; // alias
  returnValue: number; // returnQty × issueAvgCostRate
  totalReturnValue?: number; // alias
  condition: StockLoanReturnCondition; // "Good" | "Damaged" | "Non-Usable"
  isAcceptedForStock: boolean; // Only "Good" items increase inventory stock
  store?: string;
  location?: string;
  batch?: string;
  batchAllocations?: LoanIssueBatchAllocation[];
  locationAllocations?: LoanIssueLocationAllocation[];
  remarks?: string;
}

export interface StockLoanReturn {
  id: string;
  returnId: string; // e.g. LRET-2026-0001
  returnDate: string;
  loanIssueId: string; // e.g. LI-2026-0001
  loanIssueReferenceId?: string;
  loanIssueDate: string;
  borrowerName: string;
  department: string;
  issuingCompany: string; // Lending company
  issuingStore: string; // Lending store
  receivingCompany: string; // Company returning/receiving back
  receivingStore: string; // Receiving store where items are stored
  receivedBy: string;
  returnChallanNo?: string;
  remarks?: string;
  status: "Draft" | "Confirmed" | "Pending Inspection";
  totalItems: number;
  totalReturnQty: number;
  totalReturnQuantity?: number; // alias
  acceptedReturnValue: number;
  totalReturnValue?: number; // alias for acceptedReturnValue
  originalLoanValue: number;
  previousPhysicalReturnValue: number;
  currentPhysicalReturnValue: number;
  totalPhysicalReturnValue: number;
  previousMonetaryRecovery: number;
  remainingLoanValue: number;
  items: StockLoanReturnItem[];
  createdAt: string;
  updatedAt: string;
}

export type StockLoanRecoveryPaymentMethod = "Cash" | "Bank" | "Cheque" | "Other";

export interface StockLoanRecovery {
  id: string;
  recoveryId: string; // e.g. LREC-2026-0001
  recoveryDate: string;
  loanIssueId: string; // e.g. LI-2026-0001
  loanIssueReferenceId?: string;
  loanIssueDate?: string;
  borrowerName: string;
  department: string;
  issuingCompany: string;
  receivingCompany: string;
  originalLoanValue: number;
  totalPhysicalReturnValue?: number;
  previousMonetaryRecovery?: number;
  outstandingBeforeRecovery: number;
  receiveAmount: number;
  outstandingAfterRecovery: number;
  paymentMethod: StockLoanRecoveryPaymentMethod;
  paymentReference?: string; // Money Receipt / Voucher / Cheque No
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  bankAccountNo?: string; // alias
  chequeNo?: string;
  chequeDate?: string;
  transactionReference?: string;
  receiveDate?: string;
  receivedBy: string;
  status: "Draft" | "Confirmed";
  settlementStatusAfter?: "Fully Settled" | "Partially Settled";
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanSettlementSummary {
  loanIssueId: string;
  loanId: string;
  issueDate: string;
  borrowerName: string;
  department: string;
  issuingCompany: string;
  issuingStore: string;
  store?: string; // convenient alias for issuingStore
  receivingCompany: string;
  receivingStore: string;
  originalLoanValue: number;
  totalPhysicalReturnValue: number;
  totalMonetaryRecovery: number;
  outstandingBalance: number;
  settlementStatus: "Pending" | "Partially Settled" | "Fully Settled" | "Pending Inspection";
  returnTransactions: StockLoanReturn[];
  returns?: StockLoanReturn[]; // alias for returnTransactions
  returnTransactionsCount?: number;
  recoveryTransactions: StockLoanRecovery[];
  recoveries?: StockLoanRecovery[]; // alias for recoveryTransactions
  recoveryTransactionsCount?: number;
  itemsSummary: Array<{
    itemCode: string;
    itemName: string;
    specification: string;
    uom: string;
    issuedQty: number;
    issueAvgCostRate: number;
    totalIssuedValue: number;
    returnedQty: number;
    acceptedReturnValue: number;
    remainingQty: number;
    remainingValue: number;
    hasInspectionPending?: boolean;
  }>;
}

// ---------------------------------------------------------------------------
// VALUATION SNAPSHOT HELPER (INVENTORY AVERAGE COST / WEIGHTED AVERAGE COST)
// ---------------------------------------------------------------------------

export interface ItemValuationLookupResult {
  rate: number;
  isAvailable: boolean;
  source: string;
  valuationMethod: "Weighted Average Cost" | "Average Cost";
  asOfDate: string;
}

/**
 * Retrieves the current Inventory Average Cost / Weighted Average Cost.
 * Required by Section 4.2 & 4.3:
 * - If stock valuation is unavailable (<= 0), isAvailable will be false.
 * - This rate is snapshotted onto the Loan Issue item and preserved.
 */
export function getInventoryItemValuation(
  itemCode: string,
  store?: string,
  company?: string
): ItemValuationLookupResult {
  const asOfDate = new Date().toISOString().slice(0, 10);
  const cleanCode = itemCode.trim().toLowerCase();

  // 1. Check active stock balance / ledger (Average Cost / Weighted Average Cost)
  const stockBalances = getStoredData("cripton_stock_balance_data", INITIAL_STOCK_BALANCE_DATA);
  const matchedBalance = stockBalances.find((s) => {
    const codeMatch = s.itemCode.trim().toLowerCase() === cleanCode;
    if (!codeMatch) return false;
    if (store && store !== "All" && s.store.trim().toLowerCase() !== store.trim().toLowerCase()) {
      return false;
    }
    if (company && company !== "All" && s.company.trim().toLowerCase() !== company.trim().toLowerCase()) {
      return false;
    }
    return true;
  }) || stockBalances.find((s) => s.itemCode.trim().toLowerCase() === cleanCode);

  if (matchedBalance && Number(matchedBalance.unitCost) > 0) {
    return {
      rate: Number(matchedBalance.unitCost),
      isAvailable: true,
      source: `Inventory Average Cost (${matchedBalance.store})`,
      valuationMethod: "Weighted Average Cost",
      asOfDate,
    };
  }

  // 2. Check Item Master standard cost as catalog valuation benchmark
  const catalog = getStoredData("proc_items_v2", DEFAULT_ITEMS);
  const matchedCat = catalog.find((c) => c.itemCode.trim().toLowerCase() === cleanCode);

  if (matchedCat && Number(matchedCat.standardCost) > 0) {
    return {
      rate: Number(matchedCat.standardCost),
      isAvailable: true,
      source: "Item Master Standard Cost",
      valuationMethod: "Average Cost",
      asOfDate,
    };
  }

  // Fallback: If item is in demo SEED_LOAN_ISSUES, retrieve its original established rate
  for (const sli of SEED_LOAN_ISSUES) {
    const it = sli.items.find((i) => i.itemCode.trim().toLowerCase() === cleanCode);
    if (it && (it.issueAvgCostRate || it.unitPrice)) {
      return {
        rate: it.issueAvgCostRate || it.unitPrice,
        isAvailable: true,
        source: "Historical Stock Loan Valuation Ledger",
        valuationMethod: "Weighted Average Cost",
        asOfDate,
      };
    }
  }

  // If no valid positive rate is found, report as unavailable (blocks issue per Requirement 4.3)
  return {
    rate: 0,
    isAvailable: false,
    source: "Valuation Rate Unavailable",
    valuationMethod: "Weighted Average Cost",
    asOfDate,
  };
}

// ---------------------------------------------------------------------------
// SEED DATA FOR HYBRID LOAN RETURNS & RECOVERIES
// ---------------------------------------------------------------------------

export const SEED_LOAN_RETURNS: StockLoanReturn[] = [
  {
    id: "lret-seed-001",
    returnId: "LRET-2026-0001",
    returnDate: "2026-10-28",
    loanIssueId: "LI-2026-0001",
    loanIssueReferenceId: "sli-seed-001",
    loanIssueDate: "2026-10-20",
    borrowerName: "Tahmid Afsar Shapno (Store Manager)",
    department: "Central Inventory & Materials Supply",
    issuingCompany: "Pakiza Apparels Ltd.",
    issuingStore: "Finishing Store - Norshingdi",
    receivingCompany: "Pakiza Knit Composite Ltd.",
    receivingStore: "Finishing Store - Norshingdi",
    receivedBy: "Kazi Moniruzzaman (Store Officer)",
    remarks: "First physical repayment return batch against Loan Issue #LI-2026-0001.",
    status: "Confirmed",
    totalItems: 2,
    totalReturnQty: 60,
    acceptedReturnValue: 75000,
    originalLoanValue: 185000,
    previousPhysicalReturnValue: 0,
    currentPhysicalReturnValue: 75000,
    totalPhysicalReturnValue: 75000,
    previousMonetaryRecovery: 0,
    remainingLoanValue: 110000,
    items: [
      {
        id: "lret-it-1",
        loanItemId: "li-row-1",
        sl: 1,
        itemCode: "ITM-CHM-001",
        itemName: "Reactive Blue Dye D-200",
        specification: "Standard textile reactive dye grade A",
        brand: "Dystar",
        origin: "Germany",
        uom: "KG",
        originalIssuedQty: 100,
        previouslyReturnedQty: 0,
        remainingIssuedQty: 100,
        issueAvgCostRate: 1250,
        returnQty: 60,
        returnValue: 75000,
        condition: "Good",
        isAcceptedForStock: true,
        store: "Finishing Store - Norshingdi",
        location: "Rack C-02",
        batch: "BAT-CHM-2601",
        remarks: "Sealed containers accepted into store",
      },
      {
        id: "lret-it-2",
        loanItemId: "li-row-2",
        sl: 2,
        itemCode: "ITM-CHM-002",
        itemName: "Sodium Hydrosulphite 88%",
        specification: "Reducing agent textile grade powder",
        brand: "BASF",
        origin: "Germany",
        uom: "KG",
        originalIssuedQty: 50,
        previouslyReturnedQty: 0,
        remainingIssuedQty: 50,
        issueAvgCostRate: 1200,
        returnQty: 0,
        returnValue: 0,
        condition: "Good",
        isAcceptedForStock: false,
        store: "Finishing Store - Norshingdi",
        remarks: "To be returned or settled via monetary recovery",
      },
    ],
    createdAt: "2026-10-28T10:30:00Z",
    updatedAt: "2026-10-28T10:30:00Z",
  },
];

export const SEED_LOAN_RECOVERIES: StockLoanRecovery[] = [
  {
    id: "lrec-seed-001",
    recoveryId: "LREC-2026-0001",
    recoveryDate: "2026-11-05",
    loanIssueId: "LI-2026-0001",
    loanIssueReferenceId: "sli-seed-001",
    loanIssueDate: "2026-10-20",
    borrowerName: "Tahmid Afsar Shapno (Store Manager)",
    department: "Central Inventory & Materials Supply",
    issuingCompany: "Pakiza Apparels Ltd.",
    receivingCompany: "Pakiza Knit Composite Ltd.",
    originalLoanValue: 185000,
    totalPhysicalReturnValue: 75000,
    previousMonetaryRecovery: 0,
    outstandingBeforeRecovery: 110000,
    receiveAmount: 50000,
    outstandingAfterRecovery: 60000,
    paymentMethod: "Bank",
    paymentReference: "MR-PKCL-2026-8801",
    bankName: "Standard Chartered Bank",
    bankBranch: "Gulshan-2 Branch",
    accountNumber: "01-8849201-01",
    transactionReference: "TXN-SCB-992011",
    receiveDate: "2026-11-05",
    receivedBy: "Md. Aminul Islam (Finance Officer)",
    status: "Confirmed",
    settlementStatusAfter: "Partially Settled",
    remarks: "Partial monetary settlement for remaining Sodium Hydrosulphite and reactive dye.",
    createdAt: "2026-11-05T14:15:00Z",
    updatedAt: "2026-11-05T14:15:00Z",
  },
];

// ---------------------------------------------------------------------------
// HYBRID SETTLEMENT STORAGE & CALCULATION METHODS
// ---------------------------------------------------------------------------

export function getStoredStockLoanReturns(): StockLoanReturn[] {
  return getStoredData("cripton_stock_loan_returns", SEED_LOAN_RETURNS);
}

export function saveStoredStockLoanReturns(data: StockLoanReturn[]): void {
  setStoredData("cripton_stock_loan_returns", data);
}

export function saveStockLoanReturn(record: StockLoanReturn): void {
  const current = getStoredStockLoanReturns();
  const idx = current.findIndex((r) => r.id === record.id || r.returnId === record.returnId);
  if (idx >= 0) {
    current[idx] = { ...record, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveStoredStockLoanReturns(current);
  syncLoanIssueSettlement(record.loanIssueId);
}

export function getStoredStockLoanRecoveries(): StockLoanRecovery[] {
  return getStoredData("cripton_stock_loan_recoveries", SEED_LOAN_RECOVERIES);
}

export function saveStoredStockLoanRecoveries(data: StockLoanRecovery[]): void {
  setStoredData("cripton_stock_loan_recoveries", data);
}

export function saveStockLoanRecovery(record: StockLoanRecovery): void {
  const current = getStoredStockLoanRecoveries();
  const idx = current.findIndex((r) => r.id === record.id || r.recoveryId === record.recoveryId);
  if (idx >= 0) {
    current[idx] = { ...record, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveStoredStockLoanRecoveries(current);
  syncLoanIssueSettlement(record.loanIssueId);
}

/**
 * Centralized, authoritative calculation of Hybrid Loan Settlement.
 * Mandatory Formula:
 * Outstanding Balance = Original Loan Value - Accepted Physical Return Value - Total Monetary Recovery
 */
export function calculateLoanSettlementSummary(loanIssueId: string): LoanSettlementSummary | null {
  const loans = getStoredStockLoanIssues();
  const targetLoan = loans.find((l) => l.loanIssueId === loanIssueId || l.id === loanIssueId);
  if (!targetLoan) return null;

  const allReturns = getStoredStockLoanReturns().filter(
    (r) => (r.loanIssueId === targetLoan.loanIssueId || r.loanIssueId === targetLoan.id) && r.status !== "Draft"
  );
  const allRecoveries = getStoredStockLoanRecoveries().filter(
    (rc) => (rc.loanIssueId === targetLoan.loanIssueId || rc.loanIssueId === targetLoan.id) && rc.status !== "Draft"
  );

  // Original Loan Value: Calculated strictly from loanQty × issueAvgCostRate (frozen issue-time rate)
  const originalLoanValue = targetLoan.items.reduce((sum, it) => {
    const rate = it.issueAvgCostRate || it.unitPrice || 0;
    return sum + (Number(it.loanQty) || 0) * rate;
  }, 0);

  // Physical Return Totals: Sum of accepted physical returns (Good condition)
  let totalPhysicalReturnValue = 0;
  let hasInspectionPending = false;

  const itemReturnMap: Record<string, { returnedQty: number; acceptedValue: number; hasInspection: boolean }> = {};

  allReturns.forEach((ret) => {
    ret.items.forEach((rit) => {
      if (!itemReturnMap[rit.itemCode]) {
        itemReturnMap[rit.itemCode] = { returnedQty: 0, acceptedValue: 0, hasInspection: false };
      }
      const isAccepted = rit.condition === "Good" && rit.isAcceptedForStock;
      if (rit.condition === "Damaged" || rit.condition === "Non-Usable") {
        hasInspectionPending = true;
        itemReturnMap[rit.itemCode].hasInspection = true;
      }
      if (isAccepted) {
        itemReturnMap[rit.itemCode].returnedQty += rit.returnQty;
        itemReturnMap[rit.itemCode].acceptedValue += rit.returnValue;
        totalPhysicalReturnValue += rit.returnValue;
      }
    });
  });

  // Monetary Recovery Totals: Sum of confirmed monetary recoveries
  const totalMonetaryRecovery = allRecoveries.reduce((sum, rc) => sum + (Number(rc.receiveAmount) || 0), 0);

  // Authoritative Outstanding Balance:
  const outstandingBalance = Math.max(0, originalLoanValue - totalPhysicalReturnValue - totalMonetaryRecovery);

  // Settlement Status determination
  let settlementStatus: "Pending" | "Partially Settled" | "Fully Settled" | "Pending Inspection" = "Pending";
  if (outstandingBalance <= 0 && (totalPhysicalReturnValue > 0 || totalMonetaryRecovery > 0)) {
    settlementStatus = "Fully Settled";
  } else if (hasInspectionPending) {
    settlementStatus = "Pending Inspection";
  } else if (totalPhysicalReturnValue > 0 || totalMonetaryRecovery > 0) {
    settlementStatus = "Partially Settled";
  }

  const itemsSummary = targetLoan.items.map((it) => {
    const rate = it.issueAvgCostRate || it.unitPrice || 0;
    const totalIssuedValue = (Number(it.loanQty) || 0) * rate;
    const retInfo = itemReturnMap[it.itemCode] || { returnedQty: 0, acceptedValue: 0, hasInspection: false };
    const remainingQty = Math.max(0, (Number(it.loanQty) || 0) - retInfo.returnedQty);
    const remainingValue = remainingQty * rate;

    return {
      itemCode: it.itemCode,
      itemName: it.itemName,
      specification: it.specification || "-",
      uom: it.uom,
      issuedQty: Number(it.loanQty) || 0,
      issueAvgCostRate: rate,
      totalIssuedValue,
      returnedQty: retInfo.returnedQty,
      acceptedReturnValue: retInfo.acceptedValue,
      remainingQty,
      remainingValue,
      hasInspectionPending: retInfo.hasInspection,
    };
  });

  return {
    loanIssueId: targetLoan.loanIssueId,
    loanId: targetLoan.id,
    issueDate: targetLoan.issueDate || targetLoan.loanDate || "",
    borrowerName: targetLoan.borrowerName || targetLoan.requestedBy || "Store Manager",
    department: targetLoan.department || "Central Inventory & Materials Supply",
    issuingCompany: targetLoan.fromCompany,
    issuingStore: targetLoan.fromStore,
    store: targetLoan.fromStore,
    receivingCompany: targetLoan.toCompany,
    receivingStore: targetLoan.toStore,
    originalLoanValue,
    totalPhysicalReturnValue,
    totalMonetaryRecovery,
    outstandingBalance,
    settlementStatus,
    returnTransactions: allReturns,
    returns: allReturns,
    returnTransactionsCount: allReturns.length,
    recoveryTransactions: allRecoveries,
    recoveries: allRecoveries,
    recoveryTransactionsCount: allRecoveries.length,
    itemsSummary,
  };
}

/**
 * Synchronizes the settlement fields onto the target StockLoanIssue record
 */
export function syncLoanIssueSettlement(loanIssueId: string): void {
  const summary = calculateLoanSettlementSummary(loanIssueId);
  if (!summary) return;

  const currentLoans = getStoredStockLoanIssues();
  const idx = currentLoans.findIndex((l) => l.loanIssueId === loanIssueId || l.id === loanIssueId);
  if (idx >= 0) {
    currentLoans[idx] = {
      ...currentLoans[idx],
      totalPhysicalReturnValue: summary.totalPhysicalReturnValue,
      totalMonetaryRecovery: summary.totalMonetaryRecovery,
      outstandingBalance: summary.outstandingBalance,
      settlementStatus: summary.settlementStatus,
      updatedAt: new Date().toISOString(),
    };
    saveStoredStockLoanIssues(currentLoans);
  }
}

/**
 * Returns a list of consolidated hybrid loan settlements across all Loan Issues
 */
export function getHybridLoanSettlementList(): LoanSettlementSummary[] {
  const loans = getStoredStockLoanIssues();
  const list: LoanSettlementSummary[] = [];

  loans.forEach((l) => {
    const summary = calculateLoanSettlementSummary(l.loanIssueId || l.id);
    if (summary) {
      list.push(summary);
    }
  });

  return list;
}

/**
 * Resets only the Hybrid Stock Loan Settlement demo data (Section 13 requirement)
 * Without touching unrelated ERP modules
 */
export function resetStockLoanSettlementDemoData(): void {
  saveStoredStockLoanReturns(SEED_LOAN_RETURNS);
  saveStoredStockLoanRecoveries(SEED_LOAN_RECOVERIES);
  SEED_LOAN_ISSUES.forEach((sli) => {
    syncLoanIssueSettlement(sli.loanIssueId);
  });
}



