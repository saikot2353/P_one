import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-audit-mrr")({
  head: () => ({
    meta: [
      { title: "MRR Audit — Procurement | CRIPTON" },
      { name: "description", content: "Material Receive Report (MRR) Audit ledger, line-item review, and official MRIR document generation." },
    ],
  }),
  component: ProcurementAuditMrrPage,
});

export interface MrrItemDetail {
  sl: number;
  groupName: string;
  productName: string;
  specification: string;
  reqNums?: string;
  unit: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  reviewNote?: string;
}

export interface MrrRecord {
  mrr: string;
  mrrDate: string;
  supplier: string;
  challan: string;
  chDate: string;
  billNo: string;
  billDate?: string;
  remark: string;
  location: string;
  storeName: string;
  mrrType: string;
  poNo: string;
  poDate: string;
  revision: string;
  lcNo?: string;
  lcDate?: string;
  isAudited?: boolean;
  auditNote?: string;
  auditDate?: string;
  auditedBy?: string;
  items: MrrItemDetail[];
  mcdPreparedBy?: { name: string; designation: string; date: string };
  mcdCheckedBy?: { name: string; designation: string; date: string };
  qualityInspectedBy?: { name: string; designation: string; date: string };
  mcdApprovedBy?: { name: string; designation: string; date: string };
  billingInfoInputtedBy?: { name: string; designation: string; date: string };
  billingInfoApprovedBy?: { name: string; designation: string; date: string };
  checkNoteMcd?: string;
  qualityNote?: string;
  approveNoteMcd?: string;
  procurementRemark?: string;
}

