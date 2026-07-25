import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, FileSpreadsheet, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/changes")({
  component: ChangesPage,
});

type ChangeRecord = {
  id: string;
  date: string;
  type: "Modify" | "New Addition" | "";
  module: string;
  link?: string;
  descriptionEn: string;
  descriptionBn: string;
};

function ChangesPage() {
  const [records, setRecords] = useState<ChangeRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("system_changes_v8");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords([
        {
          id: "1",
          date: "2026-07-25T10:15",
          type: "New Addition",
          module: "Module Selection",
          link: "/module-selection",
          descriptionEn: "Created this 'Changes!' page! It works just like Excel, so you can easily track and edit all the new updates happening in the system.",
          descriptionBn: "নতুন 'Changes!' পেজ তৈরি করা হয়েছে! এটি এক্সেলের মতো কাজ করে, তাই আপনি সহজেই সিস্টেমের নতুন আপডেটগুলো ট্র্যাক ও এডিট করতে পারবেন।",
        },
        {
          id: "2",
          date: "2026-07-25T11:45",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Made the Basic Information section much cleaner! It's now laid out in 4 neat columns, making it much easier to read and prettier to look at.",
          descriptionBn: "বেসিক ইনফরমেশন সেকশনটি আরও সুন্দর করা হয়েছে! এটি এখন ৪টি কলামে সাজানো, ফলে পড়া সহজ এবং দেখতে আরও ভালো লাগছে।",
        },
        {
          id: "3",
          date: "2026-07-25T12:10",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Fixed the messy tables for Yarn, Fabric, and Trim! They are now combined into one perfectly aligned master table.",
          descriptionBn: "Yarn, Fabric এবং Trim-এর ছড়ানো টেবিলগুলো ঠিক করা হয়েছে! এগুলোকে এখন একটি সুন্দর সাজানো মাস্টার টেবিলে একত্রিত করা হয়েছে।",
        },
        {
          id: "4",
          date: "2026-07-25T13:00",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Made the tables more compact by reducing the text size and spacing. Now everything fits on the screen without having to scroll left and right!",
          descriptionBn: "টেক্সট সাইজ এবং স্পেসিং কমিয়ে টেবিলগুলোকে আরও কম্প্যাক্ট করা হয়েছে। এখন ডানে-বামে স্ক্রল করা ছাড়াই সব এক স্ক্রিনে ফিট হয়ে যাবে!",
        },
        {
          id: "5",
          date: "2026-07-25T13:45",
          type: "Modify",
          module: "Global System",
          link: "/",
          descriptionEn: "Switched the entire system to default to Light Mode! Everything will look bright and clear right from the start.",
          descriptionBn: "সিস্টেমের ডিফল্ট থিম হিসেবে লাইট মোড সেট করা হয়েছে! এখন সবকিছু শুরু থেকেই উজ্জ্বল এবং পরিষ্কার দেখাবে।",
        },
        {
          id: "6",
          date: "2026-07-25T14:50",
          type: "Modify",
          module: "Personnel List",
          link: "/personnel-list",
          descriptionEn: "Moved the 'Operations' tools to a sidebar! Now, when you select an employee, the tools automatically pop up on the right side. You can still see the main table and continue clicking other employees to update multiple at once.",
          descriptionBn: "অপারেশন টুলসগুলোকে সাইডবারে সরানো হয়েছে! এখন মেইন টেবিল থেকে যেকোনো এমপ্লয়ি সিলেক্ট করলেই টুলসগুলো ডানপাশে স্লাইড হয়ে খুলবে। আপনি তখনও মেইন টেবিল দেখতে পাবেন এবং একসাথে একাধিক কাজ করার জন্য অন্য এমপ্লয়ি সিলেক্ট করতে পারবেন।",
        },
        {
          id: "7",
          date: "2026-07-25T15:08",
          type: "Modify",
          module: "Payroll Deductions",
          link: "/payroll-deductions",
          descriptionEn: "Removed the 'Auto-Skip during Ramadan' option and the 'Single Period Exceptions' configuration from the Payroll Deductions setup panel.",
          descriptionBn: "পেরোল ডিডাকশন প্যানেল থেকে 'রোজার মাসে অটো-স্কিপ' অপশন এবং 'সিঙ্গেল পিরিয়ড এক্সেপশন' সেটিং অপশনগুলো বাদ দেওয়া হয়েছে।",
        },
      ]);
    }
  }, []);



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
              <th className="w-44 border-r border-slate-300 py-1.5 font-semibold text-slate-700">A (Date & Time)</th>
              <th className="w-48 border-r border-slate-300 py-1.5 font-semibold text-slate-700">B (Type)</th>
              <th className="w-64 border-r border-slate-300 py-1.5 font-semibold text-slate-700">C (Module/Area)</th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">D (English)</th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">E (Bangla)</th>
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
                    <option value="New Addition">New Addition</option>
                    <option value="Modify">Modify</option>
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
