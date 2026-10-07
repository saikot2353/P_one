// src/lib/reports-mock-data.ts
// Comprehensive dataset and helpers for Procurement and Inventory Reports

export interface PurchaseReportRow {
  id: string;
  month: string; // e.g. "2026-10"
  monthLabel: string; // e.g. "October 2026"
  purchaseDate: string;
  poWoNo: string;
  purchaseType: "Local" | "Foreign" | "Work Order";
  supplier: string;
  company: string;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  itemCategory: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  vat: number;
  otherCharges: number;
  totalAmount: number;
  status: "Approved" | "Pending" | "Completed" | "Partially Received";
}

export interface SupplierBillReportRow {
  id: string;
  month: string; // "2026-10"
  monthLabel: string;
  billDate: string;
  billNo: string;
  supplier: string;
  company: string;
  poWoNo: string;
  mrrNo: string;
  billType: "Local" | "Foreign" | "Service" | "Work Order";
  billAmount: number;
  discount: number;
  tax: number;
  vat: number;
  otherCharges: number;
  totalAmount: number;
  status: "Approved" | "Submitted" | "Paid" | "Pending";
}

export interface StockBalanceRow {
  id: string;
  company: string;
  itemCode: string;
  itemName: string;
  specification: string;
  itemGroup: string;
  itemCategory: string;
  brand: string;
  origin: string;
  uom: string;
  store: string;
  location: string;
  batch: string;
  availableQty: number;
  reservedQty: number;
  inTransitQty: number;
  damagedQty: number;
  totalQty: number;
  unitCost: number;
  stockValue: number;
  trackingType: "Batch" | "Location";
  stockStatus: "Normal" | "Low Stock" | "Out of Stock" | "In-Transit";
  reorderLevel: number;
}

export interface ItemStockSummary {
  openingStock: number;
  totalReceived: number;
  totalIssued: number;
  transferIn: number;
  transferOut: number;
  returns: number;
  adjustments: number;
  writeOff: number;
  currentStock: number;
}

export interface ItemStockBreakdownRow {
  store: string;
  location: string;
  batch: string;
  opening: number;
  inQty: number;
  outQty: number;
  balance: number;
}

export type LedgerTransactionType =
  | "Opening Stock"
  | "Material Receipt"
  | "Direct Receipt"
  | "Material Issue"
  | "Store Return"
  | "Supplier Return"
  | "Transfer In"
  | "Transfer Out"
  | "Adjustment +"
  | "Adjustment -"
  | "Write-Off";

export interface TransactionLedgerRow {
  id: string;
  date: string;
  transactionType: LedgerTransactionType;
  referenceNo: string;
  itemCode: string;
  itemName: string;
  store: string;
  batch: string;
  location: string;
  inQty: number;
  outQty: number;
  balance: number;
  unitCost: number;
  remarks?: string;
}

export interface ItemMovementRow {
  id: string;
  date: string;
  itemCode: string;
  itemName: string;
  transaction: string;
  reference: string;
  fromStore: string;
  toStore: string;
  batch: string;
  location: string;
  quantity: number;
  status: "Completed" | "In Transit" | "Dispatched";
  timeline: Array<{ stage: string; timestamp: string; locationOrStore: string }>;
}

export interface BatchStockRow {
  id: string;
  itemCode: string;
  itemName: string;
  batch: string;
  mfgDate: string;
  expiryDate: string;
  store: string;
  location: string;
  quantity: number;
  unitCost: number;
  status: "Active" | "Expiring Soon" | "Expired";
}

export interface LocationStockRow {
  id: string;
  store: string;
  rack: string;
  shelf: string;
  bin: string;
  locationCode: string;
  locationType: "Rack" | "Shelf" | "Bin" | "Floor";
  itemCode: string;
  itemName: string;
  batch: string;
  uom: string;
  quantity: number;
  unitCost: number;
  stockValue: number;
}

export type ReceiptSourceType =
  | "Material Receipt"
  | "Direct Receipt"
  | "Transfer Receive"
  | "Store Return Receive"
  | "Opening Stock"
  | "Adjustment +";

export interface ItemReceiptRow {
  id: string;
  month: string;
  monthLabel: string;
  date: string;
  receiptType: ReceiptSourceType;
  reference: string;
  supplier: string;
  company: string;
  store: string;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  batch: string;
  location: string;
  quantity: number;
  unitPrice: number;
  status: "Received" | "Quality Passed" | "Verified";
}

export type IssueSourceType =
  | "Material Issue"
  | "Supplier Return"
  | "Transfer Out"
  | "Write-Off"
  | "Adjustment -";

export interface ItemIssueRow {
  id: string;
  month: string;
  monthLabel: string;
  date: string;
  issueType: IssueSourceType;
  reference: string;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  company: string;
  store: string;
  batch: string;
  location: string;
  quantity: number;
  issuedTo: string;
  status: "Issued" | "Dispatched" | "Posted";
}

export interface StockTransferRow {
  id: string;
  transferId: string;
  date: string;
  fromCompany: string;
  toCompany: string;
  fromStore: string;
  toStore: string;
  itemCode: string;
  itemName: string;
  batch: string;
  quantity: number;
  receivedQty: number;
  pendingQty: number;
  varianceQty: number;
  status: "Pending" | "In Transit" | "Partially Received" | "Fully Received" | "Short / Variance";
  stages: {
    transfer: boolean;
    dispatch: boolean;
    inTransit: boolean;
    receive: boolean;
    accepted: number;
    rejected: number;
    damaged: number;
    finalStock: number;
  };
}

