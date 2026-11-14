import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Download,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  resolvePublicCard,
  recordPublicCardView,
  downloadVCard,
  getPublicCardUrl,
  ResolvedPublicCard,
} from "@/lib/digital-business-card-service";
import {
  LinkedInIcon,
  FacebookIcon,
  XTwitterIcon,
  WhatsAppIcon,
  getSafeExternalUrl,
} from "@/components/social-media/SocialMediaUtils";
import { QRCodeRenderer } from "@/components/digital-business-card/QRCodeRenderer";

export const Route = createFileRoute("/digital-business-card/$id")({
  head: () => ({
    meta: [
      { title: "Digital Business Card — Pakiza Software" },
      {
        name: "description",
        content: "Verified Employee Digital Business Card by Pakiza Software & CRIPTON HRIS.",
      },
    ],
  }),
  component: DigitalBusinessCardDetailPage,
});

function DigitalBusinessCardDetailPage() {
  const { id } = Route.useParams();
  return <DigitalBusinessCardView empIdOrToken={id} />;
}

export function DigitalBusinessCardView({ empIdOrToken }: { empIdOrToken: string }) {
  const [resolved, setResolved] = useState<ResolvedPublicCard>(() =>
    resolvePublicCard(empIdOrToken),
  );
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const res = resolvePublicCard(empIdOrToken);
    setResolved(res);

    // Count view only for successfully loaded, available public cards
    if (res.status === "available" && res.card) {
      recordPublicCardView(res.card.publicToken);
    }
  }, [empIdOrToken]);

  const publicUrl = resolved.card ? getPublicCardUrl(resolved.card.publicToken) : "";

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Business Card link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!resolved.employee || !publicUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resolved.employee.name} — Digital Business Card`,
          text: `Contact ${resolved.employee.name} (${resolved.employee.designation} at ${resolved.employee.company})`,
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

  const handleDownloadContact = () => {
    if (resolved.status !== "available" || !resolved.employee) return;
    downloadVCard(resolved);
    toast.success("Contact file (.vcf) downloaded!");
  };

  // State Handling: Unavailable / Not Found
  if (resolved.status !== "available" || !resolved.employee) {
    return (
      <div className="min-h-screen bg-[#072460] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="size-20 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-inner">
            <AlertTriangle className="size-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Business Card Unavailable
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              This digital business card is currently inactive or not available for public preview.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-blue-200/70 flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-4 text-blue-300" />
            <span>CRIPTON HRIS • Verified Enterprise Card</span>
          </div>
        </div>
      </div>
    );
  }

  const { employee } = resolved;
  const sanitizedWhatsApp = employee.whatsappNumber
    ? employee.whatsappNumber.replace(/[^0-9]/g, "")
    : "";

  const socialLinks = employee.socialMediaLinks || [];
  const findUrl = (name: string) => {
    const item = socialLinks.find(
      (l) =>
        l.platform.toLowerCase().includes(name.toLowerCase()) ||
        (l.customPlatform && l.customPlatform.toLowerCase().includes(name.toLowerCase())),
    );
    return item ? getSafeExternalUrl(item.url) : null;
  };

  const whatsAppUrl = sanitizedWhatsApp
    ? `https://wa.me/${sanitizedWhatsApp}`
    : findUrl("whatsapp") || "https://wa.me/8801777777344";

  const linkedInUrl = findUrl("linkedin") || "https://www.linkedin.com/company/pakizasoftware";
  const facebookUrl = findUrl("facebook") || "https://www.facebook.com/pakizasoftware";
  const xUrl = findUrl("twitter") || findUrl("x") || "https://x.com/pakizasoftware";
  const websiteUrl = employee.website
    ? employee.website.startsWith("http")
      ? employee.website
      : `http://${employee.website}`
    : findUrl("website") || "http://www.pakizasoftware.com";

  const isRakibul =
    employee.name.toLowerCase().includes("rakibul") ||
    employee.id === "2023043910" ||
    empIdOrToken.toLowerCase().includes("rakib");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 py-6 sm:py-10 selection:bg-white selection:text-[#0a57e3]">
      {/* Outer Card Wrapper (NFC Phone Form Factor) */}
      <div
        className="w-full max-w-[420px] rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(10,87,227,0.45)] border border-white/20 relative flex flex-col text-white bg-[#0844b2]"
      >
        {/* Floating QR Modal Trigger Button (discreet top-right) */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="absolute top-4 right-4 z-30 size-9 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-md flex items-center justify-center transition border border-white/20 shadow-md cursor-pointer"
          title="Scan or View QR Code"
          aria-label="Scan or View QR Code"
        >
          <QrCode className="size-4.5" />
        </button>

        {/* Hero Section: Pakiza Logo + Profile Photo + Curved Waves */}
        {isRakibul ? (
          <div className="relative w-full overflow-hidden">
            <img
              src="/images/nfc-card-hero.png"
              alt={`${employee.name} - Pakiza Software`}
              className="w-full h-auto block select-none pointer-events-none"
            />
          </div>
        ) : (
          /* Dynamic Fallback for other employees while maintaining identical royal-blue wave aesthetic */
          <div className="relative w-full pt-6 pb-2 px-6 overflow-hidden bg-gradient-to-b from-[#0b5be5] to-[#0a57e3]">
            {/* Top Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-sm border border-white/30">
                P
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wider uppercase text-white">
                  PAKIZA SOFTWARE
                </div>
                <div className="text-[9px] text-white/80 italic font-serif">
                  Excellence | Intelligence | Automation
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center my-3">
              <div className="size-36 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-blue-900/60 flex items-center justify-center">
                {employee.profilePhoto ? (
                  <img
                    src={employee.profilePhoto}
                    alt={employee.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {employee.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* SVG Wave Ribbon Curve */}
            <svg
              className="w-full h-12 text-white/95 -mb-1"
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0,35 C120,65 240,10 400,45 L400,60 L0,60 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}

        {/* Content Section (Middle Information Section & Footer) */}
        <div
          style={{
            background: "linear-gradient(180deg, #0844b2 0%, #0a46b8 12%, #0d4abe 25%, #104ec3 40%, #1252cb 55%, #1557d1 70%, #185cd7 85%, #1e65e3 100%)",
          }}
          className="relative z-10 flex flex-col space-y-4 pt-1 pb-6"
        >
          {/* Centered Employee Name & Designation */}
          <div className="text-center px-6 space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white leading-tight">
              {employee.name}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/90">
              {employee.designation}
            </p>
          </div>

          {/* Contact Details Rows with Rounded-Square Container Icons */}
          <div className="space-y-2.5 px-6 pt-1">
            {/* Phone */}
            <a
              href={`tel:${employee.officialPhone || employee.mobile || "+8801777777344"}`}
              className="flex items-center gap-3.5 text-white hover:text-white/85 transition group"
            >
              <div className="size-10 rounded-2xl bg-blue-500/40 border border-white/40 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Phone className="size-4.5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {employee.officialPhone || employee.mobile || "+88 01777 777344"}
              </span>
            </a>

            {/* Office Address */}
            <div className="flex items-start gap-3.5 text-white">
              <div className="size-10 rounded-2xl bg-blue-500/40 border border-white/40 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                <MapPin className="size-4.5" />
              </div>
              <div className="text-xs sm:text-[13px] font-medium leading-snug text-white/95">
                <p>House: 37, Floor: 11 (B-11), Road: 2,</p>
                <p>Khan ABC Tradeplex, Dhanmondi, Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* Optional Email if available */}
            {employee.officialEmail && (
              <a
                href={`mailto:${employee.officialEmail}`}
                className="flex items-center gap-3.5 text-white hover:text-white/85 transition group"
              >
                <div className="size-10 rounded-2xl bg-blue-500/40 border border-white/40 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="size-4.5" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold tracking-wide truncate">
                  {employee.officialEmail}
                </span>
              </a>
            )}

            {/* Optional Website if available */}
            {employee.website && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 text-white hover:text-white/85 transition group"
              >
                <div className="size-10 rounded-2xl bg-blue-500/40 border border-white/40 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Globe className="size-4.5" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold tracking-wide truncate">
                  {employee.website}
                </span>
              </a>
            )}
          </div>

          {/* Social Media Icons in Individual White Rounded-Square Containers */}
          <div className="flex items-center justify-center gap-3 px-6 pt-2">
            {/* WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 sm:size-13 rounded-2xl bg-white hover:bg-slate-50 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-[#25D366]"
              title="WhatsApp"
            >
              <WhatsAppIcon className="size-6" />
            </a>

            {/* LinkedIn */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 sm:size-13 rounded-2xl bg-white hover:bg-slate-50 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-[#0A66C2]"
              title="LinkedIn"
            >
              <LinkedInIcon className="size-6" />
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 sm:size-13 rounded-2xl bg-white hover:bg-slate-50 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-[#1877F2]"
              title="Facebook"
            >
              <FacebookIcon className="size-6" />
            </a>

            {/* X / Twitter */}
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 sm:size-13 rounded-2xl bg-white hover:bg-slate-50 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-black"
              title="X"
            >
              <XTwitterIcon className="size-5 text-black" />
            </a>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 px-6 pt-3">
            {/* White Save Contact (VCF) Button */}
            <button
              type="button"
              onClick={handleDownloadContact}
              className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-[#0956d6] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Download className="size-4.5 stroke-[2.5]" />
              <span>Save Contact (VCF)</span>
            </button>

            {/* Transparent Share Card Button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-full h-12 rounded-xl border border-white/80 hover:bg-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs active:scale-[0.99]"
            >
              <Share2 className="size-4" />
              <span>Share Card</span>
            </button>
          </div>

          {/* Decorative Curved Wave Elements Background (matches reference design) */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden z-0">
            <img
              src="/images/nfc-bottom-waves.png?v=2"
              alt=""
              className="w-full h-auto object-cover opacity-90 select-none block"
            />
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Share Business Card</h3>
              <p className="text-xs text-slate-400">
                Scan with any mobile camera to open this digital card.
              </p>
            </div>

            {/* Authentic Vector QR Code */}
            <div className="flex justify-center p-2 bg-white rounded-2xl shadow-inner">
              <QRCodeRenderer value={publicUrl} size={210} />
            </div>

            {/* Permanent Public URL box */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Permanent Public URL
              </span>
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="bg-transparent text-xs text-indigo-300 outline-none flex-1 font-mono truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="size-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
