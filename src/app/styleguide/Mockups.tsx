import { DecisionRail } from "@/home/mockups/DecisionRail";
import { HeroDashboard } from "@/home/mockups/HeroDashboard";
import { ApprovalLog, ReviewerTask, ScopedPermissions } from "@/home/mockups/HumanWork";
import { MarketplaceGrid } from "@/home/mockups/MarketplaceGrid";
import { SandboxRun } from "@/home/mockups/SandboxRun";
import { SpendControl } from "@/home/mockups/SpendControl";

const MOCKUPS = [
  ["HeroDashboard", <HeroDashboard key="HeroDashboard" />],
  ["MarketplaceGrid", <MarketplaceGrid key="MarketplaceGrid" />],
  ["SandboxRun", <SandboxRun key="SandboxRun" />],
  ["DecisionRail", <DecisionRail key="DecisionRail" />],
  ["ReviewerTask", <ReviewerTask key="ReviewerTask" />],
  ["ScopedPermissions", <ScopedPermissions key="ScopedPermissions" />],
  ["ApprovalLog", <ApprovalLog key="ApprovalLog" />],
  ["SpendControl", <SpendControl key="SpendControl" />],
] as const;

/** Every home-page mockup at full size, so they can be reviewed without scrolling the page. */
export function Mockups() {
  return (
    <div className="flex flex-col gap-10">
      {MOCKUPS.map(([name, element]) => (
        <section key={name} aria-label={name}>
          <p className="mb-3 font-mono text-xs text-grey-500">{name} · demo data</p>
          <div className={name === "DecisionRail" ? "rounded-lg bg-grey-900 p-6" : "rounded-lg bg-grey-50 p-6"}>{element}</div>
        </section>
      ))}
    </div>
  );
}