export interface StockAdjustmentRow {
  id: string;
  adjustmentId: string;
  date: string;
  itemCode: string;
  itemName: string;
  store: string;
  batch: string;
  location: string;
  adjustmentType: "Stock Increase" | "Stock Decrease";
  previousQty: number;
  adjustmentQty: number;
  finalQty: number;
  reason: string;
}

export interface StockWriteOffRow {
  id: string;
  writeOffId: string;
  date: string;
  itemCode: string;
  itemName: string;
  store: string;
  batch: string;
  location: string;
  quantity: number;
  unitCost: number;
  value: number;
  reason: string;
  status: "Pending Approval" | "Approved" | "Posted";
  approvalBy?: string;
  postedDate?: string;
}

export interface SupplierReturnReportRow {
  id: string;
  month: string;
  monthLabel: string;
  returnDate: string;
  supplierReturnRef: string;
  poWoNo: string;
  mrrNo: string;
  supplier: string;
  company: string;
  store: string;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  batch: string;
  location: string;
  returnQuantity: number;
  unitPrice: number;
  returnValue: number;
  status: "Completed" | "Pending Gate Pass" | "Dispatched";
}

// ---------------------------------------------------------------------------
// INITIAL SEED DATA
// ---------------------------------------------------------------------------

export const INITIAL_PURCHASE_REPORT_DATA: PurchaseReportRow[] = [
  {
    id: "pur-1",
    month: "2026-10",
    monthLabel: "October 2026",
    purchaseDate: "2026-10-04",
    poWoNo: "PO-2026-0089",
    purchaseType: "Local",
    supplier: "CHAMPION STEEL PRODUCTS",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    specification: "Ergonomic Mesh High Back with armrest",
    brand: "Champion",
    origin: "Bangladesh",
    uom: "PCS",
    quantity: 12,
    unitPrice: 4500,
    discount: 1000,
    taxPercent: 5,
    vat: 2650,
    otherCharges: 500,
    totalAmount: 56150,
    status: "Approved",
  },
  {
    id: "pur-2",
    month: "2026-10",
    monthLabel: "October 2026",
    purchaseDate: "2026-10-02",
    poWoNo: "PO-2026-0088",
    purchaseType: "Local",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    itemCategory: "Direct Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    quantity: 2500,
    unitPrice: 380,
    discount: 5000,
    taxPercent: 3,
    vat: 28350,
    otherCharges: 2000,
    totalAmount: 975350,
    status: "Completed",
  },
  {
    id: "pur-3",
    month: "2026-10",
    monthLabel: "October 2026",
    purchaseDate: "2026-10-01",
    poWoNo: "WO-2026-0034",
    purchaseType: "Work Order",
    supplier: "DELTA ENGINEERING WORKS",
    company: "Pakiza Woven Fashion Ltd",
    itemCode: "SRV-001",
    itemName: "Generator Overhauling Service",
    itemGroup: "Engineering Services",
    itemCategory: "Plant Maintenance",
    specification: "Full major servicing for 500kVA Cummins generator",
    brand: "Cummins Service",
    origin: "Bangladesh",
    uom: "JOB",
    quantity: 1,
    unitPrice: 85000,
    discount: 0,
    taxPercent: 7.5,
    vat: 6375,
    otherCharges: 0,
    totalAmount: 91375,
    status: "Approved",
  },
  {
    id: "pur-4",
    month: "2026-09",
    monthLabel: "September 2026",
    purchaseDate: "2026-09-24",
    poWoNo: "PO-2026-0076",
    purchaseType: "Foreign",
    supplier: "HUNTSMAN TEXTILE CHEMICALS",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    specification: "C.I. Reactive Black 5, 150% concentration",
    brand: "Novacron",
    origin: "Switzerland",
    uom: "KG",
    quantity: 1200,
    unitPrice: 620,
    discount: 12000,
    taxPercent: 5,
    vat: 36600,
    otherCharges: 15000,
    totalAmount: 783600,
    status: "Completed",
  },
  {
    id: "pur-5",
    month: "2026-09",
    monthLabel: "September 2026",
    purchaseDate: "2026-09-18",
    poWoNo: "PO-2026-0071",
    purchaseType: "Local",
    supplier: "STAR ACCESSORIES BD",
    company: "Pakiza Apparels Ltd",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    itemGroup: "Sewing Accessories",
    itemCategory: "Accessories",
    specification: "100% Spun Polyester White & Black",
    brand: "Astra",
    origin: "Bangladesh",
    uom: "CONE",
    quantity: 800,
    unitPrice: 95,
    discount: 1600,
    taxPercent: 2,
    vat: 1488,
    otherCharges: 500,
    totalAmount: 76388,
    status: "Completed",
  },
  {
    id: "pur-6",
    month: "2026-08",
    monthLabel: "August 2026",
    purchaseDate: "2026-08-28",
    poWoNo: "PO-2026-0062",
    purchaseType: "Local",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "YRN-002",
    itemName: "Carded Yarn 24/1",
    itemGroup: "Yarn Raw Material",
    itemCategory: "Direct Material",
    specification: "Ne 24/1 Carded Cotton knitting yarn",
    brand: "Meghna Silver",
    origin: "Bangladesh",
    uom: "KG",
    quantity: 3000,
    unitPrice: 345,
    discount: 10000,
    taxPercent: 3,
    vat: 30750,
    otherCharges: 3500,
    totalAmount: 1059250,
    status: "Completed",
  },
  {
    id: "pur-7",
    month: "2026-08",
    monthLabel: "August 2026",
    purchaseDate: "2026-08-14",
    poWoNo: "PO-2026-0055",
    purchaseType: "Local",
    supplier: "CHAMPION STEEL PRODUCTS",
    company: "Pakiza Woven Fashion Ltd",
    itemCode: "ITM-002",
    itemName: "Medium Hydrolic Officer Chair",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    specification: "Medium back tilt mechanism chair",
    brand: "Champion",
    origin: "Bangladesh",
    uom: "PCS",
    quantity: 20,
    unitPrice: 4000,
    discount: 2000,
    taxPercent: 5,
    vat: 3900,
    otherCharges: 800,
    totalAmount: 82700,
    status: "Completed",
  },
];

