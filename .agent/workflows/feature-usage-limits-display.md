---
description: Добавление отображения остатка проверок (usage limits) на экранах функций в Hero и на страницах функций
---

# Workflow: Feature Usage Limits Display

## Контекст и архитектура

### Что такое лимиты использования

Каждая функция (F1, F2, ...) имеет лимиты проверок, которые приходят из двух источников:

1. **Promo-токен (JWT)** — хранится в cookie `promo_token`. Содержит `features[]` с полями:
   - `code` — код функции (`diet_validator`, `human_foods_checker`, ...)
   - `usageLimit` — общий лимит (null = безлимитно)
   - `dailyLimit` — дневной лимит (null = безлимитно)

2. **Ответ API при проверке** — каждый вызов `/api/f1/analyze` или `/api/f2/check` возвращает поле `remainingToday` (или аналогичное) если лимит установлен. Нужно уточнить точное имя поля в backend-ответе.

### Где отображать остаток

| Место | Позиция вставки |
|-------|----------------|
| **Hero (main branch)** — `components/landing/hero.tsx` | **Над полоской** (над `<div className="mt-8 rounded-xl bg-cream/30...">` promo-блока) и **под плашкой с заголовком** (под `<h1>` и `<p>` описания) |
| **Hero-v3** — `components/landing-v3/hero-v3.tsx` | Аналогично: над promo-блоком и под заголовком |
| **Страница F2** — `app/food-safety-check/f2-client.tsx` | **Под подзаголовком** (под `<p className="mt-4 text-muted-foreground">`) |
| **Страница F1** — `app/nutrient-analysis/f1-client.tsx` | **Под подзаголовком** (под `<p className="mt-4 text-muted-foreground">`) |

---

## Шаг 1: Создать хук `useFeatureLimits`

Создать файл `hooks/useFeatureLimits.ts`:

```typescript
// Читает promo_token из cookie, декодирует JWT (без верификации — только payload),
// возвращает лимиты для конкретной функции.
// Также принимает remainingToday из ответа API (передаётся снаружи).

export interface FeatureLimits {
  dailyLimit: number | null;      // null = безлимитно
  usageLimit: number | null;      // null = безлимитно
  remainingToday: number | null;  // null = неизвестно или безлимитно
}

export function useFeatureLimits(featureCode: string): FeatureLimits | null
```

**Логика хука:**
1. Читать cookie `promo_token`
2. Декодировать base64 payload (второй сегмент JWT) без верификации
3. Найти в `features[]` запись с `code === featureCode`
4. Вернуть `{ dailyLimit, usageLimit, remainingToday: null }` (remainingToday обновляется снаружи)
5. Если promo_token отсутствует или функция не найдена — вернуть `null`

---

## Шаг 2: Создать компонент `UsageLimitBadge`

Создать файл `components/ui/usage-limit-badge.tsx`:

```tsx
// Отображает остаток проверок в виде строки.
// Если лимит не установлен (null) — ничего не рендерит.

interface UsageLimitBadgeProps {
  remainingToday: number | null;
  dailyLimit: number | null;
  featureLabel?: string;  // название функции для текста
  className?: string;
}

// Примеры отображения:
// "Залишилось сьогодні: 7 з 10 перевірок"
// "Залишилось сьогодні: 7 перевірок"  (если usageLimit не известен)
// Ничего не рендерить если remainingToday === null
```

**Стилизация:**
- Маленький badge / строка текста
- Цвет: зелёный если > 50% осталось, жёлтый если < 30%, красный если < 10%
- Позиционирование зависит от места вставки (см. ниже)

---

## Шаг 3: Обновить API-ответы (уточнить у backend)

Перед реализацией — **проверить** что возвращают `/api/f1/analyze` и `/api/f2/check` при достижении лимита или при обычном ответе:

```bash
# Проверить текущий ответ F2
curl -X POST http://localhost:3000/api/f2/check \
  -H "Content-Type: application/json" \
  -d '{"target":"dog","foodId":"chicken","lang":"en"}'
```

Если `remainingToday` не возвращается — нужно добавить его в backend-ответ. Это отдельная задача для backend.

---

## Шаг 4: Вставить в Hero (main branch)

**Файл:** `components/landing/hero.tsx`

### 4a. Под заголовком (под `<p>` описания, строка ~251)

