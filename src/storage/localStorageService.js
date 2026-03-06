import { buildDemoData } from '../data/demoData';

export const STORAGE_KEYS = {
  employees: 'warehouse_improvements_employees',
  ideas: 'warehouse_improvements_ideas',
  reviews: 'warehouse_improvements_reviews',
  rewards: 'warehouse_improvements_rewards',
  redemptions: 'warehouse_improvements_redemptions'
};

const safeParse = (value, fallback = []) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const readCollection = (key) => safeParse(localStorage.getItem(key), []);

export const writeCollection = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const readAllData = () => ({
  employees: readCollection(STORAGE_KEYS.employees),
  ideas: readCollection(STORAGE_KEYS.ideas),
  reviews: readCollection(STORAGE_KEYS.reviews),
  rewards: readCollection(STORAGE_KEYS.rewards),
  redemptions: readCollection(STORAGE_KEYS.redemptions)
});

export const writeAllData = (payload) => {
  writeCollection(STORAGE_KEYS.employees, payload.employees ?? []);
  writeCollection(STORAGE_KEYS.ideas, payload.ideas ?? []);
  writeCollection(STORAGE_KEYS.reviews, payload.reviews ?? []);
  writeCollection(STORAGE_KEYS.rewards, payload.rewards ?? []);
  writeCollection(STORAGE_KEYS.redemptions, payload.redemptions ?? []);
};

export const ensureSeedData = () => {
  const existing = readAllData();
  const isEmpty = Object.values(existing).every((collection) => collection.length === 0);

  if (!isEmpty) return existing;

  const demo = buildDemoData();
  writeAllData(demo);
  return demo;
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};
