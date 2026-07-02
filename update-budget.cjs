const fs = require('fs');
const file = 'src/routes/budget-statement.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add year to interface
content = content.replace(
  'interface StatementRecord {',
  'interface StatementRecord {\n  year: string;'
);

// Add year to mock data
content = content.replace(/designation:\s*"[^"]+",/g, match => match + '\n    year: Math.random() > 0.5 ? "2026" : "2025",');

// Add year state and filter logic
content = content.replace(
  'const [filterEmpType, setFilterEmpType] = useState("ALL");',
  'const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());\n  const [filterEmpType, setFilterEmpType] = useState("ALL");'
);

content = content.replace(
  'region: "KAC Fashion- Factory",',
  'year: new Date().getFullYear().toString(),\n    region: "KAC Fashion- Factory",'
);

content = content.replace(
  'region: filterRegion,',
  'year: filterYear,\n      region: filterRegion,'
);

// Add filter condition inside useMemo
content = content.replace(
  '// 1. Employee Type Filter',
  '// Year Filter\n      if (activeFilters.year !== "ALL" && item.year !== activeFilters.year) return false;\n\n      // 1. Employee Type Filter'
);

// Update grid columns
content = content.replace(
  'grid grid-cols-2 md:grid-cols-5 xl:grid-cols-6 gap-3.5',
  'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5'
);

// Add Year Dropdown JSX
const yearDropdown = `
            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="ALL">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
`;

content = content.replace(
  '{/* Region */}',
  yearDropdown + '\n            {/* Region */}'
);

fs.writeFileSync(file, content);
console.log('Done modifying budget-statement.tsx');
