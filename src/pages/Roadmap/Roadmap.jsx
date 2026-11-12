
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Icon from "../../components/Icon";
import { getGraph } from "../../api/github";
import "./Roadmap.css";

const COL = 108;
const LANE_H = 96;
const LABEL_W = 124;
const PAD_TOP = 58;
const PAD_BOTTOM = 62;
const PAD_RIGHT = 56;
const NODE_R = 9;

const BRANCH_COLORS = [
  "#d83232",
  "#3d73c6",
  "#2b8a53",
  "#7957be",
  "#d99320",
  "#168c91",
  "#64748b",
];

const STATUS_OPTIONS = ["Concluída", "Em andamento", "Planejada"];

const STATUS_CLASS = {
  "Concluída": "done",
  "Em andamento": "progress",
  "Planejada": "planned",
};

const emptyForm = {
  tag: "",
  title: "",
  date: "",
  status: "Planejada",
  commit: "",
  description: "",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("pt-BR");
}

function truncate(value = "", max = 20) {
  const text = String(value);

  return text.length > max
    ? `${text.slice(0, max - 1)}…`
    : text;
}

function RoadmapView({ owner, repo }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedHash, setSelectedHash] = useState("");
  const [versions, setVersions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState("");

  async function loadGraph() {
    try {
      setLoading(true);
      setError("");

      const response = await getGraph(owner, repo);
      const data = response.graph || response;

      if (
        !data ||
        !Array.isArray(data.nodes) ||
        !Array.isArray(data.branches) ||
        !Array.isArray(data.edges)
      ) {
        throw new Error(
          "O formato do grafo retornado pela API é inválido."
        );
      }

      setGraph(data);

      const newestCommit = [...data.nodes].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];

      setSelectedHash(newestCommit?.id || "");
    } catch (err) {
      console.error("Erro ao carregar roadmap:", err);

      setGraph(null);
      setError(
        err.message ||
        "Não foi possível carregar o grafo do repositório."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGraph();
  }, [owner, repo]);

  useEffect(() => {
    if (!modalOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);

  const commits = useMemo(() => {
    if (!graph) return [];

    return [...graph.nodes].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [graph]);

  const branches = useMemo(() => {
    if (!graph) return [];

    return graph.branches.map((branch, index) => ({
      ...branch,
      color: BRANCH_COLORS[index % BRANCH_COLORS.length],
      lane:
        index === 0
          ? 0
          : index % 2
            ? -Math.ceil(index / 2)
            : index / 2,
    }));
  }, [graph]);

  const versionsByCommit = useMemo(() => {
    const map = {};

    versions.forEach((version) => {
      if (version.commit) {
        (map[version.commit] ||= []).push(version);
      }
    });

    return map;
  }, [versions]);

  const layout = useMemo(() => {
    if (!commits.length) {
      return {
        lanes: [],
        nodes: [],
        edges: [],
        width: 500,
        height: 250,
      };
    }

    const offsets = branches.map((branch) => branch.lane);

    const up = Math.max(
      0,
      ...offsets.map((offset) => -offset)
    );

    const down = Math.max(0, ...offsets);

    const mainY = PAD_TOP + up * LANE_H;

    const lanes = branches.map((branch) => ({
      ...branch,
      y: mainY + branch.lane * LANE_H,
    }));

    const laneOf = (name) =>
      lanes.find((lane) => lane.name === name);

    const nodes = commits.map((commit, index) => {
      const branchName =
        commit.branches?.[0] || branches[0]?.name;

      const lane = laneOf(branchName);

      return {
        ...commit,
        hash: commit.id,
        branch: branchName || "Sem branch",
        x: LABEL_W + index * COL,
        y: lane ? lane.y : mainY,
        color: lane?.color || "#64748b",
        parents: commit.parents || [],
        isMerge: Boolean(commit.is_merge),
      };
    });

    const byHash = new Map(
      nodes.map((node) => [node.hash, node])
    );

    const edges = [];

    nodes.forEach((child) => {
      child.parents.forEach((parentHash, parentIndex) => {
        const parent = byHash.get(parentHash);

        if (!parent) return;

        const run = Math.min(
          COL * 0.75,
          child.x - parent.x
        );

        let path;

        if (parent.y === child.y) {
          path = `M${parent.x} ${parent.y}H${child.x}`;
        } else if (parentIndex > 0) {
          path = `M${parent.x} ${parent.y}H${child.x - run}L${child.x} ${child.y}`;
        } else {
          path = `M${parent.x} ${parent.y}L${parent.x + run} ${child.y}H${child.x}`;
        }

        edges.push({
          key: `${child.hash}-${parentHash}`,
          path,
          color: parentIndex > 0
            ? parent.color
            : child.color,
        });
      });
    });

    return {
      lanes,
      nodes,
      edges,
      width:
        LABEL_W +
        Math.max(nodes.length - 1, 0) * COL +
        PAD_RIGHT,
      height:
        PAD_TOP +
        (up + down) * LANE_H +
        PAD_BOTTOM,
    };
  }, [branches, commits]);

  const selectedCommit = layout.nodes.find(
    (node) => node.hash === selectedHash
  );

  const sortedVersions = useMemo(
    () =>
      [...versions].sort(
        (a, b) => b.date.localeCompare(a.date)
      ),
    [versions]
  );

  const statistics = graph?.statistics || {};

  const mergesCount =
    statistics.total_merges ??
    commits.filter((commit) => commit.is_merge).length;

  const lastUpdate = [...commits].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0]?.date;

  function openCreateModal(commit) {
    setEditingId(null);

    setForm({
      ...emptyForm,
      date: commit?.date
        ? new Date(commit.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      commit: commit?.hash || "",
    });

    setModalOpen(true);
  }

  function openEditModal(version) {
    setEditingId(version.id);

    setForm({
      tag: version.tag,
      title: version.title,
      date: version.date,
      status: version.status,
      commit: version.commit,
      description: version.description,
    });

    setModalOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSaveVersion(event) {
    event.preventDefault();

    const version = {
      tag: form.tag.trim(),
      title: form.title.trim(),
      date: form.date,
      status: form.status,
      commit: form.commit,
      description: form.description.trim(),
    };

    if (!version.tag || !version.title || !version.date) {
      return;
    }

    if (editingId !== null) {
      setVersions((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, ...version }
            : item
        )
      );

      setFeedback(
        `Versão ${version.tag} atualizada nesta sessão.`
      );
    } else {
      setVersions((current) => [
        { id: Date.now(), ...version },
        ...current,
      ]);

      setFeedback(
        `Versão ${version.tag} criada nesta sessão.`
      );
    }

    setModalOpen(false);
  }

  function handleDeleteVersion(version) {
    if (!window.confirm(`Excluir a versão ${version.tag}?`)) {
      return;
    }

    setVersions((current) =>
      current.filter((item) => item.id !== version.id)
    );

    setFeedback(
      `Versão ${version.tag} excluída nesta sessão.`
    );
  }

  return (
    <AppLayout breadcrumb="Meus Projetos / Roadmap">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">
            ROADMAP DO PROJETO
          </span>

          <h1>{repo}</h1>

          <p>{graph?.repository || `${owner}/${repo}`}</p>
        </div>

        <div className="roadmap-heading-actions">
          <Link
            to="/repositorios"
            className="roadmap-back-button"
          >
            <Icon name="arrow" size={16} />
            Meus Projetos
          </Link>

          <button
            type="button"
            className="roadmap-secondary-button"
            onClick={loadGraph}
            disabled={loading}
          >
            <Icon name="refresh-cw" size={16} />
            Atualizar grafo
          </button>

          <button
            type="button"
            className="app-button"
            onClick={() => openCreateModal(selectedCommit)}
            disabled={!graph}
          >
            <Icon name="plus" size={18} />
            Nova versão
          </button>
        </div>
      </header>

      <div className="roadmap-meta">
        <span>
          <Icon name="git" size={15} />
          {owner}/{repo}
        </span>

        <span>
          <Icon name="clock" size={14} />
          Último commit em {formatDate(lastUpdate)}
        </span>

        {graph?.repository && (
          <span>
            <i style={{ background: "#2b8a53" }} />
            GitHub conectado
          </span>
        )}
      </div>

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

      {loading && (
        <section className="roadmap-panel">
          <div className="roadmap-empty">
            <span>
              <Icon name="refresh-cw" size={25} />
            </span>

            <h3>Carregando roadmap</h3>

            <p>
              Buscando commits, branches e merges no GitHub.
            </p>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="roadmap-panel">
          <div className="roadmap-empty">
            <span>
              <Icon name="alert-circle" size={25} />
            </span>

            <h3>Não foi possível carregar o roadmap</h3>

            <p>{error}</p>

            <button
              type="button"
              className="roadmap-secondary-button"
              onClick={loadGraph}
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}

      {!loading && graph && (
        <>
          <section className="roadmap-panel roadmap-graph-panel">
            <header className="roadmap-panel__heading">
              <div>
                <h2>Roadmap</h2>

                <p>
                  Evolução do repositório, do commit mais antigo ao
                  mais recente. Clique em um commit para ver os detalhes.
                </p>
              </div>

              {branches.length > 0 && (
                <ul
                  className="roadmap-legend"
                  aria-label="Legenda"
                >
                  {branches.map((branch) => (
                    <li key={branch.name}>
                      <i style={{ background: branch.color }} />
                      {branch.name}
                    </li>
                  ))}

                  <li>
                    <i className="roadmap-legend__merge" />
                    merge
                  </li>
                </ul>
              )}
            </header>

            {commits.length > 0 ? (
              <div className="roadmap-graph">
                <svg
                  width={layout.width}
                  height={layout.height}
                  role="group"
                  aria-label="Grafo de commits, branches e merges"
                >
                  {layout.lanes.map((lane) => (
                    <g key={lane.name}>
                      <line
                        className="roadmap-lane__guide"
                        x1={LABEL_W - 28}
                        x2={layout.width - 16}
                        y1={lane.y}
                        y2={lane.y}
                      />

                      <text
                        className="roadmap-lane__label"
                        x={14}
                        y={lane.y + 4}
                        fill={lane.color}
                      >
                        {truncate(lane.name, 15)}
                      </text>
                    </g>
                  ))}

                  {layout.edges.map((edge) => (
                    <path
                      key={edge.key}
                      d={edge.path}
                      fill="none"
                      stroke={edge.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {layout.nodes.map((node) => {
                    const tags = (
                      versionsByCommit[node.hash] || []
                    )
                      .map((version) => version.tag)
                      .join(", ");

                    const tagWidth = tags.length * 6.4 + 20;
                    const selected = node.hash === selectedHash;

                    return (
                      <g
                        key={node.hash}
                        className={`roadmap-node ${selected ? "is-selected" : ""}`}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selected}
                        aria-label={`Commit ${node.hash}: ${node.message}`}
                        onClick={() => setSelectedHash(node.hash)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            setSelectedHash(node.hash);
                          }
                        }}
                      >
                        <title>
                          {`${node.hash} · ${node.message}`}
                        </title>

                        <circle
                          className="roadmap-node__halo"
                          cx={node.x}
                          cy={node.y}
                          r="17"
                          fill={node.color}
                        />

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="20"
                          fill="transparent"
                        />

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.isMerge ? NODE_R + 1 : NODE_R}
                          fill={node.isMerge ? "#fff" : node.color}
                          stroke={node.color}
                          strokeWidth={node.isMerge ? 3.5 : 0}
                        />

                        <text
                          className="roadmap-node__hash"
                          x={node.x}
                          y={node.y + 30}
                        >
                          {node.short_sha}
                        </text>

                        <text
                          className="roadmap-node__message"
                          x={node.x}
                          y={node.y + 44}
                        >
                          {truncate(node.message, 16)}
                        </text>

                        {tags && (
                          <g>
                            <rect
                              className="roadmap-node__flag"
                              x={node.x - tagWidth / 2}
                              y={node.y - 42}
                              width={tagWidth}
                              height="19"
                              rx="9.5"
                            />

                            <text
                              className="roadmap-node__flag-text"
                              x={node.x}
                              y={node.y - 29}
                            >
                              {tags}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="roadmap-empty">
                <span>
                  <Icon name="git" size={25} />
                </span>

                <h3>Nenhum commit disponível</h3>

                <p>
                  Este repositório ainda não possui commits para exibir.
                </p>
              </div>
            )}
          </section>

          <section
            className="roadmap-stats"
            aria-label="Resumo do roadmap"
          >
            <article className="roadmap-stat">
              <span className="roadmap-stat__icon roadmap-stat__icon--red">
                <Icon name="tag" />
              </span>

              <div>
                <span>Versões</span>
                <strong>{versions.length}</strong>
              </div>
            </article>

            <article className="roadmap-stat">
              <span className="roadmap-stat__icon roadmap-stat__icon--blue">
                <Icon name="branch" />
              </span>

              <div>
                <span>Branches</span>
                <strong>
                  {statistics.total_branches ?? branches.length}
                </strong>
              </div>
            </article>

            <article className="roadmap-stat">
              <span className="roadmap-stat__icon roadmap-stat__icon--green">
                <Icon name="commit" />
              </span>

              <div>
                <span>Commits</span>
                <strong>
                  {statistics.total_commits ?? commits.length}
                </strong>
              </div>
            </article>

            <article className="roadmap-stat">
              <span className="roadmap-stat__icon roadmap-stat__icon--purple">
                <Icon name="network" />
              </span>

              <div>
                <span>Merges</span>
                <strong>{mergesCount}</strong>
              </div>
            </article>
          </section>

          <div className="roadmap-details-grid">
            <section className="roadmap-panel">
              <header className="roadmap-panel__heading">
                <h2>Commit selecionado</h2>
              </header>

              {selectedCommit ? (
                <div className="roadmap-detail">
                  <h3>{selectedCommit.message}</h3>

                  <dl>
                    <div>
                      <dt>Hash</dt>
                      <dd>
                        <code>{selectedCommit.hash}</code>
                      </dd>
                    </div>

                    <div>
                      <dt>Branch</dt>
                      <dd>
                        <span
                          className="roadmap-branch-chip"
                          style={{
                            "--branch-color": selectedCommit.color,
                          }}
                        >
                          {selectedCommit.branch}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt>Autor</dt>
                      <dd>
                        {selectedCommit.author || "Não identificado"}
                      </dd>
                    </div>

                    <div>
                      <dt>Data</dt>
                      <dd>{formatDate(selectedCommit.date)}</dd>
                    </div>

                    <div>
                      <dt>Tipo</dt>
                      <dd>
                        {selectedCommit.isMerge ? "Merge" : "Commit"}
                      </dd>
                    </div>

                    <div>
                      <dt>Pais</dt>
                      <dd>
                        {selectedCommit.parents.length > 0
                          ? selectedCommit.parents.map((parent) => (
                              <code key={parent}>
                                {truncate(parent, 12)}
                              </code>
                            ))
                          : "Nenhum (commit inicial)"}
                      </dd>
                    </div>
                  </dl>

                  {selectedCommit.html_url && (
                    <a
                      href={selectedCommit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-secondary-button"
                    >
                      <Icon name="git" size={15} />
                      Abrir commit no GitHub
                    </a>
                  )}

                  <button
                    type="button"
                    className="roadmap-secondary-button"
                    onClick={() => openCreateModal(selectedCommit)}
                  >
                    <Icon name="tag" size={15} />
                    Criar versão neste commit
                  </button>
                </div>
              ) : (
                <p className="roadmap-muted">
                  Selecione um commit no roadmap para ver os detalhes.
                </p>
              )}
            </section>

            <section className="roadmap-panel">
              <header className="roadmap-panel__heading">
                <div>
                  <h2>Versões</h2>
                  <p>Etapas do projeto e suas descrições</p>
                </div>
              </header>

              {sortedVersions.length > 0 ? (
                <ol className="roadmap-versions">
                  {sortedVersions.map((version) => (
                    <li
                      key={version.id}
                      className={`roadmap-version roadmap-version--${STATUS_CLASS[version.status]}`}
                    >
                      <div className="roadmap-version__top">
                        <span className="roadmap-version__tag">
                          {version.tag}
                        </span>

                        <span className="roadmap-status">
                          <span />
                          {version.status}
                        </span>
                      </div>

                      <h3>{version.title}</h3>

                      <p className="roadmap-version__date">
                        <Icon name="calendar" size={13} />
                        {formatDate(version.date)}

                        {version.commit && (
                          <>
                            {" · "}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHash(version.commit)
                              }
                            >
                              commit {truncate(version.commit, 10)}
                            </button>
                          </>
                        )}
                      </p>

                      <p className="roadmap-version__description">
                        {version.description ||
                          "Nenhuma descrição informada."}
                      </p>

                      <div className="roadmap-version__actions">
                        <button
                          type="button"
                          onClick={() => openEditModal(version)}
                        >
                          <Icon name="edit" size={13} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVersion(version)}
                        >
                          <Icon name="trash" size={13} />
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="roadmap-muted">
                  Nenhuma versão criada. Use “Nova versão” para documentar
                  a evolução do projeto.
                </p>
              )}
            </section>
          </div>

          <p className="roadmap-note">
            Commits, branches e merges carregados diretamente do GitHub.
            As versões criadas nesta página ainda não são persistidas no banco.
          </p>
        </>
      )}

      {modalOpen && (
        <div
          className="roadmap-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <section
            className="roadmap-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-modal-title"
          >
            <header className="roadmap-modal__heading">
              <div>
                <span className="app-eyebrow">
                  {editingId !== null
                    ? "EDITAR VERSÃO"
                    : "NOVA VERSÃO"}
                </span>

                <h2 id="roadmap-modal-title">
                  {editingId !== null
                    ? "Editar versão"
                    : "Criar versão"}
                </h2>

                <p>
                  Descreva o que muda nesta etapa da evolução do projeto.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                <Icon name="close" />
              </button>
            </header>

            <form onSubmit={handleSaveVersion}>
              <div className="roadmap-modal__row">
                <div>
                  <label htmlFor="version-tag">Versão</label>

                  <input
                    id="version-tag"
                    value={form.tag}
                    onChange={(event) =>
                      updateForm("tag", event.target.value)
                    }
                    placeholder="Ex.: v1.4.0"
                    maxLength={20}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="version-date">Data</label>

                  <input
                    id="version-date"
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      updateForm("date", event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <label htmlFor="version-title">Título</label>

              <input
                id="version-title"
                value={form.title}
                onChange={(event) =>
                  updateForm("title", event.target.value)
                }
                placeholder="Ex.: Relatórios de desempenho"
                maxLength={80}
                required
              />

              <div className="roadmap-modal__row">
                <div>
                  <label htmlFor="version-status">Status</label>

                  <select
                    id="version-status"
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="version-commit">
                    Commit vinculado
                  </label>

                  <select
                    id="version-commit"
                    value={form.commit}
                    onChange={(event) =>
                      updateForm("commit", event.target.value)
                    }
                  >
                    <option value="">Nenhum</option>

                    {commits.map((commit) => (
                      <option key={commit.id} value={commit.id}>
                        {commit.short_sha} · {truncate(commit.message, 35)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="version-description">Descrição</label>

              <textarea
                id="version-description"
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="O que foi (ou será) entregue nesta versão?"
                maxLength={400}
                rows={4}
              />

              <div className="roadmap-modal__actions">
                <button
                  type="button"
                  className="roadmap-secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="app-button">
                  {editingId !== null
                    ? "Salvar alterações"
                    : "Criar versão"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AppLayout>
  );
}

export default function Roadmap() {
  const { owner, repo } = useParams();

  return (
    <RoadmapView
      key={`${owner}/${repo}`}
      owner={owner}
      repo={repo}
    />
  );
}
