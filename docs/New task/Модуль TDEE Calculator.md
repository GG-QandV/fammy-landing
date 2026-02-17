## Команда экспертов

**Backend Architect (модульная архитектура):** Проектирование микромодуля TDEE как независимого сервиса с чёткими портами ввода/вывода.

**Nutrition Scientist (TDEE формулы):** Адаптация формул Mifflin-St Jeor для питомцев (собаки, кошки) + валидация multipliers по активности.

**Database Engineer (миграции БД):** Добавление таблиц/колонок без breaking changes существующих сервисов.

**Integration Specialist (стыковки):** Связь нового модуля с существующими endpoints через middleware/decorators.

**QA Engineer (тестирование):** Unit-тесты для формул, integration-тесты для стыковки с `portion-calc.service.ts`.

---

## Архитектурный план: Модуль TDEE Calculator

## 1. Scope модуля

**Входные данные:**

* `species` (dog, cat, human)

* `weight_kg` (0.5-150)

* `activity_level` (sedentary, low, moderate, high, very_high)

* `life_stage` (puppy/kitten, adult, senior / child, adult_human, elderly)

* `goal` (maintain, lose, gain) — опционально

* `gender` (male, female, neutered) — для точности

**Выходные данные:**

typescript

`{   bmr: number;           // Basal Metabolic Rate (ккал/день)  tdee: number;          // Total Daily Energy Expenditure  protein_g: number;     // Рекомендуемая норма белка  fat_g: number;         // Норма жиров  carbs_g: number;       // Норма углеводов (опционально для собак/кошек)  formula_used: string;  // Название формулы  multiplier: number;    // Activity multiplier }`

---

## 2. Структура микромодуля

text

`src/ └── modules/     └── tdee/        ├── tdee.service.ts          # Основная логика расчёта        ├── tdee.formulas.ts         # Формулы BMR/TDEE (Mifflin, RER)        ├── tdee.multipliers.ts      # Activity/life stage коэффициенты        ├── tdee.schema.ts           # Zod валидация входов        ├── tdee.types.ts            # TypeScript интерфейсы        └── __tests__/            └── tdee.service.test.ts # Unit-тесты формул`

**Размер модуля:** ~300-400 строк (без тестов).

---

## 3. Алгоритм расчёта

## Формулы BMR (Basal Metabolic Rate)

**Для собак/кошек:**

text

`RER (Resting Energy Requirement) = 70 × (weight_kg^0.75)`

**Для людей (Mifflin-St Jeor):**

text

`Male:   BMR = 10 × weight_kg + 6.25 × height_cm - 5 × age + 5 Female: BMR = 10 × weight_kg + 6.25 × height_cm - 5 × age - 161`

## Activity multipliers

| Species | Activity Level          | Multiplier |
| ------- | ----------------------- | ---------- |
| Dog/Cat | Neutered adult          | 1.2        |
| Dog/Cat | Intact adult            | 1.4        |
| Dog/Cat | Active/working          | 1.6-2.0    |
| Dog/Cat | Puppy/kitten growth     | 2.0-3.0    |
| Dog/Cat | Senior (low activity)   | 1.0-1.2    |
| Human   | Sedentary               | 1.2        |
| Human   | Moderate (3-4x/week)    | 1.55       |
| Human   | Very active (6-7x/week) | 1.9        |

**TDEE = RER × Multiplier**

## Макронутриенты

**Собаки:**

* Protein: 25-30% калорий (1g = 4 kcal)

* Fat: 10-15% калорий (1g = 9 kcal)

* Carbs: остаток

**Кошки (obligate carnivores):**

* Protein: 35-45%

* Fat: 20-30%

* Carbs: <10%

**Люди:**

* Protein: 15-25%

* Fat: 20-35%

* Carbs: 45-65%

---

## 4. Интеграция с существующим бэкендом

## 4.1. Модификация `PortionCalcInputSchema`[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_59fe2b6f-79a2-4784-b649-8d4e4b4354c5/538855ff-c0ae-4da2-ad6e-7b7262a502d1/functions.schema.ts.txt)]​

**Добавить опциональные поля (backward compatible):**

typescript

