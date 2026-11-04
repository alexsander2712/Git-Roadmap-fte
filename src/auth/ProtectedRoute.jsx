import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Só renderiza a página se houver usuário logado; senão envia para /cadastro
    (guardando a página pedida para voltar depois do login). */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        role="status"
        style={{
          display: "grid",
          minHeight: "100vh",
          placeItems: "center",
          color: "#596875",
          fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
          fontSize: 14,
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/cadastro" replace state={{ from: location.pathname }} />;
  }

  return children;
}