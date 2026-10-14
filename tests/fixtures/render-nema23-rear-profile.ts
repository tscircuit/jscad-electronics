import jscad from "@jscad/modeling"
import type { ColoredGeom } from "../../lib/vanilla/render"
import { importVanilla } from "./importVanilla.js"
import { renderModelSnapshot } from "./render-model-snapshot"

export async function renderNema23RearProfile(modelString: string) {
  const vanilla = await importVanilla()
  const { geometries } = vanilla.getJscadModelForFootprint(modelString, jscad)
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
    title: "NEMA 23 REAR CAP",
    modelString,
    footer: "ST-M10 ADAPTER REFERENCE / MOTOR-SPECIFIC REAR DETAILS MAY VARY",
    views: [
      {
        name: "ISOMETRIC",
        detail: "MATCHING BODY AND REAR OUTLINES / NO SIDE OVERHANG",
        eye: [140, -140, -135],
        target: [0, 0, -25],
        span: 120,
      },
      {
        name: "TOP",
        detail: "REAR VIEW / 50 X 32 MM PATTERN / R5 AND R2.5 ARCS",
        eye: [0, 0, -200],
        target: [0, 0, -51],
        span: 76,
      },
      {
        name: "FRONT",
        detail: "FRONT FLANGE AND SHAFT REMAIN UNCHANGED",
        eye: [0, -180, -16],
        target: [0, 0, -16],
        span: 110,
      },
      {
        name: "SIDE",
        detail: "FLUSH BODY AND REAR SHOULDERS",
        eye: [180, 0, -16],
        target: [0, 0, -16],
        span: 110,
      },
    ],
  })
}
