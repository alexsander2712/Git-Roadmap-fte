
import { useState } from "react";

import BrandPanel from "../../components/BrandPanel";
import AuthInput from "../../components/AuthInput";

import "./Cadastro.css";

export default function Cadastro() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

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

    setMessageType("success");

    setMessage(
      isLogin
        ? "Validação concluída! A autenticação será conectada ao servidor posteriormente."
        : "Validação concluída! O cadastro será conectado ao servidor posteriormente."
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-window">
        <BrandPanel />

        <section className="auth-panel">
          <form className="auth-card" onSubmit={handleSubmit}>
            <header className="auth-card__heading">
              <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>

              <p>
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
                role="status"
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
