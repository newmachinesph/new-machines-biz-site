import { HOME_COPY } from "../copy";
import { SectionCell, SplitCell } from "../Frame";
import { MockupStage } from "../mockups/MockupStage";
import { SandboxRun } from "../mockups/SandboxRun";
import { SectionHeader } from "../SectionHeader";

export function Sandbox() {
  const { eyebrow, lead, tail, sub } = HOME_COPY.sandbox;
  return (
    <SectionCell labelledBy="sandbox-title">
      <SplitCell
        textSide="right"
        text={<SectionHeader id="sandbox-title" eyebrow={eyebrow} lead={lead} tail={tail} sub={sub} />}
        visual={
          <MockupStage presentation="scene">
            <SandboxRun />
          </MockupStage>
        }
      />
    </SectionCell>
  );
}
