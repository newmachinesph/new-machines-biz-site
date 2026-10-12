import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => null,
}));

import { MotionItem } from "./MotionItem";

describe("MotionItem when the motion preference is unknown", () => {
  it("keeps content visible before the motion preference is known", () => {
    render(<MotionItem><p>Hi</p></MotionItem>);
    const wrap = screen.getByText("Hi").parentElement as HTMLElement;
    expect(wrap.style.opacity).not.toBe("0");
    expect(screen.getByText("Hi")).toBeVisible();
  });
});
