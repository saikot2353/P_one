import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Globe,
  MapPin,
  Compass,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  type Country,
  type PlaceInBD,
  DEFAULT_COUNTRIES,
  DEFAULT_PLACES,
} from "@/routes/configure-employment";

export interface Region {
  sl: number;
  code: string;
  nameEng: string;
  nameBng: string;
  shortName: string;
  country: string;
  isActive: "Active" | "Inactive";
}

export const DEFAULT_REGIONS: Region[] = [
  { sl: 1, code: "REG-DH", nameEng: "Dhaka Region", nameBng: "ঢাকা অঞ্চল", shortName: "DHR", country: "Bangladesh", isActive: "Active" },
  { sl: 2, code: "REG-CTG", nameEng: "Chattogram Region", nameBng: "চট্টগ্রাম অঞ্চল", shortName: "CTGR", country: "Bangladesh", isActive: "Active" },
  { sl: 3, code: "REG-SYL", nameEng: "Sylhet Region", nameBng: "সিলেট অঞ্চল", shortName: "SYLR", country: "Bangladesh", isActive: "Active" },
  { sl: 4, code: "REG-RAJ", nameEng: "Rajshahi Region", nameBng: "রাজশাহী অঞ্চল", shortName: "RAJR", country: "Bangladesh", isActive: "Active" },
  { sl: 5, code: "REG-KHU", nameEng: "Khulna Region", nameBng: "খুলনা অঞ্চল", shortName: "KHUR", country: "Bangladesh", isActive: "Active" },
  { sl: 6, code: "REG-BAR", nameEng: "Barishal Region", nameBng: "বরিশাল অঞ্চল", shortName: "BARR", country: "Bangladesh", isActive: "Active" },
  { sl: 7, code: "REG-RNG", nameEng: "Rangpur Region", nameBng: "রংপুর অঞ্চল", shortName: "RNGR", country: "Bangladesh", isActive: "Active" },
  { sl: 8, code: "REG-MYM", nameEng: "Mymensingh Region", nameBng: "ময়মনসিংহ অঞ্চল", shortName: "MYMR", country: "Bangladesh", isActive: "Active" },
  { sl: 9, code: "REG-SVR", nameEng: "Savar Operational Region", nameBng: "সাভার অঞ্চল", shortName: "SVR", country: "Bangladesh", isActive: "Active" },
  { sl: 10, code: "REG-GZP", nameEng: "Gazipur Industrial Zone", nameBng: "গাজীপুর অঞ্চল", shortName: "GZPR", country: "Bangladesh", isActive: "Active" },
];

export type LocationTabType = "country" | "region" | "place";

export interface LocationManagementViewProps {
  initialTab?: LocationTabType;
  embedded?: boolean;
  onTabChange?: (tab: LocationTabType) => void;
  onBackToOverview?: () => void;
}

