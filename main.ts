import {cpSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {buildDossier} from './vendor/makefun-frontend.ts';
const root=fileURLToPath(new URL('.',import.meta.url));
const list=JSON.parse(readFileSync(join(root,'app/data/trophies.json'),'utf8')).trophies;
if(list.length!==55||list.some(t=>!t.name||!t.guide?.trim()))throw Error('Expected 55 named trophies with nonblank guides');
if(new Set(list.map(t=>t.name)).size!==55)throw Error('Duplicate trophy names');
for(const [grade,count] of Object.entries({platinum:1,gold:2,silver:6,bronze:46}))if(list.filter(t=>t.grade===grade).length!==count)throw Error('Incorrect grade total: '+grade);
if(list.filter(t=>t.missable).length!==1)throw Error('Expected one missable trophy');
const out=process.env.MAKEFUN_OUTPUT_DIR??'/output';
mkdirSync(out,{recursive:true});
if(out===root)throw Error('Output must differ from the source repository');
for(const folder of ['app','screenshots']){rmSync(join(out,folder),{recursive:true,force:true});cpSync(join(root,folder),join(out,folder),{recursive:true});}
writeFileSync(join(out,'dossier.json'),buildDossier(out,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},app_max_files:993,app_max_bytes:50331648}));
