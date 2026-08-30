import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  ChevronRight,
  Eye,
  Trash2,
  AlertCircle,
  X,
  Search,
  Pencil,
  ClipboardList,
  FileDown,
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

export const Route = createFileRoute("/jd-list")({
  head: () => ({
    meta: [
      { title: "JD List — CRIPTON" },
      { name: "description", content: "Manage Job Descriptions across all departments." },
    ],
  }),
  component: JDListPage,
});

interface JDItem {
  id: string;
  department: string;
  designation: string;
  reportsTo: string;
  responsibilities: string;
  qualifications: string;
  lastUpdated: string;
}

const INITIAL_JDS: JDItem[] = [
  {
    id: "JD-001",
    department: "HR, Admin and Compliance",
    designation: "HR Manager",
    reportsTo: "Managing Director",
    responsibilities: "Oversee all HR operations, payroll processing, and compliance reporting.",
    qualifications: "MBA in HR, 5+ years of experience in similar role.",
    lastUpdated: "2026-07-15",
  },
  {
    id: "JD-002",
    department: "Business Automation",
    designation: "Software Engineer",
    reportsTo: "Tech Lead",
    responsibilities: "Develop and maintain core ERP modules. Write clean, scalable code.",
    qualifications: "B.Sc in Computer Science, React/Node.js proficiency.",
    lastUpdated: "2026-08-01",
  },
];

const MOCK_DEPARTMENTS = [
  "HR, Admin and Compliance",
  "Business Automation",
  "Implementation & Business Analysis",
  "Accounts & Finance",
  "Sales & Marketing",
];

const MOCK_DESIGNATIONS: Record<string, string[]> = {
  "HR, Admin and Compliance": ["HR Manager", "Admin Executive", "Receptionist"],
  "Business Automation": ["Software Engineer", "Tech Lead", "QA Engineer"],
  "Implementation & Business Analysis": ["Business Analyst", "Implementation Executive"],
  "Accounts & Finance": ["Accountant", "Finance Manager"],
  "Sales & Marketing": ["Sales Executive", "Marketing Manager"],
};

