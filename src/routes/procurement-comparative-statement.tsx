import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import { toast } from "sonner";
import {
  Scale,
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
  DollarSign,
  Award,
  Users,
  FileText,
  FileCheck,
  ShoppingCart,
  Briefcase,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Percent,
} from "lucide-react";
import {
  ComparativeStatement,
  CSSupplierQuote,
  CSItemQuote,
  CSTechnicalScorecard,
  getStoredComparativeStatements,
  setStoredComparativeStatements,
  getStoredPurchaseRequisitions,
  PurchaseRequisition,
  computeLowestPrice,
  calculateSupplierSummary,
  generateId,
} from "@/lib/procurement-requisition-data";
import {
  getStoredData,
  SupplierVendorMaster,
  DEFAULT_SUPPLIERS,
  WarehouseStore,
  DEFAULT_WAREHOUSES,
  PaymentTermsMaster,
  DEFAULT_PAYMENT_TERMS,
} from "@/lib/procurement-master-data";
import { employeesData } from "@/routes/personnel-list";

interface CSSearch {
  action?: "list" | "create" | "edit" | "view";
  id?: string;
  print?: boolean;
}

export const Route = createFileRoute("/procurement-comparative-statement")({
  validateSearch: (search: Record<string, unknown>): CSSearch => {
    return {
      action: search.action as any,
      id: search.id as string | undefined,
      print: search.print ? true : undefined,
    };
  },
  component: ComparativeStatementPage,
});

