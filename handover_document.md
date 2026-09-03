# StayNorthBengal – End‑to‑End Handover Document

---

## 1. Project Overview
- **Repository:** https://github.com/hhimanish/StayNorthBengal-Final
- **Primary framework:** Next.js 14 (App Router)
- **Additional frontend:** A separate Vite React app under `frontend/` (not included in the Vercel build).
- **Database:** Prisma + SQLite (`prisma/schema.prisma`).
- **Key recent changes** (commit `4a7a3726`):
  - Added `"use client"` directives where needed.
  - Fixed `revalidate` export on `/auth/verify` page.
  - Commented out the `CartItemType` enum to avoid SQLite enum errors.
  - Added `framer-motion` dependency.

---

## 2. Local Development Setup
```bash
# Clone repository (if not already cloned)
git clone https://github.com/hhimanish/StayNorthBengal-Final.git
cd StayNorthBengal-Final

# Install dependencies (Node ≥ 20 recommended)
npm ci   # uses package-lock.json

# Prisma generation (runs automatically on postinstall)
npm run prisma   # or `npx prisma generate`

# Run development server
npm run dev   # http://localhost:3000
```

### Environment Variables
Create a `.env` file at the repository root. Minimum required keys:
```
# Prisma – SQLite file path (default works out‑of‑the‑box)
DATABASE_URL="file:./dev.db"

# NextAuth (example placeholders – replace with real values)
NEXTAUTH_SECRET="<random‑string>"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay (if used)
RAZORPAY_KEY_ID="<your‑key-id>"
RAZORPAY_KEY_SECRET="<your‑key-secret>"
```
Add any other secrets required by your production environment.

---

## 3. Git Workflow
- **Branch model:** `main` is the production branch. All feature work should be done on short‑lived branches and merged via PR.
- **Commit format:** Conventional commits are recommended (`fix:`, `feat:`, `chore:` etc.).
- **Keeping remote in sync:**
  ```bash
  git fetch origin
  git status   # should show "Your branch is up to date with 'origin/main'"
  ```
- **Triggering a Vercel deploy:** Push any commit to `main`. Vercel’s GitHub integration will start a new build automatically.
  - For an explicit trigger without code changes, you can push an empty commit:
    ```bash
    git commit --allow-empty -m "trigger deploy"
    git push origin main
    ```

---

## 4. Building the Project Locally
```bash
npm run build   # runs `next build`
```
The build should finish with:
```
✓ Generating static pages (8/8)
✓ Finalizing page optimization …
```
If you see errors about `revalidate` or Prisma enums, ensure the latest commits (`4a7a3726` onward) are present and that `prisma generate` has run without errors.

---

## 5. Vercel Deployment (Production)
### 5.1. One‑time CLI Setup (optional but handy)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Log in (you’ll receive an email or can paste a token)
vercel login

# Link the project (run from repo root)
vercel link
#   • Choose "hhimanish/StayNorthBengal-Final"
#   • Set production branch to "main"
```
### 5.2. Deploy via CLI
```bash
vercel --prod
```
The CLI prints something like:
```
✅  Deploying… (sha: 4a7a3726)
✨  Production Deployment: https://stay-northbengal.vercel.app
```
- **SHA** displayed is the exact commit Vercel built.
- **URL** is the live production site.

### 5.3. Deploy via GitHub (no CLI needed)
1. Ensure the Vercel project is linked to the GitHub repo (`Settings → Git → Repository`).
2. Set **Production Branch** to `main`.
3. Every push to `main` triggers a new build automatically.
4. The latest deployment can be seen under **Deployments** in the Vercel dashboard. The **Commit** column shows the SHA of the source.

---

## 6. Verifying the Deployment
- Open the production URL (e.g., `https://stay-northbengal.vercel.app`).
- Check the console/network tab for any errors.
- Verify that the pages that previously needed `"use client"` now load correctly (`/auth/login`, `/auth/verify`, `/host/kyc`, `/wallet`).
- Confirm the Vercel build log contains the correct commit SHA (`4a7a3726` or later) and no Prisma schema errors.

---

## 7. Common Issues & Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Build fails with `Invalid revalidate value` | `"use client"` present on a page that exports `revalidate`. | Ensure the file starts with `"use client"` **only** when using React hooks. Remove it for server‑side pages (e.g., `/auth/verify`). |
| Prisma `P1012` enum error | Enum declared for SQLite (which doesn’t support enums). | Comment out the entire enum block or replace with plain string fields (as done in `schema.prisma`). |
| Vercel still builds old commit (`3811266`) | Vercel webhook triggered before the latest push or the CLI is using a cached build. | Push a new commit (even empty) or run `vercel --prod` after logging in. |
| `vercel` command not found | Vercel CLI not installed or not in PATH. | Run `npm i -g vercel` and restart the terminal.

---

## 8. Rolling Back / Re‑Deploying a Specific Commit
```bash
# Find the commit SHA you want to roll back to (e.g., 4a7a3726)
vercel rollback <SHA>
```
Or, from the dashboard, click the three‑dot menu on a deployment and select **Rollback**.

---

## 9. Future Work & Open Items
- **Remove the unused `frontend/` Vite app** from the repo or add it to `.gitignore` if it will never be deployed. This avoids accidental type‑checking during CI.
- **Add CI/CD checks** (GitHub Actions) to run `npm run lint && npm run typecheck && npm run build` on every PR.
- **Configure Vercel Environment Variables** in the dashboard (matching the `.env` used locally) for production secrets.
- **Add monitoring** (e.g., Vercel Analytics, Sentry) if required.

---

## 10. Contact / Ownership
- **Repository Owner:** `hhimanish`
- **Primary maintainer:** (you)
- **Vercel Account:** linked to the same GitHub user; you can manage it at https://vercel.com/dashboard

---

*Document generated on 2026‑09‑03.*
