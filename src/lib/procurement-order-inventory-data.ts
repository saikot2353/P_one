// src/lib/procurement-order-inventory-data.ts
// Unified Data models, persistence and seed records for Purchase Orders, Work Orders,
// Material Receiving (MRR), Supplier Bills, Supplier Returns, and Opening Stock.

import { getStoredData, setStoredData, DEFAULT_ITEMS, DEFAULT_WAREHOUSES, DEFAULT_SUPPLIERS } from "./procurement-master-data";
import { DEFAULT_PURCHASE_REQUISITIONS, DEFAULT_COMPARATIVE_STATEMENTS } from "./procurement-requisition-data";

// -------------------------------------------------------------
// 1. PURCHASE ORDER / WORK ORDER TYPES
// -------------------------------------------------------------

export type DocumentType = "Purchase Order" | "Work Order";
export type OrderStatus = "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Rejected" | "Returned for Correction" | "Cancelled" | "Closed" | "Saved" | "Review Pending";

export interface POItem {
  id: string;
  sl: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string; // SKU / Default UOM
  marketUnit?: string; // Market Unit (MU)
  conversion?: string; // Conversion string/factor e.g. "1 Dozen = 12 PCS"
  purchaseUom?: string; // Alias for marketUnit
  conversionFactor?: number;
  equivalentBaseQty?: number; // Equivalent Base Quantity = orderedQuantity * (conversionFactor || 1)
  remainingPrQuantity?: number; // Remaining PR Quantity = prQuantity - equivalentBaseQty
  prQuantity: number;
  orderedQuantity: number;
  unitPrice: number;
  discount: number;
  vatRate: number; // e.g. 5% or 7.5%
  vatAmount: number;
  taxRate?: number; // Item-wise Tax %
  taxAmount?: number; // Item-wise Tax Amount
  lineTotal: number;
  remarks?: string;
}

export interface WOServiceItem {
  id: string;
  sl: number;
  serviceName: string;
  serviceCode: string;
  workDescription: string;
  specification: string; // Scope of Work
  uom: string;
  marketUnit?: string;
  conversion?: string;
  estimatedQuantity: number;
  workOrderQuantity: number;
  unitRate: number;
  vatRate?: number;
  vatAmount?: number;
  taxRate?: number; // Item-wise Tax %
  taxAmount?: number; // Item-wise Tax Amount
  lineTotal: number;
  serviceStartDate: string;
  serviceEndDate: string;
  remarks?: string;
}

export interface OrderAttachment {
  id: string;
  documentType: string;
  documentName: string;
  fileName: string;
  fileSize?: string;
  attachmentUrl?: string;
  description?: string;
}

export interface OrderApprovalStep {
  level: number;
  approver: string;
  designation: string;
  action: "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected" | "Returned for Correction";
  dateTime: string;
  remarks: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string; // PO-2026-0001 or WO-2026-0001
  documentType: DocumentType;
  creationMethod?: "Purchase Requisition" | "Comparative Statement" | "Direct Purchase Order / Work Order";
  orderDate: string;
  prepareBy: string;
  department: string;
  // Procurement References
  prIds: string[]; // Tagged PR numbers e.g. ["PR-2026-000001"]
  prDate?: string;
  prRequestedBy?: string;
  prDepartment?: string;
  prEstimatedAmount?: number;
  csId?: string; // Tagged CS number e.g. "CS-2026-000001"
  csDate?: string;
  csRecommendedSupplier?: string;
  csRecommendedAmount?: number;
  // Supplier Info
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  supplierAddress?: string;
  contactPerson: string;
  designation: string;
  contactNumber?: string;
  supplierEmail?: string;
  // Delivery or Service Info
  deliveryWarehouse: string; // For PO
  deliveryDate?: string;
  workLocation?: string; // For WO
  transportMethod?: string;
  paymentMode?: string;
  poValidDate?: string;
  // Financials
  currency: string; // Default "BDT"
  exchangeRate?: number; // Mandatory if currency != BDT
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  taxTotal?: number; // Total Tax Amount
  grandTotal: number;
  // Terms & Conditions
  termsAndConditions: string;
  // Attachments
  attachments: OrderAttachment[];
  // Approval
  orderStatus: OrderStatus;
  currentApprovalLevel: number;
  approverName?: string;
  approvalDate?: string;
  approvalRemarks?: string;
  approvalHistory: OrderApprovalStep[];
  remarks?: string;
  items?: POItem[];
  woItems?: WOServiceItem[];
}

// -------------------------------------------------------------
// 2. MATERIAL RECEIVE (MRR) TYPES
// -------------------------------------------------------------

export type ReceiveSource = "Against Purchase Order" | "Against Work Order" | "Direct MRR";
export type InspectionStatus = "Pending" | "Passed" | "Failed" | "Partially Accepted";
export type ReceiveStatus = "Pending Receive" | "Pending Inspection" | "Complete Inspection" | "Partially Received" | "Full Received";

export interface MRRItem {
  id: string;
  sl: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  orderedQty: number;
  previouslyReceivedQty: number;
  currentReceiveQty: number;
  remainingQty: number;
  unitPrice: number;
  lineTotal: number;
  batchNumber?: string;
  createDate?: string;
  expiryDate?: string;
  location?: string;
  remarks?: string;
  // Inspection fields
  acceptedQty?: number;
  rejectedQty?: number;
}

