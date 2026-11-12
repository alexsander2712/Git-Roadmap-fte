
import { request } from "./http";

/**
 * POST /api/auth/register
 * Body: { nome, username, email, senha }
 * Retorno: { message, user }
 */
export function registerRequest({ nome, username, email, senha }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { nome, username, email, senha },
    overrides: {
      409: "E-mail ou nome de usuário já cadastrado.",
    },
  });
}

/**
 * POST /api/auth/login
 * Body: { identifier, senha }
 * Retorno: { message, user, token }
 */
export function loginRequest(identifier, senha) {
  return request("/api/auth/login", {
    method: "POST",
    body: { identifier, senha },
    overrides: {
      401: "E-mail/usuário ou senha incorretos.",
    },
  });
}

/**
 * GET /api/auth/me
 * Exige JWT.
 * Retorno: { user }
 */
export function getMe(token) {
  return request("/api/auth/me", {
    token,
    overrides: {
      401: "Sessão expirada. Entre novamente.",
    },
  });
}
