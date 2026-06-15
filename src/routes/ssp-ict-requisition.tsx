import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ChevronRight, Plus, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ssp-ict-requisition")({
  component: ICTRequisitionPage,
});

const inputClass =
  "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/50";

const labelClass = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// Define item types for the list
interface ServiceItem {
  id: string;
  product: string;
  justification: string;
}

interface StoreItem {
  id: string;
  productFor: string;
  product: string;
  quantity: string;
  justification: string;
}

export default function ICTRequisitionPage() {
  const [mode, setMode] = useState<"service" | "store">("service");

  // Form State (Service)
  const [sProduct, setSProduct] = useState("");
  const [sJustification, setSJustification] = useState("");

  // Form State (Store)
  const [stProductFor, setStProductFor] = useState("Department Uses");
  const [stProduct, setStProduct] = useState("");
  const [stQuantity, setStQuantity] = useState("");
  const [stJustification, setStJustification] = useState("");

  // List State
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);

  // Submission State
  const [onBehalf, setOnBehalf] = useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = useState("");

  const productForOptions = [
    { value: "Department Uses", label: "Department Uses" },
    { value: "Personal Uses", label: "Personal Uses" },
  ];

  const employeeOptions = [
    { value: "emp1", label: "Md. Anik Islam (Deputy Manager)" },
    { value: "emp2", label: "Rajebul Hasan Rajon (Deputy Manager)" },
    { value: "emp3", label: "Md. Zahidul Islam (COO)" },
  ];

  const handleAddService = () => {
    if (!sProduct || !sJustification) return;
    setServiceItems([...serviceItems, { id: Date.now().toString(), product: sProduct, justification: sJustification }]);
    setSProduct("");
    setSJustification("");
  };

  const handleAddStore = () => {
    if (!stProduct || !stQuantity || !stJustification) return;
    setStoreItems([...storeItems, { id: Date.now().toString(), productFor: stProductFor, product: stProduct, quantity: stQuantity, justification: stJustification }]);
    setStProduct("");
    setStQuantity("");
    setStJustification("");
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">SSP</Link>
            <ChevronRight className="size-3" />
            <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">New Requisition</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-semibold">ICT Requisition</span>
          </div>

          <div className="flex-1 flex gap-5 min-h-0">

            {/* ── LEFT: Form Card ───────────────────────────── */}
            <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden max-w-2xl">

              {/* Header with Tabs */}
              <div className="px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex bg-muted/50 p-1 rounded-lg border border-border/40">
                  <button
                    onClick={() => setMode("service")}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${mode === "service" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    ICT Service
                  </button>
                  <button
                    onClick={() => setMode("store")}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${mode === "store" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    ICT Store
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between">

                {mode === "service" && (
                  <div className="space-y-5">
                    <Field label="Product" required>
                      <input
                        type="text"
                        value={sProduct}
                        onChange={e => setSProduct(e.target.value)}
                        placeholder="e.g. Printer Repair"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Justification" required>
                      <input
                        type="text"
                        value={sJustification}
                        onChange={e => setSJustification(e.target.value)}
                        placeholder="e.g. Printer is jamming frequently"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                )}

                {mode === "store" && (
                  <div className="space-y-5">
                    <Field label="Product For" required>
                      <SearchableSelect
                        value={stProductFor}
                        onChange={setStProductFor}
                        options={productForOptions}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Product" required>
                      <input
                        type="text"
                        value={stProduct}
                        onChange={e => setStProduct(e.target.value)}
                        placeholder="e.g. Mouse"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Quantity" required>
                      <input
                        type="text"
                        value={stQuantity}
                        onChange={e => setStQuantity(e.target.value)}
                        placeholder="e.g. 2"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Justification" required>
                      <input
                        type="text"
                        value={stJustification}
                        onChange={e => setStJustification(e.target.value)}
                        placeholder="e.g. Needed for new hires"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                )}

                {/* Add Button */}
                <div className="pt-6">
                  <button
                    onClick={mode === "service" ? handleAddService : handleAddStore}
                    className="h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2"
                  >
                    <Plus className="size-3.5" />
                    ADD
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: List + Submit ────────────────── */}
            <div className="flex-[1.5] flex flex-col gap-4 shrink-0 overflow-hidden">

              {/* Table Card */}
              <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                  <span className="text-[12px] font-bold text-foreground">Added Items</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-muted/10 text-muted-foreground border-b border-border/40 sticky top-0 backdrop-blur-sm">
                      <tr>
                        {mode === "service" ? (
                          <>
                            <th className="px-4 py-2.5 font-semibold">Item</th>
                            <th className="px-4 py-2.5 font-semibold">Justification</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-2.5 font-semibold">Item</th>
                            <th className="px-4 py-2.5 font-semibold">Quantity</th>
                            <th className="px-4 py-2.5 font-semibold">Justification</th>
                            <th className="px-4 py-2.5 font-semibold">For</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-foreground bg-card">
                      {mode === "service" ? (
                        serviceItems.length > 0 ? (
                          serviceItems.map(item => (
                            <tr key={item.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                              <td className="px-4 py-2.5">{item.product}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{item.justification}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground/60 text-[11px] italic">
                              No items added yet.
                            </td>
                          </tr>
                        )
                      ) : (
                        storeItems.length > 0 ? (
                          storeItems.map(item => (
                            <tr key={item.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                              <td className="px-4 py-2.5">{item.product}</td>
                              <td className="px-4 py-2.5">{item.quantity}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{item.justification}</td>
                              <td className="px-4 py-2.5">{item.productFor}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground/60 text-[11px] italic">
                              No items added yet.
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* On Behalf & Submit Card */}
              <div className="bg-card border border-border/60 rounded-xl shadow-sm p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 max-w-sm">
                    <label className="flex items-center gap-3 cursor-pointer group mb-2">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={onBehalf}
                          onChange={e => setOnBehalf(e.target.checked)}
                        />
                        <div className="w-9 h-5 rounded-full bg-muted border border-border peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
                      </div>
                      <span className="text-[12px] font-semibold text-foreground group-hover:text-rose-500 transition-colors">On Behalf</span>
                    </label>

                    <div className={`overflow-hidden transition-all duration-300 ease-out ${onBehalf ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      <SearchableSelect
                        value={onBehalfEmp}
                        onChange={setOnBehalfEmp}
                        options={employeeOptions}
                        placeholder="Select employee..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button className="h-10 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="size-4" />
                    SUBMIT
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
