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
        
        <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Link to="/" className="hover:underline">Dashboard</Link>
              <ChevronRight className="size-3.5" />
              <span>HR Policies</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <div className="p-2.5 bg-primary rounded-xl text-primary-foreground shadow-md">
                    <FileText className="size-6" />
                  </div>
                  HR Policy Directory
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Manage all company policies, guidelines, and manuals in one central hub.
                </p>
              </div>
              
              <Button onClick={handleOpenNew} className="gap-2 h-11 px-6 rounded-xl shadow-md shrink-0 bg-[#2563eb] hover:bg-blue-700">
                <Plus className="size-4" /> Upload New Policy
              </Button>
            </div>
          </div>

          {/* Filters & Content Area */}
          <div className="bg-card rounded-2xl border border-border/40 shadow-xl overflow-hidden flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500 delay-100">
            <div className="p-4 border-b border-border/40 bg-muted/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search policies by title or keyword..." 
                  className="pl-9 h-10 rounded-xl bg-background border-border/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {["All", "Active", "Inactive"].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex-1 sm:flex-none ${filterStatus === status ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background border border-border/60 text-muted-foreground hover:bg-muted'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-x-auto bg-card">
              {filteredPolicies.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                   <AlertCircle className="size-12 text-muted-foreground/30 mb-4" />
                   <h3 className="text-lg font-bold text-foreground">No Policies Found</h3>
                   <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                     {searchQuery ? "No policies matched your search criteria." : "There are currently no HR policies uploaded."}
                   </p>
                 </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[120px]">Actions</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[100px]">Policy ID</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 min-w-[200px]">Title</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[120px]">Status</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[140px]">Attachment</th>
                      <th className="px-3 py-4 font-bold">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/45">
                    {filteredPolicies.map(policy => (
                      <tr key={policy.id} className="group hover:bg-[#f8fafc] transition-all cursor-pointer">
                        <td className="px-2 py-2 border-r border-border/30">
                          <div className="flex items-center gap-1.5 justify-center">
                            <button 
                              className="size-6 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              title="View Document"
                            >
                              <Eye className="size-3" />
                            </button>
                            <button 
                              className="size-6 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              title="Edit Policy"
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(policy.id); }}
                              className="size-6 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              title="Delete Policy"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-border/30 font-semibold text-foreground/80">
                          {policy.id}
                        </td>
                        <td className="px-3 py-2 border-r border-border/30">
                          <div className="font-bold text-foreground">{policy.title}</div>
                          <div className="text-[10px] text-muted-foreground/70 mt-0.5 truncate max-w-[300px]">{policy.body}</div>
                        </td>
                        <td className="px-3 py-2 border-r border-border/30">
                          <Badge variant="outline" className={`shrink-0 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 ${policy.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                            {policy.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 border-r border-border/30">
                          {policy.fileName ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 w-max max-w-[150px]">
                              <FileDown className="size-3 shrink-0" />
                              <span className="truncate" title={policy.fileName}>{policy.fileName}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50 italic">No attachment</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground/80 text-[11px] font-semibold">
                          {policy.uploadDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

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
