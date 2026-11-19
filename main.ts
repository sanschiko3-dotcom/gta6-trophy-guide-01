import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';
const root = fileURLToPath(new URL('.', import.meta.url));
const trophies = JSON.parse(readFileSync(join(root, 'app/data/trophies.json'), 'utf8')).trophies;
if (trophies.length !== 55 || trophies.some(t => !t.name || !t.guide?.trim())) throw Error('Expected 55 named trophies with guides');
for (const [grade, count] of Object.entries({platinum:1,gold:2,silver:6,bronze:46})) {
  if (trophies.filter(t => t.grade === grade).length !== count) throw Error('Invalid grade count: ' + grade);
}
if (trophies.filter(t => t.hidden).length !== 28) throw Error('Expected 28 hidden trophies');
if (trophies.filter(t => t.missable).length !== 1) throw Error('Expected one missable trophy');
if (!trophies.find(t => t.id === 28)?.missable || trophies.some(t => !t.sources?.length)) throw Error('Missing sources or incorrect missable identity');
if (new Set(trophies.map(t => t.id)).size !== 55) throw Error('Duplicate trophy IDs');
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(output, {recursive:true});
cpSync(join(root,'app'), join(output,'app'), {recursive:true});
cpSync(join(root,'screenshots'), join(output,'screenshots'), {recursive:true});
writeFileSync(join(output,'dossier.json'), buildDossier(output, {text_max_bytes:163840, screenshots:{max:4,max_bytes:262144}, app_max_files:993, app_max_bytes:50331648}));
