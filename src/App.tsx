import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { AuctionDetail } from "./pages/AuctionDetail";
import { SubmitBike } from "./pages/SubmitBike";
import { Profile } from "./pages/Profile";
import { colors } from "./theme";

export function App() {
  return (
    <BrowserRouter>
      <div style={{ background: colors.bg, minHeight: "100vh" }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/sell" element={<SubmitBike />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
