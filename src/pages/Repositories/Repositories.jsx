
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Icon from "../../components/Icon";
import { getRepositories } from "../../api/github";
import "./Repositories.css";

function ProjectSymbol({ color }) {
  return (
    <div className="project-symbol" style={{ "--project-color": color }}>
      <Icon name="git" size={25} />
    </div>
  );
}

function formatDate(date) {
  if (!date) return "Data não disponível";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não disponível";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

export default function Repositories() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadRepositories() {
    try {
      setLoading(true);
      setError("");
      setFeedback("");

      const response = await getRepositories();

      const repositories = Array.isArray(response.repositories)
        ? response.repositories
        : [];

      setProjects(repositories);
    } catch (err) {
      console.error("Erro ao carregar repositórios:", err);

      setProjects([]);

      if (err.status === 404) {
        setError(
          "Nenhuma instalação do GitHub foi encontrada. Acesse as configurações e conecte sua conta."
        );
      } else if (err.status === 401) {
        setError(
          "Sua sessão expirou. Entre novamente para acessar seus repositórios."
        );
      } else {
        setError(
          err.message ||
          "Não foi possível carregar seus repositórios. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        (project.name || "").toLowerCase().includes(term) ||
        (project.full_name || "").toLowerCase().includes(term) ||
        (project.description || "").toLowerCase().includes(term) ||
        (project.owner || "").toLowerCase().includes(term);

      const visibility = project.private ? "Privado" : "Público";

      const matchesFilter =
        filter === "Todos" || visibility === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const publicRepositories = projects.filter(
    (project) => !project.private
  ).length;

  const privateRepositories = projects.filter(
    (project) => project.private
  ).length;

  const ownersCount = new Set(
    projects.map((project) => project.owner).filter(Boolean)
  ).size;

  return (
    <AppLayout breadcrumb="Meus Projetos">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">
            SEU ESPAÇO DE DESENVOLVIMENTO
          </span>
          <h1>Meus Projetos</h1>
          <p>
            Organize seus repositórios e acompanhe a evolução do código.
          </p>
        </div>

        <button
          className="app-button"
          onClick={loadRepositories}
          type="button"
          disabled={loading}
        >
          <Icon name="refresh-cw" size={18} />
          {loading ? "Atualizando..." : "Atualizar repositórios"}
        </button>
      </header>

      {feedback && (
        <div className="app-feedback" role="status">
          {feedback}
          <button
            type="button"
            onClick={() => setFeedback("")}
            aria-label="Fechar aviso"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section
        className="repositories-stats"
        aria-label="Resumo dos repositórios"
      >
        <article className="repositories-stat">
          <span className="repositories-stat__icon repositories-stat__icon--red">
            <Icon name="folder" />
          </span>
          <div>
            <span>Total de repositórios</span>
            <strong>{projects.length}</strong>
          </div>
        </article>

        <article className="repositories-stat">
          <span className="repositories-stat__icon repositories-stat__icon--green">
            <Icon name="globe" />
          </span>
          <div>
            <span>Repositórios públicos</span>
            <strong>{publicRepositories}</strong>
          </div>
        </article>

        <article className="repositories-stat">
          <span className="repositories-stat__icon repositories-stat__icon--blue">
            <Icon name="lock" />
          </span>
          <div>
            <span>Repositórios privados</span>
            <strong>{privateRepositories}</strong>
          </div>
        </article>

        <article className="repositories-stat">
          <span className="repositories-stat__icon repositories-stat__icon--purple">
            <Icon name="users" />
          </span>
          <div>
            <span>Proprietários</span>
            <strong>{ownersCount}</strong>
          </div>
        </article>
      </section>

      <section className="repositories-list-section">
        <div className="repositories-list-heading">
          <div>
            <h2>Seus repositórios</h2>
            <p>
              {loading
                ? "Carregando repositórios..."
                : `${filteredProjects.length} ${
                    filteredProjects.length === 1
                      ? "repositório encontrado"
                      : "repositórios encontrados"
                  }`}
            </p>
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
              aria-label="Filtrar por visibilidade"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option>Todos</option>
              <option>Público</option>
              <option>Privado</option>
            </select>
          </div>
        </div>

        <div className="repositories-project-list">
          {loading && (
            <div className="repositories-empty">
              <span>
                <Icon name="refresh-cw" size={25} />
              </span>
              <h3>Carregando repositórios</h3>
              <p>
                Estamos buscando os repositórios disponíveis na sua conta
                do GitHub.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="repositories-empty">
              <span>
                <Icon name="alert-circle" size={25} />
              </span>
              <h3>Não foi possível carregar os repositórios</h3>
              <p>{error}</p>

              <button type="button" onClick={loadRepositories}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredProjects.map((project) => (
              <article
                className="repository-card"
                key={project.id}
              >
                <ProjectSymbol
                  color={project.private ? "#64748b" : "#d83232"}
                />

                <div className="repository-card__info">
                  <div className="repository-card__title">
                    <h3>{project.name}</h3>

                    <span className="repository-status repository-status--connected">
                      <span />
                      Conectado
                    </span>
                  </div>

                  <p>
                    {project.description ||
                      "Nenhuma descrição fornecida para este repositório."}
                  </p>

                  <div className="repository-card__metadata">
                    <span className="repository-card__path">
                      <Icon name="git" size={15} />
                      {project.full_name}
                    </span>

                    <span className="repository-card__language">
                      <i
                        style={{
                          background: project.private
                            ? "#64748b"
                            : "#41966a",
                        }}
                      />
                      {project.private ? "Privado" : "Público"}
                    </span>

                    <span>
                      <Icon name="clock" size={14} />
                      Atualizado em {formatDate(project.updated_at)}
                    </span>
                  </div>

                  <div className="repository-card__counts">
                    <span>
                      <Icon name="git-branch" size={15} />
                      Branch principal: {project.default_branch || "Não identificada"}
                    </span>

                    <span>
                      <Icon name="user" size={15} />
                      {project.owner}
                    </span>
                  </div>
                </div>

                <div className="repository-card__actions">
                  <Link
                    to={`/roadmaps/${encodeURIComponent(project.owner)}/${encodeURIComponent(project.name)}`}
                    className="repository-card__roadmap"
                  >
                    Ver roadmap
                    <Icon name="arrow" size={16} />
                  </Link>

                  <button
                    type="button"
                    className="repository-card__details"
                    onClick={() =>
                      setFeedback(
                        `Repositório: ${project.full_name}. Branch principal: ${
                          project.default_branch || "Não identificada"
                        }. Visibilidade: ${
                          project.private ? "Privado" : "Público"
                        }.`
                      )
                    }
                  >
                    Detalhes
                  </button>
                </div>
              </article>
            ))}

          {!loading &&
            !error &&
            filteredProjects.length === 0 && (
              <div className="repositories-empty">
                <span>
                  <Icon name="search" size={25} />
                </span>

                <h3>
                  {projects.length === 0
                    ? "Nenhum repositório disponível"
                    : "Nenhum repositório encontrado"}
                </h3>

                <p>
                  {projects.length === 0
                    ? "Conecte sua conta do GitHub nas configurações para acessar seus repositórios."
                    : "Tente outro termo de busca ou altere o filtro selecionado."}
                </p>

                {projects.length === 0 ? (
                  <Link to="/configuracoes">
                    Ir para configurações
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("Todos");
                    }}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
        </div>
      </section>
    </AppLayout>
  );
}
