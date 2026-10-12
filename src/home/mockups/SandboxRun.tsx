"use client";

import { useState } from "react";
import { Badge } from "@/design-system/components/Badge";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { AgentPortrait } from "./AgentPortrait";
import { ExampleBrand } from "../ExampleBrand";

export function SandboxRun({ className }: { className?: string }) {
  const [scenario, setScenario] = useState<"success" | "exception">("exception");
  const exception = scenario === "exception";
  return (
    <div className={cn("sandbox-comparison", className)}>
      <div className="scenario-switch" role="group" aria-label="Choose a sandbox scenario">
        <button type="button" aria-pressed={!exception} onClick={() => setScenario("success")}>Success case<span>01</span></button>
        <button type="button" aria-pressed={exception} onClick={() => setScenario("exception")}>Exception case<span>02</span></button>
      </div>
      <div className="comparison-body">
        <div className="invoice-preview">
          <div className="invoice-letterhead"><ExampleBrand name="aster-supply" className="supplier-symbol" /><div><strong>Aster Supply</strong><span>Tokyo, Japan</span></div><span lang="ja">請求書</span></div>
          <div className="invoice-reference"><span>Invoice</span><strong>INV-2291</strong><small>Issued 11 Oct 2026</small></div>
          <div className="invoice-client"><span className="scene-kicker">Bill to</span><p>Sumnora<br />Finance & procurement</p></div>
          <table className="invoice-lines"><caption className="sr-only">Synthetic supplier invoice</caption><thead><tr><th scope="col">Description</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Operations services</td><td>¥1,167,273</td></tr><tr className={exception ? "invoice-exception-line" : undefined} data-accent={exception ? "human" : undefined}><td>Consumption tax</td><td>{exception ? "¥116,727" : "¥115,527"}</td></tr></tbody></table>
          <div className="invoice-total"><span>Total due</span><strong>{exception ? "¥1,284,000" : "¥1,282,800"}</strong></div>
          <div className="invoice-file"><Icon name="file" /><span>invoice_2291.pdf</span><span>1 page</span></div>
        </div>
        <div className="comparison-results">
          <div className="comparison-agent"><AgentPortrait kind="invoice" /><div><strong>Invoice matcher</strong><span>Sandbox · synthetic inputs</span></div></div>
          <div className="comparison-state"><Badge status={exception ? "waiting-for-human" : "verified"}>{exception ? "Needs human" : "Verified"}</Badge><h3>{exception ? "One detail needs a decision." : "The numbers agree."}</h3><p>{exception ? "The invoice and purchase order match, apart from the tax line." : "The invoice agrees with the purchase order. The evidence is ready to inspect."}</p></div>
          <div className="field-comparison"><div><span className="scene-kicker">Tax amount</span><span className="scene-kicker">Source</span></div><div><strong>{exception ? "¥116,727" : "¥115,527"}</strong><span>Supplier invoice</span></div><div><strong>¥115,527</strong><span>Purchase order</span></div></div>
          {exception ? <div className="difference-note" data-accent="human"><span>¥1,200 difference</span><p>Paused for a qualified reviewer. The agent cannot approve this exception.</p></div> : <div className="match-note"><Icon name="check" /><p>Matching complete.<br /><span>No exceptions found.</span></p></div>}
          <div className="sandbox-result-footer"><Icon name="shield" /><span>{exception ? "No settlement until review" : "Evidence attached to the run"}</span></div>
        </div>
      </div>
      <div className="sandbox-comparison-footer"><span>Synthetic data only</span><span>Estimated run <strong>¥120</strong></span></div>
    </div>
  );
}
