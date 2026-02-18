import React from "react";
import { Link, useLocation } from "react-router-dom";
import { colors, font } from "../theme";

export function Nav() {
  const { pathname } = useLocation();

  const link = (to: string, label: string) => (
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

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "60px",
        fontFamily: font.sans,
      }}
    >
      <Link
        to="/"
        style={{
          color: colors.textPrimary,
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "18px",
          letterSpacing: "-0.03em",
        }}
      >
        moto<span style={{ color: colors.pink }}>lot</span>
      </Link>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {link("/", "Auctions")}
        {link("/sell", "Sell a Bike")}
        {link("/profile", "Profile")}
      </div>
    </nav>
  );
}
