import type { CableGeometryDefinition } from "../../lib/cables"

const bullet = (diameter: number) => ({
  kind: "bullet_female" as const,
  diameter,
  contactDepth: diameter * 2,
  pinCount: 3,
  pitch: diameter + 2,
  bodyWidth: diameter + 1 + 2 * (diameter + 2),
  bodyHeight: diameter + 1,
  bodyDepth: diameter * 3.5,
})
const jst = (pitch: number, pinCount: number) => ({
  kind: pitch === 1 ? ("jst_sh_housing" as const) : ("jst_ph_housing" as const),
  pinCount,
  pitch,
  bodyWidth: pitch === 1 ? pinCount + 1 : (pinCount - 1) * 2 + 3.8,
  bodyHeight: pitch === 1 ? 2.8 : 4.5,
  bodyDepth: pitch === 1 ? 5 : 6.85,
})

export const adapterCableExamples: {
  name: string
  modelString: string
  definition: CableGeometryDefinition
}[] = [
  {
    name: "bullet-bullet",
    modelString:
      "adaptercable_a(bullet3_d3.5mm_gfemale)_b(bullet3_d4mm_gfemale)",
    definition: {
      connectorA: bullet(3.5),
      connectorB: bullet(4),
      crossSection: {
        kind: "wire_bundle",
        wirePitch: 6,
        wires: ["#df4049", "#263449", "#e1b13c"].map((color) => ({
          diameter: 2,
          color,
        })),
      },
    },
  },
  {
    name: "bullet-jst",
    modelString: "adaptercable_a(bullet3_d3.5mm_gfemale)_b(jst_ph_pins3)",
    definition: {
      connectorA: bullet(3.5),
      connectorB: jst(2, 3),
      crossSection: {
        kind: "wire_bundle",
        wirePitch: 5.5,
        wires: ["#df4049", "#263449", "#e1b13c"].map((color) => ({
          diameter: 1.2,
          color,
        })),
      },
    },
  },
  {
    name: "jst-sh-ph",
    modelString: "adaptercable_a(jst_sh_pins4)_b(jst_ph_pins4)",
    definition: {
      connectorA: jst(1, 4),
      connectorB: jst(2, 4),
      crossSection: {
        kind: "wire_bundle",
        wirePitch: 2,
        wires: ["#df4049", "#263449", "#e1b13c", "#347dc9"].map((color) => ({
          diameter: 0.6,
          color,
        })),
      },
    },
  },
]
