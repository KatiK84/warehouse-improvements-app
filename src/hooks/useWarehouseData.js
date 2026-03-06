import { useEffect, useMemo, useState } from 'react';
import { IDEA_STATUSES } from '../constants/statuses';
import { createEmployee } from '../models/employeeModel';
import { createIdea } from '../models/ideaModel';
import { createRedemption } from '../models/redemptionModel';
import { createReview } from '../models/reviewModel';
import { createReward } from '../models/rewardModel';
import {
  STORAGE_KEYS,
  ensureSeedData,
  writeAllData,
  writeCollection
} from '../storage/localStorageService';
import { getEmployeePointBalance } from '../utils/points';
import { extractQuarterOptions } from '../utils/quarter';
import {
  validateEmployeeInput,
  validateIdeaInput,
  validateRewardInput
} from '../utils/validation';

const withUpdatedAt = (item) => ({
  ...item,
  updatedAt: new Date().toISOString()
});

export const useWarehouseData = () => {
  const seedData = useMemo(() => ensureSeedData(), []);

  const [employees, setEmployees] = useState(seedData.employees);
  const [ideas, setIdeas] = useState(seedData.ideas);
  const [reviews, setReviews] = useState(seedData.reviews);
  const [rewards, setRewards] = useState(seedData.rewards);
  const [redemptions, setRedemptions] = useState(seedData.redemptions);

  useEffect(() => writeCollection(STORAGE_KEYS.employees, employees), [employees]);
  useEffect(() => writeCollection(STORAGE_KEYS.ideas, ideas), [ideas]);
  useEffect(() => writeCollection(STORAGE_KEYS.reviews, reviews), [reviews]);
  useEffect(() => writeCollection(STORAGE_KEYS.rewards, rewards), [rewards]);
  useEffect(() => writeCollection(STORAGE_KEYS.redemptions, redemptions), [redemptions]);

  const quarterOptions = useMemo(
    () => extractQuarterOptions(ideas, reviews, redemptions),
    [ideas, reviews, redemptions]
  );

  const replaceAllData = (payload) => {
    setEmployees(payload.employees ?? []);
    setIdeas(payload.ideas ?? []);
    setReviews(payload.reviews ?? []);
    setRewards(payload.rewards ?? []);
    setRedemptions(payload.redemptions ?? []);
    writeAllData(payload);

    return { ok: true, message: 'Данные импортированы.' };
  };

  const addEmployee = (payload) => {
    const validation = validateEmployeeInput(payload);
    if (!validation.valid) {
      return { ok: false, message: validation.errors.join(' ') };
    }

    const employee = createEmployee(payload);
    setEmployees((prev) => [...prev, employee]);
    return { ok: true, message: 'Сотрудник добавлен.' };
  };

  const updateEmployee = (employeeId, patch) => {
    setEmployees((prev) =>
      prev.map((employee) => (employee.id === employeeId ? { ...employee, ...patch } : employee))
    );

    return { ok: true, message: 'Данные сотрудника обновлены.' };
  };

  const addIdea = (payload) => {
    const validation = validateIdeaInput(payload);
    if (!validation.valid) {
      return { ok: false, message: validation.errors.join(' ') };
    }

    const idea = createIdea(payload);
    setIdeas((prev) => [...prev, idea]);

    return { ok: true, message: 'Идея добавлена.' };
  };

  const updateIdea = (ideaId, payload) => {
    const validation = validateIdeaInput(payload);
    if (!validation.valid) {
      return { ok: false, message: validation.errors.join(' ') };
    }

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              ...payload,
              updatedAt: new Date().toISOString()
            }
          : idea
      )
    );

    return { ok: true, message: 'Идея обновлена.' };
  };

  const setIdeaStatus = (ideaId, status) => {
    if (!Object.values(IDEA_STATUSES).includes(status)) {
      return { ok: false, message: 'Некорректный статус идеи.' };
    }

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              status,
              updatedAt: new Date().toISOString()
            }
          : idea
      )
    );

    return { ok: true, message: 'Статус идеи обновлен.' };
  };

  const deleteIdea = (ideaId) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
    setReviews((prev) => prev.filter((review) => review.ideaId !== ideaId));

    return { ok: true, message: 'Идея удалена.' };
  };

  const addReview = ({ ideaId, hrScoreType, hrComment, reviewedBy }) => {
    const idea = ideas.find((entry) => entry.id === ideaId);
    if (!idea) return { ok: false, message: 'Идея не найдена.' };
    if (idea.status !== IDEA_STATUSES.APPROVED) {
      return { ok: false, message: 'Оценивать можно только одобренные идеи.' };
    }

    const alreadyReviewed = reviews.some((entry) => entry.ideaId === ideaId);
    if (alreadyReviewed) {
      return { ok: false, message: 'Для этой идеи уже есть итоговая оценка HR.' };
    }

    const review = createReview({
      ideaId,
      hrScoreType,
      hrComment,
      reviewedBy,
      quarter: idea.quarter,
      employeeId: idea.authorEmployeeId,
      employeeName: idea.authorName
    });

    setReviews((prev) => [...prev, review]);
    setIdeas((prev) => prev.map((item) => (item.id === ideaId ? withUpdatedAt(item) : item)));

    return { ok: true, message: 'Оценка HR сохранена.' };
  };

  const addReward = (payload) => {
    const validation = validateRewardInput(payload);
    if (!validation.valid) {
      return { ok: false, message: validation.errors.join(' ') };
    }

    const reward = createReward(payload);
    setRewards((prev) => [...prev, reward]);

    return { ok: true, message: 'Приз добавлен.' };
  };

  const updateReward = (rewardId, payload) => {
    const validation = validateRewardInput(payload);
    if (!validation.valid) {
      return { ok: false, message: validation.errors.join(' ') };
    }

    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId
          ? {
              ...reward,
              ...payload,
              costPoints: Number(payload.costPoints),
              updatedAt: new Date().toISOString()
            }
          : reward
      )
    );

    return { ok: true, message: 'Приз обновлен.' };
  };

  const deleteReward = (rewardId) => {
    setRewards((prev) => prev.filter((reward) => reward.id !== rewardId));
    return { ok: true, message: 'Приз удален.' };
  };

  const toggleRewardActive = (rewardId) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId
          ? {
              ...reward,
              active: !reward.active,
              updatedAt: new Date().toISOString()
            }
          : reward
      )
    );

    return { ok: true, message: 'Статус приза изменен.' };
  };

  const redeemReward = ({ employeeId, rewardId, mode, quarter, comment }) => {
    const employee = employees.find((entry) => entry.id === employeeId);
    if (!employee) return { ok: false, message: 'Сотрудник не найден.' };

    const reward = rewards.find((entry) => entry.id === rewardId);
    if (!reward) return { ok: false, message: 'Приз не найден.' };
    if (!reward.active) return { ok: false, message: 'Приз недоступен для обмена.' };

    const pointsScopeQuarter = mode === 'quarter' ? quarter : null;
    const balance = getEmployeePointBalance(employeeId, reviews, redemptions, pointsScopeQuarter);

    if (balance.availablePoints < reward.costPoints) {
      return {
        ok: false,
        message: `Недостаточно баллов. Доступно: ${balance.availablePoints}, требуется: ${reward.costPoints}.`
      };
    }

    const redemption = createRedemption({
      employeeId: employee.id,
      employeeName: employee.name,
      rewardId: reward.id,
      rewardTitle: reward.title,
      costPoints: reward.costPoints,
      quarter: mode === 'quarter' ? quarter : 'ALL',
      comment
    });

    setRedemptions((prev) => [...prev, redemption]);

    return { ok: true, message: 'Обмен баллов успешно выполнен.' };
  };

  return {
    state: {
      employees,
      ideas,
      reviews,
      rewards,
      redemptions,
      quarterOptions
    },
    actions: {
      replaceAllData,
      addEmployee,
      updateEmployee,
      addIdea,
      updateIdea,
      setIdeaStatus,
      deleteIdea,
      addReview,
      addReward,
      updateReward,
      deleteReward,
      toggleRewardActive,
      redeemReward
    }
  };
};
