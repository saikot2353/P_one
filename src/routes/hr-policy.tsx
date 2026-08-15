import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  UploadCloud,
  ChevronRight,
  Eye,
  Trash2,
  AlertCircle,
  FileDown,
  X,
  Search,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/hr-policy")({
  head: () => ({
    meta: [
      { title: "HR Policies — CRIPTON" },
      { name: "description", content: "Manage and upload company HR policies." },
    ],
  }),
  component: HRPolicyPage,
});

interface PolicyItem {
  id: string;
  title: string;
  body: string;
  fileName: string | null;
  uploadDate: string;
  status: "Active" | "Inactive";
}

const INITIAL_POLICIES: PolicyItem[] = [
  {
    id: "POL-001",
    title: "Code of Conduct",
    body: "This policy outlines the expected behavior and ethical standards for all employees working at the company.",
    fileName: "Code_of_Conduct_2026.pdf",
    uploadDate: "2026-01-15",
    status: "Active",
  },
  {
    id: "POL-002",
    title: "Leave Policy",
    body: "Details the procedures for applying for annual, sick, and casual leave.",
    fileName: "Leave_Policy.pdf",
    uploadDate: "2026-02-01",
    status: "Active",
  },
];

function HRPolicyPage() {
  const [policies, setPolicies] = useState<PolicyItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_policies_list");
      return saved ? JSON.parse(saved) : INITIAL_POLICIES;
    }
    return INITIAL_POLICIES;
  });

  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    fileName: null as string | null,
    status: "Active" as "Active" | "Inactive",
  });

  const savePolicies = (newPolicies: PolicyItem[]) => {
    setPolicies(newPolicies);
    localStorage.setItem("hris_policies_list", JSON.stringify(newPolicies));
  };

  const handleOpenNew = () => {
    setFormData({
      title: "",
      body: "",
      fileName: null,
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, fileName: e.target.files[0].name });
      toast.success(`Attached ${e.target.files[0].name}`);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Please provide both a Title and a Body for the policy.");
      return;
    }

    const newPolicy: PolicyItem = {
      id: `POL-00${policies.length + 1}`,
      title: formData.title,
      body: formData.body,
      fileName: formData.fileName,
      status: formData.status as any,
      uploadDate: new Date().toISOString().split("T")[0],
    };

    savePolicies([newPolicy, ...policies]);
    toast.success("Policy saved successfully!");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      savePolicies(policies.filter((p) => p.id !== id));
      toast.success("Policy deleted.");
    }
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      if (filterStatus !== "All" && p.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);
      }
      return true;
    });
  }, [policies, searchQuery, filterStatus]);

  // Modal classes
  const insetLabelClass = "text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 block";
  const insetInputClass = "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        
        <div className="flex-1 flex flex-col p-4 w-full mx-auto">
          {/* Top Header - Breadcrumbs & Actions */}
          <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
              <ChevronRight className="size-3" />
              <Link to="/" className="hover:text-[#2563eb] transition-colors">Configure</Link>
              <ChevronRight className="size-3" />
              <span className="text-slate-800 font-bold">HR Policy</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-8 px-4 rounded-md border-slate-200 text-slate-700 text-[10px] font-bold tracking-wide uppercase bg-white hover:bg-slate-50 shadow-sm">
                <svg className="size-3.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy From...
              </Button>
              <Button onClick={handleOpenNew} className="h-8 px-4 rounded-md bg-[#2563eb] hover:bg-blue-700 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
                <Plus className="size-3.5 mr-1.5" /> Add New Record
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-4 justify-between items-center mb-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Search Department..." 
                  className="pl-9 h-9 rounded-lg bg-white border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden sm:block">
                 <select
                    className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm appearance-none min-w-[160px]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
              </div>
              <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white">
                <FileText className="size-3.5" /> Excel
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Print
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13v6"/><path d="M10 13c1.1 0 2 .9 2 2s-.9 2-2 2"/><path d="M10 16H8v3"/><path d="M15 13v6"/><path d="M15 13h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2"/></svg>
                PDF
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500 delay-100">
            <div className="flex-1 overflow-x-auto">
              {filteredPolicies.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                   <AlertCircle className="size-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Policies Found</h3>
                   <p className="text-sm text-slate-500 mt-1 max-w-sm">
                     {searchQuery ? "No policies matched your search criteria." : "There are currently no HR policies uploaded."}
                   </p>
                 </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-slate-700 bg-white border-b border-slate-200">
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[60px] text-center">SL</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[100px]">CODE</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 min-w-[200px]">TITLE</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[140px]">ATTACHMENT</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[100px] text-center">STATUS</th>
                      <th className="px-5 py-4 font-bold text-center w-[120px]">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPolicies.map((policy, index) => (
                      <tr key={policy.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 border-r border-slate-100 text-center text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 font-medium text-slate-800">
                          {policy.id}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 font-medium text-slate-800">
                          {policy.title}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 font-medium text-slate-800">
                          {policy.fileName ? (
                            <span className="truncate" title={policy.fileName}>{policy.fileName}</span>
                          ) : (
                            <span className="text-slate-400 italic">No attachment</span>
                          )}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 text-center">
                          <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide ${policy.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button className="text-amber-500 hover:text-amber-600 transition-colors" title="Edit">
                              <Pencil className="size-3.5" />
                            </button>
                            <button className="text-rose-500 hover:text-rose-600 transition-colors" onClick={() => handleDelete(policy.id)} title="Delete">
                              <Trash2 className="size-3.5" />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors" onClick={() => setSelectedPolicy(policy)} title="View">
                              <Eye className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <div className="flex items-center gap-2">
              <button className="hover:text-slate-700 transition-colors">&lt; Previous</button>
              <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded font-bold text-slate-700 shadow-sm">1</button>
              <button className="hover:text-slate-700 transition-colors">Next &gt;</button>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              <span>{filteredPolicies.length} records</span>
            </div>
          </div>
        </div>
      </main>

      {/* View Policy Modal */}
      <Dialog open={!!selectedPolicy} onOpenChange={(open) => !open && setSelectedPolicy(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          {selectedPolicy && (
            <>
              <div className="bg-[#2563eb] p-6 text-white flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPolicy.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-blue-100 text-sm font-medium">
                    <span>ID: {selectedPolicy.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                    <span>Updated: {selectedPolicy.uploadDate}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedPolicy.status === 'Active' ? 'bg-emerald-400/20 text-emerald-50 border border-emerald-400/30' : 'bg-white/10 text-white/80 border border-white/20'}`}>
                  {selectedPolicy.status}
                </div>
              </div>
              <div className="p-6 md:p-8 bg-slate-50 max-h-[60vh] overflow-y-auto">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-h-[200px]">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 border-b border-slate-100 pb-2">Policy Description</h3>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedPolicy.body}
                  </div>
                </div>

                {selectedPolicy.fileName && (
                  <div className="mt-6">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Attachment</h3>
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{selectedPolicy.fileName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">PDF Document</p>
                        </div>
                      </div>
                      <Button variant="outline" className="gap-2 h-9 border-slate-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                        <FileDown className="size-4" /> Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <Button variant="outline" onClick={() => setSelectedPolicy(null)} className="h-9 px-6 rounded-lg font-semibold text-slate-600 border-slate-200 hover:bg-slate-50">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload/Create Modal - Matching Personnel Config Modals */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-2xl shadow-xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UploadCloud className="size-5 text-[#2563eb]" />
              Upload HR Policy
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-slate-50/30">
            <div>
              <Label className={insetLabelClass}>
                Policy Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Employee Code of Conduct"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={insetInputClass}
              />
            </div>

            <div>
              <Label className={insetLabelClass}>
                Policy Body / Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                rows={4}
                placeholder="Provide a detailed description or paste the policy text here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm resize-none"
              />
            </div>

            <div>
              <Label className={insetLabelClass}>
                Attachment (Optional)
              </Label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 group bg-white cursor-pointer">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg"
                />
                <div className="p-2.5 bg-slate-50 group-hover:bg-blue-50 rounded-full transition-colors">
                  <UploadCloud className="size-5 text-slate-400 group-hover:text-[#2563eb]" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, DOCX</p>
                </div>
              </div>

              {formData.fileName && (
                <div className="mt-2 flex items-center justify-between p-2 rounded-lg border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 overflow-hidden text-emerald-700">
                    <FileText className="size-4 shrink-0" />
                    <span className="text-xs font-bold truncate">{formData.fileName}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, fileName: null })}
                    className="p-1 hover:bg-emerald-100 text-emerald-600 rounded transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <Label className={insetLabelClass}>
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                className={insetInputClass}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-9 rounded-lg px-5 text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50 uppercase tracking-wide">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="h-9 rounded-lg px-5 text-xs font-bold bg-[#2563eb] hover:bg-blue-700 text-white uppercase tracking-wide">
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
