import { useMemo, useState } from 'react';
import {
  HR_SCORE_TYPES,
  IDEA_STATUSES,
  SCORE_LABELS,
  SCORE_VALUES
} from '../constants/statuses';
import { formatDateTime } from '../utils/format';

const scoreButtons = [
  HR_SCORE_TYPES.SMALL,
  HR_SCORE_TYPES.MEDIUM,
  HR_SCORE_TYPES.SERIOUS
];

export default function HrReviewPage({ ideas, reviews, onAddReview, onNotify, canReview }) {
  const [comments, setComments] = useState({});

  const reviewedIdeaIds = useMemo(() => new Set(reviews.map((review) => review.ideaId)), [reviews]);

  const pendingIdeas = useMemo(
    () =>
      ideas
        .filter((idea) => idea.status === IDEA_STATUSES.APPROVED)
        .filter((idea) => !reviewedIdeaIds.has(idea.id))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [ideas, reviewedIdeaIds]
  );

  const ideaMap = useMemo(() => new Map(ideas.map((idea) => [idea.id, idea])), [ideas]);

  const handleReview = (ideaId, scoreType) => {
    const result = onAddReview({
      ideaId,
      hrScoreType: scoreType,
      hrComment: comments[ideaId] ?? '',
      reviewedBy: 'HR Manager'
    });

    onNotify(result);

    if (result.ok) {
      setComments((prev) => ({ ...prev, [ideaId]: '' }));
    }
  };

  const history = [...reviews].sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));

  return (
    <section className="page-grid">
      <div className="card">
        <h2>Оценка HR</h2>
        <p className="hint">Оцениваться могут только идеи со статусом «Одобрена».</p>
      </div>

      <div className="card">
        <h3>Идеи, ожидающие оценки</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Идея</th>
                <th>Автор</th>
                <th>Квартал</th>
                <th>Комментарий HR</th>
                <th>Оценка</th>
              </tr>
            </thead>
            <tbody>
              {pendingIdeas.map((idea) => (
                <tr key={idea.id}>
                  <td>{idea.title}</td>
                  <td>{idea.authorName}</td>
                  <td>{idea.quarter}</td>
                  <td>
                    <input
                      placeholder="Комментарий"
                      value={comments[idea.id] ?? ''}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [idea.id]: e.target.value
                        }))
                      }
                      disabled={!canReview}
                    />
                  </td>
                  <td>
                    <div className="actions-row">
                      {scoreButtons.map((scoreType) => (
                        <button
                          key={scoreType}
                          type="button"
                          disabled={!canReview}
                          onClick={() => handleReview(idea.id, scoreType)}
                        >
                          {SCORE_LABELS[scoreType]} ({SCORE_VALUES[scoreType]})
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingIdeas.length === 0 ? <p className="empty">Нет идей, ожидающих оценки.</p> : null}
        </div>
      </div>

      <div className="card">
        <h3>История оценок</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Идея</th>
                <th>Сотрудник</th>
                <th>Квартал</th>
                <th>Категория</th>
                <th>Баллы</th>
                <th>Комментарий HR</th>
                <th>Кто оценил</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {history.map((review) => (
                <tr key={review.id}>
                  <td>{ideaMap.get(review.ideaId)?.title ?? 'Идея удалена'}</td>
                  <td>{review.employeeName}</td>
                  <td>{review.quarter}</td>
                  <td>{SCORE_LABELS[review.hrScoreType]}</td>
                  <td>{review.scoreValue}</td>
                  <td>{review.hrComment || '—'}</td>
                  <td>{review.reviewedBy}</td>
                  <td>{formatDateTime(review.reviewedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 ? <p className="empty">Оценок пока нет.</p> : null}
        </div>
      </div>
    </section>
  );
}
