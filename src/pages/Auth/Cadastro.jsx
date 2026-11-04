import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import BrandPanel from "../../components/BrandPanel";
import AuthInput from "../../components/AuthInput";
import { useAuth } from "../../auth/AuthContext";

import "./Cadastro.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/;

export default function Cadastro() {
  const { user, loading, login, register } = useAuth();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [submitting, setSubmitting] = useState(false);
  const slowTimer = useRef(null);

  // volta para a página que a pessoa tentou abrir antes de ser enviada ao login
  const from = typeof location.state?.from === "string" ? location.state.from : "/dashboard";

  useEffect(() => () => window.clearTimeout(slowTimer.current), []);

  function toggleMode() {
    setIsLogin((current) => !current);
    setMessage("");
  }

  function showError(text) {
    setMessageType("error");
    setMessage(text);
  }

  // Executa uma chamada à API controlando o estado de envio e o aviso de servidor lento
  async function run(action) {
    setSubmitting(true);

    slowTimer.current = window.setTimeout(() => {
      setMessageType("info");
      setMessage("Conectando ao servidor. Na primeira vez isso pode levar até 1 minuto...");
    }, 4000);

    try {
      await action();
    } catch (error) {
      showError(error.message || "Não foi possível concluir. Tente novamente.");
    } finally {
      window.clearTimeout(slowTimer.current);
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setMessage("");

    const formData = new FormData(event.currentTarget);
    const senha = String(formData.get("senha") ?? "");

    if (isLogin) {
      const identifier = String(formData.get("identifier") ?? "").trim();

      if (!identifier || !senha) {
        showError("Preencha o e-mail ou usuário e a senha.");
        return;
      }

      // ao logar, "user" é preenchido e esta página redireciona sozinha para "from"
      await run(() => login(identifier, senha));
      return;
    }

    const nome = String(formData.get("nome") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const confirmacao = String(formData.get("confirmacao") ?? "");

    if (!nome) return showError("Informe seu nome completo.");
    if (!USERNAME_PATTERN.test(username)) {
      return showError("O nome de usuário deve ter de 3 a 30 caracteres: letras, números, ponto, hífen ou sublinhado.");
    }
    if (!EMAIL_PATTERN.test(email)) return showError("Informe um e-mail válido.");
    if (senha.length < 8) return showError("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== confirmacao) return showError("As senhas não coincidem.");
    if (!formData.get("termos")) return showError("Você precisa aceitar os termos para continuar.");

    await run(async () => {
      await register({ nome, username, email, senha });

      setMessageType("success");
      setMessage("Conta criada! Entrando...");

      try {
        await login(username, senha);
      } catch {
        // conta criada, mas o login automático falhou: leva a pessoa para a tela de entrar
        setIsLogin(true);
        setMessageType("success");
        setMessage("Conta criada com sucesso. Entre com seu usuário e senha.");
      }
    });
  }

  // já está logado: não mostra o formulário
  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-window">
        <BrandPanel />

        <section className="auth-panel">
          <form
            key={isLogin ? "login" : "cadastro"}
            className="auth-card"
            onSubmit={handleSubmit}
            aria-busy={submitting}
          >
            <header className="auth-card__heading">
              <span className="auth-card__eyebrow">
                {isLogin ? "BEM-VINDO DE VOLTA" : "COMECE AGORA"}
              </span>

              <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>

              <p className="auth-card__description">
                {isLogin
                  ? "Acesse sua conta para acompanhar seus roadmaps."
                  : "Crie sua conta para visualizar a evolução do seu código."}
              </p>

              <p className="auth-card__mode">
                {isLogin
                  ? "Ainda não tem uma conta?"
                  : "Já tem uma conta?"}{" "}

                <button
                  className="auth-card__switch"
                  type="button"
                  onClick={toggleMode}
                  disabled={submitting}
                >
                  {isLogin ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </header>

            {!isLogin && (
              <>
                <AuthInput
                  id="nome"
                  name="nome"
                  label="Nome completo"
                  placeholder="Seu nome"
                  autoComplete="name"
                />

                <AuthInput
                  id="username"
                  name="username"
                  label="Nome de usuário"
                  placeholder="seunome"
                  autoComplete="username"
                />

                <AuthInput
                  id="email"
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </>
            )}

            {isLogin && (
              <AuthInput
                id="identifier"
                name="identifier"
                label="E-mail ou nome de usuário"
                type="text"
                placeholder="seu@email.com"
                autoComplete="username"
              />
            )}

            <AuthInput
              id="senha"
              name="senha"
              label="Senha"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={isLogin ? undefined : 8}
            />

            {!isLogin && (
              <>
                <AuthInput
                  id="confirmacao"
                  name="confirmacao"
                  label="Confirmar senha"
                  type="password"
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                />

                <div className="auth-terms">
                  <input
                    id="termos"
                    name="termos"
                    type="checkbox"
                    required
                  />

                  <label htmlFor="termos">
                    Concordo com os{" "}
                    <a href="/termos">Termos de Serviço</a> e a{" "}
                    <a href="/privacidade">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              </>
            )}

            <button
              className="auth-card__submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Aguarde..." : isLogin ? "Entrar" : "Cadastre-se"}
            </button>

            {message && (
              <p
                className={`auth-message auth-message--${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
              >
                {message}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}