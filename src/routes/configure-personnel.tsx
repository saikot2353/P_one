import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Settings,
  Search,
  Building2,
  FileCheck2,
  Banknote,
  ShieldCheck,
  ChevronRight,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configure-personnel")({
  head: () => ({
    meta: [
      { title: "Personnel File Configure — CRIPTON HRIS" },
      { name: "description", content: "Configure dynamic fields and salary structures for personnel files." },
    ],
  }),
  component: ConfigurePersonnelPage,
});

const TABS = [
  { id: "field_visibility", label: "Field Visibility", icon: FileCheck2 },
  { id: "salary_setup", label: "Salary Setup", icon: Banknote },
  { id: "mandatory_setup", label: "Mandatory Fields", icon: ShieldCheck },
];

function ConfigurePersonnelPage() {
  const [activeTab, setActiveTab] = useState("field_visibility");
  const [selectedCompany, setSelectedCompany] = useState("Cripton Tech");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dummy data for toggles
  const [fields, setFields] = useState<Record<string, boolean>>({
    id: true,
    offcId: true,
    nameEng: true,
    nameBng: true,
    fatherNameEng: true,
    fatherNameBng: true,
    motherNameEng: true,
    motherNameBng: true,
    spouseNameEng: true,
    spouseNameBng: true,
    spouseNid: true,
    spouseContactNo: true,
    membershipNo: true,
    drivingLicense: true,
    maritalStatus: true,
    dob: true,
    religion: true,
    nid: true,
    gender: true,
    birthRegNo: true,
    blood: true,
    passportNo: true,
    education: true,
    joinDate: true,
    presDivision: true,
    presDistrict: true,
    presUpazila: true,
    presPostOffice: true,
    presVillageEng: true,
    presVillageBng: true,
    presRoad: true,
    presOthers: true,
    presCountry: true,
    sameAsPresent: true,
    permDivision: true,
    permDistrict: true,
    permUpazila: true,
    permPostOffice: true,
    permVillageEng: true,
    permVillageBng: true,
    permRoad: true,
    permOthers: true,
    permCountry: true,
    offcEmail: true,
    offcMobile: true,
    offcPhoneEx: true,
    personalEmail: true,
    personalContact: true,
    dept: true,
    workingArea: true,
    sect: true,
    empType: true,
    title: true,
    jobNature: true,
    unit: true,
    line: true,
    grade: true,
    shift: true,
    empStatus: true,
    probationPeriod: true,
    confirmDate: true,
    holiday: true,
    setManager: true,
    recruitmentType: true,
    rcNotes: true,
    gross: true,
    specialAllowance: true,
    mobileAllowance: true,
    internetAllowance: true,
    utilityAllowance: true,
    bankPay: true,
    bankName: true,
    bankAccount: true,
    bankBranch: true,
    routingNumber: true,
    pfDeduction: true,
    taxDeduction: true,
    gratuity: true,
    paymentMode: true,
    picture: true,
    signature: true,
    nidScan: true,
    certificateScan: true,
    emergencyName: true,
    emergencyRelation: true,
    emergencyContact: true,
    emergencyAltContact: true,
    emergencyEmail: true,
    emergencyAddress: true,
    nomineeName: true,
    nomineeRelation: true,
    nomineeNid: true,
    nomineeContact: true,
    nomineeShare: true,
    nomineeAddress: true,
    ref1Name: true,
    ref1Designation: true,
    ref1Org: true,
    ref1Contact: true,
    ref1Email: true,
    ref2Name: true,
    ref2Designation: true,
    ref2Org: true,
    ref2Contact: true,
    ref2Email: true,
    jobDescription: true,
    keyDeliverables: true,
    reportingLine: true,
    verificationStatus: true,
    verifiedBy: true,
    verificationDate: true,
    verificationNotes: true,
    laptopBrand: true,
    laptopAssetId: true,
    mobileBrand: true,
    mobileAssetId: true,
    accessCardId: true,
    equipmentIssuedDate: true,
  });

  const [salaryProps, setSalaryProps] = useState({
    basic: 60,
    houseRent: 25,
    medical: 8,
    conveyance: 4,
    food: 3,
  });

  const [mandatoryFields, setMandatoryFields] = useState<Record<string, boolean>>({
    id: false,
    offcId: false,
    nameEng: false,
    nameBng: false,
    fatherNameEng: false,
    fatherNameBng: false,
    motherNameEng: false,
    motherNameBng: false,
    spouseNameEng: false,
    spouseNameBng: false,
    spouseNid: false,
    spouseContactNo: false,
    membershipNo: false,
    drivingLicense: false,
    maritalStatus: false,
    dob: false,
    religion: false,
    nid: false,
    gender: false,
    birthRegNo: false,
    blood: false,
    passportNo: false,
    education: false,
    joinDate: false,
    presDivision: false,
    presDistrict: false,
    presUpazila: false,
    presPostOffice: false,
    presVillageEng: false,
    presVillageBng: false,
    presRoad: false,
    presOthers: false,
    presCountry: false,
    sameAsPresent: false,
    permDivision: false,
    permDistrict: false,
    permUpazila: false,
    permPostOffice: false,
    permVillageEng: false,
    permVillageBng: false,
    permRoad: false,
    permOthers: false,
    permCountry: false,
    offcEmail: false,
    offcMobile: false,
    offcPhoneEx: false,
    personalEmail: false,
    personalContact: false,
    dept: false,
    workingArea: false,
    sect: false,
    empType: false,
    title: false,
    jobNature: false,
    unit: false,
    line: false,
    grade: false,
    shift: false,
    empStatus: false,
    probationPeriod: false,
    confirmDate: false,
    holiday: false,
    setManager: false,
    recruitmentType: false,
    rcNotes: false,
    gross: false,
    specialAllowance: false,
    mobileAllowance: false,
    internetAllowance: false,
    utilityAllowance: false,
    bankPay: false,
    bankName: false,
    bankAccount: false,
    bankBranch: false,
    routingNumber: false,
    pfDeduction: false,
    taxDeduction: false,
    gratuity: false,
    paymentMode: false,
    picture: false,
    signature: false,
    nidScan: false,
    certificateScan: false,
    emergencyName: false,
    emergencyRelation: false,
    emergencyContact: false,
    emergencyAltContact: false,
    emergencyEmail: false,
    emergencyAddress: false,
    nomineeName: false,
    nomineeRelation: false,
    nomineeNid: false,
    nomineeContact: false,
    nomineeShare: false,
    nomineeAddress: false,
    ref1Name: false,
    ref1Designation: false,
    ref1Org: false,
    ref1Contact: false,
    ref1Email: false,
    ref2Name: false,
    ref2Designation: false,
    ref2Org: false,
    ref2Contact: false,
    ref2Email: false,
    jobDescription: false,
    keyDeliverables: false,
    reportingLine: false,
    verificationStatus: false,
    verifiedBy: false,
    verificationDate: false,
    verificationNotes: false,
    laptopBrand: false,
    laptopAssetId: false,
    mobileBrand: false,
    mobileAssetId: false,
    accessCardId: false,
    equipmentIssuedDate: false,
  });

  const handleSave = () => {
    toast.success(`Configuration saved successfully for ${selectedCompany}!`);
  };

  const handleFieldToggle = (key: keyof typeof fields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleMandatoryToggle = (key: keyof typeof mandatoryFields) => {
    setMandatoryFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSalaryPercentage = Object.values(salaryProps).reduce((a, b) => a + Number(b), 0);

  const formatLabel = (key: string) => {
    let lbl = key.replace(/([A-Z])/g, " $1").trim();
    lbl = lbl.charAt(0).toUpperCase() + lbl.slice(1);
    lbl = lbl.replace(/Eng$/, " (English)").replace(/Bng$/, " (Bangla)");
    lbl = lbl.replace(/Id$/i, " ID").replace(/Dob/i, "Date of Birth").replace(/Nid/i, "NID");
    lbl = lbl.replace(/^Pres /, "Present ").replace(/^Perm /, "Permanent ").replace(/^Offc /, "Official ");
    lbl = lbl.replace(/^Ref[12] /, "Reference ");
    if (key === "blood") return "Blood Group";
    if (key === "dept") return "Department";
    if (key === "sect") return "Section";
    if (key === "rcNotes") return "Recruitment Notes";
    if (key === "pfDeduction") return "PF Deduction";
    return lbl;
  };


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
                  <span className="text-primary font-bold">Personnel File</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Settings className="size-6 text-primary" />
                  Personnel File Configuration
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
            {activeTab === "field_visibility" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Field Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle which fields are visible in the employee registration form for {selectedCompany}.
                  </p>
                </div>

                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(fields)
                    .filter(([key]) => formatLabel(key).toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors gap-2">
                      <span className="text-xs font-semibold text-foreground truncate" title={formatLabel(key)}>
                        {formatLabel(key)}
                      </span>
                      <button
                        onClick={() => handleFieldToggle(key as keyof typeof fields)}
                        className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center shrink-0 ${value ? "bg-primary" : "bg-muted-foreground/30"}`}
                      >
                        <div className={`size-3.5 bg-white rounded-full shadow-sm transform transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "salary_setup" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Salary Breakdown Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure the standard percentage breakdown of the Gross Salary.
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 ${totalSalaryPercentage === 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                    Total: {totalSalaryPercentage}%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(salaryProps).map(([key, val]) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground/80 block capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()} Percentage (%)
                      </label>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => setSalaryProps(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                        className="w-full h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "mandatory_setup" && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Mandatory Field Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Enforce which fields are strictly required during employee onboarding.
                  </p>
                </div>

                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search mandatory fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/60 bg-muted/10 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(mandatoryFields)
                    .filter(([key]) => formatLabel(key).toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/50 bg-rose-500/5 hover:bg-rose-500/10 transition-colors gap-2">
                      <span className="text-xs font-semibold text-foreground truncate" title={formatLabel(key)}>
                        {formatLabel(key)}
                      </span>
                      <button
                        onClick={() => handleMandatoryToggle(key as keyof typeof mandatoryFields)}
                        className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center shrink-0 ${value ? "bg-rose-500" : "bg-muted-foreground/30"}`}
                      >
                        <div className={`size-3.5 bg-white rounded-full shadow-sm transform transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
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
                 disabled={activeTab === "salary_setup" && totalSalaryPercentage !== 100}
                 className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
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
