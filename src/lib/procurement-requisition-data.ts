// src/lib/procurement-requisition-data.ts
// Data models, seed data, and calculation engines for Purchase Requisition & Comparative Statement

import { getStoredData, setStoredData, DEFAULT_ITEMS } from "./procurement-master-data";

export interface PRItem {
  id: string;
  sl?: number;
  itemId?: string;
  itemCode: string;
  itemName: string;
  specification?: string;
  specifications?: string;
  brand?: string;
  origin?: string;
  brandOrigin?: string;
  itemCategory?: string;
  categoryName?: string;
  uom: string;
  quantity?: number;
  requestedQuantity?: number;
  requiredQuantity?: number;
  currentStock?: number;
  estimatedUnitPrice: number;
  estimatedAmount?: number;
  totalEstimatedPrice?: number;
  preferredBrand?: string;
  preferredOrigin?: string;
  purpose?: string;
  remarks?: string;
  // Tracking links
  issueId?: string;
  prId?: string;
}

export interface PRAttachment {
  id: string;
  attachmentName?: string;
  fileName: string;
  fileSize?: string;
  description?: string;
  uploadedBy?: string;
  uploadedDate?: string;
}

export interface PRApprovalStep {
  level?: number;
  stageNumber?: number;
  stageName: string;
  approverRole?: string;
  approverName?: string;
  designation?: string;
  action?: "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected" | "Returned" | "Cancelled";
  status?: "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected" | "Returned" | "Cancelled";
  dateTime?: string;
  actionDate?: string;
  remarks?: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  prDate: string;
  company?: string;
  organization?: string;
  department: string;
  requestedBy?: string;
  requesterName?: string;
  designation?: string;
  requesterDesignation?: string;
  requiredDate?: string;
  requiredByDate?: string;
  priority: "Normal" | "Urgent" | "Critical" | "Low" | "Medium" | "High";
  purpose: string;
  itemCategory?: string;
  costCenter?: string;
  currency?: string;
  // Tagged Requisitions
  budgetRequisitions?: Array<{
    id: string;
    requisitionNumber: string;
    approvalDate?: string;
    requestedBy?: string;
    department?: string;
  }>;
  internalRequisitions?: Array<{
    id: string;
    irNumber: string;
    approvalDate?: string;
    requestedBy?: string;
    department?: string;
  }>;
  // Procurement & Delivery Info
  storeWarehouse?: string;
  warehouseId?: string;
  warehouseCode?: string;
  warehouseName?: string;
  expectedDeliveryDate?: string;
  deliveryInstructions?: string;
  requisitionType?: string;
  justification?: string;
  notes?: string;
  // Items & Budget
  items: PRItem[];
  totalItemQuantity?: number;
  totalEstimatedAmount?: number;
  totalEstimatedCost?: number;
  budgetAvailableAmount?: number;
  remainingBudget?: number;
  budgetHead?: {
    code: string;
    name: string;
    allocatedAmount: number;
    utilizedAmount: number;
    remainingAmount: number;
    budgetAvailable: boolean;
  };
  // Attachments
  attachments: (PRAttachment | any)[];
  // Approval
  taggedInternalRequisitions?: Array<{
    id: string;
    mrNumber: string;
    approvedDate?: string;
    requestedBy: string;
    department: string;
  }>;
  status: "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Rejected" | "Returned" | "Cancelled";
  currentApprovalLevel?: number;
  approvalHistory?: PRApprovalStep[];
  approvalWorkflow?: {
    stageNumber?: number;
    stageName?: string;
    approverRole?: string;
    approverName?: string;
    status: "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected" | "Returned" | "Cancelled";
    actionDate?: string;
    remarks?: string;
  }[];
  auditHistory?: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
  createdDate?: string;
  submittedDate?: string;
}

export interface InternalRequisition {
  id: string;
  irNumber: string;
  requisitionDate: string;
  approvalDate: string;
  department: string;
  requestedBy: string;
  designation?: string;
  purpose?: string;
  status: "Approved" | "Pending Approval" | "Draft" | "Rejected";
  items?: {
    id: string;
    itemCode: string;
    itemName: string;
    specification?: string;
    brand?: string;
    origin?: string;
    uom: string;
    quantity: number;
  }[];
}

export interface BudgetItem {
  id: string;
  sl?: number;
  itemId?: string;
  itemName: string;
  itemCode: string;
  category?: string;
  itemCategory?: string;
  specification?: string;
  brand?: string;
  origin?: string;
  uom: string;
  estimatedQuantity: number;
  estimatedUnitPrice?: number;
  totalEstimatedAmount?: number;
  requiredDate?: string;
  issueId?: string;
  prId?: string;
  remarks?: string;
}

export type MonthlyBudgetItem = BudgetItem;

export interface MonthlyBudgetRequisition {
  id: string;
  requisitionNumber?: string;
  requisitionId?: string;
  budgetMonth: string; // YYYY-MM e.g. "2026-10"
  company?: string;
  organization?: string;
  department: string;
  requestedBy?: string;
  designation?: string;
  storeWarehouse?: string;
  requisitionDate: string;
  priority?: "Normal" | "Urgent" | "Critical" | "Low" | "Medium" | "High";
  itemCategory?: string;
  purpose?: string;
  remarks?: string;
  items: BudgetItem[];
  totalItems?: number;
  totalEstimatedQuantity?: number;
  estimatedRequirementValue?: number;
  totalEstimatedBudget?: number;
  taggedInternalRequisitions?: Array<{
    id: string;
    mrNumber: string;
    approvedDate?: string;
    requestedBy: string;
    department: string;
  }>;
  status: "Draft" | "Submitted" | "Pending Approval" | "Approved" | "Rejected" | "Returned" | "Cancelled";
  approvalHistory?: PRApprovalStep[];
  auditHistory?: {
    action: string;
    date: string;
    user: string;
    note?: string;
  }[];
  // System Audit
  createdBy?: string;
  createdDate?: string;
  submittedBy?: string;
  submittedDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

// -------------------------------------------------------------
// COMPARATIVE STATEMENT (CS) TYPES
// -------------------------------------------------------------

export interface CSSupplierQuotation {
  supplierId: string;
  supplierCode: string;
  supplierName: string;
  quotationNo: string;
  quotationDate: string;
  submissionDate?: string;
  quotationValidity: string;
  contactPerson: string;
  contactNumber: string;
  vatTin?: string;
  technicalCompliance: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Not Applicable";
  commercialCompliance: "Compliant" | "Non-Compliant";
  remarks?: string;
}

export interface CSItemSupplierQuote {
  supplierId: string;
  unitPrice?: number | null; // undefined = blank, null = N/A
  totalPrice?: number | null;
  quotedRemarks?: string;
}

export interface CSItemComparisonRow {
  sl: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  specification: string;
  unit: string;
  requiredQty: number;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  estimatedAmount?: number;
  // Map of supplierId => quote info
  supplierQuotes: Record<string, CSItemSupplierQuote>;
  lowestUnitPrice?: number;
  lowestSupplierId?: string;
  lowestSupplierName?: string;
  priceVariance?: number;
  remarks?: string;
}

export interface CSSupplierSummaryRow {
  supplierId: string;
  supplierName: string;
  quotedAmount: number; // sum of item totals
  discount: number;
  vat: number;
  tax: number;
  otherCharges: number;
  netAmount: number; // quotedAmount - discount + vat + tax + otherCharges
}

export interface CSTechnicalEval {
  supplierId: string;
  technicalCompliance: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Not Applicable";
  specificationCompliance: "Compliant" | "Non-Compliant";
  requiredDocuments: "Compliant" | "Non-Compliant";
  deliveryRequirement: "Compliant" | "Non-Compliant";
  warrantyRequirement: "Compliant" | "Non-Compliant";
  technicalRemarks?: string;
}

export interface CSCommercialEval {
  supplierId: string;
  priceCompliance: "Compliant" | "Non-Compliant";
  paymentTerms: "Compliant" | "Non-Compliant";
  deliveryTerms: "Compliant" | "Non-Compliant";
  quotationValidity: "Compliant" | "Non-Compliant";
  vatTaxCompliance: "Compliant" | "Non-Compliant";
  commercialRemarks?: string;
}

export interface ComparativeStatement {
  id: string;
  csNumber: string; // e.g. "CS-2026-000001"
  csDate: string;
  fiscalYear?: string;
  procurementType: "Goods" | "Services" | "Works" | "Consultancy";
  procurementMethod?: "Open Tendering (OTM)" | "Request for Quotation (RFQ)" | "Direct Procurement (DPM)" | "Limited Tendering (LTM)";
  department: string;
  costCenter?: string;
  subjectDescription?: string;
  organization?: string;
  currency?: string;
  exchangeRate?: number;
  