`export const PortionCalcInputSchema = z.object({   // ... существующие поля ...     // NEW: Physical parameters (optional)  weight_kg: z.number().positive().max(150).optional(),  activity_level: z.enum(['sedentary', 'low', 'moderate', 'high', 'very_high']).optional(),  life_stage: z.enum(['puppy', 'adult', 'senior', 'kitten', 'child', 'adult_human', 'elderly']).optional(),  gender: z.enum(['male', 'female', 'neutered']).optional(),  goal: z.enum(['maintain', 'lose', 'gain']).default('maintain'),     // NEW: TDEE calculation mode toggle  calculate_tdee: z.boolean().default(false) });`

## 4.2. Модификация `portion-calc.service.ts`[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_59fe2b6f-79a2-4784-b649-8d4e4b4354c5/f57e436c-fb04-496b-97a6-517b75ba0ba7/portion-calc.service.ts.txt)]​

**Добавить условную логику:**

typescript

`async calculate(input: PortionCalcInput, userId: string, lang: string) {   // ... существующий код (resolve subject, target) ...     // NEW: TDEE calculation branch  let tdeeResult = null;  if (input.calculate_tdee && input.weight_kg) {    tdeeResult = await this.tdeeService.calculate({      species: targetCode,      weight_kg: input.weight_kg,      activity_level: input.activity_level || 'moderate',      life_stage: input.life_stage || 'adult',      gender: input.gender,      goal: input.goal    });  }     // ... существующий код (nutrient aggregation) ...     return {    // ... существующие поля ...         // NEW: TDEE data (if requested)    tdee: tdeeResult ? {      daily_calories: tdeeResult.tdee,      bmr: tdeeResult.bmr,      recommended_macros: {        protein_g: tdeeResult.protein_g,        fat_g: tdeeResult.fat_g,        carbs_g: tdeeResult.carbs_g      },      formula_used: tdeeResult.formula_used    } : null  }; }`

**Критическая точка ⚠️:** Не ломает существующие вызовы (`calculate_tdee: false` по умолчанию).

---

## 5. База данных: миграция без breaking changes

## 5.1. Новая таблица `reference.tdee_multipliers`

sql

`CREATE TABLE reference.tdee_multipliers (   id SERIAL PRIMARY KEY,  species VARCHAR(20) NOT NULL,  life_stage VARCHAR(30) NOT NULL,  activity_level VARCHAR(20) NOT NULL,  gender VARCHAR(10),  multiplier DECIMAL(3,2) NOT NULL,  source VARCHAR(50),  is_active BOOLEAN DEFAULT TRUE ); INSERT INTO reference.tdee_multipliers VALUES   (1, 'dog', 'adult', 'moderate', 'neutered', 1.20, 'NRC 2006', TRUE),  (2, 'dog', 'adult', 'high', 'neutered', 1.60, 'NRC 2006', TRUE),  (3, 'dog', 'puppy', 'high', NULL, 2.50, 'NRC 2006', TRUE),  (4, 'cat', 'adult', 'moderate', 'neutered', 1.20, 'AAFCO', TRUE),  (5, 'cat', 'kitten', 'high', NULL, 2.50, 'AAFCO', TRUE),  (6, 'human', 'adult', 'moderate', 'male', 1.55, 'Mifflin-St Jeor', TRUE);`

## 5.2. Обновление `app.fn_portions` (опционально)

**Существующая таблица ** уже имеет:[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_59fe2b6f-79a2-4784-b649-8d4e4b4354c5/eba5bb9c-884a-4bf8-8cce-8d8a82457e76/Architecture_v3_Part2_App_Schema_Core.md)]​

* `weight_kg DECIMAL(6,2) NOT NULL`

* `activity_level VARCHAR(20)`

* `life_stage VARCHAR(30)`

* `daily_calories INTEGER`

**Добавить:**

sql

`ALTER TABLE app.fn_portions ADD COLUMN IF NOT EXISTS gender VARCHAR(10), ADD COLUMN IF NOT EXISTS bmr INTEGER, ADD COLUMN IF NOT EXISTS tdee INTEGER, ADD COLUMN IF NOT EXISTS goal VARCHAR(20);`

**Индекс для поиска:**

sql

`CREATE INDEX idx_fnportions_tdee  ON app.fn_portions(user_id, subject_id, created_at DESC);`

---

## 6. Критические контрольные точки

## 🔴 CP1: Backward compatibility

**Тест:** Existing `POST /portion-calc` запросы без новых полей возвращают прежний результат.

bash

