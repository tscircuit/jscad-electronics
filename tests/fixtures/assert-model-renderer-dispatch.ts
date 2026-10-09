import { expect } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { mp } from "@tscircuit/modelprinter"
import { createJSCADRenderer } from "jscad-fiber"
import { createElement, isValidElement, type ComponentType } from "react"
import type { AnyCircuitElement } from "circuit-json"
import { ExtrudedPads } from "../../lib/ExtrudedPads"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { FlexScreen } from "../../lib/FlexScreen"
import { HelicalGear } from "../../lib/HelicalGear"
import { HexSocketBolt } from "../../lib/HexSocketBolt"
import { NemaMotor } from "../../lib/NemaMotor"
import { SheetMetal } from "../../lib/SheetMetal"
import { SpurGear } from "../../lib/SpurGear"
import { WormGear } from "../../lib/WormGear"
import { HexBolt } from "../../lib/models/hexbolt"
import { A0402 } from "../../lib/A0402"
import { SOIC } from "../../lib/SOIC"
import { importVanilla } from "./importVanilla.js"

type Solid = jscad.geometries.geom3.Geom3

export const mechanicalModels = [
  {
    name: "hexbolt",
    source: "hexbolt_m6_l25mm_drive(hex)_nothreads",
    invalid: "hexbolt_m6_l0mm_drive(hex)",
    component: HexBolt,
  },
  {
    name: "nema",
    source: "nema17_l40mm_round",
    invalid: "nema17_l0mm",
    component: NemaMotor,
  },
  {
    name: "hexsocketbolt",
    source: "hexsocketbolt_m3_l6mm_nothreads",
    invalid: "hexsocketbolt_m3_l0mm",
    component: HexSocketBolt,
  },
  {
    name: "sheetmetal",
    source: "sheetmetal_plate_w20mm_l16mm_t1mm",
    invalid: "sheetmetal_plate_w0mm_l16mm_t1mm",
    component: SheetMetal,
  },
  {
    name: "helicalgear",
    source: "helicalgear_teeth8_module1mm_width2mm",
    invalid: "helicalgear_teeth0",
    component: HelicalGear,
  },
  {
    name: "spurgear",
    source: "spurgear_teeth8_module1mm_width2mm",
    invalid: "spurgear_teeth0",
    component: SpurGear,
  },
  {
    name: "wormgear",
    source: "wormgear_length8mm_turnsegments12_segments24",
    invalid: "wormgear_length0mm",
    component: WormGear,
  },
] as const

const flexscreen = {
  name: "flexscreen",
  source:
    "flexscreen8_w16mm_h10mm_flex5mm_p0.5mm_sitsflat_hidescreen_hidestiffeners_hideconductors",
  component: FlexScreen,
} as const

function renderComponent<P extends object>(
  component: ComponentType<P>,
  props: P,
): Solid[] {
  const solids: Solid[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscad as never)
  createJSCADRoot(solids).render(createElement(component, props))
  return solids
}

function signature(solids: Solid[]) {
  return {
    count: solids.length,
    bounds: jscad.measurements.measureAggregateBoundingBox(...solids),
    volume: solids.reduce(
      // Mirrored legacy leads have opposite winding between renderers.
      // Compare occupied volume rather than their signed surface orientation.
      (sum, solid) => sum + Math.abs(jscad.measurements.measureVolume(solid)),
      0,
    ),
  }
}

export function assertSynchronousRendererDispatch() {
  for (const { source, name, component } of [...mechanicalModels, flexscreen]) {
    const definition = mp.string(source).json()
    expect(definition.fn).toBe(name)
    const { fn, ...props } = definition
    const routed = Footprinter3d({ footprint: source })
    expect(isValidElement(routed)).toBe(true)
    if (!isValidElement<Record<string, unknown>>(routed))
      throw new Error("Dispatch did not synchronously return a React element")
    expect<unknown>(routed.type).toBe(component)
    expect<unknown>(routed.props).toEqual(props)
  }
}

export async function assertReactAndVanillaRendererDispatch() {
  const vanilla = await importVanilla()
  for (const { source, component } of [...mechanicalModels, flexscreen]) {
    const { fn, ...props } = mp.string(source).json()
    const expected = signature(
      renderComponent(
        component as ComponentType<Record<string, unknown>>,
        props,
      ),
    )
    const routed = signature(
      renderComponent(Footprinter3d, { footprint: source }),
    )
    const built = signature(
      vanilla
        .getJscadModelForFootprint(source, jscad)
        .geometries.map(({ geom }: { geom: Solid }) => geom),
    )
    expect(expected.count).toBeGreaterThan(0)
    expect(expected.volume).toBeGreaterThan(0)
    expect(routed.count).toBe(expected.count)
    expect(routed.bounds).toEqual(expected.bounds)
    expect(routed.volume).toBeCloseTo(expected.volume, 8)
    expect(built.count).toBe(expected.count)
    expect(built.bounds).toEqual(expected.bounds)
    expect(built.volume).toBeCloseTo(expected.volume, 8)
  }
}

