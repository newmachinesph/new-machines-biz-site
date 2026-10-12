import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionItem } from "./MotionItem";

describe("MotionItem", () => {
  it("keeps content visible under reduced motion (test default)", () => {
    render(<MotionItem className="wrap" rise><p>Hello</p></MotionItem>);
    const wrap = screen.getByText("Hello").parentElement as HTMLElement;
    expect(wrap).toHaveClass("wrap");
    expect(wrap).toBeVisible();
    expect(wrap.style.opacity).not.toBe("0");
  });
});