export interface MaterialReceive {
  id: string;
  receiveNumber: string; // MRR-2026-0001 or DMRR-2026-0001
  receiveDate: string;
  receiveType: "Purchase Order" | "Work Order";
  receiveSource: ReceiveSource;
  poNumber?: string;
  poDate?: string;
  supplierId: string;
  supplierName: string;
  supplierCode?: string;
  department: string;
  warehouseStore: string;
  receiveLocation?: string;
  challanNo: string;
  challanDate: string;
  vehicleNumber?: string;
  receivedBy: string;
  // Inspection
  inspectionRequired: boolean;
  inspectionStatus: InspectionStatus;
  inspectionRemarks?: string;
  // Items
  items: MRRItem[];
  totalReceivedQty: number;
  totalAcceptedQty: number;
  totalRejectedQty: number;
  totalAmount: number;
  // Status & Attachments
  receiveStatus: ReceiveStatus;
  attachments?: { name: string; url?: string; size?: string }[];
  remarks?: string;
}

// -------------------------------------------------------------
// 3. SUPPLIER BILL TYPES
// -------------------------------------------------------------

export interface SupplierBillItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  mrrReceivedQty: number;
  previouslyBilledQty: number;
  currentBillQty: number;
  unitPrice: number;
  discount: number;
  vatAmount: number;
  lineAmount: number;
}

export interface SupplierBill {
  id: string;
  billNumber: string; // BIL-2026-000142
  billDate: string;
  poNumber: string;
  poDate?: string;
  mrrNumbers: string[]; // Supports multiple MRRs
  supplierId: string;
  supplierName: string;
  supplierBillNo: string; // Vendor invoice number
  supplierBillDate: string;
  currency: string;
  subtotal: number;
  discount: number;
  vat: number;
  tax?: number; // Tax / AIT
  otherCharges: number;
  otherChargeServiceItemIds?: string[];
  adjustment: number;
  netBillAmount: number;
  roundOff: number;
  paymentStatus: "Unpaid" | "Partially Paid" | "Fully Paid";
  paymentDueDate: string;
  paidAmount: number;
  outstandingAmount: number;
  approvalStatus: "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Rejected" | "Returned" | "Cancelled";
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  approvalRemarks?: string;
  remarks?: string;
  attachments: { documentType: string; documentName: string; fileName: string; description?: string }[];
  items: SupplierBillItem[];
}

// -------------------------------------------------------------
// 4. SUPPLIER RETURN TYPES
// -------------------------------------------------------------

export type ReturnReason =
  | "Damaged"
  | "Defective"
  | "Wrong Item"
  | "Wrong Quantity"
  | "Quality Issue"
  | "Specification Mismatch"
  | "Expired"
  | "Other";

export interface SupplierReturnItem {
  id: string;
  sl: number;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  mrrReceivedQty: number;
  previouslyReturnedQty: number;
  returnableQty: number;
  currentReturnQty: number;
  unitPrice: number;
  returnValue: number;
  batchNumber?: string;
  location?: string;
  returnReason: ReturnReason;
  remarks?: string;
}

export interface SupplierReturn {
  id: string;
  returnNumber: string; // RET-2026-0001
  returnDate: string;
  department: string;
  poNumber: string;
  mrrNumber: string;
  mrrDate: string;
  supplierId: string;
  supplierName: string;
  storeName: string;
  returnReason: ReturnReason;
  returnRemarks?: string;
  totalReturnedQty: number;
  totalReturnValue: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  items: SupplierReturnItem[];
  attachments?: { documentType: string; documentName: string; fileName: string }[];
}

// -------------------------------------------------------------
// 5. OPENING STOCK TYPES
// -------------------------------------------------------------

export interface OpeningStockItem {
  id: string;
  sl: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  specification: string;
  brand: string;
  origin: string;
  uom: string;
  openingQuantity: number;
  unitCost: number;
  totalValue: number;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  location?: string;
  consumedQty?: number;
  remarks?: string;
}

export interface OpeningStockRecord {
  id: string;
  openingStockId: string; // OS-2026-0001
  stockDate: string;
  warehouseStore?: string; // Store Code e.g. "WH-PKCL-01"
  storeCode?: string;
  storeId?: string;
  storeName: string;
  organization: string;
  remarks?: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  status: "Draft" | "Posted" | "Approved";
  items: OpeningStockItem[];
}

// -------------------------------------------------------------
// DEFAULT SEED DATA
// -------------------------------------------------------------

