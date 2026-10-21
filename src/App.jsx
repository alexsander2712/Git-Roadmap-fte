
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "./pages/Auth/Cadastro";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<Navigate to="/cadastro" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
