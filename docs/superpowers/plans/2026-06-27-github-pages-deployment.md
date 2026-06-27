# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the current IELTS vocabulary PWA to a stable GitHub Pages HTTPS URL with automatic updates and working subdirectory-aware offline support.

**Architecture:** GitHub Actions builds the Vite app and deploys `dist` to a GitHub Pages project site. Production paths use `/ielts-vocabulary/`, while development remains at `/`; the manifest and service worker derive URLs from that base so installation and offline startup work under both locations.

**Tech Stack:** React 18, TypeScript, Vite 6, Vitest, Playwright, GitHub Actions, GitHub Pages

---

## File Map

- Modify `vite.config.ts`: select the development or production base path.
- Create `src/platform/serviceWorker.ts`: register the service worker against Vite's active base URL.
- Create `src/platform/serviceWorker.test.ts`: verify base-aware registration and unsupported-browser behavior.
- Modify `src/main.tsx`: call the focused registration helper.
- Modify `index.html`: make the manifest link base-aware.
- Modify `public/manifest.webmanifest`: use relative start, scope, and icon URLs.
- Modify `public/sw.js`: derive its cache URLs and offline navigation fallback from its own scope.
- Modify `tests/mobile.spec.ts`: verify the manifest link and manifest fields from the running app.
- Create `.github/workflows/deploy-pages.yml`: test, build, upload, and publish the app.
- Modify `README.md`: document the public URL, automatic updates, and local-only data behavior.

### Task 1: Base-Aware Service Worker Registration

**Files:**
- Create: `src/platform/serviceWorker.ts`
- Create: `src/platform/serviceWorker.test.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write failing registration tests**

Test that `registerServiceWorker('/ielts-vocabulary/', window, navigator)` waits for `load` and registers `/ielts-vocabulary/sw.js`; also test that it does nothing when service workers are unavailable.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- src/platform/serviceWorker.test.ts`

Expected: FAIL because `src/platform/serviceWorker.ts` does not exist.

- [ ] **Step 3: Implement the registration helper**

Create a helper with explicit window and navigator dependencies for testing. It should join the supplied trailing-slash base with `sw.js`, catch registration failure without interrupting the app, and return immediately when `serviceWorker` is absent.

- [ ] **Step 4: Replace the inline registration in `src/main.tsx`**

Import the helper and call `registerServiceWorker(import.meta.env.BASE_URL)` before rendering React.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/platform/serviceWorker.test.ts`

Expected: all focused tests pass.

Commit: `feat: make service worker registration base-aware`

### Task 2: GitHub Pages And PWA Paths

**Files:**
- Modify: `vite.config.ts`
- Modify: `index.html`
- Modify: `public/manifest.webmanifest`
- Modify: `public/sw.js`
- Modify: `tests/mobile.spec.ts`

- [ ] **Step 1: Extend the mobile PWA test**

From the app page, assert that the manifest link resolves successfully. Parse the manifest response and assert `start_url` and `scope` are `./` and the icon source is `./icons/icon.svg`.

- [ ] **Step 2: Run the mobile test and confirm failure**

Run: `npm run e2e -- --grep "manifest"`

Expected: FAIL because the existing manifest uses root-absolute URLs and has no explicit scope.

- [ ] **Step 3: Configure the production base**

Set Vite's base to `/` in development and test modes, and `/ielts-vocabulary/` in production. Keep the existing React and Vitest configuration unchanged.

- [ ] **Step 4: Make static PWA files base-aware**

Use `%BASE_URL%manifest.webmanifest` in `index.html`. In the manifest, set `start_url` and `scope` to `./` and the icon source to `./icons/icon.svg`.

In `public/sw.js`, derive the app root with `new URL('./', self.location.href)`, pre-cache the scoped root, index, manifest, and icon, and return the cached root when an offline navigation request cannot be fetched.

- [ ] **Step 5: Run the mobile test and production build**

Run: `npm run e2e -- --grep "manifest"`

Expected: PASS.

Run: `npm run build`

Expected: PASS, with generated HTML URLs beginning `/ielts-vocabulary/`.

- [ ] **Step 6: Commit**

Commit: `feat: support GitHub Pages project paths`

### Task 3: Automatic GitHub Pages Publication

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

- [ ] **Step 1: Add the deployment workflow**

Trigger on pushes to `master` and manual dispatch. Grant `contents: read`, `pages: write`, and `id-token: write`; allow one Pages deployment at a time. Use `actions/checkout@v4`, `actions/setup-node@v4` with Node 22 and npm cache, `npm ci`, `npm test`, `npm run build`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`.

- [ ] **Step 2: Document operation and privacy**

Add the final GitHub Pages URL format, explain that pushes to `master` update the site automatically, and state that IndexedDB learning data never enters the repository.

- [ ] **Step 3: Validate the workflow and commit**

Run a YAML parse check using the installed project tooling if available, then run `npm test` and `npm run build`.

Expected: all tests and the build pass.

Commit: `ci: deploy app to GitHub Pages`

### Task 4: Publish And Verify The HTTPS Site

**Files:**
- No source files unless verification reveals a deployment defect.

- [ ] **Step 1: Create the public repository**

Use the signed-in GitHub account to create an empty public repository named `ielts-vocabulary`, without a generated README, license, or `.gitignore`.

- [ ] **Step 2: Connect and push**

Add the repository as `origin` and push `master`, setting upstream tracking.

- [ ] **Step 3: Enable GitHub Pages**

In repository Pages settings, choose GitHub Actions as the publishing source. Wait for the deployment workflow to finish successfully.

- [ ] **Step 4: Verify the published app**

Open `https://<owner>.github.io/ielts-vocabulary/` and verify the page loads over HTTPS, the manifest returns successfully, the mobile layout is usable, reload works, and the service worker controls the page after refresh.

- [ ] **Step 5: Verify offline startup**

Load the app online, refresh once, switch the browser offline, and reload. Confirm the app shell opens and previously stored learning data remains available.

- [ ] **Step 6: Record final status**

Run: `git status --short --branch`

Expected: `master` tracks `origin/master` with a clean working tree.
