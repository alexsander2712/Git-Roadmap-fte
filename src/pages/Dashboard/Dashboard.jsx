
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const roadmaps = [
  { id: 1, name: "SistemaAcadêmico", variant: 1 },
  { id: 2, name: "Portal Aluno", variant: 2 },
  { id: 3, name: "API Core", variant: 3 },
  { id: 4, name: "Landing Page", variant: 4 },
];

const projects = [
  { id: 1, name: "Academy Quest", date: "28/08/2026" },
  { id: 2, name: "Eco2Eco", date: "28/08/2026" },
  { id: 3, name: "AdivinhaAiDev", date: "20/08/2026" },
];

function RoadmapPreview({ variant }) {
  const graphs = {
    1: {
      paths: [
        "M18 55 H45 Q55 55 55 42 V30 H82",
        "M55 42 V68 H82",
        "M55 55 H70 Q78 55 78 45 V30 H112",
        "M78 45 V55 H112",
        "M78 55 V78 H112",
      ],
      nodes: [
        [18, 55, "red"], [82, 30, "red"], [82, 68, "gray"],
        [112, 30, "light"], [112, 55, "light"], [112, 78, "gray"],
      ],
    },
    2: {
      paths: [
        "M20 35 H65 V55 H95",
        "M65 55 V78 H112",
        "M65 35 V18",
        "M65 55 V40",
        "M95 55 V78",
      ],
      nodes: [
        [20, 35, "red"], [65, 18, "gray"], [65, 40, "light"],
        [65, 55, "red"], [112, 78, "red"], [95, 55, "light"],
      ],
    },
    3: {
      paths: [
        "M18 60 H42 V35 H68",
        "M42 60 V82 H68",
        "M68 35 H90 Q100 35 100 25 V18",
        "M90 35 V48 H112",
        "M68 82 H90 Q100 82 100 68 V60 H112",
      ],
      nodes: [
        [18, 60, "red"], [68, 35, "red"], [68, 82, "red"],
        [100, 18, "light"], [100, 48, "gray"], [112, 60, "light"],
      ],
    },
    4: {
      paths: [
        "M18 35 H52 V55 H82",
        "M52 35 H80 Q90 35 90 48 V55 H112",
        "M82 55 H112",
      ],
      nodes: [
        [18, 35, "red"], [52, 55, "red"], [80, 35, "light"],
        [82, 55, "red"], [112, 55, "gray"],
      ],
    },
  };

  const graph = graphs[variant] || graphs[1];

  return (
    <svg
      className="roadmap-preview"
      viewBox="0 0 130 100"
      role="img"
      aria-label="Prévia visual do roadmap"
    >
      <defs>
        <marker
          id={`arrow-${variant}`}
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M0 0 L5 2.5 L0 5 Z" fill="#9aa3aa" />
        </marker>
      </defs>

      {graph.paths.map((path, index) => (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={index % 2 === 0 ? "#9aa3aa" : "#d83232"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#arrow-${variant})`}
        />
      ))}

      {graph.nodes.map(([cx, cy, type], index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r="6"
          fill={
            type === "red"
              ? "#df302d"
              : type === "gray"
                ? "#858d94"
                : "#f4f6f8"
          }
          stroke={type === "light" ? "#aeb5bb" : "none"}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function SidebarIcon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9" /><path d="M9 21v-7h6v7" /></>,
    projects: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18" /><path d="M8 5V3h8v2" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.9h-3l-.3-1.9a8 8 0 0 1-1.8-1l-1.7.7-1.5-2.6 1.5-1.2a7 7 0 0 1 0-2.1l-1.5-1.2 1.5-2.6 1.7.7a8 8 0 0 1 1.8-1L12.6 6h3l.3 1.9a8 8 0 0 1 1.8 1l1.7-.7 1.5 2.6-1.5 1.2a7 7 0 0 1 0 2.1Z" /></>,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export default function Dashboard() {
  const [active, setActive] = useState("Início");

  const menu = [
    { label: "Início", icon: "home", href: "/dashboard" },
    { label: "Meus Projetos", icon: "projects", href: "/repositorios" },
    { label: "Perfil", icon: "profile", href: "/perfil" },
    { label: "Configurações", icon: "settings", href: "/configuracoes" },
    { label: "Sair", icon: "logout", href: "/login" },
  ];

  return (
    <main className="dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-brand" aria-label="GitRoadmap, início">
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

        <nav className="dashboard-nav" aria-label="Navegação principal">
          {menu.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`dashboard-nav__item ${active === item.label ? "is-active" : ""}`}
              onClick={() => setActive(item.label)}
            >
              <SidebarIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <span className="dashboard-topbar__caption">Área de trabalho</span>
          <button
            className="dashboard-user"
            type="button"
            aria-label="Perfil do usuário"
            title="Perfil do usuário"
          >
            <SidebarIcon name="profile" />
            <span className="dashboard-user__chevron">⌄</span>
          </button>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-section">
            <div className="dashboard-heading">
              <h1>Seus Roadmaps</h1>
              <p>Acompanhe a evolução dos seus projetos.</p>
            </div>

            <div className="roadmap-grid">
              {roadmaps.map((roadmap) => (
                <article className="roadmap-card" key={roadmap.id}>
                  <div className="roadmap-card__preview">
                    <RoadmapPreview variant={roadmap.variant} />
                  </div>
                  <h2 title={roadmap.name}>{roadmap.name}</h2>
                  <Link
                    className={`roadmap-card__button ${roadmap.id === 1 ? "roadmap-card__button--primary" : ""}`}
                    to={`/roadmaps/${roadmap.id}`}
                  >
                    Ver
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="projects-section">
            <div className="projects-section__heading">
              <h2>Seus Projetos</h2>
              <Link to="/repositorios" className="projects-section__link">
                Ver todos
              </Link>
            </div>

            <div className="projects-table-wrapper">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Nome do Projeto</th>
                    <th>Data</th>
                    <th><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.date}</td>
                      <td className="projects-table__action">
                        <Link to="/repositorios">Ver</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="dashboard-note">
              Exibindo dados demonstrativos. Seus repositórios reais serão carregados após a integração com o backend.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
