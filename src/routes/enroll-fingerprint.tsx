import { useState, useCallback, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Fingerprint,
  Plus,
  Trash2,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lock,
  Smartphone,
  Info,
  Edit3,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/enroll-fingerprint")({
  head: () => ({
    meta: [
      { title: "Enroll Fingerprint — CRIPTON" },
      { name: "description", content: "Add or manage fingerprints for Touch ID login." },
    ],
  }),
  component: EnrollFingerprintPage,
});

interface SavedFingerprint {
  id: string;
  label: string;
  addedAt: string;
}

function EnrollFingerprintPage() {
  const [fingerprints, setFingerprints] = useState<SavedFingerprint[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cripton_fp_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));
  }, []);

  const saveFpList = (list: SavedFingerprint[]) => {
    setFingerprints(list);
    localStorage.setItem("cripton_fp_list", JSON.stringify(list));
  };

  const addFingerprint = useCallback(async () => {
    if (scanning) return;
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error("WebAuthn / Touch ID not supported in this browser.");
      return;
    }

    setScanning(true);
    setScanResult("scanning");

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "CRIPTON HRIS", id: window.location.hostname },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: "shapno@cripton.com",
            displayName: "Shapno",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "discouraged",
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (!credential) throw new Error("No credential returned.");

      const credId = Array.from(new Uint8Array(credential.rawId));
      const storedCreds: number[][] = JSON.parse(localStorage.getItem("cripton_webauthn_creds") ?? "[]");
      storedCreds.push(credId);
      localStorage.setItem("cripton_webauthn_creds", JSON.stringify(storedCreds));
      localStorage.setItem("cripton_webauthn_enrolled", "true");

      setScanResult("success");
      const label = `Finger ${fingerprints.length + 1}`;
      const newEntry: SavedFingerprint = {
        id: `fp${Date.now()}`,
        label,
        addedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      };
      setTimeout(() => {
        saveFpList([...fingerprints, newEntry]);
        setScanResult("idle");
        setScanning(false);
        toast.success(`${label} registered successfully!`);
      }, 900);
    } catch (err: unknown) {
      const name = (err as DOMException)?.name ?? "";
      setScanResult(name === "NotAllowedError" ? "idle" : "failed");
      if (name !== "NotAllowedError") {
        setTimeout(() => { setScanResult("idle"); setScanning(false); }, 1800);
      } else {
        setScanning(false);
      }
      toast.error(name === "NotAllowedError" ? "Touch ID was cancelled." : `Enrollment failed: ${name || "Unknown error"}`);
    }
  }, [scanning, fingerprints]);

  const deleteFingerprint = (id: string, label: string) => {
    const updated = fingerprints.filter((f) => f.id !== id);
    saveFpList(updated);
    if (updated.length === 0) localStorage.removeItem("cripton_webauthn_enrolled");
    toast.success(`${label} removed.`);
  };

  const saveLabel = (id: string) => {
    saveFpList(fingerprints.map((f) => (f.id === id ? { ...f, label: editLabel.trim() || f.label } : f)));
    setEditingId(null);
  };

  const scanColor =
    scanResult === "success" ? "#10b981" :
    scanResult === "failed"  ? "#ef4444" :
    scanResult === "scanning" ? "#3b82f6" : "currentColor";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <style>{`
          @keyframes laserSweep {
            0%   { top: 0%;   opacity: 0; }
            6%   { opacity: 1; }
            94%  { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes ringPulse {
            0%, 100% { transform: scale(1);   opacity: 0.3; }
            50%       { transform: scale(1.25); opacity: 0; }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.88); }
            to   { opacity: 1; transform: scale(1); }
          }
          .fp-page-enter { animation: fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
          .fp-card-enter { animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .fp-item-enter { animation: fadeSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
          .laser-bar {
            position: absolute; left: 0; right: 0; height: 2px;
            background: linear-gradient(90deg, transparent, #3b82f6 40%, #60a5fa, transparent);
            box-shadow: 0 0 14px 3px rgba(59,130,246,0.55);
            animation: laserSweep 1.6s ease-in-out infinite;
          }
          .ring-pulse {
            position: absolute; inset: -8px;
            border-radius: 50%;
            border: 2px solid #3b82f6;
            animation: ringPulse 1.4s ease-out infinite;
          }
        `}</style>

        <div
          className={`flex-1 flex flex-col items-center py-10 px-4 ${isMounted ? "fp-page-enter" : "opacity-0"}`}
        >
          {/* Breadcrumb */}
          <div className="w-full max-w-lg mb-8">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span className="text-muted-foreground/70">Security</span>
              <ChevronRight className="size-2.5" />
              <span className="text-foreground/80">Touch ID</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Touch ID &amp; Fingerprints</h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-medium">
              Manage fingerprints for passwordless login on this device.
            </p>
          </div>

          {/* Main card */}
          <div
            className={`w-full max-w-lg rounded-2xl overflow-hidden shadow-lg border border-border/80 bg-card ${isMounted ? "fp-card-enter" : "opacity-0"}`}
          >
            {/* Scanner hero */}
            <div className="relative flex flex-col items-center py-12 px-8 overflow-hidden"
              style={{
                background: scanResult === "scanning"
                  ? "radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.07) 0%, transparent 70%)"
                  : scanResult === "success"
                  ? "radial-gradient(ellipse at 50% 60%, rgba(16,185,129,0.07) 0%, transparent 70%)"
                  : "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.05) 0%, transparent 70%)",
              }}
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
                style={{ background: "var(--primary)" }} />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-5 blur-3xl pointer-events-none"
                style={{ background: "#8b5cf6" }} />

              {/* Status label */}
              <div className={`mb-6 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all duration-500 ${
                scanResult === "scanning"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/25 animate-pulse"
                  : scanResult === "success"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                  : scanResult === "failed"
                  ? "bg-red-500/10 text-red-500 border-red-500/25"
                  : "bg-muted/60 text-muted-foreground border-border/60"
              }`}>
                {scanResult === "scanning" ? "● Scanning…"
                  : scanResult === "success" ? "✓ Captured"
                  : scanResult === "failed"   ? "✗ Failed"
                  : fingerprints.length === 0 ? "No fingerprints"
                  : `${fingerprints.length} fingerprint${fingerprints.length > 1 ? "s" : ""} enrolled`}
              </div>

              {/* Fingerprint button */}
              <button
                onClick={addFingerprint}
                disabled={scanning}
                title="Tap to add a fingerprint"
                className="relative group cursor-pointer active:scale-95 transition-transform duration-150 disabled:cursor-wait select-none"
              >
                {/* Pulsing rings when scanning */}
                {scanResult === "scanning" && (
                  <>
                    <div className="ring-pulse" style={{ animationDelay: "0s" }} />
                    <div className="ring-pulse" style={{ animationDelay: "0.5s" }} />
                  </>
                )}

                {/* Main circle */}
                <div
                  className="relative size-36 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500"
                  style={{
                    background: scanResult === "scanning"
                      ? "rgba(59,130,246,0.08)"
                      : scanResult === "success"
                      ? "rgba(16,185,129,0.08)"
                      : scanResult === "failed"
                      ? "rgba(239,68,68,0.08)"
                      : "var(--muted)",
                    border: `2px solid ${scanResult === "idle" ? "var(--border)" : scanColor}`,
                    boxShadow: scanResult !== "idle"
                      ? `0 0 0 6px ${scanColor}18, 0 8px 32px ${scanColor}30`
                      : "0 4px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Laser sweep */}
                  {scanResult === "scanning" && <div className="laser-bar" />}

                  {scanResult === "success" ? (
                    <CheckCircle2 className="size-16 transition-all duration-500" style={{ color: scanColor, filter: `drop-shadow(0 0 12px ${scanColor}80)` }} />
                  ) : scanResult === "failed" ? (
                    <XCircle className="size-16 transition-all duration-500" style={{ color: scanColor }} />
                  ) : (
                    <Fingerprint
                      className="size-16 transition-all duration-500"
                      style={{
                        color: scanResult === "scanning" ? scanColor : "var(--muted-foreground)",
                        opacity: scanResult === "scanning" ? 0.6 : 0.4,
                        filter: scanResult === "scanning" ? `drop-shadow(0 0 10px ${scanColor}90)` : "none",
                      }}
                    />
                  )}
                </div>

                {/* Plus badge (idle only) */}
                {scanResult === "idle" && (
                  <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Plus className="size-4 text-white" />
                  </div>
                )}
              </button>

              {/* Instruction text */}
              <p className="mt-7 text-sm font-semibold text-center transition-all duration-300"
                style={{ color: scanResult !== "idle" ? scanColor : "var(--muted-foreground)" }}>
                {scanResult === "scanning" && "Place your finger on the Touch ID sensor…"}
                {scanResult === "success"  && "Fingerprint captured successfully!"}
                {scanResult === "failed"   && "Could not read fingerprint. Please try again."}
                {scanResult === "idle"     && "Tap the icon to add a new fingerprint"}
              </p>
              {scanResult === "idle" && (
                <p className="mt-1 text-[11px] text-muted-foreground/60 font-medium">
                  Your Mac's Touch ID sensor will activate
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-border/60 mx-0" />

            {/* Fingerprint list */}
            <div className="divide-y divide-border/50">
              {fingerprints.length === 0 && (
                <div className="py-10 flex flex-col items-center text-center px-8 gap-2">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-1">
                    <Fingerprint className="size-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground">No fingerprints enrolled</p>
                  <p className="text-[11px] text-muted-foreground/60 font-medium">Tap the sensor icon above to add your first fingerprint.</p>
                </div>
              )}

              {fingerprints.map((fp, idx) => (
                <div
                  key={fp.id}
                  className="fp-item-enter flex items-center gap-4 px-6 py-4 group hover:bg-muted/25 transition-colors"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Icon */}
                  <div className="size-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="size-5 text-primary" />
                  </div>

                  {/* Label + date */}
                  <div className="flex-1 min-w-0">
                    {editingId === fp.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          className="flex-1 text-sm font-bold bg-transparent border-b-2 border-primary outline-none pb-0.5 text-foreground"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onBlur={() => saveLabel(fp.id)}
                          onKeyDown={(e) => e.key === "Enter" && saveLabel(fp.id)}
                        />
                        <button onClick={() => saveLabel(fp.id)} className="p-1 rounded-md hover:bg-primary/10 text-primary transition-colors">
                          <Check className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(fp.id); setEditLabel(fp.label); }}
                        className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors group/label"
                      >
                        {fp.label}
                        <Edit3 className="size-3 opacity-0 group-hover/label:opacity-40 transition-opacity" />
                      </button>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-medium">Registered {fp.addedAt}</p>
                  </div>

                  {/* Status badge */}
                  <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck className="size-3.5" />
                    Active
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => deleteFingerprint(fp.id, fp.label)}
                    className="p-2 rounded-xl hover:bg-red-500/8 text-muted-foreground/40 hover:text-red-500 transition-all duration-200 active:scale-90"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}

              {/* Add more row */}
              <button
                onClick={addFingerprint}
                disabled={scanning}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors disabled:opacity-50 group"
              >
                <div className="size-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/12 transition-colors">
                  <Plus className="size-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-primary">Add a Fingerprint…</span>
              </button>
            </div>
          </div>

          {/* Info chips */}
          <div className="w-full max-w-lg mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Lock, label: "Encrypted", desc: "Stored in Secure Enclave" },
              { icon: Smartphone, label: "Device-only", desc: "Never sent to servers" },
              { icon: ShieldCheck, label: "Instant login", desc: "Replaces your password" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/60 shadow-xs">
                <div className="size-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="size-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground/70 font-medium mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chrome tip */}
          <div className="w-full max-w-lg mt-3 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Info className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold leading-relaxed">
              <strong>Chrome on Mac tip:</strong> If a passkey picker appears, choose <strong>"iCloud Keychain"</strong> — it will then prompt Touch ID directly. For the best experience use <strong>Safari</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
