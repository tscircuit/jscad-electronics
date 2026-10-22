import { test } from "bun:test"
import jscad from "@jscad/modeling"
import { createRectangularTubeMesh } from "../../lib/models/rectangulartube/geometry"
import { createRectangularTubeModel } from "../../lib/models/rectangulartube/model"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

test("rectangular tube native feature four-view snapshot", async () => {
  const p = {
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
    outerRadius: 3,
    innerRadius: 1,
  }
  const model = createRectangularTubeModel(p)
  const highlight = (name: string) => {
    const native = model.referenceFeatures[name]!.geometry
    if (
      !jscad.geometries.geom2.isA(native) &&
      !jscad.geometries.path2.isA(native)
    )
      throw new Error("Expected profile or path")
    // Display retained construction profiles on the far cut end. The same
    // features occur on both ends of this constant-section extrusion.
    const geometry = jscad.transforms.translate(
      [0, 0, p.length],
      jscad.extrusions.extrudeRectangular({ size: 0.28, height: 0.3 }, native),
    )
    const positions: number[] = []
    const indices: number[] = []
    for (const polygon of jscad.geometries.geom3.toPolygons(geometry)) {
      const base = positions.length / 3
      for (const vertex of polygon.vertices) positions.push(...vertex)
      for (let i = 1; i < polygon.vertices.length - 1; i++)
        indices.push(base, base + i, base + i + 1)
    }
    return { positions, indices }
  }
  const span = 145
  const target: [number, number, number] = [0, 0, 40]
  const png = await renderModelSnapshot({
    mesh: createRectangularTubeMesh(p),
    title: "RectangularTube Fiber named features",
    modelString:
      "rectangulartube_w40mm_h20mm_wall3mm_l80mm_outerr3mm_innerr1mm",
    footer:
      "Orange outer_profile / blue inner_profile / red outer_top / green outer_left",
    additionalMeshes: [
      { mesh: highlight("outer_profile"), color: [0.95, 0.57, 0.08, 1] },
      { mesh: highlight("inner_profile"), color: [0.12, 0.42, 0.86, 1] },
      { mesh: highlight("outer_top"), color: [0.88, 0.14, 0.14, 1] },
      { mesh: highlight("outer_left"), color: [0.1, 0.64, 0.28, 1] },
    ],
    views: [
      {
        name: "ISOMETRIC",
        detail: "Native curves retained on actual stock profile",
        eye: [span, -span, 40 + span],
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Width 40 / straight outer_top 34 / corner R3",
        eye: [0, 0, 330],
        target,
        span: 45,
      },
      {
        name: "FRONT",
        detail: "Section extruded along +Z for length 80",
        eye: [0, -290, 40],
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "Features declared by Custom name/reference",
        eye: [290, 0, 40],
        target,
        span,
      },
    ],
  })
  await expectPngSnapshot(png, import.meta.path)
})
