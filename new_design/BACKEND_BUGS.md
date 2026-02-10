# BACKEND BUGS LOG

## [2026-02-09]

- **Bug #1**: `api/f2/check` и `lib/supabaseAdmin.ts` вызывают ошибку при сборке (next build).
  - **Симптомы**: `Error: Failed to collect page data for /api/f2/check`.
  - **Причина**: Вероятно, попытка доступа к переменным окружения (SUPABASE_SERVICE_ROLE_KEY) в момент статической генерации или отсутствие `dynamic = 'force-dynamic'`.
  - **Статус**: Зафиксировано. Блокирует чистую сборку без обходных путей.
