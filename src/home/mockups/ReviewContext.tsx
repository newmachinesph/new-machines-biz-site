"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "../Icon";
import { ApprovalLog, ScopedPermissions } from "./HumanWork";

const query = "(min-width: 1024px)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getDesktop = () => window.matchMedia(query).matches;
const getServerDesktop = () => false;

export function ReviewContext() {
  const desktop = useSyncExternalStore(subscribe, getDesktop, getServerDesktop);
  return (
    <div className="human-work-context">
      <details className="review-context-disclosure" open={desktop}><summary>Permissions for this review<Icon name="plus" /></summary><div className="review-side-content"><ScopedPermissions /></div></details>
      <details className="review-context-disclosure" open={desktop}><summary>The approval history<Icon name="plus" /></summary><div className="review-side-content"><ApprovalLog /></div></details>
    </div>
  );
}