const INITIAL_MRR_RECORDS: MrrRecord[] = [
  {
    mrr: "612",
    mrrDate: "06/09/2026",
    supplier: "Al-Amin Electronics",
    challan: "00",
    chDate: "30/07/2026",
    billNo: "",
    billDate: "",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000238",
    poDate: "30/07/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "06/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "06/09/2026 11:06:02" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "06/09/2026 11:06:53" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "06/09/2026 11:07:11" },
    items: [
      {
        sl: 1,
        groupName: "General Stationary",
        productName: "Alkaline Battery",
        specification: "Received Philips AA battery.",
        reqNums: "",
        unit: "PCS",
        qty: 60.00,
        unitPrice: 60.00,
        totalPrice: 3600.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "611",
    mrrDate: "06/09/2026",
    supplier: "New Bhai Bhai Aushad Bitan",
    challan: "00",
    chDate: "30/07/2026",
    billNo: "",
    billDate: "",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000237",
    poDate: "28/07/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "06/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "06/09/2026 10:45:10" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "06/09/2026 10:50:30" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "06/09/2026 10:55:00" },
    items: [
      {
        sl: 1,
        groupName: "Medical & First Aid",
        productName: "First Aid Kit",
        specification: "Antiseptic liquids, gauze bandages, adhesive plasters",
        reqNums: "REQ-MED-092",
        unit: "BOX",
        qty: 20.00,
        unitPrice: 350.00,
        totalPrice: 7000.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "610",
    mrrDate: "05/09/2026",
    supplier: "Gadget & Gear",
    challan: "GGS026202607000383",
    chDate: "16/07/2026",
    billNo: "GGS026202607000383",
    billDate: "16/07/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000230",
    poDate: "15/07/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: true,
    auditNote: "Physical verification verified with vendor warranty cards.",
    auditDate: "06/09/2026",
    auditedBy: "Audit Team (A. Rahman)",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "Original invoice attached",
    mcdPreparedBy: { name: "Kamrul Islam", designation: "Store Officer", date: "05/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 14:10:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 14:30:15" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 14:45:00" },
    items: [
      {
        sl: 1,
        groupName: "IT Hardware",
        productName: "Barcode Scanner Handheld",
        specification: "Honeywell Laser USB Barcode Scanner",
        reqNums: "REQ-IT-104",
        unit: "PCS",
        qty: 4.00,
        unitPrice: 4800.00,
        totalPrice: 19200.00,
        reviewNote: "Serial numbers verified against warranty documentation",
      },
    ],
  },
  {
    mrr: "609",
    mrrDate: "05/09/2026",
    supplier: "ZOOM TECHNOLOGY",
    challan: "489",
    chDate: "31/08/2026",
    billNo: "489",
    billDate: "31/08/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000228",
    poDate: "25/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 11:20:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 11:35:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 11:45:00" },
    items: [
      {
        sl: 1,
        groupName: "Networking Equipment",
        productName: "Cat6 UTP Cable Roll",
        specification: "D-Link 305m Gigabit Ethernet Cable Blue",
        reqNums: "REQ-NET-011",
        unit: "ROLL",
        qty: 2.00,
        unitPrice: 11500.00,
        totalPrice: 23000.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "608",
    mrrDate: "05/09/2026",
    supplier: "Star Tech Ltd",
    challan: "INV-STLR4-2028-017669",
    chDate: "20/08/2026",
    billNo: "INV-STLR4-2026-017669",
    billDate: "20/08/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000225",
    poDate: "18/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: true,
    auditNote: "Checked and approved with purchase order specifications.",
    auditDate: "06/09/2026",
    auditedBy: "Audit Team (A. Rahman)",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 09:15:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 09:30:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 09:40:00" },
    items: [
      {
        sl: 1,
        groupName: "Computer Peripherals",
        productName: "Thermal Receipt Printer",
        specification: "Epson TM-T82X POS USB Printer Black",
        reqNums: "REQ-IT-099",
        unit: "PCS",
        qty: 3.00,
        unitPrice: 14500.00,
        totalPrice: 43500.00,
        reviewNote: "Device test completed in store",
      },
    ],
  },
  {
    mrr: "607",
    mrrDate: "05/09/2026",
    supplier: "Robotics BD",
    challan: "96551",
    chDate: "18/08/2026",
    billNo: "96551",
    billDate: "18/08/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000221",
    poDate: "16/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 12:00:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 12:15:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 12:20:00" },
    items: [
      {
        sl: 1,
        groupName: "Automation Electronics",
        productName: "Industrial Proximity Sensor",
        specification: "Autonics Inductive PNP NO Sensor PR18-8DN",
        reqNums: "REQ-AUTO-034",
        unit: "PCS",
        qty: 10.00,
        unitPrice: 1850.00,
        totalPrice: 18500.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "606",
    mrrDate: "05/09/2026",
    supplier: "Gadget & Gaming Zone",
    challan: "1298",
    chDate: "03/09/2026",
    billNo: "1298",
    billDate: "03/09/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000219",
    poDate: "30/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "05/09/2026 13:00:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 13:15:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "05/09/2026 13:20:00" },
    items: [
      {
        sl: 1,
        groupName: "Audio Visual",
        productName: "Conference Microphone System",
        specification: "Boya Desktop Omni-directional USB Mic",
        reqNums: "REQ-AV-012",
        unit: "SET",
        qty: 2.00,
        unitPrice: 8500.00,
        totalPrice: 17000.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "605",
    mrrDate: "03/09/2026",
    supplier: "MS Rifat traders",
    challan: "2414",
    chDate: "02/07/2026",
    billNo: "2499",
    billDate: "02/07/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000215",
    poDate: "28/06/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026 15:30:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 15:45:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 15:55:00" },
    items: [
      {
        sl: 1,
        groupName: "Hardware & Tools",
        productName: "Industrial Stainless Screws M6",
        specification: "Grade 304 SS Hex Bolt & Nut Set with Washer",
        reqNums: "REQ-HRD-088",
        unit: "KG",
        qty: 45.00,
        unitPrice: 320.00,
        totalPrice: 14400.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "604",
    mrrDate: "03/09/2026",
    supplier: "Progoti Stationary Suppliers",
    challan: "4792",
    chDate: "01/07/2026",
    billNo: "4792",
    billDate: "01/07/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000212",
    poDate: "26/06/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026 16:00:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 16:15:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 16:20:00" },
    items: [
      {
        sl: 1,
        groupName: "Office Supplies",
        productName: "A4 Photocopy Paper 80GSM",
        specification: "Double A Premium Box (5 Reams per box)",
        reqNums: "REQ-OFF-201",
        unit: "BOX",
        qty: 50.00,
        unitPrice: 1850.00,
        totalPrice: 92500.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "603",
    mrrDate: "03/09/2026",
    supplier: "NASIR HARDWARE STORE",
    challan: "5079",
    chDate: "02/07/2026",
    billNo: "4001",
    billDate: "02/07/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000208",
    poDate: "25/06/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "03/09/2026 16:30:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 16:45:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "03/09/2026 16:50:00" },
    items: [
      {
        sl: 1,
        groupName: "Industrial Hardware",
        productName: "High Pressure Hydraulic Hose",
        specification: "Gates 2-Wire Hydraulic 1/2 Inch with Crimped Ends",
        reqNums: "REQ-ENG-055",
        unit: "MTR",
        qty: 30.00,
        unitPrice: 650.00,
        totalPrice: 19500.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "602",
    mrrDate: "29/08/2026",
    supplier: "Konica Hardware",
    challan: "019",
    chDate: "12/08/2026",
    billNo: "019",
    billDate: "12/08/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000204",
    poDate: "10/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "29/08/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "29/08/2026 11:10:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "29/08/2026 11:25:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "29/08/2026 11:30:00" },
    items: [
      {
        sl: 1,
        groupName: "Store Maintenance",
        productName: "Anti-Rust Lubricant Spray",
        specification: "WD-40 Multi-Use Product 400ml Can",
        reqNums: "REQ-MNT-012",
        unit: "CAN",
        qty: 10.00,
        unitPrice: 380.00,
        totalPrice: 3800.00,
        reviewNote: "",
      },
    ],
  },
  {
    mrr: "601",
    mrrDate: "29/08/2026",
    supplier: "Cash Purchase Supplier",
    challan: "00",
    chDate: "23/08/2026",
    billNo: "00",
    billDate: "23/08/2026",
    remark: "",
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrType: "Receive Regular",
    poNo: "PO/PSL/2026/000201",
    poDate: "22/08/2026",
    revision: "00",
    lcNo: "",
    lcDate: "",
    isAudited: false,
    auditNote: "",
    checkNoteMcd: "Ok",
    qualityNote: "Ok",
    approveNoteMcd: "Ok",
    procurementRemark: "",
    mcdPreparedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "29/08/2026" },
    mcdCheckedBy: { name: "Sohanur Rahman Sohan", designation: "Executive", date: "29/08/2026 14:00:00" },
    qualityInspectedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "29/08/2026 14:15:00" },
    mcdApprovedBy: { name: "Rajebul Hasan Rajon", designation: "Deputy Manager", date: "29/08/2026 14:20:00" },
    items: [
      {
        sl: 1,
        groupName: "General Maintenance",
        productName: "Cotton Waste Cleaning Rags",
        specification: "White Knitted Cotton Scrap Rags",
        reqNums: "REQ-CW-001",
        unit: "KG",
        qty: 100.00,
        unitPrice: 65.00,
        totalPrice: 6500.00,
        reviewNote: "",
      },
    ],
  },
];

const CURATED_SUPPLIERS = [
  "ALL SUPPLIER",
  "Al-Amin Electronics",
  "New Bhai Bhai Aushad Bitan",
  "Gadget & Gear",
  "ZOOM TECHNOLOGY",
  "Star Tech Ltd",
  "Robotics BD",
  "Gadget & Gaming Zone",
  "MS Rifat traders",
  "Progoti Stationary Suppliers",
  "NASIR HARDWARE STORE",
  "Konica Hardware",
  "Cash Purchase Supplier",
  "M.B. Trade Corporation",
  "Madona Enterprise",
  "MAYER DOYA ENTERPRISE",
  "OHYOUNG INS",
  "Silver Apparels Ltd.",
  "Apex Textile Chemical Ltd",
  "B. BARIA BELT GALLERY",
];

function numberToWords(amount: number): string {
  if (amount === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifceen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertLessThanOneThousand(n: number): string {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result.trim();
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) return "Zero Taka Only";

  let words = "";

  const crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  if (crore > 0) words += convertLessThanOneThousand(crore) + " Crore ";
  if (lakh > 0) words += convertLessThanOneThousand(lakh) + " Lakh ";
  if (thousand > 0) words += convertLessThanOneThousand(thousand) + " Thousand ";
  if (remainder > 0) words += convertLessThanOneThousand(remainder);

  words = words.trim();

  if (words.length > 0) words += " Taka";
  if (decimalPart > 0) {
    words += " and " + convertLessThanOneThousand(decimalPart) + " Paisa";
  }

  return words + " Only";
}

function ProcurementAuditMrrPage() {
  // Filter States
  const [location, setLocation] = useState("PSL-Operation");
  const [storeName, setStoreName] = useState("General Item Store");
  const [mrrDateFrom, setMrrDateFrom] = useState("2026-08-08");
  const [mrrDateTo, setMrrDateTo] = useState("2026-09-08");
  const [mrrType, setMrrType] = useState("Receive Regular");
  const [supplierName, setSupplierName] = useState("ALL SUPPLIER");
  const [mrrNumbersInput, setMrrNumbersInput] = useState("");
  const [challanNumbersInput, setChallanNumbersInput] = useState("");

  // Applied Filter States
  const [appliedFilters, setAppliedFilters] = useState({
    location: "PSL-Operation",
    storeName: "General Item Store",
    mrrDateFrom: "2026-08-08",
    mrrDateTo: "2026-09-08",
    mrrType: "Receive Regular",
    supplierName: "ALL SUPPLIER",
    mrrNumbers: "",
    challanNumbers: "",
  });

  // Table Search & Pagination
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Master Data
  const [mrrList, setMrrList] = useState<MrrRecord[]>(() => {
    try {
      const saved = localStorage.getItem("procurement_mrr_audit_records_v1");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MRR_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("procurement_mrr_audit_records_v1", JSON.stringify(mrrList));
    } catch {
      // ignore
    }
  }, [mrrList]);

  // Modal States
  // 1. MRR Details / Audit Modal
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedAuditMrr, setSelectedAuditMrr] = useState<MrrRecord | null>(null);
  const [currentAuditNote, setCurrentAuditNote] = useState("");
  const [itemReviewNotes, setItemReviewNotes] = useState<Record<number, string>>({});
  const [auditSuccessToast, setAuditSuccessToast] = useState<string | null>(null);

  // 2. MRIR Print View Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPrintMrr, setSelectedPrintMrr] = useState<MrrRecord | null>(null);

  const handleApplyFilter = () => {
    setAppliedFilters({
      location,
      storeName,
      mrrDateFrom,
      mrrDateTo,
      mrrType,
      supplierName,
      mrrNumbers: mrrNumbersInput.trim(),
      challanNumbers: challanNumbersInput.trim(),
    });
    setCurrentPage(1);
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return mrrList.filter((rec) => {
      // Location filter
      if (appliedFilters.location && appliedFilters.location !== "All" && rec.location !== appliedFilters.location) {
        return false;
      }
      // Store filter
      if (appliedFilters.storeName && appliedFilters.storeName !== "All" && rec.storeName !== appliedFilters.storeName) {
        return false;
      }
      // MRR Type filter
      if (appliedFilters.mrrType && appliedFilters.mrrType !== "All" && rec.mrrType !== appliedFilters.mrrType) {
        return false;
      }
      // Supplier filter
      if (appliedFilters.supplierName && appliedFilters.supplierName !== "ALL SUPPLIER") {
        if (rec.supplier.toLowerCase() !== appliedFilters.supplierName.toLowerCase()) {
          return false;
        }
      }
      // Comma-separated MRR numbers
      if (appliedFilters.mrrNumbers) {
        const allowedMrrs = appliedFilters.mrrNumbers.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        if (allowedMrrs.length > 0 && !allowedMrrs.some((num) => rec.mrr.toLowerCase().includes(num))) {
          return false;
        }
      }
      // Comma-separated Challan numbers
      if (appliedFilters.challanNumbers) {
        const allowedChallans = appliedFilters.challanNumbers.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        if (allowedChallans.length > 0 && !allowedChallans.some((num) => rec.challan.toLowerCase().includes(num))) {
          return false;
        }
      }
      // Text search in table
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const match =
          rec.mrr.toLowerCase().includes(q) ||
          rec.supplier.toLowerCase().includes(q) ||
          rec.challan.toLowerCase().includes(q) ||
          rec.billNo.toLowerCase().includes(q) ||
          rec.poNo.toLowerCase().includes(q) ||
          rec.remark.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [mrrList, appliedFilters, tableSearch]);

  // Pagination
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Open Audit Modal
  const openAuditModal = (record: MrrRecord) => {
    setSelectedAuditMrr(record);
    setCurrentAuditNote(record.auditNote || "");
    const initialNotes: Record<number, string> = {};
    record.items.forEach((item) => {
      initialNotes[item.sl] = item.reviewNote || "";
    });
    setItemReviewNotes(initialNotes);
    setAuditModalOpen(true);
  };

  const closeAuditModal = () => {
    setAuditModalOpen(false);
    setSelectedAuditMrr(null);
  };

  // Submit Audit
  const handleSaveAudit = () => {
    if (!selectedAuditMrr) return;

    setMrrList((prev) =>
      prev.map((rec) => {
        if (rec.mrr === selectedAuditMrr.mrr) {
          const updatedItems = rec.items.map((it) => ({
            ...it,
            reviewNote: itemReviewNotes[it.sl] || "",
          }));
          return {
            ...rec,
            isAudited: true,
            auditNote: currentAuditNote,
            auditDate: new Date().toLocaleDateString("en-GB"),
            auditedBy: "Audit Team (A. Rahman)",
            items: updatedItems,
          };
        }
        return rec;
      })
    );

    setAuditSuccessToast(`MRR #${selectedAuditMrr.mrr} has been marked as AUDITED successfully!`);
    setTimeout(() => setAuditSuccessToast(null), 4000);
    closeAuditModal();
  };

  // Open Print Modal
  const openPrintModal = (record: MrrRecord) => {
    setSelectedPrintMrr(record);
    setPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setPrintModalOpen(false);
    setSelectedPrintMrr(null);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = ["MRR", "MRRDate", "Supplier", "Challan", "ChDate", "BillNo", "Remark", "AuditStatus"];
    const rows = filteredRecords.map((r) => [
      r.mrr,
      r.mrrDate,
      `"${r.supplier.replace(/"/g, '""')}"`,
      `"${r.challan.replace(/"/g, '""')}"`,
      r.chDate,
      `"${r.billNo.replace(/"/g, '""')}"`,
      `"${r.remark.replace(/"/g, '""')}"`,
      r.isAudited ? "Audited" : "Pending",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mrr_audit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-5 w-full max-w-[1700px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-[#1890ff]" />
                MRR Audit
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement Workspace &gt; Audit &gt; <span className="text-[#1890ff] font-medium">MRR Audit</span>
              </p>
            </div>

            {auditSuccessToast && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-xs animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                {auditSuccessToast}
              </div>
            )}
          </div>

          {/* Top Filter Card (Matching Screenshot 1 with blue left accent bar) */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#1890ff] p-5 pl-7">
            <div className="space-y-4">
              {/* Row 1: Location Name, Store Name, MRR Date From, MRR Date To, MRR Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location Name
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  >
                    <option value="PSL-Operation">PSL-Operation</option>
                    <option value="Corporate Office">Corporate Office</option>
                    <option value="Factory Unit 1">Factory Unit 1</option>
                    <option value="Factory Unit 2">Factory Unit 2</option>
                    <option value="All">All Locations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Store Name
                  </label>
                  <select
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  >
                    <option value="General Item Store">General Item Store</option>
                    <option value="Yarn Store">Yarn Store</option>
                    <option value="Dyes & Chemical Store">Dyes & Chemical Store</option>
                    <option value="Spare Parts Store">Spare Parts Store</option>
                    <option value="Accessories Store">Accessories Store</option>
                    <option value="All">All Stores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    MRR Date From
                  </label>
                  <input
                    type="date"
                    value={mrrDateFrom}
                    onChange={(e) => setMrrDateFrom(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    MRR Date To
                  </label>
                  <input
                    type="date"
                    value={mrrDateTo}
                    onChange={(e) => setMrrDateTo(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    MRR Type
                  </label>
                  <select
                    value={mrrType}
                    onChange={(e) => setMrrType(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  >
                    <option value="Receive Regular">Receive Regular</option>
                    <option value="Receive Loan">Receive Loan</option>
                    <option value="Receive Sample">Receive Sample</option>
                    <option value="All">All Types</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Supplier Name, MRR Numbers, Challan Numbers, SHOW button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div className="sm:col-span-1 md:col-span-2">
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Supplier Name
                  </label>
                  <SearchableSelect
                    options={CURATED_SUPPLIERS.map((s) => ({ value: s, label: s }))}
                    value={supplierName}
                    onChange={(val) => setSupplierName(val)}
                    placeholder="Search supplier..."
                    className="w-full h-8 text-xs border-slate-300 dark:border-slate-700 rounded"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    MRR Numbers <span className="text-[10px] text-slate-400 font-normal">(Comma Separator)</span>
                  </label>
                  <input
                    type="text"
                    value={mrrNumbersInput}
                    onChange={(e) => setMrrNumbersInput(e.target.value)}
                    placeholder="e.g. 612, 611, 610"
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Challan Numbers <span className="text-[10px] text-slate-400 font-normal">(Comma Separator)</span>
                  </label>
                  <input
                    type="text"
                    value={challanNumbersInput}
                    onChange={(e) => setChallanNumbersInput(e.target.value)}
                    placeholder="e.g. 00, 489, 96551"
                    className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleApplyFilter}
                    className="w-24 h-8 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase rounded transition-colors shadow-2xs cursor-pointer flex items-center justify-center tracking-wider"
                  >
                    SHOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card (Matching Screenshot 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
            {/* Action Toolbar */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Left: EXCEL, PRINT, PDF */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  PRINT
                </button>
                <button
                  type="button"
                  onClick={handlePrintTable}
                  className="h-8 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <FileText className="size-3.5 text-rose-600" />
                  PDF
                </button>
              </div>

              {/* Right: Search Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8 w-48 sm:w-64 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-20 text-center">Action</th>
                    <th className="py-2.5 px-3 w-20">MRR</th>
                    <th className="py-2.5 px-3 w-28">MRRDate</th>
                    <th className="py-2.5 px-4 min-w-[200px]">Supplier</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Challan</th>
                    <th className="py-2.5 px-3 w-28">ChDate</th>
                    <th className="py-2.5 px-3 min-w-[140px]">BillNo</th>
                    <th className="py-2.5 px-4 min-w-[120px]">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No MRR records found matching criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row, idx) => (
                      <tr
                        key={row.mrr}
                        className={`hover:bg-sky-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          idx % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-850/40" : ""
                        }`}
                      >
                        {/* Action: Blue Printer + Amber Magnifying Glass */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Blue Printer icon */}
                            <button
                              type="button"
                              onClick={() => openPrintModal(row)}
                              title="Print / View MRIR Details"
                              className="p-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Printer className="size-4 text-[#1890ff]" />
                            </button>
                            {/* Amber Magnifying Glass icon */}
                            <button
                              type="button"
                              onClick={() => openAuditModal(row)}
                              title="MRR Details & Audit Review"
                              className="p-1 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Search className="size-4 text-amber-500" />
                            </button>
                          </div>
                        </td>

                        {/* MRR */}
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          {row.mrr}
                          {row.isAudited && (
                            <span className="inline-block size-1.5 rounded-full bg-emerald-500" title="Audited" />
                          )}
                        </td>

                        {/* MRRDate */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.mrrDate}</td>

                        {/* Supplier */}
                        <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">{row.supplier}</td>

                        {/* Challan */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          {row.challan || "—"}
                        </td>

                        {/* ChDate */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.chDate || "—"}</td>

                        {/* BillNo */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          {row.billNo || "—"}
                        </td>

                        {/* Remark */}
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                          {row.remark || (row.isAudited ? <span className="text-emerald-600 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">Audited</span> : "")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Status Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="size-3.5" /> Previous
                </button>
                <div className="px-3 py-1 font-semibold text-slate-800 dark:text-slate-200">
                  {currentPage} / {totalPages}
                </div>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  Next <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: MRR Details / Audit Modal (Matching Screenshot 2)              */}
      {/* ========================================================================= */}
      {auditModalOpen && selectedAuditMrr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                MRR Details
              </h2>
              <button
                type="button"
                onClick={closeAuditModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Metadata Grid (Matching boxed layout in Screenshot 2) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden text-xs">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      MRR NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 font-semibold text-slate-900 dark:text-slate-100">
                      {selectedAuditMrr.mrr}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      PO NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-blue-600 dark:text-blue-400 font-medium">
                      {selectedAuditMrr.poNo || "—"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      REVISION
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono">
                      {selectedAuditMrr.revision || "00"}
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      MRR DATE
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.mrrDate}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      PO DATE
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.poDate || "—"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      SUPPLIER
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-900 dark:text-slate-100 font-semibold truncate">
                      {selectedAuditMrr.supplier}
                    </span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 dark:border-slate-700 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      CHALLAN NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono">
                      {selectedAuditMrr.challan || "00"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      LC NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.lcNo || ""}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      BILL NO
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono">
                      {selectedAuditMrr.billNo || ""}
                    </span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-slate-700">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      CHALLAN DATE
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.chDate || "—"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      LC DATE
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.lcDate || ""}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800/40">
                      BILL DATE
                    </span>
                    <span className="flex-1 px-3 py-1.5 text-slate-800 dark:text-slate-200">
                      {selectedAuditMrr.billDate || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table (with lavender header bg-[#EEF0FD]) */}
              <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#EEF0FD] dark:bg-indigo-950/40 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center border-r border-slate-300 dark:border-slate-700">SL</th>
                      <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-300 dark:border-slate-700">GROUP NAME</th>
                      <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-300 dark:border-slate-700">PRODUCT NAME</th>
                      <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-300 dark:border-slate-700">SPECIFICATION</th>
                      <th className="py-2.5 px-2.5 w-20 border-r border-slate-300 dark:border-slate-700">ReqNums</th>
                      <th className="py-2.5 px-2.5 w-16 text-center border-r border-slate-300 dark:border-slate-700">UNIT</th>
                      <th className="py-2.5 px-3 w-20 text-right border-r border-slate-300 dark:border-slate-700">QTY</th>
                      <th className="py-2.5 px-3 w-24 text-right border-r border-slate-300 dark:border-slate-700">UNIT PRICE</th>
                      <th className="py-2.5 px-3 min-w-[150px]">Review Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                    {selectedAuditMrr.items.map((item) => (
                      <tr key={item.sl} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-center font-semibold border-r border-slate-200 dark:border-slate-700">
                          {item.sl}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                          {item.groupName}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">
                          {item.specification}
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 text-[11px]">
                          {item.reqNums || "—"}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-700 dark:text-slate-300 font-mono text-[11px] border-r border-slate-200 dark:border-slate-700">
                          {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.qty.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={itemReviewNotes[item.sl] || ""}
                            onChange={(e) =>
                              setItemReviewNotes((prev) => ({
                                ...prev,
                                [item.sl]: e.target.value,
                              }))
                            }
                            placeholder="Enter review note..."
                            className="w-full h-7 px-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Audit Note Field with Red Asterisk */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={currentAuditNote}
                  onChange={(e) => setCurrentAuditNote(e.target.value)}
                  placeholder="Enter overall audit findings, approvals, or observations..."
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff] bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Modal Footer: CLOSE on left, AUDITED on right */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                type="button"
                onClick={closeAuditModal}
                className="px-4 py-2 text-xs font-semibold uppercase text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={handleSaveAudit}
                className="px-6 py-2 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                AUDITED
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Material Receiving & Inspection Report (MRIR) (Screenshot 3)    */}
      {/* ========================================================================= */}
      {printModalOpen && selectedPrintMrr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-300">
            {/* Modal Action Bar (Screen Only) */}
            <div className="print:hidden px-5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="size-4 text-[#1890ff]" />
                <span className="text-xs font-bold text-slate-800">
                  Material Receiving &amp; Inspection Report (MRIR) Preview — MRR #{selectedPrintMrr.mrr}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#1890ff] hover:bg-sky-600 text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print MRIR
                </button>
                <button
                  type="button"
                  onClick={closePrintModal}
                  className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-6 md:p-8 bg-white font-sans text-xs space-y-4">
              {/* Document Header (Matching Screenshot 3) */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Left: Logo & Address */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Software" className="h-9 object-contain" />
                    <div>
                      <div className="font-black text-sm tracking-wide text-slate-900">PAKIZA SOFTWARE</div>
                      <div className="text-[9px] text-slate-500 font-semibold tracking-wider">Excellence | Intelligence | Automation</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 pt-1 leading-tight">
                    <div>Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</div>
                    <div className="text-slate-500">PSL/REC/STR/04</div>
                    <div className="text-slate-500">PSL/REC/STR/03</div>
                  </div>
                </div>

                {/* Right: RECEIVE DETAILS box */}
                <div className="text-right flex flex-col items-end">
                  <div className="text-sm font-bold tracking-wider text-slate-800 mb-1 uppercase">
                    RECEIVE DETAILS
                  </div>
                  <div className="border border-slate-400 rounded text-[11px] text-left divide-y divide-slate-300 w-48">
                    <div className="flex justify-between px-2.5 py-0.5">
                      <span className="font-semibold text-slate-700">MRR NO :</span>
                      <span className="font-bold text-slate-900">{selectedPrintMrr.mrr}</span>
                    </div>
                    <div className="flex justify-between px-2.5 py-0.5">
                      <span className="font-semibold text-slate-700">MRR DATE :</span>
                      <span className="text-slate-800">{selectedPrintMrr.mrrDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered Document Title */}
              <div className="text-center pt-1 pb-1">
                <h3 className="text-sm font-bold text-slate-900 underline tracking-wide">
                  Material Receiving &amp; Inspection Report (MRIR)
                </h3>
              </div>

              {/* Boxed Metadata Table (Matching Screenshot 3) */}
              <div className="border border-slate-400 text-[11px]">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">CHALLAN NO</span>
                    <span className="flex-1 px-2.5 py-1 font-mono font-semibold text-slate-900">{selectedPrintMrr.challan || "00"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1">PO/WO</span>
                    <span className="flex-1 px-2.5 py-1 text-blue-600 font-semibold underline">{selectedPrintMrr.poNo || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1">SUPPLIER</span>
                    <span className="flex-1 px-2.5 py-1 font-semibold text-slate-900 truncate">{selectedPrintMrr.supplier}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">CHALLAN DATE</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800">{selectedPrintMrr.chDate || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1">PO/WO DATE</span>
                    <span className="flex-1 px-2.5 py-1 text-slate-800">{selectedPrintMrr.poDate || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1"></span>
                    <span className="flex-1 px-2.5 py-1"></span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-300 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">BILL NO</span>
                    <span className="flex-1 px-2.5 py-1 font-mono">{selectedPrintMrr.billNo || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1">LC NO</span>
                    <span className="flex-1 px-2.5 py-1">{selectedPrintMrr.lcNo || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1"></span>
                    <span className="flex-1 px-2.5 py-1"></span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="flex">
                    <span className="w-28 font-bold text-slate-800 px-2.5 py-1">BILL DATE</span>
                    <span className="flex-1 px-2.5 py-1">{selectedPrintMrr.billDate || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1">LC DATE</span>
                    <span className="flex-1 px-2.5 py-1">{selectedPrintMrr.lcDate || ""}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800 px-2.5 py-1"></span>
                    <span className="flex-1 px-2.5 py-1"></span>
                  </div>
                </div>
              </div>

              {/* Items Table (Matching Screenshot 3) */}
              <div className="border border-slate-400">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#EEF0FD] border-b border-slate-400 text-slate-900 font-bold">
                      <th className="py-1.5 px-2 w-8 text-center border-r border-slate-400">SL</th>
                      <th className="py-1.5 px-3 min-w-[160px] border-r border-slate-400">Item</th>
                      <th className="py-1.5 px-3 min-w-[220px] border-r border-slate-400">Specification</th>
                      <th className="py-1.5 px-3 w-28 text-right border-r border-slate-400">Quantity</th>
                      <th className="py-1.5 px-3 w-24 text-right border-r border-slate-400">UNIT PRICE</th>
                      <th className="py-1.5 px-3 w-28 text-right border-r border-slate-400">TOTAL PRICE</th>
                      <th className="py-1.5 px-3 w-24">Req. Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {selectedPrintMrr.items.map((item) => (
                      <tr key={item.sl}>
                        <td className="py-2 px-2 text-center font-semibold border-r border-slate-400 align-top">
                          {item.sl}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-400 align-top">
                          <div className="font-semibold text-slate-900">Item : {item.productName}</div>
                          <div className="text-[10px] text-slate-600">Cat : {item.groupName}</div>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-400 text-slate-700 align-top">
                          {item.specification}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold border-r border-slate-400 align-top">
                          {item.qty.toFixed(2)} ({item.unit})
                        </td>
                        <td className="py-2 px-3 text-right font-semibold border-r border-slate-400 align-top">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold border-r border-slate-400 align-top">
                          {item.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-slate-600 align-top">
                          {item.reqNums || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary Section Below Table */}
                <div className="border-t border-slate-400 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-400 text-[11px]">
                  {/* Left: Total Quantity */}
                  <div className="p-2 font-bold text-slate-800 flex items-center">
                    Total Quantity : {selectedPrintMrr.items.reduce((s, i) => s + i.qty, 0)}
                  </div>

                  {/* Right: Amounts breakdown */}
                  <div className="divide-y divide-slate-200">
                    <div className="flex justify-between px-3 py-1">
                      <span className="font-medium text-slate-700">Total Amount</span>
                      <span className="font-bold text-slate-900">
                        {selectedPrintMrr.items.reduce((s, i) => s + i.totalPrice, 0).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">Discount(-)</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">VAT(-)</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between px-3 py-0.5">
                      <span className="text-slate-600">TAX(-)</span>
                      <span className="font-mono">0</span>
                    </div>
                    <div className="flex justify-between px-3 py-1 bg-slate-50 font-bold">
                      <span className="text-slate-800">Grand Total</span>
                      <span className="text-slate-900">
                        {selectedPrintMrr.items.reduce((s, i) => s + i.totalPrice, 0).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount In Words */}
              <div className="text-[11px] pt-1">
                <span className="font-bold text-slate-800">In word: </span>
                <span className="italic text-slate-900">
                  {numberToWords(selectedPrintMrr.items.reduce((s, i) => s + i.totalPrice, 0))}
                </span>
              </div>

              {/* Verification & Notes Table */}
              <div className="border border-slate-400 text-[10.5px] divide-y divide-slate-300">
                <div className="flex">
                  <span className="w-48 font-bold text-slate-800 px-2.5 py-0.5 border-r border-slate-300">
                    Remarks (MCD)
                  </span>
                  <span className="flex-1 px-2.5 py-0.5 text-slate-700"></span>
                </div>
                <div className="flex">
                  <span className="w-48 font-bold text-slate-800 px-2.5 py-0.5 border-r border-slate-300">
                    Check Note (MCD)
                  </span>
                  <span className="flex-1 px-2.5 py-0.5 text-slate-800 font-medium">
                    {selectedPrintMrr.checkNoteMcd || "Ok"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-48 font-bold text-slate-800 px-2.5 py-0.5 border-r border-slate-300">
                    Quality Note
                  </span>
                  <span className="flex-1 px-2.5 py-0.5 text-slate-800 font-medium">
                    {selectedPrintMrr.qualityNote || "Ok"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-48 font-bold text-slate-800 px-2.5 py-0.5 border-r border-slate-300">
                    Approve Note (MCD)
                  </span>
                  <span className="flex-1 px-2.5 py-0.5 text-slate-800 font-medium">
                    {selectedPrintMrr.approveNoteMcd || "Ok"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-48 font-bold text-slate-800 px-2.5 py-0.5 border-r border-slate-300">
                    Remark (Procurement)
                  </span>
                  <span className="flex-1 px-2.5 py-0.5 text-slate-700">
                    {selectedPrintMrr.procurementRemark || ""}
                  </span>
                </div>
              </div>

              {/* 6-Tier Signature Block (Matching Screenshot 3) */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-[10px]">
                {/* 1. MCD Prepared By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintMrr.mcdPreparedBy?.name || "Sohanur Rahman Sohan"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintMrr.mcdPreparedBy?.designation || "Executive"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9px]">
                    {selectedPrintMrr.mcdPreparedBy?.date || "06/09/2026"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    MCD Prepared By
                  </div>
                </div>

                {/* 2. MCD Checked By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintMrr.mcdCheckedBy?.name || "Sohanur Rahman Sohan"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintMrr.mcdCheckedBy?.designation || "Executive"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9px]">
                    {selectedPrintMrr.mcdCheckedBy?.date || "06/09/2026 11:06:02"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    MCD Checked By
                  </div>
                </div>

                {/* 3. Quality Inspected By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintMrr.qualityInspectedBy?.name || "Rajebul Hasan Rajon"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintMrr.qualityInspectedBy?.designation || "Deputy Manager"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9px]">
                    {selectedPrintMrr.qualityInspectedBy?.date || "06/09/2026 11:06:53"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Quality Inspected By
                  </div>
                </div>

                {/* 4. MCD Approved By */}
                <div className="flex flex-col justify-end">
                  <div className="font-semibold text-slate-900">
                    {selectedPrintMrr.mcdApprovedBy?.name || "Rajebul Hasan Rajon"}
                  </div>
                  <div className="text-slate-600">
                    {selectedPrintMrr.mcdApprovedBy?.designation || "Deputy Manager"}
                  </div>
                  <div className="text-slate-500 font-mono text-[9px]">
                    {selectedPrintMrr.mcdApprovedBy?.date || "06/09/2026 11:07:11"}
                  </div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    MCD Approved By
                  </div>
                </div>

                {/* 5. Billing Info Inputted By */}
                <div className="flex flex-col justify-end">
                  <div className="h-9"></div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Billing Info Inputted By
                  </div>
                </div>

                {/* 6. Billing Info Approved By */}
                <div className="flex flex-col justify-end">
                  <div className="h-9"></div>
                  <div className="border-t border-slate-400 border-dotted pt-1 mt-1 font-bold text-slate-800">
                    Billing Info Approved By
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
