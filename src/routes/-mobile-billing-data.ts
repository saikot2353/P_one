// Mobile Billing Data Model, Seed Records and Helper Store
// Synchronized with Pakiza Knit Group Billing System

export interface DepartmentBillItem {
  id: string;
  companyCode: string;
  companyName: string;
  location: string;
  deptCode: string;
  deptName: string;
  limit: number;
  gpBill: number;
  totalPayment: number;
}

export interface MobileBillRecord {
  id: string;
  sl?: number;
  year: number;
  month: string; // e.g. "October" or "September"
  billingMonth: string; // e.g. "September-2026"
  billCycle: string; // e.g. "October-2026"
  companyCode: string; // e.g. "PKCL", "PAL", "PWFL", "PSL"
  companyName: string;
  location: string; // "HQ", "SAVAR", "Norshingdi", "Baridhara", "Gazipur"
  department: string;
  empId: string;
  empName: string;
  cardNo?: string;
  designation: string;
  simNo: string;
  operator: string; // "Grameenphone", "Banglalink", "Robi", "Teletalk"
  limit: number;
  actualBill: number; // GP Bill
  deduction: number; // Excess above limit
  totalPayment: number; // Actual company payment
  status: "Active" | "Billed" | "Approved" | "Paid" | "Submitted" | "Locked";
  isLocked?: boolean;
  remarks?: string;
}

export const BILLING_YEARS = [2027, 2026, 2025, 2024];

export const BILLING_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const COMPANIES_LIST = [
  { code: "A. PKCL", name: "PKCL - Pakiza Knit Composite Ltd" },
  { code: "B. PAL", name: "PAL - Pakiza Apparels Ltd" },
  { code: "C. PWFL", name: "PWFL - Pakiza Woven Fashion Ltd" },
  { code: "D. Seeshell", name: "Seeshell - Seeshell Ltd" },
  { code: "E. PFD-Global", name: "PFD-Global - Pakiza Fabrics Division Global" },
  { code: "F. PTVL", name: "PTVL - Pakiza Techno Venture Ltd" },
  { code: "G. PGL", name: "PGL - Pakiza Garments Ltd" },
  { code: "H. Lawnun", name: "Lawnun - Lawnun Apparels" },
  { code: "I. Baganbari", name: "Baganbari - Baganbari Unit" },
  { code: "J. PSL", name: "PSL - Pakiza Software Ltd / Spinning" },
  { code: "K. Trepti", name: "Trepti - Trepti Apparels" },
  { code: "L. Enorsia", name: "Enorsia - Enorsia Unit" },
];

export const LOCATIONS_LIST = ["HQ", "SAVAR", "Norshingdi", "Baridhara", "Gazipur"];

export const DEPARTMENTS_LIST = [
  "A. Management",
  "B. HR, Admin & Comp.",
  "C. Finance & Accounts",
  "D. Commercial",
  "E. MIS",
  "F. Procurement",
  "G. Internal Audit",
  "H. Production Audit",
  "I. VAT & TAX",
  "J. Merchandising",
  "K. Designing",
  "L. Sample & CAD",
  "M. Cutting",
  "N. IE & Planning",
  "O. Production Planning",
  "P. RMG Production",
  "Q. Quality Assurance",
  "R. RMG Finishing",
  "S. Dyeing",
  "T. Dyeing Finishing",
  "U. Embroidery",
  "V. Knitting",
  "W. Printing",
  "X. AOP",
  "Y. Fabric Dyeing",
  "Z. Yarn Dyeing",
  "ZA. Supply Chain",
  "ZB. Business Automation",
  "ZC. Implementation",
  "ZD. Technology",
  "ZE. MCD",
  "ZF. Merchandising Supply Chain",
  "ZG. Civil",
  "ZH. Maintenance",
  "ZI. ICT",
  "ZK. Marketing",
  "ZL. Enorsia",
  "ZM. Marketing & Technical",
  "ZN. Implementation and Support",
  "ZO. Business Development",
  "ZP. Business Innovation",
  "ZQ. Brand and Media",
  "ZR. Core Development",
  "ZS. Shop",
  "ZT. Research and Development",
  "Washing",
];