export const DEFAULT_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-2026-001",
    orderNumber: "PO-2026-0001",
    documentType: "Purchase Order",
    orderDate: "2026-09-22",
    prepareBy: "Tahmid Afsar Shapno",
    department: "Information Technology",
    prIds: ["PR-2026-000001"],
    prDate: "2026-09-20",
    prRequestedBy: "Tahmid Afsar Shapno",
    prDepartment: "Information Technology",
    prEstimatedAmount: 994000,
    csId: "CS-2026-000001",
    csDate: "2026-09-21",
    csRecommendedSupplier: "Bengal Information Systems",
    csRecommendedAmount: 962500,
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    supplierCode: "SUP-002",
    contactPerson: "Arif Chowdhury",
    designation: "Key Accounts Lead",
    contactNumber: "01812334455",
    supplierEmail: "arif@bengalinfo.com",
    deliveryWarehouse: "Pakiza Technovation Central IT & Hardware Depot",
    deliveryDate: "2026-10-02",
    currency: "BDT",
    subtotal: 962500,
    discountTotal: 15000,
    vatTotal: 47375,
    grandTotal: 994875,
    termsAndConditions: "1. Delivery must be completed strictly within 10 days of PO issuance date.\n2. Defective or non-conforming items must be replaced by vendor within 7 working days.\n3. Payment term is 30 calendar days from the date of verified store receipt.",
    attachments: [
      {
        id: "att-po-1",
        documentType: "Signed Quotation",
        documentName: "Bengal_Quotation_Verified.pdf",
        fileName: "Bengal_Quotation_Verified.pdf",
        fileSize: "1.2 MB",
        description: "Officially agreed unit pricing from Comparative Statement",
      },
    ],
    orderStatus: "Approved",
    currentApprovalLevel: 2,
    approverName: "Rafiqul Islam",
    approvalDate: "2026-09-23 11:30 AM",
    approvalRemarks: "Approved based on Lowest Evaluated Tenderer from CS-2026-000001.",
    approvalHistory: [
      {
        level: 1,
        approver: "Kamrul Islam",
        designation: "Procurement Manager",
        action: "Approved",
        dateTime: "2026-09-22 03:15 PM",
        remarks: "Prices aligned with CS quotation award. Ready for management approval.",
      },
      {
        level: 2,
        approver: "Rafiqul Islam",
        designation: "Director",
        action: "Approved",
        dateTime: "2026-09-23 11:30 AM",
        remarks: "Approved for formal issuance to vendor.",
      },
    ],
    remarks: "Crucial for Q3 CAD expansion team setup.",
  },
  {
    id: "po-2026-002",
    orderNumber: "PO-2026-0002",
    documentType: "Purchase Order",
    orderDate: "2026-09-24",
    prepareBy: "Nazmul Huda",
    department: "Maintenance & Engineering",
    prIds: ["PR-2026-000002"],
    prDate: "2026-09-22",
    prRequestedBy: "Nazmul Huda",
    prDepartment: "Maintenance & Engineering",
    prEstimatedAmount: 254000,
    supplierId: "sup-1",
    supplierName: "Apex Textile Chemical & Dyestuffs Ltd",
    supplierCode: "SUP-2026-001",
    contactPerson: "Engr. Masud Rana",
    designation: "Head of Technical Sales",
    contactNumber: "+880 1711-987654",
    supplierEmail: "masud.rana@apexchem.com",
    deliveryWarehouse: "PKCL Central Raw Material Warehouse",
    deliveryDate: "2026-10-08",
    currency: "BDT",
    subtotal: 248000,
    discountTotal: 8000,
    vatTotal: 12000,
    grandTotal: 252000,
    termsAndConditions: "1. Total payment will be done after delivery and inspection.\n2. Warranty period: Minimum 24 months from installation.\n3. Goods to be delivered at factory gate.",
    attachments: [],
    orderStatus: "Pending Approval",
    currentApprovalLevel: 1,
    approvalHistory: [
      {
        level: 1,
        approver: "Kamrul Islam",
        designation: "Procurement Manager",
        action: "Pending",
        dateTime: "2026-09-24 10:00 AM",
        remarks: "Requisition verified, pending final budget verification.",
      },
    ],
    remarks: "Replacement breakers for substation 2 panel.",
  },
  {
    id: "wo-2026-001",
    orderNumber: "WO-2026-0001",
    documentType: "Work Order",
    orderDate: "2026-09-23",
    prepareBy: "Tahmid Afsar Shapno",
    department: "Information Technology",
    prIds: ["PR-2026-000001"],
    prDate: "2026-09-20",
    prRequestedBy: "Tahmid Afsar Shapno",
    prDepartment: "Information Technology",
    prEstimatedAmount: 180000,
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    supplierCode: "SUP-002",
    contactPerson: "Arif Chowdhury",
    designation: "Key Accounts Lead",
    contactNumber: "01812334455",
    supplierEmail: "arif@bengalinfo.com",
    deliveryWarehouse: "Pakiza Technovation Central IT & Hardware Depot",
    workLocation: "Annex Building Server Room & 3rd Floor IT Bay",
    currency: "BDT",
    subtotal: 165000,
    discountTotal: 5000,
    vatTotal: 12000,
    grandTotal: 172000,
    termsAndConditions: "1. Scope of work must be executed strictly following IEEE safety and cabling standards.\n2. Vendor technician must provide testing and OTDR calibration report.\n3. 100% payment upon sign-off by Head of IT.",
    attachments: [],
    orderStatus: "Approved",
    currentApprovalLevel: 2,
    approverName: "Rafiqul Islam",
    approvalDate: "2026-09-24 02:00 PM",
    approvalRemarks: "Approved for campus fiber backbone termination.",
    approvalHistory: [
      {
        level: 1,
        approver: "Kamrul Islam",
        designation: "Procurement Manager",
        action: "Approved",
        dateTime: "2026-09-23 04:30 PM",
        remarks: "Labor rates aligned with market tender benchmark.",
      },
      {
        level: 2,
        approver: "Rafiqul Islam",
        designation: "Director",
        action: "Approved",
        dateTime: "2026-09-24 02:00 PM",
        remarks: "Approved.",
      },
    ],
    remarks: "Campus fiber optic cable termination and network rack structured cabling.",
  },
  {
    id: "po-2026-003",
    orderNumber: "PO-2026-0003",
    documentType: "Purchase Order",
    creationMethod: "Purchase Requisition",
    orderDate: "2026-09-28",
    prepareBy: "Tahmid Afsar Shapno",
    department: "Quality Assurance",
    prIds: ["PR-2026-000003"],
    prDate: "2026-09-23",
    prRequestedBy: "Sumon Ahmed",
    prDepartment: "Quality Assurance",
    prEstimatedAmount: 145000,
    supplierId: "sup-3",
    supplierName: "Mokkah Electric & Hardware Mart",
    supplierCode: "SUP-2026-003",
    contactPerson: "Md. Jahangir Alam",
    designation: "General Manager",
    contactNumber: "01711223344",
    supplierEmail: "sales@mokkahelectric.com",
    deliveryWarehouse: "Main IT Central Store",
    deliveryDate: "2026-10-12",
    currency: "BDT",
    subtotal: 132000,
    discountTotal: 4000,
    vatTotal: 6400,
    grandTotal: 134400,
    termsAndConditions: "1. Delivery must be completed strictly within 10 days of PO issuance date.\n2. Defective or non-conforming items must be replaced by vendor within 7 working days.\n3. Payment term is 30 calendar days from the date of verified store receipt.",
    attachments: [],
    orderStatus: "Submitted",
    currentApprovalLevel: 1,
    approvalHistory: [
      {
        level: 1,
        approver: "Tahmid Afsar Shapno",
        designation: "Procurement Officer",
        action: "Submitted",
        dateTime: "2026-09-28 11:30 AM",
        remarks: "Submitted for approval review based on PR-2026-000003 allocation.",
      },
    ],
    remarks: "Testing chemicals & calibrated equipment for QA Laboratory.",
  },
];

