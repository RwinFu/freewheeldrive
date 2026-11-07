# Tooling and MCP boundary

The current workflow is intentionally a Skill plus deterministic scripts and templates. That is the lowest-complexity reusable solution when Codex can edit the project files, run the build, and inspect the local page.

## Prefer an agent-first CLI core before MCP

When a project contains `scene-tools/cli.ts` and a `scene:tool` package script, use it as the machine interface before adding an MCP server. A useful command surface is:

```text
schema
describe --scene <path>
list --scene <path> [--tag/--zone/--class]
get --scene <path> --id <stable-id>
validate --scene <path> [--focus <stable-id>] [--strict]
qa-plan --scene <path>
preview-transform --scene <path> --id <stable-id> --expected-revision <n> ...
preview-show --preview-id <id>
commit --preview-id <id> --expected-revision <n>
cancel --preview-id <id>
```

Run through `npm run --silent scene:tool -- ...` so stdout is one predictable JSON envelope. Require the core to reject workspace path escape, use stable object IDs, return OBB/BVH collision evidence and named support contacts, check sampled swept motion, persist previews outside source control, and recompute validation at commit time instead of trusting stored pass fields.

The human editor and agent CLI should share one `SceneDocument`, prefab registry, collision policy and revision store. A visual tree or transform gizmo is an optional second interface, not a separate source of truth.

## Require a live binding adapter

A file validator is not enough once an R3F/Three.js page mounts. Add a browser-safe binding audit between `SceneDocument` and live assembly roots. For every prefab-backed object, require exactly one match and compare:

- `Object3D.name` and `userData.sceneObjectId` with the stable document ID;
- runtime prefab ID with `prefabId`;
- nearest prefab-backed runtime ancestor with the document ancestor chain;
- effective visibility through all runtime/document ancestors;
- root-relative world matrix with the document graph matrix.

Also keep a pure prefab manifest and test that the active document's prefab-ID set equals the renderer registry's supported set. Parse the document with the full schema in CLI/tests; the browser adapter may use a lightweight structural assertion to avoid bundling the validator, but it must at least reject an unsupported schema, missing stable IDs, and duplicate IDs before building lookup maps.

Do not auto-tag every visible mesh with random runtime UUIDs before measuring coverage. Register assembly roots with stable document-owned tags, allow deliberate inheritance for the coverage denominator, tag critical child geometry directly, and explicitly opt weather particles/debug helpers out. Add subject contracts for non-trivial visual envelopes so a declared collider cannot under-cover scaled or rotated prefab parts while still passing file validation.

## Keep it as a Skill when

- scene truth lives in typed project files;
- each task works on one repository or local directory;
- validation can run as a script;
- browser QA is orchestrated by the agent;
- edits should remain reviewable source changes;
- there is no separate long-running 3D authoring process.

This is the default. Do not build an MCP server merely to wrap filesystem reads or shell commands.

## Reuse a read-only source index when it already exists

A repository-local read-only MCP can be useful for mining a large component gallery even when scene mutation does not justify MCP. Treat it as a discovery/index layer, not as the authority over source files.

The audited ThreeUI project provides a local stdio source server with tools equivalent to:

- search component metadata;
- get one component and its variants/runtime fields;
- list the source manifest for a component;
- read one indexed source file;
- retrieve the component's educational technique note.

Use this kind of server to map catalog entry → source closure quickly. Then verify implementation facts against the pinned repository revision, especially when a generated manifest omits helper files or a technique note contains a simplified count. If the server is not registered in the current client, direct `rg`/file reads are sufficient; restarting or reconfiguring another client is not a prerequisite for the modeling task.

Keep the source index read-only, root-scoped and free of entitlement/network dependencies. It does not replace the live scene binding adapter, target-version shader smoke tests or browser QA described elsewhere in this workflow.

## Promote to MCP when

An MCP becomes justified when at least one of these is true:

- a live browser/engine/editor owns scene state that cannot be represented safely by file edits alone;
- users need an interactive transform gizmo and preview/commit transaction model;
- several clients need the same scene inventory, validation, camera captures, or asset database;
- the workflow must inspect a running WebGL scene graph, GPU metrics, or loaded GLTF resources semantically;
- scene revisions and QA evidence need persistent server-managed history;
- a non-local engine or asset store exposes an API that should not be reimplemented per task.

## Suggested MCP capabilities

Start read-only. Add write tools only when a real editor workflow needs them.

### Read-only tools

- `scene_describe`: summarize axes, bounds, renderer, quality modes, and active config.
- `scene_list_objects`: return IDs, types, parents, transforms, bounds, tags, and support surfaces.
- `scene_validate`: combine deterministic config checks with runtime mesh closure/volume/winding, audit-tag coverage, contact points, expected axes, OBB collision, live semantic-detail counts, and visibility checks.
- `scene_get_object`: inspect one object assembly and material layers.
- `scene_get_qa_plan`: return required camera views, state matrix, correction/recheck policy and animation evidence.
- `scene_validate_qa_evidence`: prove capture-file existence, per-view checks, same-view/new-angle iterations and P0/P1 closure before a pass decision.
- `scene_capture_views`: capture named views from a running scene when browser/engine control is part of the server.

### Reversible mutation tools

- `scene_preview_transform`: apply a temporary transform and return validation deltas.
- `scene_cancel_preview`: restore the last committed state.
- `scene_set_quality` and `scene_set_mood`: temporary test-state controls.

### Persistent mutation tools

- `scene_commit_config`: write an already-previewed config revision.
- `scene_upsert_object`: create or update a config-owned object.
- `scene_remove_object`: delete one explicitly identified config object.
- `scene_export`: produce JSON, TS config, GLTF, or a QA evidence package when supported.

Persistent tools need exact project/scene scope and should not accept arbitrary code or unrestricted paths.

## Resources

Useful resource URIs:

```text
scene://active/config
scene://active/schema
scene://active/objects
scene://active/qa-plan
scene://active/qa/latest
scene://active/revisions
```

Resources should expose normalized semantic data rather than raw minified bundles.

## Transaction model

For placement edits:

```text
inspect → preview transform → validate → capture affected views → commit or cancel
```

Return both the proposed transform and derived effects: new AABB/OBB, every support-contact delta, intersecting zones, portal clearance, audit coverage changes, semantic-detail bindings, and changed QA views.

## Safety and determinism

- Scope the server to an explicit project root and scene ID.
- Reject `..`, absolute escape paths, arbitrary shell commands, and executable source payloads.
- Keep read tools side-effect free.
- Return repository revision and source path with source-index responses so mined facts remain attributable.
- Make previews reversible and session-scoped.
- Require an exact object ID and expected revision for persistent edits.
- Return structured issues with stable codes and levels.
- Separate validation from rendering so CI can run without a GPU.
- Do not let the MCP deploy or publish unless the user separately requests that action.

## Initial contract

[../assets/mcp-tool-contract.example.json](../assets/mcp-tool-contract.example.json) records a starter interface. Treat it as a design contract, not an installed server. Implement only the tools required by a real host/editor.
