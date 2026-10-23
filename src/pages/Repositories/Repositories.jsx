
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Repositories.css";

const initialProjects = [
  {
    id: 1,
    name: "Academy Quest",
    description: "Plataforma educacional para estudantes e professores.",
    repository: "alex/academy-quest",
    language: "JavaScript",
    updatedAt: "28/08/2026",
    branches: 4,
    commits: 128,
    status: "Conectado",
    color: "#e9b44c",
  },
  {
    id: 2,
    name: "Eco2Eco",
    description: "Aplicativo de sustentabilidade e consumo consciente.",
    repository: "alex/eco2eco",
    language: "Python",
    updatedAt: "28/08/2026",
    branches: 3,
    commits: 86,
    status: "Conectado",
    color: "#41966a",
  },
  {
    id: 3,
    name: "AdivinhaAiDev",
    description: "Quiz interativo sobre linguagens de programação.",
    repository: "alex/adivinha-ai-dev",
    language: "JavaScript",
    updatedAt: "20/08/2026",
    branches: 2,
    commits: 54,
    status: "Conectado",
    color: "#d83232",
  },
];

function Icon({ name, size = 19 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9" /><path d="M9 21v-7h6v7" /></>,
    folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 9h18" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13.5 2 1.5-2 3-2.3-.8a7 7 0 0 1-2 1.1L14.3 21h-4.6l-.4-2.7a7 7 0 0 1-2-1.1L5 18l-2-3 2-1.5a7 7 0 0 1 0-2.3L3 9.7l2-3 2.3.8a7 7 0 0 1 2-1.1L9.7 4h4.6l.4 2.4a7 7 0 0 1 2 1.1L19 6.7l2 3-2 1.5a7 7 0 0 1 0 2.3Z" /></>,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    git: <><path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 1 0 3-3V9a3 3 0 0 0 0-6Z" /><circle cx="12" cy="6" r="1" /><circle cx="9" cy="10" r="1" /><circle cx="12" cy="18" r="1" /></>,
    branch: <><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 6v12M18 9a7 7 0 0 1-7 7H8" /></>,
    commit: <><circle cx="12" cy="12" r="4" /><path d="M2 12h6m8 0h6" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    code: <><path d="m8 17-5-5 5-5m8 0 5 5-5 5m-2-12-4 14" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return <svg {...props}>{icons[name] || icons.folder}</svg>;
}

function ProjectSymbol({ color }) {
  return (
    <div className="project-symbol" style={{ "--project-color": color }}>
      <Icon name="git" size={25} />
    </div>
  );
}

export default function Repositories() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [feedback, setFeedback] = useState("");

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(term) ||
        project.repository.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term);

      const matchesFilter =
        filter === "Todos" || project.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  function handleAddRepository(event) {
    event.preventDefault();

    const url = repoUrl.trim();
    const name = repoName.trim();

    if (!url || !name) return;

    const newProject = {
      id: Date.now(),
      name,
      description: "Repositório adicionado localmente.",
      repository: url.replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/\.git$/i, ""),
      language: "Não identificado",
      updatedAt: new Date().toLocaleDateString("pt-BR"),
      branches: 0,
      commits: 0,
      status: "Pendente",
      color: "#64748b",
    };

    setProjects((current) => [newProject, ...current]);
    setRepoName("");
    setRepoUrl("");
    setModalOpen(false);
    setSearch("");
    setFilter("Todos");
    setFeedback("Projeto adicionado à lista local. A conexão real com o GitHub ainda será implementada.");
  }

  return (
    <main className="repositories-page">
      <aside className="repositories-sidebar">
        <Link to="/dashboard" className="repositories-brand">
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

        <nav className="repositories-nav" aria-label="Navegação principal">
          <Link to="/dashboard" className="repositories-nav__item">
            <Icon name="home" /><span>Início</span>
          </Link>
          <Link to="/repositorios" className="repositories-nav__item is-active">
            <Icon name="folder" /><span>Meus Projetos</span>
          </Link>
          <Link to="/perfil" className="repositories-nav__item">
            <Icon name="user" /><span>Perfil</span>
          </Link>
          <Link to="/configuracoes" className="repositories-nav__item">
            <Icon name="settings" /><span>Configurações</span>
          </Link>
          <Link to="/cadastro" className="repositories-nav__item">
            <Icon name="logout" /><span>Sair</span>
          </Link>
        </nav>

        <div className="repositories-sidebar__footer">
          <span className="repositories-avatar">GR</span>
          <div>
            <strong>Minha conta</strong>
            <small>GitRoadmap</small>
          </div>
        </div>
      </aside>

      <section className="repositories-main">
        <header className="repositories-topbar">
          <span>Área de trabalho / Meus Projetos</span>
          <button className="repositories-topbar__user" type="button" title="Conta do usuário">
            <Icon name="user" />
            <span>Minha conta</span>
          </button>
        </header>

        <div className="repositories-content">
          <header className="repositories-heading">
            <div>
              <span className="repositories-eyebrow">SEU ESPAÇO DE DESENVOLVIMENTO</span>
              <h1>Meus Projetos</h1>
              <p>Organize seus repositórios e acompanhe a evolução do código.</p>
            </div>
            <button
              className="repositories-add-button"
              onClick={() => {
                setFeedback("");
                setModalOpen(true);
              }}
              type="button"
            >
              <Icon name="plus" size={18} />
              Adicionar repositório
            </button>
          </header>

          {feedback && (
            <div className="repositories-feedback" role="status">
              {feedback}
              <button type="button" onClick={() => setFeedback("")} aria-label="Fechar aviso">
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          <section className="repositories-stats" aria-label="Resumo dos projetos">
            <article className="repositories-stat">
              <span className="repositories-stat__icon repositories-stat__icon--red"><Icon name="folder" /></span>
              <div><span>Total de projetos</span><strong>{projects.length}</strong></div>
            </article>
            <article className="repositories-stat">
              <span className="repositories-stat__icon repositories-stat__icon--green"><Icon name="git" /></span>
              <div><span>Conectados</span><strong>{projects.filter((p) => p.status === "Conectado").length}</strong></div>
            </article>
            <article className="repositories-stat">
              <span className="repositories-stat__icon repositories-stat__icon--blue"><Icon name="branch" /></span>
              <div><span>Total de branches</span><strong>{projects.reduce((sum, p) => sum + p.branches, 0)}</strong></div>
            </article>
            <article className="repositories-stat">
              <span className="repositories-stat__icon repositories-stat__icon--purple"><Icon name="commit" /></span>
              <div><span>Total de commits</span><strong>{projects.reduce((sum, p) => sum + p.commits, 0)}</strong></div>
            </article>
          </section>

          <section className="repositories-list-section">
            <div className="repositories-list-heading">
              <div>
                <h2>Seus repositórios</h2>
                <p>{filteredProjects.length} {filteredProjects.length === 1 ? "projeto encontrado" : "projetos encontrados"}</p>
              </div>
              <div className="repositories-filters">
                <label className="repositories-search">
                  <Icon name="search" size={18} />
                  <input
                    type="search"
                    placeholder="Buscar projeto..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <select
                  aria-label="Filtrar por status"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option>Todos</option>
                  <option>Conectado</option>
                  <option>Pendente</option>
                </select>
              </div>
            </div>

            <div className="repositories-project-list">
              {filteredProjects.map((project) => (
                <article className="repository-card" key={project.id}>
                  <ProjectSymbol color={project.color} />

                  <div className="repository-card__info">
                    <div className="repository-card__title">
                      <h3>{project.name}</h3>
                      <span className={`repository-status ${project.status === "Conectado" ? "repository-status--connected" : ""}`}>
                        <span />
                        {project.status}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    <div className="repository-card__metadata">
                      <span className="repository-card__path"><Icon name="git" size={15} /> {project.repository}</span>
                      <span className="repository-card__language"><i style={{ background: project.color }} />{project.language}</span>
                      <span><Icon name="clock" size={14} /> Atualizado em {project.updatedAt}</span>
                    </div>
                    <div className="repository-card__counts">
                      <span><Icon name="branch" size={15} /> {project.branches} branches</span>
                      <span><Icon name="commit" size={15} /> {project.commits} commits</span>
                    </div>
                  </div>

                  <div className="repository-card__actions">
                    <Link
                      to={`/roadmaps/${project.id}`}
                      className="repository-card__roadmap"
                    >
                      Ver roadmap <Icon name="arrow" size={16} />
                    </Link>
                    <button
                      type="button"
                      className="repository-card__details"
                      onClick={() => setFeedback(`Projeto "${project.name}": os detalhes completos estarão disponíveis após a integração com o backend.`)}
                    >
                      Detalhes
                    </button>
                  </div>
                </article>
              ))}

              {filteredProjects.length === 0 && (
                <div className="repositories-empty">
                  <span><Icon name="search" size={25} /></span>
                  <h3>Nenhum projeto encontrado</h3>
                  <p>Tente outro termo de busca ou altere o filtro selecionado.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("Todos");
                    }}
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </section>

          <footer className="repositories-footer">
            <span>GitRoadmap · Visualize a evolução do seu código.</span>
            <span>Versão de demonstração</span>
          </footer>
        </div>
      </section>

      {modalOpen && (
        <div
          className="repositories-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="repositories-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="repository-modal-title"
          >
            <header className="repositories-modal__heading">
              <div>
                <span className="repositories-eyebrow">NOVO PROJETO</span>
                <h2 id="repository-modal-title">Adicionar repositório</h2>
                <p>Cadastre um repositório para acompanhar sua evolução.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar">
                <Icon name="close" />
              </button>
            </header>

            <form onSubmit={handleAddRepository}>
              <label htmlFor="repository-name">Nome do projeto</label>
              <input
                id="repository-name"
                value={repoName}
                onChange={(event) => setRepoName(event.target.value)}
                placeholder="Ex.: Meu projeto"
                required
              />

              <label htmlFor="repository-url">URL do repositório GitHub</label>
              <input
                id="repository-url"
                type="url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/usuario/repositorio"
                pattern="https://(www\.)?github\.com/.+"
                title="Informe uma URL de repositório do GitHub iniciada por https://github.com/"
                required
              />

              <p className="repositories-modal__note">
                Por enquanto, o projeto será adicionado apenas nesta sessão do navegador. A leitura de commits e branches será implementada na integração com o backend.
              </p>

              <div className="repositories-modal__actions">
                <button type="button" className="repositories-modal__cancel" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="repositories-add-button">
                  <Icon name="plus" size={17} /> Adicionar projeto
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
