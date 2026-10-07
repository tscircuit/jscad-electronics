import type { BallBearingModelPropsInput } from "@tscircuit/modelprinter"

export const ballBearingFaceStates = ["open", "shielded", "sealed"] as const
export type BallBearingFaceState = (typeof ballBearingFaceStates)[number]

const topFlags = {
  open: { topSideOpen: true },
  shielded: { topSideShielded: true },
  sealed: { topSideSealed: true },
} as const
const bottomFlags = {
  open: { bottomSideOpen: true },
  shielded: { bottomSideShielded: true },
  sealed: { bottomSideSealed: true },
} as const

export function ballBearingFaceInput(
  top: BallBearingFaceState,
  bottom: BallBearingFaceState,
  dimensions = { innerDiameter: 8, outerDiameter: 22, width: 7 },
): BallBearingModelPropsInput {
  return { ...dimensions, ...topFlags[top], ...bottomFlags[bottom] }
}

export const ballBearingFaceCases = ballBearingFaceStates.flatMap((top) =>
  ballBearingFaceStates.map((bottom) => {
    // Exercise the canonical 625 asymmetric example alongside the 608 matrix.
    const dimensions =
      top === "open" && bottom === "shielded"
        ? { innerDiameter: 5, outerDiameter: 16, width: 5 }
        : { innerDiameter: 8, outerDiameter: 22, width: 7 }
    const flags =
      top === bottom ? `bothsides${top}` : `topside${top}_bottomside${bottom}`
    return {
      top,
      bottom,
      dimensions,
      input: ballBearingFaceInput(top, bottom, dimensions),
      modelString: `ballbearing_id${dimensions.innerDiameter}mm_od${dimensions.outerDiameter}mm_w${dimensions.width}mm_${flags}`,
      name:
        top === bottom
          ? `ballbearing-${top}`
          : `ballbearing-top-${top}-bottom-${bottom}`,
    }
  }),
)
