import { Plus, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type RoundSlab = {
  id: string;
  fromMin: number;
  toMin: number;
  otHour: number;
};

export const uid = () => Math.random().toString(36).slice(2, 10);

type Props = {
  slabs: RoundSlab[];
  onChange: (slabs: RoundSlab[]) => void;
  disabled?: boolean;
};

export function RoundSlotBuilder({ slabs, onChange, disabled }: Props) {
  const update = (id: string, patch: Partial<RoundSlab>) =>
    onChange(slabs.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const add = () => {
    const last = slabs[slabs.length - 1];
    const from = last ? last.toMin + 1 : 0;
    onChange([...slabs, { id: uid(), fromMin: from, toMin: from + 9, otHour: 0 }]);
  };

  const overlaps = (s: RoundSlab, i: number) =>
    s.toMin < s.fromMin || slabs.some((o, j) => j < i && s.fromMin <= o.toMin && s.toMin >= o.fromMin);

  return (
    <div className="rounded-lg border border-border bg-muted/40">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Round Slabs</p>
            <p className="text-xs text-muted-foreground">
              Define a minute range, then the OT hour granted for that range.
            </p>
          </div>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={add} disabled={disabled}>
          <Plus className="size-4" /> Add Slab
        </Button>
      </div>

      {slabs.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          No slab added yet. Add a slab like <span className="font-medium text-foreground">0 – 49 min → 0 hour</span>.
        </p>
      ) : (
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>From (min)</span>
            <span>To (min)</span>
            <span>OT Hour</span>
            <span className="w-9" />
          </div>
          {slabs.map((s, i) => {
            const bad = overlaps(s, i);
            return (
              <div key={s.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 px-4 py-2.5">
                <Input
                  type="number"
                  min={0}
                  value={s.fromMin}
                  disabled={disabled}
                  aria-invalid={bad}
                  onChange={(e) => update(s.id, { fromMin: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  min={0}
                  value={s.toMin}
                  disabled={disabled}
                  aria-invalid={bad}
                  onChange={(e) => update(s.id, { toMin: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  min={0}
                  step="0.5"
                  value={s.otHour}
                  disabled={disabled}
                  onChange={(e) => update(s.id, { otHour: Number(e.target.value) })}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  disabled={disabled}
                  onClick={() => onChange(slabs.filter((x) => x.id !== s.id))}
                  aria-label="Remove slab"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {slabs.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {slabs.map((s) => (
            <span
              key={s.id}
              className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {s.fromMin}–{s.toMin} min → {s.otHour} h
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function parseRoundSlots(str?: string): RoundSlab[] {
  if (!str) return [];
  return str.split("#").filter(Boolean).map((chunk) => {
    const [range, val] = chunk.split(",");
    const [fromStr, toStr] = range.split("-");
    return {
      id: uid(),
      fromMin: Number(fromStr) || 0,
      toMin: Number(toStr) || 0,
      otHour: Number(val) || 0,
    };
  });
}

export function serializeRoundSlots(slabs: RoundSlab[]): string {
  return slabs.map((s) => `${s.fromMin}-${s.toMin},${s.otHour}`).join("#");
}