export const INITIAL_SUPPLIER_BILL_REPORT_DATA: SupplierBillReportRow[] = [
  {
    id: "bill-1",
    month: "2026-10",
    monthLabel: "October 2026",
    billDate: "2026-10-06",
    billNo: "BILL-2026-0124",
    supplier: "CHAMPION STEEL PRODUCTS",
    company: "Pakiza Knit Composite Ltd",
    poWoNo: "PO-2026-0089",
    mrrNo: "MRR-2026-0592",
    billType: "Local",
    billAmount: 54000,
    discount: 1000,
    tax: 2700,
    vat: 2650,
    otherCharges: 500,
    totalAmount: 58850,
    status: "Approved",
  },
  {
    id: "bill-2",
    month: "2026-10",
    monthLabel: "October 2026",
    billDate: "2026-10-04",
    billNo: "BILL-2026-0120",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    poWoNo: "PO-2026-0088",
    mrrNo: "MRR-2026-0590",
    billType: "Local",
    billAmount: 950000,
    discount: 5000,
    tax: 28500,
    vat: 28350,
    otherCharges: 2000,
    totalAmount: 1003850,
    status: "Submitted",
  },
  {
    id: "bill-3",
    month: "2026-10",
    monthLabel: "October 2026",
    billDate: "2026-10-02",
    billNo: "BILL-2026-0118",
    supplier: "DELTA ENGINEERING WORKS",
    company: "Pakiza Woven Fashion Ltd",
    poWoNo: "WO-2026-0034",
    mrrNo: "SRV-2026-0012",
    billType: "Service",
    billAmount: 85000,
    discount: 0,
    tax: 6375,
    vat: 6375,
    otherCharges: 0,
    totalAmount: 97750,
    status: "Approved",
  },
  {
    id: "bill-4",
    month: "2026-09",
    monthLabel: "September 2026",
    billDate: "2026-09-28",
    billNo: "BILL-2026-0105",
    supplier: "HUNTSMAN TEXTILE CHEMICALS",
    company: "Pakiza Knit Composite Ltd",
    poWoNo: "PO-2026-0076",
    mrrNo: "MRR-2026-0583",
    billType: "Foreign",
    billAmount: 744000,
    discount: 12000,
    tax: 37200,
    vat: 36600,
    otherCharges: 15000,
    totalAmount: 820800,
    status: "Paid",
  },
  {
    id: "bill-5",
    month: "2026-09",
    monthLabel: "September 2026",
    billDate: "2026-09-20",
    billNo: "BILL-2026-0098",
    supplier: "STAR ACCESSORIES BD",
    company: "Pakiza Apparels Ltd",
    poWoNo: "PO-2026-0071",
    mrrNo: "MRR-2026-0579",
    billType: "Local",
    billAmount: 76000,
    discount: 1600,
    tax: 1520,
    vat: 1488,
    otherCharges: 500,
    totalAmount: 77908,
    status: "Paid",
  },
  {
    id: "bill-6",
    month: "2026-08",
    monthLabel: "August 2026",
    billDate: "2026-08-30",
    billNo: "BILL-2026-0085",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    poWoNo: "PO-2026-0062",
    mrrNo: "MRR-2026-0570",
    billType: "Local",
    billAmount: 1035000,
    discount: 10000,
    tax: 31050,
    vat: 30750,
    otherCharges: 3500,
    totalAmount: 1090300,
    status: "Paid",
  },
];

