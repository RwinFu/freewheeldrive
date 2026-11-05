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
const script=scripts.find(s=>s.includes('function createAssembly(T, renderer, scene) {'));
const begin=script.indexOf('function createAssembly(T, renderer, scene) {');
const end=script.indexOf('\nconst A=createAssembly(T,renderer,scene)',begin);
assert.ok(begin>=0&&end>begin,'could not isolate scene constructor');
const canvasDoc={createElement(name){assert.equal(name,'canvas');return createCanvas(512,512);},getElementById:()=>null};
const assembly=runInNewContext(script.slice(begin,end)+'\ncreateAssembly(T,renderer,scene)',{
 T:THREE,renderer:{capabilities:{getMaxAnisotropy:()=>8}},scene:new THREE.Scene(),
 document:canvasDoc,FreewheelClutchGeometry:clutchGeometry,console
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
console.log(`Built ${assembly.parts.length} components / ${assembly.meshes.length} meshes; checked drive, lock and runback poses.`);
