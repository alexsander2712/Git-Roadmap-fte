
import Logo from "./Logo";
import "./BrandPanel.css";

const benefits = [
  "Transforme histórico Git em grafos visuais",
  "Analise branches, commits e merges",
  "Gere relatórios de evolução por versão",
];

export default function BrandPanel() {
  return (
    <aside className="brand-panel">
      <Logo />

      <div className="brand-panel__content">
        <h1>
          Sua jornada no desenvolvimento começa aqui.
        </h1>

        <p className="brand-panel__intro">
          Acompanhe a evolução do seu código e crie
          roadmaps visuais com facilidade.
        </p>

        <ul className="brand-panel__benefits">
          {benefits.map((benefit) => (
            <li key={benefit}>
              <span
                className="brand-panel__check"
                aria-hidden="true"
              >
                ✓
              </span>

              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
