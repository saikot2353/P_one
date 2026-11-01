import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  Building2,
  ShieldCheck,
  Layers,
  Plus,
  Trash2,
  Edit,
  Search,
  UserCheck,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { WarehouseStore, StorePermissionEmployee } from "@/lib/procurement-master-data";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Reference master data for Areas (matching company-setup.tsx & add-employee.tsx Working Area options)
export interface AreaSectionOption {
  value: string;
  label: string;
  shortName?: string;
  code?: string;
  type: "area" | "section";
  companyName: string;
}

const MASTER_DEFAULT_AREAS = [
  // Pakiza Knit Composite Ltd
  { code: "01", companyName: "Pakiza Knit Composite Ltd", nameEng: "PAL-Fabric Dyeing", shortName: "PAL-FD" },
  { code: "02", companyName: "Pakiza Knit Composite Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "03", companyName: "Pakiza Knit Composite Ltd", nameEng: "Savar Cutting Unit", shortName: "SCU" },
  { code: "04", companyName: "Pakiza Knit Composite Ltd", nameEng: "Savar Sewing Unit", shortName: "SSU" },
  { code: "05", companyName: "Pakiza Knit Composite Ltd", nameEng: "Savar Finishing Unit", shortName: "SFU" },
  { code: "06", companyName: "Pakiza Knit Composite Ltd", nameEng: "Narsingdi Spinning", shortName: "NSP" },
  { code: "07", companyName: "Pakiza Knit Composite Ltd", nameEng: "Narsingdi Yarn Dyeing", shortName: "NYD" },
  { code: "08", companyName: "Pakiza Knit Composite Ltd", nameEng: "Tongipara Dyeing Unit", shortName: "TDU" },
  { code: "09", companyName: "Pakiza Knit Composite Ltd", nameEng: "Ashulia Printing Unit", shortName: "APU" },
  { code: "10", companyName: "Pakiza Knit Composite Ltd", nameEng: "Narayanganj Apparels", shortName: "NJA" },
  { code: "11", companyName: "Pakiza Knit Composite Ltd", nameEng: "Comilla Spinning Unit", shortName: "CSU" },
  { code: "12", companyName: "Pakiza Knit Composite Ltd", nameEng: "Gazipur Texturizing", shortName: "GTL" },
  { code: "13", companyName: "Pakiza Knit Composite Ltd", nameEng: "Narsingdi Weaving", shortName: "NWV" },
  { code: "14", companyName: "Pakiza Knit Composite Ltd", nameEng: "Gulshan Showroom", shortName: "GSR" },
  { code: "15", companyName: "Pakiza Knit Composite Ltd", nameEng: "Uttara Warehouse", shortName: "UWH" },
  { code: "16", companyName: "Pakiza Knit Composite Ltd", nameEng: "Mymensingh Feed Mill", shortName: "MFM" },
  { code: "17", companyName: "Pakiza Knit Composite Ltd", nameEng: "Chittagong Port Depot", shortName: "CPD" },
  { code: "18", companyName: "Pakiza Knit Composite Ltd", nameEng: "Kaliakair Packaging", shortName: "KKP" },
  { code: "19", companyName: "Pakiza Knit Composite Ltd", nameEng: "Keraniganj Chemical Depot", shortName: "KCD" },
  { code: "20", companyName: "Pakiza Knit Composite Ltd", nameEng: "Motijheel Sales Office", shortName: "MSO" },

  // Pakiza Software Limited (Primary reference from Add Employee Form Working Area)
  { code: "PSL-01", companyName: "Pakiza Software Limited", nameEng: "PSL-Operation", shortName: "PSL-OP" },
  { code: "PSL-02", companyName: "Pakiza Software Limited", nameEng: "Head Office", shortName: "HO" },
  { code: "PSL-03", companyName: "Pakiza Software Limited", nameEng: "Factory Building A", shortName: "BLD-A" },
  { code: "PSL-04", companyName: "Pakiza Software Limited", nameEng: "Factory Building B", shortName: "BLD-B" },

  // Pakiza Apparels Ltd
  { code: "PAL-01", companyName: "Pakiza Apparels Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "PAL-02", companyName: "Pakiza Apparels Ltd", nameEng: "Savar Cutting Unit", shortName: "SCU" },
  { code: "PAL-03", companyName: "Pakiza Apparels Ltd", nameEng: "Savar Sewing Unit", shortName: "SSU" },
  { code: "PAL-04", companyName: "Pakiza Apparels Ltd", nameEng: "Savar Finishing Unit", shortName: "SFU" },
  { code: "PAL-05", companyName: "Pakiza Apparels Ltd", nameEng: "Ashulia Printing Unit", shortName: "APU" },
  { code: "PAL-06", companyName: "Pakiza Apparels Ltd", nameEng: "Narayanganj Apparels", shortName: "NJA" },
  { code: "PAL-07", companyName: "Pakiza Apparels Ltd", nameEng: "Uttara Warehouse", shortName: "UWH" },

  // Pakiza Spinning Mills Ltd
  { code: "PSM-01", companyName: "Pakiza Spinning Mills Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "PSM-02", companyName: "Pakiza Spinning Mills Ltd", nameEng: "Narsingdi Spinning", shortName: "NSP" },
  { code: "PSM-03", companyName: "Pakiza Spinning Mills Ltd", nameEng: "Comilla Spinning Unit", shortName: "CSU" },
  { code: "PSM-04", companyName: "Pakiza Spinning Mills Ltd", nameEng: "Spinning Spare Parts & Consumables Store", shortName: "SPC" },
  { code: "PSM-05", companyName: "Pakiza Spinning Mills Ltd", nameEng: "Uttara Warehouse", shortName: "UWH" },

  // Pakiza Dyeing & Printing Industries Ltd
  { code: "PDP-01", companyName: "Pakiza Dyeing & Printing Industries Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "PDP-02", companyName: "Pakiza Dyeing & Printing Industries Ltd", nameEng: "PAL-Fabric Dyeing", shortName: "PAL-FD" },
  { code: "PDP-03", companyName: "Pakiza Dyeing & Printing Industries Ltd", nameEng: "Tongipara Dyeing Unit", shortName: "TDU" },
  { code: "PDP-04", companyName: "Pakiza Dyeing & Printing Industries Ltd", nameEng: "Ashulia Printing Unit", shortName: "APU" },
  { code: "PDP-05", companyName: "Pakiza Dyeing & Printing Industries Ltd", nameEng: "Uttara Warehouse", shortName: "UWH" },

  // Pakiza Textiles Ltd
  { code: "PTX-01", companyName: "Pakiza Textiles Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "PTX-02", companyName: "Pakiza Textiles Ltd", nameEng: "Narsingdi Weaving", shortName: "NWV" },
  { code: "PTX-03", companyName: "Pakiza Textiles Ltd", nameEng: "Gazipur Texturizing", shortName: "GTL" },
  { code: "PTX-04", companyName: "Pakiza Textiles Ltd", nameEng: "Uttara Warehouse", shortName: "UWH" },

  // Pakiza Technovation Limited
  { code: "PTL-01", companyName: "Pakiza Technovation Limited", nameEng: "Head Office", shortName: "HO" },
  { code: "PTL-02", companyName: "Pakiza Technovation Limited", nameEng: "PSL-Operation", shortName: "PSL-OP" },
  { code: "PTL-03", companyName: "Pakiza Technovation Limited", nameEng: "Central IT & Hardware Depot", shortName: "IT-DEP" },
  { code: "PTL-04", companyName: "Pakiza Technovation Limited", nameEng: "Factory Building A", shortName: "BLD-A" },

  // Pakiza Garments Ltd
  { code: "PGL-01", companyName: "Pakiza Garments Ltd", nameEng: "Head Office", shortName: "HO" },
  { code: "PGL-02", companyName: "Pakiza Garments Ltd", nameEng: "Savar Sewing Unit", shortName: "SSU" },
  { code: "PGL-03", companyName: "Pakiza Garments Ltd", nameEng: "Savar Finishing Unit", shortName: "SFU" },
  { code: "PGL-04", companyName: "Pakiza Garments Ltd", nameEng: "Finished Goods Export Transit Store", shortName: "FGS" },
];

const MASTER_DEFAULT_SECTIONS = [
  { code: "ADM", nameEng: "Admin Support", shortName: "AS" },
  { code: "DEV", nameEng: "Software Development", shortName: "SD" },
  { code: "ACC", nameEng: "Accounts Payable", shortName: "AP" },
  { code: "SEW", nameEng: "Sewing Section", shortName: "SEW" },
  { code: "CUT", nameEng: "Cutting Section", shortName: "CUT" },
  { code: "FIN", nameEng: "Finishing Section", shortName: "FIN" },
  { code: "QA", nameEng: "Quality Assurance", shortName: "QA" },
  { code: "MNT", nameEng: "Maintenance Section", shortName: "MNT" },
];

// Helper to normalize organization string for flexible matching
const cleanOrg = (str: string): string =>
  (str || "")
    .toLowerCase()
    .replace(/\b(limited|ltd|pvt|inc|corp|co)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();

// Helper to load organization-specific areas & sections from existing master data
export const getOrgAreaSections = (orgName: string): AreaSectionOption[] => {
  const targetClean = cleanOrg(orgName);
  const options: AreaSectionOption[] = [];
  const addedValues = new Set<string>();

  const addOption = (
    value: string,
    name: string,
    shortName?: string,
    code?: string,
    type: "area" | "section" = "area",
    companyName = orgName,
  ) => {
    const cleanVal = (value || "").trim();
    if (!cleanVal || addedValues.has(cleanVal.toLowerCase())) return;
    addedValues.add(cleanVal.toLowerCase());

    const label = shortName && shortName !== cleanVal ? `${name} (${shortName})` : name;
    options.push({
      value: cleanVal,
      label,
      shortName,
      code,
      type,
      companyName,
    });
  };

  // 1. Read existing active records from localStorage (hris_areas)
  try {
    if (typeof window !== "undefined") {
      let rawAreas = localStorage.getItem("hris_areas");
      if (!rawAreas) {
        localStorage.setItem("hris_areas", JSON.stringify(MASTER_DEFAULT_AREAS));
        rawAreas = JSON.stringify(MASTER_DEFAULT_AREAS);
      }
      const parsed = JSON.parse(rawAreas);
      if (Array.isArray(parsed)) {
        parsed.forEach((a: any) => {
          const compClean = cleanOrg(a.companyName || a.company || "");
          const isMatch =
            !targetClean ||
            compClean === targetClean ||
            compClean.includes(targetClean) ||
            targetClean.includes(compClean);
          if (isMatch && (a.isActive === undefined || a.isActive === "Active")) {
            const name = a.nameEng || a.name || a.shortName;
            if (name) addOption(name, name, a.shortName, a.code, "area", a.companyName);
          }
        });
      }
    }
  } catch (e) {}

  // 2. Read existing active records from localStorage (hris_sections)
  try {
    if (typeof window !== "undefined") {
      let rawSections = localStorage.getItem("hris_sections");
      if (!rawSections) {
        localStorage.setItem("hris_sections", JSON.stringify(MASTER_DEFAULT_SECTIONS));
        rawSections = JSON.stringify(MASTER_DEFAULT_SECTIONS);
      }
      const parsed = JSON.parse(rawSections);
      if (Array.isArray(parsed)) {
        parsed.forEach((s: any) => {
          const compClean = cleanOrg(s.companyName || s.company || "");
          const isMatch =
            !s.companyName ||
            !targetClean ||
            compClean === targetClean ||
            compClean.includes(targetClean) ||
            targetClean.includes(compClean);
          if (isMatch && (s.isActive === undefined || s.isActive === "Active")) {
            const name = s.nameEng || s.name || s.shortName;
            if (name) addOption(name, name, s.shortName, s.code, "section", s.companyName);
          }
        });
      }
    }
  } catch (e) {}

  // 3. Fallback to reference MASTER_DEFAULT_AREAS if options list is empty or minimal
  if (options.length === 0) {
    MASTER_DEFAULT_AREAS.forEach((a) => {
      const compClean = cleanOrg(a.companyName);
      const isMatch =
        !targetClean ||
        compClean === targetClean ||
        compClean.includes(targetClean) ||
        targetClean.includes(compClean);
      if (isMatch) {
        addOption(a.nameEng, a.nameEng, a.shortName, a.code, "area", a.companyName);
      }
    });
  }

  // 4. Default universal fallback working areas if still empty for an unconfigured company name
  if (options.length === 0) {
    const fallbackList = [
      { name: "Head Office", shortName: "HO", code: "01" },
      { name: "Central Warehouse Area", shortName: "CWA", code: "02" },
      { name: "Main Production Unit", shortName: "MPU", code: "03" },
      { name: "Storage & Transit Section", shortName: "STS", code: "04" },
      { name: "Operations & Logistics Area", shortName: "OLA", code: "05" },
    ];
    fallbackList.forEach((item) => {
      addOption(item.name, item.name, item.shortName, item.code, "area", orgName);
    });
  }

  return options;
};

interface WarehouseStorePageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: WarehouseStore | null;
  companyList: string[];
  employeeList: Array<{ id: string; name: string; dept: string; title: string; mobile?: string }>;
  onSave: (data: WarehouseStore) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function WarehouseStorePageForm({
  mode,
  initialData,
  companyList,
  employeeList,
  onSave,
  onCancel,
  onSwitchToEdit,
}: WarehouseStorePageFormProps) {
  const [formData, setFormData] = useState<Partial<WarehouseStore>>(() => {
    if (initialData) return { ...initialData };
    return {
      storeCode: `WH-${Math.floor(100 + Math.random() * 900)}`,
      storeName: "",
      organization: companyList[0] || "Pakiza Knit Composite Ltd",
      companyAreaSection: "",
      storeManager: "",
      contactNumber: "",
      status: "Active",
      stockValuationMethod: "Weighted Average",
      serialNumberTrackingRequired: false,
      batchTrackingRequired: true,
      transactionModificationDays: 7,
      permissions: [],
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedEmpIdToAdd, setSelectedEmpIdToAdd] = useState("");
  const [permissionSearchQuery, setPermissionSearchQuery] = useState("");
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const employeeSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        employeeSearchRef.current &&
        !employeeSearchRef.current.contains(event.target as Node)
      ) {
        setIsEmployeeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isView = mode === "view";

  const handleManagerChange = (managerName: string) => {
    const emp = employeeList.find((e) => e.name === managerName);
    setFormData((prev) => ({
      ...prev,
      storeManager: managerName,
      contactNumber: emp?.mobile || "01750021154",
    }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const availableAreaSections = useMemo<AreaSectionOption[]>(() => {
    const org = formData.organization || companyList[0] || "Pakiza Knit Composite Ltd";
    return getOrgAreaSections(org);
  }, [formData.organization, companyList]);

  const selectedValue = useMemo(() => {
    const current = formData.companyAreaSection || "";
    if (!current) return "";
    const directMatch = availableAreaSections.find((opt) => opt.value === current);
    if (directMatch) return directMatch.value;
    const aliasMatch = availableAreaSections.find(
      (opt) =>
        opt.shortName === current ||
        opt.code === current ||
        opt.label === current ||
        opt.value.toLowerCase() === current.toLowerCase(),
    );
    return aliasMatch ? aliasMatch.value : current;
  }, [formData.companyAreaSection, availableAreaSections]);

  const handleOrganizationChange = (newOrg: string) => {
    const newAreaSections = getOrgAreaSections(newOrg);
    const currentSelection = formData.companyAreaSection || "";
    const isStillValid =
      currentSelection &&
      newAreaSections.some(
        (opt) =>
          opt.value === currentSelection ||
          opt.shortName === currentSelection ||
          opt.code === currentSelection ||
          opt.label === currentSelection ||
          opt.value.toLowerCase() === currentSelection.toLowerCase(),
      );

    setFormData((prev) => ({
      ...prev,
      organization: newOrg,
      companyAreaSection: isStillValid ? currentSelection : "",
    }));

    if (formErrors.companyAreaSection) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.companyAreaSection;
        return copy;
      });
    }
  };

  const orgOptions = useMemo(
    () => companyList.map((comp) => ({ value: comp, label: comp })),
    [companyList]
  );

  const areaSectionOptions = useMemo(
    () => availableAreaSections.map((sec) => ({ value: sec.value, label: sec.label })),
    [availableAreaSections]
  );

  const storeManagerOptions = useMemo(
    () =>
      employeeList.map((emp) => ({
        value: emp.name,
        label: `${emp.id} — ${emp.name} (${emp.title || emp.dept})`,
      })),
    [employeeList]
  );

  const filteredPermissionEmployees = employeeList.filter((emp) => {
    if (!permissionSearchQuery.trim()) return true;
    const q = permissionSearchQuery.toLowerCase();
    return (
      emp.id.toLowerCase().includes(q) ||
      emp.name.toLowerCase().includes(q) ||
      emp.dept.toLowerCase().includes(q) ||
      emp.title.toLowerCase().includes(q)
    );
  });

  const handleAddPermissionEmployee = () => {
    if (!selectedEmpIdToAdd) return;
    const emp = employeeList.find((e) => e.id === selectedEmpIdToAdd);
    if (!emp) return;

    const currentPerms = formData.permissions || [];
    if (currentPerms.some((p) => p.employeeId === emp.id)) return;

    const newPerm: StorePermissionEmployee = {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.dept || "General",
      designation: emp.title || "Staff",
    };

    setFormData((prev) => ({
      ...prev,
      permissions: [...(prev.permissions || []), newPerm],
    }));
    setSelectedEmpIdToAdd("");
    setPermissionSearchQuery("");
    setIsEmployeeDropdownOpen(false);
  };

  const handleRemovePermission = (empId: string) => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      permissions: (prev.permissions || []).filter((p) => p.employeeId !== empId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const finalStoreCode = formData.storeCode?.trim() || initialData?.storeCode || `WH-${Date.now()}`;
    const errors: Record<string, string> = {};
    if (!formData.storeName?.trim()) errors.storeName = "Store Name is required";
    if (
      formData.companyAreaSection &&
      availableAreaSections.length > 0 &&
      !availableAreaSections.some(
        (sec) =>
          sec.value === formData.companyAreaSection ||
          sec.shortName === formData.companyAreaSection ||
          sec.code === formData.companyAreaSection ||
          sec.label === formData.companyAreaSection ||
          sec.value.toLowerCase() === (formData.companyAreaSection || "").toLowerCase(),
      )
    ) {
      errors.companyAreaSection = "Selected Company Area/Section is not associated with this Organization";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: WarehouseStore = {
      id: initialData?.id || `wh-${Date.now()}`,
      storeCode: finalStoreCode,
      storeName: formData.storeName || "",
      organization: formData.organization || companyList[0] || "Pakiza Knit Composite Ltd",
      companyAreaSection: formData.companyAreaSection || "",
      storeManager: formData.storeManager || "",
      contactNumber: formData.contactNumber || "",
      status: formData.status || "Active",
      stockValuationMethod: formData.stockValuationMethod || "Weighted Average",
      serialNumberTrackingRequired: !!formData.serialNumberTrackingRequired,
      batchTrackingRequired: !!formData.batchTrackingRequired,
      transactionModificationDays: Number(formData.transactionModificationDays) || 7,
      permissions: formData.permissions || [],
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Warehouse List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Warehouse & Store
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  mode === "create"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : mode === "edit"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                }`}
              >
                {mode === "create" ? "New Entry" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Warehouse / Store"
                : mode === "edit"
                  ? `Edit Warehouse — ${formData.storeName || formData.storeCode}`
                  : `Warehouse Details — ${formData.storeName || formData.storeCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to List" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Record</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Warehouse" : "Update Warehouse"}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Store Information */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Building2 className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">General Store Information</h2>
          </div>

          {/* General Store Information - 4 columns per row layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.storeName || ""}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="e.g. Central Raw Material Warehouse"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.storeName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.storeName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Organization <span className="text-rose-500">*</span>
              </label>
              <SearchableSelect
                options={orgOptions}
                value={formData.organization || companyList[0] || ""}
                onChange={handleOrganizationChange}
                disabled={isView}
                placeholder="Select Organization..."
                className="w-full h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Company Area/Section
              </label>
              <SearchableSelect
                options={areaSectionOptions}
                value={selectedValue}
                onChange={(val) => {
                  setFormData({ ...formData, companyAreaSection: val });
                  if (formErrors.companyAreaSection) {
                    setFormErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.companyAreaSection;
                      return copy;
                    });
                  }
                }}
                disabled={isView || areaSectionOptions.length === 0}
                placeholder={
                  areaSectionOptions.length === 0
                    ? "No area/section available"
                    : "Select Area/Section..."
                }
                className="w-full h-9"
              />
              {formErrors.companyAreaSection && (
                <p className="text-[10px] text-rose-500 mt-1">
                  {formErrors.companyAreaSection}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Store Manager
              </label>
              <SearchableSelect
                options={storeManagerOptions}
                value={formData.storeManager || ""}
                onChange={handleManagerChange}
                disabled={isView}
                placeholder="Select Store Manager..."
                className="w-full h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Contact Number
                <span className="text-[10px] font-normal text-muted-foreground ml-1.5">
                  (Auto-filled)
                </span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.contactNumber || ""}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="e.g. +880 1711-XXXXXX"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                disabled={isView}
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Store Wise Permission */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Store Wise Permission</h2>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              Total Permitted: {formData.permissions?.length || 0}
            </span>
          </div>

          {!isView && (
            <div className="space-y-3 bg-muted/20 p-3.5 rounded-xl border border-border/70">
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-emerald-600" />
                  <span>Employee Search & Assign:</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    (Search and select employee from the list)
                  </span>
                </div>
              </div>

              {/* Search employees to filter option this field will be hide */}
              <div className="hidden">
                <input
                  type="text"
                  value={permissionSearchQuery}
                  onChange={(e) => setPermissionSearchQuery(e.target.value)}
                  placeholder="Search employees to filter options..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Employee Search Option */}
                <div className="relative flex-1" ref={employeeSearchRef}>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={
                        isEmployeeDropdownOpen
                          ? permissionSearchQuery
                          : employeeList.find((e) => e.id === selectedEmpIdToAdd)
                          ? `${employeeList.find((e) => e.id === selectedEmpIdToAdd)?.id} — ${
                              employeeList.find((e) => e.id === selectedEmpIdToAdd)?.name
                            } (${employeeList.find((e) => e.id === selectedEmpIdToAdd)?.dept} | ${
                              employeeList.find((e) => e.id === selectedEmpIdToAdd)?.title
                            })`
                          : permissionSearchQuery
                      }
                      onChange={(e) => {
                        setPermissionSearchQuery(e.target.value);
                        if (!isEmployeeDropdownOpen) setIsEmployeeDropdownOpen(true);
                        if (selectedEmpIdToAdd) setSelectedEmpIdToAdd("");
                      }}
                      onFocus={() => {
                        setIsEmployeeDropdownOpen(true);
                      }}
                      placeholder="Search Employees"
                      className="w-full h-9 pl-9 pr-8 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition"
                    />
                    {permissionSearchQuery || selectedEmpIdToAdd ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmpIdToAdd("");
                          setPermissionSearchQuery("");
                          setIsEmployeeDropdownOpen(false);
                        }}
                        className="absolute right-2.5 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition"
                        title="Clear search"
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEmployeeDropdownOpen((prev) => !prev)}
                        className="absolute right-2.5 p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Results */}
                  {isEmployeeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-border/40">
                      {filteredPermissionEmployees.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No matching employees found.
                        </div>
                      ) : (
                        filteredPermissionEmployees.map((emp) => {
                          const isAlreadyPermitted = formData.permissions?.some(
                            (p) => p.employeeId === emp.id
                          );
                          const isSelected = selectedEmpIdToAdd === emp.id;
                          return (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => {
                                setSelectedEmpIdToAdd(emp.id);
                                setPermissionSearchQuery("");
                                setIsEmployeeDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2.5 text-xs hover:bg-muted/70 transition flex items-center justify-between gap-2 cursor-pointer ${
                                isSelected ? "bg-amber-500/10 font-bold" : ""
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                    {emp.id}
                                  </span>
                                  <span className="font-semibold text-foreground truncate">
                                    {emp.name}
                                  </span>
                                  {isAlreadyPermitted && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                      Permitted
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {emp.dept} • {emp.title}
                                </div>
                              </div>
                              {isSelected && <Check className="size-4 text-amber-600 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddPermissionEmployee}
                  disabled={!selectedEmpIdToAdd}
                  className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Assign Staff</span>
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-3">SL</th>
                  <th className="py-2.5 px-3">Employee ID</th>
                  <th className="py-2.5 px-3">Employee Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Designation</th>
                  {!isView && <th className="py-2.5 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(formData.permissions || []).length === 0 ? (
                  <tr>
                    <td colSpan={isView ? 5 : 6} className="py-6 text-center text-muted-foreground">
                      No staff permissions assigned yet.
                    </td>
                  </tr>
                ) : (
                  formData.permissions?.map((p, index) => (
                    <tr key={p.employeeId} className="hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono text-muted-foreground">{index + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-foreground">{p.employeeId}</td>
                      <td className="py-2 px-3 font-bold text-foreground">{p.employeeName}</td>
                      <td className="py-2 px-3">{p.department}</td>
                      <td className="py-2 px-3">{p.designation}</td>
                      {!isView && (
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemovePermission(p.employeeId)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Remove permission"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Inventory Configuration */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Layers className="size-4 text-blue-500" />
            <h2 className="text-sm font-bold text-foreground">Inventory Configuration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Stock Valuation Method
              </label>
              <select
                disabled={isView}
                value={formData.stockValuationMethod || "Weighted Average"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockValuationMethod: e.target.value as any,
                  })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="FIFO">FIFO (First In First Out)</option>
                <option value="LIFO">LIFO (Last In First Out)</option>
                <option value="Weighted Average">Weighted Average</option>
                <option value="Moving Average">Moving Average</option>
                <option value="Standard Cost">Standard Cost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Transaction Modification Days
              </label>
              <input
                type="number"
                min={0}
                disabled={isView}
                value={formData.transactionModificationDays ?? 7}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionModificationDays: Number(e.target.value),
                  })
                }
                placeholder="e.g. 7"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Allowed days to modify vouchers
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20">
              <div>
                <div className="text-xs font-bold text-foreground">Location Tracking</div>
                <div className="text-[10px] text-muted-foreground">Rack, Bin & Aisle tracking</div>
              </div>
              <input
                type="checkbox"
                disabled={isView}
                checked={!!formData.serialNumberTrackingRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialNumberTrackingRequired: e.target.checked,
                  })
                }
                className="size-4.5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20">
              <div>
                <div className="text-xs font-bold text-foreground">Batch Tracking</div>
                <div className="text-[10px] text-muted-foreground">Batch & Lot numbering</div>
              </div>
              <input
                type="checkbox"
                disabled={isView}
                checked={!!formData.batchTrackingRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    batchTrackingRequired: e.target.checked,
                  })
                }
                className="size-4.5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Warehouse List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Warehouse" : "Update Warehouse"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
