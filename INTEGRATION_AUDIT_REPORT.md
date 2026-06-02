# INTEGRATION AUDIT REPORT
**Project:** application-dashboard (Next.js 14)  
**Date:** May 29, 2026  
**Scope:** Full-stack integration audit post dependency cleanup  

---

## Critical Broken Integrations

### CRIT-01: Frontend→Backend Route Path Mismatch — Orders (Severity: 🔴 CRITICAL)
- **Frontend service:** `src/lib/http/OrderServices.ts` calls `/order` (singular)
- **Backend mount:** `app.js` line 200 → `app.use('/api/orders', ...)` (plural)
- **Resolved URL:** `http://localhost:3500/api/order` → 404 Not Found
- **Impact:** Every order CRUD operation fails silently — create, list, update, delete, status, tracking, refund
- **Affected components:** `src/components/pages/dashboard/order/table.tsx`, order detail pages
- **Fix:** Change every `/order` occurrence in `OrderServices.ts` to `/orders`

### CRIT-02: Frontend→Backend Route Path Mismatch — Permissions (Severity: 🔴 CRITICAL)
- **Frontend service:** `src/lib/http/permissionServices.ts` calls `/permission` (singular)
- **Backend mount:** `app.js` line 199 → `app.use('/api/permissions', ...)` (plural)
- **Resolved URL:** `http://localhost:3500/api/permission` → 404 Not Found
- **Impact:** All permission CRUD, bulk ops, search, grouped queries return 404
- **Affected components:** `src/components/pages/dashboard/users/permission/`, `src/app/dashboard/users/permissions/page.tsx`
- **Fix:** Change every `/permission` occurrence in `permissionServices.ts` to `/permissions`

### CRIT-03: Product Form API Calls Commented Out (Severity: 🔴 CRITICAL)
- **File:** `src/components/pages/dashboard/product/form.tsx` lines 680-720
- **Issue:** The `onSubmit` handler only does `console.log(JSON.stringify(data))` — all actual `productService.create()` and `productService.update()` calls are commented out
- **Impact:** Product create and product edit pages are non-functional; form validates and submits but nothing persists
- **Fix:** Uncomment and restore the `productService` calls in the submit handler

### CRIT-04: No 401 Auto-Refresh Interceptor (Severity: 🔴 CRITICAL)
- **File:** `src/lib/http/index.ts`
- **Issue:** The `fetchData()` wrapper has no response interceptor for 401 status codes. When the JWT expires (1h lifetime), every API call silently fails instead of triggering `refreshAccessToken()` and retrying
- **Impact:** After 1 hour of activity, users get silently logged out on next API call instead of seamless token refresh
- **Fix:** Add a 401 response interceptor that calls `authService.refreshToken()`, updates the session via `/api/auth/session_as`, and retries the original request

---

## API Issues

### API-01: Endpoint Typo — `account-settng` (Severity: 🟡 MEDIUM)
- **Frontend:** `src/lib/http/authService.ts` line 220 → `GET /auth/account-settng`
- **Backend:** `src/routes/authRoute.js` line 111 → `GET /auth/account-settng`
- **Issue:** Both sides have the same typo (`settng` missing `i`), so it works but is a maintenance hazard
- **Fix:** Rename to `/auth/account-setting` on both sides simultaneously

### API-02: Settings Service Filename Typo (Severity: 🟡 LOW)
- **File:** `src/lib/http/settngsServices.ts` — `settngs` instead of `settings`
- **Impact:** Functional but confusing; every import spells it wrong
- **Fix:** Rename file to `settingsServices.ts` and update all import paths

### API-03: Inquiry Service Filename Typo (Severity: 🟡 LOW)
- **File:** `src/lib/http/inqueryService.ts` — `inquery` instead of `inquiry`
- **Impact:** Functional; import alias is correct (`inquiryService`)
- **Fix:** Rename file to `inquiryService.ts`

### API-04: In-Memory OTP Rate Limiting (Severity: 🟠 HIGH)
- **File:** `src/app/api/resend-otp/route.ts`
- **Issue:** Rate limit store uses `new Map()` — resets on every server restart or deployment; useless in multi-instance/serverless deployments
- **Impact:** Rate limiting provides no protection in production (Vercel, etc.)
- **Fix:** Move rate limit tracking to Redis or database

