import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as THREE from 'three';
import { createCanvas } from '@napi-rs/canvas';

const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const context={module:{exports:{}}};
runInNewContext(scripts[2],context);
const clutchGeometry=context.module.exports;
const swayContext={module:{exports:{}},FreewheelDriveSpec:context.FreewheelDriveSpec};
runInNewContext(scripts[3],swayContext);
const script=scripts.find(s=>s.includes('function createAssembly(T, renderer, scene) {'));
const begin=script.indexOf('function createAssembly(T, renderer, scene) {');
const end=script.indexOf('\nconst A=createAssembly(T,renderer,scene)',begin);
assert.ok(begin>=0&&end>begin,'could not isolate scene constructor');
const canvasDoc={createElement(name){assert.equal(name,'canvas');return createCanvas(512,512);},getElementById:()=>null};
const assembly=runInNewContext(script.slice(begin,end)+'\ncreateAssembly(T,renderer,scene)',{
 T:THREE,renderer:{capabilities:{getMaxAnisotropy:()=>8}},scene:new THREE.Scene(),
 document:canvasDoc,FreewheelClutchGeometry:clutchGeometry,FreewheelDriveSpec:context.FreewheelDriveSpec,FreewheelSway:swayContext.FreewheelSway,console
});
assert.equal(assembly.parts.length,13);
assert.ok(assembly.parts.some(p=>p.id==='feeder'));
assert.equal(assembly.feedRotor.length,2);
assert.ok(assembly.feeder.getObjectByName('13_bearing_seal_and_grease_point_tail_left'));
const feeding=new THREE.Box3().setFromObject(assembly.feeder);
assert.ok(feeding.max.y>assembly.audit().tail[1]+.7,'feeder should be a separate upper deck');
for(const end of ['tail','discharge']){
 const wrap=assembly.feeder.getObjectByName(`13_${end}_belt_wrap`);
 assert.ok(wrap,`missing ${end} belt wrap`);
 const bounds=new THREE.Box3().setFromObject(wrap);
 assert.ok(bounds.max.x-bounds.min.x>.08,'wrap must extend around drum in belt plane');
 assert.ok(bounds.max.z-bounds.min.z>.50,'wrap must span belt width along shaft');
 for(const side of ['left','right']){
  const leg=assembly.feeder.getObjectByName(`13_floor_support_${end}_${side}`);
  assert.ok(leg,`missing floor support ${end} ${side}`);
  const floor=new THREE.Box3().setFromObject(leg);
  assert.ok(floor.min.y>.02&&floor.min.y<.14,`support must reach floor: ${end} ${side}`);
 }
}
const feedBefore=assembly.feedMarker[0].position.x;
assembly.animateFeeder(.27,false);
assert.ok(Math.abs(assembly.feedRotor[0].rotation.x)>.2);
assert.notEqual(assembly.feedMarker[0].position.x,feedBefore);
assembly.animateFeeder(.27,true);
const held=assembly.feedRotor[0].rotation.x;
assembly.animateFeeder(.55,true);
assert.equal(assembly.feedRotor[0].rotation.x,held);

