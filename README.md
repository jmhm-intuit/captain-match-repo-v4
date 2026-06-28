# Captain Match Planner v4.01

Installable local-first PWA for planning 7v7 soccer matches.

## What changed in v4.01

- Redesigned the Tournament section for better usability and smaller screens.
- Added a compact tournament selector with Current / Coming up / Past / Archived labels.
- Added Summary / Full schedule toggle.
  - Summary focuses on Week, Match, Date, and Time.
  - Full adds Opponent, Field, Status, and schedule actions.
- Consolidated tournament setup into a compact setup card with an edit pencil flow.
- Structural tournament changes rebuild empty generated schedule rows while preserving planned/rescheduled matches.
- Added protected Archive / Delete tournament flow.
- Added one-click schedule exception actions: Skip week, Add double-header, Push future matches +1 week.
- Double-header creation sets matches one hour apart by default.
- Made Team roster much more compact with a matrix-style player row.
- Moved estimated minutes into Confirm Players after a lineup exists, with a show/hide toggle.
- Added a read-only Data tab inside the core app.
- Improved share-card image export and added an Open image fallback.
- Updated app version to v4.01 and service-worker cache to `captain-match-planner-v4-01-cache`.

## Data behavior

v4.01 is intended as an update over v4.0 using the same GitHub Pages URL and the same IndexedDB database name. Existing local data should remain available after deployment.

Before deploying, export a backup from the current app.

## Local run

```bash
cd captain-match-planner-v4_01-local
python3 -m http.server 5174
```

Open:

```text
http://localhost:5174
```

## Deploy over the existing GitHub Pages repo

Use the existing repo and URL so the installed PWA and IndexedDB data continue to point to the same app scope.

Recommended repo:

```text
github.com/jmhm-intuit/captain-match-repo-v4
```

Recommended live URL:

```text
https://jmhm-intuit.github.io/captain-match-repo-v4/
```

### Deployment steps

```bash
cd ~/Documents/GitHub/captain-match-repo-v4

# Safety branch
git checkout main
git pull
git checkout -b update-v4-01

# Copy the contents of captain-match-planner-v4_01-local into this repo folder.
# Keep the .git folder.
# Replace index.html, database-check.html, manifest.webmanifest,
# service-worker.js, README.md, src/, and assets/ with the v4.01 versions.

git status
git add .
git commit -m "Update Captain Match Planner to v4.01"
git push origin update-v4-01
```

Then merge the branch into `main`, or if you prefer direct command-line merge:

```bash
git checkout main
git merge update-v4-01
git push origin main
```

After GitHub Pages updates, open:

```text
https://jmhm-intuit.github.io/captain-match-repo-v4/
```

## Post-deploy checks

1. Confirm Home shows App v4.01.
2. Confirm players and tournaments from v4.0 are still present.
3. Open the new Data tab and verify tournaments, matches, and players are visible.
4. Open Tournament and switch Summary / Full view.
5. Generate or open a match plan and test Download image plus Open image.

## PWA update note

PWAs can briefly serve an old cached version. The v4.01 service worker uses a new cache name, so it should update after reload. If the app still shows v4.0:

1. Open the app in Chrome.
2. Refresh once or twice.
3. Close and reopen the installed PWA.
4. If needed, open Chrome DevTools > Application > Service Workers and update/unregister the old worker.

Do not uninstall the PWA unless you have exported a backup, because uninstalling can remove local IndexedDB data on some devices.
