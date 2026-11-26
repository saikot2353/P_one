import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  CreditCard,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Eye,
  FileSpreadsheet,
  X,
  Layers,
  ChevronRight,
  Calculator,
  Lock,
  ArrowRight,
  Upload,
  Receipt,
  Check,
  Printer,
  Edit,
  ArrowLeft,
  Paperclip,
  ShieldCheck,
  FileText,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  SupplierBill,
  SupplierBillItem,
  MaterialReceive,
  PurchaseOrder,
  getStoredSupplierBills,
  setStoredSupplierBills,
  getStoredMaterialReceipts,
  getStoredPurchaseOrders,
  getStoredPoItems,
  getStoredWoItems,
  getStoredDirectMRRs,
  DirectMRRRecord,
} from "@/lib/procurement-order-inventory-data";
import {
  DEFAULT_ITEMS,
  DEFAULT_SUPPLIERS,
  getStoredData,
  ItemProductMaster,
  SupplierVendor,
} from "@/lib/procurement-master-data";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";

interface SupplierBillSearch {
  action?: "create" | "edit" | "view";
  id?: string;
}

export const Route = createFileRoute("/procurement-billing-supplier-bill")({
  validateSearch: (search: Record<string, unknown>): SupplierBillSearch => {
    return {
      action: search.action as any,
      id: search.id as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Supplier Bill — Billing | CRIPTON Procurement" },
      {
        name: "description",
        content:
          "Supplier Bill creation, view, and edit linked directly with verified MRR and Purchase Order references with strict billing quantity validations.",
      },
    ],
  }),
  component: SupplierBillPage,
});

