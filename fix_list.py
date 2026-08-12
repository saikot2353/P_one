import re

with open("src/routes/financial-aid-list.tsx", "r") as f:
    content = f.read()

# 1. Add budgetPools state
budget_state = """
  const [budgetPools, setBudgetPools] = useState<{ year: number; amount: number }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budgets");
      return saved ? JSON.parse(saved) : [{ year: new Date().getFullYear(), amount: 1500000 }];
    }
    return [{ year: new Date().getFullYear(), amount: 1500000 }];
  });

  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(new Date().getFullYear());

  const [searchQuery, setSearchQuery] = useState("");"""

content = content.replace('  const [searchQuery, setSearchQuery] = useState("");', budget_state)

# 2. Update stats calculation
stats_old = r'  const stats = useMemo\(\(\) => \{.*?\}, \[records\]\);'
stats_new = """  const stats = useMemo(() => {
    const yearRecords = records.filter(r => r.requestDate.startsWith(selectedBudgetYear.toString()));
    
    let totalApproved = 0;
    yearRecords.forEach((r) => {
      if (r.status === "Approved") {
        totalApproved += r.amount;
      }
    });

    const activePool = budgetPools.find(b => b.year === selectedBudgetYear);
    const currentBudget = activePool ? activePool.amount : 0;
    const remainingBudget = currentBudget - totalApproved;

    return {
      currentBudget,
      totalApproved,
      remainingBudget,
      pendingApprovalCount: yearRecords.filter((r) => r.status === "Pending").length,
    };
  }, [records, budgetPools, selectedBudgetYear]);"""

content = re.sub(stats_old, stats_new, content, flags=re.DOTALL)

# 3. Update top UI elements (dropdown and budget stats)
ui_dropdown = """          <div className="flex items-center justify-between print:hidden">
            <select
              value={selectedBudgetYear}
              onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))}
              className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500 transition-colors shadow-sm"
            >
              {budgetPools.map(b => (
                <option key={b.year} value={b.year}>{b.year}</option>
              ))}
            </select>
            <button"""
content = content.replace('          <div className="flex items-center justify-end print:hidden">\n            <button', ui_dropdown)

# 4. Update stats.budgetPool to stats.currentBudget
content = content.replace("stats.budgetPool.toLocaleString()", "stats.currentBudget.toLocaleString()")

with open("src/routes/financial-aid-list.tsx", "w") as f:
    f.write(content)
