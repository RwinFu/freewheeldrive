// Source geometry is the actual viewer's exported GLB (not a vendor CAD model).
// The film engine is separate from the offline viewer: r160 is NOT loaded by the r128 viewer.
import { createFilm, THREE, fontsReady, smooth } from '/kit/film.js';
import { rbox, mesh } from '/kit/geo.js';
import { metal, plaster } from '/kit/mat.js';
import { captions } from '/kit/captions.js';
import { GLTFLoader } from '/kit/loaders/GLTFLoader.js';
import DATA from './drive-data.mjs';

await fontsReady('800 60px Hanken', '500 26px Hanken');
const loader = new GLTFLoader();
const asset = await loader.loadAsync('/drive.glb');
const F = createFilm({ dur: 7.2, fps: 24, look: 'clean', background: 0x080f13 });
const { scene } = F;
const drive = asset.scene;
const shell = drive.getObjectByName('coupling_fluid_shell');
const couplingGuard = drive.getObjectByName('coupling_ventilated_guard');
if(!shell||!couplingGuard)throw new Error('Exported GLB lacks coupling shell or guard');
shell.material=shell.material.clone();
drive.name = 'VIEWER_EXPORT_CONCEPT_NOT_AS_BUILT';
scene.add(drive);
// Film-only stage. No second conveyor, additional gear or manufacturer logo.
mesh(rbox(9,.09,7,.03), metal(0x4c605e,{rough:.7}), 0,-.13,0,{parent:scene});
mesh(new THREE.PlaneGeometry(18,9), plaster(0x52615e), 0,3,-3,{parent:scene,cast:false});
const sun=F.sun({dir:[-.63,.77,.36],center:[0,1.15,0],box:6,dist:12,power:3.1,radius:.018,color:0xffdfb7});
F.sky({center:[0,1,0],radius:5,power:.22});
F.env({top:0x0a151b,bottom:0x19201b,panels:[{pos:[-5,4,4],w:4,h:5,color:0xc6dce8,power:2.5},{pos:[5,3,2],w:3,h:4,color:0xffd7a3,power:2}]});
F.haze({density:.018,maxDist:14,floor:.004,g:.45});
F.dust({box:[[-2,.2,-1],[2,2.5,1.5]],n:200});

// A shot list: establishing whole station, fluid-coupling detail, then the output train.
// The camera moves are deliberate and avoid claiming plant-scale geometry.
const CUT={coupling:2.5,output:4.85};
F.shots([
 {at:0,mm:35,fstop:5.6,hand:.20,ease:'settle',
  from:{pos:[5.5,3.7,6.7],look:[.2,1.18,.15]},to:{pos:[4.8,3.3,5.9],look:[.2,1.13,.14]}},
 {at:CUT.coupling,mm:65,fstop:5.6,hand:.15,ease:'inOut',
  from:{pos:[-.48,1.28,2.7],look:[-.35,.72,.3]},to:{pos:[-.35,1.15,2.25],look:[-.38,.72,.3]}},
 {at:CUT.output,mm:45,fstop:5.6,hand:.16,ease:'settle',
  from:{pos:[3.9,2.65,4.4],look:[1.2,1.2,.65]},to:{pos:[3.35,2.35,3.8],look:[1.15,1.15,.7]}}
]);

const get = n=>drive.getObjectByName(n);
const rotors={motor:get('motor_rotor'),pump:get('coupling_spin'),turbine:get('02_turbine_wheel_gearbox_driven'),
 gbIn:get('gearbox_input_X'),gbOut:get('gearbox_output_rotation_Z'),pulley:get('driver_pulley_rotation_Z'),drum:get('head_drum_rotation_Z')};
for(const [name,node] of Object.entries(rotors))if(!node)throw new Error(`Exported viewer lacks ${name}`);
// Pure-time educational start-up. Motor-side pump leads turbine; output stage stays 3:1
// with the visible 238/318 pitch-radius belt reduction, not the 32.78:1 reference.
F.animate(t=>{
 const motorAngle=DATA.visualInputOmega*(t-(1-Math.exp(-5*t))/5);
 const turbineAngle=DATA.visualInputOmega*(t-(1-Math.exp(-3.2*t))/3.2);
 const output=turbineAngle/DATA.gearRatio;
 rotors.motor.rotation.x=-motorAngle;
 rotors.pump.rotation.x=-motorAngle;
 rotors.turbine.rotation.x=-turbineAngle;
 rotors.gbIn.rotation.x=-turbineAngle;
 rotors.gbOut.rotation.x=-output;
 rotors.pulley.rotation.x=-output;
 rotors.drum.rotation.x=-output*DATA.driverPitchRadius/DATA.drivenPitchRadius;
 const detail=t>=CUT.coupling&&t<CUT.output;
 couplingGuard.visible=!detail;
 shell.material.transparent=detail; shell.material.opacity=detail?.17:1;
 shell.material.depthWrite=!detail;
 sun.power=3.1*(.96+.04*smooth(0,.8,t));
});

captions(F,[
 {text:'CLINKER DRIVE · *CONCEPT* STUDY',start:.35,end:2.3,y:.13},
 {text:'MOTOR → PUMP  /  FLUID  /  TURBINE',start:2.7,end:4.7,y:.13},
 {text:`${DATA.modelTotalRatio.toFixed(3)}:1 SHOWN ≠ ${DATA.plantIdealRatio.toFixed(2)}:1 IDEAL`,start:5.02,end:6.30,y:.13},
 {text:`${DATA.unresolvedFactor.toFixed(2)}× UNRESOLVED · AS-BUILT UNKNOWN`,start:6.32,end:7.12,y:.13}
],{size:F.W*.038,maxW:.90,accent:'#d4b77a'});
F.score(sfx=>{
 sfx.roomTone(0,F.dur,{gain:.035});
 sfx.hum(0,F.dur,{gain:.022,f:84});
 sfx.pad(.2,F.dur,{gain:.038,cutoff:640});
 sfx.whoosh(CUT.coupling,{dur:.36,gain:.22});
 sfx.whoosh(CUT.output,{dur:.36,gain:.25});
 sfx.hit(CUT.output,{gain:.22,sub:52,dur:.75});
});
F.start();
