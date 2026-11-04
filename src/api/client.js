/* Cliente HTTP da API de autenticação (gitroadmap-auth).
   A URL base vem de VITE_API_URL (veja .env.example); sem ela, usa a API publicada. */

const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://gitroadmap-auth.onrender.com"
).replace(/\/+$/, "");

// Servidores gratuitos "dormem" quando ficam parados; a primeira chamada pode demorar.
const TIMEOUT_MS = 60000;

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = sem resposta do servidor (rede ou tempo esgotado)
    this.data = data;
  }
}

const DEFAULT_MESSAGES = {
  400: "Verifique os campos informados.",
  401: "Sessão inválida ou expirada. Entre novamente.",
  404: "Recurso não encontrado.",
  409: "Esses dados já estão cadastrados.",
  500: "Erro no servidor. Tente novamente em instantes.",
};

// Para 400 usa a mensagem da API (pode dizer qual campo está errado);
// nos demais códigos usa um texto em português do contexto.
function errorMessage(status, data, overrides = {}) {
  const fromServer = data?.message || data?.error;

  if (status === 400 && fromServer) return fromServer;
  return overrides[status] || DEFAULT_MESSAGES[status] || fromServer || "Não foi possível concluir a operação.";
}

async function request(path, { method = "GET", body, token, overrides } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      // resposta sem corpo JSON
    }

    if (!response.ok) {
      throw new ApiError(errorMessage(response.status, data, overrides), response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error.name === "AbortError") {
      throw new ApiError("O servidor demorou para responder. Tente novamente.");
    }

    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.");
  } finally {
    clearTimeout(timer);
  }
}

/** POST /api/auth/register -> { message, user } */
export function registerRequest({ nome, username, email, senha }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { nome, username, email, senha },
    overrides: { 409: "E-mail ou nome de usuário já cadastrado." },
  });
}

/** POST /api/auth/login -> { message, user, token } */
export function loginRequest(identifier, senha) {
  return request("/api/auth/login", {
    method: "POST",
    body: { identifier, senha },
    overrides: { 401: "E-mail/usuário ou senha incorretos." },
  });
}

/** GET /api/auth/me -> { user } (exige token) */
export function getMe(token) {
  return request("/api/auth/me", {
    token,
    overrides: { 401: "Sessão expirada. Entre novamente." },
  });
}