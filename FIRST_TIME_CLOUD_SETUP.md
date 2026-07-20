# Cloud access guide for Coach Planner v7.04

## For team members

Use this flow when someone sends you the app link and the workspace password.

1. Open the app link.
2. Open **Coach Planner Cloud** / **Load the latest plan**.
3. Choose **Access Existing Workspace**.
4. Enter the workspace code shared by the organizer. The default is `coach-planner`.
5. Enter the shared workspace password.
6. After it connects, click **Refresh latest plan**.
7. Select the team and match to view the saved lineup and rotation plan.

If you make edits, click **Save plan** where available, then **Save my changes to Cloud** so the rest of the team can see the update.

## Admin setup / first upload

Use this only once, from the device that has the best/current local data.

1. Deploy v7.04 to GitHub Pages.
2. Open the app on the device with the latest roster, tournament, match details, and plans.
3. Export a backup first.
4. Open **Coach Planner Cloud**.
5. Use workspace code `coach-planner`.
6. Enter the shared password you want the team to use.
7. Expand **Admin setup / first upload** and choose **Admin: Create Workspace**.
8. After the workspace connects, choose **Save my changes to Cloud**.
9. Share the app link, workspace code, and password with the team.

## Existing Supabase setup

No Supabase data structure changes are required for v7.04. It continues using the existing `workspaces` and `app_snapshots` tables and the validated `coach-planner-snapshot` Edge Function.
