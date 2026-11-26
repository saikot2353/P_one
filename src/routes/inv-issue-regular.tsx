import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { toast } from "sonner";
import {
  PackageOpen,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Search,
  User,
  Layers,
  ChevronDown,
  Warehouse,
  ShoppingBag,
  Sparkles,
  Trash2,
  Save,
  Plus,
  X,
} from "lucide-react";
import {
  MaterialRequisition,
  MaterialIssue,
  MaterialIssueItem,
  getStoredMaterialRequisitions,
  getStoredMaterialIssues,
  getAvailableStockForItem,
  postMaterialIssue,
  isIssueReturnable,
  setReturnableIssueStatus,
} from "@/lib/inventory-requisition-issue-data";
import {
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  ItemProductMaster,
  getStoredData,
} from "@/lib/procurement-master-data";
import { getItemTrackingMode } from "@/lib/item-tracking-utils";
import {
  LocationAllocationModal,
  BatchAllocationModal,
  ItemTrackingCell,
  LocationEntry,
  BatchEntry,
} from "@/components/inventory/ItemBatchLocationModals";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface IssueRegularSearch {
  mrId?: string;
  issueId?: string;
  mode?: "view" | "edit";
}

export const Route = createFileRoute("/inv-issue-regular")({
  validateSearch: (search: Record<string, unknown>): IssueRegularSearch => {
    return {
      mrId: search.mrId as string | undefined,
      issueId: search.issueId as string | undefined,
      mode: search.mode as "view" | "edit" | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Material Issue — Inventory ERP" },
      {
        name: "description",
        content: "Issue materials against approved Material Requisitions with live stock deduction.",
      },
    ],
  }),
  component: InvIssueRegularPage,
});

function InvIssueRegularPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const requisitions = useMemo(() => getStoredMaterialRequisitions(), []);
  const catalogItems = useMemo(
    () => getStoredData<ItemProductMaster[]>("proc_items_v2", DEFAULT_ITEMS),
    []
  );

  const isViewMode = searchParams.mode === "view";
  const isEditMode = searchParams.mode === "edit";
  const storedIssues = useMemo(() => getStoredMaterialIssues(), []);

  // If viewing or editing an existing issue record by issueId or mrId
  const viewingIssueRecord = useMemo(() => {
    if (searchParams.issueId) {
      return (
        storedIssues.find(
          (i: MaterialIssue) => i.id === searchParams.issueId || i.issueNumber === searchParams.issueId
        ) || null
      );
    }
    if (isViewMode && searchParams.mrId) {
      return (
        storedIssues.find(
          (i: MaterialIssue) => i.mrId === searchParams.mrId || i.mrNumber === searchParams.mrId
        ) || null
      );
    }
    return null;
  }, [isViewMode, searchParams.issueId, searchParams.mrId, storedIssues]);

  // Available approved MRs for dropdown selection
  const approvedMRs = useMemo(() => {
    return requisitions.filter(
      (r) =>
        (r.status === "Approved" || r.status === "Partially Issued") && r.remainingQuantity > 0
    );
  }, [requisitions]);

  // Workflow detection: If navigated from Issue Register via "Issue" button (mrId provided)
  const isFromRequisitionNav = Boolean(searchParams.mrId && !searchParams.issueId);

  // Issue Type state: "Issue by Requisition" | "Direct Issue"
  const [issueType, setIssueType] = useState<"Issue by Requisition" | "Direct Issue">(() => {
    if (viewingIssueRecord) {
      return viewingIssueRecord.issueType === "Direct Issue" ? "Direct Issue" : "Issue by Requisition";
    }
    if (isFromRequisitionNav) return "Issue by Requisition";
    return "Issue by Requisition";
  });

  const isDirectIssue = issueType === "Direct Issue";
  const isIssueByRequisition = issueType === "Issue by Requisition";

  const [selectedMRId, setSelectedMRId] = useState<string>(() => {
    if (viewingIssueRecord) return viewingIssueRecord.mrId || "";
    if (searchParams.mrId) return searchParams.mrId;
    if (approvedMRs.length > 0) return approvedMRs[0].id;
    return "";
  });

  const activeMR = useMemo(() => {
    if (isDirectIssue || !selectedMRId) return null;
    return requisitions.find((r) => r.id === selectedMRId || r.mrNumber === selectedMRId) || null;
  }, [isDirectIssue, selectedMRId, requisitions]);

  // Form Fields
  const [issueNumber] = useState<string>(
    () => viewingIssueRecord?.issueNumber || `ISS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
  );
  const [issueDate, setIssueDate] = useState<string>(
    () => viewingIssueRecord?.issueDate || new Date().toISOString().slice(0, 10)
  );

  // Direct Issue specific header fields (Department & Issued To)
  const [directDepartment, setDirectDepartment] = useState<string>(() => {
    return viewingIssueRecord?.department || "Production (Knitting)";
  });
  const [directIssuedTo, setDirectIssuedTo] = useState<string>(() => {
    return viewingIssueRecord?.issuedTo || "Md. Anik Islam (Floor In-charge)";
  });

  const [srnNo, setSrnNo] = useState<string>(
    () => viewingIssueRecord?.srnNo || `SRN-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [remarks, setRemarks] = useState<string>(
    () => viewingIssueRecord?.remarks || ""
  );

  // Is Returnable Item state (default: unchecked/false)
  const [isReturnableItem, setIsReturnableItem] = useState<boolean>(() => {
    if (viewingIssueRecord) {
      return isIssueReturnable(viewingIssueRecord);
    }
    return false;
  });

  const handleToggleReturnable = (checked: boolean) => {
    setIsReturnableItem(checked);
    // Immediately persist returnable status in Local Storage
    if (issueNumber) {
      setReturnableIssueStatus(issueNumber, checked);
    }
    if (viewingIssueRecord?.id) {
      setReturnableIssueStatus(viewingIssueRecord.id, checked);
    }
  };

  // Items State (loaded from viewingIssueRecord, activeMR, or added dynamically in Direct Issue)
  const [issueItems, setIssueItems] = useState<MaterialIssueItem[]>([]);

  // Department & Issue To searchable options
  const departmentOptions = useMemo(() => [
    { value: "Production (Knitting)", label: "Production (Knitting)" },
    { value: "Dyeing & Finishing", label: "Dyeing & Finishing" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Administration", label: "Administration" },
    { value: "Quality Assurance", label: "Quality Assurance" },
    { value: "Garments Finishing", label: "Garments Finishing" },
    { value: "Spinning Unit", label: "Spinning Unit" },
    { value: "Procurement & Store", label: "Procurement & Store" },
    { value: "Electrical & Utility", label: "Electrical & Utility" },
    { value: "R&D Lab", label: "R&D Lab" },
    { value: "Cutting Section", label: "Cutting Section" },
    { value: "Sewing Department", label: "Sewing Department" },
    { value: "Printing & Embroidery", label: "Printing & Embroidery" },
  ], []);

  const issueToOptions = useMemo(() => [
    { value: "Md. Anik Islam (Deputy Manager)", label: "Md. Anik Islam (Deputy Manager)" },
    { value: "Engr. Rafiqul Islam (Senior Maintenance Engineer)", label: "Engr. Rafiqul Islam (Senior Maintenance Engineer)" },
    { value: "Tahmid Afsar Shapno (Operations Lead)", label: "Tahmid Afsar Shapno (Operations Lead)" },
    { value: "Engr. Kabir Hossain (Dyeing Unit Head)", label: "Engr. Kabir Hossain (Dyeing Unit Head)" },
    { value: "Nazmul Huda (Production Supervisor)", label: "Nazmul Huda (Production Supervisor)" },
    { value: "Alice Johnson (Quality Assurance Specialist)", label: "Alice Johnson (Quality Assurance Specialist)" },
    { value: "Mohammad Tanvir (Garments Floor In-Charge)", label: "Mohammad Tanvir (Garments Floor In-Charge)" },
    { value: "Md. Shahed Ali (Electrical Engineer)", label: "Md. Shahed Ali (Electrical Engineer)" },
    { value: "Md. Al-Amin (Knitting Section Officer)", label: "Md. Al-Amin (Knitting Section Officer)" },
    { value: "Rashidul Hassan (Warehouse Officer)", label: "Rashidul Hassan (Warehouse Officer)" },
    { value: "Md. Kamrul Hasan (Mechanical Tech)", label: "Md. Kamrul Hasan (Mechanical Tech)" },
    { value: "Farzana Akter (Senior QA Inspector)", label: "Farzana Akter (Senior QA Inspector)" },
  ], []);

  // Direct Issue Item Master Modal State
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemFilterQuery, setItemFilterQuery] = useState("");
  const [activeSelectingRowId, setActiveSelectingRowId] = useState<string | null>(null);

  const filteredCatalogItems = useMemo(() => {
    const q = itemFilterQuery.toLowerCase().trim();
    if (!q) return catalogItems;
    return catalogItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        (item.specification && item.specification.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.origin && item.origin.toLowerCase().includes(q)) ||
        (item.stockUOM && item.stockUOM.toLowerCase().includes(q)) ||
        (item.purchaseUOM && item.purchaseUOM.toLowerCase().includes(q))
    );
  }, [catalogItems, itemFilterQuery]);

  const warehouses = useMemo(
    () => getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES),
    []
  );

  const [selectedIssueStore, setSelectedIssueStore] = useState<string>(() => {
    return (
      viewingIssueRecord?.warehouseStore ||
      activeMR?.warehouseStore ||
      warehouses[0]?.name ||
      "Pakiza Technovation Central IT & Hardware Depot"
    );
  });

  useEffect(() => {
    if (viewingIssueRecord) {
      setSelectedIssueStore(viewingIssueRecord.warehouseStore);
      setIssueItems(viewingIssueRecord.items);
      return;
    }
    if (activeMR?.warehouseStore) {
      setSelectedIssueStore(activeMR.warehouseStore);
    }
  }, [viewingIssueRecord, activeMR]);

  // Auto-populate when activeMR changes in Issue by Requisition mode
  useEffect(() => {
    if (viewingIssueRecord) return;
    if (isDirectIssue) return;

    if (activeMR) {
      const storeToUse = selectedIssueStore || activeMR.warehouseStore;
      const items: MaterialIssueItem[] = activeMR.items.map((it, idx) => {
        const itemStore = it.requisitionStore || storeToUse;
        const availableStock = getAvailableStockForItem(itemStore, it.itemCode);
        const effectiveMRQty =
          it.approvedQuantity !== undefined ? Number(it.approvedQuantity) : Number(it.requestedQuantity);
        const remainingMRQty =
          Number(it.remainingQuantity) > 0
            ? Number(it.remainingQuantity)
            : effectiveMRQty - (Number(it.issuedQuantity) || 0);

        // Default issue qty: min(remainingMRQty, availableStock)
        const defaultIssueQty = Math.max(0, Math.min(remainingMRQty, availableStock));

        return {
          id: `isi-${Date.now()}-${idx}`,
          sl: idx + 1,
          mrItemId: it.id,
          itemCode: it.itemCode,
          itemName: it.itemName,
          specification: it.specification,
          brand: it.brand,
          origin: it.origin,
          uom: it.uom,
          mrRequestedQty: it.requestedQuantity,
          previouslyIssuedQty: it.issuedQuantity || 0,
          remainingIssueQty: remainingMRQty,
          availableStock: availableStock,
          issueStore: itemStore,
          issueQty: defaultIssueQty,
          unitPrice: 150,
          totalPrice: defaultIssueQty * 150,
          batchAllocations: it.batchNumber
            ? [{ batchNumber: it.batchNumber, quantity: defaultIssueQty }]
            : [],
          locationAllocations: it.location
            ? [{ locationName: it.location, quantity: defaultIssueQty }]
            : [],
          remarks: "",
        };
      });
      setIssueItems(items);
    } else {
      setIssueItems([]);
    }
  }, [activeMR, isDirectIssue, viewingIssueRecord]);

  const warehouseOptions = useMemo(() => {
    return warehouses.map((w: any) => ({
      value: w.name || w.storeName,
      label: `${w.name || w.storeName}${w.storeCode || w.code ? ` (${w.storeCode || w.code})` : ""}`,
    }));
  }, [warehouses]);

  const handleStoreChange = (newStore: string) => {
    setSelectedIssueStore(newStore);
    setIssueItems((prev) =>
      prev.map((item) => {
        if (!item.itemCode) {
          return { ...item, issueStore: newStore };
        }
        const stock = getAvailableStockForItem(newStore, item.itemCode);
        const maxPermitted = isDirectIssue ? stock : Math.min(item.remainingIssueQty, stock);
        const newIssueQty = Math.min(item.issueQty, maxPermitted);
        return {
          ...item,
          issueStore: newStore,
          availableStock: stock,
          issueQty: newIssueQty,
          totalPrice: newIssueQty * (item.unitPrice || 0),
        };
      })
    );
  };

  const handleItemStoreChange = (itemId: string, newStore: string) => {
    setIssueItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (!item.itemCode) {
            return { ...item, issueStore: newStore };
          }
          const stock = getAvailableStockForItem(newStore, item.itemCode);
          const maxPermitted = isDirectIssue ? stock : Math.min(item.remainingIssueQty, stock);
          const newIssueQty = Math.min(item.issueQty, maxPermitted);
          return {
            ...item,
            issueStore: newStore,
            availableStock: stock,
            issueQty: newIssueQty,
            totalPrice: newIssueQty * (item.unitPrice || 0),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setIssueItems((prev) => prev.filter((it) => it.id !== itemId));
    toast.info("Item removed from current issue transaction.");
  };

  // Direct Issue: Add a new blank item row directly inside table
  const handleAddNewBlankItem = () => {
    const newRowId = `isi-blank-${Date.now()}-${issueItems.length}`;
    const newBlankItem: MaterialIssueItem = {
      id: newRowId,
      sl: issueItems.length + 1,
      itemCode: "", // blank indicates item not yet selected from master
      itemName: "",
      specification: "",
      brand: "",
      origin: "",
      uom: "",
      mrRequestedQty: 0,
      previouslyIssuedQty: 0,
      remainingIssueQty: 0,
      availableStock: 0,
      issueStore: selectedIssueStore,
      issueQty: 0,
      unitPrice: 0,
      totalPrice: 0,
      batchAllocations: [],
      locationAllocations: [],
      remarks: "",
    };

    setIssueItems((prev) => [...prev, newBlankItem]);
    toast.success("Blank item row added. Click 'Select Item...' to choose from Item Master.");
  };

  const handleOpenItemModalForRow = (rowId: string) => {
    setActiveSelectingRowId(rowId);
    setItemFilterQuery("");
    setItemModalOpen(true);
  };

  const handleSelectItemForActiveRow = (catalogItem: ItemProductMaster) => {
    if (!activeSelectingRowId) return;

    const alreadyAdded = issueItems.some(
      (it) => it.id !== activeSelectingRowId && it.itemCode === catalogItem.itemCode
    );
    if (alreadyAdded) {
      toast.warning(`Item ${catalogItem.itemCode} is already added in this issue.`);
      return;
    }

    const uom = catalogItem.stockUOM || catalogItem.purchaseUOM || (catalogItem as any).uom || "PCS";
    const stock = getAvailableStockForItem(selectedIssueStore, catalogItem.itemCode);
    const cost = (catalogItem as any).standardCost || (catalogItem as any).standardPurchasePrice || 120;
    const initialQty = stock > 0 ? 1 : 0;

    setIssueItems((prev) =>
      prev.map((it) => {
        if (it.id === activeSelectingRowId) {
          return {
            ...it,
            itemCode: catalogItem.itemCode,
            itemName: catalogItem.itemName,
            specification: catalogItem.specification || (catalogItem as any).description || "",
            brand: catalogItem.brand || "Standard",
            origin: catalogItem.origin || "Local",
            uom,
            availableStock: stock,
            issueStore: it.issueStore || selectedIssueStore,
            issueQty: initialQty,
            unitPrice: cost,
            totalPrice: initialQty * cost,
            batchAllocations: [],
            locationAllocations: [],
          };
        }
        return it;
      })
    );

    setItemModalOpen(false);
    setActiveSelectingRowId(null);
    toast.success(`Selected item: ${catalogItem.itemName}`);
  };

  // Directly change Issue Quantity from table input
  const handleIssueQtyChange = (itemId: string, newQty: number) => {
    const qty = Math.max(0, newQty);
    setIssueItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const trackingMode = getItemTrackingMode(item.itemCode, catalogItems);
          let newBatches = item.batchAllocations ? [...item.batchAllocations] : [];
          let newLocations = item.locationAllocations ? [...item.locationAllocations] : [];
          if (trackingMode === "Batch" && newBatches.length === 1) {
            newBatches = [{ ...newBatches[0], quantity: qty }];
          } else if (trackingMode === "Location" && newLocations.length === 1) {
            newLocations = [{ ...newLocations[0], quantity: qty }];
          }
          return {
            ...item,
            issueQty: qty,
            totalPrice: qty * (item.unitPrice || 0),
            batchAllocations: newBatches,
            locationAllocations: newLocations,
          };
        }
        return item;
      })
    );
  };

  // Tracking Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeTrackingItem, setActiveTrackingItem] = useState<MaterialIssueItem | null>(null);

  const openTrackingModal = (item: MaterialIssueItem) => {
    const trackingMode = getItemTrackingMode(item.itemCode, catalogItems);
    setActiveTrackingItem(item);
    if (trackingMode === "Batch") {
      setBatchModalOpen(true);
    } else if (trackingMode === "Location") {
      setLocationModalOpen(true);
    }
  };

  const handleSaveLocationAllocations = (allocations: LocationEntry[]) => {
    if (!activeTrackingItem) return;
    const totalTrackingQty = allocations.reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);
    setIssueItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItem.id
          ? {
              ...it,
              issueQty: totalTrackingQty,
              totalPrice: totalTrackingQty * (it.unitPrice || 0),
              locationAllocations: allocations.map((a) => ({
                locationName: a.locationName,
                quantity: a.quantity,
              })),
            }
          : it
      )
    );
    setLocationModalOpen(false);
    toast.success("Location allocations confirmed.");
  };

  const handleSaveBatchAllocations = (allocations: BatchEntry[]) => {
    if (!activeTrackingItem) return;
    const totalTrackingQty = allocations.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
    setIssueItems((prev) =>
      prev.map((it) =>
        it.id === activeTrackingItem.id
          ? {
              ...it,
              issueQty: totalTrackingQty,
              totalPrice: totalTrackingQty * (it.unitPrice || 0),
              batchAllocations: allocations.map((b) => ({
                batchNumber: b.batchNumber,
                quantity: b.quantity,
              })),
            }
          : it
      )
    );
    setBatchModalOpen(false);
    toast.success("Batch allocations confirmed.");
  };

  // Validation Checks
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (isIssueByRequisition && !activeMR) {
      errors.push("No Material Requisition selected.");
      return errors;
    }

    if (isDirectIssue) {
      if (!directDepartment.trim()) {
        errors.push("Please select a Department for Direct Issue.");
      }
      if (!directIssuedTo.trim()) {
        errors.push("Please select or specify an Issued To recipient.");
      }
    }

    if (issueItems.length === 0) {
      errors.push(
        isDirectIssue
          ? "Please add at least one item using the '+ Add Item' button."
          : "No requisition items loaded for issue."
      );
      return errors;
    }

    const blankRows = issueItems.filter((it) => !it.itemCode);
    if (blankRows.length > 0) {
      errors.push("Please select an item from Item Master for all added blank rows, or remove them.");
    }

    let hasNonZero = false;
    issueItems.forEach((it) => {
      if (!it.itemCode) return;
      if (it.issueQty > 0) hasNonZero = true;
      if (isIssueByRequisition && it.issueQty > it.remainingIssueQty) {
        errors.push(
          `${it.itemName}: Issue quantity (${it.issueQty}) exceeds remaining MR quantity (${it.remainingIssueQty}).`
        );
      }
      if (it.issueQty > it.availableStock) {
        errors.push(
          `${it.itemName}: Issue quantity (${it.issueQty}) exceeds available warehouse stock (${it.availableStock}).`
        );
      }
    });

    if (!hasNonZero && blankRows.length === 0) {
      errors.push("At least one item must have an issue quantity greater than 0.");
    }
    return errors;
  }, [isIssueByRequisition, isDirectIssue, activeMR, issueItems, directDepartment, directIssuedTo]);

  const totalIssueQuantity = useMemo(() => {
    return issueItems.reduce((acc, i) => acc + (i.itemCode ? Number(i.issueQty) || 0 : 0), 0);
  }, [issueItems]);

  // Submit / Post Issue
  const handlePostIssue = () => {
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }
    if (isIssueByRequisition && !activeMR) return;

    const validItems = issueItems.filter((i) => i.itemCode && i.issueQty > 0);
    if (validItems.length === 0) {
      toast.error("Please ensure at least one valid item has an issue quantity greater than 0.");
      return;
    }

    const issueToSave: MaterialIssue = {
      id: viewingIssueRecord?.id || `iss-${Date.now()}`,
      issueNumber: viewingIssueRecord?.issueNumber || issueNumber,
      mrId: isIssueByRequisition && activeMR ? activeMR.id : "",
      mrNumber: isIssueByRequisition && activeMR ? activeMR.mrNumber : "",
      issueDate,
      organization: activeMR?.organization || "Pakiza Knit Composite Ltd",
      department: isIssueByRequisition ? (activeMR?.department || "") : directDepartment,
      issuedTo: isIssueByRequisition ? (activeMR?.requestedBy || "") : directIssuedTo,
      employeeId: "EMP-00142",
      requiredDate: isIssueByRequisition ? activeMR?.requiredDate : undefined,
      warehouseStore: selectedIssueStore || activeMR?.warehouseStore || "PKCL Central Raw Material Warehouse",
      issueType,
      srnNo,
      totalItems: validItems.length,
      totalIssueQty: totalIssueQuantity,
      status: "Posted",
      items: validItems,
      remarks,
      isReturnableItem,
      isReturnable: isReturnableItem,
      previouslyReturnedQty: viewingIssueRecord?.previouslyReturnedQty || 0,
      returnableQty: totalIssueQuantity,
    };

    // Save returnable status to Local Storage
    setReturnableIssueStatus(issueToSave.id, isReturnableItem);
    setReturnableIssueStatus(issueToSave.issueNumber, isReturnableItem);

    // Deducts stock, updates MR if requisition-linked, saves issue
    postMaterialIssue(issueToSave);

    toast.success(
      isEditMode
        ? `Material Issue ${issueNumber} updated successfully!`
        : `Material Issue ${issueNumber} posted! Stock deducted and balance updated successfully.`
    );
    navigate({ to: "/inv-issue-list" });
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const previewReportData: StandardReportData = useMemo(() => {
    return {
      reportType: "store-issue",
      hideDocHeaderInfo: true,
      companyName: activeMR?.organization || "Pakiza Knit Composite Ltd",
      companyAddress: "Gorat, Ashulia, Savar, Dhaka, Bangladesh",
      reportTitle: isDirectIssue ? "STORE DIRECT MATERIAL ISSUE SLIP" : "STORE MATERIAL ISSUE SLIP",
      reportNumber: issueNumber,
      documentNumber: issueNumber,
      documentNo: issueNumber,
      reportDate: issueDate,
      documentDate: issueDate,
      statusBadge: "Posted",
      hideLogo: true,
      orientation: "landscape",
      metaFields: [
        { label: "Issue No", value: issueNumber, highlight: true },
        { label: "Issue Date", value: issueDate },
        { label: "Issue Type", value: issueType },
        ...(isIssueByRequisition && activeMR ? [{ label: "Material Requisition ID", value: activeMR.mrNumber }] : []),
        { label: "Department", value: isIssueByRequisition ? (activeMR?.department || "-") : directDepartment },
        { label: "Issued To", value: isIssueByRequisition ? (activeMR?.requestedBy || "-") : directIssuedTo },
        { label: "Warehouse / Store", value: selectedIssueStore || "-" },
        { label: "Is Returnable Item?", value: isReturnableItem ? "Yes" : "No" },
      ],
      tableHeaders: isIssueByRequisition
        ? [
            "SL",
            "ITEM CODE",
            "ITEM DESCRIPTION",
            "BRAND",
            "ORIGIN",
            "UOM",
            "MR REQ QTY",
            "PREV ISSUED",
            "ISSUE QTY",
          ]
        : [
            "SL",
            "ITEM CODE",
            "ITEM DESCRIPTION",
            "BRAND",
            "ORIGIN",
            "UOM",
            "ISSUE QTY",
            "CURRENT STOCK",
          ],
      tableRows: issueItems.filter((it) => it.itemCode).map((it, idx) =>
        isIssueByRequisition
          ? [
              String(idx + 1),
              it.itemCode,
              it.itemName,
              it.brand || "Pakiza Standard",
              it.origin || "Local",
              it.uom,
              String(it.mrRequestedQty),
              String(it.previouslyIssuedQty),
              String(it.issueQty),
            ]
          : [
              String(idx + 1),
              it.itemCode,
              it.itemName,
              it.brand || "Pakiza Standard",
              it.origin || "Local",
              it.uom,
              String(it.issueQty),
              String(it.availableStock),
            ]
      ),
      summaryCards: [
        { label: "Total Items", value: String(issueItems.filter((it) => it.itemCode).length) },
        { label: "Total Issue Qty", value: String(totalIssueQuantity) },
      ],
      notes: [
        isDirectIssue
          ? "Direct material issue dispatched without material requisition linkage."
          : `Issued against approved Material Requisition ${activeMR?.mrNumber}.`,
        "Physical receipt verified and store ledgers updated upon posting.",
      ],
      signatures: [
        { title: "Store In-Charge", name: "Warehouse Dispatcher", date: issueDate },
        {
          title: "Receiver Signature",
          name: isIssueByRequisition ? (activeMR?.requestedBy || "Employee") : directIssuedTo,
          date: "-",
        },
      ],
    };
  }, [
    isDirectIssue,
    isIssueByRequisition,
    issueType,
    directDepartment,
    directIssuedTo,
    activeMR,
    issueNumber,
    issueDate,
    selectedIssueStore,
    issueItems,
    totalIssueQuantity,
  ]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />

        <div className="p-4 sm:p-6 lg:p-7 space-y-6 w-full max-w-[1550px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/inv-issue-list"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back to Material Issue List"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Material Issue Entry
                  </h1>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {issueNumber}
                  </span>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {issueType}
                  </span>
                  {isIssueByRequisition && activeMR && (
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Against {activeMR.mrNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {isDirectIssue
                    ? "Direct store issuance from available inventory with live stock deduction"
                    : "Fulfill approved Material Requisitions with automated stock validation and location/batch allocation"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewReportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="size-3.5 text-slate-600" />
                Preview Issue Slip
              </button>

              {isViewMode ? (
                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  Read-Only Mode
                </span>
              ) : isEditMode ? (
                <button
                  type="button"
                  onClick={handlePostIssue}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="size-4" />
                  Update Material Issue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePostIssue}
                  disabled={validationErrors.length > 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  Confirm & Post Issue
                </button>
              )}
            </div>
          </div>

          {/* Validation Errors Notice */}
          {!isViewMode && validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">
                  Cannot Post Issue (Resolve Validation Rules):
                </h4>
                <ul className="text-xs text-rose-700 mt-1 list-disc list-inside space-y-0.5 font-medium">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Auto-populated MR & Issue Header — Exactly 5 columns per row */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Building2 className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Material Requisition & Issue Header
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {isDirectIssue
                  ? "Direct Issue workflow: Requisition not required"
                  : activeMR
                  ? "Auto-populated from selected MR"
                  : "Select an approved MR below"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Field 1: Issue Type */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Issue Type *
                </label>
                {isFromRequisitionNav || isViewMode ? (
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={issueType}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-bold text-indigo-700 cursor-not-allowed outline-none select-none"
                    title={
                      isFromRequisitionNav
                        ? "Automatically set to Issue by Requisition from the register."
                        : "Issue Type"
                    }
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={issueType}
                      onChange={(e) => {
                        const newType = e.target.value as "Issue by Requisition" | "Direct Issue";
                        setIssueType(newType);
                        if (newType === "Direct Issue") {
                          setIssueItems([]);
                        }
                      }}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Issue by Requisition">Issue by Requisition</option>
                      <option value="Direct Issue">Direct Issue</option>
                    </select>
                    <ChevronDown className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Conditional Fields based on Issue Type */}
              {isDirectIssue ? (
                <>
                  {/* Field 2: Department * (Searchable Dropdown for Direct Issue) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Department *
                    </label>
                    {isViewMode ? (
                      <input
                        type="text"
                        readOnly
                        value={directDepartment}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none"
                      />
                    ) : (
                      <SearchableSelect
                        options={departmentOptions}
                        value={directDepartment}
                        onChange={(val) => setDirectDepartment(val)}
                        placeholder="Search & select Department..."
                        allowCustom={true}
                        className="h-9 w-full text-xs font-semibold"
                      />
                    )}
                  </div>

                  {/* Field 3: Issue To * (Searchable Dropdown for Direct Issue) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue To *
                    </label>
                    {isViewMode ? (
                      <input
                        type="text"
                        readOnly
                        value={directIssuedTo}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none"
                      />
                    ) : (
                      <SearchableSelect
                        options={issueToOptions}
                        value={directIssuedTo}
                        onChange={(val) => setDirectIssuedTo(val)}
                        placeholder="Search & select Recipient..."
                        allowCustom={true}
                        className="h-9 w-full text-xs font-semibold"
                      />
                    )}
                  </div>

                  {/* Field 4: Issue Date * */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      disabled={isViewMode}
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Field 5: Issue Store * */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue Store *
                    </label>
                    {isViewMode ? (
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={selectedIssueStore}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none select-none"
                      />
                    ) : (
                      <SearchableSelect
                        options={warehouseOptions}
                        value={selectedIssueStore}
                        onChange={handleStoreChange}
                        placeholder="Search Issue Store..."
                        className="h-9 w-full text-xs font-semibold"
                      />
                    )}
                  </div>

                  {/* Field 6: Is Returnable Item? */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Is Returnable Item?
                    </label>
                    <div className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="isReturnableItemDirect"
                        disabled={isViewMode}
                        checked={isReturnableItem}
                        onChange={(e) => handleToggleReturnable(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="isReturnableItemDirect"
                        className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                      >
                        Returnable Item
                      </label>
                    </div>
                  </div>

                  {/* Field 7: Remarks / Dispatch Notes (Spans Row 2 across remaining 4 cols) */}
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Remarks / Dispatch Notes
                    </label>
                    <input
                      type="text"
                      disabled={isViewMode}
                      placeholder="Enter overall dispatch remarks or notes..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Issue by Requisition Workflow */}
                  {/* Field 2: Material Requisition ID * */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Material Requisition ID *
                    </label>
                    {isFromRequisitionNav || isViewMode ? (
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={activeMR?.mrNumber || selectedMRId || "-"}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-mono font-bold text-indigo-700 cursor-not-allowed outline-none select-none"
                        title="Material Requisition ID is automatically populated."
                      />
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedMRId}
                          onChange={(e) => setSelectedMRId(e.target.value)}
                          className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-mono font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none pr-8 cursor-pointer"
                        >
                          {approvedMRs.map((mr) => (
                            <option key={mr.id} value={mr.id}>
                              {mr.mrNumber} ({mr.department}) — Rem: {mr.remainingQuantity}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Field 3: Department */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeMR?.department || "-"}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Field 4: Requested By / Issued To */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Requested By (Issued To)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeMR?.requestedBy || "-"}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Field 5: Issue Date * */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      disabled={isViewMode}
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Row 2 - Field 6: Issue Store * */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Issue Store *
                    </label>
                    {isViewMode ? (
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={selectedIssueStore}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-800 cursor-not-allowed outline-none select-none"
                      />
                    ) : (
                      <SearchableSelect
                        options={warehouseOptions}
                        value={selectedIssueStore}
                        onChange={handleStoreChange}
                        placeholder="Search and select Issue Store..."
                        className="h-9 w-full text-xs font-semibold"
                      />
                    )}
                  </div>

                  {/* Row 2 - Field 7: MR Required Date */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      MR Required Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeMR?.requiredDate || "-"}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-mono text-slate-600 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Row 2 - Field 8: Is Returnable Item? (Immediately after MR Required Date) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Is Returnable Item?
                    </label>
                    <div className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="isReturnableItemReq"
                        disabled={isViewMode}
                        checked={isReturnableItem}
                        onChange={(e) => handleToggleReturnable(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="isReturnableItemReq"
                        className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                      >
                        Returnable Item
                      </label>
                    </div>
                  </div>

                  {/* Row 2 - Field 9: Remarks / Dispatch Notes (Spans remaining 2 cols: 1+1+1+2 = 5 cols) */}
                  <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Remarks / Dispatch Notes
                    </label>
                    <input
                      type="text"
                      disabled={isViewMode}
                      placeholder="Enter overall dispatch remarks or notes..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Items Details & Live Quantities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Issue Items & Validation Matrix
                </h3>
              </div>

              {/* Add Item Button on the right side of the section heading (Directly inserts blank row) */}
              {isDirectIssue && !isViewMode && (
                <button
                  type="button"
                  onClick={handleAddNewBlankItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Add Item
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 text-center w-10">SL</th>
                    <th className="py-3 px-3 w-40">Item Code</th>
                    <th className="py-3 px-3">Item Name</th>
                    <th className="py-3 px-3">Issue Store</th>
                    <th className="py-3 px-3 text-center w-16">UOM</th>
                    {/* Conditional Columns: Visible for Issue by Requisition, Hidden for Direct Issue */}
                    {isIssueByRequisition && (
                      <>
                        <th className="py-3 px-3 text-right w-24">Req QTY</th>
                        <th className="py-3 px-3 text-right w-24">Prev Issued</th>
                        <th className="py-3 px-3 text-right w-28 text-amber-700">Rem. QTY</th>
                      </>
                    )}
                    <th className="py-3 px-3 text-right w-28 text-emerald-700">Cur. Stock</th>
                    <th className="py-3 px-3 text-right w-32 bg-indigo-50/60 font-black text-indigo-900">
                      Issue Quantity *
                    </th>
                    <th className="py-3 px-3 text-center w-28">Tracking (B/L)</th>
                    {!isViewMode && <th className="py-3 px-2 text-center w-12">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {issueItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isIssueByRequisition ? (isViewMode ? 10 : 11) : (isViewMode ? 7 : 8)}
                        className="py-10 text-center text-slate-400"
                      >
                        {isDirectIssue
                          ? "No items added yet. Click '+ Add Item' above to insert a new row."
                          : "No requisition items available. Please select an approved Material Requisition."}
                      </td>
                    </tr>
                  ) : (
                    issueItems.map((item, idx) => {
                      const isBlank = !item.itemCode;
                      const trackingMode = isBlank ? "None" : getItemTrackingMode(item.itemCode, catalogItems);
                      const maxPermitted = isDirectIssue
                        ? item.availableStock
                        : Math.min(item.remainingIssueQty, item.availableStock);
                      const isOverRemaining =
                        isIssueByRequisition && item.issueQty > item.remainingIssueQty;
                      const isOverStock = item.issueQty > item.availableStock;
                      const hasError = !isBlank && (isOverRemaining || isOverStock);

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors whitespace-nowrap"
                        >
                          <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>

                          {/* Item Code & Item Selection Control */}
                          <td className="py-3 px-3">
                            {isBlank ? (
                              <button
                                type="button"
                                onClick={() => handleOpenItemModalForRow(item.id)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-xs cursor-pointer transition-colors"
                              >
                                <Search className="size-3.5 text-indigo-600" />
                                <span>Select Item...</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-blue-600">{item.itemCode}</span>
                                {isDirectIssue && !isViewMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenItemModalForRow(item.id)}
                                    title="Change Item"
                                    className="text-slate-400 hover:text-indigo-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                  >
                                    <Search className="size-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Item Name */}
                          <td className="py-3 px-3">
                            {isBlank ? (
                              <span
                                onClick={() => handleOpenItemModalForRow(item.id)}
                                className="text-slate-400 italic text-xs cursor-pointer hover:text-indigo-600 transition-colors"
                              >
                                Click &ldquo;Select Item...&rdquo; to pick from Item Master
                              </span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">{item.itemName}</span>
                                {item.specification && (
                                  <span
                                    className="text-[10px] text-slate-400 truncate max-w-xs"
                                    title={item.specification}
                                  >
                                    {item.specification}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Issue Store */}
                          <td className="py-3 px-3">
                            {isViewMode || isBlank ? (
                              <span className="font-semibold text-slate-800 text-[11px] whitespace-nowrap">
                                {item.issueStore || selectedIssueStore}
                              </span>
                            ) : (
                              <select
                                value={item.issueStore || selectedIssueStore}
                                onChange={(e) => handleItemStoreChange(item.id, e.target.value)}
                                className="h-7 text-[11px] rounded border border-slate-200 bg-white px-2 font-medium text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                {warehouses.map((w: any) => (
                                  <option key={w.id || w.name} value={w.name}>
                                    {w.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>

                          {/* UOM */}
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {item.uom || "—"}
                          </td>

                          {/* Conditional Columns for Issue by Requisition */}
                          {isIssueByRequisition && (
                            <>
                              <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                                {item.mrRequestedQty.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-500">
                                {item.previouslyIssuedQty.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-amber-600">
                                {item.remainingIssueQty.toLocaleString()}
                              </td>
                            </>
                          )}

                          {/* Available Stock */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            {isBlank ? "—" : item.availableStock.toLocaleString()}
                          </td>

                          {/* Issue Quantity * */}
                          <td className="py-3 px-3 text-right bg-indigo-50/30">
                            {isBlank ? (
                              <span className="text-slate-400 font-mono text-xs px-2 py-1">—</span>
                            ) : (
                              <div className="flex flex-col items-end gap-1">
                                {isViewMode ? (
                                  <span className="font-mono font-bold text-slate-800 text-xs px-2 py-1">
                                    {item.issueQty.toLocaleString()}
                                  </span>
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxPermitted}
                                    value={item.issueQty === 0 ? "" : item.issueQty}
                                    onChange={(e) =>
                                      handleIssueQtyChange(item.id, Number(e.target.value) || 0)
                                    }
                                    placeholder="0"
                                    className={`w-24 h-7 rounded border px-2 text-right font-mono font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                                      hasError
                                        ? "border-rose-400 bg-rose-50 text-rose-700 ring-1 ring-rose-400"
                                        : "border-slate-300 bg-white text-indigo-950"
                                    }`}
                                  />
                                )}
                                <span className="text-[9.5px] font-semibold text-slate-400">
                                  Max: {maxPermitted}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Tracking (B/L) Cell */}
                          <td className="py-3 px-3 text-center">
                            {isBlank ? (
                              <span className="text-slate-400 font-mono text-xs">—</span>
                            ) : (
                              <ItemTrackingCell
                                trackingMode={trackingMode}
                                mode={trackingMode}
                                batchAllocations={item.batchAllocations}
                                locationAllocations={item.locationAllocations}
                                onOpenModal={() => openTrackingModal(item)}
                                disabled={isViewMode}
                              />
                            )}
                          </td>

                          {/* Action Column */}
                          {!isViewMode && (
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                title="Remove item"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-200 text-slate-800 font-bold text-xs">
                    <td colSpan={isIssueByRequisition ? 5 : 4} className="py-3 px-3">
                      Total Items:{" "}
                      <span className="font-mono text-indigo-600 font-bold">
                        {issueItems.length}
                      </span>
                    </td>
                    <td
                      colSpan={isIssueByRequisition ? 4 : 2}
                      className="py-3 px-3 text-right uppercase text-[10px] tracking-wider text-slate-500"
                    >
                      Total Issue Quantity:
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-indigo-600">
                      {totalIssueQuantity.toLocaleString()}
                    </td>
                    <td colSpan={isViewMode ? 1 : 2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Location Allocation Modal */}
        {activeTrackingItem && (
          <LocationAllocationModal
            isOpen={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            storeName={activeTrackingItem.issueStore || activeMR?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.issueQty}
            readOnly={isViewMode}
            currentAllocations={
              activeTrackingItem.locationAllocations?.map((l, i) => ({
                id: String(i),
                locationName: l.locationName,
                quantity: l.quantity,
              })) || []
            }
            onSave={handleSaveLocationAllocations}
          />
        )}

        {/* Batch Allocation Modal */}
        {activeTrackingItem && (
          <BatchAllocationModal
            isOpen={batchModalOpen}
            onClose={() => setBatchModalOpen(false)}
            storeName={activeTrackingItem.issueStore || activeMR?.warehouseStore || "Central Warehouse"}
            itemName={activeTrackingItem.itemName}
            itemCode={activeTrackingItem.itemCode}
            totalTransactionQty={activeTrackingItem.issueQty}
            readOnly={isViewMode}
            currentAllocations={
              activeTrackingItem.batchAllocations?.map((b, i) => ({
                id: String(i),
                batchNumber: b.batchNumber,
                quantity: b.quantity,
              })) || []
            }
            onSave={handleSaveBatchAllocations}
          />
        )}

        {/* Item Selection Modal for Direct Issue (Matching Direct Receive modal layout) */}
        {itemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Search & Add Item</h3>
                  <p className="text-xs text-muted-foreground">
                    Select an item from the master catalog to add to Direct Issue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setItemModalOpen(false);
                    setActiveSelectingRowId(null);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search items by code, name, specification, brand, origin, UoM..."
                  value={itemFilterQuery}
                  onChange={(e) => setItemFilterQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-muted/30 border border-border rounded-xl outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-border max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3 font-bold w-28">Item Code</th>
                      <th className="py-2.5 px-3 font-bold">Item Name</th>
                      <th className="py-2.5 px-3 font-bold w-28">Brand</th>
                      <th className="py-2.5 px-3 font-bold w-28">Origin</th>
                      <th className="py-2.5 px-3 font-bold w-16 text-center">UoM</th>
                      <th className="py-2.5 px-3 text-center font-bold w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCatalogItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectItemForActiveRow(item)}
                        className="hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-primary whitespace-nowrap">
                          {item.itemCode}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {item.itemName}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                          {item.brand || "Standard"}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                          {item.origin || "Local"}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-muted-foreground">
                          {item.stockUOM || item.purchaseUOM || (item as any).uom || "PCS"}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectItemForActiveRow(item);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCatalogItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No matching items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Preview Report Modal */}
        <StandardPreviewReportModal
          isOpen={previewReportOpen}
          onClose={() => setPreviewReportOpen(false)}
          data={previewReportData}
        />
      </main>
    </div>
  );
}
