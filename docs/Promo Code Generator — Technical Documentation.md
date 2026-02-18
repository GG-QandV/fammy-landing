# Promo Code Generator — Technical Documentation

1. ## Architecture Overview

┌──────────────────────────────────────────────────────┐

│ ADMIN DASHBOARD                                                             │  
│ /admin/promo-generator.html (static)                             │  
│ Login → JWT → API calls │  
└──────────────────────┬───────────────────────────────┘

│  
▼  
┌──────────────────────────────────────────────────────┐ 
│ FASTIFY BACKEND │  
│ │  
│ Admin API (JWT + role=admin required): │  
│ /api/v1/admin/promo-generator/* │  
│ │  
│ User Redeem (JWT required): │  
│ POST /api/v1/billing/promo/redeem │  
│ │  
│ Landing Validate (NO auth, anonId based): │  
│ POST /api/v1/billing/promo/validate │  
└──────────────────────┬───────────────────────────────┘  
│  
▼  
┌──────────────────────────────────────────────────────┐ 
│ SUPABASE (PostgreSQL) │  
│ │  
│ app.promo_codes — promo definitions │  
│ app.promo_code_features — per-feature limits │  
│ app.promo_redemptions — registered user redemptions │  
│ app.promo_usage_meta — IP/user-agent on redeem │  
│ app.promo_admin_log — admin actions audit │  
│ app.landing_promo_redemptions — anonymous landing users │  
│ app.feature_access — actual access grants │  
└─────────────────────────────────────────────────────┘

## 2. Files

### Backend (petsafe-validator)

| File                                          | Purpose                                    |
| --------------------------------------------- | ------------------------------------------ |
| `src/modules/admin/promo-generator.routes.ts` | Admin CRUD API for promo codes             |
| `src/modules/billing/promo-redeem.routes.ts`  | Registered user promo redemption           |
| `src/modules/billing/promo-landing.routes.ts` | Landing (anonymous) promo validation       |
| `src/public/promo-generator.html`             | Admin dashboard (static HTML + vanilla JS) |
| `src/app.ts`                                  | Route registration + @fastify/static       |
| `migrations/008_promo_generator.sql`          | DB migration                               |

### Landing (fammy-landing)

| File                                    | Purpose                                   |
| --------------------------------------- | ----------------------------------------- |
| `app/api/promo/validate/route.ts`       | Proxy to backend (both main & landing-v3) |
| `components/landing/hero.tsx`           | Promo UI in main branch                   |
| `components/landing-v3/promo-block.tsx` | Promo UI in landing-v3 branch             |
| `lib/i18n.ts`                           | Translations (en, ua, es, fr)             |

---

## 3. API Endpoints

### 3.1 Admin — Promo Generator

**All require**: `Authorization: Bearer <JWT>` with `role=admin`

#### GET /api/v1/admin/promo-generator/features

Returns feature codes for checkboxes in dashboard.

```jason
// Response
{
  "success": true,
  "data": [
    { "code": "diet_validator", "title": "Diet Validator", "groupName": "F1", "isActive": true },
    { "code": "reserved_f7", "title": "Reserved Function 7", "groupName": "F7", "isActive": false }
  ]
}
```

**Source**: reference.feature_codes WHERE domain = 'functions'  
**Sort**: by numeric group (F1, F2, ... F10)

#### POST /api/v1/admin/promo-generator/generate

Creates a new promo code with per-feature limits.

```json
// Request
{
  "durationHours": 720,          // 24 to 26280 (3 years)
  "features": [
    { "code": "diet_validator", "usageLimit": 100, "dailyLimit": 10 },
    { "code": "human_foods_checker", "usageLimit": null, "dailyLimit": 30 }
  ],
  "promoType": "public",          // "public" | "personal"
  "maxUses": 10,                   // 1 to 10000 (copies)
  "boundEmail": null,              // required if promoType=personal
  "description": "Beta batch #1",
  "customCode": "APRIL2026X"       // optional, auto-generated if null
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "APRIL2026X",
    "tier": "promo",
    "durationHours": 720,
    "expiresAt": "2026-03-19T22:24:41.258Z",
    "maxUses": 10,
    "usedCount": 0,
    "isActive": true,
    "promoType": "public",
    "createdBy": "admin-uuid"
  }
}
```

**Writes to**: app.promo_codes + app.promo_code_features  
**Logs to**: app.promo_admin_log (action: 'generate')

#### GET /api/v1/admin/promo-generator/list?active=true|false

Returns all promo codes with features.

```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "code": "APRIL2026X",
    "features": [
      { "featureCode": "diet_validator", "usageLimit": 100, "dailyLimit": 10 }
    ],
    "createdByEmail": "admin@fammy.pet",
    ...
  }]
}
```

#### GET /api/v1/admin/promo-generator/search?code=APRIL2026X

Search single promo by code. Returns promo + features + redemption count.

#### PATCH /api/v1/admin/promo-generator/:id

Update promo code.

```json
// Block
{ "isActive": false }
// Reset usage counter
{ "resetCount": true }
// Activate
{ "isActive": true }
```

**Logs to**: app.promo_admin_log

#### DELETE /api/v1/admin/promo-generator/:id

Permanently deletes promo code (CASCADE deletes features).  
**Logs to**: app.promo_admin_log

#### GET /api/v1/admin/promo-generator/log

Returns last 50 admin actions.

```json
{
  "data": [{
    "action": "generate",
    "adminEmail": "admin@fammy.pet",
    "details": { "code": "APRIL2026X", ... },
    "ipAddress": "127.0.0.1",
    "createdAt": "2026-02-17T22:35:40.407Z"
  }]
}
```

---

### 3.2 User Redeem (Registered Users)

#### POST /api/v1/billing/promo/redeem

**Requires**: Authorization: Bearer <JWT> (any authenticated user)

```json
// Request
{ "code": "APRIL2026X" }

// Success Response
{
  "success": true,
  "data": {
    "code": "APRIL2026X",
    "features": ["diet_validator", "human_foods_checker"],
    "validUntil": "2026-03-19T22:41:18.400Z",
    "message": "Promo activated! Access granted to 2 features until 19.03.2026"
  }
}

// Error Responses
{ "error": { "code": "PROMO_INVALID" } }      // not found
{ "error": { "code": "PROMO_INACTIVE" } }     // blocked
{ "error": { "code": "PROMO_EXPIRED" } }      // past expires_at
{ "error": { "code": "PROMO_LIMIT" } }        // max_uses reached
{ "error": { "code": "PROMO_NOT_FOR_YOU" } }  // personal, wrong email
{ "error": { "code": "PROMO_ALREADY_USED" } } // user already redeemed
{ "error": { "code": "PROMO_NO_FEATURES" } }  // old promo, no features configured
```

**Writes to**:

* app.feature_access (ON CONFLICT: GREATEST for limits and valid_until)
* app.promo_redemptions
* app.promo_usage_meta (IP, user-agent)
* app.promo_codes (used_count++)

**Conflict resolution** (multiple promos same feature):

* usage_limit: takes GREATEST (or NULL if either is unlimited)
* valid_until: takes GREATEST (longest expiry wins)
* usage_count: preserved (not reset)

#### GET /api/v1/billing/promo/status

**Requires**: JWT auth  
Returns all active promo feature_access for current user.

---

### 3.3 Landing Validate (Anonymous Users)

#### POST /api/v1/billing/promo/validate

**NO auth required** — used by landing page proxy.

```json
// Request
{
  "code": "APRIL2026X",
  "anonId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com"    // optional, for personal promos
}

// Success Response
{
  "success": true,
  "token": "eyJ...",             // JWT with features embedded
  "tier": "promo",
  "features": [
    { "code": "diet_validator", "usageLimit": null, "dailyLimit": 100 },
    { "code": "human_foods_checker", "usageLimit": null, "dailyLimit": 30 }
  ]
}

// Error responses
{ "success": false, "error": "invalid" }
{ "success": false, "error": "expired" }
```

**JWT payload**:

```json
{
  "userId": "anon-uuid",
  "promoId": "promo-uuid",
  "tier": "promo",
  "features": [{ "code": "...", "usageLimit": ..., "dailyLimit": ... }]
}
```

**Writes to**:

* app.landing_promo_redemptions (ON CONFLICT: update)
* app.promo_codes (used_count++)

**Re-issue**: if anon already redeemed and still active, re-issues token without incrementing used_count.

**Fallback**: old promos without promo_code_features get default features (F1, F2, F3) with tierToLimit() daily limits.

---

### 3.4 Landing Proxy

#### POST /api/promo/validate (Next.js API route)

**File**: fammy-landing/app/api/promo/validate/route.ts

Proxies to backend:

text

```text
Browser → POST /api/promo/validate {code}
  → Next.js extracts anonId from cookie
  → POST ${BACKEND_BASE_URL}/api/v1/billing/promo/validate {code, anonId, email}
  → Returns backend response to browser
```

**ENV**: BACKEND_BASE_URL (default: https://api.fammy.pet)

---

## 4. Database Schema

### app.promo_codes

```sql
id              uuid PK DEFAULT gen_random_uuid()
code            varchar(50) UNIQUE NOT NULL      -- promo code string
tier            varchar(20) NOT NULL              -- always 'promo' for generated
duration_months smallint NOT NULL                 -- legacy, auto-calculated
duration_hours  integer                           -- actual duration
expires_at      timestamptz                       -- calculated on creation
max_uses        integer                           -- NULL = unlimited
used_count      integer DEFAULT 0
is_active       boolean DEFAULT true
promo_type      varchar(20) NOT NULL DEFAULT 'public'  -- 'public' | 'personal'
daily_limit     integer NOT NULL DEFAULT 10       -- legacy, used by old landing code
bound_email     text                              -- for personal promos
description     text
created_by      uuid FK → app.users(id)
created_at      timestamptz DEFAULT now()
```

### app.promo_code_features

sql

```sql
id              uuid PK
promo_code_id   uuid FK → promo_codes(id) ON DELETE CASCADE
feature_code    varchar(50)                       -- e.g. 'diet_validator'
usage_limit     integer                           -- total uses (NULL = unlimited)
daily_limit     integer                           -- per day (NULL = unlimited)
UNIQUE(promo_code_id, feature_code)
```

### app.promo_redemptions (registered users)

sql

```sql
id              uuid PK
promo_code_id   uuid FK → promo_codes(id)
user_id         uuid FK → users(id)
redeemed_at     timestamptz DEFAULT now()
UNIQUE(promo_code_id, user_id)
```

### app.promo_usage_meta

sql

```sql
id              uuid PK
redemption_id   uuid FK → promo_redemptions(id) ON DELETE CASCADE
ip_address      inet
user_agent      text
country_code    varchar(5)
city            varchar(100)
raw_headers     jsonb
```

### app.promo_admin_log

sql

```sql
id              uuid PK
admin_user_id   uuid FK → users(id)
action          varchar(50)     -- 'login','generate','block','reset','delete'
promo_code_id   uuid FK → promo_codes(id) ON DELETE SET NULL
details         jsonb
ip_address      inet
created_at      timestamptz DEFAULT now()
```

### app.landing_promo_redemptions (anonymous users)

sql

```sql
id              uuid PK
promo_code_id   uuid FK → promo_codes(id)
anon_id         uuid NOT NULL
ip_address      varchar(45)
redeemed_at     timestamptz DEFAULT now()
expires_at      timestamptz NOT NULL
daily_limit     integer NOT NULL DEFAULT 10
is_active       boolean DEFAULT true
UNIQUE(promo_code_id, anon_id)
```

### app.feature_access (actual access grants)

sql

```sql
id              uuid PK
user_id         uuid FK → users(id)
feature_code    varchar(50)
access_type     varchar(20)     -- 'promo' | 'subscription' | 'gift' | 'trial' | 'compensation'
usage_limit     integer         -- NULL = unlimited
usage_count     integer DEFAULT 0
valid_from      timestamptz DEFAULT now()
valid_until     timestamptz
is_active       boolean DEFAULT true
granted_reason  varchar(100)    -- e.g. 'promo:APRIL2026X'
UNIQUE(user_id, feature_code)
```

---

## 5. Default Settings & Where to Change

| Setting                                                       | Default                               | Location                                          | Notes                                               |
| ------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Duration range                                                | 24h — 26280h (3 years)                | promo-generator.routes.ts line ~30                | Validation in generate endpoint                     |
| Max uses range                                                | 1 — 10000                             | promo-generator.routes.ts line ~34                | Validation in generate endpoint                     |
| Auto-generated code length                                    | 10 chars                              | promo-generator.routes.ts function generateCode() | A-Z, 2-9 (no confusing chars)                       |
| Code charset                                                  | ABCDEFGHJKLMNPQRSTUVWXYZ23456789      | promo-generator.routes.ts                         | No 0/O/1/I/L confusion                              |
| Dashboard session timeout                                     | 2 hours                               | promo-generator.html sessionTimer                 | Client-side only                                    |
| JWT token expiry (auth)                                       | 7 days                                | src/modules/auth/service.ts                       | Shared with all users                               |
| Rate limit                                                    | 4 attempts / 15 min per IP            | promo-generator.routes.ts                         | In-memory Map, resets on restart                    |
| Rate limit cleanup interval                                   | 30 min                                | promo-generator.routes.ts                         | setInterval                                         |
| Admin log limit                                               | 50 entries                            | promo-generator.routes.ts GET /log                | LIMIT 50                                            |
| Promo list limit                                              | 100 entries                           | promo-generator.routes.ts GET /list               | LIMIT 100                                           |
| Fallback daily limit (landing)                                | tierToLimit()                         | promo-landing.routes.ts                           | For old promos without features                     |
| Tier limits: guest=3, basic=10, standard=20, gold=50, vip=100 | promo-landing.routes.ts tierToLimit() | Hardcoded fallback                                |                                                     |
| promo_codes.daily_limit                                       | 999                                   | Generated promos                                  | Legacy field, landing uses promo_code_features      |
| promo_codes.tier                                              | 'promo'                               | Generated promos                                  | Always 'promo' for generated codes                  |
| ON CONFLICT strategy                                          | GREATEST                              | promo-redeem.routes.ts                            | Multiple promos: longest expiry, highest limit wins |

---

## 6. Access & Permissions

| Role       | Dashboard | Generate | Manage | Redeem (API) | Landing |
| ---------- | --------- | -------- | ------ | ------------ | ------- |
| admin      | ✅         | ✅        | ✅      | ✅            | ✅       |
| user       | ❌         | ❌        | ❌      | ✅            | ✅       |
| guest/anon | ❌         | ❌        | ❌      | ❌            | ✅       |

**Admin creation**: SQL only (security decision)

sql

```sql
-- Generate hash
node -e "require('bcrypt').hash('PASSWORD',12).then(h=>{require('fs').writeFileSync('/tmp/hash.txt',h);console.log(h)})"
-- Insert (use SQL file to avoid bash escaping)
INSERT INTO app.users (email, password_hash, display_name, role, status, preferred_lang)
VALUES ('email@fammy.pet', '<hash>', 'Name', 'admin', 'active', 'en');
```

**Current admin**: personal.admin@fammy.pet

---

## 7. Flow Diagrams

### Admin generates promo

text

```text
Dashboard → POST /api/v1/admin/promo-generator/generate
  → validates (duration, features, maxUses)
  → checks duplicate customCode
  → INSERT app.promo_codes
  → INSERT app.promo_code_features (per feature)
  → INSERT app.promo_admin_log
  → returns promo data
```

### Registered user redeems

text

```text
App → POST /api/v1/billing/promo/redeem {code}
  → auth middleware (JWT)
  → find promo_codes
  → validate (active, not expired, max_uses, personal check)
  → check promo_redemptions (already used?)
  → get promo_code_features
  → UPSERT app.feature_access (GREATEST strategy)
  → INSERT promo_redemptions
  → INSERT promo_usage_meta (IP, user-agent)
  → UPDATE promo_codes.used_count++
  → return {features, validUntil}
```

### Landing user validates

text

```text
Browser → POST /api/promo/validate {code}
  → Next.js proxy extracts anonId from cookie
  → POST backend /api/v1/billing/promo/validate {code, anonId}
    → find promo_codes
    → validate (active, not expired, max_uses, personal)
    → check landing_promo_redemptions (re-issue if active)
    → get promo_code_features (or fallback)
    → UPSERT landing_promo_redemptions
    → UPDATE promo_codes.used_count++
    → sign JWT with features
    → return {token, features, tier}
  → Browser stores token in cookie + localStorage
  → Browser shows success modal with features/limits/expiry
```

### AccessService checks access

text

```text
Any API call with feature check:
  → AccessService.hasAccess(userId, featureCode)
    → 1. Check app.feature_access (explicit grants including promo)
    →    if found & active & not expired → ALLOW
    → 2. Check app.subscriptions → tier
    →    if tier sufficient → ALLOW
    → 3. DENY
```

---

## 8. Feature Codes Reference

| Code                | Group | Title                | Status        |
| ------------------- | ----- | -------------------- | ------------- |
| diet_validator      | F1    | Diet Validator       | ✅ Active      |
| human_foods_checker | F2    | Human Foods Checker  | ✅ Active      |
| portion_calculator  | F3    | Portion Calculator   | ✅ Active      |
| recipe_generator    | F4    | Recipe Generator     | ✅ Active      |
| bcs_tracker         | F5    | BCS Tracker          | ✅ Active      |
| nutrient_advice     | F6    | Nutrient Advice      | ✅ Active      |
| reserved_f7         | F7    | Reserved Function 7  | ⏳ Placeholder |
| reserved_f8         | F8    | Reserved Function 8  | ⏳ Placeholder |
| reserved_f9         | F9    | Reserved Function 9  | ⏳ Placeholder |
| reserved_f10        | F10   | Reserved Function 10 | ⏳ Placeholder |

---

## 9. i18n Keys (promo modal)

| Key                    | en                      | ua                               | es                     | fr                      |
| ---------------------- | ----------------------- | -------------------------------- | ---------------------- | ----------------------- |
| promo_congrats         | Congratulations!        | Вітаємо!                         | ¡Felicitaciones!       | Felicitations !         |
| promo_features_granted | Access granted to:      | Доступ надано до:                | Acceso concedido a:    | Acces accorde a :       |
| promo_total            | total                   | всього                           | total                  | total                   |
| promo_per_day          | day                     | день                             | dia                    | jour                    |
| promo_unlimited        | unlimited               | необмежено                       | ilimitado              | illimite                |
| promo_valid_until      | Valid until             | Дійсний до                       | Valido hasta           | Valide jusquau          |
| promo_got_it           | Got it!                 | Зрозуміло!                       | ¡Entendido!            | Compris !               |
| promo_expired          | Promo code has expired. | Термін дії промокоду закінчився. | El codigo ha expirado. | Le code promo a expire. |

---

## 10. Security

| Measure          | Details                                      |
| ---------------- | -------------------------------------------- |
| Admin auth       | JWT + role=admin check                       |
| Password storage | bcrypt cost 12                               |
| Rate limit       | 4 login attempts / 15 min per IP (in-memory) |
| Session timeout  | 2 hours (client-side)                        |
| Admin creation   | SQL only, no API endpoint                    |
| HTTPS            | Via Cloudflare + Traefik                     |
| Recommended      | Cloudflare Access on /admin/* (email OTP)    |


