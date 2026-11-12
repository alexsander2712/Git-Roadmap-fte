
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import { getRepositories } from "../../api/github";
import "./Dashboard.css";

function formatDate(date) {
  if (!date) return "Não disponível";

  return new Date(date).toLocaleDateString("pt-BR");
}

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

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRepositories() {
      try {
        setLoading(true);
        setError("");

        const response = await getRepositories();

        if (active) {
          setRepositories(
            Array.isArray(response?.repositories)
              ? response.repositories
              : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Não foi possível carregar seus repositórios."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRepositories();

    return () => {
      active = false;
    };
  }, []);

  function getRepositoryOwner(repository) {
    return repository.owner || repository.full_name?.split("/")[0];
  }

  function getRoadmapUrl(repository) {
    const owner = getRepositoryOwner(repository);
    const repo = repository.name;

    return `/roadmaps/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  }

  return (
    <AppLayout breadcrumb="Início">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">VISÃO GERAL</span>
          <h1>Início</h1>
          <p>Acompanhe a evolução dos seus projetos.</p>
        </div>
      </header>

      <section className="dashboard-panel">
        <div className="dashboard-panel__heading">
          <div>
            <h2>Seus Roadmaps</h2>
            <p>
              {loading
                ? "Carregando roadmaps..."
                : `${repositories.length} roadmaps disponíveis`}
            </p>
          </div>
        </div>

        <div className="roadmap-grid">
          {loading ? (
            <p>Carregando seus repositórios...</p>
          ) : error ? (
            <p>{error}</p>
          ) : repositories.length === 0 ? (
            <p>
              Nenhum repositório encontrado. Conecte sua conta do GitHub
              para começar.
            </p>
          ) : (
            repositories.map((repository, index) => (
              <article
                className="roadmap-card"
                key={repository.id || repository.full_name}
              >
                <div className="roadmap-card__preview">
                  <RoadmapPreview variant={(index % 4) + 1} />
                </div>

                <h3 title={repository.name}>{repository.name}</h3>

                <Link
                  className="roadmap-card__button"
                  to={getRoadmapUrl(repository)}
                >
                  Ver
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel__heading">
          <div>
            <h2>Seus Projetos</h2>
            <p>Repositórios recentemente atualizados</p>
          </div>

          <Link to="/repositorios" className="dashboard-panel__link">
            Ver todos
          </Link>
        </div>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Nome do Projeto</th>
                <th>Data</th>
                <th>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3">Carregando projetos...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3">{error}</td>
                </tr>
              ) : repositories.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              ) : (
                repositories.map((repository) => (
                  <tr
                    key={repository.id || repository.full_name}
                  >
                    <td>{repository.name}</td>
                    <td>{formatDate(repository.updated_at)}</td>
                    <td className="projects-table__action">
                      <Link to="/repositorios">Ver</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="dashboard-note">
        Seus repositórios são carregados diretamente da sua conta GitHub.
      </p>
    </AppLayout>
  );
}
