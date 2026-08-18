import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { Colorize, Cuboid, Translate } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
import * as React from "react"
import { JSTPH2_0mm } from "../../lib/JSTPH2_0mm"

async function renderComponentTopView(
  element: React.ReactElement,
): Promise<Uint8Array> {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  const root = createJSCADRoot(container)
  root.render(element)

  const result = { geometries: container.map((geom) => ({ geom })) }

  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  const pngBuffer = await renderGLTFToPNGFromGLB(
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string),
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1],
      ambient: 0.5,
      gamma: true,
      cull: true,
      camPos: [0.001, 20, -0.05],
      lookAt: [0, 0, 0],
      grid: {
        infiniteGrid: true,
        cellSize: 0.5,
        sectionSize: 5,
        fadeDistance: 50,
        fadeStrength: 1.5,
        gridColor: [0.9, 0.9, 0.9],
        sectionColor: [0.7, 0.7, 0.7],
      },
    },
  )

  return pngBuffer
}

test("JST PH 2.0mm component", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSTPH2_0mm numPins={7} />
    </>
  )
  const pngBuffer = await renderComponentTopView(element)
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

test("JST PH 2.0mm two-pin component", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSTPH2_0mm numPins={2} />
    </>
  )
  const pngBuffer = await renderComponentTopView(element)
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "jstph2_0mm-2pin",
  )
})
