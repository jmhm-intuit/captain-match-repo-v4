# First-time cloud setup for Coach Planner v7.03

This package is already pointed at the validated Supabase function:

```text
https://wfuxkbigfrmfjvkoxepb.supabase.co/functions/v1/coach-planner-snapshot
```

No secrets or tokens are included in the app.

## First device

Use the device that currently has the best/latest local app data.

1. Deploy v7.03 to GitHub Pages.
2. Open the app.
3. Export a local backup.
4. Open **Coach Planner Cloud**.
5. Use workspace code `coach-planner`.
6. Choose a shared workspace password.
7. Click **Create New Workspace**.
8. Click **Save local changes to cloud**.

## Other devices

1. Open the same app URL.
2. Open **Coach Planner Cloud**.
3. Use workspace code `coach-planner`.
4. Enter the same shared password.
5. Click **Access Existing Workspace**.
6. Confirm the cloud data loads.

## Normal usage

- Use **Refresh from Cloud** before editing on a second device.
- Use **Save to Cloud** after meaningful edits.
- Local edits save immediately on each device, but other devices only see them after Save to Cloud.


## Saving match plans

After you build or auto-generate a lineup/substitution plan, the plan is saved locally automatically. Use **Save to Cloud** when you want the same saved plan to appear on another device.


## Match detail persistence

When editing match date, time, opponent, or field/location, click **Save to Cloud** after the change. v7.03 flushes any active input before saving and stores those values in the cloud snapshot.
