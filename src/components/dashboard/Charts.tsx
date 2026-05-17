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

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 10px 30px -10px oklch(0.18 0.03 240 / 0.15)",
};

function Card({ title, subtitle, action, children, className = "" }: any) {
  return (
    <div className={`rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)] ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
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
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
      {items.map((i, idx) => (
        <button key={i} className={`text-xs px-2.5 py-1 rounded-md ${idx === 2 ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{i}</button>
      ))}
    </div>
  );
}

export function HeadcountChart() {
  return (
    <Card title="Headcount Trends" subtitle="New hires vs. exits across the year" action={<Tabs />} className="xl:col-span-2">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={headcount} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gHires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="hires" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gHires)" />
            <Area type="monotone" dataKey="exits" stroke="var(--chart-5)" strokeWidth={2.5} fill="url(#gExits)" />
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
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={departments} dataKey="value" innerRadius={64} outerRadius={92} paddingAngle={3} stroke="none">
              {departments.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-display font-bold">{total.toLocaleString()}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Employees</div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {departments.map((d) => (
          <div key={d.name} className="flex items-center gap-3 text-xs">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-foreground">{d.name}</span>
            <span className="ml-auto text-muted-foreground">{d.value}</span>
            <span className="text-muted-foreground/70 w-10 text-right">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AttendanceChart() {
  return (
    <Card title="Weekly Attendance" subtitle="Present · Remote · On Leave" className="xl:col-span-2">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="present" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="remote" stackId="a" fill="var(--chart-2)" />
            <Bar dataKey="leave" stackId="a" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function GoalsRadial() {
  return (
    <Card title="Performance Goals" subtitle="Q2 completion across teams">
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={goals} startAngle={210} endAngle={-30}>
            <RadialBar background={{ fill: "var(--muted)" }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-display font-bold">78%</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Completed</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
        <div className="rounded-lg bg-muted p-2.5"><div className="text-sm font-semibold">142</div><div className="text-[10px] text-muted-foreground">Achieved</div></div>
        <div className="rounded-lg bg-muted p-2.5"><div className="text-sm font-semibold">28</div><div className="text-[10px] text-muted-foreground">In progress</div></div>
        <div className="rounded-lg bg-muted p-2.5"><div className="text-sm font-semibold">12</div><div className="text-[10px] text-muted-foreground">At risk</div></div>
      </div>
    </Card>
  );
}
