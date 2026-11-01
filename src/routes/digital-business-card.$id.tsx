import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Download,
  Share2,
  Copy,
  Check,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  X,
  Sparkles,
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
  SocialMediaIcon,
  getSafeExternalUrl,
  getPlatformDisplayName,
  SocialMediaLink,
} from "@/components/social-media/SocialMediaUtils";
import { QRCodeRenderer } from "@/components/digital-business-card/QRCodeRenderer";

export const Route = createFileRoute("/digital-business-card/$id")({
  head: () => ({
    meta: [
      { title: "Digital Business Card — CRIPTON HRIS" },
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
  // Rule: Must not disclose why a specific card is unavailable (never reveal internal status or admin lock)
  if (resolved.status !== "available" || !resolved.employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="size-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <AlertTriangle className="size-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Business Card Unavailable
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              This digital business card is currently inactive or not available for public preview.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-4 text-indigo-400" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white">
      {/* Container - Design 10: Premium Gradient Concept */}
      <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
        {/* Banner with Vibrant Gradient & Glowing Accents */}
        <div className="relative h-44 bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-10 -right-10 size-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 size-40 bg-indigo-900/40 rounded-full blur-xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xs shadow-xs border border-white/30">
                P
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                {employee.company}
              </span>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="size-8 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition border border-white/30 shadow-xs cursor-pointer"
              title="Show QR Code"
            >
              <QrCode className="size-4" />
            </button>
          </div>

          {/* Tagline */}
          <div className="relative z-10">
            <span className="text-[11px] font-semibold tracking-wide text-indigo-100/90 flex items-center gap-1.5">
              <Sparkles className="size-3 text-amber-300" />
              Verified Digital Business Card
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="relative px-6 pb-6 pt-0">
          {/* Avatar floating over banner */}
          <div className="relative -mt-16 flex items-end justify-between mb-4">
            <div className="relative size-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl border-4 border-slate-900/90">
              <div className="size-full rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden font-bold text-2xl text-white">
                {employee.profilePhoto ? (
                  <img
                    src={employee.profilePhoto}
                    alt={employee.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span>
                    {employee.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md text-white"
                title="Verified Employee"
              >
                <ShieldCheck className="size-3.5" />
              </div>
            </div>

            {/* Quick Share Action */}
            <button
              onClick={handleShare}
              className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer hover:border-white/30"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Name & Title */}
          <div className="space-y-1 mb-5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{employee.name}</span>
            </h1>
            <p className="text-sm font-semibold text-indigo-300">{employee.designation}</p>
            {employee.department && (
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Building2 className="size-3.5 text-slate-500 shrink-0" />
                <span>{employee.department}</span>
              </p>
            )}
          </div>

          {/* Primary Quick Actions Grid */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {/* Call */}
            {employee.officialPhone ? (
              <a
                href={`tel:${employee.officialPhone}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-slate-200 transition group"
              >
                <div className="size-9 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white flex items-center justify-center mb-1.5 transition">
                  <Phone className="size-4" />
                </div>
                <span className="text-[11px] font-semibold">Call</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-600 cursor-not-allowed">
                <div className="size-9 rounded-xl bg-white/5 text-slate-600 flex items-center justify-center mb-1.5">
                  <Phone className="size-4" />
                </div>
                <span className="text-[11px] font-medium">Call</span>
              </div>
            )}

            {/* Email */}
            {employee.officialEmail ? (
              <a
                href={`mailto:${employee.officialEmail}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-slate-200 transition group"
              >
                <div className="size-9 rounded-xl bg-blue-500/20 group-hover:bg-blue-500 text-blue-400 group-hover:text-white flex items-center justify-center mb-1.5 transition">
                  <Mail className="size-4" />
                </div>
                <span className="text-[11px] font-semibold">Email</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-600 cursor-not-allowed">
                <div className="size-9 rounded-xl bg-white/5 text-slate-600 flex items-center justify-center mb-1.5">
                  <Mail className="size-4" />
                </div>
                <span className="text-[11px] font-medium">Email</span>
              </div>
            )}

            {/* WhatsApp */}
            {sanitizedWhatsApp ? (
              <a
                href={`https://wa.me/${sanitizedWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 text-slate-200 transition group"
              >
                <div className="size-9 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-white flex items-center justify-center mb-1.5 transition">
                  <MessageCircle className="size-4" />
                </div>
                <span className="text-[11px] font-semibold">WhatsApp</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-600 cursor-not-allowed">
                <div className="size-9 rounded-xl bg-white/5 text-slate-600 flex items-center justify-center mb-1.5">
                  <MessageCircle className="size-4" />
                </div>
                <span className="text-[11px] font-medium">Chat</span>
              </div>
            )}

            {/* Save VCF */}
            <button
              onClick={handleDownloadContact}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 text-slate-200 transition group cursor-pointer"
            >
              <div className="size-9 rounded-xl bg-purple-500/20 group-hover:bg-purple-500 text-purple-400 group-hover:text-white flex items-center justify-center mb-1.5 transition">
                <Download className="size-4" />
              </div>
              <span className="text-[11px] font-semibold">Save Contact</span>
            </button>
          </div>

          {/* Section: Contact Information */}
          <div className="space-y-3 mb-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Official Contact
            </h2>

            <div className="space-y-2.5 text-xs">
              {employee.officialPhone && (
                <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-400">Phone</span>
                  <a
                    href={`tel:${employee.officialPhone}`}
                    className="font-semibold text-white hover:text-indigo-300 transition font-mono"
                  >
                    {employee.officialPhone}
                  </a>
                </div>
              )}

              {employee.officialEmail && (
                <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-400">Email</span>
                  <a
                    href={`mailto:${employee.officialEmail}`}
                    className="font-semibold text-white hover:text-indigo-300 transition"
                  >
                    {employee.officialEmail}
                  </a>
                </div>
              )}

              {employee.whatsappNumber && (
                <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-400">WhatsApp</span>
                  <a
                    href={`https://wa.me/${sanitizedWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-400 hover:underline font-mono"
                  >
                    {employee.whatsappNumber}
                  </a>
                </div>
              )}

              {employee.officeAddress && (
                <div className="flex items-start justify-between py-1 border-b border-white/5 last:border-0 gap-4">
                  <span className="text-slate-400 shrink-0 flex items-center gap-1">
                    <MapPin className="size-3.5 text-slate-500" />
                    <span>Office</span>
                  </span>
                  <span className="text-right text-slate-300 font-medium">
                    {employee.officeAddress}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Social Media & Online Profiles */}
          {employee.socialMediaLinks && employee.socialMediaLinks.length > 0 && (
            <div className="space-y-3 mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Online Profiles & Links
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {employee.socialMediaLinks.map((link: SocialMediaLink, i: number) => {
                  const safeHref = getSafeExternalUrl(link.url);
                  const displayName = getPlatformDisplayName(link);
                  return (
                    <a
                      key={link.id || i}
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-400/40 text-xs font-semibold text-slate-200 transition group shadow-xs"
                    >
                      <SocialMediaIcon
                        platform={link.platform}
                        className="size-4 shrink-0 transition-transform group-hover:scale-110"
                      />
                      <span className="truncate flex-1">{displayName}</span>
                      <ExternalLink className="size-3 text-slate-500 group-hover:text-slate-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Contact Primary Button */}
          <div className="space-y-2">
            <button
              onClick={handleDownloadContact}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
            >
              <Download className="size-4" />
              <span>Save Contact to Phone (.vcf)</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-full h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="size-3.5 text-indigo-400" />
              <span>Scan or View QR Code</span>
            </button>
          </div>

          {/* Footer Branding */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-indigo-400" />
              Pakiza Software
            </span>
            <span>CRIPTON HRIS v3.0</span>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
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
            <div className="flex justify-center">
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
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shrink-0"
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
                className="flex-1 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="size-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
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
