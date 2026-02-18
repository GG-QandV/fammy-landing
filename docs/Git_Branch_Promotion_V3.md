# Git Branch Promotion & V3 Cut-off — Technical Documentation

> Date: 2026-02-18  
> Project: fammy-landing  
> Source Branch: `landing-v3`  
> Target Branch: `main`  
> Legacy Branch: `main-legacy`

---

## 1. Overview

On 2026-02-18, the project underwent a major architectural "cut-off". The version developed in the `landing-v3` branch was promoted to the primary `main` branch, replacing the legacy V2 architecture. The previous `main` branch was preserved as `main-legacy` for archival and reference purposes.

## 2. Rationale

The `landing-v3` branch introduced a completely new directory structure and architecture (Phase 7: Bayan layout, ToolSheets, standardized API responses). Merging V3 into V2 via standard `git merge` would have resulted in significant conflicts and a messy history. A clean "branch swap" (promotion) was chosen to ensure the new `main` branch reflects the intended V3 state exactly.

## 3. The Promotion Process (Step-by-Step)

The following sequence of operations was performed on the local developer environment and pushed to the remote repository.

### Step 1: Preservation of V2
The local `main` branch (V2) was renamed to `main-legacy`.
```bash
git checkout main
git branch -m main main-legacy
```

### Step 2: Promotion of V3
The local `landing-v3` branch was renamed to `main`.
```bash
git checkout landing-v3
git branch -m landing-v3 main
```

### Step 3: Remote Update (Force Push)
Since the history of the new `main` (V3) diverged from the old `main` (V2), a force push was required to update the remote repository.
```bash
git push origin main --force
```

### Step 4: Archiving Legacy
The `main-legacy` branch was pushed to the remote to ensure the V2 state is preserved.
```bash
git push origin main-legacy
```

### Step 5: Final Homepage Cut-off
While the code was swapped, the V3 design was originally located at `/draft` (`app/draft/page.tsx`). To complete the launch, the root page was replaced.
```bash
cp app/draft/page.tsx app/page.tsx
# Component name 'DraftPage' was renamed to 'Home' inside app/page.tsx
git add app/page.tsx
git commit -m "feat(v3): launch V3 design on main page"
git push origin main
```

---

## 4. Current State (Post-Promotion)

### Branch Structure
- **`main`**: Current production branch. Contains V3 architecture. Triggers auto-deployment to `fammy.pet` via Coolify.
- **`main-legacy`**: Archive branch. Contains the old V2 architecture. Use this if any legacy components or logic need to be retrieved.
- **`landing-v3`**: Deprecated (can be deleted). Its state is now identical to the starting state of the new `main`.

### Key Architectural Changes
- **Directory Structure**: Shift towards `components/landing-v3/` for modern components.
- **Route Logic**: `/` (homepage) now uses the "Bayan" layout (Category Accordion + PromoBlock).
- **API Standards**: `/api/f1/analyze` and `/api/f2/check` now return usage counts (`remainingToday`, `dailyLimit`).
- **Usage Limits**: Persistent usage counter implemented via `GET /api/usage` and `useUsageCount` hook, integrated into all V3 screens.

## 5. Deployment Information (Coolify)

The promotion to `main` triggered an automatic build in Coolify.
- **Webhook**: Git Push to `main`.
- **Build Command**: Standard Next.js build.
- **Production URL**: `https://fammy.pet`

---

## 6. Guidance for Agents & Developers

1. **Always work on `main`**: All new features and fixes should now branch off the new `main`.
2. **Consult `main-legacy` only for reference**: Do not attempt to merge `main-legacy` back into `main`. It is a snapshot of the past.
3. **Use the V3 Component System**: Follow the patterns established in `components/landing-v3/` (Sheet-based modals, specialized step components).
