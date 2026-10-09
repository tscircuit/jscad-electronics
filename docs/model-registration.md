# Adding a model renderer

`@tscircuit/modelprinter` owns model strings, schemas, normalization, and default
dimensions. Open the parameter contract PR there, then use its schema and props
in this repository. Link the paired modelprinter PR in the renderer PR body;
there is no need to publish the contract or change a dependency pin first.
jscad-electronics owns meshes, components,
materials, and geometry snapshots; do not duplicate the parser or dimensions.

## Model folder

Use the compact, lowercase modelprinter name as the folder name under
`lib/models/<name>/`.

| File | Responsibility |
| --- | --- |
| `<ComponentName>.tsx` | React component and any existing public geometry factories. |
| `mesh.ts` | Indexed mesh construction, when the model has a mesh factory. |
| `index.ts` | The model's public components, factories, and types. |
| `register.tsx` | Typed model descriptor and registration function. |
| `vanilla.ts` | Optional replacement public barrel for the vanilla entrypoint. |

Existing renderers retain their source entrypoints for compatibility. Their
model-folder barrels may re-export those components rather than move geometry.
Shared geometry helpers remain outside the model folders.

For example, `lib/models/hexbolt/register.tsx` registers the imported contract:

```tsx
import { hexBoltModelDefinitionSchema } from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  type ModelRendererRegistry,
} from "../../model-registry"
import { HexBolt } from "./HexBolt"

export const model = defineModelRenderer({
  name: "hexbolt",
  schema: hexBoltModelDefinitionSchema,
  render: ({ fn, ...props }) => <HexBolt {...props} />,
  pads: "none",
})

export function register(registry: ModelRendererRegistry): void {
  registry.register(model)
}
```

The descriptor's literal `name` selects one member of modelprinter's
`ModelDefinition` union. Its schema output and render callback must use that same
member. Duplicate names and names containing anything other than lowercase
letters are rejected at registration. Keep `model` and `register` in
`register.tsx`; do not export those generic names through the public barrel.

`Footprinter3d` parses and validates the string through modelprinter before
calling the registered renderer. The callback receives that normalized
definition without another schema parse. A modelprinter model with no renderer
continues through the existing footprint rendering path.

Set `pads: "none"` for mechanical models. `ExtrudedPads` validates those strings
and returns no copper pads. Set `pads: "footprinter"` when the existing footprint
pad behavior should apply, as it does for FlexScreen. Explicit circuit JSON
continues to select its supplied pads and plated holes.

## Public exports and generated registration

The generator discovers immediate `lib/models/*/register.tsx` or `register.ts`
files. It writes ignored static TypeScript modules under `lib/generated/` for registration and
the public main and vanilla barrels. Do not edit generated files or add central
model lists, component dispatch cases, or pad-exclusion lists.

Each `index.ts` supplies the main public API. Vanilla uses the same barrel unless
the folder has `vanilla.ts`, in which case that file supplies the vanilla public
API. An empty `export {}` barrel preserves a model's main-only visibility:
FlexScreen is exported from `jscad-electronics`, while its model strings still
render through `jscad-electronics/vanilla`. The seven mechanical model families
are exported from both entrypoints. The cables entrypoint remains separate.

Registration modules use static imports; the published package does not scan
directories or need Bun at runtime. The generator uses `Bun.Glob` when run with
Bun and Node filesystem directory reads when run with Node. It deterministically sorts
the model folders. No discovered registration adapters is an error. Generated
files are only replaced when their content changes.

## Commands and watch workflow

### Contract builds without shared dependency edits

New model PRs must not bump package versions or edit the modelprinter dependency.
The checked-in `latest` development dependency is only an installation bootstrap.
The contract preparation step replaces it with a local build of current
modelprinter `main`, plus the renderer's paired contract PR when one is selected.
It merges the contract into main rather than replacing main with a preview, so
already accepted models remain available. Genuine source conflicts stop the
build instead of choosing one contract arbitrarily.

GitHub Actions reads the paired PR link from `GITHUB_EVENT_PATH`, for example:

```text
Consumes https://github.com/tscircuit/modelprinter/pull/123
```

Only one modelprinter PR link is allowed unless `MODELPRINTER_PR` explicitly
selects the pair. Editing the link reruns PR checks and the package preview.
If the contract PR gains commits, rerun the renderer checks and update snapshots
against that contract before accepting the pair. Locally, use Bun and Git:

```sh
MODELPRINTER_PR=123 bun install
MODELPRINTER_PR=123 bun run typecheck
MODELPRINTER_PR=123 bun test
MODELPRINTER_PR=123 bun run build
```

Keep that environment variable set while working on an unmerged contract. With
no pair, the build uses modelprinter main. `MODELPRINTER_REF=<full-commit-sha>`
selects an exact contract commit instead of a PR. Each preparation records the
resolved main SHA, paired SHA and merged source tree in ignored
`.model-contracts/`. Subsequent commands reuse that input, including offline;
`bun run contracts:refresh` fetches updated main and PR heads. A new install also
refreshes it. Preparation failures never fall back to the npm bootstrap package.
To reproduce recorded contract inputs, set `MODELPRINTER_MAIN_REF` to the recorded
main SHA and `MODELPRINTER_REF` to the paired SHA (omit the latter for main-only builds).

Published JavaScript and declarations include the tested modelprinter contracts.
Consumers do not resolve `latest`, need a PR preview URL, or wait for a separate
modelprinter npm release. `dist/model-contracts.json` records the exact source
SHAs used by each published build. Release automation owns package version bumps;
individual model contributors only add their model files, tests and snapshots.

| Command | Behavior |
| --- | --- |
| `npm run generate` | Refresh the generated registration and public barrels. |
| `npm run generate:watch` | Watch the model tree, including added and removed folders. |
| `bun run contracts:prepare` | Reuse or prepare the selected exact contract source. |
| `bun run contracts:refresh` | Refresh modelprinter main and the selected paired PR. |
| `npm run build` | Generate and build all three package entrypoints. |
| `npm run typecheck` | Generate before TypeScript checks. |
| `npm run format` / `npm run format:check` | Generate before formatting. |
| `npm start` / `npm run dev` | Generate, watch model folders, and start the Cosmos preview. |

The same package scripts work with Bun. Bare `bun test` prepares contracts and
refreshes generated files through its test preload. The tsup configuration also
awaits contract preparation and generation, including direct tsup builds. Source
installation and builds require Node 24, Git and Bun; the contract checkout uses
modelprinter's own build commands. Published consumers import the already built
package and need none of those build tools:

```ts
import { HexBolt, type HexBoltProps } from "jscad-electronics"
import {
  getJscadModelForFootprint,
  createHexBoltMesh,
} from "jscad-electronics/vanilla"
```

During development, keep `npm run generate:watch` in one terminal and the
existing test or preview watcher in another. Watch generation changes only
generated imports and barrels; geometry and component behavior stay in the
model's own source files.

## Verification

Keep geometry tests, render-routing tests, and visual snapshots here. Check
React and vanilla rendering, pads, validation failures, indexed mesh topology,
and the model's datum and dimensions. Preserve existing public names and source
entrypoints when adapting an existing renderer. Visual snapshots should show
the complete model in four views and label its full modelprinter string.

Before distribution, verify the built declarations and ordinary package
imports from all affected entrypoints. The 3D viewer uses synchronous vanilla
rendering and `convertCSGToThreeGeom`; modelcdn uses vanilla output for GLTF and
STEP conversion. Neither needs generation or a Bun runtime when importing the
published package.