export function LocationManagementView({
  initialTab = "country",
  embedded = false,
  onTabChange,
  onBackToOverview,
}: LocationManagementViewProps) {
  const [activeTab, setActiveTab] = useState<LocationTabType>(initialTab || "country");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [places, setPlaces] = useState<PlaceInBD[]>([]);

  // Filter state for Places
  const [placeTypeFilter, setPlaceTypeFilter] = useState<
    "All" | "Division" | "District" | "Upazila" | "Post Office"
  >("All");

  // Shared Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSl, setEditSl] = useState<number | null>(null);

  // Form states - Country
  const [countryCode, setCountryCode] = useState("");
  const [countryNameEng, setCountryNameEng] = useState("");
  const [countryNameBng, setCountryNameBng] = useState("");
  const [countryShort, setCountryShort] = useState("");
  const [countryNationality, setCountryNationality] = useState("");
  const [countryIsActive, setCountryIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Region
  const [regionCode, setRegionCode] = useState("");
  const [regionNameEng, setRegionNameEng] = useState("");
  const [regionNameBng, setRegionNameBng] = useState("");
  const [regionShort, setRegionShort] = useState("");
  const [regionCountry, setRegionCountry] = useState("Bangladesh");
  const [regionIsActive, setRegionIsActive] = useState<"Active" | "Inactive">("Active");

  // Form states - Place in BD
  const [placeType, setPlaceType] = useState<"Division" | "District" | "Upazila" | "Post Office">("District");
  const [placeCode, setPlaceCode] = useState("");
  const [placeNameEng, setPlaceNameEng] = useState("");
  const [placeNameBng, setPlaceNameBng] = useState("");
  const [placeShort, setPlaceShort] = useState("");
  const [placeParentSl, setPlaceParentSl] = useState<string>("");
  const [placeIsActive, setPlaceIsActive] = useState<"Active" | "Inactive">("Active");

  // Load from LocalStorage
  useEffect(() => {
    const safeParse = (key: string, defaultVal: any) => {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultVal;
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return defaultVal;
        if (parsed.length < defaultVal.length) {
          return defaultVal;
        }
        return parsed;
      } catch (e) {
        return defaultVal;
      }
    };

    const countriesData = safeParse("hris_countries", DEFAULT_COUNTRIES);
    setCountries(countriesData);
    localStorage.setItem("hris_countries", JSON.stringify(countriesData));

    const regionsData = safeParse("hris_regions", DEFAULT_REGIONS);
    setRegions(regionsData);
    localStorage.setItem("hris_regions", JSON.stringify(regionsData));

    const placesData = safeParse("hris_places", DEFAULT_PLACES);
    setPlaces(placesData);
    localStorage.setItem("hris_places", JSON.stringify(placesData));
  }, []);

  const openForm = (sl: number | null) => {
    setEditSl(sl);
    if (activeTab === "country") {
      const item = countries.find((c) => c.sl === sl);
      setCountryCode(item?.code || "");
      setCountryNameEng(item?.nameEng || "");
      setCountryNameBng(item?.nameBng || "");
      setCountryShort(item?.shortName || "");
      setCountryNationality(item?.nationality || "");
      setCountryIsActive(item?.isActive || "Active");
    } else if (activeTab === "region") {
      const item = regions.find((r) => r.sl === sl);
      setRegionCode(item?.code || "");
      setRegionNameEng(item?.nameEng || "");
      setRegionNameBng(item?.nameBng || "");
      setRegionShort(item?.shortName || "");
      setRegionCountry(item?.country || "Bangladesh");
      setRegionIsActive(item?.isActive || "Active");
    } else if (activeTab === "place") {
      const item = places.find((p) => p.sl === sl);
      setPlaceType(item?.type || (placeTypeFilter !== "All" ? placeTypeFilter : "Division"));
      setPlaceCode(item?.code || "");
      setPlaceNameEng(item?.nameEng || "");
      setPlaceNameBng(item?.nameBng || "");
      setPlaceShort(item?.shortName || "");
      setPlaceParentSl(item?.parentSl ? String(item.parentSl) : "");
      setPlaceIsActive(item?.isActive || "Active");
    }
    setIsFormOpen(true);
  };

  const handleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    if (activeTab === "country") {
      const updated = countries.filter((c) => c.sl !== sl).map((c, idx) => ({ ...c, sl: idx + 1 }));
      setCountries(updated);
      localStorage.setItem("hris_countries", JSON.stringify(updated));
    } else if (activeTab === "region") {
      const updated = regions.filter((r) => r.sl !== sl).map((r, idx) => ({ ...r, sl: idx + 1 }));
      setRegions(updated);
      localStorage.setItem("hris_regions", JSON.stringify(updated));
    } else if (activeTab === "place") {
      const updated = places.filter((p) => p.sl !== sl).map((p, idx) => ({ ...p, sl: idx + 1 }));
      setPlaces(updated);
      localStorage.setItem("hris_places", JSON.stringify(updated));
    }

    toast.success("Deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "country") {
      if (!countryNameEng) {
        toast.error("Country Name is required.");
        return;
      }
      let nextList = [...countries];
      if (editSl !== null) {
        nextList = countries.map((c) =>
          c.sl === editSl
            ? {
                ...c,
                code: countryCode,
                nameEng: countryNameEng,
                nameBng: countryNameBng,
                shortName: countryShort,
                nationality: countryNationality,
                isActive: countryIsActive,
              }
            : c,
        );
      } else {
        const sl = countries.length > 0 ? Math.max(...countries.map((c) => c.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: countryCode,
          nameEng: countryNameEng,
          nameBng: countryNameBng,
          shortName: countryShort,
          nationality: countryNationality,
          isActive: countryIsActive,
        });
      }
      setCountries(nextList);
      localStorage.setItem("hris_countries", JSON.stringify(nextList));
    } else if (activeTab === "region") {
      if (!regionNameEng) {
        toast.error("Region Name is required.");
        return;
      }
      let nextList = [...regions];
      if (editSl !== null) {
        nextList = regions.map((r) =>
          r.sl === editSl
            ? {
                ...r,
                code: regionCode,
                nameEng: regionNameEng,
                nameBng: regionNameBng,
                shortName: regionShort,
                country: regionCountry,
                isActive: regionIsActive,
              }
            : r,
        );
      } else {
        const sl = regions.length > 0 ? Math.max(...regions.map((r) => r.sl)) + 1 : 1;
        nextList.push({
          sl,
          code: regionCode,
          nameEng: regionNameEng,
          nameBng: regionNameBng,
          shortName: regionShort,
          country: regionCountry,
          isActive: regionIsActive,
        });
      }
      setRegions(nextList);
      localStorage.setItem("hris_regions", JSON.stringify(nextList));
    } else if (activeTab === "place") {
      if (!placeNameEng) {
        toast.error(`${placeType} Name is required.`);
        return;
      }

      let parentSlNum: number | undefined = undefined;
      if (placeType !== "Division") {
        if (!placeParentSl) {
          const parentLabel =
            placeType === "District"
              ? "Division"
              : placeType === "Upazila"
                ? "District"
                : "Upazila";
          toast.error(`Please select which ${parentLabel} this belongs to.`);
          return;
        }
        parentSlNum = Number(placeParentSl);
      }

      let nextList = [...places];
      if (editSl !== null) {
        nextList = places.map((p) =>
          p.sl === editSl
            ? {
                ...p,
                type: placeType,
                code: placeCode,
                nameEng: placeNameEng,
                nameBng: placeNameBng,
                shortName: placeShort,
                parentSl: parentSlNum,
                isActive: placeIsActive,
              }
            : p,
        );
      } else {
        const sl = places.length > 0 ? Math.max(...places.map((p) => p.sl)) + 1 : 1;
        nextList.push({
          sl,
          type: placeType,
          code: placeCode,
          nameEng: placeNameEng,
          nameBng: placeNameBng,
          shortName: placeShort,
          parentSl: parentSlNum,
          isActive: placeIsActive,
        });
      }
      setPlaces(nextList);
      localStorage.setItem("hris_places", JSON.stringify(nextList));
    }

    toast.success("Saved successfully");
    setIsFormOpen(false);
  };

  const insetWrapperClass =
    "group relative rounded-xl border border-border/80 focus-within:border-primary px-3.5 py-1.5 bg-muted/15 focus-within:bg-card transition-all duration-200";
  const insetLabelClass =
    "text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const insetInputClass =
    "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0";
  const insetSelectClass =
    "w-full bg-transparent border-0 outline-none text-xs font-normal text-foreground focus:ring-0 p-0 cursor-pointer";

  const tabsList: { type: LocationTabType; label: string; icon: any }[] = [
    { type: "country", label: "Country", icon: Globe },
    { type: "region", label: "Region", icon: Compass },
    { type: "place", label: "Place in BD", icon: MapPin },
  ];

  const content = (
    <div className={embedded ? "space-y-4 w-full" : "p-4 md:p-6 lg:p-8 space-y-2 max-w-[1800px] mx-auto w-full"}>
      {/* Breadcrumb & Header */}
      {embedded ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onBackToOverview?.()}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Master Overview</span>
            </button>
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              Category: Organization & Structure
            </span>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <span>Organization & Structure</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Location Management</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <MapPin className="size-6 text-primary" />
                Location Management
              </h1>
            </div>
            <button
              onClick={() => openForm(null)}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="size-4.5" /> Add New Record
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <span>Configure</span>
              <ChevronRight className="size-3.5" />
              <span className="text-primary font-bold">Location Setup</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="size-6 text-primary" />
              Location Configuration
            </h1>
          </div>
          <button
            onClick={() => openForm(null)}
            className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="size-4.5" /> Add New Record
          </button>
        </div>
      )}

      {/* Horizontal Master Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 pb-5 border-b border-border/40 mb-4">
        {tabsList.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => {
                setActiveTab(tab.type);
                setSearchQuery("");
                onTabChange?.(tab.type);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <TabIcon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search bar & Actions toolbar */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
          <Search className="size-4.5 text-muted-foreground/70" />
          <input
            type="text"
            placeholder={`Search ${tabsList.find((t) => t.type === activeTab)?.label}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => toast.success("Exporting to Excel...")}
            className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="size-4.5 text-emerald-600" /> Excel
          </button>
          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="size-4.5 text-blue-600" /> Print
          </button>
          <button
            onClick={() => toast.success("Generating PDF...")}
            className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="size-4.5 text-red-600" /> PDF
          </button>
        </div>
      </div>

      {/* Master Table Router */}
      <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {/* 1. Country Tab Table */}
          {activeTab === "country" && (
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
              <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                <tr className="bg-transparent">
                  <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                    #
                  </th>
                  <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                    Actions
                  </th>
                  <th className="px-5 py-4 w-[120px]">Code</th>
                  <th className="px-5 py-4 min-w-[200px]">Country (Eng)</th>
                  <th className="px-5 py-4 min-w-[200px]">Country (Bng)</th>
                  <th className="px-5 py-4 w-[120px]">Short Name</th>
                  <th className="px-5 py-4 min-w-[150px]">Nationality</th>
                  <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-foreground">
                {countries
                  .filter(
                    (c) =>
                      (c.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (c.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (c.nationality || "").toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((item, idx) => (
                    <tr key={item.sl} className="group hover:bg-muted/50 transition-all">
                      <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                        {idx + 1}
                      </td>
                      <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openForm(item.sl)}
                            className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.sl)}
                            className="text-red-500 hover:text-red-650 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                      <td className="px-5 py-3.5 font-normal text-foreground font-medium">{item.nameEng}</td>
                      <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                        {item.nameBng || "—"}
                      </td>
                      <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                      <td className="px-5 py-3.5 font-normal">{item.nationality || "—"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${
                            item.isActive === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }`}
                        >
                          {item.isActive}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* 2. Region Tab Table */}
          {activeTab === "region" && (
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
              <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                <tr className="bg-transparent">
                  <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                    #
                  </th>
                  <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                    Actions
                  </th>
                  <th className="px-5 py-4 w-[120px]">Region Code</th>
                  <th className="px-5 py-4 min-w-[200px]">Region (Eng)</th>
                  <th className="px-5 py-4 min-w-[200px]">Region (Bng)</th>
                  <th className="px-5 py-4 w-[120px]">Short Name</th>
                  <th className="px-5 py-4 min-w-[150px]">Country</th>
                  <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-foreground">
                {regions
                  .filter(
                    (r) =>
                      (r.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (r.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (r.country || "").toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((item, idx) => (
                    <tr key={item.sl} className="group hover:bg-muted/50 transition-all">
                      <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                        {idx + 1}
                      </td>
                      <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openForm(item.sl)}
                            className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.sl)}
                            className="text-red-500 hover:text-red-650 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                      <td className="px-5 py-3.5 font-normal text-foreground font-medium">{item.nameEng}</td>
                      <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                        {item.nameBng || "—"}
                      </td>
                      <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                      <td className="px-5 py-3.5 font-normal text-slate-600 dark:text-slate-400">{item.country}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${
                            item.isActive === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }`}
                        >
                          {item.isActive}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* 3. Place in BD Tab Table */}
          {activeTab === "place" && (
            <div className="space-y-4">
              {/* Category Type filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 pb-2 border-b border-border/20">
                <div className="inline-flex p-1 bg-muted/40 border border-border/40 rounded-lg gap-1">
                  {(["All", "Division", "District", "Upazila", "Post Office"] as const).map((filterVal) => {
                    const count =
                      filterVal === "All" ? places.length : places.filter((p) => p.type === filterVal).length;
                    const label =
                      filterVal === "All"
                        ? "All Places"
                        : filterVal === "Post Office"
                          ? "Post Offices"
                          : filterVal + "s";
                    const isActive = placeTypeFilter === filterVal;

                    return (
                      <button
                        key={filterVal}
                        type="button"
                        onClick={() => setPlaceTypeFilter(filterVal)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-card text-primary shadow-xs border border-border/10 font-bold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <span>{label}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                            isActive ? "bg-primary/10 text-primary" : "bg-muted/80 text-muted-foreground/70"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse whitespace-nowrap" style={{ minWidth: "900px" }}>
                <thead className="bg-muted/30 text-muted-foreground uppercase font-semibold tracking-wider text-xs border-b border-border/40">
                  <tr className="bg-transparent">
                    <th className="sticky left-0 bg-transparent px-5 py-4 w-[60px] text-center border-r border-border/30 z-20">
                      #
                    </th>
                    <th className="sticky left-[60px] bg-transparent px-5 py-4 w-[110px] text-center border-r border-border/30 z-20">
                      Actions
                    </th>
                    <th className="px-5 py-4 w-[110px]">Type</th>
                    <th className="px-5 py-4 w-[120px]">Code</th>
                    <th className="px-5 py-4 min-w-[200px]">Name (Eng)</th>
                    <th className="px-5 py-4 min-w-[200px]">Name (Bng)</th>
                    <th className="px-5 py-4 min-w-[180px]">Belongs To</th>
                    <th className="px-5 py-4 w-[120px]">Short Name</th>
                    <th className="px-5 py-4 w-[120px] text-center">IsActive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-foreground">
                  {places
                    .filter((p) => {
                      const matchesSearch =
                        (p.nameEng || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.type || "").toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesType = placeTypeFilter === "All" || p.type === placeTypeFilter;
                      return matchesSearch && matchesType;
                    })
                    .map((item, idx) => {
                      const parent = places.find((p) => p.sl === item.parentSl);
                      return (
                        <tr key={item.sl} className="group hover:bg-muted/50 transition-all">
                          <td className="sticky left-0 bg-inherit px-5 py-3.5 text-center text-slate-500 font-normal border-r border-border/30 z-10">
                            {idx + 1}
                          </td>
                          <td className="sticky left-[60px] bg-inherit px-5 py-3.5 border-r border-border/30 z-10 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openForm(item.sl)}
                                className="text-orange-500 hover:text-orange-600 transition cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.sl)}
                                className="text-red-500 hover:text-red-650 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-bold">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                                item.type === "Division"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : item.type === "District"
                                    ? "bg-indigo-500/10 text-indigo-600"
                                    : item.type === "Upazila"
                                      ? "bg-violet-500/10 text-violet-600"
                                      : "bg-pink-500/10 text-pink-600"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-normal font-mono">{item.code || "—"}</td>
                          <td className="px-5 py-3.5 font-normal text-foreground font-medium">{item.nameEng}</td>
                          <td className="px-5 py-3.5 font-normal text-slate-700 dark:text-slate-300">
                            {item.nameBng || "—"}
                          </td>
                          <td className="px-5 py-3.5 font-normal">
                            {parent ? (
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {parent.nameEng}
                                </span>
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                                  {parent.type}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-light">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 font-normal">{item.shortName || "—"}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-normal border ${
                                item.isActive === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                              }`}
                            >
                              {item.isActive}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderModals = () => (
    <>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-border/40">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border/30 bg-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                  {activeTab === "country" && <Globe className="size-5" />}
                  {activeTab === "region" && <Compass className="size-5" />}
                  {activeTab === "place" && <MapPin className="size-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    {editSl ? "Update" : "Create"}{" "}
                    {tabsList.find((t) => t.type === activeTab)?.label}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Country Modal Body */}
              {activeTab === "country" && (
                <div className="space-y-4">
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Country Code</label>
                    <input
                      type="text"
                      placeholder="e.g. BD, US"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Country Name (Eng) *</label>
                    <input
                      type="text"
                      placeholder="Country (Eng)"
                      value={countryNameEng}
                      onChange={(e) => setCountryNameEng(e.target.value)}
                      className={insetInputClass}
                      required
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Country Name (Bng)</label>
                    <input
                      type="text"
                      placeholder="Country (Bng)"
                      value={countryNameBng}
                      onChange={(e) => setCountryNameBng(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Short Name</label>
                    <input
                      type="text"
                      placeholder="Short Name"
                      value={countryShort}
                      onChange={(e) => setCountryShort(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Nationality</label>
                    <input
                      type="text"
                      placeholder="Nationality (e.g. Bangladeshi)"
                      value={countryNationality}
                      onChange={(e) => setCountryNationality(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>IsActive *</label>
                    <select
                      value={countryIsActive}
                      onChange={(e) => setCountryIsActive(e.target.value as any)}
                      className={insetSelectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Region Modal Body */}
              {activeTab === "region" && (
                <div className="space-y-4">
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Region Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. REG-DH"
                      value={regionCode}
                      onChange={(e) => setRegionCode(e.target.value)}
                      className={insetInputClass}
                      required
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Region Name (Eng) *</label>
                    <input
                      type="text"
                      placeholder="Region Name (Eng)"
                      value={regionNameEng}
                      onChange={(e) => setRegionNameEng(e.target.value)}
                      className={insetInputClass}
                      required
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Region Name (Bng)</label>
                    <input
                      type="text"
                      placeholder="Region Name (Bng)"
                      value={regionNameBng}
                      onChange={(e) => setRegionNameBng(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Short Name</label>
                    <input
                      type="text"
                      placeholder="Short Name (e.g. DHR)"
                      value={regionShort}
                      onChange={(e) => setRegionShort(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Country *</label>
                    <select
                      value={regionCountry}
                      onChange={(e) => setRegionCountry(e.target.value)}
                      className={insetSelectClass}
                    >
                      {countries.map((c) => (
                        <option key={c.sl} value={c.nameEng}>
                          {c.nameEng}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>IsActive *</label>
                    <select
                      value={regionIsActive}
                      onChange={(e) => setRegionIsActive(e.target.value as any)}
                      className={insetSelectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Place in BD Modal Body */}
              {activeTab === "place" && (
                <div className="space-y-4">
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Place Type *</label>
                    <select
                      value={placeType}
                      onChange={(e) => {
                        setPlaceType(e.target.value as any);
                        setPlaceParentSl("");
                      }}
                      className={insetSelectClass}
                    >
                      <option value="Division">Division</option>
                      <option value="District">District</option>
                      <option value="Upazila">Upazila</option>
                      <option value="Post Office">Post Office</option>
                    </select>
                  </div>

                  {placeType === "District" && (
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Belongs to Division *</label>
                      <select
                        value={placeParentSl}
                        onChange={(e) => setPlaceParentSl(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="">Select Division...</option>
                        {places
                          .filter((p) => p.type === "Division")
                          .map((p) => (
                            <option key={p.sl} value={String(p.sl)}>
                              {p.nameEng} ({p.nameBng || p.shortName})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {placeType === "Upazila" && (
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Belongs to District *</label>
                      <select
                        value={placeParentSl}
                        onChange={(e) => setPlaceParentSl(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="">Select District...</option>
                        {places
                          .filter((p) => p.type === "District")
                          .map((p) => (
                            <option key={p.sl} value={String(p.sl)}>
                              {p.nameEng} ({p.nameBng || p.shortName})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {placeType === "Post Office" && (
                    <div className={insetWrapperClass}>
                      <label className={insetLabelClass}>Belongs to Upazila *</label>
                      <select
                        value={placeParentSl}
                        onChange={(e) => setPlaceParentSl(e.target.value)}
                        className={insetSelectClass}
                        required
                      >
                        <option value="">Select Upazila...</option>
                        {places
                          .filter((p) => p.type === "Upazila")
                          .map((p) => (
                            <option key={p.sl} value={String(p.sl)}>
                              {p.nameEng} ({p.nameBng || p.shortName})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>
                      {placeType === "Post Office" ? "Post Code *" : `${placeType} Code *`}
                    </label>
                    <input
                      type="text"
                      placeholder={placeType === "Post Office" ? "Post Code (e.g. 1216)" : "Code"}
                      value={placeCode}
                      onChange={(e) => setPlaceCode(e.target.value)}
                      className={insetInputClass}
                      required
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>{placeType} Name (Eng) *</label>
                    <input
                      type="text"
                      placeholder={`${placeType} Name (Eng)`}
                      value={placeNameEng}
                      onChange={(e) => setPlaceNameEng(e.target.value)}
                      className={insetInputClass}
                      required
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>{placeType} Name (Bng)</label>
                    <input
                      type="text"
                      placeholder={`${placeType} Name (Bng)`}
                      value={placeNameBng}
                      onChange={(e) => setPlaceNameBng(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>Short Name</label>
                    <input
                      type="text"
                      placeholder="Short Name"
                      value={placeShort}
                      onChange={(e) => setPlaceShort(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                  <div className={insetWrapperClass}>
                    <label className={insetLabelClass}>IsActive *</label>
                    <select
                      value={placeIsActive}
                      onChange={(e) => setPlaceIsActive(e.target.value as any)}
                      className={insetSelectClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="border-t border-border/50 pt-5 flex items-center justify-between gap-3 bg-transparent -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-10 px-6 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-xs transition-all uppercase tracking-wider shadow-sm hover:shadow cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="submit"
                  className="h-10 px-8 rounded-lg text-white font-black text-xs shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 bg-[#2ecc71] hover:bg-[#27ae60] cursor-pointer"
                >
                  {editSl ? "UPDATE" : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="w-full relative">
      {content}
      {renderModals()}
    </div>
  );
}
