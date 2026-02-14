# Lifetime Member Implementation Checklist (Proxy Flow)

Created: 2026-02-14 19:35

## Current Status: [COMPLETED]

Remaining Time: 10 minutes

---

## 🏗️ 1. Database & Backend (petsafe-validator)

- [x] **Step 1.1**: Create Migration `010_add_lifetime_flag.sql`
  - Tasks: ALTER TABLE adds `is_lifetime` to `landing_f1_entitlements` and `landing_f2_entitlements`.
  - Verification: [x] SQL syntax valid | [x] Applied to DB
- [x] **Step 1.2**: Update `webhook-queue.worker.ts`
  - Tasks: Update DB inserts to include `is_lifetime` logic for `productCode === 'founder'`.
  - Verification: [x] Code updated | [x] Backend Compiles (npm run dev logs)

## 🛡️ 2. Proxy API (fammy-landing)

- [x] **Step 2.1**: Create `/api/payments/founders-checkout/route.ts`
  - Tasks: Implement POST handler, secure with Backend URL + JWT.
  - Verification: [x] Route created | [x] Landing Compiles (npm run dev)

## 🎨 3. UI Integration (fammy-landing)

- [x] **Step 3.1**: Enhance `MiniFounder` component
  - Tasks: Add `EmailModal`, connect button to local Proxy API.
  - Verification: [x] UI updated | [x] Landing Compiles 

## ✅ 4. Final Verification

- [x] **Step 4.1**: E2E check (Mock or Code Review)
  - Verification: [x] Data flow confirmed

---

## 🚨 Stop Protocol Logs

- **Attempt 1**: [FIXED] Compilation error in worker (propped back isUnlimited)
- **Attempt 2**: [N/A]
- **Attempt 3**: [N/A]
  *Action: All fixed within time limit.*
