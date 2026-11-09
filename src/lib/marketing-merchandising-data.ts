// ============================================================================
// Marketing & Merchandising Module — Core Data Layer & Business Logic
// Isolated from existing Merchandising, Procurement, and Inventory modules
// ============================================================================

export type GarmentBusinessType = "Woven" | "Knit";

export type ApprovalStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Cancelled";
export type OrderStatus = "Draft" | "Open" | "In Production" | "Completed" | "Closed" | "Cancelled";
export type BookingStatus = "Draft" | "Pending" | "Pending Approval" | "Approved" | "Rejected" | "Returned" | "Amended";

export interface MMBookingApprovalHistoryItem {
  id: string;
  bookingId: string;
  bookingNo: string;
  action: "Submitted" | "Approved" | "Rejected" | "Returned";
  previousStatus: string;
  newStatus: string;
  performedBy: string;
  timestamp: string;
  comment?: string;
}
export type PIStatus = "Draft" | "Pending Approval" | "Approved" | "Passed" | "Rejected" | "Returned";

// ----------------------------------------------------------------------------
// 1. Company Policy & Configuration Model
// ----------------------------------------------------------------------------
export interface MMCompanyPolicy {
  quotationApprovalRequired: boolean;
  preCostingApprovalRequired: boolean;
  postApprovalPreCostingRestrictions: "StrictLock" | "AllowAmendmentWithReapproval" | "Flexible";
  fabricBookingApprovalRequired: boolean;
  accessoriesBookingApprovalRequired: boolean;
  savingTargetPercentage: number; // default 2%
  // Booking price exceeding Pre-Costing amount policy:
  bookingPriceExceedsPreCosting: {
    showAlert: boolean;
    requireReason: boolean;
    requireSpecialApproval: boolean;
  };
  // Saving target exception (< 2% or target) policy:
  savingTargetException: {
    showAlert: boolean;
    requireReason: boolean;
    requireSpecialApproval: boolean;
  };
  itemWastageRule: "CategoryDefault" | "ItemSpecific" | "Tiered";
  countryBreakdownRequired: boolean;
  fobEditAuthorizedRoles: string[];
  bomEditAuthorizedRoles: string[];
  orderClosureAuthorizedRoles: string[];
  bookingAmendmentApprovalRequired: boolean;
  approvalRoles: {
    roleName: string;
    approvalLimitUsd: number;
    sequence: number;
  }[];
}

export interface MMPolicyAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  policyKey: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

// ----------------------------------------------------------------------------
// 2. Buyer Quotation Model
// ----------------------------------------------------------------------------
export interface MMQuotationColorSize {
  color: string;
  size: string;
  quantity: number;
}

export interface MMBuyerQuotation {
  id: string;
  quotationNo: string;
  companyName: string;
  businessUnit: string;
  buyerName: string;
  buyerDepartment: string;
  localAgent: string;
  garmentType: GarmentBusinessType;
  styleNo: string;
  styleDescription: string;
  garmentItem: string;
  season: string;
  referenceNo: string;
  quotationDate: string;
  validityDate: string;
  quantity: number;
  currency: string;
  unitPriceFob: number;
  totalQuotationValue: number;
  paymentTerms: string;
  deliveryTerms: string;
  shipmentDate: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  approvalDate?: string;
  approvedBy?: string;
  colorSizeBreakdown: MMQuotationColorSize[];
  notes: string;
  attachments: string[];
  createdBy: string;
  createdDate: string;
  version: number;
}

// ----------------------------------------------------------------------------
// 3. Style-Wise Pre-Costing Model (Item-level persistent identifiers)
// ----------------------------------------------------------------------------
export interface MMPreCostPO {
  id: string;
  sl?: number;
  poNumber: string;
  poQuantity: number;
  rate: number;
  value: number;
  remarks?: string;
}

export interface MMPreCostItem {
  id?: string;
  sl?: number;
  preCostItemId: string; // Unique persistent identifier (e.g. PCI-001)
  category: "Fabric" | "Accessories" | "Trims" | "Embellishment" | "Wash" | "Commercial" | "CM" | string;
  head?: string; // Costing Head
  item?: string; // Item Name
  itemCode: string;
  itemDescription: string;
  description?: string;
  specification: string;
  bodyPartOrUsedPlace: string;
  usedPlace?: string;
  color?: string;
  codeNo?: string;
  nStatus?: string; // Nominee status ('Nominated' | 'Non-Nominee' | 'Buyer Nominee' | 'Self Source')
  supplier?: string;
  effectedQty?: number;
  consumption?: number;
  consumptionPerPc: number;
  unit: string; // 'Yds', 'Kg', 'Dzn', 'Gross', 'Pcs', 'Mtr'
  requiredQty?: number;
  finalQty?: number;
  rate?: number;
  amount?: number;
  preCostPct?: number;
  wastagePct: number;
  requiredQtyWithWastage: number; // for 1 pc / dozen basis
  unitRate: number; // in USD
  totalAmountPerDzn: number;
  supplierNominee?: string;
  notes?: string;
}

export interface MMPreCostAuditEntry {
  id?: string;
  versionNumber: number;
  previousVersionNumber?: number;
  amendmentReason?: string;
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectedBy?: string;
  rejectionDate?: string;
  decisionComments?: string;
  status: ApprovalStatus;
}

export interface MMPreCostVersionSnapshot {
  versionNumber: number;
  previousVersionNumber?: number;
  amendmentReason?: string;
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectedBy?: string;
  rejectionDate?: string;
  decisionComments?: string;
  status: ApprovalStatus;
  header: {
    preCostId: string;
    preCostNo: string;
    preCostDate: string;
    contractNo: string;
    ourRef: string;
    acHolder: string;
    buyer: string;
    merchandiser: string;
    style: string;
    note: string;
    smv: number;
    currency: string;
  };
  poRows: MMPreCostPO[];
  items: MMPreCostItem[];
  summary: {
    gmtQty: number;
    rate: number;
    value: number;
    smv: number;
    orderQty: number;
    remarks: string;
    totalGmtQty: number;
    totalGmtValue: number;
    totalCost: number;
    surplus: number;
    surplusPcs: number;
    smvCost: number;
  };
}

export interface MMPreCosting {
  id: string;
  preCostId: string; // e.g. PC-2026-001
  preCostNo?: string;
  preCostDate?: string;
  contractNo?: string;
  ourRef?: string;
  acHolder?: string;
  buyer?: string;
  merchandiser?: string;
  style?: string;
  note?: string;
  smv?: number;
  smvCost?: number;
  jobNo?: string; // Associated Job No.
  quotationId?: string;
  quotationNo?: string;
  orderId?: string;
  orderNo?: string;
  styleNo: string;
  styleDescription: string;
  garmentType: GarmentBusinessType;
  season: string;
  buyerName: string;
  currency: string;
  orderQuantity?: number;
  totalOrderValue?: number;
  version: number; // 1, 2, 3...
  isCurrentActive: boolean;
  status: ApprovalStatus;
  amendmentReason?: string;
  poRows?: MMPreCostPO[];
  items: MMPreCostItem[];
  // Summary
  gmtQty?: number;
  rate?: number;
  totalGmtQty?: number;
  totalGmtValue?: number;
  totalCost?: number;
  surplus?: number;
  surplusPcs?: number;
  cmCostPerDzn: number;
  commercialCostPct: number;
  commercialCostPerDzn: number;
  profitPct: number;
  profitPerDzn: number;
  totalCostPerDzn: number;
  costPerPc: number;
  offeredFobPerPc: number;
  approvedBy?: string;
  approvalDate?: string;
  rejectedBy?: string;
  rejectionDate?: string;
  rejectionReason?: string;
  decisionComments?: string;
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
  // Complete Version History Snapshots
  versions?: MMPreCostVersionSnapshot[];
  auditHistory?: MMPreCostAuditEntry[];
  // History preservation for amendment comparison
  previousVersionSnapshot?: {
    version: number;
    items: MMPreCostItem[];
    totalCostPerDzn: number;
    offeredFobPerPc: number;
    approvalDate?: string;
  };
}

// ----------------------------------------------------------------------------
// 4. Main Order / Confirm Order Entry Model
// ----------------------------------------------------------------------------
export interface MMColorQty {
  color: string;
  quantity: number;
}

export interface MMSizeQty {
  size: string;
  quantity: number;
}

export interface MMPOQty {
  poNumber: string;
  poDate: string;
  shipmentDate: string;
  quantity: number;
  destinationCountry: string;
}

export interface MMLotQty {
  lotNumber: string;
  deliveryDate: string;
  quantity: number;
  deliveryMode: "Sea" | "Air" | "Road";
  destinationPort: string;
}

export interface MMCountryQty {
  country: string;
  quantity: number;
}

export interface MMDeliveryLotRow {
  id: string;
  lotNumber: string; // LOT#
  quantity: number;
  deliveryDate: string; // Del Date
}

export interface MMPoSizeRow {
  id: string;
  size: string;
  ratio: number;
  quantity: number;
  rate: number;
  total: number;
}

export interface MMPoColorBreakdown {
  id: string;
  color: string;
  rate: number;
  assrtStatus: string; // "Solid" | "Assorted" | "Pack"
  quantity: number;
  sizeRows: MMPoSizeRow[];
}

export interface MMPoBreakdownHeader {
  poId: string;
  poNumber: string;
  poQty: number;
  lotNo: string;
  ratioWiseQtyChange: boolean;
  sizeFromBuyerDept: string;
  countryBreakdown: string;
  note: string;
  company: string;
  lineName: string;
  startDate: string;
  finishDate: string;
  planQty: number;
  colorBreakdowns: MMPoColorBreakdown[];
}

export interface MMPODetailRow {
  id: string;
  no: number;
  projection: string;
  po: string;
  qty: number;
  lot: string;
  poNumber: string;
  poDesc: string;
  rate: number;
  value: number;
  delDate: string;
  pcd: string;
  destCountry: string;
  delMode: string;
  destPort: string;
  v: string;
  s: string;
  size: string;
  scLcNo?: string;
  breakdown?: MMPoBreakdownHeader;
}

export interface MMMainOrder {
  id: string;
  orderNo: string; // e.g. ORD-2026-001
  orderType: "Regular" | "Sample" | "Repeat" | "Test" | string;
  buyerName: string;
  buyerDepartment: string;
  companyName: string;
  businessUnit: string;
  styleNo: string;
  garmentItem: string;
  season: string;
  merchandisingRef: string;
  buyerPoNumber: string;
  buyerPoDate: string;
  preCostId: string;
  preCostVersion: number;
  orderQuantity: number;
  fobUnitPrice: number;
  totalOrderValue: number;
  currency: string;
  orderDate: string;
  shipmentDate: string;
  destinationCountry: string;
  deliveryMode: "Sea" | "Air" | "Road" | string;
  destinationPort: string;
  orderStatus: OrderStatus;

  // Specific Order Entry original fields
  entryMode?: "New Order" | "Pre Costing Ref.";
  jobNo?: string;
  priceType?: string;
  cmUnit?: "PCS" | "DZ";
  processList?: { sl: number; processName: string }[];
  newOrderRepeatOrder?: "New Order" | "Repeat Order";
  referenceStatus?: string;
  ourRef?: string;
  orderSl?: string;
  copyFromOurRef?: string;
  beneficiaryCompany?: string;
  localAgent?: string;
  merchan?: string; // Abbreviated label "Merchan." preserved
  acHolder?: string;
  deptCode?: string;
  place?: string;
  packType?: string;
  processName?: string;
  size?: string;
  payTerm?: string;
  cm?: number;
  pcs?: number;
  firstDelDate?: string;
  confirmDate?: string;
  extraCuttingPct?: number;
  smv?: number;
  delDate?: string;
  pcd?: string;
  instructionDetail?: string;
  fabricRequirementDetails?: string;
  accessoriesRequirementDetails?: string;

  deliveryLots?: MMDeliveryLotRow[];
  poDetails?: MMPODetailRow[];
  attachments?: { id: string; name: string; size: string; uploadDate: string }[];

  // Breakdowns that MUST reconcile to orderQuantity:
  colorWiseBreakdown: MMColorQty[];
  sizeWiseBreakdown: MMSizeQty[];
  poWiseBreakdown: MMPOQty[];
  lotWiseBreakdown: MMLotQty[];
  countryWiseBreakdown: MMCountryQty[];
  notes: string;
  createdBy: string;
  createdDate: string;
  fobAuditLog: {
    timestamp: string;
    user: string;
    previousFob: number;
    newFob: number;
    reason: string;
  }[];
  closureAuditLog: {
    status: "Closed" | "Reopened";
    timestamp: string;
    user: string;
    reason: string;
  }[];
}

// ----------------------------------------------------------------------------
// Process Template Model & Master Libraries
// ----------------------------------------------------------------------------
export interface MMProcessTemplate {
  id: string;
  name: string;
  processes: string[];
}

export const DEFAULT_PROCESS_TEMPLATES: MMProcessTemplate[] = [
  {
    id: "tmpl-01",
    name: "Basic Knit Tops",
    processes: ["Knitting", "Dyeing", "Cutting", "Sewing", "Finishing", "Packing"],
  },
  {
    id: "tmpl-02",
    name: "Woven Casual Pants",
    processes: ["Cutting", "Sewing", "Washing", "Button & Rivet", "Quality Check", "Packing"],
  },
  {
    id: "tmpl-03",
    name: "Embroidered T-Shirt",
    processes: ["Cutting", "Embroidery", "Sewing", "Washing", "Ironing", "Packing"],
  },
  {
    id: "tmpl-04",
    name: "Printed Polo Shirt",
    processes: ["Cutting", "Screen Print", "Sewing", "Finishing", "Packing"],
  },
];

export interface MMMerchantMaster {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone?: string;
  status: "Active" | "Inactive";
}

export const MM_MERCHANTS_MASTER: MMMerchantMaster[] = [
  { id: "MCH-01", name: "Rashidul Islam", designation: "Head of Merchandising", email: "rashidul@pakizaknit.com", phone: "+880 1711-209481", status: "Active" },
  { id: "MCH-02", name: "Md Zubayer Hossain Khan", designation: "Senior Merchant (Knit & Woven)", email: "zubayer@pakizaknit.com", phone: "+880 1712-445892", status: "Active" },
  { id: "MCH-03", name: "Hanif Uddin", designation: "Merchandising Manager", email: "hanif@pakizaknit.com", phone: "+880 1713-998822", status: "Active" },
  { id: "MCH-04", name: "Nafis Imtiaz", designation: "Senior Merchandiser", email: "nafis.inditex@pakizaknit.com", phone: "+880 1714-332110", status: "Active" },
  { id: "MCH-05", name: "Tanvir Ahmed", designation: "Key Account Manager", email: "tanvir.ms@pakizaknit.com", phone: "+880 1715-776655", status: "Active" },
  { id: "MCH-06", name: "Kazi Farhan", designation: "Senior Account Lead", email: "kazi.farhan@pakizaknit.com", phone: "+880 1716-112233", status: "Active" },
  { id: "MCH-07", name: "Parvej Mahmud", designation: "Assistant Merchant", email: "parvej@pakizaknit.com", phone: "+880 1717-889900", status: "Active" },
  { id: "MCH-08", name: "Mahmud Hasan", designation: "Commercial Director", email: "mahmud.h@pakizaknit.com", phone: "+880 1718-443322", status: "Active" },
];

export interface MMBuyerMaster {
  id: string;
  name: string;
  buyerName?: string;
  country: string;
  accountHolder: string;
  departments: { id: string; name: string; code: string }[];
  styles: { id: string; styleNo: string; description: string; garmentItem: string }[];
  sizeRanges?: string[];
  configuredSizes?: string[];
}

