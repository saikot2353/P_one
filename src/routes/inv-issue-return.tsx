import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { FileSpreadsheet, Printer, Search, Filter, ChevronDown, Calendar, X, Pencil, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";


export const Route = createFileRoute("/inv-issue-return")({
  component: InvIssueReturnPage,
});

type IssueRecord = {
  id: string;
  issueTo: string;
  issueNo: string;
  issueDate: string;
  srnNo: string;
  challan: string;
  gatePass: string;
  loanStatus: string;
};

const mockData: IssueRecord[] = [
  { id: "1", issueTo: "Core Development", issueNo: "1112", issueDate: "15/07/2026", srnNo: "390428", challan: "2026071", gatePass: "", loanStatus: "" },
  { id: "2", issueTo: "Admin", issueNo: "1113", issueDate: "18/07/2026", srnNo: "391166", challan: "2026071", gatePass: "", loanStatus: "" },
  { id: "3", issueTo: "Admin", issueNo: "1114", issueDate: "18/07/2026", srnNo: "390949", challan: "2026071", gatePass: "", loanStatus: "" },
  { id: "4", issueTo: "Digital Marketing", issueNo: "1115", issueDate: "18/07/2026", srnNo: "390888", challan: "2026071", gatePass: "", loanStatus: "" },
  { id: "5", issueTo: "Admin", issueNo: "1116", issueDate: "18/07/2026", srnNo: "390727", challan: "2026071", gatePass: "", loanStatus: "" },
];

// ─── Smart UI Components ──────────────────────────────────────────────────

function SmartInput({ label, value, onChange, placeholder, type = "text", readOnly = false, icon: Icon, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1.5 relative group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
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
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 placeholder:text-slate-400 border border-transparent"
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
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-[36px] rounded-lg px-3 text-[11px] font-medium transition-all duration-200 outline-none appearance-none ${
            disabled
              ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-transparent" 
              : "bg-slate-100/80 hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border focus:border-blue-500/30 text-slate-700 cursor-pointer border border-transparent"
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

function InvIssueReturnPage() {
  const [issueType, setIssueType] = useState("Issue Regular");
  const [dateFrom, setDateFrom] = useState("2026-07-11");
  const [dateTo, setDateTo] = useState("2026-09-09");
  const [issueTo, setIssueTo] = useState("All");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  const [selectedIssue, setSelectedIssue] = useState<IssueRecord | null>(null);
  const [printIssue, setPrintIssue] = useState<IssueRecord | null>(null);
  const [returnDate, setReturnDate] = useState("2026-08-10");
  const [remarks, setRemarks] = useState("");
  
  // State for the return quantities in the modal
  const [returnQtys, setReturnQtys] = useState<Record<string, string>>({});

  const filteredData = mockData.filter(row => 
    Object.values(row).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleReturnQtyChange = (id: string, value: string) => {
    setReturnQtys(prev => ({ ...prev, [id]: value }));
  };

  const handleReturnSubmit = () => {
    // Submit logic would go here
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-foreground">
      <InventorySidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <InventoryTopbar />
        
        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1400px] mx-auto mt-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                <ArrowLeftRight className="size-6 text-purple-500" />
                Issue Return
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                Manage and process returning issued items
              </p>
            </div>
          </div>

          {/* Filter Section Accordion */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <Filter className="size-4 text-amber-500" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Filter Options</span>
              </div>
              <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isFiltersOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isFiltersOpen ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6 items-end">
                  
                  <div className="md:col-span-3">
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
                  
                  <div className="md:col-span-2">
                    <SmartInput label="DATE FROM" type="date" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
                  </div>
                  
                  <div className="md:col-span-2">
                    <SmartInput label="DATE TO" type="date" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
                  </div>
                  
                  <div className="md:col-span-3">
                    <SmartSelect 
                      label="ISSUE TO" 
                      value={issueTo} 
                      onChange={(e: any) => setIssueTo(e.target.value)} 
                      options={[
                        {value: "All", label: "All..."},
                        {value: "Admin", label: "Admin"},
                        {value: "Core Development", label: "Core Development"},
                      ]} 
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button className="w-full h-[36px] bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all flex items-center justify-center gap-2">
                      SEARCH
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 overflow-hidden relative">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-purple-500 rounded-r-md"></div>
            
            {/* Table Toolbar */}
            <div className="p-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-1.5 h-[32px] px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors shadow-sm">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  EXCEL
                </button>
                <button className="flex items-center gap-1.5 h-[32px] px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors shadow-sm">
                  <Printer className="size-3.5 text-slate-600" />
                  PRINT
                </button>
              </div>
              
              <div className="w-full sm:w-auto relative group">
                <div className="relative">
                  <input 
                    type="text"
                    className="w-full sm:w-64 h-[32px] rounded-lg bg-slate-100/80 border border-slate-200 hover:border-blue-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 pl-9 pr-3 text-[10.5px] font-semibold text-slate-700 transition-all duration-200 outline-none placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto p-6 pt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 text-[9.5px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="py-3 px-4 w-24">ACTIONS</th>
                    <th className="py-3 px-4">ISSUE TO</th>
                    <th className="py-3 px-4 w-28 text-center">ISSUE NO</th>
                    <th className="py-3 px-4 w-32 text-center">ISSUE DATE</th>
                    <th className="py-3 px-4 w-32 text-center">SRN NO</th>
                    <th className="py-3 px-4 w-32 text-center">CHALLAN</th>
                    <th className="py-3 px-4 w-28 text-center">GATEPASS</th>
                    <th className="py-3 px-4 w-32 text-center">LOAN STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr 
                        key={row.id} 
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setPrintIssue(row)}
                              className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                              title="View Issue Challan"
                            >
                              <Printer className="size-4" strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => setSelectedIssue(row)}
                              className="text-purple-500/70 hover:text-purple-600 transition-colors p-1"
                              title="Process Return"
                            >
                              <Pencil className="size-4" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-700">{row.issueTo}</td>
                        <td className="py-2.5 px-4 text-center font-medium text-slate-600">{row.issueNo}</td>
                        <td className="py-2.5 px-4 text-center text-slate-600">{row.issueDate}</td>
                        <td className="py-2.5 px-4 text-center text-slate-500">{row.srnNo}</td>
                        <td className="py-2.5 px-4 text-center text-slate-500">{row.challan}</td>
                        <td className="py-2.5 px-4 text-center text-slate-500">{row.gatePass || "-"}</td>
                        <td className="py-2.5 px-4 text-center text-slate-500">{row.loanStatus || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
              <div>Showing {filteredData.length} of {mockData.length} entries</div>
              <div className="flex gap-1.5">
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors disabled:opacity-50">Previous</button>
                <button className="px-3 py-1.5 border border-slate-200 bg-blue-500 text-white rounded-md font-bold shadow-sm">1</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors">2</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print Preview Modal - Premium Issue Challan Design */}
      {printIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#f8f9fa] w-full max-w-5xl rounded-xl shadow-2xl relative my-auto border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Action Bar (Not Printable) */}
            <div className="absolute top-0 inset-x-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 print:hidden">
              <div className="text-[13px] font-bold text-slate-700 tracking-wide">Print Preview: Issue Challan</div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="h-[32px] px-5 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="size-3.5" />
                  PRINT DOCUMENT
                </button>
                <button 
                  onClick={() => setPrintIssue(null)} 
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 sm:p-12 mt-14 print:mt-0 font-sans text-slate-800 relative bg-white m-0 sm:m-8 sm:mt-20 print:m-0 sm:shadow-lg sm:border border-slate-200">
              
              {/* Document Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                <img src={pakizaLogo} alt="Pakiza Software" className="h-10 object-contain mb-2" />
                
                <div className="text-center">
                  <h1 className="text-xl font-medium text-emerald-600 tracking-wide mb-1">Pakiza Software Limited</h1>
                  <p className="text-[11px] text-slate-500 font-medium">Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                </div>
                
                <div className="w-48"></div> {/* Spacer to keep center aligned */}
              </div>

              {/* Title */}
              <div className="text-center mb-10">
                <h2 className="text-xl font-semibold text-blue-500 tracking-wide">Issue Challan</h2>
              </div>

              {/* Info Grid (Premium Look) */}
              <div className="grid grid-cols-3 gap-8 mb-10 text-[11px]">
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Challan No:</span>
                    <span className="font-bold text-slate-800">{printIssue.challan}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Challan Date:</span>
                    <span className="font-bold text-slate-800">{printIssue.issueDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">SRN No:</span>
                    <span className="font-bold text-slate-800">{printIssue.srnNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Buyer Name:</span>
                    <span className="font-bold text-slate-800"></span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Issue No:</span>
                    <span className="font-bold text-slate-800">{printIssue.issueNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Issue Date:</span>
                    <span className="font-bold text-slate-800">{printIssue.issueDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Batch No:</span>
                    <span className="font-bold text-slate-800"></span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Issue To:</span>
                    <span className="font-bold text-slate-800">{printIssue.issueTo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Product Type:</span>
                    <span className="font-bold text-slate-800">General Items</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500 font-medium">Remarks:</span>
                    <span className="font-bold text-slate-800"></span>
                  </div>
                </div>
              </div>

              {/* Issue Details Table */}
              <div className="mb-4">
                <div className="text-[11px] font-medium text-slate-400 italic mb-2">Issue Details</div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-t border-b border-slate-200 text-[11px] text-slate-500 font-medium">
                      <th className="py-3 px-2 font-normal w-12 text-center">#</th>
                      <th className="py-3 px-2 font-normal">Item</th>
                      <th className="py-3 px-2 font-normal w-[30%]">Specification</th>
                      <th className="py-3 px-2 font-normal w-24">Unit</th>
                      <th className="py-3 px-2 font-normal w-32">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] text-slate-800">
                    <tr className="border-b border-slate-100">
                      <td className="py-4 px-2 text-center font-medium text-slate-500">1</td>
                      <td className="py-4 px-2">Pencil Battery (Size: AA)</td>
                      <td className="py-4 px-2 text-slate-500"></td>
                      <td className="py-4 px-2 font-medium">PCS</td>
                      <td className="py-4 px-2 font-medium">1.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Issue Return Process Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-slate-800 w-full max-w-4xl rounded-xl shadow-2xl relative my-auto border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
              <div className="text-[13px] font-bold text-slate-800 tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Process Issue Return
              </div>
              <button 
                onClick={() => setSelectedIssue(null)} 
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <SmartInput 
                  label="RETURN DATE *" 
                  type="date" 
                  value={returnDate} 
                  onChange={(e: any) => setReturnDate(e.target.value)} 
                />
                <SmartInput 
                  label="REMARKS" 
                  value={remarks} 
                  onChange={(e: any) => setRemarks(e.target.value)} 
                  placeholder="Enter return notes..."
                />
              </div>
              
              <div className="rounded-xl border border-slate-100 overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 text-[9.5px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">SL</th>
                      <th className="py-3 px-4">PRODUCT NAME</th>
                      <th className="py-3 px-4 w-20 text-center">UNIT</th>
                      <th className="py-3 px-4 w-24 text-right">RATE</th>
                      <th className="py-3 px-4 w-28 text-center">ISSUED QTY</th>
                      <th className="py-3 px-4 w-28 text-center">RETURNED QTY</th>
                      <th className="py-3 px-4 w-32 text-center">NEW RETURN</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-400">1</td>
                      <td className="py-3 px-4 font-bold text-slate-700">Pencil Battery (Size: AA)</td>
                      <td className="py-3 px-4 text-center text-slate-500">PCS</td>
                      <td className="py-3 px-4 text-right text-slate-500">0.000</td>
                      <td className="py-3 px-4 text-center font-medium text-blue-600">1.000</td>
                      <td className="py-3 px-4 text-center text-slate-500">0.000</td>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="number"
                          min="0"
                          value={returnQtys["item1"] || ""}
                          onChange={(e) => handleReturnQtyChange("item1", e.target.value)}
                          placeholder="0"
                          className="w-full h-[28px] rounded-md px-2 text-[11px] font-bold text-center border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="h-16 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-6 mt-auto">
              <button 
                onClick={() => setSelectedIssue(null)}
                className="h-[36px] px-6 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] tracking-wider rounded-lg transition-colors"
              >
                CLOSE
              </button>
              <button 
                onClick={handleReturnSubmit}
                className="h-[36px] px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] tracking-wider rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                SUBMIT
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
