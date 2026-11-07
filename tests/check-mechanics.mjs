import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const context={module:{exports:{}}};
runInNewContext(scripts[2],context);
const clutchApi=context.module.exports,spec=context.FreewheelDriveSpec;
context.module={exports:{}};
runInNewContext(scripts[3],context);
const mechanicsApi=context.module.exports;
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
const clutch=clutchApi.create();
for(let i=0;i<=20;i++){
 const p=clutch.pose(i*clutch.config.releasedAngle/20);
 close(p.outerGap,0);close(p.noseContactError,0);
 assert.ok(p.springCompression>0&&p.springLength>0);
 assert.ok(p.rampGap>=-1e-9);
}
const m=spec.model;
const config={ratio:m.gearRatio,driverRadius:m.driverPitchRadius,drivenRadius:m.drivenPitchRadius,beltRadius:m.beltCenterRadius,rollbackLimit:clutch.config.releasedAngle};
const mechanics=mechanicsApi.create(config);
const advance=(seconds)=>{for(let i=0;i<seconds*60;i++)mechanics.advance(1/60,true,1)};
// Voith-style hydrodynamic coupling is not a rigid shaft: pump accelerates before turbine.
advance(.25);
let startup=mechanics.snapshot();
assert.ok(startup.motorOmega>startup.omega*config.ratio,'pump must lead turbine at start');
assert.ok(startup.motorAngle>startup.inputAngle,'pump must accumulate start-up slip');
close(startup.inputAngle,startup.outputAngle*config.ratio);

advance(2);
let d=mechanics.snapshot();assert.equal(d.phase,'drive');assert.ok(d.outputAngle>0);
close(d.drumAngle,d.outputAngle*config.driverRadius/config.drivenRadius);
close(d.conveyorTravel,d.drumAngle*config.beltRadius);
mechanics.setBackstop(true);advance(4);d=mechanics.snapshot();assert.equal(d.phase,'locked');
close(d.rollback,config.rollbackLimit);close(d.omega,0);
assert.ok(d.motorOmega>=0&&d.motorOmega<startup.motorOmega,'motor must coast down after power cut');
close(d.rollbackDistance,d.rollback*config.driverRadius/config.drivenRadius*config.beltRadius);
mechanics.setInstalled(false);advance(2);d=mechanics.snapshot();assert.equal(d.phase,'runback');
assert.ok(d.omega<0&&d.motorOmega>=0,'unpowered turbine may reverse without reversing the motor');assert.ok(d.rollback>config.rollbackLimit);
mechanics.setInstalled(true);advance(2);d=mechanics.snapshot();assert.equal(d.phase,'locked');close(d.rollback,config.rollbackLimit);
mechanics.setBackstop(false);advance(2);d=mechanics.snapshot();assert.equal(d.phase,'drive');assert.ok(d.omega>0);
mechanics.reset();d=mechanics.snapshot();close(d.outputAngle,0);close(d.conveyorTravel,0);
mechanics.setSlip(.20);advance(1);d=mechanics.snapshot();
close(d.conveyorTravel,d.drumAngle*config.beltRadius*.8,1e-5);
assert.throws(()=>mechanics.setSlip(1),/Invalid slip fraction/);
mechanics.reset();advance(1);d=mechanics.snapshot();
close(d.conveyorTravel,d.drumAngle*config.beltRadius,1e-5);
// Drum shell + lagging + belt half-thickness must meet the pulley path at both ends.
close(m.headShellRadius+m.headLaggingThickness+m.beltThickness/2,m.beltCenterRadius);
close(m.tailLaggedRadius+m.beltThickness/2,m.beltCenterRadius);
assert.match(html,/r\.rotation\.x=-motion\.conveyorTravel\/r\.userData\.contactRadius/);
assert.match(html,/rotor\.userData\.contactRadius=idRR/);
console.log('Clutch geometry at 21 poses, forward/lock/runback/reinstall/reset, and belt contacts validated.');