// Seed Department Wise Data directly from user screenshot
export const SEED_DEPARTMENT_WISE_DATA: DepartmentBillItem[] = [
  // A. PKCL -> HQ
  { id: "pkcl-hq-1", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "A", deptName: "A. Management", limit: 42500.00, gpBill: 15739.02, totalPayment: 15739.02 },
  { id: "pkcl-hq-2", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "C", deptName: "C. Finance & Accounts", limit: 4800.00, gpBill: 3482.99, totalPayment: 3482.99 },
  { id: "pkcl-hq-3", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "D", deptName: "D. Commercial", limit: 14860.00, gpBill: 11916.47, totalPayment: 11916.47 },
  { id: "pkcl-hq-4", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "G", deptName: "G. Internal Audit", limit: 6300.00, gpBill: 4822.62, totalPayment: 4822.62 },
  { id: "pkcl-hq-5", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "F", deptName: "F. Procurement", limit: 8100.00, gpBill: 6043.14, totalPayment: 6043.14 },
  { id: "pkcl-hq-6", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 78950.00, gpBill: 41414.87, totalPayment: 41414.25 },
  { id: "pkcl-hq-7", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "I", deptName: "I. VAT & TAX", limit: 3350.00, gpBill: 1687.73, totalPayment: 1687.73 },
  { id: "pkcl-hq-8", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "E", deptName: "E. MIS", limit: 2600.00, gpBill: 1290.42, totalPayment: 1290.42 },
  { id: "pkcl-hq-9", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "ZI", deptName: "ZI. ICT", limit: 5400.00, gpBill: 2459.44, totalPayment: 2459.44 },
  { id: "pkcl-hq-10", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "HQ", deptCode: "ZQ", deptName: "ZQ. Brand and Media", limit: 500.00, gpBill: 258.58, totalPayment: 258.58 },

  // A. PKCL -> SAVAR
  { id: "pkcl-savar-1", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "A", deptName: "A. Management", limit: 3000.00, gpBill: 3000.00, totalPayment: 3000.00 },
  { id: "pkcl-savar-2", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "C", deptName: "C. Finance & Accounts", limit: 3700.00, gpBill: 3328.10, totalPayment: 3328.10 },
  { id: "pkcl-savar-3", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "D", deptName: "D. Commercial", limit: 2400.00, gpBill: 1780.77, totalPayment: 1780.77 },
  { id: "pkcl-savar-4", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "G", deptName: "G. Internal Audit", limit: 2700.00, gpBill: 2268.42, totalPayment: 2268.42 },
  { id: "pkcl-savar-5", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 26150.00, gpBill: 23466.91, totalPayment: 23466.91 },
  { id: "pkcl-savar-6", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "J", deptName: "J. Merchandising", limit: 74880.00, gpBill: 65254.06, totalPayment: 65253.60 },
  { id: "pkcl-savar-7", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "W", deptName: "W. Printing", limit: 1800.00, gpBill: 1323.64, totalPayment: 1323.64 },
  { id: "pkcl-savar-8", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "V", deptName: "V. Knitting", limit: 7300.00, gpBill: 5526.85, totalPayment: 5526.85 },
  { id: "pkcl-savar-9", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "M", deptName: "M. Cutting", limit: 2800.00, gpBill: 2593.90, totalPayment: 2593.90 },
  { id: "pkcl-savar-10", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "H", deptName: "H. Production Audit", limit: 4200.00, gpBill: 3585.47, totalPayment: 3585.47 },
  { id: "pkcl-savar-11", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "S", deptName: "S. Dyeing", limit: 14700.00, gpBill: 12673.91, totalPayment: 12673.91 },
  { id: "pkcl-savar-12", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "P", deptName: "P. RMG Production", limit: 3700.00, gpBill: 2991.89, totalPayment: 2991.89 },
  { id: "pkcl-savar-13", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "L", deptName: "L. Sample & CAD", limit: 6500.00, gpBill: 4640.55, totalPayment: 4640.55 },
  { id: "pkcl-savar-14", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "N", deptName: "N. IE & Planning", limit: 12500.00, gpBill: 10484.89, totalPayment: 10484.89 },
  { id: "pkcl-savar-15", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "U", deptName: "U. Embroidery", limit: 1300.00, gpBill: 1046.76, totalPayment: 1046.76 },
  { id: "pkcl-savar-16", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "T", deptName: "T. Dyeing Finishing", limit: 3200.00, gpBill: 2984.13, totalPayment: 2984.13 },
  { id: "pkcl-savar-17", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "Q", deptName: "Q. Quality Assurance", limit: 6100.00, gpBill: 5016.84, totalPayment: 5016.84 },
  { id: "pkcl-savar-18", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "I", deptName: "I. VAT & TAX", limit: 500.00, gpBill: 446.14, totalPayment: 446.14 },
  { id: "pkcl-savar-19", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "R", deptName: "R. RMG Finishing", limit: 1400.00, gpBill: 980.80, totalPayment: 980.80 },
  { id: "pkcl-savar-20", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "ZH", deptName: "ZH. Maintenance", limit: 5500.00, gpBill: 4721.03, totalPayment: 4721.03 },
  { id: "pkcl-savar-21", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "ZG", deptName: "ZG. Civil", limit: 2000.00, gpBill: 1942.25, totalPayment: 1942.25 },
  { id: "pkcl-savar-22", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "ZE", deptName: "ZE. MCD", limit: 10000.00, gpBill: 9348.41, totalPayment: 9348.41 },
  { id: "pkcl-savar-23", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "ZI", deptName: "ZI. ICT", limit: 3300.00, gpBill: 3008.59, totalPayment: 3008.59 },
  { id: "pkcl-savar-24", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "ZF", deptName: "ZF. Merchandising Supply Chain", limit: 1700.00, gpBill: 1490.67, totalPayment: 1490.67 },
  { id: "pkcl-savar-25", companyCode: "A. PKCL", companyName: "Pakiza Knit Composite Ltd", location: "SAVAR", deptCode: "O", deptName: "O. Production Planning", limit: 5900.00, gpBill: 5126.39, totalPayment: 5126.39 },

  // B. PAL -> Norshingdi
  { id: "pal-nsh-1", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "C", deptName: "C. Finance & Accounts", limit: 3400.00, gpBill: 3105.83, totalPayment: 3105.83 },
  { id: "pal-nsh-2", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "D", deptName: "D. Commercial", limit: 2100.00, gpBill: 2045.12, totalPayment: 2045.12 },
  { id: "pal-nsh-3", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "G", deptName: "G. Internal Audit", limit: 3100.00, gpBill: 3009.91, totalPayment: 3009.91 },
  { id: "pal-nsh-4", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 17850.00, gpBill: 16192.20, totalPayment: 16192.20 },
  { id: "pal-nsh-5", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "X", deptName: "X. AOP", limit: 7500.00, gpBill: 6377.54, totalPayment: 6377.54 },
  { id: "pal-nsh-6", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "H", deptName: "H. Production Audit", limit: 3600.00, gpBill: 3563.13, totalPayment: 3561.47 },
  { id: "pal-nsh-7", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "I", deptName: "I. VAT & TAX", limit: 1950.00, gpBill: 1570.51, totalPayment: 1570.51 },
  { id: "pal-nsh-8", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "E", deptName: "E. MIS", limit: 500.00, gpBill: 492.00, totalPayment: 492.00 },
  { id: "pal-nsh-9", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "ZH", deptName: "ZH. Maintenance", limit: 2500.00, gpBill: 1807.63, totalPayment: 1807.63 },
  { id: "pal-nsh-10", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "ZG", deptName: "ZG. Civil", limit: 3700.00, gpBill: 2631.80, totalPayment: 2631.80 },
  { id: "pal-nsh-11", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "ZE", deptName: "ZE. MCD", limit: 4900.00, gpBill: 4603.29, totalPayment: 4603.29 },
  { id: "pal-nsh-12", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "ZI", deptName: "ZI. ICT", limit: 1300.00, gpBill: 1095.10, totalPayment: 1095.10 },
  { id: "pal-nsh-13", companyCode: "B. PAL", companyName: "Pakiza Apparels Ltd", location: "Norshingdi", deptCode: "Y", deptName: "Y. Fabric Dyeing", limit: 10000.00, gpBill: 8327.64, totalPayment: 8327.64 },

  // C. PWFL -> Norshingdi
  { id: "pwfl-nsh-1", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 1400.00, gpBill: 1384.10, totalPayment: 1384.10 },
  { id: "pwfl-nsh-2", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "J", deptName: "J. Merchandising", limit: 3300.00, gpBill: 2637.11, totalPayment: 2637.11 },
  { id: "pwfl-nsh-3", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "Z", deptName: "Z. Yarn Dyeing", limit: 9150.00, gpBill: 7119.99, totalPayment: 7119.99 },
  { id: "pwfl-nsh-4", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "P", deptName: "P. RMG Production", limit: 3300.00, gpBill: 1178.51, totalPayment: 1178.51 },
  { id: "pwfl-nsh-5", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "N", deptName: "N. IE & Planning", limit: 500.00, gpBill: 0.00, totalPayment: 0.00 },
  { id: "pwfl-nsh-6", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "R", deptName: "R. RMG Finishing", limit: 700.00, gpBill: 0.00, totalPayment: 0.00 },
  { id: "pwfl-nsh-7", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "ZH", deptName: "ZH. Maintenance", limit: 300.00, gpBill: 79.70, totalPayment: 79.70 },
  { id: "pwfl-nsh-8", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "ZE", deptName: "ZE. MCD", limit: 2300.00, gpBill: 1944.54, totalPayment: 1944.54 },
  { id: "pwfl-nsh-9", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "ZF", deptName: "ZF. Merchandising Supply Chain", limit: 300.00, gpBill: 296.46, totalPayment: 296.46 },
  { id: "pwfl-nsh-10", companyCode: "C. PWFL", companyName: "Pakiza Woven Fashion Ltd", location: "Norshingdi", deptCode: "WASH", deptName: "Washing", limit: 1500.00, gpBill: 1350.01, totalPayment: 1350.01 },

  // D. Seeshell -> HQ
  { id: "see-hq-1", companyCode: "D. Seeshell", companyName: "Seeshell Ltd", location: "HQ", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 300.00, gpBill: 286.07, totalPayment: 286.07 },
  { id: "see-hq-2", companyCode: "D. Seeshell", companyName: "Seeshell Ltd", location: "HQ", deptCode: "ZE", deptName: "ZE. MCD", limit: 800.00, gpBill: 677.21, totalPayment: 677.21 },
  { id: "see-hq-3", companyCode: "D. Seeshell", companyName: "Seeshell Ltd", location: "HQ", deptCode: "K", deptName: "K. Designing", limit: 900.00, gpBill: 535.47, totalPayment: 535.47 },
  { id: "see-hq-4", companyCode: "D. Seeshell", companyName: "Seeshell Ltd", location: "HQ", deptCode: "ZK", deptName: "ZK. Marketing", limit: 500.00, gpBill: 493.41, totalPayment: 493.41 },
  { id: "see-hq-5", companyCode: "D. Seeshell", companyName: "Seeshell Ltd", location: "HQ", deptCode: "ZS", deptName: "ZS. Shop", limit: 300.00, gpBill: 233.39, totalPayment: 233.39 },

  // E. PFD-Global -> Baridhara
  { id: "pfd-bd-1", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "A", deptName: "A. Management", limit: 4000.00, gpBill: 1310.07, totalPayment: 1310.07 },
  { id: "pfd-bd-2", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "C", deptName: "C. Finance & Accounts", limit: 300.00, gpBill: 282.52, totalPayment: 282.52 },
  { id: "pfd-bd-3", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "D", deptName: "D. Commercial", limit: 700.00, gpBill: 601.84, totalPayment: 601.84 },
  { id: "pfd-bd-4", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "G", deptName: "G. Internal Audit", limit: 900.00, gpBill: 845.70, totalPayment: 845.70 },
  { id: "pfd-bd-5", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 800.00, gpBill: 449.97, totalPayment: 449.97 },
  { id: "pfd-bd-6", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "J", deptName: "J. Merchandising", limit: 22600.00, gpBill: 15176.49, totalPayment: 15176.49 },
  { id: "pfd-bd-7", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "L", deptName: "L. Sample & CAD", limit: 500.00, gpBill: 478.59, totalPayment: 478.59 },
  { id: "pfd-bd-8", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "Q", deptName: "Q. Quality Assurance", limit: 6300.00, gpBill: 5704.83, totalPayment: 5704.83 },
  { id: "pfd-bd-9", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "ZI", deptName: "ZI. ICT", limit: 600.00, gpBill: 577.96, totalPayment: 577.96 },
  { id: "pfd-bd-10", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "K", deptName: "K. Designing", limit: 500.00, gpBill: 499.84, totalPayment: 499.84 },
  { id: "pfd-bd-11", companyCode: "E. PFD-Global", companyName: "Pakiza Fabrics Division Global", location: "Baridhara", deptCode: "ZT", deptName: "ZT. Research and Development", limit: 500.00, gpBill: 209.45, totalPayment: 209.45 },

  // F. PTVL -> HQ
  { id: "ptvl-hq-1", companyCode: "F. PTVL", companyName: "Pakiza Techno Venture Ltd", location: "HQ", deptCode: "C", deptName: "C. Finance & Accounts", limit: 1700.00, gpBill: 1639.01, totalPayment: 1639.01 },
  { id: "ptvl-hq-2", companyCode: "F. PTVL", companyName: "Pakiza Techno Venture Ltd", location: "HQ", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 1200.00, gpBill: 622.28, totalPayment: 622.28 },
  { id: "ptvl-hq-3", companyCode: "F. PTVL", companyName: "Pakiza Techno Venture Ltd", location: "HQ", deptCode: "I", deptName: "I. VAT & TAX", limit: 300.00, gpBill: 204.26, totalPayment: 204.26 },
  { id: "ptvl-hq-4", companyCode: "F. PTVL", companyName: "Pakiza Techno Venture Ltd", location: "HQ", deptCode: "ZD", deptName: "ZD. Technology", limit: 500.00, gpBill: 498.03, totalPayment: 498.03 },
  { id: "ptvl-hq-5", companyCode: "F. PTVL", companyName: "Pakiza Techno Venture Ltd", location: "HQ", deptCode: "ZA", deptName: "ZA. Supply Chain", limit: 200.00, gpBill: 193.07, totalPayment: 193.07 },

  // G. PGL -> Gazipur
  { id: "pgl-gz-1", companyCode: "G. PGL", companyName: "Pakiza Garments Ltd", location: "Gazipur", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 600.00, gpBill: 518.44, totalPayment: 518.44 },

  // H. Lawnun -> HQ
  { id: "lawn-hq-1", companyCode: "H. Lawnun", companyName: "Lawnun", location: "HQ", deptCode: "ZE", deptName: "ZE. MCD", limit: 600.00, gpBill: 311.89, totalPayment: 311.89 },
  { id: "lawn-hq-2", companyCode: "H. Lawnun", companyName: "Lawnun", location: "HQ", deptCode: "ZK", deptName: "ZK. Marketing", limit: 1500.00, gpBill: 1500.00, totalPayment: 1500.00 },
  { id: "lawn-hq-3", companyCode: "H. Lawnun", companyName: "Lawnun", location: "HQ", deptCode: "ZM", deptName: "ZM. Marketing & Technical", limit: 5600.00, gpBill: 2956.40, totalPayment: 2956.40 },

  // I. Baganbari -> Norshingdi
  { id: "bagan-nsh-1", companyCode: "I. Baganbari", companyName: "Baganbari", location: "Norshingdi", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 500.00, gpBill: 312.33, totalPayment: 312.33 },

  // J. PSL -> HQ
  { id: "psl-hq-1", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 2150.00, gpBill: 1748.88, totalPayment: 1748.88 },
  { id: "psl-hq-2", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZB", deptName: "ZB. Business Automation", limit: 12000.00, gpBill: 7301.29, totalPayment: 7301.29 },
  { id: "psl-hq-3", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZN", deptName: "ZN. Implementation and Support", limit: 700.00, gpBill: 690.44, totalPayment: 690.44 },
  { id: "psl-hq-4", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZO", deptName: "ZO. Business Development", limit: 1000.00, gpBill: 998.76, totalPayment: 998.76 },
  { id: "psl-hq-5", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZP", deptName: "ZP. Business Innovation", limit: 1100.00, gpBill: 1071.80, totalPayment: 1071.80 },
  { id: "psl-hq-6", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZC", deptName: "ZC. Implementation", limit: 500.00, gpBill: 499.89, totalPayment: 499.89 },
  { id: "psl-hq-7", companyCode: "J. PSL", companyName: "Pakiza Software Ltd", location: "HQ", deptCode: "ZR", deptName: "ZR. Core Development", limit: 700.00, gpBill: 0.00, totalPayment: 0.00 },

  // K. Trepti -> Norshingdi
  { id: "trep-nsh-1", companyCode: "K. Trepti", companyName: "Trepti Apparels", location: "Norshingdi", deptCode: "B", deptName: "B. HR, Admin & Comp.", limit: 400.00, gpBill: 394.86, totalPayment: 394.86 },

  // L. Enorsia -> Baridhara
  { id: "enor-bd-1", companyCode: "L. Enorsia", companyName: "Enorsia Unit", location: "Baridhara", deptCode: "Q", deptName: "Q. Quality Assurance", limit: 300.00, gpBill: 98.48, totalPayment: 98.48 },
  { id: "enor-bd-2", companyCode: "L. Enorsia", companyName: "Enorsia Unit", location: "Baridhara", deptCode: "ZE", deptName: "ZE. MCD", limit: 300.00, gpBill: 283.50, totalPayment: 283.50 },
  { id: "enor-bd-3", companyCode: "L. Enorsia", companyName: "Enorsia Unit", location: "Baridhara", deptCode: "ZI", deptName: "ZI. ICT", limit: 2700.00, gpBill: 2685.53, totalPayment: 2685.53 },
  { id: "enor-bd-4", companyCode: "L. Enorsia", companyName: "Enorsia Unit", location: "Baridhara", deptCode: "K", deptName: "K. Designing", limit: 500.00, gpBill: 495.99, totalPayment: 495.99 },
  { id: "enor-bd-5", companyCode: "L. Enorsia", companyName: "Enorsia Unit", location: "Baridhara", deptCode: "ZL", deptName: "ZL. Enorsia", limit: 8000.00, gpBill: 6086.09, totalPayment: 6086.09 },
];

// Generator for representative individual employee billing records
export function generateSeedEmployeeBills(): MobileBillRecord[] {
  const employees: MobileBillRecord[] = [];
  let slCounter = 1;

  // Realistic employee profiles linked to departments
  const sampleStaff = [
    { name: "Rafiqul Islam", desig: "Managing Director", empId: "2010001001", sim: "01711000001", op: "Grameenphone" },
    { name: "Tanvir Ahmed", desig: "General Manager", empId: "2012001045", sim: "01711000002", op: "Grameenphone" },
    { name: "Md. Jamshed Alam", desig: "GM Operation", empId: "2014001017", sim: "01787650914", op: "Grameenphone" },
    { name: "Saeid Maruf", desig: "AGM Planning", empId: "2014001111", sim: "01709641322", op: "Grameenphone" },
    { name: "Nasir Uddin", desig: "Senior Manager", empId: "2015002011", sim: "01713000010", op: "Grameenphone" },
    { name: "Kamrul Hasan", desig: "Manager Accounts", empId: "2016003022", sim: "01713000011", op: "Grameenphone" },
    { name: "Abdul Motaleb", desig: "Head of ICT", empId: "2016003055", sim: "01713000012", op: "Grameenphone" },
    { name: "Farhana Yasmin", desig: "Assistant Manager HR", empId: "2017004018", sim: "01713000013", op: "Grameenphone" },
    { name: "Mahfuzur Rahman", desig: "Senior Merchandiser", empId: "2018005029", sim: "01713000014", op: "Grameenphone" },
    { name: "Shamsul Arefin", desig: "Quality In-charge", empId: "2019006033", sim: "01713000015", op: "Grameenphone" },
    { name: "Anisur Rahman", desig: "Commercial Officer", empId: "2020007044", sim: "01713000016", op: "Grameenphone" },
    { name: "Zubair Hossain", desig: "Dyeing Master", empId: "2021008055", sim: "01713000017", op: "Grameenphone" },
    { name: "Mizanur Rahman", desig: "Maintenance Engineer", empId: "2022009066", sim: "01713000018", op: "Grameenphone" },
    { name: "Shahidul Islam", desig: "Store Incharge", empId: "2023010077", sim: "01713000019", op: "Grameenphone" },
    { name: "Arifur Rahman", desig: "Software Engineer", empId: "2024011088", sim: "01713000020", op: "Grameenphone" },
  ];

  SEED_DEPARTMENT_WISE_DATA.forEach((dept, dIdx) => {
    // Generate 1 to 3 employee records per department that sum up nicely
    const count = dept.limit >= 10000 ? 3 : dept.limit >= 3000 ? 2 : 1;
    const splitRatio = count === 3 ? [0.5, 0.3, 0.2] : count === 2 ? [0.6, 0.4] : [1];

    splitRatio.forEach((ratio, rIdx) => {
      const staffRef = sampleStaff[(dIdx * 3 + rIdx) % sampleStaff.length];
      const empLimit = Math.round(dept.limit * ratio);
      const isLast = rIdx === splitRatio.length - 1;
      
      let empBill = Number((dept.gpBill * ratio).toFixed(2));
      let empTotalPayment = Number((dept.totalPayment * ratio).toFixed(2));

      // Check if actual bill exceeds limit to show realistic excess recovery
      const deduction = empBill > empLimit ? Number((empBill - empLimit).toFixed(2)) : 0;
      if (deduction > 0) {
        empTotalPayment = empLimit;
      }

      employees.push({
        id: `emp-bill-${dept.id}-${rIdx + 1}`,
        sl: slCounter++,
        year: 2026,
        month: "October",
        billingMonth: "September-2026",
        billCycle: "October-2026",
        companyCode: dept.companyCode,
        companyName: dept.companyName,
        location: dept.location,
        department: dept.deptName,
        empId: `${staffRef.empId}${dIdx + 1}${rIdx + 1}`.slice(0, 10),
        empName: `${staffRef.name}${count > 1 ? ` (${rIdx + 1})` : ""}`,
        cardNo: `CR-${1000 + slCounter}`,
        designation: staffRef.desig,
        simNo: `017${String(10000000 + slCounter * 837).slice(0, 8)}`,
        operator: "Grameenphone",
        limit: empLimit,
        actualBill: empBill,
        deduction: deduction,
        totalPayment: empTotalPayment,
        status: "Billed",
        remarks: "Official Corporate Postpaid SIM",
      });
    });
  });

  return employees;
}

const STORAGE_KEY = "cripton_mobile_billing_records_v2";

export function loadMobileBillingRecords(): MobileBillRecord[] {
  if (typeof window === "undefined") {
    return generateSeedEmployeeBills();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load mobile billing from localStorage", e);
  }

  const initial = generateSeedEmployeeBills();
  saveMobileBillingRecords(initial);
  return initial;
}

export function saveMobileBillingRecords(records: MobileBillRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Failed to save mobile billing to localStorage", e);
  }
}

export function resetMobileBillingToDefaults(): MobileBillRecord[] {
  const seed = generateSeedEmployeeBills();
  saveMobileBillingRecords(seed);
  return seed;
}
