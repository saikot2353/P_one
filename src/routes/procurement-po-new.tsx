import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  FileText,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Package,
  Wrench,
  Search,
  Upload,
  Eye,
  FileSpreadsheet,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Lock,
  Printer,
  Check,
  Paperclip,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_WAREHOUSES,
  DEFAULT_SUPPLIERS,
  DEFAULT_ITEMS,
  DEFAULT_ORIGINS,
  DEFAULT_BRANDS,
  DEFAULT_UOMS,
  getStoredData,
} from "@/lib/procurement-master-data";
import {
  DEFAULT_PURCHASE_REQUISITIONS,
  DEFAULT_COMPARATIVE_STATEMENTS,
} from "@/lib/procurement-requisition-data";
import {
  PurchaseOrder,
  POItem,
  WOServiceItem,
  OrderAttachment,
  DocumentType,
  getStoredPurchaseOrders,
  setStoredPurchaseOrders,
  getStoredPoItems,
  setStoredPoItems,
  getStoredWoItems,
  setStoredWoItems,
} from "@/lib/procurement-order-inventory-data";
import pakizaSoftwareLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export const Route = createFileRoute("/procurement-po-new")({
  validateSearch: (search: Record<string, unknown>): { editId?: string; mode?: string } => ({
    editId: search.editId as string | undefined,
    mode: search.mode as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Purchase Order / Work Order — CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Extended Purchase Order & Work Order console with 3 creation methods, dynamic remaining PR/CS consumption, Market Unit & Conversion, editable VAT, and official PDF report.",
      },
    ],
  }),
  component: PurchaseOrderWorkOrderPage,
});

const DEFAULT_TNC_TEMPLATES: Record<string, string> = {
  "Standard Local Goods Purchase":
    "1. Delivery must be completed strictly within 10 days of PO issuance date.\n2. Defective or non-conforming items must be replaced by vendor within 7 working days.\n3. Payment term is 30 calendar days from the date of verified store receipt.\n4. Quality inspection will be conducted at destination store upon arrival.",
  "Machinery & Heavy Equipment Terms":
    "1. Vendor must provide 24 months OEM comprehensive warranty including spare parts.\n2. Pre-delivery test run and commissioning at factory site required.\n3. 10% retention money will be released after 6 months of smooth operation.",
  "Service & Work Order Contract Terms":
    "1. Scope of work must be executed strictly following IEEE safety and engineering standards.\n2. Vendor technicians must hold valid safety certifications.\n3. Vendor must provide complete testing and sign-off report before final billing.\n4. Penalty of 0.5% per week applies for unauthorized project milestone delays.",
  "Custom / General Procurement Terms":
    "1. Prices are firm and fixed through completion of this order.\n2. All deliveries must carry valid Delivery Challan and Tax Invoice copies referencing this PO/WO ID.",
};

export function PurchaseOrderWorkOrderPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const editId = search?.editId;
  const isViewMode = search?.mode === "view";

  // 4. Creation Type (Only one method active)
  const [creationMethod, setCreationMethod] = useState<
    "Purchase Requisition" | "Comparative Statement" | "Direct Purchase Order / Work Order"
  >("Purchase Requisition");

  // 2. Order Header Information (4 columns per row)
  const [docType, setDocType] = useState<DocumentType>("Purchase Order");
  const [orderNumber, setOrderNumber] = useState<string>("PO-2026-0004");
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [prepareBy, setPrepareBy] = useState<string>("Tahmid Afsar Shapno - Asst. Manager");
  const [department, setDepartment] = useState<string>("Information Technology");
  const [selectedPRs, setSelectedPRs] = useState<string[]>([]);
  const [selectedCS, setSelectedCS] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("sup-bengal-02");

  // Load active warehouses & stores from master data
  const availableWarehouses = useMemo(() => {
    const list = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
    return list.filter((w: any) => !w.status || w.status === "Active");
  }, []);

  // Load suppliers from master data
  const availableSuppliers = useMemo(() => {
    return getStoredData("proc_suppliers_v2", DEFAULT_SUPPLIERS);
  }, []);

  const [deliveryWarehouse, setDeliveryWarehouse] = useState<string>(() => {
    const list = getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES);
    return list[0]?.storeName || "PKCL Central Raw Material Warehouse";
  });
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-10-15");
  const [workLocation, setWorkLocation] = useState<string>(
    "Annex Building Server Room & 3rd Floor IT Bay"
  );
  const [currency, setCurrency] = useState<string>("BDT");
  const [exchangeRate, setExchangeRate] = useState<number | "">(1.0);
  const [paymentMode, setPaymentMode] = useState<string>("Credit 30 Days");
  const [poValidDate, setPoValidDate] = useState<string>("2026-11-15");
  const [remarks, setRemarks] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("Draft");

  // Modals
  const [prSearchOpen, setPrSearchOpen] = useState(false);
  const [csSearchOpen, setCsSearchOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState(false);

  // Search terms inside modals
  const [modalPrQuery, setModalPrQuery] = useState("");
  const [modalCsQuery, setModalCsQuery] = useState("");
  const [modalSupplierQuery, setModalSupplierQuery] = useState("");
  const [modalItemQuery, setModalItemQuery] = useState("");

  // Terms and Conditions State
  const [tncTemplates, setTncTemplates] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_tnc_templates_v1");
      if (saved) {
        try {
          return { ...DEFAULT_TNC_TEMPLATES, ...JSON.parse(saved) };
        } catch (e) {
          // ignore
        }
      }
    }
    return DEFAULT_TNC_TEMPLATES;
  });
  const [selectedTncKey, setSelectedTncKey] = useState<string>("Standard Local Goods Purchase");
  const [tncText, setTncText] = useState<string>(DEFAULT_TNC_TEMPLATES["Standard Local Goods Purchase"]);
  const [newTncTitle, setNewTncTitle] = useState("");
  const [newTncContent, setNewTncContent] = useState("");

  // Attachments State (Simple file upload list)
  const [attachments, setAttachments] = useState<OrderAttachment[]>([
    {
      id: "att-1",
      documentType: "Supporting Document",
      documentName: "Technical_Specifications_Sheet.pdf",
      fileName: "Technical_Specifications_Sheet.pdf",
      fileSize: "1.2 MB",
      description: "Approved technical specification document.",
    },
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Order Items for Purchase Order
  const [poItems, setPoItems] = useState<POItem[]>([]);

  // Work Items for Work Order
  const [woItems, setWoItems] = useState<WOServiceItem[]>([]);

  // 3. PR / CS Consumption Tracking Logic (Using Equivalent Base Quantity)
  // Track total consumed base quantity for each itemCode in each PR
  const consumedItemsByPr = useMemo(() => {
    const existingOrders = getStoredPurchaseOrders();
    const poItemsStore = getStoredPoItems();
    const map: Record<string, Record<string, number>> = {};

    existingOrders.forEach((ord) => {
      if (ord.orderStatus === "Rejected" || ord.orderStatus === "Cancelled") return;
      if (editId && ord.id === editId) return; // ignore current order being edited

      const items = poItemsStore[ord.orderNumber] || ord.items || [];
      if (ord.prIds && ord.prIds.length > 0) {
        ord.prIds.forEach((prNo) => {
          if (!map[prNo]) map[prNo] = {};
          items.forEach((it) => {
            const factor = Number(it.conversionFactor) || 1;
            const eqQty = Number(it.equivalentBaseQty) || (Number(it.orderedQuantity) || 0) * factor;
            map[prNo][it.itemCode] = (map[prNo][it.itemCode] || 0) + eqQty;
          });
        });
      }
    });

    return map;
  }, [editId]);

  const consumedItemsByCs = useMemo(() => {
    const existingOrders = getStoredPurchaseOrders();
    const poItemsStore = getStoredPoItems();
    const map: Record<string, Set<string>> = {};

    existingOrders.forEach((ord) => {
      if (ord.orderStatus === "Rejected" || ord.orderStatus === "Cancelled") return;
      if (editId && ord.id === editId) return; // ignore current order being edited

      const items = poItemsStore[ord.orderNumber] || ord.items || [];
      if (ord.csId) {
        const csKey = ord.csId;
        if (!map[csKey]) map[csKey] = new Set();
        items.forEach((it) => {
          map[csKey].add(it.itemCode);
        });
      }
    });

    return map;
  }, [editId]);

  // Available Approved PRs with Remaining Item Logic (Base UOM comparison)
  const availableApprovedPRs = useMemo(() => {
    const allApproved = DEFAULT_PURCHASE_REQUISITIONS.filter((pr) => pr.status === "Approved");

    return allApproved
      .map((pr) => {
        const prConsumed = consumedItemsByPr[pr.prNumber] || {};
        const remainingItems = pr.items
          .map((it) => {
            const consumedBase = prConsumed[it.itemCode] || 0;
            const remainingBase = Math.max(0, (it.requestedQuantity || 0) - consumedBase);
            return {
              ...it,
              requestedQuantity: remainingBase,
              originalQuantity: it.requestedQuantity,
              consumedBaseQuantity: consumedBase,
            };
          })
          .filter((it) => it.requestedQuantity > 0);

        return {
          ...pr,
          totalItemsCount: pr.items.length,
          remainingItems,
          remainingItemsCount: remainingItems.length,
          isFullyConsumed: remainingItems.length === 0,
        };
      })
      .filter((pr) => !pr.isFullyConsumed); // Fully consumed PRs omitted
  }, [consumedItemsByPr]);

  // Available Approved CSs with Remaining Item Logic
  const availableApprovedCSs = useMemo(() => {
    const allApproved = DEFAULT_COMPARATIVE_STATEMENTS.filter((cs) => cs.status === "Approved");

    return allApproved
      .map((cs) => {
        const consumedCodes = consumedItemsByCs[cs.csNumber] || new Set();
        const csItems = cs.itemComparison || [];
        const remainingItems = csItems.filter((it) => !consumedCodes.has(it.itemCode));
        return {
          ...cs,
          totalItemsCount: csItems.length,
          remainingItems,
          remainingItemsCount: remainingItems.length,
          isFullyConsumed: remainingItems.length === 0,
        };
      })
      .filter((cs) => !cs.isFullyConsumed); // 3. Fully consumed CSs no longer appear in available CS list!
  }, [consumedItemsByCs]);

  // Selected CS record details
  const activeCSDetails = useMemo(() => {
    return DEFAULT_COMPARATIVE_STATEMENTS.find((cs) => cs.csNumber === selectedCS);
  }, [selectedCS]);

  // 3. CS Supplier Lock: If CS is selected, supplier is auto-populated and read-only
  useEffect(() => {
    if (creationMethod === "Comparative Statement" && activeCSDetails) {
      const winnerName = activeCSDetails.recommendedSupplierName || activeCSDetails.suppliers?.[0]?.supplierName;
      if (winnerName) {
        const matched = DEFAULT_SUPPLIERS.find(
          (s) => s.vendorName.toLowerCase().includes(winnerName.toLowerCase()) || winnerName.toLowerCase().includes(s.vendorName.toLowerCase())
        );
        if (matched) {
          setSupplierId(matched.id);
        }
      }
    }
  }, [creationMethod, activeCSDetails]);

  // Current Supplier Object
  const currentSupplier = useMemo(() => {
    return (
      DEFAULT_SUPPLIERS.find((s) => s.id === supplierId || s.vendorCode === supplierId) ||
      DEFAULT_SUPPLIERS[0]
    );
  }, [supplierId]);

  // Load order data if in edit mode
  useEffect(() => {
    if (editId) {
      const existing = getStoredPurchaseOrders().find((o) => o.id === editId);
      if (existing) {
        setDocType(existing.documentType);
        setOrderNumber(existing.orderNumber);
        setOrderDate(existing.orderDate);
        setPrepareBy(existing.prepareBy);
        setDepartment(existing.department);
        setCreationMethod(
          existing.creationMethod ||
            (existing.csId ? "Comparative Statement" : existing.prIds?.length ? "Purchase Requisition" : "Direct Purchase Order / Work Order")
        );
        setSelectedPRs(existing.prIds || []);
        setSelectedCS(existing.csId || "");
        setSupplierId(existing.supplierId);
        setDeliveryWarehouse(existing.deliveryWarehouse || "");
        setWorkLocation(existing.workLocation || "");
        setDeliveryDate(existing.deliveryDate || new Date().toISOString().slice(0, 10));
        setCurrency(existing.currency || "BDT");
        setExchangeRate(existing.exchangeRate || 1.0);
        setPaymentMode(existing.paymentMode || "Credit 30 Days");
        setPoValidDate(existing.poValidDate || "2026-11-15");
        setRemarks(existing.remarks || "");
        setOrderStatus(existing.orderStatus);
        if (existing.termsAndConditions) {
          setTncText(existing.termsAndConditions);
        }
        if (existing.attachments) {
          setAttachments(existing.attachments);
        }

        const itemsMap = getStoredPoItems();
        if (itemsMap[existing.orderNumber]) {
          setPoItems(itemsMap[existing.orderNumber]);
        } else if (existing.items) {
          setPoItems(existing.items);
        }

        const woMap = getStoredWoItems();
        if (woMap[existing.orderNumber]) {
          setWoItems(woMap[existing.orderNumber]);
        } else if (existing.woItems) {
          setWoItems(existing.woItems);
        }

        toast.info(`Loaded ${existing.documentType} "${existing.orderNumber}" for editing.`);
      }
    }
  }, [editId]);

  // Auto-generate PO/WO number on type change if not editing
  useEffect(() => {
    if (!editId) {
      const prefix = docType === "Purchase Order" ? "PO" : "WO";
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setOrderNumber(`${prefix}-2026-${randNum}`);
    }
  }, [docType, editId]);

  // 4. Creation method changes control available fields & items dynamically
  const handleCreationMethodChange = (
    method: "Purchase Requisition" | "Comparative Statement" | "Direct Purchase Order / Work Order"
  ) => {
    setCreationMethod(method);
    if (method === "Purchase Requisition") {
      setSelectedCS("");
      // Keep or prompt items
    } else if (method === "Comparative Statement") {
      setSelectedPRs([]);
      // Select first available CS if not selected
      if (availableApprovedCSs.length > 0 && !selectedCS) {
        setSelectedCS(availableApprovedCSs[0].csNumber);
      }
    } else {
      setSelectedPRs([]);
      setSelectedCS("");
    }
    toast.info(`Creation method switched to "${method}". Available catalog items adjusted.`);
  };

  // 7, 8, 9. Order Item Calculations & Financial Summary
  const poTotals = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let vat = 0;

    poItems.forEach((item) => {
      // 8. Order Quantity x MU Unit Price
      const lineBase = (item.orderedQuantity || 0) * (item.unitPrice || 0);
      const lineDisc = item.discount || 0;
      const lineTaxable = Math.max(0, lineBase - lineDisc);
      // 7. VAT calculation based on editable vatRate
      const lineVat = (lineTaxable * (item.vatRate || 0)) / 100;

      sub += lineBase;
      disc += lineDisc;
      vat += lineVat;
    });

    return {
      subtotal: sub,
      discount: disc,
      vat: vat,
      grandTotal: sub - disc + vat,
    };
  }, [poItems]);

  const woTotals = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let vat = 0;

    woItems.forEach((item) => {
      const lineBase = (item.workOrderQuantity || 0) * (item.unitRate || 0);
      const lineVat = (lineBase * (item.vatRate || 5)) / 100;
      sub += lineBase;
      vat += lineVat;
    });

    return {
      subtotal: sub,
      discount: 0,
      vat: vat,
      grandTotal: sub + vat,
    };
  }, [woItems]);

  const activeTotals = docType === "Purchase Order" ? poTotals : woTotals;

  // 6. Available Catalog Items based on Creation Method
  const catalogItemsForSelection = useMemo(() => {
    if (creationMethod === "Purchase Requisition") {
      // Items from tagged PRs that are unconsumed
      const items: any[] = [];
      selectedPRs.forEach((prNo) => {
        const pr = availableApprovedPRs.find((p) => p.prNumber === prNo);
        if (pr) {
          pr.remainingItems.forEach((it) => {
            items.push({
              itemCode: it.itemCode,
              itemName: it.itemName,
              specification: it.specification || it.specifications || "Standard commercial specification",
              brand: it.brand || it.preferredBrand || "OEM",
              origin: it.origin || it.preferredOrigin || "Bangladesh",
              uom: it.uom || "PCS",
              prQuantity: it.requestedQuantity || it.requiredQuantity || 10,
              estimatedUnitPrice: it.estimatedUnitPrice || 500,
              source: `PR: ${prNo}`,
            });
          });
        }
      });
      return items;
    } else if (creationMethod === "Comparative Statement") {
      // Items from selected CS that are unconsumed
      const cs = availableApprovedCSs.find((c) => c.csNumber === selectedCS);
      if (!cs) return [];
      return cs.remainingItems.map((it) => ({
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification || "Standard commercial grade",
        brand: "OEM",
        origin: "Bangladesh",
        uom: it.unit || "PCS",
        prQuantity: it.requiredQty || 10,
        estimatedUnitPrice: it.lowestUnitPrice || it.estimatedUnitPrice || 1000,
        source: `CS: ${selectedCS}`,
      }));
    } else {
      // Direct PO/WO: All active items from Item Master
      return DEFAULT_ITEMS.filter((i) => i.status === "Active").map((it) => ({
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification || "Standard commercial specification",
        brand: it.brand || "OEM",
        origin: it.origin || "Bangladesh",
        uom: it.stockUOM || it.purchaseUOM || "PCS",
        prQuantity: 0,
        estimatedUnitPrice: it.standardPurchasePrice || 500,
        source: "Item Master (Direct)",
      }));
    }
  }, [creationMethod, selectedPRs, selectedCS, availableApprovedPRs, availableApprovedCSs]);

  // Filter Catalog Items inside Modal
  const filteredCatalogItems = useMemo(() => {
    if (!modalItemQuery.trim()) return catalogItemsForSelection;
    const q = modalItemQuery.toLowerCase();
    return catalogItemsForSelection.filter(
      (it) =>
        it.itemName.toLowerCase().includes(q) ||
        it.itemCode.toLowerCase().includes(q) ||
        it.specification.toLowerCase().includes(q) ||
        it.brand.toLowerCase().includes(q) ||
        it.origin.toLowerCase().includes(q)
    );
  }, [catalogItemsForSelection, modalItemQuery]);

  // Check if item is already added to table (Duplicate prevention)
  const isItemAlreadyAdded = (itemCode: string) => {
    return poItems.some((it) => it.itemCode === itemCode);
  };

  // 6 & 8. Add Item from Catalog
  const handleAddPoItem = (catalogItem: any) => {
    if (isItemAlreadyAdded(catalogItem.itemCode)) {
      toast.error(`Item "${catalogItem.itemName}" is already in the order. Duplicate items are not allowed.`);
      return;
    }

    const defaultUom = catalogItem.uom || "PCS";
    const defaultMu = defaultUom;
    const factor = 1;
    const unitPrice = catalogItem.estimatedUnitPrice || 500;
    const qty = catalogItem.prQuantity > 0 ? catalogItem.prQuantity : 1;
    const eqBaseQty = qty * factor;
    const vatRate = 5; // default 5%
    const lineTotal = qty * unitPrice * (1 + vatRate / 100);

    const newItem: POItem = {
      id: `poi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sl: poItems.length + 1,
      itemCode: catalogItem.itemCode,
      itemName: catalogItem.itemName,
      specification: catalogItem.specification || "Standard commercial specification",
      brand: catalogItem.brand || "OEM",
      origin: catalogItem.origin || "Bangladesh",
      uom: defaultUom, // SKU / Base UOM
      marketUnit: defaultMu, // Market Unit (MU)
      conversion: `1 ${defaultMu} = ${factor} ${defaultUom}`,
      conversionFactor: factor,
      equivalentBaseQty: eqBaseQty,
      remainingPrQuantity: Math.max(0, (catalogItem.prQuantity || 0) - eqBaseQty),
      prQuantity: catalogItem.prQuantity || 0,
      orderedQuantity: qty,
      unitPrice: unitPrice,
      discount: 0,
      vatRate: vatRate, // 7. Editable VAT
      vatAmount: (qty * unitPrice * vatRate) / 100,
      lineTotal: lineTotal,
      remarks: "",
    };

    setPoItems((prev) => [...prev, newItem]);
    setItemSearchOpen(false);
    toast.success(`Added "${catalogItem.itemName}" to Order.`);
  };

  // Auto-populate item details when PR(s) are selected
  const populateItemsFromPRs = (prNumbers: string[]) => {
    if (prNumbers.length === 0) {
      setPoItems([]);
      return;
    }
    const newItems: POItem[] = [];
    let sl = 1;
    prNumbers.forEach((prNo) => {
      const pr =
        availableApprovedPRs.find((p) => p.prNumber === prNo) ||
        DEFAULT_PURCHASE_REQUISITIONS.find((p) => p.prNumber === prNo);
      if (pr) {
        const itemsToUse =
          (pr as any).remainingItems && (pr as any).remainingItems.length > 0
            ? (pr as any).remainingItems
            : pr.items;
        itemsToUse.forEach((it: any) => {
          const uom = it.uom || "PCS";
          const qty = it.requestedQuantity || it.requiredQuantity || 1;
          const unitPrice = it.estimatedUnitPrice || 500;
          const vatRate = 5;
          const lineTotal = qty * unitPrice * 1.05;
          newItems.push({
            id: `poi-pr-${prNo}-${it.itemCode}-${Date.now()}-${sl}`,
            sl: sl++,
            itemCode: it.itemCode,
            itemName: it.itemName,
            specification:
              it.specification || it.specifications || "Standard specification",
            brand: it.brand || it.preferredBrand || "OEM",
            origin: it.origin || it.preferredOrigin || "Bangladesh",
            uom,
            marketUnit: uom,
            conversion: `1 ${uom} = 1 ${uom}`,
            conversionFactor: 1,
            equivalentBaseQty: qty,
            remainingPrQuantity: qty,
            prQuantity: qty,
            orderedQuantity: qty,
            unitPrice,
            discount: 0,
            vatRate,
            vatAmount: (qty * unitPrice * vatRate) / 100,
            lineTotal,
            remarks: `Sourced from PR: ${prNo}`,
          });
        });
      }
    });
    if (newItems.length > 0) {
      setPoItems(newItems);
      toast.success(`Automatically populated ${newItems.length} item(s) from PR (${prNumbers.join(", ")}).`);
    }
  };

  // Auto-populate item details when CS is selected
  const populateItemsFromCS = (csNo: string) => {
    if (!csNo) return;
    const cs =
      availableApprovedCSs.find((c) => c.csNumber === csNo) ||
      DEFAULT_COMPARATIVE_STATEMENTS.find((c) => c.csNumber === csNo);
    if (!cs) return;
    const itemsToUse =
      (cs as any).remainingItems && (cs as any).remainingItems.length > 0
        ? (cs as any).remainingItems
        : cs.itemComparison || [];
    const newItems: POItem[] = [];
    let sl = 1;
    itemsToUse.forEach((it: any) => {
      const uom = it.unit || it.uom || "PCS";
      const qty = it.requiredQty || 1;
      const unitPrice = it.lowestUnitPrice || it.estimatedUnitPrice || 1000;
      const vatRate = 5;
      const lineTotal = qty * unitPrice * 1.05;
      newItems.push({
        id: `poi-cs-${csNo}-${it.itemCode}-${Date.now()}-${sl}`,
        sl: sl++,
        itemCode: it.itemCode,
        itemName: it.itemName,
        specification: it.specification || "Standard commercial grade",
        brand: it.brand || "OEM",
        origin: it.origin || "Bangladesh",
        uom,
        marketUnit: uom,
        conversion: `1 ${uom} = 1 ${uom}`,
        conversionFactor: 1,
        equivalentBaseQty: qty,
        remainingPrQuantity: qty,
        prQuantity: qty,
        orderedQuantity: qty,
        unitPrice,
        discount: 0,
        vatRate,
        vatAmount: (qty * unitPrice * vatRate) / 100,
        lineTotal,
        remarks: `Sourced from CS: ${csNo}`,
      });
    });
    if (newItems.length > 0) {
      setPoItems(newItems);
      toast.success(`Automatically populated ${newItems.length} item(s) from CS "${csNo}".`);
    }
  };

  // Update Item in PO
  const handleUpdatePoItem = (id: string, field: keyof POItem | "conversionFactor", val: any) => {
    setPoItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };

          // If Market Unit changed, set intelligent default conversion factor & update conversion text
          if (field === "marketUnit") {
            const newMu = String(val);
            let factor = Number(item.conversionFactor) || 1;
            if (newMu.toLowerCase() === "dozen" && item.uom.toLowerCase() === "pcs") {
              factor = 12;
            } else if (newMu.toLowerCase() === item.uom.toLowerCase()) {
              factor = 1;
            }
            updated.conversionFactor = factor;
            updated.conversion = `1 ${newMu} = ${factor} ${item.uom}`;
          }

          if (field === "conversionFactor") {
            const factor = Math.max(0.0001, Number(val) || 1);
            updated.conversionFactor = factor;
            updated.conversion = `1 ${updated.marketUnit || updated.uom} = ${factor} ${updated.uom}`;
          }

          // Dynamic calculation:
          // Equivalent Base Quantity = Order Quantity * Conversion Factor
          const qty = Number(updated.orderedQuantity) || 0;
          const factor = Number(updated.conversionFactor) || 1;
          const eqBaseQty = qty * factor;
          updated.equivalentBaseQty = eqBaseQty;

          // Remaining PR quantity calculation
          if (updated.prQuantity) {
            updated.remainingPrQuantity = Math.max(0, updated.prQuantity - eqBaseQty);
          }

          // Total Amount = Order Quantity * Market Unit Price
          const price = Number(updated.unitPrice) || 0;
          const disc = Number(updated.discount) || 0;
          const vatR = Number(updated.vatRate) || 0;

          const base = qty * price;
          const taxable = Math.max(0, base - disc);
          const vatAmt = (taxable * vatR) / 100;

          updated.vatAmount = vatAmt;
          updated.lineTotal = taxable + vatAmt;

          return updated;
        }
        return item;
      })
    );
  };

  const handleRemovePoItem = (id: string) => {
    setPoItems((prev) => prev.filter((it) => it.id !== id));
    toast.info("Item removed from order list.");
  };

  // Add / Update Work Order items
  const handleAddWoItem = () => {
    const newWo: WOServiceItem = {
      id: `woi-${Date.now()}`,
      sl: woItems.length + 1,
      serviceName: "Equipment Preventive Overhaul & Maintenance",
      serviceCode: `SRV-ENG-${Math.floor(10 + Math.random() * 90)}`,
      workDescription: "Comprehensive diagnostic inspection, calibration, and replacement of consumable filters.",
      specification: "Strict compliance with OEM technical service manual.",
      uom: "Job",
      marketUnit: "Job",
      conversion: "1 Job = 1 Job",
      estimatedQuantity: 1,
      workOrderQuantity: 1,
      unitRate: 35000,
      vatRate: 5,
      vatAmount: 1750,
      lineTotal: 36750,
      serviceStartDate: new Date().toISOString().slice(0, 10),
      serviceEndDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      remarks: "Field engineer sign-off required",
    };
    setWoItems((prev) => [...prev, newWo]);
    toast.success("Service / Work line added.");
  };

  const handleUpdateWoItem = (id: string, field: keyof WOServiceItem, val: any) => {
    setWoItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          const qty = Number(updated.workOrderQuantity) || 0;
          const rate = Number(updated.unitRate) || 0;
          const vatR = Number(updated.vatRate) || 5;
          const base = qty * rate;
          const vat = (base * vatR) / 100;
          updated.vatAmount = vat;
          updated.lineTotal = base + vat;
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveWoItem = (id: string) => {
    setWoItems((prev) => prev.filter((it) => it.id !== id));
    toast.info("Service item removed.");
  };

  // 10. Terms & Conditions Template Selection & Maintenance
  const handleTncSelect = (key: string) => {
    setSelectedTncKey(key);
    if (tncTemplates[key]) {
      setTncText(tncTemplates[key]);
    }
  };

  const handleSaveNewTemplate = () => {
    if (!newTncTitle.trim() || !newTncContent.trim()) {
      toast.error("Please provide both Template Name and Terms Description.");
      return;
    }
    const updated = { ...tncTemplates, [newTncTitle.trim()]: newTncContent.trim() };
    setTncTemplates(updated);
    setSelectedTncKey(newTncTitle.trim());
    setTncText(newTncContent.trim());
    if (typeof window !== "undefined") {
      localStorage.setItem("cripton_tnc_templates_v1", JSON.stringify(updated));
    }
    setNewTemplateModalOpen(false);
    setNewTncTitle("");
    setNewTncContent("");
    toast.success(`Terms Template "${newTncTitle}" saved successfully!`);
  };

  // 11. Simple File Upload (Removed attachment-type dropdown)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: OrderAttachment = {
        id: `att-${Date.now()}`,
        documentType: "Supporting Document",
        documentName: file.name,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        description: "Uploaded order document",
      };
      setAttachments((prev) => [...prev, newAtt]);
      toast.success(`Attached file "${file.name}".`);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Attachment removed.");
  };

  // Final Form Submission
  const handleSubmitOrder = (asDraft: boolean) => {
    if (!orderNumber.trim()) {
      toast.error("PO/WO Number is required.");
      return;
    }
    if (docType === "Purchase Order" && poItems.length === 0) {
      toast.error("At least one Order Item is required.");
      return;
    }
    if (docType === "Work Order" && woItems.length === 0) {
      toast.error("At least one Service / Work line is required.");
      return;
    }

    const newOrderStatus = asDraft ? "Draft" : "Submitted";

    const savedOrder: PurchaseOrder = {
      id: editId || `ord-${Date.now()}`,
      orderNumber,
      documentType: docType,
      creationMethod,
      orderDate,
      prepareBy,
      department,
      prIds: selectedPRs,
      csId: selectedCS || undefined,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.vendorName,
      supplierCode: currentSupplier.vendorCode,
      supplierAddress: currentSupplier.address,
      contactPerson: currentSupplier.contactPersonName || (currentSupplier as any).contactPerson,
      designation: currentSupplier.designation,
      contactNumber: currentSupplier.mobileNumber || (currentSupplier as any).mobile,
      supplierEmail: currentSupplier.emailAddress || (currentSupplier as any).email,
      deliveryWarehouse,
      deliveryDate,
      workLocation,
      currency,
      exchangeRate: typeof exchangeRate === "number" ? exchangeRate : 1.0,
      paymentMode,
      poValidDate,
      subtotal: activeTotals.subtotal,
      discountTotal: activeTotals.discount,
      vatTotal: activeTotals.vat,
      grandTotal: activeTotals.grandTotal,
      termsAndConditions: tncText,
      attachments,
      orderStatus: newOrderStatus,
      currentApprovalLevel: 1,
      approvalHistory: [
        {
          level: 1,
          approver: prepareBy,
          designation: department,
          action: asDraft ? "Draft" : "Submitted",
          dateTime: `${orderDate} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          remarks: asDraft ? "Saved as Draft" : "Submitted for Managerial Review & Approval",
        },
      ],
      remarks,
      items: docType === "Purchase Order" ? poItems : undefined,
      woItems: docType === "Work Order" ? woItems : undefined,
    };

    const existing = getStoredPurchaseOrders();
    const updated = [savedOrder, ...existing.filter((o) => o.id !== savedOrder.id && o.orderNumber !== orderNumber)];
    setStoredPurchaseOrders(updated);

    if (docType === "Purchase Order") {
      const storedPo = getStoredPoItems();
      storedPo[orderNumber] = poItems;
      setStoredPoItems(storedPo);
    } else {
      const storedWo = getStoredWoItems();
      storedWo[orderNumber] = woItems;
      setStoredWoItems(storedWo);
    }

    if (asDraft) {
      toast.success(`${docType} "${orderNumber}" saved as Draft.`);
      navigate({ to: "/procurement-po-list" });
    } else {
      toast.success(`${docType} "${orderNumber}" has been Submitted for Approval!`);
      navigate({ to: "/procurement-po-work-order-approval" });
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                    {docType === "Work Order" ? "Work Order" : "Purchase Order"}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {isViewMode ? "Order Details" : editId ? "Edit Order" : "Order Form"}
                  </span>
                </div>
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  {isViewMode
                    ? `${docType}: ${orderNumber}`
                    : editId
                      ? `Edit ${docType}: ${orderNumber}`
                      : `New ${docType} / Work Order`}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                title="Preview Standard Report"
              >
                <Printer className="size-3.5" />
                <span>Preview Report</span>
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-list" })}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Orders</span>
              </button>
            </div>
          </div>

          {/* DEDICATED FORM VIEW (Create / Edit / View) */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 lg:p-7 shadow-xs space-y-7">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-list" })}
                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Order List</span>
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isViewMode
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                  }`}
                >
                  Status: {isViewMode ? "Approved" : "Draft"}
                </span>
              </div>
            </div>

            {/* ORDER CREATION METHOD */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <Layers className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-foreground">Creation Method *</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "Purchase Requisition",
                    title: "Purchase Requisition",
                    desc: "Generate order from approved requisition items",
                    icon: Package,
                  },
                  {
                    id: "Comparative Statement",
                    title: "Comparative Statement",
                    desc: "Bind vendor & rates from approved CS",
                    icon: FileSpreadsheet,
                  },
                  {
                    id: "Direct Purchase Order / Work Order",
                    title: "Direct PO / WO",
                    desc: "Direct procurement entry without prior PR/CS",
                    icon: Sparkles,
                  },
                ].map((m) => {
                  const isSelected = creationMethod === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      disabled={isViewMode}
                      onClick={() => handleCreationMethodChange(m.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer disabled:cursor-not-allowed ${
                        isSelected
                          ? "border-blue-500/60 bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-500/30"
                          : "border-border/80 bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <span>{m.title}</span>
                          {isSelected && <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 1: ORDER HEADER INFORMATION (Clean 4-Column Responsive ERP Grid) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-foreground">1. Order Header Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Field 1: Document Type */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Document Type *</label>
                  <select
                    disabled={isViewMode}
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70 cursor-pointer"
                  >
                    <option value="Purchase Order">Purchase Order (Goods)</option>
                    <option value="Work Order">Work Order (Services)</option>
                  </select>
                </div>

                {/* Field 2: Order Number */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Order Number *</label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-mono font-bold text-foreground outline-none disabled:opacity-70 focus:border-blue-500"
                  />
                </div>

                {/* Field 3: Order Date */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Order Date *</label>
                  <input
                    type="date"
                    disabled={isViewMode}
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70"
                  />
                </div>

                {/* Field 4: Prepared By */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Prepared By</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={prepareBy}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                  />
                </div>

                {/* Field 5: Department */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Department</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={department}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                  />
                </div>

                {/* Field 6: Supplier / Vendor */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center justify-between">
                    <span>Supplier / Vendor *</span>
                    {creationMethod === "Comparative Statement" && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                        <Lock className="size-2.5" /> CS Locked
                      </span>
                    )}
                  </label>
                  {creationMethod === "Comparative Statement" ? (
                    <div className="w-full h-8.5 px-3 bg-muted/50 border border-border/80 rounded-lg text-xs font-semibold flex items-center justify-between text-foreground cursor-not-allowed">
                      <span className="truncate">{currentSupplier.vendorName}</span>
                      <Lock className="size-3 text-muted-foreground shrink-0" />
                    </div>
                  ) : isViewMode ? (
                    <input
                      type="text"
                      disabled
                      value={currentSupplier.vendorName}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSupplierModalOpen(true)}
                      className="w-full h-8.5 px-3 bg-background border border-border/80 hover:border-blue-500 rounded-lg text-xs text-left font-semibold flex items-center justify-between cursor-pointer transition"
                    >
                      <span className="truncate">{currentSupplier.vendorName}</span>
                      <Search className="size-3.5 text-muted-foreground shrink-0" />
                    </button>
                  )}
                </div>

                {/* Field 7: Delivery Warehouse / Work Location */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    {docType === "Purchase Order" ? "Delivery Warehouse *" : "Work Location *"}
                  </label>
                  {docType === "Purchase Order" ? (
                    <select
                      disabled={isViewMode}
                      value={deliveryWarehouse}
                      onChange={(e) => setDeliveryWarehouse(e.target.value)}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70 cursor-pointer"
                    >
                      {availableWarehouses.map((w) => (
                        <option key={w.id} value={w.storeName}>
                          {w.storeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled={isViewMode}
                      value={workLocation}
                      onChange={(e) => setWorkLocation(e.target.value)}
                      placeholder="e.g. Annex Server Room"
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs outline-none focus:border-blue-500 disabled:opacity-70"
                    />
                  )}
                </div>

                {/* Field 8: Expected Delivery Date */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Expected Delivery Date *</label>
                  <input
                    type="date"
                    disabled={isViewMode}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70"
                  />
                </div>

                {/* Field 9: Currency & Rate */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Currency &amp; Rate</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      disabled={isViewMode}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-8.5 px-2 bg-background border border-border/80 rounded-lg text-xs font-bold outline-none focus:border-blue-500 disabled:opacity-70 cursor-pointer"
                    >
                      <option value="BDT">BDT (৳)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      disabled={isViewMode || currency === "BDT"}
                      value={currency === "BDT" ? 1.0 : exchangeRate}
                      onChange={(e) => setExchangeRate(parseFloat(e.target.value) || "")}
                      placeholder="Rate"
                      className={`w-full h-8.5 px-2 border border-border/80 rounded-lg text-xs outline-none ${
                        currency === "BDT" ? "bg-muted/50 cursor-not-allowed" : "bg-background focus:border-blue-500 font-bold"
                      }`}
                    />
                  </div>
                </div>

                {/* Field 10: Payment Mode / Terms */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Payment Mode / Terms</label>
                  <select
                    disabled={isViewMode}
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70 cursor-pointer"
                  >
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 60 Days">Credit 60 Days</option>
                    <option value="Credit / LC 90 Days">Credit / LC 90 Days</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    <option value="100% Advance Payment">100% Advance Payment</option>
                  </select>
                </div>

                {/* Field 11: Purchase Requisition (Tag PRs) */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground flex items-center justify-between">
                    <span>Purchase Requisition</span>
                    {creationMethod === "Purchase Requisition" && !isViewMode && (
                      <button
                        type="button"
                        onClick={() => setPrSearchOpen(true)}
                        className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        + Tag PRs
                      </button>
                    )}
                  </label>
                  {creationMethod === "Purchase Requisition" ? (
                    <div
                      onClick={() => !isViewMode && setPrSearchOpen(true)}
                      className={`w-full min-h-[34px] px-2.5 py-1 bg-background border border-border/80 rounded-lg text-xs flex flex-wrap items-center gap-1 ${
                        !isViewMode ? "hover:border-blue-500 cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {selectedPRs.length > 0 ? (
                        selectedPRs.map((prNo) => (
                          <span
                            key={prNo}
                            className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold flex items-center gap-1"
                          >
                            {prNo}
                            {!isViewMode && (
                              <X
                                className="size-3 hover:text-rose-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPRs(selectedPRs.filter((p) => p !== prNo));
                                }}
                              />
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                          <Search className="size-3" /> Tag Approved PRs...
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="Disabled (Method: Not PR)"
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                    />
                  )}
                </div>

                {/* Field 12: Comparative Statement (CS) */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">Comparative Statement (CS)</label>
                  {creationMethod === "Comparative Statement" ? (
                    isViewMode ? (
                      <input
                        type="text"
                        disabled
                        value={selectedCS || "N/A"}
                        className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-mono font-medium text-muted-foreground outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCsSearchOpen(true)}
                        className="w-full h-8.5 px-3 bg-background border border-border/80 hover:border-blue-500 rounded-lg text-xs text-left font-mono font-semibold flex items-center justify-between cursor-pointer transition"
                      >
                        <span className="truncate">{selectedCS || "Select Approved CS..."}</span>
                        <Search className="size-3.5 text-muted-foreground shrink-0" />
                      </button>
                    )
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="Disabled (Method: Not CS)"
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                    />
                  )}
                </div>

                {/* Field 13: Job Description / Remarks (Full 4-Column Span) */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Job Description / Subject Remarks
                  </label>
                  <input
                    type="text"
                    disabled={isViewMode}
                    placeholder="e.g. IT server room networking hardware procurement and installation"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs outline-none focus:border-blue-500 disabled:opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: ORDER ITEM DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground">
                    2. {docType === "Purchase Order" ? "Order Item Details" : "Service / Scope of Work Details"}
                  </h2>
                </div>

                {!isViewMode && (
                  <div className="flex items-center gap-2">
                    {docType === "Purchase Order" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setModalItemQuery("");
                          setItemSearchOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Item from Catalog</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddWoItem}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Service Line</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Table Container */}
              <div className="rounded-xl border border-border/70 overflow-x-auto">
                {docType === "Purchase Order" ? (
                  <table className="w-full text-left text-xs min-w-[1100px]">
                    <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">SL</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Item Description &amp; Code</th>
                        <th className="py-2.5 px-3 min-w-[140px]">Specification</th>
                        <th className="py-2.5 px-3 w-28">Brand / Origin</th>
                        <th className="py-2.5 px-3 text-center w-20">SKU UOM</th>
                        <th className="py-2.5 px-3 text-center w-24">Market Unit (MU)</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Conversion</th>
                        <th className="py-2.5 px-3 text-right w-24">Order Qty</th>
                        <th className="py-2.5 px-3 text-right w-28">Base Qty</th>
                        <th className="py-2.5 px-3 min-w-[110px] w-28 text-right">Unit Price (৳)</th>
                        <th className="py-2.5 px-3 text-right w-20">Discount (৳)</th>
                        <th className="py-2.5 px-3 text-right min-w-[90px] w-24">VAT (%)</th>
                        <th className="py-2.5 px-3 text-right w-28">Total (৳)</th>
                        {!isViewMode && <th className="py-2.5 px-3 text-center w-14">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {poItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="py-2 px-3 text-center font-mono font-bold text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-bold text-foreground">{item.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{item.itemCode}</div>
                          </td>
                          <td className="py-2 px-3 text-[11px] text-muted-foreground max-w-[200px] truncate" title={item.specification}>
                            {item.specification}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                            {item.brand} / {item.origin}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-foreground">
                            {item.uom}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {isViewMode ? (
                              <span className="font-bold text-blue-600 dark:text-blue-400">{item.marketUnit || item.uom}</span>
                            ) : (
                              <select
                                value={item.marketUnit || item.uom}
                                onChange={(e) => handleUpdatePoItem(item.id, "marketUnit", e.target.value)}
                                className="w-full h-7 px-1.5 bg-background border border-border/80 rounded-md text-xs font-bold text-blue-600 dark:text-blue-400 outline-none focus:border-blue-500 cursor-pointer"
                              >
                                {DEFAULT_UOMS.map((u) => (
                                  <option key={u.id} value={u.uomCode}>
                                    {u.uomCode}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <span className="font-mono text-[11px]">
                                1 {item.marketUnit || item.uom} = {item.conversionFactor ?? 1} {item.uom}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 font-mono text-[11px] whitespace-nowrap bg-muted/30 p-1 rounded-md border border-border/60">
                                <span className="font-semibold text-foreground">1 {item.marketUnit || item.uom} =</span>
                                <input
                                  type="number"
                                  min="0.001"
                                  step="any"
                                  value={item.conversionFactor ?? 1}
                                  onChange={(e) => handleUpdatePoItem(item.id, "conversionFactor", parseFloat(e.target.value) || 1)}
                                  className="w-12 h-6 px-1 text-center font-bold font-mono bg-background border border-border/80 rounded text-[11px] outline-none focus:border-blue-500"
                                />
                                <span className="text-muted-foreground font-semibold">{item.uom}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <div className="text-right font-mono font-bold">
                                {item.orderedQuantity} {item.marketUnit || item.uom}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="0.01"
                                  step="any"
                                  value={item.orderedQuantity}
                                  onChange={(e) => handleUpdatePoItem(item.id, "orderedQuantity", parseFloat(e.target.value) || 0)}
                                  className="w-20 h-7 px-2 bg-background border border-border/80 rounded-md text-xs font-mono font-bold text-right outline-none focus:border-blue-500"
                                />
                                <span className="text-[11px] text-muted-foreground font-semibold whitespace-nowrap">
                                  {item.marketUnit || item.uom}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right">
                            <div className="font-mono font-black text-xs text-foreground whitespace-nowrap">
                              {((item.orderedQuantity || 0) * (item.conversionFactor || 1)).toLocaleString()}{" "}
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{item.uom}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2 min-w-[110px] w-28">
                            {isViewMode ? (
                              <div className="text-right font-mono font-semibold">৳{(item.unitPrice || 0).toLocaleString()}</div>
                            ) : (
                              <>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={item.unitPrice}
                                  onChange={(e) => handleUpdatePoItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                  className="w-full h-7 px-2 bg-background border border-border/80 rounded-md text-xs font-mono text-right font-bold outline-none focus:border-blue-500"
                                />
                                <div className="text-[10px] text-muted-foreground font-medium text-right mt-0.5 truncate">
                                  ৳ / {item.marketUnit || item.uom}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <div className="text-right font-mono">৳{(item.discount || 0).toLocaleString()}</div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.discount}
                                onChange={(e) => handleUpdatePoItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                                className="w-full h-7 px-2 bg-background border border-border/80 rounded-md text-xs font-mono text-right outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-2 min-w-[90px] w-24">
                            {isViewMode ? (
                              <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{item.vatRate}%</div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={item.vatRate}
                                onChange={(e) => handleUpdatePoItem(item.id, "vatRate", parseFloat(e.target.value) || 0)}
                                className="w-full h-7 px-2 bg-background border border-border/80 rounded-md text-xs font-mono text-right font-bold text-blue-600 dark:text-blue-400 outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground whitespace-nowrap">
                            ৳{item.lineTotal.toLocaleString()}
                          </td>
                          {!isViewMode && (
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePoItem(item.id)}
                                className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}

                      {poItems.length === 0 && (
                        <tr>
                          <td colSpan={14} className="py-10 text-center text-xs text-muted-foreground">
                            <Package className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                            <p className="font-semibold text-foreground">No Items in Order</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Click &ldquo;Add Item from Catalog&rdquo; above to select items.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  /* Work Order Services Table */
                  <table className="w-full text-left text-xs min-w-[900px]">
                    <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">SL</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Service / Work Name</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Work Description &amp; Scope</th>
                        <th className="py-2.5 px-3 text-center w-20">UOM</th>
                        <th className="py-2.5 px-3 text-right w-24">Work Qty</th>
                        <th className="py-2.5 px-3 text-right min-w-[110px] w-28">Unit Rate (৳)</th>
                        <th className="py-2.5 px-3 text-right min-w-[90px] w-24">VAT (%)</th>
                        <th className="py-2.5 px-3 text-right w-28">Total (৳)</th>
                        {!isViewMode && <th className="py-2.5 px-3 text-center w-14">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {woItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="py-2 px-3 text-center font-mono font-bold text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            {isViewMode ? (
                              <div className="font-bold text-foreground">{item.serviceName}</div>
                            ) : (
                              <input
                                type="text"
                                value={item.serviceName}
                                onChange={(e) => handleUpdateWoItem(item.id, "serviceName", e.target.value)}
                                className="w-full h-7 px-2 bg-background border border-border/80 rounded-md text-xs font-bold outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {isViewMode ? (
                              <div className="text-muted-foreground">{item.workDescription}</div>
                            ) : (
                              <input
                                type="text"
                                value={item.workDescription}
                                onChange={(e) => handleUpdateWoItem(item.id, "workDescription", e.target.value)}
                                className="w-full h-7 px-2 bg-background border border-border/80 rounded-md text-xs outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {isViewMode ? (
                              <span className="font-bold">{item.uom}</span>
                            ) : (
                              <input
                                type="text"
                                value={item.uom}
                                onChange={(e) => handleUpdateWoItem(item.id, "uom", e.target.value)}
                                className="w-16 h-7 px-1.5 text-center bg-background border border-border/80 rounded-md text-xs outline-none font-bold focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <div className="text-right font-mono font-bold">{item.workOrderQuantity}</div>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                value={item.workOrderQuantity}
                                onChange={(e) => handleUpdateWoItem(item.id, "workOrderQuantity", parseFloat(e.target.value) || 0)}
                                className="w-full h-7 px-2 text-right bg-background border border-border/80 rounded-md text-xs font-mono font-bold outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <div className="text-right font-mono">৳{(item.unitRate || 0).toLocaleString()}</div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={item.unitRate}
                                onChange={(e) => handleUpdateWoItem(item.id, "unitRate", parseFloat(e.target.value) || 0)}
                                className="w-full h-7 px-2 text-right bg-background border border-border/80 rounded-md text-xs font-mono outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isViewMode ? (
                              <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{item.vatRate}%</div>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.vatRate ?? 5}
                                onChange={(e) => handleUpdateWoItem(item.id, "vatRate", parseFloat(e.target.value) || 0)}
                                className="w-full h-7 px-2 text-right bg-background border border-border/80 rounded-md text-xs font-mono font-bold text-blue-600 outline-none focus:border-blue-500"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            ৳{item.lineTotal.toLocaleString()}
                          </td>
                          {!isViewMode && (
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveWoItem(item.id)}
                                className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {woItems.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-xs text-muted-foreground">
                            No Service items added. Click &ldquo;Add Service Line&rdquo; to start.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Financial Summary Card */}
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium">
                  <span className="font-semibold text-foreground">
                    Line Items: <strong className="text-blue-600 dark:text-blue-400 font-mono">{docType === "Purchase Order" ? poItems.length : woItems.length}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Subtotal: <strong className="text-foreground font-mono">৳{activeTotals.subtotal.toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    Discount: <strong className="font-mono">-৳{activeTotals.discount.toLocaleString()}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Applicable VAT: <strong className="font-mono">+৳{activeTotals.vat.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">Grand Total ({currency}):</span>
                  <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/20">
                    ৳{activeTotals.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 3: TERMS & CONDITIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground">3. Terms &amp; Conditions</h2>
                </div>

                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => setNewTemplateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>New Template</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Select Template
                  </label>
                  <select
                    disabled={isViewMode}
                    value={selectedTncKey}
                    onChange={(e) => handleTncSelect(e.target.value)}
                    className="w-full sm:w-80 h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-blue-500 outline-none disabled:opacity-70 cursor-pointer"
                  >
                    {Object.keys(tncTemplates).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    Template Conditions &amp; Description *
                  </label>
                  <textarea
                    rows={5}
                    disabled={isViewMode}
                    value={tncText}
                    onChange={(e) => setTncText(e.target.value)}
                    placeholder="Enter detailed terms, delivery obligations, payment conditions, penalty clauses..."
                    className="w-full p-3 rounded-xl border border-border/80 bg-background text-xs font-mono leading-relaxed outline-none focus:border-blue-500 disabled:opacity-70 resize-y"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: ORDER ATTACHMENTS (OPTIONAL) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-foreground">4. Supporting Attachments</h2>
                </div>

                {!isViewMode && (
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer">
                    <Upload className="size-3.5" />
                    <span>Upload Document</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>

              {attachments.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No supporting documents attached.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="size-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate">{att.fileName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {att.fileSize || "1.2 MB"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toast.info(`Viewing ${att.fileName}`)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Download / View"
                        >
                          <Download className="size-3.5" />
                        </button>
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM ACTIONS (Matching PR exactly) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
              <button
                type="button"
                onClick={() => navigate({ to: "/procurement-po-list" })}
                className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
              >
                {isViewMode ? "Close" : "Back to Order List"}
              </button>

              {!isViewMode && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold transition cursor-pointer"
                  >
                    <Save className="size-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(false)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Submit for Approval</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================== */}
      {/* 2 & 3. MULTIPLE PR SELECTION MODAL (APPROVED ONLY & REMAINING ITEMS) */}
      {/* ============================================================== */}
      {prSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <Package className="size-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Tag Approved Purchase Requisitions</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Only approved PRs with unconsumed items are displayed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrSearchOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search PR No, item name, department..."
                  value={modalPrQuery}
                  onChange={(e) => setModalPrQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {availableApprovedPRs
                .filter((pr) => {
                  if (!modalPrQuery.trim()) return true;
                  const q = modalPrQuery.toLowerCase();
                  return (
                    pr.prNumber.toLowerCase().includes(q) ||
                    pr.department.toLowerCase().includes(q) ||
                    pr.remainingItems.some((it) => it.itemName.toLowerCase().includes(q) || it.itemCode.toLowerCase().includes(q))
                  );
                })
                .map((pr) => {
                  const isChecked = selectedPRs.includes(pr.prNumber);
                  return (
                    <div
                      key={pr.prNumber}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedPRs(selectedPRs.filter((p) => p !== pr.prNumber));
                        } else {
                          setSelectedPRs([...selectedPRs, pr.prNumber]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isChecked
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500"
                          : "bg-muted/10 border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="size-4 accent-blue-600 rounded cursor-pointer shrink-0"
                        />
                        <div>
                          <div className="font-mono font-bold text-foreground flex items-center gap-2">
                            {pr.prNumber}
                            <span className="text-[10px] font-sans font-medium text-muted-foreground">
                              ({pr.prDate})
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {pr.department} • Requested by: {pr.requestedBy}
                          </div>
                        </div>
                      </div>

                      {/* 2. Show Number of Items instead of amount */}
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                          {pr.remainingItemsCount} Item(s) Available
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {pr.totalItemsCount - pr.remainingItemsCount} item(s) consumed
                        </span>
                      </div>
                    </div>
                  );
                })}

              {availableApprovedPRs.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No approved PRs with unconsumed items available.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => {
                  setPrSearchOpen(false);
                  populateItemsFromPRs(selectedPRs);
                }}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Apply Selection ({selectedPRs.length} PRs Tagged)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2 & 3. COMPARATIVE STATEMENT (CS) SEARCH MODAL */}
      {/* Displays: CS ID, Date, Supplier, Amount */}
      {/* ============================================================== */}
      {csSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-purple-600" />
                <h3 className="text-sm font-bold text-foreground">Select Approved Comparative Statement (CS)</h3>
              </div>
              <button
                type="button"
                onClick={() => setCsSearchOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search CS ID, Supplier name..."
                  value={modalCsQuery}
                  onChange={(e) => setModalCsQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2 text-xs">
              {availableApprovedCSs
                .filter((cs) => {
                  if (!modalCsQuery.trim()) return true;
                  const q = modalCsQuery.toLowerCase();
                  return (
                    cs.csNumber.toLowerCase().includes(q) ||
                    (cs.recommendedSupplierName && cs.recommendedSupplierName.toLowerCase().includes(q))
                  );
                })
                .map((cs) => {
                  const supplierName = cs.recommendedSupplierName || cs.suppliers?.[0]?.supplierName || "Awarded Supplier";
                  const amount = cs.recommendedAmount || cs.totalEstimatedValue || 0;
                  const isSelected = selectedCS === cs.csNumber;

                  return (
                    <div
                      key={cs.csNumber}
                      onClick={() => {
                        setSelectedCS(cs.csNumber);
                        setCsSearchOpen(false);
                        populateItemsFromCS(cs.csNumber);
                        toast.success(`Selected CS ${cs.csNumber}. Supplier locked.`);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-purple-50/80 dark:bg-purple-950/40 border-purple-500"
                          : "bg-muted/10 border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="space-y-1">
                        {/* 2. CS ID, Date, Supplier, Amount */}
                        <div className="font-mono font-bold text-foreground flex items-center gap-2">
                          <span>{cs.csNumber}</span>
                          <span className="text-[10px] font-sans font-medium text-muted-foreground">({cs.csDate})</span>
                        </div>
                        <div className="font-semibold text-foreground">Supplier: {supplierName}</div>
                        <div className="text-[10px] text-muted-foreground">{cs.remainingItemsCount} remaining item(s)</div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-600 block">
                          ৳{amount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold underline mt-1 block">
                          Select CS
                        </span>
                      </div>
                    </div>
                  );
                })}

              {availableApprovedCSs.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No approved Comparative Statements with unconsumed items available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DEDICATED SEARCHABLE SUPPLIER / VENDOR MODAL */}
      {/* Displays: Supplier Name, Address, Contact Person, Mobile Number */}
      {/* ============================================================== */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Select Supplier / Vendor</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Search and select registered suppliers from master data.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by vendor name, code, contact person, mobile, or address..."
                  value={modalSupplierQuery}
                  onChange={(e) => setModalSupplierQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Supplier Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/80 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                    <th className="py-2.5 px-3 font-bold">Supplier / Vendor Name</th>
                    <th className="py-2.5 px-3 font-bold">Contact Person</th>
                    <th className="py-2.5 px-3 font-bold">Mobile / Phone</th>
                    <th className="py-2.5 px-3 font-bold">Address</th>
                    <th className="py-2.5 px-3 text-center font-bold w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-normal">
                  {availableSuppliers
                    .filter((s) => {
                      if (!modalSupplierQuery.trim()) return true;
                      const q = modalSupplierQuery.toLowerCase();
                      const contactName = s.contactPersonName || (s as any).contactPerson || "";
                      const mobile = s.mobileNumber || (s as any).mobile || "";
                      return (
                        s.vendorName.toLowerCase().includes(q) ||
                        s.vendorCode.toLowerCase().includes(q) ||
                        contactName.toLowerCase().includes(q) ||
                        mobile.toLowerCase().includes(q) ||
                        (s.address && s.address.toLowerCase().includes(q))
                      );
                    })
                    .map((s) => {
                      const isSelected = supplierId === s.id;
                      const contactName = s.contactPersonName || (s as any).contactPerson || "—";
                      const mobile = s.mobileNumber || (s as any).mobile || "—";
                      return (
                        <tr
                          key={s.id}
                          onClick={() => {
                            setSupplierId(s.id);
                            setSupplierModalOpen(false);
                            toast.success(`Selected vendor "${s.vendorName}".`);
                          }}
                          className={`hover:bg-muted/30 transition cursor-pointer ${
                            isSelected ? "bg-blue-50/70 dark:bg-blue-950/40" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {s.vendorName}
                          </td>
                          <td className="py-2.5 px-3 text-foreground">
                            <span className="font-semibold block">{contactName}</span>
                            <span className="text-[10px] text-muted-foreground">{s.designation}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {mobile}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-[220px] truncate" title={s.address}>
                            {s.address}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSupplierId(s.id);
                                setSupplierModalOpen(false);
                                toast.success(`Selected vendor "${s.vendorName}".`);
                              }}
                              className={`h-7 px-3 text-[11px] font-bold rounded-lg cursor-pointer transition shadow-2xs whitespace-nowrap shrink-0 ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  {availableSuppliers.filter((s) => {
                    if (!modalSupplierQuery.trim()) return true;
                    const q = modalSupplierQuery.toLowerCase();
                    const contactName = s.contactPersonName || (s as any).contactPerson || "";
                    const mobile = s.mobileNumber || (s as any).mobile || "";
                    return (
                      s.vendorName.toLowerCase().includes(q) ||
                      s.vendorCode.toLowerCase().includes(q) ||
                      contactName.toLowerCase().includes(q) ||
                      mobile.toLowerCase().includes(q) ||
                      (s.address && s.address.toLowerCase().includes(q))
                    );
                  }).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                        No suppliers found matching your query &ldquo;{modalSupplierQuery}&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. ADD ITEM FROM CATALOG MODAL */}
      {/* Displays: Item Name, Item Code, Specification, Brand, Origin, UOM */}
      {/* NO ITEM PRICE SHOWN! DUPLICATES NOT ALLOWED! */}
      {/* ============================================================== */}
      {itemSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <Package className="size-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Add Item from Catalog</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Items sourced dynamically based on creation method: <strong className="text-foreground">{creationMethod}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItemSearchOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search item name, code, specification, brand, origin..."
                  value={modalItemQuery}
                  onChange={(e) => setModalItemQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Catalog Items Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/80 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border whitespace-nowrap">
                    <th className="py-2.5 px-3 font-bold">Item Name</th>
                    <th className="py-2.5 px-3 font-bold">Item Code</th>
                    <th className="py-2.5 px-3 font-bold">Specification</th>
                    <th className="py-2.5 px-3 font-bold">Brand</th>
                    <th className="py-2.5 px-3 font-bold">Origin</th>
                    <th className="py-2.5 px-3 font-bold text-center">UOM</th>
                    <th className="py-2.5 px-3 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-normal">
                  {filteredCatalogItems.map((it, idx) => {
                    const alreadyAdded = isItemAlreadyAdded(it.itemCode);
                    return (
                      <tr key={idx} className="hover:bg-muted/20 transition">
                        {/* 6. Displays: Item Name, Item Code, Specification, Brand, Origin, UOM */}
                        <td className="py-2.5 px-3 font-bold text-foreground">{it.itemName}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">{it.itemCode}</td>
                        <td className="py-2.5 px-3 text-[11px] text-muted-foreground max-w-[200px] truncate" title={it.specification}>
                          {it.specification}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{it.brand}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{it.origin}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-muted-foreground">{it.uom}</td>
                        <td className="py-2.5 px-3 text-center">
                          {alreadyAdded ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                              Already Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddPoItem(it)}
                              className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition shadow-2xs"
                            >
                              + Add Item
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredCatalogItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-xs text-muted-foreground">
                        {creationMethod === "Purchase Requisition" && selectedPRs.length === 0 ? (
                          <span>Please tag at least one Purchase Requisition above to see available items.</span>
                        ) : creationMethod === "Comparative Statement" && !selectedCS ? (
                          <span>Please select a Comparative Statement above to view items.</span>
                        ) : (
                          <span>No unconsumed catalog items found matching your search.</span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. SAVE NEW TERMS & CONDITIONS TEMPLATE MODAL */}
      {/* ============================================================== */}
      {newTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <h3 className="text-sm font-bold text-foreground">Save / Create Terms Template</h3>
              <button
                type="button"
                onClick={() => setNewTemplateModalOpen(false)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Template Name*</label>
                <input
                  type="text"
                  placeholder="e.g. Chemical Import Contract Terms"
                  value={newTncTitle}
                  onChange={(e) => setNewTncTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-muted/40 border border-border rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Terms Description*</label>
                <textarea
                  rows={5}
                  placeholder="Enter numbered clauses..."
                  value={newTncContent}
                  onChange={(e) => setNewTncContent(e.target.value)}
                  className="w-full p-3 bg-muted/40 border border-border rounded-xl text-xs font-mono outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setNewTemplateModalOpen(false)}
                className="h-9 px-4 bg-muted/60 hover:bg-muted text-muted-foreground font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewTemplate}
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. OFFICIAL PURCHASE ORDER / WORK ORDER PDF MODAL */}
      {/* ============================================================== */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">
                  Official Document Preview — {orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="size-3.5" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(false)}
                  className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900 text-xs font-sans space-y-6 print:p-0">
              {/* Pakiza Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-40">
                    <img src={pakizaSoftwareLogo} alt="Pakiza Logo" className="h-10 w-auto object-contain" />
                  </div>
                  <div className="text-center flex-1">
                    <h1 className="text-base font-black tracking-wide uppercase text-slate-950">
                      PAKIZA KNIT COMPOSITE LTD.
                    </h1>
                    <p className="text-[10px] text-slate-600">
                      Khan ABC Tradeplex, House #37, Road #2, Dhanmondi, Dhaka-1205
                    </p>
                    <span className="inline-block mt-1 px-4 py-0.5 bg-slate-900 text-white font-mono font-black text-xs uppercase tracking-widest rounded-sm">
                      {docType === "Purchase Order" ? "PURCHASE ORDER" : "WORK ORDER"}
                    </span>
                  </div>
                  <div className="w-40 text-right text-[10px] text-slate-500">
                    Date: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Order Top / Header Section */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
                <div className="space-y-1.5">
                  <div><strong>PO/WO No:</strong> <span className="font-mono font-bold text-blue-700">{orderNumber}</span></div>
                  <div><strong>Order Date:</strong> {orderDate}</div>
                  <div><strong>Payment Terms:</strong> {paymentMode}</div>
                  <div><strong>Delivery Location:</strong> {docType === "Purchase Order" ? deliveryWarehouse : workLocation}</div>
                  <div><strong>Prepared By:</strong> {prepareBy} ({department})</div>
                </div>
                <div className="space-y-1.5">
                  <div><strong>Supplier:</strong> <span className="font-bold">{currentSupplier.vendorName}</span></div>
                  <div><strong>Address:</strong> {currentSupplier.address}</div>
                  <div><strong>Contact Person:</strong> {currentSupplier.contactPersonName || (currentSupplier as any).contactPerson || "—"}</div>
                  <div><strong>Mobile:</strong> {currentSupplier.mobileNumber || (currentSupplier as any).mobile || "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
