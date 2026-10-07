// Data models, persistence layer, and workflow management for:
// 1. Inter-Company Stock Transfer
// 2. Inter-Company Transfer Receive
// 3. Stock Adjustment (+/-)
// 4. Stock Write-Off & Approval

import { getStoredData, setStoredData } from "./procurement-master-data";

// ---------------------------------------------------------------------------
// 1. Inter-Company Stock Transfer Models
// ---------------------------------------------------------------------------
export type TransferReasonType =
  | "Stock Replenishment"
  | "Stock Balancing"
  | "Business Requirement"
  | "Emergency Requirement"
  | "Other";

export type TransferStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Dispatched"
  | "Received"
  | "Cancelled";

export interface TransferBatchAllocation {
  batchNumber: string;
  quantity: number;
}

export interface TransferLocationAllocation {
  locationName: string;
  quantity: number;
}

export interface InterCompanyTransferItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  availableStock: number;
  transferQty: number;
  unitPrice: number;
  totalValue: number;
  batchAllocations?: TransferBatchAllocation[];
  locationAllocations?: TransferLocationAllocation[];
  remarks?: string;
}

export interface InterCompanyTransfer {
  id: string;
  transferId: string;
  transferDate: string;
  transferType: "Inter-Company";
  transferReason: TransferReasonType;
  reasonDetails?: string;
  remarks?: string;
  fromCompany: string;
  fromStore: string;
  fromStoreCode?: string;
  toCompany: string;
  toStore: string;
  toStoreCode?: string;
  requestedBy: string;
  dispatchedBy?: string;
  dispatchDate?: string;
  totalItems: number;
  totalTransferQty: number;
  totalTransferValue: number;
  status: TransferStatus;
  items: InterCompanyTransferItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 2. Inter-Company Transfer Receive Models
// ---------------------------------------------------------------------------
export type TransferReceiveStatus = "Pending Receive" | "Partially Received" | "Fully Received";

export interface InterCompanyReceiveItem {
  id: string;
  transferItemId: string;
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
  batchAllocations?: TransferBatchAllocation[];
  locationAllocations?: TransferLocationAllocation[];
  remarks?: string;
}

export interface InterCompanyReceive {
  id: string;
  receiveId: string;
  receiveDate: string;
  transferId: string;
  transferReferenceId: string;
  transferDate: string;
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
  totalVarianceQty: number;
  status: TransferReceiveStatus;
  items: InterCompanyReceiveItem[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// 3. Stock Adjustment Models
// ---------------------------------------------------------------------------
export type AdjustmentType = "Increase (+)" | "Decrease (-)";
export type AdjustmentStatus = "Draft" | "Submitted" | "Approved" | "Posted" | "Cancelled";
export type AdjustmentReasonType =
  | "Physical Count Variance"
  | "Damaged Stock Found"
  | "Expiry Write-Down"
  | "Data Entry Correction"
  | "Re-classification"
  | "Other";

export interface StockAdjustmentItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  currentStock: number;
  adjustmentQty: number; // positive or negative
  newStock: number;
  unitCost: number;
  adjustmentValue: number;
  batchAllocations?: TransferBatchAllocation[];
  locationAllocations?: TransferLocationAllocation[];
  remarks?: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentId: string;
  adjustmentDate: string;
  company: string;
  warehouseStore: string;
  adjustmentType: AdjustmentType;
  adjustmentReason: AdjustmentReasonType;
  reasonDetails?: string;
  remarks?: string;
  createdBy: string;
  totalItems: number;
  totalAdjustmentQty: number;
  totalAdjustmentValue: number;
  status: AdjustmentStatus;
  items: StockAdjustmentItem[];
  postedDate?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// 4. Stock Write-Off Models
// ---------------------------------------------------------------------------
export type WriteOffCategory =
  | "Damaged / Broken"
  | "Expired Material"
  | "Quality Rejection / Scrap"
  | "Lost / Stolen"
  | "Obsolete Stock"
  | "Other";

export type DisposalMethod =
  | "Destruction"
  | "Recycling"
  | "Scrap Sale"
  | "Landfill"
  | "Returned to Vendor"
  | "Other";

export type WriteOffStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Returned"
  | "Posted";

export interface StockWriteOffItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  availableStock: number;
  writeOffQty: number;
  unitCost: number;
  totalLossValue: number;
  damageReasonDetails: string;
  batchAllocations?: TransferBatchAllocation[];
  locationAllocations?: TransferLocationAllocation[];
}

export interface StockWriteOff {
  id: string;
  writeOffId: string;
  date: string;
  company: string;
  warehouseStore: string;
  category: WriteOffCategory;
  disposalMethod: DisposalMethod;
  investigationRef?: string;
  remarks?: string;
  initiatedBy: string;
  totalItems: number;
  totalWriteOffQty: number;
  totalLossValue: number;
  status: WriteOffStatus;
  approvedBy?: string;
  approvalDate?: string;
  approvalRemarks?: string;
  items: StockWriteOffItem[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Master Companies
// ---------------------------------------------------------------------------
export interface MasterCompany {
  id: string;
  code: string;
  name: string;
  address: string;
  status: "Active" | "Inactive";
}

export const MASTER_COMPANIES: MasterCompany[] = [
  {
    id: "comp-1",
    code: "PKCL",
    name: "Pakiza Knit Composite Ltd",
    address: "Gorat, Ashulia, Savar, Dhaka",
    status: "Active",
  },
  {
    id: "comp-2",
    code: "PSML",
    name: "Pakiza Spinning Mills Ltd",
    address: "Madhabdi, Narsingdi, Bangladesh",
    status: "Active",
  },
  {
    id: "comp-3",
    code: "PTL",
    name: "Pakiza Technovation Limited",
    address: "House 22, Road 11, Banani, Dhaka",
    status: "Active",
  },
  {
    id: "comp-4",
    code: "PGL",
    name: "Pakiza Garments Ltd",
    address: "Tongi Industrial Area, Gazipur",
    status: "Active",
  },
];

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------
export const SEED_INTERCOMPANY_TRANSFERS: InterCompanyTransfer[] = [
  {
    id: "ict-1",
    transferId: "ICT-2026-001",
    transferDate: "2026-09-18",
    transferType: "Inter-Company",
    transferReason: "Stock Replenishment",
    remarks: "Transfer 100% Combed Cotton yarn for peak spinning production schedule",
    fromCompany: "Pakiza Knit Composite Ltd",
    fromStore: "PKCL Central Raw Material Warehouse",
    fromStoreCode: "WH-PKCL-01",
    toCompany: "Pakiza Spinning Mills Ltd",
    toStore: "Spinning Spare Parts & Consumables Store",
    toStoreCode: "WH-PSML-02",
    requestedBy: "Sohanur Rahman Sohan (Store Manager)",
    dispatchedBy: "Tahmid Afsar Shapno",
    dispatchDate: "2026-09-19",
    totalItems: 1,
    totalTransferQty: 500,
    totalTransferValue: 210000,
    status: "Dispatched",
    createdAt: "2026-09-18T10:30:00Z",
    updatedAt: "2026-09-19T14:15:00Z",
    items: [
      {
        id: "ict-item-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        availableStock: 25000,
        transferQty: 500,
        unitPrice: 420,
        totalValue: 210000,
        batchAllocations: [{ batchNumber: "BATCH-COT-2026-01", quantity: 500 }],
        remarks: "Urgent lot required for circular knitting line #4",
      },
    ],
  },
  {
    id: "ict-2",
    transferId: "ICT-2026-002",
    transferDate: "2026-09-24",
    transferType: "Inter-Company",
    transferReason: "Business Requirement",
    remarks: "IT workstation relocation to Head Office Banani",
    fromCompany: "Pakiza Technovation Limited",
    fromStore: "Pakiza Technovation Central IT & Hardware Depot",
    fromStoreCode: "WH-PTL-03",
    toCompany: "Pakiza Knit Composite Ltd",
    toStore: "PKCL Central Raw Material Warehouse",
    toStoreCode: "WH-PKCL-01",
    requestedBy: "Tahmid Afsar Shapno",
    totalItems: 2,
    totalTransferQty: 25,
    totalTransferValue: 259600,
    status: "Draft",
    createdAt: "2026-09-24T09:00:00Z",
    updatedAt: "2026-09-24T09:00:00Z",
    items: [
      {
        id: "ict-item-2",
        sl: 1,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        availableStock: 15,
        transferQty: 2,
        unitPrice: 125000,
        totalValue: 250000,
        locationAllocations: [{ locationName: "Shelf B - Laptop Storage Units", quantity: 2 }],
        remarks: "Assigned for ERP QA engineers",
      },
      {
        id: "ict-item-3",
        sl: 2,
        itemCode: "ITM-PAP-A4-80",
        itemName: "Double A Premium A4 Printing Paper 80 GSM",
        specification: "80 GSM high brightness photocopy paper, 500 sheets/ream",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        availableStock: 80,
        transferQty: 20,
        unitPrice: 480,
        totalValue: 9600,
        remarks: "Quarterly admin supply",
      },
    ],
  },
];

export const SEED_INTERCOMPANY_RECEIVES: InterCompanyReceive[] = [
  {
    id: "ictr-pending-1",
    receiveId: "ICTR-2026-002",
    receiveDate: "2026-09-28",
    transferId: "ict-2",
    transferReferenceId: "ICT-2026-002",
    transferDate: "2026-09-26",
    dispatchDate: "2026-09-27",
    fromCompany: "Pakiza Technovation Limited",
    fromStore: "Pakiza Technovation Central IT & Hardware Depot",
    toCompany: "Pakiza Knit Composite Ltd",
    toStore: "PKCL Central Raw Material Warehouse",
    receivedBy: "Sohanur Rahman Sohan (Store Receiving Officer)",
    remarks: "Consignment arrived at security gate; pending technical QA verification and warehouse bin stocking",
    totalItems: 2,
    totalDispatchedQty: 22,
    totalReceivedQty: 0,
    totalAcceptedQty: 0,
    totalVarianceQty: 0,
    status: "Pending Receive",
    createdAt: "2026-09-27T14:30:00Z",
    items: [
      {
        id: "ictr-item-p1",
        transferItemId: "ict-item-2",
        sl: 1,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        dispatchedQty: 2,
        receivedQty: 0,
        acceptedQty: 0,
        shortageDamagedQty: 0,
        unitPrice: 125000,
        locationAllocations: [{ locationName: "Shelf B - Laptop Storage Units", quantity: 2 }],
        remarks: "Transit consignment awaiting hardware verification",
      },
      {
        id: "ictr-item-p2",
        transferItemId: "ict-item-3",
        sl: 2,
        itemCode: "ITM-PAP-A4-80",
        itemName: "Double A Premium A4 Printing Paper 80 GSM",
        specification: "80 GSM high brightness photocopy paper, 500 sheets/ream",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        dispatchedQty: 20,
        receivedQty: 0,
        acceptedQty: 0,
        shortageDamagedQty: 0,
        unitPrice: 480,
        remarks: "Pallet batch intact; waiting for bay unloader",
      },
    ],
  },
  {
    id: "ictr-pending-2",
    receiveId: "ICTR-2026-003",
    receiveDate: "2026-09-30",
    transferId: "ict-3",
    transferReferenceId: "ICT-2026-003",
    transferDate: "2026-09-29",
    dispatchDate: "2026-09-29",
    fromCompany: "Pakiza Knit Composite Ltd",
    fromStore: "PKCL Central Raw Material Warehouse",
    toCompany: "Pakiza Spinning Mills Ltd",
    toStore: "Spinning Spare Parts & Consumables Store",
    receivedBy: "Sohanur Rahman Sohan (Store Receiving Officer)",
    remarks: "Emergency yarn lot dispatch via covered truck #DM-U-11-2344",
    totalItems: 1,
    totalDispatchedQty: 300,
    totalReceivedQty: 0,
    totalAcceptedQty: 0,
    totalVarianceQty: 0,
    status: "Pending Receive",
    createdAt: "2026-09-29T16:00:00Z",
    items: [
      {
        id: "ictr-item-p3",
        transferItemId: "ict-item-4",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        dispatchedQty: 300,
        receivedQty: 0,
        acceptedQty: 0,
        shortageDamagedQty: 0,
        unitPrice: 420,
        batchAllocations: [{ batchNumber: "BATCH-COT-2026-02", quantity: 300 }],
        remarks: "Batch tracked lot under transit",
      },
    ],
  },
  {
    id: "ictr-partial-1",
    receiveId: "ICTR-2026-004",
    receiveDate: "2026-09-25",
    transferId: "ict-4",
    transferReferenceId: "ICT-2026-004",
    transferDate: "2026-09-22",
    dispatchDate: "2026-09-23",
    fromCompany: "Pakiza Knit Composite Ltd",
    fromStore: "PKCL Central Raw Material Warehouse",
    toCompany: "Pakiza Technovation Limited",
    toStore: "Pakiza Technovation Central IT & Hardware Depot",
    receivedBy: "Tahmid Afsar Shapno (Store Manager)",
    remarks: "First consignment received; remaining 5 units in second dispatch vehicle",
    totalItems: 1,
    totalDispatchedQty: 15,
    totalReceivedQty: 10,
    totalAcceptedQty: 10,
    totalVarianceQty: 0,
    status: "Partially Received",
    createdAt: "2026-09-25T10:15:00Z",
    items: [
      {
        id: "ictr-item-pr1",
        transferItemId: "ict-item-5",
        sl: 1,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        dispatchedQty: 15,
        receivedQty: 10,
        acceptedQty: 10,
        shortageDamagedQty: 0,
        unitPrice: 125000,
        locationAllocations: [{ locationName: "Shelf B - Laptop Storage Units", quantity: 10 }],
        remarks: "10 units accepted; pending 5 units in transit",
      },
    ],
  },
  {
    id: "ictr-1",
    receiveId: "ICTR-2026-001",
    receiveDate: "2026-09-20",
    transferId: "ict-1",
    transferReferenceId: "ICT-2026-001",
    transferDate: "2026-09-18",
    dispatchDate: "2026-09-19",
    fromCompany: "Pakiza Knit Composite Ltd",
    fromStore: "PKCL Central Raw Material Warehouse",
    toCompany: "Pakiza Spinning Mills Ltd",
    toStore: "Spinning Spare Parts & Consumables Store",
    receivedBy: "Sohanur Rahman Sohan (Store Executive)",
    remarks: "Received in sound condition, sealed transport container inspected",
    totalItems: 1,
    totalDispatchedQty: 500,
    totalReceivedQty: 500,
    totalAcceptedQty: 495,
    totalVarianceQty: 5,
    status: "Fully Received",
    createdAt: "2026-09-20T11:45:00Z",
    items: [
      {
        id: "ictr-item-1",
        transferItemId: "ict-item-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        dispatchedQty: 500,
        receivedQty: 500,
        acceptedQty: 495,
        shortageDamagedQty: 5,
        unitPrice: 420,
        batchAllocations: [{ batchNumber: "BATCH-COT-2026-01", quantity: 495 }],
        remarks: "5 KG moisture damage rejected on gate inspection",
      },
    ],
  },
];

export const SEED_STOCK_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: "adj-1",
    adjustmentId: "ADJ-2026-001",
    adjustmentDate: "2026-09-15",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    adjustmentType: "Increase (+)",
    adjustmentReason: "Physical Count Variance",
    remarks: "Found 12 additional reams during bi-annual physical store audit",
    createdBy: "Tahmid Afsar Shapno",
    totalItems: 1,
    totalAdjustmentQty: 12,
    totalAdjustmentValue: 5760,
    status: "Posted",
    postedDate: "2026-09-16",
    createdAt: "2026-09-15T16:00:00Z",
    items: [
      {
        id: "adj-it-1",
        sl: 1,
        itemCode: "ITM-PAP-A4-80",
        itemName: "Double A Premium A4 Printing Paper 80 GSM",
        specification: "80 GSM high brightness photocopy paper",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        currentStock: 68,
        adjustmentQty: 12,
        newStock: 80,
        unitCost: 480,
        adjustmentValue: 5760,
        remarks: "Counted physical stock = 80 Reams",
      },
    ],
  },
  {
    id: "adj-2",
    adjustmentId: "ADJ-2026-002",
    adjustmentDate: "2026-09-22",
    company: "Pakiza Technovation Limited",
    warehouseStore: "Pakiza Technovation Central IT & Hardware Depot",
    adjustmentType: "Decrease (-)",
    adjustmentReason: "Damaged Stock Found",
    remarks: "Water seepage caused damage to carton boxes",
    createdBy: "Sohanur Rahman Sohan",
    totalItems: 1,
    totalAdjustmentQty: -5,
    totalAdjustmentValue: -2400,
    status: "Submitted",
    createdAt: "2026-09-22T14:30:00Z",
    items: [
      {
        id: "adj-it-2",
        sl: 1,
        itemCode: "ITM-PAP-A4-80",
        itemName: "Double A Premium A4 Printing Paper 80 GSM",
        specification: "80 GSM high brightness photocopy paper",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        currentStock: 80,
        adjustmentQty: -5,
        newStock: 75,
        unitCost: 480,
        adjustmentValue: -2400,
        remarks: "Water damaged reams discarded",
      },
    ],
  },
];

export const SEED_STOCK_WRITEOFFS: StockWriteOff[] = [
  {
    id: "wo-1",
    writeOffId: "WO-2026-001",
    date: "2026-09-10",
    company: "Pakiza Knit Composite Ltd",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    category: "Damaged / Broken",
    disposalMethod: "Destruction",
    investigationRef: "INV-RPT-2026-44",
    remarks: "Yarn lot affected by dye bleed during high humidity storage",
    initiatedBy: "Tahmid Afsar Shapno",
    totalItems: 1,
    totalWriteOffQty: 45,
    totalLossValue: 18900,
    status: "Approved",
    approvedBy: "Head of Operations & Finance",
    approvalDate: "2026-09-12",
    approvalRemarks: "Approved based on technical QA report #44.",
    createdAt: "2026-09-10T10:00:00Z",
    items: [
      {
        id: "wo-it-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        availableStock: 25000,
        writeOffQty: 45,
        unitCost: 420,
        totalLossValue: 18900,
        damageReasonDetails: "Severe moisture damage and dye bleeding in cone tips",
        batchAllocations: [{ batchNumber: "BATCH-COT-2026-01", quantity: 45 }],
      },
    ],
  },
  {
    id: "wo-2",
    writeOffId: "WO-2026-002",
    date: "2026-09-25",
    company: "Pakiza Technovation Limited",
    warehouseStore: "Pakiza Technovation Central IT & Hardware Depot",
    category: "Quality Rejection / Scrap",
    disposalMethod: "Recycling",
    investigationRef: "QA-IT-901",
    remarks: "Motherboard short-circuit on decommissioned evaluation unit",
    initiatedBy: "Sohanur Rahman Sohan",
    totalItems: 1,
    totalWriteOffQty: 1,
    totalLossValue: 125000,
    status: "Submitted",
    createdAt: "2026-09-25T15:20:00Z",
    items: [
      {
        id: "wo-it-2",
        sl: 1,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        availableStock: 15,
        writeOffQty: 1,
        unitCost: 125000,
        totalLossValue: 125000,
        damageReasonDetails: "High voltage surge burnt power rail and CPU socket",
        locationAllocations: [{ locationName: "Shelf B - Laptop Storage Units", quantity: 1 }],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// LocalStorage Persistence Keys
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  TRANSFERS: "inv_intercompany_transfers_v2",
  RECEIVES: "inv_intercompany_receives_v2",
  ADJUSTMENTS: "inv_stock_adjustments_v2",
  WRITEOFFS: "inv_stock_writeoffs_v2",
};

// ---------------------------------------------------------------------------
// Helper Methods
// ---------------------------------------------------------------------------
export function getStoredInterCompanyTransfers(): InterCompanyTransfer[] {
  return getStoredData(STORAGE_KEYS.TRANSFERS, SEED_INTERCOMPANY_TRANSFERS);
}

export function saveStoredInterCompanyTransfers(data: InterCompanyTransfer[]): void {
  setStoredData(STORAGE_KEYS.TRANSFERS, data);
}

export function saveInterCompanyTransfer(transfer: InterCompanyTransfer): void {
  const current = getStoredInterCompanyTransfers();
  const existingIndex = current.findIndex((t) => t.id === transfer.id || t.transferId === transfer.transferId);
  if (existingIndex >= 0) {
    current[existingIndex] = { ...transfer, updatedAt: new Date().toISOString() };
  } else {
    current.unshift(transfer);
  }
  saveStoredInterCompanyTransfers(current);
}

export function getStoredInterCompanyReceives(): InterCompanyReceive[] {
  return getStoredData(STORAGE_KEYS.RECEIVES, SEED_INTERCOMPANY_RECEIVES);
}

export function saveStoredInterCompanyReceives(data: InterCompanyReceive[]): void {
  setStoredData(STORAGE_KEYS.RECEIVES, data);
}

export function saveInterCompanyReceive(receive: InterCompanyReceive): void {
  const current = getStoredInterCompanyReceives();
  const existingIndex = current.findIndex((r) => r.id === receive.id || r.receiveId === receive.receiveId);
  if (existingIndex >= 0) {
    current[existingIndex] = receive;
  } else {
    current.unshift(receive);
  }
  saveStoredInterCompanyReceives(current);

  // Update original transfer status to Received / Partially Received
  const transfers = getStoredInterCompanyTransfers();
  const trIndex = transfers.findIndex((t) => t.id === receive.transferId || t.transferId === receive.transferReferenceId);
  if (trIndex >= 0) {
    transfers[trIndex].status = "Received";
    saveStoredInterCompanyTransfers(transfers);
  }
}

export function getStoredStockAdjustments(): StockAdjustment[] {
  return getStoredData(STORAGE_KEYS.ADJUSTMENTS, SEED_STOCK_ADJUSTMENTS);
}

export function saveStoredStockAdjustments(data: StockAdjustment[]): void {
  setStoredData(STORAGE_KEYS.ADJUSTMENTS, data);
}

export function saveStockAdjustment(adj: StockAdjustment): void {
  const current = getStoredStockAdjustments();
  const existingIndex = current.findIndex((a) => a.id === adj.id || a.adjustmentId === adj.adjustmentId);
  if (existingIndex >= 0) {
    current[existingIndex] = adj;
  } else {
    current.unshift(adj);
  }
  saveStoredStockAdjustments(current);
}

export function getStoredStockWriteOffs(): StockWriteOff[] {
  return getStoredData(STORAGE_KEYS.WRITEOFFS, SEED_STOCK_WRITEOFFS);
}

export function saveStoredStockWriteOffs(data: StockWriteOff[]): void {
  setStoredData(STORAGE_KEYS.WRITEOFFS, data);
}

export function saveStockWriteOff(wo: StockWriteOff): void {
  const current = getStoredStockWriteOffs();
  const existingIndex = current.findIndex((w) => w.id === wo.id || w.writeOffId === wo.writeOffId);
  if (existingIndex >= 0) {
    current[existingIndex] = wo;
  } else {
    current.unshift(wo);
  }
  saveStoredStockWriteOffs(current);
}
