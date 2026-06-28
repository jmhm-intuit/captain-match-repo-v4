# Captain Match Planner v4.0 PWA Local Prototype

A local, mobile-first 7v7 soccer match planner for tournament-based teams.

## Run locally

For normal browsing, you can still double-click `index.html`.

For PWA install/offline behavior, serve the folder over localhost:

```bash
cd captain-match-planner-v4_0-local
python3 -m http.server 5174
```

Then open:

```text
http://localhost:5174
```

Use the same local address/port when possible so browser storage and the installed app stay on the same origin.

Open the read-only database inspection page at:

```text
http://localhost:5174/database-check.html
```

If the port is busy, use another one, for example `5175`.

## What's new in v4.0

- Added Progressive Web App support for installable local use on desktop and mobile browsers.
- Added `manifest.webmanifest` with app name, theme color, standalone display mode, app icons, and shortcuts.
- Added a service worker that caches the app shell, database-check page, styles, scripts, avatars, and field/background assets for offline use after first load.
- Added app icons in 192px, 512px, Apple touch icon, and maskable formats.
- Added an install button that appears when the browser exposes the PWA install prompt.
- Updated app version display and backup version to **4.0**.
- Kept the existing local IndexedDB data layer and schema version unchanged.

## Installing as a PWA

1. Start a local server from this folder, for example `python3 -m http.server 5174`.
2. Open `http://localhost:5174` in Chrome, Edge, or another PWA-capable browser.
3. Use the browser install control or the **Install app** button when it appears.
4. After the first successful load, the app shell can open offline from the installed app cache.

Notes:

- PWA install and service workers do not run from `file://`; use localhost or HTTPS.
- Data is still stored locally per browser/device through IndexedDB. Export backups regularly.
- If you change the local port, the browser treats it as a different origin with different local data.

## What's new in v3.03

- Added a separate **Data Base Check** page at `database-check.html` for read-only inspection of the local IndexedDB tables.
- Added a top action link from the main app to **Data Base Check**.
- Added custom avatar upload from the avatar picker.
  - Uploaded avatars require a name.
  - Uploaded avatars are stored in IndexedDB as data URLs.
  - Uploaded avatars are included in Export/Import backups.
- Added intentional player editing in Team view.
  - Player cards are read-only by default.
  - Use the pencil/edit button to enable editing.
  - Changes are committed with **Save** or discarded with **Cancel**.
- Home now shows **Last updated** next to the app version/local database status.
- Home, Matches, and Tournaments default to the tournament with the closest upcoming match from today.
- Tournament default field now prepopulates newly generated matches.
- Changing the tournament default field asks whether to update future matches in that tournament; past matches are left alone.
- Tournament schedule now shows both Week and Match columns, so skip weeks explain calendar gaps while match numbers remain scoped to the tournament.
- The compact tournament selector highlights Current / Coming up / Past and defaults to the tournament with the closest upcoming match.
- Double headers are one hour apart by default when an existing first time is available; otherwise time pickers suggest 7:00 PM and 8:00 PM without saving until edited.
- Manually changing a match date marks it as rescheduled and keeps that match number.
- Blank match-time inputs start at **7:00 PM** when focused, but the time is not saved until the captain changes/saves the field.

## What's new in v3.01

- Added a local IndexedDB data layer with table-like stores for teams/tournaments, players, matches, match players, lineups, and substitutions as they exist in the current app state.
- Added a data service layer so the UI saves through one local persistence API instead of writing directly to raw browser storage.
- Existing localStorage data is automatically migrated into IndexedDB the first time v3.01 opens.
- Export creates a versioned local database backup with app version, schema version, export time, and the full app snapshot.
- Import accepts both the v3 backup format and older raw JSON backups.
- Home shows a small local database status next to the app version.

## What's new in v2.9

- Replaced Avatar 19 with the final Joey avatar.
- Formation-by-moment now uses compact read-only markers instead of editable cards.
- Field player cards and markers scale from the pitch size so smaller screens do not cause overlap.
- Adjusted 7v7 slot coordinates to keep GK and defensive labels inside the field.

## What's new in v2.7

- The visible app title is now **Captain Match Planner** instead of SquadFlow Captain.
- Home shows a small explicit app version label.
- The lineup and share-card pitch were lightened and re-anchored so players stay inside the field.
- 7v7 formation slots were adjusted:
  - 2-3-1 uses FWD, LM, CM, RM, LB, RB, GK.
  - 3-2-1 uses FWD, LM, RM, LB, CB, RB, GK.
- AM was removed from the 3-2-1 formation.
- Existing 3-2-1 lineups are migrated from CM/AM into LM/RM.
- Tournament schedule logic now uses skip dates explicitly, so skip weeks stay grey and do not get refilled by accident.
- Tournament match labels and numbering are scoped per tournament and recalculate after schedule edits.
- Auto-generated blank extra matches can be trimmed back to the tournament target, preventing inflated “matches left” counts.
- Home calls out the active tournament name alongside the remaining match count.

## Previous v2.6 refinements

- Auto-suggest modes were renamed to Positional and Sign-up order.
- Sign-up order now prioritizes the WhatsApp/import order while still protecting role fit and the goalkeeper slot.
- Support players have stronger visual contrast in the Team view.
- Goalkeepers can be selected as Player Out, appear last in the list, and show a GK note.
- GK substitutions require the incoming player to be GK-capable.
- Substitution position overrides are available by double-clicking the position chip. The incoming player takes the selected position, and the player currently there shifts into the outgoing player’s old position.

## Notes

Data is stored in browser IndexedDB. If IndexedDB is unavailable, the app falls back to `localStorage`. Use Export/Import to back up data.

If old local data creates visual issues, use Reset or import a clean backup.