export default function ComparativeStatementPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [statements, setStatements] = useState<ComparativeStatement[]>([]);
  const [prs, setPrs] = useState<PurchaseRequisition[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierVendorMaster[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseStore[]>([]);
  const [paymentTermsList, setPaymentTermsList] = useState<PaymentTermsMaster[]>([]);

  const [viewMode, setViewMode] = useState<"list" | "create" | "edit" | "view">(
    search.action || "list"
  );
  const [activeCsId, setActiveCsId] = useState<string | null>(search.id || null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [procurementTypeFilter, setProcurementTypeFilter] = useState<string>("All");

  // Load datasets
  useEffect(() => {
    setStatements(getStoredComparativeStatements());
    setPrs(getStoredPurchaseRequisitions());
    setSuppliers(getStoredData("cripton_master_supplier_vendor", DEFAULT_SUPPLIERS));
    setWarehouses(getStoredData("cripton_master_warehouses", DEFAULT_WAREHOUSES));
    setPaymentTermsList(getStoredData("cripton_master_payment_terms", DEFAULT_PAYMENT_TERMS));
  }, []);

  // Sync route query
  useEffect(() => {
    if (search.action) setViewMode(search.action);
    if (search.id) setActiveCsId(search.id);
  }, [search.action, search.id]);

  // Form State
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [prSearchQuery, setPrSearchQuery] = useState("");
  const [awardMode, setAwardMode] = useState<"single" | "multiple">("multiple");

  type CSFormData = Omit<ComparativeStatement, "id"> & {
    items: CSItemQuote[];
    technicalScorecards: CSTechnicalScorecard[];
    linkedPRs: Array<{
      prId: string;
      prNumber: string;
      prDate: string;
      department?: string;
      requester?: string;
      totalEstimatedCost?: number;
    }>;
    approvalWorkflow: any[];
    auditHistory: any[];
  };

  const [formData, setFormData] = useState<CSFormData>({
    csNumber: "",
    csDate: new Date().toISOString().split("T")[0],
    organization: "Pakiza Knit Composite Ltd.",
    department: "Procurement & Commercial",
    preparedBy: "Md. Karim Ullah",
    currency: "BDT",
    exchangeRate: 1.0,
    procurementType: "Goods",
    prId: "",
    prNumber: "",
    prDate: "",
    prRequester: "",
    deliveryWarehouse: "",
    requiredByDate: "",
    prTotalEstimatedCost: 0,
    linkedPRs: [],
    suppliers: [],
    items: [],
    technicalScorecards: [],
    recommendedSupplierId: "",
    recommendedSupplierName: "",
    recommendationJustification: "",
    negotiationNotes: "",
    originalLowestTotal: 0,
    negotiatedTotal: 0,
    estimatedSavings: 0,
    status: "Draft",
    approvalWorkflow: [],
    attachments: [],
    auditHistory: [],
  });

  const activeCS = useMemo(() => {
    return statements.find((s) => s.id === activeCsId) || null;
  }, [statements, activeCsId]);

  // Approved PRs available for CS creation
  const approvedPRs = useMemo(() => {
    return prs.filter((p) => p.status === "Approved" || p.status === "Pending Approval");
  }, [prs]);

  // Compute breakdown of items grouped by assigned supplier
  const supplierAwardGroups = useMemo(() => {
    const map: Record<
      string,
      { supplierId: string; supplierName: string; items: CSItemQuote[]; totalAmount: number }
    > = {};

    formData.items.forEach((it) => {
      const sId =
        it.assignedSupplierId ||
        formData.recommendedSupplierId ||
        formData.suppliers[0]?.supplierId ||
        "unassigned";
      const sName =
        it.assignedSupplierName ||
        formData.suppliers.find((s) => s.supplierId === sId)?.supplierName ||
        "Default Supplier";
      const quote = it.quotes?.[sId];
      const itemTotal =
        typeof quote?.unitPrice === "number"
          ? quote.unitPrice * it.quantity
          : it.estimatedTotalPrice;

      if (!map[sId]) {
        map[sId] = { supplierId: sId, supplierName: sName, items: [], totalAmount: 0 };
      }
      map[sId].items.push(it);
      map[sId].totalAmount += itemTotal;
    });

    return Object.values(map);
  }, [formData.items, formData.suppliers, formData.recommendedSupplierId]);

  // View mode breakdown of items grouped by assigned supplier
  const viewAwardGroups = useMemo(() => {
    if (!activeCS) return [];
    const map: Record<
      string,
      { supplierId: string; supplierName: string; items: CSItemQuote[]; totalAmount: number }
    > = {};

    (activeCS.items || []).forEach((it) => {
      const sId =
        it.assignedSupplierId ||
        activeCS.recommendedSupplierId ||
        activeCS.suppliers?.[0]?.supplierId ||
        "unassigned";
      const sName =
        it.assignedSupplierName ||
        activeCS.suppliers?.find((s: any) => s.supplierId === sId)?.supplierName ||
        "Awarded Supplier";
      const quote = it.quotes?.[sId];
      const itemTotal =
        typeof quote?.unitPrice === "number"
          ? quote.unitPrice * it.quantity
          : it.estimatedTotalPrice;

      if (!map[sId]) {
        map[sId] = { supplierId: sId, supplierName: sName, items: [], totalAmount: 0 };
      }
      map[sId].items.push(it);
      map[sId].totalAmount += itemTotal;
    });

    return Object.values(map);
  }, [activeCS]);

  // Open Create Form
  const handleOpenCreate = () => {
    const nextSeq = String(statements.length + 1).padStart(3, "0");
    const csNumber = `CS-${new Date().getFullYear()}-${nextSeq}`;

    // Select default PR if available
    const defaultPR = approvedPRs[0] || prs[0];
    const defaultSuppliers = suppliers.slice(0, 3);

    const initialSuppliers: CSSupplierQuote[] = defaultSuppliers.map((s, idx) => ({
      supplierId: s.id,
      supplierName: s.supplierName || "",
      supplierCode: s.vendorCode || `VEN-${idx + 1}`,
      quotationRef: `QT-${(s.supplierName || "SUP").split(" ")[0].toUpperCase()}-001`,
      quotationDate: new Date().toISOString().split("T")[0],
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      paymentTerms: "30 Days Credit",
      deliveryTerms: "Ex-Factory",
      deliveryLeadDays: 14 + idx * 7,
      warranty: "1 Year Official OEM Warranty",
      grossAmount: 0,
      discountAmount: 0,
      netQuotedAmount: 0,
      vatPercentage: 5,
      vatAmount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      otherCharges: 0,
      finalPayableAmount: 0,
      rank: idx + 1,
    }));

    const initialLinkedPRs = defaultPR
      ? [
          {
            prId: defaultPR.id,
            prNumber: defaultPR.prNumber,
            prDate: defaultPR.prDate,
            department: defaultPR.department,
            requester: defaultPR.requesterName || (defaultPR as any).requestedBy || "Requester",
            totalEstimatedCost:
              defaultPR.totalEstimatedCost || (defaultPR as any).totalEstimatedAmount || 0,
            itemsCount: defaultPR.items?.length || 0,
          },
        ]
      : [];

    const initialItems: CSItemQuote[] = defaultPR
      ? defaultPR.items.map((pi, pIdx) => {
          const quotes: Record<
            string,
            {
              unitPrice: number | null | "NA";
              totalPrice: number;
              deliveryDays?: number;
              compliance: "Compliant" | "Partial" | "Non-Compliant";
              remarks?: string;
            }
          > = {};
          defaultSuppliers.forEach((s, idx) => {
            const up = pi.estimatedUnitPrice * (idx === 0 ? 0.95 : idx === 1 ? 1.02 : 0.98);
            quotes[s.id] = {
              unitPrice: up,
              totalPrice: up * (pi.requestedQuantity || pi.requiredQuantity || 1),
              deliveryDays: 14 + idx * 7,
              compliance: "Compliant",
              remarks: "Fully matching specification",
            };
          });

          // Alternate initial assigned supplier for demonstration of multi-supplier capability
          const assignedSup = defaultSuppliers[pIdx % defaultSuppliers.length] || defaultSuppliers[0];

          return {
            id: generateId(),
            prItemId: pi.id,
            prNumber: defaultPR.prNumber,
            prId: defaultPR.id,
            itemCode: pi.itemCode,
            itemName: pi.itemName,
            specification: pi.specification || "",
            brand: pi.brand || "OEM",
            origin: pi.origin || "Imported",
            uom: pi.uom,
            quantity: pi.requestedQuantity || pi.requiredQuantity || 1,
            estimatedUnitPrice: pi.estimatedUnitPrice,
            estimatedTotalPrice:
              pi.totalEstimatedPrice ||
              (pi.requestedQuantity || pi.requiredQuantity || 1) * pi.estimatedUnitPrice,
            assignedSupplierId: assignedSup?.id || "",
            assignedSupplierName: assignedSup?.supplierName || "",
            quotes,
          };
        })
      : [];

    const initialScorecards: CSTechnicalScorecard[] = defaultSuppliers.map((s) => ({
      supplierId: s.id,
      supplierName: s.supplierName || "",
      specsCompliance: "Pass",
      deliveryCapabilityScore: 90,
      warrantyScore: 85,
      pastPerformanceRating: 4.5,
      overallScore: 88,
      qualificationStatus: "Qualified",
      evaluatorRemarks: "Reputed vendor with strong track record.",
    }));

    // Recalculate supplier totals
    const evaluatedSuppliers = initialSuppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, initialItems, s);
      return { ...s, ...summary };
    });

    const initialEstTotal = defaultPR?.totalEstimatedCost || (defaultPR as any)?.totalEstimatedAmount || 0;

    setFormData({
      csNumber,
      csDate: new Date().toISOString().split("T")[0],
      organization: defaultPR ? defaultPR.organization : "Pakiza Knit Composite Ltd.",
      department: "Procurement & Commercial",
      preparedBy: "Md. Karim Ullah",
      currency: "BDT",
      exchangeRate: 1.0,
      procurementType: "Goods",
      prId: defaultPR?.id || "",
      prNumber: defaultPR?.prNumber || "",
      prDate: defaultPR?.prDate || "",
      prRequester: defaultPR?.requesterName || "",
      deliveryWarehouse: defaultPR?.warehouseName || "",
      requiredByDate: defaultPR?.requiredByDate || "",
      prTotalEstimatedCost: initialEstTotal,
      linkedPRs: initialLinkedPRs,
      suppliers: evaluatedSuppliers,
      items: initialItems,
      technicalScorecards: initialScorecards,
      recommendedSupplierId: evaluatedSuppliers[0]?.supplierId || "",
      recommendedSupplierName: evaluatedSuppliers[0]?.supplierName || "",
      recommendationJustification:
        "Multi-supplier evaluation conducted. Items assigned to best compliant responsive bidders.",
      negotiationNotes: "Negotiated additional cash rebates upon direct delivery.",
      originalLowestTotal: evaluatedSuppliers[0]?.finalPayableAmount || 0,
      negotiatedTotal: (evaluatedSuppliers[0]?.finalPayableAmount || 0) * 0.97,
      estimatedSavings: initialEstTotal - (evaluatedSuppliers[0]?.finalPayableAmount || 0) * 0.97,
      status: "Draft",
      approvalWorkflow: [
        {
          stageNumber: 1,
          stageName: "Procurement Officer",
          role: "Procurement Specialist",
          status: "Pending",
          assignedTo: "Md. Karim Ullah",
        },
        {
          stageNumber: 2,
          stageName: "Head of Procurement",
          role: "Procurement Head",
          status: "Pending",
          assignedTo: "Khandakar S. Ahmed",
        },
        {
          stageNumber: 3,
          stageName: "Finance & Accounts Head",
          role: "CFO / Finance Controller",
          status: "Pending",
          assignedTo: "Tanvir Rahman, FCA",
        },
        {
          stageNumber: 4,
          stageName: "Managing Director / Purchase Committee",
          role: "Executive Authority",
          status: "Pending",
          assignedTo: "Director Operations",
        },
      ],
      attachments: [
        {
          id: generateId(),
          fileName: "Supplier_Quotations_Consolidated.pdf",
          fileSize: "2.8 MB",
          uploadedAt: new Date().toISOString().split("T")[0],
          uploadedBy: "Md. Karim Ullah",
        },
      ],
      auditHistory: [
        {
          action: "Comparative Statement Draft Created",
          date: new Date().toISOString().replace("T", " ").substring(0, 19),
          user: "Md. Karim Ullah",
        },
      ],
    });

    setActiveCsId(null);
    setViewMode("create");
    navigate({ to: "/procurement-comparative-statement", search: { action: "create" } });
  };

  const handleOpenEdit = (cs: ComparativeStatement) => {
    if (cs.status === "Approved") {
      toast.error("Approved CS cannot be edited directly.");
      return;
    }

    const linkedPRs =
      cs.linkedPRs && cs.linkedPRs.length > 0
        ? cs.linkedPRs
        : cs.prNumber
        ? [
            {
              prId: cs.prId || "pr-2026-001",
              prNumber: cs.prNumber,
              prDate: cs.prDate || "2026-09-20",
              department: cs.department || "General",
              requester: cs.prRequester || "Requester",
              totalEstimatedCost: cs.prTotalEstimatedCost || 0,
              itemsCount: cs.items?.length || 0,
            },
          ]
        : [];

    setFormData({
      ...cs,
      linkedPRs,
      technicalScorecards: cs.technicalScorecards || [],
      approvalWorkflow: cs.approvalWorkflow || [],
      auditHistory: cs.auditHistory || [],
      items: (cs.items || []).map((it) => ({
        ...it,
        assignedSupplierId:
          it.assignedSupplierId || cs.recommendedSupplierId || cs.suppliers?.[0]?.supplierId || "",
        assignedSupplierName:
          it.assignedSupplierName ||
          cs.recommendedSupplierName ||
          cs.suppliers?.[0]?.supplierName ||
          "",
      })),
    });
    setActiveCsId(cs.id);
    setViewMode("edit");
    navigate({ to: "/procurement-comparative-statement", search: { action: "edit", id: cs.id } });
  };

  const handleOpenView = (cs: ComparativeStatement) => {
    setActiveCsId(cs.id);
    setViewMode("view");
    navigate({ to: "/procurement-comparative-statement", search: { action: "view", id: cs.id } });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setActiveCsId(null);
    navigate({ to: "/procurement-comparative-statement", search: { action: "list" } });
  };

  // Tag a new PR into CS (Multiple PRs consolidation)
  const handleTagPR = (pr: PurchaseRequisition) => {
    const currentLinked = formData.linkedPRs || [];
    if (currentLinked.some((p) => p.prId === pr.id)) {
      toast.error(`PR ${pr.prNumber} is already linked to this CS.`);
      return;
    }

    const newLinkedItem = {
      prId: pr.id,
      prNumber: pr.prNumber,
      prDate: pr.prDate,
      department: pr.department,
      requester: pr.requesterName || (pr as any).requestedBy || "Requester",
      totalEstimatedCost: pr.totalEstimatedCost || (pr as any).totalEstimatedAmount || 0,
      itemsCount: pr.items?.length || 0,
    };

    const updatedLinked = [...currentLinked, newLinkedItem];

    // Append items from this PR with quote placeholders for existing CS suppliers
    const newItems: CSItemQuote[] = pr.items.map((pi, pIdx) => {
      const quotes: Record<string, any> = {};
      formData.suppliers.forEach((s, idx) => {
        const up = pi.estimatedUnitPrice * (idx === 0 ? 0.95 : idx === 1 ? 1.02 : 0.98);
        quotes[s.supplierId] = {
          unitPrice: up,
          totalPrice: up * (pi.requestedQuantity || pi.requiredQuantity || 1),
          deliveryDays: s.deliveryLeadDays || 14,
          compliance: "Compliant",
          remarks: "Matches PR specification",
        };
      });

      const assignedSup =
        formData.suppliers[pIdx % (formData.suppliers.length || 1)] || formData.suppliers[0];

      return {
        id: generateId(),
        prItemId: pi.id,
        prNumber: pr.prNumber,
        prId: pr.id,
        itemCode: pi.itemCode,
        itemName: pi.itemName,
        specification: pi.specification || "",
        brand: pi.brand || "OEM",
        origin: pi.origin || "Imported",
        uom: pi.uom,
        quantity: pi.requestedQuantity || pi.requiredQuantity || 1,
        estimatedUnitPrice: pi.estimatedUnitPrice,
        estimatedTotalPrice:
          pi.totalEstimatedPrice ||
          (pi.requestedQuantity || pi.requiredQuantity || 1) * pi.estimatedUnitPrice,
        assignedSupplierId: assignedSup?.supplierId || "",
        assignedSupplierName: assignedSup?.supplierName || "",
        quotes,
      };
    });

    const consolidatedItems = [...formData.items, ...newItems];

    // Recalculate supplier totals
    const evaluatedSuppliers = formData.suppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, consolidatedItems, s);
      return { ...s, ...summary };
    });

    const totalEst = updatedLinked.reduce((sum, p) => sum + (p.totalEstimatedCost || 0), 0);
    const prNums = updatedLinked.map((p) => p.prNumber).join(", ");

    setFormData((prev) => ({
      ...prev,
      linkedPRs: updatedLinked,
      prNumber: prNums,
      prId: updatedLinked[0]?.prId || "",
      prTotalEstimatedCost: totalEst,
      items: consolidatedItems,
      suppliers: evaluatedSuppliers,
    }));

    toast.success(`Tagged PR ${pr.prNumber} and consolidated ${newItems.length} items.`);
    setPrModalOpen(false);
  };

  // Untag a PR from CS
  const handleUntagPR = (prId: string) => {
    const currentLinked = formData.linkedPRs || [];
    if (currentLinked.length <= 1) {
      toast.error("At least one Purchase Requisition must remain linked to the Comparative Statement.");
      return;
    }

    const updatedLinked = currentLinked.filter((p) => p.prId !== prId);
    const remainingItems = formData.items.filter((it) => it.prId !== prId);

    const evaluatedSuppliers = formData.suppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, remainingItems, s);
      return { ...s, ...summary };
    });

    const totalEst = updatedLinked.reduce((sum, p) => sum + (p.totalEstimatedCost || 0), 0);
    const prNums = updatedLinked.map((p) => p.prNumber).join(", ");

    setFormData((prev) => ({
      ...prev,
      linkedPRs: updatedLinked,
      prNumber: prNums,
      prId: updatedLinked[0]?.prId || "",
      prTotalEstimatedCost: totalEst,
      items: remainingItems,
      suppliers: evaluatedSuppliers,
    }));

    toast.info("PR untagged from Comparative Statement.");
  };

  // Assign individual item to a specific supplier (Multi-Supplier selection)
  const handleAssignItemSupplier = (itemId: string, supplierId: string) => {
    const sup = formData.suppliers.find((s) => s.supplierId === supplierId);
    const updatedItems = formData.items.map((it) => {
      if (it.id !== itemId) return it;
      return {
        ...it,
        assignedSupplierId: supplierId,
        assignedSupplierName: sup?.supplierName || "",
      };
    });

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Add Supplier to CS
  const handleAddSupplier = (supplierId: string) => {
    const master = suppliers.find((s) => s.id === supplierId);
    if (!master) return;
    if (formData.suppliers.some((s) => s.supplierId === supplierId)) {
      toast.error("This supplier is already added to the comparative statement.");
      return;
    }

    const newQuote: CSSupplierQuote = {
      supplierId: master.id,
      supplierName: master.supplierName || "",
      supplierCode: master.vendorCode || "VEN",
      quotationRef: `QT-${(master.supplierName || "SUP").substring(0, 4).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      quotationDate: new Date().toISOString().split("T")[0],
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      paymentTerms: (master as any).paymentTerms || "30 Days Credit",
      deliveryTerms: "Ex-Factory",
      deliveryLeadDays: 14,
      warranty: "1 Year Standard",
      grossAmount: 0,
      discountAmount: 0,
      netQuotedAmount: 0,
      vatPercentage: 5,
      vatAmount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      otherCharges: 0,
      finalPayableAmount: 0,
      rank: formData.suppliers.length + 1,
    };

    // Update items matrix to include blank quote for this supplier
    const updatedItems = formData.items.map((item) => ({
      ...item,
      quotes: {
        ...item.quotes,
        [supplierId]: {
          unitPrice: null, // Blank initially
          totalPrice: 0,
          deliveryDays: 14,
          compliance: "Compliant" as const,
          remarks: "",
        },
      },
    }));

    // Add Scorecard
    const newScorecard: CSTechnicalScorecard = {
      supplierId: master.id,
      supplierName: master.supplierName || "",
      specsCompliance: "Pass",
      deliveryCapabilityScore: 85,
      warrantyScore: 80,
      pastPerformanceRating: 4.0,
      overallScore: 83,
      qualificationStatus: "Pending Evaluation",
      evaluatorRemarks: "Quotation under review",
    };

    const updatedSuppliers = [...formData.suppliers, newQuote];
    const evaluatedSuppliers = updatedSuppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, updatedItems, s);
      return { ...s, ...summary };
    });

    setFormData((prev) => ({
      ...prev,
      suppliers: evaluatedSuppliers,
      items: updatedItems,
      technicalScorecards: [...prev.technicalScorecards, newScorecard],
    }));
    toast.success(`Added ${master.supplierName} to comparison!`);
  };

  // Remove Supplier
  const handleRemoveSupplier = (supplierId: string) => {
    if (formData.suppliers.length <= 1) {
      toast.error("Comparative Statement must contain at least 1 supplier.");
      return;
    }
    const updatedSuppliers = formData.suppliers.filter((s) => s.supplierId !== supplierId);
    const updatedScorecards = formData.technicalScorecards.filter(
      (sc) => sc.supplierId !== supplierId
    );
    const updatedItems = formData.items.map((item) => {
      const newQuotes = { ...item.quotes };
      delete newQuotes[supplierId];
      return { ...item, quotes: newQuotes };
    });

    // Re-evaluate
    const evaluatedSuppliers = updatedSuppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, updatedItems, s);
      return { ...s, ...summary };
    });

    setFormData((prev) => ({
      ...prev,
      suppliers: evaluatedSuppliers,
      items: updatedItems,
      technicalScorecards: updatedScorecards,
      recommendedSupplierId:
        prev.recommendedSupplierId === supplierId
          ? evaluatedSuppliers[0]?.supplierId || ""
          : prev.recommendedSupplierId,
      recommendedSupplierName:
        prev.recommendedSupplierId === supplierId
          ? evaluatedSuppliers[0]?.supplierName || ""
          : prev.recommendedSupplierName,
    }));
  };

  // Modify Quoted Price for an Item + Supplier
  const handlePriceChange = (
    itemId: string,
    supplierId: string,
    rawValue: string
  ) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id !== itemId) return item;

      let parsedPrice: number | null | "NA" = null;
      const cleanVal = rawValue.trim();

      if (cleanVal === "" || cleanVal === "blank") {
        parsedPrice = null;
      } else if (cleanVal.toUpperCase() === "NA" || cleanVal.toUpperCase() === "N/A") {
        parsedPrice = "NA";
      } else {
        const num = parseFloat(cleanVal);
        parsedPrice = isNaN(num) ? null : num;
      }

      const existingQuote = item.quotes[supplierId] || {
        unitPrice: null,
        totalPrice: 0,
        deliveryDays: 14,
        compliance: "Compliant" as const,
        remarks: "",
      };

      const totalPrice =
        typeof parsedPrice === "number" ? parsedPrice * item.quantity : 0;

      return {
        ...item,
        quotes: {
          ...item.quotes,
          [supplierId]: {
            ...existingQuote,
            unitPrice: parsedPrice,
            totalPrice,
          },
        },
      };
    });

    // Re-evaluate supplier summaries
    const evaluatedSuppliers = formData.suppliers.map((s) => {
      const summary = calculateSupplierSummary(s.supplierId, updatedItems, s);
      return { ...s, ...summary };
    });

    // Rank suppliers by lowest final amount
    const rankedSuppliers = [...evaluatedSuppliers].sort(
      (a, b) => a.finalPayableAmount - b.finalPayableAmount
    );
    const finalSuppliers = evaluatedSuppliers.map((s) => {
      const rankIdx = rankedSuppliers.findIndex((rs) => rs.supplierId === s.supplierId);
      return { ...s, rank: rankIdx + 1 };
    });

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      suppliers: finalSuppliers,
    }));
  };

  // Modify Supplier Financial Charges (Discount, VAT %, Tax %, Other Charges)
  const handleSupplierChargeChange = (
    supplierId: string,
    field: keyof CSSupplierQuote,
    val: any
  ) => {
    const updatedSuppliers = formData.suppliers.map((s) => {
      if (s.supplierId !== supplierId) return s;
      const modified = { ...s, [field]: val };
      const summary = calculateSupplierSummary(s.supplierId, formData.items, modified);
      return { ...modified, ...summary };
    });

    setFormData((prev) => ({
      ...prev,
      suppliers: updatedSuppliers,
    }));
  };

  // Modify Scorecard
  const handleScorecardChange = (
    supplierId: string,
    field: keyof CSTechnicalScorecard,
    val: any
  ) => {
    const updated = formData.technicalScorecards.map((sc) => {
      if (sc.supplierId !== supplierId) return sc;
      const modified = { ...sc, [field]: val };

      // Re-calculate overall score & qualification status
      const totalScore = Math.round(
        (Number(modified.deliveryCapabilityScore || 0) +
          Number(modified.warrantyScore || 0) +
          Number(modified.pastPerformanceRating || 0) * 20) /
          3
      );
      modified.overallScore = totalScore;

      if (modified.specsCompliance === "Fail" || totalScore < 50) {
        modified.qualificationStatus = "Disqualified";
      } else if (modified.specsCompliance === "Conditional" || totalScore < 70) {
        modified.qualificationStatus = "Conditionally Qualified";
      } else {
        modified.qualificationStatus = "Qualified";
      }

      return modified;
    });

    setFormData((prev) => ({
      ...prev,
      technicalScorecards: updated,
    }));
  };

  // CS Attachment Handlers
  const handleAddAttachment = () => {
    const nextIdx = (formData.attachments?.length || 0) + 1;
    const newAtt = {
      id: `cs-att-${Date.now()}`,
      documentType: "Supporting Quotation / Technical Sheet",
      documentName: `CS_Vendor_Document_${nextIdx}.pdf`,
      fileName: `CS_Vendor_Document_${nextIdx}.pdf`,
      fileSize: "750 KB",
      uploadedBy: formData.preparedBy || "Md. Karim Ullah",
      uploadedDate: new Date().toISOString().split("T")[0],
      remarks: "Supporting document submitted with Comparative Statement.",
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAtt],
    }));
    toast.success("Document attached to Comparative Statement.");
  };

  const handleRemoveAttachment = (attId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter(
        (a: any) => (a.id || a.documentName || a.fileName) !== attId
      ),
    }));
  };

  // Save / Submit CS
  const handleSave = (submitForApproval: boolean) => {
    if (!formData.csNumber.trim()) {
      toast.error("CS number is required.");
      return;
    }
    if (!formData.prNumber?.trim()) {
      toast.error("Please associate an approved PR reference.");
      return;
    }
    if (formData.suppliers.length === 0) {
      toast.error("At least one supplier must be included.");
      return;
    }
    if (!formData.recommendedSupplierId) {
      toast.error("Please designate a recommended supplier.");
      return;
    }

    const newStatus = submitForApproval ? "Under Review" : formData.status || "Draft";
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);

    if (viewMode === "create") {
      const newRecord: ComparativeStatement = {
        ...formData,
        id: generateId(),
        status: newStatus,
        auditHistory: [
          ...(formData.auditHistory || []),
          {
            action: submitForApproval ? "Submitted for Review" : "Draft Created",
            date: now,
            user: formData.preparedBy,
          },
        ],
      };
      const updated = [newRecord, ...statements];
      setStoredComparativeStatements(updated);
      setStatements(updated);
      toast.success(
        submitForApproval
          ? `Comparative Statement ${newRecord.csNumber} submitted for review!`
          : `CS draft saved!`
      );
    } else if (viewMode === "edit" && activeCsId) {
      const updated = statements.map((cs) => {
        if (cs.id !== activeCsId) return cs;
        return {
          ...formData,
          id: activeCsId,
          status: newStatus,
          auditHistory: [
            ...(formData.auditHistory || []),
            {
              action: submitForApproval ? "Submitted for Review" : "Draft Updated",
              date: now,
              user: "Current User",
            },
          ],
        };
      });
      setStoredComparativeStatements(updated);
      setStatements(updated);
      toast.success(
        submitForApproval ? `CS submitted for review!` : `Comparative statement updated!`
      );
    }

    handleBackToList();
  };

  // Quick Approval Action on Review/View
  const handleApproveCS = (csId: string) => {
    const updated = statements.map((cs) => {
      if (cs.id !== csId) return cs;
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const updatedWorkflow = (cs.approvalWorkflow || []).map((w) => ({
        ...w,
        status: "Approved" as const,
        actionDate: now.split(" ")[0],
      }));
      return {
        ...cs,
        status: "Approved" as const,
        approvalWorkflow: updatedWorkflow,
        auditHistory: [
          ...(cs.auditHistory || []),
          {
            action: "Approved by Purchase Committee",
            date: now,
            user: "Authorized Approver",
          },
        ],
      };
    });
    setStoredComparativeStatements(updated);
    setStatements(updated);
    toast.success("Comparative Statement has been approved! PO / WO creation is now enabled.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this Comparative Statement?")) return;
    const updated = statements.filter((s) => s.id !== id);
    setStoredComparativeStatements(updated);
    setStatements(updated);
    toast.success("Comparative statement deleted.");
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return (statements || []).filter((s) => {
      const csNum = s.csNumber || "";
      const prNum = s.prNumber || "";
      const org = s.organization || (s as any).company || "";
      const recSupp = s.recommendedSupplierName || "";
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        csNum.toLowerCase().includes(term) ||
        prNum.toLowerCase().includes(term) ||
        org.toLowerCase().includes(term) ||
        recSupp.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      const matchesType =
        procurementTypeFilter === "All" || s.procurementType === procurementTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [statements, searchTerm, statusFilter, procurementTypeFilter]);

  const counts = useMemo(() => {
    const draft = (statements || []).filter((s) => s.status === "Draft").length;
    const underReview = (statements || []).filter((s) => s.status === "Under Review").length;
    const approved = (statements || []).filter((s) => s.status === "Approved").length;
    const rejected = (statements || []).filter((s) => s.status === "Rejected").length;
    return { draft, underReview, approved, rejected, total: (statements || []).length };
  }, [statements]);

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
                <span>Procurement</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Comparative Statement (CS)</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <Scale className="w-7 h-7 text-indigo-600" />
                Comparative Statement (CS)
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Connected Procurement Chain:{" "}
                <span className="font-semibold text-slate-700">
                  PR &rarr; CS &rarr; Evaluation &rarr; Recommendation &rarr; Approval &rarr; PO / WO
                </span>
              </p>
            </div>

            {viewMode === "list" ? (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create New CS
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                {viewMode === "view" && (
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm print:hidden"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    Print CS Report
                  </button>
                )}
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition print:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to CS List
                </button>
              </div>
            )}
          </div>

          {viewMode === "list" ? (
            /* List View */
            <div className="space-y-6">
              {/* Dynamic KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Total CS
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{counts.total}</div>
                  <p className="text-[11px] text-slate-400 mt-1">All statements</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Draft
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{counts.draft}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Under preparation</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm">
                  <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    Under Review
                  </div>
                  <div className="text-2xl font-bold text-amber-900">{counts.underReview}</div>
                  <p className="text-[11px] text-amber-600 mt-1">Awaiting approval</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
                  <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                    Approved
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">{counts.approved}</div>
                  <p className="text-[11px] text-emerald-600 mt-1">Eligible for PO/WO</p>
                </div>
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 shadow-sm">
                  <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider mb-1">
                    Rejected
                  </div>
                  <div className="text-2xl font-bold text-rose-900">{counts.rejected}</div>
                  <p className="text-[11px] text-rose-600 mt-1">Requires retender</p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by CS #, PR #, vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Type:</span>
                      <select
                        value={procurementTypeFilter}
                        onChange={(e) => setProcurementTypeFilter(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="All">All Types</option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                        <option value="Works">Works</option>
                        <option value="Consultancy">Consultancy</option>
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
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">CS Number & Date</th>
                        <th className="py-3 px-4">PR Reference</th>
                        <th className="py-3 px-4">Organization & Type</th>
                        <th className="py-3 px-4 text-center">Bidders</th>
                        <th className="py-3 px-4">Recommended Vendor</th>
                        <th className="py-3 px-4 text-right">Negotiated Cost</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Contextual Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            <Scale className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                            <p className="font-medium text-slate-600">No comparative statements found</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Create a new CS from an approved PR to begin evaluation.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((cs) => {
                          const csNum = cs.csNumber || "CS";
                          const org = cs.organization || (cs as any).company || "Pakiza Group";
                          const prNum = cs.prNumber || "PR Reference";
                          const prEst = cs.prTotalEstimatedCost ?? (cs as any).totalEstimatedValue ?? 0;
                          const supQuotesCount = (cs.suppliers || []).length;
                          const recSupp = cs.recommendedSupplierName || "Pending Decision";
                          const savings = cs.estimatedSavings ?? 0;
                          const negTotal = cs.negotiatedTotal ?? 0;

                          // Check if distinct suppliers are assigned to different items
                          const distinctSuppliers = Array.from(
                            new Set(
                              (cs.items || [])
                                .map((it) => it.assignedSupplierName)
                                .filter(Boolean)
                            )
                          );
                          const isMultiSupplier = distinctSuppliers.length > 1;

                          return (
                          <tr key={cs.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-indigo-600">{csNum}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {cs.csDate}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">
                                {cs.linkedPRs && cs.linkedPRs.length > 1 ? (
                                  <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold text-xs border border-indigo-100">
                                    {cs.linkedPRs.length} PRs Linked
                                  </span>
                                ) : (
                                  prNum
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                Est: BDT {prEst.toLocaleString()}
                              </div>
                              {cs.linkedPRs && cs.linkedPRs.length > 1 && (
                                <div
                                  className="text-[10px] text-slate-400 truncate max-w-[170px]"
                                  title={cs.linkedPRs.map((p) => p.prNumber).join(", ")}
                                >
                                  {cs.linkedPRs.map((p) => p.prNumber).join(", ")}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-800">{org}</div>
                              <div className="text-xs text-slate-400">{cs.procurementType}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                <Users className="w-3 h-3" />
                                {supQuotesCount} Quotes
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="truncate max-w-[180px]">
                                  {isMultiSupplier
                                    ? `Split Award (${distinctSuppliers.length} Suppliers)`
                                    : recSupp}
                                </span>
                              </div>
                              {isMultiSupplier ? (
                                <div
                                  className="text-[10px] text-indigo-600 font-medium truncate max-w-[180px]"
                                  title={distinctSuppliers.join(" • ")}
                                >
                                  {distinctSuppliers.join(" • ")}
                                </div>
                              ) : (
                                savings > 0 && (
                                  <div className="text-[11px] text-emerald-600 font-medium">
                                    Saved: BDT {savings.toLocaleString()}
                                  </div>
                                )
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-bold text-slate-900">
                                {negTotal.toLocaleString("en-BD", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                              <div className="text-[11px] text-slate-400">{cs.currency || "BDT"}</div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                  cs.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : cs.status === "Under Review"
                                    ? "bg-amber-100 text-amber-800"
                                    : cs.status === "Rejected"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {cs.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenView(cs)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                  title="View Full Evaluation"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {cs.status !== "Approved" && (
                                  <>
                                    <button
                                      onClick={() => handleOpenEdit(cs)}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                      title="Edit CS"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(cs.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {cs.status === "Approved" && (
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() =>
                                        toast.info(
                                          `Purchase Order generation from CS ${cs.csNumber} is ready for integration.`
                                        )
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition"
                                      title="Create Purchase Order"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      PO
                                    </button>
                                    <button
                                      onClick={() =>
                                        toast.info(
                                          `Work Order generation from CS ${cs.csNumber} is ready for integration.`
                                        )
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition"
                                      title="Create Work Order"
                                    >
                                      <Briefcase className="w-3 h-3" />
                                      WO
                                    </button>
                                  </div>
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
          ) : viewMode === "view" && activeCS ? (
            /* Printable Executive CS View */
            (() => {
              const viewSuppliers = activeCS.suppliers || [];
              const viewItems = activeCS.items || [];
              const viewScorecards = activeCS.technicalScorecards || [];
              const viewPrEst = activeCS.prTotalEstimatedCost ?? (activeCS as any).totalEstimatedValue ?? 0;
              const viewNegTotal = activeCS.negotiatedTotal ?? 0;
              const viewSavings = activeCS.estimatedSavings ?? 0;
              const csNum = activeCS.csNumber || "CS";
              const org = activeCS.organization || (activeCS as any).company || "Pakiza Group";

              return (
            <div className="space-y-6">
              {/* Actions Ribbon */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-slate-900">{csNum}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeCS.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeCS.status === "Under Review"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeCS.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    PR Ref: <strong>{activeCS.prNumber}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeCS.status === "Under Review" && (
                    <button
                      onClick={() => handleApproveCS(activeCS.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Comparative Statement
                    </button>
                  )}
                  {activeCS.status === "Approved" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toast.success(
                            `Created draft PO for supplier: ${activeCS.recommendedSupplierName}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Create Purchase Order (PO)
                      </button>
                      <button
                        onClick={() =>
                          toast.success(
                            `Created draft Work Order for supplier: ${activeCS.recommendedSupplierName}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Briefcase className="w-4 h-4" />
                        Create Work Order (WO)
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    Print / Export PDF
                  </button>
                </div>
              </div>

              {/* Formal Executive Printable Document */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
                {/* Print Banner / Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                      {org}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Corporate Procurement & Commercial Division • Comparative Statement Report
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-900 text-sm">{csNum}</div>
                    <div className="text-slate-500">Date: {activeCS.csDate}</div>
                    <div className="text-indigo-600 font-semibold mt-0.5">
                      Currency: {activeCS.currency}
                    </div>
                  </div>
                </div>

                {/* Requisition & Procurement Scope */}
                {/* Requisition & Procurement Scope */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Linked Requisitions</span>
                      <strong className="text-slate-900">
                        {activeCS.linkedPRs?.length || 1} Purchase Requisition{activeCS.linkedPRs && activeCS.linkedPRs.length > 1 ? "s" : ""}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Delivery Destination</span>
                      <strong className="text-slate-900">{activeCS.deliveryWarehouse}</strong>
                    </div>
                  </div>

                  {activeCS.linkedPRs && activeCS.linkedPRs.length > 0 && (
                    <div className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/30 text-xs">
                      <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Linked Purchase Requisitions:</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeCS.linkedPRs.map((lp, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-white border border-indigo-100 text-xs flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="font-bold text-indigo-700">{lp.prNumber}</span>
                            <span className="text-slate-500">Date: {lp.prDate}</span>
                            <span className="text-slate-600">Requested By: <strong className="text-slate-800">{lp.requester || "Requester"}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Item-wise Comparative Matrix */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>1. Item-Wise Comparative Matrix</span>
                    <span className="text-[11px] font-normal text-slate-500 lowercase">
                      * highlighted green indicates lowest price (L1) per item
                    </span>
                  </h3>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                          <th className="py-2.5 px-3 border-r border-slate-200 w-8">#</th>
                          <th className="py-2.5 px-3 border-r border-slate-200 min-w-[280px]">
                            Item Description
                          </th>
                          <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-center">
                            UOM
                          </th>
                          <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-right">
                            Qty
                          </th>
                          <th className="py-2.5 px-3 border-r border-slate-200 w-24 text-right">
                            PR Est. Rate (৳)
                          </th>
                          {viewSuppliers.map((s) => (
                            <th
                              key={s.supplierId}
                              className="py-2.5 px-3 border-r border-slate-200 min-w-[170px] text-center bg-slate-50/70"
                            >
                              <div className="font-bold text-slate-900 truncate">
                                {s.supplierName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-normal">
                                Ref: {s.quotationRef}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {viewItems.map((item, idx) => {
                          const lowestPrice = computeLowestPrice(
                            item.quotes || {},
                            viewSuppliers.map((s) => s.supplierId)
                          );

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 border-r border-slate-200 text-slate-400 font-medium">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3 border-r border-slate-200">
                                <div className="font-semibold text-slate-900">{item.itemName}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                                  {item.specification && <div>Spec: {item.specification}</div>}
                                  {(item.brand || item.origin) && (
                                    <div className="text-slate-400 text-[10px]">
                                      Brand: {item.brand || "OEM"} • Origin: {item.origin || "Imported"}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 border-r border-slate-200 text-center font-medium text-slate-600">
                                {item.uom}
                              </td>
                              <td className="py-2.5 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 px-3 border-r border-slate-200 text-right text-slate-600 font-medium">
                                {(item.estimatedUnitPrice ?? 0).toLocaleString()}
                              </td>

                              {viewSuppliers.map((s) => {
                                const q = item.quotes?.[s.supplierId];
                                const isLowest =
                                  typeof q?.unitPrice === "number" &&
                                  lowestPrice !== null &&
                                  q.unitPrice === lowestPrice;

                                return (
                                  <td
                                    key={s.supplierId}
                                    className={`py-2.5 px-3 border-r border-slate-200 text-right ${
                                      isLowest ? "bg-emerald-50/70" : ""
                                    }`}
                                  >
                                    {q?.unitPrice === null || q?.unitPrice === undefined ? (
                                      <span className="text-slate-400 italic">Blank</span>
                                    ) : q?.unitPrice === "NA" ? (
                                      <span className="text-rose-500 font-medium">N/A</span>
                                    ) : (
                                      <div>
                                        <div className="flex items-center justify-end gap-1.5">
                                          {isLowest && (
                                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/80 px-1 rounded">
                                              L1
                                            </span>
                                          )}
                                          <span className="font-bold text-slate-900">
                                            ৳ {(typeof q.unitPrice === "number" ? q.unitPrice : 0).toLocaleString("en-BD", {
                                              minimumFractionDigits: 2,
                                            })}
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          Total: ৳ {(q.totalPrice ?? 0).toLocaleString()}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Supplier-wise Financial Summary Table */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="size-4 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">৳</span>
                    2. Supplier Financial Summary & Landed Cost Breakdown
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                          <th className="py-2 px-3 border-r border-slate-200">Financial Parameter</th>
                          {viewSuppliers.map((s) => (
                            <th
                              key={s.supplierId}
                              className="py-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900"
                            >
                              {s.supplierName} (Rank #{s.rank})
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            Gross Quoted Amount
                          </td>
                          {viewSuppliers.map((s) => (
                            <td key={s.supplierId} className="py-2 px-3 border-r border-slate-200 text-right font-semibold">
                              ৳ {(s.grossAmount ?? (s as any).totalAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            Discount Offered (-)
                          </td>
                          {viewSuppliers.map((s) => (
                            <td
                              key={s.supplierId}
                              className="py-2 px-3 border-r border-slate-200 text-right text-emerald-600"
                            >
                              - ৳ {(s.discountAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr className="bg-slate-50/50 font-semibold">
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-800">
                            Net Quoted Amount
                          </td>
                          {viewSuppliers.map((s) => (
                            <td key={s.supplierId} className="py-2 px-3 border-r border-slate-200 text-right">
                              ৳ {(s.netQuotedAmount ?? (s as any).totalAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            VAT Amount (+)
                          </td>
                          {viewSuppliers.map((s) => (
                            <td key={s.supplierId} className="py-2 px-3 border-r border-slate-200 text-right">
                              + ৳ {(s.vatAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })} ({s.vatPercentage}%)
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            Tax / AIT (+)
                          </td>
                          {viewSuppliers.map((s) => (
                            <td key={s.supplierId} className="py-2 px-3 border-r border-slate-200 text-right">
                              + ৳ {(s.taxAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            Freight & Other Charges (+)
                          </td>
                          {viewSuppliers.map((s) => (
                            <td key={s.supplierId} className="py-2 px-3 border-r border-slate-200 text-right">
                              + ৳ {(s.otherCharges ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr className="bg-indigo-50/60 border-t-2 border-slate-300 font-bold text-slate-900">
                          <td className="py-2.5 px-3 border-r border-slate-200 text-indigo-900">
                            Net Landed Payable Amount
                          </td>
                          {viewSuppliers.map((s) => (
                            <td
                              key={s.supplierId}
                              className="py-2.5 px-3 border-r border-slate-200 text-right text-indigo-900 text-sm font-extrabold"
                            >
                              ৳ {(s.finalPayableAmount ?? (s as any).totalAmount ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-medium">
                            Payment & Delivery Terms
                          </td>
                          {viewSuppliers.map((s) => (
                            <td
                              key={s.supplierId}
                              className="py-2 px-3 border-r border-slate-200 text-right text-[11px] text-slate-600"
                            >
                              {s.paymentTerms} • {s.deliveryLeadDays} days lead
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recommendation & Final Selection */}
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-indigo-200/60 pb-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-bold text-slate-900">
                      Recommended Supplier:{" "}
                      <span className="text-indigo-900">{activeCS.recommendedSupplierName || viewSuppliers[0]?.supplierName || "—"}</span>
                    </span>
                  </div>

                  <div className="text-slate-700">
                    <strong className="block text-slate-900 mb-1">Justification for Recommendation:</strong>
                    <p className="bg-white p-2.5 rounded-lg border border-indigo-100 text-xs text-slate-700 leading-relaxed">
                      {activeCS.recommendationJustification || "Recommended on the basis of lowest quoted total cost, technical compliance, and standard payment terms."}
                    </p>
                  </div>
                </div>

                {/* CS Attachments in View Mode */}
                {((activeCS.attachments && activeCS.attachments.length > 0) || true) && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900 flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                        Attached Documents ({(activeCS.attachments || []).length})
                      </span>
                    </div>
                    {(!activeCS.attachments || activeCS.attachments.length === 0) ? (
                      <p className="text-slate-400 italic py-1">No attachments uploaded for this Comparative Statement.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCS.attachments.map((att: any, idx: number) => (
                          <div key={att.id || idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div className="truncate">
                                <div className="font-semibold text-slate-800 truncate">{att.documentName || att.fileName}</div>
                                <div className="text-[10px] text-slate-500">{att.fileSize || "750 KB"} • {att.documentType || "Supporting Quotation"}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              Attached
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sign-off & Signatures Matrix */}
                <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">{activeCS.preparedBy}</div>
                    <div className="text-slate-500 text-[11px]">Prepared By (Procurement)</div>
                  </div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">Khandakar S. Ahmed</div>
                    <div className="text-slate-500 text-[11px]">Verified By (Head of Procurement)</div>
                  </div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">Tanvir Rahman, FCA</div>
                    <div className="text-slate-500 text-[11px]">Commercial / Finance Head</div>
                  </div>
                  <div className="border-t border-slate-400 pt-2">
                    <div className="font-bold text-slate-900">Managing Director</div>
                    <div className="text-slate-500 text-[11px]">Approving Authority</div>
                  </div>
                </div>
              </div>
            </div>
              );
            })()
          ) : (
            /* 10-Section Create / Edit Form */
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  1. Basic Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CS Number*</label>
                    <input
                      type="text"
                      value={formData.csNumber}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CS Date*</label>
                    <input
                      type="date"
                      value={formData.csDate}
                      onChange={(e) => setFormData({ ...formData, csDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization*</label>
                    <input
                      type="text"
                      value={formData.organization}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department*</label>
                    <input
                      type="text"
                      value={formData.department}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Prepared By*</label>
                    <input
                      type="text"
                      value={formData.preparedBy}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency*</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                    >
                      <option value="BDT">BDT (Bangladeshi Taka - ৳)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <span className="inline-block w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700">
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Linked Purchase Requisitions (Multi-PR Support) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      2. Linked Purchase Requisitions ({formData.linkedPRs?.length || 0})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Consolidate multiple approved Purchase Requisitions into this single Comparative Statement
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPrSearchQuery("");
                      setPrModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Tag Approved Purchase Requisition
                  </button>
                </div>

                {/* Tagged PR Cards List - Single Line Per PR */}
                <div className="space-y-2 mb-2">
                  {(formData.linkedPRs || []).map((p) => (
                    <div
                      key={p.prId}
                      className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/70 transition flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                        <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          {p.prNumber}
                        </span>
                        <span className="text-slate-600">
                          <span className="text-slate-400">Date:</span> {p.prDate}
                        </span>
                        <span className="text-slate-600">
                          <span className="text-slate-400">Requested By:</span>{" "}
                          <strong className="text-slate-800">{p.requester || (formData as any).prRequester || "Requester"}</strong>
                        </span>
                      </div>
                      {(formData.linkedPRs || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleUntagPR(p.prId)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition cursor-pointer shrink-0"
                          title="Untag this PR"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Supplier / Quotation Info */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      3. Participating Suppliers / Quotations ({formData.suppliers.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add competing bidders and set their quotation terms.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddSupplier(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">+ Add Supplier from Master Data...</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.supplierName} ({s.vendorCode || "VEN"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.suppliers.map((s) => (
                    <div
                      key={s.supplierId}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <strong className="text-slate-900 text-sm truncate">{s.supplierName}</strong>
                        <button
                          type="button"
                          onClick={() => handleRemoveSupplier(s.supplierId)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove Supplier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-500 text-[10px] mb-0.5">
                            Quotation Ref No*
                          </label>
                          <input
                            type="text"
                            value={s.quotationRef}
                            onChange={(e) =>
                              handleSupplierChargeChange(s.supplierId, "quotationRef", e.target.value)
                            }
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[10px] mb-0.5">Quote Date*</label>
                          <input
                            type="date"
                            value={s.quotationDate}
                            onChange={(e) =>
                              handleSupplierChargeChange(s.supplierId, "quotationDate", e.target.value)
                            }
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[10px] mb-0.5">Lead Time (Days)</label>
                          <input
                            type="number"
                            value={s.deliveryLeadDays}
                            onChange={(e) =>
                              handleSupplierChargeChange(
                                s.supplierId,
                                "deliveryLeadDays",
                                Number(e.target.value)
                              )
                            }
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[10px] mb-0.5">Payment Terms</label>
                          <select
                            value={s.paymentTerms}
                            onChange={(e) =>
                              handleSupplierChargeChange(s.supplierId, "paymentTerms", e.target.value)
                            }
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          >
                            {paymentTermsList.map((pt) => (
                              <option key={pt.id} value={pt.termsName}>
                                {pt.termsName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Item-Wise Comparison Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      4. Item-Wise Comparison Matrix
                    </span>
                    <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Pricing Rules: Blank = Unquoted • N/A = Not Available • 0 = Free
                    </span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        <th className="py-2.5 px-3 border-r border-slate-200 w-8">#</th>
                        <th className="py-2.5 px-3 border-r border-slate-200 min-w-[280px]">Item Description</th>
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-center">UOM</th>
                        <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-right">Req Qty</th>
                        <th className="py-2.5 px-3 border-r border-slate-200 w-24 text-right">PR Unit Rate (৳)</th>
                        {formData.suppliers.map((s) => (
                          <th
                            key={s.supplierId}
                            className="py-2.5 px-3 border-r border-slate-200 min-w-[180px] bg-slate-50 text-center"
                          >
                            <div className="font-bold text-slate-900">{s.supplierName}</div>
                            <div className="text-[10px] text-slate-500 font-normal">Quoted Rate & Total (৳)</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((item, idx) => {
                        const lowestPrice = computeLowestPrice(
                          item.quotes,
                          formData.suppliers.map((s) => s.supplierId)
                        );

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 border-r border-slate-200 text-slate-400 font-medium">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-200">
                              <div className="font-semibold text-slate-900">{item.itemName}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                                {item.specification && <div>Spec: {item.specification}</div>}
                                {(item.brand || item.origin) && (
                                  <div className="text-slate-400 text-[10px]">
                                    Brand: {item.brand || "OEM"} • Origin: {item.origin || "Imported"}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-200 text-center font-medium text-slate-700">
                              {item.uom}
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-200 text-right font-bold text-slate-900">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-200 text-right text-slate-600 font-medium">
                              {item.estimatedUnitPrice.toLocaleString()}
                            </td>

                            {formData.suppliers.map((s) => {
                              const q = item.quotes[s.supplierId];
                              const isLowest =
                                typeof q?.unitPrice === "number" &&
                                lowestPrice !== null &&
                                q.unitPrice === lowestPrice;

                              return (
                                <td
                                  key={s.supplierId}
                                  className={`py-2 px-3 border-r border-slate-200 ${
                                    isLowest ? "bg-emerald-50/70" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 justify-end">
                                    {isLowest && (
                                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-200 px-1 rounded">
                                        L1
                                      </span>
                                    )}
                                    <input
                                      type="text"
                                      value={
                                        q?.unitPrice === null || q?.unitPrice === undefined
                                          ? ""
                                          : q?.unitPrice === "NA"
                                          ? "N/A"
                                          : q.unitPrice
                                      }
                                      onChange={(e) =>
                                        handlePriceChange(item.id, s.supplierId, e.target.value)
                                      }
                                      placeholder="Blank / N/A / 0"
                                      className="w-24 text-xs font-semibold px-2 py-1 border border-slate-200 rounded text-right bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                  <div className="text-[10px] text-right text-slate-500 mt-0.5">
                                    Total:{" "}
                                    {typeof q?.unitPrice === "number"
                                      ? `৳ ${(q.unitPrice * item.quantity).toLocaleString()}`
                                      : "—"}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 5: Supplier-Wise Financial Summary & Taxes (৳) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="size-4 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">৳</span>
                  5. Supplier-Wise Financial Summary & Taxes
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Formula: Gross Amount - Discount + VAT + Tax + Other Charges = Net Landed Amount
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.suppliers.map((s) => (
                    <div
                      key={s.supplierId}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <strong className="text-slate-900 text-sm">{s.supplierName}</strong>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                          Rank #{s.rank}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Gross Quoted:</span>
                          <span className="font-semibold text-slate-800">
                            ৳ {s.grossAmount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Discount Amount (-):</span>
                          <input
                            type="number"
                            min="0"
                            value={s.discountAmount}
                            onChange={(e) =>
                              handleSupplierChargeChange(
                                s.supplierId,
                                "discountAmount",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 text-right px-2 py-0.5 border border-slate-200 rounded text-emerald-600 font-semibold"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">VAT (%) (+):</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={s.vatPercentage}
                              onChange={(e) =>
                                handleSupplierChargeChange(
                                  s.supplierId,
                                  "vatPercentage",
                                  Number(e.target.value)
                                )
                              }
                              className="w-14 text-right px-2 py-0.5 border border-slate-200 rounded font-medium"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Other Charges (+):</span>
                          <input
                            type="number"
                            min="0"
                            value={s.otherCharges}
                            onChange={(e) =>
                              handleSupplierChargeChange(
                                s.supplierId,
                                "otherCharges",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 text-right px-2 py-0.5 border border-slate-200 rounded font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                          <span className="font-bold text-slate-800">Net Payable Total:</span>
                          <span className="font-extrabold text-indigo-700 text-sm">
                            ৳{" "}
                            {s.finalPayableAmount.toLocaleString("en-BD", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Recommendation & Final Selection */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  6. Recommendation & Final Selection
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Recommended Supplier*
                    </label>
                    <select
                      value={formData.recommendedSupplierId}
                      onChange={(e) => {
                        const sup = formData.suppliers.find((s) => s.supplierId === e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          recommendedSupplierId: e.target.value,
                          recommendedSupplierName: sup?.supplierName || "",
                          originalLowestTotal: sup?.finalPayableAmount || 0,
                          negotiatedTotal: sup?.finalPayableAmount || 0,
                          estimatedSavings:
                            (prev.prTotalEstimatedCost || 0) - (sup?.finalPayableAmount || 0),
                        }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                    >
                      <option value="">-- Choose Recommended Supplier --</option>
                      {formData.suppliers.map((s) => (
                        <option key={s.supplierId} value={s.supplierId}>
                          {s.supplierName} (Rank #{s.rank} - ৳ {s.finalPayableAmount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Justification for Recommendation*
                    </label>
                    <textarea
                      rows={3}
                      value={formData.recommendationJustification}
                      onChange={(e) =>
                        setFormData({ ...formData, recommendationJustification: e.target.value })
                      }
                      placeholder="Detail why this supplier was selected based on pricing, compliance, delivery, and quality..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7: CS Attachments (Optional) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-600" />
                      7. Attachments (Optional)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Attach supporting vendor quotations, comparative analysis sheets, or technical documents
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Attach Supporting Document
                  </button>
                </div>

                {(!formData.attachments || formData.attachments.length === 0) ? (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Paperclip className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-500">No documents attached yet (Optional).</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click the button above to attach quotation files.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.attachments.map((att: any, idx: number) => (
                      <div
                        key={att.id || idx}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 truncate">{att.documentName || att.fileName}</div>
                            <div className="text-[10px] text-slate-500">{att.fileSize || "750 KB"} • {att.uploadedBy}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id || att.documentName || att.fileName)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition cursor-pointer shrink-0"
                          title="Remove Attachment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit for Approval
                </button>
              </div>
            </div>
          )}

          {/* Tag Purchase Requisition Modal */}
          {prModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <FileCheck className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Tag Approved Purchase Requisition</h2>
                      <p className="text-xs text-slate-500">
                        Select an approved Purchase Requisition to consolidate line items into this CS
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrModalOpen(false)}
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
                      value={prSearchQuery}
                      onChange={(e) => setPrSearchQuery(e.target.value)}
                      placeholder="Search by PR #, department, requester..."
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
                          <th className="py-2.5 px-3">PR Number</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Requested By</th>
                          <th className="py-2.5 px-3 text-center">Items</th>
                          <th className="py-2.5 px-3 text-right">Est. Budget (BDT)</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {approvedPRs
                          .filter((p) => {
                            if (!prSearchQuery.trim()) return true;
                            const q = prSearchQuery.toLowerCase();
                            return (
                              p.prNumber.toLowerCase().includes(q) ||
                              p.department.toLowerCase().includes(q) ||
                              (p.requesterName && p.requesterName.toLowerCase().includes(q)) ||
                              ((p as any).requestedBy && (p as any).requestedBy.toLowerCase().includes(q))
                            );
                          })
                          .map((p) => {
                            const isAlreadyTagged = (formData.linkedPRs || []).some((lp) => lp.prId === p.id);
                            const estVal = p.totalEstimatedCost || (p as any).totalEstimatedAmount || 0;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                <td className="py-3 px-3 font-bold text-indigo-600">{p.prNumber}</td>
                                <td className="py-3 px-3 text-slate-600">{p.prDate}</td>
                                <td className="py-3 px-3 text-slate-800 font-medium">{p.department}</td>
                                <td className="py-3 px-3 text-slate-600">
                                  {p.requesterName || (p as any).requestedBy || "Requester"}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-slate-700">{p.items.length}</td>
                                <td className="py-3 px-3 text-right font-bold text-slate-900">
                                  {estVal.toLocaleString()}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {isAlreadyTagged ? (
                                    <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-400">
                                      Already Tagged
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleTagPR(p)}
                                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
                                    >
                                      + Tag PR
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