export const INITIAL_STOCK_BALANCE_DATA: StockBalanceRow[] = [
  {
    id: "stk-1",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    specification: "100% Cotton Ring Spun Ne 30/1",
    itemGroup: "Yarn Raw Material",
    itemCategory: "Direct Material",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    store: "Yarn Store (PKCL)",
    location: "Row-A / Pallet-01",
    batch: "BAT-YRN-2610-01",
    availableQty: 4200,
    reservedQty: 800,
    inTransitQty: 500,
    damagedQty: 0,
    totalQty: 5500,
    unitCost: 380,
    stockValue: 2090000,
    trackingType: "Batch",
    stockStatus: "Normal",
    reorderLevel: 1000,
  },
  {
    id: "stk-2",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    specification: "C.I. Reactive Black 5, 150% conc.",
    itemGroup: "Dyes & Chemicals",
    itemCategory: "Direct Material",
    brand: "Novacron",
    origin: "Switzerland",
    uom: "KG",
    store: "Chemical Store",
    location: "Drum Rack C-12",
    batch: "BAT-DYE-2609-04",
    availableQty: 850,
    reservedQty: 150,
    inTransitQty: 0,
    damagedQty: 25,
    totalQty: 1025,
    unitCost: 620,
    stockValue: 635500,
    trackingType: "Batch",
    stockStatus: "Normal",
    reorderLevel: 250,
  },
  {
    id: "stk-3",
    company: "Pakiza Knit Composite Ltd",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    specification: "Ergonomic Mesh High Back with armrest",
    itemGroup: "Office Furniture",
    itemCategory: "Capital Goods",
    brand: "Champion",
    origin: "Bangladesh",
    uom: "PCS",
    store: "Central Warehouse (Savar)",
    location: "Rack-01 / Shelf-A / Bin-04",
    batch: "",
    availableQty: 18,
    reservedQty: 2,
    inTransitQty: 5,
    damagedQty: 0,
    totalQty: 25,
    unitCost: 4500,
    stockValue: 112500,
    trackingType: "Location",
    stockStatus: "Normal",
    reorderLevel: 5,
  },
  {
    id: "stk-4",
    company: "Pakiza Woven Fashion Ltd",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    specification: "100% Cotton 3/1 Twill Greige 58 inch",
    itemGroup: "Grey Fabric",
    itemCategory: "Direct Material",
    brand: "Pakiza Weaving",
    origin: "Bangladesh",
    uom: "YDS",
    store: "General Store (PWFL)",
    location: "Rack-B / Bin-10",
    batch: "",
    availableQty: 140,
    reservedQty: 50,
    inTransitQty: 0,
    damagedQty: 10,
    totalQty: 200,
    unitCost: 195,
    stockValue: 39000,
    trackingType: "Location",
    stockStatus: "Low Stock",
    reorderLevel: 500,
  },
  {
    id: "stk-5",
    company: "Pakiza Apparels Ltd",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    specification: "100% Spun Polyester White",
    itemGroup: "Sewing Accessories",
    itemCategory: "Accessories",
    brand: "Astra",
    origin: "Bangladesh",
    uom: "CONE",
    store: "Central Warehouse (Savar)",
    location: "Rack-03 / Shelf-B / Bin-01",
    batch: "",
    availableQty: 0,
    reservedQty: 0,
    inTransitQty: 200,
    damagedQty: 0,
    totalQty: 200,
    unitCost: 95,
    stockValue: 19000,
    trackingType: "Location",
    stockStatus: "Out of Stock",
    reorderLevel: 100,
  },
  {
    id: "stk-6",
    company: "Pakiza Spinning Mills Ltd",
    itemCode: "LUB-001",
    itemName: "Lubricant Oil ISO VG 68",
    specification: "Industrial Gear & Bearing Lubricant",
    itemGroup: "Lubricants & Oils",
    itemCategory: "Consumables",
    brand: "Mobil",
    origin: "USA",
    uom: "LTR",
    store: "Spare Parts Store (Dhamrai)",
    location: "Oil Cellar Barrel-2",
    batch: "BAT-LUB-2608-01",
    availableQty: 480,
    reservedQty: 20,
    inTransitQty: 100,
    damagedQty: 0,
    totalQty: 600,
    unitCost: 350,
    stockValue: 210000,
    trackingType: "Batch",
    stockStatus: "In-Transit",
    reorderLevel: 150,
  },
];

export const INITIAL_LEDGER_DATA: TransactionLedgerRow[] = [
  {
    id: "led-1",
    date: "2026-10-06",
    transactionType: "Material Issue",
    referenceNo: "ISS-2026-0042",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2610-01",
    location: "Row-A / Pallet-01",
    inQty: 0,
    outQty: 800,
    balance: 5500,
    unitCost: 380,
    remarks: "Issued to Knitting Floor Line-02",
  },
  {
    id: "led-2",
    date: "2026-10-04",
    transactionType: "Material Receipt",
    referenceNo: "MRR-2026-0590",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2610-01",
    location: "Row-A / Pallet-01",
    inQty: 2500,
    outQty: 0,
    balance: 6300,
    unitCost: 380,
    remarks: "Received from Meghna Yarn Mills against PO-0088",
  },
  {
    id: "led-3",
    date: "2026-10-02",
    transactionType: "Transfer In",
    referenceNo: "TRF-2026-0019",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-03",
    location: "Row-A / Pallet-02",
    inQty: 1000,
    outQty: 0,
    balance: 3800,
    unitCost: 380,
    remarks: "Inter-company transfer from Pakiza Spinning",
  },
  {
    id: "led-4",
    date: "2026-09-29",
    transactionType: "Store Return",
    referenceNo: "RET-2026-0011",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-03",
    location: "Row-A / Pallet-02",
    inQty: 200,
    outQty: 0,
    balance: 2800,
    unitCost: 380,
    remarks: "Excess yarn cones returned from Knitting Floor",
  },
  {
    id: "led-5",
    date: "2026-09-22",
    transactionType: "Supplier Return",
    referenceNo: "SRT-2026-0004",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-02",
    location: "Row-A / Pallet-03",
    inQty: 0,
    outQty: 300,
    balance: 2600,
    unitCost: 380,
    remarks: "Returned due to high twist variation defect",
  },
  {
    id: "led-6",
    date: "2026-09-15",
    transactionType: "Direct Receipt",
    referenceNo: "DMRR-2026-0015",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    store: "Central Warehouse (Savar)",
    batch: "",
    location: "Rack-01 / Shelf-A / Bin-04",
    inQty: 6,
    outQty: 0,
    balance: 25,
    unitCost: 4500,
    remarks: "Direct cash purchase receipt",
  },
  {
    id: "led-7",
    date: "2026-09-10",
    transactionType: "Transfer Out",
    referenceNo: "TRF-2026-0014",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-01",
    location: "Row-A / Pallet-01",
    inQty: 0,
    outQty: 500,
    balance: 2900,
    unitCost: 380,
    remarks: "Intra-store transfer to Sample Section",
  },
  {
    id: "led-8",
    date: "2026-09-05",
    transactionType: "Adjustment +",
    referenceNo: "ADJ-2026-0008",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-01",
    location: "Row-A / Pallet-01",
    inQty: 40,
    outQty: 0,
    balance: 3400,
    unitCost: 380,
    remarks: "Found extra during physical inventory count",
  },
  {
    id: "led-9",
    date: "2026-08-30",
    transactionType: "Adjustment -",
    referenceNo: "ADJ-2026-0006",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    store: "Chemical Store",
    batch: "BAT-DYE-2609-04",
    location: "Drum Rack C-12",
    inQty: 0,
    outQty: 15,
    balance: 1025,
    unitCost: 620,
    remarks: "Moisture evaporation loss variance",
  },
  {
    id: "led-10",
    date: "2026-08-20",
    transactionType: "Write-Off",
    referenceNo: "WOF-2026-0003",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    store: "Chemical Store",
    batch: "BAT-DYE-2608-01",
    location: "Drum Rack C-12",
    inQty: 0,
    outQty: 25,
    balance: 1040,
    unitCost: 620,
    remarks: "Damaged drum seal contamination write-off",
  },
  {
    id: "led-11",
    date: "2026-08-01",
    transactionType: "Opening Stock",
    referenceNo: "OPN-2026-0001",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2608-00",
    location: "Row-A / Pallet-01",
    inQty: 3360,
    outQty: 0,
    balance: 3360,
    unitCost: 380,
    remarks: "FY 2026-27 Opening Inventory Balance",
  },
];

