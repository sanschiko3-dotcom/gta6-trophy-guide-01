import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const trophyFile = join(here, 'app', 'data', 'trophies.json');
const trophyData = JSON.parse(readFileSync(trophyFile, 'utf8'));
const trophies = Array.isArray(trophyData) ? trophyData : trophyData.trophies;

function verifyTrophyGuides() {
  if (!Array.isArray(trophies) || trophies.length !== 55) {
    throw new Error(`Expected 55 trophies; found ${trophies?.length ?? 'no list'}.`);
  }

  const ids = new Set();
  const gradeCounts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const missing = [];
  let hiddenCount = 0;
  const missableIds = [];

  for (const trophy of trophies) {
    if (!Number.isInteger(trophy.id) || ids.has(trophy.id)) {
      throw new Error(`Trophy id is missing or duplicated: ${trophy.id}.`);
    }
    ids.add(trophy.id);
    if (Object.hasOwn(gradeCounts, trophy.grade)) gradeCounts[trophy.grade] += 1;
    if (trophy.hidden === true) hiddenCount += 1;
    if (trophy.missable === true) missableIds.push(trophy.id);
    const guideLength = typeof trophy.guide === 'string' ? trophy.guide.trim().length : 0;
    const sourceCount = Array.isArray(trophy.sources)
      ? trophy.sources.filter((source) => {
        if (typeof source.name !== 'string' || !source.name.trim()) return false;
        try {
          const url = new URL(source.url);
          return url.protocol === 'https:' || url.protocol === 'http:';
        } catch {
          return false;
        }
      }).length
      : 0;
    if (!trophy.name || !trophy.description || guideLength < 120 || sourceCount < 2) {
      missing.push(`${trophy.id}:${trophy.name || 'unnamed'}`);
    }
  }

  const expectedGrades = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  if (JSON.stringify(gradeCounts) !== JSON.stringify(expectedGrades)) {
    throw new Error(`Official grade counts changed: ${JSON.stringify(gradeCounts)}.`);
  }
  if (hiddenCount !== 28) throw new Error(`Expected 28 hidden trophies; found ${hiddenCount}.`);
  if (missableIds.length !== 1 || missableIds[0] !== 28) {
    throw new Error(`Expected only trophy 28 to be missable; found ${missableIds.join(', ')}.`);
  }
  if (missing.length) throw new Error(`Trophy guide checks failed: ${missing.join('; ')}.`);
}

verifyTrophyGuides();
mkdirSync(output, { recursive: true });
cpSync(join(here, 'app'), join(output, 'app'), { recursive: true });
mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(output, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(output, 'dossier.json'),
  buildDossier(output, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
