import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginRequest, registerRequest } from "../api/client";
import { clearSession, getSession, getToken, saveSession, saveUser } from "./session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Começa com o usuário guardado (a tela abre na hora) e confirma o token com a API em segundo plano.
  const [user, setUser] = useState(() => getSession()?.user ?? null);
  const [loading, setLoading] = useState(() => Boolean(getToken()) && !getSession()?.user);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return undefined;
    }

    let ignore = false;

    getMe(token)
      .then(({ user: fresh }) => {
        if (ignore) return;
        saveUser(fresh);
        setUser(fresh);
      })
      .catch((error) => {
        if (ignore) return;

        // token expirado/inválido ou usuário removido: encerra a sessão.
        // Falha de rede ou 500 não derruba a sessão (mantém o usuário guardado).
        if (error.status === 401 || error.status === 404) {
          clearSession();
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (identifier, senha) => {
    const { token, user: basic } = await loginRequest(identifier, senha);

    saveSession({ token, user: basic });

    // o login devolve poucos campos; /me traz o perfil completo e as preferências
    let full = basic;
    try {
      full = (await getMe(token)).user;
      saveSession({ token, user: full });
    } catch {
      // segue com os dados básicos
    }

    setUser(full);
    return full;
  }, []);

  const register = useCallback((data) => registerRequest(data), []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }

  return context;
}