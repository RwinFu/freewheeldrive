import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
// Probe the same scene against the shipping r128 and an isolated modern Three.js.
// This is NOT a browser-runtime migration or visual approval.
const THREE=await import(process.env.FW_THREE_MODERN==='1'?'three-modern':'three');
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
assert.equal(assembly.parts.length,12);
if(THREE.SRGBColorSpace)assert.equal(assembly.textures.wood.colorSpace,THREE.SRGBColorSpace,'color texture must carry sRGB metadata on modern Three');
assert.equal(new Set(assembly.parts.map(p=>p.id)).size,12);
assert.equal(assembly.audit().gearMesh.toothRatio,context.FreewheelDriveSpec.model.gearRatio);
assert.equal(assembly.audit().bearings.length,6);
const pump=assembly.nodes.coupling.getObjectByName('02_pump_wheel_motor_driven');
const turbine=assembly.nodes.coupling.getObjectByName('02_turbine_wheel_gearbox_driven');
assert.ok(pump&&turbine,'both fluid-coupling wheels must be inspectable');
const pumpBounds=new THREE.Box3().setFromObject(pump),turbineBounds=new THREE.Box3().setFromObject(turbine);
assert.ok(pumpBounds.max.x<turbineBounds.min.x,'pump and turbine must not mechanically touch');
assembly.animate({motorAngle:1.5,inputAngle:1,outputAngle:1/3,drumAngle:.25,
 conveyorTravel:.06,lock:0,backstopInstalled:true,phase:'drive',time:.25});
assert.ok(Math.abs(assembly.spin.motor.rotation.x+1.5)<1e-9);
assert.ok(Math.abs(assembly.spin.couplingTurbine.rotation.x+1)<1e-9);
assert.ok(Math.abs(assembly.spin.gbIn.rotation.x-assembly.spin.couplingTurbine.rotation.x)<1e-9);
// Coupling connection audit: each hub receives the intended shaft, but the
// opposed rotor plates never touch (or inherit one another's angular motion).
const partBox=name=>{
 const o=assembly.root.getObjectByName(name);
 assert.ok(o,`missing mechanical joint: ${name}`);
 return new THREE.Box3().setFromObject(o);
};
const inputHub=partBox('02_motor_input_hub'),outputHub=partBox('02_gearbox_output_hub');
const mdJoint=context.FreewheelDriveSpec.model;
assert.ok(assembly.root.getObjectByName('02_motor_axial_stop_study'));
assert.ok(assembly.root.getObjectByName('02_turbine_axial_stop_study'));
const minimumBore=name=>{
 const mesh=assembly.root.getObjectByName(name),a=mesh.geometry.getAttribute('position');
 let min=Infinity;
 for(let i=0;i<a.count;i++)min=Math.min(min,Math.hypot(a.getY(i),a.getZ(i)));
 return min;
};
assert.ok(Math.abs(minimumBore('02_motor_input_hub')-mdJoint.motorHubBoreRadius)<1e-6);
assert.ok(Math.abs(minimumBore('02_gearbox_output_hub')-mdJoint.turbineHubBoreRadius)<1e-6);
assert.ok(mdJoint.motorHubBoreRadius>mdJoint.motorShaftRadius);
assert.ok(mdJoint.turbineHubBoreRadius>mdJoint.gearboxInputShaftRadius);
for(const [name,bore] of [['02_motor_input_hub',mdJoint.motorHubBoreRadius],
 ['02_gearbox_output_hub',mdJoint.turbineHubBoreRadius]]){
 const hub=assembly.root.getObjectByName(name);hub.updateWorldMatrix(true,false);
 const probe=(y)=>{
  const origin=new THREE.Vector3(-.3,y,0).applyMatrix4(hub.matrixWorld);
  const dir=new THREE.Vector3(1,0,0).transformDirection(hub.matrixWorld);
  return new THREE.Raycaster(origin,dir,0,.6).intersectObject(hub,false).length;
 };
 assert.equal(probe(0),0,`${name}: hub is solid across the shaft bore`);
 assert.equal(probe(bore+.002),0,`${name}: key relief is obstructed`);
 assert.ok(probe(-bore-.004)>0,`${name}: missing annular hub wall`);
}


