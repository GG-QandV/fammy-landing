# Usage Limits Display — Architecture

> Branch: `landing-v3` | Commit: `53cc34c`  
> Feature: отображение остатка проверок для анонимных пользователей

---

## 1. Назначение

Показывать пользователю сколько проверок осталось сегодня (за 24ч) — при открытии страницы или экрана инструмента, без необходимости делать запрос.

**Лимиты по умолчанию:**
| Инструмент | Лимит/24ч |
|---|---|
| F1 — Nutrient Analysis | 5 |
| F2 — Food Safety Check | 10 |

---

## 2. Файловая структура

```
app/
  api/
    usage/
      route.ts              ← GET /api/usage — читает Supabase, возвращает остаток
    f1/analyze/route.ts     ← POST, теперь возвращает remainingToday + dailyLimit
    f2/check/route.ts       ← POST, теперь возвращает remainingToday + dailyLimit

hooks/
  useUsageCount.ts          ← хук: fetch /api/usage при монтировании
  useFeatureLimits.ts       ← хук: читает promo JWT из cookie (для промо-лимитов)

components/
  ui/
    usage-counter.tsx       ← основной компонент (persistent, загружается при открытии)
    usage-limit-badge.tsx   ← вспомогательный (показывается после проверки, не используется активно)

  landing/
    hero.tsx                ← главная страница (/), UsageCounter × 2
  landing-v3/
    hero-v3.tsx             ← /draft hero, UsageCounter
    tool-sheet.tsx          ← Sheet/Dialog экраны F1/F2, UsageCounter в шапке

app/
  food-safety-check/
    f2-client.tsx           ← страница /food-safety-check, UsageCounter
  nutrient-analysis/
    f1-client.tsx           ← страница /nutrient-analysis, UsageCounter
```

---

## 3. Поток данных

```
Пользователь открывает страницу/экран
        │
        ▼
UsageCounter монтируется
        │
        ▼
useUsageCount() → fetch GET /api/usage (credentials: include)
        │
        ▼
/api/usage читает cookie anon_id + IP
        │
        ├─ Supabase: SELECT COUNT(*) FROM landing_f1_usage_events
        │            WHERE (anon_id = ? OR ip = ?) AND created_at > now()-24h
        │
        ├─ Supabase: SELECT COUNT(*) FROM landing_f2_usage_events
        │            (аналогично)
        │
        ▼
Ответ: { f1: { used, limit, remaining }, f2: { used, limit, remaining } }
        │
        ▼
UsageCounter рендерит: "Remaining today: 9 of 10"
```

---

## 4. API

### `GET /api/usage`

**Cookies required:** `anon_id`  
**Headers:** автоматически через `credentials: 'include'`

**Response 200:**
```json
{
  "f1": { "used": 2, "limit": 5, "remaining": 3 },
  "f2": { "used": 7, "limit": 10, "remaining": 3 }
}
```

**Fallback (нет anon_id):** возвращает полные лимиты (used: 0).

---

### `POST /api/f1/analyze` / `POST /api/f2/check`

Теперь включают в успешный ответ:
```json
{
  "success": true,
  "data": { ... },
  "remainingToday": 4,
  "dailyLimit": 5
}
```

При `LIMIT_REACHED` (403) — `remainingToday` не возвращается (клиент использует `0`).

---

## 5. Компоненты

### `UsageCounter` (`components/ui/usage-counter.tsx`)

```tsx
<UsageCounter feature="f2" />
<UsageCounter feature="f1" className="border-white/20 bg-white/10 text-white" />
```

**Props:**
| Prop | Тип | Описание |
|---|---|---|
| `feature` | `'f1' \| 'f2'` | Какой инструмент показывать |
| `className` | `string?` | Переопределение стилей |

**Поведение:**
- Пока грузится — показывает серый скелетон (`animate-pulse`)
- После загрузки — цветной пилл: 🟢 >50% / 🟡 >20% / 🔴 ≤20%
- Текст: `"Remaining today: N of M"` (через i18n ключи `usage_remaining_label`, `usage_remaining_of`)

### `useUsageCount` (`hooks/useUsageCount.ts`)

```ts
const usage = useUsageCount(); // null пока грузится
// usage.f2.remaining, usage.f2.limit, usage.f2.used
```

### `useFeatureLimits` (`hooks/useFeatureLimits.ts`)

Читает `promo_token` cookie, декодирует JWT payload (без верификации — только для UI), возвращает `{ dailyLimit, usageLimit }` для конкретного feature code.

```ts
const limits = useFeatureLimits('human_foods_checker');
// limits?.dailyLimit — лимит из промо-кода
```

---

## 6. i18n ключи

Добавлены во все 4 языка (`lib/i18n.ts`):

| Ключ | EN | UA |
|---|---|---|
| `usage_remaining_label` | `"Remaining today:"` | `"Залишилось сьогодні:"` |
| `usage_remaining_of` | `"of"` | `"з"` |

---

## 7. Supabase таблицы

| Таблица | Используется |
|---|---|
| `landing_f1_usage_events` | F1 usage tracking |
| `landing_f2_usage_events` | F2 usage tracking |
| `landing_f2_entitlements` | Безлимитные пользователи (entitlement) |

**Двойная защита:** запросы фильтруются по `anon_id OR ip_address` — защита от смены cookie.

---

## 8. Промо-коды и лимиты

Если у пользователя активен `promo_token` cookie:
- `useFeatureLimits` декодирует JWT и извлекает `dailyLimit` для конкретного feature
- `UsageCounter` продолжает читать реальный остаток из `/api/usage` (Supabase)
- Промо-лимиты влияют на gate-логику в `route.ts` (через `jwtVerify`)

---

## 9. Места размещения счётчика

| Место | Компонент | Feature |
|---|---|---|
| Главная `/` — под заголовком | `hero.tsx` | активный таб (f1/f2) |
| Главная `/` — над промо-блоком | `hero.tsx` | активный таб (f1/f2) |
| `/draft` hero | `hero-v3.tsx` | f2 |
| `/draft` ToolSheet шапка | `tool-sheet.tsx` | f1 или f2 |
| `/food-safety-check` | `f2-client.tsx` | f2 |
| `/nutrient-analysis` | `f1-client.tsx` | f1 |

---

## 10. Расширение / TODO

- [ ] Обновлять счётчик после каждой успешной проверки (без перезагрузки страницы) — через `mutate` или `refetch`
- [ ] Поддержка промо-лимитов в `/api/usage` (сейчас возвращает только дефолтные)
- [ ] Кэширование `/api/usage` на 60с (сейчас каждый mount = новый запрос)
- [ ] Добавить счётчик для F3–F6 когда они станут доступны
