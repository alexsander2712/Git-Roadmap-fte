import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
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
 * - breadcrumb: texto exibido após "Área de trabalho /" na topbar (ex.: "Meus Projetos")
 * - children: conteúdo da página
 */
export default function AppLayout({ breadcrumb, children }) {
  const { pathname } = useLocation();

  return (
    <main className="app-shell">
      <aside className="app-sidebar">
        <Link to="/dashboard" className="app-brand">
          <svg viewBox="0 0 50 36" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M4 18h12L27 7h12M16 18l11 11h12M27 7v22" />
            </g>
            <circle cx="4" cy="18" r="3.5" fill="currentColor" />
            <circle cx="39" cy="7" r="3.5" fill="currentColor" />
            <circle cx="39" cy="29" r="3.5" fill="currentColor" />
          </svg>
          <span><b>Git</b><strong>Roadmap</strong></span>
        </Link>

        <nav className="app-nav" aria-label="Navegação principal">
          {navItems.map((item) => {
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
          })}
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

          <footer className="app-footer">
            <span>GitRoadmap · Visualize a evolução do seu código.</span>
            <span>Versão de demonstração</span>
          </footer>
        </div>
      </section>
    </main>
  );
}