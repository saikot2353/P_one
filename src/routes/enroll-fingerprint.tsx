import { useState, useCallback } from "react";
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
  // Load saved fingerprint metadata from localStorage on mount
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

  // Persist fingerprint list to localStorage whenever it changes
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

      // REGISTER a new passkey — this triggers the real Mac Touch ID prompt
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "CRIPTON HRIS",
            id: window.location.hostname,
          },
          user: {
            // Use a unique user ID per finger so multiple can be enrolled
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: `shapno@cripton.com`,
            displayName: "Shapno",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },   // ES256 (preferred)
            { alg: -257, type: "public-key" },  // RS256 (fallback)
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Touch ID / Windows Hello only
            userVerification: "required",        // Biometric mandatory
            residentKey: "discouraged",          // Device-bound only — no passkey picker
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (!credential) throw new Error("No credential returned.");

      // Store the credential ID so login can reference it
      const credId = Array.from(new Uint8Array(credential.rawId));
      const storedCreds: number[][] = JSON.parse(localStorage.getItem("cripton_webauthn_creds") ?? "[]");
      storedCreds.push(credId);
      localStorage.setItem("cripton_webauthn_creds", JSON.stringify(storedCreds));
      localStorage.setItem("cripton_webauthn_enrolled", "true");

      // Success — sensor was touched and passkey created
      setScanResult("success");
      const fpId = `fp${Date.now()}`;
      const label = `Finger ${fingerprints.length + 1}`;
      const newEntry: SavedFingerprint = {
        id: fpId,
        label,
        addedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      };

      setTimeout(() => {
        saveFpList([...fingerprints, newEntry]);
        setScanResult("idle");
        setScanning(false);
        toast.success(`${label} registered with Touch ID!`);
      }, 800);
    } catch (err: unknown) {
      const name = (err as DOMException)?.name ?? "";
      if (name === "NotAllowedError") {
        // User explicitly cancelled the Touch ID prompt
        setScanResult("idle");
        setScanning(false);
        toast.error("Touch ID was cancelled.");
        return;
      }
      // Other errors — sensor exists but passkey creation failed (e.g. already registered)
      setScanResult("failed");
      setTimeout(() => { setScanResult("idle"); setScanning(false); }, 1500);
      console.error("WebAuthn create error:", err);
      toast.error(`Could not enroll fingerprint: ${name || "Unknown error"}`);
    }
  }, [scanning, fingerprints]);

  const deleteFingerprint = (id: string, label: string) => {
    const updated = fingerprints.filter((f) => f.id !== id);
    saveFpList(updated);
    if (updated.length === 0) {
      localStorage.removeItem("cripton_webauthn_enrolled");
    }
    toast.success(`${label} removed.`);
  };

  const saveLabel = (id: string) => {
    saveFpList(fingerprints.map((f) => (f.id === id ? { ...f, label: editLabel.trim() || f.label } : f)));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-10">
          {/* Header */}
          <div className="w-full max-w-md mb-6">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span className="text-foreground">Fingerprints</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Touch ID Fingerprints</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add fingerprints to use Touch ID for quick login.
            </p>
          </div>

          {/* Main card */}
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xs overflow-hidden">

            {/* Scanner area */}
            <div className="flex flex-col items-center py-10 px-6 border-b border-border/60 bg-muted/20">
              <style>{`
                @keyframes scanPulse {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
                  50% { box-shadow: 0 0 0 16px rgba(59,130,246,0.1); }
                }
                @keyframes laserSweep {
                  0% { top: 0%; opacity:0; }
                  8% { opacity:1; }
                  92% { opacity:1; }
                  100% { top:100%; opacity:0; }
                }
                .fp-laser {
                  position: absolute; left: 0; right: 0; height: 2px;
                  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
                  box-shadow: 0 0 8px #3b82f6;
                  animation: laserSweep 1.5s linear infinite;
                }
              `}</style>

              <button
                onClick={addFingerprint}
                disabled={scanning}
                className="relative size-32 rounded-full flex items-center justify-center border-2 transition-all duration-300 overflow-hidden cursor-pointer active:scale-95 disabled:cursor-wait"
                style={{
                  borderColor:
                    scanResult === "success"
                      ? "#10b981"
                      : scanResult === "failed"
                        ? "#ef4444"
                        : scanResult === "scanning"
                          ? "var(--primary)"
                          : "var(--border)",
                  background:
                    scanResult === "success"
                      ? "rgba(16,185,129,0.06)"
                      : scanResult === "failed"
                        ? "rgba(239,68,68,0.06)"
                        : scanResult === "scanning"
                          ? "rgba(59,130,246,0.06)"
                          : "var(--muted)",
                  animation: scanResult === "scanning" ? "scanPulse 1.5s ease-in-out infinite" : "none",
                }}
              >
                {/* Laser sweep */}
                {scanResult === "scanning" && <div className="fp-laser" />}

                {scanResult === "success" ? (
                  <CheckCircle2 className="size-14 text-emerald-500" />
                ) : scanResult === "failed" ? (
                  <XCircle className="size-14 text-red-500" />
                ) : (
                  <Fingerprint
                    className="size-14 transition-all duration-300"
                    style={{
                      color: scanResult === "scanning" ? "var(--primary)" : "var(--muted-foreground)",
                      opacity: scanResult === "scanning" ? 0.7 : 0.5,
                      filter: scanResult === "scanning" ? "drop-shadow(0 0 8px rgba(59,130,246,0.4))" : "none",
                    }}
                  />
                )}
              </button>

              <p className="mt-5 text-sm font-semibold text-center">
                {scanResult === "scanning" && (
                  <span className="text-primary animate-pulse">Place your finger on the sensor…</span>
                )}
                {scanResult === "success" && (
                  <span className="text-emerald-500">Fingerprint captured!</span>
                )}
                {scanResult === "failed" && (
                  <span className="text-red-500">Could not read fingerprint. Try again.</span>
                )}
                {scanResult === "idle" && (
                  <span className="text-muted-foreground">Tap to add a fingerprint</span>
                )}
              </p>
            </div>

            {/* Fingerprint list */}
            <div>
              {fingerprints.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No fingerprints added yet.
                </div>
              )}

              {fingerprints.map((fp, idx) => (
                <div
                  key={fp.id}
                  className="flex items-center gap-3 px-5 py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
                >
                  <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="size-4 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingId === fp.id ? (
                      <input
                        autoFocus
                        className="w-full text-sm font-semibold bg-transparent border-b border-primary outline-none py-0.5"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onBlur={() => saveLabel(fp.id)}
                        onKeyDown={(e) => e.key === "Enter" && saveLabel(fp.id)}
                      />
                    ) : (
                      <button
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-text text-left"
                        onClick={() => { setEditingId(fp.id); setEditLabel(fp.label); }}
                      >
                        {fp.label}
                      </button>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">Added {fp.addedAt}</p>
                  </div>

                  {/* Security check */}
                  <ShieldCheck className="size-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <button
                    onClick={() => deleteFingerprint(fp.id, fp.label)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              <button
                onClick={addFingerprint}
                disabled={scanning}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="size-4 text-primary" />
                </div>
                Add a Fingerprint…
              </button>
            </div>
          </div>

          {/* Info note */}
          <p className="mt-4 text-[11px] text-muted-foreground/70 text-center max-w-xs font-medium">
            Tap the fingerprint sensor or the "Add" button. Your biometric data stays on this device and is never sent to any server.
          </p>
        </div>
      </main>
    </div>
  );
}
