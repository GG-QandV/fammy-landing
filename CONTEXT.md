# Landing V3 — Контекст разработки

## Текущая фаза: Phase 5 (DraftPage assembly)
## Что сделано: Phase 0 (ветка, CONTEXT.md), Phase 1 (species-config, functions-config, i18n), Phase 2 (draft route, страницы инструментов, SEO metadata), Phase 3 (PetSelector, ComingSoon), Phase 4 (ToolSheet, F2 Wizard)
## Следующий шаг: Собрать DraftPage — Accordion с категориями, каждый инструмент открывает ToolSheet/ComingSoon

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

## Последний MCP checkpoint: 2026-02-16 Phase 4 complete
