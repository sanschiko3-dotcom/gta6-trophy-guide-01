[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sanschiko3-dotcom/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sanschiko3-dotcom/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger

A local GTA VI trophy field guide for PlayStation 5, with a persistent checklist, protected story spoilers, sourced guides, progress import/export and a three-stage platinum roadmap.

Run `node serve.ts` and open localhost:8080. Any static server serving app/ also works. No build, external assets, fonts or runtime internet connection is needed. Progress lives in this browser; export a backup before changing devices. Use `?sample=1` to try twelve earned trophies, then clear progress to begin.

The list contains 55 trophies: 1 platinum, 2 gold, 6 silver and 46 bronze. Allow roughly 200 hours. Positive Mental Attitude is the single missable: protect a Chapter 1 save and complete Lucia’s balcony meditation. The exact balcony requirement is still being confirmed; do it anyway. There is no mission replay.

Sources are linked individually inside each trophy guide: [Exophase](https://www.exophase.com/), [PSNProfiles](https://psnprofiles.com/), [OutputLag](https://outputlag.com/guides/gta-6-trophy-list/) and [Keengamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/). Unconfirmed triggers are identified in the guides. The interface contains no official artwork.

Run `MAKEFUN_OUTPUT_DIR=/tmp/leonida-output node main.ts` to validate the list and produce the static app, screenshots and deterministic dossier.