  // Section 2: Procurement Reference (Linked PRs)
  prId?: string;
  prNumber?: string;
  prDate?: string;
  prDescription?: string;
  prRequester?: string;
  deliveryWarehouse?: string;
  requiredByDate?: string;
  prTotalEstimatedCost?: number;
  rfqTenderNo?: string;
  linkedPRs?: Array<{
    prId: string;
    prNumber: string;
    prDate: string;
    department?: string;
    requester?: string;
    totalEstimatedCost?: number;
  }>;

  // Section 3: Suppliers
  suppliers: CSSupplierQuotation[] | any[];

  // Section 4: Item-wise Comparison
  itemComparison?: CSItemComparisonRow[];
  items?: CSItemQuote[];

  // Section 5: Supplier-wise Summary
  supplierSummaries?: CSSupplierSummaryRow[];

  // Section 6: Technical & Commercial Evaluation
  technicalEvals?: Record<string, CSTechnicalEval>;
  commercialEvals?: Record<string, CSCommercialEval>;
  qualificationStatuses?: Record<string, "Qualified" | "Conditionally Qualified" | "Disqualified" | "Pending Evaluation">;
  technicalScorecards?: CSTechnicalScorecard[];

  // Section 7: Recommendation & Multiple Supplier Assignment
  recommendedSupplierId?: string;
  recommendedSupplierName?: string;
  recommendedAmount?: number;
  evaluationBasis?: "Lowest Evaluated Price" | "Technical & Commercial Compliance" | "Best Value" | "Other";
  recommendationRemarks?: string;
  committeeRecommendation?: string;
  recommendationJustification?: string;
  negotiationNotes?: string;
  originalLowestTotal?: number;
  negotiatedTotal?: number;
  estimatedSavings?: number;
  supplierAssignments?: Array<{
    supplierId: string;
    supplierName: string;
    itemIds: string[];
    totalAwardedAmount: number;
  }>;
  isMultiSupplierAwarded?: boolean;

  // Section 8: Approval Workflow
  preparedBy: string;
  checkedBy?: string;
  recommendedBy?: string;
  approvedBy?: string;
  status: "Draft" | "Submitted" | "Under Review" | "Recommended" | "Approved" | "Rejected" | "Cancelled";
  approvalDate?: string;
  approvalRemarks?: string;
  workflowTimeline?: {
    stage: string;
    role: string;
    person: string;
    date?: string;
    status: "Completed" | "Current" | "Pending" | "Rejected";
    remarks?: string;
  }[];
  approvalWorkflow?: any[];

  // Section 9: Attachments
  attachments: {
    id: string;
    documentType?: string;
    documentName?: string;
    fileName?: string;
    fileSize?: string;
    uploadedBy?: string;
    uploadDate?: string;
    uploadedAt?: string;
    remarks?: string;
  }[];
  auditHistory?: any[];

