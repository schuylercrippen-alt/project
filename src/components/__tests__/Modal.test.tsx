import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../Modal";

describe("Modal", () => {
  it("renders when open is true", () => {
    render(<Modal open onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<Modal open={false} onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Modal open onClose={vi.fn()}>Hello world</Modal>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders a title", () => {
    render(<Modal open title="Confirm" onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("sets aria-labelledby when title is provided", () => {
    render(<Modal open title="Confirm" onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    await user.click(screen.getByRole("dialog").firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
