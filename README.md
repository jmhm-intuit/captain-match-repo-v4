# Captain Match Planner v4.04

Installable local-first PWA for 7v7 soccer match planning.

## What changed in v4.04

v4.04 starts from the v4.03 planning baseline and focuses on layout cleanup, substitution correctness, and a more engaging plan-quality dashboard.

- Compact bottom navigation so the main app content has more vertical space.
- Fixed Tournament > Full schedule overflow so actions wrap inside the card instead of extending off-screen.
- Redesigned Plan settings into a command-control panel while keeping the visual formation selector.
- Added **Auto plan match** in Plan settings to generate lineup and substitutions from one place.
- Heavy rotation now auto-applies when the bench has 4+ players, with windows around 8, 16, Half, 33, and a final 8-minute phase.
- Auto changes are capped at 3 per window.
- Substitution windows are treated as simultaneous batches.
- A player taken OUT cannot also go IN during the same window.
- First substitution window brings in all bench players, capped at 3.
- Balanced and Fair minutes modes better protect playing-time balance while preserving DEF / Center structure.
- Added Keeper plan support: fixed GK by default, optional split halves when multiple GK-capable players are available, and manual control.
- Added **Plan Highlights** after the plan:
  - Plan health badge
  - Team Score including GK
  - Defense Score
  - Center Score
  - Forward Score
  - Warnings / coaching notes
  - Avatar-based playing-time chart with average marker
- Confirm Players no longer shows minutes; time balance now lives in Plan Highlights.
- Share/output rotations stack changes vertically.
- Strategy comments wrap properly.
- Download image now uses a dynamic canvas height to handle heavy rotation and compact highlights without clipping.
- Bumped service-worker cache to `captain-match-planner-v4-04-cache`.

## Deployment strategy

v4.04 is intended as an update over v4.03 using the same GitHub Pages URL and the same IndexedDB database name. Existing local data should remain available after deployment.

Before deploying, export a backup from the live app.

## Local test

```bash
cd captain-match-planner-v4_04-local
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
git checkout -b update-v4-04

# Copy the contents of captain-match-planner-v4_04-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v4.04"
git push origin update-v4-04
```

Then merge to main:

```bash
git checkout main
git merge update-v4-04
git push origin main
```

After GitHub Pages deploys, open the live URL and confirm Home shows **App v4.04**.

## Key tests

1. Confirm the top navigation is compact.
2. Confirm Tournament > Full view does not overflow on narrow screens.
3. Generate a match with 2 bench players and confirm the first window brings both in.
4. Generate a match with 4+ bench players and confirm Heavy rotation is applied.
5. Confirm no player is both OUT and IN in the same substitution window.
6. Confirm Plan Highlights shows score cards, warnings, and avatar-based playing time.
7. Switch Final phase to Live and confirm planned plus all-in minutes are understandable.
8. Download image with heavy rotation and confirm no text is clipped.
