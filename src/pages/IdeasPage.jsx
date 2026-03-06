import { useMemo, useState } from 'react';
import { IDEA_STATUSES, IDEA_STATUS_LABELS } from '../constants/statuses';
import { formatDateTime, normalizeText } from '../utils/format';
import { findReviewByIdeaId } from '../utils/points';

const initialForm = {
  title: '',
  description: '',
  authorEmployeeId: '',
  authorName: '',
  department: 'Складская логистика',
  quarter: '',
  status: IDEA_STATUSES.NEW
};

const statusActions = [
  { id: IDEA_STATUSES.UNDER_REVIEW, label: 'На рассмотрении' },
  { id: IDEA_STATUSES.REJECTED, label: 'Отклонить' },
  { id: IDEA_STATUSES.APPROVED, label: 'Одобрить' }
];

export default function IdeasPage({
  ideas,
  reviews,
  employees,
  quarterOptions,
  selectedQuarter,
  onAddIdea,
  onUpdateIdea,
  onDeleteIdea,
  onSetIdeaStatus,
  onNotify,
  canEdit
}) {
  const [form, setForm] = useState({ ...initialForm, quarter: selectedQuarter });
  const [editingIdeaId, setEditingIdeaId] = useState(null);

  const [filterQuarter, setFilterQuarter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [search, setSearch] = useState('');

  const employeesById = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [employees]
  );

  const filteredIdeas = useMemo(() => {
    const query = normalizeText(search).toLowerCase();

    return ideas
      .filter((idea) => (filterQuarter === 'all' ? true : idea.quarter === filterQuarter))
      .filter((idea) => (filterStatus === 'all' ? true : idea.status === filterStatus))
      .filter((idea) => (filterAuthor === 'all' ? true : idea.authorEmployeeId === filterAuthor))
      .filter((idea) => {
        if (!query) return true;
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.authorName.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [ideas, filterQuarter, filterStatus, filterAuthor, search]);

  const resetForm = () => {
    setForm({ ...initialForm, quarter: selectedQuarter });
    setEditingIdeaId(null);
  };

  const handleAuthorChange = (employeeId) => {
    const author = employeesById.get(employeeId);
    setForm((prev) => ({
      ...prev,
      authorEmployeeId: employeeId,
      authorName: author?.name ?? ''
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = editingIdeaId ? onUpdateIdea(editingIdeaId, form) : onAddIdea(form);
    onNotify(result);
    if (result.ok) resetForm();
  };

  const startEditing = (idea) => {
    setEditingIdeaId(idea.id);
    setForm({
      title: idea.title,
      description: idea.description,
      authorEmployeeId: idea.authorEmployeeId,
      authorName: idea.authorName,
      department: idea.department,
      quarter: idea.quarter,
      status: idea.status
    });
  };

  const handleDelete = (ideaId) => {
    if (!window.confirm('Удалить идею? Это также удалит HR-оценку для идеи.')) return;
    onNotify(onDeleteIdea(ideaId));
    if (editingIdeaId === ideaId) resetForm();
  };

  const activeEmployees = employees.filter((employee) => employee.active);

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Идеи</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Название
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Например: Оптимизация зоны упаковки"
              disabled={!canEdit}
            />
          </label>

          <label>
            Описание
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Кратко опишите улучшение"
              disabled={!canEdit}
            />
          </label>

          <label>
            Автор
            <select
              value={form.authorEmployeeId}
              onChange={(e) => handleAuthorChange(e.target.value)}
              disabled={!canEdit}
            >
              <option value="">Выберите сотрудника</option>
              {activeEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Квартал
            <select
              value={form.quarter}
              onChange={(e) => setForm((prev) => ({ ...prev, quarter: e.target.value }))}
              disabled={!canEdit}
            >
              {quarterOptions.map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={!canEdit}>
              {editingIdeaId ? 'Сохранить идею' : 'Добавить идею'}
            </button>
            {editingIdeaId ? (
              <button type="button" className="ghost" onClick={resetForm}>
                Отмена
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Фильтры и поиск</h3>
        <div className="filters-row">
          <label>
            Квартал
            <select value={filterQuarter} onChange={(e) => setFilterQuarter(e.target.value)}>
              <option value="all">Все</option>
              {quarterOptions.map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>

          <label>
            Статус
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Все</option>
              {Object.values(IDEA_STATUSES).map((status) => (
                <option key={status} value={status}>
                  {IDEA_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Автор
            <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)}>
              <option value="all">Все</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Поиск
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="По названию или автору"
            />
          </label>
        </div>
      </div>

      <div className="card">
        <h3>Таблица идей</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Автор</th>
                <th>Квартал</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Баллы</th>
                <th>Комментарий HR</th>
                {canEdit ? <th>Действия</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredIdeas.map((idea) => {
                const review = findReviewByIdeaId(idea.id, reviews);
                return (
                  <tr key={idea.id}>
                    <td>{idea.title}</td>
                    <td>{idea.authorName}</td>
                    <td>{idea.quarter}</td>
                    <td>
                      <span className={`status-badge ${idea.status}`}>
                        {IDEA_STATUS_LABELS[idea.status]}
                      </span>
                    </td>
                    <td>{formatDateTime(idea.createdAt)}</td>
                    <td>{review?.scoreValue ?? 0}</td>
                    <td>{review?.hrComment || '—'}</td>
                    {canEdit ? (
                      <td>
                        <div className="actions-row">
                          <button type="button" onClick={() => startEditing(idea)}>Редактировать</button>
                          <button type="button" className="danger" onClick={() => handleDelete(idea.id)}>
                            Удалить
                          </button>
                          {statusActions.map((action) => (
                            <button
                              type="button"
                              className="ghost"
                              key={action.id}
                              disabled={idea.status === action.id}
                              onClick={() => onNotify(onSetIdeaStatus(idea.id, action.id))}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredIdeas.length === 0 ? <p className="empty">Идеи не найдены.</p> : null}
        </div>
      </div>
    </section>
  );
}