`# До изменений curl -X POST /api/v1/functions/portion-calc \   -H "Authorization: Bearer $TOKEN" \  -d '{"subject_id": "uuid", "items": [...], "period": "day"}' # После изменений (тот же запрос должен работать)`

## 🔴 CP2: TDEE формулы точность

**Тест:** Unit-тесты для известных значений.

typescript

`test('Dog 10kg moderate activity', () => {   const result = tdeeService.calculate({    species: 'dog',    weight_kg: 10,    activity_level: 'moderate',    life_stage: 'adult',    gender: 'neutered'  });     expect(result.bmr).toBeCloseTo(10^0.75 * 70, 1); // RER  expect(result.tdee).toBeCloseTo(result.bmr * 1.2, 1); });`

## 🔴 CP3: Database migration rollback

**Plan B:** Если миграция ломает prod:

1. Rollback SQL: `DROP TABLE reference.tdee_multipliers;`

2. Service fallback: `if (!tdeeMultipliersTable) return defaultMultiplier(1.2);`

## 🔴 CP4: Performance impact

**Мониторинг:** TDEE расчёт не должен увеличивать latency `/portion-calc` >50ms.

typescript

`const startTime = Date.now(); const tdeeResult = await tdeeService.calculate(...); const elapsed = Date.now() - startTime; if (elapsed > 50) logger.warn('TDEE calculation slow', { elapsed });`

---

## 7. Возможные проблемы и решения

| Проблема                                                                          | Риск   | Решение                                                                             |
| --------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Формулы для экзотических животных (птицы, рептилии) отсутствуют                   | Medium | Phase 2: добавить в `reference.tdee_multipliers` по мере поступления научных данных |
| Пользователи вводят некорректный вес (0.1 кг для собаки)                          | Low    | Zod валидация: `weight_kg: z.number().min(0.5).max(150)`                            |
| Conflicting data: пользователь ввёл `weight_kg`, но `subject_id` имеет другой вес | Medium | Priority: user input > subject DB weight (с warning в логах)                        |
| Frontend не знает о новых полях                                                   | Low    | Опциональные поля — фронтенд может игнорировать                                     |
| Миграция БД ломает `app.fn_portions` INSERT                                       | High   | Использовать `ALTER TABLE ADD COLUMN IF NOT EXISTS` + default values                |

---

## 8. Реализация: пошаговый план

## Phase 1: Модуль TDEE (изолированный)

**Дедлайн:** 3 дня  
**Владелец:** Backend Developer

* **Шаг 1.1:** Создать `src/modules/tdee/tdee.service.ts`
  
  * Метод `calculate(input: TdeeInput): TdeeResult`
  
  * Формулы RER, Mifflin-St Jeor

* **Шаг 1.2:** Создать `tdee.multipliers.ts`
  
  * Константы activity multipliers
  
  * Функция `getMultiplier(species, lifeStage, activity)`

* **Шаг 1.3:** Unit-тесты (coverage ≥90%)
  
  * Тест для собак/кошек/людей
  
  * Граничные значения (вес 0.5 кг, 150 кг)

**Checkpoint CP1:** Модуль работает standalone, не зависит от основного бэкенда.

---

## Phase 2: Интеграция с `portion-calc`

**Дедлайн:** 2 дня  
**Владелец:** Backend Developer + Integration Specialist

* **Шаг 2.1:** Обновить `functions.schema.ts`
  
  * Добавить опциональные поля в `PortionCalcInputSchema`

* **Шаг 2.2:** Модифицировать `portion-calc.service.ts`
  
  * Добавить условную логику `if (input.calculate_tdee)`
  
  * Inject `TdeeService` через DI

* **Шаг 2.3:** Integration test
  
  * POST `/portion-calc` с `calculate_tdee: true`
  
  * Проверить наличие `tdee` в response

**Checkpoint CP2:** Endpoint возвращает TDEE данные без ошибок.

---

## Phase 3: Database migration

**Дедлайн:** 1 день  
**Владелец:** Database Engineer

* **Шаг 3.1:** Создать миграцию `202602XX_add_tdee_multipliers.sql`
  
  * `CREATE TABLE reference.tdee_multipliers`
  
  * `INSERT` начальные данные (собаки, кошки, люди)

* **Шаг 3.2:** Обновить `app.fn_portions`
  
  * `ALTER TABLE ADD COLUMN gender, bmr, tdee, goal`