export function SupplierBillPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const [bills, setBills] = useState<SupplierBill[]>(() => getStoredSupplierBills());
  const materialReceipts = useMemo(() => getStoredMaterialReceipts(), []);
  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);

  // Mode: "create" | "edit" | "view"
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  // Bill Type: "Bill against PO" | "Bill against WO" | "Service Bill Entry" | "Bill against Receive"
  type BillType = "Bill against PO" | "Bill against WO" | "Service Bill Entry" | "Bill against Receive";
  const [billType, setBillType] = useState<BillType>("Bill against PO");

  // Supplier state for Service Bill Entry
  const [serviceSupplierId, setServiceSupplierId] = useState<string>("sup-1");
  const [serviceSupplierName, setServiceSupplierName] = useState<string>(
    "Apex Textile Chemical & Dyestuffs Ltd"
  );

  // Supplier state for Bill against Receive
  const [receiveSupplierId, setReceiveSupplierId] = useState<string>("sup-bengal-02");
  const [receiveSupplierName, setReceiveSupplierName] = useState<string>(
    "Bengal Information Systems"
  );
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");

  // Service items modal state for Service Bill Entry
  const [serviceItemModalOpen, setServiceItemModalOpen] = useState(false);
  const [serviceModalSearch, setServiceModalSearch] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [customServiceSpec, setCustomServiceSpec] = useState("");
  const [customServiceUom, setCustomServiceUom] = useState("Job");
  const [customServiceQty, setCustomServiceQty] = useState<number>(1);
  const [customServiceRate, setCustomServiceRate] = useState<number>(5000);
  const [customServiceVatRate, setCustomServiceVatRate] = useState<number>(5);
  const [customServiceTaxRate, setCustomServiceTaxRate] = useState<number>(0);

  // Bill Header Form State
  const [billNumber, setBillNumber] = useState(
    () => `BIL-2026-000${Math.floor(100 + Math.random() * 900)}`
  );
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedPoNumber, setSelectedPoNumber] = useState("PO-2026-0001");
  const [selectedMrrNumbers, setSelectedMrrNumbers] = useState<string[]>(["MRR-2026-0001"]);
  const [supplierBillNo, setSupplierBillNo] = useState("INV-2026-8871");
  const [supplierBillDate, setSupplierBillDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [currency, setCurrency] = useState("BDT");
  const [paymentDueDate, setPaymentDueDate] = useState(
    () => new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [remarks, setRemarks] = useState("");
  const [currentApprovalStatus, setCurrentApprovalStatus] = useState<SupplierBill["approvalStatus"]>("Draft");

  // Other Charges & Adjustments & Manual Discount & Manual VAT & Tax
  const [otherCharges, setOtherCharges] = useState<number | "">(0);
  const [adjustment, setAdjustment] = useState<number | "">(0);
  const [manualDiscount, setManualDiscount] = useState<number | "">("");
  const [manualVatAmount, setManualVatAmount] = useState<number | "">("");
  const [taxAmount, setTaxAmount] = useState<number | "">(0);
  const [selectedServiceItemIds, setSelectedServiceItemIds] = useState<string[]>([]);
  const [serviceItemAmounts, setServiceItemAmounts] = useState<Record<string, number>>({});
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // Available service items where Service Flag is enabled
  const availableServiceItems = useMemo(() => {
    const masterItems = getStoredData("cripton_master_items", DEFAULT_ITEMS) as ItemProductMaster[];
    return masterItems.filter((i) => i.serviceFlag === true);
  }, []);

  const handleToggleServiceItem = (serviceId: string) => {
    setSelectedServiceItemIds((prev) => {
      const exists = prev.includes(serviceId);
      const next = exists ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];

      const newAmounts = { ...serviceItemAmounts };
      if (!exists) {
        newAmounts[serviceId] = newAmounts[serviceId] ?? 0;
      } else {
        delete newAmounts[serviceId];
      }
      setServiceItemAmounts(newAmounts);

      let total = 0;
      next.forEach((id) => {
        total += newAmounts[id] ?? 0;
      });
      setOtherCharges(total);
      return next;
    });
  };

  const handleUpdateServiceItemAmount = (id: string, amount: number) => {
    const updated = { ...serviceItemAmounts, [id]: amount };
    setServiceItemAmounts(updated);
    let total = 0;
    selectedServiceItemIds.forEach((sid) => {
      total += (sid === id ? amount : (updated[sid] ?? 0));
    });
    setOtherCharges(total);
  };

  // Modals
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [poSearchQuery, setPoSearchQuery] = useState("");
  const [mrrModalOpen, setMrrModalOpen] = useState(false);
  const [mrrSearchQuery, setMrrSearchQuery] = useState("");
  const [previewReportOpen, setPreviewReportOpen] = useState(false);

  // Active PO reference
  const currentPo = useMemo(() => {
    return purchaseOrders.find((p) => p.orderNumber === selectedPoNumber) || purchaseOrders[0];
  }, [purchaseOrders, selectedPoNumber]);

  // Stored Direct MRRs
  const directMrrs = useMemo(() => getStoredDirectMRRs(), []);

  // Merged supplier list including suppliers with direct MRRs
  const allSuppliers = useMemo(() => {
    const map = new Map<string, { id: string; vendorName: string; vendorCode: string }>();
    DEFAULT_SUPPLIERS.forEach((s) => {
      map.set(s.id, { id: s.id, vendorName: s.vendorName, vendorCode: s.vendorCode });
    });
    directMrrs.forEach((d) => {
      if (d.supplierId && !map.has(d.supplierId)) {
        map.set(d.supplierId, {
          id: d.supplierId,
          vendorName: d.supplierName || d.supplier || "Unknown Supplier",
          vendorCode: d.supplierCode || d.supplierId,
        });
      }
    });
    return Array.from(map.values());
  }, [directMrrs]);

  const activeSupplierName = useMemo(() => {
    if (billType === "Service Bill Entry") {
      return serviceSupplierName || "Apex Textile Chemical & Dyestuffs Ltd";
    }
    if (billType === "Bill against Receive") {
      return receiveSupplierName || "Bengal Information Systems";
    }
    return currentPo?.supplierName || "Bengal Information Systems";
  }, [billType, serviceSupplierName, receiveSupplierName, currentPo]);

  const activeSupplierId = useMemo(() => {
    if (billType === "Service Bill Entry") {
      return serviceSupplierId || "sup-1";
    }
    if (billType === "Bill against Receive") {
      return receiveSupplierId || "sup-bengal-02";
    }
    return currentPo?.supplierId || "sup-bengal-02";
  }, [billType, serviceSupplierId, receiveSupplierId, currentPo]);

  // Direct Receive MRRs belonging to the selected supplier
  const supplierDirectMrrs = useMemo(() => {
    if (billType !== "Bill against Receive") return [];
    return directMrrs.filter((d) => {
      const matchesSupplierId =
        d.supplierId &&
        (d.supplierId === receiveSupplierId || d.supplierCode === receiveSupplierId);
      const matchesSupplierName =
        (d.supplierName &&
          receiveSupplierName &&
          d.supplierName.toLowerCase() === receiveSupplierName.toLowerCase()) ||
        (d.supplier &&
          receiveSupplierName &&
          d.supplier.toLowerCase() === receiveSupplierName.toLowerCase());
      return Boolean(matchesSupplierId || matchesSupplierName);
    });
  }, [billType, directMrrs, receiveSupplierId, receiveSupplierName]);

  const filteredDirectMaterialReceipts = useMemo(() => {
    if (!mrrSearchQuery.trim()) return supplierDirectMrrs;
    const q = mrrSearchQuery.toLowerCase();
    return supplierDirectMrrs.filter(
      (m) =>
        m.mrrNumber.toLowerCase().includes(q) ||
        (m.challanNo && m.challanNo.toLowerCase().includes(q)) ||
        (m.storeName && m.storeName.toLowerCase().includes(q)) ||
        (m.warehouseStore && m.warehouseStore.toLowerCase().includes(q)) ||
        (m.mrrDate && m.mrrDate.includes(q))
    );
  }, [supplierDirectMrrs, mrrSearchQuery]);

  // Approved Purchase Orders only (excluding Work Orders)
  const approvedPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter(
      (po) =>
        (po.orderStatus === "Approved" || (po as any).status === "Approved") &&
        (po.documentType === "Purchase Order" || po.orderNumber.startsWith("PO-"))
    );
  }, [purchaseOrders]);

  // Approved Work Orders only (excluding Purchase Orders)
  const approvedWorkOrders = useMemo(() => {
    return purchaseOrders.filter(
      (po) =>
        (po.orderStatus === "Approved" || (po as any).status === "Approved") &&
        (po.documentType === "Work Order" || po.orderNumber.startsWith("WO-"))
    );
  }, [purchaseOrders]);

  // Orders available for selection based on Bill Type
  const selectableOrders = useMemo(() => {
    if (billType === "Bill against PO") return approvedPurchaseOrders;
    if (billType === "Bill against WO") return approvedWorkOrders;
    return [];
  }, [billType, approvedPurchaseOrders, approvedWorkOrders]);

  // Filtered orders for modal table
  const filteredPurchaseOrders = useMemo(() => {
    if (!poSearchQuery.trim()) return selectableOrders;
    const q = poSearchQuery.toLowerCase();
    return selectableOrders.filter(
      (po) =>
        po.orderNumber.toLowerCase().includes(q) ||
        (po.supplierName && po.supplierName.toLowerCase().includes(q)) ||
        (po.orderDate && po.orderDate.includes(q))
    );
  }, [selectableOrders, poSearchQuery]);

  // Filtered MRRs for selection modal (with search, removing PO/Supplier from view)
  const filteredMaterialReceipts = useMemo(() => {
    let list = materialReceipts;
    if (selectedPoNumber) {
      const scoped = list.filter((m) => m.poNumber === selectedPoNumber);
      if (scoped.length > 0) list = scoped;
    }
    if (!mrrSearchQuery.trim()) return list;
    const q = mrrSearchQuery.toLowerCase();
    return list.filter(
      (m) =>
        m.receiveNumber.toLowerCase().includes(q) ||
        (m.challanNo && m.challanNo.toLowerCase().includes(q)) ||
        (m.warehouseStore && m.warehouseStore.toLowerCase().includes(q)) ||
        (m.receiveDate && m.receiveDate.includes(q))
    );
  }, [materialReceipts, selectedPoNumber, mrrSearchQuery]);

  // Derived Bill Items from selected MRRs
  const [billItems, setBillItems] = useState<SupplierBillItem[]>([
    {
      id: "sbi-1",
      sl: 1,
      itemCode: "IT-LAP-001",
      itemName: "Dell Latitude 5540 Core i7 16GB/512GB",
      specification:
        "Intel Core i7-1365U, 16GB DDR5, 512GB NVMe SSD, 15.6 FHD IPS, 3Y Warranty",
      brand: "Dell Technologies",
      origin: "United States",
      uom: "PCS",
      mrrReceivedQty: 5,
      previouslyBilledQty: 0,
      currentBillQty: 5,
      unitPrice: 82000,
      discount: 4000,
      vatRate: 5,
      vatAmount: 20300,
      taxRate: 3,
      taxAmount: 12180,
      lineAmount: 438480,
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
      vatRate: 5,
      vatAmount: 2325,
      taxRate: 2,
      taxAmount: 930,
      lineAmount: 49755,
    },
  ]);

  // Load an existing bill into the form
  const loadBillIntoForm = (bill: SupplierBill, mode: "view" | "edit") => {
    setSelectedBillId(bill.id);
    setFormMode(mode);
    setBillNumber(bill.billNumber);
    setBillDate(bill.billDate);
    const loadedType: BillType =
      bill.billType ||
      (bill.poNumber === "DIRECT-RECEIVE"
        ? "Bill against Receive"
        : bill.poNumber?.startsWith("WO-")
        ? "Bill against WO"
        : bill.poNumber && bill.poNumber !== "DIRECT-SERVICE"
        ? "Bill against PO"
        : "Service Bill Entry");
    setBillType(loadedType);
    if (loadedType === "Service Bill Entry") {
      setServiceSupplierId(bill.supplierId || "sup-1");
      setServiceSupplierName(bill.supplierName || "Apex Textile Chemical & Dyestuffs Ltd");
    } else if (loadedType === "Bill against Receive") {
      setReceiveSupplierId(bill.supplierId || "sup-bengal-02");
      setReceiveSupplierName(bill.supplierName || "Bengal Information Systems");
    }
    setSelectedPoNumber(bill.poNumber);
    setSelectedMrrNumbers(bill.mrrNumbers || []);
    setSupplierBillNo(bill.supplierBillNo);
    setSupplierBillDate(bill.supplierBillDate);
    setCurrency(bill.currency || "BDT");
    setPaymentDueDate(bill.paymentDueDate || new Date().toISOString().slice(0, 10));
    setRemarks(bill.remarks || "");
    setCurrentApprovalStatus(bill.approvalStatus);
    setOtherCharges(bill.otherCharges ?? 0);
    setTaxAmount(bill.tax ?? 0);
    if ((bill as any).otherChargesBreakdown && (bill as any).otherChargesBreakdown.length > 0) {
      setSelectedServiceItemIds((bill as any).otherChargesBreakdown.map((b: any) => b.id));
      const amounts: Record<string, number> = {};
      (bill as any).otherChargesBreakdown.forEach((b: any) => { amounts[b.id] = b.amount; });
      setServiceItemAmounts(amounts);
    } else {
      setSelectedServiceItemIds(bill.otherChargeServiceItemIds ?? []);
    }
    setAdjustment(bill.adjustment ?? 0);
    setManualDiscount(bill.discount ?? 0);
    setManualVatAmount(bill.vat ?? 0);
    setBillItems(bill.items || []);
  };

  // Switch to new create mode
  const handleStartCreateNew = () => {
    setSelectedBillId(null);
    setFormMode("create");
    setBillType("Bill against PO");
    setBillNumber(`BIL-2026-000${Math.floor(100 + Math.random() * 900)}`);
    setBillDate(new Date().toISOString().slice(0, 10));
    const firstPo = approvedPurchaseOrders[0];
    if (firstPo) {
      setSelectedPoNumber(firstPo.orderNumber);
      const related = materialReceipts.filter((m) => m.poNumber === firstPo.orderNumber);
      if (related.length > 0) {
        const mrrNos = [related[0].receiveNumber];
        setSelectedMrrNumbers(mrrNos);
        populateBillItemsFromMrrs(mrrNos, firstPo.orderNumber);
      } else {
        setSelectedMrrNumbers([]);
        setBillItems([]);
      }
    } else {
      setSelectedPoNumber("");
      setSelectedMrrNumbers([]);
      setBillItems([]);
    }
    setSupplierBillNo(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setSupplierBillDate(new Date().toISOString().slice(0, 10));
    setRemarks("");
    setCurrentApprovalStatus("Draft");
    setOtherCharges(0);
    setTaxAmount(0);
    setSelectedServiceItemIds([]);
    setAdjustment(0);
    setManualDiscount("");
    setManualVatAmount("");
  };

  // Switch Bill Type handler
  const handleBillTypeChange = (newType: BillType) => {
    if (formMode === "view") return;
    setBillType(newType);

    if (newType === "Bill against PO") {
      const firstPo = approvedPurchaseOrders[0];
      if (firstPo) {
        handleSelectPo(firstPo);
      } else {
        setSelectedPoNumber("");
        setSelectedMrrNumbers([]);
        setBillItems([]);
      }
    } else if (newType === "Bill against WO") {
      const firstWo = approvedWorkOrders[0];
      if (firstWo) {
        handleSelectPo(firstWo);
      } else {
        setSelectedPoNumber("");
        setSelectedMrrNumbers([]);
        setBillItems([]);
      }
    } else if (newType === "Bill against Receive") {
      setSelectedPoNumber("");
      const supplierWithDirectMrr =
        allSuppliers.find((s) =>
          directMrrs.some(
            (d) =>
              d.supplierId === s.id ||
              (d.supplierName && d.supplierName.toLowerCase() === s.vendorName.toLowerCase())
          )
        ) || allSuppliers[0];

      if (supplierWithDirectMrr) {
        setReceiveSupplierId(supplierWithDirectMrr.id);
        setReceiveSupplierName(supplierWithDirectMrr.vendorName);
        const related = directMrrs.filter(
          (d) =>
            d.supplierId === supplierWithDirectMrr.id ||
            (d.supplierName &&
              d.supplierName.toLowerCase() === supplierWithDirectMrr.vendorName.toLowerCase())
        );
        if (related.length > 0) {
          const mrrNos = related.map((m) => m.mrrNumber);
          setSelectedMrrNumbers(mrrNos);
          populateBillItemsFromDirectMrrs(mrrNos);
        } else {
          setSelectedMrrNumbers([]);
          setBillItems([]);
        }
      } else {
        setSelectedMrrNumbers([]);
        setBillItems([]);
      }
      toast.success("Switched to Bill against Receive. Direct Receive MRRs displayed.");
    } else if (newType === "Service Bill Entry") {
      setSelectedPoNumber("");
      setSelectedMrrNumbers([]);
      setBillItems([]);
      toast.info("Switched to Service Bill Entry. Click 'Add Service Item' to add items.");
    }
  };

  // Add Catalog Service to Bill
  const handleAddCatalogService = (srv: ItemProductMaster) => {
    const qty = 1;
    const rate = srv.standardPurchasePrice || 5000;
    const vatRate = 5;
    const taxRate = 0;
    const vatAmount = (rate * qty * vatRate) / 100;
    const taxAmount = (rate * qty * taxRate) / 100;
    const lineAmount = rate * qty + vatAmount + taxAmount;

    const newItem: SupplierBillItem = {
      id: `sbi-srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sl: billItems.length + 1,
      itemCode: srv.itemCode,
      itemName: srv.itemName,
      specification: srv.specification || "Service scope per invoice description",
      brand: srv.subGroupName || "Service Charge",
      origin: "Local / In-House",
      uom: srv.purchaseUOM || srv.stockUOM || "Job",
      mrrReceivedQty: qty,
      previouslyBilledQty: 0,
      currentBillQty: qty,
      unitPrice: rate,
      discount: 0,
      vatRate,
      vatAmount,
      taxRate,
      taxAmount,
      lineAmount,
    };

    setBillItems((prev) => [...prev, newItem]);
    toast.success(`Added service item "${srv.itemName}" to bill.`);
  };

  // Add Custom Service to Bill
  const handleAddCustomService = () => {
    if (!customServiceName.trim()) {
      toast.error("Please enter a Service Name.");
      return;
    }
    const qty = Math.max(1, Number(customServiceQty) || 1);
    const rate = Math.max(0, Number(customServiceRate) || 0);
    const vRate = Math.max(0, Number(customServiceVatRate) || 0);
    const tRate = Math.max(0, Number(customServiceTaxRate) || 0);
    const vatAmount = (rate * qty * vRate) / 100;
    const taxAmount = (rate * qty * tRate) / 100;
    const lineAmount = rate * qty + vatAmount + taxAmount;

    const newItem: SupplierBillItem = {
      id: `sbi-srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sl: billItems.length + 1,
      itemCode: `SRV-CUS-${Math.floor(100 + Math.random() * 900)}`,
      itemName: customServiceName.trim(),
      specification: customServiceSpec.trim() || "Scope of service & labor work",
      brand: "Custom Service",
      origin: "In-House / Contract",
      uom: customServiceUom || "Job",
      mrrReceivedQty: qty,
      previouslyBilledQty: 0,
      currentBillQty: qty,
      unitPrice: rate,
      discount: 0,
      vatRate: vRate,
      vatAmount,
      taxRate: tRate,
      taxAmount,
      lineAmount,
    };

    setBillItems((prev) => [...prev, newItem]);
    setCustomServiceName("");
    setCustomServiceSpec("");
    setCustomServiceRate(5000);
    setCustomServiceQty(1);
    setServiceItemModalOpen(false);
    toast.success(`Added custom service "${newItem.itemName}" to bill.`);
  };

  // Remove Service Item from Bill
  const handleRemoveServiceItem = (id: string) => {
    if (formMode === "view") return;
    setBillItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      return filtered.map((item, idx) => ({ ...item, sl: idx + 1 }));
    });
    toast.info("Service item removed from bill.");
  };

  // Remove MRR Bill Item from Bill
  const handleRemoveBillItem = (id: string) => {
    if (formMode === "view") return;
    setBillItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      return filtered.map((item, idx) => ({ ...item, sl: idx + 1 }));
    });
    toast.info("Item removed from bill.");
  };

  // Update Service Item Line in Table
  const handleUpdateServiceItemLine = (
    id: string,
    field: "currentBillQty" | "unitPrice" | "discount" | "vatRate" | "taxRate" | "specification",
    val: any
  ) => {
    if (formMode === "view") return;
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = field === "currentBillQty" ? Math.max(0, Number(val)) : item.currentBillQty;
          const price = field === "unitPrice" ? Math.max(0, Number(val)) : item.unitPrice;
          const disc = field === "discount" ? Math.max(0, Number(val)) : item.discount;
          const vRate = field === "vatRate" ? Math.max(0, Number(val)) : (item.vatRate ?? 5);
          const tRate = field === "taxRate" ? Math.max(0, Number(val)) : (item.taxRate ?? 0);
          const spec = field === "specification" ? String(val) : item.specification;

          const base = qty * price;
          const afterDisc = Math.max(0, base - disc);
          const vat = (afterDisc * vRate) / 100;
          const tax = (afterDisc * tRate) / 100;

          return {
            ...item,
            currentBillQty: qty,
            unitPrice: price,
            discount: disc,
            vatRate: vRate,
            vatAmount: vat,
            taxRate: tRate,
            taxAmount: tax,
            specification: spec,
            lineAmount: afterDisc + vat + tax,
          };
        }
        return item;
      })
    );
  };

  // Sync mode with route params if provided
  useEffect(() => {
    if (searchParams.action) {
      if (searchParams.id) {
        const found = bills.find((b) => b.id === searchParams.id || b.billNumber === searchParams.id);
        if (found) {
          loadBillIntoForm(found, searchParams.action === "edit" ? "edit" : "view");
          return;
        }
      }
      setFormMode(searchParams.action);
    }
  }, [searchParams.action, searchParams.id, bills]);

  // Helper to populate items from MRRs with Work Order / PO tax carry-forward
  const populateBillItemsFromMrrs = (mrrNos: string[], orderNumberOverride?: string) => {
    const matchedMRRs = materialReceipts.filter((m) => mrrNos.includes(m.receiveNumber));
    const consolidatedItems: SupplierBillItem[] = [];
    let sl = 1;

    const targetPoNum = orderNumberOverride || selectedPoNumber;
    const poItemsMap = getStoredPoItems();
    const woItemsMap = getStoredWoItems();
    const poOrder = purchaseOrders.find((p) => p.orderNumber === targetPoNum);
    const poItems = poItemsMap[targetPoNum] || poOrder?.items || [];
    const woItems = woItemsMap[targetPoNum] || [];

    matchedMRRs.forEach((mrr) => {
      (mrr.items || []).forEach((item) => {
        const received = item.acceptedQty || item.currentReceiveQty || item.orderedQty || 1;
        const lineBase = received * item.unitPrice;

        // Carry forward Tax % from Work Order or Purchase Order
        const matchedWo = woItems.find(
          (w) =>
            w.serviceCode === item.itemCode ||
            w.serviceName.toLowerCase() === item.itemName.toLowerCase()
        );
        const matchedPo = poItems.find(
          (p) =>
            p.itemCode === item.itemCode ||
            p.itemName.toLowerCase() === item.itemName.toLowerCase()
        );

        const vatRate = matchedWo?.vatRate ?? matchedPo?.vatRate ?? 5;
        const taxRate = matchedWo?.taxRate ?? matchedPo?.taxRate ?? 0;
        const lineVat = (lineBase * vatRate) / 100;
        const lineTax = (lineBase * taxRate) / 100;

        consolidatedItems.push({
          id: `sbi-${Date.now()}-${sl}`,
          sl: sl++,
          itemCode: item.itemCode,
          itemName: item.itemName,
          specification: item.specification,
          brand: item.brand,
          origin: item.origin,
          uom: item.uom,
          mrrReceivedQty: received,
          previouslyBilledQty: 0,
          currentBillQty: received,
          unitPrice: item.unitPrice,
          discount: 0,
          vatRate,
          vatAmount: lineVat,
          taxRate,
          taxAmount: lineTax,
          lineAmount: lineBase + lineVat + lineTax,
        });
      });
    });

    if (consolidatedItems.length > 0) {
      setBillItems(consolidatedItems);
    }
  };

  // Select PO from PO/WO selection modal
  const handleSelectPo = (po: PurchaseOrder) => {
    setSelectedPoNumber(po.orderNumber);
    setPoModalOpen(false);
    // Auto-display related MRRs below
    const related = materialReceipts.filter((m) => m.poNumber === po.orderNumber);
    if (related.length > 0) {
      const mrrNos = [related[0].receiveNumber];
      setSelectedMrrNumbers(mrrNos);
      populateBillItemsFromMrrs(mrrNos, po.orderNumber);
    } else {
      setSelectedMrrNumbers([]);
      setBillItems([]);
    }
    toast.success(`Selected ${po.documentType === "Work Order" ? "Work Order" : "Purchase Order"} "${po.orderNumber}". Related MRR displayed.`);
  };

  // Update Bill Items on MRR Selection
  const handleToggleMrr = (mrrNo: string) => {
    if (formMode === "view") return;

    let nextMrrs: string[];
    if (selectedMrrNumbers.includes(mrrNo)) {
      if (selectedMrrNumbers.length === 1) {
        toast.error("At least one MRR reference is mandatory for supplier billing.");
        return;
      }
      nextMrrs = selectedMrrNumbers.filter((m) => m !== mrrNo);
    } else {
      nextMrrs = [...selectedMrrNumbers, mrrNo];
    }
    setSelectedMrrNumbers(nextMrrs);
    populateBillItemsFromMrrs(nextMrrs);
    toast.success(`Updated MRR references (${nextMrrs.join(", ")})`);
  };

  // Helper to populate items from Direct Receive MRRs
  const populateBillItemsFromDirectMrrs = (mrrNos: string[]) => {
    const matchedDirectMRRs = directMrrs.filter((m) => mrrNos.includes(m.mrrNumber));
    const consolidatedItems: SupplierBillItem[] = [];
    let sl = 1;

    matchedDirectMRRs.forEach((mrr) => {
      (mrr.items || []).forEach((item) => {
        const received =
          item.acceptedQuantity ??
          (item as any).receiveQuantity ??
          (item as any).receivedQuantity ??
          1;
        const unitPrice = item.unitPrice || 0;
        const lineBase = received * unitPrice;
        const vatRate = 5;
        const taxRate = 0;
        const lineVat = (lineBase * vatRate) / 100;
        const lineTax = (lineBase * taxRate) / 100;

        consolidatedItems.push({
          id: `sbi-dmrr-${mrr.mrrNumber}-${item.itemCode || sl}-${Date.now()}-${sl}`,
          sl: sl++,
          itemCode: item.itemCode,
          itemName: item.itemName,
          specification: item.specification || "Direct received goods",
          brand: item.brand || "—",
          origin: item.origin || "—",
          uom: item.uom || "PCS",
          mrrReceivedQty: received,
          previouslyBilledQty: 0,
          currentBillQty: received,
          unitPrice: unitPrice,
          discount: 0,
          vatRate,
          vatAmount: lineVat,
          taxRate,
          taxAmount: lineTax,
          lineAmount: lineBase + lineVat + lineTax,
        });
      });
    });

    setBillItems(consolidatedItems);
  };

  // Toggle Direct MRR Selection
  const handleToggleDirectMrr = (mrrNo: string) => {
    if (formMode === "view") return;

    let nextMrrs: string[];
    if (selectedMrrNumbers.includes(mrrNo)) {
      nextMrrs = selectedMrrNumbers.filter((m) => m !== mrrNo);
    } else {
      nextMrrs = [...selectedMrrNumbers, mrrNo];
    }
    setSelectedMrrNumbers(nextMrrs);
    populateBillItemsFromDirectMrrs(nextMrrs);
    if (nextMrrs.length > 0) {
      toast.success(`Updated Direct MRR references (${nextMrrs.join(", ")})`);
    } else {
      toast.info("Cleared Direct MRR references");
    }
  };

  // Select Supplier for Direct Receive
  const handleSelectReceiveSupplier = (supId: string, supName: string) => {
    setReceiveSupplierId(supId);
    setReceiveSupplierName(supName);
    setSupplierModalOpen(false);

    // Find direct MRRs for this supplier
    const matchingDirectMrrs = directMrrs.filter((d) => {
      const matchesId = d.supplierId === supId || d.supplierCode === supId;
      const matchesName =
        (d.supplierName && d.supplierName.toLowerCase() === supName.toLowerCase()) ||
        (d.supplier && d.supplier.toLowerCase() === supName.toLowerCase());
      return Boolean(matchesId || matchesName);
    });

    if (matchingDirectMrrs.length > 0) {
      // Auto-select all Direct MRRs for this supplier
      const firstMrrNos = matchingDirectMrrs.map((m) => m.mrrNumber);
      setSelectedMrrNumbers(firstMrrNos);
      populateBillItemsFromDirectMrrs(firstMrrNos);
      toast.success(
        `Selected supplier "${supName}". Loaded ${matchingDirectMrrs.length} Direct MRR(s).`
      );
    } else {
      setSelectedMrrNumbers([]);
      setBillItems([]);
      toast.info(`Selected supplier "${supName}". No Direct MRR records found for this supplier.`);
    }
  };

  const handleUpdateItemDiscount = (id: string, newDiscount: number) => {
    if (formMode === "view") return;
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const disc = Math.max(0, Number(newDiscount) || 0);
          const base = item.currentBillQty * item.unitPrice;
          const afterDisc = Math.max(0, base - disc);
          const vRate = item.vatRate ?? 5;
          const tRate = item.taxRate ?? 0;
          const vat = (afterDisc * vRate) / 100;
          const tax = (afterDisc * tRate) / 100;
          return {
            ...item,
            discount: disc,
            vatAmount: vat,
            taxAmount: tax,
            lineAmount: afterDisc + vat + tax,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItemVatRate = (id: string, newVatRate: number) => {
    if (formMode === "view") return;
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const vRate = Math.max(0, Number(newVatRate) || 0);
          const base = item.currentBillQty * item.unitPrice;
          const afterDisc = Math.max(0, base - item.discount);
          const vat = (afterDisc * vRate) / 100;
          return {
            ...item,
            vatRate: vRate,
            vatAmount: vat,
            lineAmount: afterDisc + vat + (item.taxAmount ?? 0),
          };
        }
        return item;
      })
    );
  };

  // Item Update with Strict Validation: Current Bill Qty <= MRR Received Qty - Previously Billed Qty
  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (formMode === "view") return;

    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxAllowed = item.mrrReceivedQty - item.previouslyBilledQty;
          if (newQty > maxAllowed) {
            toast.error(
              `Validation Error: Bill Quantity (${newQty}) cannot exceed unbilled MRR received quantity (${maxAllowed}).`
            );
            newQty = maxAllowed;
          }
          if (newQty < 0) newQty = 0;

          const base = newQty * item.unitPrice;
          const afterDisc = Math.max(0, base - item.discount);
          const vatRate = item.vatRate ?? 5;
          const taxRate = item.taxRate ?? 0;
          const vat = (afterDisc * vatRate) / 100;
          const tax = (afterDisc * taxRate) / 100;
          return {
            ...item,
            currentBillQty: newQty,
            vatAmount: vat,
            taxAmount: tax,
            lineAmount: afterDisc + vat + tax,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItemTaxRate = (id: string, newTaxRate: number) => {
    if (formMode === "view") return;

    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const base = item.currentBillQty * item.unitPrice;
          const afterDisc = Math.max(0, base - item.discount);
          const taxRate = Math.max(0, newTaxRate);
          const tax = (afterDisc * taxRate) / 100;
          return {
            ...item,
            taxRate,
            taxAmount: tax,
            lineAmount: afterDisc + item.vatAmount + tax,
          };
        }
        return item;
      })
    );
  };

  // Financial Summary Totals:
  // Item-level Tax carried forward + any manual tax adjustments
  const summary = useMemo(() => {
    let sub = 0;
    let autoItemsDisc = 0;
    let autoItemsVat = 0;
    let autoItemsTax = 0;
    billItems.forEach((i) => {
      sub += i.currentBillQty * i.unitPrice;
      autoItemsDisc += i.discount;
      autoItemsVat += i.vatAmount;
      autoItemsTax += i.taxAmount ?? 0;
    });

    const extraDisc = manualDiscount !== "" ? Math.max(0, Number(manualDiscount)) : 0;
    const disc = autoItemsDisc + extraDisc;
    const extraVat = manualVatAmount !== "" ? Math.max(0, Number(manualVatAmount)) : 0;
    const vat = autoItemsVat + extraVat;
    const tax = autoItemsTax + (taxAmount !== "" ? Math.max(0, Number(taxAmount)) : 0);
    const others = Math.max(0, Number(otherCharges) || 0);
    const adj = Number(adjustment) || 0;
    const net = Math.max(0, sub - disc + vat + tax + others + adj);
    const round = Math.round(net) - net;

    return {
      subtotal: sub,
      discount: disc,
      vat: vat,
      tax: tax,
      autoItemsTax: autoItemsTax,
      otherCharges: others,
      adjustment: adj,
      netBillAmount: Math.round(net),
      roundOff: round,
    };
  }, [billItems, otherCharges, adjustment, manualDiscount, manualVatAmount, taxAmount]);

  // Save / Submit Bill
  const handleSubmitBill = (approvalStatus: SupplierBill["approvalStatus"]) => {
    if (!supplierBillNo.trim()) {
      toast.error("Supplier Invoice / Bill No. is required");
      return;
    }
    if (billType !== "Service Bill Entry") {
      if (selectedMrrNumbers.length === 0) {
        toast.error(
          billType === "Bill against Receive"
            ? "At least one Direct Receive MRR must be selected"
            : "At least one MRR must be selected"
        );
        return;
      }
      if (billItems.length === 0) {
        toast.error("At least one line item is required from MRR");
        return;
      }
    } else {
      if (billItems.length === 0) {
        toast.error("At least one service item is required to generate a service bill");
        return;
      }
    }
    if (otherCharges !== "" && Number(otherCharges) < 0) {
      toast.error("Other Charges cannot be negative. Please enter 0 or a positive value.");
      return;
    }
    if (manualDiscount !== "" && Number(manualDiscount) < 0) {
      toast.error("Discount cannot be negative. Please enter 0 or a positive value.");
      return;
    }
    if (manualVatAmount !== "" && Number(manualVatAmount) < 0) {
      toast.error("VAT Amount cannot be negative. Please enter 0 or a positive value.");
      return;
    }

    const effectivePoNumber =
      billType === "Service Bill Entry"
        ? "DIRECT-SERVICE"
        : billType === "Bill against Receive"
        ? "DIRECT-RECEIVE"
        : selectedPoNumber;
    const effectivePoDate =
      billType === "Service Bill Entry" || billType === "Bill against Receive"
        ? billDate
        : currentPo.orderDate;
    const effectiveSupplierId = activeSupplierId;
    const effectiveSupplierName = activeSupplierName;

    if (formMode === "edit" && selectedBillId) {
      const updated = bills.map((b) =>
        b.id === selectedBillId
          ? {
              ...b,
              billDate,
              billType,
              poNumber: effectivePoNumber,
              poDate: effectivePoDate,
              mrrNumbers: billType === "Service Bill Entry" ? [] : selectedMrrNumbers,
              supplierId: effectiveSupplierId,
              supplierName: effectiveSupplierName,
              supplierBillNo,
              supplierBillDate,
              currency,
              subtotal: summary.subtotal,
              discount: summary.discount,
              vat: summary.vat,
              tax: summary.tax,
              otherCharges: summary.otherCharges,
              otherChargeServiceItemIds: selectedServiceItemIds,
              adjustment: summary.adjustment,
              netBillAmount: summary.netBillAmount,
              roundOff: summary.roundOff,
              paymentDueDate,
              outstandingAmount: summary.netBillAmount - b.paidAmount,
              approvalStatus,
              remarks,
              items: billItems,
            }
          : b
      );
      setBills(updated);
      setStoredSupplierBills(updated);
      setCurrentApprovalStatus(approvalStatus);
      setFormMode("view");
      toast.success(
        billType === "Service Bill Entry"
          ? `Service Bill "${billNumber}" updated successfully!`
          : `Supplier Bill "${billNumber}" updated successfully!`
      );
      return;
    }

    const newBill: SupplierBill = {
      id: `bil-${Date.now()}`,
      billNumber,
      billDate,
      billType,
      poNumber: effectivePoNumber,
      poDate: effectivePoDate,
      mrrNumbers: billType === "Service Bill Entry" ? [] : selectedMrrNumbers,
      supplierId: effectiveSupplierId,
      supplierName: effectiveSupplierName,
      supplierBillNo,
      supplierBillDate,
      currency,
      subtotal: summary.subtotal,
      discount: summary.discount,
      vat: summary.vat,
      tax: summary.tax,
      otherCharges: summary.otherCharges,
      otherChargeServiceItemIds: selectedServiceItemIds,
      otherChargesBreakdown: selectedServiceItemIds.map((id) => {
        const item = availableServiceItems.find((s) => s.id === id);
        return {
          id,
          name: item?.itemName || id,
          code: item?.itemCode,
          amount: serviceItemAmounts[id] ?? 0,
        };
      }),
      adjustment: summary.adjustment,
      netBillAmount: summary.netBillAmount,
      roundOff: summary.roundOff,
      paymentStatus: "Unpaid",
      paymentDueDate,
      paidAmount: 0,
      outstandingAmount: summary.netBillAmount,
      approvalStatus,
      submittedBy: "Tahmid Afsar Shapno",
      submittedDate: billDate,
      remarks,
      attachments: [
        {
          documentType: "Supplier Invoice",
          documentName: `Invoice_${supplierBillNo}.pdf`,
          fileName: `Invoice_${supplierBillNo}.pdf`,
          description: "Vendor submitted invoice copy",
        },
      ],
      items: billItems,
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    setStoredSupplierBills(updated);
    setSelectedBillId(newBill.id);
    setCurrentApprovalStatus(approvalStatus);
    setFormMode("view");
    toast.success(
      billType === "Service Bill Entry"
        ? `Service Bill "${billNumber}" successfully created and saved as ${approvalStatus}!`
        : `Supplier Bill "${billNumber}" successfully created and saved as ${approvalStatus}!`
    );
  };

  // Standard Preview Report Data Builder
  const billReportData: StandardReportData = useMemo(() => {
    const totalAmountSum = billItems.reduce(
      (sum, item) => sum + (Number(item.lineAmount) || 0),
      0
    );

    return {
      reportType: "supplier-bill",
      title:
        billType === "Service Bill Entry"
          ? "Supplier Service Bill / Commercial Dossier"
          : billType === "Bill against WO"
          ? "Work Order Supplier Commercial Bill Dossier"
          : billType === "Bill against Receive"
          ? "Direct Receive Supplier Bill / Commercial Dossier"
          : "Supplier Commercial Bill / Invoice Dossier",
      documentNumber: billNumber,
      documentNo: billNumber,
      documentDate: billDate,
      hideDocHeaderInfo: true,
      department: "Finance & Accounts (Procurement Billing)",
      status: currentApprovalStatus,
      metadata: [
        { label: "Internal Bill No", value: billNumber, highlight: true },
        { label: "Bill Type", value: billType, highlight: true },
        { label: "Bill Date", value: billDate },
        { label: "Supplier / Vendor", value: activeSupplierName, highlight: true },
        { label: "Vendor Invoice No", value: supplierBillNo || "—" },
        { label: "Vendor Invoice Date", value: supplierBillDate || "—" },
        ...(billType === "Service Bill Entry"
          ? [{ label: "Billing Method", value: "Direct Service Bill Entry" }]
          : billType === "Bill against Receive"
          ? [
              { label: "Billing Method", value: "Bill against Direct Receive" },
              { label: "Linked Direct MRR References", value: selectedMrrNumbers.join(", ") },
            ]
          : [
              {
                label: billType === "Bill against WO" ? "Work Order Reference" : "PO Reference",
                value: selectedPoNumber,
              },
              { label: "Linked MRR References", value: selectedMrrNumbers.join(", ") },
            ]),
        { label: "Currency", value: currency },
      ],
      tableHeaders: [
        "SL",
        billType === "Service Bill Entry" ? "Service Description & Scope" : "Item Description & Spec",
        billType === "Service Bill Entry" ? "Category / Group" : "Brand / Origin",
        "UOM",
        "Billed Qty",
        "Unit Price",
        "Discount",
        "VAT",
        "TAX",
        "Total Amount",
        "Remarks",
      ],
      tableRows: billItems.map((item, idx) => [
        idx + 1,
        <div key={idx}>
          <div className="font-bold text-slate-900">{item.itemName}</div>
          <div className="text-[9.5px] text-slate-500 font-mono">
            {item.itemCode} • {item.specification}
          </div>
        </div>,
        `${item.brand} / ${item.origin}`,
        item.uom,
        item.currentBillQty,
        `৳ ${item.unitPrice.toLocaleString()}`,
        `৳ ${(item.discount || 0).toLocaleString()}`,
        `৳ ${(item.vatAmount || 0).toLocaleString()}`,
        `৳ ${(item.taxAmount || 0).toLocaleString()}`,
        `৳ ${item.lineAmount.toLocaleString()}`,
        billType === "Service Bill Entry"
          ? `Direct Service Bill`
          : `MRR Qty: ${item.mrrReceivedQty} (Prev: ${item.previouslyBilledQty})`,
      ]),
      summaryCards: [
        { label: "Subtotal", value: `৳ ${summary.subtotal.toLocaleString()}` },
        { label: "Discount", value: `- ৳ ${summary.discount.toLocaleString()}` },
        { label: "VAT", value: `+ ৳ ${summary.vat.toLocaleString()}` },
        { label: "Tax", value: `+ ৳ ${summary.tax.toLocaleString()}` },
        { label: "Other Charges", value: `+ ৳ ${summary.otherCharges.toLocaleString()}` },
        { label: "Adjustment", value: `৳ ${summary.adjustment.toLocaleString()}` },
        {
          label: "Total Amount",
          value: `৳ ${totalAmountSum.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isBold: true,
          isHighlight: true,
        },
      ],
      signatures: [
        { role: "Billing Clerk", name: "Tahmid Afsar Shapno", designation: "Asst. Manager - Billing" },
        { role: "Store Verification", name: "Nazmul Huda", designation: "Store Officer" },
        { role: "Audit / Accounts", name: "Kamrul Islam", designation: "Accounts Executive" },
        { role: "Approved By", name: "Engr. Tanvir Ahmed", designation: "Head of Finance & Procurement" },
      ],
    };
  }, [
    billNumber,
    billDate,
    currentApprovalStatus,
    currentPo,
    supplierBillNo,
    supplierBillDate,
    selectedPoNumber,
    selectedMrrNumbers,
    currency,
    paymentDueDate,
    billItems,
    summary,
  ]);

  const isReadOnly = formMode === "view";

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                <span>Procurement</span>
                <ChevronRight className="size-3" />
                <span>Billing</span>
                <ChevronRight className="size-3" />
                <span className="text-amber-500 font-bold">Supplier Bill</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <CreditCard className="size-7 text-amber-500" />
                Supplier Bill Management
              </h1>
            </div>

            {/* Quick Actions & Bill Selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              {bills.length > 0 && (
                <div className="flex items-center gap-1.5 bg-muted/40 border border-border px-2.5 py-1 rounded-xl">
                  <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                    Load Bill:
                  </span>
                  <select
                    value={selectedBillId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        handleStartCreateNew();
                      } else {
                        const target = bills.find((b) => b.id === val);
                        if (target) loadBillIntoForm(target, "view");
                      }
                    }}
                    className="text-xs font-mono font-bold bg-transparent border-0 outline-none text-foreground cursor-pointer"
                  >
                    <option value="">+ New Bill Entry</option>
                    {bills.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.billNumber} • {b.supplierBillNo} ({b.approvalStatus})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
                title="Preview Standard Report"
              >
                <Printer className="size-3.5" /> Preview Report
              </button>

              {formMode === "view" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setFormMode("edit")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    <Edit className="size-3.5" /> Edit Bill
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCreateNew}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="size-3.5" /> + New Bill
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartCreateNew}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" /> New Supplier Bill
                </button>
              )}
            </div>
          </div>

          {/* Unified Supplier Bill Form (Shared for Create, View, and Edit) */}
          <div className="bg-card rounded-2xl border-2 border-border/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Receipt className="size-5 text-amber-500" />
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {formMode === "view"
                      ? "Supplier Bill Dossier (View Mode)"
                      : formMode === "edit"
                      ? "Edit Supplier Bill against Verified MRR"
                      : "New Supplier Bill Entry against Verified MRR"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                    currentApprovalStatus === "Approved"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : currentApprovalStatus === "Pending Approval" || currentApprovalStatus === "Submitted"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                  }`}
                >
                  {currentApprovalStatus}
                </span>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {billNumber}
                </span>
              </div>
            </div>

            {/* Bill Header Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              {/* 1. Bill Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Bill Type*
                </label>
                <select
                  disabled={isReadOnly}
                  value={billType}
                  onChange={(e) => handleBillTypeChange(e.target.value as BillType)}
                  className="w-full px-3 py-2 font-bold bg-background border border-amber-500/50 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-foreground cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <option value="Bill against PO">Bill against PO</option>
                  <option value="Bill against WO">Bill against WO</option>
                  <option value="Bill against Receive">Bill against Receive</option>
                  <option value="Service Bill Entry">Service Bill Entry</option>
                </select>
              </div>

              {/* 2. Bill Date */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Bill Date*
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* 3. Purchase Order / Work Order* (Hidden when Service Bill Entry or Bill against Receive) */}
              {billType !== "Service Bill Entry" && billType !== "Bill against Receive" && (
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    {billType === "Bill against PO" ? "Purchase Order *" : "Work Order *"}
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      disabled={isReadOnly}
                      value={selectedPoNumber}
                      onChange={(e) => {
                        const found = selectableOrders.find((p) => p.orderNumber === e.target.value);
                        if (found) handleSelectPo(found);
                      }}
                      className="w-full px-3 py-2 font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-amber-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed truncate"
                    >
                      <option value="">
                        Select {billType === "Bill against PO" ? "Purchase Order" : "Work Order"}...
                      </option>
                      {selectableOrders.map((po) => (
                        <option key={po.id} value={po.orderNumber}>
                          {po.orderNumber} ({po.supplierName})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setPoModalOpen(true)}
                      className="px-2.5 py-2 border border-border rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-muted/50 disabled:opacity-50 cursor-pointer shrink-0"
                      title={`Search ${billType === "Bill against PO" ? "Purchase Orders" : "Work Orders"}`}
                    >
                      <Search className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Supplier / Vendor* */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
                  {billType !== "Service Bill Entry" && billType !== "Bill against Receive" && <Lock className="size-3" />} Supplier / Vendor*
                </label>
                {billType === "Service Bill Entry" ? (
                  <select
                    disabled={isReadOnly}
                    value={serviceSupplierId}
                    onChange={(e) => {
                      const sup = allSuppliers.find(
                        (s) => s.id === e.target.value || s.vendorCode === e.target.value
                      );
                      if (sup) {
                        setServiceSupplierId(sup.id);
                        setServiceSupplierName(sup.vendorName);
                      }
                    }}
                    className="w-full px-3 py-2 font-bold bg-background border border-border rounded-lg outline-none focus:border-amber-500 text-foreground cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed truncate"
                  >
                    {allSuppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.vendorName} ({s.vendorCode})
                      </option>
                    ))}
                  </select>
                ) : billType === "Bill against Receive" ? (
                  <div className="flex gap-1.5">
                    <select
                      disabled={isReadOnly}
                      value={receiveSupplierId}
                      onChange={(e) => {
                        const sup = allSuppliers.find(
                          (s) => s.id === e.target.value || s.vendorCode === e.target.value
                        );
                        if (sup) {
                          handleSelectReceiveSupplier(sup.id, sup.vendorName);
                        }
                      }}
                      className="w-full px-3 py-2 font-bold bg-background border border-amber-500/50 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-foreground cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed truncate"
                    >
                      <option value="">Select Supplier...</option>
                      {allSuppliers.map((s) => {
                        const count = directMrrs.filter(
                          (d) =>
                            d.supplierId === s.id ||
                            (d.supplierName && d.supplierName.toLowerCase() === s.vendorName.toLowerCase())
                        ).length;
                        return (
                          <option key={s.id} value={s.id}>
                            {s.vendorName} {count > 0 ? `(${count} Direct MRR${count > 1 ? "s" : ""})` : ""}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setSupplierModalOpen(true)}
                      className="px-2.5 py-2 border border-border rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-muted/50 disabled:opacity-50 cursor-pointer shrink-0"
                      title="Search Suppliers with Direct MRRs"
                    >
                      <Search className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={activeSupplierName}
                    className="w-full px-3 py-2 font-bold bg-muted/50 border border-border rounded-lg cursor-not-allowed text-foreground truncate"
                  />
                )}
              </div>

              {/* 5. Supplier Bill / Invoice No.* */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Supplier Bill / Invoice No.*
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  placeholder="e.g. INV-2026-904"
                  value={supplierBillNo}
                  onChange={(e) => setSupplierBillNo(e.target.value)}
                  className="w-full px-3 py-2 font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* 6. Supplier Bill Date* */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Supplier Bill Date*
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={supplierBillDate}
                  onChange={(e) => setSupplierBillDate(e.target.value)}
                  className="w-full px-3 py-2 font-semibold bg-background border border-border rounded-lg outline-none focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* 7. Currency* */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Currency*
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value="BDT (৳ Bangladeshi Taka)"
                  className="w-full px-3 py-2 font-semibold bg-muted/50 border border-border rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            {/* MRR Reference Section (Multiple MRR Support) - Hidden for Service Bill Entry */}
            {billType !== "Service Bill Entry" && (
              <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      {billType === "Bill against Receive"
                        ? "Linked Direct Receive MRR References"
                        : "Linked Material Receive Report (MRR) References"}
                    </h3>
                    {billType === "Bill against Receive" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                        Supplier: {activeSupplierName} ({supplierDirectMrrs.length} Direct MRR{supplierDirectMrrs.length !== 1 ? "s" : ""} Available)
                      </span>
                    )}
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setMrrModalOpen(true)}
                      className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Search className="size-3" /> Select MRR ({selectedMrrNumbers.length})
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMrrNumbers.map((mrrNo) => (
                    <span
                      key={mrrNo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs"
                    >
                      {mrrNo}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => {
                            if (billType === "Bill against Receive") {
                              handleToggleDirectMrr(mrrNo);
                            } else {
                              handleToggleMrr(mrrNo);
                            }
                          }}
                          className="hover:text-rose-500 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {selectedMrrNumbers.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">
                      {billType === "Bill against Receive"
                        ? `No Direct MRRs linked for "${activeSupplierName}". Click "Select MRR" to select from available direct receipts.`
                        : 'No MRRs linked. Click "Select MRR" to link verified goods receipts.'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {billType === "Bill against Receive" ? (
                    <>
                      Billing Source: <span className="font-bold text-emerald-600">Direct Receive (No PO)</span> • Supplier:{" "}
                      <span className="font-bold text-foreground">{activeSupplierName}</span>
                    </>
                  ) : (
                    <>
                      {billType === "Bill against WO" ? "WO Reference:" : "PO Reference:"}{" "}
                      <span className="font-bold text-foreground">{selectedPoNumber}</span> • Supplier:{" "}
                      <span className="font-bold text-foreground">{activeSupplierName}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bill Item Details Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  {billType === "Service Bill Entry"
                    ? "Bill Item Details (Service Items)"
                    : "Bill Item Details (Auto-populated from MRR)"}
                </h3>
                {billType === "Service Bill Entry" && !isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setServiceItemModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add Service Item
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                {billType === "Service Bill Entry" ? (
                  /* Service Items Table */
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                        <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                        <th className="py-2.5 px-3 font-bold min-w-[200px]">Service Item & Scope</th>
                        <th className="py-2.5 px-3 w-16 font-bold text-center">UOM</th>
                        <th className="py-2.5 px-3 text-right font-bold w-24 text-amber-600">
                          Bill Qty*
                        </th>
                        <th className="py-2.5 px-3 text-right font-bold w-28 text-amber-600">
                          Unit Rate (৳)*
                        </th>
                        <th className="py-2.5 px-3 text-right font-bold w-24">Discount (৳)</th>
                        <th className="py-2.5 px-3 text-right font-bold">VAT</th>
                        <th className="py-2.5 px-3 text-right font-bold text-amber-600">Tax</th>
                        <th className="py-2.5 px-3 text-right font-bold">Line Total (৳)</th>
                        {!isReadOnly && (
                          <th className="py-2.5 px-2 text-center w-12 font-bold">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {billItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-muted/20">
                          <td className="py-2 px-3 text-center text-muted-foreground font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-bold text-foreground">{item.itemName}</div>
                            {isReadOnly ? (
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {item.itemCode} • {item.specification}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={item.specification}
                                onChange={(e) =>
                                  handleUpdateServiceItemLine(item.id, "specification", e.target.value)
                                }
                                placeholder="Service description / scope"
                                className="w-full mt-1 text-[10px] px-2 py-0.5 bg-background border border-border/80 rounded focus:border-amber-500 outline-none"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-center text-muted-foreground font-semibold">
                            {item.uom}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono font-bold text-amber-600">
                                {item.currentBillQty}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                value={item.currentBillQty}
                                onChange={(e) =>
                                  handleUpdateServiceItemLine(item.id, "currentBillQty", e.target.value)
                                }
                                className="w-16 text-right font-mono font-bold px-2 py-1 bg-background border border-amber-500/40 rounded focus:border-amber-500 outline-none text-xs"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono font-bold">
                                ৳ {item.unitPrice.toLocaleString()}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleUpdateServiceItemLine(item.id, "unitPrice", e.target.value)
                                }
                                className="w-24 text-right font-mono font-bold px-2 py-1 bg-background border border-amber-500/40 rounded focus:border-amber-500 outline-none text-xs"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono text-rose-600">
                                {item.discount ? `-৳ ${Number(item.discount).toLocaleString()}` : "৳ 0"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={item.discount || ""}
                                placeholder="0"
                                onChange={(e) =>
                                  handleUpdateServiceItemLine(item.id, "discount", e.target.value)
                                }
                                className="w-20 text-right font-mono px-2 py-1 bg-background border border-border rounded focus:border-amber-500 outline-none text-xs text-rose-600"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            {isReadOnly ? (
                              <>
                                <div className="font-bold text-foreground">৳ {item.vatAmount.toLocaleString()}</div>
                                <span className="text-[10px] text-muted-foreground font-semibold">({item.vatRate ?? 5}%)</span>
                              </>
                            ) : (
                              <div>
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={item.vatRate ?? 5}
                                    onChange={(e) =>
                                      handleUpdateServiceItemLine(item.id, "vatRate", e.target.value)
                                    }
                                    className="w-14 text-right font-mono font-semibold px-1.5 py-0.5 bg-background border border-border rounded focus:border-amber-500 outline-none text-xs"
                                  />
                                  <span className="text-[11px] text-muted-foreground font-semibold">%</span>
                                </div>
                                <div className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                                  ৳ {item.vatAmount.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            {isReadOnly ? (
                              <>
                                <div className="font-bold text-foreground">
                                  ৳ {(item.taxAmount ?? 0).toLocaleString()}
                                </div>
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                                  ({item.taxRate ?? 0}%)
                                </span>
                              </>
                            ) : (
                              <div>
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={item.taxRate ?? 0}
                                    onChange={(e) =>
                                      handleUpdateServiceItemLine(item.id, "taxRate", e.target.value)
                                    }
                                    className="w-14 text-right font-mono font-semibold px-1.5 py-0.5 bg-background border border-amber-500/40 rounded focus:border-amber-500 outline-none text-xs"
                                  />
                                  <span className="text-[11px] text-muted-foreground font-semibold">%</span>
                                </div>
                                <div className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                                  ৳ {(item.taxAmount ?? 0).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            ৳ {item.lineAmount.toLocaleString()}
                          </td>
                          {!isReadOnly && (
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveServiceItem(item.id)}
                                className="p-1 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                                title="Remove service item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {billItems.length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-10 text-center text-muted-foreground text-xs">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Layers className="size-8 text-muted-foreground/40" />
                              <span className="font-semibold text-foreground">No service items added to this bill yet.</span>
                              <p className="text-muted-foreground text-[11px] max-w-sm">
                                Click &quot;Add Service Item&quot; to pick services from the service catalog or add custom scope entries.
                              </p>
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  onClick={() => setServiceItemModalOpen(true)}
                                  className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 cursor-pointer"
                                >
                                  <Plus className="size-3.5" /> Add Service Item
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  /* Original MRR Populated Table */
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border">
                        <th className="py-2.5 px-3 w-10 text-center font-bold">SL</th>
                        <th className="py-2.5 px-3 font-bold">Item & Specification</th>
                        <th className="py-2.5 px-3 font-bold">Brand / Origin</th>
                        <th className="py-2.5 px-3 w-16 font-bold">UOM</th>
                        <th className="py-2.5 px-3 text-right font-bold">MRR Rec. Qty</th>
                        <th className="py-2.5 px-3 text-right font-bold">Prev Billed</th>
                        <th className="py-2.5 px-3 text-right font-bold w-28 text-amber-600">
                          Current Bill Qty*
                        </th>
                        <th className="py-2.5 px-3 text-right font-bold">Unit Price (৳)</th>
                        <th className="py-2.5 px-3 text-right font-bold">Discount (৳)</th>
                        <th className="py-2.5 px-3 text-right font-bold">VAT</th>
                        <th className="py-2.5 px-3 text-right font-bold text-amber-600">Tax</th>
                        <th className="py-2.5 px-3 text-right font-bold">Line Total (৳)</th>
                        {!isReadOnly && (
                          <th className="py-2.5 px-3 text-center w-12 font-bold">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {billItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-muted/20">
                          <td className="py-2 px-3 text-center text-muted-foreground font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-bold text-foreground">{item.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {item.itemCode} • {item.specification}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">
                            {item.brand} / {item.origin}
                          </td>
                          <td className="py-2 px-3 text-muted-foreground font-semibold">
                            {item.uom}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            {item.mrrReceivedQty}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                            {item.previouslyBilledQty}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono font-bold text-amber-600 text-xs">
                                {item.currentBillQty}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                max={item.mrrReceivedQty - item.previouslyBilledQty}
                                value={item.currentBillQty}
                                onChange={(e) =>
                                  handleUpdateItemQty(item.id, Number(e.target.value))
                                }
                                className="w-20 text-right font-mono font-bold px-2 py-1 bg-background border border-amber-500/40 rounded focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-xs"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                            ৳ {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isReadOnly ? (
                              <span className="font-mono text-rose-600 text-xs">
                                {item.discount ? `-৳ ${Number(item.discount).toLocaleString()}` : "৳ 0"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                value={item.discount || ""}
                                placeholder="0"
                                onChange={(e) =>
                                  handleUpdateItemDiscount(item.id, Number(e.target.value))
                                }
                                className="w-20 text-right font-mono px-2 py-1 bg-background border border-border rounded focus:border-amber-500 outline-none text-xs text-rose-600"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            {isReadOnly ? (
                              <>
                                <div className="font-bold text-foreground">৳ {item.vatAmount.toLocaleString()}</div>
                                <span className="text-[10px] text-muted-foreground font-semibold">({item.vatRate ?? 5}%)</span>
                              </>
                            ) : (
                              <div>
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={item.vatRate ?? 5}
                                    onChange={(e) =>
                                      handleUpdateItemVatRate(item.id, Number(e.target.value))
                                    }
                                    className="w-14 text-right font-mono font-semibold px-1.5 py-0.5 bg-background border border-border rounded focus:border-amber-500 outline-none text-xs"
                                  />
                                  <span className="text-[11px] text-muted-foreground font-semibold">%</span>
                                </div>
                                <div className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                                  ৳ {item.vatAmount.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            {isReadOnly ? (
                              <>
                                <div className="font-bold text-foreground">
                                  ৳ {(item.taxAmount ?? 0).toLocaleString()}
                                </div>
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                                  ({item.taxRate ?? 0}%)
                                </span>
                              </>
                            ) : (
                              <div>
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={item.taxRate ?? 0}
                                    onChange={(e) =>
                                      handleUpdateItemTaxRate(item.id, Number(e.target.value))
                                    }
                                    className="w-14 text-right font-mono font-semibold px-1.5 py-0.5 bg-background border border-amber-500/40 rounded focus:border-amber-500 outline-none text-xs"
                                  />
                                  <span className="text-[11px] text-muted-foreground font-semibold">%</span>
                                </div>
                                <div className="text-[11px] font-mono font-bold text-foreground mt-0.5">
                                  ৳ {(item.taxAmount ?? 0).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                            ৳ {item.lineAmount.toLocaleString()}
                          </td>
                          {!isReadOnly && (
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveBillItem(item.id)}
                                className="p-1 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                title="Delete line item"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {billItems.length === 0 && (
                        <tr>
                          <td colSpan={isReadOnly ? 12 : 13} className="py-8 text-center text-muted-foreground text-xs">
                            No items found for the selected MRRs.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* 4. Bill Amount Summary & Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Remarks & Payment Notes
                </label>
                <textarea
                  rows={3}
                  disabled={isReadOnly}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter audit notes, bank settlement remarks..."
                  className="w-full p-2.5 text-xs bg-background border border-border rounded-xl outline-none focus:border-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />

                {/* Additional Financial Adjustment Inputs:
                    Other Charges, Adjustment (+/-), followed immediately by Discount and VAT Amount */}
                {/* Additional Financial Adjustment Inputs:
                    Other Charges (Multi-select service dropdown), Adjustment (+/-), Discount, VAT, and Tax */}
                <div className="space-y-3 pt-1 text-xs">
                  {/* Other Charges Multi-select Dropdown & Per-item Amounts */}
                  <div className="relative">
                    <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                      Other Charges
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <button
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                          className="w-full min-h-9 px-3 py-1.5 text-xs text-left bg-background border border-border rounded-lg flex items-center justify-between gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <span className="truncate text-foreground font-medium">
                            {selectedServiceItemIds.length > 0
                              ? `${selectedServiceItemIds.length} item(s) selected`
                              : "Select service items (Freight, Loading, Handling)..."}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">▼</span>
                        </button>

                        {serviceDropdownOpen && (
                          <div className="absolute z-30 mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-2 border-b border-border bg-muted/40">
                              <div className="relative">
                                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                  type="text"
                                  value={serviceSearchQuery}
                                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                                  placeholder="Search service items..."
                                  className="w-full pl-7.5 pr-2 py-1 text-xs bg-background border border-border rounded-md outline-none"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto p-1 divide-y divide-border/40">
                              {availableServiceItems
                                .filter((s) => {
                                  if (!serviceSearchQuery.trim()) return true;
                                  const q = serviceSearchQuery.toLowerCase();
                                  return (
                                    s.itemName.toLowerCase().includes(q) ||
                                    s.itemCode.toLowerCase().includes(q)
                                  );
                                })
                                .map((service) => {
                                  const isSelected = selectedServiceItemIds.includes(service.id);
                                  return (
                                    <button
                                      key={service.id}
                                      type="button"
                                      onClick={() => handleToggleServiceItem(service.id)}
                                      className={`w-full p-2 text-left text-xs rounded-lg flex items-center justify-between gap-2 hover:bg-muted transition cursor-pointer ${
                                        isSelected ? "bg-amber-500/10 font-bold text-amber-700 dark:text-amber-400" : ""
                                      }`}
                                    >
                                      <div className="truncate">
                                        <div className="font-semibold">{service.itemName}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono">
                                          {service.itemCode}
                                        </div>
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="size-4 accent-amber-500 rounded"
                                      />
                                    </button>
                                  );
                                })}
                              {availableServiceItems.length === 0 && (
                                <div className="p-3 text-center text-xs text-muted-foreground">
                                  No service items found in Item Setup.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Total other charges amount display / fallback input */}
                      <div className="w-28 shrink-0">
                        <input
                          type="number"
                          min="0"
                          disabled={isReadOnly || selectedServiceItemIds.length > 0}
                          value={otherCharges}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOtherCharges(val === "" ? "" : Math.max(0, Number(val)));
                          }}
                          placeholder="Amount"
                          title={selectedServiceItemIds.length > 0 ? "Calculated from selected service items below" : "Enter manual other charges"}
                          className="w-full px-2.5 py-1.5 font-mono text-xs text-right bg-background border border-border rounded-lg outline-none disabled:opacity-85 disabled:cursor-not-allowed font-bold"
                        />
                      </div>
                    </div>

                    {/* Single-item amount input field for each selected Other Charge */}
                    {selectedServiceItemIds.length > 0 && (
                      <div className="mt-2 space-y-1.5 border border-border/70 rounded-xl p-2.5 bg-muted/20">
                        <div className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                          <span>Selected Other Charges:</span>
                          <span className="font-mono text-foreground font-extrabold">Total: ৳{summary.otherCharges.toLocaleString()}</span>
                        </div>
                        {selectedServiceItemIds.map((id) => {
                          const item = availableServiceItems.find((s) => s.id === id);
                          const currentAmt = serviceItemAmounts[id] ?? "";
                          return (
                            <div
                              key={id}
                              className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background border border-border/60 text-xs"
                            >
                              <div className="truncate flex-1">
                                <span className="font-bold text-foreground">{item?.itemName || id}</span>
                                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">({item?.itemCode})</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] font-semibold text-muted-foreground">৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  disabled={isReadOnly}
                                  value={currentAmt}
                                  onChange={(e) =>
                                    handleUpdateServiceItemAmount(id, Math.max(0, parseFloat(e.target.value) || 0))
                                  }
                                  placeholder="0.00"
                                  className="w-24 px-2 py-1 font-mono text-xs text-right bg-background border border-border rounded-md outline-none focus:border-amber-500 font-bold"
                                />
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleServiceItem(id)}
                                    className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer ml-1"
                                    title="Remove this charge"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1">
                        Adjustment (+/-)
                      </label>
                      <input
                        type="number"
                        disabled={isReadOnly}
                        value={adjustment}
                        onChange={(e) =>
                          setAdjustment(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 font-mono bg-background border border-border rounded-lg outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-emerald-600 uppercase block mb-1">
                        Discount (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={isReadOnly}
                        placeholder={String(summary.discount)}
                        value={manualDiscount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualDiscount(val === "" ? "" : Math.max(0, Number(val)));
                        }}
                        className="w-full px-2.5 py-1.5 font-mono bg-background border border-emerald-500/40 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-blue-600 uppercase block mb-1">
                        VAT (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={isReadOnly}
                        placeholder={String(summary.vat)}
                        value={manualVatAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualVatAmount(val === "" ? "" : Math.max(0, Number(val)));
                        }}
                        className="w-full px-2.5 py-1.5 font-mono bg-background border border-blue-500/40 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-amber-600 uppercase block mb-1">
                        Tax (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={isReadOnly}
                        placeholder="0"
                        value={taxAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTaxAmount(val === "" ? "" : Math.max(0, Number(val)));
                        }}
                        className="w-full px-2.5 py-1.5 font-mono bg-background border border-amber-500/40 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-foreground">
                    ৳ {summary.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Discount</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    - ৳ {summary.discount.toLocaleString()}
                  </span>
                </div>
                {/* VAT Label */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>VAT</span>
                  <span className="font-mono font-bold text-foreground">
                    + ৳ {summary.vat.toLocaleString()}
                  </span>
                </div>
                {/* Tax Field beside VAT and Total */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    + ৳ {summary.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Other Charges</span>
                  <span className="font-mono font-bold text-foreground">
                    + ৳ {summary.otherCharges.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Adjustment</span>
                  <span className="font-mono font-bold text-foreground">
                    ৳ {summary.adjustment.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase text-foreground">
                    Net Bill Amount
                  </span>
                  <span className="text-lg font-black font-mono text-amber-600">
                    ৳ {summary.netBillAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Attachments Section */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <Paperclip className="size-4 text-amber-500" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Supporting Attachments & Vendor Invoices
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
                  <FileText className="size-4 text-amber-600" />
                  <div>
                    <div className="font-bold text-foreground font-mono">Invoice_{supplierBillNo}.pdf</div>
                    <div className="text-[10px] text-muted-foreground">Vendor scan • 1.4 MB</div>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => toast.info("Uploaded additional invoice document.")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-border hover:bg-muted/50 cursor-pointer"
                  >
                    <Upload className="size-3.5" /> Upload File
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground">
                {isReadOnly
                  ? "Currently viewing submitted bill. Click 'Edit Bill' to make modifications."
                  : ""}
              </span>

              <div className="flex items-center gap-3">
                {isReadOnly ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFormMode("edit")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                    >
                      <Edit className="size-3.5" /> Edit Bill
                    </button>
                    <button
                      type="button"
                      onClick={handleStartCreateNew}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      + Create New Bill
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedBillId) {
                          setFormMode("view");
                        } else {
                          handleStartCreateNew();
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitBill("Draft")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitBill("Pending Approval")}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      Submit for Bill Approval
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Select PO/WO Modal */}
      {poModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {billType === "Bill against WO"
                    ? "Select Work Order (Approved Only)"
                    : "Select Purchase Order (Approved Only)"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {billType === "Bill against WO"
                    ? "Select an approved Work Order to bill against. Related service MRR records will be displayed below."
                    : "Select an approved Purchase Order to bill against. Related MRR records will be displayed below."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPoModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Search PO/WO */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={poSearchQuery}
                onChange={(e) => setPoSearchQuery(e.target.value)}
                placeholder={
                  billType === "Bill against WO"
                    ? "Search Work Order number, date, or contractor..."
                    : "Search Purchase Order number, date, or supplier..."
                }
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            {/* PO/WO List Table */}
            <div className="max-h-72 overflow-y-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-2.5 px-3">
                      {billType === "Bill against WO" ? "WO Number" : "PO Number"}
                    </th>
                    <th className="py-2.5 px-3">
                      {billType === "Bill against WO" ? "WO Date" : "PO Date"}
                    </th>
                    <th className="py-2.5 px-3">
                      {billType === "Bill against WO" ? "Contractor / Vendor" : "Supplier Name"}
                    </th>
                    <th className="py-2.5 px-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPurchaseOrders.map((po) => {
                    const isSelected = selectedPoNumber === po.orderNumber;
                    return (
                      <tr
                        key={po.id}
                        onClick={() => handleSelectPo(po)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-amber-500/10 font-bold text-amber-700 dark:text-amber-400"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold">{po.orderNumber}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{po.orderDate}</td>
                        <td className="py-2.5 px-3">{po.supplierName}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          ৳ {(po.grandTotal ?? (po as any).totalAmount ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPurchaseOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground text-xs">
                        No approved {billType === "Bill against WO" ? "work orders" : "purchase orders"} found matching &quot;{poSearchQuery}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPoModalOpen(false)}
                className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select MRR Modal */}
      {mrrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {billType === "Bill against Receive"
                    ? "Select Direct Receive MRR References"
                    : "Select MRR for Supplier Billing"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {billType === "Bill against Receive"
                    ? `Pick verified Direct Receive MRR records for "${activeSupplierName}" to bill against received goods.`
                    : "Pick verified MRR references to bill against received goods."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMrrModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Search MRR */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={mrrSearchQuery}
                onChange={(e) => setMrrSearchQuery(e.target.value)}
                placeholder={
                  billType === "Bill against Receive"
                    ? "Search Direct MRR number, challan, or store..."
                    : "Search MRR number, challan, or warehouse/store..."
                }
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            {/* MRR List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {billType === "Bill against Receive" ? (
                /* Direct MRR List for Selected Supplier */
                filteredDirectMaterialReceipts.map((mrr) => {
                  const isSelected = selectedMrrNumbers.includes(mrr.mrrNumber);
                  const totalQty = (mrr.items || []).reduce(
                    (s, it) =>
                      s +
                      (it.acceptedQuantity ??
                        (it as any).receiveQuantity ??
                        (it as any).receivedQuantity ??
                        0),
                    0
                  );
                  const totalAmt =
                    mrr.totalAmount ||
                    (mrr.items || []).reduce(
                      (s, it) =>
                        s +
                        it.unitPrice *
                          (it.acceptedQuantity ??
                            (it as any).receiveQuantity ??
                            (it as any).receivedQuantity ??
                            1),
                      0
                    );

                  return (
                    <div
                      key={mrr.id}
                      onClick={() => handleToggleDirectMrr(mrr.mrrNumber)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "bg-muted/20 border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="size-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-mono font-bold text-foreground flex items-center gap-2">
                            <span>{mrr.mrrNumber}</span>
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                              Direct Receive
                            </span>
                            {mrr.challanNo && (
                              <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                Challan: {mrr.challanNo}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Store: <span className="font-medium text-foreground">{mrr.storeName || mrr.warehouseStore}</span> • Items: {mrr.items?.length || 0} ({totalQty} units)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold block text-foreground">
                          ৳ {totalAmt.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{mrr.mrrDate}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Regular MRR List */
                filteredMaterialReceipts.map((mrr) => {
                  const isSelected = selectedMrrNumbers.includes(mrr.receiveNumber);
                  return (
                    <div
                      key={mrr.id}
                      onClick={() => handleToggleMrr(mrr.receiveNumber)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "bg-muted/20 border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="size-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-mono font-bold text-foreground flex items-center gap-2">
                            <span>{mrr.receiveNumber}</span>
                            <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              Challan: {mrr.challanNo}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Store / Location: <span className="font-medium text-foreground">{mrr.warehouseStore}</span> • Items: {mrr.items?.length || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold block">
                          ৳ {mrr.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{mrr.receiveDate}</span>
                      </div>
                    </div>
                  );
                })
              )}

              {billType === "Bill against Receive" && filteredDirectMaterialReceipts.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-xs space-y-1">
                  <div className="font-bold text-foreground">No Direct Receive MRR records found</div>
                  <p className="text-[11px]">
                    No Direct MRRs exist for supplier &quot;{activeSupplierName}&quot;. Please select another supplier or create a direct receive first.
                  </p>
                </div>
              )}

              {billType !== "Bill against Receive" && filteredMaterialReceipts.length === 0 && (
                <div className="py-6 text-center text-muted-foreground text-xs">
                  No MRR records found.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setMrrModalOpen(false)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Done ({selectedMrrNumbers.length} Selected)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Selection Modal for Direct Receive */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-amber-500" /> Select Supplier for Direct Receive
                </h3>
                <p className="text-xs text-muted-foreground">
                  Search and select a supplier to load their associated Direct Receive MRR records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={supplierSearchQuery}
                onChange={(e) => setSupplierSearchQuery(e.target.value)}
                placeholder="Search supplier by name or code..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto border border-border rounded-xl divide-y divide-border">
              {allSuppliers
                .filter((s) => {
                  const q = supplierSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    s.vendorName.toLowerCase().includes(q) ||
                    s.vendorCode.toLowerCase().includes(q)
                  );
                })
                .map((s) => {
                  const supplierDirectMrrsList = directMrrs.filter(
                    (d) =>
                      d.supplierId === s.id ||
                      (d.supplierName && d.supplierName.toLowerCase() === s.vendorName.toLowerCase())
                  );
                  const isSelected = s.id === receiveSupplierId;

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectReceiveSupplier(s.id, s.vendorName)}
                      className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-muted/50 transition-colors ${
                        isSelected ? "bg-amber-500/10" : ""
                      }`}
                    >
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-2">
                          <span>{s.vendorName}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">({s.vendorCode})</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {supplierDirectMrrsList.length > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              ● {supplierDirectMrrsList.length} Direct MRR record(s) available
                            </span>
                          ) : (
                            <span className="text-muted-foreground">0 Direct MRRs</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectReceiveSupplier(s.id, s.vendorName);
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Item Modal (Used for Service Bill Entry) */}
      {serviceItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Receipt className="size-4 text-amber-500" /> Add Service Item to Bill
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select service items from the service catalog to include in this bill.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setServiceItemModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Service Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  Service Items
                </span>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={serviceModalSearch}
                    onChange={(e) => setServiceModalSearch(e.target.value)}
                    placeholder="Search service items..."
                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-background border border-border rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Service Items Table: 2 Data Columns: Service Item Name & UoM */}
              <div className="max-h-72 overflow-y-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/70 text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border sticky top-0 bg-muted/95 backdrop-blur-xs">
                      <th className="py-2.5 px-3 font-bold">Service Item Name</th>
                      <th className="py-2.5 px-3 w-28 text-center font-bold">UoM</th>
                      <th className="py-2.5 px-3 w-24 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {availableServiceItems
                      .filter(
                        (s) =>
                          !serviceModalSearch.trim() ||
                          s.itemName.toLowerCase().includes(serviceModalSearch.toLowerCase()) ||
                          s.itemCode.toLowerCase().includes(serviceModalSearch.toLowerCase())
                      )
                      .map((srv) => (
                        <tr
                          key={srv.id}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-foreground">{srv.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {srv.itemCode} {srv.specification ? `• ${srv.specification}` : ""}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center text-muted-foreground font-semibold">
                            {srv.purchaseUOM || "Job"}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                handleAddCatalogService(srv);
                                setServiceItemModalOpen(false);
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Plus className="size-3" /> Select
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setServiceItemModalOpen(false)}
                className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={previewReportOpen}
        onClose={() => setPreviewReportOpen(false)}
        data={billReportData}
      />
    </div>
  );
}
