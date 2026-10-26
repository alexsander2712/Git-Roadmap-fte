import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Icon from "../../components/Icon";
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
    <AppLayout breadcrumb="Perfil">
      <header className="app-page-heading">
        <div>
          <span className="app-eyebrow">SUA CONTA</span>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações, preferências e acompanhe suas atividades.</p>
        </div>
      </header>

      {notice && (
        <div className="app-feedback" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso">
            <Icon name="close" size={16} />
          </button>
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
              <button type="button" className="app-button" onClick={startEditing}>
                <Icon name="edit" size={15} />
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
                <button type="submit" className="app-button">
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
        <section className="profile-panel">
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
          <section className="profile-panel">
            <header className="profile-panel__heading">
              <h2>Estatísticas</h2>
            </header>

            <div className="profile-stat-grid">
              <article className="profile-stat">
                <span className="profile-stat__icon profile-stat__icon--red"><Icon name="folder" size={18} /></span>
                <div><span>Projetos</span><strong>4</strong></div>
              </article>
              <article className="profile-stat">
                <span className="profile-stat__icon profile-stat__icon--blue"><Icon name="branch" size={18} /></span>
                <div><span>Repositórios</span><strong>4</strong></div>
              </article>
              <article className="profile-stat">
                <span className="profile-stat__icon profile-stat__icon--purple"><Icon name="network" size={18} /></span>
                <div><span>Roadmaps gerados</span><strong>12</strong></div>
              </article>
              <article className="profile-stat">
                <span className="profile-stat__icon profile-stat__icon--green"><Icon name="calendar" size={18} /></span>
                <div><span>Último acesso</span><strong className="profile-stat__date">10/09/2026</strong></div>
              </article>
            </div>
          </section>

          <section className="profile-panel">
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
    </AppLayout>
  );
}