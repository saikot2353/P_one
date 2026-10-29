// src/lib/inventory-requisition-issue-data.ts
// Unified models, LocalStorage synchronization, and stock calculation engine
// for Material Requisition (MR), Material Issue, and Return to Store.

import { getStoredData, setStoredData, DEFAULT_ITEMS, DEFAULT_WAREHOUSES } from "./procurement-master-data";
import { getStoredOpeningStocks } from "./procurement-order-inventory-data";

export type MRStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Partially Issued"
  | "Fully Issued"
  | "Rejected"
  | "Returned for Correction"
  | "Cancelled";

export type MRPriority = "Normal" | "Urgent" | "Critical" | "Low" | "Medium" | "High";

export interface MRItem {
  id: string;
  sl: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  brand?: string;
  origin?: string;
  requisitionStore?: string;
  uom: string;
  requestedQuantity: number;
  approvedQuantity?: number;
  availableStock: number;
  issuedQuantity: number;
  remainingQuantity: number;
  shortageQuantity: number; // Math.max(0, requestedQuantity - availableStock)
  batchNumber?: string;
  location?: string;
  remarks?: string;
}

export interface MRApprovalTrail {
  level: number;
  approver: string;
  designation: string;
  action: "Draft" | "Submitted" | "Approved" | "Rejected" | "Returned for Correction" | "Cancelled";
  dateTime: string;
  remarks?: string;
}

export interface MaterialRequisition {
  id: string;
  mrNumber: string; // e.g. "MR-2026-0001"
  requisitionDate: string;
  organization: string;
  department: string;
  requestedBy: string;
  requesterDesignation?: string;
  requiredDate: string;
  priority: MRPriority;
  warehouseStore: string;
  purpose?: string;
  totalItems: number;
  requestedQuantity: number;
  issuedQuantity: number;
  remainingQuantity: number;
  shortageQuantity: number;
  status: MRStatus;
  createdDate: string;
  submittedDate?: string;
  approvedDate?: string;
  rejectionReason?: string;
  returnReason?: string;
  items: MRItem[];
  approvalHistory?: MRApprovalTrail[];
  attachments?: { fileName: string; fileSize?: string; description?: string }[];
  remarks?: string;
}

export interface MaterialIssueItem {
  id: string;
  sl: number;
  mrItemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  brand?: string;
  origin?: string;
  uom: string;
  mrRequestedQty: number;
  previouslyIssuedQty: number;
  remainingIssueQty: number;
  availableStock: number;
  issueQty: number;
  unitPrice?: number;
  totalPrice?: number;
  issueStore?: string;
  batchAllocations?: Array<{ batchNumber: string; quantity: number }>;
  locationAllocations?: Array<{ locationName: string; quantity: number }>;
  remarks?: string;
}

export interface MaterialIssue {
  id: string;
  issueNumber: string; // e.g. "ISS-2026-0001"
  mrId: string;
  mrNumber: string;
  issueDate: string;
  organization: string;
  department: string;
  issuedTo: string;
  employeeId?: string;
  requiredDate?: string;
  warehouseStore: string;
  issueType: "Issue Regular" | "Issue Special" | "Department Consumption";
  srnNo?: string;
  totalItems: number;
  totalIssueQty: number;
  status: "Draft" | "Posted";
  items: MaterialIssueItem[];
  remarks?: string;
  // Returnable tracking counters
  previouslyReturnedQty: number;
  returnableQty: number;
}

export interface StoreReturnItem {
  id: string;
  sl: number;
  issueItemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  uom: string;
  originallyIssuedQty: number;
  previouslyReturnedQty: number;
  returnableQty: number; // originallyIssuedQty - previouslyReturnedQty
  returnQty: number;
  returnStore?: string;
  returnCondition: "Good (Restock)" | "Damaged (Scrap)" | "Defective (Vendor Return)";
  batchAllocations?: Array<{ batchNumber: string; quantity: number }>;
  locationAllocations?: Array<{ locationName: string; quantity: number }>;
  remarks?: string;
}

