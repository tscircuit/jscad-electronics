import { test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { geom3ToIndexedMesh } from "../../lib/mechanical/geom3-to-indexed-mesh"
import { getComponentModel } from "../helpers/component-model"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("captures the Sitara DFN body beside its authored dimensions", async () => {
  // SK-AM62 D4 (DIO_DFN0201_0-4) produces this Footprinter string.
  // JSCAD coordinates are millimeters with +Z above the PCB seating plane.
  const footprint = "dfn2_w0.65mm_h0.4mm_bodywidth0.65mm_bodylength0.4mm_p0.4mm"
  const model = getComponentModel(Footprinter3d, { footprint })
  const [body, ...terminals] = model.geometries
  if (!body) throw new Error("DFN has no body geometry")
  const [minimum, maximum] = jscad.measurements.measureBoundingBox(body.geom)
  const bodyWidthMm = (maximum[0] - minimum[0]).toFixed(3)
  const bodyLengthMm = (maximum[1] - minimum[1]).toFixed(3)
  const target = [0, 0, 0.5] as const
  const png = await renderModelSnapshot({
    mesh: geom3ToIndexedMesh(body.geom),
    additionalMeshes: terminals.map(({ geom }) => ({
      mesh: geom3ToIndexedMesh(geom),
      color: [0.75, 0.77, 0.8, 1],
    })),
    color: [0.12, 0.13, 0.15, 1],
    title: "SITARA / DIO_DFN0201",
    modelString: footprint,
    views: [
      {
        name: "ISOMETRIC",
        detail: "BODY AND TERMINALS",
        eye: [9, -12, 10],
        target,
        span: 7,
      },
      {
        name: "TOP",
        detail: "VIEW ALONG -Z",
        eye: [0, 0, 20],
        target,
        span: 7,
      },
      {
        name: "FRONT",
        detail: "VIEW FROM -Y",
        eye: [0, -20, 0.5],
        target,
        span: 7,
      },
      {
        name: "SIDE",
        detail: "VIEW FROM +X",
        eye: [20, 0, 0.5],
        target,
        span: 7,
      },
    ],
    footer: `AUTHORED BODY 0.650 X 0.400 mm / RENDERED BODY ${bodyWidthMm} X ${bodyLengthMm} mm`,
  })
  await expectPngSnapshot(png, import.meta.path)
})
