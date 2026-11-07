import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as THREE from 'three';
import { createCanvas } from '@napi-rs/canvas';

const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const spec={module:{exports:{}}};runInNewContext(scripts[2],spec);
const mechanics={module:{exports:{}},FreewheelDriveSpec:spec.FreewheelDriveSpec};runInNewContext(scripts[3],mechanics);
const sceneScript=scripts.find(s=>s.includes('function createAssembly(T, renderer, scene) {'));
const begin=sceneScript.indexOf('function createAssembly(T, renderer, scene) {');
const end=sceneScript.indexOf('\nconst A=createAssembly(T,renderer,scene)',begin);
const scene=new THREE.Scene(),renderer={capabilities:{getMaxAnisotropy:()=>8},toneMappingExposure:1,shadowMap:{needsUpdate:false}};
const document={createElement(name){assert.equal(name,'canvas');return createCanvas(512,512);}};
const A=runInNewContext(sceneScript.slice(begin,end)+'\ncreateAssembly(T,renderer,scene)',{
 T:THREE,renderer,scene,document,FreewheelClutchGeometry:spec.module.exports,
 FreewheelDriveSpec:spec.FreewheelDriveSpec,FreewheelSway:mechanics.module.exports,console
});
const inspectorScript=scripts.find(s=>s.includes('global.FreewheelInspection=api'));
// Only the reflection-map renderer is replaced: node classification, clipping,
// focus, material restoration, and the entire inspection state logic run as shipped.
const withoutGpu=inspectorScript.replace(
 'const generator=new T.PMREMGenerator(renderer),env=generator.fromEquirectangular(texture);',
 'const generator={dispose(){}},env={texture:new T.Texture(),dispose(){}};');
assert.notEqual(withoutGpu,inspectorScript);
const sandbox={module:{exports:{}},document,T:THREE,console};runInNewContext(withoutGpu,sandbox);
const light=()=>{const o=new THREE.DirectionalLight();scene.add(o);return o;};
const floor=new THREE.Group();floor.visible=true;
const inspection=sandbox.module.exports.create(THREE,{assembly:A,scene,renderer,floor,key:light(),fill:light(),rim:light()});
const pump=A.nodes.coupling.getObjectByName('02_pump_wheel_motor_driven');
const turbine=A.nodes.coupling.getObjectByName('02_turbine_wheel_gearbox_driven');
const wheelMeshes=g=>{const meshes=[];g.traverse(o=>{if(o.isMesh)meshes.push(o);});return meshes;};
const originals=new Map([...wheelMeshes(pump),...wheelMeshes(turbine)].map(o=>[o,o.material]));
for(const part of A.parts.map(p=>p.id)){
 inspection.apply(part,{detail:false,colors:true});
 const audit=inspection.audit();
 assert.equal(audit.part,part);assert.ok(audit.visibleMeshCount>0,`${part}: empty inside view`);
 assert.ok(audit.focusBounds?.flat().every(Number.isFinite),`${part}: invalid camera focus`);
 const roles=new Set(audit.roles.map(r=>r.role));
 for(const r of audit.roles)assert.ok(r.label&&Number.isInteger(r.color),`${part}: unlabeled role ${r.role}`);
 inspection.apply(part,{detail:true,colors:false});
 assert.ok(inspection.audit().visibleMeshCount>0,`${part}: empty detail view`);
 assert.ok(inspection.focus().box.min.toArray().concat(inspection.focus().box.max.toArray()).every(Number.isFinite));
 if(part==='coupling'){
  for(const [role,group] of [['pump',pump],['turbine',turbine]]){
   assert.ok(roles.has(role));
   assert.ok(wheelMeshes(group).every(o=>o.visible&&inspection.role(o)===role),`${role} is hidden or mislabeled`);
  }
  assert.ok(inspection.audit().renderedMaterials.some(m=>m.role==='couplingShell'&&m.clippingPlanes>0),
   'inside view must cut the shell to reveal the wheels');
  const box=inspection.focus().box;
  for(const [role,group] of [['pump',pump],['turbine',turbine]]){
   const wheel=new THREE.Box3().setFromObject(group);
   assert.ok(box.containsBox(wheel),`detail camera cuts off the ${role} wheel`);
  }
 }
}
inspection.disable();
assert.equal(floor.visible,true);
for(const [mesh,material] of originals)assert.equal(mesh.material,material,'inside view leaked into assembly');
console.log('Inspected 12 overview/detail views, coupling wheels and shell section, camera focus, and material restoration.');
