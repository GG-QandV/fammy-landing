## New architecture for fammy.pet

## Уровень 1: Hero — Intent-Based Entry

```textile
┌─────────────────────────────────────┐
│  Що ви хочете дізнатися?            │
│  ┌───────────────────────────────┐  │
│  │ 🔍 Пошук: "чи можна шоколад"  │  │ ← Universal search
│  └───────────────────────────────┘  │
│                                     │                                        │
│  Популярні запити:                  │
│  [Перевірити продукт] (F2)          │
│  [Розрахувати порції] (F3)          │
│  [Аналіз раціону] (F1)              │
└─────────────────────────────────────┘
```

**Логіка:**

* Search → intelligent routing (NLP визначає F2/F1/F3)

* Quick actions → 3-4 топ функції (metrics-driven)

* Решта функцій в категоріях нижче

## Уровень 2: Function Categories (замість FeatureCards рулона)

┌────────────────────────┐
│ БЕЗПЕКА ХАРЧУВАННЯ                     │
│ ├─ Перевірка продуктів (F2)                │ ← Expandable cards
│ ├─ Токсичні речовини                          │
│ └─ Алергени та непереносимість      │
├────────────────────────┤
│ ХАРЧУВАННЯ ТА ДІЄТА                     │
│ ├─ Калькулятор порцій (F3)                │
│ ├─ Аналіз раціону (F1)                         │
│ ├─ Генератор рецептів (F4)                 │
│ └─ Поживні речовини (F6)                   │
├────────────────────────┤
│ МОНІТОРИНГ ЗДОРОВ'Я                   │
│ ├─ BCS трекер (F5)                               │
│ ├─ Вага та ріст                                      │
│ └─ Медична історія                              │
└────────────────────────┘

**Scaling:**

* 3-5 категорій (фіксовано)

* Функції додаються всередину категорій

* Expandable accordion — показується тільки активна

## Уровень 3: Pet Context — динамічний селектор

**Де з'являється pet selector:**

User clicks "Перевірити продукт" (F2)
    ↓
Modal/Sheet opens:
┌───────────────────────────┐
│ Для кого перевіряємо?                                 │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│ │ 🐕      │ │ 🐈      │ │ 🐦     │ │ 🐹      │     │
│ │Dog     │ │Cat     │ │Bird    │ │Ham.  │     │
│ └────┘ └────┘ └────┘ └────┘     │
│                                                                          │
│ [+ 22 більше видів]                                       │ ← Expandable
└───────────────────────────┘
    ↓
Opens F2 tool with dog context

**26 видів організація:**

Топ-4 (90% трафіку): Dog, Cat, Bird, Hamster — великі кнопки
"Інші види" dropdown:
  Гризуни (4): Rabbit, Guinea Pig, Chinchilla, Rat
  Рептилії (6): Turtle, Lizard, Snake, etc
  Екзотика (12): Ferret, Hedgehog, Parrot, etc

---

## Desktop vs Mobile layout

## Desktop (≥1024px)

