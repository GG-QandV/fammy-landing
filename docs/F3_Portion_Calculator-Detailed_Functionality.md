## F3 Калькулятор порций — детальный функционал

## Что делает F3

Рассчитывает дневную норму калорий и макронутриентов (белки, жиры, углеводы) для домашнего животного на основе физических параметров и образа жизни.  (F3__portion_calc.md)]​

---

## API спецификация

## Endpoint

POST /api/v1/functions/portion-calc

## Input (что вводит пользователь

(F3__portion_calc.md)]​

| Поле          | Тип    | Обязательное | Значения                  | Описание                                 |
| ------------- | ------ | ------------ | ------------------------- | ---------------------------------------- |
| `target`      | string | Да           | `dog`, `cat`              | Вид животного                            |
| `subjectId`   | uuid   | Нет          | -                         | ID питомца (если зарегистрирован)        |
| `items`       | array  | Нет          | `[{foodId, amountGrams}]` | Конкретные продукты для расчёта          |
| `recipeId`    | uuid   | Нет          | -                         | ID рецепта                               |
| `period`      | string | Нет          | `meal`, `day`, `week`     | Период расчёта (по умолчанию `meal`)     |
| `mealsPerDay` | number | Нет          | 1-6                       | Количество приёмов пищи (по умолчанию 2) |

**Примечание:** `period: week` доступен только для Gold/VIP тарифов.(F3__portion_calc.md)]​

## Output (что получает пользователь

 (F3__portion_calc.md)

{
{
  "success": true,
  "data": {
    "subject": {
      "id": "uuid",
      "name": "Buddy",
      "target": "dog"
    },
    "period": "day",
    "mealsPerDay": 2,
    "portionGrams": 250,
    "totalGramsPerPeriod": 500,
    "nutrients": [
      {
        "code": "PRO",
        "name": "Protein",
        "amount": 50,
        "unit": "g"
      },
      {
        "code": "FAT",
        "name": "Fat",
        "amount": 22,
        "unit": "g"
      },
      {
        "code": "CARB",
        "name": "Carbohydrates",
        "amount": 95,
        "unit": "g"
      }
    ],
    "per100g": [
      {
        "code": "PRO",
        "name": "Protein",
        "amount": 10,
        "unit": "g"
      }
    ],
    "toxicityWarnings": [],
    "allergenWarnings": []
  }
}
}

---

## User Journey (пошаговое взаимодействие)

## Сценарий 1: Quick calculation (guest user, нет профиля питомца)

**Шаг 1: Пользователь попадает на лендинг**

* Видит секцию "Калькулятор порций"

* Кликает кнопку "Розрахувати" или открывает форму

**Шаг 2: Выбор вида животного**

┌────────────────────────────┐
│ Для кого рассчитываем?                                │
│ ┌─────┐  ┌─────┐                                    │
│ │ 🐕        │   │    🐈     │                                    │
│ │  Dog     │   │  Cat     │                                    │
│ └─────┘  └─────┘                                    │
└────────────────────────────┘

* Выбирает `dog` или `cat`

* Species button активируется (bg-navy) (Context_of_the_session_Landing_page_design_fammy.pet.md)

**Шаг 3: Ввод параметров**

┌────────────────────────────────┐
│ Weight: [___10___] kg                                                             │
│                                                                                        │
│ Activity level:                                                                │
│ ○ Low  ● Moderate  ○ High                                        │
│                                                                                        │
│ Life stage:                                                                     │
│ ○ Puppy  ● Adult  ○ Senior                                         │
│                                                                                        │
│ Goal:                                                                              │
│ ● Maintain  ○ Lose  ○ Gain                                         │
│                                                                                        │
│ [Calculate portions]                                                    │
└────────────────────────────────┘

**Поля формы:**

1. **Weight** (вес в кг) — число 0.5-100

2. **Activity level** (уровень активности) — radio buttons:
   
   * `low` — малоподвижный
   
   * `moderate` — средний
   
   * `high` — высокий
   
   * `very high` — очень высокий

3. **Life stage** (возрастная категория) — radio/dropdown:
   
   * Dog: `puppy`, `adult`, `senior`
   
   * Cat: `kitten`, `adult`, `senior`

4. **Goal** (цель) — radio buttons:
   
   * `maintain` — поддержание веса
   
   * `lose` — снижение веса
   
   * `gain` — набор веса

**Шаг 4: Submit**

* Пользователь нажимает "Calculate portions" (bg-navy кнопка) (Context_of_the_session_Landing_page_design_fammy.pet.md)

* Frontend отправляет POST запрос:

{
{
  "target": "dog",
  "items": [
    {"foodId": "chicken-breast", "amountGrams": 100},
    {"foodId": "rice-white", "amountGrams": 50}
  ],
  "period": "day",
  "mealsPerDay": 2
}
}

**Примечание:** Если пользователь НЕ выбрал конкретные продукты (`items`), API рассчитывает общую норму калорий без привязки к рецепту.[[ppl-ai-file-upload.s3.amazonaws] (F3__portion_calc.md)]​

**Шаг 5: Loading state**

┌────────────────────────────┐
│ ⏳ Calculating...                                               │
│ [Spinner overlay]                                             │
└────────────────────────────┘

* Кнопка disabled

* Spinner overlay на области результатов (F3__portion_calc.md)

**Шаг 6: Results**

