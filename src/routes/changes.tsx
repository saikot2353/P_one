import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/changes")({
  component: ChangesPage,
});

type ChangeRecord = {
  id: string;
  date: string;
  type: "Modify" | "New Addition" | "";
  module: string;
  description: string;
};

function ChangesPage() {
  const [records, setRecords] = useState<ChangeRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("system_changes");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords([
        {
          id: "1",
          date: new Date().toISOString().split("T")[0],
          type: "New Addition",
          module: "Module Selection",
          description: "Added a new menu 'Changes!' to track system updates like an Excel sheet.",
        },
      ]);
    }
  }, []);

  const saveRecords = (newRecords: ChangeRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem("system_changes", JSON.stringify(newRecords));
  };

  const addRow = () => {
    const newRecord: ChangeRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: "New Addition",
      module: "",
      description: "",
    };
    saveRecords([...records, newRecord]);
  };

  const updateRecord = (id: string, field: keyof ChangeRecord, value: string) => {
    const updated = records.map((r) => (r.id === id ? { ...r, [field]: value } : r));
    saveRecords(updated);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      {/* Header toolbar */}
      <div className="h-14 border-b border-slate-300 bg-[#f3f4f6] flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/module-selection" className="p-1.5 rounded hover:bg-slate-300 text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-[#107c41] font-semibold text-lg">
            <FileSpreadsheet size={24} />
            System Changes Tracker
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Plus size={16} />
            Insert Row
          </button>
          <button
            onClick={() => toast.success("Changes saved successfully!")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#107c41] text-white rounded text-sm hover:bg-[#0c5e31] transition-colors shadow-sm font-medium"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Excel Formula Bar Fake */}
      <div className="h-8 border-b border-slate-300 bg-white flex items-center px-4 shrink-0 text-sm">
        <div className="w-10 text-slate-400 font-mono flex items-center justify-center border-r border-slate-300 h-full bg-slate-100 italic">
          fx
        </div>
        <div className="flex-1 px-3 text-slate-500 font-mono overflow-hidden whitespace-nowrap">
          {records.length} total changes tracked
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        <table className="w-full border-collapse bg-white table-fixed">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f3f4f6] text-slate-600 text-[13px] text-center border-b border-slate-300 font-normal">
              <th className="w-10 border-r border-slate-300 bg-slate-200"></th>
              <th className="w-32 border-r border-slate-300 py-1.5 font-semibold text-slate-700">A (Date)</th>
              <th className="w-48 border-r border-slate-300 py-1.5 font-semibold text-slate-700">B (Type)</th>
              <th className="w-64 border-r border-slate-300 py-1.5 font-semibold text-slate-700">C (Module/Area)</th>
              <th className="border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">D (Description)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, idx) => (
              <tr key={row.id} className="text-[13px] group hover:bg-[#e5f1eb] transition-colors">
                <td className="border-b border-r border-slate-300 bg-slate-100 text-center text-xs text-slate-500 py-1 sticky left-0 z-10 w-10 select-none">
                  {idx + 1}
                </td>
                <td className="border-b border-r border-slate-300 p-0 h-[28px]">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRecord(row.id, "date", e.target.value)}
                    className="w-full h-full px-2 py-1 outline-none focus:ring-2 focus:ring-inset focus:ring-[#107c41] bg-transparent text-slate-800"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 h-[28px]">
                  <select
                    value={row.type}
                    onChange={(e) => updateRecord(row.id, "type", e.target.value as any)}
                    className="w-full h-full px-2 py-1 outline-none focus:ring-2 focus:ring-inset focus:ring-[#107c41] bg-transparent text-slate-800 appearance-none"
                  >
                    <option value="">Select Type...</option>
                    <option value="New Addition">New Addition</option>
                    <option value="Modify">Modify</option>
                  </select>
                </td>
                <td className="border-b border-r border-slate-300 p-0 h-[28px]">
                  <input
                    type="text"
                    value={row.module}
                    placeholder="e.g. Dashboard"
                    onChange={(e) => updateRecord(row.id, "module", e.target.value)}
                    className="w-full h-full px-2 py-1 outline-none focus:ring-2 focus:ring-inset focus:ring-[#107c41] bg-transparent text-slate-800 placeholder:text-slate-300"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 h-[28px]">
                  <input
                    type="text"
                    value={row.description}
                    placeholder="Enter change details..."
                    onChange={(e) => updateRecord(row.id, "description", e.target.value)}
                    className="w-full h-full px-3 py-1 outline-none focus:ring-2 focus:ring-inset focus:ring-[#107c41] bg-transparent text-slate-800 placeholder:text-slate-300"
                  />
                </td>
              </tr>
            ))}
            {/* Empty filler rows to look like Excel */}
            {Array.from({ length: Math.max(0, 30 - records.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="text-[13px] h-[28px]">
                <td className="border-b border-r border-slate-300 bg-slate-100 text-center text-xs text-slate-400 py-1 sticky left-0 z-10 w-10 select-none">
                  {records.length + i + 1}
                </td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
