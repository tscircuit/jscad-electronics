import type { CableGeometryDefinition, CablePoint } from "../../lib/cables"

const usb = {
  kind: "usb_c_plug" as const,
  bodyWidth: 12,
  bodyHeight: 6,
  bodyDepth: 18,
  shellWidth: 8.25,
  shellHeight: 2.4,
  shellDepth: 6.5,
}
const sh = {
  kind: "jst_sh_housing" as const,
  bodyWidth: 5,
  bodyHeight: 2.8,
  bodyDepth: 5,
  pinCount: 4,
  pitch: 1,
}
const ph = {
  kind: "jst_ph_housing" as const,
  bodyWidth: 5.8,
  bodyHeight: 4.5,
  bodyDepth: 6.85,
  pinCount: 2,
  pitch: 2,
}
export const cableExamples: CableGeometryDefinition[] = [
  {
    connectorA: usb,
    connectorB: usb,
    crossSection: { kind: "round_jacket", diameter: 4, color: "#263449" },
  },
  {
    connectorA: sh,
    connectorB: sh,
    crossSection: {
      kind: "wire_bundle",
      wirePitch: 1,
      wires: ["#df4049", "#263449", "#e1b13c", "#347dc9"].map((color) => ({
        diameter: 0.6,
        color,
      })),
    },
  },
  {
    connectorA: ph,
    connectorB: ph,
    crossSection: {
      kind: "wire_bundle",
      wirePitch: 2,
      wires: ["#df4049", "#263449"].map((color) => ({ diameter: 1.2, color })),
    },
  },
  {
    connectorA: {
      kind: "nema_5_15p",
      bodyWidth: 32,
      bodyHeight: 28,
      bodyDepth: 35,
    },
    connectorB: {
      kind: "iec_c13",
      bodyWidth: 24,
      bodyHeight: 18,
      bodyDepth: 30,
    },
    crossSection: { kind: "round_jacket", diameter: 6.2, color: "#263449" },
  },
]

export const cableExamplePath: CablePoint[] = Array.from(
  { length: 73 },
  (_, index) => {
    const t = index / 72
    const u = 1 - t
    return [
      90 *
        (-0.5 * u ** 3 -
          0.5 * 3 * u ** 2 * t +
          0.5 * 3 * u * t ** 2 +
          0.5 * t ** 3),
      65 * 3 * u * t,
      -18 * 3 * u * t,
    ]
  },
)
