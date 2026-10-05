import * as jscadModeling from "@jscad/modeling"
import { expect, test } from "bun:test"
import { createJSCADRenderer } from "jscad-fiber"
import type { ReactElement } from "react"
import { FlexScreen, type FlexScreenOrientation } from "../lib/FlexScreen"
import { Footprinter3d } from "../lib/Footprinter3d"
import { fp } from "@tscircuit/footprinter"
import { mp } from "@tscircuit/modelprinter"
import { mm } from "@tscircuit/mm"

const render = (element: ReactElement) => {
  const geometries: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as never)
  createJSCADRoot(geometries).render(element)
  return geometries
}

const bounds = (geometries: any[]) =>
  jscadModeling.measurements.measureAggregateBoundingBox(...geometries)

test("footprinter count and pitch widen the connector while retaining a narrow screen end", () => {
  const [minimum, maximum] = bounds(
    render(
      <Footprinter3d footprint="flexscreen30_w16_h10_flex5_p0.5mm_sitsflat_hidescreen_hidestiffeners_hideconductors" />,
    ),
  )
  // 29 intervals at 0.5 mm, 0.24 mm contact width, and two 0.6 mm margins.
  expect(maximum[0] - minimum[0]).toBeCloseTo(15.94)
  expect(maximum[1] - minimum[1]).toBeCloseTo(5.03)

  const geometries = render(
    <FlexScreen
      width={16}
      height={10}
      flexCableLength={5}
      pinCount={30}
      pitch={0.5}
      showScreen={false}
      showStiffeners={false}
      showConductors={false}
    />,
  )
  const vertices = geometries.flatMap((g) =>
    jscadModeling.geometries.geom3.toPolygons(g).flatMap((p) => p.vertices),
  )
  const screenEnd = vertices.filter((v) => v[1] > 4.99)
  expect(Math.max(...screenEnd.map((v) => v[0]))).toBeCloseTo(2.5)
  expect(Math.min(...screenEnd.map((v) => v[0]))).toBeCloseTo(-2.5)
  for (const geometry of geometries) {
    expect(jscadModeling.measurements.measureVolume(geometry)).toBeGreaterThan(
      0,
    )
  }
})

test("connector contacts keep exact pitch and screen contacts fit the narrow body", () => {
  const geometries = render(
    <FlexScreen
      width={16}
      height={10}
      flexCableLength={5}
      pinCount={30}
      pitch={0.5}
      showScreen={false}
      showStiffeners={false}
    />,
  )
  const contacts = geometries.filter((g) => {
    const [min, max] = bounds([g])
    return max[2] - min[2] < 0.04
  })
  expect(contacts).toHaveLength(60)
  const connector = contacts
    .filter((g) => bounds([g])[0][1] < 1)
    .sort((a, b) => bounds([a])[0][0] - bounds([b])[0][0])
  expect(connector).toHaveLength(30)
  for (let index = 1; index < connector.length; index++) {
    expect(
      bounds([connector[index]])[0][0] - bounds([connector[index - 1]])[0][0],
    ).toBeCloseTo(0.5)
  }
  const screen = contacts.filter((g) => bounds([g])[0][1] > 2)
  const [min, max] = bounds(screen)
  expect(min[0]).toBeGreaterThan(-1.9)
  expect(max[0]).toBeLessThan(1.9)
})

test("widening and stiffeners work across every flexscreen orientation", () => {
  for (const orientation of [
    "sitsFlat",
    "sitsFlatBelowBoard",
    "foldedToFaceAboveBoard",
    "foldedToFaceBelowBoard",
    "foldedToRightAngleAboveBoard",
    "foldedToRightAngleBelowBoard",
  ] satisfies FlexScreenOrientation[]) {
    const geometries = render(
      <FlexScreen
        width={16}
        height={10}
        flexCableLength={40}
        pinCount={30}
        pitch={0.5}
        orientation={orientation}
        showScreen={false}
      />,
    )
    const [min, max] = bounds(geometries)
    expect(max[0] - min[0]).toBeCloseTo(15.94)
    for (const geometry of geometries) {
      expect(
        jscadModeling.measurements.measureVolume(geometry),
      ).toBeGreaterThan(0)
    }
  }
})

test("omitting pitch preserves the original cable width", () => {
  const [min, max] = bounds(
    render(
      <FlexScreen
        width={16}
        height={10}
        flexCableLength={5}
        showScreen={false}
        showStiffeners={false}
      />,
    ),
  )
  expect(max[0] - min[0]).toBeCloseTo(5)
})

