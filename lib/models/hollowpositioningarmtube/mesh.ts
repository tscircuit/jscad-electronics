import {
  getHollowPositioningArmTubeDimensions,
  getHollowPositioningArmTubeFrame,
  hollowPositioningArmTubeModelPropsSchema,
  type HollowPositioningArmTubeModelPropsInput,
} from "@tscircuit/modelprinter"

export interface HollowPositioningArmTubeMesh {
  positions: number[]
  indices: number[]
}

export interface HollowPositioningArmTubeMeshOptions {
  radialSegments?: number
  segmentsPerRib?: number
}

/** One closed annular sweep with open ends and a smooth, continuous wire bore. */
export function createHollowPositioningArmTubeMesh(
  input: HollowPositioningArmTubeModelPropsInput,
  options: HollowPositioningArmTubeMeshOptions = {},
): HollowPositioningArmTubeMesh {
  const props = hollowPositioningArmTubeModelPropsSchema.parse(input)
  const dimensions = getHollowPositioningArmTubeDimensions(props)
  const radialSegments = options.radialSegments ?? 24
  const segmentsPerRib = options.segmentsPerRib ?? 4
  for (const [name, value, minimum, maximum] of [
    ["radialSegments", radialSegments, 12, 128],
    ["segmentsPerRib", segmentsPerRib, 4, 32],
  ] as const)
    if (
      !Number.isInteger(value) ||
      value < minimum ||
      value > maximum ||
      value % 4 !== 0
    )
      throw new Error(
        `${name} must be a multiple of four in [${minimum},${maximum}]`,
      )

  const { totalLength, bendLength, minimumWallThickness } = dimensions
  const innerRadius = props.innerDiameter / 2
  const scale = Math.max(totalLength, props.outerDiameter)
  const tolerance = scale * 1e-10
  if (Math.min(innerRadius, minimumWallThickness, totalLength) <= tolerance)
    throw new Error(
      "Hollow positioning arm tube wall, bore or length exceeds mesh resolution limit",
    )

  // Limit centerline chord error relative to the bore and wall as well as angle.
  const sagitta = Math.min(innerRadius, minimumWallThickness) * 0.02
  const angleStep = Math.min(
    Math.PI / 36,
    2 * Math.acos(1 - Math.min(sagitta / props.bendRadius, 1)),
  )
  const bendSteps =
    props.bendAngle === 0
      ? 0
      : Math.ceil((props.bendAngle * Math.PI) / 180 / angleStep)
  const ribSteps =
    props.ribDepth === 0
      ? 0
      : Math.ceil((totalLength / props.ribPitch) * segmentsPerRib)
  const maximumRings = Math.floor(250000 / (2 * radialSegments))
  if (
    !Number.isSafeInteger(bendSteps + ribSteps) ||
    bendSteps + ribSteps + 5 > maximumRings
  )
    throw new Error(
      "Hollow positioning arm tube exceeds mesh resolution limit (250000 vertices)",
    )

  const samples = [
    0,
    props.startLength,
    props.startLength + bendLength,
    totalLength,
  ]
  for (let i = 1; i < bendSteps; i++)
    samples.push(props.startLength + (bendLength * i) / bendSteps)
  for (let i = 1; i < ribSteps; i++)
    samples.push((i * props.ribPitch) / segmentsPerRib)
  samples.sort((a, b) => a - b)
  // Coincident rib and bend boundaries share one ring, preventing sliver faces.
  const stations = samples.filter(
    (s, i) => i === 0 || s - samples[i - 1]! > tolerance,
  )
  if (totalLength - stations[stations.length - 1]! <= tolerance)
    stations[stations.length - 1] = totalLength

  const positions: number[] = []
  const indices: number[] = []
  const stride = radialSegments * 2
  for (const s of stations) {
    const { position, normal } = getHollowPositioningArmTubeFrame(props, s)
    const outerRadius =
      props.outerDiameter / 2 -
      (props.ribDepth === 0
        ? 0
        : (props.ribDepth / 2) *
          (1 + Math.cos(2 * Math.PI * ((s / props.ribPitch) % 1))))
    for (const radius of [outerRadius, innerRadius])
      for (let j = 0; j < radialSegments; j++) {
        const angle = (j * 2 * Math.PI) / radialSegments
        const cosine =
          j === radialSegments / 4 || j === (3 * radialSegments) / 4
            ? 0
            : Math.cos(angle)
        const sine = j === 0 || j === radialSegments / 2 ? 0 : Math.sin(angle)
        positions.push(
          position[0] + radius * cosine * normal[0],
          radius * sine,
          position[2] + radius * cosine * normal[2],
        )
      }
  }
  const quad = (a: number, b: number, c: number, d: number) => {
    indices.push(a, b, c, a, c, d)
  }
  for (let ring = 0; ring + 1 < stations.length; ring++)
    for (let j = 0; j < radialSegments; j++) {
      const next = (j + 1) % radialSegments
      const a = ring * stride
      const b = (ring + 1) * stride
      quad(a + j, a + next, b + next, b + j)
      quad(
        a + radialSegments + j,
        b + radialSegments + j,
        b + radialSegments + next,
        a + radialSegments + next,
      )
    }
  for (let j = 0; j < radialSegments; j++) {
    const next = (j + 1) % radialSegments
    quad(j, radialSegments + j, radialSegments + next, next)
    const end = (stations.length - 1) * stride
    quad(
      end + j,
      end + next,
      end + radialSegments + next,
      end + radialSegments + j,
    )
  }
  return { positions, indices }
}
