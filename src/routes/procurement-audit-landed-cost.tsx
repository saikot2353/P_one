import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Pencil,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Building2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

export const Route = createFileRoute("/procurement-audit-landed-cost")({
  head: () => ({
    meta: [
      { title: "Update Landed Cost — Procurement | CRIPTON" },
      { name: "description", content: "Update Product Landed Cost Sheet, Proforma Invoice (PI) audit, customs duty, and landed cost distribution." },
    ],
  }),
  component: ProcurementAuditLandedCostPage,
});

export interface PiItemDetail {
  sl: number;
  reqNums: string;
  productName: string;
  originName: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  basePrice?: number;
  landedRate?: number;
  landedTotal?: number;
}

export interface LandedCostExpenses {
  customsDuty: number;
  insurance: number;
  freight: number;
  portAndCnf: number;
  inlandTransport: number;
  bankCharges: number;
  miscExpenses: number;
}

export interface PiRecord {
  piNo: string;
  piDate: string;
  lcNo: string;
  lcDate: string;
  shipmentDate: string;
  supplier: string;
  productType: string;
  status: "Submit" | "Audited" | "Approved" | "In Review";
  shipmentTerms: string;
  piValidityDate: string;
  currency: string;
  exchangeRate?: number;
  portOfDischarge: string;
  portOfLoading: string;
  piType: "Local" | "Foreign";
  upcharge: number;
  discount: number;
  remarks?: string;
  items: PiItemDetail[];
  expenses?: LandedCostExpenses;
  totalLandedCost?: number;
  landedFactor?: number;
  auditedDate?: string;
  auditedBy?: string;
  auditNotes?: string;
}