  totalEstimatedValue?: number;
}

// -------------------------------------------------------------
// DEFAULT SEED DATA
// -------------------------------------------------------------

export const DEFAULT_PURCHASE_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: "pr-2026-001",
    prNumber: "PR-2026-000001",
    prDate: "2026-09-20",
    company: "Pakiza Knit Composite Ltd",
    department: "Information Technology",
    requestedBy: "Tahmid Afsar Shapno",
    designation: "Asst. Manager",
    requiredDate: "2026-10-05",
    priority: "Urgent",
    purpose: "Procurement of high-performance laptops and multi-function laser printers for expanding CAD/ERP teams.",
    itemCategory: "IT Hardware",
    storeWarehouse: "Main IT Central Store",
    expectedDeliveryDate: "2026-10-02",
    deliveryInstructions: "Deliver directly to IT Department 3rd Floor, Annex Building with QA warranty certificates.",
    items: [
      {
        id: "pri-1",
        sl: 1,
        itemId: "item-lap-01",
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification: "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, Backlit KB, 3Y Warranty",
        brand: "Dell Technologies",
        origin: "United States",
        itemCategory: "IT Hardware",
        uom: "PCS",
        requestedQuantity: 10,
        estimatedUnitPrice: 85000,
        estimatedAmount: 850000,
        remarks: "For Senior Merchandising & ERP Developers",
      },
      {
        id: "pri-2",
        sl: 2,
        itemId: "item-print-02",
        itemCode: "IT-PRN-002",
        itemName: "HP LaserJet Pro MFP 4103fdw",
        specification: "Network Laser Multifunction Printer, Duplex Print/Scan, 42 ppm, Ethernet + Wi-Fi",
        brand: "HP",
        origin: "United States",
        itemCategory: "IT Hardware",
        uom: "PCS",
        requestedQuantity: 3,
        estimatedUnitPrice: 48000,
        estimatedAmount: 144000,
        remarks: "Store and Accounts branch floor replacement",
      },
    ],
    totalItemQuantity: 13,
    totalEstimatedAmount: 994000,
    budgetAvailableAmount: 1500000,
    remainingBudget: 506000,
    attachments: [
      {
        id: "att-1",
        attachmentName: "IT Infrastructure Q3 Expansion Proposal",
        fileName: "IT_Expansion_Q3_BudgetApproval.pdf",
        fileSize: "1.4 MB",
        description: "Approved business case justification from Head of IT",
        uploadedBy: "Tahmid Afsar Shapno",
        uploadedDate: "2026-09-20",
      },
    ],
    status: "Approved",
    currentApprovalLevel: 4,
    approvalHistory: [
      {
        level: 1,
        stageName: "Requester Submission",
        approverName: "Tahmid Afsar Shapno",
        designation: "Asst. Manager (Requester)",
        action: "Submitted",
        dateTime: "2026-09-20 10:15 AM",
        remarks: "Submitted for departmental verification.",
      },
      {
        level: 2,
        stageName: "Department Head Approval",
        approverName: "Engr. Mahmudul Hassan",
        designation: "Head of IT",
        action: "Approved",
        dateTime: "2026-09-20 02:40 PM",
        remarks: "Specs verified and within approved quarterly headcount plan.",
      },
      {
        level: 3,
        stageName: "Procurement Audit Review",
        approverName: "Kamrul Islam",
        designation: "Procurement Manager",
        action: "Approved",
        dateTime: "2026-09-21 11:30 AM",
        remarks: "Price estimates aligned with historical vendor trends.",
      },
      {
        level: 4,
        stageName: "Managing Director Final Sign-off",
        approverName: "Rafiqul Islam",
        designation: "Director",
        action: "Approved",
        dateTime: "2026-09-21 04:10 PM",
        remarks: "Approved for RFQ and Comparative Statement issuance.",
      },
    ],
    createdDate: "2026-09-20",
    submittedDate: "2026-09-20",
  },
  {
    id: "pr-2026-002",
    prNumber: "PR-2026-000002",
    prDate: "2026-09-22",
    company: "Pakiza Apparels Ltd",
    department: "Maintenance & Engineering",
    requestedBy: "Nazmul Huda",
    designation: "Store Officer",
    requiredDate: "2026-10-10",
    priority: "Normal",
    purpose: "Routine replenishment of industrial electrical switchgears and Schneider circuit breakers for substation 2.",
    itemCategory: "Electrical & Machinery",
    storeWarehouse: "Central Engineering Store",
    expectedDeliveryDate: "2026-10-08",
    deliveryInstructions: "Unload at Substation Bay 2, check OEM seal warranty before receipt.",
    items: [
      {
        id: "pri-3",
        sl: 1,
        itemId: "item-sw-01",
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        specification: "10kA breaking capacity, IEC 60898-1 standard, Din-rail mounted",
        brand: "Schneider Electric",
        origin: "France",
        itemCategory: "Electrical & Machinery",
        uom: "PCS",
        requestedQuantity: 25,
        estimatedUnitPrice: 3200,
        estimatedAmount: 80000,
        remarks: "Distribution panel upgrade",
      },
      {
        id: "pri-4",
        sl: 2,
        itemId: "item-cable-02",
        itemCode: "ENG-CBL-004",
        itemName: "BRB 4-Core 16mm² XLPE Armoured Cable",
        specification: "Copper conductor, 0.6/1kV, XLPE insulation, PVC outer sheath",
        brand: "BRB Cable",
        origin: "Bangladesh",
        itemCategory: "Electrical & Machinery",
        uom: "MTR",
        requestedQuantity: 120,
        estimatedUnitPrice: 1450,
        estimatedAmount: 174000,
        remarks: "Feeder cable run from panel to auxiliary generator",
      },
    ],
    totalItemQuantity: 145,
    totalEstimatedAmount: 254000,
    budgetAvailableAmount: 400000,
    remainingBudget: 146000,
    attachments: [],
    status: "Approved",
    currentApprovalLevel: 2,
    approvalHistory: [
      {
        level: 1,
        stageName: "Requester Submission",
        approverName: "Nazmul Huda",
        designation: "Store Officer",
        action: "Submitted",
        dateTime: "2026-09-22 09:30 AM",
        remarks: "Requisition created based on min safety stock threshold.",
      },
      {
        level: 2,
        stageName: "Maintenance Manager Review",
        approverName: "Engr. Tariqul Islam",
        designation: "DGM Maintenance",
        action: "Approved",
        dateTime: "2026-09-22 03:00 PM",
        remarks: "Verified and approved.",
      },
    ],
    createdDate: "2026-09-22",
    submittedDate: "2026-09-22",
  },
  {
    id: "pr-2026-003",
    prNumber: "PR-2026-000003",
    prDate: "2026-09-23",
    company: "Pakiza Spinning Mills Ltd",
    department: "Quality Assurance",
    requestedBy: "Sumon Ahmed",
    designation: "Executive",
    requiredDate: "2026-10-15",
    priority: "Critical",
    purpose: "Testing chemicals and calibrated glassware for yarn tensile testing laboratory.",
    itemCategory: "General Consumables",
    storeWarehouse: "Main IT Central Store",
    items: [
      {
        id: "pri-5",
        sl: 1,
        itemId: "item-chem-01",
        itemCode: "QA-CHM-05",
        itemName: "Standard Conditioning Test Reagents Grade A",
        specification: "ISO 139 standard conditioning analytical reagent, 5L carboy",
        itemCategory: "General Consumables",
        uom: "LTR",
        requestedQuantity: 15,
        estimatedUnitPrice: 4500,
        estimatedAmount: 67500,
      },
    ],
    totalItemQuantity: 15,
    totalEstimatedAmount: 67500,
    budgetAvailableAmount: 100000,
    remainingBudget: 32500,
    attachments: [],
    status: "Draft",
    currentApprovalLevel: 1,
    approvalHistory: [
      {
        level: 1,
        stageName: "Requester Draft",
        approverName: "Sumon Ahmed",
        designation: "Executive",
        action: "Draft",
        dateTime: "2026-09-23 08:20 AM",
        remarks: "Draft in progress.",
      },
    ],
    createdDate: "2026-09-23",
  },
];

export const DEFAULT_MONTHLY_BUDGET_REQUISITIONS: MonthlyBudgetRequisition[] = [
  {
    id: "mbr-1",
    requisitionId: "MBR-2026-10-001",
    budgetMonth: "2026-10",
    department: "Information Technology",
    requestedBy: "Tahmid Afsar Shapno",
    designation: "Asst. Manager",
    storeWarehouse: "Main IT Central Store",
    requisitionDate: "2026-09-21",
    priority: "Normal",
    itemCategory: "IT Hardware",
    purpose: "Estimated monthly requirement of computer peripheral spares and network patch leads for October 2026.",
    remarks: "Regular monthly forecast aligned with planned floor renovations.",
    items: [
      {
        id: "mbi-1",
        sl: 1,
        itemId: "item-cable-cat6",
        itemCode: "IT-ACC-012",
        itemName: "Schneider Cat6 Patch Cord 3 Meter Blue",
        itemCategory: "IT Hardware",
        specification: "Molded RJ45 Boots, UTP 24AWG Stranded",
        uom: "PCS",
        estimatedQuantity: 50,
        requiredDate: "2026-10-05",
        issueId: "",
        prId: "PR-2026-000001",
        remarks: "Stock replenishment",
      },
      {
        id: "mbi-2",
        sl: 2,
        itemId: "item-mouse-usb",
        itemCode: "IT-ACC-015",
        itemName: "Logitech B100 Optical USB Mouse",
        itemCategory: "IT Hardware",
        specification: "1000 DPI, Ambidextrous, USB-A",
        uom: "PCS",
        estimatedQuantity: 30,
        requiredDate: "2026-10-05",
        issueId: "ISSUE-2026-0042",
        prId: "",
        remarks: "User replacement buffer",
      },
    ],
    totalItems: 2,
    totalEstimatedQuantity: 80,
    estimatedRequirementValue: 48500,
    status: "Approved",
    approvalHistory: [
      {
        level: 1,
        stageName: "Submitted",
        approverName: "Tahmid Afsar Shapno",
        designation: "Asst. Manager",
        action: "Submitted",
        dateTime: "2026-09-21 11:00 AM",
        remarks: "Submitted for monthly department quota review.",
      },
      {
        level: 2,
        stageName: "Department Approval",
        approverName: "Engr. Mahmudul Hassan",
        designation: "Head of IT",
        action: "Approved",
        dateTime: "2026-09-22 03:15 PM",
        remarks: "Monthly budget quota verified.",
      },
    ],
    createdBy: "Tahmid Afsar Shapno",
    createdDate: "2026-09-21",
    submittedBy: "Tahmid Afsar Shapno",
    submittedDate: "2026-09-21",
  },
  {
    id: "mbr-2",
    requisitionId: "MBR-2026-11-002",
    budgetMonth: "2026-11",
    department: "Maintenance & Engineering",
    requestedBy: "Nazmul Huda",
    designation: "Store Officer",
    storeWarehouse: "Central Engineering Store",
    requisitionDate: "2026-09-23",
    priority: "Normal",
    itemCategory: "Electrical & Machinery",
    purpose: "Anticipated machinery maintenance lubricants and machine bearings for November 2026 production run.",
    items: [
      {
        id: "mbi-3",
        sl: 1,
        itemId: "item-oil-01",
        itemCode: "LUB-ISO-68",
        itemName: "Mobil DTE 26 Ultra Hydraulic Oil",
        itemCategory: "Electrical & Machinery",
        specification: "ISO VG 68, High anti-wear, 208L Steel Drum",
        uom: "DRUM",
        estimatedQuantity: 4,
        requiredDate: "2026-11-02",
        issueId: "",
        prId: "",
        remarks: "Monthly preventive maintenance cycle",
      },
    ],
    totalItems: 1,
    totalEstimatedQuantity: 4,
    estimatedRequirementValue: 240000,
    status: "Pending Approval",
    approvalHistory: [
      {
        level: 1,
        stageName: "Submitted",
        approverName: "Nazmul Huda",
        designation: "Store Officer",
        action: "Submitted",
        dateTime: "2026-09-23 10:00 AM",
        remarks: "Submitted for engineering approval.",
      },
    ],
    createdBy: "Nazmul Huda",
    createdDate: "2026-09-23",
    submittedBy: "Nazmul Huda",
    submittedDate: "2026-09-23",
  },
];

