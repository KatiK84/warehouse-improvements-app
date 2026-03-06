import { IDEA_STATUSES } from '../constants/statuses';
import { normalizeText } from '../utils/format';
import { generateId } from '../utils/id';
import { getCurrentQuarter } from '../utils/quarter';

export const createIdea = ({
  title,
  description,
  authorEmployeeId,
  authorName,
  department = 'Складская логистика',
  quarter = getCurrentQuarter(),
  status = IDEA_STATUSES.NEW
}) => {
  const now = new Date().toISOString();

  return {
    id: generateId('idea'),
    title: normalizeText(title),
    description: normalizeText(description),
    authorEmployeeId,
    authorName: normalizeText(authorName),
    department: normalizeText(department) || 'Складская логистика',
    createdAt: now,
    updatedAt: now,
    quarter,
    status
  };
};
