import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Share2,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCardByEmployeeId,
  createCard,
  getPublicCardUrl,
  getHrisEmployee,
  downloadVCard,
  resolvePublicCard,
  DigitalBusinessCard,
} from "@/lib/digital-business-card-service";
import { QRCodeRenderer } from "@/components/digital-business-card/QRCodeRenderer";
import { employeesData } from "@/routes/personnel-list";

export const Route = createFileRoute("/share-my-card")({
  head: () => ({
    meta: [
      { title: "Share My Card — Digital Business Card" },
      {
        name: "description",
        content:
          "Share your permanent public QR code, digital business card link, and vCard contact file.",
      },
    ],
  }),
  component: ShareMyCardPage,
});

function ShareMyCardPage() {
  const [currentEmpId, setCurrentEmpId] = useState<string>("2023043910");
  const [card, setCard] = useState<DigitalBusinessCard | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_current_user");
        if (stored) {
          const user = JSON.parse(stored);
          if (user.empId || user.userId) {
            setCurrentEmpId(user.empId || user.userId);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    loadCard(currentEmpId);
  }, [currentEmpId]);

  const loadCard = (empId: string) => {
    let existing = getCardByEmployeeId(empId);
    if (!existing) {
      existing = createCard(empId);
    }
    setCard(existing);
  };

  const hrisEmp = getHrisEmployee(currentEmpId) || employeesData[0];
  const publicUrl = card ? getPublicCardUrl(card.publicToken) : "";

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public Business Card URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!publicUrl || !hrisEmp) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${hrisEmp.name} — Digital Business Card`,
          text: `Connect with ${hrisEmp.name} (${hrisEmp.title || "Executive"} at ${hrisEmp.unit || "Pakiza"})`,
          url: publicUrl,
        });
        toast.success("Shared successfully!");
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          handleCopyUrl();
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleDownloadVcf = () => {
    if (!card) return;
    const resolved = resolvePublicCard(card.publicToken);
    downloadVCard(resolved);
    toast.success("Contact card (.vcf) downloaded!");
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Share2 className="size-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Share My Business Card
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Distribute your permanent scannable QR code, public card link, and downloadable
                vCard contact file.
              </p>
            </div>

            {/* Employee Switcher */}
            <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-muted-foreground px-2">Employee:</span>
              <select
                value={currentEmpId}
                onChange={(e) => setCurrentEmpId(e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-background border border-border/80 text-xs font-semibold outline-none cursor-pointer"
              >
                {employeesData.slice(0, 10).map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Alert if Locked or Unpublished */}
          {card?.adminDisabled ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="size-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold">Card Locked by Administrator</h4>
                <p className="text-xs opacity-90">
                  Public access is disabled. Anyone scanning this QR code will see a safe
                  unavailable screen until an Administrator removes the lock.
                </p>
              </div>
            </div>
          ) : !card?.employeePublished ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-600 dark:text-amber-400">
              <EyeOff className="size-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold">Card Currently Unpublished</h4>
                <p className="text-xs opacity-90">
                  Your business card is saved as draft. To make it visible to anyone scanning this
                  QR code, please enable publication in the{" "}
                  <Link to="/my-digital-business-card" className="font-bold underline">
                    My Digital Business Card
                  </Link>{" "}
                  settings.
                </p>
              </div>
            </div>
          ) : null}

          {/* Main Sharing Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: QR Code & Direct Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="size-3.5" />
                    <span>Permanent Vector QR Code</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Scan with Any Smartphone Camera
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    No app installation or registration required. Opens your verified digital
                    business card immediately.
                  </p>
                </div>

                {/* Authentic Scannable QR Code */}
                <div className="p-2 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-sky-500/20 rounded-3xl border border-white/20 shadow-md">
                  <QRCodeRenderer value={publicUrl} size={240} />
                </div>

                {/* Permanent Public URL box */}
                <div className="w-full max-w-md space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Permanent Public URL
                  </label>
                  <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl p-2.5">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="bg-transparent text-xs font-mono text-primary flex-1 outline-none truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
                  >
                    <Share2 className="size-4" />
                    <span>Share Card Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadVcf}
                    className="h-11 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="size-4" />
                    <span>Download .vcf Card</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Mobile Preview & Card Profile Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Profile Card Summary */}
              <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Card Profile Summary
                  </h4>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Open Public View</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                    {hrisEmp.name
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{hrisEmp.name}</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {hrisEmp.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {hrisEmp.unit || "Pakiza Software"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Publication Status</span>
                    {card?.adminDisabled ? (
                      <span className="font-bold text-rose-500">Locked by Admin</span>
                    ) : card?.employeePublished ? (
                      <span className="font-bold text-emerald-500 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live & Scannable
                      </span>
                    ) : (
                      <span className="font-bold text-amber-500">Unpublished (Draft)</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Public Token</span>
                    <span className="font-mono font-semibold text-foreground text-[11px]">
                      {card?.publicToken}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Official Email</span>
                    <span className="font-semibold text-foreground">{hrisEmp.email || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Official Phone</span>
                    <span className="font-semibold text-foreground font-mono">
                      {hrisEmp.officeMob || hrisEmp.phone || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground">Social Media Links</span>
                    <span className="font-bold text-primary">
                      {hrisEmp.socialMediaLinks?.length || 0} configured
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 flex gap-2">
                  <Link
                    to="/my-digital-business-card"
                    className="flex-1 h-9 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <CreditCard className="size-3.5 text-muted-foreground" />
                    <span>Manage Settings</span>
                  </Link>

                  <Link
                    to="/digital-business-card-analytics"
                    className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>View Analytics</span>
                  </Link>
                </div>
              </div>

              {/* Best Practices Banner */}
              <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 space-y-2 text-xs text-muted-foreground">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>How to use your QR code</span>
                </div>
                <p className="leading-relaxed">
                  You can print this vector QR code on your physical business cards, lanyard ID
                  card, email signatures, or presentation slides.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
