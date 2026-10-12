import Image from "next/image";
import { MOTORSPORT_EXPERIMENT } from "./motorsport-config";

/** A decorative brand experiment. It does not claim a current racing affiliation. */
export function MotorsportAccent() {
  if (!MOTORSPORT_EXPERIMENT.enabled) return null;
  return (
    <div className="motorsport-accent" data-placement={MOTORSPORT_EXPERIMENT.placement} aria-hidden="true">
      <span className="motorsport-rule" />
      <Image
        src={`/experiments/nm-01-top-${MOTORSPORT_EXPERIMENT.variant}.svg`}
        width={1600}
        height={610}
        alt=""
        className="motorsport-car"
      />
      <span className="motorsport-rule" />
    </div>
  );
}