export interface StoreReturn {
  id: string;
  returnNumber: string; // e.g. "RET-2026-0001"
  issueId: string;
  issueNumber: string;
  mrId: string;
  mrNumber: string;
  returnDate: string;
  department: string;
  issuedTo: string;
  employeeId?: string;
  warehouseStore: string;
  totalItems: number;
  totalReturnQty: number;
  receivedQty?: number;
  status: "Posted" | "Draft" | "Pending Receive" | "Received" | "Partially Received";
  items: StoreReturnItem[];
  remarks?: string;
}

// ---------------------------------------------------------------------------
// DEFAULT SEED DATA
// ---------------------------------------------------------------------------

export const DEFAULT_MATERIAL_REQUISITIONS: MaterialRequisition[] = [
  {
    id: "mr-2026-001",
    mrNumber: "MR-2026-0001",
    requisitionDate: "2026-09-28",
    organization: "Pakiza Knit Composite Ltd",
    department: "Production (Knitting)",
    requestedBy: "Md. Anik Islam (Deputy Manager)",
    requesterDesignation: "Deputy Manager (Knitting)",
    requiredDate: "2026-10-02",
    priority: "Urgent",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    purpose: "Knitting Floor Order #ORD-8820 yarn consumption batch",
    totalItems: 2,
    requestedQuantity: 1200,
    issuedQuantity: 600,
    remainingQuantity: 600,
    shortageQuantity: 0,
    status: "Partially Issued",
    createdDate: "2026-09-28",
    submittedDate: "2026-09-28 10:15 AM",
    approvedDate: "2026-09-28 02:40 PM",
    items: [
      {
        id: "mri-1",
        sl: 1,
        itemId: "itm-1",
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        requestedQuantity: 1000,
        availableStock: 5000,
        issuedQuantity: 500,
        remainingQuantity: 500,
        shortageQuantity: 0,
        batchNumber: "BAT-YRN-2026-09A",
        remarks: "Urgent for Batch-A knitting line",
      },
      {
        id: "mri-2",
        sl: 2,
        itemId: "itm-paper",
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        specification: "Standard 80 GSM white paper reams",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        requestedQuantity: 200,
        availableStock: 1200,
        issuedQuantity: 100,
        remainingQuantity: 100,
        shortageQuantity: 0,
        location: "Rack A1 - Raw Cotton Pallet",
        remarks: "Floor job card print stationery",
      },
    ],
    approvalHistory: [
      {
        level: 1,
        approver: "Zahidul Islam",
        designation: "COO / Head of Operations",
        action: "Approved",
        dateTime: "2026-09-28 02:40 PM",
        remarks: "Approved for production release",
      },
    ],
  },
  {
    id: "mr-2026-002",
    mrNumber: "MR-2026-0002",
    requisitionDate: "2026-09-29",
    organization: "Pakiza Knit Composite Ltd",
    department: "Maintenance & Engineering",
    requestedBy: "Nazmul Huda",
    requesterDesignation: "Maintenance In-charge",
    requiredDate: "2026-10-04",
    priority: "Critical",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    purpose: "Preventive maintenance overhaul for Dyeing Stenter Machine 02",
    totalItems: 1,
    requestedQuantity: 300,
    issuedQuantity: 0,
    remainingQuantity: 300,
    shortageQuantity: 180, // Request 300, only 120 in stock!
    status: "Submitted",
    createdDate: "2026-09-29",
    submittedDate: "2026-09-29 11:30 AM",
    items: [
      {
        id: "mri-3",
        sl: 1,
        itemId: "itm-lubricant",
        itemCode: "LUB-SYN-ISO68",
        itemName: "Industrial Gear Oil ISO VG 68",
        specification: "Synthetic high performance industrial gear & circulation oil",
        brand: "Mobil",
        origin: "Singapore",
        uom: "LTR",
        requestedQuantity: 300,
        availableStock: 120,
        issuedQuantity: 0,
        remainingQuantity: 300,
        shortageQuantity: 180,
        batchNumber: "BAT-LUB-2026-01",
        remarks: "Shortage of 180 LTR identified — PR required immediately",
      },
    ],
    approvalHistory: [
      {
        level: 1,
        approver: "Nazmul Huda",
        designation: "Maintenance In-charge",
        action: "Submitted",
        dateTime: "2026-09-29 11:30 AM",
        remarks: "Submitted for store approval",
      },
    ],
  },
  {
    id: "mr-2026-003",
    mrNumber: "MR-2026-0003",
    requisitionDate: "2026-09-30",
    organization: "Pakiza Knit Composite Ltd",
    department: "Information Technology",
    requestedBy: "Tahmid Afsar Shapno",
    requesterDesignation: "Software Engineer",
    requiredDate: "2026-10-05",
    priority: "Normal",
    warehouseStore: "Pakiza Technovation Central IT & Hardware Depot",
    purpose: "Workstation network cabling and peripheral replacement",
    totalItems: 1,
    requestedQuantity: 50,
    issuedQuantity: 0,
    remainingQuantity: 50,
    shortageQuantity: 0,
    status: "Approved",
    createdDate: "2026-09-30",
    submittedDate: "2026-09-30 09:00 AM",
    approvedDate: "2026-09-30 01:15 PM",
    items: [
      {
        id: "mri-4",
        sl: 1,
        itemId: "itm-cable",
        itemCode: "ITM-CAT6-CABLE",
        itemName: "Cat6 UTP Network Cable Box 305M",
        specification: "Pure copper solid 23AWG twisted pair cable",
        brand: "Schneider",
        origin: "Malaysia",
        uom: "BOX",
        requestedQuantity: 50,
        availableStock: 180,
        issuedQuantity: 0,
        remainingQuantity: 50,
        shortageQuantity: 0,
        location: "Shelf-IT-03",
        remarks: "For floor 3 server rack rewiring",
      },
    ],
    approvalHistory: [
      {
        level: 1,
        approver: "Rafiqul Islam",
        designation: "Director IT",
        action: "Approved",
        dateTime: "2026-09-30 01:15 PM",
        remarks: "Approved for IT store issue",
      },
    ],
  },
  {
    id: "mr-2026-004",
    mrNumber: "MR-2026-0004",
    requisitionDate: "2026-10-01",
    organization: "Pakiza Knit Composite Ltd",
    department: "Human Resources",
    requestedBy: "Alice Johnson",
    requesterDesignation: "HR Officer",
    requiredDate: "2026-10-08",
    priority: "Low",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    purpose: "Quarterly department filing folders and accessories",
    totalItems: 1,
    requestedQuantity: 60,
    issuedQuantity: 0,
    remainingQuantity: 60,
    shortageQuantity: 0,
    status: "Draft",
    createdDate: "2026-10-01",
    items: [
      {
        id: "mri-5",
        sl: 1,
        itemId: "itm-paper",
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        specification: "Standard 80 GSM white paper reams",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        requestedQuantity: 60,
        availableStock: 1200,
        issuedQuantity: 0,
        remainingQuantity: 60,
        shortageQuantity: 0,
        location: "Rack A1 - Raw Cotton Pallet",
        remarks: "Draft requisition in progress",
      },
    ],
  },
];

