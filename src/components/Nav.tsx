import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { colors, font, radii } from "../theme";
import { useAuth } from "../context/AuthContext";

export function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        color: pathname === to ? colors.pink : colors.textSecondary,
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.02em",
        transition: "color 0.15s",
      }}
    >
      {label}
    </Link>
  );

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: colors.bg, borderBottom: `1px solid ${colors.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "60px", fontFamily: font.sans,
      }}
    >
      <Link
        to="/"
        style={{ color: colors.textPrimary, textDecoration: "none", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.03em" }}
      >
        moto<span style={{ color: colors.pink }}>lot</span>
      </Link>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {navLink("/", "Auctions")}
        {navLink("/sell", "Sell a Bike")}

        {user ? (
          // Avatar + dropdown
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: colors.pink, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: font.sans,
              }}
            >
              {user.email?.[0].toUpperCase() ?? "U"}
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 10 }}
                  onClick={() => setMenuOpen(false)}
                />
                {/* Menu */}
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 20,
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: radii.md, padding: "6px", minWidth: "200px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <p style={{ margin: "0", padding: "8px 12px 10px", fontSize: "12px", color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                    {user.email}
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "9px 12px", fontSize: "14px",
                      color: colors.textPrimary, textDecoration: "none", borderRadius: radii.sm,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceAlt)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/sell"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "9px 12px", fontSize: "14px",
                      color: colors.textPrimary, textDecoration: "none", borderRadius: radii.sm,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceAlt)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    List a bike
                  </Link>
                  <div style={{ borderTop: `1px solid ${colors.border}`, margin: "6px 0" }} />
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: "100%", textAlign: "left", padding: "9px 12px", fontSize: "14px",
                      color: colors.pink, background: "transparent", border: "none",
                      cursor: "pointer", fontFamily: font.sans, borderRadius: radii.sm,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = colors.surfaceAlt)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            style={{
              background: colors.pink, color: "#fff", textDecoration: "none",
              padding: "7px 18px", borderRadius: radii.sm, fontSize: "13px", fontWeight: 700,
            }}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
