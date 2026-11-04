/* Guarda no navegador (localStorage) o token JWT e os dados do usuário logado.
   Observação de segurança: o token no localStorage pode ser lido por scripts da página
   (XSS). É o padrão para uma API que devolve o JWT no corpo da resposta; por isso o
   front não deve injetar HTML de terceiros nem usar dangerouslySetInnerHTML. */

const KEY = "gitroadmap:session";

export function getSession() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    return session && typeof session.token === "string" && session.token ? session : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function saveSession({ token, user }) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ token, user, savedAt: Date.now() }));
  } catch {
    // armazenamento indisponível (ex.: modo privado restrito): a sessão vale só nesta aba
  }
}

export function saveUser(user) {
  const session = getSession();
  if (session) saveSession({ token: session.token, user });
}

export function clearSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // sem ação
  }
}