export const DEFAULT_PO_ITEMS: Record<string, POItem[]> = {
  "PO-2026-0001": [
    {
      id: "poi-1",
      sl: 1,
      itemId: "itm-1",
      itemCode: "ITM-YRN-30-1",
      itemName: "100% Combed Cotton Yarn Ne 30/1",
      specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned, high tensile strength",
      brand: "Groz-Beckert",
      origin: "Bangladesh",
      uom: "KG",
      marketUnit: "KG",
      conversion: "1 KG = 1 KG",
      purchaseUom: "KG",
      conversionFactor: 1,
      equivalentBaseQty: 200,
      prQuantity: 200,
      orderedQuantity: 200,
      unitPrice: 420,
      discount: 4000,
      vatRate: 5,
      vatAmount: 4000,
      lineTotal: 84000,
      remarks: "Batch tracked raw cotton yarn from approved CS",
    },
    {
      id: "poi-2",
      sl: 2,
      itemId: "itm-2",
      itemCode: "ITM-IT-LAT-5440",
      itemName: "Dell Latitude 5440 Core i7 Business Laptop",
      specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD Anti-Glare IPS",
      brand: "Dell Technologies",
      origin: "Malaysia",
      uom: "PCS",
      marketUnit: "PCS",
      conversion: "1 PCS = 1 PCS",
      purchaseUom: "PCS",
      conversionFactor: 1,
      equivalentBaseQty: 5,
      prQuantity: 5,
      orderedQuantity: 5,
      unitPrice: 125000,
      discount: 10000,
      vatRate: 5,
      vatAmount: 30750,
      lineTotal: 645750,
      remarks: "Location tracked IT equipment for CAD and Engineering",
    },
  ],
  "PO-2026-0002": [
    {
      id: "poi-3",
      sl: 1,
      itemCode: "ENG-SW-101",
      itemName: "Schneider 63A 4-Pole MCB C-Curve",
      specification: "10kA breaking capacity, IEC 60898-1 standard, Din-rail mounted",
      brand: "Schneider Electric",
      origin: "Germany",
      uom: "PCS",
      marketUnit: "PCS",
      conversion: "1 PCS = 1 PCS",
      purchaseUom: "PCS",
      conversionFactor: 1,
      equivalentBaseQty: 25,
      prQuantity: 25,
      orderedQuantity: 25,
      unitPrice: 3100,
      discount: 3000,
      vatRate: 5,
      vatAmount: 3725,
      lineTotal: 78225,
      remarks: "Panel switchgear replenishment",
    },
    {
      id: "poi-4",
      sl: 2,
      itemCode: "ENG-CBL-004",
      itemName: "BRB 4-Core 16mm² XLPE Armoured Cable",
      specification: "Copper conductor, 0.6/1kV, XLPE insulation, PVC outer sheath",
      brand: "BRB Cables",
      origin: "Bangladesh",
      uom: "MTR",
      marketUnit: "MTR",
      conversion: "1 MTR = 1 MTR",
      purchaseUom: "MTR",
      conversionFactor: 1,
      equivalentBaseQty: 120,
      prQuantity: 120,
      orderedQuantity: 120,
      unitPrice: 1420,
      discount: 5000,
      vatRate: 5,
      vatAmount: 8270,
      lineTotal: 173670,
      remarks: "Feeder cable run",
    },
  ],
  "PO-2026-0003": [
    {
      id: "poi-5",
      sl: 1,
      itemCode: "CHM-POT-01",
      itemName: "Potassium Dichromate 99.5% AR Grade",
      specification: "Analytical Reagent grade, 500g bottle, purity >= 99.5%, assay certified",
      brand: "Merck KGaA",
      origin: "Germany",
      uom: "KG",
      marketUnit: "KG",
      conversion: "1 KG = 1 KG",
      purchaseUom: "KG",
      conversionFactor: 1,
      equivalentBaseQty: 15,
      prQuantity: 15,
      orderedQuantity: 15,
      unitPrice: 4200,
      discount: 2000,
      vatRate: 5,
      vatAmount: 3050,
      lineTotal: 64050,
      remarks: "Laboratory standard solution reagent",
    },
    {
      id: "poi-6",
      sl: 2,
      itemCode: "LAB-GLS-002",
      itemName: "Calibrated Borosilicate Glassware Set",
      specification: "Class A volumetric flasks (100ml, 250ml, 500ml), pipettes and burettes",
      brand: "Duran Wheaton",
      origin: "Germany",
      uom: "SET",
      marketUnit: "SET",
      conversion: "1 SET = 1 SET",
      purchaseUom: "SET",
      conversionFactor: 1,
      equivalentBaseQty: 4,
      prQuantity: 4,
      orderedQuantity: 4,
      unitPrice: 12500,
      discount: 1000,
      vatRate: 5,
      vatAmount: 2450,
      lineTotal: 51450,
      remarks: "Volumetric glassware for lab titrations",
    },
    {
      id: "poi-7",
      sl: 3,
      itemCode: "QA-MIC-001",
      itemName: "Digital Electronic Micrometer 0-25mm",
      specification: "Resolution 0.001mm, carbide tipped measuring faces, IP65 water resistant",
      brand: "Mitutoyo",
      origin: "Japan",
      uom: "PCS",
      marketUnit: "PCS",
      conversion: "1 PCS = 1 PCS",
      purchaseUom: "PCS",
      conversionFactor: 1,
      prQuantity: 2,
      orderedQuantity: 2,
      unitPrice: 9500,
      discount: 1000,
      vatRate: 5,
      vatAmount: 900,
      lineTotal: 18900,
      remarks: "Yarn thickness precision gauge",
    },
  ],
};

