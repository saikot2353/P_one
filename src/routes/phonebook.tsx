import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import { MoreVertical, ChevronDown } from "lucide-react";

const teamMembers = [
  { id: '2024049326', name: 'Hanif Uddin', role: 'Sr. Executive', phone: '01963978074', email: 'hanif.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/9caa5b84-6645-47c9-a35f-906ec1002c4d.jpg' },
  { id: '2026058726', name: 'Parvej Mahmud', role: 'Executive', phone: '01521205808', email: 'parvej.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b224da2f-32a6-4ab5-b98d-2fa9bddc2faa.jpg' },
  { id: '2026058686', name: 'Md. Abdur Rahaman', role: 'Executive', phone: '01531959653', email: 'rahaman.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/c32e2945-6433-43f7-835d-fd238617c955.jpg' },
  { id: '2023043910', name: 'Tahmid Afsar', role: 'Asst. Manager', phone: '01750021154', email: 'tahmid.bd@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg' },
  { id: '2025054609', name: 'Md Mahir Shahriyar', role: 'Jr. Executive', phone: '01713060427', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg' },
  { id: '2023044078', name: 'Md. Anik Islam', role: 'Deputy Manager', phone: '01324726844', email: 'anik.ba@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/3bc63d43-b2f2-49aa-b0a2-1e7eda819a65.jpg' },
  { id: '2024049166', name: 'MD Maimoon Hossain Shomoy', role: 'Sr. Executive', phone: '01796221964', email: 'shomoy.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg' },
  { id: '2024051510', name: 'Md. Sadmanur Islam Shishir', role: 'Jr. Executive', phone: '01946432534', email: 'shishir.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg' },
  { id: '2025053125', name: 'Al Riyad Karim', role: 'Sr. Executive', phone: '01732461622', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg' },
  { id: '2025054707', name: 'Allama Bakhtiyar Nafis', role: 'Jr. Executive', phone: '01724654380', email: 'nafis.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/abd4f21d-eb54-4cc6-a197-ca373e4693be.jpg' },
  { id: '2025054710', name: 'Raihan Jami Khan', role: 'Jr. Executive', phone: '01786076080', email: 'jami.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/93e35c4c-f827-4152-8faa-34ed422a1629.jpg' },
  { id: '2026059418', name: 'Md Robayet Hasan Yeasin', role: 'Jr. Executive', phone: '01748570672', email: 'yeasin.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/4e73fa2f-e1d4-4b6a-90f8-153d977f9e63.jpg' },
  { id: '2026059427', name: 'Mir Md Moshiu Islam', role: 'Jr. Executive', phone: '01898899180', email: 'moshiu.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/108e0e41-f8c9-439c-aa94-46a83b263b3a.jpg' },
  { id: '2026059573', name: 'Md. Piyash Hasan', role: 'Executive', phone: '01790800372', email: 'piyash.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/0fa2e575-f1e5-4490-9e5b-6b89d039ce10.jpg' },
  { id: '2026060310', name: 'Md. Shahid Hasan', role: 'Sr. Executive', phone: '', email: '', image: 'https://i.pravatar.cc/150?u=2026060310' }
];

export const Route = createFileRoute("/phonebook")({
  head: () => ({
    meta: [
      { title: "CRIPTON HRIS — Phonebook" },
      { name: "description", content: "Employee directory and contact information." },
    ],
  }),
  component: PhonebookPage,
});

function PhonebookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("PSL-Operation");
  const [section, setSection] = useState("");
  const [searchWith, setSearchWith] = useState("");

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-muted/20 text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Topbar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

            {/* Filter Header */}
            <div className="bg-card/90 backdrop-blur border border-border/50 shadow-sm p-4 rounded flex flex-col xl:flex-row items-end gap-6 mb-8 mt-2 max-w-7xl mx-auto">

              <div className="flex-1 flex gap-6 w-full">
                {/* Location Filter */}
                <div className="flex-1 space-y-1 relative group">
                  <label className="text-[10px] text-muted-foreground transition-colors group-focus-within:text-foreground">Location</label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-8 px-0 bg-transparent border-b border-border/80 focus:border-foreground outline-none appearance-none font-semibold text-[13px] text-foreground transition-colors cursor-pointer"
                    >
                      <option value="PSL-Operation">PSL-Operation</option>
                      <option value="PSL-HQ">PSL-HQ</option>
                      <option value="All">All Locations</option>
                    </select>
                    <ChevronDown className="absolute right-0 bottom-2 size-3.5 text-muted-foreground pointer-events-none transition-transform group-focus-within:-rotate-180" />
                  </div>
                </div>

                {/* Section Filter */}
                <div className="flex-1 space-y-1 relative group">
                  <label className="text-[10px] text-muted-foreground transition-colors group-focus-within:text-foreground">Section</label>
                  <div className="relative">
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full h-8 px-0 bg-transparent border-b border-border/80 focus:border-foreground outline-none appearance-none font-semibold text-[13px] text-foreground transition-colors cursor-pointer"
                    >
                      <option value=""></option>
                      <option value="engineering">Engineering</option>
                      <option value="hr">Human Resources</option>
                    </select>
                    <ChevronDown className="absolute right-0 bottom-2 size-3.5 text-muted-foreground pointer-events-none transition-transform group-focus-within:-rotate-180" />
                  </div>
                </div>

                {/* Search With Filter */}
                <div className="flex-1 space-y-1 relative group">
                  <label className="text-[10px] text-[#3b82f6] font-semibold transition-colors group-focus-within:text-blue-600">Search With</label>
                  <div className="relative">
                    <select
                      value={searchWith}
                      onChange={(e) => setSearchWith(e.target.value)}
                      className="w-full h-8 px-0 bg-transparent border-b border-border/80 focus:border-blue-500 outline-none appearance-none font-semibold text-[13px] text-foreground transition-colors cursor-pointer"
                    >
                      <option value=""></option>
                      <option value="name">Name</option>
                      <option value="phone">Phone</option>
                    </select>
                    <ChevronDown className="absolute right-0 bottom-2 size-3.5 text-muted-foreground pointer-events-none transition-transform group-focus-within:-rotate-180" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end pb-1">
                  <button className="h-7 px-6 bg-[#3b82f6] hover:bg-blue-600 text-white text-[10px] font-bold rounded shadow-sm transition-all hover:shadow hover:-translate-y-[1px] uppercase tracking-wider">
                    Search
                  </button>
                </div>
              </div>

              {/* Action Area (Right Side) */}
              <div className="flex items-end w-full xl:w-[400px]">
                <div className="flex-1 relative flex items-center border-l-[3px] border-[#22c55e] pl-4">
                  <input
                    type="text"
                    placeholder="Search... (min 3 char.)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 bg-transparent border-b border-border/80 focus:border-green-500 outline-none text-[13px] font-medium transition-colors placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-card rounded shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col relative group">

                  {/* Top Bar for dots */}
                  <div className="absolute top-3 right-3 z-10">
                    <button className="text-muted-foreground/40 hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-muted/80 backdrop-blur-sm">
                      <MoreVertical className="size-4" />
                    </button>
                  </div>

                  {/* Profile Header */}
                  <div className="pt-8 pb-5 px-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={member.image}
                        alt={member.name}
                        className="size-[72px] rounded-full object-fill shadow-sm ring-4 ring-background relative z-10 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-semibold text-[14px] text-foreground tracking-tight leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1">
                      {member.role}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="w-full h-[1px] bg-border/40"></div>
                    <div className="p-5 space-y-2 bg-gradient-to-b from-transparent to-muted/10 rounded-b">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground/70 w-3 shrink-0">D:</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate">General Department</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground/70 w-3 shrink-0">E:</span>
                        <a href={`mailto:${member.email}`} className="text-[10px] text-muted-foreground font-medium hover:text-primary transition-colors truncate">
                          {member.email || '—'}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground/70 w-3 shrink-0">M:</span>
                        <a href={`tel:${member.phone}`} className="text-[10px] text-muted-foreground font-medium hover:text-primary transition-colors truncate">
                          {member.phone || '—'}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-muted-foreground/70 w-3 shrink-0">P:</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-sm font-medium">No team members found matching your search.</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
