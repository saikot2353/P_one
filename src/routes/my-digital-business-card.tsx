import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Calendar,
  Sparkles,
  Download,
  Upload,
  Image as ImageIcon,
  Trash2,
  Wand2,
  Plus,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Info,
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
  saveStoredUploadedPhoto,
  getStoredUploadedPhoto,
  removeStoredUploadedPhoto,
  removeImageBackground,
  saveEmployeeSocialLinks,
  getEmployeeSocialLinks,
  DigitalBusinessCard,
  CardAnalyticsRecord,
} from "@/lib/digital-business-card-service";
import {
  SocialMediaLink,
  SUPPORTED_PLATFORMS,
  SocialMediaIcon,
} from "@/components/social-media/SocialMediaUtils";
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
    "overview" | "visibility" | "analytics"
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

  // Digital Business Card Uploaded Photo states
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [rawUploadedPhoto, setRawUploadedPhoto] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Configured Social Media Profiles
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);

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
      setOfficeAddress(existing.officeAddress || "House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka, Bangladesh");
      setAnalytics(getCardAnalytics(existing.publicToken));
    } else {
      setCard(null);
    }

    // Load custom uploaded photo from browser storage
    const customPhoto = getStoredUploadedPhoto(empId);
    setUploadedPhoto(customPhoto);

    // Load social media links from browser storage or master data
    const links = getEmployeeSocialLinks(empId);
    setSocialLinks(links);
  };

  const hrisEmp = getHrisEmployee(currentEmpId) || employeesData[0];

  // Photo Upload Handler with Automatic Background Removal
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (.png, .jpg, .jpeg, .webp)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file size should be less than 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      setRawUploadedPhoto(rawDataUrl);

      if (autoRemoveBg) {
        setIsRemovingBg(true);
        toast.info("Analyzing image and removing background automatically...");
        try {
          const bgRemovedUrl = await removeImageBackground(rawDataUrl);
          setUploadedPhoto(bgRemovedUrl);
          saveStoredUploadedPhoto(currentEmpId, bgRemovedUrl);
          toast.success("Background removed & photo saved to Digital Business Card!");
        } catch (err) {
          console.error(err);
          setUploadedPhoto(rawDataUrl);
          saveStoredUploadedPhoto(currentEmpId, rawDataUrl);
          toast.success("Photo saved to Digital Business Card!");
        } finally {
          setIsRemovingBg(false);
        }
      } else {
        setUploadedPhoto(rawDataUrl);
        saveStoredUploadedPhoto(currentEmpId, rawDataUrl);
        toast.success("Photo saved to Digital Business Card!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReapplyBgRemoval = async () => {
    if (!rawUploadedPhoto && !uploadedPhoto) return;
    const base = rawUploadedPhoto || uploadedPhoto!;
    setIsRemovingBg(true);
    try {
      const processed = await removeImageBackground(base);
      setUploadedPhoto(processed);
      saveStoredUploadedPhoto(currentEmpId, processed);
      toast.success("Background removal applied and saved!");
    } catch {
      toast.error("Failed to remove background.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (rawUploadedPhoto) {
      setUploadedPhoto(rawUploadedPhoto);
      saveStoredUploadedPhoto(currentEmpId, rawUploadedPhoto);
      toast.info("Restored original uploaded photo.");
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    setRawUploadedPhoto(null);
    removeStoredUploadedPhoto(currentEmpId);
    toast.info("Uploaded photo removed. Public card now uses the default portrait.");
  };

  // Social Media Link Handlers
  const handleAddSocialLink = () => {
    const newLink: SocialMediaLink = {
      id: `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      platform: "LinkedIn",
      url: "",
    };
    const updated = [...socialLinks, newLink];
    setSocialLinks(updated);
    saveEmployeeSocialLinks(currentEmpId, updated);
  };

  const handleUpdateSocialLink = (
    id: string,
    field: "platform" | "customPlatform" | "url",
    value: string,
  ) => {
    const updated = socialLinks.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    setSocialLinks(updated);
    saveEmployeeSocialLinks(currentEmpId, updated);
  };

  const handleRemoveSocialLink = (id: string) => {
    const updated = socialLinks.filter((item) => item.id !== id);
    setSocialLinks(updated);
    saveEmployeeSocialLinks(currentEmpId, updated);
    toast.success("Social profile removed");
  };

  const handleSaveSocialLinks = () => {
    saveEmployeeSocialLinks(currentEmpId, socialLinks);
    toast.success("Social media profiles saved to browser storage!");
  };

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
                  <span>Card Details Info</span>
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
                  onClick={() => setActiveTab("analytics")}
                  className={`h-10 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    activeTab === "analytics"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BarChart3 className="size-3.5" />
                  <span>Card Analytics</span>
                </button>
              </div>

              {/* Tab 1: Card Details Info */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Digital Business Card Image Upload Section */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                      <div>
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <ImageIcon className="size-4 text-primary" />
                          <span>Digital Business Card Photo</span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Upload your portrait photo for the verified public Digital Business Card.
                        </p>
                      </div>

                      {/* Upload Instruction Banner */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium">
                        <Info className="size-3.5 shrink-0" />
                        <span>Please upload a professional photo with the person's shoulders clearly visible.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Photo Preview Column (Checkerboard background to preview transparency) */}
                      <div className="md:col-span-4 flex flex-col items-center">
                        <div
                          className="relative w-48 h-56 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden shadow-inner group"
                          style={{
                            backgroundImage:
                              "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 16px 16px",
                          }}
                        >
                          {uploadedPhoto ? (
                            <img
                              src={uploadedPhoto}
                              alt="Business Card Photo"
                              className="size-full object-contain select-none"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-center p-4 text-muted-foreground space-y-2">
                              <div className="size-12 rounded-2xl bg-muted/80 flex items-center justify-center">
                                <Upload className="size-6 text-muted-foreground" />
                              </div>
                              <span className="text-xs font-semibold">No custom photo uploaded</span>
                              <span className="text-[10px] text-muted-foreground/80">
                                Card uses default Pakiza portrait
                              </span>
                            </div>
                          )}

                          {isRemovingBg && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 text-center space-y-2 z-20">
                              <Wand2 className="size-6 animate-spin text-indigo-400" />
                              <span className="text-xs font-bold">Removing background...</span>
                            </div>
                          )}
                        </div>

                        {uploadedPhoto && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="size-3.5" />
                            <span>Saved in browser storage & live on card</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls & Settings */}
                      <div className="md:col-span-8 space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />

                        <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <Wand2 className="size-3.5 text-indigo-500" />
                                <span>Automatic Background Removal</span>
                              </label>
                              <p className="text-[11px] text-muted-foreground">
                                Automatically isolates the person from the background upon upload for the corporate royal-blue card.
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={autoRemoveBg}
                              onChange={(e) => setAutoRemoveBg(e.target.checked)}
                              className="size-4 text-primary rounded cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition flex items-center gap-2 cursor-pointer"
                          >
                            <Upload className="size-4" />
                            <span>{uploadedPhoto ? "Upload Different Photo" : "Upload Photo"}</span>
                          </button>

                          {uploadedPhoto && (
                            <>
                              <button
                                type="button"
                                disabled={isRemovingBg}
                                onClick={handleReapplyBgRemoval}
                                className="h-10 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                title="Re-run background removal algorithm"
                              >
                                <Wand2 className="size-3.5" />
                                <span>Re-apply Bg Removal</span>
                              </button>

                              {rawUploadedPhoto && (
                                <button
                                  type="button"
                                  onClick={handleRestoreOriginal}
                                  className="h-10 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                                  title="Restore original image before background removal"
                                >
                                  <RotateCcw className="size-3.5" />
                                  <span>Original</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="h-10 px-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-auto"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Remove Photo</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Official HRIS Master Data in a Single Row with Five Columns */}
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Official HRIS Master Data
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Official corporate credentials synced from Employee Master Data.
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

                    {/* Single Row with 5 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
                      {/* Column 1: Employee Name */}
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Employee Name
                        </span>
                        <div className="font-bold text-foreground truncate" title={hrisEmp.name}>
                          {hrisEmp.name}
                        </div>
                      </div>

                      {/* Column 2: Designation */}
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Designation
                        </span>
                        <div
                          className="font-bold text-foreground truncate"
                          title={hrisEmp.title || (hrisEmp as any).designation}
                        >
                          {hrisEmp.title || (hrisEmp as any).designation}
                        </div>
                      </div>

                      {/* Column 3: Company */}
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Company
                        </span>
                        <div
                          className="font-bold text-foreground truncate"
                          title={hrisEmp.unit || (hrisEmp as any).company || "Pakiza Software Limited"}
                        >
                          {hrisEmp.unit || (hrisEmp as any).company || "Pakiza Software Limited"}
                        </div>
                      </div>

                      {/* Column 4: Official Email */}
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Official Email
                        </span>
                        <div
                          className="font-bold text-foreground truncate"
                          title={hrisEmp.email || "rakib@pakizaknit.com"}
                        >
                          {hrisEmp.email || "rakib@pakizaknit.com"}
                        </div>
                      </div>

                      {/* Column 5: Mobile / Phone */}
                      <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/40 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Mobile / Phone
                        </span>
                        <div className="font-bold text-foreground font-mono truncate">
                          {(hrisEmp as any).mobile || hrisEmp.officeMob || hrisEmp.phone || "+88 01777 777344"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configured Social Media Profiles Section */}
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                      <div>
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Globe className="size-4 text-sky-500" />
                          <span>Configured Social Media Profiles ({socialLinks.length})</span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Manage and configure social media links displayed on your Digital Business Card.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="h-8.5 px-3.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold transition flex items-center gap-1.5 border border-sky-500/30 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Social Media Profile</span>
                      </button>
                    </div>

                    {socialLinks.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          No social media links added yet.
                        </p>
                        <p className="text-[11px] text-muted-foreground/80">
                          Click <strong>"Add Social Media Profile"</strong> above to attach LinkedIn, Facebook, WhatsApp, or other links.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {socialLinks.map((link) => (
                          <div
                            key={link.id}
                            className="p-3.5 rounded-xl bg-muted/20 border border-border/60 hover:border-border transition space-y-2.5"
                          >
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                              {/* Platform Dropdown with Brand Icon */}
                              <div className="w-full md:w-56 shrink-0 space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                  Platform
                                </label>
                                <div className="relative">
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SocialMediaIcon platform={link.platform} className="size-4" />
                                  </div>
                                  <select
                                    value={link.platform}
                                    onChange={(e) =>
                                      handleUpdateSocialLink(link.id, "platform", e.target.value)
                                    }
                                    className="h-10 pl-9 pr-8 rounded-xl border border-border bg-card text-xs font-semibold w-full appearance-none outline-none cursor-pointer"
                                  >
                                    {SUPPORTED_PLATFORMS.map((plat) => (
                                      <option key={plat} value={plat}>
                                        {plat}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </div>

                              {/* Custom Platform Input if "Other" */}
                              {link.platform === "Other" && (
                                <div className="w-full md:w-44 shrink-0 space-y-1">
                                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    Custom Name
                                  </label>
                                  <input
                                    type="text"
                                    value={link.customPlatform || ""}
                                    onChange={(e) =>
                                      handleUpdateSocialLink(link.id, "customPlatform", e.target.value)
                                    }
                                    placeholder="e.g. Behance"
                                    className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold w-full outline-none"
                                  />
                                </div>
                              )}

                              {/* Profile URL Input */}
                              <div className="flex-1 w-full space-y-1 min-w-0">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Profile URL
                                </label>
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) =>
                                    handleUpdateSocialLink(link.id, "url", e.target.value)
                                  }
                                  placeholder="https://..."
                                  className="h-10 px-3 rounded-xl border border-border bg-card text-xs font-mono w-full outline-none"
                                />
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(link.id)}
                                className="h-10 w-10 shrink-0 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 flex items-center justify-center transition cursor-pointer self-end md:self-auto"
                                title="Remove link"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveSocialLinks}
                            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="size-3.5" />
                            <span>Save Social Profiles</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Visibility Settings */}
              {activeTab === "visibility" && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Public Field Visibility Controls
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Control which details appear on your public digital card and downloadable .vcf
                      contact file.
                    </p>
                  </div>

                  {/* 3-Column Grid across 2 Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 1. Show Official Email */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show Official Email
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Expose email address and enable email button on public card.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficeEmail}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficeEmail: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>

                    {/* 2. Show Official Phone Number */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show Official Phone Number
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Expose phone number and enable Call button on public card.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficePhone}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficePhone: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>

                    {/* 3. Show Department Name */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show Department Name
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Display department alongside your designation.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showDepartment}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showDepartment: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>

                    {/* 4. Show Office Address */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show Office Address
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Display corporate office location on card and include in vCard.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showOfficeAddress}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showOfficeAddress: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>

                    {/* 5. Show WhatsApp Contact */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show WhatsApp Contact
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Display WhatsApp action button if a number is configured.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showWhatsApp}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showWhatsApp: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>

                    {/* 6. Show Social Media Links */}
                    <label className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 transition cursor-pointer bg-card/50">
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block">
                          Show Social Media Links
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Show brand icon cards for your LinkedIn, Facebook, and custom links.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility.showSocialLinks}
                        onChange={(e) =>
                          setVisibility({ ...visibility, showSocialLinks: e.target.checked })
                        }
                        className="size-4 text-primary rounded shrink-0 mt-0.5 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <label className="text-xs font-bold text-foreground">Office Address</label>
                    <input
                      type="text"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      placeholder="House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka"
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    />
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

              {/* Tab 3: Analytics */}
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
