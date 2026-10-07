import { mp } from "@tscircuit/modelprinter"
import { createTorsionSpringMesh } from "../../lib/models/torsionspring"
import { meshBounds } from "./assert-gear-geometry"
import { renderModelSnapshot } from "./render-model-snapshot"
export function renderTorsionSpringSnapshot(modelString: string) {
  const definition = mp.string(modelString).json()
  if (definition.fn !== "torsionspring")
    throw new Error("Expected torsionspring")
  const { fn, ...props } = definition
  const mesh = createTorsionSpringMesh(props)
  const { minimum, maximum } = meshBounds(mesh)
  const target = minimum.map((v, i) => (v + maximum[i]!) / 2) as [
    number,
    number,
    number,
  ]
  const span = Math.max(...maximum.map((v, i) => v - minimum[i]!)) * 1.65
  const [x, y, z] = target,
    distance = span * 5
  return renderModelSnapshot({
    mesh,
    modelString,
    title: "TORSION SPRING / TANGENT LEGS",
    views: [
      {
        name: "ISOMETRIC",
        detail: "FREE STATE / OPEN COILS",
        eye: [x + distance, y - distance, z + distance],
        target,
        span,
      },
      {
        name: "TOP",
        detail: "COIL AXIS +Z",
        eye: [x, y, z + distance],
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "CIRCULAR WIRE / NORMAL-CUT ENDS",
        eye: [x, y - distance, z],
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "STRAIGHT LEGS FOLLOW HELIX TANGENT",
        eye: [x + distance, y, z],
        target,
        span,
      },
    ],
    footer:
      "GENERIC GEOMETRY / DIMENSIONS IN mm / NO SPRING RATE OR LOAD CLAIM",
  })
}