export async function assertRendererPadPolicies() {
  const vanilla = await importVanilla()
  for (const { source, invalid } of mechanicalModels) {
    expect(ExtrudedPads({ footprint: source })).toBeNull()
    expect(() => ExtrudedPads({ footprint: invalid })).toThrow()
    expect(() => Footprinter3d({ footprint: invalid })).toThrow()
    const body = vanilla.getJscadModelForFootprint(source, jscad)
    const withPads = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(
      signature(withPads.geometries.map(({ geom }: { geom: Solid }) => geom)),
    ).toEqual(
      signature(body.geometries.map(({ geom }: { geom: Solid }) => geom)),
    )
  }
  // FlexScreen retains footprinter delegation. With the pinned dependency,
  // footprinter rejects this function; that error must not become silent null.
  let expectedCircuitJson: AnyCircuitElement[] | undefined
  let expectedError: Error | undefined
  try {
    expectedCircuitJson = fp
      .string(flexscreen.source)
      .circuitJson() as AnyCircuitElement[]
  } catch (error) {
    if (!(error instanceof Error)) throw error
    expectedError = error
  }
  const body = vanilla.getJscadModelForFootprint(flexscreen.source, jscad)
  expect(body.geometries.length).toBeGreaterThan(0)
  if (expectedError) {
    expect(() => ExtrudedPads({ footprint: flexscreen.source })).toThrow(
      expectedError.message,
    )
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(flexscreen.source, jscad),
    ).toThrow(expectedError.message)
  } else {
    const actualPads = renderComponent(ExtrudedPads, {
      footprint: flexscreen.source,
    })
    const expectedPads = renderComponent(ExtrudedPads, {
      circuitJson: expectedCircuitJson,
    })
    expect(actualPads.length).toBeGreaterThan(0)
    expect(signature(actualPads)).toEqual(signature(expectedPads))
    const withPads = vanilla.getJscadModelForFootprintWithPads(
      flexscreen.source,
      jscad,
    )
    expect(withPads.geometries.length).toBe(
      body.geometries.length + actualPads.length,
    )
  }
  expect(() => Footprinter3d({ footprint: "flexscreen8_p0mm" })).toThrow()
}

export function assertExplicitCircuitJsonBypassesPolicy() {
  const circuitJson = [
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "registry-pad",
      pcb_component_id: "registry-component",
      shape: "rect",
      x: 4,
      y: -3,
      width: 2,
      height: 1,
      layer: "top",
      port_hints: ["1"],
    },
  ] as AnyCircuitElement[]
  const reference = renderComponent(ExtrudedPads, { circuitJson })
  expect(reference).toHaveLength(1)
  expect(signature(reference).bounds).toEqual([
    [3, -3.5, -0.01],
    [5, -2.5, 0],
  ])
  for (const { source, invalid } of mechanicalModels) {
    for (const footprint of [source, invalid, "registryfixturemissing"]) {
      expect(
        signature(renderComponent(ExtrudedPads, { circuitJson, footprint })),
      ).toEqual(signature(reference))
      const empty = ExtrudedPads({ circuitJson: [], footprint })
      expect(isValidElement(empty)).toBe(true)
      expect(
        renderComponent(ExtrudedPads, { circuitJson: [], footprint }),
      ).toEqual([])
    }
  }
  expect(() => ExtrudedPads({})).toThrow(
    "No circuit json or footprint provided to ExtrudedPads",
  )
}

export async function assertLegacyRendererFallthrough() {
  const chip = Footprinter3d({ footprint: "0402" })
  const soic = Footprinter3d({ footprint: "soic8" })
  expect<unknown>(chip?.type).toBe(A0402)
  expect<unknown>(soic?.type).toBe(SOIC)
  const vanilla = await importVanilla()
  for (const footprint of [
    "0402",
    "soic8",
    "jstph2_0mm2",
    "res_p0.8656mm_pw0.5mm_ph0.6mm",
  ]) {
    const expected = signature(renderComponent(Footprinter3d, { footprint }))
    const built = signature(
      vanilla
        .getJscadModelForFootprint(footprint, jscad)
        .geometries.map(({ geom }: { geom: Solid }) => geom),
    )
    expect(expected.count).toBeGreaterThan(0)
    expect(built.count).toBe(expected.count)
    expect(built.bounds).toEqual(expected.bounds)
    expect(built.volume).toBeCloseTo(expected.volume, 8)
  }
  const unsupportedError =
    'Invalid footprint function, got "registryfixturemissing", from string "registryfixturemissing"'
  expect(() => Footprinter3d({ footprint: "registryfixturemissing" })).toThrow(
    unsupportedError,
  )
  expect(() =>
    vanilla.getJscadModelForFootprint("registryfixturemissing", jscad),
  ).toThrow(unsupportedError)
}
