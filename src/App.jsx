
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Cadastro from "./pages/Auth/Cadastro";
import Dashboard from "./pages/Dashboard/Dashboard";
import Repositories from "./pages/Repositories/Repositories";
import Roadmap from "./pages/Roadmap/Roadmap";
import Profile from "./pages/Profile/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/repositorios" element={<Repositories />} />
        <Route path="/roadmaps/:id" element={<Roadmap />} />
        <Route path="/perfil" element={<Profile />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