┌─────────────────────────────────────┐
│ ✓ Daily nutrition for Buddy (dog)                                          │
├─────────────────────────────────────┤
│ Total per day: 500g                                                                  │
│ Meals: 2 × 250g                                                                         │
│                                                                                                     │
│ Macronutrients:                                                                        │
│ • Protein: 50g (10g/100g)                                                         │
│ • Fat: 22g (4.4g/100g)                                                               │
│ • Carbs: 95g (19g/100g)                                                           │
│                                                                                                     │
│ ⚠️ Warnings: None                                                                  │
└─────────────────────────────────────┘

**Отображаемые данные:**

* Общая масса корма за период (500g/day)

* Разбивка по приёмам пищи (250g × 2)

* Макронутриенты (абсолютные значения + на 100g)

* Предупреждения о токсичности/аллергенах (если есть)

---

## Сценарий 2: Advanced calculation (зарегистрированный пользователь с профилем питомца)

**Отличия от Сценария 1:**

**Шаг 2 (упрощён):** Если у пользователя есть сохранённые питомцы:

┌───────────────────────────┐
│ Select your pet:                                              │
│ [Buddy (Dog, 10kg)]  ▼                                 │ ← Dropdown с сохранёнными питомцами
└───────────────────────────┘

* Автозаполнение полей: weight, activity level, life stage из профиля питомца

* Параметры можно override вручную

**Шаг 3 (расширен):** Добавляется опция:

┌────────────────────────────┐
│ Period:                                                                │
│ ○ Meal  ● Day  ○ Week 🔒                               │ ← Week доступен только для Gold/VIP
└────────────────────────────┘

* `week` — расчёт на неделю (требует Gold/VIP подписку) (F3__portion_calc.md)​

**Шаг 4 (расширен):** Если выбран `week` без подписки → **gating state**:

┌────────────────────────────────┐
│ 🔒 Weekly calculations                                              │
│ Available on Gold plan                                               │
│ [Upgrade now] [Try daily]                                          │
└────────────────────────────────┘

* Показывается paywall modal (F3__portion_calc.md)

* Кнопка "Upgrade now" → `/billing/checkout`

---

## Сценарий 3: Recipe-based calculation (с рецептом)

**Шаг 3 (альтернатива):** Вместо ручного ввода продуктов:

┌────────────────────────────┐
│ Use existing recipe:                                          │
│ [My Chicken Bowl]  ▼                                      │ ← Dropdown с рецептами пользователя
└────────────────────────────┘

* Пользователь выбирает сохранённый рецепт

* API получает `recipeId` вместо `items (F3__portion_calc.md)

**Output отличается:**

{
{
  "data": {
    "recipe": {
      "id": "uuid",
      "name": "My Chicken Bowl"
    },
    "portionGrams": 250,
    "nutrients": [...],
    "toxicityWarnings": [
      {
        "ingredient": "onion",
        "severity": "high",
        "message": "Toxic to dogs"
      }
    ]
  }
}
}

---

## UI States (обязательные)

 (F3__portion_calc.md)

| State          | Триггер                | UI Behavior                               |
| -------------- | ---------------------- | ----------------------------------------- |
| `idle`         | Начальное состояние    | Форма видима, inputs enabled              |
| `loading`      | Submit нажат           | Spinner overlay, button disabled          |
| `success`      | API вернул 200         | Показать результаты (nutrients, portions) |
| `error`        | API вернул 400/500     | Toast с error.messageKey                  |
| `gated`        | API вернул 401/403     | Paywall modal ("Upgrade to Gold")         |
| `limitReached` | Превышен дневной лимит | Limit banner ("Daily limit reached")      |

---

## Gating & Limits

(F3__portion_calc.md)

**Pre-check перед submit:**

text

`GET /api/v1/features/access/F3`

**Response:**

{
{
  "hasAccess": false,
   "reason": "tier_insufficient"
}
}

**Если `hasAccess: false` → не отправлять POST, сразу показать paywall.**

**Tier requirements:**

* `period: meal/day` — доступно для Guest/Standard

* `period: week` — требует Gold/VIP (F3__portion_calc.md)

---

## Ошибки (error handling)

(F3__portion_calc.md)

| HTTP | error.code         | UI state       | Действие                     |
| ---- | ------------------ | -------------- | ---------------------------- |
| 400  | `VALIDATION_ERROR` | `error`        | Toast: "Некорректные данные" |
| 401  | `AUTH_REQUIRED`    | `gated`        | Redirect на `/login`         |
| 403  | `FORBIDDEN`        | `gated`        | Paywall modal                |
| 429  | `LIMIT_EXCEEDED`   | `limitReached` | Limit banner + "Upgrade"     |
| 500  | `INTERNAL_ERROR`   | `error`        | Toast: "Ошибка сервера"      |

---

## i18n ключи

(F3__portion_calc.md)​

**Namespaces:** `common`, `functions`, `portion-calc`

**Примеры ключей:**

portionCalc.title
portionCalc.weight
portionCalc.activityLevel
portionCalc.lifeStage
portionCalc.goal
portionCalc.period
portionCalc.mealsPerDay
portionCalc.calculate
portionCalc.result.calories
portionCalc.result.protein
portionCalc.result.fat
portionCalc.result.carbs

**Fallback:** en

---

## Резюме user flow

Landing → Click F3 
  ↓
Select species (dog/cat)
  ↓
Fill form (weight, activity, life stage, goal)
  ↓
Optional: Select recipe OR manually input foods
  ↓
Submit → Loading
  ↓
API response:
  ├─ Success → Show results (calories, nutrients, portions)
  ├─ Gated → Paywall modal
  ├─ Limit → Upgrade banner
  └─ Error → Toast
