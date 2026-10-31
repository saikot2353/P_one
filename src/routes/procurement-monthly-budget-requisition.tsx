import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  CalendarRange,
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
  ChevronRight,
  FileSpreadsheet,
  Layers,
  ArrowRightCircle,
  FileText,
  DollarSign,
  Package,
  Printer,
  Tag,
  Link2,
} from "lucide-react";
import {
  StandardPreviewReportModal,
  StandardReportData,
} from "@/components/reports/StandardPreviewReportModal";
import {
  MonthlyBudgetRequisition,
  BudgetItem,
  getStoredMonthlyBudgetRequisitions,
  setStoredMonthlyBudgetRequisitions,
  getStoredPurchaseRequisitions,
  setStoredPurchaseRequisitions,
  generateId,
  PurchaseRequisition,
} from "@/lib/procurement-requisition-data";
import {
  getStoredData,
  WarehouseStore,
  DEFAULT_WAREHOUSES,
  ItemProductMaster,
  DEFAULT_ITEMS,
  ItemCategory,
  DEFAULT_ITEM_CATEGORIES,
} from "@/lib/procurement-master-data";
import {
  getStoredMaterialRequisitions,
  MaterialRequisition,
} from "@/lib/inventory-requisition-issue-data";

interface BudgetSearch {
  action?: "list" | "create" | "edit" | "view";
  id?: string;
}

export const Route = createFileRoute("/procurement-monthly-budget-requisition")({
  validateSearch: (search: Record<string, unknown>): BudgetSearch => {
    return {
      action: search.action as any,
      id: search.id as string | undefined,
    };
  },
  component: MonthlyBudgetRequisitionPage,
});

export default function MonthlyBudgetRequisitionPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [requisitions, setRequisitions] = useState<MonthlyBudgetRequisition[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit" | "view">(
    search.action || "list"
  );
  const [activeReqId, setActiveReqId] = useState<string | null>(search.id || null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Master Data Reference
  const [itemsMaster, setItemsMaster] = useState<ItemProductMaster[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseStore[]>([]);

  // Item Search Modal State
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [itemSearchRowIndex, setItemSearchRowIndex] = useState<number | null>(null);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [duplicateAlertItem, setDuplicateAlertItem] = useState<string | null>(null);

  useEffect(() => {
    setRequisitions(getStoredMonthlyBudgetRequisitions());
    setItemsMaster(getStoredData("cripton_master_item_creation", DEFAULT_ITEMS));
    setCategories(getStoredData("cripton_master_item_category", DEFAULT_ITEM_CATEGORIES));
    setWarehouses(getStoredData("cripton_master_warehouses", DEFAULT_WAREHOUSES));
  }, []);

  const filteredMasterItems = useMemo(() => {
    if (!itemSearchQuery.trim()) return itemsMaster;
    const q = itemSearchQuery.toLowerCase();
    return itemsMaster.filter((it) => {
      return (
        (it.itemCode && it.itemCode.toLowerCase().includes(q)) ||
        (it.itemName && it.itemName.toLowerCase().includes(q)) ||
        (it.specification && it.specification.toLowerCase().includes(q)) ||
        (it.description && it.description.toLowerCase().includes(q)) ||
        (it.brand && it.brand.toLowerCase().includes(q)) ||
        (it.origin && it.origin.toLowerCase().includes(q)) ||
        ((it.stockUOM || it.stockUom) && (it.stockUOM || it.stockUom || "").toLowerCase().includes(q))
      );
    });
  }, [itemsMaster, itemSearchQuery]);

  // Sync route search params
  useEffect(() => {
    if (search.action) setViewMode(search.action);
    if (search.id) setActiveReqId(search.id);
  }, [search.action, search.id]);

  // Form State
  const [formData, setFormData] = useState<Omit<MonthlyBudgetRequisition, "id">>({
    requisitionNumber: "",
    requisitionDate: new Date().toISOString().split("T")[0],
    budgetMonth: new Date().toISOString().substring(0, 7), // YYYY-MM
    organization: "Pakiza Knit Composite Ltd.",
    department: "Spinning & Production",
    remarks: "",
    status: "Draft",
    totalEstimatedBudget: 0,
    items: [],
    taggedInternalRequisitions: [],
    auditHistory: [],
  });

  // Tag Internal Requisition Modal State
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const approvedInternalReqs = useMemo(() => {
    const all = getStoredMaterialRequisitions();
    return all.filter((mr) => mr.status === "Approved");
  }, []);

  const filteredApprovedReqs = useMemo(() => {
    if (!tagSearchQuery.trim()) return approvedInternalReqs;
    const q = tagSearchQuery.toLowerCase();
    return approvedInternalReqs.filter(
      (mr) =>
        (mr.mrNumber && mr.mrNumber.toLowerCase().includes(q)) ||
        (mr.requestedBy && mr.requestedBy.toLowerCase().includes(q)) ||
        (mr.department && mr.department.toLowerCase().includes(q))
    );
  }, [approvedInternalReqs, tagSearchQuery]);

  const handleTagSingle = (mr: MaterialRequisition) => {
    const current = formData.taggedInternalRequisitions || [];
    if (current.some((t) => t.id === mr.id || t.mrNumber === mr.mrNumber)) {
      toast.info(`Internal requisition ${mr.mrNumber} is already tagged.`);
      return;
    }
    const newTag = {
      id: mr.id,
      mrNumber: mr.mrNumber,
      approvedDate: mr.approvedDate || mr.requisitionDate,
      requestedBy: mr.requestedBy,
      department: mr.department,
    };
    setFormData((prev) => ({
      ...prev,
      taggedInternalRequisitions: [...(prev.taggedInternalRequisitions || []), newTag],
    }));
    toast.success(`Tagged ${mr.mrNumber}`);
  };

  const handleConfirmBatchTag = () => {
    const current = formData.taggedInternalRequisitions || [];
    const toAdd: Array<{ id: string; mrNumber: string; approvedDate?: string; requestedBy: string; department: string }> = [];
    selectedTagIds.forEach((id) => {
      const mr = approvedInternalReqs.find((r) => r.id === id);
      if (mr && !current.some((t) => t.id === mr.id || t.mrNumber === mr.mrNumber) && !toAdd.some((t) => t.id === mr.id)) {
        toAdd.push({
          id: mr.id,
          mrNumber: mr.mrNumber,
          approvedDate: mr.approvedDate || mr.requisitionDate,
          requestedBy: mr.requestedBy,
          department: mr.department,
        });
      }
    });

    if (toAdd.length === 0) {
      toast.info("Selected requisitions are already tagged.");
    } else {
      setFormData((prev) => ({
        ...prev,
        taggedInternalRequisitions: [...(prev.taggedInternalRequisitions || []), ...toAdd],
      }));
      toast.success(`Tagged ${toAdd.length} internal requisition(s)`);
    }
    setSelectedTagIds([]);
    setTagModalOpen(false);
  };

  // Preview Report State
  const [previewReportOpen, setPreviewReportOpen] = useState(false);
  const [reportTargetRecord, setReportTargetRecord] = useState<MonthlyBudgetRequisition | null>(null);

  const activeRequisition = useMemo(() => {
    return requisitions.find((r) => r.id === activeReqId) || null;
  }, [requisitions, activeReqId]);

  const budgetReportData: StandardReportData = useMemo(() => {
    const active = reportTargetRecord || (viewMode === "view" && activeRequisition ? activeRequisition : { ...formData, id: "active-budget" });
    const itemsList = (active as any).items || [];
    const totalQty = itemsList.reduce((acc: number, i: any) => acc + (Number(i.estimatedQuantity) || 0), 0);
    const totalVal = (active as any).totalEstimatedBudget || itemsList.reduce((acc: number, i: any) => acc + (Number(i.estimatedAmount) || (Number(i.estimatedQuantity) * (i.estimatedUnitPrice || 0))), 0);

    return {
      reportType: "monthly-budget-requisition",
      title: "Monthly Budget Requisition (MBR)",
      documentNo: (active as any).requisitionNumber || (active as any).requisitionId || "MBR-2026-001",
      documentDate: (active as any).requisitionDate || new Date().toISOString().slice(0, 10),
      department: (active as any).department || "Spinning & Production",
      status: (active as any).status || "Approved",
      hideLogo: true,
      hideDocHeaderInfo: true,
      hideCompanyHeader: true,
      metadata: [
        { label: "MBR Number", value: (active as any).requisitionNumber || (active as any).requisitionId || "MBR-2026-001", highlight: true },
        { label: "Requisition Date", value: (active as any).requisitionDate || "—" },
        { label: "Budget Month", value: (active as any).budgetMonth || "—", highlight: true },
        { label: "Department", value: (active as any).department || "—" },
      ],
      items: itemsList.map((item: any, idx: number) => ({
        sl: idx + 1,
        itemCode: item.itemCode || `ITM-${idx + 1}`,
        itemName: item.itemName,
        specification: item.specification || "—",
        brandOrigin: `${item.brand || "Standard"} / ${item.origin || "Local"}`,
        uom: item.uom,
        quantity: item.estimatedQuantity || 0,
        remarks: item.remarks || (item.prId ? `PR: ${item.prId}` : undefined),
      })),
      financials: [
        { label: "Total Budget Quantity", value: `${totalQty.toLocaleString()} units` },
      ],
      remarks: (active as any).remarks || "Monthly material requirement budget plan approved for operational purchase.",
      signatures: [
        { role: "Prepared By", name: "Engr. Nazmul Huda", title: "Assistant Store Incharge", date: (active as any).requisitionDate },
        { role: "Department Head", name: "Engr. Zahirul Islam", title: "Head of Spinning", date: (active as any).requisitionDate },
        { role: "Budget Controller", name: "Md. Rafiqul Islam", title: "General Manager (Finance & Accounts)", date: (active as any).requisitionDate },
        { role: "Authorized Director", name: "Rafiqul Islam Pakiza", title: "Director (SCM & Operations)", date: (active as any).requisitionDate },
      ],
    };
  }, [reportTargetRecord, viewMode, activeRequisition, formData]);

  const handleOpenCreate = () => {
    const nextSeq = String(requisitions.length + 1).padStart(3, "0");
    const nextNumber = `MBR-${new Date().getFullYear()}-${nextSeq}`;

    setFormData({
      requisitionNumber: nextNumber,
      requisitionDate: new Date().toISOString().split("T")[0],
      budgetMonth: new Date().toISOString().substring(0, 7),
      organization: "Pakiza Knit Composite Ltd.",
      department: "Production & Maintenance",
      remarks: "Monthly planned requirements for operational spare parts and general materials.",
      status: "Draft",
      totalEstimatedBudget: 0,
      taggedInternalRequisitions: [],
      items: [
        {
          id: generateId(),
          itemName: "",
          itemCode: "",
          category: "",
          uom: "Pcs",
          estimatedQuantity: 10,
          estimatedUnitPrice: 0,
          totalEstimatedAmount: 0,
          issueId: "",
          prId: "",
          remarks: "",
        },
      ],
      auditHistory: [
        {
          action: "Requisition Draft Created",
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Current User",
        },
      ],
    });
    setActiveReqId(null);
    setViewMode("create");
    navigate({ to: "/procurement-monthly-budget-requisition", search: { action: "create" } });
  };

  const handleOpenEdit = (req: MonthlyBudgetRequisition) => {
    if (req.status === "Approved") {
      toast.error("Approved budget requisitions cannot be edited.");
      return;
    }
    setFormData({ ...req });
    setActiveReqId(req.id);
    setViewMode("edit");
    navigate({ to: "/procurement-monthly-budget-requisition", search: { action: "edit", id: req.id } });
  };

  const handleOpenView = (req: MonthlyBudgetRequisition) => {
    setActiveReqId(req.id);
    setViewMode("view");
    navigate({ to: "/procurement-monthly-budget-requisition", search: { action: "view", id: req.id } });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setActiveReqId(null);
    navigate({ to: "/procurement-monthly-budget-requisition", search: { action: "list" } });
  };

  // Item modifications
  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: generateId(),
          itemName: "",
          itemCode: "",
          category: "",
          uom: "Pcs",
          estimatedQuantity: 1,
          estimatedUnitPrice: 0,
          totalEstimatedAmount: 0,
          issueId: "",
          prId: "",
          remarks: "",
        },
      ],
    }));
  };

  const handleRemoveItemRow = (index: number) => {
    if (formData.items.length === 1) {
      toast.error("Requisition must have at least one line item.");
      return;
    }
    const updated = formData.items.filter((_, i) => i !== index);
    const total = updated.reduce((sum, item) => sum + (item.totalEstimatedAmount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updated,
      totalEstimatedBudget: total,
    }));
  };

  const handleItemSelect = (index: number, itemId: string) => {
    const selected = itemsMaster.find((i) => i.id === itemId);
    if (!selected) return;

    const updated = [...formData.items];
    const unitPrice = selected.standardCost || (selected as any).standardPurchasePrice || selected.lastPurchasePrice || 100;
    const qty = updated[index].estimatedQuantity || 1;

    updated[index] = {
      ...updated[index],
      itemName: selected.itemName,
      itemCode: selected.itemCode,
      specification: selected.specification || selected.description || "",
      brand: selected.brand || "Standard OEM",
      origin: selected.origin || "Imported",
      category: selected.categoryName || (selected as any).itemCategory || "General",
      uom: (selected as any).stockUOM || selected.stockUom || (selected as any).purchaseUOM || "Pcs",
      estimatedUnitPrice: unitPrice,
      totalEstimatedAmount: qty * unitPrice,
    };

    const total = updated.reduce((sum, item) => sum + (item.totalEstimatedAmount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updated,
      totalEstimatedBudget: total,
    }));
  };

  const handleSelectItemFromModal = (selected: ItemProductMaster) => {
    if (itemSearchRowIndex === null) return;

    // Check for duplicate item in requisition
    const isDuplicate = formData.items.some(
      (it, idx) =>
        idx !== itemSearchRowIndex &&
        ((it.itemCode && it.itemCode === selected.itemCode) ||
          (it.itemName && it.itemName.trim().toLowerCase() === selected.itemName.trim().toLowerCase()))
    );

    if (isDuplicate) {
      setItemSearchOpen(false);
      setDuplicateAlertItem(selected.itemName);
      return;
    }

    const updated = [...formData.items];
    const unitPrice = selected.standardCost || (selected as any).standardPurchasePrice || selected.lastPurchasePrice || 100;
    const qty = updated[itemSearchRowIndex].estimatedQuantity || 1;

    updated[itemSearchRowIndex] = {
      ...updated[itemSearchRowIndex],
      itemName: selected.itemName,
      itemCode: selected.itemCode,
      specification: selected.specification || selected.description || "",
      brand: selected.brand || "Standard OEM",
      origin: selected.origin || "Imported",
      category: selected.categoryName || (selected as any).itemCategory || "General",
      uom: (selected as any).stockUOM || selected.stockUom || (selected as any).purchaseUOM || "Pcs",
      estimatedUnitPrice: unitPrice,
      totalEstimatedAmount: qty * unitPrice,
    };

    const total = updated.reduce((sum, item) => sum + (item.totalEstimatedAmount || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updated,
      totalEstimatedBudget: total,
    }));
    setItemSearchOpen(false);
    setItemSearchRowIndex(null);
    toast.success(`Selected item: ${selected.itemName}`);
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, val: any) => {
    const updated = [...formData.items];
    const current = { ...updated[index], [field]: val };

    if (field === "estimatedQuantity" || field === "estimatedUnitPrice") {
      const qty = Number(field === "estimatedQuantity" ? val : current.estimatedQuantity) || 0;
      const price = Number(field === "estimatedUnitPrice" ? val : current.estimatedUnitPrice) || 0;
      current.totalEstimatedAmount = qty * price;
    }

    updated[index] = current;
    const total = updated.reduce((sum, item) => sum + (item.totalEstimatedAmount || 0), 0);

    setFormData((prev) => ({
      ...prev,
      items: updated,
      totalEstimatedBudget: total,
    }));
  };

  const handleSave = (submitForApproval: boolean) => {
    // Validation
    if (!formData.requisitionNumber?.trim()) {
      toast.error("Requisition number is required.");
      return;
    }
    if (!formData.organization?.trim() || !formData.department?.trim()) {
      toast.error("Organization and Department are required.");
      return;
    }
    if (!formData.budgetMonth?.trim()) {
      toast.error("Budget month is required.");
      return;
    }
    if (formData.items.length === 0 || !formData.items[0].itemName.trim()) {
      toast.error("Please add at least one valid item to the budget.");
      return;
    }

    const newStatus = submitForApproval ? "Submitted" : formData.status || "Draft";
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    if (viewMode === "create") {
      const newRecord: MonthlyBudgetRequisition = {
        ...formData,
        id: generateId(),
        status: newStatus,
        auditHistory: [
          ...(formData.auditHistory || []),
          {
            action: submitForApproval ? "Submitted for Approval" : "Draft Saved",
            date: now,
            user: "Current User",
          },
        ],
      };
      const updated = [newRecord, ...requisitions];
      setStoredMonthlyBudgetRequisitions(updated);
      setRequisitions(updated);
      toast.success(
        submitForApproval
          ? `Budget Requisition ${newRecord.requisitionNumber} submitted for approval!`
          : `Budget Requisition draft saved!`
      );
    } else if (viewMode === "edit" && activeReqId) {
      const updated = requisitions.map((r) => {
        if (r.id !== activeReqId) return r;
        return {
          ...formData,
          id: activeReqId,
          status: newStatus,
          auditHistory: [
            ...(formData.auditHistory || []),
            {
              action: submitForApproval ? "Submitted for Approval" : "Updated Draft",
              date: now,
              user: "Current User",
            },
          ],
        };
      });
      setStoredMonthlyBudgetRequisitions(updated);
      setRequisitions(updated);
      toast.success(
        submitForApproval
          ? `Budget Requisition submitted for approval!`
          : `Budget Requisition changes saved!`
      );
    }

    handleBackToList();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this monthly budget requisition?")) return;
    const updated = requisitions.filter((r) => r.id !== id);
    setStoredMonthlyBudgetRequisitions(updated);
    setRequisitions(updated);
    toast.success("Budget requisition deleted.");
  };

  // Convert Approved Budget Item to Purchase Requisition
  const handleConvertToPR = (req: MonthlyBudgetRequisition) => {
    if (req.status !== "Approved") {
      toast.error("Only Approved Budget Requisitions can be converted into Purchase Requisitions.");
      return;
    }

    const currentPRs = getStoredPurchaseRequisitions();
    const nextSeq = String(currentPRs.length + 1).padStart(3, "0");
    const prNumber = `PR-${new Date().getFullYear()}-${nextSeq}`;

    const newPR: PurchaseRequisition = {
      id: generateId(),
      prNumber,
      prDate: new Date().toISOString().split("T")[0],
      requiredByDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      organization: req.organization,
      department: req.department,
      requesterName: "Budget Control Officer",
      requesterDesignation: "Budget Admin",
      costCenter: `${req.department} Operations`,
      warehouseId: warehouses[0]?.id || "wh-1",
      warehouseName: warehouses[0]?.storeName || "Central Spare Parts Warehouse",
      requisitionType: "Budgeted",
      priority: "Medium",
      currency: "BDT",
      purpose: `Procurement against Approved Monthly Budget: ${req.requisitionNumber} (${req.budgetMonth})`,
      budgetHead: {
        code: "OPEX-401",
        name: "Monthly Operational & Spare Parts Budget",
        allocatedAmount: (req.totalEstimatedBudget || 0) * 1.5,
        utilizedAmount: 0,
        remainingAmount: (req.totalEstimatedBudget || 0) * 1.5,
        budgetAvailable: true,
      },
      status: "Draft",
      totalEstimatedCost: req.totalEstimatedBudget || 0,
      items: req.items.map((bItem, idx) => ({
        id: generateId(),
        itemCode: bItem.itemCode,
        itemName: bItem.itemName,
        categoryName: bItem.category,
        uom: bItem.uom,
        currentStock: 15,
        requiredQuantity: bItem.estimatedQuantity,
        estimatedUnitPrice: bItem.estimatedUnitPrice || 0,
        totalEstimatedPrice: bItem.totalEstimatedAmount,
        specifications: bItem.remarks || "As per monthly budget specification",
        preferredBrand: "OEM Standard",
        preferredOrigin: "Bangladesh / Import",
        remarks: `Converted from Budget ${req.requisitionNumber} Item #${idx + 1}`,
      })),
      attachments: [],
      approvalWorkflow: [
        {
          stageNumber: 1,
          stageName: "Department Review",
          approverRole: "Head of Department",
          status: "Pending",
        },
      ],
      auditHistory: [
        {
          action: `Converted from Monthly Budget Requisition ${req.requisitionNumber}`,
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Budget Control Admin",
        },
      ],
    };

    // Update Budget items with PR reference ID
    const updatedBudgetItems = req.items.map((item) => ({
      ...item,
      prId: prNumber,
    }));

    const updatedBudgetReqs = requisitions.map((r) =>
      r.id === req.id ? { ...r, items: updatedBudgetItems } : r
    );

    setStoredMonthlyBudgetRequisitions(updatedBudgetReqs);
    setRequisitions(updatedBudgetReqs);

    setStoredPurchaseRequisitions([newPR, ...currentPRs]);
    toast.success(`Purchase Requisition ${prNumber} created from this budget requisition!`);
    navigate({ to: "/procurement-purchase-requisition", search: { action: "view", id: newPR.id } });
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return (requisitions || []).filter((r) => {
      const reqNo = r.requisitionNumber || r.requisitionId || "";
      const org = r.organization || r.company || "";
      const dept = r.department || "";
      const bMonth = r.budgetMonth || "";

      const matchesSearch =
        reqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bMonth.includes(searchTerm);

      const matchesMonth = monthFilter === "All" || bMonth === monthFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [requisitions, searchTerm, monthFilter, statusFilter]);

  const uniqueMonths = useMemo(() => {
    return Array.from(new Set((requisitions || []).map((r) => r.budgetMonth || ""))).filter(Boolean).sort().reverse();
  }, [requisitions]);

  const totalBudgetSum = useMemo(() => {
    return (requisitions || []).reduce((sum, r) => sum + (r.totalEstimatedBudget ?? r.estimatedRequirementValue ?? 0), 0);
  }, [requisitions]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <ProcurementSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProcurementTopbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                <span>Purchase Requisition</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Monthly Budget Requisition</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <CalendarRange className="w-7 h-7 text-indigo-600" />
                Monthly Budget Requisition
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Plan and estimate monthly department material requirements with Issue ID and PR ID tracking.
              </p>
            </div>

            {viewMode === "list" ? (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Monthly Budget
              </button>
            ) : (
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Budget List
              </button>
            )}
          </div>

          {viewMode === "list" ? (
            /* List View */
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Total Requisitions
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{requisitions.length}</div>
                  <p className="text-xs text-slate-400 mt-1">Across all departments</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                    Approved Budgets
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">
                    {requisitions.filter((r) => r.status === "Approved").length}
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">Active for PR conversion</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    Under Review
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
                    {requisitions.filter((r) => r.status === "Submitted").length}
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Awaiting budget committee</p>
                </div>
              </div>

              {/* Filters & Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search budget #, department, month..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Month:</span>
                      <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="All">All Months</option>
                        {uniqueMonths.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">Budget Requisition #</th>
                        <th className="py-3 px-4">Budget Month</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4 text-center">Items</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <CalendarRange className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                            <p className="font-medium text-slate-600">No monthly budget requisitions found</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Create a new monthly requirement estimate to get started.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((req) => {
                          const reqNo = req.requisitionNumber || req.requisitionId || "MBR";
                          const org = req.organization || req.company || "Pakiza Group";
                          const itemsCount = req.items?.length || 0;

                          return (
                          <tr key={req.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-indigo-600">{reqNo}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {req.requisitionDate}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                <Calendar className="w-3 h-3 text-indigo-500" />
                                {req.budgetMonth}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">{req.department}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                {itemsCount} items
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                  req.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : req.status === "Submitted"
                                    ? "bg-amber-100 text-amber-800"
                                    : req.status === "Returned"
                                    ? "bg-amber-100 text-amber-800"
                                    : req.status === "Rejected"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setReportTargetRecord(req);
                                    setPreviewReportOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                  title="Preview Report"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenView(req)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {req.status === "Approved" && (
                                  <button
                                    onClick={() => handleConvertToPR(req)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                    title="Create Purchase Requisition from this Budget"
                                  >
                                    <ArrowRightCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {req.status !== "Approved" && (
                                  <>
                                    <button
                                      onClick={() => handleOpenEdit(req)}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                      title="Edit Budget"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(req.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : viewMode === "view" && activeRequisition ? (
            /* View Details Mode */
            <div className="space-y-6">
              {(() => {
                const reqNo = activeRequisition.requisitionNumber || activeRequisition.requisitionId || "MBR";
                const org = activeRequisition.organization || activeRequisition.company || "Pakiza Group";
                const totalBudget = activeRequisition.totalEstimatedBudget ?? activeRequisition.estimatedRequirementValue ?? 0;
                const itemsList = activeRequisition.items || [];
                const auditList = activeRequisition.auditHistory || [];

                return (
                  <>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">
                      {reqNo}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        activeRequisition.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : activeRequisition.status === "Submitted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {activeRequisition.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Month: {activeRequisition.budgetMonth}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Created on {activeRequisition.requisitionDate} • {org} (
                    {activeRequisition.department})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReportTargetRecord(null);
                      setPreviewReportOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition cursor-pointer"
                    title="Preview Standard Report"
                  >
                    <Printer className="w-4 h-4" />
                    Preview Report
                  </button>
                  {activeRequisition.status === "Approved" && (
                    <button
                      onClick={() => handleConvertToPR(activeRequisition)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                      <ArrowRightCircle className="w-4 h-4" />
                      Create PR from Budget
                    </button>
                  )}
                  {activeRequisition.status !== "Approved" && (
                    <button
                      onClick={() => handleOpenEdit(activeRequisition)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Budget
                    </button>
                  )}
                </div>
              </div>

              {/* Tagged Internal Requisitions (View Mode) */}
              {activeRequisition.taggedInternalRequisitions && activeRequisition.taggedInternalRequisitions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-indigo-600" />
                    Tagged Internal Requisitions ({activeRequisition.taggedInternalRequisitions.length})
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                          <th className="py-2 px-3">Internal Requisition ID</th>
                          <th className="py-2 px-3">Approval Date</th>
                          <th className="py-2 px-3">Requested By</th>
                          <th className="py-2 px-3">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeRequisition.taggedInternalRequisitions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-semibold text-indigo-600">{t.mrNumber}</td>
                            <td className="py-2 px-3 text-slate-600">{t.approvedDate || "—"}</td>
                            <td className="py-2 px-3 font-medium text-slate-800">{t.requestedBy}</td>
                            <td className="py-2 px-3 text-slate-600">{t.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Items Table with Issue ID & PR ID */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Estimated Material Requirements & Tracking ({itemsList.length} items)
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs min-w-[850px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3 w-10">#</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Item Name</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Specification</th>
                        <th className="py-2.5 px-3 w-28">Brand</th>
                        <th className="py-2.5 px-3 w-28">Origin</th>
                        <th className="py-2.5 px-3 w-20">UOM</th>
                        <th className="py-2.5 px-3 text-right w-24">Est. Req Qty</th>
                        <th className="py-2.5 px-3 text-center bg-indigo-50/50 w-28">Issue ID</th>
                        <th className="py-2.5 px-3 text-center bg-indigo-50/50 w-28">PR ID</th>
                        <th className="py-2.5 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsList.map((item, idx) => {
                        const qty = item.estimatedQuantity ?? 1;

                        return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3 text-slate-400 font-medium">{idx + 1}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{item.itemName}</td>
                          <td className="py-3 px-3 text-slate-600">{item.specification || (item as any).specifications || "—"}</td>
                          <td className="py-3 px-3 text-slate-600">{item.brand || "Standard OEM"}</td>
                          <td className="py-3 px-3 text-slate-600">{item.origin || "Imported"}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">{item.uom}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {qty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center bg-indigo-50/30">
                            {item.issueId ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                {item.issueId}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Not issued yet</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center bg-indigo-50/30">
                            {item.prId ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                                {item.prId}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Not in PR yet</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{item.remarks || "—"}</td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks & Purpose (Audit Trail Hidden as per requirement) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Remarks & Purpose
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {activeRequisition.remarks || "No additional remarks specified."}
                </p>
              </div>
                  </>
                );
              })()}
            </div>
          ) : (
            /* Create / Edit Form */
            <div className="space-y-6">
              {/* Form Header */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  {viewMode === "create" ? "Create Monthly Budget Requisition" : "Edit Monthly Budget Requisition"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Requisition Date*</label>
                    <input
                      type="date"
                      value={formData.requisitionDate}
                      onChange={(e) => setFormData({ ...formData, requisitionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Budget Month* (YYYY-MM)</label>
                    <input
                      type="month"
                      value={formData.budgetMonth}
                      onChange={(e) => setFormData({ ...formData, budgetMonth: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-indigo-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department*</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={formData.department}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-600 rounded-lg cursor-not-allowed outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <span className="inline-block w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700">
                      {formData.status}
                    </span>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Remarks & Operational Notes</label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="e.g. Spares requirement"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tag Approved Internal Requisitions Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-indigo-600" />
                      Tag Approved Internal Requisitions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Attach approved store/material requisitions into this monthly budget allocation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTagSearchQuery("");
                      setSelectedTagIds([]);
                      setTagModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Tag
                  </button>
                </div>

                {formData.taggedInternalRequisitions && formData.taggedInternalRequisitions.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Internal Requisition ID</th>
                          <th className="py-2.5 px-3">Approval Date</th>
                          <th className="py-2.5 px-3">Requested By</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formData.taggedInternalRequisitions.map((tagReq) => (
                          <tr key={tagReq.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-2 px-3 font-semibold text-indigo-600">{tagReq.mrNumber}</td>
                            <td className="py-2 px-3 text-slate-600">{tagReq.approvedDate || "—"}</td>
                            <td className="py-2 px-3 font-medium text-slate-800">{tagReq.requestedBy}</td>
                            <td className="py-2 px-3 text-slate-600">{tagReq.department}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    taggedInternalRequisitions: (prev.taggedInternalRequisitions || []).filter(
                                      (t) => t.id !== tagReq.id
                                    ),
                                  }));
                                  toast.success(`Removed tag for ${tagReq.mrNumber}`);
                                }}
                                className="p-1 hover:bg-red-50 text-red-600 rounded transition cursor-pointer"
                                title="Remove Tag"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                    <p className="text-xs text-slate-500">
                      No internal requisitions tagged. Click <strong className="text-indigo-600 font-semibold">Tag</strong> above to link approved requisitions.
                    </p>
                  </div>
                )}
              </div>

              {/* Items Estimation Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Monthly Estimated Item Requirements
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Item Name is selectable via search only. Specification, Brand, and Origin are automatically populated.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs min-w-[900px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3 w-8">#</th>
                        <th className="py-2.5 px-3 min-w-[240px]">Item Name</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Specification</th>
                        <th className="py-2.5 px-3 min-w-[110px]">Brand</th>
                        <th className="py-2.5 px-3 min-w-[110px]">Origin</th>
                        <th className="py-2.5 px-3 min-w-[80px]">UOM</th>
                        <th className="py-2.5 px-3 min-w-[100px] text-right">Est. Req Qty*</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center bg-indigo-50/40">Issue ID</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center bg-indigo-50/40">PR ID</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Remarks</th>
                        <th className="py-2.5 px-3 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={item.itemName ? `${item.itemName} (${item.itemCode || "—"})` : ""}
                                placeholder="Search Item..."
                                onClick={() => {
                                  setItemSearchRowIndex(idx);
                                  setItemSearchQuery("");
                                  setItemSearchOpen(true);
                                }}
                                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 cursor-pointer hover:bg-slate-200/70 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setItemSearchRowIndex(idx);
                                  setItemSearchQuery("");
                                  setItemSearchOpen(true);
                                }}
                                className="p-2 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition shrink-0 cursor-pointer shadow-2xs"
                                title="Search Item Catalog (Search Only)"
                              >
                                <Search className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.specification || ""}
                              placeholder="—"
                              className="w-full text-xs border border-slate-200 bg-slate-100 text-slate-600 rounded px-2 py-1.5 cursor-not-allowed font-medium outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.brand || ""}
                              placeholder="—"
                              className="w-full text-xs border border-slate-200 bg-slate-100 text-slate-600 rounded px-2 py-1.5 cursor-not-allowed font-medium outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.origin || ""}
                              placeholder="—"
                              className="w-full text-xs border border-slate-200 bg-slate-100 text-slate-600 rounded px-2 py-1.5 cursor-not-allowed font-medium outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.uom}
                              placeholder="UOM"
                              className="w-full text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded px-2 py-1.5 cursor-not-allowed font-medium"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              min="1"
                              value={item.estimatedQuantity}
                              onChange={(e) =>
                                handleItemChange(idx, "estimatedQuantity", Number(e.target.value))
                              }
                              className="w-20 text-xs border border-slate-200 rounded px-2 py-1.5 text-right font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center bg-indigo-50/20">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.issueId || ""}
                              placeholder="Auto Generated"
                              className="w-28 text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded px-2 py-1 text-center cursor-not-allowed font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center bg-indigo-50/20">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={item.prId || ""}
                              placeholder="Auto Generated"
                              className="w-28 text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded px-2 py-1 text-center cursor-not-allowed font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.remarks || ""}
                              onChange={(e) => handleItemChange(idx, "remarks", e.target.value)}
                              placeholder="Notes"
                              className="w-full text-xs border border-slate-200 rounded px-2 py-1.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Required Quantity Display Below Table */}
                <div className="p-3.5 bg-indigo-50/50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-slate-500 font-medium">
                    Total Line Items: <strong className="text-slate-800">{formData.items.length}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Total Required Quantity:</span>
                    <span className="font-bold text-sm text-indigo-700 bg-white border border-indigo-200 px-3 py-1 rounded-lg shadow-2xs font-mono">
                      {formData.items
                        .reduce((sum, item) => sum + (Number(item.estimatedQuantity) || 0), 0)
                        .toLocaleString()}{" "}
                      Units
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReportTargetRecord(null);
                    setPreviewReportOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Preview Report
                </button>
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit for Approval
                </button>
              </div>
            </div>
          )}

          {/* ITEM SEARCH MODAL */}
          {itemSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <Search className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Select Item for Budget Requisition</h2>
                      <p className="text-xs text-slate-500">Search and select item code, name, specification, brand, origin, and UOM</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setItemSearchOpen(false);
                      setItemSearchRowIndex(null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-slate-200 bg-slate-50/60">
                  <div className="relative">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={itemSearchQuery}
                      onChange={(e) => setItemSearchQuery(e.target.value)}
                      placeholder="Search by Item Code, Name, Specification, Brand, Origin, UOM..."
                      className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:border-indigo-500 outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="rounded-xl border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
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
                      <tbody className="divide-y divide-slate-100">
                        {filteredMasterItems.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                              No items match &quot;{itemSearchQuery}&quot;
                            </td>
                          </tr>
                        ) : (
                          filteredMasterItems.map((im) => (
                            <tr key={im.id} className="hover:bg-slate-50 transition">
                              <td className="py-2 px-3 font-mono font-bold text-indigo-600">{im.itemCode}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{im.itemName}</td>
                              <td className="py-2 px-3 text-slate-600">{im.specification || im.description || "—"}</td>
                              <td className="py-2 px-3 text-slate-600">{im.brand || "Standard OEM"}</td>
                              <td className="py-2 px-3 text-slate-600">{im.origin || "Imported"}</td>
                              <td className="py-2 px-3 font-mono font-bold">{im.stockUOM || im.stockUom || im.purchaseUOM || "Pcs"}</td>
                              <td className="py-2 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleSelectItemFromModal(im)}
                                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                                >
                                  Select
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-indigo-50/50 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Matching Items Found: <strong>{filteredMasterItems.length}</strong>
                    </span>
                    <span className="text-slate-500 italic">
                      Click &quot;Select&quot; to populate item details into row
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Duplicate Item Alert Modal */}
      {duplicateAlertItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-200 max-w-md w-full p-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Duplicate Item Detected</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The item <strong className="text-rose-700 font-semibold">&ldquo;{duplicateAlertItem}&rdquo;</strong> has already been added to this Monthly Budget Requisition.
                </p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Each item may only be added once per requisition. You can adjust the estimated quantity on the existing item line if more units are needed.
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDuplicateAlertItem(null)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Close & Keep Existing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tag Approved Internal Requisitions */}
      {tagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Tag Approved Internal Requisitions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select one or more approved internal requisitions to attach to this monthly budget.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTagModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter & Multi-select header */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder="Search by ID, Requester, or Department..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                disabled={selectedTagIds.length === 0}
                onClick={handleConfirmBatchTag}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition shadow-xs cursor-pointer shrink-0"
              >
                Tag Selected ({selectedTagIds.length})
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 p-3">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={filteredApprovedReqs.length > 0 && selectedTagIds.length === filteredApprovedReqs.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTagIds(filteredApprovedReqs.map((r) => r.id));
                          } else {
                            setSelectedTagIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="py-2.5 px-3">Internal Requisition ID</th>
                    <th className="py-2.5 px-3">Approval Date</th>
                    <th className="py-2.5 px-3">Requested By</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApprovedReqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No approved internal requisitions found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApprovedReqs.map((req) => {
                      const isTagged = (formData.taggedInternalRequisitions || []).some(
                        (t) => t.id === req.id || t.mrNumber === req.mrNumber
                      );
                      const isChecked = selectedTagIds.includes(req.id);

                      return (
                        <tr key={req.id} className={`hover:bg-slate-50 transition ${isTagged ? "bg-slate-50/70" : ""}`}>
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              disabled={isTagged}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTagIds((prev) => [...prev, req.id]);
                                } else {
                                  setSelectedTagIds((prev) => prev.filter((id) => id !== req.id));
                                }
                              }}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                            />
                          </td>
                          <td className="py-2 px-3 font-semibold text-indigo-600">{req.mrNumber}</td>
                          <td className="py-2 px-3 text-slate-600">{req.approvedDate || req.requisitionDate || "—"}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">{req.requestedBy}</td>
                          <td className="py-2 px-3 text-slate-600">{req.department}</td>
                          <td className="py-2 px-3 text-right">
                            {isTagged ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Tagged
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleTagSingle(req)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition cursor-pointer"
                              >
                                Tag
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Total Approved Available: {filteredApprovedReqs.length}</span>
              <button
                type="button"
                onClick={() => setTagModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
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
        onClose={() => {
          setPreviewReportOpen(false);
          setReportTargetRecord(null);
        }}
        data={budgetReportData}
      />
    </div>
  );
}
