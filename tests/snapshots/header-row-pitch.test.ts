import { test } from "bun:test"
import * as jscad from "@jscad/modeling"
import type { generalize as Generalize } from "@jscad/modeling/src/operations/modifiers/generalize"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { importVanilla } from "../fixtures/importVanilla.js"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

// JSCAD's runtime function is declared as a namespace in its public barrel.
const generalize = jscad.modifiers.generalize as unknown as typeof Generalize

const toMesh = (geom: jscad.geometries.geom3.Geom3) => {
  const triangles = generalize({ triangulate: true }, geom)
  const positions = jscad.geometries.geom3
    .toPolygons(triangles)
    .flatMap((polygon) => polygon.vertices.flat())
  return {
    positions,
    indices: Array.from({ length: positions.length / 3 }, (_, index) => index),
  }
}

test("male and female headers preserve independent row pitch in four views", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  for (const gender of ["male", "female"]) {
    const modelString = `headermodule16_rows2_cols8_p2.54mm_py22.86mm_${gender}`
    const { geometries } = getJscadModelForFootprint(modelString, jscad)
    const meshes = geometries.map(
      ({
        geom,
        color,
      }: { geom: jscad.geometries.geom3.Geom3; color: string }) => ({
        mesh: toMesh(geom),
        color: [
          ...(color.startsWith("#")
            ? jscad.colors.hexToRgb(
                color.length === 4
                  ? `#${[...color.slice(1)].map((digit) => digit.repeat(2)).join("")}`
                  : color,
              )
            : jscad.colors.colorNameToRgb(color)),
          1,
        ] as [number, number, number, number],
      }),
    )
    // Keep the same camera framing for both variants so row-spacing changes
    // remain visible, even if a regressed model collapses toward the origin.
    const target: [number, number, number] = [0, 0, 2]
    const span = 36
    const png = await renderModelSnapshot({
      mesh: { positions: [], indices: [] },
      additionalMeshes: meshes,
      title: `${gender.toUpperCase()} HEADER / INDEPENDENT ROW PITCH`,
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "TWO SEPARATE EIGHT-PIN ROWS",
          eye: [45, -55, 45],
          target,
          span,
        },
        {
          name: "TOP",
          detail: "22.86 mm ROW PITCH / 2.54 mm COLUMN PITCH",
          eye: [0, 0, 90],
          target,
          span,
        },
        {
          name: "FRONT",
          detail: "EIGHT PINS PER ROW / BODY ABOVE Z=0",
          eye: [0, -90, 2],
          target,
          span,
        },
        {
          name: "SIDE",
          detail: "ROW CENTERS AT Y=-11.43 AND Y=+11.43 mm",
          eye: [90, 0, 2],
          target,
          span,
        },
      ],
      footer:
        "POPPYGL / ISOMETRIC + TOP + FRONT + SIDE / NOMINAL mm / FIXED CAMERA FRAMING",
    })
    await expectPngSnapshot(
      png,
      import.meta.path.replace(".test.ts", `-${gender}.test.ts`),
    )
  }
}, 30000)
