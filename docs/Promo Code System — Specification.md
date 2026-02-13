Зрозумів. Промокоди — це повноцінна система, не просто "tier → limit". Оформлюю:

---

## Promo Code System — Specification

### Типи промокодів (по цілі)

```
1. SUPPORT_COMPENSATION — компенсація за проблеми (5-15 додаткових запитів)
2. REFERRAL_INVITER    — для того хто привів друга
3. REFERRAL_INVITED    — для того кого привели
4. TESTING             — для тестування (розробники, QA, регіони)
5. MARKETING_PROMO     — акційний маркетинговий
6. MARKETING_UPGRADE   — доступ до функцій вищого рівня підписки
7. DOWNTIME_COMP       — компенсація за даунтайм сервісу
8. RETENTION           — продовження підписки для утримання
```

### Що промокод може давати

```
- extra_checks: +N додаткових запитів (F2, F1 або обох)
- daily_limit_override: перевизначення денного ліміту
- function_access: доступ до конкретних функцій (f1, f2, f3...)
- subscription_extend: продовження підписки на N днів
- subscription_upgrade: тимчасовий доступ до вищого рівня
- discount_percent: знижка на підписку (%)
```

### Обмеження промокоду

```
- duration: час дії після активації (години/дні/тижні/місяці)
- expires_at: абсолютна дата закінчення
- max_uses: максимум активацій (глобально)
- max_per_user: максимум активацій одним юзером
- target_functions: ['f1'], ['f2'], ['f1','f2'], ['all']
- daily_limit: скільки запитів на день (або unlimited)
- total_limit: скільки запитів всього за весь період
```

### Прив'язка промокоду (binding)

```
- none:       публічний, хто завгодно
- account:    конкретний user_id
- email:      конкретний email
- session:    anon_id / cookie
- ip:         конкретний IP
- referrer:   перехід з конкретного URL/ресурсу
- region:     по гео (країна/місто)
```

### Поточний стан БД

```
app.promo_codes:
  id, code, tier, duration_months, expires_at, max_uses, used_count, is_active

app.promo_redemptions:
  id, promo_code_id, user_id, redeemed_at
  FK: user_id → app.users (проблема для лендінгу — немає user)
```

### Що потрібно для повної реалізації

```
1. Міграція БД:
   - Розширити promo_codes: +type, +benefit_json, +binding_type, +binding_value,
     +target_functions, +daily_limit, +total_limit, +duration_hours
   - Розширити promo_redemptions: +anon_id (nullable), зробити user_id nullable

2. Бекенд плагін генерації промокодів:
   - CRUD API для адмінки
   - Генератор кодів (формат, унікальність)
   - Валідація з усіма обмеженнями

3. Лендінг API route:
   - Валідація коду
   - Створення redemption (з anon_id замість user_id)
   - JWT токен з benefit параметрами

4. Лендінг фронт:
   - F2/F1 передача promo token
   - UI відображення активного промо
```

### Що робимо ЗАРАЗ (MVP для лендінгу)

```
Мінімальний flow:
- Промокод дає +N додаткових F2 перевірок на 24 години
- Прив'язка до anon_id (cookie)
- Валідація: is_active, not expired, not max_uses
- JWT токен з { userId, limit, promoId }
- F2 check route вже читає x-promo-token ✅
```

---

1. Промокод може бути від 24h до місяця (duration_months в БД)
2. Без прив'язки — фіксуємо хто використав (anon_id)
3. Валідація: active + not expired + not max_uses
