import { useState } from "react";
import { ArrowLeft, Save, Send, Calculator, Plus, Trash2, Edit, CheckCircle } from "lucide-react";
import { Budget, BudgetLine, ItemCategory } from "@/lib/procurement-master-data";

interface BudgetManagementPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Budget | null;
  itemCategories: ItemCategory[];
  employeeList: Array<{ id: string; name: string; dept: string; title: string }>;
  onSave: (data: Budget, isSubmitForApproval?: boolean) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function BudgetManagementPageForm({
  mode,
  initialData,
  itemCategories,
  employeeList,
  onSave,
  onCancel,
  onSwitchToEdit,
}: BudgetManagementPageFormProps) {
  const [formData, setFormData] = useState<Partial<Budget>>(() => {
    if (initialData) return { ...initialData };
    const defaultEmp = employeeList[0];
    return {
      budgetCode: `BDG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      budgetName: "Annual Procurement Budget",
      employeeName: defaultEmp?.name || "Tahmid Afsar Shapno",
      department: defaultEmp?.dept || "Business Innovation",
      designation: defaultEmp?.title || "Asst. Manager",
      createDate: new Date().toISOString().split("T")[0],
      currency: "BDT",
      budgetPeriod: "Yearly",
      periodYear: new Date().getFullYear(),
      periodMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
      effectiveFrom: `${new Date().getFullYear()}-01-01`,
      effectiveTo: `${new Date().getFullYear()}-12-31`,
      status: "Draft",
      budgetLines: [
        {
          id: `bl-${Date.now()}-1`,
          itemCategory: itemCategories[0]?.categoryName || "General Category",
          allocatedAmount: 100000,
          remarks: "Initial planned allocation",
        },
      ],
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleEmployeeChange = (empName: string) => {
    const emp = employeeList.find((e) => e.name === empName);
    setFormData((prev) => ({
      ...prev,
      employeeName: empName,
      department: emp?.dept || prev.department,
      designation: emp?.title || prev.designation,
    }));
  };

  const handleAddBudgetLine = () => {
    if (isView) return;
    const newLine: BudgetLine = {
      id: `bl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemCategory: itemCategories[0]?.categoryName || "General",
      allocatedAmount: 50000,
      remarks: "",
    };
    setFormData((prev) => ({
      ...prev,
      budgetLines: [...(prev.budgetLines || []), newLine],
    }));
  };

  const handleRemoveBudgetLine = (lineId: string) => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      budgetLines: (prev.budgetLines || []).filter((l) => l.id !== lineId),
    }));
  };

  const handleBudgetLineChange = (lineId: string, field: keyof BudgetLine, value: any) => {
    if (isView) return;
    setFormData((prev) => ({
      ...prev,
      budgetLines: (prev.budgetLines || []).map((l) =>
        l.id === lineId ? { ...l, [field]: value } : l,
      ),
    }));
  };

  const totalCalculatedBudget = (formData.budgetLines || []).reduce(
    (sum, l) => sum + (Number(l.allocatedAmount) || 0),
    0,
  );

  const handleSaveBudget = (isSubmit: boolean) => {
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.budgetCode?.trim()) errors.budgetCode = "Budget ID is required";
    if (!formData.employeeName?.trim()) errors.employeeName = "Employee Name is required";
    if (!formData.department?.trim()) errors.department = "Department is required";
    if (!formData.budgetLines || formData.budgetLines.length === 0) {
      errors.lines = "At least one category budget line is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: Budget = {
      id: initialData?.id || `bgt-${Date.now()}`,
      budgetCode: formData.budgetCode || `BDG-${Date.now()}`,
      budgetName:
        formData.budgetName ||
        `${formData.department} ${formData.budgetPeriod} Budget`,
      employeeName: formData.employeeName || "",
      department: formData.department || "",
      designation: formData.designation || "",
      createDate: formData.createDate || new Date().toISOString().split("T")[0],
      currency: formData.currency || "BDT",
      budgetPeriod: (formData.budgetPeriod as any) || "Yearly",
      periodYear: formData.periodYear || new Date().getFullYear(),
      periodMonth: formData.periodMonth || "",
      effectiveFrom: formData.effectiveFrom || "",
      effectiveTo: formData.effectiveTo || "",
      budgetLines: formData.budgetLines || [],
      originalBudget: totalCalculatedBudget,
      revisedBudget: totalCalculatedBudget,
      totalBudget: totalCalculatedBudget,
      actualUtilized: initialData?.actualUtilized || 0,
      committedAmount: initialData?.committedAmount || 0,
      availableBudget: totalCalculatedBudget - (initialData?.actualUtilized || 0),
      status: isSubmit ? "Submitted" : formData.status || "Draft",
    };

    onSave(payload, isSubmit);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Budget List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Procurement Budget / Budget Requisition
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  mode === "create"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : mode === "edit"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                }`}
              >
                {mode === "create" ? "New Budget" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Budget"
                : mode === "edit"
                  ? `Edit Budget — ${formData.budgetCode}`
                  : `Budget Details — ${formData.budgetCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to List" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Budget</span>
            </button>
          ) : !isView ? (
            <>
              <button
                type="button"
                onClick={() => handleSaveBudget(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Save className="size-3.5" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveBudget(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>Submit for Approval</span>
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Header Section */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Calculator className="size-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">Header Section</h2>
            </div>
            <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
              <span>Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  formData.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : formData.status === "Submitted"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                      : "bg-slate-500/10 text-slate-500 border-slate-500/30"
                }`}
              >
                {formData.status || "Draft"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Employee Name <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isView}
                value={formData.employeeName || ""}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {employeeList.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Department</label>
              <input
                type="text"
                disabled={isView}
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Designation</label>
              <input
                type="text"
                disabled={isView}
                value={formData.designation || ""}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Create Date</label>
              <input
                type="date"
                disabled={isView}
                value={formData.createDate || ""}
                onChange={(e) => setFormData({ ...formData, createDate: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Currency (Default: BDT)
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.currency || "BDT"}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Budget ID <span className="text-[10px] font-normal text-muted-foreground ml-1">(Auto-generated)</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.budgetCode || ""}
                onChange={(e) => setFormData({ ...formData, budgetCode: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Budget Period</label>
              <select
                disabled={isView}
                value={formData.budgetPeriod || "Yearly"}
                onChange={(e) => setFormData({ ...formData, budgetPeriod: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {/* Budget Period Specific Dynamic Fields (Requirement 6) */}
            {formData.budgetPeriod === "Yearly" && (
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Year <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled={isView}
                  value={formData.periodYear || new Date().getFullYear()}
                  onChange={(e) =>
                    setFormData({ ...formData, periodYear: Number(e.target.value) })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <option key={yr} value={yr}>
                      Year: {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.budgetPeriod === "Monthly" && (
              <div>
                <label className="block text-xs font-bold mb-1 text-foreground">
                  Month <span className="text-rose-500">*</span>
                </label>
                <input
                  type="month"
                  disabled={isView}
                  value={
                    formData.periodMonth ||
                    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
                  }
                  onChange={(e) => setFormData({ ...formData, periodMonth: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                />
              </div>
            )}

            {formData.budgetPeriod === "Custom" && (
              <>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    From Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={isView}
                    value={formData.effectiveFrom || ""}
                    onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-foreground">
                    To Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={isView}
                    value={formData.effectiveTo || ""}
                    onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Budget Details Table */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h2 className="text-sm font-bold text-foreground">Budget Details (Category-wise)</h2>
              <p className="text-[11px] text-muted-foreground">
                Enter the required allocation amount for each item category and submit for approval.
              </p>
            </div>
            {!isView && (
              <button
                type="button"
                onClick={handleAddBudgetLine}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                <span>Add Category Row</span>
              </button>
            )}
          </div>

          {formErrors.lines && (
            <p className="text-xs text-rose-500 font-bold">{formErrors.lines}</p>
          )}

          <div className="rounded-xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/70 text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-12">SL</th>
                  <th className="py-2.5 px-3 w-1/3">Item Category *</th>
                  <th className="py-2.5 px-3 w-1/4">Budget Amount ({formData.currency || "BDT"}) *</th>
                  <th className="py-2.5 px-3">Remarks / Description</th>
                  {!isView && <th className="py-2.5 px-3 text-right w-16">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(formData.budgetLines || []).map((line, idx) => (
                  <tr key={line.id} className="hover:bg-muted/30">
                    <td className="py-2 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="font-bold text-foreground">{line.itemCategory}</span>
                      ) : (
                        <select
                          value={line.itemCategory}
                          onChange={(e) =>
                            handleBudgetLineChange(line.id, "itemCategory", e.target.value)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none"
                        >
                          {itemCategories.map((c) => (
                            <option key={c.id} value={c.categoryName}>
                              {c.categoryName}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="font-mono font-bold text-foreground">
                          {(Number(line.allocatedAmount) || 0).toLocaleString()} ৳
                        </span>
                      ) : (
                        <input
                          type="number"
                          value={line.allocatedAmount}
                          onChange={(e) =>
                            handleBudgetLineChange(
                              line.id,
                              "allocatedAmount",
                              Number(e.target.value),
                            )
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none"
                        />
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="text-muted-foreground">{line.remarks || "—"}</span>
                      ) : (
                        <input
                          type="text"
                          value={line.remarks || ""}
                          placeholder="Optional justification or scope"
                          onChange={(e) =>
                            handleBudgetLineChange(line.id, "remarks", e.target.value)
                          }
                          className="w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-xs focus:border-amber-500 outline-none"
                        />
                      )}
                    </td>
                    {!isView && (
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveBudgetLine(line.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                          title="Remove category row"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/40 font-bold border-t border-border/80">
                <tr>
                  <td colSpan={2} className="py-3 px-3 text-right text-xs uppercase tracking-wide">
                    Total Budget Amount:
                  </td>
                  <td className="py-3 px-3 text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                    {totalCalculatedBudget.toLocaleString()} {formData.currency || "BDT"}
                  </td>
                  <td colSpan={isView ? 1 : 2} className="py-3 px-3 text-right text-[11px] text-muted-foreground font-normal">
                    {formData.budgetLines?.length || 0} Categories Allocated
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Budget List" : "Cancel"}
          </button>
          {!isView && (
            <>
              <button
                type="button"
                onClick={() => handleSaveBudget(false)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveBudget(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Send className="size-4" />
                <span>Submit for Approval</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
