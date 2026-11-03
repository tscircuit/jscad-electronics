import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getJstMotorConnector } from "@tscircuit/modelprinter"
import { parseCableString } from "@tscircuit/cableprinter"
import { createConnectorMeshes } from "../lib/cables/connector-meshes"
import { JSTPH2_0mm } from "../lib/JSTPH2_0mm"
import { JstSh } from "../lib/JstSh"
import { createNemaMotorWireGeometry } from "../lib/utils/nemaMotorWireGeometry"
import { getComponentModel } from "./helpers/component-model"

test("seated PH/SH plug noses clear real socket walls and engage the contact row", () => {
  const { measureVolume, measureBoundingBox } = jscad.measurements
  const { intersect } = jscad.booleans
  for (const family of ["ph", "sh"] as const) {
    for (const pinCount of [2, 6, family === "ph" ? 16 : 15]) {
      const profile = getJstMotorConnector(`jst-${family}-${pinCount}`)!
      const plug = createConnectorMeshes({
        connector: parseCableString(`jst_${family}_pins${pinCount}`).connectorA,
      })
      const toGeometry = (mesh: (typeof plug)[number]) =>
        jscad.geometries.geom3.create(
          Array.from({ length: mesh.indices.length / 3 }, (_, triangle) =>
            jscad.geometries.poly3.create(
              mesh.indices
                .slice(triangle * 3, triangle * 3 + 3)
                .map(
                  (index) =>
                    mesh.positions.slice(index * 3, index * 3 + 3) as [
                      number,
                      number,
                      number,
                    ],
                ),
            ),
          ),
        )
      const tip = profile.matingDepth - profile.plugInsertionDepth
      const motor = createNemaMotorWireGeometry({
        nemaSize: 17,
        wireConnection: `jst-${family}-${pinCount}`,
      })
      const pcb =
        family === "ph"
          ? getComponentModel(JSTPH2_0mm, {
              numPins: pinCount,
              showFootprint: false,
            })
          : getComponentModel(JstSh, { footprint: `jst${pinCount}_sh` })
      for (const socket of ["motor", "pcb"] as const) {
        // Actual model-local mm, +Z shaft/above PCB. The motor's contact row
        // runs along +Y; the PCB row runs along +X. These transforms place the
        // physical plug, independent of the cable path or frame implementation.
        const place = (geometry: jscad.geometries.geom3.Geom3) =>
          socket === "motor"
            ? jscad.transforms.translate(
                [21.15 + tip, 0, -35.5 + profile.contactOffsetZ],
                jscad.transforms.rotateX(
                  Math.PI / 2,
                  jscad.transforms.rotateY(Math.PI / 2, geometry),
                ),
              )
            : jscad.transforms.translate(
                [0, family === "sh" ? 0.225 : 0, tip],
                geometry,
              )
        const shell =
          socket === "motor" ? motor[0]!.geometry : pcb.geometries[0]!.geom
        const housing = place(
          toGeometry(plug.find((mesh) => mesh.name === "housing")!),
        )
        expect(Math.abs(measureVolume(intersect(shell, housing)))).toBeLessThan(
          1e-5,
        )
        const pin =
          socket === "motor" ? motor[1]!.geometry : pcb.geometries[1]!.geom
        const socketBounds = measureBoundingBox(pin)
        const contact = place(
          toGeometry(plug.find((mesh) => mesh.name === "contact-1")!),
        )
        const plugBounds = measureBoundingBox(contact)
        const axial = socket === "motor" ? 0 : 2
        // Male post and female contact must occupy a common axial interval,
        // while the post passes through the housing's actual contact hole.
        const overlap =
          Math.min(socketBounds[1][axial], plugBounds[1][axial]) -
          Math.max(socketBounds[0][axial], plugBounds[0][axial])
        expect(overlap).toBeGreaterThan(1)
        expect(Math.abs(measureVolume(intersect(pin, housing)))).toBeLessThan(
          1e-5,
        )
        const row = socket === "motor" ? 1 : 0
        expect((socketBounds[0][row] + socketBounds[1][row]) / 2).toBeCloseTo(
          (plugBounds[0][row] + plugBounds[1][row]) / 2,
          5,
        )
      }
    }
  }
})
