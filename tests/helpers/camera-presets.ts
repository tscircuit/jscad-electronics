export type CameraResult = {
  camPos: readonly [number, number, number]
  lookAt: readonly [number, number, number]
  fov: number
}

type BoundingBox = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
]

function normalizeDir(dir: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2)
  if (len === 0) return [0, 1, 0]
  return [dir[0] / len, dir[1] / len, dir[2] / len]
}

function distance(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function repositionCamera(
  cam: CameraResult,
  dir: [number, number, number],
  distOverride?: number,
): CameraResult {
  const dist = distOverride ?? distance(cam.camPos, cam.lookAt)
  const [nx, ny, nz] = normalizeDir(dir)
  return {
    camPos: [
      cam.lookAt[0] + nx * dist,
      cam.lookAt[1] + ny * dist,
      cam.lookAt[2] + nz * dist,
    ] as const,
    lookAt: cam.lookAt,
    fov: cam.fov,
  }
}

export const CAMERA_PRESETS = {
  "top-down": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0.00000001, 1, -0.001]),

  "top-down-ortho": (cam: CameraResult): CameraResult => {
    const desiredFov = 3
    const dir: [number, number, number] = [0.00000001, 1, -0.001]
    const origDist = distance(cam.camPos, cam.lookAt)
    const origFovRad = Math.max((cam.fov * Math.PI) / 180, 0.01)
    const desiredFovRad = Math.max((desiredFov * Math.PI) / 180, 0.01)
    const tanOrig = Math.tan(origFovRad / 2)
    const tanDesired = Math.max(Math.tan(desiredFovRad / 2), 0.0001)
    const distScale =
      Number.isFinite(tanOrig / tanDesired) && tanOrig > 0
        ? tanOrig / tanDesired
        : 1

    return {
      ...repositionCamera(cam, dir, origDist * distScale),
      fov: desiredFov,
    }
  },

  "bottom-up": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0.00000001, -1, 0.001]),

  "top-left-corner": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0.7, 1.2, -0.8]),

  "top-left": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [1, 1.2, 0]),

  "top-right-corner": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [-0.7, 1.2, -0.8]),

  "top-right": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [-1, 1.2, 0]),

  "left-sideview": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [1, 0.05, 0]),

  "right-sideview": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [-1, 0.05, 0]),

  front: (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0, 0.05, -1]),

  back: (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0, 0.05, 1]),

  "top-center-angled": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0, 1, -1]),

  "bottom-center-angled": (cam: CameraResult): CameraResult =>
    repositionCamera(cam, [0, -1, 1]),
} as const satisfies Record<string, (cam: CameraResult) => CameraResult>

export type CameraPreset = keyof typeof CAMERA_PRESETS

export function getDefaultCameraResult(
  bounds: BoundingBox,
  fov: number,
): CameraResult {
  const [[minX = 0, minY = 0, minZ = 0], [maxX = 0, maxY = 0, maxZ = 0]] =
    bounds
  const center: [number, number, number] = [
    0.5 * (minX + maxX),
    0.5 * (minY + maxY),
    0.5 * (minZ + maxZ),
  ]

  const diag = Math.sqrt(
    (maxX - minX) ** 2 + (maxY - minY) ** 2 + (maxZ - minZ) ** 2,
  )
  const radius = diag * 0.5
  const autoDistance = radius / Math.tan((fov * Math.PI) / 360) + radius * 0.5

  return {
    camPos: [
      center[0] + autoDistance,
      center[1] + autoDistance * 0.3,
      center[2] + autoDistance,
    ] as const,
    lookAt: center,
    fov,
  }
}

export function applyCameraPreset(
  preset: CameraPreset,
  cam: CameraResult,
): CameraResult {
  return CAMERA_PRESETS[preset](cam)
}
