# Local Web 3D asset library

Paths and CLI commands below are relative to this skill's installation directory. Run them from that directory, or resolve the script path against `SKILL.md` before invoking it from another project.

Search this library before authoring any complex prop or reusable assembly. The
canonical catalog is:

```text
assets/local-web-3d-library/catalog.json
```

The R3F/Three.js source snapshot is under the adjacent `react-three-fiber/`
folder. It contains project-authored geometry and style code, not third-party
models or textures.

## Search first

Run from any directory:

```powershell
node scripts/local_asset_library.mjs list
node scripts/local_asset_library.mjs search bicycle
node scripts/local_asset_library.mjs search convenience-store
node scripts/local_asset_library.mjs show vending-machine-lit-v1
```

Search by object name, approved export, tag or suitable scene. Read the selected
entry before copying it. Only `status: approved` assets and their
`approvedExports` are reusable without a new repair pass.

Search asset metadata before macro/semantic blockout so proxies use credible
dimensions and pivots. Copy and instantiate the detailed source only after the
proxy layout/clearance gate passes. This is “search early, instantiate late,” not
“design an arbitrary layout and discover real asset sizes afterward.”

Source-mined patterns are not members of this approved catalog. Keep them in a
project candidate manifest shaped like
`../assets/hero-asset-pattern.kage-torii.example.json` and apply
[source-pattern-mining.md](source-pattern-mining.md) plus
[procedural-hero-assets.md](procedural-hero-assets.md). Promote only after the
target runtime, geometry/physical, surface, determinism, lifecycle and
performance gates pass. The catalog entry must then record its representation
class (`native-three-hero`, `traced-natural-hero`, `terrain-scatter`,
`billboard-2.5d` or `canvas-visual`) and must not overstate the physical or
camera contract of 2.5D/Canvas sources.

## Copy a minimal closure

```powershell
node scripts/local_asset_library.mjs copy bicycle-city-family-v1 --target=C:\path\to\project
node scripts/local_asset_library.mjs copy vending-machine-lit-v1 umbrella-rack-rainy-v1 --target=C:\path\to\project --destination=app/asset-library
```

The command copies only the selected asset's source closure and skips existing
files by default. Use `--overwrite=true` only after reviewing overlapping user
changes. Add only the approved exports to the consuming project's index; some
shared source files contain deferred exports that must not be adopted.

After copying:

1. preserve the assembly's local dimensions and meaningful part hierarchy;
2. place it through the consuming scene's typed configuration or SceneDocument;
3. adapt palette, labels, quality tier and support plane rather than recreating
   the object from primitive boxes;
4. retain or adapt support, axis and full visual-envelope contracts;
5. run typecheck and the affected support/collision/close-view checks;
6. record the local catalog asset ID and any modifications in the project asset
   manifest.

The detailed asset replaces a stable semantic proxy one-to-one. If its complete
rendered envelope exceeds the proxy, return to the layout gate; do not silently
scale, sink or clip it to preserve an invalid arrangement.

## Approved families

- seeded wind-reactive sakura trees and instanced petal fields;
- detailed electric rail car with cab, doors, bogies, lights and pantograph;
- laundromat washer, counter stool and outdoor AC unit;
- rainy-corner wet-road look preset with warm/cyan bounce and bounded planar reflection;
- city/commuter/delivery bicycles;
- two-leaf automatic sliding door with complete frames and motion contract;
- lit vending machines with modeled products and controls;
- folded umbrellas plus supported umbrella rack;
- dual waste-sorting bins;
- traffic cone and convex road mirror assemblies;
- stocked magazine/newspaper rack;
- lit hot-food warmer;
- checkout/POS counter, cold-service fixtures and coffee service station;
- backroom operations bay and entrance security gates;
- street-surface service kit;
- anime rainy-miniature material style.

The catalog deliberately excludes plain signs, simple pole lights, utility-pole
trunks and simple bollards. It also does not create a separate asset for every
cup, bottle, box or magazine cover; reuse the complete parent assembly or one or
two representative parametric product archetypes.

## Deferred assets

Do not reuse `RetailShelfAsset`, `RetailIslandAsset` or the current rain-surface
interaction as mature library assets. Their catalog entries document the
blocking layout, product-support, silhouette-density and causal-animation
defects. A future repair must satisfy the relevant retail or rain reference and
be reviewed before changing their status to approved.

## 本次 Hikari Mart 归档摘要

