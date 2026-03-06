import { IDEA_STATUSES, HR_SCORE_TYPES } from '../constants/statuses';
import { getCurrentQuarter } from '../utils/quarter';

const shiftDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const getPreviousQuarter = (quarter) => {
  const [qText, yText] = quarter.split(' ');
  const quarterNum = Number.parseInt(qText.replace('Q', ''), 10);
  const year = Number.parseInt(yText, 10);

  if (quarterNum === 1) return `Q4 ${year - 1}`;
  return `Q${quarterNum - 1} ${year}`;
};

export const buildDemoData = () => {
  const currentQuarter = getCurrentQuarter();
  const previousQuarter = getPreviousQuarter(currentQuarter);

  const employees = [
    { id: 'emp-1', name: 'Анна Кузнецова', department: 'Складская логистика', active: true, createdAt: shiftDays(160) },
    { id: 'emp-2', name: 'Дмитрий Соколов', department: 'Складская логистика', active: true, createdAt: shiftDays(150) },
    { id: 'emp-3', name: 'Ольга Миронова', department: 'Складская логистика', active: true, createdAt: shiftDays(140) },
    { id: 'emp-4', name: 'Максим Орлов', department: 'Складская логистика', active: true, createdAt: shiftDays(130) },
    { id: 'emp-5', name: 'Екатерина Белова', department: 'Складская логистика', active: true, createdAt: shiftDays(120) },
    { id: 'emp-6', name: 'Ирина Петрова', department: 'Складская логистика', active: false, createdAt: shiftDays(110) }
  ];

  const ideas = [
    {
      id: 'idea-1',
      title: 'Маркировка быстрых маршрутов комплектовки',
      description: 'Ввести цветовую маркировку для ускоренной навигации по зонам отбора.',
      authorEmployeeId: 'emp-1',
      authorName: 'Анна Кузнецова',
      department: 'Складская логистика',
      createdAt: shiftDays(30),
      updatedAt: shiftDays(15),
      quarter: currentQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-2',
      title: 'Чек-лист смены в планшете',
      description: 'Перевести бумажный чек-лист в цифровой формат на общем планшете смены.',
      authorEmployeeId: 'emp-2',
      authorName: 'Дмитрий Соколов',
      department: 'Складская логистика',
      createdAt: shiftDays(28),
      updatedAt: shiftDays(12),
      quarter: currentQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-3',
      title: 'Оптимизация зоны упаковки',
      description: 'Переставить столы и расходники для сокращения лишних шагов.',
      authorEmployeeId: 'emp-3',
      authorName: 'Ольга Миронова',
      department: 'Складская логистика',
      createdAt: shiftDays(20),
      updatedAt: shiftDays(10),
      quarter: currentQuarter,
      status: IDEA_STATUSES.UNDER_REVIEW
    },
    {
      id: 'idea-4',
      title: 'Смена графика приемки',
      description: 'Сместить окно приемки на вечер для равномерной загрузки.',
      authorEmployeeId: 'emp-4',
      authorName: 'Максим Орлов',
      department: 'Складская логистика',
      createdAt: shiftDays(95),
      updatedAt: shiftDays(90),
      quarter: previousQuarter,
      status: IDEA_STATUSES.REJECTED
    },
    {
      id: 'idea-5',
      title: 'Сканирование коробов на входе в линию',
      description: 'Добавить обязательный скан на входе для сокращения ошибок маршрутизации.',
      authorEmployeeId: 'emp-1',
      authorName: 'Анна Кузнецова',
      department: 'Складская логистика',
      createdAt: shiftDays(85),
      updatedAt: shiftDays(80),
      quarter: previousQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-6',
      title: 'Автогенерация наклеек для паллет',
      description: 'Автоматически печатать наклейки на основе задания в WMS.',
      authorEmployeeId: 'emp-5',
      authorName: 'Екатерина Белова',
      department: 'Складская логистика',
      createdAt: shiftDays(7),
      updatedAt: shiftDays(7),
      quarter: currentQuarter,
      status: IDEA_STATUSES.NEW
    },
    {
      id: 'idea-7',
      title: 'Единый стенд KPI смены',
      description: 'Показывать факт/план по обработанным заказам в реальном времени.',
      authorEmployeeId: 'emp-2',
      authorName: 'Дмитрий Соколов',
      department: 'Складская логистика',
      createdAt: shiftDays(78),
      updatedAt: shiftDays(76),
      quarter: previousQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-8',
      title: 'Переобучение новых сотрудников по SOP',
      description: 'Добавить короткий курс из 5 видео по стандартным операциям.',
      authorEmployeeId: 'emp-6',
      authorName: 'Ирина Петрова',
      department: 'Складская логистика',
      createdAt: shiftDays(70),
      updatedAt: shiftDays(69),
      quarter: previousQuarter,
      status: IDEA_STATUSES.UNDER_REVIEW
    },
    {
      id: 'idea-9',
      title: 'Алгоритм группировки отгрузок',
      description: 'Собирать отгрузки пакетами по типу транспорта для ускорения погрузки.',
      authorEmployeeId: 'emp-1',
      authorName: 'Анна Кузнецова',
      department: 'Складская логистика',
      createdAt: shiftDays(75),
      updatedAt: shiftDays(72),
      quarter: previousQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-10',
      title: 'Автонапоминания по контролю остатков',
      description: 'Напоминать сменному супервайзеру о контроле SKU с быстрым оборотом.',
      authorEmployeeId: 'emp-2',
      authorName: 'Дмитрий Соколов',
      department: 'Складская логистика',
      createdAt: shiftDays(25),
      updatedAt: shiftDays(20),
      quarter: currentQuarter,
      status: IDEA_STATUSES.APPROVED
    },
    {
      id: 'idea-11',
      title: 'Контроль очереди на воротах',
      description: 'Добавить простую визуализацию очереди машин для диспетчера.',
      authorEmployeeId: 'emp-2',
      authorName: 'Дмитрий Соколов',
      department: 'Складская логистика',
      createdAt: shiftDays(88),
      updatedAt: shiftDays(85),
      quarter: previousQuarter,
      status: IDEA_STATUSES.APPROVED
    }
  ];

  const reviews = [
    {
      id: 'review-1',
      ideaId: 'idea-1',
      hrScoreType: HR_SCORE_TYPES.SERIOUS,
      scoreValue: 100,
      hrComment: 'Сильно сократили время отбора в пиковые часы.',
      reviewedAt: shiftDays(14),
      reviewedBy: 'HR Антон Левин',
      quarter: currentQuarter,
      employeeId: 'emp-1',
      employeeName: 'Анна Кузнецова'
    },
    {
      id: 'review-2',
      ideaId: 'idea-2',
      hrScoreType: HR_SCORE_TYPES.MEDIUM,
      scoreValue: 40,
      hrComment: 'Упростили закрытие смены и контроль задач.',
      reviewedAt: shiftDays(11),
      reviewedBy: 'HR Антон Левин',
      quarter: currentQuarter,
      employeeId: 'emp-2',
      employeeName: 'Дмитрий Соколов'
    },
    {
      id: 'review-3',
      ideaId: 'idea-5',
      hrScoreType: HR_SCORE_TYPES.SMALL,
      scoreValue: 20,
      hrComment: 'Снижение процента ошибок на входе в линию.',
      reviewedAt: shiftDays(79),
      reviewedBy: 'HR Антон Левин',
      quarter: previousQuarter,
      employeeId: 'emp-1',
      employeeName: 'Анна Кузнецова'
    },
    {
      id: 'review-4',
      ideaId: 'idea-7',
      hrScoreType: HR_SCORE_TYPES.MEDIUM,
      scoreValue: 40,
      hrComment: 'Команда видит прогресс смены и реагирует быстрее.',
      reviewedAt: shiftDays(74),
      reviewedBy: 'HR Антон Левин',
      quarter: previousQuarter,
      employeeId: 'emp-2',
      employeeName: 'Дмитрий Соколов'
    },
    {
      id: 'review-5',
      ideaId: 'idea-9',
      hrScoreType: HR_SCORE_TYPES.SERIOUS,
      scoreValue: 100,
      hrComment: 'Сократили простой ворот и ускорили отгрузку.',
      reviewedAt: shiftDays(71),
      reviewedBy: 'HR Антон Левин',
      quarter: previousQuarter,
      employeeId: 'emp-1',
      employeeName: 'Анна Кузнецова'
    },
    {
      id: 'review-6',
      ideaId: 'idea-10',
      hrScoreType: HR_SCORE_TYPES.SERIOUS,
      scoreValue: 100,
      hrComment: 'Снизили риск out-of-stock по ключевым позициям.',
      reviewedAt: shiftDays(19),
      reviewedBy: 'HR Антон Левин',
      quarter: currentQuarter,
      employeeId: 'emp-2',
      employeeName: 'Дмитрий Соколов'
    },
    {
      id: 'review-7',
      ideaId: 'idea-11',
      hrScoreType: HR_SCORE_TYPES.SMALL,
      scoreValue: 20,
      hrComment: 'Повысили прозрачность планирования ворот.',
      reviewedAt: shiftDays(84),
      reviewedBy: 'HR Антон Левин',
      quarter: previousQuarter,
      employeeId: 'emp-2',
      employeeName: 'Дмитрий Соколов'
    }
  ];

  const rewards = [
    {
      id: 'reward-1',
      title: 'Пицца',
      description: 'Сертификат на пиццу для сотрудника.',
      costPoints: 200,
      category: 'Еда',
      active: true,
      createdAt: shiftDays(100),
      updatedAt: shiftDays(100)
    },
    {
      id: 'reward-2',
      title: 'Кино / развлечение',
      description: 'Билет в кино или развлекательный сертификат.',
      costPoints: 300,
      category: 'Развлечения',
      active: true,
      createdAt: shiftDays(100),
      updatedAt: shiftDays(100)
    },
    {
      id: 'reward-3',
      title: 'Поход в ресторан',
      description: 'Сертификат в ресторан.',
      costPoints: 400,
      category: 'Еда',
      active: true,
      createdAt: shiftDays(100),
      updatedAt: shiftDays(100)
    },
    {
      id: 'reward-4',
      title: 'Боулинг',
      description: 'Сертификат на игру в боулинг.',
      costPoints: 500,
      category: 'Активности',
      active: true,
      createdAt: shiftDays(100),
      updatedAt: shiftDays(100)
    },
    {
      id: 'reward-5',
      title: 'Крупный приз',
      description: 'Большой премиальный приз по итогам квартала.',
      costPoints: 800,
      category: 'Премиум',
      active: true,
      createdAt: shiftDays(100),
      updatedAt: shiftDays(100)
    }
  ];

  const redemptions = [
    {
      id: 'redemption-1',
      employeeId: 'emp-1',
      employeeName: 'Анна Кузнецова',
      rewardId: 'reward-1',
      rewardTitle: 'Пицца',
      costPoints: 200,
      quarter: previousQuarter,
      redeemedAt: shiftDays(60),
      comment: 'Обмен по итогам квартала.'
    },
    {
      id: 'redemption-2',
      employeeId: 'emp-2',
      employeeName: 'Дмитрий Соколов',
      rewardId: 'reward-1',
      rewardTitle: 'Пицца',
      costPoints: 200,
      quarter: 'ALL',
      redeemedAt: shiftDays(4),
      comment: 'Обмен общего баланса.'
    }
  ];

  return {
    employees,
    ideas,
    reviews,
    rewards,
    redemptions
  };
};
