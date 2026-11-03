import jscad from "@jscad/modeling"
import { parseCableString } from "@tscircuit/cableprinter"
import { getJstMotorConnector } from "@tscircuit/modelprinter"
import {
  createCableMeshes,
  type CableMesh,
  type CablePoint,
} from "../../lib/cables"
import { geometryToCableMesh } from "../../lib/cables/geometry-to-mesh"
import { NemaMotor } from "../../lib/NemaMotor"
import { JSTPH2_0mm } from "../../lib/JSTPH2_0mm"
import { JstSh } from "../../lib/JstSh"
import { getComponentModel } from "../helpers/component-model"

/** Real model geometry in right-handed world XYZ, +Z up, mm. NEMA shaft
 * face is at (-35,0,40); the PCB copper surface is at Z=0.8. */
export function jstMatedAssembly(family: "ph" | "sh"): CableMesh[] {
  const meshes: CableMesh[] = []
  const add = (
    name: string,
    geometry: jscad.geometries.geom3.Geom3,
    offset: CablePoint,
  ) => {
    meshes.push(
      geometryToCableMesh({
        name,
        geometry: jscad.transforms.translate(offset, geometry),
        color: (
          geometry as typeof geometry & {
            color?: [number, number, number, number]
          }
        ).color ?? [0.85, 0.84, 0.8, 1],
      }),
    )
  }
  const motor = getComponentModel(NemaMotor, {
    nemaSize: 17,
    wireConnection: `jst-${family}-6`,
  })
  motor.geometries.forEach(({ geom }, index) =>
    add(`motor-${index}`, geom, [-35, 0, 40]),
  )
  const header =
    family === "ph"
      ? getComponentModel(JSTPH2_0mm, { numPins: 6, showFootprint: false })
      : getComponentModel(JstSh, { footprint: "jst6_sh" })
  header.geometries.forEach(({ geom }, index) =>
    add(`header-${index}`, geom, [30, 0, 0.8]),
  )
  meshes.push(
    geometryToCableMesh({
      name: "PCB",
      geometry: jscad.booleans.subtract(
        jscad.primitives.cuboid({ size: [30, 26, 1.6], center: [30, 0, 0] }),
        ...[-11, 11].flatMap((x) =>
          [-9, 9].map((y) =>
            jscad.primitives.cylinder({
              radius: 1.6,
              height: 2,
              center: [30 + x, y, 0],
            }),
          ),
        ),
      ),
      color: [0.02, 0.32, 0.17, 1],
    }),
  )
  const profile = getJstMotorConnector(`jst-${family}-6`)!
  const definition = parseCableString(`jst_${family}_pins6`)
  const tip = profile.matingDepth - profile.plugInsertionDepth
  const from: CablePoint = [
    -35 + 21.15 + tip + definition.connectorA.bodyDepth,
    0,
    4.5 + profile.contactOffsetZ,
  ]
  const to: CablePoint = [
    30,
    family === "sh" ? 0.225 : 0,
    0.8 + tip + definition.connectorB.bodyDepth,
  ]
  const a: CablePoint = [from[0] + 0.1, from[1], from[2]]
  const b: CablePoint = [to[0], to[1], to[2] + 0.1]
  const path: CablePoint[] = [from, a]
  for (let sample = 1; sample <= 48; sample++) {
    const t = sample / 48,
      u = 1 - t
    path.push(
      a.map(
        (value, axis) =>
          u ** 3 * value +
          3 * u ** 2 * t * (a[axis]! + (axis === 0 ? 35 : 0)) +
          3 * u * t ** 2 * (b[axis]! + (axis === 2 ? 35 : 0)) +
          t ** 3 * b[axis]!,
      ) as CablePoint,
    )
  }
  path.push(to)
  meshes.push(
    ...createCableMeshes({
      definition,
      path,
      startPin1Side: [0, -1, 0],
      endPin1Side: [-1, 0, 0],
    }),
  )
  return meshes
}
