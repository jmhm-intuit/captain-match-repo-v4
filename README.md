# Captain Match Planner v4.05

Installable local-first PWA for 7v7 soccer match planning.

## What changed in v4.05

v4.05 starts from the v4.04 planning baseline and focuses on two follow-up fixes from the Plan Highlights and Share Match views.

- Share Match rotation rows are easier to scan: each substitution change stays on one compact row with **IN player / position / OUT player** instead of making the position pill a full row.
- Playing Time Balance now uses a realistic **target floor** instead of placing the marker at the full average.
- The outfield target floor is calculated as **planned outfield average minus 10 minutes**.
- If the final phase is live/not planned, the target floor uses only the planned portion of the match, not the full 50 minutes.
- Warnings now compare each outfield player's **planned minutes** against the target floor.
- Goalkeeper handling remains unchanged: fixed GK target is 50 minutes; split-half keepers target 25 minutes each.
- Bumped app version and service-worker cache to `captain-match-planner-v4-05-cache`.


## Rotation patch included in v4.05

This package also includes the latest Balanced/Fair rotation correction:

- Defense is protected but no longer frozen when there are 2+ bench players.
- In Balanced/Fair modes, the engine can rest one defender at a time when a DEF 4+ cover player is available.
- The engine strongly avoids taking the same player out twice in the same match when other eligible outfield players have not rested.
- The one-defender-at-a-time rule remains: auto-suggest still avoids rotating both defenders in the same window.
- The service-worker cache is bumped to `captain-match-planner-v4-05-rotation-cache` so this patch refreshes cleanly in the installed PWA.

## Previous v4.04 foundation

v4.04 introduced the compact navigation, Tournament Full overflow fixes, Plan Settings command panel, heavy-rotation logic, simultaneous substitution-window validation, keeper-plan options, and the visual Plan Highlights dashboard.

## Deployment strategy

v4.05 is intended as an update over v4.04 using the same GitHub Pages URL and the same IndexedDB database name. Existing local data should remain available after deployment.

Before deploying, export a backup from the live app.

## Local test

```bash
cd captain-match-planner-v4_05-local
python3 -m http.server 5174
```

Open:

```text
http://localhost:5174
```

## GitHub Pages deployment

Use the existing repo and URL for continuity:

```bash
cd ~/Documents/GitHub/captain-match-repo-v4

git checkout main
git pull
git checkout -b update-v4-05

# Copy the contents of captain-match-planner-v4_05-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v4.05"
git push origin update-v4-05
```

Then merge to main:

```bash
git checkout main
git merge update-v4-05
git push origin main
```

After GitHub Pages deploys, open the live URL and confirm Home shows **App v4.05**. If the installed PWA still shows an older version, close/reopen the app or refresh once so the new service worker cache takes over.
