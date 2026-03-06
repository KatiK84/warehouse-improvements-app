import { useEffect, useMemo, useState } from 'react';
import ImportExportBar from './components/ImportExportBar';
import NavigationTabs from './components/NavigationTabs';
import Notification from './components/Notification';
import SummaryCards from './components/SummaryCards';
import { ROLE_LABELS, ROLES } from './constants/roles';
import { useWarehouseData } from './hooks/useWarehouseData';
import EmployeesPage from './pages/EmployeesPage';
import HrReviewPage from './pages/HrReviewPage';
import IdeasPage from './pages/IdeasPage';
import RedemptionsPage from './pages/RedemptionsPage';
import RewardsPage from './pages/RewardsPage';
import { exportAllDataJson, exportIdeasCsv, exportRankingCsv, exportRedemptionsCsv } from './utils/export';
import { readJsonFile } from './utils/import';
import { getCurrentQuarter } from './utils/quarter';
import { buildEmployeeStats, buildSummaryCards } from './utils/stats';

const tabs = [
  { id: 'ideas', label: 'Идеи' },
  { id: 'hr', label: 'Оценка HR' },
  { id: 'employees', label: 'Сотрудники / рейтинг' },
  { id: 'rewards', label: 'Каталог призов' },
  { id: 'redemptions', label: 'Обмен баллов' }
];

export default function App() {
  const { state, actions } = useWarehouseData();
  const [activeTab, setActiveTab] = useState('ideas');
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [role, setRole] = useState(ROLES.ADMIN);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!state.quarterOptions.includes(selectedQuarter)) {
      setSelectedQuarter(state.quarterOptions[0] ?? getCurrentQuarter());
    }
  }, [state.quarterOptions, selectedQuarter]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const notify = (result) => {
    if (!result?.message) return;
    setNotice({
      type: result.ok ? 'success' : 'error',
      message: result.message
    });
  };

  const summary = useMemo(
    () =>
      buildSummaryCards({
        employees: state.employees,
        ideas: state.ideas,
        reviews: state.reviews,
        redemptions: state.redemptions,
        quarter: selectedQuarter
      }),
    [state.employees, state.ideas, state.reviews, state.redemptions, selectedQuarter]
  );

  const rankingForExport = useMemo(
    () =>
      buildEmployeeStats({
        employees: state.employees,
        ideas: state.ideas,
        reviews: state.reviews,
        redemptions: state.redemptions,
        quarter: selectedQuarter,
        activityFilter: 'all'
      }),
    [state.employees, state.ideas, state.reviews, state.redemptions, selectedQuarter]
  );

  const handleImport = async (file) => {
    try {
      const payload = await readJsonFile(file);
      notify(actions.replaceAllData(payload));
    } catch (error) {
      notify({ ok: false, message: `Ошибка импорта: ${error.message}` });
    }
  };

  const canManageIdeas = role !== ROLES.VIEWER;
  const canReview = role === ROLES.ADMIN || role === ROLES.HR;
  const canManageEmployees = role === ROLES.ADMIN;
  const canManageRewards = role === ROLES.ADMIN;
  const canRedeem = role === ROLES.ADMIN || role === ROLES.HR;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'ideas':
        return (
          <IdeasPage
            ideas={state.ideas}
            reviews={state.reviews}
            employees={state.employees}
            quarterOptions={state.quarterOptions}
            selectedQuarter={selectedQuarter}
            onAddIdea={actions.addIdea}
            onUpdateIdea={actions.updateIdea}
            onDeleteIdea={actions.deleteIdea}
            onSetIdeaStatus={actions.setIdeaStatus}
            onNotify={notify}
            canEdit={canManageIdeas}
          />
        );

      case 'hr':
        return (
          <HrReviewPage
            ideas={state.ideas}
            reviews={state.reviews}
            onAddReview={actions.addReview}
            onNotify={notify}
            canReview={canReview}
          />
        );

      case 'employees':
        return (
          <EmployeesPage
            employees={state.employees}
            ideas={state.ideas}
            reviews={state.reviews}
            redemptions={state.redemptions}
            quarterOptions={state.quarterOptions}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
            onAddEmployee={actions.addEmployee}
            onUpdateEmployee={actions.updateEmployee}
            onNotify={notify}
            canEdit={canManageEmployees}
          />
        );

      case 'rewards':
        return (
          <RewardsPage
            rewards={state.rewards}
            onAddReward={actions.addReward}
            onUpdateReward={actions.updateReward}
            onDeleteReward={actions.deleteReward}
            onToggleRewardActive={actions.toggleRewardActive}
            onNotify={notify}
            canEdit={canManageRewards}
          />
        );

      case 'redemptions':
        return (
          <RedemptionsPage
            employees={state.employees}
            rewards={state.rewards}
            reviews={state.reviews}
            redemptions={state.redemptions}
            quarterOptions={state.quarterOptions}
            selectedQuarter={selectedQuarter}
            onRedeem={actions.redeemReward}
            onNotify={notify}
            canEdit={canRedeem}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="kicker">Warehouse Logistics</p>
          <h1>Программа улучшений склада</h1>
          <p className="sub">MVP без backend. Данные сохраняются в localStorage.</p>
        </div>

        <div className="topbar-controls">
          <label>
            Квартал
            <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
              {state.quarterOptions.map((quarter) => (
                <option value={quarter} key={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>

          <label>
            Роль
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {Object.values(ROLES).map((entry) => (
                <option key={entry} value={entry}>
                  {ROLE_LABELS[entry]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <ImportExportBar
        onExportJson={() =>
          exportAllDataJson({
            employees: state.employees,
            ideas: state.ideas,
            reviews: state.reviews,
            rewards: state.rewards,
            redemptions: state.redemptions
          })
        }
        onImportJson={handleImport}
        onExportIdeas={() => exportIdeasCsv({ ideas: state.ideas, reviews: state.reviews })}
        onExportRanking={() => exportRankingCsv({ employeeStats: rankingForExport, quarter: selectedQuarter })}
        onExportRedemptions={() => exportRedemptionsCsv({ redemptions: state.redemptions })}
      />

      <SummaryCards summary={summary} quarter={selectedQuarter} />
      <NavigationTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <main>{renderActiveTab()}</main>

      <Notification notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
}