export const DEFAULT_WO_ITEMS: Record<string, WOServiceItem[]> = {
  "WO-2026-0001": [
    {
      id: "woi-1",
      sl: 1,
      serviceName: "Fiber Optic Core Splicing & Fusion",
      serviceCode: "SRV-NET-01",
      workDescription: "Core fusion splicing of 24-Core Single Mode armored outdoor fiber cable between Admin Building and Plant 2 Server Rack.",
      specification: "Insertion loss < 0.05dB per splice, OTDR report with certified test graph.",
      uom: "Core",
      estimatedQuantity: 24,
      workOrderQuantity: 24,
      unitRate: 3500,
      lineTotal: 84000,
      serviceStartDate: "2026-09-28",
      serviceEndDate: "2026-10-02",
      remarks: "Includes joint enclosures and patch panel termination.",
    },
    {
      id: "woi-2",
      sl: 2,
      serviceName: "Structured LAN Cabling & Rack Dressing",
      serviceCode: "SRV-NET-02",
      workDescription: "Installation, dressing, testing, and numbering of Cat6 UTP network cable drops for 45 workstation ports.",
      specification: "CommScope Cat6 standard, cable numbering, RJ45 faceplates and keystones termination.",
      uom: "Point",
      estimatedQuantity: 45,
      workOrderQuantity: 45,
      unitRate: 1800,
      lineTotal: 81000,
      serviceStartDate: "2026-09-29",
      serviceEndDate: "2026-10-05",
      remarks: "Materials provided by client, labor and testing under vendor scope.",
    },
  ],
};

// -------------------------------------------------------------
// DEFAULT RECEIVING ITEMS (For Material Receive List Tabs)
// -------------------------------------------------------------

export interface MaterialReceiveListItem {
  id: string;
  sl: number;
  poNumber: string;
  documentType: DocumentType;
  orderDate: string;
  supplierName: string;
  deliveryStore: string;
  expectedDeliveryDate: string;
  totalOrderedQty: number;
  previouslyReceivedQty: number;
  pendingQty: number;
  receiveStatus: "Pending" | "Partial" | "Complete";
}

export const DEFAULT_RECEIVE_LIST: MaterialReceiveListItem[] = [
  {
    id: "rec-1",
    sl: 1,
    poNumber: "PO-2026-0001",
    documentType: "Purchase Order",
    orderDate: "2026-09-22",
    supplierName: "Bengal Information Systems",
    deliveryStore: "Pakiza Technovation Central IT & Hardware Depot",
    expectedDeliveryDate: "2026-10-02",
    totalOrderedQty: 13,
    previouslyReceivedQty: 6, // 6 out of 13 received
    pendingQty: 7,
    receiveStatus: "Partial",
  },
  {
    id: "rec-2",
    sl: 2,
    poNumber: "PO-2026-0002",
    documentType: "Purchase Order",
    orderDate: "2026-09-24",
    supplierName: "Apex Textile Chemical & Dyestuffs Ltd",
    deliveryStore: "PKCL Central Raw Material Warehouse",
    expectedDeliveryDate: "2026-10-08",
    totalOrderedQty: 145,
    previouslyReceivedQty: 0,
    pendingQty: 145,
    receiveStatus: "Pending",
  },
  {
    id: "rec-3",
    sl: 3,
    poNumber: "PO-2026-0000",
    documentType: "Purchase Order",
    orderDate: "2026-09-10",
    supplierName: "Smart Solution Technologies BD",
    deliveryStore: "Spinning Spare Parts & Consumables Store",
    expectedDeliveryDate: "2026-09-18",
    totalOrderedQty: 50,
    previouslyReceivedQty: 50,
    pendingQty: 0,
    receiveStatus: "Complete",
  },
];

// -------------------------------------------------------------
// DEFAULT MATERIAL RECEIVES (MRR RECORDS)
// -------------------------------------------------------------

