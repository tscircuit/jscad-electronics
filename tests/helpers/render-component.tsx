import * as jscadModeling from "@jscad/modeling"
import type { Geometry } from "@jscad/modeling/src/geometries/types"
import { createJSCADRenderer } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
import type { ReactElement } from "react"
import {
  applyCameraPreset,
  getDefaultCameraResult,
  type CameraPreset,
} from "./camera-presets"

type Vec3 = [number, number, number]

export interface RenderComponentOptions {
  cameraPreset?: CameraPreset
  camPos?: Vec3
  lookAt?: Vec3
  fov?: number
  gridZ?: number
}

const transformAxis = ([x, y, z]: Vec3): Vec3 => [x, z, -y]

const getTransformedBounds = (geometries: Geometry[]) => {
  const [minimum, maximum] =
    jscadModeling.measurements.measureAggregateBoundingBox(...geometries)
  const corners: Vec3[] = []
  for (const x of [minimum[0], maximum[0]]) {
    for (const y of [minimum[1], maximum[1]]) {
      for (const z of [minimum[2], maximum[2]]) {
        corners.push(transformAxis([x, y, z]))
      }
    }
  }
  return [
    [
      Math.min(...corners.map((corner) => corner[0])),
      Math.min(...corners.map((corner) => corner[1])),
      Math.min(...corners.map((corner) => corner[2])),
    ],
    [
      Math.max(...corners.map((corner) => corner[0])),
      Math.max(...corners.map((corner) => corner[1])),
      Math.max(...corners.map((corner) => corner[2])),
    ],
  ] as const
}

export async function renderComponent(
  element: ReactElement,
  options: RenderComponentOptions = {},
): Promise<Uint8Array> {
  const geometries: Geometry[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as never)
  createJSCADRoot(geometries).render(element)

  const result = {
    geometries: geometries.map((geometry) => ({ geom: geometry })),
  }
  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })
  const glb =
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string)

  const fov = options.fov ?? 35
  const defaultCamera = getDefaultCameraResult(
    getTransformedBounds(geometries),
    fov,
  )
  const camera = options.cameraPreset
    ? applyCameraPreset(options.cameraPreset, defaultCamera)
    : defaultCamera

  return renderGLTFToPNGFromGLB(glb, {
    width: 800,
    height: 600,
    backgroundColor: [1, 1, 1],
    ambient: 0.38,
    gamma: true,
    cull: true,
    fov: camera.fov,
    camPos: options.camPos ?? [...camera.camPos],
    lookAt: options.lookAt ?? [...camera.lookAt],
    grid: {
      infiniteGrid: true,
      cellSize: 1,
      sectionSize: 5,
      fadeDistance: 100,
      fadeStrength: 1.5,
      gridColor: [0.9, 0.9, 0.9],
      sectionColor: [0.7, 0.7, 0.7],
      offset: { y: options.gridZ ?? 0 },
    },
  })
}
