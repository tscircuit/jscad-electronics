import { Colorize, Cuboid, Rotate, RoundedCuboid, Translate } from "jscad-fiber"
import { Fragment } from "react"
import { Screen } from "./Screen"

type Point3 = [number, number, number]
type Rotation3 = [number | string, number | string, number | string]

export type FlexScreenOrientation =
  | "sitsFlat"
  | "sitsFlatBelowBoard"
  | "foldedToFaceAboveBoard"
  | "foldedToFaceBelowBoard"
  | "foldedToRightAngleAboveBoard"
  | "foldedToRightAngleBelowBoard"

export type FlexScreenAspectRatio =
  | number
  | `${number}:${number}`
  | readonly [number, number]

export interface FlexScreenProps {
  /** Explicit screen width. If height is omitted, it is derived from the ratio. */
  width?: number
  /** Explicit screen height. If width is omitted, it is derived from the ratio. */
  height?: number
  /** Screen diagonal. Used with the ratio unless one other dimension is supplied. */
  diagonal?: number
  /** Width-to-height ratio. Accepts 1.777, "16:9", or [16, 9]. */
  aspectRatio?: FlexScreenAspectRatio
  /** Alias for aspectRatio. aspectRatio takes precedence when both are supplied. */
  ratio?: FlexScreenAspectRatio
  /** Diagonal used when width, height, and diagonal are all omitted. */
  defaultDiagonal?: number

  orientation?: FlexScreenOrientation
  /** Boolean orientation shortcuts for footprint/configuration builders. */
  sitsFlat?: boolean
  sitsFlatBelowBoard?: boolean
  foldedToFaceAboveBoard?: boolean
  foldedToFaceBelowBoard?: boolean
  /** Concise aliases for the 180-degree face-above/face-below folds. */
  foldsAboveBoard?: boolean
  foldsBelowBoard?: boolean
  foldedToRightAngleAboveBoard?: boolean
  foldedToRightAngleBelowBoard?: boolean

  screenThickness?: number
  bezelInset?: number
  bezelDepth?: number
  activeAreaWidth?: number
  activeAreaHeight?: number
  screenColor?: string
  bezelColor?: string
  showScreen?: boolean

  /** Centerline length of the modeled cable route. */
  flexCableLength?: number
  flexCableWidth?: number
  flexCableThickness?: number
  flexCableColor?: string
  conductorCount?: number
  conductorPitch?: number
  conductorWidth?: number
  conductorThickness?: number
  conductorColor?: string
  cableEdgeMargin?: number
  exposedContactLength?: number
  showConductors?: boolean
  showFlexCable?: boolean

  showStiffeners?: boolean
  stiffenerLength?: number
  stiffenerThickness?: number
  stiffenerColor?: string

  /** Radius of the 90-degree cable bend in right-angle presets. */
  bendRadius?: number
  /** Number of straight segments used to approximate a 90-degree bend. */
  bendSegments?: number
  /** Straight cable length after the bend before the screen attachment. */
  rightAngleVerticalLead?: number
  /** Screen backplane distance above the board for a 180-degree upward fold. */
  distanceAboveBoard?: number
  /** Screen backplane distance below the board for a 180-degree downward fold. */
  distanceBelowBoard?: number
  /** Straight distance from the connector to the start of a 180-degree fold. */
  foldDistanceFromConnector?: number
  /** Maximum distance the 180-degree loop extends beyond the fold start. */
  foldOutset?: number
  /** Number of straight segments used to approximate a 180-degree fold. */
  foldSegments?: number
  screenGap?: number

  /** Board reference used to place above/below presets. The board is not rendered. */
  boardTopZ?: number
  boardThickness?: number
  boardClearance?: number
  cableStartX?: number
  cableStartY?: number
  /** Overrides the preset-derived cable centerline Z at the connector end. */
  cableStartZ?: number
  cableLateralOffset?: number

  /** Added after the orientation preset computes the screen attachment pose. */
  screenOffset?: { x?: number; y?: number; z?: number }
  /** Replaces the orientation preset's screen rotation. */
  screenRotation?: Rotation3
  /** Rotates the complete assembly around its cable origin. */
  rotation?: Rotation3
  /** Translates the complete assembly after rotation. */
  offset?: { x?: number; y?: number; z?: number }
}

export interface ResolvedFlexScreenSize {
  width: number
  height: number
  diagonal: number
  aspectRatio: number
}

const DEFAULT_ASPECT_RATIO = 16 / 9
const DEFAULT_DIAGONAL = 40
const EPSILON = 1e-6

