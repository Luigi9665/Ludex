import KpiCard from "./KpiCard";

/**
 * Nota per me futuro:
 * - Mostra 4 KPI principali della dashboard analytics:
 *   generi, tag, metadata e domande.
 * - Ogni KPI mostra:
 *   - "usati su totali" (es. 26 su 30)
 *   - "Copertura XX%" in piccolo sotto.
 */
export default function KpiCardsRow({ stats }) {
  const cards = [
    {
      title: "Generi coperti",
      value: `${stats.genres.used} su ${stats.genres.total}`,
      subtitle: `Copertura ${stats.genres.coverage}%`,
      icon: "bi-collection",
      trend: null,
    },
    {
      title: "Tag coperti",
      value: `${stats.tags.used} su ${stats.tags.total}`,
      subtitle: `Copertura ${stats.tags.coverage}%`,
      icon: "bi-tags",
      trend: null,
    },
    {
      title: "Metadata usati",
      value: `${stats.metadata.used} su ${stats.metadata.total}`,
      subtitle: `Copertura ${stats.metadata.coverage}%`,
      icon: "bi-sliders",
      trend: null,
    },
    {
      title: "Domande attive",
      value: `${stats.questions.used} su ${stats.questions.total}`,
      subtitle: `Copertura ${stats.questions.coverage}%`,
      icon: "bi-question-circle",
      trend: null,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-3">
          <KpiCard {...card} />
        </div>
      ))}
    </div>
  );
}
