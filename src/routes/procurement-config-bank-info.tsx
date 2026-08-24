import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  Plus,
  Pencil,
  Trash2,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/procurement-config-bank-info")({
  head: () => ({
    meta: [
      { title: "Bank Information Setup — CRIPTON Procurement" },
      { name: "description", content: "Bank Information Setup dynamic mock database console." },
    ],
  }),
  component: ProcurementConfigBankInfoPage,
});

function ProcurementConfigBankInfoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tableHeaders = ["Bank ID", "Bank Name", "Branch Name", "Swift Code", "Country", "Contact Person", "Status"];
  const columnKeys = ["id", "name", "branch", "swift", "country", "contact", "status"];
  const initialData = [
    {
        "id": "BNK-001",
        "name": "Eastern Bank Ltd",
        "branch": "Banani",
        "swift": "EBLDBDHA",
        "country": "Bangladesh",
        "contact": "A. K. Azad",
        "status": "Active"
    },
    {
        "id": "BNK-002",
        "name": "HSBC Bangladesh",
        "branch": "Main Office",
        "swift": "HSBCBDHA",
        "country": "Bangladesh",
        "contact": "N. Chowdhury",
        "status": "Active"
    }
];

  const [tableData, setTableData] = useState<any[]>(initialData);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Filtering
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.values(row).some((val) => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  const openCreateModal = () => {
    setEditingItem(null);
    const initialForm: Record<string, string> = {};
    columnKeys.forEach((key) => {
      initialForm[key] = "";
    });
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setTableData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
      );
    } else {
      const newId = (Math.max(0, ...tableData.map((item) => parseInt(item.id) || 0)) + 1).toString();
      const newItem = { ...formData, id: newId };
      setTableData((prev) => [...prev, newItem]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setTableData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative font-sans">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <ProcurementTopbar />
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="size-5.5 text-primary" />
                Bank Information Setup
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Procurement Workspace &gt; Configuration &gt; <span className="text-amber-500 font-semibold">Bank Information Setup</span>
              </p>
            </div>
            <button 
              onClick={openCreateModal}
              className="h-9 px-4 bg-[#0d6efd] hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              Add New Record
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900">
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
                <button className="h-[32px] px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] rounded flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs font-sans">
                  <FileText className="size-3.5 text-red-600" /> PDF
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-3 h-[32px] bg-[#f8fafc] border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded-md text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 dark:bg-slate-800">
                    <th className="px-4 py-2.5 font-semibold w-16 text-center border-r border-slate-100">
                      <div className="flex items-center justify-center gap-1">
                        <span>SL</span>
                      </div>
                    </th>
                    <th className="px-4 py-2.5 font-semibold w-24 text-center border-r border-slate-100">
                      <div className="flex items-center justify-center">
                        <span>ACTIONS</span>
                      </div>
                    </th>
                    {tableHeaders.map((header: string) => (
                      <th key={header} className="px-4 py-2.5 font-semibold border-r border-slate-100 last:border-r-0">
                        <div className="flex items-center justify-between">
                          <span>{header}</span>
                          <SlidersHorizontal className="size-2.5 text-slate-400" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-700 dark:text-slate-200 bg-white dark:bg-transparent">
                  {filteredData.map((row: any, index: number) => (
                    <tr key={row.id || index} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                      <td className="px-4 py-2.5 text-center border-r border-slate-100 text-slate-500 font-normal">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 text-center border-r border-slate-100">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(row)}
                            className="text-orange-500 hover:text-orange-700 transition"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-rose-500 hover:text-rose-700 transition"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                      {columnKeys.map((key: string) => {
                        const value = row[key];
                        const isStatus = key === "status" || key === "isActive";

                        return (
                          <td key={key} className="px-4.5 py-2.5 border-r border-slate-100 last:border-r-0 max-w-[220px] truncate font-normal text-slate-700 dark:text-slate-200">
                            {isStatus ? (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                value === "Approved" || value === "Active" || value === "Audit Complete" || value === "Verified"
                                  ? "bg-success/15 text-success-foreground"
                                  : value === "Draft"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                              }`}>
                                {value}
                              </span>
                            ) : (
                              <span>
                                {value}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={tableHeaders.length + 2} className="text-center py-10 text-muted-foreground font-semibold">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination stats */}
            <div className="p-4 border-t border-slate-100 bg-[#fcfdfd] dark:bg-slate-900/40 text-[11px] text-muted-foreground font-normal flex flex-col sm:flex-row justify-between items-center gap-3">
              <span>Showing 1 to {filteredData.length} of {tableData.length} entries</span>
              <div className="flex items-center gap-1.5 font-sans">
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Previous</button>
                <button className="size-6 bg-[#8BC34A] text-white font-semibold rounded flex items-center justify-center text-[10px]">1</button>
                <button className="px-2 py-1 text-slate-400 hover:text-slate-700 font-normal">Next</button>
              </div>
            </div>

          </div>
        </div>

        {/* CURRENCY INFO DIALOG MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-sm shadow-xl border border-border/80 overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-border/40 shrink-0">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 font-sans">
                  Bank Information Setup Info
                </h3>
                <button 
                  onClick={closeModal} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                >
                  <X className="size-4.5" strokeWidth={2} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSave} className="flex-1 p-5 space-y-7">
                {columnKeys.map((key, idx) => {
                  if (key === "id") return null;
                  const labelName = tableHeaders[idx - 1] || key;
                  const value = formData[key] || "";
                  
                  return (
                    <div key={key} className="space-y-1.5 relative border-b border-slate-200 dark:border-slate-800 pb-1.5 focus-within:border-blue-500 transition-colors">
                      <label className="text-[10px] font-normal text-slate-400 block tracking-wide select-none">
                        {labelName} {key === "status" || key === "isActive" ? "" : "*"}
                      </label>
                      {key === "status" || key === "isActive" ? (
                        <select
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0 cursor-pointer font-sans"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full bg-transparent outline-none border-none text-[12px] font-normal text-slate-800 dark:text-slate-100 py-0.5 focus:ring-0"
                        />
                      )}
                    </div>
                  );
                })}

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
