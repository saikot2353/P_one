import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ChevronRight, Plus, CheckCircle2, Laptop, Wrench, Package, Trash2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/ssp-ict-requisition")({
  component: ICTRequisitionPage,
});

const inputClass =
  "w-full h-10 px-3.5 text-[13px] font-semibold text-foreground bg-muted/20 border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/50";

const labelClass = "block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5";

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

  const handleDeleteService = (id: string) => {
    setServiceItems(serviceItems.filter(item => item.id !== id));
  };

  const handleDeleteStore = (id: string) => {
    setStoreItems(storeItems.filter(item => item.id !== id));
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4">

          {/* Breadcrumb & Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">SSP</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <Link to="/ssp-new-requisition" className="hover:text-foreground transition-colors">New Requisition</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-extrabold">ICT Requisition</span>
            </div>

            <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-lg px-3 py-1 font-black uppercase tracking-wider">
              System Operations Hub
            </span>
          </div>

          <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">

            {/* ── LEFT: Form Card ───────────────────────────── */}
            <div className="flex-1 bg-card border border-border/80 rounded-2xl shadow-xs flex flex-col overflow-hidden max-w-2xl relative">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent" />

              {/* Header with Tabs */}
              <div className="px-5 py-4 border-b border-border/40 bg-muted/5 flex items-center justify-between shrink-0">
                <div className="flex bg-muted p-1 rounded-xl border border-border/60">
                  <button
                    onClick={() => setMode("service")}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${mode === "service" ? "bg-background shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Wrench className="size-3.5" />
                    ICT Service
                  </button>
                  <button
                    onClick={() => setMode("store")}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${mode === "store" ? "bg-background shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Laptop className="size-3.5" />
                    ICT Store
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between">

                {mode === "service" && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <Field label="Service / Product Required" required>
                      <input
                        type="text"
                        value={sProduct}
                        onChange={e => setSProduct(e.target.value)}
                        placeholder="e.g. Printer Repair, Network Setup, OS Installation"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Justification / Details" required>
                      <textarea
                        value={sJustification}
                        onChange={e => setSJustification(e.target.value)}
                        placeholder="Please explain the details and urgency of the service requested..."
                        className={`${inputClass} h-28 py-3 resize-none`}
                      />
                    </Field>
                  </div>
                )}

                {mode === "store" && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Product For" required>
                        <SearchableSelect
                          value={stProductFor}
                          onChange={setStProductFor}
                          options={productForOptions}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Quantity" required>
                        <input
                          type="text"
                          value={stQuantity}
                          onChange={e => setStQuantity(e.target.value)}
                          placeholder="e.g. 1"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <Field label="Product Item" required>
                      <input
                        type="text"
                        value={stProduct}
                        onChange={e => setStProduct(e.target.value)}
                        placeholder="e.g. Wired Mouse, HDMI Cable, Keyboard"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Justification" required>
                      <textarea
                        value={stJustification}
                        onChange={e => setStJustification(e.target.value)}
                        placeholder="Please state the usage justification..."
                        className={`${inputClass} h-24 py-3 resize-none`}
                      />
                    </Field>
                  </div>
                )}

                {/* Add Button */}
                <div className="pt-6 border-t border-border/40 mt-6 flex justify-end">
                  <button
                    onClick={mode === "service" ? handleAddService : handleAddStore}
                    className="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-black rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 uppercase tracking-wider"
                  >
                    <Plus className="size-4" />
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: List + Submit ────────────────── */}
            <div className="flex-[1.5] flex flex-col gap-4 shrink-0 overflow-hidden">

              {/* Table Card */}
              <div className="flex-1 bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden flex flex-col relative">
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-purple-500/50 via-emerald-500/50 to-transparent" />

                <div className="px-5 py-4 border-b border-border/40 bg-muted/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-purple-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">Added Requisitions</span>
                  </div>
                  <span className="text-[10px] bg-muted border border-border/80 rounded-md px-2 py-0.5 font-bold text-muted-foreground">
                    Draft List
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-muted/15 text-muted-foreground border-b border-border/40 sticky top-0 backdrop-blur-sm">
                      <tr>
                        {mode === "service" ? (
                          <>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Item</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Justification</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] w-20 text-center">Action</th>
                          </>
                        ) : (
                          <>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Item</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] w-24">Qty</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Justification</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] w-28">For</th>
                            <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] w-20 text-center">Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-foreground bg-card divide-y divide-border/30">
                      {mode === "service" ? (
                        serviceItems.length > 0 ? (
                          serviceItems.map(item => (
                            <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                              <td className="px-5 py-3 font-bold text-foreground">{item.product}</td>
                              <td className="px-5 py-3 text-muted-foreground font-medium">{item.justification}</td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteService(item.id)}
                                  className="p-1.5 rounded-lg border border-border/60 hover:border-rose-500/20 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all inline-flex items-center justify-center"
                                  title="Delete item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-5 py-12 text-center text-muted-foreground/60 text-[11px] font-semibold italic">
                              No service requisitions added yet. Use the left panel to populate this list.
                            </td>
                          </tr>
                        )
                      ) : (
                        storeItems.length > 0 ? (
                          storeItems.map(item => (
                            <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                              <td className="px-5 py-3 font-bold text-foreground">{item.product}</td>
                              <td className="px-5 py-3 font-semibold text-primary">{item.quantity}</td>
                              <td className="px-5 py-3 text-muted-foreground font-medium">{item.justification}</td>
                              <td className="px-5 py-3">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${item.productFor === "Personal Uses" ? "bg-amber-500/10 border-amber-500/20 text-amber-600" : "bg-blue-500/10 border-blue-500/20 text-blue-600"}`}>
                                  {item.productFor.split(" ")[0]}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  onClick={() => handleDeleteStore(item.id)}
                                  className="p-1.5 rounded-lg border border-border/60 hover:border-rose-500/20 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all inline-flex items-center justify-center"
                                  title="Delete item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground/60 text-[11px] font-semibold italic">
                              No store items added yet. Use the left panel to populate this list.
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* On Behalf & Submit Card */}
              <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-5 flex flex-col gap-4 relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-500/50 to-transparent" />

                <div className="flex justify-between items-center gap-6">
                  <div className="flex-1 max-w-md">
                    <label className="flex items-center gap-3 cursor-pointer group mb-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={onBehalf}
                          onChange={e => setOnBehalf(e.target.checked)}
                        />
                        <div className="w-9 h-5 rounded-full bg-muted border border-border/80 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-wider text-foreground group-hover:text-rose-500 transition-colors">On Behalf Application</span>
                    </label>

                    <div className={`overflow-hidden transition-all duration-300 ease-out ${onBehalf ? "max-h-24 opacity-100 mt-2.5" : "max-h-0 opacity-0"}`}>
                      <SearchableSelect
                        value={onBehalfEmp}
                        onChange={setOnBehalfEmp}
                        options={employeeOptions}
                        placeholder="Select employee..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button className="h-11 px-10 bg-primary hover:bg-primary/95 text-primary-foreground text-[12px] font-black rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2 shrink-0 uppercase tracking-wider">
                    <CheckCircle2 className="size-4 animate-pulse" />
                    Submit Request
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