export const INITIAL_MOVEMENT_DATA: ItemMovementRow[] = [
  {
    id: "mov-1",
    date: "2026-10-06",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    transaction: "Material Issue",
    reference: "ISS-2026-0042",
    fromStore: "Central Warehouse (Savar)",
    toStore: "Knitting Floor Store",
    batch: "BAT-YRN-2610-01",
    location: "Rack-A-01",
    quantity: 800,
    status: "Completed",
    timeline: [
      { stage: "Requisition Approved", timestamp: "2026-10-05 14:00", locationOrStore: "Knitting Section" },
      { stage: "Store Picking", timestamp: "2026-10-06 09:30", locationOrStore: "Central Warehouse (Savar)" },
      { stage: "Rack Clearance", timestamp: "2026-10-06 10:15", locationOrStore: "Rack-A-01" },
      { stage: "Material Issue", timestamp: "2026-10-06 11:00", locationOrStore: "Central Store Counter" },
      { stage: "Received at Floor", timestamp: "2026-10-06 11:45", locationOrStore: "Knitting Floor Store" },
    ],
  },
  {
    id: "mov-2",
    date: "2026-10-03",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    transaction: "Inter-Company Transfer",
    reference: "TRF-2026-0019",
    fromStore: "Central Warehouse (Savar)",
    toStore: "General Store (PWFL)",
    batch: "BAT-DYE-2609-04",
    location: "Drum Rack C-12",
    quantity: 300,
    status: "Completed",
    timeline: [
      { stage: "Transfer Created", timestamp: "2026-10-02 11:00", locationOrStore: "PKCL Head Office" },
      { stage: "Dispatched", timestamp: "2026-10-03 08:30", locationOrStore: "Central Warehouse (Savar)" },
      { stage: "In Transit (Truck DH-1234)", timestamp: "2026-10-03 10:00", locationOrStore: "Dhaka-Aricha Highway" },
      { stage: "Received & Inspected", timestamp: "2026-10-03 12:45", locationOrStore: "General Store (PWFL)" },
      { stage: "Stock Posted", timestamp: "2026-10-03 14:00", locationOrStore: "Rack-B / Bin-10" },
    ],
  },
  {
    id: "mov-3",
    date: "2026-09-29",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    transaction: "Return to Store",
    reference: "RET-2026-0011",
    fromStore: "Knitting Floor Store",
    toStore: "Central Warehouse (Savar)",
    batch: "BAT-YRN-2609-03",
    location: "Row-A / Pallet-02",
    quantity: 200,
    status: "Completed",
    timeline: [
      { stage: "Excess Declared", timestamp: "2026-09-29 15:00", locationOrStore: "Knitting Floor Store" },
      { stage: "Return Dispatched", timestamp: "2026-09-29 16:00", locationOrStore: "Department Gate" },
      { stage: "Store QA Verified", timestamp: "2026-09-29 16:45", locationOrStore: "Central Store QA" },
      { stage: "Stock Restored", timestamp: "2026-09-29 17:15", locationOrStore: "Row-A / Pallet-02" },
    ],
  },
];

