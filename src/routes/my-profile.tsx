import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  User,
  Building2,
  ShieldCheck,
  Download,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/my-profile")({
  head: () => ({
    meta: [
      { title: "My Profile — CRIPTON HRIS" },
      {
        name: "description",
        content: "View essential employee personal and corporate identity details.",
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>Personnel Info</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">My Profile</span>
          </div>

          {/* Clean Executive Header Card (No Repeated Specs) */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            {/* Ambient Banner */}
            <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 relative p-4 flex items-start justify-end">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-2xs">
                  <Building2 className="size-3.5 text-blue-200" />
                  Pakiza Software Limited (PSL)
                </span>
              </div>
            </div>

            {/* Profile Info Row */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Avatar + Main Title */}
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div className="relative shrink-0 -mt-12 sm:-mt-14 z-10">
                    <div className="size-24 sm:size-28 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-md">
                      <img
                        src="https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
                        alt="Tahmid Afsar"
                        className="size-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" title="Status: Active Employee" />
                  </div>

                  <div className="pt-2 sm:pt-3 space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Tahmid Afsar
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <ShieldCheck className="size-3.5" />
                        Active Employee
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Jr. Executive</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>Business Innovation</span>
                    </p>
                  </div>
                </div>

                {/* PDF Download Button */}
                <div className="pt-2 sm:pt-4 self-stretch sm:self-center shrink-0">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer active:scale-95"
                  >
                    <Download className="size-4" />
                    <span>DOWNLOAD PDF</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* NON-REPETITIVE 17-FIELD PROFILE DETAILS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">

            {/* 1. CORPORATE DETAILS CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Building2 className="size-4 text-indigo-500" />
                  <span>Corporate Details</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">EMP ID (COMPANY)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      2023043910
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">DESIGNATION</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Deputy Manager
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">DEPARTMENT</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Business Innovation
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">SECTION</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Project Resource & Strategy
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">SET MANAGER</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-right">
                      Md. Anik Islam
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">JOINING DATE</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400" />
                      Mar 15, 2025
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">CONFIRMATION DATE</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      Sep 15, 2025
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">GROSS SALARY</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ৳ 45,000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PERSONAL & PARENTAL DETAILS CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800 pb-3">
                  <User className="size-4 text-emerald-500" />
                  <span>Personal & Parental Details</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">NAME (ENGLISH)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Tahmid Afsar
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">NAME (BENGALI)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                      তাহমিদ আফসার
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">DATE OF BIRTH</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400" />
                      Jul 12, 1999
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">FATHER NAME (ENGLISH)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Afsar Uddin Babul
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">MOTHER NAME (ENGLISH)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                      Shaheen Afsar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ADDRESSES & EMERGENCY CONTACT CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-xs tracking-wider uppercase border-b border-slate-100 dark:border-slate-800 pb-3">
                  <MapPin className="size-4 text-purple-500" />
                  <span>Addresses & Emergency Contact</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* PRESENT ADDRESS */}
                  <div className="space-y-1 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <MapPin className="size-3 text-purple-500" />
                      PRESENT ADDRESS
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      Rayer Bazar, Dhanmondi, Dhaka, Bangladesh
                    </p>
                  </div>

                  {/* PERMANENT ADDRESS */}
                  <div className="space-y-1 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <MapPin className="size-3 text-amber-500" />
                      PERMANENT ADDRESS
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      Bhola, Sadar Road, Bhola Sadar, Barishal, Bangladesh
                    </p>
                  </div>

                  {/* EMERGENCY CONTACT */}
                  <div className="space-y-2 bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200/70 dark:border-rose-900/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <HeartHandshake className="size-3.5 text-rose-500" />
                      EMERGENCY CONTACT PERSON
                    </span>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Name:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">Shaheen Afsar</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Contact Number:</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <Phone className="size-3" />
                          01875055501
                        </span>
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
