import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { IOURequisitionModal } from "@/components/ssp/IOURequisitionModal";
import {
  ChevronRight,
  Plus,
  Trash2,
  HandCoins,
  Sparkles,
  X,
  PlusCircle,
  Save,
  Users,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ssp-iou-requisition")({
  head: () => ({
    meta: [
      { title: "Cash Requisition Entry — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Submit Cash and IOU Requisitions on behalf of yourself or team members.",
      },
    ],
  }),
  component: CashRequisitionEntryPage,
});

// CRIPTON HRIS Design System Tokens with sleek medium border-radius
const inputClass =
  "w-full h-9.5 px-3 text-[13px] font-semibold text-slate-800 bg-slate-50/70 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-400 transition-all placeholder:text-slate-400";

const readOnlyInputClass =
  "w-full h-9.5 px-3 text-[13px] font-bold text-slate-800 bg-slate-100/90 border border-slate-300 rounded-md flex items-center select-none cursor-not-allowed";

const labelClass =
  "block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1";

function Field({
  label,
  required,
  children,
  badgeText,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  badgeText?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className={labelClass}>
          {label}
          {required && <span className="text-rose-500 ml-0.5 font-bold">*</span>}
        </label>
        {badgeText && (
          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
            {badgeText}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// Helper for converting number to Bangladeshi Taka words
function convertNumberToWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return "";
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const helper = (n: number): string => {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    if (n < 1000)
      return (
        units[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + helper(n % 100) : "")
      );
    if (n < 100000)
      return (
        helper(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + helper(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        helper(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + helper(n % 100000) : "")
      );
    return (
      helper(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + helper(n % 10000000) : "")
    );
  };

  return helper(Math.floor(amount)).trim() + " Taka Only";
}

interface LineItem {
  id: string;
  purpose: string;
  remarks: string;
  amount: number;
}

const EMPLOYEE_LIST = [
  {
    id: "self",
    name: "Md Johirul Islam",
    empId: "2026058685",
    department: "Business Automation",
    designation: "Software Engineer",
    unadjusted: 0,
  },
  {
    id: "emp1",
    name: "Md. Anik Islam",
    empId: "2024019284",
    department: "HR & Admin",
    designation: "Deputy Manager",
    unadjusted: 3500,
  },
  {
    id: "emp2",
    name: "Rajebul Hasan Rajon",
    empId: "2023058192",
    department: "Production",
    designation: "Deputy Manager",
    unadjusted: 12000,
  },
  {
    id: "emp3",
    name: "Md. Zahidul Islam",
    empId: "2022001928",
    department: "Operations",
    designation: "COO",
    unadjusted: 0,
  },
  {
    id: "emp4",
    name: "Sanjida Akter",
    empId: "2025019827",
    department: "HR & Admin",
    designation: "Senior Officer",
    unadjusted: 5000,
  },
  {
    id: "emp5",
    name: "Abu Bakar Siddik",
    empId: "2026018274",
    department: "Production",
    designation: "Operator",
    unadjusted: 0,
  },
  {
    id: "emp6",
    name: "Kazi Nurul Huda",
    empId: "2023019847",
    department: "Production",
    designation: "Supervisor",
    unadjusted: 2500,
  },
  {
    id: "emp7",
    name: "Tariqul Islam",
    empId: "2025091823",
    department: "HR & Admin",
    designation: "IT Support Specialist",
    unadjusted: 0,
  },
];

const REQUISITION_FOR_OPTIONS = [
  "Advance Supplier",
  "Cash Purchase",
  "IOU - Conveyance",
  "IOU - Office Entertainment",
  "IOU - Lunch",
  "IOU - Lunch Subsidy / Dining",
  "IOU - Salary Advance",
  "IOU - Fuel",
  "IOU - Against Salary Loan",
  "IOU - Administration",
];

const DEFAULT_PURPOSES = [
  "Fund Collection & Bill Submission",
  "Tour",
  "Marketing",
  "Client Meeting",
  "Family Issue",
  "Entertainment & office Tiffin purpose.",
  "Conveyance and Lunch Bill",
  "House Rent",
  "Garage Rent",
  "Dinning",
];

function CashRequisitionEntryPage() {
  const navigate = useNavigate();
  const [isCustomPurposeModalOpen, setIsCustomPurposeModalOpen] = useState(false);
  const [customPurposeInput, setCustomPurposeInput] = useState("");
  const [purposeList, setPurposeList] = useState<string[]>(DEFAULT_PURPOSES);

  // On Behalf State
  const [onBehalf, setOnBehalf] = useState<boolean>(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>("emp1");

  // Active Employee Profile (Self vs On Behalf)
  const activeEmployee = useMemo(() => {
    if (!onBehalf) return EMPLOYEE_LIST[0];
    return EMPLOYEE_LIST.find((e) => e.id === selectedEmpId) || EMPLOYEE_LIST[1];
  }, [onBehalf, selectedEmpId]);

  // Form Header Dates
  const todayFormatted = "03/09/2026";

  // 1. REQUISITION MASTER FIELDS
  const [requisitionDate] = useState<string>(todayFormatted);
  const [requisitionFor, setRequisitionFor] = useState<string>("");
  const [chequeRequired, setChequeRequired] = useState<"No" | "Yes">("No");
  const [tenorDays, setTenorDays] = useState<string>("7");
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [possibleAdjustmentDate, setPossibleAdjustmentDate] = useState<string>("");

  // Expired Date Calculation (Default + 7 days = 10/09/2026)
  const expiredDate = useMemo(() => {
    const tenorNum = parseInt(tenorDays) || 0;
    const d = expectedDate ? new Date(expectedDate) : new Date();
    d.setDate(d.getDate() + tenorNum);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  }, [expectedDate, tenorDays]);

  // 2. REQUISITION DETAILS LINE FIELDS
  const [currentPurpose, setCurrentPurpose] = useState<string>("");
  const [currentRemarks, setCurrentRemarks] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<number | "">("");

  // Line Items Table List
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Total Amount Calculation
  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  }, [lineItems]);

  const amountInWords = useMemo(() => {
    return convertNumberToWords(totalAmount);
  }, [totalAmount]);

  // SearchableSelect options for On Behalf Employee
  const employeeOptions = useMemo(() => {
    return EMPLOYEE_LIST.filter((e) => e.id !== "self").map((e) => ({
      value: e.id,
      label: `${e.name} (${e.designation} — ${e.department}) [ID: ${e.empId}]`,
    }));
  }, []);

  // Add Item to Table
  const handleAddLineItem = () => {
    if (!currentPurpose) {
      toast.error("Please select a Purpose!");
      return;
    }
    if (!currentAmount || typeof currentAmount !== "number" || currentAmount <= 0) {
      toast.error("Please enter a valid Amount!");
      return;
    }

    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      purpose: currentPurpose,
      remarks: currentRemarks.trim(),
      amount: currentAmount,
    };

    setLineItems([...lineItems, newItem]);
    toast.success("Line item added to Requisition Details!");

    // Reset line fields
    setCurrentRemarks("");
    setCurrentAmount("");
  };

  // Remove Item from Table
  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((i) => i.id !== id));
    toast.info("Line item removed");
  };

  // Add Custom Purpose Handler
  const handleAddCustomPurpose = () => {
    if (!customPurposeInput.trim()) return;
    const newP = customPurposeInput.trim();
    if (!purposeList.includes(newP)) {
      setPurposeList([...purposeList, newP]);
    }
    setCurrentPurpose(newP);
    setCustomPurposeInput("");
    setIsCustomPurposeModalOpen(false);
    toast.success("Custom purpose added!");
  };

  // Form Submission
  const handleSaveRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requisitionFor) {
      toast.error("Please select 'Requisition For'!");
      return;
    }
    if (lineItems.length === 0) {
      toast.error("Please add at least one line item in Requisition Details!");
      return;
    }

    const recipient = onBehalf ? activeEmployee.name : "Myself";
    toast.success(
      `Cash Requisition saved successfully for ${recipient}! Opening official slip view...`
    );
    navigate({ to: "/ssp-iou-requisition-view" });
  };

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-800 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto w-full">
          {/* Top Breadcrumb & Page Header */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  HOME
                </Link>
                <ChevronRight className="size-3 text-slate-300" />
                <Link to="/ssp-new-requisition" className="hover:text-blue-600 transition-colors">
                  CASH REQUISITION
                </Link>
                <ChevronRight className="size-3 text-slate-300" />
                <span className="text-blue-600 font-bold">CASH REQUISITION ENTRY</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5 font-sans tracking-tight">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200/60 shadow-2xs">
                  <HandCoins className="size-5" />
                </div>
                <span>Cash Requisition Entry</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/ssp-new-requisition"
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <ChevronRight className="size-3.5 rotate-180 text-slate-500" />
                <span>Back to Requisitions</span>
              </Link>
            </div>
          </div>

          {/* ON BEHALF APPLICATION TOGGLE BAR */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/60 shrink-0">
                <Users className="size-4" />
              </div>
              <div>
                <label htmlFor="onBehalfToggle" className="text-xs font-extrabold text-slate-900 cursor-pointer block">
                  Submit on behalf of another employee?
                </label>
                <p className="text-[11px] text-slate-500 font-medium">
                  Toggle to apply cash requisition for team members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="onBehalfToggle"
                  type="checkbox"
                  checked={onBehalf}
                  onChange={(e) => setOnBehalf(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>

              {onBehalf && (
                <div className="w-72">
                  <SearchableSelect
                    value={selectedEmpId}
                    onChange={setSelectedEmpId}
                    options={employeeOptions}
                    placeholder="Search employee..."
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveRequisition} className="space-y-4">
            {/* ==================== CARD 1: REQUISITION MASTER ==================== */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="border-b border-slate-200/80 px-5 py-3 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-blue-600 font-sans tracking-tight">
                  Requisition Master
                </h2>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  MASTER INFO
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Row 1: Requisition Date | Requisition For | Cheque Required | Tenor (days) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Requisition Date" required>
                    <input
                      type="text"
                      value={requisitionDate}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </Field>

                  <Field label="Requisition For" required>
                    <SearchableSelect
                      value={requisitionFor}
                      onChange={setRequisitionFor}
                      options={REQUISITION_FOR_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                      placeholder="select..."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Cheque Required" required>
                    <select
                      value={chequeRequired}
                      onChange={(e) => setChequeRequired(e.target.value as "No" | "Yes")}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </Field>

                  <Field label="Tenor (days)" required>
                    <input
                      type="text"
                      value={tenorDays}
                      onChange={(e) => setTenorDays(e.target.value)}
                      placeholder="e.g. 7"
                      required
                      className={inputClass}
                    />
                  </Field>
                </div>

                {/* Row 2: Expected Date | Possible Adjustment Date | Expired Date | Previous Unadjusted */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Expected Date">
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    />
                  </Field>

                  <Field label="Possible Adjustment Date">
                    <input
                      type="date"
                      value={possibleAdjustmentDate}
                      onChange={(e) => setPossibleAdjustmentDate(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    />
                  </Field>

                  <Field label="Expired Date">
                    <input
                      type="text"
                      value={expiredDate}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </Field>

                  <Field label="Previous Unadjusted">
                    <input
                      type="text"
                      value={activeEmployee.unadjusted}
                      readOnly
                      className={readOnlyInputClass}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* ==================== CARD 2: REQUISITION DETAILS ==================== */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="border-b border-slate-200/80 px-5 py-3 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-blue-600 font-sans tracking-tight">
                  Requisition Details
                </h2>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  LINE ITEMS ({lineItems.length})
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Inputs Row: Purpose (with green + btn) | Remarks | Amount (BDT) | + Add (Orange btn) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* Purpose Selector + Green Plus Button */}
                  <div className="md:col-span-5 space-y-1">
                    <label className={labelClass}>
                      Purpose <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={currentPurpose}
                        onChange={(e) => setCurrentPurpose(e.target.value)}
                        className={`${inputClass} flex-1 cursor-pointer`}
                      >
                        <option value="">select...</option>
                        {purposeList.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setIsCustomPurposeModalOpen(true)}
                        title="Add / Select Purpose"
                        className="size-9.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-md flex items-center justify-center cursor-pointer transition shadow-xs shrink-0"
                      >
                        <Plus className="size-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remarks Input */}
                  <div className="md:col-span-4 space-y-1">
                    <label className={labelClass}>Remarks</label>
                    <input
                      type="text"
                      value={currentRemarks}
                      onChange={(e) => setCurrentRemarks(e.target.value)}
                      placeholder="Remarks / notes..."
                      className={inputClass}
                    />
                  </div>

                  {/* Amount (BDT) Input */}
                  <div className="md:col-span-2 space-y-1">
                    <label className={labelClass}>
                      Amount (BDT) <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="0.00"
                      className={`${inputClass} font-bold text-slate-900`}
                    />
                  </div>

                  {/* Orange + Add Button */}
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddLineItem}
                      className="w-full h-9.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-md flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-98 transition"
                    >
                      <Plus className="size-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Table Section matching Pakiza ERP layout with modern CRIPTON styling */}
                <div className="overflow-x-auto rounded-md border border-slate-200 mt-2">
                  <table className="w-full text-left text-xs border-collapse font-sans whitespace-nowrap">
                    <thead>
                      <tr className="bg-amber-100/70 text-slate-800 font-extrabold border-b border-amber-200 text-[11px]">
                        <th className="py-2.5 px-3 text-left w-16 border-r border-amber-200">SL</th>
                        <th className="py-2.5 px-3 text-left border-r border-amber-200">Purpose</th>
                        <th className="py-2.5 px-3 text-left border-r border-amber-200">Remarks</th>
                        <th className="py-2.5 px-3 text-left border-r border-amber-200 w-44">Amount</th>
                        <th className="py-2.5 px-3 text-center w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      {lineItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400 font-medium text-xs">
                            No line details added yet.
                          </td>
                        </tr>
                      ) : (
                        lineItems.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-600 border-r border-slate-200">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                              {item.purpose}
                            </td>
                            <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600">
                              {item.remarks || "—"}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-extrabold text-slate-900 border-r border-slate-200">
                              {item.amount.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLineItem(item.id)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded border border-rose-200 transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white text-slate-900 font-bold border-t border-slate-300">
                        <td colSpan={3} className="py-3 px-4 text-right">
                          Total Amount:
                        </td>
                        <td colSpan={2} className="py-3 px-3 text-left font-mono font-extrabold text-slate-900 text-xs">
                          {totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* In Words Callout Banner */}
                {totalAmount > 0 && (
                  <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-md text-xs text-blue-900 font-bold flex items-center gap-2">
                    <Sparkles className="size-4 text-blue-600 shrink-0" />
                    <span>In Word Taka: <span className="font-extrabold underline">{amountInWords}</span></span>
                  </div>
                )}

                {/* Save & Preview Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/ssp-iou-requisition-view" })}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="size-4 text-blue-600" />
                    <span>Preview Printable Slip</span>
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs rounded-md shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Save className="size-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* CUSTOM PURPOSE MODAL */}
        {isCustomPurposeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="size-4 text-emerald-600" />
                  <span>Add / Select Purpose</span>
                </h3>
                <button
                  onClick={() => setIsCustomPurposeModalOpen(false)}
                  className="size-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Purpose Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customPurposeInput}
                  onChange={(e) => setCustomPurposeInput(e.target.value)}
                  placeholder="e.g. Special Project Advance"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setIsCustomPurposeModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={handleAddCustomPurpose}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-md shadow-xs"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
