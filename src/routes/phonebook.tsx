import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState, useMemo } from "react";
import { Search, Phone, Mail, Users, ChevronRight, Pin, X } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

const teamMembers = [
  { id: '2024049326', name: 'Hanif Uddin', role: 'Sr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01963978074', officialPhone: '01711223344', email: 'hanif.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/9caa5b84-6645-47c9-a35f-906ec1002c4d.jpg' },
  { id: '2026058726', name: 'Parvej Mahmud', role: 'Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01521205808', officialPhone: '01722334455', email: 'parvej.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b224da2f-32a6-4ab5-b98d-2fa9bddc2faa.jpg' },
  { id: '2026058686', name: 'Md. Abdur Rahaman', role: 'Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01531959653', officialPhone: '01733445566', email: 'rahaman.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/c32e2945-6433-43f7-835d-fd238617c955.jpg' },
  { id: '2023043910', name: 'Tahmid Afsar', role: 'Asst. Manager', department: 'Business Innovation', section: 'Management', personalPhone: '01750021154', officialPhone: '01744556677', email: 'tahmid.bd@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg' },
  { id: '2025054609', name: 'Md Mahir Shahriyar', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01713060427', officialPhone: '01755667788', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg' },
  { id: '2023044078', name: 'Md. Anik Islam', role: 'Deputy Manager', department: 'Business Innovation', section: 'Management', personalPhone: '01324726844', officialPhone: '01766778899', email: 'anik.ba@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/3bc63d43-b2f2-49aa-b0a2-1e7eda819a65.jpg' },
  { id: '2024049166', name: 'MD Maimoon Hossain Shomoy', role: 'Sr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01796221964', officialPhone: '01777889900', email: 'shomoy.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg' },
  { id: '2024051510', name: 'Md. Sadmanur Islam Shishir', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01946432534', officialPhone: '01788990011', email: 'shishir.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg' },
  { id: '2025053125', name: 'Al Riyad Karim', role: 'Sr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01732461622', officialPhone: '01799001122', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg' },
  { id: '2025054707', name: 'Allama Bakhtiyar Nafis', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01724654380', officialPhone: '01700112233', email: 'nafis.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/abd4f21d-eb54-4cc6-a197-ca373e4693be.jpg' },
  { id: '2025054710', name: 'Raihan Jami Khan', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01786076080', officialPhone: '01711223344', email: 'jami.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/93e35c4c-f827-4152-8faa-34ed422a1629.jpg' },
  { id: '2026059418', name: 'Md Robayet Hasan Yeasin', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01748570672', officialPhone: '01722334455', email: 'yeasin.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/4e73fa2f-e1d4-4b6a-90f8-153d977f9e63.jpg' },
  { id: '2026059427', name: 'Mir Md Moshiu Islam', role: 'Jr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01898899180', officialPhone: '01733445566', email: 'moshiu.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/108e0e41-f8c9-439c-aa94-46a83b263b3a.jpg' },
  { id: '2026059573', name: 'Md. Piyash Hasan', role: 'Executive', department: 'Business Innovation', section: 'Development', personalPhone: '01790800372', officialPhone: '01744556677', email: 'piyash.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/0fa2e575-f1e5-4490-9e5b-6b89d039ce10.jpg' },
  { id: '2026060310', name: 'Md. Shahid Hasan', role: 'Sr. Executive', department: 'Business Innovation', section: 'Development', personalPhone: '', officialPhone: '', email: '', image: 'https://i.pravatar.cc/150?u=2026060310' }
];

const roleBadgeStyle: Record<string, string> = {
  'Deputy Manager': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'Asst. Manager': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Sr. Executive': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Executive': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Jr. Executive': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export const Route = createFileRoute("/phonebook")({
  head: () => ({
    meta: [
      { title: "CRIPTON HRIS — Phonebook" },
      { name: "description", content: "Employee directory and contact phonebook." },
    ],
  }),
  component: PhonebookPage,
});

function PhonebookPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const uniqueSections = useMemo(() => {
    const sections = [...new Set(teamMembers.map(m => m.section))];
    return [{ value: 'all', label: 'All Sections' }, ...sections.map(s => ({ value: s, label: s }))];
  }, []);

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(teamMembers.map(m => m.role))];
    return [{ value: 'all', label: 'All Roles' }, ...roles.map(r => ({ value: r, label: r }))];
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return teamMembers.filter((member) => {
      const matchesSearch = !q ||
        member.name.toLowerCase().includes(q) ||
        member.personalPhone.includes(q) ||
        member.officialPhone.includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);
      const matchesSection = sectionFilter === 'all' || member.section === sectionFilter;
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      return matchesSearch && matchesSection && matchesRole;
    });
  }, [searchQuery, sectionFilter, roleFilter]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto">
          {/* Page Header */}
          <div className="border-b border-border/40 bg-[#f1f5f9]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="px-6 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Title + Breadcrumb */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                  <span>HRIS</span>
                  <ChevronRight className="size-3" />
                  <span className="text-foreground font-medium">Phonebook</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="size-4 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground leading-none">Employee Phonebook</h1>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {filteredMembers.length} of {teamMembers.length} contacts
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <SearchableSelect
                  options={[
                    { value: "all", label: "All Companies" },
                    { value: "pakiza-software", label: "Pakiza Software" },
                    { value: "pakiza-knit", label: "Pakiza Knit" },
                    { value: "pakiza-group", label: "Pakiza Group" },
                  ]}
                  value={companyFilter}
                  onChange={setCompanyFilter}
                  placeholder="Company"
                  className="w-40 h-9 rounded-xl text-[13px] bg-transparent border-border/60 text-muted-foreground hover:bg-black/5 transition-colors"
                />
                <SearchableSelect
                  options={uniqueSections}
                  value={sectionFilter}
                  onChange={setSectionFilter}
                  placeholder="Section"
                  className="w-40 h-9 rounded-xl text-[13px] bg-transparent border-border/60 text-muted-foreground hover:bg-black/5 transition-colors"
                />
                <SearchableSelect
                  options={uniqueRoles}
                  value={roleFilter}
                  onChange={setRoleFilter}
                  placeholder="All Roles"
                  className="w-40 h-9 rounded-xl text-[13px] bg-transparent border-border/60 text-muted-foreground hover:bg-black/5 transition-colors"
                />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-9 pl-9 pr-4 bg-transparent border border-border/60 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-[13px] text-muted-foreground transition-all hover:bg-black/5 placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Cards Grid */}
          <div className="px-6 py-6 max-w-7xl mx-auto">
            {filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Users className="size-8 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold text-foreground">No contacts found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Card Top – Avatar + Role */}
                    <div className="relative px-5 pt-6 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-muted/30 to-transparent">
                      <div className="relative mb-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="size-16 rounded-full object-fill ring-2 ring-background shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-400 ring-2 ring-card" />
                      </div>
                      <h3 className="font-semibold text-[13.5px] text-foreground leading-snug">{member.name}</h3>
                      <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleBadgeStyle[member.role] ?? 'bg-muted text-muted-foreground'}`}>
                        {member.role}
                      </span>
                    </div>

                    {/* Card Body – Contact Info */}
                    <div className="px-5 pb-4 space-y-3 border-t border-border/30 pt-4 bg-gradient-to-b from-card to-muted/20 flex-1">
                      <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider">Emp. ID</span>
                        <span className="text-foreground font-semibold text-[11px] break-all">{member.id}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider">Dept</span>
                        <span className="text-foreground font-semibold text-[11px] break-words">{member.department}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider">Section</span>
                        <span className="text-foreground font-semibold text-[11px] break-words">{member.section}</span>
                      </div>

                      <div className="h-px w-full bg-border/40 my-3" />

                      <div className="flex items-start gap-2 text-[10.5px] group/item">
                        <Phone className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5 group-hover/item:text-primary transition-colors" />
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider w-14 shrink-0 mt-[2px]">Official</span>
                        {member.officialPhone ? (
                          <a
                            href={`tel:${member.officialPhone}`}
                            className="text-foreground font-medium hover:text-primary transition-colors break-all"
                          >
                            {member.officialPhone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 italic">Not available</span>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-[10.5px] group/item">
                        <Phone className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5 group-hover/item:text-primary transition-colors" />
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider w-14 shrink-0 mt-[2px]">Personal</span>
                        {member.personalPhone ? (
                          <a
                            href={`tel:${member.personalPhone}`}
                            className="text-foreground font-medium hover:text-primary transition-colors break-all"
                          >
                            {member.personalPhone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 italic">Not available</span>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-[10.5px] group/item">
                        <Mail className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5 group-hover/item:text-primary transition-colors" />
                        <span className="text-muted-foreground/80 font-bold text-[9px] uppercase tracking-wider w-14 shrink-0 mt-[2px]">Email</span>
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-foreground font-medium hover:text-primary transition-colors break-all"
                          >
                            {member.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 italic">Not available</span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer – Actions */}
                    <div className="grid grid-cols-2 border-t border-border/20 bg-muted/30 mt-auto">
                      <a
                        href={`tel:${member.officialPhone || member.personalPhone}`}
                        className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold transition-colors border-r border-border/20 ${(member.officialPhone || member.personalPhone) ? 'text-muted-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground/30 pointer-events-none'}`}
                      >
                        <Phone className="size-3.5" />
                        Call
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold transition-colors ${member.email ? 'text-muted-foreground hover:bg-primary hover:text-primary-foreground' : 'text-muted-foreground/30 pointer-events-none'}`}
                      >
                        <Mail className="size-3.5" />
                        Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
