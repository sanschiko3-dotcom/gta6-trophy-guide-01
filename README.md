[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sanschiko3-dotcom/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sanschiko3-dotcom/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger v2 — audited trophy guides, grade words, 100% roadmap

Leonida Ledger is an offline-first guide and progress tracker for all 55 PlayStation 5 trophies in Grand Theft Auto VI. It pairs the published trophy names, descriptions, and grades with original, cited guidance, a three-stage completion route, and a locally saved checklist.

## What changed in v2

- Grade names appear as readable words throughout the list and detail view, alongside each trophy's kind and any verified target count.
- A visible audit strip summarizes the official list and its cross-checks. Progress is shown by grade and roadmap stage, with the next unearned trophy called out.
- Search, kind, grade, earned-state, and sort controls help narrow the list. Spoiler protection starts on and hides unearned story names and descriptions.
- Trophy detail panels include practical steps, visible source links, missable warnings, and notes where an unlock trigger remains unconfirmed.
- The roadmap gives chapter and mission anchors plus a 15-category 100% checklist. Progress stays in local storage and can be exported or imported as JSON.

## Run offline

Use Node.js 22 or another static HTTP server. From this directory, run:

```sh
node serve.ts
```

Then open <http://localhost:8080>. The page loads its styles, modules, and trophy data from this repository. It does not need a build step, external fonts, or runtime network access. A sample run is available at `/?sample=1`.

## Trophy facts

The published list has 55 trophies: 1 Platinum, 2 Gold, 6 Silver, and 46 Bronze. Twenty-eight are hidden until earned. Positive Mental Attitude is the sole missable trophy; protect its Chapter 1 meditation with a manual save. The estimated platinum route is about 200 hours, with no difficulty or online trophies.

The audit strip records the official names checked against Exophase and PSNProfiles, with the list cross-checked against OutputLag, Keengamer, and GTABase. Names, descriptions, and grades remain as published; guide details distinguish verified steps from methods whose exact trigger is still being confirmed.

## Sources

- [Exophase — PlayStation trophy list](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles — trophy list](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- [OutputLag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/)
- [Keengamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [GTABase — GTA 6 Trophies & Achievements Guide](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series)
- [gtasix.how — GTA 6 Trophies](https://gtasix.how/trophies/) and [GTAVibes — GTA 6 Trophy List](https://www.gtavibes.com/guides/gta-6-trophy-list-achievements)
