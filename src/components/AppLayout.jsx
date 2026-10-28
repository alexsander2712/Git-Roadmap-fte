import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { clearSession, getSession } from "../auth/session";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";
import "./AppLayout.css";

const SIDEBAR_KEY = "gitroadmap:sidebar-collapsed";

// `match` define quais rotas deixam o item ativo (ex.: /roadmaps/1 mantém "Meus Projetos" ativo).
const navItems = [
  { to: "/dashboard", icon: "home", label: "Início", match: ["/dashboard"] },
  { to: "/repositorios", icon: "folder", label: "Meus Projetos", match: ["/repositorios", "/roadmaps"] },
  { to: "/perfil", icon: "user", label: "Perfil", match: ["/perfil"] },
  { to: "/configuracoes", icon: "settings", label: "Configurações", match: ["/configuracoes"] },
];

function readCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Layout padrão das páginas internas.
 *
 * Props:
 * - breadcrumb: texto exibido após "Área de trabalho /" na topbar (modo "sidebar")
 * - navigation: "sidebar" (padrão) mostra o menu lateral retrátil; "top" remove o menu
 *   lateral e coloca a navegação em uma barra no topo
 * - children: conteúdo da página
 */
export default function AppLayout({ breadcrumb, navigation = "sidebar", children }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  // Sessão simulada (localStorage). Com backend, troque por dados da autenticação real.
  const session = getSession();
  const accountPath = session ? "/perfil" : "/cadastro";
  const accountTitle = session ? "Abrir meu perfil" : "Entrar ou cadastrar-se";
  const accountName = session ? session.name || "Minha conta" : "Entrar";
  const accountInitial = session ? (session.name || session.login || "U").trim().charAt(0).toUpperCase() : "";

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);

    try {
      window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
    } catch {
      // armazenamento indisponível: o estado vale só nesta visita
    }
  }

  const brand = (
    <Link to="/dashboard" className="app-brand" aria-label="GitRoadmap, início">
      <img className="app-brand__logo" src={logo} alt="GitRoadmap" />
      <img className="app-brand__icon" src={logoIcon} alt="" aria-hidden="true" />
    </Link>
  );

  const items = [
    ...navItems,
    session
      ? { to: "/cadastro", icon: "logout", label: "Sair", match: [], logout: true }
      : { to: "/cadastro", icon: "logout", label: "Entrar", match: [] },
  ];

  const links = items.map((item) => {
    const isActive =
      item.match.some((route) => pathname.startsWith(route)) ||
      (item.to === "/dashboard" && pathname === "/");

    return (
      <Link
        key={item.label}
        to={item.to}
        title={item.label}
        aria-label={item.label}
        className={`app-nav__item${isActive ? " is-active" : ""}`}
        aria-current={isActive ? "page" : undefined}
        onClick={item.logout ? clearSession : undefined}
      >
        <Icon name={item.icon} />
        <span>{item.label}</span>
      </Link>
    );
  });

  const userButton = (
    <Link to={accountPath} className="app-topbar__user" title={accountTitle}>
      <Icon name="user" />
      <span>{session ? "Minha conta" : "Entrar"}</span>
    </Link>
  );

  const footer = (
    <footer className="app-footer">
      <span>GitRoadmap · Visualize a evolução do seu código.</span>
      <span>Versão de demonstração</span>
    </footer>
  );

  if (navigation === "top") {
    return (
      <main className="app-shell app-shell--top">
        <header className="app-topnav">
          {brand}

          <nav className="app-nav app-nav--top" aria-label="Navegação principal">
            {links}
          </nav>

          {userButton}
        </header>

        <div className="app-content">
          {children}
          {footer}
        </div>
      </main>
    );
  }

  return (
    <main className={`app-shell${collapsed ? " app-shell--collapsed" : ""}`}>
      <aside className="app-sidebar">
        {brand}

        <nav className="app-nav" aria-label="Navegação principal">
          {links}
        </nav>

        <Link to={accountPath} className="app-sidebar__footer" title={accountTitle}>
          <span className="app-avatar">
            {session ? accountInitial : <Icon name="user" size={17} />}
          </span>
          <div>
            <strong>{accountName}</strong>
            <small>{session ? session.login : "Acesse sua conta"}</small>
          </div>
        </Link>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <div className="app-topbar__left">
            <button
              type="button"
              className="app-topbar__toggle"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              <Icon name="menu" size={18} />
            </button>
            <span>Área de trabalho{breadcrumb ? ` / ${breadcrumb}` : ""}</span>
          </div>

          {userButton}
        </header>

        <div className="app-content">
          {children}
          {footer}
        </div>
      </section>
    </main>
  );
}