import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { reduced } = vi.hoisted(() => ({ reduced: { value: true as boolean | null } }));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reduced.value,
}));

import { useMotionAllowed } from "./useMotionAllowed";

describe("useMotionAllowed", () => {
  it("is false when reduced motion is requested", () => {
    reduced.value = true;
    const { result } = renderHook(() => useMotionAllowed());
    expect(result.current).toBe(false);
  });

  it("is true after mount when motion is allowed", async () => {
    reduced.value = false;
    const { result } = renderHook(() => useMotionAllowed());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("is false while the preference is unknown", () => {
    reduced.value = null;
    const { result } = renderHook(() => useMotionAllowed());
    expect(result.current).toBe(false);
  });
});
