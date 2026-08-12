import re

with open("src/routes/zakat-list.tsx", "r") as f:
    content = f.read()

# Define the start and end of the block we want to replace
start_marker = '<div className="p-4 md:p-6 xl:p-8 space-y-6">'
end_marker = '        </div>\n      </main>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

new_block = """<div className="p-4 md:p-5 xl:p-6 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-[12px] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-1.5 print:hidden">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span>Welfare & Support</span>
              <ChevronRight className="size-2.5" />
              <span className="text-emerald-600">Zakat Management</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
              <HeartHandshake className="size-5 text-emerald-600" />
              <span>Zakat Management Tracker</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Oversee corporate Zakat allocations assigned to employees to distribute to verified external recipients in need.
            </p>
          </div>

          <div className="flex items-center justify-between print:hidden">
            <select
              value={selectedBudgetYear}
              onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))}
              className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500 transition-colors shadow-sm"
            >
              {budgetPools.map(b => (
                <option key={b.year} value={b.year}>{b.year}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setNewEmpName("");
                setNewEmpId("");
                setEmpSearchInput("");
                setPrevZakat(0);
                setPrevAid(0);
                setIsAssignModalOpen(true);
              }}
              className="h-8 px-4 bg-[#4361EE] hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors uppercase tracking-widest"
            >
              <Plus className="size-3.5" />
              <span>Assign Zakat Case</span>
            </button>
          </div>

          {/* Stats / Budget Pool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:hidden">
            <div className="p-4 rounded-xl bg-[#F0FDF4] text-emerald-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                {selectedBudgetYear} Budget Pool
              </span>
              <div className="text-xl font-black text-emerald-600">৳ {stats.currentBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-emerald-600">Total set corporate Zakat pool</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF6FF] text-blue-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Assigned & Active
              </span>
              <div className="text-xl font-black text-blue-600">৳ {stats.totalAssigned.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-blue-500">{stats.totalRecords} Active cases registered</div>
            </div>
            <div className="p-4 rounded-xl bg-[#EEF2FF] text-indigo-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Distributed / Confirmed
              </span>
              <div className="text-xl font-black text-indigo-600">৳ {stats.totalDistributed.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-indigo-500">Funds delivered to recipients</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF7ED] text-orange-700 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest uppercase mb-1">
                Remaining Balance
              </span>
              <div className="text-xl font-black text-orange-600">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-75 font-medium mt-0.5 text-orange-500">Available for new assignments</div>
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
                  <option value="ALL">All Agency Statuses</option>
                  <option value="Assigned">Assigned (Funds Dispatched)</option>
                  <option value="Acknowledged">Acknowledged by Employee</option>
                  <option value="Distributed">Distributed (Awaiting HR Verification)</option>
                  <option value="Verified">Verified & Completed</option>
                </select>
                <select
                  value={selectedAsnaf}
                  onChange={(e) => setSelectedAsnaf(e.target.value)}
                  className="h-8 px-3 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">All Asnaf Categories</option>
                  <option value="Al-Fuqara">Al-Fuqara (The Poor)</option>
                  <option value="Al-Masakin">Al-Masakin (The Needy)</option>
                  <option value="Al-Gharimin">Al-Gharimin (In Debt)</option>
                  <option value="Fi Sabilillah">Fi Sabilillah (Cause of Allah)</option>
                  <option value="Ibnus-Sabil">Ibnus-Sabil (Wayfarer)</option>
                </select>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee, recipient, or ID..."
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

            {/* Assigned Date Filters */}
            <div className="flex flex-wrap gap-3 items-center pt-2 pb-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Assigned Date:
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
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-[9px] text-red-500 font-bold hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center w-12">SL</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Agent Employee</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Recipient & Category</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-right">Amount</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Deadline</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((row, index) => {
                    const isSelected = row.id === selectedRecordId;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedRecordId(row.id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                          isSelected
                            ? "bg-slate-50"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-[11px] font-medium text-slate-500 text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.employeeName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            EMP-{row.employeeId.slice(-3)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-700 text-[11px]">{row.recipientName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {row.asnafCategory}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 text-[11px] text-right">
                          ৳ {row.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 text-center">
                          {row.distributionDeadline}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-center">
                          {row.agencyStatus === "Assigned" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-700 bg-blue-100">
                              Dispatched
                            </span>
                          )}
                          {row.agencyStatus === "Acknowledged" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-indigo-700 bg-indigo-100">
                              Acknowledged
                            </span>
                          )}
                          {row.agencyStatus === "Distributed" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-700 bg-amber-100">
                              Pending HR
                            </span>
                          )}
                          {row.agencyStatus === "Verified" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold text-green-700 bg-green-100">
                              Verified
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-center print:hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors"
                              title="Edit"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                            <button
                              onClick={(e) => handleDelete(row.id, e)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="size-3" />
                            </button>
                            {row.agencyStatus !== "Verified" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAgencyStatus(
                                    row.id,
                                    row.agencyStatus === "Distributed"
                                      ? "Verified"
                                      : "Distributed",
                                  );
                                }}
                                className="p-1 text-[#4361EE] hover:bg-blue-50 rounded transition-colors"
                                title={
                                  row.agencyStatus === "Distributed"
                                    ? "Verify Distribution"
                                    : "Mark as Distributed"
                                }
                              >
                                <Settings className="size-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-medium text-[11px]">
                        No matching Zakat distribution cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>"""

with open("src/routes/zakat-list.tsx", "w") as f:
    f.write(content[:start_idx] + new_block + content[end_idx:])
