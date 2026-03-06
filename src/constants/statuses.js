export const IDEA_STATUSES = {
  NEW: 'new',
  UNDER_REVIEW: 'under_review',
  REJECTED: 'rejected',
  APPROVED: 'approved'
};

export const IDEA_STATUS_LABELS = {
  [IDEA_STATUSES.NEW]: 'Новая',
  [IDEA_STATUSES.UNDER_REVIEW]: 'На рассмотрении',
  [IDEA_STATUSES.REJECTED]: 'Отклонена',
  [IDEA_STATUSES.APPROVED]: 'Одобрена'
};

export const HR_SCORE_TYPES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  SERIOUS: 'serious'
};

export const SCORE_VALUES = {
  [HR_SCORE_TYPES.SMALL]: 20,
  [HR_SCORE_TYPES.MEDIUM]: 40,
  [HR_SCORE_TYPES.SERIOUS]: 100
};

export const SCORE_LABELS = {
  [HR_SCORE_TYPES.SMALL]: 'Небольшое улучшение',
  [HR_SCORE_TYPES.MEDIUM]: 'Среднее улучшение',
  [HR_SCORE_TYPES.SERIOUS]: 'Серьезное улучшение'
};