export const DEFAULT_MATERIAL_RECEIPTS: MaterialReceive[] = [
  {
    id: "mrr-2026-001",
    receiveNumber: "MRR-2026-0001",
    receiveDate: "2026-09-24",
    receiveType: "Purchase Order",
    receiveSource: "Against Purchase Order",
    poNumber: "PO-2026-0001",
    poDate: "2026-09-22",
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    supplierCode: "SUP-002",
    department: "Information Technology",
    warehouseStore: "Pakiza Technovation Central IT & Hardware Depot",
    receiveLocation: "Shelf B - Laptop Storage Units",
    challanNo: "CH-BIS-9081",
    challanDate: "2026-09-24",
    vehicleNumber: "Dhaka Metro-GA-11-2345",
    receivedBy: "Tahmid Afsar Shapno",
    inspectionRequired: true,
    inspectionStatus: "Passed",
    inspectionRemarks: "All laptops and printer units unboxed and serials checked against warranty manifests. 100% conforming.",
    totalReceivedQty: 6,
    totalAcceptedQty: 6,
    totalRejectedQty: 0,
    totalAmount: 492000,
    receiveStatus: "Partially Received",
    remarks: "First delivery lot: 5 Dell Laptops + 1 HP MFP Printer.",
    items: [
      {
        id: "mrri-1",
        sl: 1,
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification: "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
        brand: "Dell Technologies",
        origin: "United States",
        uom: "PCS",
        orderedQty: 10,
        previouslyReceivedQty: 0,
        currentReceiveQty: 5,
        remainingQty: 5,
        unitPrice: 82000,
        lineTotal: 410000,
        batchNumber: "BAT-IT-2026-09A",
        location: "Shelf B - Laptop Storage Units",
        acceptedQty: 5,
        rejectedQty: 0,
        remarks: "5 units delivered with OEM box seals intact.",
      },
      {
        id: "mrri-2",
        sl: 2,
        itemCode: "IT-PRN-002",
        itemName: "HP LaserJet Pro MFP 4103fdw",
        specification: "Network Laser Multifunction Printer, Duplex Print/Scan, 42 ppm",
        brand: "HP",
        origin: "United States",
        uom: "PCS",
        orderedQty: 3,
        previouslyReceivedQty: 0,
        currentReceiveQty: 1,
        remainingQty: 2,
        unitPrice: 47500,
        lineTotal: 47500,
        batchNumber: "BAT-IT-2026-PRN",
        location: "Shelf B - Laptop Storage Units",
        acceptedQty: 1,
        rejectedQty: 0,
        remarks: "1 unit delivered for IT floor test.",
      },
    ],
  },
  {
    id: "dmrr-2026-001",
    receiveNumber: "DMRR-2026-0001",
    receiveDate: "2026-09-25",
    receiveType: "Purchase Order",
    receiveSource: "Direct MRR",
    supplierId: "sup-1",
    supplierName: "Apex Textile Chemical & Dyestuffs Ltd",
    supplierCode: "SUP-2026-001",
    department: "Dyeing & Finishing",
    warehouseStore: "PKCL Central Raw Material Warehouse",
    receiveLocation: "Rack A1 - Raw Cotton Pallet",
    challanNo: "CH-DIR-4421",
    challanDate: "2026-09-25",
    vehicleNumber: "Dhaka Metro-TA-14-8899",
    receivedBy: "Easin Mia",
    inspectionRequired: true,
    inspectionStatus: "Passed",
    inspectionRemarks: "Emergency chemical sample drum received directly from local manufacturer depot.",
    totalReceivedQty: 250,
    totalAcceptedQty: 250,
    totalRejectedQty: 0,
    totalAmount: 105000,
    receiveStatus: "Full Received",
    remarks: "Direct emergency delivery without PO reference approved by Production Head.",
    items: [
      {
        id: "dmrri-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        orderedQty: 250,
        previouslyReceivedQty: 0,
        currentReceiveQty: 250,
        remainingQty: 0,
        unitPrice: 420,
        lineTotal: 105000,
        batchNumber: "BAT-YRN-2026-09A",
        location: "Rack A1 - Raw Cotton Pallet",
        acceptedQty: 250,
        rejectedQty: 0,
        remarks: "Direct emergency consignment",
      },
    ],
  },
];

// -------------------------------------------------------------
// DEFAULT SUPPLIER BILLS
// -------------------------------------------------------------

export const DEFAULT_SUPPLIER_BILLS: SupplierBill[] = [
  {
    id: "bil-2026-001",
    billNumber: "BIL-2026-000142",
    billDate: "2026-09-25",
    poNumber: "PO-2026-0001",
    poDate: "2026-09-22",
    mrrNumbers: ["MRR-2026-0001"],
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    supplierBillNo: "INV-BIS-2026-904",
    supplierBillDate: "2026-09-24",
    currency: "BDT",
    subtotal: 457500,
    discount: 5000,
    vat: 22625,
    otherCharges: 1500,
    adjustment: 0,
    netBillAmount: 476625,
    roundOff: 0,
    paymentStatus: "Unpaid",
    paymentDueDate: "2026-10-24",
    paidAmount: 0,
    outstandingAmount: 476625,
    approvalStatus: "Approved",
    submittedBy: "Tahmid Afsar Shapno",
    submittedDate: "2026-09-25",
    approvedBy: "Kamrul Islam",
    approvedDate: "2026-09-25",
    approvalRemarks: "Verified against MRR-2026-0001 and PO-2026-0001 unit rates.",
    remarks: "First lot billing for 5 Laptops and 1 MFP Printer.",
    attachments: [
      {
        documentType: "Supplier Invoice",
        documentName: "Vendor_Invoice_INV-BIS-2026-904.pdf",
        fileName: "Vendor_Invoice_INV-BIS-2026-904.pdf",
        description: "Original tax invoice copy submitted by vendor.",
      },
    ],
    items: [
      {
        id: "sbi-1",
        sl: 1,
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification: "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
        brand: "Dell Technologies",
        origin: "United States",
        uom: "PCS",
        mrrReceivedQty: 5,
        previouslyBilledQty: 0,
        currentBillQty: 5,
        unitPrice: 82000,
        discount: 4000,
        vatAmount: 20300,
        lineAmount: 426300,
      },
      {
        id: "sbi-2",
        sl: 2,
        itemCode: "IT-PRN-002",
        itemName: "HP LaserJet Pro MFP 4103fdw",
        specification: "Network Laser Multifunction Printer, Duplex Print/Scan, 42 ppm",
        brand: "HP",
        origin: "United States",
        uom: "PCS",
        mrrReceivedQty: 1,
        previouslyBilledQty: 0,
        currentBillQty: 1,
        unitPrice: 47500,
        discount: 1000,
        vatAmount: 2325,
        lineAmount: 48825,
      },
    ],
  },
];

// -------------------------------------------------------------
// DEFAULT SUPPLIER RETURNS
// -------------------------------------------------------------

