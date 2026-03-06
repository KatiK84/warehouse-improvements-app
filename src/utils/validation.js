import { normalizeText, toInt } from './format';
import { isValidQuarter } from './quarter';

const required = (value) => normalizeText(value).length > 0;

export const validateIdeaInput = (payload) => {
  const errors = [];

  if (!required(payload.title)) errors.push('Укажите название идеи.');
  if (!required(payload.description)) errors.push('Укажите описание идеи.');
  if (!required(payload.authorEmployeeId)) errors.push('Выберите автора идеи.');
  if (!required(payload.authorName)) errors.push('Имя автора не определено.');
  if (!isValidQuarter(payload.quarter)) errors.push('Укажите корректный квартал (пример: Q1 2026).');

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateEmployeeInput = (payload) => {
  const errors = [];
  if (!required(payload.name)) errors.push('Укажите имя сотрудника.');

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateRewardInput = (payload) => {
  const errors = [];

  if (!required(payload.title)) errors.push('Укажите название приза.');
  if (!required(payload.description)) errors.push('Укажите описание приза.');
  if (toInt(payload.costPoints, -1) <= 0) errors.push('Стоимость приза должна быть больше 0.');
  if (!required(payload.category)) errors.push('Укажите категорию приза.');

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateImportPayload = (payload) => {
  const requiredCollections = ['employees', 'ideas', 'reviews', 'rewards', 'redemptions'];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['JSON должен содержать объект с коллекциями данных.'] };
  }

  const errors = requiredCollections
    .filter((key) => !Array.isArray(payload[key]))
    .map((key) => `Коллекция "${key}" должна быть массивом.`);

  return {
    valid: errors.length === 0,
    errors
  };
};
