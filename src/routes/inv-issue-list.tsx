import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { InventorySidebar } from "@/components/dashboard/InventorySidebar";
import { InventoryTopbar } from "@/components/dashboard/InventoryTopbar";
import { Printer, FileSpreadsheet, FileText, Search, Filter, ChevronDown, Calendar, X } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";


export const Route = createFileRoute("/inv-issue-list")({
  component: InvIssueListPage,
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

function InvIssueListPage() {
  const [issueType, setIssueType] = useState("Issue Regular");
  const [dateFrom, setDateFrom] = useState("2026-07-11");
  const [dateTo, setDateTo] = useState("2026-08-10");
  const [issueTo, setIssueTo] = useState("All");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  const [selectedIssue, setSelectedIssue] = useState<IssueRecord | null>(null);

  const filteredData = mockData.filter(row => 
    Object.values(row).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <FileText className="size-6 text-blue-500" />
                Issue List
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                View and manage product issuance records
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
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-r-md"></div>
            
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
                    <th className="py-3 px-4 w-20">ACTIONS</th>
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
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
                            <button 
                              onClick={() => setSelectedIssue(row)}
                              className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                              title="Print Issue Details"
                            >
                              <Printer className="size-4" strokeWidth={2.5} />
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
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors">3</button>
                <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:text-slate-800 transition-colors disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Issue Print Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-slate-800 w-full max-w-5xl rounded-xl shadow-2xl relative my-auto border border-slate-200 overflow-hidden">
            
            {/* Print action bar (not printable) */}
            <div className="absolute top-0 inset-x-0 h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 print:hidden">
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
                  onClick={() => setSelectedIssue(null)} 
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Print Content */}
            <div className="p-10 sm:p-14 mt-14 print:mt-0 font-sans">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
                <img src={pakizaLogo} alt="Pakiza Software" className="h-10 object-contain mb-2" />
                
                <div className="text-center">
                  <h1 className="text-xl text-emerald-600 font-normal tracking-wide">Pakiza Software Limited</h1>
                  <p className="text-[10px] text-slate-500 mt-1">Khan ABC Tradeplex House#37, Floor#11 (B-11), Road#2, Dhaka-1205</p>
                  <h2 className="text-2xl text-blue-500 mt-4 font-normal tracking-wide">Issue Challan</h2>
                </div>
                
                <div className="w-48"></div> {/* Spacer for centering */}
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-3 gap-8 text-[11px] mb-8 text-slate-600">
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Challan No:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.challan}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Challan Date:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.issueDate}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">SRN No:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.srnNo}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Buyer Name:</div>
                    <div className="font-bold text-slate-800"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-20 font-bold text-slate-500">Issue No:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.issueNo}</div>
                  </div>
                  <div className="flex">
                    <div className="w-20 font-bold text-slate-500">Issue Date:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.issueDate}</div>
                  </div>
                  <div className="flex">
                    <div className="w-20 font-bold text-slate-500">Batch No:</div>
                    <div className="font-bold text-slate-800"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Issue To:</div>
                    <div className="font-bold text-slate-800">{selectedIssue.issueTo}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Product Type:</div>
                    <div className="font-bold text-slate-800">General Items</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-bold text-slate-500">Remarks:</div>
                    <div className="font-bold text-slate-800"></div>
                  </div>
                </div>
              </div>

              <div className="italic text-slate-400 text-[10px] mb-2 font-medium">Issue Details</div>

              {/* Items Table */}
              <table className="w-full text-[11px] border-collapse border-y border-slate-300">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="p-2 text-left font-bold text-slate-500 w-12">#</th>
                    <th className="p-2 text-left font-bold text-slate-500">Item</th>
                    <th className="p-2 text-left font-bold text-slate-500 w-[25%]">Specification</th>
                    <th className="p-2 text-left font-bold text-slate-500 w-24">Unit</th>
                    <th className="p-2 text-left font-bold text-slate-500 w-24">Quantity</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-200">
                    <td className="p-2 py-4">1</td>
                    <td className="p-2 py-4 font-semibold text-slate-800">Facial Tissue</td>
                    <td className="p-2 py-4"></td>
                    <td className="p-2 py-4">BOX</td>
                    <td className="p-2 py-4">1.000</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 py-4">2</td>
                    <td className="p-2 py-4 font-semibold text-slate-800">Towel Tissue</td>
                    <td className="p-2 py-4"></td>
                    <td className="p-2 py-4">PKT</td>
                    <td className="p-2 py-4">3.000</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 py-4">3</td>
                    <td className="p-2 py-4 font-semibold text-slate-800">Toilet Tissue</td>
                    <td className="p-2 py-4"></td>
                    <td className="p-2 py-4">PCS</td>
                    <td className="p-2 py-4">7.000</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