const assertPositive = (name: string, value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a finite number greater than zero`)
  }
}

const resolveAspectRatio = (
  value: FlexScreenAspectRatio | undefined,
): number => {
  if (value === undefined) return DEFAULT_ASPECT_RATIO
  if (typeof value === "number") {
    assertPositive("aspectRatio", value)
    return value
  }
  if (typeof value !== "string") {
    const [ratioWidth, ratioHeight] = value
    assertPositive("aspectRatio width", ratioWidth)
    assertPositive("aspectRatio height", ratioHeight)
    return ratioWidth / ratioHeight
  }
  const parts = value.split(":")
  if (parts.length !== 2) {
    throw new Error('aspectRatio must look like "16:9"')
  }
  const ratioWidth = Number(parts[0])
  const ratioHeight = Number(parts[1])
  assertPositive("aspectRatio width", ratioWidth)
  assertPositive("aspectRatio height", ratioHeight)
  return ratioWidth / ratioHeight
}

export const resolveFlexScreenSize = ({
  width,
  height,
  diagonal,
  aspectRatio,
  ratio,
  defaultDiagonal = DEFAULT_DIAGONAL,
}: Pick<
  FlexScreenProps,
  "width" | "height" | "diagonal" | "aspectRatio" | "ratio" | "defaultDiagonal"
>): ResolvedFlexScreenSize => {
  const resolvedRatio = resolveAspectRatio(aspectRatio ?? ratio)

  if (width !== undefined) assertPositive("width", width)
  if (height !== undefined) assertPositive("height", height)
  if (diagonal !== undefined) assertPositive("diagonal", diagonal)
  assertPositive("defaultDiagonal", defaultDiagonal)

  let resolvedWidth: number
  let resolvedHeight: number

  if (width !== undefined && height !== undefined) {
    resolvedWidth = width
    resolvedHeight = height
  } else if (diagonal !== undefined && width !== undefined) {
    if (width >= diagonal) {
      throw new Error("width must be smaller than diagonal")
    }
    resolvedWidth = width
    resolvedHeight = Math.sqrt(diagonal ** 2 - width ** 2)
  } else if (diagonal !== undefined && height !== undefined) {
    if (height >= diagonal) {
      throw new Error("height must be smaller than diagonal")
    }
    resolvedWidth = Math.sqrt(diagonal ** 2 - height ** 2)
    resolvedHeight = height
  } else if (width !== undefined) {
    resolvedWidth = width
    resolvedHeight = width / resolvedRatio
  } else if (height !== undefined) {
    resolvedWidth = height * resolvedRatio
    resolvedHeight = height
  } else {
    const resolvedDiagonal = diagonal ?? defaultDiagonal
    resolvedHeight = resolvedDiagonal / Math.sqrt(resolvedRatio ** 2 + 1)
    resolvedWidth = resolvedHeight * resolvedRatio
  }

  return {
    width: resolvedWidth,
    height: resolvedHeight,
    diagonal: Math.hypot(resolvedWidth, resolvedHeight),
    aspectRatio: resolvedWidth / resolvedHeight,
  }
}

const resolveOrientation = (props: FlexScreenProps): FlexScreenOrientation => {
  const shortcuts = [
    ["sitsFlat", props.sitsFlat],
    ["sitsFlatBelowBoard", props.sitsFlatBelowBoard],
    ["foldedToFaceAboveBoard", props.foldedToFaceAboveBoard],
    ["foldedToFaceBelowBoard", props.foldedToFaceBelowBoard],
    ["foldedToFaceAboveBoard", props.foldsAboveBoard],
    ["foldedToFaceBelowBoard", props.foldsBelowBoard],
    ["foldedToRightAngleAboveBoard", props.foldedToRightAngleAboveBoard],
    ["foldedToRightAngleBelowBoard", props.foldedToRightAngleBelowBoard],
  ].filter((entry) => entry[1]) as Array<[FlexScreenOrientation, boolean]>

  if (shortcuts.length > 1) {
    throw new Error(
      "Only one FlexScreen boolean orientation shortcut can be true",
    )
  }
  return shortcuts[0]?.[0] ?? props.orientation ?? "sitsFlat"
}

const distance = (a: Point3, b: Point3) =>
  Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])

const interpolate = (a: Point3, b: Point3, progress: number): Point3 => [
  a[0] + (b[0] - a[0]) * progress,
  a[1] + (b[1] - a[1]) * progress,
  a[2] + (b[2] - a[2]) * progress,
]

const getPathDistances = (points: readonly Point3[]) => {
  const distances = [0]
  for (let index = 1; index < points.length; index += 1) {
    distances.push(
      distances[index - 1]! + distance(points[index - 1]!, points[index]!),
    )
  }
  return distances
}

const pointAtDistance = (
  points: readonly Point3[],
  distances: readonly number[],
  targetDistance: number,
): Point3 => {
  if (targetDistance <= 0) return points[0]!
  const totalLength = distances.at(-1)!
  if (targetDistance >= totalLength) return points.at(-1)!

  for (let index = 1; index < points.length; index += 1) {
    if (distances[index]! >= targetDistance) {
      const segmentStart = distances[index - 1]!
      const segmentLength = distances[index]! - segmentStart
      return interpolate(
        points[index - 1]!,
        points[index]!,
        (targetDistance - segmentStart) / segmentLength,
      )
    }
  }
  return points.at(-1)!
}

const slicePath = (
  points: readonly Point3[],
  startDistance: number,
  endDistance: number,
): Point3[] => {
  const distances = getPathDistances(points)
  const totalLength = distances.at(-1)!
  const safeStart = Math.max(0, Math.min(startDistance, totalLength))
  const safeEnd = Math.max(safeStart, Math.min(endDistance, totalLength))
  const result = [pointAtDistance(points, distances, safeStart)]

  for (let index = 1; index < points.length - 1; index += 1) {
    if (distances[index]! > safeStart && distances[index]! < safeEnd) {
      result.push(points[index]!)
    }
  }
  result.push(pointAtDistance(points, distances, safeEnd))
  return result
}

const createFlatPath = (start: Point3, flexCableLength: number): Point3[] => [
  start,
  [start[0], start[1] + flexCableLength, start[2]],
]

const createFoldedPath = ({
  start,
  endZ,
  flexCableLength,
  foldDistanceFromConnector,
  foldOutset,
  foldSegments,
}: {
  start: Point3
  endZ: number
  flexCableLength: number
  foldDistanceFromConnector: number
  foldOutset: number
  foldSegments: number
}): Point3[] => {
  const points: Point3[] = [start]
  const foldStart: Point3 = [
    start[0],
    start[1] + foldDistanceFromConnector,
    start[2],
  ]
  if (foldDistanceFromConnector > EPSILON) points.push(foldStart)

  for (let index = 1; index <= foldSegments; index += 1) {
    const angle = (Math.PI * index) / foldSegments
    points.push([
      start[0],
      foldStart[1] + foldOutset * Math.sin(angle),
      start[2] + ((endZ - start[2]) * (1 - Math.cos(angle))) / 2,
    ])
  }

  const minimumLength = getPathDistances(points).at(-1)!
  if (minimumLength > flexCableLength + EPSILON) {
    throw new Error(
      `flexCableLength must be at least ${minimumLength.toFixed(2)} for this 180-degree fold`,
    )
  }

  const tailLength = Math.max(0, flexCableLength - minimumLength)
  if (tailLength > EPSILON) {
    const foldEnd = points.at(-1)!
    points.push([foldEnd[0], foldEnd[1] - tailLength, foldEnd[2]])
  }
  return points
}

const createRightAnglePath = ({
  start,
  flexCableLength,
  bendRadius,
  bendSegments,
  verticalLead,
  direction,
}: {
  start: Point3
  flexCableLength: number
  bendRadius: number
  bendSegments: number
  verticalLead: number
  direction: 1 | -1
}): Point3[] => {
  const bendLengthPerRadius =
    2 * bendSegments * Math.sin(Math.PI / (4 * bendSegments))
  const resolvedRadius = Math.min(
    bendRadius,
    flexCableLength / bendLengthPerRadius,
  )
  const bendLength = resolvedRadius * bendLengthPerRadius
  const remainingLength = Math.max(0, flexCableLength - bendLength)
  const resolvedVerticalLead = Math.min(verticalLead, remainingLength * 0.45)
  const horizontalLength = remainingLength - resolvedVerticalLead
  const points: Point3[] = [start]

  if (horizontalLength > EPSILON) {
    points.push([start[0], start[1] + horizontalLength, start[2]])
  }

  for (let index = 1; index <= bendSegments; index += 1) {
    const angle = ((Math.PI / 2) * index) / bendSegments
    points.push([
      start[0],
      start[1] + horizontalLength + resolvedRadius * Math.sin(angle),
      start[2] + direction * resolvedRadius * (1 - Math.cos(angle)),
    ])
  }

  if (resolvedVerticalLead > EPSILON) {
    const arcEnd = points.at(-1)!
    points.push([
      arcEnd[0],
      arcEnd[1],
      arcEnd[2] + direction * resolvedVerticalLead,
    ])
  }
  return points
}

const CableStrip = ({
  points,
  width,
  thickness,
  color,
  acrossOffset = 0,
  normalOffset = 0,
  overlap = 0.03,
}: {
  points: readonly Point3[]
  width: number
  thickness: number
  color: string
  acrossOffset?: number
  normalOffset?: number
  overlap?: number
}) => (
  <Colorize color={color}>
    {points.slice(1).map((point, index) => {
      const previous = points[index]!
      const dx = point[0] - previous[0]
      const dy = point[1] - previous[1]
      const dz = point[2] - previous[2]
      const segmentLength = Math.hypot(dx, dy, dz)
      if (segmentLength < EPSILON) return null

      const pitch = Math.asin(dz / segmentLength)
      const yaw = Math.atan2(-dx, dy)
      const midpoint: Point3 = [
        (previous[0] + point[0]) / 2,
        (previous[1] + point[1]) / 2,
        (previous[2] + point[2]) / 2,
      ]
      const roundRadius = Math.max(
        0.001,
        Math.min(width, thickness, segmentLength) / 2 - 0.001,
      )

      return (
        <Translate key={`${index}:${midpoint.join(":")}`} offset={midpoint}>
          <Rotate rotation={[pitch, 0, yaw]}>
            <RoundedCuboid
              size={[width, segmentLength + overlap, thickness]}
              center={[acrossOffset, 0, normalOffset]}
              roundRadius={roundRadius}
            />
          </Rotate>
        </Translate>
      )
    })}
  </Colorize>
)

export const FlexScreen = (props: FlexScreenProps) => {
  const {
    width,
    height,
    diagonal,
    aspectRatio,
    ratio,
    defaultDiagonal,
    screenThickness = 1.2,
    bezelInset = 2,
    bezelDepth = 0.65,
    activeAreaWidth,
    activeAreaHeight,
    screenColor = "#071b24",
    bezelColor = "#15181d",
    showScreen = true,
    flexCableLength = 28,
    flexCableThickness = 0.18,
    flexCableColor = "#d79528",
    conductorCount = 8,
    conductorPitch,
    conductorWidth,
    conductorThickness = 0.035,
    conductorColor = "#8c4a18",
    cableEdgeMargin = 0.6,
    exposedContactLength = 2.4,
    showConductors = true,
    showFlexCable = true,
    showStiffeners = true,
    stiffenerLength = 3,
    stiffenerThickness = 0.16,
    stiffenerColor = "#416bb3",
    bendRadius = 3,
    bendSegments = 10,
    rightAngleVerticalLead = 3,
    distanceAboveBoard = 7,
    distanceBelowBoard = 7,
    foldDistanceFromConnector = 7,
    foldOutset = 4,
    foldSegments = 18,
    screenGap = 0.08,
    boardTopZ = 0,
    boardThickness = 1.6,
    boardClearance = 0.15,
    cableStartX = 0,
    cableStartY = 0,
    cableStartZ,
    cableLateralOffset = 0,
    screenOffset,
    screenRotation,
    rotation = [0, 0, 0],
    offset,
  } = props

  const size = resolveFlexScreenSize({
    width,
    height,
    diagonal,
    aspectRatio,
    ratio,
    defaultDiagonal,
  })
  const orientation = resolveOrientation(props)
  const belowBoard =
    orientation === "sitsFlatBelowBoard" ||
    orientation === "foldedToFaceBelowBoard" ||
    orientation === "foldedToRightAngleBelowBoard"
  const foldedFace =
    orientation === "foldedToFaceAboveBoard" ||
    orientation === "foldedToFaceBelowBoard"
  const rightAngle =
    orientation === "foldedToRightAngleAboveBoard" ||
    orientation === "foldedToRightAngleBelowBoard"

  assertPositive("screenThickness", screenThickness)
  assertPositive("flexCableLength", flexCableLength)
  assertPositive("flexCableThickness", flexCableThickness)
  assertPositive("conductorThickness", conductorThickness)
  assertPositive("bendRadius", bendRadius)
  assertPositive("foldOutset", foldOutset)
  assertPositive("boardThickness", boardThickness)
  if (showStiffeners) assertPositive("stiffenerThickness", stiffenerThickness)
  if (!Number.isInteger(conductorCount) || conductorCount < 1) {
    throw new Error("conductorCount must be a positive integer")
  }
  if (!Number.isInteger(bendSegments) || bendSegments < 2) {
    throw new Error("bendSegments must be an integer of at least 2")
  }
  if (!Number.isInteger(foldSegments) || foldSegments < 4) {
    throw new Error("foldSegments must be an integer of at least 4")
  }
  if (
    boardClearance < 0 ||
    screenGap < 0 ||
    cableEdgeMargin < 0 ||
    exposedContactLength < 0 ||
    stiffenerLength < 0 ||
    rightAngleVerticalLead < 0 ||
    distanceAboveBoard < 0 ||
    distanceBelowBoard < 0 ||
    foldDistanceFromConnector < 0
  ) {
    throw new Error(
      "clearances, margins, contact lengths, and lead lengths cannot be negative",
    )
  }

  const resolvedCableWidth =
    props.flexCableWidth ?? Math.min(12, Math.max(5, size.width * 0.3))
  assertPositive("flexCableWidth", resolvedCableWidth)
  const usableCableWidth = resolvedCableWidth - cableEdgeMargin * 2
  if (usableCableWidth <= 0) {
    throw new Error("cableEdgeMargin leaves no usable flex cable width")
  }

  const resolvedConductorPitch =
    conductorPitch ??
    (conductorCount === 1 ? 0 : usableCableWidth / conductorCount)
  if (
    conductorCount > 1 &&
    (!Number.isFinite(resolvedConductorPitch) || resolvedConductorPitch <= 0)
  ) {
    throw new Error("conductorPitch must be greater than zero")
  }
  const resolvedConductorWidth =
    conductorWidth ??
    (conductorCount === 1
      ? Math.min(usableCableWidth, resolvedCableWidth * 0.45)
      : resolvedConductorPitch * 0.48)
  assertPositive("conductorWidth", resolvedConductorWidth)
  const conductorSpan =
    (conductorCount - 1) * resolvedConductorPitch + resolvedConductorWidth
  if (conductorSpan > usableCableWidth + EPSILON) {
    throw new Error(
      "conductorPitch and conductorWidth do not fit inside the flex cable margins",
    )
  }

  const cableStartsBelowBoard = belowBoard && !foldedFace
  const defaultCableZ = cableStartsBelowBoard
    ? boardTopZ - boardThickness - boardClearance - flexCableThickness / 2
    : boardTopZ + boardClearance + flexCableThickness / 2
  const start: Point3 = [
    cableStartX + cableLateralOffset,
    cableStartY,
    cableStartZ ?? defaultCableZ,
  ]
  const direction = belowBoard ? -1 : 1
  const foldedScreenBackZ =
    orientation === "foldedToFaceAboveBoard"
      ? boardTopZ + distanceAboveBoard
      : boardTopZ - boardThickness - distanceBelowBoard
  const foldedCableEndZ =
    orientation === "foldedToFaceAboveBoard"
      ? foldedScreenBackZ - screenGap - flexCableThickness / 2
      : foldedScreenBackZ + screenGap + flexCableThickness / 2
  const path = foldedFace
    ? createFoldedPath({
        start,
        endZ: foldedCableEndZ,
        flexCableLength,
        foldDistanceFromConnector,
        foldOutset,
        foldSegments,
      })
    : rightAngle
      ? createRightAnglePath({
          start,
          flexCableLength,
          bendRadius,
          bendSegments,
          verticalLead: rightAngleVerticalLead,
          direction,
        })
      : createFlatPath(start, flexCableLength)
  const totalCableLength = getPathDistances(path).at(-1)!
  const contactLength = Math.min(
    Math.max(0, exposedContactLength),
    totalCableLength / 2,
  )
  const resolvedStiffenerLength = Math.min(
    Math.max(0, stiffenerLength),
    totalCableLength / 2,
  )
  const startContacts = slicePath(path, 0, contactLength)
  const endContacts = slicePath(
    path,
    totalCableLength - contactLength,
    totalCableLength,
  )
  const startStiffener = slicePath(path, 0, resolvedStiffenerLength)
  const endStiffener = slicePath(
    path,
    totalCableLength - resolvedStiffenerLength,
    totalCableLength,
  )

  const pathEnd = path.at(-1)!
  let presetScreenRotation: Rotation3
  let screenCenter: Point3
  if (orientation === "sitsFlat") {
    presetScreenRotation = [0, 0, 0]
    screenCenter = [
      pathEnd[0],
      pathEnd[1] + size.height / 2,
      pathEnd[2] + flexCableThickness / 2 + screenGap,
    ]
  } else if (orientation === "sitsFlatBelowBoard") {
    presetScreenRotation = [0, Math.PI, 0]
    screenCenter = [
      pathEnd[0],
      pathEnd[1] + size.height / 2,
      pathEnd[2] - flexCableThickness / 2 - screenGap,
    ]
  } else if (orientation === "foldedToFaceAboveBoard") {
    presetScreenRotation = [0, 0, 0]
    screenCenter = [pathEnd[0], pathEnd[1] - size.height / 2, foldedScreenBackZ]
  } else if (orientation === "foldedToFaceBelowBoard") {
    presetScreenRotation = [0, Math.PI, 0]
    screenCenter = [pathEnd[0], pathEnd[1] - size.height / 2, foldedScreenBackZ]
  } else if (orientation === "foldedToRightAngleAboveBoard") {
    presetScreenRotation = [Math.PI / 2, 0, 0]
    screenCenter = [
      pathEnd[0],
      pathEnd[1] - flexCableThickness / 2 - screenGap,
      pathEnd[2] + size.height / 2,
    ]
  } else {
    presetScreenRotation = [-Math.PI / 2, 0, 0]
    screenCenter = [
      pathEnd[0],
      pathEnd[1] + flexCableThickness / 2 + screenGap,
      pathEnd[2] - size.height / 2,
    ]
  }
  screenCenter = [
    screenCenter[0] + (screenOffset?.x ?? 0),
    screenCenter[1] + (screenOffset?.y ?? 0),
    screenCenter[2] + (screenOffset?.z ?? 0),
  ]

  const conductorOffsets = Array.from({ length: conductorCount }, (_, index) =>
    conductorCount === 1
      ? 0
      : (index - (conductorCount - 1) / 2) * resolvedConductorPitch,
  )
  const conductorNormalOffset = (flexCableThickness + conductorThickness) / 2
  const stiffenerNormalOffset = -(flexCableThickness + stiffenerThickness) / 2

  const assembly = (
    <>
      {showFlexCable && (
        <CableStrip
          points={path}
          width={resolvedCableWidth}
          thickness={flexCableThickness}
          color={flexCableColor}
        />
      )}

      {showFlexCable && showStiffeners && resolvedStiffenerLength > EPSILON && (
        <>
          <CableStrip
            points={startStiffener}
            width={resolvedCableWidth}
            thickness={stiffenerThickness}
            color={stiffenerColor}
            normalOffset={stiffenerNormalOffset}
          />
          <CableStrip
            points={endStiffener}
            width={resolvedCableWidth}
            thickness={stiffenerThickness}
            color={stiffenerColor}
            normalOffset={stiffenerNormalOffset}
          />
        </>
      )}

      {showFlexCable &&
        showConductors &&
        contactLength > EPSILON &&
        conductorOffsets.map((acrossOffset, index) => (
          <Fragment key={`conductor:${index}`}>
            <CableStrip
              points={startContacts}
              width={resolvedConductorWidth}
              thickness={conductorThickness}
              color={conductorColor}
              acrossOffset={acrossOffset}
              normalOffset={conductorNormalOffset}
            />
            <CableStrip
              points={endContacts}
              width={resolvedConductorWidth}
              thickness={conductorThickness}
              color={conductorColor}
              acrossOffset={acrossOffset}
              normalOffset={conductorNormalOffset}
            />
          </Fragment>
        ))}

      {showScreen && (
        <Translate offset={screenCenter}>
          <Rotate rotation={screenRotation ?? presetScreenRotation}>
            <Screen
              width={size.width}
              height={size.height}
              thickness={screenThickness}
              bezelInset={bezelInset}
              bezelDepth={bezelDepth}
              screenWidth={activeAreaWidth}
              screenHeight={activeAreaHeight}
              screenColor={screenColor}
              bezelColor={bezelColor}
            />
          </Rotate>
        </Translate>
      )}
    </>
  )

  return (
    <Translate
      offset={{
        x: offset?.x ?? 0,
        y: offset?.y ?? 0,
        z: offset?.z ?? 0,
      }}
    >
      <Translate offset={start}>
        <Rotate rotation={rotation}>
          <Translate offset={[-start[0], -start[1], -start[2]]}>
            {assembly}
          </Translate>
        </Rotate>
      </Translate>
    </Translate>
  )
}

export default FlexScreen
