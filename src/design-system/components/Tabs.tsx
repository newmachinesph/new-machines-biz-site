"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { value: string; label: string; content: ReactNode };

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

// `outline-hidden` (not `outline-none`) keeps Tailwind v4's focus-visible outline utilities working.
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function Tabs({ items, className, defaultValue, value, onValueChange }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange?.(next);
      }}
      className={className}
    >
      {/* activateOnFocus: arrow keys both move focus and select, as the old Radix tabs did. */}
      <BaseTabs.List activateOnFocus className="flex gap-6 border-b border-grey-200">
        {items.map((t) => (
          <BaseTabs.Tab
            key={t.value}
            value={t.value}
            className={cn(
              "-mb-px border-b-2 border-transparent pb-2 text-sm text-grey-500 outline-hidden transition-colors duration-150",
              "hover:text-ink",
              focusRing,
              "data-[active]:border-ink data-[active]:text-ink",
            )}
          >
            {t.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((t) => (
        <BaseTabs.Panel key={t.value} value={t.value} className={cn("pt-4 outline-hidden", focusRing)}>
          {t.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
