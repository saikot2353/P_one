import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  User,
  UserCheck,
  Building,
  Calendar,
  Check,
  Package,
  MessageSquare,
  AlertCircle,
  Send,
  Download,
  Share2,
  FileCheck,
  ShieldCheck,
  Layers,
  MapPin,
  DollarSign,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

export interface RequisitionItemView {
  grant?: boolean;
  sl: number;
  name: string;
  advJustification: string;
  stock: string;
  demand: string;
  safety: string;
  adjust: string;
  total: string;
  apdQty: string;
  unit: string;
  estCost?: string;
  category?: string;
}

export interface RequisitionApproverView {
  role: string;
  status: "Review" | "Pending" | "Approved" | "Rejected";
  name: string;
  designation: string;
  date?: string;
  avatar?: string;
}

export interface RequisitionCommentView {
  id: string;
  author: string;
  designation: string;
  role: string;
  date: string;
  avatar?: string;
  text: string;
}

export interface RequisitionViewData {
  title?: string;
  docCode?: string;
  ref?: string;
  revision?: string;
  date?: string;
  location?: string;
  deliveryPoint?: string;
  costCenter?: string;
  priority?: "Routine" | "Normal" | "Urgent" | "Emergency";
  note?: string;
  onBehalf?: boolean;
  requestedBy?: {
    name: string;
    empId?: string;
    designation?: string;
  };
  requestFor?: {
    name: string;
    empId: string;
    doj?: string;
    designation: string;
    section?: string;
    dept: string;
    company: string;
    avatar?: string;
  };
  items?: RequisitionItemView[];
  approvers?: RequisitionApproverView[];
  comments?: RequisitionCommentView[];
}

export interface GeneralStoreRequisitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisitionData?: RequisitionViewData;
}

// ─── DEFAULT BASE DATA (STANDARD REQUISITION) ───────────────────────
export const DEFAULT_REQUISITION: RequisitionViewData = {
  title: "ICT PRODUCT PURCHASE REQUISITION",
  docCode: "PTVL/REC/STR/02",
  ref: "PTVL-RQ-ICT-PUR-178920",
  revision: "00",
  date: "03/07/2022 19:57:03",
  onBehalf: false,
  requestFor: {
    name: "Rajebul Hasan Rajon",
    empId: "2022034013",
    doj: "02/02/2022",
    designation: "Deputy Manager",
    section: "HR & Admin",
    dept: "HR, Admin and Compliance",
    company: "Pakiza Technovation Limited , PTVL-Operation",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  },
  items: [
    {
      grant: true,
      sl: 1,
      name: "Sony LED TV Wall mount Kit full set with Screw",
      advJustification: "CEO Sir room TV use purpose",
      stock: "0.00 SET",
      demand: "1.00 SET",
      safety: "0.00 SET",
      adjust: "0.00 SET",
      total: "1.000 SET",
      apdQty: "1",
      unit: "SET",
      category: "AV Hardware",
    },
    {
      grant: true,
      sl: 2,
      name: "HDMI Cable (High Speed 4K 5m Nylon Braided)",
      advJustification: "CEO Sir room TV use purpose",
      stock: "0.00 PCS",
      demand: "1.00 PCS",
      safety: "0.00 PCS",
      adjust: "0.00 PCS",
      total: "1.000 PCS",
      apdQty: "1",
      unit: "PCS",
      category: "Cables & Connectivity",
    },
  ],
  approvers: [
    {
      role: "Manager: Review",
      status: "Review",
      name: "Md. Shahiduzzaman",
      designation: "Assistant General Manager (AGM)",
      date: "24/07/2022 17:32:57",
      avatar: "MS",
    },
    {
      role: "Operation (DGM): Pending",
      status: "Pending",
      name: "Seikh Zahidul Islam",
      designation: "CEO",
      date: "24/07/2022 17:32:57",
      avatar: "SZ",
    },
    {
      role: "ICT: Pending",
      status: "Pending",
      name: "Mamunoor Rashid",
      designation: "Deputy General Manager",
      avatar: "MR",
    },
    {
      role: "Procurement: Pending",
      status: "Pending",
      name: "Md. Mahbub Hasan",
      designation: "Sr. Manager",
      avatar: "MH",
    },
  ],
  comments: [
    {
      id: "cm-1",
      author: "Md. Shahiduzzaman",
      designation: "Assistant General Manager (AGM)",
      role: "Reviewer",
      date: "24/07/2022 17:35:10",
      avatar: "MS",
      text: "Item verified with ICT site team. The 75-inch TV wall mount bracket and 4K cable are required before the upcoming executive council meeting.",
    },
    {
      id: "cm-2",
      author: "Rajebul Hasan Rajon",
      designation: "Deputy Manager",
      role: "Requester",
      date: "24/07/2022 17:28:44",
      avatar: "RR",
      text: "Requisition submitted following management direction. Kindly expedite approval for procurement dispatch.",
    },
  ],
};

