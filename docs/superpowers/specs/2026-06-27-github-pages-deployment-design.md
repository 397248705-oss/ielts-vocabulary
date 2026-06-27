# GitHub Pages Deployment Design

## Goal

Publish the IELTS vocabulary PWA at a stable HTTPS URL that works on mobile browsers, remains installable, and can be updated automatically without uploading personal study data.

## Hosting

- Use a public GitHub repository named `ielts-vocabulary`.
- Publish it as a GitHub Pages project site at `https://<owner>.github.io/ielts-vocabulary/`.
- Keep the default `github.io` domain; a custom domain is outside this change.

## Build And Deployment

- Configure Vite's production base path for the repository subdirectory.
- Make the manifest, icons, service worker registration, navigation fallback, and cached app shell use the same deployment base path.
- Add a GitHub Actions workflow that installs dependencies, runs the test suite, builds the production bundle, and deploys the bundle to GitHub Pages after updates to `master`.
- Keep local development at `/` so the existing computer and same-Wi-Fi preview flow continues to work.

## Local Data

- Vocabulary progress, settings, and statistics remain in IndexedDB in the current browser.
- No study data is committed to GitHub or sent to GitHub Pages.
- Exported JSON backups remain the transfer path between browsers or phones.

## Failure Handling

- A failed test or build prevents a broken version from being published.
- The service worker keeps the last successfully cached app available offline.
- Existing installations receive the next successful app-shell update when they reconnect and reopen the site.

## Verification

- Run unit tests and a production build locally.
- Verify that built asset URLs include the repository base path.
- Push the public repository and enable GitHub Pages with GitHub Actions as its source.
- Open the published HTTPS URL, check mobile layout, reload behavior, PWA installation, and offline startup.

## Delivery Order

Deploy the current stable version first. UI improvements and vocabulary expansion follow as separate changes and automatically publish to the same URL after verification.
