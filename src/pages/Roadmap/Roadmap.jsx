
import { Link, useParams } from "react-router-dom";

export default function Roadmap() {
  const { id } = useParams();

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <Link to="/repositorios">← Voltar para Meus Projetos</Link>

      <h1>Roadmap do Projeto</h1>
      <p>Você está visualizando o projeto de ID: {id}</p>

      <p>
        Em breve, aqui será exibido o grafo com os commits, branches e merges
        do repositório.
      </p>
    </main>
  );
}