export const INITIAL_BATCH_STOCK_DATA: BatchStockRow[] = [
  {
    id: "bat-1",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    batch: "BAT-YRN-2610-01",
    mfgDate: "2026-09-15",
    expiryDate: "2028-09-15",
    store: "Yarn Store (PKCL)",
    location: "Row-A / Pallet-01",
    quantity: 4200,
    unitCost: 380,
    status: "Active",
  },
  {
    id: "bat-2",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    batch: "BAT-DYE-2609-04",
    mfgDate: "2026-03-10",
    expiryDate: "2026-11-15",
    store: "Chemical Store",
    location: "Drum Rack C-12",
    quantity: 850,
    unitCost: 620,
    status: "Expiring Soon",
  },
  {
    id: "bat-3",
    itemCode: "CHM-002",
    itemName: "Sodium Hydrosulphite 88%",
    batch: "BAT-HYD-2512-08",
    mfgDate: "2025-06-01",
    expiryDate: "2026-06-01",
    store: "Chemical Store",
    location: "Drum Rack D-04",
    quantity: 60,
    unitCost: 280,
    status: "Expired",
  },
  {
    id: "bat-4",
    itemCode: "LUB-001",
    itemName: "Lubricant Oil ISO VG 68",
    batch: "BAT-LUB-2608-01",
    mfgDate: "2026-07-20",
    expiryDate: "2029-07-20",
    store: "Spare Parts Store (Dhamrai)",
    location: "Oil Cellar Barrel-2",
    quantity: 480,
    unitCost: 350,
    status: "Active",
  },
];

export const INITIAL_LOCATION_STOCK_DATA: LocationStockRow[] = [
  {
    id: "loc-1",
    store: "Central Warehouse (Savar)",
    rack: "Rack-01",
    shelf: "Shelf-A",
    bin: "Bin-04",
    locationCode: "SAV-R01-SA-B04",
    locationType: "Bin",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    batch: "-",
    uom: "PCS",
    quantity: 18,
    unitCost: 4500,
    stockValue: 81000,
  },
  {
    id: "loc-2",
    store: "Central Warehouse (Savar)",
    rack: "Rack-03",
    shelf: "Shelf-B",
    bin: "Bin-01",
    locationCode: "SAV-R03-SB-B01",
    locationType: "Bin",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    batch: "-",
    uom: "CONE",
    quantity: 450,
    unitCost: 95,
    stockValue: 42750,
  },
  {
    id: "loc-3",
    store: "General Store (PWFL)",
    rack: "Rack-B",
    shelf: "Shelf-02",
    bin: "Bin-10",
    locationCode: "PWFL-RB-S02-B10",
    locationType: "Bin",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    batch: "-",
    uom: "YDS",
    quantity: 140,
    unitCost: 195,
    stockValue: 27300,
  },
  {
    id: "loc-4",
    store: "Spare Parts Store (Dhamrai)",
    rack: "Rack-E",
    shelf: "Shelf-01",
    bin: "Bin-05",
    locationCode: "DHM-RE-S01-B05",
    locationType: "Bin",
    itemCode: "SPR-001",
    itemName: "Sewing Machine Needle Groz-Beckert DBx1",
    batch: "-",
    uom: "PKT",
    quantity: 120,
    unitCost: 420,
    stockValue: 50400,
  },
];

export const INITIAL_RECEIPT_REGISTER_DATA: ItemReceiptRow[] = [
  {
    id: "rec-1",
    month: "2026-10",
    monthLabel: "October 2026",
    date: "2026-10-04",
    receiptType: "Material Receipt",
    reference: "MRR-2026-0590",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    batch: "BAT-YRN-2610-01",
    location: "Row-A / Pallet-01",
    quantity: 2500,
    unitPrice: 380,
    status: "Verified",
  },
  {
    id: "rec-2",
    month: "2026-10",
    monthLabel: "October 2026",
    date: "2026-10-02",
    receiptType: "Direct Receipt",
    reference: "DMRR-2026-0018",
    supplier: "CHAMPION STEEL PRODUCTS",
    company: "Pakiza Knit Composite Ltd",
    store: "Central Warehouse (Savar)",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    itemGroup: "Office Furniture",
    specification: "Ergonomic Mesh High Back",
    brand: "Champion",
    origin: "Bangladesh",
    uom: "PCS",
    batch: "",
    location: "Rack-01 / Shelf-A / Bin-04",
    quantity: 12,
    unitPrice: 4500,
    status: "Received",
  },
  {
    id: "rec-3",
    month: "2026-10",
    monthLabel: "October 2026",
    date: "2026-10-01",
    receiptType: "Transfer Receive",
    reference: "TRCV-2026-0012",
    supplier: "Pakiza Spinning Mills",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    batch: "BAT-YRN-2609-03",
    location: "Row-A / Pallet-02",
    quantity: 1000,
    unitPrice: 380,
    status: "Quality Passed",
  },
  {
    id: "rec-4",
    month: "2026-09",
    monthLabel: "September 2026",
    date: "2026-09-28",
    receiptType: "Store Return Receive",
    reference: "SRCV-2026-0009",
    supplier: "Knitting Floor Unit 1",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    batch: "BAT-YRN-2609-03",
    location: "Row-A / Pallet-02",
    quantity: 200,
    unitPrice: 380,
    status: "Verified",
  },
  {
    id: "rec-5",
    month: "2026-09",
    monthLabel: "September 2026",
    date: "2026-09-12",
    receiptType: "Adjustment +",
    reference: "ADJ-2026-0008",
    supplier: "Physical Audit Team",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    batch: "BAT-YRN-2609-01",
    location: "Row-A / Pallet-01",
    quantity: 40,
    unitPrice: 380,
    status: "Verified",
  },
];

