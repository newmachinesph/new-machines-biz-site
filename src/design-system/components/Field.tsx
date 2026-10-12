"use client";

import { Field as BaseField } from "@base-ui-components/react/field";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** ids of the hint/error messages, for the control's aria-describedby. Explicit so tests and
 *  screen readers do not depend on Base UI internals. */
export function fieldDescribedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <BaseField.Root invalid={Boolean(error)} className={cn("flex flex-col gap-1.5", className)}>
      <BaseField.Label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </BaseField.Label>
      {children}
      {hint ? (
        <BaseField.Description id={`${id}-hint`} className="text-xs text-grey-500">
          {hint}
        </BaseField.Description>
      ) : null}
      {error ? (
        <BaseField.Error id={`${id}-error`} match role="alert" className="text-xs text-blocked">
          {error}
        </BaseField.Error>
      ) : null}
    </BaseField.Root>
  );
}

export const controlClass =
  "h-10 w-full rounded-md border border-grey-300 bg-paper px-3 text-sm text-ink placeholder:text-grey-500 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
  "aria-[invalid=true]:border-blocked disabled:cursor-not-allowed disabled:bg-grey-50";
