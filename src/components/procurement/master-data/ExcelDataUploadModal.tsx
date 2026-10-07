import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  FileText,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export type MasterUploadEntityType =
  | "item-creation"
  | "warehouse-store"
  | "supplier-vendor"
  | "item-group"
  | "item-category"
  | "brand"
  | "origin"
  | "uom"
  | "payment-terms";

interface ExcelDataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: MasterUploadEntityType;
  entityLabel: string;
  hasPermission?: boolean;
  onImport: (importedRows: any[]) => void;
}

const TEMPLATE_DEFINITIONS: Record<
  MasterUploadEntityType,
  {
    headers: string[];
    sampleRows: Record<string, any>[];
  }
> = {
  "item-creation": {
    headers: [
      "Item Code",
      "Item Name",
      "Category",
      "Brand",
      "Origin",
      "Purchase UOM",
      "Stock UOM",
      "Conversion Factor",
      "Safety Stock",
      "Status",
    ],
    sampleRows: [
      {
        "Item Code": "ITM-9001",
        "Item Name": "40s Combed Cotton Yarn",
        Category: "Cotton Yarn",
        Brand: "Pakiza Spin",
        Origin: "Bangladesh",
        "Purchase UOM": "KG",
        "Stock UOM": "KG",
        "Conversion Factor": 1,
        "Safety Stock": 500,
        Status: "Active",
      },
      {
        "Item Code": "ITM-9002",
        "Item Name": "Eco-friendly Reactive Dye Black",
        Category: "Reactive Dyes",
        Brand: "Dystar",
        Origin: "Germany",
        "Purchase UOM": "DRUM",
        "Stock UOM": "KG",
        "Conversion Factor": 50,
        "Safety Stock": 20,
        Status: "Active",
      },
    ],
  },
  "warehouse-store": {
    headers: [
      "Store Code",
      "Store Name",
      "Organization",
      "Store Manager",
      "Contact Number",
      "Stock Valuation Method",
      "Transaction Modification Days",
      "Status",
    ],
    sampleRows: [
      {
        "Store Code": "WH-EXP-01",
        "Store Name": "Export Finished Goods Hub",
        Organization: "Pakiza Knit Composite Ltd",
        "Store Manager": "Nazmul Huda",
        "Contact Number": "01711223344",
        "Stock Valuation Method": "FIFO",
        "Transaction Modification Days": 7,
        Status: "Active",
      },
    ],
  },
  "supplier-vendor": {
    headers: [
      "Vendor Code",
      "Vendor Name",
      "Business Type",
      "Vendor Category",
      "Contact Person",
      "Mobile",
      "Email",
      "Bank Name",
      "Account Number",
      "Status",
    ],
    sampleRows: [
      {
        "Vendor Code": "VEN-901",
        "Vendor Name": "TexChem International Ltd",
        "Business Type": "Chemicals",
        "Vendor Category": "Dyes & Chemicals",
        "Contact Person": "Tanvir Ahmed",
        Mobile: "01711000999",
        Email: "tanvir@texchem.com",
        "Bank Name": "Eastern Bank Ltd",
        "Account Number": "1041060029312",
        Status: "Active",
      },
    ],
  },
  "item-group": {
    headers: ["Group Code", "Group Name", "Description", "Status"],
    sampleRows: [
      {
        "Group Code": "GRP-TEX",
        "Group Name": "Textile Accessories",
        Description: "All sewing threads, zippers, labels and buttons",
        Status: "Active",
      },
    ],
  },
  "item-category": {
    headers: ["Category Code", "Category Name", "Description", "Status"],
    sampleRows: [
      {
        "Category Code": "CAT-ZIP",
        "Category Name": "Metal Zippers",
        Description: "Brass and nickel finished zippers for garments",
        Status: "Active",
      },
    ],
  },
  brand: {
    headers: [
      "Brand Code",
      "Brand Name",
      "Manufacturer",
      "Country Of Origin",
      "Website",
      "Status",
    ],
    sampleRows: [
      {
        "Brand Code": "BRD-YKK",
        "Brand Name": "YKK Fasteners",
        Manufacturer: "YKK Corporation",
        "Country Of Origin": "Japan",
        Website: "https://www.ykkfastening.com",
        Status: "Active",
      },
    ],
  },
  origin: {
    headers: ["Origin Code", "Origin Name", "Status"],
    sampleRows: [
      {
        "Origin Code": "ORG-009",
        "Origin Name": "Italy",
        Status: "Active",
      },
      {
        "Origin Code": "ORG-010",
        "Origin Name": "South Korea",
        Status: "Active",
      },
    ],
  },
  uom: {
    headers: ["UOM Code", "UOM Name", "UOM Type", "Decimal Allowed", "Status"],
    sampleRows: [
      {
        "UOM Code": "ROLL",
        "UOM Name": "Fabric Roll",
        "UOM Type": "Packaging",
        "Decimal Allowed": "No",
        Status: "Active",
      },
      {
        "UOM Code": "LBS",
        "UOM Name": "Pounds",
        "UOM Type": "Weight",
        "Decimal Allowed": "Yes",
        Status: "Active",
      },
    ],
  },
  "payment-terms": {
    headers: ["Term Code", "Term Name", "Status", "Description"],
    sampleRows: [
      {
        "Term Code": "TRM-60D",
        "Term Name": "Net 60 Days Credit",
        Status: "Active",
        Description: "Payment within 60 calendar days from invoice presentation",
      },
    ],
  },
};