// ─── ON BEHALF DEMO DATA ───────────────────────────────────────────────
export const ON_BEHALF_DEMO_REQUISITION: RequisitionViewData = {
  title: "ICT PRODUCT PURCHASE REQUISITION",
  docCode: "PTVL/REC/STR/04",
  ref: "PTVL-RQ-ICT-OB-179320",
  revision: "00",
  date: "12/09/2026 11:20:45",
  onBehalf: true,
  requestedBy: {
    name: "Tahmid Afsar",
    designation: "Assistant Manager — HR & Admin",
    empId: "2023011409",
  },
  requestFor: {
    name: "Fahim Chowdhury",
    empId: "2021029012",
    doj: "15/01/2021",
    designation: "Deputy Manager",
    section: "Network & Systems",
    dept: "Information & Communication Technology",
    company: "Pakiza Technovation Limited , PTVL-HQ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  },
  items: [
    {
      grant: true,
      sl: 1,
      name: "Dell UltraSharp 24\" FHD USB-C Hub Monitor (P2422HE)",
      advJustification: "Dual monitor workspace setup for software development & devops pipeline monitoring",
      stock: "0.00 PCS",
      demand: "1.00 PCS",
      safety: "0.00 PCS",
      adjust: "0.00 PCS",
      total: "1.000 PCS",
      apdQty: "1",
      unit: "PCS",
      category: "Hardware",
    },
    {
      grant: true,
      sl: 2,
      name: "Logitech MK295 Silent Wireless Keyboard & Mouse Combo",
      advJustification: "Replacement for malfunctioning mechanical keys during shift operations",
      stock: "0.00 SET",
      demand: "1.00 SET",
      safety: "0.00 SET",
      adjust: "0.00 SET",
      total: "1.000 SET",
      apdQty: "1",
      unit: "SET",
      category: "Accessories",
    },
  ],
  approvers: [
    {
      role: "Manager: Review",
      status: "Review",
      name: "Md. Shahiduzzaman",
      designation: "Assistant General Manager (AGM)",
      date: "12/09/2026 12:45:00",
      avatar: "MS",
    },
    {
      role: "Operation (DGM): Pending",
      status: "Pending",
      name: "Seikh Zahidul Islam",
      designation: "CEO",
      avatar: "SZ",
    },
    {
      role: "ICT: Pending",
      status: "Pending",
      name: "Mamunoor Rashid",
      designation: "Deputy General Manager",
      avatar: "MR",
    },
    {
      role: "Procurement: Pending",
      status: "Pending",
      name: "Md. Mahbub Hasan",
      designation: "Sr. Manager",
      avatar: "MH",
    },
  ],
  comments: [
    {
      id: "cm-ob-1",
      author: "Tahmid Afsar",
      designation: "Assistant Manager — HR & Admin",
      role: "Requester (On Behalf)",
      date: "12/09/2026 11:22:15",
      avatar: "TA",
      text: "Submitting this requisition on behalf of Fahim Chowdhury (ICT) for workstation monitor and peripheral upgrade as approved in quarterly IT budget.",
    },
  ],
};

export function GeneralStoreRequisitionModal({
  open,
  onOpenChange,
  requisitionData = DEFAULT_REQUISITION,
}: GeneralStoreRequisitionModalProps) {
  const data = requisitionData || DEFAULT_REQUISITION;
  const items = data.items || DEFAULT_REQUISITION.items!;
  const approvers = data.approvers || DEFAULT_REQUISITION.approvers!;
  const [comments, setComments] = useState<RequisitionCommentView[]>(
    data.comments || DEFAULT_REQUISITION.comments!
  );
  const [newComment, setNewComment] = useState("");

  // Copy Reference Number
  const handleCopyRef = () => {
    if (data.ref) {
      navigator.clipboard.writeText(data.ref);
      toast.success(`Copied Ref: ${data.ref}`);
    }
  };

  // Add Comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry: RequisitionCommentView = {
      id: "cm-" + Date.now(),
      author: "Tahmid Afsar",
      designation: "Software Engineer / System Admin",
      role: "Reviewer",
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      avatar: "TA",
      text: newComment.trim(),
    };
    setComments((prev) => [newEntry, ...prev]);
    setNewComment("");
    toast.success("Comment added to requisition docket.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-foreground">
        {/* ─── MODAL HEADER (OFFICIAL TITLE & CLOSE) ────────────────────────── */}
        <div className="border-b border-border bg-muted/20 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {data.onBehalf && (
              <span className="text-[10.5px] font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <UserCheck className="size-3.5" />
                On Behalf Request
              </span>
            )}
          </div>

          <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-foreground text-center">
            {data.title || "ICT PRODUCT PURCHASE REQUISITION"}
          </h1>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              className="size-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
              title="Print Requisition Docket"
            >
              <Printer className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
              title="Close Requisition View"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* ─── MODAL SCROLLABLE BODY ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-background">
          {/* 1. DOCUMENT IDENTIFIER & REQUESTOR METADATA SECTION */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 divide-y md:divide-y-0 md:divide-x divide-border/60">
              {/* Left Column: Requisition Doc Details */}
              <div className="md:col-span-6 space-y-3.5 pr-0 md:pr-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-foreground tracking-tight">
                    {data.docCode || "PTVL/REC/STR/02"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      REVISION:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-foreground bg-muted px-1.5 py-0.2 rounded border border-border">
                      {data.revision || "00"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Ref:</span>
                    <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 select-all">
                      {data.ref || "PTVL-RQ-ICT-PUR-178920"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Copy reference number"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    Date: <strong className="text-foreground">{data.date || "03/07/2022 19:57:03"}</strong>
                  </span>
                </div>

                {data.onBehalf && data.requestedBy && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-primary font-bold text-[10.5px] uppercase tracking-wider">
                      <UserCheck className="size-3.5" />
                      <span>Requested On Behalf By</span>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {data.requestedBy.name}
                      {data.requestedBy.designation && (
                        <span className="text-muted-foreground font-normal">
                          {" "}• {data.requestedBy.designation}
                        </span>
                      )}
                    </div>
                    {data.requestedBy.empId && (
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Emp ID: {data.requestedBy.empId}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Request For (Employee Details) */}
              <div className="md:col-span-6 pt-4 md:pt-0 pl-0 md:pl-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" />
                    {data.onBehalf ? "Requisition For (Beneficiary):" : "Request For:"}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-xl p-3.5 border border-border/60 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-sm text-foreground">
                        {data.requestFor?.name || "Rajebul Hasan Rajon"}
                      </h3>
                      <p className="text-[11px] font-bold text-primary">
                        {data.requestFor?.designation || "Deputy Manager"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        Emp ID: <strong className="text-foreground">{data.requestFor?.empId || "2022034013"}</strong>
                      </span>
                      {data.requestFor?.doj && (
                        <span className="text-[9.5px] text-muted-foreground block font-mono">
                          DOJ: {data.requestFor.doj}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
                    <div>
                      <strong className="text-foreground/80">Section:</strong>{" "}
                      {data.requestFor?.section || "HR & Admin"}
                    </div>
                    <div>
                      <strong className="text-foreground/80">Dept:</strong>{" "}
                      {data.requestFor?.dept || "HR, Admin and Compliance"}
                    </div>
                    <div className="font-semibold text-foreground/75 truncate">
                      {data.requestFor?.company || "Pakiza Technovation Limited , PTVL-Operation"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REQUISITION ITEMS TABLE (Clean columns without cost) */}
          <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 border-b border-border text-[11px] font-black uppercase text-foreground/90 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-14 text-center">Grant</th>
                    <th className="py-2.5 px-2 w-10 text-center">#</th>
                    <th className="py-2.5 px-4 min-w-[280px]">ItemName</th>
                    <th className="py-2.5 px-3 text-right">Stock</th>
                    <th className="py-2.5 px-3 text-right">Demand</th>
                    <th className="py-2.5 px-3 text-right">Safety</th>
                    <th className="py-2.5 px-3 text-right">Adjust</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-4 text-center w-36">ApdQty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.map((row) => (
                    <tr key={row.sl} className="hover:bg-muted/30 transition-colors">
                      {/* Grant Indicator */}
                      <td className="py-3 px-3 text-center align-top">
                        <div className="size-4.5 rounded border border-border bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                      </td>

                      {/* SL */}
                      <td className="py-3 px-2 text-center align-top font-mono font-bold text-muted-foreground">
                        {row.sl}
                      </td>

                      {/* ItemName & Adv Justification */}
                      <td className="py-3 px-4 align-top space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-xs leading-snug">
                            {row.name}
                          </span>
                          {row.category && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                              {row.category}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-muted-foreground leading-normal flex items-start gap-1">
                          <strong className="text-foreground shrink-0">Adv:</strong>
                          <span>{row.advJustification}</span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3 text-right align-top font-mono text-muted-foreground">
                        {row.stock}
                      </td>

                      {/* Demand (Styled in Bold Blue) */}
                      <td className="py-3 px-3 text-right align-top font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        {row.demand}
                      </td>

                      {/* Safety */}
                      <td className="py-3 px-3 text-right align-top font-mono text-muted-foreground">
                        {row.safety}
                      </td>

                      {/* Adjust */}
                      <td className="py-3 px-3 text-right align-top font-mono text-muted-foreground">
                        {row.adjust}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 text-right align-top font-mono font-bold text-foreground">
                        {row.total}
                      </td>

                      {/* ApdQty (Box styled with unit) */}
                      <td className="py-3 px-4 text-center align-top">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <div className="w-16 h-7.5 px-2 rounded-md border border-border bg-card dark:bg-muted/40 font-mono font-bold text-xs text-foreground flex items-center justify-center shadow-2xs">
                            {row.apdQty}
                          </div>
                          <span className="text-[10.5px] font-bold text-muted-foreground uppercase font-mono">
                            {row.unit}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Summary Strip */}
            <div className="bg-muted/30 px-4 py-2.5 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>
                Total Items: <strong className="text-foreground font-mono">{items.length}</strong> lines
              </span>
              <div className="flex items-center gap-4">
                <span>
                  All Items Granted for Review:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">100%</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 3. MULTI-LEVEL APPROVAL STATUS STRIP (4-Tier Cards in screenshot) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                Multi-Tier Approval Hierarchy
              </span>
              <span className="text-[10.5px] text-muted-foreground">
                Official Authorization Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {approvers.map((app, idx) => {
                const isReviewed = app.status === "Review" || app.status === "Approved";
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 flex flex-col justify-between min-h-[108px] transition-all ${
                      isReviewed
                        ? "border-emerald-500/30 bg-emerald-500/5 shadow-2xs"
                        : "border-border/80 bg-card hover:bg-muted/10 shadow-2xs"
                    }`}
                  >
                    <div>
                      {/* Top Role Header with Status */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/50 text-[10.5px] font-bold">
                        <span className="text-foreground truncate">{app.role}</span>
                        {isReviewed ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 text-[9px] uppercase">
                            <Check className="size-2.5 stroke-[3]" /> Reviewed
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 text-[9px] uppercase">
                            <Clock className="size-2.5" /> Pending
                          </span>
                        )}
                      </div>

                      {/* Approver Person Details */}
                      <div className="pt-2 space-y-0.5">
                        <p className="font-bold text-xs text-foreground truncate">
                          {app.name}
                        </p>
                        <p className="text-[10.5px] text-muted-foreground truncate leading-tight">
                          {app.designation}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="pt-2 border-t border-border/40 text-[9.5px] font-mono text-muted-foreground/80 flex items-center justify-between">
                      <span>{app.date ? app.date.split(" ")[0] : "Awaiting Action"}</span>
                      <span>{app.date ? app.date.split(" ")[1] : "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. COMMENTS & AUDIT HISTORY SECTION */}
          <div className="bg-card rounded-xl border border-border/80 p-4.5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Comments History ({comments.length})
                </h3>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                Official Audit Trail
              </span>
            </div>

            {/* Existing Comments List */}
            <div className="space-y-3">
              {comments.map((cm) => (
                <div
                  key={cm.id}
                  className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-3"
                >
                  <div className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {cm.avatar || cm.author.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {cm.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          &bull; {cm.designation}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase border border-border/60">
                          {cm.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {cm.date}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                      {cm.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post New Comment Input */}
            <div className="pt-2 border-t border-border/60 space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                Add Audit Observation / Comment
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Type an official remark or endorsement note..."
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Post Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MODAL FOOTER BAR ────────────────────────────────────────────── */}
        <div className="px-6 py-3 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Digital Document Verification &bull; Encrypted Audit Log</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="size-3.5 text-muted-foreground" />
              <span>Print Docket</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-bold transition hover:opacity-90 cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
