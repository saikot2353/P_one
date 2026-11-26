import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Send,
  Save,
  ArrowLeft,
  Paperclip,
  Download,
  AlertCircle,
  TrendingDown,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Printer,
} from "lucide-react";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";
import {
  PurchaseRequisition,
  PRItem,
  PRAttachment,
  getStoredPurchaseRequisitions,
  setStoredPurchaseRequisitions,
  getStoredMonthlyBudgetRequisitions,
  getStoredInternalRequisitions,
  MonthlyBudgetRequisition,
  InternalRequisition,
} from "@/lib/procurement-requisition-data";
import { getEffectiveProcurementConfig } from "@/lib/procurement-config-data";
import {
  getStoredData,
  WarehouseStore,
  DEFAULT_WAREHOUSES,
  ItemProductMaster,
  DEFAULT_ITEMS,
  ItemCategory,
  DEFAULT_ITEM_CATEGORIES,
} from "@/lib/procurement-master-data";
import { employeesData } from "@/routes/personnel-list";

interface PRSearch {
  action?: "list" | "create" | "edit" | "view";
  id?: string;
  returnTo?: string;
}

export const Route = createFileRoute("/procurement-purchase-requisition")({
  validateSearch: (search: Record<string, unknown>): PRSearch => {
    return {
      action: search.action as any,
      id: search.id as string | undefined,
      returnTo: search.returnTo as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Purchase Requisitions — Local Procurement ERP" },
      { name: "description", content: "Create, manage, and track Purchase Requisitions." },
    ],
  }),
  component: PurchaseRequisitionPage,
});

function PurchaseRequisitionPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Requisitions state backed by LocalStorage
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(() =>
    getStoredPurchaseRequisitions(),
  );

  useEffect(() => {
    setStoredPurchaseRequisitions(requisitions);
  }, [requisitions]);

  // Master Catalogs for dropdowns
  const [warehouses] = useState<WarehouseStore[]>(() =>
    getStoredData("proc_warehouses_v2", DEFAULT_WAREHOUSES),
  );
  const [catalogItems] = useState<ItemProductMaster[]>(() =>
    getStoredData("proc_items_v2", DEFAULT_ITEMS),
  );
  const [categories] = useState<ItemCategory[]>(() =>
    getStoredData("proc_item_categories", DEFAULT_ITEM_CATEGORIES),
  );

  // Company list
  const companyList = [
    "Pakiza Knit Composite Ltd",
    "Pakiza Apparels Ltd",
    "Pakiza Spinning Mills Ltd",
    "Pakiza Dyeing & Printing Industries Ltd",
    "Pakiza Textiles Ltd",
  ];

  // Departments
  const departments = [
    "Information Technology",
    "Maintenance & Engineering",
    "Supply Chain & Procurement",
    "Merchandising",
    "Quality Assurance",
    "Production (Knitting)",
    "Production (Dyeing)",
    "Accounts & Finance",
    "Human Resources",
  ];

  // Page view mode
  const [pageMode, setPageMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedRecord, setSelectedRecord] = useState<PurchaseRequisition | null>(null);

  // Sync mode with route params if provided
  useEffect(() => {
    if (searchParams.action && searchParams.action !== pageMode) {
      setPageMode(searchParams.action);
      if (searchParams.id) {
        const found = requisitions.find((r) => r.id === searchParams.id);
        if (found) setSelectedRecord(found);
      }
    }
  }, [searchParams.action, searchParams.id]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  // Form State
  const [formData, setFormData] = useState<Partial<PurchaseRequisition>>({});
  const [formItems, setFormItems] = useState<PRItem[]>([]);
  const [formAttachments, setFormAttachments] = useState<PRAttachment[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetRecord, setReportTargetRecord] = useState<PurchaseRequisition | null>(null);

  const previewReportData: StandardReportData = useMemo(() => {
    const active = reportTargetRecord || (pageMode !== "list" ? formData : (selectedRecord || requisitions[0] || {}));
    const currentItems = (reportTargetRecord ? reportTargetRecord.items : (pageMode !== "list" ? formItems : (active.items || []))) || [];

    const getItemQty = (i: any): number => {
      const q = i?.quantity ?? i?.requestedQuantity ?? i?.requiredQuantity ?? i?.qty;
      const n = Number(q);
      return !isNaN(n) && n > 0 ? n : 0;
    };

    const totalQty =
      (currentItems.length > 0
        ? currentItems.reduce((acc, i) => acc + getItemQty(i), 0)
        : 0) || Number(active.totalItemQuantity) || 0;

    const totalVal =
      active.totalEstimatedAmount ||
      currentItems.reduce((acc, i) => {
        const amt = Number(i.estimatedAmount ?? (i as any).totalEstimatedPrice);
        if (!isNaN(amt) && amt > 0) return acc + amt;
        return acc + getItemQty(i) * (Number(i.estimatedUnitPrice) || 0);
      }, 0);

    return {
      reportType: "purchase-requisition",
      title: "Purchase Requisition (PR)",
      documentNo: active.prNumber || "PR-2026-000001",
      documentDate: active.prDate || new Date().toISOString().slice(0, 10),
      department: active.department || "Supply Chain & Procurement",
      status: active.status || "Approved",
      hideDocHeaderInfo: true,
      metadata: [
        { label: "PR Number", value: active.prNumber || "PR-2026-000001", highlight: true },
        { label: "Requisition Date", value: active.prDate || "—" },
        { label: "Department", value: active.department || "—" },
        { label: "Requested By", value: `${active.requestedBy || (active as any).requesterName || "Staff"} (${active.designation || (active as any).requesterDesignation || "Executive"})` },
        { label: "Required Date", value: active.requiredDate || (active as any).requiredByDate || "—" },
        { label: "Priority", value: active.priority || "Normal", highlight: active.priority === "Urgent" },
        {
          label: "Purpose / Justification",
          value: active.purpose || active.justification || active.notes || "Operational procurement requirements.",
          colSpan: 2,
        },
      ],
      items: currentItems.map((item, idx) => {
        const qty = getItemQty(item);
        const rate = item.estimatedUnitPrice || 0;
        const amt = item.estimatedAmount ?? (item as any).totalEstimatedPrice ?? (qty * rate);
        return {
          sl: idx + 1,
          itemCode: item.itemCode,
          itemName: item.itemName,
          specification: item.specification || (item as any).specifications || "—",
          brandOrigin: item.brandOrigin || `${item.brand || "Standard"} / ${item.origin || "Local"}`,
          uom: item.uom,
          quantity: qty,
          unitPrice: rate,
          totalAmount: amt,
          remarks: item.remarks || (item.purpose ? `Purpose: ${item.purpose}` : undefined),
        };
      }),
      financials: [
        { label: "Total Requisition Qty", value: `${totalQty.toLocaleString()} units`, isBold: true },
        { label: "Total Items Count", value: `${currentItems.length} lines` },
        { label: "Total Estimated Budget", value: `৳ ${totalVal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`, isTotal: true },
      ],
      summaryCards: [
        { label: "Total Requisition Qty", value: `${totalQty.toLocaleString()} units`, isBold: true },
        { label: "Total Items Count", value: `${currentItems.length} lines` },
        { label: "Total Estimated Budget", value: `৳ ${totalVal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`, isBold: true, isHighlight: true },
      ],
      signatures: [
        { role: "Requested By", name: active.requestedBy || (active as any).requesterName || "Md. Mahfuzur Rahman", title: active.designation || (active as any).requesterDesignation || "Procurement Officer", date: active.prDate },
        { role: "Department Head", name: "Engr. Zahirul Islam", title: "Head of Department", date: active.prDate },
        { role: "Internal Audit", name: "S. K. Majumder", title: "Manager, Audit & Compliance", date: active.prDate },
        { role: "Managing Director / COO", name: "Rafiqul Islam Pakiza", title: "Director (SCM)", date: active.prDate },
      ],
    };
  }, [reportTargetRecord, pageMode, formData, formItems, selectedRecord, requisitions]);

  // Approved Budget & Internal Requisitions
  const [approvedBudgets, setApprovedBudgets] = useState<MonthlyBudgetRequisition[]>([]);
  const [approvedInternals, setApprovedInternals] = useState<InternalRequisition[]>([]);

  useEffect(() => {
    setApprovedBudgets(getStoredMonthlyBudgetRequisitions().filter((b) => b.status === "Approved"));
    setApprovedInternals(getStoredInternalRequisitions().filter((i) => i.status === "Approved"));
  }, []);

  // Modal / Selector States for Tagging
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetSearchQuery, setBudgetSearchQuery] = useState("");
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchRowIndex, setItemSearchRowIndex] = useState<number | null>(null);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [categoryAlert, setCategoryAlert] = useState<{
    open: boolean;
    message: string;
    category?: string;
  } | null>(null);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = requisitions.length;
    const draft = requisitions.filter((r) => r.status === "Draft").length;
    const pending = requisitions.filter((r) => r.status === "Pending Approval" || r.status === "Submitted").length;
    const approved = requisitions.filter((r) => r.status === "Approved").length;
    const totalValue = requisitions.reduce((sum, r) => sum + (r.totalEstimatedAmount || 0), 0);
    return { total, draft, pending, approved, totalValue };
  }, [requisitions]);

  // Filtered Requisitions
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (priorityFilter !== "All" && r.priority !== priorityFilter) return false;
      if (departmentFilter !== "All" && r.department !== departmentFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.prNumber.toLowerCase().includes(q) ||
        r.requestedBy?.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q) ||
        r.company?.toLowerCase().includes(q)
      );
    });
  }, [requisitions, statusFilter, priorityFilter, departmentFilter, searchQuery]);

  // Handlers for entering Create / Edit / View
  const handleOpenCreate = () => {
    const nextNum = `PR-${new Date().getFullYear()}-${String(requisitions.length + 1).padStart(6, "0")}`;
    const initialPR: Partial<PurchaseRequisition> = {
      id: `pr-${Date.now()}`,
      prNumber: nextNum,
      prDate: new Date().toISOString().split("T")[0],
      company: companyList[0],
      department: departments[0],
      requestedBy: "Tahmid Afsar Shapno",
      designation: "Asst. Manager",
      requiredDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      priority: "Normal",
      purpose: "",
      itemCategory: "", // Default: All Categories
      budgetRequisitions: [],
      internalRequisitions: [],
      status: "Draft",
      currentApprovalLevel: 1,
    };

    setFormData(initialPR);
    setFormItems([
      {
        id: `pri-${Date.now()}`,
        sl: 1,
        itemId: catalogItems[0]?.id || "item-1",
        itemCode: catalogItems[0]?.itemCode || "IT-LAP-001",
        itemName: catalogItems[0]?.itemName || "Dell Latitude 5540 Core i7",
        specification: catalogItems[0]?.specification || catalogItems[0]?.description || "Intel Core i7 16GB/512GB SSD",
        brand: catalogItems[0]?.brand || "Dell",
        origin: catalogItems[0]?.origin || "USA",
        itemCategory: catalogItems[0]?.itemCategory || "IT Hardware",
        uom: catalogItems[0]?.stockUOM || "PCS",
        requestedQuantity: 1,
        estimatedUnitPrice: 85000,
        estimatedAmount: 85000,
        remarks: "",
      },
    ]);
    setFormAttachments([]);
    setFormErrors({});
    setSelectedRecord(null);
    setPageMode("create");
  };

  const handleOpenEdit = (record: PurchaseRequisition) => {
    setSelectedRecord(record);
    setFormData({
      ...record,
      budgetRequisitions: record.budgetRequisitions || [],
      internalRequisitions: record.internalRequisitions || [],
    });
    setFormItems(
      (record.items || []).map((it) => ({
        ...it,
        brand: it.brand || "Standard OEM",
        origin: it.origin || "Imported",
        specification: it.specification || (it as any).specifications || "",
        quantity: it.quantity ?? it.requestedQuantity ?? it.requiredQuantity ?? 1,
        requestedQuantity: it.requestedQuantity ?? it.quantity ?? it.requiredQuantity ?? 1,
        requiredQuantity: it.requiredQuantity ?? it.requestedQuantity ?? it.quantity ?? 1,
      }))
    );
    setFormAttachments(record.attachments || []);
    setFormErrors({});
    setPageMode("edit");
  };

  const handleOpenView = (record: PurchaseRequisition) => {
    setSelectedRecord(record);
    setFormData({
      ...record,
      budgetRequisitions: record.budgetRequisitions || [],
      internalRequisitions: record.internalRequisitions || [],
    });
    setFormItems(
      (record.items || []).map((it) => ({
        ...it,
        brand: it.brand || "Standard OEM",
        origin: it.origin || "Imported",
        specification: it.specification || (it as any).specifications || "",
        quantity: it.quantity ?? it.requestedQuantity ?? it.requiredQuantity ?? 1,
        requestedQuantity: it.requestedQuantity ?? it.quantity ?? it.requiredQuantity ?? 1,
        requiredQuantity: it.requiredQuantity ?? it.requestedQuantity ?? it.quantity ?? 1,
      }))
    );
    setFormAttachments(record.attachments || []);
    setPageMode("view");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Purchase Requisition?")) {
      setRequisitions((prev) => prev.filter((r) => r.id !== id));
      toast.success("Purchase Requisition deleted.");
    }
  };

  // Dynamic Item Row manipulation
  const handleAddItemRow = () => {
    const nextSl = formItems.length + 1;
    const newRow: PRItem = {
      id: `pri-${Date.now()}-${Math.random()}`,
      sl: nextSl,
      itemId: "",
      itemCode: "",
      itemName: "",
      specification: "",
      brand: "",
      origin: "",
      itemCategory: "",
      uom: "PCS",
      requestedQuantity: 1,
      estimatedUnitPrice: 0,
      estimatedAmount: 0,
      remarks: "",
    };
    setFormItems((prev) => [...prev, newRow]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (formItems.length === 1) {
      toast.error("At least one item is required in a Purchase Requisition.");
      return;
    }
    const updated = formItems.filter((_, idx) => idx !== index).map((it, idx) => ({ ...it, sl: idx + 1 }));
    setFormItems(updated);
  };

  const handleItemChange = (index: number, field: keyof PRItem, value: any) => {
    setFormItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };

      if (field === "requestedQuantity" || field === "estimatedUnitPrice") {
        const qty = field === "requestedQuantity" ? Number(value) || 0 : target.requestedQuantity;
        const price = field === "estimatedUnitPrice" ? Number(value) || 0 : target.estimatedUnitPrice;
        target.estimatedAmount = (qty || 0) * (price || 0);
      }

      copy[index] = target;
      return copy;
    });
  };

  // Select item from Item Search Modal
  const handleSelectItemFromSearch = (selectedItem: ItemProductMaster) => {
    if (itemSearchRowIndex === null) return;
    const procConfig = getEffectiveProcurementConfig(formData.company);

    if (!procConfig.allowMultipleCategories) {
      const establishedRow = formItems.find(
        (it, idx) => idx !== itemSearchRowIndex && it.itemName && it.itemCategory
      );
      const establishedCat = establishedRow?.itemCategory?.trim();
      const selectedCat = (selectedItem.itemCategory || "").trim();

      if (establishedCat && selectedCat && establishedCat.toLowerCase() !== selectedCat.toLowerCase()) {
        setCategoryAlert({
          open: true,
          category: establishedCat,
          message: `Items from different categories cannot be added to the same Purchase Requisition. This requisition is locked to category "${establishedCat}". The item "${selectedItem.itemName}" belongs to "${selectedCat}". You must select an item from the same category.`,
        });
        return;
      }
    }

    setFormItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[itemSearchRowIndex] };
      target.itemId = selectedItem.id;
      target.itemCode = selectedItem.itemCode;
      target.itemName = selectedItem.itemName;
      target.specification = selectedItem.specification || selectedItem.description || "";
      target.brand = selectedItem.brand || "Standard OEM";
      target.origin = selectedItem.origin || "Imported";
      target.itemCategory = selectedItem.itemCategory || "";
      target.uom = selectedItem.stockUOM || selectedItem.purchaseUOM || "PCS";
      if (selectedItem.standardPurchasePrice) {
        target.estimatedUnitPrice = selectedItem.standardPurchasePrice;
        target.estimatedAmount = (target.requestedQuantity || 1) * selectedItem.standardPurchasePrice;
      }
      copy[itemSearchRowIndex] = target;
      return copy;
    });
    setItemSearchOpen(false);
    setItemSearchRowIndex(null);
    toast.success(`Selected item: ${selectedItem.itemName}`);
  };

  // Tag / Untag Budget Requisition
  const handleToggleBudgetRequisition = (budget: MonthlyBudgetRequisition) => {
    const current = formData.budgetRequisitions || [];
    const exists = current.some((b) => b.id === budget.id);
    let updated;
    if (exists) {
      updated = current.filter((b) => b.id !== budget.id);
    } else {
      updated = [
        ...current,
        {
          id: budget.id,
          requisitionNumber: budget.requisitionNumber || budget.requisitionId || `MBR-${budget.id}`,
          approvalDate: budget.requisitionDate,
          requestedBy: budget.requestedBy || "Staff",
          department: budget.department,
        },
      ];
    }
    setFormData((prev) => ({ ...prev, budgetRequisitions: updated }));
  };

  // Tag / Untag Internal Requisition
  const handleToggleInternalRequisition = (internal: InternalRequisition) => {
    const current = formData.internalRequisitions || [];
    const exists = current.some((i) => i.id === internal.id);
    let updated;
    if (exists) {
      updated = current.filter((i) => i.id !== internal.id);
    } else {
      updated = [
        ...current,
        {
          id: internal.id,
          irNumber: internal.irNumber,
          approvalDate: internal.approvalDate,
          requestedBy: internal.requestedBy,
          department: internal.department,
        },
      ];
    }
    setFormData((prev) => ({ ...prev, internalRequisitions: updated }));
  };

  // Computations for totals
  const totalItemQuantity = useMemo(() => {
    return formItems.reduce((sum, it) => sum + (Number(it.requestedQuantity) || 0), 0);
  }, [formItems]);

  const totalEstimatedAmount = useMemo(() => {
    return formItems.reduce((sum, it) => sum + (Number(it.estimatedAmount) || 0), 0);
  }, [formItems]);

  // Add attachment
  const handleAddAttachment = () => {
    const newAtt: PRAttachment = {
      id: `att-${Date.now()}`,
      attachmentName: "Technical Specification Document",
      fileName: `Spec_Doc_${formAttachments.length + 1}.pdf`,
      fileSize: "512 KB",
      description: "Supporting specification document",
      uploadedBy: formData.requestedBy || "Tahmid Afsar Shapno",
      uploadedDate: new Date().toISOString().split("T")[0],
    };
    setFormAttachments((prev) => [...prev, newAtt]);
    toast.success("Attachment added.");
  };

  const handleRemoveAttachment = (id: string) => {
    setFormAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Form Save / Submit
  const handleSave = (isSubmit: boolean) => {
    const errors: Record<string, string> = {};
    if (!formData.company) errors.company = "Company is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.requestedBy) errors.requestedBy = "Requester is required";
    if (!formData.requiredDate) errors.requiredDate = "Required date is required";
    if (!formData.purpose?.trim()) errors.purpose = "Purpose / Justification is required";

    if (formItems.length === 0) {
      errors.items = "At least one item must be added.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    const procConfig = getEffectiveProcurementConfig(formData.company);
    if (!procConfig.allowMultipleCategories) {
      const distinctCats = Array.from(
        new Set(formItems.filter((i) => i.itemName && i.itemCategory).map((i) => i.itemCategory!.trim()))
      );
      if (distinctCats.length > 1) {
        setCategoryAlert({
          open: true,
          category: distinctCats[0],
          message: `Items from different categories cannot be added to the same Purchase Requisition (${distinctCats.join(", ")}). You must select items from the same category under company configuration.`,
        });
        return;
      }
    }

    const newStatus = isSubmit ? "Pending Approval" : "Draft";
    const recordPayload: PurchaseRequisition = {
      id: selectedRecord?.id || formData.id || `pr-${Date.now()}`,
      prNumber: formData.prNumber || `PR-${Date.now()}`,
      prDate: formData.prDate || new Date().toISOString().split("T")[0],
      company: formData.company || companyList[0],
      department: formData.department || departments[0],
      requestedBy: formData.requestedBy || "Tahmid Afsar Shapno",
      designation: formData.designation || "Staff",
      requiredDate: formData.requiredDate || new Date().toISOString().split("T")[0],
      priority: formData.priority || "Normal",
      purpose: formData.purpose || "",
      itemCategory: formData.itemCategory,
      budgetRequisitions: formData.budgetRequisitions || [],
      internalRequisitions: formData.internalRequisitions || [],
      items: formItems,
      totalItemQuantity,
      totalEstimatedAmount,
      attachments: formAttachments,
      status: newStatus,
      currentApprovalLevel: isSubmit ? 2 : 1,
      approvalHistory: selectedRecord?.approvalHistory || [
        {
          level: 1,
          stageName: "Requester Submission",
          approverName: formData.requestedBy || "Requester",
          designation: formData.designation || "Staff",
          action: isSubmit ? "Submitted" : "Draft",
          dateTime: new Date().toLocaleString(),
          remarks: isSubmit ? "Submitted for departmental approval." : "Saved as draft.",
        },
      ],
      createdDate: selectedRecord?.createdDate || new Date().toISOString().split("T")[0],
      submittedDate: isSubmit ? new Date().toISOString().split("T")[0] : undefined,
    };

    if (pageMode === "create") {
      setRequisitions((prev) => [recordPayload, ...prev]);
      toast.success(isSubmit ? "Purchase Requisition submitted for approval!" : "Purchase Requisition draft saved.");
    } else {
      setRequisitions((prev) => prev.map((r) => (r.id === recordPayload.id ? recordPayload : r)));
      toast.success(isSubmit ? "Purchase Requisition submitted for approval!" : "Purchase Requisition updated.");
    }

    setPageMode("list");
  };

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground overflow-hidden">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {searchParams.returnTo && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 text-amber-950 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                  <ArrowLeft className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Procurement Dashboard Drill-Down
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Stage: Purchase Requisition (PR)
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    Viewing purchase requisitions from the Procurement Workflow.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate({ to: searchParams.returnTo as any })}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
              >
                <ArrowLeft className="size-3.5" /> Back to Dashboard
              </button>
            </div>
          )}

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileText className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    Purchase Requisition
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {pageMode === "list" ? "Requisition Register" : pageMode === "view" ? "Requisition Details" : "Requisition Form"}
                  </span>
                </div>
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  {pageMode === "list"
                    ? "Purchase Requisitions"
                    : pageMode === "view"
                      ? `Requisition: ${selectedRecord?.prNumber}`
                      : pageMode === "create"
                        ? "New Purchase Requisition"
                        : `Edit Purchase Requisition: ${selectedRecord?.prNumber}`}
                </h1>
              </div>
            </div>

            {pageMode === "list" && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-4" />
                <span>Create Purchase Requisition</span>
              </button>
            )}
          </div>

          {/* LIST VIEW */}
          {pageMode === "list" && (
            <div className="space-y-6">
              {/* Summary Metric Cards (Total Est. Value removed per requirement) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-card p-4 rounded-xl border border-border/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase">Total PRs</div>
                    <div className="text-xl font-black text-foreground mt-0.5">{metrics.total}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase">Drafts</div>
                    <div className="text-xl font-black text-slate-600 dark:text-slate-300 mt-0.5">{metrics.draft}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500">
                    <Clock className="size-4" />
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase">Pending Approval</div>
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{metrics.pending}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Clock className="size-4" />
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase">Approved</div>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{metrics.approved}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="size-4" />
                  </div>
                </div>
              </div>

              {/* Filters & Table Console */}
              <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search PR No, Requester, Purpose..."
                        className="w-full pl-8.5 pr-8 h-8.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                      {["All", "Draft", "Pending Approval", "Approved"].map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                            statusFilter === st
                              ? "bg-card text-amber-500 shadow-2xs font-extrabold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Priority filter */}
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="h-8 px-2 rounded-lg border border-border/80 bg-background text-[11px] font-bold text-muted-foreground focus:border-amber-500 outline-none"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="text-xs text-muted-foreground font-medium">
                    Showing <span className="font-bold text-foreground">{filteredRequisitions.length}</span> PR records
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="py-3 px-3.5">PR Number</th>
                        <th className="py-3 px-3.5">PR Date</th>
                        <th className="py-3 px-3.5">Department</th>
                        <th className="py-3 px-3.5">Requested By</th>
                        <th className="py-3 px-3.5">Required Date</th>
                        <th className="py-3 px-3.5">Priority</th>
                        <th className="py-3 px-3.5">Status</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredRequisitions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            No Purchase Requisitions found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredRequisitions.map((pr) => (
                          <tr key={pr.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3.5 font-mono font-bold text-foreground">
                              {pr.prNumber}
                            </td>
                            <td className="py-2.5 px-3.5 text-muted-foreground">{pr.prDate}</td>
                            <td className="py-2.5 px-3.5">{pr.department}</td>
                            <td className="py-2.5 px-3.5 font-medium text-foreground">{pr.requestedBy}</td>
                            <td className="py-2.5 px-3.5 text-muted-foreground">{pr.requiredDate}</td>
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  pr.priority === "Critical"
                                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                    : pr.priority === "Urgent"
                                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                      : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                                }`}
                              >
                                {pr.priority}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                                  pr.status === "Approved"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : pr.status === "Pending Approval" || pr.status === "Submitted"
                                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                      : pr.status === "Rejected"
                                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                }`}
                              >
                                {pr.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReportTargetRecord(pr);
                                    setPreviewReportOpen(true);
                                  }}
                                  title="Preview Report"
                                  className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition cursor-pointer"
                                >
                                  <Printer className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenView(pr)}
                                  title="View PR"
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <Eye className="size-3.5" />
                                </button>
                                {pr.status === "Draft" && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(pr)}
                                    title="Edit PR"
                                    className="p-1.5 rounded-lg hover:bg-muted text-amber-500 hover:text-amber-600 cursor-pointer"
                                  >
                                    <Edit className="size-3.5" />
                                  </button>
                                )}
                                {pr.status === "Draft" && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(pr.id)}
                                    title="Delete PR"
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                )}
                              </div>
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

          {/* DEDICATED FORM VIEW (Create / Edit / View) */}
          {pageMode !== "list" && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 lg:p-7 shadow-xs space-y-7">
              {/* Top Navigation Row */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <button
                  type="button"
                  onClick={() => setPageMode("list")}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Requisitions</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReportTargetRecord(null);
                      setPreviewReportOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                    title="Preview Standard Report"
                  >
                    <Printer className="size-3.5" />
                    <span>Preview Report</span>
                  </button>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      formData.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : formData.status === "Pending Approval"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    }`}
                  >
                    Status: {formData.status || "Draft"}
                  </span>
                </div>
              </div>

              {/* SECTION: PR HEADER INFORMATION (Requirement: Section numbering removed, PR Number & Company removed, 5 cols layout) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <FileText className="size-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-foreground">PR Header Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">PR Date</label>
                    <input
                      type="date"
                      disabled={pageMode === "view"}
                      value={formData.prDate || ""}
                      onChange={(e) => setFormData({ ...formData, prDate: e.target.value })}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Department *</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={formData.department || ""}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                    />
                    {formErrors.department && <p className="text-[10px] text-rose-500 mt-1">{formErrors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Requested By *</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={formData.requestedBy || ""}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                    />
                    {formErrors.requestedBy && <p className="text-[10px] text-rose-500 mt-1">{formErrors.requestedBy}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Designation</label>
                    <input
                      type="text"
                      disabled
                      value={formData.designation || ""}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-muted/50 text-xs font-medium text-muted-foreground outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Required Date *</label>
                    <input
                      type="date"
                      disabled={pageMode === "view"}
                      value={formData.requiredDate || ""}
                      onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:opacity-70"
                    />
                    {formErrors.requiredDate && <p className="text-[10px] text-rose-500 mt-1">{formErrors.requiredDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Priority</label>
                    <select
                      disabled={pageMode === "view"}
                      value={formData.priority || "Normal"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:opacity-70"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-foreground">Item Category</label>
                    <select
                      disabled={pageMode === "view"}
                      value={formData.itemCategory || ""}
                      onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
                      className="w-full h-8.5 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:opacity-70"
                    >
                      <option value="">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.categoryName}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-3">
                    <label className="block text-xs font-bold mb-1 text-foreground">Purpose / Justification *</label>
                    <textarea
                      rows={2}
                      disabled={pageMode === "view"}
                      value={formData.purpose || ""}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Explain reason for the requisition, project reference, or department requirement..."
                      className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none disabled:opacity-70"
                    />
                    {formErrors.purpose && <p className="text-[10px] text-rose-500 mt-1">{formErrors.purpose}</p>}
                  </div>

                  {/* Budget Requisition & Internal Requisition Displayed Side by Side in 2 Columns */}
                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Budget Requisition Multi-Select Field */}
                    <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            <span>Budget Requisition (Approved)</span>
                          </label>
                          <p className="text-[11px] text-muted-foreground">
                            Tag approved Budget Requisitions
                          </p>
                        </div>
                        {pageMode !== "view" && (
                          <button
                            type="button"
                            onClick={() => {
                              setBudgetSearchQuery("");
                              setBudgetModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                          >
                            <Plus className="size-3.5" />
                            <span>Select Budget Requisition</span>
                          </button>
                        )}
                      </div>

                      {(formData.budgetRequisitions || []).length === 0 ? (
                        <div className="p-3 rounded-lg border border-dashed border-border/80 bg-background/50 text-[11px] text-muted-foreground text-center">
                          No Budget Requisitions linked.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {formData.budgetRequisitions?.map((b) => (
                            <div
                              key={b.id}
                              className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50/10 flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-mono font-bold text-xs text-foreground truncate">
                                  {b.requisitionNumber}
                                </div>
                                <div className="text-[11px] text-muted-foreground truncate">
                                  Req By: {b.requestedBy || "Staff"}
                                </div>
                              </div>
                              {pageMode !== "view" && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleBudgetRequisition(b as any)}
                                  className="text-muted-foreground hover:text-rose-500 transition cursor-pointer p-0.5"
                                  title="Remove"
                                >
                                  <X className="size-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Internal Requisition Multi-Select Field */}
                    <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-blue-500" />
                            <span>Internal Requisition (Approved)</span>
                          </label>
                          <p className="text-[11px] text-muted-foreground">
                            Tag approved Internal Requisitions
                          </p>
                        </div>
                        {pageMode !== "view" && (
                          <button
                            type="button"
                            onClick={() => {
                              setInternalSearchQuery("");
                              setInternalModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                          >
                            <Plus className="size-3.5" />
                            <span>Select Internal Requisition</span>
                          </button>
                        )}
                      </div>

                      {(formData.internalRequisitions || []).length === 0 ? (
                        <div className="p-3 rounded-lg border border-dashed border-border/80 bg-background/50 text-[11px] text-muted-foreground text-center">
                          No Internal Requisitions linked.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {formData.internalRequisitions?.map((ir) => (
                            <div
                              key={ir.id}
                              className="p-2.5 rounded-lg border border-blue-500/30 bg-blue-50/10 flex items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-mono font-bold text-xs text-foreground truncate">
                                  {ir.irNumber}
                                </div>
                                <div className="text-[11px] text-muted-foreground truncate">
                                  Req By: {ir.requestedBy || "Staff"}
                                </div>
                              </div>
                              {pageMode !== "view" && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleInternalRequisition(ir as any)}
                                  className="text-muted-foreground hover:text-rose-500 transition cursor-pointer p-0.5"
                                  title="Remove"
                                >
                                  <X className="size-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PR ITEM DETAILS (Dynamic Multi-Row Table) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-amber-500" />
                    <h2 className="text-sm font-bold text-foreground">PR Item Details</h2>
                  </div>

                  {pageMode !== "view" && (
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-border/70 overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[980px]">
                    <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="py-2.5 px-3 w-10">SL</th>
                        <th className="py-2.5 px-3 w-64">Item *</th>
                        <th className="py-2.5 px-3">Specification</th>
                        <th className="py-2.5 px-3 w-28">Brand</th>
                        <th className="py-2.5 px-3 w-28">Origin</th>
                        <th className="py-2.5 px-3 w-28">Category</th>
                        <th className="py-2.5 px-3 w-20">UOM</th>
                        <th className="py-2.5 px-3 w-24">Qty *</th>
                        <th className="py-2.5 px-3 w-28">Est. Unit Price</th>
                        <th className="py-2.5 px-3 w-32">Est. Amount</th>
                        <th className="py-2.5 px-3">Remarks</th>
                        {pageMode !== "view" && <th className="py-2.5 px-3 text-right w-16">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {formItems.map((item, index) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="py-2 px-3 font-mono font-bold text-muted-foreground">{index + 1}</td>
                          <td className="py-2 px-3">
                            {pageMode === "view" ? (
                              <div>
                                <span className="font-bold text-foreground">{item.itemName || "—"}</span>
                                <div className="text-[10px] font-mono text-muted-foreground">{item.itemCode}</div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  disabled
                                  value={item.itemName ? `${item.itemName} (${item.itemCode || ""})` : ""}
                                  placeholder="Click search to select item..."
                                  onClick={() => {
                                    setItemSearchRowIndex(index);
                                    setItemSearchQuery("");
                                    setItemSearchOpen(true);
                                  }}
                                  className="w-full h-8 px-2 rounded-md border border-border/80 bg-muted/40 text-xs font-semibold text-foreground cursor-pointer focus:border-amber-500 outline-none truncate"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setItemSearchRowIndex(index);
                                    setItemSearchQuery("");
                                    setItemSearchOpen(true);
                                  }}
                                  className="p-1.5 rounded-md border border-border/80 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition cursor-pointer shrink-0"
                                  title="Search Item Master (Name, Code, Spec, Brand, Origin, UOM)"
                                >
                                  <Search className="size-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.specification || ""}
                              className="w-full h-8 px-2 rounded-md border border-border/60 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.brand || ""}
                              placeholder="—"
                              className="w-full h-8 px-2 rounded-md border border-border/60 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.origin || ""}
                              placeholder="—"
                              className="w-full h-8 px-2 rounded-md border border-border/60 bg-muted/50 text-xs font-medium text-muted-foreground cursor-not-allowed outline-none"
                            />
                          </td>
                          <td className="py-2 px-3 text-muted-foreground font-medium">{item.itemCategory || "—"}</td>
                          <td className="py-2 px-3 font-mono font-bold text-foreground">{item.uom}</td>
                          <td className="py-2 px-3">
                            {pageMode === "view" ? (
                              <span className="font-mono font-bold">{item.requestedQuantity}</span>
                            ) : (
                              <input
                                type="number"
                                min={1}
                                value={item.requestedQuantity}
                                onChange={(e) => handleItemChange(index, "requestedQuantity", e.target.value)}
                                className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {pageMode === "view" ? (
                              <span className="font-mono">৳ {(item.estimatedUnitPrice || 0).toLocaleString()}</span>
                            ) : (
                              <input
                                type="number"
                                min={0}
                                value={item.estimatedUnitPrice}
                                onChange={(e) => handleItemChange(index, "estimatedUnitPrice", e.target.value)}
                                className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-mono focus:border-amber-500 outline-none"
                              />
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                            ৳ {(item.estimatedAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-2 px-3">
                            {pageMode === "view" ? (
                              <span className="text-muted-foreground">{item.remarks || "—"}</span>
                            ) : (
                              <input
                                type="text"
                                value={item.remarks || ""}
                                onChange={(e) => handleItemChange(index, "remarks", e.target.value)}
                                placeholder="Notes..."
                                className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                              />
                            )}
                          </td>
                          {pageMode !== "view" && (
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItemRow(index)}
                                className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t border-border/70 font-bold">
                      <tr>
                        <td colSpan={7} className="py-3 px-3 text-right uppercase text-[11px] text-muted-foreground">
                          Totals:
                        </td>
                        <td className="py-3 px-3 font-mono text-foreground font-bold">{totalItemQuantity}</td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400 text-sm font-black">
                          ৳ {totalEstimatedAmount.toLocaleString()}
                        </td>
                        <td colSpan={pageMode !== "view" ? 2 : 1}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* SECTION: ATTACHMENTS (Requirement: Section numbering removed) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Paperclip className="size-4 text-amber-500" />
                    <h2 className="text-sm font-bold text-foreground">Supporting Attachments</h2>
                  </div>

                  {pageMode !== "view" && (
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Attachment</span>
                    </button>
                  )}
                </div>

                {formAttachments.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No supporting documents attached.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formAttachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Paperclip className="size-4 text-amber-500 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate">{att.attachmentName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {att.fileName} ({att.fileSize || "1.2 MB"})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => toast.info(`Viewing ${att.fileName}`)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Download className="size-3.5" />
                          </button>
                          {pageMode !== "view" && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirement: Approval Progression Workflow section removed from visible form while preserving underlying routing */}

              {/* BOTTOM ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => {
                    setReportTargetRecord(null);
                    setPreviewReportOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>Preview Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPageMode("list")}
                  className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
                >
                  {pageMode === "view" ? "Close" : "Cancel"}
                </button>

                {pageMode !== "view" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSave(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition cursor-pointer"
                    >
                      <Save className="size-4" />
                      <span>Save as Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSave(true)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Send className="size-4" />
                      <span>Submit for Approval</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ITEM SEARCH MODAL */}
          {itemSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
              <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Search className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Select Item from Catalog</h2>
                      <p className="text-xs text-muted-foreground">Search and select item code, name, specification, brand, origin, and UOM</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setItemSearchOpen(false);
                      setItemSearchRowIndex(null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-border/60 bg-muted/20">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={itemSearchQuery}
                      onChange={(e) => setItemSearchQuery(e.target.value)}
                      placeholder="Search by Item Code, Name, Specification, Brand, Origin, UOM..."
                      className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-xs text-foreground focus:border-amber-500 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="rounded-xl border border-border/70 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Item Code</th>
                          <th className="py-2.5 px-3">Item Name</th>
                          <th className="py-2.5 px-3">Specification</th>
                          <th className="py-2.5 px-3">Brand</th>
                          <th className="py-2.5 px-3">Origin</th>
                          <th className="py-2.5 px-3">UOM</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {catalogItems
                          .filter((it) => {
                            if (!itemSearchQuery.trim()) return true;
                            const q = itemSearchQuery.toLowerCase();
                            return (
                              it.itemCode.toLowerCase().includes(q) ||
                              it.itemName.toLowerCase().includes(q) ||
                              (it.specification && it.specification.toLowerCase().includes(q)) ||
                              (it.description && it.description.toLowerCase().includes(q)) ||
                              (it.brand && it.brand.toLowerCase().includes(q)) ||
                              (it.origin && it.origin.toLowerCase().includes(q)) ||
                              (it.stockUOM && it.stockUOM.toLowerCase().includes(q))
                            );
                          })
                          .map((ci) => (
                            <tr key={ci.id} className="hover:bg-muted/30 transition">
                              <td className="py-2 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">{ci.itemCode}</td>
                              <td className="py-2 px-3 font-bold text-foreground">{ci.itemName}</td>
                              <td className="py-2 px-3 text-muted-foreground">{ci.specification || ci.description || "—"}</td>
                              <td className="py-2 px-3 text-muted-foreground">{ci.brand || "Standard OEM"}</td>
                              <td className="py-2 px-3 text-muted-foreground">{ci.origin || "Imported"}</td>
                              <td className="py-2 px-3 font-mono font-bold">{ci.stockUOM || ci.purchaseUOM || "PCS"}</td>
                              <td className="py-2 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleSelectItemFromSearch(ci)}
                                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer"
                                >
                                  Select
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

          {/* BUDGET REQUISITION SELECTION MODAL */}
          {budgetModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
              <div className="bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Select Approved Budget Requisition</h2>
                      <p className="text-xs text-muted-foreground">Only approved Budget Requisitions are eligible to tag</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBudgetModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-border/60 bg-muted/20">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={budgetSearchQuery}
                      onChange={(e) => setBudgetSearchQuery(e.target.value)}
                      placeholder="Search by Budget Requisition ID, Requester, Department..."
                      className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-xs text-foreground focus:border-emerald-500 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {approvedBudgets.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">No approved budget requisitions found in the system.</div>
                  ) : (
                    <div className="rounded-xl border border-border/70 overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[550px]">
                        <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Budget Requisition ID</th>
                            <th className="py-2.5 px-3">Approval Date</th>
                            <th className="py-2.5 px-3">Requested By</th>
                            <th className="py-2.5 px-3">Department</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {approvedBudgets
                            .filter((b) => {
                              if (!budgetSearchQuery.trim()) return true;
                              const q = budgetSearchQuery.toLowerCase();
                              const num = b.requisitionNumber || b.requisitionId || "";
                              return (
                                num.toLowerCase().includes(q) ||
                                (b.requestedBy && b.requestedBy.toLowerCase().includes(q)) ||
                                (b.department && b.department.toLowerCase().includes(q))
                              );
                            })
                            .map((b) => {
                              const isTagged = (formData.budgetRequisitions || []).some((x) => x.id === b.id);
                              const reqNum = b.requisitionNumber || b.requisitionId || `MBR-${b.id}`;
                              return (
                                <tr key={b.id} className="hover:bg-muted/30 transition">
                                  <td className="py-2 px-3 font-mono font-bold text-foreground">{reqNum}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{b.requisitionDate || "Approved"}</td>
                                  <td className="py-2 px-3 font-bold text-foreground">{b.requestedBy || "Staff"}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{b.department}</td>
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleBudgetRequisition(b)}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                        isTagged
                                          ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                                      }`}
                                    >
                                      {isTagged ? "Untag" : "Select & Tag"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INTERNAL REQUISITION SELECTION MODAL */}
          {internalModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
              <div className="bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Select Approved Internal Requisition</h2>
                      <p className="text-xs text-muted-foreground">Only approved Internal Requisitions are eligible to tag</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInternalModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-border/60 bg-muted/20">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={internalSearchQuery}
                      onChange={(e) => setInternalSearchQuery(e.target.value)}
                      placeholder="Search by Internal Requisition ID, Requester, Department..."
                      className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-xs text-foreground focus:border-blue-500 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {approvedInternals.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">No approved internal requisitions found in the system.</div>
                  ) : (
                    <div className="rounded-xl border border-border/70 overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[550px]">
                        <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Internal Requisition ID</th>
                            <th className="py-2.5 px-3">Approval Date</th>
                            <th className="py-2.5 px-3">Requested By</th>
                            <th className="py-2.5 px-3">Department</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {approvedInternals
                            .filter((ir) => {
                              if (!internalSearchQuery.trim()) return true;
                              const q = internalSearchQuery.toLowerCase();
                              return (
                                ir.irNumber.toLowerCase().includes(q) ||
                                (ir.requestedBy && ir.requestedBy.toLowerCase().includes(q)) ||
                                (ir.department && ir.department.toLowerCase().includes(q))
                              );
                            })
                            .map((ir) => {
                              const isTagged = (formData.internalRequisitions || []).some((x) => x.id === ir.id);
                              return (
                                <tr key={ir.id} className="hover:bg-muted/30 transition">
                                  <td className="py-2 px-3 font-mono font-bold text-foreground">{ir.irNumber}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{ir.approvalDate || "Approved"}</td>
                                  <td className="py-2 px-3 font-bold text-foreground">{ir.requestedBy}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{ir.department}</td>
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleInternalRequisition(ir)}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                        isTagged
                                          ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                                          : "bg-blue-600 text-white hover:bg-blue-700"
                                      }`}
                                    >
                                      {isTagged ? "Untag" : "Select & Tag"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Standard Preview Report Modal */}
      <StandardPreviewReportModal
        isOpen={previewReportOpen}
        onClose={() => {
          setPreviewReportOpen(false);
          setReportTargetRecord(null);
        }}
        data={previewReportData}
      />

      {/* Multiple Categories Rule Inline / In-App Alert Modal */}
      {categoryAlert?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-rose-500/40 rounded-2xl p-5 shadow-2xl max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Category Policy Notice</h3>
                <p className="text-xs text-muted-foreground">Single Category Requisition Rule</p>
              </div>
            </div>

            <div className="text-xs text-foreground/90 leading-relaxed bg-rose-500/5 p-3.5 rounded-xl border border-rose-500/20 space-y-2">
              <p>{categoryAlert.message}</p>
              {categoryAlert.category && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  Locked Category: <strong className="font-mono">{categoryAlert.category}</strong>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setCategoryAlert(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
