import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search, Eye, Printer, ArrowLeft, Download, FileSpreadsheet,
  CheckCircle, Clock, AlertCircle, RefreshCw, Layers, FileText
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-bom")({
  head: () => ({ meta: [{ title: "BOM Sheet Report — Pakiza Knit Composite" }] }),
  component: BOMPage,
});

// ── Types ───────────────────────────────────────────────────────
interface ColorSizeBreakdown {
  color: string;
  qty8_10: number;
  qty12_14: number;
  qty16_18: number;
  qty20_22: number;
  qty24_26: number;
  total: number;
}

interface FabricDetail {
  nature: string;
  construction: string;
  composition: string;
  gsm: number;
  dia: number;
  color: string;
  uom: string;
  qty: number;
}

interface TrimDetail {
  itemName: string;
  desc: string;
  sensitivity: string;
  gmtColor: string;
  itemColor: string;
  gmtSize: string;
  itemSize: string;
  gmtQty: number;
  exPct: number;
  cons: number;
  convFact: number;
  reqQtyCons: number;
  cUom: string;
  reqQtyOdr: number;
  mUom: string;
  rate: number;
  amount: number;
  remarks: string;
  supplier: string;
}

interface StyleGroup {
  styleNo: string;
  poNo: string;
  lotNo: string;
  deliveryDate: string;
  country: string;
  items: TrimDetail[];
}

interface BOMRecord {
  id: string;
  buyer: string;
  jobNo: string;
  queryRef: string;
  opd: string;
  shipDate: string;
  totalStyle: number;
  orderQty: number;
  status: "Approved" | "Pending" | "Saved" | "Review";
  
  // Basic info for detail sheet
  brand: string;
  buyingHouse: string;
  dept: string;
  season: string;
  merchant: string;
  setRatio: number;
  leadTime: number;
  firstApprovalDate: string;
  reviseNo: string;
  reviseApDate: string;
  
  // Tables details
  sizeBreakdown: ColorSizeBreakdown[];
  fabrics: FabricDetail[];
  styleGroups: StyleGroup[];
}

