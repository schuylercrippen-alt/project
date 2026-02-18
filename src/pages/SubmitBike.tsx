import React, { useState } from "react";
import { colors, font, radii } from "../theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 — Bike info
  brand: string;
  model: string;
  year: string;
  category: string;
  suspension: string;
  wheelSize: string;
  frameMaterial: string;
  // Step 2 — Components
  fork: string;
  shock: string;
  drivetrain: string;
  weightKg: string;
  // Step 3 — Condition & photos
  condition: string;
  description: string;
  images: string[];
  // Step 4 — Pricing
  startingBid: string;
  reservePrice: string;
  buyItNowPrice: string;
}

const initial: FormData = {
  brand: "", model: "", year: "", category: "", suspension: "", wheelSize: "", frameMaterial: "",
  fork: "", shock: "", drivetrain: "", weightKg: "",
  condition: "", description: "", images: [],
  startingBid: "", reservePrice: "", buyItNowPrice: "",
};

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = ["Bike Info", "Components", "Condition & Photos", "Pricing"];

// ─── Field primitives ─────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 500, color: colors.textPrimary }}>{label}</label>
      {hint && <p style={{ margin: 0, fontSize: "12px", color: colors.textSecondary }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.sm,
  padding: "10px 14px",
  color: colors.textPrimary,
  fontSize: "14px",
  fontFamily: font.sans,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />;
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      style={{ ...inputStyle, appearance: "none" }}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ChipSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map(o => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          style={{
            padding: "7px 16px",
            borderRadius: "999px",
            border: `1px solid ${value === o ? colors.pink : colors.border}`,
            background: value === o ? colors.pink : "transparent",
            color: value === o ? "#fff" : colors.textSecondary,
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: font.sans,
            transition: "all 0.15s",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Field label="Brand">
          <TextInput value={data.brand} onChange={v => update("brand", v)} placeholder="e.g. Trek" />
        </Field>
        <Field label="Model">
          <TextInput value={data.model} onChange={v => update("model", v)} placeholder="e.g. Slash 9.9" />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Field label="Year">
          <SelectInput value={data.year} onChange={v => update("year", v)}
            options={["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"]} />
        </Field>
        <Field label="Frame Material">
          <ChipSelect value={data.frameMaterial} onChange={v => update("frameMaterial", v)}
            options={["Carbon", "Aluminum", "Steel", "Titanium"]} />
        </Field>
      </div>
      <Field label="Category">
        <ChipSelect value={data.category} onChange={v => update("category", v)}
          options={["Cross-Country", "Trail", "Enduro", "Downhill", "Dirt Jump", "Gravel"]} />
      </Field>
      <Field label="Suspension">
        <ChipSelect value={data.suspension} onChange={v => update("suspension", v)}
          options={["Full Suspension", "Hardtail", "Rigid"]} />
      </Field>
      <Field label="Wheel Size">
        <ChipSelect value={data.wheelSize} onChange={v => update("wheelSize", v)}
          options={["26\"", "27.5\"", "29\""]} />
      </Field>
    </div>
  );
}

function Step2({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Field label="Fork" hint="Include brand, model, and travel (e.g. Fox 36 Factory 160mm)">
        <TextInput value={data.fork} onChange={v => update("fork", v)} placeholder="e.g. Fox 36 Factory 160mm" />
      </Field>
      <Field label="Rear Shock" hint="Leave blank for hardtail or rigid builds">
        <TextInput value={data.shock} onChange={v => update("shock", v)} placeholder="e.g. Fox Float X2 Factory" />
      </Field>
      <Field label="Drivetrain" hint="Include brand, groupset, and speed (e.g. Shimano XT 12-speed)">
        <TextInput value={data.drivetrain} onChange={v => update("drivetrain", v)} placeholder="e.g. Shimano XT 12-speed" />
      </Field>
      <Field label="Weight (kg)" hint="Weigh the bike without pedals if possible">
        <TextInput value={data.weightKg} onChange={v => update("weightKg", v)} placeholder="e.g. 13.5" />
      </Field>
    </div>
  );
}

function Step3({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Field label="Condition">
        <ChipSelect value={data.condition} onChange={v => update("condition", v)}
          options={["New", "Like New", "Good", "Fair", "Poor"]} />
      </Field>
      <Field label="Description" hint="Be honest and detailed — buyers appreciate transparency. Mention any wear, repairs, or upgrades.">
        <textarea
          value={data.description}
          onChange={e => update("description", e.target.value)}
          placeholder="Describe the bike's history, condition, notable features, and any issues…"
          rows={6}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </Field>
      <Field label="Photos" hint="Add up to 10 photos. High-res shots of the full bike, drivetrain, fork, and any wear spots perform best.">
        <div
          style={{
            border: `2px dashed ${colors.border}`,
            borderRadius: radii.md,
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = colors.pink)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}
        >
          <p style={{ margin: "0 0 6px", fontSize: "14px", color: colors.textSecondary }}>
            Drag & drop photos here, or{" "}
            <span style={{ color: colors.pink, cursor: "pointer" }}>browse</span>
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: colors.textSecondary }}>
            JPG, PNG — max 20MB each
          </p>
        </div>
      </Field>
    </div>
  );
}

function Step4({ data, update }: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Field label="Starting Bid ($)" hint="The opening bid price. Lower starting bids attract more early bidders.">
        <TextInput value={data.startingBid} onChange={v => update("startingBid", v)} placeholder="e.g. 2000" />
      </Field>
      <Field label="Reserve Price ($)" hint="Optional. The minimum price you'll accept. Buyers won't see the exact reserve, only whether it's been met.">
        <TextInput value={data.reservePrice} onChange={v => update("reservePrice", v)} placeholder="Optional" />
      </Field>
      <Field label="Buy It Now ($)" hint="Optional. Buyers can skip the auction and purchase immediately at this price.">
        <TextInput value={data.buyItNowPrice} onChange={v => update("buyItNowPrice", v)} placeholder="Optional" />
      </Field>

      <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.md, padding: "16px 20px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600 }}>Fees</p>
        <p style={{ margin: 0, fontSize: "13px", color: colors.textSecondary, lineHeight: 1.7 }}>
          Listing is free. motolot takes a <strong style={{ color: colors.textPrimary }}>5% success fee</strong> only when your bike sells. No sale, no fee.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SubmitBike() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);

  function update(key: keyof FormData, value: string) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: font.sans, color: colors.textPrimary }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>

        <p style={{ margin: "0 0 6px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: colors.pink, fontWeight: 600 }}>
          Sell your bike
        </p>
        <h1 style={{ margin: "0 0 36px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em" }}>
          List your bike
        </h1>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "0", marginBottom: "40px" }}>
          {STEPS.map((label, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  {i > 0 && <div style={{ flex: 1, height: "2px", background: done ? colors.pink : colors.border }} />}
                  <div
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: active || done ? colors.pink : colors.surface,
                      border: `2px solid ${active || done ? colors.pink : colors.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 700,
                      color: active || done ? "#fff" : colors.textSecondary,
                      flexShrink: 0,
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: done ? colors.pink : colors.border }} />}
                </div>
                <span style={{ fontSize: "11px", color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: "28px" }}>
            {step === 0 && <Step1 data={data} update={update} />}
            {step === 1 && <Step2 data={data} update={update} />}
            {step === 2 && <Step3 data={data} update={update} />}
            {step === 3 && <Step4 data={data} update={update} />}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              style={{
                padding: "12px 24px",
                background: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: radii.sm,
                color: step === 0 ? colors.textSecondary : colors.textPrimary,
                fontSize: "14px",
                fontWeight: 500,
                cursor: step === 0 ? "not-allowed" : "pointer",
                fontFamily: font.sans,
              }}
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                style={{
                  padding: "12px 28px",
                  background: colors.pink,
                  border: "none",
                  borderRadius: radii.sm,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: font.sans,
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                style={{
                  padding: "12px 28px",
                  background: colors.pink,
                  border: "none",
                  borderRadius: radii.sm,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: font.sans,
                }}
              >
                Submit Listing
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
