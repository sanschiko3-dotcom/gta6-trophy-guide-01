import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';
const root = fileURLToPath(new URL('.', import.meta.url));
function verifyTrophyLedger() {
 const { trophies } = JSON.parse(readFileSync(join(root,'app/data/trophies.json'),'utf8'));
 if(trophies.length!==55 || new Set(trophies.map(t=>t.id)).size!==55) throw Error('Expected 55 unique trophies');
 for(const [grade,total] of Object.entries({platinum:1,gold:2,silver:6,bronze:46})) if(trophies.filter(t=>t.grade===grade).length!==total) throw Error('Invalid grade: '+grade);
 if(trophies.filter(t=>t.hidden).length!==28) throw Error('Expected 28 hidden trophies');
 const missables=trophies.filter(t=>t.missable);
 if(missables.length!==1||missables[0].id!==28) throw Error('Incorrect missable identity');
 if(trophies.some(t=>t.sources?.some(s=>!s.name||!/^https:\/\//.test(s.url)))) throw Error('Source names and HTTPS links required');
 if(trophies.some(t=>!t.name||t.guide?.trim().length<120||!t.guide||t.sources?.length<2||!t.sources)) throw Error('Every trophy needs a substantive guide and two sources');
}
verifyTrophyLedger();
const output=process.env.MAKEFUN_OUTPUT_DIR??'/output';
mkdirSync(output,{recursive:true});
for(const directory of ['app','screenshots']) cpSync(join(root,directory),join(output,directory),{recursive:true});
writeFileSync(join(output,'dossier.json'),buildDossier(output,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},app_max_files:993,app_max_bytes:50331648}));