export const DEFAULT_COMPARATIVE_STATEMENTS: ComparativeStatement[] = [
  {
    id: "cs-1",
    csNumber: "CS-2026-000001",
    csDate: "2026-09-21",
    fiscalYear: "2026-2027",
    procurementType: "Goods",
    procurementMethod: "Request for Quotation (RFQ)",
    department: "Information Technology",
    costCenter: "CC-IT-001",
    subjectDescription: "Comparative Evaluation for procurement of 10x Business Laptops and 3x Network Printers against PR-2026-000001.",
    prId: "pr-2026-001",
    prNumber: "PR-2026-000001",
    prDate: "2026-09-20",
    prDescription: "Procurement of high-performance laptops and multi-function laser printers for expanding CAD/ERP teams.",
    rfqTenderNo: "RFQ-IT-2026-049",
    totalEstimatedValue: 994000,
    suppliers: [
      {
        supplierId: "sup-global-01",
        supplierCode: "SUP-001",
        supplierName: "Global Tech Solutions Ltd.",
        quotationNo: "GTS/QT/2026/889",
        quotationDate: "2026-09-21",
        submissionDate: "2026-09-21",
        quotationValidity: "30 Days (Valid until 21-Oct-2026)",
        contactPerson: "Tanvir Rahman",
        contactNumber: "01711998877",
        vatTin: "BIN-1928374655",
        technicalCompliance: "Compliant",
        commercialCompliance: "Compliant",
        remarks: "Official Dell Tier-1 Authorized Partner",
      },
      {
        supplierId: "sup-bengal-02",
        supplierCode: "SUP-002",
        supplierName: "Bengal Information Systems",
        quotationNo: "BIS-Q-26-442",
        quotationDate: "2026-09-21",
        submissionDate: "2026-09-21",
        quotationValidity: "30 Days (Valid until 21-Oct-2026)",
        contactPerson: "Arif Chowdhury",
        contactNumber: "01812334455",
        vatTin: "BIN-9988776655",
        technicalCompliance: "Compliant",
        commercialCompliance: "Compliant",
        remarks: "Free 1st-year on-site support included",
      },
      {
        supplierId: "sup-apex-03",
        supplierCode: "SUP-003",
        supplierName: "Apex Digital Systems",
        quotationNo: "ADS/2026/09/101",
        quotationDate: "2026-09-21",
        submissionDate: "2026-09-21",
        quotationValidity: "45 Days (Valid until 05-Nov-2026)",
        contactPerson: "Zahidul Karim",
        contactNumber: "01999887766",
        vatTin: "BIN-5544332211",
        technicalCompliance: "Compliant",
        commercialCompliance: "Compliant",
        remarks: "Quoted HP Laser printer with extra high-yield toner",
      },
    ],
    itemComparison: [
      {
        sl: 1,
        itemId: "item-lap-01",
        itemCode: "IT-LAP-001",
        itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
        specification: "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
        unit: "PCS",
        requiredQty: 10,
        estimatedUnitPrice: 85000,
        estimatedTotal: 850000,
        supplierQuotes: {
          "sup-global-01": { supplierId: "sup-global-01", unitPrice: 84000, totalPrice: 840000 },
          "sup-bengal-02": { supplierId: "sup-bengal-02", unitPrice: 82000, totalPrice: 820000 },
          "sup-apex-03": { supplierId: "sup-apex-03", unitPrice: 86500, totalPrice: 865000 },
        },
        lowestUnitPrice: 82000,
        lowestSupplierId: "sup-bengal-02",
        lowestSupplierName: "Bengal Information Systems",
        priceVariance: -3000, // 82000 vs 85000 est
        remarks: "Bengal Information Systems offers lowest unit rate for laptops.",
      },
      {
        sl: 2,
        itemId: "item-print-02",
        itemCode: "IT-PRN-002",
        itemName: "HP LaserJet Pro MFP 4103fdw",
        specification: "Network Laser Multifunction Printer, Duplex Print/Scan, 42 ppm",
        unit: "PCS",
        requiredQty: 3,
        estimatedUnitPrice: 48000,
        estimatedAmount: 144000,
        estimatedTotal: 144000,
        supplierQuotes: {
          "sup-global-01": { supplierId: "sup-global-01", unitPrice: 47000, totalPrice: 141000 },
          "sup-bengal-02": { supplierId: "sup-bengal-02", unitPrice: 47500, totalPrice: 142500 },
          "sup-apex-03": { supplierId: "sup-apex-03", unitPrice: 46000, totalPrice: 138000 },
        },
        lowestUnitPrice: 46000,
        lowestSupplierId: "sup-apex-03",
        lowestSupplierName: "Apex Digital Systems",
        priceVariance: -2000, // 46000 vs 48000 est
        remarks: "Apex Digital Systems offers lowest rate on printers.",
      },
    ],
    supplierSummaries: [
      {
        supplierId: "sup-global-01",
        supplierName: "Global Tech Solutions Ltd.",
        quotedAmount: 981000,
        discount: 20000,
        vat: 48050,
        tax: 0,
        otherCharges: 3000,
        netAmount: 1012050,
      },
      {
        supplierId: "sup-bengal-02",
        supplierName: "Bengal Information Systems",
        quotedAmount: 962500,
        discount: 15000,
        vat: 47375,
        tax: 0,
        otherCharges: 2500,
        netAmount: 997375,
      },
      {
        supplierId: "sup-apex-03",
        supplierName: "Apex Digital Systems",
        quotedAmount: 1003000,
        discount: 25000,
        vat: 48900,
        tax: 0,
        otherCharges: 4000,
        netAmount: 1030900,
      },
    ],
    technicalEvals: {
      "sup-global-01": {
        supplierId: "sup-global-01",
        technicalCompliance: "Compliant",
        specificationCompliance: "Compliant",
        requiredDocuments: "Compliant",
        deliveryRequirement: "Compliant",
        warrantyRequirement: "Compliant",
        technicalRemarks: "All specs matching RFP requirements.",
      },
      "sup-bengal-02": {
        supplierId: "sup-bengal-02",
        technicalCompliance: "Compliant",
        specificationCompliance: "Compliant",
        requiredDocuments: "Compliant",
        deliveryRequirement: "Compliant",
        warrantyRequirement: "Compliant",
        technicalRemarks: "OEM certificate attached and verified.",
      },
      "sup-apex-03": {
        supplierId: "sup-apex-03",
        technicalCompliance: "Compliant",
        specificationCompliance: "Compliant",
        requiredDocuments: "Compliant",
        deliveryRequirement: "Compliant",
        warrantyRequirement: "Compliant",
        technicalRemarks: "Compliant specs with additional toner supply.",
      },
    },
    commercialEvals: {
      "sup-global-01": {
        supplierId: "sup-global-01",
        priceCompliance: "Compliant",
        paymentTerms: "Compliant",
        deliveryTerms: "Compliant",
        quotationValidity: "Compliant",
        vatTaxCompliance: "Compliant",
      },
      "sup-bengal-02": {
        supplierId: "sup-bengal-02",
        priceCompliance: "Compliant",
        paymentTerms: "Compliant",
        deliveryTerms: "Compliant",
        quotationValidity: "Compliant",
        vatTaxCompliance: "Compliant",
      },
      "sup-apex-03": {
        supplierId: "sup-apex-03",
        priceCompliance: "Compliant",
        paymentTerms: "Compliant",
        deliveryTerms: "Compliant",
        quotationValidity: "Compliant",
        vatTaxCompliance: "Compliant",
      },
    },
    qualificationStatuses: {
      "sup-global-01": "Qualified",
      "sup-bengal-02": "Qualified",
      "sup-apex-03": "Qualified",
    },
    recommendedSupplierId: "sup-bengal-02",
    recommendedSupplierName: "Bengal Information Systems",
    recommendedAmount: 997375,
    evaluationBasis: "Lowest Evaluated Price",
    recommendationRemarks: "Bengal Information Systems offered the lowest total evaluated net amount of BDT 997,375 with 3-year full OEM manufacturer warranty and immediate stock availability.",
    committeeRecommendation: "The committee unanimously recommends awarding the procurement to Bengal Information Systems as responsive lowest evaluated bidder.",
    preparedBy: "Tahmid Afsar Shapno",
    checkedBy: "Kamrul Islam",
    recommendedBy: "Committee Chair - Engr. Mahmudul Hassan",
    approvedBy: "Rafiqul Islam (Director)",
    status: "Approved",
    approvalDate: "2026-09-22",
    approvalRemarks: "Approved as recommended by procurement committee. Proceed to PO issuance.",
    workflowTimeline: [
      { stage: "Prepared", role: "Procurement Officer", person: "Tahmid Afsar Shapno", date: "2026-09-21 11:30 AM", status: "Completed", remarks: "Quotations tabulated and verified." },
      { stage: "Reviewed", role: "Procurement Manager", person: "Kamrul Islam", date: "2026-09-21 03:00 PM", status: "Completed", remarks: "TIN/VAT and pricing variance checked." },
      { stage: "Recommended", role: "Evaluation Committee", person: "Engr. Mahmudul Hassan", date: "2026-09-22 10:15 AM", status: "Completed", remarks: "Lowest compliant bidder recommended." },
      { stage: "Final Approval", role: "Director", person: "Rafiqul Islam", date: "2026-09-22 04:45 PM", status: "Completed", remarks: "Approved for contract." },
    ],
    attachments: [
      {
        id: "cs-att-1",
        documentType: "Supplier Quotations Compilation",
        documentName: "All_3_Vendor_Quotations_Combined.pdf",
        uploadedBy: "Tahmid Afsar Shapno",
        uploadDate: "2026-09-21",
        remarks: "Original signed physical quotation copies.",
      },
      {
        id: "cs-att-2",
        documentType: "Tender Committee Meeting Minutes",
        documentName: "Tender_Committee_Signed_Resolution_21Sep.pdf",
        uploadedBy: "Kamrul Islam",
        uploadDate: "2026-09-22",
        remarks: "Formal committee review signatures.",
      },
    ],
  },
  {
    id: "cs-2",
    csNumber: "CS-2026-000002",
    csDate: "2026-09-23",
    fiscalYear: "2026-2027",
    procurementType: "Goods",
    procurementMethod: "Request for Quotation (RFQ)",
    department: "Maintenance & Engineering",
    costCenter: "CC-ENG-002",
    subjectDescription: "Comparative Statement for 63A Circuit Breakers and 16mm² XLPE Cables against PR-2026-000002.",
    prId: "pr-2026-002",
    prNumber: "PR-2026-000002",
    prDate: "2026-09-22",
    prDescription: "Routine replenishment of industrial electrical switchgears and Schneider circuit breakers for substation 2.",
    rfqTenderNo: "RFQ-ENG-2026-118",
    totalEstimatedValue: 254000,
    suppliers: [
      {
        supplierId: "sup-bengal-electric",
        supplierCode: "SUP-014",
        supplierName: "Bengal Electric & Engineering",
        quotationNo: "BEE-2026-Q901",
        quotationDate: "2026-09-23",
        submissionDate: "2026-09-23",
        quotationValidity: "30 Days",
        contactPerson: "Mominul Haque",
        contactNumber: "01722883344",
        vatTin: "BIN-8833992211",
        technicalCompliance: "Compliant",
        commercialCompliance: "Compliant",
      },
      {
        supplierId: "sup-eastern-switch",
        supplierCode: "SUP-019",
        supplierName: "Eastern Switchgear & Cable Co.",
        quotationNo: "ESC/RFQ/998",
        quotationDate: "2026-09-23",
        submissionDate: "2026-09-23",
        quotationValidity: "30 Days",
        contactPerson: "Rezaul Karim",
        contactNumber: "01811776655",
        vatTin: "BIN-4422118899",
        technicalCompliance: "Compliant",
        commercialCompliance: "Compliant",
      },
    ],
    itemComparison: [
      {
        sl: 1,
        itemId: "item-sw-01",
        itemCode: "ENG-SW-101",
        itemName: "Schneider 63A 4-Pole MCB C-Curve",
        specification: "10kA breaking capacity, IEC 60898-1 standard, Din-rail mounted",
        unit: "PCS",
        requiredQty: 25,
        estimatedUnitPrice: 3200,
        estimatedTotal: 80000,
        supplierQuotes: {
          "sup-bengal-electric": { supplierId: "sup-bengal-electric", unitPrice: 3100, totalPrice: 77500 },
          "sup-eastern-switch": { supplierId: "sup-eastern-switch", unitPrice: 3050, totalPrice: 76250 },
        },
        lowestUnitPrice: 3050,
        lowestSupplierId: "sup-eastern-switch",
        lowestSupplierName: "Eastern Switchgear & Cable Co.",
        priceVariance: -150,
      },
      {
        sl: 2,
        itemId: "item-cable-02",
        itemCode: "ENG-CBL-004",
        itemName: "BRB 4-Core 16mm² XLPE Armoured Cable",
        specification: "Copper conductor, 0.6/1kV, XLPE insulation, PVC outer sheath",
        unit: "MTR",
        requiredQty: 120,
        estimatedUnitPrice: 1450,
        estimatedTotal: 174000,
        supplierQuotes: {
          "sup-bengal-electric": { supplierId: "sup-bengal-electric", unitPrice: 1420, totalPrice: 170400 },
          "sup-eastern-switch": { supplierId: "sup-eastern-switch", unitPrice: 1440, totalPrice: 172800 },
        },
        lowestUnitPrice: 1420,
        lowestSupplierId: "sup-bengal-electric",
        lowestSupplierName: "Bengal Electric & Engineering",
        priceVariance: -30,
      },
    ],
    supplierSummaries: [
      {
        supplierId: "sup-bengal-electric",
        supplierName: "Bengal Electric & Engineering",
        quotedAmount: 247900,
        discount: 5000,
        vat: 12145,
        tax: 0,
        otherCharges: 1000,
        netAmount: 256045,
      },
      {
        supplierId: "sup-eastern-switch",
        supplierName: "Eastern Switchgear & Cable Co.",
        quotedAmount: 249050,
        discount: 6000,
        vat: 12152,
        tax: 0,
        otherCharges: 1200,
        netAmount: 256402,
      },
    ],
    technicalEvals: {
      "sup-bengal-electric": {
        supplierId: "sup-bengal-electric",
        technicalCompliance: "Compliant",
        specificationCompliance: "Compliant",
        requiredDocuments: "Compliant",
        deliveryRequirement: "Compliant",
        warrantyRequirement: "Compliant",
      },
      "sup-eastern-switch": {
        supplierId: "sup-eastern-switch",
        technicalCompliance: "Compliant",
        specificationCompliance: "Compliant",
        requiredDocuments: "Compliant",
        deliveryRequirement: "Compliant",
        warrantyRequirement: "Compliant",
      },
    },
    commercialEvals: {
      "sup-bengal-electric": {
        supplierId: "sup-bengal-electric",
        priceCompliance: "Compliant",
        paymentTerms: "Compliant",
        deliveryTerms: "Compliant",
        quotationValidity: "Compliant",
        vatTaxCompliance: "Compliant",
      },
      "sup-eastern-switch": {
        supplierId: "sup-eastern-switch",
        priceCompliance: "Compliant",
        paymentTerms: "Compliant",
        deliveryTerms: "Compliant",
        quotationValidity: "Compliant",
        vatTaxCompliance: "Compliant",
      },
    },
    qualificationStatuses: {
      "sup-bengal-electric": "Qualified",
      "sup-eastern-switch": "Qualified",
    },
    recommendedSupplierId: "sup-bengal-electric",
    recommendedSupplierName: "Bengal Electric & Engineering",
    recommendedAmount: 256045,
    evaluationBasis: "Lowest Evaluated Price",
    recommendationRemarks: "Bengal Electric is evaluated lowest net price.",
    preparedBy: "Nazmul Huda",
    checkedBy: "Kamrul Islam",
    approvedBy: "Rafiqul Islam (Director)",
    status: "Approved",
    approvalDate: "2026-09-24",
    approvalRemarks: "Approved as recommended by procurement committee. Proceed to PO issuance.",
    workflowTimeline: [
      { stage: "Prepared", role: "Store Officer", person: "Nazmul Huda", date: "2026-09-23 10:15 AM", status: "Completed" },
      { stage: "Under Review", role: "Procurement Manager", person: "Kamrul Islam", date: "2026-09-23 11:45 AM", status: "Completed" },
      { stage: "Recommendation", role: "Committee", person: "Engr. Tariqul Islam", date: "2026-09-23 03:00 PM", status: "Completed" },
      { stage: "Approval", role: "Director", person: "Rafiqul Islam", date: "2026-09-24 10:30 AM", status: "Completed", remarks: "Approved." },
    ],
    attachments: [],
  },
  {
    id: "cs-3",
    csNumber: "CS-2026-000003",
    csDate: "2026-09-23",
    fiscalYear: "2026-2027",
    procurementType: "Goods",
    procurementMethod: "Direct Procurement (DPM)",
    department: "Quality Assurance",
    subjectDescription: "Draft Comparative Statement for specialized conditioning test reagents.",
    prId: "pr-2026-003",
    prNumber: "PR-2026-000003",
    prDate: "2026-09-23",
    prDescription: "Testing chemicals and calibrated glassware for yarn tensile testing laboratory.",
    totalEstimatedValue: 67500,
    suppliers: [],
    itemComparison: [],
    supplierSummaries: [],
    technicalEvals: {},
    commercialEvals: {},
    qualificationStatuses: {},
    preparedBy: "Sumon Ahmed",
    status: "Draft",
    workflowTimeline: [
      { stage: "Draft", role: "Executive", person: "Sumon Ahmed", date: "2026-09-23 11:00 AM", status: "Current" },
    ],
    attachments: [],
  },
];

