
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Cadastro from "./pages/Auth/Cadastro";
import Dashboard from "./pages/Dashboard/Dashboard";
import Repositories from "./pages/Repositories/Repositories";
import Roadmap from "./pages/Roadmap/Roadmap";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

const protect = (page) => (
  <ProtectedRoute>{page}</ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/" element={protect(<Dashboard />)} />
          <Route path="/dashboard" element={protect(<Dashboard />)} />
          <Route path="/repositorios" element={protect(<Repositories />)} />

          <Route
            path="/roadmaps/:owner/:repo"
            element={protect(<Roadmap />)}
          />

          <Route path="/perfil" element={protect(<Profile />)} />
          <Route path="/configuracoes" element={protect(<Settings />)} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
