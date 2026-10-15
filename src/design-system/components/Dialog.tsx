"use client";

import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { forwardRef, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useResolvedElement } from "@/lib/useResolvedElement";

export type DialogProps = {
  /** A single element that can take a ref (e.g. <Button>) - Base UI renders it as the trigger. */
  trigger: ReactElement<Record<string, unknown>>;
  title: string;
  description?: string;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const enterExit = "transition-[opacity,transform] duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0";

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { trigger, title, description, children, open, onOpenChange, className },
  ref,
) {
  const triggerElement = useResolvedElement(trigger);
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}>
      <BaseDialog.Trigger render={triggerElement} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={cn("fixed inset-0 z-40 bg-ink/40", enterExit)} />
        <BaseDialog.Popup
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-grey-200 bg-paper p-6 shadow-md outline-hidden",
            enterExit,
            className,
          )}
        >
          <BaseDialog.Title className="text-lg font-semibold text-ink">{title}</BaseDialog.Title>
          {description ? (
            <BaseDialog.Description className="mt-1 text-sm text-grey-500">{description}</BaseDialog.Description>
          ) : null}
          <div className="mt-4 text-sm text-grey-700">{children}</div>
          <BaseDialog.Close
            aria-label="Close"
            className="absolute right-3 top-3 rounded-sm p-1 text-grey-500 hover:bg-grey-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
          >
            ×
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
});
