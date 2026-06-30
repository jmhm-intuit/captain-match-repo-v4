# Captain Match Planner v4.03

Installable local-first PWA for 7v7 soccer match planning.

## What changed in v4.03

v4.03 starts from the v4.02 baseline and focuses on match planning logic and layout:

- Consolidated formation, lineup priority, rotation style, timing, and final-phase behavior into a single **Plan settings** section.
- Kept existing player attributes unchanged: FWD, WNG, CTR/Center, DEF, GK.
- Updated lineup priority language to **Best positional fit** and **Sign-up order**.
- Made sign-up order a tie-breaker instead of overriding major positional quality gaps.
- Added **Rotation style**: Competitive, Balanced, Fair minutes.
- Added explicit **Final phase** options: Plan final 12 or Live final 12.
- Live final 12 now shows both **planned minutes** and **all-in estimated minutes** in Confirm Players.
- Improved substitution suggestions to protect GK, DEF, and center structure while balancing playing time.
- Support players start only when they create a meaningful quality upside, especially in DEF/CTR/FWD.
- Added sign-up order move controls in Confirm Players.
- Bumped service-worker cache to `captain-match-planner-v4-03-cache`.

## Deployment strategy

v4.03 is intended as an update over v4.02 using the same GitHub Pages URL and the same IndexedDB database name. Existing local data should remain available after deployment.

Before deploying, export a backup from the live app.

## Local test

```bash
cd captain-match-planner-v4_03-local
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
git checkout -b update-v4-03

# Copy the contents of captain-match-planner-v4_03-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v4.03"
git push origin update-v4-03
```

Then merge to main:

```bash
git checkout main
git merge update-v4-03
git push origin main
```

After GitHub Pages deploys, open the live URL and confirm Home shows **App v4.03**.

## Key tests

1. Build a lineup with **Best positional fit** and confirm support players do not take close roster-player starting spots.
2. Build a lineup with **Sign-up order** and confirm sign-up order helps close decisions but does not break position quality.
3. Generate substitutions with **Balanced** and confirm bench players receive more planned time than before.
4. Switch to **Live final 12** and confirm Confirm Players shows planned minutes plus all-in estimates.
5. Switch to **Plan final 12** and confirm the Last 12 window becomes a planned substitution window.