### API-05: Two Unimplemented API Methods (Severity: 🟡 MEDIUM)
- **File:** `src/lib/api.ts`
- `request2FADisable()` → returns `{ success: false, error: 'Not implemented' }`
- `updateDeviceTrust()` → returns `{ success: false, error: 'Not implemented' }`
- **Impact:** If security settings UI triggers these, user sees silent failure
- **Fix:** Implement against backend endpoints or remove from UI

### API-06: Duplicate Data-Fetching Libraries (Severity: 🟡 MEDIUM)
- **SWR:** Used by `useDashboardData` hooks, `useApiSWR` in multiple components
- **React Query:** Used by `useApiQuery` in data-table, `QueryClientProvider` mounted in providers
- **Impact:** Two separate caches, two dedup strategies, inconsistent invalidation
- **Fix:** Standardize on one (SWR or React Query) and remove the other

### API-07: Frontend Roles Path Uses `/roles` But Backend Route Has Inconsistent Internal Prefix (Severity: 🟢 OK)
- **Frontend:** `roleServices.ts` → `/roles`
- **Backend:** `app.use('/api/roles', roleRoute)` ✅ matches
- **Status:** No mismatch — verified working

---

## Hook Wiring Issues

### HOOK-01: 5 Dashboard Hooks Return Stub Data (Severity: 🟠 HIGH)
- **File:** `src/hooks/useDashboardData.ts`
- `useConversionFunnel()` — "Conversion funnel requires analytics tracking"
- `useTopCountries()` — "Geographic data requires address aggregation"
- `useHourlyTraffic()` — "Hourly traffic requires analytics tracking"
- `useAgeGroups()` — "Age group data requires user demographics"
- `useDeviceTypes()` — "Device type data requires session analytics"
- **Impact:** Dashboard widgets that consume these hooks render empty/zero charts
- **Fix:** Either implement backend analytics endpoints or remove the widgets from the dashboard

### HOOK-02: Duplicate SWR + React Query Usage (Severity: 🟡 MEDIUM)
- `useDashboardData.ts` uses SWR (`useSWR`)
- `src/hooks/useApiQuery.ts` uses React Query (`useQuery`)
- Both `SWRConfig` and `QueryClientProvider` are mounted in `providers.tsx`
- **Impact:** Cache fragmentation, double memory usage, inconsistent stale-while-revalidate behavior
- **Fix:** Pick one library, migrate all hooks

### HOOK-03: Hook with Typo — Never Used (Severity: 🟢 LOW)
- **File:** `src/hooks/use-user-settings.ts`
- `useProflileSecurity()` — typo in name (`Proflile`)
- Zero imports anywhere in codebase
- **Fix:** Delete the function

### HOOK-04: `useSecurityLogs()` Missing Loading State in Return (Severity: 🟡 MEDIUM)
- **File:** `src/hooks/use-user-settings.ts`
- Hook sets `loading` internally but doesn't include it in the return object
- **Impact:** Consumers can't show a loading spinner for security logs

---

## Form Submission Issues

### FORM-01: Product Create/Edit Form — No API Call (Severity: 🔴 CRITICAL)
- **File:** `src/components/pages/dashboard/product/form.tsx`
- The `onSubmit` handler only logs data to console; `productService.create()` / `productService.update()` are commented out
- **Impact:** Products cannot be created or edited from the dashboard

### FORM-02: Brand Form — Dual Import / Case Mismatch (Severity: 🟠 HIGH)
- **File:** `src/components/pages/dashboard/product/brand/form.tsx`
- Imports both `BrandServices` (capitalized, does not exist) and `brandService` (correct)
- Lines 168, 180 call `BrandServices.create()` → runtime crash on create
- **Fix:** Remove `BrandServices` import, use `brandService` consistently

