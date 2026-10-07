import {
  createConnectorMeshes,
  connectorWireExitDepth,
} from "./connector-meshes"
import { placeConnectorMesh } from "./geometry-to-mesh"
import { add, scale, createCablePathFrames } from "./path-frames"
import { createBundleFanoutPath } from "./create-bundle-fanout-path"
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
      connector.kind === "bullet_male" ||
      connector.kind === "bullet_female"
    ) {
      const pinCount = connector.pinCount ?? 1
      const pitch = connector.pitch ?? connector.bodyHeight
      dimensions.push(connector.diameter, connector.contactDepth, pitch)
      if (
        !Number.isInteger(pinCount) ||
        pinCount < 1 ||
        pinCount > 16 ||
        connector.bodyHeight <= connector.diameter ||
        pitch < connector.bodyHeight ||
        Math.abs(
          connector.bodyWidth - (connector.bodyHeight + (pinCount - 1) * pitch),
        ) > 1e-6 ||
        connector.contactDepth >= connector.bodyDepth ||
        connector.contactDepth <= connector.diameter / 2
      )
        throw new Error("Bullet contact must fit inside its cylindrical body")
      if (
        (pinCount === 1 &&
          (definition.crossSection.kind !== "round_jacket" ||
            definition.crossSection.diameter > connector.bodyHeight)) ||
        (pinCount > 1 &&
          (definition.crossSection.kind !== "wire_bundle" ||
            definition.crossSection.wires.length !== pinCount ||
            definition.crossSection.wires.some(
              (wire) => wire.diameter > connector.bodyHeight,
            )))
      )
        throw new Error(
          "Bullet cables require one insulated wire per contact that fits its solder cup",
        )
    }
    if (
      dimensions.some(
        (dimension) => !Number.isFinite(dimension) || dimension <= 0,
      )
    )
      throw new Error("Connector dimensions must be finite and positive")
    if (
      (connector.kind === "jst_sh_housing" ||
        connector.kind === "jst_ph_housing") &&
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
        (connector.pinCount ?? 1) !== crossSection.wires.length
      )
        throw new Error("Bundle wire count must match connector contact count")
      if (
        "pitch" in connector &&
        crossSection.wires.some((wire) => wire.diameter > connector.pitch)
      )
        throw new Error("Insulated wires must fit each connector pitch")
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
  /** Connector center toward pin 1 (local -X), in right-handed world XYZ, +Z up; directions, no translation. */
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
  const frames = createCablePathFrames(path, { startPin1Side, endPin1Side })
  const crossSection = definition.crossSection
  const jacketDiameter =
    crossSection.kind === "round_jacket" ? crossSection.diameter : undefined
  // Endpoint pitches are connector-local mm. Offset along transported normals
  // in the same right-handed +Z-up world frame as the supplied centerline.
  // Keep the middle compact; widen only near the connector wire exits.
  const pitchA =
    "pitch" in definition.connectorA ? definition.connectorA.pitch : undefined
  const pitchB =
    "pitch" in definition.connectorB ? definition.connectorB.pitch : undefined
  const fanout =
    pitchA !== pitchB && crossSection.kind === "wire_bundle"
      ? createBundleFanoutPath(path)
      : undefined
  const fanoutFrames = fanout
    ? createCablePathFrames(fanout.path, { startPin1Side, endPin1Side })
    : frames
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
      : crossSection.wires.map((wire, index) => {
          const contactOffset = index - (crossSection.wires.length - 1) / 2
          // 20% clearance around the thickest insulated wire, capped by the
          // declared bundle and both connector pitches to prevent overlap.
          const compactPitch = Math.min(
            crossSection.wirePitch,
            pitchA ?? crossSection.wirePitch,
            pitchB ?? crossSection.wirePitch,
            1.2 * Math.max(...crossSection.wires.map((wire) => wire.diameter)),
          )
          const smoothstep = (progress: number) =>
            progress * progress * (3 - 2 * progress)
          const wireFrames = fanout
            ? createCablePathFrames(
                fanoutFrames.map((frame, pathIndex) => {
                  const distance = fanout.distances[pathIndex]!
                  const start =
                    1 - smoothstep(Math.min(1, distance / fanout.endLength))
                  const end =
                    1 -
                    smoothstep(
                      Math.min(
                        1,
                        (fanout.length - distance) / fanout.endLength,
                      ),
                    )
                  const pitch =
                    compactPitch +
                    ((pitchA ?? crossSection.wirePitch) - compactPitch) *
                      start +
                    ((pitchB ?? crossSection.wirePitch) - compactPitch) * end
                  return add(
                    frame.point,
                    scale(frame.normal, contactOffset * pitch),
                  )
                }),
              )
            : frames
          return sweepRoundCable({
            frames: wireFrames,
            diameter: wire.diameter,
            offset: (fanout ? 0 : contactOffset) * crossSection.wirePitch,
            radialSegments,
            color: parseCableColor(wire.color),
            name: `wire-${index + 1}`,
          })
        })
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
