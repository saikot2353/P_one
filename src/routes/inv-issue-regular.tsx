import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { PackageOpen, Plus, Trash2, Calendar, ChevronDown, CheckCircle2, User, Building2 } from "lucide-react";

export const Route = createFileRoute("/inv-issue-regular")({
  component: InvIssueRegularPage,
});

// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
          className={`w-full h-[36px] rounded-lg px-3 text-[11px] font-medium transition-all duration-200 outline-none ${
            readOnly || disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 placeholder:text-slate-400"
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
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-[36px] rounded-lg px-3 text-[11px] font-medium transition-all duration-200 outline-none appearance-none ${
            disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 cursor-pointer"
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
  const [quantity, setQuantity] = useState("0");
  
  const [remarks, setRemarks] = useState("");
  
  const [issueList, setIssueList] = useState<any[]>([
    {
      id: 1,
      itemName: "Yarn A",
      uom: "PCS",
      availableQuantity: "50",
      quantity: "3",
      damageQty: "0",
      specifications: "N/A",
      unitPrice: "120.00",
      totalPrice: "360.00"
    }
  ]);

  const employeeOptions = department === "IT" 
    ? [{value: "E001", label: "John Doe"}]
    : department === "HR"
    ? [{value: "E003", label: "Alice Johnson"}]
    : department === "Production"
    ? [{value: "E004", label: "Bob Brown"}]
    : [];

  const handleAddProduct = () => {
    if (!productName || !quantity || quantity === "0") return;
    
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
    setQuantity("0");
  };

  const removeProduct = (id: number) => {
    setIssueList(issueList.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1400px] mx-auto mt-4">
          
          {/* Type Details Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-amber-500 rounded-r-md"></div>
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Type Details
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
                <div className="md:col-span-4">
                  <SmartSelect 
                    label="ISSUE TYPE" 
                    value={issueType} 
                    onChange={(e: any) => setIssueType(e.target.value)} 
                    options={[
                      {value: "Issue Regular", label: "Issue Regular"},
                      {value: "Issue Special", label: "Issue Special"},
                    ]} 
                  />
                </div>
                <div className="md:col-span-4">
                  <SmartSelect 
                    label="SELECT DEPARTMENT" 
                    icon={Building2}
                    value={department} 
                    onChange={(e: any) => {
                      setDepartment(e.target.value);
                      setEmployee("");
                    }} 
                    defaultOption="Choose Dept..."
                    options={[
                      {value: "IT", label: "Information Technology"},
                      {value: "HR", label: "Human Resources"},
                      {value: "Production", label: "Production Floor"},
                    ]} 
                  />
                </div>
                <div className="md:col-span-4">
                  <SmartSelect 
                    label="ISSUE TO (EMPLOYEE)" 
                    icon={User}
                    value={employee} 
                    onChange={(e: any) => setEmployee(e.target.value)} 
                    disabled={!department}
                    defaultOption={department ? "Select Employee..." : "Select Dept First"}
                    options={employeeOptions} 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <SmartInput label="ISSUE DATE" type="date" value={issueDate} onChange={(e: any) => setIssueDate(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <SmartInput label="SRN NO" value={srnNo} onChange={(e: any) => setSrnNo(e.target.value)} placeholder="Enter SRN Number..." />
                </div>
                
                <div className="md:col-span-4">
                  <SmartSelect 
                    label="PRODUCT NAME" 
                    value={productName} 
                    onChange={(e: any) => setProductName(e.target.value)} 
                    defaultOption="Select product to add..."
                    options={[
                      {value: "Yarn A", label: "Yarn A"},
                      {value: "Spare Part B", label: "Machine Bearing 50mm"},
                    ]} 
                  />
                </div>
                
                <div className="md:col-span-4 flex gap-4 items-end">
                  <div className="flex-1">
                    <SmartInput label="QUANTITY" type="number" value={quantity} onChange={(e: any) => setQuantity(e.target.value)} placeholder="0" />
                  </div>
                  <button 
                    onClick={handleAddProduct}
                    disabled={!productName || !quantity || quantity === "0"}
                    className="h-[36px] px-8 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold text-[11px] tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="size-3.5" strokeWidth={3} />
                    ADD
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Details Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-r-md"></div>
            
            <div className="p-6 md:p-8 flex flex-col min-h-[450px]">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Issue Details
              </h2>
              
              {/* Product Table */}
              <div className="rounded-xl border border-slate-100 overflow-hidden flex-1 mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/50 text-[9.5px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="py-3 px-4 w-12 text-center">SL</th>
                        <th className="py-3 px-4">ITEM NAME</th>
                        <th className="py-3 px-4 w-20">UOM</th>
                        <th className="py-3 px-4 w-28 text-center">AVAILABLE QTY</th>
                        <th className="py-3 px-4 w-24 text-center">QUANTITY</th>
                        <th className="py-3 px-4 w-24 text-center">DAMAGE QTY</th>
                        <th className="py-3 px-4">SPECIFICATIONS</th>
                        <th className="py-3 px-4 w-24 text-right">UNIT PRICE</th>
                        <th className="py-3 px-4 w-24 text-right">TOTAL PRICE</th>
                        <th className="py-3 px-4 w-16 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {issueList.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-slate-400">
                            No items added yet
                          </td>
                        </tr>
                      ) : (
                        issueList.map((row, idx) => (
                          <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-700">{row.itemName}</td>
                            <td className="py-3 px-4 text-slate-500">{row.uom}</td>
                            <td className="py-3 px-4 text-center text-emerald-500 font-medium">{row.availableQuantity}</td>
                            <td className="py-3 px-4 text-center font-bold text-blue-600">{row.quantity}</td>
                            <td className="py-3 px-4 text-center text-slate-400">{row.damageQty}</td>
                            <td className="py-3 px-4 text-slate-400">{row.specifications}</td>
                            <td className="py-3 px-4 text-right text-slate-600">{row.unitPrice}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-800">{row.totalPrice}</td>
                            <td className="py-3 px-4 text-center">
                              <button 
                                onClick={() => removeProduct(row.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
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
              <div className="mt-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-10">
                  <SmartInput 
                    label="REMARKS" 
                    value={remarks} 
                    onChange={(e: any) => setRemarks(e.target.value)} 
                    placeholder="Enter any additional remarks or notes for this issue..." 
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button 
                    disabled={issueList.length === 0}
                    className="w-full h-[36px] bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
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
