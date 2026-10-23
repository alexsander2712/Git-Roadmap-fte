
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

const initialProfile = {
  name: "Alexsander Caldeirão Ribeiro Filho",
  email: "alexsander@email.com",
  username: "alexsander",
  bio: "Estudante de desenvolvimento de sistemas.",
};

const projects = [
  {
    id: 1,
    name: "GitRoadmap",
    repository: "github.com/usuario/gitroadmap",
    updatedAt: "10/09/2026",
    color: "#172b3b",
  },
  {
    id: 2,
    name: "Academy Quest",
    repository: "github.com/usuario/academy-quest",
    updatedAt: "05/09/2026",
    color: "#1769e0",
  },
  {
    id: 3,
    name: "Eco2Eco",
    repository: "github.com/usuario/eco2eco",
    updatedAt: "28/08/2026",
    color: "#269b61",
  },
  {
    id: 4,
    name: "AdivinhaAiDev",
    repository: "github.com/usuario/adivinha-ai-dev",
    updatedAt: "20/08/2026",
    color: "#8256d9",
  },
];

const activities = [
  {
    id: 1,
    text: "Criou um novo roadmap para o projeto GitRoadmap",
    date: "10/09/2026 14:32",
  },
  {
    id: 2,
    text: "Acessou o projeto Eco2Eco",
    date: "09/09/2026 18:11",
  },
  {
    id: 3,
    text: "Atualizou as configurações do perfil",
    date: "08/09/2026 21:45",
  },
  {
    id: 4,
    text: "Gerou um novo roadmap no projeto Academy Quest",
    date: "05/09/2026 09:17",
  },
];

function Icon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
    folder: <><path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 9h18" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13.5 2 1.5-2 3-2.3-.8a7 7 0 0 1-2 1.1L14.3 21h-4.6l-.4-2.7a7 7 0 0 1-2-1.1L5 18l-2-3 2-1.5a7 7 0 0 1 0-2.3L3 9.7l2-3 2.3.8a7 7 0 0 1 2-1.1L9.7 4h4.6l.4 2.4a7 7 0 0 1 2 1.1L19 6.7l2 3-2 1.5a7 7 0 0 1 0 2.3Z" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    camera: <><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="3.5" /></>,
    branch: <><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 6v12M18 9a7 7 0 0 1-7 7H8" /></>,
    network: <><circle cx="12" cy="5" r="3" /><circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" /><path d="m10.5 7.5-4 8m7-8 4 8M8 18h8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    external: <><path d="M13 5h6v6M19 5l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    git: <><path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 1 0 3-3V9a3 3 0 0 0 0-6Z" /><circle cx="12" cy="6" r="1" /><circle cx="9" cy="10" r="1" /><circle cx="12" cy="18" r="1" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.user}
    </svg>
  );
}

