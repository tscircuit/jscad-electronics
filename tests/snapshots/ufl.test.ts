import { test } from "bun:test"
import * as jscad from "@jscad/modeling"
import type { generalize as Generalize } from "@jscad/modeling/src/operations/modifiers/generalize"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { importVanilla } from "../fixtures/importVanilla.js"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"

// JSCAD's runtime function is declared as a namespace in its public barrel.
const generalize = jscad.modifiers.generalize as unknown as typeof Generalize

test("U.FL unmated receptacle standard four-view snapshot with PCB pads", async () => {
  const { getJscadModelForFootprintWithPads } = await importVanilla()
  const modelString =
    "ufl_p3mm_pw2.2mm_ph1.1mm_signalw1.5mm_signalh1.1mm_signalx-1.25mm"
  const { geometries } = getJscadModelForFootprintWithPads(modelString, jscad)
  const meshes = geometries.map(
    ({
      geom,
      color,
    }: {
      geom: jscad.geometries.geom3.Geom3
      color: string | number[]
    }) => {
      const triangles = generalize({ triangulate: true }, geom)
      const positions = jscad.geometries.geom3
        .toPolygons(triangles)
        .flatMap((polygon) => polygon.vertices.flat())
      const rgb = Array.isArray(color)
        ? color.slice(0, 3)
        : color.startsWith("#")
          ? jscad.colors.hexToRgb(color)
          : jscad.colors.colorNameToRgb(color)
      return {
        mesh: {
          positions,
          indices: Array.from(
            { length: positions.length / 3 },
            (_, index) => index,
          ),
        },
        color: [...rgb, 1] as [number, number, number, number],
      }
    },
  )
  const target: [number, number, number] = [0, 0, 0.5]
  const span = 6
  await expectPngSnapshot(
    await renderModelSnapshot({
      mesh: { positions: [], indices: [] },
      additionalMeshes: meshes,
      title: "U.FL / UNMATED SMT RECEPTACLE",
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "COAXIAL SHELL / +Z MATING AXIS",
          eye: [8, -10, 8],
          target,
          span,
        },
        {
          name: "TOP",
          detail: "SIGNAL ON -X / GROUND ON +/-Y",
          eye: [0, 0, 18],
          target,
          span,
        },
        {
          name: "FRONT",
          detail: "1.25 mm UNMATED HEIGHT / 2 mm SHELL OD",
          eye: [0, -18, 0.5],
          target,
          span,
        },
        {
          name: "SIDE",
          detail: "THREE SOLDER TERMINALS ON COPPER PADS",
          eye: [18, 0, 0.5],
          target,
          span,
        },
      ],
      footer:
        "POPPYGL / NOMINAL U.FL OUTLINE / SIMPLIFIED INTERNAL CONTACTS / COPPER SHOWN",
    }),
    import.meta.path,
  )
}, 30000)
