import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesEstimationRecord,
  MMAccessoriesEstimationRow,
  MMAccessoriesSizeSpecRow,
  MMAccessoriesColorMappingRow,
  MMMainOrder,
  MMPreCosting,
  MMPreCostItem,
  INITIAL_MM_ORDERS,
  INITIAL_MM_PRE_COSTINGS,
} from "../lib/marketing-merchandising-data";
import {
  Plus,
  Search,
  Save,
  ArrowLeft,
  X,
  AlertCircle,
  Check,
  Package,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface AccessoriesEstimationSearchParams {
  orderId?: string;
  ref?: string;
}

export const Route = createFileRoute("/mm-accessories-estimation")({
  validateSearch: (search: Record<string, unknown>): AccessoriesEstimationSearchParams => ({
    orderId: (search.orderId as string) || undefined,
    ref: (search.ref as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Accessories Estimation — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise Accessories Estimation Form with Pre Costing and Job ID lookups, sizewise specification, color mapping, and Local Storage persistence.",
      },
    ],
  }),
  component: AccessoriesEstimationRoute,
});

// Master Options for dropdowns as requested
export interface MasterAccessoryItem {
  code: string;
  name: string;
  category: string;
  defaultUnit: string;
  description: string;
}

export const MASTER_ACCESSORY_ITEMS: MasterAccessoryItem[] = [
  { code: "ACC-BTN-01", name: "Button", category: "Fasteners & Buttons", defaultUnit: "Gross", description: "18L / 24L 4-Hole Horn / Polyester Button" },
  { code: "ACC-THD-01", name: "Sewing Thread", category: "Sewing Trims", defaultUnit: "Cones", description: "100% Spun Poly 40/2 & 50/2 (5000m/Cone)" },
  { code: "ACC-LBL-01", name: "Main Label", category: "Branding & Labels", defaultUnit: "Pcs", description: "Woven Damask Brand Main Label Center Fold" },
  { code: "ACC-LBL-02", name: "Care Label", category: "Branding & Labels", defaultUnit: "Pcs", description: "Printed Satin Wash & Care Instruction Label" },
  { code: "ACC-PLB-01", name: "Poly Bag", category: "Packaging Trims", defaultUnit: "Pcs", description: "Self Adhesive PP Poly Bag with Warning (28x38 cm)" },
  { code: "ACC-ZIP-01", name: "Zipper", category: "Fasteners & Closures", defaultUnit: "Pcs", description: "Nylon Coil #5 Closed End Metal Puller Zipper" },
  { code: "ACC-HTG-01", name: "Hang Tag", category: "Branding & Labels", defaultUnit: "Pcs", description: "350 GSM Art Card Brand Hang Tag with String" },
  { code: "ACC-ELT-01", name: "Elastic Tape", category: "Elastic & Tapes", defaultUnit: "Rolls", description: "1.5\" Knitted Jacquard Waistband Elastic Tape" },
  { code: "ACC-LBL-03", name: "Size Label", category: "Branding & Labels", defaultUnit: "Pcs", description: "Woven Size Label Loop Fold (XS, S, M, L, XL)" },
  { code: "ACC-TAG-02", name: "Price Tag", category: "Packaging Trims", defaultUnit: "Pcs", description: "Thermal Barcode Printable Adhesive Retail Tag" },
  { code: "ACC-TAP-01", name: "Twill Tape", category: "Elastic & Tapes", defaultUnit: "Mtr", description: "100% Cotton Herringbone Neck Binding Tape" },
  { code: "ACC-DST-01", name: "Drawstring", category: "Fasteners & Closures", defaultUnit: "Pcs", description: "Round Braided Cotton Hoodie Drawcord with Aglets" },
  { code: "ACC-EYE-01", name: "Eyelet", category: "Metal Trims", defaultUnit: "Gross", description: "Brass Anti-Nickel Finished Metal Eyelet #3" },
  { code: "ACC-INT-01", name: "Interlining", category: "Sewing Trims", defaultUnit: "Mtr", description: "30 GSM Non-Woven Fusible Collar Interlining" },
  { code: "ACC-TIS-01", name: "Tissue Paper", category: "Packaging Trims", defaultUnit: "Pack", description: "18 GSM Acid Free White Protective Tissue Paper" },
  { code: "ACC-CTN-01", name: "Carton Box", category: "Packaging Trims", defaultUnit: "Pcs", description: "5-Ply Heavy Duty Corrugated Master Export Carton" },
];

const ITEM_NAME_OPTIONS = [
  "Button",
  "Sewing Thread",
  "Main Label",
  "Care Label",
  "Poly Bag",
  "Zipper",
  "Hang Tag",
  "Elastic Tape",
];

const USED_PLACE_OPTIONS = [
  "Front Placket",
  "Body Construction",
  "Inside Back Neck",
  "Inside Left Seam",
  "Individual Packaging",
  "Sleeve Opening",
  "Bottom Hem",
  "Collar",
];

export interface MasterSupplierItem {
  code: string;
  name: string;
  category: string;
  location: string;
  contact: string;
}

export const MASTER_SUPPLIERS: MasterSupplierItem[] = [
  { code: "SUP-ACC-01", name: "ABC Accessories Ltd.", category: "Trims & Accessories", location: "Dhaka, Bangladesh", contact: "+880 1711-234567" },
  { code: "SUP-TRM-02", name: "Fashion Trims International", category: "Labels & Hangtags", location: "Gazipur, Bangladesh", contact: "+880 1819-345678" },
  { code: "SUP-PKG-03", name: "Global Label & Packaging", category: "Packaging & Poly Bags", location: "Chittagong, Bangladesh", contact: "+880 1912-456789" },
  { code: "SUP-ZIP-04", name: "Premium Zipper Industries", category: "Zippers & Fasteners", location: "Narayanganj, Bangladesh", contact: "+880 1611-567890" },
  { code: "SUP-ACC-05", name: "Texline Accessories Ltd.", category: "Buttons & Metal Trims", location: "Dhaka, Bangladesh", contact: "+880 1715-678901" },
  { code: "SUP-BTN-06", name: "Smart Button Manufacturing", category: "Horn & Polyester Buttons", location: "Savar, Bangladesh", contact: "+880 1713-789012" },
  { code: "SUP-THD-07", name: "Reliable Sewing Materials", category: "Sewing & Embroidery Threads", location: "Dhaka, Bangladesh", contact: "+880 1818-890123" },
];

const SUPPLIER_OPTIONS = [
  "ABC Accessories Ltd.",
  "Fashion Trims International",
  "Global Label & Packaging",
  "Premium Zipper Industries",
  "Texline Accessories Ltd.",
  "Smart Button Manufacturing",
  "Reliable Sewing Materials",
];

const NOMINEE_STATUS_OPTIONS = ["Nominated", "Own Source"];

const MARKET_UNIT_OPTIONS = [
  "Gross",
  "Cones",
  "Dzn",
  "Pcs",
  "Yds",
  "Mtr",
  "Rolls",
  "Pack",
];

function getConversionRelation(marketUnit: string, consUnit: string): number {
  const m = marketUnit.toLowerCase();
  const c = consUnit.toLowerCase();
  if (m === "gross" || m === "grs") return 144;
  if (m === "dzn" || m === "dozen") return 12;
  if (m === "cones") {
    if (c === "mtr" || c === "meter" || c === "yds" || c === "yards") return 5000;
    return 1;
  }
  if (m === "pack") return 50;
  if (m === "rolls") return 100;
  return 1;
}

