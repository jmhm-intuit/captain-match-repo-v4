# Captain Match Planner v6.01

Installable local-first PWA for multi-team 7v7 soccer match planning.

## What changed in v6.01

### Baseline teams and roster

- Keeps the current Green FC baseline.
- Adds the second baseline team as **Intuit United FC**.
- Intuit United FC uses the existing blue team branding/background and plays on Wednesdays.
- Adds an Intuit United FC tournament starting **Wednesday, July 22, 2026**.
- Seeds 8 Wednesday matches:
  - July 22, July 29, August 5, August 12, August 19, August 26, September 3, September 10.
- Imports the Intuit United FC survey roster as roster players.
- Jose, Franco/Franco Duarte, Nisanth/Nishanth, and Fernando/Fernando Mendoza are matched as shared roster players across Green FC and Intuit United FC.
- Miguel and Migu Malla remain separate players.
- Player names from the roster are lightly normalized with starting capitals only.
- Emails are stored on global player profiles for future iterations.

### Survey mapping

Position answer mapping:

- `This is a great position for me` = 5 stars.
- `I am good here` = 4 stars.
- `I can play if needed` = 2 stars.
- `I not good here` = 1 star.

Player background mapping:

- `less than 5 years` = Less than 5 years.
- `between 5 to 10 years` = 5 to 10 years.
- `Since I was a kid` = All my life.
- `15 min non stop` = 15 min.
- `30 min non stop` = 30 min.
- `45 min non stop` = 45 min.
- `More than 45 min` = 45+ min.

When a player has more than three strong 4/5 positions, the app keeps the best/scarcest three and downgrades extra strong roles to 3.

### CSV roster import

- Adds a **Bulk CSV** action in the Team page.
- CSV import applies to the currently selected team.
- The validation preview shows rows found, matched players, new players, and warnings.
- Matching priority:
  1. Email match.
  2. Exact name / alias match.
  3. Similar-name recommendation.
  4. Create new player.
- Matched existing players can update email, avatar, skills, soccer experience, and running capacity after the review step.
- Imported CSV players become roster players for the selected team and support players on other active teams unless they already have a roster role there.

### Duplicate avatars

- Duplicate avatars are allowed.
- When two or more players share the same avatar, the app adds a distinct avatar border color per player to make them easier to identify.
- The border appears on team rows, profile views, match planning, and Plan Highlights.

### Match planning expectation

- Intuit United FC starts with a larger roster and is expected to use heavier rotations.
- Heavy rotation remains the preferred pattern for high-bench matches.

## Data migration

Opening v6.01 over an existing v5.2/v5.1/v5.0/v4.05 local database upgrades the local data model and adds the Intuit United FC baseline if it is missing.

Recommended before deployment: export a backup from the live app.

## Deployment strategy

v6.01 is intended as an update over the existing GitHub Pages app using the same repo and URL.

## Local test

```bash
cd captain-match-planner-v6_01-local
python3 -m http.server 5176
```

Open:

```text
http://localhost:5176
```

## GitHub Pages deployment

Use the existing repo and URL for continuity:

```bash
cd ~/Documents/GitHub/captain-match-repo-v4

git checkout main
git pull
git checkout -b update-v6-01

# Copy the contents of captain-match-planner-v6_01-local into this repo folder.
# Keep the .git folder.

git status
git add .
git commit -m "Update Captain Match Planner to v6.01"
git push origin update-v6-01
```

Then merge to main and push.