export const MM_BUYERS_MASTER: MMBuyerMaster[] = [
  {
    id: "byr-00",
    name: "MARLIN MEDIA",
    country: "United States",
    accountHolder: "Tanvir Ahmed (Merchandiser)",
    departments: [
      { id: "dept-mm-01", name: "Mens Outerwear & Casual", code: "DEPT-MM-01" },
      { id: "dept-mm-02", name: "Sportswear & Jackets", code: "DEPT-MM-02" },
    ],
    styles: [
      { id: "sty-mm-01", styleNo: "APEROL-BASEBALL-JACKET", description: "Men Baseball Jacket with Rib Trim", garmentItem: "Baseball Jacket" },
      { id: "sty-mm-02", styleNo: "MM-JK-402", description: "Varsity Wool Bomber Jacket", garmentItem: "Bomber Jacket" },
    ],
    sizeRanges: ["S TO L", "S TO XXL", "XS TO XL", "S, M, L, XL, XXL"],
    configuredSizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "byr-01",
    name: "H&M Hennes & Mauritz",
    country: "Sweden",
    accountHolder: "Rashidul Islam (Head of Merchandising)",
    departments: [
      { id: "dept-hm-01", name: "Ladies Casual & Tops", code: "DEPT-HM-01" },
      { id: "dept-hm-02", name: "Mens Wear", code: "DEPT-HM-02" },
      { id: "dept-hm-03", name: "Kids & Baby", code: "DEPT-HM-03" },
    ],
    styles: [
      { id: "sty-hm-01", styleNo: "HM-KT-8841", description: "Ladies Ribbed Henley Neck T-Shirt", garmentItem: "Henley T-Shirt" },
      { id: "sty-hm-02", styleNo: "HM-KT-9022", description: "Basic Crewneck T-Shirt", garmentItem: "Crewneck Tee" },
      { id: "sty-hm-03", styleNo: "HM-WV-3104", description: "Ladies Denim Jacket", garmentItem: "Denim Jacket" },
    ],
    sizeRanges: ["XS TO XXL", "S TO XL", "XS TO L", "XS, S, M, L, XL, XXL"],
    configuredSizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "byr-02",
    name: "Zara (Inditex)",
    country: "Spain",
    accountHolder: "Nafis Imtiaz (Senior Merchandiser)",
    departments: [
      { id: "dept-zr-01", name: "Man Basic & Casual", code: "DEPT-ZR-01" },
      { id: "dept-zr-02", name: "TRF Collection", code: "DEPT-ZR-02" },
      { id: "dept-zr-03", name: "Kids Outerwear", code: "DEPT-ZR-03" },
    ],
    styles: [
      { id: "sty-zr-01", styleNo: "ZR-WV-4019", description: "Men Slim Fit Cotton Twill Chino Trouser", garmentItem: "Chino Trouser" },
      { id: "sty-zr-02", styleNo: "ZR-KT-1120", description: "Men Oversized Heavyweight Tee", garmentItem: "Crewneck Tee" },
    ],
    sizeRanges: ["30 TO 38", "30-36", "XS TO XXL", "30, 32, 34, 36, 38"],
    configuredSizes: ["30", "32", "34", "36", "38", "XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "byr-03",
    name: "Marks & Spencer",
    country: "United Kingdom",
    accountHolder: "Tanvir Ahmed (Key Account Manager)",
    departments: [
      { id: "dept-ms-01", name: "Formal Menswear", code: "DEPT-MS-01" },
      { id: "dept-ms-02", name: "Casualwear", code: "DEPT-MS-02" },
    ],
    styles: [
      { id: "sty-ms-01", styleNo: "MS-KT-5520", description: "Men Pique Polo Shirt", garmentItem: "Polo Shirt" },
      { id: "sty-ms-02", styleNo: "MS-WV-7710", description: "Non-Iron Formal Shirt", garmentItem: "Dress Shirt" },
    ],
    sizeRanges: ["8 TO 20", "8-18", "10-20", "S TO XL", "8, 10, 12, 14, 16, 18, 20"],
    configuredSizes: ["8", "10", "12", "14", "16", "18", "20", "S", "M", "L", "XL"],
  },
  {
    id: "byr-04",
    name: "Next PLC",
    country: "United Kingdom",
    accountHolder: "Kazi Farhan (Senior Account Lead)",
    departments: [
      { id: "dept-nx-01", name: "Next Childrenswear", code: "DEPT-NX-01" },
      { id: "dept-nx-02", name: "Next Mens Casual", code: "DEPT-NX-02" },
    ],
    styles: [
      { id: "sty-nx-01", styleNo: "NX-KT-3341", description: "Kids Striped Cotton Jumper", garmentItem: "Crewneck Tee" },
    ],
    sizeRanges: ["6 TO 18", "8 TO 16", "3T TO 7T", "S TO XL", "6, 8, 10, 12, 14, 16, 18"],
    configuredSizes: ["6", "8", "10", "12", "14", "16", "18", "S", "M", "L", "XL"],
  },
  {
    id: "byr-05",
    name: "Target Corporation",
    country: "United States",
    accountHolder: "Mahmud Hasan (Commercial Director)",
    departments: [
      { id: "dept-tg-01", name: "Goodfellow & Co", code: "DEPT-TG-01" },
      { id: "dept-tg-02", name: "Universal Thread", code: "DEPT-TG-02" },
    ],
    styles: [
      { id: "sty-tg-01", styleNo: "TG-KT-6012", description: "Standard Fit Short Sleeve Crew", garmentItem: "Crewneck Tee" },
    ],
    sizeRanges: ["S TO XL", "XS TO XXL", "1X TO 3X", "XS, S, M, L, XL, XXL"],
    configuredSizes: ["XS", "S", "M", "L", "XL", "XXL", "1X", "2X", "3X"],
  },
];

export interface MMGMTItemMaster {
  id: string;
  name: string;
  category: "Knit" | "Woven";
  hscode: string;
}

export const MM_GMT_ITEMS_MASTER: MMGMTItemMaster[] = [
  { id: "gmt-01", name: "Henley T-Shirt", category: "Knit", hscode: "6109.10.00" },
  { id: "gmt-02", name: "Crewneck Tee", category: "Knit", hscode: "6109.10.00" },
  { id: "gmt-03", name: "Polo Shirt", category: "Knit", hscode: "6105.10.00" },
  { id: "gmt-04", name: "Chino Trouser", category: "Woven", hscode: "6203.42.00" },
  { id: "gmt-05", name: "Denim Jacket", category: "Woven", hscode: "6202.92.00" },
  { id: "gmt-06", name: "Dress Shirt", category: "Woven", hscode: "6205.20.00" },
  { id: "gmt-07", name: "Hoodie / Sweatshirt", category: "Knit", hscode: "6110.20.00" },
  { id: "gmt-08", name: "Cargo Shorts", category: "Woven", hscode: "6203.49.00" },
  { id: "gmt-09", name: "Ladies Blouse", category: "Woven", hscode: "6206.30.00" },
];

export interface MMDestCountryMaster {
  code: string;
  name: string;
  region: string;
  defaultPort: string;
}

export const MM_DEST_COUNTRIES_MASTER: MMDestCountryMaster[] = [
  { code: "DE", name: "Germany", region: "Europe", defaultPort: "Hamburg Port" },
  { code: "US", name: "United States", region: "North America", defaultPort: "New York / Newark Port" },
  { code: "UK", name: "United Kingdom", region: "Europe", defaultPort: "Southampton Port" },
  { code: "ES", name: "Spain", region: "Europe", defaultPort: "Valencia Port" },
  { code: "FR", name: "France", region: "Europe", defaultPort: "Le Havre Port" },
  { code: "NL", name: "Netherlands", region: "Europe", defaultPort: "Rotterdam Port" },
  { code: "IT", name: "Italy", region: "Europe", defaultPort: "Genoa Port" },
  { code: "CA", name: "Canada", region: "North America", defaultPort: "Montreal Port" },
  { code: "AU", name: "Australia", region: "Oceania", defaultPort: "Sydney Port" },
  { code: "JP", name: "Japan", region: "Asia", defaultPort: "Yokohama Port" },
  { code: "SE", name: "Sweden", region: "Europe", defaultPort: "Gothenburg Port" },
  { code: "PL", name: "Poland", region: "Europe", defaultPort: "Gdansk Port" },
];

export interface MMSCLCMaster {
  id: string;
  scLcNo: string;
  type: "Sales Contract" | "LC";
  buyer: string;
  beneficiaryCompany?: string;
  issueDate: string;
  expiryDate: string;
  amount: number;
  currency: string;
  bankName: string;
  status: "Active" | "Pending" | "Closed";
}

export const MM_SC_LC_MASTER: MMSCLCMaster[] = [
  {
    id: "sclc-01",
    scLcNo: "SC-HM-2026-081",
    type: "Sales Contract",
    buyer: "H&M Hennes & Mauritz",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-08-15",
    expiryDate: "2027-02-28",
    amount: 350000,
    currency: "USD",
    bankName: "Standard Chartered Bank",
    status: "Active",
  },
  {
    id: "sclc-02",
    scLcNo: "LC-IND-2026-4401",
    type: "LC",
    buyer: "Zara (Inditex)",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-09-01",
    expiryDate: "2027-03-31",
    amount: 480000,
    currency: "EUR",
    bankName: "HSBC Bangladesh",
    status: "Active",
  },
  {
    id: "sclc-03",
    scLcNo: "SC-TARGET-2026-112",
    type: "Sales Contract",
    buyer: "Target Corporation",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-07-20",
    expiryDate: "2027-01-31",
    amount: 620000,
    currency: "USD",
    bankName: "Eastern Bank PLC",
    status: "Active",
  },
  {
    id: "sclc-04",
    scLcNo: "LC-MANGO-2026-099",
    type: "LC",
    buyer: "Mango Punto Fa",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-08-28",
    expiryDate: "2027-04-15",
    amount: 275000,
    currency: "EUR",
    bankName: "BRAC Bank Limited",
    status: "Active",
  },
  {
    id: "sclc-05",
    scLcNo: "SC-NEXT-2026-554",
    type: "Sales Contract",
    buyer: "Next Retail Ltd",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-09-10",
    expiryDate: "2027-05-30",
    amount: 310000,
    currency: "GBP",
    bankName: "Standard Chartered Bank",
    status: "Active",
  },
  {
    id: "sclc-06",
    scLcNo: "LC-HM-2026-902",
    type: "LC",
    buyer: "H&M Hennes & Mauritz",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-09-15",
    expiryDate: "2027-03-15",
    amount: 520000,
    currency: "USD",
    bankName: "Citibank N.A.",
    status: "Active",
  },
  {
    id: "sclc-07",
    scLcNo: "SC-PVH-2026-781",
    type: "Sales Contract",
    buyer: "PVH Corp (Tommy / Calvin Klein)",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-08-01",
    expiryDate: "2027-02-15",
    amount: 450000,
    currency: "USD",
    bankName: "HSBC Bangladesh",
    status: "Pending",
  },
  {
    id: "sclc-08",
    scLcNo: "LC-GAP-2026-302",
    type: "LC",
    buyer: "Gap Inc. (Old Navy / Banana Republic)",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    issueDate: "2026-06-12",
    expiryDate: "2026-12-31",
    amount: 390000,
    currency: "USD",
    bankName: "Dutch-Bangla Bank PLC",
    status: "Active",
  },
];

// ----------------------------------------------------------------------------
// 5. BOM Model with Mandatory Pre-Cost Item Linkage
// ----------------------------------------------------------------------------
export interface MMBOMItem {
  bomItemId: string; // e.g. BOM-ITM-001
  preCostItemId: string; // Linkage to MMPreCostItem.preCostItemId or "UNMATCHED-NEW"
  isUnmatchedAdditional: boolean;
  category: "Fabric" | "Accessories" | "Trims" | "Thread" | "Packing";
  itemCode: string;
  itemDescription: string;
  specification: string;
  bodyPartOrUsedPlace: string;
  // Baseline from Pre-Costing:
  preCostEstimatedQty: number;
  preCostRate: number;
  preCostUnit: string;
  preCostAmount: number;
  // BOM specific operational requirements:
  bomConsumptionPerPc: number;
  bomWastagePct: number;
  bomTotalRequiredQty: number;
  bomUnit: string;
  bomEstimatedRate: number;
  bomEstimatedCost: number;
  supplierNominee?: string;
  notes?: string;
}

export interface MMBOM {
  id: string;
  bomId: string; // e.g. BOM-2026-001
  orderId: string;
  orderNo: string;
  styleNo: string;
  preCostId: string;
  preCostVersion: number;
  items: MMBOMItem[];
  totalBomCost: number;
  status: "Draft" | "Released" | "Locked";
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
}

// ----------------------------------------------------------------------------
// 6. Fabric Estimation & Fabric Booking Model
// ----------------------------------------------------------------------------
export interface MMFabricEstimationItem {
  estimationItemId: string;
  orderId: string;
  orderNo: string;
  styleNo: string;
  preCostItemId: string;
  fabricCode: string;
  fabricDescription: string;
  composition: string;
  constructionGsm: string;
  cuttableWidth: string;
  usedPlace: string;
  garmentColor: string;
  fabricColor: string;
  consumptionPerDzn: number;
  unit: string;
  wastagePct: number;
  totalRequiredQty: number;
  preCostRate: number;
  supplierName: string;
  nominated: boolean;
}

export interface MMFabricColorMapping {
  id: string;
  garmentsColor: string;
  itemColor: string;
}

export interface MMFabricMasterItem {
  id: string;
  fabricCode: string;
  fabricDescription: string;
  width: string;
  unit: string; // e.g. "Kg", "Yds", "Mtr"
  gsm?: number;
  composition?: string;
  construction?: string;
}

export interface MMSupplierMasterItem {
  id: string;
  supplierCode: string;
  supplierName: string;
  category: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  status: "Active" | "Inactive";
}

export interface MMFabricEstimationRow {
  id: string; // fabricRowId
  inhouse: boolean;
  fabricNo: string;
  usedPlace: string;
  budgetItemName: string;
  preCostItemId?: string;
  code: string;
  fabricCodeId?: string;
  fabricDescription: string;
  sku: string;
  sizeWiseConsumption?: string;
  colorType: "DTM" | "Contrast" | "Single Color";
  singleColorName?: string;
  colorMappings: MMFabricColorMapping[];
  width: string;
  marketUnit: string;
  rate: number;
  nomineeStatus: string;
  supplier: string;
  supplierId?: string;
  bookingRef?: string;
  // Consumption & Cost fields
  per: string; // e.g. "Dzn" or "Pcs"
  consum: number; // base consumption per dozen/pc
  unit: string; // e.g. "Kg", "Yds"
  wPct: number; // Wastage %
  consPerPc: number;
  consPerDz: number;
  costPerPc: number;
  costPerDz: number;
  orderQty: number;
  requireQty: number;
  bulkCons?: number;
  bulkWPct?: number;
  consPerPcBulk?: number;
  consPerDzBulk?: number;
  costPerPcBulk?: number;
  costPerDzBulk?: number;
  requireQtyBulk?: number;
}

export interface MMFabricEstimationRecord {
  id: string; // fabricEstimationId
  orderId: string;
  jobNo: string;
  ourRef: string;
  buyer: string;
  buyerRef?: string;
  style: string;
  itemName?: string;
  packingType?: string;
  lcBasis?: string;
  quantity: number;
  rate?: number;
  unit?: string;
  place?: string;
  note?: string;
  orderDate?: string;
  findQtn?: string;
  findBudget?: string;
  preCostId?: string;
  bookingNo?: string;
  piNo?: string;
  bblcNo?: string;
  sourceType?: "job" | "pre-costing" | "manual";
  fabricRows: MMFabricEstimationRow[];
  savedAt: string;
  updatedAt: string;
}

export interface MMFabricBookingAllocation {
  id: string;
  orderId: string;
  poId: string;
  poNumber: string;
  lotId?: string;
  lotNumber?: string;
  colorId?: string;
  colorName?: string;
  countryId?: string;
  countryName?: string;
  garmentOrderQuantity: number;
  bookedOrderQuantity?: number;
  balance?: number;
  estimatedFabricRequirement: number;
  previouslyBookedQuantity: number;
  remainingRequirement: number;
  suggestedBookingQuantity: number;
  bookingQuantity: number;
  unit: string;
  selected?: boolean;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MMFabricBookingDetail {
  id: string;
  bookingLineId: string;
  poId?: string;
  poNumber?: string;
  lotNumber?: string;
  countryName?: string;
  rcv?: boolean;
  ourRef: string;
  usedPlace: string;
  fabricCode: string;
  fabricDescription: string;
  width?: string;
  garmentColor?: string;
  fabricColor: string;
  requiredQuantity: number;
  unit: string;
  bookingQuantity: number;
  receivedQuantity: number;
  rate: number;
  lineTotal: number;
}

export interface MMFabricBookingLine {
  id: string;
  fabricEstimationId?: string;
  fabricEstimationItemId?: string;
  jobId: string;
  ourRef?: string;
  styleId?: string;
  styleNo?: string;
  styleNameSnapshot?: string;
  buyerNameSnapshot?: string;
  supplierId?: string;
  fabricCodeId?: string;
  fabricCode: string;
  fabricDescription: string;
  width?: string;
  usedPlace?: string;
  grpType?: string;
  color?: string;
  unit: string;
  requiredQuantity: number;
  previouslyBookedQuantity: number;
  remainingRequirement: number;
  suggestedBookingQuantity: number;
  bookingQuantity: number;
  receivedQuantity?: number;
  rate: number;
  currency?: string;
  lineTotal: number;
  budgetValue?: number;
  rcv?: boolean;
  allocations: MMFabricBookingAllocation[];
  bookingDetails?: MMFabricBookingDetail[];
}

export interface MMFabricBookingItem {
  bookingItemId: string;
  estimationItemId: string;
  orderId: string;
  orderNo: string;
  styleNo: string;
  poNumber: string;
  preCostItemId: string;
  fabricDescription: string;
  garmentColor: string;
  fabricColor: string;
  diaGsm: string;
  unit: string;
  requiredQty: number;
  bookedQty: number;
  unitRate: number; // Supplier booked rate
  totalAmount: number;
  preCostRate: number;
  preCostAmount: number;
  // Cost Saving calculations:
  initialSavingAmount: number; // (preCostRate * bookedQty) - totalAmount
  initialSavingPct: number;
  isOverBudget: boolean; // bookedRate > preCostRate
  isSavingTargetMissed: boolean; // savingPct < target (e.g. 2%)
  exceptionReason?: string;
  specialApprovalStatus?: "Pending" | "Approved" | "Waived";
}

export interface MMFabricBooking {
  id: string;
  bookingNo: string; // e.g. FB-2026-001
  supplierId?: string;
  supplierName: string;
  supplierNameSnapshot?: string;
  bookingDate: string;
  bookingDescription?: string;
  status: BookingStatus | string;
  deliveryDate: string;
  deliveryMode: "Sea" | "Air" | "Road" | string;
  loadPort?: string;
  destination?: string;
  destinationPlace?: string;
  requiredDate?: string;
  etaPort?: string;
  factoryDate?: string;
  bookingType?: string;
  bookingUnit?: string;
  deliveryPlace?: string;
  currency: string;
  conversionRate: number;
  paymentMode?: string;
  paymentTerms: string;
  cp?: string;
  note?: string;
  notes?: string;
  termsAndConditions?: string;
  piReference?: string;
  ourRef?: string;
  lines?: MMFabricBookingLine[];
  items: MMFabricBookingItem[];
  totalAmount?: number;
  totalBookedQty: number;
  totalBookedAmount: number;
  totalPreCostAmount: number;
  totalSavingAmount: number;
  overallSavingPct: number;
  rejectionReason?: string;
  returnReason?: string;
  approvalDate?: string;
  approvedBy?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvalHistory?: MMBookingApprovalHistoryItem[];
  createdBy: string;
  createdDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// ----------------------------------------------------------------------------
// 7. Accessories Estimation & Accessories Booking Model
// ----------------------------------------------------------------------------
export interface MMAccessoriesEstimationItem {
  estimationItemId: string;
  orderId: string;
  orderNo: string;
  styleNo: string;
  poNumber: string;
  preCostItemId: string;
  accessoryCode: string;
  itemDescription: string; // Button, Zipper, Brand Tag, Care Label, etc.
  specification: string;
  usedPlace: string;
  sizeOrDimension: string;
  color: string;
  unit: string;
  consumptionPerPc: number;
  wastagePct: number;
  requiredQty: number;
  preCostRate: number;
  supplierName: string;
  isNominated: boolean;
}

export interface MMAccessoriesSizeSpecRow {
  id: string;
  gmtSize: string;
  itemSpecification: string;
  requiredItemQty: number;
  wastageQty: number;
  totalQty: number;
  gmtOrderQty: number;
  totalWastagePct: number;
}

export interface MMAccessoriesColorMappingRow {
  id: string;
  garmentsColor: string;
  itemColor: string;
}

export interface MMAccessoriesPOAllocation {
  id: string;
  poNumber: string;
  color?: string;
  size?: string;
  orderQty: number;
  allocatedQty: number;
  bookingRef?: string;
}

export interface MMAccessoriesEstimationRow {
  id: string;
  inhouse: boolean;
  budgetItemName: string;
  itemName: string;
  description: string;
  usedPlace: string;
  consumptionQtyPerPc: number;
  consumptionUnit: string;
  wastagePct: number;
  wastageQty: number;
  marketQty: number;
  marketUnit: string;
  conversionFactor?: number;
  unitRate: number;
  amount: number;
  nomineeStatus: string; // "Nominated" | "Non Nominee" | "Buyer Nominee"
  supplier: string;
  
  // Size Spec Configuration (Size D modal)
  sizeFactType?: "SAME AS GMT SIZE" | "SINGLE SIZE";
  singleSizeSpec?: string;
  sizeRows?: MMAccessoriesSizeSpecRow[];
  
  // Color Configuration (Color D modal)
  colorType?: "DTM" | "Contrast" | "Single Color";
  singleColorName?: string;
  colorMappings?: MMAccessoriesColorMappingRow[];
  
  // PO Allocation Details (PO D modal)
  poAllocations?: MMAccessoriesPOAllocation[];
  
  // Booking column
  bookingRef?: string;
  bookingStatus?: "Not Booked" | "Pending" | "Partially Booked" | "Booked";
}

export interface MMAccessoriesEstimationRecord {
  id: string;
  orderId: string;
  jobNo: string;
  ourRef: string;
  buyer: string;
  buyerRef?: string;
  style: string;
  orderDate?: string;
  
  // Group B: Item and Quantity Information
  itemName?: string;
  packingType?: string;
  quantity: number;
  unit?: string;
  
  // Group C: Commercial Information
  payTerm?: string;
  rate?: number;
  place?: string;
  note?: string;
  
  // Group D: Booking and PI Information
  bookingNo?: string;
  bookingDate?: string;
  piNo?: string;
  piDate?: string;
  bblcNo?: string;
  bblcDate?: string;
  
  // Search fields
  findQtn?: string;
  findBudget?: string;
  findRef?: string;
  
  // Footer remarks
  budgetAccDesc?: string;
  
  // Accessories rows
  accessoriesRows: MMAccessoriesEstimationRow[];
  savedAt: string;
  updatedAt: string;
}

export interface MMAccessoriesBookingItem {
  bookingItemId: string;
  estimationItemId: string;
  orderId: string;
  orderNo: string;
  styleNo: string;
  poNumber: string;
  preCostItemId: string;
  itemDescription: string;
  specification: string;
  sizeOrDimension: string;
  color: string;
  unit: string;
  marketUnit?: string;
  conversionFactor?: number;
  marketQty?: number;
  requiredQty: number;
  bookedQty: number;
  bookedRate: number;
  totalAmount: number;
  preCostRate: number;
  preCostAmount: number;
  initialSavingAmount: number;
  initialSavingPct: number;
  isOverBudget: boolean;
  isSavingTargetMissed: boolean;
  exceptionReason?: string;
  specialApprovalStatus?: "Pending" | "Approved" | "Waived";
}

export interface MMAccessoriesBookingAllocation {
  id: string;
  selected: boolean;
  poNo: string;
  gmtColor: string;
  gmtQty: number;
  note?: string;
  lot?: string;
  delDt?: string;
  country?: string;
  bookQty?: number;
  balance?: number;
}

export interface MMAccessoriesBookingSizeDetail {
  id: string;
  lineId?: string;
  receivedStatus?: string; // "Received" | "Pending" | "Partial"
  status?: string;
  ourRef: string;
  itemName: string;
  description: string;
  color: string;
  size: string;
  codeSpecPo: string;
  gmtQty: number;
  reqQty: number;
  unit: string;
  marketUnit?: string;
  conversionFactor?: number;
  marketQty?: number;
  bookedWastagePct: number;
  bookQty: number;
  storeRcvdQty: number;
  rate: number;
  total: number;
}

export interface MMAccessoriesBookingLine {
  id: string;
  ourRef: string;
  style: string;
  grpType: string;
  accessoryItem: string;
  description: string;
  bookAmt: number;
  budgetValue?: number;
  allocations?: MMAccessoriesBookingAllocation[];
  sizeWiseDetails?: MMAccessoriesBookingSizeDetail[];
  estimationId?: string;
  estimationItemId?: string;
  supplier?: string;
  unit?: string;
  rate?: number;
  requiredQty?: number;
  usedPlace?: string;
  size?: string;
  color?: string;
  sizeRows?: MMAccessoriesSizeSpecRow[];
  colorMappings?: MMAccessoriesColorMappingRow[];
}

export interface MMAccessoriesBooking {
  id: string;
  bookingNo: string; // e.g. AB-2026-001
  ourRef?: string;
  bookingDesc?: string;
  bookingDate: string;
  payMode?: string;
  supplierId?: string;
  supplierName: string;
  cp?: string;
  delMode?: string;
  deliveryMode?: string;
  loadPort?: string;
  bookType?: string;
  bookingUnit?: string;
  destination?: string;
  delPlace?: string;
  deliveryPlace?: string;
  reqDate?: string;
  deliveryDate: string;
  etaPort?: string;
  factDate?: string;
  convRate?: number;
  currency: string;
  conversionRate: number;
  paymentTerms: string;
  status: BookingStatus | string;
  note?: string;
  notes?: string;
  termsAndConditions?: string;
  piReference?: string;
  lines?: MMAccessoriesBookingLine[];
  allocations?: MMAccessoriesBookingAllocation[];
  sizeDetails?: MMAccessoriesBookingSizeDetail[];
  rejectionReason?: string;
  returnReason?: string;
  approvalDate?: string;
  approvedBy?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvalHistory?: MMBookingApprovalHistoryItem[];
  items: MMAccessoriesBookingItem[];
  totalBookedQty: number;
  totalBookedAmount: number;
  totalPreCostAmount: number;
  totalSavingAmount: number;
  overallSavingPct: number;
  createdBy: string;
  createdDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MMManualBooking = MMAccessoriesBooking;
export type MMManualBookingLine = MMAccessoriesBookingLine;
export type MMManualBookingItem = MMAccessoriesBookingItem;
export type MMManualBookingAllocation = MMAccessoriesBookingAllocation;
export type MMManualBookingSizeDetail = MMAccessoriesBookingSizeDetail;

export interface MMYarnBookingTagRecord {
  id: string;
  preCostId?: string;
  yarnRowId: string;
  blockBookingId?: string;
  blockBookingNo: string;
  yarnItemId: string;
  yarnItemName: string;
  supplierName?: string;
  tagQtyKg: number;
  availableBalanceAtTag?: number;
  remainingBalanceAtTag?: number;
  taggedAt: string;
}

export interface MMBlockYarnStatusRecord {
  id: string;
  bookingId: string;
  bookingItemId: string;
  buyer: string; // Column A: Buyer
  blockNo: string; // Column B: Block No
  season: string; // Column C: Season
  job: string; // Column D: Job
  yarnCount: string; // Column E: Yarn Count
  yarnComposition?: string;
  yarnItem: string;
  qty: number; // Column F: Qty (KG)
  marketQtyTon?: number; // Qty (TON)
  useQty: number; // Column G: Use Qty (KG)
  balance: number; // Column H: Balance (KG) = Qty - Use Qty
  price: number; // Column I: Price ($/KG)
  bookingDate: string; // Column J: Booking Date
  receivedQty: number; // Column K: Received Qty (KG) (initially = Qty)
  documentsStatus: string; // Column L: Documents Status (LC Number)
  actualPrice: number; // Column M: Actual Price ($/KG)
  piNo: string; // Column N: PI No
  piId?: string;
  supplierName: string;
  tags?: MMYarnBookingTagRecord[];
}

// ----------------------------------------------------------------------------
// 8. PI (Proforma Invoice) Management Model
// ----------------------------------------------------------------------------
export interface MMPIAdditionalCharge {
  id: string;
  particulars: string;
  note: string;
  amountUsd: number;
  amountBdt: number;
}

export interface MMPIAllocatedBooking {
  bookingId: string;
  bookingNo: string;
  bookingType: "Fabric" | "Accessories";
  orderNo: string;
  styleNo: string;
  allocatedAmount: number;
  bookingDesc?: string;
  bookingDate?: string;
  deliveryMode?: string;
  deliveryDate?: string;
  affectedGarmentQty?: number;
  buyerName?: string;
  season?: string;
}

export interface MMPIItem {
  piItemId: string;
  bookingId?: string;
  bookingItemId: string;
  sourceBookingNo: string;
  buyerName?: string;
  season?: string;
  jobId?: string;
  styleNo?: string;
  affectedGmtQty?: number;
  qtyDz?: number;
  itemCategory?: string;
  fabricCode?: string;
  color?: string;
  itemDescription: string;
  specification: string;
  dzConsump?: number;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  amountBdt?: number;
}

export interface MMProformaInvoice {
  id: string;
  piNo: string; // e.g. PI-2026-001
  entryNo: string;
  piDate: string;
  entryDate?: string;
  source?: string; // "Fabric Booking" | "Accessories Booking" | "Direct Supplier"
  isWaiting?: boolean;
  itemCategory?: string; // "Fabric"
  supplierName: string;
  businessUnit: string;
  currency: string;
  conversionRate: number;
  bdtRate?: number;
  usdRate?: number;
  paymentTerms: string;
  deliveryTerms: string; // FOB, CIF, CFR
  deliveryMode: "Sea" | "Air" | "Road";
  deliveryPlace?: string;
  priorityLevel?: "Normal" | "Urgent" | "High" | "Critical";
  merchant?: string;
  lcOpenDate?: string;
  lcType?: string;
  impUnit?: string;
  previousPiRef?: string;
  previousPiVal?: number;
  amendmentReason?: string;
  bblcReferenceNo?: string;
  docNo?: string;
  lcReferenceNo?: string;
  lcNumber?: string;
  lcId?: string;
  status: PIStatus;
  allocatedBookings: MMPIAllocatedBooking[];
  items: MMPIItem[];
  charges?: MMPIAdditionalCharge[];
  additionalCharges: number;
  totalPiValue: number;
  totalPiValueBdt?: number;
  activeBookingId?: string;
  notes: string;
  comments?: Array<{ id: string; user: string; timestamp: string; message: string }>;
  rejectionReason?: string;
  returnReason?: string;
  approvalDate?: string;
  approvedBy?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvalHistory?: MMBookingApprovalHistoryItem[];
  attachments: string[];
  createdBy: string;
  createdDate: string;
  version: number;
}

// ----------------------------------------------------------------------------
// 9. Cost Saving Analysis Record (Denormalized reporting view)
// ----------------------------------------------------------------------------
export interface MMCostSavingRow {
  rowId: string;
  orderNo: string;
  styleNo: string;
  buyerName: string;
  poNumber: string;
  preCostId: string;
  preCostVersion: number;
  preCostItemId: string;
  bomItemId: string;
  bookingNo: string;
  bookingItemId: string;
  bookingType: "Fabric" | "Accessories";
  category: string;
  itemDescription: string;
  specification: string;
  uom: string;
  preCostQty: number;
  preCostRate: number;
  preCostAmount: number;
  bomQty: number;
  bomCost: number;
  bookedQty: number;
  bookedRate: number;
  bookedAmount: number;
  qtyVariance: number; // bookedQty - preCostQty
  rateVariance: number; // bookedRate - preCostRate
  costVariance: number; // bookedAmount - preCostAmount (Positive = Overrun, Negative = Saving)
  initialBookingSaving: number; // preCostAmount - bookedAmount
  savingPercentage: number; // (initialBookingSaving / preCostAmount) * 100
  isOverBudget: boolean; // bookedRate > preCostRate
  isTargetException: boolean; // savingPct < target %
  exceptionReason?: string;
  approvalStatus: string;
}

// ----------------------------------------------------------------------------
// 10. Audit Trail Entry Model
// ----------------------------------------------------------------------------
export interface MMAuditLogEntry {
  id: string;
  timestamp: string;
  entityType: "Quotation" | "PreCosting" | "MainOrder" | "BOM" | "FabricBooking" | "AccessoriesBooking" | "PI" | "CompanyPolicy" | "OrderClosure";
  entityId: string;
  action: "Create" | "Update" | "Submit" | "Approve" | "Reject" | "Amend" | "Close" | "Reopen" | "FOB_Change";
  userId: string;
  userName: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  comments?: string;
}

// ============================================================================
// Default Enterprise Mock & Baseline Data
// ============================================================================

export const DEFAULT_MM_POLICY: MMCompanyPolicy = {
  quotationApprovalRequired: true,
  preCostingApprovalRequired: true,
  postApprovalPreCostingRestrictions: "AllowAmendmentWithReapproval",
  fabricBookingApprovalRequired: true,
  accessoriesBookingApprovalRequired: true,
  savingTargetPercentage: 2.0, // 2% performance target
  bookingPriceExceedsPreCosting: {
    showAlert: true,
    requireReason: true,
    requireSpecialApproval: true,
  },
  savingTargetException: {
    showAlert: true,
    requireReason: true,
    requireSpecialApproval: false,
  },
  itemWastageRule: "ItemSpecific",
  countryBreakdownRequired: true,
  fobEditAuthorizedRoles: ["Merchandising Manager", "Head of Merchandising", "Admin"],
  bomEditAuthorizedRoles: ["Merchandiser", "Senior Merchandiser", "Supply Chain Manager", "Admin"],
  orderClosureAuthorizedRoles: ["Merchandising Manager", "Head of Merchandising", "Admin"],
  bookingAmendmentApprovalRequired: true,
  approvalRoles: [
    { roleName: "Senior Merchandiser", approvalLimitUsd: 15000, sequence: 1 },
    { roleName: "Merchandising Manager", approvalLimitUsd: 50000, sequence: 2 },
    { roleName: "Head of Merchandising", approvalLimitUsd: 250000, sequence: 3 },
    { roleName: "Managing Director", approvalLimitUsd: 9999999, sequence: 4 },
  ],
};

export const INITIAL_MM_QUOTATIONS: MMBuyerQuotation[] = [
  {
    id: "quot-001",
    quotationNo: "QT-2026-0091",
    companyName: "Pakiza Knit Composite Ltd",
    businessUnit: "Unit 2 - Garments",
    buyerName: "H&M Hennes & Mauritz",
    buyerDepartment: "Ladies Casual & Tops",
    localAgent: "Pakiza Global Sourcing",
    garmentType: "Knit",
    styleNo: "HM-KT-8841",
    styleDescription: "Ladies Ribbed Henley Neck T-Shirt",
    garmentItem: "Henley T-Shirt",
    season: "Autumn / Winter 2026",
    referenceNo: "INQ-HM-9982",
    quotationDate: "2026-09-10",
    validityDate: "2026-11-30",
    quantity: 45000,
    currency: "USD",
    unitPriceFob: 4.85,
    totalQuotationValue: 218250,
    paymentTerms: "LC 90 Days",
    deliveryTerms: "FOB Chattogram",
    shipmentDate: "2026-12-15",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-14",
    colorSizeBreakdown: [
      { color: "Black", size: "S", quantity: 5000 },
      { color: "Black", size: "M", quantity: 6000 },
      { color: "Black", size: "L", quantity: 4000 },
      { color: "Melange Grey", size: "S", quantity: 5000 },
      { color: "Melange Grey", size: "M", quantity: 7000 },
      { color: "Melange Grey", size: "L", quantity: 3000 },
      { color: "Olive Green", size: "S", quantity: 5000 },
      { color: "Olive Green", size: "M", quantity: 6000 },
      { color: "Olive Green", size: "L", quantity: 4000 },
    ],
    notes: "Fabric must be BCI Cotton certified. Enzyme wash finish required.",
    attachments: ["spec_sheet_HM_8841.pdf"],
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-10",
    version: 1,
  },
  {
    id: "quot-002",
    quotationNo: "QT-2026-0092",
    companyName: "Pakiza Knit Composite Ltd",
    businessUnit: "Unit 1 - Woven",
    buyerName: "Zara (Inditex)",
    buyerDepartment: "Menswear Denim & Twill",
    localAgent: "Inditex Dhaka Liaison",
    garmentType: "Woven",
    styleNo: "ZR-WV-4019",
    styleDescription: "Men Slim Fit Cotton Twill Chino Trouser",
    garmentItem: "Chino Trouser",
    season: "Spring / Summer 2027",
    referenceNo: "INQ-ZR-7714",
    quotationDate: "2026-09-22",
    validityDate: "2026-12-15",
    quantity: 32000,
    currency: "USD",
    unitPriceFob: 8.75,
    totalQuotationValue: 280000,
    paymentTerms: "TT 30 Days",
    deliveryTerms: "FOB Chattogram",
    shipmentDate: "2027-01-20",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-25",
    colorSizeBreakdown: [
      { color: "Khaki Tan", size: "30", quantity: 4000 },
      { color: "Khaki Tan", size: "32", quantity: 7000 },
      { color: "Khaki Tan", size: "34", quantity: 5000 },
      { color: "Navy Blue", size: "30", quantity: 4000 },
      { color: "Navy Blue", size: "32", quantity: 8000 },
      { color: "Navy Blue", size: "34", quantity: 4000 },
    ],
    notes: "Enzyme stone wash with slight whiskers. YKK Brass Zipper nominated.",
    attachments: ["cad_spec_ZR_4019.pdf"],
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-09-22",
    version: 1,
  },
  {
    id: "quot-003",
    quotationNo: "QT-2026-0095",
    companyName: "Pakiza Knit Composite Ltd",
    businessUnit: "Unit 2 - Garments",
    buyerName: "C&A Buying",
    buyerDepartment: "Kids Knitwear",
    localAgent: "Direct Sourcing",
    garmentType: "Knit",
    styleNo: "CA-KT-1092",
    styleDescription: "Toddler Organic Cotton Graphic Tee",
    garmentItem: "Round Neck T-Shirt",
    season: "Autumn / Winter 2026",
    referenceNo: "INQ-CA-3301",
    quotationDate: "2026-10-05",
    validityDate: "2026-12-30",
    quantity: 20000,
    currency: "USD",
    unitPriceFob: 3.20,
    totalQuotationValue: 64000,
    paymentTerms: "LC at Sight",
    deliveryTerms: "FOB Chattogram",
    shipmentDate: "2026-12-30",
    status: "Pending Approval",
    colorSizeBreakdown: [
      { color: "Sun Yellow", size: "2T", quantity: 5000 },
      { color: "Sun Yellow", size: "3T", quantity: 5000 },
      { color: "Sky Blue", size: "2T", quantity: 5000 },
      { color: "Sky Blue", size: "3T", quantity: 5000 },
    ],
    notes: "GOTS organic certified cotton required. Oeko-Tex Class 1 water-based print.",
    attachments: [],
    createdBy: "Assistant Merchandiser (Sumaia Akter)",
    createdDate: "2026-10-05",
    version: 1,
  },
];

export const INITIAL_MM_PRE_COSTINGS: MMPreCosting[] = [
  {
    id: "pc-001",
    preCostId: "PC-2026-001",
    jobNo: "JOB-2026-0001",
    quotationId: "quot-001",
    quotationNo: "QT-2026-0091",
    styleNo: "HM-KT-8841",
    styleDescription: "Ladies Ribbed Henley Neck T-Shirt",
    garmentType: "Knit",
    season: "Autumn / Winter 2026",
    buyerName: "H&M Hennes & Mauritz",
    currency: "USD",
    orderQuantity: 45000,
    totalOrderValue: 218250,
    version: 1,
    isCurrentActive: true,
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-18",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-15",
    cmCostPerDzn: 6.80,
    commercialCostPct: 3.5,
    commercialCostPerDzn: 1.45,
    profitPct: 8.0,
    profitPerDzn: 4.25,
    totalCostPerDzn: 54.00,
    costPerPc: 4.50,
    offeredFobPerPc: 4.85,
    items: [
      {
        preCostItemId: "PCI-101",
        category: "Fabric",
        itemCode: "FAB-KT-001",
        itemDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        specification: "2x2 Rib, 100% Combed Cotton, Bio-washed",
        bodyPartOrUsedPlace: "Main Body & Sleeves",
        consumptionPerPc: 0.28,
        unit: "Kg",
        wastagePct: 5.0,
        requiredQtyWithWastage: 3.528, // for 1 dzn (0.28 * 12 * 1.05)
        unitRate: 4.20, // $4.20/kg
        totalAmountPerDzn: 14.82,
        supplierNominee: "Pakiza Knitting & Dyeing",
      },
      {
        preCostItemId: "PCI-102",
        category: "Fabric",
        itemCode: "FAB-KT-002",
        itemDescription: "1x1 Cotton Spandex Rib 240 GSM",
        specification: "95% Cotton 5% Spandex, Matching Color",
        bodyPartOrUsedPlace: "Neckband & Placket Facing",
        consumptionPerPc: 0.04,
        unit: "Kg",
        wastagePct: 6.0,
        requiredQtyWithWastage: 0.509, // for 1 dzn
        unitRate: 5.10, // $5.10/kg
        totalAmountPerDzn: 2.60,
        supplierNominee: "Pakiza Knitting & Dyeing",
      },
      {
        preCostItemId: "PCI-103",
        category: "Accessories",
        itemCode: "ACC-BTN-01",
        itemDescription: "Natural Shell 4-Hole Button 18L",
        specification: "18L, 4 Holes, Engraved Edge, Dye to Match",
        bodyPartOrUsedPlace: "Front Placket (3 pcs/garment)",
        consumptionPerPc: 3,
        unit: "Pcs",
        wastagePct: 3.0,
        requiredQtyWithWastage: 37.08, // for 1 dzn
        unitRate: 0.035,
        totalAmountPerDzn: 1.30,
        supplierNominee: "Dekko Buttons Ltd",
      },
      {
        preCostItemId: "PCI-104",
        category: "Accessories",
        itemCode: "ACC-LBL-01",
        itemDescription: "Woven Main Brand Tag (H&M)",
        specification: "Damask Woven, Soft Edge, 45mm x 20mm",
        bodyPartOrUsedPlace: "Back Neck Center",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.045,
        totalAmountPerDzn: 0.55,
        supplierNominee: "Avery Dennison BD",
      },
      {
        preCostItemId: "PCI-105",
        category: "Accessories",
        itemCode: "ACC-LBL-02",
        itemDescription: "Satin Printed Care Label & RN#",
        specification: "Multi-language, QR code, Wash instructions",
        bodyPartOrUsedPlace: "Left Inner Side Seam",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.025,
        totalAmountPerDzn: 0.31,
        supplierNominee: "Avery Dennison BD",
      },
      {
        preCostItemId: "PCI-106",
        category: "Trims",
        itemCode: "TRM-THR-01",
        itemDescription: "100% Spun Poly Sewing Thread 40/2 & 50/2",
        specification: "High tenacity, color fastness 4-5",
        bodyPartOrUsedPlace: "Assembly & Hemming",
        consumptionPerPc: 110,
        unit: "Mtr",
        wastagePct: 8.0,
        requiredQtyWithWastage: 1425.6,
        unitRate: 0.0012,
        totalAmountPerDzn: 1.71,
        supplierNominee: "Coats Bangladesh",
      },
      {
        preCostItemId: "PCI-107",
        category: "Accessories",
        itemCode: "ACC-PAC-01",
        itemDescription: "Self-Adhesive Poly Bag & Master Carton",
        specification: "Recycled LDPE poly with warning, 5-ply carton",
        bodyPartOrUsedPlace: "Packing",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.12,
        totalAmountPerDzn: 1.47,
        supplierNominee: "Montrims Accessories",
      },
      {
        preCostItemId: "PCI-108",
        category: "Wash",
        itemCode: "WSH-ENZ-01",
        itemDescription: "Bio-Polishing & Silicon Softener Wash",
        specification: "Neutral enzyme, eco-friendly softener",
        bodyPartOrUsedPlace: "Full Garment Finish",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 0.0,
        requiredQtyWithWastage: 12.0,
        unitRate: 0.22,
        totalAmountPerDzn: 2.64,
        supplierNominee: "In-house Washing Plant",
      },
    ],
  },
  {
    id: "pc-002",
    preCostId: "PC-2026-002",
    jobNo: "JOB-2026-0002",
    quotationId: "quot-002",
    quotationNo: "QT-2026-0092",
    styleNo: "ZR-WV-4019",
    styleDescription: "Men Slim Fit Cotton Twill Chino Trouser",
    garmentType: "Woven",
    season: "Spring / Summer 2027",
    buyerName: "Zara (Inditex)",
    currency: "USD",
    orderQuantity: 28000,
    totalOrderValue: 245000,
    version: 1,
    isCurrentActive: true,
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-28",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-09-25",
    cmCostPerDzn: 18.50,
    commercialCostPct: 4.0,
    commercialCostPerDzn: 3.45,
    profitPct: 9.0,
    profitPerDzn: 8.80,
    totalCostPerDzn: 98.40,
    costPerPc: 8.20,
    offeredFobPerPc: 8.75,
    items: [
      {
        preCostItemId: "PCI-201",
        category: "Fabric",
        itemCode: "FAB-WV-001",
        itemDescription: "98% Cotton 2% Spandex Stretch Twill 280 GSM",
        specification: "16x12+70D / 108x56, Width 57/58 Inch",
        bodyPartOrUsedPlace: "Main Shell Trouser",
        consumptionPerPc: 1.45,
        unit: "Yds",
        wastagePct: 6.0,
        requiredQtyWithWastage: 18.444, // for 1 dzn
        unitRate: 2.65, // $2.65/yd
        totalAmountPerDzn: 48.88,
        supplierNominee: "Ha-Meem Textile Mills",
      },
      {
        preCostItemId: "PCI-202",
        category: "Fabric",
        itemCode: "FAB-WV-002",
        itemDescription: "65/35 TC Pocketing Twill Fabric 120 GSM",
        specification: "T/C Bleached / Solid dyed pocket bag",
        bodyPartOrUsedPlace: "Front & Back Pocket Bags & Waistband Facing",
        consumptionPerPc: 0.35,
        unit: "Yds",
        wastagePct: 5.0,
        requiredQtyWithWastage: 4.41,
        unitRate: 1.15,
        totalAmountPerDzn: 5.07,
        supplierNominee: "Noman Weaving Mills",
      },
      {
        preCostItemId: "PCI-203",
        category: "Accessories",
        itemCode: "ACC-ZIP-01",
        itemDescription: "YKK #4.5 Brass Metal Zipper Semi-Auto Lock",
        specification: "6.5 Inch Closed-end, Antique Brass Teeth",
        bodyPartOrUsedPlace: "Front Fly",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.32,
        totalAmountPerDzn: 3.92,
        supplierNominee: "YKK Bangladesh",
      },
      {
        preCostItemId: "PCI-204",
        category: "Accessories",
        itemCode: "ACC-BTN-02",
        itemDescription: "Horn Button 32L & 24L with Zara Logo",
        specification: "32L waist button (1 pc), 24L back pocket (2 pcs)",
        bodyPartOrUsedPlace: "Waist & Back Welt Pockets",
        consumptionPerPc: 3,
        unit: "Pcs",
        wastagePct: 3.0,
        requiredQtyWithWastage: 37.08,
        unitRate: 0.055,
        totalAmountPerDzn: 2.04,
        supplierNominee: "Dekko Buttons Ltd",
      },
      {
        preCostItemId: "PCI-205",
        category: "Accessories",
        itemCode: "ACC-TAG-01",
        itemDescription: "Genuine Leather Back Waistband Brand Tag",
        specification: "Vegetable tanned embossed leather patch 60x40mm",
        bodyPartOrUsedPlace: "Back Right Waistband",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.28,
        totalAmountPerDzn: 3.43,
        supplierNominee: "Avery Dennison BD",
      },
      {
        preCostItemId: "PCI-206",
        category: "Accessories",
        itemCode: "ACC-LBL-03",
        itemDescription: "Printed Satin Care Label & Barcode Tag",
        specification: "Multi-fold satin label + FSC hangtag",
        bodyPartOrUsedPlace: "Inner Waistband & Belt Loop",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.06,
        totalAmountPerDzn: 0.73,
        supplierNominee: "Montrims Accessories",
      },
      {
        preCostItemId: "PCI-207",
        category: "Wash",
        itemCode: "WSH-CHINO-01",
        itemDescription: "Heavy Enzyme Garment Wash + Silicon Softener",
        specification: "Soft peach hand feel, vintage look",
        bodyPartOrUsedPlace: "Finished Garment",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 0.0,
        requiredQtyWithWastage: 12.0,
        unitRate: 0.45,
        totalAmountPerDzn: 5.40,
        supplierNominee: "Pakiza Washing Plant",
      },
    ],
  },
  {
    id: "pc-003",
    preCostId: "PC-2026-003",
    jobNo: "JOB-2026-0003",
    quotationId: "quot-003",
    quotationNo: "QT-2026-0095",
    styleNo: "MS-KT-5520",
    styleDescription: "Men Pique Polo Shirt",
    garmentType: "Knit",
    season: "Summer 2026",
    buyerName: "Marks & Spencer",
    currency: "USD",
    orderQuantity: 15000,
    totalOrderValue: 97500,
    version: 1,
    isCurrentActive: true,
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-02",
    createdBy: "Tanvir Ahmed (Key Account Manager)",
    createdDate: "2026-10-01",
    cmCostPerDzn: 12.00,
    commercialCostPct: 3.5,
    commercialCostPerDzn: 2.10,
    profitPct: 8.5,
    profitPerDzn: 5.50,
    totalCostPerDzn: 72.00,
    costPerPc: 6.00,
    offeredFobPerPc: 6.50,
    items: [
      {
        preCostItemId: "PCI-301",
        category: "Fabric",
        itemCode: "FAB-KT-003",
        itemDescription: "100% Combed Cotton Honeycomb Pique 230 GSM",
        specification: "Combed Cotton Pique, Compact Yarn",
        bodyPartOrUsedPlace: "Main Body",
        consumptionPerPc: 0.32,
        unit: "Kg",
        wastagePct: 5.0,
        requiredQtyWithWastage: 4.032,
        unitRate: 4.80,
        totalAmountPerDzn: 19.35,
        supplierNominee: "Pakiza Knitting & Dyeing",
      },
      {
        preCostItemId: "PCI-302",
        category: "Accessories",
        itemCode: "ACC-BTN-03",
        itemDescription: "Mother of Pearl Button 18L",
        specification: "18L Laser Engraved 2-hole MOP",
        bodyPartOrUsedPlace: "Front Placket",
        consumptionPerPc: 3,
        unit: "Pcs",
        wastagePct: 3.0,
        requiredQtyWithWastage: 37.08,
        unitRate: 0.08,
        totalAmountPerDzn: 2.97,
        supplierNominee: "Dekko Buttons Ltd",
      },
    ],
  },
];

export const INITIAL_MM_ORDERS: MMMainOrder[] = [
  {
    id: "ord-001",
    jobNo: "JOB-2026-0001",
    orderNo: "ORD-2026-0041",
    orderType: "Regular",
    buyerName: "H&M Hennes & Mauritz",
    buyerDepartment: "Ladies Casual & Tops",
    companyName: "Pakiza Knit Composite Ltd",
    businessUnit: "Unit 2 - Garments",
    styleNo: "HM-KT-8841",
    garmentItem: "Henley T-Shirt",
    season: "Autumn / Winter 2026",
    merchandisingRef: "MKT-HM-0941",
    buyerPoNumber: "PO-HM-99881",
    buyerPoDate: "2026-09-20",
    preCostId: "PC-2026-001",
    preCostVersion: 1,
    orderQuantity: 45000,
    fobUnitPrice: 4.85,
    totalOrderValue: 218250,
    currency: "USD",
    orderDate: "2026-09-20",
    shipmentDate: "2026-12-15",
    destinationCountry: "Germany",
    deliveryMode: "Sea",
    destinationPort: "Hamburg Port",
    orderStatus: "Open",

    // Specific Order Entry original fields
    newOrderRepeatOrder: "New Order",
    referenceStatus: "Confirmed",
    ourRef: "REF-PAK-2026-HM01",
    orderSl: "SL-0041",
    copyFromOurRef: "",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    localAgent: "Li & Fung (Bangladesh)",
    merchan: "Rashidul Islam (Head of Merchandising)",
    acHolder: "Standard Chartered Bank - Main Account",
    deptCode: "DEPT-88",
    place: "Front Chest / Garment Body",
    packType: "Single Poly Pack",
    processName: "Knit-Dye-Sew-Wash",
    size: "S-L (Standard Tops)",
    payTerm: "LC at Sight",
    cm: 1.25,
    pcs: 1,
    firstDelDate: "2026-12-05",
    confirmDate: "2026-09-20",
    extraCuttingPct: 3.0,
    smv: 14.5,
    delDate: "2026-12-15",
    pcd: "2026-11-10",
    instructionDetail: "Ensure strict color fastness to washing (Grade 4 minimum). Needle detector certificate required for export packing.",
    fabricRequirementDetails: "Single Jersey 100% Combed Cotton 160 GSM (7,344 Kgs) — Approved Ha-Meem Mills Lot #H-992",
    accessoriesRequirementDetails: "Engraved 4-hole chalk buttons (93,600 pcs), Woven main label & satin care label (46,800 sets)",

    // Delivery Lots Table
    deliveryLots: [
      { id: "lot-001-1", lotNumber: "LOT-01", quantity: 25000, deliveryDate: "2026-12-05" },
      { id: "lot-001-2", lotNumber: "LOT-02", quantity: 20000, deliveryDate: "2026-12-15" },
    ],

    // PO / Order Details Table with linked PO-wise breakdowns
    poDetails: [
      {
        id: "po-row-001-1",
        no: 1,
        projection: "Confirmed",
        po: "Main",
        qty: 25000,
        lot: "LOT-01",
        poNumber: "PO-HM-99881-A",
        poDesc: "EU Retail Store Replenishment",
        rate: 4.85,
        value: 121250,
        delDate: "2026-12-10",
        pcd: "2026-11-10",
        destCountry: "Germany",
        delMode: "Sea",
        destPort: "Hamburg Port",
        v: "V1",
        s: "FOB",
        size: "S-L",
        breakdown: {
          poId: "po-row-001-1",
          poNumber: "PO-HM-99881-A",
          poQty: 25000,
          lotNo: "LOT-01",
          ratioWiseQtyChange: false,
          sizeFromBuyerDept: "Standard Adult (S, M, L)",
          countryBreakdown: "Germany",
          note: "Lot 1 direct shipment to Hamburg Seaport",
          company: "Pakiza Knit Composite Ltd",
          lineName: "Line 01 - Sewing",
          startDate: "2026-10-01",
          finishDate: "2026-11-15",
          planQty: 25000,
          colorBreakdowns: [
            {
              id: "cb-001-1-1",
              color: "Black",
              rate: 4.85,
              assrtStatus: "Solid",
              quantity: 15000,
              sizeRows: [
                { id: "sr-1", size: "S", ratio: 1, quantity: 5000, rate: 4.85, total: 24250 },
                { id: "sr-2", size: "M", ratio: 2, quantity: 6000, rate: 4.85, total: 29100 },
                { id: "sr-3", size: "L", ratio: 1, quantity: 4000, rate: 4.85, total: 19400 },
              ],
            },
            {
              id: "cb-001-1-2",
              color: "Melange Grey",
              rate: 4.85,
              assrtStatus: "Solid",
              quantity: 10000,
              sizeRows: [
                { id: "sr-4", size: "S", ratio: 1, quantity: 3000, rate: 4.85, total: 14550 },
                { id: "sr-5", size: "M", ratio: 2, quantity: 4500, rate: 4.85, total: 21825 },
                { id: "sr-6", size: "L", ratio: 1, quantity: 2500, rate: 4.85, total: 12125 },
              ],
            },
          ],
        },
      },
      {
        id: "po-row-001-2",
        no: 2,
        projection: "Confirmed",
        po: "Sub",
        qty: 20000,
        lot: "LOT-02",
        poNumber: "PO-HM-99881-B",
        poDesc: "Nordic Distribution Hub",
        rate: 4.85,
        value: 97000,
        delDate: "2026-12-15",
        pcd: "2026-11-20",
        destCountry: "Sweden",
        delMode: "Sea",
        destPort: "Gothenburg Port",
        v: "V1",
        s: "FOB",
        size: "S-L",
        breakdown: {
          poId: "po-row-001-2",
          poNumber: "PO-HM-99881-B",
          poQty: 20000,
          lotNo: "LOT-02",
          ratioWiseQtyChange: false,
          sizeFromBuyerDept: "Standard Adult (S, M, L)",
          countryBreakdown: "Sweden",
          note: "Lot 2 direct shipment to Gothenburg",
          company: "Pakiza Knit Composite Ltd",
          lineName: "Line 02 - Sewing",
          startDate: "2026-10-15",
          finishDate: "2026-11-25",
          planQty: 20000,
          colorBreakdowns: [
            {
              id: "cb-001-2-1",
              color: "Melange Grey",
              rate: 4.85,
              assrtStatus: "Solid",
              quantity: 5000,
              sizeRows: [
                { id: "sr-7", size: "S", ratio: 1, quantity: 1500, rate: 4.85, total: 7275 },
                { id: "sr-8", size: "M", ratio: 2, quantity: 2500, rate: 4.85, total: 12125 },
                { id: "sr-9", size: "L", ratio: 1, quantity: 1000, rate: 4.85, total: 4850 },
              ],
            },
            {
              id: "cb-001-2-2",
              color: "Olive Green",
              rate: 4.85,
              assrtStatus: "Solid",
              quantity: 15000,
              sizeRows: [
                { id: "sr-10", size: "S", ratio: 1, quantity: 5500, rate: 4.85, total: 26675 },
                { id: "sr-11", size: "M", ratio: 2, quantity: 6000, rate: 4.85, total: 29100 },
                { id: "sr-12", size: "L", ratio: 1, quantity: 3500, rate: 4.85, total: 16975 },
              ],
            },
          ],
        },
      },
    ],

    colorWiseBreakdown: [
      { color: "Black", quantity: 15000 },
      { color: "Melange Grey", quantity: 15000 },
      { color: "Olive Green", quantity: 15000 },
    ],
    sizeWiseBreakdown: [
      { size: "S", quantity: 15000 },
      { size: "M", quantity: 19000 },
      { size: "L", quantity: 11000 },
    ],
    poWiseBreakdown: [
      { poNumber: "PO-HM-99881-A", poDate: "2026-09-20", shipmentDate: "2026-12-10", quantity: 25000, destinationCountry: "Germany" },
      { poNumber: "PO-HM-99881-B", poDate: "2026-09-20", shipmentDate: "2026-12-15", quantity: 20000, destinationCountry: "Sweden" },
    ],
    lotWiseBreakdown: [
      { lotNumber: "LOT-01", deliveryDate: "2026-12-05", quantity: 25000, deliveryMode: "Sea", destinationPort: "Hamburg" },
      { lotNumber: "LOT-02", deliveryDate: "2026-12-15", quantity: 20000, deliveryMode: "Sea", destinationPort: "Gothenburg" },
    ],
    countryWiseBreakdown: [
      { country: "Germany", quantity: 25000 },
      { country: "Sweden", quantity: 20000 },
    ],
    notes: "Approved gold seal sample dispatched. Strictly follow pre-costing supplier nominees.",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-20",
    fobAuditLog: [],
    closureAuditLog: [],
  },
  {
    id: "ord-002",
    jobNo: "JOB-2026-0002",
    orderNo: "ORD-2026-0042",
    orderType: "Regular",
    buyerName: "Zara (Inditex)",
    buyerDepartment: "Menswear Denim & Twill",
    companyName: "Pakiza Knit Composite Ltd",
    businessUnit: "Unit 1 - Woven",
    styleNo: "ZR-WV-4019",
    garmentItem: "Chino Trouser",
    season: "Spring / Summer 2027",
    merchandisingRef: "MKT-ZR-1042",
    buyerPoNumber: "PO-ZR-44021",
    buyerPoDate: "2026-09-30",
    preCostId: "PC-2026-002",
    preCostVersion: 1,
    orderQuantity: 32000,
    fobUnitPrice: 8.75,
    totalOrderValue: 280000,
    currency: "USD",
    orderDate: "2026-09-30",
    shipmentDate: "2027-01-20",
    destinationCountry: "Spain",
    deliveryMode: "Sea",
    destinationPort: "Valencia Port",
    orderStatus: "Open",

    // Specific Order Entry original fields
    newOrderRepeatOrder: "New Order",
    referenceStatus: "Confirmed",
    ourRef: "REF-PAK-2026-ZR02",
    orderSl: "SL-0042",
    copyFromOurRef: "",
    beneficiaryCompany: "Pakiza Knit Composite Ltd",
    localAgent: "William E. Connor",
    merchan: "Nafis Imtiaz",
    acHolder: "HSBC Corporate USD A/C",
    deptCode: "DEPT-12",
    place: "Waistband & Back Pocket",
    packType: "Hanger Pack",
    processName: "Cut-Sew-Wash-Finish",
    size: "30-34 (Waist Sizes)",
    payTerm: "TT 30 Days",
    cm: 2.2,
    pcs: 1,
    firstDelDate: "2027-01-10",
    confirmDate: "2026-09-30",
    extraCuttingPct: 3.0,
    smv: 18.2,
    delDate: "2027-01-20",
    pcd: "2026-11-25",
    instructionDetail: "Zara standard metal shank button and YKK brass zipper mandatory. Certificate of origin and EUR.1 movement certificate required.",
    fabricRequirementDetails: "Cotton Stretch Twill 98% Cotton 2% Spandex 240 GSM (13,056 Yds) — Square Textiles",
    accessoriesRequirementDetails: "YKK Antique Brass #4 Zipper (32,640 Pcs), Genuine Leather Back Patch (32,640 Pcs)",

    // Delivery Lots Table
    deliveryLots: [
      { id: "lot-002-1", lotNumber: "LOT-01", quantity: 20000, deliveryDate: "2027-01-10" },
      { id: "lot-002-2", lotNumber: "LOT-02", quantity: 12000, deliveryDate: "2027-01-20" },
    ],

    // PO / Order Details Table with linked PO-wise breakdowns
    poDetails: [
      {
        id: "po-row-002-1",
        no: 1,
        projection: "Confirmed",
        po: "Main",
        qty: 20000,
        lot: "LOT-01",
        poNumber: "PO-ZR-44021-ES",
        poDesc: "Zara Spain Logistics Hub",
        rate: 8.75,
        value: 175000,
        delDate: "2027-01-15",
        pcd: "2026-11-25",
        destCountry: "Spain",
        delMode: "Sea",
        destPort: "Valencia Port",
        v: "V1",
        s: "FOB",
        size: "30-34",
        breakdown: {
          poId: "po-row-002-1",
          poNumber: "PO-ZR-44021-ES",
          poQty: 20000,
          lotNo: "LOT-01",
          ratioWiseQtyChange: false,
          sizeFromBuyerDept: "Denim Waist (30, 32, 34)",
          countryBreakdown: "Spain",
          note: "Valencia consignment",
          company: "Pakiza Knit Composite Ltd",
          lineName: "Line 03 - Woven",
          startDate: "2026-11-01",
          finishDate: "2026-12-20",
          planQty: 20000,
          colorBreakdowns: [
            {
              id: "cb-002-1-1",
              color: "Khaki Tan",
              rate: 8.75,
              assrtStatus: "Solid",
              quantity: 10000,
              sizeRows: [
                { id: "sr-13", size: "30", ratio: 1, quantity: 2500, rate: 8.75, total: 21875 },
                { id: "sr-14", size: "32", ratio: 2, quantity: 5000, rate: 8.75, total: 43750 },
                { id: "sr-15", size: "34", ratio: 1, quantity: 2500, rate: 8.75, total: 21875 },
              ],
            },
            {
              id: "cb-002-1-2",
              color: "Navy Blue",
              rate: 8.75,
              assrtStatus: "Solid",
              quantity: 10000,
              sizeRows: [
                { id: "sr-16", size: "30", ratio: 1, quantity: 2500, rate: 8.75, total: 21875 },
                { id: "sr-17", size: "32", ratio: 2, quantity: 5000, rate: 8.75, total: 43750 },
                { id: "sr-18", size: "34", ratio: 1, quantity: 2500, rate: 8.75, total: 21875 },
              ],
            },
          ],
        },
      },
      {
        id: "po-row-002-2",
        no: 2,
        projection: "Confirmed",
        po: "Sub",
        qty: 12000,
        lot: "LOT-02",
        poNumber: "PO-ZR-44021-FR",
        poDesc: "Inditex France Distribution",
        rate: 8.75,
        value: 105000,
        delDate: "2027-01-20",
        pcd: "2026-12-05",
        destCountry: "France",
        delMode: "Sea",
        destPort: "Marseille Port",
        v: "V1",
        s: "FOB",
        size: "30-34",
        breakdown: {
          poId: "po-row-002-2",
          poNumber: "PO-ZR-44021-FR",
          poQty: 12000,
          lotNo: "LOT-02",
          ratioWiseQtyChange: false,
          sizeFromBuyerDept: "Denim Waist (30, 32, 34)",
          countryBreakdown: "France",
          note: "Marseille consignment",
          company: "Pakiza Knit Composite Ltd",
          lineName: "Line 04 - Woven",
          startDate: "2026-11-15",
          finishDate: "2026-12-30",
          planQty: 12000,
          colorBreakdowns: [
            {
              id: "cb-002-2-1",
              color: "Khaki Tan",
              rate: 8.75,
              assrtStatus: "Solid",
              quantity: 6000,
              sizeRows: [
                { id: "sr-19", size: "30", ratio: 1, quantity: 1500, rate: 8.75, total: 13125 },
                { id: "sr-20", size: "32", ratio: 2, quantity: 3000, rate: 8.75, total: 26250 },
                { id: "sr-21", size: "34", ratio: 1, quantity: 1500, rate: 8.75, total: 13125 },
              ],
            },
            {
              id: "cb-002-2-2",
              color: "Navy Blue",
              rate: 8.75,
              assrtStatus: "Solid",
              quantity: 6000,
              sizeRows: [
                { id: "sr-22", size: "30", ratio: 1, quantity: 1500, rate: 8.75, total: 13125 },
                { id: "sr-23", size: "32", ratio: 2, quantity: 3000, rate: 8.75, total: 26250 },
                { id: "sr-24", size: "34", ratio: 1, quantity: 1500, rate: 8.75, total: 13125 },
              ],
            },
          ],
        },
      },
    ],

    colorWiseBreakdown: [
      { color: "Khaki Tan", quantity: 16000 },
      { color: "Navy Blue", quantity: 16000 },
    ],
    sizeWiseBreakdown: [
      { size: "30", quantity: 8000 },
      { size: "32", quantity: 15000 },
      { size: "34", quantity: 9000 },
    ],
    poWiseBreakdown: [
      { poNumber: "PO-ZR-44021-ES", poDate: "2026-09-30", shipmentDate: "2027-01-15", quantity: 20000, destinationCountry: "Spain" },
      { poNumber: "PO-ZR-44021-FR", poDate: "2026-09-30", shipmentDate: "2027-01-20", quantity: 12000, destinationCountry: "France" },
    ],
    lotWiseBreakdown: [
      { lotNumber: "LOT-01", deliveryDate: "2027-01-10", quantity: 20000, deliveryMode: "Sea", destinationPort: "Valencia" },
      { lotNumber: "LOT-02", deliveryDate: "2027-01-20", quantity: 12000, deliveryMode: "Sea", destinationPort: "Marseille" },
    ],
    countryWiseBreakdown: [
      { country: "Spain", quantity: 20000 },
      { country: "France", quantity: 12000 },
    ],
    notes: "Zara nominated YKK zipper and leather tag must be verified before mass cutting.",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-09-30",
    fobAuditLog: [],
    closureAuditLog: [],
  },
];

export const INITIAL_MM_BOMS: MMBOM[] = [
  {
    id: "bom-001",
    bomId: "BOM-2026-001",
    orderId: "ord-001",
    orderNo: "ORD-2026-0041",
    styleNo: "HM-KT-8841",
    preCostId: "PC-2026-001",
    preCostVersion: 1,
    status: "Released",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-22",
    totalBomCost: 198450,
    items: [
      {
        bomItemId: "BOMI-001",
        preCostItemId: "PCI-101",
        isUnmatchedAdditional: false,
        category: "Fabric",
        itemCode: "FAB-KT-001",
        itemDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        specification: "2x2 Rib, 100% Combed Cotton, Bio-washed",
        bodyPartOrUsedPlace: "Main Body & Sleeves",
        preCostEstimatedQty: 13230, // 45000 pcs * 0.28kg * 1.05 = 13230 kg
        preCostRate: 4.20,
        preCostUnit: "Kg",
        preCostAmount: 55566,
        bomConsumptionPerPc: 0.28,
        bomWastagePct: 5.0,
        bomTotalRequiredQty: 13230,
        bomUnit: "Kg",
        bomEstimatedRate: 4.20,
        bomEstimatedCost: 55566,
        supplierNominee: "Pakiza Knitting & Dyeing",
      },
      {
        bomItemId: "BOMI-002",
        preCostItemId: "PCI-102",
        isUnmatchedAdditional: false,
        category: "Fabric",
        itemCode: "FAB-KT-002",
        itemDescription: "1x1 Cotton Spandex Rib 240 GSM",
        specification: "95% Cotton 5% Spandex",
        bodyPartOrUsedPlace: "Neckband & Placket Facing",
        preCostEstimatedQty: 1908,
        preCostRate: 5.10,
        preCostUnit: "Kg",
        preCostAmount: 9730.80,
        bomConsumptionPerPc: 0.04,
        bomWastagePct: 6.0,
        bomTotalRequiredQty: 1908,
        bomUnit: "Kg",
        bomEstimatedRate: 5.10,
        bomEstimatedCost: 9730.80,
        supplierNominee: "Pakiza Knitting & Dyeing",
      },
      {
        bomItemId: "BOMI-003",
        preCostItemId: "PCI-103",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-BTN-01",
        itemDescription: "Natural Shell 4-Hole Button 18L",
        specification: "18L, 4 Holes, Engraved Edge",
        bodyPartOrUsedPlace: "Front Placket",
        preCostEstimatedQty: 139050, // 45000 * 3 * 1.03
        preCostRate: 0.035,
        preCostUnit: "Pcs",
        preCostAmount: 4866.75,
        bomConsumptionPerPc: 3,
        bomWastagePct: 3.0,
        bomTotalRequiredQty: 139050,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.035,
        bomEstimatedCost: 4866.75,
        supplierNominee: "Dekko Buttons Ltd",
      },
      {
        bomItemId: "BOMI-004",
        preCostItemId: "PCI-104",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-LBL-01",
        itemDescription: "Woven Main Brand Tag (H&M)",
        specification: "Damask Woven, Soft Edge",
        bodyPartOrUsedPlace: "Back Neck Center",
        preCostEstimatedQty: 45900,
        preCostRate: 0.045,
        preCostUnit: "Pcs",
        preCostAmount: 2065.50,
        bomConsumptionPerPc: 1,
        bomWastagePct: 2.0,
        bomTotalRequiredQty: 45900,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.045,
        bomEstimatedCost: 2065.50,
        supplierNominee: "Avery Dennison BD",
      },
      {
        bomItemId: "BOMI-005",
        preCostItemId: "PCI-105",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-LBL-02",
        itemDescription: "Satin Printed Care Label & RN#",
        specification: "Multi-language QR code",
        bodyPartOrUsedPlace: "Left Inner Side Seam",
        preCostEstimatedQty: 45900,
        preCostRate: 0.025,
        preCostUnit: "Pcs",
        preCostAmount: 1147.50,
        bomConsumptionPerPc: 1,
        bomWastagePct: 2.0,
        bomTotalRequiredQty: 45900,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.025,
        bomEstimatedCost: 1147.50,
        supplierNominee: "Avery Dennison BD",
      },
      {
        bomItemId: "BOMI-006",
        preCostItemId: "PCI-106",
        isUnmatchedAdditional: false,
        category: "Trims",
        itemCode: "TRM-THR-01",
        itemDescription: "100% Spun Poly Sewing Thread 40/2 & 50/2",
        specification: "High tenacity, color fastness 4-5",
        bodyPartOrUsedPlace: "Assembly & Hemming",
        preCostEstimatedQty: 5346000,
        preCostRate: 0.0012,
        preCostUnit: "Mtr",
        preCostAmount: 6415.20,
        bomConsumptionPerPc: 110,
        bomWastagePct: 8.0,
        bomTotalRequiredQty: 5346000,
        bomUnit: "Mtr",
        bomEstimatedRate: 0.0012,
        bomEstimatedCost: 6415.20,
        supplierNominee: "Coats Bangladesh",
      },
    ],
  },
  {
    id: "bom-002",
    bomId: "BOM-2026-002",
    orderId: "ord-002",
    orderNo: "ORD-2026-0042",
    styleNo: "ZR-WV-4019",
    preCostId: "PC-2026-002",
    preCostVersion: 1,
    status: "Released",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-02",
    totalBomCost: 201200,
    items: [
      {
        bomItemId: "BOMI-201",
        preCostItemId: "PCI-201",
        isUnmatchedAdditional: false,
        category: "Fabric",
        itemCode: "FAB-WV-001",
        itemDescription: "98% Cotton 2% Spandex Stretch Twill 280 GSM",
        specification: "Width 57/58 Inch",
        bodyPartOrUsedPlace: "Main Shell Trouser",
        preCostEstimatedQty: 49184, // 32000 * 1.45 * 1.06
        preCostRate: 2.65,
        preCostUnit: "Yds",
        preCostAmount: 130337.60,
        bomConsumptionPerPc: 1.45,
        bomWastagePct: 6.0,
        bomTotalRequiredQty: 49184,
        bomUnit: "Yds",
        bomEstimatedRate: 2.65,
        bomEstimatedCost: 130337.60,
        supplierNominee: "Ha-Meem Textile Mills",
      },
      {
        bomItemId: "BOMI-202",
        preCostItemId: "PCI-202",
        isUnmatchedAdditional: false,
        category: "Fabric",
        itemCode: "FAB-WV-002",
        itemDescription: "65/35 TC Pocketing Twill Fabric 120 GSM",
        specification: "Bleached / Solid dyed pocket bag",
        bodyPartOrUsedPlace: "Front & Back Pocket Bags",
        preCostEstimatedQty: 11760,
        preCostRate: 1.15,
        preCostUnit: "Yds",
        preCostAmount: 13524.00,
        bomConsumptionPerPc: 0.35,
        bomWastagePct: 5.0,
        bomTotalRequiredQty: 11760,
        bomUnit: "Yds",
        bomEstimatedRate: 1.15,
        bomEstimatedCost: 13524.00,
        supplierNominee: "Noman Weaving Mills",
      },
      {
        bomItemId: "BOMI-203",
        preCostItemId: "PCI-203",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-ZIP-01",
        itemDescription: "YKK #4.5 Brass Metal Zipper Semi-Auto Lock",
        specification: "6.5 Inch Closed-end Antique Brass",
        bodyPartOrUsedPlace: "Front Fly",
        preCostEstimatedQty: 32640,
        preCostRate: 0.32,
        preCostUnit: "Pcs",
        preCostAmount: 10444.80,
        bomConsumptionPerPc: 1,
        bomWastagePct: 2.0,
        bomTotalRequiredQty: 32640,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.32,
        bomEstimatedCost: 10444.80,
        supplierNominee: "YKK Bangladesh",
      },
      {
        bomItemId: "BOMI-204",
        preCostItemId: "PCI-204",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-BTN-02",
        itemDescription: "Horn Button 32L & 24L with Zara Logo",
        specification: "Horn button with laser logo",
        bodyPartOrUsedPlace: "Waist & Back Welt Pockets",
        preCostEstimatedQty: 98880,
        preCostRate: 0.055,
        preCostUnit: "Pcs",
        preCostAmount: 5438.40,
        bomConsumptionPerPc: 3,
        bomWastagePct: 3.0,
        bomTotalRequiredQty: 98880,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.055,
        bomEstimatedCost: 5438.40,
        supplierNominee: "Dekko Buttons Ltd",
      },
      {
        bomItemId: "BOMI-205",
        preCostItemId: "PCI-205",
        isUnmatchedAdditional: false,
        category: "Accessories",
        itemCode: "ACC-TAG-01",
        itemDescription: "Genuine Leather Back Waistband Brand Tag",
        specification: "Embossed patch 60x40mm",
        bodyPartOrUsedPlace: "Back Right Waistband",
        preCostEstimatedQty: 32640,
        preCostRate: 0.28,
        preCostUnit: "Pcs",
        preCostAmount: 9139.20,
        bomConsumptionPerPc: 1,
        bomWastagePct: 2.0,
        bomTotalRequiredQty: 32640,
        bomUnit: "Pcs",
        bomEstimatedRate: 0.28,
        bomEstimatedCost: 9139.20,
        supplierNominee: "Avery Dennison BD",
      },
    ],
  },
];

export const INITIAL_MM_FABRIC_BOOKINGS: MMFabricBooking[] = [
  {
    id: "fb-001",
    bookingNo: "JOB-2026-0001/01",
    supplierName: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-09-24",
    deliveryDate: "2026-10-30",
    deliveryMode: "Road",
    loadPort: "Factory Warehouse",
    destinationPlace: "Pakiza Knit Cutting Floor",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-26",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-24",
    totalBookedQty: 15138,
    totalBookedAmount: 63635.80,
    totalPreCostAmount: 65296.80,
    totalSavingAmount: 1661.00,
    overallSavingPct: 2.54, // Meets 2% saving target!
    supplierId: "sup-001",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDescription: "Main production fabric booking for H&M Henley T-Shirt order",
    bookingType: "Main Fabric Booking",
    bookingUnit: "Pakiza Knit Composite Ltd.",
    deliveryPlace: "Pakiza Knit Cutting Floor",
    destination: "Pakiza Knit Cutting Floor",
    cp: "Md. Tanvir Ahmed",
    ourRef: "JOB-2026-0001",
    totalAmount: 63635.80,
    notes: "Fabric must be tested for shrinkage (< 4%) and spirality (< 3%).",
    termsAndConditions: "Standard Pakiza Dyeing Quality SLA applies.",
    lines: [
      {
        id: "fbl-001",
        fabricEstimationId: "fe-001",
        fabricEstimationItemId: "fab-001",
        jobId: "JOB-2026-0001",
        ourRef: "JOB-2026-0001",
        styleNo: "HM-KT-8841",
        styleNameSnapshot: "Ladies Ribbed Henley Neck T-Shirt",
        buyerNameSnapshot: "H&M Hennes & Mauritz",
        supplierId: "sup-001",
        fabricCode: "FAB-001",
        fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        width: '48" Open',
        usedPlace: "Body & Trims",
        grpType: "Main Body",
        color: "Solid Reactive Dyeing",
        unit: "Kg",
        requiredQuantity: 13230,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 13230,
        bookingQuantity: 13230,
        receivedQuantity: 0,
        rate: 4.10,
        currency: "USD",
        lineTotal: 54243.00,
        budgetValue: 55566.00,
        rcv: false,
        allocations: [
          {
            id: "fba-001",
            orderId: "ord-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            colorName: "Black",
            countryName: "Germany",
            garmentOrderQuantity: 10000,
            estimatedFabricRequirement: 6615,
            previouslyBookedQuantity: 0,
            remainingRequirement: 0,
            suggestedBookingQuantity: 6615,
            bookingQuantity: 6615,
            unit: "Kg",
          },
          {
            id: "fba-002",
            orderId: "ord-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            colorName: "Melange Grey",
            countryName: "Germany",
            garmentOrderQuantity: 10000,
            estimatedFabricRequirement: 6615,
            previouslyBookedQuantity: 0,
            remainingRequirement: 0,
            suggestedBookingQuantity: 6615,
            bookingQuantity: 6615,
            unit: "Kg",
          },
        ],
        bookingDetails: [
          {
            id: "fbd-001-1",
            bookingLineId: "fbl-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            countryName: "Germany",
            rcv: false,
            ourRef: "JOB-2026-0001",
            usedPlace: "Body & Trims",
            fabricCode: "FAB-001",
            fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
            width: '48" Open',
            garmentColor: "Black",
            fabricColor: "Black",
            requiredQuantity: 6615,
            unit: "Kg",
            bookingQuantity: 6615,
            receivedQuantity: 0,
            rate: 4.10,
            lineTotal: 27121.50,
          },
          {
            id: "fbd-001-2",
            bookingLineId: "fbl-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            countryName: "Germany",
            rcv: false,
            ourRef: "JOB-2026-0001",
            usedPlace: "Body & Trims",
            fabricCode: "FAB-001",
            fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
            width: '48" Open',
            garmentColor: "Melange Grey",
            fabricColor: "Melange Grey",
            requiredQuantity: 6615,
            unit: "Kg",
            bookingQuantity: 6615,
            receivedQuantity: 0,
            rate: 4.10,
            lineTotal: 27121.50,
          },
        ],
      },
      {
        id: "fbl-002",
        fabricEstimationId: "fe-001",
        fabricEstimationItemId: "fab-002",
        jobId: "JOB-2026-0001",
        ourRef: "JOB-2026-0001",
        styleNo: "HM-KT-8841",
        styleNameSnapshot: "Ladies Ribbed Henley Neck T-Shirt",
        buyerNameSnapshot: "H&M Hennes & Mauritz",
        supplierId: "sup-001",
        fabricCode: "FAB-002",
        fabricDescription: "1x1 Cotton Spandex Rib 240 GSM",
        width: '42" Tubular',
        usedPlace: "Collar & Cuff",
        grpType: "Rib / Trim",
        color: "Dye to Match (DTM)",
        unit: "Kg",
        requiredQuantity: 1908,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 1908,
        bookingQuantity: 1908,
        receivedQuantity: 0,
        rate: 4.92,
        currency: "USD",
        lineTotal: 9392.80,
        budgetValue: 9730.80,
        rcv: false,
        allocations: [
          {
            id: "fba-003",
            orderId: "ord-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            colorName: "Black",
            countryName: "Germany",
            garmentOrderQuantity: 10000,
            estimatedFabricRequirement: 954,
            previouslyBookedQuantity: 0,
            remainingRequirement: 0,
            suggestedBookingQuantity: 954,
            bookingQuantity: 954,
            unit: "Kg",
          },
          {
            id: "fba-004",
            orderId: "ord-001",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            colorName: "Melange Grey",
            countryName: "Germany",
            garmentOrderQuantity: 10000,
            estimatedFabricRequirement: 954,
            previouslyBookedQuantity: 0,
            remainingRequirement: 0,
            suggestedBookingQuantity: 954,
            bookingQuantity: 954,
            unit: "Kg",
          },
        ],
        bookingDetails: [
          {
            id: "fbd-002-1",
            bookingLineId: "fbl-002",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            countryName: "Germany",
            rcv: false,
            ourRef: "JOB-2026-0001",
            usedPlace: "Collar & Cuff",
            fabricCode: "FAB-002",
            fabricDescription: "1x1 Cotton Spandex Rib 240 GSM",
            width: '42" Tubular',
            garmentColor: "Black",
            fabricColor: "Black",
            requiredQuantity: 954,
            unit: "Kg",
            bookingQuantity: 954,
            receivedQuantity: 0,
            rate: 4.92,
            lineTotal: 4693.68,
          },
          {
            id: "fbd-002-2",
            bookingLineId: "fbl-002",
            poId: "po-001",
            poNumber: "PO-HM-99881-A",
            lotNumber: "LOT-01",
            countryName: "Germany",
            rcv: false,
            ourRef: "JOB-2026-0001",
            usedPlace: "Collar & Cuff",
            fabricCode: "FAB-002",
            fabricDescription: "1x1 Cotton Spandex Rib 240 GSM",
            width: '42" Tubular',
            garmentColor: "Melange Grey",
            fabricColor: "Melange Grey",
            requiredQuantity: 954,
            unit: "Kg",
            bookingQuantity: 954,
            receivedQuantity: 0,
            rate: 4.92,
            lineTotal: 4693.68,
          },
        ],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-001",
        estimationItemId: "FE-001",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        poNumber: "PO-HM-99881-A",
        preCostItemId: "PCI-101",
        fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        garmentColor: "Black & Melange Grey & Olive Green",
        fabricColor: "Solid Reactive Dyeing",
        diaGsm: "Width 48 Inch Open, 220 GSM",
        unit: "Kg",
        requiredQty: 13230,
        bookedQty: 13230,
        unitRate: 4.10, // Pre-Cost was 4.20 -> Saved $0.10/kg (2.38% saving!)
        totalAmount: 54243.00,
        preCostRate: 4.20,
        preCostAmount: 55566.00,
        initialSavingAmount: 1323.00,
        initialSavingPct: 2.38,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "FBI-002",
        estimationItemId: "FE-002",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        poNumber: "PO-HM-99881-A",
        preCostItemId: "PCI-102",
        fabricDescription: "1x1 Cotton Spandex Rib 240 GSM",
        garmentColor: "Matching Colors",
        fabricColor: "Dye to Match (DTM)",
        diaGsm: "Width 42 Inch Tubular, 240 GSM",
        unit: "Kg",
        requiredQty: 1908,
        bookedQty: 1908,
        unitRate: 4.92285, // Pre-Cost was 5.10 -> $9392.80 booked
        totalAmount: 9392.80,
        preCostRate: 5.10,
        preCostAmount: 9730.80,
        initialSavingAmount: 338.00,
        initialSavingPct: 3.47,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-pakiza-002",
    bookingNo: "JOB-2026-0002/01",
    supplierName: "Pakiza Knitting & Dyeing",
    supplierId: "sup-001",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-10-10",
    deliveryDate: "2026-11-15",
    deliveryMode: "Road",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    totalBookedQty: 5800,
    totalBookedAmount: 19040.0,
    totalAmount: 19040.0,
    totalPreCostAmount: 20200.0,
    totalSavingAmount: 1160.0,
    overallSavingPct: 5.74,
    createdBy: "Merchandiser",
    createdDate: "2026-10-10",
    ourRef: "JOB-2026-0002",
    bookingDescription: "100% Cotton Single Jersey & Rib Fabric",
    lines: [
      {
        id: "fbl-pk-002-1",
        jobId: "JOB-2026-0002",
        ourRef: "JOB-2026-0002",
        styleNo: "PK-KT-1001",
        fabricCode: "FAB-PK-01",
        fabricDescription: "100% Cotton Single Jersey 160 GSM",
        unit: "Kg",
        requiredQuantity: 5000,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 5000,
        bookingQuantity: 5000,
        rate: 3.20,
        lineTotal: 16000.0,
        color: "Royal Blue",
        width: '60" Open',
        usedPlace: "Body",
        grpType: "Single Jersey",
        rcv: false,
        allocations: [],
      },
      {
        id: "fbl-pk-002-2",
        jobId: "JOB-2026-0002",
        ourRef: "JOB-2026-0002",
        styleNo: "PK-KT-1001",
        fabricCode: "FAB-PK-02",
        fabricDescription: "Cotton Rib Fabric 220 GSM",
        unit: "Kg",
        requiredQuantity: 800,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 800,
        bookingQuantity: 800,
        rate: 3.80,
        lineTotal: 3040.0,
        color: "Royal Blue DTM",
        width: '45" Tubular',
        usedPlace: "Neck Rib",
        grpType: "Rib",
        rcv: false,
        allocations: [],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-PK-002-1",
        estimationItemId: "FE-PK-002-1",
        orderId: "ord-pk-002",
        orderNo: "ORD-2026-0002",
        styleNo: "PK-KT-1001",
        poNumber: "PO-PK-1001-A",
        preCostItemId: "PCI-PK-002-1",
        fabricDescription: "100% Cotton Single Jersey 160 GSM",
        garmentColor: "Royal Blue",
        fabricColor: "Royal Blue",
        diaGsm: '60" Open, 160 GSM',
        unit: "Kg",
        requiredQty: 5000,
        bookedQty: 5000,
        unitRate: 3.20,
        totalAmount: 16000.0,
        preCostRate: 3.40,
        preCostAmount: 17000.0,
        initialSavingAmount: 1000.0,
        initialSavingPct: 5.88,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "FBI-PK-002-2",
        estimationItemId: "FE-PK-002-2",
        orderId: "ord-pk-002",
        orderNo: "ORD-2026-0002",
        styleNo: "PK-KT-1001",
        poNumber: "PO-PK-1001-A",
        preCostItemId: "PCI-PK-002-2",
        fabricDescription: "Cotton Rib Fabric 220 GSM",
        garmentColor: "Royal Blue DTM",
        fabricColor: "Royal Blue DTM",
        diaGsm: '45" Tubular, 220 GSM',
        unit: "Kg",
        requiredQty: 800,
        bookedQty: 800,
        unitRate: 3.80,
        totalAmount: 3040.0,
        preCostRate: 4.00,
        preCostAmount: 3200.0,
        initialSavingAmount: 160.0,
        initialSavingPct: 5.0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-pakiza-003-1",
    bookingNo: "JOB-2026-0003/01",
    supplierName: "Pakiza Knitting & Dyeing",
    supplierId: "sup-001",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-10-12",
    deliveryDate: "2026-11-20",
    deliveryMode: "Road",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    totalBookedQty: 4500,
    totalBookedAmount: 15300.0,
    totalAmount: 15300.0,
    totalPreCostAmount: 16200.0,
    totalSavingAmount: 900.0,
    overallSavingPct: 5.56,
    createdBy: "Merchandiser",
    createdDate: "2026-10-12",
    ourRef: "JOB-2026-0003",
    bookingDescription: "Cotton Single Jersey 180 GSM",
    lines: [
      {
        id: "fbl-pk-003-1",
        jobId: "JOB-2026-0003",
        ourRef: "JOB-2026-0003",
        styleNo: "PK-TS-2001",
        fabricCode: "FAB-PK-03",
        fabricDescription: "Cotton Single Jersey 180 GSM",
        unit: "Kg",
        requiredQuantity: 4500,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 4500,
        bookingQuantity: 4500,
        rate: 3.40,
        lineTotal: 15300.0,
        color: "Heather Navy",
        width: '62" Open',
        usedPlace: "Body",
        grpType: "Single Jersey",
        rcv: false,
        allocations: [],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-PK-003-1",
        estimationItemId: "FE-PK-003-1",
        orderId: "ord-pk-003",
        orderNo: "ORD-2026-0003",
        styleNo: "PK-TS-2001",
        poNumber: "PO-PK-2001-A",
        preCostItemId: "PCI-PK-003-1",
        fabricDescription: "Cotton Single Jersey 180 GSM",
        garmentColor: "Heather Navy",
        fabricColor: "Heather Navy",
        diaGsm: '62" Open, 180 GSM',
        unit: "Kg",
        requiredQty: 4500,
        bookedQty: 4500,
        unitRate: 3.40,
        totalAmount: 15300.0,
        preCostRate: 3.60,
        preCostAmount: 16200.0,
        initialSavingAmount: 900.0,
        initialSavingPct: 5.56,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-pakiza-003-2",
    bookingNo: "JOB-2026-0003/02",
    supplierName: "Pakiza Knitting & Dyeing",
    supplierId: "sup-001",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-10-14",
    deliveryDate: "2026-11-22",
    deliveryMode: "Road",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    totalBookedQty: 600,
    totalBookedAmount: 2460.0,
    totalAmount: 2460.0,
    totalPreCostAmount: 2580.0,
    totalSavingAmount: 120.0,
    overallSavingPct: 4.65,
    createdBy: "Merchandiser",
    createdDate: "2026-10-14",
    ourRef: "JOB-2026-0003",
    bookingDescription: "Cotton Rib Fabric 240 GSM",
    lines: [
      {
        id: "fbl-pk-003-2",
        jobId: "JOB-2026-0003",
        ourRef: "JOB-2026-0003",
        styleNo: "PK-TS-2001",
        fabricCode: "FAB-PK-04",
        fabricDescription: "Cotton Rib Fabric 240 GSM",
        unit: "Kg",
        requiredQuantity: 600,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 600,
        bookingQuantity: 600,
        rate: 4.10,
        lineTotal: 2460.0,
        color: "Heather Navy DTM",
        width: '42" Tubular',
        usedPlace: "Rib Trim",
        grpType: "Rib",
        rcv: false,
        allocations: [],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-PK-003-2",
        estimationItemId: "FE-PK-003-2",
        orderId: "ord-pk-003",
        orderNo: "ORD-2026-0003",
        styleNo: "PK-TS-2001",
        poNumber: "PO-PK-2001-A",
        preCostItemId: "PCI-PK-003-2",
        fabricDescription: "Cotton Rib Fabric 240 GSM",
        garmentColor: "Heather Navy DTM",
        fabricColor: "Heather Navy DTM",
        diaGsm: '42" Tubular, 240 GSM',
        unit: "Kg",
        requiredQty: 600,
        bookedQty: 600,
        unitRate: 4.10,
        totalAmount: 2460.0,
        preCostRate: 4.30,
        preCostAmount: 2580.0,
        initialSavingAmount: 120.0,
        initialSavingPct: 4.65,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-pakiza-004-1",
    bookingNo: "JOB-2026-0004/01",
    supplierName: "Pakiza Knitting & Dyeing",
    supplierId: "sup-001",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-10-15",
    deliveryDate: "2026-11-30",
    deliveryMode: "Road",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    totalBookedQty: 3500,
    totalBookedAmount: 15500.0,
    totalAmount: 15500.0,
    totalPreCostAmount: 16400.0,
    totalSavingAmount: 900.0,
    overallSavingPct: 5.49,
    createdBy: "Merchandiser",
    createdDate: "2026-10-15",
    ourRef: "JOB-2026-0004",
    bookingDescription: "Cotton Fleece & Rib 260 GSM",
    lines: [
      {
        id: "fbl-pk-004-1",
        jobId: "JOB-2026-0004",
        ourRef: "JOB-2026-0004",
        styleNo: "PK-HO-3001",
        fabricCode: "FAB-PK-05",
        fabricDescription: "Cotton Fleece Fabric 280 GSM",
        unit: "Kg",
        requiredQuantity: 3000,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 3000,
        bookingQuantity: 3000,
        rate: 4.50,
        lineTotal: 13500.0,
        color: "Charcoal Marl",
        width: '68" Open',
        usedPlace: "Body & Hood",
        grpType: "Fleece",
        rcv: false,
        allocations: [],
      },
      {
        id: "fbl-pk-004-2",
        jobId: "JOB-2026-0004",
        ourRef: "JOB-2026-0004",
        styleNo: "PK-HO-3001",
        fabricCode: "FAB-PK-06",
        fabricDescription: "Cotton Rib Fabric 260 GSM",
        unit: "Kg",
        requiredQuantity: 500,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 500,
        bookingQuantity: 500,
        rate: 4.00,
        lineTotal: 2000.0,
        color: "Charcoal Marl DTM",
        width: '40" Tubular',
        usedPlace: "Cuff & Hem Rib",
        grpType: "Rib",
        rcv: false,
        allocations: [],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-PK-004-1",
        estimationItemId: "FE-PK-004-1",
        orderId: "ord-pk-004",
        orderNo: "ORD-2026-0004",
        styleNo: "PK-HO-3001",
        poNumber: "PO-PK-3001-A",
        preCostItemId: "PCI-PK-004-1",
        fabricDescription: "Cotton Fleece Fabric 280 GSM",
        garmentColor: "Charcoal Marl",
        fabricColor: "Charcoal Marl",
        diaGsm: '68" Open, 280 GSM',
        unit: "Kg",
        requiredQty: 3000,
        bookedQty: 3000,
        unitRate: 4.50,
        totalAmount: 13500.0,
        preCostRate: 4.70,
        preCostAmount: 14100.0,
        initialSavingAmount: 600.0,
        initialSavingPct: 4.26,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "FBI-PK-004-2",
        estimationItemId: "FE-PK-004-2",
        orderId: "ord-pk-004",
        orderNo: "ORD-2026-0004",
        styleNo: "PK-HO-3001",
        poNumber: "PO-PK-3001-A",
        preCostItemId: "PCI-PK-004-2",
        fabricDescription: "Cotton Rib Fabric 260 GSM",
        garmentColor: "Charcoal Marl DTM",
        fabricColor: "Charcoal Marl DTM",
        diaGsm: '40" Tubular, 260 GSM',
        unit: "Kg",
        requiredQty: 500,
        bookedQty: 500,
        unitRate: 4.00,
        totalAmount: 2000.0,
        preCostRate: 4.20,
        preCostAmount: 2100.0,
        initialSavingAmount: 100.0,
        initialSavingPct: 4.76,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-002",
    bookingNo: "FB-2026-0032",
    supplierName: "Ha-Meem Textile Mills",
    bookingDate: "2026-10-04",
    deliveryDate: "2026-11-20",
    deliveryMode: "Road",
    loadPort: "Tongi Mill Gate",
    destinationPlace: "Pakiza Woven Unit Savar",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "LC 60 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-06",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-04",
    totalBookedQty: 49184,
    totalBookedAmount: 127386.56,
    totalPreCostAmount: 130337.60,
    totalSavingAmount: 2951.04,
    overallSavingPct: 2.26, // Meets 2% saving target!
    notes: "Ha-Meem stretch twill must be delivered with 100% 4-point inspection report.",
    termsAndConditions: "Payment against verified mill test certificate.",
    items: [
      {
        bookingItemId: "FBI-201",
        estimationItemId: "FE-201",
        orderId: "ord-002",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        poNumber: "PO-ZR-44021-ES",
        preCostItemId: "PCI-201",
        fabricDescription: "98% Cotton 2% Spandex Stretch Twill 280 GSM",
        garmentColor: "Khaki Tan & Navy Blue",
        fabricColor: "Continuous Dyeing Reactive",
        diaGsm: "Width 57/58 Inch, 280 GSM",
        unit: "Yds",
        requiredQty: 49184,
        bookedQty: 49184,
        unitRate: 2.59, // Pre-Cost was 2.65 -> Saved $0.06/yd (2.26% saving)
        totalAmount: 127386.56,
        preCostRate: 2.65,
        preCostAmount: 130337.60,
        initialSavingAmount: 2951.04,
        initialSavingPct: 2.26,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "fb-003",
    bookingNo: "FB-2026-0033",
    supplierName: "Noman Weaving Mills",
    bookingDate: "2026-10-10",
    deliveryDate: "2026-11-25",
    deliveryMode: "Road",
    loadPort: "Gazipur",
    destinationPlace: "Pakiza Savar",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "TT 30 Days",
    status: "Pending Approval",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-10",
    totalBookedQty: 11760,
    totalBookedAmount: 13641.60,
    totalPreCostAmount: 13524.00,
    totalSavingAmount: -117.60, // Negative saving = Overrun!
    overallSavingPct: -0.87,
    notes: "Price exceeded pre-costing by $0.01/yd due to shortage of TC yarn.",
    termsAndConditions: "Standard terms.",
    items: [
      {
        bookingItemId: "FBI-202",
        estimationItemId: "FE-202",
        orderId: "ord-002",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        poNumber: "PO-ZR-44021-ES",
        preCostItemId: "PCI-202",
        fabricDescription: "65/35 TC Pocketing Twill Fabric 120 GSM",
        garmentColor: "Pocket Bag",
        fabricColor: "Bleached White",
        diaGsm: "Width 58 Inch, 120 GSM",
        unit: "Yds",
        requiredQty: 11760,
        bookedQty: 11760,
        unitRate: 1.16, // Pre-cost was 1.15 -> Exceeds budget!
        totalAmount: 13641.60,
        preCostRate: 1.15,
        preCostAmount: 13524.00,
        initialSavingAmount: -117.60,
        initialSavingPct: -0.87,
        isOverBudget: true,
        isSavingTargetMissed: true,
        exceptionReason: "Market price increased for 65/35 combed TC yarn; negotiated from $1.18 to $1.16.",
        specialApprovalStatus: "Pending",
      },
    ],
  },
  {
    id: "fb-004",
    bookingNo: "JOB-2026-0001/02",
    supplierId: "sup-001",
    supplierName: "Pakiza Knitting & Dyeing",
    supplierNameSnapshot: "Pakiza Knitting & Dyeing",
    bookingDate: "2026-10-15",
    deliveryDate: "2026-11-28",
    deliveryMode: "Road",
    loadPort: "Factory Warehouse",
    destinationPlace: "Pakiza Central Fabric Store",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-16",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-15",
    totalBookedQty: 8500,
    totalBookedAmount: 38250.0,
    totalPreCostAmount: 39100.0,
    totalSavingAmount: 850.0,
    overallSavingPct: 2.17,
    bookingDescription: "Repeat order fabric booking for H&M Polo T-Shirt",
    bookingType: "Main Fabric Booking",
    bookingUnit: "Pakiza Knit Composite Ltd.",
    deliveryPlace: "Pakiza Central Fabric Store",
    destination: "Pakiza Central Fabric Store",
    cp: "Md. Tanvir Ahmed",
    ourRef: "JOB-2026-0001",
    totalAmount: 38250.0,
    notes: "Approved for fast-track knitting.",
    lines: [
      {
        id: "fbl-004",
        fabricEstimationId: "fe-001",
        fabricEstimationItemId: "fab-003",
        jobId: "JOB-2026-0001",
        ourRef: "JOB-2026-0001",
        styleNo: "HM-KT-8842",
        styleNameSnapshot: "Men's Pique Polo Shirt",
        buyerNameSnapshot: "H&M Hennes & Mauritz",
        supplierId: "sup-001",
        fabricCode: "FAB-003",
        fabricDescription: "100% Cotton Lacoste Pique 230 GSM",
        width: '46" Open',
        usedPlace: "Main Body",
        grpType: "Main Body",
        color: "Solid Reactive Dyeing",
        unit: "Kg",
        requiredQuantity: 8500,
        previouslyBookedQuantity: 0,
        remainingRequirement: 0,
        suggestedBookingQuantity: 8500,
        bookingQuantity: 8500,
        receivedQuantity: 0,
        rate: 4.5,
        currency: "USD",
        lineTotal: 38250.0,
        budgetValue: 39100.0,
        rcv: false,
        allocations: [
          {
            id: "fba-005",
            orderId: "ord-001",
            poId: "po-002",
            poNumber: "PO-HM-99882-B",
            lotNumber: "LOT-02",
            colorName: "Navy Blue",
            countryName: "Sweden",
            garmentOrderQuantity: 18000,
            estimatedFabricRequirement: 8500,
            previouslyBookedQuantity: 0,
            remainingRequirement: 0,
            suggestedBookingQuantity: 8500,
            bookingQuantity: 8500,
            unit: "Kg",
          },
        ],
        bookingDetails: [
          {
            id: "fbd-004-1",
            bookingLineId: "fbl-004",
            poId: "po-002",
            poNumber: "PO-HM-99882-B",
            lotNumber: "LOT-02",
            countryName: "Sweden",
            rcv: false,
            ourRef: "JOB-2026-0001",
            usedPlace: "Main Body",
            fabricCode: "FAB-003",
            fabricDescription: "100% Cotton Lacoste Pique 230 GSM",
            width: '46" Open',
            garmentColor: "Navy Blue",
            fabricColor: "Navy Blue",
            requiredQuantity: 8500,
            unit: "Kg",
            bookingQuantity: 8500,
            receivedQuantity: 0,
            rate: 4.5,
            lineTotal: 38250.0,
          },
        ],
      },
    ],
    items: [
      {
        bookingItemId: "FBI-004",
        estimationItemId: "FE-003",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8842",
        poNumber: "PO-HM-99882-B",
        preCostItemId: "PCI-103",
        fabricDescription: "100% Cotton Lacoste Pique 230 GSM",
        garmentColor: "Navy Blue",
        fabricColor: "Navy Blue",
        diaGsm: "Width 46 Inch Open, 230 GSM",
        unit: "Kg",
        requiredQty: 8500,
        bookedQty: 8500,
        unitRate: 4.5,
        totalAmount: 38250.0,
        preCostRate: 4.6,
        preCostAmount: 39100.0,
        initialSavingAmount: 850.0,
        initialSavingPct: 2.17,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
];

export const INITIAL_MM_FABRIC_ESTIMATIONS: MMFabricEstimationRecord[] = [
  {
    id: "fe-001",
    orderId: "ord-001",
    jobNo: "JOB-2026-0001",
    ourRef: "JOB-2026-0001",
    buyer: "H&M European Retail",
    style: "HM-KT-8841",
    itemName: "Ladies Ribbed Henley Neck T-Shirt",
    quantity: 45000,
    rate: 4.85,
    unit: "Pcs",
    savedAt: "2026-09-21T10:00:00.000Z",
    updatedAt: "2026-09-21T10:00:00.000Z",
    fabricRows: [
      {
        id: "fab-001",
        inhouse: false,
        fabricNo: "FAB-001",
        usedPlace: "Body & Trims",
        budgetItemName: "2x2 Cotton Rib",
        code: "FAB-001",
        fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        sku: "Kg",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-001-1", garmentsColor: "Black", itemColor: "Black" },
          { id: "cm-001-2", garmentsColor: "Melange Grey", itemColor: "Melange Grey" },
        ],
        width: '48" Open',
        marketUnit: "Kg",
        rate: 4.10,
        nomineeStatus: "Nominated",
        supplier: "Pakiza Knitting & Dyeing",
        supplierId: "sup-001",
        per: "Dzn",
        consum: 2.65,
        unit: "Kg",
        wPct: 5,
        consPerPc: 0.2208,
        consPerDz: 2.65,
        costPerPc: 0.905,
        costPerDz: 10.865,
        orderQty: 45000,
        requireQty: 10434.38,
      },
      {
        id: "fab-002",
        inhouse: false,
        fabricNo: "FAB-002",
        usedPlace: "Collar & Cuff",
        budgetItemName: "1x1 Cotton Spandex Rib",
        code: "FAB-002",
        fabricDescription: "1x1 Cotton Spandex Rib 240 GSM",
        sku: "Kg",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-002-1", garmentsColor: "Black", itemColor: "Black" },
          { id: "cm-002-2", garmentsColor: "Melange Grey", itemColor: "Melange Grey" },
        ],
        width: '42" Tubular',
        marketUnit: "Kg",
        rate: 4.92,
        nomineeStatus: "Nominated",
        supplier: "Pakiza Knitting & Dyeing",
        supplierId: "sup-001",
        per: "Dzn",
        consum: 0.38,
        unit: "Kg",
        wPct: 5,
        consPerPc: 0.0317,
        consPerDz: 0.38,
        costPerPc: 0.156,
        costPerDz: 1.870,
        orderQty: 45000,
        requireQty: 1496.25,
      },
    ],
  },
  {
    id: "fe-002",
    orderId: "ord-002",
    jobNo: "JOB-2026-0002",
    ourRef: "JOB-2026-0002",
    buyer: "Zara (Inditex)",
    style: "ZR-WV-4019",
    itemName: "Men's Stretch Chino Trouser",
    quantity: 32000,
    rate: 8.75,
    unit: "Pcs",
    savedAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    fabricRows: [
      {
        id: "fab-003",
        inhouse: false,
        fabricNo: "FAB-003",
        usedPlace: "Main Body",
        budgetItemName: "Cotton Twill 260 GSM",
        code: "FAB-003",
        fabricDescription: "98% Cotton 2% Spandex Twill 260 GSM",
        sku: "Yds",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-003-1", garmentsColor: "Navy Blue", itemColor: "Dark Navy" },
          { id: "cm-003-2", garmentsColor: "Beige Khaki", itemColor: "Sand Khaki" },
        ],
        width: '58" Open',
        marketUnit: "Yds",
        rate: 2.65,
        nomineeStatus: "Nominated",
        supplier: "Pakiza Knitting & Dyeing",
        supplierId: "sup-001",
        per: "Pcs",
        consum: 1.45,
        unit: "Yds",
        wPct: 6,
        consPerPc: 1.45,
        consPerDz: 17.4,
        costPerPc: 3.84,
        costPerDz: 46.11,
        orderQty: 32000,
        requireQty: 49184,
      },
    ],
  },
  {
    id: "fe-003",
    orderId: "ord-003",
    jobNo: "JOB-2026-0003",
    ourRef: "JOB-2026-0003",
    buyer: "Target USA",
    style: "TGT-HD-5520",
    itemName: "Fleece Hooded Pullover",
    quantity: 15000,
    rate: 9.20,
    unit: "Pcs",
    savedAt: "2026-10-05T10:00:00.000Z",
    updatedAt: "2026-10-05T10:00:00.000Z",
    fabricRows: [
      {
        id: "fab-004",
        inhouse: false,
        fabricNo: "FAB-004",
        usedPlace: "Body & Hood",
        budgetItemName: "CVC Brushed Fleece",
        code: "FAB-004",
        fabricDescription: "60/40 CVC Brushed Fleece 300 GSM",
        sku: "Kg",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-004-1", garmentsColor: "Heather Charcoal", itemColor: "Charcoal Melange" },
        ],
        width: '72/74"',
        marketUnit: "Kg",
        rate: 5.10,
        nomineeStatus: "Nominated",
        supplier: "Viyellatex Fabric Mills Ltd.",
        supplierId: "sup-002",
        per: "Dzn",
        consum: 5.20,
        unit: "Kg",
        wPct: 6,
        consPerPc: 0.433,
        consPerDz: 5.20,
        costPerPc: 2.21,
        costPerDz: 26.52,
        orderQty: 15000,
        requireQty: 6890,
      },
    ],
  },
];

export const INITIAL_MM_ACCESSORIES_ESTIMATIONS: MMAccessoriesEstimationRecord[] = [
  {
    id: "ae-001",
    orderId: "ord-001",
    jobNo: "JOB-2026-0001",
    ourRef: "JOB-2026-0001",
    buyer: "H&M European Retail",
    style: "HM-KT-8841",
    orderDate: "2026-09-15",
    itemName: "Ladies Ribbed Henley Neck T-Shirt",
    packingType: "Flat Pack in Poly",
    quantity: 45000,
    unit: "Pcs",
    payTerm: "LC at Sight 60 Days",
    rate: 4.85,
    place: "Factory Floor Gazipur Unit-2",
    note: "All buttons and threads must be OEKO-TEX Standard 100 certified.",
    bookingNo: "AB-2026-0051",
    bookingDate: "2026-09-25",
    piNo: "PI-DEKKO-2026-088",
    piDate: "2026-09-28",
    bblcNo: "BBLC-7701-0941",
    bblcDate: "2026-10-02",
    findQtn: "QTN-2026-HM01",
    findBudget: "BUD-HM-8841",
    findRef: "JOB-2026-0001",
    budgetAccDesc: "Trims budget approved as per buyer tech-pack v2.0",
    savedAt: "2026-09-22T10:00:00.000Z",
    updatedAt: "2026-09-22T10:00:00.000Z",
    accessoriesRows: [
      {
        id: "ar-001-1",
        inhouse: false,
        budgetItemName: "18L Button",
        itemName: "18L 4-Hole Polyester Button",
        description: "Engraved Pearl Finish 18L Button (11.5mm)",
        usedPlace: "Front Placket",
        consumptionQtyPerPc: 3,
        consumptionUnit: "Pcs",
        wastagePct: 3,
        wastageQty: 4050,
        marketQty: 966,
        marketUnit: "Gross",
        unitRate: 1.25,
        amount: 1207.50,
        nomineeStatus: "Nominated",
        supplier: "Dekko Buttons Ltd",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "18L (11.5mm) 4-Hole",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-001-1", garmentsColor: "Black", itemColor: "Jet Black #001" },
          { id: "cm-001-2", garmentsColor: "Melange Grey", itemColor: "Grey Melange #180" },
        ],
        bookingRef: "AB-2026-0051",
        bookingStatus: "Booked",
      },
      {
        id: "ar-001-2",
        inhouse: false,
        budgetItemName: "Sewing Thread",
        itemName: "Sewing Thread 40/2 100% Spun Poly",
        description: "Astra 40/2 High Tenacity 5000M Spool",
        usedPlace: "Body Construction",
        consumptionQtyPerPc: 120,
        consumptionUnit: "Mtr",
        wastagePct: 5,
        wastageQty: 270000,
        marketQty: 1134,
        marketUnit: "Cones",
        unitRate: 1.80,
        amount: 2041.20,
        nomineeStatus: "Nominated",
        supplier: "Coats Bangladesh Ltd",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "5000m / Spool",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-001-3", garmentsColor: "Black", itemColor: "Black C-900" },
          { id: "cm-001-4", garmentsColor: "Melange Grey", itemColor: "Heather Grey C-420" },
        ],
        bookingRef: "AB-2026-0052",
        bookingStatus: "Booked",
      },
      {
        id: "ar-001-3",
        inhouse: false,
        budgetItemName: "Main Label",
        itemName: "High Def Woven Damask Main Label",
        description: "Center Fold Woven Label 25mm x 55mm",
        usedPlace: "Inside Back Neck",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 3,
        wastageQty: 1350,
        marketQty: 46350,
        marketUnit: "Pcs",
        unitRate: 0.045,
        amount: 2085.75,
        nomineeStatus: "Nominated",
        supplier: "Avery Dennison BD",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "25x55 mm Folded",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-001-5", garmentsColor: "Black", itemColor: "Black Ground / Silver Logo" },
          { id: "cm-001-6", garmentsColor: "Melange Grey", itemColor: "Grey Ground / White Logo" },
        ],
        bookingRef: "AB-2026-0053",
        bookingStatus: "Partially Booked",
      },
      {
        id: "ar-001-4",
        inhouse: false,
        budgetItemName: "Care Label",
        itemName: "Printed Satin Care & Wash Label",
        description: "Printed Recycled Polyester Satin 30mm x 70mm",
        usedPlace: "Inside Left Seam",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 4,
        wastageQty: 1800,
        marketQty: 46800,
        marketUnit: "Pcs",
        unitRate: 0.022,
        amount: 1029.60,
        nomineeStatus: "Nominated",
        supplier: "Avery Dennison BD",
        sizeFactType: "SAME AS GMT SIZE",
        sizeRows: [
          { id: "sz-1-1", gmtSize: "S", itemSpecification: "Care Text EN/FR/DE Size S", requiredItemQty: 10000, wastageQty: 400, totalQty: 10400, gmtOrderQty: 10000, totalWastagePct: 4 },
          { id: "sz-1-2", gmtSize: "M", itemSpecification: "Care Text EN/FR/DE Size M", requiredItemQty: 15000, wastageQty: 600, totalQty: 15600, gmtOrderQty: 15000, totalWastagePct: 4 },
          { id: "sz-1-3", gmtSize: "L", itemSpecification: "Care Text EN/FR/DE Size L", requiredItemQty: 12000, wastageQty: 480, totalQty: 12480, gmtOrderQty: 12000, totalWastagePct: 4 },
          { id: "sz-1-4", gmtSize: "XL", itemSpecification: "Care Text EN/FR/DE Size XL", requiredItemQty: 8000, wastageQty: 320, totalQty: 8320, gmtOrderQty: 8000, totalWastagePct: 4 },
        ],
        colorType: "Single Color",
        singleColorName: "White Satin / Black Print",
        colorMappings: [
          { id: "cm-001-7", garmentsColor: "Black", itemColor: "White / Black Print" },
          { id: "cm-001-8", garmentsColor: "Melange Grey", itemColor: "White / Black Print" },
        ],
      },
      {
        id: "ar-001-5",
        inhouse: false,
        budgetItemName: "Poly Bag",
        itemName: "Self-Adhesive Poly Bag 12x15",
        description: "0.04mm Recycled LDPE with Warning Text",
        usedPlace: "Individual Packing",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 2,
        wastageQty: 900,
        marketQty: 45900,
        marketUnit: "Pcs",
        unitRate: 0.038,
        amount: 1744.20,
        nomineeStatus: "Non Nominee",
        supplier: "Glory Packaging Ind.",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: '12" x 15" + 2" Flap',
        colorType: "Single Color",
        singleColorName: "Transparent Clear",
        colorMappings: [
          { id: "cm-001-9", garmentsColor: "Black", itemColor: "Transparent Clear" },
          { id: "cm-001-10", garmentsColor: "Melange Grey", itemColor: "Transparent Clear" },
        ],
      },
    ],
  },
  {
    id: "ae-002",
    orderId: "ord-002",
    jobNo: "JOB-2026-0002",
    ourRef: "JOB-2026-0002",
    buyer: "Zara Inditex Group",
    style: "ZR-OV-2026",
    orderDate: "2026-09-18",
    itemName: "Men's Stretch Chino Pant",
    packingType: "Hanger Pack in Master Carton",
    quantity: 32000,
    unit: "Pcs",
    payTerm: "TT 45 Days",
    rate: 8.75,
    place: "Factory Floor Gazipur Unit-1",
    note: "All metal hardware must be nickel-free and pass needle detector 1.0mm.",
    bookingNo: "AB-2026-0062",
    bookingDate: "2026-09-26",
    findQtn: "QTN-2026-ZR02",
    findBudget: "BUD-ZR-2026",
    findRef: "JOB-2026-0002",
    budgetAccDesc: "Hardware trims strictly nominated by Inditex Spain",
    savedAt: "2026-09-24T10:00:00.000Z",
    updatedAt: "2026-09-24T10:00:00.000Z",
    accessoriesRows: [
      {
        id: "ar-002-1",
        inhouse: false,
        budgetItemName: "Fly Zipper",
        itemName: "Metal Zipper #5 Antique Brass",
        description: "Closed End Auto Lock 5.5 Inch Brass Teeth",
        usedPlace: "Fly Opening",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 2,
        wastageQty: 640,
        marketQty: 2720,
        marketUnit: "Dzn",
        unitRate: 2.80,
        amount: 7616.00,
        nomineeStatus: "Nominated",
        supplier: "YKK Bangladesh Ltd",
        sizeFactType: "SAME AS GMT SIZE",
        sizeRows: [
          { id: "sz-2-1", gmtSize: "30", itemSpecification: '5.0" Brass Teeth Closed End', requiredItemQty: 8000, wastageQty: 160, totalQty: 8160, gmtOrderQty: 8000, totalWastagePct: 2 },
          { id: "sz-2-2", gmtSize: "32", itemSpecification: '5.5" Brass Teeth Closed End', requiredItemQty: 14000, wastageQty: 280, totalQty: 14280, gmtOrderQty: 14000, totalWastagePct: 2 },
          { id: "sz-2-3", gmtSize: "34", itemSpecification: '6.0" Brass Teeth Closed End', requiredItemQty: 10000, wastageQty: 200, totalQty: 10200, gmtOrderQty: 10000, totalWastagePct: 2 },
        ],
        colorType: "DTM",
        colorMappings: [
          { id: "cm-002-1", garmentsColor: "Khaki Beige", itemColor: "Tape #B42 Beige" },
          { id: "cm-002-2", garmentsColor: "Navy Blue", itemColor: "Tape #N10 Navy" },
        ],
        bookingRef: "AB-2026-0062",
        bookingStatus: "Booked",
      },
      {
        id: "ar-002-2",
        inhouse: false,
        budgetItemName: "Waist Button",
        itemName: "28L Metal Shank Button Antique Brass",
        description: "Custom Zara Engraved Waistband Button",
        usedPlace: "Waistband",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 3,
        wastageQty: 960,
        marketQty: 229,
        marketUnit: "Gross",
        unitRate: 4.50,
        amount: 1030.50,
        nomineeStatus: "Nominated",
        supplier: "Prym Fashion Asia",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "28L Shank Button",
        colorType: "Single Color",
        singleColorName: "Antique Brass",
        colorMappings: [
          { id: "cm-002-3", garmentsColor: "Khaki Beige", itemColor: "Antique Brass" },
          { id: "cm-002-4", garmentsColor: "Navy Blue", itemColor: "Antique Brass" },
        ],
        bookingRef: "AB-2026-0063",
        bookingStatus: "Booked",
      },
      {
        id: "ar-002-3",
        inhouse: false,
        budgetItemName: "Pocket Rivet",
        itemName: "Pocket Rivet Antique Brass 9.5mm",
        description: "Smooth Cap Brass Rivet for Pocket Corners",
        usedPlace: "Front Pockets",
        consumptionQtyPerPc: 4,
        consumptionUnit: "Pcs",
        wastagePct: 4,
        wastageQty: 5120,
        marketQty: 925,
        marketUnit: "Gross",
        unitRate: 1.10,
        amount: 1017.50,
        nomineeStatus: "Nominated",
        supplier: "Prym Fashion Asia",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "9.5mm Cap + Stem",
        colorType: "Single Color",
        singleColorName: "Antique Brass",
        colorMappings: [
          { id: "cm-002-5", garmentsColor: "Khaki Beige", itemColor: "Antique Brass" },
          { id: "cm-002-6", garmentsColor: "Navy Blue", itemColor: "Antique Brass" },
        ],
      },
    ],
  },
  {
    id: "ae-003",
    orderId: "ord-003",
    jobNo: "JOB-2026-0003",
    ourRef: "JOB-2026-0003",
    buyer: "Target USA",
    style: "TGT-HD-5520",
    orderDate: "2026-10-01",
    itemName: "Fleece Hooded Pullover",
    packingType: "Flat Pack in Poly",
    quantity: 15000,
    unit: "Pcs",
    payTerm: "LC at Sight",
    rate: 9.20,
    place: "Factory Floor Gazipur Unit-3",
    note: "Drawstring tips must be dipped silicone without phthalates.",
    findQtn: "QTN-2026-TG03",
    findBudget: "BUD-TG-5520",
    findRef: "JOB-2026-0003",
    budgetAccDesc: "Budget approved by Target QA merchandising team",
    savedAt: "2026-10-06T10:00:00.000Z",
    updatedAt: "2026-10-06T10:00:00.000Z",
    accessoriesRows: [
      {
        id: "ar-003-1",
        inhouse: false,
        budgetItemName: "Hood Drawcord",
        itemName: "Round Braided Cotton Drawcord 10mm",
        description: "100% Cotton Braided Cord with Dipped Silicone Tip 110cm",
        usedPlace: "Hood Opening",
        consumptionQtyPerPc: 1.1,
        consumptionUnit: "Mtr",
        wastagePct: 3,
        wastageQty: 495,
        marketQty: 16995,
        marketUnit: "Mtr",
        unitRate: 0.28,
        amount: 4758.60,
        nomineeStatus: "Nominated",
        supplier: "Avery Dennison BD",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "110 cm Length x 10mm",
        colorType: "DTM",
        colorMappings: [
          { id: "cm-003-1", garmentsColor: "Navy Blue", itemColor: "Navy Blue" },
          { id: "cm-003-2", garmentsColor: "Beige Khaki", itemColor: "Beige Khaki" },
        ],
      },
      {
        id: "ar-003-2",
        inhouse: false,
        budgetItemName: "Metal Eyelet",
        itemName: "Metal Eyelet #4 Gunmetal Finish",
        description: "Brass Eyelet with Washer 8mm Inner Dia",
        usedPlace: "Hood Cord Exit",
        consumptionQtyPerPc: 2,
        consumptionUnit: "Pcs",
        wastagePct: 4,
        wastageQty: 1200,
        marketQty: 217,
        marketUnit: "Gross",
        unitRate: 0.95,
        amount: 206.15,
        nomineeStatus: "Non Nominee",
        supplier: "Prym Fashion Asia",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "8mm Inner Dia / 14mm Outer",
        colorType: "Single Color",
        singleColorName: "Gunmetal Black",
        colorMappings: [
          { id: "cm-003-3", garmentsColor: "Navy Blue", itemColor: "Gunmetal" },
          { id: "cm-003-4", garmentsColor: "Beige Khaki", itemColor: "Gunmetal" },
        ],
      },
    ],
  },
];

export const INITIAL_MM_ACCESSORIES_BOOKINGS: MMAccessoriesBooking[] = [
  {
    id: "ab-001",
    bookingNo: "AB-2026-0051",
    supplierName: "Dekko Buttons Ltd",
    bookingDate: "2026-09-25",
    deliveryDate: "2026-11-05",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "TT 30 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-27",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-25",
    totalBookedQty: 139050,
    totalBookedAmount: 4727.70,
    totalPreCostAmount: 4866.75,
    totalSavingAmount: 139.05,
    overallSavingPct: 2.86, // Above 2% saving target!
    notes: "Laser engraved edge with buyer approval seal.",
    items: [
      {
        bookingItemId: "ABI-001",
        estimationItemId: "AE-001",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        poNumber: "PO-HM-99881-A",
        preCostItemId: "PCI-103",
        itemDescription: "Natural Shell 4-Hole Button 18L",
        specification: "18L, 4 Holes, Engraved Edge, Dye to Match",
        sizeOrDimension: "18L",
        color: "DTM (Black, Grey, Olive)",
        unit: "Pcs",
        requiredQty: 139050,
        bookedQty: 139050,
        bookedRate: 0.034, // Pre-Cost was 0.035 -> $0.001 saving (2.86%)
        totalAmount: 4727.70,
        preCostRate: 0.035,
        preCostAmount: 4866.75,
        initialSavingAmount: 139.05,
        initialSavingPct: 2.86,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "ab-002",
    bookingNo: "AB-2026-0052",
    supplierName: "Avery Dennison BD",
    bookingDate: "2026-09-26",
    deliveryDate: "2026-11-10",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "LC 60 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-28",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-26",
    totalBookedQty: 91800,
    totalBookedAmount: 3121.20,
    totalPreCostAmount: 3213.00,
    totalSavingAmount: 91.80,
    overallSavingPct: 2.86,
    notes: "Oeko-tex certificate required for all labels.",
    items: [
      {
        bookingItemId: "ABI-002",
        estimationItemId: "AE-002",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        poNumber: "PO-HM-99881-A",
        preCostItemId: "PCI-104",
        itemDescription: "Woven Main Brand Tag (H&M)",
        specification: "Damask Woven, Soft Edge, 45mm x 20mm",
        sizeOrDimension: "45x20mm",
        color: "White/Black",
        unit: "Pcs",
        requiredQty: 45900,
        bookedQty: 45900,
        bookedRate: 0.0438,
        totalAmount: 2010.42,
        preCostRate: 0.045,
        preCostAmount: 2065.50,
        initialSavingAmount: 55.08,
        initialSavingPct: 2.67,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "ABI-003",
        estimationItemId: "AE-003",
        orderId: "ord-001",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        poNumber: "PO-HM-99881-A",
        preCostItemId: "PCI-105",
        itemDescription: "Satin Printed Care Label & RN#",
        specification: "Multi-language QR code, Wash instructions",
        sizeOrDimension: "70x30mm",
        color: "Black on White",
        unit: "Pcs",
        requiredQty: 45900,
        bookedQty: 45900,
        bookedRate: 0.0242,
        totalAmount: 1110.78,
        preCostRate: 0.025,
        preCostAmount: 1147.50,
        initialSavingAmount: 36.72,
        initialSavingPct: 3.20,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "ab-003",
    bookingNo: "AB-2026-0053",
    supplierName: "YKK Bangladesh",
    bookingDate: "2026-10-05",
    deliveryDate: "2026-11-20",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "TT 30 Days",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-07",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-05",
    totalBookedQty: 32640,
    totalBookedAmount: 10118.40,
    totalPreCostAmount: 10444.80,
    totalSavingAmount: 326.40,
    overallSavingPct: 3.125, // Above 2% saving target!
    notes: "YKK antique brass teeth with semi-automatic slider.",
    items: [
      {
        bookingItemId: "ABI-201",
        estimationItemId: "AE-201",
        orderId: "ord-002",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        poNumber: "PO-ZR-44021-ES",
        preCostItemId: "PCI-203",
        itemDescription: "YKK #4.5 Brass Metal Zipper Semi-Auto Lock",
        specification: "6.5 Inch Closed-end Antique Brass Teeth",
        sizeOrDimension: "6.5 Inch",
        color: "Antique Brass / DTM Tape",
        unit: "Pcs",
        requiredQty: 32640,
        bookedQty: 32640,
        bookedRate: 0.31, // Pre-Cost was 0.32 -> Saved $0.01/pc (3.125%)
        totalAmount: 10118.40,
        preCostRate: 0.32,
        preCostAmount: 10444.80,
        initialSavingAmount: 326.40,
        initialSavingPct: 3.125,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
  },
  {
    id: "ab-004",
    bookingNo: "AB-2026-0054",
    supplierName: "Avery Dennison BD",
    bookingDate: "2026-10-06",
    deliveryDate: "2026-11-25",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "LC 60 Days",
    status: "Pending Approval",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-06",
    totalBookedQty: 32640,
    totalBookedAmount: 8976.00,
    totalPreCostAmount: 9139.20,
    totalSavingAmount: 163.20,
    overallSavingPct: 1.78, // Saving is 1.78% which is below the 2.0% target!
    notes: "Vegetable tanned leather with heat debossed Zara logo.",
    items: [
      {
        bookingItemId: "ABI-202",
        estimationItemId: "AE-202",
        orderId: "ord-002",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        poNumber: "PO-ZR-44021-ES",
        preCostItemId: "PCI-205",
        itemDescription: "Genuine Leather Back Waistband Brand Tag",
        specification: "Vegetable tanned embossed leather patch 60x40mm",
        sizeOrDimension: "60x40mm",
        color: "Tan Brown",
        unit: "Pcs",
        requiredQty: 32640,
        bookedQty: 32640,
        bookedRate: 0.275, // Pre-Cost was 0.28 -> 1.78% saving (target exception!)
        totalAmount: 8976.00,
        preCostRate: 0.28,
        preCostAmount: 9139.20,
        initialSavingAmount: 163.20,
        initialSavingPct: 1.78,
        isOverBudget: false,
        isSavingTargetMissed: true, // Misses 2% target
        exceptionReason: "Supplier raw hide cost is up; best negotiated price yields 1.78% saving.",
        specialApprovalStatus: "Pending",
      },
    ],
  },
];

export const INITIAL_MM_PROFORMA_INVOICES: MMProformaInvoice[] = [
  {
    id: "pi-001",
    piNo: "PI-PK-2026-0104",
    entryNo: "ENT-PI-001",
    piDate: "2026-09-28",
    supplierName: "Pakiza Knitting & Dyeing",
    businessUnit: "Unit 2 - Garments",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "Internal Transfer / TT 30 Days",
    deliveryTerms: "FOB Factory Savar",
    deliveryMode: "Road",
    lcReferenceNo: "LC-HM-99812-2026",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-09-30",
    submittedBy: "Senior Merchandiser (Tanvir Ahmed)",
    submittedDate: "2026-09-28",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-09-28",
    approvalHistory: [
      {
        id: "ah-pi-001-1",
        bookingId: "pi-001",
        bookingNo: "PI-PK-2026-0104",
        action: "Submitted",
        previousStatus: "Draft",
        newStatus: "Pending Approval",
        performedBy: "Senior Merchandiser (Tanvir Ahmed)",
        timestamp: "2026-09-28 11:30",
        comment: "Consolidated PI submitted for management verification",
      },
      {
        id: "ah-pi-001-2",
        bookingId: "pi-001",
        bookingNo: "PI-PK-2026-0104",
        action: "Approved",
        previousStatus: "Pending Approval",
        newStatus: "Approved",
        performedBy: "Head of Merchandising (Rashidul Islam)",
        timestamp: "2026-09-30 16:45",
        comment: "Verified against FB-2026-0031. Rates and quantities approved.",
      },
    ],
    version: 1,
    allocatedBookings: [
      {
        bookingId: "fb-001",
        bookingNo: "FB-2026-0031",
        bookingType: "Fabric",
        orderNo: "ORD-2026-0041",
        styleNo: "HM-KT-8841",
        allocatedAmount: 63635.80,
      },
    ],
    items: [
      {
        piItemId: "PII-001",
        bookingItemId: "FBI-001",
        sourceBookingNo: "FB-2026-0031",
        itemDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
        specification: "Width 48 Inch Open, 220 GSM",
        unit: "Kg",
        quantity: 13230,
        unitPrice: 4.10,
        totalAmount: 54243.00,
      },
      {
        piItemId: "PII-002",
        bookingItemId: "FBI-002",
        sourceBookingNo: "FB-2026-0031",
        itemDescription: "1x1 Cotton Spandex Rib 240 GSM",
        specification: "Width 42 Inch Tubular, 240 GSM",
        unit: "Kg",
        quantity: 1908,
        unitPrice: 4.92285,
        totalAmount: 9392.80,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 63635.80,
    notes: "Proforma Invoice verified and matched with Fabric Booking FB-2026-0031.",
    attachments: ["pi_scan_0104.pdf"],
  },
  {
    id: "pi-002",
    piNo: "PI-HM-2026-0418",
    entryNo: "ENT-PI-002",
    piDate: "2026-10-08",
    supplierName: "Ha-Meem Textile Mills",
    businessUnit: "Unit 1 - Woven",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "LC 60 Days",
    deliveryTerms: "FOB Factory Tongi",
    deliveryMode: "Road",
    lcReferenceNo: "BBLC-ZR-7740-2026",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-10",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-08",
    version: 1,
    allocatedBookings: [
      {
        bookingId: "fb-002",
        bookingNo: "FB-2026-0032",
        bookingType: "Fabric",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        allocatedAmount: 127386.56,
      },
    ],
    items: [
      {
        piItemId: "PII-201",
        bookingItemId: "FBI-201",
        sourceBookingNo: "FB-2026-0032",
        itemDescription: "98% Cotton 2% Spandex Stretch Twill 280 GSM",
        specification: "Width 57/58 Inch, 280 GSM",
        unit: "Yds",
        quantity: 49184,
        unitPrice: 2.59,
        totalAmount: 127386.56,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 127386.56,
    notes: "Original PI received with bank endorsement.",
    attachments: ["pi_hameem_0418.pdf"],
  },
  {
    id: "pi-003",
    piNo: "PI-YKK-2026-9011",
    entryNo: "ENT-PI-003",
    piDate: "2026-10-09",
    supplierName: "YKK Bangladesh",
    businessUnit: "Unit 1 - Woven",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "TT 30 Days",
    deliveryTerms: "Ex-factory DEPZ",
    deliveryMode: "Road",
    status: "Passed",
    approvedBy: "Senior Merchandiser (Tanvir Ahmed)",
    approvalDate: "2026-10-11",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-09",
    version: 1,
    allocatedBookings: [
      {
        bookingId: "ab-003",
        bookingNo: "AB-2026-0053",
        bookingType: "Accessories",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        allocatedAmount: 10118.40,
      },
    ],
    items: [
      {
        piItemId: "PII-203",
        bookingItemId: "ABI-201",
        sourceBookingNo: "AB-2026-0053",
        itemDescription: "YKK #4.5 Brass Metal Zipper Semi-Auto Lock",
        specification: "6.5 Inch Closed-end Antique Brass Teeth",
        unit: "Pcs",
        quantity: 32640,
        unitPrice: 0.31,
        totalAmount: 10118.40,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 10118.40,
    notes: "Passed for BBLC opening.",
    attachments: [],
  },
  {
    id: "pi-004",
    piNo: "PI-NOM-2026-0033",
    entryNo: "ENT-PI-004",
    piDate: "2026-10-12",
    entryDate: "2026-10-12",
    supplierName: "Noman Weaving Mills",
    businessUnit: "Unit 1 - Woven",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "TT 30 Days",
    deliveryTerms: "FOB Savar",
    deliveryMode: "Road",
    lcReferenceNo: "LC-NOM-2026-8810",
    status: "Pending Approval",
    submittedBy: "Merchandiser (Nafis Imtiaz)",
    submittedDate: "2026-10-12",
    createdBy: "Merchandiser (Nafis Imtiaz)",
    createdDate: "2026-10-12",
    approvalHistory: [
      {
        id: "ah-pi-004-1",
        bookingId: "pi-004",
        bookingNo: "PI-NOM-2026-0033",
        action: "Submitted",
        previousStatus: "Draft",
        newStatus: "Pending Approval",
        performedBy: "Merchandiser (Nafis Imtiaz)",
        timestamp: "2026-10-12 14:15",
        comment: "Submitted for verification and approval against FB-2026-0033",
      },
    ],
    version: 1,
    allocatedBookings: [
      {
        bookingId: "fb-003",
        bookingNo: "FB-2026-0033",
        bookingType: "Fabric",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        allocatedAmount: 13641.60,
      },
    ],
    items: [
      {
        piItemId: "PII-301",
        bookingItemId: "FBI-202",
        sourceBookingNo: "FB-2026-0033",
        itemDescription: "65/35 TC Pocketing Twill Fabric 120 GSM",
        specification: "Width 58 Inch, 120 GSM, Bleached White",
        unit: "Yds",
        quantity: 11760,
        unitPrice: 1.16,
        totalAmount: 13641.60,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 13641.60,
    notes: "Submitted for verification and approval against FB-2026-0033.",
    attachments: [],
  },
  {
    id: "pi-005",
    piNo: "PI-AD-2026-0054",
    entryNo: "ENT-PI-005",
    piDate: "2026-10-15",
    entryDate: "2026-10-15",
    supplierName: "Avery Dennison BD",
    businessUnit: "Unit 2 - Garments",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "LC 60 Days",
    deliveryTerms: "FOB Dhaka",
    deliveryMode: "Road",
    status: "Draft",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-15",
    version: 1,
    allocatedBookings: [
      {
        bookingId: "ab-004",
        bookingNo: "AB-2026-0054",
        bookingType: "Accessories",
        orderNo: "ORD-2026-0042",
        styleNo: "ZR-WV-4019",
        allocatedAmount: 8976.00,
      },
    ],
    items: [
      {
        piItemId: "PII-401",
        bookingItemId: "ABI-202",
        sourceBookingNo: "AB-2026-0054",
        itemDescription: "Genuine Leather Back Waistband Brand Tag",
        specification: "Vegetable tanned embossed leather patch 60x40mm",
        unit: "Pcs",
        quantity: 32640,
        unitPrice: 0.275,
        totalAmount: 8976.00,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 8976.00,
    notes: "Draft Proforma Invoice for accessories trimming package.",
    attachments: [],
  },
  {
    id: "pi-byb-001",
    piNo: "PI-SQ-2026-0881",
    entryNo: "ENT-PI-BYB-001",
    piDate: "2026-10-18",
    entryDate: "2026-10-18",
    supplierName: "Square Textiles Ltd",
    businessUnit: "Unit 2 - Garments",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "At Sight LC",
    deliveryTerms: "FOB Savar",
    deliveryMode: "Road",
    lcNumber: "BBLC-2026-0819",
    lcReferenceNo: "BBLC-2026-0819",
    status: "Approved",
    approvedBy: "Head of Merchandising (Rashidul Islam)",
    approvalDate: "2026-10-20",
    submittedBy: "Senior Merchandiser (Tanvir Ahmed)",
    submittedDate: "2026-10-18",
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-18",
    version: 1,
    allocatedBookings: [
      {
        bookingId: "byb-2026-0001",
        bookingNo: "BYB-2026-0001",
        bookingType: "Accessories",
        orderNo: "JOB-2026-0001",
        styleNo: "HM-KT-8841",
        allocatedAmount: 203500,
        bookingDesc: "Advance Block Yarn Booking - Q4 2026",
        bookingDate: "2026-10-15",
        deliveryMode: "Road",
        deliveryDate: "2026-11-30",
        affectedGarmentQty: 60000,
        buyerName: "H&M Europe",
        season: "Spring/Summer 2026",
      },
    ],
    items: [
      {
        piItemId: "PII-BYB-001",
        bookingItemId: "byb-item-001",
        sourceBookingNo: "BYB-2026-0001",
        itemDescription: "100% Combed Cotton Yarn Ne 30/1",
        specification: "Combed Ring Spun Auto Coned",
        unit: "Kg",
        quantity: 25000,
        unitPrice: 3.45,
        totalAmount: 86250,
      },
      {
        piItemId: "PII-BYB-002",
        bookingItemId: "byb-item-002",
        sourceBookingNo: "BYB-2026-0001",
        itemDescription: "100% Combed Cotton Yarn Ne 26/1",
        specification: "Combed Ring Spun Auto Coned",
        unit: "Kg",
        quantity: 20000,
        unitPrice: 3.35,
        totalAmount: 67000,
      },
      {
        piItemId: "PII-BYB-003",
        bookingItemId: "byb-item-003",
        sourceBookingNo: "BYB-2026-0001",
        itemDescription: "100% Combed Cotton Yarn Ne 20/1",
        specification: "Combed Ring Spun Auto Coned",
        unit: "Kg",
        quantity: 15000,
        unitPrice: 3.20,
        totalAmount: 48000,
      },
    ],
    additionalCharges: 0,
    totalPiValue: 203500,
    activeBookingId: "byb-2026-0001",
    notes: "Confirmed Irrevocable At Sight Back-to-Back LC against Block Yarn Booking BYB-2026-0001.",
    attachments: [],
  },
];

export const INITIAL_MM_AUDIT_LOGS: MMAuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-14 11:30:00",
    entityType: "Quotation",
    entityId: "QT-2026-0091",
    action: "Approve",
    userId: "USR-004",
    userName: "Rashidul Islam (Head of Merchandising)",
    comments: "Buyer quotation verified and approved within company margin targets.",
  },
  {
    id: "aud-002",
    timestamp: "2026-09-18 16:45:00",
    entityType: "PreCosting",
    entityId: "PC-2026-001",
    action: "Approve",
    userId: "USR-004",
    userName: "Rashidul Islam (Head of Merchandising)",
    comments: "Approved Version 1 for H&M Henley T-Shirt. Total Cost: $54.00/dzn.",
  },
  {
    id: "aud-003",
    timestamp: "2026-09-20 09:15:00",
    entityType: "MainOrder",
    entityId: "ORD-2026-0041",
    action: "Create",
    userId: "USR-002",
    userName: "Tanvir Ahmed (Senior Merchandiser)",
    comments: "Created confirmed order entry for 45,000 pcs against approved PC-2026-001 v1.",
  },
  {
    id: "aud-004",
    timestamp: "2026-09-26 14:20:00",
    entityType: "FabricBooking",
    entityId: "FB-2026-0031",
    action: "Approve",
    userId: "USR-004",
    userName: "Rashidul Islam (Head of Merchandising)",
    comments: "Fabric booking approved. Yields 2.54% saving against Pre-Cost baseline ($1,661.00 saving).",
  },
  {
    id: "aud-005",
    timestamp: "2026-10-06 17:00:00",
    entityType: "FabricBooking",
    entityId: "FB-2026-0032",
    action: "Approve",
    userId: "USR-004",
    userName: "Rashidul Islam (Head of Merchandising)",
    comments: "Fabric booking approved for Ha-Meem Stretch Twill. 2.26% saving ($2,951.04 saving).",
  },
];

// ============================================================================
// Production File Management Models & Types
// ============================================================================

export type ProductionFileSourceType = "Confirm Order Entry" | "Pre Costing";

export interface ProductionFilePOItem {
  id: string;
  po: string;
  poQty: number;
}

export type ProductionFileAttachmentCategory =
  | "BOM Sheet"
  | "Trims Layout"
  | "CAD Marker"
  | "PO Sheet"
  | "Sample Comments / TechPack / Measurement Sheet"
  | "Embellishment"
  | "Others";

export const PRODUCTION_FILE_ATTACHMENT_CATEGORIES: ProductionFileAttachmentCategory[] = [
  "BOM Sheet",
  "Trims Layout",
  "CAD Marker",
  "PO Sheet",
  "Sample Comments / TechPack / Measurement Sheet",
  "Embellishment",
  "Others",
];

export interface ProductionFileAttachment {
  id: string;
  category: ProductionFileAttachmentCategory;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  fileUrl?: string;
  version?: number;
  isNewInAmendment?: boolean;
  title?: string;
  note?: string;
  uploadedBy?: string;
}

export type ProductionFileStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export interface ProductionFileApprovalHistory {
  id: string;
  timestamp: string;
  action: "Created" | "Submitted" | "Approved" | "Rejected" | "Resubmitted" | "Draft Saved";
  userName: string;
  userRole?: string;
  comments?: string;
  rejectionReason?: string;
}

export interface MMProductionFileRecord {
  id: string;
  fileRefNo: string;
  sourceType: ProductionFileSourceType;
  sourceRecordId: string;
  sourceReference: string; // The selected Job ID or Pre Costing No
  jobNo: string;
  preCostNo?: string;
  styleNo: string;
  styleDescription?: string;
  buyerName?: string;
  season?: string;
  poItems: ProductionFilePOItem[];
  totalPoQty: number;
  attachments: ProductionFileAttachment[];
  status: ProductionFileStatus;
  notes?: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  approvalComments?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  // Versioning and Amendment fields
  version: number;
  versionType: "Original" | "Amendment";
  isCurrentActive: boolean;
  parentFileId?: string;
  previousVersionId?: string;
  amendmentReason?: string;
  amendmentChangeSummary?: string;
  history: ProductionFileApprovalHistory[];
}

// ============================================================================
// Initial Master Data for Block Yarn Bookings (Advance Allocation Pool)
// ============================================================================
export const INITIAL_MM_BLOCK_YARN_BOOKINGS: MMAccessoriesBooking[] = [
  {
    id: "byb-2026-0001",
    bookingNo: "BYB-2026-0001",
    ourRef: "JOB-2026-0001",
    bookingDate: "2026-10-15",
    deliveryDate: "2026-11-30",
    supplierId: "sup-001",
    supplierName: "Square Textiles Ltd",
    bookingDesc: "Advance Block Yarn Booking - Q4 2026",
    payMode: "At Sight LC",
    deliveryMode: "By Covered Van",
    deliveryPlace: "Factory Mill Store (Gazipur)",
    bookType: "Block Yarn Booking",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "At Sight LC",
    status: "Approved",
    piReference: "PI-SQ-2026-0881",
    totalBookedQty: 60000,
    totalBookedAmount: 203500,
    totalPreCostAmount: 203500,
    totalSavingAmount: 0,
    overallSavingPct: 0,
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-15",
    items: [
      {
        bookingItemId: "byb-item-001",
        estimationItemId: "yarn-001",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-001",
        itemDescription: "100% Combed Cotton Yarn Ne 30/1",
        specification: "Combed Ring Spun Auto Coned",
        sizeOrDimension: "Ne 30/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 25,
        requiredQty: 25000,
        bookedQty: 25000,
        bookedRate: 3.45,
        totalAmount: 86250,
        preCostRate: 3.45,
        preCostAmount: 86250,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "byb-item-002",
        estimationItemId: "yarn-002",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-002",
        itemDescription: "100% Combed Cotton Yarn Ne 26/1",
        specification: "Combed Ring Spun Auto Coned",
        sizeOrDimension: "Ne 26/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 20,
        requiredQty: 20000,
        bookedQty: 20000,
        bookedRate: 3.35,
        totalAmount: 67000,
        preCostRate: 3.35,
        preCostAmount: 67000,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "byb-item-003",
        estimationItemId: "yarn-003",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-003",
        itemDescription: "100% Combed Cotton Yarn Ne 20/1",
        specification: "Combed Ring Spun Auto Coned",
        sizeOrDimension: "Ne 20/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 15,
        requiredQty: 15000,
        bookedQty: 15000,
        bookedRate: 3.20,
        totalAmount: 48000,
        preCostRate: 3.20,
        preCostAmount: 48000,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-15T09:00:00.000Z",
  },
  {
    id: "byb-2026-0002",
    bookingNo: "BYB-2026-0002",
    bookingDate: "2026-10-18",
    deliveryDate: "2026-12-15",
    supplierId: "sup-002",
    supplierName: "Badsha Textiles Ltd",
    bookingDesc: "Carded & Slub Cotton Block Yarn Booking",
    payMode: "60 Days Deferred LC",
    deliveryMode: "By Covered Van",
    deliveryPlace: "Factory Mill Store (Gazipur)",
    bookType: "Block Yarn Booking",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "60 Days Deferred LC",
    status: "Approved",
    totalBookedQty: 50000,
    totalBookedAmount: 164200,
    totalPreCostAmount: 164200,
    totalSavingAmount: 0,
    overallSavingPct: 0,
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-18",
    items: [
      {
        bookingItemId: "byb-item-004",
        estimationItemId: "yarn-009",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-009",
        itemDescription: "100% Carded Cotton Yarn Ne 26/1",
        specification: "Carded Ring Spun Auto Coned",
        sizeOrDimension: "Ne 26/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 18,
        requiredQty: 18000,
        bookedQty: 18000,
        bookedRate: 3.15,
        totalAmount: 56700,
        preCostRate: 3.15,
        preCostAmount: 56700,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "byb-item-005",
        estimationItemId: "yarn-010",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-010",
        itemDescription: "100% Carded Cotton Yarn Ne 30/1",
        specification: "Carded Ring Spun Auto Coned",
        sizeOrDimension: "Ne 30/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 22,
        requiredQty: 22000,
        bookedQty: 22000,
        bookedRate: 3.25,
        totalAmount: 71500,
        preCostRate: 3.25,
        preCostAmount: 71500,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "byb-item-006",
        estimationItemId: "yarn-017",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-017",
        itemDescription: "100% Cotton Slub Yarn Ne 30/1",
        specification: "Cotton Slub Effect Ne 30/1",
        sizeOrDimension: "Ne 30/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 10,
        requiredQty: 10000,
        bookedQty: 10000,
        bookedRate: 3.60,
        totalAmount: 36000,
        preCostRate: 3.60,
        preCostAmount: 36000,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
    createdAt: "2026-10-18T10:30:00.000Z",
    updatedAt: "2026-10-18T10:30:00.000Z",
  },
  {
    id: "byb-2026-0003",
    bookingNo: "BYB-2026-0003",
    bookingDate: "2026-10-22",
    deliveryDate: "2026-12-30",
    supplierId: "sup-003",
    supplierName: "Pahartali Textile & Hosiery Mills",
    bookingDesc: "CVC & Grey Melange Block Yarn Booking",
    payMode: "90 Days Usance LC",
    deliveryMode: "By Covered Van",
    deliveryPlace: "Factory Mill Store (Gazipur)",
    bookType: "Block Yarn Booking",
    currency: "USD",
    conversionRate: 1.0,
    paymentTerms: "90 Days Usance LC",
    status: "Approved",
    totalBookedQty: 26000,
    totalBookedAmount: 87900,
    totalPreCostAmount: 87900,
    totalSavingAmount: 0,
    overallSavingPct: 0,
    createdBy: "Senior Merchandiser (Tanvir Ahmed)",
    createdDate: "2026-10-22",
    items: [
      {
        bookingItemId: "byb-item-007",
        estimationItemId: "yarn-012",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-012",
        itemDescription: "60% Cotton 40% Polyester (CVC) Yarn Ne 26/1",
        specification: "CVC Blend 60/40 Auto Coned",
        sizeOrDimension: "Ne 26/1",
        color: "Raw White / Greige",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 12,
        requiredQty: 12000,
        bookedQty: 12000,
        bookedRate: 2.95,
        totalAmount: 35400,
        preCostRate: 2.95,
        preCostAmount: 35400,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
      {
        bookingItemId: "byb-item-008",
        estimationItemId: "yarn-018",
        orderId: "",
        orderNo: "",
        styleNo: "",
        poNumber: "",
        preCostItemId: "yarn-018",
        itemDescription: "100% Cotton Grey Melange Yarn Ne 30/1",
        specification: "10% Grey Melange Heather",
        sizeOrDimension: "Ne 30/1",
        color: "Grey Melange",
        unit: "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        marketQty: 14,
        requiredQty: 14000,
        bookedQty: 14000,
        bookedRate: 3.75,
        totalAmount: 52500,
        preCostRate: 3.75,
        preCostAmount: 52500,
        initialSavingAmount: 0,
        initialSavingPct: 0,
        isOverBudget: false,
        isSavingTargetMissed: false,
      },
    ],
    createdAt: "2026-10-22T11:15:00.000Z",
    updatedAt: "2026-10-22T11:15:00.000Z",
  },
];

// ============================================================================
// LocalStorage Persistence Service & Repository
// ============================================================================

const STORAGE_KEYS = {
  POLICY: "cripton_mm_policy_v1",
  POLICY_AUDIT: "cripton_mm_policy_audit_v1",
  QUOTATIONS: "cripton_mm_quotations_v1",
  PRE_COSTINGS: "cripton_mm_pre_costings_v1",
  ORDERS: "cripton_mm_orders_v1",
  ORDERS_V2: "cripton_mm_orders_v2",
  BOMS: "cripton_mm_boms_v1",
  FABRIC_BOOKINGS: "cripton_mm_fabric_bookings_v1",
  ACCESSORIES_BOOKINGS: "cripton_mm_accessories_bookings_v1",
  PROFORMA_INVOICES: "cripton_mm_pi_v1",
  AUDIT_LOGS: "cripton_mm_audit_logs_v1",
  PROCESS_TEMPLATES: "cripton_mm_process_templates_v1",
  FABRIC_ESTIMATIONS: "cripton_mm_fabric_estimations_v1",
  ACCESSORIES_ESTIMATIONS: "cripton_mm_accessories_estimations_v1",
  FABRIC_MASTER: "cripton_mm_fabric_master_v1",
  SUPPLIERS_MASTER: "cripton_mm_suppliers_master_v1",
  SEASONS_MASTER: "cripton_mm_seasons_master_v1",
  ACCESSORIES_MASTER: "cripton_mm_accessories_master_v1",
  PRE_COSTING_ATTACHMENTS: "cripton_mm_pre_costing_attachments_v1",
  FABRIC_CONSUMPTION_CAD: "cripton_mm_fabric_consumption_cad_v1",
  PRODUCTION_FILES: "cripton_mm_production_files_v1",
  ORDER_ENTRY_UI_STATE: "cripton_mm_order_entry_ui_state_v1",
  ORDER_ENTRY_DRAFT: "cripton_mm_order_entry_draft_v1",
  MANUAL_BOOKINGS: "cripton_mm_manual_bookings_v1",
  YARN_BOOKING_TAGS: "cripton_mm_yarn_booking_tags_v1",
  BLOCK_YARN_STATUS: "cripton_mm_block_yarn_status_v1",
};

export class MMRepository {
  // Safe helper to read from localStorage with fallback
  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Safe helper to write to localStorage
  private static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage ${key}:`, e);
    }
  }

  // 1. Policy
  static getPolicy(): MMCompanyPolicy {
    return this.get(STORAGE_KEYS.POLICY, DEFAULT_MM_POLICY);
  }

  static savePolicy(policy: MMCompanyPolicy, auditEntry?: MMPolicyAuditEntry): void {
    this.set(STORAGE_KEYS.POLICY, policy);
    if (auditEntry) {
      const audits = this.getPolicyAudits();
      audits.unshift(auditEntry);
      this.set(STORAGE_KEYS.POLICY_AUDIT, audits);
      this.addAuditLog({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        entityType: "CompanyPolicy",
        entityId: auditEntry.policyKey,
        action: "Update",
        userId: auditEntry.user,
        userName: auditEntry.user,
        comments: `Policy '${auditEntry.policyKey}' changed from '${auditEntry.previousValue}' to '${auditEntry.newValue}'. Reason: ${auditEntry.reason}`,
      });
    }
  }

  static getPolicyAudits(): MMPolicyAuditEntry[] {
    return this.get<MMPolicyAuditEntry[]>(STORAGE_KEYS.POLICY_AUDIT, []);
  }

  // 2. Quotations
  static getQuotations(): MMBuyerQuotation[] {
    return this.get(STORAGE_KEYS.QUOTATIONS, INITIAL_MM_QUOTATIONS);
  }

  static saveQuotation(quotation: MMBuyerQuotation): void {
    const list = this.getQuotations();
    const idx = list.findIndex((q) => q.id === quotation.id);
    if (idx >= 0) {
      list[idx] = quotation;
    } else {
      list.unshift(quotation);
    }
    this.set(STORAGE_KEYS.QUOTATIONS, list);
  }

  // 3. Pre-Costings
  static getPreCostings(): MMPreCosting[] {
    return this.get(STORAGE_KEYS.PRE_COSTINGS, INITIAL_MM_PRE_COSTINGS);
  }

  static savePreCosting(preCosting: MMPreCosting): void {
    const list = this.getPreCostings();
    const idx = list.findIndex((p) => p.id === preCosting.id);
    if (idx >= 0) {
      list[idx] = preCosting;
    } else {
      list.unshift(preCosting);
    }
    this.set(STORAGE_KEYS.PRE_COSTINGS, list);
  }

  // 4. Main Orders
  static getOrders(): MMMainOrder[] {
    const enrichJobNo = (o: MMMainOrder): MMMainOrder => {
      if (o.jobNo && o.jobNo.trim()) return o;
      const initial = INITIAL_MM_ORDERS.find((init) => init.id === o.id || init.orderNo === o.orderNo);
      const preCost = INITIAL_MM_PRE_COSTINGS.find((p) => p.preCostId === o.preCostId);
      const jobNo =
        initial?.jobNo ||
        preCost?.jobNo ||
        (o.ourRef?.startsWith("JOB-") ? o.ourRef : undefined) ||
        (o.merchandisingRef?.startsWith("JOB-") ? o.merchandisingRef : undefined) ||
        `JOB-2026-${(o.orderNo || "").replace(/\D/g, "").padStart(4, "0")}`;
      return { ...o, jobNo };
    };

    const v2Orders = this.get<MMMainOrder[] | null>(STORAGE_KEYS.ORDERS_V2, null);
    if (v2Orders !== null && Array.isArray(v2Orders)) {
      let changed = false;
      const enriched = v2Orders.map((o) => {
        const res = enrichJobNo(o);
        if (res.jobNo !== o.jobNo) changed = true;
        return res;
      });
      if (changed) {
        this.set(STORAGE_KEYS.ORDERS_V2, enriched);
      }
      return enriched;
    }
    const v1Orders = this.get<MMMainOrder[] | null>(STORAGE_KEYS.ORDERS, null);
    if (v1Orders && Array.isArray(v1Orders) && v1Orders.length > 0) {
      // Merge with INITIAL_MM_ORDERS to guarantee poDetails and deliveryLots are enriched
      const merged = v1Orders.map((o) => {
        const initial = INITIAL_MM_ORDERS.find((init) => init.id === o.id || init.orderNo === o.orderNo);
        return enrichJobNo({
          ...initial,
          ...o,
          deliveryLots: o.deliveryLots || initial?.deliveryLots || [],
          poDetails: o.poDetails || initial?.poDetails || [],
        });
      });
      this.set(STORAGE_KEYS.ORDERS_V2, merged);
      return merged;
    }
    this.set(STORAGE_KEYS.ORDERS_V2, INITIAL_MM_ORDERS);
    this.set(STORAGE_KEYS.ORDERS, INITIAL_MM_ORDERS);
    return INITIAL_MM_ORDERS;
  }

  static saveOrder(order: MMMainOrder): void {
    const list = this.getOrders();
    const idx = list.findIndex(
      (o) =>
        (Boolean(order.id) && o.id === order.id) ||
        (Boolean(order.orderNo && o.orderNo) && (o.orderNo || "").trim().toUpperCase() === (order.orderNo || "").trim().toUpperCase()) ||
        (Boolean(order.jobNo && o.jobNo) && (o.jobNo || "").trim().toUpperCase() === (order.jobNo || "").trim().toUpperCase())
    );
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...order,
        id: list[idx].id || order.id,
      };
    } else {
      list.unshift(order);
    }
    this.set(STORAGE_KEYS.ORDERS_V2, list);
    this.set(STORAGE_KEYS.ORDERS, list);
  }

  static deleteOrder(orderId: string): void {
    const list = this.getOrders().filter((o) => o.id !== orderId);
    this.set(STORAGE_KEYS.ORDERS_V2, list);
    this.set(STORAGE_KEYS.ORDERS, list);
  }

  static generateOrderNo(): string {
    const orders = this.getOrders();
    let maxNum = 42;
    orders.forEach((o) => {
      const match = (o.orderNo || "").match(/ORD-\d{4}-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    });
    const currentYear = new Date().getFullYear();
    return `ORD-${currentYear}-${String(maxNum + 1).padStart(4, "0")}`;
  }

  static getOrderEntryUiState(): { activeTab?: "register" | "entry" | "fabric-estimation"; editingOrderId?: string | null } | null {
    return this.get(STORAGE_KEYS.ORDER_ENTRY_UI_STATE, null);
  }

  static saveOrderEntryUiState(state: { activeTab?: "register" | "entry" | "fabric-estimation"; editingOrderId?: string | null }): void {
    this.set(STORAGE_KEYS.ORDER_ENTRY_UI_STATE, state);
  }

  static getOrderEntryDraft(): any | null {
    return this.get(STORAGE_KEYS.ORDER_ENTRY_DRAFT, null);
  }

  static saveOrderEntryDraft(draft: any | null): void {
    if (draft === null) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEYS.ORDER_ENTRY_DRAFT);
        } catch {}
      }
    } else {
      this.set(STORAGE_KEYS.ORDER_ENTRY_DRAFT, draft);
    }
  }

  // 5. BOMs
  static getBOMs(): MMBOM[] {
    return this.get(STORAGE_KEYS.BOMS, INITIAL_MM_BOMS);
  }

  static saveBOM(bom: MMBOM): void {
    const list = this.getBOMs();
    const idx = list.findIndex((b) => b.id === bom.id);
    if (idx >= 0) {
      list[idx] = bom;
    } else {
      list.unshift(bom);
    }
    this.set(STORAGE_KEYS.BOMS, list);
  }

  // 6. Fabric Bookings (Strict Data Integrity: Only genuinely saved user bookings)
  static getFabricBookings(): MMFabricBooking[] {
    const stored = this.get<MMFabricBooking[]>(STORAGE_KEYS.FABRIC_BOOKINGS, []);
    const dummyIds = new Set(INITIAL_MM_FABRIC_BOOKINGS.map((b) => b.id));
    const genuineOnly = (stored || []).filter(
      (b) => Boolean(b && b.id) && !dummyIds.has(b.id) && !(b as any).isSample && !(b as any).isDummy
    );
    if (stored && stored.length !== genuineOnly.length) {
      this.set(STORAGE_KEYS.FABRIC_BOOKINGS, genuineOnly);
    }
    return genuineOnly;
  }

  static saveFabricBooking(booking: MMFabricBooking): void {
    const list = this.getFabricBookings();
    const idx = list.findIndex((b) => b.id === booking.id);
    if (idx >= 0) {
      list[idx] = booking;
    } else {
      list.unshift(booking);
    }
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
    this.syncBookingToFabricEstimation(booking);
  }

  static generateNextBookingNo(jobId?: string): string {
    const list = this.getFabricBookings();
    const effectiveJobId = (jobId && jobId.trim()) || "JOB-2026-0001";
    const prefix = `${effectiveJobId}/`;
    let highest = 0;
    for (const b of list) {
      if (b.bookingNo && b.bookingNo.startsWith(prefix)) {
        const numPart = parseInt(b.bookingNo.substring(prefix.length), 10);
        if (!isNaN(numPart) && numPart > highest) {
          highest = numPart;
        }
      }
    }
    const nextSeq = highest + 1;
    const formattedSeq = nextSeq < 100 ? String(nextSeq).padStart(2, "0") : String(nextSeq);
    return `${effectiveJobId}/${formattedSeq}`;
  }

  static deleteFabricBooking(bookingId: string): void {
    const list = this.getFabricBookings().filter((b) => b.id !== bookingId);
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
  }

  static syncBookingToFabricEstimation(booking: MMFabricBooking): void {
    if (!booking.lines || booking.lines.length === 0) return;
    const estimations = this.getFabricEstimations();
    let hasChanges = false;

    for (const line of booking.lines) {
      if (!line.fabricEstimationItemId && !line.jobId && !line.fabricEstimationId) continue;
      const est = estimations.find(
        (e) =>
          (line.fabricEstimationItemId && e.fabricRows?.some((r) => r.id === line.fabricEstimationItemId)) ||
          (line.fabricEstimationId && e.id === line.fabricEstimationId) ||
          e.jobNo === line.jobId ||
          e.ourRef === line.jobId ||
          e.orderId === line.jobId
      );
      if (est && est.fabricRows) {
        for (const row of est.fabricRows) {
          // Strictly match line to the specific estimation item
          const isTargetItem = line.fabricEstimationItemId
            ? row.id === line.fabricEstimationItemId
            : ((line.fabricCode && (row.code === line.fabricCode || row.fabricNo === line.fabricCode)) &&
               (!line.fabricEstimationId || line.fabricEstimationId === est.id));
          if (isTargetItem) {
            row.bookingRef = booking.bookingNo;
            hasChanges = true;
          }
        }
        est.bookingNo = booking.bookingNo;
        est.updatedAt = new Date().toISOString();
      }
    }

    if (hasChanges) {
      this.set(STORAGE_KEYS.FABRIC_ESTIMATIONS, estimations);
    }
  }

  // 7. Accessories Bookings (Strict Data Integrity: Only genuinely saved user bookings)
  static getAccessoriesBookings(): MMAccessoriesBooking[] {
    const stored = this.get<MMAccessoriesBooking[]>(STORAGE_KEYS.ACCESSORIES_BOOKINGS, []);
    const dummyIds = new Set(INITIAL_MM_ACCESSORIES_BOOKINGS.map((b) => b.id));
    const genuineOnly = (stored || []).filter(
      (b) => Boolean(b && b.id) && !dummyIds.has(b.id) && !(b as any).isSample && !(b as any).isDummy
    );
    if (stored && stored.length !== genuineOnly.length) {
      this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, genuineOnly);
    }
    return genuineOnly;
  }

  static saveAccessoriesBooking(booking: MMAccessoriesBooking): void {
    const list = this.getAccessoriesBookings();
    const idx = list.findIndex((b) => b.id === booking.id);
    if (idx >= 0) {
      list[idx] = booking;
    } else {
      list.unshift(booking);
    }
    this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, list);
  }

  // 7.1 Manual Bookings / Block Yarn Bookings (Dedicated Independent Storage)
  static getManualBookings(): MMAccessoriesBooking[] {
    const list = this.get<MMAccessoriesBooking[]>(STORAGE_KEYS.MANUAL_BOOKINGS, []);
    if (!list || list.length === 0) {
      this.set(STORAGE_KEYS.MANUAL_BOOKINGS, INITIAL_MM_BLOCK_YARN_BOOKINGS);
      return INITIAL_MM_BLOCK_YARN_BOOKINGS;
    }
    return list;
  }

  // 7.2 Yarn Booking Tags Persistence & Real-time Balance Tracking
  static getYarnBookingTags(): MMYarnBookingTagRecord[] {
    return this.get<MMYarnBookingTagRecord[]>(STORAGE_KEYS.YARN_BOOKING_TAGS, []);
  }

  static getYarnBookingTagByRowId(yarnRowId: string): MMYarnBookingTagRecord | undefined {
    const tags = this.getYarnBookingTags();
    return tags.find((t) => t.yarnRowId === yarnRowId);
  }

  static saveYarnBookingTag(tag: MMYarnBookingTagRecord): void {
    const tags = this.getYarnBookingTags();
    const idx = tags.findIndex((t) => t.yarnRowId === tag.yarnRowId || t.id === tag.id);
    if (idx >= 0) {
      tags[idx] = tag;
    } else {
      tags.push(tag);
    }
    this.set(STORAGE_KEYS.YARN_BOOKING_TAGS, tags);
  }

  static removeYarnBookingTag(yarnRowId: string): void {
    const tags = this.getYarnBookingTags();
    const filtered = tags.filter((t) => t.yarnRowId !== yarnRowId && t.id !== yarnRowId);
    this.set(STORAGE_KEYS.YARN_BOOKING_TAGS, filtered);
  }

  static getAvailableYarnBookingBalance(
    bookingNo: string,
    yarnItemId: string,
    yarnItemName?: string,
    currentYarnRowId?: string
  ): { totalBookedKg: number; consumedKg: number; availableKg: number } {
    const bookings = this.getManualBookings();
    const booking = bookings.find((b) => b.bookingNo === bookingNo || b.id === bookingNo);
    if (!booking || !booking.items || booking.items.length === 0) {
      return { totalBookedKg: 0, consumedKg: 0, availableKg: 0 };
    }

    const item = booking.items.find(
      (it) =>
        it.bookingItemId === yarnItemId ||
        (it as any).id === yarnItemId ||
        (yarnItemName && it.itemDescription === yarnItemName)
    );
    if (!item) {
      return { totalBookedKg: 0, consumedKg: 0, availableKg: 0 };
    }

    // Determine booked quantity in KG (handling TON -> KG conversion: 1 TON = 1,000 KG)
    let totalBookedKg = 0;
    const isMarketTon =
      (item.marketUnit && item.marketUnit.toUpperCase().includes("TON")) ||
      item.conversionFactor === 1000;
    if (isMarketTon && item.marketQty && item.marketQty > 0) {
      totalBookedKg = Number(item.marketQty) * 1000;
    } else if (item.unit && item.unit.toUpperCase().includes("TON")) {
      totalBookedKg = (Number(item.bookedQty) || Number(item.requiredQty) || 0) * 1000;
    } else {
      totalBookedKg = Number(item.bookedQty) || Number(item.requiredQty) || 0;
    }

    // Sum up tagged quantities by OTHER yarn rows (excluding current row so edit balance is accurate)
    const tags = this.getYarnBookingTags();
    const consumedKg = tags
      .filter(
        (t) =>
          (t.blockBookingNo === booking.bookingNo || t.blockBookingId === booking.id) &&
          (t.yarnItemId === item.bookingItemId ||
            t.yarnItemId === (item as any).id ||
            t.yarnItemName === item.itemDescription) &&
          (!currentYarnRowId || t.yarnRowId !== currentYarnRowId)
      )
      .reduce((sum, t) => sum + (Number(t.tagQtyKg) || 0), 0);

    const availableKg = Math.max(0, Number((totalBookedKg - consumedKg).toFixed(2)));
    return {
      totalBookedKg: Number(totalBookedKg.toFixed(2)),
      consumedKg: Number(consumedKg.toFixed(2)),
      availableKg,
    };
  }

  // 7.3 Block Yarn Status Synchronization & Real-time Tracking
  static getBlockYarnStatusRecords(): MMBlockYarnStatusRecord[] {
    try {
      const rawBookings = this.getManualBookings();
      const bookings = Array.isArray(rawBookings) ? rawBookings : [];

      const rawPis = this.getPIs();
      const pis = Array.isArray(rawPis) ? rawPis : [];

      const rawTags = this.getYarnBookingTags();
      const tags = Array.isArray(rawTags) ? rawTags : [];

      // Cross-reference pre-costings to extract Buyer, Season, Job if tagged
      let preCostings: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("cripton_pre_costings_knit_master_v1");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) preCostings = parsed;
          }
        } catch (e) {}
      }

      // Check if any existing overrides/adjustments were saved
      const rawExisting = this.get<MMBlockYarnStatusRecord[]>(STORAGE_KEYS.BLOCK_YARN_STATUS, []);
      const existingRecords = Array.isArray(rawExisting) ? rawExisting : [];
      const existingMap = new Map<string, MMBlockYarnStatusRecord>();
      existingRecords.forEach((r) => {
        if (r && r.id) existingMap.set(r.id, r);
      });

      const records: MMBlockYarnStatusRecord[] = [];

      bookings.forEach((booking) => {
        if (!booking) return;

        // Find associated PI
        const linkedPi = pis.find(
          (pi) =>
            pi &&
            (pi.activeBookingId === booking.id ||
              pi.activeBookingId === booking.bookingNo ||
              (Array.isArray(pi.allocatedBookings) &&
                pi.allocatedBookings.some(
                  (ab) => ab && (ab.bookingId === booking.id || ab.bookingNo === booking.bookingNo)
                )) ||
              (booking.piReference && (pi.piNo === booking.piReference || pi.id === booking.piReference)))
        );

        const piNo = linkedPi?.piNo || booking.piReference || "-";
        let documentsStatus = "Pending PI / LC";
        if (linkedPi) {
          documentsStatus = linkedPi.lcNumber || linkedPi.lcReferenceNo || "LC Under Process";
        }

        const items = Array.isArray(booking.items) ? booking.items : [];
        items.forEach((item, itemIdx) => {
          if (!item) return;
          const rowId = `bys-${booking.id}-${item.bookingItemId || itemIdx}`;
          const existing = existingMap.get(rowId);

          // Qty in KG (TON -> KG conversion: 1 TON = 1,000 KG)
          let qtyKg = 0;
          const isMarketTon =
            (item.marketUnit &&
              typeof item.marketUnit === "string" &&
              item.marketUnit.toUpperCase().includes("TON")) ||
            item.conversionFactor === 1000;
          if (isMarketTon && item.marketQty && item.marketQty > 0) {
            qtyKg = Number(item.marketQty) * 1000;
          } else if (item.unit && typeof item.unit === "string" && item.unit.toUpperCase().includes("TON")) {
            qtyKg = (Number(item.bookedQty) || Number(item.requiredQty) || 0) * 1000;
          } else {
            qtyKg = Number(item.bookedQty) || Number(item.requiredQty) || 0;
          }

          // Matching tags from Pre Costing
          const matchingTags = tags.filter(
            (t) =>
              t &&
              (t.blockBookingNo === booking.bookingNo || t.blockBookingId === booking.id) &&
              (t.yarnItemId === item.bookingItemId ||
                t.yarnItemId === (item as any).id ||
                t.yarnItemName === item.itemDescription)
          );

          const useQty = matchingTags.reduce((sum, t) => sum + (Number(t?.tagQtyKg) || 0), 0);
          const balance = Math.max(0, Number((qtyKg - useQty).toFixed(2)));

          // Received Qty initially equal to Qty (or preserve saved manual override)
          const receivedQty = existing?.receivedQty !== undefined ? Number(existing.receivedQty) || 0 : qtyKg;

          const price = Number(item.bookedRate) || Number(item.unitPrice) || 0;
          const actualPrice = existing?.actualPrice !== undefined ? Number(existing.actualPrice) || 0 : price;

          // Buyer, Season, Job extraction
          let buyer = booking.buyerName || "H&M Europe";
          let season = booking.season || "Spring/Summer 2026";
          let job = booking.ourRef || booking.orderNo || "JOB-2026-0001";

          if (matchingTags.length > 0) {
            for (const tag of matchingTags) {
              const pc = preCostings.find(
                (p) =>
                  p &&
                  (p.id === tag.preCostId || p.preCostId === tag.preCostId || p.preCostNo === tag.preCostId)
              );
              if (pc) {
                if (pc.buyer) buyer = pc.buyer;
                if (pc.season) season = pc.season;
                if (pc.preCostId || pc.preCostNo || pc.style) job = pc.preCostId || pc.style;
                break;
              }
            }
          }

          // Yarn Count extraction
          let yarnCount = item.sizeOrDimension || "";
          if (!yarnCount) {
            const desc = `${item.itemDescription || ""} ${item.specification || ""}`;
            const countMatch = desc.match(/Ne\s*[\d/]+|\b\d{1,3}\/\d{1,2}\b/i);
            yarnCount = countMatch ? countMatch[0].toUpperCase() : item.itemDescription || "Ne 30/1";
          }

          records.push({
            id: rowId,
            bookingId: booking.id || `booking-${itemIdx}`,
            bookingItemId: item.bookingItemId || `item-${itemIdx}`,
            buyer: buyer || "H&M Europe",
            blockNo: booking.bookingNo || "BYB-2026-0001",
            season: season || "Spring/Summer 2026",
            job: job || "JOB-2026-0001",
            yarnCount: yarnCount || "Ne 30/1",
            yarnComposition: item.specification || "",
            yarnItem: item.itemDescription || "100% Combed Cotton Yarn",
            qty: Number(qtyKg) || 0,
            marketQtyTon: item.marketQty,
            useQty: Number(Number(useQty).toFixed(2)) || 0,
            balance: Number(Number(balance).toFixed(2)) || 0,
            price: Number(price) || 0,
            bookingDate: booking.bookingDate || "",
            receivedQty: Number(receivedQty) || 0,
            documentsStatus: documentsStatus || "Pending PI / LC",
            actualPrice: Number(actualPrice) || 0,
            piNo: piNo || "-",
            piId: linkedPi?.id,
            supplierName: booking.supplierName || (item as any).supplierName || "Square Textiles Ltd",
            tags: matchingTags,
          });
        });
      });

      this.set(STORAGE_KEYS.BLOCK_YARN_STATUS, records);
      return records;
    } catch (error) {
      console.error("Error in getBlockYarnStatusRecords:", error);
      return [];
    }
  }

  static saveBlockYarnStatusRecord(record: MMBlockYarnStatusRecord): void {
    const list = this.get<MMBlockYarnStatusRecord[]>(STORAGE_KEYS.BLOCK_YARN_STATUS, []);
    const idx = list.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    this.set(STORAGE_KEYS.BLOCK_YARN_STATUS, list);
  }

  static getManualBookingById(id: string): MMAccessoriesBooking | undefined {
    const list = this.getManualBookings();
    return list.find((b) => b.id === id || b.bookingNo === id);
  }

  static saveManualBooking(booking: MMAccessoriesBooking): void {
    const list = this.getManualBookings();
    const idx = list.findIndex((b) => b.id === booking.id || b.bookingNo === booking.bookingNo);
    if (idx >= 0) {
      list[idx] = booking;
    } else {
      list.unshift(booking);
    }
    this.set(STORAGE_KEYS.MANUAL_BOOKINGS, list);
  }

  static deleteManualBooking(id: string): boolean {
    const list = this.getManualBookings();
    const filtered = list.filter((b) => b.id !== id && b.bookingNo !== id);
    if (filtered.length !== list.length) {
      this.set(STORAGE_KEYS.MANUAL_BOOKINGS, filtered);
      return true;
    }
    return false;
  }

  static submitManualBooking(bookingId: string, user: string = "Tanvir Ahmed"): boolean {
    const list = this.getManualBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Draft";
    booking.status = "Pending";
    booking.submittedBy = user;
    booking.submittedDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Submitted",
      previousStatus: prevStatus,
      newStatus: "Pending",
      performedBy: user,
      timestamp: new Date().toISOString(),
      comment: "Submitted for authorization",
    });
    this.set(STORAGE_KEYS.MANUAL_BOOKINGS, list);
    return true;
  }

  static approveManualBooking(bookingId: string, approver: string = "Authorized Approver", comment?: string): boolean {
    const list = this.getManualBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Approved";
    booking.approvedBy = approver;
    booking.approvalDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Approved",
      previousStatus: prevStatus,
      newStatus: "Approved",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment || "Manual Booking officially approved",
    });
    this.set(STORAGE_KEYS.MANUAL_BOOKINGS, list);
    return true;
  }

  static rejectManualBooking(bookingId: string, approver: string = "Authorized Approver", reason: string): boolean {
    const list = this.getManualBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Rejected";
    booking.rejectionReason = reason;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Rejected",
      previousStatus: prevStatus,
      newStatus: "Rejected",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: reason,
    });
    this.set(STORAGE_KEYS.MANUAL_BOOKINGS, list);
    return true;
  }

  static returnManualBooking(bookingId: string, approver: string = "Authorized Approver", comment: string): boolean {
    const list = this.getManualBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Returned";
    booking.returnReason = comment;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Returned",
      previousStatus: prevStatus,
      newStatus: "Returned",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment,
    });
    this.set(STORAGE_KEYS.MANUAL_BOOKINGS, list);
    return true;
  }

  // Fabric Booking Approval Workflow
  static submitFabricBooking(bookingId: string, user: string = "Tanvir Ahmed"): boolean {
    const list = this.getFabricBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Draft";
    booking.status = "Pending";
    booking.submittedBy = user;
    booking.submittedDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Submitted",
      previousStatus: prevStatus,
      newStatus: "Pending",
      performedBy: user,
      timestamp: new Date().toISOString(),
      comment: "Submitted for authorization",
    });
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
    return true;
  }

  static approveFabricBooking(bookingId: string, approver: string = "Authorized Approver", comment?: string): boolean {
    const list = this.getFabricBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Approved";
    booking.approvedBy = approver;
    booking.approvalDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Approved",
      previousStatus: prevStatus,
      newStatus: "Approved",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment || "Booking officially approved",
    });
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
    return true;
  }

  static rejectFabricBooking(bookingId: string, approver: string = "Authorized Approver", reason: string): boolean {
    const list = this.getFabricBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Rejected";
    booking.rejectionReason = reason;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Rejected",
      previousStatus: prevStatus,
      newStatus: "Rejected",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: reason,
    });
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
    return true;
  }

  static returnFabricBooking(bookingId: string, approver: string = "Authorized Approver", comment: string): boolean {
    const list = this.getFabricBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Returned";
    booking.returnReason = comment;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Returned",
      previousStatus: prevStatus,
      newStatus: "Returned",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment,
    });
    this.set(STORAGE_KEYS.FABRIC_BOOKINGS, list);
    return true;
  }

  // Accessories Booking Approval Workflow
  static submitAccessoriesBooking(bookingId: string, user: string = "Tanvir Ahmed"): boolean {
    const list = this.getAccessoriesBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Draft";
    booking.status = "Pending";
    booking.submittedBy = user;
    booking.submittedDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Submitted",
      previousStatus: prevStatus,
      newStatus: "Pending",
      performedBy: user,
      timestamp: new Date().toISOString(),
      comment: "Submitted for authorization",
    });
    this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, list);
    return true;
  }

  static approveAccessoriesBooking(bookingId: string, approver: string = "Authorized Approver", comment?: string): boolean {
    const list = this.getAccessoriesBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Approved";
    booking.approvedBy = approver;
    booking.approvalDate = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Approved",
      previousStatus: prevStatus,
      newStatus: "Approved",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment || "Booking officially approved",
    });
    this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, list);
    return true;
  }

  static rejectAccessoriesBooking(bookingId: string, approver: string = "Authorized Approver", reason: string): boolean {
    const list = this.getAccessoriesBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Rejected";
    booking.rejectionReason = reason;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Rejected",
      previousStatus: prevStatus,
      newStatus: "Rejected",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: reason,
    });
    this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, list);
    return true;
  }

  static returnAccessoriesBooking(bookingId: string, approver: string = "Authorized Approver", comment: string): boolean {
    const list = this.getAccessoriesBookings();
    const booking = list.find((b) => b.id === bookingId || b.bookingNo === bookingId);
    if (!booking) return false;
    const prevStatus = booking.status || "Pending";
    booking.status = "Returned";
    booking.returnReason = comment;
    booking.updatedAt = new Date().toISOString();
    if (!booking.approvalHistory) booking.approvalHistory = [];
    booking.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      action: "Returned",
      previousStatus: prevStatus,
      newStatus: "Returned",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment,
    });
    this.set(STORAGE_KEYS.ACCESSORIES_BOOKINGS, list);
    return true;
  }

  // 8. Proforma Invoices (PI)
  static getPIs(): MMProformaInvoice[] {
    return this.get(STORAGE_KEYS.PROFORMA_INVOICES, INITIAL_MM_PROFORMA_INVOICES);
  }

  static savePI(pi: MMProformaInvoice): void {
    const list = this.getPIs();
    const idx = list.findIndex((p) => p.id === pi.id);
    if (idx >= 0) {
      list[idx] = pi;
    } else {
      list.unshift(pi);
    }
    this.set(STORAGE_KEYS.PROFORMA_INVOICES, list);
  }

  static deletePI(id: string): void {
    const list = this.getPIs().filter((p) => p.id !== id);
    this.set(STORAGE_KEYS.PROFORMA_INVOICES, list);
  }

  static generateNextPIEntryNo(): string {
    const list = this.getPIs();
    const count = list.length + 1;
    return `ENT-PI-${String(count).padStart(3, "0")}`;
  }

  static generateNextPINumber(supplierName?: string): string {
    const list = this.getPIs();
    const count = list.length + 1;
    const prefix = supplierName
      ? supplierName
          .split(" ")
          .map((w) => w[0]?.toUpperCase() || "")
          .join("")
          .slice(0, 3)
      : "PK";
    const year = new Date().getFullYear();
    return `PI-${prefix}-${year}-${String(count).padStart(4, "0")}`;
  }

  static approvePI(piId: string, approver: string = "Authorized Approver", comment?: string): boolean {
    const list = this.getPIs();
    const pi = list.find((p) => p.id === piId || p.piNo === piId);
    if (!pi) return false;
    const prevStatus = pi.status;
    pi.status = "Approved";
    pi.approvedBy = approver;
    pi.approvalDate = new Date().toISOString().split("T")[0];
    if (!pi.approvalHistory) pi.approvalHistory = [];
    pi.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: pi.id,
      bookingNo: pi.piNo,
      action: "Approved",
      previousStatus: prevStatus,
      newStatus: "Approved",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment || "Approved by Merchandising Management",
    });
    this.set(STORAGE_KEYS.PROFORMA_INVOICES, list);
    this.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityType: "PI",
      entityId: pi.id,
      action: "Approve",
      userId: approver,
      userName: approver,
      comments: comment,
    });
    return true;
  }

  static rejectPI(piId: string, approver: string = "Authorized Approver", reason: string): boolean {
    const list = this.getPIs();
    const pi = list.find((p) => p.id === piId || p.piNo === piId);
    if (!pi) return false;
    const prevStatus = pi.status;
    pi.status = "Rejected";
    pi.rejectionReason = reason;
    if (!pi.approvalHistory) pi.approvalHistory = [];
    pi.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: pi.id,
      bookingNo: pi.piNo,
      action: "Rejected",
      previousStatus: prevStatus,
      newStatus: "Rejected",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: reason,
    });
    this.set(STORAGE_KEYS.PROFORMA_INVOICES, list);
    this.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityType: "PI",
      entityId: pi.id,
      action: "Reject",
      userId: approver,
      userName: approver,
      comments: reason,
    });
    return true;
  }

  static returnPI(piId: string, approver: string = "Authorized Approver", comment: string): boolean {
    const list = this.getPIs();
    const pi = list.find((p) => p.id === piId || p.piNo === piId);
    if (!pi) return false;
    const prevStatus = pi.status;
    pi.status = "Returned";
    pi.returnReason = comment;
    if (!pi.approvalHistory) pi.approvalHistory = [];
    pi.approvalHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId: pi.id,
      bookingNo: pi.piNo,
      action: "Returned",
      previousStatus: prevStatus,
      newStatus: "Returned",
      performedBy: approver,
      timestamp: new Date().toISOString(),
      comment: comment,
    });
    this.set(STORAGE_KEYS.PROFORMA_INVOICES, list);
    this.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityType: "PI",
      entityId: pi.id,
      action: "Update",
      userId: approver,
      userName: approver,
      comments: `Returned for correction: ${comment}`,
    });
    return true;
  }

  // 9. Audit Logs
  static getAuditLogs(): MMAuditLogEntry[] {
    return this.get(STORAGE_KEYS.AUDIT_LOGS, INITIAL_MM_AUDIT_LOGS);
  }

  static addAuditLog(entry: MMAuditLogEntry): void {
    const list = this.getAuditLogs();
    list.unshift(entry);
    this.set(STORAGE_KEYS.AUDIT_LOGS, list);
  }

  // 10. Cost Saving Aggregation Engine
  // Traces Main Order -> Style -> PO -> Pre-Cost ID & Version -> Pre-Cost Item ID -> BOM Item ID -> Booked Item ID
  static generateCostSavingAnalysis(): MMCostSavingRow[] {
    const rows: MMCostSavingRow[] = [];
    const policy = this.getPolicy();
    const fabricBookings = this.getFabricBookings();
    const accBookings = this.getAccessoriesBookings();
    const preCostings = this.getPreCostings();
    const boms = this.getBOMs();
    const orders = this.getOrders();

    // Fabric lines
    fabricBookings.forEach((fb) => {
      fb.items.forEach((item) => {
        const order = orders.find((o) => o.id === item.orderId || o.orderNo === item.orderNo);
        const pc = preCostings.find((p) => p.preCostId === order?.preCostId);
        const bom = boms.find((b) => b.orderId === item.orderId || b.orderNo === item.orderNo);
        const bomItem = bom?.items.find((bi) => bi.preCostItemId === item.preCostItemId);

        const initialSaving = item.preCostAmount - item.totalAmount;
        const savingPct = item.preCostAmount > 0 ? (initialSaving / item.preCostAmount) * 100 : 0;
        const costVariance = item.totalAmount - item.preCostAmount; // positive = overrun

        rows.push({
          rowId: `CSR-FB-${item.bookingItemId}`,
          orderNo: item.orderNo,
          styleNo: item.styleNo,
          buyerName: order?.buyerName || "H&M Hennes & Mauritz",
          poNumber: item.poNumber,
          preCostId: order?.preCostId || "PC-2026-001",
          preCostVersion: order?.preCostVersion || 1,
          preCostItemId: item.preCostItemId,
          bomItemId: bomItem?.bomItemId || "N/A",
          bookingNo: fb.bookingNo,
          bookingItemId: item.bookingItemId,
          bookingType: "Fabric",
          category: "Fabric",
          itemDescription: item.fabricDescription,
          specification: item.diaGsm,
          uom: item.unit,
          preCostQty: item.requiredQty,
          preCostRate: item.preCostRate,
          preCostAmount: item.preCostAmount,
          bomQty: bomItem?.bomTotalRequiredQty || item.requiredQty,
          bomCost: bomItem?.bomEstimatedCost || item.preCostAmount,
          bookedQty: item.bookedQty,
          bookedRate: item.unitRate,
          bookedAmount: item.totalAmount,
          qtyVariance: item.bookedQty - item.requiredQty,
          rateVariance: item.unitRate - item.preCostRate,
          costVariance: costVariance,
          initialBookingSaving: initialSaving,
          savingPercentage: Number(savingPct.toFixed(2)),
          isOverBudget: item.unitRate > item.preCostRate,
          isTargetException: savingPct < policy.savingTargetPercentage,
          exceptionReason: item.exceptionReason,
          approvalStatus: fb.status,
        });
      });
    });

    // Accessories lines
    accBookings.forEach((ab) => {
      ab.items.forEach((item) => {
        const order = orders.find((o) => o.id === item.orderId || o.orderNo === item.orderNo);
        const bom = boms.find((b) => b.orderId === item.orderId || b.orderNo === item.orderNo);
        const bomItem = bom?.items.find((bi) => bi.preCostItemId === item.preCostItemId);

        const initialSaving = item.preCostAmount - item.totalAmount;
        const savingPct = item.preCostAmount > 0 ? (initialSaving / item.preCostAmount) * 100 : 0;
        const costVariance = item.totalAmount - item.preCostAmount;

        rows.push({
          rowId: `CSR-AB-${item.bookingItemId}`,
          orderNo: item.orderNo,
          styleNo: item.styleNo,
          buyerName: order?.buyerName || "Zara (Inditex)",
          poNumber: item.poNumber,
          preCostId: order?.preCostId || "PC-2026-002",
          preCostVersion: order?.preCostVersion || 1,
          preCostItemId: item.preCostItemId,
          bomItemId: bomItem?.bomItemId || "N/A",
          bookingNo: ab.bookingNo,
          bookingItemId: item.bookingItemId,
          bookingType: "Accessories",
          category: "Accessories",
          itemDescription: item.itemDescription,
          specification: `${item.specification} (${item.sizeOrDimension})`,
          uom: item.unit,
          preCostQty: item.requiredQty,
          preCostRate: item.preCostRate,
          preCostAmount: item.preCostAmount,
          bomQty: bomItem?.bomTotalRequiredQty || item.requiredQty,
          bomCost: bomItem?.bomEstimatedCost || item.preCostAmount,
          bookedQty: item.bookedQty,
          bookedRate: item.bookedRate,
          bookedAmount: item.totalAmount,
          qtyVariance: item.bookedQty - item.requiredQty,
          rateVariance: item.bookedRate - item.preCostRate,
          costVariance: costVariance,
          initialBookingSaving: initialSaving,
          savingPercentage: Number(savingPct.toFixed(2)),
          isOverBudget: item.bookedRate > item.preCostRate,
          isTargetException: savingPct < policy.savingTargetPercentage,
          exceptionReason: item.exceptionReason,
          approvalStatus: ab.status,
        });
      });
    });

    return rows;
  }

  // 11. Process Templates
  static getProcessTemplates(): MMProcessTemplate[] {
    return this.get<MMProcessTemplate[]>(STORAGE_KEYS.PROCESS_TEMPLATES, DEFAULT_PROCESS_TEMPLATES);
  }

  static saveProcessTemplate(template: MMProcessTemplate): void {
    const list = this.getProcessTemplates();
    const idx = list.findIndex((t) => t.id === template.id || t.name.toLowerCase() === template.name.toLowerCase());
    if (idx >= 0) {
      list[idx] = template;
    } else {
      list.push(template);
    }
    this.set(STORAGE_KEYS.PROCESS_TEMPLATES, list);
  }

  // 12. Unique Job No Generator
  static generateJobNo(): string {
    const orders = this.getOrders();
    const costings = this.getPreCostings();
    const existing = new Set<string>();
    orders.forEach((o) => {
      if (o.jobNo) existing.add(o.jobNo.toUpperCase());
      if (o.ourRef) existing.add(o.ourRef.toUpperCase());
    });
    costings.forEach((c) => {
      if (c.jobNo) existing.add(c.jobNo.toUpperCase());
    });
    const currentYear = new Date().getFullYear();
    let counter = orders.length + costings.length + 1;
    let candidate = `JOB-${currentYear}-${String(counter).padStart(4, "0")}`;
    while (existing.has(candidate)) {
      counter++;
      candidate = `JOB-${currentYear}-${String(counter).padStart(4, "0")}`;
    }
    return candidate;
  }

  // 13. Fabric Estimation Records (Per Parent Order)
  static cleanOrphanFabricBookingNumbers(): void {
    if (typeof window === "undefined") return;
    const estimations = this.get<MMFabricEstimationRecord[]>(STORAGE_KEYS.FABRIC_ESTIMATIONS, INITIAL_MM_FABRIC_ESTIMATIONS);
    const bookings = this.getFabricBookings();

    // Map of verified bookings
    const validBookingNos = new Set<string>();
    for (const b of bookings) {
      if (b.bookingNo) validBookingNos.add(b.bookingNo);
      if (b.id) validBookingNos.add(b.id);
    }

    let changed = false;
    for (const est of estimations) {
      // If estimation.bookingNo does not point to an actual saved booking, clear it
      if (est.bookingNo && !validBookingNos.has(est.bookingNo)) {
        est.bookingNo = "";
        changed = true;
      }

      if (est.fabricRows && Array.isArray(est.fabricRows)) {
        for (const row of est.fabricRows) {
          if (row.bookingRef) {
            // Check if bookingRef corresponds to an actual saved booking that contains this item
            const matchingBooking = bookings.find(
              (b) => b.bookingNo === row.bookingRef || b.id === row.bookingRef
            );
            if (!matchingBooking) {
              row.bookingRef = "";
              changed = true;
            } else {
              // Verify the booking actually has this item
              const isItemInBooking =
                (matchingBooking.lines &&
                  matchingBooking.lines.some(
                    (l) =>
                      l.fabricEstimationItemId === row.id ||
                      (!l.fabricEstimationItemId &&
                        (l.jobId === est.jobNo || l.ourRef === est.ourRef) &&
                        (l.fabricCode === row.code || l.fabricCode === row.fabricNo))
                  )) ||
                (matchingBooking.items &&
                  matchingBooking.items.some(
                    (it) =>
                      it.estimationItemId === row.id ||
                      (!it.estimationItemId &&
                        (it.orderNo === est.jobNo || it.styleNo === est.style) &&
                        it.fabricDescription === row.fabricDescription)
                  ));

              if (!isItemInBooking) {
                row.bookingRef = "";
                changed = true;
              }
            }
          }
        }
      }
    }

    if (changed) {
      this.set(STORAGE_KEYS.FABRIC_ESTIMATIONS, estimations);
    }
  }

  static getFabricEstimations(): MMFabricEstimationRecord[] {
    this.cleanOrphanFabricBookingNumbers();
    return this.get<MMFabricEstimationRecord[]>(STORAGE_KEYS.FABRIC_ESTIMATIONS, INITIAL_MM_FABRIC_ESTIMATIONS);
  }

  static getFabricEstimationByOrderId(orderIdOrJobNo: string): MMFabricEstimationRecord | undefined {
    const list = this.getFabricEstimations();
    return list.find(
      (e) =>
        e.orderId === orderIdOrJobNo ||
        e.jobNo === orderIdOrJobNo ||
        e.ourRef === orderIdOrJobNo
    );
  }

  static saveFabricEstimation(estimation: MMFabricEstimationRecord): void {
    const list = this.getFabricEstimations();
    const bookings = this.getFabricBookings();
    const validBookingNos = new Set(bookings.map((b) => b.bookingNo).filter(Boolean));

    // Never generate or persist dummy/unverified booking numbers during estimation save
    const sanitizedEstimation: MMFabricEstimationRecord = {
      ...estimation,
      bookingNo:
        estimation.bookingNo && validBookingNos.has(estimation.bookingNo)
          ? estimation.bookingNo
          : "",
      fabricRows: (estimation.fabricRows || []).map((row) => ({
        ...row,
        bookingRef:
          row.bookingRef && validBookingNos.has(row.bookingRef)
            ? row.bookingRef
            : "",
      })),
      updatedAt: new Date().toISOString(),
    };

    const idx = list.findIndex(
      (e) =>
        e.id === sanitizedEstimation.id ||
        (e.orderId && e.orderId === sanitizedEstimation.orderId) ||
        (e.jobNo && e.jobNo === sanitizedEstimation.jobNo) ||
        (e.ourRef && e.ourRef === sanitizedEstimation.ourRef)
    );
    if (idx >= 0) {
      list[idx] = sanitizedEstimation;
    } else {
      list.unshift(sanitizedEstimation);
    }
    this.set(STORAGE_KEYS.FABRIC_ESTIMATIONS, list);
  }

  // 14. Accessories Estimation Records (Per Parent Order)
  static cleanOrphanAccessoriesBookingNumbers(): void {
    const bookings = this.getAccessoriesBookings();
    const estimations = this.get<MMAccessoriesEstimationRecord[]>(
      STORAGE_KEYS.ACCESSORIES_ESTIMATIONS,
      INITIAL_MM_ACCESSORIES_ESTIMATIONS
    );

    const validBookingNos = new Set<string>();
    for (const b of bookings) {
      if (b.bookingNo) validBookingNos.add(b.bookingNo);
      if (b.id) validBookingNos.add(b.id);
    }

    let changed = false;
    for (const est of estimations) {
      // If estimation.bookingNo does not point to an actual saved booking, clear it
      if (est.bookingNo && !validBookingNos.has(est.bookingNo)) {
        est.bookingNo = "";
        changed = true;
      }

      if (est.accessoriesRows && Array.isArray(est.accessoriesRows)) {
        for (const row of est.accessoriesRows) {
          if (row.bookingRef) {
            // Check if bookingRef corresponds to an actual saved booking
            const matchingBooking = bookings.find(
              (b) => b.bookingNo === row.bookingRef || b.id === row.bookingRef
            );
            if (!matchingBooking) {
              row.bookingRef = "";
              if (row.bookingStatus === "Booked" || row.bookingStatus === "Pending") {
                row.bookingStatus = "Not Booked";
              }
              changed = true;
            } else {
              // Verify the booking actually contains this exact estimation item
              const isItemInBooking =
                (matchingBooking.items &&
                  matchingBooking.items.some(
                    (it) =>
                      it.estimationItemId === row.id ||
                      (!it.estimationItemId &&
                        (it.orderNo === est.jobNo || it.styleNo === est.style) &&
                        it.itemDescription === row.description)
                  )) ||
                (matchingBooking.lines &&
                  matchingBooking.lines.some(
                    (l) =>
                      (l as any).estimationItemId === row.id ||
                      l.id === row.id ||
                      (!((l as any).estimationItemId) &&
                        (l.ourRef === est.jobNo || l.ourRef === est.ourRef) &&
                        l.accessoryItem &&
                        row.itemName &&
                        l.accessoryItem.toLowerCase().trim() === row.itemName.toLowerCase().trim())
                  ));

              if (!isItemInBooking) {
                row.bookingRef = "";
                if (row.bookingStatus === "Booked" || row.bookingStatus === "Pending") {
                  row.bookingStatus = "Not Booked";
                }
                changed = true;
              }
            }
          }
        }
      }
    }

    if (changed) {
      this.set(STORAGE_KEYS.ACCESSORIES_ESTIMATIONS, estimations);
    }
  }

  static getAccessoriesEstimations(): MMAccessoriesEstimationRecord[] {
    this.cleanOrphanAccessoriesBookingNumbers();
    return this.get<MMAccessoriesEstimationRecord[]>(STORAGE_KEYS.ACCESSORIES_ESTIMATIONS, INITIAL_MM_ACCESSORIES_ESTIMATIONS);
  }

  static getAccessoriesEstimationByOrderId(orderIdOrJobNo: string): MMAccessoriesEstimationRecord | undefined {
    const list = this.getAccessoriesEstimations();
    return list.find(
      (e) =>
        e.orderId === orderIdOrJobNo ||
        e.jobNo === orderIdOrJobNo ||
        e.ourRef === orderIdOrJobNo
    );
  }

  static saveAccessoriesEstimation(estimation: MMAccessoriesEstimationRecord): void {
    const list = this.getAccessoriesEstimations();
    const bookings = this.getAccessoriesBookings();
    const validBookingNos = new Set(bookings.map((b) => b.bookingNo).filter(Boolean));

    // Never generate or persist dummy/unverified booking numbers during estimation save
    const sanitizedEstimation: MMAccessoriesEstimationRecord = {
      ...estimation,
      bookingNo:
        estimation.bookingNo && validBookingNos.has(estimation.bookingNo)
          ? estimation.bookingNo
          : "",
      accessoriesRows: (estimation.accessoriesRows || []).map((row) => ({
        ...row,
        bookingRef:
          row.bookingRef && validBookingNos.has(row.bookingRef)
            ? row.bookingRef
            : "",
        bookingStatus:
          row.bookingRef && validBookingNos.has(row.bookingRef)
            ? row.bookingStatus || "Booked"
            : "Not Booked",
      })),
      updatedAt: new Date().toISOString(),
    };

    const idx = list.findIndex(
      (e) =>
        e.id === sanitizedEstimation.id ||
        (e.orderId && e.orderId === sanitizedEstimation.orderId) ||
        (e.jobNo && e.jobNo === sanitizedEstimation.jobNo) ||
        (e.ourRef && e.ourRef === sanitizedEstimation.ourRef)
    );
    if (idx >= 0) {
      list[idx] = sanitizedEstimation;
    } else {
      list.unshift(sanitizedEstimation);
    }
    this.set(STORAGE_KEYS.ACCESSORIES_ESTIMATIONS, list);
  }

  static saveAllAccessoriesEstimations(list: MMAccessoriesEstimationRecord[]): void {
    const bookings = this.getAccessoriesBookings();
    const validBookingNos = new Set(bookings.map((b) => b.bookingNo).filter(Boolean));

    const sanitizedList = list.map((estimation) => ({
      ...estimation,
      bookingNo:
        estimation.bookingNo && validBookingNos.has(estimation.bookingNo)
          ? estimation.bookingNo
          : "",
      accessoriesRows: (estimation.accessoriesRows || []).map((row) => ({
        ...row,
        bookingRef:
          row.bookingRef && validBookingNos.has(row.bookingRef)
            ? row.bookingRef
            : "",
        bookingStatus:
          row.bookingRef && validBookingNos.has(row.bookingRef)
            ? row.bookingStatus || "Booked"
            : "Not Booked",
      })),
      updatedAt: new Date().toISOString(),
    }));

    this.set(STORAGE_KEYS.ACCESSORIES_ESTIMATIONS, sanitizedList);
  }

  static deleteAccessoriesEstimation(id: string): void {
    const list = this.getAccessoriesEstimations().filter((e) => e.id !== id);
    this.set(STORAGE_KEYS.ACCESSORIES_ESTIMATIONS, list);
  }

  // 15. Fabric Master Selection Library
  static getFabricMaster(): MMFabricMasterItem[] {
    return this.get<MMFabricMasterItem[]>(STORAGE_KEYS.FABRIC_MASTER, INITIAL_MM_FABRIC_MASTER);
  }

  static saveFabricMasterItem(item: MMFabricMasterItem): void {
    const list = this.getFabricMaster();
    const idx = list.findIndex((f) => f.id === item.id || f.fabricCode === item.fabricCode);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    this.set(STORAGE_KEYS.FABRIC_MASTER, list);
  }

  // 15. Supplier Master Selection Library
  static getSuppliers(): MMSupplierMasterItem[] {
    return this.get<MMSupplierMasterItem[]>(STORAGE_KEYS.SUPPLIERS_MASTER, INITIAL_MM_SUPPLIERS_MASTER);
  }

  static saveSupplier(supplier: MMSupplierMasterItem): void {
    const list = this.getSuppliers();
    const idx = list.findIndex((s) => s.id === supplier.id || s.supplierCode === supplier.supplierCode);
    if (idx >= 0) {
      list[idx] = supplier;
    } else {
      list.unshift(supplier);
    }
    this.set(STORAGE_KEYS.SUPPLIERS_MASTER, list);
  }

  // SC / LC Master Selection Library
  static getSCLCs(): MMSCLCMaster[] {
    return MM_SC_LC_MASTER;
  }

  // 16. Seasons Master Selection Library
  static getSeasons(): MMSeasonMasterItem[] {
    return this.get<MMSeasonMasterItem[]>(STORAGE_KEYS.SEASONS_MASTER, INITIAL_MM_SEASONS_MASTER);
  }

  static saveSeason(season: MMSeasonMasterItem): void {
    const list = this.getSeasons();
    const idx = list.findIndex((s) => s.id === season.id || s.seasonName.toLowerCase() === season.seasonName.toLowerCase());
    if (idx >= 0) {
      list[idx] = season;
    } else {
      list.unshift(season);
    }
    this.set(STORAGE_KEYS.SEASONS_MASTER, list);
  }

  // 17. Accessories Master Selection Library
  static getAccessoriesMaster(): MMAccessoriesMasterItem[] {
    return this.get<MMAccessoriesMasterItem[]>(STORAGE_KEYS.ACCESSORIES_MASTER, INITIAL_MM_ACCESSORIES_MASTER);
  }

  static saveAccessoriesMasterItem(item: MMAccessoriesMasterItem): void {
    const list = this.getAccessoriesMaster();
    const idx = list.findIndex((a) => a.id === item.id || a.itemCode === item.itemCode);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    this.set(STORAGE_KEYS.ACCESSORIES_MASTER, list);
  }

  // 18. Pre Costing Attachments Library
  static getPreCostingAttachments(preCostId?: string, version?: number): MMPreCostAttachmentRecord[] {
    const list = this.get<MMPreCostAttachmentRecord[]>(STORAGE_KEYS.PRE_COSTING_ATTACHMENTS, INITIAL_MM_PRE_COST_ATTACHMENTS);
    if (!preCostId) return list;
    return list.filter((a) => a.preCostId === preCostId && (version === undefined || a.version === version));
  }

  static savePreCostingAttachments(attachments: MMPreCostAttachmentRecord[]): void {
    this.set(STORAGE_KEYS.PRE_COSTING_ATTACHMENTS, attachments);
  }

  // 19. Fabric Consumption CAD Requests & Responses
  static getFabricConsumptionCadList(): MMFabricConsumptionCadRecord[] {
    return this.get<MMFabricConsumptionCadRecord[]>(
      STORAGE_KEYS.FABRIC_CONSUMPTION_CAD,
      INITIAL_MM_FABRIC_CONSUMPTION_CAD
    );
  }

  static saveFabricConsumptionCadList(list: MMFabricConsumptionCadRecord[]): void {
    this.set(STORAGE_KEYS.FABRIC_CONSUMPTION_CAD, list);
  }

  static getFabricConsumptionCadById(id: string): MMFabricConsumptionCadRecord | null {
    const list = this.getFabricConsumptionCadList();
    return list.find((item) => item.id === id || item.requestNo === id) || null;
  }

  static saveFabricConsumptionCadRecord(record: MMFabricConsumptionCadRecord): void {
    const list = this.getFabricConsumptionCadList();
    const index = list.findIndex((item) => item.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.saveFabricConsumptionCadList(list);
  }

  static deleteFabricConsumptionCadRecord(id: string): void {
    const list = this.getFabricConsumptionCadList();
    const filtered = list.filter((item) => item.id !== id);
    this.saveFabricConsumptionCadList(filtered);
  }

  static getCadBodyParts(): string[] {
    return this.get<string[]>("cripton_cad_body_parts_master_v1", DEFAULT_CAD_BODY_PARTS);
  }

  static addCadBodyPart(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const current = this.getCadBodyParts();
    const exists = current.some((p) => p.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;
    const updated = [...current, trimmed];
    this.set("cripton_cad_body_parts_master_v1", updated);
    return true;
  }

  static getBuyerConfiguredSizes(buyerName: string): { sizeRanges: string[]; configuredSizes: string[] } {
    const buyer = MM_BUYERS_MASTER.find((b) => b.name === buyerName);
    if (buyer) {
      return {
        sizeRanges: buyer.sizeRanges || ["S TO XL"],
        configuredSizes: buyer.configuredSizes || ["S", "M", "L", "XL"],
      };
    }
    return {
      sizeRanges: ["S TO L", "S TO XL", "XS TO XXL"],
      configuredSizes: ["S", "M", "L", "XL"],
    };
  }

  // 20. Production File Management
  static getProductionFiles(): MMProductionFileRecord[] {
    return this.get<MMProductionFileRecord[]>(
      STORAGE_KEYS.PRODUCTION_FILES,
      INITIAL_MM_PRODUCTION_FILES
    );
  }

  static saveProductionFiles(list: MMProductionFileRecord[]): void {
    this.set(STORAGE_KEYS.PRODUCTION_FILES, list);
  }

  static getProductionFileById(id: string): MMProductionFileRecord | null {
    const list = this.getProductionFiles();
    return list.find((item) => item.id === id || item.fileRefNo === id) || null;
  }

  static saveProductionFile(record: MMProductionFileRecord): void {
    const list = this.getProductionFiles();
    const index = list.findIndex((item) => item.id === record.id || item.fileRefNo === record.fileRefNo);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.saveProductionFiles(list);
  }

  static deleteProductionFile(id: string): void {
    const list = this.getProductionFiles();
    const filtered = list.filter((item) => item.id !== id && item.fileRefNo !== id);
    this.saveProductionFiles(filtered);
  }

  static approveProductionFile(id: string, approverName: string, comments?: string): boolean {
    const list = this.getProductionFiles();
    const index = list.findIndex((item) => item.id === id || item.fileRefNo === id);
    if (index === -1) return false;
    const item = list[index];
    if (item.status === "Approved") return false;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    
    // If approving an amendment, deactivate previous versions in this file group
    const rootRef = item.parentFileId || item.fileRefNo;
    list.forEach((r) => {
      if ((r.fileRefNo === rootRef || r.parentFileId === rootRef) && r.id !== item.id) {
        r.isCurrentActive = false;
      }
    });

    item.status = "Approved";
    item.isCurrentActive = true;
    item.approvedBy = approverName;
    item.approvedDate = now;
    item.approvalComments = comments || "";
    item.history = [
      ...(item.history || []),
      {
        id: "pfh-" + Date.now(),
        timestamp: now,
        action: "Approved",
        userName: approverName,
        userRole: "Production Approver",
        comments: comments || (item.versionType === "Amendment" ? `Approved Amendment Version ${item.version}` : "Approved for production file release"),
      },
    ];
    this.saveProductionFiles(list);
    return true;
  }

  static rejectProductionFile(id: string, approverName: string, reason: string): boolean {
    const list = this.getProductionFiles();
    const index = list.findIndex((item) => item.id === id || item.fileRefNo === id);
    if (index === -1) return false;
    const item = list[index];
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    item.status = "Rejected";
    item.isCurrentActive = false;
    item.rejectedBy = approverName;
    item.rejectedDate = now;
    item.rejectionReason = reason;

    // If an amendment is rejected, ensure the previously approved version remains isCurrentActive = true
    if (item.versionType === "Amendment" && item.previousVersionId) {
      const prev = list.find((r) => r.id === item.previousVersionId);
      if (prev && prev.status === "Approved") {
        prev.isCurrentActive = true;
      }
    }

    item.history = [
      ...(item.history || []),
      {
        id: "pfh-" + Date.now(),
        timestamp: now,
        action: "Rejected",
        userName: approverName,
        userRole: "Production Approver",
        rejectionReason: reason,
        comments: reason,
      },
    ];
    this.saveProductionFiles(list);
    return true;
  }

  static createAmendment(baseApprovedRecordId: string, amendmentReason: string, userName: string): MMProductionFileRecord | null {
    const list = this.getProductionFiles();
    const baseRecord = list.find((item) => item.id === baseApprovedRecordId);
    if (!baseRecord || baseRecord.status !== "Approved") return null;

    // Check if there is already a pending amendment for this file
    const rootRef = baseRecord.parentFileId || baseRecord.fileRefNo;
    const hasPending = list.some(
      (r) =>
        (r.fileRefNo === rootRef || r.parentFileId === rootRef) &&
        (r.status === "Submitted" || r.status === "Draft") &&
        r.versionType === "Amendment"
    );
    if (hasPending) {
      return null;
    }

    const allRelated = list.filter((r) => r.fileRefNo === rootRef || r.parentFileId === rootRef);
    const maxVersion = Math.max(...allRelated.map((r) => r.version || 1), 1);
    const nextVersion = maxVersion + 1;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    // Deep clone attachments, keeping them marked with their original version
    const baseAttachments: ProductionFileAttachment[] = (baseRecord.attachments || []).map((att) => ({
      ...att,
      version: att.version || baseRecord.version || 1,
      isNewInAmendment: false,
    }));

    const newAmendmentRecord: MMProductionFileRecord = {
      id: `pf-rec-amd-${Date.now()}`,
      fileRefNo: rootRef,
      version: nextVersion,
      versionType: "Amendment",
      isCurrentActive: false,
      parentFileId: rootRef,
      previousVersionId: baseRecord.id,
      amendmentReason,
      sourceType: baseRecord.sourceType,
      sourceRecordId: baseRecord.sourceRecordId,
      sourceReference: baseRecord.sourceReference,
      jobNo: baseRecord.jobNo,
      preCostNo: baseRecord.preCostNo,
      styleNo: baseRecord.styleNo,
      styleDescription: baseRecord.styleDescription,
      buyerName: baseRecord.buyerName,
      season: baseRecord.season,
      poItems: [...baseRecord.poItems],
      totalPoQty: baseRecord.totalPoQty,
      attachments: baseAttachments,
      status: "Draft",
      notes: baseRecord.notes || "",
      createdBy: userName,
      createdDate: now,
      history: [
        ...(baseRecord.history || []),
        {
          id: "pfh-" + Date.now(),
          timestamp: now,
          action: "Created",
          userName,
          userRole: "Merchandiser",
          comments: `Amendment Version ${nextVersion} initialized. Reason: ${amendmentReason}`,
        },
      ],
    };

    list.unshift(newAmendmentRecord);
    this.saveProductionFiles(list);
    return newAmendmentRecord;
  }

  static getVersionHistory(fileRefNoOrId: string): MMProductionFileRecord[] {
    const list = this.getProductionFiles();
    const target = list.find((r) => r.id === fileRefNoOrId || r.fileRefNo === fileRefNoOrId);
    if (!target) return [];
    const rootRef = target.parentFileId || target.fileRefNo;
    return list
      .filter((r) => r.fileRefNo === rootRef || r.parentFileId === rootRef)
      .sort((a, b) => (b.version || 1) - (a.version || 1));
  }

  static getSourceOptionsForProductionFile(): {
    confirmOrders: Array<{
      id: string;
      jobNo: string;
      orderNo: string;
      styleNo: string;
      buyerName: string;
      season: string;
      preCostId?: string;
      totalQty: number;
      poItems: ProductionFilePOItem[];
    }>;
    preCostings: Array<{
      id: string;
      preCostNo: string;
      jobNo: string;
      styleNo: string;
      buyerName: string;
      season: string;
      totalQty: number;
      poItems: ProductionFilePOItem[];
    }>;
  } {
    const orders = this.getOrders();
    const confirmOrders = orders.map((o) => {
      const jobNo = o.jobNo || o.orderNo || `JOB-${o.id}`;
      const poItems: ProductionFilePOItem[] = [];
      if (o.poDetails && o.poDetails.length > 0) {
        o.poDetails.forEach((p, idx) => {
          poItems.push({
            id: p.id || `po-${idx + 1}`,
            po: p.poNumber || p.po || `PO-${idx + 1}`,
            poQty: Number(p.qty) || 0,
          });
        });
      } else if (o.buyerPoNumber) {
        poItems.push({
          id: `po-${o.id}`,
          po: o.buyerPoNumber,
          poQty: Number(o.orderQuantity) || 0,
        });
      }
      const totalQty = poItems.reduce((acc, curr) => acc + curr.poQty, 0) || Number(o.orderQuantity) || 0;
      return {
        id: o.id,
        jobNo,
        orderNo: o.orderNo,
        styleNo: o.styleNo || "",
        buyerName: o.buyerName || "",
        season: o.season || "",
        preCostId: o.preCostId,
        totalQty,
        poItems,
      };
    });

    const preCosts = this.getPreCostings();
    const preCostings = preCosts.map((pc) => {
      const preCostNo = pc.preCostNo || pc.preCostId || `PC-${pc.id}`;
      const poItems: ProductionFilePOItem[] = [];
      if (pc.poRows && pc.poRows.length > 0) {
        pc.poRows.forEach((r, idx) => {
          poItems.push({
            id: r.id || `pc-po-${idx + 1}`,
            po: r.poNumber || `PO-PC-${idx + 1}`,
            poQty: Number(r.poQuantity) || 0,
          });
        });
      } else if (pc.contractNo) {
        poItems.push({
          id: `pc-po-${pc.id}`,
          po: pc.contractNo,
          poQty: Number(pc.orderQuantity || pc.gmtQty || 0),
        });
      }
      const totalQty = poItems.reduce((acc, curr) => acc + curr.poQty, 0) || Number(pc.orderQuantity || pc.gmtQty || 0);
      return {
        id: pc.id,
        preCostNo,
        jobNo: pc.jobNo || "",
        styleNo: pc.styleNo || pc.style || "",
        buyerName: pc.buyerName || pc.buyer || "",
        season: pc.season || "",
        totalQty,
        poItems,
      };
    });

    return { confirmOrders, preCostings };
  }
}

export const INITIAL_MM_FABRIC_MASTER: MMFabricMasterItem[] = [
  {
    id: "fmaster-001",
    fabricCode: "FAB-001",
    fabricDescription: "100% Cotton Single Jersey 160 GSM",
    width: '68/70"',
    unit: "Kg",
    gsm: 160,
    composition: "100% Combed Cotton",
    construction: "28/1 Semi-Combed, Bio-Polished",
  },
  {
    id: "fmaster-002",
    fabricCode: "FAB-002",
    fabricDescription: "100% Cotton 2x2 Rib Fabric 220 GSM",
    width: '36/38" Tubular',
    unit: "Kg",
    gsm: 220,
    composition: "100% Combed Cotton",
    construction: "2x2 Rib, Bio-washed",
  },
  {
    id: "fmaster-003",
    fabricCode: "FAB-003",
    fabricDescription: "95% Cotton 5% Spandex 1x1 Rib 240 GSM",
    width: '40/42" Tubular',
    unit: "Kg",
    gsm: 240,
    composition: "95% Cotton 5% Spandex",
    construction: "1x1 Rib with Elastane",
  },
  {
    id: "fmaster-004",
    fabricCode: "FAB-004",
    fabricDescription: "98% Cotton 2% Spandex Stretch Twill 280 GSM",
    width: '57/58"',
    unit: "Yds",
    gsm: 280,
    composition: "98% Cotton 2% Spandex",
    construction: "16x12+70D / 108x56",
  },
  {
    id: "fmaster-005",
    fabricCode: "FAB-005",
    fabricDescription: "65/35 TC Pocketing Twill Fabric 120 GSM",
    width: '58/60"',
    unit: "Yds",
    gsm: 120,
    composition: "65% Polyester 35% Cotton",
    construction: "T/C Bleached / Solid dyed pocket bag",
  },
  {
    id: "fmaster-006",
    fabricCode: "FAB-006",
    fabricDescription: "80% Cotton 20% Polyester CVC 3-End Fleece 300 GSM",
    width: '72/74"',
    unit: "Kg",
    gsm: 300,
    composition: "80% Cotton 20% Polyester",
    construction: "20s/1 + 10s/1 Poly, Brushed Interior",
  },
  {
    id: "fmaster-007",
    fabricCode: "FAB-007",
    fabricDescription: "100% Combed Cotton Pique 220 GSM",
    width: '68/70"',
    unit: "Kg",
    gsm: 220,
    composition: "100% Combed Cotton",
    construction: "Pique Honeycomb Polo Knit",
  },
  {
    id: "fmaster-008",
    fabricCode: "FAB-008",
    fabricDescription: "100% Cotton French Terry 260 GSM",
    width: '70/72"',
    unit: "Kg",
    gsm: 260,
    composition: "100% Cotton",
    construction: "Loop Back French Terry Knit",
  },
  {
    id: "fmaster-009",
    fabricCode: "FAB-009",
    fabricDescription: "100% Cotton Interlock 200 GSM",
    width: '60/62"',
    unit: "Kg",
    gsm: 200,
    composition: "100% Combed Cotton",
    construction: "Double Knit Interlock Structure",
  },
  {
    id: "fmaster-010",
    fabricCode: "FAB-010",
    fabricDescription: "100% Cotton Poplin 110 GSM (40x40/133x72)",
    width: '56/58"',
    unit: "Yds",
    gsm: 110,
    composition: "100% Cotton",
    construction: "40s x 40s Plain Poplin",
  },
  {
    id: "fmaster-011",
    fabricCode: "FAB-011",
    fabricDescription: "100% Linen Plain Weave 150 GSM",
    width: '54/55"',
    unit: "Yds",
    gsm: 150,
    composition: "100% Pure European Flax Linen",
    construction: "Plain Breathable Weave",
  },
  {
    id: "fmaster-012",
    fabricCode: "FAB-012",
    fabricDescription: "100% Viscose Rayon Challis 120 GSM",
    width: '56/58"',
    unit: "Yds",
    gsm: 120,
    composition: "100% Viscose",
    construction: "Drape Finished Challis Weave",
  },
];

export const INITIAL_MM_SUPPLIERS_MASTER: MMSupplierMasterItem[] = [
  {
    id: "sup-001",
    supplierCode: "SUP-001",
    supplierName: "Pakiza Knitting & Dyeing",
    category: "Fabric (Knit Composite)",
    contactPerson: "Md. Tanvir Ahmed",
    phone: "+880 1711-234567",
    email: "knitdye@pakizaknit.com",
    status: "Active",
  },
  {
    id: "sup-002",
    supplierCode: "SUP-002",
    supplierName: "Ha-Meem Textile Mills",
    category: "Fabric (Woven & Denim)",
    contactPerson: "A.K. Azad",
    phone: "+880 1713-987654",
    email: "textile@hameemgroup.com",
    status: "Active",
  },
  {
    id: "sup-003",
    supplierCode: "SUP-003",
    supplierName: "Noman Weaving Mills",
    category: "Fabric (Pocketing & Twill)",
    contactPerson: "Nurul Islam",
    phone: "+880 1819-456123",
    email: "info@nomangroup.com",
    status: "Active",
  },
  {
    id: "sup-004",
    supplierCode: "SUP-004",
    supplierName: "Square Textiles Ltd.",
    category: "Fabric & Yarn Dyeing",
    contactPerson: "Tapan Kumar Ghosh",
    phone: "+880 1712-345678",
    email: "textiles@squaregroup.com",
    status: "Active",
  },
  {
    id: "sup-005",
    supplierCode: "SUP-005",
    supplierName: "Pacific Denim Mills Ltd.",
    category: "Fabric (Denim & Bottoms)",
    contactPerson: "Shafiqur Rahman",
    phone: "+880 1714-567890",
    email: "sales@pacificdenim.com",
    status: "Active",
  },
  {
    id: "sup-006",
    supplierCode: "SUP-006",
    supplierName: "Beximco Textiles Ltd.",
    category: "Fabric (Premium Woven & Knit)",
    contactPerson: "Syed Naved Husain",
    phone: "+880 1711-123456",
    email: "textiles@beximco.net",
    status: "Active",
  },
  {
    id: "sup-007",
    supplierCode: "SUP-007",
    supplierName: "Envoy Textiles Ltd.",
    category: "Fabric (Rope-Dyed Denim)",
    contactPerson: "Kutubuddin Ahmed",
    phone: "+880 1715-678901",
    email: "info@envoytextiles.com",
    status: "Active",
  },
  {
    id: "sup-008",
    supplierCode: "SUP-008",
    supplierName: "DBL Group Fabric Mills",
    category: "Fabric (Eco Knit & Mercerized)",
    contactPerson: "M. A. Jabbar",
    phone: "+880 1713-234567",
    email: "fabrics@dbl-group.com",
    status: "Active",
  },
  {
    id: "sup-009",
    supplierCode: "SUP-009",
    supplierName: "Shasha Denims Ltd.",
    category: "Fabric (Premium Sustainable Denim)",
    contactPerson: "Shams Mahmud",
    phone: "+880 1716-789012",
    email: "contact@shashadenims.com",
    status: "Active",
  },
  {
    id: "sup-010",
    supplierCode: "SUP-010",
    supplierName: "Robintex Group",
    category: "Fabric (High-end Knit & Fleece)",
    contactPerson: "Robin Razon Sakhawat",
    phone: "+880 1717-890123",
    email: "marketing@robintexbd.com",
    status: "Active",
  },
  {
    id: "sup-011",
    supplierCode: "SUP-011",
    supplierName: "Dekko Accessories Ltd",
    category: "Accessories & Buttons",
    contactPerson: "Shahadat Hossain",
    phone: "+880 1718-901234",
    email: "accessories@dekkogroup.com",
    status: "Active",
  },
  {
    id: "sup-012",
    supplierCode: "SUP-012",
    supplierName: "Avery Dennison BD",
    category: "Labels & Branding",
    contactPerson: "Rezaul Karim",
    phone: "+880 1719-012345",
    email: "bdinfo@averydennison.com",
    status: "Active",
  },
];

// ----------------------------------------------------------------------------
// Season Master Model & Seed Data
// ----------------------------------------------------------------------------
export interface MMSeasonMasterItem {
  id: string;
  seasonName: string;
  code?: string;
  status: "Active" | "Inactive";
}

export const INITIAL_MM_SEASONS_MASTER: MMSeasonMasterItem[] = [
  { id: "sea-01", seasonName: "Autumn / Winter 2026", code: "AW26", status: "Active" },
  { id: "sea-02", seasonName: "Spring / Summer 2027", code: "SS27", status: "Active" },
  { id: "sea-03", seasonName: "Summer 2026", code: "SU26", status: "Active" },
  { id: "sea-04", seasonName: "Spring 2026", code: "SP26", status: "Active" },
  { id: "sea-05", seasonName: "Fall 2026", code: "FA26", status: "Active" },
  { id: "sea-06", seasonName: "Winter 2026", code: "WI26", status: "Active" },
  { id: "sea-07", seasonName: "ANS-SS27", code: "ANS-SS27", status: "Active" },
  { id: "sea-08", seasonName: "AW25", code: "AW25", status: "Active" },
  { id: "sea-09", seasonName: "AW26MC", code: "AW26MC", status: "Active" },
];

// ----------------------------------------------------------------------------
// Accessories Master Model & Seed Data
// ----------------------------------------------------------------------------
export interface MMAccessoriesMasterItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: "Sewing Trims" | "Finishing Trims" | "Wash" | "Accessories";
  description: string;
  unit: string;
  defaultRate?: number;
}

export const INITIAL_MM_ACCESSORIES_MASTER: MMAccessoriesMasterItem[] = [
  // Sewing Trims
  {
    id: "acc-m-001",
    itemCode: "ACC-BTN-01",
    itemName: "18L 4-Hole Pearl Button (11.5mm)",
    category: "Sewing Trims",
    description: "Engraved Pearl Finish 18L Button (11.5mm) 4-Hole",
    unit: "Pcs",
    defaultRate: 0.015,
  },
  {
    id: "acc-m-002",
    itemCode: "ACC-BTN-02",
    itemName: "24L Metal Shank Button (Antique Brass)",
    category: "Sewing Trims",
    description: "Embossed antique brass jeans shank button",
    unit: "Pcs",
    defaultRate: 0.035,
  },
  {
    id: "acc-m-003",
    itemCode: "ACC-BTN-03",
    itemName: "20L Horn Finish Button",
    category: "Sewing Trims",
    description: "Horn finish 20L 4-hole tailored button",
    unit: "Pcs",
    defaultRate: 0.022,
  },
  {
    id: "acc-m-004",
    itemCode: "ACC-THD-01",
    itemName: "Astra 40/2 Spun Poly Sewing Thread",
    category: "Sewing Trims",
    description: "Astra 40/2 high tenacity 5000M spool sewing thread",
    unit: "Cone",
    defaultRate: 1.85,
  },
  {
    id: "acc-m-005",
    itemCode: "TRM-THR-01",
    itemName: "Poly Core Spun 50/2 Sewing Thread",
    category: "Sewing Trims",
    description: "High strength poly-core spun thread for overlock & seam",
    unit: "Cone",
    defaultRate: 2.10,
  },
  {
    id: "acc-m-006",
    itemCode: "ACC-ZIP-01",
    itemName: "#5 Brass Metal Zipper Closed End 18cm",
    category: "Sewing Trims",
    description: "YKK type #5 antique brass metal teeth zipper",
    unit: "Pcs",
    defaultRate: 0.28,
  },
  {
    id: "acc-m-007",
    itemCode: "ACC-ELAS-01",
    itemName: "Woven Elastic Tape 1.5 Inch",
    category: "Sewing Trims",
    description: "High recovery polyester/latex woven elastic webbing",
    unit: "Yds",
    defaultRate: 0.18,
  },
  {
    id: "acc-m-008",
    itemCode: "ACC-TWL-01",
    itemName: "Cotton Twill Tape 10mm Herringbone",
    category: "Sewing Trims",
    description: "100% natural cotton herringbone twill binding tape",
    unit: "Yds",
    defaultRate: 0.08,
  },
  {
    id: "acc-m-009",
    itemCode: "ACC-INT-01",
    itemName: "Fusible Interlining 100% Microdot",
    category: "Sewing Trims",
    description: "Woven PES coating collar and placket fusible interlining",
    unit: "Yds",
    defaultRate: 0.45,
  },

  // Finishing Trims
  {
    id: "acc-m-010",
    itemCode: "ACC-LBL-01",
    itemName: "Center Fold Woven Main Label (25x55mm)",
    category: "Finishing Trims",
    description: "High definition damask woven brand neck label",
    unit: "Pcs",
    defaultRate: 0.045,
  },
  {
    id: "acc-m-011",
    itemCode: "ACC-LBL-02",
    itemName: "Satin Care & Composition Label with Barcode",
    category: "Finishing Trims",
    description: "Thermal transfer printed soft satin wash care label",
    unit: "Pcs",
    defaultRate: 0.025,
  },
  {
    id: "acc-m-012",
    itemCode: "ACC-LBL-03",
    itemName: "Heat Transfer Neck Label (Tagless)",
    category: "Finishing Trims",
    description: "Eco-friendly screen printed tagless transfer label",
    unit: "Pcs",
    defaultRate: 0.038,
  },
  {
    id: "acc-m-013",
    itemCode: "ACC-TAG-01",
    itemName: "FSC Certified Recycled Hang Tag",
    category: "Finishing Trims",
    description: "350 GSM craft paper hangtag with wax cotton string & seal",
    unit: "Pcs",
    defaultRate: 0.065,
  },
  {
    id: "acc-m-014",
    itemCode: "ACC-PAC-01",
    itemName: "Self-Adhesive Poly Bag 12x18 inch (0.05mm)",
    category: "Finishing Trims",
    description: "Recycled LDPE transparent garment poly bag with warning text",
    unit: "Pcs",
    defaultRate: 0.042,
  },
  {
    id: "acc-m-015",
    itemCode: "ACC-CTN-01",
    itemName: "7-Ply Master Corrugated Shipping Carton",
    category: "Finishing Trims",
    description: "Heavy duty export master shipping carton (60x40x35 cm)",
    unit: "Pcs",
    defaultRate: 1.65,
  },
  {
    id: "acc-m-016",
    itemCode: "ACC-SIL-01",
    itemName: "Silica Gel Desiccant Packet 2g",
    category: "Finishing Trims",
    description: "Non-toxic moisture absorber packet for export carton",
    unit: "Pcs",
    defaultRate: 0.012,
  },

  // Wash Treatments
  {
    id: "acc-m-017",
    itemCode: "WSH-ENZ-01",
    itemName: "Enzyme Silicon Bio-Wash Treatment",
    category: "Wash",
    description: "Cellulase bio-polishing wash with silicone softener handle",
    unit: "Pcs",
    defaultRate: 0.15,
  },
  {
    id: "acc-m-018",
    itemCode: "WSH-CHINO-01",
    itemName: "Garment Enzyme Wash with Softener",
    category: "Wash",
    description: "Neutral enzyme stone-less wash for casual twills & chinos",
    unit: "Pcs",
    defaultRate: 0.22,
  },
  {
    id: "acc-m-019",
    itemCode: "WSH-ACID-01",
    itemName: "Acid Wash & Vintage Tinting Treatment",
    category: "Wash",
    description: "Permanganate spray vintage contrast marble wash",
    unit: "Pcs",
    defaultRate: 0.35,
  },
  {
    id: "acc-m-020",
    itemCode: "WSH-BLEACH-01",
    itemName: "Light Bleach with Neutralizer Wash",
    category: "Wash",
    description: "Controlled hypochlorite bleach with anti-chlor neutralization",
    unit: "Pcs",
    defaultRate: 0.18,
  },
];

// ----------------------------------------------------------------------------
// Pre Costing Attachments Model & Seed Data
// ----------------------------------------------------------------------------
export interface MMPreCostAttachmentRecord {
  id: string;
  preCostId: string;
  version: number;
  fileName: string;
  title: string;
  documentType?: string;
  note: string;
  fileSize: string;
  fileSizeBytes: number;
  uploadedBy: string;
  uploadTime: string;
  storageType: "file" | "image";
  dataUrl?: string;
}

export const INITIAL_MM_PRE_COST_ATTACHMENTS: MMPreCostAttachmentRecord[] = [
  {
    id: "pca-001",
    preCostId: "PC-2026-001",
    version: 1,
    fileName: "HM_KT_8841_TechPack_v2.pdf",
    title: "Buyer Approved Style Tech Pack v2",
    documentType: "Technical Spec Sheet",
    note: "Specification sheet with measurement specs and seam tolerances",
    fileSize: "2.4 MB",
    fileSizeBytes: 2516582,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-09-15 11:20",
    storageType: "file",
  },
  {
    id: "pca-002",
    preCostId: "PC-2026-001",
    version: 1,
    fileName: "Henley_Front_Back_CAD_Sketch.png",
    title: "Henley Neckline CAD & Flat Sketch",
    documentType: "Technical Spec Sheet",
    note: "Front 3-button placket detail and ribbed neckline construction",
    fileSize: "1.1 MB",
    fileSizeBytes: 1153433,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-09-15 11:35",
    storageType: "image",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f1f5f9'/><path d='M140,80 Q200,120 260,80 L310,130 L270,160 L260,260 L140,260 L130,160 L90,130 Z' fill='%23cbd5e1' stroke='%23475569' stroke-width='3'/><path d='M180,95 L180,160 L220,160 L220,95' fill='%23ffffff' stroke='%23475569' stroke-width='2'/><circle cx='200' cy='110' r='3' fill='%23334155'/><circle cx='200' cy='130' r='3' fill='%23334155'/><circle cx='200' cy='150' r='3' fill='%23334155'/><text x='200' y='285' font-family='sans-serif' font-size='12' font-weight='bold' text-anchor='middle' fill='%23475569'>Henley T-Shirt Flat CAD</text></svg>",
  },
  {
    id: "pca-003",
    preCostId: "PC-2026-001",
    version: 1,
    fileName: "Verdant_Green_Rib_Swatch_Scan.jpg",
    title: "Fabric Swatch — Verdant Green Rib",
    documentType: "Lab Dip Approval",
    note: "Approved shade matching Pantone 18-5616 TCX under D65 / TL84",
    fileSize: "890 KB",
    fileSizeBytes: 911360,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-09-15 11:45",
    storageType: "image",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2322543d'/><pattern id='rib' width='10' height='10' patternUnits='userSpaceOnUse'><line x1='0' y1='0' x2='0' y2='10' stroke='%23276749' stroke-width='4'/></pattern><rect width='400' height='300' fill='url(%23rib)'/><rect x='30' y='210' width='340' height='60' rx='8' fill='%23ffffff' opacity='0.9'/><text x='200' y='235' font-family='sans-serif' font-size='13' font-weight='bold' text-anchor='middle' fill='%231a202c'>2x2 Rib Swatch — Verdant Green</text><text x='200' y='255' font-family='sans-serif' font-size='11' text-anchor='middle' fill='%234a5568'>100% Cotton Bio-Washed 220 GSM</text></svg>",
  },
];

// ============================================================================
// Fabric Consumption (CAD) Workflow Models & Seed Data
// Based on APEROL-BASEBALL-JACKET.xltx Approved Structure
// ============================================================================

export type MMCadCalculationMode = "Auto" | "Manual";
export type MMCadDiaMake = "OPEN" | "TUBE";
export type MMCadRequestStatus = "Draft" | "Pending CAD" | "In Progress" | "CAD Submitted" | "Closed";
export type MMCadResponseStatus = "Not Received" | "In Progress" | "Received";

export interface MMCadItemRow {
  id: string;
  sl: number;
  bodyPart: string;
  markerLength: number;
  diaFinish: number;
  diaCut: number; // Formula: diaFinish - cuttableFinish
  markerQty: number;
  fabricGsm: number;
  calculationMode: MMCadCalculationMode; // "Auto" | "Manual" (Default: "Auto")
  finishKgConsumption: number; // Auto: (markerLength * diaFinish * fabricGsm / law / markerQty) * condumption
  waste10Consumption: number; // Formula: finishKgConsumption * 1.1
  diaMake: MMCadDiaMake; // "OPEN" | "TUBE"
  law: number; // Default: 1550
  condumption: number; // 12 for DZ, 1 for PCS (Default: 12)
  cuttableFinish: number; // Default: 2
  consumptionRatio: number; // Formula: row finishKgConsumption / totalFinishKg * 100
  remarks?: string;
}

export interface MMFabricConsumptionAttachment {
  id: string;
  requestId: string;
  fileName: string;
  title: string;
  documentType?: string;
  note?: string;
  fileSize: string;
  fileSizeBytes?: number;
  uploadedBy: string;
  uploadedRole?: "Merchant" | "CAD";
  uploadTime: string;
  storageType?: "file" | "image";
  dataUrl?: string;
}

export interface MMFabricConsumptionCadRecord {
  id: string;
  requestNo: string;
  requestDate: string;
  jobId: string;
  buyer: string;
  styleOrder: string;
  efficiency: string;
  sizeRange: string;
  fabrication: string;
  season?: string;
  merchandiser: string;
  requestRemarks?: string;
  submittedDate?: string;

  // CAD Response
  cadAssignedTo?: string;
  cadResponseDate?: string;
  cadSubmittedBy?: string;
  cadSubmissionTimestamp?: string;
  status: MMCadRequestStatus;
  cadResponseStatus: MMCadResponseStatus;

  // Detailed CAD calculation data
  rows: MMCadItemRow[];
  totalFinishKg: number;
  totalWaste10Kg: number;
  wash10Pct: number; // SUM(Waste+10% Consumption)
  notes?: string;
  comments?: string;

  // Attached documents from Merchant and CAD teams
  attachments?: MMFabricConsumptionAttachment[];

  history?: Array<{
    timestamp: string;
    user: string;
    action: string;
    status: string;
    notes?: string;
  }>;
}

export const DEFAULT_CAD_BODY_PARTS: string[] = [
  "BODY+PKT+BON+FNL+FAC",
  "SLEEVE",
  "UPPER POCKET S/J",
  "BOTTOM RIB",
  "CUFF RIB",
  "NECK RIB",
  "BACK TAPE S/J",
];

// Helper to recalculate a single CAD row
export function calculateCadRow(
  row: Partial<MMCadItemRow>,
  totalFinishKg: number = 0
): MMCadItemRow {
  const markerLength = Number(row.markerLength) || 0;
  const diaFinish = Number(row.diaFinish) || 0;
  const cuttableFinish = row.cuttableFinish !== undefined ? Number(row.cuttableFinish) : 2;
  const diaCut = Number((diaFinish - cuttableFinish).toFixed(2));
  const markerQty = Number(row.markerQty) || 1;
  const fabricGsm = Number(row.fabricGsm) || 0;
  const law = Number(row.law) || 1550;

  // Condumption: 12 for DZ, 1 for PCS (Default: 12)
  let condumption = 12;
  if (row.condumption !== undefined) {
    if (typeof row.condumption === "string") {
      condumption = (row.condumption as string).toUpperCase().includes("PCS") || row.condumption === "1" ? 1 : 12;
    } else {
      condumption = Number(row.condumption) === 1 ? 1 : 12;
    }
  }

  const calculationMode = row.calculationMode || "Auto";

  let finishKgConsumption = 0;
  let waste10Consumption = 0;

  if (calculationMode === "Auto") {
    if (law > 0 && markerQty > 0) {
      finishKgConsumption = Number(
        (((markerLength * diaFinish * fabricGsm) / law / markerQty) * condumption).toFixed(3)
      );
    }
    waste10Consumption = Number((finishKgConsumption * 1.1).toFixed(3));
  } else {
    // In Manual mode, CAD users can manually specify both finishKgConsumption and waste10Consumption
    finishKgConsumption = Number(Number(row.finishKgConsumption || 0).toFixed(3));
    waste10Consumption =
      row.waste10Consumption !== undefined && row.waste10Consumption !== null
        ? Number(Number(row.waste10Consumption).toFixed(3))
        : Number((finishKgConsumption * 1.1).toFixed(3));
  }

  const consumptionRatio =
    totalFinishKg > 0 ? Number(((finishKgConsumption / totalFinishKg) * 100).toFixed(2)) : 0;

  return {
    id: row.id || `cad-row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    sl: row.sl || 1,
    bodyPart: row.bodyPart || "BODY",
    markerLength,
    diaFinish,
    diaCut,
    markerQty,
    fabricGsm,
    calculationMode,
    finishKgConsumption,
    waste10Consumption,
    diaMake: row.diaMake || "OPEN",
    law,
    condumption,
    cuttableFinish,
    consumptionRatio,
    remarks: row.remarks || "",
  };
}

// Helper to recalculate all CAD rows and summary totals
export function calculateCadTable(rows: MMCadItemRow[]): {
  rows: MMCadItemRow[];
  totalFinishKg: number;
  totalWaste10Kg: number;
  wash10Pct: number;
} {
  // Pass 1: calculate values without ratio
  const intermediate = rows.map((r, idx) =>
    calculateCadRow({ ...r, sl: idx + 1 }, 0)
  );

  const totalFinishKg = Number(
    intermediate.reduce((acc, r) => acc + (Number(r.finishKgConsumption) || 0), 0).toFixed(3)
  );
  const totalWaste10Kg = Number(
    intermediate.reduce((acc, r) => acc + (Number(r.waste10Consumption) || 0), 0).toFixed(3)
  );
  const wash10Pct = totalWaste10Kg; // Per workbook: WASH 10% = SUM(all applicable Waste+10% rows)

  // Pass 2: calculate ratios
  const finalRows = intermediate.map((r) => ({
    ...r,
    consumptionRatio:
      totalFinishKg > 0
        ? Number(((r.finishKgConsumption / totalFinishKg) * 100).toFixed(2))
        : 0,
  }));

  return {
    rows: finalRows,
    totalFinishKg,
    totalWaste10Kg,
    wash10Pct,
  };
}

// 7 Default Rows from APEROL-BASEBALL-JACKET.xltx
export const INITIAL_APEROL_CAD_ROWS: MMCadItemRow[] = [
  {
    id: "cad-r-01",
    sl: 1,
    bodyPart: "BODY+PKT+BON+FNL+FAC",
    markerLength: 227.0,
    diaFinish: 72.0,
    diaCut: 70.0,
    markerQty: 9,
    fabricGsm: 370,
    calculationMode: "Auto",
    finishKgConsumption: 5201.961,
    waste10Consumption: 5722.157,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 54.75,
  },
  {
    id: "cad-r-02",
    sl: 2,
    bodyPart: "SLEEVE",
    markerLength: 120.0,
    diaFinish: 72.0,
    diaCut: 70.0,
    markerQty: 9,
    fabricGsm: 370,
    calculationMode: "Auto",
    finishKgConsumption: 2749.935,
    waste10Consumption: 3024.929,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 28.94,
  },
  {
    id: "cad-r-03",
    sl: 3,
    bodyPart: "UPPER POCKET S/J",
    markerLength: 42.0,
    diaFinish: 72.0,
    diaCut: 70.0,
    markerQty: 18,
    fabricGsm: 160,
    calculationMode: "Auto",
    finishKgConsumption: 208.103,
    waste10Consumption: 228.914,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 2.19,
  },
  {
    id: "cad-r-04",
    sl: 4,
    bodyPart: "BOTTOM RIB",
    markerLength: 7.5,
    diaFinish: 44.0,
    diaCut: 42.0,
    markerQty: 1,
    fabricGsm: 350,
    calculationMode: "Auto",
    finishKgConsumption: 894.194,
    waste10Consumption: 983.613,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 9.41,
  },
  {
    id: "cad-r-05",
    sl: 5,
    bodyPart: "CUFF RIB",
    markerLength: 7.5,
    diaFinish: 44.0,
    diaCut: 42.0,
    markerQty: 2,
    fabricGsm: 350,
    calculationMode: "Auto",
    finishKgConsumption: 447.097,
    waste10Consumption: 491.806,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 4.71,
  },
  {
    id: "cad-r-06",
    sl: 6,
    bodyPart: "NECK RIB",
    markerLength: 5.5,
    diaFinish: 44.0,
    diaCut: 42.0,
    markerQty: 2,
    fabricGsm: 700,
    calculationMode: "Manual",
    finishKgConsumption: 0.642,
    waste10Consumption: 0.707,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 0.01,
  },
  {
    id: "cad-r-07",
    sl: 7,
    bodyPart: "BACK TAPE S/J",
    markerLength: 0.0,
    diaFinish: 72.0,
    diaCut: 70.0,
    markerQty: 12,
    fabricGsm: 160,
    calculationMode: "Manual",
    finishKgConsumption: 0.04,
    waste10Consumption: 0.044,
    diaMake: "OPEN",
    law: 1550,
    condumption: 12,
    cuttableFinish: 2,
    consumptionRatio: 0.0,
  },
];

export const INITIAL_MM_FABRIC_CONSUMPTION_CAD: MMFabricConsumptionCadRecord[] = [
  // Record 1: The exact APEROL-BASEBALL-JACKET workbook calculation
  {
    id: "fcad-rec-001",
    requestNo: "FCAD-2026-0001",
    requestDate: "2026-10-24",
    jobId: "JOB-2026-0081",
    buyer: "MARLIN MEDIA",
    styleOrder: "APEROL-BASEBALL-JACKET",
    efficiency: "85%",
    sizeRange: "S TO L",
    fabrication: "BODY+SLV 370 GSM",
    season: "Autumn / Winter 2026",
    merchandiser: "Tanvir Ahmed (Merchandiser)",
    requestRemarks: "Please calculate marker consumption for baseball jacket body, sleeves, rib trims, and pocketing.",
    submittedDate: "2026-10-24 14:30",
    cadAssignedTo: "Kazi Mofizul (CAD In-Charge)",
    cadResponseDate: "2026-10-25 11:15",
    cadSubmittedBy: "Kazi Mofizul (CAD In-Charge)",
    cadSubmissionTimestamp: "2026-10-25 11:15",
    status: "CAD Submitted",
    cadResponseStatus: "Received",
    rows: INITIAL_APEROL_CAD_ROWS,
    totalFinishKg: 9501.972,
    totalWaste10Kg: 10452.17,
    wash10Pct: 10452.17,
    notes: "..",
    comments: "ONE BODY ONE WAY CUTTING.",
    attachments: [
      {
        id: "att-fcad-001",
        requestId: "fcad-rec-001",
        fileName: "APEROL_Baseball_Jacket_Tech_Pack.pdf",
        title: "Tech Pack & Measurement Specs",
        documentType: "Buyer Tech Pack",
        note: "Initial tech pack from Marlin Media with garment construction details",
        fileSize: "1.2 MB",
        fileSizeBytes: 1258291,
        uploadedBy: "Tanvir Ahmed (Merchandiser)",
        uploadedRole: "Merchant",
        uploadTime: "2026-10-24 10:20",
        storageType: "file",
      },
      {
        id: "att-fcad-002",
        requestId: "fcad-rec-001",
        fileName: "CAD_Marker_Estimation_Layout_Aperol.pdf",
        title: "CAD Marker Nesting & Shrinkage Report",
        documentType: "CAD Marker Report",
        note: "Generated 7-body part marker with 85% marker efficiency",
        fileSize: "845 KB",
        fileSizeBytes: 865280,
        uploadedBy: "Kazi Mofizul (CAD In-Charge)",
        uploadedRole: "CAD",
        uploadTime: "2026-10-25 11:10",
        storageType: "file",
      },
    ],
    history: [
      {
        timestamp: "2026-10-24 10:15",
        user: "Tanvir Ahmed (Merchandiser)",
        action: "Request Created",
        status: "Draft",
        notes: "Created initial fabric consumption request for APEROL-BASEBALL-JACKET",
      },
      {
        timestamp: "2026-10-24 14:30",
        user: "Tanvir Ahmed (Merchandiser)",
        action: "Submitted to CAD",
        status: "Pending CAD",
        notes: "Request submitted to CAD queue with fabric specs",
      },
      {
        timestamp: "2026-10-25 09:00",
        user: "Kazi Mofizul (CAD In-Charge)",
        action: "CAD Processing Started",
        status: "In Progress",
        notes: "Marker nesting and body part breakdown drafted",
      },
      {
        timestamp: "2026-10-25 11:15",
        user: "Kazi Mofizul (CAD In-Charge)",
        action: "CAD Response Submitted",
        status: "CAD Submitted",
        notes: "Calculated with 7 body-parts, ONE BODY ONE WAY CUTTING. Consumption Received by Merchant.",
      },
    ],
  },
  // Record 2: Pending CAD response
  {
    id: "fcad-rec-002",
    requestNo: "FCAD-2026-0002",
    requestDate: "2026-10-26",
    jobId: "JOB-2026-0042",
    buyer: "H&M Hennes & Mauritz",
    styleOrder: "HM-KT-8841",
    efficiency: "80%",
    sizeRange: "XS TO XXL",
    fabrication: "100% Cotton 1x1 Rib 210 GSM",
    season: "Autumn / Winter 2026",
    merchandiser: "Tanvir Ahmed (Merchandiser)",
    requestRemarks: "Ladies Ribbed Henley Neck T-Shirt. Check neckband and placket consumption.",
    submittedDate: "2026-10-26 09:45",
    cadAssignedTo: "Nasir Uddin (CAD Specialist)",
    status: "Pending CAD",
    cadResponseStatus: "Not Received",
    rows: [],
    totalFinishKg: 0,
    totalWaste10Kg: 0,
    wash10Pct: 0,
    notes: "",
    comments: "",
    history: [
      {
        timestamp: "2026-10-26 09:45",
        user: "Tanvir Ahmed (Merchandiser)",
        action: "Submitted to CAD",
        status: "Pending CAD",
        notes: "Submitted to CAD department for marker planning",
      },
    ],
  },
  // Record 3: In Progress (CAD draft saved, awaiting final submission)
  {
    id: "fcad-rec-003",
    requestNo: "FCAD-2026-0003",
    requestDate: "2026-10-25",
    jobId: "JOB-2026-0055",
    buyer: "Zara (Inditex)",
    styleOrder: "ZR-WV-4019",
    efficiency: "82%",
    sizeRange: "30 TO 38",
    fabrication: "98% Cotton 2% Spandex Twill 280 GSM",
    season: "Summer 2026",
    merchandiser: "Nafis Imtiaz (Senior Merchandiser)",
    requestRemarks: "Men Slim Fit Cotton Twill Chino Trouser. Calculate pocket bags and waistband separately.",
    submittedDate: "2026-10-25 16:10",
    cadAssignedTo: "Kazi Mofizul (CAD In-Charge)",
    status: "In Progress",
    cadResponseStatus: "In Progress",
    rows: [
      {
        id: "cad-r-03-01",
        sl: 1,
        bodyPart: "BODY TROUSER PANELS",
        markerLength: 180.0,
        diaFinish: 58.0,
        diaCut: 56.0,
        markerQty: 6,
        fabricGsm: 280,
        calculationMode: "Auto",
        finishKgConsumption: 2603.871,
        waste10Consumption: 2864.258,
        diaMake: "OPEN",
        law: 1550,
        condumption: 12,
        cuttableFinish: 2,
        consumptionRatio: 86.84,
      },
      {
        id: "cad-r-03-02",
        sl: 2,
        bodyPart: "WAISTBAND",
        markerLength: 22.0,
        diaFinish: 58.0,
        diaCut: 56.0,
        markerQty: 6,
        fabricGsm: 280,
        calculationMode: "Auto",
        finishKgConsumption: 318.251,
        waste10Consumption: 350.076,
        diaMake: "OPEN",
        law: 1550,
        condumption: 12,
        cuttableFinish: 2,
        consumptionRatio: 10.61,
      },
      {
        id: "cad-r-03-03",
        sl: 3,
        bodyPart: "BELT LOOPS",
        markerLength: 5.3,
        diaFinish: 58.0,
        diaCut: 56.0,
        markerQty: 6,
        fabricGsm: 280,
        calculationMode: "Auto",
        finishKgConsumption: 76.671,
        waste10Consumption: 84.338,
        diaMake: "OPEN",
        law: 1550,
        condumption: 12,
        cuttableFinish: 2,
        consumptionRatio: 2.56,
      },
    ],
    totalFinishKg: 2998.793,
    totalWaste10Kg: 3298.672,
    wash10Pct: 3298.672,
    notes: "CAD draft in progress. Awaiting shrinkage test confirmation from wash lab.",
    comments: "Marker width 56 inch cuttable.",
    history: [
      {
        timestamp: "2026-10-25 16:10",
        user: "Nafis Imtiaz (Senior Merchandiser)",
        action: "Submitted to CAD",
        status: "Pending CAD",
      },
      {
        timestamp: "2026-10-26 11:30",
        user: "Kazi Mofizul (CAD In-Charge)",
        action: "CAD Draft Saved",
        status: "In Progress",
        notes: "Preliminary calculations saved as draft (Merchant sees In Progress, Not Received)",
      },
    ],
  },
  // Record 4: Merchant Draft (Not yet submitted to CAD)
  {
    id: "fcad-rec-004",
    requestNo: "FCAD-2026-0004",
    requestDate: "2026-10-26",
    jobId: "JOB-2026-0063",
    buyer: "Marks & Spencer",
    styleOrder: "MS-KT-108",
    efficiency: "85%",
    sizeRange: "S TO XL",
    fabrication: "Single Jersey 180 GSM",
    season: "Spring / Summer 2027",
    merchandiser: "Tanvir Ahmed (Merchandiser)",
    requestRemarks: "Draft request for basic crewneck t-shirt.",
    status: "Draft",
    cadResponseStatus: "Not Received",
    rows: [],
    totalFinishKg: 0,
    totalWaste10Kg: 0,
    wash10Pct: 0,
    notes: "",
    comments: "",
    history: [
      {
        timestamp: "2026-10-26 14:00",
        user: "Tanvir Ahmed (Merchandiser)",
        action: "Draft Created",
        status: "Draft",
      },
    ],
  },
];

// ============================================================================
// Initial MM Production Files (4 Realistic Seed Records)
// ============================================================================
export const INITIAL_MM_PRODUCTION_FILES: MMProductionFileRecord[] = [
  {
    id: "pf-rec-001",
    fileRefNo: "PF-2026-0001",
    version: 1,
    versionType: "Original",
    isCurrentActive: true,
    sourceType: "Confirm Order Entry",
    sourceRecordId: "ord-001",
    sourceReference: "JOB-2026-0001",
    jobNo: "JOB-2026-0001",
    preCostNo: "PC-2026-001",
    styleNo: "HM-KT-8841",
    styleDescription: "Henley T-Shirt - Ladies Casual & Tops",
    buyerName: "H&M Hennes & Mauritz",
    season: "Autumn / Winter 2026",
    poItems: [
      { id: "po-pf-001-1", po: "PO-HM-99881-A", poQty: 25000 },
      { id: "po-pf-001-2", po: "PO-HM-99881-B", poQty: 20000 },
    ],
    totalPoQty: 45000,
    attachments: [
      {
        id: "att-001-1",
        category: "BOM Sheet",
        fileName: "BOM_HM_8841_Final_Approved.pdf",
        fileSize: "1.8 MB",
        fileType: "pdf",
        uploadDate: "2026-10-20 09:40",
        version: 1,
      },
      {
        id: "att-001-2",
        category: "Trims Layout",
        fileName: "Trims_Layout_Card_HM8841.pdf",
        fileSize: "2.4 MB",
        fileType: "pdf",
        uploadDate: "2026-10-20 09:45",
        version: 1,
      },
      {
        id: "att-001-3",
        category: "CAD Marker",
        fileName: "CAD_Marker_Efficiency_86pct_HM8841.xlsx",
        fileSize: "850 KB",
        fileType: "xlsx",
        uploadDate: "2026-10-20 10:00",
        version: 1,
      },
      {
        id: "att-001-4",
        category: "PO Sheet",
        fileName: "Buyer_Official_PO_HM99881.pdf",
        fileSize: "1.2 MB",
        fileType: "pdf",
        uploadDate: "2026-10-20 10:15",
        version: 1,
      },
      {
        id: "att-001-5",
        category: "Sample Comments / TechPack / Measurement Sheet",
        fileName: "TechPack_HM_AW26_Final_Signoff.pdf",
        fileSize: "5.2 MB",
        fileType: "pdf",
        uploadDate: "2026-10-20 10:20",
        version: 1,
      },
      {
        id: "att-001-6",
        category: "Embellishment",
        fileName: "Chest_Placement_Print_Artwork.pdf",
        fileSize: "980 KB",
        fileType: "pdf",
        uploadDate: "2026-10-20 10:30",
        version: 1,
      },
      {
        id: "att-001-7",
        category: "Others",
        fileName: "Fabric_Inspection_GradeA_Certificate.pdf",
        fileSize: "750 KB",
        fileType: "pdf",
        uploadDate: "2026-10-20 10:35",
        version: 1,
      },
    ],
    status: "Approved",
    notes: "Production file complete with all 7 signed documents. Marker released to cutting floor Unit-2.",
    createdBy: "Tanvir Ahmed (Merchandiser)",
    createdDate: "2026-10-20 09:30",
    submittedBy: "Tanvir Ahmed (Merchandiser)",
    submittedDate: "2026-10-21 11:15",
    approvedBy: "Rafiqul Islam (Production GM)",
    approvedDate: "2026-10-22 14:00",
    approvalComments: "Approved for bulk fabric cutting and marker release. Check needle detector calibration before pack.",
    history: [
      {
        id: "pfh-001-1",
        timestamp: "2026-10-20 09:30",
        action: "Created",
        userName: "Tanvir Ahmed (Merchandiser)",
        userRole: "Merchandiser",
        comments: "Initial draft created from Confirm Order Entry JOB-2026-0001",
      },
      {
        id: "pfh-001-2",
        timestamp: "2026-10-21 11:15",
        action: "Submitted",
        userName: "Tanvir Ahmed (Merchandiser)",
        userRole: "Merchandiser",
        comments: "All 7 attachments verified and submitted for production approval",
      },
      {
        id: "pfh-001-3",
        timestamp: "2026-10-22 14:00",
        action: "Approved",
        userName: "Rafiqul Islam (Production GM)",
        userRole: "Production Approver",
        comments: "Approved for bulk fabric cutting and marker release.",
      },
    ],
  },
  {
    id: "pf-rec-002",
    fileRefNo: "PF-2026-0002",
    version: 1,
    versionType: "Original",
    isCurrentActive: true,
    sourceType: "Pre Costing",
    sourceRecordId: "pc-002",
    sourceReference: "PC-2026-002",
    jobNo: "JOB-2026-0002",
    preCostNo: "PC-2026-002",
    styleNo: "ZARA-TR-204",
    styleDescription: "Casual Chino Pant - Men's Bottoms",
    buyerName: "Inditex (Zara)",
    season: "Autumn / Winter 2026",
    poItems: [
      { id: "po-pf-002-1", po: "PO-ZR-4401-1", poQty: 18000 },
      { id: "po-pf-002-2", po: "PO-ZR-4401-2", poQty: 14000 },
    ],
    totalPoQty: 32000,
    attachments: [
      {
        id: "att-002-1",
        category: "BOM Sheet",
        fileName: "Zara_TR204_BOM_Approved.pdf",
        fileSize: "2.1 MB",
        fileType: "pdf",
        uploadDate: "2026-10-25 10:15",
        version: 1,
      },
      {
        id: "att-002-2",
        category: "CAD Marker",
        fileName: "Zara_Marker_Width58_Ratio.xlsx",
        fileSize: "1.1 MB",
        fileType: "xlsx",
        uploadDate: "2026-10-25 10:30",
        version: 1,
      },
      {
        id: "att-002-3",
        category: "PO Sheet",
        fileName: "Inditex_Official_PO4401.pdf",
        fileSize: "1.5 MB",
        fileType: "pdf",
        uploadDate: "2026-10-25 10:45",
        version: 1,
      },
      {
        id: "att-002-4",
        category: "Sample Comments / TechPack / Measurement Sheet",
        fileName: "Zara_Fit_Comments_Rev2.pdf",
        fileSize: "3.4 MB",
        fileType: "pdf",
        uploadDate: "2026-10-25 11:00",
        version: 1,
      },
    ],
    status: "Submitted",
    notes: "Awaiting Production GM approval. Fabric received at warehouse.",
    createdBy: "Nafis Imtiaz (Senior Merchandiser)",
    createdDate: "2026-10-25 10:00",
    submittedBy: "Nafis Imtiaz (Senior Merchandiser)",
    submittedDate: "2026-10-25 16:45",
    history: [
      {
        id: "pfh-002-1",
        timestamp: "2026-10-25 10:00",
        action: "Created",
        userName: "Nafis Imtiaz (Senior Merchandiser)",
        userRole: "Merchandiser",
        comments: "File initialized from Pre Costing PC-2026-002",
      },
      {
        id: "pfh-002-2",
        timestamp: "2026-10-25 16:45",
        action: "Submitted",
        userName: "Nafis Imtiaz (Senior Merchandiser)",
        userRole: "Merchandiser",
        comments: "Submitted for approval queue review",
      },
    ],
  },
  {
    id: "pf-rec-003",
    fileRefNo: "PF-2026-0003",
    version: 1,
    versionType: "Original",
    isCurrentActive: false,
    sourceType: "Confirm Order Entry",
    sourceRecordId: "ord-003",
    sourceReference: "JOB-2026-0003",
    jobNo: "JOB-2026-0003",
    preCostNo: "PC-2026-003",
    styleNo: "NK-SP-501",
    styleDescription: "Sports Hooded Jacket - Athletic Outerwear",
    buyerName: "Next Sourcing",
    season: "Autumn / Winter 2026",
    poItems: [
      { id: "po-pf-003-1", po: "PO-NX-78901", poQty: 28000 },
    ],
    totalPoQty: 28000,
    attachments: [
      {
        id: "att-003-1",
        category: "BOM Sheet",
        fileName: "Next_NK501_BOM_v1.pdf",
        fileSize: "1.5 MB",
        fileType: "pdf",
        uploadDate: "2026-10-23 11:10",
        version: 1,
      },
      {
        id: "att-003-2",
        category: "CAD Marker",
        fileName: "CAD_Marker_54in_Draft.xlsx",
        fileSize: "900 KB",
        fileType: "xlsx",
        uploadDate: "2026-10-23 11:20",
        version: 1,
      },
    ],
    status: "Rejected",
    notes: "Rejected due to missing trims layout and marker width mismatch. Requires revision before re-submission.",
    createdBy: "Tanvir Ahmed (Merchandiser)",
    createdDate: "2026-10-23 11:00",
    submittedBy: "Tanvir Ahmed (Merchandiser)",
    submittedDate: "2026-10-23 15:30",
    rejectedBy: "Rafiqul Islam (Production GM)",
    rejectedDate: "2026-10-24 10:20",
    rejectionReason: "Trims layout and Embellishment artwork sheets are missing. CAD marker width does not match fabric cuttable width 56 inch. Please correct and re-submit.",
    history: [
      {
        id: "pfh-003-1",
        timestamp: "2026-10-23 11:00",
        action: "Created",
        userName: "Tanvir Ahmed (Merchandiser)",
        userRole: "Merchandiser",
      },
      {
        id: "pfh-003-2",
        timestamp: "2026-10-23 15:30",
        action: "Submitted",
        userName: "Tanvir Ahmed (Merchandiser)",
        userRole: "Merchandiser",
      },
      {
        id: "pfh-003-3",
        timestamp: "2026-10-24 10:20",
        action: "Rejected",
        userName: "Rafiqul Islam (Production GM)",
        userRole: "Production Approver",
        rejectionReason: "Trims layout and Embellishment artwork sheets are missing. CAD marker width does not match fabric cuttable width 56 inch. Please correct and re-submit.",
        comments: "Trims layout and Embellishment artwork sheets are missing. CAD marker width does not match fabric cuttable width 56 inch.",
      },
    ],
  },
  {
    id: "pf-rec-004",
    fileRefNo: "PF-2026-0004",
    version: 1,
    versionType: "Original",
    isCurrentActive: true,
    sourceType: "Confirm Order Entry",
    sourceRecordId: "ord-004",
    sourceReference: "JOB-2026-0063",
    jobNo: "JOB-2026-0063",
    styleNo: "MS-KT-108",
    styleDescription: "Crewneck Basic Tee - Menswear",
    buyerName: "Marks & Spencer",
    season: "Spring / Summer 2027",
    poItems: [
      { id: "po-pf-004-1", po: "PO-MS-11029", poQty: 15000 },
    ],
    totalPoQty: 15000,
    attachments: [
      {
        id: "att-004-1",
        category: "BOM Sheet",
        fileName: "MS_KT108_Prelim_BOM.pdf",
        fileSize: "980 KB",
        fileType: "pdf",
        uploadDate: "2026-10-26 14:15",
        version: 1,
      },
    ],
    status: "Draft",
    notes: "Preliminary draft. Awaiting trims layout card and techpack updates from buyer.",
    createdBy: "Tanvir Ahmed (Merchandiser)",
    createdDate: "2026-10-26 14:00",
    history: [
      {
        id: "pfh-004-1",
        timestamp: "2026-10-26 14:00",
        action: "Draft Saved",
        userName: "Tanvir Ahmed (Merchandiser)",
        userRole: "Merchandiser",
        comments: "Draft saved. Will attach remaining items when received.",
      },
    ],
  },
];
