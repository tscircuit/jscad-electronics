import { createBulletMeshes } from "./bullet-meshes"
import jscad from "@jscad/modeling"
import { geometryToCableMesh } from "./geometry-to-mesh"
import type {
  CableColor,
  CableConnectorSpec,
  CableMesh,
  CablePoint,
} from "./types"

const { cuboid, roundedCuboid, cylinder, roundedRectangle, polygon, sphere } =
  jscad.primitives
const { extrudeLinear } = jscad.extrusions
const { translate, rotateY } = jscad.transforms
const { subtract, union } = jscad.booleans
const plastic: CableColor = [0.055, 0.07, 0.09, 1]
const housing: CableColor = [0.86, 0.84, 0.75, 1]
const metal: CableColor = [0.6, 0.64, 0.7, 1]
const brass: CableColor = [0.66, 0.46, 0.18, 1]

export function connectorWireExitDepth(connector: CableConnectorSpec): number {
  if (connector.kind === "usb_c_plug")
    return connector.shellDepth + connector.bodyDepth
  if (connector.kind === "nema_5_15p") return 19.05 + connector.bodyDepth
  return connector.bodyDepth
}

function createJstMeshes(
  connector: Extract<
    CableConnectorSpec,
    { kind: "jst_sh_housing" | "jst_ph_housing" }
  >,
): CableMesh[] {
  const {
    bodyWidth: width,
    bodyHeight: height,
    bodyDepth: depth,
    pinCount,
    pitch,
  } = connector
  const opening = pitch === 1 ? 0.55 : 1.05
  const holes = Array.from({ length: pinCount }, (_, index) => {
    const x = (index - (pinCount - 1) / 2) * pitch
    return cuboid({
      size: [opening, opening * 1.35, depth - 0.6],
      center: [x, 0, (depth - 0.6) / 2 - 0.02],
    })
  })
  const backHoles = Array.from({ length: pinCount }, (_, index) =>
    cylinder({
      radius: pitch * 0.34,
      height: 1.3,
      segments: 16,
      center: [(index - (pinCount - 1) / 2) * pitch, 0, depth - 0.5],
    }),
  )
  const latchCut = cuboid({
    size: [width * 0.45, 0.5, depth * 0.5],
    center: [0, height / 2, depth * 0.65],
  })
  const body = subtract(
    roundedCuboid({
      size: [width, height, depth],
      center: [0, 0, depth / 2],
      roundRadius: 0.1,
      segments: 8,
    }),
    ...holes,
    ...backHoles,
    latchCut,
    ...Array.from({ length: pinCount }, (_, index) =>
      cuboid({
        size: [opening * 0.8, height * 0.7, depth * 0.24],
        center: [(index - (pinCount - 1) / 2) * pitch, height / 2, depth * 0.7],
      }),
    ),
  )
  const contacts = Array.from({ length: pinCount }, (_, index) => {
    const x = (index - (pinCount - 1) / 2) * pitch
    return geometryToCableMesh({
      name: `contact-${index + 1}`,
      color: metal,
      geometry: subtract(
        cuboid({
          size: [opening * 0.92, opening * 1.25, depth * 0.65],
          center: [x, 0, depth * 0.45],
        }),
        cuboid({
          size: [
            opening * 0.92 - 0.12,
            opening * 1.25 - 0.12,
            depth * 0.65 + 0.2,
          ],
          center: [x, 0, depth * 0.45],
        }),
      ),
    })
  })
  return [
    geometryToCableMesh({ geometry: body, color: housing, name: "housing" }),
    ...contacts,
  ]
}

function createUsbMeshes(
  connector: Extract<CableConnectorSpec, { kind: "usb_c_plug" }>,
): CableMesh[] {
  const {
    shellWidth,
    shellHeight,
    shellDepth,
    bodyWidth,
    bodyHeight,
    bodyDepth,
  } = connector
  const shell = subtract(
    extrudeLinear(
      { height: shellDepth },
      roundedRectangle({
        size: [shellWidth, shellHeight],
        roundRadius: shellHeight / 2 - 0.02,
        segments: 32,
      }),
    ),
    translate(
      [0, 0, -0.1],
      extrudeLinear(
        { height: shellDepth + 0.2 },
        roundedRectangle({
          size: [shellWidth - 0.4, shellHeight - 0.4],
          roundRadius: (shellHeight - 0.4) / 2 - 0.02,
          segments: 32,
        }),
      ),
    ),
  )
  const liner = subtract(
    extrudeLinear(
      { height: shellDepth },
      roundedRectangle({
        size: [shellWidth - 0.41, shellHeight - 0.41],
        roundRadius: 0.85,
        segments: 32,
      }),
    ),
    translate(
      [0, 0, -0.1],
      extrudeLinear(
        { height: shellDepth - 0.3 },
        roundedRectangle({
          size: [shellWidth - 0.8, shellHeight - 0.8],
          roundRadius: 0.65,
          segments: 32,
        }),
      ),
    ),
  )
  const body = roundedCuboid({
    size: [bodyWidth, bodyHeight, bodyDepth],
    center: [0, 0, shellDepth + bodyDepth / 2],
    roundRadius: Math.min(1.3, bodyHeight / 4),
    segments: 16,
  })
  const contacts = Array.from({ length: 24 }, (_, index) =>
    cuboid({
      size: [0.22, 0.08, 3.5],
      center: [((index % 12) - 5.5) * 0.5, index < 12 ? 0.77 : -0.77, 2.6],
    }),
  )
  return [
    geometryToCableMesh({ geometry: body, color: plastic, name: "overmold" }),
    geometryToCableMesh({ geometry: shell, color: metal, name: "shell" }),
    geometryToCableMesh({
      geometry: liner,
      color: [0.025, 0.026, 0.03, 1],
      name: "liner",
    }),
    ...contacts.map((geometry, index) =>
      geometryToCableMesh({
        geometry,
        color: brass,
        name: `contact-${index + 1}`,
      }),
    ),
  ]
}

