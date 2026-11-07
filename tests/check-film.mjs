import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const base=new URL('../',import.meta.url);
execFileSync(process.execPath,[new URL('../scripts/build-film-data.mjs',import.meta.url).pathname,'--check'],{stdio:'inherit'});
const {default:DATA}=await import('../films/clinker-drive/drive-data.mjs');
assert.ok(Math.abs(DATA.gearRatio*DATA.drivenPitchRadius/DATA.driverPitchRadius-DATA.modelTotalRatio)<1e-9);
assert.ok(Math.abs(DATA.plantIdealRatio/DATA.modelTotalRatio-DATA.unresolvedFactor)<1e-9);
assert.ok(DATA.unresolvedFactor>8&&DATA.unresolvedFactor<8.3);
const scene=readFileSync(new URL('../films/clinker-drive/scene.js',import.meta.url),'utf8');
for(const token of ['GLTFLoader','/drive.glb','F.shots','F.animate','F.score','couplingGuard.visible','AS-BUILT UNKNOWN'])assert.ok(scene.includes(token),`Missing film feature ${token}`);
assert.ok(!scene.includes('32.78:1 reference')||scene.includes('not the 32.78:1 reference'));
const glb=new URL('../films/clinker-drive/drive.glb',import.meta.url);
if(existsSync(glb)){
 const b=readFileSync(glb);assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);
 assert.equal(b.readUInt32LE(8),b.length);const n=b.readUInt32LE(12);
 const json=JSON.parse(b.subarray(20,20+n).toString());
 for(const name of ['motor_rotor','coupling_spin','gearbox_input_X','gearbox_output_rotation_Z','head_drum_rotation_Z'])assert.ok(json.nodes.some(x=>x.name===name),`Export lost ${name}`);
 assert.ok(json.meshes.length>=300,'Unexpectedly incomplete viewer export');
}
console.log('Film numerics, shot/source linkage and optional GLB structure OK');
