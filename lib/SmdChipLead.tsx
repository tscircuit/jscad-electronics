import {
  Polygon,
  ExtrudeLinear,
  Translate,
  Rotate,
  Colorize,
} from "jscad-fiber"
import { getExpandedStroke } from "./utils/getExpandedStroke"

export interface SmdChipLeadProps {
  thickness: number
  width: number
  height: number
  padContactLength: number
  bodyDistance: number
  curveLength?: number
  rotation?: number
  positionAnchor?: "outer-edge"
  position?: { x: number; y: number; z?: number }
}

function calculateSCurve(
  x: number,
  {
    height,
    padContactLength,
    curveLength,
    bodyDistance,
    steepness = 10,
  }: SmdChipLeadProps & { steepness?: number },
) {
  if (!curveLength) curveLength = bodyDistance * 0.3
  let flatFromBodySectionLength = bodyDistance - padContactLength - curveLength
  if (flatFromBodySectionLength < 0) {
    curveLength += flatFromBodySectionLength
    flatFromBodySectionLength = 0
  }
  const curveStart = padContactLength * 0.75
  const curveEnd =
    padContactLength +
    curveLength +
    (bodyDistance - padContactLength - curveLength) * 0.25

  if (x <= curveStart) return 0
  if (x >= curveEnd) return height

  const t = (x - curveStart) / (curveEnd - curveStart)

  // Generalized logistic function (Richards curve)
  return height / (1 + Math.exp(-steepness * (t - 0.5)))
}

/**
 * Curved lead for an SMD chip
 */
export const SmdChipLead = (props: SmdChipLeadProps) => {
  const { thickness, width, padContactLength, bodyDistance, height, rotation } =
    props

  const N = 15

  const points = Array.from({ length: N })
    .map((_, i) => (i / (N - 1)) * bodyDistance)
    .map((x) => [x, calculateSCurve(x, props)] as [number, number])
  // const points = [
  //   [0, 0],
  //   [padContactLength / 2, 0],
  //   ...Array.from({ length: N })
  //     .map((_, i) => padContactLength + ((i + 1) / (N + 1)) * curveLength)
  //     .map((x) => [x, calculateSCurve(x, props)] as [number, number]),
  //   [
  //     bodyDistance - (bodyDistance - (padContactLength + curveLength)) / 2,
  //     height,
  //   ],
  //   [bodyDistance, height],
  // ]

  const polygon = getExpandedStroke(points, thickness)
  return (
    <Colorize color="#fff">
      <Translate offset={{ z: 0, y: 0, x: 0, ...props.position }}>
        <Rotate rotation={[0, rotation ?? 0, 0]}>
          <Translate offset={{ x: 0, y: 0, z: -width / 2 }}>
            <ExtrudeLinear height={width}>
              <Polygon points={polygon.map((p) => [p.x, p.y])} />
            </ExtrudeLinear>
          </Translate>
        </Rotate>
      </Translate>
    </Colorize>
  )
}