export const DEFAULT_SUPPLIER_RETURNS: SupplierReturn[] = [
  {
    id: "ret-2026-001",
    returnNumber: "RET-2026-0001",
    returnDate: "2026-09-25",
    department: "Information Technology",
    poNumber: "PO-2026-0001",
    mrrNumber: "MRR-2026-0001",
    mrrDate: "2026-09-24",
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    storeName: "Pakiza Technovation Central IT & Hardware Depot",
    returnReason: "Defective",
    returnRemarks: "1 Laptop display panel found with dead pixel line during burn-in test.",
    totalReturnedQty: 1,
    totalReturnValue: 82000,
    status: "Approved",
    items: [
      {
        id: "reti-1",
        sl: 1,
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification: "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
        brand: "Dell Technologies",
        origin: "United States",
        uom: "PCS",
        mrrReceivedQty: 5,
        previouslyReturnedQty: 0,
        returnableQty: 5,
        currentReturnQty: 1,
        unitPrice: 82000,
        returnValue: 82000,
        batchNumber: "BAT-IT-2026-09A",
        location: "Shelf B - Laptop Storage Units",
        returnReason: "Defective",
        remarks: "Returned to vendor for immediate warranty unit replacement.",
      },
    ],
  },
];

// -------------------------------------------------------------
// DEFAULT OPENING STOCKS
// -------------------------------------------------------------

export const DEFAULT_OPENING_STOCKS: OpeningStockRecord[] = [
  {
    id: "os-2026-001",
    openingStockId: "OS-2026-0001",
    stockDate: "2026-09-01",
    warehouseStore: "WH-PKCL-01",
    storeName: "PKCL Central Raw Material Warehouse",
    organization: "Pakiza Knit Composite Ltd",
    remarks: "Initial opening stock migrated for system go-live.",
    totalItems: 2,
    totalQuantity: 6200,
    totalValue: 2184000,
    status: "Posted",
    items: [
      {
        id: "osi-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        openingQuantity: 5000,
        unitCost: 420,
        totalValue: 2100000,
        batchNumber: "BAT-YRN-2026-09A",
        manufacturingDate: "2026-08-15",
        expiryDate: "2027-08-15",
        location: "Rack A1 - Raw Cotton Pallet",
        remarks: "Opening verified count from physical warehouse ledger.",
      },
      {
        id: "osi-2",
        sl: 2,
        itemCode: "CAT-OFFICE-PAPER",
        itemName: "A4 Printing Paper 80 GSM",
        specification: "Standard 80 GSM white paper reams",
        brand: "Double A",
        origin: "Thailand",
        uom: "REAM",
        openingQuantity: 1200,
        unitCost: 70,
        totalValue: 84000,
        batchNumber: "BAT-PAP-2026-01",
        location: "Rack A1 - Raw Cotton Pallet",
        remarks: "Admin stationery opening count",
      },
    ],
  },
];

// -------------------------------------------------------------
// STORAGE KEYS & ACCESS HELPERS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  PURCHASE_ORDERS: "cripton_purchase_orders_v2",
  PO_ITEMS: "cripton_po_items_v2",
  WO_ITEMS: "cripton_wo_items_v2",
  MATERIAL_RECEIPTS: "cripton_material_receipts_v2",
  RECEIVE_LIST: "cripton_material_receive_list_v2",
  SUPPLIER_BILLS: "cripton_supplier_bills_v2",
  SUPPLIER_RETURNS: "cripton_supplier_returns_v2",
  OPENING_STOCKS: "cripton_opening_stocks_v2",
};

export function getStoredPurchaseOrders(): PurchaseOrder[] {
  return getStoredData(STORAGE_KEYS.PURCHASE_ORDERS, DEFAULT_PURCHASE_ORDERS);
}

export function setStoredPurchaseOrders(orders: PurchaseOrder[]): void {
  setStoredData(STORAGE_KEYS.PURCHASE_ORDERS, orders);
}

export function getStoredPoItems(): Record<string, POItem[]> {
  return getStoredData(STORAGE_KEYS.PO_ITEMS, DEFAULT_PO_ITEMS);
}

export function setStoredPoItems(items: Record<string, POItem[]>): void {
  setStoredData(STORAGE_KEYS.PO_ITEMS, items);
}

export function getStoredWoItems(): Record<string, WOServiceItem[]> {
  return getStoredData(STORAGE_KEYS.WO_ITEMS, DEFAULT_WO_ITEMS);
}

export function setStoredWoItems(items: Record<string, WOServiceItem[]>): void {
  setStoredData(STORAGE_KEYS.WO_ITEMS, items);
}

export function getStoredMaterialReceipts(): MaterialReceive[] {
  return getStoredData(STORAGE_KEYS.MATERIAL_RECEIPTS, DEFAULT_MATERIAL_RECEIPTS);
}

export function setStoredMaterialReceipts(receipts: MaterialReceive[]): void {
  setStoredData(STORAGE_KEYS.MATERIAL_RECEIPTS, receipts);
}

export function getStoredReceiveList(): MaterialReceiveListItem[] {
  return getStoredData(STORAGE_KEYS.RECEIVE_LIST, DEFAULT_RECEIVE_LIST);
}

export function setStoredReceiveList(list: MaterialReceiveListItem[]): void {
  setStoredData(STORAGE_KEYS.RECEIVE_LIST, list);
}

export function getStoredSupplierBills(): SupplierBill[] {
  return getStoredData(STORAGE_KEYS.SUPPLIER_BILLS, DEFAULT_SUPPLIER_BILLS);
}

export function setStoredSupplierBills(bills: SupplierBill[]): void {
  setStoredData(STORAGE_KEYS.SUPPLIER_BILLS, bills);
}

export function getStoredSupplierReturns(): SupplierReturn[] {
  return getStoredData(STORAGE_KEYS.SUPPLIER_RETURNS, DEFAULT_SUPPLIER_RETURNS);
}

