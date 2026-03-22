import * as React from "react"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"

export async function renderComponentTopView(
  element: React.ReactElement,
  camPos: [number, number, number] = [0.000001, 20, -0.000001],
): Promise<Buffer> {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  const root = createJSCADRoot(container)
  root.render(element)

  const result = { geometries: container.map((geom) => ({ geom })) }

  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  return await renderGLTFToPNGBufferFromGLBBuffer(
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
      camPos,
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
}