export const INITIAL_ISSUE_REGISTER_DATA: ItemIssueRow[] = [
  {
    id: "iss-1",
    month: "2026-10",
    monthLabel: "October 2026",
    date: "2026-10-06",
    issueType: "Material Issue",
    reference: "ISS-2026-0042",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2610-01",
    location: "Row-A / Pallet-01",
    quantity: 800,
    issuedTo: "Knitting Floor Production Head (Emp ID: PKCL-104)",
    status: "Issued",
  },
  {
    id: "iss-2",
    month: "2026-10",
    monthLabel: "October 2026",
    date: "2026-10-03",
    issueType: "Transfer Out",
    reference: "TRF-2026-0019",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    itemGroup: "Dyes & Chemicals",
    specification: "C.I. Reactive Black 5",
    brand: "Novacron",
    origin: "Switzerland",
    uom: "KG",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    batch: "BAT-DYE-2609-04",
    location: "Drum Rack C-12",
    quantity: 300,
    issuedTo: "General Store (PWFL) Logistics Driver",
    status: "Dispatched",
  },
  {
    id: "iss-3",
    month: "2026-09",
    monthLabel: "September 2026",
    date: "2026-09-22",
    issueType: "Supplier Return",
    reference: "SRT-2026-0004",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "100% Cotton Ring Spun Ne 30/1",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-02",
    location: "Row-A / Pallet-03",
    quantity: 300,
    issuedTo: "Meghna Yarn Mills Delivery Agent",
    status: "Posted",
  },
  {
    id: "iss-4",
    month: "2026-09",
    monthLabel: "September 2026",
    date: "2026-09-18",
    issueType: "Write-Off",
    reference: "WOF-2026-0003",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    itemGroup: "Dyes & Chemicals",
    specification: "C.I. Reactive Black 5",
    brand: "Novacron",
    origin: "Switzerland",
    uom: "KG",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    batch: "BAT-DYE-2608-01",
    location: "Drum Rack C-12",
    quantity: 25,
    issuedTo: "Effluent Disposal Unit",
    status: "Posted",
  },
  {
    id: "iss-5",
    month: "2026-08",
    monthLabel: "August 2026",
    date: "2026-08-28",
    issueType: "Adjustment -",
    reference: "ADJ-2026-0006",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    itemGroup: "Dyes & Chemicals",
    specification: "C.I. Reactive Black 5",
    brand: "Novacron",
    origin: "Switzerland",
    uom: "KG",
    company: "Pakiza Knit Composite Ltd",
    store: "Chemical Store",
    batch: "BAT-DYE-2609-04",
    location: "Drum Rack C-12",
    quantity: 15,
    issuedTo: "Store Inventory Adjustment Log",
    status: "Posted",
  },
];

export const INITIAL_STOCK_TRANSFER_DATA: StockTransferRow[] = [
  {
    id: "trf-1",
    transferId: "TRF-2026-0024",
    date: "2026-10-06",
    fromCompany: "Pakiza Knit Composite Ltd",
    toCompany: "Pakiza Woven Fashion Ltd",
    fromStore: "Central Warehouse (Savar)",
    toStore: "General Store (PWFL)",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    batch: "-",
    quantity: 10,
    receivedQty: 0,
    pendingQty: 10,
    varianceQty: 0,
    status: "In Transit",
    stages: {
      transfer: true,
      dispatch: true,
      inTransit: true,
      receive: false,
      accepted: 0,
      rejected: 0,
      damaged: 0,
      finalStock: 0,
    },
  },
  {
    id: "trf-2",
    transferId: "TRF-2026-0021",
    date: "2026-10-03",
    fromCompany: "Pakiza Knit Composite Ltd",
    toCompany: "Pakiza Knit Composite Ltd",
    fromStore: "Central Warehouse (Savar)",
    toStore: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    batch: "BAT-YRN-2610-01",
    quantity: 1200,
    receivedQty: 1200,
    pendingQty: 0,
    varianceQty: 0,
    status: "Fully Received",
    stages: {
      transfer: true,
      dispatch: true,
      inTransit: true,
      receive: true,
      accepted: 1200,
      rejected: 0,
      damaged: 0,
      finalStock: 1200,
    },
  },
  {
    id: "trf-3",
    transferId: "TRF-2026-0018",
    date: "2026-09-25",
    fromCompany: "Pakiza Spinning Mills Ltd",
    toCompany: "Pakiza Knit Composite Ltd",
    fromStore: "Spare Parts Store (Dhamrai)",
    toStore: "Central Warehouse (Savar)",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    batch: "-",
    quantity: 500,
    receivedQty: 480,
    pendingQty: 0,
    varianceQty: 20,
    status: "Short / Variance",
    stages: {
      transfer: true,
      dispatch: true,
      inTransit: true,
      receive: true,
      accepted: 480,
      rejected: 15,
      damaged: 5,
      finalStock: 480,
    },
  },
  {
    id: "trf-4",
    transferId: "TRF-2026-0015",
    date: "2026-09-15",
    fromCompany: "Pakiza Apparels Ltd",
    toCompany: "Pakiza Woven Fashion Ltd",
    fromStore: "Central Warehouse (Savar)",
    toStore: "General Store (PWFL)",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    batch: "-",
    quantity: 1000,
    receivedQty: 600,
    pendingQty: 400,
    varianceQty: 0,
    status: "Partially Received",
    stages: {
      transfer: true,
      dispatch: true,
      inTransit: true,
      receive: true,
      accepted: 600,
      rejected: 0,
      damaged: 0,
      finalStock: 600,
    },
  },
];