// -------------------------------------------------------------
// DEFAULT INTERNAL REQUISITIONS SEED DATA
// -------------------------------------------------------------

export const DEFAULT_INTERNAL_REQUISITIONS: InternalRequisition[] = [
  {
    id: "ir-101",
    irNumber: "IR-2026-000101",
    requisitionDate: "2026-09-18",
    approvalDate: "2026-09-19",
    department: "Production (Knitting)",
    requestedBy: "Nazrul Islam",
    designation: "Production Supervisor",
    purpose: "Knitting machine needle replacements and oil seal kits for Unit 2 floor.",
    status: "Approved",
    items: [
      {
        id: "iri-1",
        itemCode: "MC-SP-042",
        itemName: "Groz-Beckert Knitting Needles Vo-Spec 71.75",
        specification: "Chrome-plated high precision needle",
        brand: "Groz-Beckert",
        origin: "Germany",
        uom: "BOX",
        quantity: 10,
      },
    ],
  },
  {
    id: "ir-102",
    irNumber: "IR-2026-000102",
    requisitionDate: "2026-09-20",
    approvalDate: "2026-09-21",
    department: "Maintenance & Engineering",
    requestedBy: "Kamrul Hasan",
    designation: "Sr. Maintenance Engineer",
    purpose: "Emergency pneumatic valve and solenoid coil replacements for compressor line.",
    status: "Approved",
    items: [
      {
        id: "iri-2",
        itemCode: "ENG-VAL-09",
        itemName: "Festo Solenoid Valve 5/2 Way 24VDC",
        specification: "G 1/4 port size, IP65 coil enclosure",
        brand: "Festo",
        origin: "Germany",
        uom: "PCS",
        quantity: 4,
      },
    ],
  },
  {
    id: "ir-103",
    irNumber: "IR-2026-000103",
    requisitionDate: "2026-09-22",
    approvalDate: "2026-09-23",
    department: "Information Technology",
    requestedBy: "Md. Tanvir Hossain",
    designation: "Network Administrator",
    purpose: "Fiber optic transceivers and CAT6 patch panels for server room rack 3 expansion.",
    status: "Approved",
    items: [
      {
        id: "iri-3",
        itemCode: "IT-SFP-10G",
        itemName: "Cisco 10GBASE-SR SFP+ Transceiver Module",
        specification: "850nm MMF up to 300m reach LC connector",
        brand: "Cisco",
        origin: "USA",
        uom: "PCS",
        quantity: 8,
      },
    ],
  },
  {
    id: "ir-104",
    irNumber: "IR-2026-000104",
    requisitionDate: "2026-09-23",
    approvalDate: "2026-09-24",
    department: "Quality Assurance",
    requestedBy: "Sultana Razia",
    designation: "Lab In-Charge",
    purpose: "Spectrophotometer calibration standard tiles and colorimeter reagents.",
    status: "Approved",
    items: [
      {
        id: "iri-4",
        itemCode: "QA-CAL-02",
        itemName: "X-Rite Calibration Tile Set Grade AA",
        specification: "Ceramic reference standard with NPL traceability certificate",
        brand: "X-Rite",
        origin: "USA",
        uom: "SET",
        quantity: 1,
      },
    ],
  },
];

