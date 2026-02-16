# Landing V3 — Контекст разработки

## Текущая фаза: Phase 6 (HeroV3 + DesktopLayout + Сборка)
## Что сделано: Phase 0-5 ✅ (ветка, configs, i18n, routes, SEO, PetSelector, ComingSoon, ToolSheet, F2 Wizard, F1 Wizard, CategoryAccordion, DraftPage assembly)
## Следующий шаг: HeroV3 (заголовок + промокод), DesktopLayout (два стовпці ≥1024px), полноценные F1/F2 страницы

## Принятые решения
- Без Universal Search (не нужен на этом этапе)
- Accordion на странице + Sheet-overlay для инструментов
- Отдельные страницы для каждого инструмента (SEO)
- Пошаговый Wizard (ленивая загрузка) внутри Sheet
- Двухколоночный десктоп-макет (≥1024px)
- Нижние секции (Support, Waitlist, Founder) — без изменений
- 26 видов животных (неподдерживаемые → бейдж «Скоро»)
- Git branch изоляция, деплоится только main

## Известные проблемы
- Бэкенд поддерживает только dog/cat/human (расширение через 1-2 нед.)
- F3-F6 не реализованы → заглушки ComingSoon
- i18n: species_dog/cat/human уже существовали — в v3 блоке не дублировать

## Последний MCP checkpoint: 2026-02-16 Phase 5 complete
