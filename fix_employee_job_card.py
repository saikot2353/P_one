correct_text = """                  <strong className="text-[11.5px] text-foreground block mt-0.5">{employeeDb[activeEmpId].shiftStartDate}</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">Verified Employee</span>
                </div>
              </div>
            </div>
          )}

          {/* Spreadsheet Datagrid Card */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            {/* Utilities Toolbar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/35 pb-4 print:hidden">
              {/* Text Query Filter */}
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Name, Date.."
                  className="w-full h-9 pl-9.5 pr-4 rounded-xl bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none text-xs font-bold transition duration-200"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 select-none self-end sm:self-auto">
                <button className="h-9 px-4 rounded-xl border border-emerald-200 dark:border-emerald-900/35 bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-black text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-9 px-4 rounded-xl border border-blue-200 dark:border-blue-900/35 bg-blue-50/30 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20 font-black text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-9 px-4 rounded-xl border border-rose-200 dark:border-rose-900/35 bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition shadow-3xs cursor-pointer">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* High-Fidelity Spreadsheet Data Table */}
            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[55vh] print:max-h-none print:border-none font-sans">
              <table className="w-full min-w-[950px] border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#475569] dark:text-slate-400 font-extrabold border-b border-border/50 select-none whitespace-nowrap text-[10.5px]">
                    <th className="px-4 py-3 text-center w-12 border-r border-border/30">
                      SL
                    </th>
                    <th className="px-4 py-3 w-28 border-r border-border/30">
                      EMPLOYEE ID
                    </th>
                    <th className="px-4 py-3 w-36 border-r border-border/30">
                      EMPLOYEE NAME
                    </th>
                    <th className="px-4 py-3 text-center w-28 border-r border-border/30">
                      ATN DATE
                    </th>
                    <th className="px-4 py-3 text-center w-28 border-r border-border/30">
                      OUT DATE
                    </th>
                    <th className="px-4 py-3 text-center w-24 border-r border-border/30">
                      IN TIME
                    </th>
                    <th className="px-4 py-3 text-center w-24 border-r border-border/30">
                      OUT TIME
                    </th>
                    <th className="px-4 py-3 text-right w-24 border-r border-border/30">
                      OVER TIME
                    </th>
                    <th className="px-4 py-3 w-32 border-r border-border/30">
                      DUTY SHIFT
                    </th>
                    <th className="px-4 py-3 text-center w-24">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {paginatedRows.map((row, idx) => {
                    const slNo = (currentPage - 1) * itemsPerPage + idx + 1;

                    // Dynamic Runtime Calculations status check
                    let activeStatus = row.status;
                    if (isRuntimeCal && row.status === "Present") {
                      const thresholdIn = shiftInThreshold + ":00";
                      const thresholdOut = shiftOutThreshold + ":00";
                      const inTime = row.inTime;
                      const outTime = row.outTime;

                      if (inTime && outTime && inTime !== "N/A" && outTime !== "N/A") {
                        const isLate = inTime > thresholdIn;
                        const isEarly = outTime < thresholdOut;
                        if (isLate && isEarly) {
                          activeStatus = "Late & Early";
                        } else if (isLate) {
                          activeStatus = "Late";
                        } else if (isEarly) {
                          activeStatus = "Early Leave";
                        }
                      }
                    }

                    // Assign colors according to status value
                    let statusBadgeClass = "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide border";
                    if (activeStatus === "Present") {
                      statusBadgeClass += " bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/35";
                    } else if (activeStatus === "Absent") {
                      statusBadgeClass += " bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/35";
                    } else if (activeStatus === "Holiday") {
                      statusBadgeClass += " bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800";
                    } else {
                      statusBadgeClass += " bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/35";
                    }

                    return (
                      <tr
                        key={`${row.empId}-${row.date}`}
                        className="group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-100 whitespace-nowrap font-semibold text-foreground/80"
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20">
                          {slNo}
                        </td>
                        <td className="px-4 py-2.5 font-bold font-mono text-foreground border-r border-border/20">
                          {row.empId}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-foreground border-r border-border/20">
                          {row.empName}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center font-bold text-foreground/80 border-r border-border/20">
                          {row.date}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center text-muted-foreground border-r border-border/20">
                          {row.outDate || ""}
                        </td>

                        {/* Dynamic In Time Input Cell */}
                        <td className="px-4 py-2 text-center text-primary font-bold border-r border-border/20">
                          {isRuntimeCal && row.status === "Present" ? (
                            <input
                              type="text"
                              value={row.inTime}
                              onChange={(e) =>
                                handleTimeChange(row.empId, row.date, "inTime", e.target.value)
                              }
                              className="w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition"
                            />
                          ) : (
                            row.inTime || ""
                          )}
                        </td>

                        {/* Dynamic Out Time Input Cell */}
                        <td className="px-4 py-2 text-center text-primary font-bold border-r border-border/20">
                          {isRuntimeCal && row.status === "Present" ? (
                            <input
                              type="text"
                              value={row.outTime}
                              onChange={(e) =>
                                handleTimeChange(row.empId, row.date, "outTime", e.target.value)
                              }
                              className="w-20 h-7 text-center bg-slate-100 dark:bg-slate-900 focus:bg-card border border-border/40 focus:border-[#1e88e5] focus:ring-1 focus:ring-[#1e88e5]/20 rounded outline-none text-[11px] font-bold text-primary font-mono transition"
                            />
                          ) : (
                            row.outTime || ""
                          )}
                        </td>

                        <td className="px-4 py-2.5 font-mono text-right font-bold text-foreground/85 border-r border-border/20">
                          {row.overtime}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground border-r border-border/20">
                          {row.shift}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={statusBadgeClass}>{activeStatus}</span>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={20}
                        className="px-4 py-16 text-center text-muted-foreground font-semibold"
                      >
                        No attendance job card data found for selected boundaries. Click GET to load
                        records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Stats & Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 print:hidden">
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRows.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredRows.length)} of {filteredRows.length}{" "}
                entries
              </span>

              <div className="flex items-center gap-4">
                {/* PDF/Excel batch download buttons */}
                <div className="flex items-center gap-1.5 font-black text-[10px]">
                  <button className="h-8.5 px-4 bg-[#72b043] hover:bg-[#629c36] text-white rounded-lg transition uppercase tracking-wider cursor-pointer">
                    VIEW(PDF)
                  </button>
                  <button className="h-8.5 px-4 bg-[#72b043] hover:bg-[#629c36] text-white rounded-lg transition uppercase tracking-wider cursor-pointer">
                    EXCEL
                  </button>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary Panel */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Attendance Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 rounded-lg text-[10px] font-extrabold">
                  Late: {lateCount}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-lg text-[10px] font-extrabold">
                  Early Leave: {earlyLeaveCount}
                </span>
              </div>
            </div>

            {/* Summary Grid Block */}
            <div className="grid grid-cols-2 md:grid-cols-6 border border-border/60 rounded-xl overflow-hidden divide-x divide-y md:divide-y-0 divide-border/60 text-center font-sans">
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Working Day</div>
                <div className="text-base font-black text-foreground">{summary.totalWorking}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Present Day</div>
                <div className="text-base font-black text-foreground">{summary.present}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Absent Day</div>
                <div className="text-base font-black text-foreground">{summary.absent}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Holiday</div>
                <div className="text-base font-black text-foreground">{summary.holiday}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Leave day</div>
                <div className="text-base font-black text-foreground">{summary.leave}</div>
              </div>
              <div className="p-3.5 space-y-1 border-t md:border-t-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Over Time</div>
              <div className="text-base font-black text-foreground">{summary.overtime}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"""

with open(r"e:\My Development\Cripton HRIS\criptonhris\src\routes\employee-job-card.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = '                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block">JOINING DATE</span>\n'
idx = content.find(target)
if idx != -1:
    new_content = content[:idx + len(target)] + correct_text
    with open(r"e:\My Development\Cripton HRIS\criptonhris\src\routes\employee-job-card.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Fixed!")
else:
    print("Not found!")
