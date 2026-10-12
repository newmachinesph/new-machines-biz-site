"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { Field, controlClass, fieldDescribedBy } from "./Field";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({
  label, hint, error, placeholder, options, className, value, defaultValue, onValueChange, name, disabled,
}: SelectProps) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <BaseSelect.Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (typeof next === "string") onValueChange?.(next);
        }}
        name={name}
        disabled={disabled}
      >
        <BaseSelect.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(id, hint, error)}
          className={cn(controlClass, "inline-flex items-center justify-between gap-2 data-[placeholder]:text-grey-500")}
        >
          <BaseSelect.Value>{(v: string | null) => (v ? options.find((o) => o.value === v)?.label : placeholder)}</BaseSelect.Value>
          <BaseSelect.Icon aria-hidden="true" className="text-grey-500">▾</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50 outline-hidden">
            <BaseSelect.Popup className="min-w-[var(--anchor-width)] rounded-md border border-grey-200 bg-paper p-1 shadow-md outline-hidden">
              <BaseSelect.List>
                {options.map((o) => (
                  <BaseSelect.Item
                    key={o.value}
                    value={o.value}
                    className="cursor-default rounded-sm px-2 py-1.5 text-sm outline-hidden data-[highlighted]:bg-grey-100 data-[selected]:font-medium"
                  >
                    <BaseSelect.ItemText>{o.label}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </Field>
  );
}
