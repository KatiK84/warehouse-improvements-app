import { normalizeText, toInt } from '../utils/format';
import { generateId } from '../utils/id';

export const createRedemption = ({
  employeeId,
  employeeName,
  rewardId,
  rewardTitle,
  costPoints,
  quarter,
  comment
}) => ({
  id: generateId('redemption'),
  employeeId,
  employeeName: normalizeText(employeeName),
  rewardId,
  rewardTitle: normalizeText(rewardTitle),
  costPoints: toInt(costPoints, 0),
  quarter,
  redeemedAt: new Date().toISOString(),
  comment: normalizeText(comment)
});