const INITIAL_PI_RECORDS: PiRecord[] = [
  {
    piNo: "PI-SCCL-DF-2024-000889",
    piDate: "26/05/2024",
    lcNo: "167624990015",
    lcDate: "30/05/2024",
    shipmentDate: "30/06/2024",
    supplier: "Samuda Chemical Complex Ltd",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "Select",
    piValidityDate: "30/06/2024",
    currency: "BDT",
    exchangeRate: 1,
    portOfDischarge: "Savar Factory",
    portOfLoading: "Dhaka Depot",
    piType: "Local",
    upcharge: 0,
    discount: 0,
    remarks: "Local delivery under annual chemical supply contract",
    expenses: {
      customsDuty: 0,
      insurance: 15000,
      freight: 25000,
      portAndCnf: 8000,
      inlandTransport: 35000,
      bankCharges: 12000,
      miscExpenses: 5000,
    },
    items: [
      {
        sl: 1,
        reqNums: "261761",
        productName: "Hydrogen Peroxide (TANK)",
        originName: "Bangladesh",
        description: "Industrial Grade 50% Concentration in ISO Tank",
        quantity: 40000.0,
        unit: "KG",
        rate: 45.0,
        total: 1800000.0,
      },
    ],
  },
  {
    piNo: "PAR/NAOH/24-65",
    piDate: "28/02/2024",
    lcNo: "167624990007",
    lcDate: "04/03/2024",
    shipmentDate: "06/04/2024",
    supplier: "Tasnim Chemical Complex Ltd",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "Ex-Factory",
    piValidityDate: "06/04/2024",
    currency: "BDT",
    exchangeRate: 1,
    portOfDischarge: "Savar Factory",
    portOfLoading: "Narayanganj Plant",
    piType: "Local",
    upcharge: 0,
    discount: 0,
    remarks: "Direct plant delivery",
    expenses: {
      customsDuty: 0,
      insurance: 18000,
      freight: 30000,
      portAndCnf: 6000,
      inlandTransport: 40000,
      bankCharges: 14000,
      miscExpenses: 4000,
    },
    items: [
      {
        sl: 1,
        reqNums: "261890",
        productName: "Caustic Soda Flakes 99%",
        originName: "Bangladesh",
        description: "High Purity Caustic Soda Solid Flakes",
        quantity: 25000.0,
        unit: "KG",
        rate: 78.0,
        total: 1950000.0,
      },
    ],
  },
  {
    piNo: "SDC/EXP/2617/2023-24",
    piDate: "31/03/2024",
    lcNo: "141324020070",
    lcDate: "02/04/2024",
    shipmentDate: "08/06/2024",
    supplier: "Spectrum Dyes & Chemicals PVT. Ltd.",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "08/06/2024",
    currency: "USD",
    exchangeRate: 118.5,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Nhava Sheva Port, India",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Import consignment for reactive dyeing batch",
    expenses: {
      customsDuty: 320000,
      insurance: 45000,
      freight: 180000,
      portAndCnf: 95000,
      inlandTransport: 65000,
      bankCharges: 48000,
      miscExpenses: 15000,
    },
    items: [
      {
        sl: 1,
        reqNums: "262015",
        productName: "Disperse Reactive Blue RGB",
        originName: "India",
        description: "High Fastness Textile Dyeing Pigment",
        quantity: 5000.0,
        unit: "KG",
        rate: 620.0,
        total: 3100000.0,
      },
    ],
  },
  {
    piNo: "0654/AC/2023",
    piDate: "06/06/2023",
    lcNo: "141323020177",
    lcDate: "13/06/2023",
    shipmentDate: "01/08/2023",
    supplier: "ARCHROMA SINGAPORE PTE LTD",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "FOB Singapore",
    piValidityDate: "01/08/2023",
    currency: "USD",
    exchangeRate: 118.0,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Singapore Port",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Sulphur dye solution consignment",
    expenses: {
      customsDuty: 290000,
      insurance: 42000,
      freight: 210000,
      portAndCnf: 88000,
      inlandTransport: 70000,
      bankCharges: 52000,
      miscExpenses: 18000,
    },
    items: [
      {
        sl: 1,
        reqNums: "258901",
        productName: "Diresul Black RDT Liquid",
        originName: "Singapore",
        description: "Ecological Pre-reduced Sulphur Dye Liquid",
        quantity: 8000.0,
        unit: "KG",
        rate: 385.0,
        total: 3080000.0,
      },
    ],
  },
  {
    piNo: "010623-PFI-PKZ 4",
    piDate: "01/06/2023",
    lcNo: "167623020082",
    lcDate: "19/06/2023",
    shipmentDate: "29/08/2023",
    supplier: "PT. Sinar Syno Kimia",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "29/08/2023",
    currency: "USD",
    exchangeRate: 117.5,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Tanjung Priok, Jakarta",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Reactive dye powder batch",
    expenses: {
      customsDuty: 240000,
      insurance: 38000,
      freight: 160000,
      portAndCnf: 75000,
      inlandTransport: 55000,
      bankCharges: 39000,
      miscExpenses: 12000,
    },
    items: [
      {
        sl: 1,
        reqNums: "258830",
        productName: "Synozol Red HF-6BN",
        originName: "Indonesia",
        description: "Poly-functional Reactive Dye for Cotton",
        quantity: 3000.0,
        unit: "KG",
        rate: 840.0,
        total: 2520000.0,
      },
    ],
  },
  {
    piNo: "PI20230322002",
    piDate: "22/03/2023",
    lcNo: "167623020036",
    lcDate: "25/05/2023",
    shipmentDate: "26/06/2023",
    supplier: "Taiwan Surfactant",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "FOB Kaohsiung",
    piValidityDate: "26/06/2023",
    currency: "USD",
    exchangeRate: 116.8,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Kaohsiung Port",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Scouring and wetting agent",
    expenses: {
      customsDuty: 260000,
      insurance: 35000,
      freight: 195000,
      portAndCnf: 80000,
      inlandTransport: 60000,
      bankCharges: 41000,
      miscExpenses: 14000,
    },
    items: [
      {
        sl: 1,
        reqNums: "256110",
        productName: "Non-Ionic Wetting Agent",
        originName: "Taiwan",
        description: "High Efficiency Low Foaming Scouring Agent",
        quantity: 12000.0,
        unit: "KG",
        rate: 210.0,
        total: 2520000.0,
      },
    ],
  },
  {
    piNo: "PI-SCCL-DF-2024-000891",
    piDate: "26/05/2024",
    lcNo: "167624990019",
    lcDate: "12/06/2024",
    shipmentDate: "28/07/2024",
    supplier: "Samuda Chemical Complex Ltd",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "Select",
    piValidityDate: "28/07/2024",
    currency: "BDT",
    exchangeRate: 1,
    portOfDischarge: "Savar Factory",
    portOfLoading: "Dhaka Depot",
    piType: "Local",
    upcharge: 0,
    discount: 0,
    remarks: "Local delivery in HDPE drums",
    expenses: {
      customsDuty: 0,
      insurance: 12000,
      freight: 20000,
      portAndCnf: 5000,
      inlandTransport: 28000,
      bankCharges: 9000,
      miscExpenses: 3500,
    },
    items: [
      {
        sl: 1,
        reqNums: "261765",
        productName: "Sodium Hypochlorite 10%",
        originName: "Bangladesh",
        description: "Bleaching Agent Bulk Liquid Solution",
        quantity: 35000.0,
        unit: "KG",
        rate: 32.0,
        total: 1120000.0,
      },
    ],
  },
  {
    piNo: "HT20230604BS01",
    piDate: "04/06/2023",
    lcNo: "167623020079",
    lcDate: "14/06/2023",
    shipmentDate: "01/08/2023",
    supplier: "HongHao Chemical Co., Limited",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "01/08/2023",
    currency: "USD",
    exchangeRate: 117.2,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Shanghai Port, China",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Textile finishing softener",
    expenses: {
      customsDuty: 285000,
      insurance: 40000,
      freight: 175000,
      portAndCnf: 84000,
      inlandTransport: 62000,
      bankCharges: 46000,
      miscExpenses: 16000,
    },
    items: [
      {
        sl: 1,
        reqNums: "258992",
        productName: "Silicone Softener Emulsion",
        originName: "China",
        description: "Hydrophilic Amino Silicone Micro Emulsion",
        quantity: 15000.0,
        unit: "KG",
        rate: 195.0,
        total: 2925000.0,
      },
    ],
  },
  {
    piNo: "MT-46",
    piDate: "29/01/2024",
    lcNo: "141324020035",
    lcDate: "15/02/2024",
    shipmentDate: "05/05/2024",
    supplier: "Hai Ao Textile Printing Material Co., Ltd",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "05/05/2024",
    currency: "USD",
    exchangeRate: 117.8,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Ningbo Port, China",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Printing binder auxiliary",
    expenses: {
      customsDuty: 270000,
      insurance: 36000,
      freight: 165000,
      portAndCnf: 78000,
      inlandTransport: 58000,
      bankCharges: 42000,
      miscExpenses: 13000,
    },
    items: [
      {
        sl: 1,
        reqNums: "260840",
        productName: "Pigment Printing Binder",
        originName: "China",
        description: "Self-crosslinking Acrylic Copolymer Binder",
        quantity: 10000.0,
        unit: "KG",
        rate: 260.0,
        total: 2600000.0,
      },
    ],
  },
  {
    piNo: "040523-PFI-PKZ-APR RC",
    piDate: "04/05/2023",
    lcNo: "141323020156",
    lcDate: "24/05/2023",
    shipmentDate: "25/07/2023",
    supplier: "PT. Sinar Syno Kimia",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "25/07/2023",
    currency: "USD",
    exchangeRate: 117.0,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Jakarta Port",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Reactive deep black powder",
    expenses: {
      customsDuty: 340000,
      insurance: 48000,
      freight: 220000,
      portAndCnf: 98000,
      inlandTransport: 72000,
      bankCharges: 55000,
      miscExpenses: 19000,
    },
    items: [
      {
        sl: 1,
        reqNums: "257910",
        productName: "Synozol Deep Black GD",
        originName: "Indonesia",
        description: "High Build-up Reactive Black for Heavy Shades",
        quantity: 6000.0,
        unit: "KG",
        rate: 580.0,
        total: 3480000.0,
      },
    ],
  },
  {
    piNo: "BS20230201",
    piDate: "06/02/2023",
    lcNo: "167623020014",
    lcDate: "02/03/2023",
    shipmentDate: "12/03/2023",
    supplier: "SWPD Limited",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "Local Delivery",
    piValidityDate: "12/03/2023",
    currency: "BDT",
    exchangeRate: 1,
    portOfDischarge: "Savar Factory",
    portOfLoading: "Dhaka Warehouse",
    piType: "Local",
    upcharge: 0,
    discount: 0,
    remarks: "Optical whitening agent delivery",
    expenses: {
      customsDuty: 0,
      insurance: 22000,
      freight: 35000,
      portAndCnf: 10000,
      inlandTransport: 45000,
      bankCharges: 18000,
      miscExpenses: 6000,
    },
    items: [
      {
        sl: 1,
        reqNums: "255220",
        productName: "Optical Brightening Agent (OBA)",
        originName: "India",
        description: "Fluorescent Whitening Agent for Cellulosic Fibers",
        quantity: 4000.0,
        unit: "KG",
        rate: 750.0,
        total: 3000000.0,
      },
    ],
  },
  {
    piNo: "PI20230109001",
    piDate: "09/01/2023",
    lcNo: "141323010003",
    lcDate: "25/01/2023",
    shipmentDate: "11/03/2023",
    supplier: "Taiwan Surfactant",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "CIF Chittagong",
    piValidityDate: "11/03/2023",
    currency: "USD",
    exchangeRate: 116.5,
    portOfDischarge: "Chittagong Port",
    portOfLoading: "Kaohsiung Port",
    piType: "Foreign",
    upcharge: 0,
    discount: 0,
    remarks: "Polyethylene glycol intermediate",
    expenses: {
      customsDuty: 245000,
      insurance: 34000,
      freight: 155000,
      portAndCnf: 72000,
      inlandTransport: 52000,
      bankCharges: 38000,
      miscExpenses: 12000,
    },
    items: [
      {
        sl: 1,
        reqNums: "254881",
        productName: "Polyethylene Glycol PEG-400",
        originName: "Taiwan",
        description: "Pharmaceutical & Industrial Solubilizer",
        quantity: 8000.0,
        unit: "KG",
        rate: 290.0,
        total: 2320000.0,
      },
    ],
  },
  {
    piNo: "HCL-034/22",
    piDate: "02/04/2022",
    lcNo: "141322990014",
    lcDate: "25/04/2022",
    shipmentDate: "29/06/2022",
    supplier: "Harmony Chem Ltd.",
    productType: "Dyes & Chemicals",
    status: "Submit",
    shipmentTerms: "Local Delivery",
    piValidityDate: "29/06/2022",
    currency: "BDT",
    exchangeRate: 1,
    portOfDischarge: "Savar Factory",
    portOfLoading: "Dhaka Depot",
    piType: "Local",
    upcharge: 0,
    discount: 0,
    remarks: "Anti-backstaining agent for washing unit",
    expenses: {
      customsDuty: 0,
      insurance: 14000,
      freight: 22000,
      portAndCnf: 6000,
      inlandTransport: 30000,
      bankCharges: 11000,
      miscExpenses: 4000,
    },
    items: [
      {
        sl: 1,
        reqNums: "251020",
        productName: "Anti-Backstaining Agent",
        originName: "Bangladesh",
        description: "Polymer-based Anti-backstaining Agent",
        quantity: 5000.0,
        unit: "KG",
        rate: 310.0,
        total: 1550000.0,
      },
    ],
  },
];

