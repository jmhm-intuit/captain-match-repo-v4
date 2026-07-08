# Captain Match Planner v5.1

Installable local-first PWA for 7v7 soccer match planning.

## What changed in v5.1

v5.1 refines the V5 multi-team foundation with team branding, clearer membership management, better shared-player flows, and richer player profiles.

### Team identity and branding

- Added team-aware app coloring using the selected team's color.
- Green FC defaults to Forest Green.
- Intuit United defaults to Blue.
- Intuit United uses the provided blue-team match background image.
- Each team can now upload a custom background image from the Team page.
- Team background images are stored locally and included in export/import backups.
- Team color selection now shows a clearer color preview and quick swatches.
- Team creation is now positioned as a Home-page management action instead of a frequent top-bar action.

### Team page membership model

- Replaced the visible Shared Player Pool section with a clearer selected-team structure:
  - Roster players
  - Support players
  - Players not in this team
- A player's row still shows cross-team membership pills, for example:
  - Green FC · Roster
  - Intuit United · Support
- Players not in the selected team can be added quickly as Support or Roster.
- Fixed membership visibility so a player with an Intuit United support badge appears in the Intuit United support section.

### Shared-player behavior

- Search/replacement flows now use the full global player pool.
- If an existing player is selected for a match but is not part of that team, the app automatically adds them as Support for that team.
- New players default to Support across all active teams.
- New-player creation opens the player profile so team-by-team membership can be adjusted immediately.
- Player profile membership controls now show all active teams with Roster / Support / Not on team options.

### Player profile enhancements

- Added two global player attributes:
  - Soccer experience: Less than 5 years, 5 to 10 years, All my life.
  - Running capacity: Not much, 15 min, 30 min, 45 min, 45+ min.
- Existing players default to:
  - Soccer experience: All my life.
  - Running capacity: 45 min.
- These fields are shown as visual player-background chips and editable from the profile drawer.
- Jose defaults to Avatar 25.
- Baseline male players avoid Avatar 01 through Avatar 06.
- Fixed avatar picker layering so selecting an avatar from the player profile is not greyed out.

### Delete and navigation fixes

- The first remove-player dialog now clarifies that permanent deletion requires removing the player from all teams first.
- A protected Delete permanently option appears only when a global player has no active team memberships.
- The Back to matches button from match planning now returns to the matches overview instead of reopening the same plan.
- The session still remembers the last match-planning view when the user navigates back to Matches normally.

### Intuit United defaults

- Default Intuit United tournament starts on July 22, 2026.
- Existing Green FC support players remain available as support for Intuit United.

## Data migration

When opening v5.1 over an existing v5.0 or v4.05 local database, the app updates teams, team memberships, player defaults, and background settings automatically.

Recommended before deployment: export a backup from the live app.

## Deployment strategy

v5.1 is intended as an update over v5.0 using the same GitHub Pages URL and the same local IndexedDB database name. Existing local data should remain available after migration.

## Local test

```bash
cd captain-match-planner-v5_1-local
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
git checkout -b update-v5-1

# Copy the contents of captain-match-planner-v5_1-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v5.1"
git push origin update-v5-1
```

Then merge to main:

```bash
git checkout main
git merge update-v5-1
git push origin main
```

After GitHub Pages deploys, open the live URL and confirm Home shows **App v5.1**. If the installed PWA still shows an older version, close/reopen the app or refresh once so the new service worker cache takes over.
