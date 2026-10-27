/* Dados demonstrativos.
   Serão substituídos pelas informações do GitHub (commits, branches e merges)
   e pelas versões/descrições salvas pelo usuário, na integração com o backend.

   branches[].lane: posição vertical da branch no grafo horizontal
   (0 = linha central; negativo = acima; positivo = abaixo). */

export const STATUS_OPTIONS = ["Concluída", "Em andamento", "Planejada"];
export const STATUS_CLASS = {
  "Concluída": "done",
  "Em andamento": "progress",
  "Planejada": "planned",
};

const c = (hash, message, date, branch, parents = []) => ({
  hash,
  message,
  author: "alex",
  date,
  branch,
  parents,
});

export const roadmapsData = {
  1: {
    project: {
      name: "Academy Quest",
      description: "Plataforma educacional para estudantes e professores.",
      repository: "alex/academy-quest",
      language: "JavaScript",
      color: "#e9b44c",
    },
    branches: [
      { name: "main", color: "#d83232", lane: 0 },
      { name: "develop", color: "#3d73c6", lane: -1 },
      { name: "feature/quiz", color: "#2b8a53", lane: -2 },
    ],
    commits: [
      c("e91c4ab", "Release v1.2.0", "2026-08-28", "main", ["7d3b2fa", "c5e8a10"]),
      c("c5e8a10", "Merge feature/quiz em develop", "2026-08-27", "develop", ["9a2f6d3", "3f7b1c8"]),
      c("3f7b1c8", "Adiciona ranking de pontuação", "2026-08-25", "feature/quiz", ["b04e7d9"]),
      c("7d3b2fa", "Corrige validação de login", "2026-08-24", "main", ["5a8c1e6"]),
      c("9a2f6d3", "Cria painel do professor", "2026-08-22", "develop", ["b04e7d9"]),
      c("b04e7d9", "Estrutura o módulo de quizzes", "2026-08-20", "develop", ["5a8c1e6"]),
      c("5a8c1e6", "Release v1.1.0", "2026-08-15", "main", ["1e4d7b0", "2c6f9a4"]),
      c("2c6f9a4", "Adiciona autenticação de alunos", "2026-08-12", "develop", ["8b3e5d1"]),
      c("1e4d7b0", "Ajusta a documentação", "2026-08-10", "main", ["8b3e5d1"]),
      c("8b3e5d1", "Commit inicial", "2026-08-05", "main", []),
    ],
    versions: [
      { id: 1, tag: "v1.3.0", title: "Relatórios de desempenho", date: "2026-09-30", status: "Planejada", commit: "", description: "Gráficos de evolução por turma e exportação dos relatórios em PDF." },
      { id: 2, tag: "v1.2.0", title: "Quizzes e ranking", date: "2026-08-28", status: "Concluída", commit: "e91c4ab", description: "Novo módulo de quizzes com ranking de pontuação e painel do professor." },
      { id: 3, tag: "v1.1.0", title: "Autenticação", date: "2026-08-15", status: "Concluída", commit: "5a8c1e6", description: "Login de alunos e professores com validação de dados." },
      { id: 4, tag: "v1.0.0", title: "Primeira versão", date: "2026-08-05", status: "Concluída", commit: "8b3e5d1", description: "Estrutura inicial do projeto." },
    ],
  },
  2: {
    project: {
      name: "Eco2Eco",
      description: "Aplicativo de sustentabilidade e consumo consciente.",
      repository: "alex/eco2eco",
      language: "Python",
      color: "#41966a",
    },
    branches: [
      { name: "main", color: "#d83232", lane: 0 },
      { name: "develop", color: "#3d73c6", lane: 1 },
    ],
    commits: [
      c("f2a9d10", "Release v0.3.0", "2026-08-28", "main", ["c81e3b7", "6e0d4f5"]),
      c("6e0d4f5", "Calculadora de pegada de carbono", "2026-08-25", "develop", ["a47b9c2"]),
      c("c81e3b7", "Corrige o tema escuro", "2026-08-22", "main", ["a47b9c2"]),
      c("a47b9c2", "Release v0.2.0", "2026-08-18", "main", ["e5d10a8", "90b3f6c"]),
      c("90b3f6c", "Lista de produtos sustentáveis", "2026-08-15", "develop", ["3b7e8d4"]),
      c("e5d10a8", "Configura a integração contínua", "2026-08-12", "main", ["3b7e8d4"]),
      c("3b7e8d4", "Commit inicial", "2026-08-08", "main", []),
    ],
    versions: [
      { id: 1, tag: "v1.0.0", title: "Lançamento público", date: "2026-10-15", status: "Planejada", commit: "", description: "Publicação nas lojas de aplicativos." },
      { id: 2, tag: "v0.3.0", title: "Pegada de carbono", date: "2026-08-28", status: "Concluída", commit: "f2a9d10", description: "Calculadora de pegada de carbono e ajustes de tema." },
      { id: 3, tag: "v0.2.0", title: "Produtos sustentáveis", date: "2026-08-18", status: "Concluída", commit: "a47b9c2", description: "Catálogo de produtos com selo de sustentabilidade." },
    ],
  },
  3: {
    project: {
      name: "AdivinhaAiDev",
      description: "Quiz interativo sobre linguagens de programação.",
      repository: "alex/adivinha-ai-dev",
      language: "JavaScript",
      color: "#d83232",
    },
    branches: [
      { name: "main", color: "#d83232", lane: 0 },
      { name: "feature/perguntas", color: "#7957be", lane: -1 },
    ],
    commits: [
      c("d40e7a1", "Release v1.0.0", "2026-08-20", "main", ["bb21c9f", "7a35e08"]),
      c("7a35e08", "Banco de perguntas por linguagem", "2026-08-18", "feature/perguntas", ["bb21c9f"]),
      c("bb21c9f", "Implementa a pontuação do quiz", "2026-08-14", "main", ["2d9f4a6"]),
      c("2d9f4a6", "Commit inicial", "2026-08-05", "main", []),
    ],
    versions: [
      { id: 1, tag: "v1.1.0", title: "Modo desafio", date: "2026-09-20", status: "Em andamento", commit: "", description: "Perguntas com tempo limite e ranking semanal." },
      { id: 2, tag: "v1.0.0", title: "Primeira versão", date: "2026-08-20", status: "Concluída", commit: "d40e7a1", description: "Quiz com banco de perguntas por linguagem e pontuação." },
    ],
  },
  4: {
    project: {
      name: "GitRoadmap",
      description: "Visualize a evolução do seu código.",
      repository: "alex/gitroadmap",
      language: "JavaScript",
      color: "#172b3b",
    },
    branches: [
      { name: "main", color: "#d83232", lane: 0 },
      { name: "develop", color: "#3d73c6", lane: 1 },
      { name: "feature/grafo", color: "#2b8a53", lane: 2 },
    ],
    commits: [
      c("4c81d2e", "Release v0.1.0", "2026-09-10", "main", ["91fa6b3", "0d7c3a5"]),
      c("0d7c3a5", "Merge feature/grafo em develop", "2026-09-08", "develop", ["e29b5f1", "58a1e7c"]),
      c("58a1e7c", "Renderiza o grafo de commits", "2026-09-05", "feature/grafo", ["e29b5f1"]),
      c("91fa6b3", "Padroniza o layout das páginas", "2026-09-03", "main", ["b6c0d48"]),
      c("e29b5f1", "Cria as páginas de projetos", "2026-09-01", "develop", ["b6c0d48"]),
      c("b6c0d48", "Commit inicial", "2026-08-28", "main", []),
    ],
    versions: [
      { id: 1, tag: "v1.0.0", title: "Integração com o GitHub", date: "2026-11-01", status: "Planejada", commit: "", description: "Leitura real de commits, branches e merges pela API do GitHub." },
      { id: 2, tag: "v0.2.0", title: "Edição do roadmap", date: "2026-09-25", status: "Em andamento", commit: "", description: "Criação e edição de versões com descrições do usuário." },
      { id: 3, tag: "v0.1.0", title: "Protótipo navegável", date: "2026-09-10", status: "Concluída", commit: "4c81d2e", description: "Páginas principais e grafo de commits com dados demonstrativos." },
    ],
  },
};

export const emptyData = {
  project: {
    name: "Projeto sem dados",
    description: "Este projeto ainda não tem dados do GitHub.",
    repository: "—",
    language: "Não identificado",
    color: "#64748b",
  },
  branches: [],
  commits: [],
  versions: [],
};