import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown } from "../Dropdown";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

describe("Dropdown", () => {
  it("renders the placeholder when no value is selected", () => {
    render(<Dropdown options={options} onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Select...");
  });

  it("renders a custom placeholder", () => {
    render(<Dropdown options={options} placeholder="Pick a fruit" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Pick a fruit");
  });

  it("renders the selected option label", () => {
    render(<Dropdown options={options} value="banana" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Banana");
  });

  it("opens the listbox when clicked", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes the listbox after selecting an option", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onChange with the selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown options={options} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onChange).toHaveBeenCalledWith("cherry");
  });

  it("marks the selected option with aria-selected", async () => {
    const user = userEvent.setup();
    render(<Dropdown options={options} value="banana" onChange={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "false");
  });

  it("closes the listbox when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Dropdown options={options} onChange={vi.fn()} />
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Select..." }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Dropdown options={options} disabled onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