┌─────────────────────────────────────────────┐
│ Nav                                                                                                                    │
├──────────────┬──────────────────────────────┤
│ Sidebar                        │ Main Content                                                         │
│ Categories                   │ ┌─────────────────────────┐       │
│ [Безпека]                     │ │ Active Function (F2)                                 │       │
│ [Харчування]              │ │                                                                     │       │
│ [Здоров'я]                   │ │ Pet context: 🐕 [Change]                        │       │
│                                       │ │                                                                     │       │
│                                       │ └─────────────────────────┘       │
└──────────────┴──────────────────────────────┘

## Mobile (<768px)

```text
Hero: Search + 3 quick actions
  ↓ scroll
Category accordion (collapsed)
  ↓ tap function
Bottom sheet modal → pet selector → tool
```

---

## Технический стек изменений

## Удалить из Hero:

* ❌ Species buttons (dog/cat)

* ❌ F1 табы (ThumbsUp/Down)

* ❌ Feature cards рулон

## Добавить:

* ✅ Universal search input (Algolia/Fuse.js)

* ✅ Category accordion component

* ✅ Pet selector modal (26 species)

* ✅ Function router (search → F1-F6)

## Hero новый состав:

<Hero>
  <UniversalSearch onSelect={(intent) => routeToFunction(intent)} />
  <QuickActions functions={['F2', 'F3', 'F1']} />
</Hero>
<CategorySection>
  <Accordion categories={FUNCTION_CATEGORIES} />
</CategorySection>

---

## Метрики успеха

| Метрика                  | Сейчас             | После                     |
| ------------------------ | ------------------ | ------------------------- |
| Clicks до первой функции | 3-4                | 1-2                       |
| Скроллинг для поиска F6  | 80% viewport       | 0 (search)                |
| Время выбора pet         | N/A (всегда видим) | +2 сек, но контекстуально |
| Scalability              | 6 functions max    | Unlimited                 |

**Вывод:** Intent-based + Category hierarchy + Contextual pet selector. Референсы: Shopify, Stripe, Google Analytics.[](https://www.areaten.com/pet-food-seo/)

# Создание тестового лендинга без поломки production

## Вариант 1: Route-based split (рекомендуемый)

**Структура:**

```textile
fammy-landing/
├── app/
│   ├── page.tsx              # Prod лендинг (текущий)
│   └── draft/
│       └── page.tsx          # Новый черновик
├── components/
│   ├── landing/              # Prod компоненты
│   └── landing-draft/        # Новые компоненты
```

**Команды:**

```bash
cd /home/gg/projects/nutrition-data/fammy-landing

#Создать черновик
mkdir -p app/draft
cp app/page.tsx app/draft/page.tsx

#Создать папку для новых компонентов
mkdir -p components/landing-draft
cp -r components/landing/* components/landing-draft/

#Запустить
npm run dev -- -p 3003
```

**Доступ:**

* Production: `http://localhost:3003/`

* Draft: `http://localhost:3003/draft`

**Преимущества:**

* Полная изоляция

* Можно A/B тестировать через query param

* Rollback = удалить папку `draft/`

---

## Вариант 2: Branch-based (для крупных изменений)

**Git workflow:**

```bash
# Создать ветку для экспериментов
git checkout -b landing-redesign-v3
git push -u origin landing-redesign-v3

# Вносить изменения
# Prod остаётся в main

# Деплой обеих версий через Vercel/Coolify:
#- main → fammy.pet
#- landing-redesign-v3 → draft.fammy.pet 
```

**Преимущества:**

* Отдельный URL для теста

* Изменения не мешают prod коммитам

* Легко merge после одобрения

---

## Вариант 3: Feature flag (для мелких изменений)

**Компонент с флагом:**

```tsx
// app/page.tsx
const DRAFT_MODE = process.env.NEXT_PUBLIC_DRAFT === 'true';

export default function Home() {
  return (
    <>
      {DRAFT_MODE ? <HeroV3 /> : <Hero />}
      {DRAFT_MODE ? <CategoryAccordion /> : <FeatureCards />}
    </>
  );
}
```

**Команды:**

```bash
# Production
npm run dev -- -p 3003

# Draft
NEXT_PUBLIC_DRAFT=true npm run dev -- -p 3004
```

**Преимущества:**

* Один файл, два режима

* Удобно для постепенного рефакторинга

---

## Вариант 4: Subdomain через Next.js rewrites (для продакшена)

**next.config.mjs:**

```js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'draft.fammy.pet' }],
        destination: '/draft/:path*',
      },
    ];
  },
};
```

**Доступ:**

* `fammy.pet` → prod

* `draft.fammy.pet` → `/draft` версия

---

## Рекомендация: Вариант 1 + Git branch

**Почему:**

* Простая структура папок​

* Изоляция стилей/компонентов

* Можно показать заказчику без deploy

**План:**

1. Создать `/app/draft/page.tsx`

2. Скопировать компоненты в `/components/landing-draft/`

3. Изменять только в `landing-draft/`

4. Тестировать на `localhost:3003/draft`

5. После одобрения → переместить в `landing/` → удалить `draft/`

**Команда для старта:**

```bash
cd /home/gg/projects/nutrition-data/fammy-landing
mkdir -p app/draft components/landing-draft
cp app/page.tsx app/draft/page.tsx
cp -r components/landing/* components/landing-draft/
git add .
git commit -m "DRAFT: Create landing v3 prototype"
```

**Проверка:**

```bash
​npm run dev -- -p 3003
# Открыть http://localhost:3003/draft
```
