import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Icon from "../../components/Icon";
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
    <AppLayout breadcrumb="Meus Projetos">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">SEU ESPAÇO DE DESENVOLVIMENTO</span>
          <h1>Meus Projetos</h1>
          <p>Organize seus repositórios e acompanhe a evolução do código.</p>
        </div>
        <button
          className="app-button"
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
        <div className="app-feedback" role="status">
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
                <span className="app-eyebrow">NOVO PROJETO</span>
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
                <button type="submit" className="app-button">
                  <Icon name="plus" size={17} /> Adicionar projeto
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AppLayout>
  );
}