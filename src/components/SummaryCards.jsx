export default function SummaryCards({ summary, quarter }) {
  const cards = [
    { label: 'Идей подано', value: summary.submittedIdeas },
    { label: 'Идей одобрено', value: summary.approvedIdeas },
    { label: `Баллы начислено (${quarter})`, value: summary.earnedPoints },
    { label: `Баллы обменяно (${quarter})`, value: summary.redeemedPoints },
    {
      label: 'Топ сотрудник квартала',
      value: summary.topEmployee
        ? `${summary.topEmployee.name} (${summary.topEmployee.quarterPoints})`
        : '—'
    }
  ];

  return (
    <section className="summary-grid">
      {cards.map((card, index) => (
        <article
          className="summary-card"
          key={card.label}
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
    </section>
  );
}
