import { mp } from "@tscircuit/modelprinter"
import { createGooseneckMesh } from "../../lib/models/gooseneck"
import { meshBounds } from "./assert-gear-geometry"
import { renderModelSnapshot } from "./render-model-snapshot"

export function renderGooseneckSnapshot(modelString: string, title: string) {
  const definition = mp.string(modelString).json()
  if (definition.fn !== "gooseneck") throw new Error("Expected gooseneck")
  const { fn, ...props } = definition
  const mesh = createGooseneckMesh(props)
  const { minimum, maximum } = meshBounds(mesh)
  const x = (minimum[0]! + maximum[0]!) / 2
  const z = (minimum[2]! + maximum[2]!) / 2
  const width = maximum[0]! - minimum[0]!
  const height = maximum[2]! - minimum[2]!
  const span = Math.max(width, height) * 1.5
  const target = [x, 0, z] as const
  const distance = span * 5
  return renderModelSnapshot({
    mesh,
    title,
    modelString,
    color: [0.23, 0.28, 0.34, 1],
    views: [
      {
        name: "ISOMETRIC",
        detail: "HOLLOW TUBE / OPEN ENDS",
        eye: [x + distance, -distance, z + distance],
        target,
        span,
      },
      {
        name: "TOP",
        detail: `${props.outerDiameter} mm OD / ${props.innerDiameter} mm BORE`,
        eye: [x, 0, z + distance],
        target,
        span: Math.max(width, props.outerDiameter) * 1.15,
      },
      {
        name: "FRONT",
        detail: `${props.bendAngle} DEG / R ${props.bendRadius} mm / XZ PLANE`,
        eye: [x, -distance, z],
        target,
        span,
      },
      {
        name: "SIDE",
        detail: `RIB PITCH ${props.ribPitch} mm / DEPTH ${props.ribDepth} mm`,
        eye: [x + distance, 0, z],
        target,
        span: Math.max(height, props.outerDiameter) * 1.4,
      },
    ],
    footer:
      "GENERIC POSE REFERENCE / DIMENSIONS IN mm / NO FITTINGS OR LOAD RATING",
  })
}
