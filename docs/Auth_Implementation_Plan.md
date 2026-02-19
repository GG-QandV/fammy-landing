# План реализации авторизации (Frontend)

Этот план описывает этапы реализации функционала входа и регистрации для `fammy-landing` в соответствии с архитектурным документом `Auth-Login_Register_Architectural_Solution.md`.

## User Review Required

> [!IMPORTANT]
> **API Client**: Существующий `lib/backendApi.ts` ориентирован на server-side. Будет создан отдельный клиентский модуль `lib/authApi.ts` (или расширен текущий) для работы с токенами (хранение в localStorage, интерсепторы для refresh token).

> [!NOTE]
> **Маршрутизация**: Будут созданы новые страницы `/login`, `/register`, `/forgot-password`, а также `/profile` для авторизованных пользователей.

## Proposed Changes

### Batch 1: Auth Infrastructure (Инфраструктура)

Создание базовых механизмов для управления состоянием авторизации и взаимодействия с API.

#### [NEW] [auth.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/context/AuthContext.tsx)
- Создание `AuthContext` и `AuthProvider`.
- Состояние: `user`, `isAuthenticated`, `isLoading`.
- Методы: `login()`, `register()`, `logout()`.
- Инициализация: проверка наличия токена при загрузке приложения.

#### [NEW] [authApi.ts](file:///home/gg/projects/nutrition_data/fammy-landing/lib/authApi.ts)
- Клиент для Auth API (`fetch` обертка).
- Управление токенами в `localStorage` (`petsafe_token`, `petsafe_refresh_token`).
- Логика автоматического обновления токена (Refresh Token Flow) при 401 ошибке.

#### [MODIFY] [layout.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/app/layout.tsx)
- Обернуть приложение в `AuthProvider`.

### Batch 2: Screens & Components (Экраны и компоненты)

Реализация UI страниц входа и регистрации с использованием компонентов Shadcn UI.

#### [NEW] [page.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/app/(auth)/login/page.tsx)
- Экран входа (`LoginScreen`).
- Форма: Email, Password.
- Обработка ошибок валидации и неверных данных.
- Ссылка на регистрацию.

#### [NEW] [page.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/app/(auth)/register/page.tsx)
- Экран регистрации (`RegisterScreen`).
- Форма: Email, Password, Name (optional).
- Выбор языка (связка с `LanguageContext`).
- Обработка успешной регистрации (включая миграцию данных гостя).

#### [MODIFY] [i18n.ts](file:///home/gg/projects/nutrition_data/fammy-landing/lib/i18n.ts)
- Добавление ключей переводов для форм авторизации, ошибок и кнопок.

### Batch 3: UI Integration (Интеграция в интерфейс)

Добавление точек входа в авторизацию в существующий интерфейс.

#### [MODIFY] [nav.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/components/landing/nav.tsx)
- Добавление компонента `AuthButtons`.
- Логика отображения:
    - Гость: Кнопки "Вхід" / "Реєстрація".
    - Пользователь: Аватар / Кнопка "Профіль" (или выход).

#### [NEW] [AuthButtons.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/components/auth/AuthButtons.tsx)
- Компонент кнопок входа/регистрации для хедера.

### Batch 4: Invitations & Middleware (Приглашения и защита)

Реализация флоу приглашений и защита маршрутов.

#### [NEW] [middleware.ts](file:///home/gg/projects/nutrition_data/fammy-landing/middleware.ts)
- (Опционально) Защита маршрутов `/profile`, `/settings` на уровне Next.js middleware, или использование клиентских редиректов в `AuthContext`.

#### [NEW] [page.tsx](file:///home/gg/projects/nutrition_data/fammy-landing/app/invite/[token]/page.tsx)
- Страница принятия приглашения.
- Отображение информации о приглашении (Household name).
- Логика: если нет аккаунта -> редирект на регистрацию с токеном; если есть -> принятие приглашения.

## Verification Plan

### Automated Tests
- Запуск существующих тестов (если есть) чтобы не сломать текущий функционал.
- Создание новых E2E тестов (в рамках отдельной задачи, если потребуется, или ручное тестирование согласно плану ниже).

### Manual Verification
1.  **Регистрация**:
    - Зайти на главную как гость.
    - Нажать "Реєстрація".
    - Заполнить форму -> Успех -> Редирект на главную (или в профиль).
    - Проверить в БД создание пользователя.
2.  **Вход**:
    - Выйти из системы.
    - Нажать "Вхід".
    - Ввести данные -> Успех -> Токены сохранены в localStorage.
3.  **Миграция гостя (Guest Migration)**:
    - Как гость, использовать функции (сохранить `x-session-id`).
    - Зарегистрироваться.
    - Проверить, что данные перенеслись (Toast сообщение).
4.  **Refresh Token**:
    - Вручную протухнуть access token (удалить или изменить в localStorage).
    - Сделать запрос -> Проверить, что он прошел успешно (автоматический refresh).
5.  **Приглашения**:
    - Открыть ссылку приглашения.
    - Пройти флоу регистрации/входа.
    - Проверить добавление в Household.
