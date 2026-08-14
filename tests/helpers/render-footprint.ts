import * as jscadModeling from "@jscad/modeling"
import type { Geometry } from "@jscad/modeling/src/geometries/types"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
import { importVanilla } from "../fixtures/importVanilla.js"
import {
  applyCameraPreset,
  getDefaultCameraResult,
  type CameraPreset,
} from "./camera-presets"
import type { RenderResult } from "../../lib/vanilla/render"

type Vec3 = [number, number, number]

type RenderFootprintOptions = {
  cameraPreset?: CameraPreset
  camPos?: Vec3
  lookAt?: Vec3
  includePads?: boolean
  board?: {
    width: number
    height: number
    thickness: number
  }
}

const GLTF_AXIS_TRANSFORM = "jscad_y+ -> gltf_z+" as const

function applyGltfAxisTransform([x, y, z]: Vec3): Vec3 {
  return [x, z, -y]
}

function toVec3([x, y, z]: readonly [number, number, number]): Vec3 {
  return [x, y, z]
}

function getTransformedBoundingBox(geometry: RenderResult) {
  const geometries: Geometry[] = geometry.geometries.map(
    ({ geom }) => geom as Geometry,
  )
  const [minCorner, maxCorner] =
    jscadModeling.measurements.measureAggregateBoundingBox(...geometries)
  const [minX, minY, minZ] = toVec3(minCorner)
  const [maxX, maxY, maxZ] = toVec3(maxCorner)
  const transformedCorners = [
    applyGltfAxisTransform([minX, minY, minZ]),
    applyGltfAxisTransform([minX, minY, maxZ]),
    applyGltfAxisTransform([minX, maxY, minZ]),
    applyGltfAxisTransform([minX, maxY, maxZ]),
    applyGltfAxisTransform([maxX, minY, minZ]),
    applyGltfAxisTransform([maxX, minY, maxZ]),
    applyGltfAxisTransform([maxX, maxY, minZ]),
    applyGltfAxisTransform([maxX, maxY, maxZ]),
  ]

  let minTransformed = transformedCorners[0]!
  let maxTransformed = transformedCorners[0]!

  for (const [x, y, z] of transformedCorners.slice(1)) {
    minTransformed = [
      Math.min(minTransformed[0], x),
      Math.min(minTransformed[1], y),
      Math.min(minTransformed[2], z),
    ]
    maxTransformed = [
      Math.max(maxTransformed[0], x),
      Math.max(maxTransformed[1], y),
      Math.max(maxTransformed[2], z),
    ]
  }

  return [minTransformed, maxTransformed] as const
}

/**
 * Render a footprint to PNG using poppygl via GLTF conversion
 * This preserves colors correctly from the JSCAD model
 */
export async function renderFootprint(
  footprint: string,
  options: RenderFootprintOptions = {},
): Promise<Uint8Array> {
  const { getJscadModelForFootprint, getJscadModelForFootprintWithPads } =
    await importVanilla()
  const result =
    options.includePads === false
      ? getJscadModelForFootprint(footprint, jscadModeling)
      : getJscadModelForFootprintWithPads(footprint, jscadModeling)

  if (options.board) {
    const { width, height, thickness } = options.board
    const boardCenter: Vec3 = [0, 0, -thickness / 2 - 0.01]
    const board = jscadModeling.primitives.cuboid({
      size: [width, height, thickness],
      center: boardCenter,
    })
    const pinHoles = [-2.6, 0, 2.6].map((x) =>
      jscadModeling.primitives.cylinder({
        radius: 0.5,
        height: thickness + 0.04,
        center: [x, -1, boardCenter[2]],
      }),
    )

    result.geometries.unshift({
      geom: jscadModeling.booleans.subtract(board, ...pinHoles),
      color: [0.1, 0.35, 0.18],
    })
  }

  // Convert JSCAD model to GLB format (preserves colors)
  // Use axisTransform to make objects lie flat (Y-up to Z-up)
  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: GLTF_AXIS_TRANSFORM,
  })

  const glbBuffer =
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string)

  const baseRenderOptions = {
    width: 800,
    height: 600,
    backgroundColor: [1, 1, 1] as const,
    ambient: 0.3,
    gamma: true,
    cull: true as const,
    grid: {
      infiniteGrid: true,
      cellSize: 0.5,
      sectionSize: 5,
      fadeDistance: 50,
      fadeStrength: 1.5,
      gridColor: [0.9, 0.9, 0.9] as const,
      sectionColor: [0.7, 0.7, 0.7] as const,
    },
  }

  if (!options.cameraPreset) {
    return renderGLTFToPNGFromGLB(glbBuffer, {
      ...baseRenderOptions,
      camPos: options.camPos,
      lookAt: options.lookAt,
    })
  }

  const defaultFov = 35
  const cameraOptions = applyCameraPreset(
    options.cameraPreset,
    getDefaultCameraResult(getTransformedBoundingBox(result), defaultFov),
  )

  return renderGLTFToPNGFromGLB(glbBuffer, {
    ...baseRenderOptions,
    fov: cameraOptions.fov,
    camPos: options.camPos ?? cameraOptions.camPos,
    lookAt: options.lookAt ?? cameraOptions.lookAt,
  })
}
