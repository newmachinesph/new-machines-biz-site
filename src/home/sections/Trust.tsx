import { HOME_COPY } from "../copy";
import { SectionCell, SplitCell } from "../Frame";
import { DecisionRail } from "../mockups/DecisionRail";
import { MockupStage } from "../mockups/MockupStage";
import { SectionHeader } from "../SectionHeader";

export function Trust() {
  const { eyebrow, lead, sub } = HOME_COPY.trust;
  return (
    <SectionCell dark labelledBy="trust-title">
      <SplitCell
        dark
        textSide="left"
        text={<SectionHeader id="trust-title" ariaLabel={lead} eyebrow={eyebrow} lead={lead.split(". ").map((clause, i) => <span className="trust-clause" key={clause}>{clause.endsWith(".") ? clause : clause + "."}{i < 2 ? " " : null}</span>)} sub={sub} className="trust-heading" dark />}
        visual={
          <MockupStage dark presentation="scene">
            <DecisionRail />
          </MockupStage>
        }
      />
    </SectionCell>
  );
}