export const INITIAL_STOCK_ADJUSTMENT_DATA: StockAdjustmentRow[] = [
  {
    id: "adj-1",
    adjustmentId: "ADJ-2026-0008",
    date: "2026-10-02",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    store: "Yarn Store (PKCL)",
    batch: "BAT-YRN-2609-01",
    location: "Row-A / Pallet-01",
    adjustmentType: "Stock Increase",
    previousQty: 3360,
    adjustmentQty: 40,
    finalQty: 3400,
    reason: "Surplus bags found during monthly internal physical inventory count",
  },
  {
    id: "adj-2",
    adjustmentId: "ADJ-2026-0006",
    date: "2026-09-20",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    store: "Chemical Store",
    batch: "BAT-DYE-2609-04",
    location: "Drum Rack C-12",
    adjustmentType: "Stock Decrease",
    previousQty: 1040,
    adjustmentQty: 15,
    finalQty: 1025,
    reason: "Chemical moisture natural vaporization variance after QA re-test",
  },
  {
    id: "adj-3",
    adjustmentId: "ADJ-2026-0004",
    date: "2026-09-05",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    store: "Central Warehouse (Savar)",
    batch: "-",
    location: "Rack-01 / Shelf-A / Bin-04",
    adjustmentType: "Stock Increase",
    previousQty: 16,
    adjustmentQty: 2,
    finalQty: 18,
    reason: "Showroom demo sample returned and restored to warehouse",
  },
];

export const INITIAL_STOCK_WRITEOFF_DATA: StockWriteOffRow[] = [
  {
    id: "wof-1",
    writeOffId: "WOF-2026-0003",
    date: "2026-10-01",
    itemCode: "CHM-001",
    itemName: "Reactive Black B Dye",
    store: "Chemical Store",
    batch: "BAT-DYE-2608-01",
    location: "Drum Rack C-12",
    quantity: 25,
    unitCost: 620,
    value: 15500,
    reason: "Drum seal cracked during storage; chemical coagulated beyond usable tolerance",
    status: "Posted",
    approvalBy: "Engr. Faruq Hossain (GM Operations)",
    postedDate: "2026-10-02",
  },
  {
    id: "wof-2",
    writeOffId: "WOF-2026-0002",
    date: "2026-09-18",
    itemCode: "FAB-001",
    itemName: "Cotton Twill 20x16 Fabric",
    store: "General Store (PWFL)",
    batch: "-",
    location: "Rack-B / Bin-10",
    quantity: 35,
    unitCost: 195,
    value: 6825,
    reason: "Water seepage damage from roof rain leakage during cyclone storm",
    status: "Approved",
    approvalBy: "Md. Tanvir Ahmed (Director Supply Chain)",
    postedDate: "2026-09-19",
  },
  {
    id: "wof-3",
    writeOffId: "WOF-2026-0001",
    date: "2026-08-10",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    store: "Central Warehouse (Savar)",
    batch: "-",
    location: "Rack-03 / Shelf-B / Bin-01",
    quantity: 50,
    unitCost: 95,
    value: 4750,
    reason: "Old obsolete thread colors decommissioned as per buyer tech-pack cancellation",
    status: "Pending Approval",
  },
];

export const INITIAL_SUPPLIER_RETURN_REPORT_DATA: SupplierReturnReportRow[] = [
  {
    id: "sret-1",
    month: "2026-10",
    monthLabel: "October 2026",
    returnDate: "2026-10-05",
    supplierReturnRef: "SRT-2026-0006",
    poWoNo: "PO-2026-0089",
    mrrNo: "MRR-2026-0592",
    supplier: "CHAMPION STEEL PRODUCTS",
    company: "Pakiza Knit Composite Ltd",
    store: "Central Warehouse (Savar)",
    itemCode: "ITM-001",
    itemName: "Manager Chair",
    itemGroup: "Office Furniture",
    specification: "Mesh back damaged caster wheels",
    brand: "Champion",
    origin: "Bangladesh",
    uom: "PCS",
    batch: "-",
    location: "Rack-01 / Shelf-A / Bin-04",
    returnQuantity: 2,
    unitPrice: 4500,
    returnValue: 9000,
    status: "Completed",
  },
  {
    id: "sret-2",
    month: "2026-09",
    monthLabel: "September 2026",
    returnDate: "2026-09-22",
    supplierReturnRef: "SRT-2026-0004",
    poWoNo: "PO-2026-0075",
    mrrNo: "MRR-2026-0580",
    supplier: "MEGHNA YARN MILLS",
    company: "Pakiza Knit Composite Ltd",
    store: "Yarn Store (PKCL)",
    itemCode: "YRN-001",
    itemName: "Cotton Yarn 30/1 Combed",
    itemGroup: "Yarn Raw Material",
    specification: "Excess yarn twist CV% rejection",
    brand: "Meghna Gold",
    origin: "Bangladesh",
    uom: "KG",
    batch: "BAT-YRN-2609-02",
    location: "Row-A / Pallet-03",
    returnQuantity: 300,
    unitPrice: 380,
    returnValue: 114000,
    status: "Completed",
  },
  {
    id: "sret-3",
    month: "2026-08",
    monthLabel: "August 2026",
    returnDate: "2026-08-16",
    supplierReturnRef: "SRT-2026-0002",
    poWoNo: "PO-2026-0051",
    mrrNo: "MRR-2026-0562",
    supplier: "STAR ACCESSORIES BD",
    company: "Pakiza Apparels Ltd",
    store: "Central Warehouse (Savar)",
    itemCode: "ACC-001",
    itemName: "Sewing Thread 40/2 5000m",
    itemGroup: "Sewing Accessories",
    specification: "Shade variance from approved sample card",
    brand: "Astra",
    origin: "Bangladesh",
    uom: "CONE",
    batch: "-",
    location: "Rack-03 / Shelf-B / Bin-01",
    returnQuantity: 150,
    unitPrice: 95,
    returnValue: 14250,
    status: "Completed",
  },
];
