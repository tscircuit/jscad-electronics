import {
  createConnectorMeshes,
  connectorWireExitDepth,
} from "./connector-meshes"
import { placeConnectorMesh } from "./geometry-to-mesh"
import { createCablePathFrames } from "./path-frames"
import { sweepRoundCable } from "./sweep-round-cable"
import type {
  CableColor,
  CableGeometryDefinition,
  CableMesh,
  CablePoint,
} from "./types"

function parseCableColor(color: string): CableColor {
  if (!/^#[a-f\d]{6}$/i.test(color))
    throw new Error("Cable colors must be six-digit hex strings")
  return [
    parseInt(color.slice(1, 3), 16) / 255,
    parseInt(color.slice(3, 5), 16) / 255,
    parseInt(color.slice(5, 7), 16) / 255,
    1,
  ]
}

function validateCableDefinition(definition: CableGeometryDefinition) {
  for (const connector of [definition.connectorA, definition.connectorB]) {
    const dimensions = [
      connector.bodyWidth,
      connector.bodyHeight,
      connector.bodyDepth,
    ]
    if (connector.kind === "usb_c_plug")
      dimensions.push(
        connector.shellWidth,
        connector.shellHeight,
        connector.shellDepth,
      )
    if (
      dimensions.some(
        (dimension) => !Number.isFinite(dimension) || dimension <= 0,
      )
    )
      throw new Error("Connector dimensions must be finite and positive")
    if (
      "pinCount" in connector &&
      (!Number.isInteger(connector.pinCount) ||
        connector.pinCount < 2 ||
        !Number.isFinite(connector.pitch) ||
        connector.pitch <= 0)
    )
      throw new Error(
        "JST connectors need a positive pitch and at least two contacts",
      )
  }
  const crossSection = definition.crossSection
  const diameters =
    crossSection.kind === "round_jacket"
      ? [crossSection.diameter]
      : crossSection.wires.map((wire) => wire.diameter)
  if (
    diameters.length === 0 ||
    diameters.some((diameter) => !Number.isFinite(diameter) || diameter <= 0)
  )
    throw new Error("Cable diameters must be finite and positive")
  if (crossSection.kind === "wire_bundle") {
    if (
      !Number.isFinite(crossSection.wirePitch) ||
      crossSection.wires.some((wire) => wire.diameter > crossSection.wirePitch)
    )
      throw new Error("Insulated bundle wires must not overlap")
    for (const connector of [definition.connectorA, definition.connectorB]) {
      if (
        !("pinCount" in connector) ||
        connector.pinCount !== crossSection.wires.length
      )
        throw new Error("Bundle wire count must match connector contact count")
    }
  }
}

/** Mesh generation only. Path samples are already resolved in world millimeters, +Z up. */
export function createCableMeshes({
  definition,
  path,
  radialSegments = 24,
  startPin1Side,
  endPin1Side,
}: {
  definition: CableGeometryDefinition
  path: CablePoint[]
  radialSegments?: number
  /** Directions from connector center toward pin 1 (local -X), in circuit-world XYZ (+Z up), no translation. */
  startPin1Side?: CablePoint
  endPin1Side?: CablePoint
}): CableMesh[] {
  validateCableDefinition(definition)
  if (
    !Number.isInteger(radialSegments) ||
    radialSegments < 8 ||
    radialSegments > 128
  )
    throw new Error("radialSegments must be an integer from 8 to 128")
  const frames = createCablePathFrames(path, {
    startPin1Side,
    endPin1Side,
  })
  const crossSection = definition.crossSection
  const jacketDiameter =
    crossSection.kind === "round_jacket" ? crossSection.diameter : undefined
  const meshes =
    crossSection.kind === "round_jacket"
      ? [
          sweepRoundCable({
            frames,
            diameter: crossSection.diameter,
            radialSegments,
            color: parseCableColor(crossSection.color),
            name: "jacket",
          }),
        ]
      : crossSection.wires.map((wire, index) =>
          sweepRoundCable({
            frames,
            diameter: wire.diameter,
            offset:
              (index - (crossSection.wires.length - 1) / 2) *
              crossSection.wirePitch,
            radialSegments,
            color: parseCableColor(wire.color),
            name: `wire-${index + 1}`,
          }),
        )
  for (const [index, connector] of [
    definition.connectorA,
    definition.connectorB,
  ].entries()) {
    const frame = index === 0 ? frames[0]! : frames.at(-1)!
    const parts = createConnectorMeshes({ connector, jacketDiameter })
    meshes.push(
      ...parts.map((mesh) =>
        placeConnectorMesh({
          mesh: { ...mesh, name: `${index === 0 ? "A" : "B"}-${mesh.name}` },
          frame,
          isEnd: index === 1,
          wireExitDepth: connectorWireExitDepth(connector),
        }),
      ),
    )
  }
  return meshes
}