export function setStoredSupplierReturns(returns: SupplierReturn[]): void {
  setStoredData(STORAGE_KEYS.SUPPLIER_RETURNS, returns);
}

export function getStoredOpeningStocks(): OpeningStockRecord[] {
  return getStoredData(STORAGE_KEYS.OPENING_STOCKS, DEFAULT_OPENING_STOCKS);
}

export function setStoredOpeningStocks(stocks: OpeningStockRecord[]): void {
  setStoredData(STORAGE_KEYS.OPENING_STOCKS, stocks);
}

// -------------------------------------------------------------
// DIRECT MRR TYPES & DATA
// -------------------------------------------------------------

export interface DirectMRRRecord {
  id: string;
  mrrNumber: string;
  directMrrNumber?: string;
  mrrDate: string;
  supplierId: string;
  supplier?: string;
  supplierName: string;
  supplierCode?: string;
  warehouseStore: string;
  warehouse?: string;
  storeName: string;
  department: string;
  challanNo: string;
  challanDate: string;
  vehicleNumber?: string;
  remarks?: string;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  status: "Approved" | "Draft" | "Pending QA";
  createdBy: string;
  createdDate: string;
  items: Array<{
    id: string;
    sl: number;
    itemCode: string;
    itemName: string;
    specification: string;
    brand: string;
    origin: string;
    uom: string;
    receiveQuantity: number;
    unitPrice: number;
    estimatedValue: number;
    batchNumber?: string;
    location?: string;
    acceptedQuantity: number;
    rejectedQuantity: number;
    remarks?: string;
  }>;
}

export const DEFAULT_DIRECT_MRRS: DirectMRRRecord[] = [
  {
    id: "dmrr-1",
    mrrNumber: "DMRR-2026-0001",
    mrrDate: "2026-09-24",
    supplierId: "sup-bengal-02",
    supplierName: "Bengal Information Systems",
    supplierCode: "SUP-002",
    warehouseStore: "WH-PKCL-01",
    storeName: "PKCL Central Raw Material Warehouse",
    department: "Information Technology",
    challanNo: "CH-BIS-8871",
    challanDate: "2026-09-24",
    vehicleNumber: "DHAKA-METRO-TA-14-9921",
    remarks: "Urgent direct spot purchase of IT equipment for immediate server migration.",
    totalItems: 2,
    totalQuantity: 502,
    totalAmount: 460000,
    status: "Approved",
    createdBy: "Tahmid Afsar Shapno",
    createdDate: "2026-09-24",
    items: [
      {
        id: "dm-1",
        sl: 1,
        itemCode: "ITM-YRN-30-1",
        itemName: "100% Combed Cotton Yarn Ne 30/1",
        specification: "100% Combed Cotton, Ne 30/1 ring spun, Auto coned",
        brand: "Groz-Beckert",
        origin: "Bangladesh",
        uom: "KG",
        receiveQuantity: 500,
        unitPrice: 420,
        estimatedValue: 210000,
        batchNumber: "BAT-YRN-2026-DIR",
        location: "Rack A1 - Raw Cotton Pallet",
        acceptedQuantity: 500,
        rejectedQuantity: 0,
        remarks: "Direct urgent delivery for production line #4",
      },
      {
        id: "dm-2",
        sl: 2,
        itemCode: "ITM-IT-LAT-5440",
        itemName: "Dell Latitude 5440 Core i7 Business Laptop",
        specification: "13th Gen Intel Core i7-1370P, 16GB DDR5, 512GB NVMe SSD, 14 FHD IPS",
        brand: "Dell Technologies",
        origin: "Malaysia",
        uom: "PCS",
        receiveQuantity: 2,
        unitPrice: 125000,
        estimatedValue: 250000,
        batchNumber: "",
        location: "Shelf B - Laptop Storage Units",
        acceptedQuantity: 2,
        rejectedQuantity: 0,
        remarks: "Replacement unit for Head Office",
      },
    ],
  },
  {
    id: "dmrr-2",
    mrrNumber: "DMRR-2026-0002",
    mrrDate: "2026-09-26",
    supplierId: "sup-global-01",
    supplierName: "Global Tech Solutions Ltd.",
    supplierCode: "SUP-001",
    warehouseStore: "WH-PKCL-02",
    storeName: "Central Engineering & Electrical Store",
    department: "Maintenance & Engineering",
    challanNo: "CH-GTS-4412",
    challanDate: "2026-09-26",
    vehicleNumber: "DHAKA-METRO-CHA-11-2041",
    remarks: "Direct store replenishment for emergency switchgear repairs.",
    totalItems: 1,
    totalQuantity: 20,
    totalAmount: 64000,
    status: "Approved",
    createdBy: "Nazmul Huda",
    createdDate: "2026-09-26",
    items: [
      {
        id: "dm-3",
        sl: 1,
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        specification: "10kA breaking capacity, IEC 60898-1 standard, Din-rail mounted",
        brand: "Schneider Electric",
        origin: "France",
        uom: "PCS",
        receiveQuantity: 20,
        unitPrice: 3200,
        estimatedValue: 64000,
        batchNumber: "BAT-SW-2026-09",
        location: "Electrical Rack B2",
        acceptedQuantity: 20,
        rejectedQuantity: 0,
        remarks: "Direct emergency delivery",
      },
    ],
  },
];

export function getStoredDirectMRRs(): DirectMRRRecord[] {
  return getStoredData("cripton_direct_mrrs_v1", DEFAULT_DIRECT_MRRS);
}

export function setStoredDirectMRRs(records: DirectMRRRecord[]): void {
  setStoredData("cripton_direct_mrrs_v1", records);
}

