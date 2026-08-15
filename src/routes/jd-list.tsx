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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");

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
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.department || !formData.designation) {
      toast.error("Please select a Department and Designation.");
      return;
    }

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
    setIsModalOpen(false);
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
        
        <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Link to="/" className="hover:underline">Dashboard</Link>
              <ChevronRight className="size-3.5" />
              <span>Job Descriptions</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <div className="p-2.5 bg-primary rounded-xl text-primary-foreground shadow-md">
                    <Briefcase className="size-6" />
                  </div>
                  Job Descriptions (JD) List
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Manage roles and responsibilities mapped by department and designation.
                </p>
              </div>
              
              <Button onClick={handleOpenNew} className="gap-2 h-11 px-6 rounded-xl shadow-md shrink-0 bg-[#2563eb] hover:bg-blue-700">
                <Plus className="size-4" /> Create JD
              </Button>
            </div>
          </div>

          {/* Filters & Content Area */}
          <div className="bg-card rounded-2xl border border-border/40 shadow-xl overflow-hidden flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500 delay-100">
            <div className="p-4 border-b border-border/40 bg-muted/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by designation or department..." 
                  className="pl-9 h-10 rounded-xl bg-background border-border/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="h-10 px-4 rounded-xl bg-background border border-border/60 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="All">All Departments</option>
                  {MOCK_DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto bg-card">
              {filteredJds.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                   <AlertCircle className="size-12 text-muted-foreground/30 mb-4" />
                   <h3 className="text-lg font-bold text-foreground">No Job Descriptions Found</h3>
                   <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                     {searchQuery ? "No JDs matched your search criteria." : "There are currently no Job Descriptions created."}
                   </p>
                 </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[120px]">Actions</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 w-[100px]">JD ID</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 min-w-[200px]">Designation & Department</th>
                      <th className="px-3 py-4 font-bold border-r border-border/30 min-w-[150px]">Reports To</th>
                      <th className="px-3 py-4 font-bold">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/45">
                    {filteredJds.map(jd => (
                      <tr key={jd.id} className="group hover:bg-[#f8fafc] transition-all cursor-pointer">
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
                              title="Edit JD"
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(jd.id); }}
                              className="size-6 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition flex items-center justify-center shadow-3xs"
                              title="Delete JD"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2 border-r border-border/30 font-semibold text-foreground/80">
                          {jd.id}
                        </td>
                        <td className="px-3 py-2 border-r border-border/30">
                          <div className="font-bold text-foreground">{jd.designation}</div>
                          <div className="text-[10px] text-muted-foreground/70 mt-0.5 truncate max-w-[300px]">{jd.department}</div>
                        </td>
                        <td className="px-3 py-2 border-r border-border/30">
                          <div className="font-medium text-foreground/80">{jd.reportsTo}</div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground/80 text-[11px] font-semibold">
                          {jd.lastUpdated}
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

      {/* Create JD Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white rounded-2xl shadow-xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="size-5 text-[#2563eb]" />
              Create Job Description (JD)
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
              Create JD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
