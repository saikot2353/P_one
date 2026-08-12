import re

with open("src/routes/financial-aid-list.tsx", "r") as f:
    content = f.read()

# 1. Remove budget state, modal states from the top
# 2. Update the UI block

# Remove budgetPool state
content = re.sub(
    r'  const \[budgetPool, setBudgetPool\] = useState<number>.*?\}\);\n\n  useEffect\(\(\) => \{\n    localStorage\.setItem\("cripton_financial_aid_budget", budgetPool\.toString\(\)\);\n  \}, \[budgetPool\]\);\n\n',
    '',
    content,
    flags=re.DOTALL
)

# Remove budget modal state
content = re.sub(
    r'  const \[isBudgetModalOpen, setIsBudgetModalOpen\] = useState\(false\);\n  const \[tempBudgetInput, setTempBudgetInput\] = useState\(""\);\n',
    '',
    content
)

# Fix the stats calculation (budgetPool is gone, so let's get it from localStorage)
stats_replacement = """
  const stats = useMemo(() => {
    let totalApproved = 0;
    records.forEach((r) => {
      if (r.status === "Approved") {
        totalApproved += r.amount;
      }
    });

    let budgetPool = 1500000;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_financial_aid_budget");
      if (saved) budgetPool = parseFloat(saved);
    }

    const remainingBudget = budgetPool - totalApproved;

    return {
      budgetPool,
      totalApproved,
      remainingBudget,
      pendingApprovalCount: records.filter((r) => r.status === "Pending").length,
    };
  }, [records]);
"""
content = re.sub(
    r'  const stats = useMemo\(\(\) => \{.*?\}, \[records, budgetPool\]\);',
    stats_replacement,
    content,
    flags=re.DOTALL
)

# Now for the main UI replacements. Let's find the start of the `<main>` tag
start_marker = '<div className="p-4 md:p-6 xl:p-8 space-y-6">'
end_marker = '      {/* MODAL: Configure Budget */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

new_ui = """<div className="p-4 md:p-5 xl:p-6 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-1.5 print:hidden">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span>Welfare & Support</span>
              <ChevronRight className="size-2.5" />
              <span className="text-blue-600">Financial Aid</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
              <Banknote className="size-5 text-blue-600" />
              <span>Financial Aid Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Track and manage internal financial assistance and emergency loans provided to employees.
            </p>
          </div>

          <div className="flex items-center justify-end print:hidden">
            <button
              onClick={() => {
                setNewEmpName("");
                setNewEmpId("");
                setEmpSearchInput("");
                setNewTenure("");
                setNewAmount("");
                setNewReason("");
                setPrevZakat(0);
                setPrevAid(0);
                setIsModalOpen(true);
              }}
              className="h-8 px-4 bg-[#4361EE] hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-widest"
            >
              <Plus className="size-3.5" />
              <span>New Aid Request</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:hidden">
            <div className="p-4 rounded-xl bg-[#F0FDF4] text-emerald-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Welfare Budget Pool
              </span>
              <div className="text-xl font-black text-emerald-600">৳ {stats.budgetPool.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-emerald-600">Total corporate fund set</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF6FF] text-blue-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Total Disbursed
              </span>
              <div className="text-xl font-black text-blue-600">৳ {stats.totalApproved.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-blue-500">Approved funds</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF7ED] text-orange-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Remaining Funds
              </span>
              <div className="text-xl font-black text-orange-600">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-orange-500">Available to allocate</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FEF2F2] text-rose-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Pending Requests
              </span>
              <div className="text-xl font-black text-rose-600">{stats.pendingApprovalCount}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-rose-500">Awaiting HR review</div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 px-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee or ID..."
                    className="w-full h-8 pl-8 pr-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium outline-none focus:bg-white focus:border-blue-500 transition-colors text-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 print:hidden">
                <button
                  onClick={handleExportCSV}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-emerald-600 shadow-sm"
                >
                  <Download className="size-3" /> Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-[10px] flex items-center gap-1.5 transition-colors text-blue-600 shadow-sm"
                >
                  <Printer className="size-3" /> Print
                </button>
              </div>
            </div>

            {/* Assigned Date & Amount Filters */}
            <div className="flex flex-wrap gap-3 items-center pt-2 pb-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Date Range:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Amount:
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="h-7 w-20 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="h-7 w-20 px-2 rounded-md bg-white border border-slate-200 text-[10px] font-medium outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              {(dateFrom || dateTo || minAmount || maxAmount) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setMinAmount("");
                    setMaxAmount("");
                  }}
                  className="text-[9px] text-red-500 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center w-12">SL</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Employee</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Tenure</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-right">Amount (৳)</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Reason / Date</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((row, index) => {
                    return (
                      <tr
                        key={row.id}
                        className="transition-colors duration-150 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.employeeName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.employeeId}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500">
                          {row.tenureMonths} Months
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 text-[11px] text-right">
                          ৳ {row.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700 text-[10px] line-clamp-1 max-w-[200px]" title={row.reason}>
                            {row.reason}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.requestDate}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-center">
                          {row.status === "Pending" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-700 bg-amber-100">
                              Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-100">
                              Approved
                            </span>
                          )}
                          {row.status === "Rejected" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-rose-700 bg-rose-100">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewDetailsRecord(row)}
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                              title="View full details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-medium text-[11px]">
                        No matching financial aid cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
"""

content = content[:start_idx] + new_ui + content[end_idx:]

# Remove the budget modal HTML from the bottom
budget_modal_end = '      {/* MODAL: View Request Details */}'
content = re.sub(
    r'      \{/\* MODAL: Configure Budget \*/\}.*?(?=      \{/\* MODAL: View Request Details \*/\})',
    '',
    content,
    flags=re.DOTALL
)

with open("src/routes/financial-aid-list.tsx", "w") as f:
    f.write(content)
