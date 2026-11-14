import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DigitalBusinessCardSidebar } from "@/components/dashboard/DigitalBusinessCardSidebar";
import {
  CreditCard,
  QrCode,
  Share2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Calendar,
  Lock,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCardByEmployeeId,
  createCard,
  updateCard,
  setEmployeePublishState,
  getPublicCardUrl,
  getHrisEmployee,
  getCardAnalytics,
  downloadVCard,
  resolvePublicCard,
  DigitalBusinessCard,
  CardAnalyticsRecord,
} from "@/lib/digital-business-card-service";
import { QRCodeRenderer } from "@/components/digital-business-card/QRCodeRenderer";
import { SocialMediaIcon } from "@/components/social-media/SocialMediaUtils";
import { employeesData } from "@/routes/personnel-list";

export const Route = createFileRoute("/my-digital-business-card")({
  head: () => ({
    meta: [
      { title: "My Digital Business Card — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage, customize visibility, share, and track your verified employee Digital Business Card.",
      },
    ],
  }),
  component: MyDigitalBusinessCardPage,
});

function MyDigitalBusinessCardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "visibility" | "whatsapp" | "share" | "analytics"
  >("overview");

  // Determine current employee identity from session
  const [, setCurrentUser] = useState<{
    role?: string;
    name?: string;
    [key: string]: unknown;
  } | null>(null);
  const [currentEmpId, setCurrentEmpId] = useState<string>("2023043910"); // Default: Rakibul Islam Khan (Managing Director)
  const [card, setCard] = useState<DigitalBusinessCard | null>(null);
  const [analytics, setAnalytics] = useState<CardAnalyticsRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [visibility, setVisibility] = useState({
    showDepartment: true,
    showOfficeEmail: true,
    showOfficePhone: true,
    showOfficeAddress: true,
    showWhatsApp: true,
    showSocialLinks: true,
  });
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cripton_current_user");
        if (stored) {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          if (user.empId || user.userId) {
            setCurrentEmpId(user.empId || user.userId);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Load employee and card record
  useEffect(() => {
    loadCardData(currentEmpId);
  }, [currentEmpId]);

  const loadCardData = (empId: string) => {
    const existing = getCardByEmployeeId(empId);
    if (existing) {
      setCard(existing);
      setVisibility(existing.publicVisibility);
      setWhatsappNumber(existing.whatsappNumber || "");
      setOfficeAddress(existing.officeAddress || "Pakiza Corporate Tower, 12 Green Road, Dhaka");
      setAnalytics(getCardAnalytics(existing.publicToken));
    } else {
      setCard(null);
    }
  };

  const hrisEmp = getHrisEmployee(currentEmpId) || employeesData[0];

  const handleCreateCard = () => {
    const newCard = createCard(currentEmpId, {
      whatsappNumber: hrisEmp.officeMob || "",
      officeAddress: hrisEmp.village || "Pakiza Corporate Tower, 12 Green Road, Dhaka",
    });
    setCard(newCard);
    setVisibility(newCard.publicVisibility);
    setWhatsappNumber(newCard.whatsappNumber || "");
    setOfficeAddress(newCard.officeAddress || "");
    toast.success("Digital Business Card generated successfully!");
  };

  const handleSaveSettings = () => {
    if (!card) return;
    setIsSaving(true);

    // Validate WhatsApp number if provided
    if (whatsappNumber && !/^(\+?[0-9]{7,16})$/.test(whatsappNumber.replace(/[\s-]/g, ""))) {
      toast.error("Please enter a valid WhatsApp number with country code (e.g. +8801750021154)");
      setIsSaving(false);
      return;
    }

    const updated = updateCard(currentEmpId, {
      publicVisibility: visibility,
      whatsappNumber: whatsappNumber.trim(),
      officeAddress: officeAddress.trim(),
    });

    setCard(updated);
    setIsSaving(false);
    toast.success("Card visibility and settings saved!");
  };

  const handleTogglePublish = (publish: boolean) => {
    if (!card) return;

    if (publish && card.adminDisabled) {
      toast.error("This card is locked by Company Administrator. Cannot publish while locked.");
      return;
    }

    const res = setEmployeePublishState(currentEmpId, publish);
    if (res.success && res.card) {
      setCard(res.card);
      toast.success(
        publish
          ? "Business Card published! Now accessible via public URL and QR code."
          : "Business Card unpublished. Public access disabled.",
      );
    } else {
      toast.error(res.error || "Failed to update publication status.");
    }
  };

  const publicUrl = card ? getPublicCardUrl(card.publicToken) : "";

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!publicUrl || !hrisEmp) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${hrisEmp.name} — Digital Business Card`,
          text: `Contact ${hrisEmp.name} (${hrisEmp.title || "Executive"} at Pakiza)`,
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

  const handleDownloadTestVcf = () => {
    if (!card) return;
    const resolved = resolvePublicCard(card.publicToken);
    downloadVCard(resolved);
    toast.success("Contact file (.vcf) downloaded!");
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <DigitalBusinessCardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Title & Quick Employee Switcher for Demo/Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                  <CreditCard className="size-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  My Digital Business Card
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your public digital business card, toggle visibility of contact details,
                and track engagement.
              </p>
            </div>

            {/* Employee Switcher (Helper for pair-programming & demo verification) */}
            <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border shadow-2xs">
              <span className="text-[11px] font-bold text-muted-foreground px-2">
                Viewing Employee:
              </span>
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

          {/* If No Card Exists for this employee, show Step 1: Create Card Banner */}
          {!card ? (
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background border border-indigo-500/20 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
              <div className="size-20 mx-auto rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="size-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Create Your Digital Business Card
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Generate a permanent, verifiable public digital business card backed by your
                  official Pakiza HRIS credentials.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateCard}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg"
                >
                  <CreditCard className="size-4" />
                  <span>Create My Digital Business Card</span>
                </button>
              </div>

              <div className="pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>HRIS Verified</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <QrCode className="size-4 text-indigo-500" />
                  <span>Real Vector QR</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <BarChart3 className="size-4 text-purple-500" />
                  <span>Privacy Analytics</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Admin Lock Banner (if active) */}
              {card.adminDisabled && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="size-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold">Admin Lock Active</h4>
                    <p className="text-xs opacity-90">
                      This business card has been disabled by a Company Administrator. The card is
                      currently hidden from public preview. Only an Administrator can remove this
                      lock.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Header Bar */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {hrisEmp.name
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {hrisEmp.name}
                      </h3>
                      {card.employeePublished && !card.adminDisabled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Published & Live
                        </span>
                      ) : card.adminDisabled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Locked by Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Draft / Unpublished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hrisEmp.title} • {hrisEmp.unit || "Pakiza Software"}
                    </p>
                  </div>
                </div>

                {/* Status Toggle & Quick Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {card.employeePublished ? (
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(false)}
                      className="h-9 px-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <EyeOff className="size-3.5" />
                      <span>Unpublish Card</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={card.adminDisabled}
                      onClick={() => handleTogglePublish(true)}
                      className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="size-3.5" />
                      <span>Publish Card</span>
                    </button>
                  )}

                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 hover:bg-indigo-100"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>View Public Card</span>
                  </a>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CreditCard className="size-3.5" />
                  <span>Card Preview & Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("visibility")}
                  className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    activeTab === "visibility"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="size-3.5" />
                  <span>Public Visibility</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("whatsapp")}
                  className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    activeTab === "whatsapp"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp Setup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("share")}
                  className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    activeTab === "share"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Share2 className="size-3.5" />
                  <span>Share & QR Code</span>
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
                  <span>Analytics</span>
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: QR Code & Permanent URL */}
                  <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-2xs">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <QrCode className="size-4 text-indigo-500" />
                      Permanent Scannable QR Code
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Scannable from any mobile camera. Directs to your permanent verified public
                      URL.
                    </p>

                    <QRCodeRenderer value={publicUrl} size={180} />

                    <div className="w-full space-y-1.5 pt-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Permanent Public URL
                      </label>
                      <div className="flex items-center gap-1.5 bg-muted/40 border border-border rounded-xl p-2">
                        <input
                          type="text"
                          readOnly
                          value={publicUrl}
                          className="bg-transparent text-xs font-mono text-foreground flex-1 outline-none truncate"
                        />
                        <button
                          type="button"
                          onClick={handleCopyUrl}
                          className="p-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs transition"
                          title="Copy Link"
                        >
                          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="w-full flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="size-3.5" />
                        <span>Share Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadTestVcf}
                        className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-xs font-bold transition flex items-center gap-1"
                        title="Download VCF"
                      >
                        <Download className="size-3.5" />
                        <span>VCF</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: HRIS Employee Data Summary */}
                  <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Official HRIS Master Data (Read-Only)
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Official corporate details synced from the Employee Master Data.
                        </p>
                      </div>
                      <Link
                        to="/add-employee"
                        search={{ id: currentEmpId } as Record<string, string>}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Edit in HRIS</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Employee Name
                        </span>
                        <div className="font-bold text-foreground">{hrisEmp.name}</div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Designation
                        </span>
                        <div className="font-bold text-foreground">{hrisEmp.title || (hrisEmp as any).designation}</div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Company
                        </span>
                        <div className="font-bold text-foreground">
                          {hrisEmp.unit || (hrisEmp as any).company || "Pakiza Software Limited"}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Official Email
                        </span>
                        <div className="font-bold text-foreground">{hrisEmp.email || "rakib@pakizaknit.com"}</div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Mobile
                        </span>
                        <div className="font-bold text-foreground font-mono">
                          {(hrisEmp as any).mobile || hrisEmp.officeMob || "+88 01777 777344"}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Website
                        </span>
                        <div className="font-bold text-foreground">
                          <a
                            href={String((hrisEmp as any).website || "www.pakizasoftware.com").startsWith("http") ? String((hrisEmp as any).website) : `http://${(hrisEmp as any).website || "www.pakizasoftware.com"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-semibold"
                          >
                            {(hrisEmp as any).website || "www.pakizasoftware.com"}
                          </a>
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Building
                        </span>
                        <div className="font-bold text-foreground">
                          {(hrisEmp as any).building || "Khan ABC Tradeplex"}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Area & City
                        </span>
                        <div className="font-bold text-foreground">
                          {(hrisEmp as any).area || "Dhanmondi"}, {(hrisEmp as any).city || "Dhaka"}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Address & Country
                        </span>
                        <div className="font-bold text-foreground">
                          {(hrisEmp as any).address || "House: 37, Floor: 11 (B-11), Road: 2"}, {(hrisEmp as any).country || "Bangladesh"}
                        </div>
                      </div>
                    </div>

                    {/* Social Media Links from Add Employee File */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Globe className="size-3.5 text-sky-500" />
                          Configured Social Media Profiles ({hrisEmp.socialMediaLinks?.length || 0})
                        </span>
                        <Link
                          to="/add-employee"
                          search={{ id: currentEmpId } as Record<string, string>}
                          className="text-xs text-primary hover:underline font-semibold"
                        >
                          + Manage Links
                        </Link>
                      </div>

                      {Array.isArray(hrisEmp.socialMediaLinks) &&
                      hrisEmp.socialMediaLinks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {hrisEmp.socialMediaLinks.map(
                            (
                              link: { platform: string; customPlatform?: string; url: string },
                              i: number,
                            ) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background text-xs"
                              >
                                <SocialMediaIcon
                                  platform={link.platform}
                                  className="size-4 shrink-0"
                                />
                                <span className="font-bold text-foreground truncate">
                                  {link.platform === "Other" ? link.customPlatform : link.platform}
                                </span>
                                <span className="text-muted-foreground truncate text-[11px] font-mono">
                                  {link.url}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No social media links added yet. You can configure them in the Add
                          Employee File form under Contact Information.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Visibility Settings */}
              {activeTab === "visibility" && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-2xl shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Public Field Visibility Controls
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Control which details appear on your public digital card and downloadable .vcf
                      contact file.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show Official Email
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Expose email address and enable email button on public card.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficeEmail}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficeEmail: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show Official Phone Number
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Expose phone number and enable Call button on public card.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficePhone}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficePhone: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show Department Name
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Display department alongside your designation.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showDepartment}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showDepartment: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show Office Address
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Display corporate office location on card and include in vCard.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficeAddress}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficeAddress: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show WhatsApp Contact
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Display WhatsApp action button if a number is configured.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showWhatsApp}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showWhatsApp: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          Show Social Media Links
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Show brand icon cards for your LinkedIn, Facebook, and custom links.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showSocialLinks}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showSocialLinks: e.target.checked })
                        }
                        className="size-4 text-primary rounded"
                      />
                    </label>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-foreground">Office Address</label>
                      <input
                        type="text"
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        placeholder="House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka"
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveSettings}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Save Visibility Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: WhatsApp Setup */}
              {activeTab === "whatsapp" && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-xl shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <MessageCircle className="size-4 text-emerald-500" />
                      Configure Dedicated WhatsApp Number
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Allow clients and partners to reach you directly on WhatsApp. You can provide
                      a separate business WhatsApp number from your official phone.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">
                        WhatsApp Number (with Country Code)
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+8801750021154"
                        className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-mono font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Example: <code className="bg-muted px-1 rounded">+8801750021154</code> or{" "}
                        <code className="bg-muted px-1 rounded">8801750021154</code>
                      </p>
                    </div>

                    {whatsappNumber && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 space-y-1">
                        <span className="text-[11px] font-bold">Generated WhatsApp Action:</span>
                        <div className="text-xs font-mono break-all">
                          https://wa.me/{whatsappNumber.replace(/[^0-9]/g, "")}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveSettings}
                      className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Save WhatsApp Number</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Share & QR */}
              {activeTab === "share" && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-xl shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Share Your Card & Permanent Public URL
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use the scannable QR code on physical business cards, posters, or share your
                      digital card link directly.
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 bg-muted/20 border border-border rounded-2xl space-y-4">
                    <QRCodeRenderer value={publicUrl} size={220} showCopyButton />
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="size-4" />
                      <span>Share Card Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadTestVcf}
                      className="w-full h-10 rounded-xl border border-border hover:bg-muted text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="size-4" />
                      <span>Download My .vcf Contact Card</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Analytics */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Total Card Views
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                        {analytics?.totalViews || 0}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Successful public loads</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Views This Month
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        {(() => {
                          const now = new Date();
                          const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
                          return analytics?.monthlyViews[thisMonth] || 0;
                        })()}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Monthly traffic</p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Last Viewed At
                      </span>
                      <div className="text-sm font-bold text-foreground mt-2 truncate">
                        {analytics?.lastViewedAt
                          ? new Date(analytics.lastViewedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No views yet"}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Privacy-safe count</p>
                    </div>
                  </div>

                  {/* Daily breakdown */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Recent Daily Views
                    </h4>

                    {analytics && Object.keys(analytics.dailyViews).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(analytics.dailyViews)
                          .slice(-7)
                          .map(([date, count]) => (
                            <div
                              key={date}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs"
                            >
                              <span className="font-semibold text-foreground flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-muted-foreground" />
                                {date}
                              </span>
                              <span className="font-bold text-primary font-mono">
                                {count} views
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No view records yet. Once visitors scan your QR code or open your public
                        card, traffic counts will appear here.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
