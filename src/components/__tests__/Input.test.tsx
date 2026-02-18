import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../Input";

describe("Input", () => {
  it("renders an input", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders an error message", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input label="Email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    await user.type(screen.getByLabelText("Name"), "Schuyler");
    expect(screen.getByLabelText("Name")).toHaveValue("Schuyler");
  });

  it("calls onChange when typed into", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText("Name"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input label="Name" disabled />);
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });
});