function AccessoriesEstimationRoute() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Master records from Local Storage
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [preCostings, setPreCostings] = useState<MMPreCosting[]>([]);
  const [allEstimations, setAllEstimations] = useState<MMAccessoriesEstimationRecord[]>([]);

  // Search Fields
  const [findPreCosting, setFindPreCosting] = useState<string>("");
  const [findJobId, setFindJobId] = useState<string>("");

  // Search Lookup Modals
  const [showPreCostingLookupModal, setShowPreCostingLookupModal] = useState<boolean>(false);
  const [showJobIdLookupModal, setShowJobIdLookupModal] = useState<boolean>(false);
  const [preCostingSearchQuery, setPreCostingSearchQuery] = useState<string>("");
  const [jobIdSearchQuery, setJobIdSearchQuery] = useState<string>("");

  // Form Fields - Group A: Order & Buyer Info (All read-only, Order Date removed)
  const [jobId, setJobId] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string>("");

  // Form Fields - Group B: Item & Quantity (All read-only, Packing Type & Unit removed)
  const [itemName, setItemName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  // Form Fields - Group D: Booking & PI Info (All read-only, Booking Dt & PI Dt removed)
  const [bookingNo, setBookingNo] = useState<string>("");
  const [piNo, setPiNo] = useState<string>("");
  const [bblcNo, setBblcNo] = useState<string>("");

  // Active Accessories Grid Rows
  const [accessoriesRows, setAccessoriesRows] = useState<MMAccessoriesEstimationRow[]>([]);

  // Modals
  // 1. Pre Costing Item Lookup Modal (row-level)
  const [preCostItemModalRowIndex, setPreCostItemModalRowIndex] = useState<number | null>(null);
  const [preCostItemSearchQuery, setPreCostItemSearchQuery] = useState<string>("");

  // 1b. Item Name Master Lookup Modal (row-level)
  const [itemNameModalRowIndex, setItemNameModalRowIndex] = useState<number | null>(null);
  const [itemNameSearchQuery, setItemNameSearchQuery] = useState<string>("");

  // 1c. Supplier Master Lookup Modal (row-level)
  const [supplierModalRowIndex, setSupplierModalRowIndex] = useState<number | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState<string>("");

  // 2. Market Unit Conversion Modal
  const [unitConversionModal, setUnitConversionModal] = useState<{
    rowIndex: number;
    newUnit: string;
    prevUnit: string;
    factor: number;
    consUnit: string;
  } | null>(null);

  // 3. Size D Modal
  const [sizeModalRowIndex, setSizeModalRowIndex] = useState<number | null>(null);
  const [sizeFactType, setSizeFactType] = useState<"SAME AS GMT SIZE" | "SINGLE SIZE">("SAME AS GMT SIZE");
  const [singleSizeSpec, setSingleSizeSpec] = useState<string>("");
  const [sizeRows, setSizeRows] = useState<MMAccessoriesSizeSpecRow[]>([]);

  // 4. Color D Modal
  const [colorModalRowIndex, setColorModalRowIndex] = useState<number | null>(null);
  const [colorType, setColorType] = useState<"DTM" | "Contrast" | "Single Color">("DTM");
  const [singleColorInput, setSingleColorInput] = useState<string>("");
  const [colorMappings, setColorMappings] = useState<MMAccessoriesColorMappingRow[]>([]);

  // Initialize data on mount
  useEffect(() => {
    const loadedOrders = MMRepository.getOrders();
    const resolvedOrders = loadedOrders.length > 0 ? loadedOrders : INITIAL_MM_ORDERS;
    setOrders(resolvedOrders);

    const loadedPreCostings = MMRepository.getPreCostings();
    const resolvedPreCostings = loadedPreCostings.length > 0 ? loadedPreCostings : INITIAL_MM_PRE_COSTINGS;
    setPreCostings(resolvedPreCostings);

    const loadedEstimations = MMRepository.getAccessoriesEstimations();
    setAllEstimations(loadedEstimations);

    // Check if query param specified an order or reference
    const initialQuery = searchParams.orderId || searchParams.ref;
    if (initialQuery) {
      loadRecordByOrderOrRef(initialQuery, loadedEstimations, resolvedOrders, resolvedPreCostings);
    } else if (loadedEstimations.length > 0) {
      loadEstimationIntoForm(loadedEstimations[0]);
    } else if (resolvedPreCostings.length > 0) {
      loadFromPreCosting(resolvedPreCostings[0], resolvedOrders);
    }
  }, [searchParams.orderId, searchParams.ref]);

  // Load a record by Order ID or Ref
  const loadRecordByOrderOrRef = (
    key: string,
    estimationsList: MMAccessoriesEstimationRecord[],
    ordersList: MMMainOrder[],
    preCostingsList: MMPreCosting[]
  ) => {
    // 1. First search in existing estimations
    const foundEst = estimationsList.find(
      (e) => e.orderId === key || e.jobNo === key || e.ourRef === key || e.id === key
    );

    if (foundEst) {
      loadEstimationIntoForm(foundEst);
      return;
    }

    // 2. If not found in estimations, look up Pre Costing
    const foundPC = preCostingsList.find(
      (pc) => pc.preCostId === key || pc.jobNo === key || pc.orderNo === key
    );

    if (foundPC) {
      loadFromPreCosting(foundPC, ordersList);
      return;
    }

    // 3. Otherwise look up Order
    const foundOrder = ordersList.find(
      (o) => o.id === key || o.jobNo === key || o.orderNo === key
    );

    if (foundOrder) {
      loadFromOrder(foundOrder, preCostingsList);
    } else {
      toast.error(`Record reference "${key}" not found.`);
      if (estimationsList.length > 0) {
        loadEstimationIntoForm(estimationsList[0]);
      }
    }
  };

  // Populate form from existing estimation record
  const loadEstimationIntoForm = (record: MMAccessoriesEstimationRecord) => {
    const jobKey = record.jobNo || record.ourRef || "";
    setJobId(jobKey);
    setFindJobId(jobKey);
    setFindPreCosting(record.findQtn || "");
    setStyle(record.style || "");
    setBuyerName(record.buyer || "");

    setItemName(record.itemName || "Garment Item");
    setQuantity(record.quantity || 0);

    const allSavedBookings = MMRepository.getAccessoriesBookings();
    const isGenuineBooking = Boolean(record.bookingNo && allSavedBookings.some((b) => b.bookingNo === record.bookingNo));
    setBookingNo(isGenuineBooking && record.bookingNo ? record.bookingNo : "");
    setPiNo(record.piNo || "");
    setBblcNo(record.bblcNo || "");

    setAccessoriesRows(record.accessoriesRows ? JSON.parse(JSON.stringify(record.accessoriesRows)) : []);
  };

  // Initialize estimation context from a Pre Costing record
  const loadFromPreCosting = (pc: MMPreCosting, ordersList = orders) => {
    const jobKey = pc.jobNo || pc.orderNo || `JOB-${pc.preCostId}`;
    setFindPreCosting(pc.preCostId);
    setFindJobId(jobKey);
    setJobId(jobKey);
    setStyle(pc.styleNo || "HM-KT-8841");
    setBuyerName(pc.buyerName || "H&M Hennes & Mauritz");
    setItemName(pc.styleDescription || pc.garmentType || "Ladies Ribbed Henley Neck T-Shirt");
    setQuantity(pc.orderQuantity || 45000);

    setBookingNo("");
    setPiNo("");
    setBblcNo("");

    // Look for matching order for size & color breakdowns
    const matchedOrder = ordersList.find(
      (o) => o.jobNo === jobKey || o.orderNo === jobKey || o.styleNo === pc.styleNo
    );

    // Extract accessory items from pre-costing
    const preCostAccItems = (pc.items || []).filter(
      (item) => item.category === "Accessories" || item.category === "Trims"
    );

    const baseItems = preCostAccItems.length > 0 ? preCostAccItems : [
      {
        preCostItemId: "PCI-103",
        category: "Accessories" as const,
        itemCode: "ACC-BTN-01",
        itemDescription: "Natural Shell 4-Hole Button 18L",
        specification: "18L, 4 Holes, Engraved Edge",
        bodyPartOrUsedPlace: "Front Placket",
        consumptionPerPc: 3,
        unit: "Pcs",
        wastagePct: 3.0,
        requiredQtyWithWastage: 37.08,
        unitRate: 0.035,
        totalAmountPerDzn: 1.30,
        supplierNominee: "ABC Accessories Ltd.",
      },
      {
        preCostItemId: "PCI-104",
        category: "Accessories" as const,
        itemCode: "ACC-LBL-01",
        itemDescription: "Main Label",
        specification: "Damask Woven, Soft Edge, 45mm x 20mm",
        bodyPartOrUsedPlace: "Inside Back Neck",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.045,
        totalAmountPerDzn: 0.55,
        supplierNominee: "Global Label & Packaging",
      },
      {
        preCostItemId: "PCI-105",
        category: "Accessories" as const,
        itemCode: "ACC-LBL-02",
        itemDescription: "Care Label",
        specification: "Printed Satin Care Label & RN#",
        bodyPartOrUsedPlace: "Inside Left Seam",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 4.0,
        requiredQtyWithWastage: 12.48,
        unitRate: 0.022,
        totalAmountPerDzn: 0.30,
        supplierNominee: "Global Label & Packaging",
      },
      {
        preCostItemId: "PCI-106",
        category: "Accessories" as const,
        itemCode: "ACC-PKG-01",
        itemDescription: "Poly Bag",
        specification: "Self-Adhesive 12x15 with Warning Text",
        bodyPartOrUsedPlace: "Individual Packaging",
        consumptionPerPc: 1,
        unit: "Pcs",
        wastagePct: 2.0,
        requiredQtyWithWastage: 12.24,
        unitRate: 0.038,
        totalAmountPerDzn: 0.46,
        supplierNominee: "Reliable Sewing Materials",
      },
    ];

    const defaultRows: MMAccessoriesEstimationRow[] = baseItems.map((item, idx) => {
      const cons = item.consumptionPerPc || 1;
      const wPct = item.wastagePct || 3;
      const ordQty = pc.orderQuantity || 45000;
      const baseReq = ordQty * cons;
      const wQty = Math.round(baseReq * (wPct / 100) * 100) / 100;
      const grossReq = baseReq + wQty;

      let mUnit = "Pcs";
      let calcMarketQty = grossReq;
      if (item.unit === "Gross" || item.itemDescription.toLowerCase().includes("button")) {
        mUnit = "Gross";
        calcMarketQty = Math.ceil(grossReq / 144);
      } else if (item.itemDescription.toLowerCase().includes("thread")) {
        mUnit = "Cones";
        calcMarketQty = Math.ceil(grossReq / 5000);
      }
      const uRate = item.unitRate || 0.05;

      return {
        id: `ar-${Date.now()}-${idx}`,
        inhouse: false,
        budgetItemName: item.itemCode || item.itemDescription,
        itemName: mapToStandardItemName(item.itemDescription),
        description: item.specification || item.itemDescription,
        usedPlace: mapToStandardUsedPlace(item.bodyPartOrUsedPlace),
        consumptionQtyPerPc: cons,
        consumptionUnit: item.unit || "Pcs",
        wastagePct: wPct,
        wastageQty: wQty,
        marketQty: calcMarketQty,
        marketUnit: mUnit,
        unitRate: uRate,
        amount: Math.round(calcMarketQty * uRate * 100) / 100,
        nomineeStatus: item.supplierNominee ? "Nominated" : "Own Source",
        supplier: mapToStandardSupplier(item.supplierNominee),
        sizeFactType: "SAME AS GMT SIZE",
        sizeRows: (matchedOrder?.sizeWiseBreakdown && matchedOrder.sizeWiseBreakdown.length > 0
          ? matchedOrder.sizeWiseBreakdown
          : [
              { size: "S", quantity: Math.round(ordQty * 0.25) },
              { size: "M", quantity: Math.round(ordQty * 0.35) },
              { size: "L", quantity: Math.round(ordQty * 0.25) },
              { size: "XL", quantity: Math.round(ordQty * 0.15) },
            ]
        ).map((sz: any, sIdx: number) => {
          const sName = sz.size || sz.sizeName || "Size";
          const sQty = sz.quantity || 0;
          const req = sQty * cons;
          const wQ = Math.ceil(req * (wPct / 100));
          return {
            id: `sz-${Date.now()}-${sIdx}`,
            gmtSize: sName,
            itemSpecification: `${item.itemDescription} for Size ${sName}`,
            requiredItemQty: req,
            wastageQty: wQ,
            totalQty: req + wQ,
            gmtOrderQty: sQty,
            totalWastagePct: wPct,
          };
        }),
        colorType: "DTM",
        colorMappings: (matchedOrder?.colorWiseBreakdown || [
          { color: "Black" },
          { color: "Navy" },
          { color: "White" },
        ]).map((cb: any, cIdx: number) => {
          const cName = cb.color || cb.colorName || "Color";
          return {
            id: `cm-${Date.now()}-${cIdx}`,
            garmentsColor: cName,
            itemColor: cName,
          };
        }),
        bookingStatus: "Not Booked",
      };
    });

    setAccessoriesRows(defaultRows);
    toast.success(`Loaded Pre Costing ${pc.preCostId} for Job ${jobKey}.`);
  };

  // Initialize estimation context from an Order Entry record
  const loadFromOrder = (order: MMMainOrder, preCostingsList = preCostings) => {
    const orderJob = order.jobNo || order.orderNo;
    setJobId(orderJob);
    setFindJobId(orderJob);
    setFindPreCosting(order.preCostId || "");
    setStyle(order.styleNo || "HM-KT-8841");
    setBuyerName(order.buyerName);
    setItemName(order.garmentItem || order.styleNo || "Garment Item");
    setQuantity(order.orderQuantity || 0);

    setBookingNo("");
    setPiNo("");
    setBblcNo("");

    // Find pre-costing for items if available
    const matchedPC = preCostingsList.find(
      (pc) => pc.preCostId === order.preCostId || pc.jobNo === orderJob || pc.styleNo === order.styleNo
    );

    if (matchedPC) {
      loadFromPreCosting(matchedPC, [order]);
      return;
    }

    // Default accessory items
    const ordQty = order.orderQuantity || 10000;
    const defaultRows: MMAccessoriesEstimationRow[] = [
      {
        id: `ar-${Date.now()}-1`,
        inhouse: false,
        budgetItemName: "ACC-BTN-01",
        itemName: "Button",
        description: "Engraved Pearl Finish 18L Button (11.5mm)",
        usedPlace: "Front Placket",
        consumptionQtyPerPc: 3,
        consumptionUnit: "Pcs",
        wastagePct: 3,
        wastageQty: Math.ceil(ordQty * 3 * 0.03),
        marketQty: Math.ceil((ordQty * 3 * 1.03) / 144),
        marketUnit: "Gross",
        unitRate: 1.25,
        amount: Math.round(Math.ceil((ordQty * 3 * 1.03) / 144) * 1.25 * 100) / 100,
        nomineeStatus: "Nominated",
        supplier: "ABC Accessories Ltd.",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "18L (11.5mm) 4-Hole",
        colorType: "DTM",
        colorMappings: (order.colorWiseBreakdown || [{ color: "Black" }]).map((cb, idx) => {
          const cName = (cb as any).color || (cb as any).colorName || "Color";
          return {
            id: `cm-${Date.now()}-${idx}`,
            garmentsColor: cName,
            itemColor: cName,
          };
        }),
        bookingStatus: "Not Booked",
      },
      {
        id: `ar-${Date.now()}-2`,
        inhouse: false,
        budgetItemName: "ACC-THD-01",
        itemName: "Sewing Thread",
        description: "Astra 40/2 High Tenacity 5000M Spool",
        usedPlace: "Body Construction",
        consumptionQtyPerPc: 120,
        consumptionUnit: "Mtr",
        wastagePct: 5,
        wastageQty: Math.ceil(ordQty * 120 * 0.05),
        marketQty: Math.ceil((ordQty * 120 * 1.05) / 5000),
        marketUnit: "Cones",
        unitRate: 1.80,
        amount: Math.round(Math.ceil((ordQty * 120 * 1.05) / 5000) * 1.80 * 100) / 100,
        nomineeStatus: "Nominated",
        supplier: "Reliable Sewing Materials",
        sizeFactType: "SINGLE SIZE",
        singleSizeSpec: "5000m / Spool",
        colorType: "DTM",
        colorMappings: (order.colorWiseBreakdown || [{ color: "Black" }]).map((cb, idx) => {
          const cName = (cb as any).color || (cb as any).colorName || "Color";
          return {
            id: `cm-${Date.now()}-${idx}`,
            garmentsColor: cName,
            itemColor: cName,
          };
        }),
        bookingStatus: "Not Booked",
      },
      {
        id: `ar-${Date.now()}-3`,
        inhouse: false,
        budgetItemName: "ACC-LBL-01",
        itemName: "Main Label",
        description: "Center Fold Woven Label 25mm x 55mm",
        usedPlace: "Inside Back Neck",
        consumptionQtyPerPc: 1,
        consumptionUnit: "Pcs",
        wastagePct: 3,
        wastageQty: Math.ceil(ordQty * 0.03),
        marketQty: Math.ceil(ordQty * 1.03),
        marketUnit: "Pcs",
        unitRate: 0.045,
        amount: Math.round(Math.ceil(ordQty * 1.03) * 0.045 * 100) / 100,
        nomineeStatus: "Nominated",
        supplier: "Global Label & Packaging",
        sizeFactType: "SAME AS GMT SIZE",
        sizeRows: (order.sizeWiseBreakdown && order.sizeWiseBreakdown.length > 0
          ? order.sizeWiseBreakdown
          : [
              { size: "S", quantity: Math.round(ordQty * 0.25) },
              { size: "M", quantity: Math.round(ordQty * 0.35) },
              { size: "L", quantity: Math.round(ordQty * 0.25) },
              { size: "XL", quantity: Math.round(ordQty * 0.15) },
            ]
        ).map((sz: any, sIdx: number) => {
          const sName = sz.size || sz.sizeName || "Size";
          const sQty = sz.quantity || 0;
          return {
            id: `sz-${Date.now()}-${sIdx}`,
            gmtSize: sName,
            itemSpecification: `Main Label for ${sName}`,
            requiredItemQty: sQty,
            wastageQty: Math.ceil(sQty * 0.03),
            totalQty: Math.ceil(sQty * 1.03),
            gmtOrderQty: sQty,
            totalWastagePct: 3,
          };
        }),
        colorType: "DTM",
        colorMappings: (order.colorWiseBreakdown || [{ color: "Black" }]).map((cb, idx) => {
          const cName = (cb as any).color || (cb as any).colorName || "Color";
          return {
            id: `cm-${Date.now()}-${idx}`,
            garmentsColor: cName,
            itemColor: cName,
          };
        }),
        bookingStatus: "Not Booked",
      },
    ];

    setAccessoriesRows(defaultRows);
    toast.success(`Loaded Job ID ${orderJob} (${order.buyerName}).`);
  };

  // Helper mappers to match requested standard options
  function mapToStandardItemName(name: string): string {
    const lower = name.toLowerCase();
    for (const opt of ITEM_NAME_OPTIONS) {
      if (lower.includes(opt.toLowerCase())) return opt;
    }
    return "Button";
  }

  function mapToStandardUsedPlace(place: string): string {
    if (!place) return "Body Construction";
    const lower = place.toLowerCase();
    for (const opt of USED_PLACE_OPTIONS) {
      if (lower.includes(opt.toLowerCase())) return opt;
    }
    return "Front Placket";
  }

  function mapToStandardSupplier(sup?: string): string {
    if (!sup) return "ABC Accessories Ltd.";
    for (const opt of SUPPLIER_OPTIONS) {
      if (sup.toLowerCase().includes(opt.toLowerCase()) || opt.toLowerCase().includes(sup.toLowerCase())) {
        return opt;
      }
    }
    return "ABC Accessories Ltd.";
  }

  // Row Management
  const handleAddRow = () => {
    const newRow: MMAccessoriesEstimationRow = {
      id: `ar-${Date.now()}`,
      inhouse: false,
      budgetItemName: "ACC-CUSTOM",
      itemName: "Button",
      description: "Standard Accessories Specification",
      usedPlace: "Front Placket",
      consumptionQtyPerPc: 1,
      consumptionUnit: "Pcs",
      wastagePct: 3,
      wastageQty: Math.round(quantity * 0.03 * 100) / 100,
      marketQty: Math.round(quantity * 1.03 * 100) / 100,
      marketUnit: "Pcs",
      unitRate: 0.1,
      amount: Math.round(quantity * 1.03 * 0.1 * 100) / 100,
      nomineeStatus: "Nominated",
      supplier: "ABC Accessories Ltd.",
      sizeFactType: "SINGLE SIZE",
      singleSizeSpec: "Standard 18L",
      colorType: "DTM",
      colorMappings: [],
      bookingStatus: "Not Booked",
    };
    setAccessoriesRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    if (accessoriesRows.length <= 1) {
      toast.warning("Cannot delete the only remaining accessory item.");
      return;
    }
    const item = accessoriesRows[index];
    if (confirm(`Remove row #${index + 1} (${item.budgetItemName || item.itemName})?`)) {
      setAccessoriesRows((prev) => prev.filter((_, idx) => idx !== index));
      toast.success("Row removed.");
    }
  };

  // Calculation handler when row fields change
  const handleRowChange = (index: number, field: keyof MMAccessoriesEstimationRow, value: any) => {
    setAccessoriesRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Re-calculate math if consumption, wastage, unit, or rate changed
      if (
        field === "consumptionQtyPerPc" ||
        field === "wastagePct" ||
        field === "marketUnit" ||
        field === "unitRate"
      ) {
        const cons = Number(field === "consumptionQtyPerPc" ? value : row.consumptionQtyPerPc) || 0;
        const wPct = Number(field === "wastagePct" ? value : row.wastagePct) || 0;
        const mUnit = String(field === "marketUnit" ? value : row.marketUnit);
        const uRate = Number(field === "unitRate" ? value : row.unitRate) || 0;

        const baseReq = quantity * cons;
        const wQty = Math.round(baseReq * (wPct / 100) * 100) / 100;
        const grossReq = baseReq + wQty;

        // Use custom conversionFactor if present on the row, or standard unit relation
        const convFact = row.conversionFactor && row.conversionFactor > 0
          ? row.conversionFactor
          : getConversionRelation(mUnit, row.consumptionUnit || "Pcs");

        const calcMarketQty = convFact > 0 ? grossReq / convFact : grossReq;

        row.wastageQty = wQty;
        row.marketQty = Math.round(calcMarketQty * 100) / 100;
        row.amount = Math.round(calcMarketQty * uRate * 100) / 100;
      }

      updated[index] = row;
      return updated;
    });
  };

  // Intercept user-initiated Market Unit change to display conversion modal
  const handleMarketUnitSelect = (index: number, newUnit: string) => {
    const row = accessoriesRows[index];
    if (row.marketUnit === newUnit) return;
    const factor = (row.conversionFactor && row.conversionFactor > 0)
      ? row.conversionFactor
      : getConversionRelation(newUnit, row.consumptionUnit || "Pcs");
    setUnitConversionModal({
      rowIndex: index,
      newUnit,
      prevUnit: row.marketUnit,
      factor,
      consUnit: row.consumptionUnit || "Pcs",
    });
  };

  const handleConfirmUnitConversion = () => {
    if (!unitConversionModal) return;
    const { rowIndex, newUnit, factor } = unitConversionModal;
    const numFactor = Number(factor);
    if (!numFactor || numFactor <= 0 || isNaN(numFactor)) {
      toast.error("Please enter a valid conversion factor greater than 0.");
      return;
    }

    setAccessoriesRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[rowIndex] };
      row.marketUnit = newUnit;
      row.conversionFactor = numFactor;

      const cons = Number(row.consumptionQtyPerPc) || 0;
      const wPct = Number(row.wastagePct) || 0;
      const uRate = Number(row.unitRate) || 0;

      const baseReq = quantity * cons;
      const wQty = Math.round(baseReq * (wPct / 100) * 100) / 100;
      const grossReq = baseReq + wQty;

      const calcMarketQty = grossReq / numFactor;

      row.wastageQty = wQty;
      row.marketQty = Math.round(calcMarketQty * 100) / 100;
      row.amount = Math.round(calcMarketQty * uRate * 100) / 100;

      updated[rowIndex] = row;
      return updated;
    });

    setUnitConversionModal(null);
    toast.success(`Market Unit updated to ${newUnit} (Relation Factor: ${numFactor}).`);
  };

  const handleCancelUnitConversion = () => {
    setUnitConversionModal(null);
  };

  // Size D Modal Handlers
  const handleOpenSizeModal = (index: number) => {
    const row = accessoriesRows[index];
    setSizeModalRowIndex(index);
    setSizeFactType(row.sizeFactType || "SAME AS GMT SIZE");
    setSingleSizeSpec(row.singleSizeSpec || "");

    if (row.sizeRows && row.sizeRows.length > 0) {
      setSizeRows(JSON.parse(JSON.stringify(row.sizeRows)));
    } else {
      const matchedOrder = orders.find((o) => (o.jobNo || o.orderNo) === jobId);
      const defaultSizes =
        matchedOrder?.sizeWiseBreakdown && matchedOrder.sizeWiseBreakdown.length > 0
          ? matchedOrder.sizeWiseBreakdown.map((sb) => ({
              sizeName: (sb as any).size || (sb as any).sizeName,
              qty: sb.quantity,
            }))
          : [
              { sizeName: "8S", qty: Math.round(quantity * 0.15) || 4500 },
              { sizeName: "8R", qty: Math.round(quantity * 0.25) || 7500 },
              { sizeName: "8L", qty: Math.round(quantity * 0.20) || 6000 },
              { sizeName: "10S", qty: Math.round(quantity * 0.25) || 8500 },
              { sizeName: "10R", qty: Math.round(quantity * 0.15) || 12000 },
            ];

      const initialSizeRows: MMAccessoriesSizeSpecRow[] = defaultSizes.map((sz: { sizeName: string; qty: number }, sIdx: number) => {
        const req = sz.qty * (row.consumptionQtyPerPc || 1);
        const wPct = row.wastagePct || 3;
        const wQty = Math.ceil(req * (wPct / 100));
        return {
          id: `sz-${Date.now()}-${sIdx}`,
          gmtSize: sz.sizeName,
          itemSpecification: row.singleSizeSpec || `${row.itemName} Spec for ${sz.sizeName}`,
          requiredItemQty: req,
          wastageQty: wQty,
          totalQty: req + wQty,
          gmtOrderQty: sz.qty,
          totalWastagePct: wPct,
        };
      });
      setSizeRows(initialSizeRows);
    }
  };

  const handleApplySingleSizeSpecToAll = () => {
    if (!singleSizeSpec.trim()) {
      toast.warning("Please enter a single size specification before applying.");
      return;
    }
    setSizeRows((prev) =>
      prev.map((r) => ({
        ...r,
        itemSpecification: singleSizeSpec,
      }))
    );
    toast.success(`Applied "${singleSizeSpec}" across all ${sizeRows.length} size rows.`);
  };

  const handleSaveSizeModal = () => {
    if (sizeModalRowIndex === null) return;
    setAccessoriesRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[sizeModalRowIndex] };
      target.sizeFactType = sizeFactType;
      target.singleSizeSpec = singleSizeSpec;
      target.sizeRows = JSON.parse(JSON.stringify(sizeRows));

      const sumTotalQty = sizeRows.reduce((a, b) => a + (b.totalQty || 0), 0);
      let calcMarketQty = sumTotalQty;
      if (target.marketUnit === "Gross") {
        calcMarketQty = sumTotalQty / 144;
      } else if (target.marketUnit === "Dzn") {
        calcMarketQty = sumTotalQty / 12;
      } else if (target.marketUnit === "Cones") {
        calcMarketQty = sumTotalQty / 5000;
      }
      target.marketQty = Math.round(calcMarketQty * 100) / 100;
      target.amount = Math.round(calcMarketQty * (target.unitRate || 0) * 100) / 100;

      updated[sizeModalRowIndex] = target;
      return updated;
    });
    setSizeModalRowIndex(null);
    toast.success("Size specification saved.");
  };

  // Color D Modal Handlers
  const handleOpenColorModal = (index: number) => {
    const row = accessoriesRows[index];
    setColorModalRowIndex(index);
    setColorType(row.colorType || "DTM");
    setSingleColorInput(row.singleColorName || "");

    if (row.colorMappings && row.colorMappings.length > 0) {
      setColorMappings(JSON.parse(JSON.stringify(row.colorMappings)));
    } else {
      const matchedOrder = orders.find((o) => (o.jobNo || o.orderNo) === jobId);
      const defaultColors =
        matchedOrder?.colorWiseBreakdown && matchedOrder.colorWiseBreakdown.length > 0
          ? matchedOrder.colorWiseBreakdown.map((cb) => (cb as any).color || (cb as any).colorName)
          : ["Black", "White", "Navy Blue", "Heather Grey", "Olive Green"];

      const initialColors: MMAccessoriesColorMappingRow[] = defaultColors.map((cName: string, cIdx: number) => ({
        id: `cm-${Date.now()}-${cIdx}`,
        garmentsColor: cName,
        itemColor: cName,
      }));
      setColorMappings(initialColors);
    }
  };

  const handleApplySingleColorToAll = () => {
    if (!singleColorInput.trim()) {
      toast.warning("Please enter a uniform color name.");
      return;
    }
    setColorMappings((prev) =>
      prev.map((cm) => ({
        ...cm,
        itemColor: singleColorInput,
      }))
    );
    toast.success(`Applied "${singleColorInput}" to all garment colors.`);
  };

  const handleSaveColorModal = () => {
    if (colorModalRowIndex === null) return;
    setAccessoriesRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[colorModalRowIndex] };
      target.colorType = colorType;
      target.singleColorName = singleColorInput;
      target.colorMappings = JSON.parse(JSON.stringify(colorMappings));
      updated[colorModalRowIndex] = target;
      return updated;
    });
    setColorModalRowIndex(null);
    toast.success("Color mappings applied.");
  };

  // Save Main Accessories Estimation
  const handleSaveEstimation = () => {
    if (!jobId.trim()) {
      toast.error("Validation Error: Job ID is required.");
      return;
    }
    if (accessoriesRows.length === 0) {
      toast.error("Validation Error: Please add at least one accessory item.");
      return;
    }

    const currentEst = allEstimations.find((e) => e.jobNo === jobId || e.ourRef === jobId);
    const estId = currentEst?.id || `ae-${Date.now()}`;
    const allSavedBookings = MMRepository.getAccessoriesBookings();
    const isGenuineBooking = Boolean(bookingNo && allSavedBookings.some((b) => b.bookingNo === bookingNo));
    const effectiveBookingNo = isGenuineBooking && bookingNo ? bookingNo : "";

    const newRecord: MMAccessoriesEstimationRecord = {
      id: estId,
      orderId: jobId,
      jobNo: jobId,
      ourRef: jobId,
      buyer: buyerName,
      style: style,
      itemName: itemName,
      quantity: quantity,
      bookingNo: effectiveBookingNo,
      piNo: piNo,
      bblcNo: bblcNo,
      findQtn: findPreCosting,
      findRef: findJobId,
      accessoriesRows: accessoriesRows.map((r) => {
        const hasSavedBooking = Boolean(
          r.bookingRef &&
            allSavedBookings.some((b) => b.bookingNo === r.bookingRef || b.id === r.bookingRef)
        );
        return {
          ...r,
          bookingRef: hasSavedBooking ? r.bookingRef : undefined,
          bookingStatus: hasSavedBooking ? (r.bookingStatus || "Booked") : "Not Booked",
        };
      }),
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MMRepository.saveAccessoriesEstimation(newRecord);
    const refreshed = MMRepository.getAccessoriesEstimations();
    setAllEstimations(refreshed);
    toast.success(`Accessories Estimation for Job ID ${jobId} saved successfully!`);
  };

  // Reset form to blank new estimation
  const handleNewEstimation = () => {
    if (confirm("Start a new estimation record? Unsaved changes will be cleared.")) {
      setJobId("");
      setStyle("");
      setBuyerName("");
      setItemName("");
      setQuantity(0);
      setBookingNo("");
      setPiNo("");
      setBblcNo("");
      setFindPreCosting("");
      setFindJobId("");
      setAccessoriesRows([]);
      toast.info("Cleared form for new accessories estimation entry.");
    }
  };

  // Exit back to Order Entry Form
  const handleExit = () => {
    navigate({
      to: "/mm-order-entry",
      search: {
        orderId: jobId,
      } as any,
    });
  };

  // Totals calculations
  const totalMarketQty = useMemo(() => {
    return accessoriesRows.reduce((a, b) => a + (Number(b.marketQty) || 0), 0);
  }, [accessoriesRows]);

  const totalAmount = useMemo(() => {
    return accessoriesRows.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  }, [accessoriesRows]);

  // Filtered Pre Costings for lookup modal
  const filteredPreCostings = useMemo(() => {
    const q = preCostingSearchQuery.toLowerCase().trim();
    if (!q) return preCostings;
    return preCostings.filter(
      (pc) =>
        pc.preCostId.toLowerCase().includes(q) ||
        (pc.jobNo && pc.jobNo.toLowerCase().includes(q)) ||
        pc.styleNo.toLowerCase().includes(q) ||
        pc.buyerName.toLowerCase().includes(q)
    );
  }, [preCostings, preCostingSearchQuery]);

  // Filtered Job IDs for lookup modal
  const filteredOrders = useMemo(() => {
    const q = jobIdSearchQuery.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        (o.jobNo && o.jobNo.toLowerCase().includes(q)) ||
        (o.orderNo && o.orderNo.toLowerCase().includes(q)) ||
        (o.styleNo && o.styleNo.toLowerCase().includes(q)) ||
        o.buyerName.toLowerCase().includes(q)
    );
  }, [orders, jobIdSearchQuery]);

  // Pre Cost Item available items for row lookup (Accessories ONLY, Fabric completely excluded)
  const availablePreCostItems = useMemo(() => {
    // Collect from matched pre-costing, or all pre-costings
    const matchedPC = preCostings.find(
      (pc) => pc.preCostId === findPreCosting || pc.jobNo === jobId || pc.styleNo === style
    );
    const sourceItems = matchedPC && matchedPC.items ? matchedPC.items : preCostings.flatMap((p) => p.items || []);

    // STRICT accessories only filter (exclude fabric items completely)
    const isAccessory = (item: any) => {
      const cat = (item.category || "").toLowerCase();
      const desc = (item.itemDescription || "").toLowerCase();
      const code = (item.itemCode || "").toLowerCase();
      if (
        cat.includes("fabric") ||
        desc.includes("fabric") ||
        desc.includes("yarn") ||
        desc.includes("fleece") ||
        desc.includes("single jersey") ||
        desc.includes("rib") ||
        code.startsWith("fab-")
      ) {
        return false;
      }
      return true;
    };

    const q = preCostItemSearchQuery.toLowerCase().trim();
    return sourceItems
      .filter(isAccessory)
      .filter(
        (item) =>
          !q ||
          item.itemDescription.toLowerCase().includes(q) ||
          item.itemCode.toLowerCase().includes(q) ||
          item.specification.toLowerCase().includes(q)
      );
  }, [preCostings, findPreCosting, jobId, style, preCostItemSearchQuery]);

  // Master Accessories for Item Name lookup
  const filteredMasterAccessories = useMemo(() => {
    const q = itemNameSearchQuery.toLowerCase().trim();
    if (!q) return MASTER_ACCESSORY_ITEMS;
    return MASTER_ACCESSORY_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [itemNameSearchQuery]);

  // Master Suppliers for Supplier lookup
  const filteredMasterSuppliers = useMemo(() => {
    const q = supplierSearchQuery.toLowerCase().trim();
    if (!q) return MASTER_SUPPLIERS;
    return MASTER_SUPPLIERS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );
  }, [supplierSearchQuery]);

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-accessories-estimation"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-order-entry" },
        { label: "Accessories Estimation", to: "/mm-accessories-estimation" },
      ]}
      title="Accessories Estimation"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Return to Order Entry"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Order Entry</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-sans pb-10">
        {/* ================================================================== */}
        {/* ACCESSORIES ESTIMATION FORM UNIFIED CONTAINER                       */}
        {/* ================================================================== */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden text-xs">
          {/* ================================================================== */}
          {/* 1. SEARCH SECTION (Find Pre Costing & Find Job ID + P Lookups)     */}
          {/* ================================================================== */}
          <div className="bg-slate-50/75 dark:bg-slate-850/75 p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Find Pre Costing */}
              <div className="flex items-center gap-2">
                <label className="w-28 font-semibold text-slate-600 dark:text-slate-300 text-left shrink-0 text-xs">
                  Find Pre Costing:
                </label>
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={findPreCosting}
                    onClick={() => setShowPreCostingLookupModal(true)}
                    placeholder="Click P to select Pre Costing record..."
                    className="flex-1 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-650 bg-white dark:bg-slate-900 font-mono text-xs cursor-pointer font-bold text-teal-700 dark:text-teal-400 focus:ring-1 focus:ring-teal-500 outline-none text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPreCostingLookupModal(true)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold rounded border border-slate-300 dark:border-slate-600 transition-colors"
                    title="Lookup Pre Costing Record"
                  >
                    P
                  </button>
                </div>
              </div>

              {/* Find Job ID */}
              <div className="flex items-center gap-2">
                <label className="w-24 font-semibold text-slate-600 dark:text-slate-300 text-left shrink-0 text-xs">
                  Find Job ID:
                </label>
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={findJobId}
                    onClick={() => setShowJobIdLookupModal(true)}
                    placeholder="Click P to select Job ID record..."
                    className="flex-1 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-650 bg-white dark:bg-slate-900 font-mono text-xs cursor-pointer font-bold text-teal-700 dark:text-teal-400 focus:ring-1 focus:ring-teal-500 outline-none text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowJobIdLookupModal(true)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold rounded border border-slate-300 dark:border-slate-600 transition-colors"
                    title="Lookup Job ID Record"
                  >
                    P
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* 2. ORDER, ITEM & BOOKING INFORMATION (3 CLEAN COMPACT GROUPS)      */}
          {/* ================================================================== */}
          <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* GROUP A: Order & Buyer Info (Left-aligned, read-only) */}
              <div className="bg-slate-50/70 dark:bg-slate-850/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-750 pb-1 text-[11px] uppercase tracking-wide">
                  Order &amp; Buyer Info
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Job ID:</span>
                  <input
                    type="text"
                    readOnly
                    value={jobId}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold cursor-not-allowed text-left"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Style:</span>
                  <input
                    type="text"
                    readOnly
                    value={style}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed text-left"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Buyer Name:</span>
                  <input
                    type="text"
                    readOnly
                    value={buyerName}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed text-left"
                  />
                </div>
              </div>

              {/* ITEM & QUANTITY: Renamed heading, Left-aligned, read-only */}
              <div className="bg-slate-50/70 dark:bg-slate-850/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-750 pb-1 text-[11px] uppercase tracking-wide">
                  Item &amp; Quantity
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Item:</span>
                  <input
                    type="text"
                    readOnly
                    value={itemName}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-not-allowed text-left"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Quantity:</span>
                  <input
                    type="text"
                    readOnly
                    value={quantity.toLocaleString()}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed text-left"
                  />
                </div>
              </div>

              {/* BOOKING & PI INFO: Left-aligned, read-only */}
              <div className="bg-slate-50/70 dark:bg-slate-850/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-750 pb-1 text-[11px] uppercase tracking-wide">
                  Booking &amp; PI Info
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">Booking No:</span>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={bookingNo || ""}
                    placeholder="Assigned on Accessories Booking"
                    title="Booking number is assigned when an Accessories Booking is created and saved."
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 placeholder:italic cursor-not-allowed text-left"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">PI No:</span>
                  <input
                    type="text"
                    readOnly
                    value={piNo || "—"}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 cursor-not-allowed text-left"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-left text-[11px]">BBLC No:</span>
                  <input
                    type="text"
                    readOnly
                    value={bblcNo || "—"}
                    className="col-span-2 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 cursor-not-allowed text-left"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* 3. ACCESSORIES ESTIMATION DETAILS TABLE (19 COLUMNS, PO REMOVED)   */}
          {/* ================================================================== */}
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Stable container height with sticky headers & sticky right Booking column */}
            <div className="overflow-auto max-h-[500px] border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-950 shadow-xs relative">
              <table className="w-full border-collapse text-left whitespace-nowrap text-[11px]">
                {/* 3.1 Grouped Table Header */}
                <thead>
                  <tr className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700 text-center sticky top-0 z-20">
                    <th className="py-1 px-1 border-r border-slate-300 dark:border-slate-700">Actions</th>
                    <th colSpan={4} className="py-1 px-2 border-r border-slate-300 dark:border-slate-700">
                      Accessories &amp; Pre Costing Identification
                    </th>
                    <th colSpan={2} className="py-1 px-2 border-r border-slate-300 dark:border-slate-700">
                      Consumption
                    </th>
                    <th colSpan={2} className="py-1 px-2 border-r border-slate-300 dark:border-slate-700">
                      Wastage
                    </th>
                    <th colSpan={4} className="py-1 px-2 border-r border-slate-300 dark:border-slate-700">
                      Market Procurement &amp; Cost
                    </th>
                    <th colSpan={4} className="py-1 px-2 border-r border-slate-300 dark:border-slate-700">
                      Supplier, Size &amp; Color Factors
                    </th>
                    <th className="sticky right-0 z-30 bg-slate-200 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 py-1 px-2 text-center w-20 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      Booking
                    </th>
                  </tr>

                  {/* 3.2 Individual Column Headers */}
                  <tr className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-300 dark:border-slate-700 sticky top-[25px] z-20">
                    <th className="py-1.5 px-1 text-center w-8 border-r border-slate-200 dark:border-slate-800">X</th>
                    <th className="py-1.5 px-1 text-center w-12 border-r border-slate-200 dark:border-slate-800">In House?</th>
                    <th className="py-1.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Pre Costing Item</th>
                    <th className="py-1.5 px-2 min-w-[140px] border-r border-slate-200 dark:border-slate-800">Item Name</th>
                    <th className="py-1.5 px-2 min-w-[170px] border-r border-slate-200 dark:border-slate-800">Description</th>
                    <th className="py-1.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Used Place</th>
                    <th className="py-1.5 px-2 text-right min-w-[70px] border-r border-slate-200 dark:border-slate-800">Cons/Pcs</th>
                    <th className="py-1.5 px-1.5 text-center min-w-[65px] border-r border-slate-200 dark:border-slate-800">Cons Unit</th>
                    <th className="py-1.5 px-1.5 text-right min-w-[65px] border-r border-slate-200 dark:border-slate-800">Wastage %</th>
                    <th className="py-1.5 px-2 text-right min-w-[75px] border-r border-slate-200 dark:border-slate-800">Wastage Qty</th>
                    <th className="py-1.5 px-2 text-right min-w-[85px] border-r border-slate-200 dark:border-slate-800 font-bold text-teal-700 dark:text-teal-400">Market Qty</th>
                    <th className="py-1.5 px-1.5 text-center min-w-[75px] border-r border-slate-200 dark:border-slate-800">Market Unit</th>
                    <th className="py-1.5 px-2 text-right min-w-[75px] border-r border-slate-200 dark:border-slate-800">Unit Rate ($)</th>
                    <th className="py-1.5 px-2 text-right min-w-[85px] border-r border-slate-200 dark:border-slate-800 font-bold text-emerald-700 dark:text-emerald-400">Amount ($)</th>
                    <th className="py-1.5 px-2 min-w-[100px] border-r border-slate-200 dark:border-slate-800">Nominee Status</th>
                    <th className="py-1.5 px-2 min-w-[150px] border-r border-slate-200 dark:border-slate-800">Supplier</th>
                    <th className="py-1.5 px-1.5 text-center w-14 border-r border-slate-200 dark:border-slate-800">Size</th>
                    <th className="py-1.5 px-1.5 text-center w-14 border-r border-slate-200 dark:border-slate-800">Color</th>
                    <th className="sticky right-0 z-20 bg-slate-100 dark:bg-slate-850 border-l border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center w-20 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      Booking
                    </th>
                  </tr>
                </thead>

                {/* 3.3 Table Body */}
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {accessoriesRows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-teal-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* 1. Row Delete (X) */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="w-5 h-5 flex items-center justify-center rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-950 font-bold"
                          title="Delete Row"
                        >
                          ✕
                        </button>
                      </td>

                      {/* 2. In House? */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          checked={row.inhouse}
                          onChange={(e) => handleRowChange(idx, "inhouse", e.target.checked)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                      </td>

                      {/* 3. Pre Costing Item (Searchable Selectable Modal/Field, No V button) */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          readOnly
                          value={row.budgetItemName}
                          onClick={() => setPreCostItemModalRowIndex(idx)}
                          placeholder="Select Pre Cost Item..."
                          className="w-full px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium cursor-pointer hover:border-teal-400 text-left"
                          title="Click to select Pre Costing Item"
                        />
                      </td>

                      {/* 4. Item Name (Searchable Table-Style Master Lookup) */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          readOnly
                          value={row.itemName || "Select Item..."}
                          onClick={() => {
                            setItemNameModalRowIndex(idx);
                            setItemNameSearchQuery("");
                          }}
                          className="w-full px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 text-[11px] cursor-pointer hover:border-teal-400 text-left"
                          title="Click to search and select Item Name from Master List"
                        />
                      </td>

                      {/* 5. Description */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => handleRowChange(idx, "description", e.target.value)}
                          className="w-full px-1.5 py-0.5 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900 text-slate-600 dark:text-slate-400"
                        />
                      </td>

                      {/* 6. Used Place (Searchable Selectable Dropdown) */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={row.usedPlace}
                          onChange={(e) => handleRowChange(idx, "usedPlace", e.target.value)}
                          className="w-full px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                        >
                          {!USED_PLACE_OPTIONS.includes(row.usedPlace) && row.usedPlace && (
                            <option value={row.usedPlace}>{row.usedPlace}</option>
                          )}
                          {USED_PLACE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 7. Consumption Qty/Pcs */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="number"
                          step="0.001"
                          value={row.consumptionQtyPerPc}
                          onChange={(e) => handleRowChange(idx, "consumptionQtyPerPc", Number(e.target.value))}
                          className="w-full px-1.5 py-0.5 text-right font-mono rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900"
                        />
                      </td>

                      {/* 8. Consumption Unit (Non-editable / Read-only) */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          readOnly
                          value={row.consumptionUnit}
                          className="w-full px-1 py-0.5 text-center font-mono rounded border border-transparent bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed text-[11px]"
                        />
                      </td>

                      {/* 9. Wastage % */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="number"
                          step="0.1"
                          value={row.wastagePct}
                          onChange={(e) => handleRowChange(idx, "wastagePct", Number(e.target.value))}
                          className="w-full px-1.5 py-0.5 text-right font-mono rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-300"
                        />
                      </td>

                      {/* 10. Wastage Qty */}
                      <td className="py-1 px-2 text-right font-mono text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                        {(Number(row.wastageQty) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* 11. Market Qty (Non-editable, exactly 2 decimal places) */}
                      <td className="py-1 px-2 text-right font-mono font-bold text-teal-700 dark:text-teal-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 select-all">
                        {(Number(row.marketQty) || 0).toFixed(2)}
                      </td>

                      {/* 12. Market Unit (Triggers Market Unit – Grs Unit Relation modal) */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={row.marketUnit}
                          onChange={(e) => handleMarketUnitSelect(idx, e.target.value)}
                          className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-semibold"
                        >
                          {MARKET_UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 13. Unit Rate */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="number"
                          step="0.001"
                          value={row.unitRate}
                          onChange={(e) => handleRowChange(idx, "unitRate", Number(e.target.value))}
                          className="w-full px-1.5 py-0.5 text-right font-mono rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900"
                        />
                      </td>

                      {/* 14. Amount */}
                      <td className="py-1 px-2 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">
                        ${(Number(row.amount) || 0).toFixed(2)}
                      </td>

                      {/* 15. Nominee Status (Strictly Nominated | Own Source) */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={row.nomineeStatus === "Nominated" ? "Nominated" : "Own Source"}
                          onChange={(e) => handleRowChange(idx, "nomineeStatus", e.target.value)}
                          className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px]"
                        >
                          {NOMINEE_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 16. Supplier (Searchable Master List Field, No V button) */}
                      <td className="py-1 px-1.5 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          readOnly
                          value={row.supplier || "Select Supplier..."}
                          onClick={() => {
                            setSupplierModalRowIndex(idx);
                            setSupplierSearchQuery("");
                          }}
                          className="w-full px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] cursor-pointer hover:border-teal-400 text-left font-medium text-slate-800 dark:text-slate-200"
                          title="Click to search and select Supplier from Master List"
                        />
                      </td>

                      {/* 17. Size D Button */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleOpenSizeModal(idx)}
                          className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:hover:bg-blue-800 dark:text-blue-200 font-bold rounded text-[10px] border border-blue-300 dark:border-blue-700 shadow-xs"
                          title="Sizewise Item Specification Declaration"
                        >
                          D ({row.sizeRows?.length || 0})
                        </button>
                      </td>

                      {/* 18. Color D Button */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleOpenColorModal(idx)}
                          className="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-800 dark:text-purple-200 font-bold rounded text-[10px] border border-purple-300 dark:border-purple-700 shadow-xs"
                          title="Accessories Color Entry"
                        >
                          D ({row.colorMappings?.length || 0})
                        </button>
                      </td>

                      {/* 19. Booking Column (Sticky Rightmost Column) */}
                      <td className="sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 py-1 px-2 text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                        <button
                          type="button"
                          onClick={() => {
                            navigate({
                              to: "/mm-accessories-booking",
                              search: {
                                source: "estimation",
                                jobId: jobId,
                                ref: jobId,
                                rowId: row.id,
                                accessoryId: row.budgetItemName,
                                itemName: row.itemName,
                                supplier: row.supplier,
                              } as any,
                            });
                          }}
                          className="px-2.5 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:hover:bg-teal-900 dark:text-teal-200 font-semibold rounded text-[11px] border border-teal-300 dark:border-teal-700 transition-colors shadow-xs"
                          title="Open Accessories Booking Form"
                        >
                          Booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* 3.4 Table Footer Totals */}
                <tfoot className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-t-2 border-slate-300 dark:border-slate-700 sticky bottom-0 z-20">
                  <tr>
                    <td colSpan={10} className="py-2 px-3 text-right">
                      Total Estimated Accessories Requirements &amp; Value:
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-teal-700 dark:text-teal-400 text-xs">
                      {totalMarketQty.toFixed(2)}
                    </td>
                    <td colSpan={2}></td>
                    <td className="py-2 px-2 text-right font-mono text-emerald-700 dark:text-emerald-400 text-xs">
                      ${totalAmount.toFixed(2)}
                    </td>
                    <td colSpan={4}></td>
                    <td className="sticky right-0 z-20 bg-slate-200 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 font-bold text-xs rounded border border-slate-300 dark:border-slate-700 flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Accessory Item
              </button>
              <span className="text-[11px] text-slate-500">
                {accessoriesRows.length} items configured | Scroll horizontally to access all parameters
              </span>
            </div>
          </div>

          {/* ================================================================== */}
          {/* 4. FOOTER ACTION BAR (Cleaned: New and Save Only)                  */}
          {/* ================================================================== */}
          <div className="bg-slate-50 dark:bg-slate-850 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 text-xs">
            <button
              type="button"
              onClick={handleNewEstimation}
              className="px-4 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-600 font-bold shadow-xs transition-colors"
            >
              New
            </button>
            <button
              type="button"
              onClick={handleSaveEstimation}
              className="px-5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-xs shadow-teal-600/30 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* MODAL: FIND PRE COSTING (Searchable Table Lookup)                   */}
        {/* ================================================================== */}
        {showPreCostingLookupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Select Pre Costing Record
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreCostingLookupModal(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={preCostingSearchQuery}
                    onChange={(e) => setPreCostingSearchQuery(e.target.value)}
                    placeholder="Search by Pre Costing No, Job ID, Style, Buyer..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Pre Costing No.</th>
                      <th className="py-2 px-3">Job ID</th>
                      <th className="py-2 px-3">Style</th>
                      <th className="py-2 px-3 text-right">Quantity</th>
                      <th className="py-2 px-3 text-right">Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {filteredPreCostings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                          No matching Pre Costing records found.
                        </td>
                      </tr>
                    ) : (
                      filteredPreCostings.map((pc) => (
                        <tr
                          key={pc.id || pc.preCostId}
                          onClick={() => {
                            loadFromPreCosting(pc);
                            setShowPreCostingLookupModal(false);
                          }}
                          className="hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">
                            {pc.preCostId}
                          </td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                            {pc.jobNo || pc.orderNo || "—"}
                          </td>
                          <td className="py-2 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            {pc.styleNo}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {(pc.orderQuantity || 0).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                            ${(pc.totalOrderValue || pc.totalCostPerDzn || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: FIND JOB ID (Searchable Table Lookup)                        */}
        {/* ================================================================== */}
        {showJobIdLookupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Select Job ID Record
                </span>
                <button
                  type="button"
                  onClick={() => setShowJobIdLookupModal(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={jobIdSearchQuery}
                    onChange={(e) => setJobIdSearchQuery(e.target.value)}
                    placeholder="Search by Job ID, Style, Buyer..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Job ID</th>
                      <th className="py-2 px-3">Style</th>
                      <th className="py-2 px-3 text-right">Quantity</th>
                      <th className="py-2 px-3 text-right">Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400 font-sans">
                          No matching Job ID records found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord, idx) => (
                        <tr
                          key={ord.id || idx}
                          onClick={() => {
                            loadFromOrder(ord);
                            setShowJobIdLookupModal(false);
                          }}
                          className="hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">
                            {ord.jobNo || ord.orderNo}
                          </td>
                          <td className="py-2 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            {ord.styleNo}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {(ord.orderQuantity || 0).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                            ${(((ord as any).totalAmount || (ord.orderQuantity * (ord.fobUnitPrice || 4.5))) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: PRE COSTING ITEM LOOKUP (Searchable Accessories Table)       */}
        {/* ================================================================== */}
        {preCostItemModalRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Select Pre Costing Item
                </span>
                <button
                  type="button"
                  onClick={() => setPreCostItemModalRowIndex(null)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={preCostItemSearchQuery}
                    onChange={(e) => setPreCostItemSearchQuery(e.target.value)}
                    placeholder="Search accessory item by code, description, specification..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Item Code</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Specification</th>
                      <th className="py-2 px-3">Used Place</th>
                      <th className="py-2 px-3 text-right">Cons/Pc</th>
                      <th className="py-2 px-2 text-center">Unit</th>
                      <th className="py-2 px-3 text-right">Rate ($)</th>
                      <th className="py-2 px-3">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {availablePreCostItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400 font-sans">
                          No matching accessory items found.
                        </td>
                      </tr>
                    ) : (
                      availablePreCostItems.map((item, iIdx) => (
                        <tr
                          key={item.preCostItemId || iIdx}
                          onClick={() => {
                            if (preCostItemModalRowIndex !== null) {
                              const cons = item.consumptionPerPc || 1;
                              const wPct = item.wastagePct || 3;
                              const ordQty = quantity || 10000;
                              const baseReq = ordQty * cons;
                              const wQty = Math.round(baseReq * (wPct / 100) * 100) / 100;
                              const grossReq = baseReq + wQty;
                              let mUnit = "Pcs";
                              let calcMarketQty = grossReq;
                              if (item.unit === "Gross" || item.itemDescription.toLowerCase().includes("button")) {
                                mUnit = "Gross";
                                calcMarketQty = grossReq / 144;
                              } else if (item.itemDescription.toLowerCase().includes("thread")) {
                                mUnit = "Cones";
                                calcMarketQty = grossReq / 5000;
                              }
                              const uRate = item.unitRate || 0.05;

                              setAccessoriesRows((prev) => {
                                const updated = [...prev];
                                updated[preCostItemModalRowIndex] = {
                                  ...updated[preCostItemModalRowIndex],
                                  budgetItemName: item.itemCode || item.itemDescription,
                                  itemName: mapToStandardItemName(item.itemDescription),
                                  description: item.specification || item.itemDescription,
                                  usedPlace: mapToStandardUsedPlace(item.bodyPartOrUsedPlace),
                                  consumptionQtyPerPc: cons,
                                  consumptionUnit: item.unit || "Pcs",
                                  wastagePct: wPct,
                                  wastageQty: wQty,
                                  marketQty: Math.round(calcMarketQty * 100) / 100,
                                  marketUnit: mUnit,
                                  unitRate: uRate,
                                  amount: Math.round(calcMarketQty * uRate * 100) / 100,
                                  nomineeStatus: item.supplierNominee ? "Nominated" : "Own Source",
                                  supplier: mapToStandardSupplier(item.supplierNominee),
                                };
                                return updated;
                              });
                              setPreCostItemModalRowIndex(null);
                              toast.success(`Populated ${item.itemDescription}.`);
                            }
                          }}
                          className="hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                            {item.itemCode || item.preCostItemId}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {item.itemDescription}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {item.specification || "—"}
                          </td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                            {item.bodyPartOrUsedPlace || "—"}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            {item.consumptionPerPc}
                          </td>
                          <td className="py-2 px-2 text-center font-mono">
                            {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            ${item.unitRate}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {item.supplierNominee || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: ITEM NAME LOOKUP (Searchable Accessories Master Table)       */}
        {/* ================================================================== */}
        {itemNameModalRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Select Accessories Item (Master List)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setItemNameModalRowIndex(null);
                    setItemNameSearchQuery("");
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={itemNameSearchQuery}
                    onChange={(e) => setItemNameSearchQuery(e.target.value)}
                    placeholder="Search accessories items by name, code, category, specification..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Item Code</th>
                      <th className="py-2 px-3">Item Name</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-2 text-center">Default Unit</th>
                      <th className="py-2 px-3">Description / Specification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMasterAccessories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                          No matching accessories found.
                        </td>
                      </tr>
                    ) : (
                      filteredMasterAccessories.map((item) => (
                        <tr
                          key={item.code}
                          onClick={() => {
                            if (itemNameModalRowIndex !== null) {
                              handleRowChange(itemNameModalRowIndex, "itemName", item.name);
                              if (item.description) {
                                handleRowChange(itemNameModalRowIndex, "description", item.description);
                              }
                              setItemNameModalRowIndex(null);
                              setItemNameSearchQuery("");
                              toast.success(`Selected accessory: ${item.name}`);
                            }
                          }}
                          className="hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                            {item.code}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {item.category}
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                            {item.defaultUnit}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {item.description}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: SUPPLIER LOOKUP (Searchable Supplier Master Table)           */}
        {/* ================================================================== */}
        {supplierModalRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Select Supplier (Master List)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSupplierModalRowIndex(null);
                    setSupplierSearchQuery("");
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={supplierSearchQuery}
                    onChange={(e) => setSupplierSearchQuery(e.target.value)}
                    placeholder="Search supplier by name, code, category, location..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Supplier Code</th>
                      <th className="py-2 px-3">Supplier Name</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMasterSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                          No matching suppliers found.
                        </td>
                      </tr>
                    ) : (
                      filteredMasterSuppliers.map((sup) => (
                        <tr
                          key={sup.code}
                          onClick={() => {
                            if (supplierModalRowIndex !== null) {
                              handleRowChange(supplierModalRowIndex, "supplier", sup.name);
                              setSupplierModalRowIndex(null);
                              setSupplierSearchQuery("");
                              toast.success(`Selected supplier: ${sup.name}`);
                            }
                          }}
                          className="hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                            {sup.code}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {sup.name}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {sup.category}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {sup.location}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-mono">
                            {sup.contact}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: UNIT CONVERSION (Market Unit – Grs Unit Relation)           */}
        {/* ================================================================== */}
        {unitConversionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-4 space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <AlertCircle className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Market Unit – Grs Unit Relation
                </h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg space-y-2.5 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Market Unit:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400 uppercase font-mono">
                    {unitConversionModal.newUnit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <label htmlFor="grs-relation-factor" className="text-slate-600 dark:text-slate-300 font-medium">
                    Grs Unit Relation / Factor:
                  </label>
                  <input
                    id="grs-relation-factor"
                    type="number"
                    step="any"
                    min="0.001"
                    value={unitConversionModal.factor}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setUnitConversionModal((prev) => (prev ? { ...prev, factor: val } : null));
                    }}
                    className="w-28 px-2 py-1 text-right rounded border border-teal-500 bg-white dark:bg-slate-900 font-bold font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-slate-200 shadow-2xs"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Consumption Unit:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {unitConversionModal.consUnit}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Applying this change will automatically calculate the Market Quantity based on the conversion ratio above. Do you wish to confirm?
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelUnitConversion}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUnitConversion}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: SIZE D — SIZEWISE ITEM SPECIFICATION DECLARATION          */}
        {/* ================================================================== */}
        {sizeModalRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col text-xs overflow-hidden">
              {/* Modal Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Sizewise Item Specification Declaration
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 font-mono text-xs">
                    {accessoriesRows[sizeModalRowIndex]?.itemName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSizeModalRowIndex(null)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSizeModal}
                    className="px-4 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* Modal Top Header Fields */}
              <div className="p-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Item Name:</label>
                    <input
                      type="text"
                      readOnly
                      value={accessoriesRows[sizeModalRowIndex]?.itemName}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Wastage %:</label>
                    <input
                      type="number"
                      readOnly
                      value={accessoriesRows[sizeModalRowIndex]?.wastagePct}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Market Unit:</label>
                    <input
                      type="text"
                      readOnly
                      value={accessoriesRows[sizeModalRowIndex]?.marketUnit}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Size Fact Type:</label>
                    <select
                      value={sizeFactType}
                      onChange={(e) => setSizeFactType(e.target.value as any)}
                      className="w-full px-2 py-1 rounded border border-teal-500 bg-teal-50 dark:bg-slate-800 font-bold text-teal-800 dark:text-teal-300"
                    >
                      <option value="SAME AS GMT SIZE">SAME AS GMT SIZE</option>
                      <option value="SINGLE SIZE">SINGLE SIZE</option>
                    </select>
                  </div>
                </div>

                {/* If SINGLE SIZE is chosen: Show single size input with V lookup button */}
                {sizeFactType === "SINGLE SIZE" && (
                  <div className="p-2.5 bg-amber-50/70 dark:bg-slate-800/80 rounded-lg border border-amber-200 dark:border-amber-800/40 flex flex-wrap items-center gap-3">
                    <label className="font-bold text-amber-900 dark:text-amber-300 shrink-0 text-xs">
                      Single Size Specification:
                    </label>
                    <div className="flex items-center gap-1.5 flex-1 max-w-md">
                      <input
                        type="text"
                        value={singleSizeSpec}
                        onChange={(e) => setSingleSizeSpec(e.target.value)}
                        placeholder="e.g. 18L (11.5mm) 4-Hole or 25x55 mm Folded..."
                        className="w-full px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleSizeSpecToAll}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs text-xs"
                        title="Apply specification across all size rows"
                      >
                        P
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Specification Grid (ALWAYS RENDERED, PRESERVES GMT SIZES AND QUANTITIES) */}
              <div className="flex-1 overflow-auto p-3 space-y-2">
                <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-700 min-w-[80px]">
                          GMT Size
                        </th>
                        <th className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-700 min-w-[240px]">
                          Item Specification
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[110px]">
                          Required Item Qty
                        </th>
                        <th className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-700 min-w-[90px]">
                          Wastage Qty
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[100px] font-bold text-teal-700 dark:text-teal-400">
                          Total Qty
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[110px]">
                          GMT Order Qty (Read-Only)
                        </th>
                        <th className="py-1.5 px-2.5 text-right min-w-[100px]">
                          Total Wastage (%) (Read-Only)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {sizeRows.map((sr, sIdx) => (
                        <tr key={sr.id || sIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          <td className="py-1.5 px-2.5 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60">
                            {sr.gmtSize}
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-800 font-sans">
                            <input
                              type="text"
                              value={sr.itemSpecification}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSizeRows((prev) => {
                                  const updated = [...prev];
                                  updated[sIdx] = { ...updated[sIdx], itemSpecification: val };
                                  return updated;
                                });
                              }}
                              className="w-full px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-sans text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                          </td>
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800">
                            {sr.requiredItemQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 text-slate-500">
                            {sr.wastageQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800 font-bold text-teal-700 dark:text-teal-400">
                            {sr.totalQty.toLocaleString()}
                          </td>
                          {/* GMT Order Qty: Non-editable / Read-only */}
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800 font-bold bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                            {sr.gmtOrderQty.toLocaleString()}
                          </td>
                          {/* Total Wastage (%): Non-editable / Read-only */}
                          <td className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400">
                            {sr.totalWastagePct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 dark:bg-slate-850 font-bold border-t border-slate-300 dark:border-slate-700 sticky bottom-0">
                      <tr>
                        <td className="py-2 px-2.5 font-sans">
                          No. of Size: {sizeRows.length}
                        </td>
                        <td className="py-2 px-2.5 text-right font-sans">
                          Totals:
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {sizeRows.reduce((a, b) => a + (b.requiredItemQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-500">
                          {sizeRows.reduce((a, b) => a + (b.wastageQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                          {sizeRows.reduce((a, b) => a + (b.totalQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          {sizeRows.reduce((a, b) => a + (b.gmtOrderQty || 0), 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: COLOR D — ACCESSORIES COLOR ENTRY                         */}
        {/* ================================================================== */}
        {colorModalRowIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col text-xs overflow-hidden">
              {/* Modal Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Accessories Color Entry
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 font-mono text-xs">
                    {accessoriesRows[colorModalRowIndex]?.itemName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setColorModalRowIndex(null)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveColorModal}
                    className="px-4 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* Reference Header (Our Ref renamed to Job ID, read-only) */}
              <div className="p-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Job ID:</span>
                    <strong className="font-mono text-teal-700 dark:text-teal-400 text-xs">{jobId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Buyer Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-xs">{buyerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Accessories Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-xs">
                      {accessoriesRows[colorModalRowIndex]?.itemName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Description:</span>
                    <span className="text-slate-600 dark:text-slate-400 truncate block text-xs">
                      {accessoriesRows[colorModalRowIndex]?.description}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Color Type:</label>
                    <select
                      value={colorType}
                      onChange={(e) => {
                        const nextType = e.target.value as any;
                        setColorType(nextType);
                        if (nextType === "DTM") {
                          setColorMappings((prev) =>
                            prev.map((cm) => ({ ...cm, itemColor: cm.garmentsColor }))
                          );
                        }
                      }}
                      className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    >
                      <option value="DTM">DTM</option>
                      <option value="Contrast">Contrast</option>
                      <option value="Single Color">Single Color</option>
                    </select>
                  </div>

                  {colorType === "Single Color" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={singleColorInput}
                        onChange={(e) => setSingleColorInput(e.target.value)}
                        placeholder="Enter uniform color name..."
                        className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs min-w-[200px]"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleColorToAll}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded shadow-xs"
                      >
                        Populate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Column Garments Color and Item Color Mapping Grid (Garments Color Read-only) */}
              <div className="flex-1 overflow-auto p-3">
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 sticky top-0">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-1/2">
                          Garments Color (Read-Only)
                        </th>
                        <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-1/2">
                          Item Color
                        </th>
                        <th className="py-2 px-2 text-center w-12">X</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {colorMappings.map((cm, cIdx) => (
                        <tr key={cm.id || cIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          {/* Garments Color: Non-editable / Read-only */}
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed select-none">
                            {cm.garmentsColor}
                          </td>
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="text"
                              value={cm.itemColor}
                              readOnly={colorType === "DTM"}
                              onChange={(e) => {
                                const val = e.target.value;
                                setColorMappings((prev) => {
                                  const updated = [...prev];
                                  updated[cIdx] = { ...updated[cIdx], itemColor: val };
                                  return updated;
                                });
                              }}
                              className={`w-full px-2 py-0.5 rounded border ${
                                colorType === "DTM"
                                  ? "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 cursor-not-allowed"
                                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-teal-700 dark:text-teal-400"
                              }`}
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (colorMappings.length <= 1) {
                                  toast.warning("At least one color mapping is required.");
                                  return;
                                }
                                setColorMappings((prev) => prev.filter((_, idx) => idx !== cIdx));
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
