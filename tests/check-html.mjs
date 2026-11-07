import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../freewheel-detailed.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 9, 'unexpected inline script count');
for (const [index, script] of scripts.entries()) {
  new Script(script[1], { filename: `inline-script-${index}.js` });
}
const parts = html.slice(html.indexOf('const parts=['), html.indexOf('const LIB='));
const count = [...parts.matchAll(/^\{id:'[^']+',num:'/gm)].length;
assert.equal(count, 12, 'assembly part count changed; review labels and translations');
assert.match(html, /var navail = document\.querySelectorAll\('#rail button'\)\.length \|\| 12/);
assert.match(html, /k\('allParts', 'Complete assembly<small>\{n\} components/);
assert.match(html, /'مجموعهٔ کامل<small>\{n\} قطعه/);
assert.match(html, /r\[0\]==='123'\?/);
assert.match(html, /if\(\$\('help'\)\.open\|\|\$\('maker'\)\.open\|\|\$\('instPanel'\)\.open\)return/);
assert.match(html, /if\(panel\.open&&calibrated\)total\+=flow\*dt\/3600/);
assert.match(html, /A=d\*88\/90,A1=d\*54\/90,B=d\*89\/90,H=d\*101\.6\/90,H1=d\*33\/90,L=d\*327\/90,J=d\*262\/90,N=d\*27\/90/);
assert.equal((html.match(/ucpUnit\(n,s,'drum',[\d.\-]+,\.045,/g) || []).length, 3);
assert.match(html, /Model Ø484 mm · plant ref\. Ø800 mm/);
assert.doesNotMatch(parts, /id:'feeder'/);
assert.doesNotMatch(html, /13_upper_infeed_transfer_deck/);
// Ultra changes sampling cost while moving, but screenshots remain full-resolution.
assert.match(html,/function ultraMotionPixelRatio\(\).*1200000/);
assert.match(html,/if\(upscale\)\{renderer\.setPixelRatio\(ultraPixelRatio\(\)\)/);
assert.match(html,/if\(upscale\)\{renderer\.setPixelRatio\(ultraMotionPixelRatio\(\)\)/);
assert.match(html,/o\.name\.startsWith\('Ultra_'\)/);

console.log(`Validated ${scripts.length} scripts and ${count} assembly parts.`);
