import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Settings,
  Building2,
  Calculator,
  Percent,
  PiggyBank,
  Briefcase,
  ChevronRight,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-tax")({
  head: () => ({
    meta: [
      { title: "Tax & Compliance Setup — CRIPTON HRIS" },
      { name: "description", content: "Configure Tax slabs and statutory compliance rules." },
    ],
  }),
  component: ConfigureTaxPage,
});

const TABS = [
  { id: "slabs_general", label: "General Tax Slabs", icon: Calculator },
  { id: "slabs_female", label: "Female / Senior Slabs", icon: Percent },
  { id: "rebate_investment", label: "Investment Rebate", icon: PiggyBank },
  { id: "statutory_compliance", label: "Statutory Compliance", icon: Briefcase },
];

function ConfigureTaxPage() {
  const [activeTab, setActiveTab] = useState("slabs_general");
  const [selectedCompany, setSelectedCompany] = useState("Cripton Tech");
  
  // Tax Slab States
  const [generalSlabs, setGeneralSlabs] = useState([
    { id: 1, limit: 350000, rate: 0, desc: "First 3,50,000 BDT" },
    { id: 2, limit: 100000, rate: 5, desc: "Next 1,00,000 BDT" },
    { id: 3, limit: 300000, rate: 10, desc: "Next 3,00,000 BDT" },
    { id: 4, limit: 400000, rate: 15, desc: "Next 4,00,000 BDT" },
    { id: 5, limit: 500000, rate: 20, desc: "Next 5,00,000 BDT" },
    { id: 6, limit: -1, rate: 25, desc: "Rest of the amount" },
  ]);

  const [femaleSlabs, setFemaleSlabs] = useState([
    { id: 1, limit: 400000, rate: 0, desc: "First 4,00,000 BDT" },
    { id: 2, limit: 100000, rate: 5, desc: "Next 1,00,000 BDT" },
    { id: 3, limit: 300000, rate: 10, desc: "Next 3,00,000 BDT" },
    { id: 4, limit: 400000, rate: 15, desc: "Next 4,00,000 BDT" },
    { id: 5, limit: 500000, rate: 20, desc: "Next 5,00,000 BDT" },
    { id: 6, limit: -1, rate: 25, desc: "Rest of the amount" },
  ]);

  // Rebate & Investment
  const [rebateConfig, setRebateConfig] = useState({
    maxInvestmentPercentage: 25,
    maxInvestmentAmount: 1500000,
    rebatePercentage: 15,
  });

  // Statutory Compliance
  const [complianceConfig, setComplianceConfig] = useState({
    enableTDS: true,
    pfCompanyMatch: 100,
    pfEligibleMonths: 6,
    gratuityEligibleYears: 5,
    gratuityCalculation: "Basic x 1",
  });

  const handleSave = () => {
    toast.success(`Tax & Compliance configuration saved successfully for ${selectedCompany}!`);
  };

  const addSlab = (type: "general" | "female") => {
    const newSlab = { id: Date.now(), limit: 0, rate: 0, desc: "Custom Amount" };
    if (type === "general") setGeneralSlabs([...generalSlabs, newSlab]);
    else setFemaleSlabs([...femaleSlabs, newSlab]);
  };

  const removeSlab = (type: "general" | "female", id: number) => {
    if (type === "general") setGeneralSlabs(generalSlabs.filter(s => s.id !== id));
    else setFemaleSlabs(femaleSlabs.filter(s => s.id !== id));
  };

  const renderSlabEditor = (slabs: any[], type: "general" | "female", title: string, subtitle: string) => (
    <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <button 
          onClick={() => addSlab(type)}
          className="h-9 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs flex items-center gap-2 transition-colors"
        >
          <Plus className="size-3.5" />
          Add Slab
        </button>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/3">Slab Description</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/4">Amount Limit (BDT)</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/4">Tax Rate (%)</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {slabs.map((slab) => (
              <tr key={slab.id} className="bg-transparent hover:bg-muted/10 transition-colors">
                <td className="p-3">
                  <input
                    type="text"
                    value={slab.desc}
                    onChange={(e) => {
                      const updated = slabs.map(s => s.id === slab.id ? { ...s, desc: e.target.value } : s);
                      type === "general" ? setGeneralSlabs(updated) : setFemaleSlabs(updated);
                    }}
                    className="w-full h-9 px-3 rounded-lg border-transparent bg-transparent hover:bg-muted/30 focus:bg-background focus:border-primary/50 text-sm font-semibold outline-none transition-all"
                  />
                </td>
                <td className="p-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50">৳</span>
                    <input
                      type="number"
                      value={slab.limit === -1 ? "" : slab.limit}
                      placeholder={slab.limit === -1 ? "Unlimited" : "0"}
                      onChange={(e) => {
                        const val = e.target.value === "" ? -1 : Number(e.target.value);
                        const updated = slabs.map(s => s.id === slab.id ? { ...s, limit: val } : s);
                        type === "general" ? setGeneralSlabs(updated) : setFemaleSlabs(updated);
                      }}
                      className="w-full h-9 pl-6 pr-3 rounded-lg border border-border/40 bg-muted/10 focus:bg-background focus:border-primary/50 text-sm font-mono font-semibold outline-none transition-all"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <div className="relative w-24">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50">%</span>
                    <input
                      type="number"
                      value={slab.rate}
                      onChange={(e) => {
                        const updated = slabs.map(s => s.id === slab.id ? { ...s, rate: Number(e.target.value) } : s);
                        type === "general" ? setGeneralSlabs(updated) : setFemaleSlabs(updated);
                      }}
                      className="w-full h-9 pr-6 pl-3 rounded-lg border border-border/40 bg-muted/10 focus:bg-background focus:border-primary/50 text-sm font-mono font-semibold outline-none transition-all text-right"
                    />
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => removeSlab(type, slab.id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/10 w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Breadcrumb & Header */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                  <span>Home</span>
                  <ChevronRight className="size-3.5" />
                  <span>Configure</span>
                  <ChevronRight className="size-3.5" />
                  <span className="text-primary font-bold">Tax & Compliance</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Settings className="size-6 text-primary" />
                  Tax & Compliance Setup
                </h1>
              </div>

              <div className="w-full sm:w-72">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                  Select Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  <select 
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="Cripton Tech">Cripton Tech</option>
                    <option value="Agro Tripti">Agro Tripti</option>
                    <option value="Global Holdings">Global Holdings</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Horizontal Master Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 pb-5 border-b border-border/40 mb-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === "slabs_general" && renderSlabEditor(generalSlabs, "general", "General Tax Slabs", "Define the standard yearly income tax slabs for general (male) employees.")}
            {activeTab === "slabs_female" && renderSlabEditor(femaleSlabs, "female", "Female & Senior Citizen Tax Slabs", "Define the relaxed yearly income tax slabs for female and senior citizen employees.")}

            {activeTab === "rebate_investment" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Rebate & Investment Limits</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure the maximum allowable investment for tax rebate calculations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block uppercase tracking-wide">
                      Max Investment (% of Taxable Income)
                    </label>
                    <div className="relative">
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">%</span>
                      <input
                        type="number"
                        value={rebateConfig.maxInvestmentPercentage}
                        onChange={(e) => setRebateConfig({ ...rebateConfig, maxInvestmentPercentage: Number(e.target.value) })}
                        className="w-full h-10 pl-3.5 pr-8 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block uppercase tracking-wide">
                      Max Investment Limit (BDT)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">৳</span>
                      <input
                        type="number"
                        value={rebateConfig.maxInvestmentAmount}
                        onChange={(e) => setRebateConfig({ ...rebateConfig, maxInvestmentAmount: Number(e.target.value) })}
                        className="w-full h-10 pl-7 pr-3.5 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block uppercase tracking-wide">
                      Rebate Percentage (%)
                    </label>
                    <div className="relative">
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">%</span>
                      <input
                        type="number"
                        value={rebateConfig.rebatePercentage}
                        onChange={(e) => setRebateConfig({ ...rebateConfig, rebatePercentage: Number(e.target.value) })}
                        className="w-full h-10 pl-3.5 pr-8 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "statutory_compliance" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Statutory Compliance Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up company policies for automated TDS deduction, Provident Fund matching, and Gratuity.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* TDS Section */}
                  <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Automatic Monthly TDS Deduction</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">If enabled, the system will calculate yearly tax and automatically deduct 1/12th from monthly payroll.</p>
                    </div>
                    <button
                      onClick={() => setComplianceConfig({ ...complianceConfig, enableTDS: !complianceConfig.enableTDS })}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${complianceConfig.enableTDS ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`size-4 bg-white rounded-full shadow-sm transform transition-transform ${complianceConfig.enableTDS ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* PF Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-border/50 pb-2">Provident Fund (PF) Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">Company Matching Percentage</label>
                        <div className="relative">
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">%</span>
                          <input
                            type="number"
                            value={complianceConfig.pfCompanyMatch}
                            onChange={(e) => setComplianceConfig({ ...complianceConfig, pfCompanyMatch: Number(e.target.value) })}
                            className="w-full h-10 pl-3.5 pr-8 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">E.g. 100% means company contributes exactly what the employee contributes.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">Eligibility (Months of Service)</label>
                        <div className="relative">
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">M</span>
                          <input
                            type="number"
                            value={complianceConfig.pfEligibleMonths}
                            onChange={(e) => setComplianceConfig({ ...complianceConfig, pfEligibleMonths: Number(e.target.value) })}
                            className="w-full h-10 pl-3.5 pr-8 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gratuity Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-border/50 pb-2">Gratuity Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">Eligibility (Years of Continuous Service)</label>
                        <div className="relative">
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-muted-foreground/60">Y</span>
                          <input
                            type="number"
                            value={complianceConfig.gratuityEligibleYears}
                            onChange={(e) => setComplianceConfig({ ...complianceConfig, gratuityEligibleYears: Number(e.target.value) })}
                            className="w-full h-10 pl-3.5 pr-8 rounded-lg border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-mono outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">Calculation Method</label>
                        <select
                          value={complianceConfig.gratuityCalculation}
                          onChange={(e) => setComplianceConfig({ ...complianceConfig, gratuityCalculation: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]"
                        >
                          <option value="Basic x 1">1 Month Basic per Year</option>
                          <option value="Basic x 1.5">1.5 Month Basic per Year</option>
                          <option value="Basic x 2">2 Months Basic per Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm flex items-center justify-end gap-3">
               <button className="h-10 px-6 rounded-xl bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">
                 Reset
               </button>
               <button 
                 onClick={handleSave}
                 className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
               >
                 <Save className="size-4" />
                 Save Settings
               </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
