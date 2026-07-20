# Coach Planner v7.03

Cloud Snapshot MVP for the multi-team 7v7 soccer coach planner.

v7.03 builds on the Supabase-connected v7 app to the validated Supabase Edge Function for this project. It keeps the local-first app experience, but adds a shared cloud workspace using Supabase. Local data still saves immediately on the device. Cloud sync is manual for MVP safety: **Save to Cloud** and **Refresh from Cloud**.

## What changed in v7.03

- Preconfigures the public cloud endpoint in `cloud-config.js`:
  - `https://wfuxkbigfrmfjvkoxepb.supabase.co/functions/v1/coach-planner-snapshot`
- Updates the app version to **7.03** and refreshes the PWA cache name.
- Updates the included Edge Function so it does **not** return `password_hash` to the browser.
- Adds service-role grant SQL to avoid `permission denied for table workspaces` during first setup.
- Adds clearer first-time setup guidance inside the cloud workspace modal.
- Keeps all v7.0 cloud behavior:
  - visible cloud status pill
  - shared workspace code + shared password
  - 30-day remembered session on the device
  - manual **Save to Cloud** and **Refresh from Cloud**
  - local-only fallback
  - conflict warning if cloud data changed since the device loaded it
  - uploaded avatars and team backgrounds stored inside the snapshot

## Architecture

```text
GitHub Pages frontend
→ Supabase Edge Function
→ Supabase workspaces + app_snapshots tables
```

The browser never receives the Supabase service role key, `TEAM_PASSWORD_SECRET`, or any deployed secret. The static app only contains the public function URL.

## Supabase status for this project

Already validated in Supabase:

```text
Function URL: https://wfuxkbigfrmfjvkoxepb.supabase.co/functions/v1/coach-planner-snapshot
JWT verification: off
CORS: working
Create/access workspace: working
Save/load snapshot: working
password_hash exposed to browser: false after v7.02+ function patch
```

## Supabase setup from scratch

Only needed if recreating the backend in a new Supabase project.

### 1. Run the database migration

Run this SQL file in Supabase SQL Editor:

```text
supabase/migrations/202607200001_cloud_snapshot.sql
```

If you already created the tables but the Edge Function shows `permission denied for table workspaces`, run:

```text
supabase/migrations/202607200002_service_role_grants.sql
```

### 2. Deploy the Edge Function

Function path:

```text
supabase/functions/coach-planner-snapshot/index.ts
```

Function name:

```text
coach-planner-snapshot
```

Set **JWT verification off** for this function.

Function secrets:

```text
SUPABASE_URL                default secret in Supabase
SUPABASE_SERVICE_ROLE_KEY   default secret in Supabase
TEAM_PASSWORD_SECRET        custom long random private phrase
CORS_ORIGIN                 * for private MVP test, or your GitHub Pages origin later
```

Do not paste service role keys, secrets, or runtime tokens into GitHub or app code.

### 3. Configure the static app

For this project, `cloud-config.js` is already configured:

```js
window.COACH_PLANNER_CLOUD = {
  functionUrl: "https://wfuxkbigfrmfjvkoxepb.supabase.co/functions/v1/coach-planner-snapshot",
  defaultWorkspaceSlug: "coach-planner",
  displayName: "Coach Planner"
};
```

This file is safe to commit because it contains only public, non-secret configuration.

## First-time app setup

Use this flow after deploying v7.03 to GitHub Pages.

### Main device with the latest local data

1. Open the deployed app.
2. Export a local backup first from the app.
3. Open **Coach Planner Cloud** from the Home page or the cloud status pill.
4. Keep workspace code:

```text
coach-planner
```

5. Enter the shared workspace password you want to use for the team.
6. Click **Create New Workspace**.
7. When it connects, click **Save local changes to cloud**.
8. Confirm the cloud status says **Connected** or **Saved**.

### Second device / another user

1. Open the same deployed app URL.
2. Open **Coach Planner Cloud**.
3. Use workspace code:

```text
coach-planner
```

4. Enter the shared workspace password.
5. Click **Access Existing Workspace**.
6. The cloud snapshot should load. Use **Refresh from Cloud** before editing if unsure.

## Daily use

Recommended habit:

```text
Before editing on a device: Refresh from Cloud.
After meaningful edits: Save to Cloud.
```

The app remains local-first. Edits save immediately to the current device, and only become visible on other devices after **Save to Cloud**.

## Conflict behavior

v7.03 uses last-save-wins, but warns before overwriting if the cloud snapshot changed since the device loaded it.

If a conflict warning appears, the safer choice is usually:

```text
Cancel → Refresh from Cloud → reapply your changes → Save to Cloud
```

## Local test

```bash
cd captain-match-planner-v7_03-local
python3 -m http.server 5177
```

Open:

```text
http://localhost:5177
```

## GitHub Pages deployment

Use the existing repo and URL for continuity:

```bash
cd ~/Documents/GitHub/captain-match-repo-v4

git checkout main
git pull
git checkout -b update-v7-03

# Copy the contents of captain-match-planner-v7_03-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Coach Planner to v7.03 schedule cloud persistence"
git push origin update-v7-03
```

Then merge to main and push.

After deploy, hard refresh the browser. For the installed PWA, close and reopen it. If it still shows an older version, uninstall/reinstall the PWA or clear the site data once.

## Safety notes

- Do not put service role keys, `TEAM_PASSWORD_SECRET`, passwords, or runtime tokens in app code.
- `cloud-config.js` should contain only the public Edge Function URL.
- Keep using Export backups before major cloud saves or migrations.
- The cloud MVP is manual sync, not live multi-user collaboration.


## v7.02/v7.03 updates

- Match plans are now explicitly stamped as saved when generated or edited. Saved lineup/substitution plans stay inside the local database and Supabase cloud snapshot.
- The Match Planner header and Matches list now show whether a saved plan exists.
- Added a manual **Save plan** button for clarity; local saves still happen automatically and Save to Cloud publishes the saved plan to other devices.
- Added the new centered soccer-field home background and made team backgrounds more visible so switching teams has stronger visual contrast.


## v7.03 schedule persistence fix

- Match schedule fields now use a dedicated schedule-save path: date, time, opponent, and field/location are stamped with `scheduleSavedAt` and protected from generated schedule cleanup.
- Save to Cloud now flushes any visible match detail inputs before creating the Supabase snapshot, so values typed immediately before saving are included.
- Cloud snapshots now include the selected team, tournament, and match UI state, so another device returns to the same team/match context after Refresh from Cloud.
- No Supabase schema change is required; these fields live inside the existing `app_snapshots.data` JSON snapshot.
