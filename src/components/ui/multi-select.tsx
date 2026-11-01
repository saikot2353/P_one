import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
  popoverClassName,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.value));
    }
  };

  const handleSelect = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between min-h-10 py-1.5 px-3 rounded-xl bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all text-foreground cursor-pointer hover:border-primary/50 text-left",
            className,
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5 flex-1 pr-2">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selected.slice(0, maxDisplay).map((val) => {
                  const label = options.find((o) => o.value === val)?.label || val;
                  return (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[11px] font-medium leading-tight max-w-[140px]"
                      title={label}
                    >
                      <span className="truncate">{label}</span>
                    </span>
                  );
                })}
                {selected.length > maxDisplay && (
                  <span className="inline-flex items-center bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-[11px] font-medium leading-tight shrink-0">
                    +{selected.length - maxDisplay} more
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 text-muted-foreground mt-0.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0 shadow-xl border-border/50 rounded-xl overflow-hidden z-[150]", popoverClassName)}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9 text-xs" />
          <CommandList className="max-h-[220px]">
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No results found.
            </CommandEmpty>
            <CommandGroup className="p-1">
              <CommandItem
                value="selectAll"
                onSelect={handleSelectAll}
                className="text-xs font-semibold rounded-lg cursor-pointer data-[selected=true]:bg-muted/50 data-[selected=true]:text-foreground my-0.5"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selected.length === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                Select All
              </CommandItem>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      handleSelect(option.value);
                    }}
                    className="text-xs rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary my-0.5"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
