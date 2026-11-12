/* Camada única de comunicação com a API do GitRoadmap.
   Todas as chamadas (autenticação, GitHub, grafo, comparação) passam por `request`,
   que cuida da URL base, do cabeçalho Authorization, de timeout, de cancelamento e
   da tradução de erros. Nunca chame `fetch` direto nos componentes. */

import { getToken } from "../auth/session";

export const API_URL = (
  import.meta.env.VITE_API_URL ?? "https://gitroadmap-auth.onrender.com"
).replace(/\/+$/, "");

/** Disparado quando uma chamada autenticada recebe 401 (token ausente, inválido ou expirado). */
export const UNAUTHORIZED_EVENT = "gitroadmap:unauthorized";

// O servidor gratuito "dorme" quando fica parado; a primeira chamada pode demorar.
const TIMEOUT_MS = 60000;

export class ApiError extends Error {
  constructor(message, status = 0, data = null, { aborted = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = sem resposta (rede, tempo esgotado ou cancelada)
    this.data = data;     // corpo JSON do erro, quando existir
    this.aborted = aborted; // true quando o próprio front cancelou a chamada
  }
}

const DEFAULT_MESSAGES = {
  400: "Verifique os campos informados.",
  401: "Sua sessão é inválida ou expirou. Entre novamente.",
  403: "Acesso negado.",
  404: "Recurso não encontrado.",
  409: "Esses dados já estão cadastrados.",
  429: "Muitas requisições. Aguarde um instante e tente novamente.",
  500: "Erro no servidor. Tente novamente em instantes.",
};

// A API responde erros como { message } em português. Por isso a mensagem do servidor
// é usada, exceto no 401, que tem texto próprio. `overrides` permite trocar o texto
// de um status específico em uma chamada (ex.: login com senha errada).
function errorMessage(status, data, overrides = {}) {
  if (overrides[status]) return overrides[status];

  const fromServer =
    (typeof data?.message === "string" && data.message) ||
    (typeof data?.error === "string" && data.error) ||
    "";

  if (fromServer && status !== 401) return fromServer;
  return DEFAULT_MESSAGES[status] || fromServer || "Não foi possível concluir a operação.";
}

function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
}

/**
 * @param {string} path  caminho começando em "/api/..."
 * @param {object} options
 *   method     "GET" (padrão), "POST"...
 *   body       objeto enviado como JSON
 *   auth       true = usa o JWT guardado e, se a API responder 401, encerra a sessão
 *   token      JWT explícito (usado na verificação de sessão, sem encerrar a sessão em 401)
 *   overrides  { [status]: "mensagem" } para trocar o texto de um erro
 *   signal     AbortSignal para cancelar a chamada (ex.: ao sair da página)
 */
export async function request(
  path,
  { method = "GET", body, auth = false, token, overrides, signal } = {}
) {
  const bearer = token ?? (auth ? getToken() : null);

  if (auth && !bearer) {
    notifyUnauthorized();
    throw new ApiError(DEFAULT_MESSAGES[401], 401);
  }

  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  const onCallerAbort = () => controller.abort();

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onCallerAbort, { once: true });
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
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
      if (auth && response.status === 401) notifyUnauthorized();
      throw new ApiError(errorMessage(response.status, data, overrides), response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error.name === "AbortError") {
      if (timedOut) throw new ApiError("O servidor demorou para responder. Tente novamente.");
      throw new ApiError("Requisição cancelada.", 0, null, { aborted: true });
    }

    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.");
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", onCallerAbort);
  }
}

/** Atalho para endpoints protegidos: envia o JWT e trata 401 de forma global. */
export function authRequest(path, options = {}) {
  return request(path, { ...options, auth: true });
}

/** Codifica um trecho de caminho (owner, repo, sha...) para uso seguro na URL. */
export const segment = (value) => encodeURIComponent(String(value));