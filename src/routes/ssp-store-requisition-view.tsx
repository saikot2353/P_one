import { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Printer,
  ArrowLeft,
  Copy,
  Check,
  User,
  UserCheck,
  ShieldCheck,
  Clock,
  MessageSquare,
  Send,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_REQUISITION,
  ON_BEHALF_DEMO_REQUISITION,
  RequisitionViewData,
  RequisitionCommentView,
} from "@/components/ssp/GeneralStoreRequisitionModal";

export const Route = createFileRoute("/ssp-store-requisition-view")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Store Requisition View — CRIPTON HRIS" },
      {
        name: "description",
        content: "Official Store Requisition Slip and Approval Pipeline View.",
      },
    ],
  }),
  component: StoreRequisitionViewPage,
});

function StoreRequisitionViewPage() {
  const search = useSearch({ from: "/ssp-store-requisition-view" });
  const [data, setData] = useState<RequisitionViewData>(DEFAULT_REQUISITION);
  const [comments, setComments] = useState<RequisitionCommentView[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // If search id matches the on-behalf demo or contains on-behalf
    if (search.id === "389201" || search.id.includes("OB") || search.id.toLowerCase().includes("behalf")) {
      setData(ON_BEHALF_DEMO_REQUISITION);
      setComments(ON_BEHALF_DEMO_REQUISITION.comments || []);
    } else {
      setData(DEFAULT_REQUISITION);
      setComments(DEFAULT_REQUISITION.comments || []);
    }
  }, [search.id]);

  const items = data.items || [];
  const approvers = data.approvers || [];

  const handleCopyRef = () => {
    if (data.ref) {
      navigator.clipboard.writeText(data.ref);
      toast.success(`Copied Ref: ${data.ref}`);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry: RequisitionCommentView = {
      id: "cm-" + Date.now(),
      author: "Tahmid Afsar",
      designation: "Assistant Manager — HR & Admin",
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
    toast.success("Comment recorded in official requisition docket.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-5 w-full">
          {/* Breadcrumb & Header Bar */}
          <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/ssp-my-requisition" className="hover:text-primary transition-colors">
                  My Requisitions
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">
                  Store Requisition ({data.ref || "Official Docket"})
                </span>
              </div>

              <div className="flex items-center gap-3 pt-0.5">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground uppercase">
                  {data.title || "ICT PRODUCT PURCHASE REQUISITION"}
                </h1>
                {data.onBehalf && (
                  <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <UserCheck className="size-3" />
                    On Behalf Request
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <Link
                to="/ssp-my-requisition"
                className="px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft className="size-3.5 text-muted-foreground" />
                <span>Back to Requisitions</span>
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 shadow-xs hover:opacity-90 cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Docket</span>
              </button>
            </div>
          </div>

          {/* 1. DOCUMENT IDENTIFIER & REQUESTOR METADATA SECTION */}
          <div className="bg-card rounded-xl border border-border/80 p-5 sm:p-6 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
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
                    <span className="text-xs font-mono font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 select-all">
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
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
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
              <div className="md:col-span-6 pt-4 md:pt-0 pl-0 md:pl-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" />
                    {data.onBehalf ? "Requisition For (Beneficiary):" : "Request For:"}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 border border-border/60 space-y-2">
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

          {/* 2. REQUISITION ITEMS TABLE */}
          <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 border-b border-border text-[11px] font-black uppercase text-foreground/90 tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-14 text-center">Grant</th>
                    <th className="py-3 px-2 w-10 text-center">#</th>
                    <th className="py-3 px-4 min-w-[280px]">ItemName</th>
                    <th className="py-3 px-3 text-right">Stock</th>
                    <th className="py-3 px-3 text-right">Demand</th>
                    <th className="py-3 px-3 text-right">Safety</th>
                    <th className="py-3 px-3 text-right">Adjust</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-4 text-center w-36">ApdQty</th>
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
            <div className="bg-muted/30 px-4 sm:px-6 py-2.5 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground">
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

          {/* 3. MULTI-LEVEL APPROVAL STATUS STRIP (4-Tier Cards) */}
          <div className="space-y-2.5">
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
              {approvers.map((approver, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/80 rounded-xl p-3.5 space-y-2 shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-foreground truncate">
                      {approver.role.split(":")[0]}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                        approver.status === "Review"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : approver.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {approver.status === "Review" ? "✓ REVIEWED" : "⏱ PENDING"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-foreground truncate">
                      {approver.name}
                    </h4>
                    <p className="text-[10.5px] text-muted-foreground truncate">
                      {approver.designation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>{approver.date ? approver.date.split(" ")[0] : "Awaiting Action"}</span>
                    <span>{approver.date ? approver.date.split(" ")[1] : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. COMMENTS & AUDIT TRAIL */}
          <div className="bg-card rounded-xl border border-border/80 p-4.5 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Comments History ({comments.length})
                </h3>
              </div>
              <span className="text-[10.5px] text-muted-foreground">
                Official Audit Trail
              </span>
            </div>

            <div className="space-y-3">
              {comments.map((cm) => (
                <div
                  key={cm.id}
                  className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/20">
                        {cm.avatar || cm.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {cm.author}
                      </span>
                      <span className="text-[10.5px] text-muted-foreground">
                        &bull; {cm.designation}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                        {cm.role}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground">
                      {cm.date}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 pl-8 leading-relaxed">
                    {cm.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add New Comment */}
            <div className="pt-2 border-t border-border/60 flex items-center gap-2.5">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Write an internal comment or approval note for this requisition..."
                className="flex-1 h-9.5 px-3.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary transition"
              />
              <button
                type="button"
                onClick={handleAddComment}
                className="h-9.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shadow-xs"
              >
                <Send className="size-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* Footer Digital Document Verification */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 pb-4">
            <span className="flex items-center gap-1.5">
              <FileCheck className="size-3.5 text-emerald-600" />
              Digital Document Verification &bull; Encrypted Audit Log
            </span>
            <span className="font-mono text-[10.5px]">
              System Ref: {data.ref || "STR-REC"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