export const DEFAULT_MATERIAL_ISSUES: MaterialIssue[] = [
  {
    id: "iss-2026-001",
    issueNumber: "ISS-2026-0001",
    mrId: "mr-2026-001",
    mrNumber: "MR-2026-0001",
    issueDate: "2026-09-28",
    organization: "Pakiza Knit Composite Ltd",
    department: "Production (Knitting)",
    issuedTo: "Md. Anik Islam (Deputy Manager)",
    employeeId: "EMP-00142",
    requiredDate: "2026-10-02",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    issueType: "Issue Regular",
    srnNo: "SRN-2026-9041",
    totalItems: 2,
    totalIssueQty: 600,
    status: "Posted",
    previouslyReturnedQty: 50,
    returnableQty: 550,
    items: [
      {
        id: "isi-1",
        sl: 1,
        mrItemId: "mri-1",
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        mrRequestedQty: 1000,
        previouslyIssuedQty: 0,
        remainingIssueQty: 1000,
        availableStock: 5000,
        issueQty: 500,
        unitPrice: 420,
        totalPrice: 210000,
        batchAllocations: [{ batchNumber: "BAT-YRN-2026-09A", quantity: 500 }],
        remarks: "First slot issued for circular knitting machines",
      },
      {
        id: "isi-2",
        sl: 2,
        mrItemId: "mri-2",
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        specification: "Standard 80 GSM white paper reams",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        mrRequestedQty: 200,
        previouslyIssuedQty: 0,
        remainingIssueQty: 200,
        availableStock: 1200,
        issueQty: 100,
        unitPrice: 70,
        totalPrice: 7000,
        locationAllocations: [{ locationName: "Rack A1 - Raw Cotton Pallet", quantity: 100 }],
        remarks: "Initial dispatch for floor office",
      },
    ],
    remarks: "Partial issue completed per production schedule.",
  },
];

