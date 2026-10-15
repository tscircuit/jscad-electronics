import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { ModelRendererRegistry } from "../lib/model-registry"
import {
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import {
  createRigidPipeGeom,
  createRigidPipeMesh,
  RigidPipe,
} from "../lib/models/rigidpipe"
import { model as rigidPipeRenderer } from "../lib/models/rigidpipe/register"
import {
  createPipeElbowGeom,
  createPipeElbowMesh,
  PipeElbow,
} from "../lib/models/pipeelbow"
import { model as pipeElbowRenderer } from "../lib/models/pipeelbow/register"
import {
  createPipeTeeGeom,
  createPipeTeeMesh,
  PipeTee,
} from "../lib/models/pipetee"
import { model as pipeTeeRenderer } from "../lib/models/pipetee/register"
import {
  createPipeCrossGeom,
  createPipeCrossMesh,
  PipeCross,
} from "../lib/models/pipecross"
import { model as pipeCrossRenderer } from "../lib/models/pipecross/register"
import {
  createPipeCouplingGeom,
  createPipeCouplingMesh,
  PipeCoupling,
} from "../lib/models/pipecoupling"
import { model as pipeCouplingRenderer } from "../lib/models/pipecoupling/register"
import {
  createPipeUnionGeom,
  createPipeUnionMesh,
  PipeUnion,
} from "../lib/models/pipeunion"
import { model as pipeUnionRenderer } from "../lib/models/pipeunion/register"
import {
  createPipeNippleGeom,
  createPipeNippleMesh,
  PipeNipple,
} from "../lib/models/pipenipple"
import { model as pipeNippleRenderer } from "../lib/models/pipenipple/register"
import {
  createPipeCapGeom,
  createPipeCapMesh,
  PipeCap,
} from "../lib/models/pipecap"
import { model as pipeCapRenderer } from "../lib/models/pipecap/register"
import {
  createPipePlugGeom,
  createPipePlugMesh,
  PipePlug,
} from "../lib/models/pipeplug"
import { model as pipePlugRenderer } from "../lib/models/pipeplug/register"
import {
  createReducingBushingGeom,
  createReducingBushingMesh,
  ReducingBushing,
} from "../lib/models/reducingbushing"
import { model as reducingBushingRenderer } from "../lib/models/reducingbushing/register"
import {
  createHoseBarbGeom,
  createHoseBarbMesh,
  HoseBarb,
} from "../lib/models/hosebarb"
import { model as hoseBarbRenderer } from "../lib/models/hosebarb/register"
import {
  createBulkheadFittingGeom,
  createBulkheadFittingMesh,
  BulkheadFitting,
} from "../lib/models/bulkheadfitting"
import { model as bulkheadFittingRenderer } from "../lib/models/bulkheadfitting/register"
import {
  createPushConnectFittingGeom,
  createPushConnectFittingMesh,
  PushConnectFitting,
} from "../lib/models/pushconnectfitting"
import { model as pushConnectFittingRenderer } from "../lib/models/pushconnectfitting/register"
import {
  createCompressionFittingGeom,
  createCompressionFittingMesh,
  CompressionFitting,
} from "../lib/models/compressionfitting"
import { model as compressionFittingRenderer } from "../lib/models/compressionfitting/register"
import {
  createHoseClampGeom,
  createHoseClampMesh,
  HoseClamp,
} from "../lib/models/hoseclamp"
import { model as hoseClampRenderer } from "../lib/models/hoseclamp/register"
import {
  createPipeFlangeGeom,
  createPipeFlangeMesh,
  PipeFlange,
} from "../lib/models/pipeflange"
import { model as pipeFlangeRenderer } from "../lib/models/pipeflange/register"
import {
  createBallValveGeom,
  createBallValveMesh,
  BallValve,
} from "../lib/models/ballvalve"
import { model as ballValveRenderer } from "../lib/models/ballvalve/register"
import {
  createCheckValveGeom,
  createCheckValveMesh,
  CheckValve,
} from "../lib/models/checkvalve"
import { model as checkValveRenderer } from "../lib/models/checkvalve/register"
import {
  createNeedleValveGeom,
  createNeedleValveMesh,
  NeedleValve,
} from "../lib/models/needlevalve"
import { model as needleValveRenderer } from "../lib/models/needlevalve/register"
import {
  createManifoldGeom,
  createManifoldMesh,
  Manifold,
} from "../lib/models/manifold"
import { model as manifoldRenderer } from "../lib/models/manifold/register"

const cases = [
  {
    name: "rigidpipe",
    geom: () => createRigidPipeGeom({}),
    mesh: () => createRigidPipeMesh({}),
    scaled: () =>
      createRigidPipeGeom({ outerDiameter: 40, boreDiameter: 32, length: 200 }),
  },
  {
    name: "pipeelbow",
    geom: () => createPipeElbowGeom({}),
    mesh: () => createPipeElbowMesh({}),
    scaled: () =>
      createPipeElbowGeom({
        outerDiameter: 48,
        boreDiameter: 32,
        legLength: 72,
        socketDiameter: 56,
        socketLength: 20,
      }),
  },
  {
    name: "pipetee",
    geom: () => createPipeTeeGeom({}),
    mesh: () => createPipeTeeMesh({}),
    scaled: () =>
      createPipeTeeGeom({
        outerDiameter: 48,
        boreDiameter: 32,
        length: 140,
        branchLength: 70,
        socketDiameter: 56,
        socketLength: 20,
      }),
  },
  {
    name: "pipecross",
    geom: () => createPipeCrossGeom({}),
    mesh: () => createPipeCrossMesh({}),
    scaled: () =>
      createPipeCrossGeom({
        outerDiameter: 48,
        boreDiameter: 32,
        span: 140,
        socketDiameter: 56,
        socketLength: 20,
      }),
  },
  {
    name: "pipecoupling",
    geom: () => createPipeCouplingGeom({}),
    mesh: () => createPipeCouplingMesh({}),
    scaled: () =>
      createPipeCouplingGeom({
        outerDiameter: 60,
        boreDiameter: 32,
        socketDiameter: 40,
        length: 80,
        socketDepth: 28,
      }),
  },
  {
    name: "pipeunion",
    geom: () => createPipeUnionGeom({}),
    mesh: () => createPipeUnionMesh({}),
    scaled: () =>
      createPipeUnionGeom({
        outerDiameter: 60,
        boreDiameter: 32,
        length: 110,
        nutAcrossFlats: 72,
        nutLength: 40,
        endDiameter: 48,
      }),
  },
  {
    name: "pipenipple",
    geom: () => createPipeNippleGeom({}),
    mesh: () => createPipeNippleMesh({}),
    scaled: () =>
      createPipeNippleGeom({
        outerDiameter: 40,
        boreDiameter: 32,
        length: 100,
        threadLength: 24,
        shoulderDiameter: 44,
      }),
  },
  {
    name: "pipecap",
    geom: () => createPipeCapGeom({}),
    mesh: () => createPipeCapMesh({}),
    scaled: () =>
      createPipeCapGeom({
        outerDiameter: 60,
        socketDiameter: 40,
        length: 50,
        floorThickness: 8,
        hexAcrossFlats: 64,
      }),
  },
  {
    name: "pipeplug",
    geom: () => createPipePlugGeom({}),
    mesh: () => createPipePlugMesh({}),
    scaled: () =>
      createPipePlugGeom({
        diameter: 40,
        length: 40,
        headAcrossFlats: 52,
        headHeight: 16,
      }),
  },
  {
    name: "reducingbushing",
    geom: () => createReducingBushingGeom({}),
    mesh: () => createReducingBushingMesh({}),
    scaled: () =>
      createReducingBushingGeom({
        outerDiameter: 52,
        largeBoreDiameter: 36,
        smallBoreDiameter: 20,
        length: 60,
        hexAcrossFlats: 60,
        hexLength: 20,
      }),
  },
  {
    name: "hosebarb",
    geom: () => createHoseBarbGeom({}),
    mesh: () => createHoseBarbMesh({}),
    scaled: () =>
      createHoseBarbGeom({
        outerDiameter: 40,
        boreDiameter: 20,
        length: 90,
        barbDiameter: 32,
        barbLength: 50,
        barbPitch: 12,
        hexAcrossFlats: 48,
      }),
  },
  {
    name: "bulkheadfitting",
    geom: () => createBulkheadFittingGeom({}),
    mesh: () => createBulkheadFittingMesh({}),
    scaled: () =>
      createBulkheadFittingGeom({
        outerDiameter: 40,
        boreDiameter: 24,
        length: 110,
        flangeDiameter: 64,
        flangeThickness: 8,
        nutAcrossFlats: 56,
        nutThickness: 16,
        panelGap: 20,
      }),
  },
  {
    name: "pushconnectfitting",
    geom: () => createPushConnectFittingGeom({}),
    mesh: () => createPushConnectFittingMesh({}),
    scaled: () =>
      createPushConnectFittingGeom({
        outerDiameter: 52,
        boreDiameter: 16,
        length: 80,
        tubeDiameter: 24,
        colletDiameter: 40,
        colletLength: 12,
        hexAcrossFlats: 56,
      }),
  },
  {
    name: "compressionfitting",
    geom: () => createCompressionFittingGeom({}),
    mesh: () => createCompressionFittingMesh({}),
    scaled: () =>
      createCompressionFittingGeom({
        outerDiameter: 44,
        boreDiameter: 16,
        length: 80,
        tubeDiameter: 24,
        nutAcrossFlats: 52,
        nutLength: 20,
      }),
  },
  {
    name: "hoseclamp",
    geom: () => createHoseClampGeom({}),
    mesh: () => createHoseClampMesh({}),
    scaled: () =>
      createHoseClampGeom({
        innerDiameter: 60,
        bandThickness: 3.0,
        bandWidth: 16,
        housingLength: 28,
        housingWidth: 16,
        housingHeight: 14,
      }),
  },
  {
    name: "pipeflange",
    geom: () => createPipeFlangeGeom({}),
    mesh: () => createPipeFlangeMesh({}),
    scaled: () =>
      createPipeFlangeGeom({
        flangeDiameter: 140,
        boreDiameter: 32,
        hubDiameter: 60,
        flangeThickness: 16,
        hubLength: 40,
        boltCircleDiameter: 100,
        boltHoleDiameter: 12,
        boltCount: 4,
      }),
  },
  {
    name: "ballvalve",
    geom: () => createBallValveGeom({}),
    mesh: () => createBallValveMesh({}),
    scaled: () =>
      createBallValveGeom({
        outerDiameter: 60,
        boreDiameter: 32,
        length: 130,
        endDiameter: 48,
        handleLength: 110,
        handleWidth: 20,
        stemHeight: 28,
        handleThickness: 8,
      }),
  },
  {
    name: "checkvalve",
    geom: () => createCheckValveGeom({}),
    mesh: () => createCheckValveMesh({}),
    scaled: () =>
      createCheckValveGeom({
        outerDiameter: 56,
        boreDiameter: 24,
        length: 120,
        endDiameter: 40,
        hexAcrossFlats: 60,
        nutLength: 24,
      }),
  },
  {
    name: "needlevalve",
    geom: () => createNeedleValveGeom({}),
    mesh: () => createNeedleValveMesh({}),
    scaled: () =>
      createNeedleValveGeom({
        bodyLength: 76,
        bodyWidth: 48,
        bodyHeight: 52,
        boreDiameter: 16,
        portDiameter: 32,
        portLength: 20,
        stemHeight: 48,
        wheelDiameter: 52,
        wheelThickness: 10,
      }),
  },
  {
    name: "manifold",
    geom: () => createManifoldGeom({}),
    mesh: () => createManifoldMesh({}),
    scaled: () =>
      createManifoldGeom({
        length: 200,
        width: 60,
        height: 52,
        boreDiameter: 24,
        portDiameter: 16,
        portPitch: 50,
        portCount: 3,
        mountingHoleDiameter: 10,
      }),
  },
]
for (const entry of cases) {
  test(`${entry.name}: finite indexed geometry, positive volume and exact dimension scaling`, () => {
    const geom = entry.geom(),
      mesh = entry.mesh()
    const volume = jscad.measurements.measureVolume(geom)
    expect(Number.isFinite(volume)).toBe(true)
    expect(volume).toBeGreaterThan(0)
    expect(mesh.positions.length).toBeGreaterThan(30)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    expect(mesh.indices.length % 3).toBe(0)
    expect(
      mesh.indices.every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < mesh.positions.length / 3,
      ),
    ).toBe(true)
    const scaledVolume = jscad.measurements.measureVolume(entry.scaled())
    expect(scaledVolume / volume).toBeCloseTo(8, 3)
  }, 30000)
}

