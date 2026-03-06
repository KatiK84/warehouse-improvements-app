import { SCORE_VALUES } from '../constants/statuses';
import { normalizeText } from '../utils/format';
import { generateId } from '../utils/id';

export const createReview = ({
  ideaId,
  hrScoreType,
  hrComment,
  reviewedBy,
  quarter,
  employeeId,
  employeeName
}) => ({
  id: generateId('review'),
  ideaId,
  hrScoreType,
  scoreValue: SCORE_VALUES[hrScoreType] ?? 0,
  hrComment: normalizeText(hrComment),
  reviewedAt: new Date().toISOString(),
  reviewedBy: normalizeText(reviewedBy) || 'HR',
  quarter,
  employeeId,
  employeeName
});