function JDListPage() {
  const [jds, setJds] = useState<JDItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_jd_list");
      return saved ? JSON.parse(saved) : INITIAL_JDS;
    }
    return INITIAL_JDS;
  });

  const [selectedJd, setSelectedJd] = useState<JDItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editingJdId, setEditingJdId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    reportsTo: "",
    responsibilities: "",
    qualifications: "",
  });

  const saveJds = (newJds: JDItem[]) => {
    setJds(newJds);
    localStorage.setItem("hris_jd_list", JSON.stringify(newJds));
  };

  const handleOpenNew = () => {
    setFormData({
      department: "",
      designation: "",
      reportsTo: "",
      responsibilities: "",
      qualifications: "",
    });
    setEditingJdId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (jd: JDItem) => {
    setFormData({
      department: jd.department,
      designation: jd.designation,
      reportsTo: jd.reportsTo === "N/A" ? "" : jd.reportsTo,
      responsibilities: jd.responsibilities,
      qualifications: jd.qualifications,
    });
    setEditingJdId(jd.id);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.department || !formData.designation) {
      toast.error("Please select a Department and Designation.");
      return;
    }

    if (editingJdId) {
      const updatedJds = jds.map((j) =>
        j.id === editingJdId
          ? {
              ...j,
              department: formData.department,
              designation: formData.designation,
              reportsTo: formData.reportsTo || "N/A",
              responsibilities: formData.responsibilities,
              qualifications: formData.qualifications,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : j
      );
      saveJds(updatedJds);
      toast.success("Job Description updated successfully!");
    } else {
      const newJD: JDItem = {
        id: `JD-00${jds.length + 1}`,
        department: formData.department,
        designation: formData.designation,
        reportsTo: formData.reportsTo || "N/A",
        responsibilities: formData.responsibilities,
        qualifications: formData.qualifications,
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      saveJds([newJD, ...jds]);
      toast.success("Job Description created successfully!");
    }
    setIsModalOpen(false);
    setEditingJdId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this Job Description?")) {
      saveJds(jds.filter((j) => j.id !== id));
      toast.success("Job Description deleted.");
    }
  };

  const filteredJds = useMemo(() => {
    return jds.filter((j) => {
      if (filterDept !== "All" && j.department !== filterDept) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return j.designation.toLowerCase().includes(q) || j.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [jds, searchQuery, filterDept]);

  // Modal classes exactly like HR Policies and configure pages
  const insetLabelClass = "text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 block";
  const insetInputClass = "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm appearance-none";

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
              <span className="text-slate-800 font-bold">JD List</span>
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
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="All">Select Department</option>
                    {MOCK_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
              </div>
              <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M14 2v6h6"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg> Excel
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
              {filteredJds.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                   <AlertCircle className="size-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-slate-700">No Job Descriptions Found</h3>
                   <p className="text-sm text-slate-500 mt-1 max-w-sm">
                     {searchQuery ? "No JDs matched your search criteria." : "There are currently no Job Descriptions created."}
                   </p>
                 </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-slate-700 bg-white border-b border-slate-200">
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[60px] text-center">SL</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[100px]">JD ID</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 min-w-[200px]">DESIGNATION & DEPARTMENT</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 min-w-[150px]">REPORTS TO</th>
                      <th className="px-5 py-4 font-bold border-r border-slate-100 w-[120px]">LAST UPDATED</th>
                      <th className="px-5 py-4 font-bold text-center w-[120px]">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJds.map((jd, index) => (
                      <tr key={jd.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 border-r border-slate-100 text-center text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 font-medium text-slate-800">
                          {jd.id}
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100">
                          <div className="font-medium text-slate-800">{jd.designation}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{jd.department}</div>
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100">
                          <div className="font-medium text-slate-800">{jd.reportsTo}</div>
                        </td>
                        <td className="px-5 py-4 border-r border-slate-100 text-slate-500 text-[11px] font-medium">
                          {jd.lastUpdated}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button className="text-amber-500 hover:text-amber-600 transition-colors" onClick={() => handleEdit(jd)} title="Edit">
                              <Pencil className="size-3.5" />
                            </button>
                            <button className="text-rose-500 hover:text-rose-600 transition-colors" onClick={() => handleDelete(jd.id)} title="Delete">
                              <Trash2 className="size-3.5" />
                            </button>
                            <button className="text-blue-500 hover:text-blue-600 transition-colors" onClick={() => setSelectedJd(jd)} title="View">
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
              <span>{filteredJds.length} records</span>
            </div>
          </div>
        </div>
      </main>

      {/* View JD Modal */}
      <Dialog open={!!selectedJd} onOpenChange={(open) => !open && setSelectedJd(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          {selectedJd && (
            <>
              <div className="bg-[#2563eb] p-6 text-white flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJd.designation}</h2>
                  <div className="flex items-center gap-3 mt-2 text-blue-100 text-sm font-medium">
                    <span>ID: {selectedJd.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                    <span>{selectedJd.department}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
                  <Briefcase className="size-6 text-white/90" />
                </div>
              </div>
              
              <div className="p-6 md:p-8 bg-slate-50 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Reports To</h3>
                    <p className="text-sm font-semibold text-slate-800">{selectedJd.reportsTo}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Last Updated</h3>
                    <p className="text-sm font-semibold text-slate-800">{selectedJd.lastUpdated}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <ClipboardList className="size-4" /> Responsibilities
                    </h3>
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedJd.responsibilities}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Qualifications
                    </h3>
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedJd.qualifications}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                <Button variant="outline" className="h-9 px-6 rounded-lg font-semibold text-blue-600 border-blue-200 hover:bg-blue-50">
                  <FileDown className="size-4 mr-2" /> Download PDF
                </Button>
                <Button variant="outline" onClick={() => setSelectedJd(null)} className="h-9 px-6 rounded-lg font-semibold text-slate-600 border-slate-200 hover:bg-slate-50">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create JD Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setEditingJdId(null);
      }}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white rounded-2xl shadow-xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="size-5 text-[#2563eb]" />
              {editingJdId ? "Edit Job Description (JD)" : "Create Job Description (JD)"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-slate-50/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>
                  Department <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    className={insetInputClass}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value, designation: "" })}
                  >
                    <option value="" disabled>Select Department</option>
                    {MOCK_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <Label className={insetLabelClass}>
                  Designation <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    className={insetInputClass}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    disabled={!formData.department}
                  >
                    <option value="" disabled>Select Designation</option>
                    {formData.department && MOCK_DESIGNATIONS[formData.department]?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className={insetLabelClass}>
                Reports To (Designation)
              </Label>
              <Input
                placeholder="e.g. Head of Department"
                value={formData.reportsTo}
                onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                className={insetInputClass}
              />
            </div>

            <div>
              <Label className={insetLabelClass}>
                Key Responsibilities & Duties
              </Label>
              <textarea
                rows={4}
                placeholder="List the main tasks and daily operations expected from this role..."
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm resize-none"
              />
            </div>

            <div>
              <Label className={insetLabelClass}>
                Required Qualifications & Skills
              </Label>
              <textarea
                rows={3}
                placeholder="List educational background, experience, and soft/hard skills required..."
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-9 rounded-lg px-5 text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50 uppercase tracking-wide">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="h-9 rounded-lg px-5 text-xs font-bold bg-[#2563eb] hover:bg-blue-700 text-white uppercase tracking-wide">
              {editingJdId ? "Save Changes" : "Create JD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