assert.ok(inputHub.intersectsBox(partBox('01_motor_output_shaft')),'motor shaft is disconnected from pump hub');
assert.ok(outputHub.intersectsBox(partBox('03_gearbox_input_shaft')),'turbine hub is disconnected from gearbox shaft');
for(const [key,hub,drive] of [
 ['01_motor_key_visual_study','02_motor_input_hub',assembly.spin.motor],
 ['03_gearbox_input_key_visual_study','02_gearbox_output_hub',assembly.spin.gbIn]
]){
 assert.ok(partBox(key).intersectsBox(partBox(hub)),`${key}: key misses its hub`);
 assert.ok(assembly.root.getObjectByName(key).parent===drive,`${key}: key is not shaft-driven`);
 const g=assembly.root.getObjectByName(hub).geometry,p=g.getAttribute('position');
 // The relieved notch is on the +Y side; its radial reach must clear the key.
 assert.ok([...Array(p.count).keys()].some(i=>p.getY(i)>.047&&Math.abs(p.getZ(i))<.009),
  `${hub}: no visible keyway relief`);
}

const pumpPlate=assembly.root.getObjectByName('02_pump_side_plate');
const turbinePlate=assembly.root.getObjectByName('02_turbine_side_plate');
assert.ok(!new THREE.Box3().setFromObject(pumpPlate).intersectsBox(new THREE.Box3().setFromObject(turbinePlate)),
 'opposing coupling plates physically collide');
for(const part of ['02_turbine_wheel_annular_web','02_turbine_side_plate','02_gearbox_output_hub']){
 const mesh=assembly.root.getObjectByName(part),pos=mesh.geometry.getAttribute('position');
 let minimum=Infinity;
 for(let i=0;i<pos.count;i++)minimum=Math.min(minimum,Math.hypot(pos.getY(i),pos.getZ(i)));
 assert.ok(minimum>=.0409,`${part} blocks the 40 mm-radius gearbox shaft`);
}
assert.ok(pumpPlate.parent===assembly.spin.coupling&&turbinePlate.parent===assembly.spin.couplingTurbine,
 'fluid gap was accidentally bridged by a rigid parent');
assert.ok(Math.abs(assembly.spin.coupling.rotation.x-assembly.spin.couplingTurbine.rotation.x)>.4,
 'pump and turbine must rotate independently at startup');


for(const bearing of assembly.audit().bearings.filter(b=>b.part==='drum')){
 assert.ok(Math.abs(bearing.bore-.09)<1e-9);
 assert.ok(Math.abs(bearing.overallHeight-.2005)<1e-9,'SKF H2 envelope');
 assert.ok(Math.abs(bearing.mountHoleDiameter-.027)<1e-9,'SKF N clearance');
 assert.ok(Math.abs(bearing.mountBoltDiameter-.022)<1e-9,'SKF catalog attachment bolt');
 assert.ok(bearing.mountBoltDiameter<bearing.mountHoleDiameter);
}

// Catalog-derived service features stay attached to existing parts; no fictitious train added.
const sight=assembly.nodes.coupling.getObjectByName('02_coupling_oil_sight_glass_catalog_study');
const vent=assembly.nodes.gearbox.getObjectByName('03_gearbox_breather_catalog_study');
const drain=assembly.nodes.gearbox.getObjectByName('03_gearbox_oil_drain_catalog_study');
for(const [label,part] of [['sight glass',sight],['breather',vent],['drain',drain]]){
 assert.ok(part,`missing ${label}`);
 const bounds=new THREE.Box3().setFromObject(part);
 assert.ok(!bounds.isEmpty(),`${label} has no geometry`);
 for(const value of [...bounds.min.toArray(),...bounds.max.toArray()])assert.ok(Number.isFinite(value));
}

