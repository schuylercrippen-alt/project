import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { AuctionDetail } from "./pages/AuctionDetail";
import { SubmitBike } from "./pages/SubmitBike";
import { Profile } from "./pages/Profile";
import { Auth } from "./pages/Auth";
import { colors } from "./theme";

// Redirects unauthenticated users to /auth, preserving intended destination
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/auth"       element={<Auth />} />
        <Route path="/sell"       element={<ProtectedRoute><SubmitBike /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
