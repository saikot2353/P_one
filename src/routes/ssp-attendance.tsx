import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { CalendarIcon, PenTool, CheckSquare, ChevronRight, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/ssp-attendance")({
  component: SSPAttendanceDashboardPage,
});

function SSPAttendanceDashboardPage() {
  const cards = [
    { 
      title: "My Attendance", 
      icon: CalendarIcon, 
      desc: "View your complete attendance calendar, check-in, and check-out times", 
      to: "/ssp-my-attendance", 
      color: "from-blue-500/40 to-blue-500/10", 
      iconColor: "text-blue-500", 
      iconBg: "bg-blue-500/10" 
    },
    { 
      title: "Request Manual Attendance", 
      icon: PenTool, 
      desc: "Submit a request to manually adjust your missed or incorrect attendance punches", 
      to: "/ssp-request-manual-attendance", 
      color: "from-purple-500/40 to-purple-500/10", 
      iconColor: "text-purple-500", 
      iconBg: "bg-purple-500/10" 
    },
    { 
      title: "Approve Manual Attendance", 
      icon: CheckSquare, 
      desc: "Review and approve pending manual attendance requests from your team", 
      to: "/ssp-approve-manual-attendance", 
      color: "from-emerald-500/40 to-emerald-500/10", 
      iconColor: "text-emerald-500", 
      iconBg: "bg-emerald-500/10" 
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />
        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="hover:text-primary transition-colors">SSP</span>
                <ChevronRight className="size-2.5" />
                <span className="text-foreground">Attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">Attendance Management</h1>
              </div>
            </div>
            <div className="text-xs text-muted-foreground/80 font-medium">
              Select an option below to manage your calendar or manual attendance requests.
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cards.map(card => (
              <Link 
                key={card.title} 
                to={card.to}
                className="group relative bg-card border border-border/70 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col gap-5 hover:-translate-y-1"
              >
                <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex items-center justify-between">
                  <div className={`size-14 rounded-2xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    <card.icon className={`size-6 ${card.iconColor}`} />
                  </div>
                  <div className="size-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">{card.title}</h3>
                  <p className="text-[11px] text-muted-foreground/80 mt-1.5 leading-relaxed font-medium">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
