import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";
import "./AppLayout.css";

// `match` define quais rotas deixam o item ativo (ex.: /roadmaps/1 mantém "Meus Projetos" ativo).
const navItems = [
  { to: "/dashboard", icon: "home", label: "Início", match: ["/dashboard"] },
  { to: "/repositorios", icon: "folder", label: "Meus Projetos", match: ["/repositorios", "/roadmaps"] },
  { to: "/perfil", icon: "user", label: "Perfil", match: ["/perfil"] },
  { to: "/configuracoes", icon: "settings", label: "Configurações", match: ["/configuracoes"] },
  { to: "/cadastro", icon: "logout", label: "Sair", match: [] },
];

/**
 * Layout padrão das páginas internas.
 *
 * Props:
 * - breadcrumb: texto exibido após "Área de trabalho /" na topbar (modo "sidebar")
 * - navigation: "sidebar" (padrão) mostra o menu lateral; "top" remove o menu lateral
 *   e coloca a navegação em uma barra no topo, deixando a página com mais largura
 * - children: conteúdo da página
 */
export default function AppLayout({ breadcrumb, navigation = "sidebar", children }) {
  const { pathname } = useLocation();

  const brand = (
    <Link to="/dashboard" className="app-brand" aria-label="GitRoadmap, início">
      <img className="app-brand__logo" src={logo} alt="GitRoadmap" />
      <img className="app-brand__icon" src={logoIcon} alt="" aria-hidden="true" />
    </Link>
  );

  const links = navItems.map((item) => {
    const isActive =
      item.match.some((route) => pathname.startsWith(route)) ||
      (item.to === "/dashboard" && pathname === "/");

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`app-nav__item${isActive ? " is-active" : ""}`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon name={item.icon} />
        <span>{item.label}</span>
      </Link>
    );
  });

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

          <button className="app-topbar__user" type="button" title="Conta do usuário">
            <Icon name="user" />
            <span>Minha conta</span>
          </button>
        </header>

        <div className="app-content">
          {children}
          {footer}
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="app-sidebar">
        {brand}

        <nav className="app-nav" aria-label="Navegação principal">
          {links}
        </nav>

        <div className="app-sidebar__footer">
          <span className="app-avatar">GR</span>
          <div>
            <strong>Minha conta</strong>
            <small>GitRoadmap</small>
          </div>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <span>Área de trabalho{breadcrumb ? ` / ${breadcrumb}` : ""}</span>
          <button className="app-topbar__user" type="button" title="Conta do usuário">
            <Icon name="user" />
            <span>Minha conta</span>
          </button>
        </header>

        <div className="app-content">
          {children}
          {footer}
        </div>
      </section>
    </main>
  );
}