* **Шаг 3.3:** Протестировать rollback
  
  * `DROP TABLE reference.tdee_multipliers` без ошибок

**Checkpoint CP3:** Миграция проходит без downtime.

---

## Phase 4: E2E тестирование

**Дедлайн:** 1 день  
**Владелец:** QA Engineer

* **Шаг 4.1:** Backward compatibility
  
  * Старые запросы без новых полей работают

* **Шаг 4.2:** TDEE accuracy
  
  * Сравнить результаты с онлайн калькуляторами

* **Шаг 4.3:** Performance
  
  * Latency `/portion-calc` <100ms

**Checkpoint CP4:** Production-ready.

---

## Phase 5: Документация + деплой

**Дедлайн:** 1 день  
**Владелец:** Tech Lead

* **Шаг 5.1:** Обновить `openapi.json`
  
  * Добавить новые поля в `/portion-calc` схему

* **Шаг 5.2:** Frontend документация
  
  * Создать `TDEE_INTEGRATION.md` для фронтенд-команды

* **Шаг 5.3:** Deploy staging → prod
  
  * Канареечный релиз (10% трафика)

---

## 9. Чеклист для контроллера (вы)

## TDEE Module Implementation Checklist

### Pre-implementation

- [ ] Научные источники формул утверждены (NRC 2006, AAFCO, Mifflin-St Jeor)
- [ ] Multipliers для собак/кошек проверены ветеринаром
- [ ] Staging окружение готово

### Phase 1: Module (CP1)

- [ ] `tdee.service.ts` создан
- [ ] Unit-тесты ≥90% coverage
- [ ] Code review пройден
- [ ] Модуль работает изолированно

### Phase 2: Integration (CP2)

- [ ] Schema обновлена (backward compatible)
- [ ] `portion-calc.service.ts` использует TDEE модуль
- [ ] Integration test проходит
- [ ] Latency <100ms

### Phase 3: Database (CP3)

- [ ] Миграция `tdee_multipliers` выполнена
- [ ] Rollback скрипт протестирован
- [ ] `app.fn_portions` обновлена без ошибок
- [ ] Production backup создан до миграции

### Phase 4: Testing (CP4)

- [ ] E2E тесты проходят
- [ ] Backward compatibility подтверждена
- [ ] Performance regression не обнаружена
- [ ] Sentry не показывает новых ошибок (48 часов)

### Phase 5: Deployment

- [ ] OpenAPI документация обновлена
- [ ] Frontend team уведомлена о новых полях
- [ ] Staging деплой успешен
- [ ] Production canary (10%) без инцидентов
- [ ] Full production rollout

---

## 10. Артефакты реализации

**Файл для фиксации:** `docs/implementations/TDEE_MODULE_LOG.md`

# TDEE Module Implementation Log

## Timeline

- 2026-02-16: Plan approved
- 2026-02-XX: Phase 1 complete
- 2026-02-XX: Phase 2 complete
- ...

## Decisions

1. **Formula choice:** RER для собак/кошек (70×weight^0.75) вместо калорий на кг
   - Reason: NRC 2006 стандарт
2. **Multipliers source:** AAFCO + NRC + Mifflin-St Jeor
   - Reason: Peer-reviewed + ветеринарная практика
3. **Backward compatibility:** Опциональные поля + `calculate_tdee` флаг
   - Reason: Не ломать существующие интеграции

## Issues

1. **Миграция `app.fn_portions`:** Поле `weight_kg` NOT NULL конфликтует
   - Solution: Сделать `weight_kg` nullable + default NULL
2. **Performance:** TDEE расчёт добавил +30ms latency
   - Solution: Кэшировать multipliers в Redis

## Metrics

- Unit tests coverage: 94%
- Integration tests: 12 passed
- Latency impact: +30ms (acceptable)
- Production incidents: 0

---

## Обоснование для пользователей (≤100 слов)

Точный расчёт калорий устраняет перекорм/недокорм — основные причины ожирения (60% собак) и дефицита нутриентов. Индивидуальные нормы учитывают возраст, активность, стерилизацию — стандартные таблицы этого не дают. Результат: оптимальный вес питомца без проб/ошибок, экономия на ветеринаре (профилактика диабета, болезней суставов), точная порция корма (экономия до 20% бюджета). Для людей — семейная норма в одном приложении, мотивация следить за здоровьем питомца = следить за своим.
