import jscad from "@jscad/modeling"
import type { ColoredGeom } from "../../lib/vanilla/render"
import { importVanilla } from "./importVanilla.js"
import { renderModelSnapshot } from "./render-model-snapshot"

export async function renderNema34() {
  const vanilla = await importVanilla()
  const { geometries } = vanilla.getJscadModelForFootprint("nema34", jscad)
  const meshes = geometries.map(({ geom, color }: ColoredGeom) => {
    const positions: number[] = []
    const indices: number[] = []
    for (const polygon of jscad.geometries.geom3.toPolygons(geom)) {
      const start = positions.length / 3
      for (const vertex of polygon.vertices) positions.push(...vertex)
      for (let i = 1; i < polygon.vertices.length - 1; i++)
        indices.push(start, start + i, start + i + 1)
    }
    const rgb = typeof color === "string" ? jscad.colors.hexToRgb(color) : color
    return {
      mesh: { positions, indices },
      color: [rgb?.[0] ?? 0.42, rgb?.[1] ?? 0.49, rgb?.[2] ?? 0.59, 1] as [
        number,
        number,
        number,
        number,
      ],
    }
  })
  return renderModelSnapshot({
    ...meshes[0]!,
    additionalMeshes: meshes.slice(1),
    title: "NEMA 34 STEPPER MOTOR",
    modelString: "nema34",
    footer:
      "86 X 80 MM BODY / 69.6 MM PITCH / 73 MM PILOT / 14 X 32 MM ROUND SHAFT",
    views: [
      {
        name: "ISOMETRIC",
        detail: "MOUNTING FACE AT Z=0 / SHAFT ALONG +Z",
        eye: [220, 220, 150],
        target: [0, 0, -24],
        span: 200,
      },
      {
        name: "TOP",
        detail: "FOUR 6.5 MM THROUGH FLANGE HOLES / 69.6 MM PITCH",
        eye: [0, 0, 250],
        target: [0, 0, 0],
        span: 150,
      },
      {
        name: "FRONT",
        detail: "80 MM BODY / 32 MM SHAFT FROM MOUNTING FACE",
        eye: [0, -250, -24],
        target: [0, 0, -24],
        span: 180,
      },
      {
        name: "SIDE",
        detail: "ROUNDED SHOULDERS / PLAIN REAR CASTING",
        eye: [250, 0, -24],
        target: [0, 0, -24],
        span: 180,
      },
    ],
  })
}
