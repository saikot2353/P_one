import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  User,
  RotateCcw,
  Save,
  Sliders,
  Check,
  Search,
  ChevronDown,
  Layers,
  GripVertical,
  UserCheck,
  ShieldCheck,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/separation-clearance-configuration")({
  head: () => ({
    meta: [
      { title: "Clearance Configuration — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Drag-and-drop table-based Clearance Layer configuration with default roles and searchable person assignment.",
      },
    ],
  }),
  component: SeparationClearanceConfigurationPage,
});

export interface ApproverEmployee {
  empId: string;
  name: string;
  designation: string;
  department: string;
}

export type ApproverMode = "DEFAULT_ROLE" | "SPECIFIC_PERSON";

export interface ClearanceLayerRow {
  id: string;
  layerNumber: number;
  layerName: string;
  approverMode: ApproverMode;
  defaultRole: string;
  approverEmpId: string;
  approverName: string;
  approverDesignation: string;
  approverDepartment: string;
  remarks: string;
}

const APPROVER_EMPLOYEE_POOL: ApproverEmployee[] = [
  { empId: "EMP-1001", name: "Kamrul Hasan", designation: "Head of HR & Admin", department: "Human Resources" },
  { empId: "EMP-1002", name: "Md. Rafiqul Islam", designation: "AGM Accounts & Finance", department: "Accounts & Finance" },
  { empId: "EMP-1045", name: "Shamima Nasrin", designation: "Sr. Manager IT Infrastructure", department: "Information Technology" },
  { empId: "EMP-1088", name: "Alamgir Kabir", designation: "AGM Production & Operations", department: "Industrial Engineering" },
  { empId: "EMP-1102", name: "Tariqul Islam", designation: "Head of Store & Inventory", department: "Store & Logistics" },
  { empId: "EMP-1005", name: "Engr. Mahmudul Hassan", designation: "Chief Operating Officer (COO)", department: "Executive Management" },
  { empId: "EMP-1120", name: "Sayed Ahmed", designation: "AGM Merchandising & Commercial", department: "Merchandising" },
  { empId: "EMP-1150", name: "Sultana Razia", designation: "Senior Admin Officer", department: "Administration" },
];

const DEFAULT_ROLE_OPTIONS = [
  "Immediate Reporting Supervisor",
  "Department Head (HOD)",
  "HR & Admin In-Charge",
  "Accounts & Finance Head",
  "IT System Administrator",
  "Chief Operating Officer (COO)",
];

const DEFAULT_CLEARANCE_LAYERS: ClearanceLayerRow[] = [
  {
    id: "layer-1",
    layerNumber: 1,
    layerName: "Immediate Reporting Supervisor Clearance",
    approverMode: "DEFAULT_ROLE",
    defaultRole: "Immediate Reporting Supervisor",
    approverEmpId: "EMP-1088",
    approverName: "Alamgir Kabir",
    approverDesignation: "AGM Production & Operations",
    approverDepartment: "Industrial Engineering",
    remarks: "Handover of ongoing projects, pending tasks & team locker key return.",
  },
  {
    id: "layer-2",
    layerNumber: 2,
    layerName: "Department Head (HOD) Clearance",
    approverMode: "DEFAULT_ROLE",
    defaultRole: "Department Head (HOD)",
    approverEmpId: "EMP-1088",
    approverName: "Alamgir Kabir",
    approverDesignation: "AGM Production & Operations",
    approverDepartment: "Industrial Engineering",
    remarks: "Departmental operational clearance and key files handover signoff.",
  },
  {
    id: "layer-3",
    layerNumber: 3,
    layerName: "IT Assets & System Access Clearance",
    approverMode: "SPECIFIC_PERSON",
    defaultRole: "IT System Administrator",
    approverEmpId: "EMP-1045",
    approverName: "Shamima Nasrin",
    approverDesignation: "Sr. Manager IT Infrastructure",
    approverDepartment: "Information Technology",
    remarks: "Collect laptop, charger, revoke email, ERP & domain access.",
  },
  {
    id: "layer-4",
    layerNumber: 4,
    layerName: "Accounts & Finance Dues Clearance",
    approverMode: "SPECIFIC_PERSON",
    defaultRole: "Accounts & Finance Head",
    approverEmpId: "EMP-1002",
    approverName: "Md. Rafiqul Islam",
    approverDesignation: "AGM Accounts & Finance",
    approverDepartment: "Accounts & Finance",
    remarks: "Settle PF loan, travel advance, canteen dues & confirm final dues.",
  },
  {
    id: "layer-5",
    layerNumber: 5,
    layerName: "HR & Admin Final Settlement Release",
    approverMode: "SPECIFIC_PERSON",
    defaultRole: "HR & Admin In-Charge",
    approverEmpId: "EMP-1001",
    approverName: "Kamrul Hasan",
    approverDesignation: "Head of HR & Admin",
    approverDepartment: "Human Resources",
    remarks: "Check notice period, exit interview & approve final settlement voucher.",
  },
];

