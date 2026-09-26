import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  User,
  Building2,
  Briefcase,
  ShieldCheck,
  FileText,
  Download,
  ChevronRight,
  Phone,
  MapPin,
  Users,
  AlertCircle,
  Shield,
  IdCard,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/my-profile")({
  head: () => ({
    meta: [
      { title: "Personal Details — CRIPTON HRIS" },
      {
        name: "description",
        content: "View employee personal and corporate identity details.",
      },
    ],
  }),
  component: MyProfilePage,
});

export function MyProfilePage() {
  const handleDownloadPdf = () => {
    toast.success("Downloading Personnel Profile PDF...");
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Personnel Info</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Personnel Details</span>
          </div>

          {/* Redesigned Profile Summary Header Card */}
          <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
            {/* Ambient Top Decorative Banner */}
            <div className="h-20 sm:h-24 w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-25" />
              
              <div className="absolute top-3 right-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/15 backdrop-blur-md text-white border border-white/25 shadow-2xs">
                  <Building2 className="size-3.5 text-blue-200" />
                  Pakiza Software Limited (PSL-Operation)
                </span>
              </div>
            </div>

            {/* Content Area with Larger Avatar & Crisp White Background Text */}
            <div className="px-5 pb-5 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-5 -mt-10 sm:-mt-14">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5 min-w-0">
                {/* Bigger Profile Picture Frame */}
                <div className="relative shrink-0 group">
                  <div className="size-24 sm:size-28 md:size-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-lg transition-transform group-hover:scale-105 duration-300">
                    <img
                      src="https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
                      alt="Md Mahir Shahriyar"
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" title="Status: Active Employee" />
                </div>

                {/* Main Employee Information (Positioned below banner on white bg) */}
                <div className="space-y-2 min-w-0 pt-1 sm:pt-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                      Md Mahir Shahriyar
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                      <ShieldCheck className="size-3.5 text-white" />
                      Permanent
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-extrabold">
                      <Briefcase className="size-3.5 text-blue-600 dark:text-blue-400" />
                      Jr. Executive
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold">
                      <Building2 className="size-3.5 text-slate-500 dark:text-slate-400" />
                      Business Innovation
                    </span>
                  </div>

                  {/* Micro Specs Items with Clear Text & High Contrast */}
                  <div className="flex items-center gap-3 text-xs font-medium flex-wrap pt-1">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <IdCard className="size-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-extrabold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">EMP ID:</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white">2025054609</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-extrabold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">PHONE:</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white">1713060427</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-extrabold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">JOINED:</span>
                      <span className="font-black text-slate-900 dark:text-white">Mar 15, 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Download className="size-4" />
                  <span>DOWNLOAD PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN VIEW-ONLY CONTENT (PERSONAL & IDENTITY) */}
          <div className="space-y-4">
              {/* 1. PRIMARY INFORMATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <User className="size-4 text-indigo-500" />
                  <span>PRIMARY INFORMATION</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      NAME (ENGLISH)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Md Mahir Shahriyar
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      NAME (BENGALI)
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      DATE OF BIRTH
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Oct 21, 1996
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      GENDER
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Male
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      RELIGION
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Islam
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      BLOOD GROUP
                    </span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs mt-0.5 block">
                      B (+ve)
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      MARITAL STATUS
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Unmarried
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      EDUCATION LEVEL
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. CORPORATE INFORMATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <Building2 className="size-4 text-emerald-500" />
                  <span>CORPORATE INFORMATION</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      EMP ID (SYSTEM)
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      2025054609
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      EMP ID (COMPANY)
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      2025054609
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      JOINING DATE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Mar 15, 2025
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      CONFIRMATION DATE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Jan 01, 0001
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      DEPARTMENT
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Business Innovation
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      DESIGNATION
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Jr. Executive
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      EMPLOYEE TYPE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Office Executive
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      WORKING AREA
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      PSL-Operation
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      SECTION
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Project Resource & Strategy
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      JOB NATURE
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      UNIT
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      PSL
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      LINE
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      GRADE
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs mt-0.5 block">
                      None
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      SHIFT
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      PSL-EX
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      EMPLOYMENT STATUS
                    </span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5 block">
                      Permanent
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PROBATION PERIOD
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      SET MANAGER
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Md. Anik Islam
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      RECRUITMENT TYPE
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      2
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-4 pt-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      RC NOTES
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-xs mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      After three months salary revised based on his performance (3000 thousand minimum).
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. LEGAL INFORMATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <ShieldCheck className="size-4 text-indigo-500" />
                  <span>LEGAL INFORMATION</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      NATIONAL ID (NID)
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs mt-0.5 block">
                      4202467058
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      BIRTH REG NO
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PASSPORT NO
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      DRIVING LICENSE NO
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PROF. MEMBERSHIP NO
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. PARENTAL INFORMATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <Users className="size-4 text-indigo-500" />
                  <span>PARENTAL INFORMATION</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      FATHER NAME (ENGLISH)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Md Abdur Rouf
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      MOTHER NAME (ENGLISH)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      Mst. Khadiza Begum
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      FATHER NAME (BENGALI)
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      MOTHER NAME (BENGALI)
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  Spouse information fields are hidden because Marital Status is set to Unmarried.
                </p>
              </div>

              {/* 5. RESIDENTIAL ADDRESS */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <MapPin className="size-4 text-amber-500" />
                  <span>RESIDENTIAL ADDRESS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* PRESENT ADDRESS */}
                  <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 block tracking-wider">
                      PRESENT ADDRESS
                    </span>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          DIVISION
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Dhaka
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          DISTRICT
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Dhaka
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          UPAZILA
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Dhanmondi
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          POST OFFICE
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Jigatala TSO
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          VILLAGE/HOUSE (ENG)
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          H#44/23
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          VILLAGE/HOUSE (BNG)
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block font-mono">
                          পাথারিয়া সফ্টওয়্যার লিমিটেড
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          ROAD
                        </span>
                        <span className="font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                          N/A
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          COUNTRY
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Bangladesh
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        MAILING DISPATCH PREVIEW
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 italic">
                        H#44/23, Dhanmondi, Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>

                  {/* PERMANENT ADDRESS */}
                  <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 block tracking-wider">
                      PERMANENT ADDRESS
                    </span>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          DIVISION
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Khulna
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          DISTRICT
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Jeshore
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          UPAZILA
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Jhikargachha
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          POST OFFICE
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Jhikargachha
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          VILLAGE/HOUSE (ENG)
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          262 Purandapur Parbazar
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          VILLAGE/HOUSE (BNG)
                        </span>
                        <span className="font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                          N/A
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          ROAD
                        </span>
                        <span className="font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                          N/A
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          COUNTRY
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                          Bangladesh
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        LEGAL DOSSIER DISPATCH PREVIEW
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 italic">
                        262 Purandapur Parbazar, Jhikargachha, Khulna, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. CONTACT INFORMATION */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <Phone className="size-4 text-indigo-500" />
                  <span>CONTACT INFORMATION</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      OFFICE EMAIL
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      OFFICE MOBILE
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      1713060427
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PERSONAL EMAIL
                    </span>
                    <span className="font-bold text-slate-400 dark:text-slate-500 text-xs mt-0.5 block">
                      N/A
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      PERSONAL CONTACT NO
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                      1713060427
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. DOCUMENT VAULT */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <FileText className="size-4 text-indigo-500" />
                  <span>DOCUMENT VAULT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        Authorized Signature
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Clean white sheet</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                      Missing
                    </span>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <IdCard className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        National ID Card (Front)
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Front side, JPG/PDF</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                      Missing
                    </span>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <IdCard className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        National ID Card (Back)
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Back side, JPG/PDF</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                      Missing
                    </span>
                  </div>
                </div>
              </div>

              {/* 8. EMERGENCY CONTACTS & CORPORATE REFERENCES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EMERGENCY CONTACTS */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                    <AlertCircle className="size-4 text-rose-500" />
                    <span>EMERGENCY CONTACTS</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        CONTACT PERSON
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                        Md Abdur Rouf
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        RELATIONSHIP
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                        Father
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        PRIMARY MOBILE NO
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                        01740820000
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        ALTERNATIVE CONTACT
                      </span>
                      <span className="font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                        N/A
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        EMAIL ADDRESS
                      </span>
                      <span className="font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                        N/A
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      DETAILED ADDRESS
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                      H#44/23, Jigatala TSO, Dhanmondi, Dhaka
                    </p>
                  </div>
                </div>

                {/* CORPORATE REFERENCES */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                    <Shield className="size-4 text-indigo-500" />
                    <span>CORPORATE REFERENCES</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* PRIMARY REFERENCE */}
                    <div className="space-y-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block tracking-wider">
                        PRIMARY REFERENCE
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            REFEREE NAME
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            CONTACT NUMBER
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            DESIGNATION & ORG
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                      </div>
                    </div>

                    {/* SECONDARY REFERENCE */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block tracking-wider">
                        SECONDARY REFERENCE
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            REFEREE NAME
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            CONTACT NUMBER
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            DESIGNATION & ORG
                          </span>
                          <span className="font-bold text-slate-400 dark:text-slate-500">N/A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
