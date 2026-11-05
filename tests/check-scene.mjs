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
const swayContext={module:{exports:{}}};
runInNewContext(scripts[3],swayContext);
const script=scripts.find(s=>s.includes('function createAssembly(T, renderer, scene) {'));
const begin=script.indexOf('function createAssembly(T, renderer, scene) {');
const end=script.indexOf('\nconst A=createAssembly(T,renderer,scene)',begin);
assert.ok(begin>=0&&end>begin,'could not isolate scene constructor');
const canvasDoc={createElement(name){assert.equal(name,'canvas');return createCanvas(512,512);},getElementById:()=>null};
const assembly=runInNewContext(script.slice(begin,end)+'\ncreateAssembly(T,renderer,scene)',{
 T:THREE,renderer:{capabilities:{getMaxAnisotropy:()=>8}},scene:new THREE.Scene(),
 document:canvasDoc,FreewheelClutchGeometry:clutchGeometry,FreewheelSway:swayContext.FreewheelSway,console
});
assert.equal(assembly.parts.length,12);
assert.equal(new Set(assembly.parts.map(p=>p.id)).size,12);
assert.equal(assembly.audit().gearMesh.toothRatio,3);
assert.equal(assembly.audit().bearings.length,6);
assert.ok(assembly.meshes.length>300);
for(const p of assembly.parts){
 assert.ok(assembly.nodes[p.id],`missing node: ${p.id}`);
 assert.ok(!p.bounds.isEmpty(),`empty component: ${p.id}`);
 for(const value of [...p.bounds.min.toArray(),...p.bounds.max.toArray()])assert.ok(Number.isFinite(value),`invalid bounds: ${p.id}`);
}
for(const pose of [
 {inputAngle:3,outputAngle:1,drumAngle:.238/.318,conveyorTravel:.238/.318*.249,lock:0,backstopInstalled:true,phase:'drive',time:1},
 {inputAngle:0,outputAngle:0,drumAngle:0,conveyorTravel:0,lock:1,backstopInstalled:true,phase:'locked',time:2},
 {inputAngle:-3,outputAngle:-1,drumAngle:-.238/.318,conveyorTravel:-.238/.318*.249,lock:0,backstopInstalled:false,phase:'runback',time:3}
]){
 assembly.animate(pose);
 const a=assembly.audit();
 assert.ok(Number.isFinite(a.clutch.rampGap));
 assert.ok(a.loads.every(load=>load.position.every(Number.isFinite)));
 for(const p of assembly.parts){assembly.nodes[p.id].updateWorldMatrix(true,true);assert.ok(assembly.nodes[p.id].matrixWorld.elements.every(Number.isFinite));}
}
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