export function getStoredInternalRequisitions(): InternalRequisition[] {
  return getStoredData("proc_internal_requisitions_v2", DEFAULT_INTERNAL_REQUISITIONS);
}

export function setStoredInternalRequisitions(records: InternalRequisition[]) {
  setStoredData("proc_internal_requisitions_v2", records);
}

// -------------------------------------------------------------
// STORAGE HELPERS WITH AUTO-NORMALIZATION
// -------------------------------------------------------------

export function getStoredPurchaseRequisitions(): PurchaseRequisition[] {
  const records = getStoredData("proc_purchase_requisitions_v2", DEFAULT_PURCHASE_REQUISITIONS);
  return (records || []).map((p) => {
    const cost = p.totalEstimatedCost ?? p.totalEstimatedAmount ?? 0;
    return {
      ...p,
      organization: p.organization || p.company || "Pakiza Knit Composite Ltd",
      company: p.company || p.organization || "Pakiza Knit Composite Ltd",
      requesterName: p.requesterName || p.requestedBy || "Tahmid Afsar Shapno",
      requestedBy: p.requestedBy || p.requesterName || "Tahmid Afsar Shapno",
      requesterDesignation: p.requesterDesignation || p.designation || "Executive",
      designation: p.designation || p.requesterDesignation || "Executive",
      requiredByDate: p.requiredByDate || p.requiredDate || "2026-10-15",
      requiredDate: p.requiredDate || p.requiredByDate || "2026-10-15",
      warehouseName: p.warehouseName || p.storeWarehouse || "Central Warehouse",
      storeWarehouse: p.storeWarehouse || p.warehouseName || "Central Warehouse",
      totalEstimatedCost: cost,
      totalEstimatedAmount: cost,
      currency: p.currency || "BDT",
      requisitionType: p.requisitionType || "Budgeted",
      budgetRequisitions: p.budgetRequisitions || [],
      internalRequisitions: p.internalRequisitions || [],
      items: (p.items || []).map((i) => ({
        ...i,
        brand: i.brand || (i as any).preferredBrand || "Standard OEM",
        origin: i.origin || (i as any).preferredOrigin || "Imported",
        specification: i.specification || (i as any).specifications || "",
        requiredQuantity: i.requiredQuantity ?? i.requestedQuantity ?? 1,
        requestedQuantity: i.requestedQuantity ?? i.requiredQuantity ?? 1,
        totalEstimatedPrice: i.totalEstimatedPrice ?? i.estimatedAmount ?? ((i.requiredQuantity || 1) * (i.estimatedUnitPrice || 0)),
        estimatedAmount: i.estimatedAmount ?? i.totalEstimatedPrice ?? ((i.requiredQuantity || 1) * (i.estimatedUnitPrice || 0)),
        currentStock: i.currentStock ?? 10,
      })),
      budgetHead: p.budgetHead || {
        code: "OPEX-2026",
        name: "Operational Requisition Budget",
        allocatedAmount: Math.max(cost * 1.5, 500000),
        utilizedAmount: 0,
        remainingAmount: Math.max(cost * 1.5, 500000),
        budgetAvailable: true,
      },
      approvalWorkflow: (p.approvalWorkflow && p.approvalWorkflow.length > 0)
        ? p.approvalWorkflow
        : (p.approvalHistory || []).map((h, idx) => ({
            stageNumber: h.level || idx + 1,
            stageName: h.stageName,
            approverRole: h.designation || "Approver",
            approverName: h.approverName,
            status: (h.action === "Approved" ? "Approved" : h.action === "Submitted" ? "Approved" : "Pending") as any,
            actionDate: h.dateTime?.split(" ")[0],
            remarks: h.remarks,
          })),
      auditHistory: (p.auditHistory && p.auditHistory.length > 0)
        ? p.auditHistory
        : [
            {
              action: "Requisition Created",
              date: p.prDate,
              user: p.requesterName || p.requestedBy || "User",
            },
          ],
    };
  });
}

