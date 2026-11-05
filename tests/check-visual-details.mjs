import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
// The new details must remain source-generated so GLB export retains them.
for(const snippet of ['TX.castNormal=grainNormal(89,.22)', 'TX.rubberNormal=grainNormal(107,.38)', "g.fillText('CONCEPT STUDY  /  NOT RATED'", "plate.name='motor_reference_nameplate'", 'endBolts.push({g:cylX(.009,.009,6)', 'M3(s,merge(endBolts),M(\'steel\'))']) {
 assert.ok(html.includes(snippet),`Missing detail: ${snippet}`);
}
assert.equal((html.match(/endBolts\.push/g)||[]).length,1);
assert.match(html,/if\(key==='rubber'\)\{P\.normalMap=TX\.rubberNormal/);
assert.match(html,/if\(d\.map==='cast'\|\|key==='paint'\|\|key==='motor'\)\{P\.normalMap=TX\.castNormal/);
console.log('Procedural surface relief, concept nameplate, and exposed end-plate bolts validated.');