```tsx
{/* Usage limit badge — под описанием, над формой */}
<UsageLimitBadge
  remainingToday={remainingToday}
  dailyLimit={featureLimits?.dailyLimit ?? null}
  className="mt-3"
/>
```

### 4b. Над promo-блоком (строка ~448, перед `<div className="mt-8 rounded-xl bg-cream/30...">`)

```tsx
{/* Usage limit reminder — над promo-блоком */}
{featureLimits && featureLimits.remainingToday !== null && (
  <UsageLimitBadge ... className="mb-2" />
)}
```

**Примечание:** В hero.tsx нужно добавить state `remainingToday` и обновлять его из ответов `handleF2Check` и `handleF1Submit`.

---

## Шаг 5: Вставить в Hero-v3

**Файл:** `components/landing-v3/hero-v3.tsx`

Hero-v3 не содержит форм функций напрямую (только promo-блок и кнопку "Choose Tool"). Поэтому:
- Если promo-токен активен — показывать суммарный badge под заголовком с общим количеством доступных функций и их лимитами
- Позиция: под `<p className="mt-4 text-muted-foreground">` (строка ~62), над `<Button>` "Choose Tool"

---

## Шаг 6: Вставить в страницу F2

**Файл:** `app/food-safety-check/f2-client.tsx`

Позиция: под `<p className="mt-4 text-muted-foreground">` (строка ~52-54)

```tsx
<div className="w-full max-w-lg mx-auto text-left">
  <p className="mt-4 text-muted-foreground">
    {t(func.i18nDescKey as any)}
  </p>
  {/* ВСТАВИТЬ ЗДЕСЬ */}
  <UsageLimitBadge
    remainingToday={remainingToday}
    dailyLimit={featureLimits?.dailyLimit ?? null}
    className="mt-3"
  />
</div>
```

Также обновлять `remainingToday` из ответа `StepSearch` (через `onResult` callback).

---

## Шаг 7: Вставить в страницу F1

**Файл:** `app/nutrient-analysis/f1-client.tsx`

Позиция: под `<p className="mt-4 text-muted-foreground">` (строка ~53-55)

Аналогично F2. Обновлять `remainingToday` из ответа `StepAnalyze` (через `onResult` callback).

---

## Шаг 8: i18n ключи

Добавить в `lib/i18n.ts` для всех языков (en, ua, es, fr):

| Ключ | en | ua |
|------|----|----|
| `usage_remaining_today` | `Remaining today: {n} of {total}` | `Залишилось сьогодні: {n} з {total}` |
| `usage_remaining_simple` | `Remaining today: {n}` | `Залишилось сьогодні: {n}` |
| `usage_unlimited` | `Unlimited checks` | `Необмежена кількість перевірок` |

---

## Шаг 9: Условие отображения

Показывать badge **только если**:
1. Есть активный promo-токен (`promo_token` cookie существует и не истёк)
2. Функция имеет `dailyLimit !== null` (т.е. лимит установлен)
3. `remainingToday !== null` (данные получены)

Если `dailyLimit === null` (безлимитно) — **не показывать** badge (нет смысла).

---

## Файлы для изменения

| Файл | Действие |
|------|---------|
| `hooks/useFeatureLimits.ts` | [NEW] Хук для чтения лимитов из promo JWT |
| `components/ui/usage-limit-badge.tsx` | [NEW] Компонент отображения остатка |
| `components/landing/hero.tsx` | [MODIFY] Добавить badge под h1/p и над promo-блоком |
| `components/landing-v3/hero-v3.tsx` | [MODIFY] Добавить badge под описанием |
| `app/food-safety-check/f2-client.tsx` | [MODIFY] Добавить badge под подзаголовком |
| `app/nutrient-analysis/f1-client.tsx` | [MODIFY] Добавить badge под подзаголовком |
| `lib/i18n.ts` | [MODIFY] Добавить i18n ключи |

---

## Верификация

```bash
# 1. TypeScript check
cd /home/gg/projects/nutrition_data/fammy-landing
npx tsc --noEmit

# 2. Dev server
npm run dev

# 3. Ручная проверка в браузере:
# - Открыть http://localhost:3000
# - Ввести promo-код с dailyLimit (например, код с dailyLimit=5)
# - Убедиться что badge появился под заголовком и над promo-блоком
# - Перейти на /food-safety-check — badge должен быть под описанием
# - Перейти на /nutrient-analysis — badge должен быть под описанием
# - Сделать проверку — убедиться что счётчик уменьшился
```
