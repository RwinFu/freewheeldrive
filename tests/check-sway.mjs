import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../freewheel-detailed.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const dom=new JSDOM(html,{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true});
try{
 const {window}=dom,doc=window.document,events=[];
 window.addEventListener('fw:sway',e=>events.push(e.detail));
 window.eval(scripts[2]); // Shared model/plant parameters.
 window.eval(scripts[3]); // Mechanics and shared switch geometry.
 window.eval(scripts.at(-1)); // Standalone educational instrument dialog.
 assert.equal(events.at(-1).latched,false);
 assert.match(doc.getElementById('isScaleRead').textContent,/NET — kg/);
 const set=(id,value)=>{const input=doc.getElementById(id);input.value=value;input.dispatchEvent(new window.Event('input',{bubbles:true}));};
 set('isCarry',50);
 assert.equal(events.at(-1).warning,true);
 assert.equal(events.at(-1).latched,false);
 set('isCarry',85);
 assert.equal(events.at(-1).latched,true);
 set('isCarry',0);
 assert.equal(events.at(-1).latched,true,'trip must stay latched until acknowledged');
 doc.getElementById('isReset').click();
 assert.equal(events.at(-1).latched,false);
 set('isPower','off');
 assert.equal(events.at(-1).failure,true);
 assert.equal(events.at(-1).latched,true);
 window.dispatchEvent(new window.Event('fw:reset-sway'));
 assert.deepEqual([events.at(-1).carry,events.at(-1).ret,events.at(-1).latched],[0,0,false]);
 console.log('Verified uncalibrated instrument startup, warning, latched trip, reset and power-loss transitions.');
}finally{dom.window.close();}