export const DEFAULT_STORE_RETURNS: StoreReturn[] = [
  {
    id: "ret-2026-001",
    returnNumber: "RET-2026-0001",
    issueId: "iss-2026-001",
    issueNumber: "ISS-2026-0001",
    mrId: "mr-2026-001",
    mrNumber: "MR-2026-0001",
    returnDate: "2026-09-30",
    department: "Production (Knitting)",
    issuedTo: "Md. Anik Islam (Deputy Manager)",
    employeeId: "EMP-00142",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    totalItems: 1,
    totalReturnQty: 50,
    receivedQty: 0,
    status: "Pending Receive",
    items: [
      {
        id: "sri-1",
        sl: 1,
        issueItemId: "isi-1",
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        uom: "KG",
        originallyIssuedQty: 500,
        previouslyReturnedQty: 0,
        returnableQty: 500,
        returnQty: 50,
        returnStore: "PKCL Central Raw Material Warehouse",
        returnCondition: "Good (Restock)",
        batchAllocations: [{ batchNumber: "BAT-YRN-2026-09A", quantity: 50 }],
        remarks: "Excess unconsumed cones returned after order completion",
      },
    ],
    remarks: "Checked and verified back to central warehouse stock.",
  },
  {
    id: "ret-2026-002",
    returnNumber: "RET-2026-0002",
    issueId: "iss-2026-002",
    issueNumber: "ISS-2026-0002",
    mrId: "mr-2026-002",
    mrNumber: "MR-2026-0002",
    returnDate: "2026-10-01",
    department: "Information Technology",
    issuedTo: "Tahmid Afsar Shapno",
    employeeId: "EMP-00198",
    warehouseStore: "Pakiza Technovation Central IT & Hardware Depot",
    totalItems: 1,
    totalReturnQty: 2,
    receivedQty: 0,
    status: "Pending Receive",
    items: [
      {
        id: "sri-2",
        sl: 1,
        issueItemId: "isi-2",
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD IPS",
        uom: "PCS",
        originallyIssuedQty: 5,
        previouslyReturnedQty: 0,
        returnableQty: 5,
        returnQty: 2,
        returnStore: "Pakiza Technovation Central IT & Hardware Depot",
        returnCondition: "Good (Restock)",
        locationAllocations: [{ locationName: "BIN-IT-04", quantity: 2 }],
        remarks: "Excess team allocation laptops returned in pristine packaging",
      },
    ],
    remarks: "IT hardware returned for warehouse stock receipt.",
  },
];

// ---------------------------------------------------------------------------
// STORAGE KEYS & ACCESS HELPERS
// ---------------------------------------------------------------------------

const STORAGE_KEYS = {
  MATERIAL_REQUISITIONS: "cripton_material_requisitions_v2",
  MATERIAL_ISSUES: "cripton_material_issues_v2",
  STORE_RETURNS: "cripton_store_returns_v2",
};

export function getStoredMaterialRequisitions(): MaterialRequisition[] {
  return getStoredData(STORAGE_KEYS.MATERIAL_REQUISITIONS, DEFAULT_MATERIAL_REQUISITIONS);
}