test("single contacts widen safely and invalid pitch is rejected", () => {
  const [min, max] = bounds(
    render(
      <FlexScreen
        pinCount={1}
        pitch={0.5}
        padWidth={8}
        flexCableWidth={5}
        showScreen={false}
      />,
    ),
  )
  expect(max[0] - min[0]).toBeCloseTo(9.2)
  for (const conductorPitch of [
    0,
    -0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    expect(() => FlexScreen({ pinCount: 1, pitch: conductorPitch })).toThrow(
      "pitch must be greater than zero",
    )
  }
})

test("flexscreen contact parameters match the corresponding FPC footprint", () => {
  const connector = fp
    .string("fpc30_p0.5mm_pw0.3mm_pl1.25mm")
    .json() as unknown as {
    num_pins: number
    p: number | string
    pw: number | string
    pl: number | string
  }
  const screen = mp.string("flexscreen30_p0.5mm_pw0.3mm_pl1.25mm").json()
  expect(screen).toMatchObject({
    pinCount: connector.num_pins,
    pitch: mm(connector.p),
    padWidth: mm(connector.pw),
    padLength: mm(connector.pl),
  })
  const contacts = render(
    <FlexScreen
      pinCount={30}
      pitch={0.5}
      padWidth={0.3}
      padLength={1.25}
      flexCableLength={10}
      showScreen={false}
      showStiffeners={false}
    />,
  ).filter((g) => bounds([g])[1][2] - bounds([g])[0][2] < 0.04)
  const connectorContacts = contacts.filter((g) => bounds([g])[0][1] < 1)
  expect(connectorContacts).toHaveLength(30)
  for (const contact of connectorContacts) {
    const [min, max] = bounds([contact])
    expect(max[0] - min[0]).toBeCloseTo(0.3)
    expect(max[1] - min[1]).toBeCloseTo(1.28)
  }
})

test("tail and taper lengths independently control the widened end", () => {
  for (const [tailLength, taperLength] of [
    [3, 2],
    [1, 3],
  ]) {
    const cable = render(
      <FlexScreen
        pinCount={30}
        pitch={0.5}
        padWidth={0.3}
        flexCableLength={10}
        flexCableWidth={5}
        tailLength={tailLength}
        taperLength={taperLength}
        showScreen={false}
        showStiffeners={false}
        showConductors={false}
      />,
    )
    expect(cable).toHaveLength(3)
    const [tailMin, tailMax] = bounds([cable[0]])
    expect(tailMax[0] - tailMin[0]).toBeCloseTo(16)
    expect(tailMax[1] - tailMin[1]).toBeCloseTo(tailLength! + 0.03)
    const [taperMin, taperMax] = bounds([cable[1]])
    expect(taperMin[1]).toBeCloseTo(tailLength! - 0.015)
    expect(taperMax[1]).toBeCloseTo(tailLength! + taperLength! + 0.015)
    const [bodyMin, bodyMax] = bounds([cable[2]])
    expect(bodyMax[0] - bodyMin[0]).toBeCloseTo(5)
    expect(bodyMin[1]).toBeCloseTo(tailLength! + taperLength! - 0.015)
  }
})

test("legacy contact props render the same geometry as FPC-style props", () => {
  const legacy = render(
    <FlexScreen
      conductorCount={30}
      conductorPitch={0.5}
      conductorWidth={0.3}
      exposedContactLength={1.25}
      showScreen={false}
    />,
  )
  const canonical = render(
    <FlexScreen
      pinCount={30}
      pitch={0.5}
      padWidth={0.3}
      padLength={1.25}
      showScreen={false}
    />,
  )
  expect(bounds(legacy)).toEqual(bounds(canonical))
  expect(
    legacy.map((g) => jscadModeling.measurements.measureVolume(g)),
  ).toEqual(canonical.map((g) => jscadModeling.measurements.measureVolume(g)))
  const preferred = render(
    <FlexScreen
      pinCount={30}
      pitch={0.5}
      padWidth={0.3}
      padLength={1.25}
      conductorCount={2}
      conductorPitch={3}
      conductorWidth={1}
      exposedContactLength={5}
      showScreen={false}
    />,
  )
  expect(bounds(preferred)).toEqual(bounds(canonical))
})

test("invalid tail and taper lengths are rejected", () => {
  for (const props of [
    { tailLength: 0 },
    { tailLength: -1 },
    { tailLength: NaN },
    { tailLength: 10 },
    { taperLength: 0 },
    { taperLength: Infinity },
    { tailLength: 8, taperLength: 3 },
  ]) {
    expect(() =>
      FlexScreen({ flexCableLength: 10, pinCount: 30, pitch: 0.5, ...props }),
    ).toThrow()
  }
})
