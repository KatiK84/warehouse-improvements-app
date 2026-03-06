# Программа улучшений склада (MVP)

Локальное веб-приложение для программы улучшений в складской логистике.

- стек: React + Vite + JavaScript + CSS
- backend: отсутствует
- хранение: `localStorage`

## Функциональность MVP

1. Вкладка `Идеи`: добавление, редактирование, удаление, смена статусов, фильтры и поиск.
2. Вкладка `Оценка HR`: оценка только одобренных идей (20/40/100), история оценок.
3. Вкладка `Сотрудники / рейтинг`: рейтинг по кварталу, статистика, активность, Top 3.
4. Вкладка `Каталог призов`: CRUD призов, переключение доступности.
5. Вкладка `Обмен баллов`: списание по кварталу или по общему балансу, история обменов.
6. Импорт/экспорт:
   - экспорт всех данных в JSON,
   - импорт данных из JSON,
   - экспорт идей в CSV,
   - экспорт рейтинга сотрудников в CSV,
   - экспорт истории обменов в CSV.

## 1. Установка зависимостей

```bash
npm install
```

## 2. Локальный запуск

```bash
npm run dev
```

Открыть URL из консоли Vite (обычно `http://localhost:5173`).

## 3. Сборка проекта

```bash
npm run build
```

Результат будет в папке `dist/`.

## 4. Preview собранной версии

```bash
npm run preview
```

## 5. Как загрузить в GitHub

```bash
git init
git add .
git commit -m "Initial MVP: warehouse improvements app"
git branch -M main
git remote add origin https://github.com/<your-username>/warehouse-improvements-app.git
git push -u origin main
```

## 6. Как включить GitHub Pages

1. В `vite.config.js` уже установлен `base: './'`, чтобы сборка корректно работала как статический сайт.
2. Сделайте commit и push в `main`.
3. В GitHub откройте `Settings -> Pages`.
4. В `Build and deployment` выберите `Deploy from a branch`.
5. Укажите branch `main` и папку `/ (root)` если публикуете собранные файлы вручную, либо настройте workflow для деплоя `dist`.
6. Альтернатива: использовать `gh-pages` ветку через GitHub Action.

## 7. Где лежат данные

Данные хранятся в `localStorage` браузера отдельно по ключам:

- `warehouse_improvements_employees`
- `warehouse_improvements_ideas`
- `warehouse_improvements_reviews`
- `warehouse_improvements_rewards`
- `warehouse_improvements_redemptions`

## 8. Как работает localStorage

- При первом запуске проверяются коллекции.
- Если все пустые, автоматически создаются demo-данные (сотрудники, идеи, оценки, призы, обмены).
- При любом изменении коллекции данные сразу сохраняются в `localStorage`.
- Перезагрузка страницы не теряет данные.

## 9. Как добавить сотрудников

1. Откройте вкладку `Сотрудники / рейтинг`.
2. В блоке `Добавить сотрудника` введите имя и отдел.
3. Нажмите `Добавить`.
4. Для отключения сотрудника используйте переключатель `Активен` в таблице.

## 10. Как начисляются баллы

Правила:

1. Баллы начисляются только идеям, которые:
   - имеют статус `Одобрена`,
   - получили HR-оценку.
2. Категории оценки:
   - `small` = 20
   - `medium` = 40
   - `serious` = 100
3. Баллы агрегируются по сотруднику и кварталу.
4. В приложении рассчитываются:
   - `earnedPoints`
   - `spentPoints`
   - `availablePoints`
   - общий баланс и квартальный баланс.

## 11. Как работает обмен баллов

1. Откройте вкладку `Обмен баллов`.
2. Выберите сотрудника.
3. Выберите режим списания:
   - `Только выбранный квартал`
   - `Общий баланс`
4. Выберите приз из активного каталога.
5. Если баллов хватает, нажмите `Подтвердить обмен`.
6. Списание сохранится в истории.

Ограничение: приложение не позволит списать больше баллов, чем доступно в выбранной области (квартал или общий баланс).

## 12. Как импортировать и экспортировать данные

### Экспорт

Кнопки в верхней панели:

- `Экспорт JSON` — полный снимок всех коллекций.
- `Идеи в CSV`
- `Рейтинг в CSV`
- `Обмены в CSV`

### Импорт

1. Нажмите `Импорт JSON`.
2. Выберите файл с объектом вида:

```json
{
  "employees": [],
  "ideas": [],
  "reviews": [],
  "rewards": [],
  "redemptions": []
}
```

3. После успешной валидации данные заменят текущие коллекции в `localStorage`.

## Структура проекта

```text
warehouse-improvements-app/
  package.json
  vite.config.js
  index.html
  README.md
  public/
    vite.svg
  src/
    main.jsx
    App.jsx
    styles/
      global.css
    constants/
      roles.js
      statuses.js
    data/
      demoData.js
    models/
      employeeModel.js
      ideaModel.js
      reviewModel.js
      rewardModel.js
      redemptionModel.js
    storage/
      localStorageService.js
    hooks/
      useWarehouseData.js
    utils/
      id.js
      quarter.js
      points.js
      stats.js
      export.js
      import.js
      validation.js
      format.js
    components/
      NavigationTabs.jsx
      SummaryCards.jsx
      Notification.jsx
      ImportExportBar.jsx
    pages/
      IdeasPage.jsx
      HrReviewPage.jsx
      EmployeesPage.jsx
      RewardsPage.jsx
      RedemptionsPage.jsx
```

## Роли (архитектурная подготовка)

Верхний селектор роли позволяет проверять ограничения:

- `admin`: полный доступ.
- `hr`: оценка идей HR и обмен баллов.
- `viewer`: только просмотр.

Это упрощенная основа, которую можно расширить до полноценной авторизации.