const serviceStart=script.indexOf('const SERVICE_STUDIES=Object.freeze({');
const serviceEnd=script.indexOf('const driveSpec=',serviceStart);
assert.ok(serviceStart>0&&serviceEnd>serviceStart);
const service=runInNewContext(script.slice(serviceStart,serviceEnd)+';SERVICE_STUDIES');
for(const [part,entries] of Object.entries(service))for(const [en,fa,node] of entries){
 assert.ok(assembly.parts.some(p=>p.id===part));
 assert.ok(en&&fa&&assembly.root.getObjectByName(node),`missing bilingual service study: ${part}/${node}`);
}
// Service points must be distinguishable and fixed to their actual study part.
for(const name of ['02_coupling_oil_sight_glass_catalog_study','02_fill_plug_catalog_study',
 '02_fusible_plug_catalog_study_0','02_fusible_plug_catalog_study_1',
 '03_gearbox_breather_catalog_study','03_gearbox_oil_drain_catalog_study']){
 const o=assembly.root.getObjectByName(name);
 assert.ok(o,`missing service study ${name}`);
 assert.ok(!new THREE.Box3().setFromObject(o).isEmpty());
}
assert.equal(assembly.bearingUnits.length,6);
for(const b of assembly.bearingUnits){
 const nipple=b.station.getObjectByName(`${b.unitName}_grease_nipple_catalog_study`);
 assert.ok(nipple&&nipple.parent===b.station,`${b.unitName}: nipple must stay with fixed housing`);
 assert.ok(!new THREE.Box3().setFromObject(nipple).isEmpty());
}
const liners=assembly.root.getObjectByName('09_replaceable_impact_liners_concept');
assert.ok(liners&&liners.children.filter(o=>o.isMesh).length===3);
assert.ok(liners.children.every(o=>o.material.roughness>.5),'liner should read as worn matte steel, not polished shaft');
assert.ok(!assembly.root.getObjectByName('13_upper_infeed_transfer_deck'));
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
 assert.equal(assembly.spin.gbOut.rotation.x,assembly.spin.freewheel.rotation.x,
  'backstop and gearbox output must share a shaft angle');
 assert.equal(assembly.spin.gbOut.rotation.x,assembly.spin.pulley.rotation.x,
  'driver pulley must follow gearbox output, including runback');
 assert.ok(Math.abs(assembly.spin.drum.rotation.x+pose.drumAngle)<1e-10,
  'head drum must follow the driven belt ratio');
 assert.equal(assembly.spin.couplingTurbine.rotation.x,assembly.spin.gbIn.rotation.x,
  'gearbox input must follow turbine in every pose');

 for(const p of assembly.parts){assembly.nodes[p.id].updateWorldMatrix(true,true);assert.ok(assembly.nodes[p.id].matrixWorld.elements.every(Number.isFinite));}
}
// The retained fault is on the original carrying idler, not an invented upper conveyor.
const idler=assembly.root.getObjectByName('idler_center_roll_spin');
assert.ok(idler,'missing carrying idler');
const turn={inputAngle:3,outputAngle:1,drumAngle:.75,conveyorTravel:.15,lock:0,
 backstopInstalled:true,phase:'drive',time:1};
assembly.animate({...turn,idlerJam:false});
const beforeJam=idler.rotation.x;
assembly.animate({...turn,conveyorTravel:.30,idlerJam:true});
assert.equal(idler.rotation.x,beforeJam,'jammed idler rotated with the moving belt');
assembly.animate({...turn,conveyorTravel:.45,idlerJam:false});
assert.notEqual(idler.rotation.x,beforeJam,'released idler did not resume rolling');
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
console.log(`Three r${THREE.REVISION}: built ${assembly.parts.length} components / ${assembly.meshes.length} meshes; checked drive, lock, runback and belt misalignment.`);