export function setStoredMaterialRequisitions(records: MaterialRequisition[]): void {
  setStoredData(STORAGE_KEYS.MATERIAL_REQUISITIONS, records);
}

export function getStoredMaterialIssues(): MaterialIssue[] {
  return getStoredData(STORAGE_KEYS.MATERIAL_ISSUES, DEFAULT_MATERIAL_ISSUES);
}

export function setStoredMaterialIssues(issues: MaterialIssue[]): void {
  setStoredData(STORAGE_KEYS.MATERIAL_ISSUES, issues);
}

export function getStoredStoreReturns(): StoreReturn[] {
  return getStoredData(STORAGE_KEYS.STORE_RETURNS, DEFAULT_STORE_RETURNS);
}

export function setStoredStoreReturns(returns: StoreReturn[]): void {
  setStoredData(STORAGE_KEYS.STORE_RETURNS, returns);
}

/**
 * Calculates current available stock dynamically:
 * Base opening stock + all material receipts - all confirmed issues + all good returns!
 */
export function getAvailableStockForItem(warehouseStore: string, itemCode: string): number {
  if (!itemCode) return 0;

  // 1. Opening Stocks
  const openingStocks = getStoredOpeningStocks();
  let baseStock = 0;
  openingStocks.forEach((os) => {
    if (!warehouseStore || os.warehouseStore === warehouseStore || os.storeName === warehouseStore) {
      os.items.forEach((item) => {
        if (item.itemCode === itemCode) {
          baseStock += Number(item.openingQuantity) || 0;
        }
      });
    }
  });

  // If opening stock has no entry, check DEFAULT_ITEMS initial stock or fallback
  if (baseStock === 0) {
    const it = DEFAULT_ITEMS.find((i) => i.itemCode === itemCode);
    if (it && (it as any).currentStock) {
      baseStock = Number((it as any).currentStock) || 0;
    } else {
      baseStock = 500; // Baseline fallback for realistic demo
    }
  }

  // 2. Subtract confirmed posted issues
  const issues = getStoredMaterialIssues();
  let issuedTotal = 0;
  issues.forEach((iss) => {
    if (iss.status === "Posted") {
      if (!warehouseStore || iss.warehouseStore === warehouseStore) {
        iss.items.forEach((item) => {
          if (item.itemCode === itemCode) {
            issuedTotal += Number(item.issueQty) || 0;
          }
        });
      }
    }
  });

  // 3. Add back confirmed good returns (ONLY after Store Return Receive is confirmed/posted)
  const returns = getStoredStoreReturns();
  let returnedTotal = 0;
  returns.forEach((ret) => {
    if (ret.status === "Received" || ret.status === "Partially Received") {
      ret.items.forEach((item) => {
        const itemStore = item.returnStore || ret.warehouseStore;
        if (!warehouseStore || itemStore === warehouseStore) {
          if (item.itemCode === itemCode && item.returnCondition.startsWith("Good")) {
            returnedTotal += Number(item.returnQty) || 0;
          }
        }
      });
    }
  });

  const finalStock = Math.max(0, baseStock - issuedTotal + returnedTotal);
  return finalStock;
}

/**
 * Confirm and post a Material Issue:
 * 1. Records the issue.
 * 2. Updates the linked Material Requisition issued & remaining quantities.
 * 3. Updates MR status (Partially Issued or Fully Issued).
 * 4. Reduces stock dynamically.
 */
