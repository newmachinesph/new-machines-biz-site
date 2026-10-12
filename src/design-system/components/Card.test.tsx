import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardBody, CardHeader, CardTitle } from "./Card";

describe("Card", () => {
  it("renders a bordered surface with a heading", () => {
    render(
      <Card data-testid="card">
        <CardHeader><CardTitle>AI Agents</CardTitle></CardHeader>
        <CardBody>Versioned, evaluated capabilities.</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("border-grey-200");
    expect(screen.getByRole("heading", { level: 3, name: "AI Agents" })).toBeInTheDocument();
  });
});