### FORM-03: User Form — Dual Import / Case Mismatch (Severity: 🟠 HIGH)
- **File:** `src/components/pages/dashboard/users/form.tsx`
- Imports both `UserServices` (capitalized) and `userServices` (correct)
- Line 198 calls `UserServices.create()` → runtime crash on user create
- **Fix:** Remove `UserServices` import, use `userServices` consistently

### FORM-04: Category Form — No Reset on Close (Severity: 🟡 MEDIUM)
- **File:** `src/components/pages/dashboard/product/categories/form.tsx`
- When the form modal closes without submitting, form fields retain stale values
- **Fix:** Call `form.reset()` in the modal's `onClose` callback

---

## Dashboard Table Wiring Issues

### TABLE-01: Orders Table → 404 API Route (Severity: 🔴 CRITICAL)
- **File:** `src/components/pages/dashboard/order/table.tsx`
- Calls `orderServices.getOrders()` which hits `/order` → backend is at `/orders`
- **Impact:** Orders table shows empty / loading forever
- **Fix:** Fix `OrderServices.ts` path (see CRIT-01)

### TABLE-02: Permissions Table → 404 API Route (Severity: 🔴 CRITICAL)
- **File:** `src/components/pages/dashboard/users/permission/tableClient.tsx`
- Calls `permissionServices.getAll()` which hits `/permission` → backend is at `/permissions`
- **Impact:** Permissions table shows empty / loading forever
- **Fix:** Fix `permissionServices.ts` path (see CRIT-02)

### TABLE-03: Product Table Column — Category Accessor (Severity: 🟡 MEDIUM)
- **File:** `src/components/pages/dashboard/product/dashboard/ProductsTable.tsx`
- Column accessor uses `category.title` (expects populated object)
- If backend returns only category ID string, column shows `undefined`
- **Fix:** Verify backend populates category or add client-side lookup

### TABLE-04: Export Buttons — Console.log Only (Severity: 🟡 MEDIUM)
- Multiple table components have Export buttons that only `console.log()` the data
- No actual CSV/Excel/PDF export implemented
- **Affected:** Users table, Products table, Orders table, Proposals table

### TABLE-05: Orders Table — snake_case vs camelCase (Severity: 🟡 MEDIUM)
- Backend returns `order_id`, `payment_status`, `payment_method`
- Some table column accessors may expect camelCase equivalents
- **Fix:** Normalize field names in service response or adjust column accessors

---

## Auth Issues

### AUTH-01: Logout Does Not Invalidate Backend Tokens (Severity: 🟠 HIGH)
- **File:** `src/components/elements/userpopover.tsx`
- Calls `signOut()` (NextAuth) + clears storage + removes cookies
- Does NOT call `authService.logout()` to invalidate the refresh token on the backend
- **Impact:** After logout, the old refresh token remains valid on the server — a stolen token can still generate new access tokens
- **Fix:** Call `authService.logout()` with the current token before `signOut()`

### AUTH-02: No 401 Auto-Retry (Severity: 🔴 CRITICAL)
- See CRIT-04 above
- Token refresh only happens during NextAuth JWT callback (session refresh)
- If token expires mid-page, API calls fail until user manually refreshes

### AUTH-03: Permissions Never Re-Sync After Initial Load (Severity: 🟡 MEDIUM)
- **File:** `src/contexts/UserProvider.tsx`
- Permissions fetched once on login and cached in `sessionStorage`
- If admin changes a user's role/permissions, they take effect only after page reload
- **Fix:** Add a periodic re-fetch or listen for permission-change events via WebSocket

### AUTH-04: Sensitive Data in sessionStorage (Severity: 🟡 MEDIUM)
- **File:** `src/contexts/UserProvider.tsx`
- User permissions object stored in `sessionStorage` — accessible to any XSS payload
- **Impact:** Attacker can read the user's permission list (information disclosure)
- **Fix:** Keep permissions only in React state, not in browser storage

### AUTH-05: Missing CSRF Protection on OTP Endpoints (Severity: 🟡 MEDIUM)
- **Files:** `src/app/api/verify-otp/route.ts`, `src/app/api/resend-otp/route.ts`
- No CSRF token validation; relies only on session cookie
- **Impact:** Cross-site OTP verification/resend attacks possible
- **Fix:** Add CSRF token middleware or use SameSite cookie attributes

