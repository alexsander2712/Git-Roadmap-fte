import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Icon from "../../components/Icon";
import {
  emptyData,
  roadmapsData,
  STATUS_CLASS,
  STATUS_OPTIONS,
} from "./roadmapData";
import "./Roadmap.css";

/* Medidas do grafo horizontal (a linha do tempo corre da esquerda para a direita) */
const COL = 108; // distância horizontal entre commits
const LANE_H = 96; // distância vertical entre branches
const LABEL_W = 124; // área dos nomes das branches, à esquerda
const PAD_TOP = 58;
const PAD_BOTTOM = 62;
const PAD_RIGHT = 56;
const NODE_R = 9;

const emptyForm = {
  tag: "",
  title: "",
  date: "",
  status: "Planejada",
  commit: "",
  description: "",
};

function formatDate(iso) {
  return iso ? iso.split("-").reverse().join("/") : "—";
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function RoadmapView({ id }) {
  const data = roadmapsData[id] || emptyData;
  const { project, branches, commits } = data;

  const [versions, setVersions] = useState(data.versions);
  const [selectedHash, setSelectedHash] = useState(commits[0]?.hash || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!modalOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setModalOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const versionsByCommit = useMemo(() => {
    const map = {};
    versions.forEach((version) => {
      if (version.commit) (map[version.commit] ||= []).push(version);
    });
    return map;
  }, [versions]);

  /* Posição de cada commit e das linhas que ligam commits, branches e merges */
  const layout = useMemo(() => {
    // Branches sem "lane" definida alternam entre acima e abaixo da linha central
    const offsets = branches.map((branch, index) =>
      branch.lane ??
      (index === 0 ? 0 : index % 2 ? -Math.ceil(index / 2) : index / 2)
    );
    const up = Math.max(0, ...offsets.map((offset) => -offset));
    const down = Math.max(0, ...offsets);
    const mainY = PAD_TOP + up * LANE_H;

    const lanes = branches.map((branch, index) => ({
      ...branch,
      y: mainY + offsets[index] * LANE_H,
    }));
    const laneOf = (name) => lanes.find((lane) => lane.name === name);

    // do commit mais antigo (esquerda) para o mais recente (direita)
    const nodes = [...commits].reverse().map((commit, index) => {
      const lane = laneOf(commit.branch);
      return {
        ...commit,
        x: LABEL_W + index * COL,
        y: lane ? lane.y : mainY,
        color: lane ? lane.color : "#64748b",
        isMerge: commit.parents.length > 1,
      };
    });

    const byHash = new Map(nodes.map((node) => [node.hash, node]));
    const edges = [];

    nodes.forEach((child) => {
      child.parents.forEach((parentHash, parentIndex) => {
        const parent = byHash.get(parentHash);
        if (!parent) return;

        const run = Math.min(COL * 0.75, child.x - parent.x);
        let d;

        if (parent.y === child.y) {
          d = `M${parent.x} ${parent.y}H${child.x}`;
        } else if (parentIndex > 0) {
          // merge: segue pela branch mesclada e sobe/desce até o commit de merge
          d = `M${parent.x} ${parent.y}H${child.x - run}L${child.x} ${child.y}`;
        } else {
          // criação de branch: sai do commit de origem e segue pela nova branch
          d = `M${parent.x} ${parent.y}L${parent.x + run} ${child.y}H${child.x}`;
        }

        edges.push({
          key: `${child.hash}-${parentHash}`,
          d,
          color: parentIndex > 0 ? parent.color : child.color,
        });
      });
    });

    return {
      lanes,
      nodes,
      edges,
      width: LABEL_W + Math.max(nodes.length - 1, 0) * COL + PAD_RIGHT,
      height: PAD_TOP + (up + down) * LANE_H + PAD_BOTTOM,
    };
  }, [branches, commits]);

  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => b.date.localeCompare(a.date)),
    [versions]
  );

  const selectedCommit = layout.nodes.find((node) => node.hash === selectedHash);
  const mergesCount = commits.filter((commit) => commit.parents.length > 1).length;
  const lastUpdate = commits[0]?.date;

  function openCreateModal(commit) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: commit?.date || "",
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
    setForm((current) => ({ ...current, [field]: value }));
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

    if (!version.tag || !version.title || !version.date) return;

    if (editingId) {
      setVersions((current) =>
        current.map((item) => (item.id === editingId ? { ...item, ...version } : item))
      );
      setFeedback(`Versão ${version.tag} atualizada nesta sessão.`);
    } else {
      setVersions((current) => [{ id: Date.now(), ...version }, ...current]);
      setFeedback(`Versão ${version.tag} criada nesta sessão.`);
    }

    setModalOpen(false);
  }

  function handleDeleteVersion(version) {
    if (!window.confirm(`Excluir a versão ${version.tag}?`)) return;

    setVersions((current) => current.filter((item) => item.id !== version.id));
    setFeedback(`Versão ${version.tag} excluída nesta sessão.`);
  }

  return (
    <AppLayout breadcrumb="Meus Projetos / Roadmap" navigation="top">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">ROADMAP DO PROJETO</span>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className="roadmap-heading-actions">
          <Link to="/repositorios" className="roadmap-back-button">
            <Icon name="arrow" size={16} />
            Meus Projetos
          </Link>
          <button type="button" className="app-button" onClick={() => openCreateModal()}>
            <Icon name="plus" size={18} />
            Nova versão
          </button>
        </div>
      </header>

      <div className="roadmap-meta">
        <span><Icon name="git" size={15} /> {project.repository}</span>
        <span>
          <i style={{ background: project.color }} />
          {project.language}
        </span>
        {lastUpdate && (
          <span><Icon name="clock" size={14} /> Último commit em {formatDate(lastUpdate)}</span>
        )}
      </div>

      {feedback && (
        <div className="app-feedback" role="status">
          {feedback}
          <button type="button" onClick={() => setFeedback("")} aria-label="Fechar aviso">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section className="roadmap-panel roadmap-graph-panel">
        <header className="roadmap-panel__heading">
          <div>
            <h2>Roadmap</h2>
            <p>Evolução do repositório, do commit mais antigo ao mais recente. Clique em um commit para ver os detalhes.</p>
          </div>
          {branches.length > 0 && (
            <ul className="roadmap-legend" aria-label="Legenda">
              {branches.map((branch) => (
                <li key={branch.name}>
                  <i style={{ background: branch.color }} />
                  {branch.name}
                </li>
              ))}
              <li><i className="roadmap-legend__merge" /> merge</li>
            </ul>
          )}
        </header>

        {commits.length > 0 ? (
          <div className="roadmap-graph">
            <svg
              width={layout.width}
              height={layout.height}
              role="group"
              aria-label="Grafo horizontal de commits, branches e merges"
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
                  <text className="roadmap-lane__label" x={14} y={lane.y + 4} fill={lane.color}>
                    {truncate(lane.name, 15)}
                  </text>
                </g>
              ))}

              {layout.edges.map((edge) => (
                <path
                  key={edge.key}
                  d={edge.d}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {layout.nodes.map((node) => {
                const tags = (versionsByCommit[node.hash] || []).map((v) => v.tag).join(", ");
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
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedHash(node.hash);
                      }
                    }}
                  >
                    <title>{`${node.hash} · ${node.message}`}</title>
                    <circle className="roadmap-node__halo" cx={node.x} cy={node.y} r="17" fill={node.color} />
                    <circle cx={node.x} cy={node.y} r="20" fill="transparent" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.isMerge ? NODE_R + 1 : NODE_R}
                      fill={node.isMerge ? "#fff" : node.color}
                      stroke={node.color}
                      strokeWidth={node.isMerge ? 3.5 : 0}
                    />
                    <text className="roadmap-node__hash" x={node.x} y={node.y + 30}>
                      {node.hash}
                    </text>
                    <text className="roadmap-node__message" x={node.x} y={node.y + 44}>
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
                        <text className="roadmap-node__flag-text" x={node.x} y={node.y - 29}>
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
            <span><Icon name="git" size={25} /></span>
            <h3>Nenhum commit disponível</h3>
            <p>
              Os commits, branches e merges serão carregados quando a integração
              com o GitHub for implementada. Você já pode criar as versões do roadmap.
            </p>
          </div>
        )}
      </section>

      <section className="roadmap-stats" aria-label="Resumo do roadmap">
        <article className="roadmap-stat">
          <span className="roadmap-stat__icon roadmap-stat__icon--red"><Icon name="tag" /></span>
          <div><span>Versões</span><strong>{versions.length}</strong></div>
        </article>
        <article className="roadmap-stat">
          <span className="roadmap-stat__icon roadmap-stat__icon--blue"><Icon name="branch" /></span>
          <div><span>Branches</span><strong>{branches.length}</strong></div>
        </article>
        <article className="roadmap-stat">
          <span className="roadmap-stat__icon roadmap-stat__icon--green"><Icon name="commit" /></span>
          <div><span>Commits</span><strong>{commits.length}</strong></div>
        </article>
        <article className="roadmap-stat">
          <span className="roadmap-stat__icon roadmap-stat__icon--purple"><Icon name="network" /></span>
          <div><span>Merges</span><strong>{mergesCount}</strong></div>
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
                <div><dt>Hash</dt><dd><code>{selectedCommit.hash}</code></dd></div>
                <div>
                  <dt>Branch</dt>
                  <dd>
                    <span className="roadmap-branch-chip" style={{ "--branch-color": selectedCommit.color }}>
                      {selectedCommit.branch}
                    </span>
                  </dd>
                </div>
                <div><dt>Autor</dt><dd>{selectedCommit.author}</dd></div>
                <div><dt>Data</dt><dd>{formatDate(selectedCommit.date)}</dd></div>
                <div><dt>Tipo</dt><dd>{selectedCommit.isMerge ? "Merge" : "Commit"}</dd></div>
                <div>
                  <dt>Pais</dt>
                  <dd>
                    {selectedCommit.parents.length > 0
                      ? selectedCommit.parents.map((parent) => <code key={parent}>{parent}</code>)
                      : "Nenhum (commit inicial)"}
                  </dd>
                </div>
              </dl>
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
            <p className="roadmap-muted">Selecione um commit no roadmap para ver os detalhes.</p>
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
                    <span className="roadmap-version__tag">{version.tag}</span>
                    <span className={`roadmap-status roadmap-status--${STATUS_CLASS[version.status]}`}>
                      <span />
                      {version.status}
                    </span>
                  </div>
                  <h3>{version.title}</h3>
                  <p className="roadmap-version__date">
                    <Icon name="calendar" size={13} /> {formatDate(version.date)}
                    {version.commit && (
                      <>
                        {" · "}
                        <button type="button" onClick={() => setSelectedHash(version.commit)}>
                          commit {version.commit}
                        </button>
                      </>
                    )}
                  </p>
                  <p className="roadmap-version__description">
                    {version.description || "Nenhuma descrição informada."}
                  </p>
                  <div className="roadmap-version__actions">
                    <button type="button" onClick={() => openEditModal(version)}>
                      <Icon name="edit" size={13} /> Editar
                    </button>
                    <button type="button" onClick={() => handleDeleteVersion(version)}>
                      <Icon name="trash" size={13} /> Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="roadmap-muted">
              Nenhuma versão criada. Use “Nova versão” para documentar a evolução do projeto.
            </p>
          )}
        </section>
      </div>

      <p className="roadmap-note">
        Exibindo dados demonstrativos. Os commits reais serão carregados após a integração com o
        GitHub, e as versões e descrições serão salvas após a integração com o backend.
      </p>

      {modalOpen && (
        <div
          className="roadmap-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
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
                <span className="app-eyebrow">{editingId ? "EDITAR VERSÃO" : "NOVA VERSÃO"}</span>
                <h2 id="roadmap-modal-title">{editingId ? "Editar versão" : "Criar versão"}</h2>
                <p>Descreva o que muda nesta etapa da evolução do projeto.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Fechar">
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
                    onChange={(event) => updateForm("tag", event.target.value)}
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
                    onChange={(event) => updateForm("date", event.target.value)}
                    required
                  />
                </div>
              </div>

              <label htmlFor="version-title">Título</label>
              <input
                id="version-title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
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
                    onChange={(event) => updateForm("status", event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="version-commit">Commit vinculado</label>
                  <select
                    id="version-commit"
                    value={form.commit}
                    onChange={(event) => updateForm("commit", event.target.value)}
                  >
                    <option value="">Nenhum</option>
                    {commits.map((commit) => (
                      <option key={commit.hash} value={commit.hash}>
                        {commit.hash} · {commit.message}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="version-description">Descrição</label>
              <textarea
                id="version-description"
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="O que foi (ou será) entregue nesta versão?"
                maxLength={400}
                rows={4}
              />

              <div className="roadmap-modal__actions">
                <button type="button" className="roadmap-secondary-button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="app-button">
                  {editingId ? "Salvar alterações" : "Criar versão"}
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
  const { id } = useParams();

  // key reinicia o estado ao trocar de projeto
  return <RoadmapView key={id} id={id} />;
}