const CURATED_SUPPLIERS = [
  "All...",
  "Samuda Chemical Complex Ltd",
  "Tasnim Chemical Complex Ltd",
  "Spectrum Dyes & Chemicals PVT. Ltd.",
  "ARCHROMA SINGAPORE PTE LTD",
  "PT. Sinar Syno Kimia",
  "Taiwan Surfactant",
  "HongHao Chemical Co., Limited",
  "Hai Ao Textile Printing Material Co., Ltd",
  "SWPD Limited",
  "Harmony Chem Ltd.",
  "M.B. Trade Corporation",
  "Madona Enterprise",
  "MAYER DOYA ENTERPRISE",
  "Apex Textile Chemical Ltd",
  "Al-Amin Electronics",
  "Star Tech Ltd",
];

function ProcurementAuditLandedCostPage() {
  // Filter States
  const [piDateFrom, setPiDateFrom] = useState("2023-03-01");
  const [piDateTo, setPiDateTo] = useState("2026-09-08");
  const [supplierName, setSupplierName] = useState("All...");
  const [piNumberInput, setPiNumberInput] = useState("");

  // Applied Filter States
  const [appliedFilters, setAppliedFilters] = useState({
    piDateFrom: "2023-03-01",
    piDateTo: "2026-09-08",
    supplierName: "All...",
    piNumber: "",
  });

  // Table Search & Pagination
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Master Data
  const [piList, setPiList] = useState<PiRecord[]>(() => {
    try {
      const saved = localStorage.getItem("procurement_landed_cost_records_v1");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PI_RECORDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("procurement_landed_cost_records_v1", JSON.stringify(piList));
    } catch {
      // ignore
    }
  }, [piList]);

  // Modals:
  // 1. Proforma Invoice Print View Modal (Screenshot 2)
  const [piModalOpen, setPiModalOpen] = useState(false);
  const [selectedPi, setSelectedPi] = useState<PiRecord | null>(null);

  // 2. Update Landed Cost Modal (triggered by amber pencil icon)
  const [landedCostModalOpen, setLandedCostModalOpen] = useState(false);
  const [editingLandedPi, setEditingLandedPi] = useState<PiRecord | null>(null);
  const [expenseForm, setExpenseForm] = useState<LandedCostExpenses>({
    customsDuty: 0,
    insurance: 0,
    freight: 0,
    portAndCnf: 0,
    inlandTransport: 0,
    bankCharges: 0,
    miscExpenses: 0,
  });
  const [auditNotes, setAuditNotes] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleApplyFilter = () => {
    setAppliedFilters({
      piDateFrom,
      piDateTo,
      supplierName,
      piNumber: piNumberInput.trim(),
    });
    setCurrentPage(1);
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return piList.filter((rec) => {
      // Supplier filter
      if (appliedFilters.supplierName && appliedFilters.supplierName !== "All...") {
        if (rec.supplier.toLowerCase() !== appliedFilters.supplierName.toLowerCase()) {
          return false;
        }
      }
      // PI Number filter
      if (appliedFilters.piNumber) {
        if (!rec.piNo.toLowerCase().includes(appliedFilters.piNumber.toLowerCase())) {
          return false;
        }
      }
      // Text search in table
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const match =
          rec.piNo.toLowerCase().includes(q) ||
          rec.supplier.toLowerCase().includes(q) ||
          rec.lcNo.toLowerCase().includes(q) ||
          rec.productType.toLowerCase().includes(q) ||
          rec.status.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [piList, appliedFilters, tableSearch]);

  // Pagination
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Open Proforma Invoice Modal (Blue printer button)
  const openPiModal = (record: PiRecord) => {
    setSelectedPi(record);
    setPiModalOpen(true);
  };

  const closePiModal = () => {
    setPiModalOpen(false);
    setSelectedPi(null);
  };

  // Open Update Landed Cost Modal (Amber pencil icon)
  const openLandedCostModal = (record: PiRecord) => {
    setEditingLandedPi(record);
    if (record.expenses) {
      setExpenseForm({ ...record.expenses });
    } else {
      setExpenseForm({
        customsDuty: 0,
        insurance: 0,
        freight: 0,
        portAndCnf: 0,
        inlandTransport: 0,
        bankCharges: 0,
        miscExpenses: 0,
      });
    }
    setAuditNotes(record.auditNotes || "");
    setLandedCostModalOpen(true);
  };

  const closeLandedCostModal = () => {
    setLandedCostModalOpen(false);
    setEditingLandedPi(null);
  };

  // Calculate Landed Cost Live Totals in Edit Modal
  const basePiTotal = useMemo(() => {
    if (!editingLandedPi) return 0;
    return editingLandedPi.items.reduce((sum, item) => sum + item.total, 0);
  }, [editingLandedPi]);

  const totalLandingExpenses = useMemo(() => {
    return (
      (Number(expenseForm.customsDuty) || 0) +
      (Number(expenseForm.insurance) || 0) +
      (Number(expenseForm.freight) || 0) +
      (Number(expenseForm.portAndCnf) || 0) +
      (Number(expenseForm.inlandTransport) || 0) +
      (Number(expenseForm.bankCharges) || 0) +
      (Number(expenseForm.miscExpenses) || 0)
    );
  }, [expenseForm]);

  const calculatedTotalLandedCost = basePiTotal + totalLandingExpenses;
  const landedFactor = basePiTotal > 0 ? calculatedTotalLandedCost / basePiTotal : 1;

  // Save Landed Cost
  const handleSaveLandedCost = () => {
    if (!editingLandedPi) return;

    setPiList((prev) =>
      prev.map((rec) => {
        if (rec.piNo === editingLandedPi.piNo) {
          const updatedItems = rec.items.map((it) => {
            const itemBaseTotal = it.total;
            const itemShare = basePiTotal > 0 ? itemBaseTotal / basePiTotal : 1 / rec.items.length;
            const itemAllocatedExpenses = totalLandingExpenses * itemShare;
            const newLandedTotal = itemBaseTotal + itemAllocatedExpenses;
            const newLandedRate = it.quantity > 0 ? newLandedTotal / it.quantity : it.rate;
            return {
              ...it,
              landedRate: newLandedRate,
              landedTotal: newLandedTotal,
            };
          });

          return {
            ...rec,
            status: "Audited",
            expenses: { ...expenseForm },
            totalLandedCost: calculatedTotalLandedCost,
            landedFactor: landedFactor,
            auditNotes,
            auditedDate: new Date().toLocaleDateString("en-GB"),
            auditedBy: "Audit Team (A. Rahman)",
            items: updatedItems,
          };
        }
        return rec;
      })
    );

    setSuccessToast(`Landed cost for PI #${editingLandedPi.piNo} updated and marked as AUDITED!`);
    setTimeout(() => setSuccessToast(null), 4000);
    closeLandedCostModal();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["PINo", "PIDate", "LcNo", "LcDate", "ShipmentDate", "Supplier", "ProductType", "Status"];
    const rows = filteredRecords.map((r) => [
      `"${r.piNo.replace(/"/g, '""')}"`,
      r.piDate,
      `"${r.lcNo.replace(/"/g, '""')}"`,
      r.lcDate,
      r.shipmentDate,
      `"${r.supplier.replace(/"/g, '""')}"`,
      `"${r.productType.replace(/"/g, '""')}"`,
      r.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `landed_cost_audit_${new Date().toISOString().slice(0, 10)}.csv`);
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
                Update Landed Cost
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procurement Workspace &gt; Audit &gt; <span className="text-[#1890ff] font-medium">Update Landed Cost</span>
              </p>
            </div>

            {successToast && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-200 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-xs animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                {successToast}
              </div>
            )}
          </div>

          {/* Top Filter Card (Matching Screenshot 1 & 3 with blue left accent bar) */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-[#1890ff] p-5 pl-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              {/* PI Date From */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  PI Date From
                </label>
                <input
                  type="date"
                  value={piDateFrom}
                  onChange={(e) => setPiDateFrom(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* PI Date To */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  PI Date To
                </label>
                <input
                  type="date"
                  value={piDateTo}
                  onChange={(e) => setPiDateTo(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* Supplier Name */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Supplier Name
                </label>
                <SearchableSelect
                  options={CURATED_SUPPLIERS.map((s) => ({ value: s, label: s }))}
                  value={supplierName}
                  onChange={(val) => setSupplierName(val)}
                  placeholder="Select supplier..."
                  className="w-full h-8 text-xs border-slate-300 dark:border-slate-700 rounded"
                />
              </div>

              {/* PI Number with Sky-blue Label */}
              <div>
                <label className="block text-[12px] font-medium text-sky-600 dark:text-sky-400 mb-1">
                  PI Number
                </label>
                <input
                  type="text"
                  value={piNumberInput}
                  onChange={(e) => setPiNumberInput(e.target.value)}
                  placeholder="Enter PI Number..."
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* SHOW button */}
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

          {/* Table Card (Matching Screenshot 1 & 3) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
            {/* Toolbar: EXCEL, PRINT, PDF, Search */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Left Buttons */}
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

              {/* Right Search Input */}
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

            {/* Main Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#d2d8df] dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-20 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[170px]">PINo</th>
                    <th className="py-2.5 px-3 w-28">PIDate</th>
                    <th className="py-2.5 px-3 min-w-[140px]">LcNo</th>
                    <th className="py-2.5 px-3 w-28">LcDate</th>
                    <th className="py-2.5 px-3 w-28">ShipmentDate</th>
                    <th className="py-2.5 px-4 min-w-[220px]">Supplier</th>
                    <th className="py-2.5 px-3 min-w-[140px]">ProductType</th>
                    <th className="py-2.5 px-3 w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                        No Proforma Invoice records found matching criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row, idx) => (
                      <tr
                        key={row.piNo}
                        className={`hover:bg-sky-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          idx % 2 === 1 ? "bg-slate-50/40 dark:bg-slate-850/40" : ""
                        }`}
                      >
                        {/* Action: Blue Printer + Amber Pencil */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Blue Printer button */}
                            <button
                              type="button"
                              onClick={() => openPiModal(row)}
                              title="Print / View Proforma Invoice"
                              className="p-1 text-[#1890ff] hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Printer className="size-4 text-[#1890ff]" />
                            </button>
                            {/* Amber Pencil Edit button */}
                            <button
                              type="button"
                              onClick={() => openLandedCostModal(row)}
                              title="Update Product Landed Cost Sheet"
                              className="p-1 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors cursor-pointer"
                            >
                              <Pencil className="size-4 text-amber-500" />
                            </button>
                          </div>
                        </td>

                        {/* PINo */}
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 font-mono text-[11px]">
                          {row.piNo}
                        </td>

                        {/* PIDate */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.piDate}</td>

                        {/* LcNo */}
                        <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                          {row.lcNo || "—"}
                        </td>

                        {/* LcDate */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.lcDate || "—"}</td>

                        {/* ShipmentDate */}
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.shipmentDate || "—"}</td>

                        {/* Supplier */}
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">{row.supplier}</td>

                        {/* ProductType */}
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{row.productType}</td>

                        {/* Status */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                              row.status === "Audited"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : row.status === "Approved"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination with Green Active Badge (Matching Screenshot 1 & 3) */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#52c41a] text-white shadow-2xs"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-[#1890ff] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: Proforma Invoice Document View (Matching Screenshot 2)         */}
      {/* ========================================================================= */}
      {piModalOpen && selectedPi && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-300">
            {/* Modal Screen-Only Action Bar */}
            <div className="print:hidden px-5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="size-4 text-[#1890ff]" />
                <span className="text-xs font-bold text-slate-800">
                  Proforma Invoice — {selectedPi.piNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#1890ff] hover:bg-sky-600 text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print PI
                </button>
                <button
                  type="button"
                  onClick={closePiModal}
                  className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet (Matching Screenshot 2 exactly) */}
            <div className="p-8 bg-white font-sans text-xs space-y-6">
              {/* Header: Green Company Title + Subtitle */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-[#52c41a] tracking-wide">
                  Pakiza Knit Composite Ltd
                </h2>
                <p className="text-[11px] text-slate-600">
                  Holding No A-1/5, Mojidpur(Boro Boli Meher), Savar, Dhaka.
                </p>
                <h3 className="text-base font-bold text-sky-500 pt-2 tracking-wide">
                  Proforma Invoice
                </h3>
              </div>

              {/* 2-Column Metadata Grid (Matching Screenshot 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-xs">
                {/* Left Column */}
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">PI No:</span>
                    <span className="flex-1 font-mono font-semibold text-slate-900">{selectedPi.piNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">LC No:</span>
                    <span className="flex-1 font-mono text-slate-800">{selectedPi.lcNo || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Supplier Name:</span>
                    <span className="flex-1 font-semibold text-slate-900">{selectedPi.supplier}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Shipment Terms:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.shipmentTerms}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">PI Validity Date:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.piValidityDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Currency:</span>
                    <span className="flex-1 font-semibold text-slate-900">{selectedPi.currency}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Port of Discharge:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.portOfDischarge}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">PI Date:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.piDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">LC Date:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.lcDate || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Shipment Date:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.shipmentDate || "—"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">PI Type:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.piType}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Product Type:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.productType}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-700">Port of Loading:</span>
                    <span className="flex-1 text-slate-800">{selectedPi.portOfLoading}</span>
                  </div>
                </div>
              </div>

              {/* PI Details Section */}
              <div className="space-y-2">
                <div className="text-xs font-semibold italic text-slate-600">PI Details</div>

                <div className="border border-slate-300">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-[#d2d8df] border-b border-slate-300 text-slate-800 font-semibold">
                        <th className="py-2 px-2.5 w-8 text-center border-r border-slate-300">#</th>
                        <th className="py-2 px-3 w-24 border-r border-slate-300">ReqNums</th>
                        <th className="py-2 px-3 min-w-[180px] border-r border-slate-300">ProductName</th>
                        <th className="py-2 px-3 w-28 border-r border-slate-300">OriginName</th>
                        <th className="py-2 px-3 min-w-[160px] border-r border-slate-300">Description</th>
                        <th className="py-2 px-3 w-28 text-right border-r border-slate-300">Quantity</th>
                        <th className="py-2 px-3 w-24 text-right border-r border-slate-300">Rate</th>
                        <th className="py-2 px-3 w-28 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedPi.items.map((item) => (
                        <tr key={item.sl}>
                          <td className="py-2.5 px-2.5 text-center font-medium border-r border-slate-300">
                            {item.sl}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-300 font-mono text-[10.5px]">
                            {item.reqNums || "—"}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-300">
                            {item.productName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 border-r border-slate-300">
                            {item.originName || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 border-r border-slate-300">
                            {item.description || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-900 border-r border-slate-300">
                            {item.quantity.toFixed(3)} {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-900 border-r border-slate-300">
                            {item.rate.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary row matching Screenshot 2 */}
                  <div className="border-t border-slate-300 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-xs">
                    {/* Remarks */}
                    <div className="p-3 text-slate-700">
                      <span className="font-bold">Remarks : </span>
                      <span>{selectedPi.remarks || "—"}</span>
                    </div>

                    {/* Right Totals Breakdown */}
                    <div className="divide-y divide-slate-200">
                      <div className="flex justify-between px-4 py-1.5 font-bold">
                        <span>Total:</span>
                        <span>
                          {selectedPi.items.reduce((s, i) => s + i.total, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-1 text-slate-600">
                        <span>Upcharge:</span>
                        <span>{selectedPi.upcharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-1 text-slate-600">
                        <span>Discount:</span>
                        <span>{selectedPi.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-4 py-1.5 bg-slate-50 font-black text-slate-900">
                        <span>Net Total:</span>
                        <span>
                          {(
                            selectedPi.items.reduce((s, i) => s + i.total, 0) +
                            selectedPi.upcharge -
                            selectedPi.discount
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Update Product Landed Cost Sheet (Amber Pencil Action)           */}
      {/* ========================================================================= */}
      {landedCostModalOpen && editingLandedPi && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <Calculator className="size-5 text-[#1890ff]" />
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Update Product Landed Cost Sheet
                  </h2>
                  <p className="text-xs text-slate-500">
                    PI #{editingLandedPi.piNo} &bull; LC #{editingLandedPi.lcNo} &bull; {editingLandedPi.supplier}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeLandedCostModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <div className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase">
                    Base PI Value
                  </div>
                  <div className="text-base font-black text-blue-900 dark:text-blue-100 mt-0.5">
                    {editingLandedPi.currency} {basePiTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold uppercase">
                    Total Landing Expenses
                  </div>
                  <div className="text-base font-black text-amber-900 dark:text-amber-100 mt-0.5">
                    {editingLandedPi.currency} {totalLandingExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">
                    Total Landed Cost
                  </div>
                  <div className="text-base font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
                    {editingLandedPi.currency} {calculatedTotalLandedCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-lg">
                  <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold uppercase">
                    Landed Cost Factor
                  </div>
                  <div className="text-base font-black text-indigo-900 dark:text-indigo-100 mt-0.5">
                    {landedFactor.toFixed(4)}x{" "}
                    <span className="text-[11px] font-medium text-indigo-600">
                      (+{((landedFactor - 1) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Landing Expenses Breakdown Form */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-slate-50/30 dark:bg-slate-850/40">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Import &amp; Landing Expenses Breakdown ({editingLandedPi.currency})</span>
                  <span className="text-[11px] font-normal text-slate-500">Auto-apportioned across line items</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Customs Duty &amp; Taxes (CD/RD/VAT/AIT)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.customsDuty}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, customsDuty: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Marine Insurance Premium
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.insurance}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, insurance: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      International Freight &amp; Shipping
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.freight}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, freight: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Port Charges &amp; C&amp;F Commission
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.portAndCnf}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, portAndCnf: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Inland Transportation &amp; Delivery
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.inlandTransport}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, inlandTransport: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Bank Charges &amp; LC Commission
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.bankCharges}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, bankCharges: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Demurrage / Inspection / Miscellaneous Expenses
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={expenseForm.miscExpenses}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, miscExpenses: parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full h-8 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none focus:border-[#1890ff]"
                    />
                  </div>
                </div>
              </div>

              {/* Itemized Landed Rate Distribution Preview */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="px-3.5 py-2 bg-[#d2d8df] dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  Item Landed Rate Calculation Preview
                </div>
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3 text-right">Quantity</th>
                      <th className="py-2 px-3 text-right">Invoice Rate</th>
                      <th className="py-2 px-3 text-right">Apportioned Exp.</th>
                      <th className="py-2 px-3 text-right font-bold text-[#1890ff]">Landed Unit Rate</th>
                      <th className="py-2 px-3 text-right font-bold">Total Landed Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                    {editingLandedPi.items.map((item) => {
                      const itemShare = basePiTotal > 0 ? item.total / basePiTotal : 1 / editingLandedPi.items.length;
                      const allocated = totalLandingExpenses * itemShare;
                      const landedTot = item.total + allocated;
                      const landedUnit = item.quantity > 0 ? landedTot / item.quantity : item.rate;

                      return (
                        <tr key={item.sl} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {item.productName}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                            {item.quantity.toFixed(2)} {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                            {item.rate.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-amber-600 font-medium">
                            +{allocated.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-[#1890ff] text-xs">
                            {landedUnit.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-slate-100">
                            {landedTot.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Audit Observations */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Notes &amp; Verification Observations
                </label>
                <textarea
                  rows={2}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Enter customs clearance references, bill of entry number, or audit remarks..."
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#1890ff] bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                type="button"
                onClick={closeLandedCostModal}
                className="px-4 py-2 text-xs font-semibold uppercase text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleSaveLandedCost}
                className="px-6 py-2 bg-[#1890ff] hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                UPDATE LANDED COST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