| 公共资产族 | 归档判断 | 说明 |
| --- | --- | --- |
| 双扇自动滑门 | 收录 | 两扇完整门叶、门框、玻璃、密封、把手、滚轮、轨道、传感器、门槛与开合契约 |
| 城市自行车 | 收录 | 三种车型，共享轮组/车架/传动/制动/货架/车篮等真实部件 |
| 自动贩卖机 | 收录 | 真实柜体、内部商品、玻璃、灯光、支付和取货结构 |
| 雨伞与雨伞架 | 收录 | 完整雨具和承托/排水结构，不拆成大量琐碎小资产 |
| 双分类垃圾桶 | 收录 | 桶体、盖、投口、铰链、标识和脚轮完整 |
| 路障锥、凸面镜 | 收录 | 具有反光、底座、镜片和安装结构；普通立柱不收录 |
| 杂志与杂志架 | 收录 | 作为完整陈列组件归档，不把每张封面单独建档 |
| 熟食保温箱 | 收录 | 玻璃柜、照明、控制、货层、食品与夹具作为一体 |
| 收银台/POS | 收录 | 柜体、电脑、键盘、扫描、支付、打印和台面物件完整 |
| 冷藏/冰柜、咖啡服务台 | 收录 | 跨零售与餐饮场景复用价值高 |
| 后场操作区、入口防盗门 | 收录 | 能补足库存、清洁、电气和入口运营逻辑 |
| 井盖/排水/路面修补包 | 收录 | 适用于多种街景，且构造成本高于普通路面装饰 |
| 当前货架与商品生成器 | 暂缓 | 动线、支撑、形态多样性和密度尚未达到公共资产标准 |
| 当前普通积水雨滴互动 | 暂缓 | 全局雨滴与积水撞击不是同一个事件系统 |
| 普通招牌、电线杆、立柱灯、防撞柱 | 不收录 | 重建成本低，维护公共资产的收益不足 |

## Sakura Rail 与 Rainy Rail Corner 新增归档

| 来源项目 | 公共资产 | 归档形式 |
| --- | --- | --- |
| Sakura Rail Diorama | 樱花树、樱花林 | 可配置 R3F 组件，支持 seed、花色和风动 |
| Sakura Rail Diorama | 樱花花瓣 | InstancedMesh 粒子系统，高/低质量数量档 |
| Sakura Rail Diorama | 樱岚线列车 | 静态高细节车厢组件；运动路径由使用场景负责 |
| Rainy Rail Corner | 洗衣房洗衣机 | 原生 Three.js Group 工厂，可单台或堆叠 |
| Rainy Rail Corner | 商铺吧台凳 | 木面、四腿、脚踏圈完整组合 |
| Rainy Rail Corner | 空调外机 | 柜体、风扇、叶片、支架和管口完整组合 |
| Rainy Rail Corner | 雨夜反射风格 | 程序化材质、区域反射光、平面反射与后处理 Preset |

雨夜街角效果并非硬件光线追踪。公共版本把它归档为 Look System：
PMREM 环境、暖/青 RectAreaLight、湿沥青 clearcoat、world-space 湿度破碎、
限频且防递归的平面 Reflector、局部灯光反射池、GTAO、Bloom、LUT、氛围
颗粒和微缩景深。原项目中来源/许可未完整登记的 HDR 与 PBR 二进制文件没有
复制到公共库；调用方可显式提供已授权 `hdrUrl`。

## 问题与 Skill 归因

- 入口被两个货架阻挡：既是执行时没有做平面动线审查，也说明旧 Skill
  只有笼统的“保留通道”要求，没有强制建模前的 footprint/circulation
  gate。现在已增加专门的零售布局门槛。
- 商品悬浮：旧 Skill 已要求“产品放在支撑面上”，因此主要是实现和运行时
  审计未覆盖每个小商品的缺陷；同时缺少“每个商品绑定 shelf deck ID”的明确
  数据契约。新零售参考已补上。
- 圆柱商品过多、货架过空且重复：旧 Skill 提到类别和变化，但不够可量化，
  实现也选择了最便捷的单一圆柱语法。现在要求类别化包装形态、占用率、facings、
  深度行数和间距分布。
- 积水中心僵硬雨滴：主要原因是架构上把 `RainField` 和 `RippleField` 作为两套
  独立循环；后者没有接收真实雨滴的 X/Z 和跨越水面时刻。旧 Skill 没有明确
  要求 source-event identity，因此既是 Skill 缺口也是实现捷径。新的雨水参考
  要求真实或配对雨滴与撞击共享位置、相位和出生时间。
