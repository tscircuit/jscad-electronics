import * as jscadModeling from "@jscad/modeling"
import { expect, test } from "bun:test"
import { createJSCADRenderer } from "jscad-fiber"
import type { ReactElement } from "react"
import { FlexScreen, type FlexScreenOrientation } from "../lib/FlexScreen"
import { Footprinter3d } from "../lib/Footprinter3d"

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
      conductorCount={30}
      conductorPitch={0.5}
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
      conductorCount={30}
      conductorPitch={0.5}
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
        conductorCount={30}
        conductorPitch={0.5}
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
        conductorCount={1}
        conductorPitch={0.5}
        conductorWidth={8}
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
    expect(() => FlexScreen({ conductorCount: 1, conductorPitch })).toThrow(
      "conductorPitch must be greater than zero",
    )
  }
})
