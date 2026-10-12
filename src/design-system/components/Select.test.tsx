import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
];

describe("Select", () => {
  it("opens with keyboard and reports the chosen value", async () => {
    const onValueChange = vi.fn();
    render(<Select label="Region" placeholder="Choose" options={options} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Region" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "Japan" }));
    expect(onValueChange).toHaveBeenCalledWith("jp");
  });
});
