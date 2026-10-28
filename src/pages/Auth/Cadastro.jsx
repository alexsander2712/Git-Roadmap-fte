import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandPanel from "../../components/BrandPanel";
import AuthInput from "../../components/AuthInput";
import { saveSession } from "../../auth/session";

import "./Cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => () => window.clearTimeout(redirectTimer.current), []);

  function toggleMode() {
    setIsLogin((current) => !current);
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);

    const nome = formData.get("nome")?.trim();
    const email = formData.get("email")?.trim();
    const senha = formData.get("senha");
    const confirmacao = formData.get("confirmacao");
    const termos = formData.get("termos");

    if (!email || !senha) {
      setMessageType("error");
      setMessage("Preencha o e-mail e a senha.");
      return;
    }

    if (senha.length < 8) {
      setMessageType("error");
      setMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (!isLogin) {
      if (!nome) {
        setMessageType("error");
        setMessage("Informe seu nome completo.");
        return;
      }

      if (senha !== confirmacao) {
        setMessageType("error");
        setMessage("As senhas não coincidem.");
        return;
      }

      if (!termos) {
        setMessageType("error");
        setMessage("Você precisa aceitar os termos para continuar.");
        return;
      }
    }

    // Sessão simulada no navegador: a autenticação real será feita pelo servidor.
    saveSession({ name: nome || email.split("@")[0], login: email });

    setMessageType("success");

    setMessage(
      isLogin
        ? "Acesso liberado em modo demonstrativo. Redirecionando..."
        : "Conta criada em modo demonstrativo. Redirecionando..."
    );

    redirectTimer.current = window.setTimeout(
      () => navigate("/dashboard"),
      900
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-window">
        <BrandPanel />

        <section className="auth-panel">
          <form className="auth-card" onSubmit={handleSubmit}>
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
                >
                  {isLogin ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </header>

            {!isLogin && (
              <AuthInput
                id="nome"
                name="nome"
                label="Nome completo"
                placeholder="Seu nome"
                autoComplete="name"
              />
            )}

            <AuthInput
              id="email"
              name="email"
              label="E-mail ou nome de usuário"
              type="text"
              placeholder="seu@email.com"
              autoComplete="username"
            />

            <AuthInput
              id="senha"
              name="senha"
              label="Senha"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              autoComplete={
                isLogin ? "current-password" : "new-password"
              }
              minLength={8}
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
            >
              {isLogin ? "Entrar" : "Cadastre-se"}
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