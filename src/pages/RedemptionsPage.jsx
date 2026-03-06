import { useMemo, useState } from 'react';
import { formatDateTime } from '../utils/format';
import { getEmployeePointBalance } from '../utils/points';

const initialForm = {
  employeeId: '',
  mode: 'quarter',
  quarter: '',
  rewardId: '',
  comment: ''
};

export default function RedemptionsPage({
  employees,
  rewards,
  reviews,
  redemptions,
  quarterOptions,
  selectedQuarter,
  onRedeem,
  onNotify,
  canEdit
}) {
  const [form, setForm] = useState({ ...initialForm, quarter: selectedQuarter });
  const [historyEmployeeFilter, setHistoryEmployeeFilter] = useState('all');
  const [historyQuarterFilter, setHistoryQuarterFilter] = useState('all');

  const activeRewards = useMemo(
    () => rewards.filter((reward) => reward.active).sort((a, b) => a.costPoints - b.costPoints),
    [rewards]
  );

  const selectedEmployee = employees.find((employee) => employee.id === form.employeeId);
  const selectedReward = rewards.find((reward) => reward.id === form.rewardId);

  const balance = selectedEmployee
    ? getEmployeePointBalance(
        selectedEmployee.id,
        reviews,
        redemptions,
        form.mode === 'quarter' ? form.quarter : null
      )
    : null;

  const availablePoints = balance?.availablePoints ?? 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.employeeId || !form.rewardId) {
      onNotify({ ok: false, message: 'Выберите сотрудника и приз.' });
      return;
    }

    if (form.mode === 'quarter' && !form.quarter) {
      onNotify({ ok: false, message: 'Выберите квартал для списания.' });
      return;
    }

    const result = onRedeem(form);
    onNotify(result);

    if (result.ok) {
      setForm((prev) => ({ ...initialForm, quarter: prev.quarter || selectedQuarter }));
    }
  };

  const filteredHistory = redemptions
    .filter((item) => (historyEmployeeFilter === 'all' ? true : item.employeeId === historyEmployeeFilter))
    .filter((item) => (historyQuarterFilter === 'all' ? true : item.quarter === historyQuarterFilter))
    .sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt));

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Обмен баллов</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Сотрудник
            <select
              value={form.employeeId}
              onChange={(e) => setForm((prev) => ({ ...prev, employeeId: e.target.value }))}
              disabled={!canEdit}
            >
              <option value="">Выберите сотрудника</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Режим списания
            <select
              value={form.mode}
              onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
              disabled={!canEdit}
            >
              <option value="quarter">Только выбранный квартал</option>
              <option value="overall">Общий баланс</option>
            </select>
          </label>

          {form.mode === 'quarter' ? (
            <label>
              Квартал списания
              <select
                value={form.quarter}
                onChange={(e) => setForm((prev) => ({ ...prev, quarter: e.target.value }))}
                disabled={!canEdit}
              >
                {quarterOptions.map((quarter) => (
                  <option value={quarter} key={quarter}>
                    {quarter}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            Приз
            <select
              value={form.rewardId}
              onChange={(e) => setForm((prev) => ({ ...prev, rewardId: e.target.value }))}
              disabled={!canEdit}
            >
              <option value="">Выберите приз</option>
              {activeRewards.map((reward) => (
                <option key={reward.id} value={reward.id}>
                  {reward.title} ({reward.costPoints})
                </option>
              ))}
            </select>
          </label>

          <label>
            Комментарий
            <textarea
              rows={2}
              value={form.comment}
              onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
              disabled={!canEdit}
            />
          </label>

          <div className="balance-box">
            <p>
              Доступно баллов:
              <strong> {availablePoints}</strong>
            </p>
            <p>
              Стоимость выбранного приза:
              <strong> {selectedReward?.costPoints ?? 0}</strong>
            </p>
            {selectedReward && availablePoints < selectedReward.costPoints ? (
              <p className="warning">Недостаточно баллов для выбранного приза.</p>
            ) : null}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={!canEdit || !selectedReward || availablePoints < (selectedReward?.costPoints ?? 0)}
            >
              Подтвердить обмен
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>История обменов</h3>

        <div className="filters-row">
          <label>
            Сотрудник
            <select
              value={historyEmployeeFilter}
              onChange={(e) => setHistoryEmployeeFilter(e.target.value)}
            >
              <option value="all">Все</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Квартал
            <select
              value={historyQuarterFilter}
              onChange={(e) => setHistoryQuarterFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="ALL">ALL (общий баланс)</option>
              {quarterOptions.map((quarter) => (
                <option value={quarter} key={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Сотрудник</th>
                <th>Приз</th>
                <th>Баллы</th>
                <th>Квартал</th>
                <th>Дата</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.employeeName}</td>
                  <td>{item.rewardTitle}</td>
                  <td>{item.costPoints}</td>
                  <td>{item.quarter}</td>
                  <td>{formatDateTime(item.redeemedAt)}</td>
                  <td>{item.comment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 ? <p className="empty">История обменов пуста.</p> : null}
        </div>
      </div>
    </section>
  );
}
