import { useMemo, useState } from 'react';
import { buildEmployeeStats } from '../utils/stats';

const initialEmployeeForm = {
  name: '',
  department: 'Складская логистика'
};

export default function EmployeesPage({
  employees,
  ideas,
  reviews,
  redemptions,
  quarterOptions,
  selectedQuarter,
  onQuarterChange,
  onAddEmployee,
  onUpdateEmployee,
  onNotify,
  canEdit
}) {
  const [activityFilter, setActivityFilter] = useState('all');
  const [form, setForm] = useState(initialEmployeeForm);

  const ranking = useMemo(
    () =>
      buildEmployeeStats({
        employees,
        ideas,
        reviews,
        redemptions,
        quarter: selectedQuarter,
        activityFilter
      }),
    [employees, ideas, reviews, redemptions, selectedQuarter, activityFilter]
  );

  const topThree = ranking.slice(0, 3);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onAddEmployee(form);
    onNotify(result);
    if (result.ok) setForm(initialEmployeeForm);
  };

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Сотрудники / рейтинг</h2>

        <div className="filters-row">
          <label>
            Квартал
            <select value={selectedQuarter} onChange={(e) => onQuarterChange(e.target.value)}>
              {quarterOptions.map((quarter) => (
                <option value={quarter} key={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>

          <label>
            Активность
            <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
              <option value="all">Все</option>
              <option value="active">Только активные</option>
              <option value="inactive">Только неактивные</option>
            </select>
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Top 3 сотрудников ({selectedQuarter})</h3>
        <div className="top-grid">
          {topThree.map((row) => (
            <article key={row.id} className="top-card">
              <p>#{row.rank}</p>
              <h4>{row.name}</h4>
              <span>{row.quarterPoints} баллов</span>
            </article>
          ))}
          {topThree.length === 0 ? <p className="empty">Нет данных для рейтинга.</p> : null}
        </div>
      </div>

      <div className="card">
        <h3>Добавить сотрудника</h3>
        <form className="form-grid inline" onSubmit={handleSubmit}>
          <label>
            Имя
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <label>
            Отдел
            <input
              value={form.department}
              onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={!canEdit}>Добавить</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Рейтинг и статистика</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Сотрудник</th>
                <th>Подано идей</th>
                <th>Одобрено</th>
                <th>Отклонено</th>
                <th>Баллы ({selectedQuarter})</th>
                <th>Общий баланс</th>
                <th>Потрачено</th>
                <th>Доступно</th>
                <th>Активен</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((row) => (
                <tr key={row.id}>
                  <td>{row.rank}</td>
                  <td>{row.name}</td>
                  <td>{row.ideasSubmitted}</td>
                  <td>{row.approvedIdeas}</td>
                  <td>{row.rejectedIdeas}</td>
                  <td>{row.quarterPoints}</td>
                  <td>{row.totalPoints}</td>
                  <td>{row.spentPoints}</td>
                  <td>{row.availablePoints}</td>
                  <td>
                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={row.active}
                        disabled={!canEdit}
                        onChange={(e) =>
                          onNotify(onUpdateEmployee(row.id, { active: e.target.checked }))
                        }
                      />
                      <span>{row.active ? 'Да' : 'Нет'}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ranking.length === 0 ? <p className="empty">Нет сотрудников для отображения.</p> : null}
        </div>
      </div>
    </section>
  );
}
