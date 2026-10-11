import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, FileSpreadsheet, ExternalLink } from "lucide-react";
import { DEFAULT_CHANGE_RECORDS } from "./-changes-data";

export const Route = createFileRoute("/changes")({
  component: ChangesPage,
});

export type ChangeRecord = {
  id: string;
  date: string;
  type: string;
  module: string;
  link?: string;
  descriptionEn: string;
  descriptionBn: string;
};

function ChangesPage() {
  const [records, setRecords] = useState<ChangeRecord[]>([]);

  useEffect(() => {
<<<<<<< HEAD
    const saved = localStorage.getItem("system_changes_v570");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(DEFAULT_CHANGE_RECORDS);
      localStorage.setItem("system_changes_v570", JSON.stringify(DEFAULT_CHANGE_RECORDS));
=======
    const saved = localStorage.getItem("system_changes_v573");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      const updatedRecords: ChangeRecord[] = [
        {
          id: "573",
          date: "2026-10-11T13:45",
          type: "UI Refinement",
          module: "Approvals - Sync Requisition",
          link: "/sync-requisition",
          descriptionEn:
            "Compacted the layout of the Sync Requisition page, constraining the requisition input field to a balanced width, reducing padding, and making the controls and workflow layer cards clean and compact.",
          descriptionBn:
            "Sync Requisition পেজটির ডিজাইন কমপ্যাক্ট করা হয়েছে, যাতে রিকুইজিশন ইনপুট ফিল্ডটি অতিরিক্ত বড় না দেখায় এবং সম্পূর্ণ ইন্টারফেস পরিচ্ছন্ন ও সংকুচিত থাকে।",
        },
        {
          id: "572",
          date: "2026-10-11T13:35",
          type: "UI Refinement",
          module: "Approvals - Sync Requisition",
          link: "/sync-requisition",
          descriptionEn:
            "Streamlined the Sync Requisition page by removing the lower detailed data table while retaining the clean visual stepper cards for workflow layers.",
          descriptionBn:
            "Sync Requisition পেজটি পরিচ্ছন্ন করতে নিচের বিস্তারিত ডেটা টেবিলটি সরিয়ে দেওয়া হয়েছে এবং উপরের ভিজ্যুয়াল স্টেপার কার্ডগুলো বহাল রাখা হয়েছে।",
        },
        {
          id: "571",
          date: "2026-10-11T13:30",
          type: "New Addition",
          module: "Approvals - Sync Requisition",
          link: "/sync-requisition",
          descriptionEn:
            "Added new 'Sync Requisition' (/sync-requisition) submenu under Approvals with requisition number lookup, interactive sync confirmation, and live display of dynamic workflow layers the requisition goes through.",
          descriptionBn:
            "Approvals মেনুর অধীনে নতুন 'Sync Requisition' (/sync-requisition) সাবমেনু ও পেজ যুক্ত করা হয়েছে, যেখানে রিকুইজিশন নম্বর দিয়ে Sync ও Confirm করার পর রিকুইজিশনটি বর্তমানে কোন কোন ওয়ার্কফ্লো লেয়ার অতিক্রম করছে তা সরাসরি দেখা যাবে।",
        },
        {
          id: "570",
          date: "2026-10-11T13:05",
          type: "New Addition",
          module: "Approvals - Work Flow",
          link: "/work-flows",
          descriptionEn:
            "Added new 'Work Flow' (/work-flows) submenu under Approvals with complete approval workflows dashboard, multi-layer approval flow configuration modal, user assigner, and layer manager matching user design.",
          descriptionBn:
            "Approvals মেনুর অধীনে নতুন 'Work Flow' (/work-flows) সাবমেনু ও পেজ তৈরি করা হয়েছে, যেখান থেকে বিভিন্ন ধরনের ওয়ার্কফ্লো তৈরি, মাল্টি-লেয়ার অনুমোদন চেইন কনফিগারেশন, লেয়ারে ইউজার যুক্ত ও অনুমোদন পরিচালনা করা যাবে।",
        },
        ...DEFAULT_CHANGE_RECORDS,
      ];
      setRecords(updatedRecords);
      localStorage.setItem("system_changes_v571", JSON.stringify(updatedRecords));
>>>>>>> ef80540692f977a6537bd0098aa898b78ab2f5ae
    }
  }, []);

  const handleExport = () => {
    const headers = [
      "SL",
      "Date & Time",
      "Type",
      "Module/Area",
      "Description (English)",
      "Description (Bangla)",
    ];

    const rows = records.map((r, index) => [
      (index + 1).toString(),
      r.date,
      r.type,
      r.module,
      r.descriptionEn,
      r.descriptionBn,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `system_changes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      {/* Header toolbar */}
      <div className="h-14 border-b border-slate-300 bg-[#f3f4f6] flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            to="/module-selection"
            className="p-1.5 rounded hover:bg-slate-300 text-slate-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-[#107c41] font-semibold text-lg">
            <FileSpreadsheet size={24} />
            System Changes Tracker
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#107c41] hover:bg-[#0d6535] text-white text-xs font-bold transition-all shadow-sm hover:shadow"
        >
          <FileSpreadsheet size={15} />
          Export to Excel
        </button>
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
        <table className="w-full border-collapse bg-white table-fixed min-w-[1400px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f3f4f6] text-slate-600 text-[11px] text-center border-b border-slate-300 font-normal">
              <th className="w-10 border-r border-slate-300 bg-slate-200"></th>
              <th className="w-44 border-r border-slate-300 py-1.5 font-semibold text-slate-700">
                A (Date & Time)
              </th>
              <th className="w-48 border-r border-slate-300 py-1.5 font-semibold text-slate-700">
                B (Type)
              </th>
              <th className="w-64 border-r border-slate-300 py-1.5 font-semibold text-slate-700">
                C (Module/Area)
              </th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">
                D (English)
              </th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">
                E (Bangla)
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, idx) => (
              <tr key={row.id} className="text-[11px] group hover:bg-[#e5f1eb] transition-colors">
                <td className="border-b border-r border-slate-300 bg-slate-100 text-center text-xs text-slate-500 py-1 sticky left-0 z-10 w-10 select-none">
                  {idx + 1}
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <input
                    type="datetime-local"
                    value={row.date}
                    readOnly
                    className="w-full h-full min-h-[48px] px-2 py-2 outline-none bg-transparent text-slate-800 text-[11px]"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <select
                    value={row.type}
                    disabled
                    className="w-full h-full min-h-[48px] px-2 py-2 outline-none bg-transparent text-slate-800 appearance-none text-[11px]"
                  >
                    <option value="">Select Type...</option>
                    <option value="New">New</option>
                    <option value="New Addition">New Addition</option>
                    <option value="New Feature">New Feature</option>
                    <option value="Feature">Feature</option>
                    <option value="UI Update">UI Update</option>
                    <option value="UX Optimization">UX Optimization</option>
                    <option value="Modify">Modify</option>
                    <option value="UI / UX">UI / UX</option>
                    <option value="Business Logic">Business Logic</option>
                    <option value="Bug Fix">Bug Fix</option>
                  </select>
                </td>
                <td className="border-b border-r border-slate-300 p-0 group relative align-top">
                  <div className="flex items-start w-full h-full min-h-[48px]">
                    <input
                      type="text"
                      value={row.module}
                      placeholder="e.g. Dashboard"
                      readOnly
                      className="flex-1 min-w-0 h-full px-2 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px]"
                    />
                    {row.link && (
                      <Link
                        to={row.link as any}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 mt-1 mr-1 text-[#107c41] hover:bg-[#107c41]/10 rounded flex items-center justify-center shrink-0"
                        title={`Open ${row.module}`}
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <textarea
                    rows={3}
                    value={row.descriptionEn}
                    placeholder="Enter change details..."
                    readOnly
                    className="w-full h-full px-3 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px] resize-none overflow-y-auto"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <textarea
                    rows={3}
                    value={row.descriptionBn}
                    placeholder="বাংলায় বিবরণ লিখুন..."
                    readOnly
                    className="w-full h-full px-3 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px] resize-none overflow-y-auto"
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