export function setStoredPurchaseRequisitions(records: PurchaseRequisition[]) {
  setStoredData("proc_purchase_requisitions_v2", records);
}

export function getStoredMonthlyBudgetRequisitions(): MonthlyBudgetRequisition[] {
  const records = getStoredData("proc_monthly_budget_requisitions_v2", DEFAULT_MONTHLY_BUDGET_REQUISITIONS);
  return (records || []).map((r) => {
    const budgetVal = r.totalEstimatedBudget ?? r.estimatedRequirementValue ?? 0;
    return {
      ...r,
      requisitionNumber: r.requisitionNumber || r.requisitionId || `MBR-${r.id}`,
      requisitionId: r.requisitionId || r.requisitionNumber || `MBR-${r.id}`,
      organization: r.organization || r.company || "Pakiza Knit Composite Ltd",
      company: r.company || r.organization || "Pakiza Knit Composite Ltd",
      requestedBy: r.requestedBy || (r as any).createdBy || "Tahmid Afsar Shapno",
      totalEstimatedBudget: budgetVal,
      estimatedRequirementValue: budgetVal,
      items: (r.items || []).map((i) => ({
        ...i,
        brand: i.brand || "Standard OEM",
        origin: i.origin || "Imported",
        specification: i.specification || "",
        category: i.category || i.itemCategory || "General",
        totalEstimatedAmount: i.totalEstimatedAmount || ((i.estimatedQuantity || 1) * (i.estimatedUnitPrice || 0)),
      })),
      auditHistory: (r.auditHistory && r.auditHistory.length > 0)
        ? r.auditHistory
        : [
            {
              action: "Budget Requisition Created",
              date: r.requisitionDate,
              user: r.requestedBy || "User",
            },
          ],
    };
  });
}

export function setStoredMonthlyBudgetRequisitions(records: MonthlyBudgetRequisition[]) {
  setStoredData("proc_monthly_budget_requisitions_v2", records);
}