test("rigidpipe: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(rigidPipeRenderer)
  const definition = rigidPipeRenderer.schema.parse({ fn: "rigidpipe" })
  const element = registry.render(definition)
  expect(registry.get("rigidpipe")?.pads).toBe("none")
  expect(element?.type).toBe(RigidPipe)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipeelbow: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeElbowRenderer)
  const definition = pipeElbowRenderer.schema.parse({ fn: "pipeelbow" })
  const element = registry.render(definition)
  expect(registry.get("pipeelbow")?.pads).toBe("none")
  expect(element?.type).toBe(PipeElbow)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipetee: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeTeeRenderer)
  const definition = pipeTeeRenderer.schema.parse({ fn: "pipetee" })
  const element = registry.render(definition)
  expect(registry.get("pipetee")?.pads).toBe("none")
  expect(element?.type).toBe(PipeTee)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipecross: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeCrossRenderer)
  const definition = pipeCrossRenderer.schema.parse({ fn: "pipecross" })
  const element = registry.render(definition)
  expect(registry.get("pipecross")?.pads).toBe("none")
  expect(element?.type).toBe(PipeCross)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipecoupling: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeCouplingRenderer)
  const definition = pipeCouplingRenderer.schema.parse({ fn: "pipecoupling" })
  const element = registry.render(definition)
  expect(registry.get("pipecoupling")?.pads).toBe("none")
  expect(element?.type).toBe(PipeCoupling)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipeunion: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeUnionRenderer)
  const definition = pipeUnionRenderer.schema.parse({ fn: "pipeunion" })
  const element = registry.render(definition)
  expect(registry.get("pipeunion")?.pads).toBe("none")
  expect(element?.type).toBe(PipeUnion)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipenipple: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeNippleRenderer)
  const definition = pipeNippleRenderer.schema.parse({ fn: "pipenipple" })
  const element = registry.render(definition)
  expect(registry.get("pipenipple")?.pads).toBe("none")
  expect(element?.type).toBe(PipeNipple)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipecap: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeCapRenderer)
  const definition = pipeCapRenderer.schema.parse({ fn: "pipecap" })
  const element = registry.render(definition)
  expect(registry.get("pipecap")?.pads).toBe("none")
  expect(element?.type).toBe(PipeCap)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipeplug: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipePlugRenderer)
  const definition = pipePlugRenderer.schema.parse({ fn: "pipeplug" })
  const element = registry.render(definition)
  expect(registry.get("pipeplug")?.pads).toBe("none")
  expect(element?.type).toBe(PipePlug)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("reducingbushing: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(reducingBushingRenderer)
  const definition = reducingBushingRenderer.schema.parse({
    fn: "reducingbushing",
  })
  const element = registry.render(definition)
  expect(registry.get("reducingbushing")?.pads).toBe("none")
  expect(element?.type).toBe(ReducingBushing)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("hosebarb: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(hoseBarbRenderer)
  const definition = hoseBarbRenderer.schema.parse({ fn: "hosebarb" })
  const element = registry.render(definition)
  expect(registry.get("hosebarb")?.pads).toBe("none")
  expect(element?.type).toBe(HoseBarb)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("bulkheadfitting: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(bulkheadFittingRenderer)
  const definition = bulkheadFittingRenderer.schema.parse({
    fn: "bulkheadfitting",
  })
  const element = registry.render(definition)
  expect(registry.get("bulkheadfitting")?.pads).toBe("none")
  expect(element?.type).toBe(BulkheadFitting)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pushconnectfitting: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pushConnectFittingRenderer)
  const definition = pushConnectFittingRenderer.schema.parse({
    fn: "pushconnectfitting",
  })
  const element = registry.render(definition)
  expect(registry.get("pushconnectfitting")?.pads).toBe("none")
  expect(element?.type).toBe(PushConnectFitting)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("compressionfitting: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(compressionFittingRenderer)
  const definition = compressionFittingRenderer.schema.parse({
    fn: "compressionfitting",
  })
  const element = registry.render(definition)
  expect(registry.get("compressionfitting")?.pads).toBe("none")
  expect(element?.type).toBe(CompressionFitting)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("hoseclamp: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(hoseClampRenderer)
  const definition = hoseClampRenderer.schema.parse({ fn: "hoseclamp" })
  const element = registry.render(definition)
  expect(registry.get("hoseclamp")?.pads).toBe("none")
  expect(element?.type).toBe(HoseClamp)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("pipeflange: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(pipeFlangeRenderer)
  const definition = pipeFlangeRenderer.schema.parse({ fn: "pipeflange" })
  const element = registry.render(definition)
  expect(registry.get("pipeflange")?.pads).toBe("none")
  expect(element?.type).toBe(PipeFlange)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("ballvalve: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(ballValveRenderer)
  const definition = ballValveRenderer.schema.parse({ fn: "ballvalve" })
  const element = registry.render(definition)
  expect(registry.get("ballvalve")?.pads).toBe("none")
  expect(element?.type).toBe(BallValve)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("checkvalve: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(checkValveRenderer)
  const definition = checkValveRenderer.schema.parse({ fn: "checkvalve" })
  const element = registry.render(definition)
  expect(registry.get("checkvalve")?.pads).toBe("none")
  expect(element?.type).toBe(CheckValve)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("needlevalve: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(needleValveRenderer)
  const definition = needleValveRenderer.schema.parse({ fn: "needlevalve" })
  const element = registry.render(definition)
  expect(registry.get("needlevalve")?.pads).toBe("none")
  expect(element?.type).toBe(NeedleValve)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("manifold: normalized descriptor routes to the expected component without copper pads", () => {
  const registry = new ModelRendererRegistry()
  registry.register(manifoldRenderer)
  const definition = manifoldRenderer.schema.parse({ fn: "manifold" })
  const element = registry.render(definition)
  expect(registry.get("manifold")?.pads).toBe("none")
  expect(element?.type).toBe(Manifold)
  const { fn, ...normalized } = definition
  expect(element?.props).toEqual(normalized)
})

test("plumbing through fittings retain cap-free continuous main bores", () => {
  for (const name of [
    "rigidpipe",
    "pipetee",
    "pipecross",
    "pipecoupling",
    "pipeunion",
    "pipenipple",
    "reducingbushing",
    "hosebarb",
    "bulkheadfitting",
    "pushconnectfitting",
    "compressionfitting",
    "pipeflange",
    "ballvalve",
    "checkvalve",
    "needlevalve",
    "manifold",
  ]) {
    const mesh = cases.find((entry) => entry.name === name)!.mesh()
    expect(
      meshRayHits(mesh, [-200, 0, 0], [1, 0, 0]),
      `${name} flow axis must not hit a cap`,
    ).toEqual([])
  }
}, 30000)

test("branch fittings and manifold ports actually connect to the main bore", () => {
  const elbow = createPipeElbowMesh({}),
    tee = createPipeTeeMesh({}),
    cross = createPipeCrossMesh({}),
    manifold = createManifoldMesh({})
  for (const point of [
    [0, 0, 0],
    [20, 0, 0],
    [0, 20, 0],
  ] as const)
    expect(containsMeshPoint(elbow, point)).toBe(false)
  expect(
    meshRayHits(elbow, [40, 0, 0], [-1, 0, 0]).filter(
      (distance) => distance < 40,
    ),
  ).toEqual([])
  expect(
    meshRayHits(elbow, [0, 40, 0], [0, -1, 0]).filter(
      (distance) => distance < 40,
    ),
  ).toEqual([])
  expect(
    meshRayHits(tee, [0, 40, 0], [0, -1, 0]).filter(
      (distance) => distance < 40,
    ),
  ).toEqual([])
  expect(meshRayHits(cross, [0, -100, 0], [0, 1, 0])).toEqual([])
  for (const x of [-25, 0, 25])
    expect(
      meshRayHits(manifold, [x, 0, 40], [0, 0, -1]).filter(
        (distance) => distance < 40,
      ),
    ).toEqual([])
  expect(containsMeshPoint(manifold, [0, 12, 0])).toBe(true)
})

test("caps and plugs preserve solid closure while sockets remain hollow", () => {
  const cap = createPipeCapMesh({}),
    plug = createPipePlugMesh({})
  expect(containsMeshPoint(cap, [0, 0, 0])).toBe(false)
  expect(containsMeshPoint(cap, [11, 0, 0])).toBe(true)
  expect(meshRayHits(cap, [-100, 0, 0], [1, 0, 0])).toHaveLength(2)
  expect(containsMeshPoint(plug, [0, 0, 0])).toBe(true)
  expect(containsMeshPoint(createPipeCouplingMesh({}), [15, 9, 0])).toBe(false)
  expect(containsMeshPoint(createPipeCouplingMesh({}), [0, 9, 0])).toBe(true)
})

test("hose barb ramps, union nut, collets and compression sockets distinguish fittings", () => {
  const barb = createHoseBarbMesh({}),
    union = createPipeUnionMesh({}),
    push = createPushConnectFittingMesh({}),
    compression = createCompressionFittingMesh({})
  expect(containsMeshPoint(barb, [20, 7.8, 0])).toBe(false)
  expect(containsMeshPoint(barb, [10.7, 7.5, 0])).toBe(true)
  expect(containsMeshPoint(union, [0, 16, 0])).toBe(true)
  expect(containsMeshPoint(union, [24, 13, 0])).toBe(false)
  expect(containsMeshPoint(push, [17, 5, 0])).toBe(false)
  expect(containsMeshPoint(push, [0, 5, 0])).toBe(true)
  expect(containsMeshPoint(compression, [17, 5, 0])).toBe(false)
  expect(containsMeshPoint(compression, [0, 5, 0])).toBe(true)
})

test("flange bolt circle and manifold mounting holes stay open", () => {
  const flange = createPipeFlangeMesh({}),
    manifold = createManifoldMesh({})
  for (const [y, z] of [
    [25, 0],
    [0, 25],
    [-25, 0],
    [0, -25],
  ])
    expect(meshRayHits(flange, [-20, y!, z!], [1, 0, 0])).toEqual([])
  for (const x of [-45, 45])
    for (const y of [-10, 10])
      expect(meshRayHits(manifold, [x, y, -40], [0, 0, 1])).toEqual([])
})

test("valve lever, handwheel and clamp worm screw occupy the specified envelopes", () => {
  const lever = createBallValveMesh({}),
    wheel = createNeedleValveMesh({}),
    clamp = createHoseClampMesh({})
  expect(containsMeshPoint(lever, [35, 0, 29])).toBe(true)
  expect(containsMeshPoint(lever, [0, 0, 22])).toBe(true)
  expect(containsMeshPoint(wheel, [0, 0, 37])).toBe(true)
  expect(containsMeshPoint(wheel, [7.54, 0, 37])).toBe(false)
  expect(meshRayHits(clamp, [0, 0, -40], [0, 0, 1])).toEqual([])
  expect(containsMeshPoint(clamp, [7.5, 18.9, 0])).toBe(true)
})