export function SeparationClearanceConfigurationPage() {
  const [layers, setLayers] = useState<ClearanceLayerRow[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("separation_clearance_drag_v3");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_CLEARANCE_LAYERS;
  });

  const [toastMsg, setToastMsg] = useState("");
  const [openDropdownLayerId, setOpenDropdownLayerId] = useState<string | null>(null);
  const [approverSearchQuery, setApproverSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Persist layers
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("separation_clearance_drag_v3", JSON.stringify(layers));
    }
  }, [layers]);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedLayers = [...layers];
    const item = updatedLayers[draggedIndex];
    updatedLayers.splice(draggedIndex, 1);
    updatedLayers.splice(index, 0, item);

    const reindexed = updatedLayers.map((l, idx) => ({ ...l, layerNumber: idx + 1 }));
    setLayers(reindexed);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Add More Layer Row
  const handleAddMoreLayer = () => {
    const nextNum = layers.length + 1;
    const defaultEmp = APPROVER_EMPLOYEE_POOL[nextNum % APPROVER_EMPLOYEE_POOL.length] || APPROVER_EMPLOYEE_POOL[0];

    const newRow: ClearanceLayerRow = {
      id: `layer-${Date.now()}`,
      layerNumber: nextNum,
      layerName: `Clearance Layer #${nextNum}`,
      approverMode: "SPECIFIC_PERSON",
      defaultRole: "Department Head (HOD)",
      approverEmpId: defaultEmp.empId,
      approverName: defaultEmp.name,
      approverDesignation: defaultEmp.designation,
      approverDepartment: defaultEmp.department,
      remarks: "Enter clearance directives or verification instructions for this layer.",
    };

    setLayers((prev) => [...prev, newRow]);
    setToastMsg(`Added Layer #${nextNum} to clearance configuration.`);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Delete Layer Row
  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) {
      alert("At least 1 clearance layer must remain in the configuration table.");
      return;
    }
    const filtered = layers.filter((l) => l.id !== id);
    const reindexed = filtered.map((l, idx) => ({ ...l, layerNumber: idx + 1 }));
    setLayers(reindexed);
    setToastMsg("Layer deleted successfully.");
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Field change
  const handleUpdateLayerField = (id: string, field: keyof ClearanceLayerRow, value: any) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  // Approver selection
  const handleSelectApproverPerson = (layerId: string, emp: ApproverEmployee) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId
          ? {
              ...l,
              approverEmpId: emp.empId,
              approverName: emp.name,
              approverDesignation: emp.designation,
              approverDepartment: emp.department,
            }
          : l
      )
    );
    setOpenDropdownLayerId(null);
    setApproverSearchQuery("");
  };

  // Reset Defaults
  const handleResetDefaults = () => {
    if (confirm("Reset clearance approval configuration to system defaults?")) {
      setLayers(DEFAULT_CLEARANCE_LAYERS);
      setToastMsg("Clearance configuration table reset to system defaults.");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  // Save Configuration
  const handleSaveConfiguration = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("separation_clearance_drag_v3", JSON.stringify(layers));
    }
    setToastMsg("Clearance Configuration saved successfully!");
    setTimeout(() => setToastMsg(""), 4000);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Clearance Configuration
            </span>
          </div>

          {/* SINGLE CLEAN TOP ACTION BAR */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="h-9 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>

            <Link
              to="/separation-clearance"
              className="h-9 px-3.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <ShieldCheck size={15} /> View Clearance Matrix
            </Link>

            {/* ONLY ONE ADD LAYER BUTTON */}
            <button
              type="button"
              onClick={handleAddMoreLayer}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={16} className="stroke-[3]" /> Add Layer
            </button>

            <button
              type="button"
              onClick={handleSaveConfiguration}
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer uppercase tracking-wider"
            >
              <Save size={15} /> Save Configuration
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="size-4 text-blue-600" />
                Separation Clearance Approval Layers Setup
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Drag and drop table rows to reorder clearance layer serials. Assign default roles (Supervisor/HOD) or select specific approver personnel.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Layers size={14} className="text-blue-600" />
              <span>{layers.length} Active Clearance Layers</span>
            </div>
          </div>

          {/* CLEAN TABLE-BASED CLEARANCE CONFIGURATION GRID WITH DRAG & DROP */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3 w-12 text-center border-r border-slate-200 dark:border-slate-700">DRAG</th>
                    <th className="py-3 px-3 w-20 text-center border-r border-slate-200 dark:border-slate-700">SERIAL</th>
                    <th className="py-3 px-4 w-72 border-r border-slate-200 dark:border-slate-700">LAYER NAME</th>
                    <th className="py-3 px-4 w-96 border-r border-slate-200 dark:border-slate-700">APPROVER ASSIGNMENT (DEFAULT ROLE / PERSON)</th>
                    <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-700">REMARKS &amp; INSTRUCTIONS</th>
                    <th className="py-3 px-3 w-16 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {layers.map((row, index) => {
                    const isDropdownOpen = openDropdownLayerId === row.id;
                    const isDragging = draggedIndex === index;

                    const filteredCandidates = APPROVER_EMPLOYEE_POOL.filter(
                      (emp) =>
                        !approverSearchQuery ||
                        emp.name.toLowerCase().includes(approverSearchQuery.toLowerCase()) ||
                        emp.empId.toLowerCase().includes(approverSearchQuery.toLowerCase()) ||
                        emp.department.toLowerCase().includes(approverSearchQuery.toLowerCase()) ||
                        emp.designation.toLowerCase().includes(approverSearchQuery.toLowerCase())
                    );

                    return (
                      <tr
                        key={row.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`transition-colors ${
                          isDragging
                            ? "bg-blue-50 dark:bg-blue-950/60 opacity-50 border-2 border-dashed border-blue-400"
                            : "hover:bg-slate-50 dark:hover:bg-slate-850"
                        }`}
                      >
                        {/* Drag Handle */}
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800 align-middle cursor-grab active:cursor-grabbing">
                          <GripVertical size={16} className="text-slate-400 mx-auto hover:text-blue-600 transition" />
                        </td>

                        {/* 1. SL / Layer Serial */}
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800 align-middle">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800">
                            Layer {row.layerNumber}
                          </span>
                        </td>

                        {/* 2. Layer Name Input */}
                        <td className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 align-middle">
                          <input
                            type="text"
                            value={row.layerName}
                            onChange={(e) => handleUpdateLayerField(row.id, "layerName", e.target.value)}
                            placeholder="Enter Layer Name (e.g. IT Clearance)..."
                            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-blue-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 outline-none transition"
                          />
                        </td>

                        {/* 3. Approver Assignment (Default Role OR Searchable Person Select) */}
                        <td className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 align-middle relative">
                          <div className="space-y-2">
                            {/* Mode Toggle Radio */}
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`mode-${row.id}`}
                                  checked={row.approverMode === "DEFAULT_ROLE"}
                                  onChange={() => handleUpdateLayerField(row.id, "approverMode", "DEFAULT_ROLE")}
                                  className="text-blue-600 focus:ring-blue-500 size-3.5"
                                />
                                <span>Default Role</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`mode-${row.id}`}
                                  checked={row.approverMode === "SPECIFIC_PERSON"}
                                  onChange={() => handleUpdateLayerField(row.id, "approverMode", "SPECIFIC_PERSON")}
                                  className="text-blue-600 focus:ring-blue-500 size-3.5"
                                />
                                <span>Assign Specific Person</span>
                              </label>
                            </div>

                            {/* Option A: Default Role Select */}
                            {row.approverMode === "DEFAULT_ROLE" ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={row.defaultRole}
                                  onChange={(e) => handleUpdateLayerField(row.id, "defaultRole", e.target.value)}
                                  className="w-full h-8.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-blue-400 focus:border-blue-500 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 outline-none transition"
                                >
                                  {DEFAULT_ROLE_OPTIONS.map((role) => (
                                    <option key={role} value={role}>
                                      {role}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              /* Option B: Searchable Person Dropdown */
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownLayerId(isDropdownOpen ? null : row.id);
                                    setApproverSearchQuery("");
                                  }}
                                  className="w-full h-8.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-blue-400 focus:border-blue-500 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between outline-none transition cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <User size={13} className="text-blue-600 shrink-0" />
                                    <span className="truncate font-bold text-blue-700 dark:text-blue-300">
                                      {row.approverName ? `${row.approverName} (${row.approverEmpId})` : "Select Approver Person..."}
                                    </span>
                                  </div>
                                  <ChevronDown size={13} className="text-slate-400 shrink-0 ml-1" />
                                </button>
                                <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                                  {row.approverDesignation} &bull; {row.approverDepartment}
                                </div>

                                {/* Searchable Dropdown Popup */}
                                {isDropdownOpen && (
                                  <div className="absolute left-4 right-4 top-16 z-30 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xl p-2.5 animate-in fade-in duration-150">
                                    <div className="relative mb-2">
                                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                      <input
                                        type="text"
                                        placeholder="Search Approver Person (Name, ID, Dept)..."
                                        value={approverSearchQuery}
                                        onChange={(e) => setApproverSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                                      />
                                    </div>

                                    <div className="max-h-44 overflow-y-auto space-y-1">
                                      {filteredCandidates.map((emp) => {
                                        const isSelected = emp.empId === row.approverEmpId;
                                        return (
                                          <div
                                            key={emp.empId}
                                            onClick={() => handleSelectApproverPerson(row.id, emp)}
                                            className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between text-xs ${
                                              isSelected
                                                ? "bg-blue-600 text-white font-bold"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                                            }`}
                                          >
                                            <div>
                                              <div className="font-bold">{emp.name} <span className="text-[10px] opacity-75">({emp.empId})</span></div>
                                              <div className="text-[10px] opacity-80">{emp.designation} &bull; {emp.department}</div>
                                            </div>
                                            {isSelected && <Check size={14} className="stroke-[3]" />}
                                          </div>
                                        );
                                      })}
                                      {filteredCandidates.length === 0 && (
                                        <div className="p-3 text-center text-slate-400 text-xs font-medium">
                                          No employee found.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Remarks Input */}
                        <td className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 align-middle">
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={(e) => handleUpdateLayerField(row.id, "remarks", e.target.value)}
                            placeholder="Type layer remarks / handover instructions..."
                            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-blue-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-lg text-xs text-slate-700 dark:text-slate-200 outline-none transition"
                          />
                        </td>

                        {/* 5. Row Delete Action */}
                        <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteLayer(row.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete Layer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