assert.equal(new Set(assembly.parts.map(p=>p.id)).size,13);
assert.equal(assembly.audit().gearMesh.toothRatio,context.FreewheelDriveSpec.model.gearRatio);
assert.equal(assembly.audit().bearings.length,6);
assert.ok(assembly.meshes.length>300);
assert.equal(assembly.guards.name,'00_REMOVABLE_DRIVE_GUARDS_NOT_CERTIFIED');
assert.ok(assembly.guards.getObjectByName('coupling_ventilated_guard'));
assert.ok(assembly.guards.getObjectByName('three_v_belt_mesh_guard'));
const cageBounds=new THREE.Box3().setFromObject(assembly.guards.getObjectByName('three_v_belt_mesh_guard'));
assert.ok(cageBounds.min.x<.3&&cageBounds.max.x>2.1);
assert.ok(cageBounds.min.y<.5&&cageBounds.max.y>2.2);
assert.ok(cageBounds.min.z<.9&&cageBounds.max.z>1.1);
const couplingBounds=new THREE.Box3().setFromObject(assembly.guards.getObjectByName('coupling_ventilated_guard'));
assert.ok(couplingBounds.min.x<-.3&&couplingBounds.max.x>.1);
const takeups=['left','right'].map(side=>assembly.transport.getObjectByName(`07_tail_screw_takeup_${side}`));
assert.ok(takeups.every(Boolean),'both named take-up assemblies must exist');
for(const unit of takeups){
 const box=new THREE.Box3().setFromObject(unit);
 assert.ok(box.max.x-box.min.x>.4,'take-up rail must span the tail bearing');
 assert.ok(box.max.y-box.min.y>.1,'take-up bracket must have vertical extent');
}
assert.ok(new THREE.Box3().setFromObject(takeups[0]).max.z < new THREE.Box3().setFromObject(takeups[1]).min.z);
assert.match(html,/Static screw take-up study at the tail/);
const guardBegin=script.indexOf('function updateVisibility(){');
const guardFn=script.slice(guardBegin,script.indexOf('function setPressed(',guardBegin));
assert.ok(guardFn.startsWith('function updateVisibility()'));
for(const [guards,inside,isolate,explode,visible] of [
 [true,false,false,0,true],[false,false,false,0,false],
 [true,true,false,0,false],[true,false,true,0,false],[true,false,false,.5,false]
]){
 runInNewContext(guardFn+';updateVisibility()',{
  A:assembly,PARTS:assembly.parts,S:{guards,inside,isolate,sel:'belt',noBackstop:false},expTarget:explode
 });
 assert.equal(assembly.guards.visible,visible,`wrong guard visibility for ${[guards,inside,isolate,explode]}`);
}
assembly.guards.visible=true;
for(const p of assembly.parts){
 assert.ok(assembly.nodes[p.id],`missing node: ${p.id}`);
 assert.ok(!p.bounds.isEmpty(),`empty component: ${p.id}`);
 for(const value of [...p.bounds.min.toArray(),...p.bounds.max.toArray()])assert.ok(Number.isFinite(value),`invalid bounds: ${p.id}`);
}
const md=context.FreewheelDriveSpec.model;
const drumTurn=md.beltRatio;
for(const pose of [
 {inputAngle:md.gearRatio,outputAngle:1,drumAngle:drumTurn,conveyorTravel:drumTurn*md.beltCenterRadius,lock:0,backstopInstalled:true,phase:'drive',time:1},
 {inputAngle:0,outputAngle:0,drumAngle:0,conveyorTravel:0,lock:1,backstopInstalled:true,phase:'locked',time:2},
 {inputAngle:-md.gearRatio,outputAngle:-1,drumAngle:-drumTurn,conveyorTravel:-drumTurn*md.beltCenterRadius,lock:0,backstopInstalled:false,phase:'runback',time:3}
]){
 assembly.animate(pose);
 const a=assembly.audit();
 assert.ok(Number.isFinite(a.clutch.rampGap));
 assert.ok(a.loads.every(load=>load.position.every(Number.isFinite)));
 for(const p of assembly.parts){assembly.nodes[p.id].updateWorldMatrix(true,true);assert.ok(assembly.nodes[p.id].matrixWorld.elements.every(Number.isFinite));}
}
// A stalled feeder must not continue pouring through the receiving chute.
assembly.animate({inputAngle:1,outputAngle:1,drumAngle:1,conveyorTravel:.4,lock:0,
 backstopInstalled:true,phase:'drive',time:1,feedHalted:true,feedStopTravel:.4});
const stream=assembly.transport.parent.getObjectByName('07c_loading_stream');
assert.ok(stream,'missing transfer stream');
assert.ok(stream.children.every(child=>!child.visible),'feed stopped but transfer stream still active');
assembly.animate({inputAngle:1,outputAngle:1,drumAngle:1,conveyorTravel:.4,lock:0,
 backstopInstalled:true,phase:'drive',time:1,feedHalted:false});
assert.ok(stream.children.some(child=>child.visible),'flow should resume with the feeder');
// The same displacement bends the belt and the switch lever; the input is not just a dialog readout.
const physics=swayContext.FreewheelSway;
assert.equal(physics.evaluate(0,0).warning,false);
assert.equal(physics.evaluate(50,0).warning,true);
assert.equal(physics.evaluate(85,0).trip,true);
assert.equal(physics.evaluate(0,0,false,true).trip,true);
assert.ok(physics.angle(85,1)<55*Math.PI/180+1e-9);
const belt=assembly.meshes.find(m=>m.material.name==='conveyor_belt');
assert.ok(belt,'missing conveyor belt');
const positions=belt.geometry.getAttribute('position');
const original=Float32Array.from(positions.array);
const upper=assembly.conveyorPath.pts.findIndex(p=>p.ny>.35&&p.y>.98&&Math.abs(p.x)<.5);
const lower=assembly.conveyorPath.pts.findIndex(p=>p.ny<-.35&&Math.abs(p.x)<.5);
assert.ok(upper>=0&&lower>=0);
assembly.setSwayVisual(80,-60,{warning:true});
assert.equal(assembly.audit().sway.carryMm,80);
assert.equal(assembly.audit().sway.returnMm,-60);
assert.ok(positions.array[upper*30+2]-original[upper*30+2]>.06);
assert.ok(positions.array[lower*30+2]-original[lower*30+2]<-.04);
assert.ok(assembly.instrumentation.levers.some(l=>Math.abs(l.group.rotation.x)>.2));
assembly.setSwayVisual(0,0,{warning:false});
for(const i of [upper*30+2,lower*30+2])assert.ok(Math.abs(positions.array[i]-original[i])<1e-6);
console.log(`Built ${assembly.parts.length} components / ${assembly.meshes.length} meshes; checked drive, lock, runback and belt misalignment.`);
