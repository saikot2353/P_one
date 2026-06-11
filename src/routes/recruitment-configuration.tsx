import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  Sparkles, ChevronRight, Plus, X, Trash2, Edit, Tag, Cpu, Award, Ruler, Database, Percent, TrendingUp, Layers, Search, CheckCircle2, UserCog, CalendarClock
} from "lucide-react";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-configuration")({
  component: RecruitmentConfiguration,
});

function RecruitmentConfiguration() {
  const isSysAdmin = true;
  
  const [activeTab, setActiveTab] = useState("op_name");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // States for the 8 config matrices
  const [operations, setOperations] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [opGrades, setOpGrades] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [smvBank, setSmvBank] = useState<any[]>([]);
  const [effGrades, setEffGrades] = useState<any[]>([]);
  const [gradeVsGrade, setGradeVsGrade] = useState<any[]>([]);
  const [multiSs, setMultiSs] = useState<any[]>([]);

  // Load Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeRecruitmentMockData();
      
      setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || "[]"));
      setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || "[]"));
      setOpGrades(JSON.parse(localStorage.getItem("recruitment_config_op_grades") || "[]"));
      setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || "[]"));
      setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
      setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
      setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
      setMultiSs(JSON.parse(localStorage.getItem("recruitment_config_multi_ss_v2") || "[]"));
    }
  }, []);

  // Sync data when activeTab changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOperations(JSON.parse(localStorage.getItem("recruitment_config_operations") || "[]"));
    setMachines(JSON.parse(localStorage.getItem("recruitment_config_machines") || "[]"));
    setOpGrades(JSON.parse(localStorage.getItem("recruitment_config_op_grades") || "[]"));
    setMeasurements(JSON.parse(localStorage.getItem("recruitment_config_measurements") || "[]"));
    setSmvBank(JSON.parse(localStorage.getItem("recruitment_config_smv_bank") || "[]"));
    setEffGrades(JSON.parse(localStorage.getItem("recruitment_config_eff_grades") || "[]"));
    setGradeVsGrade(JSON.parse(localStorage.getItem("recruitment_config_grade_vs_grade") || "[]"));
    setMultiSs(JSON.parse(localStorage.getItem("recruitment_config_multi_ss_v2") || "[]"));
  }, [activeTab]);

  const saveConfig = (key: string, data: any[], setter: any) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Generic Form State for the Modal
  const [formData, setFormData] = useState<any>({});

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (activeTab === "op_name" && !editingItem) {
      if (operations.some(o => o.opName.toLowerCase() === formData.opName?.toLowerCase())) {
        alert("Duplicate Operation Name user can't save.");
        return;
      }
    }
    if (activeTab === "measurement" && !editingItem) {
      if (measurements.some(m => m.name.toLowerCase() === formData.name?.toLowerCase())) {
        alert("Duplicate Measurement (MP) user can't save.");
        return;
      }
    }
    if (activeTab === "mc_name" && !editingItem) {
      if (machines.some(m => m.mcFullName.toLowerCase() === formData.mcFullName?.toLowerCase())) {
        alert("Duplicate M/C Name user can't save.");
        return;
      }
    }

    const payload = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now().toString(),
      createdBy: editingItem ? editingItem.createdBy : "MTS 30/03/2026 23:56:02 PM",
      updatedBy: editingItem ? "MTS 30/03/2026 23:57:12 PM" : "",
    };

    let updatedList;
    if (activeTab === "op_name") {
      updatedList = editingItem ? operations.map(o => o.id === editingItem.id ? payload : o) : [...operations, payload];
      saveConfig("recruitment_config_operations", updatedList, setOperations);
    } else if (activeTab === "mc_name") {
      updatedList = editingItem ? machines.map(m => m.id === editingItem.id ? payload : m) : [...machines, payload];
      saveConfig("recruitment_config_machines", updatedList, setMachines);
    } else if (activeTab === "op_grade") {
      updatedList = editingItem ? opGrades.map(m => m.id === editingItem.id ? payload : m) : [...opGrades, payload];
      saveConfig("recruitment_config_op_grades", updatedList, setOpGrades);
    } else if (activeTab === "measurement") {
      updatedList = editingItem ? measurements.map(m => m.id === editingItem.id ? payload : m) : [...measurements, payload];
      saveConfig("recruitment_config_measurements", updatedList, setMeasurements);
    } else if (activeTab === "smv_bank") {
      updatedList = editingItem ? smvBank.map(s => s.id === editingItem.id ? payload : s) : [...smvBank, payload];
      saveConfig("recruitment_config_smv_bank", updatedList, setSmvBank);
    } else if (activeTab === "eff_grade") {
      updatedList = editingItem ? effGrades.map(e => e.id === editingItem.id ? payload : e) : [...effGrades, payload];
      saveConfig("recruitment_config_eff_grades", updatedList, setEffGrades);
    } else if (activeTab === "grade_vs_grade") {
      updatedList = editingItem ? gradeVsGrade.map(g => g.id === editingItem.id ? payload : g) : [...gradeVsGrade, payload];
      saveConfig("recruitment_config_grade_vs_grade", updatedList, setGradeVsGrade);
    } else if (activeTab === "multi_ss") {
      updatedList = editingItem ? multiSs.map(m => m.id === editingItem.id ? payload : m) : [...multiSs, payload];
      saveConfig("recruitment_config_multi_ss_v2", updatedList, setMultiSs);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    if (activeTab === "op_name") saveConfig("recruitment_config_operations", operations.filter(i => i.id !== id), setOperations);
    else if (activeTab === "mc_name") saveConfig("recruitment_config_machines", machines.filter(i => i.id !== id), setMachines);
    else if (activeTab === "op_grade") saveConfig("recruitment_config_op_grades", opGrades.filter(i => i.id !== id), setOpGrades);
    else if (activeTab === "measurement") saveConfig("recruitment_config_measurements", measurements.filter(i => i.id !== id), setMeasurements);
    else if (activeTab === "smv_bank") saveConfig("recruitment_config_smv_bank", smvBank.filter(i => i.id !== id), setSmvBank);
    else if (activeTab === "eff_grade") saveConfig("recruitment_config_eff_grades", effGrades.filter(i => i.id !== id), setEffGrades);
    else if (activeTab === "grade_vs_grade") saveConfig("recruitment_config_grade_vs_grade", gradeVsGrade.filter(i => i.id !== id), setGradeVsGrade);
    else if (activeTab === "multi_ss") saveConfig("recruitment_config_multi_ss_v2", multiSs.filter(i => i.id !== id), setMultiSs);
  };

  const tabs = [
    { id: "op_name", label: "Operation Name", icon: <Tag className="size-4" />, count: operations.length },
    { id: "mc_name", label: "M/C Name", icon: <Cpu className="size-4" />, count: machines.length },
    { id: "op_grade", label: "Operation Grade", icon: <Award className="size-4" />, count: opGrades.length },
    { id: "measurement", label: "Measurement", icon: <Ruler className="size-4" />, count: measurements.length },
    { id: "smv_bank", label: "SMV Bank", icon: <Database className="size-4" />, count: smvBank.length },
    { id: "eff_grade", label: "Eff. Grade Point", icon: <Percent className="size-4" />, count: effGrades.length },
    { id: "grade_vs_grade", label: "Grade Points vs Grade", icon: <TrendingUp className="size-4" />, count: gradeVsGrade.length },
    { id: "multi_ss", label: "Multi/SS", icon: <Layers className="size-4" />, count: multiSs.length },
  ];

  let currentData: any[] = [];
  if (activeTab === "op_name") currentData = operations;
  if (activeTab === "mc_name") currentData = machines;
  if (activeTab === "op_grade") currentData = opGrades;
  if (activeTab === "measurement") currentData = measurements;
  if (activeTab === "smv_bank") currentData = smvBank;
  if (activeTab === "eff_grade") currentData = effGrades;
  if (activeTab === "grade_vs_grade") currentData = gradeVsGrade;
  if (activeTab === "multi_ss") currentData = multiSs;

  // Search Filter
  if (searchQuery) {
    currentData = currentData.filter(item => JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const activeTabDetails = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          
          {/* Header Panel */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>e-Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Configuration Matrices</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary animate-pulse" />
                <span>IE Configuration Settings</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input 
                  type="text" 
                  placeholder="Search values..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-10 w-60 pl-9 pr-4 rounded-xl border border-border/80 bg-background text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <button 
                onClick={() => handleOpenModal()} 
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:shadow-md hover:bg-primary/95 transition flex items-center gap-2"
              >
                <Plus className="size-4" /> Add Record
              </button>
            </div>
          </div>

          {/* Redesigned Premium Matrix Tabs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-200 relative group
                    ${isActive
                      ? "bg-primary/10 border-primary text-primary shadow-2xs"
                      : "bg-card border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                >
                  <div className={`p-2 rounded-xl mb-2 transition-colors duration-200 
                    ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider block leading-tight">{t.label}</span>
                  <span className={`inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold border
                    ${isActive ? "bg-primary/20 border-primary/30 text-primary" : "bg-muted border-border/40 text-muted-foreground"}`}>
                    {t.count} items
                  </span>
                </button>
              );
            })}
          </div>

          {/* Matrix Content Table Area */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary/15 text-primary">
                  {activeTabDetails?.icon}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  {activeTabDetails?.label} Database
                  <span className="ml-1.5 font-bold text-muted-foreground lowercase">({currentData.length} records found)</span>
                </span>
              </div>
              {isSysAdmin && (
                <span className="text-[9px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 font-bold">
                  Delete permissions granted to administrator
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" style={{minWidth: activeTab === "grade_vs_grade" ? "1200px" : activeTab === "multi_ss" ? "1100px" : activeTab === "smv_bank" ? "900px" : "700px"}}>
                <thead className="bg-[#f1f5f9] dark:bg-[#0f172a] text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center sticky left-0 bg-[#f1f5f9] dark:bg-[#0f172a] z-10 border-r border-border/30">SL</th>
                    <th className="px-4 py-3 w-28 text-center sticky left-12 bg-[#f1f5f9] dark:bg-[#0f172a] z-10 border-r border-border/30">Actions</th>
                    
                    {activeTab === "op_name" && <th className="px-4 py-3 min-w-[320px]">Operation Name</th>}
                    {activeTab === "mc_name" && (
                      <><th className="px-4 py-3 min-w-[240px]">M/C Full Name</th><th className="px-4 py-3 min-w-[100px]">Short Name</th></>
                    )}
                    {activeTab === "op_grade" && <th className="px-4 py-3 min-w-[160px]">Operation Grade</th>}
                    {activeTab === "measurement" && <th className="px-4 py-3 min-w-[200px]">Measurement (MP) Name</th>}
                    {activeTab === "smv_bank" && (
                      <><th className="px-4 py-3 min-w-[240px]">Operation Name</th><th className="px-4 py-3 min-w-[100px]">M/C Name</th><th className="px-4 py-3 min-w-[110px]">Op. Grade</th><th className="px-4 py-3 min-w-[110px]">Measurement</th><th className="px-4 py-3 min-w-[80px]">SMV</th></>
                    )}
                    {activeTab === "eff_grade" && (
                      <><th className="px-4 py-3 min-w-[120px]">Eff. From (%)</th><th className="px-4 py-3 min-w-[120px]">Eff. To (%)</th><th className="px-4 py-3 min-w-[120px]">Grade Point</th></>
                    )}
                    {activeTab === "grade_vs_grade" && (
                      <><th className="px-4 py-3 min-w-[140px]">GP From</th><th className="px-4 py-3 min-w-[140px]">GP To</th><th className="px-4 py-3 min-w-[80px]">Grade</th><th className="px-4 py-3 min-w-[120px]">Salary From</th><th className="px-4 py-3 min-w-[120px]">Salary To</th><th className="px-4 py-3 min-w-[100px]">Govt. Grade</th><th className="px-4 py-3 min-w-[110px]">Valid From</th><th className="px-4 py-3 min-w-[110px]">Valid To</th><th className="px-4 py-3 min-w-[100px]">Remarks</th></>
                    )}
                    {activeTab === "multi_ss" && (
                      <><th className="px-4 py-3 min-w-[100px]">Grade Point</th><th className="px-4 py-3 min-w-[100px]">Op. Grade</th><th className="px-4 py-3 min-w-[130px]">Min Op. Count</th><th className="px-4 py-3 min-w-[100px]">M/C Type</th><th className="px-4 py-3 min-w-[70px]">Eff%</th><th className="px-4 py-3 min-w-[90px]">Add Amt</th><th className="px-4 py-3 min-w-[110px]">Valid. Remarks</th><th className="px-4 py-3 min-w-[110px]">Remarks</th><th className="px-4 py-3 min-w-[110px]">Valid From</th><th className="px-4 py-3 min-w-[110px]">Valid To</th></>
                    )}

                    <th className="px-4 py-3 min-w-[180px] text-primary/80"><span className="flex items-center gap-1"><UserCog className="size-3.5" /> Created By</span></th>
                    <th className="px-4 py-3 min-w-[180px] text-primary/80"><span className="flex items-center gap-1"><CalendarClock className="size-3.5" /> Updated By</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-foreground">
                  {currentData.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    const rowBgClass = isEven 
                      ? "bg-background" 
                      : "bg-[#fafafa] dark:bg-[#151f30]";
                    const stickyCellBgClass = isEven 
                      ? "bg-background group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]" 
                      : "bg-[#fafafa] dark:bg-[#151f30] group-hover:bg-[#f1f5f9] dark:group-hover:bg-[#1c283d]";

                    return (
                      <tr key={item.id} className={`group hover:bg-primary/5 transition-colors ${rowBgClass}`}>
                        <td className={`px-4 py-3 text-center text-muted-foreground font-bold sticky left-0 ${stickyCellBgClass} z-10 border-r border-border/30 w-12 min-w-[48px] max-w-[48px]`}>{idx + 1}</td>
                        <td className={`px-4 py-3 sticky left-12 ${stickyCellBgClass} z-10 border-r border-border/30 w-28 min-w-[112px] max-w-[112px]`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              title="Edit record"
                              onClick={() => handleOpenModal(item)} 
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/35 hover:bg-blue-500 hover:text-white text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 transition-all"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            {isSysAdmin && (
                              <button 
                                title="Delete record"
                                onClick={() => handleDelete(item.id)} 
                                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/35 hover:bg-red-500 hover:text-white text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/40 transition-all"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        
                        {activeTab === "op_name" && <td className="px-4 py-3 font-semibold text-foreground">{item.opName}</td>}
                        {activeTab === "mc_name" && (
                          <><td className="px-4 py-3 font-semibold">{item.mcFullName}</td><td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded">{item.mcName}</span></td></>
                        )}
                        {activeTab === "op_grade" && (
                          <td className="px-4 py-3">
                            <span className="bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[11px] font-black px-2.5 py-0.5 rounded-full">{item.grade}</span>
                          </td>
                        )}
                        {activeTab === "measurement" && <td className="px-4 py-3 font-mono font-semibold">{item.name}</td>}
                        {activeTab === "smv_bank" && (
                          <><td className="px-4 py-3 font-semibold text-[11px]">{item.opName}</td><td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded">{item.mcName}</span></td><td className="px-4 py-3"><span className="bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-full">{item.opGrade}</span></td><td className="px-4 py-3 font-mono text-[11px]">{item.meas}</td><td className="px-4 py-3 font-mono font-black text-primary">{item.smvValue}</td></>
                        )}
                        {activeTab === "eff_grade" && (
                          <><td className="px-4 py-3 font-mono">{item.effFrom}%</td><td className="px-4 py-3 font-mono">{item.effTo}%</td><td className="px-4 py-3"><span className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 font-black text-[11px] px-2.5 py-0.5 rounded-full">{item.point}</span></td></>
                        )}
                        {activeTab === "grade_vs_grade" && (
                          <><td className="px-4 py-3 font-mono">{item.pointFrom}</td><td className="px-4 py-3 font-mono">{item.pointTo}</td><td className="px-4 py-3"><span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-black text-[11px] px-2.5 py-0.5 rounded">{item.grade}</span></td><td className="px-4 py-3 font-mono">{item.salaryFrom && `৳${Number(item.salaryFrom).toLocaleString()}`}</td><td className="px-4 py-3 font-mono">{item.salaryTo && `৳${Number(item.salaryTo).toLocaleString()}`}</td><td className="px-4 py-3 text-[11px]">{item.govtGrade}</td><td className="px-4 py-3 text-[11px]">{item.validityFrom}</td><td className="px-4 py-3 text-[11px]">{item.validityTo}</td><td className="px-4 py-3">{item.remarks && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.remarks === "Current" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{item.remarks}</span>}</td></>
                        )}
                        {activeTab === "multi_ss" && (
                          <><td className="px-4 py-3 font-mono font-bold">{item.point}</td><td className="px-4 py-3"><span className="bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-full">{item.opGrade}</span></td><td className="px-4 py-3 font-mono">{item.minOpCount}</td><td className="px-4 py-3"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.mcType === "Same" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-455" : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"}`}>{item.mcType}</span></td><td className="px-4 py-3 font-mono font-bold text-green-700 dark:text-green-400">{item.eff}%</td><td className="px-4 py-3 font-mono">৳{item.addAmt}</td><td className="px-4 py-3 text-[11px]">{item.validityRemarks}</td><td className="px-4 py-3 text-[11px]">{item.remarks}</td><td className="px-4 py-3 text-[11px]">{item.validityFrom}</td><td className="px-4 py-3 text-[11px]">{item.validityTo}</td></>
                        )}

                        <td className="px-4 py-3 text-[10px] text-muted-foreground whitespace-nowrap">{item.createdBy}</td>
                        <td className="px-4 py-3 text-[10px] text-muted-foreground whitespace-nowrap">{item.updatedBy || "—"}</td>
                      </tr>
                    );
                  })}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan={20} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Database className="size-10 text-muted-foreground/30" />
                          <div className="text-sm font-bold text-muted-foreground">No records configured in this matrix</div>
                          <div className="text-xs text-muted-foreground/60">Click "Add Record" to seed data</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ── REDESIGNED MODAL ─────────────────────────────────────────────── */}
      {modalOpen && (() => {
        const tabLabel = tabs.find(t => t.id === activeTab)?.label ?? "";
        const isEdit = !!editingItem;

        // Shared field styles
        const inp = "w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10";
        const sel = "w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer";
        const lbl = "block text-[11.5px] font-black text-muted-foreground uppercase tracking-wide mb-1.5";

        // Grid layout helper
        const isWideModal = activeTab === "grade_vs_grade" || activeTab === "multi_ss" || activeTab === "smv_bank";

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          >
            <div
              className="bg-card w-full rounded-2xl shadow-2xl border border-border/60 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              style={{ maxWidth: isWideModal ? 580 : 420, maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 ${isEdit ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-gradient-to-r from-primary to-primary/80"}`}>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">
                    {isEdit ? "Editing Record" : "New Record"}
                  </p>
                  <h2 className="text-base font-black text-white tracking-tight">{tabLabel}</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className={`p-5 overflow-y-auto space-y-4 ${isWideModal ? "grid grid-cols-2 gap-x-4 gap-y-4 space-y-0" : ""}`}>

                {/* ── Operation Name ── */}
                {activeTab === "op_name" && (
                  <div className="col-span-2">
                    <label className={lbl}>Operation Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.opName || ""} onChange={e => setFormData({...formData, opName: e.target.value})} className={inp} placeholder="Enter operation name" />
                  </div>
                )}

                {/* ── M/C Name ── */}
                {activeTab === "mc_name" && (
                  <>
                    <div className="col-span-2">
                      <label className={lbl}>M/C Full Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.mcFullName || ""} onChange={e => setFormData({...formData, mcFullName: e.target.value})} className={inp} placeholder="e.g. Single Needle Lock Stitch" />
                    </div>
                    <div className="col-span-2">
                      <label className={lbl}>M/C Short Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.mcName || ""} onChange={e => setFormData({...formData, mcName: e.target.value})} className={inp} placeholder="e.g. SNLS" />
                    </div>
                  </>
                )}

                {/* ── Operation Grade ── */}
                {activeTab === "op_grade" && (
                  <div className="col-span-2">
                    <label className={lbl}>Operation Grade <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.grade || ""} onChange={e => setFormData({...formData, grade: e.target.value})} className={inp} placeholder="e.g. P, P1, A, B+" />
                  </div>
                )}

                {/* ── Measurement ── */}
                {activeTab === "measurement" && (
                  <div className="col-span-2">
                    <label className={lbl}>Measurement (MP) Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className={inp} placeholder="e.g. 44 CM" />
                  </div>
                )}

                {/* ── SMV Bank ── */}
                {activeTab === "smv_bank" && (
                  <>
                    <div className="col-span-2">
                      <label className={lbl}>Operation Name <span className="text-red-500">*</span></label>
                      <select value={formData.opName || ""} onChange={e => setFormData({...formData, opName: e.target.value})} className={sel}>
                        <option value="">— Select Operation —</option>
                        {operations.map(o => <option key={o.id} value={o.opName}>{o.opName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>M/C Name <span className="text-red-500">*</span></label>
                      <select value={formData.mcName || ""} onChange={e => setFormData({...formData, mcName: e.target.value})} className={sel}>
                        <option value="">— Select M/C —</option>
                        {machines.map(m => <option key={m.id} value={m.mcName}>{m.mcName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Operation Grade <span className="text-red-500">*</span></label>
                      <select value={formData.opGrade || ""} onChange={e => setFormData({...formData, opGrade: e.target.value})} className={sel}>
                        <option value="">— Select Grade —</option>
                        {opGrades.map(og => <option key={og.id} value={og.grade}>{og.grade}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Measurement (MP) <span className="text-red-500">*</span></label>
                      <select value={formData.meas || ""} onChange={e => setFormData({...formData, meas: e.target.value})} className={sel}>
                        <option value="">— Select Measurement —</option>
                        {measurements.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>SMV Value <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.smvValue || ""} onChange={e => setFormData({...formData, smvValue: e.target.value})} className={inp} placeholder="e.g. 0.26" />
                    </div>
                  </>
                )}

                {/* ── Eff. Grade Point ── */}
                {activeTab === "eff_grade" && (
                  <>
                    <div>
                      <label className={lbl}>Efficiency From (%) <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.effFrom || ""} onChange={e => setFormData({...formData, effFrom: e.target.value})} className={inp} placeholder="e.g. 40.00" />
                    </div>
                    <div>
                      <label className={lbl}>Efficiency To (%) <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.effTo || ""} onChange={e => setFormData({...formData, effTo: e.target.value})} className={inp} placeholder="e.g. 49.99" />
                    </div>
                    <div className="col-span-2">
                      <label className={lbl}>Grade Point <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.point || ""} onChange={e => setFormData({...formData, point: e.target.value})} className={inp} placeholder="e.g. 1.00" />
                    </div>
                  </>
                )}

                {/* ── Grade vs Grade ── */}
                {activeTab === "grade_vs_grade" && (
                  <>
                    <div>
                      <label className={lbl}>Validity From <span className="text-red-500">*</span></label>
                      <input type="date" value={formData.validityFrom || ""} onChange={e => setFormData({...formData, validityFrom: e.target.value})} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Validity To <span className="text-red-500">*</span></label>
                      <input type="date" value={formData.validityTo || ""} onChange={e => setFormData({...formData, validityTo: e.target.value})} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>GP From <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.pointFrom || ""} onChange={e => setFormData({...formData, pointFrom: e.target.value})} className={inp} placeholder="e.g. 2.00" />
                    </div>
                    <div>
                      <label className={lbl}>GP To <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.pointTo || ""} onChange={e => setFormData({...formData, pointTo: e.target.value})} className={inp} placeholder="e.g. 2.99" />
                    </div>
                    <div>
                      <label className={lbl}>Grade <span className="text-red-500">*</span></label>
                      <select value={formData.grade || ""} onChange={e => setFormData({...formData, grade: e.target.value})} className={sel}>
                        <option value="">— Select —</option>
                        {["A+","A","A-","B+","B","B-","C+","C","H","Special"].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Govt. Grade <span className="text-red-500">*</span></label>
                      <select value={formData.govtGrade || ""} onChange={e => setFormData({...formData, govtGrade: e.target.value})} className={sel}>
                        <option value="">— Select —</option>
                        {["Grade-1","Grade-2","Grade-3","Grade-4"].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Salary From <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.salaryFrom || ""} onChange={e => setFormData({...formData, salaryFrom: e.target.value})} className={inp} placeholder="e.g. 13000" />
                    </div>
                    <div>
                      <label className={lbl}>Salary To <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.salaryTo || ""} onChange={e => setFormData({...formData, salaryTo: e.target.value})} className={inp} placeholder="e.g. 13500" />
                    </div>
                    <div className="col-span-2">
                      <label className={lbl}>Remarks</label>
                      <input type="text" value={formData.remarks || ""} onChange={e => setFormData({...formData, remarks: e.target.value})} className={inp} placeholder="Optional notes" />
                    </div>
                  </>
                )}

                {/* ── Multi / SS ── */}
                {activeTab === "multi_ss" && (
                  <>
                    <div>
                      <label className={lbl}>Validity From <span className="text-red-500">*</span></label>
                      <input type="date" value={formData.validityFrom || ""} onChange={e => setFormData({...formData, validityFrom: e.target.value})} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Validity To <span className="text-red-500">*</span></label>
                      <input type="date" value={formData.validityTo || ""} onChange={e => setFormData({...formData, validityTo: e.target.value})} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Total GP <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.point || ""} onChange={e => setFormData({...formData, point: e.target.value})} className={inp} placeholder="e.g. 5.00" />
                    </div>
                    <div>
                      <label className={lbl}>Op. Grade <span className="text-red-500">*</span></label>
                      <select value={formData.opGrade || ""} onChange={e => setFormData({...formData, opGrade: e.target.value})} className={sel}>
                        <option value="">— Select Grade —</option>
                        {opGrades.map(o => <option key={o.id} value={o.grade}>{o.grade}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Min Op. Count <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.minOpCount || ""} onChange={e => setFormData({...formData, minOpCount: e.target.value})} className={inp} placeholder="Comma separated, e.g. 2" />
                    </div>
                    <div>
                      <label className={lbl}>M/C Type <span className="text-red-500">*</span></label>
                      <select value={formData.mcType || ""} onChange={e => setFormData({...formData, mcType: e.target.value})} className={sel}>
                        <option value="">— Select —</option>
                        <option value="Same">Same</option>
                        <option value="Different">Different</option>
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Efficiency % <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.eff || ""} onChange={e => setFormData({...formData, eff: e.target.value})} className={inp} placeholder="e.g. 90" />
                    </div>
                    <div>
                      <label className={lbl}>Add Amount <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.addAmt || ""} onChange={e => setFormData({...formData, addAmt: e.target.value})} className={inp} placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className={lbl}>Validity Remarks</label>
                      <input type="text" value={formData.validityRemarks || ""} onChange={e => setFormData({...formData, validityRemarks: e.target.value})} className={inp} placeholder="e.g. Current" />
                    </div>
                    <div>
                      <label className={lbl}>Remarks</label>
                      <input type="text" value={formData.remarks || ""} onChange={e => setFormData({...formData, remarks: e.target.value})} className={inp} placeholder="Optional notes" />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-border/40 bg-muted/20 flex items-center justify-between gap-3">
                <p className="text-[10px] text-muted-foreground font-semibold">
                  <span className="text-red-500 font-bold">*</span> Required fields
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCloseModal}
                    className="h-10 px-6 rounded-xl border border-border/80 text-muted-foreground font-bold text-xs hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={`h-10 px-8 rounded-xl font-black text-xs text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all
                      ${isEdit
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      }`}
                  >
                    {isEdit ? "Update Record" : "Save Record"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
