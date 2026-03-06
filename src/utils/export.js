import { IDEA_STATUS_LABELS } from '../constants/statuses';
import { formatDateTime } from './format';
import { findReviewByIdeaId } from './points';

const encodeCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const toCsv = (headers, rows) => {
  const head = headers.map((header) => encodeCsvValue(header)).join(';');
  const body = rows
    .map((row) => row.map((value) => encodeCsvValue(value)).join(';'))
    .join('\n');

  return `${head}\n${body}`;
};

const downloadTextFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAllDataJson = (payload) => {
  const filename = `warehouse-data-${new Date().toISOString().slice(0, 10)}.json`;
  const content = JSON.stringify(payload, null, 2);
  downloadTextFile(filename, content, 'application/json;charset=utf-8');
};

export const exportIdeasCsv = ({ ideas, reviews }) => {
  const headers = [
    'Название',
    'Описание',
    'Автор',
    'Квартал',
    'Статус',
    'Дата создания',
    'Баллы',
    'Комментарий HR'
  ];

  const rows = ideas.map((idea) => {
    const review = findReviewByIdeaId(idea.id, reviews);
    return [
      idea.title,
      idea.description,
      idea.authorName,
      idea.quarter,
      IDEA_STATUS_LABELS[idea.status] ?? idea.status,
      formatDateTime(idea.createdAt),
      review?.scoreValue ?? 0,
      review?.hrComment ?? ''
    ];
  });

  const content = toCsv(headers, rows);
  downloadTextFile('ideas-export.csv', content, 'text/csv;charset=utf-8');
};

export const exportRankingCsv = ({ employeeStats, quarter }) => {
  const headers = [
    'Место',
    'Сотрудник',
    'Подано идей',
    'Одобрено',
    'Отклонено',
    `Баллы (${quarter})`,
    'Общий баланс',
    'Потрачено',
    'Доступно'
  ];

  const rows = employeeStats.map((row) => [
    row.rank,
    row.name,
    row.ideasSubmitted,
    row.approvedIdeas,
    row.rejectedIdeas,
    row.quarterPoints,
    row.totalPoints,
    row.spentPoints,
    row.availablePoints
  ]);

  const content = toCsv(headers, rows);
  downloadTextFile(`employees-ranking-${quarter.replace(' ', '-')}.csv`, content, 'text/csv;charset=utf-8');
};

export const exportRedemptionsCsv = ({ redemptions }) => {
  const headers = ['Сотрудник', 'Приз', 'Баллы', 'Квартал', 'Дата обмена', 'Комментарий'];

  const rows = redemptions.map((row) => [
    row.employeeName,
    row.rewardTitle,
    row.costPoints,
    row.quarter,
    formatDateTime(row.redeemedAt),
    row.comment
  ]);

  const content = toCsv(headers, rows);
  downloadTextFile('redemptions-history.csv', content, 'text/csv;charset=utf-8');
};