### AUTH-06: Stub Pages Import Layout but Don't Use It (Severity: 🟢 LOW)
- 7 pages import `Dashboard` from `@/components/layout/dashboard` but don't wrap their content in it
- **Affected:** analytics, user detail, order detail, support, billing, security, integration pages
- **Impact:** These pages render without the sidebar/header layout
- **Fix:** Either wrap content in `<Dashboard>` or remove the unused import

---

## Socket Issues

### SOCK-01: WebSocket Context Is Completely Stubbed (Severity: 🟠 HIGH)
- **File:** `src/contexts/websocket-context.tsx`
- Controlled by `NEXT_PUBLIC_SOCKETING_ENABLED` env var (likely `false`)
- `sendMessage()` only does `console.log()` when enabled
- Real WebSocket connection is commented out (`// const ws = new WebSocket(...)`)
- **Impact:** All realtime features (messaging, notifications, typing indicators) are non-functional
- **Downstream:** `notification-context.tsx` and `messaging-context.tsx` receive no events

### SOCK-02: Duplicate Notification Systems (Severity: 🟠 HIGH)
- **File:** `src/components/providers.tsx`
- Three separate notification/messaging systems mounted simultaneously:
  1. `NotificationProvider` (from `NotificationContext.tsx`) — socket.io based, uses `MockSocket`
  2. `NotificationProviderCommunication` (from `notification-context.tsx`) — WebSocket based
  3. `MessagingProvider` (from `messaging-context.tsx`) — WebSocket based
- **Impact:** State confusion between providers; duplicate event handling; memory overhead
- **Fix:** Consolidate into a single notification provider

### SOCK-03: MockSocket Timer Never Cleared (Severity: 🟡 MEDIUM)
- **File:** `src/contexts/NotificationContext.tsx`
- Uses `MockSocket` class that starts a `setInterval` to generate fake notifications
- The interval is never cleared when the provider unmounts
- **Impact:** Memory leak — timer accumulates on every hot reload in dev; benign in production with single mount but still a defect
- **Fix:** Return cleanup function from `useEffect` that calls `clearInterval`

### SOCK-04: Socket.io Listeners Never Removed (Severity: 🟡 MEDIUM)
- **File:** `src/utils/socket.ts` — `NotificationClient` class
- `setupListeners()` calls `this.socket.on(...)` for 5 events
- `disconnect()` calls `this.socket.disconnect()` but does not call `this.socket.off()` for any listener
- **Impact:** If the socket reconnects, duplicate listeners fire
- **Fix:** Store listener references and call `socket.off()` in `disconnect()`

### SOCK-05: Event Name Mismatch Between Systems (Severity: 🟡 MEDIUM)
- socket.io client emits/listens: `new_notification`, `notification_updated`, `all_notifications_read`
- WebSocket context listens for: `notification:new`, `typing:start`, `call:incoming`
- **Impact:** Even if WebSocket were enabled, event names don't align with socket.io server

---

## Dead Services / Unused Integrations

### DEAD-01: `src/lib/checkoutAPI.ts` — Pure Mock, Never Imported (Severity: 🟡 MEDIUM)
- Contains `CheckoutAPI` class with mock cart, addresses, payment methods
- Uses `await delay(800)` to simulate network latency
- Zero imports across entire codebase
- **Fix:** Delete file

### DEAD-02: `useProflileSecurity()` Hook — Typo, Never Imported (Severity: 🟢 LOW)
- **File:** `src/hooks/use-user-settings.ts`
- Function defined but never imported or used
- **Fix:** Delete function

### DEAD-03: Messaging System — 100% Mock Data (Severity: 🟡 MEDIUM)
- **File:** `src/contexts/messaging-context.tsx`
- All conversations, messages, contacts are hardcoded mock data
- No backend API calls; no WebSocket events consumed
- TODO comments throughout: "Connect to real API"
- **Impact:** Messaging panel in dashboard shows fake data; users may think it's real

### DEAD-04: Email Client Component — Socket Mock Only (Severity: 🟡 MEDIUM)
- Relies on `NotificationContext.tsx` which uses `MockSocket`
- Shows mock email notifications, not real ones
- **Impact:** Email section in communication dashboard is decorative only

