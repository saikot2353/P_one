import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from "recharts";

const headcount = [
  { m: "Jan", hires: 24, exits: 8 }, { m: "Feb", hires: 31, exits: 11 },
  { m: "Mar", hires: 28, exits: 9 }, { m: "Apr", hires: 42, exits: 14 },
  { m: "May", hires: 38, exits: 12 }, { m: "Jun", hires: 51, exits: 10 },
  { m: "Jul", hires: 47, exits: 16 }, { m: "Aug", hires: 55, exits: 13 },
  { m: "Sep", hires: 49, exits: 11 }, { m: "Oct", hires: 62, exits: 15 },
  { m: "Nov", hires: 58, exits: 12 }, { m: "Dec", hires: 71, exits: 17 },
];

const departments = [
  { name: "Engineering", value: 384, color: "var(--chart-1)" },
  { name: "Sales", value: 212, color: "var(--chart-2)" },
  { name: "Marketing", value: 156, color: "var(--chart-3)" },
  { name: "Operations", value: 198, color: "var(--chart-4)" },
  { name: "Support", value: 134, color: "var(--chart-5)" },
];

const attendance = [
  { d: "Mon", present: 1180, remote: 84, leave: 20 },
  { d: "Tue", present: 1210, remote: 60, leave: 14 },
  { d: "Wed", present: 1195, remote: 70, leave: 19 },
  { d: "Thu", present: 1224, remote: 50, leave: 10 },
  { d: "Fri", present: 1102, remote: 132, leave: 50 },
  { d: "Sat", present: 420, remote: 30, leave: 8 },
  { d: "Sun", present: 0, remote: 0, leave: 0 },
];

const goals = [
  { name: "Goals", value: 78, fill: "var(--primary)" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="font-bold text-xs text-foreground mb-1.5">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="size-2 rounded-full shadow-xs" style={{ backgroundColor: p.color || p.stroke || p.fill }} />
              <span className="text-muted-foreground/90 font-medium">{p.name}:</span>
              <span className="font-bold text-foreground ml-auto">{p.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function Card({ title, subtitle, action, children, className = "" }: any) {
  return (
    <div className={`group rounded-2xl bg-card border border-border/70 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative overflow-hidden ${className}`}>
      {/* Dynamic top gradient line to give a premium feel */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold tracking-tight text-[13px] text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground/80 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Tabs() {
  const items = ["1W", "1M", "3M", "1Y", "All"];
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted border border-border/40">
      {items.map((i, idx) => (
        <button
          key={i}
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all ${
            idx === 2 ? "bg-card text-primary font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

export function HeadcountChart() {
  return (
    <Card title="Headcount Trends" subtitle="New hires vs. exits across the year" action={<Tabs />} className="xl:col-span-2">
      <div className="h-[315px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={headcount} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gHires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" name="New Hires" dataKey="hires" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gHires)" />
            <Area type="monotone" name="Exits" dataKey="exits" stroke="var(--chart-5)" strokeWidth={2.5} fill="url(#gExits)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function DepartmentChart() {
  const total = departments.reduce((a, b) => a + b.value, 0);
  return (
    <Card title="Department Split" subtitle="Workforce distribution by department">
      <div className="relative h-44 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={departments} dataKey="value" innerRadius={64} outerRadius={88} paddingAngle={4} stroke="none">
              {departments.map((d, i) => (
                <Cell key={i} fill={d.color} className="outline-none filter hover:brightness-105 transition-all duration-300" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">{total.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-0.5">Employees</div>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        {departments.map((d) => (
          <div key={d.name} className="flex items-center gap-3 text-xs p-1.5 rounded-lg hover:bg-muted/50 transition duration-200">
            <span className="size-2.5 rounded-full ring-2 ring-background shadow-xs" style={{ background: d.color }} />
            <span className="text-foreground font-medium">{d.name}</span>
            <span className="ml-auto font-bold text-foreground">{d.value}</span>
            <span className="text-muted-foreground/80 font-medium w-10 text-right">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AttendanceChart() {
  return (
    <Card title="Weekly Attendance Trends" subtitle="Active presence and remote engagement tracking" className="xl:col-span-2">
      <div className="h-[250px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendance} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="attPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="attRemote" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
            <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12, fontWeight: 500 }} />
            <Area type="monotone" name="Office Present" dataKey="present" stroke="var(--primary)" strokeWidth={2.5} fill="url(#attPresent)" />
            <Area type="monotone" name="Remote Work" dataKey="remote" stroke="var(--chart-2)" strokeWidth={2} fill="url(#attRemote)" />
            <Area type="monotone" name="On Leave" dataKey="leave" stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function GoalsRadial() {
  return (
    <Card title="Performance Goals" subtitle="Q2 completion across teams">
      <div className="relative h-44 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="96%" data={goals} startAngle={210} endAngle={-30}>
            <RadialBar background={{ fill: "var(--muted)" }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">78%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-1">Completed</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mt-4 text-center">
        <div className="rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200">
          <div className="text-sm font-bold text-foreground">142</div>
          <div className="text-[9px] font-medium text-muted-foreground mt-0.5">Achieved</div>
        </div>
        <div className="rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200">
          <div className="text-sm font-bold text-foreground">28</div>
          <div className="text-[9px] font-medium text-muted-foreground mt-0.5">In progress</div>
        </div>
        <div className="rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200">
          <div className="text-sm font-bold text-foreground">12</div>
          <div className="text-[9px] font-medium text-muted-foreground mt-0.5">At risk</div>
        </div>
      </div>
    </Card>
  );
}
