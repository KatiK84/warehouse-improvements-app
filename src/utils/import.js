import { validateImportPayload } from './validation';

export const readJsonFile = async (file) => {
  const text = await file.text();
  const payload = JSON.parse(text);
  const validation = validateImportPayload(payload);

  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  return {
    employees: payload.employees,
    ideas: payload.ideas,
    reviews: payload.reviews,
    rewards: payload.rewards,
    redemptions: payload.redemptions
  };
};
