import { HOME_COPY } from "../copy";
import { SectionCell, SplitCell } from "../Frame";
import { MarketplaceGrid } from "../mockups/MarketplaceGrid";
import { MockupStage } from "../mockups/MockupStage";
import { SectionHeader } from "../SectionHeader";

export function Hire() {
  const { eyebrow, lead, tail, sub } = HOME_COPY.hire;
  return (
    <SectionCell labelledBy="hire-title">
      <SplitCell
        textSide="left"
        text={<SectionHeader id="hire-title" eyebrow={eyebrow} lead={lead} tail={tail} sub={sub} />}
        visual={
          <MockupStage presentation="scene">
            <MarketplaceGrid />
          </MockupStage>
        }
      />
    </SectionCell>
  );
}
