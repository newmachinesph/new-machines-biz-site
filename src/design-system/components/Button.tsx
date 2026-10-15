"use client";

import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/cn";
import { useResolvedElement } from "@/lib/useResolvedElement";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  /** Render the single child element (e.g. a Next <Link>) with the button's styling instead of a <button>. */
  asChild?: boolean;
};

const variants = {
  primary: "bg-ink text-paper hover:bg-grey-900",
  secondary: "border border-ink bg-paper text-ink hover:bg-grey-50",
  ghost: "bg-transparent text-ink hover:bg-grey-100",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
  "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, asChild = false, className, disabled, children, ...rest },
  ref,
) {
  const isDisabled = disabled || loading;
  const child = useResolvedElement(children);
  const spinner = loading ? (
    <span aria-hidden="true" className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
  ) : null;

  // With asChild the child element is what gets rendered: Base UI clones it and merges our
  // className / handlers with its own props. The child's own children win, so the spinner
  // only appears on real <button>s.
  return useRender({
    defaultTagName: "button",
    render: asChild ? (child as ReactElement<Record<string, unknown>>) : undefined,
    ref,
    props: mergeProps<"button">(
      {
        ...(asChild
          ? { "aria-disabled": isDisabled ? true : undefined, tabIndex: isDisabled ? -1 : undefined }
          : // A bare <button> defaults to submit inside forms; callers opt in with type="submit".
            { type: "button", disabled: isDisabled, children: <>{spinner}{children}</> }),
        "aria-busy": loading || undefined,
        className: cn(base, variants[variant], sizes[size], className),
      },
      rest,
    ),
  });
});
