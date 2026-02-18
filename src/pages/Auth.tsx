import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { colors, font, radii } from "../theme";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.sm,
  padding: "11px 14px",
  color: colors.textPrimary,
  fontSize: "14px",
  fontFamily: font.sans,
  outline: "none",
  boxSizing: "border-box",
};

export function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already signed in — redirect away
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        navigate(from, { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account, then sign in.");
        setMode("signin");
      }
    }

    setLoading(false);
  }

  return (
    <div style={{
      background: colors.bg, minHeight: "100vh", fontFamily: font.sans,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "block", textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em", color: colors.textPrimary }}>
            moto<span style={{ color: colors.pink }}>lot</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: "32px" }}>

          {/* Mode toggle */}
          <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}`, marginBottom: "28px" }}>
            {(["signin", "signup"] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); setMessage(null); }}
                style={{
                  flex: 1, padding: "10px", background: "transparent", border: "none",
                  borderBottom: `2px solid ${mode === m ? colors.pink : "transparent"}`,
                  color: mode === m ? colors.textPrimary : colors.textSecondary,
                  fontSize: "14px", fontWeight: mode === m ? 600 : 400,
                  cursor: "pointer", fontFamily: font.sans, marginBottom: "-1px",
                  transition: "color 0.15s",
                }}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {error && (
            <div style={{ background: `${colors.pink}15`, border: `1px solid ${colors.pink}44`, borderRadius: radii.sm, padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: colors.pink }}>{error}</p>
            </div>
          )}
          {message && (
            <div style={{ background: "#4ade8015", border: "1px solid #4ade8044", borderRadius: radii.sm, padding: "10px 14px", marginBottom: "20px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#4ade80" }}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: colors.textPrimary }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: colors.textPrimary }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: colors.pink, color: "#fff",
                border: "none", borderRadius: radii.sm, padding: "13px",
                fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: font.sans, opacity: loading ? 0.7 : 1, marginTop: "4px",
              }}
            >
              {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: colors.textSecondary }}>
          By continuing you agree to our{" "}
          <span style={{ color: colors.pink, cursor: "pointer" }}>Terms</span> and{" "}
          <span style={{ color: colors.pink, cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
