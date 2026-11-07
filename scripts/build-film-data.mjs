import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const ctx={module:{exports:{}}};runInNewContext(scripts[2],ctx);
const {model,plant}=ctx.FreewheelDriveSpec;
const data={gearRatio:model.gearRatio,driverPitchRadius:model.driverPitchRadius,
 drivenPitchRadius:model.drivenPitchRadius,visualInputOmega:model.visualInputOmega,
 modelTotalRatio:model.totalRatio,plantIdealRatio:plant.totalRatio,
 unresolvedFactor:plant.unresolvedRatioFactor};
const destination=new URL('../films/clinker-drive/drive-data.mjs',import.meta.url);
const contents='// Generated from the viewer via node scripts/build-film-data.mjs. Do not edit.\n'+
 `export default Object.freeze(${JSON.stringify(data,null,2)});\n`;
if(process.argv.includes('--check')){
 if(readFileSync(destination,'utf8')!==contents)throw new Error('Film numbers differ from viewer: run node scripts/build-film-data.mjs');
}else writeFileSync(destination,contents);
console.log('Film numerical source matches viewer.');