// ── Mock Data ───────────────────────────────────────────────────
const SAMPLE_BOMS: BOMRecord[] = [
  {
    id: "BOM-001",
    buyer: "BONMARCHE",
    jobNo: "PKCL/12288/2026/BONMARCHE/PFD/0",
    queryRef: "25898/0",
    opd: "02/04/2026",
    shipDate: "16/08/2026",
    totalStyle: 3,
    orderQty: 12303,
    status: "Approved",
    brand: "",
    buyingHouse: "Pakiza Fashion Design",
    dept: "Ladies",
    season: "SS27",
    merchant: "Md Zubayer Hossain Khan",
    setRatio: 1,
    leadTime: 136,
    firstApprovalDate: "",
    reviseNo: "",
    reviseApDate: "",
    sizeBreakdown: [
      { color: "PINK", qty8_10: 352, qty12_14: 1338, qty16_18: 1382, qty20_22: 913, qty24_26: 416, total: 4401 },
      { color: "PINK", qty8_10: 316, qty12_14: 1412, qty16_18: 1264, qty20_22: 642, qty24_26: 317, total: 3951 },
      { color: "PINK", qty8_10: 316, qty12_14: 1412, qty16_18: 1264, qty20_22: 642, qty24_26: 317, total: 3951 }
    ],
    fabrics: [
      { nature: "Knit", construction: "Imported Fabrics", composition: "Imported Fabrics", gsm: 180, dia: 63, color: "PINK", uom: "Kg", qty: 4595.72 }
    ],
    styleGroups: [
      {
        styleNo: "9013156",
        poNo: "954378",
        lotNo: "",
        deliveryDate: "16/08/2026",
        country: "United Kingdom",
        items: [
          { itemName: "All Trims", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4620.00, cUom: "SET", reqQtyOdr: 385.00, mUom: "SET", rate: 1.000, amount: 385.00, remarks: "", supplier: "" },
          { itemName: "Back Board", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4620.00, cUom: "Dzn", reqQtyOdr: 385.00, mUom: "Dzn", rate: 0.300, amount: 115.50, remarks: "", supplier: "" },
          { itemName: "Care Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.070, amount: 27.02, remarks: "", supplier: "" },
          { itemName: "CAROLIN INTERLING (D5026)", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Yards", reqQtyOdr: 386.00, mUom: "Yards", rate: 0.050, amount: 19.30, remarks: "", supplier: "" },
          { itemName: "Carton", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4620.00, cUom: "PCS", reqQtyOdr: 385.00, mUom: "PCS", rate: 0.700, amount: 269.50, remarks: "", supplier: "" },
          { itemName: "Carton Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "PCS", reqQtyOdr: 386.00, mUom: "PCS", rate: 0.060, amount: 23.16, remarks: "", supplier: "" },
          { itemName: "Gum Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "PCS", reqQtyOdr: 386.00, mUom: "PCS", rate: 0.030, amount: 11.58, remarks: "", supplier: "" },
          { itemName: "Hang Tag", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.080, amount: 30.88, remarks: "", supplier: "" },
          { itemName: "Hang Tag Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.060, amount: 23.16, remarks: "", supplier: "" },
          { itemName: "Hanger", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 1.160, amount: 447.76, remarks: "", supplier: "" },
          { itemName: "Hanger Loop", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.120, amount: 46.32, remarks: "", supplier: "" },
          { itemName: "Main Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.070, amount: 27.02, remarks: "", supplier: "" },
          { itemName: "Mobilon Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "KG", reqQtyOdr: 386.00, mUom: "KG", rate: 0.040, amount: 15.44, remarks: "", supplier: "" },
          { itemName: "Poly Bag", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.300, amount: 115.80, remarks: "", supplier: "" },
          { itemName: "Poly Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.060, amount: 23.16, remarks: "", supplier: "" },
          { itemName: "Sewing Thread", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 320.0000, convFact: 4000.0000, reqQtyCons: 1480000.00, cUom: "CONE", reqQtyOdr: 370.00, mUom: "CONE", rate: 0.600, amount: 222.00, remarks: "", supplier: "" },
          { itemName: "Size Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.060, amount: 23.16, remarks: "", supplier: "" },
          { itemName: "Tag Pin", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 4401.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4632.00, cUom: "Dzn", reqQtyOdr: 386.00, mUom: "Dzn", rate: 0.040, amount: 15.44, remarks: "", supplier: "" }
        ]
      },
      {
        styleNo: "9013158 - Btm",
        poNo: "954381",
        lotNo: "",
        deliveryDate: "16/08/2026",
        country: "United Kingdom",
        items: [
          { itemName: "Care Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.070, amount: 24.22, remarks: "", supplier: "" },
          { itemName: "CAROLIN INTERLING (D5026)", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Yards", reqQtyOdr: 346.00, mUom: "Yards", rate: 0.050, amount: 17.30, remarks: "", supplier: "" },
          { itemName: "Elastic", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.2000, convFact: 12.0000, reqQtyCons: 4980.00, cUom: "Yards", reqQtyOdr: 415.00, mUom: "Yards", rate: 0.400, amount: 166.00, remarks: "", supplier: "" },
          { itemName: "Gum Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "PCS", reqQtyOdr: 346.00, mUom: "PCS", rate: 0.030, amount: 10.38, remarks: "", supplier: "" },
          { itemName: "Hanger Loop", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.120, amount: 41.52, remarks: "", supplier: "" },
          { itemName: "Main Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.070, amount: 24.22, remarks: "", supplier: "" },
          { itemName: "Mobilon Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "KG", reqQtyOdr: 346.00, mUom: "KG", rate: 0.040, amount: 13.84, remarks: "", supplier: "" },
          { itemName: "Sewing Thread", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 320.0000, convFact: 4000.0000, reqQtyCons: 1328000.00, cUom: "CONE", reqQtyOdr: 332.00, mUom: "CONE", rate: 0.550, amount: 182.60, remarks: "", supplier: "" },
          { itemName: "Size Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.060, amount: 20.76, remarks: "", supplier: "" },
          { itemName: "Tag Pin", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.040, amount: 13.84, remarks: "", supplier: "" }
        ]
      },
      {
        styleNo: "9013158 - Top",
        poNo: "954381",
        lotNo: "",
        deliveryDate: "16/08/2026",
        country: "United Kingdom",
        items: [
          { itemName: "Back Board", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 1.000, amount: 346.00, remarks: "", supplier: "" },
          { itemName: "Care Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.070, amount: 24.22, remarks: "", supplier: "" },
          { itemName: "CAROLIN INTERLING (D5026)", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Yards", reqQtyOdr: 346.00, mUom: "Yards", rate: 0.050, amount: 17.30, remarks: "", supplier: "" },
          { itemName: "Carton", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "PCS", reqQtyOdr: 346.00, mUom: "PCS", rate: 0.650, amount: 224.90, remarks: "", supplier: "" },
          { itemName: "Carton Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "PCS", reqQtyOdr: 346.00, mUom: "PCS", rate: 0.060, amount: 20.76, remarks: "", supplier: "" },
          { itemName: "Gum Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "PCS", reqQtyOdr: 346.00, mUom: "PCS", rate: 0.030, amount: 10.38, remarks: "", supplier: "" },
          { itemName: "Hang Tag", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.080, amount: 27.68, remarks: "", supplier: "" },
          { itemName: "Hang Tag Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.060, amount: 20.76, remarks: "", supplier: "" },
          { itemName: "Hanger", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 1.160, amount: 401.36, remarks: "", supplier: "" },
          { itemName: "Hanger Loop", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.120, amount: 41.52, remarks: "", supplier: "" },
          { itemName: "Main Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.070, amount: 24.22, remarks: "", supplier: "" },
          { itemName: "Mobilon Tape", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "KG", reqQtyOdr: 346.00, mUom: "KG", rate: 0.040, amount: 13.84, remarks: "", supplier: "" },
          { itemName: "Poly Bag", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.300, amount: 103.80, remarks: "", supplier: "" },
          { itemName: "Poly Sticker", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.060, amount: 20.76, remarks: "", supplier: "" },
          { itemName: "Sewing Thread", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 320.0000, convFact: 4000.0000, reqQtyCons: 1328000.00, cUom: "CONE", reqQtyOdr: 332.00, mUom: "CONE", rate: 0.550, amount: 182.60, remarks: "", supplier: "" },
          { itemName: "Size Label", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.060, amount: 20.76, remarks: "", supplier: "" },
          { itemName: "Tag Pin", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 3951.00, exPct: 5.00, cons: 1.0000, convFact: 12.0000, reqQtyCons: 4152.00, cUom: "Dzn", reqQtyOdr: 346.00, mUom: "Dzn", rate: 0.040, amount: 13.84, remarks: "", supplier: "" }
        ]
      }
    ]
  },
  {
    id: "BOM-002",
    buyer: "Pako",
    jobNo: "PKCL/12353/2026/Pako/PHYSICS SOURCING BD LTD/0",
    queryRef: "26052/0",
    opd: "22/04/2026",
    shipDate: "10/09/2026",
    totalStyle: 6,
    orderQty: 5900,
    status: "Pending",
    brand: "", buyingHouse: "Physics Sourcing BD", dept: "Kids", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 140, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-003",
    buyer: "DPAM",
    jobNo: "PKCL/12366/2026/DPAM/SeRGeNT MaJoR/0",
    queryRef: "26061/0",
    opd: "25/04/2026",
    shipDate: "19/08/2026",
    totalStyle: 1,
    orderQty: 2808,
    status: "Approved",
    brand: "", buyingHouse: "Sergent Major", dept: "Ladies", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 116, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-004",
    buyer: "DPAM",
    jobNo: "PKCL/12376/2026/DPAM/SeRGeNT MaJoR/0",
    queryRef: "26078/0",
    opd: "25/04/2026",
    shipDate: "19/08/2026",
    totalStyle: 2,
    orderQty: 5078,
    status: "Approved",
    brand: "", buyingHouse: "Sergent Major", dept: "Ladies", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 116, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-005",
    buyer: "Premier",
    jobNo: "PKCL/12388/2026/Premier//0",
    queryRef: "26115/1",
    opd: "02/05/2026",
    shipDate: "15/08/2026",
    totalStyle: 5,
    orderQty: 11520,
    status: "Approved",
    brand: "", buyingHouse: "Premier House", dept: "Mens", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 105, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-006",
    buyer: "DPAM",
    jobNo: "PKCL/12396/2026/DPAM/SeRGeNT MaJoR/0",
    queryRef: "26118/0",
    opd: "02/05/2026",
    shipDate: "30/09/2026",
    totalStyle: 2,
    orderQty: 7737,
    status: "Approved",
    brand: "", buyingHouse: "Sergent Major", dept: "Kids", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 151, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-007",
    buyer: "Premier",
    jobNo: "PKCL/12402/2026/Premier//0",
    queryRef: "26145/0",
    opd: "05/05/2026",
    shipDate: "20/08/2026",
    totalStyle: 2,
    orderQty: 3024,
    status: "Saved",
    brand: "", buyingHouse: "Premier House", dept: "Mens", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 107, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-008",
    buyer: "Ernsting's Family",
    jobNo: "PKCL/12404/2026/Ernsting.s Family/OTTO INTERNATIONAL/0",
    queryRef: "26142/1",
    opd: "05/05/2026",
    shipDate: "27/08/2026",
    totalStyle: 3,
    orderQty: 15200,
    status: "Review",
    brand: "", buyingHouse: "Otto International", dept: "Kids", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 114, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-009",
    buyer: "Ernsting's Family",
    jobNo: "PKCL/12414/2026/Ernsting.s Family/OTTO INTERNATIONAL/0",
    queryRef: "26163/0",
    opd: "10/05/2026",
    shipDate: "29/08/2026",
    totalStyle: 9,
    orderQty: 79700,
    status: "Pending",
    brand: "", buyingHouse: "Otto International", dept: "Kids", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 111, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  },
  {
    id: "BOM-010",
    buyer: "ADAPT RETAILING CO.LTD JAPAN",
    jobNo: "PKCL/12418/2026/ADAPT RETAILING CO.LTD JAPAN/HODO/0",
    queryRef: "26107/0",
    opd: "09/05/2026",
    shipDate: "08/08/2026",
    totalStyle: 12,
    orderQty: 68549,
    status: "Approved",
    brand: "", buyingHouse: "HODO", dept: "Ladies", season: "SS27", merchant: "Md Zubayer", setRatio: 1, leadTime: 91, firstApprovalDate: "", reviseNo: "", reviseApDate: "",
    sizeBreakdown: [], fabrics: [], styleGroups: []
  }
];

// Helper formatting functions
const formatNumber = (num: number, decimalPlaces = 2) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

export default function BOMPage() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [activeBom, setActiveBom] = useState<BOMRecord | null>(null);
  
  // Filtering states
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2027-02-02");
  const [buyerName, setBuyerName] = useState("ALL");
  const [styleName, setStyleName] = useState("ALL");
  const [queryNo, setQueryNo] = useState("");
  const [jobNo, setJobNo] = useState("");
  const [status, setStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter records
  const filteredBoms = useMemo(() => {
    return SAMPLE_BOMS.filter((b) => {
      const matchBuyer = buyerName === "ALL" || b.buyer.toLowerCase() === buyerName.toLowerCase();
      const matchStatus = status === "ALL" || b.status.toLowerCase() === status.toLowerCase();
      const matchQuery = !queryNo.trim() || b.queryRef.toLowerCase().includes(queryNo.toLowerCase());
      const matchJob = !jobNo.trim() || b.jobNo.toLowerCase().includes(jobNo.toLowerCase());
      
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm.trim() ||
        b.buyer.toLowerCase().includes(searchLower) ||
        b.jobNo.toLowerCase().includes(searchLower) ||
        b.queryRef.toLowerCase().includes(searchLower);

      return matchBuyer && matchStatus && matchQuery && matchJob && matchSearch;
    });
  }, [buyerName, status, queryNo, jobNo, searchTerm]);

  // Calculations for active BOM Sheet
  const activeCalculations = useMemo(() => {
    if (!activeBom) return null;
    
    // Size breakdown totals
    const sizeTotal = activeBom.sizeBreakdown.reduce((sum, s) => sum + s.total, 0);
    
    // Fabric totals
    const fabricTotalQty = activeBom.fabrics.reduce((sum, f) => sum + f.qty, 0);
    
    // Trims groups subtotals & grand totals
    const groupsWithTotals = activeBom.styleGroups.map(group => {
      const totalReqQtyCons = group.items.reduce((sum, item) => sum + item.reqQtyCons, 0);
      const totalAmount = group.items.reduce((sum, item) => sum + item.amount, 0);
      return {
        ...group,
        totalReqQtyCons,
        totalAmount
      };
    });

    const grandTotalReqQtyCons = groupsWithTotals.reduce((sum, g) => sum + g.totalReqQtyCons, 0);
    const grandTotalAmount = groupsWithTotals.reduce((sum, g) => sum + g.totalAmount, 0);

    return {
      sizeTotal,
      fabricTotalQty,
      groupsWithTotals,
      grandTotalReqQtyCons,
      grandTotalAmount
    };
  }, [activeBom]);

  const viewDetails = (bom: BOMRecord) => {
    // Standard ERP Detail view for BOM-001 or fallback
    if (bom.id === "BOM-001") {
      setActiveBom(SAMPLE_BOMS[0]);
    } else {
      // populate dummy details for other records to make it highly interactive
      setActiveBom({
        ...bom,
        brand: "N/A",
        buyingHouse: bom.buyer + " Partner",
        dept: "Gents",
        season: "SS27",
        merchant: "Md Zubayer Hossain Khan",
        setRatio: 1,
        leadTime: 120,
        firstApprovalDate: "",
        reviseNo: "",
        reviseApDate: "",
        sizeBreakdown: [
          { color: "BLUE", qty8_10: 100, qty12_14: 400, qty16_18: 500, qty20_22: 300, qty24_26: 200, total: 1500 }
        ],
        fabrics: [
          { nature: "Knit", construction: "Exported Fabric", composition: "Cotton Blend", gsm: 160, dia: 60, color: "BLUE", uom: "Kg", qty: 2500 }
        ],
        styleGroups: [
          {
            styleNo: "Style Dummy A",
            poNo: "PO-7788",
            lotNo: "",
            deliveryDate: bom.shipDate,
            country: "Germany",
            items: [
              { itemName: "All Trims", desc: "", sensitivity: "No Sensitivity", gmtColor: "", itemColor: "", gmtSize: "All Size", itemSize: "All Size", gmtQty: 1500, exPct: 5, cons: 1, convFact: 12, reqQtyCons: 1575, cUom: "SET", reqQtyOdr: 131.25, mUom: "SET", rate: 1.20, amount: 157.50, remarks: "", supplier: "" }
            ]
          }
        ]
      });
    }
    setView("detail");
  };

  const getRowBgColor = (status: BOMRecord["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50/25 hover:bg-emerald-50/50 text-slate-800";
      case "Pending":
        return "bg-blue-50/25 hover:bg-blue-50/50 text-slate-800";
      case "Review":
        return "bg-amber-50/25 hover:bg-amber-50/50 text-slate-800";
      default:
        return "bg-slate-50/50 hover:bg-slate-100/70 text-slate-800";
    }
  };

  const getStatusBadge = (status: BOMRecord["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="size-2.5" /> Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="size-2.5" /> Pending
          </span>
        );
      case "Review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
            <RefreshCw className="size-2.5" /> Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-350">
            <AlertCircle className="size-2.5" /> Saved
          </span>
        );
    }
  };

  return (
    <MerchandisingLayout activePath="bill-of-materials" breadcrumbs={[{ label: "BOM Sheet Report" }]} title="BOM Sheet Report">
      <div className="bg-slate-50 dark:bg-slate-950 min-h-full">
        
        {/* ══════════ LIST VIEW ══════════ */}
        {view === "list" && (
          <div className="p-4 md:p-6 space-y-4">
            
            {/* Filter Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">From Date</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300/35 focus:border-indigo-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">To Date</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300/35 focus:border-indigo-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Buyer Name</label>
                  <select value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                    <option value="ALL">ALL</option>
                    <option value="BONMARCHE">BONMARCHE</option>
                    <option value="Pako">Pako</option>
                    <option value="DPAM">DPAM</option>
                    <option value="Premier">Premier</option>
                    <option value="Ernsting's Family">Ernsting's Family</option>
                    <option value="ADAPT RETAILING CO.LTD JAPAN">ADAPT RETAILING CO.LTD JAPAN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Style Name</label>
                  <select value={styleName} onChange={(e) => setStyleName(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                    <option value="ALL">ALL</option>
                    <option value="9013156">9013156</option>
                    <option value="9013158 - Btm">9013158 - Btm</option>
                    <option value="9013158 - Top">9013158 - Top</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Query No</label>
                  <input type="text" placeholder="Enter query number..." value={queryNo} onChange={(e) => setQueryNo(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Job No</label>
                  <input type="text" placeholder="Enter job number..." value={jobNo} onChange={(e) => setJobNo(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer font-medium">
                    <option value="ALL">ALL</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Review">Review</option>
                    <option value="Saved">Saved</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wide">
                    <Search className="size-3.5" /> Search
                  </button>
                </div>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 cursor-pointer transition uppercase"><FileSpreadsheet className="size-3.5"/> Excel</button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 cursor-pointer transition uppercase"><Printer className="size-3.5"/> Print</button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 cursor-pointer transition uppercase"><Download className="size-3.5"/> PDF</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-450 font-bold">Search:</span>
                <input type="text" placeholder="Global search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white w-full sm:w-60" />
              </div>
            </div>

            {/* BOM Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-[10px] font-black uppercase text-slate-450 text-left w-12">∇</th>
                      {["Buyer", "Job No", "Query Ref.", "OPD", "Ship Date", "Total Style", "Order Qty(pcs)", "AP Status"].map((h, i) => (
                        <th key={i} className="px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredBoms.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-400 font-medium bg-slate-50/20">No matching BOM Sheet reports found</td>
                      </tr>
                    ) : (
                      filteredBoms.map((r) => (
                        <tr key={r.id} className={`${getRowBgColor(r.status)} border-b border-slate-150 transition-colors`}>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => viewDetails(r)} className="p-1.5 rounded-lg bg-white hover:bg-indigo-650 hover:text-white text-indigo-600 border border-slate-200 shadow-xs cursor-pointer transition duration-200" title="View details">
                              <Eye className="size-3.5" />
                            </button>
                          </td>
                          <td className="px-4 py-2.5 font-black text-slate-900">{r.buyer}</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-indigo-900">{r.jobNo}</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-slate-650">{r.queryRef}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-700">{r.opd}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-700">{r.shipDate}</td>
                          <td className="px-4 py-2.5 text-center font-black text-slate-800">{r.totalStyle}</td>
                          <td className="px-4 py-2.5 font-mono font-black text-indigo-650">{r.orderQty.toLocaleString()}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex justify-center">
                              {getStatusBadge(r.status)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-semibold">Showing {filteredBoms.length} of {SAMPLE_BOMS.length} entries</span>
                <span className="text-[11px] text-slate-500 font-semibold font-mono">Page 1 of 36</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ DETAIL VIEW ══════════ */}
        {view === "detail" && activeBom && activeCalculations && (
          <div className="p-3 md:p-6 max-w-[1500px] mx-auto pb-24">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 mb-4 print:hidden shadow-xs">
              <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-xs font-bold text-slate-650 hover:text-slate-900 cursor-pointer transition">
                <ArrowLeft className="size-4" /> Back to BOM List
              </button>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                  <Printer className="size-3.5" /> Print BOM
                </button>
              </div>
            </div>

            {/* Printable accessories BOM sheet document wrapper */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 md:p-8 space-y-6 text-[10.5px] text-slate-800 leading-relaxed max-w-full mx-auto print:border-none print:shadow-none print:p-0">
              
              {/* Header block with Logo */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-indigo-600 flex flex-col items-center justify-center text-white font-black text-[12px] shadow-sm select-none shrink-0">
                    <span className="tracking-widest">PK</span>
                    <span className="text-[7px] text-indigo-200 uppercase font-bold tracking-tight">Knit</span>
                  </div>
                  <div>
                    <h1 className="text-[13px] font-black text-slate-900 leading-tight uppercase">Pakiza Knit Composite Ltd</h1>
                    <p className="text-[9px] text-slate-500 font-semibold leading-normal">Holding No A-1/5, Mojidpur(Boro Boli Meher), Savar, Dhaka.</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-black text-slate-850 uppercase tracking-widest leading-none">BOM Sheet</h2>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-widest mt-1">Accessories Bill of Materials</p>
                </div>
              </div>

              {/* Middle Grid: Basic Information Table + Mockup Sketch Frame */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Basic Information */}
                <div className="col-span-12 md:col-span-9 flex flex-col">
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                    Basic Information
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white flex-1">
                    <table className="w-full text-[10px] text-slate-700">
                      <tbody>
                        <tr className="border-b border-slate-150">
                          <td className="w-32 bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Job No</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.jobNo}</td>
                          <td className="w-32 bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Buyer</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.buyer}</td>
                          <td className="w-32 bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Brand</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.brand || "—"}</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Buying House</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.buyingHouse}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Style Name</td>
                          <td className="px-3 py-2 font-bold text-slate-850 truncate max-w-[200px]" title={activeBom.styleGroups.map(s => s.styleNo).join(", ")}>{activeBom.styleGroups.map(s => s.styleNo).join(", ")}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Merchant</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.merchant}</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Dept</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.dept}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Season</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.season}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Set Ratio</td>
                          <td className="px-3 py-2 font-bold text-slate-800 font-mono">{activeBom.setRatio}</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Order Quantity (Pcs)</td>
                          <td className="px-3 py-2 font-black text-slate-800 font-mono">{activeBom.orderQty.toLocaleString()}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">PO Recv Date</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.opd}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Delivery Date</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.shipDate}</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Lead Time</td>
                          <td className="px-3 py-2 font-bold text-slate-800 font-mono">{activeBom.leadTime} Days</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Order No</td>
                          <td colSpan={3} className="px-3 py-2 font-mono font-bold text-slate-800">PKCL/{activeBom.jobNo.split("/")[1] || "12288"}/2026/{activeBom.buyer}/PFD</td>
                        </tr>
                        <tr>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">1st Approval Date</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.firstApprovalDate || "—"}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Revise No</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.reviseNo || "—"}</td>
                          <td className="bg-slate-50/50 px-3 py-2 font-black text-slate-500 uppercase tracking-wider text-[8px]">Revise AP. Date</td>
                          <td className="px-3 py-2 font-bold text-slate-800">{activeBom.reviseApDate || "—"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mockup Sketch Frame */}
                <div className="col-span-12 md:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50/35 relative overflow-hidden group min-h-[160px]">
                  <div className="absolute top-2 left-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Sketch Image</div>
                  <img
                    src="/src/components/0330c3d6-5cae-49e0-b777-d34891afcc09.jpg"
                    alt="BOM Style Mockup"
                    className="max-h-[140px] object-contain rounded-xl shadow-xs"
                    onError={(e) => {
                      // fallback to standard text mockup if file doesn't exist
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="flex flex-col items-center text-slate-400 font-bold text-center pointer-events-none mt-1">
                    <FileText className="size-7 mb-1 stroke-1 text-slate-350" />
                    <span className="text-[8px] uppercase tracking-wider">Garments Night Dress Mockup</span>
                  </div>
                </div>
              </div>

              {/* Section: Color Size Wise Breakdown */}
              {activeBom.sizeBreakdown.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                    Color Size Wise Breakdown
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                    <table className="w-full text-[10px] text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-3 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">Gmt Item</th>
                          <th className="px-3 py-2 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">Color</th>
                          <th className="px-3 py-2 text-center font-black text-slate-500 uppercase tracking-wider text-[8px] w-20">8/10</th>
                          <th className="px-3 py-2 text-center font-black text-slate-500 uppercase tracking-wider text-[8px] w-20">12/14</th>
                          <th className="px-3 py-2 text-center font-black text-slate-500 uppercase tracking-wider text-[8px] w-20">16/18</th>
                          <th className="px-3 py-2 text-center font-black text-slate-500 uppercase tracking-wider text-[8px] w-20">20/22</th>
                          <th className="px-3 py-2 text-center font-black text-slate-500 uppercase tracking-wider text-[8px] w-20">24/26</th>
                          <th className="px-3 py-2 text-right font-black text-slate-500 uppercase tracking-wider text-[8px] w-28">Total (Pcs)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeBom.sizeBreakdown.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-1.5 font-bold text-slate-900">Night Dress</td>
                            <td className="px-3 py-1.5 font-semibold text-rose-700">{row.color}</td>
                            <td className="px-3 py-1.5 text-center font-mono font-medium">{row.qty8_10.toLocaleString()}</td>
                            <td className="px-3 py-1.5 text-center font-mono font-medium">{row.qty12_14.toLocaleString()}</td>
                            <td className="px-3 py-1.5 text-center font-mono font-medium">{row.qty16_18.toLocaleString()}</td>
                            <td className="px-3 py-1.5 text-center font-mono font-medium">{row.qty20_22.toLocaleString()}</td>
                            <td className="px-3 py-1.5 text-center font-mono font-medium">{row.qty24_26.toLocaleString()}</td>
                            <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-850">{row.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                          <td colSpan={7} className="px-3 py-2 text-left">Item Total:</td>
                          <td className="px-3 py-2 text-right font-mono text-indigo-600">{activeCalculations.sizeTotal.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-slate-50 font-black border-t border-slate-100 text-[10px] text-slate-800">
                          <td colSpan={7} className="px-3 py-2 text-left">Order Total:</td>
                          <td className="px-3 py-2 text-right font-mono text-indigo-600">{activeCalculations.sizeTotal.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Section: Fabric Details */}
              {activeBom.fabrics.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                    Fabric Details
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                    <table className="w-full text-[10px] text-slate-700">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          {["Fabric Nature", "Construction", "Composition", "GSM", "Dia", "Fabric Color", "Fab UOM", "Finish Fab Qty"].map((h, i) => (
                            <th key={i} className="px-3 py-2.5 text-left font-black text-slate-500 uppercase tracking-wider text-[8px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeBom.fabrics.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2 font-bold text-slate-900">{row.nature}</td>
                            <td className="px-3 py-2">{row.construction}</td>
                            <td className="px-3 py-2">{row.composition}</td>
                            <td className="px-3 py-2 font-mono font-medium">{row.gsm}</td>
                            <td className="px-3 py-2 font-mono font-medium">{row.dia}</td>
                            <td className="px-3 py-2 font-semibold text-rose-700">{row.color}</td>
                            <td className="px-3 py-2 font-bold">{row.uom}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-indigo-650">{formatNumber(row.qty)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-black border-t border-slate-200 text-[10px] text-slate-800">
                          <td colSpan={7} className="px-3 py-2 text-left">Total</td>
                          <td className="px-3 py-2 text-right font-mono text-indigo-600">{formatNumber(activeCalculations.fabricTotalQty)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Section: Trims & Accessories Details (Sewing Items) */}
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-indigo-500 rounded-xs inline-block"></span>
                  Trims & Accessories Details (Sewing Items)
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                  <table className="w-full text-[9px] text-slate-700 whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-250 font-black text-slate-500 uppercase tracking-wider text-[8px]">
                        <th className="px-2 py-2 text-left">Gmt Item</th>
                        <th className="px-2 py-2 text-left">Item Name</th>
                        <th className="px-2 py-2 text-left">Item Description</th>
                        <th className="px-2 py-2 text-left">Sensitivity Type</th>
                        <th className="px-2 py-2 text-left">Gmt Color</th>
                        <th className="px-2 py-2 text-left">Item Color</th>
                        <th className="px-2 py-2 text-left">Gmt Size</th>
                        <th className="px-2 py-2 text-left">Item Size</th>
                        <th className="px-2 py-2 text-right">Gmt Qty</th>
                        <th className="px-2 py-2 text-right">Ex%</th>
                        <th className="px-2 py-2 text-right">Consumption</th>
                        <th className="px-2 py-2 text-right">Conv.Fact.</th>
                        <th className="px-2 py-2 text-right">Req. Qty (Cons)</th>
                        <th className="px-2 py-2 text-left">C.UOM</th>
                        <th className="px-2 py-2 text-right">Req. Qty (M.Odr)</th>
                        <th className="px-2 py-2 text-left">M.UOM</th>
                        <th className="px-2 py-2 text-right">Rate</th>
                        <th className="px-2 py-2 text-right">B.Amount</th>
                        <th className="px-2 py-2 text-left">Remarks</th>
                        <th className="px-2 py-2 text-left">Nominated Supplier</th>
                        <th className="px-2 py-2 text-center">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCalculations.groupsWithTotals.map((group, gIdx) => (
                        <React.Fragment key={gIdx}>
                          {/* Group Sub-Header Row */}
                          <tr className="bg-slate-100/75 border-y border-slate-200">
                            <td colSpan={21} className="px-3 py-1.5 font-black text-slate-800 text-[9px] uppercase tracking-wider">
                              Style : <span className="text-indigo-650">{group.styleNo}</span>
                              <span className="mx-3 text-slate-350">|</span>
                              PO : <span className="text-slate-600">{group.poNo}</span>
                              <span className="mx-3 text-slate-350">|</span>
                              Lot No : <span className="text-slate-600">{group.lotNo || "—"}</span>
                              <span className="mx-3 text-slate-350">|</span>
                              Delivery Date : <span className="text-slate-600">{group.deliveryDate}</span>
                              <span className="mx-3 text-slate-350">|</span>
                              Country : <span className="text-rose-700">{group.country}</span>
                            </td>
                          </tr>
                          
                          {/* Group Rows */}
                          {group.items.map((item, iIdx) => (
                            <tr key={iIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="px-2 py-1.5 font-bold text-slate-900">Night Dress</td>
                              <td className="px-2 py-1.5 font-semibold text-slate-800">{item.itemName}</td>
                              <td className="px-2 py-1.5 text-slate-450">{item.desc || "—"}</td>
                              <td className="px-2 py-1.5 text-slate-600">{item.sensitivity}</td>
                              <td className="px-2 py-1.5">{item.gmtColor || "—"}</td>
                              <td className="px-2 py-1.5">{item.itemColor || "—"}</td>
                              <td className="px-2 py-1.5">{item.gmtSize}</td>
                              <td className="px-2 py-1.5">{item.itemSize}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-medium">{formatNumber(item.gmtQty, 2)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-medium">{formatNumber(item.exPct, 2)}%</td>
                              <td className="px-2 py-1.5 text-right font-mono font-semibold text-slate-600">{formatNumber(item.cons, 4)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-semibold text-slate-600">{formatNumber(item.convFact, 4)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-black text-slate-800">{formatNumber(item.reqQtyCons, 2)}</td>
                              <td className="px-2 py-1.5 font-bold text-slate-600">{item.cUom}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-850">{formatNumber(item.reqQtyOdr, 2)}</td>
                              <td className="px-2 py-1.5 font-bold text-slate-600">{item.mUom}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-800">$ {formatNumber(item.rate, 3)}</td>
                              <td className="px-2 py-1.5 text-right font-mono font-black text-indigo-650">$ {formatNumber(item.amount, 2)}</td>
                              <td className="px-2 py-1.5 text-slate-450">{item.remarks || "—"}</td>
                              <td className="px-2 py-1.5 font-semibold text-slate-650">{item.supplier || "—"}</td>
                              <td className="px-2 py-1.5 text-center text-slate-400">
                                <span className="text-[8px] font-bold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">None</span>
                              </td>
                            </tr>
                          ))}

                          {/* Group Subtotal Row */}
                          <tr className="bg-slate-50/70 border-b-2 border-slate-250 font-black text-[9.5px]">
                            <td colSpan={12} className="px-3 py-2 text-left">Subtotal</td>
                            <td className="px-3 py-2 text-right font-mono text-slate-800">{formatNumber(group.totalReqQtyCons, 2)}</td>
                            <td colSpan={4}/>
                            <td className="px-3 py-2 text-right font-mono text-indigo-650">$ {formatNumber(group.totalAmount, 2)}</td>
                            <td colSpan={3}/>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                    <tfoot>
                      {/* Grand Total Row */}
                      <tr className="bg-slate-100 font-black border-t-2 border-slate-350 text-[10px] text-slate-850">
                        <td colSpan={12} className="px-3 py-2.5 text-left uppercase tracking-wider">Grand Total</td>
                        <td className="px-3 py-2.5 text-right font-mono text-indigo-600">{formatNumber(activeCalculations.grandTotalReqQtyCons, 2)}</td>
                        <td colSpan={4}/>
                        <td className="px-3 py-2.5 text-right font-mono text-indigo-600">$ {formatNumber(activeCalculations.grandTotalAmount, 2)}</td>
                        <td colSpan={3}/>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}
