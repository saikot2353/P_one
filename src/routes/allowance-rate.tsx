import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import {
  ChevronRight,
  Wallet,
  Percent,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/allowance-rate")({
  head: () => ({
    meta: [
      { title: "Allowance Rate Configuration — CRIPTON" },
      { name: "description", content: "Configure company-wide allowance rates and percentages." },
    ],
  }),
  component: AllowanceRatePage,
});

// Dummy Data
const initialRates = [
  {
    id: "1",
    allowanceName: "House Rent",
    type: "Percentage",
    value: 50,
    basedOn: "Basic Salary",
    status: "Active",
    description: "Standard house rent allowance for all employees."
  },
  {
    id: "2",
    allowanceName: "Medical Allowance",
    type: "Percentage",
    value: 10,
    basedOn: "Basic Salary",
    status: "Active",
    description: "Monthly medical coverage allowance."
  },
  {
    id: "3",
    allowanceName: "Conveyance",
    type: "Fixed",
    value: 3000,
    basedOn: "N/A",
    status: "Active",
    description: "Fixed transport allowance."
  },
  {
    id: "4",
    allowanceName: "Food Allowance",
    type: "Fixed",
    value: 2000,
    basedOn: "N/A",
    status: "Inactive",
    description: "Daily meal allowance."
  }
];

function AllowanceRatePage() {
  const [rates, setRates] = useState(initialRates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    allowanceName: "",
    type: "Percentage",
    value: 0,
    basedOn: "Basic Salary",
    status: "Active",
    description: ""
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      allowanceName: "",
      type: "Percentage",
      value: 0,
      basedOn: "Basic Salary",
      status: "Active",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rate: any) => {
    setEditingId(rate.id);
    setFormData({
      allowanceName: rate.allowanceName,
      type: rate.type,
      value: rate.value,
      basedOn: rate.basedOn,
      status: rate.status,
      description: rate.description
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.allowanceName || formData.value <= 0) {
      toast.error("Please fill in the required fields correctly.");
      return;
    }

    if (editingId) {
      setRates(rates.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
      toast.success("Allowance rate updated successfully!");
    } else {
      setRates([...rates, { ...formData, id: Date.now().toString() }]);
      toast.success("New allowance rate created!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setRates(rates.filter(r => r.id !== id));
    toast.success("Allowance rate removed.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          {/* Main "One-Page Modal" Card */}
          <div className="w-full max-w-5xl bg-card rounded-2xl border border-border/40 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header Section */}
            <div className="bg-primary/5 px-6 py-8 border-b border-border/40 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                <Wallet className="size-48 -mt-12 -mr-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    <Link to="/" className="hover:underline">Dashboard</Link>
                    <ChevronRight className="size-3.5" />
                    <span>Configuration</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <div className="p-2.5 bg-primary rounded-xl text-primary-foreground shadow-md">
                      <Wallet className="size-6" />
                    </div>
                    Allowance Rates
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                    Configure and manage standard allowance rates, percentages, and fixed amounts used across employee payroll calculations.
                  </p>
                </div>
                <Button onClick={handleOpenNew} className="gap-2 h-11 px-6 rounded-xl shadow-md shrink-0">
                  <Plus className="size-4" /> New Allowance Rate
                </Button>
              </div>
            </div>

            {/* Content Section (List) */}
            <div className="p-6 bg-card min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rates.map((rate) => (
                  <div key={rate.id} className="group relative bg-background rounded-xl border border-border/60 p-5 hover:shadow-lg transition-all hover:border-primary/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${rate.type === 'Percentage' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {rate.type === 'Percentage' ? <Percent className="size-5" /> : <span className="font-bold text-lg leading-none">৳</span>}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{rate.allowanceName}</h3>
                          <Badge variant="outline" className={`mt-1 text-[10px] uppercase font-bold tracking-wider ${rate.status === 'Active' ? 'text-emerald-600 border-emerald-600/30 bg-emerald-500/5' : 'text-muted-foreground'}`}>
                            {rate.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-end border-b border-border/50 pb-2">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rate Value</span>
                        <span className="text-xl font-extrabold text-foreground">
                          {rate.type === 'Percentage' ? `${rate.value}%` : `৳ ${rate.value.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-end border-b border-border/50 pb-2">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Based On</span>
                        <span className="text-sm font-semibold text-foreground">{rate.basedOn}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" title={rate.description}>
                        {rate.description || "No description provided."}
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(rate)} className="p-1.5 bg-muted/80 hover:bg-primary/10 text-foreground hover:text-primary rounded-md transition-colors" title="Edit">
                        <Edit2 className="size-4" />
                      </button>
                      <button onClick={() => handleDelete(rate.id)} className="p-1.5 bg-muted/80 hover:bg-destructive/10 text-foreground hover:text-destructive rounded-md transition-colors" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {rates.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-muted/10 rounded-xl border border-dashed border-border/60">
                    <AlertCircle className="size-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-bold text-foreground">No Allowances Configured</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't set up any allowance rates yet.</p>
                    <Button onClick={handleOpenNew} variant="outline" className="gap-2">
                      <Plus className="size-4" /> Add Your First Rate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white rounded-2xl border-slate-200 shadow-xl [&>button]:right-4 [&>button]:top-4 [&>button]:rounded-lg [&>button]:border [&>button]:border-slate-200 [&>button]:bg-white [&>button]:p-1.5 [&>button]:opacity-100 hover:[&>button]:bg-slate-50">
          <DialogHeader className="px-5 py-4 border-b border-slate-100">
            <DialogTitle className="text-[17px] font-bold text-slate-800 flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-[#0f172a] text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              {editingId ? "Edit Allowance Rate" : "Create Allowance Rate"}
            </DialogTitle>
            <DialogDescription className="hidden">
              Configure the details and calculation rules for this allowance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Allowance Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter allowance name"
                value={formData.allowanceName}
                onChange={(e) => setFormData({ ...formData, allowanceName: e.target.value })}
                className="h-10 rounded-lg bg-white border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb] placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Rate Type <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount (৳)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Value <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  {formData.type === "Percentage" ? "%" : "৳"}
                </span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter value"
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="h-10 pl-7 rounded-lg border-slate-200 text-sm bg-white focus-visible:ring-1 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb] placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Based On
              </Label>
              <div className="relative">
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  value={formData.basedOn}
                  onChange={(e) => setFormData({ ...formData, basedOn: e.target.value })}
                  disabled={formData.type === "Fixed"}
                >
                  <option value="Basic Salary">Basic Salary</option>
                  <option value="Gross Salary">Gross Salary</option>
                  <option value="Net Salary">Net Salary</option>
                  <option value="N/A">N/A (Fixed)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Status <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-600">
                Description / Rules
              </Label>
              <textarea
                rows={2}
                placeholder="Briefly describe what this allowance is for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] text-sm resize-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 pt-2 flex items-center justify-end gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 rounded-lg px-6 text-[13px] font-extrabold text-slate-800 border-slate-200 hover:bg-slate-50 uppercase tracking-wide">
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleSave} className="h-10 rounded-lg px-6 text-[13px] font-extrabold bg-[#2563eb] hover:bg-[#1d4ed8] text-white uppercase tracking-wide">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
