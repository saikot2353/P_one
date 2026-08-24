import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Pencil,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/procurement-config-currency-rate")({
  head: () => ({
    meta: [
      { title: "Currency Rate Manager — CRIPTON Procurement" },
      { name: "description", content: "Currency Rate Manager dynamic configuration console." },
    ],
  }),
  component: CurrencyRateManagerPage,
});

interface CurrencyData {
  id: string;
  currency: string;
  rate: string;
  country: string;
  comments: string;
  isActive: string;
}

const initialData: CurrencyData[] = [
  { id: "1", currency: "BDT", rate: "1.00", country: "Bangladesh", comments: "", isActive: "Active" },
  { id: "2", currency: "Euro", rate: "130.00", country: "", comments: "Revised As per Rohan Sir Instruction", isActive: "Active" },
  { id: "3", currency: "Pound", rate: "135.50", country: "British Pound", comments: "", isActive: "Active" },
  { id: "4", currency: "USD", rate: "120.00", country: "", comments: "Revised As per Rohan Sir Instruction", isActive: "Active" },
];

function CurrencyRateManagerPage() {
  const [tableData, setTableData] = useState<CurrencyData[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CurrencyData | null>(null);

  // Form Field States
  const [currencyName, setCurrencyName] = useState("");
  const [currencyRate, setCurrencyRate] = useState("");
  const [countryName, setCountryName] = useState("");
  const [comments, setComments] = useState("");
  const [isActive, setIsActive] = useState("Active");

  // Filtering
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return (
        row.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.comments.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  const openCreateModal = () => {
    setEditingItem(null);
    setCurrencyName("");
    setCurrencyRate("");
    setCountryName("");
    setComments("");
    setIsActive("Active");
    setIsModalOpen(true);
  };

  const openEditModal = (item: CurrencyData) => {
    setEditingItem(item);
    setCurrencyName(item.currency);
    setCurrencyRate(item.rate);
    setCountryName(item.country);
    setComments(item.comments);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currencyName || !currencyRate) return;

    if (editingItem) {
      // Update
      setTableData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                currency: currencyName,
                rate: currencyRate,
                country: countryName,
                comments: comments,
                isActive: isActive,
              }
            : item
        )
      );
    } else {
      // Create
      const newId = (Math.max(0, ...tableData.map((item) => parseInt(item.id))) + 1).toString();
      const newItem: CurrencyData = {
        id: newId,
        currency: currencyName,
        rate: currencyRate,
        country: countryName,
        comments: comments,
        isActive: isActive,
      };
      setTableData((prev) => [...prev, newItem]);
    }

    closeModal();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <ProcurementTopbar />
        
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/45 pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-amber-500" />
                Currency Rate Manager
              </h2>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-normal">
                Procurement Workspace &gt; Configuration &gt; <span className="text-amber-500 font-semibold">Currency Rate</span>
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border/80 rounded-lg shadow-sm flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-border/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900">
              {/* Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <Printer className="size-3.5 text-blue-600" /> PRINT
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[10px] uppercase rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end">
                <span className="text-[11px] font-medium text-slate-500">Search:</span>
                <div className="relative w-full sm:w-56 shrink-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 h-[32px] bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded text-[11px] font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border-b border-border select-none whitespace-nowrap">
                    <th className="px-4.5 py-3 font-semibold w-16 text-center border-r border-border/40">
                      <div className="flex items-center justify-center gap-1">
                        <span>#</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3 font-semibold border-r border-border/40">
                      <div className="flex items-center justify-between">
                        <span>Currency</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3 font-semibold border-r border-border/40">
                      <div className="flex items-center justify-between">
                        <span>Rates</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3 font-semibold border-r border-border/40">
                      <div className="flex items-center justify-between">
                        <span>Country</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3 font-semibold border-r border-border/40">
                      <div className="flex items-center justify-between">
                        <span>Comments</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4.5 py-3 font-semibold">
                      <div className="flex items-center justify-between">
                        <span>IsActive</span>
                        <SlidersHorizontal className="size-2.5 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45 font-normal text-slate-700 dark:text-slate-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/15 border-b border-slate-100 transition-colors">
                      <td className="px-4.5 py-2.5 text-center border-r border-border/20">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit Currency Details"
                        >
                          <Pencil className="size-3.5" strokeWidth={2.5} />
                        </button>
                      </td>
                      <td className="px-4.5 py-2.5 text-slate-800 dark:text-slate-100 border-r border-border/20 font-normal">
                        {item.currency}
                      </td>
                      <td className="px-4.5 py-2.5 border-r border-border/20 font-mono font-normal">
                        {item.rate}
                      </td>
                      <td className="px-4.5 py-2.5 border-r border-border/20 font-normal">
                        {item.country}
                      </td>
                      <td className="px-4.5 py-2.5 border-r border-border/20 max-w-[300px] truncate text-slate-500 dark:text-slate-400 font-normal">
                        {item.comments}
                      </td>
                      <td className="px-4.5 py-2.5 font-normal">
                        <span className={`font-normal ${item.isActive === "Active" ? "text-slate-700 dark:text-slate-200" : "text-red-500"}`}>
                          {item.isActive}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-muted-foreground font-semibold">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination stats */}
            <div className="p-4 border-t border-border/45 bg-[#fcfdfd] dark:bg-slate-900/40 text-[11px] text-muted-foreground font-normal flex flex-col sm:flex-row justify-between items-center gap-3">
              <span>Showing 1 to {filteredData.length} of {tableData.length} entries</span>
              <div className="flex items-center gap-1.5 font-sans">
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Previous</button>
                <button className="size-6 bg-[#8BC34A] text-white font-semibold rounded flex items-center justify-center text-[10px]">1</button>
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Circular Plus Action Button */}
        <button
          onClick={openCreateModal}
          className="fixed bottom-6 right-6 size-12 bg-[#8BC34A] hover:bg-[#7CB342] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition duration-200 z-40 border border-[#8BC34A]/25 cursor-pointer"
          title="Add New Currency Info"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>

        {/* CURRENCY INFO DIALOG MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-sm shadow-xl border border-border/80 overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-border/40 shrink-0">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 font-sans">
                  Currency Info
                </h3>
                <button 
                  onClick={closeModal} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                >
                  <X className="size-4.5" strokeWidth={2} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-7">
                
                {/* Currency Name Input */}
                <div className="space-y-1.5 relative border-b border-slate-200 dark:border-slate-800 pb-1.5 focus-within:border-blue-500 transition-colors">
                  <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                    Currency Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currencyName}
                    onChange={(e) => setCurrencyName(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0"
                  />
                </div>

                {/* Currency Rate Input */}
                <div className="space-y-1.5 relative border-b border-slate-200 dark:border-slate-800 pb-1.5 focus-within:border-blue-500 transition-colors">
                  <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                    Currency Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currencyRate}
                    onChange={(e) => setCurrencyRate(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0 font-mono"
                  />
                </div>

                {/* Country Name Input */}
                <div className="space-y-1.5 relative border-b border-slate-200 dark:border-slate-800 pb-1.5 focus-within:border-blue-500 transition-colors">
                  <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                    Country Name
                  </label>
                  <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0"
                  />
                </div>

                {/* Comments Input */}
                <div className="space-y-1.5 relative border-b border-slate-200 dark:border-slate-800 pb-1.5 focus-within:border-blue-500 transition-colors">
                  <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                    Comments
                  </label>
                  <input
                    type="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0"
                  />
                </div>

                {/* IsActive Dropdown */}
                <div className="space-y-1 relative border-b border-slate-200 dark:border-slate-800 pb-1 focus-within:border-blue-500 transition-colors">
                  <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                    IsActive
                  </label>
                  <select
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                    className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-1 cursor-pointer focus:ring-0 appearance-none font-sans"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="absolute right-0.5 bottom-2 pointer-events-none">
                    <svg className="size-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-4 flex justify-between items-center border-t border-border/40">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 transition tracking-wide font-sans cursor-pointer uppercase py-2 px-4"
                  >
                    CLOSE
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 text-xs font-semibold text-white rounded-sm shadow-sm transition duration-150 uppercase tracking-wide cursor-pointer ${
                      editingItem 
                        ? "bg-[#2196F3] hover:bg-[#1E88E5]" 
                        : "bg-[#8BC34A] hover:bg-[#7CB342]"
                    }`}
                  >
                    {editingItem ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
