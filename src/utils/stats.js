import { IDEA_STATUSES } from '../constants/statuses';
import {
  getEmployeePointBalance,
  getQuarterEarnedTotal,
  getQuarterSpentTotal
} from './points';

export const buildEmployeeStats = ({
  employees,
  ideas,
  reviews,
  redemptions,
  quarter,
  activityFilter = 'all'
}) => {
  const byEmployee = employees
    .filter((employee) => {
      if (activityFilter === 'active') return employee.active;
      if (activityFilter === 'inactive') return !employee.active;
      return true;
    })
    .map((employee) => {
      const employeeIdeas = ideas.filter((idea) => idea.authorEmployeeId === employee.id);
      const approvedIdeas = employeeIdeas.filter((idea) => idea.status === IDEA_STATUSES.APPROVED).length;
      const rejectedIdeas = employeeIdeas.filter((idea) => idea.status === IDEA_STATUSES.REJECTED).length;
      const quarterIdeas = employeeIdeas.filter((idea) => idea.quarter === quarter);
      const quarterApprovedIdeas = quarterIdeas.filter(
        (idea) => idea.status === IDEA_STATUSES.APPROVED
      ).length;

      const points = getEmployeePointBalance(employee.id, reviews, redemptions, quarter);

      return {
        ...employee,
        ideasSubmitted: employeeIdeas.length,
        approvedIdeas,
        rejectedIdeas,
        quarterIdeasSubmitted: quarterIdeas.length,
        quarterApprovedIdeas,
        quarterPoints: points.earnedPoints,
        quarterSpentPoints: points.spentPoints,
        quarterAvailablePoints: points.availablePoints,
        totalPoints: points.totalEarnedPoints,
        spentPoints: points.totalSpentPoints,
        availablePoints: points.totalAvailablePoints
      };
    })
    .sort((a, b) => {
      if (b.quarterPoints !== a.quarterPoints) return b.quarterPoints - a.quarterPoints;
      if (b.quarterApprovedIdeas !== a.quarterApprovedIdeas)
        return b.quarterApprovedIdeas - a.quarterApprovedIdeas;
      return a.name.localeCompare(b.name, 'ru');
    })
    .map((employee, index) => ({
      ...employee,
      rank: index + 1
    }));

  return byEmployee;
};

export const buildSummaryCards = ({ employees, ideas, reviews, redemptions, quarter }) => {
  const submittedIdeas = ideas.filter((idea) => idea.quarter === quarter).length;
  const approvedIdeas = ideas.filter(
    (idea) => idea.quarter === quarter && idea.status === IDEA_STATUSES.APPROVED
  ).length;
  const earnedPoints = getQuarterEarnedTotal(reviews, quarter);
  const redeemedPoints = getQuarterSpentTotal(redemptions, quarter);

  const ranking = buildEmployeeStats({
    employees,
    ideas,
    reviews,
    redemptions,
    quarter,
    activityFilter: 'active'
  });

  return {
    submittedIdeas,
    approvedIdeas,
    earnedPoints,
    redeemedPoints,
    topEmployee: ranking[0] ?? null
  };
};
