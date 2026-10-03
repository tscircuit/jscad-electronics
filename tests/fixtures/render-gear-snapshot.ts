import { mp } from "@tscircuit/modelprinter"
import { createSpurGearMesh } from "../../lib/mechanical/spur-gear-mesh"
import { createWormGearMesh } from "../../lib/mechanical/worm-gear-mesh"
import { renderModelSnapshot } from "./render-model-snapshot"

export function renderSpurGearSnapshot(modelString: string) {
  const definition = mp.string(modelString).json()
  if (definition.fn !== "spurgear") throw new Error("Expected spur gear")
  const { fn, ...props } = definition
  const diameter = props.module * (props.toothCount + 2)
  const height = props.faceWidth + props.hubLength
  const targetZ = height / 2
  const span = Math.max(diameter * 1.22, height * 1.5)
  return renderModelSnapshot({
    mesh: createSpurGearMesh(props),
    title: "SPUR GEAR / INVOLUTE TEETH, BORE AND HUB",
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "INVOLUTE FLANKS AND RAISED HUB",
        eye: [diameter * 1.1, -diameter * 1.4, diameter * 1.15],
        target: [0, 0, targetZ],
        span,
      },
      {
        name: "TOP",
        detail: "TOOTH PROFILE AND THROUGH BORE",
        eye: [0, 0, diameter * 2],
        target: [0, 0, targetZ],
        span,
      },
      {
        name: "FRONT",
        detail: "FACE WIDTH AND HUB LENGTH",
        eye: [0, -diameter * 2, targetZ],
        target: [0, 0, targetZ],
        span,
      },
      {
        name: "UNDERSIDE",
        detail: "CONTINUOUS BODY AND BORE EXIT",
        eye: [-diameter * 1.1, -diameter * 1.4, -diameter * 1.15],
        target: [0, 0, targetZ],
        span,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / APPROXIMATE ROOT TRANSITION",
  })
}

export function renderWormGearSnapshot(modelString: string) {
  const definition = mp.string(modelString).json()
  if (definition.fn !== "wormgear") throw new Error("Expected worm gear")
  const { fn, ...props } = definition
  const diameter = props.pitchDiameter + 2 * props.module
  const targetZ = props.length / 2
  const span = Math.max(props.length, diameter) * 1.5
  const hand = props.handedness.toUpperCase()
  return renderModelSnapshot({
    mesh: createWormGearMesh(props),
    title: `WORM GEAR / ${hand} HAND / ${props.starts} START${props.starts === 1 ? "" : "S"}`,
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "HELICAL CRESTS AND CLOSED ENDS",
        eye: [diameter * 2.5, -diameter * 3, props.length * 1.8],
        target: [0, 0, targetZ],
        span,
      },
      {
        name: "TOP",
        detail: "END PROFILE AND NUMBER OF STARTS",
        eye: [0, 0, props.length + 45],
        target: [0, 0, targetZ],
        span: diameter * 1.4,
      },
      {
        name: "FRONT",
        detail: `${hand}-HAND HELIX AND AXIAL LENGTH`,
        eye: [0, -diameter * 3.5, targetZ],
        target: [0, 0, targetZ],
        span,
      },
      {
        name: "RIGHT",
        detail: "HELICAL PITCH AND CREST SPACING",
        eye: [diameter * 3.5, 0, targetZ],
        target: [0, 0, targetZ],
        span,
      },
    ],
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / VISUAL WORM APPROXIMATION",
  })
}
