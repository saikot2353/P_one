import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DigitalBusinessCardSidebar } from "@/components/dashboard/DigitalBusinessCardSidebar";
import {
  Shield,
  CreditCard,
  QrCode,
  Search,
  Filter,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ExternalLink,
  BarChart3,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  Share2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllCards,
  getCardByEmployeeId,
  createCard,
  setAdminDisableState,
  getPublicCardUrl,
  getAdminAggregateAnalytics,
  DigitalBusinessCard,
  HrisEmployeeRecord,
} from "@/lib/digital-business-card-service";
import { employeesData } from "@/routes/personnel-list";
import { QRCodeRenderer } from "@/components/digital-business-card/QRCodeRenderer";

export const Route = createFileRoute("/digital-business-cards-admin")({
  head: () => ({
    meta: [
      { title: "Business Card Management — Admin Console" },
      {
        name: "description",
        content:
          "Corporate management and administrative governance for employee digital business cards.",
      },
    ],
  }),
  component: DigitalBusinessCardsAdminPage,
});

function DigitalBusinessCardsAdminPage() {
  const [activeTab, setActiveTab] = useState<"management" | "analytics">("management");
  const [cards, setCards] = useState<DigitalBusinessCard[]>(() => getAllCards());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "UNPUBLISHED" | "LOCKED">(
    "ALL",
  );

  // QR Modal for viewing an employee's card details
  const [selectedEmpForQr, setSelectedEmpForQr] = useState<{
    emp: HrisEmployeeRecord;
    card: DigitalBusinessCard;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Companies list
  const companies = useMemo(() => {
    const list = new Set<string>();
    employeesData.forEach((e) => {
      if (e.unit) list.add(e.unit);
    });
    return ["ALL", ...Array.from(list)];
  }, []);

  const refreshCards = () => {
    setCards(getAllCards());
  };

  const handleToggleAdminLock = (empId: string, currentLockState: boolean) => {
    const updated = setAdminDisableState(empId, !currentLockState);
    refreshCards();
    if (!currentLockState) {
      toast.error(
        `Admin Lock applied to employee card. Public preview is now immediately disabled.`,
      );
    } else {
      toast.success(`Admin Lock removed. Card will be live if published by employee.`);
    }
  };

  const handleEnsureCardCreated = (empId: string) => {
    createCard(empId);
    refreshCards();
    toast.success("Card initialized for employee.");
  };

  // Combine employees with their card state
  const employeeCardRows = useMemo(() => {
    return employeesData.map((emp) => {
      const card = cards.find(
        (c) => String(c.employeeId).trim().toLowerCase() === String(emp.id).trim().toLowerCase(),
      );
      return {
        emp,
        card,
        isPublished: !!card?.employeePublished,
        isAdminLocked: !!card?.adminDisabled,
        publicToken: card?.publicToken,
      };
    });
  }, [cards]);

  // Filtering
  const filteredRows = useMemo(() => {
    return employeeCardRows.filter((row) => {
      // Company filter
      if (selectedCompany !== "ALL" && row.emp.unit !== selectedCompany) {
        return false;
      }

      // Status filter
      if (statusFilter === "PUBLISHED" && (!row.isPublished || row.isAdminLocked)) {
        return false;
      }
      if (statusFilter === "UNPUBLISHED" && row.isPublished && !row.isAdminLocked) {
        return false;
      }
      if (statusFilter === "LOCKED" && !row.isAdminLocked) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = row.emp.name.toLowerCase().includes(q);
        const matchesTitle = (row.emp.title || "").toLowerCase().includes(q);
        const matchesDept = (row.emp.dept || "").toLowerCase().includes(q);
        const matchesId = (row.emp.id || "").toLowerCase().includes(q);
        return matchesName || matchesTitle || matchesDept || matchesId;
      }

      return true;
    });
  }, [employeeCardRows, selectedCompany, statusFilter, searchQuery]);

  // Analytics summary data
  const aggregateAnalytics = useMemo(() => {
    return getAdminAggregateAnalytics(selectedCompany);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, cards]);

  const selectedPublicUrl = selectedEmpForQr?.card
    ? getPublicCardUrl(selectedEmpForQr.card.publicToken)
    : "";

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <DigitalBusinessCardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Shield className="size-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Business Card Management (Admin)
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Oversee organization-wide digital business cards, govern public access via Admin
                Lock, and audit traffic analytics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/my-digital-business-card"
                className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-bold transition flex items-center gap-1.5"
              >
                <CreditCard className="size-3.5" />
                <span>My Card View</span>
              </Link>
              <button
                type="button"
                onClick={refreshCards}
                className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition flex items-center gap-1.5"
                title="Refresh Records"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-px">
            <button
              type="button"
              onClick={() => setActiveTab("management")}
              className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                activeTab === "management"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-3.5" />
              <span>Cards Registry ({employeeCardRows.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                activeTab === "analytics"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="size-3.5" />
              <span>Company Analytics</span>
            </button>
          </div>

          {activeTab === "management" && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employee by name, title, department, ID..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-background border border-border text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Company Filter */}
                  <div className="flex items-center gap-1.5 bg-background border border-border px-2.5 rounded-xl h-9">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                    >
                      {companies.map((c) => (
                        <option key={c} value={c}>
                          {c === "ALL" ? "All Companies" : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-background border border-border px-2.5 rounded-xl h-9">
                    <Filter className="size-3.5 text-muted-foreground" />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value as "ALL" | "PUBLISHED" | "UNPUBLISHED" | "LOCKED",
                        )
                      }
                      className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PUBLISHED">Published & Live</option>
                      <option value="UNPUBLISHED">Unpublished</option>
                      <option value="LOCKED">Admin Locked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Company & Dept</th>
                        <th className="py-3 px-4">Publication Status</th>
                        <th className="py-3 px-4">Admin Lock</th>
                        <th className="py-3 px-4 text-center">Public URL / QR</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredRows.length > 0 ? (
                        filteredRows.map(
                          ({ emp, card, isPublished, isAdminLocked, publicToken }) => {
                            const publicUrl = publicToken ? getPublicCardUrl(publicToken) : "";
                            return (
                              <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                                {/* Employee */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                                      {emp.name
                                        .split(" ")
                                        .map((w: string) => w[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-foreground">{emp.name}</div>
                                      <div className="text-[11px] text-muted-foreground">
                                        {emp.title} • ID: {emp.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Company & Dept */}
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-foreground">
                                    {emp.unit || "Pakiza Software"}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {emp.dept || "—"}
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4">
                                  {!card ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                                      Not Initialized
                                    </span>
                                  ) : isAdminLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                      <Lock className="size-2.5" />
                                      Admin Locked
                                    </span>
                                  ) : isPublished ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      Live
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                      Unpublished
                                    </span>
                                  )}
                                </td>

                                {/* Admin Lock State */}
                                <td className="py-3 px-4">
                                  {isAdminLocked ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminLock(emp.id, true)}
                                      className="h-7 px-2.5 rounded-lg border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer hover:bg-rose-100"
                                      title="Click to remove Admin Lock"
                                    >
                                      <Unlock className="size-3" />
                                      <span>Unlock Card</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminLock(emp.id, false)}
                                      className="h-7 px-2.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                                      title="Disable card immediately via Admin Lock"
                                    >
                                      <Lock className="size-3" />
                                      <span>Lock Card</span>
                                    </button>
                                  )}
                                </td>

                                {/* QR Preview & Public Link */}
                                <td className="py-3 px-4 text-center">
                                  {card ? (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedEmpForQr({ emp, card })}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border hover:bg-muted text-xs font-semibold cursor-pointer"
                                    >
                                      <QrCode className="size-3.5 text-indigo-500" />
                                      <span>View QR</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleEnsureCardCreated(emp.id)}
                                      className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                                    >
                                      + Generate Card
                                    </button>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-right">
                                  {card ? (
                                    <a
                                      href={publicUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                                    >
                                      <span>Preview Card</span>
                                      <ExternalLink className="size-3" />
                                    </a>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          },
                        )
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No employee business cards matched the filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Aggregate Analytics */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Registered Cards
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {aggregateAnalytics.totalCards}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Configured employee cards</p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Published & Active
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {aggregateAnalytics.publishedCards}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Currently live to public</p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Admin Locked
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                    {aggregateAnalytics.adminDisabledCards}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Disabled by administrators</p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Card Loads
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {aggregateAnalytics.totalViews}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Successful page views</p>
                </div>
              </div>

              {/* Top Visited Cards */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Top Performing Business Cards by Views
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase">
                        <th className="py-2.5 px-4">Employee</th>
                        <th className="py-2.5 px-4">Company</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {aggregateAnalytics.topCards.slice(0, 10).map(({ card, employee, views }) => (
                        <tr key={card.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-4 font-bold text-foreground">
                            {employee?.name || card.employeeId}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground">
                            {employee?.unit || "Pakiza Software"}
                          </td>
                          <td className="py-2.5 px-4">
                            {card.adminDisabled ? (
                              <span className="text-rose-500 font-bold">Locked</span>
                            ) : card.employeePublished ? (
                              <span className="text-emerald-500 font-bold">Live</span>
                            ) : (
                              <span className="text-amber-500 font-bold">Unpublished</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-primary">
                            {views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin QR Code Modal */}
      {selectedEmpForQr && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedEmpForQr(null)}
              className="absolute top-4 right-4 size-8 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition"
            >
              <X className="size-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-foreground">{selectedEmpForQr.emp.name}</h3>
              <p className="text-xs text-muted-foreground">Permanent Public QR Code</p>
            </div>

            <div className="flex justify-center">
              <QRCodeRenderer value={selectedPublicUrl} size={210} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Permanent Public URL
              </span>
              <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={selectedPublicUrl}
                  className="bg-transparent text-xs text-primary outline-none flex-1 font-mono truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPublicUrl);
                    setCopied(true);
                    toast.success("Link copied!");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition shrink-0"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={selectedPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground transition flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="size-3.5" />
                <span>Open Public Card</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedEmpForQr(null)}
                className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
