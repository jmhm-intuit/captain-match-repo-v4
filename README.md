# Captain Match Planner v5.0

Installable local-first PWA for 7v7 soccer match planning.

## What changed in v5.0

v5.0 introduces the multi-team foundation while preserving the v4.05 planning logic and local-first deployment model.

### Multi-team foundation

- Added a persistent team switcher in the top bar.
- V5 supports up to 5 active teams in the UI.
- Default teams created during migration:
  - Green FC with Forest Green branding.
  - Intuit United with Blue branding.
- Existing v4.05 data migrates into Green FC.
- Existing support players are also added to Intuit United as support players.
- Tournaments and matches are filtered by the selected team.
- Each team has editable name and color.

### Shared player pool

- Players are now treated as a global player pool.
- A player can belong to multiple teams with different team roles.
- Team membership is shown as neutral pills, for example:
  - Green FC · Roster
  - Intuit United · Support
- Player profile drawer shows avatar, skills, and all team memberships.
- Team section includes a shared player pool and an add-existing-player flow.
- Removing a player from a team no longer deletes the global player profile.

### Match-planning navigation

- Returning to Matches during the same session reopens the last match-planning view.
- The match-planning page still has a Back to matches button to return to the match overview.
- Confirm Players rows now let you open a player profile from the match-planning flow.

### Avatar library

- Replaced the default avatar picker with the updated 30-avatar library.
- All built-in avatars are labeled neutrally as Avatar 01 through Avatar 30.
- Uploaded custom avatars remain local and are included in backups.

## Data migration

When opening v5.0 over an existing v4.05 local database, the app creates team records and team membership records automatically.

Recommended before deployment: export a backup from the live v4.05 app.

## Deployment strategy

v5.0 is intended as an update over v4.05 using the same GitHub Pages URL and the same local IndexedDB database name. Existing local data should remain available after migration.

## Local test

```bash
cd captain-match-planner-v5_0-local
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
git checkout -b update-v5-0

# Copy the contents of captain-match-planner-v5_0-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v5.0"
git push origin update-v5-0
```

Then merge to main:

```bash
git checkout main
git merge update-v5-0
git push origin main
```

After GitHub Pages deploys, open the live URL and confirm Home shows **App v5.0**. If the installed PWA still shows an older version, close/reopen the app or refresh once so the new service worker cache takes over.
