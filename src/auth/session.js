/* Sessão SIMULADA, apenas no navegador (localStorage).
   Serve para o front-end saber se há alguém "logado" enquanto o backend não existe.
   Não é segurança: quando houver servidor, troque por token/cookie de autenticação
   e mantenha estas mesmas funções (getSession, saveSession, clearSession). */

const KEY = "gitroadmap:session";

export function getSession() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    return session && typeof session.login === "string" ? session : null;
  } catch {
    return null;
  }
}

export function saveSession({ name, login }) {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ name, login, loggedAt: Date.now() })
    );
  } catch {
    // armazenamento indisponível (ex.: modo privado restrito)
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // sem ação
  }
}