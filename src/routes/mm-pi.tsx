import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMProformaInvoice,
  MMFabricBooking,
  MMAccessoriesBooking,
  PIStatus,
} from "../lib/marketing-merchandising-data";
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  DollarSign,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  Save,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-pi")({
  head: () => ({
    meta: [
      { title: "Proforma Invoice (PI) Management — CriptonHRIS" },
      {
        name: "description",
        content: "Proforma Invoice (PI) creation from approved bookings, supplier consolidation, currency rates, and approval workflow.",
      },
    ],
  }),
  component: MMPIRoutePage,
});

function MMPIRoutePage() {
  const [pis, setPis] = useState<MMProformaInvoice[]>([]);
  const [fabricBookings, setFabricBookings] = useState<MMFabricBooking[]>([]);
  const [accBookings, setAccBookings] = useState<MMAccessoriesBooking[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPi, setSelectedPi] = useState<MMProformaInvoice | null>(null);

  // Form State
  const [supplierName, setSupplierName] = useState("Pakiza Knitting & Dyeing");
  const [businessUnit, setBusinessUnit] = useState("Unit 2 - Garments");
  const [currency, setCurrency] = useState("USD");
  const [paymentTerms, setPaymentTerms] = useState("LC 90 Days");
  const [deliveryTerms, setDeliveryTerms] = useState("FOB Factory Savar");
  const [lcRef, setLcRef] = useState("LC-HM-99812-2026");
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);

  useEffect(() => {
    setPis(MMRepository.getPIs());
    setFabricBookings(MMRepository.getFabricBookings());
    setAccBookings(MMRepository.getAccessoriesBookings());
    setPolicy(MMRepository.getPolicy());
  }, []);

  // Eligible Bookings Pool (CRITICAL: Must ONLY include APPROVED bookings when approval is required!)
  const eligibleBookings = useMemo(() => {
    const list: {
      id: string;
      bookingNo: string;
      type: "Fabric" | "Accessories";
      supplierName: string;
      orderNo: string;
      styleNo: string;
      totalAmount: number;
      status: string;
      isEligible: boolean;
      ineligibleReason?: string;
    }[] = [];

    fabricBookings.forEach((fb) => {
      const isEligible = !policy.fabricBookingApprovalRequired || fb.status === "Approved";
      let reason = undefined;
      if (!isEligible) {
        reason = `Fabric Booking ${fb.bookingNo} is in status '${fb.status}' (Must be Approved by policy)`;
      }
      list.push({
        id: fb.id,
        bookingNo: fb.bookingNo,
        type: "Fabric",
        supplierName: fb.supplierName,
        orderNo: fb.items[0]?.orderNo || "ORD",
        styleNo: fb.items[0]?.styleNo || "HM",
        totalAmount: fb.totalBookedAmount,
        status: fb.status,
        isEligible,
        ineligibleReason: reason,
      });
    });

    accBookings.forEach((ab) => {
      const isEligible = !policy.accessoriesBookingApprovalRequired || ab.status === "Approved";
      let reason = undefined;
      if (!isEligible) {
        reason = `Accessories Booking ${ab.bookingNo} is in status '${ab.status}' (Must be Approved by policy)`;
      }
      list.push({
        id: ab.id,
        bookingNo: ab.bookingNo,
        type: "Accessories",
        supplierName: ab.supplierName,
        orderNo: ab.items[0]?.orderNo || "ORD",
        styleNo: ab.items[0]?.styleNo || "ZR",
        totalAmount: ab.totalBookedAmount,
        status: ab.status,
        isEligible,
        ineligibleReason: reason,
      });
    });

    return list;
  }, [fabricBookings, accBookings, policy]);

  const handleApprovePI = (pi: MMProformaInvoice) => {
    const updated: MMProformaInvoice = {
      ...pi,
      status: "Approved",
      approvedBy: "Rashidul Islam (Head of Merchandising)",
      approvalDate: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    MMRepository.savePI(updated);
    setPis(MMRepository.getPIs());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "PI",
      entityId: pi.piNo,
      action: "Approve",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Approved PI ${pi.piNo} ($${pi.totalPiValue.toLocaleString()}). Passed for BBLC / Finance processing.`,
    });
    toast.success(`PI ${pi.piNo} verified and approved.`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookingIds.length === 0) {
      toast.error("Please select at least one eligible approved booking to consolidate into this PI.");
      return;
    }

    const selectedBookings = eligibleBookings.filter((b) => selectedBookingIds.includes(b.id));
    // Verify none are ineligible
    const invalid = selectedBookings.find((b) => !b.isEligible);
    if (invalid) {
      toast.error(`Cannot create PI: ${invalid.ineligibleReason}`);
      return;
    }

    const nextPiNo = `PI-PK-2026-0${pis.length + 105}`;
    const nextEntryNo = `ENT-PI-00${pis.length + 4}`;

    const allocated = selectedBookings.map((b) => ({
      bookingId: b.id,
      bookingNo: b.bookingNo,
      bookingType: b.type,
      orderNo: b.orderNo,
      styleNo: b.styleNo,
      allocatedAmount: b.totalAmount,
    }));

    const totalBookingValue = selectedBookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const totalPiValue = totalBookingValue + Number(additionalCharges);

    const newPi: MMProformaInvoice = {
      id: `pi-${Date.now()}`,
      piNo: nextPiNo,
      entryNo: nextEntryNo,
      piDate: new Date().toISOString().slice(0, 10),
      supplierName: supplierName,
      businessUnit: businessUnit,
      currency: currency,
      conversionRate: 1.0,
      paymentTerms: paymentTerms,
      deliveryTerms: deliveryTerms,
      deliveryMode: "Road",
      lcReferenceNo: lcRef,
      status: "Approved",
      approvedBy: "Rashidul Islam (Head of Merchandising)",
      approvalDate: new Date().toISOString().slice(0, 10),
      allocatedBookings: allocated,
      items: [
        {
          piItemId: `PII-${Date.now()}`,
          bookingItemId: "BI-001",
          sourceBookingNo: selectedBookings[0].bookingNo,
          itemDescription: `Consolidated Procurement from ${supplierName}`,
          specification: "Standard export specification",
          unit: "Lot",
          quantity: 1,
          unitPrice: totalBookingValue,
          totalAmount: totalBookingValue,
        },
      ],
      additionalCharges: Number(additionalCharges),
      totalPiValue: totalPiValue,
      notes: "Proforma Invoice verified against approved bookings.",
      attachments: [],
      createdBy: "Rashidul Islam (Head of Merchandising)",
      createdDate: new Date().toISOString().slice(0, 10),
      version: 1,
    };

    MMRepository.savePI(newPi);
    setPis(MMRepository.getPIs());
    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "PI",
      entityId: newPi.piNo,
      action: "Create",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Created Proforma Invoice ${newPi.piNo} covering ${allocated.length} approved bookings. Value: $${newPi.totalPiValue.toLocaleString()}.`,
    });

    setIsCreateModalOpen(false);
    toast.success(`PI ${nextPiNo} created and registered successfully.`);
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-pi"
      breadcrumbs={[{ label: "Proforma Invoice (PI)" }]}
      title="Proforma Invoice (PI) Management"
      subtitle="Commercial invoice registration, multi-booking supplier consolidation, and strict approval verification"
      actions={
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Proforma Invoice</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Eligibility Rule Banner */}
        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>PI Eligibility Validation:</strong> In accordance with company policy, pending or rejected Fabric
              and Accessories bookings cannot be selected for PI creation. Only eligible approved bookings can be
              consolidated.
            </span>
          </div>
          <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-[11px] shrink-0">
            Enforced by Policy
          </span>
        </div>

        {/* PI Register Table */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b font-semibold">
                <tr>
                  <th className="py-3 px-3">PI Number</th>
                  <th className="py-3 px-3">Supplier Name</th>
                  <th className="py-3 px-3">Business Unit</th>
                  <th className="py-3 px-3">PI Date</th>
                  <th className="py-3 px-3">Consolidated Bookings</th>
                  <th className="py-3 px-3">LC / BBLC Ref</th>
                  <th className="py-3 px-3">Total PI Value ($)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pis.map((pi) => (
                  <tr key={pi.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">{pi.piNo}</td>
                    <td className="py-3 px-3 font-semibold">{pi.supplierName}</td>
                    <td className="py-3 px-3">{pi.businessUnit}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{pi.piDate}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {pi.allocatedBookings.map((b, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold"
                          >
                            {b.bookingNo}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{pi.lcReferenceNo || "—"}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      ${pi.totalPiValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          pi.status === "Approved" || pi.status === "Passed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : pi.status === "Pending Approval"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {pi.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {pi.status === "Pending Approval" && (
                        <button
                          onClick={() => handleApprovePI(pi)}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300"
                        >
                          Approve PI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CREATE PI MODAL ────────────────────────────────────────────────── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 border shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Create Proforma Invoice (PI)
                  </h3>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Supplier Name:</label>
                    <input
                      type="text"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="w-full p-2 rounded border font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Business Unit:</label>
                    <input
                      type="text"
                      value={businessUnit}
                      onChange={(e) => setBusinessUnit(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Payment Terms:</label>
                    <input
                      type="text"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">LC / BBLC Reference:</label>
                    <input
                      type="text"
                      value={lcRef}
                      onChange={(e) => setLcRef(e.target.value)}
                      className="w-full p-2 rounded border font-mono"
                    />
                  </div>
                </div>

                {/* Eligible Bookings Selection */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
                  <span className="font-bold block text-slate-800 dark:text-slate-200">
                    Select Approved Bookings to Consolidate into this PI:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {eligibleBookings.map((b) => (
                      <label
                        key={b.id}
                        className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer ${
                          b.isEligible
                            ? "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100"
                            : "bg-slate-100/60 dark:bg-slate-800/20 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={!b.isEligible}
                            checked={selectedBookingIds.includes(b.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBookingIds([...selectedBookingIds, b.id]);
                              } else {
                                setSelectedBookingIds(selectedBookingIds.filter((id) => id !== b.id));
                              }
                            }}
                            className="rounded text-teal-600"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {b.bookingNo} ({b.type})
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {b.supplierName} | Order {b.orderNo}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold block">${b.totalAmount.toFixed(2)}</span>
                          <span
                            className={`text-[9px] font-bold ${
                              b.isEligible ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {b.isEligible ? "Eligible (Approved)" : b.ineligibleReason}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                  >
                    Generate & Submit PI
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
