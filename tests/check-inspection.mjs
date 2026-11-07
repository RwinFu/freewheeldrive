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
// Execute the viewer's own camera-fit calculation, not a replacement formula.
const fitStart=sceneScript.indexOf('function fitDistance(box,c){');
const fitEnd=sceneScript.indexOf('\nfunction updateCameraTargets()',fitStart);
assert.ok(fitStart>0&&fitEnd>fitStart);
const fitCode=sceneScript.slice(fitStart,fitEnd);
function checkFraming(part,detail,width,height){
 const viewW=width,viewH=height,rect={x:16,y:100,w:width-32,h:height-200};
 const camera=new THREE.PerspectiveCamera(37,width/height,.002,150);
 const center=inspection.focus().box.getCenter(new THREE.Vector3());
 const [az,el]=inspection.preset();
 const cam={taz:az,tel:el};
 const ctx={T:THREE,PI:Math.PI,cam,S:{inside:true},camera,viewW,viewH,
  inspector:inspection,inspectionRect:()=>rect,compactCard:()=>width<760,
  dir:new THREE.Vector3(),right:new THREE.Vector3(),up:new THREE.Vector3(),corner:new THREE.Vector3(),
  clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
 const distance=runInNewContext(fitCode+';fitDistance(inspector.focus().box,c)',{...ctx,c:center});
 camera.position.copy(center).add(new THREE.Vector3(Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el)).multiplyScalar(distance));
 camera.up.copy(inspection.up());camera.lookAt(center);
 camera.setViewOffset(width,height,0,height/2-(rect.y+rect.h/2),width,height);
 camera.updateMatrixWorld();camera.updateProjectionMatrix();
 for(const p of inspection.focus().corners){
  const projected=p.clone().project(camera),x=(projected.x*.5+.5)*width,y=(-projected.y*.5+.5)*height;
  assert.ok(projected.z<1&&projected.z>-1&&x>=rect.x-2&&x<=rect.x+rect.w+2&&
   y>=rect.y-2&&y<=rect.y+rect.h+2,`${part} ${detail?'detail':'overview'} ${width}x${height}: focus clipped`);
 }
}

const presetStart=sceneScript.indexOf('function viewPreset(v){');
const presetEnd=sceneScript.indexOf("\nfor(const b of document.querySelectorAll('[data-view]')",presetStart);
assert.ok(presetStart>0&&presetEnd>presetStart);
const presetCode=sceneScript.slice(presetStart,presetEnd);
const preset=v=>runInNewContext(presetCode+';viewPreset(v)',{v,PI:Math.PI,HOME:{az:-.62,el:.29}});
assert.equal(preset('iso').fov,37);
assert.equal(preset('hero').fov,30);
assert.notEqual(preset('hero').az,preset('iso').az);
function checkAssemblyShot(name,width,height){
 const view=preset(name),box=new THREE.Box3();for(const part of A.parts)box.union(part.bounds);
 const c=box.getCenter(new THREE.Vector3()),camera=new THREE.PerspectiveCamera(view.fov,width/height,.025,150);
 const cam={taz:view.az,tel:view.el},ctx={T:THREE,PI:Math.PI,cam,S:{inside:false,sel:null},camera,viewW:width,viewH:height,
  inspector:inspection,inspectionRect:()=>({x:0,y:0,w:width,h:height}),compactCard:()=>false,
  dir:new THREE.Vector3(),right:new THREE.Vector3(),up:new THREE.Vector3(),corner:new THREE.Vector3(),
  clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
 const dist=runInNewContext(fitCode+';fitDistance(box,c)',{...ctx,box,c});
 camera.position.copy(c).add(new THREE.Vector3(Math.sin(view.az)*Math.cos(view.el),Math.sin(view.el),Math.cos(view.az)*Math.cos(view.el)).multiplyScalar(dist));
 camera.lookAt(c);camera.updateMatrixWorld();
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
  const q=new THREE.Vector3(x,y,z).project(camera);
  assert.ok(Math.abs(q.x)<1&&Math.abs(q.y)<1&&q.z<1&&q.z>-1,`${name} ${width}x${height}: assembly clipped`);
 }
}
for(const view of ['iso','hero'])for(const [w,h] of [[1280,800],[390,720]])checkAssemblyShot(view,w,h);
for(const part of A.parts.map(p=>p.id)){
 inspection.apply(part,{detail:false,colors:true});
 const audit=inspection.audit();
 assert.equal(audit.part,part);assert.ok(audit.visibleMeshCount>0,`${part}: empty inside view`);
 assert.ok(audit.focusBounds?.flat().every(Number.isFinite),`${part}: invalid camera focus`);
 checkFraming(part,false,1280,800);checkFraming(part,false,390,720);
 const roles=new Set(audit.roles.map(r=>r.role));
 for(const r of audit.roles)assert.ok(r.label&&Number.isInteger(r.color),`${part}: unlabeled role ${r.role}`);
 inspection.apply(part,{detail:true,colors:false});
 assert.ok(inspection.audit().visibleMeshCount>0,`${part}: empty detail view`);
 assert.ok(inspection.focus().box.min.toArray().concat(inspection.focus().box.max.toArray()).every(Number.isFinite));
 checkFraming(part,true,1280,800);checkFraming(part,true,390,720);
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
console.log('Inspected 12 overview/detail views at desktop/mobile projection, coupling wheels, section and material restoration.');
