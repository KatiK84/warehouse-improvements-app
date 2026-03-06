import { SCORE_VALUES } from '../constants/statuses';

export const scoreTypeToValue = (scoreType) => SCORE_VALUES[scoreType] ?? 0;

export const findReviewByIdeaId = (ideaId, reviews) =>
  reviews.find((review) => review.ideaId === ideaId) ?? null;

export const getEarnedPoints = (employeeId, reviews, quarter = null) =>
  reviews
    .filter((review) => review.employeeId === employeeId)
    .filter((review) => (quarter ? review.quarter === quarter : true))
    .reduce((sum, review) => sum + Number(review.scoreValue || 0), 0);

export const getSpentPoints = (employeeId, redemptions, quarter = null) =>
  redemptions
    .filter((redemption) => redemption.employeeId === employeeId)
    .filter((redemption) => (quarter ? redemption.quarter === quarter : true))
    .reduce((sum, redemption) => sum + Number(redemption.costPoints || 0), 0);

export const getEmployeePointBalance = (employeeId, reviews, redemptions, quarter = null) => {
  const earnedPoints = getEarnedPoints(employeeId, reviews, quarter);
  const spentPoints = getSpentPoints(employeeId, redemptions, quarter);

  const totalEarnedPoints = getEarnedPoints(employeeId, reviews, null);
  const totalSpentPoints = getSpentPoints(employeeId, redemptions, null);

  return {
    earnedPoints,
    spentPoints,
    availablePoints: earnedPoints - spentPoints,
    totalEarnedPoints,
    totalSpentPoints,
    totalAvailablePoints: totalEarnedPoints - totalSpentPoints
  };
};

export const buildAccrualHistory = (employeeId, ideas, reviews) => {
  const ideaMap = new Map(ideas.map((idea) => [idea.id, idea]));

  return reviews
    .filter((review) => review.employeeId === employeeId)
    .map((review) => ({
      id: review.id,
      ideaTitle: ideaMap.get(review.ideaId)?.title ?? 'Идея удалена',
      quarter: review.quarter,
      scoreValue: review.scoreValue,
      reviewedAt: review.reviewedAt,
      hrComment: review.hrComment
    }))
    .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
};

export const buildRedemptionHistory = (employeeId, redemptions) =>
  redemptions
    .filter((redemption) => redemption.employeeId === employeeId)
    .sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt));

export const getQuarterEarnedTotal = (reviews, quarter) =>
  reviews
    .filter((review) => review.quarter === quarter)
    .reduce((sum, review) => sum + Number(review.scoreValue || 0), 0);

export const getQuarterSpentTotal = (redemptions, quarter) =>
  redemptions
    .filter((redemption) => redemption.quarter === quarter)
    .reduce((sum, redemption) => sum + Number(redemption.costPoints || 0), 0);
