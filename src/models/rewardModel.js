import { normalizeText, toInt } from '../utils/format';
import { generateId } from '../utils/id';

export const createReward = ({
  title,
  description,
  costPoints,
  category,
  active = true
}) => {
  const now = new Date().toISOString();

  return {
    id: generateId('reward'),
    title: normalizeText(title),
    description: normalizeText(description),
    costPoints: toInt(costPoints, 0),
    category: normalizeText(category),
    active: Boolean(active),
    createdAt: now,
    updatedAt: now
  };
};