export function getStoredComparativeStatements(): ComparativeStatement[] {
  const records = getStoredData("proc_comparative_statements_v2", DEFAULT_COMPARATIVE_STATEMENTS);
  return (records || []).map((cs) => {
    const suppliers = (cs.suppliers || []).map((s: any, idx: number) => ({
      supplierId: s.supplierId,
      supplierName: s.supplierName,
      supplierCode: s.supplierCode || `VEN-${idx + 1}`,
      quotationRef: s.quotationRef || s.quotationNo || `QT-${idx + 1}`,
      quotationDate: s.quotationDate || cs.csDate,
      validityDate: s.validityDate || "2026-11-01",
      paymentTerms: s.paymentTerms || "30 Days Credit",
      deliveryTerms: s.deliveryTerms || "Ex-Factory",
      deliveryLeadDays: s.deliveryLeadDays || 14,
      warranty: s.warranty || "1 Year Standard",
      grossAmount: s.grossAmount || 0,
      discountAmount: s.discountAmount || 0,
      netQuotedAmount: s.netQuotedAmount || s.grossAmount || 0,
      vatPercentage: s.vatPercentage ?? 5,
      vatAmount: s.vatAmount || 0,
      taxPercentage: s.taxPercentage ?? 0,
      taxAmount: s.taxAmount || 0,
      otherCharges: s.otherCharges || 0,
      finalPayableAmount: s.finalPayableAmount || s.netAmount || 0,
      rank: s.rank || idx + 1,
    }));

    const items: CSItemQuote[] = (cs.items && cs.items.length > 0)
      ? cs.items.map((it: any) => ({
          ...it,
          prNumber: it.prNumber || cs.prNumber || "PR-2026-000001",
          prId: it.prId || cs.prId || "pr-2026-001",
          brand: it.brand || "OEM",
          origin: it.origin || "International",
          specification: it.specification || "",
          assignedSupplierId: it.assignedSupplierId || cs.recommendedSupplierId || suppliers[0]?.supplierId,
          assignedSupplierName: it.assignedSupplierName || cs.recommendedSupplierName || suppliers[0]?.supplierName,
        }))
      : (cs.itemComparison || []).map((ic, idx) => {
          const quotes: Record<string, any> = {};
          for (const sId of Object.keys(ic.supplierQuotes || {})) {
            const sq = ic.supplierQuotes[sId];
            quotes[sId] = {
              unitPrice: sq.unitPrice,
              totalPrice: sq.totalPrice || (sq.unitPrice ? sq.unitPrice * ic.requiredQty : 0),
              deliveryDays: 14,
              compliance: "Compliant",
              remarks: "Fully compliant",
            };
          }
          return {
            id: `item-${idx + 1}`,
            prItemId: ic.itemId || `pri-${idx + 1}`,
            itemCode: ic.itemCode,
            itemName: ic.itemName,
            specification: ic.specification || "",
            brand: "OEM",
            origin: "International",
            uom: ic.unit || "Pcs",
            quantity: ic.requiredQty,
            estimatedUnitPrice: ic.estimatedUnitPrice,
            estimatedTotalPrice: ic.estimatedTotal,
            prNumber: cs.prNumber || "PR-2026-000001",
            prId: cs.prId || "pr-2026-001",
            assignedSupplierId: cs.recommendedSupplierId || suppliers[0]?.supplierId,
            assignedSupplierName: cs.recommendedSupplierName || suppliers[0]?.supplierName,
            quotes,
          };
        });

    const technicalScorecards = (cs.technicalScorecards && cs.technicalScorecards.length > 0)
      ? cs.technicalScorecards
      : suppliers.map((s) => ({
          supplierId: s.supplierId,
          supplierName: s.supplierName,
          specsCompliance: "Pass" as const,
          deliveryCapabilityScore: 90,
          warrantyScore: 85,
          pastPerformanceRating: 4.5,
          overallScore: 88,
          qualificationStatus: "Qualified" as const,
          evaluatorRemarks: "Technically compliant and verified",
        }));

    const estCost = cs.prTotalEstimatedCost ?? cs.totalEstimatedValue ?? 0;
    const lowestTotal = cs.originalLowestTotal || (suppliers[0]?.finalPayableAmount || 0);

    // Initial linkedPRs fallback if not yet set
    const linkedPRs = (cs.linkedPRs && cs.linkedPRs.length > 0)
      ? cs.linkedPRs
      : cs.prNumber
        ? [
            {
              prId: cs.prId || "pr-2026-001",
              prNumber: cs.prNumber || "PR-2026-000001",
              prDate: cs.prDate || "2026-09-20",
              department: cs.department || "Information Technology",
              requester: cs.prRequester || "Tahmid Afsar Shapno",
              totalEstimatedCost: estCost,
            },
          ]
        : [];

    return {
      ...cs,
      organization: cs.organization || "Pakiza Knit Composite Ltd",
      currency: cs.currency || "BDT",
      exchangeRate: cs.exchangeRate || 1.0,
      prTotalEstimatedCost: estCost,
      totalEstimatedValue: estCost,
      linkedPRs,
      recommendedSupplierId: cs.recommendedSupplierId || suppliers[0]?.supplierId || "",
      recommendedSupplierName: cs.recommendedSupplierName || suppliers[0]?.supplierName || "Pending",
      recommendationJustification: cs.recommendationJustification || "Lowest responsive evaluated bidder.",
      negotiationNotes: cs.negotiationNotes || "",
      originalLowestTotal: lowestTotal,
      negotiatedTotal: cs.negotiatedTotal || lowestTotal,
      estimatedSavings: cs.estimatedSavings || Math.max(0, estCost - (cs.negotiatedTotal || lowestTotal)),
      suppliers,
      items,
      technicalScorecards,
      approvalWorkflow: cs.approvalWorkflow || [
        {
          stageNumber: 1,
          stageName: "Procurement Officer",
          role: "Procurement Specialist",
          status: cs.status === "Approved" ? "Approved" : "Pending",
          assignedTo: cs.preparedBy,
        },
      ],
      auditHistory: cs.auditHistory || [
        {
          action: "CS Created",
          date: cs.csDate,
          user: cs.preparedBy,
        },
      ],
    };
  });
}

export function setStoredComparativeStatements(records: ComparativeStatement[]) {
  setStoredData("proc_comparative_statements_v2", records);
}

// -------------------------------------------------------------
// STRICT PRICE MIN ENGINE (Requirement 22: Blank vs N/A vs 0)
// -------------------------------------------------------------

export function computeLowestPrice(
  quotes: Record<string, any>,
  suppliersOrIds: (string | { supplierId: string })[]
): number | null {
  let min: number | null = null;
  const supplierIds = (suppliersOrIds || []).map((s) => (typeof s === "string" ? s : s.supplierId));

  for (const id of supplierIds) {
    const q = quotes?.[id];
    if (!q) continue;

    // Strict Blank vs N/A vs 0 logic
    // Blank (undefined or null) -> not quoted, skip
    // "NA" or "N/A" -> supplier declined/unavailable, skip
    // 0 -> explicitly valid 0 price
    const price = q.unitPrice;
    if (price === undefined || price === null || price === "NA" || price === "N/A") {
      continue;
    }
    const num = Number(price);
    if (!isNaN(num) && num >= 0) {
      if (min === null || num < min) {
        min = num;
      }
    }
  }
  return min;
}

// -------------------------------------------------------------
// COMPARATIVE STATEMENT CALCULATION & INTERFACE EXPORTS
// -------------------------------------------------------------

export interface CSSupplierQuote {
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  quotationRef: string;
  quotationDate: string;
  validityDate: string;
  paymentTerms: string;
  deliveryTerms: string;
  deliveryLeadDays: number;
  warranty: string;
  grossAmount: number;
  discountAmount: number;
  netQuotedAmount: number;
  vatPercentage: number;
  vatAmount: number;
  taxPercentage: number;
  taxAmount: number;
  otherCharges: number;
  finalPayableAmount: number;
  rank: number;
}

export interface CSItemQuote {
  id: string;
  prItemId: string;
  itemCode: string;
  itemName: string;
  specification?: string;
  brand?: string;
  origin?: string;
  uom: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  targetPrice?: number;
  estimatedPrice?: number;
  prId?: string;
  prNumber?: string;
  assignedSupplierId?: string;
  assignedSupplierName?: string;
  quotes: Record<
    string,
    {
      unitPrice: number | null | "NA";
      totalPrice: number;
      deliveryDays?: number;
      compliance: "Compliant" | "Partial" | "Non-Compliant";
      remarks?: string;
    }
  >;
}

export interface CSTechnicalScorecard {
  supplierId: string;
  supplierName: string;
  specsCompliance: "Pass" | "Conditional" | "Fail";
  deliveryCapabilityScore: number;
  warrantyScore: number;
  pastPerformanceRating: number;
  overallScore: number;
  qualificationStatus: "Qualified" | "Conditionally Qualified" | "Disqualified" | "Pending Evaluation";
  evaluatorRemarks: string;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function calculateSupplierSummary(
  supplierId: string,
  items: CSItemQuote[],
  supplierInfo: {
    discountAmount?: number;
    vatPercentage?: number;
    taxPercentage?: number;
    otherCharges?: number;
  }
) {
  let grossAmount = 0;
  for (const item of (items || [])) {
    const q = item.quotes?.[supplierId];
    if (q && typeof q.unitPrice === "number") {
      grossAmount += q.unitPrice * (item.quantity || 1);
    }
  }

  const discountAmount = Number(supplierInfo.discountAmount) || 0;
  const netQuotedAmount = Math.max(0, grossAmount - discountAmount);
  const vatPercentage = Number(supplierInfo.vatPercentage) || 0;
  const vatAmount = (netQuotedAmount * vatPercentage) / 100;
  const taxPercentage = Number(supplierInfo.taxPercentage) || 0;
  const taxAmount = (netQuotedAmount * taxPercentage) / 100;
  const otherCharges = Number(supplierInfo.otherCharges) || 0;
  const finalPayableAmount = netQuotedAmount + vatAmount + taxAmount + otherCharges;

  return {
    grossAmount,
    discountAmount,
    netQuotedAmount,
    vatAmount,
    taxAmount,
    otherCharges,
    finalPayableAmount,
  };
}
