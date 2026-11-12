
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../auth/AuthContext";
import { getInstallUrl } from "../../api/github";
import Icon from "../../components/Icon";

import "./Settings.css";

const tabs = [
    {
        id: "Conta",
        title: "Informações da conta",
        description: "Gerencie os dados básicos do seu perfil."
    },
    {
        id: "Aparência",
        title: "Aparência",
        description: "Escolha como o GitRoadmap será exibido."
    },
    {
        id: "Notificações",
        title: "Notificações",
        description: "Escolha quais atualizações deseja receber."
    },
    {
        id: "Privacidade e segurança",
        title: "Privacidade e segurança",
        description: "Controle a visibilidade das suas informações."
    },
    {
        id: "Integração com GitHub",
        title: "Integração com GitHub",
        description: "Gerencie a conexão com seus repositórios."
    }
];

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            className={`settings-toggle ${checked ? "is-on" : ""}`}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
        >
            <span />
        </button>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState("Conta");

    const { user } = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();

    const [githubConnected, setGithubConnected] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [githubError, setGithubError] = useState("");

    const prefs = user?.usuario_preferencia;

    const [name, setName] = useState(user?.nome ?? "");
    const [username, setUsername] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");

    const [theme, setTheme] = useState(prefs?.tema ?? "light");

    const [notifications, setNotifications] = useState({
        updates: prefs?.notif_projeto ?? true,
        email: prefs?.notif_email ?? false,
        roadmap: prefs?.notif_roadmap ?? true
    });

    const [privacy, setPrivacy] = useState({
        profile: prefs?.perfil_publico ?? true,
        activity: prefs?.exibir_atividade ?? false
    });

    const [saved, setSaved] = useState(false);

    const savedTimer = useRef(null);

    useEffect(() => {
        if (searchParams.get("github") === "connected") {
            setGithubConnected(true);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete("github");

            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        return () => {
            window.clearTimeout(savedTimer.current);
        };
    }, []);

    const currentTab =
        tabs.find((tab) => tab.id === activeTab) || tabs[0];

    function handleSave() {
        setSaved(true);

        window.clearTimeout(savedTimer.current);

        savedTimer.current = window.setTimeout(() => {
            setSaved(false);
        }, 3000);
    }

    function updateNotification(key, value) {
        setNotifications((previous) => ({
            ...previous,
            [key]: value
        }));
    }

    function updatePrivacy(key, value) {
        setPrivacy((previous) => ({
            ...previous,
            [key]: value
        }));
    }

    async function handleConnectGithub() {
        setGithubLoading(true);
        setGithubError("");

        try {
            const response = await getInstallUrl();

            if (!response?.url) {
                throw new Error(
                    "O servidor não retornou a URL de instalação do GitHub."
                );
            }

            window.location.assign(response.url);

        } catch (error) {
            setGithubError(
                error.message ||
                "Não foi possível iniciar a conexão com o GitHub."
            );

            setGithubLoading(false);
        }
    }

    return (
        <AppLayout breadcrumb="Configurações">

            <header className="app-page-heading">
                <div>
                    <span className="app-eyebrow">
                        PREFERÊNCIAS
                    </span>

                    <h1>Configurações</h1>

                    <p>
                        Personalize sua experiência no GitRoadmap.
                    </p>
                </div>
            </header>

            {saved && (
                <div className="app-feedback" role="status">
                    Alterações aplicadas nesta tela.

                    <button
                        type="button"
                        onClick={() => setSaved(false)}
                        aria-label="Fechar aviso"
                    >
                        <Icon name="close" size={16} />
                    </button>
                </div>
            )}

            {githubConnected && (
                <div className="app-feedback" role="status">
                    GitHub conectado com sucesso!

                    <button
                        type="button"
                        onClick={() => setGithubConnected(false)}
                        aria-label="Fechar aviso"
                    >
                        <Icon name="close" size={16} />
                    </button>
                </div>
            )}

            <div className="settings-layout">

                <nav
                    className="settings-tabs"
                    aria-label="Categorias de configurações"
                >
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.id}
                            className={`settings-tab ${
                                activeTab === tab.id ? "is-active" : ""
                            }`}
                            aria-current={
                                activeTab === tab.id ? "true" : undefined
                            }
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.id}
                        </button>
                    ))}
                </nav>

                <section className="settings-panel">

                    <header className="settings-panel__heading">
                        <h2>{currentTab.title}</h2>
                        <p>{currentTab.description}</p>
                    </header>

                    <div className="settings-panel__body">

                        {activeTab === "Conta" && (
                            <div className="settings-form">

                                <label>
                                    Nome completo

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Seu nome"
                                    />
                                </label>

                                <label>
                                    Nome de usuário

                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(event) =>
                                            setUsername(event.target.value)
                                        }
                                        placeholder="Seu nome de usuário"
                                    />
                                </label>

                                <label>
                                    E-mail

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="seu@email.com"
                                    />
                                </label>

                            </div>
                        )}

                        {activeTab === "Aparência" && (
                            <>
                                <div className="settings-option">
                                    <div>
                                        <h3>Tema da interface</h3>

                                        <p>
                                            Selecione o tema de sua preferência.
                                        </p>
                                    </div>

                                    <select
                                        aria-label="Tema da interface"
                                        value={theme}
                                        onChange={(event) =>
                                            setTheme(event.target.value)
                                        }
                                    >
                                        <option value="light">Claro</option>
                                        <option value="dark">Escuro</option>
                                        <option value="system">
                                            Seguir o sistema
                                        </option>
                                    </select>
                                </div>

                                <p className="settings-hint">
                                    A seleção é mantida nesta tela enquanto ela
                                    estiver aberta. A aplicação global do tema
                                    será implementada posteriormente.
                                </p>
                            </>
                        )}

                        {activeTab === "Notificações" && (
                            <>
                                <div className="settings-option">
                                    <div>
                                        <h3>Atualizações do projeto</h3>
                                        <p>
                                            Receba avisos sobre mudanças nos
                                            seus projetos.
                                        </p>
                                    </div>

                                    <Toggle
                                        label="Atualizações do projeto"
                                        checked={notifications.updates}
                                        onChange={(value) =>
                                            updateNotification("updates", value)
                                        }
                                    />
                                </div>

                                <div className="settings-option">
                                    <div>
                                        <h3>Notificações por e-mail</h3>
                                        <p>
                                            Receba notificações no endereço
                                            cadastrado.
                                        </p>
                                    </div>

                                    <Toggle
                                        label="Notificações por e-mail"
                                        checked={notifications.email}
                                        onChange={(value) =>
                                            updateNotification("email", value)
                                        }
                                    />
                                </div>

                                <div className="settings-option">
                                    <div>
                                        <h3>Atualizações dos roadmaps</h3>
                                        <p>
                                            Saiba quando houver alterações nos
                                            roadmaps.
                                        </p>
                                    </div>

                                    <Toggle
                                        label="Atualizações dos roadmaps"
                                        checked={notifications.roadmap}
                                        onChange={(value) =>
                                            updateNotification("roadmap", value)
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === "Privacidade e segurança" && (
                            <>
                                <div className="settings-option">
                                    <div>
                                        <h3>Perfil visível</h3>
                                        <p>
                                            Permitir que outras pessoas
                                            visualizem seu perfil.
                                        </p>
                                    </div>

                                    <Toggle
                                        label="Perfil visível"
                                        checked={privacy.profile}
                                        onChange={(value) =>
                                            updatePrivacy("profile", value)
                                        }
                                    />
                                </div>

                                <div className="settings-option">
                                    <div>
                                        <h3>Exibir atividade</h3>
                                        <p>
                                            Mostrar sua atividade recente na
                                            plataforma.
                                        </p>
                                    </div>

                                    <Toggle
                                        label="Exibir atividade"
                                        checked={privacy.activity}
                                        onChange={(value) =>
                                            updatePrivacy("activity", value)
                                        }
                                    />
                                </div>

                                <div className="settings-option">
                                    <div>
                                        <h3>Senha</h3>
                                        <p>
                                            A alteração de senha será
                                            disponibilizada com a integração
                                            de autenticação.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="settings-secondary-button"
                                        onClick={() =>
                                            window.alert(
                                                "A alteração de senha ainda não está disponível."
                                            )
                                        }
                                    >
                                        Alterar senha
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === "Integração com GitHub" && (
                            <>
                                <div className="settings-option">
                                    <div>
                                        <h3>GitHub App</h3>

                                        <p>
                                            Instale o GitRoadmap na sua conta
                                            GitHub para permitir o acesso aos
                                            seus repositórios.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="settings-secondary-button"
                                        onClick={handleConnectGithub}
                                        disabled={githubLoading}
                                    >
                                        {githubLoading
                                            ? "Conectando..."
                                            : "Conectar GitHub"}
                                    </button>
                                </div>

                                {githubError && (
                                    <div
                                        className="app-feedback"
                                        role="alert"
                                    >
                                        {githubError}
                                    </div>
                                )}

                                <p className="settings-hint">
                                    Você será redirecionado ao GitHub para
                                    autorizar a instalação do aplicativo. O
                                    acesso será limitado às permissões
                                    concedidas ao GitRoadmap.
                                </p>
                            </>
                        )}

                    </div>

                    <footer className="settings-panel__footer">
                        <button
                            type="button"
                            className="app-button"
                            onClick={handleSave}
                        >
                            Salvar alterações
                        </button>
                    </footer>

                </section>

            </div>

        </AppLayout>
    );
}
