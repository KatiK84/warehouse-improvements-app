import { useState } from 'react';
import { formatDateTime } from '../utils/format';

const initialForm = {
  title: '',
  description: '',
  costPoints: 200,
  category: 'Еда',
  active: true
};

export default function RewardsPage({
  rewards,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  onToggleRewardActive,
  onNotify,
  canEdit
}) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = editingId ? onUpdateReward(editingId, form) : onAddReward(form);
    onNotify(result);
    if (result.ok) resetForm();
  };

  const handleEdit = (reward) => {
    setEditingId(reward.id);
    setForm({
      title: reward.title,
      description: reward.description,
      costPoints: reward.costPoints,
      category: reward.category,
      active: reward.active
    });
  };

  const handleDelete = (rewardId) => {
    if (!window.confirm('Удалить приз из каталога?')) return;
    onNotify(onDeleteReward(rewardId));
    if (editingId === rewardId) resetForm();
  };

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Каталог призов</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Название
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <label>
            Описание
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <label>
            Стоимость (баллы)
            <input
              type="number"
              min={1}
              value={form.costPoints}
              onChange={(e) => setForm((prev) => ({ ...prev, costPoints: Number(e.target.value) }))}
              disabled={!canEdit}
            />
          </label>

          <label>
            Категория
            <input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              disabled={!canEdit}
            />
            <span>Приз активен</span>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={!canEdit}>
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            {editingId ? (
              <button type="button" className="ghost" onClick={resetForm}>
                Отмена
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Список призов</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Баллы</th>
                <th>Категория</th>
                <th>Доступность</th>
                <th>Обновлен</th>
                {canEdit ? <th>Действия</th> : null}
              </tr>
            </thead>
            <tbody>
              {rewards
                .slice()
                .sort((a, b) => a.costPoints - b.costPoints)
                .map((reward) => (
                  <tr key={reward.id}>
                    <td>{reward.title}</td>
                    <td>{reward.description}</td>
                    <td>{reward.costPoints}</td>
                    <td>{reward.category}</td>
                    <td>{reward.active ? 'Доступен' : 'Выключен'}</td>
                    <td>{formatDateTime(reward.updatedAt)}</td>
                    {canEdit ? (
                      <td>
                        <div className="actions-row">
                          <button type="button" onClick={() => handleEdit(reward)}>Редактировать</button>
                          <button type="button" onClick={() => onNotify(onToggleRewardActive(reward.id))}>
                            {reward.active ? 'Выключить' : 'Включить'}
                          </button>
                          <button type="button" className="danger" onClick={() => handleDelete(reward.id)}>
                            Удалить
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
          {rewards.length === 0 ? <p className="empty">Каталог пуст.</p> : null}
        </div>
      </div>
    </section>
  );
}
