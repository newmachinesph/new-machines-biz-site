"use client";

import { PreviewCard as BasePreviewCard } from "@base-ui-components/react/preview-card";
import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useResolvedElement } from "@/lib/useResolvedElement";

export type PreviewCardProps = {
  /** A single focusable element that can take a ref (e.g. a <button>) - Base UI renders it as the trigger. */
  trigger: ReactElement<Record<string, unknown>>;
  /** What the card shows, in words: the trigger's accessible description, available while the card is closed. */
  description: string;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
};

const enterExit = "transition-[opacity,transform] duration-150 motion-reduce:transition-none data-[starting-style]:opacity-0 data-[starting-style]:translate-y-1 data-[ending-style]:opacity-0";

/** Supporting detail on hover or keyboard focus. A tap, Enter or Space (or a screen reader's click) toggles it. Read-only content, so it never traps focus. */
export function PreviewCard({ trigger, description, children, onOpenChange, side = "bottom", className }: PreviewCardProps) {
  const triggerElement = useResolvedElement(trigger);
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Report real transitions only, so a caller counting open cards (e.g. to hold an animation) stays balanced.
  const openRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => { onOpenChangeRef.current = onOpenChange; });
  const change = (next: boolean) => { if (openRef.current === next) return; openRef.current = next; setOpen(next); onOpenChangeRef.current?.(next); };
  // Unmounting while open (e.g. the scene moves on) still reports the close.
  useEffect(() => () => { if (openRef.current) onOpenChangeRef.current?.(false); }, []);
  // Touch has no hover: remember whether the card was open when the tap began, so the tap toggles it even if focus opened it first.
  const tap = useRef<{ touch: boolean; wasOpen: boolean }>({ touch: false, wasOpen: false });
  return (
    <BasePreviewCard.Root open={open} onOpenChange={(next) => change(next)}>
      <BasePreviewCard.Trigger
        render={triggerElement}
        delay={200}
        closeDelay={120}
        aria-expanded={open}
        aria-describedby={descriptionId}
        onPointerDown={(event) => { tap.current = { touch: event.pointerType === "touch", wasOpen: open }; }}
        onClick={(event) => {
          // event.detail is 0 for Enter, Space and assistive-technology clicks; a mouse click leaves hover in charge.
          if (event.detail === 0) { event.preventDefault(); change(!open); return; }
          if (!tap.current.touch) return;
          event.preventDefault();
          change(!tap.current.wasOpen);
        }}
      />
      {mounted ? createPortal(<span id={descriptionId} hidden>{description}</span>, document.body) : null}
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner side={side} sideOffset={8} collisionPadding={16} className="z-50">
          <BasePreviewCard.Popup className={cn("max-w-[calc(100vw-32px)] rounded-lg border border-grey-200 bg-paper p-3 shadow-md outline-hidden", enterExit, className)}>
            {children}
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
}