export function postMaterialIssue(issue: MaterialIssue): void {
  const currentIssues = getStoredMaterialIssues();
  const updatedIssues = [issue, ...currentIssues.filter((i) => i.id !== issue.id)];
  setStoredMaterialIssues(updatedIssues);

  // Update Material Requisition
  if (issue.mrId) {
    const allMRs = getStoredMaterialRequisitions();
    const updatedMRs = allMRs.map((mr) => {
      if (mr.id === issue.mrId || mr.mrNumber === issue.mrNumber) {
        let totalIssued = 0;
        const updatedItems = mr.items.map((item) => {
          const matchedIssueItem = issue.items.find(
            (ii) => ii.itemCode === item.itemCode || ii.mrItemId === item.id
          );
          if (matchedIssueItem) {
            const newIssued = (Number(item.issuedQuantity) || 0) + Number(matchedIssueItem.issueQty);
            const newRemaining = Math.max(0, Number(item.requestedQuantity) - newIssued);
            totalIssued += newIssued;
            return {
              ...item,
              issuedQuantity: newIssued,
              remainingQuantity: newRemaining,
            };
          }
          totalIssued += Number(item.issuedQuantity) || 0;
          return item;
        });

        const allIssued = updatedItems.every((i) => i.remainingQuantity === 0);
        const newStatus: MRStatus = allIssued ? "Fully Issued" : "Partially Issued";

        return {
          ...mr,
          issuedQuantity: totalIssued,
          remainingQuantity: Math.max(0, mr.requestedQuantity - totalIssued),
          status: newStatus,
          items: updatedItems,
        };
      }
      return mr;
    });
    setStoredMaterialRequisitions(updatedMRs);
  }
}

/**
 * Confirm and post a Return to Store:
 * 1. Records the return with "Pending Receive" status for the store receive queue.
 * 2. Updates the linked Material Issue's previouslyReturnedQty and returnableQty.
 * (Stock is increased only after Store Return Receive is confirmed!)
 */
export function postStoreReturn(storeReturn: StoreReturn): void {
  const currentReturns = getStoredStoreReturns();
  const returnToSave: StoreReturn = {
    ...storeReturn,
    status: storeReturn.status || "Pending Receive",
  };
  const updatedReturns = [returnToSave, ...currentReturns.filter((r) => r.id !== returnToSave.id)];
  setStoredStoreReturns(updatedReturns);

  // Update Material Issue
  if (storeReturn.issueId) {
    const currentIssues = getStoredMaterialIssues();
    const updatedIssues = currentIssues.map((iss) => {
      if (iss.id === storeReturn.issueId || iss.issueNumber === storeReturn.issueNumber) {
        const newPrevReturned =
          (Number(iss.previouslyReturnedQty) || 0) + Number(storeReturn.totalReturnQty);
        const newReturnable = Math.max(0, Number(iss.totalIssueQty) - newPrevReturned);
        return {
          ...iss,
          previouslyReturnedQty: newPrevReturned,
          returnableQty: newReturnable,
        };
      }
      return iss;
    });
    setStoredMaterialIssues(updatedIssues);
  }
}

/**
 * Confirm and post a Store Return Receive transaction:
 * 1. Updates StoreReturn status to "Received" or "Partially Received" with item allocations.
 * 2. Increments inventory stock dynamically for the assigned batches/locations.
 */
export function postStoreReturnReceive(
  returnId: string,
  receivedItems: Array<{
    itemCode: string;
    receiveStore: string;
    receivedQty: number;
    batchAllocations?: Array<{ batchNumber: string; quantity: number }>;
    locationAllocations?: Array<{ locationName: string; quantity: number }>;
  }>
): void {
  const currentReturns = getStoredStoreReturns();
  const updatedReturns = currentReturns.map((ret) => {
    if (ret.id === returnId || ret.returnNumber === returnId) {
      const totalRec = receivedItems.reduce((acc, it) => acc + (Number(it.receivedQty) || 0), 0);
      const isFull = totalRec >= ret.totalReturnQty;
      const updatedItems = ret.items.map((item) => {
        const match = receivedItems.find((r) => r.itemCode === item.itemCode);
        if (match) {
          return {
            ...item,
            returnQty: match.receivedQty,
            returnStore: match.receiveStore || item.returnStore,
            batchAllocations: match.batchAllocations || item.batchAllocations,
            locationAllocations: match.locationAllocations || item.locationAllocations,
          };
        }
        return item;
      });

      return {
        ...ret,
        receivedQty: totalRec,
        status: (isFull ? "Received" : "Partially Received") as any,
        items: updatedItems,
      };
    }
    return ret;
  });
  setStoredStoreReturns(updatedReturns);
}
