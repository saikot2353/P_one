import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { PackageOpen, Save, Plus, Trash2, Calendar, ChevronDown, CheckCircle2, User, Building2 } from "lucide-react";

export const Route = createFileRoute("/inv-issue-regular")({
  component: InvIssueRegularPage,
});

// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg px-3 h-8 py-1 text-[10.5px] font-semibold text-foreground transition-all duration-200 outline-none shadow-sm shadow-black/[0.02] ${
            readOnly || disabled
              ? "bg-slate-50 border border-slate-200/50 text-slate-400 cursor-not-allowed" 
              : "bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          } ${type === 'date' ? '[&::-webkit-calendar-picker-indicator]:opacity-0 relative z-10' : ''} ${Icon ? 'pl-8' : ''}`}
        />
        {type === 'date' && (
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-0" />
        )}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-10" />
        )}
      </div>
    </div>
  )
}

function SmartSelect({ label, value, onChange, options, defaultOption, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 relative group">
      <label className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-lg px-3 h-8 py-1 text-[10.5px] font-semibold text-foreground transition-all duration-200 outline-none appearance-none shadow-sm shadow-black/[0.02] ${
            disabled
              ? "bg-slate-50 border border-slate-200/50 text-slate-400 cursor-not-allowed" 
              : "bg-slate-100 border border-slate-200 hover:border-blue-400 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
          } ${Icon ? 'pl-8' : ''}`}
        >
          {defaultOption && <option value="" disabled>{defaultOption}</option>}
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-3.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none`} />
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 size-3.5 ${disabled ? 'text-slate-300' : 'text-slate-400'} pointer-events-none z-10`} />
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────

function InvIssueRegularPage() {
  const [issueType, setIssueType] = useState("Issue Regular");
  const [department, setDepartment] = useState("");
  const [employee, setEmployee] = useState("");
  const [issueDate, setIssueDate] = useState("2026-08-10");
  const [srnNo, setSrnNo] = useState("");
  
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [remarks, setRemarks] = useState("");
  
  const [issueList, setIssueList] = useState<any[]>([]);

  // Mock dependent employee list based on department
  const employeeOptions = department === "IT" 
    ? [{value: "E001", label: "John Doe (E001)"}, {value: "E002", label: "Jane Smith (E002)"}]
    : department === "HR"
    ? [{value: "E003", label: "Alice Johnson (E003)"}]
    : department === "Production"
    ? [{value: "E004", label: "Bob Brown (E004)"}, {value: "E005", label: "Charlie Davis (E005)"}]
    : [];

  const handleAddProduct = () => {
    if (!productName || !quantity) return;
    
    setIssueList([...issueList, {
      id: Date.now(),
      itemName: productName,
      uom: "PCS",
      availableQuantity: "50",
      quantity: quantity,
      damageQty: "0",
      specifications: "N/A",
      unitPrice: "120.00",
      totalPrice: (Number(quantity) * 120).toFixed(2)
    }]);
    
    setProductName("");
    setQuantity("");
  };

  const removeProduct = (id: number) => {
    setIssueList(issueList.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-4 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <PackageOpen className="size-5 text-blue-600" />
                </div>
                Regular Issue
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground mt-1.5 uppercase tracking-wider">
                Distribute products to departments and employees
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 h-8 py-1.5 bg-background border border-border/60 hover:bg-muted text-foreground font-bold text-[10.5px] tracking-wider rounded-lg transition-all shadow-sm">
                CLEAR
              </button>
            </div>
          </div>

          {/* Type Details Card */}
          <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            
            <div className="p-4 md:p-5">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-border/30">
                <h2 className="text-[13px] font-bold text-foreground tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Type Details
                </h2>
                <div className="w-64">
                  <SmartSelect 
                    label="Issue Type" 
                    value={issueType} 
                    onChange={(e: any) => setIssueType(e.target.value)} 
                    options={[
                      {value: "Issue Regular", label: "Issue Regular"},
                      {value: "Issue Special", label: "Issue Special"},
                    ]} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <SmartSelect 
                    label="Select Department" 
                    icon={Building2}
                    value={department} 
                    onChange={(e: any) => {
                      setDepartment(e.target.value);
                      setEmployee(""); // Reset employee when dept changes
                    }} 
                    defaultOption="Choose Dept..."
                    options={[
                      {value: "IT", label: "Information Technology"},
                      {value: "HR", label: "Human Resources"},
                      {value: "Production", label: "Production Floor"},
                    ]} 
                  />
                  <SmartSelect 
                    label="Issue To (Employee)" 
                    icon={User}
                    value={employee} 
                    onChange={(e: any) => setEmployee(e.target.value)} 
                    disabled={!department}
                    defaultOption={department ? "Select Employee..." : "Select Dept First"}
                    options={employeeOptions} 
                  />
                </div>
                
                <SmartInput label="Issue Date" type="date" value={issueDate} onChange={(e: any) => setIssueDate(e.target.value)} />
                <SmartInput label="SRN No" value={srnNo} onChange={(e: any) => setSrnNo(e.target.value)} placeholder="Enter SRN Number..." />
                
                <div className="lg:col-span-2">
                  <SmartSelect 
                    label="Product Name" 
                    value={productName} 
                    onChange={(e: any) => setProductName(e.target.value)} 
                    defaultOption="Select product to add..."
                    options={[
                      {value: "Yarn A", label: "Yarn A (100% Cotton)"},
                      {value: "Spare Part B", label: "Machine Bearing 50mm"},
                      {value: "Stationery", label: "A4 Paper Ream"},
                    ]} 
                  />
                </div>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <SmartInput label="Quantity" type="number" value={quantity} onChange={(e: any) => setQuantity(e.target.value)} placeholder="0" />
                  </div>
                  <button 
                    onClick={handleAddProduct}
                    disabled={!productName || !quantity}
                    className="h-8 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-white font-bold text-[10.5px] tracking-wider rounded-lg transition-all shadow-sm shadow-amber-500/20 flex items-center gap-2"
                  >
                    <Plus className="size-3.5" strokeWidth={3} />
                    ADD
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Details Card */}
          <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            
            <div className="p-4 md:p-5 flex flex-col min-h-[400px]">
              <h2 className="text-[13px] font-bold text-foreground tracking-wide flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Issue Details
              </h2>
              
              {/* Product Table */}
              <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm flex-1 mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-border/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2 px-3 w-12 text-center">SL</th>
                        <th className="py-2 px-3">Item Name</th>
                        <th className="py-2 px-3 w-24">Uom</th>
                        <th className="py-2 px-3 w-32 text-right">Available Qty</th>
                        <th className="py-2 px-3 w-24 text-right">Quantity</th>
                        <th className="py-2 px-3 w-24 text-right">Damage Qty</th>
                        <th className="py-2 px-3">Specifications</th>
                        <th className="py-2 px-3 w-28 text-right">Unit Price</th>
                        <th className="py-2 px-3 w-28 text-right">Total Price</th>
                        <th className="py-2 px-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10.5px]">
                      {issueList.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <PackageOpen className="size-10 opacity-20 mb-3" />
                              <span className="font-semibold text-sm">No items added yet</span>
                              <span className="text-xs opacity-70 mt-1">Select a product and quantity above to add it to the issue list</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        issueList.map((row, idx) => (
                          <tr key={row.id} className="border-b border-border/40 hover:bg-slate-50/50 transition-colors group">
                            <td className="py-1.5 px-3 text-center font-medium text-slate-500">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-semibold text-foreground">{row.itemName}</td>
                            <td className="py-1.5 px-3 text-slate-500">{row.uom}</td>
                            <td className="py-1.5 px-3 text-right text-emerald-600 font-medium">{row.availableQuantity}</td>
                            <td className="py-1.5 px-3 text-right font-bold text-blue-600">{row.quantity}</td>
                            <td className="py-1.5 px-3 text-right text-slate-500">{row.damageQty}</td>
                            <td className="py-1.5 px-3 text-slate-500">{row.specifications}</td>
                            <td className="py-1.5 px-3 text-right font-medium text-slate-600">{row.unitPrice}</td>
                            <td className="py-1.5 px-3 text-right font-bold text-foreground">{row.totalPrice}</td>
                            <td className="py-1.5 px-3 text-center">
                              <button 
                                onClick={() => removeProduct(row.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Remarks and Submit */}
              <div className="mt-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-10">
                  <SmartInput 
                    label="Remarks" 
                    value={remarks} 
                    onChange={(e: any) => setRemarks(e.target.value)} 
                    placeholder="Enter any additional remarks or notes for this issue..." 
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button 
                    disabled={issueList.length === 0}
                    className="w-full h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold text-[10.5px] tracking-wider rounded-lg transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
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