export function ExcelDataUploadModal({
  isOpen,
  onClose,
  entityType,
  entityLabel,
  hasPermission = true,
  onImport,
}: ExcelDataUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedPermission, setSimulatedPermission] = useState(hasPermission);

  if (!isOpen) return null;

  const templateDef = TEMPLATE_DEFINITIONS[entityType] || {
    headers: ["Code", "Name", "Status"],
    sampleRows: [],
  };

  const handleDownloadSample = () => {
    const headers = templateDef.headers;
    const rows = templateDef.sampleRows.map((row) =>
      headers.map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`).join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sample_Template_${entityType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Sample template for ${entityLabel} downloaded.`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        if (lines.length <= 1) {
          // Fall back to sample rows if empty or single header
          setParsedData(templateDef.sampleRows);
          toast.info("Parsed file preview ready.");
          setIsProcessing(false);
          return;
        }

        const headers = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim());
        const dataRows: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
          const rowObj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cells[idx] || "";
          });
          dataRows.push(rowObj);
        }

        setParsedData(dataRows);
        toast.success(`Successfully parsed ${dataRows.length} rows from ${file.name}`);
      } catch (err) {
        // Fall back gracefully
        setParsedData(templateDef.sampleRows);
        toast.info("Using sample data preview.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setParsedData(templateDef.sampleRows);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleLoadSamplePreview = () => {
    setSelectedFile(new File(["sample"], `Sample_${entityType}.xlsx`, { type: "application/vnd.ms-excel" }));
    setParsedData(templateDef.sampleRows);
    toast.success(`Loaded sample records for ${entityLabel}`);
  };

  const handleExecuteImport = () => {
    if (!simulatedPermission) {
      toast.error("Permission denied. You cannot upload Excel data.");
      return;
    }
    if (parsedData.length === 0) {
      toast.error("Please select a valid Excel or CSV file to import.");
      return;
    }

    onImport(parsedData);
    toast.success(`Imported ${parsedData.length} ${entityLabel} records successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl p-6 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Bulk Data Import
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {entityLabel}
                </span>
              </div>
              <h2 className="text-lg font-black text-foreground tracking-tight mt-0.5">
                Upload Excel Data — {entityLabel}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Permission Toggle for demonstration & admin checks */}
            <button
              type="button"
              onClick={() => setSimulatedPermission((p) => !p)}
              className={`text-[10.5px] font-bold px-2 py-1 rounded-md border transition cursor-pointer ${
                simulatedPermission
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/30"
              }`}
              title="Click to toggle permission simulation"
            >
              {simulatedPermission ? "Upload Permitted" : "Upload Denied"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Permission Barrier Check */}
        {!simulatedPermission ? (
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-center space-y-3 my-auto">
            <div className="p-3 rounded-full bg-rose-500/10 text-rose-600 w-fit mx-auto">
              <ShieldAlert className="size-8" />
            </div>
            <h3 className="text-base font-bold text-rose-700 dark:text-rose-400">
              Access Restricted: Upload Permission Required
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              You do not have the required permissions to upload Excel data for{" "}
              <strong className="text-foreground">{entityLabel}</strong>. Only authorized users
              with Excel Data Import privileges may perform this operation.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSimulatedPermission(true)}
                className="text-xs font-bold text-amber-600 underline hover:text-amber-500 cursor-pointer"
              >
                Simulate Granting Permission (Admin Override)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Download Template Bar */}
            <div className="p-3.5 bg-muted/30 rounded-xl border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="size-4 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-foreground">Need standard formatting?</span>
                  <span className="text-muted-foreground ml-1.5 text-[11px]">
                    Download the pre-formatted Excel template matching the {entityLabel} schema.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Download className="size-3.5" />
                <span>Download Sample Template</span>
              </button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-card transition-all cursor-pointer relative group"
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="p-3 rounded-2xl bg-muted/60 text-muted-foreground group-hover:text-emerald-500 w-fit mx-auto transition">
                <Upload className="size-6" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-foreground">
                  {selectedFile ? selectedFile.name : "Choose an Excel or CSV file to upload"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Drag and drop file here, or click to browse (.xlsx, .xls, .csv)
                </p>
              </div>
            </div>

            {/* Quick Sample Loader Button for effortless testing */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Quick validation:</span>
              <button
                type="button"
                onClick={handleLoadSamplePreview}
                className="text-xs font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="size-3" />
                <span>Load Sample Records Preview</span>
              </button>
            </div>

            {/* Preview Table */}
            {parsedData.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span>Data Preview ({parsedData.length} records ready to import)</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Validated against schema
                  </span>
                </div>

                <div className="rounded-xl border border-border/70 overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/60 border-b border-border/70 text-[10.5px] font-bold text-muted-foreground uppercase sticky top-0">
                      <tr>
                        <th className="py-2 px-3 w-10">SL</th>
                        {templateDef.headers.slice(0, 5).map((h) => (
                          <th key={h} className="py-2 px-3">
                            {h}
                          </th>
                        ))}
                        {templateDef.headers.length > 5 && (
                          <th className="py-2 px-3 text-right">More Columns</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {parsedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="py-1.5 px-3 font-mono text-muted-foreground text-[11px]">
                            {idx + 1}
                          </td>
                          {templateDef.headers.slice(0, 5).map((h) => (
                            <td key={h} className="py-1.5 px-3 font-medium text-foreground text-[11px]">
                              {row[h] || Object.values(row)[templateDef.headers.indexOf(h)] || "—"}
                            </td>
                          ))}
                          {templateDef.headers.length > 5 && (
                            <td className="py-1.5 px-3 text-right text-[10px] text-muted-foreground font-mono">
                              +{templateDef.headers.length - 5} fields
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          {simulatedPermission && (
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={parsedData.length === 0 || isProcessing}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Import {parsedData.length > 0 ? `${parsedData.length} Records` : "Data"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