### DEAD-05: Five Analytics Dashboard Widgets — No Backend (Severity: 🟡 MEDIUM)
- Conversion Funnel chart, Top Countries table, Hourly Traffic chart, Age Groups chart, Device Types chart
- All consume hooks that return stub data with explanation strings
- **Impact:** Dashboard has empty widget slots

### DEAD-06: Commented-Out Redux Auth Slice References (Severity: 🟢 LOW)
- 3 files contain commented-out `authSlice` imports
- Redux store only manages theme (`light`/`dark`/`system`)
- **Fix:** Remove commented imports

---

## Recommended Fixes

### Priority 1 — Immediate (Blocks core functionality)

| # | Issue | Fix | Effort |
|---|-------|-----|--------|
| 1 | CRIT-01 | Change `/order` → `/orders` in `OrderServices.ts` | 5 min |
| 2 | CRIT-02 | Change `/permission` → `/permissions` in `permissionServices.ts` | 5 min |
| 3 | CRIT-03 | Uncomment `productService` calls in product form `onSubmit` | 15 min |
| 4 | FORM-02 | Fix `BrandServices` → `brandService` case mismatch in brand form | 5 min |
| 5 | FORM-03 | Fix `UserServices` → `userServices` case mismatch in user form | 5 min |

### Priority 2 — High (Security & reliability)

| # | Issue | Fix | Effort |
|---|-------|-----|--------|
| 6 | CRIT-04 | Add 401 interceptor with auto-refresh retry in `fetchData()` | 2 hr |
| 7 | AUTH-01 | Call `authService.logout()` before `signOut()` in userpopover | 15 min |
| 8 | API-04 | Move OTP rate limiting to Redis/DB | 1 hr |
| 9 | AUTH-05 | Add CSRF protection to OTP endpoints | 1 hr |
| 10 | AUTH-04 | Remove permissions from sessionStorage | 30 min |

### Priority 3 — Medium (Quality & maintainability)

| # | Issue | Fix | Effort |
|---|-------|-----|--------|
| 11 | API-06 | Standardize on SWR or React Query, remove the other | 3 hr |
| 12 | SOCK-02 | Consolidate 3 notification providers into 1 | 2 hr |
| 13 | SOCK-01 | Implement real WebSocket connection or remove the feature | 4 hr |
| 14 | HOOK-01 | Implement analytics backend or remove 5 empty dashboard widgets | 2 hr |
| 15 | TABLE-04 | Implement real CSV/Excel export or remove buttons | 2 hr |

### Priority 4 — Low (Cleanup)

| # | Issue | Fix | Effort |
|---|-------|-----|--------|
| 16 | DEAD-01 | Delete `checkoutAPI.ts` | 1 min |
| 17 | DEAD-02 | Delete `useProflileSecurity()` | 1 min |
| 18 | API-01 | Fix `account-settng` typo on both frontend and backend | 10 min |
| 19 | API-02 | Rename `settngsServices.ts` → `settingsServices.ts` | 10 min |
| 20 | DEAD-06 | Remove commented Redux auth imports | 5 min |

---

## Summary

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| API Route Mismatches | 2 | — | — | — | 2 |
| Form Submission | 1 | 2 | 1 | — | 4 |
| Auth / Security | 1 | 1 | 3 | 1 | 6 |
| Socket / Realtime | — | 2 | 3 | — | 5 |
| Hook Wiring | — | 1 | 2 | 1 | 4 |
| Table Wiring | 2 | — | 3 | — | 5 |
| Dead Code | — | — | 4 | 2 | 6 |
| API Config | — | 1 | 3 | 2 | 6 |
| **TOTAL** | **6** | **7** | **19** | **6** | **38** |

**Production readiness: 🔴 NOT READY** — 6 critical issues must be resolved before deployment. The route path mismatches (CRIT-01, CRIT-02) mean orders and permissions are completely non-functional. The product form (CRIT-03) can't persist data. The missing 401 handler (CRIT-04) causes silent session death after 1 hour.