function createMainsMeshes(connector: CableConnectorSpec): CableMesh[] {
  const { bodyWidth, bodyHeight, bodyDepth, kind } = connector
  const faceDepth = kind === "nema_5_15p" ? 19.05 : 0
  let body = roundedCuboid({
    size: [bodyWidth, bodyHeight, bodyDepth],
    center: [0, 0, faceDepth + bodyDepth / 2],
    roundRadius: 2,
    segments: 16,
  })
  if (kind === "nema_5_15p") {
    const blades = [-6.35, 6.35].map((x) => {
      const blade = cuboid({
        size: [1.524, 6.35, 15.875],
        center: [x, 2.7, 19.05 - 15.875 / 2],
      })
      const hole = translate(
        [x, 2.7, 7.3],
        rotateY(
          Math.PI / 2,
          cylinder({ radius: 1.1, height: 3, segments: 20 }),
        ),
      )
      return subtract(blade, hole)
    })
    const ground = union(
      cylinder({
        radius: 2.38125,
        height: 19.05 - 2.38125,
        center: [0, -9.20625, (19.05 + 2.38125) / 2],
        segments: 32,
      }),
      sphere({ radius: 2.38125, center: [0, -9.20625, 2.38125], segments: 32 }),
    )
    return [
      geometryToCableMesh({
        geometry: body,
        color: plastic,
        name: "plug-body",
      }),
      ...blades.map((geometry, index) =>
        geometryToCableMesh({
          geometry,
          color: brass,
          name: `blade-${index + 1}`,
        }),
      ),
      geometryToCableMesh({
        geometry: ground,
        color: brass,
        name: "ground-pin",
      }),
    ]
  }
  const recess = translate(
    [0, 0, -0.1],
    extrudeLinear(
      { height: 3.2 },
      polygon({
        points: [
          [-9, -6],
          [9, -6],
          [9, 2],
          [5, 6],
          [-5, 6],
          [-9, 2],
        ],
      }),
    ),
  )
  const sockets: CablePoint[] = [
    [-4.4, -1.8, 8],
    [4.4, -1.8, 8],
    [0, 3.1, 8],
  ]
  body = subtract(
    body,
    recess,
    ...sockets.map((center) => cuboid({ size: [2.3, 3.4, 16.2], center })),
  )
  return [
    geometryToCableMesh({
      geometry: body,
      color: plastic,
      name: "appliance-body",
    }),
    ...sockets.map(([x, y], index) =>
      geometryToCableMesh({
        geometry: cuboid({ size: [0.15, 2.8, 6], center: [x - 1.05, y, 7.8] }),
        color: brass,
        name: `socket-contact-${index + 1}`,
      }),
    ),
  ]
}

export function createConnectorMeshes({
  connector,
  jacketDiameter,
}: { connector: CableConnectorSpec; jacketDiameter?: number }): CableMesh[] {
  const meshes =
    connector.kind === "usb_c_plug"
      ? createUsbMeshes(connector)
      : connector.kind === "bullet_male" || connector.kind === "bullet_female"
        ? createBulletMeshes(connector)
        : connector.kind === "jst_sh_housing" ||
            connector.kind === "jst_ph_housing"
          ? createJstMeshes(connector)
          : createMainsMeshes(connector)
  if (
    jacketDiameter !== undefined &&
    connector.kind !== "bullet_male" &&
    connector.kind !== "bullet_female"
  ) {
    const exit = connectorWireExitDepth(connector)
    const boot = union(
      cylinder({
        radius: jacketDiameter / 2 + 0.15,
        height: 5,
        center: [0, 0, exit + 2.5],
        segments: 32,
      }),
      ...Array.from({ length: 7 }, (_, index) =>
        cylinder({
          radius: jacketDiameter / 2 + 0.8 - index * 0.06,
          height: 0.28,
          center: [0, 0, exit + 0.4 + index * 0.7],
          segments: 32,
        }),
      ),
    )
    meshes.push(
      geometryToCableMesh({
        geometry: boot,
        color: plastic,
        name: "strain-relief",
      }),
    )
  }
  return meshes
}
