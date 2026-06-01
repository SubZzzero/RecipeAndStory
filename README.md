# Foodsum (React Edition)

Foodsum показывает случайные food-фото из Pixabay.
Проект перенесен на `React + Vite` (без TypeScript), с новым UI, полным адаптивом и готовностью к деплою на Firebase Hosting.

## Стек

- React 19
- Vite 7
- CSS Modules
- Pixabay API

## Быстрый старт

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env` из примера:

```bash
cp .env.example .env
```

3. Укажите ключ Pixabay в `.env`:

```env
VITE_PIXABAY_KEY=your_pixabay_api_key_here
```

4. Запустите dev-сервер:

```bash
npm run dev
```

## Scripts

```bash
npm run dev      # локальная разработка
npm run build    # production-сборка в dist
npm run preview  # просмотр production-сборки
npm run lint     # eslint
```

## Поведение UI

- Кнопка `Random photo` загружает новое случайное фото еды.
- Во время загрузки кнопка блокируется.
- Клик по фото открывает оригинал в новой вкладке.
- Ошибки сети/ключа или пустой ответ API отображаются как состояние интерфейса и не ломают страницу.

## Адаптив

Верстка mobile-first и проверена под диапазоны:

- `320`, `360`, `390`, `414`, `480`
- `768`, `1024`
- `1280`, `1440+`

Поддерживаются portrait/landscape сценарии без горизонтального скролла.

## Firebase Hosting (Free) — ручной деплой

1. Установите Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Авторизуйтесь:

```bash
firebase login
```

3. Создайте production build:

```bash
npm run build
```

4. Инициализируйте проект (если нужно) и выберите ваш Firebase project:

```bash
firebase use --add
```

5. Деплой:

```bash
firebase deploy --only hosting
```

В репозитории уже добавлены:

- `firebase.json` (`public: dist`, SPA rewrite на `/index.html`)
- `.firebaseignore`

## Legacy

Старая реализация на чистом `HTML/CSS/JS` удалена из активной структуры проекта после миграции на React.