function ProjectMark({ project }) {
  return (
    <span
      className="profile-project-mark"
      style={{ "--project-color": project.color }}
    >
      <Icon name="git" size={17} />
    </span>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [photo, setPhoto] = useState("");

  function startEditing() {
    setDraft(profile);
    setNotice("");
    setEditing(true);
  }

  function handleSave(event) {
    event.preventDefault();

    setProfile(draft);
    setEditing(false);
    setNotice("Perfil atualizado nesta sessão.");
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("A imagem deve ter no máximo 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(String(reader.result));
      setNotice("Foto atualizada nesta sessão.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <main className="profile-page">
      <aside className="profile-sidebar">
        <Link to="/dashboard" className="profile-brand" aria-label="GitRoadmap, início">
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

        <nav className="profile-nav" aria-label="Navegação principal">
          <Link to="/dashboard" className="profile-nav__item">
            <Icon name="home" /><span>Início</span>
          </Link>
          <Link to="/repositorios" className="profile-nav__item">
            <Icon name="folder" /><span>Meus Projetos</span>
          </Link>
          <Link to="/perfil" className="profile-nav__item is-active">
            <Icon name="user" /><span>Perfil</span>
          </Link>
          <Link to="/configuracoes" className="profile-nav__item">
            <Icon name="settings" /><span>Configurações</span>
          </Link>
          <Link to="/cadastro" className="profile-nav__item">
            <Icon name="logout" /><span>Sair</span>
          </Link>
        </nav>

        <div className="profile-sidebar__footer">
          <span className="profile-sidebar__avatar">
            {profile.name.trim().charAt(0).toUpperCase() || "U"}
          </span>
          <div>
            <strong>{profile.username || "Usuário"}</strong>
            <small>Minha conta</small>
          </div>
        </div>
      </aside>

      <section className="profile-main">
        <header className="profile-topbar">
          <span>Perfil</span>
          <button type="button" className="profile-topbar__user" aria-label="Conta do usuário">
            <Icon name="user" size={17} />
            <span>⌄</span>
          </button>
        </header>

        <div className="profile-content">
          <header className="profile-heading">
            <div>
              <h1>Meu Perfil</h1>
              <p>Gerencie suas informações, preferências e acompanhe suas atividades.</p>
            </div>
          </header>

          {notice && (
            <div className="profile-notice" role="status">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso">×</button>
            </div>
          )}

          <section className="profile-personal-card">
            <div className="profile-photo-column">
              <div className="profile-photo">
                {photo ? (
                  <img src={photo} alt="Foto de perfil" />
                ) : (
                  <Icon name="user" size={54} />
                )}
              </div>

              <label className="profile-photo-button">
                <Icon name="camera" size={14} />
                Alterar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  aria-label="Selecionar foto de perfil"
                />
              </label>
              <span className="profile-photo-hint">Imagem até 2 MB</span>
            </div>

            <div className="profile-personal-info">
              <div className="profile-card-title">
                <h2>Informações Pessoais</h2>
                {!editing && (
                  <button type="button" className="profile-edit-button" onClick={startEditing}>
                    <Icon name="edit" size={14} />
                    Editar perfil
                  </button>
                )}
              </div>

              {editing ? (
                <form className="profile-edit-form" onSubmit={handleSave}>
                  <label htmlFor="profile-name">Nome completo</label>
                  <input
                    id="profile-name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    maxLength={100}
                    required
                  />

                  <label htmlFor="profile-email">E-mail</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                    maxLength={254}
                    required
                  />

                  <label htmlFor="profile-username">Usuário</label>
                  <input
                    id="profile-username"
                    value={draft.username}
                    onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                    maxLength={30}
                    required
                  />

                  <label htmlFor="profile-bio">Sobre mim</label>
                  <textarea
                    id="profile-bio"
                    value={draft.bio}
                    onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                    maxLength={250}
                    rows={2}
                  />

                  <div className="profile-edit-actions">
                    <button type="button" className="profile-cancel-button" onClick={handleCancel}>
                      Cancelar
                    </button>
                    <button type="submit" className="profile-save-button">
                      Salvar alterações
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="profile-details">
                  <div>
                    <dt>Nome</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{profile.email}</dd>
                  </div>
                  <div>
                    <dt>Usuário</dt>
                    <dd>{profile.username}</dd>
                  </div>
                  <div className="profile-details__bio">
                    <dt>Sobre mim</dt>
                    <dd>{profile.bio || "Nenhuma descrição informada."}</dd>
                  </div>
                </dl>
              )}
            </div>
          </section>

          <div className="profile-lower-grid">
            <section className="profile-panel profile-projects-panel">
              <header className="profile-panel__heading">
                <div>
                  <h2>Meus Projetos</h2>
                  <p>Projetos acompanhados recentemente</p>
                </div>
                <Link to="/repositorios" className="profile-text-link">Ver todos</Link>
              </header>

              <div className="profile-table-wrapper">
                <table className="profile-projects-table">
                  <thead>
                    <tr>
                      <th>Nome do Projeto</th>
                      <th>Repositório</th>
                      <th>Última atualização</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <span className="profile-project-name">
                            <ProjectMark project={project} />
                            <strong>{project.name}</strong>
                          </span>
                        </td>
                        <td>
                          <span className="profile-repository-url">{project.repository}</span>
                        </td>
                        <td>{project.updatedAt}</td>
                        <td>
                          <Link
                            to={`/roadmaps/${project.id}`}
                            className="profile-view-button"
                            aria-label={`Ver roadmap de ${project.name}`}
                          >
                            Ver <Icon name="external" size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link to="/repositorios" className="profile-mobile-projects-link">
                Ver todos os projetos <Icon name="external" size={14} />
              </Link>
            </section>

            <div className="profile-right-column">
              <section className="profile-panel profile-statistics-panel">
                <header className="profile-panel__heading">
                  <h2>Estatísticas</h2>
                </header>

                <div className="profile-stat-grid">
                  <article className="profile-stat">
                    <span className="profile-stat__icon"><Icon name="folder" size={17} /></span>
                    <div><span>Projetos</span><strong>4</strong></div>
                  </article>
                  <article className="profile-stat">
                    <span className="profile-stat__icon"><Icon name="branch" size={17} /></span>
                    <div><span>Repositórios</span><strong>4</strong></div>
                  </article>
                  <article className="profile-stat">
                    <span className="profile-stat__icon"><Icon name="network" size={17} /></span>
                    <div><span>Roadmaps gerados</span><strong>12</strong></div>
                  </article>
                  <article className="profile-stat">
                    <span className="profile-stat__icon"><Icon name="calendar" size={17} /></span>
                    <div><span>Último acesso</span><strong>10/09/2026</strong></div>
                  </article>
                </div>
              </section>

              <section className="profile-panel profile-activity-panel">
                <header className="profile-panel__heading">
                  <h2>Atividade Recente</h2>
                </header>

                <ol className="profile-activity-list">
                  {activities.map((activity) => (
                    <li key={activity.id}>
                      <span className="profile-activity-dot" />
                      <p>{activity.text}</p>
                      <time>{activity.date}</time>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>

          <footer className="profile-footer">
            <span>GitRoadmap · Visualize a evolução do seu código.</span>
            <span>Perfil do usuário</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
