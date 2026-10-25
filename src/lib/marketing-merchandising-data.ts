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
export interface MMPreCostItem {
  preCostItemId: string; // Unique persistent identifier (e.g. PCI-001)
  category: "Fabric" | "Accessories" | "Trims" | "Embellishment" | "Wash" | "Commercial" | "CM";
  itemCode: string;
  itemDescription: string;
  specification: string;
  bodyPartOrUsedPlace: string;
  consumptionPerPc: number;
  unit: string; // 'Yds', 'Kg', 'Dzn', 'Gross', 'Pcs', 'Mtr'
  wastagePct: number;
  requiredQtyWithWastage: number; // for 1 pc / dozen basis
  unitRate: number; // in USD
  totalAmountPerDzn: number;
  supplierNominee?: string;
  notes?: string;
}

export interface MMPreCosting {
  id: string;
  preCostId: string; // e.g. PC-2026-001
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
  items: MMPreCostItem[];
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
  rejectionReason?: string;
  createdBy: string;
  createdDate: string;
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
  country: string;
  accountHolder: string;
  departments: { id: string; name: string; code: string }[];
  styles: { id: string; styleNo: string; description: string; garmentItem: string }[];
}

export const MM_BUYERS_MASTER: MMBuyerMaster[] = [
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
    if (v2Orders && Array.isArray(v2Orders) && v2Orders.length > 0) {
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
    return INITIAL_MM_ORDERS;
  }

  static saveOrder(order: MMMainOrder): void {
    const list = this.getOrders();
    const idx = list.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      list[idx] = order;
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
