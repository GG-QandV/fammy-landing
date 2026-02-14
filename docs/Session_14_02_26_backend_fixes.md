

# Сесія 14.02.26 — Виправлення зв'язків бекенд↔лендінг, waitlist, promo

## Зроблено

### 1. Supabase schema fix

- **Проблема:** supabaseAdmin дефолтно дивився в `public`, а всі таблиці лендінгу в схемі `app`
- **Результат:** Всі API routes (`/api/f2/check`, `/api/f1/analyze`, `/api/waitlist`, `/api/promo/validate`) поверталили 500
- **Фікс:** `lib/supabaseAdmin.ts` — вже мав `db: { schema: 'app' }` + окремий `supabasePublic` для `public` схеми
- **Нестандартне:** Supabase JS client підтримує тільки одну схему на клієнт. Тому два клієнти:
  - `supabaseAdmin` → schema `app` (landing_*, promo_codes, recipes, recipe_ingredients)
  - `supabasePublic` → schema `public` (наразі порожня, зарезервовано)

### 2. Waitlist fix

- **Проблема 1:** Route писав `status: 'pending'` — колонка не існує в `app.landing_waitlist_leads`
- **Проблема 2:** `upsert` з `onConflict: 'email'` не працює з expression unique index `lower(email)`
- **Фікс:** Замінено `upsert` → `insert`, видалено `status` поле, додано обробку дублікатів (code `23505` → success)
- **Файл:** `app/api/waitlist/route.ts`

### 3. Promo system — два типи промокодів

- **Нові колонки в `app.promo_codes`:**
  - `promo_type` varchar(20) — `public` | `personal`
  - `daily_limit` integer — прямий override ліміту (замість tierToLimit)
  - `bound_email` text — email для personal промокодів
  - CHECK constraint: `promo_type IN ('public', 'personal')`
- **Логіка:**
  - `public` — будь-хто з валідним anon_id (UUID) може активувати
  - `personal` — потрібен email що співпадає з `bound_email`
  - `daily_limit` береться з БД, fallback на `tierToLimit()` якщо NULL
- **Файл:** `app/api/promo/validate/route.ts`

### 4. Duplicate lang param fix

- **Проблема:** `&lang=${language}&lang=${language}` в food-autocomplete URL
- **Фікс:** Видалено дублікат
- **Файл:** `components/ui/food-autocomplete.tsx`

### 5. Cleanup

- Видалено `console.log` з `components/landing/hero.tsx` (рядки 70, 119)
- Видалено `new_design/` папку (мертвий код)

---

## Нестандартні особливості та підводні камені

### Supabase schema `app` vs `public`

Supabase JS Client → PostgREST → дивиться ТІЛЬКИ у вказану schema
За замовчуванням: public
Наші таблиці: всі в app

Рішення: createClient(..., { db: { schema: 'app' } })
Наслідок: якщо з'являться таблиці в public — потрібен окремий клієнт (supabasePublic вже є)

text

### anon_id — UUID constraint

Таблиця app.landing_promo_redemptions.anon_id — тип UUID (не text!)
Cookie anon_id генерується через uuid v4 — ОК для реальних юзерів
curl тести з "beta-test-1" — FAIL (invalid UUID syntax)
Тестувати тільки з валідними UUID: 550e8400-e29b-41d4-a716-446655440000

text

### Waitlist unique index

Індекс: UNIQUE btree (lower(email)) WHERE email IS NOT NULL
Supabase upsert onConflict НЕ підтримує expression indexes
Рішення: insert + catch error code 23505 (unique_violation)

text

### Supabase keys — два формати

Новий формат (Supabase dashboard): sb_secret_xxx, sb_publishable_xxx
Старий формат (JWT): eyJhbGciOi...
ОБИДВА працюють з Supabase JS client
Coolify env зараз використовує скорочений формат — ОК

text

### F1 recipes — зайві колонки

Route пише: is_guest, session_id
Таблиця app.recipes: НЕ має цих колонок
Supabase JS мовчки ігнорує невідомі колонки при insert
Працює, але технічний борг — прибрати або додати колонки

text

### recipe_ingredients FK cross-schema

app.recipe_ingredients.food_id → reference.foods(id)
Cross-schema FK працює в PostgreSQL
Supabase JS insert через schema 'app' — працює, FK валідація на рівні БД



---

## Тестові промокоди в БД

| Код         | Тип      | daily_limit | max_uses | bound_email      | Призначення        |
| ----------- | -------- | ----------- | -------- | ---------------- | ------------------ |
| BETA2025    | public   | 30          | 100      | —                | Бета-тестери       |
| VIP-TESTER  | personal | 50          | 10       | tester@fammy.pet | Тест personal flow |
| WINTER2026  | public   | 10          | 50       | —                | Старий тест        |
| CATWINTER26 | public   | 10          | 100      | —                | Старий тест        |
| SUMMER2025  | public   | 10          | 100      | —                | Старий тест        |

---

## Протестовані ендпоінти (прод fammy.pet)

| Ендпоінт              | Метод | Статус | Примітки                                       |
| --------------------- | ----- | ------ | ---------------------------------------------- |
| `/api/waitlist`       | POST  | ✅      | email insert + duplicate handling              |
| `/api/f2/check`       | POST  | ✅      | Потрібен Cookie: anon_id (UUID), foodId (UUID) |
| `/api/f1/analyze`     | POST  | ✅      | 31 нутрієнт, UA локалізація                    |
| `/api/promo/validate` | POST  | ✅      | public + personal types                        |
| `/api/f2/foods`       | GET   | ✅      | food autocomplete                              |

---

## Два репозиторії — УВАГА

| Репо                                                               | GitHub                      | Деплой                  | Статус      |
| ------------------------------------------------------------------ | --------------------------- | ----------------------- | ----------- |
| `/home/gg/projects/nutrition_data/fammy-landing/`                  | GG-QandV/fammy-landing      | **Coolify → fammy.pet** | ПРОД ✅      |
| `/home/gg/projects/nutrition_data/petsafe-validator/`              | GG-QandV/petsafe-validator  | **→ api.fammy.pet**     | Бекенд      |
| `/home/gg/projects/nutrition_data/petsafe-validator/apps/landing/` | (частина petsafe-validator) | **НЕ деплоїться**       | Мертвий код |

**ПРАВИЛО:** Зміни лендінгу — ТІЛЬКИ в `fammy-landing`. Папка `petsafe-validator/apps/landing/` — ігнорувати.

---

## TODO (залишки)

### Бета-блокери

- [ ] Тест Stripe donations/gift flow на проді
- [ ] F1 route: прибрати is_guest, session_id з insert (або додати колонки в БД)

### Покращення

- [ ] hero.tsx: очищати поле промокоду після валідації
- [ ] Promo token передача в F1 request (зараз тільки F2)
- [ ] Мобільна перевірка всіх секцій

### Варіант A — міграція v2 в petsafe landing (довгостроково)

- [ ] Перенести v2 палітру, promo API, localized safe → petsafe-validator/apps/landing
- [ ] АБО видалити apps/landing з монорепо (рекомендовано)
  DOCEOF
  echo "OK"
