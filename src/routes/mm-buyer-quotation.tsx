import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMBuyerQuotation,
  GarmentBusinessType,
  ApprovalStatus,
  MMQuotationColorSize,
} from "../lib/marketing-merchandising-data";
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Calculator,
  Download,
  AlertCircle,
  Calendar,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-buyer-quotation")({
  head: () => ({
    meta: [
      { title: "Buyer Quotation Management — CriptonHRIS" },
      {
        name: "description",
        content: "Buyer quotation lifecycle, costing inquiries, approval workflows, and color/size breakdowns for Woven and Knit garments.",
      },
    ],
  }),
  component: MMBuyerQuotationPage,
});

function MMBuyerQuotationPage() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<MMBuyerQuotation[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [selectedQuot, setSelectedQuot] = useState<MMBuyerQuotation | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filterGarmentType, setFilterGarmentType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Rejection modal
  const [rejectQuotId, setRejectQuotId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Create Form State
  const [formCompany, setFormCompany] = useState("Pakiza Knit Composite Ltd");
  const [formBusinessUnit, setFormBusinessUnit] = useState("Unit 2 - Garments");
  const [formBuyer, setFormBuyer] = useState("H&M Hennes & Mauritz");
  const [formBuyerDept, setFormBuyerDept] = useState("Ladies Casual & Tops");
  const [formLocalAgent, setFormLocalAgent] = useState("Pakiza Global Sourcing");
  const [formGarmentType, setFormGarmentType] = useState<GarmentBusinessType>("Knit");
  const [formStyleNo, setFormStyleNo] = useState("");
  const [formStyleDesc, setFormStyleDesc] = useState("");
  const [formGarmentItem, setFormGarmentItem] = useState("Polo Shirt");
  const [formSeason, setFormSeason] = useState("Autumn / Winter 2026");
  const [formRefNo, setFormRefNo] = useState("");
  const [formQuotDate, setFormQuotDate] = useState(new Date().toISOString().slice(0, 10));
  const [formValidityDate, setFormValidityDate] = useState("2026-12-31");
  const [formQuantity, setFormQuantity] = useState<number>(30000);
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formUnitPriceFob, setFormUnitPriceFob] = useState<number>(4.50);
  const [formPaymentTerms, setFormPaymentTerms] = useState("LC 90 Days");
  const [formDeliveryTerms, setFormDeliveryTerms] = useState("FOB Chattogram");
  const [formShipmentDate, setFormShipmentDate] = useState("2026-12-20");
  const [formNotes, setFormNotes] = useState("");
  const [colorSizeRows, setColorSizeRows] = useState<MMQuotationColorSize[]>([
    { color: "Navy Blue", size: "M", quantity: 15000 },
    { color: "Navy Blue", size: "L", quantity: 15000 },
  ]);

  useEffect(() => {
    setQuotations(MMRepository.getQuotations());
    setPolicy(MMRepository.getPolicy());
  }, []);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchType = filterGarmentType === "All" || q.garmentType === filterGarmentType;
      const matchStatus = filterStatus === "All" || q.status === filterStatus;
      const matchSearch =
        searchTerm === "" ||
        q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.styleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [quotations, filterGarmentType, filterStatus, searchTerm]);

  const handleApprove = (q: MMBuyerQuotation) => {
    const updated: MMBuyerQuotation = {
      ...q,
      status: "Approved",
      approvedBy: "Rashidul Islam (Head of Merchandising)",
      approvalDate: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    MMRepository.saveQuotation(updated);
    setQuotations(MMRepository.getQuotations());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "Quotation",
      entityId: q.quotationNo,
      action: "Approve",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Quotation ${q.quotationNo} approved. Ready to initiate Pre-Costing.`,
    });
    toast.success(`Quotation ${q.quotationNo} approved successfully.`);
  };

  const handleReject = () => {
    if (!rejectQuotId || !rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    const q = quotations.find((item) => item.id === rejectQuotId);
    if (!q) return;

    const updated: MMBuyerQuotation = {
      ...q,
      status: "Rejected",
      rejectionReason: rejectionReason.trim(),
    };
    MMRepository.saveQuotation(updated);
    setQuotations(MMRepository.getQuotations());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "Quotation",
      entityId: q.quotationNo,
      action: "Reject",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Quotation ${q.quotationNo} rejected. Reason: ${rejectionReason.trim()}`,
    });
    setRejectQuotId(null);
    setRejectionReason("");
    toast.error(`Quotation ${q.quotationNo} rejected.`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStyleNo.trim()) {
      toast.error("Please enter a Style Number.");
      return;
    }
    const totalBreakdownQty = colorSizeRows.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
    if (totalBreakdownQty !== formQuantity) {
      toast.error(
        `Color/Size breakdown sum (${totalBreakdownQty.toLocaleString()}) must match Total Quotation Quantity (${formQuantity.toLocaleString()}).`
      );
      return;
    }

    // Determine initial status based on company policy
    const initialStatus: ApprovalStatus = policy.quotationApprovalRequired ? "Pending Approval" : "Approved";
    const nextQuotNumber = `QT-2026-00${quotations.length + 95}`;

    const newQuot: MMBuyerQuotation = {
      id: `quot-${Date.now()}`,
      quotationNo: nextQuotNumber,
      companyName: formCompany,
      businessUnit: formBusinessUnit,
      buyerName: formBuyer,
      buyerDepartment: formBuyerDept,
      localAgent: formLocalAgent,
      garmentType: formGarmentType,
      styleNo: formStyleNo.trim(),
      styleDescription: formStyleDesc.trim(),
      garmentItem: formGarmentItem,
      season: formSeason,
      referenceNo: formRefNo.trim() || `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      quotationDate: formQuotDate,
      validityDate: formValidityDate,
      quantity: formQuantity,
      currency: formCurrency,
      unitPriceFob: formUnitPriceFob,
      totalQuotationValue: formQuantity * formUnitPriceFob,
      paymentTerms: formPaymentTerms,
      deliveryTerms: formDeliveryTerms,
      shipmentDate: formShipmentDate,
      status: initialStatus,
      approvedBy: policy.quotationApprovalRequired ? undefined : "Auto-Approved by Company Policy",
      approvalDate: policy.quotationApprovalRequired ? undefined : new Date().toISOString().slice(0, 10),
      colorSizeBreakdown: colorSizeRows,
      notes: formNotes,
      attachments: [],
      createdBy: "Rashidul Islam (Head of Merchandising)",
      createdDate: new Date().toISOString().slice(0, 10),
      version: 1,
    };

    MMRepository.saveQuotation(newQuot);
    setQuotations(MMRepository.getQuotations());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "Quotation",
      entityId: newQuot.quotationNo,
      action: "Create",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Created quotation ${newQuot.quotationNo} for ${newQuot.buyerName} Style ${newQuot.styleNo}. Status: ${newQuot.status}`,
    });

    setIsCreateModalOpen(false);
    toast.success(`Buyer Quotation ${nextQuotNumber} created successfully (${newQuot.status}).`);
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-buyer-quotation"
      breadcrumbs={[{ label: "Buyer Quotation Register" }]}
      title="Buyer Quotation Management"
      subtitle="Initial commercial inquiries, garment costing estimates, and approval workflows (Woven & Knit)"
      actions={
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Buyer Quotation</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Policy Status Banner */}
        <div className="p-3 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Company Policy Mode:</strong> Quotation approval is currently{" "}
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {policy.quotationApprovalRequired ? "MANDATORY (Enforced)" : "BYPASSED (Direct to Pre-Costing)"}
              </span>
              . Only Approved quotations are eligible for downstream Style-wise Pre-Costing.
            </span>
          </div>
          <Link to="/mm-policy-config" className="text-teal-700 dark:text-teal-300 font-bold hover:underline shrink-0">
            Change Policy Settings →
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Quotation No, Buyer, Style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterGarmentType}
              onChange={(e) => setFilterGarmentType(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Garment Types</option>
              <option value="Knit">Knit Garments</option>
              <option value="Woven">Woven Garments</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Draft">Draft</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-3">Quotation No</th>
                  <th className="py-3 px-3">Buyer & Dept</th>
                  <th className="py-3 px-3">Garment Type</th>
                  <th className="py-3 px-3">Style & Item</th>
                  <th className="py-3 px-3">Season</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Target FOB ($)</th>
                  <th className="py-3 px-3">Total Value ($)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      No buyer quotations found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                        {q.quotationNo}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white block">{q.buyerName}</span>
                        <span className="text-[10px] text-slate-400">{q.buyerDepartment}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.garmentType === "Knit"
                              ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {q.garmentType}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{q.styleNo}</span>
                        <span className="text-[10px] text-slate-400">{q.garmentItem}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{q.season}</td>
                      <td className="py-3 px-3 font-mono font-semibold">{q.quantity.toLocaleString()} pcs</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">
                        ${q.unitPriceFob.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        ${q.totalQuotationValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            q.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : q.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : q.status === "Rejected"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {q.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                          {q.status === "Pending Approval" && <Clock className="w-3 h-3" />}
                          {q.status === "Rejected" && <XCircle className="w-3 h-3" />}
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedQuot(q);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="View Quotation Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {q.status === "Pending Approval" && (
                            <>
                              <button
                                onClick={() => handleApprove(q)}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                                title="Approve Quotation"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectQuotId(q.id);
                                  setRejectionReason("");
                                }}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                                title="Reject Quotation"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {q.status === "Approved" && (
                            <Link
                              to="/mm-pre-costing"
                              search={{ quotationId: q.id }}
                              className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 text-[11px] font-bold dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800 flex items-center gap-1"
                              title="Proceed to Style Pre-Costing"
                            >
                              <Calculator className="w-3 h-3" /> Costing
                            </Link>
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

        {/* ── CREATE BUYER QUOTATION MODAL ────────────────────────────────────── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Create New Buyer Quotation
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                {/* Row 1: Company, Business Unit, Buyer, Buyer Dept */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Unit</label>
                    <input
                      type="text"
                      value={formBusinessUnit}
                      onChange={(e) => setFormBusinessUnit(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Buyer Name</label>
                    <input
                      type="text"
                      value={formBuyer}
                      onChange={(e) => setFormBuyer(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Buyer Department</label>
                    <input
                      type="text"
                      value={formBuyerDept}
                      onChange={(e) => setFormBuyerDept(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Row 2: Garment Type, Style No, Garment Item, Season */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Garment Business Type *
                    </label>
                    <select
                      value={formGarmentType}
                      onChange={(e) => setFormGarmentType(e.target.value as GarmentBusinessType)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-teal-600"
                    >
                      <option value="Knit">Knit Garments</option>
                      <option value="Woven">Woven Garments</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Style Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. HM-KT-8842"
                      value={formStyleNo}
                      onChange={(e) => setFormStyleNo(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Garment Item</label>
                    <input
                      type="text"
                      value={formGarmentItem}
                      onChange={(e) => setFormGarmentItem(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Season</label>
                    <input
                      type="text"
                      value={formSeason}
                      onChange={(e) => setFormSeason(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Row 3: Style Description */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Style Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Men 100% Combed Cotton Heavyweight Crewneck T-Shirt"
                    value={formStyleDesc}
                    onChange={(e) => setFormStyleDesc(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                {/* Row 4: Quantity, Unit Price FOB, Total Value, Validity Date */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Order Quantity (Pcs)</label>
                    <input
                      type="number"
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Offered FOB / Pc ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formUnitPriceFob}
                      onChange={(e) => setFormUnitPriceFob(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Value (USD)</label>
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-700 font-mono font-extrabold text-slate-900 dark:text-white">
                      ${(formQuantity * formUnitPriceFob).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Validity Date</label>
                    <input
                      type="date"
                      value={formValidityDate}
                      onChange={(e) => setFormValidityDate(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Color and Size Breakdown Section */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Color & Size Breakdown (Sum Must Equal Total Quantity)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setColorSizeRows((prev) => [...prev, { color: "New Color", size: "M", quantity: 5000 }])
                      }
                      className="text-teal-600 font-bold hover:underline"
                    >
                      + Add Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {colorSizeRows.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Color"
                          value={row.color}
                          onChange={(e) => {
                            const updated = [...colorSizeRows];
                            updated[idx].color = e.target.value;
                            setColorSizeRows(updated);
                          }}
                          className="flex-1 p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={row.size}
                          onChange={(e) => {
                            const updated = [...colorSizeRows];
                            updated[idx].size = e.target.value;
                            setColorSizeRows(updated);
                          }}
                          className="w-24 p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={row.quantity}
                          onChange={(e) => {
                            const updated = [...colorSizeRows];
                            updated[idx].quantity = parseInt(e.target.value) || 0;
                            setColorSizeRows(updated);
                          }}
                          className="w-32 p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                        />
                        {colorSizeRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setColorSizeRows((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1 font-mono text-[11px]">
                    <span>
                      Breakdown Total:{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {colorSizeRows.reduce((a, b) => a + (Number(b.quantity) || 0), 0).toLocaleString()}
                      </strong>{" "}
                      Pcs
                    </span>
                    <span>Target: {formQuantity.toLocaleString()} Pcs</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                  >
                    Create Buyer Quotation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── VIEW QUOTATION DETAIL MODAL ────────────────────────────────────── */}
        {isViewModalOpen && selectedQuot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Quotation #{selectedQuot.quotationNo}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Created on {selectedQuot.createdDate} by {selectedQuot.createdBy}
                  </p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Buyer</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedQuot.buyerName}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Style</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedQuot.styleNo} ({selectedQuot.garmentType})
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity</span>
                  <span className="font-semibold font-mono text-slate-900 dark:text-white">
                    {selectedQuot.quantity.toLocaleString()} Pcs
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Offered FOB</span>
                  <span className="font-semibold font-mono text-emerald-600">
                    ${selectedQuot.unitPriceFob.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                <span className="font-bold text-xs block mb-2">Color & Size Breakdown</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {selectedQuot.colorSizeBreakdown.map((cs, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-center">
                      <span className="font-bold block">{cs.color}</span>
                      <span className="text-slate-400 text-[11px]">Size {cs.size}</span>
                      <span className="block font-mono text-teal-600 font-semibold">{cs.quantity.toLocaleString()} pcs</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── REJECTION REASON MODAL ────────────────────────────────────────── */}
        {rejectQuotId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-600">
                <XCircle className="w-5 h-5" />
                <span>Reject Buyer Quotation</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Please provide the mandatory business reason for rejecting this quotation.
              </p>
              <textarea
                rows={3}
                placeholder="e.g. Target FOB $4.50 is below minimum acceptable factory CM margin..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-rose-500"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectQuotId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
